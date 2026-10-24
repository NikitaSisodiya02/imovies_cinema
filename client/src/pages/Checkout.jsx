import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CreditCard, Smartphone, Building, ShieldCheck, Tag, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { socket } = useSocket();

  const bookingState = location.state;

  if (!bookingState || !bookingState.show || !bookingState.selectedSeats) {
    return <Navigate to="/movies" replace />;
  }

  const { show, selectedSeats, subtotal, convenienceFee } = bookingState;

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState('');

  // Form states
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardName, setCardName] = useState(user?.name || 'Alex Johnson');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('789');
  const [upiId, setUpiId] = useState('alex@okaxis');
  const [selectedBank, setSelectedBank] = useState('Chase Bank');

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Promo calculation
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'IMOVIES50') {
      setDiscount(50);
      setPromoApplied('IMOVIES50 ($50 Off)');
    } else if (code === 'VIPPASS') {
      const disc = Math.round(subtotal * 0.2);
      setDiscount(disc);
      setPromoApplied(`VIPPASS (20% Off: -$${disc})`);
    } else {
      setPromoError('Invalid promo code. Try IMOVIES50 or VIPPASS');
    }
  };

  const finalTotal = Math.max(0, subtotal + convenienceFee - discount);

  const handleCompletePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      const seatNumbers = selectedSeats.map((s) => s.seatNumber);
      const seatDetails = selectedSeats.map((s) => ({
        seatNumber: s.seatNumber,
        tier: s.tier,
        price: s.price,
      }));

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          showId: show._id,
          seats: seatNumbers,
          seatDetails,
          subtotal,
          convenienceFee,
          discount,
          totalAmount: finalTotal,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Payment processing failed');
      }

      // Notify live socket listeners
      if (socket) {
        socket.emit('seats:booked', {
          showId: show._id,
          seats: seatNumbers,
        });
      }

      // Launch Confetti Celebration!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#38bdf8', '#fbbf24', '#34d399'],
        });
      } catch (err) {
        // non-blocking
      }

      navigate(`/booking-success/${data.booking._id}`, {
        state: { booking: data.booking },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto 80px', padding: '0 24px' }}>
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>
          Secure Checkout
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Complete your reservation with encrypted cinema payment gateway
        </p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          padding: '14px 20px',
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 36,
        alignItems: 'flex-start',
      }} className="checkout-grid">
        {/* Left: Payment Form & Options */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20, color: '#fff' }}>
            Choose Payment Method
          </h2>

          {/* Payment Method Selector Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            marginBottom: 26,
          }}>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              style={{
                padding: '14px 10px',
                borderRadius: 12,
                background: paymentMethod === 'card' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${paymentMethod === 'card' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)'}`,
                color: paymentMethod === 'card' ? '#fff' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'var(--transition)',
              }}
            >
              <CreditCard size={20} color={paymentMethod === 'card' ? '#c084fc' : '#94a3b8'} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              style={{
                padding: '14px 10px',
                borderRadius: 12,
                background: paymentMethod === 'upi' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${paymentMethod === 'upi' ? '#06b6d4' : 'rgba(255, 255, 255, 0.08)'}`,
                color: paymentMethod === 'upi' ? '#fff' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'var(--transition)',
              }}
            >
              <Smartphone size={20} color={paymentMethod === 'upi' ? '#38bdf8' : '#94a3b8'} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>UPI / Wallets</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              style={{
                padding: '14px 10px',
                borderRadius: 12,
                background: paymentMethod === 'netbanking' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${paymentMethod === 'netbanking' ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)'}`,
                color: paymentMethod === 'netbanking' ? '#fff' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'var(--transition)',
              }}
            >
              <Building size={20} color={paymentMethod === 'netbanking' ? '#fbbf24' : '#94a3b8'} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Net Banking</span>
            </button>
          </div>

          <form onSubmit={handleCompletePayment}>
            {/* Card Inputs */}
            {paymentMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 10,
                      padding: '12px 16px',
                      color: '#fff',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 10,
                      padding: '12px 16px',
                      color: '#fff',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                      placeholder="MM/YY"
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 10,
                        padding: '12px 16px',
                        color: '#fff',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                      CVV
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      required
                      maxLength={4}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 10,
                        padding: '12px 16px',
                        color: '#fff',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UPI Inputs */}
            {paymentMethod === 'upi' && (
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Virtual Payment Address (UPI ID)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@bank"
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 10,
                    padding: '12px 16px',
                    color: '#fff',
                    fontSize: '0.92rem',
                    outline: 'none',
                    marginBottom: 12,
                  }}
                />
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Supported: Google Pay, PhonePe, Paytm, Amazon Pay
                </div>
              </div>
            )}

            {/* Net Banking Inputs */}
            {paymentMethod === 'netbanking' && (
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  Select Institution
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#121622',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 10,
                    padding: '12px 16px',
                    color: '#fff',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                >
                  <option value="Chase Bank">Chase Bank</option>
                  <option value="Bank of America">Bank of America</option>
                  <option value="Wells Fargo">Wells Fargo</option>
                  <option value="Citibank">Citibank</option>
                  <option value="PNC Bank">PNC Bank</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px',
                fontSize: '1rem',
                marginTop: 26,
              }}
            >
              <Lock size={18} />
              <span>{processing ? 'Authorizing Payment...' : `Pay $${finalTotal} & Confirm Tickets`}</span>
            </button>
          </form>
        </div>

        {/* Right: Booking Summary & Promo */}
        <div>
          {/* Order Details Panel */}
          <div className="glass-panel" style={{ padding: '24px 28px', marginBottom: 20 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 16, color: '#fff' }}>
              Cinema Ticket Pass
            </h3>

            <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
              <img
                src={show.movie?.poster}
                alt={show.movie?.title}
                style={{ width: 65, height: 95, borderRadius: 8, objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                  {show.movie?.title}
                </h4>
                <div style={{ fontSize: '0.82rem', color: '#c084fc', marginTop: 2 }}>
                  {show.format} • {show.language}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: 4 }}>
                  {show.theatre?.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {show.showDate} at {show.showTime}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Reserved Seats:</span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8' }}>
                {selectedSeats.map((s) => s.seatNumber).join(', ')}
              </span>
            </div>

            {/* Promo Code Box */}
            <form onSubmit={handleApplyPromo} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Promo Code (IMOVIES50)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                    textTransform: 'uppercase',
                  }}
                />
                <button
                  type="submit"
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Apply
                </button>
              </div>

              {promoApplied && (
                <div style={{ marginTop: 8, color: '#34d399', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={13} /> {promoApplied}
                </div>
              )}
              {promoError && (
                <div style={{ marginTop: 8, color: '#f87171', fontSize: '0.8rem' }}>
                  {promoError}
                </div>
              )}
            </form>

            {/* Total breakdown */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              fontSize: '0.88rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Subtotal ({selectedSeats.length} seats)</span>
                <span>${subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Convenience Fee</span>
                <span>${convenienceFee}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: 600 }}>
                  <span>Promotional Discount</span>
                  <span>-${discount}</span>
                </div>
              )}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#fff',
                fontSize: '1.2rem',
                fontWeight: 900,
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: 10,
                marginTop: 4,
              }}>
                <span>Total Due</span>
                <span style={{ color: '#38bdf8' }}>${finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
