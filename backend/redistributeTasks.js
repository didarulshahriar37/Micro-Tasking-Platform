const mongoose = require('mongoose');
require('dotenv').config();
const Task = require('./models/Task');
const User = require('./models/User');

const redistributeTasks = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Create 3 Buyers
        const buyersData = [
            { name: 'Tech Solutions', email: 'tech@solutions.com', password: 'password123', role: 'buyer', coins: 5000 },
            { name: 'Global Marketing', email: 'global@marketing.com', password: 'password123', role: 'buyer', coins: 5000 },
            { name: 'Creative Agency', email: 'creative@agency.com', password: 'password123', role: 'buyer', coins: 5000 }
        ];

        const buyers = [];
        for (const data of buyersData) {
            let buyer = await User.findOne({ email: data.email });
            if (!buyer) {
                buyer = new User(data);
                await buyer.save();
                console.log(`Created buyer: ${buyer.name}`);
            }
            buyers.push(buyer);
        }

        // 2. Clear existing tasks
        await Task.deleteMany({});
        console.log('Cleared existing tasks');

        // 3. Define Task Templates
        const templates = [
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
            }
        ];

        // 4. Generate 30 tasks distributed among buyers
        const tasksToInsert = [];
        for (let i = 0; i < 30; i++) {
            const template = templates[i % templates.length];
            const buyer = buyers[Math.floor(i / 10)]; // Distribute by tens
            const deadline = new Date();
            deadline.setDate(deadline.getDate() + 7 + (i % 20));

            tasksToInsert.push({
                ...template,
                title: `${template.title} #${i + 1}`,
                description: `${template.description} (Posted by ${buyer.name})`,
                buyer: buyer._id,
                available_workers: template.required_workers,
                deadline,
                task_image_url: template.imageUrl
            });
        }

        await Task.insertMany(tasksToInsert);
        console.log('Successfully distributed 30 tasks among 3 buyers!');
        process.exit(0);
    } catch (error) {
        console.error('Error redistributing tasks:', error);
        process.exit(1);
    }
};

redistributeTasks();
