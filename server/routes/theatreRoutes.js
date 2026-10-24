import express from 'express';
import { getTheatres, getTheatre, createTheatre } from '../controllers/theatreController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getTheatres)
  .post(protect, authorize('admin'), createTheatre);

router.route('/:id')
  .get(getTheatre);

export default router;
