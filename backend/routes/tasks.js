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
            filter.available_workers = { $gt: 0 };
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
        const { title, description, payable_amount, required_workers, category, submission_info, deadline, task_image_url } = req.body;

        // Calculate total cost
        const totalCost = payable_amount * required_workers;

        // Check if buyer has enough coins
        if (req.user.coins < totalCost) {
            return res.status(400).json({
                error: 'Not available Coin. Purchase Coin'
            });
        }

        // Create task
        const task = new Task({
            title,
            description,
            buyer: req.user._id,
            payable_amount,
            required_workers,
            available_workers: required_workers,
            category,
            submission_info,
            deadline,
            task_image_url
        });

        await task.save();

        // Deduct coins from buyer
        req.user.coins -= totalCost;
        req.user.createdTasks += 1;
        req.user.totalSpent += totalCost;
        await req.user.save();

        res.status(201).json({
            message: 'Task created successfully',
            task,
            remainingCoins: req.user.coins
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

        if (task.buyer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const {
            title,
            description,
            payable_amount,
            required_workers,
            category,
            submission_info,
            deadline,
            task_image_url
        } = req.body;

        const nextRequiredWorkers = required_workers !== undefined ? Number(required_workers) : task.required_workers;
        const nextPayableAmount = payable_amount !== undefined ? Number(payable_amount) : task.payable_amount;

        if (Number.isNaN(nextRequiredWorkers) || nextRequiredWorkers < 1) {
            return res.status(400).json({ error: 'Required workers must be at least 1' });
        }

        if (Number.isNaN(nextPayableAmount) || nextPayableAmount < 1) {
            return res.status(400).json({ error: 'Payable amount must be at least 1' });
        }

        if (nextRequiredWorkers < task.submissionCount) {
            return res.status(400).json({ error: 'Required workers cannot be less than current submissions' });
        }

        const oldTotalCost = task.required_workers * task.payable_amount;
        const newTotalCost = nextRequiredWorkers * nextPayableAmount;
        const delta = newTotalCost - oldTotalCost;

        if (delta > 0 && req.user.coins < delta) {
            return res.status(400).json({ error: 'Not available Coin. Purchase Coin' });
        }

        task.title = title !== undefined ? title : task.title;
        task.description = description !== undefined ? description : task.description;
        task.payable_amount = nextPayableAmount;
        task.required_workers = nextRequiredWorkers;
        task.available_workers = nextRequiredWorkers - task.submissionCount;
        task.category = category !== undefined ? category : task.category;
        task.submission_info = submission_info !== undefined ? submission_info : task.submission_info;
        task.deadline = deadline !== undefined ? deadline : task.deadline;
        task.task_image_url = task_image_url !== undefined ? task_image_url : task.task_image_url;

        await task.save();

        if (delta !== 0) {
            req.user.coins -= delta;
            req.user.totalSpent = Math.max(0, req.user.totalSpent + delta);
            await req.user.save();
        }

        res.json({
            message: 'Task updated successfully',
            task,
            remainingCoins: req.user.coins
        });
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

        // Calculate refill amount: (required_workers * payable_amount) logic
        // Only refill for the slots that hasn't been COMPLETED/APPROVED.
        // Based on user: "Increase the coin for unCompleted tasks"
        const remainingSlots = task.required_workers - task.approvedCount;
        const refillAmount = remainingSlots * task.payable_amount;

        await task.deleteOne();

        // Refill buyer coins
        req.user.coins += refillAmount;
        await req.user.save();

        res.json({
            message: 'Task deleted successfully',
            refillAmount,
            remainingCoins: req.user.coins
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get buyer's own tasks
router.get('/buyer/my-tasks', auth, authorize('buyer'), async (req, res) => {
    try {
        const tasks = await Task.find({ buyer: req.user._id })
            .sort({ deadline: -1 }); // Show in descending order based on compilation/deadline

        res.json({ tasks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete any task (Admin only)
router.delete('/admin/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted by Admin successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
