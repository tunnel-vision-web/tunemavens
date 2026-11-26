import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  RiMailSendFill,
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiSendPlaneFill,
  RiRefreshLine,
  RiCalendarEventFill,
  RiCheckLine,
  RiCloseFill,
  RiUserAddLine,
  RiLinksLine,
  RiUpload2Line,
  RiDownload2Line,
  RiSparkling2Fill,
  RiBrainLine,
  RiShieldUserFill,
  RiEyeLine,
  RiFlashlightFill,
  RiLightbulbFlashFill,
  RiImage2Fill,
  RiDatabase2Fill,
  RiBold,
  RiItalic,
  RiUnderline,
  RiStrikethrough,
  RiListUnordered,
  RiListOrdered,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiLink,
  RiCodeSSlashLine,
  RiImageAddLine,
  RiSeparator,
  RiDoubleQuotesL,
  RiFormatClear,
  RiLayoutColumnLine,
  RiCheckboxCircleFill,
} from 'react-icons/ri'
import { API_BASE, tokenStore } from '../lib/api.js'
import { AUTHORITATIVE_EVENTS } from '../data/authoritativeEvents.js'

const PERSONA_VISUAL_BANNERS = {
  all: '/headers/discography_retina_header.jpg',
  creator: '/headers/header_aisha_custom.jpg',
  dj: '/headers/header_djkalonje_custom.jpg',
  label: '/headers/header_intermavenpub_custom.jpg',
  podcaster: '/headers/header_brian_custom.jpg',
  supervisor: '/headers/header_ndufo_custom.jpg',
  corporate: '/headers/header_nairobicyber_custom.jpg',
  media_house: '/headers/header_kiprono_custom.jpg',
  vc: '/headers/header_tours.png',
  affiliate: '/headers/header_pricing.png',
  consumer: '/heroes/hero_music_1.png',
}

const PRODUCT_THEMES = [
  {
    key: 'tunestream',
    name: 'TuneStream 24-Bit Lossless Streaming',
    banner: '/heroes/hero_music_2.png',
    cta_label: 'Stream 24-Bit Lossless on TuneStream',
    cta_url: '/stream',
  },
  {
    key: 'syncmavens',
    name: 'SyncMavens One-Stop Sync Licensing Hub',
    banner: '/headers/header_ndufo_custom.jpg',
    cta_label: 'Explore SyncMavens Briefs & Stems',
    cta_url: '/for/supervisor',
  },
  {
    key: 'epk_worlds',
    name: 'Official EPK Web Worlds & Booking Vault',
    banner: '/headers/header_aisha_custom.jpg',
    cta_label: 'Launch Your Official EPK Web World',
    cta_url: '/epk',
  },
  {
    key: 'dj_pool',
    name: '24-Bit DJ Pool & Legal Mix Clearance',
    banner: '/headers/header_djkalonje_custom.jpg',
    cta_label: 'Unlock 24-Bit DJ Pool & Mix Engine',
    cta_url: '/for/dj',
  },
  {
    key: 'tuneledger',
    name: 'TuneLedger Automated Split Cascades',
    banner: '/headers/header_intermavenpub_custom.jpg',
    cta_label: 'Configure Automated Split Cascades',
    cta_url: '/for/label',
  },
  {
    key: 'corporate_ads',
    name: 'Corporate Brand Audio Ad Flights',
    banner: '/headers/header_nairobicyber_custom.jpg',
    cta_label: 'Launch Brand Audio Ad Flights',
    cta_url: '/for/corporate',
  },
  {
    key: 'tour_capital',
    name: 'Tour Capital & Catalogue Royalty Vault',
    banner: '/headers/header_tours.png',
    cta_label: 'Explore Tour Capital & Royalty Deals',
    cta_url: '/for/vc',
  },
  {
    key: 'partner_network',
    name: 'TuneMavens 3%–12% Partner Programme',
    banner: '/headers/header_pricing.png',
    cta_label: 'Claim Partner Code & Earn 3%–12%',
    cta_url: '/affiliates',
  },
]

const BUILTIN_PERSONA_PLAYBOOKS = {
  creator: {
    persona: 'creator',
    label: 'Recording Artist, Songwriter & Producer',
    supports_epk: true,
    supports_catalog: true,
    default_subject: '{{name}}, Launch Your Official TuneMavens EPK & Ingest Your Catalogue (90% Sync Payouts)',
    subject_variants: [
      '{{name}}, Claim Your Official EPK Web World & Pre-Clear Your Stems for Global Sync',
      'Welcome {{name}} — Keep 100% Publishing & Stream in 24-Bit Lossless on TuneMavens',
    ],
    default_body:
      "Hi {{name}},\n\nWe'd love to welcome you to TuneMavens — the unified operating system built for African and diaspora artists, songwriters, and producers.\n\nIn minutes you can:\n• Build your official Creator EPK Web World with custom subdomain, press kit, and tour calendar\n• Ingest your singles, albums, and multitrack stems with automated TuneLedger split cascades\n• Pitch pre-cleared cues on SyncMavens (90% direct creator payout, 100% publishing retained) and sell lossless masters on TuneStream",
    highlights: [
      'Official Creator EPK Web World with live booking & press vault',
      '1-click single, album & multitrack stem ingestion with TuneLedger split cascades',
      '90% direct sync placement payouts + 24-bit lossless TuneStream royalties',
    ],
    cta_label: 'Onboard, Build EPK & Ingest Catalogue',
    cta_url: '/for/creator',
  },
  dj: {
    persona: 'dj',
    label: 'DJ & Mix Curator',
    supports_epk: true,
    supports_catalog: true,
    default_subject: '{{name}}, Monetize Your DJ Mixes Legally & Launch Your Official DJ EPK',
    subject_variants: ['{{name}}, Unlock the 24-Bit DJ Pool & Sell Cleared Mixes on TuneStream'],
    default_body:
      "Hi {{name}},\n\nYou're invited to join TuneMavens as an Official DJ & Curator.\n\nHere's what unlocks immediately when you onboard:\n• Launch your DJ Press Kit (EPK) for festival, club, and corporate bookings\n• Ingest your DJ mixes with automated tracklist rights clearance so you can legally sell lossless downloads\n• Download club-ready 24-bit WAV/FLAC promos and stems from the TuneMavens DJ Pool",
    highlights: [
      'Official DJ EPK with live set showcase & festival booking rider',
      'Legal DJ Mix monetization with automated TuneLedger artist split clearance',
      'Exclusive 24-bit WAV/FLAC DJ Pool club promos & acapella stems',
    ],
    cta_label: 'Onboard, Launch DJ EPK & Upload Mixes',
    cta_url: '/for/dj',
  },
  label: {
    persona: 'label',
    label: 'Record Label & Distributor',
    supports_epk: true,
    supports_catalog: true,
    default_subject: '{{name}}, Bulk-Ingest Your Label Roster Catalogue & Automate Split Cascades',
    subject_variants: ['{{name}}, Modernize Your Label Operations: Bulk CSV/ZIP Ingest & Roster EPKs'],
    default_body:
      'Hello {{name}},\n\nTuneMavens gives independent record labels and distributors enterprise-grade catalogue, sync, and royalty infrastructure:\n\n• Bulk-ingest your entire back catalogue & stems via CSV/ZIP wizard in minutes\n• Provision official EPK Web Worlds for every artist on your roster\n• Automate transparent recoupment waterfalls and multi-party TuneLedger split cascades',
    highlights: [
      'Bulk CSV/ZIP back-catalogue & multitrack stem ingestion engine',
      'Unified multi-artist EPK studio & label roster seat governance',
      'Automated recoupment waterfalls & instant M-Pesa / Stripe split cascades',
    ],
    cta_label: 'Onboard Label & Bulk-Ingest Catalogue',
    cta_url: '/for/label',
  },
  podcaster: {
    persona: 'podcaster',
    label: 'Podcaster & Show Host',
    supports_epk: true,
    supports_catalog: true,
    default_subject: '{{name}}, Launch Your Show EPK, Ingest Episodes & Unlock Brand Audio Sponsorships',
    subject_variants: ['{{name}}, Monetize Your Podcast with Direct Corporate Ad Flights on TuneMavens'],
    default_body:
      'Hi {{name}},\n\nBring your podcast into the TuneMavens audio ecosystem:\n\n• Create an official Show EPK to attract guests, syndicators, and corporate sponsors\n• Ingest episodes with broadcast-ready -16 LUFS mastering\n• Opt into automated Corporate Brand Ad Flights and listener micro-tipping',
    highlights: [
      'Official Podcast Show EPK & guest booking workflow',
      'Broadcast-standard -16 LUFS episode ingestion & licensed intro/outro beds',
      'Automated Corporate Brand Audio Ad Flights & fan micro-tipping',
    ],
    cta_label: 'Launch Show EPK & Ingest Episodes',
    cta_url: '/for/podcaster',
  },
  supervisor: {
    persona: 'supervisor',
    label: 'Music Supervisor, Film/TV & Sync Buyer',
    supports_epk: false,
    supports_catalog: false,
    default_subject: '{{name}}, Complimentary VIP Supervisor Access: One-Stop Pre-Cleared Stems',
    subject_variants: ['{{name}}, Clear Broadcast & Film Cues in Minutes on SyncMavens (Zero Fees)'],
    default_body:
      'Dear {{name}},\n\nAs a Music Supervisor or Licensing Executive, your TuneMavens account is permanently credit-exempt.\n\n• Post confidential sync briefs and receive AI-matched, one-stop pre-cleared masters & isolated stems\n• Download 24-bit WAV stems with verified chain-of-title and instant SHA-256 license execution',
    highlights: [
      '100% credit-exempt VIP Music Supervisor desk',
      'One-stop pre-cleared African & diaspora masters + isolated 24-bit WAV stems',
      'Instant SHA-256 chain-of-title certificate & escrow-backed clearance',
    ],
    cta_label: 'Activate VIP Supervisor Desk',
    cta_url: '/for/supervisor',
  },
  corporate: {
    persona: 'corporate',
    label: 'Corporate Brand & Ad Agency',
    supports_epk: false,
    supports_catalog: false,
    default_subject: '{{name}}, Reach Engaged Music & Podcast Audiences with TuneMavens Brand Audio Flights',
    subject_variants: [],
    default_body:
      'Hello {{name}},\n\nConnect your brand with high-intent listeners across East Africa and the global diaspora on TuneMavens:\n\n• Launch targeted audio ad flights across TuneStream music channels and top regional podcasts\n• License pre-cleared commercial sync tracks directly from verified creators',
    highlights: [
      'Targeted programmatic audio ad flights across music & top podcasts',
      'Direct commercial sync & sonic branding licensing with zero clearance risk',
      'Real-time impression, completion & tour sponsorship ROI telemetry',
    ],
    cta_label: 'Onboard Brand & View Ad Rates',
    cta_url: '/for/corporate',
  },
  media_house: {
    persona: 'media_house',
    label: 'Radio, TV & Broadcast Media House',
    supports_epk: false,
    supports_catalog: true,
    default_subject: '{{name}}, Automate Broadcast Music Servicing & PRO Cue Sheets on TuneMavens',
    subject_variants: [],
    default_body:
      'Hello {{name}},\n\nStreamline broadcast music acquisition and compliance with TuneMavens Media House Operations:\n\n• Receive broadcast-ready clean masters and syndicated shows directly into your station crate\n• Automate PRO cue sheet logging and commercial ad traffic scheduling',
    highlights: [
      'Direct clean broadcast WAV servicing & syndicated show delivery',
      'Automated PRO cue sheet logging & broadcast compliance exports',
      'Station commercial ad traffic & regional talent desk',
    ],
    cta_label: 'Activate Broadcast Media Desk',
    cta_url: '/for/media-house',
  },
  vc: {
    persona: 'vc',
    label: 'Tour Venture Capital & Catalogue Investor',
    supports_epk: false,
    supports_catalog: false,
    default_subject: '{{name}}, Institutional LP Invitation: Tour Capital Vault & Catalogue Royalty Yields',
    subject_variants: [],
    default_body:
      'Dear {{name}},\n\nYou are invited to access the TuneMavens Tour Capital & Catalogue Acquisition Vault (permanently credit-exempt for Institutional LPs):\n\n• Review live streaming, ticketing, and superfan geo-demand telemetry before underwriting tours or catalogue acquisitions\n• Automated priority recoupment via TuneLedger smart split cascades',
    highlights: [
      'Permanently credit-exempt Institutional LP & Syndicate deal room',
      'Verified box-office, streaming & geo-demand diligence telemetry',
      'Senior-priority automated recoupment via TuneLedger split cascades',
    ],
    cta_label: 'Activate Institutional LP Access',
    cta_url: '/for/vc',
  },
  affiliate: {
    persona: 'affiliate',
    label: 'Affiliate Partner, Curator & Influencer',
    supports_epk: false,
    supports_catalog: false,
    default_subject: '{{name}}, Earn 3%–12% Recurring Ecosystem Commissions as a TuneMavens Partner',
    subject_variants: [],
    default_body:
      'Hi {{name}},\n\nTurn your cultural influence and industry network into recurring revenue with the TuneMavens Partner Programme:\n\n• Claim your unique 90-day tracking code and Smart CRM email reachout suite\n• Earn 3% to 12% across ticket sales, creator credit reloads, lossless albums, stems, and sync placements',
    highlights: [
      '3%–12% recurring multi-stream commissions with 90-day attribution',
      'Private Smart CRM email reachout workspace & live conversion ledger',
      'Instant M-Pesa, Stripe & Unified Credits payouts',
    ],
    cta_label: 'Join Partner Programme & Claim Code',
    cta_url: '/affiliates',
  },
  consumer: {
    persona: 'consumer',
    label: 'Audiophile Listener & Live Music Fan',
    supports_epk: false,
    supports_catalog: false,
    default_subject: '{{name}}, Stream 24-Bit Lossless African Music & Unlock Priority Concert Passes',
    subject_variants: [],
    default_body:
      'Hey {{name}},\n\nExperience music the way artists intended on TuneStream & TuneMavens:\n\n• Stream authentic African & diaspora singles, albums, and DJ mixes in crystal-clear audio\n• Save your favorite genres, artists, and city for priority concert RSVPs and digital QR passes',
    highlights: [
      'Uncompressed 24-bit / 96kHz FLAC streaming & curated DJ mixes',
      'Priority live concert RSVPs & instant digital QR ticket passes',
      '1-tap direct artist micro-tipping with zero subscription lock-in',
    ],
    cta_label: 'Join Free & Save Music Preferences',
    cta_url: '/for/consumer',
  },
}

