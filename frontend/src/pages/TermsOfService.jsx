import React from 'react';
import MainLayout from '../components/MainLayout';

const TermsOfService = () => {
    return (
        <MainLayout>
            <title>Terms of Service | MicroTask</title>
            <div style={{ padding: '60px 0', background: 'var(--bg-primary)' }}>
                <div className="container">
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: '800', marginBottom: '12px' }}>
                                Terms of Service
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
                                Please read these terms carefully before using MicroTask.
                            </p>
                        </div>

                        <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
                            <section>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Acceptance of Terms</h2>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                    By accessing or using MicroTask, you agree to comply with and be bound by these Terms of Service.
                                </p>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Account Responsibilities</h2>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                    You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
                                </p>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Task Guidelines</h2>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                    Buyers must provide accurate task descriptions and requirements. Workers must submit original work that satisfies the posted requirements.
                                </p>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Payments and Rewards</h2>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                    Payment terms are governed by the task payout settings and submission approvals. MicroTask reserves the right to investigate disputes.
                                </p>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Prohibited Use</h2>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                    You may not use the platform for unlawful activities, spam, fraud, or any behavior that compromises platform integrity.
                                </p>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Changes to Terms</h2>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                    We may update these terms periodically. Continued use of the platform after changes indicates acceptance of the updated terms.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default TermsOfService;
