import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, gradient = 'blue', trend, trendValue }) => {
    const gradients = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600',
        pink: 'from-pink-500 to-pink-600',
        indigo: 'from-indigo-500 to-indigo-600',
        red: 'from-red-500 to-red-600',
        yellow: 'from-yellow-500 to-yellow-600',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradients[gradient]} text-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-300`}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                    {trend && (
                        <div className="flex items-center mt-2 text-sm">
                            <span className={`flex items-center ${trend === 'up' ? 'text-green-200' : 'text-red-200'}`}>
                                {trend === 'up' ? (
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                )}
                                {trendValue}
                            </span>
                        </div>
                    )}
                </div>
                {icon && (
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        {icon}
                    </div>
                )}
            </div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </motion.div>
    );
};

export default StatCard;
