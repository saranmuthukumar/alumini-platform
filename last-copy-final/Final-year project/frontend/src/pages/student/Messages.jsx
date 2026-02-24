import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Messages = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
    const [messageableUsers, setMessageableUsers] = useState([]);
    const [selectedNewUser, setSelectedNewUser] = useState('');
    const [newMessageContent, setNewMessageContent] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        loadConversations();
        const interval = setInterval(loadConversations, 10000);
        return () => clearInterval(interval);
    }, []);

    const loadConversations = async () => {
        try {
            const res = await api.get('/messages');
            setConversations(res.data.data || []);
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMessageableUsers = async () => {
        try {
            const res = await api.get('/messages/users');
            setMessageableUsers(res.data.data || []);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const openNewMessage = () => {
        setIsNewMessageOpen(true);
        loadMessageableUsers();
    };

    const sendNewMessage = async () => {
        if (!selectedNewUser || !newMessageContent.trim()) return;
        setSending(true);
        try {
            await api.post(`/messages/${selectedNewUser}`, { content: newMessageContent });
            setIsNewMessageOpen(false);
            setSelectedNewUser('');
            setNewMessageContent('');
            navigate(`/${user?.role?.toLowerCase()}/messages/${selectedNewUser}`);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const filteredConversations = conversations.filter((conv) =>
        conv.partner?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTimeSince = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return new Date(date).toLocaleDateString();
    };

    const getInitials = (email) => {
        return email ? email.substring(0, 2).toUpperCase() : '??';
    };

    const getRoleColor = (role) => {
        const colors = { 'alumni': 'blue', 'student': 'green', 'admin': 'red', 'coordinator': 'purple' };
        return colors[role?.toLowerCase()] || 'gray';
    };

    const roleBasePath = user?.role?.toLowerCase();

    if (loading) {
        return (
            <DashboardLayout role={user?.role} title="Messages">
                <LoadingSpinner size="lg" text="Loading messages..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role={user?.role} title="Messages">
            <div className="mb-6 card">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-10"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <button onClick={openNewMessage} className="btn-primary flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Message
                    </button>
                </div>
            </div>

            {filteredConversations.length > 0 ? (
                <div className="space-y-3">
                    {filteredConversations.map((conversation, index) => (
                        <Link
                            key={conversation.partnerId}
                            to={`/${roleBasePath}/messages/${conversation.partnerId}`}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className={`card-hover flex items-start gap-4 p-4 ${conversation.unreadCount > 0 ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : ''}`}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                        {getInitials(conversation.partner?.email)}
                                    </div>
                                    {conversation.unreadCount > 0 && (
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                            {conversation.unreadCount}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-1">
                                        <div>
                                            <h3 className={`font-semibold text-gray-900 dark:text-white ${conversation.unreadCount > 0 ? 'text-primary-700 dark:text-primary-400' : ''}`}>
                                                {conversation.partner?.email}
                                            </h3>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-${getRoleColor(conversation.partner?.role)}-100 text-${getRoleColor(conversation.partner?.role)}-700 dark:bg-${getRoleColor(conversation.partner?.role)}-900/30 dark:text-${getRoleColor(conversation.partner?.role)}-300`}>
                                                {conversation.partner?.role}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                            {getTimeSince(conversation.lastMessage?.createdAt)}
                                        </span>
                                    </div>
                                    <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {conversation.lastMessage?.senderId?._id === user?._id && (
                                            <span className="text-primary-600 dark:text-primary-400 mr-1">You:</span>
                                        )}
                                        {conversation.lastMessage?.content}
                                    </p>
                                </div>
                                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    }
                    title="No conversations yet"
                    description="Start a conversation by clicking 'New Message'"
                    actionText="New Message"
                    onAction={openNewMessage}
                />
            )}

            {/* New Message Modal */}
            <Modal isOpen={isNewMessageOpen} onClose={() => setIsNewMessageOpen(false)} title="New Message" size="md">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Recipient</label>
                        <select
                            value={selectedNewUser}
                            onChange={e => setSelectedNewUser(e.target.value)}
                            className="input-field"
                        >
                            <option value="">-- Select a user --</option>
                            {messageableUsers.map(u => (
                                <option key={u._id} value={u._id}>{u.email} ({u.role})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                        <textarea
                            value={newMessageContent}
                            onChange={e => setNewMessageContent(e.target.value)}
                            rows={4}
                            className="input-field"
                            placeholder="Type your message..."
                        />
                    </div>
                    <div className="flex gap-3">
                        <button onClick={sendNewMessage} disabled={sending || !selectedNewUser || !newMessageContent.trim()} className="flex-1 btn-primary disabled:opacity-50">
                            {sending ? 'Sending...' : 'Send Message'}
                        </button>
                        <button onClick={() => setIsNewMessageOpen(false)} className="flex-1 btn-secondary">Cancel</button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
};

export default Messages;
