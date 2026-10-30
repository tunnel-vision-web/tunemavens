import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  RiBarChartFill, 
  RiGlobalFill, 
  RiStackFill, 
  RiBankCardFill, 
  RiLayoutMasonryFill, 
  RiGroupFill, 
  RiDatabase2Fill,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiCheckDoubleFill,
  RiPlayFill,
  RiUploadCloud2Line,
  RiMailSendFill,
  RiMusic2Fill,
  RiShieldCheckFill,
  RiSparklingFill,
  RiCompass3Fill,
  RiMoneyDollarCircleFill
} from 'react-icons/ri'
import { useRegion } from '../../RegionContext.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
// SmartCrmStudioPanel unified inside DashboardView CrmPanel
import CatalogueWizard from '../../components/CatalogueWizard.jsx'
import MpesaPosTerminal from '../../components/demos/MpesaPosTerminal.jsx'
import SplitCascadeLedgerApp from '../../components/demos/SplitCascadeLedgerApp.jsx'
import DistributionTrackerApp from '../../components/demos/DistributionTrackerApp.jsx'
import HostingManagerApp from '../../components/demos/HostingManagerApp.jsx'
import ComingSoonApp from '../../components/demos/ComingSoonApp.jsx'

import headerAppsImg from '../../assets/images/header_apps.png'
import headerAppsWesternImg from '../../assets/images/header_apps_western.png'
import perfectForHeaderImg from '../../assets/images/perfect_for_header.png'
import userManagerImg from '../../assets/images/user_manager.png'
import publishingMockupImg from '../../assets/images/publishing_dashboard_mockup.png'
import appsLedgerImg from '../../assets/images/apps_ledger.png'
import headerPricingImg from '../../assets/images/header_pricing.png'
import headerPricingWesternImg from '../../assets/images/header_pricing_western.png'
import heroMusic4Img from '../../assets/images/hero_music_4.png'
import distributeHeroImg from '../../assets/images/distribute_hero.png'

import './AppsView.css'

