import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

export const sendServiceReminderEmail = async (userEmail, equipment) => {
  try {
    const transporter = createTransporter();

    const daysUntilExpiry = Math.ceil(
      (new Date(equipment.serviceExpiryDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: `Service Reminder: ${equipment.title} - Due in ${daysUntilExpiry} days`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .equipment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #64748b; }
            .value { color: #1e293b; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #64748b; margin-top: 30px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔧 Service Reminder</h1>
            </div>
            <div class="content">
              <div class="warning">
                <strong>⚠️ Attention Required!</strong><br>
                The following equipment requires service in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}.
              </div>
              
              <div class="equipment-details">
                <h2 style="margin-top: 0; color: #1e293b;">${equipment.title}</h2>
                <div class="detail-row">
                  <span class="label">Model:</span>
                  <span class="value">${equipment.model}</span>
                </div>
                ${equipment.serialNumber ? `
                <div class="detail-row">
                  <span class="label">Serial Number:</span>
                  <span class="value">${equipment.serialNumber}</span>
                </div>
                ` : ''}
                ${equipment.location ? `
                <div class="detail-row">
                  <span class="label">Location:</span>
                  <span class="value">${equipment.location}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                  <span class="label">Service Due Date:</span>
                  <span class="value" style="color: #dc2626; font-weight: bold;">
                    ${new Date(equipment.serviceExpiryDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>

              <p>Please schedule the necessary service or calibration to ensure continued operation and compliance.</p>

              <center>
                <a href="${process.env.FRONTEND_URL}/equipment/${equipment._id}" class="button">
                  View Equipment Details
                </a>
              </center>

              <div class="footer">
                <p>This is an automated reminder from Equipment Tracker System</p>
                <p>Please do not reply to this email</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: 'Welcome to Equipment Tracker',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Equipment Tracker! 🎉</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>Thank you for registering with Equipment Tracker. You can now:</p>
              <ul>
                <li>Add and manage your equipment inventory</li>
                <li>Generate QR codes for easy tracking</li>
                <li>Schedule and track maintenance</li>
                <li>Receive automated service reminders</li>
              </ul>
              <center>
                <a href="${process.env.FRONTEND_URL}/login" class="button">Get Started</a>
              </center>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};
