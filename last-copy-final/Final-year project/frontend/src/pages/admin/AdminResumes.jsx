import { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useNotifications } from '../../context/NotificationContext';

const AdminResumes = () => {
    const { addNotification } = useNotifications();
    const [resumes, setResumes] = useState([
        { id: 1, student: 'Alice Johnson', alumni: 'John Doe', file: 'Alice_Resume.pdf', status: 'Approved', date: '2025-12-30' },
        { id: 2, student: 'Bob Smith', alumni: 'Pending', file: 'Bob_Dev_CV.docx', status: 'Pending', date: '2025-12-31' },
        { id: 3, student: 'Charlie Brown', alumni: 'Jane Smith', file: 'Charlie_Design.pdf', status: 'Rejected', date: '2025-12-28' },
    ]);

    const handleAction = (id, action) => {
        setResumes(resumes.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'Approved' : 'Rejected' } : r));
        addNotification({
            title: `Resume ${action === 'approve' ? 'Approved' : 'Rejected'}`,
            message: `Resume ID ${id} has been ${action}d by Admin.`,
            type: action === 'approve' ? 'success' : 'error',
        });
    };

    return (
        <DashboardLayout role="Admin" title="Resume Moderation">
            <div className="card">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Student</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Reviewer (Alumni)</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">File</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                            {resumes.map((resume) => (
                                <tr key={resume.id}>
                                    <td className="py-4 px-4 text-sm font-medium dark:text-white">{resume.student}</td>
                                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">{resume.alumni}</td>
                                    <td className="py-4 px-4 text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{resume.file}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${resume.status === 'Approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                                            resume.status === 'Rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                                                'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                            }`}>
                                            {resume.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">{resume.date}</td>
                                    <td className="py-4 px-4 space-x-2">
                                        {resume.status === 'Pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(resume.id, 'approve')}
                                                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium text-sm"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(resume.id, 'reject')}
                                                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium text-sm"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium text-sm">
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminResumes;
