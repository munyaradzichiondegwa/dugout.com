import express from 'express';
import {
  createReview,
  getProductReviews,
  getVendorReviews,
  addReviewResponse,
  markHelpful
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);
router.get('/vendor/:vendorId', getVendorReviews);

// Protected routes
router.use(protect);

router.post('/', createReview);
router.put('/:id/helpful', markHelpful);
router.put('/:id/response', authorize('vendor', 'admin'), addReviewResponse);

export default router;