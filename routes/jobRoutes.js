import express from 'express';
import { getJobs, getJobById, createJob, updateJob, deleteJob } from '../controllers/jobController.js';
import { optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', optionalProtect, createJob);
router.put('/:id', optionalProtect, updateJob);
router.delete('/:id', optionalProtect, deleteJob);

export default router;

