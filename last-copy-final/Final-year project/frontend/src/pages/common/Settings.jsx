import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        emailNotifications: true,
        privacyLevel: 'Public',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            alert('New passwords do not match');
            setLoading(false);
            return;
        }

        setTimeout(() => {
            alert('Settings updated successfully!');
            setLoading(false);

            // Clear password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            }));
        }, 1000);
    };

    return (
        <DashboardLayout role={user?.role || 'Student'} title="Account Settings">
            <div className="max-w-3xl mx-auto">
                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Account Preferences */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2 mb-4">
                                Preferences
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-base font-medium text-gray-700 dark:text-gray-200">Email Notifications</label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails about new webinars and jobs</p>
                                    </div>
                                    <input
                                        name="emailNotifications"
                                        type="checkbox"
                                        checked={formData.emailNotifications}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Profile Privacy
                                    </label>
                                    <select
                                        name="privacyLevel"
                                        value={formData.privacyLevel}
                                        onChange={handleChange}
                                        className="input-field max-w-xs"
                                    >
                                        <option value="Public">Public (Visible to everyone)</option>
                                        <option value="Alumni Only">Alumni & Students Only</option>
                                        <option value="Private">Private (Only Admin)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Change Password */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                                Change Password
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        name="currentPassword"
                                        type="password"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            name="newPassword"
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            name="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full sm:w-auto px-8"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
