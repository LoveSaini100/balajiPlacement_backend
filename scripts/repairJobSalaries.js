import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Job from '../models/Job.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const repairJobSalaries = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/balaji_placement';
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for salary repair...");

    const jobs = await Job.find({});
    console.log(`Found ${jobs.length} total jobs.`);

    let updatedCount = 0;
    for (const job of jobs) {
      let changed = false;

      // If salary is 'Competitive CTC' or empty, but salaryDisplay has a meaningful value
      if ((!job.salary || job.salary === 'Competitive CTC' || job.salary === 'Competitive') && job.salaryDisplay && job.salaryDisplay !== 'Competitive CTC' && job.salaryDisplay !== 'Competitive' && job.salaryDisplay !== '₹4.5 - ₹8.0 LPA') {
        job.salary = job.salaryDisplay;
        changed = true;
      } else if ((!job.salary || job.salary === 'Competitive CTC') && job.salaryMin && job.salaryMax) {
        job.salary = `₹${(job.salaryMin/100000).toFixed(1)} - ₹${(job.salaryMax/100000).toFixed(1)} LPA`;
        job.salaryDisplay = job.salary;
        changed = true;
      } else if (!job.salary || job.salary === 'Competitive CTC') {
        job.salary = '₹8.0 - ₹15.0 LPA';
        job.salaryDisplay = '₹8.0 - ₹15.0 LPA';
        changed = true;
      }

      if (changed) {
        await job.save();
        updatedCount++;
        console.log(`Updated job "${job.title}" (${job._id}) -> salary: "${job.salary}", salaryDisplay: "${job.salaryDisplay}"`);
      }
    }

    console.log(`Successfully repaired ${updatedCount} jobs.`);
    process.exit(0);
  } catch (err) {
    console.error("Error repairing job salaries:", err);
    process.exit(1);
  }
};

repairJobSalaries();
