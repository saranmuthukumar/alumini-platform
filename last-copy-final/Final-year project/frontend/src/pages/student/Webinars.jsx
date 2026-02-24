import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';
import { useNotifications } from '../../context/NotificationContext';

const Webinars = () => {
    const { addNotification } = useNotifications();
    const [webinars, setWebinars] = useState([]);
    const [filter, setFilter] = useState('upcoming');
    const [loading, setLoading] = useState(true);
    const [selectedWebinar, setSelectedWebinar] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [registeredIds, setRegisteredIds] = useState(new Set());

    useEffect(() => {
        loadWebinars();
    }, []);

    const loadWebinars = async () => {
        try {
            const res = await api.get('/webinars');
            const webinarsData = res.data.data?.webinars || [];
            setWebinars(webinarsData);
        } catch (error) {
            console.error('Error loading webinars:', error);
            setWebinars([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredWebinars = webinars.filter(w => {
        const webinarDate = new Date(w.dateTime);
        const now = new Date();
        if (filter === 'upcoming') return webinarDate >= now;
        if (filter === 'past') return webinarDate < now;
        return true;
    });

    const handleRegister = (webinar) => {
        setSelectedWebinar(webinar);
        setIsModalOpen(true);
    };

    const confirmRegistration = async () => {
        setRegistering(true);
        try {
            await api.post(`/webinars/${selectedWebinar._id}/register`);
            setRegisteredIds(prev => new Set([...prev, selectedWebinar._id]));
            addNotification({
                title: 'Registration Successful!',
                message: `You're registered for "${selectedWebinar.title}"`,
                type: 'success',
            });
            setIsModalOpen(false);
            setSelectedWebinar(null);
            loadWebinars();
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

    if (loading) {
        return (
            <DashboardLayout role="Student" title="Webinars">
                <LoadingSpinner size="lg" text="Loading webinars..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="Student" title="Webinars">
            <div className="mb-8 animate-slide-down">
                <div className="flex flex-wrap gap-3">
                    {['upcoming', 'past', 'all'].map((filterOption) => (
                        <button
                            key={filterOption}
                            onClick={() => setFilter(filterOption)}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${filter === filterOption
                                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg scale-105'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {filteredWebinars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWebinars.map((webinar, index) => {
                        const isRegistered = registeredIds.has(webinar._id);
                        const isFull = webinar.registrations?.length >= webinar.maxParticipants;
                        return (
                            <motion.div
                                key={webinar._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="card-hover group"
                            >
                                <div className="mb-4">
                                    <span className="badge-blue">{webinar.topic}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {webinar.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                    {webinar.description}
                                </p>
                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="font-medium">
                                            {new Date(webinar.dateTime).toLocaleDateString('en-US', {
                                                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-medium">{webinar.duration} minutes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="font-medium">{webinar.registrations?.length || 0} registered</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => !isRegistered && !isFull && handleRegister(webinar)}
                                    disabled={isRegistered || isFull}
                                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isRegistered ? '✓ Registered' : isFull ? 'Full' : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Register Now
                                        </>
                                    )}
                                </button>
                                {webinar.meetingLink && (
                                    <a
                                        href={webinar.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Join Webinar
                                    </a>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    }
                    title={`No ${filter} webinars found`}
                    description="Check back later for new webinar opportunities from our alumni community."
                />
            )}

            {/* Registration Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => !registering && setIsModalOpen(false)}
                title="Confirm Registration"
                size="md"
            >
                {selectedWebinar && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{selectedWebinar.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{selectedWebinar.description}</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium">
                                        {new Date(selectedWebinar.dateTime).toLocaleDateString('en-US', {
                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-medium">Duration: {selectedWebinar.duration} minutes</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={confirmRegistration}
                                disabled={registering}
                                className="flex-1 btn-primary disabled:opacity-50"
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
                            <button onClick={() => setIsModalOpen(false)} disabled={registering} className="flex-1 btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
};

export default Webinars;
