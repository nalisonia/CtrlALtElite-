// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Forgot password route (to request a password reset link)
router.post('/forgot-password', authController.forgotPassword); 

// Password reset route (to handle the actual password reset)
// WORK IN PROGRESS
//router.post('/reset-password', authController.resetPassword); 

module.exports = router;