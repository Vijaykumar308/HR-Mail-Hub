const mongoose = require('mongoose');

const hrDirectorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'HR name is required'],
      trim: true,
      maxlength: [100, 'HR name must have less or equal than 100 characters'],
      minlength: [2, 'HR name must have more or equal than 2 characters']
    },
    email: {
      type: String,
      required: [true, 'HR email is required'],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          // Basic email validation regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: 'Please provide a valid email address'
      }
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name must have less or equal than 100 characters']
    },
    website: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Optional URL validation
          if (!v) return true;
          return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
        },
        message: 'Please provide a valid URL'
      }
    },
    companySize: {
      type: String,
      trim: true
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      enum: {
        values: [
          'IT Services',
          'Software Engineering',
          'Healthcare',
          'Finance',
          'Education',
          'Manufacturing',
          'Retail',
          'Consulting',
          'Telecommunications',
          'Banking',
          'Insurance',
          'Real Estate',
          'Hospitality',
          'Media & Entertainment',
          'Logistics & Supply Chain',
          'Pharmaceuticals',
          'Energy & Utilities',
          'Government',
          'Non-Profit',
          'Other'
        ],
        message: 'Please select a valid industry'
      }
    },
    linkedIn: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [200, 'Location must have less or equal than 200 characters']
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (phone) {
          // Optional field - if provided, validate phone format
          if (!phone) return true;
          return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
        },
        message: 'Please provide a valid phone number'
      }
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['active', 'inactive', 'pending'],
        message: 'Status must be either active, inactive, or pending'
      },
      default: 'active'
    },
    lastContacted: {
      type: Date,
      default: Date.now
    },
    resumesShared: {
      type: Number,
      default: 0,
      min: [0, 'Resumes shared cannot be negative']
    },
    resumeShareHistory: [{
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes must have less or equal than 1000 characters']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'HR contact must be created by a user']
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false
    },
    deletedAt: {
      type: Date,
      select: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for better search performance
hrDirectorySchema.index({ name: 1 });
hrDirectorySchema.index({ company: 1 });
hrDirectorySchema.index({ industry: 1 });
hrDirectorySchema.index({ location: 1 });
hrDirectorySchema.index({ email: 1 });
hrDirectorySchema.index({ status: 1 });

// Virtual for full name with company
hrDirectorySchema.virtual('fullDisplayName').get(function () {
  return `${this.name} - ${this.company}`;
});

// Pre-save middleware to update lastContacted when resumesShared changes
hrDirectorySchema.pre('save', function (next) {
  if (this.isModified('resumesShared') && this.resumesShared > 0) {
    this.lastContacted = new Date();
  }
  next();
});

const HRDirectory = mongoose.model('HRDirectory', hrDirectorySchema);

module.exports = HRDirectory;
