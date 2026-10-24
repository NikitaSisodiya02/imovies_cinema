import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { initialUsers, initialTheatres, initialMovies, generateInitialShows, generateSeatsForShow } from '../seeds/seedData.js';
import { isDbConnected } from '../config/db.js';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import Show from '../models/Show.js';
import Seat from '../models/Seat.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// In-Memory Data Store State
let store = {
  users: [],
  theatres: [],
  movies: [],
  shows: [],
  seats: [],
  bookings: [],
  payments: [],
  notifications: [],
};

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Persist in-memory state to disk for reliability across restarts
const persistData = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write JSON store:', err.message);
  }
};

// Initialize Store with hashed passwords & seed items
export const initDataStore = async () => {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      store = JSON.parse(raw);
      console.log('📦 Loaded existing IMovies dataset from local persistence store.');
      return;
    } catch (e) {
      console.warn('Error reading store.json, re-initializing seeds...');
    }
  }

  // Generate seed records
  console.log('🌱 Seeding fresh IMovies database...');
  const salt = await bcrypt.genSalt(10);
  const usersWithHashedPw = await Promise.all(
    initialUsers.map(async (u) => ({
      ...u,
      password: await bcrypt.hash(u.password, salt),
    }))
  );

  const shows = generateInitialShows();
  let allSeats = [];
  shows.forEach((s) => {
    const seats = generateSeatsForShow(s._id, s.pricing);
    allSeats = allSeats.concat(seats);
  });

  store.users = usersWithHashedPw;
  store.theatres = initialTheatres;
  store.movies = initialMovies;
  store.shows = shows;
  store.seats = allSeats;
  store.bookings = [
    {
      _id: '65f400000000000000000001',
      bookingNumber: 'IMV-2026-9812',
      user: '65f00000000000000000002',
      show: '65f300000000000000000001',
      movie: '65f200000000000000000001',
      theatre: '65f100000000000000000001',
      seats: ['A4', 'A5'],
      seatDetails: [
        { seatNumber: 'A4', tier: 'vip', price: 450 },
        { seatNumber: 'A5', tier: 'vip', price: 450 },
      ],
      ticketCount: 2,
      subtotal: 900,
      convenienceFee: 30,
      discount: 0,
      totalAmount: 930,
      paymentStatus: 'completed',
      bookingStatus: 'confirmed',
      paymentMethod: 'Credit/Debit Card',
      transactionId: 'TXN-98214710',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
      createdAt: new Date().toISOString(),
    },
  ];
  store.payments = [
    {
      _id: '65f500000000000000000001',
      booking: '65f400000000000000000001',
      user: '65f00000000000000000002',
      transactionId: 'TXN-98214710',
      paymentMethod: 'card',
      amount: 930,
      status: 'success',
      paidAt: new Date().toISOString(),
    },
  ];
  store.notifications = [
    {
      _id: '65f600000000000000000001',
      user: '65f000000000000000000002',
      title: 'Booking Confirmed 🎉',
      message: 'Your tickets for Dune: Part Two (IMAX 3D) at IMAX Regal Grand Plex are confirmed!',
      type: 'booking',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
  ];

  persistData();
  console.log('✅ Seed dataset generated successfully with Users, Movies, Shows, and Theatres.');
};

// ==================== USER OPERATIONS ====================
export const findUserByEmail = async (email) => {
  const normEmail = (email || '').toLowerCase().trim();
  const local = store.users.find((u) => u.email.toLowerCase() === normEmail);
  if (local) return local;

  if (isDbConnected()) {
    try {
      return await User.findOne({ email: normEmail });
    } catch (e) {
      // fallback
    }
  }
  return null;
};

export const findUserById = async (id) => {
  const u = store.users.find((user) => String(user._id) === String(id));
  if (u) {
    const { password, ...safeUser } = u;
    return safeUser;
  }

  if (isDbConnected()) {
    try {
      return await User.findById(id).select('-password');
    } catch (e) {
      // fallback
    }
  }
  return null;
};

export const createUser = async (userData) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  const newUser = {
    _id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: userData.name,
    email: userData.email.toLowerCase(),
    password: hashedPassword,
    role: userData.role || 'user',
    phone: userData.phone || '',
    avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    createdAt: new Date().toISOString(),
  };

  store.users.push(newUser);
  persistData();

  const { password, ...safeUser } = newUser;
  return safeUser;
};

