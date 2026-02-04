const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Task description is required']
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    payable_amount: {
        type: Number,
        required: [true, 'Payable amount is required'],
        min: 1
    },
    required_workers: {
        type: Number,
        required: [true, 'Required workers count is required'],
        min: 1
    },
    available_workers: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['survey', 'data-entry', 'testing', 'review', 'social-media', 'other'],
        default: 'other'
    },
    submission_info: {
        type: String,
        default: ''
    },
    task_image_url: {
        type: String,
        default: ''
    },
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'completed', 'cancelled'],
        default: 'active'
    },
    submissionCount: {
        type: Number,
        default: 0
    },
    approvedCount: {
        type: Number,
        default: 0
    },
    rejectedCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Initialize available_workers to required_workers before saving
taskSchema.pre('save', function (next) {
    if (this.isNew) {
        this.available_workers = this.required_workers;
    }
    next();
});

module.exports = mongoose.model('Task', taskSchema);
