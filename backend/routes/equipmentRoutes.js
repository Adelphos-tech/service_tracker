import express from 'express';
import { body } from 'express-validator';
import { validationResult } from 'express-validator';
import Equipment from '../models/Equipment.js';
import { protect } from '../middleware/auth.js';
import { generateQRCode } from '../utils/qrCodeGenerator.js';

const router = express.Router();

// @route   GET /api/equipment
// @desc    Get all equipment for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, category, search } = req.query;
    
    let query = { user: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const equipment = await Equipment.find(query).sort({ createdAt: -1 });
    res.json(equipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/equipment/:id
// @desc    Get single equipment by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Check if user owns this equipment
    if (equipment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this equipment' });
    }

    res.json(equipment);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/equipment/scan/:id
// @desc    Get equipment details by scanning QR code (public access)
// @access  Public
router.get('/scan/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate('user', 'name email company');

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json(equipment);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/equipment
// @desc    Create new equipment
// @access  Private
router.post(
  '/',
  [
    protect,
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('model').trim().notEmpty().withMessage('Model is required'),
    body('description').trim().notEmpty().withMessage('Description is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        model,
        serialNumber,
        description,
        category,
        location,
        purchaseDate,
        purchasePrice,
        status,
        serviceExpiryDate,
        calibrationExpiryDate,
        serviceInterval
      } = req.body;

      // Check if serial number already exists
      if (serialNumber) {
        const existingEquipment = await Equipment.findOne({ serialNumber });
        if (existingEquipment) {
          return res.status(400).json({ message: 'Equipment with this serial number already exists' });
        }
      }

      // Create equipment first without QR code
      const equipment = new Equipment({
        title,
        model,
        serialNumber,
        description,
        category,
        location,
        purchaseDate,
        purchasePrice,
        status,
        serviceExpiryDate,
        calibrationExpiryDate,
        serviceInterval,
        user: req.user._id,
        qrCode: 'temp', // Temporary value
        qrCodeData: 'temp' // Temporary value
      });

      // Save to get the ID
      await equipment.save();

      // Generate QR code with the equipment ID
      const { qrCode, qrCodeData } = await generateQRCode(equipment._id);
      
      // Update equipment with QR code
      equipment.qrCode = qrCode;
      equipment.qrCodeData = qrCodeData;
      await equipment.save();

      res.status(201).json(equipment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @route   PUT /api/equipment/:id
// @desc    Update equipment
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Check if user owns this equipment
    if (equipment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this equipment' });
    }

    // Check if serial number is being changed and if it already exists
    if (req.body.serialNumber && req.body.serialNumber !== equipment.serialNumber) {
      const existingEquipment = await Equipment.findOne({ serialNumber: req.body.serialNumber });
      if (existingEquipment) {
        return res.status(400).json({ message: 'Equipment with this serial number already exists' });
      }
    }

    // Reset notification flag if service date is updated
    if (req.body.serviceExpiryDate && req.body.serviceExpiryDate !== equipment.serviceExpiryDate) {
      req.body.notificationSent = false;
    }

    equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(equipment);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/equipment/:id
// @desc    Delete equipment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Check if user owns this equipment
    if (equipment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this equipment' });
    }

    await Equipment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Equipment removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/equipment/:id/service
// @desc    Add service history entry
// @access  Private
router.post('/:id/service', protect, async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Check if user owns this equipment
    if (equipment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this equipment' });
    }

    const { serviceDate, description, performedBy, cost, notes } = req.body;

    equipment.serviceHistory.push({
      serviceDate,
      description,
      performedBy,
      cost,
      notes
    });

    equipment.lastServiceDate = serviceDate;
    equipment.notificationSent = false; // Reset notification flag

    await equipment.save();

    res.json(equipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/equipment/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats/dashboard', protect, async (req, res) => {
  try {
    const totalEquipment = await Equipment.countDocuments({ user: req.user._id });
    const activeEquipment = await Equipment.countDocuments({ user: req.user._id, status: 'Active' });
    const underMaintenance = await Equipment.countDocuments({ user: req.user._id, status: 'Under Maintenance' });
    
    // Equipment with service due in next 7 days
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingService = await Equipment.countDocuments({
      user: req.user._id,
      serviceExpiryDate: { $gte: today, $lte: nextWeek }
    });

    // Equipment with overdue service
    const overdueService = await Equipment.countDocuments({
      user: req.user._id,
      serviceExpiryDate: { $lt: today }
    });

    res.json({
      totalEquipment,
      activeEquipment,
      underMaintenance,
      upcomingService,
      overdueService
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
