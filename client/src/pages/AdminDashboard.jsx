import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Film, Video, Calendar, DollarSign, Users, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form states for adding movie
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    poster: '',
    backdrop: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    duration: 135,
    releaseDate: new Date().toISOString().split('T')[0],
    rating: 8.5,
    director: '',
    status: 'now_showing',
  });

  // Form states for adding show
  const [showForm, setShowForm] = useState({
    movieId: '',
    theatreId: '',
    screenName: 'Screen 1 - IMAX Laser',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '07:30 PM',
    language: 'English',
    format: 'IMAX 3D',
    vipPrice: 420,
    premiumPrice: 300,
    standardPrice: 200,
  });

  const fetchData = async () => {
    try {
      const [resStats, resMovies, resTheatres, resShows] = await Promise.all([
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/movies'),
        fetch('/api/theatres'),
        fetch('/api/shows'),
      ]);

      const [dataStats, dataMovies, dataTheatres, dataShows] = await Promise.all([
        resStats.json(),
        resMovies.json(),
        resTheatres.json(),
        resShows.json(),
      ]);

      if (dataStats.success) setStats(dataStats.stats);
      if (dataMovies.success) {
        setMovies(dataMovies.movies);
        if (dataMovies.movies.length > 0 && !showForm.movieId) {
          setShowForm((prev) => ({ ...prev, movieId: dataMovies.movies[0]._id }));
        }
      }
      if (dataTheatres.success) {
        setTheatres(dataTheatres.theatres);
        if (dataTheatres.theatres.length > 0 && !showForm.theatreId) {
          setShowForm((prev) => ({ ...prev, theatreId: dataTheatres.theatres[0]._id }));
        }
      }
      if (dataShows.success) setShows(dataShows.shows);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Handle Add Movie
  const handleAddMovie = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...movieForm,
          genre: movieForm.genre.split(',').map((g) => g.trim()),
          language: movieForm.language.split(',').map((l) => l.trim()),
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to add movie');

      setMessage('Movie added successfully! 🎬');
      setMovieForm({
        title: '',
        description: '',
        poster: '',
        backdrop: '',
        genre: 'Action, Sci-Fi',
        language: 'English',
        duration: 135,
        releaseDate: new Date().toISOString().split('T')[0],
        rating: 8.5,
        director: '',
        status: 'now_showing',
      });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Delete Movie
  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Delete this movie and its associated showtimes?')) return;
    try {
      const res = await fetch(`/api/movies/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Movie removed from library');
        fetchData();
      }
    } catch (err) {
      setError('Failed to delete movie');
    }
  };

  // Handle Add Show
  const handleAddShow = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/shows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movie: showForm.movieId,
          theatre: showForm.theatreId,
          screenName: showForm.screenName,
          showDate: showForm.showDate,
          showTime: showForm.showTime,
          language: showForm.language,
          format: showForm.format,
          pricing: {
            vip: Number(showForm.vipPrice),
            premium: Number(showForm.premiumPrice),
            standard: Number(showForm.standardPrice),
          },
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to schedule show');

      setMessage('Show scheduled successfully! 🎟️');
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Delete Show
  const handleDeleteShow = async (id) => {
    if (!window.confirm('Delete this show?')) return;
    try {
      const res = await fetch(`/api/shows/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Show schedule deleted');
        fetchData();
      }
    } catch (err) {
      setError('Failed to delete show');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: '#8b5cf6' }}>
        Loading cinema management dashboard...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1300, margin: '40px auto 80px', padding: '0 24px' }}>
      {/* Dashboard Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: 6 }}>
            SUPERADMIN PRIVILEGES
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', marginTop: 4 }}>
            Cinema Command Center
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Real-time management for movies, schedules, theatres, and ticket transactions
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: 4,
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              fontSize: '0.88rem',
              fontWeight: 600,
              background: activeTab === 'overview' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'overview' ? '#fff' : '#94a3b8',
            }}
          >
            Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab('movies')}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              fontSize: '0.88rem',
              fontWeight: 600,
              background: activeTab === 'movies' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'movies' ? '#fff' : '#94a3b8',
            }}
          >
            Manage Movies ({movies.length})
          </button>
          <button
            onClick={() => setActiveTab('shows')}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              fontSize: '0.88rem',
              fontWeight: 600,
              background: activeTab === 'shows' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'shows' ? '#fff' : '#94a3b8',
            }}
          >
            Schedule Shows ({shows.length})
          </button>
        </div>
      </div>

      {message && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          padding: '12px 18px',
          borderRadius: 12,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          padding: '12px 18px',
          borderRadius: 12,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'overview' && (
        <div>
          {/* KPI Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
            marginBottom: 36,
          }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Total Revenue</span>
                <DollarSign size={20} color="#34d399" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#34d399' }}>
                ${stats?.totalRevenue?.toLocaleString() || 0}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
                Realized box office receipts
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Tickets Sold</span>
                <Film size={20} color="#38bdf8" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#38bdf8' }}>
                {stats?.totalTicketsSold || 0}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
                Across all IMAX & Atmos screens
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Library Titles</span>
                <Video size={20} color="#c084fc" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#c084fc' }}>
                {stats?.totalMovies || 0}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
                Active in theatre distribution
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Registered Users</span>
                <Users size={20} color="#fbbf24" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fbbf24' }}>
                {stats?.totalUsers || 0}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
                Verified customer accounts
              </div>
            </div>
          </div>

          {/* Recent Bookings Ledger Table */}
          <div className="glass-panel" style={{ padding: '28px', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: 18 }}>
              Recent Ticket Transactions
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Ref #</th>
                  <th style={{ padding: '12px 14px' }}>Customer</th>
                  <th style={{ padding: '12px 14px' }}>Movie</th>
                  <th style={{ padding: '12px 14px' }}>Theatre</th>
                  <th style={{ padding: '12px 14px' }}>Seats</th>
                  <th style={{ padding: '12px 14px' }}>Amount</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentBookings?.map((b) => (
                  <tr key={b._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '0.88rem' }}>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#fff' }}>{b.bookingNumber}</td>
                    <td style={{ padding: '14px', color: '#cbd5e1' }}>{b.user}</td>
                    <td style={{ padding: '14px', color: '#38bdf8' }}>{b.movie}</td>
                    <td style={{ padding: '14px', color: '#94a3b8' }}>{b.theatre}</td>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#c084fc' }}>{b.seats?.join(', ')}</td>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#34d399' }}>${b.totalAmount}</td>
                    <td style={{ padding: '14px' }}>
                      <span className={`badge ${b.bookingStatus === 'confirmed' ? 'badge-emerald' : 'badge-gold'}`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE MOVIES */}
      {activeTab === 'movies' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 32 }} className="admin-grid">
          {/* Add Movie Form */}
          <div className="glass-panel" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={18} color="#8b5cf6" />
              <span>Add New Blockbuster</span>
            </h3>

            <form onSubmit={handleAddMovie} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Movie Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gladiator II"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Synopsis / Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter compelling movie storyline..."
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Poster Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={movieForm.poster}
                  onChange={(e) => setMovieForm({ ...movieForm, poster: e.target.value })}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Genres (comma sep)</label>
                  <input
                    type="text"
                    value={movieForm.genre}
                    onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Duration (mins)</label>
                  <input
                    type="number"
                    value={movieForm.duration}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Status</label>
                  <select
                    value={movieForm.status}
                    onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                    style={{ width: '100%', background: '#121622', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', outline: 'none' }}
                  >
                    <option value="now_showing">Now Showing</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>IMDb Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    value={movieForm.rating}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: 10, justifyContent: 'center' }}>
                <Plus size={16} />
                <span>Save Movie to Database</span>
              </button>
            </form>
          </div>

          {/* Current Movies List */}
          <div className="glass-panel" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: 18 }}>
              Active Movie Library ({movies.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {movies.map((m) => (
                <div
                  key={m._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <img src={m.poster} alt={m.title} style={{ width: 45, height: 65, borderRadius: 6, objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{m.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        {m.duration}m • {m.genre?.join(', ')} • {m.status}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMovie(m._id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      padding: 8,
                      borderRadius: 8,
                      cursor: 'pointer',
                    }}
                    title="Delete Movie"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCHEDULE SHOWS */}
      {activeTab === 'shows' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 32 }} className="admin-grid">
          {/* Add Show Form */}
          <div className="glass-panel" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={18} color="#8b5cf6" />
              <span>Schedule New Show</span>
            </h3>

            <form onSubmit={handleAddShow} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Select Movie</label>
                <select
                  value={showForm.movieId}
                  onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })}
                  style={{ width: '100%', background: '#121622', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', outline: 'none' }}
                >
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Select Multiplex Theatre</label>
                <select
                  value={showForm.theatreId}
                  onChange={(e) => setShowForm({ ...showForm, theatreId: e.target.value })}
                  style={{ width: '100%', background: '#121622', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', outline: 'none' }}
                >
                  {theatres.map((t) => (
                    <option key={t._id} value={t._id}>{t.name} ({t.city})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Show Date</label>
                  <input
                    type="date"
                    value={showForm.showDate}
                    onChange={(e) => setShowForm({ ...showForm, showDate: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Show Time</label>
                  <input
                    type="text"
                    value={showForm.showTime}
                    placeholder="e.g. 08:15 PM"
                    onChange={(e) => setShowForm({ ...showForm, showTime: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Format</label>
                  <select
                    value={showForm.format}
                    onChange={(e) => setShowForm({ ...showForm, format: e.target.value })}
                    style={{ width: '100%', background: '#121622', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', outline: 'none' }}
                  >
                    <option value="IMAX 3D">IMAX 3D</option>
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                    <option value="4DX">4DX</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Screen Name</label>
                  <input
                    type="text"
                    value={showForm.screenName}
                    onChange={(e) => setShowForm({ ...showForm, screenName: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#fbbf24', display: 'block', marginBottom: 4 }}>VIP Price ($)</label>
                  <input
                    type="number"
                    value={showForm.vipPrice}
                    onChange={(e) => setShowForm({ ...showForm, vipPrice: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 10px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#c084fc', display: 'block', marginBottom: 4 }}>Prem Price ($)</label>
                  <input
                    type="number"
                    value={showForm.premiumPrice}
                    onChange={(e) => setShowForm({ ...showForm, premiumPrice: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 10px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'block', marginBottom: 4 }}>Std Price ($)</label>
                  <input
                    type="number"
                    value={showForm.standardPrice}
                    onChange={(e) => setShowForm({ ...showForm, standardPrice: e.target.value })}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 10px', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: 10, justifyContent: 'center' }}>
                <Plus size={16} />
                <span>Publish Show & Generate 60 Seats</span>
              </button>
            </form>
          </div>

          {/* Current Shows List */}
          <div className="glass-panel" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: 18 }}>
              Active Scheduled Shows ({shows.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {shows.map((s) => (
                <div
                  key={s._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                      {s.movie?.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>
                      {s.theatre?.name} • {s.showDate} at {s.showTime}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#c084fc', marginTop: 2 }}>
                      {s.format} • VIP: ${s.pricing?.vip} / Std: ${s.pricing?.standard}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteShow(s._id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      padding: 8,
                      borderRadius: 8,
                      cursor: 'pointer',
                    }}
                    title="Delete Show"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
