const mongoose = require('mongoose');
require('dotenv').config();
const Task = require('./models/Task');
const User = require('./models/User');

const seedTasks = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const buyer = await User.findOne({ role: 'buyer' });
        if (!buyer) {
            console.error('No buyer found to assign tasks to!');
            process.exit(1);
        }

        // Clear existing tasks to avoid duplicates and refresh images
        await Task.deleteMany({});
        console.log('Cleared existing tasks');

        const taskTemplates = [
            {
                title: 'Watch YouTube Video & Subscribe',
                description: 'Watch the full video, hit the subscribe button, and turn on notifications.',
                payable_amount: 10,
                required_workers: 20,
                category: 'social-media',
                submission_info: 'Provide your channel name and a screenshot of the subscription.',
                imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800'
            },
            {
                title: 'Website Testing - Home Page',
                description: 'Visit our new home page and find three bugs or UI issues.',
                payable_amount: 50,
                required_workers: 5,
                category: 'testing',
                submission_info: 'List the issues found and provide screenshots.',
                imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'
            },
            {
                title: 'Market Research Survey',
                description: 'Fill out this quick survey about your shopping habits.',
                payable_amount: 15,
                required_workers: 50,
                category: 'survey',
                submission_info: 'Enter the completion code shown at the end of the survey.',
                imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
            },
            {
                title: 'Data Entry - Product List',
                description: 'Copy product details from the Provided PDF into an Excel sheet.',
                payable_amount: 5,
                required_workers: 100,
                category: 'data-entry',
                submission_info: 'Upload the completed Excel file.',
                imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800'
            },
            {
                title: 'Leave a Review for Our App',
                description: 'Download the app, use it for 5 minutes, and leave an honest review on the Play Store.',
                payable_amount: 25,
                required_workers: 15,
                category: 'review',
                submission_info: 'Provide your Play Store username and a screenshot of the review.',
                imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800'
            }
        ];

        const tasksCount = 30;
        const newTasks = [];

        for (let i = 0; i < tasksCount; i++) {
            const template = taskTemplates[i % taskTemplates.length];
            const deadline = new Date();
            deadline.setDate(deadline.getDate() + 7 + (i % 30)); // 7 to 37 days from now

            newTasks.push({
                ...template,
                title: `${template.title} #${i + 1}`,
                buyer: buyer._id,
                available_workers: template.required_workers,
                deadline,
                task_image_url: template.imageUrl // Use category-relevant image
            });
        }

        await Task.insertMany(newTasks);
        console.log(`Successfully added ${tasksCount} tasks!`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding tasks:', error);
        process.exit(1);
    }
};

seedTasks();
