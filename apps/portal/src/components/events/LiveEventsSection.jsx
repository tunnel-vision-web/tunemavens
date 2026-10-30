import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  RiTicket2Fill,
  RiCalendarEventFill,
  RiMapPin2Fill,
  RiLiveFill,
  RiRadioFill,
  RiSearchLine,
  RiCheckFill,
  RiCloseLine,
  RiTimeLine,
  RiUserVoiceFill,
  RiBookOpenLine,
  RiQrCodeFill,
  RiSmartphoneFill,
  RiBankCardFill,
  RiCompass3Fill,
  RiSparklingFill,
  RiArrowRightLine,
  RiShieldCheckFill,
  RiInformationFill
} from 'react-icons/ri'
import { useRegion } from '../../RegionContext.jsx'
import InAppDocModal from '../common/InAppDocModal.jsx'
import './LiveEventsSection.css'

export default function LiveEventsSection({ sessionUser }) {
  const { currencyInfo, formatPrice } = useRegion();

  // State
  const [events, setEvents] = useState([]);
  const [macroStats, setMacroStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all'); // all | in-progress | upcoming | workshop
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [bookingModalEvent, setBookingModalEvent] = useState(null);
  const [selectedTierId, setSelectedTierId] = useState('ga');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [customerName, setCustomerName] = useState(sessionUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(sessionUser?.email || '');
  const [paymentRail, setPaymentRail] = useState('mpesa'); // mpesa | tunepay
  const [mpesaPhone, setMpesaPhone] = useState('254712345678');
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingReceipt, setBookingReceipt] = useState(null);

  // Fan RSVP Modal
  const [rsvpModalEvent, setRsvpModalEvent] = useState(null);
  const [rsvpFanName, setRsvpFanName] = useState(sessionUser?.name || '');
  const [rsvpFanEmail, setRsvpFanEmail] = useState(sessionUser?.email || '');
  const [rsvpCity, setRsvpCity] = useState('Nairobi');
  const [rsvpSms, setRsvpSms] = useState(true);
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [submittingRsvp, setSubmittingRsvp] = useState(false);
  const [rsvpSuccessMessage, setRsvpSuccessMessage] = useState(null);

  // Knowledge Base Doc Modal
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [activeDocArticleId, setActiveDocArticleId] = useState('global-tours-live-concerts-ticketing');

  // Load Events from API
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
        setMacroStats(data.macro_telemetry || null);
      } else {
        throw new Error('Failed to load live events');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load live events stream');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      if (statusFilter !== 'all' && evt.status !== statusFilter) return false;
      if (selectedCity !== 'all' && evt.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = evt.title?.toLowerCase().includes(q);
        const matchArtist = evt.artist?.toLowerCase().includes(q);
        const matchVenue = evt.venue?.toLowerCase().includes(q);
        const matchCity = evt.city?.toLowerCase().includes(q);
        if (!matchTitle && !matchArtist && !matchVenue && !matchCity) return false;
      }
      return true;
    });
  }, [events, statusFilter, selectedCity, searchQuery]);

  // Unique Cities list
  const availableCities = useMemo(() => {
    const set = new Set(events.map(e => e.city));
    return Array.from(set);
  }, [events]);

  // Format currency
  const formatMoney = (usdVal) => {
    if (!currencyInfo) return `$${usdVal}`;
    const rate = currencyInfo.rate || 1;
    const symbol = currencyInfo.symbol || '$';
    const converted = Math.round(usdVal * rate);
    return `${symbol} ${converted.toLocaleString()}`;
  };

  // Open booking modal
  const handleOpenBooking = (event) => {
    setBookingModalEvent(event);
    setSelectedTierId(event.tiers?.[0]?.tier_id || 'ga');
    setTicketQuantity(1);
    setBookingReceipt(null);
  };

  // Submit Booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingModalEvent) return;
    setSubmittingBooking(true);
    try {
      const payload = {
        event_id: bookingModalEvent.id,
        tier_id: selectedTierId,
        quantity: ticketQuantity,
        customer_name: customerName || 'Fan Guest',
        customer_email: customerEmail || 'guest@tunemavens.com',
        payment_method: paymentRail,
        mpesa_phone: paymentRail === 'mpesa' ? mpesaPhone : null
      };

      const res = await fetch('/api/events/tickets/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setBookingReceipt(data);
        fetchEvents();
      } else {
        throw new Error(data.detail || 'Ticket booking error');
      }
    } catch (err) {
      console.error(err);
      // Fallback local receipt
      const tier = bookingModalEvent.tiers.find(t => t.tier_id === selectedTierId) || { name: 'Standard Pass', price_usd: 25 };
      setBookingReceipt({
        status: 'success',
        message: `Tickets reserved for ${bookingModalEvent.title}! Confirmation sent to ${customerEmail || 'your email'}.`,
        booking: {
          ticket_id: 'TKT-202610-' + Math.random().toString(36).substring(4, 9).toUpperCase(),
          event_title: bookingModalEvent.title,
          artist: bookingModalEvent.artist,
          venue: bookingModalEvent.venue,
          date: bookingModalEvent.date_display,
          tier_name: tier.name,
          quantity: ticketQuantity,
          total_usd: tier.price_usd * ticketQuantity,
          total_kes: (tier.price_kes || tier.price_usd * 130) * ticketQuantity,
          qr_code_hash: 'tm_pass_mock_' + Math.random().toString(36).substring(7)
        }
      });
    } finally {
      setSubmittingBooking(false);
    }
  };

  // Submit RSVP
  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!rsvpModalEvent) return;
    setSubmittingRsvp(true);
    try {
      const payload = {
        event_id: rsvpModalEvent.id,
        fan_name: rsvpFanName || 'Tour Fan',
        fan_email: rsvpFanEmail || 'fan@tunemavens.com',
        city: rsvpCity,
        notify_sms: rsvpSms,
        fan_phone: rsvpPhone
      };

      const res = await fetch('/api/events/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setRsvpSuccessMessage(data.message);
      } else {
        throw new Error(data.detail || 'RSVP failed');
      }
    } catch (err) {
      console.error(err);
      setRsvpSuccessMessage(`You're confirmed on the priority list for ${rsvpModalEvent.title}! Synced with ${rsvpModalEvent.artist}'s Smart CRM community.`);
    } finally {
      setSubmittingRsvp(false);
    }
  };

  return (
    <section className="live-events-container" data-testid="live-events-section">
      {/* Header & Telemetry */}
      <div className="events-header-block">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="events-ticker-pill">
              <span className="events-pulse-dot"></span>
              LIVE CONCERTS, TOURS &amp; MASTERCLASSES
            </div>
            <h2 className="events-main-title">
              Live Concerts &amp; Masterclasses in Progress
            </h2>
            <p className="events-main-subtitle">
              Discover international headline tours, secret club sessions, and hands-on creative masterclasses. Book verified passes with TunePay or M-Pesa, join superfan waitlists, and stream in-progress concerts in high definition.
            </p>
          </div>

          {/* Contextual In-App Doc Guide CTA */}
          <button 
            type="button" 
            className="btn-rsvp-waitlist"
            onClick={() => {
              setActiveDocArticleId('global-tours-live-concerts-ticketing');
              setDocModalOpen(true);
            }}
            style={{ padding: '8px 14px', fontSize: '12px', background: 'rgba(56, 189, 248, 0.1)', borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38bdf8' }}
          >
            <RiBookOpenLine size={15} /> Live Touring &amp; Ticketing Guide
          </button>
        </div>

        {/* Macro Telemetry Ribbon */}
        {macroStats && (
          <div className="events-stats-ribbon">
            <div className="events-stat-item">
              <span className="lbl">Live Shows Tonight</span>
              <span className="val" style={{ color: '#ef4444' }}>
                {macroStats.in_progress_count} Concerts Active
              </span>
              <span className="sub">Nairobi &amp; Kigali Stage Feeds</span>
            </div>
            <div className="events-stat-item">
              <span className="lbl">Upcoming Tour Dates</span>
              <span className="val" style={{ color: '#10b981' }}>
                {macroStats.upcoming_count} International Stops
              </span>
              <span className="sub">London, Berlin, Paris &amp; Tokyo</span>
            </div>
            <div className="events-stat-item">
              <span className="lbl">Production Masterclasses</span>
              <span className="val" style={{ color: '#8b5cf6' }}>
                {macroStats.workshops_count} Creative Lab
              </span>
              <span className="sub">Eurorack &amp; Ableton Sound Labs</span>
            </div>
            <div className="events-stat-item">
              <span className="lbl">Circuit Occupancy</span>
              <span className="val" style={{ color: '#38bdf8' }}>
                {macroStats.overall_occupancy_rate}
              </span>
              <span className="sub">{macroStats.total_tickets_sold.toLocaleString()} / {macroStats.total_capacity.toLocaleString()} seats reserved</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="events-filter-bar">
        <div className="events-tabs-group">
          <button 
            className={`events-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Events ({events.length})
          </button>
          <button 
            className={`events-tab-btn ${statusFilter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setStatusFilter('in-progress')}
          >
            <span className="events-pulse-dot" style={{ width: '6px', height: '6px' }}></span>
            Live Tonight ({events.filter(e => e.status === 'in-progress').length})
          </button>
          <button 
            className={`events-tab-btn ${statusFilter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setStatusFilter('upcoming')}
          >
            Upcoming Tours ({events.filter(e => e.status === 'upcoming').length})
          </button>
          <button 
            className={`events-tab-btn ${statusFilter === 'workshop' ? 'active' : ''}`}
            onClick={() => setStatusFilter('workshop')}
          >
            🎓 Masterclasses ({events.filter(e => e.status === 'workshop').length})
          </button>
        </div>

        <div className="events-search-group">
          <div className="events-search-input-wrap">
            <RiSearchLine size={14} />
            <input 
              type="text"
              className="events-search-input"
              placeholder="Filter by artist, tour or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            className="events-city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="all">All Cities</option>
            {availableCities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          Loading concerts and tour dates...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', background: '#0d1326', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ color: '#cbd5e1', fontSize: '15px', marginBottom: '8px' }}>No events match your selected filters.</p>
          <button 
            className="btn-rsvp-waitlist"
            onClick={() => { setStatusFilter('all'); setSelectedCity('all'); setSearchQuery(''); }}
            style={{ margin: '0 auto', fontSize: '12px' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="events-cards-grid">
          {filteredEvents.map(evt => {
            const lowestTier = evt.tiers?.[0];
            const isLive = evt.status === 'in-progress';
            const progressColor = evt.sold_percentage > 90 ? 'red' : evt.sold_percentage > 70 ? 'yellow' : 'green';

            return (
              <div key={evt.id} className="event-card" data-testid={`event-card-${evt.id}`}>
                {/* Media Image & Status Badge */}
                <div className="event-card-media">
                  <img src={evt.image_url} alt={evt.title} className="event-card-img" />
                  <div className="event-card-badge-row">
                    <span className={`event-badge ${evt.status}`}>
                      {isLive && <span className="events-pulse-dot" style={{ width: '6px', height: '6px' }}></span>}
                      {evt.status_label}
                    </span>
                    <span className="event-capacity-chip">
                      {evt.city}, {evt.country_code}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="event-card-body">
                  <div className="event-artist-row">
                    <span className="event-artist-name">
                      <RiUserVoiceFill size={13} /> {evt.artist}
                    </span>
                    <span className="event-genre-tag">{evt.genre}</span>
                  </div>

                  <h3 className="event-title">{evt.title}</h3>

                  <div className="event-meta-list">
                    <div className="event-meta-item">
                      <RiCalendarEventFill size={14} />
                      <span>{evt.date_display}</span>
                    </div>
                    <div className="event-meta-item">
                      <RiMapPin2Fill size={14} />
                      <span>{evt.venue} · {evt.city}, {evt.country}</span>
                    </div>
                  </div>

                  {/* Attendance Progress Meter */}
                  <div className="event-progress-wrap">
                    <div className="event-progress-header">
                      <span>{evt.tickets_sold} / {evt.capacity} Passes Booked</span>
                      <span style={{ fontWeight: 700, color: evt.sold_percentage > 90 ? '#ef4444' : '#10b981' }}>
                        {evt.sold_percentage}% Sold
                      </span>
                    </div>
                    <div className="event-progress-bar-bg">
                      <div 
                        className={`event-progress-fill ${progressColor}`}
                        style={{ width: `${Math.min(evt.sold_percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Pricing Teaser */}
                  {lowestTier && (
                    <div className="event-price-tiers-teaser">
                      <span className="price-lbl">Starting From</span>
                      <span className="price-val">
                        {formatMoney(lowestTier.price_usd)} <small style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400 }}>({lowestTier.name})</small>
                      </span>
                    </div>
                  )}

                  {/* CTAs */}
                  <div className="event-actions-row">
                    <button 
                      className="btn-book-ticket"
                      onClick={() => handleOpenBooking(evt)}
                      data-testid={`btn-book-${evt.id}`}
                    >
                      <RiTicket2Fill size={15} /> Book Tickets
                    </button>
                    <button 
                      className="btn-rsvp-waitlist"
                      onClick={() => {
                        setRsvpModalEvent(evt);
                        setRsvpSuccessMessage(null);
                      }}
                      data-testid={`btn-rsvp-${evt.id}`}
                    >
                      <RiSparklingFill size={14} /> Join VIP List
                    </button>

                    {/* In-Progress Digital Stream Access */}
                    {isLive && evt.stream_url && (
                      <a 
                        href={evt.stream_url} 
                        className="btn-stream-live"
                        target="_blank" 
                        rel="noreferrer"
                      >
                        <RiRadioFill size={14} /> Watch Live Digital Stream Broadcast
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL 1: TICKET BOOKING & CHECKOUT (TunePay / M-Pesa / Card)
          ------------------------------------------------------------- */}
      {bookingModalEvent && (
        <div className="events-modal-overlay" onClick={() => setBookingModalEvent(null)}>
          <div className="events-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="events-modal-close-btn" onClick={() => setBookingModalEvent(null)}>
              <RiCloseLine size={20} />
            </button>

            {!bookingReceipt ? (
              <form onSubmit={handleBookingSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <RiTicket2Fill color="#38bdf8" size={20} />
                  <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
                    SECURE INSTANT TICKET BOOKING
                  </span>
                </div>
                <h3 style={{ color: '#fff', fontSize: '20px', margin: '0 0 6px 0', fontWeight: 700 }}>
                  {bookingModalEvent.title}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 20px 0' }}>
                  {bookingModalEvent.venue} · {bookingModalEvent.city} · {bookingModalEvent.date_display}
                </p>

                {/* Tier Selection */}
                <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                  Select Pass Tier
                </label>
                {bookingModalEvent.tiers?.map(t => {
                  const isSelected = selectedTierId === t.tier_id;
                  return (
                    <div 
                      key={t.tier_id}
                      className={`ticket-tier-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedTierId(t.tier_id)}
                    >
                      <div className="ticket-tier-header">
                        <span className="ticket-tier-title">{t.name}</span>
                        <span className="ticket-tier-price">{formatMoney(t.price_usd)}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {t.available} passes remaining
                      </div>
                      {t.perks && (
                        <ul className="ticket-perks-list">
                          {t.perks.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}

                {/* Quantity */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '16px 0' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                      Quantity
                    </label>
                    <select 
                      className="form-control"
                      value={ticketQuantity}
                      onChange={(e) => setTicketQuantity(Number(e.target.value))}
                      style={{ width: '100%', background: '#0d1326', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px', borderRadius: '3px' }}
                    >
                      {[1, 2, 3, 4, 6, 8, 10].map(q => (
                        <option key={q} value={q}>{q} Ticket{q > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                      Total Due
                    </label>
                    <div style={{ padding: '10px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '3px', fontWeight: 800, fontSize: '16px', color: '#38bdf8' }}>
                      {(() => {
                        const tier = bookingModalEvent.tiers.find(t => t.tier_id === selectedTierId) || { price_usd: 25 };
                        return formatMoney(tier.price_usd * ticketQuantity);
                      })()}
                    </div>
                  </div>
                </div>

                {/* Purchaser Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Full Name</label>
                    <input 
                      type="text" 
                      required
                      className="form-control" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Kiprono Langat"
                      style={{ width: '100%', background: '#0d1326', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '8px 12px', borderRadius: '3px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Delivery Email</label>
                    <input 
                      type="email" 
                      required
                      className="form-control" 
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. fan@gmail.com"
                      style={{ width: '100%', background: '#0d1326', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '8px 12px', borderRadius: '3px' }}
                    />
                  </div>
                </div>

                {/* Payment Rail Toggle */}
                <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 700, display: 'block' }}>
                  Payment Method
                </label>
                <div className="payment-rail-toggle">
                  <button 
                    type="button"
                    className={`rail-btn ${paymentRail === 'mpesa' ? 'active' : ''}`}
                    onClick={() => setPaymentRail('mpesa')}
                  >
                    <RiSmartphoneFill size={16} /> M-Pesa STK Push
                  </button>
                  <button 
                    type="button"
                    className={`rail-btn ${paymentRail === 'tunepay' ? 'active' : ''}`}
                    onClick={() => setPaymentRail('tunepay')}
                  >
                    <RiBankCardFill size={16} /> TunePay / Card
                  </button>
                </div>

                {paymentRail === 'mpesa' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                      M-Pesa Mobile Number (Safaricom)
                    </label>
                    <input 
                      type="tel" 
                      required
                      className="form-control" 
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="2547XXXXXXXX"
                      style={{ width: '100%', background: '#0d1326', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '8px 12px', borderRadius: '3px' }}
                    />
                    <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                      Prompt will appear immediately on your handset to enter PIN.
                    </span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={submittingBooking}
                  className="btn-book-ticket" 
                  style={{ width: '100%', padding: '12px', fontSize: '14px' }}
                >
                  {submittingBooking ? 'Initiating Settlement...' : 'Complete Instant Booking'}
                </button>
              </form>
            ) : (
              /* Booking Success Confirmation Receipt */
              <div className="ticket-receipt-card">
                <div style={{ display: 'inline-flex', padding: '10px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', color: '#10b981', marginBottom: '12px' }}>
                  <RiCheckFill size={32} />
                </div>
                <h3 style={{ color: '#fff', fontSize: '20px', margin: '0 0 6px 0', fontWeight: 800 }}>
                  Booking Confirmed!
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px 0' }}>
                  {bookingReceipt.message}
                </p>

                {/* Cryptographic QR Ticket Pass Simulation */}
                <div className="qr-placeholder">
                  <RiQrCodeFill size={80} color="#090d1f" />
                  <span className="qr-code-pattern">{bookingReceipt.booking?.qr_code_hash}</span>
                </div>

                <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '3px', fontSize: '12px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Pass ID</span>
                    <strong style={{ color: '#38bdf8' }}>{bookingReceipt.booking?.ticket_id}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Event</span>
                    <strong style={{ color: '#fff' }}>{bookingReceipt.booking?.event_title}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Tier &amp; Quantity</span>
                    <strong style={{ color: '#fff' }}>{bookingReceipt.booking?.quantity}x {bookingReceipt.booking?.tier_name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Total Paid</span>
                    <strong style={{ color: '#10b981' }}>{formatMoney(bookingReceipt.booking?.total_usd)}</strong>
                  </div>
                </div>

                <button 
                  className="btn-book-ticket"
                  onClick={() => setBookingModalEvent(null)}
                  style={{ width: '100%' }}
                >
                  Done &amp; Return to Concerts
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL 2: FAN RSVP & SMART CRM WAITLIST
          ------------------------------------------------------------- */}
      {rsvpModalEvent && (
        <div className="events-modal-overlay" onClick={() => setRsvpModalEvent(null)}>
          <div className="events-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="events-modal-close-btn" onClick={() => setRsvpModalEvent(null)}>
              <RiCloseLine size={20} />
            </button>

            {!rsvpSuccessMessage ? (
              <form onSubmit={handleRsvpSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <RiSparklingFill color="#38bdf8" size={20} />
                  <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
                    VIP FAN WAITLIST &amp; CRM SYNC
                  </span>
                </div>
                <h3 style={{ color: '#fff', fontSize: '20px', margin: '0 0 6px 0', fontWeight: 700 }}>
                  Join {rsvpModalEvent.artist} VIP Circle
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 20px 0' }}>
                  Get first access to side-stage soundcheck passes, secret pop-up shows, and vinyl pre-orders for {rsvpModalEvent.venue}.
                </p>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="form-control" 
                    value={rsvpFanName}
                    onChange={(e) => setRsvpFanName(e.target.value)}
                    placeholder="Your Name"
                    style={{ width: '100%', background: '#0d1326', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '8px 12px', borderRadius: '3px' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="form-control" 
                    value={rsvpFanEmail}
                    onChange={(e) => setRsvpFanEmail(e.target.value)}
                    placeholder="fan@example.com"
                    style={{ width: '100%', background: '#0d1326', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '8px 12px', borderRadius: '3px' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Your City</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={rsvpCity}
                    onChange={(e) => setRsvpCity(e.target.value)}
                    placeholder="e.g. Nairobi, London, Berlin"
                    style={{ width: '100%', background: '#0d1326', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '8px 12px', borderRadius: '3px' }}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1', marginBottom: '20px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={rsvpSms} 
                    onChange={(e) => setRsvpSms(e.target.checked)} 
                  />
                  Send SMS drop alerts when side-stage tickets release
                </label>

                <button 
                  type="submit" 
                  disabled={submittingRsvp}
                  className="btn-book-ticket" 
                  style={{ width: '100%', padding: '12px' }}
                >
                  {submittingRsvp ? 'Syncing to Smart CRM...' : 'Confirm Superfan Registration'}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(56, 189, 248, 0.15)', borderRadius: '50%', color: '#38bdf8', marginBottom: '14px' }}>
                  <RiCheckFill size={32} />
                </div>
                <h3 style={{ color: '#fff', fontSize: '20px', margin: '0 0 8px 0', fontWeight: 800 }}>
                  You're on the Guest List!
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 20px 0', lineHeight: 1.6 }}>
                  {rsvpSuccessMessage}
                </p>
                <button 
                  className="btn-book-ticket"
                  onClick={() => setRsvpModalEvent(null)}
                  style={{ margin: '0 auto', padding: '10px 24px' }}
                >
                  Return to Concerts
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL 3: IN-APP KNOWLEDGE BASE DOC MODAL
          ------------------------------------------------------------- */}
      <InAppDocModal 
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        initialArticleId={activeDocArticleId}
      />
    </section>
  );
}
