import React, { useState, useEffect } from 'react';
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
  RiHeadphoneFill,
  RiBankCardFill,
  RiCellphoneFill,
  RiMapPin2Fill
} from 'react-icons/ri';

// ==============================================================================
// CANONICAL DATA & RATE CARDS BY PERSONA
// ==============================================================================

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

export const CANONICAL_DJ_RATE_CARD = [
  {
    id: 'club_peak',
    tier: 'Club Residency / Peak-Hour Set',
    badge: 'Club & Nightlife Standard',
    duration: '2 Hours (120 Mins)',
    price_usd: 850,
    deposit_pct: 50,
    credits: 8500,
    is_popular: false,
    audience: 'Nightclubs, Lounges & Beach Clubs',
    deliverables: '2-hour high-energy peak-time set + official social flyer clearance + 30-min soundcheck & promo drop.',
    hospitality: 'Local ground transport + booth hospitality package + 4 VIP guest list passes.'
  },
  {
    id: 'festival_headline',
    tier: 'Festival Mainstage / Headline Set',
    badge: 'Most Booked • Festival Tier',
    duration: '90 – 120 Mins',
    price_usd: 2400,
    deposit_pct: 50,
    credits: 24000,
    is_popular: true,
    audience: 'Music Festivals, Concerts & Arena Showcases',
    deliverables: 'Custom festival intro edit + SMPTE timecode lighting/visuals sync + press meet & greet + cleared live stream rights.',
    hospitality: 'Return business/priority flights + 4/5-Star hotel accommodation + dedicated artist green room & security.'
  },
  {
    id: 'corporate_brand',
    tier: 'Corporate Gala & Brand Activation',
    badge: 'Corporate & Brand Tier',
    duration: 'Up to 3 Hours',
    price_usd: 1800,
    deposit_pct: 50,
    credits: 18000,
    is_popular: false,
    audience: 'Corporate Launches, Fashion Weeks & Brand Experiences',
    deliverables: 'Bespoke brand-aligned sonic curation + 100% clean broadcast edits + early PA/AV liaison with event production.',
    hospitality: 'Executive ground transfer + green room hospitality + custom branded DJ booth facade option.'
  },
  {
    id: 'private_luxury',
    tier: 'Private Luxury / Destination Event',
    badge: 'VIP Private Booking',
    duration: 'Up to 4 Hours',
    price_usd: 2200,
    deposit_pct: 50,
    credits: 22000,
    is_popular: false,
    audience: 'Luxury Weddings, Yacht Parties & Private Villas',
    deliverables: 'Pre-event consultation & custom request crate + multi-genre open-format curation + extended encore window.',
    hospitality: 'Full travel & accommodation coverage for destination events outside home city.'
  },
  {
    id: 'branded_mix_license',
    tier: 'Exclusive Commercial DJ Mix & Syndication',
    badge: 'Rights-Cleared Mix License',
    duration: '60-Min Master Mix',
    price_usd: 650,
    deposit_pct: 100,
    credits: 6500,
    is_popular: false,
    audience: 'Radio Stations, Lifestyle Brands & Fitness Platforms',
    deliverables: '24-Bit / 96kHz mastered continuous mix + full extracted cue sheet + 40% DJ / 50% IP Rights Holder Split Cascade clearance.',
    hospitality: 'Delivered digitally via TuneMavens Sovereign Vault within 5 business days.'
  }
];

export const DEFAULT_DJ_EPK_MIXES = [
  {
    id: 'mix_kilifi_sunrise',
    title: 'Kilifi New Year Sunrise Ritual (Afro-Tech Set)',
    dj_name: 'DJ K-Souldier',
    dj_handle: '@djksouldier',
    genre: 'Afro-House',
    bpm_avg: 122,
    duration: '45:00',
    duration_seconds: 2700,
    commercial_price: 5.99,
    price_credits: 60,
    is_original_ip_only: false,
    status: 'published_for_sale',
    streams: '14.8K',
    artwork_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    audio_url: '/uploads/audio/enenda.wav',
    description: 'Recorded live at Beneath The Baobabs in Kilifi. Deep hypnotic Afro-Tech grooves with 100% cleared East African synthesizer stems.',
    tracklist: [
      { id: 't1', title: 'Nairobi Cyberwave (Master)', artist: 'Ndufo', timestamp: '00:00', royalty_share_pct: 16.67, clearance_status: 'cleared' },
      { id: 't2', title: 'Sunset over Rift Valley', artist: 'Khalid Waves', timestamp: '14:20', royalty_share_pct: 16.67, clearance_status: 'cleared' },
      { id: 't3', title: 'Savannah Log Drum VIP', artist: 'Brian Omondi', timestamp: '29:45', royalty_share_pct: 16.66, clearance_status: 'cleared' }
    ]
  },
  {
    id: 'mix_jozi_lagos',
    title: 'Jozi to Lagos Private School Amapiano Vol. 4',
    dj_name: 'DJ Zinhle Vibes',
    dj_handle: '@djzinhlevibes',
    genre: 'Amapiano',
    bpm_avg: 113,
    duration: '40:00',
    duration_seconds: 2400,
    commercial_price: 4.99,
    price_credits: 50,
    is_original_ip_only: false,
    status: 'published_for_sale',
    streams: '21.3K',
    artwork_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    audio_url: '/uploads/audio/running.wav',
    description: 'Soulful Fender Rhodes chords meeting deep Soweto log drums and Lagos vocal chops. Cleared for commercial download & streaming.',
    tracklist: [
      { id: 't4', title: 'Amapiano Horizon', artist: 'Brian Omondi', timestamp: '00:00', royalty_share_pct: 25.0, clearance_status: 'cleared' },
      { id: 't5', title: 'Midnight Mara Starlight', artist: 'Aisha Wanjiku', timestamp: '19:10', royalty_share_pct: 25.0, clearance_status: 'cleared' }
    ]
  },
  {
    id: 'mix_mombasa_deep',
    title: 'Mombasa Coastal Sunset Deep-House Sessions',
    dj_name: 'Khalid Waves',
    dj_handle: '@khalid',
    genre: 'Deep-House',
    bpm_avg: 120,
    duration: '52:00',
    duration_seconds: 3120,
    commercial_price: 6.49,
    price_credits: 65,
    is_original_ip_only: false,
    status: 'published_for_sale',
    streams: '19.4K',
    artwork_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    audio_url: '/uploads/audio/pray_tell.wav',
    description: 'Signature Indian Ocean sunset session blending coastal percussion, Swahili vocal textures, and warm analog basslines.',
    tracklist: [
      { id: 't6', title: 'Indian Ocean Drift (Club Mix)', artist: 'Khalid Waves', timestamp: '00:00', royalty_share_pct: 25.0, clearance_status: 'cleared' },
      { id: 't7', title: 'Afro-Synth Cascade', artist: 'Ndufo', timestamp: '24:00', royalty_share_pct: 25.0, clearance_status: 'cleared' }
    ]
  },
  {
    id: 'mix_sovereign_techno',
    title: 'All-Original High-Voltage Afro-Tech Experience',
    dj_name: 'DJ Maphoria',
    dj_handle: '@djmaphoria',
    genre: 'Electronic',
    bpm_avg: 128,
    duration: '36:00',
    duration_seconds: 2160,
    commercial_price: 6.99,
    price_credits: 70,
    is_original_ip_only: true,
    status: 'published_for_sale',
    streams: '11.2K',
    artwork_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    audio_url: '/uploads/audio/hii_game_si_bano.wav',
    description: '100% sovereign original DJ-producer warehouse weapons. Zero third-party samples — 90% direct creator payout.',
    tracklist: [
      { id: 't8', title: 'Warehouse Dubplate 01 (Original Mix)', artist: 'DJ Maphoria', timestamp: '00:00', royalty_share_pct: 90.0, clearance_status: 'cleared' }
    ]
  },
  {
    id: 'mix_accra_golden',
    title: 'Accra Highlife & Afrobeats Golden Hour Mix',
    dj_name: 'Selector Kofi',
    dj_handle: '@selectorkofi',
    genre: 'Afrobeats',
    bpm_avg: 106,
    duration: '38:00',
    duration_seconds: 2280,
    commercial_price: 3.99,
    price_credits: 40,
    is_original_ip_only: false,
    status: 'published_for_sale',
    streams: '16.5K',
    artwork_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    audio_url: '/uploads/audio/haiya.wav',
    description: 'Smooth rooftop blends of Ghanaian Highlife guitar classics and modern Pan-African Afrobeats.',
    tracklist: [
      { id: 't9', title: 'Labadi Beach Bounce', artist: 'Selector Kofi', timestamp: '00:00', royalty_share_pct: 25.0, clearance_status: 'cleared' },
      { id: 't10', title: 'Kilimanjaro Heights', artist: 'Ndufo', timestamp: '18:30', royalty_share_pct: 25.0, clearance_status: 'cleared' }
    ]
  }
];

