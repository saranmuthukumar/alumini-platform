import DashboardLayout from '../../components/dashboard/DashboardLayout';

const CoordinatorDashboard = () => {
    return (
        <DashboardLayout role="Coordinator" title="Coordinator Dashboard">
            <div className="card mb-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <h2 className="text-2xl font-bold mb-2">Coordinator Panel</h2>
                <p className="text-primary-100">Manage webinars, events, and student engagement</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                    <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">Active Webinars</h3>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">0</p>
                </div>
                <div className="card bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800">
                    <h3 className="text-sm font-medium text-green-600 dark:text-green-400">Upcoming Events</h3>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">0</p>
                </div>
                <div className="card bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800">
                    <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400">Student Engagement</h3>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">0%</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CoordinatorDashboard;
