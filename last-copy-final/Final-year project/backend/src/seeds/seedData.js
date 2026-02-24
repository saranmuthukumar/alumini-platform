import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import AlumniProfile from '../models/AlumniProfile.js';
import StudentProfile from '../models/StudentProfile.js';
import Job from '../models/Job.js';
import { ROLES } from '../utils/constants.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await AlumniProfile.deleteMany({});
        await StudentProfile.deleteMany({});
        await Job.deleteMany({}); // Also clear jobs
        console.log('🗑️  Cleared existing data');

        // Create Admin
        await User.create({
            email: 'admin@university.edu',
            password: 'Admin@123',
            role: ROLES.ADMIN,
            isVerified: true,
            isActive: true,
        });
        console.log('👤 Admin created');

        // Create Coordinator
        await User.create({
            email: 'coordinator@university.edu',
            password: 'Coordinator@123',
            role: ROLES.COORDINATOR,
            isVerified: true,
            isActive: true,
        });
        console.log('👤 Coordinator created');

        // Create Sample Alumni (John Doe only)
        const alumni1User = await User.create({
            email: 'john.doe@alumni.edu',
            password: 'Alumni@123',
            role: ROLES.ALUMNI,
            isVerified: true,
            isActive: true,
        });

        await AlumniProfile.create({
            userId: alumni1User._id,
            name: 'John Doe',
            batch: '2018',
            department: 'Computer Science',
            currentRole: 'Senior Software Engineer',
            organization: 'Google',
            skills: ['JavaScript', 'Python', 'Cloud Computing', 'Machine Learning'],
            careerDomain: 'Software Development',
            linkedin: 'https://linkedin.com/in/johndoe',
            bio: 'Passionate software engineer with 5+ years of experience in full-stack development.',
            privacyLevel: 'Public',
            isApproved: true,
        });
        console.log('👤 Alumni 1 created (John Doe)');

        // Note: Students removed as per request to "remove all sample data except alumni"
        // However, keeping one student might be useful for testing job applications?
        // User said "remove all sample data expect alumini username and password".
        // I will strictly follow this and NOT create students.
        // If they need a student to test applying, they can register one or ask to add it back.

        console.log('✅ Database seeded successfully!');
        console.log('\n📋 Credentials:');
        console.log('-----------------------------------');
        console.log('Admin: admin@university.edu / Admin@123');
        console.log('Coordinator: coordinator@university.edu / Coordinator@123');
        console.log('Alumni: john.doe@alumni.edu / Alumni@123');
        console.log('-----------------------------------\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
