import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService, withdrawalService } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalWorkers: 0,
        totalBuyers: 0,
        totalAvailableCoins: 0,
        totalPayments: 0
    });
    const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, withdrawalsRes] = await Promise.all([
                userService.getStats(),
                withdrawalService.getAllWithdrawals()
            ]);

            if (statsRes.data.stats) {
                setStats(statsRes.data.stats);
            }

            // Filter pending withdrawals for the table
            const pending = withdrawalsRes.data.withdrawals.filter(w => w.status === 'pending');
            setPendingWithdrawals(pending);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (withdrawalId) => {
        if (!window.confirm('Confirm payment success? This will mark the request as approved and deduct coins from the worker.')) return;

        try {
            await withdrawalService.approveWithdrawal(withdrawalId);
            toast.success('Payment successfully processed!');
            fetchDashboardData();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to process payment');
        }
    };

    if (loading) return <DashboardLayout><div className="loading">Loading Admin info...</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
                    Admin <span style={{ color: 'var(--primary-color)' }}>Overview</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>Monitoring platform activity and processing payments.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-4" style={{ gap: '24px', marginBottom: '48px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>👷</div>
                    <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Workers</h3>
                    <p style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary-color)' }}>{stats.totalWorkers}</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>🤝</div>
                    <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Buyers</h3>
                    <p style={{ fontSize: '32px', fontWeight: '800', color: 'var(--secondary-color)' }}>{stats.totalBuyers}</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>💰</div>
                    <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available Coin</h3>
                    <p style={{ fontSize: '32px', fontWeight: '800', color: '#f59e0b' }}>{stats.totalAvailableCoins}</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>💸</div>
                    <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Payments</h3>
                    <p style={{ fontSize: '32px', fontWeight: '800', color: '#10b981' }}>${stats.totalPayments.toFixed(2)}</p>
                </div>
            </div>

            {/* Withdraw Request Table */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Withdrawal Requests</h2>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th style={{ padding: '20px' }}>Worker Name</th>
                                <th style={{ padding: '20px' }}>Withdraw Coin</th>
                                <th style={{ padding: '20px' }}>Withdraw Amount ($)</th>
                                <th style={{ padding: '20px' }}>Payment System</th>
                                <th style={{ padding: '20px' }}>Account</th>
                                <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingWithdrawals.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No pending withdrawal requests.
                                    </td>
                                </tr>
                            ) : (
                                pendingWithdrawals.map((withdraw) => (
                                    <tr key={withdraw._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '20px' }}>
                                            <div style={{ fontWeight: '600' }}>{withdraw.worker_name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{withdraw.worker_email}</div>
                                        </td>
                                        <td style={{ padding: '20px' }}>{withdraw.withdrawal_coin}</td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ color: '#10b981', fontWeight: '700' }}>${withdraw.withdrawal_amount}</span>
                                        </td>
                                        <td style={{ padding: '20px' }}>{withdraw.payment_system}</td>
                                        <td style={{ padding: '20px' }}>{withdraw.account_number}</td>
                                        <td style={{ padding: '20px', textAlign: 'right' }}>
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '8px 16px', fontSize: '13px', background: '#10b981', borderColor: '#10b981' }}
                                                onClick={() => handlePaymentSuccess(withdraw._id)}
                                            >
                                                ✅ Payment Success
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

export default AdminDashboard;
