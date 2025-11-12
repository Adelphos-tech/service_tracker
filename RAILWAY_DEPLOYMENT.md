# 🚂 Railway Deployment Guide

## Quick Deployment to Railway

Railway will automatically detect and deploy both your frontend and backend!

---

## 📋 Step-by-Step Deployment

### Step 1: Login to Railway

1. Go to: **https://railway.app**
2. Click **"Login"**
3. Sign in with your **GitHub account**

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: **`Adelphos-tech/service_tracker`**
4. Railway will automatically detect:
   - ✅ Backend (Node.js)
   - ✅ Frontend (Vite/React)

### Step 3: Add MongoDB Database

1. In your project dashboard, click **"New"**
2. Select **"Database"**
3. Choose **"Add MongoDB"**
4. Railway will automatically:
   - Create a MongoDB instance
   - Generate connection string
   - Add `MONGO_URL` variable

### Step 4: Configure Backend Environment Variables

1. Click on your **backend service**
2. Go to **"Variables"** tab
3. Add these variables:

```env
PORT=5000
MONGODB_URI=${{MongoDB.MONGO_URL}}
JWT_SECRET=your_super_secure_random_string_change_this_in_production
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=Equipment Tracker <your-email@gmail.com>
FRONTEND_URL=${{frontend.url}}
NODE_ENV=production
```

**Note:** Railway automatically provides:
- `${{MongoDB.MONGO_URL}}` - Your MongoDB connection string
- `${{frontend.url}}` - Your frontend URL

### Step 5: Configure Frontend Environment Variables

1. Click on your **frontend service**
2. Go to **"Variables"** tab
3. Add this variable:

```env
VITE_API_URL=${{backend.url}}
```

**Note:** `${{backend.url}}` automatically references your backend URL

### Step 6: Configure Build Settings

#### Backend Service:
1. Click on backend service
2. Go to **"Settings"**
3. Set:
   ```
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

#### Frontend Service:
1. Click on frontend service
2. Go to **"Settings"**
3. Set:
   ```
   Root Directory: frontend
   Build Command: npm install && npm run build
   Start Command: npm run preview
   ```

### Step 7: Deploy!

1. Railway will automatically start deploying
2. Wait for both services to build (2-5 minutes)
3. Once deployed, you'll see:
   - ✅ Backend: `https://your-backend.railway.app`
   - ✅ Frontend: `https://your-frontend.railway.app`
   - ✅ MongoDB: Connected automatically

### Step 8: Get Your URLs

1. Click on **frontend service**
2. Go to **"Settings"** → **"Domains"**
3. You'll see your public URL
4. Click to open your app! 🎉

---

## 🔧 Gmail App Password Setup

For email notifications to work:

1. Go to: **https://myaccount.google.com**
2. Click **"Security"**
3. Enable **"2-Step Verification"**
4. Go back to Security
5. Click **"App passwords"**
6. Select **"Mail"** and **"Other (Custom name)"**
7. Name it: **"Equipment Tracker"**
8. Click **"Generate"**
9. Copy the 16-character password
10. Use it as `EMAIL_PASSWORD` in Railway

---

## 📊 Railway Features You Get

✅ **Automatic Deployments** - Push to GitHub = Auto deploy  
✅ **Free $5/month credit** - Enough for small projects  
✅ **HTTPS by default** - Secure connections  
✅ **Environment variables** - Secure config  
✅ **MongoDB included** - No external setup needed  
✅ **Logs & Metrics** - Monitor your app  
✅ **Custom domains** - Add your own domain  
✅ **Zero downtime** - Smooth deployments  

---

## 💰 Pricing

- **Free Trial**: $5 credit/month
- **Hobby Plan**: $5/month (after trial)
- **Pro Plan**: $20/month (for production)

Your app should fit in the free tier initially!

---

## 🔄 Continuous Deployment

Once set up, every time you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Railway will automatically:
1. ✅ Pull latest code
2. ✅ Build backend
3. ✅ Build frontend
4. ✅ Deploy both
5. ✅ Zero downtime

---

## 🐛 Troubleshooting

### Backend Won't Start

**Check:**
1. Build logs in Railway dashboard
2. Verify `MONGODB_URI` is set correctly
3. Check `package.json` has `"start": "node server.js"`

