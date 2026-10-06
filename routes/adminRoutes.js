import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  updateUserByAdmin,
  deleteUser,
  getEmployers,
  approveEmployer,
  rejectEmployer
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserByAdmin);
router.delete('/users/:id', deleteUser);

// Employer Approval and Verification Endpoints
router.get('/employers', getEmployers);
router.put('/employers/:id/approve', approveEmployer);
router.put('/employers/:id/reject', rejectEmployer);

export default router;
