import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const CreateEvent = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        category: 'Workshop',
        date: '',
        time: '',
        venue: '',
        description: '',
        maxParticipants: 200,
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
            // Combine date and time into dateTime
            const dateTime = new Date(`${formData.date}T${formData.time || '09:00'}`).toISOString();

            const payload = {
                title: formData.title,
                category: formData.category,
                description: formData.description,
                dateTime,
                venue: formData.venue,
                location: formData.venue,
                maxParticipants: parseInt(formData.maxParticipants) || 200,
                duration: 2,
            };

            await api.post('/events', payload);
            toast.success('Event created successfully!');
            navigate(user?.role === 'Admin' ? '/admin' : '/coordinator');
        } catch (error) {
            console.error('Error creating event:', error);
            toast.error(error.response?.data?.message || 'Failed to create event. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role={user?.role} title="Create Event">
            <div className="max-w-3xl mx-auto">
                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Event Title *
                            </label>
                            <input
                                name="title"
                                type="text"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g., Annual Alumni Meet 2024"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="Workshop">Workshop</option>
                                    <option value="Seminar">Seminar</option>
                                    <option value="Alumni Meet">Alumni Meet</option>
                                    <option value="Career Fair">Career Fair</option>
                                    <option value="Cultural">Cultural</option>
                                    <option value="Networking">Networking</option>
                                    <option value="Career Talk">Career Talk</option>
                                    <option value="Technical Workshop">Technical Workshop</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Max Participants
                                </label>
                                <input
                                    name="maxParticipants"
                                    type="number"
                                    min="1"
                                    value={formData.maxParticipants}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="200"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Date *
                                </label>
                                <input
                                    name="date"
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Time *
                                </label>
                                <input
                                    name="time"
                                    type="time"
                                    required
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Venue / Location *
                            </label>
                            <input
                                name="venue"
                                type="text"
                                required
                                value={formData.venue}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g., University Auditorium / Online"
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
                                className="input-field"
                                placeholder="Describe the event details..."
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex-1 disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating...
                                    </span>
                                ) : 'Create Event'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(user?.role === 'Admin' ? '/admin' : '/coordinator')}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreateEvent;
