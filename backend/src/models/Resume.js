const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A resume must belong to a user']
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required']
  },
  fileName: {
    type: String,
    required: [true, 'Filename is required']
  },
  filePath: {
    type: String,
    required: [true, 'File path is required']
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    enum: ['application/pdf']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  isActive: {
    type: Boolean,
    default: false
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster querying
resumeSchema.index({ user: 1, isActive: 1 });

// Prevent users from having more than 3 resumes
resumeSchema.statics.checkResumeLimit = async function(userId) {
  const count = await this.countDocuments({ user: userId });
  if (count >= 3) {
    throw new Error('Maximum of 3 resumes allowed per user');
  }
};

// Ensure only one active resume per user
resumeSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

// Auto-delete file when document is removed
resumeSchema.post('remove', async function(doc) {
  const fs = require('fs');
  const path = require('path');
  
  const filePath = path.join(__dirname, '../..', doc.filePath);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  
  // If this was the active resume, set another one as active
  if (doc.isActive) {
    const anotherResume = await this.constructor
      .findOne({ user: doc.user, _id: { $ne: doc._id } })
      .sort({ uploadedAt: -1 });
      
    if (anotherResume) {
      anotherResume.isActive = true;
      await anotherResume.save();
    }
  }
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
