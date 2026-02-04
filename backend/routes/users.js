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
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user role (Admin only)
router.patch('/:id/role', auth, authorize('admin'), async (req, res) => {
    try {
        const { role } = req.body;
        if (!['admin', 'buyer', 'worker'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get platform statistics
router.get('/stats', auth, async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const totalWorkers = await User.countDocuments({ role: 'worker' });
            const totalBuyers = await User.countDocuments({ role: 'buyer' });

            // Total available coin (sum of all users coin)
            const users = await User.find({});
            const totalAvailableCoins = users.reduce((sum, user) => sum + (user.coins || 0), 0);

            // Total payments (sum of all approved withdrawal request amounts)
            const approvedWithdrawals = await Withdrawal.find({ status: 'approved' });
            const totalPayments = approvedWithdrawals.reduce((sum, w) => sum + (w.withdrawal_amount || 0), 0);

            return res.json({
                stats: {
                    totalWorkers,
                    totalBuyers,
                    totalAvailableCoins,
                    totalPayments
                }
            });
        } else if (req.user.role === 'worker') {
            const totalSubmissions = await Submission.countDocuments({ worker: req.user._id });
            const totalPendingSubmissions = await Submission.countDocuments({ worker: req.user._id, status: 'pending' });

            const approvedSubmissions = await Submission.find({ worker: req.user._id, status: 'approved' });
            const totalEarnings = approvedSubmissions.reduce((sum, sub) => sum + (sub.payable_amount || 0), 0);

            return res.json({
                stats: {
                    totalSubmissions,
                    totalPendingSubmissions,
                    totalEarnings
                }
            });
        } else if (req.user.role === 'buyer') {
            // Add buyer stats if needed later
            res.json({ message: 'Buyer stats not implemented yet' });
        }
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
        const filter = { toEmail: req.user.email };

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
