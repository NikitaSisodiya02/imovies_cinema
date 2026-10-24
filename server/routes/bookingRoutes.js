import express from 'express';
import { createBooking, getMyBookings, getBooking, cancelBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All booking routes require authentication

router.route('/')
  .post(createBooking);

router.get('/my', getMyBookings);

router.route('/:id')
  .get(getBooking);

router.post('/:id/cancel', cancelBooking);

export default router;
