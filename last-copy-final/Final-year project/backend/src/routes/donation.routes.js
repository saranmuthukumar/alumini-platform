import express from 'express';
import {
    createDonation,
    getAllDonations,
    getMyDonations,
    getDonationStats,
} from '../controllers/donationController.js';
import { authenticate } from '../middlewares/auth.js';
import { isAlumni, isAdmin } from '../middlewares/rbac.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create donation (Alumni only)
router.post('/', isAlumni, createDonation);

// Get my donations (Alumni only)
router.get('/my-donations', isAlumni, getMyDonations);

// Get donation statistics (Admin only)
router.get('/stats', isAdmin, getDonationStats);

// Get all donations (Admin only)
router.get('/', isAdmin, getAllDonations);

export default router;
