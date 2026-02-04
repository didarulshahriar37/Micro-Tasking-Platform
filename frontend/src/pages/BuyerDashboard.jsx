import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService, submissionService, transactionService } from '../services/api';

const BuyerDashboard = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tasks');
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tasksRes, submissionsRes] = await Promise.all([
                taskService.getAllTasks(),
                submissionService.getAllSubmissions()
            ]);
            setTasks(tasksRes.data.tasks);
            setSubmissions(submissionsRes.data.submissions);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchaseCoins = async () => {
        const amount = prompt('Enter amount of coins to purchase:');
        if (amount && parseFloat(amount) > 0) {
            try {
                await transactionService.purchaseCoins(parseFloat(amount));
                alert('Coins purchased successfully!');
                window.location.reload();
            } catch (error) {
                alert(error.response?.data?.error || 'Purchase failed');
            }
        }
    };

    const handleReview = async (submissionId, status) => {
        const reviewNote = prompt(`Enter review note (optional):`);
        try {
            await submissionService.reviewSubmission(submissionId, { status, reviewNote });
            alert(`Submission ${status}!`);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Review failed');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
            {/* Header */}
            <div style={{ backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow)', padding: '16px 0' }}>
                <div className="container flex-between">
                    <h1 style={{ color: 'var(--primary-color)', fontSize: '24px' }}>Buyer Dashboard</h1>
                    <div className="flex">
                        <div style={{ padding: '8px 16px', backgroundColor: 'var(--bg-color)', borderRadius: '6px' }}>
                            <strong>{user.coins}</strong> coins
                        </div>
                        <button onClick={logout} className="btn btn-outline">Logout</button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '24px' }}>
                {/* Stats Cards */}
                <div className="grid grid-3 mb-3">
                    <div className="card">
                        <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Spent</h3>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--danger-color)' }}>
                            {user.totalSpent} coins
                        </p>
                    </div>
                    <div className="card">
                        <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Created Tasks</h3>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                            {user.createdTasks}
                        </p>
                    </div>
                    <div className="card">
                        <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Available Coins</h3>
                        <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{user.coins} coins</p>
                        <button onClick={handlePurchaseCoins} className="btn btn-primary mt-2" style={{ fontSize: '12px' }}>
                            Purchase Coins
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="card">
                    <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
                        <button
                            onClick={() => setActiveTab('tasks')}
                            style={{
                                padding: '12px 24px',
                                border: 'none',
                                background: 'none',
                                borderBottom: activeTab === 'tasks' ? '2px solid var(--primary-color)' : 'none',
                                color: activeTab === 'tasks' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                fontWeight: activeTab === 'tasks' ? '600' : '400',
                                cursor: 'pointer'
                            }}
                        >
                            My Tasks
                        </button>
                        <button
                            onClick={() => setActiveTab('submissions')}
                            style={{
                                padding: '12px 24px',
                                border: 'none',
                                background: 'none',
                                borderBottom: activeTab === 'submissions' ? '2px solid var(--primary-color)' : 'none',
                                color: activeTab === 'submissions' ? 'var(--primary-color)' : 'var(--text-secondary)',
                                fontWeight: activeTab === 'submissions' ? '600' : '400',
                                cursor: 'pointer'
                            }}
                        >
                            Pending Reviews
                        </button>
                    </div>

                    {activeTab === 'tasks' && (
                        <div>
                            <div className="flex-between mb-3">
                                <h2>My Tasks</h2>
                                <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn btn-primary">
                                    {showCreateForm ? 'Cancel' : 'Create New Task'}
                                </button>
                            </div>

                            {showCreateForm && (
                                <div className="card" style={{ backgroundColor: 'var(--bg-color)', marginBottom: '20px' }}>
                                    <h3 style={{ marginBottom: '16px' }}>Create New Task</h3>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.target);
                                        const taskData = {
                                            title: formData.get('title'),
                                            description: formData.get('description'),
                                            rewardPerTask: Number(formData.get('rewardPerTask')),
                                            totalSlots: Number(formData.get('totalSlots')),
                                            deadline: formData.get('deadline'),
                                            category: formData.get('category') || 'other', // Default category
                                            requirements: formData.get('requirements')
                                        };

                                        try {
                                            await taskService.createTask(taskData);
                                            alert('Task created successfully!');
                                            setShowCreateForm(false);
                                            fetchData();
                                        } catch (error) {
                                            alert(error.response?.data?.error || 'Failed to create task');
                                        }
                                    }}>
                                        <div className="grid grid-2">
                                            <div className="input-group">
                                                <label>Task Title</label>
                                                <input name="title" required placeholder="e.g. Watch Video & Like" />
                                            </div>
                                            <div className="input-group">
                                                <label>Deadline</label>
                                                <input name="deadline" type="date" required />
                                            </div>
                                        </div>
                                        <div className="grid grid-2">
                                            <div className="input-group">
                                                <label>Reward per Task (Coins)</label>
                                                <input name="rewardPerTask" type="number" min="1" required />
                                            </div>
                                            <div className="input-group">
                                                <label>Total Slots</label>
                                                <input name="totalSlots" type="number" min="1" required />
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <label>Description</label>
                                            <textarea name="description" required rows="3" placeholder="Describe the task..."></textarea>
                                        </div>
                                        <div className="input-group">
                                            <label>Submission Requirements</label>
                                            <textarea name="requirements" required rows="2" placeholder="What should the worker submit? (e.g. Screenshot, Text)"></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-primary">Create Task</button>
                                    </form>
                                </div>
                            )}

                            {tasks.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)' }}>You haven't created any tasks yet.</p>
                            ) : (
                                <div className="grid grid-2">
                                    {tasks.map((task) => (
                                        <div key={task._id} className="card" style={{ border: '1px solid var(--border-color)' }}>
                                            <div className="flex-between mb-2">
                                                <h3>{task.title}</h3>
                                                <span className={`badge badge-${task.status === 'active' ? 'success' :
                                                    task.status === 'completed' ? 'info' : 'warning'
                                                    }`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>
                                                {task.description}
                                            </p>
                                            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                                <div>Reward: <strong>{task.rewardPerTask} coins</strong></div>
                                                <div>Slots: {task.availableSlots}/{task.totalSlots}</div>
                                                <div>Submissions: {task.submissionCount} ({task.approvedCount} approved)</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'submissions' && (
                        <div>
                            <h2 style={{ marginBottom: '16px' }}>Pending Reviews</h2>
                            {submissions.filter(s => s.status === 'pending').length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)' }}>No pending submissions to review.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {submissions.filter(s => s.status === 'pending').map((submission) => (
                                        <div key={submission._id} className="card" style={{ border: '1px solid var(--border-color)' }}>
                                            <div className="flex-between mb-2">
                                                <div>
                                                    <h3>{submission.task?.title}</h3>
                                                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                                        Worker: {submission.worker?.name}
                                                    </p>
                                                </div>
                                                <span className="badge badge-warning">{submission.status}</span>
                                            </div>
                                            <p style={{ marginBottom: '12px', fontSize: '14px' }}>
                                                {submission.submissionDetails}
                                            </p>
                                            <div className="flex" style={{ gap: '8px' }}>
                                                <button
                                                    onClick={() => handleReview(submission._id, 'approved')}
                                                    className="btn btn-secondary"
                                                    style={{ fontSize: '14px' }}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReview(submission._id, 'rejected')}
                                                    className="btn btn-danger"
                                                    style={{ fontSize: '14px' }}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyerDashboard;
