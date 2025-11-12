# Production Deployment Checklist

## Pre-Deployment Setup

### 1. Domain Verification (Required for Email Alerts)

Follow the guide in `backend/DOMAIN_VERIFICATION_GUIDE.md`

**Quick Steps:**
1. Add your domain to Resend dashboard
2. Add DNS records to your domain provider
3. Wait 10-30 minutes for DNS propagation
4. Verify domain in Resend
5. Update `EMAIL_FROM` to use your verified domain

---

### 2. Environment Variables

#### Backend (Railway/Heroku)

```env
# Database
MONGODB_URI=your_production_mongodb_uri

# JWT
JWT_SECRET=your_secure_random_secret_key_change_this
JWT_EXPIRE=7d

# Email (Resend)
RESEND_API_KEY=re_your_production_api_key
EMAIL_FROM=QRtrX Equipment Tracker <noreply@yourdomain.com>

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.netlify.app

# Environment
NODE_ENV=production
PORT=5000
```

#### Frontend (Netlify)

```env
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

---

### 3. Database Setup

**Option A: MongoDB Atlas (Recommended)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Add database user
4. Whitelist all IPs (0.0.0.0/0) for production
5. Get connection string
6. Update `MONGODB_URI` in backend environment

**Option B: Self-hosted MongoDB**
1. Set up MongoDB on your server
2. Configure authentication
3. Update connection string

---

## Backend Deployment (Railway)

### Initial Setup

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   cd backend
   railway init
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set MONGODB_URI="your_mongodb_uri"
   railway variables set JWT_SECRET="your_secret_key"
   railway variables set RESEND_API_KEY="re_your_key"
   railway variables set EMAIL_FROM="QRtrX Equipment Tracker <noreply@yourdomain.com>"
   railway variables set FRONTEND_URL="https://your-frontend.netlify.app"
   railway variables set NODE_ENV="production"
   ```

5. **Deploy**
   ```bash
   railway up
   ```

6. **Get Backend URL**
   ```bash
   railway domain
   ```
   Save this URL - you'll need it for frontend configuration

### Start Scheduler (Important!)

The scheduler needs to run as a separate service for email alerts:

**Option 1: Add to Railway (Recommended)**
1. In Railway dashboard, add a new service
2. Connect same GitHub repo
3. Set start command to: `npm run scheduler`
4. Use same environment variables

**Option 2: Use Cron Job Service**
- Use services like cron-job.org to hit an endpoint daily
- Create a `/api/check-reminders` endpoint that runs the check

---

## Frontend Deployment (Netlify)

### Initial Setup

1. **Build Frontend Locally (Test)**
   ```bash
   cd frontend
   npm run build
   ```

2. **Update API URL**
   - Create `.env.production` file:
   ```env
   VITE_API_URL=https://your-backend-url.up.railway.app/api
   ```

3. **Deploy to Netlify**
   
   **Option A: Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

   **Option B: GitHub Integration**
   1. Push code to GitHub
   2. Connect repository in Netlify dashboard
   3. Set build command: `npm run build`
   4. Set publish directory: `dist`
   5. Add environment variable: `VITE_API_URL`

4. **Configure Environment Variables in Netlify**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-backend-url.up.railway.app/api`

5. **Update Backend FRONTEND_URL**
   ```bash
   railway variables set FRONTEND_URL="https://your-site.netlify.app"
   ```

---

## Post-Deployment Configuration

### 1. Update CORS Settings

Ensure your backend allows requests from your frontend domain:

In `backend/server.js`, CORS is already configured to allow all origins:
```javascript
app.use(cors({
  origin: true,
  credentials: true
}));
```

### 2. Test Email Alerts

1. **Register a new user** with a real email
2. **Add equipment** with service date within 7 days
3. **Check Resend dashboard** for email logs
4. **Verify email delivery**

### 3. Monitor Scheduler

Check Railway logs to ensure scheduler is running:
```bash
railway logs
```

You should see:
```
Scheduler started. Service reminders will be checked daily at 9:00 AM
Running initial check now...
```

---

## Production URLs

After deployment, you'll have:

- **Frontend:** `https://your-app.netlify.app`
- **Backend API:** `https://your-backend.up.railway.app`
- **Scheduler:** Running on Railway (separate service)

---

## Testing Production

### 1. Test Registration
- Go to your frontend URL
- Register with a real email
- Check for welcome email

### 2. Test Equipment Management
- Add equipment
- Generate QR codes
- Scan QR codes
- Update equipment status

### 3. Test Email Alerts
- Add equipment with service date 5 days from now
- Wait for scheduler to run (9 AM daily, or trigger manually)
- Check email for service reminder

---

## Monitoring & Maintenance

### Check Email Delivery
- Resend Dashboard: https://resend.com/emails
- View sent emails, delivery status, opens, clicks

### Check Application Logs
```bash
# Backend logs
railway logs

# Frontend logs
netlify logs
```

### Monitor Database
- MongoDB Atlas Dashboard
- Check connection count, storage usage

### Update Application
```bash
# Backend
cd backend
git pull
railway up

# Frontend
cd frontend
git pull
netlify deploy --prod
```

---

## Troubleshooting

### Emails Not Sending

1. **Check domain verification**
   - Resend Dashboard → Domains → Should show "Verified"

2. **Check environment variables**
   ```bash
   railway variables
   ```
   - Verify `RESEND_API_KEY` is set
   - Verify `EMAIL_FROM` uses verified domain

3. **Check scheduler logs**
   ```bash
   railway logs --service scheduler
   ```

4. **Test manually**
   ```bash
   railway run node test-email.js
   ```

### Frontend Can't Connect to Backend

1. **Check CORS settings** in backend
2. **Verify API URL** in frontend environment variables
3. **Check backend is running**
   ```bash
   curl https://your-backend-url.up.railway.app/api/health
   ```

### Database Connection Issues

1. **Check MongoDB URI** is correct
2. **Verify IP whitelist** in MongoDB Atlas
3. **Check database user permissions**

---

## Security Checklist

- [ ] JWT_SECRET is a strong random string (not default)
- [ ] MongoDB has authentication enabled
- [ ] Environment variables are not committed to Git
- [ ] CORS is properly configured
- [ ] HTTPS is enabled (automatic on Railway/Netlify)
- [ ] API rate limiting is configured (if needed)
- [ ] Domain is verified for email sending

---

## Cost Estimation (Free Tier)

- **Railway:** Free tier (500 hours/month)
- **Netlify:** Free tier (100GB bandwidth/month)
- **MongoDB Atlas:** Free tier (512MB storage)
- **Resend:** Free tier (3,000 emails/month)

**Total: $0/month** for small to medium usage

---

## Scaling Considerations

When you outgrow free tiers:

- **Railway:** $5/month for hobby plan
- **MongoDB Atlas:** $9/month for M2 cluster
- **Resend:** $20/month for 50,000 emails
- **Netlify:** $19/month for pro features

---

## Support & Resources

- **Railway Docs:** https://docs.railway.app
- **Netlify Docs:** https://docs.netlify.com
- **Resend Docs:** https://resend.com/docs
- **MongoDB Atlas:** https://docs.atlas.mongodb.com

---

## Quick Deploy Commands

```bash
# Backend
cd backend
railway login
railway init
railway variables set MONGODB_URI="..." RESEND_API_KEY="..." EMAIL_FROM="..." FRONTEND_URL="..." JWT_SECRET="..."
railway up

# Frontend
cd frontend
netlify login
netlify init
netlify env:set VITE_API_URL "https://your-backend.up.railway.app/api"
netlify deploy --prod
```

Done! 🚀
