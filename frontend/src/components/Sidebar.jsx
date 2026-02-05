import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    ListTodo,
    CheckSquare,
    Wallet,
    PlusCircle,
    ClipboardList,
    Coins,
    History,
    Users,
    Settings,
    X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();

    const getLinks = () => {
        switch (user?.role) {
            case 'worker':
                return [
                    { to: '/worker', text: 'Dashboard Home', icon: LayoutDashboard },
                    { to: '/worker/task-list', text: 'Available Tasks', icon: ListTodo },
                    { to: '/worker/my-submissions', text: 'My Submissions', icon: CheckSquare },
                    { to: '/worker/withdrawals', text: 'Withdrawals', icon: Wallet },
                ];
            case 'buyer':
                return [
                    { to: '/buyer', text: 'Dashboard Home', icon: LayoutDashboard },
                    { to: '/buyer/add-task', text: 'Add New Tasks', icon: PlusCircle },
                    { to: '/buyer/my-tasks', text: 'My Tasks', icon: ClipboardList },
                    { to: '/buyer/purchase-coin', text: 'Purchase Coin', icon: Coins },
                    { to: '/buyer/payment-history', text: 'Payment History', icon: History },
                ];
            case 'admin':
                return [
                    { to: '/admin', text: 'Dashboard Home', icon: LayoutDashboard },
                    { to: '/admin/manage-users', text: 'Manage Users', icon: Users },
                    { to: '/admin/manage-tasks', text: 'Manage Tasks', icon: Settings },
                ];
            default:
                return [];
        }
    };

    const links = getLinks();

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 998,
                    display: isOpen ? 'block' : 'none',
                    animation: 'fadeIn 0.3s ease'
                }}
            />

            <aside
                className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}
                style={{
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
                    zIndex: 999,
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', padding: '0 12px' }}>
                    <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                        DASHBOARD
                    </h3>
                    <button
                        onClick={onClose}
                        className="sidebar-close-btn"
                        style={{ background: 'none', border: 'none', fontSize: '20px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'none' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {links.map((link) => {
                    const Icon = link.icon;
                    return (
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
                            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                    <span>{link.text}</span>
                                </>
                            )}
                        </NavLink>
                    );
                })}

                <div style={{ marginTop: 'auto', padding: '20px 12px', borderTop: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        © 2026 MicroTask Platform
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
