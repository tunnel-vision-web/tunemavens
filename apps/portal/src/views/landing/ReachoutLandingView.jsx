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
  RiCheckLine,
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
  { key: 'creator', label: 'Recording Artist / Producer' },
  { key: 'dj', label: 'DJ & Mix Curator' },
  { key: 'label', label: 'Record Label / Distributor' },
  { key: 'podcaster', label: 'Podcaster & Show Host' },
  { key: 'supervisor', label: 'Music Supervisor & Sync Buyer' },
  { key: 'corporate', label: 'Corporate Brand / Agency' },
  { key: 'media_house', label: 'Broadcast Media House' },
  { key: 'vc', label: 'Tour VC & Catalogue Investor' },
  { key: 'affiliate', label: 'Affiliate Partner & Influencer' },
];

const INPUT_STYLE = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: '3px',
  border: '1px solid #1e293b',
  background: '#060813',
  color: '#fff',
  boxSizing: 'border-box',
};

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
  const [rsvpPersona, setRsvpPersona] = useState(searchParams.get('role') || 'consumer');
  const [rsvpZone, setRsvpZone] = useState('seating');
  const [rsvpGuests, setRsvpGuests] = useState(0);
  const [rsvpGuestNames, setRsvpGuestNames] = useState([]);
  const [rsvpNotes, setRsvpNotes] = useState('');
  const [rsvpCity, setRsvpCity] = useState('Nairobi');
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpResult, setRsvpResult] = useState(null);
  const onbCardRef = React.useRef(null);

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

  // Email Communication Preferences & Unsubscribe state
  const [showCommPrefs, setShowCommPrefs] = useState(
    initialAction === 'preferences' || initialAction === 'unsubscribe'
  );
  const [commEmail, setCommEmail] = useState(searchParams.get('email') || '');
  const [commEventInvites, setCommEventInvites] = useState(true);
  const [commPersonaUpdates, setCommPersonaUpdates] = useState(true);
  const [commProductNews, setCommProductNews] = useState(true);
  const [commWeeklyDigest, setCommWeeklyDigest] = useState(false);
  const [commFrequency, setCommFrequency] = useState('important_only');
  const [commUnsubAll, setCommUnsubAll] = useState(initialAction === 'unsubscribe');
  const [commSaving, setCommSaving] = useState(false);
  const [commStatusMsg, setCommStatusMsg] = useState('');

  useEffect(() => {
    let active = true;
    async function loadReachout() {
      setLoading(true);
      setError('');
      try {
        const qsEmail = searchParams.get('email') || '';
        const qsName = searchParams.get('name') || '';
        const qsRole = searchParams.get('role') || '';
        const qsEventId = searchParams.get('event_id') || '';
        const qsPromo = searchParams.get('promo') || '';
        const qsParams = new URLSearchParams();
        if (qsEmail) qsParams.set('email', qsEmail);
        if (qsName) qsParams.set('name', qsName);
        if (qsRole) qsParams.set('role', qsRole);
        if (qsEventId) qsParams.set('event_id', qsEventId);
        if (qsPromo) qsParams.set('promo', qsPromo);
        const qsStr = qsParams.toString();
        const resolveUrl = `${API_BASE}/api/crm/reachout/resolve/${encodeURIComponent(token)}${qsStr ? `?${qsStr}` : ''}`;
        const res = await fetch(resolveUrl, {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('This invitation link is invalid or has expired.');
        }
        const payload = await res.json();
        if (!active) return;
        setData(payload);

        if (payload.affiliate?.ref_code) {
          localStorage.setItem('tm_aff_ref', payload.affiliate.ref_code);
        }
        if (payload.token) {
          localStorage.setItem('tm_reachout_token', payload.token);
        }

        const isSamplePreview = Boolean(payload.is_preview || token === 'preview_sample_token');
        const recName =
          (isSamplePreview && sessionUser?.name)
            ? sessionUser.name
            : (qsName || payload.recipient?.name || sessionUser?.name || '');
        const recEmail =
          (isSamplePreview && sessionUser?.email)
            ? sessionUser.email
            : (payload.recipient?.email || qsEmail || sessionUser?.email || '');
        setRsvpName(recName);
        setRsvpEmail(recEmail);
        setOnbName(recName);
        setOnbEmail(recEmail);
        setCommEmail(recEmail);

        if (recEmail) {
          fetch(`${API_BASE}/api/crm/communication-preferences?email=${encodeURIComponent(recEmail)}&token=${encodeURIComponent(token)}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((prefs) => {
              if (!active || !prefs) return;
              setCommEventInvites(Boolean(prefs.event_invites));
              setCommPersonaUpdates(Boolean(prefs.persona_onboarding_updates));
              setCommProductNews(Boolean(prefs.product_service_announcements));
              setCommWeeklyDigest(Boolean(prefs.weekly_digest));
              if (prefs.frequency) setCommFrequency(prefs.frequency);
              if (initialAction !== 'unsubscribe') {
                setCommUnsubAll(Boolean(prefs.unsubscribed_all));
              }
            })
            .catch(() => {});
        }

        const invitedRole = payload.target_persona || searchParams.get('role');
        if (invitedRole && ROLE_OPTIONS.some((r) => r.key === invitedRole)) {
          setOnbRole(invitedRole);
          setRsvpPersona(invitedRole);
        }

        if (payload.event) {
          const tiers = payload.event.tiers || [];
          if (tiers.length > 0) setSelectedTierId(tiers[0].tier_id);
          if (payload.event.city) setRsvpCity(payload.event.city);
          const sum = payload.event.rsvp_summary;
          if (sum && sum.seating_remaining === 0 && sum.standing_remaining > 0) {
            setRsvpZone('standing');
          }
          if (payload.event.payment_mode === 'free_rsvp') {
            setActiveTab('rsvp');
          } else if (activeTab === 'auto' || initialAction === 'event') {
            setActiveTab('ticket');
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
      const guestCount = Number(rsvpGuests) || 0;
      const cleanedGuestNames = rsvpGuestNames
        .slice(0, guestCount)
        .map((g) => String(g || '').trim())
        .filter(Boolean);
      const roleLabel = ROLE_OPTIONS.find((r) => r.key === rsvpPersona)?.label || rsvpPersona;
      const combinedNotes = [
        roleLabel ? `Attendee Role: ${roleLabel}` : '',
        rsvpNotes.trim(),
      ]
        .filter(Boolean)
        .join(' | ');

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
          additional_guests: guestCount,
          guest_names: cleanedGuestNames,
          notes: combinedNotes || undefined,
          reachout_token: data.token,
          ref_code: data.affiliate?.ref_code || undefined,
        }),
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.detail || 'Could not confirm RSVP');
      setRsvpResult(out);

      // Sync email-only communication preferences from RSVP form
      if (rsvpEmail.trim()) {
        setCommEmail(rsvpEmail.trim());
        setOnbName((prev) => prev || rsvpName.trim());
        setOnbEmail((prev) => prev || rsvpEmail.trim());
        setOnbCity(rsvpCity.trim() || 'Nairobi');
        setOnbRole(rsvpPersona);
        fetch(`${API_BASE}/api/crm/communication-preferences`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: rsvpEmail.trim(),
            reachout_token: data.token,
            event_invites: commUnsubAll ? false : commEventInvites,
            persona_onboarding_updates: commUnsubAll ? false : commPersonaUpdates,
            product_service_announcements: commUnsubAll ? false : commProductNews,
            weekly_digest: commUnsubAll ? false : commWeeklyDigest,
            frequency: commUnsubAll ? 'none' : commFrequency,
            unsubscribed_all: commUnsubAll,
          }),
        }).catch(() => {});
      }
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
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060813', color: '#e2e8f0' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#22d3ee' }}>Loading your TuneMavens Invitation...</div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>Preparing personalized access &amp; direct actions</div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060813', color: '#e2e8f0', padding: '24px' }}>
        <div style={{ maxWidth: '480px', background: '#0c0f20', border: '1px solid #1e293b', borderRadius: '3px', padding: '28px', textAlign: 'center' }}>
          <h2 style={{ color: '#ef4444', marginTop: 0 }}>Invitation Unavailable</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>{error}</p>
          <Link to="/" style={{ display: 'inline-block', marginTop: '12px', padding: '10px 20px', background: '#22d3ee', color: '#060813', fontWeight: 700, borderRadius: '3px', textDecoration: 'none' }}>
            Explore TuneMavens
          </Link>
        </div>
      </div>
    );
  }

  const ev = data?.event;
  const isEvent = data?.promotion_type === 'event' && Boolean(ev);
  const isFreeRsvpEvent = isEvent && ev.payment_mode === 'free_rsvp';
  const canRsvp = isEvent && (isFreeRsvpEvent || ev.payment_mode === 'both' || (data.campaign?.event_ctas || []).includes('rsvp'));
  const canBuyTicket = isEvent && !isFreeRsvpEvent && (ev.tiers || []).length > 0;
  const maxAllowedGuests = !isEvent
    ? 0
    : ev.guest_limit_policy === 'strict_plus_1'
    ? 1
    : ev.guest_limit_policy === 'strict_plus_2'
    ? 2
    : ev.max_additional_guests !== null && ev.max_additional_guests !== undefined
    ? Number(ev.max_additional_guests)
    : 5;
  const rsvpSummary = ev?.rsvp_summary || null;
  const guestPolicyLabel =
    ev?.guest_limit_policy === 'strict_plus_1'
      ? 'Strict +1 Guest Max'
      : ev?.guest_limit_policy === 'strict_plus_2'
      ? 'Strict +2 Guests Max'
      : maxAllowedGuests === 0
      ? 'Solo Invite Only'
      : `Up to +${maxAllowedGuests} Guests`;

  const displayWelcomeName =
    onbResult?.user?.name ||
    (data?.is_preview && sessionUser?.name) ||
    rsvpName.trim() ||
    sessionUser?.name ||
    data?.recipient?.name ||
    '';

  return (
    <div style={{ minHeight: '100vh', background: '#060813', color: '#e2e8f0', padding: '108px 20px 72px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        {/* Header / Personalized Greeting */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.2px', color: '#22d3ee', textTransform: 'uppercase' }}>
              TUNEMAVENS OFFICIAL INVITATION
            </div>
            <h1 style={{ margin: '6px 0 4px', fontSize: '28px', fontWeight: 800, color: '#ffffff' }}>
              {displayWelcomeName ? `Welcome, ${displayWelcomeName}!` : 'Welcome to TuneMavens!'}
            </h1>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>
              {data?.affiliate?.name && (
                <span>
                  Personally shared by <strong style={{ color: '#10b981' }}>{data.affiliate.name}</strong>
                  {data.affiliate.ref_code ? ` · Partner Ref ${data.affiliate.ref_code}` : ''}
                </span>
              )}
            </div>
          </div>
          <Link to="/" style={{ padding: '8px 14px', border: '1px solid rgba(34,211,238,0.35)', borderRadius: '3px', color: '#22d3ee', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
            Visit TuneMavens Home
          </Link>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid #ef4444', color: '#fca5a5', padding: '12px 16px', borderRadius: '3px', marginBottom: '18px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* LEFT CARD: Direct Action (Event Poster + RSVP / Ticket OR Persona/Product CTA) */}
          <div style={{ background: '#0c0f20', border: '1px solid rgba(34,211,238,0.28)', borderRadius: '3px', padding: '24px' }}>
            {isEvent ? (
              <>
                {ev.image_url && (
                  <img
                    src={ev.image_url}
                    alt={`${ev.title} Official Event Poster`}
                    style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', display: 'block', borderRadius: '3px', border: '1px solid rgba(34,211,238,0.28)', marginBottom: '16px' }}
                  />
                )}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34,211,238,0.12)', color: '#22d3ee', padding: '4px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, marginBottom: '12px' }}>
                  <RiCalendarEventFill color="#22d3ee" /> LIVE EVENT DIRECT ACCESS
                </div>
                <h2 style={{ margin: '0 0 6px', fontSize: '22px', color: '#ffffff' }}>{ev.title}</h2>
                <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '10px' }}>
                  Featuring <strong>{ev.artist}</strong>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '12px', color: '#94a3b8', marginBottom: '18px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <RiCalendarEventFill color="#22d3ee" /> {ev.date_display || ev.date}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <RiMapPin2Fill color="#10b981" /> {ev.venue}{ev.city ? `, ${ev.city}` : ''}
                  </span>
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
                        borderRadius: '3px',
                        border: activeTab === 'rsvp' ? '1px solid #10b981' : '1px solid #1e293b',
                        background: activeTab === 'rsvp' ? 'rgba(16,185,129,0.18)' : '#060813',
                        color: activeTab === 'rsvp' ? '#10b981' : '#94a3b8',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <RiCheckboxCircleFill color={activeTab === 'rsvp' ? '#10b981' : '#94a3b8'} />
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
                        borderRadius: '3px',
                        border: activeTab === 'ticket' ? '1px solid #22d3ee' : '1px solid #1e293b',
                        background: activeTab === 'ticket' ? 'rgba(34,211,238,0.18)' : '#060813',
                        color: activeTab === 'ticket' ? '#22d3ee' : '#94a3b8',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <RiTicket2Fill color={activeTab === 'ticket' ? '#22d3ee' : '#94a3b8'} />
                      Buy Ticket
                    </button>
                  )}
                </div>

                {/* RSVP Form */}
                {activeTab === 'rsvp' && canRsvp && (
                  rsvpResult ? (
                    <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid #10b981', borderRadius: '3px', padding: '16px' }}>
                      <div style={{ fontWeight: 800, color: '#10b981', fontSize: '15px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <RiCheckboxCircleFill color="#10b981" /> Reservation Confirmed!
                      </div>
                      <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#e2e8f0' }}>{rsvpResult.message}</p>
                      <div style={{ fontSize: '12px', color: '#94a3b8', display: 'grid', gap: '4px' }}>
                        <div>Pass Code: <strong style={{ color: '#fff' }}>{rsvpResult.rsvp_id}</strong> · Zone: <strong style={{ color: '#22d3ee', textTransform: 'uppercase' }}>{rsvpResult.attendance_type || rsvpZone}</strong> · Party Size: <strong style={{ color: '#fff' }}>{rsvpResult.party_size || (1 + (Number(rsvpGuests) || 0))}</strong></div>
                        {Array.isArray(rsvpResult.guest_names) && rsvpResult.guest_names.length > 0 && (
                          <div>Guests: <strong style={{ color: '#e2e8f0' }}>{rsvpResult.guest_names.join(', ')}</strong></div>
                        )}
                      </div>
                      {!sessionUser && !onbResult && (
                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(16,185,129,0.25)' }}>
                          <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '8px' }}>
                            Want faster 1-tap access, QR pass storage, and tailored show alerts next time?
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setOnbName(rsvpName);
                              setOnbEmail(rsvpEmail);
                              setOnbCity(rsvpCity || 'Nairobi');
                              setOnbRole(rsvpPersona);
                              onbCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }}
                            style={{ padding: '9px 14px', background: '#22d3ee', color: '#060813', fontWeight: 800, border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12.5px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            <RiUserAddFill color="#060813" /> Complete Quick Onboarding with My RSVP Details
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '11px' }}>
                        <span style={{ background: 'rgba(16,185,129,0.14)', color: '#10b981', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '3px', padding: '2px 8px', fontWeight: 700 }}>
                          {isFreeRsvpEvent ? 'FREE WITH RSVP' : 'RSVP RESERVATION'}
                        </span>
                        <span style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.28)', borderRadius: '3px', padding: '2px 8px', fontWeight: 700 }}>
                          {guestPolicyLabel}
                        </span>
                        {rsvpSummary && (
                          <span style={{ background: '#060813', color: '#cbd5e1', border: '1px solid #1e293b', borderRadius: '3px', padding: '2px 8px' }}>
                            Seated: {rsvpSummary.seating_remaining} left · Standing: {rsvpSummary.standing_remaining} left
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Full Name *</label>
                          <input value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} required placeholder="Your full name" style={INPUT_STYLE} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Email Address *</label>
                          <input type="email" value={rsvpEmail} onChange={(e) => setRsvpEmail(e.target.value)} required placeholder="you@example.com" style={INPUT_STYLE} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Who Are You? (Role / Persona)</label>
                          <select value={rsvpPersona} onChange={(e) => setRsvpPersona(e.target.value)} style={INPUT_STYLE}>
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r.key} value={r.key}>{r.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>City / Region</label>
                          <input value={rsvpCity} onChange={(e) => setRsvpCity(e.target.value)} placeholder="e.g. Nairobi" style={INPUT_STYLE} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Attendance Zone</label>
                          <select value={rsvpZone} onChange={(e) => setRsvpZone(e.target.value)} style={INPUT_STYLE}>
                            <option value="seating" disabled={rsvpSummary && rsvpSummary.seating_remaining === 0}>
                              Seating {rsvpSummary ? `(${rsvpSummary.seating_remaining} left)` : ''}
                            </option>
                            <option value="standing" disabled={rsvpSummary && rsvpSummary.standing_remaining === 0}>
                              Standing {rsvpSummary ? `(${rsvpSummary.standing_remaining} left)` : ''}
                            </option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                            Additional Guests {maxAllowedGuests > 0 ? `(0–${maxAllowedGuests})` : '(Solo Only)'}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={maxAllowedGuests}
                            disabled={maxAllowedGuests === 0}
                            value={maxAllowedGuests === 0 ? 0 : rsvpGuests}
                            onChange={(e) => {
                              const nextVal = Math.max(0, Math.min(maxAllowedGuests, Number(e.target.value) || 0));
                              setRsvpGuests(nextVal);
                              setRsvpGuestNames((prev) => Array.from({ length: nextVal }, (_, i) => prev[i] || ''));
                            }}
                            style={INPUT_STYLE}
                          />
                        </div>
                      </div>

                      {Number(rsvpGuests) > 0 && maxAllowedGuests > 0 && (
                        <div style={{ background: '#060813', border: '1px solid #1e293b', borderRadius: '3px', padding: '10px 12px', display: 'grid', gap: '8px' }}>
                          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#22d3ee' }}>
                            Accompanying Guest Details ({Number(rsvpGuests)} {Number(rsvpGuests) === 1 ? 'Guest' : 'Guests'})
                          </div>
                          {Array.from({ length: Number(rsvpGuests) }).map((_, idx) => (
                            <input
                              key={idx}
                              value={rsvpGuestNames[idx] || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setRsvpGuestNames((prev) => {
                                  const copy = [...prev];
                                  copy[idx] = val;
                                  return copy;
                                });
                              }}
                              placeholder={`Guest ${idx + 1} Full Name (optional)`}
                              style={INPUT_STYLE}
                            />
                          ))}
                        </div>
                      )}

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Accessibility or Seating Notes (optional)</label>
                        <input value={rsvpNotes} onChange={(e) => setRsvpNotes(e.target.value)} placeholder="e.g. Wheelchair access, press pass, VIP table" style={INPUT_STYLE} />
                      </div>

                      <div style={{ background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '3px', padding: '10px 12px', fontSize: '11.5px', color: '#cbd5e1', display: 'grid', gap: '6px' }}>
                        <div style={{ fontWeight: 700, color: '#22d3ee' }}>Communication Protocols (Email-Only Policy)</div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={commEventInvites && !commUnsubAll} onChange={(e) => { setCommUnsubAll(false); setCommEventInvites(e.target.checked); }} />
                          <span>Send me email confirmations, QR pass &amp; live event updates</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={commPersonaUpdates && !commUnsubAll} onChange={(e) => { setCommUnsubAll(false); setCommPersonaUpdates(e.target.checked); }} />
                          <span>Send me onboarding &amp; curated show recommendations</span>
                        </label>
                        <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                          Strict Email-Only Policy (no unsolicited SMS/WhatsApp). You can manage preferences anytime below.
                        </div>
                      </div>

                      <button type="submit" disabled={rsvpSubmitting} style={{ marginTop: '4px', padding: '12px', background: '#10b981', color: '#060813', fontWeight: 800, border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <RiCheckLine color="#060813" /> {rsvpSubmitting ? 'Confirming Reservation...' : 'Confirm My Reservation Now'}
                      </button>
                    </form>
                  )
                )}

                {/* Ticket Purchase Form */}
                {activeTab === 'ticket' && canBuyTicket && (
                  ticketResult ? (
                    <div style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid #22d3ee', borderRadius: '3px', padding: '16px' }}>
                      <div style={{ fontWeight: 800, color: '#22d3ee', fontSize: '15px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <RiTicket2Fill color="#22d3ee" /> Ticket Booked Successfully!
                      </div>
                      <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#e2e8f0' }}>{ticketResult.message}</p>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        Ticket ID: <strong style={{ color: '#fff' }}>{ticketResult.booking?.ticket_id}</strong> · Total: <strong style={{ color: '#10b981' }}>${ticketResult.booking?.total_usd}</strong>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Ticket Tier</label>
                        <select value={selectedTierId} onChange={(e) => setSelectedTierId(e.target.value)} style={INPUT_STYLE}>
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
                          <input type="number" min="1" max="10" value={ticketQty} onChange={(e) => setTicketQty(e.target.value)} style={INPUT_STYLE} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Payment Method</label>
                          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={INPUT_STYLE}>
                            <option value="tunepay">TunePay Instant</option>
                            <option value="card">Debit / Credit Card</option>
                            <option value="mpesa">M-Pesa STK Push</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Full Name</label>
                        <input value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} required style={INPUT_STYLE} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Email for QR Pass</label>
                        <input type="email" value={rsvpEmail} onChange={(e) => setRsvpEmail(e.target.value)} required style={INPUT_STYLE} />
                      </div>
                      <button type="submit" disabled={ticketSubmitting} style={{ marginTop: '6px', padding: '12px', background: '#22d3ee', color: '#060813', fontWeight: 800, border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <RiTicket2Fill color="#060813" /> {ticketSubmitting ? 'Booking Ticket...' : 'Buy Ticket Now'}
                      </button>
                    </form>
                  )
                )}
              </>
            ) : (
              <>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34,211,238,0.12)', color: '#22d3ee', padding: '4px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, marginBottom: '12px' }}>
                  <RiSparkling2Fill color="#22d3ee" /> FEATURED INVITATION
                </div>
                <h2 style={{ margin: '0 0 8px', fontSize: '22px', color: '#ffffff' }}>
                  {data?.persona_playbook?.label || data?.campaign?.product_name || data?.campaign?.title || 'TuneMavens Ecosystem'}
                </h2>
                {/<(?:p|div|br|img|h[1-6]|ul|ol|li|strong|b|em|i|u|s|span|a|blockquote|hr)\b/i.test(data?.campaign?.body || '') ? (
                  <div
                    style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.65 }}
                    dangerouslySetInnerHTML={{ __html: data?.campaign?.body || '' }}
                  />
                ) : (
                  <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                    {data?.campaign?.body || data?.platform_intro?.subtitle}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => navigate(data?.campaign?.cta_url || '/stream')}
                  style={{ marginTop: '14px', padding: '12px 20px', background: '#22d3ee', color: '#060813', fontWeight: 800, border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  {data?.campaign?.cta_label || 'Explore Now'} <RiArrowRightLine color="#060813" />
                </button>
              </>
            )}
          </div>

          {/* RIGHT CARD: New User Platform Introduction + Quick Onboarding & Save Preferences */}
          <div ref={onbCardRef} style={{ background: '#0c0f20', border: '1px solid #1e293b', borderRadius: '3px', padding: '24px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(168,85,247,0.15)', color: '#a855f7', padding: '4px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, marginBottom: '12px' }}>
              <RiMusic2Fill color="#a855f7" /> NEW TO TUNEMAVENS?
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
              <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid #10b981', borderRadius: '3px', padding: '16px' }}>
                <div style={{ fontWeight: 800, color: '#10b981', fontSize: '15px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RiShieldCheckFill color="#10b981" />
                  Account Active &amp; Preferences Saved!
                </div>
                <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#e2e8f0' }}>
                  Welcome aboard, {onbResult?.user?.name || sessionUser?.name || onbName}. Your preferences and role workspace are saved for instant access next time.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    style={{ padding: '10px 16px', background: '#22d3ee', color: '#060813', fontWeight: 800, border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Go to My Dashboard
                  </button>
                  {data?.persona_playbook?.supports_epk && (
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard?tab=epk-builder')}
                      style={{ padding: '10px 16px', background: '#10b981', color: '#060813', fontWeight: 800, border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '13px' }}
                    >
                      Launch Official EPK Builder
                    </button>
                  )}
                  {data?.persona_playbook?.supports_catalog && (
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard?tab=catalog')}
                      style={{ padding: '10px 16px', background: '#a855f7', color: '#ffffff', fontWeight: 800, border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '13px' }}
                    >
                      Ingest Your Catalogue
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleQuickOnboard} style={{ borderTop: '1px solid #1e293b', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RiUserAddFill color="#22d3ee" />
                  Quick Onboard — Save Preferences for Faster Access Next Time
                </div>
                {onbError && (
                  <div style={{ color: '#ef4444', fontSize: '12px', background: 'rgba(239,68,68,0.1)', padding: '8px 10px', borderRadius: '3px' }}>
                    {onbError}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Your Name</label>
                    <input value={onbName} onChange={(e) => setOnbName(e.target.value)} required style={INPUT_STYLE} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Email</label>
                    <input type="email" value={onbEmail} onChange={(e) => setOnbEmail(e.target.value)} required style={INPUT_STYLE} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>I am joining as</label>
                    <select value={onbRole} onChange={(e) => setOnbRole(e.target.value)} style={INPUT_STYLE}>
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r.key} value={r.key}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>City / Region</label>
                    <input value={onbCity} onChange={(e) => setOnbCity(e.target.value)} style={INPUT_STYLE} />
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
                            borderRadius: '3px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: active ? '1px solid #22d3ee' : '1px solid #334155',
                            background: active ? 'rgba(34,211,238,0.18)' : 'transparent',
                            color: active ? '#22d3ee' : '#94a3b8',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {active && <RiCheckLine size={12} color="#22d3ee" />}
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Choose a Password (min 8 chars)</label>
                  <input type="password" value={onbPassword} onChange={(e) => setOnbPassword(e.target.value)} minLength={8} required placeholder="Create a password to save your profile" style={INPUT_STYLE} />
                </div>
                <button type="submit" disabled={onbSubmitting} style={{ padding: '11px', background: '#22d3ee', color: '#060813', fontWeight: 800, border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '13.5px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  {onbSubmitting ? 'Saving Account & Preferences...' : 'Onboard & Save Preferences'} <RiArrowRightLine color="#060813" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* COMMUNICATION PREFERENCES & UNSUBSCRIBE CENTER */}
        <div style={{ marginTop: '28px', background: '#0c0f20', border: showCommPrefs ? '1px solid #22d3ee' : '1px solid #1e293b', borderRadius: '3px', padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
                Email &amp; Communication Preferences
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                TuneMavens Smart CRM strictly uses opted-in Email-Only communications (never unsolicited SMS or WhatsApp). Customize what you receive or opt out anytime.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCommPrefs((v) => !v)}
              style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.35)', color: '#22d3ee', padding: '7px 14px', borderRadius: '3px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              {showCommPrefs ? 'Hide Preferences' : 'Set Communication Preferences / Unsubscribe'}
            </button>
          </div>

          {showCommPrefs && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCommSaving(true);
                setCommStatusMsg('');
                try {
                  const res = await fetch(`${API_BASE}/api/crm/communication-preferences`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: commEmail.trim(),
                      reachout_token: token,
                      event_invites: commEventInvites,
                      persona_onboarding_updates: commPersonaUpdates,
                      product_service_announcements: commProductNews,
                      weekly_digest: commWeeklyDigest,
                      frequency: commFrequency,
                      unsubscribed_all: commUnsubAll,
                    }),
                  });
                  const out = await res.json();
                  if (!res.ok) throw new Error(out.detail || 'Could not save preferences');
                  setCommStatusMsg(out.message || 'Communication preferences updated!');
                } catch (err) {
                  setError(err.message || 'Failed to save communication preferences');
                } finally {
                  setCommSaving(false);
                }
              }}
              style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {commStatusMsg && (
                <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid #10b981', color: '#34d399', padding: '10px 14px', borderRadius: '3px', fontSize: '13px', fontWeight: 700 }}>
                  {commStatusMsg}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', color: '#94a3b8', marginBottom: '4px' }}>Email Address</label>
                  <input type="email" value={commEmail} onChange={(e) => setCommEmail(e.target.value)} required style={INPUT_STYLE} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', color: '#94a3b8', marginBottom: '4px' }}>Delivery Frequency</label>
                  <select value={commFrequency} onChange={(e) => setCommFrequency(e.target.value)} disabled={commUnsubAll} style={INPUT_STYLE}>
                    <option value="all">Real-Time Invites &amp; Announcements</option>
                    <option value="important_only">Important Invites &amp; Direct Briefs Only</option>
                    <option value="weekly_digest">Consolidated Weekly Digest</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '10px', fontSize: '13px', color: '#e2e8f0' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={commEventInvites && !commUnsubAll} disabled={commUnsubAll} onChange={(e) => setCommEventInvites(e.target.checked)} />
                  Live Concert &amp; Event RSVP Invitations
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={commPersonaUpdates && !commUnsubAll} disabled={commUnsubAll} onChange={(e) => setCommPersonaUpdates(e.target.checked)} />
                  Role, EPK &amp; Catalogue Onboarding Guides
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={commProductNews && !commUnsubAll} disabled={commUnsubAll} onChange={(e) => setCommProductNews(e.target.checked)} />
                  Ecosystem Product &amp; Sync Brief Alerts
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={commWeeklyDigest && !commUnsubAll} disabled={commUnsubAll} onChange={(e) => setCommWeeklyDigest(e.target.checked)} />
                  TuneStream Lossless Releases Digest
                </label>
              </div>

              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#fca5a5', paddingTop: '4px' }}>
                <input type="checkbox" checked={commUnsubAll} onChange={(e) => setCommUnsubAll(e.target.checked)} />
                Unsubscribe me from all Smart CRM promotional reachout emails
              </label>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  disabled={commSaving}
                  style={{ padding: '10px 18px', background: commUnsubAll ? '#ef4444' : '#10b981', color: commUnsubAll ? '#fff' : '#060813', fontWeight: 800, border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '13px' }}
                >
                  {commSaving ? 'Saving...' : commUnsubAll ? 'Confirm Unsubscribe' : 'Save Communication Preferences'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
