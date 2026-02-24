import express from 'express';
import { getPendingStudents, approveStudent, rejectStudent, updateStudentProfile } from '../controllers/studentController.js';
import { authenticate } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/rbac.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Student update own profile (must come before :id routes)
router.put('/profile', updateStudentProfile);

// Admin-only routes
router.get('/pending', isAdmin, getPendingStudents);
router.put('/:id/approve', isAdmin, approveStudent);
router.put('/:id/reject', isAdmin, rejectStudent);

export default router;
