# Installation Guide

## Step-by-Step Installation Instructions

### Prerequisites Check

Before starting, verify you have:

```bash
# Check Node.js (should be v16 or higher)
node --version

# Check npm
npm --version

# Check MongoDB
mongod --version
```

If any are missing, install them first:
- **Node.js**: Download from https://nodejs.org/
- **MongoDB**: 
  - macOS: `brew install mongodb-community`
  - Linux: Follow https://docs.mongodb.com/manual/installation/
  - Windows: Download from https://www.mongodb.com/try/download/community

---

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd "/Users/shivang/Desktop/Equiments tracker"
```

### 2. Run Automated Setup (Recommended)

```bash
./setup.sh
```

This will automatically install all dependencies for both backend and frontend.

### 3. Configure Backend Environment

Edit `backend/.env` file:

```bash
cd backend
nano .env  # or use any text editor
```

Add the following configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/equipment-tracker
JWT_SECRET=change_this_to_a_random_secure_string_12345
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Equipment Tracker <your-email@gmail.com>

FRONTEND_URL=http://localhost:5173
```

**Important**: Replace the email settings with your actual credentials.

---

## Email Setup (Gmail)

### Getting Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left menu
3. Enable **2-Step Verification** (if not already enabled)
4. After enabling 2FA, go back to Security
5. Click on **App passwords**
6. Select **Mail** and **Other (Custom name)**
7. Name it "Equipment Tracker"
8. Click **Generate**
9. Copy the 16-character password
10. Use this password in your `.env` file as `EMAIL_PASSWORD`

### Using Other Email Providers

**Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

**Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

---

## Manual Installation (Alternative)

If the automated setup doesn't work:

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
```

### Frontend

```bash
cd frontend
npm install
```

---

## Starting the Application

### Option 1: Using Multiple Terminals (Recommended)

**Terminal 1 - Start MongoDB:**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB

# Verify MongoDB is running
mongosh
# You should see MongoDB shell. Type 'exit' to quit.
```

**Terminal 2 - Start Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

**Terminal 3 - Start Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

**Terminal 4 - Start Scheduler (Optional):**
```bash
cd backend
npm run scheduler
```

You should see:
```
MongoDB Connected: localhost
Scheduler started. Service reminders will be checked daily at 9:00 AM
Running initial check now...
```

### Option 2: Using tmux/screen (Advanced)

```bash
# Start all services in background
tmux new-session -d -s equipment-backend 'cd backend && npm run dev'
tmux new-session -d -s equipment-frontend 'cd frontend && npm run dev'
tmux new-session -d -s equipment-scheduler 'cd backend && npm run scheduler'

# View logs
tmux attach -t equipment-backend
# Press Ctrl+B then D to detach
```

---

## Verification

### 1. Check Backend

Open browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Equipment Tracker API is running",
  "timestamp": "2024-..."
}
```

### 2. Check Frontend

Open browser: http://localhost:5173

You should see the login page with:
- Equipment Tracker logo
- Email and password fields
- Sign up link

### 3. Test Registration

1. Click "Sign up"
2. Fill in the form
3. Click "Create Account"
4. Check your email for welcome message
5. You should be redirected to dashboard

### 4. Test Equipment Creation

1. Click "Add Equipment"
2. Fill in required fields (Title, Model, Description)
3. Click "Add Equipment"
4. You should see the equipment with QR code

### 5. Test QR Scanning

1. Download the QR code from equipment detail page
2. Go to "Scan QR" page
3. Click "Start Scanning"
4. Allow camera permissions
5. Show the downloaded QR code to camera
6. Should redirect to equipment details

---

## Troubleshooting

### MongoDB Connection Failed

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# If not running, start it
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux

# Check MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log  # macOS
```

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use a different port in backend/.env
PORT=5001
```

### Email Not Sending

**Error:** `Error: Invalid login`

**Solution:**
1. Verify email credentials in `.env`
2. Ensure 2FA is enabled on Gmail
3. Use App Password, not regular password
4. Check EMAIL_HOST and EMAIL_PORT are correct
5. Test with a simple script:

```javascript
// test-email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: process.env.EMAIL_USER,
  subject: 'Test Email',
  text: 'If you receive this, email is working!'
}, (err, info) => {
  if (err) console.error('Error:', err);
  else console.log('Success:', info);
});
```

Run: `node test-email.js`

### Camera Not Working (QR Scanner)

**Error:** `NotAllowedError: Permission denied`

**Solution:**
1. Ensure you're on HTTPS or localhost
2. Grant camera permissions in browser
3. Check browser console for errors
4. Try different browser (Chrome recommended)
5. Check if camera is being used by another app

### Dependencies Installation Failed

**Error:** `npm ERR! code ERESOLVE`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install with legacy peer deps
npm install --legacy-peer-deps
```

### Frontend Not Loading

**Error:** Blank page or build errors

**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run dev
```

---

## Production Deployment

### Backend (Heroku Example)

```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login
heroku login

# Create app
heroku create equipment-tracker-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set EMAIL_USER=your_email
heroku config:set EMAIL_PASSWORD=your_password
# ... set all other env vars

# Deploy
git push heroku main
```

### Frontend (Vercel Example)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Follow prompts
# Update backend CORS to allow your Vercel domain
```

### MongoDB Atlas (Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string
6. Update MONGODB_URI in backend/.env

---

## Maintenance

### Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest
```

### Backup Database

```bash
# Export database
mongodump --db equipment-tracker --out ./backup

# Import database
mongorestore --db equipment-tracker ./backup/equipment-tracker
```

### Logs

```bash
# Backend logs
cd backend
npm run dev > logs.txt 2>&1

# View logs
tail -f logs.txt
```

---

## Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Review error messages in terminal
3. Check browser console (F12)
4. Verify all environment variables
5. Ensure all services are running
6. Check MongoDB logs
7. Review README.md and QUICKSTART.md

---

## Success Checklist

- [ ] Node.js and npm installed
- [ ] MongoDB installed and running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] .env file configured with email settings
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can access login page
- [ ] Can register new user
- [ ] Can add equipment
- [ ] QR code generated
- [ ] Can scan QR code
- [ ] Email notifications working (optional for testing)

Once all items are checked, your Equipment Tracker is ready to use! 🎉
