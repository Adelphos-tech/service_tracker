import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins in production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Equipment Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// Redirect route for QR codes that point to backend URL
// This handles old QR codes that were generated with wrong FRONTEND_URL
app.get('/equipment/scan/:id', (req, res) => {
  let frontendUrl = process.env.FRONTEND_URL || 'https://your-frontend.netlify.app';
  
  // Ensure URL has https:// protocol
  if (!frontendUrl.startsWith('http://') && !frontendUrl.startsWith('https://')) {
    frontendUrl = `https://${frontendUrl}`;
  }
  
  const redirectUrl = `${frontendUrl}/equipment/scan/${req.params.id}`;
  console.log(`Redirecting QR scan from backend to frontend: ${redirectUrl}`);
  res.redirect(301, redirectUrl);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
});
