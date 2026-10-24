import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, MapPin, Play, Ticket, ChevronRight, Award, Film, Users } from 'lucide-react';

export const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [showTrailer, setShowTrailer] = useState(false);

  // Helper to generate 3 consecutive dates (Today, Tomorrow, Day After)
  const getDates = () => {
    const list = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const formatted = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      list.push({ iso, dayName, formatted });
    }
    return list;
  };

  const dates = getDates();

  useEffect(() => {
    setSelectedDate(dates[0].iso);
  }, []);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const res = await fetch(`/api/movies/${id}`);
        const data = await res.json();
        if (data.success) {
          setMovie(data.movie);
          setShows(data.shows || []);
        }
      } catch (err) {
        console.error('Failed to load movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: '#8b5cf6', fontSize: '1.2rem' }}>
        Loading cinema experience...
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 24px' }}>
        <h2>Movie Not Found</h2>
        <Link to="/movies" className="btn-primary" style={{ marginTop: 20 }}>
          Back to Movies
        </Link>
      </div>
    );
  }

  // Filter shows by selected date
  const filteredShows = shows.filter((s) => s.showDate === selectedDate);

  // Group shows by Theatre
  const showsByTheatre = filteredShows.reduce((acc, show) => {
    const theatreName = show.theatre?.name || 'Grand Multiplex';
    if (!acc[theatreName]) {
      acc[theatreName] = {
        theatre: show.theatre,
        shows: [],
      };
    }
    acc[theatreName].shows.push(show);
    return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {/* Movie Hero Header */}
      <div style={{
        position: 'relative',
        minHeight: 480,
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        {/* Backdrop */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${movie.backdrop || movie.poster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          filter: 'brightness(0.35) contrast(1.15)',
        }} />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 40%, #07090e 100%)',
        }} />

        <div style={{
          maxWidth: 1300,
          margin: '0 auto',
          padding: '40px 24px',
          position: 'relative',
          zIndex: 10,
          width: '100%',
          display: 'flex',
          gap: 36,
          alignItems: 'flex-end',
          flexWrap: 'wrap',
        }}>
          {/* Poster Card */}
          <div style={{
            width: 220,
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            flexShrink: 0,
          }}>
            <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: 320, objectFit: 'cover' }} />
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
              <span className="badge badge-gold">
                <Star size={13} fill="#fbbf24" /> {movie.rating} / 10
              </span>
              <span className="badge badge-purple">
                {movie.certification || 'UA'}
              </span>
              <span className="badge badge-cyan">
                {movie.duration} Minutes
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: '#fff', marginBottom: 14 }}>
              {movie.title}
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, maxWidth: 800, marginBottom: 20 }}>
              {movie.description}
            </p>

            {/* Cast & Crew Pills */}
            <div style={{ display: 'flex', gap: 20, color: '#94a3b8', fontSize: '0.88rem', flexWrap: 'wrap', marginBottom: 24 }}>
              <div>
                <strong style={{ color: '#fff' }}>Director:</strong> {movie.director || 'Director'}
              </div>
              <div>
                <strong style={{ color: '#fff' }}>Cast:</strong> {movie.cast?.join(', ')}
              </div>
              <div>
                <strong style={{ color: '#fff' }}>Languages:</strong> {movie.language?.join(', ')}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 14 }}>
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ padding: '10px 20px' }}
              >
                <Play size={16} fill="currentColor" />
                <span>Watch Trailer</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes & Booking Section */}
      <div style={{ maxWidth: 1300, margin: '40px auto 0', padding: '0 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
            Select Date & Showtimes
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Choose a date and your preferred cinema location to reserve live seats
          </p>
        </div>

        {/* Date Selector Tabs */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginBottom: 32,
          overflowX: 'auto',
          paddingBottom: 8,
        }}>
          {dates.map((d) => (
            <button
              key={d.iso}
              onClick={() => setSelectedDate(d.iso)}
              style={{
                padding: '12px 24px',
                borderRadius: 14,
                background: selectedDate === d.iso ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${selectedDate === d.iso ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)'}`,
                color: selectedDate === d.iso ? '#fff' : '#cbd5e1',
                cursor: 'pointer',
                textAlign: 'center',
                minWidth: 120,
                transition: 'var(--transition)',
              }}
            >
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.8 }}>
                {d.dayName}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: 2 }}>
                {d.formatted}
              </div>
            </button>
          ))}
        </div>

        {/* Theatres List */}
        {Object.keys(showsByTheatre).length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <Calendar size={36} color="#8b5cf6" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: 6 }}>
              No shows scheduled for {selectedDate}
            </h3>
            <p style={{ color: '#94a3b8' }}>
              Please select another date above or check back shortly for updated cinema schedules.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {Object.entries(showsByTheatre).map(([theatreName, group]) => (
              <div key={theatreName} className="glass-panel" style={{ padding: '24px 28px' }}>
                {/* Theatre Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: 16,
                  marginBottom: 20,
                  flexWrap: 'wrap',
                  gap: 12,
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                      {theatreName}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 }}>
                      <MapPin size={14} />
                      <span>{group.theatre?.address || group.theatre?.location || 'Downtown Sector'}</span>
                    </div>
                  </div>

                  {/* Facilities tags */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {group.theatre?.facilities?.slice(0, 3).map((f, i) => (
                      <span key={i} className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Showtimes Buttons */}
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  {group.shows.map((show) => (
                    <button
                      key={show._id}
                      onClick={() => navigate(`/booking/${show._id}`)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: 12,
                        padding: '12px 18px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'var(--transition)',
                      }}
                      className="showtime-btn"
                    >
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                        {show.showTime}
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 700 }}>
                          {show.format}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#34d399' }}>
                          {show.availableSeats} seats left
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .showtime-btn:hover {
          background: rgba(139, 92, 246, 0.2) !important;
          border-color: #8b5cf6 !important;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.35);
        }
      `}</style>
    </div>
  );
};
