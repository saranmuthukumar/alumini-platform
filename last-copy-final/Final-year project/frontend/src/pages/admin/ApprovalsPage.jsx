import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const ApprovalsPage = () => {
    const [pendingAlumni, setPendingAlumni] = useState([]);
    const [pendingStudents, setPendingStudents] = useState([]);
    const [pendingWebinars, setPendingWebinars] = useState([]);
    const [pendingJobs, setPendingJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPendingItems();
    }, []);

    const loadPendingItems = async () => {
        setLoading(true);
        try {
            const [alumniRes, studentsRes, webinarsRes, jobsRes] = await Promise.all([
                api.get('/alumni/pending'),
                api.get('/students/pending'),
                api.get('/webinars?isApproved=false'),
                api.get('/jobs?isApproved=false'),
            ]);
            setPendingAlumni(alumniRes.data.data || []);
            setPendingStudents(studentsRes.data.data || []);
            setPendingWebinars(webinarsRes.data.data?.webinars || []);
            setPendingJobs(jobsRes.data.data?.jobs || []);
        } catch (error) {
            console.error('Error loading pending items:', error);
            toast.error('Failed to load pending approvals');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveAlumni = async (id) => {
        try {
            await api.put(`/alumni/${id}/approve`);
            toast.success('Alumni approved successfully!');
            setPendingAlumni(prev => prev.filter(a => a._id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve alumni');
        }
    };

    const handleRejectAlumni = async (id) => {
        if (!window.confirm('Are you sure you want to reject this alumni?')) return;
        try {
            await api.put(`/alumni/${id}/reject`);
            toast.info('Alumni rejected');
            setPendingAlumni(prev => prev.filter(a => a._id !== id));
        } catch (error) {
            toast.error('Failed to reject alumni');
        }
    };

    const handleApproveStudent = async (id) => {
        try {
            await api.put(`/students/${id}/approve`);
            toast.success('Student approved successfully!');
            setPendingStudents(prev => prev.filter(s => s._id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve student');
        }
    };

    const handleRejectStudent = async (id) => {
        if (!window.confirm('Are you sure you want to reject this student?')) return;
        try {
            await api.put(`/students/${id}/reject`);
            toast.info('Student rejected');
            setPendingStudents(prev => prev.filter(s => s._id !== id));
        } catch (error) {
            toast.error('Failed to reject student');
        }
    };

    const handleApproveWebinar = async (id) => {
        try {
            await api.put(`/webinars/${id}/approve`);
            toast.success('Webinar approved and published!');
            setPendingWebinars(prev => prev.filter(w => w._id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve webinar');
        }
    };

    const handleRejectWebinar = async (id) => {
        if (!window.confirm('Reject and remove this webinar?')) return;
        try {
            await api.put(`/webinars/${id}/reject`);
            toast.info('Webinar rejected');
            setPendingWebinars(prev => prev.filter(w => w._id !== id));
        } catch (error) {
            toast.error('Failed to reject webinar');
        }
    };

    const handleApproveJob = async (id) => {
        try {
            await api.put(`/jobs/${id}/approve`);
            toast.success('Job approved and published!');
            setPendingJobs(prev => prev.filter(j => j._id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve job');
        }
    };

    const handleRejectJob = async (id) => {
        if (!window.confirm('Reject and remove this job posting?')) return;
        try {
            await api.put(`/jobs/${id}/reject`);
            toast.info('Job rejected');
            setPendingJobs(prev => prev.filter(j => j._id !== id));
        } catch (error) {
            toast.error('Failed to reject job');
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="Admin" title="Pending Approvals">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    const totalPending = pendingAlumni.length + pendingStudents.length + pendingWebinars.length + pendingJobs.length;

    return (
        <DashboardLayout role="Admin" title="Pending Approvals">
            {/* Summary Banner */}
            {totalPending > 0 ? (
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-3">
                    <svg className="w-6 h-6 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-amber-800 dark:text-amber-200 font-medium">
                        {totalPending} item{totalPending !== 1 ? 's' : ''} pending review
                    </p>
                </div>
            ) : (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-800 dark:text-green-200 font-medium">All caught up! No pending approvals.</p>
                </div>
            )}

            <div className="space-y-6">
                {/* Student Approvals */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Pending Students
                            {pendingStudents.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full">
                                    {pendingStudents.length}
                                </span>
                            )}
                        </h3>
                    </div>
                    {pendingStudents.length > 0 ? (
                        <div className="space-y-3">
                            {pendingStudents.map((student) => (
                                <motion.div
                                    key={student._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
                                >
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{student.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {student.userId?.email} &bull; {student.department} &bull; Roll: {student.rollNumber} &bull; Batch {student.batch}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button onClick={() => handleApproveStudent(student._id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors">
                                            Approve
                                        </button>
                                        <button onClick={() => handleRejectStudent(student._id)} className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 text-sm font-medium transition-colors">
                                            Reject
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No pending student approvals</p>
                    )}
                </div>

                {/* Alumni Approvals */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Pending Alumni
                            {pendingAlumni.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 text-sm font-semibold rounded-full">
                                    {pendingAlumni.length}
                                </span>
                            )}
                        </h3>
                    </div>
                    {pendingAlumni.length > 0 ? (
                        <div className="space-y-3">
                            {pendingAlumni.map((alumni) => (
                                <motion.div
                                    key={alumni._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
                                >
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{alumni.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {alumni.userId?.email} &bull; {alumni.department} &bull; Batch {alumni.batch}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button onClick={() => handleApproveAlumni(alumni._id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors">
                                            Approve
                                        </button>
                                        <button onClick={() => handleRejectAlumni(alumni._id)} className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 text-sm font-medium transition-colors">
                                            Reject
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No pending alumni approvals</p>
                    )}
                </div>

                {/* Webinar Approvals */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Pending Webinars
                            {pendingWebinars.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold rounded-full">
                                    {pendingWebinars.length}
                                </span>
                            )}
                        </h3>
                    </div>
                    {pendingWebinars.length > 0 ? (
                        <div className="space-y-3">
                            {pendingWebinars.map((webinar) => (
                                <motion.div
                                    key={webinar._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
                                >
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{webinar.title}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {webinar.topic} &bull; {new Date(webinar.dateTime).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button onClick={() => handleApproveWebinar(webinar._id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors">
                                            Approve
                                        </button>
                                        <button onClick={() => handleRejectWebinar(webinar._id)} className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 text-sm font-medium transition-colors">
                                            Reject
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No pending webinar approvals</p>
                    )}
                </div>

                {/* Job Approvals */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Pending Jobs
                            {pendingJobs.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-sm font-semibold rounded-full">
                                    {pendingJobs.length}
                                </span>
                            )}
                        </h3>
                    </div>
                    {pendingJobs.length > 0 ? (
                        <div className="space-y-3">
                            {pendingJobs.map((job) => (
                                <motion.div
                                    key={job._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
                                >
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{job.title}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {job.company} &bull; {job.location} &bull; {job.jobType}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">Posted by: {job.postedBy?.email}</p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button onClick={() => handleApproveJob(job._id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors">
                                            Approve
                                        </button>
                                        <button onClick={() => handleRejectJob(job._id)} className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 text-sm font-medium transition-colors">
                                            Reject
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No pending job approvals</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ApprovalsPage;
