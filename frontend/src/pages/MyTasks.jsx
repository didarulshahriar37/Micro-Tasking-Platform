import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const MyTasks = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await taskService.getMyTasks();
            // Sort by compilation/creation date descending
            const sortedTasks = response.data.tasks.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setTasks(sortedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (task) => new Promise((resolve) => {
        toast.custom((t) => (
            <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '18px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                width: '320px'
            }}>
                <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '6px' }}>Delete this task?</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '14px' }}>
                    {task.title}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '18px' }}>
                    Uncompleted slots will be refunded.
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        className="btn btn-secondary"
                        style={{ padding: '8px 12px', fontSize: '13px' }}
                        onClick={() => {
                            toast.dismiss(t.id);
                            resolve(false);
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-danger"
                        style={{ padding: '8px 12px', fontSize: '13px' }}
                        onClick={() => {
                            toast.dismiss(t.id);
                            resolve(true);
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), { duration: Infinity });
    });

    const handleDelete = async (task) => {
        const confirmed = await confirmDelete(task);
        if (!confirmed) return;

        try {
            await taskService.deleteTask(task._id);
            const refillAmount = task.required_workers * task.payable_amount;

            // Success alert & local state update
            toast.success(`Task deleted. ${refillAmount} coins have been refilled.`);
            updateUser({ ...user, coins: user.coins + refillAmount });
            setTasks(tasks.filter(t => t._id !== task._id));
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete task');
        }
    };

    const handleEdit = (taskId) => {
        navigate(`/buyer/add-task?edit=${taskId}`);
    };

    if (loading) return <DashboardLayout><LoadingSpinner text="Loading your tasks..." /></DashboardLayout>;

    return (
        <DashboardLayout>
            <title>My Tasks | Buyer</title>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: '800', marginBottom: '8px' }}>My Tasks</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Manage and track your active task postings.</p>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table style={{ minWidth: '800px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th style={{ padding: '20px' }}>Task Info</th>
                                <th style={{ padding: '20px' }}>Workers</th>
                                <th style={{ padding: '20px' }}>Payable</th>
                                <th style={{ padding: '20px' }}>Deadline</th>
                                <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No tasks found. Start by adding one!
                                    </td>
                                </tr>
                            ) : (
                                tasks.map((task) => (
                                    <tr key={task._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                                                {task.title}
                                            </div>
                                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {task.description}
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ fontWeight: '600' }}>{task.count || 0}</span> / {task.required_workers}
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ color: '#34d399', fontWeight: '600' }}>💰 {task.payable_amount}</span>
                                        </td>
                                        <td style={{ padding: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                            {new Date(task.deadline).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: '8px 12px', fontSize: '13px' }}
                                                    onClick={() => handleEdit(task._id)}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    style={{ padding: '8px 12px', fontSize: '13px' }}
                                                    onClick={() => handleDelete(task)}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MyTasks;
