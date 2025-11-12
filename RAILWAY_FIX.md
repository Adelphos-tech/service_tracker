# 🔧 Railway Deployment Fix

## ❌ The Problem

Railway is trying to deploy the root directory which contains both frontend and backend. This causes the "Nixpacks was unable to generate a build plan" error.

## ✅ The Solution

Deploy backend and frontend as **separate services** with specific root directories.

---

## 🚀 Correct Deployment Steps

### Step 1: Delete Current Deployment

1. In Railway dashboard, click on `service_tracker`
2. Click **Settings** (gear icon)
3. Scroll down and click **"Delete Service"**
4. Confirm deletion

### Step 2: Deploy Backend Service

1. Click **"+ New"** in your Railway project
2. Select **"GitHub Repo"**
3. Choose **`Adelphos-tech/service_tracker`**
4. Railway will create a service

**Configure Backend:**
1. Click on the service
2. Go to **"Settings"**
3. Set **"Root Directory"** to: `backend`
4. Set **"Start Command"** to: `node server.js`
5. Go to **"Variables"** tab
6. Add these variables:

```env
PORT=5000
MONGODB_URI=${{MongoDB.MONGO_URL}}
JWT_SECRET=equipment_tracker_secret_key_12345_change_this
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=Equipment Tracker <your-email@gmail.com>
FRONTEND_URL=${{frontend.url}}
NODE_ENV=production
```

7. Click **"Deploy"**

### Step 3: Deploy Frontend Service

1. Click **"+ New"** again
2. Select **"GitHub Repo"**
3. Choose **`Adelphos-tech/service_tracker`** again
4. Railway will create another service

**Configure Frontend:**
1. Click on the service
2. Go to **"Settings"**
3. Set **"Root Directory"** to: `frontend`
4. Set **"Build Command"** to: `npm install && npm run build`
5. Set **"Start Command"** to: `npx vite preview --host 0.0.0.0 --port $PORT`
6. Go to **"Variables"** tab
7. Add this variable:

```env
VITE_API_URL=${{backend.url}}/api
```

8. Click **"Deploy"**

### Step 4: Add MongoDB (if not already added)

1. Click **"+ New"**
2. Select **"Database"**
3. Choose **"Add MongoDB"**

---

## 📝 Alternative: Use Railway CLI

### Install Railway CLI

```bash
npm install -g @railway/cli
```

### Login

```bash
railway login
```

### Deploy Backend

```bash
cd "/Users/shivang/Desktop/Equiments tracker/backend"
railway up
```

### Deploy Frontend

```bash
cd "/Users/shivang/Desktop/Equiments tracker/frontend"
railway up
```

---

## 🎯 Quick Fix Checklist

- [ ] Delete the failed service
- [ ] Deploy backend with root directory: `backend`
- [ ] Deploy frontend with root directory: `frontend`
- [ ] Add MongoDB database
- [ ] Set backend environment variables (9 variables)
- [ ] Set frontend environment variable (VITE_API_URL)
- [ ] Wait for both to deploy
- [ ] Test the frontend URL

---

## 🔍 Why This Happens

Railway tries to auto-detect your app structure. When it sees:
- Multiple package.json files
- Mixed frontend/backend code
- No clear entry point

It gets confused and fails to generate a build plan.

**Solution:** Tell Railway exactly what to build by setting the **Root Directory** for each service.

---

## ✅ After Deployment

Once both services are deployed:

1. **Get Frontend URL:**
   - Click frontend service
   - Go to Settings → Domains
   - Copy the URL

2. **Test Your App:**
   - Open the frontend URL
   - Register a new account
   - Add equipment
   - Generate QR code
   - Test all features

3. **Check Backend:**
   - Open: `https://your-backend.railway.app/api/health`
   - Should return: `{"status":"OK",...}`

---

## 🐛 Still Having Issues?

### Check Backend Logs

1. Click backend service
2. Go to **"Deployments"**
3. Click latest deployment
4. Check logs for errors

### Check Frontend Logs

1. Click frontend service
2. Go to **"Deployments"**
3. Click latest deployment
4. Check logs for errors

### Common Issues

**Backend won't start:**
- Check all environment variables are set
- Verify MONGODB_URI is correct
- Check package.json has "type": "module"

**Frontend can't connect:**
- Verify VITE_API_URL points to backend
- Check CORS settings in backend
- Verify backend is deployed and running

**MongoDB connection failed:**
- Check MongoDB service is running
- Verify MONGODB_URI variable
- Use Railway's auto-generated connection string

---

## 💡 Pro Tip

Name your services clearly:
- Backend service: `equipment-tracker-api`
- Frontend service: `equipment-tracker-web`
- Database: `equipment-tracker-db`

This makes it easier to manage and reference them in variables.

---

## 📚 Need More Help?

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Check Logs:** Always check deployment logs first

---

**Follow these steps and your app will deploy successfully!** 🚀
