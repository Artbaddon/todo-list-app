import pkg from 'nodemailer';
const { createTransport } = pkg;
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Nodemailer transporter
const transporter = createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Use app password for Gmail
  }
});

export const sendTaskNotification = async (notificationEmail, taskData) => {
  try {
    // Step 1: Render EJS template
    const templatePath = path.join(__dirname, '../../emails/task-created.ejs');
    
    const emailHtml = await ejs.renderFile(templatePath, {
      taskTitle: taskData.title,
      taskDescription: taskData.description,
      taskPriority: taskData.priority,
      taskType: taskData.type,
      startDate: new Date(taskData.startDate).toLocaleDateString(),
      endDate: new Date(taskData.endDate).toLocaleDateString(),
      assignedUsers: taskData.assignedTo || [],
      tags: taskData.tags || [],
      filesCount: taskData.files ? taskData.files.length : 0
    });

    // Step 2: Send email via Nodemailer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: notificationEmail,
      subject: `New Task Created: ${taskData.title}`,
      html: emailHtml
    };

    // Step 3: Send email
    const result = await transporter.sendMail(mailOptions);

    console.log('Task notification email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Test function - remove after testing
export const testEmail = async () => {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'Nodemailer Test',
      html: '<h1>✅ Nodemailer is working!</h1><p>Your email setup is successful.</p>'
    });
    
    console.log('Test email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Test email failed:', error);
    return { success: false, error: error.message };
  }
};

