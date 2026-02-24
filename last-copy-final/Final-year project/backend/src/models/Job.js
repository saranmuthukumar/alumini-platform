import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    resume: {
        type: String, // URL to uploaded resume
    },
    coverLetter: {
        type: String,
        maxlength: [1000, 'Cover letter cannot exceed 1000 characters'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Shortlisted', 'Rejected', 'Accepted'],
        default: 'Pending',
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
});

const jobSchema = new mongoose.Schema(
    {
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
        },
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
        },
        jobType: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
            required: true,
        },
        description: {
            type: String,
            required: [true, 'Job description is required'],
        },
        requirements: {
            type: String,
            required: [true, 'Requirements are required'],
        },
        skills: {
            type: [String],
            default: [],
        },
        salary: {
            type: String,
        },
        applicationDeadline: {
            type: Date,
        },
        applyLink: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['Open', 'Closed'],
            default: 'Open',
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        applications: [jobApplicationSchema],
    },
    {
        timestamps: true,
    }
);

// Indexes
jobSchema.index({ postedBy: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ isApproved: 1 });
jobSchema.index({ title: 'text', company: 'text', description: 'text' });
jobSchema.index({ skills: 1 });

// Virtual for application count
jobSchema.virtual('applicationCount').get(function () {
    return this.applications.length;
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
