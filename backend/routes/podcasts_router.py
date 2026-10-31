"""TuneMavens & TuneStream Podcasts & Podcaster EPK Router.

Provides full backend support for:
- Podcast Shows & Episodes catalog streaming
- Podcaster Electronic Press Kits (EPKs) & Sponsorship Rate Cards
- Episode publishing with chapter markers, transcripts & -16 LUFS mastering metadata
- Corporate Ad Services dynamic ad insertion (Pre-Roll, Mid-Roll, Host-Read) & Split Cascades
- Guest booking inquiries & RSS 2.0 XML syndication feed generation
"""
import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel, ConfigDict, Field

from auth import get_current_user, get_optional_user
from config import db
from routes.corporate_ads_router import DEFAULT_AD_RATES

CANONICAL_PODCAST_SPONSORSHIP_RATES = [
    {
        "slug": DEFAULT_AD_RATES[0]["slug"],
        "slot": "15s Pre-Roll Audio Spot (Pulse Tier)",
        "tier_name": DEFAULT_AD_RATES[0]["name"],
        "cpmUsd": DEFAULT_AD_RATES[0]["cpm_usd"],
        "packagePriceUsd": DEFAULT_AD_RATES[0]["price_usd"],
        "credits": DEFAULT_AD_RATES[0]["credits"],
        "guaranteedImpressions": DEFAULT_AD_RATES[0]["guaranteed_impressions"],
        "deliverables": "25,000 Guaranteed Stream Impressions • 15s Unskippable Pre-Roll Audio Interstitial + 300x250 Companion Banner"
    },
    {
        "slug": DEFAULT_AD_RATES[1]["slug"],
        "slot": "60s Host-Read Mid-Roll & Companion Banner (Amplified Tier)",
        "tier_name": DEFAULT_AD_RATES[1]["name"],
        "cpmUsd": DEFAULT_AD_RATES[1]["cpm_usd"],
        "packagePriceUsd": DEFAULT_AD_RATES[1]["price_usd"],
        "credits": DEFAULT_AD_RATES[1]["credits"],
        "guaranteedImpressions": DEFAULT_AD_RATES[1]["guaranteed_impressions"],
        "deliverables": "100,000 Guaranteed Stream Impressions • 60s Host-Read Mid-Roll endorsement + In-Player Companion Banner & EPK Takeover"
    },
    {
        "slug": DEFAULT_AD_RATES[2]["slug"],
        "slot": "4-Episode Show Title & Podcaster EPK Sponsorship (Culture Lead)",
        "tier_name": DEFAULT_AD_RATES[2]["name"],
        "cpmUsd": DEFAULT_AD_RATES[2]["cpm_usd"],
        "packagePriceUsd": DEFAULT_AD_RATES[2]["price_usd"],
        "credits": DEFAULT_AD_RATES[2]["credits"],
        "guaranteedImpressions": DEFAULT_AD_RATES[2]["guaranteed_impressions"],
        "deliverables": "300,000+ Multichannel Impressions • 4-Episode Title Sponsorship, Hero Carousel on Podcaster EPK & Smart CRM Lead Routing"
    },
    {
        "slug": DEFAULT_AD_RATES[3]["slug"],
        "slot": "Full-Season Category Exclusive Show & Network Takeover (Titan)",
        "tier_name": DEFAULT_AD_RATES[3]["name"],
        "cpmUsd": DEFAULT_AD_RATES[3]["cpm_usd"],
        "packagePriceUsd": DEFAULT_AD_RATES[3]["price_usd"],
        "credits": DEFAULT_AD_RATES[3]["credits"],
        "guaranteedImpressions": DEFAULT_AD_RATES[3]["guaranteed_impressions"],
        "deliverables": "1,000,000+ Omnichannel Impressions • 100% Category Exclusivity, Custom Sonic Branding & Dedicated Media Director"
    }
]

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/podcasts", tags=["podcasts"])


