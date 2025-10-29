import express from 'express';
import {
  initiatePayment,
  verifyPayment,
  uploadProofOfPayment,
  getPaymentStatus,
  getMyPayments
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Customer routes
router.post('/initiate', initiatePayment);
router.post('/:id/proof', uploadProofOfPayment);
router.get('/:id', getPaymentStatus);
router.get('/history/my-payments', getMyPayments);

// Admin/Vendor routes
router.post('/:id/verify', authorize('vendor', 'admin'), verifyPayment);

export default router;