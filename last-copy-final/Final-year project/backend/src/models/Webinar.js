import mongoose from 'mongoose';

const webinarRegistrationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    attended: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    feedback: {
        type: String,
        maxlength: [500, 'Feedback cannot exceed 500 characters'],
    },
    registeredAt: {
        type: Date,
        default: Date.now,
    },
});

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['PDF', 'Link', 'Recording', 'Other'],
        default: 'Link',
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

const webinarSchema = new mongoose.Schema(
    {
        hostId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        topic: {
            type: String,
            required: [true, 'Topic is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        dateTime: {
            type: Date,
            required: [true, 'Date and time are required'],
        },
        duration: {
            type: Number, // in minutes
            required: [true, 'Duration is required'],
            min: [15, 'Duration must be at least 15 minutes'],
        },
        targetAudience: {
            type: String,
            enum: ['All', 'Students', 'Alumni', 'Students+Alumni'],
            default: 'All',
        },
        status: {
            type: String,
            enum: ['Scheduled', 'Live', 'Completed', 'Cancelled'],
            default: 'Scheduled',
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        registrations: [webinarRegistrationSchema],
        resources: [resourceSchema],
        maxParticipants: {
            type: Number,
            default: 100,
        },
        meetingLink: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
webinarSchema.index({ hostId: 1 });
webinarSchema.index({ dateTime: 1 });
webinarSchema.index({ status: 1 });
webinarSchema.index({ isApproved: 1 });
webinarSchema.index({ targetAudience: 1 });

// Virtual for registration count
webinarSchema.virtual('registrationCount').get(function () {
    return this.registrations.length;
});

const Webinar = mongoose.model('Webinar', webinarSchema);

export default Webinar;
