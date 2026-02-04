import React, { useState, useEffect } from 'react';
import { submissionService } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';

const MySubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await submissionService.getAllSubmissions();
                setSubmissions(response.data.submissions);
            } catch (error) {
                console.error('Error fetching submissions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '12px' }}>Approved</span>;
            case 'rejected':
                return <span className="badge badge-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>Rejected</span>;
            default:
                return <span className="badge badge-warning" style={{ padding: '6px 12px', fontSize: '12px' }}>Pending</span>;
        }
    };

    if (loading) return <DashboardLayout><LoadingSpinner text="Loading your history..." /></DashboardLayout>;

    return (
        <DashboardLayout>
            <title>My Submissions | Worker</title>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: '800', marginBottom: '8px' }}>My Submissions</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Track the status of your submitted tasks.</p>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table style={{ minWidth: '900px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th style={{ padding: '20px' }}>Task Title</th>
                                <th style={{ padding: '20px' }}>Payable</th>
                                <th style={{ padding: '20px' }}>Buyer</th>
                                <th style={{ padding: '20px' }}>Date</th>
                                <th style={{ padding: '20px' }}>Status</th>
                                <th style={{ padding: '20px' }}>Review Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.length > 0 ? (
                                submissions.map(sub => (
                                    <tr key={sub._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ fontWeight: '600' }}>{sub.task_title || sub.task?.title}</div>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ color: '#34d399', fontWeight: '700' }}>💰 {sub.payable_amount || sub.task?.payable_amount}</span>
                                        </td>
                                        <td style={{ padding: '20px' }}>{sub.Buyer_name || sub.task?.buyer?.name}</td>
                                        <td style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                            {new Date(sub.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '20px' }}>{getStatusBadge(sub.status)}</td>
                                        <td style={{ padding: '20px', fontSize: '13px', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                            {sub.reviewNote || (sub.status === 'pending' ? 'Waiting for review...' : '-')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ padding: '80px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                                        <p>You haven't submitted any tasks yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MySubmissions;
