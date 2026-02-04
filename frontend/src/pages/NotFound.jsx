import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center',
            background: 'var(--bg-primary)'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="card"
                style={{
                    maxWidth: '500px',
                    width: '100%',
                    padding: '60px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '24px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--danger)',
                    marginBottom: '32px'
                }}>
                    <AlertCircle size={48} />
                </div>

                <h1 style={{
                    fontSize: '84px',
                    fontWeight: '900',
                    margin: 0,
                    lineHeight: 1,
                    background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '10px'
                }}>
                    404
                </h1>

                <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Page Not Found</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: '1.6' }}>
                    Oops! The page you are looking for doesn't exist or has been moved.
                    Let's get you back on track.
                </p>

                <Link to="/" style={{ textDecoration: 'none' }}>
                    <button className="btn btn-primary" style={{ padding: '14px 32px' }}>
                        <Home size={18} style={{ marginRight: '8px' }} />
                        Back to Home
                    </button>
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
