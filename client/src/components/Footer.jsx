import React from 'react';
import { Film, ShieldCheck, Heart, Sparkles, Layers, Cpu } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(11, 14, 22, 0.95)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '60px 24px 30px',
      marginTop: 80,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 40,
          marginBottom: 40,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #8b5cf6, #38bdf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Film size={20} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800 }}>
                IMOVIES
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 16 }}>
              The modern cinema ticketing experience powered by real-time Socket.io seat allocation, Dolby Atmos sound stage curation, and instant digital QR passes.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-purple"><Layers size={12} /> MERN Stack</span>
              <span className="badge badge-cyan"><Cpu size={12} /> Socket.io Live</span>
              <span className="badge badge-emerald"><ShieldCheck size={12} /> JWT Auth</span>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#f8fafc', marginBottom: 16, fontSize: '1rem', fontWeight: 700 }}>
              Cinemas & Sound Stages
            </h4>
            <ul style={{ listStyle: 'none', color: '#94a3b8', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li>IMAX Laser 4K Screens</li>
              <li>Dolby Atmos Precision Sound</li>
              <li>4DX Motion Synchronized Pods</li>
              <li>Director's VIP Leather Recliners</li>
              <li>In-Seat Gourmet Dining</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#f8fafc', marginBottom: 16, fontSize: '1rem', fontWeight: 700 }}>
              Guest Services
            </h4>
            <ul style={{ listStyle: 'none', color: '#94a3b8', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li>Instant Ticket Cancellation & Refund</li>
              <li>Digital QR Boarding Verification</li>
              <li>Corporate & Group Screenings</li>
              <li>Cinema Rewards & Loyalty Club</li>
              <li>24/7 Concierge Support</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#f8fafc', marginBottom: 16, fontSize: '1rem', fontWeight: 700 }}>
              Stay Updated
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: 12 }}>
              Get early access to midnight premieres, film festival passes, and exclusive discounts.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  flex: 1,
                }}
              />
              <button className="btn-primary" style={{ padding: '10px 16px', fontSize: '0.85rem' }}>
                Join
              </button>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          fontSize: '0.85rem',
          color: '#64748b',
        }}>
          <div>© {new Date().getFullYear()} IMovies Cinema Management System. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Crafted with <Heart size={14} color="#f43f5e" fill="#f43f5e" /> for cinema enthusiasts worldwide
          </div>
        </div>
      </div>
    </footer>
  );
};
