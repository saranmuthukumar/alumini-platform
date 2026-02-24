import { motion } from 'framer-motion';

const EmptyState = ({
    icon,
    title,
    description,
    action,
    actionLabel
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 px-4"
        >
            {icon && (
                <div className="w-24 h-24 mb-6 text-gray-300 dark:text-gray-600">
                    {icon}
                </div>
            )}

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>

            {description && (
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                    {description}
                </p>
            )}

            {action && actionLabel && (
                <button
                    onClick={action}
                    className="btn-primary"
                >
                    {actionLabel}
                </button>
            )}
        </motion.div>
    );
};

export default EmptyState;
