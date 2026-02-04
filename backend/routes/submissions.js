const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Task = require('../models/Task');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const { auth, authorize } = require('../middleware/auth');

// Get all submissions (filtered by role)
router.get('/', auth, async (req, res) => {
    try {
        let filter = {};

        if (req.user.role === 'worker') {
            filter.worker = req.user._id;
        } else if (req.user.role === 'buyer') {
            const buyerTasks = await Task.find({ buyer: req.user._id }).select('_id');
            filter.task = { $in: buyerTasks.map(t => t._id) };
        }

        const submissions = await Submission.find(filter)
            .populate('task', 'title rewardPerTask')
            .populate('worker', 'name email')
            .sort({ createdAt: -1 });

        res.json({ submissions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit a task (Worker only)
router.post('/', auth, authorize('worker'), async (req, res) => {
    try {
        const { taskId, submissionDetails, attachments } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Check if task is active and has available slots
        if (task.status !== 'active') {
            return res.status(400).json({ error: 'Task is not active' });
        }

        if (task.availableSlots <= 0) {
            return res.status(400).json({ error: 'No available slots' });
        }

        // Check deadline
        if (new Date() > task.deadline) {
            return res.status(400).json({ error: 'Task deadline has passed' });
        }

        // Create submission
        const submission = new Submission({
            task: taskId,
            worker: req.user._id,
            submissionDetails,
            attachments: attachments || []
        });

        await submission.save();

        // Update task
        task.availableSlots -= 1;
        task.submissionCount += 1;
        await task.save();

        // Create notification for buyer
        await Notification.create({
            user: task.buyer,
            title: 'New Task Submission',
            message: `A worker has submitted your task: ${task.title}`,
            type: 'submission',
            relatedTask: task._id,
            relatedSubmission: submission._id
        });

        res.status(201).json({
            message: 'Task submitted successfully',
            submission
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'You have already submitted this task' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Review submission (Buyer only)
router.patch('/:id/review', auth, authorize('buyer'), async (req, res) => {
    try {
        const { status, reviewNote } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const submission = await Submission.findById(req.params.id)
            .populate('task')
            .populate('worker');

        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        // Check if buyer owns the task
        if (submission.task.buyer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Check if already reviewed
        if (submission.status !== 'pending') {
            return res.status(400).json({ error: 'Submission already reviewed' });
        }

        // Update submission
        submission.status = status;
        submission.reviewNote = reviewNote || '';
        submission.reviewedAt = new Date();
        submission.reviewedBy = req.user._id;
        await submission.save();

        // Update task stats
        if (status === 'approved') {
            submission.task.approvedCount += 1;

            // Pay worker
            const worker = submission.worker;
            const reward = submission.task.rewardPerTask;

            worker.coins += reward;
            worker.completedTasks += 1;
            worker.totalEarnings += reward;
            await worker.save();

            // Create transaction for worker
            await Transaction.create({
                user: worker._id,
                type: 'earning',
                amount: reward,
                description: `Earned from task: ${submission.task.title}`,
                relatedTask: submission.task._id,
                relatedSubmission: submission._id,
                balanceBefore: worker.coins - reward,
                balanceAfter: worker.coins
            });

            // Create notification for worker
            await Notification.create({
                user: worker._id,
                title: 'Submission Approved',
                message: `Your submission for "${submission.task.title}" has been approved! You earned ${reward} coins.`,
                type: 'submission',
                relatedTask: submission.task._id,
                relatedSubmission: submission._id
            });
        } else {
            submission.task.rejectedCount += 1;
            submission.task.availableSlots += 1; // Return slot

            // Create notification for worker
            await Notification.create({
                user: submission.worker._id,
                title: 'Submission Rejected',
                message: `Your submission for "${submission.task.title}" has been rejected.`,
                type: 'submission',
                relatedTask: submission.task._id,
                relatedSubmission: submission._id
            });
        }

        await submission.task.save();

        res.json({
            message: `Submission ${status}`,
            submission
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
