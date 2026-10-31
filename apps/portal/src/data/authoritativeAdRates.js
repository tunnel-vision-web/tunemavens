// Single Source of Truth for Corporate Ad Services & Podcast Sponsorship Rates
// Used across CorporateLandingPage, CorporateAdsPanel, PodcastStreamingHub, PodcasterEpkModal, and PodcasterStudioWorkspace.

export const AUTHORITATIVE_AD_RATES = [
  {
    slug: 'pulse',
    name: 'Audio Interstitial Starter (Pulse)',
    podcastSlotName: '15s Pre-Roll Audio Spot (Pulse)',
    placementType: 'Pre-Roll / Between-Track Spot',
    tier_badge: 'Essential Reach',
    price_usd: 499.0,
    credits: 2500,
    cpm_usd: 19.96,
    guaranteed_impressions: 25000,
    duration_days: 30,
    spot_duration_seconds: 15,
    formats: [
      '15s Studio Audio Interstitial on TuneStream & Podcasts',
      '300x250 Display Companion Banner'
    ],
    features: [
      '25,000 Guaranteed Stream Impressions (~$19.96 CPM base)',
      '15s Unskippable Pre-Roll / Interval Audio Spot on Free Tier',
      'Single-genre & podcast category targeting',
      'Frequency capping (max 1x per hour per listener)',
      'Verified audio completion auditing (75% & 100% completions)',
      'Intermaven Smart CRM lead capture routing'
    ],
    is_popular: false,
    cta: 'Book Pulse Spot'
  },
  {
    slug: 'amplified',
    name: 'Targeted Campaign Growth (Amplified)',
    podcastSlotName: '60s Host-Read Mid-Roll & Banner (Amplified)',
    placementType: 'Mid-Roll Host-Read + Companion Banner',
    tier_badge: 'Most Popular',
    price_usd: 1499.0,
    credits: 7500,
    cpm_usd: 14.99,
    guaranteed_impressions: 100000,
    duration_days: 30,
    spot_duration_seconds: 30,
    formats: [
      '15s & 30s High-Fidelity Audio Spots + 60s Podcast Host-Read',
      'In-Player Interactive Companion Banner',
      'Creator & Podcaster EPK Banner Takeovers'
    ],
    features: [
      '100,000 Guaranteed Stream Impressions (~$14.99 CPM base)',
      '60s Host-Read Mid-Roll endorsement + 30s TuneStream Audio Spots',
      'Subculture & territory geo-targeting (East Africa, West Africa, UK Diaspora, US Urban)',
      'Interactive click-through voucher / instant discount code redemption',
      '100% indemnified sync rights on commercial background audio',
      'Live attribution dashboard with conversion heatmaps & CTR reporting'
    ],
    is_popular: true,
    cta: 'Launch Amplified Spot'
  },
  {
    slug: 'culture-lead',
    name: 'Artist & Podcast EPK Co-Sponsorship (Culture Lead)',
    podcastSlotName: '4-Episode Show Title & EPK Sponsorship (Culture Lead)',
    placementType: 'Show Title Sponsor + EPK Hero Takeover',
    tier_badge: 'Cultural Alignment',
    price_usd: 3999.0,
    credits: 20000,
    cpm_usd: 13.33,
    guaranteed_impressions: 300000,
    duration_days: 60,
    spot_duration_seconds: 30,
    formats: [
      '4-Episode Podcast Title Sponsorship ("Presented by...")',
      'Co-Branded Digital QR Ticket Passes',
      'Hero Carousel Banner on Creator & Podcaster EPKs'
    ],
    features: [
      '300,000+ Multichannel Fan Impressions across podcasts, live tours & digital EPKs',
      '4-Episode Show Title Sponsorship + Co-branded Digital QR Ticket Passes',
      'Custom Subdomain Hero Carousel slot on Creator & Podcaster Web Worlds',
      'Experiential on-site sampling booth integration & M-Pesa STK sampling push',
      'Smart CRM automated omnichannel lead routing (WhatsApp, SMS, Email)',
      'Dedicated creator & podcast host social co-mention protocol'
    ],
    is_popular: false,
    cta: 'Sponsor Show & Tour'
  },
  {
    slug: 'titan',
    name: 'Enterprise Omnichannel Takeover (Titan)',
    podcastSlotName: 'Full-Season Category Exclusive Takeover (Titan)',
    placementType: 'Full-Season Exclusive + Network Takeover',
    tier_badge: 'Category Exclusive',
    price_usd: 9999.0,
    credits: 50000,
    cpm_usd: 9.99,
    guaranteed_impressions: 1000000,
    duration_days: 90,
    spot_duration_seconds: 60,
    formats: [
      '100% Podcast Season & Station Share of Voice',
      'SyncMavens Sync Brief Commercial Ingress',
      'Custom Mother-CMS Brand Hub'
    ],
    features: [
      '1,000,000+ Omnichannel Impressions across TuneMavens, TuneStream & SyncMavens',
      '100% Category Exclusivity (zero competing brand ads in your industry vertical)',
      'Custom Sonic Branding & Audio Logo production by verified audio engineers',
      'Priority Sync Brief matching for national TV spots on SyncMavens',
      'Direct CRM API Webhook stream for real-time customer data sync',
      'Dedicated Senior Agency Media Director & quarterly audit reporting'
    ],
    is_popular: false,
    cta: 'Request Enterprise RFP'
  }
];

export const PODCAST_SPONSORSHIP_PACKAGES = {
  preRoll: AUTHORITATIVE_AD_RATES[0],     // $499 USD / 2,500 Credits / $19.96 CPM
  midRoll: AUTHORITATIVE_AD_RATES[1],     // $1,499 USD / 7,500 Credits / $14.99 CPM
  titleSponsor: AUTHORITATIVE_AD_RATES[2], // $3,999 USD / 20,000 Credits / $13.33 CPM
  enterprise: AUTHORITATIVE_AD_RATES[3]    // $9,999 USD / 50,000 Credits / $9.99 CPM
};
