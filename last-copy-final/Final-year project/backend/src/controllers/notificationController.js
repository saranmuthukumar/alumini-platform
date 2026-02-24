import Notification from '../models/Notification.js';
import User from '../models/User.js';

// Helper: create a notification for a specific user
export const createNotification = async (userId, title, message, type = 'system') => {
    try {
        await Notification.create({ userId, title, message, type });
    } catch (error) {
        console.error('Failed to create notification:', error);
    }
};

// Helper: create notifications for all users of a specific role
export const notifyRole = async (role, title, message, type = 'system') => {
    try {
        const users = await User.find({ role, isActive: true }).select('_id');
        const notifications = users.map(u => ({
            userId: u._id,
            title,
            message,
            type,
        }));
        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }
    } catch (error) {
        console.error('Failed to create role notifications:', error);
    }
};

// @desc    Get current user's notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            userId: req.user._id,
            read: false,
        });

        res.json({
            success: true,
            data: { notifications, unreadCount },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
    try {
        await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { read: true }
        );
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { userId: req.user._id, read: false },
            { read: true }
        );
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};
