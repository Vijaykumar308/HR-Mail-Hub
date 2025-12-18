
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
      trim: true,
      maxlength: [50, 'A user name must have less or equal than 50 characters'],
      minlength: [2, 'A user name must have more or equal than 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ['user', 'admin', 'REGULAR', 'ADMIN', 'SUPER_ADMIN'],
      default: 'REGULAR',
    },
    permissions: {
      hrDirectory: {
        access: { type: String, enum: ['enabled', 'disabled', 'not-set'], default: 'enabled' },
        create: { type: Boolean, default: false }, // Regulars can't create
        read: { type: String, enum: ['all', 'own', 'none'], default: 'all' }, // Regulars can view
        edit: { type: String, enum: ['all', 'own', 'none'], default: 'none' },
        delete: { type: Boolean, default: false },
      },
      templates: {
        access: { type: String, enum: ['enabled', 'disabled', 'not-set'], default: 'enabled' },
        create: { type: Boolean, default: true },
        read: { type: String, enum: ['all', 'own', 'none'], default: 'all' },
        edit: { type: String, enum: ['all', 'own', 'none'], default: 'own' },
        delete: { type: Boolean, default: true },
      },
      resumes: {
        access: { type: String, enum: ['enabled', 'disabled', 'not-set'], default: 'enabled' },
        create: { type: Boolean, default: true },
        read: { type: String, enum: ['all', 'own', 'none'], default: 'all' },
        edit: { type: String, enum: ['all', 'own', 'none'], default: 'own' },
        delete: { type: Boolean, default: true },
      },
      analytics: {
        access: { type: String, enum: ['enabled', 'disabled', 'not-set'], default: 'disabled' }, // Regulars don't need analytics
        read: { type: String, enum: ['all', 'own', 'none'], default: 'none' },
        create: { type: Boolean, default: false },
        edit: { type: String, enum: ['all', 'own', 'none'], default: 'none' },
        delete: { type: Boolean, default: false },
      },
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    notifications: {
      email: { type: Boolean, default: true },
      applicationUpdates: { type: Boolean, default: true },
      responseUpdates: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true },
    },
    emailSettings: {
      isConfigured: { type: Boolean, default: false },
      service: String, // e.g., 'gmail'
      host: String,
      port: Number,
      secure: { type: Boolean, default: false },
      auth: {
        user: String,
        pass: { type: String, select: false } // Encrypted password, not selected by default
      }
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash the password before saving
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    console.log('Password not modified, skipping hash');
    return next();
  }

  console.log('Hashing password...');
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  console.log('Password hashed');

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// Set passwordChangedAt when password is modified
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; // 1 second in the past to ensure token is created after
  next();
});

// Instance method to check password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if user changed password after the token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
