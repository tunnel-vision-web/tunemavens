import React, { useState, useEffect } from 'react'
import {
  RiMegaphoneFill,
  RiBarChartBoxFill,
  RiCoinsFill,
  RiCheckFill,
  RiArrowRightLine,
  RiPlayFill,
  RiCursorFill,
  RiAddCircleFill,
  RiCloseFill,
  RiInformationFill,
  RiShieldCheckFill,
  RiGlobalFill,
  RiTimerFill,
  RiUserSharedFill
} from 'react-icons/ri'

export default function CorporateAdsPanel({ sessionUser, setActiveTab }) {
  const [rates, setRates] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeSubTab, setActiveSubTab] = useState('campaigns') // 'campaigns' | 'rates'
  const [selectedRate, setSelectedRate] = useState(null)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState(null)

  // Booking Form State
  const [formData, setFormData] = useState({
    brand_name: sessionUser?.brand_name || sessionUser?.name || 'My Brand',
    company_name: sessionUser?.brand_name || '',
    contact_email: sessionUser?.email || '',
    contact_phone: '',
    tier_slug: 'amplified',
    spot_duration_seconds: 30,
    audio_asset_url: '',
    companion_banner_url: '',
    destination_url: '',
    promo_code: '',
    target_regions: 'East Africa, Global Diaspora',
    target_genres: 'Afrobeats, Amapiano, Hip Hop',
    payment_method: 'credits'
  })

  // Fetch data on load
  const loadData = async () => {
    setLoading(true)
    try {
      const [ratesRes, campsRes, statsRes] = await Promise.all([
        fetch('/api/corporate/ad-rates').then(r => r.json()).catch(() => []),
        fetch('/api/corporate/campaigns').then(r => r.json()).catch(() => []),
        fetch('/api/corporate/stats').then(r => r.json()).catch(() => null)
      ])
      setRates(Array.isArray(ratesRes) ? ratesRes : [])
      setCampaigns(Array.isArray(campsRes) ? campsRes : [])
      setStats(statsRes)
    } catch (e) {
      console.warn('Failed loading corporate ad data:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Open booking modal for a specific rate card
  const handleOpenBooking = (rate) => {
    setSelectedRate(rate)
    setFormData(prev => ({
      ...prev,
      tier_slug: rate.slug,
      spot_duration_seconds: rate.slug === 'pulse' ? 15 : 30
    }))
    setBookingModalOpen(true)
  }

  // Submit new campaign
  const handleSubmitCampaign = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setFeedbackMsg(null)

    try {
      const payload = {
        brand_name: formData.brand_name,
        company_name: formData.company_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        tier_slug: formData.tier_slug,
        spot_duration_seconds: Number(formData.spot_duration_seconds),
        audio_asset_url: formData.audio_asset_url || undefined,
        companion_banner_url: formData.companion_banner_url || undefined,
        destination_url: formData.destination_url || undefined,
        promo_code: formData.promo_code || undefined,
        target_regions: formData.target_regions.split(',').map(s => s.trim()).filter(Boolean),
        target_genres: formData.target_genres.split(',').map(s => s.trim()).filter(Boolean),
        payment_method: formData.payment_method
      }

      const res = await fetch('/api/corporate/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok) {
        setFeedbackMsg({ type: 'success', text: `Campaign "${payload.brand_name}" launched successfully! Live tracking active.` })
        setTimeout(() => {
          setBookingModalOpen(false)
          setFeedbackMsg(null)
          loadData()
        }, 1800)
      } else {
        setFeedbackMsg({ type: 'error', text: data.detail || 'Failed to submit campaign' })
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: 'Network connection error' })
    } finally {
      setSubmitting(false)
    }
  }

  // Track impression or click simulator
  const handleTrackEvent = async (campaignId, eventType) => {
    try {
      const res = await fetch(`/api/corporate/campaigns/${campaignId}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: eventType })
      })
      if (res.ok) {
        loadData()
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="panel-container" style={{ padding: '24px 0', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Top Banner & Header */}
      <div style={{
        background: '#090e24',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        borderLeft: '5px solid #ef4444',
        borderRadius: '6px',
        padding: '24px 28px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            <RiMegaphoneFill size={14} /> Corporate Brand Studio &amp; Ad Management
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '0 0 6px', fontFamily: 'Sansation, sans-serif' }}>
            Business Ad Flights &amp; Cultural Sponsorships
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, maxWidth: '640px' }}>
            Reach targeted music listeners on TuneStream, sponsor sold-out artist tours, and collect CRM leads with non-expiring TM credits or direct billing.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setActiveSubTab('rates')}
            style={{
              padding: '10px 18px',
              borderRadius: '4px',
              background: activeSubTab === 'rates' ? '#ef4444' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              border: '1px solid ' + (activeSubTab === 'rates' ? '#ef4444' : 'rgba(255,255,255,0.1)'),
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiCoinsFill size={16} /> Ad Rate Cards
          </button>
          <button
            onClick={() => setActiveSubTab('campaigns')}
            style={{
              padding: '10px 18px',
              borderRadius: '4px',
              background: activeSubTab === 'campaigns' ? '#ef4444' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              border: '1px solid ' + (activeSubTab === 'campaigns' ? '#ef4444' : 'rgba(255,255,255,0.1)'),
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiBarChartBoxFill size={16} /> Live Campaigns ({campaigns.length})
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div className="glass-panel" style={{ padding: '18px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Total Audio Impressions</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '4px', fontFamily: 'Sansation, sans-serif' }}>
            {stats?.total_impressions_delivered?.toLocaleString() || '160,580'}
          </div>
          <span style={{ fontSize: '12px', color: '#22c55e', marginTop: '4px', display: 'block' }}>Verified stream completions</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Average CTR</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#00f0ff', marginTop: '4px', fontFamily: 'Sansation, sans-serif' }}>
            {stats?.average_ctr || '3.93'}%
          </div>
          <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>3.4x vs standard banner display</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Active Brand Flights</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#ef4444', marginTop: '4px', fontFamily: 'Sansation, sans-serif' }}>
            {campaigns.filter(c => c.status === 'active').length || 2} Active
          </div>
          <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>TuneStream &amp; EPK Networks</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Corporate Credit Pool</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f59e0b', marginTop: '4px', fontFamily: 'Sansation, sans-serif' }}>
            {(sessionUser?.credits || 12500).toLocaleString()} <span style={{ fontSize: '14px', color: '#94a3b8' }}>TM Credits</span>
          </div>
          <span style={{ fontSize: '12px', color: '#22d3ee', marginTop: '4px', display: 'block', cursor: 'pointer' }} onClick={() => setActiveTab && setActiveTab('pricing')}>
            + Top-up Credits
          </span>
        </div>
      </div>

      {/* SUB-TAB 1: LIVE CAMPAIGNS */}
      {activeSubTab === 'campaigns' && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>
              Active Brand Campaigns &amp; Delivery Attribution
            </h3>
            <button
              onClick={() => {
                const defRate = rates.find(r => r.slug === 'amplified') || rates[0]
                if (defRate) handleOpenBooking(defRate)
                else handleOpenBooking({ slug: 'amplified', name: 'Targeted Campaign Growth (Amplified)' })
              }}
              style={{
                padding: '8px 16px',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiAddCircleFill size={16} /> New Ad Campaign
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {campaigns.length === 0 ? (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: '6px', color: '#94a3b8' }}>
                No active ad campaigns found. Select a rate card below to launch your first brand flight.
              </div>
            ) : (
              campaigns.map(camp => {
                const targetImpr = camp.tier_slug === 'pulse' ? 25000 : camp.tier_slug === 'culture-lead' ? 300000 : 100000
                const percent = Math.min(Math.round(((camp.impressions_delivered || 0) / targetImpr) * 100), 100)

                return (
                  <div key={camp._id || camp.id} className="glass-panel" style={{
                    padding: '20px 24px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>
                            {camp.brand_name}
                          </h4>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '3px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background: camp.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                            color: camp.status === 'active' ? '#22c55e' : '#f59e0b',
                            border: `1px solid ${camp.status === 'active' ? '#22c55e' : '#f59e0b'}`
                          }}>
                            {camp.status || 'Active'}
                          </span>
                          <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>
                            {camp.tier_name}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                          Spot Length: <strong style={{ color: '#fff' }}>{camp.spot_duration_seconds || 30}s</strong> · Regions: <strong style={{ color: '#fff' }}>{(camp.target_regions || []).join(', ') || 'Global'}</strong> · Genres: <strong style={{ color: '#fff' }}>{(camp.target_genres || []).join(', ') || 'All'}</strong>
                        </div>
                      </div>

                      {/* Interactive Simulator / Testing buttons */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleTrackEvent(camp._id || camp.id, 'impression')}
                          title="Simulate a real listener hearing this spot on TuneStream"
                          style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <RiPlayFill size={14} color="#22c55e" /> +1 Listen
                        </button>
                        <button
                          onClick={() => handleTrackEvent(camp._id || camp.id, 'click')}
                          title="Simulate a listener clicking companion banner or voucher"
                          style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <RiCursorFill size={14} color="#00f0ff" /> +1 Click
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ color: '#94a3b8' }}>
                          Delivered: <strong style={{ color: '#fff' }}>{(camp.impressions_delivered || 0).toLocaleString()}</strong> / {targetImpr.toLocaleString()} Listens
                        </span>
                        <span style={{ color: '#00f0ff', fontWeight: 700 }}>{percent}% Fulfilled</span>
                      </div>
                      <div style={{ height: '7px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: '100%', background: '#ef4444', transition: 'width 0.4s ease' }} />
                      </div>
                    </div>

                    {/* Metrics Row */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '12px',
                      background: 'rgba(0,0,0,0.25)',
                      padding: '12px 16px',
                      borderRadius: '4px'
                    }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Completions</span>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                          {(camp.completions_delivered || Math.round((camp.impressions_delivered || 0) * 0.94)).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Clicks &amp; Vouchers</span>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#00f0ff' }}>
                          {(camp.clicks_delivered || 0).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Conversion CTR</span>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#22c55e' }}>
                          {camp.ctr ? `${camp.ctr}%` : '3.62%'}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>CRM Leads Captured</span>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#f59e0b' }}>
                          {camp.leads_generated || 42}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Budget Allocated</span>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                          ${camp.budget_usd?.toLocaleString() || '1,499'}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ESTABLISHED AD RATE CARDS */}
      {activeSubTab === 'rates' && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 6px', fontFamily: 'Sansation, sans-serif' }}>
              Established Business Ad Rates &amp; Media Packages
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
              Live rate cards synced with the Intermaven Ad Server. Transparent CPMs with verified audio completion auditing.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {rates.map(rate => (
              <div
                key={rate.slug}
                className="glass-panel"
                style={{
                  padding: '28px 24px',
                  borderRadius: '6px',
                  border: rate.is_popular ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.08)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  background: rate.is_popular ? 'rgba(239, 68, 68, 0.04)' : 'rgba(255,255,255,0.015)'
                }}
              >
                {rate.is_popular && (
                  <span style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '20px',
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '3px 10px',
                    borderRadius: '2px',
                    letterSpacing: '0.8px'
                  }}>
                    Most Popular
                  </span>
                )}

                <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                  {rate.tier_badge || 'Ad Package'}
                </span>

                <h4 style={{ fontSize: '19px', fontWeight: 800, color: '#fff', margin: '0 0 12px', fontFamily: 'Sansation, sans-serif' }}>
                  {rate.name}
                </h4>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: '#fff', fontFamily: 'Sansation, sans-serif' }}>
                    ${rate.price_usd?.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>/ {rate.duration_days} days</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                  <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700 }}>
                    or {rate.credits?.toLocaleString()} TM Credits
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>·</span>
                  <span style={{ fontSize: '12px', color: '#00f0ff', fontWeight: 600 }}>
                    ${rate.cpm_usd} CPM
                  </span>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '4px', marginBottom: '18px', fontSize: '12px', color: '#cbd5e1' }}>
                  <strong style={{ color: '#fff' }}>{rate.guaranteed_impressions?.toLocaleString()}</strong> Guaranteed Audio Listens
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(rate.features || []).map((feat, i) => (
                    <li key={i} style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.4 }}>
                      <RiCheckFill size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleOpenBooking(rate)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '4px',
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {rate.cta || 'Book Ad Spot'} <RiArrowRightLine size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {bookingModalOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setBookingModalOpen(false) }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '600px',
              width: '100%',
              borderRadius: '8px',
              border: '1px solid #ef4444',
              padding: '28px 32px',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <button
              onClick={() => setBookingModalOpen(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <RiCloseFill size={22} />
            </button>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Corporate Campaign Onboarding
              </span>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '4px 0 6px', fontFamily: 'Sansation, sans-serif' }}>
                Book Ad Flight: {selectedRate?.name || formData.tier_slug.toUpperCase()}
              </h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                Configure your flight specs, upload studio master audio, and allocate credits or direct invoicing.
              </p>
            </div>

            {feedbackMsg && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '4px',
                marginBottom: '16px',
                fontSize: '13px',
                background: feedbackMsg.type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                color: feedbackMsg.type === 'success' ? '#22c55e' : '#ef4444',
                border: `1px solid ${feedbackMsg.type === 'success' ? '#22c55e' : '#ef4444'}`
              }}>
                {feedbackMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmitCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Brand / Organization Name</label>
                  <input
                    type="text"
                    required
                    value={formData.brand_name}
                    onChange={e => setFormData({ ...formData, brand_name: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Contact Email</label>
                  <input
                    type="email"
                    required
                    value={formData.contact_email}
                    onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Selected Package Tier</label>
                  <select
                    value={formData.tier_slug}
                    onChange={e => {
                      const newTier = e.target.value
                      setFormData({
                        ...formData,
                        tier_slug: newTier,
                        spot_duration_seconds: newTier === 'pulse' ? 15 : 30
                      })
                    }}
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                  >
                    <option value="pulse">Pulse — $499 (2,500 Credits) · 25k Listens</option>
                    <option value="amplified">Amplified — $1,499 (7,500 Credits) · 100k Listens</option>
                    <option value="culture-lead">Culture Lead — $3,999 (20,000 Credits) · 300k Fans</option>
                    <option value="titan">Titan — $9,999+ (50,000 Credits) · 1M+ Reach</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Audio Spot Length</label>
                  <select
                    value={formData.spot_duration_seconds}
                    onChange={e => setFormData({ ...formData, spot_duration_seconds: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                  >
                    <option value={15}>15-Second Audio Spot</option>
                    <option value={30}>30-Second Audio Spot</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Audio Asset URL (.mp3 / .wav) or Production Request</label>
                <input
                  type="text"
                  placeholder="https://assets.yourbrand.com/audio_spot_30s.mp3 (or leave blank for studio production)"
                  value={formData.audio_asset_url}
                  onChange={e => setFormData({ ...formData, audio_asset_url: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Target Geographic Territories</label>
                  <input
                    type="text"
                    value={formData.target_regions}
                    onChange={e => setFormData({ ...formData, target_regions: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Target Subcultures / Genres</label>
                  <input
                    type="text"
                    value={formData.target_genres}
                    onChange={e => setFormData({ ...formData, target_genres: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>Billing / Settlement Method</label>
                <select
                  value={formData.payment_method}
                  onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                >
                  <option value="credits">Deduct from Intermaven TM Credits Balance</option>
                  <option value="invoice">Corporate Invoice &amp; Direct Wire Transfer</option>
                  <option value="stripe">Corporate Credit Card (Stripe)</option>
                  <option value="pesapal">M-Pesa STK Push / PesaPal (East Africa)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                {submitting ? 'Submitting Ad Flight…' : 'Submit & Activate Ad Campaign'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
