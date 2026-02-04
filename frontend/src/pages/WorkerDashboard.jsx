import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService, submissionService, transactionService } from '../services/api';

const WorkerDashboard = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tasks');

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

    const handleWithdraw = async () => {
        const amount = prompt('Enter amount to withdraw (minimum 10 coins):');
        if (amount && parseFloat(amount) >= 10) {
            try {
                await transactionService.withdrawCoins(parseFloat(amount));
                alert('Withdrawal successful!');
                window.location.reload();
            } catch (error) {
                alert(error.response?.data?.error || 'Withdrawal failed');
            }
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
            {/* Header */}
            <div style={{ backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow)', padding: '16px 0' }}>
                <div className="container flex-between">
                    <h1 style={{ color: 'var(--primary-color)', fontSize: '24px' }}>Worker Dashboard</h1>
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
                        <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Earnings</h3>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                            {user.totalEarnings} coins
                        </p>
                    </div>
                    <div className="card">
                        <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Completed Tasks</h3>
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                            {user.completedTasks}
                        </p>
                    </div>
                    <div className="card">
                        <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Available Balance</h3>
                        <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{user.coins} coins</p>
                        <button onClick={handleWithdraw} className="btn btn-secondary mt-2" style={{ fontSize: '12px' }}>
                            Withdraw
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
                            Available Tasks
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
                            My Submissions
                        </button>
                    </div>

                    {activeTab === 'tasks' && (
                        <div>
                            <h2 style={{ marginBottom: '16px' }}>Available Tasks</h2>
                            {tasks.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)' }}>No tasks available at the moment.</p>
                            ) : (
                                <div className="grid grid-2">
                                    {tasks.map((task) => (
                                        <div key={task._id} className="card" style={{ border: '1px solid var(--border-color)' }}>
                                            <h3 style={{ marginBottom: '8px' }}>{task.title}</h3>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>
                                                {task.description}
                                            </p>
                                            <div className="flex-between" style={{ marginBottom: '12px' }}>
                                                <span className="badge badge-success">{task.rewardPerTask} coins</span>
                                                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                                    {task.availableSlots} slots left
                                                </span>
                                            </div>
                                            <button className="btn btn-primary" style={{ width: '100%', fontSize: '14px' }}>
                                                View & Submit
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'submissions' && (
                        <div>
                            <h2 style={{ marginBottom: '16px' }}>My Submissions</h2>
                            {submissions.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)' }}>You haven't submitted any tasks yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {submissions.map((submission) => (
                                        <div key={submission._id} className="card" style={{ border: '1px solid var(--border-color)' }}>
                                            <div className="flex-between">
                                                <div>
                                                    <h3 style={{ marginBottom: '4px' }}>{submission.task?.title}</h3>
                                                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                                        Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className={`badge badge-${submission.status === 'approved' ? 'success' :
                                                        submission.status === 'rejected' ? 'danger' : 'warning'
                                                    }`}>
                                                    {submission.status}
                                                </span>
                                            </div>
                                            {submission.reviewNote && (
                                                <p style={{ marginTop: '12px', fontSize: '14px', fontStyle: 'italic' }}>
                                                    Review: {submission.reviewNote}
                                                </p>
                                            )}
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

export default WorkerDashboard;
