const express = require('express');
const router = express.Router();
const { uploadFile, handleUploadError } = require('../utils/fileUpload');
const { 
  uploadResume, 
  getResumes, 
  deleteResume, 
  downloadResume 
} = require('../controllers/resumeController');
const auth = require('../middleware/auth');

// @route   POST /api/resumes/upload
// @desc    Upload a resume
// @access  Private
router.post(
  '/upload',
  auth,
  uploadFile,
  handleUploadError,
  uploadResume
);

// @route   GET /api/resumes
// @desc    Get all resumes for the authenticated user
// @access  Private
router.get('/', auth, getResumes);

// @route   DELETE /api/resumes/:id
// @desc    Delete a resume
// @access  Private
router.delete('/:id', auth, deleteResume);

// @route   GET /api/resumes/download/:id
// @desc    Download a resume
// @access  Private
router.get('/download/:id', auth, downloadResume);

module.exports = router;
