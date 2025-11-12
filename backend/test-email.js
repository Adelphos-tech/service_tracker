import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import { sendServiceReminderEmail, sendWelcomeEmail } from './utils/emailService.js';

console.log('🧪 Testing Email Service...\n');

// Test data - Use the email you signed up with on Resend
const testUser = {
  name: 'Test User',
  email: 'pidacabi@denipl.com' // Change this to your Resend signup email
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
    console.error('1. RESEND_API_KEY is set correctly in .env file');
    console.error('2. API key starts with "re_"');
    console.error('3. EMAIL_FROM uses onboarding@resend.dev for free tier');
    console.error('4. You have not exceeded Resend free tier limits (100 emails/day)\n');
    console.error('\nSee RESEND_SETUP.md for detailed setup instructions');
    process.exit(1);
  }
}

// Run tests
testEmails();
