const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, profileImage } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Validate role
        if (role && !['worker', 'buyer'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Use worker or buyer.' });
        }

        // Input Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Password strength: at least 6 chars, one uppercase, one number
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long and include an uppercase letter and a number.' });
        }

        // Set default coins based on role
        const coins = role === 'buyer' ? 50 : 10;

        // Create new user
        const user = new User({
            name,
            email,
            password,
            role: role || 'worker',
            profileImage: profileImage || '',
            coins
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                coins: user.coins,
                profileImage: user.profileImage
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Google Login/Register
router.post('/google-login', async (req, res) => {
    try {
        const { name, email, profileImage } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            // New user via Google (Default role: worker)
            user = new User({
                name,
                email,
                profileImage,
                password: Math.random().toString(36).slice(-10) + 'A1!', // Dummy password
                role: 'worker',
                coins: 10 // Worker default
            });
            await user.save();
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ error: 'Account is deactivated' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                coins: user.coins,
                profileImage: user.profileImage
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ error: 'Account is deactivated' });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                coins: user.coins
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                coins: req.user.coins,
                profileImage: req.user.profileImage,
                completedTasks: req.user.completedTasks,
                totalEarnings: req.user.totalEarnings,
                createdTasks: req.user.createdTasks,
                totalSpent: req.user.totalSpent
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
