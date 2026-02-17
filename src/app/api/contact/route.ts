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
    const { name, phone, service, message, date, timeRange, specificTime, duration } = await request.json();

    // 1. Validation - Name and Phone are required
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: Name, Phone' },
        { status: 400 }
      );
    }

    // Helper to map service codes to full descriptions
    const serviceMap: Record<string, string> = {
      thai: "Traditional Thai Massage",
      oil: "Oil and Relax Massage",
      foot: "Foot Reflexology Massage",
      back: "Back & Neck Massage",
      other: "Other Inquiry"
    };

    const fullServiceDescription = serviceMap[service] || service || 'General';

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
    
    // 4. Construct SMS Content (Template)
    let smsContent = `Name: ${name}
Phone: ${phone}
Service: ${fullServiceDescription}`;

    if (date) smsContent += `\nDate: ${date}`;
    if (duration) smsContent += `\nDuration: ${duration} min`;
    if (timeRange) smsContent += `\nTime of Day: ${timeRange}`;
    if (specificTime) smsContent += `\nDesired Time: ${specificTime}`;
    if (message) smsContent += `\nMsg: ${message}`;

    const mailOptionsToOwner = {
      from: `"${smtpFromName}" <${smtpFromEmail}>`,
      to: smsTarget,
      subject: `Appointment Request`,
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
        
        const customerMsg = `Dear ${name}, thank you for your request for ${fullServiceDescription}. We will confirm your appointment shortly. Suksan Massage`;
        
        try {
            await transporter.sendMail({
                from: `"${smtpFromName}" <${smtpFromEmail}>`,
                to: customerSmsEmail,
                subject: "Confirmation",
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
