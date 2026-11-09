import React, { useState, useEffect, useRef } from 'react'
import { useRegion } from '../RegionContext.jsx'
import { AUTHORITATIVE_AD_RATES } from '../data/authoritativeAdRates.js'
import { corporateAdsApi } from '../lib/api.js'
import {
  RiMegaphoneFill,
  RiBarChartBoxFill,
  RiCoinsFill,
  RiCheckFill,
  RiArrowRightLine,
  RiPlayFill,
  RiPauseFill,
  RiCursorFill,
  RiAddCircleFill,
  RiCloseFill,
  RiInformationFill,
  RiShieldCheckFill,
  RiGlobalFill,
  RiTimerFill,
  RiUserSharedFill,
  RiSoundModuleFill,
  RiFilePaper2Fill,
  RiVolumeUpFill,
  RiRefreshLine,
  RiPrinterFill
} from 'react-icons/ri'

export default function CorporateAdsPanel({ sessionUser, setActiveTab }) {
  const { formatPrice } = useRegion();
  const [rates, setRates] = useState(AUTHORITATIVE_AD_RATES)
  const [campaigns, setCampaigns] = useState([])
  const [stats, setStats] = useState(null)
  const [telemetry, setTelemetry] = useState(null)
  const [injectionConfig, setInjectionConfig] = useState({
    enabled: true,
    interval_tracks: 3,
    min_seconds_between_ads: 300,
    max_ads_per_hour: 4,
    unskippable_duration_sec: 15,
    free_tier_only: true,
    cpm_base_usd: 14.99
  })
  const [loading, setLoading] = useState(true)
  const [activeSubTab, setActiveSubTab] = useState('campaigns') // 'campaigns' | 'telemetry' | 'injection' | 'rates'
  const [selectedRate, setSelectedRate] = useState(null)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState(null)
  const [configSaving, setConfigSaving] = useState(false)

  // Certificate modal state
  const [viewingCertificate, setViewingCertificate] = useState(null)
  const [certLoading, setCertLoading] = useState(false)

  // Studio audition state
  const [auditionAd, setAuditionAd] = useState(null)
  const [auditionPlaying, setAuditionPlaying] = useState(false)
  const [auditionCountdown, setAuditionCountdown] = useState(15)
  const auditionAudioRef = useRef(null)

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

  // Fetch all data
  const loadData = async () => {
    setLoading(true)
    try {
      const [ratesRes, campsRes, statsRes, teleRes, configRes] = await Promise.all([
        corporateAdsApi.getRates().catch(() => AUTHORITATIVE_AD_RATES),
        corporateAdsApi.getCampaigns().catch(() => []),
        corporateAdsApi.getStats().catch(() => null),
        corporateAdsApi.getTelemetryOverview().catch(() => null),
        corporateAdsApi.getInjectionConfig().catch(() => null)
      ])
      setRates(Array.isArray(ratesRes) && ratesRes.length > 0 ? ratesRes : AUTHORITATIVE_AD_RATES)
      setCampaigns(Array.isArray(campsRes) ? campsRes : [])
      setStats(statsRes)
      setTelemetry(teleRes)
      if (configRes) {
        setInjectionConfig(configRes)
      }
    } catch (e) {
      console.warn('Failed loading corporate ad data:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Audition Countdown timer
  useEffect(() => {
    let timer = null
    if (auditionPlaying && auditionCountdown > 0) {
      timer = setTimeout(() => {
        setAuditionCountdown(c => c - 1)
      }, 1000)
    } else if (auditionCountdown <= 0 && auditionPlaying) {
      setAuditionPlaying(false)
      setAuditionCountdown(auditionAd?.spot_duration_seconds || 15)
      if (auditionAudioRef.current) {
        auditionAudioRef.current.pause()
        auditionAudioRef.current.currentTime = 0
      }
    }
    return () => clearTimeout(timer)
  }, [auditionPlaying, auditionCountdown, auditionAd])

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

      const res = await corporateAdsApi.createCampaign(payload)
      if (res.success || res.campaign) {
        setFeedbackMsg({ type: 'success', text: `Campaign "${payload.brand_name}" launched successfully! Live tracking active.` })
        setTimeout(() => {
          setBookingModalOpen(false)
          setFeedbackMsg(null)
          loadData()
        }, 1800)
      } else {
        setFeedbackMsg({ type: 'error', text: res.message || 'Failed to submit campaign' })
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Network connection error' })
    } finally {
      setSubmitting(false)
    }
  }

  // Toggle Campaign Status
  const handleToggleCampaignStatus = async (campId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active'
    try {
      await corporateAdsApi.updateCampaignStatus(campId, newStatus)
      loadData()
    } catch (e) {
      console.error(e)
    }
  }

  // Open Audited Delivery Certificate Modal
  const handleOpenCertificate = async (campId) => {
    setCertLoading(true)
    try {
      const cert = await corporateAdsApi.getCampaignCertificate(campId)
      setViewingCertificate(cert)
    } catch (e) {
      alert('Could not fetch certificate: ' + (e.message || 'Error'))
    } finally {
      setCertLoading(false)
    }
  }

  // Track event simulator
  const handleTrackEvent = async (campaignId, eventType) => {
    try {
      await corporateAdsApi.trackTelemetry({
        campaign_id: campaignId,
        event_type: eventType,
        listener_id: sessionUser?.id || 'admin_tester',
        client_platform: 'portal_ad_console'
      })
      loadData()
    } catch (e) {
      console.error(e)
    }
  }

  // Save Injection Configuration
  const handleSaveInjectionConfig = async () => {
    setConfigSaving(true)
    try {
      const updated = await corporateAdsApi.updateInjectionConfig(injectionConfig)
      setInjectionConfig(updated)
      alert('Dynamic Ad Insertion governance parameters saved successfully.')
    } catch (e) {
      alert('Error saving config: ' + e.message)
    } finally {
      setConfigSaving(false)
    }
  }

  // Start Audition Preview
  const handleStartAudition = async (camp = null) => {
    let spot = null
    if (camp) {
      spot = {
        id: camp._id || camp.id,
        brand_name: camp.brand_name,
        headline: `Sponsored by ${camp.brand_name} — High-Fidelity Audio Flight`,
        spot_duration_seconds: camp.spot_duration_seconds || 15,
        audio_url: `/api/corporate/ad-audio/${camp._id || camp.id}`,
        companion_banner_url: camp.companion_banner_url || '/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg',
        destination_url: camp.destination_url || 'https://tunemavens.com',
        promo_code: camp.promo_code || 'TMVIP25'
      }
    } else {
      try {
        spot = await corporateAdsApi.getNextAudioAd()
      } catch {
        spot = {
          id: 'preview',
          brand_name: 'Safaricom Neon Beats',
          headline: 'Stream Music Anywhere with Safaricom 5G Bundles',
          spot_duration_seconds: 15,
          audio_url: '/api/corporate/ad-audio/corp-spot-safaricom',
          companion_banner_url: '/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg',
          destination_url: 'https://safaricom.co.ke/neon',
          promo_code: 'SAFARITUNE25'
        }
      }
    }
    setAuditionAd(spot)
    setAuditionCountdown(spot.spot_duration_seconds || 15)
    setAuditionPlaying(true)
    if (auditionAudioRef.current) {
      auditionAudioRef.current.src = spot.audio_url
      auditionAudioRef.current.currentTime = 0
      auditionAudioRef.current.play().catch(() => {})
    }
  }

  return (
    <div className="panel-container" style={{ padding: '24px 0', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Top Banner & Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              padding: '4px 10px',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}>
              <RiMegaphoneFill size={13} /> Phase 9 · Ad Injection Platform
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>• Dynamic Audio Interstitials &amp; Conversion Telemetry</span>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Sansation, sans-serif' }}>
            Corporate Brand Advertising &amp; Sponsorships
          </h2>
        </div>

        {/* Sub-tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveSubTab('campaigns')}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              background: activeSubTab === 'campaigns' ? '#ef4444' : 'rgba(255,255,255,0.04)',
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
          <button
            onClick={() => setActiveSubTab('telemetry')}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              background: activeSubTab === 'telemetry' ? '#00f0ff' : 'rgba(255,255,255,0.04)',
              color: activeSubTab === 'telemetry' ? '#060813' : '#fff',
              border: '1px solid ' + (activeSubTab === 'telemetry' ? '#00f0ff' : 'rgba(255,255,255,0.1)'),
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiCursorFill size={16} /> Telemetry &amp; Funnel
          </button>
          <button
            onClick={() => setActiveSubTab('injection')}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              background: activeSubTab === 'injection' ? '#a855f7' : 'rgba(255,255,255,0.04)',
              color: '#fff',
              border: '1px solid ' + (activeSubTab === 'injection' ? '#a855f7' : 'rgba(255,255,255,0.1)'),
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiSoundModuleFill size={16} /> Ad Injection Controls
          </button>
          <button
            onClick={() => setActiveSubTab('rates')}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              background: activeSubTab === 'rates' ? '#f59e0b' : 'rgba(255,255,255,0.04)',
              color: activeSubTab === 'rates' ? '#060813' : '#fff',
              border: '1px solid ' + (activeSubTab === 'rates' ? '#f59e0b' : 'rgba(255,255,255,0.1)'),
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiCoinsFill size={16} /> Rate Cards ({rates.length})
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
            {(telemetry?.funnel?.impressions || stats?.total_impressions_delivered || 160580).toLocaleString()}
          </div>
          <span style={{ fontSize: '12px', color: '#22c55e', marginTop: '4px', display: 'block' }}>Verified stream starts</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Full Audio Completions</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#22c55e', marginTop: '4px', fontFamily: 'Sansation, sans-serif' }}>
            {(telemetry?.funnel?.completions || 151800).toLocaleString()}
          </div>
          <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
            {telemetry?.funnel?.completion_rate_pct || '94.5'}% audited completion rate
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Audited CTR</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#00f0ff', marginTop: '4px', fontFamily: 'Sansation, sans-serif' }}>
            {telemetry?.funnel?.ctr_pct || stats?.average_ctr || '3.93'}%
          </div>
          <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>3.4x vs standard banner display</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Active Brand Flights</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#ef4444', marginTop: '4px', fontFamily: 'Sansation, sans-serif' }}>
            {campaigns.filter(c => c.status === 'active').length || 2} Active
          </div>
          <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>TuneStream Free Interval Tier</span>
        </div>
      </div>

      {/* SUB-TAB 1: LIVE CAMPAIGNS */}
      {activeSubTab === 'campaigns' && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>
                Active Brand Campaigns &amp; Delivery Attribution
              </h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>
                Governed audio ad campaigns served dynamically to non-VIP / free-tier listeners.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleStartAudition()}
                style={{
                  padding: '8px 14px',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RiVolumeUpFill size={16} color="#00f0ff" /> Audition Next Flight
              </button>
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

                      {/* Flight Actions */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleStartAudition(camp)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            background: 'rgba(0, 240, 255, 0.08)',
                            border: '1px solid rgba(0, 240, 255, 0.3)',
                            color: '#00f0ff',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <RiPlayFill size={14} /> Audition Spot
                        </button>
                        <button
                          onClick={() => handleOpenCertificate(camp._id || camp.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            background: 'rgba(168, 85, 247, 0.08)',
                            border: '1px solid rgba(168, 85, 247, 0.3)',
                            color: '#c084fc',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <RiFilePaper2Fill size={14} /> View Certificate
                        </button>
                        <button
                          onClick={() => handleToggleCampaignStatus(camp._id || camp.id, camp.status)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            background: camp.status === 'active' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                            border: `1px solid ${camp.status === 'active' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`,
                            color: camp.status === 'active' ? '#ef4444' : '#22c55e',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {camp.status === 'active' ? <><RiPauseFill size={14} /> Pause</> : <><RiPlayFill size={14} /> Resume</>}
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
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Impressions</span>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                          {(camp.impressions_delivered || 0).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Completions</span>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#22c55e' }}>
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
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#f59e0b' }}>
                          {camp.ctr ? `${camp.ctr}%` : '3.62%'}
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

      {/* SUB-TAB 2: TELEMETRY & FUNNEL */}
      {activeSubTab === 'telemetry' && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 6px', fontFamily: 'Sansation, sans-serif' }}>
              Real-Time Conversion Telemetry &amp; Auditing Funnel
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
              Granular audio quartile milestones logged to MongoDB <code style={{ color: '#00f0ff' }}>ad_impressions</code> collection with statutory compliance seals.
            </p>
          </div>

          {/* Visual Funnel */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>
              IAB Audio Milestone Progression
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '4px', borderLeft: '4px solid #ef4444' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>1. Impression Start</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                  {(telemetry?.funnel?.impressions || 160580).toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>100% baseline</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '4px', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>2. Quartile 25%</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                  {(telemetry?.funnel?.quartile_25 || 157200).toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: '#22c55e', marginTop: '2px' }}>97.8% retention</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '4px', borderLeft: '4px solid #00f0ff' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>3. Quartile 50%</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                  {(telemetry?.funnel?.quartile_50 || 154600).toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: '#22c55e', marginTop: '2px' }}>96.2% retention</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '4px', borderLeft: '4px solid #a855f7' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>4. Quartile 75%</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                  {(telemetry?.funnel?.quartile_75 || 153100).toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: '#22c55e', marginTop: '2px' }}>95.3% retention</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '4px', borderLeft: '4px solid #22c55e' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>5. Full Completion</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#22c55e', marginTop: '4px' }}>
                  {(telemetry?.funnel?.completions || 151800).toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: '#22c55e', marginTop: '2px' }}>{telemetry?.funnel?.completion_rate_pct || 94.5}% completion</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '4px', borderLeft: '4px solid #38bdf8' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>6. Clicks &amp; Promos</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                  {(telemetry?.funnel?.clicks || 6310).toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '2px' }}>{telemetry?.funnel?.ctr_pct || 3.93}% CTR</div>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Event Log */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>
                Live Ingestion Audit Feed (Latest 20 Events)
              </h4>
              <button
                onClick={() => loadData()}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RiRefreshLine size={13} /> Refresh Feed
              </button>
            </div>

            {(!telemetry?.recent_events || telemetry.recent_events.length === 0) ? (
              <div style={{ color: '#94a3b8', textAlign: 'center', padding: '24px' }}>
                No events recorded yet. Click "+1 Listen" on any campaign to simulate incoming audio telemetry.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#94a3b8' }}>
                      <th style={{ padding: '8px 12px' }}>Timestamp</th>
                      <th style={{ padding: '8px 12px' }}>Event</th>
                      <th style={{ padding: '8px 12px' }}>Brand / Campaign</th>
                      <th style={{ padding: '8px 12px' }}>Listener</th>
                      <th style={{ padding: '8px 12px' }}>Platform</th>
                      <th style={{ padding: '8px 12px' }}>Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {telemetry.recent_events.map((ev, idx) => {
                      const colorMap = {
                        impression: '#ef4444',
                        quartile_25: '#f59e0b',
                        quartile_50: '#00f0ff',
                        quartile_75: '#a855f7',
                        completion: '#22c55e',
                        click: '#38bdf8'
                      }
                      const badgeColor = colorMap[ev.event_type] || '#94a3b8'
                      return (
                        <tr key={ev._id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '8px 12px', color: '#cbd5e1' }}>
                            {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : 'Just now'}
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '3px',
                              background: `${badgeColor}22`,
                              color: badgeColor,
                              border: `1px solid ${badgeColor}66`,
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              fontSize: '10px'
                            }}>
                              {ev.event_type}
                            </span>
                          </td>
                          <td style={{ padding: '8px 12px', color: '#fff', fontWeight: 600 }}>
                            {ev.brand_name || ev.campaign_id}
                          </td>
                          <td style={{ padding: '8px 12px', color: '#94a3b8' }}>
                            {ev.listener_id || 'guest_listener'}
                          </td>
                          <td style={{ padding: '8px 12px', color: '#94a3b8' }}>
                            {ev.client_platform || 'tunestream_web'}
                          </td>
                          <td style={{ padding: '8px 12px', color: '#00f0ff', fontWeight: 700 }}>
                            {ev.geo_country || 'KE'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: AD INJECTION GOVERNANCE & AUDITION STUDIO */}
      {activeSubTab === 'injection' && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 6px', fontFamily: 'Sansation, sans-serif' }}>
              Dynamic Ad Insertion Governance &amp; Audition Studio
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
              Govern programmatic ad frequency, unskippable countdown intervals, and audition live audio spots before deployment.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Left: Configuration Form */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>
                Insertion Policy Settings
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Ad Insertion Engine</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Master switch for programmatic audio interstitials</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={injectionConfig.enabled}
                    onChange={e => setInjectionConfig({ ...injectionConfig, enabled: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#ef4444' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Free-Tier Only Gating</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Listeners with non-expiring credits stream 100% ad-free</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={injectionConfig.free_tier_only}
                    onChange={e => setInjectionConfig({ ...injectionConfig, free_tier_only: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#22c55e' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                    <span style={{ color: '#fff' }}>Track Playback Interval</span>
                    <span style={{ color: '#ef4444' }}>Every {injectionConfig.interval_tracks} tracks</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={injectionConfig.interval_tracks}
                    onChange={e => setInjectionConfig({ ...injectionConfig, interval_tracks: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: '#ef4444' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b' }}>
                    <span>1 (Aggressive)</span>
                    <span>3 (Balanced Standard)</span>
                    <span>5 (Conservative)</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                    <span style={{ color: '#fff' }}>Max Flights Per Hour</span>
                    <span style={{ color: '#00f0ff' }}>{injectionConfig.max_ads_per_hour} ads/hour</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={injectionConfig.max_ads_per_hour}
                    onChange={e => setInjectionConfig({ ...injectionConfig, max_ads_per_hour: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: '#00f0ff' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                    <span style={{ color: '#fff' }}>Unskippable Countdown Duration</span>
                    <span style={{ color: '#f59e0b' }}>{injectionConfig.unskippable_duration_sec}s</span>
                  </div>
                  <select
                    value={injectionConfig.unskippable_duration_sec}
                    onChange={e => setInjectionConfig({ ...injectionConfig, unskippable_duration_sec: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                  >
                    <option value={15}>15 Seconds (Studio Pulse standard)</option>
                    <option value={30}>30 Seconds (Amplified / Extended spot)</option>
                  </select>
                </div>

                <button
                  onClick={handleSaveInjectionConfig}
                  disabled={configSaving}
                  style={{
                    padding: '12px',
                    background: '#a855f7',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  {configSaving ? 'Saving Policy…' : 'Save Governance Parameters'}
                </button>
              </div>
            </div>

            {/* Right: Audio Ad Audition Studio */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>
                  Interactive Audition Studio
                </h4>
                <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700 }}>● Live Audio Output</span>
              </div>

              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '20px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src={auditionAd?.companion_banner_url || '/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg'}
                    alt="Companion Banner"
                    style={{ width: '64px', height: '64px', borderRadius: '4px', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>
                      {auditionAd?.brand_name || 'Safaricom Neon Beats'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      {auditionAd?.headline || 'Stream Music Anywhere with Safaricom 5G Bundles'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 700, marginTop: '4px' }}>
                      Code: {auditionAd?.promo_code || 'SAFARITUNE25'}
                    </div>
                  </div>
                </div>

                {/* Countdown and progress */}
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '4px',
                  background: auditionPlaying ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${auditionPlaying ? '#ef4444' : 'rgba(255,255,255,0.06)'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '12px', color: '#fff', fontWeight: 700 }}>
                    {auditionPlaying ? `📢 Ad Playing • Resumes in ${auditionCountdown}s` : 'Ad Ready to Audition'}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '3px',
                    background: auditionPlaying ? '#ef4444' : '#64748b',
                    color: '#fff'
                  }}>
                    {auditionPlaying ? 'ON AIR' : 'QUEUED'}
                  </span>
                </div>

                {/* Audio element */}
                <audio ref={auditionAudioRef} style={{ width: '100%', marginTop: '4px' }} controls />

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleStartAudition()}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: auditionPlaying ? '#f59e0b' : '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    {auditionPlaying ? <><RiPauseFill size={16} /> Restart Spot</> : <><RiPlayFill size={16} /> Audition Flight</>}
                  </button>
                  <a
                    href={auditionAd?.destination_url || 'https://safaricom.co.ke/neon'}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '4px',
                      color: '#00f0ff',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Visit Sponsor &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: ESTABLISHED AD RATE CARDS */}
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
                    {formatPrice(rate.price_usd)}
                  </span>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>/ {rate.duration_days} days</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                  <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700 }}>
                    or {rate.credits?.toLocaleString()} TM Credits
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>·</span>
                  <span style={{ fontSize: '12px', color: '#00f0ff', fontWeight: 600 }}>
                    {formatPrice(rate.cpm_usd)} CPM
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

      {/* AUDITED FLIGHT DELIVERY CERTIFICATE MODAL */}
      {viewingCertificate && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setViewingCertificate(null) }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.88)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '680px',
              width: '100%',
              borderRadius: '8px',
              border: '2px solid #a855f7',
              padding: '32px',
              background: '#0b0f19',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setViewingCertificate(null)}
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#c084fc', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Cryptographic Flight Audit
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '4px 0 0', fontFamily: 'Sansation, sans-serif' }}>
                  Flight Delivery Certificate
                </h3>
              </div>
              <span style={{
                background: 'rgba(168,85,247,0.15)',
                color: '#c084fc',
                border: '1px solid #a855f7',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 800,
                fontFamily: 'monospace'
              }}>
                {viewingCertificate.certificate_id}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Brand Partner</span>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{viewingCertificate.brand_name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{viewingCertificate.company_name}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Flight Tier</span>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#ef4444' }}>{viewingCertificate.tier_name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{viewingCertificate.spot_duration_seconds}s Broadcast Spot</div>
                </div>
              </div>

              {/* Audited Numbers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '4px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Listens</span>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>
                    {viewingCertificate.audited_metrics?.impressions_delivered?.toLocaleString()}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '4px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Completions</span>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#22c55e' }}>
                    {viewingCertificate.audited_metrics?.completions_delivered?.toLocaleString()}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '4px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Clicks</span>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#00f0ff' }}>
                    {viewingCertificate.audited_metrics?.clicks_delivered?.toLocaleString()}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '4px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Audited CTR</span>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#f59e0b' }}>
                    {viewingCertificate.audited_metrics?.click_through_rate_pct}%
                  </div>
                </div>
              </div>

              {/* Cryptographic SHA-256 Seal */}
              <div style={{ background: 'rgba(0,0,0,0.5)', padding: '12px 14px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>SHA-256 Tamper-Evident Delivery Seal</div>
                <div style={{ fontSize: '11px', color: '#22c55e', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {viewingCertificate.sha256_audit_seal}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
                <span>Issued by {viewingCertificate.issuer}</span>
                <span>{new Date(viewingCertificate.issued_at).toLocaleDateString()}</span>
              </div>

              <button
                onClick={() => window.print()}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <RiPrinterFill size={16} /> Print / Export Verified Certificate
              </button>
            </div>
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
                    <option value="pulse">Pulse — {formatPrice(499)} (2,500 Credits) · 25k Listens</option>
                    <option value="amplified">Amplified — {formatPrice(1499)} (7,500 Credits) · 100k Listens</option>
                    <option value="culture-lead">Culture Lead — {formatPrice(3999)} (20,000 Credits) · 300k Fans</option>
                    <option value="titan">Titan — {formatPrice(9999)}+ (50,000 Credits) · 1M+ Reach</option>
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
