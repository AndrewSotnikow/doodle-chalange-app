import mongoose from 'mongoose';

import { CONFIG } from '../config/config.js';
import { seedDatabase } from './seed.js';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(CONFIG.mongodb.uri);

    console.log('📦 MongoDB connected successfully');

    await seedDatabase();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
  console.log('📦 MongoDB connection closed');
};
