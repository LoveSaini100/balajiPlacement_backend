import Resume from '../models/Resume.js';
import User from '../models/User.js';

// @desc    Get Candidate's ATS Resume Data
// @route   GET /api/resume
// @access  Private (Candidate)
export const getMyResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({ candidateId: req.user._id });
    if (!resume) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No ATS resume created yet'
      });
    }
    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save/Update Candidate's ATS Resume Data
// @route   POST /api/resume
// @access  Private (Candidate)
export const saveResume = async (req, res) => {
  try {
    const resumeData = req.body;
    let resume = await Resume.findOneAndUpdate(
      { candidateId: req.user._id },
      { ...resumeData, candidateId: req.user._id },
      { new: true, upsert: true, runValidators: true }
    );

    // Sync title, location, phone, skills, about, experienceList, and education with candidate profile
    const candidateUser = await User.findById(req.user._id);
    if (candidateUser) {
      if (!candidateUser.candidateProfile) {
        candidateUser.candidateProfile = {};
      }
      if (resumeData.personalInfo?.fullName) candidateUser.name = resumeData.personalInfo.fullName;
      if (resumeData.personalInfo?.title) candidateUser.candidateProfile.title = resumeData.personalInfo.title;
      if (resumeData.personalInfo?.location) candidateUser.candidateProfile.location = resumeData.personalInfo.location;
      if (resumeData.personalInfo?.phone) candidateUser.phone = resumeData.personalInfo.phone;
      if (resumeData.summary) candidateUser.candidateProfile.about = resumeData.summary;
      
      const allSkills = Array.from(new Set([
        ...(resumeData.skills?.technical || []),
        ...(resumeData.skills?.frameworks || []),
        ...(resumeData.skills?.tools || []),
        ...(resumeData.skills?.softSkills || [])
      ])).filter(Boolean);
      if (allSkills.length > 0) candidateUser.candidateProfile.skills = allSkills;

      if (resumeData.experiences) {
        candidateUser.candidateProfile.experienceList = (resumeData.experiences || []).map(exp => ({
          id: exp.id,
          title: exp.role || exp.company || 'Role',
          role: exp.role || '',
          company: exp.company || '',
          location: exp.location || '',
          period: `${exp.startDate || ''} - ${exp.endDate || 'Present'}`,
          startDate: exp.startDate || '',
          endDate: exp.endDate || 'Present',
          description: exp.description || (exp.highlights || []).filter(Boolean).join('. ')
        }));
      }

      if (resumeData.education) {
        candidateUser.candidateProfile.education = (resumeData.education || []).map(edu => ({
          id: edu.id,
          degree: edu.degree || 'Degree',
          fieldOfStudy: edu.fieldOfStudy || '',
          institution: edu.institution || 'University',
          year: edu.endDate || edu.startDate || '',
          endDate: edu.endDate || '',
          grade: edu.grade || '',
          location: edu.location || ''
        }));
      }

      candidateUser.candidateProfile.resumeName = `${(resumeData.personalInfo?.fullName || candidateUser.name || 'Candidate').replace(/\s+/g, '_')}_ATS_Resume.pdf`;
      candidateUser.candidateProfile.atsScore = 95;
      await candidateUser.save();
    }

    res.status(200).json({
      success: true,
      data: resume,
      message: 'ATS Resume saved and synced with your primary candidate profile!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const formatBytes = (bytes) => {
  if (!bytes) return '0 KB';
  const k = 1024;
  const dm = 1;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// @desc    Upload candidate resume file (PDF / DOC / DOCX max 5MB)
// @route   POST /api/resume/upload-file
// @access  Private (Candidate) / Public (With fallback)
export const uploadResumeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select a PDF or Word document.'
      });
    }

    const relativeUrl = `/uploads/resumes/${req.file.filename}`;
    const formattedSize = formatBytes(req.file.size);

    // If candidate is logged in, sync with user profile
    if (req.user && req.user._id) {
      const candidateUser = await User.findById(req.user._id);
      if (candidateUser) {
        if (!candidateUser.candidateProfile) {
          candidateUser.candidateProfile = {};
        }

        // Remove old physical file if exists
        if (candidateUser.candidateProfile.resumeUrl && candidateUser.candidateProfile.resumeUrl.startsWith('/uploads/resumes/')) {
          const oldFilename = path.basename(candidateUser.candidateProfile.resumeUrl);
          const oldFilePath = path.join(__dirname, '../uploads/resumes', oldFilename);
          if (fs.existsSync(oldFilePath)) {
            try {
              fs.unlinkSync(oldFilePath);
            } catch (unlinkErr) {
              console.warn('Old resume unlink notice:', unlinkErr.message);
            }
          }
        }

        candidateUser.candidateProfile.resumeUrl = relativeUrl;
        candidateUser.candidateProfile.resumeName = req.file.originalname;
        candidateUser.candidateProfile.resumeSize = formattedSize;
        candidateUser.candidateProfile.resumeType = req.file.mimetype;
        await candidateUser.save();
      }
    }

    res.status(200).json({
      success: true,
      fileName: req.file.originalname,
      fileUrl: relativeUrl,
      fileSize: formattedSize,
      message: 'Resume uploaded successfully to server!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete uploaded candidate resume file
// @route   DELETE /api/resume/delete-file
// @access  Private (Candidate)
export const deleteUploadedResume = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const candidateUser = await User.findById(req.user._id);
    if (!candidateUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete physical file from uploads folder if it exists
    if (candidateUser.candidateProfile?.resumeUrl && candidateUser.candidateProfile.resumeUrl.startsWith('/uploads/resumes/')) {
      const filename = path.basename(candidateUser.candidateProfile.resumeUrl);
      const filePath = path.join(__dirname, '../uploads/resumes', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.warn('Resume file unlink notice:', unlinkErr.message);
        }
      }
    }

    if (candidateUser.candidateProfile) {
      candidateUser.candidateProfile.resumeUrl = '';
      candidateUser.candidateProfile.resumeName = '';
      candidateUser.candidateProfile.resumeSize = '';
      candidateUser.candidateProfile.resumeType = '';
    }

    await candidateUser.save();

    res.status(200).json({
      success: true,
      message: 'Uploaded resume deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
