import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, Eye, Film, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TicketModal } from '../components/TicketModal';

export const MyBookings = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    return b.bookingStatus === activeTab;
  });

  const handleBookingCancelled = (updatedBooking) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === updatedBooking._id ? updatedBooking : b))
    );
    setSelectedBookingForModal(updatedBooking);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto 80px', padding: '0 24px', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>
            My Cinema Tickets
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            View your active movie passes, digital QR codes, and reservation history
          </p>
        </div>

        {/* Tab Filters */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: 4,
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: '0.85rem',
              fontWeight: 600,
              background: activeTab === 'all' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'all' ? '#fff' : '#94a3b8',
            }}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('confirmed')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: '0.85rem',
              fontWeight: 600,
              background: activeTab === 'confirmed' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'confirmed' ? '#fff' : '#94a3b8',
            }}
          >
            Confirmed
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: '0.85rem',
              fontWeight: 600,
              background: activeTab === 'cancelled' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'cancelled' ? '#fff' : '#94a3b8',
            }}
          >
            Cancelled
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#8b5cf6' }}>
          Retrieving your tickets...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎟️</div>
          <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: 8 }}>
            No tickets found in this tab
          </h3>
          <p style={{ color: '#94a3b8', marginBottom: 24 }}>
            Explore our curated movies list and book your next cinema experience.
          </p>
          <Link to="/movies" className="btn-primary">
            <Film size={18} />
            <span>Browse Movies</span>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 20,
                borderLeft: `4px solid ${b.bookingStatus === 'confirmed' ? '#10b981' : '#f43f5e'}`,
              }}
            >
              {/* Left Movie Info */}
              <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                <img
                  src={b.movie?.poster || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80'}
                  alt={b.movie?.title}
                  style={{ width: 70, height: 100, borderRadius: 10, objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span className={`badge ${b.bookingStatus === 'confirmed' ? 'badge-emerald' : 'badge-gold'}`}>
                      {b.bookingStatus?.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Ref: {b.bookingNumber}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                    {b.movie?.title || 'Cinema Screening'}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#94a3b8', fontSize: '0.85rem', marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={13} color="#8b5cf6" /> {b.theatre?.name}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={13} color="#38bdf8" /> {b.show?.showDate || 'Scheduled'}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={13} color="#fbbf24" /> {b.show?.showTime || 'Time'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Seat & Price Info */}
              <div style={{ textAlign: 'right', minWidth: 140 }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                  Seats ({b.seats?.length})
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8', marginTop: 2 }}>
                  {b.seats?.join(', ')}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginTop: 4 }}>
                  ${b.totalAmount}
                </div>
              </div>

              {/* Right View Pass Button */}
              <div>
                <button
                  onClick={() => setSelectedBookingForModal(b)}
                  className="btn-primary"
                  style={{ padding: '10px 18px', fontSize: '0.88rem' }}
                >
                  <Eye size={15} />
                  <span>View Pass / QR</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Modal */}
      {selectedBookingForModal && (
        <TicketModal
          booking={selectedBookingForModal}
          onClose={() => setSelectedBookingForModal(null)}
          onCancelled={handleBookingCancelled}
        />
      )}
    </div>
  );
};
