/**
 * TuneMavens User Lifecycle Memory Service
 * 
 * Persistently tracks and manages all user actions, activities, milestones,
 * and workspace interactions across the complete user lifecycle.
 * Provides rich memory context to the AI Prompt Assistant.
 */

const LIFECYCLE_STORAGE_KEY_PREFIX = 'tunemavens_lifecycle_memory_';
const CHAT_HISTORY_STORAGE_KEY_PREFIX = 'tunemavens_ai_chat_';

// Map workspace tabs/apps to contextual Help Knowledge Base article IDs
export const APP_DOC_MAPPINGS = {
  // Overview Dashboard
  'home': {
    articleId: 'master-vs-composition-copyright',
    fallbackArticleId: 'tuneledger-and-split-cascade',
    label: 'Master vs. Composition Rights Guide',
    appTitle: 'Overview Dashboard'
  },
  // Splits & Royalty Accounting
  'splits': {
    articleId: 'studio-split-sheets-guide',
    fallbackArticleId: 'tuneledger-and-split-cascade',
    label: 'Split Sheets & Royalty Waterfall Guide',
    appTitle: 'TuneLedger / Split Cascade'
  },
  // Publishing Administration
  'publishing-election': {
    articleId: 'publishing-deals-admin-vs-copub-vs-buyout',
    fallbackArticleId: 'master-vs-composition-copyright',
    label: 'Publishing Deals & Global Rights Guide',
    appTitle: 'TuneMavens Publishing'
  },
  'publishing': {
    articleId: 'master-vs-composition-copyright',
    fallbackArticleId: 'mechanical-royalties-and-mlc',
    label: 'Master vs. Composition Rights Guide',
    appTitle: 'Publishing Administration'
  },
  // AI Mastering
  'mastering': {
    articleId: 'masterlab-ai-mastering',
    fallbackArticleId: 'tunestream-audiophile-streaming',
    label: 'MasterLab AI & Streaming LUFS Standards',
    appTitle: 'MasterLab AI Studio'
  },
  // Sync Placements & Clearances
  'sync': {
    articleId: 'sync-licensing-masterclass',
    fallbackArticleId: 'syncmavens-licensing-platform',
    label: 'Sync Placement & Supervisor Pitching Masterclass',
    appTitle: 'SyncMavens Licensing Marketplace'
  },
  'sync-placement': {
    articleId: 'sync-licensing-masterclass',
    fallbackArticleId: 'syncmavens-licensing-platform',
    label: 'Sync Briefs & Clearances Guide',
    appTitle: 'Sync Placement Hub'
  },
  // EPK & Web Worlds
  'epk': {
    articleId: 'epk-studio-and-custom-domains',
    fallbackArticleId: 'music-metadata-isrc-iswc-ipi-upc',
    label: 'EPK Studio & Custom Domain Setup',
    appTitle: 'TuneCreators EPK Studio'
  },
  'epk-builder': {
    articleId: 'epk-studio-and-custom-domains',
    fallbackArticleId: 'music-metadata-isrc-iswc-ipi-upc',
    label: 'EPK Studio & Custom Domain Setup',
    appTitle: 'EPK Builder'
  },
  // Corporate Ads & Sponsorships
  'corporate-ads': {
    articleId: 'corporate-ads-and-brand-flights',
    fallbackArticleId: 'tunestream-audiophile-streaming',
    label: 'Corporate Ad Rates & Brand Flights Guide',
    appTitle: 'Corporate Advertising Console'
  },
  // Record Label Administration & Team Seats
  'label-team': {
    articleId: 'account-security-2fa-and-roles',
    fallbackArticleId: 'master-vs-composition-copyright',
    label: 'Team Roles & Label Roster Management',
    appTitle: 'Roster & Team Seats'
  },
  // Distribution
  'distribution': {
    articleId: 'music-metadata-isrc-iswc-ipi-upc',
    fallbackArticleId: 'mechanical-royalties-and-mlc',
    label: 'Metadata, ISRC & DSP Distribution Guide',
    appTitle: 'Music Distribution Hub'
  },
  'distribution-election': {
    articleId: 'music-metadata-isrc-iswc-ipi-upc',
    fallbackArticleId: 'mechanical-royalties-and-mlc',
    label: 'Metadata, ISRC & DSP Distribution Guide',
    appTitle: 'Distribution Portal'
  },
  // Tours & Live Bookings, Concerts & VC Underwriting
  'tours': {
    articleId: 'global-tours-live-concerts-ticketing',
    fallbackArticleId: 'tour-vc-underwriting-career-sponsorship',
    label: 'Global Tours, Concert Ticketing & TunePay POS Guide',
    appTitle: 'Tours & Concerts Suite'
  },
  'events': {
    articleId: 'global-tours-live-concerts-ticketing',
    fallbackArticleId: 'masterclasses-and-creator-workshops',
    label: 'Live Concerts & Ticketing Guide',
    appTitle: 'Live Events & Concerts'
  },
  'concerts': {
    articleId: 'global-tours-live-concerts-ticketing',
    fallbackArticleId: 'masterclasses-and-creator-workshops',
    label: 'Live Concerts & Ticketing Guide',
    appTitle: 'Live Events & Concerts'
  },
  'vc-portfolio': {
    articleId: 'tour-vc-underwriting-career-sponsorship',
    fallbackArticleId: 'global-tours-live-concerts-ticketing',
    label: 'Tour VC Underwriting & Career Sponsorship Guide',
    appTitle: 'VC Portfolio & Yield'
  },
  'vc-sponsorship': {
    articleId: 'tour-vc-underwriting-career-sponsorship',
    fallbackArticleId: 'tuneledger-and-split-cascade',
    label: 'Creator Career Sponsorship & Recoupment Guide',
    appTitle: 'VC Career Sponsorship'
  },
  'tours-vault': {
    articleId: 'tour-vc-underwriting-career-sponsorship',
    fallbackArticleId: 'global-tours-live-concerts-ticketing',
    label: 'Live Tour Underwriting Vault Guide',
    appTitle: 'Tour Capital Vault'
  },
  'booking': {
    articleId: 'live-touring-guarantees-riders-settlements',
    fallbackArticleId: 'studio-split-sheets-guide',
    label: 'Tour Booking & Escrow Guide',
    appTitle: 'TuneBookings'
  },
  // Smart Contracts & Escrow
  'contracts': {
    articleId: 'studio-split-sheets-guide',
    fallbackArticleId: 'publishing-deals-admin-vs-copub-vs-buyout',
    label: 'Smart Contracts & Negotiation Guide',
    appTitle: 'Contracting & Deal Console'
  },
  'escrow': {
    articleId: 'studio-split-sheets-guide',
    fallbackArticleId: 'tuneledger-and-split-cascade',
    label: 'Escrow Contracts & Deal Waterfall Guide',
    appTitle: 'Escrow Contracts'
  },
  // Catalog Management
  'catalog': {
    articleId: 'music-metadata-isrc-iswc-ipi-upc',
    fallbackArticleId: 'master-vs-composition-copyright',
    label: 'Catalog Identifiers & Black Box Prevention',
    appTitle: 'Catalogue Manager'
  },
  // TuneStream & DJ Pool
  'tunestream': {
    articleId: 'tunestream-audiophile-streaming',
    fallbackArticleId: 'masterlab-ai-mastering',
    label: 'TuneStream Lossless Audio & Payouts',
    appTitle: 'TuneStream Lossless Player'
  },
  'companion': {
    articleId: 'tunecompanion-creator-operating-system',
    fallbackArticleId: 'tunestream-audiophile-streaming',
    label: 'TuneCompanion Creator Copilot & Telemetry Guide',
    appTitle: 'TuneCompanion Operating System'
  },
  'tunecompanion': {
    articleId: 'tunecompanion-creator-operating-system',
    fallbackArticleId: 'tuneledger-and-split-cascade',
    label: 'TuneCompanion Creator Copilot Guide',
    appTitle: 'TuneCompanion Operating System'
  },
  'djpool': {
    articleId: 'tunestream-audiophile-streaming',
    fallbackArticleId: 'sync-licensing-masterclass',
    label: 'DJ Pool & Track Streaming Guide',
    appTitle: 'DJ Pool MVP'
  },
  'library': {
    articleId: 'tunestream-audiophile-streaming',
    fallbackArticleId: 'masterlab-ai-mastering',
    label: 'Lossless Streaming & Personal Library',
    appTitle: 'TuneStream Library'
  },
  'stream-controls': {
    articleId: 'tunestream-audiophile-streaming',
    fallbackArticleId: 'masterlab-ai-mastering',
    label: 'Streaming Controls & Audio Fidelity',
    appTitle: 'TuneStream Audio Controls'
  },
  // Profile, Account & Tax
  'profile': {
    articleId: 'account-security-2fa-and-roles',
    fallbackArticleId: 'legal-foundations-llc-trademark-tax-w8ben',
    label: 'Account Security & W-8BEN Tax Guide',
    appTitle: 'Profile & Settings'
  },
  'settings': {
    articleId: 'account-security-2fa-and-roles',
    fallbackArticleId: 'legal-foundations-llc-trademark-tax-w8ben',
    label: 'Account Security & Permissions Guide',
    appTitle: 'Profile & Settings'
  },
  'account': {
    articleId: 'account-security-2fa-and-roles',
    fallbackArticleId: 'legal-foundations-llc-trademark-tax-w8ben',
    label: 'Security, 2FA & Permissions',
    appTitle: 'Account Management'
  },
  // CRM, CMS & Social AI
  'crm': {
    articleId: 'smart-crm-email-reachout-and-target-groups',
    fallbackArticleId: 'smart-crm-affiliate-attribution-and-learning-engine',
    label: 'Smart CRM & Email Reachout Guide',
    appTitle: 'Smart CRM & Email Reachout'
  },
  'cms': {
    articleId: 'epk-studio-and-custom-domains',
    fallbackArticleId: 'music-metadata-isrc-iswc-ipi-upc',
    label: 'EPK & Web World CMS Guide',
    appTitle: 'TuneCreators CMS'
  },
  'social-ai': {
    articleId: 'epk-studio-and-custom-domains',
    fallbackArticleId: 'sync-licensing-masterclass',
    label: 'Social Media AI Strategy Guide',
    appTitle: 'Social Media AI Copilot'
  },
  // POS & Touring Merch
  'pos-inventory': {
    articleId: 'live-touring-guarantees-riders-settlements',
    fallbackArticleId: 'studio-split-sheets-guide',
    label: 'Tour Merch & Settlement Guide',
    appTitle: 'POS Tour Merch Inventory'
  },
  'pos-settlement': {
    articleId: 'live-touring-guarantees-riders-settlements',
    fallbackArticleId: 'studio-split-sheets-guide',
    label: 'Nightly Settlement & Accounting Guide',
    appTitle: 'POS Nightly Settlements'
  },
  'pos-devices': {
    articleId: 'live-touring-guarantees-riders-settlements',
    fallbackArticleId: 'account-security-2fa-and-roles',
    label: 'Card Readers & Hardware Setup',
    appTitle: 'POS Terminal Devices'
  },
  // Domain Mappings & Promoted Acts
  'domain-mappings': {
    articleId: 'epk-studio-and-custom-domains',
    fallbackArticleId: 'account-security-2fa-and-roles',
    label: 'DNS & Custom Domain Verification',
    appTitle: 'Domain Mappings'
  },
  'promoted-acts': {
    articleId: 'corporate-ads-and-brand-flights',
    fallbackArticleId: 'universal-credits-system-guide',
    label: 'Promoted Acts & Featured Sponsorships',
    appTitle: 'Promoted Acts Admin'
  },
  // Credits, Pricing & Marketplace
  'pricing': {
    articleId: 'universal-credits-system-guide',
    fallbackArticleId: 'corporate-ads-and-brand-flights',
    label: 'Universal Credits & App Billing Guide',
    appTitle: 'Credits & Pricing'
  },
  'tips': {
    articleId: 'universal-credits-system-guide',
    fallbackArticleId: 'tuneledger-and-split-cascade',
    label: 'Fan Tips & Universal Credits Guide',
    appTitle: 'Consumer Tips & Payouts'
  },
  'app-marketplace': {
    articleId: 'universal-credits-system-guide',
    fallbackArticleId: 'master-vs-composition-copyright',
    label: 'App Subscriptions & Credits Guide',
    appTitle: 'App Marketplace'
  },
  // Support, Claims, Disputes & Audits
  'support': {
    articleId: 'how-support-ticketing-works',
    fallbackArticleId: 'tuneledger-escrow-dispute-locks',
    label: 'Support Claims & Dispute Resolutions Guide',
    appTitle: 'Support & AI Claims Desk'
  },
  'claims': {
    articleId: 'how-support-ticketing-works',
    fallbackArticleId: 'tuneledger-escrow-dispute-locks',
    label: 'Filing Claims & Warranty Clearances',
    appTitle: 'Support & AI Claims Desk'
  },
  'tickets': {
    articleId: 'how-support-ticketing-works',
    fallbackArticleId: 'tuneledger-escrow-dispute-locks',
    label: 'Support Ticketing & Resolution Guide',
    appTitle: 'Support & AI Claims Desk'
  },
  'audit': {
    articleId: 'tuneledger-escrow-dispute-locks',
    fallbackArticleId: 'studio-split-sheets-guide',
    label: 'TuneLedger Audit Locks & Dispute Escrow',
    appTitle: 'TuneLedger Audit Console'
  },
  'diagnostics': {
    articleId: 'tunesupport-ai-diagnosis-and-resolution',
    fallbackArticleId: 'unified-credits-support-and-refunds',
    label: 'DDEX & Stems Health Diagnostics',
    appTitle: 'DDEX Health & Diagnostics'
  },
  'disputes': {
    articleId: 'tuneledger-escrow-dispute-locks',
    fallbackArticleId: 'how-support-ticketing-works',
    label: 'TuneLedger Escrow Dispute Locks',
    appTitle: 'Dispute Resolution Console'
  },
  'community': {
    articleId: 'how-support-ticketing-works',
    fallbackArticleId: 'tuneledger-escrow-dispute-locks',
    label: 'Community & Support Claims Desk',
    appTitle: 'TuneMavens Community'
  },  // Phase 9: Ad Injection & Telemetry
  'ad-injection': {
    articleId: 'ad-injection-and-conversion-telemetry',
    fallbackArticleId: 'corporate-ads-and-brand-flights',
    label: 'Ad Flight Engine & Telemetry Guide',
    appTitle: 'Corporate Ads & Injection Engine'
  },
  'ads': {
    articleId: 'ad-injection-and-conversion-telemetry',
    fallbackArticleId: 'corporate-ads-and-brand-flights',
    label: 'Ad Flight Engine & Telemetry Guide',
    appTitle: 'Corporate Advertising Console'
  },
  // Phase 4: Path C & Catalogue Acquisitions
  'catalogue-acquisitions': {
    articleId: 'distribution-path-c-and-catalogue-acquisitions',
    fallbackArticleId: 'music-metadata-isrc-iswc-ipi-upc',
    label: 'Path C & Catalogue Acquisition Guide',
    appTitle: 'Catalogue Acquisitions & Buyouts'
  },
  // Phase 5: DJ Pool Engine
  'dj-pool': {
    articleId: 'dj-pool-engine-and-dancefloor-clearance',
    fallbackArticleId: 'tunestream-audiophile-streaming',
    label: 'DJ Pool & Dancefloor Clearance Guide',
    appTitle: 'DJ Pool Engine'
  },
  // Phase 8: MyContracts Vault
  'mycontracts': {
    articleId: 'mycontracts-legal-vault-and-escrow',
    fallbackArticleId: 'studio-split-sheets-guide',
    label: 'MyContracts Legal Vault & Escrow Guide',
    appTitle: 'MyContracts Vault'
  },
  // Phase 5.5: Wall of Fame & EPK Induction
  'wall-of-fame': {
    articleId: 'community-wall-of-fame-and-epk-induction',
    fallbackArticleId: 'epk-studio-and-custom-domains',
    label: 'Wall of Fame & EPK Induction Guide',
    appTitle: 'Wall of Fame & Milestones'
  },
  // Phase 6.5: Smart CRM & Inbox
  'inbox': {
    articleId: 'crm-growth-engine-and-inbox',
    fallbackArticleId: 'epk-studio-and-custom-domains',
    label: 'Smart CRM & Communications Inbox Guide',
    appTitle: 'Smart CRM & Inbox'
  },
  // Phase 8.5: Localization & Multi-Currency
  'localization': {
    articleId: 'ecosystem-localization-and-multi-currency',
    fallbackArticleId: 'universal-credits-system-guide',
    label: 'Localization & Multi-Currency Guide',
    appTitle: 'Localization & Global Markets'
  },
  // Phase 10: Media House
  'media-house': {
    articleId: 'media-house-routing-and-broadcast-syndication',
    fallbackArticleId: 'corporate-ads-and-brand-flights',
    label: 'Media House & Broadcast Syndication Guide',
    appTitle: 'Media House Syndicate'
  },
  // Phase 2: Offline Crates & Lossless Audio
  'offline-crates': {
    articleId: 'tunestream-offline-crates-and-tipping',
    fallbackArticleId: 'tunestream-audiophile-streaming',
    label: 'Offline Crates & Lossless Caching Guide',
    appTitle: 'Offline Crates Vault'
  },

  'dj-mixes': {
    articleId: 'dj-pool-engine-and-dancefloor-clearance',
    fallbackArticleId: 'tunestream-audiophile-streaming',
    label: 'DJ Mix Continuous Audio Track Extraction & 100% Prior Clearance',
    appTitle: 'DJ Mixes & Sovereign Clearance'
  },

  // Platform & Superuser Admin
  'backend-admin': {
    articleId: 'account-security-2fa-and-roles',
    fallbackArticleId: 'community-wall-of-fame-and-epk-induction',
    label: 'Backend Operations, RBAC & Security Guide',
    appTitle: 'Backend Admin Console'
  },
  'admin-team': {
    articleId: 'account-security-2fa-and-roles',
    fallbackArticleId: 'account-security-2fa-and-roles',
    label: 'Platform Administration & Team Seats Guide',
    appTitle: 'Site Admin Team & Seats'
  },

  // Affiliate Partner Network
  'affiliates': {
    articleId: 'affiliate-program-guide',
    fallbackArticleId: 'affiliate-payouts-mpesa-settlement',
    label: 'Affiliate Scheme & Multi-Stream Commissions Guide',
    appTitle: 'Affiliate Partner Network'
  },
  'affiliate': {
    articleId: 'affiliate-program-guide',
    fallbackArticleId: 'affiliate-payouts-mpesa-settlement',
    label: 'Affiliate Scheme & Multi-Stream Commissions Guide',
    appTitle: 'Affiliate Partner Network'
  },

  // Communications & Audit Logs
  'communications': {
    articleId: 'crm-growth-engine-and-inbox',
    fallbackArticleId: 'whatsapp-messaging-alerts',
    label: 'Communications Vault & Audit Logs Guide',
    appTitle: 'Communications Vault'
  },
  'communications-vault': {
    articleId: 'crm-growth-engine-and-inbox',
    fallbackArticleId: 'whatsapp-messaging-alerts',
    label: 'Communications Vault & Audit Logs Guide',
    appTitle: 'Communications Vault'
  },

  // Podcaster Studio & Shows Hub
  'podcaster-studio': {
    articleId: 'ad-injection-and-conversion-telemetry',
    fallbackArticleId: 'corporate-ads-and-brand-flights',
    label: 'Podcaster Studio & Audio Ad Insertion Guide',
    appTitle: 'Podcaster Studio Workspace'
  },
  'podcast-studio': {
    articleId: 'ad-injection-and-conversion-telemetry',
    fallbackArticleId: 'corporate-ads-and-brand-flights',
    label: 'Podcaster Studio & Audio Ad Insertion Guide',
    appTitle: 'Podcaster Studio Workspace'
  },
  'podcaster-overview': {
    articleId: 'ad-injection-and-conversion-telemetry',
    fallbackArticleId: 'corporate-ads-and-brand-flights',
    label: 'Podcaster Studio Overview Guide',
    appTitle: 'Podcaster Studio Workspace'
  },
  'podcaster-episodes': {
    articleId: 'ad-injection-and-conversion-telemetry',
    fallbackArticleId: 'tunestream-audiophile-streaming',
    label: 'Podcast Episode Management & Chapters Guide',
    appTitle: 'Podcast Episodes'
  },
  'podcaster-epk': {
    articleId: 'epk-studio-and-custom-domains',
    fallbackArticleId: 'music-metadata-isrc-iswc-ipi-upc',
    label: 'Podcaster Media Kit & Show EPK Guide',
    appTitle: 'Podcaster Show EPK'
  },
  'podcaster-monetization': {
    articleId: 'corporate-ads-and-brand-flights',
    fallbackArticleId: 'tuneledger-and-split-cascade',
    label: 'Podcast Ad Sponsorship Rates & Splits Guide',
    appTitle: 'Podcast Ad Rates & Splits'
  },
  'podcaster-guests': {
    articleId: 'mycontracts-legal-vault-and-escrow',
    fallbackArticleId: 'how-support-ticketing-works',
    label: 'Guest Booking CRM & Broadcast Waivers Guide',
    appTitle: 'Guest Booking CRM'
  },
  'podcasts': {
    articleId: 'ad-injection-and-conversion-telemetry',
    fallbackArticleId: 'tunestream-audiophile-streaming',
    label: 'Podcasts & Shows Streaming Hub Guide',
    appTitle: 'Podcasts & Shows Hub'
  },

  // Distribution Radar & Hosting
  'distribution-tracker': {
    articleId: 'music-metadata-isrc-iswc-ipi-upc',
    fallbackArticleId: 'mechanical-royalties-and-mlc',
    label: 'DSP Ingest Tracking & Delivery Telemetry Guide',
    appTitle: 'Distribution Radar'
  },
  'hosting-manager': {
    articleId: 'epk-studio-and-custom-domains',
    fallbackArticleId: 'account-security-2fa-and-roles',
    label: 'Creator Hosting & Custom Domain Provisioning Guide',
    appTitle: 'Hosting & Domains'
  },

  // TunePay POS Terminal
  'pos-terminal': {
    articleId: 'global-tours-live-concerts-ticketing',
    fallbackArticleId: 'live-touring-guarantees-riders-settlements',
    label: 'TunePay Live Concert Merch POS Terminal Guide',
    appTitle: 'POS Terminal'
  },

  // VC Underwriting & Discovery
  'vc-discover': {
    articleId: 'tour-vc-underwriting-career-sponsorship',
    fallbackArticleId: 'global-tours-live-concerts-ticketing',
    label: 'Discover Creators & Catalog Underwriting Guide',
    appTitle: 'Discover Creators & Catalog'
  },

  // Listener Suite & Devices
  'listener-apps': {
    articleId: 'tunestream-audiophile-streaming',
    fallbackArticleId: 'tunestream-offline-crates-and-tipping',
    label: 'Listener Apps Suite & Hi-Fi Audio Guide',
    appTitle: 'Listener Apps Suite'
  },
  'device-sync': {
    articleId: 'tunestream-offline-crates-and-tipping',
    fallbackArticleId: 'tunestream-audiophile-streaming',
    label: 'Mobile & Offline Crate Sync Guide',
    appTitle: 'Mobile & Offline Cache'
  },
  'radio': {
    articleId: 'tunestream-audiophile-streaming',
    fallbackArticleId: 'media-house-routing-and-broadcast-syndication',
    label: 'Live 24-Bit Radio Streaming Guide',
    appTitle: 'Live 24-Bit Radio'
  },
  'explore': {
    articleId: 'tunestream-audiophile-streaming',
    fallbackArticleId: 'universal-credits-system-guide',
    label: 'Explore Lossless Audio & Featured Releases Guide',
    appTitle: 'Explore & Stream'
  },

  'help': {
    articleId: 'how-support-ticketing-works',
    fallbackArticleId: 'master-vs-composition-copyright',
    label: 'TuneMavens Help & Industry Knowledge Base',
    appTitle: 'Help Center'
  },

  // Additional Workspace Tabs & Personas
  'overview': {
    articleId: 'master-vs-composition-copyright',
    fallbackArticleId: 'tuneledger-and-split-cascade',
    label: 'Overview & Ecosystem Rights Guide',
    appTitle: 'Overview Dashboard'
  },
  'creator': {
    articleId: 'master-vs-composition-copyright',
    fallbackArticleId: 'tuneledger-and-split-cascade',
    label: 'Creator Rights & Royalty Cascades Guide',
    appTitle: 'TuneCreators Studio'
  },
  'creator-companion': {
    articleId: 'tunecompanion-creator-operating-system',
    fallbackArticleId: 'tuneledger-and-split-cascade',
    label: 'TuneCompanion Operating System & Cascades Guide',
    appTitle: 'TuneCompanion AI OS'
  },
  'admin': {
    articleId: 'account-security-2fa-and-roles',
    fallbackArticleId: 'community-wall-of-fame-and-epk-induction',
    label: 'Platform Administration, RBAC & Security Guide',
    appTitle: 'Administration Console'
  },
  'label': {
    articleId: 'distribution-path-c-and-catalogue-acquisitions',
    fallbackArticleId: 'tuneledger-and-split-cascade',
    label: 'Record Label Console & Catalogue Acquisitions Guide',
    appTitle: 'Record Label Operations'
  },
  'dj': {
    articleId: 'dj-pool-engine-and-dancefloor-clearance',
    fallbackArticleId: 'tunestream-audiophile-streaming',
    label: 'DJ Pool Engine & Dancefloor Clearance Guide',
    appTitle: 'DJ Crate & Live Set Hub'
  },
  'vc': {
    articleId: 'tour-vc-underwriting-career-sponsorship',
    fallbackArticleId: 'global-tours-live-concerts-ticketing',
    label: 'Tour VC Underwriting & Career Sponsorship Guide',
    appTitle: 'Venture Capital & LP Desk'
  },
  'investor': {
    articleId: 'tour-vc-underwriting-career-sponsorship',
    fallbackArticleId: 'global-tours-live-concerts-ticketing',
    label: 'Tour VC Underwriting & Career Sponsorship Guide',
    appTitle: 'Venture Capital & LP Desk'
  },
  'podcaster': {
    articleId: 'ad-injection-and-conversion-telemetry',
    fallbackArticleId: 'corporate-ads-and-brand-flights',
    label: 'Podcast Dynamic Ad Injection & Telemetry Guide',
    appTitle: 'Podcaster Studio Hub'
  },
  'media': {
    articleId: 'media-house-routing-and-broadcast-syndication',
    fallbackArticleId: 'corporate-ads-and-brand-flights',
    label: 'Media House & Broadcast Syndication Guide',
    appTitle: 'Media House & Broadcast Hub'
  },
  'media_house': {
    articleId: 'media-house-routing-and-broadcast-syndication',
    fallbackArticleId: 'corporate-ads-and-brand-flights',
    label: 'Media House & Broadcast Syndication Guide',
    appTitle: 'Media House & Broadcast Hub'
  },
  'broadcast': {
    articleId: 'media-house-routing-and-broadcast-syndication',
    fallbackArticleId: 'corporate-ads-and-brand-flights',
    label: 'Broadcast Operations & Syndication Guide',
    appTitle: 'Broadcast Operations Hub'
  },
  'syndication': {
    articleId: 'media-house-routing-and-broadcast-syndication',
    fallbackArticleId: 'corporate-ads-and-brand-flights',
    label: 'Media House & Broadcast Syndication Guide',
    appTitle: 'Broadcast Syndication Hub'
  },
  'corporate': {
    articleId: 'corporate-ads-and-brand-flights',
    fallbackArticleId: 'tunestream-audiophile-streaming',
    label: 'Corporate Ads & Brand Flight Sponsorships Guide',
    appTitle: 'Corporate Brand Console'
  },
  'studio': {
    articleId: 'sync-licensing-masterclass',
    fallbackArticleId: 'studio-split-sheets-guide',
    label: 'Recording Studio Splits & Sync Licensing Guide',
    appTitle: 'Recording Studio Partner'
  },
  'supervisor': {
    articleId: 'sync-licensing-masterclass',
    fallbackArticleId: 'syncmavens-licensing-platform',
    label: 'Music Supervisor Sync Placement Masterclass',
    appTitle: 'Sync Licensing Supervisor Desk'
  },
  'sync-master': {
    articleId: 'syncmavens-licensing-platform',
    fallbackArticleId: 'sync-licensing-masterclass',
    label: 'SyncMavens Licensing Marketplace Guide',
    appTitle: 'Sync Master App'
  },
  'tunepay': {
    articleId: 'global-tours-live-concerts-ticketing',
    fallbackArticleId: 'universal-credits-system-guide',
    label: 'TunePay Live Concert Merch POS Terminal Guide',
    appTitle: 'TunePay Universal Wallet'
  },
  'tunemavens': {
    articleId: 'universal-credits-system-guide',
    fallbackArticleId: 'master-vs-composition-copyright',
    label: 'Universal Credits & Intermaven Network Guide',
    appTitle: 'TuneMavens Ecosystem'
  },
  'audit-vault': {
    articleId: 'tuneledger-escrow-dispute-locks',
    fallbackArticleId: 'tuneledger-and-split-cascade',
    label: 'TuneLedger Audit Vault & Escrow Locks Guide',
    appTitle: 'Audit Vault & Escrow'
  },
  'publishing-tracker': {
    articleId: 'publishing-deals-admin-vs-copub-vs-buyout',
    fallbackArticleId: 'pros-cmos-ascap-bmi-sesac-prs',
    label: 'Publishing Deals & Global Collection Tracking Guide',
    appTitle: 'Publishing Collection Tracker'
  },
  'wall-of-fame-admin': {
    articleId: 'community-wall-of-fame-and-epk-induction',
    fallbackArticleId: 'account-security-2fa-and-roles',
    label: 'Wall of Fame Nominations & EPK Induction Guide',
    appTitle: 'Wall of Fame Administration'
  },
  'consumer': {
    articleId: 'tunestream-audiophile-streaming',
    fallbackArticleId: 'tunestream-offline-crates-and-tipping',
    label: 'TuneStream Audiophile Streaming & Tipping Guide',
    appTitle: 'TuneStream Listener Suite'
  },
  'GB': { articleId: 'ecosystem-localization-and-multi-currency', fallbackArticleId: 'universal-credits-system-guide', label: 'Ecosystem Multi-Currency & Localized Settlement Guide', appTitle: 'Multi-Currency Settlement' },
  'NG': { articleId: 'ecosystem-localization-and-multi-currency', fallbackArticleId: 'universal-credits-system-guide', label: 'Ecosystem Multi-Currency & Localized Settlement Guide', appTitle: 'Multi-Currency Settlement' },
  'TZ': { articleId: 'ecosystem-localization-and-multi-currency', fallbackArticleId: 'universal-credits-system-guide', label: 'Ecosystem Multi-Currency & Localized Settlement Guide', appTitle: 'Multi-Currency Settlement' },
  'UG': { articleId: 'ecosystem-localization-and-multi-currency', fallbackArticleId: 'universal-credits-system-guide', label: 'Ecosystem Multi-Currency & Localized Settlement Guide', appTitle: 'Multi-Currency Settlement' },
  'US': { articleId: 'ecosystem-localization-and-multi-currency', fallbackArticleId: 'universal-credits-system-guide', label: 'Ecosystem Multi-Currency & Localized Settlement Guide', appTitle: 'Multi-Currency Settlement' },
  'ZA': { articleId: 'ecosystem-localization-and-multi-currency', fallbackArticleId: 'universal-credits-system-guide', label: 'Ecosystem Multi-Currency & Localized Settlement Guide', appTitle: 'Multi-Currency Settlement' }
};

