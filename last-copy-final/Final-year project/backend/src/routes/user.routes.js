import express from 'express';
import { getAllUsers, toggleUserStatus, deleteUser } from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/rbac.js';

const router = express.Router();

// All routes require authentication + Admin role
router.use(authenticate);
router.use(isAdmin);

// Get all users
router.get('/', getAllUsers);

// Toggle user active status
router.put('/:id/toggle-status', toggleUserStatus);

// Delete user
router.delete('/:id', deleteUser);

export default router;
