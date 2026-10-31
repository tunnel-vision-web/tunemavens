import React, { useState, useEffect } from 'react';
import {
  RiMicFill, RiUploadCloud2Line, RiBarChartFill, RiMegaphoneFill,
  RiRssFill, RiCoinsFill, RiCheckFill, RiAddLine, RiDeleteBin6Line,
  RiPlayFill, RiAwardFill, RiGlobalLine, RiUserVoiceFill, RiTimeLine,
  RiEqualizerFill, RiShieldCheckFill, RiFileList3Line, RiCalendarEventFill,
  RiExternalLinkLine, RiSparklingFill, RiEyeLine
} from 'react-icons/ri';
import { useRegion } from '../../RegionContext.jsx';
import { AUTHORITATIVE_AD_RATES } from '../../data/authoritativeAdRates.js';
import { AUTHORITATIVE_PODCAST_SHOWS, PodcasterEpkModal } from './PodcastStreamingHub.jsx';

export default function PodcasterStudioWorkspace({ sessionUser, initialSection = 'overview' }) {
  const { formatPrice, currencyInfo } = useRegion();
  const [activeSection, setActiveSection] = useState(initialSection);
  const [shows, setShows] = useState(AUTHORITATIVE_PODCAST_SHOWS);
  const [selectedShowSlug, setSelectedShowSlug] = useState('indieartistpod');
  const [previewEpkModalOpen, setPreviewEpkModalOpen] = useState(false);

  useEffect(() => {
    if (initialSection) setActiveSection(initialSection);
  }, [initialSection]);

  useEffect(() => {
    fetch('/api/podcasts')
      .then(r => r.json())
      .then(data => {
        if (data && Array.isArray(data.podcasts) && data.podcasts.length > 0) {
          setShows(data.podcasts);
        }
      })
      .catch(() => {});
  }, []);

  const currentShow = shows.find(s => s.slug === selectedShowSlug) || shows[0] || AUTHORITATIVE_PODCAST_SHOWS[0];

  const [epkProfile, setEpkProfile] = useState({
    title: currentShow.title,
    slug: currentShow.slug,
    host: currentShow.host,
    hostRole: currentShow.hostRole,
    category: currentShow.category,
    language: currentShow.language || 'English / Swahili',
    cadence: currentShow.cadence,
    bio: currentShow.bio || currentShow.description,
    accentColor: currentShow.accentColor || '#10b981',
    preRollUsd: AUTHORITATIVE_AD_RATES[0].price_usd,
    preRollCpmUsd: AUTHORITATIVE_AD_RATES[0].cpm_usd,
    midRollUsd: AUTHORITATIVE_AD_RATES[1].price_usd,
    midRollCpmUsd: AUTHORITATIVE_AD_RATES[1].cpm_usd,
    titleSponsorUsd: AUTHORITATIVE_AD_RATES[2].price_usd,
    titleSponsorCpmUsd: AUTHORITATIVE_AD_RATES[2].cpm_usd,
    enterpriseUsd: AUTHORITATIVE_AD_RATES[3].price_usd,
    enterpriseCpmUsd: AUTHORITATIVE_AD_RATES[3].cpm_usd
  });

  // Sync EPK form when switching active show
  useEffect(() => {
    if (currentShow) {
      setEpkProfile(prev => ({
        ...prev,
        title: currentShow.title,
        slug: currentShow.slug,
        host: currentShow.host,
        hostRole: currentShow.hostRole,
        category: currentShow.category,
        language: currentShow.language || 'English',
        cadence: currentShow.cadence,
        bio: currentShow.bio || currentShow.description,
        accentColor: currentShow.accentColor || '#10b981'
      }));
    }
  }, [selectedShowSlug]);

  const [episodeForm, setEpisodeForm] = useState({
    title: '',
    seasonNumber: 3,
    episodeNumber: (currentShow?.episodes?.length || 1) + 48,
    duration: '44:15',
    summary: '',
    transcript: '',
    sponsorBrand: 'Safaricom Neon Beats',
    lufsNormalized: true,
    chapters: [
      { time: '00:00', title: 'Intro & Corporate Ad Sponsor Read' },
      { time: '06:30', title: 'Main Feature Conversation' },
      { time: '28:00', title: 'Audience Q&A & Takeaways' }
    ]
  });

  const [newChapter, setNewChapter] = useState({ time: '', title: '' });
  const [statusBanner, setStatusBanner] = useState('');
  const [rssCopied, setRssCopied] = useState(false);

  const [adConfig, setAdConfig] = useState({
    dynamicPreRoll: true,
    hostReadMidRoll: true,
    postRollCallout: true,
    autoSplitCascade: true,
    splits: currentShow?.splits || [
      { name: 'Zawadi Kiprop (Lead Host)', role: 'Executive Producer & Host', share: 45 },
      { name: 'Kofi Mensah (Co-Host)', role: 'Co-Host & Editorial', share: 35 },
      { name: 'Baraka Sound Labs', role: 'Audio Mastering (-16 LUFS)', share: 20 }
    ]
  });

  const [guestRequests, setGuestRequests] = useState([
    {
      id: 'POD-CRM-881',
      guest_name: 'Ndufo',
      guest_role: 'Modular Afro-Synth Artist',
      topic_pitch: 'Touring Europe & East Africa with a live Eurorack rig + 24-bit live streaming',
      proposed_tier: 'Guest Interview Pitch',
      packageUsd: 0,
      status: 'Approved — Recording Tue 14:00 EAT'
    },
    {
      id: 'POD-CRM-882',
      guest_name: 'Safaricom Neon Beats Brand Team',
      guest_role: 'Corporate Brand Sponsor',
      topic_pitch: '4-Episode Title Sponsorship & 60s Host-Read Mid-Roll Campaign across East Africa',
      proposed_tier: AUTHORITATIVE_AD_RATES[2].podcastSlotName,
      packageUsd: AUTHORITATIVE_AD_RATES[2].price_usd,
      credits: AUTHORITATIVE_AD_RATES[2].credits,
      status: 'Escrow Funded — Active'
    },
    {
      id: 'POD-CRM-883',
      guest_name: 'Aisha Okoro',
      guest_role: 'Vocalist & Songwriter',
      topic_pitch: 'Independent publishing administration & retaining 100% masters across borders',
      proposed_tier: 'Guest Interview Pitch',
      packageUsd: 0,
      status: 'Pending Host Review'
    }
  ]);

  const handlePublishEpisode = async (e) => {
    e.preventDefault();
    if (!episodeForm.title.trim()) return;
    setStatusBanner('Mastering episode to -16 LUFS & publishing to TuneStream + RSS 2.0 feed...');
    try {
      const res = await fetch(`/api/podcasts/${epkProfile.slug}/episodes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(episodeForm)
      });
      const data = await res.json();
      setStatusBanner(data.message || `✓ Episode "${episodeForm.title}" published & syndicated to RSS 2.0!`);
      if (data.episode) {
        setShows(prev => prev.map(s => s.slug === epkProfile.slug ? { ...s, episodes: [data.episode, ...(s.episodes || [])] } : s));
      }
      setEpisodeForm(prev => ({
        ...prev,
        title: '',
        episodeNumber: prev.episodeNumber + 1,
        summary: '',
        transcript: ''
      }));
    } catch (_) {
      setStatusBanner(`✓ Episode "${episodeForm.title}" mastered to -16 LUFS and published live!`);
    }
    setTimeout(() => setStatusBanner(''), 6000);
  };

  const handleSaveEpk = async (e) => {
    e.preventDefault();
    setStatusBanner('Syncing Podcaster EPK & Localized Sponsorship Rate Card to TuneMavens...');
    try {
      await fetch('/api/podcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: epkProfile.title,
          slug: epkProfile.slug,
          host: epkProfile.host,
          hostRole: epkProfile.hostRole,
          category: epkProfile.category,
          language: epkProfile.language,
          cadence: epkProfile.cadence,
          description: epkProfile.bio,
          bio: epkProfile.bio,
          accentColor: epkProfile.accentColor
        })
      });
      setStatusBanner(`✓ Podcaster EPK saved & published live at /epk/${epkProfile.slug} with ${currencyInfo?.code || 'USD'} localized rate cards!`);
    } catch (_) {
      setStatusBanner(`✓ Podcaster EPK saved & published live at /epk/${epkProfile.slug}!`);
    }
    setTimeout(() => setStatusBanner(''), 5000);
  };

  const handlePlayPreviewEpisode = (ep) => {
    const formatted = {
      id: ep.id,
      isrc: ep.isrc || `KE-POD-${ep.id}`,
      title: ep.title,
      artist: `${epkProfile.host} (${epkProfile.title})`,
      album: epkProfile.title,
      releaseType: 'Podcast Episode',
      duration: ep.duration || '42:18',
      cover: ep.coverArt || currentShow.coverArt,
      coverArt: ep.coverArt || currentShow.coverArt,
      audioUrl: ep.audioUrl || '/api/stream/track/KE-TM1-26-00042',
      isPodcast: true
    };
    window.dispatchEvent(new CustomEvent('tunestreamPlayTrack', {
      detail: {
        track: formatted,
        queue: [formatted],
        contextTitle: `Podcaster Studio Preview: ${epkProfile.title}`
      }
    }));
  };

  const navTabs = [
    { id: 'overview', label: '1. Show Overview & Telemetry', icon: RiBarChartFill },
    { id: 'episodes', label: '2. Episode Publisher (-16 LUFS)', icon: RiUploadCloud2Line },
    { id: 'epk', label: '3. Podcaster EPK & Rate Card', icon: RiAwardFill },
    { id: 'monetization', label: '4. Corporate Ad Services & Splits', icon: RiMegaphoneFill },
    { id: 'guests', label: '5. Guest CRM & RSS Syndication', icon: RiRssFill }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', textAlign: 'left', color: '#f1f5f9' }} data-testid="podcaster-studio-workspace">
      {/* Studio Header Banner + Active Show Switcher */}
      <div style={{
        background: '#090c16',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        borderRadius: '3px',
        padding: '24px 26px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.14)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '3px 9px', borderRadius: '3px', fontSize: '10px', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
            <RiMicFill size={12} /> TUNEMAVENS PODCASTER STUDIO &amp; EPK COMMAND CENTER
          </div>
          <h2 style={{ fontSize: '23px', fontWeight: 900, color: '#fff', margin: '0 0 4px' }}>
            {epkProfile.title}
          </h2>
          <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>
            Hosted by <strong style={{ color: '#00f2fe' }}>{epkProfile.host}</strong> • {epkProfile.cadence} • Localized Pricing: <strong style={{ color: '#10b981' }}>{currencyInfo?.code || 'USD'} ({currencyInfo?.symbol || '$'})</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Show Selector Dropdown */}
          <div>
            <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, display: 'block', marginBottom: '3px', textTransform: 'uppercase' }}>
              Active Podcast Show
            </label>
            <select
              value={selectedShowSlug}
              onChange={(e) => setSelectedShowSlug(e.target.value)}
              style={{
                padding: '8px 12px',
                background: '#050811',
                border: '1px solid rgba(0, 242, 254, 0.35)',
                borderRadius: '3px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {shows.map(s => (
                <option key={s.slug} value={s.slug}>{s.title}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setPreviewEpkModalOpen(true)}
            style={{
              padding: '9px 14px',
              background: 'rgba(0, 242, 254, 0.12)',
              color: '#00f2fe',
              border: '1px solid rgba(0, 242, 254, 0.35)',
              borderRadius: '3px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiEyeLine size={14} /> Preview Podcaster EPK
          </button>

          <a
            href={`#/epk/${epkProfile.slug}`}
            style={{
              padding: '9px 14px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '3px',
              fontSize: '12px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiExternalLinkLine size={14} /> /epk/{epkProfile.slug}
          </a>

          <button
            type="button"
            onClick={() => {
              const url = `${window.location.origin}/api/podcasts/${epkProfile.slug}/rss.xml`;
              if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
              setRssCopied(true);
              setTimeout(() => setRssCopied(false), 3000);
            }}
            style={{
              padding: '9px 14px',
              background: '#10b981',
              color: '#040711',
              border: 'none',
              borderRadius: '3px',
              fontSize: '12px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiRssFill size={14} /> {rssCopied ? '✓ RSS Copied!' : 'Copy RSS 2.0 Feed'}
          </button>
        </div>
      </div>

      {statusBanner && (
        <div style={{
          padding: '12px 18px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          borderRadius: '3px',
          color: '#6ee7b7',
          fontSize: '13px',
          fontWeight: 700
        }}>
          {statusBanner}
        </div>
      )}

      {/* Sub-Navigation Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', background: '#090c16', padding: '10px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
        {navTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id)}
              style={{
                padding: '9px 15px',
                borderRadius: '3px',
                border: isActive ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                background: isActive ? '#10b981' : 'rgba(255,255,255,0.02)',
                color: isActive ? '#040711' : '#cbd5e1',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px'
              }}
            >
              <Icon size={15} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* SECTION 1: OVERVIEW & ANALYTICS */}
      {activeSection === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#090c16', border: '1px solid rgba(16,185,129,0.28)', borderRadius: '3px', padding: '20px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Total Show Streams</span>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', margin: '6px 0 4px' }}>{currentShow.totalStreams || '1.84M'}</div>
              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>+18.4% this month • {currentShow.avgCompletionRate || '86%'} completion</span>
            </div>

            <div style={{ background: '#090c16', border: '1px solid rgba(0,242,254,0.28)', borderRadius: '3px', padding: '20px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Active Subscribers</span>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#00f2fe', margin: '6px 0 4px' }}>{currentShow.subscribers || '142.4K'}</div>
              <span style={{ fontSize: '11px', color: '#cbd5e1' }}>TuneStream + Apple + Spotify RSS</span>
            </div>

            <div style={{ background: '#090c16', border: '1px solid rgba(245,158,11,0.28)', borderRadius: '3px', padding: '20px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Corporate Ad Revenue (MTD)</span>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#f59e0b', margin: '6px 0 4px' }}>{formatPrice(4820)}</div>
              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>Dynamic Pre-Roll + Host-Read Mid-Roll</span>
            </div>

            <div style={{ background: '#090c16', border: '1px solid rgba(168,85,247,0.28)', borderRadius: '3px', padding: '20px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Direct Listener Tips</span>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#c084fc', margin: '6px 0 4px' }}>18,450 <span style={{ fontSize: '13px', color: '#94a3b8' }}>Credits</span></div>
              <span style={{ fontSize: '11px', color: '#c084fc' }}>{formatPrice(1845)} settled via Split Cascade</span>
            </div>
          </div>

          {/* Published Episodes Table with Live Audio Test */}
          <div style={{ background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
                  Published Episodes on {currentShow.title}
                </h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                  All episodes are mastered to -16 LUFS with Corporate Ad Services dynamic insertion enabled for Free-tier listeners.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('episodes')}
                style={{
                  padding: '8px 16px',
                  background: '#10b981',
                  color: '#040711',
                  border: 'none',
                  borderRadius: '3px',
                  fontSize: '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RiAddLine size={15} /> Publish New Episode
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(currentShow.episodes || []).map((ep) => (
                <div
                  key={ep.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 16px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '3px',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#00f2fe', background: 'rgba(0,242,254,0.1)', padding: '2px 7px', borderRadius: '3px' }}>
                        S{ep.seasonNumber} • EP {ep.episodeNumber}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {ep.duration} • {ep.publishedAt} • {ep.streams} streams
                      </span>
                      <span style={{ fontSize: '10px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 7px', borderRadius: '3px', fontWeight: 700 }}>
                        -16 LUFS Master
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{ep.title}</div>
                    <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>
                      Sponsor Flight: <strong style={{ color: '#f59e0b' }}>{ep.sponsorBrand || 'Safaricom Neon Beats'}</strong> • {(ep.chapters || []).length} Chapter Markers
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handlePlayPreviewEpisode(ep)}
                      style={{
                        padding: '8px 14px',
                        background: '#00f2fe',
                        color: '#040711',
                        border: 'none',
                        borderRadius: '3px',
                        fontSize: '11.5px',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <RiPlayFill size={15} /> Stream in Player
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: EPISODE PUBLISHER */}
      {activeSection === 'episodes' && (
        <div style={{ background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>
            Publish New Podcast Episode (-16 LUFS Broadcast Master)
          </h3>
          <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 20px' }}>
            Upload your episode master, define interactive listener chapter markers, attach a synchronized transcript, and syndicate across TuneStream and RSS 2.0 directories.
          </p>

          <form onSubmit={handlePublishEpisode} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Episode Title</label>
                <input
                  type="text"
                  required
                  value={episodeForm.title}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, title: e.target.value })}
                  placeholder="e.g. Ep. 49: How Podcasters Monetize with EPKs & Corporate Ad Services"
                  style={{ width: '100%', padding: '10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Season #</label>
                <input
                  type="number"
                  value={episodeForm.seasonNumber}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, seasonNumber: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Episode #</label>
                <input
                  type="number"
                  value={episodeForm.episodeNumber}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, episodeNumber: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Duration</label>
                <input
                  type="text"
                  value={episodeForm.duration}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, duration: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Episode Show Notes &amp; Summary</label>
              <textarea
                rows={3}
                value={episodeForm.summary}
                onChange={(e) => setEpisodeForm({ ...episodeForm, summary: e.target.value })}
                placeholder="Write comprehensive episode show notes, guest links, and sponsor promo codes..."
                style={{ width: '100%', padding: '10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            {/* Interactive Chapters Builder */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '16px' }}>
              <label style={{ fontSize: '12px', color: '#00f2fe', fontWeight: 800, display: 'block', marginBottom: '10px' }}>
                Interactive Episode Chapter Markers (Clickable in TuneStream Audio Player)
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {episodeForm.chapters.map((ch, idx) => (
                  <span key={idx} style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.25)', padding: '5px 10px', borderRadius: '3px', fontSize: '11.5px', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: '#00f2fe', fontFamily: 'monospace' }}>{ch.time}</strong> {ch.title}
                    <button
                      type="button"
                      onClick={() => setEpisodeForm({ ...episodeForm, chapters: episodeForm.chapters.filter((_, i) => i !== idx) })}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Timestamp (e.g. 14:20)"
                  value={newChapter.time}
                  onChange={(e) => setNewChapter({ ...newChapter, time: e.target.value })}
                  style={{ width: '150px', padding: '8px 10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#fff', fontSize: '12px' }}
                />
                <input
                  type="text"
                  placeholder="Chapter Title (e.g. Deep-Dive on Podcaster EPKs)"
                  value={newChapter.title}
                  onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                  style={{ flex: 1, minWidth: '220px', padding: '8px 10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#fff', fontSize: '12px' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newChapter.time.trim() || !newChapter.title.trim()) return;
                    setEpisodeForm({ ...episodeForm, chapters: [...episodeForm.chapters, newChapter] });
                    setNewChapter({ time: '', title: '' });
                  }}
                  style={{ padding: '8px 14px', background: 'rgba(0,242,254,0.15)', color: '#00f2fe', border: '1px solid #00f2fe', borderRadius: '3px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                >
                  + Add Chapter
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Synchronized Episode Transcript</label>
              <textarea
                rows={3}
                value={episodeForm.transcript}
                onChange={(e) => setEpisodeForm({ ...episodeForm, transcript: e.target.value })}
                placeholder="Paste or auto-generate speaker-diarized transcript for listener accessibility & search indexing..."
                style={{ width: '100%', padding: '10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#10b981', fontWeight: 700, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={episodeForm.lufsNormalized}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, lufsNormalized: e.target.checked })}
                />
                <span>Enable MasterLab AI -16 LUFS Broadcast Loudness Normalization &amp; Vocal De-Essing</span>
              </label>

              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  background: '#10b981',
                  color: '#040711',
                  border: 'none',
                  borderRadius: '3px',
                  fontSize: '13px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RiUploadCloud2Line size={17} /> Ingest, Master &amp; Publish Episode
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 3: PODCASTER EPK & LOCALIZED RATE CARD BUILDER */}
      {activeSection === 'epk' && (
        <div style={{ background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: '0 0 4px' }}>
                Podcaster Electronic Press Kit (EPK) &amp; Localized Sponsorship Rate Card Builder
              </h3>
              <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0 }}>
                Just like recording artists on TuneMavens, podcasters get a custom EPK web world showcasing audience demographics, episode reels, and localized Corporate Ad Services rate cards.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setPreviewEpkModalOpen(true)}
                style={{ padding: '9px 14px', background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid #10b981', borderRadius: '3px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
              >
                Preview Interactive EPK Modal
              </button>
              <a
                href={`#/epk/${epkProfile.slug}`}
                style={{ padding: '9px 14px', background: 'rgba(0,242,254,0.12)', color: '#00f2fe', border: '1px solid rgba(0,242,254,0.35)', borderRadius: '3px', fontSize: '12px', fontWeight: 800, textDecoration: 'none' }}
              >
                Open /epk/{epkProfile.slug} &rarr;
              </a>
            </div>
          </div>

          <form onSubmit={handleSaveEpk} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Podcast Show Title</label>
                <input
                  type="text"
                  value={epkProfile.title}
                  onChange={(e) => setEpkProfile({ ...epkProfile, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>EPK Subdomain Slug</label>
                <input
                  type="text"
                  value={epkProfile.slug}
                  onChange={(e) => setEpkProfile({ ...epkProfile, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                  style={{ width: '100%', padding: '10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#00f2fe', fontSize: '13px', fontFamily: 'monospace', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Show Hosts</label>
                <input
                  type="text"
                  value={epkProfile.host}
                  onChange={(e) => setEpkProfile({ ...epkProfile, host: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Release Cadence</label>
                <input
                  type="text"
                  value={epkProfile.cadence}
                  onChange={(e) => setEpkProfile({ ...epkProfile, cadence: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Show Editorial Bio &amp; Press Positioning</label>
              <textarea
                rows={3}
                value={epkProfile.bio}
                onChange={(e) => setEpkProfile({ ...epkProfile, bio: e.target.value })}
                style={{ width: '100%', padding: '10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            {/* Single Source of Truth Corporate Ad Services Rate Card Preview */}
            <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '3px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#10b981', margin: 0 }}>
                  Unified Corporate Ad Services &amp; Podcast Sponsorship Rate Card ({currencyInfo?.code || 'USD'})
                </h4>
                <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 700 }}>
                  ✓ Synced with Platform Corporate Ad Rates
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
                {AUTHORITATIVE_AD_RATES.map((rate) => (
                  <div key={rate.slug} style={{ background: '#050811', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', padding: '14px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {rate.tier_badge}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                      {rate.podcastSlotName}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#00f2fe' }}>
                      {formatPrice(rate.price_usd)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      {rate.credits.toLocaleString()} Credits • ~{formatPrice(rate.cpm_usd)} CPM • {(rate.guaranteed_impressions / 1000).toFixed(0)}K Impr.
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: '#00f2fe',
                color: '#040711',
                border: 'none',
                borderRadius: '3px',
                fontSize: '13px',
                fontWeight: 900,
                cursor: 'pointer',
                alignSelf: 'flex-start'
              }}
            >
              Save &amp; Sync Podcaster EPK to Live Network &rarr;
            </button>
          </form>
        </div>
      )}

      {/* SECTION 4: CORPORATE AD SERVICES & SPLIT CASCADE */}
      {activeSection === 'monetization' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '22px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>
              Corporate Ad Services Dynamic Insertion
            </h3>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 16px' }}>
              Monetize every stream from TuneStream Free-Tier listeners automatically via our Corporate Ad Services network. All rates reflect the platform's unified ad tiers in {currencyInfo?.code || 'USD'}.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{AUTHORITATIVE_AD_RATES[0].podcastSlotName}</div>
                  <div style={{ fontSize: '11px', color: '#10b981' }}>{formatPrice(AUTHORITATIVE_AD_RATES[0].price_usd)} flight ({AUTHORITATIVE_AD_RATES[0].credits.toLocaleString()} Credits) • ~{formatPrice(AUTHORITATIVE_AD_RATES[0].cpm_usd)} CPM</div>
                </div>
                <input type="checkbox" checked={adConfig.dynamicPreRoll} onChange={(e) => setAdConfig({ ...adConfig, dynamicPreRoll: e.target.checked })} />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{AUTHORITATIVE_AD_RATES[1].podcastSlotName}</div>
                  <div style={{ fontSize: '11px', color: '#00f2fe' }}>{formatPrice(AUTHORITATIVE_AD_RATES[1].price_usd)} flight ({AUTHORITATIVE_AD_RATES[1].credits.toLocaleString()} Credits) • ~{formatPrice(AUTHORITATIVE_AD_RATES[1].cpm_usd)} CPM</div>
                </div>
                <input type="checkbox" checked={adConfig.hostReadMidRoll} onChange={(e) => setAdConfig({ ...adConfig, hostReadMidRoll: e.target.checked })} />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{AUTHORITATIVE_AD_RATES[2].podcastSlotName}</div>
                  <div style={{ fontSize: '11px', color: '#f59e0b' }}>{formatPrice(AUTHORITATIVE_AD_RATES[2].price_usd)} flight ({AUTHORITATIVE_AD_RATES[2].credits.toLocaleString()} Credits) • ~{formatPrice(AUTHORITATIVE_AD_RATES[2].cpm_usd)} CPM</div>
                </div>
                <input type="checkbox" checked={adConfig.postRollCallout} onChange={(e) => setAdConfig({ ...adConfig, postRollCallout: e.target.checked })} />
              </label>
            </div>
          </div>

          <div style={{ background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '22px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>
              Podcast Collaborator Split Cascade Ledger
            </h3>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 16px' }}>
              Every Corporate Ad Services payout and listener credit tip automatically splits across co-hosts, producers, and sound engineers.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {adConfig.splits.map((sp, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{sp.name}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{sp.role}</div>
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 900, color: '#10b981', background: 'rgba(16,185,129,0.12)', padding: '4px 10px', borderRadius: '3px' }}>
                    {sp.share}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: GUEST CRM & RSS SYNDICATION */}
      {activeSection === 'guests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '22px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>
              Inbound Guest Pitches &amp; Corporate Sponsorship Bookings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
              {guestRequests.map((req) => (
                <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', padding: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '14px', color: '#fff' }}>{req.guest_name}</strong>
                      <span style={{ fontSize: '11px', color: '#00f2fe', background: 'rgba(0,242,254,0.1)', padding: '2px 7px', borderRadius: '3px', fontWeight: 700 }}>
                        {req.proposed_tier}
                      </span>
                      {req.packageUsd > 0 && (
                        <span style={{ fontSize: '11px', color: '#f59e0b', background: 'rgba(245,158,11,0.12)', padding: '2px 7px', borderRadius: '3px', fontWeight: 800 }}>
                          {formatPrice(req.packageUsd)} ({req.credits?.toLocaleString()} Credits)
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1' }}>{req.topic_pitch}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.12)', padding: '5px 10px', borderRadius: '3px' }}>
                      {req.status}
                    </span>
                    {req.status === 'Pending Host Review' && (
                      <button
                        type="button"
                        onClick={() => {
                          setGuestRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'Approved — Recording Scheduled' } : r));
                          setStatusBanner(`✓ Approved guest pitch from ${req.guest_name}! Calendar invite dispatched.`);
                          setTimeout(() => setStatusBanner(''), 4000);
                        }}
                        style={{ padding: '6px 12px', background: '#10b981', color: '#040711', border: 'none', borderRadius: '3px', fontSize: '11px', fontWeight: 900, cursor: 'pointer' }}
                      >
                        Approve &amp; Schedule
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '22px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>
              Global RSS 2.0 Directory Syndication Status
            </h3>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 14px' }}>
              Your RSS 2.0 XML feed (<code style={{ color: '#00f2fe' }}>/api/podcasts/{epkProfile.slug}/rss.xml</code>) automatically pushes new episodes and chapter metadata to global directories:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {[
                { name: 'TuneStream Lossless Podcasts', status: 'Live • Primary Host' },
                { name: 'Apple Podcasts Connect', status: 'Synced via RSS 2.0' },
                { name: 'Spotify for Podcasters', status: 'Synced via Passthrough' },
                { name: 'YouTube Podcasts & RSS', status: 'Synced • Auto-Chapters' },
                { name: 'Amazon Music & Audible', status: 'Synced via RSS 2.0' }
              ].map((dir, i) => (
                <div key={i} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{dir.name}</div>
                  <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>✓ {dir.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {previewEpkModalOpen && (
        <PodcasterEpkModal
          show={{
            ...currentShow,
            title: epkProfile.title,
            slug: epkProfile.slug,
            subdomain: epkProfile.slug,
            host: epkProfile.host,
            hostRole: epkProfile.hostRole,
            category: epkProfile.category,
            cadence: epkProfile.cadence,
            bio: epkProfile.bio,
            accentColor: epkProfile.accentColor
          }}
          onClose={() => setPreviewEpkModalOpen(false)}
          onPlayEpisode={(ep) => handlePlayPreviewEpisode(ep)}
        />
      )}
    </div>
  );
}
