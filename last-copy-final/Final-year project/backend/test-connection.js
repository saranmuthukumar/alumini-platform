import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
    console.log('🔍 Starting Database Connection Diagnostics...');

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI is missing in .env');
        process.exit(1);
    }

    // Extract hostname
    const match = uri.match(/@([^/?]+)/);
    if (!match) {
        console.error('❌ Could not parse hostname from URI');
        process.exit(1);
    }
    const hostname = match[1];
    console.log(`📡 Target Hostname: ${hostname}`);

    // DNS Check
    try {
        console.log('... Resolving DNS');
        // Simple DNS lookup
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });

        console.log('✅ MongoDB Connected Successfully!');
        // We can access conn.connection.host here if needed, but connection success is enough

        await mongoose.disconnect();
        console.log('✅ Test completed successfully');
        process.exit(0);
    } catch (error) {
        console.error(`❌ Connection Failed!`);
        console.error(`Error Name: ${error.name}`);
        console.error(`Error Message: ${error.message}`);

        if (error.code === 8000 || error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
            console.log('\n⚠️  AUTHENTICATION FAILED');
            console.log('   The IP is allowed, but the Username or Password is incorrect.');
            console.log('   1. Check your .env file: MONGODB_URI');
            console.log('   2. Verify the username "saranmuthukumark_db_user" exists in Atlas.');
            console.log('   3. Reset the password in Atlas -> Database Access -> Edit User.');
        } else if (error.name === 'MongoNetworkError' || error.message.includes('timed out')) {
            console.log('\n⚠️  NETWORK ERROR - Still blocked?');
            console.log('   Ensure your IP (or 0.0.0.0/0) is active in Network Access.');
        }
        process.exit(1);
    }
};

testConnection();
