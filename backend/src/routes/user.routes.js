const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Test email routes (public access for testing)
router.get('/test-email', userController.testEmail);
router.get('/test-welcome-email', userController.testWelcomeEmail);
router.get('/test-password-reset', userController.testPasswordResetEmail);
router.get('/test-resume-submission', userController.testResumeSubmissionEmail);

// Protect all routes after this middleware
router.use(authenticate);

// Only admin have permission to access for the below APIs 
router.use(authorize('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
