import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

export default function BookingDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/bookings');
      if (res.data.success) setBookings(res.data.data);
    } catch {
      // keep existing list on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const reviewerName = user?.fullName || user?.userId || 'Admin';

  const updateStatus = async (id, newStatus, reason = null) => {
    try {
      let url = `/bookings/${id}/status?status=${newStatus}&reviewedBy=${encodeURIComponent(reviewerName)}`;
      if (reason) url += `&rejectionReason=${encodeURIComponent(reason)}`;
      const res = await axiosInstance.put(url);
      if (res.data.success) fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleApprove = (id) => updateStatus(id, 'APPROVED');

  const handleRejectSubmit = (id) => {
    if (!rejectReason.trim()) return;
    updateStatus(id, 'REJECTED', rejectReason);
    setRejectingId(null);
    setRejectReason('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pending booking?')) return;
    try {
      await axiosInstance.delete(`/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting booking');
    }
  };

  const pending  = bookings.filter(b => b.status === 'PENDING').length;
  const approved = bookings.filter(b => b.status === 'APPROVED').length;
  const rejected = bookings.filter(b => b.status === 'REJECTED').length;

  const statusStyle = (status) => {
    const styles = {
      PENDING:   { background: '#fff7e6', color: '#b45309', border: '1px solid #fde68a' },
      APPROVED:  { background: '#ecfdf5', color: '#065f46', border: '1px solid #6ee7b7' },
      REJECTED:  { background: '#fff1f2', color: '#9f1239', border: '1px solid #fda4af' },
      CANCELLED: { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' },
    };
    return styles[status] || styles.CANCELLED;
  };

  const panel = {
    background: '#ffffff',
    borderRadius: '26px',
    border: '1px solid rgba(221,229,244,0.95)',
    boxShadow: '0 18px 40px rgba(38,55,97,0.08)',
  };

  const sectionTitle = {
    margin: 0,
    color: '#1e2c4f',
    fontSize: '1.1rem',
    fontWeight: 700,
    letterSpacing: '-0.03em',
  };

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', padding: '60px', color: '#8a98b1' }}>
        Loading bookings…
      </div>
    );
  }

  return (
    <>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '18px', marginBottom: '18px' }}>
        {[
          { label: 'Total Bookings', value: bookings.length, accent: 'linear-gradient(135deg,#377dff,#2358c5)' },
          { label: 'Pending',        value: pending,          accent: 'linear-gradient(135deg,#ffa73d,#f06a2d)' },
          { label: 'Approved',       value: approved,         accent: 'linear-gradient(135deg,#40b96d,#1b8a4b)' },
          { label: 'Rejected',       value: rejected,         accent: 'linear-gradient(135deg,#d84f5f,#a03045)' },
        ].map(card => (
          <article key={card.label} style={{ ...panel, padding: '18px 20px', background: 'linear-gradient(180deg,#ffffff,#f8fbff)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: card.accent, boxShadow: '0 10px 20px rgba(55,125,255,.18)', marginBottom: 14 }} />
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#1e2c4f', letterSpacing: '-0.04em' }}>{card.value}</div>
            <div style={{ marginTop: 6, fontSize: '0.78rem', color: '#7e8da8', textTransform: 'uppercase', letterSpacing: '.08em' }}>{card.label}</div>
          </article>
        ))}
      </div>

      {/* Bookings table */}
      <section style={{ ...panel, overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #edf2fb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={sectionTitle}>All Booking Requests</h2>
          <button
            onClick={fetchBookings}
            style={{ border: 'none', borderRadius: '999px', padding: '10px 18px', background: 'linear-gradient(135deg,#377dff,#2358c5)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
          >
            Refresh
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafcff' }}>
                {['Resource', 'Requested By', 'Date & Time', 'Attendees', 'Purpose', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', color: '#8a98b1', textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: '1px solid #edf2fb' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#8a98b1' }}>No bookings found.</td>
                </tr>
              )}
              {bookings.map(b => (
                <React.Fragment key={b.id}>
                  <tr style={{ borderBottom: rejectingId === b.id ? 'none' : '1px solid #f0f4fb' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1e2c4f' }}>
                      {b.resourceId}
                      {b.rejectionReason && (
                        <div style={{ fontSize: '0.75rem', color: '#d84f5f', marginTop: 4 }}>
                          Reason: {b.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#5f6f8c' }}>
                      <div style={{ fontWeight: 600, color: '#1e2c4f' }}>{b.userName || '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#8a98b1', marginTop: 2 }}>{b.userId}</div>
                      {b.reviewedBy && (
                        <div style={{ fontSize: '0.72rem', color: '#8a98b1', marginTop: 2 }}>Reviewed by: {b.reviewedBy}</div>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#5f6f8c' }}>
                      <div style={{ fontWeight: 600, color: '#1e2c4f' }}>{b.bookingDate || '—'}</div>
                      <div style={{ fontSize: '0.82rem', marginTop: 2 }}>{b.startTime || '?'} – {b.endTime || '?'}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#5f6f8c', textAlign: 'center' }}>{b.expectedAttendees ?? '—'}</td>
                    <td style={{ padding: '14px 16px', color: '#5f6f8c', maxWidth: 180 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={b.purpose}>{b.purpose || '—'}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, ...statusStyle(b.status) }}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {b.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(b.id)}
                              style={{ border: 'none', borderRadius: 10, padding: '7px 12px', background: 'linear-gradient(135deg,#40b96d,#1b8a4b)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => { setRejectingId(rejectingId === b.id ? null : b.id); setRejectReason(''); }}
                              style={{ border: 'none', borderRadius: 10, padding: '7px 12px', background: rejectingId === b.id ? '#fde8eb' : 'linear-gradient(135deg,#f05d72,#d84f5f)', color: rejectingId === b.id ? '#d84f5f' : '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                              {rejectingId === b.id ? 'Cancel' : 'Reject'}
                            </button>
                            <button
                              onClick={() => handleDelete(b.id)}
                              style={{ border: '1px solid #dde5f5', borderRadius: 10, padding: '7px 12px', background: '#fff', color: '#8a98b1', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {b.status === 'APPROVED' && (
                          <button
                            onClick={() => updateStatus(b.id, 'CANCELLED')}
                            style={{ border: '1px solid #dde5f5', borderRadius: 10, padding: '7px 12px', background: '#fff', color: '#5f6f8c', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Inline rejection form row */}
                  {rejectingId === b.id && (
                    <tr style={{ borderBottom: '1px solid #f0f4fb', background: '#fff8f9' }}>
                      <td colSpan={7} style={{ padding: '4px 16px 16px' }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder="Enter rejection reason…"
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleRejectSubmit(b.id)}
                            autoFocus
                            style={{ flex: 1, padding: '10px 14px', borderRadius: 14, border: '1px solid #fda4af', outline: 'none', background: '#fff', color: '#1e2c4f' }}
                          />
                          <button
                            onClick={() => handleRejectSubmit(b.id)}
                            disabled={!rejectReason.trim()}
                            style={{ border: 'none', borderRadius: 14, padding: '10px 18px', background: rejectReason.trim() ? 'linear-gradient(135deg,#f05d72,#d84f5f)' : '#f5c7cb', color: '#fff', fontWeight: 700, cursor: rejectReason.trim() ? 'pointer' : 'not-allowed' }}
                          >
                            Confirm Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
