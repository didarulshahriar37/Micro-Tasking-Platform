import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <style>{`
                @media (max-width: 1024px) {
                    .dashboard-sidebar {
                        position: fixed !important;
                        left: 0;
                        transform: translateX(-100%);
                    }
                    .dashboard-sidebar.open {
                        transform: translateX(0);
                    }
                    .sidebar-close-btn {
                        display: block !important;
                    }
                    .dashboard-main-content {
                        padding: 20px !important;
                    }
                    .dashboard-header {
                        padding: 12px 15px !important;
                    }
                    .header-pill {
                        padding: 4px 8px !important;
                    }
                    .user-name-box {
                        display: none !important;
                    }
                    .dashboard-footer {
                        padding: 15px !important;
                    }
                }
            `}</style>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
                {/* Dashboard Header */}
                <header className="dashboard-header" style={{
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
                        {/* Hamburger Menu */}
                        <button
                            onClick={toggleSidebar}
                            style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                                cursor: 'pointer'
                            }}
                            className="lg-hide"
                        >
                            ☰
                        </button>

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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Coins */}
                        <div className="header-pill" style={{
                            padding: '8px 16px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#34d399',
                            fontWeight: '700',
                            fontSize: '14px'
                        }}>
                            💰 {user?.coins || 0}
                        </div>

                        {/* User Profile Info */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            paddingLeft: '12px',
                            borderLeft: window.innerWidth > 640 ? '1px solid var(--border-color)' : 'none'
                        }}>
                            <div className="user-name-box" style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)' }}>{user?.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--primary-color)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {user?.role}
                                </div>
                            </div>

                            <img
                                src={user?.profileImage || 'https://ui-avatars.com/api/?name=' + user?.name}
                                alt="Profile"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid var(--bg-card)',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            />

                            <button
                                onClick={logout}
                                style={{
                                    background: 'rgba(239, 68, 68, 0.08)',
                                    color: 'var(--danger)',
                                    border: 'none',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.15)'}
                                onMouseLeave={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.08)'}
                            >
                                🚪
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="dashboard-main-content" style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
                    {children}
                </main>

                {/* Footer */}
                <footer className="dashboard-footer" style={{
                    padding: '24px 32px',
                    textAlign: 'center',
                    borderTop: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: '500'
                }}>
                    MicroTask Platform • 2026
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
