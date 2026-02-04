import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();

    const getLinks = () => {
        const baseClass = "sidebar-link";

        switch (user?.role) {
            case 'worker':
                return [
                    { to: '/worker', text: '📊 Dashboard Home', icon: 'home' },
                    { to: '/worker/task-list', text: '🔍 Available Tasks', icon: 'tasks' },
                    { to: '/worker/my-submissions', text: '📝 My Submissions', icon: 'file-alt' },
                    { to: '/worker/withdrawals', text: '💰 Withdrawals', icon: 'wallet' },
                ];
            case 'buyer':
                return [
                    { to: '/buyer', text: '📊 Dashboard Home', icon: 'home' },
                    { to: '/buyer/add-task', text: '➕ Add New Tasks', icon: 'plus-circle' },
                    { to: '/buyer/my-tasks', text: '📋 My Tasks', icon: 'list-ul' },
                    { to: '/buyer/purchase-coin', text: '💎 Purchase Coin', icon: 'coins' },
                    { to: '/buyer/payment-history', text: '📜 Payment History', icon: 'history' },
                ];
            case 'admin':
                return [
                    { to: '/admin', text: '📊 Dashboard Home', icon: 'home' },
                    { to: '/admin/manage-users', text: '👥 Manage Users', icon: 'users' },
                    { to: '/admin/manage-tasks', text: '⚙️ Manage Tasks', icon: 'tasks' },
                ];
            default:
                return [];
        }
    };

    const links = getLinks();

    return (
        <aside style={{
            width: '280px',
            background: 'var(--bg-card)',
            borderRight: '1px solid var(--border-color)',
            height: '100vh',
            position: 'sticky',
            top: 0,
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 100
        }}>
            <div style={{ marginBottom: '32px', padding: '0 12px' }}>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                    Navigation
                </h3>
            </div>

            {links.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/worker' || link.to === '/buyer' || link.to === '/admin'}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        color: isActive ? 'white' : 'var(--text-secondary)',
                        background: isActive ? 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' : 'transparent',
                        fontWeight: isActive ? '600' : '500',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isActive ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none'
                    })}
                >
                    <span style={{ fontSize: '18px' }}>{link.text.split(' ')[0]}</span>
                    <span>{link.text.split(' ').slice(1).join(' ')}</span>
                </NavLink>
            ))}

            <div style={{ marginTop: 'auto', padding: '20px 12px', borderTop: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    © 2026 MicroTask Platform
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;
