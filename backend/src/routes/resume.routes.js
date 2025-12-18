const express = require('express');
const router = express.Router();
const { protect, checkPermission } = require('../middlewares/auth');
const uploadMiddleware = require('../utils/fileUpload');
const {
  uploadResume: uploadResumeHandler,
  getUserResumes,
  setActiveResume,
  deleteResume,
  downloadResume
} = require('../controllers/resume.controller');

// Protect all routes with JWT authentication
router.use(protect);

// GET /api/v1/resumes - Get all resumes for current user
router.get('/', checkPermission('resumes', 'read'), (req, res, next) => {
  // console.log('GET /resumes route hit');
  next();
}, getUserResumes);

// POST /api/v1/resumes - Upload a new resume
router.post('/', checkPermission('resumes', 'create'), uploadMiddleware, uploadResumeHandler);

// PATCH /api/v1/resumes/:id/set-active - Set a resume as active
router.patch('/:id/set-active', checkPermission('resumes', 'edit'), setActiveResume);

// GET /api/v1/resumes/:id/download - Download a resume
router.get('/:id/download', checkPermission('resumes', 'read'), downloadResume);

// DELETE /api/v1/resumes/:id - Delete a resume
router.delete('/:id', checkPermission('resumes', 'delete'), deleteResume);

module.exports = router;
