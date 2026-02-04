import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await userService.getAllUsers();
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveUser = async (userId) => {
        if (!window.confirm('Are you sure you want to remove this user? This action cannot be undone.')) return;

        try {
            await userService.deleteUser(userId);
            toast.success('User removed successfully');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to remove user');
        }
    };

    const handleUpdateRole = async (userId, newRole) => {
        try {
            await userService.updateRole(userId, newRole);
            toast.success('User role updated successfully');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update user role');
        }
    };

    if (loading) return <DashboardLayout><LoadingSpinner text="Loading users..." /></DashboardLayout>;

    return (
        <DashboardLayout>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: '800', marginBottom: '8px' }}>Manage Users</h1>
                <p style={{ color: 'var(--text-secondary)' }}>View, update roles, or remove users from the platform.</p>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table style={{ minWidth: '900px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th style={{ padding: '20px' }}>User</th>
                                <th style={{ padding: '20px' }}>Role</th>
                                <th style={{ padding: '20px' }}>Coins</th>
                                <th style={{ padding: '20px' }}>Joined</th>
                                <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <img
                                                src={u.profileImage || `https://ui-avatars.com/api/?name=${u.name}`}
                                                alt={u.name}
                                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{u.name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <select
                                            value={u.role}
                                            onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                border: '1px solid var(--border-color)',
                                                background: 'var(--bg-secondary)',
                                                fontSize: '13px',
                                                textTransform: 'capitalize'
                                            }}
                                        >
                                            <option value="worker">Worker</option>
                                            <option value="buyer">Buyer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{ color: '#f59e0b', fontWeight: '700' }}>💰 {u.coins}</span>
                                    </td>
                                    <td style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '20px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleRemoveUser(u._id)}
                                            className="btn btn-danger"
                                            style={{ padding: '6px 12px', fontSize: '12px' }}
                                        >
                                            🗑️ Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ManageUsers;