/**
 * Primary documentation article assigned to each persona role
 */
export const PERSONA_PRIMARY_DOCS = {
  creator: {
    articleId: 'master-vs-composition-copyright',
    label: 'Master vs. Composition Rights Guide',
    appTitle: 'TuneMavens Studio'
  },
  label: {
    articleId: 'distribution-path-c-and-catalogue-acquisitions',
    label: 'Record Label Console & Catalogue Acquisitions Guide',
    appTitle: 'TuneMavens Records'
  },
  dj: {
    articleId: 'dj-pool-engine-and-dancefloor-clearance',
    label: 'DJ Pool Engine & Dancefloor Clearance Guide',
    appTitle: 'DJ Crate & Live Set Console'
  },
  supervisor: {
    articleId: 'sync-licensing-masterclass',
    label: 'Sync Placement & Supervisor Pitching Masterclass',
    appTitle: 'Sync Licensing Supervisor'
  },
  studio: {
    articleId: 'studio-split-sheets-guide',
    label: 'Producer & Songwriter Split Sheets Guide',
    appTitle: 'Recording Studio Partner'
  },
  media_house: {
    articleId: 'media-house-routing-and-broadcast-syndication',
    label: 'Media House & Broadcast Syndication Guide',
    appTitle: 'Media House & Broadcast Sync'
  },
  media: {
    articleId: 'media-house-routing-and-broadcast-syndication',
    label: 'Media House & Broadcast Syndication Guide',
    appTitle: 'Media House & Broadcast Sync'
  },
  corporate: {
    articleId: 'corporate-ads-and-brand-flights',
    label: 'Corporate Ad Rates & Brand Flights Guide',
    appTitle: 'Corporate Brand Partner'
  },
  podcaster: {
    articleId: 'ad-injection-and-conversion-telemetry',
    label: 'Dynamic Audio Ad Injection & Episode Telemetry Guide',
    appTitle: 'Podcaster Studio & Ad Insertion'
  },
  vc: {
    articleId: 'tour-vc-underwriting-career-sponsorship',
    label: 'Tour VC Underwriting & Career Sponsorship Guide',
    appTitle: 'Venture Capital & LP Desk'
  },
  investor: {
    articleId: 'tour-vc-underwriting-career-sponsorship',
    label: 'Tour VC Underwriting & Career Sponsorship Guide',
    appTitle: 'Venture Capital & LP Desk'
  },
  affiliate: {
    articleId: 'affiliate-program-guide',
    label: 'The TuneMavens Affiliate Scheme Guide',
    appTitle: 'Affiliate Partner Network'
  },
  admin: {
    articleId: 'account-security-2fa-and-roles',
    label: 'Account Security, 2FA & Team Roles Guide',
    appTitle: 'TuneMavens SuperAdmin'
  },
  consumer: {
    articleId: 'tunestream-audiophile-streaming',
    label: 'TuneStream Audiophile Lossless Streaming Guide',
    appTitle: 'TuneStream Listener'
  }
};

