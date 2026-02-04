import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Sidebar />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Dashboard Header */}
                <header style={{
                    background: 'var(--bg-card)',
                    borderBottom: '1px solid var(--border-color)',
                    padding: '16px 32px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 90
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: '800',
                                background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                MicroTask
                            </h2>
                        </Link>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        {/* Coins */}
                        <div style={{
                            padding: '8px 16px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#34d399',
                            fontWeight: '600'
                        }}>
                            💰 {user?.coins || 0}
                        </div>

                        {/* Notifications Placeholder */}
                        <button style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            position: 'relative'
                        }}>
                            🔔
                            <span style={{
                                position: 'absolute',
                                top: '-2px',
                                right: '-2px',
                                width: '8px',
                                height: '8px',
                                background: 'var(--danger)',
                                borderRadius: '50%',
                                border: '2px solid var(--bg-card)'
                            }}></span>
                        </button>

                        {/* User Profile Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '24px', borderLeft: '1px solid var(--border-color)' }}>
                            <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{user?.name}</div>
                                <div style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: '600', textTransform: 'capitalize' }}>
                                    {user?.role}
                                </div>
                            </div>

                            <img
                                src={user?.profileImage || 'https://ui-avatars.com/api/?name=' + user?.name}
                                alt="Profile"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid var(--border-color)'
                                }}
                            />

                            <button
                                onClick={logout}
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    color: 'var(--danger)',
                                    border: 'none',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    transition: 'all 0.3s'
                                }}
                                title="Logout"
                                onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                                onMouseLeave={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                            >
                                🚪
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
                    {children}
                </main>

                {/* Footer */}
                <footer style={{
                    padding: '24px 32px',
                    textAlign: 'center',
                    borderTop: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    fontSize: '14px'
                }}>
                    Dashboard Footer - Managed by MicroTask
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
