const mongoose = require('mongoose');
require('dotenv').config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = require('./models/User');

        const users = await User.find({}, 'name email role');
        console.log('--- Current Users ---');
        console.log(JSON.stringify(users, null, 2));
        console.log('---------------------');

        process.exit(0);
    } catch (err) {
        console.error('Failed to list users:', err);
        process.exit(1);
    }
};

listUsers();
