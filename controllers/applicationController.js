import mongoose from 'mongoose';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

// @desc    Candidate applies for a job
// @route   POST /api/applications
// @access  Private (Candidate, User)
export const applyJob = async (req, res) => {
  try {
    const { 
      jobId, 
      coverLetter, 
      resumeUrl, 
      resumeDataUrl, 
      resumeSize, 
      resumeName, 
      resumeSource, 
      atsResumeData 
    } = req.body;

    let job = null;
    if (mongoose.Types.ObjectId.isValid(jobId)) {
      job = await Job.findById(jobId);
    }
    if (!job) {
      job = await Job.findOne({ slug: jobId });
    }
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    const actualJobId = job._id;
    const userEmail = (req.user?.email || req.body.email || '').toLowerCase().trim();
    const userId = req.user?._id;

    // Check if applicant already applied
    const existing = await Application.findOne({
      jobId: actualJobId,
      $or: [
        { candidateId: userId },
        ...(userEmail ? [{ applicantEmail: userEmail }] : [])
      ]
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already submitted an application for this position' });
    }

    const resolvedResumeSource = resumeSource || (atsResumeData ? 'built_in' : 'outer_file');
    const defaultResumeName = resolvedResumeSource === 'built_in' 
      ? `${req.user?.name || req.body.name || 'Candidate'}_ATS_Resume.pdf` 
      : `${req.user?.name || req.body.name || 'Candidate'}_Resume.pdf`;

    const application = await Application.create({
      jobId: actualJobId,
      candidateId: userId,
      employerId: job.employerId || null,
      jobTitle: job.title,
      companyName: job.company,
      applicantName: req.user?.name || req.body.name || 'Candidate',
      applicantEmail: userEmail,
      applicantPhone: req.user?.phone || req.body.phone || '',
      currentTitle: req.user?.candidateProfile?.title || req.user?.title || 'Candidate',
      experience: req.user?.candidateProfile?.experience || req.user?.experience || '1-3 Years',
      coverLetter: coverLetter || '',
      resumeSource: resolvedResumeSource,
      resumeName: resumeName || req.user?.candidateProfile?.resumeName || defaultResumeName,
      resumeUrl: resumeUrl || req.user?.candidateProfile?.resumeUrl || '',
      resumeDataUrl: resumeDataUrl || '',
      resumeSize: resumeSize || '',
      atsResumeData: atsResumeData || null,
      status: 'Applied'
    });

    // Increment applicantsCount on job
    job.applicantsCount = (job.applicantsCount || 0) + 1;
    await job.save();

    // Auto-create messaging conversation thread between candidate and employer
    let conv = null;
    try {
      conv = await Conversation.create({
        applicationId: application._id,
        jobId: actualJobId,
        jobTitle: job.title,
        companyName: job.company,
        employerId: job.employerId || null,
        employerEmail: 'employer@gmail.com',
        employerName: job.company || 'Recruiter',
        candidateId: userId,
        candidateEmail: userEmail,
        candidateName: req.user?.name || 'Candidate',
        lastMessage: `Hello, I have submitted my application for the position of ${job.title} at ${job.company}.`,
        lastMessageAt: new Date()
      });

      await Message.create({
        conversationId: conv._id,
        senderId: userId,
        senderRole: 'candidate',
        senderName: req.user?.name || 'Candidate',
        text: `Hello, I have submitted my application for the position of ${job.title} at ${job.company}. Looking forward to hearing from your recruitment team!`
      });
    } catch (convErr) {
      console.warn("Auto-conversation notice:", convErr.message);
    }

    res.status(201).json({
      success: true,
      data: application,
      conversation: conv,
      message: 'Application submitted successfully! Your recruiter conversation thread is active.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get candidate's submitted applications
// @route   GET /api/applications/my
// @access  Private (Candidate, User)
export const getCandidateApplications = async (req, res) => {
  try {
    const userEmail = (req.user?.email || '').toLowerCase().trim();
    const userId = req.user?._id;

    let query = {};
    if (userId || userEmail) {
      query = {
        $or: [
          ...(userId ? [{ candidateId: userId }] : []),
          ...(userEmail ? [{ applicantEmail: userEmail }] : [])
        ]
      };
    }

    const applications = await Application.find(query)
      .populate('jobId')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get employer's received applicants
// @route   GET /api/applications/employer
// @access  Private (Employer, Admin)
export const getEmployerApplications = async (req, res) => {
  try {
    let query = {};
    if (req.user?.role === 'employer') {
      const companyName = req.user.employerProfile?.companyName || '';
      const employerJobs = await Job.find({
        $or: [
          { employerId: req.user._id },
          ...(companyName ? [{ company: new RegExp(`^${companyName}$`, 'i') }] : [])
        ]
      }).select('_id');

      const jobIds = employerJobs.map(j => j._id);

      query = {
        $or: [
          { employerId: req.user._id },
          ...(jobIds.length > 0 ? [{ jobId: { $in: jobIds } }] : []),
          ...(companyName ? [{ companyName: new RegExp(`^${companyName}$`, 'i') }] : [])
        ]
      };
    } else if (req.user?.role === 'candidate') {
      // Return their own submitted applications
      const userEmail = (req.user.email || '').toLowerCase().trim();
      query = {
        $or: [
          { candidateId: req.user._id },
          ...(userEmail ? [{ applicantEmail: userEmail }] : [])
        ]
      };
    }

    const applications = await Application.find(query)
      .populate('jobId')
      .populate('candidateId', 'name email phone candidateProfile')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Application Status & Pipeline Stage (e.g. Shortlisted, Interview Scheduled, Offered, Rejected)
// @route   PUT /api/applications/:id/status
// @access  Private (Employer, Admin)
export const updateApplicationStatus = async (req, res) => {
  try {
    let application = null;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      application = await Application.findById(req.params.id);
    }
    if (!application) {
      application = await Application.findOne({
        $or: [
          { _id: req.params.id },
          { applicantEmail: (req.params.id || '').toLowerCase().trim() }
        ]
      });
    }

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application record not found' });
    }

    // Role verification (safe for undefined user / employer / admin)
    if (req.user && req.user.role && req.user.role !== 'admin' && req.user.role !== 'employer') {
      if (application.employerId && application.employerId.toString() !== req.user._id?.toString()) {
        const job = await Job.findById(application.jobId);
        if (job && job.employerId && job.employerId.toString() !== req.user._id?.toString()) {
          return res.status(403).json({ success: false, message: 'Not authorized to manage this applicant' });
        }
      }
    }

    const { status, statusNotes, stage, rating, interviewDetails } = req.body;

    if (status) {
      application.status = status;
      if (stage !== undefined && stage !== null) {
        application.stage = Number(stage);
      } else {
        if (status === 'Hired' || status === 'Offered' || status === 'Offer Extended') application.stage = 5;
        else if (status === 'Interview' || status === 'Interview Scheduled') application.stage = 4;
        else if (status === 'Shortlisted') application.stage = 3;
        else if (status === 'Reviewing' || status === 'Under Review') application.stage = 2;
        else if (status === 'Rejected') application.stage = 6;
        else application.stage = 1;
      }
    }

    if (stage !== undefined && stage !== null && !status) {
      application.stage = Number(stage);
    }

    if (statusNotes !== undefined) {
      application.statusNotes = statusNotes;
    }

    if (rating !== undefined) {
      application.rating = Number(rating);
    }

    if (interviewDetails) {
      application.interviewDetails = {
        date: interviewDetails.date || application.interviewDetails?.date || '',
        time: interviewDetails.time || application.interviewDetails?.time || '',
        type: interviewDetails.type || application.interviewDetails?.type || 'Google Meet / Video',
        meetLink: interviewDetails.meetLink || application.interviewDetails?.meetLink || 'https://meet.google.com/job-portal-demo',
        interviewer: interviewDetails.interviewer || application.interviewDetails?.interviewer || 'Talent Acquisition Team',
        notes: interviewDetails.notes || application.interviewDetails?.notes || '',
        scheduledAt: new Date()
      };
    }

    await application.save();

    // If interview scheduled, ensure an interview invite message is posted in the candidate-employer conversation thread
    if ((status === 'Interview Scheduled' || application.status === 'Interview Scheduled') && application.interviewDetails?.date) {
      try {
        let conv = await Conversation.findOne({
          $or: [
            { applicationId: application._id },
            { jobId: application.jobId, candidateEmail: application.applicantEmail }
          ]
        });

        if (!conv) {
          conv = await Conversation.create({
            applicationId: application._id,
            jobId: application.jobId,
            jobTitle: application.jobTitle || 'Open Position',
            companyName: application.companyName || 'SJ tech',
            employerId: application.employerId || null,
            employerEmail: 'employer@gmail.com',
            employerName: application.companyName || 'Recruiter',
            candidateId: application.candidateId || null,
            candidateEmail: application.applicantEmail || '',
            candidateName: application.applicantName || 'Candidate',
            lastMessage: `📅 Interview Scheduled for ${application.interviewDetails.date} at ${application.interviewDetails.time}`,
            lastMessageAt: new Date()
          });
        }

        const inviteText = `📅 INTERVIEW INVITATION SCHEDULED\n\nRole: ${application.jobTitle}\nDate: ${application.interviewDetails.date}\nTime: ${application.interviewDetails.time} IST\nFormat: ${application.interviewDetails.type}\nMeeting Link: ${application.interviewDetails.meetLink}\nInterviewer: ${application.interviewDetails.interviewer}\n\nPlease be online 5 minutes before the scheduled time. Looking forward to our conversation!`;

        await Message.create({
          conversationId: conv._id,
          senderId: application.employerId || req.user?._id || 'employer-id',
          senderRole: 'employer',
          senderName: `${application.companyName || 'Recruiter'} Hiring Team`,
          text: inviteText
        });

        conv.lastMessage = `📅 Interview Scheduled: ${application.interviewDetails.date} at ${application.interviewDetails.time}`;
        conv.lastMessageAt = new Date();
        conv.unreadCountCandidate = (conv.unreadCountCandidate || 0) + 1;
        await conv.save();
      } catch (convErr) {
        console.warn("Interview invite message creation notice:", convErr.message);
      }
    }

    res.status(200).json({
      success: true,
      data: application,
      message: `Applicant pipeline status updated to '${application.status}' (Stage ${application.stage})`
    });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
