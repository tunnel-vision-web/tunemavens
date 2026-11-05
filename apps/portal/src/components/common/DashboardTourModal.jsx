import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RiCompass3Line,
  RiSparklingLine,
  RiCloseLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiCheckLine,
  RiMicFill,
  RiDiscFill,
  RiEqualizerFill,
  RiRadioFill,
  RiMegaphoneFill,
  RiGlobalFill,
  RiCoinsFill,
  RiFundsBoxFill,
  RiHeadphoneFill,
  RiShieldFill,
  RiEyeFill,
} from 'react-icons/ri';

/**
 * Persona Tour Data with simple, friendly, jargon-free explanations.
 * Each step specifies targetSelector so the tour spotlights the actual live UI element.
 */
export const PERSONA_TOUR_DATA = {
  creator: {
    label: 'Creator / Artist & Producer',
    icon: RiMicFill,
    color: '#22d3ee',
    steps: [
      {
        title: 'Welcome to Your Studio',
        badge: 'Studio Overview',
        tab: 'home',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'This is your creative headquarters. Everything you need—from setting up your artist profile to uploading songs and checking payments—is right here on the menu.',
        highlight: 'Your complete music workspace in one place',
      },
      {
        title: 'Live Key Stats & Balance',
        badge: 'Dashboard Vitals',
        tab: 'home',
        targetSelector: '[data-tour="admin-overview-stats"]',
        description: 'Monitor your studio performance at a glance: available tool credits, royalty split balances waiting to disburse, and active track catalog counts.',
        highlight: 'Real-time studio earnings and catalog progress',
      },
      {
        title: 'Your Artist Profile & Website',
        badge: 'Artist Page',
        tab: 'epk-builder',
        targetSelector: '[data-tour="nav-epk-builder"]',
        description: 'Build a clean, professional profile with your music, bio, photos, and social links. You get a public link you can send to festival bookers, promoters, and fans.',
        highlight: 'Share one simple link with the world',
      },
      {
        title: 'Catalogue Machine & Releases',
        badge: 'Music Uploads',
        tab: 'catalog',
        targetSelector: '[data-tour="nav-catalog"]',
        description: 'Upload your music with clear song titles and cover art. We help make sure everything is formatted properly before releasing to Spotify, Apple Music, and Boomplay.',
        highlight: 'Get your songs ready for listeners everywhere',
      },
      {
        title: 'Fair & Automatic Split Cascades',
        badge: 'Share Earnings',
        tab: 'splits',
        targetSelector: '[data-tour="nav-splits"]',
        description: 'Decide who gets paid for each song. When your music earns money, your producers, vocalists, and collaborators get paid straight to their mobile money or bank accounts without disputes.',
        highlight: 'No more arguments or confusing payment spreadsheets',
      },
      {
        title: 'Publishing Rights & Song Registrations',
        badge: 'Song Publishing',
        tab: 'publishing-election',
        targetSelector: '[data-tour="nav-publishing-election"]',
        description: 'Protect your songwriting royalties and register compositions with performance rights organizations (PROs) worldwide to collect airplay and sync royalties.',
        highlight: 'Collect every cent your compositions earn globally',
      },
      {
        title: 'Global Music Distribution Radar',
        badge: 'Worldwide Streaming',
        tab: 'distribution-election',
        targetSelector: '[data-tour="nav-distribution-election"]',
        description: 'Deliver your singles and albums to 150+ streaming platforms across Africa and globally with zero hidden deductions and 100% rights retention.',
        highlight: 'Keep 100% ownership of your master recordings',
      },
      {
        title: 'Sync Marketplace & Film Licensing',
        badge: 'TV & Ads Placement',
        tab: 'sync',
        targetSelector: '[data-tour="nav-sync"]',
        description: 'Pitch your songs directly to film directors, Netflix productions, video game developers, and brand advertising campaigns looking for authentic African music.',
        highlight: 'Open up high-value film and advertising placements',
      },
      {
        title: 'MyContracts & Safe Escrow Protection',
        badge: 'Legal Clearance',
        tab: 'escrow',
        targetSelector: '[data-tour="nav-escrow"]',
        description: 'Sign legally binding music licensing contracts online. Clearance payments are held safely in escrow until signed, ensuring you always get paid.',
        highlight: 'Instant digital signing and guaranteed payments',
      },
      {
        title: 'DJ Record Pool & Club Edits',
        badge: 'Club DJ Crates',
        tab: 'djpool',
        targetSelector: '[data-tour="nav-djpool"]',
        description: 'Distribute your club edits, extended intros, and instrumentals straight to working club and festival DJs to break your songs on dancefloors.',
        highlight: 'Get your songs played in club and festival sets',
      },
      {
        title: 'Podcaster Studio & Spoken Shows',
        badge: 'Podcast Hub',
        tab: 'podcaster-studio',
        targetSelector: '[data-tour="nav-podcaster-studio"]',
        description: 'Host your artist podcast, audio interview shows, and behind-the-scenes diaries with fast RSS syndication to Apple Podcasts and Spotify.',
        highlight: 'Connect with fans through spoken-word and interview audio',
      },
      {
        title: 'TunePay POS & Event Merch Sales',
        badge: 'Tour Box Office',
        tab: 'pos-inventory',
        targetSelector: '[data-tour="nav-pos-inventory"]',
        description: 'Sell tour merchandise, vinyl records, and event tickets in person at shows with portable POS payment terminals and instant mobile money settlement.',
        highlight: 'Direct point-of-sale merch revenue with zero friction',
      },
      {
        title: 'Smart CRM & Direct Fan Broadcasts',
        badge: 'Fan Engagement',
        tab: 'crm',
        targetSelector: '[data-tour="nav-crm"]',
        description: 'Build your core fanbase phone and email directory. Send new single drops and tour announcements directly to fans on WhatsApp, SMS, and email.',
        highlight: 'Own your audience data with direct messaging channels',
      },
      {
        title: 'Social AI Content Studio',
        badge: 'Promo Studio',
        tab: 'social-ai',
        targetSelector: '[data-tour="nav-social-ai"]',
        description: 'Turn your audio releases into social media clips, Instagram stories, TikTok video hooks, and promotional banners in seconds.',
        highlight: 'Effortless visual promotion for all your releases',
      },
      {
        title: 'Affiliate Partner Referrals',
        badge: 'Earn Commissions',
        tab: 'affiliates',
        targetSelector: '[data-tour="nav-affiliates"]',
        description: 'Earn extra cash by referring fellow artists and producers. Earn automated weekly commissions whenever your referrals distribute songs or top up.',
        highlight: 'Turn your musical network into recurring income',
      },
      {
        title: 'Communications Vault & WhatsApp Alerts',
        badge: 'Instant Alerts',
        tab: 'communications',
        targetSelector: '[data-tour="nav-communications"]',
        description: 'Get notified directly on WhatsApp or email whenever someone wants to license your song or whenever your royalties arrive.',
        highlight: 'Never miss an opportunity or payment',
      },
      {
        title: 'Studio Tool Credits & Wallet',
        badge: 'Wallet & Tools',
        tab: 'home',
        targetSelector: '[data-tour="topbar-credits"]',
        description: 'This is your credit balance. Top up anytime starting from our low floor of KSH 250 / $2.50 whenever you want to use song mastering tools or receive automated phone alerts.',
        highlight: 'Top up only when you need it—no monthly subscription',
      },
      {
        title: 'Action Notifications & Activity Alerts',
        badge: 'Activity Feed',
        tab: 'home',
        targetSelector: '[data-tour="topbar-notifications"]',
        description: 'Get instant alerts whenever key events occur—such as new sync licensing inquiries, payout disbursements, pending split approvals, or user verification requests.',
        highlight: 'Stay informed on critical platform events',
      },
      {
        title: 'Helpdesk & Restarting Your Tour',
        badge: 'Tour Controls',
        tab: 'home',
        targetSelector: '[data-tour="topbar-tour-btn"]',
        description: 'Whenever you want a refresher on any studio section, simply click this button to restart the interactive tour anytime.',
        highlight: '1-click guidance whenever you need assistance',
      },
    ],
  },

  supervisor: {
    label: 'Music Supervisor',
    icon: RiEqualizerFill,
    color: '#ec4899',
    steps: [
      {
        title: 'Supervisor Command Suite',
        badge: 'Sync Suite',
        tab: 'home',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'Find authentic, high-quality African music for your films, television series, video games, and commercials. Every track is ready to license right away.',
        highlight: '100% pre-cleared music with zero copyright delays',
      },
      {
        title: 'Search & Audition Music',
        badge: 'Search & Listen',
        tab: 'sync',
        targetSelector: '[data-tour="nav-sync"]',
        description: 'Search songs by mood, tempo, genre, or instrument. Audition tracks immediately and download instrumental versions to test in your project video timeline.',
        highlight: 'Find and test the right track in seconds',
      },
      {
        title: 'Safe Licensing Agreements',
        badge: 'Legal Clearance',
        tab: 'escrow',
        targetSelector: '[data-tour="nav-escrow"]',
        description: 'Complete licensing agreements online with one click. Payments are held safely until contracts are signed, giving your production complete legal protection.',
        highlight: 'Instant digital signing and clear copyright ownership',
      },
      {
        title: 'Direct Composer & Producer CRM',
        badge: 'Talent Outreach',
        tab: 'crm',
        targetSelector: '[data-tour="nav-crm"]',
        description: 'Connect directly with African composers, arrangers, and vocalists to request custom cue edits, instrumental stems, or bespoke project scoring.',
        highlight: 'Direct creative collaboration with master creators',
      },
      {
        title: 'Social AI Cue Matching & Visual Briefs',
        badge: 'Creative Matching',
        tab: 'social-ai',
        targetSelector: '[data-tour="nav-social-ai"]',
        description: 'Generate instant sync creative briefs, match music moods to video scene descriptions, and create commercial cue preview reels with AI assistance.',
        highlight: 'Smart mood matching for fast video editing',
      },
      {
        title: 'Supervisor Referral & Partner Network',
        badge: 'Partner Network',
        tab: 'affiliates',
        targetSelector: '[data-tour="nav-affiliates"]',
        description: 'Introduce fellow music supervisors, agency producers, and editing houses to TuneMavens and receive referral compensation on every cleared production license.',
        highlight: 'Earn rewards across your professional network',
      },
      {
        title: 'Production App Marketplace',
        badge: 'Supervisor Tools',
        tab: 'app-marketplace',
        targetSelector: '[data-tour="nav-app-marketplace"]',
        description: 'Explore specialized music supervision add-ons, cue sheet auto-generators, and video timeline integrations designed to accelerate your workflow.',
        highlight: 'Modular production apps to streamline supervision',
      },
      {
        title: 'Complimentary Free VIP WhatsApp',
        badge: 'Free VIP Alerts',
        tab: 'home',
        targetSelector: '[data-tour="topbar-notifications"]',
        description: 'Music supervisors get free, unlimited WhatsApp messaging. Talk directly with artist teams and request custom edits without any credit fees.',
        highlight: 'Direct chat with creators at zero cost',
      },
      {
        title: 'Production Company & Studio Profile',
        badge: 'Studio Profile',
        tab: 'home',
        targetSelector: '[data-tour="topbar-account"]',
        description: 'Manage your verified music supervisor credentials, production company billing details, and customized music delivery preferences.',
        highlight: 'Verified credentials for seamless global licensing',
      },
      {
        title: 'Supervisor Support & Tour Controls',
        badge: 'Tour & Support',
        tab: 'home',
        targetSelector: '[data-tour="topbar-tour-btn"]',
        description: 'Need assistance finding a specific sound or clearing a legacy catalog? Access 24/7 supervisor support or restart this guided tour whenever you need a quick walkthrough.',
        highlight: 'Dedicated supervision support always on call',
      },
    ],
  },

  label: {
    label: 'Record Label & Publisher',
    icon: RiDiscFill,
    color: '#a855f7',
    steps: [
      {
        title: 'Executive Label Headquarters',
        badge: 'Label Roster',
        tab: 'home',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'Oversee all your signed artists, album releases, team members, and live revenue streams from one unified, enterprise-grade command center.',
        highlight: 'Complete control of your label in one place',
      },
      {
        title: 'Roster & Team Seats Management',
        badge: 'Staff & Roster',
        tab: 'label-team',
        targetSelector: '[data-tour="nav-label-team"]',
        description: 'Invite your staff (A&R, Legal Counsel, Head of Accounting) with isolated permissions, and manage all your signed talent rosters under organized imprint ledgers.',
        highlight: 'Role-based access for your entire label team',
      },
      {
        title: 'Catalogue Machine & Master Stems',
        badge: 'Master Catalog',
        tab: 'catalog',
        targetSelector: '[data-tour="nav-catalog"]',
        description: 'Upload, inspect, and organize high-resolution master recordings, multi-track audio stems, and ISRC metadata across your entire artist catalog.',
        highlight: 'Keep your entire song catalog organized',
      },
      {
        title: 'Multi-Artist EPK & Press Kits',
        badge: 'Artist Portals',
        tab: 'epk-builder',
        targetSelector: '[data-tour="nav-epk-builder"]',
        description: 'Build and customize high-impact Electronic Press Kits, public artist websites, and tour schedules for every signed act on your label.',
        highlight: 'Professional digital press kits for every roster act',
      },
      {
        title: 'Automated Recoupment & Split Cascades',
        badge: 'Advance Recoupment',
        tab: 'splits',
        targetSelector: '[data-tour="nav-splits"]',
        description: 'Set up automated advance recoupment cascades (such as 90/10 down to 50/50). Studio recording costs and artist advances are recouped first before automated payouts trigger.',
        highlight: 'Transparent accounting with zero manual math',
      },
      {
        title: 'Publishing Administration & PRO Elections',
        badge: 'Publishing Rights',
        tab: 'publishing-election',
        targetSelector: '[data-tour="nav-publishing-election"]',
        description: 'Administer songwriting copyrights, register cue sheets with international PROs (ASCAP, BMI, MCSK), and collect global mechanical royalties.',
        highlight: 'Protect and monetize your publishing catalogue',
      },
      {
        title: 'Distribution Radar & Global DSPs',
        badge: 'DSP Radar',
        tab: 'distribution-election',
        targetSelector: '[data-tour="nav-distribution-election"]',
        description: 'Track release ingestion and performance metrics across Spotify, Apple Music, Boomplay, Amazon, and regional digital platforms in real time.',
        highlight: 'Global delivery tracking with automated quality checks',
      },
      {
        title: 'Label Sync Pitch Desk',
        badge: 'Sync Desk',
        tab: 'sync',
        targetSelector: '[data-tour="nav-sync"]',
        description: 'Pitch priority catalog songs directly to television networks, movie supervisors, and advertising agencies looking to license African repertoire.',
        highlight: 'Open up new revenue streams for your artists',
      },
      {
        title: 'Tour Merchandise POS & Box Office Settlement',
        badge: 'Live Commerce',
        tab: 'pos-inventory',
        targetSelector: '[data-tour="nav-pos-inventory"]',
        description: 'Manage tour merch stock, event ticket box offices, and mobile POS sales during artist concert tours with automatic split calculations.',
        highlight: 'In-person concert merch sales with instant mobile settlement',
      },
      {
        title: 'Fan Club CRM & Roster Broadcasts',
        badge: 'Fan Broadcasts',
        tab: 'crm',
        targetSelector: '[data-tour="nav-crm"]',
        description: 'Engage signed artist fanbases across Africa with automated WhatsApp, SMS, and email marketing broadcasts for new album releases and tour dates.',
        highlight: 'Direct roster marketing straight to listener mobile devices',
      },
      {
        title: 'Label Social AI Studio',
        badge: 'Automated Creative',
        tab: 'social-ai',
        targetSelector: '[data-tour="nav-social-ai"]',
        description: 'Generate automated promotional campaign collateral, video teaser trailers, and release press statements for your artists with AI tools.',
        highlight: 'High-speed marketing asset creation for busy label teams',
      },
      {
        title: 'Custom Label Apex Domains',
        badge: 'White-Label Branding',
        tab: 'domain-mappings',
        targetSelector: '[data-tour="nav-domain-mappings"]',
        description: 'Connect your own custom record label domain (e.g. records.yourname.com) to provide a white-labeled experience for your signed roster.',
        highlight: 'Establish your proprietary digital label presence',
      },
      {
        title: 'A&R Talent Scouting & Ambassador Network',
        badge: 'Talent Network',
        tab: 'affiliates',
        targetSelector: '[data-tour="nav-affiliates"]',
        description: 'Empower regional street teams, talent scouts, and campus ambassadors to discover and onboard promising independent talent.',
        highlight: 'Decentralized talent acquisition with automated referral tracking',
      },
      {
        title: 'Label Credit Ledger & Top-Ups',
        badge: 'Label Credits',
        tab: 'home',
        targetSelector: '[data-tour="topbar-credits"]',
        description: 'Monitor unified platform credits for your roster. Load credits starting at the universal label floor (7,500 Credits / KSH 7,500 / $75.00) with zero recurring monthly subscription fees.',
        highlight: 'Transparent pay-as-you-go credit ledger for team operations',
      },
      {
        title: 'Real-Time Clearance & Royalty Alerts',
        badge: 'Real-Time Feed',
        tab: 'home',
        targetSelector: '[data-tour="topbar-notifications"]',
        description: 'Stay informed with instant push notifications whenever master licenses are approved, distributor statements are parsed, or splits are disbursed.',
        highlight: 'Instant notifications on roster revenue events',
      },
      {
        title: 'Multi-Seat Label Administration',
        badge: 'Imprint Config',
        tab: 'home',
        targetSelector: '[data-tour="topbar-account"]',
        description: 'Configure imprint branding, corporate legal entities, tax details, and bulk mobile money/bank payout settings.',
        highlight: 'Enterprise settings and financial controls',
      },
      {
        title: 'Label Support & Tour Controls',
        badge: 'Label Support',
        tab: 'home',
        targetSelector: '[data-tour="topbar-tour-btn"]',
        description: 'Access dedicated label engineering support or restart this guided walkthrough with a single click whenever onboarding new team members.',
        highlight: '1-click team training and guided assistance',
      },
    ],
  },

  corporate: {
    label: 'Corporate Brand & Marketing',
    icon: RiMegaphoneFill,
    color: '#f97316',
    steps: [
      {
        title: 'Brand Music Command Center',
        badge: 'Brand Marketing',
        tab: 'home',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'License authentic African music for your advertising campaigns, brand jingles, and event sponsorships with guaranteed commercial clearance and zero copyright risk.',
        highlight: 'Safe, copyright-cleared music for commercial use',
      },
      {
        title: 'Audio Ad Flights & Commercial Campaigns',
        badge: 'Campaign Flights',
        tab: 'corporate-ads',
        targetSelector: '[data-tour="nav-corporate-ads"]',
        description: 'Book, schedule, and track programmatic audio advertising flights and sponsor mentions delivered across high-fidelity music streams and podcasts.',
        highlight: 'Reach genuine music fans across Africa',
      },
      {
        title: 'Commercial Music & Sync Library',
        badge: 'Ad Music Library',
        tab: 'sync',
        targetSelector: '[data-tour="nav-sync"]',
        description: 'Explore trending songs and background music pre-cleared for YouTube, Instagram, TikTok, television commercials, and radio broadcasts.',
        highlight: 'Instant licensing for commercial broadcasts',
      },
      {
        title: 'Corporate Licensing Contracts & Escrow',
        badge: 'Commercial Escrow',
        tab: 'escrow',
        targetSelector: '[data-tour="nav-escrow"]',
        description: 'Complete corporate licensing agreements with clear indemnification warranties. Payments remain protected in escrow until rights-holders sign.',
        highlight: 'Guaranteed legal protection for advertising campaigns',
      },
      {
        title: 'Brand Ambassador & Influencer CRM',
        badge: 'Creator Roster',
        tab: 'crm',
        targetSelector: '[data-tour="nav-crm"]',
        description: 'Manage direct relationships with popular music creators, festival headliners, and cultural influencers for sponsored product endorsements.',
        highlight: 'Direct artist sponsorships without agency markup',
      },
      {
        title: 'Social AI Campaign Content Studio',
        badge: 'Co-Branded Assets',
        tab: 'social-ai',
        targetSelector: '[data-tour="nav-social-ai"]',
        description: 'Generate co-branded promotional assets, campaign copy, and branded social announcements optimized for major media platforms.',
        highlight: 'Rapid campaign creative powered by AI',
      },
      {
        title: 'Corporate Partner & Referral Network',
        badge: 'Agency Partners',
        tab: 'affiliates',
        targetSelector: '[data-tour="nav-affiliates"]',
        description: 'Track marketing agency referrals and partner performance metrics across all active corporate campaigns.',
        highlight: 'Collaborative agency campaign tracking',
      },
      {
        title: 'Marketing Integrations & Apps',
        badge: 'Marketing Apps',
        tab: 'app-marketplace',
        targetSelector: '[data-tour="nav-app-marketplace"]',
        description: 'Connect enterprise marketing tools, campaign attribution webhooks, and analytics dashboards to streamline your reporting.',
        highlight: 'Enterprise webhooks and reporting integrations',
      },
      {
        title: 'Campaign Delivery & Impression Alerts',
        badge: 'Flight Telemetry',
        tab: 'home',
        targetSelector: '[data-tour="topbar-notifications"]',
        description: 'Receive live alerts on ad flight delivery pacing, listener reach milestones, and newly available commercial track options.',
        highlight: 'Real-time campaign delivery monitoring',
      },
      {
        title: 'Corporate Account & Billing Profiles',
        badge: 'Corporate Billing',
        tab: 'home',
        targetSelector: '[data-tour="topbar-account"]',
        description: 'Manage enterprise billing information, VAT invoicing, corporate entity credentials, and team member permissions.',
        highlight: 'Corporate invoicing and expense controls',
      },
      {
        title: 'Brand Support & Tour Controls',
        badge: 'Tour Controls',
        tab: 'home',
        targetSelector: '[data-tour="topbar-tour-btn"]',
        description: 'Access dedicated brand support specialists or restart this interactive tour anytime with one click.',
        highlight: 'Dedicated enterprise account management',
      },
    ],
  },

  dj: {
    label: 'Professional DJ & Curator',
    icon: RiRadioFill,
    color: '#3b82f6',
    steps: [
      {
        title: 'DJ Performance Headquarters',
        badge: 'DJ Headquarters',
        tab: 'home',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'Get club-ready edits, extended intros, instrumentals, and trending African tracks ready to load straight into your DJ performance software.',
        highlight: 'High-quality tracks ready for your sets',
      },
      {
        title: 'DJ Record Pool & Crates',
        badge: 'Crates & Edits',
        tab: 'djpool',
        targetSelector: '[data-tour="nav-djpool"]',
        description: 'Browse exclusive club edits by BPM, musical key, and dance style. Download uncompressed 24-bit audio tracks optimized for Rekordbox, Serato, and CDJs.',
        highlight: 'Stay ahead with fresh, exclusive club tracks',
      },
      {
        title: 'Personal DJ Library & Downloads',
        badge: 'Personal Crate',
        tab: 'library',
        targetSelector: '[data-tour="nav-library"]',
        description: 'Organize your personal set crates, saved tracks, and cue points so you always have the right music ready before your next club gig or festival set.',
        highlight: 'Access your performance crates on any device',
      },
      {
        title: 'Live Dancefloor Tips & Song Requests',
        badge: 'Live Tips',
        tab: 'tips',
        targetSelector: '[data-tour="nav-tips"]',
        description: 'Let club partygoers tip you and submit song requests directly to your phone via QR code or M-Pesa during live performances—with zero middleman delays.',
        highlight: 'Earn tips directly from the dancefloor',
      },
      {
        title: '24-Bit Studio Audio EQ & DAC Settings',
        badge: 'Mastering & DAC',
        tab: 'stream-controls',
        targetSelector: '[data-tour="nav-stream-controls"]',
        description: 'Fine-tune audio monitoring curves, set peak limiting thresholds, and configure lossless digital audio converter (DAC) hardware playback.',
        highlight: 'Pristine sound delivery through sound system rigs',
      },
      {
        title: 'Club Fan List & Text Alerts',
        badge: 'Club CRM',
        tab: 'crm',
        targetSelector: '[data-tour="nav-crm"]',
        description: 'Build your personal partygoers list. Send direct WhatsApp and SMS reminders before your weekend residency gigs and tour dates.',
        highlight: 'Pack your venues with direct fan notifications',
      },
      {
        title: 'Social AI Gig Flyers & Promos',
        badge: 'Gig Flyers',
        tab: 'social-ai',
        targetSelector: '[data-tour="nav-social-ai"]',
        description: 'Create eye-catching weekend club flyers, lineup posters, and Instagram promo reels featuring your DJ mixes in seconds.',
        highlight: 'Instant promotional artwork for your residency gigs',
      },
      {
        title: 'DJ Tools & App Marketplace',
        badge: 'DJ Extensions',
        tab: 'app-marketplace',
        targetSelector: '[data-tour="nav-app-marketplace"]',
        description: 'Discover specialized DJ plugins, automated setlist generators, and audio stem isolation tools to elevate your performance.',
        highlight: 'Next-generation software add-ons for working DJs',
      },
      {
        title: 'DJ Tool Credits Wallet',
        badge: 'Tool Wallet',
        tab: 'home',
        targetSelector: '[data-tour="topbar-credits"]',
        description: 'Manage unified platform credits for stem downloads and automated audio tools. Pay only for what you download starting at KSH 250 / $2.50—no monthly recurring fee.',
        highlight: 'Pay-as-you-go downloads with zero subscription locks',
      },
      {
        title: 'Live Tip & Booking Notifications',
        badge: 'Performance Alerts',
        tab: 'home',
        targetSelector: '[data-tour="topbar-notifications"]',
        description: 'Receive instant phone and dashboard notifications whenever audience tips arrive or event promoters request gig dates.',
        highlight: 'Real-time alerts for gig bookings and audience tips',
      },
      {
        title: 'DJ Profile, Residencies & Booking Links',
        badge: 'DJ Profile',
        tab: 'home',
        targetSelector: '[data-tour="topbar-account"]',
        description: 'Set up your public DJ profile, resident club venues, booking rate card, and direct M-Pesa/bank payout accounts.',
        highlight: 'Your professional DJ business card and booking engine',
      },
      {
        title: 'DJ Helpdesk & Tour Controls',
        badge: 'Tour Controls',
        tab: 'home',
        targetSelector: '[data-tour="topbar-tour-btn"]',
        description: 'Access 24/7 technical support or click here anytime to restart your guided tour of the DJ console.',
        highlight: 'Restart your guided tour whenever you need a quick tip',
      },
    ],
  },

  podcaster: {
    label: 'Podcaster & Broadcaster',
    icon: RiGlobalFill,
    color: '#eab308',
    steps: [
      {
        title: 'Podcast Studio Headquarters',
        badge: 'Podcast Hub',
        tab: 'home',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'Host your podcast episodes, add pre-cleared theme music, normalize voice audio to industry standards, and connect with brand sponsors all in one place.',
        highlight: 'Everything your show needs to grow',
      },
      {
        title: 'Podcast Command Center & Fast RSS Feed',
        badge: 'RSS Syndication',
        tab: 'podcaster-studio',
        targetSelector: '[data-tour="nav-podcaster-studio"]',
        description: 'Manage show settings, syndication feeds, and audience analytics. Your validated RSS feed distributes episodes automatically to Apple Podcasts, Spotify, and YouTube.',
        highlight: 'One-click global podcast syndication',
      },
      {
        title: 'Episode Publisher & -16 LUFS Mastering',
        badge: 'Audio Publisher',
        tab: 'podcaster-episodes',
        targetSelector: '[data-tour="nav-podcaster-episodes"]',
        description: 'Upload episodes and run automated loudness mastering to ensure your voice sounds loud, clear, and balanced across all listener headphones and car stereos.',
        highlight: 'Broadcast-standard audio mastering in seconds',
      },
      {
        title: 'Podcaster EPK & Public Media Kit',
        badge: 'Live Media Kit',
        tab: 'podcaster-epk',
        targetSelector: '[data-tour="nav-podcaster-epk"]',
        description: 'Generate a live, cryptographically verified Media Kit displaying listener demographics, download totals, and sponsorship rates to share with brand advertisers.',
        highlight: 'Verified analytics to attract premium brand sponsors',
      },
      {
        title: 'Dynamic Ad Insertion & Co-Host Splits',
        badge: 'Sponsor Ads',
        tab: 'podcaster-monetization',
        targetSelector: '[data-tour="nav-podcaster-monetization"]',
        description: 'Set up dynamic sponsor ad spots and configure automated revenue splits so co-hosts and producers get paid directly via mobile money.',
        highlight: 'Turn your listenership into steady sponsorship revenue',
      },
      {
        title: 'Guest Booking CRM & Broadcast Waivers',
        badge: 'Guest CRM',
        tab: 'podcaster-guests',
        targetSelector: '[data-tour="nav-podcaster-guests"]',
        description: 'Manage guest pitches, coordinate interview calendars, and collect legally binding digital broadcast release waivers with zero paperwork.',
        highlight: 'Streamlined interview scheduling and legal waivers',
      },
      {
        title: 'TuneStream Global Podcast Directory',
        badge: 'Listener Reach',
        tab: 'podcasts',
        targetSelector: '[data-tour="nav-podcasts"]',
        description: 'Browse and stream your show alongside premier African podcasts with interactive transcripts and chapter markers on the TuneStream listener platform.',
        highlight: 'Direct streaming distribution to music and podcast fans',
      },
      {
        title: 'Automated Co-Host Split Cascades',
        badge: 'Co-Host Splits',
        tab: 'splits',
        targetSelector: '[data-tour="nav-splits"]',
        description: 'Ensure every sponsor payment or listener donation automatically splits among your production team without messy spreadsheets.',
        highlight: 'Dispute-free automated collaborator payouts',
      },
      {
        title: 'Corporate Sponsor Ad Flight Bidding',
        badge: 'Sponsorship Bids',
        tab: 'corporate-ads',
        targetSelector: '[data-tour="nav-corporate-ads"]',
        description: 'Access brand sponsors looking to book audio ad campaigns and host-read endorsements across your podcast episodes.',
        highlight: 'Monetize episodes through direct corporate sponsorships',
      },
      {
        title: 'Listener Fan Club & WhatsApp Community',
        badge: 'Audience CRM',
        tab: 'crm',
        targetSelector: '[data-tour="nav-crm"]',
        description: 'Build your loyal listener directory and broadcast episode drops, behind-the-scenes clips, and live Q&A announcements directly to fans on WhatsApp.',
        highlight: 'Deepen listener relationships with WhatsApp broadcasts',
      },
      {
        title: 'Social AI Chapters & Video Clips',
        badge: 'Viral Clips',
        tab: 'social-ai',
        targetSelector: '[data-tour="nav-social-ai"]',
        description: 'Automatically extract viral soundbites, generate clickable chapter timestamps, and produce video clips for TikTok, YouTube Shorts, and Instagram.',
        highlight: 'Automated video reels from audio episodes',
      },
      {
        title: 'Custom Show Website & Apex Domains',
        badge: 'Show Website',
        tab: 'domain-mappings',
        targetSelector: '[data-tour="nav-domain-mappings"]',
        description: 'Map your custom domain (e.g. podcast.yourname.com) to your show\'s public listening hub with integrated player embeds.',
        highlight: 'Brand your podcast with a standalone public website',
      },
      {
        title: 'Voice Cleanup & Mastering Credits',
        badge: 'Mastering Wallet',
        tab: 'home',
        targetSelector: '[data-tour="topbar-credits"]',
        description: 'Check your credit balance for automated voice cleanup, noise reduction, and mastering. Top up anytime starting at KSH 250 / $2.50 with zero monthly subscriptions.',
        highlight: 'Pay-as-you-go audio mastering with zero recurring locks',
      },
      {
        title: 'Sponsor Offers & Fan Tip Alerts',
        badge: 'Podcast Alerts',
        tab: 'home',
        targetSelector: '[data-tour="topbar-notifications"]',
        description: 'Get instant alerts when brands submit sponsor bids, listeners send tips, or guests sign broadcast release forms.',
        highlight: 'Never miss an advertiser proposal or listener tip',
      },
      {
        title: 'Show Profile & RSS Syndication Settings',
        badge: 'Show Settings',
        tab: 'home',
        targetSelector: '[data-tour="topbar-account"]',
        description: 'Configure podcast artwork, author details, episode categories, and payout preferences.',
        highlight: 'Centralized control for show metadata and banking rails',
      },
      {
        title: 'Podcaster Helpdesk & Tour Restart',
        badge: 'Tour Controls',
        tab: 'home',
        targetSelector: '[data-tour="topbar-tour-btn"]',
        description: 'Need technical assistance with your RSS feed? Reach audio engineering support or restart this guided tour whenever you need a refresher.',
        highlight: '1-click guidance and dedicated technical support',
      },
    ],
  },

  media_house: {
    label: 'Media House & TV/Radio',
    icon: RiGlobalFill,
    color: '#10b981',
    steps: [
      {
        title: 'Broadcast Operations Command Suite',
        badge: 'Broadcast Suite',
        tab: 'home',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'Access pre-cleared music libraries, automated cue sheet reporting, and commercial audio scheduling for your television station or radio network.',
        highlight: 'Safe music programming for broadcast networks',
      },
      {
        title: 'Commercial Audio Ad Flights & Traffic Scheduling',
        badge: 'Ad Management',
        tab: 'corporate-ads',
        targetSelector: '[data-tour="nav-corporate-ads"]',
        description: 'Schedule, traffic, and report on brand commercials and sponsor announcements playing across your broadcast channels with auditable broadcast logs.',
        highlight: 'Accurate play counts and advertiser delivery reports',
      },
      {
        title: 'Broadcast Music Library & Auto Cue Sheets',
        badge: 'Cleared Music',
        tab: 'sync',
        targetSelector: '[data-tour="nav-sync"]',
        description: 'Find station theme songs, background beds, and commercial hits pre-cleared for broadcast with automatic cue sheet generation to satisfy regulatory requirements.',
        highlight: 'Instant cue sheets and broadcast copyright clearance',
      },
      {
        title: '24-Bit Studio Audio EQ & Peak Normalization',
        badge: 'Audio Normalization',
        tab: 'stream-controls',
        targetSelector: '[data-tour="nav-stream-controls"]',
        description: 'Manage audio level processing, configure output limiting thresholds, and ensure compliance with broadcast loudness standards across streaming feeds.',
        highlight: 'Pristine sound levels meeting broadcast regulations',
      },
      {
        title: 'Broadcast Partner Network & Syndication',
        badge: 'Syndication',
        tab: 'affiliates',
        targetSelector: '[data-tour="nav-affiliates"]',
        description: 'Manage station affiliate syndication, regional partner rebroadcasts, and shared commercial distribution agreements.',
        highlight: 'Expand broadcast reach across regional affiliate networks',
      },
      {
        title: 'Advertiser & Sponsor Relationship CRM',
        badge: 'Advertiser CRM',
        tab: 'crm',
        targetSelector: '[data-tour="nav-crm"]',
        description: 'Maintain direct communications with commercial advertisers, media buying agencies, and corporate brand partners.',
        highlight: 'Direct sponsor communication and invoice coordination',
      },
      {
        title: 'Social AI On-Air Promo Generator',
        badge: 'Station Promos',
        tab: 'social-ai',
        targetSelector: '[data-tour="nav-social-ai"]',
        description: 'Produce on-air promo voiceover scripts, social media announcement banners, and program lineup graphics in seconds.',
        highlight: 'AI-assisted promotional scripting and broadcast banners',
      },
      {
        title: 'Media Production App Marketplace',
        badge: 'Broadcast Tools',
        tab: 'app-marketplace',
        targetSelector: '[data-tour="nav-app-marketplace"]',
        description: 'Explore broadcasting add-ons, digital automation webhooks, and PRO reporting integrations tailored for media conglomerates.',
        highlight: 'Enterprise extensions designed for high-volume broadcasters',
      },
      {
        title: 'Programming & Advertiser Milestone Alerts',
        badge: 'Broadcast Alerts',
        tab: 'home',
        targetSelector: '[data-tour="topbar-notifications"]',
        description: 'Receive live alerts on scheduled commercial placements, upcoming licensing expirations, and regulatory compliance milestones.',
        highlight: 'Automated compliance and sponsor campaign milestones',
      },
      {
        title: 'Broadcast License & Corporate Profile',
        badge: 'Station Profile',
        tab: 'home',
        targetSelector: '[data-tour="topbar-account"]',
        description: 'Manage station license credentials, corporate tax documentation, and automated bank payout accounts.',
        highlight: 'Centralized station credentials and corporate billing',
      },
      {
        title: 'Media House Support & Tour Controls',
        badge: 'Tour Controls',
        tab: 'home',
        targetSelector: '[data-tour="topbar-tour-btn"]',
        description: 'Access dedicated media engineering support or restart this guided walkthrough with a single click.',
        highlight: '24/7 technical broadcast support and guided tour controls',
      },
    ],
  },

  affiliate: {
    label: 'Ambassador & Affiliate',
    icon: RiCoinsFill,
    color: '#06b6d4',
    steps: [
      {
        title: 'Partner Hub Command Center',
        badge: 'Partner Hub',
        tab: 'home',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'Earn recurring commissions by introducing independent artists, producers, and record labels to TuneMavens. You earn whenever they release music, top up credits, or license tracks.',
        highlight: 'Zero fees to join—start earning immediately',
      },
      {
        title: 'Unique Invite Links, QR Codes & Tracking',
        badge: 'Invite Link',
        tab: 'affiliates',
        targetSelector: '[data-tour="nav-affiliates"]',
        description: 'Generate customized referral links and instant QR codes to share on Instagram, TikTok, WhatsApp, or at recording studios. Track every click, signup, and conversion in real time.',
        highlight: 'Track every click and signup in real-time',
      },
      {
        title: 'Automated Weekly Mobile & Bank Payouts',
        badge: 'Weekly Payouts',
        tab: 'splits',
        targetSelector: '[data-tour="nav-splits"]',
        description: 'Connect your M-Pesa mobile money or bank account. Your earnings are calculated transparently and disbursed automatically every single week without deductions.',
        highlight: 'Fast mobile payouts with zero deductions',
      },
      {
        title: 'Promotional Media Packs & Brand Assets',
        badge: 'Marketing Assets',
        tab: 'library',
        targetSelector: '[data-tour="nav-library"]',
        description: 'Download official high-resolution TuneMavens marketing badges, video clips, and social media flyers to make sharing effortless and professional.',
        highlight: 'Ready-to-use creative assets for your social channels',
      },
      {
        title: 'Commission Tiers & Performance Bonuses',
        badge: 'Reward Boosts',
        tab: 'tips',
        targetSelector: '[data-tour="nav-tips"]',
        description: 'Unlock higher percentage commission tiers, exclusive partner badges, and performance bonuses as your referred network of creators grows.',
        highlight: 'Scale your commission rates as you onboard more talent',
      },
      {
        title: '100% Free Partner Status (Zero Credits Required)',
        badge: 'Credit-Exempt Hub',
        tab: 'home',
        targetSelector: '[data-tour="topbar-credits"]',
        description: 'The Affiliate Dashboard, link generator, and analytics are permanently 100% free with zero credit deductions. Credits only apply if you personally desire to use creator studio tools.',
        highlight: 'Permanent zero-credit access for all partner features',
      },
      {
        title: 'Real-Time Commission Alerts',
        badge: 'Commission Alerts',
        tab: 'home',
        targetSelector: '[data-tour="topbar-notifications"]',
        description: 'Receive instant notifications on your phone and dashboard the moment one of your referrals signs up or generates earnings.',
        highlight: 'Live updates whenever your network produces revenue',
      },
      {
        title: 'Partner Profile & Settlement Preferences',
        badge: 'Payout Settings',
        tab: 'home',
        targetSelector: '[data-tour="topbar-account"]',
        description: 'Configure your personal partner details, referral handle, and default payout method (M-Pesa, Airtel Money, or direct bank wire).',
        highlight: 'Instant mobile money settlement preferences',
      },
      {
        title: 'Partner Support & Tour Controls',
        badge: 'Partner Help',
        tab: 'home',
        targetSelector: '[data-tour="topbar-tour-btn"]',
        description: 'Have questions about expanding your referral reach? Connect with our affiliate desk or click here anytime to restart your guided tour.',
        highlight: 'Dedicated partner support and 1-click tour restart',
      },
    ],
  },

  vc: {
    label: 'Tour Investor & LP',
    icon: RiFundsBoxFill,
    color: '#00f2fe',
    steps: [
      {
        title: 'Tour Capital & LP Command Center',
        badge: 'Tour Finance',
        tab: 'home',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'Invest directly in live concert tours, arena showcases, and major music festivals across Africa with institutional transparency, audited box-office data, and senior-priority recoupment.',
        highlight: 'Direct investment in live music tours',
      },
      {
        title: 'Creator Catalog & Tour Due Diligence',
        badge: 'Catalog Diligence',
        tab: 'vc-discover',
        targetSelector: '[data-tour="nav-vc-discover"]',
        description: 'Conduct deep diligence on artist streaming velocity, regional audience concentration, past tour sell-out history, and catalog revenue before deploying capital.',
        highlight: 'Data-driven artist discovery and telemetry inspection',
      },
      {
        title: 'Active Tour Facilities & Syndicate Tranches',
        badge: 'Tour Facilities',
        tab: 'tours-vault',
        targetSelector: '[data-tour="nav-tours-vault"]',
        description: 'Review live tour funding facilities, co-investment syndicates, target IRRs (18% - 24%), and real-time box-office ticket pacing across multi-city schedules.',
        highlight: 'Real-time ticket sales pacing and transparent budgets',
      },
      {
        title: 'Portfolio Performance & Yield Curves',
        badge: 'Yield Analytics',
        tab: 'vc-portfolio',
        targetSelector: '[data-tour="nav-vc-portfolio"]',
        description: 'Track portfolio performance metrics, capital deployed, interest yield accruals, and projected dividend distributions across all invested tranches.',
        highlight: 'Comprehensive telemetry on capital returns and yield',
      },
      {
        title: 'Artist Career Sponsorships & Equity',
        badge: 'Sponsorship Facilities',
        tab: 'vc-sponsorship',
        targetSelector: '[data-tour="nav-vc-sponsorship"]',
        description: 'Explore long-term artist development facilities and equity-sharing agreements that back emerging superstars on global tour cycles.',
        highlight: 'Structured equity and advance agreements for top creators',
      },
      {
        title: 'Senior First-Dollar Recoupment Waterfall',
        badge: 'Priority Returns',
        tab: 'splits',
        targetSelector: '[data-tour="nav-splits"]',
        description: 'Every ticket sold at the box office feeds directly into an automated repayment waterfall. Investor capital and interest are recouped first before artist profit splits release.',
        highlight: 'Automated, senior-priority recoupment',
      },
      {
        title: 'Standardized Tour Escrow Contracts',
        badge: 'Escrow Security',
        tab: 'escrow',
        targetSelector: '[data-tour="nav-escrow"]',
        description: 'All capital deployments are backed by legally binding, senior-secured escrow contracts with comprehensive audit provisions and digital signatures.',
        highlight: 'Legally binding contracts protecting investor capital',
      },
      {
        title: 'Syndicate Investor Network & Updates',
        badge: 'Syndicate CRM',
        tab: 'crm',
        targetSelector: '[data-tour="nav-crm"]',
        description: 'Receive private quarterly tour investor updates, promoter notes, and direct briefings from lead syndicators and concert producers.',
        highlight: 'Direct updates from concert producers and promoters',
      },
      {
        title: 'Institutional LP Credit-Exempt Status',
        badge: 'Credit-Exempt LP',
        tab: 'home',
        targetSelector: '[data-tour="topbar-credits"]',
        description: 'Institutional LP and Angel Syndicate accounts have permanent, credit-exempt platformwide access. Investors are never charged credit reload fees.',
        highlight: 'Permanent fee exemption for institutional investors',
      },
      {
        title: 'Box Office Receipts & Dividend Notifications',
        badge: 'Disbursement Feed',
        tab: 'home',
        targetSelector: '[data-tour="topbar-notifications"]',
        description: 'Get real-time alerts whenever weekend box-office settlements clear or milestone dividend distributions disburse to your banking rail.',
        highlight: 'Instant notifications on yield payments and repayments',
      },
      {
        title: 'Institutional Entity & Wire Settlement Rails',
        badge: 'Banking Rails',
        tab: 'home',
        targetSelector: '[data-tour="topbar-account"]',
        description: 'Configure LP fund entities, authorized signatories, tax compliance certificates, and commercial wire/SWIFT settlement destinations.',
        highlight: 'Institutional treasury controls and wire rails',
      },
      {
        title: 'Investor Briefing & Tour Controls',
        badge: 'Tour Controls',
        tab: 'home',
        targetSelector: '[data-tour="topbar-tour-btn"]',
        description: 'Access dedicated investment relations support or click here anytime to restart your guided overview of the Tour Capital Vault.',
        highlight: 'Dedicated investor relations and 1-click tour restart',
      },
    ],
  },

  consumer: {
    label: 'Fan & Music Listener',
    icon: RiHeadphoneFill,
    color: '#00f2fe',
    steps: [
      {
        title: 'Welcome to TuneStream Listener Hub',
        badge: 'Hi-Fi Music',
        tab: 'home',
        targetSelector: '[data-tour="consumer-sidebar"]',
        description: 'Experience studio-quality music streaming from your favorite African artists, completely free from monthly subscription fees.',
        highlight: 'Studio-quality audio for real music fans',
      },
      {
        title: 'For You & Curated African Mixes',
        badge: 'For You',
        tab: 'home',
        targetSelector: '[data-tour="nav-home"]',
        description: 'Explore handpicked African DJ mixes, trending songs, and fresh releases tailored to your musical taste.',
        highlight: 'Fresh music curated for you every day',
      },
      {
        title: 'Explore & Stream by Genre',
        badge: 'Browse Genres',
        tab: 'explore',
        targetSelector: '[data-tour="nav-explore"]',
        description: 'Discover fresh sounds across Afrobeats, Amapiano, Gengetone, Deep House, and Bongo Flava with a 60fps waveform player and live lyrics.',
        highlight: 'Interactive waveform player and real-time lyrics',
      },
      {
        title: 'Podcasts & Original Shows Directory',
        badge: 'Spoken Shows',
        tab: 'podcasts',
        targetSelector: '[data-tour="nav-podcasts"]',
        description: 'Stream top-rated original African podcasts, interview shows, and cultural discussions with clickable chapter markers and full text transcripts.',
        highlight: 'Stream top original African podcasts with transcripts',
      },
      {
        title: 'Live 24-Bit Studio Radio',
        badge: 'Live Radio',
        tab: 'radio',
        targetSelector: '[data-tour="nav-radio"]',
        description: 'Tune in to lossless 24-bit live radio broadcasts streaming uncompressed DJ sets and festival stages from Nairobi, Lagos, Johannesburg, and London.',
        highlight: 'Live festival feeds and DJ sets in pure 24-bit sound',
      },
      {
        title: 'My Collection & Playlist Crates',
        badge: 'My Library',
        tab: 'library',
        targetSelector: '[data-tour="nav-library"]',
        description: 'Access your favorite tracks, created playlists, and offline downloads in one easy place.',
        highlight: 'All your favorite songs kept safe',
      },
      {
        title: 'Live Concert Shows & VIP Passes',
        badge: 'Concert Tickets',
        tab: 'concerts',
        targetSelector: '[data-tour="nav-concerts"]',
        description: 'Discover upcoming live concert tours, festival stages, and exclusive VIP artist meet-and-greets with digital QR admission tickets.',
        highlight: 'Get direct concert passes and festival tickets',
      },
      {
        title: '24-Bit FLAC Studio EQ & Audio DAC',
        badge: 'Lossless Sound',
        tab: 'stream-controls',
        targetSelector: '[data-tour="nav-stream-controls"]',
        description: 'Experience audiophile sound: adjust our 10-band studio graphic equalizer, toggle lossless 24-bit/96kHz FLAC audio, and optimize for your headphones.',
        highlight: 'Uncompressed studio dynamic range in your ears',
      },
      {
        title: 'Offline Cache & Multi-Device Sync',
        badge: 'Offline Sync',
        tab: 'device-sync',
        targetSelector: '[data-tour="nav-device-sync"]',
        description: 'Save up to 8GB of uncompressed music for offline playback on airplanes, road trips, or off-grid listening without using mobile data.',
        highlight: 'Listen offline anywhere with zero mobile data use',
      },
      {
        title: '1-Tap Direct Artist Tipping',
        badge: 'Support Artists',
        tab: 'tips',
        targetSelector: '[data-tour="nav-tips"]',
        description: 'Send instant tips directly to artists via M-Pesa or card. 100% of your tip goes straight into the artist’s pocket.',
        highlight: 'Direct support that artists actually receive',
      },
      {
        title: 'Universal TM Credits Balance & Top-Up',
        badge: 'Credits Wallet',
        tab: 'home',
        targetSelector: '[data-tour="consumer-credits"]',
        description: 'Check your TM Credits balance anytime. Reload credits starting from our low floor of KSH 250 / $2.50 to tip creators or unlock secret drops—with zero monthly charges.',
        highlight: 'Accessible KSH 250 floor with non-expiring credits',
      },
      {
        title: 'Native Apps Suite for iOS, Android & Desktop',
        badge: 'Native Apps',
        tab: 'home',
        targetSelector: '[data-tour="consumer-apps-btn"]',
        description: 'Download our native mobile and desktop applications for lightning-fast listening, background playback, and system keyboard media keys.',
        highlight: 'High-performance native apps for all your devices',
      },
      {
        title: 'Release Drops & Artist Alerts',
        badge: 'Drop Alerts',
        tab: 'home',
        targetSelector: '[data-tour="topbar-notifications"]',
        description: 'Get instant notifications whenever artists you follow drop new singles, unreleased album stems, or live concert dates.',
        highlight: 'Be the first to hear new releases from your favorite artists',
      },
      {
        title: 'Listener Profile & Audio Preferences',
        badge: 'Taste DNA',
        tab: 'home',
        targetSelector: '[data-tour="topbar-account"]',
        description: 'Customize your listener username, avatar, favorite genres, and streaming quality preferences.',
        highlight: 'Personalize your music taste and streaming quality',
      },
      {
        title: 'Listener Tour & Audio Guide Controls',
        badge: 'Tour Controls',
        tab: 'home',
        targetSelector: '[data-tour="consumer-tour-btn"]',
        description: 'Want a quick refresher on how to get the most out of TuneStream? Click \'Take Tour\' right here anytime to restart this interactive walkthrough.',
        highlight: '1-click guided walkthrough whenever you need it',
      },
    ],
  },

  admin: {
    label: 'Administrator & Operations',
    icon: RiShieldFill,
    color: '#ef4444',
    steps: [
      {
        title: 'Platform Control Room',
        badge: 'System Command',
        tab: 'home',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'Welcome to your central platform control room. As an administrator, you have complete visibility and control over all music catalogs, users, automated payouts, messaging, and system tools.',
        highlight: 'Your full-access pass to every tool across TuneMavens',
      },
      {
        title: 'Live Activity & Key Numbers',
        badge: 'Live Metrics',
        tab: 'home',
        targetSelector: '[data-tour="admin-overview-stats"]',
        description: 'These overview cards show real-time platform vitals: active corporate advertising spend, verified audio stream counts, and system credit balances across all users.',
        highlight: 'Real-time vitals updated live as users interact',
      },
      {
        title: 'Growth & Delivery Trends',
        badge: 'Analytics Chart',
        tab: 'home',
        targetSelector: '[data-tour="admin-overview-chart"]',
        description: 'This interactive chart tracks month-over-month performance. You can review streaming milestones, brand ad reach, and revenue progress across all music genres.',
        highlight: 'Visual performance tracking at a glance',
      },
      {
        title: 'Experience Any User Role',
        badge: 'Role Simulator',
        tab: 'home',
        targetSelector: '[data-tour="topbar-account"]',
        description: 'Click your account menu or avatar anytime to switch into any persona: Creator, Music Supervisor, Record Label, Corporate Brand, DJ, Podcaster, Affiliate, or Investor. This lets you test the exact experience each user sees.',
        highlight: 'Test and verify the platform from any user perspective',
      },
      {
        title: 'Platform Credit System & Balances',
        badge: 'User Credit System',
        tab: 'home',
        targetSelector: '[data-tour="topbar-credits"]',
        description: 'Monitor platform credit circulation across creators, record labels, and listeners. Administrators have unrestricted system access and never need to load credits or pay reload fees.',
        highlight: 'Administrators have permanent, 100% credit-exempt access',
      },
      {
        title: 'Real-Time Notifications',
        badge: 'Action Alerts',
        tab: 'home',
        targetSelector: '[data-tour="topbar-notifications"]',
        description: 'Get instant alerts whenever key events occur—such as new sync licensing inquiries, payout disbursements, pending split approvals, or user verification requests.',
        highlight: 'Stay informed on critical platform events',
      },
      {
        title: 'Admin Team & Staff Seats',
        badge: 'Staff Management',
        tab: 'admin-team',
        targetSelector: '[data-tour="nav-admin-team"]',
        description: 'Invite team members, assign operational seats, and manage permissions for platform moderators, music curators, and finance administrators.',
        highlight: 'Secure access control for your operational team',
      },
      {
        title: 'Communications Vault & WhatsApp',
        badge: 'Messaging Vault',
        tab: 'communications',
        targetSelector: '[data-tour="nav-communications"]',
        description: 'Manage real-time WhatsApp and email delivery. You can initiate inbound handshakes, test automated notifications, and oversee private monthly messaging quotas.',
        highlight: 'Automated, reliable phone notifications with admin-only quota controls',
      },
      {
        title: 'Corporate Ads & Audio Flights',
        badge: 'Brand Sponsorships',
        tab: 'corporate-ads',
        targetSelector: '[data-tour="nav-corporate-ads"]',
        description: 'Set commercial sponsorship rates, track audio jingles and ad placements across TuneStream players and podcasts, and review brand campaign performance.',
        highlight: 'Monetize streaming audio with brand sponsorships',
      },
      {
        title: 'Affiliate Programme & Referrals',
        badge: 'Affiliate Hub',
        tab: 'affiliates',
        targetSelector: '[data-tour="nav-affiliates"]',
        description: 'Manage promotional partners and ambassadors. Review referral commission rates, track invite links, and ensure automated weekly mobile money payouts.',
        highlight: 'Drive organic platform growth with transparent commissions',
      },
      {
        title: 'Catalogue Machine & Master Songs',
        badge: 'Music Catalog',
        tab: 'catalog',
        targetSelector: '[data-tour="nav-catalog"]',
        description: 'Inspect all music uploaded across the platform. Verify song titles, cover artwork, audio formats, and international streaming readiness.',
        highlight: 'Maintain high audio and metadata standards',
      },
      {
        title: 'Digital Press Kit (EPK) Builder',
        badge: 'Artist Websites',
        tab: 'epk-builder',
        targetSelector: '[data-tour="nav-epk-builder"]',
        description: 'Where artists build responsive websites showcasing their music, tour dates, high-res photos, and biographies to pitch to festival organizers and labels.',
        highlight: 'Empower creators to look professional for bookers',
      },
      {
        title: 'Split Cascade & Royalty Payouts',
        badge: 'Royalty Splits',
        tab: 'splits',
        targetSelector: '[data-tour="nav-splits"]',
        description: 'Set up and inspect automated royalty sharing. When a track earns money, collaborator splits (for producers, writers, and artists) are paid automatically to mobile money or bank accounts.',
        highlight: 'Zero payment confusion or collaborator disputes',
      },
      {
        title: 'Sync Marketplace & Briefs',
        badge: 'Film & TV Sync',
        tab: 'sync',
        targetSelector: '[data-tour="nav-sync"]',
        description: 'Where music supervisors search and license 100% pre-cleared tracks for movies, TV series, video games, and advertising campaigns.',
        highlight: 'Connecting authentic music with global media projects',
      },
      {
        title: 'Digital Contracts & Escrow',
        badge: 'Safe Contracts',
        tab: 'escrow',
        targetSelector: '[data-tour="nav-escrow"]',
        description: 'Review signed licensing agreements and escrow transactions. Funds are held safely until contracts are mutually executed, protecting both creators and buyers.',
        highlight: 'Complete legal security with digital escrow',
      },
      {
        title: 'DJ Record Pool & Club Edits',
        badge: 'DJ Community',
        tab: 'djpool',
        targetSelector: '[data-tour="nav-djpool"]',
        description: 'Curated crates of extended intros, clean radio cuts, and trending African club tracks built specifically for professional club and broadcast DJs.',
        highlight: 'Equip working DJs with fresh club-ready tracks',
      },
      {
        title: 'Podcaster Studio & RSS Feeds',
        badge: 'Podcasts & Shows',
        tab: 'podcaster-studio',
        targetSelector: '[data-tour="nav-podcaster-studio"]',
        description: 'Manage podcast episodes, audio mastering, guest releases, and automatic distribution to Apple Podcasts, Spotify, and YouTube.',
        highlight: 'A complete home for African podcast creators',
      },
      {
        title: 'TunePay POS & Event Commerce',
        badge: 'Live Merch Sales',
        tab: 'pos-inventory',
        targetSelector: '[data-tour="nav-pos-inventory"]',
        description: 'Manage live merchandise sales for concert tours and festival booths. Supports on-site card and M-Pesa payments with instant settlement.',
        highlight: 'Sell merch at live events with instant mobile checkout',
      },
      {
        title: 'Custom Domains & Web Setup',
        badge: 'Custom Domains',
        tab: 'domain-mappings',
        targetSelector: '[data-tour="nav-domain-mappings"]',
        description: 'Connect custom internet domains (like yourname.com) directly to artist EPKs and manage public website layout templates.',
        highlight: 'Give artists their own custom web identity',
      },
      {
        title: 'App Marketplace & Add-Ons',
        badge: 'App Ecosystem',
        tab: 'app-marketplace',
        targetSelector: '[data-tour="nav-app-marketplace"]',
        description: 'Browse, activate, or disable modular platform apps—such as AI social caption generators, smart CRM, and third-party integrations.',
        highlight: 'Customize workspace capabilities as needed',
      },
      {
        title: "You're All Set! Restart Anytime",
        badge: 'Support & Tour Help',
        tab: 'support',
        targetSelector: '[data-tour="topbar-tour-btn"]',
        description: "That covers the entire admin dashboard! You can restart this tour anytime with a single click right here on the 'Take Tour' button, or explore help articles in the Support tab.",
        highlight: "Click 'Take Tour' anytime to replay this guided walkthrough",
      },
    ],
  },
};