// ==================== MOVIE OPERATIONS ====================
export const getAllMovies = async (filter = {}) => {
  let movies = [...store.movies];

  if (filter.genre && filter.genre !== 'All') {
    movies = movies.filter((m) => m.genre.some((g) => g.toLowerCase() === filter.genre.toLowerCase()));
  }
  if (filter.language && filter.language !== 'All') {
    movies = movies.filter((m) => m.language.some((l) => l.toLowerCase() === filter.language.toLowerCase()));
  }
  if (filter.status && filter.status !== 'All') {
    movies = movies.filter((m) => m.status === filter.status);
  }
  if (filter.search) {
    const s = filter.search.toLowerCase();
    movies = movies.filter(
      (m) =>
        m.title.toLowerCase().includes(s) ||
        m.description.toLowerCase().includes(s) ||
        (m.director && m.director.toLowerCase().includes(s))
    );
  }

  return movies;
};

export const getMovieById = async (id) => {
  return store.movies.find((m) => String(m._id) === String(id)) || null;
};

export const createMovie = async (movieData) => {
  const newMovie = {
    _id: `movie_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...movieData,
    rating: Number(movieData.rating) || 8.0,
    duration: Number(movieData.duration) || 120,
    createdAt: new Date().toISOString(),
  };
  store.movies.unshift(newMovie);
  persistData();
  return newMovie;
};

export const updateMovie = async (id, updateData) => {
  const idx = store.movies.findIndex((m) => String(m._id) === String(id));
  if (idx === -1) return null;
  store.movies[idx] = { ...store.movies[idx], ...updateData, _id: store.movies[idx]._id };
  persistData();
  return store.movies[idx];
};

export const deleteMovie = async (id) => {
  const idx = store.movies.findIndex((m) => String(m._id) === String(id));
  if (idx === -1) return false;
  store.movies.splice(idx, 1);
  persistData();
  return true;
};

// ==================== THEATRE OPERATIONS ====================
export const getAllTheatres = async (filter = {}) => {
  let theatres = [...store.theatres];
  if (filter.city && filter.city !== 'All') {
    theatres = theatres.filter((t) => t.city.toLowerCase() === filter.city.toLowerCase());
  }
  if (filter.search) {
    const s = filter.search.toLowerCase();
    theatres = theatres.filter((t) => t.name.toLowerCase().includes(s) || t.location.toLowerCase().includes(s));
  }
  return theatres;
};

export const getTheatreById = async (id) => {
  return store.theatres.find((t) => String(t._id) === String(id)) || null;
};

export const createTheatre = async (data) => {
  const newTheatre = {
    _id: `theatre_${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
  };
  store.theatres.push(newTheatre);
  persistData();
  return newTheatre;
};

// ==================== SHOW OPERATIONS ====================
export const getShows = async (filter = {}) => {
  let shows = [...store.shows];

  if (filter.movieId) {
    shows = shows.filter((s) => String(s.movie) === String(filter.movieId));
  }
  if (filter.theatreId) {
    shows = shows.filter((s) => String(s.theatre) === String(filter.theatreId));
  }
  if (filter.date) {
    shows = shows.filter((s) => s.showDate === filter.date);
  }

  // Populate movie and theatre objects
  return shows.map((s) => ({
    ...s,
    movie: store.movies.find((m) => String(m._id) === String(s.movie)) || s.movie,
    theatre: store.theatres.find((t) => String(t._id) === String(s.theatre)) || s.theatre,
  }));
};

export const getShowById = async (id) => {
  const s = store.shows.find((item) => String(item._id) === String(id));
  if (!s) return null;
  return {
    ...s,
    movie: store.movies.find((m) => String(m._id) === String(s.movie)) || s.movie,
    theatre: store.theatres.find((t) => String(t._id) === String(s.theatre)) || s.theatre,
  };
};

export const createShow = async (showData) => {
  const showId = `show_${Date.now()}`;
  const newShow = {
    _id: showId,
    ...showData,
    totalSeats: 60,
    availableSeats: 60,
    createdAt: new Date().toISOString(),
  };
  store.shows.push(newShow);

  // Generate seats automatically for the new show
  const newSeats = generateSeatsForShow(showId, newShow.pricing);
  store.seats = store.seats.concat(newSeats);

  persistData();
  return newShow;
};

export const deleteShow = async (id) => {
  const idx = store.shows.findIndex((s) => String(s._id) === String(id));
  if (idx === -1) return false;
  store.shows.splice(idx, 1);
  // remove seats for show
  store.seats = store.seats.filter((st) => String(st.show) !== String(id));
  persistData();
  return true;
};

// ==================== SEAT OPERATIONS (Real-time Socket.io Support) ====================
export const getSeatsByShow = async (showId) => {
  // auto-unlock expired locks (lock duration: 5 minutes)
  const now = new Date();
  store.seats.forEach((seat) => {
    if (String(seat.show) === String(showId) && seat.status === 'locked' && seat.lockedAt) {
      const lockAge = (now - new Date(seat.lockedAt)) / 1000;
      if (lockAge > 300) {
        seat.status = 'available';
        seat.lockedBy = null;
        seat.lockedAt = null;
      }
    }
  });

  let seats = store.seats.filter((s) => String(s.show) === String(showId));
  if (seats.length === 0) {
    // dynamically generate if not exists
    const show = store.shows.find((s) => String(s._id) === String(showId));
    seats = generateSeatsForShow(showId, show?.pricing);
    store.seats = store.seats.concat(seats);
    persistData();
  }
  return seats;
};

export const lockSeat = async (showId, seatNumber, lockedBy) => {
  const seat = store.seats.find(
    (s) => String(s.show) === String(showId) && s.seatNumber === seatNumber
  );
  if (!seat) return { success: false, message: 'Seat not found' };
  if (seat.status === 'booked') return { success: false, message: 'Seat already booked' };
  if (seat.status === 'locked' && seat.lockedBy !== lockedBy) {
    // Check if expired
    const lockAge = (new Date() - new Date(seat.lockedAt)) / 1000;
    if (lockAge <= 300) {
      return { success: false, message: 'Seat currently reserved by another customer' };
    }
  }

  seat.status = 'locked';
  seat.lockedBy = lockedBy;
  seat.lockedAt = new Date().toISOString();
  persistData();
  return { success: true, seat };
};

export const unlockSeat = async (showId, seatNumber, lockedBy) => {
  const seat = store.seats.find(
    (s) => String(s.show) === String(showId) && s.seatNumber === seatNumber
  );
  if (!seat) return { success: false, message: 'Seat not found' };
  if (seat.status === 'locked' && (seat.lockedBy === lockedBy || !lockedBy)) {
    seat.status = 'available';
    seat.lockedBy = null;
    seat.lockedAt = null;
    persistData();
    return { success: true, seat };
  }
  return { success: false, message: 'Seat was not locked by you' };
};

export const unlockAllSeatsForClient = async (clientId) => {
  let changed = false;
  store.seats.forEach((seat) => {
    if (seat.lockedBy === clientId && seat.status === 'locked') {
      seat.status = 'available';
      seat.lockedBy = null;
      seat.lockedAt = null;
      changed = true;
    }
  });
  if (changed) persistData();
};

// ==================== BOOKING OPERATIONS ====================
export const createBooking = async (bookingData) => {
  const bookingNumber = `IMV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newBooking = {
    _id: `booking_${Date.now()}`,
    bookingNumber,
    ...bookingData,
    paymentStatus: 'completed',
    bookingStatus: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  // Mark seats as booked
  const showId = bookingData.show;
  bookingData.seats.forEach((seatNum) => {
    const seat = store.seats.find((s) => String(s.show) === String(showId) && s.seatNumber === seatNum);
    if (seat) {
      seat.status = 'booked';
      seat.lockedBy = null;
      seat.lockedAt = null;
      seat.bookedBy = bookingData.user;
    }
  });

  // Update show availableSeats count
  const show = store.shows.find((s) => String(s._id) === String(showId));
  if (show) {
    show.availableSeats = Math.max(0, show.availableSeats - bookingData.seats.length);
  }

  // Create payment record
  const transactionId = `TXN-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  newBooking.transactionId = transactionId;

  store.payments.push({
    _id: `pay_${Date.now()}`,
    booking: newBooking._id,
    user: bookingData.user,
    transactionId,
    paymentMethod: bookingData.paymentMethod || 'card',
    amount: bookingData.totalAmount,
    status: 'success',
    paidAt: new Date().toISOString(),
  });

  // Create notification
  store.notifications.unshift({
    _id: `notif_${Date.now()}`,
    user: bookingData.user,
    title: 'Booking Confirmed! 🍿',
    message: `Tickets reserved for ${bookingData.seats.join(', ')}. Booking Ref: ${bookingNumber}`,
    type: 'booking',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  store.bookings.unshift(newBooking);
  persistData();

  return newBooking;
};

export const getUserBookings = async (userId) => {
  const userBookings = store.bookings.filter((b) => String(b.user) === String(userId));
  // populate show, movie, theatre
  return userBookings.map((b) => ({
    ...b,
    show: store.shows.find((s) => String(s._id) === String(b.show)) || b.show,
    movie: store.movies.find((m) => String(m._id) === String(b.movie)) || b.movie,
    theatre: store.theatres.find((t) => String(t._id) === String(b.theatre)) || b.theatre,
  }));
};

export const getBookingById = async (id) => {
  const b = store.bookings.find((item) => String(item._id) === String(id) || item.bookingNumber === id);
  if (!b) return null;
  return {
    ...b,
    user: store.users.find((u) => String(u._id) === String(b.user)),
    show: store.shows.find((s) => String(s._id) === String(b.show)) || b.show,
    movie: store.movies.find((m) => String(m._id) === String(b.movie)) || b.movie,
    theatre: store.theatres.find((t) => String(t._id) === String(b.theatre)) || b.theatre,
  };
};

export const cancelBooking = async (bookingId, userId, reason = 'Customer requested cancellation') => {
  const booking = store.bookings.find((b) => String(b._id) === String(bookingId) && String(b.user) === String(userId));
  if (!booking) return { success: false, message: 'Booking not found or unauthorized' };
  if (booking.bookingStatus === 'cancelled') return { success: false, message: 'Booking is already cancelled' };

  booking.bookingStatus = 'cancelled';
  booking.paymentStatus = 'refunded';
  booking.cancelledAt = new Date().toISOString();
  booking.cancellationReason = reason;
  // Calculate refund (e.g. 85% refunded after 15% cancellation fee)
  booking.refundAmount = Math.round(booking.totalAmount * 0.85);

  // Release the booked seats
  const showId = booking.show?._id || booking.show;
  booking.seats.forEach((seatNum) => {
    const seat = store.seats.find((s) => String(s.show) === String(showId) && s.seatNumber === seatNum);
    if (seat) {
      seat.status = 'available';
      seat.bookedBy = null;
    }
  });

  // Restore available seat count on show
  const show = store.shows.find((s) => String(s._id) === String(showId));
  if (show) {
    show.availableSeats = Math.min(show.totalSeats, show.availableSeats + booking.seats.length);
  }

  // Create notification
  store.notifications.unshift({
    _id: `notif_${Date.now()}`,
    user: userId,
    title: 'Booking Cancelled',
    message: `Booking #${booking.bookingNumber} was cancelled. Refund of $${booking.refundAmount} initiated.`,
    type: 'cancellation',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  persistData();
  return { success: true, booking };
};

// ==================== ADMIN DASHBOARD STATS ====================
export const getAdminStats = async () => {
  const totalRevenue = store.bookings
    .filter((b) => b.bookingStatus === 'confirmed')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const totalTicketsSold = store.bookings
    .filter((b) => b.bookingStatus === 'confirmed')
    .reduce((sum, b) => sum + (b.seats?.length || 0), 0);

  const totalUsers = store.users.length;
  const totalMovies = store.movies.length;
  const totalTheatres = store.theatres.length;
  const totalShows = store.shows.length;
  const totalBookings = store.bookings.length;

  return {
    totalRevenue,
    totalTicketsSold,
    totalUsers,
    totalMovies,
    totalTheatres,
    totalShows,
    totalBookings,
    recentBookings: store.bookings.slice(0, 10).map((b) => ({
      ...b,
      movie: store.movies.find((m) => String(m._id) === String(b.movie))?.title || 'Movie',
      theatre: store.theatres.find((t) => String(t._id) === String(b.theatre))?.name || 'Theatre',
      user: store.users.find((u) => String(u._id) === String(b.user))?.name || 'Customer',
    })),
  };
};

// ==================== NOTIFICATIONS ====================
export const getUserNotifications = async (userId) => {
  return store.notifications.filter((n) => String(n.user) === String(userId));
};

export const markNotificationRead = async (notifId, userId) => {
  const notif = store.notifications.find((n) => String(n._id) === String(notifId) && String(n.user) === String(userId));
  if (notif) {
    notif.isRead = true;
    persistData();
  }
  return notif;
};
