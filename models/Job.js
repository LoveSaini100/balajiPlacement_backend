import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    slug: {
      type: String,
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    companySlug: {
      type: String,
      trim: true
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    category: {
      type: String,
      default: 'Information Technology'
    },
    categorySlug: {
      type: String,
      default: 'information-technology'
    },
    location: {
      type: String,
      required: [true, 'Location is required']
    },
    workplaceType: {
      type: String,
      default: 'On-site'
    },
    workMode: {
      type: String,
      default: 'On-site'
    },
    jobType: {
      type: String,
      default: 'Full Time'
    },
    employmentType: {
      type: String,
      default: 'Full Time'
    },
    experience: {
      type: String,
      default: '1-3 Years'
    },
    expBracket: {
      type: String,
      default: 'Junior (1-3 yrs)'
    },
    qualification: {
      type: String,
      default: "Bachelor's Degree"
    },
    salaryMin: {
      type: Number,
      default: 300000
    },
    salaryMax: {
      type: Number,
      default: 800000
    },
    salaryMinLpa: {
      type: Number
    },
    salaryMaxLpa: {
      type: Number
    },
    salary: {
      type: String,
      default: ''
    },
    salaryDisplay: {
      type: String,
      default: ''
    },
    overview: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    responsibilities: {
      type: [String],
      default: []
    },
    requirements: {
      type: [String],
      default: []
    },
    skills: {
      type: [String],
      default: []
    },
    benefits: {
      type: [String],
      default: []
    },
    vacancies: {
      type: Number,
      default: 1
    },
    urgent: {
      type: Boolean,
      default: false
    },
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: 'active'
    },
    applicantsCount: {
      type: Number,
      default: 0
    },
    logoText: {
      type: String,
      default: 'JOB'
    },
    logoBg: {
      type: String,
      default: '#0056B3'
    },
    deadline: {
      type: String,
      default: 'Open Until Filled'
    },
    postedDate: {
      type: String,
      default: 'Recent'
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

export default mongoose.models.Job || mongoose.model('Job', JobSchema);

