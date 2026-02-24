import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const ManageContent = () => {
    const [tab, setTab] = useState('jobs');
    const [jobs, setJobs] = useState([]);
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [jobsRes, webinarsRes] = await Promise.all([
                api.get('/jobs'),
                api.get('/webinars'),
            ]);
            setJobs(jobsRes.data.data?.jobs || []);
            setWebinars(webinarsRes.data.data?.webinars || []);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this job?')) return;
        try {
            await api.delete(`/jobs/${id}`);
            setJobs(prev => prev.filter(j => j._id !== id));
            toast.success('Job deleted from database');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete job');
        }
    };

    const handleDeleteWebinar = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this webinar?')) return;
        try {
            await api.delete(`/webinars/${id}`);
            setWebinars(prev => prev.filter(w => w._id !== id));
            toast.success('Webinar deleted from database');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete webinar');
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="Admin" title="Manage Content">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="Admin" title="Manage Content">
            {/* Tab Selector */}
            <div className="flex gap-2 mb-6">
                {['jobs', 'webinars'].map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all ${tab === t
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:shadow-md'
                            }`}
                    >
                        {t === 'jobs' ? `Jobs (${jobs.length})` : `Webinars (${webinars.length})`}
                    </button>
                ))}
            </div>

            {/* Jobs Tab */}
            {tab === 'jobs' && (
                <div className="space-y-3">
                    {jobs.length > 0 ? jobs.map((job, i) => (
                        <motion.div
                            key={job._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="card flex items-center justify-between"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{job.title}</h4>
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${job.isApproved
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                        }`}>
                                        {job.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {job.company} • {job.location} • {job.jobType}
                                    {job.applyLink && <span className="ml-2 text-blue-600">🔗 Has apply link</span>}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    Posted: {new Date(job.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDeleteJob(job._id)}
                                className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        </motion.div>
                    )) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-12">No job postings yet</p>
                    )}
                </div>
            )}

            {/* Webinars Tab */}
            {tab === 'webinars' && (
                <div className="space-y-3">
                    {webinars.length > 0 ? webinars.map((webinar, i) => (
                        <motion.div
                            key={webinar._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="card flex items-center justify-between"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{webinar.title}</h4>
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${webinar.isApproved
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                        }`}>
                                        {webinar.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {webinar.topic} • {new Date(webinar.dateTime).toLocaleDateString()} • {webinar.duration}min
                                    {webinar.meetingLink && <span className="ml-2 text-green-600">📹 Has meet link</span>}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {webinar.registrations?.length || 0} registered
                                </p>
                            </div>
                            <button
                                onClick={() => handleDeleteWebinar(webinar._id)}
                                className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        </motion.div>
                    )) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-12">No webinars yet</p>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
};

export default ManageContent;
