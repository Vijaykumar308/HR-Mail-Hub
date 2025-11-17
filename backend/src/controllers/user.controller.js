const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const emailService = require('../services/email.service');

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
    // Add other fields as needed
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

// Update user
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
