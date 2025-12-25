const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const config = require('../config/config');

exports.signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || config.jwt.secret, {
    expiresIn: config.jwt.accessExpirationMinutes * 60,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = exports.signToken(user._id);

  // Remove password from output
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.passwordConfirm;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: userObj,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, 201, req, res);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
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
    createSendToken(user, 200, req, res);
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET || config.jwt.secret
    );

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user role is included in allowed roles
    // We normalize to uppercase for comparison to handle both 'admin' and 'ADMIN' if needed,
    // but best to just check inclusion directly.
    // We'll support both legacy lowercase and new uppercase by ensuring the caller provides the correct ones
    // or we check loosely.

    const userRole = req.user.role;
    // Allow 'admin' to pass for 'ADMIN' checks and vice versa if we want be loose, 
    // but strict is better. I will assume the db has the strict value.
    // However, since I added both to enum, I should probably check against the user's role.

    // Fix: Remove the 'false &&' which was disabling auth!
    if (!roles.includes(userRole)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

// Check module permissions
exports.checkPermission = (moduleName, action) => {
  return (req, res, next) => {
    // Super Admins have full access
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    // Admins and Regular users are checked against permissions
    const permission = req.user.permissions?.[moduleName];

    if (!permission) {
      return next(new AppError('Permission not configured for this module', 403));
    }

    // Check Access
    if (permission.access !== 'enabled') {
      return next(new AppError('Module access is disabled', 403));
    }

    // Check specific actions
    if (action === 'create' && !permission.create) {
      return next(new AppError('You do not have permission to create in this module', 403));
    }

    if (action === 'delete' && !permission.delete) {
      return next(new AppError('You do not have permission to delete in this module', 403));
    }

    if (action === 'read' && permission.read === 'none') {
      return next(new AppError('You do not have permission to read this module', 403));
    }

    if (action === 'edit' && permission.edit === 'none') {
      return next(new AppError('You do not have permission to edit this module', 403));
    }

    // Pass permission details to request for controllers to use (e.g. filtering 'own' vs 'all')
    req.permission = permission;
    next();
  };
};

// Alias for restrictTo
exports.authorize = this.restrictTo;

// Alias for protect
exports.authenticate = this.protect;
