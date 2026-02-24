import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Create indexes after connection
        await createIndexes();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

const createIndexes = async () => {
    try {
        // Import models (they will register themselves)
        await import('../models/User.js');
        await import('../models/AlumniProfile.js');
        await import('../models/StudentProfile.js');
        await import('../models/Webinar.js');
        await import('../models/Event.js');
        await import('../models/Job.js');
        await import('../models/Donation.js');

        console.log('✅ Database indexes created successfully');
    } catch (error) {
        console.error('⚠️  Error creating indexes:', error.message);
    }
};

export default connectDB;
