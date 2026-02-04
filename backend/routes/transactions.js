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

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Purchase coins - Create Stripe Checkout Session
router.post('/create-checkout-session', auth, authorize('buyer'), async (req, res) => {
    try {
        const { coins, price } = req.body;

        if (!coins || !price) {
            return res.status(400).json({ error: 'Missing package information' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${coins} Coins Package`,
                            description: `Purchase ${coins} coins for your MicroTask account`,
                        },
                        unit_amount: Math.round(price * 100), // Stripe expects amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/buyer/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/buyer/purchase-coin`,
            customer_email: req.user.email,
            metadata: {
                userId: req.user._id.toString(),
                coins: coins.toString(),
                price: price.toString()
            }
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe Session Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify Stripe Session (Fallback for local webhooks)
router.get('/verify-session/:sessionId', auth, async (req, res) => {
    try {
        const { sessionId } = req.params;
        console.log(`🔍 Verifying Stripe Session: ${sessionId}`);

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log(`📊 Session Status: ${session.payment_status}`);
        console.log(`📦 Metadata:`, session.metadata);

        if (session.payment_status === 'paid') {
            const { userId, coins } = session.metadata;

            if (!userId || !coins) {
                console.error('❌ Missing metadata in Stripe session');
                return res.status(400).json({ error: 'Missing session metadata' });
            }

            // Check if transaction already exists
            const existingTx = await Transaction.findOne({ description: new RegExp(sessionId) });
            if (existingTx) {
                console.log('ℹ️ Coins already delivered for this session');
                return res.json({ message: 'Coins already delivered', newBalance: req.user.coins });
            }

            const user = await User.findById(userId);
            if (!user) {
                console.error(`❌ User not found: ${userId}`);
                return res.status(404).json({ error: 'User not found' });
            }

            const balanceBefore = user.coins;
            user.coins += parseInt(coins);
            await user.save();
            console.log(`✅ Success: Added ${coins} coins to ${user.email}`);

            // Create transaction record
            const transaction = await Transaction.create({
                user: user._id,
                type: 'purchase',
                amount: parseInt(coins),
                description: `Stripe Success (Session: ${sessionId})`,
                status: 'completed',
                balanceBefore,
                balanceAfter: user.coins
            });

            return res.json({
                message: 'Payment verified and coins delivered!',
                newBalance: user.coins,
                transaction
            });
        }

        console.warn(`⚠️ Payment status is not paid: ${session.payment_status}`);
        res.status(400).json({ error: 'Payment not completed or still processing' });
    } catch (error) {
        console.error('❌ Verify Session Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Purchase coins (Buyer only) - DEPRECATED for real Stripe (kept for reference or manual fallback)
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
