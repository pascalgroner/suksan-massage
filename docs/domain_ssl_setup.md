# Domain & SSL Setup Guide for Suksan Massage

This guide explains how to configure your domain (`suksan-massage.com`) to point to Netlify and automatically activate the free SSL (HTTPS) certificate.

## 1. Understanding Netlify SSL

Netlify provides **Automatic SSL** via Let's Encrypt.

- **Cost:** Free ($0).
- **Renewal:** Automatic (you never have to renew manually).
- **Requirement:** Your domain's DNS must point to Netlify.

## 2. Configure Namecheap (DNS)

Since you registered your domain with Namecheap, you need to update its **Nameservers** to delegate control to Netlify.

1.  **Log in to Namecheap:** Go to [Namecheap Dashboard](https://www.namecheap.com/myaccount/login/).
2.  **Select Domain:** Find `suksan-massage.com` and click **"Manage"**.
3.  **Find Nameservers:** Look for the "Nameservers" section (usually set to "Namecheap BasicDNS").
4.  **Change to Custom DNS:** Select **"Custom DNS"** from the dropdown menu.
5.  **Enter Netlify Nameservers:**
    Copy and paste the following 4 nameservers (lines) into the fields. _Note: If Netlify provided different ones in your dashboard, use those. Standard ones are typically:_
    - `dns1.p01.nsone.net`
    - `dns2.p01.nsone.net`
    - `dns3.p01.nsone.net`
    - `dns4.p01.nsone.net`
6.  **Save:** Click the small green checkmark or "Save" button.

## 3. Verify SSL Status in Netlify

Once you've updated Namecheap:

1.  **Wait:** DNS propagation takes 1-24 hours (usually < 1 hour).
2.  **Check Netlify:** Go to [Netlify Site Settings > Domain Management](https://app.netlify.com/sites/suksan-massage/settings/domain).
3.  **HTTPS Section:** Scroll down to "HTTPS".
    - **Status:** It should say "Waiting on DNS propagation" or "Verifying".
    - **Action:** You can click **"Verify DNS configuration"** to force a check.
4.  **Success:** Once verified, it will say **"Netlify DNS"** and the SSL certificate will be created automatically. Your site will respond to `https://suksan-massage.com`.

## 4. Redirecting www

Netlify automatically redirects `www.suksan-massage.com` to `suksan-massage.com` (or vice versa, depending on your primary domain setting). No extra setup is needed.

## Troubleshooting

- **"Not Secure" Warning:** If you see this immediately after changing DNS, wait 1 hour. The certificate needs time to issue.
- **DNS Issues:** You can check propagation at [whatsmydns.net](https://www.whatsmydns.net/#NS/suksan-massage.com).
