const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    task_title: String,
    payable_amount: Number,
    worker_email: String,
    worker_name: String,
    Buyer_name: String,
    Buyer_email: String,
    submission_details: {
        type: String,
        required: [true, 'Submission details are required']
    },
    current_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reviewNote: {
        type: String,
        default: ''
    },
    reviewedAt: {
        type: Date
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Prevent duplicate submissions for same task by same worker
submissionSchema.index({ task: 1, worker: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
