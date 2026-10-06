import mongoose from 'mongoose';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Application from '../models/Application.js';

// @desc    Get user's conversations (Candidate or Employer)
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const userEmail = (req.user?.email || '').toLowerCase().trim();
    const userId = req.user?._id;

    let query = {};
    if (req.user?.role === 'candidate') {
      query = {
        $or: [
          { candidateId: userId },
          ...(userEmail ? [{ candidateEmail: userEmail }] : [])
        ]
      };
    } else if (req.user?.role === 'employer') {
      query = {
        $or: [
          { employerId: userId },
          ...(userEmail ? [{ employerEmail: userEmail }] : []),
          { candidateId: userId },
          ...(userEmail ? [{ candidateEmail: userEmail }] : []),
          { employerId: null },
          { employerId: { $exists: false } }
        ]
      };
    } else {
      // Admin or general
      query = {
        $or: [
          { candidateId: userId },
          { employerId: userId },
          ...(userEmail ? [{ candidateEmail: userEmail }, { employerEmail: userEmail }] : [])
        ]
      };
    }

    const conversations = await Conversation.find(query)
      .populate('jobId', 'title company location')
      .populate('candidateId', 'name email phone candidateProfile')
      .populate('employerId', 'name email employerProfile')
      .sort({ lastMessageAt: -1 });

    res.status(200).json({ success: true, count: conversations.length, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper to find or provision conversation by id or applicationId
const findOrProvisionConversation = async (paramId, user) => {
  if (!paramId) return null;

  let conv = null;
  if (mongoose.Types.ObjectId.isValid(paramId)) {
    conv = await Conversation.findById(paramId);
    if (!conv) {
      conv = await Conversation.findOne({ applicationId: paramId });
    }
  }

  if (!conv) {
    conv = await Conversation.findOne({
      $or: [
        { applicationId: paramId },
        { _id: paramId }
      ]
    });
  }

  // If still not found, check if an Application exists with this id
  if (!conv && mongoose.Types.ObjectId.isValid(paramId)) {
    try {
      const app = await Application.findById(paramId).populate('jobId');
      if (app) {
        conv = await Conversation.create({
          applicationId: app._id,
          jobId: app.jobId?._id || app.jobId,
          jobTitle: app.jobTitle || app.jobId?.title || 'Open Position',
          companyName: app.companyName || app.jobId?.company || 'Company',
          employerId: app.employerId || null,
          employerEmail: 'employer@gmail.com',
          employerName: app.companyName || 'Recruiter',
          candidateId: app.candidateId || user?._id || null,
          candidateEmail: app.applicantEmail || user?.email || '',
          candidateName: app.applicantName || user?.name || 'Candidate',
          lastMessage: `Application conversation thread for ${app.jobTitle || 'role'}.`,
          lastMessageAt: new Date()
        });

        // Add initial system / welcome greeting
        await Message.create({
          conversationId: conv._id,
          senderId: app.candidateId || user?._id || 'candidate-id',
          senderRole: 'candidate',
          senderName: app.applicantName || 'Candidate',
          text: `Hello, I have submitted my application for the position of ${app.jobTitle} at ${app.companyName || 'SJ tech'}.`
        });
      }
    } catch (createErr) {
      console.warn("Auto-provision conversation notice:", createErr.message);
    }
  }

  return conv;
};

// @desc    Get messages inside a conversation thread
// @route   GET /api/messages/conversations/:id/messages
// @access  Private
export const getMessagesByConversation = async (req, res) => {
  try {
    const conversation = await findOrProvisionConversation(req.params.id, req.user);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Mark messages as read
    if (req.user?._id) {
      await Message.updateMany(
        {
          conversationId: conversation._id,
          senderId: { $ne: req.user._id },
          isRead: false
        },
        { isRead: true }
      );
    }

    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, data: messages, conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a message in conversation thread
// @route   POST /api/messages/conversations/:id/send
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { text, senderRole, senderName } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    const conversation = await findOrProvisionConversation(req.params.id, req.user);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const role = senderRole || req.user?.role || 'candidate';
    const name = senderName || req.user?.name || (role === 'employer' ? 'Recruiter' : 'Candidate');
    const senderId = req.user?._id || (role === 'employer' ? conversation.employerId || 'employer-id' : conversation.candidateId || 'candidate-id');

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      senderRole: role,
      senderName: name,
      text: text.trim()
    });

    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = new Date();
    if (role === 'candidate') {
      conversation.unreadCountEmployer = (conversation.unreadCountEmployer || 0) + 1;
    } else {
      conversation.unreadCountCandidate = (conversation.unreadCountCandidate || 0) + 1;
    }
    await conversation.save();

    res.status(201).json({ success: true, data: message, conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