const PERSONA_EVENT_ANGLES = {
  all: {
    subjectPrefix: "You're Invited",
    hook: 'Join artists, DJs, industry executives, and live music fans for an unforgettable TuneMavens showcase.',
    bullets: [
      'Confirm your complimentary RSVP or lock in your digital QR pass in seconds',
      'Experience live performances, exclusive premieres, and ecosystem networking',
    ],
  },
  creator: {
    subjectPrefix: 'Creator & Backstage Showcase Invite',
    hook: 'Connect live with music supervisors, label A&Rs, and fellow recording artists & producers at this flagship showcase.',
    bullets: [
      'Network directly with sync buyers, producers, and touring partners on site',
      'Link your Official Creator EPK & latest stems ahead of the showcase',
    ],
  },
  dj: {
    subjectPrefix: 'Official DJ & Curator VIP Pass',
    hook: 'Step inside the booth & curator lounge — built for club, festival, and radio DJs shaping the sound.',
    bullets: [
      'VIP Curator & DJ networking access + exclusive 24-bit promo crate drop',
      'Confirm your DJ RSVP or secure priority hospitality passes below',
    ],
  },
  label: {
    subjectPrefix: 'Executive Label & A&R Invitation',
    hook: 'Scout breakout regional talent and connect with distribution, publishing, and sync executives live.',
    bullets: [
      'Executive A&R & label hospitality access for your management team',
      'Preview live-tested catalogue cues and tour co-investment showcases',
    ],
  },
  podcaster: {
    subjectPrefix: 'Media & Podcaster Press Lounge Invite',
    hook: 'Capture live artist interviews, backstage stories, and sponsor connections from the official Media & Podcast Lounge.',
    bullets: [
      'Priority Media / Podcaster RSVP for backstage artist & founder segments',
      'Meet corporate brand sponsors funding regional audio ad flights',
    ],
  },
  supervisor: {
    subjectPrefix: 'Complimentary VIP Sync & Supervisor Pass',
    hook: 'Audition live showcase sets from pre-cleared African & diaspora talent with one-stop master & publishing rights.',
    bullets: [
      'Complimentary VIP Music Supervisor hospitality & artist meet-and-greet',
      'Instant access to 24-bit multitrack stems for every showcased catalogue track',
    ],
  },
  corporate: {
    subjectPrefix: 'Brand Sponsorship & VIP Hospitality Invite',
    hook: 'Experience high-energy cultural engagement firsthand and explore live tour & audio ad sponsorship activations.',
    bullets: [
      'VIP Brand & Agency hospitality passes for your marketing leadership',
      'See live fan telemetry, QR ticketing velocity, and sonic brand integrations',
    ],
  },
  media_house: {
    subjectPrefix: 'Broadcast & Press Accreditation Invite',
    hook: 'Secure priority broadcast coverage, clean live audio feeds, and exclusive artist Press Kit access.',
    bullets: [
      'Accredited Radio, TV & Press RSVP with direct EPK media kit access',
      'Automated PRO cue sheets and broadcast-ready masters available post-show',
    ],
  },
  vc: {
    subjectPrefix: 'Institutional LP & Tour Diligence Invite',
    hook: 'Observe live box-office velocity, TunePay QR settlement, and audience demand firsthand from the VIP Investor Suite.',
    bullets: [
      'Complimentary Institutional LP & Syndicate VIP lounge accreditation',
      'Review real-time ticketing & merch conversion telemetry with the founders',
    ],
  },
  affiliate: {
    subjectPrefix: 'Partner & Influencer VIP Access + 10% Ticket Commissions',
    hook: 'Attend live as an official TuneMavens Partner AND earn 10%–12% commissions on every ticket sold through your link.',
    bullets: [
      'Confirm your Partner RSVP or grab VIP passes below',
      'Share your tracked 90-day partner code to earn instant ticket commissions',
    ],
  },
  consumer: {
    subjectPrefix: 'Priority Fan Pass & Live RSVP',
    hook: 'Experience electrifying live music with instant QR entry passes and M-Pesa / Card express checkout.',
    bullets: [
      'Reserve your spot or unlock VIP & Early-Bird digital QR passes in one tap',
      'Save your favorite genres & city for priority alerts on upcoming shows',
    ],
  },
}

const PERSONA_PRODUCT_ANGLES = {
  all: 'Built for every corner of the music & live entertainment ecosystem — from studio creation and 24-bit streaming to sync licensing and live tours.',
  creator: 'Tailored for Recording Artists, Songwriters & Producers so you retain 100% publishing, showcase your EPK, and monetize every master and stem.',
  dj: 'Engineered for DJs & Mix Curators to access club-ready 24-bit WAV promos and legally monetize mixes with automated rights splits.',
  label: 'Designed for Record Labels & Distributors managing multi-artist catalogues, recoupment waterfalls, and automated TuneLedger split cascades.',
  podcaster: 'Built for Podcasters & Show Hosts to publish -16 LUFS episodes, grow audience reach, and monetize via Corporate Brand Audio Flights.',
  supervisor: 'Permanently credit-exempt for Music Supervisors seeking instant SHA-256 sync licensing and one-stop pre-cleared 24-bit WAV stems.',
  corporate: 'Built for Corporate Brands & Agencies launching targeted audio ad flights and commissioning authentic commercial sync music.',
  media_house: 'Tailored for Broadcast Media Houses automating clean master servicing, syndicated show intake, and PRO cue sheet compliance.',
  vc: 'Structured for Tour VCs & Catalogue Investors underwriting data-verified tours and royalty-yielding music catalogues.',
  affiliate: 'Powered by 90-day attribution cookies so Affiliate Partners & Curators earn 3%–12% recurring commissions across every conversion.',
  consumer: 'Crafted for Audiophile Listeners & Live Music Fans who demand crystal-clear 24-bit audio, direct artist tipping, and instant concert passes.',
}

const HTML_DETECT_RE = /<(?:p|div|br|img|h[1-6]|ul|ol|li|strong|b|em|i|u|s|span|a|blockquote|hr|table|tr|td|th)\b/i

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function toVisualHtml(raw) {
  const s = String(raw || '')
  if (!s.trim()) return ''
  if (HTML_DETECT_RE.test(s)) return s
  return s
    .split(/\n{2,}/)
    .map(para => `<p style="margin: 0 0 12px 0;">${escapeHtml(para).replace(/\n/g, '<br />')}</p>`)
    .join('\n')
}

function hasMeaningfulBody(raw) {
  const s = String(raw || '').trim()
  if (!s) return false
  if (/<img\b/i.test(s)) return true
  const textOnly = s.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim()
  return textOnly.length > 0
}

function inferPersonaFromGroup(group) {
  if (!group) return null
  if (group.system_key === 'sys_all_users') return 'all'
  if (group.persona && BUILTIN_PERSONA_PLAYBOOKS[group.persona]) return group.persona
  if (group.system_key && group.system_key.startsWith('sys_role_')) {
    const k = group.system_key.replace('sys_role_', '')
    if (BUILTIN_PERSONA_PLAYBOOKS[k]) return k
  }
  const hay = `${group.name || ''} ${group.description || ''}`.toLowerCase()
  if (/\bdjs?\b|curator/.test(hay)) return 'dj'
  if (/podcast/.test(hay)) return 'podcaster'
  if (/supervisor|sync/.test(hay)) return 'supervisor'
  if (/\blabels?\b|distro|roster/.test(hay)) return 'label'
  if (/\bvcs?\b|investor|capital/.test(hay)) return 'vc'
  if (/corporate|brand|agency|sponsor/.test(hay)) return 'corporate'
  if (/media house|broadcast|radio|tv/.test(hay)) return 'media_house'
  if (/affiliate|partner|influencer/.test(hay)) return 'affiliate'
  if (/listener|consumer|fan/.test(hay)) return 'consumer'
  if (/creator|artist|producer|songwriter/.test(hay)) return 'creator'
  return null
}

/**
 * Dynamically builds tailored Subject, Rich HTML Body (with embedded banner/flyer image),
 * and CTA configuration for ANY (Persona × Campaign Theme) combination.
 */
function composeDynamicCampaign({
  personaKey = 'creator',
  promoType = 'persona_intro',
  eventObj = null,
  productThemeKey = 'tunestream',
  customProductName = '',
  playbooks = BUILTIN_PERSONA_PLAYBOOKS,
}) {
  const isAll = personaKey === 'all'
  const pb = (!isAll && (playbooks[personaKey] || BUILTIN_PERSONA_PLAYBOOKS[personaKey])) || BUILTIN_PERSONA_PLAYBOOKS.creator
  const personaLabel = isAll ? 'All TuneMavens Members' : pb.label
  const personaBanner = PERSONA_VISUAL_BANNERS[personaKey] || PERSONA_VISUAL_BANNERS.creator

  // 1. LIVE EVENT INVITATION THEME
  if (promoType === 'event') {
    const ev = eventObj || AUTHORITATIVE_EVENTS?.[0] || {
      id: 'ev_default',
      title: 'TuneMavens Live Showcase',
      artist: 'Featured Roster Artists',
      venue: 'Nairobi Arena',
      city: 'Nairobi',
      date_display: 'Upcoming',
      image_url: '/headers/header_tours.png',
    }
    const angle = PERSONA_EVENT_ANGLES[personaKey] || PERSONA_EVENT_ANGLES.all
    const flyerSrc = ev.image_url || personaBanner
    const subject = `{{name}}, ${angle.subjectPrefix}: ${ev.title}`
    const bulletsHtml = angle.bullets.map(b => `<li style="margin-bottom: 6px; color: #e2e8f0;">${escapeHtml(b)}</li>`).join('')

    const body = `<div style="margin-bottom: 16px;">
  <img src="${flyerSrc}" alt="${escapeHtml(ev.title)} Official Event Poster" style="width: 100%; max-width: 100%; max-height: 280px; object-fit: cover; border-radius: 3px; display: block; border: 1px solid rgba(34,211,238,0.3);" />
</div>
<p style="margin: 0 0 12px 0;">Hi {{name}},</p>
<p style="margin: 0 0 12px 0;">${escapeHtml(angle.hook)}</p>
<div style="background: rgba(34,211,238,0.07); border: 1px solid rgba(34,211,238,0.28); border-radius: 3px; padding: 14px 16px; margin: 14px 0;">
  <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #22d3ee; margin-bottom: 4px;">
    LIVE EVENT INVITATION &bull; ${escapeHtml(personaLabel.toUpperCase())}
  </div>
  <div style="font-size: 17px; font-weight: 800; color: #ffffff; margin-bottom: 4px;">{{event_title}}</div>
  <div style="font-size: 13px; color: #94a3b8; margin-bottom: 10px;">
    Featuring <strong style="color: #ffffff;">${escapeHtml(ev.artist || 'TuneMavens Featured Lineup')}</strong> &bull; {{event_date}} &bull; {{event_venue}}${ev.city ? `, ${escapeHtml(ev.city)}` : ''}
  </div>
  <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.6;">
    ${bulletsHtml}
  </ul>
</div>
<p style="margin: 12px 0 0 0;">Use the action buttons below to confirm your RSVP or lock in your digital QR pass right away.</p>`

    return {
      subject,
      body,
      ctaLabel: ev.payment_mode === 'free_rsvp' ? 'Confirm My RSVP Now' : 'RSVP / Buy Ticket Pass',
      ctaUrl: `/events?event=${encodeURIComponent(ev.id || '')}`,
      includeEpk: Boolean(!isAll && pb.supports_epk),
      includeCatalog: Boolean(!isAll && pb.supports_catalog),
    }
  }

  // 2. ECOSYSTEM PRODUCT / SERVICE PROMOTION THEME
  if (promoType === 'product_service') {
    const themeObj = PRODUCT_THEMES.find(t => t.key === productThemeKey) || PRODUCT_THEMES[0]
    const prodTitle = (customProductName || '').trim() || themeObj.name
    const bannerSrc = themeObj.banner || personaBanner
    const personaPitch = PERSONA_PRODUCT_ANGLES[personaKey] || PERSONA_PRODUCT_ANGLES.all

    const subject = isAll
      ? `{{name}}, Experience ${prodTitle} on TuneMavens`
      : `{{name}}, Unlock ${prodTitle} — Tailored for ${pb.label}`

    const roleHighlights = isAll
      ? [
          'Uncompressed 24-bit lossless streaming, live QR concert passes & direct artist support',
          'Official EPK Web Worlds, multitrack stem ingestion & automated TuneLedger split cascades',
          'One-stop SyncMavens clearance, Corporate Audio Ad Flights & 3%–12% Partner commissions',
        ]
      : (pb.highlights || BUILTIN_PERSONA_PLAYBOOKS[personaKey]?.highlights || [])

    const highlightsHtml = roleHighlights
      .map(h => `<li style="margin-bottom: 6px; color: #e2e8f0;">${escapeHtml(h)}</li>`)
      .join('')

    const body = `<div style="margin-bottom: 16px;">
  <img src="${bannerSrc}" alt="${escapeHtml(prodTitle)}" style="width: 100%; max-width: 100%; max-height: 260px; object-fit: cover; border-radius: 3px; display: block; border: 1px solid rgba(34,211,238,0.28);" />
</div>
<p style="margin: 0 0 12px 0;">Hi {{name}},</p>
<p style="margin: 0 0 12px 0;">We are excited to spotlight <strong style="color: #22d3ee;">${escapeHtml(prodTitle)}</strong> inside the TuneMavens ecosystem.</p>
<p style="margin: 0 0 12px 0;">${escapeHtml(personaPitch)}</p>
<div style="background: rgba(168,85,247,0.08); border: 1px solid rgba(168,85,247,0.3); border-radius: 3px; padding: 14px 16px; margin: 14px 0;">
  <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #c084fc; margin-bottom: 6px;">
    KEY ECOSYSTEM ADVANTAGES FOR ${escapeHtml(personaLabel.toUpperCase())}
  </div>
  <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.6;">
    ${highlightsHtml}
  </ul>
</div>
<p style="margin: 12px 0 0 0;">Click the buttons below to jump right in and save your preferences for instant 1-tap access next time.</p>`

    return {
      subject,
      body,
      ctaLabel: isAll ? themeObj.cta_label : (customProductName.trim() ? `Explore ${prodTitle}` : themeObj.cta_label),
      ctaUrl: isAll ? themeObj.cta_url : (themeObj.cta_url || pb.cta_url),
      includeEpk: Boolean(!isAll && pb.supports_epk),
      includeCatalog: Boolean(!isAll && pb.supports_catalog),
    }
  }

  // 3. PERSONA INTRODUCTORY & ONBOARDING THEME (DEFAULT)
  if (isAll) {
    const body = `<div style="margin-bottom: 16px;">
  <img src="${PERSONA_VISUAL_BANNERS.all}" alt="TuneMavens Global Music & Creator Ecosystem" style="width: 100%; max-width: 100%; max-height: 260px; object-fit: cover; border-radius: 3px; display: block; border: 1px solid rgba(34,211,238,0.28);" />
</div>
<p style="margin: 0 0 12px 0;">Hi {{name}},</p>
<p style="margin: 0 0 12px 0;">Welcome to <strong style="color: #22d3ee;">TuneMavens</strong> — the unified global ecosystem connecting recording artists, DJs, labels, podcasters, music supervisors, corporate brands, media houses, tour investors, and passionate music fans.</p>
<div style="background: rgba(16,185,129,0.07); border: 1px solid rgba(16,185,129,0.3); border-radius: 3px; padding: 14px 16px; margin: 14px 0;">
  <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #10b981; margin-bottom: 6px;">
    WHAT YOU CAN UNLOCK TODAY ON TUNEMAVENS
  </div>
  <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.6;">
    <li style="margin-bottom: 6px; color: #e2e8f0;">Launch Official EPK Web Worlds, ingest lossless catalogues &amp; automate TuneLedger split cascades</li>
    <li style="margin-bottom: 6px; color: #e2e8f0;">Stream 24-bit lossless audio on TuneStream, pitch sync briefs on SyncMavens &amp; book QR concert passes</li>
    <li style="margin-bottom: 6px; color: #e2e8f0;">Save your role &amp; genre preferences for personalized tools and instant 1-tap access</li>
  </ul>
</div>
<p style="margin: 12px 0 0 0;">Choose an action below to activate your workspace and customize your preferences.</p>`

    return {
      subject: '{{name}}, Welcome to TuneMavens — Activate Your Personalized Music & Live Events Workspace',
      body,
      ctaLabel: 'Activate My TuneMavens Workspace',
      ctaUrl: '/community',
      includeEpk: true,
      includeCatalog: true,
    }
  }

  const rawLines = String(pb.default_body || '').split('\n').map(l => l.trim()).filter(Boolean)
  const introParagraphs = rawLines
    .filter(l => !l.startsWith('•') && !l.startsWith('-'))
    .map(p => `<p style="margin: 0 0 12px 0;">${escapeHtml(p)}</p>`)
    .join('\n')
  const bulletItems = rawLines
    .filter(l => l.startsWith('•') || l.startsWith('-'))
    .map(l => l.replace(/^[•\-]\s*/, ''))
  const effectiveBullets = bulletItems.length > 0 ? bulletItems : (pb.highlights || [])
  const bulletsHtml = effectiveBullets
    .map(b => `<li style="margin-bottom: 6px; color: #e2e8f0;">${escapeHtml(b)}</li>`)
    .join('')

  const body = `<div style="margin-bottom: 16px;">
  <img src="${personaBanner}" alt="${escapeHtml(pb.label)} — TuneMavens" style="width: 100%; max-width: 100%; max-height: 260px; object-fit: cover; border-radius: 3px; display: block; border: 1px solid rgba(16,185,129,0.3);" />
</div>
${introParagraphs}
<div style="background: rgba(16,185,129,0.07); border: 1px solid rgba(16,185,129,0.3); border-radius: 3px; padding: 14px 16px; margin: 14px 0;">
  <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #10b981; margin-bottom: 6px;">
    TAILORED FOR ${escapeHtml(pb.label.toUpperCase())}
  </div>
  <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.6;">
    ${bulletsHtml}
  </ul>
</div>`

  return {
    subject: pb.default_subject,
    body,
    ctaLabel: pb.cta_label,
    ctaUrl: pb.cta_url,
    includeEpk: Boolean(pb.supports_epk),
    includeCatalog: Boolean(pb.supports_catalog),
  }
}

