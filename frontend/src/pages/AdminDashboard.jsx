import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, statsRes] = await Promise.all([
                userService.getAllUsers(),
                userService.getStats()
            ]);
            setUsers(usersRes.data.users);
            setStats(statsRes.data.stats);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            await userService.toggleUserStatus(userId);
            alert('User status updated!');
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to update user status');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
            {/* Header */}
            <div style={{ backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow)', padding: '16px 0' }}>
                <div className="container flex-between">
                    <h1 style={{ color: 'var(--primary-color)', fontSize: '24px' }}>Admin Dashboard</h1>
                    <button onClick={logout} className="btn btn-outline">Logout</button>
                </div>
            </div>

            <div className="container" style={{ marginTop: '24px' }}>
                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-3 mb-3">
                        <div className="card">
                            <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Users</h3>
                            <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                {stats.totalUsers}
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                Workers: {stats.totalWorkers} | Buyers: {stats.totalBuyers}
                            </p>
                        </div>
                        <div className="card">
                            <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Tasks</h3>
                            <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                                {stats.totalTasks}
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                Active: {stats.activeTasks}
                            </p>
                        </div>
                        <div className="card">
                            <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Submissions</h3>
                            <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--warning-color)' }}>
                                {stats.totalSubmissions}
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                Pending: {stats.pendingSubmissions}
                            </p>
                        </div>
                    </div>
                )}

                {/* Users Management */}
                <div className="card">
                    <h2 style={{ marginBottom: '20px' }}>User Management</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Name</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Email</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Role</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Coins</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '12px', fontSize: '14px' }}>{u.name}</td>
                                        <td style={{ padding: '12px', fontSize: '14px' }}>{u.email}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span className={`badge badge-${u.role === 'worker' ? 'info' :
                                                    u.role === 'buyer' ? 'success' : 'warning'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', fontSize: '14px' }}>{u.coins}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span className={`badge badge-${u.isActive ? 'success' : 'danger'}`}>
                                                {u.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <button
                                                onClick={() => handleToggleStatus(u._id)}
                                                className="btn btn-outline"
                                                style={{ fontSize: '12px', padding: '6px 12px' }}
                                            >
                                                {u.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