/**
 * Get the relevant Help Knowledge Base URL for the current active app or tab,
 * with deep awareness of the user's active persona.
 */
export function getRelevantDocLink(activeContext, userOrRole = null) {
  // 1. If activeContext is a specific tab/app (other than generic home/overview), use direct mapping
  if (activeContext && activeContext !== 'home' && activeContext !== 'overview' && APP_DOC_MAPPINGS[activeContext]) {
    const mapping = APP_DOC_MAPPINGS[activeContext];
    return {
      url: `/help?article=${mapping.articleId}`,
      articleId: mapping.articleId,
      label: mapping.label,
      appTitle: mapping.appTitle
    };
  }

  // 2. If on 'home', 'overview', or no specific sub-tab, resolve via the active persona
  const role = typeof userOrRole === 'string'
    ? userOrRole
    : (userOrRole?.role || userOrRole?.simulated_role);

  if (role && PERSONA_PRIMARY_DOCS[role]) {
    const personaDoc = PERSONA_PRIMARY_DOCS[role];
    return {
      url: `/help?article=${personaDoc.articleId}`,
      articleId: personaDoc.articleId,
      label: personaDoc.label,
      appTitle: personaDoc.appTitle
    };
  }

  // 3. Fallback to mapped 'home' if present, or universal copyright core
  const homeMapping = APP_DOC_MAPPINGS['home'] || {
    articleId: 'master-vs-composition-copyright',
    label: 'Master vs. Composition Rights Guide',
    appTitle: 'TuneMavens Ecosystem'
  };

  return {
    url: `/help?article=${homeMapping.articleId}`,
    articleId: homeMapping.articleId,
    label: homeMapping.label,
    appTitle: homeMapping.appTitle
  };
}

