import React, { useEffect, useState } from 'react';
import MainLayout from '../components/MainLayout';
import { userService } from '../services/api';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import TestimonialSlider from '../components/TestimonialSlider';
import { motion } from 'framer-motion';
import WorkerSlider from '../components/WorkerSlider';

const Home = () => {
    const [bestWorkers, setBestWorkers] = useState([]);

    useEffect(() => {
        fetchBestWorkers();
    }, []);

    const fetchBestWorkers = async () => {
        try {
            const response = await userService.getBestWorkers();
            // Requirement: Top 6 workers
            setBestWorkers(response.data.workers ? response.data.workers.slice(0, 6) : []);
        } catch (error) {
            console.error('Error fetching best workers:', error);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <MainLayout>
            {/* Hero Section */}
            <HeroSlider />

            {/* Best Workers Section */}
            <section className="container" style={{ marginBottom: '80px', marginTop: '40px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center"
                    style={{ marginBottom: '40px' }}
                >

                    <h2 style={{ fontSize: '36px', marginTop: '10px', marginBottom: '16px', fontWeight: '700' }}>Workers of the Month</h2>
                    <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto' }}>Recognizing the top 6 dedicated members who achieved the highest earnings this month.</p>
                </motion.div>

                {bestWorkers.length > 0 ? (
                    <WorkerSlider workers={bestWorkers} />
                ) : (
                    <div className="card text-center" style={{ padding: '60px' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>Loading top workers...</p>
                    </div>
                )}
            </section>

            {/* Extra Section 1: How It Works */}
            <section id="how-it-works" style={{
                padding: '100px 0',
                marginBottom: '100px',
                position: 'relative',
                background: 'rgba(255,255,255,0.02)',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center"
                        style={{ marginBottom: '80px' }}
                    >

                        <h2 style={{ fontSize: '36px', marginTop: '10px', marginBottom: '16px', fontWeight: '700' }}>How It Works</h2>
                        <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto' }}>Simple steps to start your earning journey.</p>
                    </motion.div>

                    <div className="grid grid-3">
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="card text-center"
                            style={{ padding: '40px' }}
                        >
                            <div style={{
                                width: '100px', height: '100px', margin: '0 auto 30px',
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.2))',
                                borderRadius: '30px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '40px',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                color: '#818cf8'
                            }}>
                                📝
                            </div>
                            <h3 style={{ fontSize: '24px', marginBottom: '16px', fontWeight: '700' }}>1. Register</h3>
                            <p style={{ color: '#94a3b8', lineHeight: '1.7' }}>Create your free account in seconds. Choose to be a Worker or a Buyer.</p>
                        </motion.div>

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="card text-center"
                            style={{ padding: '40px' }}
                        >
                            <div style={{
                                width: '100px', height: '100px', margin: '0 auto 30px',
                                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(236, 72, 153, 0.2))',
                                borderRadius: '30px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '40px',
                                border: '1px solid rgba(236, 72, 153, 0.2)',
                                color: '#f472b6'
                            }}>
                                🔍
                            </div>
                            <h3 style={{ fontSize: '24px', marginBottom: '16px', fontWeight: '700' }}>2. Complete Info</h3>
                            <p style={{ color: '#94a3b8', lineHeight: '1.7' }}>Set up your profile and payment details to ensure smooth transactions.</p>
                        </motion.div>

                        <motion.div
                            initial={{ x: 30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="card text-center"
                            style={{ padding: '40px' }}
                        >
                            <div style={{
                                width: '100px', height: '100px', margin: '0 auto 30px',
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2))',
                                borderRadius: '30px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '40px',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                color: '#34d399'
                            }}>
                                💰
                            </div>
                            <h3 style={{ fontSize: '24px', marginBottom: '16px', fontWeight: '700' }}>3. Start Earning</h3>
                            <p style={{ color: '#94a3b8', lineHeight: '1.7' }}>Browse available tasks, complete them, and get paid instantly in coins.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="container" style={{ marginBottom: '120px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center"
                    style={{ marginBottom: '20px' }}
                >

                    <h2 style={{ fontSize: '36px', marginTop: '10px', marginBottom: '16px', fontWeight: '700' }}>Testimonials</h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
                        Join thousands of satisfied users who are earning and getting work done every day.
                    </p>
                </motion.div>

                <TestimonialSlider />
            </section>

            {/* Extra Section 2: Why Choose Us */}
            <section style={{
                padding: '100px 0',
                marginBottom: '0',
                position: 'relative',
                background: 'linear-gradient(to right, var(--bg-primary), var(--bg-secondary))',
                transition: 'background 0.3s ease'
            }}>
                <div className="container">
                    <div className="grid grid-2" style={{ alignItems: 'center', gap: '80px' }}>
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true }}
                        >
                            <h2 style={{ fontSize: '42px', marginTop: '10px', marginBottom: '30px', fontWeight: '800', lineHeight: 1.2, color: 'var(--text-primary)' }}>
                                Why Choose <span style={{ color: 'var(--primary-color)' }}>MicroTask?</span>
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '18px', lineHeight: 1.7 }}>
                                We provide the most secure and efficient platform for micro-tasking.
                                Our advanced fraud detection and automatic payment systems make earning worry-free.
                            </p>

                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ minWidth: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✓</div>
                                    <span style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Instant 24/7 Withdrawals</span>
                                </li>
                                <li style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ minWidth: '32px', height: '32px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✓</div>
                                    <span style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Verified Buyers & Workers</span>
                                </li>
                                <li style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ minWidth: '32px', height: '32px', borderRadius: '50%', background: 'rgba(236, 72, 153, 0.2)', color: '#f472b6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✓</div>
                                    <span style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Low Commission Structure</span>
                                </li>
                            </ul>

                            <Link to="/register" className="btn btn-primary" style={{ marginTop: '20px', padding: '14px 32px' }}>
                                Join Our Platform
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.7 }}
                            viewport={{ once: true }}
                            style={{ position: 'relative' }}
                        >
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                                filter: 'blur(40px)',
                                opacity: 0.3,
                                zIndex: 0
                            }}></div>
                            <img
                                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                                alt="Features"
                                style={{
                                    width: '100%',
                                    borderRadius: '24px',
                                    border: '1px solid var(--border-color)',
                                    position: 'relative',
                                    zIndex: 1,
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
                                }}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Extra Section 3: Newsletter/CTA */}
            <section style={{
                padding: '120px 0',
                background: 'url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.9)' }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px', color: 'white' }}>Ready to Start Earning?</h2>
                        <p style={{ fontSize: '20px', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 40px' }}>
                            Join thousands of users who are already making money daily. No hidden fees, just simple tasks.
                        </p>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '18px 48px', fontSize: '20px', borderRadius: '50px' }}>
                            Get Started Now 🚀
                        </Link>
                    </motion.div>
                </div>
            </section>
        </MainLayout>
    );
};

export default Home;
