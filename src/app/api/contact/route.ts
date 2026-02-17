import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, phone, service, message } = await request.json();

    // 1. Validation - Name and Phone are required
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: Name, Phone, Message' },
        { status: 400 }
      );
    }

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

    // 3. Determine SMS Target Address
    let smsTarget = process.env.MAIL2SMS_ADDRESS;
    if (!smsTarget) {
      throw new Error('MAIL2SMS_ADDRESS environment variable is not set');
    }
    
    // 4. Construct SMS Content (Template)
    const smsContent = `New Request
Name: ${name}
Phone: ${phone}
Service: ${service || 'General'}
Msg: ${message}`;

    const mailOptionsToOwner = {
      from: `"${smtpFromName}" <${smtpFromEmail}>`,
      to: smsTarget,
      subject: `New Request from ${name}`,
      text: smsContent,
    };

    // 5. Send to Shop Owner (via SMS Gateway)
    await transporter.sendMail(mailOptionsToOwner);
    console.log('Notification sent to shop owner.');

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/contact:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
