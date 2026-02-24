import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAlumni: 0,
        totalStudents: 0,
        totalWebinars: 0,
        totalJobs: 0,
        totalDonations: 0,
        donationCount: 0,
    });
    const [roleDistribution, setRoleDistribution] = useState([]);
    const [deptDistribution, setDeptDistribution] = useState([]);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const [usersRes, webinarsRes, jobsRes, donationsRes] = await Promise.all([
                api.get('/users'),
                api.get('/webinars'),
                api.get('/jobs'),
                api.get('/donations/stats'),
            ]);

            const usersList = usersRes.data.data?.users || [];
            const totalUsers = usersRes.data.data?.total || usersList.length;

            // Role distribution
            const roleCounts = {};
            usersList.forEach(u => {
                roleCounts[u.role] = (roleCounts[u.role] || 0) + 1;
            });
            const roleData = Object.entries(roleCounts).map(([role, count]) => ({
                name: role,
                value: count,
                percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
            }));
            setRoleDistribution(roleData);

            // Department distribution (from profile data if available)
            const deptCounts = {};
            usersList.forEach(u => {
                const dept = u.department || u.profile?.department;
                if (dept) {
                    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
                }
            });
            const deptData = Object.entries(deptCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 6);
            const maxDept = Math.max(...deptData.map(d => d.count), 1);
            setDeptDistribution(deptData.map(d => ({ ...d, percentage: Math.round((d.count / maxDept) * 100) })));

            const donationStats = donationsRes.data.data?.total || { total: 0, count: 0 };

            setStats({
                totalUsers,
                totalAlumni: roleCounts['Alumni'] || 0,
                totalStudents: roleCounts['Student'] || 0,
                totalWebinars: webinarsRes.data.data?.pagination?.total || 0,
                totalJobs: jobsRes.data.data?.pagination?.total || 0,
                totalDonations: donationStats.total || 0,
                donationCount: donationStats.count || 0,
            });
        } catch (error) {
            console.error('Error loading analytics:', error);
            toast.error('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="Admin" title="Platform Analytics">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, color: 'from-blue-500 to-blue-700', icon: '👥' },
        { label: 'Alumni', value: stats.totalAlumni, color: 'from-green-500 to-emerald-700', icon: '🎓' },
        { label: 'Students', value: stats.totalStudents, color: 'from-purple-500 to-purple-700', icon: '📚' },
        { label: 'Webinars', value: stats.totalWebinars, color: 'from-cyan-500 to-cyan-700', icon: '📹' },
        { label: 'Job Postings', value: stats.totalJobs, color: 'from-amber-500 to-orange-600', icon: '💼' },
        { label: 'Donations', value: `₹${stats.totalDonations.toLocaleString()}`, color: 'from-pink-500 to-rose-600', icon: '💝', sub: `${stats.donationCount} contributors` },
    ];

    // Pie chart conic gradient
    let cumulativePercent = 0;
    const conicStops = roleDistribution.map((item, i) => {
        const start = cumulativePercent;
        cumulativePercent += item.percentage;
        return `${COLORS[i % COLORS.length]} ${start}% ${cumulativePercent}%`;
    }).join(', ');

    return (
        <DashboardLayout role="Admin" title="Platform Analytics">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`card bg-gradient-to-br ${card.color} text-white`}
                    >
                        <div className="text-3xl mb-2">{card.icon}</div>
                        <h3 className="text-sm font-medium text-white/80">{card.label}</h3>
                        <p className="text-3xl font-bold mt-1">{card.value}</p>
                        {card.sub && <p className="text-xs text-white/70 mt-1">{card.sub}</p>}
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Pie Chart - Role Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">User Role Distribution</h3>
                    <div className="flex items-center justify-center gap-8">
                        {/* Pie Chart */}
                        <div
                            className="w-48 h-48 rounded-full shadow-lg relative"
                            style={{
                                background: conicStops
                                    ? `conic-gradient(${conicStops})`
                                    : '#e5e7eb',
                            }}
                        >
                            {/* Inner circle for donut effect */}
                            <div className="absolute inset-6 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-inner">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-3">
                            {roleDistribution.map((item, i) => (
                                <div key={item.name} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.value} ({item.percentage}%)</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Bar Chart - Department Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Departments</h3>
                    {deptDistribution.length > 0 ? (
                        <div className="space-y-4">
                            {deptDistribution.map((dept, i) => (
                                <div key={dept.name}>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="font-medium text-gray-800 dark:text-gray-200">{dept.name}</span>
                                        <span className="text-gray-500 dark:text-gray-400 font-semibold">{dept.count}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${dept.percentage}%` }}
                                            transition={{ duration: 0.8, delay: i * 0.1 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No department data available</p>
                    )}
                </motion.div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Webinar Overview</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalWebinars}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total webinars hosted</p>
                </div>

                <div className="card">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Job Postings</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalJobs}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total job opportunities</p>
                </div>

                <div className="card">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Donations Raised</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">₹{stats.totalDonations.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">From {stats.donationCount} contributions</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
