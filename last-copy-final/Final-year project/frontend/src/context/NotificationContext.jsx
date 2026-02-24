import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const prevUnreadRef = useRef(0);
    const audioRef = useRef(null);

    // Create audio for notification sound
    useEffect(() => {
        // Use a short beep sound generated via AudioContext as fallback
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            audioRef.current = audioCtx;
        } catch (e) {
            console.warn('AudioContext not supported');
        }
    }, []);

    const playNotificationSound = useCallback(() => {
        try {
            const audioCtx = audioRef.current;
            if (!audioCtx) return;

            // Resume if suspended (browser policy)
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            // Create a pleasant notification chime
            const now = audioCtx.currentTime;

            // First tone
            const osc1 = audioCtx.createOscillator();
            const gain1 = audioCtx.createGain();
            osc1.connect(gain1);
            gain1.connect(audioCtx.destination);
            osc1.frequency.value = 587.33; // D5
            osc1.type = 'sine';
            gain1.gain.setValueAtTime(0.3, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc1.start(now);
            osc1.stop(now + 0.3);

            // Second tone (higher)
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.frequency.value = 880; // A5
            osc2.type = 'sine';
            gain2.gain.setValueAtTime(0.3, now + 0.15);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
            osc2.start(now + 0.15);
            osc2.stop(now + 0.45);
        } catch (e) {
            // Silently fail if audio context not available
        }
    }, []);

    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const res = await api.get('/notifications');
            if (res.data.success) {
                const newUnread = res.data.data.unreadCount;
                const newNotifications = res.data.data.notifications;

                // Play sound if new unread notifications appeared
                if (newUnread > prevUnreadRef.current && prevUnreadRef.current >= 0) {
                    playNotificationSound();
                }
                prevUnreadRef.current = newUnread;

                setNotifications(newNotifications);
                setUnreadCount(newUnread);
            }
        } catch (error) {
            // Silently fail - don't interrupt user experience
        }
    }, [isAuthenticated, playNotificationSound]);

    // Poll for notifications every 30 seconds
    useEffect(() => {
        if (!isAuthenticated) {
            setNotifications([]);
            setUnreadCount(0);
            prevUnreadRef.current = -1; // Reset
            return;
        }

        // Initial fetch — set prevUnreadRef to -1 to skip sound on first load
        prevUnreadRef.current = -1;
        const initialFetch = async () => {
            try {
                const res = await api.get('/notifications');
                if (res.data.success) {
                    prevUnreadRef.current = res.data.data.unreadCount;
                    setNotifications(res.data.data.notifications);
                    setUnreadCount(res.data.data.unreadCount);
                }
            } catch (e) { /* ignore */ }
        };
        initialFetch();

        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [isAuthenticated, fetchNotifications]);

    const addNotification = (notification) => {
        const newNotification = {
            _id: Date.now().toString(),
            timestamp: new Date(),
            read: false,
            ...notification,
        };
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        playNotificationSound();
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => (n._id === id ? { ...n, read: true } : n))
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            addNotification,
            markAsRead,
            markAllAsRead,
            clearNotifications,
            unreadCount,
            refreshNotifications: fetchNotifications,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
