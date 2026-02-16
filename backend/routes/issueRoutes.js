import express from 'express';
import {
  issueBook,
  returnBook,
  getIssues,
  getIssueById,
  getIssueStats,
  deleteIssue,
} from '../controllers/issueController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Stats route (must come before /:id)
router.get('/stats/dashboard', getIssueStats);

// Main routes
router.route('/')
  .get(getIssues)
  .post(issueBook);

router.route('/:id')
  .get(getIssueById)
  .delete(authorize('admin'), deleteIssue);

// Return book route
router.put('/:id/return', returnBook);

export default router;
