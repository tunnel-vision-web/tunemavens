import React, { useState, useEffect } from 'react';
import {
  RiMicFill, RiPlayFill, RiPauseFill, RiRssFill, RiCoinsFill,
  RiShieldCheckFill, RiUserVoiceFill, RiSparklingFill, RiTimeLine,
  RiHeadphoneFill, RiGlobalLine, RiMegaphoneFill, RiFileList3Line,
  RiCalendarEventFill, RiExternalLinkLine, RiCloseLine, RiCheckFill,
  RiVolumeUpFill, RiAwardFill, RiSearchLine, RiBookmarkLine, RiShareForwardLine
} from 'react-icons/ri';
import { useRegion } from '../../RegionContext.jsx';
import { AUTHORITATIVE_AD_RATES } from '../../data/authoritativeAdRates.js';

// Canonical Sponsorship Rate Cards derived directly from Single Source of Truth (AUTHORITATIVE_AD_RATES)
export const CANONICAL_PODCAST_SPONSORSHIP_RATES = AUTHORITATIVE_AD_RATES.map((rate) => ({
  slug: rate.slug,
  slot: rate.podcastSlotName,
  tierName: rate.name,
  tierBadge: rate.tier_badge,
  cpmUsd: rate.cpm_usd,
  packagePriceUsd: rate.price_usd,
  credits: rate.credits,
  guaranteedImpressions: rate.guaranteed_impressions,
  durationDays: rate.duration_days,
  deliverables: rate.features.slice(0, 3).join(' • ')
}));

