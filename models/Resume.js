import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      title: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' }
    },
    summary: { type: String, default: '' },
    experiences: [
      {
        id: String,
        company: String,
        role: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String,
        highlights: [String]
      }
    ],
    education: [
      {
        id: String,
        institution: String,
        degree: String,
        fieldOfStudy: String,
        location: String,
        startDate: String,
        endDate: String,
        grade: String
      }
    ],
    skills: {
      technical: [String],
      frameworks: [String],
      tools: [String],
      softSkills: [String]
    },
    projects: [
      {
        id: String,
        title: String,
        role: String,
        technologies: String,
        link: String,
        description: String
      }
    ],
    certifications: [
      {
        id: String,
        name: String,
        issuer: String,
        issueDate: String,
        credentialUrl: String
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
