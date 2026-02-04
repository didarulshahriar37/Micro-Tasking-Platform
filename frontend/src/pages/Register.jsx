import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        profileImage: '',
        role: 'worker'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const user = await googleLogin();
            if (user.role === 'worker') {
                navigate('/worker');
            } else if (user.role === 'buyer') {
                navigate('/buyer');
            }
        } catch (err) {
            setError('Google registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validatePassword = (pass) => {
        // 6+ characters, one uppercase, one number
        const regex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        return regex.test(pass);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validatePassword(formData.password)) {
            setError('Password must be at least 6 characters, include one uppercase letter and one number.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const user = await register(
                formData.name,
                formData.email,
                formData.password,
                formData.role,
                formData.profileImage
            );

            // Redirect based on role
            if (user.role === 'worker') {
                navigate('/worker');
            } else if (user.role === 'buyer') {
                navigate('/buyer');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
            <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
                <h1 style={{ marginBottom: '12px', textAlign: 'center', fontSize: '28px' }}>
                    Join <span style={{ color: 'var(--primary-color)' }}>MicroTask</span>
                </h1>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    Create your account to start earning or buying.
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
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="input-group">
                        <label>Profile Picture URL</label>
                        <input
                            type="url"
                            name="profileImage"
                            value={formData.profileImage}
                            onChange={handleChange}
                            required
                            placeholder="https://example.com/photo.jpg"
                        />
                    </div>

                    <div className="grid grid-2" style={{ gap: '16px' }}>
                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>I want to join as</label>
                        <select name="role" value={formData.role} onChange={handleChange} style={{ cursor: 'pointer' }}>
                            <option value="worker">Worker (Complete tasks to earn)</option>
                            <option value="buyer">Buyer (Create tasks for others)</option>
                        </select>
                        <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--primary-color)' }}>
                            {formData.role === 'worker' ? '🎁 Sign up as Worker and get 10 coins!' : '🎁 Sign up as Buyer and get 50 coins!'}
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '12px', height: '48px', justifyContent: 'center' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Register Now'}
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
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600' }}>
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
