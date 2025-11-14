const Resume = require('../models/Resume');
const path = require('path');
const fs = require('fs');

// @desc    Upload a resume
// @route   POST /api/resumes/upload
// @access  Private
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const resume = await Resume.create({
      user: req.user._id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: `/uploads/resumes/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });

    res.status(201).json({
      success: true,
      data: {
        id: resume._id,
        originalName: resume.originalName,
        url: resume.filePath,
        size: resume.fileSize,
        uploadedAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up the uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(__dirname, '../..', 'uploads', 'resumes', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Error uploading resume',
    });
  }
};

// @desc    Get all resumes for the authenticated user
// @route   GET /api/resumes
// @access  Private
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v -user');

    res.json({
      success: true,
      count: resumes.length,
      data: resumes.map(resume => ({
        id: resume._id,
        originalName: resume.originalName,
        url: resume.filePath,
        size: resume.fileSize,
        uploadedAt: resume.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resumes',
    });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Delete the file from the filesystem
    const filePath = path.join(__dirname, '../..', resume.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting resume',
    });
  }
};

// @desc    Download a resume
// @route   GET /api/resumes/download/:id
// @access  Private
exports.downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    const filePath = path.join(__dirname, '../..', resume.filePath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    res.download(filePath, resume.originalName);
  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading resume',
    });
  }
};
