const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const auth = require('../middlewares/auth');
const signToken = auth.signToken;

// Signup a new user
exports.signup = catchAsync(async (req, res, next) => {
  console.log('Signup request received:', req.body);
  
  const { name, email, password, passwordConfirm } = req.body;

  // 1) Check if all required fields are provided
  if (!name || !email || !password || !passwordConfirm) {
    console.log('Missing required fields');
    return next(new AppError('Please provide all required fields', 400));
  }

  // 2) Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('Email already in use:', email);
    return next(new AppError('Email already in use', 400));
  }

  // 3) Create new user
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  }).catch(err => {
    console.error('Error creating user:', err);
    throw err;
  });

  console.log('New user created:', { id: newUser._id, email: newUser.email });

  // 4) Generate token
  const token = signToken(newUser._id);

  // 5) Remove password from output
  const userObj = newUser.toObject();
  delete userObj.password;
  delete userObj.passwordConfirm;

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

// Login user
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  const token = signToken(user._id);
  
  // 4) Remove password from output
  user.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

// Get current user
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
