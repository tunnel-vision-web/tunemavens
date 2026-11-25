import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  RiCalendarEventFill,
  RiTicket2Fill,
  RiCheckboxCircleFill,
  RiSparkling2Fill,
  RiUserAddFill,
  RiMusic2Fill,
  RiArrowRightLine,
  RiMapPin2Fill,
  RiShieldCheckFill,
} from 'react-icons/ri';
import { API_BASE, tokenStore } from '../../lib/api.js';

const GENRE_OPTIONS = [
  'Afrobeats',
  'Amapiano',
  'Afro-House',
  'Hip-Hop & Drill',
  'R&B & Soul',
  'Bongo & Gengetone',
  'Gospel & Acoustic',
  'Electronic',
];

const ROLE_OPTIONS = [
  { key: 'consumer', label: 'Listener & Event Fan' },
  { key: 'creator', label: 'Artist / Producer' },
  { key: 'dj', label: 'DJ & Curator' },
  { key: 'label', label: 'Record Label / Manager' },
  { key: 'supervisor', label: 'Music Supervisor' },
];

export default function ReachoutLandingView({ sessionUser, onLogin }) {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialAction = searchParams.get('action') || 'explore';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(
    initialAction === 'ticket' ? 'ticket' : initialAction === 'rsvp' ? 'rsvp' : 'auto'
  );

  // RSVP form state
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpZone, setRsvpZone] = useState('seating');
  const [rsvpGuests, setRsvpGuests] = useState(0);
  const [rsvpCity, setRsvpCity] = useState('Nairobi');
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpResult, setRsvpResult] = useState(null);

  // Ticket booking form state
  const [selectedTierId, setSelectedTierId] = useState('');
  const [ticketQty, setTicketQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('tunepay');
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);

  // Quick Onboarding + Save Preferences state
  const [onbName, setOnbName] = useState('');
  const [onbEmail, setOnbEmail] = useState('');
  const [onbPassword, setOnbPassword] = useState('');
  const [onbRole, setOnbRole] = useState('consumer');
  const [onbGenres, setOnbGenres] = useState(['Afrobeats', 'Amapiano']);
  const [onbCity, setOnbCity] = useState('Nairobi');
  const [onbSubmitting, setOnbSubmitting] = useState(false);
  const [onbResult, setOnbResult] = useState(null);
  const [onbError, setOnbError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadReachout() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/api/crm/reachout/resolve/${encodeURIComponent(token)}`, {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('This invitation link is invalid or has expired.');
        }
        const payload = await res.json();
        if (!active) return;
        setData(payload);

        // Persist 90-day attribution in localStorage for seamless downstream tracking
        if (payload.affiliate?.ref_code) {
          localStorage.setItem('tm_aff_ref', payload.affiliate.ref_code);
        }
        if (payload.token) {
          localStorage.setItem('tm_reachout_token', payload.token);
        }

        const recName = payload.recipient?.name || '';
        const recEmail = payload.recipient?.email || '';
        setRsvpName(recName);
        setRsvpEmail(recEmail);
        setOnbName(recName);
        setOnbEmail(recEmail);

        if (payload.event) {
          const tiers = payload.event.tiers || [];
          if (tiers.length > 0) setSelectedTierId(tiers[0].tier_id);
          if (activeTab === 'auto') {
            setActiveTab(payload.event.payment_mode === 'free_rsvp' ? 'rsvp' : 'ticket');
          }
        }
      } catch (err) {
        if (active) setError(err.message || 'Unable to load invitation.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadReachout();
    return () => {
      active = false;
    };
  }, [token]);

  const toggleGenre = (g) => {
    setOnbGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!data?.event) return;
    setRsvpSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/events/${encodeURIComponent(data.event.id)}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          event_id: data.event.id,
          fan_name: rsvpName.trim(),
          fan_email: rsvpEmail.trim(),
          city: rsvpCity.trim(),
          attendance_type: rsvpZone,
          additional_guests: Number(rsvpGuests) || 0,
          reachout_token: data.token,
          ref_code: data.affiliate?.ref_code || undefined,
        }),
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.detail || 'Could not confirm RSVP');
      setRsvpResult(out);
    } catch (err) {
      setError(err.message || 'RSVP failed');
    } finally {
      setRsvpSubmitting(false);
    }
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!data?.event || !selectedTierId) return;
    setTicketSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/events/tickets/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          event_id: data.event.id,
          tier_id: selectedTierId,
          quantity: Number(ticketQty) || 1,
          customer_name: rsvpName.trim(),
          customer_email: rsvpEmail.trim(),
          payment_method: paymentMethod,
          reachout_token: data.token,
          ref_code: data.affiliate?.ref_code || undefined,
        }),
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.detail || 'Ticket booking failed');
      setTicketResult(out);
    } catch (err) {
      setError(err.message || 'Ticket purchase failed');
    } finally {
      setTicketSubmitting(false);
    }
  };

  const handleQuickOnboard = async (e) => {
    e.preventDefault();
    setOnbError('');
    if (!onbName.trim() || !onbEmail.trim() || onbPassword.length < 8) {
      setOnbError('Please enter your name, email, and a password of at least 8 characters.');
      return;
    }
    setOnbSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: onbName.trim(),
          email: onbEmail.trim(),
          password: onbPassword,
          role: onbRole,
          country: onbCity,
          signup_page: `/reachout/${token}`,
          signup_source: 'smart_crm_reachout',
          ref_code: data?.affiliate?.ref_code || undefined,
          reachout_token: data?.token || token,
          preferences: {
            favorite_genres: onbGenres,
            preferred_city: onbCity,
            fast_access_enabled: true,
          },
        }),
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.detail || 'Could not complete onboarding');
      if (out.access_token) tokenStore.set(out.access_token);
      if (onLogin && out.user) onLogin(out.user);
      setOnbResult(out);
    } catch (err) {
      setOnbError(err.message || 'Onboarding failed');
    } finally {
      setOnbSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070b14', color: '#e2e8f0' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#22d3ee' }}>Loading your TuneMavens Invitation...</div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>Preparing personalized access &amp; direct actions</div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070b14', color: '#e2e8f0', padding: '24px' }}>
        <div style={{ maxWidth: '480px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '28px', textAlign: 'center' }}>
          <h2 style={{ color: '#f87171', marginTop: 0 }}>Invitation Unavailable</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>{error}</p>
          <Link to="/" style={{ display: 'inline-block', marginTop: '12px', padding: '10px 20px', background: '#22d3ee', color: '#04141a', fontWeight: 700, borderRadius: '4px', textDecoration: 'none' }}>
            Explore TuneMavens
          </Link>
        </div>
      </div>
    );
  }

  const ev = data?.event;
  const isEvent = data?.promotion_type === 'event' && Boolean(ev);
  const canRsvp = isEvent && (ev.payment_mode === 'free_rsvp' || ev.payment_mode === 'both' || (data.campaign?.event_ctas || []).includes('rsvp'));
  const canBuyTicket = isEvent && ev.payment_mode !== 'free_rsvp' && (ev.tiers || []).length > 0;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #070b14 0%, #0d1526 100%)', color: '#e2e8f0', padding: '36px 20px 72px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        {/* Header / Personalized Greeting */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.2px', color: '#22d3ee', textTransform: 'uppercase' }}>
              TUNEMAVENS OFFICIAL INVITATION
            </div>
            <h1 style={{ margin: '6px 0 4px', fontSize: '28px', fontWeight: 800, color: '#ffffff' }}>
              {data?.recipient?.name ? `Welcome, ${data.recipient.name}!` : 'Welcome to TuneMavens!'}
            </h1>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>
              {data?.affiliate?.name && (
                <span>
                  Personally shared by <strong style={{ color: '#34d399' }}>{data.affiliate.name}</strong>
                  {data.affiliate.ref_code ? ` · Partner Ref ${data.affiliate.ref_code}` : ''}
                </span>
              )}
            </div>
          </div>
          <Link to="/" style={{ padding: '8px 14px', border: '1px solid rgba(34,211,238,0.35)', borderRadius: '4px', color: '#22d3ee', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
            Visit TuneMavens Home ↗
          </Link>
        </div>

        {error && (
          <div style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.4)', color: '#fca5a5', padding: '12px 16px', borderRadius: '4px', marginBottom: '18px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {/* Main 2-column grid: Left = Promoted Event/Product Direct CTA, Right = New User Platform Intro & Onboarding */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* LEFT CARD: Direct Action (Event RSVP / Ticket OR Product/Service CTA) */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(34,211,238,0.28)', borderRadius: '6px', padding: '24px' }}>
            {isEvent ? (
              <>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34,211,238,0.12)', color: '#22d3ee', padding: '4px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, marginBottom: '12px' }}>
                  <RiCalendarEventFill /> LIVE EVENT DIRECT ACCESS
                </div>
                <h2 style={{ margin: '0 0 6px', fontSize: '22px', color: '#ffffff' }}>{ev.title}</h2>
                <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '10px' }}>
                  Featuring <strong>{ev.artist}</strong>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '12px', color: '#94a3b8', marginBottom: '18px' }}>
                  <span><RiCalendarEventFill style={{ verticalAlign: 'middle' }} /> {ev.date_display || ev.date}</span>
                  <span><RiMapPin2Fill style={{ verticalAlign: 'middle' }} /> {ev.venue}{ev.city ? `, ${ev.city}` : ''}</span>
                </div>

                {/* Action Tabs: RSVP vs Buy Ticket */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
                  {canRsvp && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('rsvp')}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '4px',
                        border: activeTab === 'rsvp' ? '1px solid #10b981' : '1px solid #1e293b',
                        background: activeTab === 'rsvp' ? 'rgba(16,185,129,0.18)' : '#0b1220',
                        color: activeTab === 'rsvp' ? '#34d399' : '#94a3b8',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      <RiCheckboxCircleFill style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                      Direct RSVP
                    </button>
                  )}
                  {canBuyTicket && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('ticket')}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '4px',
                        border: activeTab === 'ticket' ? '1px solid #22d3ee' : '1px solid #1e293b',
                        background: activeTab === 'ticket' ? 'rgba(34,211,238,0.18)' : '#0b1220',
                        color: activeTab === 'ticket' ? '#22d3ee' : '#94a3b8',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      <RiTicket2Fill style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                      Buy Ticket
                    </button>
                  )}
                </div>

                {/* RSVP Form */}
                {activeTab === 'rsvp' && canRsvp && (
                  rsvpResult ? (
                    <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '4px', padding: '16px' }}>
                      <div style={{ fontWeight: 800, color: '#34d399', fontSize: '15px', marginBottom: '6px' }}>
                        ✓ RSVP Confirmed!
                      </div>
                      <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#e2e8f0' }}>{rsvpResult.message}</p>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        Pass Code: <strong style={{ color: '#fff' }}>{rsvpResult.rsvp_id}</strong>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Full Name</label>
                        <input value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} required style={{ width: '100%', padding: '9px 12px', borderRadius: '4px', border: '1px solid #1e293b', background: '#070b14', color: '#fff', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Email Address</label>
                        <input type="email" value={rsvpEmail} onChange={(e) => setRsvpEmail(e.target.value)} required style={{ width: '100%', padding: '9px 12px', borderRadius: '4px', border: '1px solid #1e293b', background: '#070b14', color: '#fff', boxSizing: 'border-box' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Zone</label>
                          <select value={rsvpZone} onChange={(e) => setRsvpZone(e.target.value)} style={{ width: '100%', padding: '9px 10px', borderRadius: '4px', border: '1px solid #1e293b', background: '#070b14', color: '#fff' }}>
                            <option value="seating">Seating</option>
                            <option value="standing">Standing</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Additional Guests</label>
                          <input type="number" min="0" max="5" value={rsvpGuests} onChange={(e) => setRsvpGuests(e.target.value)} style={{ width: '100%', padding: '9px 10px', borderRadius: '4px', border: '1px solid #1e293b', background: '#070b14', color: '#fff', boxSizing: 'border-box' }} />
                        </div>
                      </div>
                      <button type="submit" disabled={rsvpSubmitting} style={{ marginTop: '6px', padding: '12px', background: '#10b981', color: '#04141a', fontWeight: 800, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                        {rsvpSubmitting ? 'Confirming RSVP...' : 'Confirm My RSVP Now ✓'}
                      </button>
                    </form>
                  )
                )}

                {/* Ticket Purchase Form */}
                {activeTab === 'ticket' && canBuyTicket && (
                  ticketResult ? (
                    <div style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.35)', borderRadius: '4px', padding: '16px' }}>
                      <div style={{ fontWeight: 800, color: '#22d3ee', fontSize: '15px', marginBottom: '6px' }}>
                        🎟️ Ticket Booked Successfully!
                      </div>
                      <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#e2e8f0' }}>{ticketResult.message}</p>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        Ticket ID: <strong style={{ color: '#fff' }}>{ticketResult.booking?.ticket_id}</strong> · Total: <strong style={{ color: '#34d399' }}>${ticketResult.booking?.total_usd}</strong>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Ticket Tier</label>
                        <select value={selectedTierId} onChange={(e) => setSelectedTierId(e.target.value)} style={{ width: '100%', padding: '9px 10px', borderRadius: '4px', border: '1px solid #1e293b', background: '#070b14', color: '#fff' }}>
                          {(ev.tiers || []).map((t) => (
                            <option key={t.tier_id} value={t.tier_id}>
                              {t.name} — ${t.price_usd} ({t.available} left)
                            </option>
                          ))}
                        </select>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Quantity</label>
                          <input type="number" min="1" max="10" value={ticketQty} onChange={(e) => setTicketQty(e.target.value)} style={{ width: '100%', padding: '9px 10px', borderRadius: '4px', border: '1px solid #1e293b', background: '#070b14', color: '#fff', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Payment Method</label>
                          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: '100%', padding: '9px 10px', borderRadius: '4px', border: '1px solid #1e293b', background: '#070b14', color: '#fff' }}>
                            <option value="tunepay">TunePay Instant</option>
                            <option value="card">Debit / Credit Card</option>
                            <option value="mpesa">M-Pesa STK Push</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Full Name</label>
                        <input value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} required style={{ width: '100%', padding: '9px 12px', borderRadius: '4px', border: '1px solid #1e293b', background: '#070b14', color: '#fff', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Email for QR Pass</label>
                        <input type="email" value={rsvpEmail} onChange={(e) => setRsvpEmail(e.target.value)} required style={{ width: '100%', padding: '9px 12px', borderRadius: '4px', border: '1px solid #1e293b', background: '#070b14', color: '#fff', boxSizing: 'border-box' }} />
                      </div>
                      <button type="submit" disabled={ticketSubmitting} style={{ marginTop: '6px', padding: '12px', background: '#22d3ee', color: '#04141a', fontWeight: 800, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                        {ticketSubmitting ? 'Booking Ticket...' : 'Buy Ticket Now 🎟️'}
                      </button>
                    </form>
                  )
                )}
              </>
            ) : (
              <>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34,211,238,0.12)', color: '#22d3ee', padding: '4px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, marginBottom: '12px' }}>
                  <RiSparkling2Fill /> FEATURED PROMOTION
                </div>
                <h2 style={{ margin: '0 0 8px', fontSize: '22px', color: '#ffffff' }}>
                  {data?.campaign?.product_name || data?.campaign?.title || 'TuneMavens Ecosystem'}
                </h2>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                  {data?.campaign?.body || data?.platform_intro?.subtitle}
                </p>
                <button
                  type="button"
                  onClick={() => navigate(data?.campaign?.cta_url || '/stream')}
                  style={{ marginTop: '14px', padding: '12px 20px', background: '#22d3ee', color: '#04141a', fontWeight: 800, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  {data?.campaign?.cta_label || 'Explore Now'} <RiArrowRightLine />
                </button>
              </>
            )}
          </div>

          {/* RIGHT CARD: New User Platform Introduction + Quick Onboarding & Save Preferences */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '24px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(168,85,247,0.15)', color: '#c084fc', padding: '4px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, marginBottom: '12px' }}>
              <RiMusic2Fill /> NEW TO TUNEMAVENS?
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: '20px', color: '#ffffff' }}>
              {data?.platform_intro?.headline || 'Discover TuneMavens & Save Your Preferences'}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, marginBottom: '14px' }}>
              {data?.platform_intro?.subtitle}
            </p>
            <ul style={{ margin: '0 0 18px', paddingLeft: '18px', color: '#cbd5e1', fontSize: '12.5px', lineHeight: 1.7 }}>
              {(data?.platform_intro?.highlights || []).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            {sessionUser || onbResult ? (
              <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '4px', padding: '16px' }}>
                <div style={{ fontWeight: 800, color: '#34d399', fontSize: '15px', marginBottom: '6px' }}>
                  <RiShieldCheckFill style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  Account Active &amp; Preferences Saved!
                </div>
                <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#e2e8f0' }}>
                  Welcome aboard, {onbResult?.user?.name || sessionUser?.name || onbName}. Your genres, city, and passes are saved for instant access next time.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  style={{ padding: '10px 18px', background: '#22d3ee', color: '#04141a', fontWeight: 800, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                >
                  Go to My Dashboard →
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuickOnboard} style={{ borderTop: '1px solid #1e293b', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                  <RiUserAddFill style={{ verticalAlign: 'middle', marginRight: '6px', color: '#22d3ee' }} />
                  Quick Onboard — Save Preferences for Faster Access Next Time
                </div>
                {onbError && (
                  <div style={{ color: '#f87171', fontSize: '12px', background: 'rgba(248,113,113,0.1)', padding: '8px 10px', borderRadius: '4px' }}>
                    {onbError}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Your Name</label>
                    <input value={onbName} onChange={(e) => setOnbName(e.target.value)} required style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #1e293b', background: '#070b14', color: '#fff', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Email</label>
                    <input type="email" value={onbEmail} onChange={(e) => setOnbEmail(e.target.value)} required style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #1e293b', background: '#070b14', color: '#fff', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>I am joining as</label>
                    <select value={onbRole} onChange={(e) => setOnbRole(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #1e293b', background: '#070b14', color: '#fff' }}>
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r.key} value={r.key}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>City / Region</label>
                    <input value={onbCity} onChange={(e) => setOnbCity(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #1e293b', background: '#070b14', color: '#fff', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Favorite Genres (saved for personalized events &amp; streams)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {GENRE_OPTIONS.map((g) => {
                      const active = onbGenres.includes(g);
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleGenre(g)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '14px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: active ? '1px solid #22d3ee' : '1px solid #334155',
                            background: active ? 'rgba(34,211,238,0.18)' : 'transparent',
                            color: active ? '#22d3ee' : '#94a3b8',
                          }}
                        >
                          {active ? '✓ ' : ''}{g}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Choose a Password (min 8 chars)</label>
                  <input type="password" value={onbPassword} onChange={(e) => setOnbPassword(e.target.value)} minLength={8} required placeholder="Create a password to save your profile" style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #1e293b', background: '#070b14', color: '#fff', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" disabled={onbSubmitting} style={{ padding: '11px', background: 'linear-gradient(90deg, #22d3ee, #a855f7)', color: '#04141a', fontWeight: 800, border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13.5px' }}>
                  {onbSubmitting ? 'Saving Account & Preferences...' : 'Onboard & Save Preferences →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
