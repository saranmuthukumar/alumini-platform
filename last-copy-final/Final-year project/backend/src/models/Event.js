import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    attended: {
        type: Boolean,
        default: false,
    },
    registeredAt: {
        type: Date,
        default: Date.now,
    },
});

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        category: {
            type: String,
            enum: ['Alumni Meet', 'Career Talk', 'Technical Workshop', 'Other', 'Networking', 'Workshop', 'Career', 'Cultural', 'Sports', 'Academic', 'Seminar', 'Career Fair'],
            required: [true, 'Category is required'],
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
            type: Number,
            default: 2,
        },
        venue: {
            type: String,
        },
        location: {
            type: String,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        registrations: [eventRegistrationSchema],
        maxParticipants: {
            type: Number,
            default: 200,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        bannerImage: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
eventSchema.index({ dateTime: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ isActive: 1 });

// Virtual for registration count
eventSchema.virtual('registrationCount').get(function () {
    return this.registrations.length;
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
