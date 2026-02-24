import AlumniProfile from '../models/AlumniProfile.js';
import User from '../models/User.js';
import { PRIVACY_LEVELS, ROLES } from '../utils/constants.js';
import { createNotification } from './notificationController.js';

// @desc    Get alumni directory with search and filters
// @route   GET /api/alumni
// @access  Private (Students, Alumni, Coordinators, Admins)
export const getAlumniDirectory = async (req, res, next) => {
    try {
        const {
            search,
            department,
            batch,
            skills,
            careerDomain,
            page = 1,
            limit = 20,
        } = req.query;

        // Build query
        const query = { isApproved: true };

        // Privacy filtering based on user role
        if (req.user.role === ROLES.STUDENT || req.user.role === ROLES.ALUMNI) {
            query.privacyLevel = { $in: [PRIVACY_LEVELS.PUBLIC, PRIVACY_LEVELS.STUDENTS_ALUMNI] };
        } else if (!req.user) {
            query.privacyLevel = PRIVACY_LEVELS.PUBLIC;
        }
        // Admin and Coordinator can see all

        // Text search
        if (search) {
            query.$text = { $search: search };
        }

        // Filters
        if (department) {
            query.department = department;
        }

        if (batch) {
            query.batch = batch;
        }

        if (skills) {
            const skillsArray = Array.isArray(skills) ? skills : [skills];
            query.skills = { $in: skillsArray };
        }

        if (careerDomain) {
            query.careerDomain = careerDomain;
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await AlumniProfile.countDocuments(query);

        // Execute query
        const alumni = await AlumniProfile.find(query)
            .populate('userId', 'email isVerified')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                alumni,
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

// @desc    Get alumni profile by ID
// @route   GET /api/alumni/:id
// @access  Private
export const getAlumniById = async (req, res, next) => {
    try {
        const alumni = await AlumniProfile.findById(req.params.id)
            .populate('userId', 'email isVerified');

        if (!alumni) {
            return res.status(404).json({
                success: false,
                message: 'Alumni profile not found',
            });
        }

        // Check privacy
        if (alumni.privacyLevel === PRIVACY_LEVELS.HIDDEN &&
            req.user.role !== ROLES.ADMIN &&
            req.user.role !== ROLES.COORDINATOR &&
            req.user._id.toString() !== alumni.userId._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'This profile is hidden',
            });
        }

        res.json({
            success: true,
            data: alumni,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update alumni profile
// @route   PUT /api/alumni/:id
// @access  Private (Alumni - own profile, Admin)
export const updateAlumniProfile = async (req, res, next) => {
    try {
        const alumni = await AlumniProfile.findById(req.params.id);

        if (!alumni) {
            return res.status(404).json({
                success: false,
                message: 'Alumni profile not found',
            });
        }

        // Check ownership
        if (req.user.role !== ROLES.ADMIN &&
            req.user._id.toString() !== alumni.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own profile',
            });
        }

        // Update fields
        const allowedFields = ['name', 'batch', 'department', 'currentRole', 'organization',
            'skills', 'careerDomain', 'linkedin', 'portfolio', 'bio',
            'privacyLevel', 'profileImage', 'github'];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                alumni[field] = req.body[field];
            }
        });

        await alumni.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: alumni,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve alumni profile (Admin only)
// @route   PUT /api/alumni/:id/approve
// @access  Private (Admin)
export const approveAlumni = async (req, res, next) => {
    try {
        const alumni = await AlumniProfile.findById(req.params.id);

        if (!alumni) {
            return res.status(404).json({
                success: false,
                message: 'Alumni profile not found',
            });
        }

        alumni.isApproved = true;
        await alumni.save();

        // Update user verification
        await User.findByIdAndUpdate(alumni.userId, { isVerified: true });

        // Notify the alumni user
        await createNotification(
            alumni.userId,
            'Profile Approved! 🎉',
            'Your alumni profile has been approved. You now have full access to the platform.',
            'approval'
        );

        res.json({
            success: true,
            message: 'Alumni profile approved successfully',
            data: alumni,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get pending alumni approvals (Admin only)
// @route   GET /api/alumni/pending
// @access  Private (Admin)
export const getPendingAlumni = async (req, res, next) => {
    try {
        const pendingAlumni = await AlumniProfile.find({ isApproved: false })
            .populate('userId', 'email createdAt')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: pendingAlumni,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reject alumni profile (Admin only)
// @route   PUT /api/alumni/:id/reject
// @access  Private (Admin)
export const rejectAlumni = async (req, res, next) => {
    try {
        const alumni = await AlumniProfile.findByIdAndDelete(req.params.id);

        if (!alumni) {
            return res.status(404).json({
                success: false,
                message: 'Alumni profile not found',
            });
        }

        res.json({
            success: true,
            message: 'Alumni profile rejected and removed',
        });
    } catch (error) {
        next(error);
    }
};
