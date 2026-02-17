# Gmail & Google Workspace Setup Guide for Suksan Massage

This guide explains how to set up a Gmail account (either free `@gmail.com` or Google Workspace `info@suksan-massage.ch`) to send emails from your website securely.

## Option A: Using a Free Gmail Account (e.g., `suksan.massage@gmail.com`)

This is the easiest and free method.

1.  **Create Account:** Create a generic Gmail account (e.g., `suksan.massage.bern@gmail.com`).
2.  **Enable 2-Step Verification:**
    - Go to **Google Account** > **Security**.
    - Turn on **2-Step Verification**.
    - (Required for App Passwords).
3.  **Generate App Password:**
    - Go to **Google Account** > **Security**.
    - Search for "App passwords" (or look under 2-Step Verification).
    - Create a new app password.
    - **Name:** "Website Netlify".
    - **Result:** You will get a 16-character password (e.g., `abcd efgh ijkl mnop`). **Copy this.**

### Configuration for `.env` / Netlify:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=suksan.massage.bern@gmail.com
SMTP_PASS=abcd efgh ijkl mnop   # The 16-char App Password
MAIL2SMS_ADDRESS=0791234567@mailsms.ch
```

---

## Option B: Using Google Workspace (Professional `info@suksan-massage.ch`)

This looks more professional but costs money (~$6/month).

### 1. Set up Google Workspace

1.  Sign up at [workspace.google.com](https://workspace.google.com/).
2.  Verify your domain `suksan-massage.ch` (usually via simple DNS record).
3.  Create your user: `info@suksan-massage.ch`.

### 2. Configure DNS (MX Records)

You need to tell the internet to deliver email to Google.

1.  Log in to **Namecheap**.
2.  Go to **Domain List** > **Manage** > **Advanced DNS**.
3.  **Mail Settings:** Select **"Gmail"** (Namecheap often has a preset).
4.  If manual, add these **MX Records**:
    - Priority 1: `aspmx.l.google.com`
    - Priority 5: `alt1.aspmx.l.google.com`
    - Priority 5: `alt2.aspmx.l.google.com`
    - Priority 10: `alt3.aspmx.l.google.com`
    - Priority 10: `alt4.aspmx.l.google.com`

### 3. Authenticate the Website (SMTP Relay)

To allow the website to send emails _as_ `info@suksan-massage.ch` without going to spam:

**Step 3a: Turn on "Less Secure Apps" (Not Recommended) OR Use App Passwords (Recommended)**

- Follow the same steps as **Option A** (Enable 2FA -> Generate App Password).
- Use that App Password in your `.env`.

**Step 3b: SPF Record (Critical for avoiding Spam)**

- In Namecheap **Advanced DNS**, add a **TXT Record**:
  - Host: `@`
  - Value: `v=spf1 include:_spf.google.com ~all`
  - _(If you already have an SPF record, add `include:_spf.google.com` inside it)._

### Configuration for `.env` / Netlify:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=info@suksan-massage.ch
SMTP_PASS=abcd efgh ijkl mnop   # The 16-char App Password
MAIL2SMS_ADDRESS=0791234567@mailsms.ch
```

---

## Why use Gmail instead of Direct MX?

Netlify (and Vercel) **block Port 25**, which is required to communicate directly with `mailsms.ch`. Gmail uses **Port 465 (SSL)** or **587 (TLS)**, which are allowed.
