// orders.js

import express from 'express';
import {
  createOrder,
  getMyOrders,
  getVendorOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Customer routes
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/payment', updatePaymentStatus);

// Vendor routes
router.get('/vendor/my-orders', authorize('vendor', 'admin'), getVendorOrders);
router.put('/:id/status', authorize('vendor', 'admin'), updateOrderStatus);

export default router;