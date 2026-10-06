import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    jobTitle: { type: String, default: '' },
    companyName: { type: String, default: '' },
    applicantName: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    applicantPhone: { type: String, default: '' },
    currentTitle: { type: String, default: 'Candidate' },
    experience: { type: String, default: '1-3 Years' },
    coverLetter: { type: String, default: '' },
    resumeSource: {
      type: String,
      enum: ['built_in', 'outer_file'],
      default: 'built_in'
    },
    resumeName: { type: String, default: 'Resume.pdf' },
    resumeUrl: { type: String, default: '' },
    resumeDataUrl: { type: String, default: '' },
    resumeSize: { type: String, default: '' },
    atsResumeData: { type: Object, default: null },
    status: {
      type: String,
      enum: [
        'Applied',
        'Reviewing',
        'Under Review',
        'Shortlisted',
        'Interview',
        'Interview Scheduled',
        'Hired',
        'Offered',
        'Offer Extended',
        'Rejected'
      ],
      default: 'Applied'
    },
    stage: {
      type: Number,
      default: 1
    },
    rating: {
      type: Number,
      default: 0
    },
    statusNotes: { type: String, default: 'Application received and in queue for recruiter review.' },
    interviewDetails: {
      date: { type: String, default: '' },
      time: { type: String, default: '' },
      type: { type: String, default: 'Google Meet / Video' },
      meetLink: { type: String, default: '' },
      interviewer: { type: String, default: 'Talent Acquisition Team' },
      notes: { type: String, default: '' },
      scheduledAt: { type: Date, default: null }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
