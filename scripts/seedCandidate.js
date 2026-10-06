import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const seedCandidate = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/balaji_placement';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas');

    const email = 'candidate@gmail.com';
    let user = await User.findOne({ email });

    if (user) {
      user.name = 'candidate';
      user.phone = '9528634580';
      user.password = 'candidate@123';
      user.role = 'candidate';
      user.isEmailVerified = true;
      await user.save();
      console.log('✅ Candidate updated:', user.email);
    } else {
      user = await User.create({
        name: 'candidate',
        email: 'candidate@gmail.com',
        password: 'candidate@123',
        phone: '9528634580',
        role: 'candidate',
        isEmailVerified: true,
        candidateProfile: {
          title: 'Software Developer',
          experience: '2 Years',
          expectedSalary: '₹10.0 LPA',
          location: 'Bengaluru, India',
          skills: ['JavaScript', 'React.js', 'Node.js', 'HTML/CSS'],
          resumeName: 'candidate_resume.pdf',
          profileCompleted: 90
        }
      });
      console.log('✅ Candidate created:', user.email);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding candidate:', err);
    process.exit(1);
  }
};

seedCandidate();
