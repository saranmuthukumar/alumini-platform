import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Modal from '../../components/common/Modal';
import api from '../../utils/api';
import { useNotifications } from '../../context/NotificationContext';

const JobBoard = () => {
    const { addNotification } = useNotifications();
    const [jobs, setJobs] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [applying, setApplying] = useState(false);
    const [appliedIds, setAppliedIds] = useState(new Set());

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const res = await api.get('/jobs');
            setJobs(res.data.data?.jobs || []);
        } catch (error) {
            console.error('Error loading jobs:', error);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(j => {
        if (filter === 'all') return true;
        return j.jobType === filter;
    });

    const handleApply = (job) => {
        setSelectedJob(job);
        setCoverLetter('');
        setIsApplyModalOpen(true);
    };

    const submitApplication = async () => {
        setApplying(true);
        try {
            await api.post(`/jobs/${selectedJob._id}/apply`, { coverLetter });
            setAppliedIds(prev => new Set([...prev, selectedJob._id]));
            addNotification({
                title: 'Application Submitted!',
                message: `Your application to ${selectedJob.company} has been submitted.`,
                type: 'success',
            });
            setIsApplyModalOpen(false);
        } catch (error) {
            addNotification({
                title: 'Application Failed',
                message: error.response?.data?.message || 'Please try again later',
                type: 'error',
            });
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="Student" title="Job Board">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="Student" title="Job Board">
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    {['all', 'Full-time', 'Part-time', 'Internship', 'Contract'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === type
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                                }`}
                        >
                            {type === 'all' ? 'All Jobs' : type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredJobs.map((job, index) => {
                    const isApplied = appliedIds.has(job._id);
                    return (
                        <motion.div
                            key={job._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="card hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${job.status === 'Open' || job.status === 'open'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                                            }`}>
                                            {job.status || 'Open'}
                                        </span>
                                    </div>
                                    <p className="text-lg font-medium text-primary-600 dark:text-primary-400 mb-2">{job.company}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {job.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {job.jobType}
                                        </span>
                                        {job.salary && (
                                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                                                💰 {job.salary}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{job.description}</p>
                                    {job.skills?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {job.skills.slice(0, 5).map((skill, i) => (
                                                <span key={i} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-md font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => !isApplied && handleApply(job)}
                                            disabled={isApplied}
                                            className={`btn-primary disabled:opacity-60 disabled:cursor-not-allowed ${isApplied ? 'bg-green-600 hover:bg-green-600' : ''}`}
                                        >
                                            {isApplied ? '✓ Applied' : 'Apply Now'}
                                        </button>
                                        {job.applyLink && (
                                            <a
                                                href={job.applyLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 font-medium text-sm transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                Apply via Company
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {filteredJobs.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg font-medium">No jobs found</p>
                    <p className="text-sm mt-1">Check back later for new opportunities</p>
                </div>
            )}

            {/* Apply Modal */}
            <Modal
                isOpen={isApplyModalOpen}
                onClose={() => !applying && setIsApplyModalOpen(false)}
                title={`Apply for ${selectedJob?.title}`}
                size="md"
            >
                {selectedJob && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{selectedJob.title}</h4>
                            <p className="text-sm text-primary-600 dark:text-primary-400">{selectedJob.company}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedJob.location} • {selectedJob.jobType}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cover Letter (Optional)
                            </label>
                            <textarea
                                value={coverLetter}
                                onChange={e => setCoverLetter(e.target.value)}
                                rows={4}
                                className="input-field"
                                placeholder="Tell the employer why you're a great fit for this role..."
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={submitApplication}
                                disabled={applying}
                                className="flex-1 btn-primary disabled:opacity-50"
                            >
                                {applying ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : 'Submit Application'}
                            </button>
                            <button onClick={() => setIsApplyModalOpen(false)} className="flex-1 btn-secondary">Cancel</button>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
};

export default JobBoard;
