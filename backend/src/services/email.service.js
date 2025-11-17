const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../utils/logger');
const catchAsync = require('../utils/catchAsync');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  /**
   * Initialize the email transporter
   */
  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        service: config.email.service,
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
          user: config.email.auth.user,
          pass: config.email.auth.pass,
        },
      });

      // Verify transporter connection
      this.transporter.verify((error, success) => {
        if (error) {
          logger.error('Email transporter verification failed:', error);
        } else {
          logger.info('Email transporter is ready to send messages');
        }
      });
    } catch (error) {
      logger.error('Failed to initialize email transporter:', error);
    }
  }

  /**
   * Send email using the configured transporter
   * @param {Object} mailOptions - Email options
   * @param {string} mailOptions.to - Recipient email
   * @param {string} mailOptions.subject - Email subject
   * @param {string} mailOptions.text - Plain text content
   * @param {string} mailOptions.html - HTML content
   * @param {Array} mailOptions.attachments - Optional attachments
   * @returns {Promise} - Promise that resolves with the send result
   */
  sendEmail = catchAsync(async (mailOptions) => {
    if (!this.transporter) {
      throw new Error('Email transporter not initialized');
    }

    const emailOptions = {
      from: config.email.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
      ...mailOptions.attachments && { attachments: mailOptions.attachments }
    };

    const info = await this.transporter.sendMail(emailOptions);
    
    logger.info(`Email sent successfully to ${mailOptions.to}`, {
      messageId: info.messageId,
      subject: mailOptions.subject
    });

    return info;
  });

  /**
   * Send welcome email to new user
   * @param {Object} user - User object
   * @param {string} user.email - User email
   * @param {string} user.name - User name
   * @param {string} user.password - Temporary password (if applicable)
   */
  sendWelcomeEmail = catchAsync(async (user) => {
    const subject = 'Welcome to HR Mail Hub';
    const html = this.getWelcomeEmailTemplate(user);
    const text = `Welcome to HR Mail Hub, ${user.name}! Your account has been successfully created.`;

    return this.sendEmail({
      to: user.email,
      subject,
      text,
      html
    });
  });

  /**
   * Send password reset email
   * @param {Object} options - Reset options
   * @param {string} options.email - User email
   * @param {string} options.name - User name
   * @param {string} options.resetToken - Password reset token
   * @param {string} options.resetUrl - Password reset URL
   */
  sendPasswordResetEmail = catchAsync(async (options) => {
    const subject = 'Password Reset Request - HR Mail Hub';
    const html = this.getPasswordResetEmailTemplate(options);
    const text = `Hi ${options.name}, You requested a password reset. Click the link to reset your password: ${options.resetUrl}`;

    return this.sendEmail({
      to: options.email,
      subject,
      text,
      html
    });
  });

  /**
   * Send resume submission confirmation email
   * @param {Object} options - Resume options
   * @param {string} options.email - User email
   * @param {string} options.name - User name
   * @param {string} options.resumeName - Resume file name
   */
  sendResumeSubmissionEmail = catchAsync(async (options) => {
    const subject = 'Resume Submitted Successfully - HR Mail Hub';
    const html = this.getResumeSubmissionEmailTemplate(options);
    const text = `Hi ${options.name}, Your resume "${options.resumeName}" has been successfully submitted.`;

    return this.sendEmail({
      to: options.email,
      subject,
      text,
      html
    });
  });

  /**
   * Send notification email to HR team
   * @param {Object} options - Notification options
   * @param {Array} options.hrEmails - HR team emails
   * @param {string} options.subject - Email subject
   * @param {string} options.message - Email message
   * @param {Object} options.applicantInfo - Applicant information
   */
  sendHRNotificationEmail = catchAsync(async (options) => {
    const html = this.getHRNotificationEmailTemplate(options);
    const text = `New resume submission: ${options.message}`;

    const promises = options.hrEmails.map(hrEmail => 
      this.sendEmail({
        to: hrEmail,
        subject: options.subject,
        text,
        html
      })
    );

    return Promise.all(promises);
  });

  /**
   * Get welcome email HTML template
   * @param {Object} user - User object
   * @returns {string} HTML template
   */
  getWelcomeEmailTemplate(user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to HR Mail Hub</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to HR Mail Hub</h1>
          </div>
          <div class="content">
            <p>Hi ${user.name},</p>
            <p>Welcome to HR Mail Hub! Your account has been successfully created. We're excited to have you on board.</p>
            <p>HR Mail Hub is your comprehensive platform for managing job applications and resume submissions.</p>
            ${user.password ? `<p>Your temporary password is: <strong>${user.password}</strong></p>` : ''}
            <p>Please log in to your account to get started.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">Login to Your Account</a>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            <p>Best regards,<br>The HR Mail Hub Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 HR Mail Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get password reset email HTML template
   * @param {Object} options - Reset options
   * @returns {string} HTML template
   */
  getPasswordResetEmailTemplate(options) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset - HR Mail Hub</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 10px; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi ${options.name},</p>
            <p>You requested a password reset for your HR Mail Hub account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${options.resetUrl}" class="button">Reset Password</a>
            <div class="warning">
              <p><strong>Important:</strong> This link will expire in 10 minutes for security reasons.</p>
              <p>If you didn't request this password reset, please ignore this email.</p>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>${options.resetUrl}</p>
            <p>Best regards,<br>The HR Mail Hub Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 HR Mail Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get resume submission email HTML template
   * @param {Object} options - Resume options
   * @returns {string} HTML template
   */
  getResumeSubmissionEmailTemplate(options) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Resume Submitted - HR Mail Hub</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .success { background: #d1fae5; border: 1px solid #a7f3d0; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Resume Submitted Successfully</h1>
          </div>
          <div class="content">
            <p>Hi ${options.name},</p>
            <div class="success">
              <h3>✅ Your resume has been successfully submitted!</h3>
              <p><strong>Resume Name:</strong> ${options.resumeName}</p>
              <p><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <p>Our HR team will review your resume and get back to you soon.</p>
            <p>You can track the status of your application by logging into your account.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">View Your Dashboard</a>
            <p>Thank you for choosing HR Mail Hub for your job application needs.</p>
            <p>Best regards,<br>The HR Mail Hub Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 HR Mail Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get HR notification email HTML template
   * @param {Object} options - Notification options
   * @returns {string} HTML template
   */
  getHRNotificationEmailTemplate(options) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Resume Submission - HR Mail Hub</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .info-box { background: #fef3c7; border: 1px solid #fcd34d; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 24px; background: #f59e0b; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .applicant-info { background: #f3f4f6; padding: 15px; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Resume Submission</h1>
          </div>
          <div class="content">
            <p>Dear HR Team,</p>
            <div class="info-box">
              <h3>📋 New Application Received</h3>
              <p>${options.message}</p>
            </div>
            ${options.applicantInfo ? `
              <div class="applicant-info">
                <h4>Applicant Information:</h4>
                <p><strong>Name:</strong> ${options.applicantInfo.name || 'N/A'}</p>
                <p><strong>Email:</strong> ${options.applicantInfo.email || 'N/A'}</p>
                <p><strong>Phone:</strong> ${options.applicantInfo.phone || 'N/A'}</p>
                <p><strong>Position:</strong> ${options.applicantInfo.position || 'N/A'}</p>
              </div>
            ` : ''}
            <p>Please review the application in the HR Mail Hub dashboard.</p>
            <a href="${process.env.ADMIN_URL || 'http://localhost:3000'}/admin" class="button">Review Application</a>
            <p>This is an automated notification from HR Mail Hub.</p>
            <p>Best regards,<br>HR Mail Hub System</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 HR Mail Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

// Create and export singleton instance
const emailService = new EmailService();

module.exports = emailService;
