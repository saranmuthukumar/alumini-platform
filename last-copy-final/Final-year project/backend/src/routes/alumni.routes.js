import express from 'express';
import {
    getAlumniDirectory,
    getAlumniById,
    updateAlumniProfile,
    approveAlumni,
    rejectAlumni,
    getPendingAlumni,
} from '../controllers/alumniController.js';
import { authenticate } from '../middlewares/auth.js';
import { isAdmin, isAlumni } from '../middlewares/rbac.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get alumni directory
router.get('/', getAlumniDirectory);

// Get pending approvals (Admin only)
router.get('/pending', isAdmin, getPendingAlumni);

// Get specific alumni profile
router.get('/:id', getAlumniById);

// Update alumni profile
router.put('/:id', updateAlumniProfile);

// Approve alumni (Admin only)
router.put('/:id/approve', isAdmin, approveAlumni);

// Reject alumni (Admin only)
router.put('/:id/reject', isAdmin, rejectAlumni);

export default router;