**Fix:**
```bash
# In backend/package.json, ensure:
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Frontend Can't Connect to Backend

**Check:**
1. `VITE_API_URL` is set to backend URL
2. Backend CORS allows frontend URL
3. Both services are deployed

**Fix:**
- Update `VITE_API_URL` to: `${{backend.url}}/api`

### MongoDB Connection Failed

**Check:**
1. MongoDB service is running
2. `MONGODB_URI` variable is set
3. Connection string format is correct

**Fix:**
- Use Railway's auto-generated `${{MongoDB.MONGO_URL}}`

### Email Not Sending

**Check:**
1. Gmail App Password (not regular password)
2. 2FA enabled on Gmail
3. All EMAIL_* variables set correctly

**Fix:**
- Generate new App Password
- Update `EMAIL_PASSWORD` in Railway

---

## 📱 Testing Your Deployed App

Once deployed:

1. **Open your frontend URL**
2. **Register a new account**
3. **Add equipment**
4. **Generate QR code**
5. **Test QR scanning**
6. **Set service date** (5-7 days from now)
7. **Check email notifications** (run scheduler)

---

## 🔐 Security Checklist

Before going live:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use Gmail App Password (not regular password)
- [ ] Verify CORS settings in backend
- [ ] Check all environment variables are set
- [ ] Test all features on deployed app
- [ ] Set up custom domain (optional)
- [ ] Enable Railway's built-in monitoring

---

## 🚀 Advanced: Custom Domain

1. In Railway, go to **frontend service**
2. Click **"Settings"** → **"Domains"**
3. Click **"Add Domain"**
4. Enter your domain: `equipment-tracker.yourdomain.com`
5. Add CNAME record in your DNS:
   ```
   CNAME: equipment-tracker
   Value: <railway-provided-url>
   ```
6. Wait for DNS propagation (5-30 minutes)
7. Your app is live on your domain! 🎉

---

## 📊 Monitoring Your App

Railway provides:

1. **Logs**: Real-time application logs
2. **Metrics**: CPU, Memory, Network usage
3. **Deployments**: History of all deployments
4. **Health Checks**: Automatic monitoring

Access from Railway dashboard → Your service → Metrics/Logs

---

## 🔄 Updating Your App

### Make Changes Locally

```bash
# Make your changes
cd "/Users/shivang/Desktop/Equiments tracker"

# Test locally
cd backend && npm run dev
cd frontend && npm run dev

# Commit and push
git add .
git commit -m "Add new feature"
git push origin main
```

Railway automatically deploys! ✅

---

## 💡 Pro Tips

1. **Use Railway CLI** for faster deployments:
   ```bash
   npm i -g @railway/cli
   railway login
   railway up
   ```

2. **Check logs** if something breaks:
   - Railway Dashboard → Service → Logs

3. **Monitor costs** in Railway dashboard:
   - Dashboard → Usage

4. **Set up alerts** for downtime:
   - Railway Dashboard → Settings → Notifications

5. **Use staging environment**:
   - Create separate Railway project for testing

---

## ✅ Deployment Checklist

- [ ] Railway account created
- [ ] GitHub repo connected
- [ ] MongoDB added
- [ ] Backend environment variables set
- [ ] Frontend environment variables set
- [ ] Gmail App Password configured
- [ ] Both services deployed successfully
- [ ] Frontend URL accessible
- [ ] Backend API responding
- [ ] Can register new user
- [ ] Can add equipment
- [ ] QR codes generating
- [ ] Email configured (optional)

---

## 🎉 You're Live!

Your Equipment Tracker is now deployed on Railway!

**Share your app:**
- Frontend: `https://your-app.railway.app`
- Users can register and start tracking equipment
- QR codes work automatically
- Email notifications active

**Next Steps:**
1. Share the URL with your team
2. Add equipment and test all features
3. Set up custom domain (optional)
4. Monitor usage in Railway dashboard
5. Enjoy your deployed app! 🚀

---

## 🆘 Need Help?

1. **Railway Docs**: https://docs.railway.app
2. **Railway Discord**: https://discord.gg/railway
3. **Check Logs**: Railway Dashboard → Logs
4. **GitHub Issues**: Create issue in your repo

---

**Estimated Deployment Time: 10-15 minutes** ⏱️

**Cost: FREE (with $5 monthly credit)** 💰

**Difficulty: Easy** ⭐⭐☆☆☆
