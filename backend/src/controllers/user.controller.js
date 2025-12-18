const User = require('../models/user.model');
const Resume = require('../models/Resume');
const path = require('path');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const emailService = require('../services/email.service');
const HRDirectory = require('../models/hrDirectory.model');
const config = require('../config/config');
const encryption = require('../utils/encryption');

// Get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-__v');

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

// Get single user
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-__v');

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Create new user
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    permissions: req.body.permissions || {}, // Use provided permissions or trigger defaults
  });

  // Remove sensitive data from output
  newUser.__v = undefined;

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

// Filter object helper
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Update current user data
exports.updateMe = catchAsync(async (req, res, next) => {
  console.log('updateMe called with body:', req.body);
  console.log('User ID:', req.user.id);

  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email', 'notifications');
  console.log('Filtered body:', filteredBody);

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  console.log('Updated user:', updatedUser);

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// Update email settings
exports.updateEmailSettings = catchAsync(async (req, res, next) => {
  const { service, host, port, secure, auth } = req.body;

  // Prepare update object
  const emailSettings = {
    isConfigured: true,
    service: service || undefined, // Allow purely custom host/port
    host,
    port,
    secure,
    auth: {
      user: auth.user,
    }
  };

  // Encrypt password if provided
  if (auth.pass) {
    emailSettings.auth.pass = encryption.encrypt(auth.pass);
  } else {
    // If updating other settings but keeping password
    const user = await User.findById(req.user.id).select('+emailSettings.auth.pass');
    if (user.emailSettings && user.emailSettings.auth && user.emailSettings.auth.pass) {
      emailSettings.auth.pass = user.emailSettings.auth.pass;
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { emailSettings },
    { new: true, runValidators: true }
  );

  // Don't send back the encrypted password
  if (user.emailSettings && user.emailSettings.auth) {
    user.emailSettings.auth.pass = undefined;
  }

  res.status(200).json({
    status: 'success',
    data: {
      emailSettings: user.emailSettings
    }
  });
});

// Verify email settings
exports.verifyEmailSettings = catchAsync(async (req, res, next) => {
  const { service, host, port, secure, auth } = req.body;

  // We need to resolve the password. 
  // If provided in body, use it. 
  // If not, fetch from DB (if user has existing config).
  let password = auth ? auth.pass : undefined;

  if (!password) {
    const user = await User.findById(req.user.id).select('+emailSettings.auth.pass');
    if (user.emailSettings && user.emailSettings.auth) {
      password = user.emailSettings.auth.pass ? encryption.decrypt(user.emailSettings.auth.pass) : undefined;
    }
  }

  if (!password) {
    return next(new AppError('Password is required to verify settings.', 400));
  }

  // Construct settings object for verification
  const settingsToVerify = {
    isConfigured: true,
    service,
    host,
    port,
    secure,
    auth: {
      user: auth ? auth.user : undefined,
      pass: encryption.encrypt(password) // createTransporter expects encrypted pass to decrypt it, or we can adjust logic.
      // Wait, emailService.createTransporter decrypts it. 
      // So if we pass it here, we should pass it in the format createTransporter expects.
      // Actually, let's look at emailService.createTransporter. It expects `userSettings.auth.pass` to be encrypted.
    }
  };

  try {
    await emailService.verifyConnection(settingsToVerify);
    res.status(200).json({
      status: 'success',
      message: 'Connection verified successfully'
    });
  } catch (error) {
    return next(new AppError(`Connection failed: ${error.message}`, 400));
  }
});

// Get email settings
exports.getEmailSettings = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const settings = user.emailSettings ? user.emailSettings.toObject() : {};

  if (settings.auth) {
    settings.auth.pass = undefined; // Never return password
  }

  res.status(200).json({
    status: 'success',
    data: {
      emailSettings: settings
    }
  });
});

// Update user (Admin)
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  user.__v = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Test email functionality
exports.testEmail = catchAsync(async (req, res, next) => {
  await emailService.sendEmail({
    to: 'jwvijaykumar@gmail.com',
    subject: 'HR Mail Hub - Email Service Test',
    text: 'This is a test email from HR Mail Hub email service.',
    html: `
      <h1>Email Service Test</h1>
      <p>This is a test email from HR Mail Hub email service.</p>
      <p>If you receive this, the email service is working correctly!</p>
      <p>Timestamp: ${new Date().toISOString()}</p>
    `
  });

  res.status(200).json({
    status: 'success',
    message: 'Test email sent successfully to jwvijaykumar@gmail.com'
  });
});

// Test welcome email
exports.testWelcomeEmail = catchAsync(async (req, res, next) => {
  await emailService.sendWelcomeEmail({
    email: 'jwvijaykumar@gmail.com',
    name: 'Test User',
    password: 'TestPass123'
  });

  res.status(200).json({
    status: 'success',
    message: 'Welcome email test sent successfully'
  });
});

// Test password reset email
exports.testPasswordResetEmail = catchAsync(async (req, res, next) => {
  await emailService.sendPasswordResetEmail({
    email: 'jwvijaykumar@gmail.com',
    name: 'Test User',
    resetToken: 'test-token-123',
    resetUrl: 'http://localhost:3000/reset-password?token=test-token-123'
  });

  res.status(200).json({
    status: 'success',
    message: 'Password reset email test sent successfully'
  });
});

// Send custom email
exports.sendEmail = catchAsync(async (req, res, next) => {
  // Fetch user settings with password
  const user = await User.findById(req.user.id).select('+emailSettings.auth.pass');

  const { recipients, subject, message, resumeId } = req.body;

  // Check resume share limit for each recipient
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  for (const recipient of recipients) {
    if (recipient.id) {
      const hrContact = await HRDirectory.findById(recipient.id);
      if (hrContact) {
        const recentShares = hrContact.resumeShareHistory.filter(
          share => share.timestamp >= oneWeekAgo
        ).length;

        if (recentShares >= config.resumeShareLimit.weekly) {
          return next(new AppError(`Resume share limit reached for ${hrContact.name} (${hrContact.company}). Max ${config.resumeShareLimit.weekly} times per week.`, 400));
        }
      }
    }
  }

  let attachments = [];
  if (resumeId) {
    const resume = await Resume.findById(resumeId);
    if (resume) {
      attachments.push({
        filename: resume.originalName,
        path: path.join(__dirname, '../..', resume.filePath)
      });
    }
  }

  // Send email to each recipient
  const emailPromises = recipients.map(recipient =>
    emailService.sendEmail({
      to: recipient.email,
      subject,
      text: message,
      attachments,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${subject}</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            This email was sent via HR Mail Hub<br>
            If you didn't expect this email, you can safely ignore it.
          </p>
        </div>
      `
    }, user ? user.emailSettings : null)
  );

  await Promise.all(emailPromises);

  // Update HR contacts
  for (const recipient of recipients) {
    if (recipient.id) {
      await HRDirectory.findByIdAndUpdate(recipient.id, {
        $inc: { resumesShared: 1 },
        $push: { resumeShareHistory: { timestamp: new Date() } },
        $set: { lastContacted: new Date() }
      });
    }
  }

  res.status(200).json({
    status: 'success',
    message: `Email sent successfully to ${recipients.length} recipient(s)`
  });
});

// Send bulk email to multiple recipients
exports.sendBulkEmail = catchAsync(async (req, res, next) => {
  const { recipients, subject, message, resumeId } = req.body;

  // Check resume share limit for each recipient
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  for (const recipient of recipients) {
    if (recipient.id) {
      const hrContact = await HRDirectory.findById(recipient.id);
      if (hrContact) {
        const recentShares = hrContact.resumeShareHistory.filter(
          share => share.timestamp >= oneWeekAgo
        ).length;

        if (recentShares >= config.resumeShareLimit.weekly) {
          return next(new AppError(`Resume share limit reached for ${hrContact.name} (${hrContact.company}). Max ${config.resumeShareLimit.weekly} times per week.`, 400));
        }
      }
    }
  }

  let attachments = [];
  if (resumeId) {
    const resume = await Resume.findById(resumeId);
    if (resume) {
      attachments.push({
        filename: resume.originalName,
        path: path.join(__dirname, '../..', resume.filePath)
      });
    }
  }

  // Send email to each recipient
  const emailPromises = recipients.map(recipient =>
    emailService.sendEmail({
      to: recipient.email,
      subject,
      text: message,
      attachments,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${subject}</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            This email was sent via HR Mail Hub<br>
            If you didn't expect this email, you can safely ignore it.
          </p>
        </div>
      `
    })
  );

  await Promise.all(emailPromises);

  // Update HR contacts
  for (const recipient of recipients) {
    if (recipient.id) {
      await HRDirectory.findByIdAndUpdate(recipient.id, {
        $inc: { resumesShared: 1 },
        $push: { resumeShareHistory: { timestamp: new Date() } },
        $set: { lastContacted: new Date() }
      });
    }
  }

  res.status(200).json({
    status: 'success',
    message: `Bulk email sent successfully to ${recipients.length} recipient(s)`
  });
});

// Test resume submission email
exports.testResumeSubmissionEmail = catchAsync(async (req, res, next) => {
  await emailService.sendResumeSubmissionEmail({
    email: 'jwvijaykumar@gmail.com',
    name: 'Test User',
    resumeName: 'test_resume.pdf'
  });

  res.status(200).json({
    status: 'success',
    message: 'Resume submission email test sent successfully'
  });
});