export const CANONICAL_DJ_TECH_RIDER = {
  console: [
    { label: 'Players', value: '3x Pioneer CDJ-3000 (Latest Firmware, Pro DJ Link Ethernet Switch)' },
    { label: 'Mixer', value: '1x Pioneer DJM-A9 or DJM-V10 (Independent Booth Output)' },
    { label: 'Digital Routing', value: '24-Bit / 96kHz Digital Coaxial Interlinks' },
    { label: 'Power Supply', value: 'Isolated clean 220V/240V conditioning feed' }
  ],
  monitoring: [
    { label: 'Booth Monitors', value: '2x L-Acoustics / d&b audiotechnik active wedges at ear height' },
    { label: 'Sub-Bass', value: '1x Dedicated 18-inch sub cabinet in DJ booth (zero phase delay)' },
    { label: 'SPL Range', value: 'Minimum 118 dB clean undistorted headroom' },
    { label: 'Visuals / Timecode', value: 'ShowKontrol / SMPTE LTC feed to VJ console' }
  ]
};

export const CANONICAL_PRODUCER_BEATS = [
  { id: 'b1', title: 'Nairobi Cyberpulse (Afro-Tech Master)', bpm: 124, key: 'F# Minor', leaseUsd: 45, stemsUsd: 180, buyoutUsd: 750, audioUrl: '/uploads/audio/enenda.wav' },
  { id: 'b2', title: 'Swahili Sunset (Intimate Neo-Soul)', bpm: 92, key: 'C Minor', leaseUsd: 40, stemsUsd: 160, buyoutUsd: 650, audioUrl: '/uploads/audio/running.wav' },
  { id: 'b3', title: 'Eastlands Drill Anthem (24-Bit 808s)', bpm: 142, key: 'D Minor', leaseUsd: 50, stemsUsd: 200, buyoutUsd: 900, audioUrl: '/uploads/audio/pray_tell.wav' }
];

export const CANONICAL_LABEL_ROSTER = [
  { name: 'Ndufo', slug: 'ndufo', persona: 'artist', genre: 'Afro-House & Live Modular', listeners: '3.4M / mo', avatar: '/heroes/ndufo_hero_slide1_retina.jpg' },
  { name: 'Khalid Waves', slug: 'khalid', persona: 'dj', genre: 'Deep-House & Club DJ', listeners: '1.8M / mo', avatar: '/uploads/ai_assets/retina_art_9846064_2048x2048.jpg' },
  { name: 'Aisha Wanjiku', slug: 'aisha', persona: 'artist', genre: 'Afro-Soul & R&B Vocals', listeners: '2.1M / mo', avatar: '/uploads/ai_assets/retina_art_1908250_2560x1440.jpg' },
  { name: 'DJ K-Souldier', slug: 'djksouldier', persona: 'dj', genre: 'Afro-Tech & Festival DJ', listeners: '1.4M / mo', avatar: '/heroes/ndufo_hero_slide2_retina.jpg' },
  { name: 'Brian Omondi', slug: 'brian-omondi', persona: 'producer', genre: 'Amapiano & Afro-Tech Producer', listeners: '1.5M / mo', avatar: '/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg' }
];

// Returns the editable array when the creator customised it in the EPK Builder, otherwise the canonical default.
export const pickEditable = (value, fallback) => (Array.isArray(value) && value.length > 0 ? value : fallback);

export function generateAndDownloadDjRateCard(djName = 'Verified DJ', rateCard = CANONICAL_DJ_RATE_CARD, formatPrice = (v) => `$${v}`, bookingEmail = 'booking@tunemavens.com') {
  const safeName = (djName || 'DJ').replace(/[^a-zA-Z0-9_-]/g, '_');
  const rowsHtml = (rateCard || CANONICAL_DJ_RATE_CARD).map((r) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #1e293b;">
        <strong style="color:#0f172a;font-size:14px;">${r.tier}</strong><br/>
        <span style="color:#64748b;font-size:11px;">${r.badge} • Ideal for: ${r.audience}</span>
      </td>
      <td style="padding:12px;border-bottom:1px solid #1e293b;font-weight:700;color:#0f172a;">${r.duration}</td>
      <td style="padding:12px;border-bottom:1px solid #1e293b;font-weight:900;color:#0284c7;font-size:15px;">
        ${formatPrice(r.price_usd)}<br/>
        <span style="font-size:11px;color:#64748b;font-weight:600;">(${r.deposit_pct}% Escrow Deposit)</span>
      </td>
      <td style="padding:12px;border-bottom:1px solid #1e293b;font-size:12px;color:#334155;line-height:1.45;">
        ${r.deliverables}<br/>
        <em style="color:#64748b;">Rider: ${r.hospitality}</em>
      </td>
    </tr>
  `).join('');

  const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${djName} — Official DJ Rate Card & Technical Summary (2026)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; background: #f8fafc; margin: 0; padding: 36px; }
    .sheet { max-width: 920px; margin: 0 auto; background: #ffffff; border: 2px solid #0f172a; border-radius: 6px; padding: 36px; box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0284c7; padding-bottom: 20px; margin-bottom: 24px; }
    .badge { display: inline-block; background: #0284c7; color: #fff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.06em; }
    h1 { margin: 8px 0 4px; font-size: 28px; font-weight: 900; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0 28px; }
    th { background: #0f172a; color: #fff; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
    .rider-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; background: #f1f5f9; padding: 20px; border-radius: 4px; margin-top: 16px; }
    .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; font-size: 12px; color: #475569; }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div>
        <span class="badge">TuneMavens Sovereign DJ EPK • Official Rate Card</span>
        <h1>${djName}</h1>
        <div style="color:#475569;font-size:14px;font-weight:600;">Live Club Residencies • Festival Mainstages • Corporate Brand Events • Cleared Commercial Mixes</div>
      </div>
      <div style="text-align:right;font-size:12px;color:#334155;">
        <strong>Booking &amp; Escrow Desk:</strong><br/>
        ${bookingEmail}<br/>
        <strong>Split Engine:</strong> 40% DJ / 50% IP / 10% Platform<br/>
        <strong>Effective Season:</strong> 2026 – 2027
      </div>
    </div>

    <h3 style="margin:0 0 8px;font-size:16px;text-transform:uppercase;color:#0284c7;">1. Performance &amp; Mix Licensing Rate Card</h3>
    <table>
      <thead>
        <tr>
          <th style="width:26%;">Booking Package</th>
          <th style="width:15%;">Set Duration</th>
          <th style="width:19%;">Standard Fee</th>
          <th style="width:40%;">Deliverables &amp; Hospitality</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <h3 style="margin:0 0 8px;font-size:16px;text-transform:uppercase;color:#0284c7;">2. Mandatory Booth Technical Rider &amp; Escrow Terms</h3>
    <div class="rider-grid">
      <div>
        <strong style="font-size:13px;">DJ Booth Console &amp; Monitoring:</strong>
        <ul style="margin:8px 0 0;padding-left:18px;font-size:12px;line-height:1.6;">
          <li>3x Pioneer CDJ-3000 (Pro DJ Link networked, latest firmware)</li>
          <li>1x Pioneer DJM-A9 or DJM-V10 Mixer with independent booth control</li>
          <li>2x L-Acoustics / d&amp;b active booth monitors + 1x 18" subwoofer</li>
        </ul>
      </div>
      <div>
        <strong style="font-size:13px;">Booking Escrow &amp; Settlement Terms:</strong>
        <ul style="margin:8px 0 0;padding-left:18px;font-size:12px;line-height:1.6;">
          <li>50% deposit locked in TuneLedger Escrow to confirm date</li>
          <li>Remaining 50% settled prior to stage call time via M-Pesa, Wire, or TM Credits</li>
          <li>All commercial mix recordings pre-cleared via TuneMavens Split Cascade</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <span>Generated via TuneMavens Sovereign Rights &amp; Booking Engine</span>
      <span>Book online at tunemavens.com/#/epk/${safeName.toLowerCase()}?persona=dj</span>
    </div>
  </div>
</body>
</html>`;

  try {
    const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}_Official_DJ_Rate_Card_2026.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    return true;
  } catch (err) {
    console.warn('Rate card download fallback:', err);
    return false;
  }
}