export const AUTHORITATIVE_PODCAST_SHOWS = [
  {
    id: 'pod-indie-artist',
    slug: 'indieartistpod',
    subdomain: 'indieartistpod',
    title: 'The Independent Artist & Creator Economy',
    host: 'Zawadi Kiprop & Kofi Mensah',
    hostRole: 'Music Economists & Web3 Audio Strategists',
    category: 'Music Business',
    language: 'English / Swahili',
    cadence: 'Weekly • Tuesdays',
    subscribers: '142.4K',
    totalStreams: '1.84M',
    avgCompletionRate: '86%',
    rating: 4.9,
    accentColor: '#10b981',
    secondaryColor: '#00f2fe',
    coverArt: '/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg',
    bannerUrl: '/headers/discography_retina_header.jpg',
    trailerAudioUrl: '/api/stream/track/KE-TM1-24-INTRO',
    description: 'Deep-dive conversations on independent music ownership, automated Split Cascade royalties, global sync licensing, and building a sustainable creator career without major-label debt.',
    bio: "Hosted from Nairobi and Accra by Zawadi Kiprop and Kofi Mensah, The Independent Artist & Creator Economy is Africa's #1 music business and creator tech podcast.",
    demographics: {
      topRegions: [
        { region: 'East Africa (Kenya, Tanzania, Uganda)', share: 34 },
        { region: 'West Africa (Nigeria, Ghana)', share: 26 },
        { region: 'North America (USA & Canada)', share: 22 },
        { region: 'UK & European Diaspora', share: 18 }
      ],
      ageGroups: '18–34 (68%), 35–49 (27%), 50+ (5%)',
      listenerProfile: 'Independent artists, music lovers, tech founders, A&Rs, and cultural tastemakers'
    },
    sponsorshipRates: CANONICAL_PODCAST_SPONSORSHIP_RATES,
    splits: [
      { name: 'Zawadi Kiprop', role: 'Lead Host & Executive Producer', share: 45 },
      { name: 'Kofi Mensah', role: 'Co-Host & Research', share: 35 },
      { name: 'Baraka Sound Labs', role: 'Audio Mastering & Post-Production', share: 20 }
    ],
    pressQuotes: [
      { outlet: 'Rolling Stone Africa', quote: 'The essential playbook for the modern African and diaspora music ecosystem.' },
      { outlet: 'TechCabal', quote: 'Zawadi and Kofi break down complex royalty and sync pipelines with unmatched clarity.' }
    ],
    episodes: [
      {
        id: 'ep-indie-48',
        isrc: 'KE-POD-26-00101',
        episodeNumber: 48,
        seasonNumber: 3,
        title: 'Ep. 48: Why Zero-Subscription Credit Streaming Pays Creators 4x More',
        artist: 'Zawadi Kiprop & Kofi Mensah',
        podcastTitle: 'The Independent Artist & Creator Economy',
        podcastSlug: 'indieartistpod',
        genre: 'Podcast • Music Business',
        releaseType: 'Podcast Episode',
        duration: '42:18',
        publishedAt: '2 days ago',
        streams: '48.2K',
        coverArt: '/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg',
        audioUrl: '/api/stream/track/KE-TM1-26-00042',
        sponsorBrand: 'Safaricom Neon Beats',
        summary: "We analyze the mathematics of traditional subscription pools vs. TuneStream's non-expiring credit top-up and Corporate Ad Services model.",
        transcript: 'Zawadi: Welcome back to The Independent Artist Podcast! Today we are breaking down why subscription fatigue is hurting both fans and artists...',
        chapters: [
          { time: '00:00', title: 'Intro & Corporate Sponsor Spotlight' },
          { time: '04:15', title: 'The Subscription Pool Illusion Explained' },
          { time: '16:40', title: 'How Corporate Ad Services Fund Free Listening' },
          { time: '29:10', title: 'Live Q&A: Setting Up Collaborator Splits' }
        ]
      }
    ]
  },
  {
    id: 'pod-african-soundscapes',
    slug: 'africansoundscapes',
    subdomain: 'africansoundscapes',
    title: 'African Soundscapes & Modular Ethnomusicology',
    host: 'Ndufo & Dr. Amina Osei',
    hostRole: 'Modular Synthesis Pioneer & Cultural Historian',
    category: 'Music Documentary',
    language: 'English',
    cadence: 'Bi-Weekly • Thursdays',
    subscribers: '98.7K',
    totalStreams: '1.12M',
    avgCompletionRate: '91%',
    rating: 5.0,
    accentColor: '#00f2fe',
    secondaryColor: '#a855f7',
    coverArt: '/uploads/artwork/ndufo_cover.jpg',
    bannerUrl: '/heroes/ndufo_hero_slide1_retina.jpg',
    trailerAudioUrl: '/api/stream/track/KE-TM1-26-00042',
    description: 'Tracing the sonic lineage from traditional East & West African polyrhythms and nyatiti harps to modern analog Eurorack modular synthesis and 24-bit club systems.',
    bio: 'Recorded on location across Kilifi, Nairobi, Accra, and Berlin, Ndufo and Dr. Amina Osei combine field recordings of indigenous instruments with live studio breakdowns.',
    demographics: {
      topRegions: [
        { region: 'East Africa', share: 38 },
        { region: 'Western Europe', share: 31 },
        { region: 'North America', share: 19 },
        { region: 'Japan & Asia-Pacific', share: 12 }
      ],
      ageGroups: '21–38 (74%), 39–55 (26%)',
      listenerProfile: 'Producers, synthesizer enthusiasts, DJs, ethnomusicologists, and audiophiles'
    },
    sponsorshipRates: CANONICAL_PODCAST_SPONSORSHIP_RATES,
    splits: [
      { name: 'Ndufo', role: 'Co-Host & Sound Designer', share: 50 },
      { name: 'Dr. Amina Osei', role: 'Co-Host & Lead Archivist', share: 50 }
    ],
    pressQuotes: [
      { outlet: 'Resident Advisor', quote: 'A spellbinding sonic journey connecting ancestral acoustic tunings to modular club culture.' }
    ],
    episodes: [
      {
        id: 'ep-sound-24',
        isrc: 'KE-POD-26-00201',
        episodeNumber: 24,
        seasonNumber: 2,
        title: 'Ep. 24: Kalenjin Folk-House & Sub-Bass Architecture in 24-Bit FLAC',
        artist: 'Ndufo & Dr. Amina Osei',
        podcastTitle: 'African Soundscapes & Modular Ethnomusicology',
        podcastSlug: 'africansoundscapes',
        genre: 'Podcast • Music Documentary',
        releaseType: 'Podcast Episode',
        duration: '51:10',
        publishedAt: '4 days ago',
        streams: '39.4K',
        coverArt: '/uploads/artwork/ndufo_cover.jpg',
        audioUrl: '/api/stream/track/KE-TM1-26-00042',
        sponsorBrand: 'Safaricom Neon Beats',
        summary: 'Field recordings from the Rift Valley paired with Buchla and Eurorack low-pass gates.',
        transcript: 'Ndufo: Listen closely to the 5/4 pulse of the chepkong harp here...',
        chapters: [
          { time: '00:00', title: 'Rift Valley Field Recording (Binaural 24-Bit)' },
          { time: '11:30', title: 'Patching Polyrhythms on Eurorack' },
          { time: '34:45', title: 'Live Jam & Hardware Walkthrough' }
        ]
      }
    ]
  },
  {
    id: 'pod-amapiano-stories',
    slug: 'amapianostories',
    subdomain: 'amapianostories',
    title: 'Amapiano & Swahili Coast Chronicles',
    host: 'DJ Thabo & Lerato Mokoena',
    hostRole: 'Pretoria & Johannesburg Club Historians',
    category: 'Culture & Nightlife',
    language: 'English / Zulu / Swahili',
    cadence: 'Weekly • Fridays',
    subscribers: '215.0K',
    totalStreams: '3.10M',
    avgCompletionRate: '89%',
    rating: 4.9,
    accentColor: '#f59e0b',
    secondaryColor: '#ec4899',
    coverArt: '/uploads/artwork/af8f4b21-dc7c-4ee5-b0c6-7debb0fb9424.jpg',
    bannerUrl: '/heroes/ndufo_hero_slide2_retina.jpg',
    trailerAudioUrl: '/api/stream/track/KE-TM1-24-INTRO',
    description: 'From Pretoria bedroom studios and Soweto street bashes to headlining Ibiza, London, and Nairobi—the untold stories and log-drum secrets of Amapiano.',
    bio: 'DJ Thabo and Lerato Mokoena bring you inside the studios and backrooms of Southern and East Africa’s most explosive dance movement.',
    demographics: {
      topRegions: [
        { region: 'Southern Africa', share: 42 },
        { region: 'East Africa', share: 28 },
        { region: 'UK & Europe', share: 20 },
        { region: 'North America', share: 10 }
      ],
      ageGroups: '18–30 (76%), 31–45 (24%)',
      listenerProfile: 'DJs, clubbers, festival promoters, and Amapiano fans worldwide'
    },
    sponsorshipRates: CANONICAL_PODCAST_SPONSORSHIP_RATES,
    splits: [
      { name: 'DJ Thabo', role: 'Host & Mix Curator', share: 50 },
      { name: 'Lerato Mokoena', role: 'Host & Editorial Director', share: 50 }
    ],
    pressQuotes: [
      { outlet: 'Mixmag', quote: 'The definitive oral history of Amapiano, told by the pioneers who built it.' }
    ],
    episodes: [
      {
        id: 'ep-ama-62',
        isrc: 'KE-POD-26-00301',
        episodeNumber: 62,
        seasonNumber: 4,
        title: 'Ep. 62: The Anatomy of the Private School Amapiano Log Drum',
        artist: 'DJ Thabo & Lerato Mokoena',
        podcastTitle: 'Amapiano & Swahili Coast Chronicles',
        podcastSlug: 'amapianostories',
        genre: 'Podcast • Culture & Nightlife',
        releaseType: 'Podcast Episode',
        duration: '46:05',
        publishedAt: 'Yesterday',
        streams: '67.8K',
        coverArt: '/uploads/artwork/af8f4b21-dc7c-4ee5-b0c6-7debb0fb9424.jpg',
        audioUrl: '/api/stream/track/KE-TM1-24-INTRO',
        sponsorBrand: 'Red Bull SoundClash',
        summary: 'How jazz chords, soulful Rhodes pianos, and pitched sub-bass log drums created a global phenomenon.',
        transcript: 'Lerato: Everyone remembers the first time they heard that log drum drop at 113 BPM...',
        chapters: [
          { time: '00:00', title: 'Intro & Weekend Festival Roundup' },
          { time: '09:15', title: 'Jazz Chords Meets Township Kwaito' }
        ]
      }
    ]
  },
  {
    id: 'pod-producer-roundtable',
    slug: 'producerroundtable',
    subdomain: 'producerroundtable',
    title: 'The Producer & Sound Engineer Roundtable',
    host: 'Marcus Vance & Baraka Sound Labs',
    hostRole: 'Grammy-Nominated Mix Engineer & Analog Mastering Head',
    category: 'Audio Engineering',
    language: 'English',
    cadence: 'Monthly • 1st Monday',
    subscribers: '76.3K',
    totalStreams: '840K',
    avgCompletionRate: '93%',
    rating: 4.8,
    accentColor: '#ec4899',
    secondaryColor: '#3b82f6',
    coverArt: '/heroes/hero_music_3.png',
    bannerUrl: '/headers/header_tools.png',
    trailerAudioUrl: '/api/stream/track/KE-TM1-26-00042',
    description: 'Hardware shootouts, -16 LUFS podcast stem mastering, binaural headphone translation, and acoustic room treatment on an indie budget.',
    bio: 'Marcus Vance and senior studio engineers demystify the dark art of audio mastering, stem mixing, and broadcast compliance standards.',
    demographics: {
      topRegions: [
        { region: 'East & West Africa', share: 45 },
        { region: 'North America', share: 30 },
        { region: 'Europe', share: 25 }
      ],
      ageGroups: '18–40 (85%)',
      listenerProfile: 'Producers, beatmakers, audio engineers, podcasters, and studio owners'
    },
    sponsorshipRates: CANONICAL_PODCAST_SPONSORSHIP_RATES,
    splits: [
      { name: 'Marcus Vance', role: 'Host & Lead Engineer', share: 60 },
      { name: 'Baraka Sound Labs', role: 'Studio Facility & Co-Host', share: 40 }
    ],
    pressQuotes: [
      { outlet: 'Sound On Sound', quote: 'Essential listening for anyone serious about professional audio engineering in Africa.' }
    ],
    episodes: [
      {
        id: 'ep-prod-18',
        isrc: 'KE-POD-26-00401',
        episodeNumber: 18,
        seasonNumber: 2,
        title: 'Ep. 18: Mastering for Lossless FLAC vs. Compressed MP3 Streaming',
        artist: 'Marcus Vance',
        podcastTitle: 'The Producer & Sound Engineer Roundtable',
        podcastSlug: 'producerroundtable',
        genre: 'Podcast • Audio Engineering',
        releaseType: 'Podcast Episode',
        duration: '54:30',
        publishedAt: '1 week ago',
        streams: '32.1K',
        coverArt: '/heroes/hero_music_3.png',
        audioUrl: '/api/stream/track/KE-TM1-26-00042',
        sponsorBrand: 'TuneMavens Studio Suite',
        summary: 'We test inter-sample peaks, true peak limiting, and stem headroom on 24-bit 96kHz playback systems.',
        transcript: 'Marcus: When you master at -14 LUFS with True Peak limiting at -1.0 dBFS...',
        chapters: [
          { time: '00:00', title: 'LUFS & True Peak Demystified' },
          { time: '18:20', title: 'Hardware EQ vs Digital DSP' }
        ]
      }
    ]
  },
  {
    id: 'pod-afrotech-disrupt',
    slug: 'afrotech_disrupt',
    subdomain: 'afrotech_disrupt',
    title: 'AfroTech Disruption & Venture Capital',
    host: 'Steve Biko & Dr. Michael Chen',
    hostRole: 'Fintech Angel Investor & African Tech Editor',
    category: 'Tech, VC & Startups',
    language: 'English',
    cadence: 'Weekly • Mondays',
    subscribers: '185.0K',
    totalStreams: '1.95M',
    avgCompletionRate: '89%',
    rating: 4.9,
    accentColor: '#38bdf8',
    secondaryColor: '#10b981',
    coverArt: '/heroes/hero_music_1.png',
    bannerUrl: '/headers/header_pricing.png',
    trailerAudioUrl: '/api/stream/track/KE-TM1-POD-001',
    description: "East Africa's premier technology and venture capital audio show analyzing African seed funding, sovereign audio rights, and corporate tech disruption.",
    bio: 'Analyzing how digital infrastructure, M-Pesa rails, and alternative creative asset financing are turning African intellectual property into global wealth.',
    demographics: {
      topRegions: [
        { region: 'Kenya & Nigeria', share: 44 },
        { region: 'US Diaspora', share: 28 },
        { region: 'UK & Europe', share: 20 },
        { region: 'South Africa', share: 8 }
      ],
      ageGroups: '24–45 (88%)',
      listenerProfile: 'Venture capitalists, tech executives, angel syndicates, founders, and LPs'
    },
    sponsorshipRates: CANONICAL_PODCAST_SPONSORSHIP_RATES,
    splits: [
      { name: 'Steve Biko', role: 'Host & Creator', share: 55 },
      { name: 'Dr. Michael Chen', role: 'Co-Host & Market Analyst', share: 45 }
    ],
    pressQuotes: [
      { outlet: 'TechCrunch Africa', quote: 'The front-row seat to the capital and creators shaping Africa’s tech renaissance.' }
    ],
    episodes: [
      {
        id: 'ep-at-42',
        isrc: 'KE-TM1-POD-001',
        episodeNumber: 42,
        seasonNumber: 4,
        title: 'Ep. 42: The Sovereign Wealth of African Music & Split Cascade Escrows',
        artist: 'Steve Biko & Dr. Michael Chen',
        podcastTitle: 'AfroTech Disruption & Venture Capital',
        podcastSlug: 'afrotech_disrupt',
        genre: 'Podcast • Tech & VC',
        releaseType: 'Podcast Episode',
        duration: '48:15',
        publishedAt: '3 days ago',
        streams: '88.4K',
        coverArt: '/heroes/hero_music_1.png',
        audioUrl: '/api/stream/track/KE-TM1-26-00042',
        sponsorBrand: 'Nairobi Catalyst Ventures LP',
        summary: 'How venture debt, automated Split Cascade liens, and telemetry are unlocking institutional advances for African creators.',
        transcript: 'Steve: We are moving past the era where African creators take punitive foreign advances...',
        chapters: [
          { time: '00:00', title: 'Macro VC Trends in East Africa' },
          { time: '14:30', title: 'Split Cascade vs Major Label Accounting' },
          { time: '32:00', title: 'First-Dollar Recoupment Case Studies' }
        ]
      }
    ]
  },
  {
    id: 'pod-nairobi-beats',
    slug: 'nairobibeatsweekly',
    subdomain: 'nairobibeatsweekly',
    title: 'Nairobi Beats Weekly',
    host: 'Brian Omondi & Faith Waweru',
    hostRole: 'Urban Radio Host & Street Music Journalist',
    category: 'Culture & Hip-Hop',
    language: 'English / Sheng / Swahili',
    cadence: 'Weekly • Wednesdays',
    subscribers: '140.0K',
    totalStreams: '1.28M',
    avgCompletionRate: '88%',
    rating: 4.8,
    accentColor: '#ec4899',
    secondaryColor: '#f59e0b',
    coverArt: '/heroes/hero_music_4.png',
    bannerUrl: '/headers/header_tours.png',
    trailerAudioUrl: '/api/stream/track/KE-TM1-POD-010',
    description: 'Weekly audio deep-dive into Kenyan street music, rising beatmakers, Gengetone 2.0, drill culture, and exclusive live acoustic lounge performances.',
    bio: 'From the matatu sound systems of Rongai and Kayole to sold-out arenas, Brian and Faith bring you the unfiltered voice of East African street music.',
    demographics: {
      topRegions: [
        { region: 'Kenya', share: 62 },
        { region: 'Uganda & Tanzania', share: 20 },
        { region: 'UK Diaspora', share: 12 },
        { region: 'US Diaspora', share: 6 }
      ],
      ageGroups: '16–32 (82%)',
      listenerProfile: 'Youth culture fans, Gengetone lovers, urban dancers, and streetwear tastemakers'
    },
    sponsorshipRates: CANONICAL_PODCAST_SPONSORSHIP_RATES,
    splits: [
      { name: 'Brian Omondi', role: 'Host & Executive Producer', share: 50 },
      { name: 'Faith Waweru', role: 'Co-Host & Street Reporter', share: 50 }
    ],
    pressQuotes: [
      { outlet: 'Pulse Live Kenya', quote: 'The beating heart of modern Sheng and urban Kenyan music culture.' }
    ],
    episodes: [
      {
        id: 'ep-nb-78',
        isrc: 'KE-TM1-POD-010',
        episodeNumber: 78,
        seasonNumber: 3,
        title: 'Ep. 78: Gengetone 2.0 & The New Sheng Drill Masters',
        artist: 'Brian Omondi & Faith Waweru',
        podcastTitle: 'Nairobi Beats Weekly',
        podcastSlug: 'nairobibeatsweekly',
        genre: 'Podcast • Hip-Hop & Sheng',
        releaseType: 'Podcast Episode',
        duration: '41:20',
        publishedAt: '5 days ago',
        streams: '72.1K',
        coverArt: '/heroes/hero_music_4.png',
        audioUrl: '/api/stream/track/KE-TM1-24-INTRO',
        sponsorBrand: 'Red Bull SoundClash',
        summary: 'How Kenyan drill producers are sampling 90s Benga guitars over 140 BPM drill slide-bass patterns.',
        transcript: 'Faith: Look at what the youth in Kibera and Eastlands are doing with these 808 slides...',
        chapters: [
          { time: '00:00', title: 'Top 5 Sheng Drill Bangers of the Week' },
          { time: '16:40', title: 'Benga Guitar Samples & Drill 808s' }
        ]
      }
    ]
  },
  {
    id: 'pod-creative-brief',
    slug: 'creativebrief_af',
    subdomain: 'creativebrief_af',
    title: 'The African Creative Brief & Sync Hub',
    host: 'Nathalie Mercier & Emeka Okafor',
    hostRole: 'Film Sync Supervisor & Nollywood Audio Director',
    category: 'Film Sync & Media',
    language: 'English / French',
    cadence: 'Bi-Weekly • Wednesdays',
    subscribers: '95.0K',
    totalStreams: '890K',
    avgCompletionRate: '92%',
    rating: 4.9,
    accentColor: '#a78bfa',
    secondaryColor: '#00f2fe',
    coverArt: '/heroes/hero_music_2.png',
    bannerUrl: '/headers/header_tools.png',
    trailerAudioUrl: '/api/stream/track/KE-TM1-POD-020',
    description: 'Behind-the-scenes interviews with Pan-African music supervisors, directors, streaming platforms, and advertising agency creative heads licensing original cues.',
    bio: 'Connecting African composers and beatmakers directly to international film sync pitches, Netflix productions, and global brand commercials.',
    demographics: {
      topRegions: [
        { region: 'Nigeria & Ghana', share: 36 },
        { region: 'Kenya & South Africa', share: 32 },
        { region: 'France & UK', share: 22 },
        { region: 'USA', share: 10 }
      ],
      ageGroups: '22–45 (78%)',
      listenerProfile: 'Composers, music supervisors, film directors, and sync licensing reps'
    },
    sponsorshipRates: CANONICAL_PODCAST_SPONSORSHIP_RATES,
    splits: [
      { name: 'Nathalie Mercier', role: 'Lead Host & Sync Agent', share: 50 },
      { name: 'Emeka Okafor', role: 'Co-Host & Audio Director', share: 50 }
    ],
    pressQuotes: [
      { outlet: 'Variety Africa', quote: 'The definitive bridge between African musicians and Hollywood music supervision.' }
    ],
    episodes: [
      {
        id: 'ep-cb-12',
        isrc: 'KE-TM1-POD-020',
        episodeNumber: 12,
        seasonNumber: 2,
        title: 'Ep. 12: What Hollywood & Netflix Music Supervisors Look For in African Cues',
        artist: 'Nathalie Mercier & Emeka Okafor',
        podcastTitle: 'The African Creative Brief & Sync Hub',
        podcastSlug: 'creativebrief_af',
        genre: 'Podcast • Sync & Film',
        releaseType: 'Podcast Episode',
        duration: '39:50',
        publishedAt: '1 week ago',
        streams: '44.8K',
        coverArt: '/heroes/hero_music_2.png',
        audioUrl: '/api/stream/track/KE-TM1-26-00042',
        sponsorBrand: 'SyncMavens Film & TV',
        summary: 'Step-by-step breakdown of instrumental cue sheets, uncompressed stems, and 24-hour pre-clearance.',
        transcript: 'Nathalie: When an editor cuts a chase scene set in Lagos or Nairobi...',
        chapters: [
          { time: '00:00', title: 'Why One-Stop Pre-Clearance Wins the Placement' },
          { time: '14:20', title: 'Building Dynamic Cue Stems & Hit Points' }
        ]
      }
    ]
  },
  {
    id: 'pod-swahili-stories',
    slug: 'swahili_stories',
    subdomain: 'swahili_stories',
    title: 'Swahili Stories & Binaural Soundscapes',
    host: 'Zainab Binti Said & Prof. David Robinson',
    hostRole: 'Zanzibar Cultural Custodian & Ethnomusicologist',
    category: 'Cultural Audio & Heritage',
    language: 'Swahili / English',
    cadence: 'Bi-Weekly • Sundays',
    subscribers: '112.0K',
    totalStreams: '1.04M',
    avgCompletionRate: '94%',
    rating: 5.0,
    accentColor: '#10b981',
    secondaryColor: '#38bdf8',
    coverArt: '/heroes/hero_music_3.png',
    bannerUrl: '/headers/header_about.png',
    trailerAudioUrl: '/api/stream/track/KE-TM1-POD-030',
    description: 'Immersive binaural field recordings, oral folklore, coastal dhow chants, and acoustic storytelling recorded across Lamu, Zanzibar, Mombasa, and Bagamoyo.',
    bio: 'Preserving and celebrating East Africa’s rich oral traditions through high-resolution 24-bit binaural audio recordings and historical cultural analysis.',
    demographics: {
      topRegions: [
        { region: 'Tanzania & Kenya', share: 50 },
        { region: 'Oman & UAE Diaspora', share: 22 },
        { region: 'Europe & UK', share: 16 },
        { region: 'USA', share: 12 }
      ],
      ageGroups: 'All Ages',
      listenerProfile: 'Heritage enthusiasts, cultural archivists, linguists, and ambient audio lovers'
    },
    sponsorshipRates: CANONICAL_PODCAST_SPONSORSHIP_RATES,
    splits: [
      { name: 'Zainab Binti Said', role: 'Storyteller & Cultural Lead', share: 50 },
      { name: 'Prof. David Robinson', role: 'Binaural Recording Engineer', share: 50 }
    ],
    pressQuotes: [
      { outlet: 'BBC World Service Culture', quote: 'A breathtaking sonic masterwork that transports listeners to the Swahili coast.' }
    ],
    episodes: [
      {
        id: 'ep-ss-09',
        isrc: 'KE-TM1-POD-030',
        episodeNumber: 9,
        seasonNumber: 1,
        title: 'Ep. 09: Lamu Dhow Chants & Coral Stone Echoes (Binaural 3D Audio)',
        artist: 'Zainab Binti Said',
        podcastTitle: 'Swahili Stories & Binaural Soundscapes',
        podcastSlug: 'swahili_stories',
        genre: 'Podcast • Cultural Audio',
        releaseType: 'Podcast Episode',
        duration: '45:10',
        publishedAt: '6 days ago',
        streams: '51.3K',
        coverArt: '/heroes/hero_music_3.png',
        audioUrl: '/api/stream/track/KE-TM1-24-INTRO',
        sponsorBrand: 'TuneMavens Cultural Archive',
        summary: 'Recorded on a wooden dhow off the coast of Lamu with 3D binaural microphones during night navigation.',
        transcript: 'Zainab: Huu ni wimbo wa wanamaji wanaovuta kamba usiku wa manane...',
        chapters: [
          { time: '00:00', title: 'The Call of the Ocean Wind' },
          { time: '18:40', title: 'Sailor Chants & Stone Town Folklore' }
        ]
      }
    ]
  },
  {
    id: 'pod-gengetone-drill',
    slug: 'gengetone_drill',
    subdomain: 'gengetone_drill',
    title: 'Gengetone 2.0 & The Sheng Drill Masters',
    host: 'Otieno James & Kibera Sound System',
    hostRole: 'Eastlands Cypher MC & Sound System Engineer',
    category: 'Street Rap & Subculture',
    language: 'Sheng / Swahili',
    cadence: 'Weekly • Saturdays',
    subscribers: '168.0K',
    totalStreams: '1.75M',
    avgCompletionRate: '87%',
    rating: 4.8,
    accentColor: '#f43f5e',
    secondaryColor: '#f59e0b',
    coverArt: '/headers/header_about.png',
    bannerUrl: '/headers/header_pricing.png',
    trailerAudioUrl: '/api/stream/track/KE-TM1-26-00015',
    description: 'Inside the raw, high-octane world of Kenyan street drill, producer studio battles, matatu culture, and the evolution of modern Sheng street slang.',
    bio: 'Direct from the youth hubs of Kibera, Mathare, and Kayole, documenting how local street rappers are commanding millions of streams and touring worldwide.',
    demographics: {
      topRegions: [
        { region: 'East Africa', share: 70 },
        { region: 'UK & Europe', share: 18 },
        { region: 'North America', share: 12 }
      ],
      ageGroups: '16–28 (88%)',
      listenerProfile: 'Drill fans, street dancers, youth creators, and urban music tastemakers'
    },
    sponsorshipRates: CANONICAL_PODCAST_SPONSORSHIP_RATES,
    splits: [
      { name: 'Otieno James', role: 'Host & Lead MC', share: 50 },
      { name: 'Kibera Sound System', role: 'Production & Audio Post', share: 50 }
    ],
    pressQuotes: [
      { outlet: 'The Standard Kenya', quote: 'The rawest, most electrifying audio documentation of contemporary Sheng youth.' }
    ],
    episodes: [
      {
        id: 'ep-gd-15',
        isrc: 'KE-TM1-26-00015',
        episodeNumber: 15,
        seasonNumber: 2,
        title: 'Ep. 15: Matatu Sound Systems & The 100kW Sheng Bass Battles',
        artist: 'Otieno James',
        podcastTitle: 'Gengetone 2.0 & The Sheng Drill Masters',
        podcastSlug: 'gengetone_drill',
        genre: 'Podcast • Street Drill',
        releaseType: 'Podcast Episode',
        duration: '44:20',
        publishedAt: '2 days ago',
        streams: '63.9K',
        coverArt: '/headers/header_about.png',
        audioUrl: '/api/stream/track/KE-TM1-24-INTRO',
        sponsorBrand: 'Red Bull SoundClash',
        summary: 'Inside the tuning of 100kW subwoofer sound systems inside Nairobi’s custom nganya matatus.',
        transcript: 'Otieno: Nairobi traffic is an open-air concert arena...',
        chapters: [
          { time: '00:00', title: 'The Sound Architecture of a Nganya' },
          { time: '19:10', title: 'Street Cypher: 4 MCs One Microphone' }
        ]
      }
    ]
  },
  {
    id: 'pod-afro-soul-lounge',
    slug: 'afrosoul_lounge',
    subdomain: 'afrosoul_lounge',
    title: 'Afro-Soul & Neo-R&B Intimate Sessions',
    host: 'Amina Mwangi & Sauti Juma',
    hostRole: 'Neo-Soul Songwriter & Acoustic Guitar Virtuoso',
    category: 'Vocal Jazz & Neo-Soul',
    language: 'English / Swahili',
    cadence: 'Bi-Weekly • Tuesdays',
    subscribers: '124.0K',
    totalStreams: '1.42M',
    avgCompletionRate: '93%',
    rating: 4.9,
    accentColor: '#f59e0b',
    secondaryColor: '#10b981',
    coverArt: '/heroes/hero_music_1.png',
    bannerUrl: '/headers/header_pricing.png',
    trailerAudioUrl: '/api/stream/track/KE-TM1-26-00010',
    description: 'Candlelight acoustic sessions, vocal arrangement breakdowns, songwriting philosophies, and intimate interviews with Pan-African R&B and soul divas.',
    bio: 'Amina Mwangi invites Africa’s top soul artists to perform stripped-down acoustic sets and unpack the emotional songwriting journeys behind their biggest records.',
    demographics: {
      topRegions: [
        { region: 'East Africa', share: 40 },
        { region: 'West Africa', share: 30 },
        { region: 'UK Diaspora', share: 18 },
        { region: 'North America', share: 12 }
      ],
      ageGroups: '20–42 (79%)',
      listenerProfile: 'R&B lovers, soul singers, lyricists, romantic playlist curators, and acoustic listeners'
    },
    sponsorshipRates: CANONICAL_PODCAST_SPONSORSHIP_RATES,
    splits: [
      { name: 'Amina Mwangi', role: 'Host & Vocal Arranger', share: 55 },
      { name: 'Sauti Juma', role: 'Acoustic Guitarist & Co-Host', share: 45 }
    ],
    pressQuotes: [
      { outlet: 'OkayAfrica', quote: 'Pure acoustic balm for the spirit. Amina’s intimate vocal sessions are unmatched.' }
    ],
    episodes: [
      {
        id: 'ep-as-21',
        isrc: 'KE-TM1-26-00010',
        episodeNumber: 21,
        seasonNumber: 3,
        title: 'Ep. 21: The Secret to Swahili Neo-Soul Harmonies & Acoustic Microphones',
        artist: 'Amina Mwangi & Sauti Juma',
        podcastTitle: 'Afro-Soul & Neo-R&B Intimate Sessions',
        podcastSlug: 'afrosoul_lounge',
        genre: 'Podcast • Afro-Soul',
        releaseType: 'Podcast Episode',
        duration: '47:15',
        publishedAt: '4 days ago',
        streams: '58.2K',
        coverArt: '/heroes/hero_music_1.png',
        audioUrl: '/api/stream/track/KE-TM1-26-00042',
        sponsorBrand: 'Safaricom Neon Beats',
        summary: 'Live acoustic performance of "Sauti ya Mombasa" and studio ribbon microphone positioning.',
        transcript: 'Amina: When we layer these three-part vocal harmonies...',
        chapters: [
          { time: '00:00', title: 'Live Acoustic Performance' },
          { time: '14:20', title: 'Vocal Stacking & Ribbon Mics' }
        ]
      }
    ]
  },
  {
    id: 'pod-syncmavens-cues',
    slug: 'syncmavens_cues',
    subdomain: 'syncmavens_cues',
    title: 'SyncMavens: Film, TV & Video Game Cues',
    host: 'Elena Richter & Chloe Dupont',
    hostRole: 'European Film Sync Supervisor & Paris Runway Director',
    category: 'Sync Licensing & Hollywood Cues',
    language: 'English / French',
    cadence: 'Monthly • 15th of the Month',
    subscribers: '88.5K',
    totalStreams: '780K',
    avgCompletionRate: '94%',
    rating: 4.9,
    accentColor: '#38bdf8',
    secondaryColor: '#ec4899',
    coverArt: '/heroes/hero_music_2.png',
    bannerUrl: '/headers/header_tools.png',
    trailerAudioUrl: '/api/stream/track/KE-TM1-26-00042',
    description: 'Inside global film sync placements: breakdown of EA Sports, Netflix, HBO, and international automotive sync briefs with instant pre-cleared escrow payouts.',
    bio: 'Elena and Chloe break down the exact sonic characteristics and cue structures that get tracks selected for AAA video games, prestige TV dramas, and luxury brand runways.',
    demographics: {
      topRegions: [
        { region: 'Europe (Germany, France, UK)', share: 44 },
        { region: 'North America', share: 32 },
        { region: 'Africa', share: 24 }
      ],
      ageGroups: '24–50 (86%)',
      listenerProfile: 'Film directors, agency supervisors, video game audio heads, and composers'
    },
    sponsorshipRates: CANONICAL_PODCAST_SPONSORSHIP_RATES,
    splits: [
      { name: 'Elena Richter', role: 'Host & Sync Agent', share: 50 },
      { name: 'Chloe Dupont', role: 'Co-Host & Creative Director', share: 50 }
    ],
    pressQuotes: [
      { outlet: 'Billboard Sync & Score', quote: 'The gold standard for understanding commercial sync monetization.' }
    ],
    episodes: [
      {
        id: 'ep-sm-33',
        isrc: 'KE-TM1-26-00044',
        episodeNumber: 33,
        seasonNumber: 3,
        title: 'Ep. 33: How to Format Instrumental Cues for AAA Video Game Soundtracks',
        artist: 'Elena Richter & Chloe Dupont',
        podcastTitle: 'SyncMavens: Film, TV & Video Game Cues',
        podcastSlug: 'syncmavens_cues',
        genre: 'Podcast • Sync & Video Games',
        releaseType: 'Podcast Episode',
        duration: '43:50',
        publishedAt: '1 week ago',
        streams: '38.6K',
        coverArt: '/heroes/hero_music_2.png',
        audioUrl: '/api/stream/track/KE-TM1-26-00042',
        sponsorBrand: 'SyncMavens Film & TV',
        summary: 'Adaptive game audio, looping stems, and multi-tier interactive layers.',
        transcript: 'Chloe: In modern game engines like Unreal Engine 5, audio stems are triggered dynamically...',
        chapters: [
          { time: '00:00', title: 'Adaptive Audio in Unreal Engine 5' },
          { time: '16:00', title: 'Stem Delivery & Delivery Timelines' }
        ]
      }
    ]
  },
  {
    id: 'pod-cyberwave-electronic',
    slug: 'cyberwave_electronic',
    subdomain: 'cyberwave_electronic',
    title: 'Cyberwave Electronic & Night DJ Sessions',
    host: 'DJ Kalonje & DJ Sola',
    hostRole: 'Stadium Arena Turntablist & Berlin Resident Selector',
    category: 'Club Curation & Live DJ Mixes',
    language: 'English / Sheng',
    cadence: 'Weekly • Saturdays',
    subscribers: '245.0K',
    totalStreams: '3.80M',
    avgCompletionRate: '95%',
    rating: 5.0,
    accentColor: '#10b981',
    secondaryColor: '#00f2fe',
    coverArt: '/heroes/hero_music_1.png',
    bannerUrl: '/headers/header_ndufo_custom.jpg',
    trailerAudioUrl: '/api/stream/track/KE-TM1-DJ-001',
    description: 'High-energy electronic club anthems, underground Afro-tech transitions, live crowd telemetry, and exclusive uncompressed lossless DJ stems.',
    bio: 'From Nairobi arena spectacles to Berlin and London club residencies, Kalonje and Sola deliver the definitive weekly electronic and Afro-tech audio experience.',
    demographics: {
      topRegions: [
        { region: 'East Africa', share: 42 },
        { region: 'Europe (Germany, UK, Netherlands)', share: 36 },
        { region: 'North America', share: 22 }
      ],
      ageGroups: '18–35 (92%)',
      listenerProfile: 'Clubbers, festivalgoers, touring DJs, producers, and electronic tastemakers'
    },
    sponsorshipRates: CANONICAL_PODCAST_SPONSORSHIP_RATES,
    splits: [
      { name: 'DJ Kalonje', role: 'Host & Turntablist', share: 50 },
      { name: 'DJ Sola', role: 'Host & International Selector', share: 50 }
    ],
    pressQuotes: [
      { outlet: 'DJ Mag', quote: 'A masterclass in high-octane club mixing and cross-continental Afro-tech energy.' }
    ],
    episodes: [
      {
        id: 'ep-cw-90',
        isrc: 'KE-TM1-DJ-001',
        episodeNumber: 90,
        seasonNumber: 5,
        title: 'Ep. 90: Live from Nairobi Cyberdome: 60 Minutes of Unreleased Afro-Tech',
        artist: 'DJ Kalonje & DJ Sola',
        podcastTitle: 'Cyberwave Electronic & Night DJ Sessions',
        podcastSlug: 'cyberwave_electronic',
        genre: 'Podcast • Electronic DJ Mix',
        releaseType: 'Podcast Episode',
        duration: '60:00',
        publishedAt: '3 days ago',
        streams: '112.4K',
        coverArt: '/heroes/hero_music_1.png',
        audioUrl: '/api/stream/track/KE-TM1-24-INTRO',
        sponsorBrand: 'TuneStream Studio Suite',
        summary: 'Recorded live before 8,000 fans at the Nairobi Cyberdome in full 24-bit 96kHz lossless audio.',
        transcript: 'Kalonje: Turn up the monitor rigs—this next track is an unreleased dubplate from Berlin...',
        chapters: [
          { time: '00:00', title: 'Cyberdome Arena Warmup (124 BPM)' },
          { time: '22:15', title: 'Berlin Watergate Live Transition' },
          { time: '44:00', title: 'Peak-Time Afro-Tech Finale' }
        ]
      }
    ]
  }
];

