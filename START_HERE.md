# 🚀 START HERE - Equipment & Service Tracker

Welcome! This document will help you get started quickly.

## 📋 What You Have

A complete **Equipment & Service Tracker** application with:

✅ User authentication (login/register)  
✅ Equipment management (add, edit, delete, view)  
✅ Automatic QR code generation  
✅ QR code scanning with camera  
✅ Service tracking with expiry dates  
✅ Automated email notifications (5-7 days before service)  
✅ Modern purple-blue gradient UI  
✅ Dashboard with statistics  
✅ Search and filter functionality  

## 🎯 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
cd "/Users/shivang/Desktop/Equiments tracker"
./setup.sh
```

### Step 2: Configure Email (Optional but Recommended)

Edit `backend/.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

**Get Gmail App Password:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App passwords
4. Generate password for "Mail"
5. Copy and paste into .env

### Step 3: Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Step 4: Start the Application

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

### Step 5: Open Application

Go to: **http://localhost:5173**

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **QUICKSTART.md** | Fastest way to get running |
| **INSTALLATION.md** | Detailed installation guide with troubleshooting |
| **README.md** | Complete project documentation |
| **FEATURES.md** | Full list of all 150+ features |
| **PROJECT_SUMMARY.md** | Technical architecture and overview |

## 🎓 First Time Usage

### 1. Create Account
- Click "Sign up"
- Enter name, email, password
- Optional: Add company name
- Click "Create Account"

### 2. Add Equipment
- Click "Add Equipment" button
- Fill in required fields:
  - Title (e.g., "Laser Cutter")
  - Model (e.g., "LC-2000X")
  - Description
- Optional fields:
  - Serial Number
  - Location
  - Purchase info
  - Service dates
- Click "Add Equipment"
- **QR code is automatically generated!**

### 3. Download QR Code
- View equipment details
- Click "Download QR Code"
- Print and attach to physical equipment

### 4. Scan QR Code
- Go to "Scan QR" page
- Click "Start Scanning"
- Allow camera permissions
- Point camera at QR code
- Instantly view equipment details!

### 5. Track Service
- Set service expiry date when adding equipment
- View upcoming service on dashboard
- Receive email reminder 5-7 days before
- Add service records after maintenance

## 🎨 Color Scheme

The app uses a professional purple-blue gradient:
- **Primary**: Purple (#667eea) to Blue (#764ba2)
- **Success**: Green (active, OK)
- **Warning**: Yellow (due soon)
- **Danger**: Red (overdue)

## 📱 Key Features

### Dashboard
- Total equipment count
- Active equipment
- Under maintenance
- Service due soon
- Recent equipment
- Upcoming service list

### Equipment Management
- Add/Edit/Delete equipment
- Search by title, model, serial
- Filter by status and category
- View detailed information
- Track service history

### QR Codes
- Auto-generated on creation
- Download as PNG
- Print with equipment info
- Scan with camera
- Instant access to details

### Service Tracking
- Set expiry dates
- Visual status indicators
- Service history log
- Email reminders
- Maintenance cost tracking

## 🔧 Troubleshooting

### MongoDB Not Running?
```bash
brew services start mongodb-community
```

### Port Already in Use?
```bash
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
```

### Email Not Working?
- Check .env configuration
- Use Gmail App Password (not regular password)
- Enable 2FA on Gmail account

### Camera Not Working?
- Use Chrome browser
- Allow camera permissions
- Must be on localhost or HTTPS

## 📊 Project Structure

```
Equiments tracker/
├── backend/           # Node.js + Express API
│   ├── config/       # Database connection
│   ├── middleware/   # Authentication
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── utils/        # QR codes, emails
│   ├── server.js     # Main server
│   └── scheduler.js  # Email notifications
├── frontend/         # React + Vite UI
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Main pages
│   │   └── utils/       # Helper functions
│   └── ...
└── Documentation files
```

## 🚀 What's Next?

1. **Add your equipment** - Start building your inventory
2. **Print QR codes** - Attach to physical equipment
3. **Set service dates** - Track maintenance schedules
4. **Configure emails** - Get automated reminders
5. **Explore features** - Search, filter, scan QR codes

## 💡 Tips

- Set service dates 5-7 days in advance to test email notifications
- Use the search feature to quickly find equipment
- Download QR codes and print them in batches
- Add service records to maintain complete history
- Check dashboard daily for upcoming maintenance

## 🆘 Need Help?

1. Check **INSTALLATION.md** for detailed troubleshooting
2. Review **README.md** for complete documentation
3. See **FEATURES.md** for all available features
4. Verify all services are running (MongoDB, backend, frontend)
5. Check browser console (F12) for errors

## ✅ Success Checklist

Before you start using the app, verify:

- [ ] MongoDB is running
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] Can access login page
- [ ] Can create account
- [ ] Can add equipment
- [ ] QR code is generated
- [ ] Can scan QR code (optional)
- [ ] Email configured (optional)

## 🎉 You're Ready!

Your Equipment & Service Tracker is fully set up and ready to use!

**Access the app:** http://localhost:5173

Enjoy tracking your equipment! 🔧📦

---

**Tech Stack:** React • Node.js • Express • MongoDB • TailwindCSS  
**Features:** 150+ features fully implemented  
**Documentation:** 6 comprehensive guides included
