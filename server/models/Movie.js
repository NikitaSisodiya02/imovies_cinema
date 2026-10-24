import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Movie description is required'],
  },
  poster: {
    type: String,
    required: true,
  },
  backdrop: {
    type: String,
    default: '',
  },
  trailerUrl: {
    type: String,
    default: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  genre: {
    type: [String],
    required: true,
  },
  language: {
    type: [String],
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  rating: {
    type: Number,
    default: 8.5,
  },
  certification: {
    type: String,
    default: 'UA',
  },
  director: {
    type: String,
    default: '',
  },
  cast: {
    type: [String],
    default: [],
  },
  formats: {
    type: [String],
    default: ['2D', '3D', 'IMAX 3D'],
  },
  status: {
    type: String,
    enum: ['now_showing', 'coming_soon'],
    default: 'now_showing',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ status: 1, releaseDate: -1 });

export default mongoose.models.Movie || mongoose.model('Movie', movieSchema);