export function getPersonaNavLinks(creatorType = 'artist') {
  switch (creatorType) {
    case 'podcaster':
      return [
        { id: 'home', label: 'Home', icon: RiHomeFill },
        { id: 'episodes', label: 'Episodes & Transcripts', icon: RiMicFill },
        { id: 'ad-rates', label: 'Ad Rates & Media Kit', icon: RiCoinsFill },
        { id: 'demographics', label: 'Audience Demographics', icon: RiBarChartFill },
        { id: 'bio', label: 'About Show & Host', icon: RiUserFill },
        { id: 'press', label: 'Press & Reviews', icon: RiFileTextFill },
        { id: 'contact', label: 'Guest Pitch & Sponsors', icon: RiMailFill }
      ];
    case 'dj':
      return [
        { id: 'home', label: 'Home', icon: RiHomeFill },
        { id: 'dj-sets', label: 'Mixes (Stream & Buy)', icon: RiDiscFill },
        { id: 'rate-card', label: 'DJ Rate Card', icon: RiCoinsFill },
        { id: 'dj-booking', label: 'Book DJ for Gig', icon: RiCalendarEventFill },
        { id: 'tech-rider', label: 'Booth Tech Rider', icon: RiEqualizerFill },
        { id: 'shows', label: 'Club & Festival Dates', icon: RiTicket2Fill },
        { id: 'bio', label: 'DJ Bio & Press Kit', icon: RiUserFill }
      ];
    case 'producer':
      return [
        { id: 'home', label: 'Home', icon: RiHomeFill },
        { id: 'beat-store', label: 'Beat Store & Stems', icon: RiMusic2Fill },
        { id: 'discography', label: 'Production Credits', icon: RiDiscFill },
        { id: 'tech-rider', label: 'Studio & Hardware Specs', icon: RiEqualizerFill },
        { id: 'pricing', label: 'Mixing & Custom Rates', icon: RiCoinsFill },
        { id: 'bio', label: 'Producer Bio', icon: RiUserFill },
        { id: 'contact', label: 'Hire Producer', icon: RiMailFill }
      ];
    case 'label':
    case 'publisher':
      return [
        { id: 'home', label: 'Home', icon: RiHomeFill },
        { id: 'roster', label: 'Signed Roster', icon: RiUserAddFill },
        { id: 'discography', label: 'Master Catalog', icon: RiDiscFill },
        { id: 'press', label: 'Sync & Licensing Kit', icon: RiShieldCheckFill },
        { id: 'shows', label: 'Label Showcases', icon: RiCalendarEventFill },
        { id: 'bio', label: 'Executive Overview', icon: RiUserFill },
        { id: 'contact', label: 'A&R & Sync Desk', icon: RiMailFill }
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

export function PersonaAudienceCalloutBanner({
  creatorType = 'artist',
  artistName = 'Creator',
  accentColor = '#00f2fe',
  onNavigateTab,
  onDownloadRateCard
}) {
  const configs = {
    dj: {
      badge: '🎛️ Official DJ & Turntablist EPK Web World',
      audience: 'Built for Club Promoters, Festival Talent Buyers, Brand Event Directors & Mix Listeners',
      headline: `${artistName} — Rights-Cleared Mixes, Live Gig Booking & Official Rate Card`,
      desc: 'Stream or purchase continuous lossless DJ mixes with 100% cleared IP splits (40% DJ / 50% Featured Track Rights Holders / 10% Platform), inspect the official performance rate card, download the Pioneer CDJ-3000 booth rider, and book live sets with TuneLedger Escrow.',
      actions: [
        { label: '🎧 Stream & Buy Mixes', tab: 'dj-sets', primary: true },
        { label: '📅 Book DJ for Gig', tab: 'dj-booking', primary: false },
        { label: '📋 View DJ Rate Card', tab: 'rate-card', primary: false },
        { label: '📥 Download Rate Card', action: 'download-rate-card', primary: false }
      ]
    },
    podcaster: {
      badge: '🎙️ Official Podcast & Broadcast Show EPK',
      audience: 'Built for Brand Sponsors, Media Buyers, PR Publicists & Show Listeners',
      headline: `${artistName} — Broadcast Episodes, Sponsor Rate Cards & Audience Telemetry`,
      desc: 'Stream -16 LUFS broadcast-normalized episodes with interactive chapter markers and transcripts, inspect verified listener demographics, and book host-read mid-roll sponsorship flights.',
      actions: [
        { label: '🎙️ Episodes & Transcripts', tab: 'episodes', primary: true },
        { label: '📊 Sponsorship Rate Card', tab: 'ad-rates', primary: false },
        { label: '📈 Audience Demographics', tab: 'demographics', primary: false },
        { label: '✉️ Pitch Guest / Sponsor', tab: 'contact', primary: false }
      ]
    },
    producer: {
      badge: '🎹 Official Music Producer & Sound Architect EPK',
      audience: 'Built for Recording Artists, Record Labels, Music Supervisors & Vocalists',
      headline: `${artistName} — Instant Beat Store, 24-Bit Stems & Studio Production Rates`,
      desc: 'Audition and license unmastered 24-bit WAV stems, lease instrumentals or negotiate exclusive Split Cascade buyouts, and book custom mixing or executive production sessions.',
      actions: [
        { label: '🎹 Beat Store & Stems', tab: 'beat-store', primary: true },
        { label: '💿 Production Credits', tab: 'discography', primary: false },
        { label: '🎛️ Studio Hardware Specs', tab: 'tech-rider', primary: false },
        { label: '✉️ Book Studio Session', tab: 'contact', primary: false }
      ]
    },
    label: {
      badge: '🏢 Official Record Label & Rights Imprint EPK',
      audience: 'Built for Music Supervisors, Festival Buyers, DSP Curators & A&R Prospects',
      headline: `${artistName} — Signed Artist Roster, One-Stop Sync Catalog & Global Distribution`,
      desc: 'Explore our signed creator roster, audition one-stop pre-cleared masters for Film/TV sync licensing, and submit demos or co-publishing inquiries.',
      actions: [
        { label: '🌟 Signed Artist Roster', tab: 'roster', primary: true },
        { label: '💿 Master Catalog', tab: 'discography', primary: false },
        { label: '🎬 Sync Licensing Kit', tab: 'press', primary: false },
        { label: '📩 A&R / Sync Desk', tab: 'contact', primary: false }
      ]
    },
    artist: {
      badge: '🎵 Official Recording Artist & Touring Web World',
      audience: 'Built for Fans, Concert Promoters, Music Supervisors & Press Outlets',
      headline: `${artistName} — Lossless Singles, Albums, Live Tour Ticketing & Executive Press Kit`,
      desc: 'Stream 24-bit lossless singles and albums, purchase VIP concert tickets and official merchandise, and download high-resolution press photos and stage riders.',
      actions: [
        { label: '🎵 Discography & Singles', tab: 'discography', primary: true },
        { label: '🎟️ Tour Dates & Tickets', tab: 'shows', primary: false },
        { label: '📄 Executive Press Kit', tab: 'press', primary: false },
        { label: '✉️ Booking & Sync', tab: 'contact', primary: false }
      ]
    }
  };

  const active = configs[creatorType] || configs.artist;

  return (
    <div
      data-testid={`epk-persona-banner-${creatorType}`}
      style={{
        background: 'linear-gradient(135deg, rgba(10,14,32,0.96) 0%, rgba(15,23,42,0.92) 100%)',
        border: `1px solid ${accentColor}55`,
        borderRadius: '4px',
        padding: '24px 28px',
        marginBottom: '28px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
        <span style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}55`, padding: '3px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {active.badge}
        </span>
        <span style={{ fontSize: '11.5px', color: '#10b981', fontWeight: 700 }}>
          {active.audience}
        </span>
      </div>
      <h3 style={{ margin: '6px 0 8px', fontSize: '21px', fontWeight: 900, color: '#fff' }}>
        {active.headline}
      </h3>
      <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#cbd5e1', lineHeight: 1.55, maxWidth: '900px' }}>
        {active.desc}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {active.actions.map((act, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              if (act.action === 'download-rate-card' && onDownloadRateCard) {
                onDownloadRateCard();
              } else if (act.tab && onNavigateTab) {
                onNavigateTab(act.tab);
              }
            }}
            style={{
              padding: '9px 16px',
              borderRadius: '3px',
              border: act.primary ? 'none' : `1px solid ${accentColor}66`,
              background: act.primary ? accentColor : 'rgba(255,255,255,0.05)',
              color: act.primary ? '#060813' : '#fff',
              fontSize: '12px',
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            {act.label}
          </button>
        ))}
      </div>
    </div>
  );
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
    <div style={{ padding: '20px 0' }}>
      <div style={{ marginBottom: '24px' }}>
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

export function PodcasterAdRatesSection({ formatPrice = (v) => `$${v}`, accentColor = '#00f2fe', adRates, onBookSlot }) {
  const [bookedTier, setBookedTier] = useState(null);
  const activeAdRates = pickEditable(adRates, CANONICAL_PODCAST_AD_RATES);
  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div>
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
      </div>

      {bookedTier && (
        <div style={{ marginBottom: '20px', padding: '14px 18px', background: 'rgba(16,185,129,0.14)', border: '1px solid #10b981', borderRadius: '4px', color: '#ecfdf5', fontSize: '13px' }}>
          ✓ Sponsorship Flight Reservation initialized for <strong>{bookedTier.name}</strong> ({formatPrice(bookedTier.price_usd)}). Our Corporate Ad Desk has logged your flight brief in Smart CRM.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {activeAdRates.map((rate) => (
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
              {Number(rate.credits || (rate.price_usd || 0) * 10).toLocaleString()} TM Credits • {formatPrice(rate.cpm_usd)} CPM
            </div>

            <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 20px', flex: 1 }}>
              {rate.deliverables}
            </p>

            <button
              type="button"
              onClick={() => { setBookedTier(rate); if (onBookSlot) setTimeout(() => onBookSlot(rate), 1200); }}
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
    <div style={{ padding: '20px 0' }}>
      <div style={{ marginBottom: '24px' }}>
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
              {demographics?.completionRate || '89.4%'}
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
// 2. DJ EPK SECTIONS (MIXES STREAM/PURCHASE, GIG BOOKING, RATE CARD & DOWNLOAD)
// ==============================================================================

export function DjMixesAndSetsSection({
  djName = 'Verified DJ',
  djSlug = 'dj',
  mixes = [],
  onPlayMix,
  formatPrice = (v) => `$${Number(v || 0).toFixed(2)}`,
  accentColor = '#00f2fe',
  onBookDjClick
}) {
  const [liveMixes, setLiveMixes] = useState(() => (Array.isArray(mixes) && mixes.length > 0 ? mixes : DEFAULT_DJ_EPK_MIXES));
  const [filterScope, setFilterScope] = useState('all'); // 'dj' | 'all'
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [expandedTracklistId, setExpandedTracklistId] = useState(null);
  const [checkoutMix, setCheckoutMix] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('mpesa'); // 'mpesa' | 'credits' | 'card'
  const [mpesaPhone, setMpesaPhone] = useState('+254 712 345 678');
  const [purchasedMixIds, setPurchasedMixIds] = useState([]);
  const [purchaseReceipt, setPurchaseReceipt] = useState(null);

  const customMixesCount = Array.isArray(mixes) ? mixes.length : 0;
  const customMixesKey = Array.isArray(mixes) ? mixes.map((m) => m.id || m.title || '').join('|') : '';

  useEffect(() => {
    if (Array.isArray(mixes) && mixes.length > 0) {
      setLiveMixes(mixes);
      return undefined;
    }
    let cancelled = false;
    fetch('/api/dj/mixes')
      .then((r) => (r.ok ? r.json() : fetch('/api/dj-mixes').then((res) => (res.ok ? res.json() : null))))
      .then((data) => {
        if (cancelled) return;
        const arr = Array.isArray(data) ? data : data?.data;
        if (Array.isArray(arr) && arr.length > 0) {
          const clearedOnly = arr.filter((m) => m.status === 'published_for_sale' || m.status === 'published' || m.is_original_ip_only);
          if (clearedOnly.length > 0) setLiveMixes(clearedOnly);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [customMixesCount, customMixesKey]);

  const cleanDjSlug = (djSlug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanDjName = (djName || '').toLowerCase().trim();

  // Sort mixes so the current DJ's mixes appear first
  const sortedMixes = [...liveMixes].sort((a, b) => {
    const aMatch = (a.dj_name || '').toLowerCase().includes(cleanDjName) || (a.dj_handle || '').toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanDjSlug);
    const bMatch = (b.dj_name || '').toLowerCase().includes(cleanDjName) || (b.dj_handle || '').toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanDjSlug);
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  const filteredMixes = sortedMixes.filter((m) => {
    if (filterScope === 'dj') {
      const match = (m.dj_name || '').toLowerCase().includes(cleanDjName) || (m.dj_handle || '').toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanDjSlug);
      if (!match) return false;
    }
    if (selectedGenre !== 'All') {
      if (!(m.genre || '').toLowerCase().replace('-', ' ').includes(selectedGenre.toLowerCase().replace('-', ' '))) {
        return false;
      }
    }
    return true;
  });

  const handleConfirmPurchase = (e) => {
    e.preventDefault();
    if (!checkoutMix) return;
    const priceUsd = Number(checkoutMix.commercial_price || 4.99);
    const djCut = checkoutMix.is_original_ip_only ? priceUsd * 0.9 : priceUsd * 0.4;
    const ipCut = checkoutMix.is_original_ip_only ? 0 : priceUsd * 0.5;
    const platformCut = priceUsd * 0.1;

    setPurchasedMixIds((prev) => [...prev, checkoutMix.id]);
    setPurchaseReceipt({
      mix: checkoutMix,
      ref: `TM-MIX-${Math.floor(100000 + Math.random() * 900000)}`,
      method: paymentMethod.toUpperCase(),
      totalPaid: formatPrice(priceUsd),
      djPayout: formatPrice(djCut),
      ipPayout: formatPrice(ipCut),
      platformFee: formatPrice(platformCut)
    });
  };

  return (
    <div style={{ padding: '16px 0' }} data-testid="dj-epk-mixes-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '11px', color: accentColor, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Sovereign Rights-Cleared DJ Mixes &amp; Live Sets
          </span>
          <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '6px 0 6px' }}>
            Stream &amp; Purchase Official DJ Mixes ({filteredMixes.length})
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, maxWidth: '760px' }}>
            Every commercial mix is fingerprinted and cleared via TuneLedger Split Cascade: <strong>40% to {djName}</strong>, <strong>50% distributed pro-rata to featured track IP owners</strong>, and <strong>10% platform settlement</strong> (or <strong>90% DJ</strong> for 100% original productions).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Afro-House', 'Amapiano', 'Deep-House', 'Afrobeats', 'Electronic'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGenre(g)}
              style={{
                padding: '6px 12px',
                borderRadius: '3px',
                border: selectedGenre === g ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.12)',
                background: selectedGenre === g ? accentColor : 'rgba(255,255,255,0.04)',
                color: selectedGenre === g ? '#060813' : '#fff',
                fontSize: '11.5px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredMixes.map((mix) => {
          const isPurchased = purchasedMixIds.includes(mix.id);
          const priceUsd = Number(mix.commercial_price || 4.99);
          const credits = mix.price_credits || Math.round(priceUsd * 10);
          const tracklist = Array.isArray(mix.tracklist) ? mix.tracklist : [];
          const isExpanded = expandedTracklistId === mix.id;

          return (
            <div
              key={mix.id || mix.title}
              data-testid="dj-epk-mix-card"
              style={{
                background: '#0a0e20',
                border: `1px solid ${accentColor}33`,
                borderRadius: '4px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ position: 'relative', height: '185px', background: '#050811' }}>
                  <img
                    src={mix.artwork_url || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80'}
                    alt={mix.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(6,8,19,0.88)', color: accentColor, padding: '3px 8px', borderRadius: '3px', fontSize: '10px', fontWeight: 800 }}>
                    {mix.genre || 'Afro-House'} • {mix.bpm_avg || 122} BPM • {mix.duration || '45:00'}
                  </span>
                  <span style={{ position: 'absolute', top: '10px', right: '10px', background: mix.is_original_ip_only ? 'rgba(168,85,247,0.92)' : 'rgba(16,185,129,0.92)', color: '#fff', padding: '3px 8px', borderRadius: '3px', fontSize: '10px', fontWeight: 800 }}>
                    {mix.is_original_ip_only ? '90% Sovereign DJ IP' : '✓ 40% DJ / 50% IP Cleared'}
                  </span>
                </div>

                <div style={{ padding: '18px' }}>
                  <div style={{ fontSize: '11px', color: accentColor, fontWeight: 800, marginBottom: '4px' }}>
                    Mixed by {mix.dj_name || djName}
                  </div>
                  <h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 900, color: '#fff', lineHeight: 1.3 }}>
                    {mix.title}
                  </h4>
                  <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 12px' }}>
                    {mix.description}
                  </p>

                  {tracklist.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '3px', padding: '10px 12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '10.5px', color: '#cbd5e1', fontWeight: 800, textTransform: 'uppercase' }}>
                          Cue Sheet Tracklist ({tracklist.length} Cleared Tracks)
                        </span>
                        <button
                          type="button"
                          onClick={() => setExpandedTracklistId(isExpanded ? null : mix.id)}
                          style={{ background: 'none', border: 'none', color: accentColor, fontSize: '11px', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                        >
                          {isExpanded ? 'Hide ▲' : 'Inspect Splits ▼'}
                        </button>
                      </div>
                      {(isExpanded ? tracklist : tracklist.slice(0, 2)).map((t, i) => (
                        <div key={t.id || i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', padding: '3px 0', borderBottom: i < tracklist.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                          <span style={{ color: '#e2e8f0' }}>{t.timestamp || `0${i * 8}:00`} — <strong>{t.artist}</strong>: {t.title}</span>
                          <span style={{ color: '#10b981', fontWeight: 700 }}>✓ {t.royalty_share_pct || 25}% IP</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>
                      {formatPrice(priceUsd)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700 }}>
                      or {credits} TM Credits • Lossless WAV / 320 MP3
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {mix.streams || '12.4K'} streams
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    data-testid="dj-epk-stream-mix-btn"
                    onClick={() =>
                      onPlayMix &&
                      onPlayMix({
                        id: mix.id || `mix_${mix.title}`,
                        title: `${mix.title} (${mix.dj_name || djName})`,
                        isrc: `KE-DJM-26-00${String(mix.id || '1').slice(-3)}`,
                        audioUrl: mix.audio_url || '/uploads/audio/enenda.wav',
                        duration: mix.duration || '45:00',
                        coverArt: mix.artwork_url,
                        priceCredits: credits
                      })
                    }
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      background: 'rgba(255,255,255,0.07)',
                      border: `1px solid ${accentColor}66`,
                      borderRadius: '3px',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <RiPlayFill size={16} style={{ color: accentColor }} /> Stream Mix
                  </button>

                  {isPurchased ? (
                    <a
                      href={mix.audio_url || '/uploads/audio/enenda.wav'}
                      download={`${(mix.title || 'DJ_Mix').replace(/[^a-zA-Z0-9_-]/g, '_')}.wav`}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        background: '#10b981',
                        color: '#060813',
                        borderRadius: '3px',
                        fontSize: '12px',
                        fontWeight: 900,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <RiDownloadFill size={15} /> Download Master
                    </a>
                  ) : (
                    <button
                      type="button"
                      data-testid="dj-epk-buy-mix-btn"
                      onClick={() => {
                        setCheckoutMix(mix);
                        setPurchaseReceipt(null);
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        background: accentColor,
                        color: '#060813',
                        border: 'none',
                        borderRadius: '3px',
                        fontSize: '12px',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <RiShoppingBagFill size={14} /> Buy Mix ({formatPrice(priceUsd)})
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DJ Mix Checkout & Split Cascade Modal */}
      {checkoutMix && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(4,6,14,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setCheckoutMix(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0a0e20',
              border: `1px solid ${accentColor}`,
              borderRadius: '4px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              color: '#fff',
              boxShadow: '0 20px 50px rgba(0,0,0,0.75)'
            }}
          >
            {purchaseReceipt ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#10b981', color: '#060813', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '22px', fontWeight: 900 }}>
                  ✓
                </div>
                <h4 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 6px' }}>
                  DJ Mix Unlocked &amp; Split Disbursed!
                </h4>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 16px' }}>
                  Receipt <strong>{purchaseReceipt.ref}</strong> • Paid {purchaseReceipt.totalPaid} via {purchaseReceipt.method}
                </p>
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '4px', padding: '12px', textAlign: 'left', fontSize: '12px', marginBottom: '18px' }}>
                  <div style={{ fontWeight: 800, color: '#10b981', marginBottom: '6px' }}>TuneLedger Instant Split Cascade Settlement:</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                    <span>DJ Share ({checkoutMix.is_original_ip_only ? '90%' : '40%'}):</span>
                    <strong>{purchaseReceipt.djPayout}</strong>
                  </div>
                  {!checkoutMix.is_original_ip_only && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                      <span>Featured Track IP Owners (50%):</span>
                      <strong>{purchaseReceipt.ipPayout}</strong>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                    <span>Platform &amp; Clearance (10%):</span>
                    <strong>{purchaseReceipt.platformFee}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href={checkoutMix.audio_url || '/uploads/audio/enenda.wav'}
                    download={`${(checkoutMix.title || 'DJ_Mix').replace(/[^a-zA-Z0-9_-]/g, '_')}.wav`}
                    style={{ flex: 1, padding: '11px', background: '#10b981', color: '#060813', borderRadius: '3px', fontWeight: 900, fontSize: '13px', textDecoration: 'none', textAlign: 'center' }}
                  >
                    ⬇ Download Master Mix
                  </a>
                  <button
                    type="button"
                    onClick={() => setCheckoutMix(null)}
                    style={{ padding: '11px 18px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '3px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmPurchase}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '10.5px', color: accentColor, fontWeight: 800, textTransform: 'uppercase' }}>
                      Rights-Cleared Commercial DJ Mix Checkout
                    </span>
                    <h4 style={{ fontSize: '19px', fontWeight: 900, margin: '4px 0 0' }}>{checkoutMix.title}</h4>
                  </div>
                  <button type="button" onClick={() => setCheckoutMix(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '12px 14px', marginBottom: '16px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>Commercial Mix Price:</span>
                    <strong style={{ fontSize: '16px', color: accentColor }}>{formatPrice(checkoutMix.commercial_price || 4.99)}</strong>
                  </div>
                  <div style={{ color: '#10b981', fontSize: '11.5px' }}>
                    ✓ Automatic Split: {checkoutMix.is_original_ip_only ? '90% DJ / 10% Platform' : '40% DJ / 50% Featured Track Rights Holders / 10% Platform'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  {[
                    { id: 'mpesa', label: '📱 M-Pesa STK' },
                    { id: 'credits', label: '🪙 TM Credits' },
                    { id: 'card', label: '💳 Card / Apple Pay' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      style={{
                        flex: 1,
                        padding: '9px',
                        borderRadius: '3px',
                        border: paymentMethod === m.id ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.15)',
                        background: paymentMethod === m.id ? `${accentColor}22` : 'rgba(255,255,255,0.03)',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'mpesa' && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '11.5px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 700 }}>
                      M-Pesa Mobile Number (Instant STK Push)
                    </label>
                    <input
                      type="text"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 12px', background: '#050811', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '3px', color: '#fff', boxSizing: 'border-box' }}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  style={{ width: '100%', padding: '12px', background: accentColor, color: '#060813', border: 'none', borderRadius: '3px', fontSize: '13px', fontWeight: 900, cursor: 'pointer' }}
                >
                  Confirm &amp; Unlock Lossless Mix ({formatPrice(checkoutMix.commercial_price || 4.99)})
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function DjRateCardSection({
  djName = 'Verified DJ',
  rateCard = CANONICAL_DJ_RATE_CARD,
  formatPrice = (v) => `$${v}`,
  bookingEmail = 'booking@tunemavens.com',
  onSelectTierForBooking,
  onSelectPackageForBooking,
  accentColor = '#f59e0b'
}) {
  const handleSelectTier = onSelectTierForBooking || onSelectPackageForBooking;
  const [downloadedNotice, setDownloadedNotice] = useState(false);

  const handleDownload = () => {
    const ok = generateAndDownloadDjRateCard(djName, rateCard, formatPrice, bookingEmail);
    if (ok) {
      setDownloadedNotice(true);
      setTimeout(() => setDownloadedNotice(false), 5000);
    }
  };

  const activeRates = Array.isArray(rateCard) && rateCard.length > 0 ? rateCard : CANONICAL_DJ_RATE_CARD;

  return (
    <div style={{ padding: '20px 0' }} data-testid="dj-epk-rate-card-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <span style={{ fontSize: '11px', color: accentColor, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Official DJ Performance &amp; Mix Licensing Rate Card
          </span>
          <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '6px 0 8px' }}>
            {djName} — 2026 Gig Booking &amp; Commercial Mix Rate Card
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, maxWidth: '720px' }}>
            Transparent club, festival, corporate, and private event appearance fees. All live bookings are protected by 50% TuneLedger Escrow.
          </p>
        </div>

        <button
          type="button"
          data-testid="download-dj-rate-card-btn"
          onClick={handleDownload}
          style={{
            padding: '11px 20px',
            background: accentColor,
            color: '#060813',
            border: 'none',
            borderRadius: '3px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: `0 4px 18px ${accentColor}44`
          }}
        >
          <RiDownloadFill size={16} /> Download Official Rate Card (One-Sheet)
        </button>
      </div>

      {downloadedNotice && (
        <div style={{ marginBottom: '20px', padding: '12px 16px', background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', borderRadius: '4px', color: '#ecfdf5', fontSize: '13px', fontWeight: 700 }}>
          ✓ Downloaded <strong>{djName}_Official_DJ_Rate_Card_2026.html</strong>! You can print or save as PDF directly from your browser.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(275px, 1fr))', gap: '20px' }}>
        {activeRates.map((item) => (
          <div
            key={item.id || item.tier}
            data-testid="dj-rate-card-tier"
            style={{
              background: '#0a0e20',
              border: item.is_popular ? `2px solid ${accentColor}` : '1px solid rgba(255,255,255,0.09)',
              borderRadius: '4px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              {item.is_popular && (
                <span style={{ position: 'absolute', top: '-11px', right: '16px', background: accentColor, color: '#060813', fontSize: '10px', fontWeight: 900, padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                  Most Booked
                </span>
              )}
              <span style={{ fontSize: '10.5px', color: accentColor, fontWeight: 800, textTransform: 'uppercase' }}>
                {item.badge}
              </span>
              <h4 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: '6px 0 4px' }}>
                {item.tier}
              </h4>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>
                Duration: <strong style={{ color: '#e2e8f0' }}>{item.duration}</strong> • {item.audience}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '28px', fontWeight: 900, color: '#fff' }}>
                  {formatPrice(item.price_usd)}
                </span>
                <span style={{ fontSize: '11.5px', color: '#10b981', fontWeight: 800 }}>
                  {item.deposit_pct}% Escrow Deposit
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700, marginBottom: '14px' }}>
                or {Number(item.credits || item.price_usd * 10).toLocaleString()} TM Credits
              </div>

              <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 10px' }}>
                {item.deliverables}
              </p>
              <div style={{ fontSize: '11.5px', color: '#94a3b8', background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '3px', marginBottom: '16px' }}>
                <strong style={{ color: '#e2e8f0' }}>Hospitality &amp; Travel:</strong> {item.hospitality}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSelectTier && handleSelectTier(item)}
              style={{
                width: '100%',
                padding: '10px',
                background: item.is_popular ? accentColor : 'rgba(255,255,255,0.07)',
                color: item.is_popular ? '#060813' : '#fff',
                border: item.is_popular ? 'none' : `1px solid ${accentColor}55`,
                borderRadius: '3px',
                fontSize: '12.5px',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              Book DJ with This Package &rarr;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DjGigBookingSection({
  djName = 'Verified DJ',
  djSlug = 'dj',
  selectedTier: selectedTierProp = null,
  selectedInitialTier = null,
  rateCard,
  formatPrice = (v) => `$${v}`,
  accentColor = '#00f2fe'
}) {
  const selectedTier = selectedTierProp || selectedInitialTier;
  const activeRates = pickEditable(rateCard, CANONICAL_DJ_RATE_CARD);
  const [packageId, setPackageId] = useState(selectedTier?.id || activeRates[0].id);
  const [promoterName, setPromoterName] = useState('');
  const [promoterEmail, setPromoterEmail] = useState('');
  const [promoterPhone, setPromoterPhone] = useState('');
  const [venueName, setVenueName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [setDuration, setSetDuration] = useState('2 Hours (120 Mins)');
  const [crowdCapacity, setCrowdCapacity] = useState('500 - 1,500');
  const [settlementMode, setSettlementMode] = useState('escrow_mpesa');
  const [notes, setNotes] = useState('');
  const [addonCdj, setAddonCdj] = useState(true);
  const [addonTravel, setAddonTravel] = useState(false);
  const [addonRecording, setAddonRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  useEffect(() => {
    if (selectedTier?.id) {
      setPackageId(selectedTier.id);
      if (selectedTier.duration) setSetDuration(selectedTier.duration);
    }
  }, [selectedTier]);

  const activePackage = activeRates.find((r) => r.id === packageId) || activeRates[0];
  const baseFeeUsd = activePackage.price_usd + (addonTravel ? 350 : 0) + (addonRecording ? 200 : 0);
  const depositUsd = Math.round(baseFeeUsd * (activePackage.deposit_pct / 100));

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!promoterName.trim() || !promoterEmail.trim() || !venueName.trim()) return;
    setSubmitting(true);
    const certId = `TM-DJBK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: promoterName.trim(),
          email: promoterEmail.trim(),
          inquiry_type: 'dj_gig_booking',
          event_date: eventDate || 'TBD 2026',
          budget: `${formatPrice(baseFeeUsd)} (${activePackage.tier})`,
          creator_username: djSlug,
          creator_name: djName,
          message: `DJ Gig Booking [${certId}] — Package: ${activePackage.tier} | Venue: ${venueName} | Duration: ${setDuration} | Capacity: ${crowdCapacity} | Phone: ${promoterPhone} | Settlement: ${settlementMode} | Notes: ${notes}`
        })
      });
    } catch (_) {}
    setSubmitting(false);
    setBookingConfirmed({
      certId,
      djName,
      packageTitle: activePackage.tier,
      venueName,
      eventDate: eventDate || 'Upcoming 2026 Date',
      totalFee: formatPrice(baseFeeUsd),
      escrowDeposit: formatPrice(depositUsd),
      promoterName,
      promoterEmail
    });
  };

  return (
    <div style={{ padding: '20px 0' }} data-testid="dj-epk-gig-booking-section">
      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '11px', color: accentColor, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Direct DJ Gig Booking &amp; TuneLedger Escrow Desk
        </span>
        <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '6px 0 8px' }}>
          Book {djName} for Club Nights, Festivals, Corporate &amp; Private Gigs
        </h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, maxWidth: '760px' }}>
          Select a rate card package, specify your venue and technical requirements, and lock your date via TuneLedger 50% Escrow or direct Smart CRM offer.
        </p>
      </div>

      {bookingConfirmed ? (
        <div
          data-testid="dj-gig-booking-confirmation"
          style={{
            background: '#0a0e20',
            border: `2px solid ${accentColor}`,
            borderRadius: '4px',
            padding: '28px',
            maxWidth: '680px'
          }}
        >
          <div style={{ display: 'inline-block', background: '#10b981', color: '#060813', fontWeight: 900, fontSize: '11px', padding: '3px 10px', borderRadius: '3px', marginBottom: '10px' }}>
            ✓ GIG BOOKING &amp; ESCROW LOGGED • {bookingConfirmed.certId}
          </div>
          <h4 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>
            Booking Request Confirmed for {bookingConfirmed.djName}
          </h4>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.55, margin: '0 0 16px' }}>
            Thank you, <strong>{bookingConfirmed.promoterName}</strong>. Your booking for <strong>{bookingConfirmed.packageTitle}</strong> at <strong>{bookingConfirmed.venueName}</strong> ({bookingConfirmed.eventDate}) has been routed to {bookingConfirmed.djName}&apos;s Smart CRM &amp; TuneBooking Escrow Desk.
          </p>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '14px', fontSize: '12.5px', color: '#e2e8f0', marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span>Total Performance Fee:</span>
              <strong>{bookingConfirmed.totalFee}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: accentColor }}>
              <span>50% TuneLedger Escrow Hold:</span>
              <strong>{bookingConfirmed.escrowDeposit}</strong>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setBookingConfirmed(null)}
            style={{ padding: '10px 18px', background: accentColor, color: '#060813', border: 'none', borderRadius: '3px', fontWeight: 900, cursor: 'pointer' }}
          >
            Submit Another Gig Inquiry
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmitBooking}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            background: '#0a0e20',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            padding: '28px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                1. Select Rate Card Gig Package *
              </label>
              <select
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', background: '#050811', border: `1px solid ${accentColor}66`, borderRadius: '3px', color: '#fff', fontSize: '13px', fontWeight: 700 }}
              >
                {activeRates.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.tier} — {formatPrice(r.price_usd)} ({r.duration})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                  Promoter / Talent Buyer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kevin Ochieng"
                  value={promoterName}
                  onChange={(e) => setPromoterName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: '#050811', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '3px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                  Official Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="talent@festival.com"
                  value={promoterEmail}
                  onChange={(e) => setPromoterEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: '#050811', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '3px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                  Venue / Festival &amp; City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alchemist, Nairobi"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: '#050811', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '3px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                  Event Date *
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: '#050811', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '3px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                  Requested Set Duration
                </label>
                <select
                  value={setDuration}
                  onChange={(e) => setSetDuration(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: '#050811', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '3px', color: '#fff' }}
                >
                  <option value="90 Mins Peak Set">90 Mins Peak Set</option>
                  <option value="2 Hours (120 Mins)">2 Hours (120 Mins)</option>
                  <option value="3 Hours Extended Set">3 Hours Extended Set</option>
                  <option value="4 Hours Open-to-Close">4 Hours Open-to-Close</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                  WhatsApp / Direct Phone
                </label>
                <input
                  type="text"
                  placeholder="+254 700 000 000"
                  value={promoterPhone}
                  onChange={(e) => setPromoterPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: '#050811', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '3px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#cbd5e1', marginBottom: '8px' }}>
                2. Technical &amp; Hospitality Rider Confirmations
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: '#e2e8f0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={addonCdj} onChange={(e) => setAddonCdj(e.target.checked)} />
                  <span>Venue provides 3x Pioneer CDJ-3000 + DJM-A9 Booth Rider (Included)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={addonTravel} onChange={(e) => setAddonTravel(e.target.checked)} />
                  <span>Add Regional Flight &amp; 4-Star Hotel Hospitality Package (+{formatPrice(350)})</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={addonRecording} onChange={(e) => setAddonRecording(e.target.checked)} />
                  <span>Include Cleared Multi-Cam 4K Set Recording &amp; TuneStream Release (+{formatPrice(200)})</span>
                </label>
              </div>

              <div style={{ marginTop: '12px' }}>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                  Event Brief &amp; Set Times
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe lineup, set time (e.g. 01:00 - 03:00 AM), and any brand deliverables..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', background: '#050811', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '3px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ background: 'rgba(0,242,254,0.06)', border: `1px solid ${accentColor}44`, borderRadius: '4px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1', marginBottom: '4px' }}>
                <span>Estimated Total Performance Fee:</span>
                <strong style={{ color: '#fff', fontSize: '16px' }}>{formatPrice(baseFeeUsd)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: accentColor, marginBottom: '12px' }}>
                <span>50% Escrow Deposit to Lock Date:</span>
                <strong>{formatPrice(depositUsd)}</strong>
              </div>
              <button
                type="submit"
                disabled={submitting}
                data-testid="submit-dj-gig-booking-btn"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: accentColor,
                  color: '#060813',
                  border: 'none',
                  borderRadius: '3px',
                  fontSize: '13px',
                  fontWeight: 900,
                  cursor: submitting ? 'wait' : 'pointer'
                }}
              >
                {submitting ? 'Routing Gig Booking to Escrow...' : `Book ${djName} & Lock Date (${formatPrice(depositUsd)} Escrow)`}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export function DjTechRiderSection({
  djName = 'Verified DJ',
  formatPrice = (v) => `$${v}`,
  accentColor = '#f59e0b',
  techRider,
  rateCard,
  bookingEmail,
  onDownloadRider
}) {
  const consoleSpecs = pickEditable(techRider?.console, CANONICAL_DJ_TECH_RIDER.console);
  const monitoringSpecs = pickEditable(techRider?.monitoring, CANONICAL_DJ_TECH_RIDER.monitoring);
  const handleDownload = () => {
    if (onDownloadRider) onDownloadRider();
    else generateAndDownloadDjRateCard(djName, pickEditable(rateCard, CANONICAL_DJ_RATE_CARD), formatPrice, bookingEmail);
  };
  const renderList = (items) => (
    <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '13px', lineHeight: 1.8 }}>
      {items.map((it, i) => (
        <li key={i}><strong>{it.label}:</strong> {it.value}</li>
      ))}
    </ul>
  );
  return (
    <div style={{ padding: '20px 0' }} data-testid="dj-epk-tech-rider-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <span style={{ fontSize: '11px', color: accentColor, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Technical Specifications &amp; Stage Plot
          </span>
          <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '6px 0 8px' }}>
            DJ Booth Stage Specs, Hardware Rider &amp; Monitor Levels
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            {techRider?.notes || 'Mandatory sound reinforcement and console requirements for club residencies and festival mainstage appearances.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          style={{
            padding: '9px 16px',
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${accentColor}`,
            color: accentColor,
            borderRadius: '3px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RiDownloadFill /> Download Tech Rider &amp; Rate Card
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#0a0e20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '24px' }}>
          <h4 style={{ fontSize: '16px', color: '#fff', fontWeight: 800, margin: '0 0 14px' }}>Console &amp; Media Players</h4>
          {renderList(consoleSpecs)}
        </div>

        <div style={{ background: '#0a0e20', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '24px' }}>
          <h4 style={{ fontSize: '16px', color: '#fff', fontWeight: 800, margin: '0 0 14px' }}>Monitoring &amp; Stage Sound</h4>
          {renderList(monitoringSpecs)}
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// 3. PRODUCER EPK SECTIONS
// ==============================================================================
export function ProducerBeatStoreSection({ formatPrice = (v) => `$${v}`, onPlayBeat, accentColor = '#ec4899', beats, onNotify }) {
  const [selectedLicense, setSelectedLicense] = useState(null);
  const sampleBeats = pickEditable(beats, CANONICAL_PRODUCER_BEATS);

  return (
    <div style={{ padding: '20px 0' }} data-testid="producer-epk-beat-store">
      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '11px', color: accentColor, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Lossless Beat Catalog &amp; Stem Licensing
        </span>
        <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '6px 0 8px' }}>
          Instant Beat Store, 24-Bit Stem Packages &amp; Split Cascade Buyouts
        </h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
          Every instrumental is delivered with 24-bit uncompressed WAV stems and automatic 50/50 publishing split registration.
        </p>
      </div>

      {selectedLicense && (
        <div style={{ marginBottom: '18px', padding: '14px 18px', background: 'rgba(16,185,129,0.14)', border: '1px solid #10b981', borderRadius: '4px', color: '#ecfdf5', fontSize: '13px' }}>
          ✓ License contract generated for <strong>{selectedLicense.beat.title}</strong> ({selectedLicense.tier} — {formatPrice(selectedLicense.price)}). Split Cascade registered at 50% Writer / 50% Producer.
        </div>
      )}

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                type="button"
                onClick={() => onPlayBeat && onPlayBeat({ id: b.id, title: b.title, audioUrl: b.audioUrl, isrc: `KE-PRD-26-00${b.id}` })}
                style={{ width: '40px', height: '40px', borderRadius: '3px', background: accentColor, color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <RiPlayFill size={18} />
              </button>
              <div>
                <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
                  {b.title}
                </h4>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  <strong style={{ color: accentColor }}>{b.bpm} BPM</strong> • Key: {b.key} • 24-Bit / 96kHz Master Stems Included
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => { setSelectedLicense({ beat: b, tier: 'MP3 Lease', price: b.leaseUsd }); onNotify && onNotify(`MP3 Lease contract generated for ${b.title}`); }}
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
                onClick={() => setSelectedLicense({ beat: b, tier: '24-Bit WAV Stems', price: b.stemsUsd })}
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
                onClick={() => setSelectedLicense({ beat: b, tier: 'Exclusive Buyout', price: b.buyoutUsd })}
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
// 4. RECORD LABEL & PUBLISHER EPK SECTIONS
// ==============================================================================
export function LabelRosterSection({ accentColor = '#a855f7', roster: rosterProp, onRequestBlanketLicense }) {
  const roster = pickEditable(rosterProp, CANONICAL_LABEL_ROSTER);

  return (
    <div style={{ padding: '20px 0' }} data-testid="label-epk-roster-section">
      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '11px', color: accentColor, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Signed Artists, Producers &amp; Resident DJs
        </span>
        <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '6px 0 8px' }}>
          Official Roster &amp; One-Stop Sync Catalog
        </h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
          Managed and distributed on the TuneMavens Split Cascade network with global DDEX DSP syndication and instant sync clearance.
        </p>
        {onRequestBlanketLicense && (
          <button
            type="button"
            onClick={onRequestBlanketLicense}
            style={{ marginTop: '14px', padding: '9px 16px', background: accentColor, color: '#060813', border: 'none', borderRadius: '3px', fontSize: '12px', fontWeight: 900, cursor: 'pointer' }}
          >
            Request Blanket Sync License &rarr;
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
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
              <span style={{ fontSize: '10px', fontWeight: 800, color: accentColor, background: `${accentColor}22`, padding: '2px 7px', borderRadius: '3px', textTransform: 'uppercase' }}>
                {art.persona} EPK
              </span>
              <h4 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: '6px 0 2px' }}>{art.name}</h4>
              <div style={{ fontSize: '12px', color: accentColor, fontWeight: 700 }}>{art.genre}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{art.listeners} • Split Cascade Verified</div>
            </div>
            <a
              href={`#/epk/${art.slug}?persona=${art.persona}`}
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
              Inspect {(art.persona || 'artist').toUpperCase()} EPK &rarr;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
