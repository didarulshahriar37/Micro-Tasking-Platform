import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService, submissionService } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { motion } from 'framer-motion';

const WorkerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalSubmissions: 0,
        totalPendingSubmissions: 0,
        totalEarnings: 0
    });
    const [approvedSubmissions, setApprovedSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, submissionsRes] = await Promise.all([
                userService.getStats(),
                submissionService.getAllSubmissions()
            ]);

            if (statsRes.data.stats) {
                setStats(statsRes.data.stats);
            }

            // Filter approved submissions for the table
            const approved = submissionsRes.data.submissions.filter(s => s.status === 'approved');
            setApprovedSubmissions(approved);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <DashboardLayout><div className="loading">Loading Dashboard info...</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
                    Welcome back, <span style={{ color: 'var(--primary-color)' }}>{user?.name}</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>You are currently viewing your submission stats and earnings.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-3" style={{ gap: '24px', marginBottom: '48px' }}>
                <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>📝</div>
                    <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Submission</h3>
                    <p style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary-color)' }}>{stats.totalSubmissions}</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
                    <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Submissions</h3>
                    <p style={{ fontSize: '36px', fontWeight: '800', color: '#f59e0b' }}>{stats.totalPendingSubmissions}</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>💰</div>
                    <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Earning</h3>
                    <p style={{ fontSize: '36px', fontWeight: '800', color: '#34d399' }}>💰 {stats.totalEarnings}</p>
                </div>
            </div>

            {/* Approved Submissions Table */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Approved Submissions</h2>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th style={{ padding: '20px' }}>Task Title</th>
                                <th style={{ padding: '20px' }}>Payable Amount</th>
                                <th style={{ padding: '20px' }}>Buyer Name</th>
                                <th style={{ padding: '20px', textAlign: 'right' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {approvedSubmissions.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No approved submissions yet. Start earning!
                                    </td>
                                </tr>
                            ) : (
                                approvedSubmissions.map((sub) => (
                                    <tr key={sub._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ fontWeight: '600' }}>{sub.task_title || sub.task?.title}</div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ color: '#34d399', fontWeight: '600' }}>💰 {sub.payable_amount || sub.task?.payable_amount}</span>
                                        </td>
                                        <td style={{ padding: '20px' }}>{sub.Buyer_name || sub.task?.buyer?.name}</td>
                                        <td style={{ padding: '20px', textAlign: 'right' }}>
                                            <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '12px' }}>Approved</span>
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

export default WorkerDashboard;