/**
 * Get user identifier for lifecycle storage
 */
function getStorageKey(userId) {
  return `${LIFECYCLE_STORAGE_KEY_PREFIX}${userId || 'guest_user'}`;
}

/**
 * Load complete user lifecycle memory from persistent storage
 */
export function loadUserLifecycleMemory(user) {
  const userId = user?.id || user?._id || user?.email || 'guest';
  const key = getStorageKey(userId);

  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch (err) {
    console.warn('Error reading lifecycle memory from storage:', err);
  }

  // Initial seed lifecycle memory for new or uninitialized users
  const defaultMemory = {
    userId: userId,
    userEmail: user?.email || 'user@tunemavens.com',
    userName: user?.name || user?.brand_name || 'Creator',
    primaryRole: user?.role || 'creator',
    creditsBalance: user?.credits ?? 600,
    lifecycleStage: 'Active Creator / Pro Tier',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // ~30 days ago
    lastActiveAt: new Date().toISOString(),
    milestones: [
      { id: 'm1', title: 'Joined TuneMavens Network', date: '30 days ago', icon: 'check' },
      { id: 'm2', title: 'Provisioned Intermaven Universal Wallet (600 Credits)', date: '30 days ago', icon: 'wallet' },
      { id: 'm3', title: 'Configured Primary Creator Workspace', date: '25 days ago', icon: 'settings' }
    ],
    activities: [
      {
        id: 'act-1',
        type: 'splits',
        action: 'Configured Split Sheet',
        app: 'TuneLedger',
        summary: 'Created 50/50 songwriter & producer split for upcoming single release.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
      },
      {
        id: 'act-2',
        type: 'mastering',
        action: 'MasterLab AI Audio Analysis',
        app: 'MasterLab',
        summary: 'Mastered 24-bit WAV track to -14 LUFS integrated target with -1.0 dBFS true peak ceiling.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      },
      {
        id: 'act-3',
        type: 'epk',
        action: 'Updated Press Kit & Custom Domain',
        app: 'TuneCreators',
        summary: 'Linked custom domain DNS and uploaded high-res artist press photography.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
      },
      {
        id: 'act-4',
        type: 'publishing',
        action: 'Selected Publishing Administrator Mode',
        app: 'TuneMavens Publishing',
        summary: 'Elected 10% Administrator Mode to retain 100% copyright ownership for global mechanical collection.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
      }
    ],
    catalogStats: {
      registeredTracks: 4,
      isrcCodesAllocated: 4,
      iswcCodesMatched: 3,
      oneStopVerified: true
    },
    activeWorkflows: {
      currentDraft: 'Single Release Campaign 2026',
      targetDSPs: ['Spotify', 'Apple Music', 'TuneStream Lossless', 'Tidal'],
      syncReadiness: 'High (Instrumentals & Stems Exported)'
    }
  };

  saveUserLifecycleMemory(userId, defaultMemory);
  return defaultMemory;
}

/**
 * Save updated user lifecycle memory
 */
export function saveUserLifecycleMemory(userId, memory) {
  try {
    if (typeof localStorage !== 'undefined') {
      const key = getStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(memory));
    }
  } catch (err) {
    console.warn('Error saving lifecycle memory to storage:', err);
  }
}

