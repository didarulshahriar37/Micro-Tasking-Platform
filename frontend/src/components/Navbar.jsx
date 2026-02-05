import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    Bell,
    Sun,
    Moon,
    Coins,
    LogOut,
    LayoutDashboard,
    Menu,
    X,
    MessageSquare,
    Github
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = React.useState(false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [notifications, setNotifications] = React.useState([]);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const notificationRef = React.useRef(null);

    // Close menu when route changes
    React.useEffect(() => {
        setIsOpen(false);
        setShowNotifications(false);
    }, [navigate]);

    // Fetch notifications
    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const { userService } = await import('../services/api');
            const response = await userService.getNotifications({ unreadOnly: false });
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    React.useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [user]);

    // Handle click outside notification popup
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleNotificationClick = async (notif) => {
        if (!notif.isRead) {
            try {
                const { userService } = await import('../services/api');
                await userService.markNotificationRead(notif._id);
                fetchNotifications();
            } catch (error) {
                console.error('Error marking as read:', error);
            }
        }
        if (notif.actionRoute) {
            navigate(notif.actionRoute);
        }
        setShowNotifications(false);
    };

    const handleLogout = () => {
        logout();
    };

    const dashboardLink = user?.role === 'worker' ? '/worker' :
        user?.role === 'buyer' ? '/buyer' :
            user?.role === 'admin' ? '/admin' : '/';
    const clientRepoUrl = 'https://github.com/didarulshahriar37/Micro-Tasking-Platform/';

    return (
        <nav style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            transition: 'all 0.3s ease'
        }}>
            <style>{`
                @media (max-width: 500px) {
                    .nav-logo-text, .nav-balance-label, .nav-logout-btn { display: none !important; }
                    .nav-container { padding: 10px 12px !important; }
                    .nav-right-section { gap: 6px !important; }
                    .nav-profile-group { gap: 8px !important; }
                }
            `}</style>
            <div className="container nav-container" style={{
                padding: '12px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                {/* Logo & Main Nav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1001 }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                            flexShrink: 0
                        }}>
                            M
                        </div>
                        <span className="nav-logo-text" style={{
                            fontSize: '20px',
                            fontWeight: '800',
                            letterSpacing: '-0.5px',
                            background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            MicroTask
                        </span>
                    </Link>
                </div>

                {/* Right Side Tools & Profile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                    {/* Utility Tools Group */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        paddingRight: user ? '8px' : '0',
                        borderRight: user ? '1px solid var(--border-color)' : 'none'
                    }}>
                        {/* Notification Bell */}
                        {user && (
                            <div style={{ position: 'relative' }} ref={notificationRef}>
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    style={{
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-primary)',
                                        padding: '0',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        width: '36px',
                                        height: '36px',
                                        transition: 'all 0.2s',
                                        position: 'relative'
                                    }}
                                >
                                    <Bell size={18} />
                                    {unreadCount > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '-4px',
                                            right: '-4px',
                                            background: '#ef4444',
                                            color: 'white',
                                            fontSize: '9px',
                                            minWidth: '16px',
                                            height: '16px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '800',
                                            border: '2px solid var(--bg-card)'
                                        }}>
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Floating Pop-up - Restored */}
                                {showNotifications && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '45px',
                                        right: '0',
                                        width: '280px',
                                        maxHeight: '400px',
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                                        zIndex: 1002,
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h3 style={{ fontSize: '14px', fontWeight: '700' }}>Notifications</h3>
                                        </div>
                                        <div style={{ overflowY: 'auto', maxHeight: '330px' }}>
                                            {notifications.length === 0 ? (
                                                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>No notifications</div>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div
                                                        key={notif._id}
                                                        onClick={() => handleNotificationClick(notif)}
                                                        style={{
                                                            padding: '12px 16px',
                                                            borderBottom: '1px solid var(--border-color-light)',
                                                            cursor: 'pointer',
                                                            background: notif.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.05)',
                                                            display: 'flex',
                                                            gap: '10px'
                                                        }}
                                                    >
                                                        <div style={{ fontSize: '16px', color: notif.type === 'payment' ? '#f59e0b' : 'var(--primary-color)' }}>
                                                            {notif.type === 'payment' ? <Coins size={16} /> : <Bell size={16} />}
                                                        </div>
                                                        <div style={{ fontSize: '12px', flex: 1 }}>{notif.message}</div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                padding: '0',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                width: '36px',
                                height: '36px',
                                transition: 'all 0.2s'
                            }}
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>

                    {/* Auth & Profile Section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {!user ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Link to="/login" className="btn btn-outline" style={{ border: 'none', color: 'var(--text-primary)', padding: '10px 20px', fontWeight: '600' }}>
                                    Login
                                </Link>
                                <a
                                    href={clientRepoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                    style={{ padding: '10px 24px', borderRadius: '10px', fontWeight: '700', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <Github size={16} />
                                    Join As Developer
                                </a>
                            </div>
                        ) : (
                            <div className="nav-profile-group" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                {/* User Info Group - Compact & Elegant */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    background: 'var(--bg-secondary)',
                                    padding: '4px 6px 4px 16px',
                                    borderRadius: '30px',
                                    border: '1px solid var(--border-color)',
                                    transition: 'all 0.3s'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <span className="nav-balance-label" style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Balance</span>
                                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Coins size={14} color="#10b981" /> {user.coins}
                                        </span>
                                    </div>

                                    {/* Actionable Profile Circle */}
                                    <div
                                        onClick={() => navigate(dashboardLink)}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: '800',
                                            fontSize: '15px',
                                            cursor: 'pointer',
                                            border: '2px solid var(--bg-card)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                            position: 'relative'
                                        }}
                                        title={user.name}
                                    >
                                        {user.profileImage ? (
                                            <img src={user.profileImage} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            user.name?.charAt(0).toUpperCase()
                                        )}
                                        {/* Activity Indicator */}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '0',
                                            right: '0',
                                            width: '10px',
                                            height: '10px',
                                            background: '#34d399',
                                            borderRadius: '50%',
                                            border: '2px solid var(--bg-card)'
                                        }} />
                                    </div>
                                </div>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="nav-logout-btn"
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.08)',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        padding: '8px 16px',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <button className="hamburger" onClick={toggleMenu} style={{
                        marginLeft: '8px',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '24px',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        padding: '4px'
                    }}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Menu Overlay */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-card)',
                    borderBottom: '1px solid var(--border-color)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    boxShadow: '0 20px 25px rgba(0,0,0,0.1)',
                    animation: 'fadeInOut 0.3s ease'
                }}>
                    {user ? (
                        <>
                            <Link to={dashboardLink} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '600', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <LayoutDashboard size={18} /> Dashboard Home
                            </Link>
                            <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%', height: '48px', justifyContent: 'center' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline" style={{ height: '48px', justifyContent: 'center' }}>Login</Link>
                            <a
                                href={clientRepoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ height: '48px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <Github size={16} />
                                Join As Developer
                            </a>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
