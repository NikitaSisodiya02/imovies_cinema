import QRCode from 'qrcode';
import {
  createBooking as dbCreateBooking,
  getUserBookings as dbGetUserBookings,
  getBookingById as dbGetBookingById,
  cancelBooking as dbCancelBooking,
  getShowById,
} from '../services/dataStore.js';

export const createBooking = async (req, res, next) => {
  try {
    const { showId, seats, seatDetails, subtotal, convenienceFee, discount, totalAmount, paymentMethod } = req.body;
    const userId = req.user._id || req.user.id;

    if (!showId || !seats || !seats.length) {
      return res.status(400).json({ success: false, message: 'Show and seats are required to complete booking' });
    }

    const show = await getShowById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // Generate dynamic QR Code string with booking verification payload
    const qrPayload = JSON.stringify({
      app: 'IMovies Cinema Pass',
      movie: show.movie?.title,
      theatre: show.theatre?.name,
      date: show.showDate,
      time: show.showTime,
      seats,
      user: req.user.name,
      verified: true,
      timestamp: Date.now(),
    });

    const qrCode = await QRCode.toDataURL(qrPayload, {
      color: {
        dark: '#7c3aed', // Purple accent
        light: '#0f172a', // Dark background
      },
      width: 250,
      margin: 1,
    });

    const booking = await dbCreateBooking({
      user: userId,
      show: showId,
      movie: show.movie?._id || show.movie,
      theatre: show.theatre?._id || show.theatre,
      seats,
      seatDetails: seatDetails || [],
      ticketCount: seats.length,
      subtotal: subtotal || 0,
      convenienceFee: convenienceFee || 30,
      discount: discount || 0,
      totalAmount: totalAmount || 0,
      paymentMethod: paymentMethod || 'Credit/Debit Card',
      qrCode,
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const bookings = await dbGetUserBookings(userId);
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    next(err);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    const booking = await dbGetBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { reason } = req.body;
    const result = await dbCancelBooking(req.params.id, userId, reason);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Refund initiated.',
      booking: result.booking,
    });
  } catch (err) {
    next(err);
  }
};
