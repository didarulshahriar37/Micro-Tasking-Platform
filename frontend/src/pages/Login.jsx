import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const user = await googleLogin();
            // Redirect based on role (Default for Google is worker)
            if (user.role === 'worker') {
                navigate('/worker');
            } else if (user.role === 'buyer') {
                navigate('/buyer');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Google sign-in failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);

            // Redirect based on role
            if (user.role === 'worker') {
                navigate('/worker');
            } else if (user.role === 'buyer') {
                navigate('/buyer');
            } else if (user.role === 'admin') {
                navigate('/admin');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <title>Login | MicroTask</title>
            <Link to="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                marginBottom: '24px',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'color 0.2s'
            }}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
                <Home size={18} /> Back to Home
            </Link>
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <h1 style={{ marginBottom: '12px', textAlign: 'center', fontSize: '28px' }}>
                    Welcome <span style={{ color: 'var(--primary-color)' }}>Back</span>
                </h1>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    Login to access your dashboard.
                </p>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--danger)',
                        color: 'var(--danger)',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '12px', height: '48px', justifyContent: 'center' }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div style={{ textAlign: 'center', margin: '20px 0', position: 'relative' }}>
                        <hr style={{ border: '0', borderTop: '1px solid var(--border-color)' }} />
                        <span style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'var(--bg-card)',
                            padding: '0 10px',
                            color: 'var(--text-secondary)',
                            fontSize: '13px'
                        }}>OR</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="btn btn-secondary"
                        style={{ width: '100%', height: '48px', justifyContent: 'center', background: 'white', color: '#1e293b' }}
                        disabled={loading}
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px', marginRight: '8px' }} />
                        Continue with Google
                    </button>
                </form>

                <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600' }}>
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
