import mongoose from 'mongoose';

import { CONFIG } from '../config/config.js';
import { databaseRuntime } from './runtime.js';
import { seedDatabase } from './seed.js';

export const connectDB = async (): Promise<void> => {
  try {
    const connectOptions =
      CONFIG.env === 'development'
        ? {
            serverSelectionTimeoutMS: 1500,
          }
        : undefined;

    await mongoose.connect(CONFIG.mongodb.uri, connectOptions);
    databaseRuntime.setMode('mongo');

    console.log('📦 MongoDB connected successfully');

    await seedDatabase();
  } catch (error) {
    if (CONFIG.env === 'development') {
      databaseRuntime.setMode('memory');
      console.warn(
        '⚠️ MongoDB is unavailable. Falling back to in-memory storage for development.'
      );
      return;
    }

    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export const closeDB = async () => {
  if (databaseRuntime.isMemory()) {
    console.log('📦 In-memory storage closed');
    return;
  }

  await mongoose.connection.close();
  console.log('📦 MongoDB connection closed');
};
