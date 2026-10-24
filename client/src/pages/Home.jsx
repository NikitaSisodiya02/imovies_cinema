import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Ticket, Sparkles, Star, ShieldCheck, Zap, Video, Monitor, ChevronRight } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';

export const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('now_showing');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('/api/movies');
        const data = await res.json();
        if (data.success) {
          setMovies(data.movies);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const featuredMovie = movies.find((m) => m.featured && m.status === 'now_showing') || movies[0];
  const filteredMovies = movies.filter((m) => m.status === activeTab);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 60 }}>
      {/* Hero Showcase Section */}
      {featuredMovie && (
        <section style={{
          position: 'relative',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          {/* Backdrop Image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${featuredMovie.backdrop || featuredMovie.poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            filter: 'brightness(0.38) contrast(1.15)',
          }} />

          {/* Gradients */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #07090e 15%, rgba(7,9,14,0.7) 60%, transparent 100%)',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 60%, #07090e 100%)',
          }} />

          {/* Content */}
          <div style={{
            maxWidth: 1300,
            margin: '0 auto',
            padding: '40px 24px',
            position: 'relative',
            zIndex: 10,
            width: '100%',
          }}>
            <div style={{ maxWidth: 650 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span className="badge badge-purple">
                  <Sparkles size={13} /> Premiere Spotlight
                </span>
                <span className="badge badge-gold">
                  <Star size={13} fill="#fbbf24" /> {featuredMovie.rating} IMDb
                </span>
                <span className="badge badge-cyan">
                  {featuredMovie.formats?.[0] || 'IMAX 3D'}
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: 1.1,
                fontWeight: 900,
                color: '#fff',
                marginBottom: 18,
                letterSpacing: '-0.03em',
              }}>
                {featuredMovie.title}
              </h1>

              <p style={{
                color: '#cbd5e1',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                marginBottom: 28,
              }}>
                {featuredMovie.description}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                color: '#94a3b8',
                fontSize: '0.9rem',
                marginBottom: 32,
              }}>
                <span><strong>Duration:</strong> {featuredMovie.duration} mins</span>
                <span>•</span>
                <span><strong>Genre:</strong> {featuredMovie.genre?.join(', ')}</span>
                <span>•</span>
                <span><strong>Director:</strong> {featuredMovie.director}</span>
              </div>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link to={`/movie/${featuredMovie._id}`} className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
                  <Ticket size={18} />
                  <span>Reserve Seats Now</span>
                </Link>
                <a
                  href={featuredMovie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ padding: '14px 24px', fontSize: '1rem' }}
                >
                  <Play size={18} fill="currentColor" />
                  <span>Watch Trailer</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Live Feature Highlights Bar */}
      <div style={{
        maxWidth: 1200,
        margin: '-30px auto 50px',
        position: 'relative',
        zIndex: 20,
        padding: '0 20px',
      }}>
        <div className="glass-panel" style={{
          padding: '24px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ padding: 10, borderRadius: 12, background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
              <Zap size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Live Seat Locking</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Real-time Socket.io engine</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ padding: 10, borderRadius: 12, background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8' }}>
              <Monitor size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>IMAX Laser & Atmos</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>64-Channel spatial sound</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ padding: 10, borderRadius: 12, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              <Video size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Instant QR Pass</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Contactless cinema entry</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ padding: 10, borderRadius: 12, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Zero-Fee Cancellation</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Instant wallet & card refunds</div>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Grid Section */}
      <section style={{ maxWidth: 1300, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 30,
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
              Explore Blockbusters
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: 4 }}>
              Select your favorite movie, view showtimes, and book VIP recliner seats
            </p>
          </div>

          {/* Tab Filter */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: 4,
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <button
              onClick={() => setActiveTab('now_showing')}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                fontSize: '0.88rem',
                fontWeight: 600,
                background: activeTab === 'now_showing' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'now_showing' ? '#fff' : '#94a3b8',
                transition: 'var(--transition)',
              }}
            >
              Now Showing
            </button>
            <button
              onClick={() => setActiveTab('coming_soon')}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                fontSize: '0.88rem',
                fontWeight: 600,
                background: activeTab === 'coming_soon' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'coming_soon' ? '#fff' : '#94a3b8',
                transition: 'var(--transition)',
              }}
            >
              Coming Soon
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#8b5cf6' }}>
            Loading blockbuster listings...
          </div>
        ) : (
          <div className="grid-movies">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
