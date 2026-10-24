import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Ticket, LayoutDashboard, User, LogOut, Search, Radio, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      background: 'rgba(7, 9, 14, 0.85)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    }}>
      <div style={{
        maxWidth: 1300,
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #8b5cf6 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
          }}>
            <Film size={22} color="#fff" />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.45rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(90deg, #fff 30%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              IMOVIES
            </span>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: -4 }}>
              Cinema Experience
            </div>
          </div>
        </Link>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearch} style={{
          display: 'none',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 999,
          padding: '8px 18px',
          width: 320,
        }} className="desktop-search">
          <Search size={16} color="#94a3b8" style={{ marginRight: 10 }} />
          <input
            type="text"
            placeholder="Search movies, genres, actors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '0.88rem',
              width: '100%',
            }}
          />
        </form>

        {/* Live Socket Status Beacon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 12px',
          borderRadius: 999,
          background: connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${connected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
          fontSize: '0.75rem',
          color: connected ? '#34d399' : '#f87171',
        }}>
          <Radio size={14} className={connected ? 'pulse-icon' : ''} />
          <span>{connected ? 'Live Seat Engine' : 'Reconnecting...'}</span>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="desktop-nav">
          <Link to="/" style={{ fontWeight: 500, fontSize: '0.92rem', color: '#e2e8f0', transition: 'color 0.2s' }}>
            Home
          </Link>
          <Link to="/movies" style={{ fontWeight: 500, fontSize: '0.92rem', color: '#e2e8f0', transition: 'color 0.2s' }}>
            Movies
          </Link>
          
          {isAuthenticated && (
            <Link to="/my-bookings" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, fontSize: '0.92rem', color: '#e2e8f0' }}>
              <Ticket size={16} color="#8b5cf6" />
              <span>My Tickets</span>
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 8,
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#c084fc',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}>
              <LayoutDashboard size={15} />
              <span>Admin Panel</span>
            </Link>
          )}

          {/* User Auth Info */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={user.name}
                  style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #8b5cf6' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.name}</span>
              </div>
              <button
                onClick={logout}
                title="Logout"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#94a3b8',
                  padding: 8,
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                Get Started
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', background: 'transparent', color: '#fff', border: 'none' }}
          className="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .desktop-search, .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 901px) {
          .desktop-search { display: flex !important; }
          .desktop-nav { display: flex !important; }
        }
        .pulse-icon {
          animation: pulseIcon 2s infinite ease-in-out;
        }
        @keyframes pulseIcon {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </header>
  );
};
