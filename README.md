# Equipment & Service Tracker

A comprehensive full-stack web application for managing equipment inventory and tracking maintenance schedules with automated email notifications.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login and registration system with JWT tokens
- **Equipment Management**: Add, edit, view, and delete equipment with detailed information
- **QR Code Generation**: Automatic QR code generation for each equipment item
- **QR Code Scanning**: Built-in QR scanner to quickly access equipment details
- **Service Tracking**: Track service and calibration expiry dates
- **Automated Notifications**: Email reminders sent 5-7 days before service expiry
- **Service History**: Maintain detailed service records for each equipment
- **Dashboard**: Overview with statistics and upcoming service alerts

### Technical Features
- Modern, responsive UI with gradient color scheme
- Real-time search and filtering
- RESTful API architecture
- MongoDB database with Mongoose ODM
- Scheduled background jobs for notifications
- Secure password hashing with bcrypt
- Protected routes and API endpoints

## 🎨 Color Scheme

The application uses a professional purple-blue gradient color scheme:
- Primary: Purple gradient (#667eea to #764ba2)
- Secondary: Blue accents
- Status colors: Green (active), Yellow (warning), Red (overdue)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone the Repository

```bash
cd "Equiments tracker"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/equipment-tracker
JWT_SECRET=your_secure_jwt_secret_key_change_this
JWT_EXPIRE=7d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=Equipment Tracker <your-email@gmail.com>

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

### Start Email Notification Scheduler (Optional)

In a separate terminal:

```bash
cd backend
npm run scheduler
```

This will run the automated email notification system that checks daily at 9:00 AM.

## 📧 Email Configuration

### Using Gmail

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the generated password in your `.env` file

### Using Other Email Providers

Update the `EMAIL_HOST` and `EMAIL_PORT` in `.env`:

- **Outlook**: smtp-mail.outlook.com, port 587
- **Yahoo**: smtp.mail.yahoo.com, port 587
- **Custom SMTP**: Use your provider's settings

## 📱 Usage Guide

### 1. Register an Account

- Navigate to `http://localhost:5173/register`
- Fill in your details (name, email, password, company)
- Click "Create Account"

### 2. Add Equipment

- Click "Add Equipment" button
- Fill in equipment details:
  - **Required**: Title, Model, Description
  - **Optional**: Serial Number, Location, Purchase Info, Service Dates
- Click "Add Equipment" to save
- QR code is automatically generated

### 3. View Equipment

- Browse all equipment from the Equipment page
- Use search and filters to find specific items
- Click on any equipment card to view full details

### 4. Scan QR Codes

- Navigate to "Scan QR" page
- Click "Start Scanning"
- Allow camera permissions
- Point camera at equipment QR code
- Automatically redirects to equipment details

### 5. Track Service

- View upcoming service dates on Dashboard
- Add service records from equipment detail page
- Receive email notifications 5-7 days before expiry

### 6. Download/Print QR Codes

- Open equipment detail page
- Click "Download QR Code" to save as PNG
- Click "Print QR Code" for formatted printout
- Attach printed QR codes to physical equipment

## 🏗️ Project Structure

```
Equiments tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── middleware/
│   │   └── auth.js               # JWT authentication
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Equipment.js          # Equipment schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── equipmentRoutes.js    # Equipment endpoints
│   ├── utils/
│   │   ├── generateToken.js      # JWT token generation
│   │   ├── qrCodeGenerator.js    # QR code creation
│   │   └── emailService.js       # Email notifications
│   ├── server.js                 # Express server
│   ├── scheduler.js              # Cron job scheduler
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EquipmentList.jsx
│   │   │   ├── EquipmentForm.jsx
│   │   │   ├── EquipmentDetail.jsx
│   │   │   └── QRScanner.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Equipment
- `GET /api/equipment` - Get all equipment (protected)
- `GET /api/equipment/:id` - Get single equipment (protected)
- `GET /api/equipment/scan/:id` - Get equipment by QR scan (public)
- `POST /api/equipment` - Create equipment (protected)
- `PUT /api/equipment/:id` - Update equipment (protected)
- `DELETE /api/equipment/:id` - Delete equipment (protected)
- `POST /api/equipment/:id/service` - Add service record (protected)
- `GET /api/equipment/stats/dashboard` - Get dashboard stats (protected)

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# If not running, start it
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Email Not Sending
- Verify email credentials in `.env`
- Check if 2FA is enabled and app password is used
- Review scheduler logs for errors
- Test email configuration with a simple test

### QR Scanner Not Working
- Ensure HTTPS or localhost (required for camera access)
- Grant camera permissions in browser
- Check browser console for errors
- Try different browser if issues persist

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production` in environment
2. Use production MongoDB URI
3. Set secure JWT secret
4. Configure production email settings
5. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend
1. Build production bundle: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update `FRONTEND_URL` in backend `.env`
4. Configure CORS for production domain

## 📝 License

This project is licensed under the ISC License.

## 👥 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check MongoDB and Node.js logs
4. Verify environment variables

## 🎉 Features Coming Soon

- Multi-user organizations
- Advanced reporting and analytics
- Mobile app (React Native)
- Barcode scanning support
- Equipment categories customization
- Export data to CSV/PDF
- Equipment warranty tracking
- Maintenance cost analytics

---

Built with ❤️ using React, Node.js, Express, MongoDB, and TailwindCSS
