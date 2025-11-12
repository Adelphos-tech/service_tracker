# Quick Start Guide

## Prerequisites
- Node.js installed
- MongoDB installed and running

## Setup in 5 Minutes

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Create `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/equipment-tracker
JWT_SECRET=my_super_secret_jwt_key_12345
JWT_EXPIRE=7d

# Email Configuration (use your Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=Equipment Tracker <your-email@gmail.com>

FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Scheduler (Optional):**
```bash
cd backend
npm run scheduler
```

### 5. Access the Application

Open your browser and go to: **http://localhost:5173**

1. Click "Sign up" to create an account
2. Login with your credentials
3. Start adding equipment!

## Test the Features

### Add Your First Equipment
1. Click "Add Equipment"
2. Fill in: Title, Model, Description
3. Set a service expiry date (try setting it 5 days from now)
4. Save and view the auto-generated QR code

### Test QR Scanning
1. Download the QR code
2. Go to "Scan QR" page
3. Scan the downloaded QR code with your camera
4. See instant equipment details!

### Test Email Notifications
1. Add equipment with service date 5-7 days from now
2. Run the scheduler: `npm run scheduler`
3. Check your email for the reminder

## Common Issues

**MongoDB not connecting?**
```bash
mongosh  # Test connection
```

**Port already in use?**
```bash
lsof -ti:5000 | xargs kill -9  # Kill backend port
lsof -ti:5173 | xargs kill -9  # Kill frontend port
```

**Email not working?**
- Enable 2FA on Gmail
- Generate App Password in Google Account settings
- Use the app password in .env file

## What's Next?

- Explore the Dashboard for statistics
- Add multiple equipment items
- Test the search and filter features
- Print QR codes and attach to physical equipment
- Set up service schedules and track maintenance history

Enjoy your Equipment Tracker! 🎉
