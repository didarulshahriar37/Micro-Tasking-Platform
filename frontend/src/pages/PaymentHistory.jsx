import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await transactionService.getTransactions({ type: 'purchase' });
            setPayments(response.data.transactions);
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <DashboardLayout><div className="loading">Loading payment history...</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Payment History</h1>
                <p style={{ color: 'var(--text-secondary)' }}>View all your coin purchases and transaction logs.</p>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                        <tr>
                            <th style={{ padding: '20px' }}>Transaction ID</th>
                            <th style={{ padding: '20px' }}>Amount (Coins)</th>
                            <th style={{ padding: '20px' }}>Status</th>
                            <th style={{ padding: '20px' }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No payment history found.
                                </td>
                            </tr>
                        ) : (
                            payments.map((payment) => (
                                <tr key={payment._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '20px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                                        {payment._id}
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{ color: '#34d399', fontWeight: '600' }}>💰 {payment.amount}</span>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <span className="badge badge-success">Success</span>
                                    </td>
                                    <td style={{ padding: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                        {new Date(payment.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default PaymentHistory;
