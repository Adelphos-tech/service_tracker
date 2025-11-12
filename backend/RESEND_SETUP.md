# Resend Email Setup Guide

## Step 1: Create Resend Account

1. Go to [https://resend.com/signup](https://resend.com/signup)
2. Sign up with your email (free account - no credit card required)
3. Verify your email address

## Step 2: Get Your API Key

1. After logging in, go to **API Keys** in the dashboard
2. Click **Create API Key**
3. Give it a name like "Equipment Tracker"
4. Select **Full Access** or **Sending Access**
5. Click **Create**
6. **Copy the API key** (it starts with `re_...`)
   - ⚠️ **Important**: Save this key immediately - you won't be able to see it again!

## Step 3: Configure Your Backend

1. Open your `.env` file in the backend folder
2. Replace the old email configuration with:

```env
# Resend Email Configuration
RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_FROM=QRtrX Equipment Tracker <onboarding@resend.dev>
```

**Note**: For the free tier, you must use `onboarding@resend.dev` as the sender email. To use your own domain email (like `noreply@yourdomain.com`), you need to verify your domain in Resend.

## Step 4: (Optional) Add Your Own Domain

If you want emails to come from your own domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records shown to your domain provider
5. Wait for verification (usually takes a few minutes)
6. Update `EMAIL_FROM` in `.env` to use your domain:
   ```env
   EMAIL_FROM=QRtrX Equipment Tracker <noreply@yourdomain.com>
   ```

## Step 5: Test Your Setup

Run the test script to verify everything works:

```bash
cd backend
node test-email.js
```

You should receive two test emails:
- Welcome email
- Service reminder email

## Step 6: Start the Scheduler

The scheduler sends automatic reminders for equipment service due within 7 days:

```bash
cd backend
npm run scheduler
```

This will:
- Check for equipment needing service daily at 9:00 AM
- Send reminder emails to equipment owners
- Run once immediately on startup for testing

## Troubleshooting

### Error: "Missing API key"
- Make sure `RESEND_API_KEY` is set in your `.env` file
- The key should start with `re_`

### Error: "Invalid sender email"
- For free tier, use `onboarding@resend.dev`
- For custom domain, verify your domain first in Resend dashboard

### Emails not sending
- Check your API key is correct
- Verify you haven't exceeded the free tier limit (3,000 emails/month, 100/day)
- Check the console logs for error messages

## Free Tier Limits

- **3,000 emails per month**
- **100 emails per day**
- **No credit card required**
- Perfect for small to medium deployments

## Production Deployment

When deploying to production (Railway, Heroku, etc.):

1. Add `RESEND_API_KEY` to your environment variables
2. Update `EMAIL_FROM` if using a custom domain
3. Update `FRONTEND_URL` to your production URL
4. Make sure the scheduler is running as a separate process

## Support

- Resend Documentation: https://resend.com/docs
- Resend Support: support@resend.com
