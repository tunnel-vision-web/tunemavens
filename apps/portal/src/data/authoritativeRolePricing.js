// Single Source of Truth for Role Tier Packages & Pricing across TuneMavens
// Synchronized with backend/routes/role_tiers_router.py and authoritativeAdRates.js.

export const AUTHORITATIVE_PODCASTER_PACKAGES = [
  {
    role: 'podcaster',
    slug: 'podcaster-starter',
    name: 'Starter Cast Pool',
    tier_badge: 'Free Forever',
    price_usd: 0.0,
    billing_period: 'forever free starter credits',
    credits: 50,
    key_metric: '5 Hours Audio Hosting · Fast RSS Feed',
    features: [
      'Automatic feed delivery to Apple Podcasts, Spotify, and TuneStream',
      '5 hours of high-quality episode audio storage with fast global playback',
      'Clear listener stats: total downloads, listener countries, and popular devices',
      'Simple episode upload with automatic cover art and episode tags',
      'Ready-to-use web player embed for your personal website or blog',
      '50 free starter credits for automated audio voice cleanup'
    ],
    is_popular: false,
    cta: 'Start Free Podcast'
  },
  {
    role: 'podcaster',
    slug: 'podcaster-studio',
    name: 'Studio Pro Host',
    tier_badge: 'Most Popular',
    price_usd: 19.0,
    billing_period: 'one-time credit reload',
    credits: 250,
    key_metric: '25 Hours Studio Sound · Built-In Sponsor Ads',
    features: [
      'Studio-grade sound leveling: voices sound crisp, loud, and balanced everywhere',
      'Earn from sponsors: automatically play relevant ads to your listeners',
      'Live Media Kit: share your verified download stats with brands in one link',
      'Automatic team payouts: send co-hosts and producers their share via M-Pesa or bank',
      'Instant voice-to-text transcripts and clickable episode chapter markers',
      '250 credits reload with zero monthly fees — only pay when you need credits'
    ],
    is_popular: true,
    cta: 'Go Studio Pro'
  },
  {
    role: 'podcaster',
    slug: 'podcaster-network',
    name: 'Network & Syndicate',
    tier_badge: 'Multi-Show Suite',
    price_usd: 59.0,
    billing_period: 'one-time credit reload',
    credits: 850,
    key_metric: 'Unlimited Shows · Priority Sponsor Matching',
    features: [
      'Manage multiple podcasts and channels all in one simple account',
      'Priority access to corporate brand sponsors looking to book ad campaigns',
      'Branded web player with your own links and sponsor promotional banners',
      'Easy guest booking calendar and remote recording connections',
      'Direct listener tipping: fans can tip you via M-Pesa or card with 0% platform take',
      '850 credits reload and dedicated audio engineering support (no expiry)'
    ],
    is_popular: false,
    cta: 'Launch Network Suite'
  }
];

export const AUTHORITATIVE_VC_PACKAGES = [
  {
    role: 'vc',
    slug: 'vc-syndicate',
    name: 'Angel Syndicate Pool',
    tier_badge: 'Co-Investment',
    price_usd: 10000.0,
    billing_period: 'minimum allocation',
    credits: 0,
    key_metric: '20% - 22% Expected Return · Single Tour Projects',
    features: [
      'Invest in vetted single-tour and multi-city concert projects',
      'Paid back first from every ticket sold before artist profits are released',
      'Direct access to live ticket sales, Spotify streaming numbers, and tour budgets',
      'Backed by standardized, legally binding contracts with zero speculation',
      'TuneMavens acts as secure technology and escrow intermediary (3.0% fee)',
      '0 platform credits charged — permanent fee exemption for investors'
    ],
    is_popular: false,
    cta: 'Join Syndicate Pool'
  },
  {
    role: 'vc',
    slug: 'vc-growth',
    name: 'Cultural Growth Fund',
    tier_badge: 'Most Popular',
    price_usd: 50000.0,
    billing_period: 'recommended deployment',
    credits: 0,
    key_metric: '22% - 25% Expected Return · Multi-Artist Tour Portfolio',
    features: [
      'Spread capital across top-performing recording artists and headline festival DJs',
      'Automated deal alerts whenever an artist experiences a surge in streaming fans',
      'Senior claim on ticket sales plus streaming royalties for downside protection',
      'Dedicated portfolio manager with quarterly audit and tax-ready reporting packs',
      'Optional tool to sponsor artist production equipment with 1.25x fixed returns',
      'Zero annual management fees and zero platform subscription charges'
    ],
    is_popular: true,
    cta: 'Deploy Growth Facility'
  },
  {
    role: 'vc',
    slug: 'vc-institutional',
    name: 'Institutional Tour Desk',
    tier_badge: 'Enterprise Facility',
    price_usd: 250000.0,
    billing_period: 'custom credit line',
    credits: 0,
    key_metric: '24% - 26% Expected Return · Global Tour Corridors',
    features: [
      'Bespoke legal structures (SPVs) tailored to your fund’s exact criteria',
      'Cross-border tour financing covering 48+ live corridors (Africa, UK, US, EU, UAE)',
      'Direct data API connecting to your fund’s internal analytics models',
      'Priority repayment waterfall locked directly into ticketing payment gateways',
      'Lead investor syndication rights: bring your own co-investors into larger deals',
      'VIP artist tour hospitality access and direct relationships with top artist teams'
    ],
    is_popular: false,
    cta: 'Inquire Institutional Desk'
  }
];

