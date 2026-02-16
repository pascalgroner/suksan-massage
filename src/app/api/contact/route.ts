import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

export async function POST(request: Request) {
  try {
    const { name, email, phone, service, message } = await request.json();

    // 1. Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const mail2smsAddress = process.env.MAIL2SMS_ADDRESS;
    if (!mail2smsAddress) {
      throw new Error('MAIL2SMS_ADDRESS environment variable is not set');
    }

    // 2. Configure Transporter
    // Priority: 
    // A. Use SMTP_HOST if defined (Standard SMTP)
    // B. Fallback to Direct MX Delivery (Port 25 to recipient's MX)
    
    let transporter;

    if (process.env.SMTP_HOST) {
      console.log('Using configured SMTP Server:', process.env.SMTP_HOST);
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false, 
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: { 
          ciphers: "SSLv3",
          rejectUnauthorized: false
        }
      });
    } else {
      console.log('No SMTP_HOST defined. Attempting Direct MX Delivery...');
      
      // Determine the domain to look up MX records for
      const domain = mail2smsAddress.split('@')[1];
      if (!domain) {
        throw new Error('Invalid MAIL2SMS_ADDRESS format');
      }

      // Resolve MX records manually for better logging/control (optional but good for debugging)
      try {
        const mxRecords = await resolveMx(domain);
        if (!mxRecords || mxRecords.length === 0) {
          throw new Error(`No MX records found for domain: ${domain}`);
        }
        // Sort by priority
        mxRecords.sort((a, b) => a.priority - b.priority);
        console.log(`Resolved MX records for ${domain}:`, mxRecords);
        // Nodemailer 'direct: true' handles the connection logic, but knowing MX exists helps.
      } catch (dnsError) {
        console.warn(`DNS lookup warning for ${domain}:`, dnsError);
        // Proceed anyway, let nodemailer try
      }

      transporter = nodemailer.createTransport({
        name: 'suksan-massage.ch', // Hostname to use in HELO
        direct: true, // Tell nodemailer to route directly to MX
        logger: true, // Log to console for debugging
        debug: true   // Log SMTP traffic
      } as any);
    }

    // 3. Email Content (Optimized for SMS)
    const subject = `Inquiry: ${service || 'General'}`;
    
    // Concise text body for SMS
    const textContent = `New Request:
Name: ${name}
Svc: ${service || 'General'}
Msg: ${message}
Phone: ${phone || 'N/A'}
Ref: ${email}`;

    const mailOptions = {
      from: `website@suksan-massage.ch`, // Sender address (Must be valid SPF if direct sending)
      to: mail2smsAddress,
      replyTo: email,
      subject: subject,
      text: textContent,
    };

    if (!transporter) {
       throw new Error('Email transporter configuration failed');
    }

    // 4. Send Email
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    if (!process.env.SMTP_HOST && info.accepted.length === 0) {
       // Start of fallback logic if direct send was attempted but no recipients accepted
       console.warn('Direct send reported no accepted recipients. This might be due to Port 25 blocking.');
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/contact:', error);
    
    // Check for specific Direct Send errors common in cloud environments
    if (!process.env.SMTP_HOST && (error as any).code === 'ETIMEDOUT') {
       return NextResponse.json(
        { error: 'Direct MX delivery failed (Timeout). Your hosting provider likely blocks Port 25.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
