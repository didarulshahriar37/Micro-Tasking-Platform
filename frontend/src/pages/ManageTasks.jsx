import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ManageTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await taskService.getAllTasks();
            setTasks(response.data.tasks);
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
                    This action cannot be undone.
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

    const handleDeleteTask = async (task) => {
        const confirmed = await confirmDelete(task);
        if (!confirmed) return;

        try {
            await taskService.deleteTaskByAdmin(task._id);
            toast.success('Task deleted successfully');
            fetchTasks();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete task');
        }
    };

    if (loading) return <DashboardLayout><LoadingSpinner text="Loading tasks..." /></DashboardLayout>;

    return (
        <DashboardLayout>
            <title>Manage Tasks | Admin</title>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: '800', marginBottom: '8px' }}>Manage Tasks</h1>
                <p style={{ color: 'var(--text-secondary)' }}>View and remove tasks across the entire platform.</p>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table style={{ minWidth: '1000px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th style={{ padding: '20px' }}>Task Info</th>
                                <th style={{ padding: '20px' }}>Buyer</th>
                                <th style={{ padding: '20px' }}>Payable</th>
                                <th style={{ padding: '20px' }}>Required / Available</th>
                                <th style={{ padding: '20px' }}>Deadline</th>
                                <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No tasks found on the platform.
                                    </td>
                                </tr>
                            ) : (
                                tasks.map((task) => (
                                    <tr key={task._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <img
                                                    src={task.task_image_url || 'https://via.placeholder.com/60x60'}
                                                    alt={task.title}
                                                    style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                                                />
                                                <div style={{ fontWeight: '600', maxWidth: '300px' }}>{task.title}</div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ fontWeight: '500' }}>{task.buyer?.name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{task.buyer?.email}</div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ color: '#34d399', fontWeight: '700' }}>💰 {task.payable_amount}</span>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            {task.required_workers} / {task.available_workers}
                                        </td>
                                        <td style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                            {new Date(task.deadline).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleDeleteTask(task)}
                                                className="btn btn-danger"
                                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                            >
                                                🗑️ Delete
                                            </button>
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

export default ManageTasks;