/**
 * Record a new user action into the persistent lifecycle memory
 */
export function logUserActivity(user, { type, action, app, summary, metadata = {} }) {
  if (!user) return;
  const userId = user?.id || user?._id || user?.email || 'guest';
  const memory = loadUserLifecycleMemory(user);

  const newActivity = {
    id: `act-${Date.now()}`,
    type: type || 'general',
    action: action || 'User Interaction',
    app: app || 'Workspace',
    summary: summary || 'User updated project workspace.',
    metadata,
    timestamp: new Date().toISOString()
  };

  // Prepend new activity and cap at 100 most recent items
  memory.activities = [newActivity, ...(memory.activities || [])].slice(0, 100);
  memory.lastActiveAt = new Date().toISOString();
  if (user.credits !== undefined) {
    memory.creditsBalance = user.credits;
  }
  if (user.role) {
    memory.primaryRole = user.role;
  }

  saveUserLifecycleMemory(userId, memory);
  return newActivity;
}

/**
 * Generate a comprehensive prompt context summary for the AI Assistant
 */
export function generateAiLifecycleContext(user, activeTab) {
  const memory = loadUserLifecycleMemory(user);
  const currentAppMapping = APP_DOC_MAPPINGS[activeTab] || { appTitle: activeTab || 'General Workspace' };

  const recentActivitiesText = (memory.activities || [])
    .slice(0, 8)
    .map(a => `- [${new Date(a.timestamp).toLocaleDateString()}] ${a.app}: ${a.action} (${a.summary})`)
    .join('\n');

  return `
USER LIFECYCLE MEMORY CONTEXT:
* User: ${memory.userName} (${memory.userEmail})
* Active Role: ${memory.primaryRole}
* Current Active App/Tool: ${currentAppMapping.appTitle} (tab: "${activeTab}")
* Credits Balance: ${memory.creditsBalance} Universal Credits
* Lifecycle Stage: ${memory.lifecycleStage}
* Catalog Stats: ${memory.catalogStats.registeredTracks} registered tracks, ${memory.catalogStats.isrcCodesAllocated} ISRCs, One-Stop Verified: ${memory.catalogStats.oneStopVerified}
* Active Workflows: Draft "${memory.activeWorkflows.currentDraft}", Sync Readiness: ${memory.activeWorkflows.syncReadiness}

RECENT USER LIFECYCLE ACTIVITIES & ACTIONS:
${recentActivitiesText || 'No recent activities recorded.'}
`.trim();
}

