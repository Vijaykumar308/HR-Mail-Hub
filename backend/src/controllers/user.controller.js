const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
