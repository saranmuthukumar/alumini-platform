import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';

const AlumniDirectory = () => {
    const [alumni, setAlumni] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        department: '',
        batch: '',
        company: '',
    });
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // grid or list

    useEffect(() => {
        loadAlumni();
    }, []);

    const loadAlumni = async () => {
        try {
            const res = await api.get('/alumni');
            setAlumni(res.data.data.alumni);
            setLoading(false);
        } catch (error) {
            console.error('Error loading alumni:', error);
            setLoading(false);
        }
    };

    const filteredAlumni = alumni.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.currentRole?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = !filters.department || a.department === filters.department;
        const matchesBatch = !filters.batch || a.batch === filters.batch;
        const matchesCompany = !filters.company || a.organization?.toLowerCase().includes(filters.company.toLowerCase());
        return matchesSearch && matchesDept && matchesBatch && matchesCompany;
    });

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({ department: '', batch: '', company: '' });
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <DashboardLayout role="Student" title="Alumni Directory">
                <LoadingSpinner size="lg" text="Loading alumni directory..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="Student" title="Alumni Directory">
            {/* Search and Filters */}
            <div className="card mb-6 animate-slide-down">
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by name, role, or organization..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-10 w-full"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select
                            value={filters.department}
                            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                            className="input-field"
                        >
                            <option value="">All Departments</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Civil">Civil</option>
                        </select>
                        <select
                            value={filters.batch}
                            onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
                            className="input-field"
                        >
                            <option value="">All Batches</option>
                            <option value="2018">2018</option>
                            <option value="2019">2019</option>
                            <option value="2020">2020</option>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Filter by company..."
                            value={filters.company}
                            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                            className="input-field"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={clearFilters}
                                className="btn-secondary flex-1 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear
                            </button>
                            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                                    title="Grid View"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M10 3H3v7h7V3zm11 0h-7v7h7V3zM10 14H3v7h7v-7zm11 0h-7v7h7v-7z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                                    title="List View"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Count */}
                    {(searchTerm || filters.department || filters.batch || filters.company) && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Showing {filteredAlumni.length} of {alumni.length} alumni</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Alumni Cards/List */}
            {filteredAlumni.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAlumni.map((alumnus, index) => (
                            <motion.div
                                key={alumnus._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="card-hover group"
                            >
                                {/* Avatar */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-2xl font-bold text-white">
                                            {getInitials(alumnus.name)}
                                        </span>
                                    </div>
                                    <span className="badge-blue text-xs">
                                        {alumnus.batch}
                                    </span>
                                </div>

                                {/* Info */}
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {alumnus.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-1">
                                    {alumnus.currentRole}
                                </p>
                                <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-3 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    {alumnus.organization}
                                </p>

                                {/* Social Links */}
                                {(alumnus.linkedin || alumnus.github) && (
                                    <div className="flex items-center gap-3 mb-3">
                                        {alumnus.linkedin && (
                                            <a href={alumnus.linkedin} target="_blank" rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 transition-colors" title="LinkedIn Profile">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                </svg>
                                            </a>
                                        )}
                                        {alumnus.github && (
                                            <a href={alumnus.github} target="_blank" rel="noopener noreferrer"
                                                className="text-gray-800 dark:text-gray-300 hover:text-gray-600 transition-colors" title="GitHub Profile">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                )}

                                {/* Details */}
                                <div className="border-t dark:border-gray-700 pt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <span>{alumnus.department}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="truncate">{alumnus.email}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <Link
                                    to={`/student/messages/${alumnus._id}`}
                                    className="w-full btn-primary text-center flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Send Message
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredAlumni.map((alumnus, index) => (
                            <motion.div
                                key={alumnus._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.03 }}
                                className="card-hover flex items-center gap-4 p-4"
                            >
                                {/* Avatar */}
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                                    <span className="text-lg font-bold text-white">
                                        {getInitials(alumnus.name)}
                                    </span>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {alumnus.name}
                                        </h3>
                                        <span className="badge-blue text-xs">{alumnus.batch}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {alumnus.currentRole} @ {alumnus.organization}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        {alumnus.department} • {alumnus.email}
                                    </p>
                                </div>

                                {/* Action */}
                                <Link
                                    to={`/student/messages/${alumnus._id}`}
                                    className="btn-primary flex items-center gap-2 flex-shrink-0"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Message
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )
            ) : (
                <EmptyState
                    icon={
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    }
                    title="No alumni found"
                    description="Try adjusting your search or filter criteria"
                    actionText="Clear Filters"
                    onAction={clearFilters}
                />
            )}
        </DashboardLayout>
    );
};

export default AlumniDirectory;
