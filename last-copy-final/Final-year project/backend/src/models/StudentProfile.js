import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        rollNumber: {
            type: String,
            required: [true, 'Roll number is required'],
            unique: true,
            trim: true,
        },
        department: {
            type: String,
            required: [true, 'Department is required'],
        },
        batch: {
            type: String,
            required: [true, 'Batch is required'],
        },
        interests: {
            type: [String],
            default: [],
        },
        bio: {
            type: String,
            maxlength: [300, 'Bio cannot exceed 300 characters'],
        },
        profileImage: {
            type: String,
            default: '',
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
studentProfileSchema.index({ rollNumber: 1 });
studentProfileSchema.index({ department: 1 });
studentProfileSchema.index({ batch: 1 });

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);

export default StudentProfile;
