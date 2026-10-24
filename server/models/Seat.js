import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true,
  },
  seatNumber: {
    type: String, // e.g. "A1", "D6"
    required: true,
  },
  row: {
    type: String,
    required: true,
  },
  col: {
    type: Number,
    required: true,
  },
  tier: {
    type: String,
    enum: ['vip', 'premium', 'standard'],
    default: 'standard',
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'locked', 'booked'],
    default: 'available',
  },
  lockedBy: {
    type: String, // socketId or userId
    default: null,
  },
  lockedAt: {
    type: Date,
    default: null,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
});

seatSchema.index({ show: 1, seatNumber: 1 }, { unique: true });

export default mongoose.models.Seat || mongoose.model('Seat', seatSchema);