DEFAULT_PODCAST_SHOWS: List[Dict[str, Any]] = [
  {
    "id": 'pod-indie-artist',
    "slug": 'indieartistpod',
    "subdomain": 'indieartistpod',
    "title": 'The Independent Artist & Creator Economy',
    "host": 'Zawadi Kiprop & Kofi Mensah',
    "hostRole": 'Music Economists & Web3 Audio Strategists',
    "category": 'Music Business',
    "language": 'English / Swahili',
    "cadence": 'Weekly • Tuesdays',
    "subscribers": '142.4K',
    "totalStreams": '1.84M',
    "avgCompletionRate": '86%',
    "rating": 4.9,
    "accentColor": '#10b981',
    "secondaryColor": '#00f2fe',
    "coverArt": '/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg',
    "bannerUrl": '/headers/discography_retina_header.jpg',
    "trailerAudioUrl": '/api/stream/track/KE-TM1-24-INTRO',
    "description": 'Deep-dive conversations on independent music ownership, automated Split Cascade royalties, global sync licensing, and building a sustainable creator career without major-label debt.',
    "bio": "Hosted from Nairobi and Accra by Zawadi Kiprop and Kofi Mensah, The Independent Artist & Creator Economy is Africa's #1 music business and creator tech podcast.",
    "demographics": {
      "topRegions": [
        { "region": 'East Africa (Kenya, Tanzania, Uganda)', "share": 34 },
        { "region": 'West Africa (Nigeria, Ghana)', "share": 26 },
        { "region": 'North America (USA & Canada)', "share": 22 },
        { "region": 'UK & European Diaspora', "share": 18 }
      ],
      "ageGroups": '18–34 (68%), 35–49 (27%), 50+ (5%)',
      "listenerProfile": 'Independent artists, music lovers, tech founders, A&Rs, and cultural tastemakers'
    },
    "sponsorshipRates": CANONICAL_PODCAST_SPONSORSHIP_RATES,
    "splits": [
      { "name": 'Zawadi Kiprop', "role": 'Lead Host & Executive Producer', "share": 45 },
      { "name": 'Kofi Mensah', "role": 'Co-Host & Research', "share": 35 },
      { "name": 'Baraka Sound Labs', "role": 'Audio Mastering & Post-Production', "share": 20 }
    ],
    "pressQuotes": [
      { "outlet": 'Rolling Stone Africa', "quote": 'The essential playbook for the modern African and diaspora music ecosystem.' },
      { "outlet": 'TechCabal', "quote": 'Zawadi and Kofi break down complex royalty and sync pipelines with unmatched clarity.' }
    ],
    "episodes": [
      {
        "id": 'ep-indie-48',
        "isrc": 'KE-POD-26-00101',
        "episodeNumber": 48,
        "seasonNumber": 3,
        "title": 'Ep. "48": Why Zero-Subscription Credit Streaming Pays Creators 4x More',
        "artist": 'Zawadi Kiprop & Kofi Mensah',
        "podcastTitle": 'The Independent Artist & Creator Economy',
        "podcastSlug": 'indieartistpod',
        "genre": 'Podcast • Music Business',
        "releaseType": 'Podcast Episode',
        "duration": '42:18',
        "publishedAt": '2 days ago',
        "streams": '48.2K',
        "coverArt": '/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg',
        "audioUrl": '/api/stream/track/KE-TM1-26-00042',
        "sponsorBrand": 'Safaricom Neon Beats',
        "summary": "We analyze the mathematics of traditional subscription pools vs. TuneStream's non-expiring credit top-up and Corporate Ad Services model.",
        "transcript": 'Zawadi: Welcome back to The Independent Artist Podcast! Today we are breaking down why subscription fatigue is hurting both fans and artists...',
        "chapters": [
          { "time": '00:00', "title": 'Intro & Corporate Sponsor Spotlight' },
          { "time": '04:15', "title": 'The Subscription Pool Illusion Explained' },
          { "time": '16:40', "title": 'How Corporate Ad Services Fund Free Listening' },
          { "time": '29:10', "title": 'Live Q&A: Setting Up Collaborator Splits' }
        ]
      }
    ]
  },
  {
    "id": 'pod-african-soundscapes',
    "slug": 'africansoundscapes',
    "subdomain": 'africansoundscapes',
    "title": 'African Soundscapes & Modular Ethnomusicology',
    "host": 'Ndufo & Dr. Amina Osei',
    "hostRole": 'Modular Synthesis Pioneer & Cultural Historian',
    "category": 'Music Documentary',
    "language": 'English',
    "cadence": 'Bi-Weekly • Thursdays',
    "subscribers": '98.7K',
    "totalStreams": '1.12M',
    "avgCompletionRate": '91%',
    "rating": 5.0,
    "accentColor": '#00f2fe',
    "secondaryColor": '#a855f7',
    "coverArt": '/uploads/artwork/ndufo_cover.jpg',
    "bannerUrl": '/heroes/ndufo_hero_slide1_retina.jpg',
    "trailerAudioUrl": '/api/stream/track/KE-TM1-26-00042',
    "description": 'Tracing the sonic lineage from traditional East & West African polyrhythms and nyatiti harps to modern analog Eurorack modular synthesis and 24-bit club systems.',
    "bio": 'Recorded on location across Kilifi, Nairobi, Accra, and Berlin, Ndufo and Dr. Amina Osei combine field recordings of indigenous instruments with live studio breakdowns.',
    "demographics": {
      "topRegions": [
        { "region": 'East Africa', "share": 38 },
        { "region": 'Western Europe', "share": 31 },
        { "region": 'North America', "share": 19 },
        { "region": 'Japan & Asia-Pacific', "share": 12 }
      ],
      "ageGroups": '21–38 (74%), 39–55 (26%)',
      "listenerProfile": 'Producers, synthesizer enthusiasts, DJs, ethnomusicologists, and audiophiles'
    },
    "sponsorshipRates": CANONICAL_PODCAST_SPONSORSHIP_RATES,
    "splits": [
      { "name": 'Ndufo', "role": 'Co-Host & Sound Designer', "share": 50 },
      { "name": 'Dr. Amina Osei', "role": 'Co-Host & Lead Archivist', "share": 50 }
    ],
    "pressQuotes": [
      { "outlet": 'Resident Advisor', "quote": 'A spellbinding sonic journey connecting ancestral acoustic tunings to modular club culture.' }
    ],
    "episodes": [
      {
        "id": 'ep-sound-24',
        "isrc": 'KE-POD-26-00201',
        "episodeNumber": 24,
        "seasonNumber": 2,
        "title": 'Ep. "24": Kalenjin Folk-House & Sub-Bass Architecture in 24-Bit FLAC',
        "artist": 'Ndufo & Dr. Amina Osei',
        "podcastTitle": 'African Soundscapes & Modular Ethnomusicology',
        "podcastSlug": 'africansoundscapes',
        "genre": 'Podcast • Music Documentary',
        "releaseType": 'Podcast Episode',
        "duration": '51:10',
        "publishedAt": '4 days ago',
        "streams": '39.4K',
        "coverArt": '/uploads/artwork/ndufo_cover.jpg',
        "audioUrl": '/api/stream/track/KE-TM1-26-00042',
        "sponsorBrand": 'Safaricom Neon Beats',
        "summary": 'Field recordings from the Rift Valley paired with Buchla and Eurorack low-pass gates.',
        "transcript": 'Ndufo: Listen closely to the 5/4 pulse of the chepkong harp here...',
        "chapters": [
          { "time": '00:00', "title": 'Rift Valley Field Recording (Binaural 24-Bit)' },
          { "time": '11:30', "title": 'Patching Polyrhythms on Eurorack' },
          { "time": '34:45', "title": 'Live Jam & Hardware Walkthrough' }
        ]
      }
    ]
  },
  {
    "id": 'pod-amapiano-stories',
    "slug": 'amapianostories',
    "subdomain": 'amapianostories',
    "title": 'Amapiano & Swahili Coast Chronicles',
    "host": 'DJ Thabo & Lerato Mokoena',
    "hostRole": 'Pretoria & Johannesburg Club Historians',
    "category": 'Culture & Nightlife',
    "language": 'English / Zulu / Swahili',
    "cadence": 'Weekly • Fridays',
    "subscribers": '215.0K',
    "totalStreams": '3.10M',
    "avgCompletionRate": '89%',
    "rating": 4.9,
    "accentColor": '#f59e0b',
    "secondaryColor": '#ec4899',
    "coverArt": '/uploads/artwork/af8f4b21-dc7c-4ee5-b0c6-7debb0fb9424.jpg',
    "bannerUrl": '/heroes/ndufo_hero_slide2_retina.jpg',
    "trailerAudioUrl": '/api/stream/track/KE-TM1-24-INTRO',
    "description": 'From Pretoria bedroom studios and Soweto street bashes to headlining Ibiza, London, and Nairobi—the untold stories and log-drum secrets of Amapiano.',
    "bio": 'DJ Thabo and Lerato Mokoena bring you inside the studios and backrooms of Southern and East Africa’s most explosive dance movement.',
    "demographics": {
      "topRegions": [
        { "region": 'Southern Africa', "share": 42 },
        { "region": 'East Africa', "share": 28 },
        { "region": 'UK & Europe', "share": 20 },
        { "region": 'North America', "share": 10 }
      ],
      "ageGroups": '18–30 (76%), 31–45 (24%)',
      "listenerProfile": 'DJs, clubbers, festival promoters, and Amapiano fans worldwide'
    },
    "sponsorshipRates": CANONICAL_PODCAST_SPONSORSHIP_RATES,
    "splits": [
      { "name": 'DJ Thabo', "role": 'Host & Mix Curator', "share": 50 },
      { "name": 'Lerato Mokoena', "role": 'Host & Editorial Director', "share": 50 }
    ],
    "pressQuotes": [
      { "outlet": 'Mixmag', "quote": 'The definitive oral history of Amapiano, told by the pioneers who built it.' }
    ],
    "episodes": [
      {
        "id": 'ep-ama-62',
        "isrc": 'KE-POD-26-00301',
        "episodeNumber": 62,
        "seasonNumber": 4,
        "title": 'Ep. "62": The Anatomy of the Private School Amapiano Log Drum',
        "artist": 'DJ Thabo & Lerato Mokoena',
        "podcastTitle": 'Amapiano & Swahili Coast Chronicles',
        "podcastSlug": 'amapianostories',
        "genre": 'Podcast • Culture & Nightlife',
        "releaseType": 'Podcast Episode',
        "duration": '46:05',
        "publishedAt": 'Yesterday',
        "streams": '67.8K',
        "coverArt": '/uploads/artwork/af8f4b21-dc7c-4ee5-b0c6-7debb0fb9424.jpg',
        "audioUrl": '/api/stream/track/KE-TM1-24-INTRO',
        "sponsorBrand": 'Red Bull SoundClash',
        "summary": 'How jazz chords, soulful Rhodes pianos, and pitched sub-bass log drums created a global phenomenon.',
        "transcript": 'Lerato: Everyone remembers the first time they heard that log drum drop at 113 BPM...',
        "chapters": [
          { "time": '00:00', "title": 'Intro & Weekend Festival Roundup' },
          { "time": '09:15', "title": 'Jazz Chords Meets Township Kwaito' }
        ]
      }
    ]
  },
  {
    "id": 'pod-producer-roundtable',
    "slug": 'producerroundtable',
    "subdomain": 'producerroundtable',
    "title": 'The Producer & Sound Engineer Roundtable',
    "host": 'Marcus Vance & Baraka Sound Labs',
    "hostRole": 'Grammy-Nominated Mix Engineer & Analog Mastering Head',
    "category": 'Audio Engineering',
    "language": 'English',
    "cadence": 'Monthly • 1st Monday',
    "subscribers": '76.3K',
    "totalStreams": '840K',
    "avgCompletionRate": '93%',
    "rating": 4.8,
    "accentColor": '#ec4899',
    "secondaryColor": '#3b82f6',
    "coverArt": '/heroes/hero_music_3.png',
    "bannerUrl": '/headers/header_tools.png',
    "trailerAudioUrl": '/api/stream/track/KE-TM1-26-00042',
    "description": 'Hardware shootouts, -16 LUFS podcast stem mastering, binaural headphone translation, and acoustic room treatment on an indie budget.',
    "bio": 'Marcus Vance and senior studio engineers demystify the dark art of audio mastering, stem mixing, and broadcast compliance standards.',
    "demographics": {
      "topRegions": [
        { "region": 'East & West Africa', "share": 45 },
        { "region": 'North America', "share": 30 },
        { "region": 'Europe', "share": 25 }
      ],
      "ageGroups": '18–40 (85%)',
      "listenerProfile": 'Producers, beatmakers, audio engineers, podcasters, and studio owners'
    },
    "sponsorshipRates": CANONICAL_PODCAST_SPONSORSHIP_RATES,
    "splits": [
      { "name": 'Marcus Vance', "role": 'Host & Lead Engineer', "share": 60 },
      { "name": 'Baraka Sound Labs', "role": 'Studio Facility & Co-Host', "share": 40 }
    ],
    "pressQuotes": [
      { "outlet": 'Sound On Sound', "quote": 'Essential listening for anyone serious about professional audio engineering in Africa.' }
    ],
    "episodes": [
      {
        "id": 'ep-prod-18',
        "isrc": 'KE-POD-26-00401',
        "episodeNumber": 18,
        "seasonNumber": 2,
        "title": 'Ep. "18": Mastering for Lossless FLAC vs. Compressed MP3 Streaming',
        "artist": 'Marcus Vance',
        "podcastTitle": 'The Producer & Sound Engineer Roundtable',
        "podcastSlug": 'producerroundtable',
        "genre": 'Podcast • Audio Engineering',
        "releaseType": 'Podcast Episode',
        "duration": '54:30',
        "publishedAt": '1 week ago',
        "streams": '32.1K',
        "coverArt": '/heroes/hero_music_3.png',
        "audioUrl": '/api/stream/track/KE-TM1-26-00042',
        "sponsorBrand": 'TuneMavens Studio Suite',
        "summary": 'We test inter-sample peaks, true peak limiting, and stem headroom on 24-bit 96kHz playback systems.',
        "transcript": 'Marcus: When you master at -14 LUFS with True Peak limiting at -1.0 dBFS...',
        "chapters": [
          { "time": '00:00', "title": 'LUFS & True Peak Demystified' },
          { "time": '18:20', "title": 'Hardware EQ vs Digital DSP' }
        ]
      }
    ]
  },
  {
    "id": 'pod-afrotech-disrupt',
    "slug": 'afrotech_disrupt',
    "subdomain": 'afrotech_disrupt',
    "title": 'AfroTech Disruption & Venture Capital',
    "host": 'Steve Biko & Dr. Michael Chen',
    "hostRole": 'Fintech Angel Investor & African Tech Editor',
    "category": 'Tech, VC & Startups',
    "language": 'English',
    "cadence": 'Weekly • Mondays',
    "subscribers": '185.0K',
    "totalStreams": '1.95M',
    "avgCompletionRate": '89%',
    "rating": 4.9,
    "accentColor": '#38bdf8',
    "secondaryColor": '#10b981',
    "coverArt": '/heroes/hero_music_1.png',
    "bannerUrl": '/headers/header_pricing.png',
    "trailerAudioUrl": '/api/stream/track/KE-TM1-POD-001',
    "description": "East Africa's premier technology and venture capital audio show analyzing African seed funding, sovereign audio rights, and corporate tech disruption.",
    "bio": 'Analyzing how digital infrastructure, M-Pesa rails, and alternative creative asset financing are turning African intellectual property into global wealth.',
    "demographics": {
      "topRegions": [
        { "region": 'Kenya & Nigeria', "share": 44 },
        { "region": 'US Diaspora', "share": 28 },
        { "region": 'UK & Europe', "share": 20 },
        { "region": 'South Africa', "share": 8 }
      ],
      "ageGroups": '24–45 (88%)',
      "listenerProfile": 'Venture capitalists, tech executives, angel syndicates, founders, and LPs'
    },
    "sponsorshipRates": CANONICAL_PODCAST_SPONSORSHIP_RATES,
    "splits": [
      { "name": 'Steve Biko', "role": 'Host & Creator', "share": 55 },
      { "name": 'Dr. Michael Chen', "role": 'Co-Host & Market Analyst', "share": 45 }
    ],
    "pressQuotes": [
      { "outlet": 'TechCrunch Africa', "quote": 'The front-row seat to the capital and creators shaping Africa’s tech renaissance.' }
    ],
    "episodes": [
      {
        "id": 'ep-at-42',
        "isrc": 'KE-TM1-POD-001',
        "episodeNumber": 42,
        "seasonNumber": 4,
        "title": 'Ep. "42": The Sovereign Wealth of African Music & Split Cascade Escrows',
        "artist": 'Steve Biko & Dr. Michael Chen',
        "podcastTitle": 'AfroTech Disruption & Venture Capital',
        "podcastSlug": 'afrotech_disrupt',
        "genre": 'Podcast • Tech & VC',
        "releaseType": 'Podcast Episode',
        "duration": '48:15',
        "publishedAt": '3 days ago',
        "streams": '88.4K',
        "coverArt": '/heroes/hero_music_1.png',
        "audioUrl": '/api/stream/track/KE-TM1-26-00042',
        "sponsorBrand": 'Nairobi Catalyst Ventures LP',
        "summary": 'How venture debt, automated Split Cascade liens, and telemetry are unlocking institutional advances for African creators.',
        "transcript": 'Steve: We are moving past the era where African creators take punitive foreign advances...',
        "chapters": [
          { "time": '00:00', "title": 'Macro VC Trends in East Africa' },
          { "time": '14:30', "title": 'Split Cascade vs Major Label Accounting' },
          { "time": '32:00', "title": 'First-Dollar Recoupment Case Studies' }
        ]
      }
    ]
  },
  {
    "id": 'pod-nairobi-beats',
    "slug": 'nairobibeatsweekly',
    "subdomain": 'nairobibeatsweekly',
    "title": 'Nairobi Beats Weekly',
    "host": 'Brian Omondi & Faith Waweru',
    "hostRole": 'Urban Radio Host & Street Music Journalist',
    "category": 'Culture & Hip-Hop',
    "language": 'English / Sheng / Swahili',
    "cadence": 'Weekly • Wednesdays',
    "subscribers": '140.0K',
    "totalStreams": '1.28M',
    "avgCompletionRate": '88%',
    "rating": 4.8,
    "accentColor": '#ec4899',
    "secondaryColor": '#f59e0b',
    "coverArt": '/heroes/hero_music_4.png',
    "bannerUrl": '/headers/header_tours.png',
    "trailerAudioUrl": '/api/stream/track/KE-TM1-POD-010',
    "description": 'Weekly audio deep-dive into Kenyan street music, rising beatmakers, Gengetone 2.0, drill culture, and exclusive live acoustic lounge performances.',
    "bio": 'From the matatu sound systems of Rongai and Kayole to sold-out arenas, Brian and Faith bring you the unfiltered voice of East African street music.',
    "demographics": {
      "topRegions": [
        { "region": 'Kenya', "share": 62 },
        { "region": 'Uganda & Tanzania', "share": 20 },
        { "region": 'UK Diaspora', "share": 12 },
        { "region": 'US Diaspora', "share": 6 }
      ],
      "ageGroups": '16–32 (82%)',
      "listenerProfile": 'Youth culture fans, Gengetone lovers, urban dancers, and streetwear tastemakers'
    },
    "sponsorshipRates": CANONICAL_PODCAST_SPONSORSHIP_RATES,
    "splits": [
      { "name": 'Brian Omondi', "role": 'Host & Executive Producer', "share": 50 },
      { "name": 'Faith Waweru', "role": 'Co-Host & Street Reporter', "share": 50 }
    ],
    "pressQuotes": [
      { "outlet": 'Pulse Live Kenya', "quote": 'The beating heart of modern Sheng and urban Kenyan music culture.' }
    ],
    "episodes": [
      {
        "id": 'ep-nb-78',
        "isrc": 'KE-TM1-POD-010',
        "episodeNumber": 78,
        "seasonNumber": 3,
        "title": 'Ep. "78": Gengetone 2.0 & The New Sheng Drill Masters',
        "artist": 'Brian Omondi & Faith Waweru',
        "podcastTitle": 'Nairobi Beats Weekly',
        "podcastSlug": 'nairobibeatsweekly',
        "genre": 'Podcast • Hip-Hop & Sheng',
        "releaseType": 'Podcast Episode',
        "duration": '41:20',
        "publishedAt": '5 days ago',
        "streams": '72.1K',
        "coverArt": '/heroes/hero_music_4.png',
        "audioUrl": '/api/stream/track/KE-TM1-24-INTRO',
        "sponsorBrand": 'Red Bull SoundClash',
        "summary": 'How Kenyan drill producers are sampling 90s Benga guitars over 140 BPM drill slide-bass patterns.',
        "transcript": 'Faith: Look at what the youth in Kibera and Eastlands are doing with these 808 slides...',
        "chapters": [
          { "time": '00:00', "title": 'Top 5 Sheng Drill Bangers of the Week' },
          { "time": '16:40', "title": 'Benga Guitar Samples & Drill 808s' }
        ]
      }
    ]
  },
  {
    "id": 'pod-creative-brief',
    "slug": 'creativebrief_af',
    "subdomain": 'creativebrief_af',
    "title": 'The African Creative Brief & Sync Hub',
    "host": 'Nathalie Mercier & Emeka Okafor',
    "hostRole": 'Film Sync Supervisor & Nollywood Audio Director',
    "category": 'Film Sync & Media',
    "language": 'English / French',
    "cadence": 'Bi-Weekly • Wednesdays',
    "subscribers": '95.0K',
    "totalStreams": '890K',
    "avgCompletionRate": '92%',
    "rating": 4.9,
    "accentColor": '#a78bfa',
    "secondaryColor": '#00f2fe',
    "coverArt": '/heroes/hero_music_2.png',
    "bannerUrl": '/headers/header_tools.png',
    "trailerAudioUrl": '/api/stream/track/KE-TM1-POD-020',
    "description": 'Behind-the-scenes interviews with Pan-African music supervisors, directors, streaming platforms, and advertising agency creative heads licensing original cues.',
    "bio": 'Connecting African composers and beatmakers directly to international film sync pitches, Netflix productions, and global brand commercials.',
    "demographics": {
      "topRegions": [
        { "region": 'Nigeria & Ghana', "share": 36 },
        { "region": 'Kenya & South Africa', "share": 32 },
        { "region": 'France & UK', "share": 22 },
        { "region": 'USA', "share": 10 }
      ],
      "ageGroups": '22–45 (78%)',
      "listenerProfile": 'Composers, music supervisors, film directors, and sync licensing reps'
    },
    "sponsorshipRates": CANONICAL_PODCAST_SPONSORSHIP_RATES,
    "splits": [
      { "name": 'Nathalie Mercier', "role": 'Lead Host & Sync Agent', "share": 50 },
      { "name": 'Emeka Okafor', "role": 'Co-Host & Audio Director', "share": 50 }
    ],
    "pressQuotes": [
      { "outlet": 'Variety Africa', "quote": 'The definitive bridge between African musicians and Hollywood music supervision.' }
    ],
    "episodes": [
      {
        "id": 'ep-cb-12',
        "isrc": 'KE-TM1-POD-020',
        "episodeNumber": 12,
        "seasonNumber": 2,
        "title": 'Ep. "12": What Hollywood & Netflix Music Supervisors Look For in African Cues',
        "artist": 'Nathalie Mercier & Emeka Okafor',
        "podcastTitle": 'The African Creative Brief & Sync Hub',
        "podcastSlug": 'creativebrief_af',
        "genre": 'Podcast • Sync & Film',
        "releaseType": 'Podcast Episode',
        "duration": '39:50',
        "publishedAt": '1 week ago',
        "streams": '44.8K',
        "coverArt": '/heroes/hero_music_2.png',
        "audioUrl": '/api/stream/track/KE-TM1-26-00042',
        "sponsorBrand": 'SyncMavens Film & TV',
        "summary": 'Step-by-step breakdown of instrumental cue sheets, uncompressed stems, and 24-hour pre-clearance.',
        "transcript": 'Nathalie: When an editor cuts a chase scene set in Lagos or Nairobi...',
        "chapters": [
          { "time": '00:00', "title": 'Why One-Stop Pre-Clearance Wins the Placement' },
          { "time": '14:20', "title": 'Building Dynamic Cue Stems & Hit Points' }
        ]
      }
    ]
  },
  {
    "id": 'pod-swahili-stories',
    "slug": 'swahili_stories',
    "subdomain": 'swahili_stories',
    "title": 'Swahili Stories & Binaural Soundscapes',
    "host": 'Zainab Binti Said & Prof. David Robinson',
    "hostRole": 'Zanzibar Cultural Custodian & Ethnomusicologist',
    "category": 'Cultural Audio & Heritage',
    "language": 'Swahili / English',
    "cadence": 'Bi-Weekly • Sundays',
    "subscribers": '112.0K',
    "totalStreams": '1.04M',
    "avgCompletionRate": '94%',
    "rating": 5.0,
    "accentColor": '#10b981',
    "secondaryColor": '#38bdf8',
    "coverArt": '/heroes/hero_music_3.png',
    "bannerUrl": '/headers/header_about.png',
    "trailerAudioUrl": '/api/stream/track/KE-TM1-POD-030',
    "description": 'Immersive binaural field recordings, oral folklore, coastal dhow chants, and acoustic storytelling recorded across Lamu, Zanzibar, Mombasa, and Bagamoyo.',
    "bio": 'Preserving and celebrating East Africa’s rich oral traditions through high-resolution 24-bit binaural audio recordings and historical cultural analysis.',
    "demographics": {
      "topRegions": [
        { "region": 'Tanzania & Kenya', "share": 50 },
        { "region": 'Oman & UAE Diaspora', "share": 22 },
        { "region": 'Europe & UK', "share": 16 },
        { "region": 'USA', "share": 12 }
      ],
      "ageGroups": 'All Ages',
      "listenerProfile": 'Heritage enthusiasts, cultural archivists, linguists, and ambient audio lovers'
    },
    "sponsorshipRates": CANONICAL_PODCAST_SPONSORSHIP_RATES,
    "splits": [
      { "name": 'Zainab Binti Said', "role": 'Storyteller & Cultural Lead', "share": 50 },
      { "name": 'Prof. David Robinson', "role": 'Binaural Recording Engineer', "share": 50 }
    ],
    "pressQuotes": [
      { "outlet": 'BBC World Service Culture', "quote": 'A breathtaking sonic masterwork that transports listeners to the Swahili coast.' }
    ],
    "episodes": [
      {
        "id": 'ep-ss-09',
        "isrc": 'KE-TM1-POD-030',
        "episodeNumber": 9,
        "seasonNumber": 1,
        "title": 'Ep. "09": Lamu Dhow Chants & Coral Stone Echoes (Binaural 3D Audio)',
        "artist": 'Zainab Binti Said',
        "podcastTitle": 'Swahili Stories & Binaural Soundscapes',
        "podcastSlug": 'swahili_stories',
        "genre": 'Podcast • Cultural Audio',
        "releaseType": 'Podcast Episode',
        "duration": '45:10',
        "publishedAt": '6 days ago',
        "streams": '51.3K',
        "coverArt": '/heroes/hero_music_3.png',
        "audioUrl": '/api/stream/track/KE-TM1-24-INTRO',
        "sponsorBrand": 'TuneMavens Cultural Archive',
        "summary": 'Recorded on a wooden dhow off the coast of Lamu with 3D binaural microphones during night navigation.',
        "transcript": 'Zainab: Huu ni wimbo wa wanamaji wanaovuta kamba usiku wa manane...',
        "chapters": [
          { "time": '00:00', "title": 'The Call of the Ocean Wind' },
          { "time": '18:40', "title": 'Sailor Chants & Stone Town Folklore' }
        ]
      }
    ]
  },
  {
    "id": 'pod-gengetone-drill',
    "slug": 'gengetone_drill',
    "subdomain": 'gengetone_drill',
    "title": 'Gengetone 2.0 & The Sheng Drill Masters',
    "host": 'Otieno James & Kibera Sound System',
    "hostRole": 'Eastlands Cypher MC & Sound System Engineer',
    "category": 'Street Rap & Subculture',
    "language": 'Sheng / Swahili',
    "cadence": 'Weekly • Saturdays',
    "subscribers": '168.0K',
    "totalStreams": '1.75M',
    "avgCompletionRate": '87%',
    "rating": 4.8,
    "accentColor": '#f43f5e',
    "secondaryColor": '#f59e0b',
    "coverArt": '/headers/header_about.png',
    "bannerUrl": '/headers/header_pricing.png',
    "trailerAudioUrl": '/api/stream/track/KE-TM1-26-00015',
    "description": 'Inside the raw, high-octane world of Kenyan street drill, producer studio battles, matatu culture, and the evolution of modern Sheng street slang.',
    "bio": 'Direct from the youth hubs of Kibera, Mathare, and Kayole, documenting how local street rappers are commanding millions of streams and touring worldwide.',
    "demographics": {
      "topRegions": [
        { "region": 'East Africa', "share": 70 },
        { "region": 'UK & Europe', "share": 18 },
        { "region": 'North America', "share": 12 }
      ],
      "ageGroups": '16–28 (88%)',
      "listenerProfile": 'Drill fans, street dancers, youth creators, and urban music tastemakers'
    },
    "sponsorshipRates": CANONICAL_PODCAST_SPONSORSHIP_RATES,
    "splits": [
      { "name": 'Otieno James', "role": 'Host & Lead MC', "share": 50 },
      { "name": 'Kibera Sound System', "role": 'Production & Audio Post', "share": 50 }
    ],
    "pressQuotes": [
      { "outlet": 'The Standard Kenya', "quote": 'The rawest, most electrifying audio documentation of contemporary Sheng youth.' }
    ],
    "episodes": [
      {
        "id": 'ep-gd-15',
        "isrc": 'KE-TM1-26-00015',
        "episodeNumber": 15,
        "seasonNumber": 2,
        "title": 'Ep. "15": Matatu Sound Systems & The 100kW Sheng Bass Battles',
        "artist": 'Otieno James',
        "podcastTitle": 'Gengetone 2.0 & The Sheng Drill Masters',
        "podcastSlug": 'gengetone_drill',
        "genre": 'Podcast • Street Drill',
        "releaseType": 'Podcast Episode',
        "duration": '44:20',
        "publishedAt": '2 days ago',
        "streams": '63.9K',
        "coverArt": '/headers/header_about.png',
        "audioUrl": '/api/stream/track/KE-TM1-24-INTRO',
        "sponsorBrand": 'Red Bull SoundClash',
        "summary": 'Inside the tuning of 100kW subwoofer sound systems inside Nairobi’s custom nganya matatus.',
        "transcript": 'Otieno: Nairobi traffic is an open-air concert arena...',
        "chapters": [
          { "time": '00:00', "title": 'The Sound Architecture of a Nganya' },
          { "time": '19:10', "title": 'Street "Cypher": 4 MCs One Microphone' }
        ]
      }
    ]
  },
  {
    "id": 'pod-afro-soul-lounge',
    "slug": 'afrosoul_lounge',
    "subdomain": 'afrosoul_lounge',
    "title": 'Afro-Soul & Neo-R&B Intimate Sessions',
    "host": 'Amina Mwangi & Sauti Juma',
    "hostRole": 'Neo-Soul Songwriter & Acoustic Guitar Virtuoso',
    "category": 'Vocal Jazz & Neo-Soul',
    "language": 'English / Swahili',
    "cadence": 'Bi-Weekly • Tuesdays',
    "subscribers": '124.0K',
    "totalStreams": '1.42M',
    "avgCompletionRate": '93%',
    "rating": 4.9,
    "accentColor": '#f59e0b',
    "secondaryColor": '#10b981',
    "coverArt": '/heroes/hero_music_1.png',
    "bannerUrl": '/headers/header_pricing.png',
    "trailerAudioUrl": '/api/stream/track/KE-TM1-26-00010',
    "description": 'Candlelight acoustic sessions, vocal arrangement breakdowns, songwriting philosophies, and intimate interviews with Pan-African R&B and soul divas.',
    "bio": 'Amina Mwangi invites Africa’s top soul artists to perform stripped-down acoustic sets and unpack the emotional songwriting journeys behind their biggest records.',
    "demographics": {
      "topRegions": [
        { "region": 'East Africa', "share": 40 },
        { "region": 'West Africa', "share": 30 },
        { "region": 'UK Diaspora', "share": 18 },
        { "region": 'North America', "share": 12 }
      ],
      "ageGroups": '20–42 (79%)',
      "listenerProfile": 'R&B lovers, soul singers, lyricists, romantic playlist curators, and acoustic listeners'
    },
    "sponsorshipRates": CANONICAL_PODCAST_SPONSORSHIP_RATES,
    "splits": [
      { "name": 'Amina Mwangi', "role": 'Host & Vocal Arranger', "share": 55 },
      { "name": 'Sauti Juma', "role": 'Acoustic Guitarist & Co-Host', "share": 45 }
    ],
    "pressQuotes": [
      { "outlet": 'OkayAfrica', "quote": 'Pure acoustic balm for the spirit. Amina’s intimate vocal sessions are unmatched.' }
    ],
    "episodes": [
      {
        "id": 'ep-as-21',
        "isrc": 'KE-TM1-26-00010',
        "episodeNumber": 21,
        "seasonNumber": 3,
        "title": 'Ep. "21": The Secret to Swahili Neo-Soul Harmonies & Acoustic Microphones',
        "artist": 'Amina Mwangi & Sauti Juma',
        "podcastTitle": 'Afro-Soul & Neo-R&B Intimate Sessions',
        "podcastSlug": 'afrosoul_lounge',
        "genre": 'Podcast • Afro-Soul',
        "releaseType": 'Podcast Episode',
        "duration": '47:15',
        "publishedAt": '4 days ago',
        "streams": '58.2K',
        "coverArt": '/heroes/hero_music_1.png',
        "audioUrl": '/api/stream/track/KE-TM1-26-00042',
        "sponsorBrand": 'Safaricom Neon Beats',
        "summary": 'Live acoustic performance of "Sauti ya Mombasa" and studio ribbon microphone positioning.',
        "transcript": 'Amina: When we layer these three-part vocal harmonies...',
        "chapters": [
          { "time": '00:00', "title": 'Live Acoustic Performance' },
          { "time": '14:20', "title": 'Vocal Stacking & Ribbon Mics' }
        ]
      }
    ]
  },
  {
    "id": 'pod-syncmavens-cues',
    "slug": 'syncmavens_cues',
    "subdomain": 'syncmavens_cues',
    "title": 'SyncMavens: Film, TV & Video Game Cues',
    "host": 'Elena Richter & Chloe Dupont',
    "hostRole": 'European Film Sync Supervisor & Paris Runway Director',
    "category": 'Sync Licensing & Hollywood Cues',
    "language": 'English / French',
    "cadence": 'Monthly • 15th of the Month',
    "subscribers": '88.5K',
    "totalStreams": '780K',
    "avgCompletionRate": '94%',
    "rating": 4.9,
    "accentColor": '#38bdf8',
    "secondaryColor": '#ec4899',
    "coverArt": '/heroes/hero_music_2.png',
    "bannerUrl": '/headers/header_tools.png',
    "trailerAudioUrl": '/api/stream/track/KE-TM1-26-00042',
    "description": 'Inside global film sync "placements": breakdown of EA Sports, Netflix, HBO, and international automotive sync briefs with instant pre-cleared escrow payouts.',
    "bio": 'Elena and Chloe break down the exact sonic characteristics and cue structures that get tracks selected for AAA video games, prestige TV dramas, and luxury brand runways.',
    "demographics": {
      "topRegions": [
        { "region": 'Europe (Germany, France, UK)', "share": 44 },
        { "region": 'North America', "share": 32 },
        { "region": 'Africa', "share": 24 }
      ],
      "ageGroups": '24–50 (86%)',
      "listenerProfile": 'Film directors, agency supervisors, video game audio heads, and composers'
    },
    "sponsorshipRates": CANONICAL_PODCAST_SPONSORSHIP_RATES,
    "splits": [
      { "name": 'Elena Richter', "role": 'Host & Sync Agent', "share": 50 },
      { "name": 'Chloe Dupont', "role": 'Co-Host & Creative Director', "share": 50 }
    ],
    "pressQuotes": [
      { "outlet": 'Billboard Sync & Score', "quote": 'The gold standard for understanding commercial sync monetization.' }
    ],
    "episodes": [
      {
        "id": 'ep-sm-33',
        "isrc": 'KE-TM1-26-00044',
        "episodeNumber": 33,
        "seasonNumber": 3,
        "title": 'Ep. "33": How to Format Instrumental Cues for AAA Video Game Soundtracks',
        "artist": 'Elena Richter & Chloe Dupont',
        "podcastTitle": 'SyncMavens: Film, TV & Video Game Cues',
        "podcastSlug": 'syncmavens_cues',
        "genre": 'Podcast • Sync & Video Games',
        "releaseType": 'Podcast Episode',
        "duration": '43:50',
        "publishedAt": '1 week ago',
        "streams": '38.6K',
        "coverArt": '/heroes/hero_music_2.png',
        "audioUrl": '/api/stream/track/KE-TM1-26-00042',
        "sponsorBrand": 'SyncMavens Film & TV',
        "summary": 'Adaptive game audio, looping stems, and multi-tier interactive layers.',
        "transcript": 'Chloe: In modern game engines like Unreal Engine 5, audio stems are triggered dynamically...',
        "chapters": [
          { "time": '00:00', "title": 'Adaptive Audio in Unreal Engine 5' },
          { "time": '16:00', "title": 'Stem Delivery & Delivery Timelines' }
        ]
      }
    ]
  },
  {
    "id": 'pod-cyberwave-electronic',
    "slug": 'cyberwave_electronic',
    "subdomain": 'cyberwave_electronic',
    "title": 'Cyberwave Electronic & Night DJ Sessions',
    "host": 'DJ Kalonje & DJ Sola',
    "hostRole": 'Stadium Arena Turntablist & Berlin Resident Selector',
    "category": 'Club Curation & Live DJ Mixes',
    "language": 'English / Sheng',
    "cadence": 'Weekly • Saturdays',
    "subscribers": '245.0K',
    "totalStreams": '3.80M',
    "avgCompletionRate": '95%',
    "rating": 5.0,
    "accentColor": '#10b981',
    "secondaryColor": '#00f2fe',
    "coverArt": '/heroes/hero_music_1.png',
    "bannerUrl": '/headers/header_ndufo_custom.jpg',
    "trailerAudioUrl": '/api/stream/track/KE-TM1-DJ-001',
    "description": 'High-energy electronic club anthems, underground Afro-tech transitions, live crowd telemetry, and exclusive uncompressed lossless DJ stems.',
    "bio": 'From Nairobi arena spectacles to Berlin and London club residencies, Kalonje and Sola deliver the definitive weekly electronic and Afro-tech audio experience.',
    "demographics": {
      "topRegions": [
        { "region": 'East Africa', "share": 42 },
        { "region": 'Europe (Germany, UK, Netherlands)', "share": 36 },
        { "region": 'North America', "share": 22 }
      ],
      "ageGroups": '18–35 (92%)',
      "listenerProfile": 'Clubbers, festivalgoers, touring DJs, producers, and electronic tastemakers'
    },
    "sponsorshipRates": CANONICAL_PODCAST_SPONSORSHIP_RATES,
    "splits": [
      { "name": 'DJ Kalonje', "role": 'Host & Turntablist', "share": 50 },
      { "name": 'DJ Sola', "role": 'Host & International Selector', "share": 50 }
    ],
    "pressQuotes": [
      { "outlet": 'DJ Mag', "quote": 'A masterclass in high-octane club mixing and cross-continental Afro-tech energy.' }
    ],
    "episodes": [
      {
        "id": 'ep-cw-90',
        "isrc": 'KE-TM1-DJ-001',
        "episodeNumber": 90,
        "seasonNumber": 5,
        "title": 'Ep. "90": Live from Nairobi "Cyberdome": 60 Minutes of Unreleased Afro-Tech',
        "artist": 'DJ Kalonje & DJ Sola',
        "podcastTitle": 'Cyberwave Electronic & Night DJ Sessions',
        "podcastSlug": 'cyberwave_electronic',
        "genre": 'Podcast • Electronic DJ Mix',
        "releaseType": 'Podcast Episode',
        "duration": '60:00',
        "publishedAt": '3 days ago',
        "streams": '112.4K',
        "coverArt": '/heroes/hero_music_1.png',
        "audioUrl": '/api/stream/track/KE-TM1-24-INTRO',
        "sponsorBrand": 'TuneStream Studio Suite',
        "summary": 'Recorded live before 8,000 fans at the Nairobi Cyberdome in full 24-bit 96kHz lossless audio.',
        "transcript": 'Kalonje: Turn up the monitor rigs—this next track is an unreleased dubplate from Berlin...',
        "chapters": [
          { "time": '00:00', "title": 'Cyberdome Arena Warmup (124 BPM)' },
          { "time": '22:15', "title": 'Berlin Watergate Live Transition' },
          { "time": '44:00', "title": 'Peak-Time Afro-Tech Finale' }
        ]
      }
    ]
  }
]