export default function AppsView({ sessionUser }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialApp = searchParams.get('app');
  const [activeApp, setActiveApp] = useState(initialApp || null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const a = params.get('app');
    if (a) {
      setActiveApp(a);
    }
  }, [location.search]);
  const { country } = useRegion();

  const isEastAfrica = ['KE', 'UG', 'TZ'].includes(country);
  const posName = country === 'KE' ? 'M-Pesa POS Terminal' 
                 : (country === 'NG' ? 'Flutterwave POS Terminal' 
                 : (isEastAfrica ? 'Mobile Money POS Terminal' : 'Stripe POS Terminal'));
                 
  const posShort = country === 'KE' ? 'M-Pesa STK & Card POS' : (isEastAfrica ? 'Mobile Money POS' : 'Contactless Card POS');

  const apps = [
    { 
      id: 'epk-builder', 
      name: 'EPK Builder Studio',
      tag: 'Creator Showcase',
      icon: RiLayoutMasonryFill, 
      accent: 'var(--cyan)',
      dashboardUrl: '/dashboard?tab=epk-builder&role=creator',
      actionLabel: 'Launch EPK Studio',
      lead: 'Interactive Electronic Press Kit studio, theme visualizer, bio editor, and standalone web world publisher.',
      paragraphs: [
        'Replace static PDF press kits and fragmented Dropbox links with a dynamic, living web destination built to capture the attention of festival bookers, A&R scouts, and press editors.',
        'Seamlessly combine lossless 60fps audio waveform players, verified tour dates, downloadable technical riders, high-resolution photo galleries, and video showreels into a responsive digital press kit that loads instantly across all desktop and mobile devices.'
      ],
      bullets: [
        'Dynamic Theme & Typography Studio: Switch between neo-brutalist, editorial dark-mode, and minimalist aesthetics with real-time CSS layout preview.',
        'Lossless Hi-Fi Audio Scrubber: Embed unreleased singles, track stems, and pre-release teasers with scrubbable 60fps waveforms and synced lyrics.',
        'Direct Promoter Booking Engine: Built-in contact and technical rider request forms with instant SMS and email routing to your management.',
        'Apex Custom Domain Routing: Deploy instantly to your custom domain or artistname.tunemavens.com with free automatic SSL certificates.',
        'Press Engagement Analytics: Track media link opens, audio stream duration, and asset downloads in real time.'
      ],
      live: true 
    },
    { 
      id: 'crm', 
      name: 'Smart CRM & Audience Engine', 
      tag: 'Audience Intelligence',
      icon: RiGroupFill, 
      accent: '#10b981',
      dashboardUrl: '/dashboard?tab=crm&role=creator',
      actionLabel: 'Open Smart CRM',
      lead: 'Fan relationship management, VIP subscriber lists, direct email messaging, and tour booking conversion.',
      paragraphs: [
        'Reclaim direct ownership of your listener base and liberate your audience relationships from the whims of volatile social media algorithms.',
        'Consolidate fan contact data from single pre-saves, streaming tips, tour ticket purchases, and merchandise checkouts into a unified, high-converting audience relationship engine built for predictable release campaigns.'
      ],
      bullets: [
        'First-Party Fan Data Ownership: Store verified fan emails, phone numbers, and location points with 100% data portability and zero algorithmic throttling.',
        'Geo-Targeted Tour & Event Alerts: Broadcast localized tour dates and exclusive pre-sale ticket codes directly to fans in specific tour cities.',
        'Automated Superfan Segmentation: Rank listeners into tiered cohorts based on tip volume, merch spending, and repeat streaming frequency.',
        'High-Deliverability Broadcast Engine: Send aesthetic HTML newsletter campaigns and single announcement blasts with industry-topping 99.4% inbox delivery.',
        'Automated Welcome & Birthday Sequences: Engage new subscribers with exclusive bonus tracks, rehearsal footage, and merch discounts on autopilot.'
      ],
      live: true 
    },
    { 
      id: 'catalogue-machine', 
      name: 'Catalogue Machine & Release Engine', 
      tag: 'Catalog Operations',
      icon: RiDatabase2Fill, 
      accent: '#a855f7',
      dashboardUrl: '/dashboard?tab=catalog&mode=wizard&role=label',
      actionLabel: 'Open Ingestion Engine',
      lead: 'Central discography & release management, stem archives, bulk CSV roster ingestion, and metadata synchronization.',
      paragraphs: [
        'Transform catalog chaos into a pristine, production-ready ingestion pipeline engineered to manage and syndicate hundreds of master recordings effortlessly.',
        'Eliminate metadata errors and rejected DSP deliveries. Validate ISRC codes, mechanical credits, and songwriter percentages across TuneMavens, TuneStream, and the SyncMavens sync licensing marketplace in a single unified workflow.'
      ],
      bullets: [
        'Bulk CSV & Roster Ingestion: Ingest extensive artist rosters, back catalogs, and legacy distributor spreadsheets in seconds without losing songwriter credits.',
        'Authoritative ISRC & ISWC Registry: Automatically assign, validate, and register unique ISRC codes and performance rights organization identifiers.',
        '24-Bit Lossless Stem & Master Vault: Securely store uncompressed WAV masters, instrumental cuts, acapellas, and separated stem packs with bank-grade redundancy.',
        'One-Click Sync Marketplace Syndication: Push pre-cleared master tracks directly into SyncMavens for prime television, film, and commercial licensing placements.',
        'Automated 100% Split Validation: Ensure all publishing, recording, and collaborator split splits tally to exactly 100% before triggering global distribution.'
      ],
      live: true 
    },
    { 
      id: 'ledger', 
      name: 'Split Cascade Ledger', 
      tag: 'Royalty Accounting',
      icon: RiStackFill, 
      accent: 'var(--cyan)',
      dashboardUrl: '/dashboard?tab=splits&role=creator',
      actionLabel: 'Open Split Ledger',
      lead: 'Configure collaborator splits, load bulk statement spreadsheets, and automate recoupment accounting down to the cent.',
      paragraphs: [
        'Collaborative music production creates complex payout structures that traditional accounting spreadsheets cannot handle without error and delays.',
        'The Split Cascade Ledger automates multi-party revenue distribution, tiered recoupment hurdles, and cross-border currency disbursements, ensuring producers, session vocalists, and label partners are paid accurately and on time.'
      ],
      bullets: [
        'Tiered Recoupment Cascades: Automatically prioritize the repayment of upfront recording advances, marketing budgets, and video production costs before net royalties disburse.',
        'Collaborator Self-Service Access: Provide songwriters, featured artists, and engineers with view-only portal links to review live statement balances and transparent deductions.',
        'Bulk DSP Statement Ingestion: Ingest monthly CSV and XLSX statements from major digital distributors and streaming platforms with automated track reconciliation.',
        'Multi-Currency Disbursal Engine: Disburse earnings in USD, EUR, GBP, or localized African Mobile Money (M-Pesa, Airtel Money) with zero manual conversion hassle.',
        'Immutable Financial Audit Trails: Maintain cryptographic transaction logs and generate ready-to-file annual tax statements with one click.'
      ],
      live: true 
    },
    { 
      id: 'pos', 
      name: posName, 
      tag: 'Live Event Commerce',
      icon: RiBankCardFill, 
      accent: '#10b981',
      dashboardUrl: '/dashboard?tab=pos-terminal&role=label',
      actionLabel: 'Open POS Terminal',
      lead: `${posShort}: Collect on-site merchant card, contactless, and mobile money payments during tours and concerts.`,
      paragraphs: [
        'Transform any smartphone, tablet, or laptop into a fast, reliable point-of-sale terminal optimized specifically for merchandise booths, venue door admissions, and tour activations.',
        'Tailored to your operating region, this terminal accepts instant contactless cards, Apple Pay, Google Pay, and localized mobile money rails (including instant M-Pesa STK Push in East Africa) with automated inventory synchronization and direct revenue routing.'
      ],
      bullets: [
        'Omni-Channel Payment Acceptance: Process tap-to-pay credit/debit cards, Apple Pay, Google Pay, and instant regional mobile money transactions on the spot.',
        'Offline-Resilient Transaction Buffer: Continue selling merchandise even in basement venues with zero cellular reception; sales securely sync once back online.',
        'Real-Time Live Inventory Sync: Track vinyl records, hoodies, t-shirts, and posters live across multiple venue merch booths simultaneously to prevent overselling.',
        'Direct Split Ledger Pipeline: Funnel live show revenues directly into your Split Cascade Ledger for immediate end-of-night crew and artist split payouts.',
        'Instant SMS & Email Receipts: Capture fan contact details right at checkout, expanding your Smart CRM subscriber list with every single live purchase.'
      ],
      live: true 
    },
    { 
      id: 'tracker', 
      name: 'Distribution Tracker', 
      tag: 'Global Delivery Radar',
      icon: RiBarChartFill, 
      accent: '#f59e0b',
      dashboardUrl: '/dashboard?tab=distribution-tracker&role=creator',
      actionLabel: 'Open Distribution Tracker',
      lead: 'Monitor real-time ingest status, editorial submission deadlines, and storefront delivery across 150+ DSPs.',
      paragraphs: [
        'Remove the guesswork and uncertainty from your release cycle with an authoritative radar dashboard that tracks every single step of your music delivery pipeline.',
        'From initial audio file validation and fingerprint registration to live storefront delivery on Spotify, Apple Music, Tidal, Amazon Music, and TikTok, monitor your ingestion milestones with full transparency and instant rejection diagnostics.'
      ],
      bullets: [
        'Multi-Platform Delivery Radar: Track scheduled delivery, ingestion validation, and live storefront links across 150+ global streaming platforms in real time.',
        'Editorial Playlist Submission Timer: Keep track of critical 7-day and 14-day editorial playlist pitching windows with automated reminder notifications.',
        'ISRC & Audio Fingerprint Verification: Verify that Shazam acoustic fingerprinting and YouTube Content ID claiming are properly registered prior to launch.',
        'Coordinated Global Midnight Rollouts: Configure synchronous worldwide releases or localized midnight drops tailored by international time zones.',
        'Immediate Rejection Diagnostics: Receive real-time, actionable alerts on cover art dimension errors, metadata formatting mismatches, or audio clipping flags.'
      ],
      live: true 
    },
    { 
      id: 'hosting', 
      name: 'Hosting & Domain Manager', 
      tag: 'Cloud Infrastructure',
      icon: RiGlobalFill, 
      accent: '#3b82f6',
      dashboardUrl: '/dashboard?tab=hosting-manager&role=creator',
      actionLabel: 'Open Domain Manager',
      lead: 'Register custom domain names, configure DNS zone settings, and deploy high-performance modular web containers.',
      paragraphs: [
        'Your artist web presence should not be constrained by brittle site builders that impose severe bandwidth caps or crash during viral release traffic spikes.',
        'The Hosting & Domain Manager gives creators, management companies, and record labels enterprise-grade web hosting infrastructure, optimized specifically for fast-loading media assets, tour announcement surges, and high-conversion e-commerce.'
      ],
      bullets: [
        'Automated Custom Domain Linking: Connect apex domain names (.com, .io, .music, .ke) with automated DNS propagation and free auto-renewing SSL certificates.',
        'Global Edge CDN Acceleration: Cache and deliver high-resolution artwork, press kits, and lossless audio streams from over 270 edge nodes worldwide for ultra-fast loading.',
        'Traffic Spike & DDOS Mitigation: Effortlessly withstand viral TikTok traffic surges and ticket drop stampedes without downtime or extra bandwidth fees.',
        'One-Click Automated Backups: Protect your artist website, tour announcements, and fan forms with automated daily snapshots and instant point-in-time rollbacks.',
        'Comprehensive DNS Zone Management: Configure professional custom email routing (MX records), store integrations (CNAMEs), and verification records seamlessly.'
      ],
      live: true 
    },
  ];

  // 1. Interactive EPK Builder Studio Sub-View
  if (activeApp === 'epk-builder') {
    const appData = apps.find(a => a.id === 'epk-builder');
    return (
      <>
        <PageHeader title="EPK Builder Studio" bgImage={perfectForHeaderImg} breadcrumb="EPK Builder" />
        <div className="container" style={{ paddingBottom: '96px', marginTop: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={() => setActiveApp(null)} 
              className="btn-secondary" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
            >
              <RiArrowLeftLine size={16} /> Back to Dashboard Apps
            </button>
          </div>

          <div className="subapp-overview-card" style={{ borderColor: 'rgba(34, 211, 238, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
              <div>
                <span className="subapp-tag" style={{ color: 'var(--cyan)' }}>Standalone Creator Application</span>
                <h2 className="subapp-title">Interactive Electronic Press Kit Studio</h2>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link 
                  to="/dashboard?tab=epk-builder&role=creator" 
                  className="btn-primary" 
                  style={{ padding: '10px 22px', fontSize: '13px' }}
                >
                  Launch EPK Studio in Dashboard <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
                </Link>
                <Link to="/for/creator" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
                  Creator Hub
                </Link>
              </div>
            </div>
            
            <p className="subapp-p">
              The TuneMavens EPK Builder Studio is an end-to-end digital press kit creator engineered specifically for independent artists, producers, and managers who need to stand out to festival talent buyers, label A&amp;Rs, music supervisors, and journalists. Static PDF press kits are frequently ignored, suffer from broken links, and fail to adapt to mobile screens.
            </p>
            <p className="subapp-p">
              With our interactive studio, your press kit becomes an immersive, living web destination featuring 60fps audio waveform scrubbers, embeddable stem auditioning, synchronized tour itineraries, downloadable high-resolution photo assets, technical stage plots, and direct booking request forms.
            </p>

            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', margin: '0 0 16px', fontFamily: 'Sansation, sans-serif' }}>
              Core Features &amp; Strategic Benefits
            </h3>
            <ul className="subapp-bullets-list">
              {appData.bullets.map((b, i) => (
                <li key={i}>
                  <RiCheckDoubleFill size={18} style={{ color: 'var(--cyan)' }} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginTop: '32px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: 'var(--cyan)', marginBottom: '10px' }}><RiLayoutMasonryFill size={24} /></div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Visual Theme Studio</h4>
                <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.6 }}>
                  Customize typography, color palettes, dark-mode themes, and custom banner layouts with real-time responsive preview.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#10b981', marginBottom: '10px' }}><RiMusic2Fill size={24} /></div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Lossless Player Embed</h4>
                <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.6 }}>
                  Embed 60fps audio waveform scrubbers with stem auditioning, unreleased single pre-saves, and synced liner notes.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#f59e0b', marginBottom: '10px' }}><RiGlobalFill size={24} /></div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Custom Domain Routing</h4>
                <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.6 }}>
                  Deploy to your own custom domain or tunemavens.com subdomains with automated SSL, DNS sync, and 0% downtime.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky CTA Bar for EPK Builder */}
          <div className="sticky-app-cta-bar">
            <div className="cta-meta">
              <div className="cta-pulse-dot" style={{ background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan)' }} />
              <div>
                <h4 className="cta-title">Ready to build your interactive press kit?</h4>
                <p className="cta-sub">Design, customize, and publish your professional EPK in under 10 minutes.</p>
              </div>
            </div>
            <div className="cta-actions">
              <Link 
                to="/dashboard?tab=epk-builder&role=creator" 
                className="btn-primary" 
                style={{ padding: '10px 22px', fontSize: '13px' }}
              >
                Launch EPK Studio in Dashboard <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
              </Link>
              <Link to="/for/creator" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px' }}>
                Creator Hub
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 2. Interactive Smart CRM Sub-View (Native TuneMavens CRM)
  if (activeApp === 'crm') {
    const appData = apps.find(a => a.id === 'crm');
    return (
      <>
        <PageHeader title="Smart CRM & Audience Engine" bgImage={userManagerImg} breadcrumb="Smart CRM" />
        <div className="container" style={{ paddingBottom: '96px', marginTop: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={() => setActiveApp(null)} 
              className="btn-secondary" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
            >
              <RiArrowLeftLine size={16} /> Back to Dashboard Apps
            </button>
          </div>

          <div className="subapp-overview-card" style={{ borderColor: 'rgba(16, 185, 129, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
              <div>
                <span className="subapp-tag" style={{ color: '#10b981' }}>Audience Intelligence &amp; Retention</span>
                <h2 className="subapp-title">Smart CRM &amp; Fan Relationship Engine</h2>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link 
                  to="/dashboard?tab=crm&role=creator" 
                  className="btn-primary" 
                  style={{ padding: '10px 22px', fontSize: '13px', background: '#10b981' }}
                >
                  Open Smart CRM in Dashboard <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
                </Link>
                <Link to="/for/creator" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
                  Creator Solutions
                </Link>
              </div>
            </div>
            
            <p className="subapp-p">
              Relying on social media algorithms to reach your fans means paying to reach followers you already earned. The TuneMavens Smart CRM returns complete ownership of your fan database to you and your management team. Every single pre-save campaign, merchandise order, ticket reservation, and streaming tip flows into a centralized, searchable audience vault.
            </p>
            <p className="subapp-p">
              Segment your listeners by geographical location to sell out local tour dates, reward your top 5% superfans with private Discord or listening session invites, and trigger automated drip email campaigns that achieve industry-leading deliverability and conversion rates.
            </p>

            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', margin: '0 0 16px', fontFamily: 'Sansation, sans-serif' }}>
              Key Operational Capabilities &amp; Benefits
            </h3>
            <ul className="subapp-bullets-list">
              {appData.bullets.map((b, i) => (
                <li key={i}>
                  <RiCheckDoubleFill size={18} style={{ color: '#10b981' }} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* KPI Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '32px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px 20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '11px', color: 'var(--mu)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Total Fan Contacts</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>2,840</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px 20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '11px', color: 'var(--mu)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>VIP Tippers &amp; Buyers</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>418</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px 20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '11px', color: 'var(--mu)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Email Open Rate</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--cyan)' }}>74.2%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px 20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '11px', color: 'var(--mu)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Direct Revenue Flow</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#a855f7' }}>100% Direct</span>
              </div>
            </div>
          </div>

          {/* Smart CRM Architecture & Capabilities Showcase */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '32px', marginBottom: '36px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color: '#10b981', marginBottom: '12px' }}><RiMailSendFill size={26} /></div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Omnichannel Fan Broadcasts</h4>
              <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.6 }}>
                Reach your superfans directly through verified WhatsApp business messages, SMS alert gateways, and branded HTML newsletters with 99.4% deliverability.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color: 'var(--cyan)', marginBottom: '12px' }}><RiGroupFill size={26} /></div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Superfan Tiering &amp; Segmentation</h4>
              <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.6 }}>
                Automatically rank listeners by merchandise orders, streaming tips, and tour ticket purchases to unlock exclusive listening sessions and VIP passes.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color: '#a855f7', marginBottom: '12px' }}><RiCompass3Fill size={26} /></div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Tour Geo-Alerts &amp; Direct Booking</h4>
              <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.6 }}>
                Send location-targeted pre-sale codes directly to fans in upcoming tour cities while managing talent buyer and booking agent inquiries in one pipeline.
              </p>
            </div>
          </div>

          {/* Sticky CTA Bar for Smart CRM */}
          <div className="sticky-app-cta-bar">
            <div className="cta-meta">
              <div className="cta-pulse-dot" style={{ background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              <div>
                <h4 className="cta-title">Activate your direct fan database within TuneMavens</h4>
                <p className="cta-sub">Sync contacts, broadcast pre-sale announcements, and grow your subscriber base with zero algorithmic throttling.</p>
              </div>
            </div>
            <div className="cta-actions">
              <Link 
                to="/dashboard?tab=crm&role=creator" 
                className="btn-primary" 
                style={{ padding: '10px 22px', fontSize: '13px', background: '#10b981' }}
              >
                Open Smart CRM in Dashboard <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
              </Link>
              <Link to="/for/creator" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px' }}>
                Creator Solutions
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 3. Interactive Catalogue Machine Sub-View (Native TuneMavens Ingestion Engine)
  if (activeApp === 'catalogue-machine') {
    const appData = apps.find(a => a.id === 'catalogue-machine');
    return (
      <>
        <PageHeader title="Catalogue Machine & Release Engine" bgImage={publishingMockupImg} breadcrumb="Catalogue Machine" />
        <div className="container" style={{ paddingBottom: '96px', marginTop: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={() => setActiveApp(null)} 
              className="btn-secondary" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
            >
              <RiArrowLeftLine size={16} /> Back to Dashboard Apps
            </button>
          </div>

          <div className="subapp-overview-card" style={{ borderColor: 'rgba(168, 85, 247, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
              <div>
                <span className="subapp-tag" style={{ color: '#a855f7' }}>Catalog Operations &amp; Roster Management</span>
                <h2 className="subapp-title">Catalogue Machine &amp; Release Engine</h2>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link 
                  to="/dashboard?tab=catalog&mode=wizard&role=label" 
                  className="btn-primary" 
                  style={{ padding: '10px 22px', fontSize: '13px', background: '#a855f7' }}
                >
                  Open Ingestion Engine in Dashboard <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
                </Link>
                <Link 
                  to="/dashboard?tab=catalog&role=label" 
                  className="btn-secondary" 
                  style={{ padding: '10px 20px', fontSize: '13px' }}
                >
                  Open Catalog Manager
                </Link>
              </div>
            </div>
            
            <p className="subapp-p">
              Managing large discographies across diverse rosters requires rigorous metadata hygiene and flawless track ingestion. The Catalogue Machine transforms fragmented spreadsheets and scattered audio drives into an authoritative, cloud-based catalog operations center.
            </p>
            <p className="subapp-p">
              Upload hundreds of songs via automated CSV parsing, generate and verify standard ISRC and ISWC identifiers, store 24-bit lossless masters with separated stems, and syndicate vetted titles into SyncMavens for prime television, film, advertising, and video game sync placements.
            </p>

            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', margin: '0 0 16px', fontFamily: 'Sansation, sans-serif' }}>
              Strategic Capabilities &amp; Catalog Benefits
            </h3>
            <ul className="subapp-bullets-list">
              {appData.bullets.map((b, i) => (
                <li key={i}>
                  <RiCheckDoubleFill size={18} style={{ color: '#a855f7' }} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Ingestion Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginTop: '32px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#a855f7', marginBottom: '10px' }}><RiUploadCloud2Line size={24} /></div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Bulk CSV Roster Ingest</h4>
                <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.6 }}>
                  Parse master distributor statement spreadsheets and catalog CSV files in seconds with zero loss of track credits.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: 'var(--cyan)', marginBottom: '10px' }}><RiDatabase2Fill size={24} /></div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>ISRC &amp; Metadata Registry</h4>
                <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.6 }}>
                  Automated generation and verification of unique ISRC codes, PRO registrations, and acoustic genre tags.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#10b981', marginBottom: '10px' }}><RiShieldCheckFill size={24} /></div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Lossless Master &amp; Stem Vault</h4>
                <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.6 }}>
                  Secure, encrypted storage for uncompressed 24-bit studio masters, separated stem packs, and high-res cover art.
                </p>
              </div>
            </div>
          </div>

          {/* Embedded Native TuneMavens Ingestion Engine / Catalogue Wizard */}
          <div id="ingestion-engine" style={{ marginTop: '36px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#a855f7', display: 'block', marginBottom: '4px' }}>
                  TuneMavens Release Console
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Sansation, sans-serif' }}>
                  Live Catalogue Release &amp; Ingestion Engine
                </h3>
              </div>
              <span style={{ fontSize: '12px', color: '#a855f7', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#a855f7', display: 'inline-block' }}></span>
                Live Ingestion App
              </span>
            </div>
            <div style={{ background: '#090d1f', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '3px', padding: '24px' }}>
              <CatalogueWizard 
                sessionUser={sessionUser}
                creatorEpk={{}}
                onIngestComplete={() => alert('Release and tracks successfully ingested into TuneMavens catalogue!')}
              />
            </div>
          </div>

          {/* Sticky CTA Bar for Catalogue Machine */}
          <div className="sticky-app-cta-bar">
            <div className="cta-meta">
              <div className="cta-pulse-dot" style={{ background: '#a855f7', boxShadow: '0 0 10px #a855f7' }} />
              <div>
                <h4 className="cta-title">Automate your label catalog ingestion</h4>
                <p className="cta-sub">Validate ISRC identifiers, upload stem archives, and syndicate tracks into SyncMavens.</p>
              </div>
            </div>
            <div className="cta-actions">
              <Link 
                to="/dashboard?tab=catalog&mode=wizard&role=label" 
                className="btn-primary" 
                style={{ padding: '10px 22px', fontSize: '13px', background: '#a855f7' }}
              >
                Open Ingestion Engine in Dashboard <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
              </Link>
              <Link 
                to="/dashboard?tab=catalog&role=label" 
                className="btn-secondary" 
                style={{ padding: '10px 18px', fontSize: '13px' }}
              >
                Open Catalog Manager
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 4. POS Terminal Sub-View
  if (activeApp === 'pos') {
    const appData = apps.find(a => a.id === 'pos');
    return (
      <>
        <PageHeader title={posName} bgImage={headerPricingImg} bgImageWestern={headerPricingWesternImg} breadcrumb="POS Terminal" />
        <div className="container" style={{ paddingBottom: '96px', marginTop: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={() => setActiveApp(null)} 
              className="btn-secondary" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
            >
              <RiArrowLeftLine size={16} /> Back to Dashboard Apps
            </button>
          </div>

          <div className="subapp-overview-card" style={{ borderColor: 'rgba(16, 185, 129, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
              <div>
                <span className="subapp-tag" style={{ color: '#10b981' }}>Live Venue &amp; Tour Commerce</span>
                <h2 className="subapp-title">{posName}</h2>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/dashboard?tab=pos-terminal&role=label" className="btn-primary" style={{ padding: '10px 22px', fontSize: '13px', background: '#10b981' }}>
                  Open POS Terminal in Dashboard <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
                </Link>
                <Link to="/for/label" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
                  Venue Specs
                </Link>
              </div>
            </div>
            
            <p className="subapp-p">
              Live concerts, festival appearances, and pop-up merch booths are vital revenue drivers for modern touring acts. However, live sales frequently suffer from patchy cellular connections, physical cash handling security risks, and tedious end-of-night reconciliations.
            </p>
            <p className="subapp-p">
              The TuneMavens POS Terminal provides an agile, browser-based point of sale that runs effortlessly on phones, tablets, and laptops. Tailored to your local market, it processes tap-to-pay cards, Apple Pay, Google Pay, and instant Mobile Money STK pushes. Best of all, every transaction reconciles directly into your Split Cascade Ledger in real time.
            </p>

            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', margin: '0 0 16px', fontFamily: 'Sansation, sans-serif' }}>
              Operational Highlights &amp; Commerce Benefits
            </h3>
            <ul className="subapp-bullets-list">
              {appData.bullets.map((b, i) => (
                <li key={i}>
                  <RiCheckDoubleFill size={18} style={{ color: '#10b981' }} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive POS Component */}
          <MpesaPosTerminal goBack={() => setActiveApp(null)} />

          {/* Sticky CTA Bar for POS Terminal */}
          <div className="sticky-app-cta-bar">
            <div className="cta-meta">
              <div className="cta-pulse-dot" style={{ background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              <div>
                <h4 className="cta-title">Activate live point of sale for your next show</h4>
                <p className="cta-sub">Process contactless payments, track inventory, and settle splits automatically.</p>
              </div>
            </div>
            <div className="cta-actions">
              <Link 
                to="/dashboard?tab=pos-terminal&role=label" 
                className="btn-primary" 
                style={{ padding: '10px 22px', fontSize: '13px', background: '#10b981' }}
              >
                Open POS Terminal in Dashboard <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
              </Link>
              <Link to="/for/label" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px' }}>
                Venue Specs
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 5. Split Cascade Ledger Sub-View
  if (activeApp === 'ledger') {
    const appData = apps.find(a => a.id === 'ledger');
    return (
      <>
        <PageHeader title="Split Cascade Ledger" bgImage={appsLedgerImg} breadcrumb="Ledger App" />
        <div className="container" style={{ paddingBottom: '96px', marginTop: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={() => setActiveApp(null)} 
              className="btn-secondary" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
            >
              <RiArrowLeftLine size={16} /> Back to Dashboard Apps
            </button>
          </div>

          <div className="subapp-overview-card" style={{ borderColor: 'rgba(34, 211, 238, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
              <div>
                <span className="subapp-tag" style={{ color: 'var(--cyan)' }}>Financial Engineering &amp; Royalties</span>
                <h2 className="subapp-title">Split Cascade Ledger &amp; Recoupment Engine</h2>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/dashboard?tab=splits&role=creator" className="btn-primary" style={{ padding: '10px 22px', fontSize: '13px' }}>
                  Open Split Ledger in Dashboard <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
                </Link>
                <Link to="/for/label" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
                  Split Sheet Specs
                </Link>
              </div>
            </div>
            
            <p className="subapp-p">
              Collaborative music releases involve intricate agreements between primary artists, featured vocalists, beat producers, recording studios, and executive investors. Tracking these obligations across varying DSP statement formats and currencies is prone to human error and accounting disputes.
            </p>
            <p className="subapp-p">
              The Split Cascade Ledger introduces automated waterfall accounting. Define advance recoupment thresholds so initial expenses are settled first. Once cleared, incoming royalties cascade seamlessly to all participants according to verified split percentages, complete with self-service collaborator statement dashboards.
            </p>

            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', margin: '0 0 16px', fontFamily: 'Sansation, sans-serif' }}>
              Financial Features &amp; Accounting Benefits
            </h3>
            <ul className="subapp-bullets-list">
              {appData.bullets.map((b, i) => (
                <li key={i}>
                  <RiCheckDoubleFill size={18} style={{ color: 'var(--cyan)' }} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Split Cascade Ledger Component */}
          <SplitCascadeLedgerApp goBack={() => setActiveApp(null)} />

          {/* Sticky CTA Bar for Split Cascade Ledger */}
          <div className="sticky-app-cta-bar">
            <div className="cta-meta">
              <div className="cta-pulse-dot" style={{ background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan)' }} />
              <div>
                <h4 className="cta-title">Automate your release recoupment &amp; splits</h4>
                <p className="cta-sub">Transparent waterfall accounting, multi-currency payouts, and zero accounting disputes.</p>
              </div>
            </div>
            <div className="cta-actions">
              <Link 
                to="/dashboard?tab=splits&role=creator" 
                className="btn-primary" 
                style={{ padding: '10px 22px', fontSize: '13px' }}
              >
                Open Split Ledger in Dashboard <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
              </Link>
              <Link to="/for/label" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px' }}>
                Split Sheet Specs
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 6. Distribution Tracker Sub-View
  if (activeApp === 'tracker') {
    const appData = apps.find(a => a.id === 'tracker');
    return (
      <>
        <PageHeader title="Distribution Tracker" bgImage={heroMusic4Img} breadcrumb="Distribution Tracker" />
        <div className="container" style={{ paddingBottom: '96px', marginTop: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={() => setActiveApp(null)} 
              className="btn-secondary" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
            >
              <RiArrowLeftLine size={16} /> Back to Dashboard Apps
            </button>
          </div>

          <div className="subapp-overview-card" style={{ borderColor: 'rgba(245, 158, 11, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
              <div>
                <span className="subapp-tag" style={{ color: '#f59e0b' }}>Real-Time Ingestion Radar</span>
                <h2 className="subapp-title">Distribution Tracker &amp; Store Delivery Radar</h2>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/dashboard?tab=distribution-tracker&role=creator" className="btn-primary" style={{ padding: '10px 22px', fontSize: '13px', background: '#f59e0b', color: '#090d1f' }}>
                  Open Distribution Tracker in Dashboard <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
                </Link>
                <Link to="/for/creator" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
                  Distribution Specs
                </Link>
              </div>
            </div>
            
            <p className="subapp-p">
              Releasing music to over 150 digital service providers (DSPs) requires absolute transparency. Without real-time status reporting, artists and managers are left wondering if audio files have cleared DSP QC checks or if editorial pitch deadlines have passed.
            </p>
            <p className="subapp-p">
              The TuneMavens Distribution Tracker provides a single radar screen displaying every phase of your release ingestion pipeline. Track QC approvals, live store URL indexing, YouTube Content ID registration, and editorial countdowns with instant notifications if any file fails validation.
            </p>

            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', margin: '0 0 16px', fontFamily: 'Sansation, sans-serif' }}>
              Monitoring Capabilities &amp; Release Benefits
            </h3>
            <ul className="subapp-bullets-list">
              {appData.bullets.map((b, i) => (
                <li key={i}>
                  <RiCheckDoubleFill size={18} style={{ color: '#f59e0b' }} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Distribution Tracker Component */}
          <DistributionTrackerApp goBack={() => setActiveApp(null)} sessionUser={sessionUser} />

          {/* Sticky CTA Bar for Distribution Tracker */}
          <div className="sticky-app-cta-bar">
            <div className="cta-meta">
              <div className="cta-pulse-dot" style={{ background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} />
              <div>
                <h4 className="cta-title">Monitor your releases across 150+ global DSPs</h4>
                <p className="cta-sub">Real-time QC validation, editorial pitch deadlines, and live storefront links.</p>
              </div>
            </div>
            <div className="cta-actions">
              <Link 
                to="/dashboard?tab=distribution-tracker&role=creator" 
                className="btn-primary" 
                style={{ padding: '10px 22px', fontSize: '13px', background: '#f59e0b', color: '#090d1f' }}
              >
                Open Distribution Tracker in Dashboard <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
              </Link>
              <Link to="/for/creator" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px' }}>
                Distribution Specs
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 7. Hosting Manager Sub-View
  if (activeApp === 'hosting') {
    const appData = apps.find(a => a.id === 'hosting');
    return (
      <>
        <PageHeader title="Hosting Manager" bgImage={distributeHeroImg} breadcrumb="Hosting Manager" />
        <div className="container" style={{ paddingBottom: '96px', marginTop: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={() => setActiveApp(null)} 
              className="btn-secondary" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
            >
              <RiArrowLeftLine size={16} /> Back to Dashboard Apps
            </button>
          </div>

          <div className="subapp-overview-card" style={{ borderColor: 'rgba(59, 130, 246, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
              <div>
                <span className="subapp-tag" style={{ color: '#3b82f6' }}>High-Availability Cloud Infrastructure</span>
                <h2 className="subapp-title">Hosting &amp; Custom Domain Manager</h2>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/dashboard?tab=hosting-manager&role=creator" className="btn-primary" style={{ padding: '10px 22px', fontSize: '13px', background: '#3b82f6' }}>
                  Open Domain Manager in Dashboard <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
                </Link>
                <Link to="/for" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
                  Explore Solutions
                </Link>
              </div>
            </div>
            
            <p className="subapp-p">
              Artists and record labels require fast, resilient web hosting infrastructure capable of serving high-resolution artwork, audio streams, and handling viral traffic surges without crashing or incurring punitive bandwidth surcharges.
            </p>
            <p className="subapp-p">
              The Hosting &amp; Domain Manager allows you to register apex domains, configure one-click DNS records for email and merchandise stores, and deploy responsive web containers backed by a 270-node global content delivery network (CDN) with free, auto-renewing SSL certificates.
            </p>

            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', margin: '0 0 16px', fontFamily: 'Sansation, sans-serif' }}>
              Infrastructure Highlights &amp; Domain Benefits
            </h3>
            <ul className="subapp-bullets-list">
              {appData.bullets.map((b, i) => (
                <li key={i}>
                  <RiCheckDoubleFill size={18} style={{ color: '#3b82f6' }} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Hosting Manager Component */}
          <HostingManagerApp goBack={() => setActiveApp(null)} sessionUser={sessionUser} />

          {/* Sticky CTA Bar for Hosting Manager */}
          <div className="sticky-app-cta-bar">
            <div className="cta-meta">
              <div className="cta-pulse-dot" style={{ background: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }} />
              <div>
                <h4 className="cta-title">Deploy fast, resilient web infrastructure for your music</h4>
                <p className="cta-sub">Free automated SSL certificates, global edge CDN caching, and one-click DNS setup.</p>
              </div>
            </div>
            <div className="cta-actions">
              <Link 
                to="/dashboard?tab=hosting-manager&role=creator" 
                className="btn-primary" 
                style={{ padding: '10px 22px', fontSize: '13px', background: '#3b82f6' }}
              >
                Open Domain Manager in Dashboard <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
              </Link>
              <Link to="/for" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px' }}>
                Explore Solutions
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 8. Generic Coming Soon Sub-View Fallback
  if (activeApp) {
    const appName = apps.find(a => a.id === activeApp)?.name || 'Application';
    return (
      <>
        <PageHeader title={appName} bgImage={headerAppsImg} bgImageWestern={headerAppsWesternImg} breadcrumb={appName} />
        <div className="container" style={{ paddingBottom: '96px', marginTop: '40px' }}>
          <ComingSoonApp name={appName} goBack={() => setActiveApp(null)} sessionUser={sessionUser} />
        </div>
      </>
    );
  }

  // Main Standalone Apps Pool View
  return (
    <>
      <PageHeader 
        title="Standalone Apps Pool" 
        bgImage={headerAppsImg} 
        bgImageWestern={headerAppsWesternImg} 
        breadcrumb="Dashboard Apps" 
      />
      <div className="container" style={{ paddingBottom: '96px', marginTop: '40px' }}>
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '16px', maxWidth: '780px', margin: '0 auto 16px', fontSize: '16px', color: '#fff', lineHeight: 1.6, fontWeight: 600 }}>
          Modular, production-grade applications that connect seamlessly with your unified Intermaven profile, catalogue database, and credits vault.
        </p>
        <p style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px', fontSize: '14px', color: 'var(--mu)', lineHeight: 1.7 }}>
          Each standalone app operates as a specialized powerhouse for artist promotion, live commerce, audience intelligence, and multi-tier royalty accounting. Explore the features and operational benefits of each application below.
        </p>

        {/* Apps Grid - Clean Descriptions, No Bullets */}
        <div className="apps-grid-detailed">
          {apps.map((a) => {
            const Icon = a.icon;
            const accent = a.accent || 'var(--cyan)';
            return (
              <div 
                key={a.id} 
                className="app-card-detailed"
                style={{ '--app-accent': accent }}
              >
                <div className="app-header-row">
                  <div className="app-icon-badge" style={{ background: 'rgba(255,255,255,0.04)', color: accent }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <span className="app-badge-tag">{a.tag}</span>
                    <h3 className="app-name-title">{a.name}</h3>
                  </div>
                </div>

                {a.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="app-desc-p">{p}</p>
                ))}

                <div className="app-card-footer" style={{ flexDirection: 'column', gap: '12px', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                      Live Dashboard App
                    </span>
                    <button
                      onClick={() => {
                        setActiveApp(a.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                    >
                      View Specs
                    </button>
                  </div>
                  <Link
                    to={a.dashboardUrl}
                    className="btn-primary"
                    style={{ 
                      width: '100%',
                      textAlign: 'center',
                      padding: '10px 18px', 
                      fontSize: '13px', 
                      background: accent === '#f59e0b' ? '#f59e0b' : (accent === 'var(--cyan)' ? '#22d3ee' : accent),
                      color: accent === '#f59e0b' || accent === 'var(--cyan)' || accent === '#22d3ee' ? '#090d1f' : '#ffffff',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    Open in Dashboard <RiArrowRightLine size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Persistent Viewport Sticky CTA Bar on Main Apps Pool Page */}
        <div className="sticky-app-cta-bar">
          <div className="cta-meta">
            <div className="cta-pulse-dot" />
            <div>
              <h4 className="cta-title">Power your music business with TuneMavens Apps</h4>
              <p className="cta-sub">Access the complete ecosystem with one unified creator account and zero vendor lock-in.</p>
            </div>
          </div>
          <div className="cta-actions">
            <Link 
              to="/dashboard?role=creator" 
              className="btn-primary" 
              style={{ padding: '10px 22px', fontSize: '13px' }}
              data-testid="apps-open-tunemavens-dash-cta"
            >
              Open TuneMavens Dashboard <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
            </Link>
            <Link to="/for" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px' }}>
              Explore By Role
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
