import React, { useState } from 'react';
import { transactionService } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PurchaseCoin = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const coinPackages = [
        { coins: 10, price: 1, icon: '🥉' },
        { coins: 150, price: 10, icon: '🥈' },
        { coins: 500, price: 20, icon: '🥇' },
        { coins: 1000, price: 35, icon: '💎' },
    ];

    const handlePurchase = async (pkg) => {
        if (!window.confirm(`Purchase ${pkg.coins} coins for $${pkg.price}?`)) return;

        setLoading(true);
        try {
            // Simulated payment flow
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real app, this would be a Stripe checkout session result
            const response = await transactionService.purchaseCoins(pkg.coins);

            alert(`Payment Successful! ${pkg.coins} coins added to your account.`);
            updateUser({ ...user, coins: user.coins + pkg.coins });
            navigate('/buyer/payment-history');
        } catch (error) {
            alert('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>
                    Purchase <span style={{ color: 'var(--primary-color)' }}>Coins</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
                    Boost your balance to post more tasks and reach more workers.
                </p>
            </div>

            <div className="grid grid-2 lg:grid-4" style={{ gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
                {coinPackages.map((pkg) => (
                    <div
                        key={pkg.coins}
                        className="card"
                        style={{
                            textAlign: 'center',
                            padding: '40px 24px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            transition: 'transform 0.3s'
                        }}
                    >
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>{pkg.icon}</div>
                        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>{pkg.coins} Coins</h2>
                        <div style={{
                            fontSize: '24px',
                            color: '#34d399',
                            fontWeight: '700',
                            marginBottom: '32px',
                            padding: '8px 20px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '30px'
                        }}>
                            ${pkg.price}
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', height: '48px', justifyContent: 'center' }}
                            onClick={() => handlePurchase(pkg)}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Purchase Now'}
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '64px', textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                <h3>💳 Secure Payments</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                    We use Stripe to ensure your transactions are always safe and encrypted.
                </p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '24px', fontSize: '24px', opacity: 0.6 }}>
                    <span>VISA</span>
                    <span>MASTERCARD</span>
                    <span>AMEX</span>
                    <span>STRIPE</span>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PurchaseCoin;
