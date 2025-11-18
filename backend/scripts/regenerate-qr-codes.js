import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Equipment from '../models/Equipment.js';
import { generateQRCode } from '../utils/qrCodeGenerator.js';

// Load environment variables
dotenv.config();

const regenerateQRCodes = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
    console.log(`Using FRONTEND_URL: ${process.env.FRONTEND_URL}`);

    // Get all equipment
    const allEquipment = await Equipment.find({});
    console.log(`Found ${allEquipment.length} equipment items`);

    let updated = 0;
    let failed = 0;

    // Regenerate QR codes for each equipment
    for (const equipment of allEquipment) {
      try {
        console.log(`\nRegenerating QR code for: ${equipment.title} (${equipment._id})`);
        
        // Generate new QR code with correct FRONTEND_URL
        const { qrCode, qrCodeData } = await generateQRCode(equipment._id);
        
        // Update equipment
        equipment.qrCode = qrCode;
        equipment.qrCodeData = qrCodeData;
        await equipment.save();
        
        console.log(`✅ Updated: ${equipment.title}`);
        console.log(`   New QR URL: ${qrCodeData}`);
        updated++;
      } catch (error) {
        console.error(`❌ Failed to update ${equipment.title}:`, error.message);
        failed++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('QR Code Regeneration Complete');
    console.log('='.repeat(60));
    console.log(`✅ Successfully updated: ${updated}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total: ${allEquipment.length}`);
    console.log('='.repeat(60));

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error regenerating QR codes:', error);
    process.exit(1);
  }
};

// Run the script
regenerateQRCodes();
