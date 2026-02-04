const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

// Get all tasks (with filters)
router.get('/', auth, async (req, res) => {
    try {
        const { status, category, search } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (category) filter.category = category;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Workers see only active tasks with available slots
        if (req.user.role === 'worker') {
            filter.status = 'active';
            filter.availableSlots = { $gt: 0 };
            filter.deadline = { $gte: new Date() };
        }

        const tasks = await Task.find(filter)
            .populate('buyer', 'name email')
            .sort({ createdAt: -1 });

        res.json({ tasks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('buyer', 'name email');

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create task (Buyer only)
router.post('/', auth, authorize('buyer'), async (req, res) => {
    try {
        const { title, description, rewardPerTask, totalSlots, category, requirements, deadline } = req.body;

        // Calculate total cost
        const totalCost = rewardPerTask * totalSlots;

        // Check if buyer has enough coins
        if (req.user.coins < totalCost) {
            return res.status(400).json({
                error: 'Insufficient coins. Please purchase more coins.'
            });
        }

        // Create task
        const task = new Task({
            title,
            description,
            buyer: req.user._id,
            rewardPerTask,
            totalSlots,
            category,
            requirements,
            deadline
        });

        await task.save();

        // Deduct coins from buyer
        req.user.coins -= totalCost;
        req.user.createdTasks += 1;
        req.user.totalSpent += totalCost;
        await req.user.save();

        res.status(201).json({
            message: 'Task created successfully',
            task
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update task (Buyer only - own tasks)
router.patch('/:id', auth, authorize('buyer'), async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Check if user owns this task
        if (task.buyer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const allowedUpdates = ['title', 'description', 'requirements', 'status', 'deadline'];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ error: 'Invalid updates' });
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete task (Buyer only - own tasks)
router.delete('/:id', auth, authorize('buyer'), async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (task.buyer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Can only delete if no approved submissions
        if (task.approvedCount > 0) {
            return res.status(400).json({
                error: 'Cannot delete task with approved submissions'
            });
        }

        await task.deleteOne();
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get buyer's own tasks
router.get('/buyer/my-tasks', auth, authorize('buyer'), async (req, res) => {
    try {
        const tasks = await Task.find({ buyer: req.user._id })
            .sort({ createdAt: -1 });

        res.json({ tasks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
