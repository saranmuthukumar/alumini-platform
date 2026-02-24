import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { useState } from 'react';

const DashboardLayout = ({ children, role, title }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = {
        Student: [
            { name: 'Dashboard', path: '/student' },
            { name: 'My Profile', path: '/profile' },
            { name: 'Alumni Directory', path: '/student/directory' },
            { name: 'Webinars', path: '/student/webinars' },
            { name: 'Job Board', path: '/student/jobs' },
            { name: 'Resume Review', path: '/student/resumes' },
            { name: 'Messages', path: '/student/messages' },
            { name: 'Events', path: '/student/events' },
            { name: 'Settings', path: '/settings' },
        ],
        Alumni: [
            { name: 'Dashboard', path: '/alumni' },
            { name: 'My Profile', path: '/profile' },
            { name: 'Host Webinar', path: '/alumni/webinars/create' },
            { name: 'Post Job', path: '/alumni/jobs/create' },
            { name: 'Resume Review', path: '/alumni/resumes' },
            { name: 'Messages', path: '/alumni/messages' },
            { name: 'Donations', path: '/alumni/donations' },
            { name: 'Settings', path: '/settings' },
        ],
        Admin: [
            { name: 'Dashboard', path: '/admin' },
            { name: 'My Profile', path: '/profile' },
            { name: 'Users', path: '/admin/users' },
            { name: 'Approvals', path: '/admin/approvals' },
            { name: 'Resume Moderation', path: '/admin/resumes' },
            { name: 'Post Job', path: '/admin/jobs/create' },
            { name: 'Create Event', path: '/admin/events/create' },
            { name: 'Manage Content', path: '/admin/manage' },
            { name: 'Analytics', path: '/admin/analytics' },
            { name: 'Settings', path: '/settings' },
        ],
        Coordinator: [
            { name: 'Dashboard', path: '/coordinator' },
            { name: 'My Profile', path: '/profile' },
            { name: 'Webinars', path: '/coordinator/webinars' },
            { name: 'Events', path: '/coordinator/events' },
            { name: 'Reports', path: '/coordinator/reports' },
            { name: 'Settings', path: '/settings' },
        ],
    };

    const items = navItems[role] || [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />

            <div className="flex">
                {/* Mobile sidebar backdrop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Sidebar */}
                <aside
                    className={`
            fixed lg:sticky top-16 left-0 z-30
            w-64 bg-white dark:bg-gray-800 shadow-sm min-h-screen
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 border-r dark:border-gray-700
          `}
                >
                    <nav className="mt-5 px-4">
                        <div className="space-y-1">
                            {items.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 rounded-lg transition-colors"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden mb-4 inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        Menu
                    </button>

                    <div className="max-w-7xl mx-auto">
                        {title && (
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">{title}</h1>
                        )}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
