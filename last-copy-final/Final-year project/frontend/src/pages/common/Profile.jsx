import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const Profile = () => {
    const { user, profile } = useAuth();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
    });
    const [profilePhoto, setProfilePhoto] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && profile) {
            setFormData({
                name: profile.name || '',
                email: user.email || '',
                role: user.role || '',
                // Student fields
                rollNumber: profile.rollNumber || '',
                department: profile.department || '',
                batch: profile.batch || '',
                interests: profile.interests?.join(', ') || '',
                bio: profile.bio || '',
                // Alumni fields
                currentRole: profile.currentRole || '',
                organization: profile.organization || '',
                location: profile.location || '',
                linkedin: profile.linkedin || profile.linkedinUrl || '',
                github: profile.github || '',
                portfolio: profile.portfolio || '',
                skills: profile.skills?.join(', ') || '',
                careerDomain: profile.careerDomain || '',
            });
            setProfilePhoto(profile.profileImage || '');
        }
    }, [user, profile]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePhotoClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be under 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setProfilePhoto(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const isAlumni = user.role === 'Alumni';
            const endpoint = isAlumni
                ? `/alumni/${profile._id}`
                : '/students/profile';

            const payload = { ...formData, profileImage: profilePhoto };

            // Convert comma-separated strings to arrays
            if (isAlumni) {
                payload.skills = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
            } else {
                payload.interests = formData.interests ? formData.interests.split(',').map(s => s.trim()).filter(Boolean) : [];
            }

            delete payload.email;
            delete payload.role;

            await api.put(endpoint, payload);

            // Update localStorage with new profile data
            const meRes = await api.get('/auth/me');
            if (meRes.data.success) {
                localStorage.setItem('profile', JSON.stringify(meRes.data.data.profile));
            }

            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const initials = formData?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

    return (
        <DashboardLayout role={user?.role || 'Student'} title="My Profile">
            <div className="max-w-4xl mx-auto">
                <div className="card">
                    {/* Header with Photo */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            {/* Clickable Avatar */}
                            <div
                                className={`relative w-24 h-24 rounded-full overflow-hidden ${isEditing ? 'cursor-pointer ring-2 ring-primary-400 ring-offset-2' : ''}`}
                                onClick={handlePhotoClick}
                                title={isEditing ? 'Click to change photo' : ''}
                            >
                                {profilePhoto ? (
                                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                            {initials}
                                        </span>
                                    </div>
                                )}
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />

                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{formData.name}</h2>
                                <p className="text-gray-600 dark:text-gray-400">{formData.email}</p>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-semibold rounded-full">
                                        {formData.role}
                                    </span>
                                    {/* Social link icons for alumni */}
                                    {user?.role === 'Alumni' && !isEditing && (
                                        <div className="flex items-center gap-2 ml-2">
                                            {formData.linkedin && (
                                                <a href={formData.linkedin} target="_blank" rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 transition-colors" title="LinkedIn">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                    </svg>
                                                </a>
                                            )}
                                            {formData.github && (
                                                <a href={formData.github} target="_blank" rel="noopener noreferrer"
                                                    className="text-gray-800 dark:text-gray-300 hover:text-gray-600 transition-colors" title="GitHub">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                    </svg>
                                                </a>
                                            )}
                                            {formData.portfolio && (
                                                <a href={formData.portfolio} target="_blank" rel="noopener noreferrer"
                                                    className="text-purple-600 hover:text-purple-800 transition-colors" title="Portfolio">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                    </svg>
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn-secondary"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Bio section */}
                    {formData.bio && !isEditing && (
                        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{formData.bio}"</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Common Fields */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    disabled={!isEditing}
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    disabled
                                    value={formData.email}
                                    className="input-field bg-gray-50 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed border-gray-200 dark:border-gray-700"
                                />
                            </div>

                            {/* Bio for all roles */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    disabled={!isEditing}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={3}
                                    className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                    placeholder="Tell us a little about yourself..."
                                    maxLength={user?.role === 'Alumni' ? 500 : 300}
                                />
                            </div>

                            {/* Student Specific Fields */}
                            {user?.role === 'Student' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Roll Number
                                        </label>
                                        <input
                                            name="rollNumber"
                                            type="text"
                                            disabled
                                            value={formData.rollNumber}
                                            className="input-field bg-gray-50 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed border-gray-200 dark:border-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Department
                                        </label>
                                        <select
                                            name="department"
                                            disabled={!isEditing}
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                        >
                                            <option value="">Select Department</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Mechanical">Mechanical</option>
                                            <option value="Civil">Civil</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Batch
                                        </label>
                                        <input
                                            name="batch"
                                            type="text"
                                            disabled={!isEditing}
                                            value={formData.batch}
                                            onChange={handleChange}
                                            className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Interests
                                        </label>
                                        <input
                                            name="interests"
                                            type="text"
                                            disabled={!isEditing}
                                            value={formData.interests}
                                            onChange={handleChange}
                                            className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                            placeholder="e.g., Web Dev, AI, Data Science"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Alumni Specific Fields */}
                            {user?.role === 'Alumni' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Current Role
                                        </label>
                                        <input
                                            name="currentRole"
                                            type="text"
                                            disabled={!isEditing}
                                            value={formData.currentRole}
                                            onChange={handleChange}
                                            className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                            placeholder="e.g., Software Engineer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Organization
                                        </label>
                                        <input
                                            name="organization"
                                            type="text"
                                            disabled={!isEditing}
                                            value={formData.organization}
                                            onChange={handleChange}
                                            className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                            placeholder="e.g., Google, Microsoft"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Location
                                        </label>
                                        <input
                                            name="location"
                                            type="text"
                                            disabled={!isEditing}
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                            placeholder="e.g., Bangalore, India"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Career Domain
                                        </label>
                                        <input
                                            name="careerDomain"
                                            type="text"
                                            disabled={!isEditing}
                                            value={formData.careerDomain}
                                            onChange={handleChange}
                                            className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                            placeholder="e.g., Software Development"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Skills
                                        </label>
                                        <input
                                            name="skills"
                                            type="text"
                                            disabled={!isEditing}
                                            value={formData.skills}
                                            onChange={handleChange}
                                            className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                            placeholder="e.g., React, Node.js, Python"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Department
                                        </label>
                                        <select
                                            name="department"
                                            disabled={!isEditing}
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                        >
                                            <option value="">Select Department</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Mechanical">Mechanical</option>
                                            <option value="Civil">Civil</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Batch
                                        </label>
                                        <input
                                            name="batch"
                                            type="text"
                                            disabled={!isEditing}
                                            value={formData.batch}
                                            onChange={handleChange}
                                            className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                        />
                                    </div>

                                    {/* Social Links Section */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                            Social Links
                                        </h3>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                            LinkedIn
                                        </label>
                                        <input
                                            name="linkedin"
                                            type="url"
                                            disabled={!isEditing}
                                            value={formData.linkedin}
                                            onChange={handleChange}
                                            className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                            placeholder="https://linkedin.com/in/your-profile"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                            GitHub
                                        </label>
                                        <input
                                            name="github"
                                            type="url"
                                            disabled={!isEditing}
                                            value={formData.github}
                                            onChange={handleChange}
                                            className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                            placeholder="https://github.com/your-username"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                            Portfolio Website
                                        </label>
                                        <input
                                            name="portfolio"
                                            type="url"
                                            disabled={!isEditing}
                                            value={formData.portfolio}
                                            onChange={handleChange}
                                            className="input-field disabled:bg-gray-50 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                            placeholder="https://your-portfolio.com"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {isEditing && (
                            <div className="flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
