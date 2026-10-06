import mongoose from 'mongoose';
import { seedDatabaseIfEmpty } from './seeder.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/balaji_placement';
    const conn = await mongoose.connect(mongoUri);
    isConnected = true;
    console.log(`✅ [MongoDB Atlas Connected]: ${conn.connection.host} (DB: ${conn.connection.name})`);
    
    // Auto-seed initial records if collection is empty
    await seedDatabaseIfEmpty();
  } catch (error) {
    console.error(`❌ [MongoDB Atlas Connection Error]: ${error.message}`);
  }
};
