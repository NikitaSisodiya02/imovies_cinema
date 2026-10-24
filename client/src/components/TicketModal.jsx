import React, { useState } from 'react';
import { X, Printer, Calendar, Clock, MapPin, Film, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TicketModal = ({ booking, onClose, onCancelled }) => {
  const { token } = useAuth();
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState(false);

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking? A 15% cancellation fee will apply.')) {
      return;
    }

    setCancelling(true);
    setCancelError('');

    try {
      const res = await fetch(`/api/bookings/${booking._id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: 'Customer requested cancellation via portal' }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to cancel booking');
      }

      setCancelSuccess(true);
      if (onCancelled) onCancelled(data.booking);
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        maxWidth: 500,
        width: '100%',
        position: 'relative',
        animation: 'fadeIn 0.3s ease-out',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: -45,
            right: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#fff',
            width: 36,
            height: 36,
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={20} />
        </button>

        {/* Digital Ticket Container */}
        <div className="digital-ticket">
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #31104b 100%)',
            padding: '24px 28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: 8 }}>
                  IMOVIES CINEMA PASS
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>
                  {booking.movie?.title || 'Movie Experience'}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#c084fc', fontSize: '0.85rem', marginTop: 4 }}>
                  <MapPin size={14} />
                  <span>{booking.theatre?.name || 'Grand Plex Theatre'}</span>
                </div>
              </div>
              <span className={`badge ${booking.bookingStatus === 'confirmed' ? 'badge-emerald' : 'badge-gold'}`}>
                {booking.bookingStatus?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Ticket Body */}
          <div style={{ padding: '24px 28px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              marginBottom: 20,
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>
                  {booking.show?.showDate || 'Today'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>
                  {booking.show?.showTime || '07:30 PM'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Screen</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>
                  {booking.show?.screenName?.split('-')[0] || 'Screen 1'}
                </div>
              </div>
            </div>

            {/* Reserved Seats List */}
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
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Seats Allocated</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', marginTop: 2 }}>
                  {booking.seats?.join(', ')}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Paid</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399', marginTop: 2 }}>
                  ${booking.totalAmount}
                </div>
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="ticket-divider" />

            {/* QR Code and Barcode Section */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Booking Reference</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.05em', color: '#fff', marginTop: 2 }}>
                  {booking.bookingNumber}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
                  Scan at theatre entrance gate
                </div>

                {booking.bookingStatus === 'cancelled' && (
                  <div style={{
                    marginTop: 10,
                    fontSize: '0.75rem',
                    color: '#f87171',
                    background: 'rgba(239, 68, 68, 0.1)',
                    padding: '4px 8px',
                    borderRadius: 6,
                  }}>
                    Refund of ${booking.refundAmount} processed
                  </div>
                )}
              </div>

              {booking.qrCode && (
                <div style={{
                  padding: 8,
                  background: '#0f172a',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  borderRadius: 12,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                }}>
                  <img
                    src={booking.qrCode}
                    alt="Digital Pass QR"
                    style={{ width: 90, height: 90, display: 'block', borderRadius: 6 }}
                  />
                </div>
              )}
            </div>

            {cancelError && (
              <div style={{ marginTop: 16, color: '#f87171', fontSize: '0.85rem' }}>
                {cancelError}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div style={{
            background: 'rgba(7, 9, 14, 0.6)',
            padding: '16px 28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <button
              onClick={handlePrint}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Printer size={15} />
              <span>Print Pass</span>
            </button>

            {booking.bookingStatus === 'confirmed' && (
              <button
                disabled={cancelling}
                onClick={handleCancelBooking}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cancelling ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
