import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: true,
  },
  screenName: {
    type: String,
    default: 'Screen 1 - Dolby Atmos',
  },
  showDate: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  showTime: {
    type: String, // e.g. "07:30 PM"
    required: true,
  },
  language: {
    type: String,
    default: 'English',
  },
  format: {
    type: String,
    enum: ['2D', '3D', 'IMAX 3D', '4DX'],
    default: '2D',
  },
  pricing: {
    vip: { type: Number, default: 350 },
    premium: { type: Number, default: 250 },
    standard: { type: Number, default: 180 },
  },
  totalSeats: {
    type: Number,
    default: 60,
  },
  availableSeats: {
    type: Number,
    default: 60,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

showSchema.index({ movie: 1, showDate: 1 });
showSchema.index({ theatre: 1, showDate: 1 });

export default mongoose.models.Show || mongoose.model('Show', showSchema);
