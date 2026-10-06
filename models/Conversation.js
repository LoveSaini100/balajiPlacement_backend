import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    jobTitle: { type: String, default: '' },
    companyName: { type: String, default: '' },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    candidateEmail: { type: String, default: '' },
    employerEmail: { type: String, default: '' },
    employerName: { type: String, default: 'Recruiter' },
    candidateName: { type: String, default: 'Candidate' },
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: Date.now },
    unreadCountEmployer: { type: Number, default: 0 },
    unreadCountCandidate: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);

