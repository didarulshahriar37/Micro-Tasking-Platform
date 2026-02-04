const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

// Get user's transactions
router.get('/', auth, async (req, res) => {
    try {
        const { type, limit = 50 } = req.query;
        const filter = { user: req.user._id };

        if (type) filter.type = type;

        const transactions = await Transaction.find(filter)
            .populate('relatedTask', 'title')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({ transactions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Purchase coins (Buyer only)
router.post('/purchase', auth, authorize('buyer'), async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // In a real app, this would integrate with a payment gateway
        // For now, we'll just add coins directly
        const balanceBefore = req.user.coins;
        req.user.coins += amount;
        await req.user.save();

        // Create transaction record
        const transaction = await Transaction.create({
            user: req.user._id,
            type: 'purchase',
            amount,
            description: `Purchased ${amount} coins`,
            status: 'completed',
            balanceBefore,
            balanceAfter: req.user.coins
        });

        res.status(201).json({
            message: 'Coins purchased successfully',
            transaction,
            newBalance: req.user.coins
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Withdraw coins (Worker only)
router.post('/withdraw', auth, authorize('worker'), async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        if (req.user.coins < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Minimum withdrawal amount
        if (amount < 10) {
            return res.status(400).json({ error: 'Minimum withdrawal is 10 coins' });
        }

        const balanceBefore = req.user.coins;
        req.user.coins -= amount;
        await req.user.save();

        // Create transaction record
        const transaction = await Transaction.create({
            user: req.user._id,
            type: 'withdrawal',
            amount,
            description: `Withdrew ${amount} coins`,
            status: 'completed',
            balanceBefore,
            balanceAfter: req.user.coins
        });

        res.status(201).json({
            message: 'Withdrawal successful',
            transaction,
            newBalance: req.user.coins
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
