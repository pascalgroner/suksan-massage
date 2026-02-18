import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const COUNTER_FILE = path.join(process.cwd(), 'src', 'resources', 'counter.json');

const checkAndIncrementLimit = async (limit: number, alertEmail: string, transporter: any, smtpFrom: string) => {
    let data = { date: '', count: 0 };
    try {
        if (fs.existsSync(COUNTER_FILE)) {
            data = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf8'));
        }
    } catch (e) {
        // file might not exist yet or be corrupt
    }

    const today = new Date().toISOString().split('T')[0];

    if (data.date !== today) {
        data.date = today;
        data.count = 0;
    }

    if (data.count >= limit) {
        // Send alert only once when hitting the limit exactly (to avoid spamming)
        if (data.count === limit) {
             try {
                await transporter.sendMail({
                    from: smtpFrom,
                    to: alertEmail,
                    subject: `ALERT: Daily Submission Limit Reached (${limit})`,
                    text: `The daily limit of ${limit} submissions for Suksan Massage has been reached for date ${today}. Check the admin panel or logs.`
                });
             } catch (e) {
                 console.error("Failed to send alert email", e);
             }
             // Increment once more to mark as 'alerted'
             data.count++;
             fs.writeFileSync(COUNTER_FILE, JSON.stringify(data));
        }
        return false;
    }

    data.count++;
    
    try {
        fs.writeFileSync(COUNTER_FILE, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to write counter file", e);
    }
    
    return true;
};

export async function POST(request: Request) {
  try {
    const { name, phone, service, message, date, timeRange, specificTime, duration, locale } = await request.json();

    // 1. Validation - Name and Phone are required
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: Name, Phone' },
        { status: 400 }
      );
    }

    // Helper maps
    const serviceMapDE: Record<string, string> = {
      thai: "Traditionelle Thai Massage",
      oil: "Öl und Relax Massage",
      foot: "Fussreflex Massage",
      back: "Rücken- & Nackenmassage",
      other: "Andere Anfrage"
    };
    
    const serviceMapEN: Record<string, string> = {
      thai: "Traditional Thai Massage",
      oil: "Oil and Relax Massage",
      foot: "Foot Reflexology Massage",
      back: "Back & Neck Massage",
      other: "Other Inquiry"
    };

    const timeRangeMapDE: Record<string, string> = {
        morning: "Morgens ab 9:00",
        lunch: "Über den Mittag",
        afternoon: "Nachmittags ab 13:30",
        evening: "Abends ab 18:00",
        exactTime: "Genaue Zeit"
    };

    const fullServiceDescriptionDE = serviceMapDE[service] || service || 'Allgemein';
    const displayTimeRangeDE = timeRangeMapDE[timeRange] || timeRange;

    // 0. Check Daily Limit
    const dailyLimit = Number(process.env.DAILY_LIMIT) || 20;
    const alertEmail = process.env.ALERT_EMAIL || 'pg@pve.ch';
    
    // 2. Configuration & Transporter Setup
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFromEmail = process.env.SMTP_FROM_EMAIL || smtpUser; // Default to user if not set
    const smtpFromName = process.env.SMTP_FROM_NAME || "Suksan Massage Website";

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error("Missing SMTP Configuration");
       return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const allowed = await checkAndIncrementLimit(dailyLimit, alertEmail, transporter, `"${smtpFromName}" <${smtpFromEmail}>`);
    if (!allowed) {
        return NextResponse.json(
            { error: 'Daily request limit reached. Please contact us by phone.' },
            { status: 429 }
        );
    }

    // 3. Determine SMS Target Address
    let smsTarget = process.env.MAIL2SMS_ADDRESS;
    if (!smsTarget) {
      throw new Error('MAIL2SMS_ADDRESS environment variable is not set');
    }
    
    // 4. Construct SMS Content (Template) - ALWAYS GERMAN for Shop Owner
    let smsContent = `Name: ${name}
Telefon: ${phone}
Behandlung: ${fullServiceDescriptionDE}`;

    if (date) smsContent += `\nDatum: ${date}`;
    if (duration) smsContent += `\nDauer: ${duration} min`;
    if (timeRange && timeRange !== 'exactTime') smsContent += `\nZeitbereich: ${displayTimeRangeDE}`;
    if (specificTime && specificTime !== 'anytime') smsContent += `\nZeit: ${specificTime}`;
    // If specificTime is 'anytime', it means "Im Zeitbereich" logic handled by TimeRange title usually
    if (message) smsContent += `\nNachricht: ${message}`;

    const mailOptionsToOwner = {
      from: `"${smtpFromName}" <${smtpFromEmail}>`,
      to: smsTarget,
      subject: `Anfrage: ${fullServiceDescriptionDE}`, // Enhanced subject
      text: smsContent,
    };
    
    // 5. Send to Shop Owner
    await transporter.sendMail(mailOptionsToOwner);
    console.log('Notification sent to shop owner.');

    // 6. Optional: Send Confirmation to Customer
    if (process.env.ENABLE_CUSTOMER_CONFIRMATION === 'true') {
        const gatewayDomain = process.env.SMS_GATEWAY_DOMAIN || 'sms.mail2sms.ch';
        let targetPhone = phone.replace(/\s+/g, '');
        if (targetPhone.startsWith('+41')) {
            targetPhone = '0' + targetPhone.substring(3);
        } else if (targetPhone.startsWith('0041')) {
            targetPhone = '0' + targetPhone.substring(4);
        }
        
        const customerSmsEmail = `${targetPhone}@${gatewayDomain}`;
        
        const useLocale = locale || 'de';
        let customerMsg = '';
        let subject = "Confirmation";

        if (useLocale === 'de') {
            subject = "Ihre Anfrage bei Suksan Massage";
            customerMsg = `Guten Tag ${name}, danke für Ihre Anfrage für ${fullServiceDescriptionDE}. Wir werden Ihren Termin in Kürze bestätigen. Suksan Massage`;
        } else {
            const fullServiceDescriptionEN = serviceMapEN[service] || service || 'Service';
            subject = "Your request at Suksan Massage";
            customerMsg = `Dear ${name}, thank you for your request for ${fullServiceDescriptionEN}. We will confirm your appointment shortly. Suksan Massage`;
        }
        
        try {
            await transporter.sendMail({
                from: `"${smtpFromName}" <${smtpFromEmail}>`,
                to: customerSmsEmail,
                subject: subject,
                text: customerMsg
            });
             console.log('Confirmation sent to customer.');
        } catch (e) {
            console.error("Failed to send customer confirmation", e);
        }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/contact:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