def seed_podcasts_if_empty():
    """Seed authoritative podcast shows, episodes, and Podcaster EPK records."""
    try:
        for show in DEFAULT_PODCAST_SHOWS:
            doc = {**show, "created_at": datetime.now(timezone.utc)}
            db.podcasts.update_one(
                {"slug": show["slug"]},
                {"$set": doc},
                upsert=True
            )
            # Also sync a corresponding Podcaster EPK record in db.epks so /epk/:subdomain works seamlessly
            epk_doc = {
                "subdomain": show["subdomain"],
                "artist_name": show["title"],
                "creator_type": "podcaster",
                "host_name": show["host"],
                "headline": f"{show['category']} Podcast • Hosted by {show['host']}",
                "bio": show["bio"],
                "accentColor": show["accentColor"],
                "secondaryColor": show["secondaryColor"],
                "heroImageUrl": show["bannerUrl"],
                "coverArt": show["coverArt"],
                "subscribers": show["subscribers"],
                "totalStreams": show["totalStreams"],
                "avgCompletionRate": show["avgCompletionRate"],
                "cadence": show["cadence"],
                "demographics": show["demographics"],
                "sponsorshipRates": show["sponsorshipRates"],
                "episodes": show["episodes"],
                "pressQuotes": show["pressQuotes"],
                "updated_at": datetime.now(timezone.utc)
            }
            db.epks.update_one(
                {"subdomain": show["subdomain"]},
                {"$set": epk_doc},
                upsert=True
            )
        logger.info("Seeded and synchronized all 12 authoritative Podcast Shows and Podcaster EPKs.")
    except Exception as e:
        logger.warning(f"Podcast seed note: {e}")


