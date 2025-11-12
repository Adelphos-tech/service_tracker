import mongoose from 'mongoose';

const serviceHistorySchema = new mongoose.Schema({
  serviceDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  performedBy: {
    type: String
  },
  cost: {
    type: Number
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const equipmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add equipment title'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Please add equipment model'],
    trim: true
  },
  serialNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  description: {
    type: String,
    required: [true, 'Please add equipment description']
  },
  category: {
    type: String,
    enum: ['Electronics', 'Machinery', 'Tools', 'Vehicles', 'IT Equipment', 'Medical', 'Laboratory', 'Other'],
    default: 'Other'
  },
  location: {
    type: String,
    trim: true
  },
  purchaseDate: {
    type: Date
  },
  purchasePrice: {
    type: Number
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Under Maintenance', 'Retired'],
    default: 'Active'
  },
  qrCode: {
    type: String,
    required: true
  },
  qrCodeData: {
    type: String,
    required: true,
    unique: true
  },
  serviceExpiryDate: {
    type: Date
  },
  calibrationExpiryDate: {
    type: Date
  },
  lastServiceDate: {
    type: Date
  },
  serviceInterval: {
    type: Number, // in days
    default: 90
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  serviceHistory: [serviceHistorySchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
equipmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Equipment', equipmentSchema);
