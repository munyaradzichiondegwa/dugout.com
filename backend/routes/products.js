import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.use(protect);

// Vendor-only routes
router.post('/', authorize('vendor', 'admin'), createProduct);
router.get('/vendor/my-products', authorize('vendor', 'admin'), getVendorProducts);
router.put('/:id', authorize('vendor', 'admin'), updateProduct);
router.delete('/:id', authorize('vendor', 'admin'), deleteProduct);

export default router;




















