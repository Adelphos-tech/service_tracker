# 🚀 Equipment Tracker - Running on Localhost

## ✅ Current Status

Your Equipment Tracker is **RUNNING** on localhost!

### Services Status:
- ✅ **MongoDB**: Running (mongodb-community service)
- ✅ **Backend API**: Running on http://localhost:5001
- ✅ **Frontend**: Running on http://localhost:5173

## 🌐 Access the Application

**Open in your browser:** http://localhost:5173

You should see the login page with:
- Purple-blue gradient design
- Email and password fields
- "Sign up" link

## 📝 First Steps

### 1. Create Your Account
1. Click "Sign up" on the login page
2. Fill in:
   - Name: Your name
   - Email: your-email@example.com
   - Password: At least 6 characters
   - Company: (Optional)
3. Click "Create Account"

### 2. Add Your First Equipment
1. After login, you'll see the dashboard
2. Click "Add Equipment" button
3. Fill in the required fields:
   - **Title**: e.g., "Laser Cutter"
   - **Model**: e.g., "LC-2000X"
   - **Description**: Brief description
4. Optional fields:
   - Serial Number
   - Location
   - Category
   - Purchase info
   - Service dates
5. Click "Add Equipment"
6. **QR Code is automatically generated!**

### 3. View and Download QR Code
1. Click on the equipment you just added
2. See the QR code on the right sidebar
3. Click "Download QR Code" to save it
4. Click "Print QR Code" for a formatted printout

### 4. Test QR Scanning
1. Go to "Scan QR" in the navigation
2. Click "Start Scanning"
3. Allow camera permissions
4. Show the downloaded QR code to your camera
5. You'll be redirected to equipment details!

## 🔧 Managing Services

### Stop Services

To stop the application:

```bash
# Stop backend (press Ctrl+C in backend terminal)
# Stop frontend (press Ctrl+C in frontend terminal)

# Stop MongoDB
brew services stop mongodb/brew/mongodb-community
```

### Restart Services

If you need to restart:

```bash
# Terminal 1 - Backend
cd "/Users/shivang/Desktop/Equiments tracker/backend"
npm run dev

# Terminal 2 - Frontend
cd "/Users/shivang/Desktop/Equiments tracker/frontend"
npm run dev
```

Or use the convenience scripts:

```bash
# Terminal 1
./start-backend.sh

# Terminal 2
./start-frontend.sh
```

## 📊 Current Configuration

### Backend (Port 5001)
- API Endpoint: http://localhost:5001/api
- Database: MongoDB (localhost:27017)
- Database Name: equipment-tracker

### Frontend (Port 5173)
- Web App: http://localhost:5173
- Proxies API calls to backend

### MongoDB
- Running as a service
- Data stored in: /opt/homebrew/var/mongodb

## 🔍 Checking Status

### Check if MongoDB is running:
```bash
brew services list | grep mongodb
```

### Check backend logs:
Look at the terminal where backend is running

### Check frontend logs:
Look at the terminal where frontend is running

### Test backend API:
```bash
curl http://localhost:5001/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Equipment Tracker API is running",
  "timestamp": "..."
}
```

## 📧 Email Configuration (Optional)

To enable automated email notifications:

1. Edit `backend/.env`
2. Update these fields:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   ```
3. Get Gmail App Password:
   - Go to Google Account → Security
   - Enable 2-Step Verification
   - Go to App passwords
   - Generate password for "Mail"
   - Copy and paste into .env

4. Restart backend server

5. Run scheduler (optional, in new terminal):
   ```bash
   cd backend
   npm run scheduler
   ```

## 🎯 Quick Tips

1. **Dashboard**: Shows statistics and upcoming service
2. **Equipment List**: Browse all equipment with search/filter
3. **QR Codes**: Download and print to attach to physical equipment
4. **Service Tracking**: Set expiry dates to get email reminders
5. **Search**: Use the search bar to quickly find equipment
6. **Filters**: Filter by status or category

## 🐛 Troubleshooting

### Port Already in Use
If you see "EADDRINUSE" error:
```bash
# Kill process on port
lsof -ti:5001 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
```

### MongoDB Not Running
```bash
brew services start mongodb/brew/mongodb-community
```

### Frontend Can't Connect to Backend
- Check backend is running on port 5001
- Check `frontend/vite.config.js` proxy points to port 5001

### Camera Not Working (QR Scanner)
- Use Chrome browser
- Allow camera permissions when prompted
- Must be on localhost or HTTPS

## 📱 Browser Compatibility

Works best on:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🎉 You're All Set!

Your Equipment Tracker is running and ready to use!

**Access it at:** http://localhost:5173

Start by creating an account and adding your first equipment!

---

**Need Help?** Check the other documentation files:
- README.md - Complete documentation
- QUICKSTART.md - Quick setup guide
- FEATURES.md - All features explained
- INSTALLATION.md - Detailed troubleshooting
