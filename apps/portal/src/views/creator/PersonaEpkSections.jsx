import React, { useState } from 'react';
import {
  RiHomeFill,
  RiUserFill,
  RiCalendarEventFill,
  RiVideoFill,
  RiShoppingBagFill,
  RiFileTextFill,
  RiMailFill,
  RiPlayFill,
  RiPauseFill,
  RiDownloadFill,
  RiTicket2Fill,
  RiMusic2Fill,
  RiDiscFill,
  RiCoinsFill,
  RiMicFill,
  RiEqualizerFill,
  RiBarChartFill,
  RiShieldCheckFill,
  RiSparklingFill,
  RiTimeLine,
  RiFileList3Line,
  RiUserAddFill,
  RiCheckFill,
  RiHeadphoneFill
} from 'react-icons/ri';

// Single source of truth ad flight rates for podcasters
export const CANONICAL_PODCAST_AD_RATES = [
  {
    tier: 'pulse',
    name: '15s Pre-Roll Audio Spot',
    badge: 'Pulse Tier',
    price_usd: 250,
    credits: 2500,
    cpm_usd: 10.0,
    impressions: '25,000 Guaranteed Stream Impressions',
    deliverables: '15s unskippable pre-roll audio spot + in-player companion banner with 1-click CTA.'
  },
  {
    tier: 'amplified',
    name: '60s Host-Read Mid-Roll',
    badge: 'Amplified Tier (Most Popular)',
    price_usd: 950,
    credits: 9500,
    cpm_usd: 9.5,
    is_popular: true,
    impressions: '100,000 Guaranteed Stream Impressions',
    deliverables: '60s host-read endorsement + persistent EPK companion banner & episode notes attribution.'
  },
  {
    tier: 'lead',
    name: '4-Episode Show Title Sponsor',
    badge: 'Culture Lead Tier',
    price_usd: 2800,
    credits: 28000,
    cpm_usd: 9.33,
    impressions: '300,000+ Multichannel Impressions',
    deliverables: 'Full title sponsorship across 4 episodes + custom sonic branding & Smart CRM sponsor lead routing.'
  },
  {
    tier: 'titan',
    name: 'Full Season Network Takeover',
    badge: 'Titan Exclusive Tier',
    price_usd: 8500,
    credits: 85000,
    cpm_usd: 8.5,
    impressions: '1,000,000+ Omnichannel Impressions',
    deliverables: '100% Category Exclusivity for entire season + dedicated executive producer co-branded spots.'
  }
];

