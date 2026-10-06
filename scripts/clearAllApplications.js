import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import Application from '../models/Application.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Job from '../models/Job.js';

const clearAll = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not set in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected.');

    // 1. Delete all applications
    const appResult = await Application.deleteMany({});
    console.log(`✅ Cleared all applications: ${appResult.deletedCount} removed`);

    // 2. Delete all conversations
    const convResult = await Conversation.deleteMany({});
    console.log(`✅ Cleared all conversations: ${convResult.deletedCount} removed`);

    // 3. Delete all messages
    const msgResult = await Message.deleteMany({});
    console.log(`✅ Cleared all messages: ${msgResult.deletedCount} removed`);

    // 4. Reset applicantsCount on all jobs
    const jobResult = await Job.updateMany({}, { $set: { applicantsCount: 0 } });
    console.log(`✅ Reset applicantsCount on ${jobResult.modifiedCount} jobs to 0`);

    console.log('🎉 Cleanup completed successfully! Both candidate and employer sides are now clean.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
};

clearAll();
