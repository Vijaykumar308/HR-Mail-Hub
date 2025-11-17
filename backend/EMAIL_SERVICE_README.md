# Email Service Setup Guide

## Overview
The HR Mail Hub backend now includes a comprehensive email service built with Nodemailer that follows the write-once principle for easy configuration and maintenance.

## Setup Instructions

### 1. Environment Configuration
Add the following environment variables to your `.env` file:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USERNAME=vijaykumar@gmail.com
EMAIL_PASSWORD=234131dsf131
EMAIL_FROM=HR Mail Hub <noreply@hrmailhub.com>
```

### 2. Gmail SMTP Setup
For Gmail SMTP to work properly, you may need to:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password instead of using your regular password
3. Use the App Password in the `EMAIL_PASSWORD` field

### 3. Available Email Methods

#### Basic Email Sending
```javascript
const emailService = require('./src/services/email.service');

await emailService.sendEmail({
  to: 'recipient@example.com',
  subject: 'Custom Subject',
  text: 'Plain text content',
  html: '<h1>HTML content</h1>',
  attachments: [
    {
      filename: 'document.pdf',
      path: '/path/to/document.pdf'
    }
  ]
});
```

#### Welcome Email
```javascript
await emailService.sendWelcomeEmail({
  email: 'user@example.com',
  name: 'John Doe',
  password: 'tempPassword123' // optional
});
```

#### Password Reset Email
```javascript
await emailService.sendPasswordResetEmail({
  email: 'user@example.com',
  name: 'John Doe',
  resetToken: 'abc123token',
  resetUrl: 'http://localhost:3000/reset-password?token=abc123token'
});
```

#### Resume Submission Confirmation
```javascript
await emailService.sendResumeSubmissionEmail({
  email: 'applicant@example.com',
  name: 'Jane Smith',
  resumeName: 'jane_smith_resume.pdf'
});
```

#### HR Team Notification
```javascript
await emailService.sendHRNotificationEmail({
  hrEmails: ['hr1@company.com', 'hr2@company.com'],
  subject: 'New Application: Senior Developer',
  message: 'A new application has been received.',
  applicantInfo: {
    name: 'Jane Smith',
    email: 'applicant@example.com',
    phone: '+1234567890',
    position: 'Senior Developer'
  }
});
```

## Features

### ✅ Write-Once Principle
- All email configuration is centralized in `config/config.js`
- SMTP credentials are stored in environment variables
- Easy to change email provider or credentials without code changes

### ✅ Comprehensive Email Templates
- Professional HTML email templates with responsive design
- Built-in templates for common use cases (welcome, password reset, etc.)
- Customizable branding and styling

### ✅ Error Handling & Logging
- Comprehensive error handling with try-catch blocks
- Detailed logging for email delivery status
- Integration with existing Winston logger

### ✅ Security Features
- Input sanitization and validation
- Secure SMTP connection options
- Protection against email injection attacks

### ✅ Testing & Examples
- Built-in test suite for verification
- Usage examples for all email types
- Easy-to-understand API documentation

## File Structure

```
backend/
├── src/
│   ├── config/
│   │   └── config.js                 # Email configuration
│   ├── services/
│   │   └── email.service.js          # Main email service
│   ├── examples/
│   │   └── email-examples.js         # Usage examples
│   └── tests/
│       └── email.test.js             # Test suite
├── .env.example                       # Environment variables template
└── update-env.txt                    # Current SMTP credentials
```

## Testing the Email Service

Run the email service test to verify everything works:

```bash
cd backend
node src/tests/email.test.js
```

## Integration with Existing Code

To integrate the email service into your existing controllers:

```javascript
const emailService = require('../services/email.service');

// In your auth controller after user registration
const registerUser = async (req, res, next) => {
  try {
    // ... your user registration logic ...
    
    // Send welcome email
    await emailService.sendWelcomeEmail({
      email: newUser.email,
      name: newUser.name
    });
    
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully'
    });
  } catch (error) {
    next(error);
  }
};
```

## Configuration Options

### Email Provider Support
The service supports multiple email providers:
- Gmail (default)
- Outlook/Hotmail
- Yahoo Mail
- Custom SMTP servers

### Customization Options
- Email templates can be customized in the service file
- CSS styling can be modified for brand consistency
- Additional email methods can be added as needed

## Troubleshooting

### Common Issues

1. **Gmail Authentication Error**
   - Enable 2-factor authentication
   - Generate and use an App Password
   - Check "Less secure app access" settings

2. **Connection Timeout**
   - Verify SMTP host and port settings
   - Check firewall/network connectivity
   - Ensure EMAIL_SECURE is set correctly

3. **Email Not Sending**
   - Check environment variables are loaded
   - Verify email credentials
   - Check logs for detailed error messages

### Debug Mode
Enable debug logging by setting:
```env
LOG_LEVEL=debug
```

This will provide detailed information about email sending attempts.

## Security Notes

- Never commit email credentials to version control
- Use environment variables for all sensitive data
- Consider using email delivery services like SendGrid for production
- Implement rate limiting for email sending endpoints
- Validate and sanitize all email inputs

## Production Recommendations

1. Use a dedicated email service (SendGrid, Mailgun, etc.) for better deliverability
2. Set up proper DNS records (SPF, DKIM, DMARC)
3. Monitor email delivery rates and bounce handling
4. Implement email queueing for high-volume sending
5. Set up email analytics and tracking

## Support

For issues or questions about the email service:
1. Check the logs in the `logs/` directory
2. Run the test suite to verify functionality
3. Review the configuration in `config/config.js`
4. Check environment variables are properly set
