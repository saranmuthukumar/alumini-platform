import express from 'express';
import {
    createEvent,
    getEvents,
    getEventById,
    registerForEvent,
    markEventAttendance,
    updateEvent,
    deleteEvent,
} from '../controllers/eventController.js';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.js';
import { isAdminOrCoordinator, isAdmin } from '../middlewares/rbac.js';

const router = express.Router();

// Public routes (anyone can view events)
router.get('/', optionalAuthenticate, getEvents);
router.get('/:id', optionalAuthenticate, getEventById);

// Protected routes
router.post('/', authenticate, isAdminOrCoordinator, createEvent);
router.post('/:id/register', authenticate, registerForEvent);
router.put('/:id/attendance', authenticate, isAdminOrCoordinator, markEventAttendance);
router.put('/:id', authenticate, isAdminOrCoordinator, updateEvent);
router.delete('/:id', authenticate, isAdmin, deleteEvent);

export default router;
