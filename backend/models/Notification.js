const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    toEmail: {
        type: String,
        required: true
    },
    actionRoute: {
        type: String,
        default: '/dashboard'
    },
    type: {
        type: String,
        enum: ['task', 'submission', 'payment', 'system', 'report'],
        default: 'system'
    },
    relatedTask: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    relatedSubmission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission'
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
