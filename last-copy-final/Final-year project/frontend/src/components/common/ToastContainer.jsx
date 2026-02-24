import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from './Toast';

let toastId = 0;

const toastListeners = [];
const addToastListener = (listener) => {
    toastListeners.push(listener);
    return () => {
        const index = toastListeners.indexOf(listener);
        if (index > -1) {
            toastListeners.splice(index, 1);
        }
    };
};

export const showToast = (message, type = 'info') => {
    const toast = {
        id: toastId++,
        message,
        type,
    };
    toastListeners.forEach(listener => listener(toast));
};

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const handleAddToast = (toast) => {
            setToasts(prev => [...prev, toast]);
        };

        const unsubscribe = addToastListener(handleAddToast);
        return unsubscribe;
    }, []);

    const handleRemoveToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => handleRemoveToast(toast.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;
