const express = require('express');
const router = express.Router();
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
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

module.exports = router;
