const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
    worker_email: {
        type: String,
        required: true
    },
    worker_name: {
        type: String,
        required: true
    },
    worker_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    withdrawal_coin: {
        type: Number,
        required: true,
        min: 200
    },
    withdrawal_amount: {
        type: Number,
        required: true
    },
    payment_system: {
        type: String,
        required: true,
        enum: ['Stripe', 'Bkash', 'Rocket', 'Nagad', 'Others']
    },
    account_number: {
        type: String,
        required: true
    },
    withdraw_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
