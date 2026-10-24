import { lockSeat, unlockSeat, unlockAllSeatsForClient, getSeatsByShow } from '../services/dataStore.js';

export const setupSeatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 [Socket.io Connected]: ${socket.id}`);

    // User joins a specific show room for live seat synchronisation
    socket.on('show:join', async ({ showId }) => {
      socket.join(`show_${showId}`);
      console.log(`👤 Client ${socket.id} joined show room: show_${showId}`);

      // Send latest seat status to the joined user
      const seats = await getSeatsByShow(showId);
      socket.emit('seats:sync', { showId, seats });
    });

    // User leaves show room
    socket.on('show:leave', ({ showId }) => {
      socket.leave(`show_${showId}`);
      console.log(`🚪 Client ${socket.id} left show room: show_${showId}`);
    });

    // User clicks a seat to lock it temporarily for purchase
    socket.on('seat:lock', async ({ showId, seatNumber }) => {
      const result = await lockSeat(showId, seatNumber, socket.id);
      if (result.success) {
        // Broadcast to all clients viewing this show room
        io.to(`show_${showId}`).emit('seat:locked', {
          showId,
          seatNumber,
          lockedBy: socket.id,
          seat: result.seat,
        });
      } else {
        socket.emit('seat:error', { message: result.message, seatNumber });
      }
    });

    // User unselects a seat
    socket.on('seat:unlock', async ({ showId, seatNumber }) => {
      const result = await unlockSeat(showId, seatNumber, socket.id);
      if (result.success) {
        io.to(`show_${showId}`).emit('seat:unlocked', {
          showId,
          seatNumber,
          seat: result.seat,
        });
      }
    });

    // Broadcast booking completion
    socket.on('seats:booked', ({ showId, seats }) => {
      io.to(`show_${showId}`).emit('seats:booked', {
        showId,
        seats,
      });
    });

    // Cleanup when user disconnects
    socket.on('disconnect', async () => {
      console.log(`🔌 [Socket.io Disconnected]: ${socket.id}`);
      await unlockAllSeatsForClient(socket.id);
      // Notify all rooms of potential seat releases
      io.emit('seats:released', { clientId: socket.id });
    });
  });
};
