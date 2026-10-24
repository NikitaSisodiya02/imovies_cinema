import mongoose from 'mongoose';

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Theatre name is required'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Location/Area is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    default: 'Metropolis',
  },
  address: {
    type: String,
    required: true,
  },
  screensCount: {
    type: Number,
    default: 4,
  },
  facilities: {
    type: [String],
    default: ['Dolby Atmos', '4K Laser Projection', 'Recliner Seats', 'Gourmet Food & Beverages', 'Wheelchair Accessible'],
  },
  rating: {
    type: Number,
    default: 4.6,
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Theatre || mongoose.model('Theatre', theatreSchema);