export function getPersonaNavLinks(creatorType = 'artist') {
  switch (creatorType) {
    case 'podcaster':
      return [
        { id: 'home', label: 'Home', icon: RiHomeFill },
        { id: 'bio', label: 'About Show', icon: RiUserFill },
        { id: 'episodes', label: 'Episodes & Transcripts', icon: RiMicFill },
        { id: 'guest-pitch', label: 'Guest Pitches & Booking', icon: RiCalendarEventFill },
        { id: 'ad-rates', label: 'Ad Rates & Media Kit', icon: RiCoinsFill },
        { id: 'demographics', label: 'Audience Demographics', icon: RiBarChartFill },
        { id: 'press', label: 'Press & Reviews', icon: RiFileTextFill },
        { id: 'contact', label: 'Contact', icon: RiMailFill }
      ];
    case 'dj':
      return [
        { id: 'home', label: 'Home', icon: RiHomeFill },
        { id: 'bio', label: 'DJ Bio & Residencies', icon: RiUserFill },
        { id: 'dj-sets', label: 'Live Sets & Mixes', icon: RiDiscFill },
        { id: 'shows', label: 'Tour Dates & Club Nights', icon: RiCalendarEventFill },
        { id: 'tech-rider', label: 'Tech Rider & Gear Specs', icon: RiEqualizerFill },
        { id: 'promopool', label: 'Mixtapes & Promo Pool', icon: RiDownloadFill },
        { id: 'contact', label: 'Booking & Escrow', icon: RiTicket2Fill }
      ];
    case 'producer':
      return [
        { id: 'home', label: 'Home', icon: RiHomeFill },
        { id: 'bio', label: 'Studio Bio & Story', icon: RiUserFill },
        { id: 'beat-store', label: 'Beat Store & Stems', icon: RiMusic2Fill },
        { id: 'discography', label: 'Production Credits', icon: RiDiscFill },
        { id: 'studio-specs', label: 'DAW & Hardware Specs', icon: RiEqualizerFill },
        { id: 'pricing', label: 'Mixing & Mastering Rates', icon: RiCoinsFill },
        { id: 'contact', label: 'Inquiries', icon: RiMailFill }
      ];
    case 'label':
      return [
        { id: 'home', label: 'Home', icon: RiHomeFill },
        { id: 'bio', label: 'Label Overview', icon: RiUserFill },
        { id: 'roster', label: 'Artists Roster', icon: RiUserAddFill },
        { id: 'discography', label: 'Catalog Releases', icon: RiDiscFill },
        { id: 'sync-showcase', label: 'Sync Placements', icon: RiShieldCheckFill },
        { id: 'press', label: 'News & Press', icon: RiFileTextFill },
        { id: 'contact', label: 'A&R Submissions', icon: RiMailFill }
      ];
    default: // 'artist'
      return [
        { id: 'home', label: 'Home', icon: RiHomeFill },
        { id: 'bio', label: 'Bio', icon: RiUserFill },
        { id: 'shows', label: 'Shows & Tours', icon: RiCalendarEventFill },
        { id: 'discography', label: 'Discography & Albums', icon: RiDiscFill },
        { id: 'media', label: 'Media & 4K Videos', icon: RiVideoFill },
        { id: 'store', label: 'Store & Merch', icon: RiShoppingBagFill },
        { id: 'contact', label: 'Booking & Inquiries', icon: RiMailFill }
      ];
  }
}

