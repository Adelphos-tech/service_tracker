import express from 'express';
import User from '../models/User.js';
import Equipment from '../models/Equipment.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  userId: 'admin',
  password: 'Admin@7990'
};

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Validate admin credentials
    if (userId === ADMIN_CREDENTIALS.userId && password === ADMIN_CREDENTIALS.password) {
      // Generate token for admin
      const token = generateToken('admin-' + Date.now());
      
      res.json({
        userId: ADMIN_CREDENTIALS.userId,
        role: 'admin',
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get analytics data
// @access  Admin only
router.get('/analytics', async (req, res) => {
  try {
    // Verify admin token (simple check)
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get total equipment
    const totalEquipment = await Equipment.countDocuments();
    
    // Get equipment by status
    const equipmentByStatus = await Equipment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get equipment by category
    const equipmentByCategory = await Equipment.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get recent users (last 10)
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get users registered per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const usersPerMonth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    // Get equipment added per month (last 6 months)
    const equipmentPerMonth = await Equipment.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    // Get equipment with upcoming service dates
    const upcomingService = await Equipment.find({
      serviceExpiryDate: { 
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
      }
    })
    .populate('user', 'name email company')
    .sort({ serviceExpiryDate: 1 })
    .limit(10);
    
    // Get all users with their equipment count
    const usersWithEquipmentCount = await User.aggregate([
      {
        $lookup: {
          from: 'equipments',
          localField: '_id',
          foreignField: 'user',
          as: 'equipment'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          company: 1,
          createdAt: 1,
          equipmentCount: { $size: '$equipment' }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.json({
      summary: {
        totalUsers,
        totalEquipment,
        activeEquipment: equipmentByStatus.find(s => s._id === 'Active')?.count || 0,
        underMaintenance: equipmentByStatus.find(s => s._id === 'Under Maintenance')?.count || 0
      },
      equipmentByStatus,
      equipmentByCategory,
      recentUsers,
      usersPerMonth,
      equipmentPerMonth,
      upcomingService,
      usersWithEquipmentCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin only
router.get('/users', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
