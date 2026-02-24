import Event from '../models/Event.js';
import { ROLES } from '../utils/constants.js';

// @desc    Create event
// @route   POST /api/events
// @access  Private (Admin, Coordinator)
export const createEvent = async (req, res, next) => {
    try {
        const eventData = {
            ...req.body,
            createdBy: req.user._id,
        };

        const event = await Event.create(eventData);

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
    try {
        const { category, upcoming, page = 1, limit = 20 } = req.query;

        const query = { isActive: true };

        if (category) {
            query.category = category;
        }

        if (upcoming === 'true') {
            query.dateTime = { $gte: new Date() };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Event.countDocuments(query);

        const events = await Event.find(query)
            .populate('createdBy', 'email')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ dateTime: 1 });

        res.json({
            success: true,
            data: {
                events,
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

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'email');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        res.json({
            success: true,
            data: event,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
export const registerForEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        // Check if already registered
        const alreadyRegistered = event.registrations.some(
            (reg) => reg.userId.toString() === req.user._id.toString()
        );

        if (alreadyRegistered) {
            return res.status(400).json({
                success: false,
                message: 'You are already registered for this event',
            });
        }

        // Check capacity
        if (event.registrations.length >= event.maxParticipants) {
            return res.status(400).json({
                success: false,
                message: 'Event is full',
            });
        }

        event.registrations.push({ userId: req.user._id });
        await event.save();

        res.json({
            success: true,
            message: 'Successfully registered for event',
            data: event,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark attendance for event
// @route   PUT /api/events/:id/attendance
// @access  Private (Admin, Coordinator)
export const markEventAttendance = async (req, res, next) => {
    try {
        const { attendees } = req.body; // Array of user IDs
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        // Mark attendance
        attendees.forEach((userId) => {
            const registration = event.registrations.find(
                (reg) => reg.userId.toString() === userId
            );
            if (registration) {
                registration.attended = true;
            }
        });

        await event.save();

        res.json({
            success: true,
            message: 'Attendance marked successfully',
            data: event,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin, Coordinator)
export const updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        res.json({
            success: true,
            message: 'Event updated successfully',
            data: event,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin)
export const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        res.json({
            success: true,
            message: 'Event deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