seed_podcasts_if_empty()


class PodcastShowCreateRequest(BaseModel):
    model_config = ConfigDict(extra="allow")
    title: str
    slug: Optional[str] = None
    host: str
    hostRole: Optional[str] = "Podcast Host & Producer"
    category: str = "Music Business"
    language: str = "English"
    cadence: str = "Weekly"
    description: str
    bio: Optional[str] = None
    accentColor: str = "#10b981"
    secondaryColor: str = "#00f2fe"
    coverArt: Optional[str] = "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg"
    bannerUrl: Optional[str] = "/headers/discography_retina_header.jpg"
    sponsorshipRates: Optional[List[Dict[str, Any]]] = None
    demographics: Optional[Dict[str, Any]] = None
    splits: Optional[List[Dict[str, Any]]] = None


class PodcastEpisodeCreateRequest(BaseModel):
    model_config = ConfigDict(extra="allow")
    title: str
    episodeNumber: int = 1
    seasonNumber: int = 1
    duration: str = "35:00"
    summary: str = ""
    transcript: Optional[str] = ""
    audioUrl: Optional[str] = "/api/stream/track/KE-TM1-26-00042"
    sponsorBrand: Optional[str] = "Safaricom Neon Beats"
    chapters: Optional[List[Dict[str, str]]] = None


