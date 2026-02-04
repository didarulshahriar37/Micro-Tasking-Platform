import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { withdrawalService } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import toast from 'react-hot-toast';

const Withdrawals = () => {
    const { user } = useAuth();
    const [coinsToWithdraw, setCoinsToWithdraw] = useState('');
    const [paymentSystem, setPaymentSystem] = useState('Stripe');
    const [accountNumber, setAccountNumber] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const COIN_TO_DOLLAR_RATE = 20;
    const MIN_COIN_WITHDRAWAL = 200;

    const withdrawalAmount = coinsToWithdraw ? (coinsToWithdraw / COIN_TO_DOLLAR_RATE).toFixed(2) : 0;
    const canWithdraw = user.coins >= MIN_COIN_WITHDRAWAL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (coinsToWithdraw > user.coins) {
            toast.error("You don't have enough coins!");
            return;
        }

        if (coinsToWithdraw < MIN_COIN_WITHDRAWAL) {
            toast.error(`Min withdrawal is ${MIN_COIN_WITHDRAWAL} coins.`);
            return;
        }

        setSubmitting(true);
        try {
            await withdrawalService.requestWithdrawal({
                withdrawal_coin: parseInt(coinsToWithdraw),
                withdrawal_amount: parseFloat(withdrawalAmount),
                payment_system: paymentSystem,
                account_number: accountNumber
            });

            toast.success('Withdrawal request submitted!');

            // Optionally update user coins locally if we want immediate feedback
            // But usually withdrawal requests don't deduct until approved.
            // Check requirement: "OnClick withdrawal button saves the data..." 
            // It doesn't say deduct immediately. Usually it's better to wait for admin approval.

            setCoinsToWithdraw('');
            setAccountNumber('');
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to submit withdrawal request.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Withdraw Funds</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Convert your hard-earned coins into real money.</p>
            </div>

            <div className="grid grid-2" style={{ gap: '48px', alignItems: 'start' }}>
                {/* Info Card */}
                <div>
                    <div className="card shadow-lg" style={{
                        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                        color: 'white',
                        padding: '40px',
                        border: 'none'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '16px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Current Balance</h3>
                            <div style={{ fontSize: '56px', fontWeight: '800', marginBottom: '8px' }}>💰 {user.coins}</div>
                            <div style={{ fontSize: '24px', opacity: 0.9 }}>📊 ${(user.coins / COIN_TO_DOLLAR_RATE).toFixed(2)} USD</div>
                        </div>

                        <div style={{
                            marginTop: '40px',
                            paddingTop: '32px',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '24px',
                            textAlign: 'center',
                            fontSize: '14px'
                        }}>
                            <div>
                                <div style={{ opacity: 0.6, marginBottom: '4px' }}>Rate</div>
                                <div style={{ fontWeight: '700' }}>20 Coins = $1</div>
                            </div>
                            <div>
                                <div style={{ opacity: 0.6, marginBottom: '4px' }}>Min. Withdrawal</div>
                                <div style={{ fontWeight: '700' }}>200 Coins ($10)</div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ marginTop: '24px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>💡 Withdrawal Tip</h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            Withdrawals are processed manually by administrators. Please allow 1-3 business days for the funds to reach your account.
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="card">
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '32px' }}>Withdrawal Request</h2>

                    {!canWithdraw ? (
                        <div style={{
                            padding: '32px',
                            background: 'rgba(239, 68, 68, 0.05)',
                            borderRadius: '16px',
                            border: '1px solid rgba(239, 68, 68, 0.1)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
                            <h3 style={{ color: 'var(--danger)', marginBottom: '8px' }}>Insufficient coin</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>You need at least 200 coins to make a withdrawal request.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="grid grid-2" style={{ gap: '20px' }}>
                                <div className="input-group">
                                    <label>Coin To Withdraw</label>
                                    <input
                                        type="number"
                                        value={coinsToWithdraw}
                                        onChange={(e) => setCoinsToWithdraw(e.target.value)}
                                        max={user.coins}
                                        min={MIN_COIN_WITHDRAWAL}
                                        required
                                        placeholder="e.g. 200"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Withdraw Amount ($)</label>
                                    <input
                                        type="number"
                                        value={withdrawalAmount}
                                        readOnly
                                        style={{ background: 'var(--bg-primary)', fontWeight: '700' }}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Select Payment System</label>
                                <select
                                    value={paymentSystem}
                                    onChange={(e) => setPaymentSystem(e.target.value)}
                                >
                                    <option value="Stripe">Stripe</option>
                                    <option value="Bkash">Bkash</option>
                                    <option value="Rocket">Rocket</option>
                                    <option value="Nagad">Nagad</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Account Number</label>
                                <input
                                    type="text"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    required
                                    placeholder="Enter your wallet or account number"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submitting}
                                style={{ height: '56px', fontSize: '18px', marginTop: '16px' }}
                            >
                                {submitting ? 'Processing...' : '🚀 Submit Request'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Withdrawals;
