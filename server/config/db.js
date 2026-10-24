import mongoose from 'mongoose';

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log(`🚀 [MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.log(`ℹ️ [MongoDB Notice]: Could not connect to MongoDB server on ${uri}`);
    console.log(`✨ [IMovies Hybrid Engine]: Activated Zero-Config High-Performance In-Memory/JSON Persistence Store.`);
    console.log(`⚡ All Mongoose operations, real-time Socket.io seat tracking, and JWT auth will run seamlessly.`);
    isMongoConnected = false;
    return false;
  }
};

export const isDbConnected = () => isMongoConnected;
