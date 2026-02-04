import React, { useState } from 'react';
import { transactionService } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Medal, Gem, ShieldCheck } from 'lucide-react';

const PurchaseCoin = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const coinPackages = [
        { coins: 10, price: 1, icon: <Medal size={48} color="#cd7f32" /> },
        { coins: 150, price: 10, icon: <Medal size={48} color="#c0c0c0" /> },
        { coins: 500, price: 20, icon: <Medal size={48} color="#ffd700" /> },
        { coins: 1000, price: 35, icon: <Gem size={48} color="#4ade80" /> },
    ];

    const handlePurchase = async (pkg) => {
        setLoading(true);
        try {
            const response = await transactionService.createCheckoutSession({
                coins: pkg.coins,
                price: pkg.price
            });

            if (response.data.url) {
                // Redirect user to Stripe Checkout
                window.location.href = response.data.url;
            } else {
                toast.error('Failed to initialize local payment session');
            }
        } catch (error) {
            console.error('Purchase Error:', error);
            toast.error(error.response?.data?.error || 'Payment failed to initialize');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <title>Purchase Coins | Buyer</title>
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: 'clamp(28px, 6vw, 36px)', fontWeight: '800', marginBottom: '12px' }}>
                    Purchase <span style={{ color: 'var(--primary-color)' }}>Coins</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(14px, 4vw, 18px)' }}>
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
                        <div style={{ marginBottom: '20px' }}>{pkg.icon}</div>
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
                <h3><ShieldCheck size={24} style={{ verticalAlign: 'middle', marginRight: '8px', color: '#10b981' }} /> Secure Payments</h3>
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
