import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const PostJob = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        jobType: 'Full-time',
        description: '',
        requirements: '',
        salary: '',
        applyLink: '',
        logo: null,
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
            // Note: Logo upload is not currently supported by backend, ignoring logo file
            const jobPayload = {
                title: formData.title,
                company: formData.company,
                location: formData.location,
                jobType: formData.jobType,
                description: formData.description,
                requirements: formData.requirements,
                salary: formData.salary,
                applyLink: formData.applyLink,
            };

            const res = await api.post('/jobs', jobPayload);

            if (res.data.success) {
                if (user?.role === 'Admin') {
                    alert('Job posted successfully! (Published immediately as Admin)');
                    navigate('/admin');
                } else {
                    alert('Job posted successfully! Pending admin approval.');
                    navigate('/alumni');
                }
            }
        } catch (error) {
            console.error('Error posting job:', error);
            alert(error.response?.data?.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role={user?.role || "Alumni"} title="Post a Job">
            <div className="max-w-3xl mx-auto">
                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Job Title *
                            </label>
                            <input
                                name="title"
                                type="text"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g., Software Engineer"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Company *
                                </label>
                                <input
                                    name="company"
                                    type="text"
                                    required
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Company name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Location *
                                </label>
                                <input
                                    name="location"
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Job Type *
                                </label>
                                <select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Salary Range
                                </label>
                                <input
                                    name="salary"
                                    type="text"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g., ₹10-15 LPA"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Apply Link (External URL)
                            </label>
                            <input
                                name="applyLink"
                                type="url"
                                value={formData.applyLink}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="https://company.com/careers/apply"
                            />
                            <p className="text-xs text-gray-500 mt-1">Optional: External link where students can apply</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Job Description *
                            </label>
                            <textarea
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="input-field"
                                placeholder="Describe the role, responsibilities, and what you're looking for..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Company Logo (Image)
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                        <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input name="logo" type="file" className="sr-only" onChange={(e) => setFormData({ ...formData, logo: e.target.files[0] })} accept="image/*" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                    {formData.logo && <p className="text-sm text-green-600 font-medium">Selected: {formData.logo.name}</p>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Requirements
                            </label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                rows="3"
                                className="input-field"
                                placeholder="List required skills, experience, qualifications..."
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex-1 disabled:opacity-50"
                            >
                                {loading ? 'Posting...' : 'Post Job'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(user?.role === 'Admin' ? '/admin' : '/alumni')}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/20 dark:border-yellow-600">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700 dark:text-yellow-200">
                                        <strong className="font-bold">Important Notice:</strong> Your job posting will be reviewed by the admin before being published to ensure quality and relevance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PostJob;
