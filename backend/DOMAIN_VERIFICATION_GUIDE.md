# Production Domain Verification Guide for Resend

## Overview

To send emails to any user (not just your test email), you need to verify your domain with Resend. This is a one-time setup that takes about 10-15 minutes.

## Prerequisites

- A domain name you own (e.g., `yourdomain.com`, `yourcompany.com`)
- Access to your domain's DNS settings (usually through your domain registrar like GoDaddy, Namecheap, Cloudflare, etc.)
- Your Resend account

---

## Step 1: Add Your Domain to Resend

1. **Log in to Resend Dashboard**
   - Go to https://resend.com/login
   - Sign in with your account

2. **Navigate to Domains**
   - Click on **"Domains"** in the left sidebar
   - Click **"Add Domain"** button

3. **Enter Your Domain**
   - Enter your domain name (e.g., `yourdomain.com`)
   - Click **"Add"**

---

## Step 2: Get DNS Records

After adding your domain, Resend will show you DNS records that need to be added. You'll typically see:

### Required DNS Records:

1. **SPF Record** (TXT)
   ```
   Type: TXT
   Name: @ (or your domain)
   Value: v=spf1 include:_spf.resend.com ~all
   ```

2. **DKIM Record** (TXT)
   ```
   Type: TXT
   Name: resend._domainkey
   Value: [Resend will provide this - it's a long string]
   ```

3. **DMARC Record** (TXT) - Optional but recommended
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
   ```

---

## Step 3: Add DNS Records to Your Domain

### For Cloudflare:
1. Log in to Cloudflare
2. Select your domain
3. Go to **DNS** → **Records**
4. Click **"Add record"**
5. Add each record from Step 2:
   - Type: TXT
   - Name: (as shown in Resend)
   - Content: (copy from Resend)
   - TTL: Auto
   - Proxy status: DNS only (gray cloud)
6. Click **"Save"**

### For GoDaddy:
1. Log in to GoDaddy
2. Go to **My Products** → **DNS**
3. Click **"Add"** under DNS Records
4. Select **TXT** as record type
5. Add each record from Step 2
6. Click **"Save"**

### For Namecheap:
1. Log in to Namecheap
2. Go to **Domain List** → Select your domain
3. Go to **Advanced DNS**
4. Click **"Add New Record"**
5. Select **TXT Record**
6. Add each record from Step 2
7. Click **"Save"**

### For Other Providers:
- Look for "DNS Management", "DNS Settings", or "Advanced DNS"
- Add TXT records as shown in Resend dashboard

---

## Step 4: Verify Domain in Resend

1. **Wait for DNS Propagation**
   - DNS changes can take 5 minutes to 48 hours
   - Usually takes 10-30 minutes

2. **Check DNS Propagation** (Optional)
   - Go to https://dnschecker.org
   - Enter your domain
   - Select "TXT" record type
   - Check if records are visible globally

3. **Verify in Resend**
   - Go back to Resend Dashboard → Domains
   - Click **"Verify"** next to your domain
   - If successful, status will change to "Verified" ✅

---

## Step 5: Update Your Application

Once your domain is verified, update your `.env` file:

```env
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=QRtrX Equipment Tracker <noreply@yourdomain.com>

# Or use a subdomain
EMAIL_FROM=QRtrX Equipment Tracker <alerts@yourdomain.com>
```

**Common email addresses to use:**
- `noreply@yourdomain.com`
- `alerts@yourdomain.com`
- `notifications@yourdomain.com`
- `equipment@yourdomain.com`

---

## Step 6: Test Production Emails

1. **Update .env file** with your verified domain email
2. **Restart your backend server**
3. **Run test script:**
   ```bash
   cd backend
   node test-email.js
   ```
4. **Update test email** in `test-email.js` to any email address
5. **Verify emails are delivered** to any recipient

---

## Step 7: Deploy to Production

### Update Production Environment Variables:

**For Railway:**
```bash
railway variables set RESEND_API_KEY=re_your_key_here
railway variables set EMAIL_FROM="QRtrX Equipment Tracker <noreply@yourdomain.com>"
railway variables set FRONTEND_URL=https://your-frontend-url.netlify.app
```

**For Heroku:**
```bash
heroku config:set RESEND_API_KEY=re_your_key_here
heroku config:set EMAIL_FROM="QRtrX Equipment Tracker <noreply@yourdomain.com>"
heroku config:set FRONTEND_URL=https://your-frontend-url.netlify.app
```

**For Netlify Functions / Vercel:**
- Add environment variables in the dashboard
- Redeploy your application

---

## Troubleshooting

### Domain Not Verifying?

1. **Check DNS Records**
   - Use https://dnschecker.org to verify records are propagated
   - Ensure there are no typos in the TXT record values
   - Make sure you copied the entire value (DKIM records are very long)

2. **Wait Longer**
   - DNS can take up to 48 hours to propagate globally
   - Try verifying again after a few hours

3. **Check for Conflicts**
   - Remove any existing SPF/DKIM records for the same domain
   - Only one SPF record is allowed per domain

4. **Contact Support**
   - Resend support: support@resend.com
   - They're very responsive and helpful

### Emails Not Sending?

1. **Check API Key**
   - Ensure `RESEND_API_KEY` is correct in production
   - Key should start with `re_`

2. **Check FROM Address**
   - Must use your verified domain
   - Format: `Name <email@yourdomain.com>`

3. **Check Logs**
   - Look for error messages in your server logs
   - Common issues: wrong domain, unverified domain, rate limits

---

## DNS Record Examples

### Example for domain: `qrtrx.com`

```
# SPF Record
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

# DKIM Record
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC... (long string from Resend)

# DMARC Record (Optional)
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@qrtrx.com
```

Then use in `.env`:
```env
EMAIL_FROM=QRtrX Equipment Tracker <alerts@qrtrx.com>
```

---

## Alternative: Use a Subdomain

If you don't want to affect your main domain's email, use a subdomain:

1. **Add subdomain to Resend:** `mail.yourdomain.com`
2. **Add DNS records** with subdomain prefix
3. **Use in .env:**
   ```env
   EMAIL_FROM=QRtrX Equipment Tracker <noreply@mail.yourdomain.com>
   ```

---

## Benefits of Domain Verification

✅ **Send to ANY email address** (not just your test email)
✅ **Better deliverability** (emails less likely to go to spam)
✅ **Professional branding** (emails from your domain)
✅ **Higher trust** (verified sender)
✅ **Production ready** (no limitations)

---

## Quick Checklist

- [ ] Domain added to Resend
- [ ] DNS records copied from Resend
- [ ] DNS records added to domain provider
- [ ] Waited for DNS propagation (10-30 minutes)
- [ ] Domain verified in Resend (green checkmark)
- [ ] `.env` updated with verified domain email
- [ ] Test email sent successfully
- [ ] Production environment variables updated
- [ ] Application redeployed

---

## Need Help?

- **Resend Documentation:** https://resend.com/docs/dashboard/domains/introduction
- **Resend Support:** support@resend.com
- **DNS Checker:** https://dnschecker.org
- **MX Toolbox:** https://mxtoolbox.com/SuperTool.aspx

---

## Next Steps After Verification

1. ✅ Update production `.env` with verified domain
2. ✅ Deploy to production (Railway/Heroku)
3. ✅ Start scheduler in production
4. ✅ Test with real users
5. ✅ Monitor email delivery in Resend dashboard
