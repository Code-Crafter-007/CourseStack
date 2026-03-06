import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { authService } from '../services/authService';
import type { UserRole } from '../types';
import '../styles/auth.css';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [role, setRole] = useState<UserRole>('student');
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const navigate = useNavigate();
    const { refreshProfile } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);
        setLoading(true);

        try {
            if (isLogin) {
                // Handle Supabase Login
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;
                setSuccessMsg('Successfully logged in!');

                // Force an immediate profile refresh directly into our Context Provider to clear race conditions
                await refreshProfile();

                // Fetch user profile to get role for redirect
                const profile = await authService.getUserProfile(data.user.id);
                if (profile) {
                    if (profile.role === 'student') navigate('/dashboard');
                    else if (profile.role === 'tutor') navigate('/tutor-dashboard');
                    else if (profile.role === 'admin') navigate('/admin-panel');
                    else navigate('/');
                } else {
                    navigate('/');
                }

            } else {
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match.");
                }

                // Handle Supabase Registration
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        }
                    }
                });

                if (error) throw error;

                if (data.user) {
                    await authService.createUserProfile(data.user.id, email, fullName, role, bio);
                    await refreshProfile();
                }

                setSuccessMsg('Registration successful! Redirecting...');

                // Redirect based on the role they just registered as
                setTimeout(() => {
                    if (role === 'student') navigate('/dashboard');
                    else if (role === 'tutor') navigate('/tutor-dashboard');
                    else navigate('/');
                }, 1500);
            }
        } catch (error: any) {
            setErrorMsg(error.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin((prev) => !prev);
        setErrorMsg(null);
        setSuccessMsg(null);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        setBio('');
        setRole('student');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Course Stack</h1>
                <p className="auth-subtitle">
                    {isLogin ? 'Welcome back to your learning journey' : 'Start your learning journey today'}
                </p>

                {errorMsg && <div className="auth-message error" style={{ color: '#ff6b6b', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>{errorMsg}</div>}
                {successMsg && <div className="auth-message success" style={{ color: '#51cf66', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>{successMsg}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div>
                            <div className="role-selector">
                                <div
                                    className={`role-card ${role === 'student' ? 'active' : ''}`}
                                    onClick={() => setRole('student')}
                                >
                                    <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>📚</span>
                                    <div className="role-title">Start Learning</div>
                                    <div className="role-desc">Join as Student</div>
                                </div>
                                <div
                                    className={`role-card ${role === 'tutor' ? 'active' : ''}`}
                                    onClick={() => setRole('tutor')}
                                >
                                    <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>🎓</span>
                                    <div className="role-title">Teach on Course Stack</div>
                                    <div className="role-desc">Become an Instructor</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isLogin && (
                        <div className="input-group">
                            <label htmlFor="fullName" className="input-label">Full Name</label>
                            <input
                                id="fullName"
                                type="text"
                                className="auth-input"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="email" className="input-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="auth-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password" className="input-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="auth-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="input-group">
                            <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className="auth-input"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required={!isLogin}
                            />
                        </div>
                    )}

                    {!isLogin && role === 'tutor' && (
                        <div className="input-group">
                            <label htmlFor="bio" className="input-label">Short Bio</label>
                            <textarea
                                id="bio"
                                className="auth-input"
                                style={{ minHeight: '80px', resize: 'vertical' }}
                                placeholder="Tell us about your teaching experience..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                required={!isLogin && role === 'tutor'}
                            />
                        </div>
                    )}

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
                    </button>
                </form>

                <div className="auth-toggle">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button type="button" onClick={toggleMode} className="auth-toggle-btn" disabled={loading}>
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
