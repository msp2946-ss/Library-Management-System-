import express from 'express';
import {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
} from '../controllers/memberController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getMembers)
  .post(createMember);

router.route('/:id')
  .get(getMemberById)
  .put(updateMember)
  .delete(authorize('admin'), deleteMember); // Only admin can delete

export default router;
