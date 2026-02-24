import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const HostWebinar = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        topic: '',
        description: '',
        dateTime: '',
        duration: 60,
        maxParticipants: 100,
        targetAudience: 'All',
        meetingLink: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/webinars', formData);
            toast.success('Webinar created successfully! Pending admin approval.');
            navigate('/alumni');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create webinar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="Alumni" title="Host a Webinar">
            <div className="max-w-3xl mx-auto">
                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Webinar Title *
                            </label>
                            <input
                                name="title"
                                type="text"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                placeholder="e.g., Career Guidance in Tech Industry"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Topic *
                            </label>
                            <input
                                name="topic"
                                type="text"
                                required
                                value={formData.topic}
                                onChange={handleChange}
                                className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                placeholder="e.g., Software Engineering, AI/ML, Career Development"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                placeholder="Describe what you'll cover in this webinar..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Date & Time *
                                </label>
                                <input
                                    name="dateTime"
                                    type="datetime-local"
                                    required
                                    value={formData.dateTime}
                                    onChange={handleChange}
                                    className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Duration (minutes) *
                                </label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                >
                                    <option value="30">30 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="90">1.5 hours</option>
                                    <option value="120">2 hours</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Max Participants
                                </label>
                                <input
                                    name="maxParticipants"
                                    type="number"
                                    value={formData.maxParticipants}
                                    onChange={handleChange}
                                    className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                    min="10"
                                    max="500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Target Audience
                                </label>
                                <select
                                    name="targetAudience"
                                    value={formData.targetAudience}
                                    onChange={handleChange}
                                    className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                >
                                    <option value="All">All Students</option>
                                    <option value="Final Year">Final Year Only</option>
                                    <option value="Specific Department">Specific Department</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Google Meet Link
                            </label>
                            <input
                                name="meetingLink"
                                type="url"
                                value={formData.meetingLink}
                                onChange={handleChange}
                                className="input-field dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex-1 disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Webinar'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/alumni')}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300">
                            <strong>Note:</strong> Your webinar will be pending until approved by the admin or coordinator.
                            You'll be notified once it's approved.
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default HostWebinar;
