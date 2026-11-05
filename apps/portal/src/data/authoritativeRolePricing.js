// Single Source of Truth for Role Tier Packages & Pricing across TuneMavens
// Synchronized with backend/routes/role_tiers_router.py and authoritativeAdRates.js.

export const AUTHORITATIVE_PODCASTER_PACKAGES = [
  {
    role: 'podcaster',
    slug: 'podcaster-free',
    name: 'Starter Cast Pool',
    tier_badge: 'Free Forever',
    price_usd: 0.0,
    billing_period: 'free access',
    credits: 50,
    key_metric: '5 Hours Audio Hosting · 50 Free Signup Credits',
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
    slug: 'podcaster-starter',
    name: 'Starter Host Floor',
    tier_badge: 'Accessible Floor',
    price_usd: 2.50,
    billing_period: 'one-time credit reload',
    credits: 250,
    key_metric: '250 Credits ($2.50 / KSh 250) · Studio Sound Leveling',
    features: [
      '250 non-expiring unified credits load ($2.50 / KSh 250)',
      'Studio-grade sound leveling: crisp, balanced voices on all devices',
      'Instant voice-to-text transcripts & chapter markers (single episode)',
      'Live Media Kit link to share verified download counts with sponsors',
      'Direct listener tipping via M-Pesa or card with 100% creator retention'
    ],
    is_popular: false,
    cta: 'Get Starter Floor'
  },
  {
    role: 'podcaster',
    slug: 'podcaster-growth',
    name: 'Growth Show Host',
    tier_badge: 'Active Show',
    price_usd: 5.00,
    billing_period: 'one-time credit reload',
    credits: 500,
    key_metric: '500 Credits ($5.00 / KSh 500) · WhatsApp Alerts & Transcripts',
    features: [
      '500 non-expiring unified credits load ($5.00 / KSh 500)',
      'WhatsApp automated listener alerts for newly published episodes',
      'Multi-episode automated audio cleanup and dynamic voice isolation',
      'Split Cascade automatic payouts to co-hosts, producers & editors',
      'Server-side dynamic ad insertion (DAI) monetization enabled'
    ],
    is_popular: false,
    cta: 'Get Growth Pack'
  },
  {
    role: 'podcaster',
    slug: 'podcaster-studio',
    name: 'Studio Pro Host',
    tier_badge: 'Most Popular',
    price_usd: 10.00,
    billing_period: 'one-time credit reload',
    credits: 1000,
    key_metric: '1,000 Credits ($10.00 / KSh 1,000) · Built-In Sponsor Ads',
    features: [
      '1,000 non-expiring unified credits load ($10.00 / KSh 1,000)',
      'Priority matching with Corporate Brand Sponsors looking for ad spots',
      'Custom podcast web player embed with your brand links & sponsor banners',
      'Automated team payouts: co-hosts & editors paid automatically via M-Pesa/bank',
      'Lossless 24-bit podcast episode archive and uncompressed stems backup',
      'Full media kit analytics exports for sponsor RFP proposals'
    ],
    is_popular: true,
    cta: 'Go Studio Pro'
  },
  {
    role: 'podcaster',
    slug: 'podcaster-scale',
    name: 'Studio Network Pack',
    tier_badge: 'Multi-Show Scale',
    price_usd: 50.00,
    billing_period: 'one-time credit reload',
    credits: 5000,
    key_metric: '5,000 Credits ($50.00 / KSh 5,000) · Multi-Show Hosting',
    features: [
      '5,000 non-expiring unified credits load ($50.00 / KSh 5,000)',
      'Manage up to 5 individual podcast shows under a single network dashboard',
      'Cross-show sponsor campaigns and unified audience demographics',
      'Escrow contract agreements for guest appearances and celebrity co-hosts',
      'Direct sponsor ad flight bidding and dynamic preroll/midroll insertion'
    ],
    is_popular: false,
    cta: 'Get Studio Network'
  },
  {
    role: 'podcaster',
    slug: 'podcaster-network',
    name: 'Syndicate & Media Suite',
    tier_badge: 'Network & Syndicate',
    price_usd: 75.00,
    billing_period: 'one-time credit reload',
    credits: 7500,
    key_metric: '7,500 Credits ($75.00 / KSh 7,500) · Enterprise Syndicate',
    features: [
      '7,500 non-expiring unified credits load ($75.00 / KSh 7,500)',
      'Unlimited shows and channels with multi-seat producer & host permissions',
      'Direct API webhooks for enterprise radio & broadcast syndication',
      'Priority access to corporate brand sponsors and campaign agencies',
      'Dedicated audio engineer liaison and customized broadcast compliance'
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
    slug: 'dj-free',
    name: 'DJ Pool Discovery',
    tier_badge: 'Free Preview',
    price_usd: 0.0,
    billing_period: 'free access',
    credits: 50,
    key_metric: 'Curated Track Search · 50 Free Signup Credits',
    features: [
      'Access curated record pools across Afrobeat, Amapiano, Hip Hop, and Dance',
      'Pre-analyzed tracks with verified BPM, musical key, and Rekordbox cue markers',
      'Listen to high-quality audio previews of club edits and extended mixes',
      '50 free signup credits to test lossless track downloads',
      'Verified DJ identity badge on TuneStream and community forums'
    ],
    is_popular: false,
    cta: 'Explore DJ Pool Free'
  },
  {
    role: 'dj',
    slug: 'dj-starter',
    name: 'Starter DJ Floor',
    tier_badge: 'Accessible Floor',
    price_usd: 2.50,
    billing_period: 'one-time credit reload',
    credits: 250,
    key_metric: '250 Credits ($2.50 / KSh 250) · 25 Lossless Club Edits',
    features: [
      '250 non-expiring unified credits load ($2.50 / KSh 250)',
      '25 lossless WAV & 320kbps MP3 club track downloads (intro/outro edits)',
      'Compatible with Pioneer Rekordbox, Serato DJ Pro, and Traktor Pro',
      'BPM and key detection tags written directly into audio ID3 metadata',
      'Zero monthly subscription bills — credits stay in your wallet forever'
    ],
    is_popular: false,
    cta: 'Get Starter DJ Floor'
  },
  {
    role: 'dj',
    slug: 'dj-resident',
    name: 'Club Resident Pack',
    tier_badge: 'Resident Essential',
    price_usd: 5.00,
    billing_period: 'one-time credit reload',
    credits: 500,
    key_metric: '500 Credits ($5.00 / KSh 500) · Weekly Set Preps',
    features: [
      '500 non-expiring unified credits load ($5.00 / KSh 500)',
      '50+ high-speed extended edits, transition tracks, and clean/dirty versions',
      'WhatsApp alerts when new exclusive club promo drops arrive in your genres',
      'Direct feedback loop to record label A&Rs on crowd reaction',
      'Priority download bandwidth for weekend club set preparation'
    ],
    is_popular: false,
    cta: 'Get Resident Pack'
  },
  {
    role: 'dj',
    slug: 'dj-touring',
    name: 'Touring Pro DJ Load',
    tier_badge: 'Most Popular',
    price_usd: 10.00,
    billing_period: 'one-time credit reload',
    credits: 1000,
    key_metric: '1,000 Credits ($10.00 / KSh 1,000) · Stems & Dubplates',
    features: [
      '1,000 non-expiring unified credits load ($10.00 / KSh 1,000)',
      'Exclusive unreleased artist dubplates & early club test pressings',
      'Lossless WAV masters and separated remix stems download pack',
      'Digital proof clearance hashes protecting your sets from DMCA strikes',
      'Live DJ set tipping integration with M-Pesa QR codes for your booth'
    ],
    is_popular: true,
    cta: 'Go Touring Pro'
  },
  {
    role: 'dj',
    slug: 'dj-headliner',
    name: 'Headline & Festival Curator',
    tier_badge: 'Taste-Maker',
    price_usd: 50.00,
    billing_period: 'one-time credit reload',
    credits: 5000,
    key_metric: '5,000 Credits ($50.00 / KSh 5,000) · Radio Mix Syndication',
    features: [
      '5,000 non-expiring unified credits load ($50.00 / KSh 5,000)',
      'Host verified syndicated mix series & live DJ sessions on TuneStream Radio',
      'Personalized promo inbox where top labels send unreleased tracks directly',
      'Monetize live DJ sets with direct listener tipping and listener tip splits',
      'VIP access to artist tour soundchecks and festival press rooms'
    ],
    is_popular: false,
    cta: 'Get Headliner Pack'
  },
  {
    role: 'dj',
    slug: 'dj-enterprise',
    name: 'Agency & Record Pool Enterprise',
    tier_badge: 'Agency & Roster',
    price_usd: 75.00,
    billing_period: 'one-time credit reload',
    credits: 7500,
    key_metric: '7,500 Credits ($75.00 / KSh 7,500) · Multi-DJ Agency Suite',
    features: [
      '7,500 non-expiring unified credits load ($75.00 / KSh 7,500)',
      'Multi-DJ roster management for booking agencies and DJ crews',
      'Direct label partnership pool agreements and white-label promo vaults',
      'Dedicated audio engineer support and priority stem delivery pipeline'
    ],
    is_popular: false,
    cta: 'Apply for Agency Tier'
  }
];

export const AUTHORITATIVE_LABEL_PACKAGES = [
  {
    role: 'label',
    slug: 'label-team-starter',
    name: 'Label & Teams Starter Floor',
    tier_badge: 'Label Floor',
    price_usd: 50.0,
    billing_period: 'one-time credit reload',
    credits: 5000,
    key_metric: '5,000 Credits ($50.00 / KSh 5,000) · Up to 10 Signed Artists',
    features: [
      'Universal label floor: 5,000 TM Credits loaded to your label ledger (5,000 KES / $50.00 USD)',
      'Manage up to 10 signed creator profiles with isolated roster seats and catalog analytics',
      'Automated CSV statement parser (DistroKid, TuneCore, FUGA, Orchard)',
      'Split Cascade net calculations with advance balance tracking and recoupment',
      'Pre-cleared label roster sync pitching on SyncMavens network',
      'Standard email & dedicated chat label operations support'
    ],
    is_popular: false,
    cta: 'Start Label Floor'
  },
  {
    role: 'label',
    slug: 'label-growth',
    name: 'Scale Label Operations',
    tier_badge: 'Most Popular',
    price_usd: 100.0,
    billing_period: 'one-time credit reload',
    credits: 10000,
    key_metric: '10,000 Credits ($100.00 / KSh 10,000) · Up to 50 Signed Artists',
    features: [
      '10,000 TM Credits load (10,000 KES / $100.00 USD) with zero monthly subscriptions',
      'Up to 50 active artists & 1,000 master tracks with multi-stem cloud archives',
      'Automated master advance recoupment cascades (90/10 down to 50/50)',
      'Role-based staff permissions (A&R, Legal Counsel, Head of Accounting)',
      'TunePay live tour merch & festival ticket box-office settlement',
      'Intermaven Smart CRM automated roster fan broadcasts (WhatsApp/SMS)'
    ],
    is_popular: true,
    cta: 'Scale Label Operations'
  },
  {
    role: 'label',
    slug: 'label-enterprise',
    name: 'Major / Conglomerate Enterprise',
    tier_badge: 'Unlimited Scale',
    price_usd: 200.0,
    billing_period: 'one-time credit reload',
    credits: 20000,
    key_metric: '20,000 Credits ($200.00 / KSh 20,000) · Unlimited Artists & Masters',
    features: [
      '20,000 TM Credits load (20,000 KES / $200.00 USD) for massive catalog throughput',
      'Unlimited roster size and unlimited catalog ingestion with custom white-labeled portal',
      'Direct bank rail & mobile money bulk payouts (M-Pesa B2C, ACH, SWIFT)',
      'Full ERP & accounting API webhooks for QuickBooks / NetSuite sync',
      'Priority Sync Brief placement exclusivity across SyncMavens network',
      'Custom enterprise SLA & 24/7 dedicated engineering support'
    ],
    is_popular: false,
    cta: 'Request Enterprise Agreement'
  }
];
