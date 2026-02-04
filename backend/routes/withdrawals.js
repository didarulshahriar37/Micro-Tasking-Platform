const express = require('express');
const router = express.Router();
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { auth, authorize } = require('../middleware/auth');

// Create withdrawal request (Worker only)
router.post('/', auth, authorize('worker'), async (req, res) => {
    try {
        const { withdrawal_coin, withdrawal_amount, payment_system, account_number } = req.body;

        if (withdrawal_coin < 200) {
            return res.status(400).json({ error: 'Minimum withdrawal is 200 coins' });
        }

        if (req.user.coins < withdrawal_coin) {
            return res.status(400).json({ error: 'Insufficient coins' });
        }

        const withdrawal = new Withdrawal({
            worker_email: req.user.email,
            worker_name: req.user.name,
            worker_id: req.user._id,
            withdrawal_coin,
            withdrawal_amount,
            payment_system,
            account_number,
            status: 'pending'
        });

        await withdrawal.save();

        res.status(201).json({
            message: 'Withdrawal request submitted successfully',
            withdrawal
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get worker's withdrawals
router.get('/my', auth, authorize('worker'), async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find({ worker_id: req.user._id })
            .sort({ createdAt: -1 });
        res.json({ withdrawals });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all withdrawals (Admin only)
router.get('/', auth, authorize('admin'), async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find()
            .sort({ createdAt: -1 });
        res.json({ withdrawals });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve withdrawal / Payment Success (Admin only)
router.patch('/:id/approve', auth, authorize('admin'), async (req, res) => {
    try {
        const withdrawal = await Withdrawal.findById(req.params.id);
        if (!withdrawal) return res.status(404).json({ error: 'Withdrawal request not found' });
        if (withdrawal.status !== 'pending') {
            return res.status(400).json({ error: 'Withdrawal request is already processed' });
        }

        const worker = await User.findById(withdrawal.worker_id);
        if (!worker) return res.status(404).json({ error: 'Worker not found' });

        if (worker.coins < withdrawal.withdrawal_coin) {
            return res.status(400).json({ error: 'Worker has insufficient coins' });
        }

        // Update withdrawal status
        withdrawal.status = 'approved';
        await withdrawal.save();

        // Deduct coins from worker
        worker.coins -= withdrawal.withdrawal_coin;
        await worker.save();

        // Create notification for worker
        await Notification.create({
            user: worker._id,
            toEmail: worker.email,
            title: 'Withdrawal Approved',
            message: `Your withdrawal request for ${withdrawal.withdrawal_amount}$ has been approved by the admin`,
            type: 'payment',
            actionRoute: '/worker'
        });

        res.json({ message: 'Withdrawal approved and coins deducted', withdrawal, workerCoins: worker.coins });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
