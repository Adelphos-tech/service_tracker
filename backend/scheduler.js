import cron from 'node-cron';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Equipment from './models/Equipment.js';
import User from './models/User.js';
import { sendServiceReminderEmail } from './utils/emailService.js';

dotenv.config();

// Connect to database
connectDB();

// Function to check and send service reminders
const checkServiceReminders = async () => {
  try {
    console.log('Running service reminder check...');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate date 7 days from now
    const reminderDate = new Date(today);
    reminderDate.setDate(reminderDate.getDate() + 7);
    reminderDate.setHours(23, 59, 59, 999);

    // Find equipment with service expiry between today and 7 days from now
    // that hasn't had a notification sent yet
    const equipmentList = await Equipment.find({
      serviceExpiryDate: {
        $gte: today,
        $lte: reminderDate
      },
      notificationSent: false
    }).populate('user', 'email name');

    console.log(`Found ${equipmentList.length} equipment items requiring service reminders`);

    for (const equipment of equipmentList) {
      try {
        const user = equipment.user;
        
        if (user && user.email) {
          console.log(`Sending reminder for ${equipment.title} to ${user.email}`);
          
          const emailSent = await sendServiceReminderEmail(user.email, equipment);
          
          if (emailSent) {
            // Mark notification as sent
            equipment.notificationSent = true;
            await equipment.save();
            console.log(`✓ Reminder sent successfully for ${equipment.title}`);
          } else {
            console.log(`✗ Failed to send reminder for ${equipment.title}`);
          }
        }
      } catch (error) {
        console.error(`Error sending reminder for equipment ${equipment._id}:`, error);
      }
    }

    console.log('Service reminder check completed');
  } catch (error) {
    console.error('Error in checkServiceReminders:', error);
  }
};

// Schedule the task to run daily at 9:00 AM
cron.schedule('0 9 * * *', () => {
  console.log('Scheduled task triggered at', new Date().toLocaleString());
  checkServiceReminders();
});

console.log('Scheduler started. Service reminders will be checked daily at 9:00 AM');
console.log('Running initial check now...');

// Run once on startup
checkServiceReminders();

// Keep the process running
process.on('SIGINT', () => {
  console.log('Scheduler shutting down...');
  process.exit(0);
});
