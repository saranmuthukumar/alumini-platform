import express from 'express';
import {
    createWebinar,
    getWebinars,
    getWebinarById,
    registerForWebinar,
    markAttendance,
    submitFeedback,
    approveWebinar,
    rejectWebinar,
    deleteWebinar,
    addResources,
} from '../controllers/webinarController.js';
import { authenticate } from '../middlewares/auth.js';
import { isAlumni, isAdmin, isAdminOrCoordinator } from '../middlewares/rbac.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all webinars
router.get('/', getWebinars);

// Create webinar (Alumni only)
router.post('/', isAlumni, createWebinar);

// Get webinar by ID
router.get('/:id', getWebinarById);

// Register for webinar
router.post('/:id/register', registerForWebinar);

// Submit feedback
router.put('/:id/feedback', submitFeedback);

// Mark attendance
router.put('/:id/attendance', markAttendance);

// Add resources
router.post('/:id/resources', addResources);

// Approve webinar (Admin/Coordinator only)
router.put('/:id/approve', isAdminOrCoordinator, approveWebinar);

// Reject webinar (Admin/Coordinator only)
router.put('/:id/reject', isAdminOrCoordinator, rejectWebinar);

// Delete webinar (Admin only)
router.delete('/:id', isAdmin, deleteWebinar);

export default router;
