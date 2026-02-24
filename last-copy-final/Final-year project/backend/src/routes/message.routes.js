import express from 'express';
import {
    getConversations,
    getMessages,
    sendMessage,
    markAsRead,
    getMessageableUsers,
} from '../controllers/messageController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

// Get users available to message
router.get('/users', getMessageableUsers);

// Get all conversations
router.get('/', getConversations);

// Get messages with a specific user
router.get('/:userId', getMessages);

// Send a message to a user
router.post('/:userId', sendMessage);

// Mark messages from a user as read
router.put('/:userId/read', markAsRead);

export default router;
