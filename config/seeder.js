import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Resume from '../models/Resume.js';

export const seedDatabaseIfEmpty = async () => {
  try {
    // Always ensure Master Admin account exists
    let adminUser = await User.findOne({ email: 'info@jobsetu.net' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Balaji Placements Admin',
        email: 'info@jobsetu.net',
        password: 'admin@123',
        role: 'admin',
        phone: '+91 75000 55715',
        isEmailVerified: true,
        isApproved: true,
        status: 'approved'
      });
      console.log('✅ [Database]: Master Admin account provisioned (info@jobsetu.net)');
    }

    let legacyAdmin = await User.findOne({ email: 'admin@balajiplacement.com' });
    if (!legacyAdmin) {
      await User.create({
        name: 'Balaji Master Admin',
        email: 'admin@balajiplacement.com',
        password: 'admin@123',
        role: 'admin',
        phone: '+91 75000 55715',
        isEmailVerified: true,
        isApproved: true,
        status: 'approved'
      });
    }

    const userCount = await User.countDocuments();
    if (userCount > 1) {
      console.log(`[Database]: Existing collections verified (${userCount} users found).`);
      return;
    }

    console.log('[Database]: Empty database detected. Seeding initial Balaji Placement records...');

    const employerUser = await User.create({
      name: 'Vikram Malhotra',
      email: 'recruiter@tata.com',
      password: 'Password@123',
      role: 'employer',
      phone: '+91 800-TATA-RECRUIT',
      isEmailVerified: true,
      employerProfile: {
        companyName: 'Tata Motors Limited',
        companyWebsite: 'https://tatamotors.com',
        companySize: '10,000+ Employees',
        industry: 'Automotive & Heavy Engineering',
        location: 'Mumbai / Pune, India',
        aboutCompany: 'India’s leading automobile manufacturer pioneering electric and commercial mobility.',
        isVerifiedCompany: true
      }
    });

    const candidateUser = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      password: 'Password@123',
      role: 'candidate',
      phone: '+91 98765 43210',
      isEmailVerified: true,
      candidateProfile: {
        title: 'Senior Full Stack Software Engineer',
        experience: '5 Years',
        expectedSalary: '₹18.0 LPA',
        location: 'Bengaluru, Karnataka, India',
        skills: ['React.js', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Express.js'],
        resumeName: 'Rahul_Sharma_ATS_Resume.pdf',
        profileCompleted: 100
      }
    });

    // 2. Seed Jobs
    const jobs = await Job.insertMany([
      {
        title: 'Senior React / Full Stack Engineer',
        company: 'Tata Motors Digital',
        employerId: employerUser._id,
        category: 'Information Technology',
        location: 'Bengaluru / Hybrid',
        workplaceType: 'Hybrid',
        jobType: 'Full-Time',
        experience: '3-6 Years',
        salaryMin: 1400000,
        salaryMax: 2200000,
        salaryDisplay: '₹14.0 - ₹22.0 LPA',
        description: 'Architect and scale connected vehicle telemetry portals and microservice backends serving millions of IoT requests daily.',
        requirements: [
          'Proficiency with React 19, TypeScript, and modern state management',
          'Solid background in Node.js, RESTful microservices, and MongoDB/SQL',
          'Experience building low-latency, high-throughput cloud applications'
        ],
        skills: ['React.js', 'Node.js', 'TypeScript', 'MongoDB', 'Docker', 'AWS'],
        benefits: ['Comprehensive Medical Insurance', 'Annual Performance Bonus', 'Remote Work Flexibility', 'Learning Stipend'],
        vacancies: 3,
        urgent: true,
        featured: true,
        status: 'active',
        applicantsCount: 1
      },
      {
        title: 'Plant Operations & Assembly Supervisor',
        company: 'Tata Motors Limited',
        employerId: employerUser._id,
        category: 'Manufacturing & Engineering',
        location: 'Pune / Sanand',
        workplaceType: 'On-site',
        jobType: 'Full-Time',
        experience: '4-7 Years',
        salaryMin: 650000,
        salaryMax: 950000,
        salaryDisplay: '₹6.5 - ₹9.5 LPA',
        description: 'Oversee automotive assembly lines, ensure 5S & Kaizen standards, and manage shift productivity and shop floor safety.',
        requirements: [
          'Degree / Diploma in Mechanical or Production Engineering',
          'Experience managing shop floor teams of 40+ operators',
          'Proficiency in SAP ERP and lean manufacturing techniques'
        ],
        skills: ['Shop Floor Operations', '5S & Kaizen', 'Lean Manufacturing', 'SAP ERP'],
        benefits: ['Company Transport', 'Subsidized Cafeteria', 'Quarterly Safety Incentive', 'Medical Coverage'],
        vacancies: 2,
        urgent: false,
        featured: true,
        status: 'active',
        applicantsCount: 0
      },
      {
        title: 'Senior QA / QC Officer (Pharma Formulations)',
        company: 'Sun Pharma Industries',
        employerId: employerUser._id,
        category: 'Healthcare & Pharma',
        location: 'Halol / Vadodara, Gujarat',
        workplaceType: 'On-site',
        jobType: 'Full-Time',
        experience: '3-6 Years',
        salaryMin: 550000,
        salaryMax: 800000,
        salaryDisplay: '₹5.5 - ₹8.0 LPA',
        description: 'Lead IPQA inspections, validation protocol documentation, and USFDA compliance audits for oral solid dosage formulations.',
        requirements: [
          'B.Pharm / M.Pharm with 3+ years in formulation QA/QC',
          'In-depth knowledge of cGMP, USFDA, and WHO guidelines',
          'Experience with HPLC instrumentation and stability testing protocols'
        ],
        skills: ['IPQA', 'cGMP Guidelines', 'Validation Protocols', 'HPLC', 'USFDA Compliance'],
        benefits: ['PF & Gratuity', 'Health Insurance', 'Annual Bonus'],
        vacancies: 4,
        urgent: true,
        featured: false,
        status: 'active',
        applicantsCount: 0
      }
    ]);

    // 3. Seed Application & Direct Chat Conversation
    const targetJob = jobs[0];
    const application = await Application.create({
      jobId: targetJob._id,
      candidateId: candidateUser._id,
      employerId: employerUser._id,
      jobTitle: targetJob.title,
      companyName: targetJob.company,
      applicantName: candidateUser.name,
      applicantEmail: candidateUser.email,
      applicantPhone: candidateUser.phone,
      currentTitle: 'Senior Full Stack Software Engineer',
      experience: '5 Years',
      coverLetter: 'Excited to apply for the Senior React / Full Stack Engineer opening at Tata Motors Digital.',
      resumeName: 'Rahul_Sharma_ATS_Resume.pdf',
      status: 'Shortlisted',
      statusNotes: 'Technical round scheduled with Lead Architect.'
    });

    const conversation = await Conversation.create({
      applicationId: application._id,
      jobId: targetJob._id,
      jobTitle: targetJob.title,
      companyName: targetJob.company,
      employerId: employerUser._id,
      candidateId: candidateUser._id,
      employerName: 'Vikram Malhotra (Lead Recruiter)',
      candidateName: candidateUser.name,
      lastMessage: 'Hi Rahul, we reviewed your ATS resume (Score 92%) and would like to schedule a 45-min video screening.',
      lastMessageAt: new Date()
    });

    await Message.create({
      conversationId: conversation._id,
      senderId: candidateUser._id,
      senderRole: 'candidate',
      senderName: candidateUser.name,
      text: `Hello Vikram, I have submitted my application for the ${targetJob.title} position at ${targetJob.company}. Looking forward to discussing the role!`
    });

    await Message.create({
      conversationId: conversation._id,
      senderId: employerUser._id,
      senderRole: 'employer',
      senderName: 'Vikram Malhotra',
      text: `Hi Rahul, thank you for applying! We reviewed your ATS profile and would like to schedule a 45-min technical screening this Thursday at 3 PM IST.`
    });

    // 4. Seed ATS Resume
    await Resume.create({
      candidateId: candidateUser._id,
      personalInfo: {
        fullName: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '+91 98765 43210',
        location: 'Bengaluru, Karnataka, India',
        title: 'Senior Full Stack Software Engineer',
        linkedin: 'linkedin.com/in/rahulsharma',
        github: 'github.com/rahulsharma',
        portfolio: 'rahulsharma.dev'
      },
      summary: 'Results-driven Full Stack Software Engineer with 5+ years of hands-on experience architecting scalable web applications, RESTful microservices, and distributed cloud systems using React, Node.js, and MongoDB.',
      experiences: [
        {
          id: 'exp-1',
          company: 'Infosys Ltd',
          role: 'Senior Software Engineer',
          location: 'Bengaluru, India',
          startDate: 'Apr 2022',
          endDate: 'Present',
          current: true,
          description: 'Leading a core engineering squad building high-throughput recruitment workflow engines serving 1M+ daily active sessions with 99.98% uptime.',
          highlights: [
            'Architected modular REST APIs cutting server response latencies by 38%',
            'Mentored 6 associate engineers in TypeScript, clean code, and automated CI/CD pipeline deployments'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'Pune Institute of Computer Technology',
          degree: 'Bachelor of Technology (B.Tech)',
          fieldOfStudy: 'Computer Engineering',
          location: 'Pune, India',
          startDate: 'Aug 2016',
          endDate: 'May 2020',
          grade: '8.8 CGPA / First Class with Distinction'
        }
      ],
      skills: {
        technical: ['JavaScript (ES6+)', 'TypeScript', 'React.js', 'Node.js', 'Express.js', 'Python', 'RESTful APIs', 'SQL', 'MongoDB'],
        frameworks: ['Tailwind CSS', 'Next.js', 'Redux Toolkit', 'Jest', 'Docker'],
        tools: ['Git', 'GitHub Actions', 'Postman', 'AWS (S3, EC2)', 'VS Code', 'Linux'],
        softSkills: ['Agile / Scrum', 'Team Leadership', 'Technical Mentorship', 'Problem Solving', 'Cross-functional Collaboration']
      },
      projects: [
        {
          id: 'proj-1',
          title: 'Automated ATS Candidate Screening Engine',
          role: 'Lead Architect',
          technologies: 'React, Node.js, Express, MongoDB, NLP Parsing',
          link: 'github.com/rahul/ats-screener',
          description: 'Constructed an automated resume keyword indexer parsing unstructured PDF documents into standardized structured candidate profiles with 94% accuracy.'
        }
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Solutions Architect – Associate',
          issuer: 'Amazon Web Services',
          issueDate: 'Nov 2023',
          credentialUrl: 'aws.amazon.com/verification'
        }
      ]
    });

    console.log('✅ [Database]: Successfully seeded initial Admin, Employer, Candidate, Jobs, and ATS Resume data into MongoDB Atlas!');
  } catch (error) {
    console.error('❌ [Database Seeding Error]:', error.message);
  }
};
