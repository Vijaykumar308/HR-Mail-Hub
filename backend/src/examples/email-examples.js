const emailService = require('./src/services/email.service');

// Example usage of the email service

// 1. Send welcome email
const sendWelcomeEmail = async (user) => {
  try {
    await emailService.sendWelcomeEmail({
      email: 'user@example.com',
      name: 'John Doe',
      password: 'tempPassword123' // optional
    });
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

// 2. Send password reset email
const sendPasswordReset = async () => {
  try {
    await emailService.sendPasswordResetEmail({
      email: 'user@example.com',
      name: 'John Doe',
      resetToken: 'abc123token',
      resetUrl: 'http://localhost:3000/reset-password?token=abc123token'
    });
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

// 3. Send resume submission confirmation
const sendResumeConfirmation = async () => {
  try {
    await emailService.sendResumeSubmissionEmail({
      email: 'applicant@example.com',
      name: 'Jane Smith',
      resumeName: 'jane_smith_resume.pdf'
    });
    console.log('Resume submission email sent successfully');
  } catch (error) {
    console.error('Error sending resume submission email:', error);
  }
};

// 4. Send HR notification
const sendHRNotification = async () => {
  try {
    await emailService.sendHRNotificationEmail({
      hrEmails: ['hr1@company.com', 'hr2@company.com'],
      subject: 'New Application: Senior Developer',
      message: 'A new application has been received for the Senior Developer position.',
      applicantInfo: {
        name: 'Jane Smith',
        email: 'applicant@example.com',
        phone: '+1234567890',
        position: 'Senior Developer'
      }
    });
    console.log('HR notification email sent successfully');
  } catch (error) {
    console.error('Error sending HR notification email:', error);
  }
};

// 5. Send custom email
const sendCustomEmail = async () => {
  try {
    await emailService.sendEmail({
      to: 'recipient@example.com',
      subject: 'Custom Email Subject',
      text: 'This is the plain text version of the email.',
      html: '<h1>This is the HTML version</h1><p>You can use any HTML here.</p>',
      attachments: [
        {
          filename: 'document.pdf',
          path: '/path/to/document.pdf'
        }
      ]
    });
    console.log('Custom email sent successfully');
  } catch (error) {
    console.error('Error sending custom email:', error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordReset,
  sendResumeConfirmation,
  sendHRNotification,
  sendCustomEmail
};
