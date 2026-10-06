import express from 'express';
import { getMyResume, saveResume, uploadResumeFile, deleteUploadedResume } from '../controllers/resumeController.js';
import { protect, authorize } from '../middleware/auth.js';
import { handleResumeUpload } from '../middleware/upload.js';

const router = express.Router();

// File upload endpoint (supports both authenticated candidates and public application uploads)
router.post('/upload-file', (req, res, next) => {
  // Optional auth check without hard failure
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    return protect(req, res, () => {
      handleResumeUpload(req, res, () => uploadResumeFile(req, res, next));
    });
  }
  handleResumeUpload(req, res, () => uploadResumeFile(req, res, next));
});

// Delete uploaded resume (Candidate)
router.delete('/delete-file', protect, authorize('candidate', 'admin'), deleteUploadedResume);

// ATS Resume Builder JSON Endpoints
router.get('/', protect, authorize('candidate', 'admin'), getMyResume);
router.post('/', protect, authorize('candidate', 'admin'), saveResume);

export default router;
