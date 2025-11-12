# 🚀 Deployment Guide

## ⚠️ Important: GitHub Pages Limitation

**GitHub Pages CANNOT host this application** because:
- ❌ GitHub Pages only hosts static HTML/CSS/JS files
- ❌ No backend server support (Node.js/Express)
- ❌ No database support (MongoDB)
- ❌ No server-side code execution

## ✅ Recommended Deployment Options

This is a **full-stack application** that requires:
- Backend server (Node.js + Express)
- Database (MongoDB)
- Environment variables
- Server-side processing

### Best Deployment Platforms:

---

## Option 1: Render (Recommended - FREE)

**Best for:** Complete deployment with database

### Backend Deployment on Render

1. **Go to:** https://render.com
2. **Sign up/Login** with GitHub
3. **Click "New +" → "Web Service"**
4. **Connect your repository:** `Adelphos-tech/service_tracker`
5. **Configure:**
   ```
   Name: equipment-tracker-api
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

6. **Add Environment Variables:**
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=your_secure_random_string_here
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=Equipment Tracker <your-email@gmail.com>
   FRONTEND_URL=<your-frontend-url>
   NODE_ENV=production
   ```

7. **Click "Create Web Service"**

### Frontend Deployment on Render

1. **Click "New +" → "Static Site"**
2. **Connect same repository**
3. **Configure:**
   ```
   Name: equipment-tracker
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. **Add Environment Variable:**
   ```
   VITE_API_URL=<your-backend-url>
   ```

5. **Click "Create Static Site"**

### MongoDB Atlas (FREE Database)

1. **Go to:** https://www.mongodb.com/cloud/atlas
2. **Sign up** for free tier
3. **Create a cluster** (free M0 tier)
4. **Create database user**
5. **Whitelist IP:** 0.0.0.0/0 (allow all)
6. **Get connection string**
7. **Use in Render environment variables**

**Total Cost: FREE** ✅

---

## Option 2: Railway (Easy Deployment)

**Best for:** Quick deployment with automatic setup

1. **Go to:** https://railway.app
2. **Sign up with GitHub**
3. **New Project → Deploy from GitHub**
4. **Select:** `service_tracker`
5. **Railway auto-detects** both frontend and backend
6. **Add MongoDB** from Railway marketplace
7. **Set environment variables**
8. **Deploy!**

**Cost:** $5/month after free trial

---

## Option 3: Vercel (Frontend) + Railway (Backend)

### Frontend on Vercel (FREE)

1. **Go to:** https://vercel.com
2. **Import Git Repository**
3. **Select:** `service_tracker`
4. **Configure:**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
5. **Add Environment Variable:**
   ```
   VITE_API_URL=<your-backend-url>
   ```
6. **Deploy**

### Backend on Railway

Follow Railway instructions above for backend + MongoDB

**Cost:** FREE for frontend, $5/month for backend

---

## Option 4: Heroku (Traditional)

### Backend Deployment

1. **Install Heroku CLI**
2. **Login:** `heroku login`
3. **Create app:** `heroku create equipment-tracker-api`
4. **Add MongoDB:** `heroku addons:create mongolab:sandbox`
5. **Set environment variables:**
   ```bash
   heroku config:set JWT_SECRET=your_secret
   heroku config:set EMAIL_USER=your-email@gmail.com
   # ... set all other vars
   ```
6. **Deploy:**
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Frontend on Vercel

Follow Vercel instructions above

**Cost:** $7/month for backend

---

## 🔧 Pre-Deployment Checklist

Before deploying, you need to:

### 1. Update Frontend API Configuration

Create `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend-url.com
```

Update `frontend/src/utils/api.js`:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});
```

### 2. Update Backend CORS

Edit `backend/server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### 3. Update Backend for Production

Edit `backend/package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 4. Set Up MongoDB Atlas

- Create account at mongodb.com/cloud/atlas
- Create free cluster
- Create database user
- Whitelist all IPs (0.0.0.0/0)
- Get connection string
- Replace in environment variables

### 5. Configure Email

- Use Gmail with App Password
- Or use SendGrid, Mailgun, etc.
- Update EMAIL_* environment variables

---

## 📝 Environment Variables Needed

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/equipment-tracker
JWT_SECRET=your_very_secure_random_string_change_this
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=Equipment Tracker <your-email@gmail.com>
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 🚫 Why NOT GitHub Pages?

GitHub Pages limitations:
- ❌ No server-side code (Node.js)
- ❌ No database
- ❌ No API endpoints
- ❌ No environment variables
- ❌ No email sending
- ❌ No file uploads
- ✅ Only static HTML/CSS/JS

**Your app needs all the features GitHub Pages doesn't support!**

---

## ✅ Recommended: Render (Free & Complete)

**Best choice because:**
- ✅ FREE tier available
- ✅ Supports Node.js backend
- ✅ Easy MongoDB Atlas integration
- ✅ Automatic HTTPS
- ✅ Environment variables
- ✅ Continuous deployment from GitHub
- ✅ Static site hosting for frontend
- ✅ No credit card required for free tier

**Steps:**
1. Deploy backend to Render Web Service
2. Deploy frontend to Render Static Site
3. Use MongoDB Atlas (free)
4. Configure environment variables
5. Done! ✅

---

## 🔄 Continuous Deployment

Once set up, any push to GitHub will:
1. Automatically trigger new deployment
2. Build and deploy backend
3. Build and deploy frontend
4. Zero downtime updates

---

## 📊 Cost Comparison

| Platform | Backend | Frontend | Database | Total/Month |
|----------|---------|----------|----------|-------------|
| **Render** | FREE | FREE | FREE (Atlas) | **$0** ✅ |
| Railway | $5 | $0 | Included | $5 |
| Vercel + Railway | $5 | FREE | $5 | $10 |
| Heroku | $7 | $0 | $15 | $22 |

**Winner: Render (100% FREE)** 🎉

---

## 🆘 Need Help?

1. **Render Issues:** Check build logs in Render dashboard
2. **MongoDB Issues:** Verify connection string and IP whitelist
3. **CORS Issues:** Update FRONTEND_URL in backend .env
4. **Email Issues:** Use Gmail App Password, not regular password

---

## 📚 Next Steps

1. **Choose Render** (recommended)
2. **Set up MongoDB Atlas** (free)
3. **Deploy backend** to Render
4. **Deploy frontend** to Render
5. **Configure environment variables**
6. **Test the deployed app**
7. **Share the URL!**

Your app will be live at:
- Frontend: `https://equipment-tracker.onrender.com`
- Backend: `https://equipment-tracker-api.onrender.com`

---

**Remember:** GitHub Pages won't work for this full-stack app. Use Render for free hosting! 🚀
