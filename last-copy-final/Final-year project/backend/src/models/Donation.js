import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
    {
        donorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [1, 'Amount must be greater than 0'],
        },
        category: {
            type: String,
            enum: ['Infrastructure', 'Scholarships', 'Student Welfare', 'Other'],
            required: [true, 'Category is required'],
        },
        message: {
            type: String,
            maxlength: [200, 'Message cannot exceed 200 characters'],
        },
        transactionId: {
            type: String,
            required: [true, 'Transaction ID is required'],
            unique: true,
        },
        paymentMethod: {
            type: String,
            enum: ['Online', 'Offline', 'Bank Transfer'],
            default: 'Online',
        },
        isAnonymous: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['Pending', 'Completed', 'Failed'],
            default: 'Completed',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
donationSchema.index({ donorId: 1 });
donationSchema.index({ category: 1 });
donationSchema.index({ createdAt: -1 });

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
