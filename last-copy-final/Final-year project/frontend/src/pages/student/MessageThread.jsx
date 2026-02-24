import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const MessageThread = () => {
    const { id: partnerId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [partnerInfo, setPartnerInfo] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        loadMessages();
        markRead();
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, [partnerId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadMessages = async () => {
        try {
            const res = await api.get(`/messages/${partnerId}`);
            const msgs = res.data.data || [];
            setMessages(msgs);
            if (msgs.length > 0) {
                const partner = msgs[0].senderId?._id === user?._id ? msgs[0].receiverId : msgs[0].senderId;
                setPartnerInfo(partner);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const markRead = async () => {
        try {
            await api.put(`/messages/${partnerId}/read`);
        } catch (error) {
            // ignore
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setSending(true);
        try {
            await api.post(`/messages/${partnerId}`, { content: newMessage.trim() });
            setNewMessage('');
            loadMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const getInitials = (email) => email ? email.substring(0, 2).toUpperCase() : '??';
    const roleBasePath = user?.role?.toLowerCase();

    if (loading) {
        return (
            <DashboardLayout role={user?.role} title="Messages">
                <LoadingSpinner size="lg" text="Loading conversation..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role={user?.role} title="Messages">
            {/* Header */}
            <div className="card mb-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(`/${roleBasePath}/messages`)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
                    {getInitials(partnerInfo?.email)}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{partnerInfo?.email || 'User'}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{partnerInfo?.role}</span>
                </div>
            </div>

            {/* Messages */}
            <div className="card mb-4" style={{ height: '60vh', overflowY: 'auto' }}>
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <div className="text-center">
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p>No messages yet. Say hello!</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 p-2">
                        {messages.map((msg) => {
                            const isMine = msg.senderId?._id === user?._id;
                            return (
                                <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                    {!isMine && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
                                            {getInitials(msg.senderId?.email)}
                                        </div>
                                    )}
                                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${isMine
                                        ? 'bg-primary-600 text-white rounded-br-md'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                                        }`}>
                                        <p>{msg.content}</p>
                                        <p className={`text-xs mt-1 ${isMine ? 'text-primary-200' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="card flex items-center gap-4">
                <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="input-field flex-1"
                />
                <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="btn-primary px-6 disabled:opacity-50"
                >
                    {sending ? '...' : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    )}
                </button>
            </form>
        </DashboardLayout>
    );
};

export default MessageThread;