class GuestBookingCreateRequest(BaseModel):
    guestName: str
    guestEmail: str
    inquiryType: str = "guest_pitch"  # 'guest_pitch' | 'sponsorship' | 'speaking'
    companyOrArtistName: Optional[str] = ""
    proposedTopic: str
    proposedBudgetCredits: Optional[int] = 0


@router.get("")
def list_podcasts(category: Optional[str] = None, q: Optional[str] = None):
    """Return all podcast shows with their episodes and Podcaster EPK metadata."""
    try:
        docs = list(db.podcasts.find({}))
        if not docs:
            seed_podcasts_if_empty()
            docs = list(db.podcasts.find({}))
        results = []
        for d in docs:
            d["_id"] = str(d["_id"])
            if category and category.lower() != "all":
                if category.lower() not in (d.get("category") or "").lower():
                    continue
            if q:
                q_low = q.lower()
                hay = f"{d.get('title', '')} {d.get('host', '')} {d.get('description', '')} {d.get('category', '')}".lower()
                if q_low not in hay:
                    continue
            results.append(d)
        return {"podcasts": results, "total": len(results)}
    except Exception:
        return {"podcasts": DEFAULT_PODCAST_SHOWS, "total": len(DEFAULT_PODCAST_SHOWS)}


@router.get("/dashboard/analytics")
def get_podcaster_dashboard_analytics(request: Request):
    """Return comprehensive Podcaster Backend analytics, corporate ad revenue, and guest pitches."""
    try:
        shows = list(db.podcasts.find({}))
        if not shows:
            shows = DEFAULT_PODCAST_SHOWS
        for s in shows:
            s.pop("_id", None)
        bookings = list(db.podcast_guest_bookings.find({}).sort("created_at", -1).limit(25))
        for b in bookings:
            b["_id"] = str(b["_id"])
    except Exception:
        shows = DEFAULT_PODCAST_SHOWS
        bookings = []

    if not bookings:
        bookings = [
            {
                "id": "gb-101",
                "podcastSlug": "indieartistpod",
                "guestName": "DJ Spinall Management",
                "guestEmail": "booking@djspinall.com",
                "inquiryType": "guest_pitch",
                "companyOrArtistName": "TheCAP Music",
                "proposedTopic": "Cross-continent Afrobeats touring & festival sound systems",
                "proposedBudgetCredits": 0,
                "status": "pending",
                "createdAt": "2 hours ago"
            },
            {
                "id": "gb-102",
                "podcastSlug": "indieartistpod",
                "guestName": "Safaricom Brand Media Desk",
                "guestEmail": "brand_media@safaricom.co.ke",
                "inquiryType": "sponsorship",
                "companyOrArtistName": "Safaricom PLC",
                "proposedTopic": "60s Host-Read Mid-Roll Series Sponsorship (4 Episodes)",
                "proposedBudgetCredits": 24000,
                "status": "approved",
                "createdAt": "1 day ago"
            },
            {
                "id": "gb-103",
                "podcastSlug": "africansoundscapes",
                "guestName": "Sundance Documentary Sound Team",
                "guestEmail": "licensing@sundance.org",
                "inquiryType": "speaking",
                "companyOrArtistName": "Sundance Institute",
                "proposedTopic": "Binaural field recording license & panelist invitation",
                "proposedBudgetCredits": 12500,
                "status": "pending",
                "createdAt": "3 days ago"
            }
        ]

    return {
        "kpis": {
            "totalStreams": 482900,
            "totalSubscribers": 142400,
            "avgCompletionRate": "86.4%",
            "corporateAdRevenueUsd": 4850.00,
            "corporateAdCredits": 24250,
            "directListenerTipCredits": 6400,
            "activeShowsCount": len(shows),
            "totalEpisodesCount": sum(len(s.get("episodes", [])) for s in shows)
        },
        "shows": shows,
        "guestBookings": bookings,
        "syndicationDirectories": [
            {"name": "TuneStream 24-Bit Lossless Podcasts", "status": "Live • Primary Host", "listeners": "68.4K"},
            {"name": "Apple Podcasts (RSS 2.0 Sync)", "status": "Connected • Auto-Sync", "listeners": "34.2K"},
            {"name": "Spotify Podcasts (Passthrough)", "status": "Connected • Auto-Sync", "listeners": "21.9K"},
            {"name": "YouTube Podcasts & Video Simulcast", "status": "Connected • 4K Video", "listeners": "12.8K"},
            {"name": "Amazon Music & Audible", "status": "Connected • Auto-Sync", "listeners": "5.1K"}
        ]
    }


