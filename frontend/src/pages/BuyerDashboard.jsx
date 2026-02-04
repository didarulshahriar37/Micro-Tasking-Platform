import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService, submissionService } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const BuyerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalTasks: 0,
        pendingWorkers: 0,
        totalPayments: user?.totalSpent || 0
    });
    const [pendingSubmissions, setPendingSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [tasksRes, submissionsRes] = await Promise.all([
                taskService.getMyTasks(),
                submissionService.getAllSubmissions()
            ]);

            const tasks = tasksRes.data.tasks;
            const submissions = submissionsRes.data.submissions;

            // Calculate stats
            const totalTasks = tasks.length;
            const pendingWorkers = tasks.reduce((acc, task) => acc + (task.required_workers - (task.approvedCount || 0)), 0);

            setStats({
                totalTasks,
                pendingWorkers,
                totalPayments: user?.totalSpent || 0
            });

            // Filter pending submissions
            setPendingSubmissions(submissions.filter(s => s.status === 'pending'));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (submissionId) => {
        try {
            await submissionService.reviewSubmission(submissionId, { status: 'approved' });
            toast.success('Submission Approved! Worker has been paid.');
            fetchDashboardData();
        } catch (error) {
            toast.error('Error approving submission');
        }
    };

    const handleReject = async (submissionId) => {
        try {
            await submissionService.reviewSubmission(submissionId, { status: 'rejected' });
            toast.success('Submission Rejected.');
            fetchDashboardData();
        } catch (error) {
            toast.error('Error rejecting submission');
        }
    };

    if (loading) return <DashboardLayout><div className="loading">Loading Dashboard info...</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
                    Welcome back, <span style={{ color: 'var(--primary-color)' }}>{user?.name}</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>You are currently managing your tasks and submissions.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-3" style={{ gap: '24px', marginBottom: '48px' }}>
                <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>📋</div>
                    <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Tasks</h3>
                    <p style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary-color)' }}>{stats.totalTasks}</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
                    <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Workers</h3>
                    <p style={{ fontSize: '36px', fontWeight: '800', color: '#f59e0b' }}>{stats.pendingWorkers}</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>💸</div>
                    <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Payments</h3>
                    <p style={{ fontSize: '36px', fontWeight: '800', color: '#34d399' }}>💰 {stats.totalPayments}</p>
                </div>
            </div>

            {/* Task To Review Table */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Tasks To Review</h2>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th style={{ padding: '20px' }}>Worker Name</th>
                                <th style={{ padding: '20px' }}>Task Title</th>
                                <th style={{ padding: '20px' }}>Payable</th>
                                <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingSubmissions.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No pending submissions to review. Good job!
                                    </td>
                                </tr>
                            ) : (
                                pendingSubmissions.map((submission) => (
                                    <tr key={submission._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ fontWeight: '600' }}>{submission.worker?.name}</div>
                                        </td>
                                        <td style={{ padding: '20px' }}>{submission.task?.title}</td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ color: '#34d399', fontWeight: '600' }}>💰 {submission.task?.payable_amount}</span>
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: '8px 16px', fontSize: '13px' }}
                                                    onClick={() => setSelectedSubmission(submission)}
                                                >
                                                    👁️ View Submission
                                                </button>
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: '8px 16px', fontSize: '13px', background: '#10b981', borderColor: '#10b981' }}
                                                    onClick={() => handleApprove(submission._id)}
                                                >
                                                    ✅ Approve
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    style={{ padding: '8px 16px', fontSize: '13px' }}
                                                    onClick={() => handleReject(submissionId)}
                                                >
                                                    ❌ Reject
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

            {/* Submission Detail Modal */}
            {selectedSubmission && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="card"
                        style={{ maxWidth: '600px', width: '100%', position: 'relative' }}
                    >
                        <button
                            onClick={() => setSelectedSubmission(null)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '24px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                            ×
                        </button>
                        <h2 style={{ marginBottom: '24px' }}>Submission Proof</h2>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Worker Message</label>
                            <p style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                {selectedSubmission.submission_details}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button
                                onClick={() => { handleApprove(selectedSubmission._id); setSelectedSubmission(null); }}
                                className="btn btn-primary"
                                style={{ flex: 1, background: '#10b981', borderColor: '#10b981' }}
                            >
                                ✅ Approve
                            </button>
                            <button
                                onClick={() => { handleReject(selectedSubmission._id); setSelectedSubmission(null); }}
                                className="btn btn-danger"
                                style={{ flex: 1 }}
                            >
                                ❌ Reject
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default BuyerDashboard;
