import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

const Donation = () => {
    const { user } = useAuth();
    const [amount, setAmount] = useState('');
    const [customAmount, setCustomAmount] = useState('');
    const [message, setMessage] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const selectedAmount = amount || customAmount;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const donationAmount = parseFloat(selectedAmount);
        if (!donationAmount || donationAmount <= 0) {
            toast.error('Please select or enter a valid donation amount');
            return;
        }
        setLoading(true);
        try {
            await api.post('/donations', {
                amount: donationAmount,
                message,
                isAnonymous: anonymous,
            });
            setSuccess(true);
            toast.success('Thank you for your generous donation! 🙏');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Donation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <DashboardLayout role={user?.role} title="Donation">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg mx-auto text-center py-16"
                >
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Thank You!</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Your donation of ₹{selectedAmount} has been received. Your generosity helps future students succeed.</p>
                    <button onClick={() => { setSuccess(false); setAmount(''); setCustomAmount(''); setMessage(''); }} className="btn-primary">
                        Make Another Donation
                    </button>
                </motion.div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role={user?.role} title="Make a Donation">
            <div className="max-w-2xl mx-auto">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white text-center shadow-xl"
                >
                    <div className="text-5xl mb-4">❤️</div>
                    <h2 className="text-2xl font-bold mb-2">Give Back, Shape the Future</h2>
                    <p className="text-pink-100 text-sm max-w-md mx-auto">
                        Your donation directly supports student scholarships, events, and infrastructure improvements at your alma mater.
                    </p>
                </motion.div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Preset Amounts */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Select Amount (₹)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                {PRESET_AMOUNTS.map(preset => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => { setAmount(preset.toString()); setCustomAmount(''); }}
                                        className={`py-3 rounded-xl font-semibold text-sm transition-all ${amount === preset.toString()
                                            ? 'bg-primary-600 text-white shadow-lg scale-105'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        ₹{preset.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                            {/* Custom Amount */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Or enter custom amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Enter amount"
                                        value={customAmount}
                                        onChange={e => { setCustomAmount(e.target.value); setAmount(''); }}
                                        className="input-field pl-8"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Message (Optional)
                            </label>
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows={3}
                                className="input-field"
                                placeholder="Share a message of encouragement for future students..."
                            />
                        </div>

                        {/* Anonymous */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={anonymous}
                                onChange={e => setAnonymous(e.target.checked)}
                                className="w-4 h-4 text-primary-600 rounded"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Make this donation anonymous</span>
                        </label>

                        {/* Selected Amount Display */}
                        {selectedAmount && (
                            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800 text-center">
                                <p className="text-primary-700 dark:text-primary-300 font-medium">
                                    You are donating <span className="text-2xl font-bold">₹{parseFloat(selectedAmount).toLocaleString()}</span>
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !selectedAmount}
                            className="w-full py-4 btn-primary text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : `Donate ₹${selectedAmount ? parseFloat(selectedAmount).toLocaleString() : '...'} 💝`}
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Donation;
