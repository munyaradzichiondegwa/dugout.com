// menuItems.js

import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes - get menu items
router.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Menu items route - to be implemented',
    items: []
  });
});

// Protected routes
router.use(protect);

// Vendor-only routes for menu management
router.post('/', authorize('vendor', 'admin'), (req, res) => {
  res.json({ 
    success: true,
    message: 'Create menu item route - to be implemented' 
  });
});

export default router;
































