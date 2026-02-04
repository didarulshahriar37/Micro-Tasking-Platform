const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

async function testRegister() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/micro-tasking-platform');
        console.log('Connected to MongoDB');

        const userData = {
            name: 'Test User',
            email: 'test' + Date.now() + '@example.com',
            password: 'Password123',
            role: 'worker'
        };

        console.log('Creating user...');
        const user = new User(userData);
        console.log('Saving user...');
        await user.save();
        console.log('User saved successfully!');

    } catch (error) {
        console.error('Registration failed:');
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
}

testRegister();
