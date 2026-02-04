const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const Submission = require('../models/Submission');
const Notification = require('../models/Notification');
const { auth, authorize } = require('../middleware/auth');

// Get top 6 workers (Public)
router.get('/best', async (req, res) => {
    try {
        const workers = await User.find({ role: 'worker' })
            .sort({ coins: -1 })
            .limit(6)
            .select('name profileImage coins availableCoins'); // Select necessary fields

        res.json({ workers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all users (Admin only)
router.get('/', auth, authorize('admin'), async (req, res) => {
    try {
        const { role, isActive } = req.query;
        const filter = {};

        if (role) filter.role = role;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get platform statistics (Admin only)
router.get('/stats', auth, authorize('admin'), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalWorkers = await User.countDocuments({ role: 'worker' });
        const totalBuyers = await User.countDocuments({ role: 'buyer' });
        const totalTasks = await Task.countDocuments();
        const activeTasks = await Task.countDocuments({ status: 'active' });
        const totalSubmissions = await Submission.countDocuments();
        const pendingSubmissions = await Submission.countDocuments({ status: 'pending' });

        res.json({
            stats: {
                totalUsers,
                totalWorkers,
                totalBuyers,
                totalTasks,
                activeTasks,
                totalSubmissions,
                pendingSubmissions
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Toggle user active status (Admin only)
router.patch('/:id/toggle-status', auth, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user notifications
router.get('/notifications', auth, async (req, res) => {
    try {
        const { limit = 20, unreadOnly } = req.query;
        const filter = { user: req.user._id };

        if (unreadOnly === 'true') {
            filter.isRead = false;
        }

        const notifications = await Notification.find(filter)
            .populate('relatedTask', 'title')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        const unreadCount = await Notification.countDocuments({
            user: req.user._id,
            isRead: false
        });

        res.json({ notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark notification as read
router.patch('/notifications/:id/read', auth, async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        notification.isRead = true;
        await notification.save();

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark all notifications as read
router.patch('/notifications/read-all', auth, async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { isRead: true }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
