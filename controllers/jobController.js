import mongoose from 'mongoose';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Conversation from '../models/Conversation.js';

// @desc    Get all active jobs with optional filtering
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const { category, location, workplaceType, jobType, search, experience, status, employerId } = req.query;
    let query = {};

    if (status && status.toLowerCase() !== 'all') {
      query.status = status.toLowerCase();
    } else if (!status) {
      query.status = 'active';
    }

    if (employerId) {
      query.employerId = employerId;
    }

    if (category) query.category = new RegExp(category, 'i');
    if (location) query.location = new RegExp(location, 'i');
    if (workplaceType) query.workplaceType = workplaceType;
    if (jobType) query.jobType = jobType;
    if (experience) query.experience = new RegExp(experience, 'i');

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job by ID or Slug
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    let job = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      job = await Job.findById(id);
    }
    if (!job) {
      job = await Job.findOne({ slug: id });
    }
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new job posting (Employer or Admin)
// @route   POST /api/jobs
// @access  Private (Employer, Admin)
export const createJob = async (req, res) => {
  try {
    const title = req.body.title || 'Job Opening';
    const company = req.body.company || req.user?.employerProfile?.companyName || 'Corporate Employer';
    const loc = req.body.location || 'Bengaluru';
    const slug = req.body.slug || `${title}-${company}-${loc}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const salaryVal = req.body.salary || req.body.salaryDisplay || (req.body.salaryMin && req.body.salaryMax ? `₹${(req.body.salaryMin/100000).toFixed(1)} - ₹${(req.body.salaryMax/100000).toFixed(1)} LPA` : 'Competitive CTC');
    const salaryDisplayVal = req.body.salaryDisplay || req.body.salary || salaryVal;

    const jobData = {
      ...req.body,
      title,
      company,
      slug,
      salary: salaryVal,
      salaryDisplay: salaryDisplayVal,
      employerId: req.user?._id || undefined,
      status: req.body.status ? req.body.status.toLowerCase() : 'active',
      description: req.body.description || req.body.overview || 'Comprehensive job description for the role.'
    };

    const job = await Job.create(jobData);
    res.status(201).json({ success: true, data: job, message: 'Job posting published successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update job posting
// @route   PUT /api/jobs/:id
// @access  Private (Employer owner, Admin)
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    let job = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      job = await Job.findById(id);
    }
    if (!job) {
      job = await Job.findOne({ slug: id });
    }
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    const updateData = { ...req.body };
    if (updateData.status) {
      updateData.status = updateData.status.toLowerCase();
    }
    if (updateData.salary || updateData.salaryDisplay) {
      const sal = updateData.salary || updateData.salaryDisplay;
      updateData.salary = sal;
      updateData.salaryDisplay = updateData.salaryDisplay || sal;
    }
    if (updateData.overview && !updateData.description) {
      updateData.description = updateData.overview;
    }
    if (updateData.vacancies) {
      updateData.vacancies = Number(updateData.vacancies) || 1;
    }

    job = await Job.findByIdAndUpdate(job._id, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: job, message: 'Job updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete job posting from database
// @route   DELETE /api/jobs/:id
// @access  Private (Employer owner, Admin)
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    let job = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      job = await Job.findById(id);
    }
    if (!job) {
      job = await Job.findOne({ slug: id });
    }
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    const targetJobId = job._id;

    // Delete job from MongoDB
    await Job.findByIdAndDelete(targetJobId);

    // Cascading delete for related applications and conversations
    try {
      await Application.deleteMany({ jobId: targetJobId });
      await Conversation.deleteMany({ jobId: targetJobId });
    } catch (cleanErr) {
      console.warn("Clean job references notice:", cleanErr.message);
    }

    res.status(200).json({
      success: true,
      data: { id: targetJobId },
      message: 'Job posting permanently deleted'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


