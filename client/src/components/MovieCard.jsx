import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket, Sparkles } from 'lucide-react';

export const MovieCard = ({ movie }) => {
  return (
    <div style={{
      background: 'rgba(18, 22, 34, 0.65)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }} className="movie-card-hover">
      {/* Poster Image with overlay */}
      <div style={{ position: 'relative', width: '100%', height: 350, overflow: 'hidden' }}>
        <img
          src={movie.poster}
          alt={movie.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          className="poster-img"
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(7,9,14,0.9) 100%)',
        }} />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: 14,
          left: 14,
          right: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span className={`badge ${movie.status === 'now_showing' ? 'badge-emerald' : 'badge-purple'}`}>
            {movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
          </span>
          <div style={{
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            padding: '4px 8px',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: '#fbbf24',
            fontSize: '0.82rem',
            fontWeight: 700,
          }}>
            <Star size={14} fill="#fbbf24" />
            <span>{movie.rating}</span>
          </div>
        </div>

        {/* Formats Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 14,
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
        }}>
          {movie.formats?.slice(0, 2).map((fmt, i) => (
            <span key={i} style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(6px)',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 4,
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              {fmt}
            </span>
          ))}
        </div>
      </div>

      {/* Movie Details */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          marginBottom: 6,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: '#f8fafc',
        }}>
          {movie.title}
        </h3>

        {/* Metadata row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          color: '#94a3b8',
          fontSize: '0.8rem',
          marginBottom: 12,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={13} /> {movie.duration}m
          </span>
          <span>•</span>
          <span>{movie.certification || 'UA'}</span>
          <span>•</span>
          <span>{movie.language?.join(', ')}</span>
        </div>

        {/* Genre Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
          {movie.genre?.slice(0, 3).map((g, idx) => (
            <span key={idx} style={{
              fontSize: '0.72rem',
              color: '#cbd5e1',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '3px 8px',
              borderRadius: 6,
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
              {g}
            </span>
          ))}
        </div>

        {/* Book Button */}
        <div style={{ marginTop: 'auto' }}>
          <Link
            to={`/movie/${movie._id}`}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '10px 16px',
              fontSize: '0.9rem',
            }}
          >
            <Ticket size={16} />
            <span>{movie.status === 'now_showing' ? 'Book Tickets' : 'View Details'}</span>
          </Link>
        </div>
      </div>

      <style>{`
        .movie-card-hover:hover {
          transform: translateY(-6px);
          border-color: rgba(139, 92, 246, 0.4);
          box-shadow: 0 16px 36px -10px rgba(139, 92, 246, 0.25);
        }
        .movie-card-hover:hover .poster-img {
          transform: scale(1.06);
        }
      `}</style>
    </div>
  );
};
