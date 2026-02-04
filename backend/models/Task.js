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
    rewardPerTask: {
        type: Number,
        required: [true, 'Reward amount is required'],
        min: 1
    },
    totalSlots: {
        type: Number,
        required: [true, 'Total slots is required'],
        min: 1
    },
    availableSlots: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['survey', 'data-entry', 'testing', 'review', 'social-media', 'other'],
        default: 'other'
    },
    requirements: {
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

// Initialize availableSlots to totalSlots before saving
taskSchema.pre('save', function (next) {
    if (this.isNew) {
        this.availableSlots = this.totalSlots;
    }
    next();
});

module.exports = mongoose.model('Task', taskSchema);
