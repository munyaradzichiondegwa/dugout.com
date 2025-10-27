import express from 'express';
import { protect } from '../middleware/auth.js';
import { getVendorDashboardStats } from '../controllers/analyticsController.js';

const router = express.Router();

// Protect this route
router.get('/vendor-dashboard', protect, getVendorDashboardStats);

export default router;
