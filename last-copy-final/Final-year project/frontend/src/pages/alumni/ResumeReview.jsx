import { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useNotifications } from '../../context/NotificationContext';

const AlumniResumeReview = () => {
    const { addNotification } = useNotifications();
    const [pendingResumes, setPendingResumes] = useState([
        { id: 101, student: 'Alice Johnson', file: 'Alice_Resume.pdf', date: '2025-12-30' },
        { id: 102, student: 'Bob Smith', file: 'Bob_Dev_CV.docx', date: '2025-12-31' },
    ]);
    const [feedback, setFeedback] = useState('');
    const [selectedResume, setSelectedResume] = useState(null);

    const handleSubmitFeedback = (id, status) => {
        setPendingResumes(pendingResumes.filter(r => r.id !== id));
        setSelectedResume(null);
        setFeedback('');

        addNotification({
            title: 'Feedback Submitted',
            message: `Feedback for ${selectedResume.student} marked as ${status}.`,
            type: 'success',
        });
    };

    return (
        <DashboardLayout role="Alumni" title="Pending Resume Reviews">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Pending Requests</h2>
                    {pendingResumes.length > 0 ? (
                        <div className="space-y-4">
                            {pendingResumes.map((resume) => (
                                <div
                                    key={resume.id}
                                    className={`p-4 border dark:border-gray-700 rounded-lg cursor-pointer transition-colors ${selectedResume?.id === resume.id ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                    onClick={() => setSelectedResume(resume)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{resume.student}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{resume.file}</p>
                                        </div>
                                        <span className="text-xs text-gray-400">{resume.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No pending resumes to review.</p>
                    )}
                </div>

                <div className="card">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Feedback Panel</h2>
                    {selectedResume ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-300">Reviewing: <span className="font-bold">{selectedResume.file}</span></p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Student: <span className="font-bold">{selectedResume.student}</span></p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    General Feedback
                                </label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="input-field min-h-[150px] dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                    placeholder="Provide constructive feedback..."
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleSubmitFeedback(selectedResume.id, 'Approved')}
                                    className="flex-1 btn-primary"
                                >
                                    Approve & Send
                                </button>
                                <button
                                    onClick={() => handleSubmitFeedback(selectedResume.id, 'Rejected')}
                                    className="flex-1 btn-secondary text-red-600 dark:text-red-400"
                                >
                                    Request Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 py-12">
                            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p>Select a resume from the list to start reviewing</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AlumniResumeReview;