@router.get("/{slug}")
def get_podcast_by_slug(slug: str):
    """Retrieve a single podcast show, its full episode catalog, and its Podcaster EPK."""
    clean = slug.lower().strip()
    try:
        doc = db.podcasts.find_one({"$or": [{"slug": clean}, {"subdomain": clean}, {"id": clean}]})
        if doc:
            doc["_id"] = str(doc["_id"])
            return doc
    except Exception:
        pass

    for s in DEFAULT_PODCAST_SHOWS:
        if s["slug"] == clean or s["id"] == clean:
            return s
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Podcast show not found")


@router.post("")
def create_or_update_podcast_show(payload: PodcastShowCreateRequest, request: Request):
    """Create or update a Podcast Show and synchronize its Podcaster EPK."""
    slug = (payload.slug or payload.title).lower().strip().replace(" ", "").replace("-", "")[:28]
    if not slug:
        slug = f"podcast{uuid.uuid4().hex[:6]}"

    existing = None
    try:
        existing = db.podcasts.find_one({"slug": slug})
    except Exception:
        existing = None

    show_doc = {
        "id": existing.get("id") if existing else f"pod-{slug}",
        "slug": slug,
        "subdomain": slug,
        "title": payload.title.strip(),
        "host": payload.host.strip(),
        "hostRole": payload.hostRole or "Podcast Host & Producer",
        "category": payload.category,
        "language": payload.language,
        "cadence": payload.cadence,
        "subscribers": existing.get("subscribers", "12.5K") if existing else "12.5K",
        "totalStreams": existing.get("totalStreams", "84.0K") if existing else "84.0K",
        "avgCompletionRate": existing.get("avgCompletionRate", "87%") if existing else "87%",
        "rating": existing.get("rating", 4.9) if existing else 4.9,
        "accentColor": payload.accentColor,
        "secondaryColor": payload.secondaryColor,
        "coverArt": payload.coverArt or "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
        "bannerUrl": payload.bannerUrl or "/headers/discography_retina_header.jpg",
        "trailerAudioUrl": "/api/stream/track/KE-TM1-24-INTRO",
        "description": payload.description,
        "bio": payload.bio or payload.description,
        "demographics": payload.demographics or DEFAULT_PODCAST_SHOWS[0]["demographics"],
        "sponsorshipRates": payload.sponsorshipRates or DEFAULT_PODCAST_SHOWS[0]["sponsorshipRates"],
        "splits": payload.splits or [
            {"name": payload.host.strip(), "role": "Lead Host & Producer", "share": 100}
        ],
        "pressQuotes": existing.get("pressQuotes", DEFAULT_PODCAST_SHOWS[0]["pressQuotes"]) if existing else DEFAULT_PODCAST_SHOWS[0]["pressQuotes"],
        "episodes": existing.get("episodes", []) if existing else [],
        "updated_at": datetime.now(timezone.utc)
    }

    try:
        db.podcasts.update_one({"slug": slug}, {"$set": show_doc}, upsert=True)
        epk_doc = {
            "subdomain": slug,
            "artist_name": show_doc["title"],
            "creator_type": "podcaster",
            "host_name": show_doc["host"],
            "headline": f"{show_doc['category']} Podcast • Hosted by {show_doc['host']}",
            "bio": show_doc["bio"],
            "accentColor": show_doc["accentColor"],
            "secondaryColor": show_doc["secondaryColor"],
            "heroImageUrl": show_doc["bannerUrl"],
            "coverArt": show_doc["coverArt"],
            "subscribers": show_doc["subscribers"],
            "totalStreams": show_doc["totalStreams"],
            "avgCompletionRate": show_doc["avgCompletionRate"],
            "cadence": show_doc["cadence"],
            "demographics": show_doc["demographics"],
            "sponsorshipRates": show_doc["sponsorshipRates"],
            "episodes": show_doc["episodes"],
            "pressQuotes": show_doc["pressQuotes"],
            "updated_at": datetime.now(timezone.utc)
        }
        db.epks.update_one({"subdomain": slug}, {"$set": epk_doc}, upsert=True)
    except Exception as e:
        logger.warning(f"Podcast DB write warning: {e}")

    return {"success": True, "podcast": show_doc, "epkUrl": f"/epk/{slug}"}


