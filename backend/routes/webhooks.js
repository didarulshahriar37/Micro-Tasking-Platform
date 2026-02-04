const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Path is /api/webhooks
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`❌ Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Fulfill the purchase
        const { userId, coins, price } = session.metadata;

        try {
            const user = await User.findById(userId);
            if (user) {
                const balanceBefore = user.coins;
                user.coins += parseInt(coins);
                await user.save();

                // Record the completed transaction
                await Transaction.create({
                    user: user._id,
                    type: 'purchase',
                    amount: parseInt(coins),
                    description: `Stripe Purchase: ${coins} coins`,
                    status: 'completed',
                    balanceBefore,
                    balanceAfter: user.coins
                });

                console.log(`✅ Coins delivered to user ${userId}`);
            }
        } catch (error) {
            console.error('❌ Error updating user coins via webhook:', error);
            return res.status(500).end();
        }
    }

    res.json({ received: true });
});

module.exports = router;
