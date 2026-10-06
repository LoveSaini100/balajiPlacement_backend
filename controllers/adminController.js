import mongoose from 'mongoose';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Conversation from '../models/Conversation.js';

// @desc    Get complete administrative metrics & counts
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCandidates = await User.countDocuments({ role: 'candidate' });
    const totalEmployers = await User.countDocuments({ role: 'employer' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();
    const totalConversations = await Conversation.countDocuments();

    // Application status breakdown
    const shortlistedCount = await Application.countDocuments({ status: 'Shortlisted' });
    const hiredCount = await Application.countDocuments({ status: 'Hired' });
    const pendingCount = await Application.countDocuments({ status: 'Applied' });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCandidates,
        totalEmployers,
        totalJobs,
        activeJobs,
        totalApplications,
        totalConversations,
        pipeline: {
          pending: pendingCount,
          shortlisted: shortlistedCount,
          hired: hiredCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all registered users across website (Candidates, Employers, Admins)
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { 'employerProfile.companyName': new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role or verification status
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
export const updateUserByAdmin = async (req, res) => {
  try {
    const { role, isEmailVerified, name, phone } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role) user.role = role;
    if (typeof isEmailVerified === 'boolean') user.isEmailVerified = isEmailVerified;
    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();
    res.status(200).json({ success: true, data: user, message: 'User record updated by admin' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user and associated data
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User account removed by admin' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all employers with pending/approved/rejected counts and status
// @route   GET /api/admin/employers
// @access  Private (Admin)
export const getEmployers = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = { role: 'employer' };

    if (status && status !== 'all') {
      if (status === 'pending') {
        query.$or = [
          { 'employerProfile.verificationStatus': 'pending' },
          { isApproved: false }
        ];
      } else if (status === 'approved') {
        query['employerProfile.verificationStatus'] = 'approved';
        query.isApproved = true;
      } else if (status === 'rejected') {
        query['employerProfile.verificationStatus'] = 'rejected';
      }
    }

    if (search) {
      query.$and = [
        query,
        {
          $or: [
            { name: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') },
            { 'employerProfile.companyName': new RegExp(search, 'i') }
          ]
        }
      ];
    }

    const employers = await User.find(query).sort({ createdAt: -1 });

    const totalCount = await User.countDocuments({ role: 'employer' });
    const pendingCount = await User.countDocuments({
      role: 'employer',
      $or: [
        { 'employerProfile.verificationStatus': 'pending' },
        { isApproved: false }
      ]
    });
    const approvedCount = await User.countDocuments({
      role: 'employer',
      'employerProfile.verificationStatus': 'approved',
      isApproved: true
    });
    const rejectedCount = await User.countDocuments({
      role: 'employer',
      'employerProfile.verificationStatus': 'rejected'
    });

    res.status(200).json({
      success: true,
      count: employers.length,
      counts: {
        total: totalCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount
      },
      data: employers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve employer registration and activate ATS access
// @route   PUT /api/admin/employers/:id/approve
// @access  Private (Admin)
export const approveEmployer = async (req, res) => {
  try {
    const { id } = req.params;
    let user = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await User.findById(id);
    }
    if (!user) {
      user = await User.findOne({
        $or: [
          { email: id.toLowerCase() },
          { 'employerProfile.companyName': new RegExp(`^${id}$`, 'i') }
        ]
      });
    }

    if (!user || user.role !== 'employer') {
      return res.status(404).json({ success: false, message: 'Employer account not found' });
    }

    user.isApproved = true;
    user.status = 'approved';
    if (!user.employerProfile) user.employerProfile = {};
    user.employerProfile.isVerifiedCompany = true;
    user.employerProfile.verificationStatus = 'approved';
    user.employerProfile.rejectionReason = '';

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: `Employer "${user.employerProfile?.companyName || user.name}" has been verified and approved!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject employer registration
// @route   PUT /api/admin/employers/:id/reject
// @access  Private (Admin)
export const rejectEmployer = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    let user = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await User.findById(id);
    }
    if (!user) {
      user = await User.findOne({
        $or: [
          { email: id.toLowerCase() },
          { 'employerProfile.companyName': new RegExp(`^${id}$`, 'i') }
        ]
      });
    }

    if (!user || user.role !== 'employer') {
      return res.status(404).json({ success: false, message: 'Employer account not found' });
    }

    user.isApproved = false;
    user.status = 'rejected';
    if (!user.employerProfile) user.employerProfile = {};
    user.employerProfile.isVerifiedCompany = false;
    user.employerProfile.verificationStatus = 'rejected';
    user.employerProfile.rejectionReason = reason || 'Verification documents or criteria did not meet platform safety requirements.';

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: `Employer "${user.employerProfile?.companyName || user.name}" registration has been rejected.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