@router.post("/{slug}/episodes")
def publish_podcast_episode(slug: str, payload: PodcastEpisodeCreateRequest):
    """Publish a new episode to a podcast show and update its Podcaster EPK."""
    clean = slug.lower().strip()
    show = None
    try:
        show = db.podcasts.find_one({"slug": clean})
    except Exception:
        pass
    if not show:
        for s in DEFAULT_PODCAST_SHOWS:
            if s["slug"] == clean:
                show = {**s}
                break
    if not show:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Podcast show not found")

    ep_id = f"ep-{clean}-{uuid.uuid4().hex[:6]}"
    new_episode = {
        "id": ep_id,
        "isrc": f"KE-POD-26-{uuid.uuid4().hex[:5].upper()}",
        "episodeNumber": payload.episodeNumber,
        "seasonNumber": payload.seasonNumber,
        "title": payload.title.strip(),
        "artist": show.get("host", "Podcast Host"),
        "podcastTitle": show.get("title", "Podcast"),
        "podcastSlug": clean,
        "genre": f"Podcast • {show.get('category', 'Talk')}",
        "releaseType": "Podcast Episode",
        "duration": payload.duration,
        "publishedAt": "Just now",
        "streams": "1.2K",
        "coverArt": show.get("coverArt", "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg"),
        "audioUrl": payload.audioUrl or "/api/stream/track/KE-TM1-26-00042",
        "sponsorBrand": payload.sponsorBrand or "Safaricom Neon Beats",
        "summary": payload.summary,
        "transcript": payload.transcript or f"Transcript for {payload.title.strip()}...",
        "chapters": payload.chapters or [
            {"time": "00:00", "title": "Intro & Sponsor Read"},
            {"time": "03:30", "title": "Main Conversation"},
            {"time": "25:00", "title": "Listener Takeaways & Outro"}
        ]
    }

    episodes = [new_episode] + list(show.get("episodes", []))
    try:
        db.podcasts.update_one({"slug": clean}, {"$set": {"episodes": episodes}})
        db.epks.update_one({"subdomain": clean}, {"$set": {"episodes": episodes}})
    except Exception as e:
        logger.warning(f"Episode persistence warning: {e}")

    return {"success": True, "episode": new_episode, "episodes": episodes}


