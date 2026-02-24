import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';
import { useNotifications } from '../../context/NotificationContext';

const Events = () => {
    const { addNotification } = useNotifications();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [filter, setFilter] = useState('upcoming');
    const [registeredIds, setRegisteredIds] = useState(new Set());

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const res = await api.get('/events');
            const eventsData = res.data.data?.events || [];
            setEvents(eventsData);
        } catch (error) {
            console.error('Error loading events:', error);
            // Fallback sample events if API returns empty
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.dateTime || event.date);
        const now = new Date();
        if (filter === 'upcoming') return eventDate >= now;
        if (filter === 'past') return eventDate < now;
        return true;
    });

    const handleRegister = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const confirmRegistration = async () => {
        setRegistering(true);
        try {
            await api.post(`/events/${selectedEvent._id}/register`);
            setRegisteredIds(prev => new Set([...prev, selectedEvent._id]));
            addNotification({
                title: 'Registration Successful!',
                message: `You're registered for "${selectedEvent.title}"`,
                type: 'success',
            });
            setIsModalOpen(false);
            setSelectedEvent(null);
            loadEvents();
        } catch (error) {
            addNotification({
                title: 'Registration Failed',
                message: error.response?.data?.message || 'Please try again later',
                type: 'error',
            });
        } finally {
            setRegistering(false);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Networking': 'blue',
            'Workshop': 'purple',
            'Career': 'green',
            'Cultural': 'orange',
            'Sports': 'red',
            'Academic': 'indigo',
            'Alumni Meet': 'blue',
            'Technical Workshop': 'purple',
            'Seminar': 'indigo',
            'Career Fair': 'green',
            'Career Talk': 'green',
        };
        return colors[category] || 'gray';
    };

    if (loading) {
        return (
            <DashboardLayout role="Student" title="Events">
                <LoadingSpinner size="lg" text="Loading events..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="Student" title="Events">
            {/* Filter Buttons */}
            <div className="mb-8 animate-slide-down">
                <div className="flex flex-wrap gap-3">
                    {['upcoming', 'past', 'all'].map((filterOption) => (
                        <button
                            key={filterOption}
                            onClick={() => setFilter(filterOption)}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${filter === filterOption
                                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md transform hover:-translate-y-0.5 border border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event, index) => {
                        const isRegistered = registeredIds.has(event._id) ||
                            event.registrations?.some(r => r.userId === event._currentUserId);
                        const isFull = event.registrations?.length >= event.maxParticipants;
                        return (
                            <motion.div
                                key={event._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="card-hover group"
                            >
                                {/* Category Badge */}
                                <div className="mb-4">
                                    <span className={`badge-${getCategoryColor(event.category)}`}>
                                        {event.category}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {event.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                    {event.description}
                                </p>
                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="font-medium">
                                            {new Date(event.dateTime || event.date).toLocaleDateString('en-US', {
                                                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        <span className="font-medium">{event.venue || event.location || 'TBA'}</span>
                                    </div>
                                </div>
                                {/* Capacity Bar */}
                                {event.maxParticipants && (
                                    <div className="mb-4">
                                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                            <span>Registrations</span>
                                            <span>{event.registrations?.length || 0}/{event.maxParticipants}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.min(((event.registrations?.length || 0) / event.maxParticipants) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={() => !isRegistered && !isFull && handleRegister(event)}
                                    disabled={isRegistered || isFull}
                                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isRegistered ? '✓ Registered' : isFull ? 'Event Full' : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Register for Event
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    }
                    title={`No ${filter} events found`}
                    description="Check back later for upcoming campus events."
                />
            )}

            {/* Registration Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => !registering && setIsModalOpen(false)}
                title="Confirm Event Registration"
                size="md"
            >
                {selectedEvent && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                                {selectedEvent.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{selectedEvent.description}</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium">
                                        {new Date(selectedEvent.dateTime || selectedEvent.date).toLocaleDateString('en-US', {
                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    <span className="font-medium">{selectedEvent.venue || selectedEvent.location || 'TBA'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={confirmRegistration}
                                disabled={registering}
                                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {registering ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Registering...
                                    </span>
                                ) : 'Confirm Registration'}
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                disabled={registering}
                                className="flex-1 btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
};

export default Events;
