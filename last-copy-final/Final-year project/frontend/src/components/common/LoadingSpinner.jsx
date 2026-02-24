import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', overlay = false, text = '' }) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24',
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
                className={`${sizes[size]} border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            {text && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-600 dark:text-gray-400 font-medium"
                >
                    {text}
                </motion.p>
            )}
        </div>
    );

    if (overlay) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return <div className="flex items-center justify-center p-8">{spinner}</div>;
};

export default LoadingSpinner;