@router.post("/{slug}/book-guest")
def submit_guest_or_sponsor_booking(slug: str, payload: GuestBookingCreateRequest):
    """Submit a guest appearance pitch or corporate sponsorship booking from a Podcaster EPK."""
    clean = slug.lower().strip()
    booking_doc = {
        "id": f"gb-{uuid.uuid4().hex[:6]}",
        "podcastSlug": clean,
        "guestName": payload.guestName.strip(),
        "guestEmail": payload.guestEmail.strip(),
        "inquiryType": payload.inquiryType,
        "companyOrArtistName": payload.companyOrArtistName,
        "proposedTopic": payload.proposedTopic,
        "proposedBudgetCredits": payload.proposedBudgetCredits or 0,
        "status": "pending",
        "createdAt": "Just now",
        "created_at": datetime.now(timezone.utc)
    }
    try:
        db.podcast_guest_bookings.insert_one(booking_doc)
        booking_doc.pop("_id", None)
    except Exception:
        pass
    return {
        "success": True,
        "booking": booking_doc,
        "message": "Your request has been sent directly to the Podcaster's Studio CRM & Booking Desk."
    }


@router.get("/{slug}/rss.xml")
def generate_podcast_rss_feed(slug: str):
    """Generate a standards-compliant RSS 2.0 + iTunes XML feed for external podcast directories."""
    show = get_podcast_by_slug(slug)
    items_xml = ""
    for ep in show.get("episodes", []):
        items_xml += f"""
    <item>
      <title><![CDATA[{ep.get('title')}]]></title>
      <itunes:author><![CDATA[{show.get('host')}]]></itunes:author>
      <description><![CDATA[{ep.get('summary', '')}]]></description>
      <enclosure url="https://tunestream.co{ep.get('audioUrl', '/api/stream/track/KE-TM1-26-00042')}" length="24500000" type="audio/flac" />
      <guid isPermaLink="false">{ep.get('id')}</guid>
      <itunes:duration>{ep.get('duration', '35:00')}</itunes:duration>
      <itunes:episode>{ep.get('episodeNumber', 1)}</itunes:episode>
      <itunes:season>{ep.get('seasonNumber', 1)}</itunes:season>
    </item>"""

    rss_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title><![CDATA[{show.get('title')}]]></title>
    <link>https://tunemavens.com/#/epk/{show.get('slug')}</link>
    <language>en-us</language>
    <itunes:author><![CDATA[{show.get('host')}]]></itunes:author>
    <description><![CDATA[{show.get('description')}]]></description>
    <itunes:category text="{show.get('category', 'Music')}" />
    {items_xml}
  </channel>
</rss>"""
    return Response(content=rss_xml, media_type="application/rss+xml")
