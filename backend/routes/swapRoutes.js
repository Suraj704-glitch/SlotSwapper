import express from 'express';
import {
  getSwappableSlots,
  requestSwap,
  respondToSwap,
  getMySwapRequests,
} from '../controllers/swapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.get('/swappable', protect, getSwappableSlots);
router.get('/me', protect, getMySwapRequests);
router.post('/request', protect, requestSwap);
router.post('/response/:id', protect, respondToSwap);

export default router;