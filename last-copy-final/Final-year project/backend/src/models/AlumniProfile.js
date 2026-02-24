import mongoose from 'mongoose';

const alumniProfileSchema = new mongoose.Schema(
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
        batch: {
            type: String,
            required: [true, 'Batch is required'],
        },
        department: {
            type: String,
            required: [true, 'Department is required'],
        },
        currentRole: {
            type: String,
            trim: true,
        },
        organization: {
            type: String,
            trim: true,
        },
        skills: {
            type: [String],
            default: [],
        },
        careerDomain: {
            type: String,
            trim: true,
        },
        linkedin: {
            type: String,
            trim: true,
        },
        portfolio: {
            type: String,
            trim: true,
        },
        github: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
        },
        privacyLevel: {
            type: String,
            enum: ['Public', 'Students+Alumni', 'Hidden'],
            default: 'Students+Alumni',
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        profileImage: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for search and filtering
alumniProfileSchema.index({ name: 'text', skills: 'text', organization: 'text', currentRole: 'text' });
alumniProfileSchema.index({ department: 1 });
alumniProfileSchema.index({ batch: 1 });
alumniProfileSchema.index({ careerDomain: 1 });
alumniProfileSchema.index({ isApproved: 1 });
alumniProfileSchema.index({ privacyLevel: 1 });

const AlumniProfile = mongoose.model('AlumniProfile', alumniProfileSchema);

export default AlumniProfile;
