import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from || '/';
  const bookingDraft = location.state?.bookingDraft;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      if (bookingDraft) {
        navigate(`/booking/${bookingDraft.showId}`);
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPw) => {
    setEmail(demoEmail);
    setPassword(demoPw);
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, demoPw);
      if (bookingDraft) {
        navigate(`/booking/${bookingDraft.showId}`);
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: 440,
        width: '100%',
        padding: '36px',
        position: 'relative',
      }}>
        {/* Logo Icon */}
        <div style={{
          width: 50,
          height: 50,
          borderRadius: 14,
          background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
        }}>
          <Film size={26} color="#fff" />
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, textAlign: 'center', color: '#fff', marginBottom: 6 }}>
          Welcome Back
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', marginBottom: 28 }}>
          Sign in to access your cinema passes and reservations
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: 10,
            fontSize: '0.85rem',
            marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
              Email Address
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 10,
              padding: '10px 14px',
            }}>
              <Mail size={16} color="#94a3b8" style={{ marginRight: 10 }} />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.92rem',
                  width: '100%',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 10,
              padding: '10px 14px',
            }}>
              <Lock size={16} color="#94a3b8" style={{ marginRight: 10 }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.92rem',
                  width: '100%',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', marginTop: 10 }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Logins Box */}
        <div style={{
          marginTop: 24,
          paddingTop: 20,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'center', marginBottom: 12, fontWeight: 700 }}>
            Instant One-Click Demo Access
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('alex@example.com', 'userpassword123')}
              className="btn-secondary"
              style={{ padding: '8px 10px', fontSize: '0.8rem', justifyContent: 'center' }}
            >
              <UserCheck size={14} color="#38bdf8" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@imovies.com', 'adminpassword123')}
              className="btn-secondary"
              style={{ padding: '8px 10px', fontSize: '0.8rem', justifyContent: 'center' }}
            >
              <ShieldCheck size={14} color="#c084fc" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.88rem', color: '#94a3b8' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create one now
          </Link>
        </div>
      </div>
    </div>
  );
};
