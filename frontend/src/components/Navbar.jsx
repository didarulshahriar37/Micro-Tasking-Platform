import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = React.useState(false);

    // Close menu when route changes
    React.useEffect(() => {
        setIsOpen(false);
    }, [navigate]);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const dashboardLink = user?.role === 'worker' ? '/worker' :
        user?.role === 'buyer' ? '/buyer' :
            user?.role === 'admin' ? '/admin' : '/';

    return (
        <nav style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            transition: 'background 0.3s ease'
        }}>
            <div className="container" style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1001 }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold',
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
                </Link>

                {/* Right Side Tools & Menu */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Theme Toggle - Always Visible */}
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)',
                            padding: '8px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            width: '40px',
                            height: '40px',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>

                    {/* Navigation Menu Links */}
                    <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
                        <a
                            href="https://github.com/programming-hero-web-course2/b10a12-client-side-didar55"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                            style={{ fontSize: '13px', padding: '10px 20px', color: 'var(--text-primary)', borderColor: 'var(--border-color)', width: isOpen ? '100%' : 'auto', justifyContent: 'center' }}
                        >
                            <span style={{ fontSize: '16px' }}>🚀</span> Join as Developer
                        </a>

                        {!user ? (
                            <>
                                <Link to="/login" className="btn btn-outline" style={{ border: 'none', color: 'var(--text-primary)', fontSize: '16px' }}>
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary" style={{ width: isOpen ? '100%' : 'auto', justifyContent: 'center' }}>
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to={dashboardLink}
                                    style={{
                                        textDecoration: 'none',
                                        color: 'var(--text-secondary)',
                                        fontWeight: '500',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        transition: 'all 0.3s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        fontSize: isOpen ? '18px' : '15px'
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                >
                                    <span>📊</span> Dashboard
                                </Link>

                                <div style={{
                                    padding: '6px 16px',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: '1px solid rgba(16, 185, 129, 0.2)',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#34d399',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    💰 {user.coins}
                                </div>

                                {/* User Profile */}
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    cursor: 'default'
                                }} title={user.name}>
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        user.name?.charAt(0).toUpperCase() || 'U'
                                    )}
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="btn btn-danger"
                                    style={{ padding: '8px 16px', fontSize: '13px', width: isOpen ? '100%' : 'auto' }}
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>

                    {/* Hamburger Icon - Only visible on mobile */}
                    <button className="hamburger" onClick={toggleMenu} style={{ marginLeft: '8px' }}>
                        {isOpen ? (
                            <i className="fas fa-times"></i>
                        ) : (
                            <i className="fas fa-bars"></i>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
