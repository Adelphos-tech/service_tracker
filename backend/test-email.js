import dotenv from 'dotenv';
import { sendServiceReminderEmail, sendWelcomeEmail } from './utils/emailService.js';

// Load environment variables
dotenv.config();

console.log('🧪 Testing Email Service...\n');

// Test data
const testUser = {
  name: 'Shivang Singh',
  email: 'shivangsingh191@gmail.com'
};

const testEquipment = {
  title: 'Test Laser Cutter',
  model: 'LC-2000X',
  serialNumber: 'TEST-001',
  location: 'Lab A',
  serviceExpiryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) // 6 days from now
};

async function testEmails() {
  try {
    console.log('📧 Test 1: Sending Welcome Email...');
    await sendWelcomeEmail(testUser.email, testUser.name);
    console.log('✅ Welcome email sent successfully!\n');

    console.log('📧 Test 2: Sending Service Reminder Email...');
    await sendServiceReminderEmail(testUser.email, testEquipment);
    console.log('✅ Service reminder email sent successfully!\n');

    console.log('🎉 All tests passed! Check your inbox at:', testUser.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('\nPlease check:');
    console.error('1. EMAIL_USER is set correctly');
    console.error('2. EMAIL_PASSWORD is your Gmail App Password (not regular password)');
    console.error('3. 2-Step Verification is enabled on Gmail');
    console.error('4. All EMAIL_* variables are set in .env file\n');
    process.exit(1);
  }
}

// Run tests
testEmails();