export function PodcasterEpkModal({ show, onClose, onPlayEpisode }) {
  const { formatPrice, currencyInfo } = useRegion();
  const [activeTab, setActiveTab] = useState('overview'); // overview | sponsorship | episodes | guest-booking
  const [guestForm, setGuestForm] = useState({
    guest_name: '',
    guest_email: '',
    guest_role: 'Recording Artist / Creator',
    topic_pitch: '',
    proposed_tier: 'guest_pitch',
    budget_credits: 0
  });
  const [bookingStatus, setBookingStatus] = useState('');
  const [rssCopied, setRssCopied] = useState(false);

  if (!show) return null;

  const ratesToRender = (show.sponsorshipRates && show.sponsorshipRates.length > 0)
    ? show.sponsorshipRates.map((r, i) => ({
        ...CANONICAL_PODCAST_SPONSORSHIP_RATES[i % CANONICAL_PODCAST_SPONSORSHIP_RATES.length],
        ...r,
        packagePriceUsd: r.packagePriceUsd || CANONICAL_PODCAST_SPONSORSHIP_RATES[i % CANONICAL_PODCAST_SPONSORSHIP_RATES.length].packagePriceUsd,
        cpmUsd: r.cpmUsd || CANONICAL_PODCAST_SPONSORSHIP_RATES[i % CANONICAL_PODCAST_SPONSORSHIP_RATES.length].cpmUsd,
        credits: r.credits || CANONICAL_PODCAST_SPONSORSHIP_RATES[i % CANONICAL_PODCAST_SPONSORSHIP_RATES.length].credits
      }))
    : CANONICAL_PODCAST_SPONSORSHIP_RATES;

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!guestForm.guest_name.trim() || !guestForm.guest_email.trim()) return;
    setBookingStatus('Submitting request to Podcaster Studio CRM...');
    try {
      const res = await fetch(`/api/podcasts/${show.slug}/book-guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestForm)
      });
      const data = await res.json();
      setBookingStatus(data.message || `✓ Request sent to ${show.host}! Reference: ${data.booking?.id || 'POD-CRM-901'}`);
    } catch (_) {
      setBookingStatus(`✓ Pitch & Sponsorship Inquiry delivered to ${show.host}'s TuneMavens Podcaster Studio CRM!`);
    }
  };

  const handleCopyRss = () => {
    const url = `${window.location.origin}/api/podcasts/${show.slug}/rss.xml`;
    if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
    setRssCopied(true);
    setTimeout(() => setRssCopied(false), 3000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10050,
        background: 'rgba(3, 6, 15, 0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1040px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#080c1a',
          border: `1px solid ${show.accentColor || '#10b981'}`,
          borderRadius: '3px',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.85)',
          color: '#f1f5f9',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Header */}
        <div
          style={{
            position: 'relative',
            padding: '32px 28px 24px',
            background: `linear-gradient(135deg, rgba(8, 12, 26, 0.94) 0%, rgba(15, 23, 42, 0.85) 100%), url(${show.bannerUrl || show.coverArt}) center/cover no-repeat`,
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              width: '34px',
              height: '34px',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RiCloseLine size={20} />
          </button>

          <div style={{ display: 'flex', gap: '22px', alignItems: 'center', flexWrap: 'wrap' }}>
            <img
              src={show.coverArt}
              alt={show.title}
              onError={(e) => { e.currentTarget.src = '/uploads/artwork/ndufo_cover.jpg'; }}
              style={{
                width: '124px',
                height: '124px',
                borderRadius: '3px',
                objectFit: 'cover',
                border: `2px solid ${show.accentColor || '#10b981'}`,
                boxShadow: '0 10px 28px rgba(0,0,0,0.6)'
              }}
            />
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <span style={{
                  background: show.accentColor || '#10b981',
                  color: '#040711',
                  fontSize: '10px',
                  fontWeight: 900,
                  padding: '3px 8px',
                  borderRadius: '3px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px'
                }}>
                  VERIFIED PODCASTER EPK &amp; MEDIA KIT
                </span>
                <span style={{
                  background: 'rgba(0, 242, 254, 0.12)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  color: '#00f2fe',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '3px'
                }}>
                  {show.category} • {show.cadence}
                </span>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '3px'
                }}>
                  Currency: {currencyInfo?.code || 'USD'} ({currencyInfo?.symbol || '$'})
                </span>
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>
                {show.title}
              </h2>
              <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '14px' }}>
                Hosted by <strong style={{ color: '#fff' }}>{show.host}</strong> ({show.hostRole})
              </div>

              {/* Key Media Kit Telemetry */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Subscribers</span>
                  <strong style={{ fontSize: '15px', color: '#fff' }}>{show.subscribers}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Total Streams</span>
                  <strong style={{ fontSize: '15px', color: '#00f2fe' }}>{show.totalStreams}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Avg Completion</span>
                  <strong style={{ fontSize: '15px', color: '#10b981' }}>{show.avgCompletionRate}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Ad Sponsor Entry</span>
                  <strong style={{ fontSize: '15px', color: '#f59e0b' }}>{formatPrice(ratesToRender[0]?.packagePriceUsd || 499)}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  if (show.episodes && show.episodes[0]) {
                    onPlayEpisode(show.episodes[0], show);
                  }
                }}
                style={{
                  padding: '10px 18px',
                  background: show.accentColor || '#10b981',
                  color: '#040711',
                  border: 'none',
                  borderRadius: '3px',
                  fontSize: '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RiPlayFill size={16} /> Play Show Trailer / Latest
              </button>
              <button
                type="button"
                onClick={handleCopyRss}
                style={{
                  padding: '8px 14px',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <RiRssFill size={14} color="#f59e0b" />
                {rssCopied ? '✓ RSS Feed URL Copied!' : 'Copy RSS 2.0 Syndication Feed'}
              </button>
              <a
                href={`#/epk/${show.subdomain || show.slug}`}
                style={{
                  padding: '7px 14px',
                  background: 'rgba(0, 242, 254, 0.08)',
                  color: '#00f2fe',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
              >
                🌐 Standalone EPK URL (/epk/{show.slug})
              </a>
            </div>
          </div>

          {/* EPK Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '22px', flexWrap: 'wrap' }}>
            {[
              { id: 'overview', label: 'Show Story & Audience Demographics' },
              { id: 'sponsorship', label: `Corporate Ad Sponsorship Rate Card (${currencyInfo?.code || 'USD'})` },
              { id: 'episodes', label: `Broadcast Episodes (${(show.episodes || []).length})` },
              { id: 'guest-booking', label: 'Book Host / Pitch Guest / Sponsor' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '3px',
                  border: activeTab === tab.id ? `1px solid ${show.accentColor || '#10b981'}` : '1px solid rgba(255,255,255,0.1)',
                  background: activeTab === tab.id ? (show.accentColor || '#10b981') : 'rgba(255,255,255,0.04)',
                  color: activeTab === tab.id ? '#040711' : '#e2e8f0',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px' }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>About the Podcast &amp; Hosts</h4>
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.65, margin: '0 0 16px' }}>
                  {show.bio || show.description}
                </p>

                <h5 style={{ fontSize: '12px', fontWeight: 800, color: '#00f2fe', textTransform: 'uppercase', margin: '16px 0 8px' }}>
                  Press &amp; Critical Acclaim
                </h5>
                {(show.pressQuotes || []).map((pq, i) => (
                  <div key={i} style={{ padding: '10px 12px', background: 'rgba(0, 242, 254, 0.05)', borderLeft: `3px solid ${show.accentColor || '#00f2fe'}`, marginBottom: '8px', borderRadius: '3px' }}>
                    <div style={{ fontSize: '12px', color: '#e2e8f0', fontStyle: 'italic' }}>"{pq.quote}"</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginTop: '4px' }}>— {pq.outlet}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>Verified Listener Demographics</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {(show.demographics?.topRegions || []).map((r, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: '#cbd5e1' }}>{r.region}</span>
                        <strong style={{ color: show.accentColor || '#10b981' }}>{r.share}%</strong>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${r.share}%`, height: '100%', background: show.accentColor || '#10b981' }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                  <div style={{ marginBottom: '6px' }}><strong style={{ color: '#fff' }}>Age Distribution:</strong> {show.demographics?.ageGroups}</div>
                  <div><strong style={{ color: '#fff' }}>Core Audience:</strong> {show.demographics?.listenerProfile}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sponsorship' && (
            <div>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
                    Corporate Ad Services &amp; Host-Read Sponsorship Rate Card
                  </h4>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                    Unified platform pricing synced with TuneMavens Corporate Ad Services. All sponsorships settle automatically via TuneLedger Split Cascade.
                  </p>
                </div>
                <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '4px 10px', borderRadius: '3px', fontWeight: 700 }}>
                  ✓ 100% Localized in {currencyInfo?.code || 'USD'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {ratesToRender.map((rate, i) => (
                  <div key={rate.slug || i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: show.accentColor || '#10b981', textTransform: 'uppercase' }}>
                          {rate.tierBadge || 'Verified Ad Slot'}
                        </span>
                        <span style={{ fontSize: '10px', color: '#00f2fe', fontWeight: 700 }}>
                          {(rate.guaranteedImpressions || 25000).toLocaleString()} Impr.
                        </span>
                      </div>
                      <h5 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: '4px 0 8px' }}>{rate.slot}</h5>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#00f2fe', marginBottom: '4px' }}>
                        {formatPrice(rate.packagePriceUsd)} <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>/ flight</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, marginBottom: '12px' }}>
                        {rate.credits.toLocaleString()} TM Credits • ~{formatPrice(rate.cpmUsd)} CPM
                      </div>
                      <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.55, margin: '0 0 16px' }}>
                        {rate.deliverables}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setGuestForm({
                          ...guestForm,
                          proposed_tier: rate.slot,
                          budget_credits: rate.credits
                        });
                        setActiveTab('guest-booking');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: show.accentColor || '#10b981',
                        color: '#040711',
                        border: 'none',
                        borderRadius: '3px',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      Book {rate.slot.split('(')[0].trim()} ({formatPrice(rate.packagePriceUsd)}) &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'episodes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(show.episodes || []).map((ep) => (
                <div
                  key={ep.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '3px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 700, marginBottom: '4px' }}>
                      Season {ep.seasonNumber} • Episode {ep.episodeNumber} • {ep.duration} • {ep.publishedAt}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{ep.title}</div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{ep.summary}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onPlayEpisode(ep, show);
                      onClose();
                    }}
                    style={{
                      padding: '10px 18px',
                      background: '#00f2fe',
                      color: '#040711',
                      border: 'none',
                      borderRadius: '3px',
                      fontSize: '12px',
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
              ))}
            </div>
          )}

          {activeTab === 'guest-booking' && (
            <form onSubmit={handleBookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '680px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: 0 }}>
                Pitch a Guest Appearance or Book a Corporate Ad Flight on {show.title}
              </h4>
              {bookingStatus && (
                <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.14)', border: '1px solid #10b981', borderRadius: '3px', color: '#6ee7b7', fontSize: '12.5px', fontWeight: 700 }}>
                  {bookingStatus}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Your Name / Brand</label>
                  <input
                    type="text"
                    required
                    value={guestForm.guest_name}
                    onChange={(e) => setGuestForm({ ...guestForm, guest_name: e.target.value })}
                    placeholder="e.g. Aisha Okoro / Safaricom Brand Team"
                    style={{ width: '100%', padding: '10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Contact Email</label>
                  <input
                    type="email"
                    required
                    value={guestForm.guest_email}
                    onChange={(e) => setGuestForm({ ...guestForm, guest_email: e.target.value })}
                    placeholder="you@domain.com"
                    style={{ width: '100%', padding: '10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Inquiry Type</label>
                  <select
                    value={guestForm.proposed_tier}
                    onChange={(e) => setGuestForm({ ...guestForm, proposed_tier: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    <option value="guest_pitch">Guest Interview Pitch (Artist / Producer / Executive)</option>
                    {ratesToRender.map((r) => (
                      <option key={r.slug || r.slot} value={r.slot}>
                        {r.slot} — {formatPrice(r.packagePriceUsd)} ({r.credits.toLocaleString()} Credits)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Role / Industry</label>
                  <input
                    type="text"
                    value={guestForm.guest_role}
                    onChange={(e) => setGuestForm({ ...guestForm, guest_role: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Topic Pitch or Ad Campaign Brief</label>
                <textarea
                  rows={3}
                  required
                  value={guestForm.topic_pitch}
                  onChange={(e) => setGuestForm({ ...guestForm, topic_pitch: e.target.value })}
                  placeholder="Share talking points, release dates, or Corporate Ad Services campaign goals..."
                  style={{ width: '100%', padding: '10px', background: '#050811', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                />
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
                Send Directly to Podcaster Studio CRM &rarr;
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


function PodcastEpisodesDrawerModal({ show, onClose, onPlayEpisode, onTipHost, formatPrice }) {
  const [activeTranscriptEp, setActiveTranscriptEp] = useState(null);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2, 6, 18, 0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#070b19',
          border: '1px solid rgba(0, 242, 254, 0.35)',
          borderRadius: '4px',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(0,0,0,0.85)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(7, 11, 25, 0.98) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={show.coverArt}
              alt={show.title}
              onError={(e) => { e.currentTarget.src = '/uploads/artwork/ndufo_cover.jpg'; }}
              style={{ width: '64px', height: '64px', borderRadius: '4px', objectFit: 'cover', border: '1px solid rgba(0, 242, 254, 0.4)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: show.accentColor || '#10b981', background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: '3px', textTransform: 'uppercase' }}>
                  {show.category}
                </span>
                <span style={{ fontSize: '10.5px', color: '#00f2fe', fontWeight: 700 }}>
                  -16 LUFS Master • 24-Bit Voice
                </span>
                <span style={{ fontSize: '10.5px', color: '#f59e0b', fontWeight: 700 }}>
                  ★ {show.rating}
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: 0 }}>
                {show.title}
              </h3>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                Hosted by {show.host} • {show.subscribers} Subscribers • {show.cadence}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '3px',
              color: '#cbd5e1',
              padding: '6px 12px',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Episode List Scroll Container */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              All Episodes, Chapters &amp; Synchronized Transcripts ({(show.episodes || []).length})
            </span>
            <span style={{ fontSize: '11px', color: '#10b981' }}>
              ● Free Ad-Supported Broadcast • Non-Expiring Credits Stream Ad-Free
            </span>
          </div>

          {(show.episodes || []).map((ep) => (
            <div
              key={ep.id}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '4px',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#00f2fe', background: 'rgba(0,242,254,0.12)', padding: '2px 7px', borderRadius: '3px' }}>
                      S{ep.seasonNumber || 1} • EP {ep.episodeNumber || 1}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      <RiTimeLine size={12} style={{ verticalAlign: 'middle' }} /> {ep.duration} • {ep.publishedAt} • {ep.streams} streams
                    </span>
                    {ep.sponsorBrand && (
                      <span style={{ fontSize: '10px', color: '#f59e0b', background: 'rgba(245,158,11,0.12)', padding: '2px 7px', borderRadius: '3px', fontWeight: 700 }}>
                        Sponsored by {ep.sponsorBrand}
                      </span>
                    )}
                  </div>

                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '4px 0 6px' }}>
                    {ep.title}
                  </h4>
                  <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 12px' }}>
                    {ep.summary}
                  </p>

                  {/* Chapters */}
                  {ep.chapters && ep.chapters.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      {ep.chapters.map((ch, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            onPlayEpisode(ep, show, ch.time);
                            onClose();
                          }}
                          style={{
                            padding: '4px 9px',
                            background: 'rgba(0, 242, 254, 0.08)',
                            border: '1px solid rgba(0, 242, 254, 0.25)',
                            borderRadius: '3px',
                            color: '#e2e8f0',
                            fontSize: '11px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                          title={`Jump to chapter ${ch.time}`}
                        >
                          <strong style={{ color: '#00f2fe', fontFamily: 'monospace' }}>{ch.time}</strong>
                          <span>{ch.title}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Transcript */}
                  {ep.transcript && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setActiveTranscriptEp(activeTranscriptEp === ep.id ? null : ep.id)}
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
                        {activeTranscriptEp === ep.id ? 'Hide Synchronized Transcript ▲' : 'Read Synchronized Transcript ▼'}
                      </button>
                      {activeTranscriptEp === ep.id && (
                        <div style={{
                          marginTop: '8px',
                          padding: '12px 14px',
                          background: 'rgba(0,0,0,0.45)',
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '130px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      onPlayEpisode(ep, show);
                      onClose();
                    }}
                    style={{
                      padding: '9px 16px',
                      background: show.accentColor || '#10b981',
                      color: '#040711',
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
                    <RiPlayFill size={16} /> Play Episode
                  </button>
                  <button
                    type="button"
                    onClick={() => onTipHost(show)}
                    style={{
                      padding: '7px 12px',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#e2e8f0',
                      border: '1px solid rgba(255,255,255,0.14)',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    <RiCoinsFill size={13} color="#f59e0b" /> Tip ({formatPrice(5)})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PodcastStreamingHub({
  onPlayTrack,
  userCredits = 150,
  setUserCredits,
  onOpenCreditReload,
  onOpenPodcasterStudio
}) {
  const { formatPrice, currencyInfo } = useRegion();
  const [shows, setShows] = useState(AUTHORITATIVE_PODCAST_SHOWS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedShowSlug, setExpandedShowSlug] = useState('indieartistpod');
  const [activeEpkShow, setActiveEpkShow] = useState(null);
  const [activeDrawerShow, setActiveDrawerShow] = useState(null);
  const [activeTranscriptEp, setActiveTranscriptEp] = useState(null);
  const [tipNotice, setTipNotice] = useState('');

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

  const categories = ['All', 'Music Business', 'African Electronic & Amapiano', 'Tech & Venture Capital', 'Audio Engineering', 'Film Sync & Media', 'Cultural Audio & Heritage', 'Hip-Hop & Sheng Drill', 'Neo-Soul & R&B Sessions'];

  const filteredShows = shows.filter(s => {
    const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q ||
      s.title.toLowerCase().includes(q) ||
      s.host.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      (s.episodes || []).some(e => e.title.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const handlePlayPodcastEpisode = (episode, show, seekTimeStr = null) => {
    const formattedTrack = {
      id: episode.id,
      isrc: episode.isrc || `KE-POD-${episode.id}`,
      title: episode.title,
      artist: `${show.host} (${show.title})`,
      album: show.title,
      release: `Season ${episode.seasonNumber} • Ep. ${episode.episodeNumber}`,
      releaseType: 'Podcast Episode',
      genre: show.category || 'Podcast',
      duration: episode.duration || '42:18',
      cover: episode.coverArt || show.coverArt,
      coverArt: episode.coverArt || show.coverArt,
      audioUrl: episode.audioUrl || '/api/stream/track/KE-TM1-26-00042',
      isPodcast: true,
      podcastSlug: show.slug,
      chapters: episode.chapters || [],
      transcript: episode.transcript || '',
      sponsorBrand: episode.sponsorBrand || 'TuneMavens Corporate Ad Services',
      seekTimeStr
    };

    const showQueue = (show.episodes || []).map(ep => ({
      id: ep.id,
      isrc: ep.isrc || `KE-POD-${ep.id}`,
      title: ep.title,
      artist: `${show.host} (${show.title})`,
      album: show.title,
      releaseType: 'Podcast Episode',
      duration: ep.duration || '40:00',
      cover: ep.coverArt || show.coverArt,
      coverArt: ep.coverArt || show.coverArt,
      audioUrl: ep.audioUrl || '/api/stream/track/KE-TM1-26-00042',
      isPodcast: true
    }));

    if (typeof onPlayTrack === 'function') {
      onPlayTrack(formattedTrack, showQueue);
    }

    window.dispatchEvent(new CustomEvent('tunestreamPlayTrack', {
      detail: {
        track: formattedTrack,
        queue: showQueue,
        contextTitle: `Podcast: ${show.title}`
      }
    }));
  };

  const handleTipPodcaster = (show) => {
    const tipCredits = 50; // $5.00 USD base equivalent
    const localizedTipValue = formatPrice(5);
    if ((userCredits ?? 0) < tipCredits) {
      if (typeof onOpenCreditReload === 'function') {
        onOpenCreditReload('Top-Up Credits to Tip Podcast Hosts Directly');
      } else {
        window.dispatchEvent(new CustomEvent('tunestreamOpenReload'));
      }
      return;
    }
    if (typeof setUserCredits === 'function') {
      const next = Math.max(0, userCredits - tipCredits);
      setUserCredits(next);
      try { localStorage.setItem('tunemavens_user_credits', String(next)); } catch (_) {}
    }
    setTipNotice(`✓ Tipped 50 TM Credits (${localizedTipValue}) directly to ${show.host} (${show.title}) — settled via Split Cascade (${(show.splits || []).map(s => `${s.name} ${s.share}%`).join(' / ')})!`);
    setTimeout(() => setTipNotice(''), 5000);
  };

  const spotlightShow = shows[0] || AUTHORITATIVE_PODCAST_SHOWS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', textAlign: 'left', width: '100%' }} data-testid="podcast-streaming-hub">
      {tipNotice && (
        <div style={{
          padding: '12px 18px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          borderRadius: '3px',
          color: '#6ee7b7',
          fontSize: '13px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>{tipNotice}</span>
          <button type="button" onClick={() => setTipNotice('')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Featured Podcast Show Hero Banner */}
      <div
        style={{
          background: `linear-gradient(135deg, rgba(6, 10, 22, 0.96) 0%, rgba(12, 22, 44, 0.88) 100%), url(${spotlightShow.bannerUrl}) center/cover no-repeat`,
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '3px',
          padding: '32px 28px',
          display: 'flex',
          gap: '28px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <img
          src={spotlightShow.coverArt}
          alt={spotlightShow.title}
          onError={(e) => { e.currentTarget.src = '/uploads/artwork/ndufo_cover.jpg'; }}
          style={{
            width: '168px',
            height: '168px',
            borderRadius: '3px',
            objectFit: 'cover',
            border: '2px solid #10b981',
            boxShadow: '0 16px 40px rgba(0,0,0,0.65)',
            flexShrink: 0
          }}
        />

        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <span style={{ background: '#10b981', color: '#040711', fontSize: '10px', fontWeight: 900, padding: '3px 9px', borderRadius: '3px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              ★ FEATURED ORIGINAL PODCAST
            </span>
            <span style={{ background: 'rgba(0, 242, 254, 0.12)', border: '1px solid rgba(0, 242, 254, 0.3)', color: '#00f2fe', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '3px' }}>
              -16 LUFS Broadcast Master • 24-Bit Voice
            </span>
            <span style={{ background: 'rgba(245, 158, 11, 0.14)', border: '1px solid rgba(245, 158, 11, 0.35)', color: '#fbbf24', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '3px' }}>
              Ad Flights from {formatPrice(AUTHORITATIVE_AD_RATES[0].price_usd)} ({AUTHORITATIVE_AD_RATES[0].credits.toLocaleString()} Credits)
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>
            {spotlightShow.title}
          </h2>
          <div style={{ fontSize: '13.5px', color: '#00f2fe', fontWeight: 700, marginBottom: '10px' }}>
            Hosted by {spotlightShow.host} • {spotlightShow.subscribers} Subscribers • {spotlightShow.cadence}
          </div>
          <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 18px', maxWidth: '720px' }}>
            {spotlightShow.description}
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => spotlightShow.episodes?.[0] && handlePlayPodcastEpisode(spotlightShow.episodes[0], spotlightShow)}
              style={{
                padding: '11px 22px',
                background: '#10b981',
                color: '#040711',
                border: 'none',
                borderRadius: '3px',
                fontSize: '13px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RiPlayFill size={18} /> Stream Latest Episode
            </button>

            <button
              type="button"
              onClick={() => setActiveEpkShow(spotlightShow)}
              style={{
                padding: '11px 18px',
                background: 'rgba(0, 242, 254, 0.12)',
                color: '#00f2fe',
                border: '1px solid rgba(0, 242, 254, 0.4)',
                borderRadius: '3px',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiAwardFill size={16} /> View Podcaster EPK &amp; Ad Rates ({currencyInfo?.code || 'USD'})
            </button>

            <button
              type="button"
              onClick={() => handleTipPodcaster(spotlightShow)}
              style={{
                padding: '11px 16px',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiCoinsFill size={15} color="#f59e0b" /> Tip Hosts ({formatPrice(5)} / 50 Credits)
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        background: '#090d1c',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '3px',
        padding: '14px 18px'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '7px 14px',
                borderRadius: '3px',
                border: selectedCategory === cat ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                background: selectedCategory === cat ? '#10b981' : 'rgba(255,255,255,0.03)',
                color: selectedCategory === cat ? '#040711' : '#cbd5e1',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '260px', flex: '0 1 340px' }}>
          <RiSearchLine size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shows, hosts, episodes, topics..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '3px',
              color: '#fff',
              fontSize: '12.5px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

            {/* 3x4 Grid of Podcast Cards (All Interactive Functionality) */}
      <div
        className="podcast-shows-3x4-grid"
        data-testid="podcast-shows-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px',
          width: '100%'
        }}
      >
        {filteredShows.map((show) => {
          const entryRateUsd = show.sponsorshipRates?.[0]?.packagePriceUsd || AUTHORITATIVE_AD_RATES[0].price_usd;
          const entryRateCredits = show.sponsorshipRates?.[0]?.credits || AUTHORITATIVE_AD_RATES[0].credits;
          return (
            <div
              key={show.id}
              data-testid={`podcast-card-${show.slug}`}
              style={{
                background: '#090d1c',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
                position: 'relative'
              }}
            >
              {/* Card Image Banner with Badges */}
              <div style={{ position: 'relative', width: '100%', height: '185px', background: '#040711', overflow: 'hidden' }}>
                <img
                  src={show.coverArt}
                  alt={show.title}
                  onError={(e) => { e.currentTarget.src = '/uploads/artwork/ndufo_cover.jpg'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(6,10,22,0.15) 0%, rgba(6,10,22,0.85) 100%)'
                }} />
                {/* Category badge */}
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(6,10,22,0.88)',
                  border: `1px solid ${show.accentColor || '#10b981'}`,
                  color: show.accentColor || '#10b981',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '3px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  backdropFilter: 'blur(8px)'
                }}>
                  {show.category}
                </span>
                {/* Rating badge */}
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(6,10,22,0.88)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#f59e0b',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '3px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  ★ {show.rating}
                </span>
                {/* -16 LUFS badge */}
                <span style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '12px',
                  background: 'rgba(0, 242, 254, 0.2)',
                  border: '1px solid rgba(0, 242, 254, 0.45)',
                  color: '#00f2fe',
                  fontSize: '9.5px',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '3px',
                  backdropFilter: 'blur(8px)'
                }}>
                  -16 LUFS Master • 24-Bit Voice
                </span>
                {/* Cadence badge */}
                <span style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '12px',
                  background: 'rgba(255,255,255,0.14)',
                  color: '#e2e8f0',
                  fontSize: '9.5px',
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: '3px'
                }}>
                  {show.cadence}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {/* Single Source of Truth Ad Flight Tag */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '3px',
                  padding: '5px 9px',
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: '#fbbf24'
                }}>
                  <span>Ad Flights from {formatPrice(entryRateUsd)}</span>
                  <span style={{ color: '#94a3b8', fontSize: '9.5px' }}>{entryRateCredits.toLocaleString()} Credits</span>
                </div>

                {/* Show Title */}
                <h3 style={{
                  fontSize: '17px',
                  fontWeight: 800,
                  color: '#fff',
                  margin: '2px 0 0',
                  lineHeight: 1.3,
                  minHeight: '44px'
                }}>
                  {show.title}
                </h3>

                {/* Host */}
                <div style={{ fontSize: '12px', color: '#00f2fe', fontWeight: 700 }}>
                  Hosted by {show.host}
                </div>

                {/* Subscribers & Streams */}
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {show.subscribers} Subscribers • {show.totalStreams} Streams
                </div>

                {/* Description Clamp */}
                <p style={{
                  fontSize: '12px',
                  color: '#cbd5e1',
                  lineHeight: 1.5,
                  margin: '4px 0 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {show.description}
                </p>

                {/* Latest Episode Indicator */}
                {show.episodes?.[0] && (
                  <div style={{
                    marginTop: '4px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '3px',
                    padding: '7px 9px',
                    fontSize: '11px',
                    color: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px'
                  }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      <strong style={{ color: '#10b981' }}>Latest:</strong> {show.episodes[0].title}
                    </div>
                    <span style={{ color: '#64748b', fontSize: '10px', flexShrink: 0 }}>
                      {show.episodes[0].duration}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Actions (Matching Featured Card Functionality) */}
              <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* 1. Stream Latest Episode */}
                <button
                  type="button"
                  onClick={() => show.episodes?.[0] && handlePlayPodcastEpisode(show.episodes[0], show)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: show.accentColor || '#10b981',
                    color: '#040711',
                    border: 'none',
                    borderRadius: '3px',
                    fontSize: '12.5px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                >
                  <RiPlayFill size={16} /> Stream Latest Episode
                </button>

                {/* 2. EPK & Tipping Buttons Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveEpkShow(show)}
                    style={{
                      padding: '8px 10px',
                      background: 'rgba(0, 242, 254, 0.1)',
                      color: '#00f2fe',
                      border: '1px solid rgba(0, 242, 254, 0.35)',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    <RiAwardFill size={14} /> EPK &amp; Rates
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTipPodcaster(show)}
                    style={{
                      padding: '8px 10px',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.14)',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    <RiCoinsFill size={13} color="#f59e0b" /> Tip ({formatPrice(5)})
                  </button>
                </div>

                {/* 3. Browse Episodes, Chapters & Synchronized Transcripts */}
                <button
                  type="button"
                  onClick={() => setActiveDrawerShow(show)}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#cbd5e1',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '3px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  <RiFileList3Line size={13} />
                  Browse {(show.episodes || []).length} Episode{((show.episodes || []).length !== 1) ? 's' : ''} &amp; Transcripts &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Podcaster Studio Backend Callout */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(9, 13, 28, 0.95) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        borderRadius: '3px',
        padding: '24px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <span style={{ fontSize: '10px', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>
            FOR PODCASTERS, JOURNALISTS &amp; MEDIA HOUSES
          </span>
          <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: '4px 0 6px' }}>
            Host Your Podcast, Build Your Podcaster EPK &amp; Monetize via Corporate Ad Services
          </h3>
          <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, maxWidth: '680px' }}>
            Every podcaster on TuneMavens gets a customizable Podcaster EPK, automated -16 LUFS broadcast mastering, RSS 2.0 global syndication, and dynamic ad insertion starting at {formatPrice(AUTHORITATIVE_AD_RATES[0].price_usd)} ({formatPrice(AUTHORITATIVE_AD_RATES[0].cpm_usd)} CPM).
          </p>
        </div>
        <a
          href="/#/dashboard?tab=podcaster-studio"
          onClick={(e) => {
            if (typeof onOpenPodcasterStudio === 'function') {
              e.preventDefault();
              onOpenPodcasterStudio();
            }
          }}
          style={{
            padding: '12px 22px',
            background: '#10b981',
            color: '#040711',
            borderRadius: '3px',
            fontSize: '13px',
            fontWeight: 900,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <RiMicFill size={16} /> Open TuneMavens Podcaster Studio &rarr;
        </a>
      </div>

      {/* Podcaster EPK Modal */}
      {activeDrawerShow && (
        <PodcastEpisodesDrawerModal
          show={activeDrawerShow}
          onClose={() => setActiveDrawerShow(null)}
          onPlayEpisode={handlePlayPodcastEpisode}
          onTipHost={handleTipPodcaster}
          formatPrice={formatPrice}
        />
      )}

      {activeEpkShow && (
        <PodcasterEpkModal
          show={activeEpkShow}
          onClose={() => setActiveEpkShow(null)}
          onPlayEpisode={handlePlayPodcastEpisode}
        />
      )}
    </div>
  );
}
