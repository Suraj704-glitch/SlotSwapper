import express from 'express';
import {
  createEvent,
  getMyEvents,
  updateEventStatus,
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected
router.route('/').post(protect, createEvent);
router.route('/me').get(protect, getMyEvents);
router.route('/:id/status').put(protect, updateEventStatus);

export default router;