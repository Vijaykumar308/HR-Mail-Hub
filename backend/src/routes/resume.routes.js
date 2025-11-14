const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const uploadResume = require('../utils/fileUpload');
const {
  uploadResume: uploadResumeHandler,
  getUserResumes,
  setActiveResume,
  deleteResume
} = require('../controllers/resume.controller');

// Protect all routes with JWT authentication
router.use(protect);

// POST /api/v1/resumes - Upload a new resume
router.post('/', uploadResume, uploadResumeHandler);

// GET /api/v1/resumes - Get all resumes for current user
router.get('/', getUserResumes);

// PATCH /api/v1/resumes/:id/active - Set a resume as active
router.patch('/:id/active', setActiveResume);

// DELETE /api/v1/resumes/:id - Delete a resume
router.delete('/:id', deleteResume);

module.exports = router;
