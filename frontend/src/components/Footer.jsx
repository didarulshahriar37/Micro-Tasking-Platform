import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            padding: '80px 0 40px',
            borderTop: '1px solid var(--border-color)',
            marginTop: 'auto',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Vector Background Pattern */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0.05,
                pointerEvents: 'none',
                zIndex: 0
            }}>
                <svg width="100%" height="100%" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="var(--primary-color)" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="grid grid-3" style={{ marginBottom: '60px', gap: '40px' }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '20px',
                                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
                            }}>
                                M
                            </div>
                            <span style={{
                                fontSize: '24px',
                                fontWeight: '800',
                                background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                MicroTask
                            </span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.8', maxWidth: '300px' }}>
                            The ultimate platform for micro-tasking. Complete small tasks to earn money or get your work done by our expert community.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 style={{ fontSize: '18px', marginBottom: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>Quick Links</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '14px' }}>
                                <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '15px', transition: 'color 0.3s' }}
                                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                                    onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                                    Home
                                </Link>
                            </li>
                            <li style={{ marginBottom: '14px' }}>
                                <Link to="/register" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '15px', transition: 'color 0.3s' }}
                                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                                    onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                                    Join Now
                                </Link>
                            </li>
                            <li style={{ marginBottom: '14px' }}>
                                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '15px', transition: 'color 0.3s' }}
                                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                                    onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                                    Terms of Service
                                </a>
                            </li>
                            <li style={{ marginBottom: '14px' }}>
                                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '15px', transition: 'color 0.3s' }}
                                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                                    onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 style={{ fontSize: '18px', marginBottom: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>Connect With Us</h3>
                        <div className="flex" style={{ gap: '16px' }}>
                            <a
                                href="https://github.com/didarulshahriar37"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontSize: '22px',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.background = 'var(--primary-color)';
                                    e.currentTarget.style.boxShadow = '0 5px 15px var(--primary-glow)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <i className="fab fa-github"></i>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/didarulshahriar/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontSize: '22px',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.background = '#0077b5';
                                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 119, 181, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a
                                href="https://www.facebook.com/didarulshahriar"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontSize: '22px',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.background = '#1877f2';
                                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(24, 119, 242, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <i className="fab fa-facebook-f"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '32px',
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: '14px'
                }}>
                    &copy; {new Date().getFullYear()} MicroTask Platform. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
