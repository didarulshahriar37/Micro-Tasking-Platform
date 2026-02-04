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

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) return;

        try {
            await taskService.deleteTaskByAdmin(taskId);
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
                                                onClick={() => handleDeleteTask(task._id)}
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
