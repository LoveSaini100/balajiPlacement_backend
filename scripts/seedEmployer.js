import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const seedEmployer = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/balaji_placement';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas');

    const email = 'employer@gmail.com';
    let user = await User.findOne({ email });

    if (user) {
      user.name = 'employer';
      user.password = 'employer@123';
      user.role = 'employer';
      user.isEmailVerified = true;
      user.isApproved = true;
      user.status = 'approved';
      user.employerProfile = {
        companyName: 'SJ tech',
        companyWebsite: 'https://sjtech.com',
        companySize: '50-200',
        industry: 'Technology & IT',
        location: 'Bengaluru / Remote',
        aboutCompany: 'SJ tech is an innovative technology and software solutions provider.',
        isVerifiedCompany: true,
        verificationStatus: 'approved'
      };
      await user.save();
      console.log('✅ Employer updated in MongoDB:', user.email);
    } else {
      user = await User.create({
        name: 'employer',
        email: 'employer@gmail.com',
        password: 'employer@123',
        role: 'employer',
        phone: '9876543210',
        isEmailVerified: true,
        isApproved: true,
        status: 'approved',
        employerProfile: {
          companyName: 'SJ tech',
          companyWebsite: 'https://sjtech.com',
          companySize: '50-200',
          industry: 'Technology & IT',
          location: 'Bengaluru / Remote',
          aboutCompany: 'SJ tech is an innovative technology and software solutions provider.',
          isVerifiedCompany: true,
          verificationStatus: 'approved'
        }
      });
      console.log('✅ Employer created in MongoDB:', user.email);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding employer:', err);
    process.exit(1);
  }
};

seedEmployer();
