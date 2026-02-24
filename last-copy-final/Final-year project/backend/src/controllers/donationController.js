import Donation from '../models/Donation.js';
import { ROLES } from '../utils/constants.js';
import { notifyRole } from './notificationController.js';

// @desc    Create donation
// @route   POST /api/donations
// @access  Private (Alumni)
export const createDonation = async (req, res, next) => {
    try {
        const donationData = {
            ...req.body,
            donorId: req.user._id,
            // Auto-generate transactionId if not provided
            transactionId: req.body.transactionId || `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            // Default category to 'Other' if not provided
            category: req.body.category || 'Other',
        };

        const donation = await Donation.create(donationData);

        // Notify admins about new donation
        const donorLabel = req.body.isAnonymous ? 'Anonymous donor' : req.user.email;
        notifyRole('Admin', 'New Donation Received! 💰',
            `${donorLabel} donated ₹${donation.amount.toLocaleString()}. ${req.body.message || ''}`.trim(),
            'donation'
        );

        res.status(201).json({
            success: true,
            message: 'Donation recorded successfully',
            data: donation,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all donations (Admin)
// @route   GET /api/donations
// @access  Private (Admin)
export const getAllDonations = async (req, res, next) => {
    try {
        const { category, page = 1, limit = 20 } = req.query;

        const query = {};

        if (category) {
            query.category = category;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Donation.countDocuments(query);

        const donations = await Donation.find(query)
            .populate('donorId', 'email')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                donations,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    limit: parseInt(limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my donations
// @route   GET /api/donations/my-donations
// @access  Private (Alumni)
export const getMyDonations = async (req, res, next) => {
    try {
        const donations = await Donation.find({ donorId: req.user._id })
            .sort({ createdAt: -1 });

        const totalDonated = donations.reduce((sum, don) => sum + don.amount, 0);

        res.json({
            success: true,
            data: {
                donations,
                totalDonated,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get donation statistics (Admin)
// @route   GET /api/donations/stats
// @access  Private (Admin)
export const getDonationStats = async (req, res, next) => {
    try {
        const totalDonations = await Donation.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
        ]);

        const byCategory = await Donation.aggregate([
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
        ]);

        const topDonors = await Donation.aggregate([
            {
                $match: { isAnonymous: false },
            },
            {
                $group: {
                    _id: '$donorId',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { total: -1 },
            },
            {
                $limit: 10,
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'donor',
                },
            },
        ]);

        res.json({
            success: true,
            data: {
                total: totalDonations[0] || { total: 0, count: 0 },
                byCategory,
                topDonors,
            },
        });
    } catch (error) {
        next(error);
    }
};
