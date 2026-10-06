import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
import mongoose from 'mongoose';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const seedEmployerData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/balaji_placement';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas for employer database seeding...');

    // 1. Ensure employer exists
    let employer = await User.findOne({ email: 'employer@gmail.com' });
    if (!employer) {
      employer = await User.create({
        name: 'employer',
        email: 'employer@gmail.com',
        password: 'employer@123',
        phone: '9876543210',
        role: 'employer',
        isEmailVerified: true,
        employerProfile: {
          companyName: 'SJ tech',
          companyWebsite: 'https://sjtech.com',
          companySize: '50-200 Employees',
          industry: 'Technology & IT',
          location: 'Bengaluru / Remote',
          aboutCompany: 'SJ tech is an innovative technology and software engineering company providing scalable enterprise solutions.',
          isVerifiedCompany: true
        }
      });
      console.log('✅ Created employer:', employer.email);
    } else {
      employer.employerProfile = {
        companyName: 'SJ tech',
        companyWebsite: 'https://sjtech.com',
        companySize: '50-200 Employees',
        industry: 'Technology & IT',
        location: 'Bengaluru / Remote',
        aboutCompany: 'SJ tech is an innovative technology and software engineering company providing scalable enterprise solutions.',
        isVerifiedCompany: true
      };
      await employer.save();
      console.log('✅ Updated employer:', employer.email);
    }

    // 2. Ensure candidate users exist in MongoDB
    const candidateConfigs = [
      {
        name: 'Amit Patel',
        email: 'amit.patel@gmail.com',
        phone: '+91 98234 56789',
        title: 'Plant Production Supervisor',
        experience: '4 Years',
        location: 'Haridwar, Uttarakhand',
        skills: ['Shop Floor Management', '5S & Kaizen', 'Lean Manufacturing', 'Safety Compliance'],
        expectedSalary: '₹8.5 LPA',
        noticePeriod: '15 Days'
      },
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        phone: '+91 98765 43210',
        title: 'Senior React Developer',
        experience: '5 Years',
        location: 'Bengaluru, Karnataka',
        skills: ['React 19', 'TypeScript', 'Next.js', 'Redux Toolkit', 'Tailwind CSS'],
        expectedSalary: '₹18.0 LPA',
        noticePeriod: '30 Days'
      },
      {
        name: 'Priya Nair',
        email: 'priya.nair@gmail.com',
        phone: '+91 98112 34567',
        title: 'Frontend Engineer',
        experience: '3.5 Years',
        location: 'Hyderabad, Telangana',
        skills: ['React.js', 'JavaScript', 'REST APIs', 'UI/UX', 'CSS3'],
        expectedSalary: '₹14.0 LPA',
        noticePeriod: 'Immediate'
      },
      {
        name: 'Ananya Verma',
        email: 'ananya.verma@gmail.com',
        phone: '+91 97654 32109',
        title: 'Full Stack Developer',
        experience: '4 Years',
        location: 'Pune, Maharashtra',
        skills: ['Node.js', 'Express', 'React', 'MongoDB', 'Docker', 'AWS'],
        expectedSalary: '₹16.5 LPA',
        noticePeriod: '30 Days'
      }
    ];

    const seededCandidates = [];
    for (const cand of candidateConfigs) {
      let u = await User.findOne({ email: cand.email });
      if (!u) {
        u = await User.create({
          name: cand.name,
          email: cand.email,
          password: 'candidate@123',
          phone: cand.phone,
          role: 'candidate',
          isEmailVerified: true,
          candidateProfile: {
            title: cand.title,
            experience: cand.experience,
            expectedSalary: cand.expectedSalary,
            location: cand.location,
            skills: cand.skills,
            resumeName: `${cand.name.replace(' ', '_')}_Resume.pdf`,
            profileCompleted: 95,
            atsScore: 92,
            preferences: {
              expectedCtc: cand.expectedSalary,
              noticePeriod: cand.noticePeriod,
              preferredLocation: cand.location
            }
          }
        });
      }
      seededCandidates.push(u);
    }
    console.log(`✅ Seeded ${seededCandidates.length} candidate accounts.`);

    // 3. Ensure SJ tech jobs exist in MongoDB
    const sjJobsData = [
      {
        title: 'Plant Production Supervisor',
        company: 'SJ tech',
        employerId: employer._id,
        category: 'Manufacturing & Engineering',
        location: 'Haridwar, Uttarakhand',
        workplaceType: 'On-site',
        jobType: 'Full-Time',
        experience: '3-6 Years',
        salaryMin: 600000,
        salaryMax: 900000,
        salaryDisplay: '₹6.0 - ₹9.0 LPA',
        description: 'Lead manufacturing shifts, oversee shop floor assembly productivity, maintain 5S and workplace safety standards.',
        skills: ['Shop Floor Management', '5S & Kaizen', 'Lean Manufacturing', 'Safety Compliance'],
        vacancies: 2,
        status: 'active'
      },
      {
        title: 'Senior React / Frontend Engineer',
        company: 'SJ tech',
        employerId: employer._id,
        category: 'Information Technology',
        location: 'Bengaluru / Remote',
        workplaceType: 'Hybrid',
        jobType: 'Full-Time',
        experience: '4-7 Years',
        salaryMin: 1500000,
        salaryMax: 2200000,
        salaryDisplay: '₹15.0 - ₹22.0 LPA',
        description: 'Design and build enterprise web applications with React 19, TypeScript, and high-performance UI components.',
        skills: ['React 19', 'TypeScript', 'Next.js', 'Redux', 'Tailwind CSS'],
        vacancies: 3,
        status: 'active'
      },
      {
        title: 'Full Stack Cloud Developer',
        company: 'SJ tech',
        employerId: employer._id,
        category: 'Information Technology',
        location: 'Pune / Remote',
        workplaceType: 'Remote',
        jobType: 'Full-Time',
        experience: '3-5 Years',
        salaryMin: 1300000,
        salaryMax: 1900000,
        salaryDisplay: '₹13.0 - ₹19.0 LPA',
        description: 'Develop scalable backend microservices in Node.js and maintain robust cloud deployment pipelines.',
        skills: ['Node.js', 'Express', 'React', 'MongoDB', 'Docker'],
        vacancies: 2,
        status: 'active'
      }
    ];

    const seededJobs = [];
    for (const jData of sjJobsData) {
      let job = await Job.findOne({ title: jData.title, company: 'SJ tech' });
      if (!job) {
        job = await Job.create(jData);
      } else {
        job.employerId = employer._id;
        await job.save();
      }
      seededJobs.push(job);
    }
    console.log(`✅ Seeded ${seededJobs.length} SJ tech job postings.`);

    // 4. Create Applications in MongoDB
    // Clean old applications for this employer to avoid duplicate clashes
    await Application.deleteMany({ employerId: employer._id });
    await Conversation.deleteMany({ employerId: employer._id });

    const applicationMappings = [
      {
        candidate: seededCandidates[0], // Amit Patel
        job: seededJobs[0], // Plant Production Supervisor
        status: 'Reviewing',
        stage: 2,
        atsScore: 94,
        statusNotes: 'Profile evaluated for shift supervisor role. Screening in progress.',
        initialCandidateMsg: 'Hello SJ tech Team, I have submitted my application for the Plant Production Supervisor position at Haridwar. I have 4 years of experience in shop floor operations and Kaizen.',
        recruiterReply: 'Hi Amit, thank you for applying! Our engineering panel is currently reviewing your shop floor supervisor credentials. We will follow up regarding the technical discussion.'
      },
      {
        candidate: seededCandidates[1], // Rahul Sharma
        job: seededJobs[1], // Senior React Engineer
        status: 'Shortlisted',
        stage: 3,
        atsScore: 92,
        statusNotes: 'Strong frontend architecture experience. Shortlisted for technical round.',
        initialCandidateMsg: 'Hi SJ tech recruiting team, I have applied for the Senior React Engineer role. I specialize in React 19 and scalable UI state systems.',
        recruiterReply: 'Hi Rahul, we are impressed by your React experience! We have shortlisted your application and will schedule a 30-minute interview soon.'
      },
      {
        candidate: seededCandidates[2], // Priya Nair
        job: seededJobs[1], // Senior React Engineer
        status: 'Interview',
        stage: 4,
        atsScore: 88,
        statusNotes: 'Technical interview scheduled with VP of Engineering.',
        initialCandidateMsg: 'Hello, I have submitted my application for the Senior React / Frontend Engineer role. Looking forward to connecting!',
        recruiterReply: 'Hi Priya, we would like to schedule a technical interview on Google Meet. Please let us know if this Wednesday at 2:00 PM works for you.'
      },
      {
        candidate: seededCandidates[3], // Ananya Verma
        job: seededJobs[2], // Full Stack Cloud Developer
        status: 'Applied',
        stage: 1,
        atsScore: 90,
        statusNotes: 'New application received.',
        initialCandidateMsg: 'Hi SJ tech hiring manager, I have applied for the Full Stack Cloud Developer opening. I have extensive experience in Node.js and MongoDB microservices.',
        recruiterReply: null
      }
    ];

    for (const mapping of applicationMappings) {
      const { candidate, job, status, atsScore, statusNotes, initialCandidateMsg, recruiterReply } = mapping;

      const app = await Application.create({
        jobId: job._id,
        candidateId: candidate._id,
        employerId: employer._id,
        jobTitle: job.title,
        companyName: 'SJ tech',
        applicantName: candidate.name,
        applicantEmail: candidate.email,
        applicantPhone: candidate.phone,
        currentTitle: candidate.candidateProfile?.title || 'Candidate',
        experience: candidate.candidateProfile?.experience || '3+ Years',
        coverLetter: `Application submitted for ${job.title} at SJ tech.`,
        resumeName: `${candidate.name.replace(' ', '_')}_CV.pdf`,
        atsResumeData: {
          fullName: candidate.name,
          email: candidate.email,
          phone: candidate.phone,
          title: candidate.candidateProfile?.title,
          experience: candidate.candidateProfile?.experience,
          skills: candidate.candidateProfile?.skills,
          atsScore: atsScore
        },
        status: status,
        statusNotes: statusNotes
      });

      // Create conversation thread in MongoDB
      const conv = await Conversation.create({
        applicationId: app._id,
        jobId: job._id,
        jobTitle: job.title,
        companyName: 'SJ tech',
        employerId: employer._id,
        candidateId: candidate._id,
        employerName: 'employer (SJ tech)',
        candidateName: candidate.name,
        lastMessage: recruiterReply || initialCandidateMsg,
        lastMessageAt: new Date()
      });

      // Message 1 from candidate
      await Message.create({
        conversationId: conv._id,
        senderId: candidate._id,
        senderRole: 'candidate',
        senderName: candidate.name,
        text: initialCandidateMsg,
        createdAt: new Date(Date.now() - 3600000 * 3)
      });

      // Message 2 from employer if present
      if (recruiterReply) {
        await Message.create({
          conversationId: conv._id,
          senderId: employer._id,
          senderRole: 'employer',
          senderName: 'employer (SJ tech)',
          text: recruiterReply,
          createdAt: new Date(Date.now() - 3600000 * 1)
        });
      }
    }

    console.log('✅ Successfully seeded 4 live applications, conversations, and messages in MongoDB Atlas!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding employer database:', err);
    process.exit(1);
  }
};

seedEmployerData();
