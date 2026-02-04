import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { authService, transactionService } from '../services/api';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const sessionId = searchParams.get('session_id');

    const hasVerified = React.useRef(false);

    useEffect(() => {
        if (sessionId && !hasVerified.current) {
            hasVerified.current = true;
            const verifyPayment = async () => {
                console.log('Starting verification for session:', sessionId);
                try {
                    const response = await transactionService.verifySession(sessionId);
                    console.log('Verification response:', response.data);

                    // Update user context with new balance
                    const profileRes = await authService.getProfile();
                    updateUser(profileRes.data.user);

                    // Only show success if it's the first time
                    if (response.data.message !== 'Coins already delivered') {
                        toast.success(response.data.message || 'Payment verified!', { duration: 5000 });
                    }
                } catch (error) {
                    console.error('Full Error Object:', error);
                    const errorMessage = error.response?.data?.error || error.message || 'Could not verify payment automatically.';
                    toast.error(`${errorMessage}`, { duration: 8000 });
                }
            };
            verifyPayment();
        }
    }, [sessionId, updateUser]);

    return (
        <DashboardLayout>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '80px', marginBottom: '24px' }}>🎉</div>
                <h1 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '16px' }}>Payment Successful!</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '500px', marginBottom: '32px' }}>
                    Thank you for your purchase. Your coins have been added to your balance.
                </p>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        onClick={() => navigate('/buyer/payment-history')}
                        className="btn btn-primary"
                    >
                        View History
                    </button>
                    <button
                        onClick={() => navigate('/buyer/add-task')}
                        className="btn btn-secondary"
                    >
                        Create a Task
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PaymentSuccess;
