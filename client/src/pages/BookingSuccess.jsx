import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Ticket, Printer, Film, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BookingSuccess = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const { token } = useAuth();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    if (!booking) {
      const fetchBooking = async () => {
        try {
          const res = await fetch(`/api/bookings/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.success) {
            setBooking(data.booking);
          }
        } catch (err) {
          console.error('Failed to load booking:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [bookingId, token]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: '#8b5cf6' }}>
        Generating digital cinema pass...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto 80px', padding: '0 24px', textAlign: 'center' }}>
      {/* Success Badge */}
      <div style={{
        width: 70,
        height: 70,
        borderRadius: '50%',
        background: 'rgba(16, 185, 129, 0.15)',
        border: '2px solid #10b981',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
      }}>
        <CheckCircle2 size={38} color="#34d399" />
      </div>

      <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', marginBottom: 8 }}>
        Booking Confirmed!
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: 550, margin: '0 auto 36px' }}>
        Your cinema seats have been locked and reserved. A digital copy and confirmation has been assigned to your account.
      </p>

      {/* Perforated Digital Ticket Pass */}
      {booking && (
        <div style={{ maxWidth: 520, margin: '0 auto 40px', textAlign: 'left' }}>
          <div className="digital-ticket">
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #31104b 100%)',
              padding: '24px 28px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <span className="badge badge-purple" style={{ marginBottom: 6 }}>
                OFFICIAL CINEMA ADMISSION PASS
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>
                {booking.movie?.title || 'Movie Experience'}
              </h2>
              <div style={{ color: '#c084fc', fontSize: '0.85rem', marginTop: 4 }}>
                {booking.theatre?.name || 'Grand Plex Theatre'}
              </div>
            </div>

            {/* Details */}
            <div style={{ padding: '24px 28px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
                marginBottom: 20,
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Date</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>
                    {booking.show?.showDate || 'Today'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Showtime</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>
                    {booking.show?.showTime || '07:30 PM'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Screen</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>
                    {booking.show?.screenName?.split('-')[0] || 'Screen 1'}
                  </div>
                </div>
              </div>

              {/* Seats Pill Box */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 12,
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Seats</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#38bdf8', marginTop: 2 }}>
                    {booking.seats?.join(', ')}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Paid</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34d399', marginTop: 2 }}>
                    ${booking.totalAmount}
                  </div>
                </div>
              </div>

              <div className="ticket-divider" />

              {/* QR and Barcode Verification */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Booking Ref</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginTop: 2 }}>
                    {booking.bookingNumber}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
                    Present this QR at theatre scanner
                  </div>
                </div>

                {booking.qrCode && (
                  <div style={{
                    padding: 6,
                    background: '#0f172a',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    borderRadius: 10,
                  }}>
                    <img src={booking.qrCode} alt="QR Pass" style={{ width: 85, height: 85, display: 'block', borderRadius: 6 }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
        <button onClick={() => window.print()} className="btn-secondary">
          <Printer size={16} />
          <span>Print E-Ticket</span>
        </button>
        <Link to="/my-bookings" className="btn-primary">
          <Ticket size={16} />
          <span>Go to My Bookings</span>
        </Link>
        <Link to="/movies" className="btn-secondary">
          <Film size={16} />
          <span>Browse More Movies</span>
        </Link>
      </div>
    </div>
  );
};
