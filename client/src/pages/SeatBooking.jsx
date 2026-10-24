import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Film, MapPin, Calendar, Clock, ShieldCheck, ChevronRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { SeatGrid } from '../components/SeatGrid';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export const SeatBooking = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { socket, connected } = useSocket();
  const { isAuthenticated } = useAuth();

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 mins lock countdown
  const [lockError, setLockError] = useState('');

  // Fetch initial show data & seats
  useEffect(() => {
    const fetchShowData = async () => {
      try {
        const res = await fetch(`/api/shows/${showId}`);
        const data = await res.json();
        if (data.success) {
          setShow(data.show);
          setSeats(data.seats || []);
        }
      } catch (err) {
        console.error('Failed to fetch show seats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowData();
  }, [showId]);

  // Real-time Socket.io seat synchronisation
  useEffect(() => {
    if (!socket || !showId) return;

    // Join room for this specific show
    socket.emit('show:join', { showId });

    // Handle full seat sync
    socket.on('seats:sync', ({ showId: sId, seats: incomingSeats }) => {
      if (sId === showId) {
        setSeats(incomingSeats);
      }
    });

    // Handle seat locked by another user
    socket.on('seat:locked', ({ showId: sId, seatNumber, lockedBy, seat }) => {
      if (sId === showId) {
        setSeats((prev) =>
          prev.map((s) => (s.seatNumber === seatNumber ? { ...s, status: 'locked', lockedBy } : s))
        );
      }
    });

    // Handle seat unlocked
    socket.on('seat:unlocked', ({ showId: sId, seatNumber }) => {
      if (sId === showId) {
        setSeats((prev) =>
          prev.map((s) => (s.seatNumber === seatNumber ? { ...s, status: 'available', lockedBy: null } : s))
        );
      }
    });

    // Handle seats booked
    socket.on('seats:booked', ({ showId: sId, seats: bookedNums }) => {
      if (sId === showId) {
        setSeats((prev) =>
          prev.map((s) => (bookedNums.includes(s.seatNumber) ? { ...s, status: 'booked' } : s))
        );
      }
    });

    // Handle lock errors
    socket.on('seat:error', ({ message }) => {
      setLockError(message);
      setTimeout(() => setLockError(''), 4000);
    });

    return () => {
      socket.emit('show:leave', { showId });
      socket.off('seats:sync');
      socket.off('seat:locked');
      socket.off('seat:unlocked');
      socket.off('seats:booked');
      socket.off('seat:error');
    };
  }, [socket, showId]);

  // Reservation countdown timer
  useEffect(() => {
    if (selectedSeats.length === 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto release selected seats
          selectedSeats.forEach((s) => {
            socket?.emit('seat:unlock', { showId, seatNumber: s.seatNumber });
          });
          setSelectedSeats([]);
          alert('Seat reservation hold time expired (5 minutes). Please re-select your seats.');
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSeats, socket, showId]);

  // Toggle seat selection
  const handleSeatToggle = (seat) => {
    setLockError('');
    const exists = selectedSeats.find((s) => s.seatNumber === seat.seatNumber);

    if (exists) {
      // Unlock seat
      if (socket) {
        socket.emit('seat:unlock', { showId, seatNumber: seat.seatNumber });
      }
      setSelectedSeats((prev) => prev.filter((s) => s.seatNumber !== seat.seatNumber));
    } else {
      // Max 8 tickets per transaction
      if (selectedSeats.length >= 8) {
        setLockError('Maximum 8 seats allowed per reservation');
        return;
      }
      // Lock seat
      if (socket) {
        socket.emit('seat:lock', { showId, seatNumber: seat.seatNumber });
      }
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: '#8b5cf6', fontSize: '1.2rem' }}>
        Loading cinema theatre layout...
      </div>
    );
  }

  if (!show) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 24px' }}>
        <h2>Showtime Not Found</h2>
        <Link to="/movies" className="btn-primary" style={{ marginTop: 20 }}>
          Back to Movies
        </Link>
      </div>
    );
  }

  // Price calculation
  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? 30 : 0;
  const totalAmount = subtotal + convenienceFee;

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) return;
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: `/booking/${showId}`,
          bookingDraft: { showId, selectedSeats, subtotal, convenienceFee, totalAmount },
        },
      });
      return;
    }

    navigate('/checkout', {
      state: {
        show,
        selectedSeats,
        subtotal,
        convenienceFee,
        totalAmount,
      },
    });
  };

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '30px 24px 80px' }}>
      {/* Back Button */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Movie</span>
        </button>
      </div>

      {/* Header Info Banner */}
      <div className="glass-panel" style={{
        padding: '20px 28px',
        marginBottom: 30,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: 6 }}>
            {show.format} • {show.language}
          </span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>
            {show.movie?.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#94a3b8', fontSize: '0.88rem', marginTop: 6, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <MapPin size={14} color="#8b5cf6" /> {show.theatre?.name} ({show.screenName})
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Calendar size={14} color="#38bdf8" /> {show.showDate}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={14} color="#fbbf24" /> {show.showTime}
            </span>
          </div>
        </div>

        {/* Hold Countdown */}
        {selectedSeats.length > 0 && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 12,
            padding: '10px 18px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.75rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 700 }}>
              Seats Locked For
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '0.05em' }}>
              {formatTimer(timerSeconds)}
            </div>
          </div>
        )}
      </div>

      {lockError && (
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
          fontSize: '0.9rem',
        }}>
          <AlertCircle size={18} />
          <span>{lockError}</span>
        </div>
      )}

      {/* Main Seating Layout & Checkout Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 32,
        alignItems: 'flex-start',
      }} className="seat-booking-grid">
        {/* Left Column: Interactive Seat Grid */}
        <div>
          <SeatGrid
            seats={seats}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
            pricing={show.pricing}
          />
        </div>

        {/* Right Column: Order Summary Floating Card */}
        <div className="glass-panel" style={{ padding: '24px 26px', position: 'sticky', top: 90 }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 18, color: '#fff' }}>
            Reservation Summary
          </h3>

          {selectedSeats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>🎟️</div>
              <p style={{ fontSize: '0.9rem' }}>Please select your seats on the cinema layout</p>
            </div>
          ) : (
            <div>
              {/* Selected Seats Pills */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>
                  Selected Seats ({selectedSeats.length})
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selectedSeats.map((s) => (
                    <div
                      key={s.seatNumber}
                      style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#34d399',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span>{s.seatNumber}</span>
                      <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>(${s.price})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '16px 0',
                marginBottom: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                fontSize: '0.9rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Tickets Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Convenience & Booking Fee</span>
                  <span>${convenienceFee}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  paddingTop: 8,
                }}>
                  <span>Total Amount</span>
                  <span style={{ color: '#38bdf8' }}>${totalAmount}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: '0.95rem' }}
              >
                <span>Proceed to Checkout</span>
                <ChevronRight size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#64748b', fontSize: '0.75rem', marginTop: 14 }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>Protected by 256-Bit SSL Encryption</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 950px) {
          .seat-booking-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
