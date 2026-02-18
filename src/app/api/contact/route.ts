import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';


import { Redis } from '@upstash/redis';

// Initialize Redis client if environment variables are available
let redis: Redis | null = null;
try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        redis = Redis.fromEnv();
    }
} catch (e) {
    console.warn("Redis configuration missing or invalid. Falling back to no-limit mode.");
}

const checkAndIncrementLimit = async (limit: number, alertEmail: string, transporter: any, smtpFrom: string) => {
    // If Redis is not configured, we cannot enforce limits persistently on Vercel.
    // In this case, we allow the request to proceed (fail-open) to avoid breaking the contact form.
    if (!redis) {
        console.warn("DAILY_LIMIT_WARNING: Redis is not configured. Daily limit check skipped.");
        return true; 
    }

    const today = new Date().toISOString().split('T')[0];
    const key = `contact-form:daily-count:${today}`;

    try {
        // Increment the counter for today
        const count = await redis.incr(key);
        
        // Set expiry for the key (e.g., 24 hours + buffer to ensure it cleans up)
        if (count === 1) {
            await redis.expire(key, 86400); 
        }

        if (count > limit) {
             // Limit exceeded
             // Check if we should send an alert (only on the first exceedance or periodically?)
             // Simple logic: if count is exactly limit + 1, we know we just exceeded it. 
             // Or if count == limit, we are AT limit. 
             // The requirement was: "Send alert only once when hitting the limit exactly".
             // So:
             if (count === limit + 1) {
                  try {
                    await transporter.sendMail({
                        from: smtpFrom,
                        to: alertEmail,
                        subject: `ALERT: Daily Submission Limit Reached (${limit})`,
                        text: `The daily limit of ${limit} submissions for Suksan Massage has been reached for date ${today}. Future requests today will be blocked.`
                    });
                 } catch (e) {
                     console.error("Failed to send alert email", e);
                 }
             }
             return false;
        }

        return true;

    } catch (error) {
        console.error("Redis error:", error);
        // If Redis fails, fail-open to allow the request
        return true;
    }
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

    const timeRangeMapEN: Record<string, string> = {
        morning: "Morning from 9:00",
        lunch: "Around Lunch",
        afternoon: "Afternoon from 13:30",
        evening: "Evening from 18:00",
        exactTime: "Specific Time"
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
    try {
        const info = await transporter.sendMail(mailOptionsToOwner);
        if (info.rejected.length > 0) {
            console.error("Email rejected by SMTP server:", info.rejected);
            throw new Error("Email rejected by SMTP server");
        }
        console.log('Notification sent to shop owner.');
    } catch (err) {
        console.error("Failed to send email to shop owner:", err);
        return NextResponse.json(
            { error: 'Server error: Failed to deliver message. Please try again later or call us directly.' },
            { status: 500 }
        );
    }

    // 6. Optional: Send Confirmation to Customer
    if (process.env.ENABLE_CUSTOMER_CONFIRMATION === 'true') {
        // ... (rest of confirmation logic)
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
        let subject = "Request Appointment";

        if (useLocale === 'de') {
            subject = "Anfrage Termin";
            
            let timeStrDE = specificTime;
            if (!timeStrDE || timeStrDE === 'anytime') {
                timeStrDE = timeRangeMapDE[timeRange] || timeRange;
            }

            customerMsg = `Guten Tag ${name}, danke für Ihre Anfrage für ${fullServiceDescriptionDE}. Wir werden Ihren Termin in Kürze bestätigen.\n\nBitte beachten Sie, dass Sie ca. 5 Minuten vor der gewünschten Zeit (${timeStrDE} ${date}) eintreffen sollten.\n\nSuksan Massage`;
        } else {
            const fullServiceDescriptionEN = serviceMapEN[service] || service || 'Service';
            subject = "Request Appointment";

            let timeStrEN = specificTime;
            if (!timeStrEN || timeStrEN === 'anytime') {
                timeStrEN = timeRangeMapEN[timeRange] || timeRange;
            }

            customerMsg = `Dear ${name}, thank you for your request for ${fullServiceDescriptionEN}. We will confirm your appointment shortly.\n\nPlease be aware to arrive about 5 minutes prior the requested time (${timeStrEN} ${date}).\n\nSuksan Massage`;
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
            console.error("Failed to send customer confirmation (non-critical)", e);
            // We do NOT fail the request here, just log it.
        }
    }

    return NextResponse.json({ success: true, message: "Message sent successfully" }, { status: 200 });

  } catch (error) {
    console.error('Unexpected Error in /api/contact:', error);
    return NextResponse.json(
      { error: 'Internal Server Error. Please contact us by phone.' },
      { status: 500 }
    );
  }
}
