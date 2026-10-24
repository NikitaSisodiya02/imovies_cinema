import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';

const GENRES = ['All', 'Sci-Fi', 'Action', 'Adventure', 'Drama', 'Cyberpunk', 'Biography', 'Animation'];
const LANGUAGES = ['All', 'English', 'Spanish', 'Japanese', 'German'];

export const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchFilteredMovies = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (selectedGenre !== 'All') query.append('genre', selectedGenre);
      if (selectedLanguage !== 'All') query.append('language', selectedLanguage);
      if (selectedStatus !== 'All') query.append('status', selectedStatus);

      const res = await fetch(`/api/movies?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setMovies(data.movies);
      }
    } catch (err) {
      console.error('Failed to load movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredMovies();
  }, [search, selectedGenre, selectedLanguage, selectedStatus]);

  const handleReset = () => {
    setSearch('');
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setSelectedStatus('All');
    setSearchParams({});
  };

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '40px 24px', minHeight: '85vh' }}>
      {/* Page Title */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff' }}>
          Explore All Movies
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: 4 }}>
          Search, filter by genre or language, and choose your preferred theatre experience.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: 36 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          {/* Search box */}
          <div style={{
            flex: 1,
            minWidth: 280,
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
            padding: '10px 16px',
          }}>
            <Search size={18} color="#94a3b8" style={{ marginRight: 10 }} />
            <input
              type="text"
              placeholder="Search by title, director, or cast..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

          {/* Status selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              background: '#121622',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 12,
              padding: '10px 16px',
              fontSize: '0.9rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="All">All Statuses</option>
            <option value="now_showing">Now Showing</option>
            <option value="coming_soon">Coming Soon</option>
          </select>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.88rem' }}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>

        {/* Genre Pills */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>
            Filter by Genre
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: selectedGenre === g ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedGenre === g ? '#fff' : '#cbd5e1',
                  border: `1px solid ${selectedGenre === g ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)'}`,
                  transition: 'var(--transition)',
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Language Pills */}
        <div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>
            Filter by Language
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLanguage(l)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  background: selectedLanguage === l ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedLanguage === l ? '#38bdf8' : '#94a3b8',
                  border: `1px solid ${selectedLanguage === l ? '#06b6d4' : 'rgba(255, 255, 255, 0.06)'}`,
                  transition: 'var(--transition)',
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Movies Result Grid */}
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Showing <strong>{movies.length}</strong> movies
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#8b5cf6' }}>
          Filtering movies...
        </div>
      ) : movies.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: 8 }}>No movies found matching criteria</h3>
          <p style={{ color: '#94a3b8', marginBottom: 20 }}>Try resetting your search query or selecting other genres.</p>
          <button onClick={handleReset} className="btn-primary">
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid-movies">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};
