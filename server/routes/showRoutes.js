import express from 'express';
import { getShows, getShow, createShow, deleteShow } from '../controllers/showController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getShows)
  .post(protect, authorize('admin'), createShow);

router.route('/:id')
  .get(getShow)
  .delete(protect, authorize('admin'), deleteShow);

export default router;
