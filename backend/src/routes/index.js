const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch('/updatePassword', authenticate, authController.updatePassword);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
