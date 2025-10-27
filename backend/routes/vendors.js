// vendors.js

import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes - get all vendors
router.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Vendors route - to be implemented',
    vendors: []
  });
});

// Protected routes
router.use(protect);

// Vendor management routes
router.get('/profile', authorize('vendor', 'admin'), (req, res) => {
  res.json({ 
    success: true,
    message: 'Vendor profile route - to be implemented' 
  });
});

// routes/vendors.js
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find({ isActive: true })
      .select('businessName description logo vendorTypes location')
      .limit(50);
    
    res.json({
      success: true,
      vendors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vendors'
    });
  }
});

export default router;