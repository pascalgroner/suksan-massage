
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const envVars = {
      SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
      SMTP_FROM_NAME: process.env.SMTP_FROM_NAME,
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      MAIL2SMS_ADDRESS: process.env.MAIL2SMS_ADDRESS,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
      ENABLE_CUSTOMER_CONFIRMATION: process.env.ENABLE_CUSTOMER_CONFIRMATION,
      SMS_GATEWAY_DOMAIN: process.env.SMS_GATEWAY_DOMAIN,
      DAILY_LIMIT: process.env.DAILY_LIMIT,
      ALERT_EMAIL: process.env.ALERT_EMAIL,
    };

    return NextResponse.json(envVars, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
