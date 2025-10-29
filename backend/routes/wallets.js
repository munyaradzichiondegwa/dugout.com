import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Wallet routes
router.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Wallet route - to be implemented',
    balance: 0,
    currency: 'USD'
  });
});

router.post('/deposit', (req, res) => {
  res.json({ 
    success: true,
    message: 'Deposit route - to be implemented' 
  });
});

router.post('/withdraw', (req, res) => {
  res.json({ 
    success: true,
    message: 'Withdraw route - to be implemented' 
  });
});

export default router;