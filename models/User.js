import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['candidate', 'employer', 'admin'],
      default: 'candidate'
    },
    phone: {
      type: String,
      default: ''
    },
    isEmailVerified: {
      type: Boolean,
      default: true // Verified via direct email and password registration
    },
    isApproved: {
      type: Boolean,
      default: true // Candidates and Admins approved by default; Employers set to false on register
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'active'],
      default: 'active'
    },
    // Employer-specific Profile Details
    employerProfile: {
      companyName: { type: String, default: '' },
      companyPhone: { type: String, default: '' },
      companyWebsite: { type: String, default: '' },
      companySize: { type: String, default: '50-200' },
      industry: { type: String, default: 'Technology & IT' },
      location: { type: String, default: '' },
      aboutCompany: { type: String, default: '' },
      isVerifiedCompany: { type: Boolean, default: false },
      verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      rejectionReason: { type: String, default: '' }
    },
    // Candidate-specific Profile Details
    candidateProfile: {
      title: { type: String, default: '' },
      experience: { type: String, default: '' },
      expectedSalary: { type: String, default: '' },
      location: { type: String, default: '' },
      about: { type: String, default: '' },
      skills: { type: [String], default: [] },
      experienceList: { type: [Object], default: [] },
      education: { type: [Object], default: [] },
      preferences: {
        currentCtc: { type: String, default: '' },
        expectedCtc: { type: String, default: '' },
        noticePeriod: { type: String, default: '' },
        preferredLocation: { type: String, default: '' },
        preferredRole: { type: String, default: '' },
        jobType: { type: String, default: 'Full-Time' }
      },
      savedJobs: { type: [Number], default: [] },
      resumeUrl: { type: String, default: '' },
      resumeName: { type: String, default: '' },
      resumeType: { type: String, default: '' },
      profileCompleted: { type: Number, default: 20 },
      atsScore: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
);

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password helper
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
