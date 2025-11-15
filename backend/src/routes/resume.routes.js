const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const uploadMiddleware = require('../utils/fileUpload');
const {
  uploadResume: uploadResumeHandler,
  getUserResumes,
  setActiveResume,
  deleteResume
} = require('../controllers/resume.controller');

// Protect all routes with JWT authentication
router.use(protect);

// GET /api/v1/resumes - Get all resumes for current user
router.get('/', (req, res, next) => {
  console.log('GET /resumes route hit');
  console.log('User:', req.user);
  next();
}, getUserResumes);

// POST /api/v1/resumes - Upload a new resume
router.post('/', uploadMiddleware, uploadResumeHandler);

// PATCH /api/v1/resumes/:id/active - Set a resume as active
router.patch('/:id/active', setActiveResume);

// DELETE /api/v1/resumes/:id - Delete a resume
router.delete('/:id', deleteResume);

module.exports = router;
