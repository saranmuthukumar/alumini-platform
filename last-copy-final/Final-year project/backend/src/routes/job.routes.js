import express from 'express';
import {
    createJob,
    getJobs,
    getJobById,
    applyForJob,
    updateApplicationStatus,
    approveJob,
    rejectJob,
    deleteJob,
    getMyApplications,
} from '../controllers/jobController.js';
import { authenticate } from '../middlewares/auth.js';
import { isAlumni, isStudent, isAdmin } from '../middlewares/rbac.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all jobs
router.get('/', getJobs);

// Create job (Alumni or Admin)
router.post('/', createJob);

// Get student's applications
router.get('/my-applications', isStudent, getMyApplications);

// Get job by ID
router.get('/:id', getJobById);

// Apply for job (Student only)
router.post('/:id/apply', isStudent, applyForJob);

// Update application status
router.put('/:jobId/applications/:appId', updateApplicationStatus);

// Approve job (Admin only)
router.put('/:id/approve', isAdmin, approveJob);

// Reject job (Admin only)
router.put('/:id/reject', isAdmin, rejectJob);

// Delete job (Admin only)
router.delete('/:id', isAdmin, deleteJob);

export default router;
