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
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'This is your creative headquarters. Everything you need—from setting up your artist profile to uploading songs and checking payments—is right here on the menu.',
        highlight: 'Your complete music workspace in one place',
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
        title: 'Upload Your Songs',
        badge: 'Music Uploads',
        tab: 'catalog-porting',
        targetSelector: '[data-tour="nav-catalog-porting"]',
        description: 'Upload your music with clear song titles and cover art. We help make sure everything is formatted properly before releasing to Spotify, Apple Music, and Boomplay.',
        highlight: 'Get your songs ready for listeners everywhere',
      },
      {
        title: 'Fair & Automatic Payouts',
        badge: 'Share Earnings',
        tab: 'split-cascade',
        targetSelector: '[data-tour="nav-split-cascade"]',
        description: 'Decide who gets paid for each song. When your music earns money, your producers and collaborators get paid straight to their mobile money or bank accounts without disputes.',
        highlight: 'No more arguments or confusing payment spreadsheets',
      },
      {
        title: 'Your Balance & Credits',
        badge: 'Wallet & Tools',
        tab: 'epk-builder',
        targetSelector: '[data-tour="topbar-credits"]',
        description: 'This is your credit balance. Top up anytime using M-Pesa or card whenever you want to use song mastering tools or receive automated phone alerts.',
        highlight: 'Top up only when you need it—no monthly subscription',
      },
      {
        title: 'Instant Phone Alerts',
        badge: 'WhatsApp Alerts',
        tab: 'communications-vault',
        targetSelector: '[data-tour="nav-communications-vault"]',
        description: 'Get notified directly on WhatsApp or email whenever someone wants to license your song or whenever your royalties arrive.',
        highlight: 'Never miss an opportunity or payment',
      },
    ],
  },

  supervisor: {
    label: 'Music Supervisor',
    icon: RiEqualizerFill,
    color: '#ec4899',
    steps: [
      {
        title: 'Music for Film, TV & Ads',
        badge: 'Sync Suite',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'Find authentic, high-quality African music for your films, television series, video games, and commercials. Every track is ready to license right away.',
        highlight: '100% pre-cleared music with zero copyright delays',
      },
      {
        title: 'Search & Audition Music',
        badge: 'Search & Listen',
        tab: 'sync-marketplace',
        targetSelector: '[data-tour="nav-sync-marketplace"]',
        description: 'Search songs by mood, tempo, genre, or instrument. Audition tracks immediately and download instrumental versions to test in your project video timeline.',
        highlight: 'Find and test the right track in seconds',
      },
      {
        title: 'Safe Licensing Agreements',
        badge: 'Legal Clearance',
        tab: 'escrow-contracts',
        targetSelector: '[data-tour="nav-escrow-contracts"]',
        description: 'Complete licensing agreements online with one click. Payments are held safely until contracts are signed, giving your production complete legal protection.',
        highlight: 'Instant digital signing and clear copyright ownership',
      },
      {
        title: 'Complimentary VIP WhatsApp',
        badge: 'Free VIP Alerts',
        tab: 'sync-marketplace',
        targetSelector: '[data-tour="topbar-notifications"]',
        description: 'Music supervisors get free, unlimited WhatsApp messaging. Talk directly with artist teams and request custom edits without any credit fees.',
        highlight: 'Direct chat with creators at zero cost',
      },
    ],
  },

  label: {
    label: 'Record Label & Publisher',
    icon: RiDiscFill,
    color: '#a855f7',
    steps: [
      {
        title: 'Manage Your Label Roster',
        badge: 'Label Roster',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'Oversee all your signed artists, album releases, and team members from one organized dashboard.',
        highlight: 'Complete control of your label in one place',
      },
      {
        title: 'Your Music Catalogue',
        badge: 'Song Library',
        tab: 'catalog-porting',
        targetSelector: '[data-tour="nav-catalog-porting"]',
        description: 'View and manage all releases across your artists. Keep audio masters, artwork, and release dates tidy and up-to-date.',
        highlight: 'Keep your entire song catalog organized',
      },
      {
        title: 'Automated Artist Splits',
        badge: 'Automated Payouts',
        tab: 'split-cascade',
        targetSelector: '[data-tour="nav-split-cascade"]',
        description: 'Recoup studio costs first, then share earnings automatically with your artists and producers via M-Pesa or bank transfer.',
        highlight: 'Transparent accounting with zero manual math',
      },
      {
        title: 'License Roster Music for TV & Brands',
        badge: 'Sync Licensing',
        tab: 'sync-marketplace',
        targetSelector: '[data-tour="nav-sync-marketplace"]',
        description: 'Pitch your artists’ songs directly to movie producers, advertising agencies, and TV networks to earn extra revenue.',
        highlight: 'Open up new revenue streams for your artists',
      },
    ],
  },

  corporate: {
    label: 'Corporate Brand & Marketing',
    icon: RiMegaphoneFill,
    color: '#f97316',
    steps: [
      {
        title: 'Brand Music & Sponsorships',
        badge: 'Brand Marketing',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'License authentic African music for your advertising campaigns, brand jingles, and event sponsorships with zero copyright worries.',
        highlight: 'Safe, copyright-cleared music for commercial use',
      },
      {
        title: 'Find Commercial Music',
        badge: 'Ad Music Library',
        tab: 'sync-marketplace',
        targetSelector: '[data-tour="nav-sync-marketplace"]',
        description: 'Discover trending songs and custom background music pre-cleared for YouTube, Instagram, TV, and radio commercials.',
        highlight: 'Instant licensing for commercial broadcasts',
      },
      {
        title: 'Track Audio Ad Flights',
        badge: 'Campaign Flights',
        tab: 'corporate-ads',
        targetSelector: '[data-tour="nav-corporate-ads"]',
        description: 'Monitor your brand sponsorships and audio commercial placements with live analytics and audience reach numbers.',
        highlight: 'Reach genuine music fans across Africa',
      },
    ],
  },

  dj: {
    label: 'Professional DJ & Curator',
    icon: RiRadioFill,
    color: '#3b82f6',
    steps: [
      {
        title: 'Welcome to the DJ Record Pool',
        badge: 'DJ Headquarters',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'Get club-ready edits, extended intros, instrumentals, and trending African tracks ready to load straight into your DJ software.',
        highlight: 'High-quality tracks ready for your sets',
      },
      {
        title: 'Download Crates & New Tracks',
        badge: 'Crates & Edits',
        tab: 'djpool',
        targetSelector: '[data-tour="nav-djpool"]',
        description: 'Browse songs by BPM, key, and dance style. Download lossless audio for Rekordbox, Serato, or USB flash drives.',
        highlight: 'Stay ahead with fresh, exclusive club tracks',
      },
      {
        title: 'Live Crowd Tips & Requests',
        badge: 'Live Tips',
        tab: 'tunemavens-tips',
        targetSelector: '[data-tour="nav-tunemavens-tips"]',
        description: 'Let partygoers tip you and send song requests straight to your phone via QR code or M-Pesa while you perform.',
        highlight: 'Earn tips directly from the dancefloor',
      },
    ],
  },

  podcaster: {
    label: 'Podcaster & Broadcaster',
    icon: RiGlobalFill,
    color: '#eab308',
    steps: [
      {
        title: 'Welcome to Podcast Studio',
        badge: 'Podcast Hub',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'Host your episodes, add cleared theme music, and connect with brand sponsors all in one place.',
        highlight: 'Everything your show needs to grow',
      },
      {
        title: 'Publish Episodes',
        badge: 'Episodes',
        tab: 'podcaster-studio',
        targetSelector: '[data-tour="nav-podcaster-studio"]',
        description: 'Upload audio episodes and distribute them seamlessly to Apple Podcasts, Spotify, and YouTube.',
        highlight: 'One-click podcast distribution',
      },
      {
        title: 'Get Brand Sponsors',
        badge: 'Sponsorships',
        tab: 'corporate-ads',
        targetSelector: '[data-tour="nav-corporate-ads"]',
        description: 'Match with brands looking to sponsor podcasts and earn money from your listener audience.',
        highlight: 'Turn your listeners into steady income',
      },
    ],
  },

  media_house: {
    label: 'Media House & TV/Radio',
    icon: RiGlobalFill,
    color: '#10b981',
    steps: [
      {
        title: 'Media House Broadcast Suite',
        badge: 'Broadcast Suite',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'Access cleared music libraries, cue sheets, and commercial audio spots for your radio station or TV channel.',
        highlight: 'Safe music programming for broadcast',
      },
      {
        title: 'Broadcast Music Library',
        badge: 'Cleared Music',
        tab: 'sync-marketplace',
        targetSelector: '[data-tour="nav-sync-marketplace"]',
        description: 'Find theme songs, background beds, and hits pre-cleared for television and radio broadcast without copyright takedowns.',
        highlight: 'Instant cue sheets and broadcast clearance',
      },
      {
        title: 'Manage Audio Ads & Jingles',
        badge: 'Ad Management',
        tab: 'corporate-ads',
        targetSelector: '[data-tour="nav-corporate-ads"]',
        description: 'Schedule, traffic, and report on brand commercials and sponsor announcements playing on your broadcast channels.',
        highlight: 'Accurate play counts and advertiser reports',
      },
    ],
  },

  affiliate: {
    label: 'Ambassador & Affiliate',
    icon: RiCoinsFill,
    color: '#06b6d4',
    steps: [
      {
        title: 'Welcome to Partner Hub',
        badge: 'Partner Hub',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'Earn money by introducing artists, producers, and labels to TuneMavens. You earn every time they release music or license tracks.',
        highlight: 'Zero fees to join—start earning immediately',
      },
      {
        title: 'Your Personal Invite Link',
        badge: 'Invite Link',
        tab: 'affiliates',
        targetSelector: '[data-tour="nav-affiliates"]',
        description: 'Grab your unique referral link or QR code to share on Instagram, WhatsApp, TikTok, or at studio sessions.',
        highlight: 'Track every click and signup in real-time',
      },
      {
        title: 'Automatic Weekly Payouts',
        badge: 'Weekly Payouts',
        tab: 'split-cascade',
        targetSelector: '[data-tour="nav-split-cascade"]',
        description: 'Link your M-Pesa or bank account. Your commissions are sent directly to your phone every week automatically.',
        highlight: 'Fast mobile payouts with zero deductions',
      },
    ],
  },

  vc: {
    label: 'Tour Investor & LP',
    icon: RiFundsBoxFill,
    color: '#00f2fe',
    steps: [
      {
        title: 'Tour Capital & Live Music Finance',
        badge: 'Tour Finance',
        targetSelector: '[data-tour="sidebar-nav"]',
        description: 'Invest in live concert tours, artist showcases, and festival stages across Africa with complete financial transparency.',
        highlight: 'Direct investment in live music tours',
      },
      {
        title: 'Live Tour Opportunities',
        badge: 'Tour Facilities',
        tab: 'tours-vault',
        targetSelector: '[data-tour="nav-tours-vault"]',
        description: 'Review active live tours, projected returns, and real-time ticket sales velocity before committing capital.',
        highlight: 'Real-time ticket sales pacing and transparent budgets',
      },
      {
        title: 'Priority Repayment Waterfall',
        badge: 'Priority Returns',
        tab: 'split-cascade',
        targetSelector: '[data-tour="nav-split-cascade"]',
        description: 'Track incoming concert box office revenue. Your capital investment and returns are paid out first before other expenses.',
        highlight: 'Automated, senior-priority recoupment',
      },
    ],
  },

  consumer: {
    label: 'Fan & Music Listener',
    icon: RiHeadphoneFill,
    color: '#6366f1',
    steps: [
      {
        title: 'Welcome to TuneStream',
        badge: 'Hi-Fi Music',
        targetSelector: '[data-tour="consumer-sidebar"]',
        description: 'Experience studio-quality music streaming from your favorite African artists, completely free from monthly subscription fees.',
        highlight: 'Studio-quality audio for real music fans',
      },
      {
        title: 'Discover Mixes & Songs',
        badge: 'For You',
        tab: 'home',
        targetSelector: '[data-tour="nav-home"]',
        description: 'Explore handpicked African DJ mixes, trending songs, and fresh releases tailored to your musical taste.',
        highlight: 'Fresh music curated for you every day',
      },
      {
        title: 'Your Saved Collection',
        badge: 'My Library',
        tab: 'library',
        targetSelector: '[data-tour="nav-library"]',
        description: 'Access your favorite tracks, created playlists, and offline downloads in one easy place.',
        highlight: 'All your favorite songs kept safe',
      },
      {
        title: 'Send Love & Direct Artist Tips',
        badge: 'Support Artists',
        tab: 'tips',
        targetSelector: '[data-tour="nav-tips"]',
        description: 'Send instant tips directly to artists via M-Pesa or card. 100% of your tip goes straight into the artist’s pocket.',
        highlight: 'Direct support that artists actually receive',
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
        title: 'Credits & Reload System',
        badge: 'Wallet & Top-Ups',
        tab: 'home',
        targetSelector: '[data-tour="topbar-credits"]',
        description: 'Shows platform credit balances. Users buy credits using M-Pesa or credit card to pay for mastering and messaging without monthly commitments. Admins can inspect and test sandbox balances here.',
        highlight: 'Pay-as-you-go credits with zero monthly subscriptions',
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
                rx="8"
                ry="8"
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
            borderRadius: '8px',
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
          borderRadius: '12px',
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
                borderRadius: '5px',
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
                borderRadius: '4px',
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
                borderRadius: '4px',
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
                borderRadius: '2px',
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
              borderRadius: '0 6px 6px 0',
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
              borderRadius: '4px',
              transition: 'color 0.15s ease',
            }}
            data-testid="dashboard-tour-end-btn"
          >
            ✕ End Tour
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirst}
              style={{
                background: '#1e293b',
                color: isFirst ? '#475569' : '#e2e8f0',
                border: '1px solid #334155',
                borderRadius: '6px',
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
                borderRadius: '6px',
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