function authHeaders(json = false) {
  const h = {}
  if (json) h['Content-Type'] = 'application/json'
  const tok = tokenStore?.get?.()
  if (tok) h['Authorization'] = `Bearer ${tok}`
  return h
}

const INPUT_STYLE = {
  width: '100%',
  padding: '8px 10px',
  background: '#04070f',
  border: '1px solid rgba(255,255,255,0.14)',
  color: '#fff',
  borderRadius: '3px',
  boxSizing: 'border-box',
}

const TOOLBAR_BTN_STYLE = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.14)',
  color: '#e2e8f0',
  padding: '5px 8px',
  borderRadius: '3px',
  fontSize: '0.74rem',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
}

export default function EmailReachoutManager({ sessionUser, selectedAccountKey }) {
  const isAdmin = Boolean(
    !sessionUser ||
      sessionUser.role === 'admin' ||
      sessionUser.is_admin === true ||
      sessionUser.original_role === 'admin' ||
      selectedAccountKey === 'admin' ||
      (Array.isArray(sessionUser.roles) && sessionUser.roles.includes('admin')) ||
      (typeof window !== 'undefined' && window.localStorage?.getItem('tunemavens_admin_verified') === 'true')
  )

  const initialCompose = useMemo(
    () =>
      composeDynamicCampaign({
        personaKey: isAdmin ? 'all' : 'creator',
        promoType: 'persona_intro',
        playbooks: BUILTIN_PERSONA_PLAYBOOKS,
      }),
    [isAdmin]
  )

  const [affiliates, setAffiliates] = useState([])
  const [selectedAffiliateFilter, setSelectedAffiliateFilter] = useState(isAdmin ? 'TM-ADMIN' : '')
  const [groups, setGroups] = useState([])
  const [events, setEvents] = useState(() => AUTHORITATIVE_EVENTS || [])
  const [playbooks, setPlaybooks] = useState(BUILTIN_PERSONA_PLAYBOOKS)
  const [intelligence, setIntelligence] = useState(null)
  const [activitySummary, setActivitySummary] = useState({
    clicks: 0,
    rsvps: 0,
    onboardings: 0,
    purchases: 0,
    total_spend_usd: 0,
    total_commission_usd: 0,
  })
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  // Create Target Group state
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [tgName, setTgName] = useState('')
  const [tgDesc, setTgDesc] = useState('')
  const [tgBulkText, setTgBulkText] = useState('')
  const [savingGroup, setSavingGroup] = useState(false)

  // Import Target Group state
  const [showImportPanel, setShowImportPanel] = useState(false)
  const [importMode, setImportMode] = useState('new')
  const [importGroupName, setImportGroupName] = useState('')
  const [importTargetGroupId, setImportTargetGroupId] = useState('')
  const [importRawText, setImportRawText] = useState('')
  const [importFileName, setImportFileName] = useState('')
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef(null)

  // Manage Group Contacts state
  const [managingGroup, setManagingGroup] = useState(null)
  const [newEntryName, setNewEntryName] = useState('')
  const [newEntryEmail, setNewEntryEmail] = useState('')
  const [editingEntryId, setEditingEntryId] = useState(null)
  const [editEntryName, setEditEntryName] = useState('')
  const [editEntryEmail, setEditEntryEmail] = useState('')

  // Reachout Composer state
  const [campTitle, setCampTitle] = useState('')
  const [campGroupId, setCampGroupId] = useState('')
  const [campPromoType, setCampPromoType] = useState('persona_intro')
  const [campPersona, setCampPersona] = useState(isAdmin ? 'all' : 'creator')
  const [campIncludeEpk, setCampIncludeEpk] = useState(initialCompose.includeEpk)
  const [campIncludeCatalog, setCampIncludeCatalog] = useState(initialCompose.includeCatalog)
  const [campEventId, setCampEventId] = useState(AUTHORITATIVE_EVENTS?.[0]?.id || '')
  const [campProductThemeKey, setCampProductThemeKey] = useState('tunestream')
  const [campProductName, setCampProductName] = useState(PRODUCT_THEMES[0].name)
  const [campCtaRsvp, setCampCtaRsvp] = useState(true)
  const [campCtaTicket, setCampCtaTicket] = useState(true)
  const [campCtaLabel, setCampCtaLabel] = useState(initialCompose.ctaLabel)
  const [campCtaUrl, setCampCtaUrl] = useState(initialCompose.ctaUrl)
  const [campSubject, setCampSubject] = useState(initialCompose.subject)
  const [campBody, setCampBody] = useState(initialCompose.body)
  const [bodyRevision, setBodyRevision] = useState(1)
  const [dispatching, setDispatching] = useState(false)
  const [optimizing, setOptimizing] = useState(false)

  // Rich HTML & Image Upload Editor state
  const [editorMode, setEditorMode] = useState('visual') // 'visual' | 'html' | 'split'
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [insertImgWidth, setInsertImgWidth] = useState('100%')
  const [showUrlImageInput, setShowUrlImageInput] = useState(false)
  const [customImageUrl, setCustomImageUrl] = useState('')
  const [customImageAlt, setCustomImageAlt] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkHref, setLinkHref] = useState('')
  const [linkText, setLinkText] = useState('')
  const [showCtaButtonInput, setShowCtaButtonInput] = useState(false)
  const [ctaBtnLabel, setCtaBtnLabel] = useState('')
  const [ctaBtnHref, setCtaBtnHref] = useState('')
  const [ctaBtnVariant, setCtaBtnVariant] = useState('cyan') // 'cyan' | 'emerald' | 'purple' | 'outline'
  const [ctaBtnAlign, setCtaBtnAlign] = useState('left') // 'left' | 'center' | 'right'

  const visualEditorRef = useRef(null)
  const htmlTextareaRef = useRef(null)
  const imageUploadInputRef = useRef(null)
  const savedRangeRef = useRef(null)

  // Email Preview Modal state
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewData, setPreviewData] = useState(null)

  const notify = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 5000)
  }

  const mergeSiteEvents = (apiEvents) => {
    const byId = new Map()
    ;(Array.isArray(apiEvents) ? apiEvents : []).forEach(ev => {
      if (ev?.id) byId.set(ev.id, ev)
    })
    ;(AUTHORITATIVE_EVENTS || []).forEach(ev => {
      if (ev?.id && !byId.has(ev.id)) {
        byId.set(ev.id, ev)
      } else if (ev?.id && byId.has(ev.id) && !byId.get(ev.id).image_url && ev.image_url) {
        byId.set(ev.id, { ...byId.get(ev.id), image_url: ev.image_url })
      }
    })
    return Array.from(byId.values())
  }

  const registeredAffiliates = useMemo(() => {
    const seen = new Set()
    const list = []
    ;(affiliates || []).forEach(a => {
      const rc = String(a?.ref_code || '').trim().toUpperCase()
      if (!rc || rc === 'TM-ADMIN') return
      if (seen.has(rc)) return
      seen.add(rc)
      list.push(a)
    })
    return list
  }, [affiliates])

  const categorizedGroups = useMemo(() => {
    const allUsers = groups.find(g => g.system_key === 'sys_all_users') || null
    const personas = groups.filter(g => g.is_system_group && g.system_key !== 'sys_all_users')
    const custom = groups.filter(g => !g.is_system_group)
    return { allUsers, personas, custom }
  }, [groups])

  const effectiveInitiatorRef = useMemo(() => {
    if (!isAdmin) return affiliates[0]?.ref_code || sessionUser?.ref_code || ''
    if (!selectedAffiliateFilter || selectedAffiliateFilter === 'ALL') return 'TM-ADMIN'
    return selectedAffiliateFilter
  }, [isAdmin, selectedAffiliateFilter, affiliates, sessionUser])

  const selectedEventObj = events.find(ev => ev.id === campEventId) || events[0] || null

  // Apply dynamic template whenever top-level campaign selections change
  const applyDynamicSelectionUpdate = ({
    nextPersona = campPersona,
    nextPromoType = campPromoType,
    nextEventObj = selectedEventObj,
    nextProductThemeKey = campProductThemeKey,
    nextProductName = campProductName,
    nextGroupName = '',
  }) => {
    const composed = composeDynamicCampaign({
      personaKey: nextPersona,
      promoType: nextPromoType,
      eventObj: nextEventObj,
      productThemeKey: nextProductThemeKey,
      customProductName: nextProductName,
      playbooks,
    })
    setCampSubject(composed.subject)
    setCampBody(composed.body)
    setCampCtaLabel(composed.ctaLabel)
    setCampCtaUrl(composed.ctaUrl)
    setCampIncludeEpk(composed.includeEpk)
    setCampIncludeCatalog(composed.includeCatalog)
    if (nextGroupName) {
      const themeTag =
        nextPromoType === 'event'
          ? (nextEventObj?.title || 'Live Event')
          : nextPromoType === 'product_service'
          ? (nextProductName || 'Product Spotlight')
          : 'Onboarding'
      setCampTitle(`${nextGroupName} — ${themeTag}`)
    }
    setBodyRevision(r => r + 1)
  }

  // Reliably write programmatic updates into the Visual Rich Editor DOM
  useEffect(() => {
    if (editorMode === 'html') return
    const el = visualEditorRef.current
    if (!el) return
    el.innerHTML = toVisualHtml(campBody)
  }, [bodyRevision, editorMode])

  const saveVisualSelection = () => {
    try {
      const sel = window.getSelection?.()
      if (sel && sel.rangeCount > 0 && visualEditorRef.current?.contains(sel.anchorNode)) {
        savedRangeRef.current = sel.getRangeAt(0).cloneRange()
      }
    } catch (_) {}
  }

  const syncFromVisualEditor = () => {
    const el = visualEditorRef.current
    if (!el) return
    setCampBody(el.innerHTML)
  }

  const getLiveEditorBody = () => {
    if (editorMode !== 'html' && visualEditorRef.current) {
      const domHtml = visualEditorRef.current.innerHTML
      if (domHtml !== campBody) setCampBody(domHtml)
      return domHtml
    }
    return campBody
  }

  const execVisualCommand = (cmd, value = null) => {
    if (editorMode === 'html') {
      const ta = htmlTextareaRef.current
      if (!ta) return
      const start = ta.selectionStart ?? campBody.length
      const end = ta.selectionEnd ?? campBody.length
      const sel = campBody.slice(start, end)
      let replacement = sel
      if (cmd === 'bold') replacement = `<strong>${sel || 'bold text'}</strong>`
      else if (cmd === 'italic') replacement = `<em>${sel || 'italic text'}</em>`
      else if (cmd === 'underline') replacement = `<u>${sel || 'underlined text'}</u>`
      else if (cmd === 'strikeThrough') replacement = `<s>${sel || 'text'}</s>`
      else if (cmd === 'formatBlock' && value === 'H2') replacement = `<h2 style="color:#ffffff;margin:14px 0 8px;">${sel || 'Section Heading'}</h2>`
      else if (cmd === 'formatBlock' && value === 'H3') replacement = `<h3 style="color:#22d3ee;margin:12px 0 6px;">${sel || 'Subheading'}</h3>`
      else if (cmd === 'formatBlock' && value === 'BLOCKQUOTE') replacement = `<blockquote style="border-left:3px solid #22d3ee;padding-left:12px;margin:12px 0;color:#94a3b8;">${sel || 'Quoted highlight'}</blockquote>`
      else if (cmd === 'insertUnorderedList') replacement = `<ul>\n  <li>${sel || 'List item'}</li>\n</ul>`
      else if (cmd === 'insertOrderedList') replacement = `<ol>\n  <li>${sel || 'Numbered item'}</li>\n</ol>`
      else if (cmd === 'insertHorizontalRule') replacement = `\n<hr style="border:none;border-top:1px solid #1e293b;margin:16px 0;" />\n`
      else if (cmd === 'foreColor' && value) replacement = `<span style="color:${value};">${sel || 'colored text'}</span>`
      else if (cmd === 'justifyCenter') replacement = `<div style="text-align:center;">${sel || 'Centered content'}</div>`
      else if (cmd === 'justifyRight') replacement = `<div style="text-align:right;">${sel || 'Right-aligned content'}</div>`
      else if (cmd === 'justifyLeft') replacement = `<div style="text-align:left;">${sel || 'Left-aligned content'}</div>`
      const next = campBody.slice(0, start) + replacement + campBody.slice(end)
      setCampBody(next)
      setBodyRevision(r => r + 1)
      return
    }

    const el = visualEditorRef.current
    if (!el) return
    el.focus()
    try {
      if (savedRangeRef.current) {
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(savedRangeRef.current)
      }
      document.execCommand(cmd, false, value)
    } catch (_) {}
    saveVisualSelection()
    syncFromVisualEditor()
  }

  const insertHtmlSnippetAtCursor = (snippet) => {
    if (editorMode === 'html') {
      const ta = htmlTextareaRef.current
      if (ta) {
        const start = ta.selectionStart ?? campBody.length
        const end = ta.selectionEnd ?? campBody.length
        const next = campBody.slice(0, start) + snippet + campBody.slice(end)
        setCampBody(next)
        setBodyRevision(r => r + 1)
        requestAnimationFrame(() => {
          ta.focus()
          const pos = start + snippet.length
          ta.setSelectionRange(pos, pos)
        })
        return
      }
      setCampBody(prev => `${prev}\n${snippet}`)
      setBodyRevision(r => r + 1)
      return
    }

    const el = visualEditorRef.current
    if (!el) {
      setCampBody(prev => `${toVisualHtml(prev)}\n${snippet}`)
      setBodyRevision(r => r + 1)
      return
    }
    el.focus()
    try {
      const sel = window.getSelection()
      if (savedRangeRef.current) {
        sel.removeAllRanges()
        sel.addRange(savedRangeRef.current)
      }
      if (sel && sel.rangeCount > 0 && el.contains(sel.anchorNode)) {
        document.execCommand('insertHTML', false, snippet)
      } else {
        el.innerHTML = `${el.innerHTML}${snippet}`
      }
    } catch (_) {
      el.innerHTML = `${el.innerHTML}${snippet}`
    }
    saveVisualSelection()
    syncFromVisualEditor()
  }

  const handleInsertImageIntoBody = (imgUrl, altText = 'TuneMavens Email Graphic', widthSpec = insertImgWidth) => {
    if (!imgUrl) return
    const safeAlt = String(altText || 'TuneMavens Email Graphic').replace(/"/g, '&quot;')
    const snippet = `<div style="margin: 14px 0;"><img src="${imgUrl}" alt="${safeAlt}" style="width: ${widthSpec}; max-width: 100%; height: auto; border-radius: 3px; display: block; border: 1px solid rgba(34,211,238,0.22);" /></div>`
    insertHtmlSnippetAtCursor(snippet)
    notify('Inserted image into email body!')
  }

  const handleImageFileUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploadingImage(true)
    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        const headers = {}
        const tok = tokenStore?.get?.()
        if (tok) headers['Authorization'] = `Bearer ${tok}`

        const res = await fetch(`${API_BASE}/api/crm/upload-image`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: formData,
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || `Failed to upload ${file.name}`)

        const uploadedItem = {
          id: data.id || `img_${Date.now()}`,
          url: data.url,
          filename: data.filename || file.name,
        }
        setUploadedImages(prev => [uploadedItem, ...prev.filter(x => x.url !== uploadedItem.url)])
        handleInsertImageIntoBody(uploadedItem.url, uploadedItem.filename.replace(/\.[^.]+$/, ''), insertImgWidth)
      }
    } catch (err) {
      notify(err.message || 'Image upload failed', 'error')
    } finally {
      setUploadingImage(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleDeleteUploadedImage = async (img) => {
    setUploadedImages(prev => prev.filter(x => (x.id || x.url) !== (img.id || img.url)))
    if (img.id) {
      try {
        await fetch(`${API_BASE}/api/crm/uploaded-images/${encodeURIComponent(img.id)}`, {
          method: 'DELETE',
          headers: authHeaders(),
          credentials: 'include',
        })
      } catch (_) {}
    }
  }

  const handleInsertLinkConfirm = () => {
    const href = linkHref.trim()
    if (!href) return
    const safeHref = /^(https?:\/\/|mailto:|\/|#|\{\{)/i.test(href) ? href : `https://${href}`
    const label = linkText.trim() || safeHref
    insertHtmlSnippetAtCursor(
      `<a href="${safeHref}" style="color: #22d3ee; font-weight: 700; text-decoration: underline;">${escapeHtml(label)}</a>`
    )
    setLinkHref('')
    setLinkText('')
    setShowLinkInput(false)
  }

  const handleInsertCtaButtonConfirm = () => {
    const rawHref = ctaBtnHref.trim()
    const rawLabel = ctaBtnLabel.trim()
    if (!rawLabel || !rawHref) {
      notify('Please provide both a button label and a destination URL.', 'error')
      return
    }
    const safeHref = /^(https?:\/\/|mailto:|\/|#|\{\{)/i.test(rawHref) ? rawHref : `https://${rawHref}`
    const stylesByVariant = {
      cyan: { bg: '#22d3ee', color: '#04141a', border: '1px solid #22d3ee' },
      emerald: { bg: '#10b981', color: '#04141a', border: '1px solid #10b981' },
      purple: { bg: '#a855f7', color: '#ffffff', border: '1px solid #a855f7' },
      outline: { bg: '#131b2e', color: '#22d3ee', border: '1px solid #22d3ee' },
    }
    const v = stylesByVariant[ctaBtnVariant] || stylesByVariant.cyan
    const align = ['left', 'center', 'right'].includes(ctaBtnAlign) ? ctaBtnAlign : 'left'
    const btnHtml = `<div style="margin: 16px 0; text-align: ${align};"><a href="${escapeHtml(safeHref)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: ${v.bg}; color: ${v.color}; border: ${v.border}; padding: 11px 20px; border-radius: 3px; font-weight: 800; font-size: 14px; text-decoration: none; letter-spacing: 0.2px;">${escapeHtml(rawLabel)}</a></div>`
    insertHtmlSnippetAtCursor(btnHtml)
    setCtaBtnLabel('')
    setCtaBtnHref('')
    setShowCtaButtonInput(false)
    notify('Inserted custom CTA button into email body!')
  }

  const ensureAdminBackendSyncedIfNeeded = async () => {
    if (!isAdmin) return false
    const tok = tokenStore?.get?.()
    if (!tok) return false
    try {
      const r = await fetch(`${API_BASE}/api/admin/become-admin`, {
        method: 'POST',
        headers: authHeaders(true),
        credentials: 'include',
      })
      return r.ok
    } catch (_) {
      return false
    }
  }

  const loadBootstrap = async () => {
    try {
      let affRes = await fetch(`${API_BASE}/api/affiliates/admin/roster`, {
        headers: authHeaders(),
        credentials: 'include',
      })
        .then(r => (r.ok ? r.json() : { affiliates: [], is_admin_view: true }))
        .catch(() => ({ affiliates: [], is_admin_view: true }))

      if (isAdmin && affRes && affRes.is_admin_view === false) {
        const elevated = await ensureAdminBackendSyncedIfNeeded()
        if (elevated) {
          affRes = await fetch(`${API_BASE}/api/affiliates/admin/roster`, {
            headers: authHeaders(),
            credentials: 'include',
          })
            .then(r => (r.ok ? r.json() : { affiliates: [] }))
            .catch(() => ({ affiliates: [] }))
        }
      }

      const [evRes, pbRes, imgRes] = await Promise.all([
        fetch(`${API_BASE}/api/events`, { credentials: 'include' })
          .then(r => (r.ok ? r.json() : { events: [] }))
          .catch(() => ({ events: [] })),
        fetch(`${API_BASE}/api/crm/smart-playbooks`, { credentials: 'include' })
          .then(r => (r.ok ? r.json() : null))
          .catch(() => null),
        fetch(`${API_BASE}/api/crm/uploaded-images`, { headers: authHeaders(), credentials: 'include' })
          .then(r => (r.ok ? r.json() : { images: [] }))
          .catch(() => ({ images: [] })),
      ])

      const loadedAffs = affRes.affiliates || []
      setAffiliates(loadedAffs)
      if (!isAdmin && loadedAffs.length > 0) {
        setSelectedAffiliateFilter(loadedAffs[0].ref_code)
      } else if (isAdmin && (!selectedAffiliateFilter || selectedAffiliateFilter === 'ALL')) {
        setSelectedAffiliateFilter('TM-ADMIN')
      }

      if (Array.isArray(imgRes?.images)) {
        setUploadedImages(imgRes.images.filter(img => img?.url && !img.url.includes('media.tunemavens.com')))
      }

      const apiEvents = Array.isArray(evRes) ? evRes : (evRes.events || [])
      const mergedEvents = mergeSiteEvents(apiEvents)
      setEvents(mergedEvents)
      if (!campEventId && mergedEvents.length > 0) {
        setCampEventId(mergedEvents[0].id)
      }

      if (pbRes?.playbooks) {
        const pbMap = { ...BUILTIN_PERSONA_PLAYBOOKS }
        pbRes.playbooks.forEach(p => {
          pbMap[p.persona] = { ...(BUILTIN_PERSONA_PLAYBOOKS[p.persona] || {}), ...p }
        })
        setPlaybooks(pbMap)
      }
    } catch (err) {
      console.warn('Bootstrap fetch warning:', err)
    }
  }

  const loadScopedData = async (affFilter = selectedAffiliateFilter, personaFilter = campPersona) => {
    setLoading(true)
    try {
      const telemetryRefParam =
        affFilter && affFilter !== 'ALL' ? `affiliate_ref_code=${encodeURIComponent(affFilter)}` : ''
      const intelPersona = personaFilter === 'all' ? 'creator' : personaFilter

      const [gRes, actRes, intelRes] = await Promise.all([
        fetch(`${API_BASE}/api/crm/target-groups`, {
          headers: authHeaders(),
          credentials: 'include',
        })
          .then(r => (r.ok ? r.json() : { groups: [] }))
          .catch(() => ({ groups: [] })),
        fetch(`${API_BASE}/api/crm/reachout/activity${telemetryRefParam ? `?${telemetryRefParam}` : ''}`, {
          headers: authHeaders(),
          credentials: 'include',
        })
          .then(r => (r.ok ? r.json() : { summary: {}, activities: [] }))
          .catch(() => ({ summary: {}, activities: [] })),
        fetch(
          `${API_BASE}/api/crm/intelligence?persona=${encodeURIComponent(intelPersona)}${telemetryRefParam ? `&${telemetryRefParam}` : ''}`,
          { headers: authHeaders(), credentials: 'include' }
        )
          .then(r => (r.ok ? r.json() : null))
          .catch(() => null),
      ])

      const loadedGroups = gRes.groups || []
      setGroups(loadedGroups)
      setActivitySummary(actRes.summary || {})
      setActivities(actRes.activities || [])
      if (intelRes) setIntelligence(intelRes)

      if (loadedGroups.length > 0 && !loadedGroups.some(g => g.id === campGroupId)) {
        const defaultGrp = loadedGroups[0]
        setCampGroupId(defaultGrp.id)
        const inferred = inferPersonaFromGroup(defaultGrp) || (isAdmin ? 'all' : 'creator')
        setCampPersona(inferred)
        applyDynamicSelectionUpdate({
          nextPersona: inferred,
          nextPromoType: campPromoType,
          nextGroupName: defaultGrp.name,
        })
      } else if (loadedGroups.length === 0) {
        setCampGroupId('')
      }
    } catch (err) {
      console.error('Error loading scoped CRM data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      await loadBootstrap()
      await loadScopedData(isAdmin ? 'TM-ADMIN' : selectedAffiliateFilter, campPersona)
    }
    init()
  }, [])

  useEffect(() => {
    loadScopedData(selectedAffiliateFilter, campPersona)
  }, [selectedAffiliateFilter, campPersona])

  // Handlers for dynamic top-level selections
  const handleTargetGroupChange = (nextGroupId) => {
    setCampGroupId(nextGroupId)
    const grp = groups.find(g => g.id === nextGroupId)
    if (!grp) return
    const inferredPersona = inferPersonaFromGroup(grp) || campPersona
    setCampPersona(inferredPersona)
    applyDynamicSelectionUpdate({
      nextPersona: inferredPersona,
      nextPromoType: campPromoType,
      nextGroupName: grp.name,
    })
  }

  const handlePersonaChange = (nextPersonaKey) => {
    setCampPersona(nextPersonaKey)
    const activeGroup = groups.find(g => g.id === campGroupId)
    applyDynamicSelectionUpdate({
      nextPersona: nextPersonaKey,
      nextPromoType: campPromoType,
      nextGroupName: activeGroup?.name || '',
    })
  }

  const handlePromoTypeChange = (nextType) => {
    setCampPromoType(nextType)
    const activeGroup = groups.find(g => g.id === campGroupId)
    const ev = events.find(x => x.id === campEventId) || events[0] || null
    if (nextType === 'event' && ev) {
      if (!campEventId) setCampEventId(ev.id)
      if (ev.payment_mode === 'free_rsvp') {
        setCampCtaRsvp(true)
        setCampCtaTicket(false)
      }
    }
    applyDynamicSelectionUpdate({
      nextPersona: campPersona,
      nextPromoType: nextType,
      nextEventObj: ev,
      nextProductThemeKey: campProductThemeKey,
      nextProductName: campProductName,
      nextGroupName: activeGroup?.name || '',
    })
  }

  const handleEventSelectionChange = (nextEventId) => {
    setCampEventId(nextEventId)
    const ev = events.find(x => x.id === nextEventId) || null
    if (ev?.payment_mode === 'free_rsvp') {
      setCampCtaRsvp(true)
      setCampCtaTicket(false)
    } else if (ev) {
      setCampCtaTicket(true)
    }
    const activeGroup = groups.find(g => g.id === campGroupId)
    applyDynamicSelectionUpdate({
      nextPersona: campPersona,
      nextPromoType: 'event',
      nextEventObj: ev,
      nextGroupName: activeGroup?.name || '',
    })
  }

  const handleProductThemeSelect = (nextThemeKey) => {
    setCampProductThemeKey(nextThemeKey)
    const found = PRODUCT_THEMES.find(t => t.key === nextThemeKey) || PRODUCT_THEMES[0]
    setCampProductName(found.name)
    const activeGroup = groups.find(g => g.id === campGroupId)
    applyDynamicSelectionUpdate({
      nextPersona: campPersona,
      nextPromoType: 'product_service',
      nextProductThemeKey: nextThemeKey,
      nextProductName: found.name,
      nextGroupName: activeGroup?.name || '',
    })
  }

  const handleSmartOptimize = async () => {
    setOptimizing(true)
    try {
      const effectivePersona = campPersona === 'all' ? 'creator' : campPersona
      const res = await fetch(`${API_BASE}/api/crm/smart-recommend`, {
        method: 'POST',
        headers: authHeaders(true),
        credentials: 'include',
        body: JSON.stringify({
          promotion_type: campPromoType,
          persona: effectivePersona,
          event_id: campPromoType === 'event' ? campEventId : undefined,
          product_name: campPromoType === 'product_service' ? campProductName : undefined,
        }),
      })
      if (res.ok) {
        const rec = await res.json()
        const composed = composeDynamicCampaign({
          personaKey: campPersona,
          promoType: campPromoType,
          eventObj: selectedEventObj,
          productThemeKey: campProductThemeKey,
          customProductName: campProductName,
          playbooks,
        })
        setCampSubject(rec.learned_boost_applied && rec.subject ? rec.subject : composed.subject)
        setCampBody(composed.body)
        setCampCtaLabel(rec.learned_boost_applied && rec.cta_label ? rec.cta_label : composed.ctaLabel)
        if (rec.cta_url) setCampCtaUrl(rec.cta_url)
        setBodyRevision(r => r + 1)
        notify(
          rec.learned_boost_applied
            ? 'Applied highest-converting Subject & CTA learned from historical campaign performance!'
            : 'Refreshed persona-optimized copy, banner visual & CTAs!'
        )
      }
    } catch (_) {
      applyDynamicSelectionUpdate({})
      notify('Refreshed Smart CRM template.')
    } finally {
      setOptimizing(false)
    }
  }

  const handleOpenEmailPreview = async () => {
    const latestBody = getLiveEditorBody()
    if (!campSubject.trim() || !hasMeaningfulBody(latestBody)) {
      notify('Enter an Email Subject and Message Body to preview.', 'error')
      return
    }
    const event_ctas = []
    if (campPromoType === 'event') {
      const isFreeRsvpEv = selectedEventObj?.payment_mode === 'free_rsvp'
      if (campCtaRsvp || isFreeRsvpEv) event_ctas.push('rsvp')
      if (campCtaTicket && !isFreeRsvpEv) event_ctas.push('ticket')
    }
    const dispatchAffiliateRef = effectiveInitiatorRef || 'TM-ADMIN'

    setPreviewLoading(true)
    setPreviewOpen(true)
    try {
      const res = await fetch(`${API_BASE}/api/crm/campaigns/preview`, {
        method: 'POST',
        headers: authHeaders(true),
        credentials: 'include',
        body: JSON.stringify({
          subject: campSubject,
          body: latestBody,
          target_group_id: campGroupId || undefined,
          promotion_type: campPromoType,
          target_persona: campPersona === 'all' ? undefined : campPersona,
          include_epk_cta: campIncludeEpk,
          include_catalog_cta: campIncludeCatalog,
          product_name: campPromoType === 'product_service' ? campProductName : undefined,
          event_id: campEventId || undefined,
          event_doc: selectedEventObj || undefined,
          event_ctas,
          cta_label: campCtaLabel,
          cta_url: campCtaUrl,
          affiliate_ref_code: dispatchAffiliateRef,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Could not generate preview')
      setPreviewData(data)
    } catch (err) {
      notify(err.message || 'Failed to render preview', 'error')
      setPreviewOpen(false)
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    if (!tgName.trim()) {
      notify('Please enter a Target Group name.', 'error')
      return
    }
    const entries = []
    tgBulkText
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .forEach(line => {
        const parts = line.split(',').map(p => p.trim())
        if (parts.length >= 2) {
          entries.push({ name: parts[0], email: parts[1] })
        } else if (line.includes('@')) {
          entries.push({ name: line.split('@')[0], email: line })
        }
      })

    setSavingGroup(true)
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups`, {
        method: 'POST',
        headers: authHeaders(true),
        credentials: 'include',
        body: JSON.stringify({
          name: tgName.trim(),
          description: tgDesc.trim(),
          affiliate_ref_code: effectiveInitiatorRef || undefined,
          initiator_email: sessionUser?.email || undefined,
          initiator_name: sessionUser?.name || undefined,
          entries,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Could not create target group')
      notify(`Target Group "${data.name}" created (${data.member_count} contacts).`)
      setTgName('')
      setTgDesc('')
      setTgBulkText('')
      setShowNewGroup(false)
      setCampGroupId(data.id)
      await loadBootstrap()
      await loadScopedData()
    } catch (err) {
      notify(err.message || 'Failed to create group', 'error')
    } finally {
      setSavingGroup(false)
    }
  }

  const handleFileUploadSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImportFileName(file.name)
    if (!importGroupName) {
      setImportGroupName(file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '))
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImportRawText(String(ev.target?.result || ''))
    }
    reader.readAsText(file)
  }

  const handleDownloadSampleCsv = () => {
    const sample = 'Name,Email,Notes\nWanjiku Mwangi,wanjiku@example.com,Creator Lead\nBrian Otieno,brian@example.com,VIP Event Guest\nAisha Kamau,aisha@example.com,DJ Curator\n'
    const blob = new Blob([sample], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tunemavens_target_group_template.csv'
    a.click()
  }

  const handleImportSubmit = async (e) => {
    e.preventDefault()
    if (!importRawText.trim()) {
      notify('Please select a CSV/TSV/JSON file or paste contact rows to import.', 'error')
      return
    }
    if (importMode === 'append' && !importTargetGroupId) {
      notify('Please choose an existing Target Group to append into.', 'error')
      return
    }
    setImporting(true)
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups/import`, {
        method: 'POST',
        headers: authHeaders(true),
        credentials: 'include',
        body: JSON.stringify({
          name: importMode === 'new' ? (importGroupName.trim() || 'Imported Target Group') : undefined,
          target_group_id: importMode === 'append' ? importTargetGroupId : undefined,
          raw_content: importRawText,
          format_hint: importFileName.endsWith('.json') ? 'json' : 'auto',
          affiliate_ref_code: effectiveInitiatorRef || undefined,
          initiator_email: sessionUser?.email || undefined,
          initiator_name: sessionUser?.name || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Import failed')
      const r = data.report || {}
      const strippedMsg = r.stripped_phone_fields > 0 ? ` (${r.stripped_phone_fields} phone column(s) stripped per Email-Only policy)` : ''
      notify(`Imported ${r.imported || 0} email contact(s) into "${data.group?.name}"${strippedMsg}!`)
      setImportRawText('')
      setImportFileName('')
      setImportGroupName('')
      setShowImportPanel(false)
      if (data.group?.id) setCampGroupId(data.group.id)
      await loadBootstrap()
      await loadScopedData()
    } catch (err) {
      notify(err.message || 'Failed to import contacts', 'error')
    } finally {
      setImporting(false)
    }
  }

  const handleCreateWarmFollowupGroup = async () => {
    const warm = intelligence?.warm_unconverted_leads || []
    if (!warm.length) return
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups`, {
        method: 'POST',
        headers: authHeaders(true),
        credentials: 'include',
        body: JSON.stringify({
          name: `Smart Warm Clickers Follow-Up (${new Date().toLocaleDateString()})`,
          description: 'Auto-segmented recipients who clicked a reachout link without completing onboarding yet',
          affiliate_ref_code: effectiveInitiatorRef || undefined,
          entries: warm.map(w => ({ name: w.name || 'Guest', email: w.email })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Could not create warm follow-up group')
      setCampGroupId(data.id)
      notify(`Created Warm Follow-Up Group with ${data.member_count} high-intent contact(s)!`)
      await loadScopedData()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Delete this Target Group and all its email entries?')) return
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups/${groupId}`, {
        method: 'DELETE',
        headers: authHeaders(),
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete group')
      if (managingGroup?.id === groupId) setManagingGroup(null)
      notify('Target group deleted.')
      await loadBootstrap()
      await loadScopedData()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const openManageContacts = async (groupId) => {
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups/${groupId}`, {
        headers: authHeaders(),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to load group contacts')
      setManagingGroup(data)
      setEditingEntryId(null)
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const handleAddEntry = async (e) => {
    e.preventDefault()
    if (!managingGroup || !newEntryName.trim() || !newEntryEmail.trim()) return
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups/${managingGroup.id}/entries`, {
        method: 'POST',
        headers: authHeaders(true),
        credentials: 'include',
        body: JSON.stringify({ name: newEntryName.trim(), email: newEntryEmail.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Could not add contact')
      setManagingGroup(data.group)
      setNewEntryName('')
      setNewEntryEmail('')
      notify('Contact added.')
      loadScopedData()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const handleSaveEditEntry = async (entryId) => {
    if (!managingGroup || !editEntryName.trim() || !editEntryEmail.trim()) return
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups/${managingGroup.id}/entries/${entryId}`, {
        method: 'PUT',
        headers: authHeaders(true),
        credentials: 'include',
        body: JSON.stringify({ name: editEntryName.trim(), email: editEntryEmail.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Could not update contact')
      setManagingGroup(data.group)
      setEditingEntryId(null)
      notify('Contact updated.')
      loadScopedData()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const handleDeleteEntry = async (entryId) => {
    if (!managingGroup) return
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups/${managingGroup.id}/entries/${entryId}`, {
        method: 'DELETE',
        headers: authHeaders(),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Could not remove contact')
      setManagingGroup(data.group)
      notify('Contact removed.')
      loadScopedData()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const handleLaunchReachout = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    const latestBody = getLiveEditorBody()
    if (!campGroupId) {
      notify('Please select or import an Email-Only Target Group first.', 'error')
      return
    }
    if (!campSubject.trim() || !hasMeaningfulBody(latestBody)) {
      notify('Subject and Message Body are required.', 'error')
      return
    }
    const event_ctas = []
    if (campPromoType === 'event') {
      if (!campEventId) {
        notify('Please select a Live Event.', 'error')
        return
      }
      const isFreeRsvpEv = selectedEventObj?.payment_mode === 'free_rsvp'
      if (campCtaRsvp || isFreeRsvpEv) event_ctas.push('rsvp')
      if (campCtaTicket && !isFreeRsvpEv) event_ctas.push('ticket')
      if (event_ctas.length === 0) {
        notify('Select at least one Event CTA (RSVP or Buy Ticket).', 'error')
        return
      }
    }

    const activeGroup = groups.find(g => g.id === campGroupId)
    const dispatchAffiliateRef = effectiveInitiatorRef || 'TM-ADMIN'

    setDispatching(true)
    try {
      const res = await fetch(`${API_BASE}/api/crm/campaigns`, {
        method: 'POST',
        headers: authHeaders(true),
        credentials: 'include',
        body: JSON.stringify({
          title: campTitle.trim() || `${campPromoType.toUpperCase()} Reachout — ${activeGroup?.name || 'Group'}`,
          target_group_id: campGroupId,
          affiliate_ref_code: dispatchAffiliateRef,
          initiator_email: sessionUser?.email || undefined,
          initiator_name: sessionUser?.name || undefined,
          promotion_type: campPromoType,
          target_persona: campPersona === 'all' ? undefined : campPersona,
          include_epk_cta: campIncludeEpk,
          include_catalog_cta: campIncludeCatalog,
          event_id: campPromoType === 'event' ? campEventId : undefined,
          event_doc: campPromoType === 'event' ? selectedEventObj : undefined,
          event_ctas,
          product_name: campPromoType === 'product_service' ? campProductName.trim() : undefined,
          cta_label: campCtaLabel.trim() || undefined,
          cta_url: campCtaUrl.trim() || undefined,
          subject: campSubject.trim(),
          body: latestBody.trim(),
          channels: ['email'],
          dispatch_now: true,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to dispatch email reachout')
      setPreviewOpen(false)
      notify(
        `Dispatched to ${data.recipient_count || 0} recipient(s) under affiliate ${data.affiliate_ref_code || 'TM-ADMIN'}! Learning engine armed.`
      )
      setCampTitle('')
      await loadScopedData()
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setDispatching(false)
    }
  }

  const currentPlaybook =
    campPersona === 'all'
      ? { label: 'All TuneMavens Members', supports_epk: true, supports_catalog: true, subject_variants: [] }
      : playbooks[campPersona] || BUILTIN_PERSONA_PLAYBOOKS.creator

  const renderInitiatorSelectOptions = () => (
    <>
      <option value="TM-ADMIN">Admin Account — TuneMavens Official (TM-ADMIN)</option>
      {registeredAffiliates.map(a => (
        <option key={a.ref_code} value={a.ref_code}>
          {a.name} ({a.ref_code}{a.email ? ` · ${a.email}` : ''})
        </option>
      ))}
    </>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {toast && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '3px',
            background: toast.type === 'error' ? 'rgba(239,68,68,0.14)' : 'rgba(16,185,129,0.14)',
            border: `1px solid ${toast.type === 'error' ? '#ef4444' : '#10b981'}`,
            color: toast.type === 'error' ? '#fca5a5' : '#34d399',
            fontSize: '0.84rem',
            fontWeight: 700,
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* TOP BAR: Initiating Affiliate Account Workspace Scope */}
      <div
        style={{
          background: '#080e1c',
          border: '1px solid rgba(34,211,238,0.32)',
          borderLeft: '4px solid #22d3ee',
          borderRadius: '3px',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ flex: '1 1 340px' }}>
          <div style={{ fontWeight: 900, color: '#22d3ee', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RiShieldUserFill size={17} color="#22d3ee" />
            {isAdmin
              ? 'Admin Global Affiliate & Target Email Group Reachout Hub'
              : 'Affiliate Partner Reachout Workspace (Isolated to Your Account)'}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '3px' }}>
            {isAdmin
              ? 'Choose Admin Account (TM-ADMIN) or any registered affiliate to initiate reachouts. Selecting a Target Email Group, Persona, or Campaign Theme dynamically updates the email subject, banner visual, message body, and CTAs.'
              : 'Your Target Groups, imported contacts, and conversion commissions are strictly scoped to what your account has access to.'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ minWidth: '310px' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#22d3ee', fontWeight: 800, marginBottom: '3px', textTransform: 'uppercase' }}>
              Initiating Affiliate Account *
            </label>
            {isAdmin ? (
              <select
                value={selectedAffiliateFilter}
                onChange={e => setSelectedAffiliateFilter(e.target.value)}
                style={{ ...INPUT_STYLE, border: '1px solid #22d3ee', fontWeight: 700, fontSize: '0.8rem' }}
              >
                {renderInitiatorSelectOptions()}
              </select>
            ) : (
              <div style={{ padding: '8px 12px', background: '#04070f', border: '1px solid #10b981', borderRadius: '3px', color: '#10b981', fontWeight: 800, fontSize: '0.8rem' }}>
                {affiliates[0] ? `${affiliates[0].name} (${affiliates[0].ref_code})` : sessionUser?.email || 'My Affiliate Account'}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-end' }}>
            <button
              type="button"
              onClick={() => { setShowImportPanel(v => !v); setShowNewGroup(false) }}
              style={{ background: '#10b981', border: 'none', color: '#04141a', padding: '8px 13px', borderRadius: '3px', fontSize: '0.78rem', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RiUpload2Line size={15} color="#04141a" /> Import CSV / JSON
            </button>
            <button
              type="button"
              onClick={() => { setShowNewGroup(v => !v); setShowImportPanel(false) }}
              style={{ background: '#22d3ee', border: 'none', color: '#04141a', padding: '8px 13px', borderRadius: '3px', fontSize: '0.78rem', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RiAddLine size={16} color="#04141a" /> New Target Group
            </button>
            <button
              type="button"
              onClick={() => { loadBootstrap(); loadScopedData() }}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px 10px', borderRadius: '3px', cursor: 'pointer' }}
              title="Refresh CRM Data"
            >
              <RiRefreshLine size={15} color="#22d3ee" />
            </button>
          </div>
        </div>
      </div>

      {/* SELF-LEARNING SMART CRM INTELLIGENCE BAR */}
      {intelligence && (
        <div style={{ background: '#071322', border: '1px solid rgba(168,85,247,0.35)', borderRadius: '3px', padding: '14px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, fontSize: '0.86rem', color: '#e9d5ff' }}>
              <RiBrainLine color="#a855f7" size={18} />
              Smart CRM Adaptive Learning Engine (Continuously Learns Subject, Persona, EPK &amp; Catalogue Outcomes)
            </div>
            {(intelligence.warm_unconverted_leads || []).length > 0 && (
              <button
                type="button"
                onClick={handleCreateWarmFollowupGroup}
                style={{ background: '#a855f7', border: 'none', color: '#ffffff', padding: '6px 12px', borderRadius: '3px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <RiFlashlightFill size={14} color="#ffffff" />
                Segment {intelligence.warm_unconverted_leads.length} Warm Unconverted Clicker(s) into Follow-Up Group
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '10px', marginBottom: '10px' }}>
            {[
              { label: 'Click-Through Rate', val: `${intelligence.metrics?.click_through_rate_pct || 0}%`, color: '#22d3ee' },
              { label: 'Click to Onboard', val: `${intelligence.metrics?.click_to_onboard_rate_pct || 0}%`, color: '#10b981' },
              { label: 'EPKs Activated', val: intelligence.metrics?.epks_activated || 0, color: '#a855f7' },
              { label: 'Catalogue Ingested', val: intelligence.metrics?.catalog_items_ingested || 0, color: '#f59e0b' },
              { label: 'Warm Unconverted', val: intelligence.metrics?.warm_unconverted_leads_count || 0, color: '#ef4444' },
            ].map(m => (
              <div key={m.label} style={{ background: '#040812', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '3px', padding: '8px 10px' }}>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{m.label}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: m.color, marginTop: '2px' }}>{m.val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>
            {(intelligence.recommendations || []).map((rec, i) => (
              <div key={i} style={{ marginTop: i > 0 ? '4px' : 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RiLightbulbFlashFill size={14} color="#f59e0b" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IMPORT TARGET GROUP PANEL */}
      {showImportPanel && (
        <form
          onSubmit={handleImportSubmit}
          style={{ background: '#09101f', border: '1px solid #10b981', borderRadius: '3px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontWeight: 900, color: '#10b981', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RiUpload2Line size={17} color="#10b981" />
              Import Target Group Contacts (CSV, TSV, TXT, or JSON — Email-Only Auto-Sanitized)
            </div>
            <button
              type="button"
              onClick={handleDownloadSampleCsv}
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', color: '#22d3ee', padding: '5px 10px', borderRadius: '3px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <RiDownload2Line size={14} color="#22d3ee" /> Download Sample CSV
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Import Destination</label>
              <select value={importMode} onChange={e => setImportMode(e.target.value)} style={INPUT_STYLE}>
                <option value="new">Create a New Target Group</option>
                <option value="append">Append into an Existing Target Group</option>
              </select>
            </div>
            {importMode === 'new' ? (
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>New Target Group Name *</label>
                <input value={importGroupName} onChange={e => setImportGroupName(e.target.value)} placeholder="e.g. Imported East Africa Creators" style={INPUT_STYLE} />
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Select Existing Target Group *</label>
                <select value={importTargetGroupId} onChange={e => setImportTargetGroupId(e.target.value)} style={INPUT_STYLE}>
                  <option value="">-- Select Group --</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name} ({g.member_count || 0} emails)</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Upload File (.csv, .tsv, .txt, .json)</label>
              <input ref={fileInputRef} type="file" accept=".csv,.tsv,.txt,.json" onChange={handleFileUploadSelect} style={{ ...INPUT_STYLE, padding: '6px', fontSize: '0.76rem' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>
              File Preview / Paste CSV or JSON Rows (Any phone/WhatsApp columns are automatically stripped)
            </label>
            <textarea
              rows={5}
              value={importRawText}
              onChange={e => setImportRawText(e.target.value)}
              placeholder={'Name,Email,Notes\nWanjiku Mwangi,wanjiku@example.com,Creator\nBrian Otieno,brian@example.com,DJ'}
              style={{ ...INPUT_STYLE, fontFamily: 'monospace', fontSize: '0.78rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Assigning to affiliate: <strong style={{ color: '#10b981' }}>{effectiveInitiatorRef || 'TM-ADMIN'}</strong>
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => setShowImportPanel(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '8px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={importing} style={{ background: '#10b981', border: 'none', color: '#04141a', padding: '8px 16px', borderRadius: '3px', fontWeight: 900, cursor: 'pointer' }}>
                {importing ? 'Importing...' : 'Import Email Contacts'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* CREATE NEW TARGET GROUP FORM */}
      {showNewGroup && (
        <form
          onSubmit={handleCreateGroup}
          style={{ background: '#09101f', border: '1px solid rgba(34,211,238,0.35)', borderRadius: '3px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.92rem' }}>
            Create Email-Only Target Group (Owner: <span style={{ color: '#22d3ee' }}>{effectiveInitiatorRef || 'TM-ADMIN'}</span>)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Target Group Name *</label>
              <input value={tgName} onChange={e => setTgName(e.target.value)} required placeholder="e.g. Nairobi Creators & Labels Q4" style={INPUT_STYLE} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Description</label>
              <input value={tgDesc} onChange={e => setTgDesc(e.target.value)} placeholder="e.g. Persona onboarding & EPK launch list" style={INPUT_STYLE} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>
              Contacts — One per line as <code>Name, email@domain.com</code> (Email-only, no phone numbers)
            </label>
            <textarea
              rows={4}
              value={tgBulkText}
              onChange={e => setTgBulkText(e.target.value)}
              placeholder={'Wanjiku Mwangi, wanjiku@example.com\nBrian Otieno, brian@example.com'}
              style={{ ...INPUT_STYLE, fontFamily: 'monospace', fontSize: '0.8rem' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={() => setShowNewGroup(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '8px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={savingGroup} style={{ background: '#22d3ee', border: 'none', color: '#04141a', padding: '8px 16px', borderRadius: '3px', fontWeight: 900, cursor: 'pointer' }}>
              {savingGroup ? 'Saving...' : 'Save Target Group'}
            </button>
          </div>
        </form>
      )}

      {/* TARGET GROUPS TABLE */}
      <div style={{ background: '#080c18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontWeight: 800, fontSize: '0.86rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <RiDatabase2Fill size={15} color="#22d3ee" />
            Email-Only Target Groups ({groups.length})
          </span>
          <span style={{ fontSize: '0.73rem', color: '#94a3b8', fontWeight: 600 }}>
            {isAdmin
              ? `All Registered Users + ${categorizedGroups.personas.length} Persona Cohorts + ${categorizedGroups.custom.length} Custom Target Group(s)`
              : 'Accessible Target Groups for Your Account'}
          </span>
        </div>
        <div style={{ overflowX: 'auto', maxHeight: '320px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', color: '#94a3b8', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px' }}>Group Name</th>
                <th style={{ padding: '10px 14px' }}>Email Contacts</th>
                <th style={{ padding: '10px 14px' }}>Owner / Scope</th>
                <th style={{ padding: '10px 14px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: '18px', textAlign: 'center', color: '#64748b' }}>Loading target groups...</td></tr>
              ) : groups.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '18px', textAlign: 'center', color: '#64748b' }}>No target groups found for your account yet. Click &quot;New Target Group&quot; or &quot;Import CSV / JSON&quot; above.</td></tr>
              ) : (
                groups.map(g => (
                  <tr key={g.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: campGroupId === g.id ? 'rgba(34,211,238,0.05)' : 'transparent' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 800, color: '#fff' }}>{g.name}</span>
                        {g.system_key === 'sys_all_users' ? (
                          <span style={{ background: 'rgba(34,211,238,0.14)', border: '1px solid rgba(34,211,238,0.35)', color: '#22d3ee', padding: '1px 6px', borderRadius: '3px', fontSize: '0.66rem', fontWeight: 800, textTransform: 'uppercase' }}>
                            All Users
                          </span>
                        ) : g.is_system_group ? (
                          <span style={{ background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '1px 6px', borderRadius: '3px', fontSize: '0.66rem', fontWeight: 800, textTransform: 'uppercase' }}>
                            Persona Cohort
                          </span>
                        ) : (
                          <span style={{ background: 'rgba(168,85,247,0.14)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc', padding: '1px 6px', borderRadius: '3px', fontSize: '0.66rem', fontWeight: 800, textTransform: 'uppercase' }}>
                            Custom Group
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>{g.description || 'Email-only reachout list'}</div>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ background: 'rgba(34,211,238,0.14)', color: '#22d3ee', padding: '2px 8px', borderRadius: '3px', fontWeight: 800, fontSize: '0.72rem' }}>
                        {g.member_count || 0} emails
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#10b981', fontSize: '0.76rem' }}>
                      {g.created_by_name ? `${g.created_by_name} (${g.affiliate_ref_code || 'TM-ADMIN'})` : (g.affiliate_ref_code || 'TM-ADMIN')}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => openManageContacts(g.id)} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '4px 10px', borderRadius: '3px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <RiEditLine size={13} color="#22d3ee" /> Contacts
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleTargetGroupChange(g.id)
                            notify(`Targeted "${g.name}" — Subject, visual banner, message body & CTAs updated dynamically!`)
                          }}
                          style={{ background: '#22d3ee', border: 'none', color: '#04141a', padding: '4px 10px', borderRadius: '3px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
                        >
                          Select for Reachout
                        </button>
                        {!g.is_system_group && (
                          <button type="button" onClick={() => handleDeleteGroup(g.id)} style={{ background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '4px 8px', borderRadius: '3px', fontSize: '0.74rem', cursor: 'pointer' }}>
                            <RiDeleteBinLine size={13} color="#ef4444" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INLINE MANAGE CONTACTS DRAWER */}
      {managingGroup && (
        <div style={{ background: '#09101f', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '3px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontWeight: 900, color: '#10b981', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RiUserAddLine size={16} color="#10b981" />
              Manage Contacts: {managingGroup.name} ({managingGroup.member_count || 0} Email-Only)
            </div>
            <button type="button" onClick={() => setManagingGroup(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <RiCloseFill size={20} color="#94a3b8" />
            </button>
          </div>
          <form onSubmit={handleAddEntry} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', marginBottom: '14px' }}>
            <input value={newEntryName} onChange={e => setNewEntryName(e.target.value)} placeholder="Contact Full Name" required style={INPUT_STYLE} />
            <input type="email" value={newEntryEmail} onChange={e => setNewEntryEmail(e.target.value)} placeholder="email@domain.com (no phone numbers)" required style={INPUT_STYLE} />
            <button type="submit" style={{ background: '#10b981', border: 'none', color: '#04141a', padding: '8px 14px', borderRadius: '3px', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <RiAddLine size={15} color="#04141a" /> Add Contact
            </button>
          </form>
          <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '8px' }}>Name</th>
                  <th style={{ padding: '8px' }}>Email Address</th>
                  <th style={{ padding: '8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(managingGroup.entries || []).map(ent => (
                  <tr key={ent.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '8px', color: '#fff', fontWeight: 700 }}>
                      {editingEntryId === ent.id ? (
                        <input value={editEntryName} onChange={e => setEditEntryName(e.target.value)} style={{ ...INPUT_STYLE, padding: '4px 8px', border: '1px solid #22d3ee', width: '90%' }} />
                      ) : ent.name}
                    </td>
                    <td style={{ padding: '8px', color: '#22d3ee' }}>
                      {editingEntryId === ent.id ? (
                        <input type="email" value={editEntryEmail} onChange={e => setEditEntryEmail(e.target.value)} style={{ ...INPUT_STYLE, padding: '4px 8px', border: '1px solid #22d3ee', width: '95%' }} />
                      ) : ent.email}
                    </td>
                    <td style={{ padding: '8px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {editingEntryId === ent.id ? (
                          <>
                            <button type="button" onClick={() => handleSaveEditEntry(ent.id)} style={{ background: '#10b981', border: 'none', color: '#04141a', padding: '4px 8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer' }}><RiCheckLine size={13} color="#04141a" /></button>
                            <button type="button" onClick={() => setEditingEntryId(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer' }}><RiCloseFill size={13} color="#fff" /></button>
                          </>
                        ) : (
                          <>
                            <button type="button" onClick={() => { setEditingEntryId(ent.id); setEditEntryName(ent.name); setEditEntryEmail(ent.email) }} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.72rem' }}>Edit</button>
                            <button type="button" onClick={() => handleDeleteEntry(ent.id)} style={{ background: 'rgba(239,68,68,0.16)', border: 'none', color: '#ef4444', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.72rem' }}>Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SMART REACHOUT COMPOSER */}
      <form
        onSubmit={handleLaunchReachout}
        style={{ background: '#080c18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontWeight: 900, fontSize: '0.94rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RiMailSendFill color="#22d3ee" size={18} />
            Intelligent Email Reachout Composer
          </div>
          <button
            type="button"
            onClick={handleSmartOptimize}
            disabled={optimizing}
            style={{ background: '#a855f7', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '3px', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <RiSparkling2Fill size={14} color="#ffffff" />
            {optimizing ? 'Optimizing...' : 'Smart Auto-Optimize Copy (Learned Weights)'}
          </button>
        </div>

        {/* TOP CAMPAIGN TARGETING & THEME CONTROLS — Dynamically Drive Subject, Visuals, Body & CTAs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>
              Initiating Affiliate Account *
            </label>
            {isAdmin ? (
              <select
                value={selectedAffiliateFilter}
                onChange={e => setSelectedAffiliateFilter(e.target.value)}
                required
                style={{ ...INPUT_STYLE, fontWeight: 700 }}
              >
                {renderInitiatorSelectOptions()}
              </select>
            ) : (
              <div style={{ ...INPUT_STYLE, color: '#10b981', fontWeight: 800, border: '1px solid rgba(16,185,129,0.4)' }}>
                {affiliates[0] ? `${affiliates[0].name} (${affiliates[0].ref_code})` : sessionUser?.email || 'My Affiliate Account'}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Target Email Group *</label>
            <select value={campGroupId} onChange={e => handleTargetGroupChange(e.target.value)} required style={{ ...INPUT_STYLE, fontWeight: 700 }}>
              <option value="">-- Select Target Group --</option>
              {categorizedGroups.allUsers && (
                <optgroup label="All Registered Users">
                  <option value={categorizedGroups.allUsers.id}>
                    {categorizedGroups.allUsers.name} ({categorizedGroups.allUsers.member_count || 0} emails)
                  </option>
                </optgroup>
              )}
              {categorizedGroups.personas.length > 0 && (
                <optgroup label="Personas (By Registered Role)">
                  {categorizedGroups.personas.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.member_count || 0} emails)
                    </option>
                  ))}
                </optgroup>
              )}
              {categorizedGroups.custom.length > 0 && (
                <optgroup label={isAdmin ? 'Previously Created Target Groups (All Users)' : 'Your Target Groups'}>
                  {categorizedGroups.custom.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.member_count || 0} emails · {g.created_by_name || g.affiliate_ref_code || 'Custom'})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Promotion Type (Campaign Theme) *</label>
            <select value={campPromoType} onChange={e => handlePromoTypeChange(e.target.value)} style={{ ...INPUT_STYLE, border: '1px solid #22d3ee', fontWeight: 700 }}>
              <option value="persona_intro">Persona Introductory &amp; Onboarding (EPK / Catalogue / Role)</option>
              <option value="event">Live Event Invitation (Event Flyer + Direct RSVP &amp; Ticket CTAs)</option>
              <option value="product_service">Ecosystem Product / Service Promotion</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#22d3ee', fontWeight: 800, marginBottom: '4px' }}>
              Target Persona Voice &amp; Messaging *
            </label>
            <select value={campPersona} onChange={e => handlePersonaChange(e.target.value)} style={{ ...INPUT_STYLE, border: '1px solid rgba(34,211,238,0.4)', fontWeight: 700 }}>
              <option value="all">All Registered Users (Ecosystem-Wide)</option>
              {Object.values(playbooks).map(pb => (
                <option key={pb.persona} value={pb.persona}>
                  {pb.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* MODE 1: PERSONA INTRODUCTORY PLAYBOOK */}
        {campPromoType === 'persona_intro' && (
          <div style={{ background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.25)', borderRadius: '3px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Primary Onboarding CTA Button Label</label>
                <input value={campCtaLabel} onChange={e => setCampCtaLabel(e.target.value)} style={INPUT_STYLE} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Primary Destination Route</label>
                <input value={campCtaUrl} onChange={e => setCampCtaUrl(e.target.value)} style={INPUT_STYLE} />
              </div>
            </div>

            {(currentPlaybook.supports_epk || currentPlaybook.supports_catalog) && (
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', paddingTop: '4px', fontSize: '0.8rem', color: '#e2e8f0' }}>
                {currentPlaybook.supports_epk && (
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={campIncludeEpk} onChange={e => setCampIncludeEpk(e.target.checked)} />
                    Include Direct <strong>&quot;Launch Official EPK&quot;</strong> Button in Email
                  </label>
                )}
                {currentPlaybook.supports_catalog && (
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={campIncludeCatalog} onChange={e => setCampIncludeCatalog(e.target.checked)} />
                    Include Direct <strong>&quot;Ingest Catalogue &amp; Stems&quot;</strong> Button in Email
                  </label>
                )}
              </div>
            )}

            {(currentPlaybook.subject_variants || []).length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Alternate Subject Hooks:</span>
                {currentPlaybook.subject_variants.map((sv, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCampSubject(sv)}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', color: '#cbd5e1', padding: '3px 8px', borderRadius: '3px', fontSize: '0.7rem', cursor: 'pointer' }}
                  >
                    Use Hook #{idx + 2}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODE 2: LIVE SITE EVENT WITH FLYER/POSTER */}
        {campPromoType === 'event' && (
          <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.28)', borderRadius: '3px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#10b981', fontWeight: 800, marginBottom: '4px' }}>
                <RiCalendarEventFill size={14} color="#10b981" style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                Select Live Site Event ({events.length} Active Events) *
              </label>
              <select
                value={campEventId}
                onChange={e => handleEventSelectionChange(e.target.value)}
                style={{ ...INPUT_STYLE, fontWeight: 700 }}
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} — {ev.artist} · {ev.city || ev.venue} [{ev.payment_mode === 'free_rsvp' ? 'FREE RSVP' : 'PAID TICKETS'}]
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'center', fontSize: '0.8rem', color: '#e2e8f0' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={campCtaRsvp} onChange={e => setCampCtaRsvp(e.target.checked)} /> Direct &quot;RSVP Now&quot; Email Button
              </label>
              {selectedEventObj?.payment_mode === 'free_rsvp' ? (
                <span style={{ fontSize: '0.73rem', color: '#10b981', fontWeight: 700, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '3px', padding: '3px 8px' }}>
                  Free with RSVP Event — &quot;Buy Ticket Now&quot; hidden
                </span>
              ) : (
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={campCtaTicket} onChange={e => setCampCtaTicket(e.target.checked)} /> Direct &quot;Buy Ticket Now&quot; Email Button
                </label>
              )}
            </div>
          </div>
        )}

        {/* MODE 3: PRODUCT / SERVICE */}
        {campPromoType === 'product_service' && (
          <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.28)', borderRadius: '3px', padding: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#c084fc', fontWeight: 800, marginBottom: '4px' }}>Select Product / Service Theme *</label>
              <select value={campProductThemeKey} onChange={e => handleProductThemeSelect(e.target.value)} style={{ ...INPUT_STYLE, fontWeight: 700 }}>
                {PRODUCT_THEMES.map(pt => (
                  <option key={pt.key} value={pt.key}>{pt.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Custom Product Display Name</label>
              <input
                value={campProductName}
                onChange={e => {
                  const nextName = e.target.value
                  setCampProductName(nextName)
                  applyDynamicSelectionUpdate({
                    nextPersona: campPersona,
                    nextPromoType: 'product_service',
                    nextProductThemeKey: campProductThemeKey,
                    nextProductName: nextName,
                  })
                }}
                placeholder="e.g. TuneStream Hi-Fi, SyncMavens, DJ Pool"
                style={INPUT_STYLE}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>CTA Button Label</label>
              <input value={campCtaLabel} onChange={e => setCampCtaLabel(e.target.value)} placeholder="Explore Now" style={INPUT_STYLE} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Destination Route</label>
              <input value={campCtaUrl} onChange={e => setCampCtaUrl(e.target.value)} placeholder="/stream" style={INPUT_STYLE} />
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Campaign Title (Internal Reference)</label>
            <input value={campTitle} onChange={e => setCampTitle(e.target.value)} placeholder="e.g. Q4 East Africa Creator EPK & Catalogue Onboarding" style={INPUT_STYLE} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Email Subject * (Placeholders: {'{{name}}'}, {'{{event_title}}'})</label>
            <input value={campSubject} onChange={e => setCampSubject(e.target.value)} required style={INPUT_STYLE} />
          </div>
        </div>

        {/* RICH HTML + IMAGE UPLOAD MESSAGE BODY EDITOR */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Personalized Message Body * (Placeholders: {'{{name}}'}, {'{{event_title}}'}, {'{{event_date}}'}, {'{{event_venue}}'})
            </label>

            {/* Editor Mode Switcher: Visual | HTML Source | Split */}
            <div style={{ display: 'inline-flex', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', padding: '2px', gap: '2px' }}>
              {[
                { id: 'visual', label: 'Visual Rich Editor', icon: RiEditLine },
                { id: 'html', label: 'HTML Code', icon: RiCodeSSlashLine },
                { id: 'split', label: 'Split View', icon: RiLayoutColumnLine },
              ].map(m => {
                const Icon = m.icon
                const active = editorMode === m.id
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      const current = getLiveEditorBody()
                      if (m.id === 'html' && !HTML_DETECT_RE.test(current)) {
                        setCampBody(toVisualHtml(current))
                      } else {
                        setCampBody(current)
                      }
                      setEditorMode(m.id)
                      setBodyRevision(r => r + 1)
                    }}
                    style={{
                      background: active ? '#22d3ee' : 'transparent',
                      color: active ? '#04141a' : '#94a3b8',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '4px 9px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Icon size={13} /> {m.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ border: '1px solid rgba(255,255,255,0.16)', borderRadius: '3px', background: '#04070f', overflow: 'hidden' }}>
            {/* Formatting & Image Upload Toolbar */}
            <div style={{ padding: '8px 10px', background: '#0b1120', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' }}>
              <button type="button" title="Bold" onClick={() => execVisualCommand('bold')} style={TOOLBAR_BTN_STYLE}><RiBold size={14} /></button>
              <button type="button" title="Italic" onClick={() => execVisualCommand('italic')} style={TOOLBAR_BTN_STYLE}><RiItalic size={14} /></button>
              <button type="button" title="Underline" onClick={() => execVisualCommand('underline')} style={TOOLBAR_BTN_STYLE}><RiUnderline size={14} /></button>
              <button type="button" title="Strikethrough" onClick={() => execVisualCommand('strikeThrough')} style={TOOLBAR_BTN_STYLE}><RiStrikethrough size={14} /></button>

              <span style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />

              <button type="button" title="Heading H2" onClick={() => execVisualCommand('formatBlock', 'H2')} style={TOOLBAR_BTN_STYLE}>H2</button>
              <button type="button" title="Subheading H3" onClick={() => execVisualCommand('formatBlock', 'H3')} style={TOOLBAR_BTN_STYLE}>H3</button>
              <button type="button" title="Paragraph" onClick={() => execVisualCommand('formatBlock', 'P')} style={TOOLBAR_BTN_STYLE}>P</button>
              <button type="button" title="Blockquote" onClick={() => execVisualCommand('formatBlock', 'BLOCKQUOTE')} style={TOOLBAR_BTN_STYLE}><RiDoubleQuotesL size={14} /></button>

              <span style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />

              <button type="button" title="Bullet List" onClick={() => execVisualCommand('insertUnorderedList')} style={TOOLBAR_BTN_STYLE}><RiListUnordered size={14} /></button>
              <button type="button" title="Numbered List" onClick={() => execVisualCommand('insertOrderedList')} style={TOOLBAR_BTN_STYLE}><RiListOrdered size={14} /></button>
              <button type="button" title="Align Left" onClick={() => execVisualCommand('justifyLeft')} style={TOOLBAR_BTN_STYLE}><RiAlignLeft size={14} /></button>
              <button type="button" title="Align Center" onClick={() => execVisualCommand('justifyCenter')} style={TOOLBAR_BTN_STYLE}><RiAlignCenter size={14} /></button>
              <button type="button" title="Align Right" onClick={() => execVisualCommand('justifyRight')} style={TOOLBAR_BTN_STYLE}><RiAlignRight size={14} /></button>
              <button type="button" title="Horizontal Divider" onClick={() => execVisualCommand('insertHorizontalRule')} style={TOOLBAR_BTN_STYLE}><RiSeparator size={14} /></button>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '0 4px' }} title="Text Color">
                {['#ffffff', '#22d3ee', '#10b981', '#a855f7', '#f59e0b'].map(col => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => execVisualCommand('foreColor', col)}
                    style={{ width: '16px', height: '16px', borderRadius: '3px', background: col, border: '1px solid rgba(255,255,255,0.35)', cursor: 'pointer', padding: 0 }}
                    title={`Color ${col}`}
                  />
                ))}
              </div>

              <button type="button" title="Insert Link" onClick={() => { setShowLinkInput(v => !v); setShowUrlImageInput(false); setShowCtaButtonInput(false) }} style={TOOLBAR_BTN_STYLE}>
                <RiLink size={14} /> Link
              </button>
              <button
                type="button"
                title="Insert Custom CTA Button with Link"
                onClick={() => { setShowCtaButtonInput(v => !v); setShowLinkInput(false); setShowUrlImageInput(false) }}
                style={{ ...TOOLBAR_BTN_STYLE, border: '1px solid rgba(34,211,238,0.45)', color: '#22d3ee', background: 'rgba(34,211,238,0.08)' }}
              >
                <RiAddLine size={14} /> CTA Button
              </button>
              <button type="button" title="Clear Formatting" onClick={() => execVisualCommand('removeFormat')} style={TOOLBAR_BTN_STYLE}>
                <RiFormatClear size={14} />
              </button>

              <span style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />

              <input
                ref={imageUploadInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
                multiple
                onChange={handleImageFileUpload}
                style={{ display: 'none' }}
              />
              <select
                value={insertImgWidth}
                onChange={e => setInsertImgWidth(e.target.value)}
                title="Inserted Image Width"
                style={{ background: '#04070f', border: '1px solid rgba(16,185,129,0.45)', color: '#10b981', borderRadius: '3px', padding: '4px 6px', fontSize: '0.72rem', fontWeight: 700 }}
              >
                <option value="100%">Img: 100% Width</option>
                <option value="75%">Img: 75% Width</option>
                <option value="50%">Img: 50% Width</option>
              </select>
              <button
                type="button"
                disabled={uploadingImage}
                onClick={() => imageUploadInputRef.current?.click()}
                style={{
                  background: '#10b981',
                  border: 'none',
                  color: '#04141a',
                  padding: '5px 10px',
                  borderRadius: '3px',
                  fontSize: '0.74rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <RiImageAddLine size={14} color="#04141a" />
                {uploadingImage ? 'Uploading...' : 'Upload & Insert Image'}
              </button>
              <button
                type="button"
                onClick={() => { setShowUrlImageInput(v => !v); setShowLinkInput(false); setShowCtaButtonInput(false) }}
                style={{ ...TOOLBAR_BTN_STYLE, border: '1px solid rgba(34,211,238,0.35)', color: '#22d3ee' }}
              >
                <RiImage2Fill size={13} /> Image URL
              </button>
            </div>

            {/* Quick Placeholder Chips Bar */}
            <div style={{ padding: '6px 10px', background: '#070b15', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Insert Placeholder:</span>
              {['{{name}}', '{{event_title}}', '{{event_date}}', '{{event_venue}}'].map(ph => (
                <button
                  key={ph}
                  type="button"
                  onClick={() => insertHtmlSnippetAtCursor(ph)}
                  style={{ background: 'rgba(34,211,238,0.09)', border: '1px solid rgba(34,211,238,0.28)', color: '#22d3ee', padding: '2px 8px', borderRadius: '3px', fontSize: '0.71rem', fontFamily: 'monospace', fontWeight: 700, cursor: 'pointer' }}
                >
                  + {ph}
                </button>
              ))}
            </div>

            {showLinkInput && (
              <div style={{ padding: '8px 10px', background: '#091224', borderBottom: '1px solid rgba(34,211,238,0.25)', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <input value={linkText} onChange={e => setLinkText(e.target.value)} placeholder="Link text (e.g. Listen Now)" style={{ ...INPUT_STYLE, width: '180px', padding: '5px 8px', fontSize: '0.76rem' }} />
                <input value={linkHref} onChange={e => setLinkHref(e.target.value)} placeholder="https://tunemavens.com/..." style={{ ...INPUT_STYLE, flex: '1 1 220px', padding: '5px 8px', fontSize: '0.76rem' }} />
                <button type="button" onClick={handleInsertLinkConfirm} style={{ background: '#22d3ee', border: 'none', color: '#04141a', padding: '5px 12px', borderRadius: '3px', fontWeight: 800, fontSize: '0.74rem', cursor: 'pointer' }}>Insert Link</button>
                <button type="button" onClick={() => setShowLinkInput(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.74rem' }}>Cancel</button>
              </div>
            )}

            {showCtaButtonInput && (
              <div style={{ padding: '10px', background: '#091224', borderBottom: '1px solid rgba(34,211,238,0.35)', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Custom CTA Button:</span>
                <input
                  value={ctaBtnLabel}
                  onChange={e => setCtaBtnLabel(e.target.value)}
                  placeholder="Button Label (e.g. Claim VIP Pass)"
                  style={{ ...INPUT_STYLE, width: '190px', padding: '5px 8px', fontSize: '0.76rem' }}
                />
                <input
                  value={ctaBtnHref}
                  onChange={e => setCtaBtnHref(e.target.value)}
                  placeholder="https://tunemavens.com/... or /events"
                  style={{ ...INPUT_STYLE, flex: '1 1 210px', padding: '5px 8px', fontSize: '0.76rem' }}
                />
                <select
                  value={ctaBtnVariant}
                  onChange={e => setCtaBtnVariant(e.target.value)}
                  style={{ ...INPUT_STYLE, width: 'auto', padding: '5px 8px', fontSize: '0.74rem' }}
                >
                  <option value="cyan">Cyan Primary</option>
                  <option value="emerald">Emerald Green</option>
                  <option value="purple">Purple Accent</option>
                  <option value="outline">Dark Outline</option>
                </select>
                <select
                  value={ctaBtnAlign}
                  onChange={e => setCtaBtnAlign(e.target.value)}
                  style={{ ...INPUT_STYLE, width: 'auto', padding: '5px 8px', fontSize: '0.74rem' }}
                >
                  <option value="left">Align: Left</option>
                  <option value="center">Align: Center</option>
                  <option value="right">Align: Right</option>
                </select>
                <button
                  type="button"
                  onClick={handleInsertCtaButtonConfirm}
                  style={{ background: '#22d3ee', border: 'none', color: '#04141a', padding: '5px 12px', borderRadius: '3px', fontWeight: 900, fontSize: '0.74rem', cursor: 'pointer' }}
                >
                  Insert CTA Button
                </button>
                <button type="button" onClick={() => setShowCtaButtonInput(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.74rem' }}>Cancel</button>
              </div>
            )}

            {showUrlImageInput && (
              <div style={{ padding: '8px 10px', background: '#091224', borderBottom: '1px solid rgba(16,185,129,0.25)', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <input value={customImageUrl} onChange={e => setCustomImageUrl(e.target.value)} placeholder="https://... or /headers/..." style={{ ...INPUT_STYLE, flex: '1 1 240px', padding: '5px 8px', fontSize: '0.76rem' }} />
                <input value={customImageAlt} onChange={e => setCustomImageAlt(e.target.value)} placeholder="Alt description" style={{ ...INPUT_STYLE, width: '170px', padding: '5px 8px', fontSize: '0.76rem' }} />
                <button
                  type="button"
                  onClick={() => {
                    if (customImageUrl.trim()) {
                      handleInsertImageIntoBody(customImageUrl.trim(), customImageAlt.trim() || 'Email Image', insertImgWidth)
                      setCustomImageUrl('')
                      setCustomImageAlt('')
                      setShowUrlImageInput(false)
                    }
                  }}
                  style={{ background: '#10b981', border: 'none', color: '#04141a', padding: '5px 12px', borderRadius: '3px', fontWeight: 800, fontSize: '0.74rem', cursor: 'pointer' }}
                >
                  Insert Image
                </button>
                <button type="button" onClick={() => setShowUrlImageInput(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.74rem' }}>Cancel</button>
              </div>
            )}

            {/* Uploaded Images Gallery Tray for 1-Click Insertion into Email Body */}
            {uploadedImages.length > 0 && (
              <div style={{ padding: '8px 10px', background: '#060c18', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
                <span style={{ fontSize: '0.69rem', color: '#10b981', fontWeight: 800, whiteSpace: 'nowrap' }}>
                  Uploaded Images ({uploadedImages.length}):
                </span>
                {uploadedImages.slice(0, 12).map(img => (
                  <div
                    key={img.id || img.url}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0b1324', border: '1px solid rgba(16,185,129,0.28)', borderRadius: '3px', padding: '3px 7px', flexShrink: 0 }}
                  >
                    <img
                      src={img.url}
                      alt={img.filename || 'Uploaded'}
                      onError={() => setUploadedImages(prev => prev.filter(x => x.url !== img.url))}
                      style={{ width: '36px', height: '26px', objectFit: 'cover', borderRadius: '2px', background: '#04070f' }}
                    />
                    <span style={{ fontSize: '0.7rem', color: '#cbd5e1', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {img.filename || 'image'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleInsertImageIntoBody(img.url, img.filename, insertImgWidth)}
                      style={{ background: '#22d3ee', border: 'none', color: '#04141a', padding: '2px 7px', borderRadius: '3px', fontSize: '0.68rem', fontWeight: 900, cursor: 'pointer' }}
                    >
                      Insert
                    </button>
                    <button
                      type="button"
                      title="Remove uploaded image"
                      onClick={() => handleDeleteUploadedImage(img)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', padding: '0 2px', cursor: 'pointer', display: 'inline-flex' }}
                    >
                      <RiCloseFill size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Editor Surface(s) */}
            <div style={{ display: 'grid', gridTemplateColumns: editorMode === 'split' ? '1fr 1fr' : '1fr' }}>
              {(editorMode === 'html' || editorMode === 'split') && (
                <textarea
                  ref={htmlTextareaRef}
                  rows={11}
                  value={campBody}
                  onChange={e => {
                    setCampBody(e.target.value)
                    if (editorMode === 'split') setBodyRevision(r => r + 1)
                  }}
                  placeholder="<p>Hi {{name}},</p><p>Write rich HTML or paste markup here...</p>"
                  style={{
                    ...INPUT_STYLE,
                    border: 'none',
                    borderRight: editorMode === 'split' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    borderRadius: 0,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    fontSize: '0.8rem',
                    lineHeight: 1.55,
                    minHeight: '260px',
                    resize: 'vertical',
                  }}
                />
              )}

              {(editorMode === 'visual' || editorMode === 'split') && (
                <div
                  ref={visualEditorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={syncFromVisualEditor}
                  onKeyUp={saveVisualSelection}
                  onMouseUp={saveVisualSelection}
                  onBlur={() => {
                    saveVisualSelection()
                    syncFromVisualEditor()
                  }}
                  style={{
                    padding: '14px 16px',
                    minHeight: '260px',
                    maxHeight: '500px',
                    overflowY: 'auto',
                    color: '#e2e8f0',
                    fontSize: '0.88rem',
                    lineHeight: 1.65,
                    outline: 'none',
                    background: '#04070f',
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Tracking under affiliate: <strong style={{ color: '#22d3ee' }}>{effectiveInitiatorRef || 'TM-ADMIN'}</strong> · Dual alerts sent to In-App Inbox + Registered Email.
          </span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleOpenEmailPreview}
              style={{ background: '#131b2e', border: '1px solid #22d3ee', color: '#22d3ee', padding: '10px 16px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RiEyeLine size={16} color="#22d3ee" /> Preview Email
            </button>
            <button
              type="submit"
              disabled={dispatching}
              style={{ background: '#22d3ee', border: 'none', color: '#04141a', padding: '10px 18px', borderRadius: '3px', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RiSendPlaneFill size={15} color="#04141a" /> {dispatching ? 'Dispatching...' : 'Dispatch Intelligent Email Reachout'}
            </button>
          </div>
        </div>
      </form>

      {/* EMAIL PREVIEW MODAL */}
      {previewOpen && (
        <div
          onClick={() => setPreviewOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(4,6,15,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '720px', height: '90vh', maxHeight: '90vh', background: '#080c18', border: '1px solid #22d3ee', borderRadius: '3px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            <div style={{ flexShrink: 0, padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 900, color: '#fff', fontSize: '0.94rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiEyeLine size={17} color="#22d3ee" /> Live Email Render Preview
              </div>
              <button type="button" onClick={() => setPreviewOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <RiCloseFill size={20} color="#94a3b8" />
              </button>
            </div>

            {previewLoading ? (
              <div style={{ flex: '1 1 auto', minHeight: 0, padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Rendering email preview...</div>
            ) : previewData ? (
              <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ flexShrink: 0, background: '#04070f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '10px 14px', fontSize: '0.78rem', color: '#cbd5e1', display: 'grid', gap: '4px' }}>
                  <div><strong style={{ color: '#94a3b8' }}>From:</strong> <span style={{ color: '#22d3ee', fontWeight: 700 }}>TuneMavens &lt;hello@tunemavens.com&gt;</span></div>
                  <div><strong style={{ color: '#94a3b8' }}>Sample Recipient:</strong> {previewData.recipient?.name} &lt;{previewData.recipient?.email}&gt;</div>
                  <div><strong style={{ color: '#94a3b8' }}>Subject Line:</strong> <span style={{ color: '#fff', fontWeight: 700 }}>{previewData.subject}</span></div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                    <span>
                      <strong style={{ color: '#94a3b8' }}>Initiating Account:</strong>{' '}
                      <span style={{ color: '#10b981', fontFamily: 'monospace', fontWeight: 700 }}>{previewData.affiliate_ref_code}</span>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#22d3ee', fontSize: '0.72rem', fontWeight: 700 }}>
                      <RiCheckboxCircleFill size={13} color="#10b981" /> 1:1 Body Sync + Bottom CTA Buttons + Legal Disclaimers &amp; Preferences Footer Active
                    </span>
                  </div>
                </div>
                <div
                  onClick={e => {
                    const anchor = e.target.closest?.('a')
                    if (anchor && anchor.href) {
                      e.preventDefault()
                      window.open(anchor.href, '_blank', 'noopener,noreferrer')
                    }
                  }}
                  style={{ flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', overflowX: 'auto' }}
                  dangerouslySetInnerHTML={{ __html: previewData.html }}
                />
              </div>
            ) : null}

            <div style={{ flexShrink: 0, padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setPreviewOpen(false)} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer' }}>
                Close Preview
              </button>
              <button type="button" onClick={handleLaunchReachout} disabled={dispatching} style={{ background: '#22d3ee', border: 'none', color: '#04141a', padding: '8px 16px', borderRadius: '3px', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <RiSendPlaneFill size={14} color="#04141a" /> {dispatching ? 'Dispatching...' : 'Dispatch Reachout Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AFFILIATE REACHOUT FUNNEL TELEMETRY */}
      <div style={{ background: '#080c18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '16px' }}>
        <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RiLinksLine color="#10b981" size={16} /> Affiliate Reachout Funnel &amp; Attribution Telemetry
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '14px' }}>
          {[
            { label: 'Link Clicks', val: activitySummary.clicks || 0, color: '#22d3ee' },
            { label: 'Event RSVPs', val: activitySummary.rsvps || 0, color: '#10b981' },
            { label: 'Onboarded Users', val: activitySummary.onboardings || 0, color: '#a855f7' },
            { label: 'Attributed Spend', val: `$${Number(activitySummary.total_spend_usd || 0).toFixed(2)}`, color: '#f59e0b' },
            { label: 'Commissions', val: `$${Number(activitySummary.total_commission_usd || 0).toFixed(2)}`, color: '#10b981' },
          ].map(card => (
            <div key={card.label} style={{ background: '#04070f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '10px 12px' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{card.label}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: card.color, marginTop: '3px' }}>{card.val}</div>
            </div>
          ))}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '8px' }}>Action</th>
              <th style={{ padding: '8px' }}>Affiliate Ref</th>
              <th style={{ padding: '8px' }}>Recipient / User</th>
              <th style={{ padding: '8px' }}>Spend &amp; Commission</th>
              <th style={{ padding: '8px' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '14px', textAlign: 'center', color: '#64748b' }}>No reachout activity recorded yet for this scope.</td></tr>
            ) : (
              activities.slice(0, 15).map(a => (
                <tr key={a.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px' }}>
                    <span style={{ background: 'rgba(34,211,238,0.14)', color: '#22d3ee', padding: '2px 7px', borderRadius: '3px', fontSize: '0.7rem', fontWeight: 800 }}>
                      {(a.action_type || '').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '8px', fontFamily: 'monospace', color: '#10b981' }}>{a.affiliate_ref_code || '--'}</td>
                  <td style={{ padding: '8px', color: '#fff' }}>{a.actor_name || a.actor_email || 'Guest'}</td>
                  <td style={{ padding: '8px', color: '#cbd5e1' }}>
                    {a.amount_usd > 0 ? `$${Number(a.amount_usd).toFixed(2)} (+$${Number(a.commission_usd || 0).toFixed(2)})` : '--'}
                  </td>
                  <td style={{ padding: '8px', color: '#64748b', fontSize: '0.72rem' }}>
                    {a.created_at ? new Date(a.created_at).toLocaleString() : ''}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