export const AUTHORITATIVE_DJ_PACKAGES = [
  {
    role: 'dj',
    slug: 'dj-resident',
    name: 'Club Resident Load',
    tier_badge: 'Essential Pool',
    price_usd: 19.0,
    billing_period: 'one-time credit reload',
    credits: 200,
    key_metric: '50 Lossless Downloads · Clean & Dirty Edits',
    features: [
      'Access curated record pools across Afrobeat, Amapiano, Hip Hop, and Dance',
      'Pre-analyzed tracks with verified BPM, musical key, and Rekordbox cue markers',
      '50 high-speed track downloads with intro/outro extended edits (non-expiring)',
      'Compatible with Pioneer Rekordbox, Serato DJ Pro, and Traktor Pro',
      'Verified DJ identity badge on TuneStream and community forums'
    ],
    is_popular: false,
    cta: 'Join DJ Pool'
  },
  {
    role: 'dj',
    slug: 'dj-touring',
    name: 'Touring Pro DJ Load',
    tier_badge: 'Most Popular',
    price_usd: 49.0,
    billing_period: 'one-time credit reload',
    credits: 600,
    key_metric: 'Unlimited Downloads · Stems & Exclusive Dubplates',
    features: [
      'Lossless WAV masters and separated remix stems download pack',
      'Exclusive unreleased artist dubplates & early club test pressings before public release',
      'Digital proof clearance hashes protecting your venue and live streams from DMCA strikes',
      'Direct feedback loop: rate unreleased tracks to send data straight to record label A&Rs',
      '600 unified credits load for high-priority dubplate requests (zero monthly fees)',
      'Priority download queue bandwidth for weekend set preparation'
    ],
    is_popular: true,
    cta: 'Go Touring Pro'
  },
  {
    role: 'dj',
    slug: 'dj-headliner',
    name: 'Headline & Festival Curator Load',
    tier_badge: 'Taste-Maker',
    price_usd: 129.0,
    billing_period: 'one-time credit reload',
    credits: 1800,
    key_metric: 'Direct Label Drop Inbox & Radio Mix Distribution',
    features: [
      'Personalized promo inbox where top labels send unreleased tracks directly for your sets',
      'Host verified syndicated mix series & live DJ sessions on TuneStream Web Radio',
      'Monetize live DJ sets with direct listener tipping and listener tip splits',
      'VIP access to artist tour soundchecks and festival press rooms',
      '1,800 unified credits load & personal artist liaison support (zero monthly fees)'
    ],
    is_popular: false,
    cta: 'Apply for Headliner Tier'
  }
];

export const AUTHORITATIVE_LABEL_PACKAGES = [
  {
    role: 'label',
    slug: 'label-indie',
    name: 'Indie Imprint Load',
    tier_badge: 'Starter Roster',
    price_usd: 99.0,
    billing_period: 'one-time credit reload',
    credits: 1000,
    key_metric: 'Up to 10 Signed Artists · 100 Tracks',
    features: [
      'Manage up to 10 signed creator profiles with isolated roster seats',
      'Automated CSV statement parser (DistroKid, TuneCore, FUGA, Orchard)',
      'Split Cascade net calculations with advance balance tracking',
      'Pre-cleared label roster sync pitching on SyncMavens',
      '1,000 unified credits load with zero monthly recurring charges',
      'Standard email & chat label support'
    ],
    is_popular: false,
    cta: 'Start Indie Imprint'
  },
  {
    role: 'label',
    slug: 'label-growth',
    name: 'Scale Label Operations Load',
    tier_badge: 'Most Popular',
    price_usd: 299.0,
    billing_period: 'one-time credit reload',
    credits: 3500,
    key_metric: 'Up to 50 Signed Artists · 1,000 Tracks',
    features: [
      'Up to 50 active artists & 1,000 master tracks with stem archives',
      'Automated master advance recoupment cascades (90/10 down to 50/50)',
      'Role-based staff permissions (A&R, Legal, Head of Accounting)',
      'TunePay live tour merch & festival ticket box-office settlement',
      'Intermaven Smart CRM automated roster fan broadcasts (WhatsApp/SMS)',
      '3,500 unified credits load with zero monthly recurring charges'
    ],
    is_popular: true,
    cta: 'Scale Label Operations'
  },
  {
    role: 'label',
    slug: 'label-enterprise',
    name: 'Major / Conglomerate Enterprise Load',
    tier_badge: 'Unlimited Scale',
    price_usd: 799.0,
    billing_period: 'one-time credit reload',
    credits: 10000,
    key_metric: 'Unlimited Artists & Masters · Custom White-Label',
    features: [
      'Unlimited roster size and unlimited catalog ingestion',
      'Custom white-labeled artist portal for signing and settlement',
      'Direct bank rail & mobile money bulk payouts (M-Pesa B2C, ACH, SWIFT)',
      'Full ERP & accounting API webhooks for QuickBooks / NetSuite sync',
      'Priority Sync Brief placement exclusivity across SyncMavens network',
      '10,000 unified credits load, custom SLA & 24/7 dedicated engineering support'
    ],
    is_popular: false,
    cta: 'Request Enterprise Agreement'
  }
];
