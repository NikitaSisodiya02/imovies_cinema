import React from 'react';
import { Crown, Sparkles, Lock, Check } from 'lucide-react';

export const SeatGrid = ({
  seats = [],
  selectedSeats = [],
  onSeatToggle,
  pricing = { vip: 400, premium: 280, standard: 180 },
}) => {
  // Group seats by tier and row
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];

  const getTierName = (row) => {
    if (row === 'A' || row === 'B') return 'VIP Recliner Experience';
    if (row === 'C' || row === 'D') return 'Premium Club';
    return 'Standard Classic';
  };

  const getTierPrice = (row) => {
    if (row === 'A' || row === 'B') return pricing.vip || 400;
    if (row === 'C' || row === 'D') return pricing.premium || 280;
    return pricing.standard || 180;
  };

  return (
    <div style={{
      width: '100%',
      background: 'rgba(15, 18, 28, 0.7)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Curved Screen */}
      <div className="cinema-screen-container">
        <div className="cinema-screen-curve" />
        <div className="cinema-screen-beam" />
        <span className="cinema-screen-label">All Eyes on the Screen</span>
      </div>

      {/* Seat Rows Map */}
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {rows.map((rowLetter, rIdx) => {
          const rowSeats = seats.filter((s) => s.row === rowLetter);
          // Show section divider header for row A, C, E
          const isSectionStart = rowLetter === 'A' || rowLetter === 'C' || rowLetter === 'E';

          return (
            <React.Fragment key={rowLetter}>
              {isSectionStart && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingBottom: 6,
                  marginTop: rIdx > 0 ? 24 : 0,
                  marginBottom: 14,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 700 }}>
                    {rowLetter === 'A' && <Crown size={15} color="#fbbf24" />}
                    {rowLetter === 'C' && <Sparkles size={15} color="#c084fc" />}
                    <span style={{
                      color: rowLetter === 'A' ? '#fbbf24' : rowLetter === 'C' ? '#c084fc' : '#38bdf8',
                    }}>
                      {getTierName(rowLetter)}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>
                    ${getTierPrice(rowLetter)} / seat
                  </span>
                </div>
              )}

              <div className="seat-row">
                <span className="seat-row-label">{rowLetter}</span>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {rowSeats.map((seat) => {
                    const isSelected = selectedSeats.some((s) => s.seatNumber === seat.seatNumber);
                    const isBooked = seat.status === 'booked';
                    const isLocked = seat.status === 'locked' && !isSelected;

                    let statusClass = 'available';
                    if (isBooked) statusClass = 'booked';
                    else if (isLocked) statusClass = 'locked';
                    else if (isSelected) statusClass = 'selected';

                    return (
                      <button
                        key={seat.seatNumber}
                        disabled={isBooked || isLocked}
                        onClick={() => onSeatToggle(seat)}
                        className={`seat-unit ${seat.tier} ${statusClass}`}
                        title={`${seat.seatNumber} • ${seat.tier.toUpperCase()} • $${seat.price}`}
                        style={{
                          marginRight: seat.col === 5 ? 16 : 0, // Aisle gap after seat 5
                        }}
                      >
                        {isSelected ? (
                          <Check size={14} strokeWidth={3} />
                        ) : isLocked ? (
                          <Lock size={12} />
                        ) : (
                          seat.col
                        )}
                      </button>
                    );
                  })}
                </div>

                <span className="seat-row-label">{rowLetter}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        marginTop: 40,
        paddingTop: 24,
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 20,
        fontSize: '0.8rem',
        color: '#94a3b8',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="seat-unit vip" style={{ width: 22, height: 22, fontSize: '0.6rem', cursor: 'default' }}>V</div>
          <span>VIP Recliner</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="seat-unit premium" style={{ width: 22, height: 22, fontSize: '0.6rem', cursor: 'default' }}>P</div>
          <span>Premium</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="seat-unit standard" style={{ width: 22, height: 22, fontSize: '0.6rem', cursor: 'default' }}>S</div>
          <span>Standard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="seat-unit selected" style={{ width: 22, height: 22, fontSize: '0.6rem', cursor: 'default' }}>✓</div>
          <span>Selected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="seat-unit locked" style={{ width: 22, height: 22, fontSize: '0.6rem', cursor: 'default' }}>
            <Lock size={10} />
          </div>
          <span>Reserved (Live)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="seat-unit booked" style={{ width: 22, height: 22, fontSize: '0.6rem', cursor: 'default' }}>✕</div>
          <span>Sold Out</span>
        </div>
      </div>
    </div>
  );
};
