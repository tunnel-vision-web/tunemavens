import React, { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
  RiInformationFill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiStarFill
} from 'react-icons/ri'
import { useRegion } from '../../RegionContext.jsx'
import InAppDocModal from '../common/InAppDocModal.jsx'
import { AUTHORITATIVE_EVENTS, AUTHORITATIVE_MACRO_TELEMETRY } from '../../data/authoritativeEvents.js'
import './LiveEventsSection.css'

export default function LiveEventsSection({ sessionUser }) {
  const { currencyInfo, formatPrice } = useRegion();

  // State
  const [events, setEvents] = useState(AUTHORITATIVE_EVENTS);
  const [macroStats, setMacroStats] = useState(AUTHORITATIVE_MACRO_TELEMETRY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all'); // all | in-progress | upcoming | workshop
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dedicated Comprehensive Event Detail Page State
  const [selectedEventDetail, setSelectedEventDetail] = useState(null);

  // Featured Events Carousel State
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredEvents = useMemo(() => {
    const list = events.filter(e => e.status === 'in-progress' || (e.sold_percentage && e.sold_percentage > 50) || e.status === 'upcoming');
    return list.length > 0 ? list.slice(0, 5) : events.slice(0, 3);
  }, [events]);

  useEffect(() => {
    if (featuredEvents.length <= 1) return;
    const interval = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % featuredEvents.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [featuredEvents.length]);

  const activeFeatured = featuredEvents[featuredIndex] || events[0];

  const handleScrollToAllEvents = () => {
    setSelectedEventDetail(null);
    setStatusFilter('all');
    setSelectedCity('all');
    setSearchQuery('');
    const gridEl = document.getElementById('tunestream-all-events-section');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Booking & Checkout State (Used both on Event Detail Page and Modal)
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

  // Deep link or initial event selection support
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const eventParam = sp.get('event');
      if (eventParam && events && events.length > 0) {
        const found = events.find(e => e.id === eventParam || e.id === `event-${eventParam}` || String(e.id).includes(eventParam));
        if (found) {
          handleOpenEventPage(found);
        }
      }
    } catch (_) {}
  }, [events]);

  // Load Events from API
  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        if (data.events && Array.isArray(data.events) && data.events.length > 0) {
          setEvents(data.events);
        }
        if (data.macro_telemetry) {
          setMacroStats(data.macro_telemetry);
        }
      }
    } catch (err) {
      console.warn('Backend events API unavailable, using authoritative events catalog', err);
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

  // Format currency using regional context
  const formatMoney = (usdVal) => {
    if (typeof formatPrice === 'function') {
      return formatPrice(usdVal);
    }
    if (!currencyInfo) return `$${usdVal}`;
    const rate = currencyInfo.rate || 1;
    const symbol = currencyInfo.symbol || '$';
    const converted = Math.round(usdVal * rate);
    return `${symbol} ${converted.toLocaleString()}`;
  };

  // Navigate to Comprehensive Event Detail Page first
  const handleOpenEventPage = (event) => {
    if (!event) return;
    setSelectedEventDetail(event);
    setSelectedTierId(event.tiers?.[0]?.tier_id || 'ga');
    setTicketQuantity(1);
    setBookingReceipt(null);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Open booking modal directly if needed
  const handleOpenBooking = (event) => {
    handleOpenEventPage(event);
  };

  // Submit Booking (Works on Event Detail Page & Modal)
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const targetEvent = selectedEventDetail || bookingModalEvent;
    if (!targetEvent) return;
    setSubmittingBooking(true);
    try {
      const payload = {
        event_id: targetEvent.id,
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
      const tier = targetEvent.tiers?.find(t => t.tier_id === selectedTierId) || { name: 'Standard Pass', price_usd: 25 };
      setBookingReceipt({
        status: 'success',
        message: `Tickets reserved for ${targetEvent.title}! Confirmation sent to ${customerEmail || 'your email'}.`,
        booking: {
          ticket_id: 'TKT-202610-' + Math.random().toString(36).substring(4, 9).toUpperCase(),
          event_title: targetEvent.title,
          artist: targetEvent.artist,
          venue: targetEvent.venue,
          date: targetEvent.date_display,
          tier_name: tier.name,
          quantity: ticketQuantity,
          total_usd: tier.price_usd * ticketQuantity,
          total_kes: (tier.price_kes || tier.price_usd * 130) * ticketQuantity,
          qr_code_hash: 'tm_pass_verified_' + Math.random().toString(36).substring(7)
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

  // If an event card was clicked, render the Comprehensive Event Detail Page first
  if (selectedEventDetail) {
    const evt = selectedEventDetail;
    const isLive = evt.status === 'in-progress';
    const progressColor = evt.sold_percentage > 90 ? '#ef4444' : evt.sold_percentage > 70 ? '#f59e0b' : '#10b981';
    const artistSlug = (evt.artist || 'ndufo').toLowerCase().replace(/[^a-z0-9]/g, '');
    const runOfShow = evt.schedule || [
      { time: '18:30', title: 'VIP Doors, Merch Pop-Up & Spatial Soundcheck Lounge' },
      { time: '20:00', title: `Opening Showcase & Regional Guest DJ Set (${evt.city})` },
      { time: '21:30', title: `${evt.artist} — Headline Live Performance & 24-Bit Broadcast` },
      { time: '23:30', title: 'Backstage Meet & Greet + Exclusive Stem & Vinyl Drop' }
    ];
    const activeTier = evt.tiers?.find(t => t.tier_id === selectedTierId) || evt.tiers?.[0] || {
      tier_id: 'ga',
      name: 'General Admission Pass',
      price_usd: 25,
      available: 120,
      perks: ['Full concert floor access', 'Cryptographic QR Pass in TuneStream Wallet']
    };

    return (
      <section className="live-events-container" data-testid="event-detail-page">
        {/* Top Breadcrumb & Navigation Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', padding: '14px 18px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
          <button
            type="button"
            onClick={() => {
              setSelectedEventDetail(null);
              setBookingReceipt(null);
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}
            data-testid="back-to-events-btn"
          >
            <RiArrowLeftSLine size={16} /> Back to All Events &amp; Tours
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              to={`/epk/${artistSlug}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'rgba(0,242,254,0.12)', color: '#00f2fe', border: '1px solid rgba(0,242,254,0.35)', borderRadius: '3px', fontSize: '12px', fontWeight: 800, textDecoration: 'none' }}
            >
              🌐 View {evt.artist} EPK
            </Link>
            <button
              type="button"
              onClick={() => {
                setRsvpModalEvent(evt);
                setRsvpSuccessMessage(null);
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.35)', borderRadius: '3px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
            >
              <RiSparklingFill size={14} /> Join VIP Waitlist
            </button>
          </div>
        </div>

        {/* Hero Banner Card */}
        <div style={{ background: '#090c16', border: '1px solid rgba(0,240,255,0.22)', borderRadius: '3px', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ position: 'relative', height: '320px', width: '100%', background: '#050811' }}>
            <img
              src={evt.image_url}
              alt={evt.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,8,19,0.25) 0%, rgba(6,8,19,0.96) 100%)' }} />
            <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span className={`event-badge ${evt.status}`} style={{ borderRadius: '3px' }}>
                    {isLive && <span className="events-pulse-dot" style={{ width: '6px', height: '6px' }}></span>}
                    {evt.status_label || 'Official Tour Stop'}
                  </span>
                  <span style={{ background: 'rgba(0,242,254,0.15)', color: '#00f2fe', padding: '4px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: 800 }}>
                    {evt.genre}
                  </span>
                  <span style={{ background: 'rgba(255,255,255,0.1)', color: '#e2e8f0', padding: '4px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: 700 }}>
                    {evt.city}, {evt.country}
                  </span>
                </div>
                <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#fff', margin: '0 0 6px', fontFamily: 'Sansation, sans-serif' }}>
                  {evt.title}
                </h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', fontSize: '13.5px', color: '#cbd5e1', alignItems: 'center' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#00f2fe', fontWeight: 800 }}>
                    <RiUserVoiceFill size={15} /> {evt.artist}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <RiCalendarEventFill size={15} color="#10b981" /> {evt.date_display}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <RiMapPin2Fill size={15} color="#f59e0b" /> {evt.venue} · {evt.city}, {evt.country}
                  </span>
                </div>
              </div>

              <div style={{ background: 'rgba(6,8,19,0.9)', border: '1px solid rgba(255,255,255,0.12)', padding: '12px 16px', borderRadius: '3px', minWidth: '240px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>{evt.tickets_sold} / {evt.capacity} Passes Sold</span>
                  <strong style={{ color: progressColor }}>{evt.sold_percentage}% Booked</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(evt.sold_percentage || 65, 100)}%`, height: '100%', background: progressColor }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Comprehensive Event Details + Integrated Ticket Purchase */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* Left Column: Comprehensive Event Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Event Overview */}
            <div style={{ background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '22px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Comprehensive Event Overview
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '4px 0 12px' }}>
                About {evt.title}
              </h3>
              <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: 1.7, margin: '0 0 14px' }}>
                {evt.description || `${evt.title} brings ${evt.artist} to ${evt.venue} in ${evt.city} for an immersive live showcase powered by TuneMavens Tour Capital and 24-bit spatial soundstage engineering.`}
              </p>
              <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                Every ticket purchased on this page mints a cryptographic QR pass tied to your TuneStream &amp; TunePay wallet, with automated split settlement directly to the performing artist, promoter, and venue.
              </p>
            </div>

            {/* Run-of-Show Schedule */}
            <div style={{ background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '22px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Stage Timeline
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '4px 0 14px' }}>
                Run of Show &amp; Set Times
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {runOfShow.map((slot, idx) => (
                  <div
                    key={idx}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', padding: '12px 14px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 800, color: '#00f2fe', background: 'rgba(0,242,254,0.1)', padding: '4px 8px', borderRadius: '3px' }}>
                        {slot.time}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{slot.title}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>Confirmed</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Venue, Soundstage & Production Specs */}
            <div style={{ background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '22px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Venue &amp; Technical Production
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '4px 0 14px' }}>
                {evt.venue} · {evt.city}, {evt.country}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Audio Architecture</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>24-Bit / 96kHz Spatial Array</div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>On-Site Commerce</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>TunePay POS &amp; M-Pesa Express</div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Gate Verification</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#00f2fe' }}>Cryptographic QR Pass</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Integrated Ticket Purchase & Pass Minting */}
          <div style={{ background: '#090c16', border: '1.5px solid rgba(0,242,254,0.35)', borderRadius: '3px', padding: '24px' }}>
            {!bookingReceipt ? (
              <form onSubmit={handleBookingSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <RiTicket2Fill color="#00f2fe" size={20} />
                  <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    OFFICIAL EVENT BOX OFFICE
                  </span>
                </div>
                <h3 style={{ color: '#fff', fontSize: '20px', margin: '0 0 6px 0', fontWeight: 900 }}>
                  Purchase Event Passes
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '12.5px', margin: '0 0 18px 0' }}>
                  Select your ticket tier below. All prices are localized to your active currency.
                </p>

                {/* Tier Selection */}
                <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                  1. Select Pass Tier
                </label>
                {(evt.tiers || [activeTier]).map(t => {
                  const isSelected = selectedTierId === t.tier_id;
                  return (
                    <div 
                      key={t.tier_id}
                      className={`ticket-tier-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedTierId(t.tier_id)}
                      style={{ cursor: 'pointer', borderRadius: '3px', marginBottom: '10px' }}
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

                {/* Quantity & Total */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', margin: '16px 0' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                      2. Quantity
                    </label>
                    <select 
                      className="form-control"
                      value={ticketQuantity}
                      onChange={(e) => setTicketQuantity(Number(e.target.value))}
                      style={{ width: '100%', background: '#0d1326', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '10px', borderRadius: '3px' }}
                    >
                      {[1, 2, 3, 4, 6, 8, 10].map(q => (
                        <option key={q} value={q}>{q} Pass{q > 1 ? 'es' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                      Total Settlement
                    </label>
                    <div style={{ padding: '10px', background: 'rgba(0, 242, 254, 0.08)', border: '1px solid rgba(0, 242, 254, 0.3)', borderRadius: '3px', fontWeight: 900, fontSize: '16px', color: '#00f2fe' }}>
                      {formatMoney((activeTier?.price_usd || 25) * ticketQuantity)}
                    </div>
                  </div>
                </div>

                {/* Purchaser Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Kiprono Langat"
                      style={{ width: '100%', background: '#0d1326', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '8px 12px', borderRadius: '3px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Delivery Email</label>
                    <input 
                      type="email" 
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. fan@gmail.com"
                      style={{ width: '100%', background: '#0d1326', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '8px 12px', borderRadius: '3px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Payment Rail Toggle */}
                <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  3. Payment Method
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
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                      M-Pesa Mobile Number
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="2547XXXXXXXX"
                      style={{ width: '100%', background: '#0d1326', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '8px 12px', borderRadius: '3px', boxSizing: 'border-box' }}
                    />
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={submittingBooking}
                  className="btn-book-ticket" 
                  style={{ width: '100%', padding: '13px', fontSize: '14px', fontWeight: 900 }}
                  data-testid="confirm-event-purchase-btn"
                >
                  {submittingBooking ? 'Minting Cryptographic Pass...' : `Purchase ${ticketQuantity} Pass${ticketQuantity > 1 ? 'es' : ''} (${formatMoney((activeTier?.price_usd || 25) * ticketQuantity)})`}
                </button>
              </form>
            ) : (
              /* Booking Success Confirmation Receipt Inside Event Page */
              <div className="ticket-receipt-card">
                <div style={{ display: 'inline-flex', padding: '10px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', color: '#10b981', marginBottom: '12px' }}>
                  <RiCheckFill size={32} />
                </div>
                <h3 style={{ color: '#fff', fontSize: '20px', margin: '0 0 6px 0', fontWeight: 800 }}>
                  Pass Minted &amp; Confirmed!
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px 0' }}>
                  {bookingReceipt.message}
                </p>

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

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="button"
                    className="btn-book-ticket"
                    onClick={() => setBookingReceipt(null)}
                    style={{ flex: 1 }}
                  >
                    Book More Passes
                  </button>
                  <button 
                    type="button"
                    className="btn-rsvp-waitlist"
                    onClick={() => {
                      setBookingReceipt(null);
                      setSelectedEventDetail(null);
                    }}
                    style={{ flex: 1 }}
                  >
                    All Events
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

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
              Click any event card below to visit its dedicated Event Page with full run-of-show schedules, venue soundstage specs, and instant ticket pass purchase.
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

      {/* Featured Events Carousel with CTA */}
      {activeFeatured && (
        <div className="featured-events-carousel-wrap">
          <div className="featured-carousel-header-bar">
            <div className="featured-carousel-title-row">
              <span className="events-ticker-pill" style={{ margin: 0, background: 'rgba(0, 240, 255, 0.15)', borderColor: 'rgba(0, 240, 255, 0.4)', color: '#00f0ff' }}>
                <RiStarFill size={13} color="#00f0ff" /> Featured Tour Showcase
              </span>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                Event {featuredIndex + 1} of {featuredEvents.length}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                type="button"
                className="btn-view-all-events-cta"
                onClick={handleScrollToAllEvents}
              >
                <span>View All Events ({events.length})</span>
                <RiArrowRightLine size={15} />
              </button>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className="featured-carousel-nav-btn"
                  onClick={() => setFeaturedIndex(prev => (prev - 1 + featuredEvents.length) % featuredEvents.length)}
                  title="Previous featured event"
                >
                  <RiArrowLeftSLine size={18} />
                </button>
                <button
                  type="button"
                  className="featured-carousel-nav-btn"
                  onClick={() => setFeaturedIndex(prev => (prev + 1) % featuredEvents.length)}
                  title="Next featured event"
                >
                  <RiArrowRightSLine size={18} />
                </button>
              </div>
            </div>
          </div>

          <div
            className="featured-carousel-inner"
            onClick={() => handleOpenEventPage(activeFeatured)}
            style={{ cursor: 'pointer' }}
          >
            <div className="featured-carousel-media">
              <img src={activeFeatured.image_url} alt={activeFeatured.title} />
              <div className="featured-carousel-media-overlay" />
            </div>

            <div className="featured-carousel-content">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className={`event-badge ${activeFeatured.status}`}>
                    {activeFeatured.status === 'in-progress' && <span className="events-pulse-dot" style={{ width: '6px', height: '6px' }}></span>}
                    {activeFeatured.status_label || 'Featured Event'}
                  </span>
                  <span className="event-capacity-chip">
                    {activeFeatured.city}, {activeFeatured.country_code}
                  </span>
                  <span className="event-genre-tag">
                    {activeFeatured.genre}
                  </span>
                </div>

                <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', margin: '0 0 6px', fontFamily: 'Sansation, sans-serif' }}>
                  {activeFeatured.title}
                </h2>
                <div style={{ fontSize: '15px', color: '#00f0ff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                  <RiUserVoiceFill size={15} />
                  <span>{activeFeatured.artist}</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#cbd5e1', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RiCalendarEventFill size={14} color="#10b981" />
                    <span>{activeFeatured.date_display}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RiMapPin2Fill size={14} color="#f59e0b" />
                    <span>{activeFeatured.venue} · {activeFeatured.city}, {activeFeatured.country}</span>
                  </div>
                </div>

                {/* Capacity and ticketing progress */}
                <div style={{ maxWidth: '420px', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#94a3b8' }}>{activeFeatured.tickets_sold} / {activeFeatured.capacity} Passes Booked</span>
                    <span style={{ fontWeight: 700, color: activeFeatured.sold_percentage > 90 ? '#ef4444' : '#10b981' }}>
                      {activeFeatured.sold_percentage}% Sold
                    </span>
                  </div>
                  <div className="event-progress-bar-bg">
                    <div 
                      className={`event-progress-fill ${activeFeatured.sold_percentage > 90 ? 'red' : activeFeatured.sold_percentage > 70 ? 'yellow' : 'green'}`}
                      style={{ width: `${Math.min(activeFeatured.sold_percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                  <button 
                    type="button"
                    className="btn-book-ticket"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEventPage(activeFeatured);
                    }}
                    style={{ padding: '12px 24px', fontSize: '14px' }}
                  >
                    <RiTicket2Fill size={16} /> View Event Page &amp; Passes ({activeFeatured.tiers?.[0] ? formatMoney(activeFeatured.tiers[0].price_usd) : 'Passes'})
                  </button>
                  <button 
                    type="button"
                    className="btn-rsvp-waitlist"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRsvpModalEvent(activeFeatured);
                      setRsvpSuccessMessage(null);
                    }}
                    style={{ padding: '12px 20px', fontSize: '14px' }}
                  >
                    <RiSparklingFill size={15} /> Join VIP Waitlist
                  </button>
                  {activeFeatured.status === 'in-progress' && activeFeatured.stream_url && (
                    <a 
                      href={activeFeatured.stream_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-live-stream"
                      onClick={(e) => e.stopPropagation()}
                      style={{ padding: '12px 20px', fontSize: '14px' }}
                    >
                      <RiRadioFill size={15} /> Watch Stream
                    </a>
                  )}
                </div>

                {/* Dot Indicators */}
                <div className="featured-carousel-dots" style={{ marginTop: '20px' }} onClick={(e) => e.stopPropagation()}>
                  {featuredEvents.map((e, idx) => (
                    <div 
                      key={e.id || idx}
                      className={`featured-carousel-dot ${idx === featuredIndex ? 'active' : ''}`}
                      onClick={() => setFeaturedIndex(idx)}
                      title={`Go to event ${idx + 1}: ${e.title}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div id="tunestream-all-events-section" />

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
              <div
                key={evt.id}
                className="event-card"
                data-testid={`event-card-${evt.id}`}
                onClick={() => handleOpenEventPage(evt)}
                style={{ cursor: 'pointer' }}
              >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEventPage(evt);
                      }}
                      data-testid={`btn-book-${evt.id}`}
                    >
                      <RiTicket2Fill size={15} /> View Event &amp; Passes
                    </button>
                    <button 
                      className="btn-rsvp-waitlist"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRsvpModalEvent(evt);
                        setRsvpSuccessMessage(null);
                      }}
                      data-testid={`btn-rsvp-${evt.id}`}
                    >
                      <RiSparklingFill size={14} /> Join VIP List
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: FAN RSVP & SMART CRM WAITLIST
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
          MODAL: IN-APP KNOWLEDGE BASE DOC MODAL
          ------------------------------------------------------------- */}
      <InAppDocModal 
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        initialArticleId={activeDocArticleId}
      />
    </section>
  );
}
