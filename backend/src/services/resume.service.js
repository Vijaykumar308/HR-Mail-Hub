const Resume = require('../models/Resume');
const AppError = require('../utils/appError');
const fs = require('fs');
const path = require('path');

class ResumeService {
  static async uploadResume(user, file) {
    // Check resume limit
    await Resume.checkResumeLimit(user._id);

    const resume = await Resume.create({
      user: user._id,
      originalName: file.originalname,
      fileName: file.filename,
      filePath: `uploads/resumes/${user._id}/${file.filename}`,
      fileType: file.mimetype,
      fileSize: file.size,
      isActive: true // New uploads are set as active by default
    });

    return this.formatResume(resume);
  }

  static async getUserResumes(userId) {
    const resumes = await Resume.find({ user: userId })
      .sort({ uploadedAt: -1 });

    return resumes.map(resume => this.formatResume(resume));
  }

  static async setActiveResume(userId, resumeId) {
    // Find the resume and ensure it belongs to the user
    const resume = await Resume.findOne({ _id: resumeId, user: userId });

    if (!resume) {
      throw new AppError('Resume not found', 404);
    }

    // Set all other resumes to inactive
    await Resume.updateMany(
      { user: userId, _id: { $ne: resume._id } },
      { $set: { isActive: false } }
    );

    // Set the selected resume to active
    resume.isActive = true;
    await resume.save();

    return this.formatResume(resume);
  }

  static async deleteResume(userId, resumeId) {
    const resume = await Resume.findOneAndDelete({ _id: resumeId, user: userId });

    if (!resume) {
      throw new AppError('Resume not found', 404);
    }

    // If we deleted the active resume and there are others, set the most recent one as active
    if (resume.isActive) {
      const latestResume = await Resume.findOne({ user: userId })
        .sort({ uploadedAt: -1 });

      if (latestResume) {
        latestResume.isActive = true;
        await latestResume.save();
      }
    }

    // The file will be deleted by the post-remove hook in the model
    return { success: true };
  }

  static async downloadResume(userId, resumeId) {
    const resume = await Resume.findOne({ _id: resumeId, user: userId });

    if (!resume) {
      throw new AppError('Resume not found', 404);
    }

    return resume;
  }

  static formatResume(resume) {
    return {
      id: resume._id,
      originalName: resume.originalName,
      fileName: resume.fileName,
      fileUrl: `${process.env.API_URL || 'http://localhost:4000'}/${resume.filePath}`,
      fileSize: resume.fileSize,
      isActive: resume.isActive,
      uploadedAt: resume.uploadedAt
    };
  }
}

module.exports = ResumeService;