/**
 * Load AI conversation history for the user
 */
export function loadAiChatHistory(userId) {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(`${CHAT_HISTORY_STORAGE_KEY_PREFIX}${userId || 'guest'}`);
      if (raw) return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading chat history:', err);
  }
  return [];
}

/**
 * Save AI conversation history for the user
 */
export function saveAiChatHistory(userId, history) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`${CHAT_HISTORY_STORAGE_KEY_PREFIX}${userId || 'guest'}`, JSON.stringify(history));
    }
  } catch (err) {
    console.warn('Error saving chat history:', err);
  }
}

/**
 * Generate an intelligent, context-aware AI response utilizing full lifecycle memory
 */
export function generateAiAssistantResponse(query, user, activeTab, conversationHistory) {
  const memory = loadUserLifecycleMemory(user);
  const q = query.toLowerCase().trim();
  const currentApp = APP_DOC_MAPPINGS[activeTab] || { appTitle: activeTab || 'Workspace' };

  // Contextual intelligence based on lifecycle query & active tool
  if (q.includes('companion') || q.includes('tunecompanion') || activeTab === 'companion' || activeTab === 'tunecompanion') {
    return {
      reply: `Welcome to **TuneCompanion**—your real-time creator business operating system and live copilot across the TuneMavens ecosystem.

Here is what TuneCompanion coordinates for your catalog:
1. **Interactive Split Ledger & 7-Tier Waterfall**: Recoups recording advances first, then producer performance bonuses and sample escrow reserves, before perpetual writer/master equity distributes.
2. **Instant Multi-Rail Payouts**: Automated M-Pesa STK mobile wallet pushes (Kenya & East Africa) and Stripe direct bank deposits (global) with 0% platform extraction on tips.
3. **Sync Placement Radar**: Live algorithmic matching against active SyncMavens briefs for Hollywood films, Netflix series, gaming, and brand commercials with one-tap stem and cue sheet dispatch.
4. **MasterLab AI Playbook**: Calibrates your streaming audio (-14 LUFS integrated / -1.0 dBFS true peak ceiling) and schedules your 6-week release timeline.
5. **Catalog Telemetry & Hotspots**: Real-time cross-platform listener metrics and streaming hotspot heatmaps (Nairobi, London, Lagos, New York).

*Dual Viewport Tip:* You can toggle between the **Desktop Studio Console** and the **Pocket Phone Frame** using the responsive switcher in the top bar.`,
      suggestedActions: [
        { label: 'TuneCompanion Guide', link: '/#/help#tunecompanion-creator-operating-system' },
        { label: 'Open Split Ledger', tab: 'splits' },
        { label: 'Sync Placement Radar', tab: 'sync' },
        { label: 'MasterLab AI Audio', tab: 'mastering' }
      ]
    };
  }

  if (
    q.includes('crm') ||
    q.includes('reachout') ||
    q.includes('target group') ||
    q.includes('csv') ||
    q.includes('preview email') ||
    q.includes('flyer') ||
    q.includes('poster') ||
    q.includes('rsvp') ||
    q.includes('persona') ||
    q.includes('auto-optimize') ||
    q.includes('learning engine') ||
    q.includes('dual notification')
  ) {
    return {
      reply: `**Smart CRM & Email-Only Reachout Studio** combines compliant audience segmentation, live event ticketing, affiliate attribution, and an adaptive self-learning engine:
* **Email-Only Target Groups & Pre-Built User Cohorts**: Stores strictly Names + Emails (phone numbers, SMS, and WhatsApp are stripped automatically on CSV/TSV/TXT/JSON import to eliminate text fees and anti-spam account flagging). Admins also get auto-synced **All Registered Platform Users** plus 10 role-specific registered user Target Groups out of the box.
* **Live Event Flyers, Preview Email & Direct CTAs**: Selecting any live site event automatically embeds the official **Event Flyer / Poster** from the event page into the email and Reachout Landing Page alongside direct **RSVP Now** and **Buy Ticket Now** CTAs. Click **Preview Email** in Step 2 to inspect the exact rendered HTML before dispatching.
* **Admin Global Scope vs. Strict Affiliate Isolation**: Administrators can inspect and manage all registered affiliates and their Target Groups, whereas individual Affiliates only access their own cohorts, campaigns, and conversions (enforced server-side).
* **90-Day Attribution & Dual Notifications**: Every click, RSVP, ticket purchase, onboarding registration, EPK launch, catalogue upload, and platform spend is attributed to the initiating affiliate, triggering instant alerts to both their **In-App Inbox** and **Registered Email on File**.
* **10-Persona Playbooks & Self-Learning CRM**: Introductory templates tailor messaging for all 10 platform personas (encouraging onboarding, EPK creation, and catalogue ingestion where relevant) while **Smart Auto-Optimize Copy** adapts subject lines and Warm Clicker segments from real conversion telemetry.`,
      suggestedActions: [
        { label: 'Email Reachout & Target Groups Guide', link: '/#/help?article=smart-crm-email-reachout-and-target-groups' },
        { label: 'Attribution & Learning Engine Guide', link: '/#/help?article=smart-crm-affiliate-attribution-and-learning-engine' },
        { label: 'Open Smart CRM Reachout', tab: 'crm' }
      ]
    };
  }

  if (q.includes('split') || q.includes('ledger') || activeTab === 'splits') {
    return {
      reply: `I see from your lifecycle history that you recently configured a **50/50 songwriter & producer split** in TuneLedger for your upcoming single release.

Here is how your current setup functions:
1. **Gross Distribution Ingestion**: When statements import from DSPs, gross revenues land in your TuneLedger cascade.
2. **Recoupment First**: Any designated advance or recording costs are deducted before collaborator payouts.
3. **Automated Payouts**: The remaining 50/50 net splits disburse automatically to your collaborators' Stripe or M-Pesa accounts.

*Tip for your current session:* You can review our [Split Sheets & Royalty Waterfall Guide](/#/help#studio-split-sheets-guide) to ensure you have proper sample clearance warranties locked in.`,
      suggestedActions: [
        { label: 'View Split Sheet Docs', link: '/#/help#studio-split-sheets-guide' },
        { label: 'Open TuneLedger Console', tab: 'splits' }
      ]
    };
  }

  if (q.includes('publishing') || q.includes('copyright') || q.includes('mechanical') || activeTab === 'publishing-election') {
    return {
      reply: `Based on your lifecycle records, you elected **Option A: Administrator Mode (10% Fee)** with TuneMavens Publishing.

Here is why this is advantageous for your catalog:
* **100% Ownership Retained**: You did not assign your copyrights away.
* **Global Mechanicals Captured**: The MLC in the US and mechanical CMOs in Europe/Africa are tracking interactive streams that standard distributors miss.
* **Writer's Share Safeguarded**: Your 50% Writer's Share performance royalties flow direct to your PRO (ASCAP/BMI/PRS), while we collect the 50% Publisher's Share and mechanicals for you.

Would you like me to inspect your ISRC/ISWC mapping to make sure no royalties are caught in the black box?`,
      suggestedActions: [
        { label: 'Publishing Deals Guide', link: '/#/help#publishing-deals-admin-vs-copub-vs-buyout' },
        { label: 'Mechanicals & The MLC Guide', link: '/#/help#mechanical-royalties-and-mlc' }
      ]
    };
  }

  if (q.includes('credit') || q.includes('balance') || q.includes('wallet')) {
    return {
      reply: `Your universal balance currently stands at **${memory.creditsBalance} Universal Credits**.

You can spend these credits seamlessly across the network:
* **MasterLab AI Mastering**: 15 credits per track master (you have enough for ${(memory.creditsBalance / 15).toFixed(0)} more masters).
* **SyncMavens Brief Submission**: 0 platform credits (supervisors shop for music; pitching is 100% free).
* **Custom Domain Link**: 50 credits/year for zero-config SSL.
* **Smart Contract Execution**: 10 credits per contract.

All credits are shared universally between TuneMavens native utilities and Intermaven partner apps.`,
      suggestedActions: [
        { label: 'Credits Guide', link: '/#/help#universal-credits-system-guide' },
        { label: 'Manage Universal Wallet', link: '/pricing' }
      ]
    };
  }

  if (q.includes('master') || q.includes('lufs') || activeTab === 'mastering') {
    return {
      reply: `Looking at your lifecycle logs, you recently analyzed a 24-bit WAV file in **MasterLab** targeting **-14 LUFS integrated** with a **-1.0 dBFS true peak ceiling**.

For optimal streaming distribution:
* **Spotify & YouTube**: Target -14 LUFS. Going louder causes their normalization algorithm to turn down the digital fader, reducing dynamic punch.
* **Apple Music & TIDAL**: Target -16 LUFS for maximum preservation of transient acoustic detail.
* **True Peak Protection**: Keeping your ceiling at -1.0 dBFS ensures no inter-sample distortion occurs during lossy transcoding to AAC/Ogg Vorbis.`,
      suggestedActions: [
        { label: 'MasterLab AI Docs', link: '/#/help#masterlab-ai-mastering' },
        { label: 'Open MasterLab Studio', tab: 'mastering' }
      ]
    };
  }

  if (q.includes('sync') || q.includes('placement') || q.includes('supervisor') || activeTab === 'sync' || activeTab === 'sync-placement') {
    return {
      reply: `Your catalog currently has **${memory.catalogStats.registeredTracks} tracks**, and is marked as **One-Stop Verified** (${memory.activeWorkflows.syncReadiness}).

Because you control 100% of both the Master and Publishing rights, music supervisors on SyncMavens can license your catalog in hours with zero clearance delays. 

I recommend ensuring you have your **Instrumental mixes** and **clean TV edits** uploaded for all 4 tracks so supervisors can audition dialogue-ready cuts immediately.`,
      suggestedActions: [
        { label: 'Sync Licensing Masterclass', link: '/#/help#sync-licensing-masterclass' },
        { label: 'Browse Active Briefs', link: '/sync-placement' }
      ]
    };
  }

  if (q.includes('corporate') || q.includes('ad') || q.includes('flight') || activeTab === 'corporate-ads') {
    return {
      reply: `In the Corporate Advertising & Flights Console, brands book across 4 established rate tiers:
* **Pulse (\$499)**: 25,000 verified listens (\$19.96 CPM) with audio prerolls.
* **Amplified (\$1,499)**: 100,000 verified listens (\$14.99 CPM) with midrolls and playlist takeover (Most Popular).
* **Culture Lead (\$3,999)**: 350,000 verified listens (\$11.43 CPM) with branded curated station.
* **Titan (\$9,999)**: 1,000,000 verified listens (\$10.00 CPM) with roadblock & category exclusivity.

All campaigns feature live impression telemetry, click-through tracking, and automatic lead injection into the Smart CRM.`,
      suggestedActions: [
        { label: 'Review Ad Rates Guide', link: '/#/help#corporate-ads-and-brand-flights' },
        { label: 'Open Corporate Console', tab: 'corporate-ads' }
      ]
    };
  }

  if (q.includes('affiliate') || activeTab === 'affiliates' || activeTab === 'affiliate') {
    return {
      reply: `The **TuneMavens Affiliate Scheme** is modeled directly on Ditto Music's global partner framework, tailored for multi-stream creator commerce:
* **Multi-Stream Earnings (3% - 12%)**: Earn 3% on streams/tips, 5% on lossless track sales, 7% on album bundles, 8.5% on multitrack stem packs, 10% on tour passes, and 12% on sync placements.
* **Persistent Tracking**: 90-day cross-subdomain attribution cookies ensure you receive credit for signups across TuneMavens, TuneStream, and SyncMavens.
* **Settlement Rails**: Real-time TuneLedger accrual with instant local cashouts via M-Pesa STK (Kenya/East Africa) and Stripe direct bank deposits worldwide.`,
      suggestedActions: [
        { label: 'Affiliate Scheme Guide', link: '/#/help#affiliate-program-guide' },
        { label: 'Open Affiliate Partner Console', tab: 'affiliates' }
      ]
    };
  }

  if (q.includes('broadcast') || q.includes('media house') || q.includes('cue sheet') || activeTab === 'media-house') {
    return {
      reply: `**Broadcast Operations & Media House Syndication** automates regulatory compliance and rotation playout:
* **Playout Routing**: Scheduled rotation feeds across Linear TV, Terrestrial FM, and Satellite channels with automated dayparting.
* **Cryptographic Certificates**: Each playout emits an airplay certificate verified with SHA-256 hash logging to eliminate undocumented airplay disputes.
* **Automated PRO Cue Sheets**: One-click generation of audit-ready cue sheets formatted for MCSK, ASCAP, BMI, and SAMRO requirements.
* **Stem Management**: Fast auditioning of clean radio cuts, instrumentals, and broadcast masters.`,
      suggestedActions: [
        { label: 'Media House Syndication Guide', link: '/#/help#media-house-routing-and-broadcast-syndication' },
        { label: 'Open Broadcast Console', tab: 'media-house' }
      ]
    };
  }

  if (q.includes('podcast') || activeTab === 'podcasts' || activeTab === 'podcaster-studio' || activeTab === 'podcaster-episodes' || activeTab === 'podcaster-monetization' || activeTab === 'podcaster-guests') {
    return {
      reply: `**Podcaster Studio & Ad Insertion Suite** streamlines original audio/video show production and monetization:
* **Dynamic Audio Ad Insertion**: Schedule 15s and 30s preroll, midroll, and postroll flights with quartile telemetry.
* **Automated Co-Host Splits**: Distribute sponsor revenues and listener tips directly to co-hosts, producers, and editors via TuneLedger.
* **Guest Booking & Release Waivers**: Capture legally binding digital broadcast waivers and collect guest metadata seamlessly.
* **Multi-Platform RSS Syndication**: High-fidelity audio encoding with automatic chapter markers and transcript export.`,
      suggestedActions: [
        { label: 'Audio Ad Insertion Guide', link: '/#/help#ad-injection-and-conversion-telemetry' },
        { label: 'Open Podcaster Studio', tab: 'podcaster-studio' }
      ]
    };
  }

  if (q.includes('backend admin') || q.includes('rbac') || activeTab === 'backend-admin' || activeTab === 'admin-team') {
    return {
      reply: `**TuneMavens Operations & RBAC Admin Console** provides full administrative observability:
* **Persona RBAC Matrix**: 11 sovereign persona roles with granular permission gates and security isolation.
* **Multi-Domain Multi-Host Routing**: Real-time health probes and host mapping across all 5 ecosystem servers (:8001, :3000, :3001, :3002, :5000).
* **Wall of Fame & Talent Induction**: Manage curated cultural luminary profiles, public claims, and invite tokens.
* **CRM Lead Pipeline**: Real-time review and status approval of creator, label, brand, and investor lead submissions.`,
      suggestedActions: [
        { label: 'Security & 2FA Guide', link: '/#/help#account-security-2fa-and-roles' },
        { label: 'Launch Backend Admin App', tab: 'backend-admin' }
      ]
    };
  }

  if (q.includes('pos') || activeTab === 'pos-terminal' || activeTab === 'pos-inventory' || activeTab === 'pos-settlement') {
    return {
      reply: `**TunePay Live Concert POS Terminal** handles high-volume live merchandise and ticket sales:
* **Mobile & Card Sales**: Instant M-Pesa STK push and international card processing with offline cache fallback.
* **Real-Time Inventory Decrement**: Automated inventory tracking across apparel sizes, vinyl, and tour posters.
* **Nightly Tour Settlement**: Instant cascade calculation deducting venue door/merch concessions before artist payout.`,
      suggestedActions: [
        { label: 'Live Tours & POS Architecture', link: '/#/help#global-tours-live-concerts-ticketing' },
        { label: 'Open POS Terminal', tab: 'pos-terminal' }
      ]
    };
  }

  if (q.includes('distribution radar') || q.includes('telemetry') || activeTab === 'distribution-tracker') {
    return {
      reply: `**Distribution Radar & Ingestion Telemetry** tracks your releases across 150+ digital service providers:
* **DSP Delivery Telemetry**: Real-time ingestion confirmation across Spotify, Apple Music, YouTube Music, and TuneStream Lossless.
* **DDEX & Metadata Validation**: Automated verification of ISRC, ISWC, and UPC codes to prevent black box royalty traps.
* **Release Timeline Monitoring**: Live status tracking from Initial Package Ingestion to Live On-Store confirmation.`,
      suggestedActions: [
        { label: 'Metadata & ISRC Guide', link: '/#/help#music-metadata-isrc-iswc-ipi-upc' },
        { label: 'Open Distribution Radar', tab: 'distribution-tracker' }
      ]
    };
  }

  if (q.includes('hosting') || q.includes('dns') || activeTab === 'hosting-manager') {
    return {
      reply: `**Creator Hosting & Domains Manager** provisions dedicated custom domains for EPKs and Web Worlds:
* **Zero-Config SSL Issuance**: Automated Let's Encrypt TLS certificate provisioning and renewal.
* **Global DNS Cluster**: Anycast CDN routing with sub-50ms edge delivery for artist media and portfolios.
* **Domain Verification**: Real-time DNS A-record and CNAME verification probes with instant health feedback.`,
      suggestedActions: [
        { label: 'EPK & Custom Domains Guide', link: '/#/help#epk-studio-and-custom-domains' },
        { label: 'Open Hosting Manager', tab: 'hosting-manager' }
      ]
    };
  }

  if (activeTab === 'crm' || activeTab === 'inbox') {
    return {
      reply: `You are working inside **Smart CRM & Email-Only Reachout**. Here is what you can execute right here:
* **Step 1 — Manage Email-Only Target Groups**: Select pre-populated **All Registered Platform Users** / persona cohorts (Admin) or create/edit/delete custom Email-Only Target Groups and bulk-import **CSV, TSV, TXT, or JSON** lists (phone numbers are automatically stripped).
* **Step 2 — Compose, Preview & Dispatch**: Promote **Live Site Events** (with the official event flyer/poster and **RSVP Now** + **Buy Ticket Now** buttons), **Products/Services**, or **10-Persona Introductory Playbooks** (with direct **Build EPK** & **Ingest Catalogue** CTAs). Use **Preview Email** to verify the live HTML layout before sending.
* **Step 3 — Adaptive Attribution & Dual Alerts**: Track clicks, RSVPs, ticket buys, onboarding, and 90-day downstream spend per affiliate, with automatic notifications delivered to both the affiliate's **In-App Inbox** and **Registered Email**.`,
      suggestedActions: [
        { label: 'Read Email Reachout Guide', link: '/#/help?article=smart-crm-email-reachout-and-target-groups' },
        { label: 'Self-Learning CRM Docs', link: '/#/help?article=smart-crm-affiliate-attribution-and-learning-engine' }
      ]
    };
  }

  if (q.includes('history') || q.includes('what did i do') || q.includes('activity') || q.includes('memory')) {
    const list = memory.activities.slice(0, 5).map(a => `• **${a.action}** (${a.app}): ${a.summary}`).join('\n');
    return {
      reply: `Here is a summary of your recent lifecycle activities tracked across TuneMavens:

${list}

I retain persistent memory of your catalog (${memory.catalogStats.registeredTracks} tracks), your 10% Publishing Administrator election, your 50/50 split configs, and your current balance of ${memory.creditsBalance} Universal Credits. How can I assist you with your current work in **${currentApp.appTitle}**?`,
      suggestedActions: [
        { label: 'View Knowledge Base', link: '/#/help' }
      ]
    };
  }

  // Default context-aware response
  return {
    reply: `Hello ${memory.userName}! I am your **TuneMavens AI Copilot**, equipped with full memory of your creator lifecycle, recent actions, and catalog assets.

You are currently working in **${currentApp.appTitle}**. Based on your profile (${memory.primaryRole} with ${memory.creditsBalance} credits and ${memory.catalogStats.registeredTracks} registered tracks), I can help you with:
* Verifying split sheets and collaborator payout cascades.
* Reviewing global mechanical & performance royalty collection status.
* Analyzing loudness targets for streaming and sync deliverables.
* Preparing one-stop metadata for music supervisor briefs.

How would you like to proceed with your current project?`,
    suggestedActions: [
      { label: `Read Docs for ${currentApp.appTitle}`, link: getRelevantDocLink(activeTab).url },
      { label: 'Explore Knowledge Base', link: '/#/help' }
    ]
  };
}
