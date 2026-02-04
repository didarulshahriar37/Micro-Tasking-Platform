const mongoose = require('mongoose');
require('dotenv').config();

const promoteUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = require('./models/User');

        const email = 'admin@microtask.com';
        console.log(`Promoting user: ${email} to admin...`);

        const result = await User.updateOne(
            { email: email },
            { $set: { role: 'admin' } }
        );

        if (result.matchedCount === 0) {
            console.log('No user found with that email.');
        } else if (result.modifiedCount === 0) {
            console.log('User is already an admin.');
        } else {
            console.log('Successfully promoted to admin!');
        }

        process.exit(0);
    } catch (err) {
        console.error('Promotion failed:', err);
        process.exit(1);
    }
};

promoteUser();
