import React, { useEffect, useState } from 'react';
import {
  RiCalendarEventFill,
  RiMapPin2Fill,
  RiTicket2Fill,
  RiUserVoiceFill,
  RiMicFill,
  RiStarFill,
  RiArrowRightLine,
} from 'react-icons/ri';
import { useRegion } from '../RegionContext.jsx';

export default function FeaturedEventRow() {
  const { currencyInfo } = useRegion();
  const [featuredEvent, setFeaturedEvent] = useState(null);

  useEffect(() => {
    let active = true;
    fetch('/api/events/featured')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (active && d?.featured_event) {
          setFeaturedEvent(d.featured_event);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  if (!featuredEvent) return null;

  const isLocal = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const portalBase = isLocal ? 'http://localhost:3000' : 'https://tunemavens.com';

  const isFreeRsvp = featuredEvent.payment_mode === 'free_rsvp';
  const lowestTier = (featuredEvent.tiers || [])[0];
  const formatPrice = (usdVal) => {
    if (!usdVal && usdVal !== 0) return '';
    if (!currencyInfo) return `$${usdVal}`;
    const rate = currencyInfo.rate || 1;
    const symbol = currencyInfo.symbol || '$';
    return `${symbol} ${Math.round(usdVal * rate).toLocaleString()}`;
  };
  const costText = isFreeRsvp
    ? 'FREE · RSVP Only'
    : lowestTier?.price_usd
    ? `From ${formatPrice(lowestTier.price_usd)}`
    : 'Paid Passes';
  const rawDesc = featuredEvent.description || `${featuredEvent.title} live at ${featuredEvent.venue} in ${featuredEvent.city}.`;
  const shortDesc = rawDesc.length > 210 ? `${rawDesc.slice(0, 207).trim()}...` : rawDesc;
  const confirmUrl = `${portalBase}/#/reachout/direct?action=${isFreeRsvp ? 'rsvp' : 'ticket'}&event_id=${encodeURIComponent(featuredEvent.id)}&promo=event`;
  const eventPageUrl = `${portalBase}/#/events?event=${encodeURIComponent(featuredEvent.id)}`;

  return (
    <section
      data-testid="syncmavens-featured-event-section"
      style={{ maxWidth: '1200px', margin: '32px auto 8px', padding: '0 24px', boxSizing: 'border-box' }}
    >
      <div
        style={{
          borderRadius: '3px',
          border: '1px solid rgba(34, 211, 238, 0.32)',
          background: 'linear-gradient(135deg, rgba(11, 16, 32, 0.96) 0%, rgba(6, 10, 22, 0.98) 100%)',
          padding: '22px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '22px',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: '0 0 240px', maxWidth: '100%' }}>
          <div style={{ position: 'relative', borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(34, 211, 238, 0.25)' }}>
            <img
              src={featuredEvent.image_url}
              alt={featuredEvent.title}
              style={{ width: '100%', height: '165px', objectFit: 'cover', display: 'block' }}
            />
            <span
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                background: isFreeRsvp ? '#10b981' : '#ef4444',
                color: isFreeRsvp ? '#04141a' : '#ffffff',
                fontSize: '10px',
                fontWeight: 800,
                padding: '3px 7px',
                borderRadius: '3px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {isFreeRsvp ? 'FREE · RSVP' : (featuredEvent.status_label || 'FEATURED EVENT')}
            </span>
          </div>
        </div>

        <div style={{ flex: '1 1 360px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', fontWeight: 800, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              <RiStarFill size={12} color="#22d3ee" /> Featured Event
            </span>
            <span style={{ fontSize: '12.5px', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <RiCalendarEventFill size={13} color="#10b981" /> {featuredEvent.date_display || featuredEvent.date_iso}
              {featuredEvent.time ? ` · ${featuredEvent.time}` : ''}
            </span>
            <span style={{ fontSize: '12.5px', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <RiMapPin2Fill size={13} color="#f59e0b" /> {featuredEvent.venue} · {featuredEvent.city}
            </span>
          </div>

          <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 800, color: '#ffffff', lineHeight: 1.25 }}>
            {featuredEvent.title}
          </h3>
          <p style={{ margin: '0 0 14px', fontSize: '14px', color: '#cbd5e1', lineHeight: 1.55 }}>
            {shortDesc}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '10px', marginBottom: '16px', fontSize: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '12px 14px', lineHeight: 1.45 }}>
            <div>
              <strong style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '2px' }}>
                <RiUserVoiceFill size={13} style={{ verticalAlign: 'middle', marginRight: '5px', color: '#22d3ee' }} />Hosts
              </strong>
              <span style={{ color: '#22d3ee', fontWeight: 700, fontSize: '14.5px' }}>
                {featuredEvent.hosts || featuredEvent.artist || 'TuneMavens Live'}
              </span>
            </div>
            <div>
              <strong style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '2px' }}>
                <RiMicFill size={13} style={{ verticalAlign: 'middle', marginRight: '5px', color: '#c084fc' }} />MC
              </strong>
              <span style={{ color: '#c084fc', fontWeight: 700, fontSize: '14.5px' }}>
                {featuredEvent.mc || 'TuneMavens Live Host'}
              </span>
            </div>
            <div>
              <strong style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '2px' }}>
                Entertainers
              </strong>
              <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '14.5px' }}>
                {featuredEvent.entertainers || featuredEvent.artist}
              </span>
            </div>
            <div>
              <strong style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '2px' }}>
                Cost / Access
              </strong>
              <span style={{ color: isFreeRsvp ? '#10b981' : '#38bdf8', fontWeight: 800, fontSize: '14.5px' }}>
                {costText}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <a
              href={confirmUrl}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '10px 18px',
                background: isFreeRsvp ? '#10b981' : '#22d3ee',
                color: '#04141a',
                borderRadius: '3px',
                fontWeight: 900,
                fontSize: '13.5px',
                textDecoration: 'none',
              }}
            >
              <RiTicket2Fill size={15} color="#04141a" />
              {isFreeRsvp ? 'RSVP Now (Reserve Spot)' : 'Purchase Ticket / Reserve Pass'}
            </a>
            <a
              href={eventPageUrl}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#ffffff',
                borderRadius: '3px',
                fontWeight: 700,
                fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              View Event Page <RiArrowRightLine size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
