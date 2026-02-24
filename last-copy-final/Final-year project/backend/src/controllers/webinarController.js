import Webinar from '../models/Webinar.js';
import { ROLES, WEBINAR_STATUS } from '../utils/constants.js';
import { createNotification, notifyRole } from './notificationController.js';

// @desc    Create a new webinar
// @route   POST /api/webinars
// @access  Private (Alumni)
export const createWebinar = async (req, res, next) => {
    try {
        const webinarData = {
            ...req.body,
            hostId: req.user._id,
            isApproved: false,
        };

        const webinar = await Webinar.create(webinarData);

        // Notify all students about new webinar
        notifyRole('Student', 'New Webinar Available! 📹', `"${webinar.title}" webinar has been submitted and is pending approval.`, 'webinar');

        res.status(201).json({
            success: true,
            message: 'Webinar created successfully. Pending approval.',
            data: webinar,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all webinars
// @route   GET /api/webinars
// @access  Private
export const getWebinars = async (req, res, next) => {
    try {
        const { status, isApproved, upcoming, page = 1, limit = 20 } = req.query;

        const query = {};

        // Only show approved webinars to non-admins/coordinators
        if (req.user.role !== ROLES.ADMIN && req.user.role !== ROLES.COORDINATOR) {
            query.isApproved = true;
        } else if (isApproved !== undefined) {
            query.isApproved = isApproved === 'true';
        }

        if (status) {
            query.status = status;
        }

        if (upcoming === 'true') {
            query.dateTime = { $gte: new Date() };
            query.status = { $in: [WEBINAR_STATUS.SCHEDULED, WEBINAR_STATUS.LIVE] };
        }

        if (req.query.myRegistrations === 'true') {
            query['registrations.userId'] = req.user._id;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Webinar.countDocuments(query);

        const webinars = await Webinar.find(query)
            .populate('hostId', 'email')
            .populate({
                path: 'hostId',
                populate: {
                    path: 'userId',
                    model: 'AlumniProfile',
                    select: 'name currentRole organization',
                },
            })
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ dateTime: 1 });

        res.json({
            success: true,
            data: {
                webinars,
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

// @desc    Get webinar by ID
// @route   GET /api/webinars/:id
// @access  Private
export const getWebinarById = async (req, res, next) => {
    try {
        const webinar = await Webinar.findById(req.params.id)
            .populate('hostId', 'email')
            .populate('approvedBy', 'email');

        if (!webinar) {
            return res.status(404).json({
                success: false,
                message: 'Webinar not found',
            });
        }

        res.json({
            success: true,
            data: webinar,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Register for webinar
// @route   POST /api/webinars/:id/register
// @access  Private
export const registerForWebinar = async (req, res, next) => {
    try {
        const webinar = await Webinar.findById(req.params.id);

        if (!webinar) {
            return res.status(404).json({
                success: false,
                message: 'Webinar not found',
            });
        }

        if (!webinar.isApproved) {
            return res.status(400).json({
                success: false,
                message: 'Webinar is not approved yet',
            });
        }

        // Check if already registered
        const alreadyRegistered = webinar.registrations.some(
            (reg) => reg.userId.toString() === req.user._id.toString()
        );

        if (alreadyRegistered) {
            return res.status(400).json({
                success: false,
                message: 'You are already registered for this webinar',
            });
        }

        // Check capacity
        if (webinar.registrations.length >= webinar.maxParticipants) {
            return res.status(400).json({
                success: false,
                message: 'Webinar is full',
            });
        }

        webinar.registrations.push({ userId: req.user._id });
        await webinar.save();

        res.json({
            success: true,
            message: 'Successfully registered for webinar',
            data: webinar,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark attendance
// @route   PUT /api/webinars/:id/attendance
// @access  Private (Host, Admin, Coordinator)
export const markAttendance = async (req, res, next) => {
    try {
        const { attendees } = req.body; // Array of user IDs
        const webinar = await Webinar.findById(req.params.id);

        if (!webinar) {
            return res.status(404).json({
                success: false,
                message: 'Webinar not found',
            });
        }

        // Check authorization
        if (req.user.role !== ROLES.ADMIN &&
            req.user.role !== ROLES.COORDINATOR &&
            req.user._id.toString() !== webinar.hostId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only host, admin, or coordinator can mark attendance',
            });
        }

        // Mark attendance
        attendees.forEach((userId) => {
            const registration = webinar.registrations.find(
                (reg) => reg.userId.toString() === userId
            );
            if (registration) {
                registration.attended = true;
            }
        });

        await webinar.save();

        res.json({
            success: true,
            message: 'Attendance marked successfully',
            data: webinar,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit feedback for webinar
// @route   PUT /api/webinars/:id/feedback
// @access  Private
export const submitFeedback = async (req, res, next) => {
    try {
        const { rating, feedback } = req.body;
        const webinar = await Webinar.findById(req.params.id);

        if (!webinar) {
            return res.status(404).json({
                success: false,
                message: 'Webinar not found',
            });
        }

        // Find user's registration
        const registration = webinar.registrations.find(
            (reg) => reg.userId.toString() === req.user._id.toString()
        );

        if (!registration) {
            return res.status(400).json({
                success: false,
                message: 'You are not registered for this webinar',
            });
        }

        registration.rating = rating;
        registration.feedback = feedback;
        await webinar.save();

        res.json({
            success: true,
            message: 'Feedback submitted successfully',
            data: webinar,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve webinar
// @route   PUT /api/webinars/:id/approve
// @access  Private (Admin, Coordinator)
export const approveWebinar = async (req, res, next) => {
    try {
        const webinar = await Webinar.findById(req.params.id);

        if (!webinar) {
            return res.status(404).json({
                success: false,
                message: 'Webinar not found',
            });
        }

        webinar.isApproved = true;
        webinar.approvedBy = req.user._id;
        await webinar.save();

        // Notify the host that their webinar was approved
        await createNotification(
            webinar.hostId,
            'Webinar Approved! ✅',
            `Your webinar "${webinar.title}" has been approved and is now live.`,
            'webinar'
        );

        // Notify all students about the approved webinar
        notifyRole('Student', 'New Webinar Live! 📹', `"${webinar.title}" webinar is now live. Register now!`, 'webinar');

        res.json({
            success: true,
            message: 'Webinar approved successfully',
            data: webinar,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add resources to webinar
// @route   POST /api/webinars/:id/resources
// @access  Private (Host, Admin)
export const addResources = async (req, res, next) => {
    try {
        const { resources } = req.body; // Array of resources
        const webinar = await Webinar.findById(req.params.id);

        if (!webinar) {
            return res.status(404).json({
                success: false,
                message: 'Webinar not found',
            });
        }

        // Check authorization
        if (req.user.role !== ROLES.ADMIN &&
            req.user._id.toString() !== webinar.hostId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only host or admin can add resources',
            });
        }

        webinar.resources.push(...resources);
        await webinar.save();

        res.json({
            success: true,
            message: 'Resources added successfully',
            data: webinar,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reject webinar
// @route   PUT /api/webinars/:id/reject
// @access  Private (Admin, Coordinator)
export const rejectWebinar = async (req, res, next) => {
    try {
        const webinar = await Webinar.findByIdAndDelete(req.params.id);

        if (!webinar) {
            return res.status(404).json({
                success: false,
                message: 'Webinar not found',
            });
        }

        res.json({
            success: true,
            message: 'Webinar rejected and removed',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete webinar
// @route   DELETE /api/webinars/:id
// @access  Private (Admin)
export const deleteWebinar = async (req, res, next) => {
    try {
        const webinar = await Webinar.findByIdAndDelete(req.params.id);

        if (!webinar) {
            return res.status(404).json({
                success: false,
                message: 'Webinar not found',
            });
        }

        res.json({
            success: true,
            message: 'Webinar deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