// ==============================================================================
// 1. PODCASTER EPK SECTIONS
// ==============================================================================
export function PodcasterEpisodesSection({ episodes = [], onPlayEpisode, accentColor = '#00f2fe' }) {
  const [activeTranscriptId, setActiveTranscriptId] = useState(null);

  const defaultEpisodes = episodes.length > 0 ? episodes : [
    {
      id: 'ep-sample-1',
      title: 'Episode 48: The African Creator Economy & Split Cascade Royalties',
      seasonNumber: 3,
      episodeNumber: 48,
      duration: '42:18',
      publishedAt: '2 days ago',
      streams: '48.2K',
      summary: 'Deep-dive conversation on independent music ownership, direct-to-fan tipping, and building a sustainable creator career without major-label debt.',
      transcript: 'Host: Today we sit down with top independent producers to dissect how automated Split Cascade royalties pay creators 4x more than standard DSP streams...',
      chapters: [
        { time: '00:00', title: 'Why Traditional Streaming Payouts Are Broken' },
        { time: '12:30', title: 'Automated 10,000 Basis Point Split Sheets' },
        { time: '28:15', title: 'Live Q&A with Independent Beatmakers' }
      ]
    },
    {
      id: 'ep-sample-2',
      title: 'Episode 47: Sync Licensing Mastery — Pre-Clearing Cues for Hollywood & Netflix',
      seasonNumber: 3,
      episodeNumber: 47,
      duration: '38:40',
      publishedAt: '1 week ago',
      streams: '52.1K',
      summary: 'Music supervisors break down the metadata requirements, instrumental stem deliverables, and 24-hour turnaround needed to win film placements.',
      transcript: 'Host: When a sync brief lands on your desk with a 48-hour deadline, having one-stop pre-cleared master and publishing splits is the single factor that decides...',
      chapters: [
        { time: '00:00', title: 'The 48-Hour Sync Pitch Window' },
        { time: '15:20', title: 'Stem Formatting & Alt Mix Deliverables' }
      ]
    }
  ];

  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ marginBottom: '28px' }}>
        <span style={{ fontSize: '11px', color: accentColor, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Interactive Episode Directory
        </span>
        <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '6px 0 8px' }}>
          Broadcast Episodes, Chapter Markers &amp; Synchronized Transcripts
        </h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, maxWidth: '720px' }}>
          Mastered to -16 LUFS broadcast voice normalization with interactive chapter bookmarks and 1-click audio seeking.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {defaultEpisodes.map((ep) => (
          <div
            key={ep.id}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '4px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: accentColor, background: `${accentColor}22`, padding: '2px 8px', borderRadius: '3px' }}>
                    S{ep.seasonNumber || 1} • EP {ep.episodeNumber || 1}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    <RiTimeLine size={12} style={{ verticalAlign: 'middle' }} /> {ep.duration} • {ep.publishedAt} • {ep.streams} streams
                  </span>
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>
                  {ep.title}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => onPlayEpisode && onPlayEpisode(ep)}
                style={{
                  padding: '9px 18px',
                  background: accentColor,
                  color: '#060813',
                  border: 'none',
                  borderRadius: '3px',
                  fontSize: '12.5px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RiPlayFill size={16} /> Stream Episode
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              {ep.summary}
            </p>

            {/* Chapters */}
            {ep.chapters && ep.chapters.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                {ep.chapters.map((ch, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onPlayEpisode && onPlayEpisode(ep, ch.time)}
                    style={{
                      padding: '4px 9px',
                      background: 'rgba(0, 240, 255, 0.08)',
                      border: '1px solid rgba(0, 240, 255, 0.25)',
                      borderRadius: '3px',
                      color: '#e2e8f0',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <strong style={{ color: accentColor, fontFamily: 'monospace' }}>{ch.time}</strong>
                    <span>{ch.title}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Transcript Accordion */}
            {ep.transcript && (
              <div>
                <button
                  type="button"
                  onClick={() => setActiveTranscriptId(activeTranscriptId === ep.id ? null : ep.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#10b981',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RiFileList3Line size={13} />
                  {activeTranscriptId === ep.id ? 'Hide Synchronized Transcript ▲' : 'Read Synchronized Transcript ▼'}
                </button>
                {activeTranscriptId === ep.id && (
                  <div style={{
                    marginTop: '8px',
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.4)',
                    borderLeft: '3px solid #10b981',
                    borderRadius: '3px',
                    fontSize: '12px',
                    color: '#cbd5e1',
                    lineHeight: 1.6
                  }}>
                    {ep.transcript}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PodcasterAdRatesSection({ formatPrice = (v) => `$${v}`, accentColor = '#00f2fe' }) {
  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ marginBottom: '28px' }}>
        <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Official Sponsorship Rate Cards
        </span>
        <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '6px 0 8px' }}>
          Standardized Single-Source Podcast Sponsorship Flights
        </h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, maxWidth: '720px' }}>
          All podcast ad rates are dynamically settled via TuneMavens Corporate Ad Services with automated Split Cascade settlements.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {CANONICAL_PODCAST_AD_RATES.map((rate) => (
          <div
            key={rate.tier}
            style={{
              background: '#0a0e20',
              border: rate.is_popular ? `2px solid ${accentColor}` : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '4px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: rate.is_popular ? `0 8px 30px ${accentColor}22` : 'none'
            }}
          >
            {rate.is_popular && (
              <span style={{
                position: 'absolute',
                top: '-11px',
                right: '16px',
                background: accentColor,
                color: '#060813',
                fontSize: '10px',
                fontWeight: 900,
                padding: '2px 8px',
                borderRadius: '3px',
                textTransform: 'uppercase'
              }}>
                Recommended
              </span>
            )}

            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
              {rate.badge}
            </span>
            <h4 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: '6px 0 14px' }}>
              {rate.name}
            </h4>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#fff' }}>
                {formatPrice(rate.price_usd)}
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>/ flight</span>
            </div>
            <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700, marginBottom: '16px' }}>
              {rate.credits.toLocaleString()} TM Credits • {formatPrice(rate.cpm_usd)} CPM
            </div>

            <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 20px', flex: 1 }}>
              {rate.deliverables}
            </p>

            <button
              type="button"
              style={{
                width: '100%',
                padding: '11px',
                background: rate.is_popular ? accentColor : 'rgba(255,255,255,0.06)',
                border: rate.is_popular ? 'none' : '1px solid rgba(255,255,255,0.15)',
                borderRadius: '3px',
                color: rate.is_popular ? '#060813' : '#fff',
                fontSize: '12.5px',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              Book Sponsorship Flight
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PodcasterDemographicsSection({ demographics, accentColor = '#00f2fe' }) {
  const defaultRegions = [
    { region: 'East Africa (Kenya, Tanzania, Uganda)', share: 42 },
    { region: 'West Africa (Nigeria, Ghana)', share: 26 },
    { region: 'North America & Diaspora', share: 20 },
    { region: 'UK & Europe', share: 12 }
  ];
  const regions = demographics?.topRegions || defaultRegions;

  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ marginBottom: '28px' }}>
        <span style={{ fontSize: '11px', color: accentColor, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Audience Telemetry
        </span>
        <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '6px 0 8px' }}>
          Audience Demographics &amp; Geographic Reach
        </h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
          Real-time listener completion and regional download statistics verified by TuneStream Lossless Audio Network.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#0a0e20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '24px' }}>
          <h4 style={{ fontSize: '15px', color: '#fff', fontWeight: 800, margin: '0 0 16px' }}>Top Geographic Regions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {regions.map((r) => (
              <div key={r.region}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: '#cbd5e1' }}>{r.region}</span>
                  <strong style={{ color: accentColor }}>{r.share}%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${r.share}%`, height: '100%', background: accentColor }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#0a0e20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '15px', color: '#fff', fontWeight: 800, margin: 0 }}>Listener Profile &amp; Engagement</h4>
          <div>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Core Age Brackets</span>
            <div style={{ fontSize: '15px', color: '#fff', fontWeight: 800, marginTop: '2px' }}>
              {demographics?.ageGroups || '18–34 (72%), 35–49 (24%), 50+ (4%)'}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Average Completion Rate</span>
            <div style={{ fontSize: '24px', color: '#10b981', fontWeight: 900, marginTop: '2px' }}>
              89.4%
            </div>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Audience Persona</span>
            <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.5, margin: '4px 0 0' }}>
              {demographics?.listenerProfile || 'Tech founders, venture capitalists, music supervisors, creative executives, and cultural tastemakers.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// 2. DJ EPK SECTIONS
// ==============================================================================
export function DjTechRiderSection({ accentColor = '#f59e0b' }) {
  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ marginBottom: '28px' }}>
        <span style={{ fontSize: '11px', color: accentColor, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Technical Specifications
        </span>
        <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '6px 0 8px' }}>
          DJ Booth Stage Specs, Hardware Rider &amp; Monitor Levels
        </h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
          Mandatory sound reinforcement and console requirements for club residencies and festival mainstage appearances.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#0a0e20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '24px' }}>
          <h4 style={{ fontSize: '16px', color: '#fff', fontWeight: 800, margin: '0 0 14px' }}>Console &amp; Media Players</h4>
          <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '13px', lineHeight: 1.8 }}>
            <li><strong>Players:</strong> 3x Pioneer CDJ-3000 (Latest Firmware, Pro DJ Link)</li>
            <li><strong>Mixer:</strong> 1x Pioneer DJM-A9 or DJM-900NXS2 (Independent Booth Output)</li>
            <li><strong>Digital Routing:</strong> 24-Bit / 96kHz Digital Coaxial Interlinks</li>
            <li><strong>Power Supply:</strong> Isolated clean 220V/240V conditioning feed</li>
          </ul>
        </div>

        <div style={{ background: '#0a0e20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '24px' }}>
          <h4 style={{ fontSize: '16px', color: '#fff', fontWeight: 800, margin: '0 0 14px' }}>Monitoring &amp; Stage Sound</h4>
          <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '13px', lineHeight: 1.8 }}>
            <li><strong>Booth Monitors:</strong> 2x L-Acoustics / d&amp;b audiotechnik active wedges</li>
            <li><strong>Sub-Bass:</strong> 1x Dedicated 18-inch sub cabinet in DJ booth (zero phase delay)</li>
            <li><strong>SPL Range:</strong> Minimum 118 dB clean undistorted headroom</li>
            <li><strong>Lighting:</strong> Dedicated spotlight for DJ turntable console</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// 3. PRODUCER EPK SECTIONS
// ==============================================================================
export function ProducerBeatStoreSection({ formatPrice = (v) => `$${v}`, accentColor = '#ec4899' }) {
  const sampleBeats = [
    { id: 'b1', title: 'Nairobi Cyberpulse (Afro-Tech Master)', bpm: 124, key: 'F# Minor', leaseUsd: 45, stemsUsd: 180, buyoutUsd: 750 },
    { id: 'b2', title: 'Swahili Sunset (Intimate Neo-Soul)', bpm: 92, key: 'C Minor', leaseUsd: 40, stemsUsd: 160, buyoutUsd: 650 },
    { id: 'b3', title: 'Eastlands Drill Anthem (24-Bit 808s)', bpm: 142, key: 'D Minor', leaseUsd: 50, stemsUsd: 200, buyoutUsd: 900 }
  ];

  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ marginBottom: '28px' }}>
        <span style={{ fontSize: '11px', color: accentColor, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Lossless Beat Catalog &amp; Licensing
        </span>
        <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '6px 0 8px' }}>
          Instant Beat Store, Stem Packages &amp; Split Cascade Buyouts
        </h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
          Every beat is delivered with 24-bit uncompressed WAV stems and automatic 50/50 publishing registration.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {sampleBeats.map((b) => (
          <div
            key={b.id}
            style={{
              background: '#0a0e20',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '4px',
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
                {b.title}
              </h4>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                <strong style={{ color: accentColor }}>{b.bpm} BPM</strong> • Key: {b.key} • 24-Bit / 96kHz Master Stems Included
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                style={{
                  padding: '8px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '3px',
                  color: '#fff',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                MP3 Lease ({formatPrice(b.leaseUsd)})
              </button>

              <button
                type="button"
                style={{
                  padding: '8px 14px',
                  background: 'rgba(0, 240, 255, 0.1)',
                  border: '1px solid rgba(0, 240, 255, 0.35)',
                  borderRadius: '3px',
                  color: '#00f2fe',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                WAV Stems ({formatPrice(b.stemsUsd)})
              </button>

              <button
                type="button"
                style={{
                  padding: '8px 18px',
                  background: accentColor,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '3px',
                  fontSize: '11.5px',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                Exclusive Buyout ({formatPrice(b.buyoutUsd)})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================================================================
// 4. RECORD LABEL EPK SECTIONS
// ==============================================================================
export function LabelRosterSection({ accentColor = '#a855f7' }) {
  const roster = [
    { name: 'Ndufo', handle: '@ndufo', genre: 'Afro-House & Live Modular', listeners: '620K / mo', avatar: '/heroes/ndufo_hero_slide1_retina.jpg' },
    { name: 'Amina Mwangi', handle: '@aminasounds', genre: 'Afro-Soul & R&B Vocals', listeners: '480K / mo', avatar: '/heroes/hero_music_1.png' },
    { name: 'DJ Kalonje', handle: '@djkalonjelive', genre: 'Cyberwave & Arena Mix', listeners: '740K / mo', avatar: '/heroes/hero_music_1.png' }
  ];

  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ marginBottom: '28px' }}>
        <span style={{ fontSize: '11px', color: accentColor, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Artists Roster &amp; Catalog
        </span>
        <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '6px 0 8px' }}>
          Our Artists
        </h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
          Managed and distributed on the TuneMavens Split Cascade network with global DDEX DSP syndication.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {roster.map((art) => (
          <div
            key={art.name}
            style={{
              background: '#0a0e20',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '4px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <img
              src={art.avatar}
              alt={art.name}
              style={{ width: '100%', height: '170px', objectFit: 'cover', borderRadius: '3px' }}
            />
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: '0 0 2px' }}>{art.name}</h4>
              <div style={{ fontSize: '12px', color: accentColor, fontWeight: 700 }}>{art.genre}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{art.listeners} • Split Cascade Verified</div>
            </div>
            <a
              href={`/#/epk/${art.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '9px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: '3px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 800,
                textDecoration: 'none'
              }}
            >
              Inspect Artist Web World &rarr;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