export default function DashboardTourModal({
  isOpen,
  onClose,
  currentRole = 'creator',
  setActiveTab,
  onReturnToMain,
}) {
  const effectiveRole = (currentRole === 'investor' ? 'vc' : currentRole) || 'creator';
  const personaData = PERSONA_TOUR_DATA[effectiveRole] || PERSONA_TOUR_DATA.creator;
  const steps = personaData.steps || [];

  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', isFloating: false });
  const cardRef = useRef(null);

  // Reset step counter whenever the tour opens or role changes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen, effectiveRole]);

  // Measure and compute the target element's bounding rect
  const updateTargetPosition = useCallback(() => {
    if (!isOpen || steps.length === 0) {
      setTargetRect(null);
      return;
    }

    const step = steps[currentStep];
    if (!step) return;

    let targetEl = null;

    // 1. Try primary selector
    if (step.targetSelector) {
      try {
        targetEl = document.querySelector(step.targetSelector);
      } catch (_) {}
    }

    // 2. Fallback to tab selector if primary not found
    if (!targetEl && step.tab) {
      targetEl = document.querySelector(`[data-tour="nav-${step.tab}"]`) ||
                 document.querySelector(`button[data-tab="${step.tab}"]`) ||
                 document.querySelector(`[data-tour="nav-${step.tab.replace('-vault', '')}"]`) ||
                 document.querySelector(`button[data-tour="nav-${step.tab}"]`);
    }

    // 3. Fallback to general sidebar/content if available
    if (!targetEl && step.targetSelector === '[data-tour="sidebar-nav"]') {
      targetEl = document.querySelector('[data-tour="sidebar-nav"]') ||
                 document.querySelector('[data-tour="sidebar"]') ||
                 document.querySelector('[data-tour="consumer-sidebar"]');
    }

    if (targetEl) {
      // Ensure target element is brought into view inside its scrollable parent
      try {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      } catch (_) {}

      const rect = targetEl.getBoundingClientRect();
      // If element is actually on screen with non-zero dimensions
      if (rect.width > 0 && rect.height > 0) {
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right,
        });

        // Compute floating card position adjacent to target
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        const cardWidth = Math.min(460, winWidth - 32);
        const cardHeightEstimate = 320;

        // A. If target is in the sidebar (left side of screen)
        if (rect.right < winWidth * 0.42) {
          const idealLeft = rect.right + 20;
          const idealTop = Math.max(16, Math.min(rect.top - 10, winHeight - cardHeightEstimate - 16));
          setPopoverPos({
            position: 'fixed',
            left: `${idealLeft}px`,
            top: `${idealTop}px`,
            transform: 'none',
            isFloating: true,
            placement: 'right',
          });
        }
        // B. If target is in the topbar (top of screen)
        else if (rect.top < 110) {
          const idealTop = rect.bottom + 16;
          const idealLeft = Math.max(16, Math.min(rect.left - 60, winWidth - cardWidth - 16));
          setPopoverPos({
            position: 'fixed',
            left: `${idealLeft}px`,
            top: `${idealTop}px`,
            transform: 'none',
            isFloating: true,
            placement: 'bottom',
          });
        }
        // C. Target is in main content area
        else {
          // If wide element or card in main content
          const canFitBelow = rect.bottom + 16 + cardHeightEstimate <= winHeight;
          const canFitAbove = rect.top - 16 - cardHeightEstimate >= 16;

          if (canFitBelow) {
            const idealLeft = Math.max(16, Math.min(rect.left, winWidth - cardWidth - 16));
            setPopoverPos({
              position: 'fixed',
              left: `${idealLeft}px`,
              top: `${rect.bottom + 16}px`,
              transform: 'none',
              isFloating: true,
              placement: 'bottom',
            });
          } else if (canFitAbove) {
            const idealLeft = Math.max(16, Math.min(rect.left, winWidth - cardWidth - 16));
            setPopoverPos({
              position: 'fixed',
              left: `${idealLeft}px`,
              top: `${rect.top - cardHeightEstimate - 16}px`,
              transform: 'none',
              isFloating: true,
              placement: 'top',
            });
          } else {
            // Floating dock at bottom-right of viewport to avoid covering the spotlight
            setPopoverPos({
              position: 'fixed',
              right: '24px',
              bottom: '24px',
              left: 'auto',
              top: 'auto',
              transform: 'none',
              isFloating: true,
              placement: 'dock-bottom-right',
            });
          }
        }
        return;
      }
    }

    // Default centered position if no target is active
    setTargetRect(null);
    setPopoverPos({
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      isFloating: false,
      placement: 'center',
    });
  }, [isOpen, currentStep, steps]);

  // Activate tab and re-measure whenever current step changes
  useEffect(() => {
    if (!isOpen) return;

    const step = steps[currentStep];
    if (step?.tab && typeof setActiveTab === 'function') {
      setActiveTab(step.tab);
    }

    // Multiple micro-frames ensure DOM switches tabs and finishes smooth scrolling
    updateTargetPosition();
    const t1 = setTimeout(updateTargetPosition, 60);
    const t2 = setTimeout(updateTargetPosition, 180);
    const t3 = setTimeout(updateTargetPosition, 340);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, currentStep, steps, setActiveTab, updateTargetPosition]);

  // Listen to window resize and capture-phase scroll events
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => updateTargetPosition();
    const handleScroll = () => updateTargetPosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, updateTargetPosition]);

  // Keyboard navigation: Escape closes, ArrowRight next, ArrowLeft prev
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleEndTour();
      } else if (e.key === 'ArrowRight') {
        if (currentStep < steps.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          handleEndTour();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStep > 0) {
          setCurrentStep((prev) => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, steps.length]);

  if (!isOpen || steps.length === 0) return null;

  const step = steps[currentStep] || steps[0];
  const PersonaIcon = personaData.icon || RiCompass3Line;
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const handleEndTour = () => {
    try {
      localStorage.setItem(`tunemavens_tour_seen_${effectiveRole}`, 'true');
    } catch (_) {}
    onClose();
  };

  const handleNext = () => {
    if (isLast) {
      handleEndTour();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const pad = 8; // Spotlight breathing margin

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'auto' }}>
      {/* 
        Full Screen SVG Cutout Overlay with 0.8 Blackout Opacity:
        The mask uses white for the 0.8 blackout area and black for the clear spotlight hole.
      */}
      <svg
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 10001,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <mask id="dashboard-tour-spotlight-mask">
            {/* White base makes the 0.8 blackout visible everywhere */}
            <rect x="0" y="0" width="100%" height="100%" fill="#ffffff" />
            {/* Black hole cuts out the target element so the dashboard underneath is crystal-clear */}
            {targetRect && (
              <rect
                x={Math.max(0, targetRect.left - pad)}
                y={Math.max(0, targetRect.top - pad)}
                width={targetRect.width + pad * 2}
                height={targetRect.height + pad * 2}
                rx="3"
                ry="3"
                fill="#000000"
              />
            )}
          </mask>
        </defs>

        {/* 
          0.8 Opacity Filter Layer:
          User clicks anywhere on the dark backdrop to safely exit the tour anytime.
        */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.8)"
          mask="url(#dashboard-tour-spotlight-mask)"
          style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          onClick={handleEndTour}
          title="Click anywhere on backdrop to end tour"
        />
      </svg>

      {/* Pulsing Highlight Border around the spotlighted section */}
      {targetRect && (
        <div
          style={{
            position: 'fixed',
            left: `${Math.max(0, targetRect.left - pad)}px`,
            top: `${Math.max(0, targetRect.top - pad)}px`,
            width: `${targetRect.width + pad * 2}px`,
            height: `${targetRect.height + pad * 2}px`,
            borderRadius: '3px',
            border: `2px solid ${personaData.color}`,
            boxShadow: `0 0 0 3px ${personaData.color}33, 0 0 25px ${personaData.color}77`,
            pointerEvents: 'none',
            zIndex: 10002,
            transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      )}

      {/* Interactive Tour Card Popover */}
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: popoverPos.position || 'fixed',
          top: popoverPos.top,
          left: popoverPos.left,
          right: popoverPos.right,
          bottom: popoverPos.bottom,
          transform: popoverPos.transform || 'none',
          zIndex: 10003,
          width: 'min(460px, calc(100vw - 32px))',
          background: 'linear-gradient(145deg, #0d1522 0%, #080d16 100%)',
          border: `1px solid ${personaData.color}66`,
          borderRadius: '3px',
          padding: '24px 26px',
          boxShadow: `0 24px 60px rgba(0,0,0,0.9), 0 0 35px ${personaData.color}22`,
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          pointerEvents: 'auto',
          animation: 'tourFadeIn 0.2s ease-out',
        }}
        data-testid="dashboard-tour-card"
      >
        {/* Header: Persona Role, Section Badge & Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div
              style={{
                background: `${personaData.color}22`,
                border: `1px solid ${personaData.color}55`,
                color: personaData.color,
                padding: '4px 9px',
                borderRadius: '3px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
              }}
            >
              <PersonaIcon size={14} />
              <span>{personaData.label}</span>
            </div>
            <span
              style={{
                fontSize: '10.5px',
                background: 'rgba(255,255,255,0.08)',
                color: '#94a3b8',
                padding: '3px 7px',
                borderRadius: '3px',
                fontWeight: 700,
              }}
            >
              {step.badge}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize: '11.5px',
                color: '#94a3b8',
                fontFamily: 'monospace',
                fontWeight: 700,
              }}
            >
              {currentStep + 1} / {steps.length}
            </span>
            <button
              type="button"
              onClick={handleEndTour}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '3px',
                transition: 'color 0.15s ease',
              }}
              title="End Tour (Escape)"
              data-testid="dashboard-tour-close-btn"
            >
              <RiCloseLine size={20} />
            </button>
          </div>
        </div>

        {/* Clickable Progress Dots */}
        <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
          {steps.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentStep(idx)}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '3px',
                background: idx === currentStep
                  ? personaData.color
                  : (idx < currentStep ? `${personaData.color}77` : 'rgba(255,255,255,0.12)'),
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title={`Jump to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Step Title & Clear Description */}
        <div>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#f8fafc',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <RiSparklingLine size={20} style={{ color: personaData.color, flexShrink: 0 }} />
            <span>{step.title}</span>
          </h2>

          <p
            style={{
              fontSize: '13.5px',
              lineHeight: 1.6,
              color: '#cbd5e1',
              margin: '0 0 12px 0',
            }}
          >
            {step.description}
          </p>

          {/* Key Benefit Highlight */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderLeft: `3px solid ${personaData.color}`,
              borderRadius: '0 3px 3px 0',
              padding: '9px 12px',
              fontSize: '12px',
              color: '#e2e8f0',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ color: personaData.color, fontSize: '13px' }}>💡</span>
            <span>{step.highlight}</span>
          </div>
        </div>

        {/* Footer: End Tour, Back, Next */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '14px',
            marginTop: '2px',
          }}
        >
          <button
            type="button"
            onClick={handleEndTour}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: '3px',
              transition: 'color 0.15s ease',
            }}
            data-testid="dashboard-tour-end-btn"
          >
            ✕ End Tour
          </button>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {isLast && onReturnToMain && (
              <button
                type="button"
                onClick={() => {
                  handleEndTour();
                  onReturnToMain();
                }}
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 4px 14px rgba(14,165,233,0.35)',
                  transition: 'all 0.15s ease',
                }}
                data-testid="dashboard-tour-return-main-btn"
                title="Finish tour and return to TuneMavens Console"
              >
                <RiArrowLeftLine size={13} />
                <span>Return to TuneMavens Console</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirst}
              style={{
                background: '#1e293b',
                color: isFirst ? '#475569' : '#e2e8f0',
                border: '1px solid #334155',
                borderRadius: '3px',
                padding: '7px 13px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: isFirst ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                opacity: isFirst ? 0.5 : 1,
              }}
              data-testid="dashboard-tour-prev-btn"
            >
              <RiArrowLeftLine size={13} />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              style={{
                background: personaData.color,
                color: '#080d16',
                border: 'none',
                borderRadius: '3px',
                padding: '7px 16px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: `0 4px 14px ${personaData.color}44`,
                transition: 'all 0.15s ease',
              }}
              data-testid="dashboard-tour-next-btn"
            >
              <span>{isLast ? 'Finish Tour' : 'Next'}</span>
              {isLast ? <RiCheckLine size={14} /> : <RiArrowRightLine size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
