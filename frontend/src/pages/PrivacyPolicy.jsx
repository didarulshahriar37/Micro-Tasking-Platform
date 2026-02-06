import React from 'react';
import MainLayout from '../components/MainLayout';

const PrivacyPolicy = () => {
    return (
        <MainLayout>
            <title>Privacy Policy | MicroTask</title>
            <div style={{ padding: '60px 0', background: 'var(--bg-primary)' }}>
                <div className="container">
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: '800', marginBottom: '12px' }}>
                                Privacy Policy
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
                                Your privacy matters. This policy explains how we collect and use data.
                            </p>
                        </div>

                        <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
                            <section>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Information We Collect</h2>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                    We collect account details, task activity, and transaction records needed to operate the platform securely.
                                </p>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>How We Use Information</h2>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                    Data is used to provide services, process payments, prevent fraud, and improve the user experience.
                                </p>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Data Sharing</h2>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                    We share data only with trusted service providers required to operate the platform or when legally required.
                                </p>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Data Retention</h2>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                    We retain data as long as necessary for account maintenance, legal obligations, and platform security.
                                </p>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Your Choices</h2>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                    You can update your profile information and request account closure by contacting support.
                                </p>
                            </section>

                            <section>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>Policy Updates</h2>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                                    We may update this policy as needed. Changes will be reflected on this page.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PrivacyPolicy;
