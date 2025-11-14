const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);

// API routes
router.use('/users', require('./user.routes'));
router.use('/resumes', require('./resume.routes'));

// Handle 404 for API routes
router.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = router;
