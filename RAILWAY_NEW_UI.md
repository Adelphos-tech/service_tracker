# 🚂 Railway Deployment - New UI Guide

## ✅ Root Directory in New Railway Interface

Railway has updated their UI. Here's how to set the root directory now:

---

## 🎯 Method 1: Using Service Settings (Recommended)

### Step 1: Click on "Source" in Settings

1. Go to your **service_tracker** service
2. Click **"Settings"** tab (you're already here!)
3. Look at the **right sidebar**
4. Click on **"Source"** (first option)
5. You should see:
   - **Source Repo:** Your GitHub repo
   - **Branch:** main
   - **Root Directory:** (This is what you need!)

### Step 2: Set Root Directory

In the Source section:
1. Find **"Root Directory"** field
2. Type: **`backend`**
3. Click **"Save"** or it saves automatically
4. Service will redeploy

---

## 🎯 Method 2: Delete and Recreate (Easier!)

Since the current service is having issues, let's start fresh:

### Delete Current Service

1. In Settings, scroll to bottom
2. Click **"Danger"** in right sidebar
3. Click **"Delete Service"**
4. Confirm deletion

### Create New Backend Service

1. Click **"+ New"** in your project
2. Select **"GitHub Repo"**
3. Choose **`Adelphos-tech/service_tracker`**
4. **IMPORTANT:** Railway will ask for configuration
5. When prompted, set:
   - **Service Name:** `backend`
   - **Root Directory:** `backend`
   - **Start Command:** `node server.js`

### Or Configure After Creation

If Railway doesn't ask during creation:

1. After service is created, click on it
2. Go to **Settings**
3. Click **"Source"** in right sidebar
4. Set **Root Directory:** `backend`
5. Click **"Deploy"** in right sidebar
6. Click **"Deploy Now"**

---

## 🎯 Method 3: Use Railway CLI (Fastest!)

### Install Railway CLI

```bash
npm install -g @railway/cli
```

### Login

```bash
railway login
```

### Link and Deploy Backend

```bash
cd "/Users/shivang/Desktop/Equiments tracker/backend"
railway link
# Select your project
railway up
```

This automatically deploys from the backend directory!

### Deploy Frontend

```bash
cd "/Users/shivang/Desktop/Equiments tracker/frontend"
railway up
```

---

## 📝 Alternative: Monorepo Configuration

If you can't find Root Directory option, Railway might need a monorepo config:

### Create railway.toml in Root

Create this file in the root of your project:

```toml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "echo 'Use separate services for backend and frontend'"
```

### Then Deploy Separately

Use the CLI method above to deploy backend and frontend from their respective directories.

---

## ✅ What Should Happen

Once you set root directory to `backend`:

1. Railway will look for `backend/package.json`
2. Run `npm install` in backend folder
3. Run `node server.js` from backend folder
4. Your backend will start successfully!

---

## 🔍 Check Deployment Logs

After setting root directory:

1. Go to **"Deployments"** tab
2. Click on latest deployment
3. Check the logs
4. You should see:
   ```
   Server running on port 5000
   MongoDB Connected: localhost
   ```

---

## 🐛 If You Still Can't Find Root Directory

Try this:

1. **Click "Deploy"** in right sidebar
2. Look for **"Custom Start Command"** or **"Build Settings"**
3. Or try the **"Config as code"** option
4. Enable it and use `railway.json` configuration

---

## 💡 Quick Fix: Use Two Separate Repos

If Railway's new UI is too confusing, you can:

1. Create two separate repos:
   - `equipment-tracker-backend` (just backend folder)
   - `equipment-tracker-frontend` (just frontend folder)

2. Deploy each separately to Railway

3. No need for root directory!

But this is more work, so try the methods above first.

---

## 🎯 Recommended Approach

**Use Railway CLI** - It's the easiest:

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway up

# Deploy frontend (in new terminal)
cd frontend
railway up
```

This bypasses all the UI confusion!

---

## 📚 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check "Source" in Settings sidebar

---

**The root directory setting is definitely there - it's just in the "Source" section now!** 🚀
