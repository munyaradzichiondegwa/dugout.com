// auth.js

import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  sendOTP,
  verifyOTP,
  logout,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// Protected routes (any authenticated user)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

export default router;

