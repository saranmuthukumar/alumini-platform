import Message from '../models/Message.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// @desc    Get all conversations for current user
// @route   GET /api/messages
// @access  Private
export const getConversations = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Find all messages involving the current user
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
        })
            .populate('senderId', 'email role')
            .populate('receiverId', 'email role')
            .sort({ createdAt: -1 });

        // Group by conversation partner
        const conversationsMap = new Map();

        for (const msg of messages) {
            const partnerId =
                msg.senderId._id.toString() === userId.toString()
                    ? msg.receiverId._id.toString()
                    : msg.senderId._id.toString();

            if (!conversationsMap.has(partnerId)) {
                const partner =
                    msg.senderId._id.toString() === userId.toString()
                        ? msg.receiverId
                        : msg.senderId;

                conversationsMap.set(partnerId, {
                    partnerId,
                    partner,
                    lastMessage: msg,
                    unreadCount: 0,
                });
            }

            // Count unread messages from partner
            if (
                msg.receiverId._id.toString() === userId.toString() &&
                !msg.isRead
            ) {
                const conv = conversationsMap.get(partnerId);
                conv.unreadCount += 1;
            }
        }

        const conversations = Array.from(conversationsMap.values());

        res.json({
            success: true,
            data: conversations,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get messages between current user and another user
// @route   GET /api/messages/:userId
// @access  Private
export const getMessages = async (req, res, next) => {
    try {
        const currentUserId = req.user._id;
        const partnerId = req.params.userId;

        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: partnerId },
                { senderId: partnerId, receiverId: currentUserId },
            ],
        })
            .populate('senderId', 'email role')
            .populate('receiverId', 'email role')
            .sort({ createdAt: 1 });

        res.json({
            success: true,
            data: messages,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Send a message to another user
// @route   POST /api/messages/:userId
// @access  Private
export const sendMessage = async (req, res, next) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.userId;
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message content is required',
            });
        }

        // Verify receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: 'Recipient not found',
            });
        }

        const message = await Message.create({
            senderId,
            receiverId,
            content: content.trim(),
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('senderId', 'email role')
            .populate('receiverId', 'email role');

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: populatedMessage,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark all messages from a user as read
// @route   PUT /api/messages/:userId/read
// @access  Private
export const markAsRead = async (req, res, next) => {
    try {
        const currentUserId = req.user._id;
        const partnerId = req.params.userId;

        await Message.updateMany(
            { senderId: partnerId, receiverId: currentUserId, isRead: false },
            { isRead: true }
        );

        res.json({
            success: true,
            message: 'Messages marked as read',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get list of users to message (alumni + coordinators for students; students for alumni)
// @route   GET /api/messages/users
// @access  Private
export const getMessageableUsers = async (req, res, next) => {
    try {
        // Return all users except the current user
        const users = await User.find({ _id: { $ne: req.user._id } }).select(
            'email role'
        );

        res.json({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};
