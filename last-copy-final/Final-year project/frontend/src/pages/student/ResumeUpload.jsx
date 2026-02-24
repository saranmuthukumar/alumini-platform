import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useNotifications } from '../../context/NotificationContext';
import EmptyState from '../../components/common/EmptyState';

const ResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const { addNotification } = useNotifications();
    const [resumes, setResumes] = useState([
        {
            id: 1,
            name: 'Saran_Resume_Core.pdf',
            status: 'Approved',
            feedback: 'Great layout and clear presentation! Strong technical skills highlighted.',
            reviewer: 'Dr. Sarah Johnson',
            date: '2025-12-20',
            size: '245 KB'
        },
        {
            id: 2,
            name: 'Saran_Resume_Dev.pdf',
            status: 'Pending',
            feedback: null,
            reviewer: null,
            date: '2025-12-31',
            size: '198 KB'
        },
        {
            id: 3,
            name: 'Saran_Resume_Updated.pdf',
            status: 'Rejected',
            feedback: 'Please include more specific project details and quantifiable achievements.',
            reviewer: 'Prof. Michael Chen',
            date: '2025-12-15',
            size: '312 KB'
        },
    ]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) {
                addNotification({
                    title: 'File Too Large',
                    message: 'Please select a file smaller than 10MB',
                    type: 'error',
                });
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.size > 10 * 1024 * 1024) {
                addNotification({
                    title: 'File Too Large',
                    message: 'Please select a file smaller than 10MB',
                    type: 'error',
                });
                return;
            }
            setFile(droppedFile);
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setTimeout(() => {
            const newResume = {
                id: Date.now(),
                name: file.name,
                status: 'Pending',
                feedback: null,
                reviewer: null,
                date: new Date().toISOString().split('T')[0],
                size: `${(file.size / 1024).toFixed(0)} KB`,
            };
            setResumes([newResume, ...resumes]);
            setFile(null);
            setUploading(false);
            addNotification({
                title: 'Resume Uploaded Successfully',
                message: `Your resume "${file.name}" has been submitted for alumni review.`,
                type: 'success',
            });
        }, 1500);
    };

    const getStatusColor = (status) => {
        const colors = {
            'Approved': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
            'Rejected': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
            'Pending': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
        };
        return colors[status] || colors['Pending'];
    };

    const getStatusIcon = (status) => {
        if (status === 'Approved') {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        } else if (status === 'Rejected') {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        } else {
            return (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            );
        }
    };

    const stats = {
        total: resumes.length,
        approved: resumes.filter(r => r.status === 'Approved').length,
        pending: resumes.filter(r => r.status === 'Pending').length,
        rejected: resumes.filter(r => r.status === 'Rejected').length,
    };

    return (
        <DashboardLayout role="Student" title="Resume Review">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-slide-down">
                <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Uploads</div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</div>
                </div>
                <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                    <div className="text-sm text-green-600 dark:text-green-400 mb-1">Approved</div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.approved}</div>
                </div>
                <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
                    <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Pending</div>
                    <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pending}</div>
                </div>
                <div className="card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
                    <div className="text-sm text-red-600 dark:text-red-400 mb-1">Needs Work</div>
                    <div className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.rejected}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-1"
                >
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
                            <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload Resume
                        </h2>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${dragActive
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    id="resume-upload"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor="resume-upload"
                                    className="cursor-pointer flex flex-col items-center gap-3"
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${file ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-100 dark:bg-gray-800'
                                        }`}>
                                        {file ? (
                                            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        )}
                                    </div>
                                    {file ? (
                                        <div className="space-y-1">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white block">
                                                {file.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {(file.size / 1024).toFixed(0)} KB
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Click to upload or drag and drop
                                            </span>
                                            <span className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</span>
                                        </>
                                    )}
                                </label>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                <p className="text-xs text-blue-800 dark:text-blue-300">
                                    <strong>Tip:</strong> Alumni reviewers look for clear formatting, relevant skills, and quantifiable achievements.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={!file || uploading}
                                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Submit for Review
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Resume History */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="lg:col-span-2"
                >
                    <div className="card">
                        <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
                            <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            My Resumes
                        </h2>

                        {resumes.length > 0 ? (
                            <div className="space-y-4">
                                {resumes.map((resume, index) => (
                                    <motion.div
                                        key={resume.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <svg className="w-10 h-10 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                                                        <path d="M14 2v6h6M10 13h4m-4 2h4m-4 2h4" />
                                                    </svg>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                                            {resume.name}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {resume.size} • Uploaded on {new Date(resume.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(resume.status)}`}>
                                                {getStatusIcon(resume.status)}
                                                {resume.status}
                                            </span>
                                        </div>

                                        {resume.feedback && (
                                            <div className={`rounded-lg p-3 ${resume.status === 'Approved'
                                                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                                }`}>
                                                <div className="flex items-start gap-2 mb-1">
                                                    <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${resume.status === 'Approved' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                    </svg>
                                                    <div>
                                                        <p className={`text-sm font-medium ${resume.status === 'Approved' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                                                            }`}>
                                                            Feedback from {resume.reviewer}
                                                        </p>
                                                        <p className={`text-sm mt-1 ${resume.status === 'Approved' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                                                            }`}>
                                                            {resume.feedback}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {!resume.feedback && resume.status === 'Pending' && (
                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                                <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Waiting for alumni review...
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                }
                                title="No resumes uploaded yet"
                                description="Upload your first resume to get feedback from experienced alumni"
                            />
                        )}
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default ResumeUpload;
