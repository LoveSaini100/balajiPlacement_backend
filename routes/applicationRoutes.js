import express from 'express';
import {
  applyJob,
  getCandidateApplications,
  getEmployerApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { protect, optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalProtect, applyJob);
router.get('/my', optionalProtect, getCandidateApplications);
router.get('/employer', optionalProtect, getEmployerApplications);
router.put('/:id/status', optionalProtect, updateApplicationStatus);

export default router;

