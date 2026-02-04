const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminData = {
            name: 'System Admin',
            email: 'admin@microtask.com',
            password: 'admin@micro',
            role: 'admin',
            coins: 0,
            profileImage: 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff'
        };

        console.log('Checking for existing user...');
        const existingUser = await User.findOne({ email: adminData.email });
        console.log('Search completed. Found:', existingUser ? 'Yes' : 'No');

        if (existingUser) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        console.log('Creating new User instance...');
        const admin = new User(adminData);
        console.log('User instance created. Saving...');

        await admin.save();
        console.log('Save completed successfully');

        console.log('Admin user created successfully');
        console.log('Email:', adminData.email);
        console.log('Password:', adminData.password);

        process.exit(0);
    } catch (error) {
        console.error('--- ERROR CAUGHT ---');
        if (error.name === 'ValidationError') {
            console.error('Validation Error Details:', JSON.stringify(error.errors, null, 2));
        } else {
            console.error('Full Error Object:', error);
            if (error.stack) console.error('Stack Trace:', error.stack);
        }
        process.exit(1);
    }
};

createAdmin();
