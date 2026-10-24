import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import { initDataStore } from './services/dataStore.js';
import { setupSeatSocket } from './sockets/seatSocket.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import theatreRoutes from './routes/theatreRoutes.js';
import showRoutes from './routes/showRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiter to /api
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'IMovies Cinema Platform',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Setup Real-time Sockets
setupSeatSocket(io);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server and Database initialization
const startServer = async () => {
  await connectDB();
  await initDataStore();

  server.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🎬 IMovies Backend Server running on port ${PORT}`);
    console.log(`🌐 Base API: http://localhost:${PORT}/api`);
    console.log(`🎟️ Socket.io Engine ready for live seat locking`);
    console.log(`===============================================`);
  });
};

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
});
