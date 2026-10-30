import ConsumerBlogForumView from './components/community/ConsumerBlogForumView.jsx';
import ConsumerHelpDocsView from './components/community/ConsumerHelpDocsView.jsx';
import ConsumerSupportDeskView from './components/community/ConsumerSupportDeskView.jsx';
import ConsumerSupportCommunityView from './components/community/ConsumerSupportCommunityView.jsx';
import HiFiAudioPlayer from './components/player/HiFiAudioPlayer.jsx';
import CreatorProfileView from './components/creator/CreatorProfileView.jsx';
import { 
  AUTHORITATIVE_CATALOG_TRACKS, 
  AUTHORITATIVE_CATALOG_ARTISTS, 
  AUTHORITATIVE_CATALOG_ALBUMS 
} from './data/authoritativeCatalog';
import { normalizeMediaUrl } from './lib/api';
import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { RiHeadphoneFill, RiLineChartFill, RiBankCardFill, RiAppleFill, RiDownloadFill, RiArrowRightFill, RiSmartphoneFill, RiPlayFill, RiDiscFill, RiDatabase2Fill, RiMicFill, RiCpuFill, RiGlobalFill, RiTicket2Fill, RiEqualizerFill, RiLinksFill, RiRadioFill, RiWifiFill, RiMusicFill, RiResetLeftFill, RiPauseFill, RiArrowRightSFill, RiExternalLinkFill, RiSettings3Fill, RiFolderAddFill, RiCoinsFill, RiVolumeMuteFill, RiCloseFill, RiMenuFill, RiSearchLine, RiArrowDownSLine, RiCheckFill } from 'react-icons/ri'
import tsLogo from './assets/tunestream-logo.png'
import tcLogo from './assets/tunecompanion-logo.png'
import tpLogo from './assets/tunepay-logo.png'
import RegionSwitcher from './RegionSwitcher'
import { useRegion } from './RegionContext'
import './Landing.css'
import LiveEventsSection from './components/events/LiveEventsSection.jsx'

const ROLE_LOGOS = {
  consumer: tsLogo,
  companion: tcLogo,
  tunepay: tpLogo,
};

// Inline FaqItem definition
import { RiArrowDownSFill, RiFileList3Line, RiBookOpenFill, RiCustomerService2Fill } from 'react-icons/ri'
function FaqItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`landing-faq-item ${open ? 'open' : ''}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        type="button"
        className="landing-faq-q"
        onClick={() => setOpen(o => !o)}
        data-testid="landing-faq-toggle"
        style={{ width: '100%', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', color: '#fff', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontSize: '15px', fontWeight: '600' }}>{q}</span>
        <RiArrowDownSFill size={16} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: '#10b981' }} />
      </button>
      {open && <p className="landing-faq-a" style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.6', margin: '0 0 16px 0', padding: 0 }}>{a}</p>}
    </div>
  );
}

import tunestreamHeaderImg from './assets/images/tunestream_header.png'
import tunestreamHeader2Img from './assets/images/tunestream_header_2.png'
import tunestreamHeader3Img from './assets/images/tunestream_header_3.png'

import listenHeroImg from './assets/images/listen_hero.png'
import heroMusic1Img from './assets/images/hero_music_1.png'
import heroMusic2Img from './assets/images/hero_music_2.png'
import heroMusic3Img from './assets/images/hero_music_3.png'
import heroMusic4Img from './assets/images/hero_music_4.png'
import distributeHeroImg from './assets/images/distribute_hero.png'

import userSupervisorImg from './assets/images/user_supervisor.png'
import consumerAppImg from './assets/images/consumer_app.png'
import appsLedgerImg from './assets/images/apps_ledger.png'
import userManagerImg from './assets/images/user_manager.png'
import appsSyncImg from './assets/images/apps_sync.png'

const NATIVE_APP_LANDING_DATA = {
  tunestream: {
    slug: 'tunestream',
    name: 'tunestream',
    target: 'For listeners',
    accent: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.18)',
    icon: 'Headphones',
    heroSlides: [
      {
        dot: '#10b981',
        badge: 'Streaming & Library · iOS / Android',
        hLine1: 'Carry the catalogue.',
        hLine2: 'Even off-grid.',
        hLine2Color: '#10b981',
        s: 'Cache 8GB of HQ FLAC locally. Stream cellular-aware. Your library follows you between Wi-Fi, 4G, and no-signal subways.',
        b1: 'Download on App Store',
        b1action: 'appstore',
        b2: 'Use the Web Player',
        b2link: '/stream',
        bgKey: 'listenHero',
      },
      {
        dot: '#10b981',
        badge: 'Direct Creator Support',
        hLine1: 'Skip the middleman.',
        hLine2: 'Tip mid-track.',
        hLine2Color: '#10b981',
        s: 'One tap mid-listen sends value through the Compensation Engine straight to the creator’s wallet within 24 hours.',
        b1: 'Get on Google Play',
        b1action: 'googleplay',
        b2: 'How tipping works',
        b2link: '/help',
        bgKey: 'heroMusic1',
      },
      {
        dot: '#c084fc',
        badge: 'Shared Credits Vault',
        hLine1: 'One account,',
        hLine2: 'every surface.',
        hLine2Color: '#c084fc',
        s: 'Your credits, follow list and tip history sync between web, iOS, Android, and the wider intermaven.io toolset.',
        b1: 'Start Listening Free',
        b1link: '/register',
        b2: 'Browse Pricing',
        b2link: '/pricing',
        bgKey: 'distributeHero',
      },
    ],
    lede: 'A consumer music app built around the African catalogue  -  offline HQ audio, region-aware editorial playlists, and a tip jar that pays the creator directly through the shared tunestream / Intermaven split ledger.',
    webEquivalent: { label: 'Use the web player', to: '/stream' },
    adminLink: { label: 'Manage your library', to: '/dashboard' },
    features: [
      { title: 'HQ offline cache', desc: 'Up to 8GB of FLAC / 320 kbps audio stored locally for low-bandwidth listening.' },
      { title: 'One-tap creator tipping', desc: 'Send a tip mid-track  -  it flows through the Compensation Engine and lands in the creator’s wallet within 24h.' },
      { title: 'Region-aware playlists', desc: 'Editorial picks tailored to your detected market: Naija, EA, SA, US/UK and beyond.' },
      { title: 'Smart discovery', desc: 'AI surfaces tracks that pair with what you already love, weighted by your follow list.' },
      { title: 'Shared credits vault', desc: 'Your tunestream credits work on intermaven.io tools too  -  one account, one balance.' },
      { title: 'Live event drops', desc: 'Get notified when an artist you follow lists tickets or merch on the tunepay network.' },
    ],
    howItWorks: [
      { step: '01', title: 'Sign in once', body: 'Use your existing tunestream / Intermaven account  -  no separate native-app credentials.' },
      { step: '02', title: 'Pick three creators', body: 'During onboarding you follow 3 creators; your home feed seeds from their catalogue and collaborators.' },
      { step: '03', title: 'Stream or download', body: 'Tap to stream, long-press to cache offline. Toggle data-saver in regions where bandwidth is metered.' },
      { step: '04', title: 'Support directly', body: 'Tip, buy, or pre-save. Every interaction is logged in the creator’s ledger you can verify in their EPK.' },
    ],
    testimonials: [
      { quote: 'I tipped my favourite producer mid-listen and it showed up in their split ledger the same day. That’s the future.', author: 'Lerato, Johannesburg', role: 'Listener · 2026' },
      { quote: 'Offline mode survived my whole 6-hour matatu ride. Bandwidth-aware caching actually works.', author: 'Brian, Nairobi', role: 'Daily commuter' },
    ],
    faq: [
      { q: 'Is tunestream free to use?', a: 'Yes  -  listening and tipping are free. The free tier includes 150 signup credits used across the wider Intermaven network.' },
      { q: 'How are creators paid when I tip?', a: 'Tips enter the Compensation Engine cascade (Commission → Label → Artist → Manager → Investor). The split is governed by the creator’s signed contract on file.' },
      { q: 'Can I switch between web and native?', a: 'Yes  -  the web player lives at /stream and shares the same session, library, and tip history.' },
      { q: 'Which devices are supported?', a: 'iOS 15+ and Android 9+. The native shells are Capacitor-wrapped, so the same engine runs on both platforms.' },
      { q: 'Does it work without reliable internet?', a: 'Yes  -  cache up to 8GB locally. Tips queue offline and settle when you reconnect.' },
    ],
    pricingLine: 'Free tier · 150 credits at signup · unlimited streaming',
  },
  'creator-companion': {
    slug: 'creator-companion',
    name: 'tunecompanion',
    target: 'For artists & managers',
    accent: 'var(--purple)',
    accentGlow: 'rgba(139, 92, 246, 0.18)',
    icon: 'TrendingUp',
    heroSlides: [
      {
        dot: '#8b5cf6',
        badge: 'Split Cascade · Live',
        hLine1: 'Watch every cent settle.',
        hLine2: 'From green room to wire.',
        hLine2Color: '#8b5cf6',
        s: 'See Commission → Label → Artist → Manager → Investor resolve in real time, on the phone in your pocket.',
        b1: 'Download Companion',
        b1action: 'appstore',
        b2: 'Open the Web Admin',
        b2link: '/dashboard',
        bgKey: 'heroMusic2',
      },
      {
        dot: '#22d3ee',
        badge: 'Sync Brief Alerts',
        hLine1: 'Close placements',
        hLine2: 'before soundcheck.',
        hLine2Color: '#22d3ee',
        s: 'Push notifications the moment a film, ad, or playlist brief matches your catalogue. Approve, counter, or pitch  -  in two taps.',
        b1: 'Get on Google Play',
        b1action: 'googleplay',
        b2: 'See Sync Marketplace',
        b2link: '/tools',
        bgKey: 'heroMusic3',
      },
      {
        dot: '#f59e0b',
        badge: 'Manager Mode',
        hLine1: 'Every artist you rep.',
        hLine2: 'One switcher.',
        hLine2Color: '#f59e0b',
        s: 'Toggle between every artist on your roster  -  no separate logins. Approve cascade settlements while they’re on stage.',
        b1: 'Start 14-Day Trial',
        b1link: '/register',
        b2: 'View Pricing',
        b2link: '/pricing',
        bgKey: 'distributeHero',
      },
    ],
    lede: 'A mobile-first admin for the people who make the music: split-cascade ledger live on your phone, sync-brief alerts, AI release playbooks, and payout balances you can verify the moment a stream pays out.',
    webEquivalent: { label: 'Open the web dashboard', to: '/dashboard' },
    adminLink: { label: 'Full admin console', to: '/dashboard' },
    features: [
      { title: 'Live split cascade', desc: 'Watch a transaction resolve through Commission → Label → Artist → Manager → Investor in real time.' },
      { title: 'Payout balance ticker', desc: 'Net to wallet, recoupment runoff and pending escrow, refreshed every minute.' },
      { title: 'Sync brief alerts', desc: 'Push notification the moment a film or ad-house brief matches your catalogue.' },
      { title: 'AI release playbook', desc: 'Drafts a 6-week rollout: pre-save windows, pitch targets, sync openings, content calendar.' },
      { title: 'Catalogue overview', desc: 'ISRC status, DSP ingestion checks, and per-track stream counts  -  all on one screen.' },
      { title: 'Manager mode', desc: 'Managers see every artist they represent in a single switcher  -  no separate logins.' },
    ],
    howItWorks: [
      { step: '01', title: 'Sign in', body: 'Same JWT as your TuneMavens.com profile. No separate native credentials.' },
      { step: '02', title: 'Pin your dashboard', body: 'Re-order panels  -  payout, splits, sync alerts, contacts  -  to match how you actually work.' },
      { step: '03', title: 'Act on alerts', body: 'Accept a sync brief, approve a split, or e-sign a contract amendment in two taps.' },
      { step: '04', title: 'Settle in the field', body: 'Approve M-Pesa POS settlements from the same app  -  no laptop required.' },
    ],
    testimonials: [
      { quote: 'I approved a sync brief from a green room ten minutes before stage time. Closed a placement that would have died in email.', author: 'Caleb, Lagos', role: 'Producer' },
      { quote: 'My manager and I watch the same split cascade resolve, on two phones, at the same time. No more spreadsheets.', author: 'Aisha Okoro', role: 'Artist · Okoro Sounds' },
    ],
    faq: [
      { q: 'Is Creator Companion separate from the web dashboard?', a: 'No  -  it’s the same admin, sized for mobile. Every action you take in either surface mirrors instantly.' },
      { q: 'Can I sign contracts on mobile?', a: 'Yes. E-signature works on any phone, tap-optimised, and every party gets their own signed copy.' },
      { q: 'Does it support multi-artist managers?', a: 'Yes  -  see "Manager mode" above. One switcher, every artist you represent.' },
      { q: 'How are notifications delivered?', a: 'Pick a primary channel (push, email, WhatsApp, SMS). If it fails, we’ll try the next one automatically so you never miss anything.' },
      { q: 'Will my data sync if I switch phones?', a: 'Your data lives in the cloud, not on the device. Sign in on a new phone and everything is right where you left it.' },
    ],
    pricingLine: 'Bundled with Creator Package · 1,200 credits · $29.99 one-time',
  },
  tunepay: {
    slug: 'tunepay',
    name: 'tunepay',
    target: 'For labels & venues',
    accent: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.18)',
    icon: 'CreditCard',
    heroSlides: [
      {
        dot: '#10b981',
        badge: 'tunepay STK · Daraja',
        hLine1: 'Sell at the show.',
        hLine2: 'Settle by morning.',
        hLine2Color: '#10b981',
        s: 'tunepay STK Push closes in under 10 seconds. Settlement runs the Compensation Engine cascade overnight  -  artist payouts hit by 7am.',
        b1: 'Provision POS App',
        b1action: 'appstore',
        b2: 'Open the Web POS',
        b2link: '/apps',
        bgKey: 'heroMusic3',
      },
      {
        dot: '#22d3ee',
        badge: 'Multi-Rail · Geo-Routed',
        hLine1: 'Tap, scan, or text.',
        hLine2: 'Every payment rail.',
        hLine2Color: '#22d3ee',
        s: 'Stripe Terminal in US/UK. Flutterwave in Nigeria. tunepay in Kenya. The app picks the rail by detected country  -  zero config.',
        b1: 'Get on Google Play',
        b1action: 'googleplay',
        b2: 'See Bulk Label Pricing',
        b2link: '/pricing',
        bgKey: 'heroMusic4',
      },
      {
        dot: '#f59e0b',
        badge: 'Per-Event Settlement',
        hLine1: '240 t-shirts. 60 vinyls.',
        hLine2: 'Cleared by 7am.',
        hLine2Color: '#f59e0b',
        s: 'Close an event session and the cascade fires automatically. Per-SKU, per-method, per-artist commissions settled within 24h.',
        b1: 'Book a Demo',
        b1link: '/help',
        b2: 'Manage From Admin',
        b2link: '/dashboard',
        bgKey: 'heroMusic2',
      },
    ],
    lede: 'A portable point-of-sale for live events: merch, ticket scans, CD/vinyl. tunepay STK Push, card-present, and digital-wallet acceptance  -  all geo-routed to the right settlement rail per region.',
    webEquivalent: { label: 'Open the web POS', to: '/apps' },
    adminLink: { label: 'Manage inventory & settlements', to: '/dashboard' },
    features: [
      { title: 'tunepay STK Push', desc: 'Live Daraja integration. Customers enter PIN on their phone  -  checkout completes in under 10 seconds.' },
      { title: 'Card present + wallet', desc: 'Tap-to-pay via Stripe Terminal for Western markets; Flutterwave for Nigeria; mobile money for EA.' },
      { title: 'Merch & ticket modes', desc: 'Switch between SKU-based merch sales and barcode/QR ticket validation per event session.' },
      { title: 'Per-event settlement', desc: 'Daily settlement reports broken down by SKU, payment method, and per-artist commission cascade.' },
      { title: 'Offline queue', desc: 'Lose signal mid-show? Sales queue locally and settle the instant connectivity returns.' },
      { title: 'Geo-gated routing', desc: 'The app picks the right settlement rail by detected country  -  no manual configuration.' },
    ],
    howItWorks: [
      { step: '01', title: 'Provision a device', body: 'Issue a POS profile per device from the admin console. Lost devices can be remote-wiped.' },
      { step: '02', title: 'Pick an event', body: 'Tap to open the event session: merch SKUs, ticket lists, and price tier are auto-loaded.' },
      { step: '03', title: 'Take payment', body: 'STK push, card tap, or wallet QR. Receipt prints via the connected thermal printer or emails to the buyer.' },
      { step: '04', title: 'Close out', body: 'Close the event session to trigger the settlement cascade. Artist payouts settle within 24h.' },
    ],
    testimonials: [
      { quote: 'We sold 240 t-shirts and 60 vinyls in one night with two phones. The settlement report was in my inbox by 7am.', author: 'DJ Afro’s tour ops', role: 'Live event · Nairobi' },
      { quote: 'Switched from a clunky Square terminal. The tunepay flow alone closed the gap on every cash-only segment of our crowd.', author: 'Lagos label ops', role: 'Independent label' },
    ],
    faq: [
      { q: 'Do I need special hardware?', a: 'No  -  runs on any iOS 15+ or Android 9+ device. Optional thermal printer, barcode scanner, and Stripe BBPOS reader if you want them.' },
      { q: 'Which countries are supported today?', a: 'Kenya (tunepay Daraja), Nigeria (Flutterwave), and US/UK (Stripe Terminal) at launch. ZA / UG / TZ ship in the next sprint.' },
      { q: 'How does the artist get paid?', a: 'Every sale fires the Compensation Engine cascade. Artist + manager + label shares are settled per the signed contracts on file.' },
      { q: 'Can I manage POS devices from the web?', a: 'Yes  -  the admin console has a dedicated POS Devices panel for provisioning, monitoring, and remote-wipe.' },
      { q: 'What happens if the device goes offline?', a: 'Payments queue locally with cryptographic receipts. They settle the instant the device reconnects.' },
    ],
    pricingLine: 'Included in Label Bulk Package · 10,000 credits · $149.99 one-time',
  },
};

function getLandingBackground(slug) {
  switch (slug) {
    case 'tunestream':
    case 'tunemavens':
      return '#070e1b';
    case 'creator-companion':
      return '#0e071a';
    case 'tunepay':
      return '#05120e';
    case 'sync-master':
      return '#080816';
    default:
      return '#0b0f20';
  }
}

// ─── HorizontalSlider ────────────────────────────────────────────────────────
// Must be defined at module level so React doesn't treat it as a new component
// type on every render (which would destroy the scroll ref each time).
function HorizontalSlider({ items, renderItem }) {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.85 : clientWidth * 0.85;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '1240px', margin: '0 auto', overflow: 'hidden', padding: '0 42px', boxSizing: 'border-box' }}>
      <button
        type="button"
        onClick={() => scroll('left')}
        aria-label="Previous items"
        style={{
          position: 'absolute',
          left: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: 'rgba(7, 14, 27, 0.95)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          width: '34px',
          height: '34px',
          borderRadius: '3px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.7)',
          fontSize: '20px',
          fontWeight: 'bold',
          pointerEvents: 'auto'
        }}
        className="slider-arrow-btn"
      >‹</button>

      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          padding: '10px 4px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        className="hide-scrollbar"
      >
        {items.map((item, idx) => (
          <div key={idx} style={{ flex: '0 0 auto', width: '185px' }}>
            {renderItem(item)}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll('right')}
        aria-label="Next items"
        style={{
          position: 'absolute',
          right: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: 'rgba(7, 14, 27, 0.95)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          width: '34px',
          height: '34px',
          borderRadius: '3px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.7)',
          fontSize: '20px',
          fontWeight: 'bold',
          pointerEvents: 'auto'
        }}
        className="slider-arrow-btn"
      >›</button>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────


// Custom accessible high-contrast dropdown avoiding OS-level light popup bugs
function ExploreCustomDropdown({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div ref={dropdownRef} data-no-i18n="true" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      {label && <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>{label}</span>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          padding: '8px 14px',
          background: '#090d1f',
          backgroundColor: '#090d1f',
          border: isOpen ? '1.5px solid #22d3ee' : '1px solid rgba(0, 240, 255, 0.45)',
          borderRadius: '3px',
          color: '#ffffff',
          fontSize: '12.5px',
          fontWeight: '700',
          cursor: 'pointer',
          minWidth: '155px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
      >
        <span style={{ color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption?.label || value}
        </span>
        <RiArrowDownSLine size={16} color="#22d3ee" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 9999,
            background: '#070c1e',
            backgroundColor: '#070c1e',
            border: '1.5px solid #22d3ee',
            borderRadius: '3px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.95), 0 0 16px rgba(34, 211, 238, 0.25)',
            maxHeight: '260px',
            overflowY: 'auto',
            minWidth: '190px',
            padding: '4px 0'
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  padding: '9px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  fontSize: '12px',
                  fontWeight: isSelected ? '800' : '600',
                  color: isSelected ? '#22d3ee' : '#ffffff',
                  background: isSelected ? 'rgba(34, 211, 238, 0.15)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = '#22d3ee';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
              >
                <span>{opt.label}</span>
                {isSelected && <RiCheckFill size={14} color="#22d3ee" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


export default function NativeAppLandingView({ creatorEpk = {}, catalogTracks = [], sessionUser = null, onLogout = null }) {
  const { slug: paramSlug } = useParams();
  const slug = paramSlug || 'tunestream';
  const normalizedSlug = (slug === 'tunestream' || slug === 'tunemavens') ? 'tunestream' : slug;
  const data = NATIVE_APP_LANDING_DATA[normalizedSlug];
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const view = searchParams.get('view') || 'listen';
  let pageContent;

  const [selectedEpk, setSelectedEpk] = useState(null);
  const [tracks, setTracks] = useState(() => (catalogTracks && catalogTracks.length > 0) ? catalogTracks : AUTHORITATIVE_CATALOG_TRACKS);
  const [artists, setArtists] = useState(AUTHORITATIVE_CATALOG_ARTISTS);
  const [albums, setAlbums] = useState(AUTHORITATIVE_CATALOG_ALBUMS);
  const [exploreSearch, setExploreSearch] = useState('');
  const [exploreFilter, setExploreFilter] = useState('all');
  const [exploreGenre, setExploreGenre] = useState('all');
  const [exploreSort, setExploreSort] = useState('newest');
  const [activeHiFiTrack, setActiveHiFiTrack] = useState(null);
  const [isHiFiPlaying, setIsHiFiPlaying] = useState(false);
  const creatorSlugParam = searchParams.get('creator');
  const [selectedCreatorProfile, setSelectedCreatorProfile] = useState(null);
  const { formatPrice, currencyInfo } = useRegion();
  const [planBillingCycle, setPlanBillingCycle] = useState('monthly');
  const [planFaqOpenIndex, setPlanFaqOpenIndex] = useState(-1);

  useEffect(() => {
    if (creatorSlugParam) {
      const match = (artists && artists.length > 0 ? artists : AUTHORITATIVE_CATALOG_ARTISTS).find(a => 
        a.subdomain?.toLowerCase() === creatorSlugParam.toLowerCase() ||
        a.id?.toLowerCase() === creatorSlugParam.toLowerCase() ||
        a.name?.toLowerCase().replace(/[^a-z0-9]/g, '') === creatorSlugParam.toLowerCase()
      );
      if (match) {
        setSelectedCreatorProfile(match);
      }
    }
  }, [creatorSlugParam, artists]);

  useEffect(() => {
    fetch('/api/catalog/tracks?all=true')
      .then(res => res.json())
      .then(data => {
        if (data && data.tracks && Array.isArray(data.tracks) && data.tracks.length > 0) {
          setTracks(data.tracks);
        }
      })
      .catch(() => {});

    fetch('/api/catalog/artists')
      .then(res => res.json())
      .then(data => {
        if (data && data.artists && Array.isArray(data.artists) && data.artists.length > 0) {
          setArtists(data.artists);
        }
      })
      .catch(() => {});

    fetch('/api/catalog/albums')
      .then(res => res.json())
      .then(data => {
        if (data && data.albums && Array.isArray(data.albums) && data.albums.length > 0) {
          setAlbums(data.albums);
        }
      })
      .catch(() => {});
  }, []);

  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem('tunestream_playlists');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 1, name: 'Afrobeat Essentials', desc: 'The hottest tracks from Lagos and Accra.', tracks: 12, bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
      { id: 2, name: 'Acoustic Chill Africa', desc: 'Unplugged guitar and soul vibes.', tracks: 8, bg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' },
      { id: 3, name: 'Amapiano Heat', desc: 'Pretoria and Johannesburg club starters.', tracks: 15, bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
    ];
  });

  const savePlaylists = (newList) => {
    setPlaylists(newList);
    try {
      localStorage.setItem('tunestream_playlists', JSON.stringify(newList));
    } catch (e) {}
  };

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [newPlaylistBg, setNewPlaylistBg] = useState('linear-gradient(135deg, #10b981 0%, #059669 100%)');
  const [explorePage, setExplorePage] = useState(1);
  const [podcastPage, setPodcastPage] = useState(1);

  const TUNESTREAM_HERO_SLIDES = [
    {
      img: tunestreamHeaderImg,
      dot: '#10b981',
      badge: 'Free Download · No Credit Card',
      headline1: 'Carry the catalogue.',
      headline2: 'Even off-grid.',
      headline2Color: '#10b981',
      sub: 'High-fidelity FLAC audio with cellular-aware streaming. Tip creators mid-track, share your credit vault across every device.',
    },
    {
      img: tunestreamHeader2Img,
      dot: '#22d3ee',
      badge: 'FLAC · Lossless · Zero Ads',
      headline1: 'Hear every detail.',
      headline2: 'Nothing compressed.',
      headline2Color: '#22d3ee',
      sub: 'Studio-grade audio quality for listeners who refuse to settle. TuneStream delivers lossless audio straight from the source — free, forever.',
    },
    {
      img: tunestreamHeader3Img,
      dot: '#f59e0b',
      badge: 'African Artists · Global Reach',
      headline1: 'Feel the crowd.',
      headline2: 'Anywhere on earth.',
      headline2Color: '#f59e0b',
      sub: 'From Lagos to London, Nairobi to New York — stream the full depth of African music culture with built-in creator tipping and direct support.',
    },
  ];
  const INTERIOR_HEADER_MAP = {
  explore: tunestreamHeader2Img,
  playlists: tunestreamHeader3Img,
  'create-playlist': tunestreamHeader2Img,
  'browse-podcasts': tunestreamHeader3Img,
  apps: tunestreamHeaderImg,
  free: tunestreamHeader2Img,
  premium: tunestreamHeader3Img,
  help: tunestreamHeaderImg,
  };
  const [autoplay, setAutoplay] = useState(true);
  const [playerPlaying, setPlayerPlaying] = useState(true);
  const [playerProgress, setPlayerProgress] = useState(0);
  const playerTimer = useRef(null);

  useEffect(() => {
    if (!autoplay || !playerPlaying) { clearInterval(playerTimer.current); return; }
    playerTimer.current = setInterval(() => {
      setPlayerProgress(p => {
        if (p >= 100) { clearInterval(playerTimer.current); return 0; }
        return p + 100 / 212;
      });
    }, 1000);
    return () => clearInterval(playerTimer.current);
  }, [autoplay, playerPlaying]);

  const scrollToSection = (id) => {
    if (view !== 'listen') {
      const sp = new URLSearchParams(location.search);
      sp.set('view', 'listen');
      navigate(`?${sp.toString()}`);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const ICONS = { Headphones: RiHeadphoneFill, TrendingUp: RiLineChartFill, CreditCard: RiBankCardFill };
  const HERO_IMAGE_MAP = {
    listenHero: listenHeroImg,
    heroMusic1: heroMusic1Img,
    heroMusic2: heroMusic2Img,
    heroMusic3: heroMusic3Img,
    heroMusic4: heroMusic4Img,
    distributeHero: distributeHeroImg,
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideState, setSlideState] = useState('in');
  const [progress, setProgress] = useState(0);
  const [titleHovered, setTitleHovered] = useState(false);
  const progressRef = useRef(null);
  const timerRef = useRef(null);
  const SLIDE_DURATION = 36000;
  const TRANSITION_OUT_MS = 400;

  const slides = normalizedSlug === 'tunestream' ? TUNESTREAM_HERO_SLIDES : (data?.heroSlides || []);
  const slideCount = slides.length;
  const currentSlideData = slides[currentSlide] || null;

  const goToSlide = (index) => {
    if (index === currentSlide) return;
    if (progressRef.current) cancelAnimationFrame(progressRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    setSlideState('out');
    setTimeout(() => {
      setCurrentSlide(index);
      setProgress(0);
      setSlideState('in');
    }, TRANSITION_OUT_MS);
  };
  const goToPrevSlide = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    goToSlide((currentSlide - 1 + slideCount) % slideCount);
  };
  const goToNextSlide = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    goToSlide((currentSlide + 1) % slideCount);
  };

  useEffect(() => {
    if (!slideCount) return undefined;
    const startTime = Date.now();
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(newProgress);
      if (newProgress < 100) {
        progressRef.current = requestAnimationFrame(updateProgress);
      }
    };
    progressRef.current = requestAnimationFrame(updateProgress);
    timerRef.current = setTimeout(() => {
      setSlideState('out');
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slideCount);
        setProgress(0);
        setSlideState('in');
      }, TRANSITION_OUT_MS);
    }, SLIDE_DURATION);
    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, slideCount]);

  if (!data) {
    return (
      <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}>
        <h2 style={{ color: '#f1f5f9' }}>App not found</h2>
        <Link to="/native-apps" className="btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>
          See all native apps
        </Link>
      </div>
    );
  }

  const HeroIcon = ICONS[data.icon];

  const renderHeroCta = (slide, which) => {
    const label = which === 'b1' ? slide.b1 : slide.b2;
    const link = which === 'b1' ? slide.b1link : slide.b2link;
    const action = which === 'b1' ? slide.b1action : slide.b2action;
    const cls = which === 'b1' ? 'hbp' : 'hbg';
    const normalizedSlug = 'tunestream';
    const testId = `landing-hero-${which}-${normalizedSlug}`;
    if (action === 'appstore' || action === 'googleplay') {
      const storeName = action === 'appstore' ? 'App Store' : 'Google Play';
      return (
        <button
          type="button"
          className={cls}
          onClick={() => alert(`${storeName} listing for ${data.name} coming soon.`)}
          data-testid={testId}
          style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {label}
        </button>
      );
    }
    return (
      <Link to={link} className={cls} data-testid={testId}>{label}</Link>
    );
  };

  if (normalizedSlug === 'tunestream') {

    const renderTopHeader = () => {
      if (view === 'listen') {
        const slide = TUNESTREAM_HERO_SLIDES[currentSlide] || TUNESTREAM_HERO_SLIDES[0];
        return (
          <>
            <div className="hw">
              <div className="bgs">
                {TUNESTREAM_HERO_SLIDES.map((s, idx) => (
                  <div
                    key={idx}
                    className={`bg ${currentSlide === idx ? 'on' : ''}`}
                    style={{
                      backgroundImage: `url(${s.img})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: currentSlide === idx
                        ? (titleHovered ? 'brightness(1.05) blur(0px)' : 'brightness(0.7) blur(1.5px)')
                        : 'none',
                      transform: currentSlide === idx && titleHovered ? 'scale(1.04)' : 'scale(1)',
                      transition: 'filter 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
                    }}
                  />
                ))}
                <div
                  className="bgo"
                  style={{
                    opacity: titleHovered ? 0.3 : 0.8,
                    transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
                  }}
                />
              </div>

              <div className="hs">
                <div
                  className="hcont"
                  key={currentSlide}
                  onMouseEnter={() => setTitleHovered(true)}
                  onMouseLeave={() => setTitleHovered(false)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={`he hbadge ${slideState}`}>
                    <span
                      className="bdot"
                      style={{
                        background: slide.dot || slide.headline2Color || '#10b981',
                        animation: 'pulseGlow 2s infinite',
                      }}
                    />
                    <span>{slide.badge}</span>
                  </div>

                  <h1 className="ht htitle">
                    <span className={`ht-line ht-line-1 ${slideState}`}>{slide.headline1}</span>
                    <span
                      className={`ht-line ht-line-2 ${slideState}`}
                      style={{ color: slide.headline2Color }}
                    >
                      {slide.headline2}
                    </span>
                  </h1>

                  <p className={`hp hsub ${slideState}`}>
                    {slide.sub}
                  </p>

                  <div className={`hb hbtns ${slideState}`}>
                    <button
                      type="button"
                      onClick={() => alert('TuneStream — Download Free on iOS & Android coming soon!')}
                      className="hbp"
                      style={{ border: 'none', fontFamily: 'inherit', gap: '8px' }}
                    >
                      <RiDownloadFill size={16} /> <span>Download Free</span>
                    </button>
                    <a
                      href="#plans-section"
                      className="hbg"
                      onClick={(e) => { e.preventDefault(); scrollToSection('plans-section'); }}
                    >
                      View Plans
                    </a>
                  </div>
                </div>
              </div>

              <div className={`sui-arrows ${slideState}`}>
                <button type="button" className="slide-nav prev" onClick={goToPrevSlide} aria-label="Previous slide" data-testid="landing-hero-prev">‹</button>
                <button type="button" className="slide-nav next" onClick={goToNextSlide} aria-label="Next slide" data-testid="landing-hero-next">›</button>
              </div>

              <div className={`sui-bottom ${slideState}`}>
                <div className="spr">
                  <div className="spb" style={{ width: `${progress}%` }} />
                </div>
                <div className="sdots">
                  {TUNESTREAM_HERO_SLIDES.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`sd ${index === currentSlide ? 'on' : ''}`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      data-testid={`landing-hero-dot-${index}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
              background: 'rgba(6, 8, 19, 0.8)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '10px 24px',
              height: '62px',
              boxSizing: 'border-box',
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RiMusicFill size={18} style={{ color: '#fff' }} />
              </div>

              <div style={{ flexShrink: 0, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>Midnight Cruise</div>
                <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>Alex Rivera</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <button
                  onClick={() => setPlayerProgress(p => Math.max(0, p - 5))}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', display: 'flex' }}
                  title="Rewind"
                ><RiResetLeftFill size={15} /></button>
                <button
                  onClick={() => setPlayerPlaying(p => !p)}
                  style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#10b981', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  title={playerPlaying ? 'Pause' : 'Play'}
                >
                  {playerPlaying ? <RiPauseFill size={14} fill="#fff" stroke="none" /> : <RiPlayFill size={14} fill="#fff" stroke="none" />}
                </button>
                <button
                  onClick={() => setPlayerProgress(0)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', display: 'flex' }}
                  title="Skip"
                ><RiArrowRightSFill size={15} /></button>
              </div>

              <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', cursor: 'pointer', minWidth: '60px' }}
                onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setPlayerProgress(((e.clientX - rect.left) / rect.width) * 100); }}
              >
                <div style={{ height: '100%', width: `${playerProgress}%`, background: 'linear-gradient(90deg, #10b981, #22d3ee)', borderRadius: '2px', transition: 'width 1s linear' }} />
              </div>

              <div style={{ fontSize: '11px', color: '#64748b', flexShrink: 0, whiteSpace: 'nowrap' }}>
                {Math.floor(playerProgress * 2.12 / 60).toString().padStart(1,'0')}:{Math.floor(playerProgress * 2.12 % 60).toString().padStart(2,'0')} / 3:32
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: '4px' }}>
                <span style={{ fontSize: '10px', color: autoplay ? '#10b981' : '#475569', fontWeight: 600, letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>AUTO</span>
                <button
                  onClick={() => { setAutoplay(a => !a); if (autoplay) setPlayerPlaying(false); }}
                  style={{
                    width: '34px', height: '18px', borderRadius: '9px',
                    background: autoplay ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)',
                    border: `1px solid ${autoplay ? '#10b981' : 'rgba(255,255,255,0.12)'}`,
                    cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease', padding: 0,
                    flexShrink: 0,
                  }}
                  title={autoplay ? 'Turn off autoplay' : 'Turn on autoplay'}
                >
                  <span style={{
                    position: 'absolute', top: '2px',
                    left: autoplay ? '16px' : '2px',
                    width: '12px', height: '12px', borderRadius: '50%',
                    background: autoplay ? '#10b981' : '#475569',
                    transition: 'left 0.3s ease, background 0.3s ease',
                    display: 'block',
                  }} />
                </button>
              </div>
            </div>
          </>
        );
      }

      // If viewing a Creator Profile, render the creator's bespoke retina header in place of the page header!
      if (selectedCreatorProfile) {
        const creatorHeaderImg = selectedCreatorProfile.headerImageUrl || selectedCreatorProfile.banner || `/headers/header_${selectedCreatorProfile.subdomain}_custom.jpg`;
        return (
          <div 
            className="page-header-banner creator-profile-page-header" 
            style={{ 
              backgroundImage: `url(${creatorHeaderImg})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center', 
              borderRadius: '0px', 
              overflow: 'hidden', 
              marginBottom: '32px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.85)',
              position: 'relative',
              minHeight: '340px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            <div className="page-header-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6, 8, 19, 0.35) 0%, rgba(6, 8, 19, 0.88) 100%)', zIndex: 1 }} />
            <div className="page-header-content" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '60px 24px 20px', maxWidth: '850px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(34, 211, 238, 0.16)', border: '1px solid rgba(34, 211, 238, 0.45)', padding: '4px 14px', borderRadius: '3px', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {selectedCreatorProfile.role || 'Verified Creator'}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>•</span>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700' }}>
                  Verified Profile
                </span>
              </div>
              <h1 className="page-header-title" style={{ fontSize: 'clamp(32px, 5vw, 50px)', fontWeight: '800', color: '#ffffff', margin: '0 0 12px', textShadow: '0 4px 20px rgba(0,0,0,0.85)', letterSpacing: '-0.02em' }}>
                {selectedCreatorProfile.name}
              </h1>
              <div className="page-header-breadcrumb" style={{ marginTop: '12px', fontSize: '13px', color: '#94a3b8', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCreatorProfile(null);
                    const sp = new URLSearchParams(location.search);
                    sp.delete('creator');
                    navigate(`?${sp.toString()}`, { replace: true });
                  }}
                  style={{ background: 'none', border: 'none', color: '#22d3ee', cursor: 'pointer', fontWeight: '600', padding: 0, fontSize: '13px' }}
                >
                  Explore Creators
                </button>
                <span>/</span>
                <span style={{ color: '#fff', fontWeight: '600' }}>{selectedCreatorProfile.name}</span>
                <span>•</span>
                <span style={{ color: '#10b981', fontFamily: 'monospace', fontWeight: '700' }}>@{selectedCreatorProfile.subdomain}</span>
              </div>
            </div>
          </div>
        );
      }

      const headerMeta = {
        explore: { title: 'Explore Creators', breadcrumb: 'Explore' },
        playlists: { title: 'My Playlists', breadcrumb: 'Library / Playlists' },
        'create-playlist': { title: 'Create Playlist', breadcrumb: 'Library / Create' },
        'browse-podcasts': { title: 'Browse Podcasts', breadcrumb: 'Library / Podcasts' },
        apps: { title: 'TuneStream Apps', breadcrumb: 'Apps' },
        free: { title: 'TuneStream Free', breadcrumb: 'Plans / Free' },
        premium: { title: 'TuneStream Premium', breadcrumb: 'Plans / Premium' },
        plans: { title: 'Membership & Access Plans', breadcrumb: 'Plans' },
        help: { title: 'Help & Documentation', breadcrumb: 'Support / Documentation' },
        docs: { title: 'Help & Documentation', breadcrumb: 'Support / Documentation' },
        blog: { title: 'TuneStream Blog & Sound Forum', breadcrumb: 'Community / Blog & Forum' },
        forum: { title: 'Community Discussions & Sound Forum', breadcrumb: 'Community / Forum' },
        support: { title: 'Support Desk & Claims Resolution', breadcrumb: 'Support / Support Desk' },
        tickets: { title: 'Support Desk & Claims Resolution', breadcrumb: 'Support / Support Desk' }
      };

      const meta = headerMeta[view] || { title: 'TuneStream', breadcrumb: 'Portal' };

      return (
        <div 
          className="page-header-banner" 
          style={{ 
            backgroundImage: `url(${INTERIOR_HEADER_MAP[view] || tunestreamHeaderImg})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            borderRadius: '0px', 
            overflow: 'hidden', 
            marginBottom: '40px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            position: 'relative',
            minHeight: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <div className="page-header-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(7, 14, 27, 0.8)', zIndex: 1 }} />
          <div className="page-header-content" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '80px 24px 0' }}>
            <h1 className="page-header-title" style={{ fontSize: '32px', fontWeight: '800', color: '#fff', margin: 0 }}>{meta.title}</h1>
            <div className="page-header-breadcrumb" style={{ marginTop: '12px', fontSize: '13px', color: 'var(--mu)', display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'center' }}>
              <Link to="/native-apps/tunestream?view=listen" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>TuneStream</Link>
              <span>/</span>
              <span style={{ color: '#fff' }}>{meta.breadcrumb}</span>
            </div>
          </div>
        </div>
      );
    };


    const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      if (totalPages <= 1) return null;

      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '40px' }}>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            style={{
              padding: '8px 16px',
              background: currentPage === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '3px',
              color: currentPage === 1 ? 'rgba(255,255,255,0.3)' : '#fff',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '13px'
            }}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              style={{
                width: '36px',
                height: '36px',
                background: currentPage === page ? 'var(--green)' : 'rgba(255,255,255,0.05)',
                border: currentPage === page ? 'none' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '3px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold'
              }}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            style={{
              padding: '8px 16px',
              background: currentPage === totalPages ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '3px',
              color: currentPage === totalPages ? 'rgba(255,255,255,0.3)' : '#fff',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '13px'
            }}
          >
            Next
          </button>
        </div>
      );
    };


    const renderPlansSection = () => {
      const isAnnual = planBillingCycle === 'annual';

      const plans = [
        {
          id: 'free',
          name: 'TuneStream Free',
          badge: 'Free Forever',
          badgeColor: '#10b981',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          priceDisplay: '$0',
          period: 'forever',
          subtext: 'No credit card required',
          desc: 'Ad-supported music streaming with essential playlist crates and 150 shared registration credits.',
          features: [
            'Ad-supported listening experience',
            '150 shared Intermaven Network credits',
            'Standard 160kbps audio streaming',
            'Mobile & Web player access',
            'Create & share custom playlist crates',
            'Follow creators and comment on releases'
          ],
          cta: 'Start Listening Free',
          ctaStyle: {
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            color: '#fff'
          },
          targetRoute: '/register?plan=free'
        },
        {
          id: 'individual',
          name: 'HiFi Individual',
          badge: 'Most Popular • Lossless 24-bit',
          badgeColor: '#22d3ee',
          border: '2px solid #22d3ee',
          boxShadow: '0 0 24px rgba(34, 211, 238, 0.25)',
          priceDisplay: formatPrice ? formatPrice(isAnnual ? 3.99 : 4.99) : (isAnnual ? '$3.99' : '$4.99'),
          period: isAnnual ? '/ month, billed annually' : '/ month',
          subtext: isAnnual ? 'Save 20% compared to monthly' : 'Flexible monthly cancellation',
          desc: 'For solo listeners who demand studio master fidelity and direct mid-listen creator tipping.',
          features: [
            'Lossless Studio 24-bit / 48kHz FLAC master audio',
            '100% Ad-Free uninterrupted playback',
            '8GB Smart offline library caching',
            'Direct creator tipping enabled (bypasses pools)',
            '500 bonus network credits every month',
            'Bit-perfect DAC output & 10-band studio EQ',
            'Unlimited track skips & full lyrics display'
          ],
          cta: 'Get HiFi Individual',
          ctaStyle: {
            background: '#22d3ee',
            border: 'none',
            color: '#060813',
            boxShadow: '0 0 16px rgba(34, 211, 238, 0.4)'
          },
          targetRoute: '/register?plan=individual'
        },
        {
          id: 'duo',
          name: 'TuneStream Duo',
          badge: 'For 2 Listeners',
          badgeColor: '#a855f7',
          border: '1px solid rgba(168, 85, 247, 0.5)',
          priceDisplay: formatPrice ? formatPrice(isAnnual ? 6.39 : 7.99) : (isAnnual ? '$6.39' : '$7.99'),
          period: isAnnual ? '/ month, billed annually' : '/ month',
          subtext: '2 independent accounts under 1 bill',
          desc: 'Two independent premium accounts for couples or housemates with personalized mix crates.',
          features: [
            '2 separate, private accounts with personal crates',
            'Shared Duo Mix playlist updated weekly',
            '2 devices with 8GB offline storage each',
            'Lossless 24-bit FLAC audio for both listeners',
            '1,000 shared network credits every month',
            'Direct creator tipping for both accounts'
          ],
          cta: 'Get Duo Plan',
          ctaStyle: {
            background: '#a855f7',
            border: 'none',
            color: '#fff',
            boxShadow: '0 0 16px rgba(168, 85, 247, 0.3)'
          },
          targetRoute: '/register?plan=duo'
        },
        {
          id: 'family',
          name: 'TuneStream Family',
          badge: 'Up to 6 Accounts',
          badgeColor: '#f59e0b',
          border: '1px solid rgba(245, 158, 11, 0.5)',
          priceDisplay: formatPrice ? formatPrice(isAnnual ? 7.99 : 9.99) : (isAnnual ? '$7.99' : '$9.99'),
          period: isAnnual ? '/ month, billed annually' : '/ month',
          subtext: 'For households with up to 6 members',
          desc: 'Up to 6 standalone premium accounts with parental controls and a blended Family Mix crate.',
          features: [
            'Up to 6 independent accounts for family members',
            'Parental explicit lyrics filter toggle',
            'Family Mix playlist blending tracks everyone loves',
            'Up to 6 devices with offline caching',
            '1,500 shared network credits every month',
            'Lossless 24-bit studio FLAC for the entire house'
          ],
          cta: 'Get Family Plan',
          ctaStyle: {
            background: '#f59e0b',
            border: 'none',
            color: '#060813',
            boxShadow: '0 0 16px rgba(245, 158, 11, 0.3)'
          },
          targetRoute: '/register?plan=family'
        }
      ];

      const comparisonMatrix = [
        { feature: 'Audio Streaming Quality', free: 'Standard (160kbps)', ind: 'Lossless 24-Bit FLAC', duo: 'Lossless 24-Bit FLAC', fam: 'Lossless 24-Bit FLAC' },
        { feature: 'Ad-Free Playback', free: 'No (Ad-supported)', ind: 'Yes (100% Ad-Free)', duo: 'Yes (100% Ad-Free)', fam: 'Yes (100% Ad-Free)' },
        { feature: 'Offline Library Caching', free: 'None', ind: '8GB Smart Cache', duo: '8GB per Account', fam: '8GB per Account' },
        { feature: 'Direct Creator Tipping', free: 'Disabled', ind: 'Enabled', duo: 'Enabled', fam: 'Enabled' },
        { feature: 'Monthly Network Credits', free: '150 (one-time)', ind: '500 / month', duo: '1,000 / month', fam: '1,500 / month' },
        { feature: 'Independent Accounts', free: '1 Account', ind: '1 Account', duo: '2 Accounts', fam: 'Up to 6 Accounts' },
        { feature: 'Studio EQ & Bit-Perfect DAC', free: 'Basic', ind: '10-Band + DAC pass', duo: '10-Band + DAC pass', fam: '10-Band + DAC pass' },
        { feature: 'Unlimited Skips & Lyrics', free: 'Limited skips', ind: 'Unlimited', duo: 'Unlimited', fam: 'Unlimited' },
      ];

      const planFaqs = [
        { q: 'Can I switch between plans at any time?', a: 'Yes! You can upgrade, downgrade, or switch between monthly and annual billing at any point from your Billing settings. Upgrades apply immediately with prorated credits.' },
        { q: 'How does direct artist tipping work with my subscription?', a: "Every Premium plan includes monthly bonus Intermaven Network Credits. While streaming, tap \'Tip Artist\' to send credits directly to the creator\'s verified split wallet." },
        { q: 'Do Duo and Family members share listening history or playlists?', a: 'Never. Each member gets their own private login credentials, library, favorite artists, and custom recommendations.' },
        { q: 'What happens if I cancel my subscription?', a: 'If you cancel, you will keep all Premium perks until the end of your billing cycle. After that, your account transitions gracefully to TuneStream Free without losing any playlists.' }
      ];

      return (
        <section id="plans-section" style={{ marginTop: '70px', marginBottom: '60px', textAlign: 'center', scrollMarginTop: '100px' }}>
          {/* Section Header */}
          <div style={{ maxWidth: '800px', margin: '0 auto 36px auto' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(34, 211, 238, 0.08)',
              border: '1px solid rgba(34, 211, 238, 0.25)',
              padding: '6px 14px',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: '700',
              color: '#22d3ee',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '14px'
            }}>
              <RiCoinsFill size={14} /> Membership &amp; Access Tiers
            </div>

            <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>
              Choose Your Sound. Pick Your Plan.
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6', margin: '0 0 28px 0' }}>
              Experience master lossless audio, direct artist tipping, and 8GB offline caching. Prices adapt automatically to your local currency ({currencyInfo?.symbol || '$'}).
            </p>

            {/* Monthly / Annual Billing Toggle */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#090d1f',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '3px',
              padding: '4px',
              gap: '4px'
            }}>
              <button
                type="button"
                onClick={() => setPlanBillingCycle('monthly')}
                style={{
                  padding: '8px 20px',
                  borderRadius: '3px',
                  border: planBillingCycle === 'monthly' ? '1px solid #22d3ee' : '1px solid transparent',
                  background: planBillingCycle === 'monthly' ? 'rgba(34, 211, 238, 0.15)' : 'transparent',
                  color: planBillingCycle === 'monthly' ? '#22d3ee' : '#94a3b8',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setPlanBillingCycle('annual')}
                style={{
                  padding: '8px 20px',
                  borderRadius: '3px',
                  border: planBillingCycle === 'annual' ? '1px solid #10b981' : '1px solid transparent',
                  background: planBillingCycle === 'annual' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: planBillingCycle === 'annual' ? '#10b981' : '#94a3b8',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>Annual Billing</span>
                <span style={{
                  background: '#10b981',
                  color: '#060813',
                  fontSize: '10px',
                  fontWeight: '900',
                  padding: '1px 6px',
                  borderRadius: '3px'
                }}>
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          {/* 4 Plan Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginBottom: '40px',
            textAlign: 'left'
          }}>
            {plans.map((p) => (
              <div
                key={p.id}
                style={{
                  background: '#090d1f',
                  border: p.border,
                  boxShadow: p.boxShadow || '0 8px 24px rgba(0, 0, 0, 0.5)',
                  borderRadius: '3px',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      color: p.badgeColor,
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${p.badgeColor}40`,
                      padding: '3px 8px',
                      borderRadius: '3px',
                      textTransform: 'uppercase'
                    }}>
                      {p.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#fff', margin: '0 0 10px 0' }}>
                    {p.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '900', color: '#fff' }}>
                      {p.priceDisplay}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {p.period}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '16px' }}>
                    {p.subtext}
                  </div>

                  <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', margin: '0 0 24px 0', minHeight: '38px' }}>
                    {p.desc}
                  </p>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '20px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>
                      Included Features:
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {p.features.map((feat, fIdx) => (
                        <li key={fIdx} style={{ fontSize: '12.5px', color: '#e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <RiCheckFill size={15} color={p.badgeColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(p.targetRoute)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '3px',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    ...p.ctaStyle
                  }}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Student Discount Banner */}
          <div style={{
            background: 'rgba(34, 211, 238, 0.04)',
            border: '1px solid rgba(34, 211, 238, 0.2)',
            borderRadius: '3px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '50px',
            textAlign: 'left'
          }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#22d3ee' }}>
                🎓 University &amp; College Student Discount:
              </span>
              <span style={{ fontSize: '13px', color: '#cbd5e1', marginLeft: '8px' }}>
                Full-time enrolled students receive 50% discount on HiFi Individual ({formatPrice ? formatPrice(2.49) : '$2.49'}/mo).
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/register?plan=student')}
              style={{
                background: 'rgba(34, 211, 238, 0.12)',
                border: '1px solid #22d3ee',
                color: '#22d3ee',
                padding: '6px 14px',
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Verify Student Status &rarr;
            </button>
          </div>

          {/* Feature Comparison Table */}
          <div style={{
            background: '#090d1f',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '3px',
            padding: '32px',
            maxWidth: '1000px',
            margin: '0 auto 50px auto',
            overflowX: 'auto',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '0 0 20px 0', textAlign: 'center' }}>
              Full Feature Comparison
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <th style={{ padding: '12px 16px', color: '#94a3b8', textAlign: 'left' }}>Feature</th>
                  <th style={{ padding: '12px 16px', color: '#fff', textAlign: 'center' }}>Free</th>
                  <th style={{ padding: '12px 16px', color: '#22d3ee', textAlign: 'center' }}>HiFi Individual</th>
                  <th style={{ padding: '12px 16px', color: '#a855f7', textAlign: 'center' }}>Duo</th>
                  <th style={{ padding: '12px 16px', color: '#f59e0b', textAlign: 'center' }}>Family</th>
                </tr>
              </thead>
              <tbody>
                {comparisonMatrix.map((row, rIdx) => (
                  <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '12px 16px', color: '#e2e8f0', fontWeight: '600' }}>{row.feature}</td>
                    <td style={{ padding: '12px 16px', color: '#94a3b8', textAlign: 'center' }}>{row.free}</td>
                    <td style={{ padding: '12px 16px', color: '#22d3ee', fontWeight: '700', textAlign: 'center' }}>{row.ind}</td>
                    <td style={{ padding: '12px 16px', color: '#c084fc', textAlign: 'center' }}>{row.duo}</td>
                    <td style={{ padding: '12px 16px', color: '#fcd34d', textAlign: 'center' }}>{row.fam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Plan FAQs Accordion */}
          <div style={{
            background: '#090d1f',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '3px',
            padding: '32px',
            maxWidth: '860px',
            margin: '0 auto',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '0 0 20px 0', textAlign: 'center' }}>
              Plan &amp; Billing Inquiries
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {planFaqs.map((faq, fIdx) => {
                const isOpen = planFaqOpenIndex === fIdx;
                return (
                  <div
                    key={fIdx}
                    style={{
                      background: isOpen ? 'rgba(34, 211, 238, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                      border: isOpen ? '1px solid rgba(34, 211, 238, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setPlanFaqOpenIndex(isOpen ? -1 : fIdx)}
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        textAlign: 'left',
                        color: '#fff',
                        fontSize: '13.5px',
                        fontWeight: '700',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{faq.q}</span>
                      <span style={{ color: '#22d3ee', fontSize: '16px', fontWeight: 'bold' }}>
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 18px 14px 18px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    };


    const renderListen = () => {
      const singlesList = tracks.filter(t => t.releaseType === 'Single' || (t.release && t.release.toLowerCase().includes('single')));
      const trendingSongs = tracks.slice(0, 10).map((t, idx) => ({
        id: t.id || t.isrc || `t_${idx}`,
        title: t.title,
        artist: t.artist || 'Ndufo',
        streams: `${t.streams || t.plays || '1.2M'} plays`,
        cover: normalizeMediaUrl(t.coverArt || t.cover) || `https://picsum.photos/seed/${t.id || idx}/400/400`,
        track: t
      }));

      const popularCreators = artists.map(a => ({
        id: a.id,
        name: a.name,
        role: a.role || 'Signed Creator',
        genre: a.genre || 'Afro-fusion',
        listeners: a.name === 'Ndufo' ? '3.4M listeners' : '1.2M listeners',
        avatar: normalizeMediaUrl(a.avatar) || `https://picsum.photos/seed/${a.id}/400/400`,
        subdomain: a.subdomain
      }));

      const popularSingles = singlesList.map((t, idx) => ({
        id: t.id || t.isrc || `s_${idx}`,
        title: t.title,
        artist: t.artist || 'Ndufo',
        dls: `${t.streams || t.plays || '1.0M'} streams`,
        cover: normalizeMediaUrl(t.coverArt || t.cover) || `https://picsum.photos/seed/${t.id || idx}/400/400`,
        isrc: t.isrc,
        track: t
      }));

      const popularAlbums = albums.map((a, idx) => ({
        id: a.id || `alb_${idx}`,
        title: a.title,
        artist: a.artist || 'Ndufo',
        year: a.year || '2026',
        tracksCount: a.tracksCount || (a.tracks ? a.tracks.length : 1),
        cover: normalizeMediaUrl(a.cover || a.coverArt) || `https://picsum.photos/seed/${a.id || idx}/400/400`,
        type: a.type || 'Album'
      }));

      return (
        <>
          <div style={{ background: 'rgba(34, 211, 238, 0.08)', borderBottom: '1px solid rgba(34, 211, 238, 0.15)', padding: '12px 24px', borderRadius: '3px', textAlign: 'center', fontSize: '13px', color: '#cbd5e1', marginBottom: '40px' }}>
            🌐 TuneStream platform resolves natively to: <strong style={{ color: '#fff' }}>streams.tunemavens.com</strong>. Lossless master audio streams synchronized with TuneMavens backend.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
            {/* Trending Songs Section */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: 0 }}>Trending Releases</h2>
                <Link to="?view=explore" style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 'bold' }}>See all releases &rarr;</Link>
              </div>
              <HorizontalSlider 
                items={trendingSongs}
                renderItem={(song) => (
                  <div 
                    className="landing-feature-card" 
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer', boxSizing: 'border-box' }} 
                    onClick={() => handlePlaySong(song)}
                  >
                    <div style={{ width: '100%', paddingBottom: '100%', borderRadius: '3px', position: 'relative', marginBottom: '12px', overflow: 'hidden', background: '#0e1424' }}>
                      <img 
                        src={song.cover} 
                        alt={song.title} 
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '3px' }} 
                        onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${song.id}/400/400`; }}
                      />
                      <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.7)', borderRadius: '3px', padding: '2px 6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <RiPlayFill size={10} color="#00f2fe" />
                        <span style={{ fontSize: '9px', color: '#fff', fontWeight: 'bold' }}>Lossless</span>
                      </div>
                    </div>
                    <h3 data-no-i18n="true" style={{ fontSize: '15px', color: '#fff', margin: '0 0 4px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.title}</h3>
                    <p data-no-i18n="true" style={{ fontSize: '12px', color: 'var(--mu)', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.artist}</p>
                    <span style={{ fontSize: '11px', color: 'var(--cyan)' }}>{song.streams}</span>
                  </div>
                )}
              />
            </section>

            {/* Popular Creators Section */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: 0 }}>Signed Roster Artists</h2>
                <Link to="?view=explore" style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 'bold' }}>See all artists &rarr;</Link>
              </div>
              <HorizontalSlider 
                items={popularCreators}
                renderItem={(artist) => (
                  <div 
                    className="landing-feature-card" 
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '3px', textAlign: 'center', transition: 'all 0.2s ease', cursor: 'pointer', boxSizing: 'border-box' }} 
                    onClick={() => handleArtistClick(artist)}
                  >
                    <div style={{ width: '90px', height: '90px', borderRadius: '3px', margin: '0 auto 12px', overflow: 'hidden', background: '#0e1424', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <img 
                        src={artist.avatar} 
                        alt={artist.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '3px' }} 
                        onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${artist.id}/400/400`; }}
                      />
                    </div>
                    <h3 data-no-i18n="true" style={{ fontSize: '15px', color: '#fff', margin: '0 0 4px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{artist.name}</h3>
                    <span style={{ fontSize: '11px', color: 'var(--cyan)', display: 'block', marginBottom: '4px' }}>{artist.genre}</span>
                    <span style={{ fontSize: '11px', color: 'var(--mu)' }}>{artist.listeners}</span>
                  </div>
                )}
              />
            </section>

            {/* Popular Singles Section */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: 0 }}>Authoritative Singles</h2>
                <Link to="?view=explore" style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 'bold' }}>See all singles &rarr;</Link>
              </div>
              <HorizontalSlider 
                items={popularSingles}
                renderItem={(single) => (
                  <div 
                    className="landing-feature-card" 
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer', boxSizing: 'border-box' }} 
                    onClick={() => handlePlaySong(single)}
                  >
                    <div style={{ width: '100%', paddingBottom: '100%', borderRadius: '3px', position: 'relative', marginBottom: '12px', overflow: 'hidden', background: '#0e1424' }}>
                      <img 
                        src={single.cover} 
                        alt={single.title} 
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '3px' }} 
                        onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${single.id}/400/400`; }}
                      />
                      <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(16, 185, 129, 0.85)', borderRadius: '3px', padding: '2px 6px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ fontSize: '9px', color: '#fff', fontWeight: 'bold' }}>Single</span>
                      </div>
                    </div>
                    <h3 data-no-i18n="true" style={{ fontSize: '15px', color: '#fff', margin: '0 0 4px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{single.title}</h3>
                    <p data-no-i18n="true" style={{ fontSize: '12px', color: 'var(--mu)', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{single.artist}</p>
                    <span style={{ fontSize: '11px', color: 'var(--cyan)' }}>{single.dls}</span>
                  </div>
                )}
              />
            </section>

            {/* Popular Albums Section */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: 0 }}>Authoritative Albums &amp; EPs</h2>
                <Link to="?view=explore" style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 'bold' }}>See all albums &rarr;</Link>
              </div>
              <HorizontalSlider 
                items={popularAlbums}
                renderItem={(album) => (
                  <div 
                    className="landing-feature-card" 
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer', boxSizing: 'border-box' }} 
                    onClick={() => handlePlayAlbum(album)}
                  >
                    <div style={{ width: '100%', paddingBottom: '100%', borderRadius: '3px', position: 'relative', marginBottom: '12px', overflow: 'hidden', background: '#0e1424' }}>
                      <img 
                        src={album.cover} 
                        alt={album.title} 
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '3px' }} 
                        onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${album.id}/400/400`; }}
                      />
                      <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(168, 85, 247, 0.85)', borderRadius: '3px', padding: '2px 6px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ fontSize: '9px', color: '#fff', fontWeight: 'bold' }}>{album.type || 'Album'}</span>
                      </div>
                    </div>
                    <h3 data-no-i18n="true" style={{ fontSize: '15px', color: '#fff', margin: '0 0 4px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{album.title}</h3>
                    <p data-no-i18n="true" style={{ fontSize: '12px', color: 'var(--mu)', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{album.artist} · {album.year}</p>
                    <span style={{ fontSize: '11px', color: 'var(--mu)' }}>{album.tracksCount} tracks</span>
                  </div>
                )}
              />
            </section>

            {/* Live Concerts, Tours & Masterclasses in Progress */}
            <div style={{ marginTop: '40px', marginBottom: '40px' }}>
              <LiveEventsSection sessionUser={sessionUser} />
            </div>

            {/* Plans & Membership Access Options */}
            {renderPlansSection()}
          </div>
        </>
      );
    };

            const renderExplore = () => {
      if (selectedCreatorProfile) {
        return (
          <CreatorProfileView
            creator={selectedCreatorProfile}
            tracks={tracks}
            onBack={() => {
              setSelectedCreatorProfile(null);
              const sp = new URLSearchParams(location.search);
              sp.delete('creator');
              navigate(`?${sp.toString()}`, { replace: true });
            }}
            onPlayTrack={handlePlaySong}
            onNavigateToEpk={(sub) => navigate(`/epk/${sub}`)}
            sessionUser={sessionUser}
          />
        );
      }
      const popularCreators = (artists && artists.length > 0 ? artists : AUTHORITATIVE_CATALOG_ARTISTS).map(a => ({
        id: a.id,
        name: a.name,
        role: a.role || 'Signed Creator',
        genre: a.genre || 'Afro-fusion',
        listeners: a.listeners || (a.name === 'Ndufo' ? '3.4M listeners' : '1.2M listeners'),
        avatar: normalizeMediaUrl(a.avatar) || `/uploads/artwork/ndufo_cover.jpg`,
        banner: a.banner,
        bio: a.bio,
        location: a.location,
        socials: a.socials,
        followers_count: a.followers_count,
        subscribers_count: a.subscribers_count,
        creator_type: a.creator_type,
        subdomain: a.subdomain
      }));

      const singlesList = tracks.filter(t => t.releaseType === 'Single' || (t.release && t.release.toLowerCase().includes('single')));
      const popularSingles = singlesList.map((t, idx) => ({
        id: t.id || t.isrc || `s_${idx}`,
        title: t.title,
        artist: t.artist || 'Ndufo',
        dls: `${t.streams || t.plays || '1.0M'} streams`,
        cover: normalizeMediaUrl(t.coverArt || t.cover) || `/uploads/artwork/ndufo_cover.jpg`,
        isrc: t.isrc,
        genre: t.genre || 'Afrobeats',
        year: t.year || 2026,
        releaseDate: t.releaseDate || '2026-03-01',
        track: t
      }));

      const popularAlbums = albums.map((a, idx) => ({
        id: a.id || `alb_${idx}`,
        title: a.title,
        artist: a.artist || 'Ndufo',
        year: a.year || '2026',
        genre: a.genre || 'Afro-Fusion',
        tracksCount: a.tracksCount || (a.tracks ? a.tracks.length : 1),
        cover: normalizeMediaUrl(a.cover || a.coverArt) || `/uploads/artwork/ndufo_cover.jpg`,
        type: a.type || 'Album'
      }));

      const q = exploreSearch.toLowerCase().trim();

      // Collect available unique genres for filter dropdown
      const BASE_GENRES = [
        'Afrobeats',
        'Afro-House',
        'Deep-House',
        'Afro-fusion',
        'Amapiano',
        'Afro-Tech',
        'Kalenjin Folk-House',
        'Contemporary Soul',
        'Electronic',
        'Hip-Hop',
        'Pan-African'
      ];

      const allGenres = Array.from(new Set([
        ...BASE_GENRES,
        ...popularCreators.map(a => a.genre),
        ...popularSingles.map(s => s.genre),
        ...popularAlbums.map(al => al.genre)
      ].filter(Boolean))).sort();

      // Build unified collection
      let combinedItems = [];

      if (exploreFilter === 'all' || exploreFilter === 'creators') {
        combinedItems = combinedItems.concat(popularCreators.map(c => ({
          kind: 'creator',
          id: c.id,
          title: c.name,
          subtitle: `${c.genre} · ${c.role}`,
          genre: c.genre || 'Afrobeats',
          metaLeft: c.listeners,
          metaRight: 'Enter Web World 🌐 →',
          cover: c.avatar,
          year: 2026,
          date: '2026-01-01',
          data: c
        })));
      }

      if (exploreFilter === 'all' || exploreFilter === 'singles') {
        combinedItems = combinedItems.concat(popularSingles.map(s => ({
          kind: 'single',
          id: s.id,
          title: s.title,
          subtitle: s.artist,
          genre: s.genre || 'Afrobeats',
          metaLeft: s.isrc,
          metaRight: 'Listen ▶',
          cover: s.cover,
          year: Number(s.year) || 2026,
          date: s.releaseDate || '2026-02-15',
          data: s
        })));
      }

      if (exploreFilter === 'all' || exploreFilter === 'albums') {
        combinedItems = combinedItems.concat(popularAlbums.map(al => ({
          kind: 'album',
          id: al.id,
          title: al.title,
          subtitle: `${al.artist} · ${al.year}`,
          genre: al.genre || 'Afro-Fusion',
          metaLeft: `${al.tracksCount} tracks`,
          metaRight: 'Play Collection ▶',
          cover: al.cover,
          year: Number(al.year) || 2026,
          date: `${al.year || 2026}-01-01`,
          data: al
        })));
      }

      // 1. Text Search Filter (q)
      if (q) {
        combinedItems = combinedItems.filter(item => {
          return (
            (item.title && item.title.toLowerCase().includes(q)) ||
            (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
            (item.genre && item.genre.toLowerCase().includes(q)) ||
            (item.metaLeft && String(item.metaLeft).toLowerCase().includes(q))
          );
        });
      }

      // 2. Genre Filter
      if (exploreGenre !== 'all') {
        combinedItems = combinedItems.filter(item => 
          item.genre && item.genre.toLowerCase().includes(exploreGenre.toLowerCase())
        );
      }

      // 3. Sorting (Date, Genre, Title, Popularity)
      combinedItems.sort((a, b) => {
        if (exploreSort === 'newest') {
          return (b.year || 2026) - (a.year || 2026) || (b.title || '').localeCompare(a.title || '');
        }
        if (exploreSort === 'oldest') {
          return (a.year || 2026) - (b.year || 2026) || (a.title || '').localeCompare(b.title || '');
        }
        if (exploreSort === 'genre') {
          return (a.genre || '').localeCompare(b.genre || '');
        }
        if (exploreSort === 'title') {
          return (a.title || '').localeCompare(b.title || '');
        }
        if (exploreSort === 'popularity') {
          return String(b.id || '').localeCompare(String(a.id || ''));
        }
        return 0;
      });

      // 4. Pagination: 4 columns x 4 rows = 16 items per page
      const ITEMS_PER_PAGE = 16;
      const totalItems = combinedItems.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
      const currentPage = Math.min(Math.max(1, explorePage), totalPages);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const pageItems = combinedItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      const handleCardClick = (item) => {
        let targetCreator = null;
        if (item.kind === 'creator') {
          targetCreator = item.data;
        } else {
          const artistName = item.data?.artist || item.title || '';
          targetCreator = popularCreators.find(c => 
            c.name.toLowerCase() === artistName.toLowerCase() ||
            c.subdomain.toLowerCase() === artistName.toLowerCase().replace(/[^a-z0-9]/g, '')
          );
          if (!targetCreator) {
            targetCreator = {
              id: `art_${artistName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
              name: artistName,
              creator_type: item.kind === 'album' ? 'artist' : 'artist',
              role: 'Signed Recording Artist',
              genre: item.genre || 'Afro-fusion',
              bio: `${artistName} is an active creator in the TuneMavens ecosystem, producing high-fidelity lossless masters with automated split contracts and international sync clearance.`,
              avatar: item.cover,
              banner: item.cover,
              location: 'Nairobi, Kenya',
              listeners: '1.2M listeners',
              followers_count: 85000,
              subscribers_count: 22000,
              subdomain: artistName.toLowerCase().replace(/[^a-z0-9]/g, '')
            };
          }
        }
        setSelectedCreatorProfile(targetCreator);
        const sp = new URLSearchParams(location.search);
        sp.set('creator', targetCreator.subdomain || targetCreator.id);
        navigate(`?${sp.toString()}`, { replace: true });
        window.scrollTo({ top: 320, behavior: 'smooth' });
      };

      return (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '1240px', margin: '0 auto', boxSizing: 'border-box' }}>
          <p style={{ color: 'var(--mu)', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
            Discover, filter, and stream across signed creators, singles, and albums entered in the TuneMavens backend.
          </p>

          {/* Working Search Bar */}
          <div style={{ marginBottom: '16px', position: 'relative', maxWidth: '480px', margin: '0 auto 16px' }}>
            <RiSearchLine size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Search creators, tracks, singles, albums, genres..." 
              value={exploreSearch}
              onChange={(e) => {
                setExploreSearch(e.target.value);
                setExplorePage(1);
              }}
              style={{
                width: '100%',
                padding: '12px 38px 12px 44px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '3px',
                color: '#fff',
                outline: 'none',
                textAlign: 'left',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
            {exploreSearch && (
              <button
                type="button"
                data-no-i18n="true"
                aria-label="Clear search"
                data-testid="clear-search-btn"
                onClick={() => {
                  setExploreSearch('');
                  setExplorePage(1);
                }}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: 0
                }}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => { setExploreFilter('all'); setExplorePage(1); }}
              style={{
                padding: '6px 14px',
                borderRadius: '3px',
                border: exploreFilter === 'all' ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.1)',
                background: exploreFilter === 'all' ? '#00f2fe' : 'rgba(255,255,255,0.03)',
                color: exploreFilter === 'all' ? '#000' : '#fff',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              All Results
            </button>
            <button
              type="button"
              onClick={() => { setExploreFilter('creators'); setExplorePage(1); }}
              style={{
                padding: '6px 14px',
                borderRadius: '3px',
                border: exploreFilter === 'creators' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                background: exploreFilter === 'creators' ? '#10b981' : 'rgba(255,255,255,0.03)',
                color: exploreFilter === 'creators' ? '#000' : '#fff',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Signed Artists ({popularCreators.length})
            </button>
            <button
              type="button"
              onClick={() => { setExploreFilter('singles'); setExplorePage(1); }}
              style={{
                padding: '6px 14px',
                borderRadius: '3px',
                border: exploreFilter === 'singles' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                background: exploreFilter === 'singles' ? '#f59e0b' : 'rgba(255,255,255,0.03)',
                color: exploreFilter === 'singles' ? '#000' : '#fff',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Singles ({popularSingles.length})
            </button>
            <button
              type="button"
              onClick={() => { setExploreFilter('albums'); setExplorePage(1); }}
              style={{
                padding: '6px 14px',
                borderRadius: '3px',
                border: exploreFilter === 'albums' ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
                background: exploreFilter === 'albums' ? '#a855f7' : 'rgba(255,255,255,0.03)',
                color: exploreFilter === 'albums' ? '#fff' : '#fff',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Albums &amp; EPs ({popularAlbums.length})
            </button>
          </div>

          {/* Filtering & Sorting Controls (Genre & Date/Title/Popularity) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <ExploreCustomDropdown
              label="Genre:"
              value={exploreGenre}
              options={[
                { value: 'all', label: 'All Genres' },
                ...allGenres.map(g => ({ value: g, label: g }))
              ]}
              onChange={(val) => {
                setExploreGenre(val);
                setExplorePage(1);
              }}
            />

            <ExploreCustomDropdown
              label="Sort By:"
              value={exploreSort}
              options={[
                { value: 'newest', label: 'Newest Releases (Date)' },
                { value: 'oldest', label: 'Oldest Releases (Date)' },
                { value: 'title', label: 'Title (A – Z)' },
                { value: 'genre', label: 'Genre (A – Z)' },
                { value: 'popularity', label: 'Most Popular' }
              ]}
              onChange={(val) => {
                setExploreSort(val);
                setExplorePage(1);
              }}
            />

            <span style={{ fontSize: '13px', color: 'var(--cyan)', fontWeight: 'bold' }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'} found
            </span>
          </div>

          {/* 4 Columns x 4 Rows = 16 Items Grid */}
          {pageItems.length === 0 ? (
            <div style={{ padding: '48px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '3px', border: '1px dashed rgba(255,255,255,0.1)', marginBottom: '32px' }}>
              <p style={{ color: '#94a3b8', margin: '0 0 12px' }}>No catalogue entries matched your current filter.</p>
              <button
                type="button"
                onClick={() => {
                  setExploreSearch('');
                  setExploreGenre('all');
                  setExploreFilter('all');
                  setExplorePage(1);
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '3px',
                  border: '1px solid #00f2fe',
                  background: 'transparent',
                  color: '#00f2fe',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {pageItems.map((item, idx) => (
                <div 
                  key={`${item.kind}_${item.id}_${idx}`} 
                  className="landing-feature-card" 
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }} 
                  onClick={() => handleCardClick(item)}
                >
                  <div style={{ width: '100%', paddingBottom: '100%', borderRadius: '3px', overflow: 'hidden', position: 'relative', marginBottom: '12px', background: '#0e1424' }}>
                    <img 
                      src={item.cover} 
                      alt={item.title} 
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '3px' }} 
                      onError={(e) => { if (e.currentTarget.dataset.fallback) return; e.currentTarget.dataset.fallback = 'true'; e.currentTarget.src = '/uploads/artwork/ndufo_cover.jpg'; }}
                    />
                    <span style={{ 
                      position: 'absolute', 
                      top: '8px', 
                      left: '8px', 
                      fontSize: '9px', 
                      fontWeight: 'bold', 
                      background: item.kind === 'creator' ? 'rgba(0,0,0,0.7)' : item.kind === 'single' ? 'rgba(16,185,129,0.85)' : 'rgba(168,85,247,0.85)', 
                      color: item.kind === 'creator' ? '#00f2fe' : '#fff', 
                      padding: '2px 6px', 
                      borderRadius: '3px' 
                    }}>
                      {item.kind === 'creator' ? 'CREATOR WEB WORLD' : item.kind === 'single' ? 'SINGLE RELEASE' : (item.data.type || 'ALBUM')}
                    </span>
                    {item.kind !== 'creator' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.kind === 'album') handlePlayAlbum(item.data);
                          else handlePlaySong(item.data);
                        }}
                        style={{ position: 'absolute', bottom: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '3px', background: 'rgba(0,0,0,0.75)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        title="Quick Audio Preview"
                      >
                        <RiPlayFill size={15} color="#00f2fe" />
                      </button>
                    )}
                  </div>
                  <h3 data-no-i18n="true" style={{ fontSize: '15px', color: '#fff', margin: '0 0 4px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</h3>
                  <p data-no-i18n="true" style={{ fontSize: '12px', color: 'var(--mu)', margin: '0 0 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.subtitle}</p>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: 'var(--mu)', fontFamily: item.kind === 'single' ? 'monospace' : 'inherit' }}>{item.metaLeft}</span>
                    <span style={{ color: item.kind === 'creator' ? 'var(--cyan)' : item.kind === 'single' ? 'var(--green)' : '#c084fc', fontWeight: 'bold' }}>View Creator Profile &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls (4 Columns x 4 Rows = 16 Items) */}
          {totalItems > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setExplorePage(p => Math.max(1, p - 1))}
                style={{
                  padding: '7px 14px',
                  borderRadius: '3px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: currentPage <= 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)',
                  color: currentPage <= 1 ? '#64748b' : '#fff',
                  cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                ‹ Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setExplorePage(page)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '3px',
                    border: currentPage === page ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.15)',
                    background: currentPage === page ? '#00f2fe' : 'rgba(255,255,255,0.04)',
                    color: currentPage === page ? '#000' : '#fff',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setExplorePage(p => Math.min(totalPages, p + 1))}
                style={{
                  padding: '7px 14px',
                  borderRadius: '3px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: currentPage >= totalPages ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)',
                  color: currentPage >= totalPages ? '#64748b' : '#fff',
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                Next ›
              </button>
              <span style={{ fontSize: '12px', color: 'var(--mu)', marginLeft: '12px' }}>
                Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems} items (4 × 4)
              </span>
            </div>
          )}
        </div>
      );
    };

    

    
    const renderPlaylists = () => {
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
            <p style={{ color: 'var(--mu)', fontSize: '14px', margin: '0 0 16px' }}>Access your personalized streams and custom crates.</p>
            <Link to="/native-apps/tunestream?view=create-playlist" className="btn-primary" style={{ padding: '10px 16px', textDecoration: 'none' }}>
              + Create Playlist
            </Link>
          </div>

          {playlists.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.01)', borderRadius: '3px', border: '1px dashed rgba(255,255,255,0.1)', maxWidth: '500px', margin: '0 auto' }}>
              <RiFolderAddFill size={48} style={{ color: 'var(--mu)', margin: '0 auto 16px', display: 'block' }} />
              <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '8px' }}>No playlists yet</h3>
              <p style={{ color: 'var(--mu)', fontSize: '13px', marginBottom: '20px' }}>Create your first custom listening collection.</p>
              <Link to="/native-apps/tunestream?view=create-playlist" className="btn-primary">Create Now</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {playlists.map(p => (
                <div key={p.id} className="landing-feature-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer', textAlign: 'center' }} onClick={() => alert(`Streaming playlist: ${p.name}`)}>
                  <div style={{ width: '100%', height: '140px', borderRadius: '3px', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#fff' }}>
                    <RiHeadphoneFill size={42} style={{ opacity: 0.9 }} />
                  </div>
                  <h3 style={{ fontSize: '16px', color: '#fff', margin: '0 0 4px', fontWeight: '700' }}>{p.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--mu)', margin: '0 0 12px', minHeight: '36px', overflow: 'hidden', display: '-webkit-box', WebkitLineBreak: 'after-white-space', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                    <span style={{ color: 'var(--mu)' }}>{p.tracks} tracks</span>
                    <span style={{ color: 'var(--green)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}><RiPlayFill size={10} fill="currentColor" /> Play</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    const renderCreatePlaylist = () => {
      const handleCreate = (e) => {
        e.preventDefault();
        if (!newPlaylistName.trim()) {
          alert('Please enter a playlist name.');
          return;
        }
        const newPlaylist = {
          id: Date.now(),
          name: newPlaylistName,
          desc: newPlaylistDesc || 'Custom listening collection.',
          tracks: 0,
          bg: newPlaylistBg,
        };
        const newList = [...playlists, newPlaylist];
        savePlaylists(newList);
        
        setNewPlaylistName('');
        setNewPlaylistDesc('');
        
        alert('Playlist created successfully!');
        navigate('/native-apps/tunestream?view=playlists');
      };

      const bgOptions = [
        { label: 'Teal/Green', val: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { label: 'Purple/Indigo', val: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' },
        { label: 'Amber/Orange', val: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
        { label: 'Cyan/Blue', val: 'linear-gradient(135deg, #22d3ee 0%, #1d4ed8 100%)' },
        { label: 'Pink/Rose', val: 'linear-gradient(135deg, #ec4899 0%, #e11d48 100%)' },
      ];

      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left' }} className="glass-panel">
            <p style={{ color: 'var(--mu)', fontSize: '13px', marginBottom: '24px', textAlign: 'center' }}>Set up a new mix to organize your favorite lossless studio tracks.</p>
            
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#fff', marginBottom: '6px' }}>Playlist Name *</label>
                <input 
                  type="text" 
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="e.g. Acoustic Chill, Roadtrip Vibes" 
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#fff', marginBottom: '6px' }}>Description</label>
                <textarea 
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  placeholder="Describe your playlist..." 
                  rows="3"
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>Select Theme Art Color</label>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  {bgOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewPlaylistBg(opt.val)}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '3px',
                        background: opt.val,
                        border: newPlaylistBg === opt.val ? '2px solid #fff' : '2px solid transparent',
                        cursor: 'pointer',
                        boxShadow: newPlaylistBg === opt.val ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                      title={opt.label}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px', border: 'none', cursor: 'pointer' }}>
                  Create Playlist
                </button>
                <Link to="/native-apps/tunestream?view=playlists" className="plan-btn outline" style={{ flex: 1, padding: '12px', textAlign: 'center', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff' }}>
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      );
    };

    const renderBrowsePodcasts = () => {
      const podcasts = [
        { title: 'The Independent Artist Podcast', host: 'Intermaven Audio', desc: 'Survival tips, split cascade tutorials, and industry insights for creators.', bg: 'linear-gradient(135deg, #10b981 0%, #1e1b4b 100%)', icon: RiMicFill },
        { title: 'Intermaven Tech & Music', host: 'Intermaven Engineering', desc: 'Deep dives into decentralized compensation models and audio compression standards.', bg: 'linear-gradient(135deg, #8b5cf6 0%, #1e1b4b 100%)', icon: RiCpuFill },
        { title: 'African Soundscapes', host: 'Mercy Wangari', desc: 'High-fidelity field recordings and interviews with traditional instrument masters.', bg: 'linear-gradient(135deg, #f59e0b 0%, #1e1b4b 100%)', icon: RiGlobalFill },
        { title: 'Backstage Pass', host: 'Label Ops Network', desc: 'merch POS provisioning, live tickets setups, and regional settlement guides.', bg: 'linear-gradient(135deg, #3b82f6 0%, #1e1b4b 100%)', icon: RiTicket2Fill },
        { title: 'The Producer Roundtable', host: 'Alex Rivera', desc: 'Discussion on studio workflows, mastering presets, and regional sample packs.', bg: 'linear-gradient(135deg, #f43f5e 0%, #1e1b4b 100%)', icon: RiEqualizerFill },
        { title: 'Decentralized Audio Weekly', host: 'Intermaven Audio', desc: 'Exploring smart contract applications in the global music supply chain.', bg: 'linear-gradient(135deg, #0ea5e9 0%, #1e1b4b 100%)', icon: RiLinksFill },
        { title: 'Amapiano Pioneer Stories', host: 'Zola K.', desc: 'Oral history of the Pretoria club movements and sub-genre development.', bg: 'linear-gradient(135deg, #a855f7 0%, #1e1b4b 100%)', icon: RiRadioFill },
        { title: 'Off-Grid Streaming Insights', host: 'Intermaven Network', desc: 'How peer-to-peer storage models power local high-fidelity music streaming.', bg: 'linear-gradient(135deg, #10b981 0%, #1e1b4b 100%)', icon: RiWifiFill }
      ];

      const itemsPerPage = 4;
      const indexOfLast = podcastPage * itemsPerPage;
      const indexOfFirst = indexOfLast - itemsPerPage;
      const currentPodcasts = podcasts.slice(indexOfFirst, indexOfLast);

      return (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--mu)', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>Listen to tech talks, artist masterclasses, and field recordings from around the network.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {currentPodcasts.map((pod, idx) => {
              const IconComp = pod.icon;
              return (
                <div key={idx} className="landing-feature-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '24px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer', textAlign: 'center' }} onClick={() => alert(`Streaming podcast episode: ${pod.title}`)}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '3px', background: pod.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', margin: '0 auto 16px' }}>
                    <IconComp size={24} style={{ color: '#fff' }} />
                  </div>
                  <h3 style={{ fontSize: '16px', color: '#fff', margin: '0 0 4px', fontWeight: '700', lineHeight: '1.3' }}>{pod.title}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--cyan)', display: 'block', marginBottom: '12px' }}>By {pod.host}</span>
                  <p style={{ fontSize: '12px', color: 'var(--mu)', margin: 0, lineHeight: '1.5' }}>{pod.desc}</p>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={podcastPage}
            totalItems={podcasts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => { setPodcastPage(page); }}
          />
        </div>
      );
    };

    const renderApps = () => {
      const appListing = [
        { 
          title: 'TuneStream Mobile', 
          desc: 'The consumer streaming client with high-fidelity FLAC audio, 8GB offline caching, and direct creator micro-tipping.', 
          platforms: 'iOS & Android (Capacitor)', 
          logoKey: 'consumer',
          target: 'For Listeners & Fans',
          accent: '#00f2fe',
          features: [
            'Offline-cached 24-bit FLAC audio',
            'Direct creator tipping into split ledgers',
            'Region-aware editorial & community radio',
            'Unified Intermaven session & credits vault'
          ]
        },
        { 
          title: 'Creator Companion', 
          desc: 'Real-time metrics, automated split cascade ledger tracking, sync placement alerts, and instant payout status on the go.', 
          platforms: 'iOS & Android', 
          logoKey: 'companion',
          target: 'For Artists & Managers',
          accent: '#a855f7',
          features: [
            'Live split cascade revenue waterfall',
            'Instant royalty balances & tip stream',
            'Sync brief alerts & push licensing',
            'AI-assisted catalog release strategy'
          ]
        },
        { 
          title: 'TunePay POS', 
          desc: 'Live event ticketing, point-of-sale merchandise sales, and geo-gated settlement rails integrated into creator accounts.', 
          platforms: 'iOS & Android tablet', 
          logoKey: 'tunepay',
          target: 'For Labels & Venues',
          accent: '#10b981',
          features: [
            'Mobile STK push & contactless card checkout',
            'Inventory tracking for vinyl, CDs & merch',
            'Door ticket scanning & credential pass checks',
            'Automated show settlement split cascade'
          ]
        },
      ];

      return (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '100%', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '36px 32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', marginBottom: '32px', width: '100%', maxWidth: '100%', textAlign: 'left', boxSizing: 'border-box' }}>
            <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center' }}>Ecosystem App Distribution & Native Suites</h3>
            <p style={{ fontSize: '14.5px', color: '#cbd5e1', lineHeight: '1.6', margin: '0 auto 28px', textAlign: 'center', maxWidth: '880px' }}>
              TuneStream distributes high-performance native experiences across the shared Intermaven Network. Every app synchronizes your credentials, streaming library, and unified credits vault in real time:
            </p>
            <ul className="ts-ecosystem-summary-grid" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <RiHeadphoneFill size={32} style={{ color: '#00f2fe' }} />
                <div>
                  <strong style={{ color: '#fff', display: 'block', fontSize: '15px', marginBottom: '6px' }}>For Listeners</strong>
                  <span style={{ fontSize: '12.5px', color: 'var(--mu)', lineHeight: '1.5' }}>Lossless FLAC streaming, 8GB offline caching, and direct creator micro-tipping.</span>
                </div>
              </li>
              <li style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <RiLineChartFill size={32} style={{ color: '#a855f7' }} />
                <div>
                  <strong style={{ color: '#fff', display: 'block', fontSize: '15px', marginBottom: '6px' }}>For Artists & Managers</strong>
                  <span style={{ fontSize: '12.5px', color: 'var(--mu)', lineHeight: '1.5' }}>Live split cascade waterfall, accrued payout balances, and instant sync alerts.</span>
                </div>
              </li>
              <li style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <RiBankCardFill size={32} style={{ color: '#10b981' }} />
                <div>
                  <strong style={{ color: '#fff', display: 'block', fontSize: '15px', marginBottom: '6px' }}>For Labels & Venues</strong>
                  <span style={{ fontSize: '12.5px', color: 'var(--mu)', lineHeight: '1.5' }}>Point-of-sale merch checkout, M-Pesa STK mobile rails, and ticket door scanning.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="ts-ecosystem-apps-grid" style={{ margin: '0' }}>
            {appListing.map((ap, idx) => {
              return (
                <div key={idx} className="glass-panel" style={{ padding: '36px 30px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.65)', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: ap.accent }}></div>
                  <div style={{ width: '100%' }}>
                    <div style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                      <img src={ROLE_LOGOS[ap.logoKey]} alt={ap.title} style={{ height: '42px', width: 'auto', display: 'block', maxWidth: '240px', objectFit: 'contain' }} />
                    </div>
                    <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.06)', color: ap.accent, padding: '4px 12px', borderRadius: '14px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>
                      {ap.target}
                    </div>
                    <h3 style={{ fontSize: '22px', color: '#fff', margin: '0 0 10px', fontWeight: '800' }}>{ap.title}</h3>
                    <div style={{ color: '#94a3b8', fontSize: '11.5px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px' }}>{ap.platforms}</div>
                    <p style={{ fontSize: '13.5px', color: '#cbd5e1', marginBottom: '24px', lineHeight: '1.6', minHeight: '65px' }}>{ap.desc}</p>
                    
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', textAlign: 'left', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {ap.features.map((feat, fIdx) => (
                        <li key={fIdx} style={{ fontSize: '12.5px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: ap.accent, fontSize: '14px', lineHeight: 1 }}>✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', marginTop: 'auto' }}>
                    <button 
                      type="button" 
                      className="store-cta" 
                      onClick={() => alert(`App Store listing for ${ap.title} coming in Phase 5+.`)}
                      style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '6px', color: '#fff', textAlign: 'left', width: '100%', outline: 'none', justifyContent: 'center', transition: 'all 0.2s ease' }}
                    >
                      <RiAppleFill size={22} style={{ color: '#fff', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '9px', opacity: 0.7 }}>Download on</div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>App Store</div>
                      </div>
                    </button>
                    <button 
                      type="button" 
                      className="store-cta" 
                      onClick={() => alert(`Google Play listing for ${ap.title} coming in Phase 5+.`)}
                      style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '6px', color: '#fff', textAlign: 'left', width: '100%', outline: 'none', justifyContent: 'center', transition: 'all 0.2s ease' }}
                    >
                      <RiDownloadFill size={22} style={{ color: '#00f2fe', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '9px', opacity: 0.7 }}>Get it on</div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Google Play</div>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    const renderFreePlan = () => {
      const handleRegisterFree = () => {
        alert('Free registration initiated! Please complete your sign up on the next screen.');
        navigate('/register');
      };

      return (
        <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(7, 14, 27, 0.5) 100%)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '8px', marginBottom: '40px' }}>
            <span style={{ color: 'var(--green)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', tracking: '0.1em' }}>TuneStream Free</span>
            <h2 style={{ color: '#fff', fontSize: '36px', fontWeight: '900', margin: '12px 0' }}>Music for everyone.</h2>
            <p style={{ color: '#cbd5e1', fontSize: '16px', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>Play your favorite songs, create playlists, and explore independent African creators. Completely free, no credit card required.</p>
            <button onClick={handleRegisterFree} className="btn-primary" style={{ padding: '12px 32px', fontSize: '15px', border: 'none', cursor: 'pointer' }}>
              GET TUNESTREAM FREE
            </button>
          </div>

          <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', marginBottom: '24px', textAlign: 'center' }}>Why go with TuneStream Free?</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '50px' }}>
            {[
              { title: 'Play your way', desc: 'Listen to any song, album, or playlist on demand. Find new tracks tailored to your taste.', icon: '🎵' },
              { title: 'Shared credit bonus', desc: 'Receive 150 shared Intermaven Network credits upon registration, usable on any platform tools.', icon: '🪙' },
              { title: 'Create collections', desc: 'Build and share playlists of independent acts. Sync your crates across web and mobile.', icon: '🎧' },
              { title: 'Support independent creators', desc: 'Free streams still log plays in creator splits, backed by shared sponsorship pools.', icon: '🤝' },
            ].map((item, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '20px', borderRadius: '3px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '24px', display: 'block', marginBottom: '12px', textAlign: 'center' }}>{item.icon}</span>
                <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px', textAlign: 'center' }}>{item.title}</h4>
                <p style={{ color: 'var(--mu)', fontSize: '12px', margin: 0, lineHeight: '1.5', textAlign: 'center' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '3px' }}>
            <p style={{ color: 'var(--mu)', fontSize: '12px', margin: 0 }}>
              Ad-supported listening. Data rates apply when streaming on mobile networks. Shared credits vault requires a verified email registration. See <Link to="/help" style={{ color: 'var(--cyan)' }}>Help Center</Link> for credit policy details.
            </p>
          </div>
        </div>
      );
    };

    const renderPremiumPlan = () => {
      const handleGetPremium = () => {
        alert('Premium package selected! Proceeding to registration / credits activation.');
        navigate('/register');
      };

      return (
        <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.05) 0%, rgba(7, 14, 27, 0.5) 100%)', border: '1px solid rgba(34, 211, 238, 0.15)', borderRadius: '8px', marginBottom: '40px' }}>
            <span style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', tracking: '0.1em' }}>TuneStream Premium</span>
            <h2 style={{ color: '#fff', fontSize: '36px', fontWeight: '900', margin: '12px 0' }}>Go Premium. Stream without limits.</h2>
            <p style={{ color: '#cbd5e1', fontSize: '16px', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>Ad-free listening, lossless FLAC quality, offline caching, and direct creator support. Pay-as-you-go using our credit system.</p>
            <button 
              onClick={handleGetPremium} 
              className="btn-primary" 
              style={{ 
                padding: '12px 36px', 
                fontSize: '15px', 
                background: 'var(--cyan)', 
                color: '#000', 
                fontWeight: 'bold', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(34,211,238,0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              GET PREMIUM
            </button>
          </div>

          <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', marginBottom: '24px', textAlign: 'center' }}>Experience premium features</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '50px' }}>
            {[
              { title: 'Zero Ads', desc: 'Stream your music without any audio or visual advertisements. Total focus on the tunes.', icon: <RiVolumeMuteFill size={32} color="var(--cyan)" style={{ display: 'block', margin: '0 auto 12px' }} /> },
              { title: 'Lossless Studio Audio', desc: 'Enjoy high-fidelity 24-bit / 96kHz FLAC audio, preserving every detail from the mix studio.', icon: <RiEqualizerFill size={32} color="var(--cyan)" style={{ display: 'block', margin: '0 auto 12px' }} /> },
              { title: 'Offline Caching', desc: 'Save up to 8GB of music files directly to your mobile storage. Perfect for flights or remote zones.', icon: <RiDownloadFill size={32} color="var(--cyan)" style={{ display: 'block', margin: '0 auto 12px' }} /> },
              { title: 'Direct Tipping', desc: 'Unlock mid-listen tipping. Your support enters the cascade split directly to creator wallets.', icon: <RiCoinsFill size={32} color="var(--cyan)" style={{ display: 'block', margin: '0 auto 12px' }} /> },
            ].map((item, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '24px 20px', borderRadius: '6px', background: 'rgba(34, 211, 238, 0.01)', border: '1px solid rgba(34, 211, 238, 0.08)' }}>
                {item.icon}
                <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px', textAlign: 'center' }}>{item.title}</h4>
                <p style={{ color: 'var(--mu)', fontSize: '12px', margin: 0, lineHeight: '1.5', textAlign: 'center' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', marginBottom: '24px', textAlign: 'center' }}>Choose your Premium option</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '50px' }}>
            {[
              { name: 'Individual', price: 'Deducts 1 credit / stream', desc: 'For single listeners. 1 active device offline caching. Lossless streaming.', buttonText: 'Get Individual' },
              { name: 'Duo', price: 'Deducts 1.8 credits / stream', desc: '2 Premium accounts. Shared playlist mix. 2 devices offline caching.', buttonText: 'Get Duo' },
              { name: 'Family', price: 'Deducts 2.5 credits / stream', desc: 'Up to 6 Premium accounts. Kids player portal. Family mix playlist.', buttonText: 'Get Family' },
            ].map((plan, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '28px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px' }}>{plan.name}</h4>
                  <span style={{ color: 'var(--cyan)', fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>{plan.price}</span>
                  <p style={{ color: 'var(--mu)', fontSize: '12px', margin: '0 0 20px', lineHeight: '1.5' }}>{plan.desc}</p>
                </div>
                <button 
                  onClick={handleGetPremium} 
                  className="plan-btn outline" 
                  style={{ 
                    padding: '10px 16px', 
                    width: '100%', 
                    fontSize: '13px', 
                    fontWeight: 'bold', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.12)', 
                    color: '#fff', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--cyan)';
                    e.currentTarget.style.color = '#000';
                    e.currentTarget.style.borderColor = 'var(--cyan)';
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(34,211,238,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '3px' }}>
            <p style={{ color: 'var(--mu)', fontSize: '12px', margin: 0 }}>
              Premium consumption is billed directly to your shared Intermaven Network Credit balance. Credits are non-expiring. You can purchase credit top-up packages starting from $4.99 at any time in the <Link to="/pricing" style={{ color: 'var(--cyan)' }}>Pricing Panel</Link>.
            </p>
          </div>
        </div>
      );
    };

    const renderHelp = (tab = 'docs') => {
      if (tab === 'blog' || tab === 'forum') {
        return (
          <ConsumerBlogForumView
            sessionUser={sessionUser}
            initialSubTab={tab === 'forum' ? 'forum' : 'editorial'}
            onBackToExplore={() => {
              const sp = new URLSearchParams(location.search);
              sp.set('view', 'explore');
              navigate(`?${sp.toString()}`);
            }}
          />
        );
      }
      if (tab === 'tickets' || tab === 'support') {
        return (
          <ConsumerSupportDeskView
            sessionUser={sessionUser}
            catalogTracks={tracks}
          />
        );
      }
      return (
        <ConsumerHelpDocsView
          sessionUser={sessionUser}
          onNavigateToSupport={() => {
            const sp = new URLSearchParams(location.search);
            sp.set('view', 'support');
            navigate(`?${sp.toString()}`);
          }}
        />
      );
    };

    const handlePlaySong = (song) => {
    const match = (tracks && tracks.find(t => t.id === song.id || t.isrc === song.isrc || t.title === song.title)) || song;
    setActiveHiFiTrack(match);
    setIsHiFiPlaying(true);
  };

  const handleArtistClick = (artist) => {
    setSelectedCreatorProfile(artist);
    const sp = new URLSearchParams(location.search);
    sp.set('view', 'explore');
    sp.set('creator', artist.subdomain || (artist.name ? artist.name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'ndufo'));
    navigate(`?${sp.toString()}`);
  };

  const handlePlayAlbum = (album) => {
    const albumTrack = (tracks && tracks.find(t => t.album === album.title || t.albumId === album.id)) || {
      id: album.id,
      title: `${album.title} (Track 1)`,
      artist: album.artist,
      cover: album.cover,
      isrc: album.isrc || 'KE-TM1-26-00042',
      audioUrl: `/api/stream/track/${encodeURIComponent(album.title)}`
    };
    setActiveHiFiTrack(albumTrack);
    setIsHiFiPlaying(true);
  };

  const renderContent = () => {
      switch (view) {
        case 'explore':
          return renderExplore();
        case 'playlists':
          return renderPlaylists();
        case 'create-playlist':
          return renderCreatePlaylist();
        case 'browse-podcasts':
          return renderBrowsePodcasts();
        case 'apps':
          return renderApps();
        case 'free':
          return renderFreePlan();
        case 'premium':
          return renderPremiumPlan();
        case 'plans':
          return (
            <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
              {renderPlansSection()}
            </div>
          );
        case 'blog':
        case 'forum':
          return renderHelp(view === 'forum' ? 'forum' : 'blog');
        case 'support':
        case 'tickets':
          return renderHelp('tickets');
        case 'help':
        case 'docs':
          return renderHelp('docs');
        case 'concerts':
        case 'events':
        case 'live':
          return (
            <div style={{ marginTop: '30px', marginBottom: '40px' }}>
              <LiveEventsSection sessionUser={sessionUser} />
            </div>
          );
        case 'listen':
        default:
          return renderListen();
      }
    };

    pageContent = (
      <div 
        className="native-app-landing tunestream-landing" 
        style={{ background: getLandingBackground('tunestream'), color: '#f1f5f9', minHeight: '100vh', padding: '0 0 162px' }}
      >
        {renderTopHeader()}
        <div className="container" style={{ marginTop: view === 'listen' ? '40px' : '0', maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }}>
          {renderContent()}
        </div>
      </div>
    );
  } else {
    pageContent = (
      <div
        className="native-app-landing"
        style={{ '--app-accent': data.accent, '--app-accent-glow': data.accentGlow, background: getLandingBackground(normalizedSlug) }}
        data-testid={`native-app-landing-${data.slug}`}
      >
      <div className="hw">
        <div className="bgs">
          {slides.map((s, idx) => (
            <div
              key={idx}
              className={`bg ${currentSlide === idx ? 'on' : ''}`}
              style={{
                backgroundImage: `url(${HERO_IMAGE_MAP[s.bgKey] || listenHeroImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: currentSlide === idx
                  ? (titleHovered ? 'brightness(1.05) blur(0px)' : 'brightness(0.7) blur(1.5px)')
                  : 'none',
                transform: currentSlide === idx && titleHovered ? 'scale(1.04)' : 'scale(1)',
                transition: 'filter 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            />
          ))}
          <div
            className="bgo"
            style={{
              opacity: titleHovered ? 0.3 : 0.8,
              transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          />
        </div>

        <div className="hs">
          <div
            className="hcont"
            key={currentSlide}
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
            style={{ cursor: 'pointer' }}
          >
            <div className={`he hbadge ${slideState}`}>
              <span
                className="bdot"
                style={{
                  background: currentSlideData.dot,
                  animation: 'pulseGlow 2s infinite',
                }}
              />
              <span>{data.target} · {currentSlideData.badge}</span>
            </div>

            <h1 className="ht htitle">
              <span className={`ht-line ht-line-1 ${slideState}`}>{currentSlideData.hLine1}</span>
              <span
                className={`ht-line ht-line-2 ${slideState}`}
                style={{ color: currentSlideData.hLine2Color }}
              >
                {currentSlideData.hLine2}
              </span>
            </h1>

            <p className={`hp hsub ${slideState}`}>
              {currentSlideData.s}
            </p>

            <div className={`hb hbtns ${slideState}`}>
              {renderHeroCta(currentSlideData, 'b1')}
              {renderHeroCta(currentSlideData, 'b2')}
            </div>
          </div>
        </div>

        <div className={`sui-arrows ${slideState}`}>
          <button type="button" className="slide-nav prev" onClick={goToPrevSlide} aria-label="Previous slide" data-testid="landing-hero-prev">‹</button>
          <button type="button" className="slide-nav next" onClick={goToNextSlide} aria-label="Next slide" data-testid="landing-hero-next">›</button>
        </div>

        <div className={`sui-bottom ${slideState}`}>
          <div className="spr">
            <div className="spb" style={{ width: `${progress}%` }} />
          </div>
          <div className="sdots">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`sd ${index === currentSlide ? 'on' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                data-testid={`landing-hero-dot-${index}`}
              />
            ))}
          </div>
        </div>
      </div>

      <section className="landing-section landing-glance-section">
        <div className="container landing-glance">
          <div className="landing-glance-logo" aria-hidden="true">
            <div className="landing-app-tile">
              <div className="landing-app-tile-icon">{HeroIcon && <HeroIcon size={48} />}</div>
              <div className="landing-app-tile-label">{data.name}</div>
              <div className="landing-app-tile-pill">{data.target}</div>
            </div>
          </div>
          <div className="landing-glance-text">
            <span className="landing-section-eyebrow">{data.target}</span>
            <h2 className="landing-section-title" style={{ marginBottom: '20px' }}>{data.name}</h2>
            <p className="landing-lede" style={{ maxWidth: 'none', marginBottom: '24px' }}>{data.lede}</p>
            <div className="landing-cross-links">
              <Link to={data.webEquivalent.to} className="landing-cross-link" data-testid="landing-web-link">
                <RiExternalLinkFill size={13} /> {data.webEquivalent.label}
              </Link>
              <Link to={data.adminLink.to} className="landing-cross-link" data-testid="landing-admin-link">
                <RiSettings3Fill size={13} /> {data.adminLink.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-alt">
        <div className="container">
          <span className="landing-section-eyebrow">Capabilities</span>
          <h2 className="landing-section-title">Everything {data.target.toLowerCase().replace('for ', '')} actually need</h2>
          <div className="landing-features-grid">
            {data.features.map((f, i) => (
              <div key={i} className="landing-feature-card" data-testid={`landing-feature-${i}`}>
                <div className="landing-feature-num">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="landing-feature-title">{f.title}</h3>
                <p className="landing-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="container">
          <span className="landing-section-eyebrow">How it works</span>
          <h2 className="landing-section-title">Four steps from sign-in to settlement</h2>
          <div className="landing-steps">
            {data.howItWorks.map((s, i) => (
              <div key={i} className="landing-step">
                <div className="landing-step-num">{s.step}</div>
                <h3 className="landing-step-title">{s.title}</h3>
                <p className="landing-step-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-alt">
        <div className="container">
          <span className="landing-section-eyebrow">In the field</span>
          <h2 className="landing-section-title">What people say</h2>
          <div className="landing-testimonials">
            {data.testimonials.map((t, i) => (
              <blockquote key={i} className="landing-testimonial" data-testid={`landing-testimonial-${i}`}>
                <p>&ldquo;{t.quote}&rdquo;</p>
                <footer>
                  <strong>{t.author}</strong>
                  <span>{t.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="container">
          <span className="landing-section-eyebrow">FAQ</span>
          <h2 className="landing-section-title">Common questions</h2>
          <div className="landing-faq">
            {data.faq.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-cta-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="landing-section-eyebrow">Get it</span>
          <h2 className="landing-section-title" style={{ margin: '0 auto 12px' }}>{data.heroSlides[0].hLine1} {data.heroSlides[0].hLine2}</h2>
          <p className="landing-pricing-line">{data.pricingLine}</p>
          <div className="landing-hero-ctas" style={{ justifyContent: 'center', marginTop: '24px' }}>
            <button
              type="button"
              className="store-cta landing-cta"
              onClick={() => alert(`App Store listing for ${data.name} coming in Phase 5+`)}
              data-testid="landing-close-appstore"
            >
              <div className="store-cta-icon"><RiAppleFill size={22} /></div>
              <div className="store-cta-text">
                <span className="store-cta-sub">Download on the</span>
                <span className="store-cta-label">App Store</span>
              </div>
            </button>
            <button
              type="button"
              className="store-cta landing-cta"
              onClick={() => alert(`Google Play listing for ${data.name} coming in Phase 5+`)}
              data-testid="landing-close-googleplay"
            >
              <div className="store-cta-icon"><RiDownloadFill size={22} /></div>
              <div className="store-cta-text">
                <span className="store-cta-sub">Get it on</span>
                <span className="store-cta-label">Google Play</span>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', background: '#060813' }}>
      <LandingNavbar view={view} setView={(v) => navigate(`?view=${v}`)} sessionUser={sessionUser} onLogout={onLogout} />
      <div style={{ flex: 1 }}>
        {pageContent}
      </div>
            {activeHiFiTrack && (
        <HiFiAudioPlayer
          track={activeHiFiTrack}
          tracks={tracks}
          isPlaying={isHiFiPlaying}
          onTogglePlay={setIsHiFiPlaying}
          onTrackSelect={setActiveHiFiTrack}
          sessionUser={sessionUser}
          onClose={() => {
            setIsHiFiPlaying(false);
            setActiveHiFiTrack(null);
          }}
        />
      )}
      <LandingFooter view={view} />
    </div>
  );
}

function LandingNavbar({ view, setView, sessionUser, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [libraryDropdownOpen, setLibraryDropdownOpen] = useState(false);
  const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const libraryDropdownRef = useRef(null);
  const supportDropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (libraryDropdownRef.current && !libraryDropdownRef.current.contains(e.target)) {
        setLibraryDropdownOpen(false);
      }
      if (supportDropdownRef.current && !supportDropdownRef.current.contains(e.target)) {
        setSupportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner-container">
        {/* Brand Logo & Utility Tagline */}
        <div className="nav-logo-container-role" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', padding: '6px 0' }}>
          <Link to="/" onClick={() => { setView('listen'); setMobileOpen(false); }} className="nav-logo-link">
            <img
              src={tsLogo}
              alt="TuneStream Logo"
              className="logo-image-role logo-image"
            />
          </Link>
          <a
            href="https://tunemavens.com"
            style={{ fontSize: '12px', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', textAlign: 'center', marginTop: '-12px' }}
          >
            {"<< a tunemavens utility"}
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <RiCloseFill size={24} /> : <RiMenuFill size={24} />}
        </button>

        {/* Nav Links */}
        <ul className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <li>
            <Link to="?view=listen" className={`nav-link ${view === 'listen' ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
              Listen
            </Link>
          </li>
          <li>
            <Link to="?view=explore" className={`nav-link ${view === 'explore' ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
              Explore
            </Link>
          </li>
          <li className="dropdown-container" ref={libraryDropdownRef}>
            <button
              className="nav-link dropdown-trigger"
              onClick={() => setLibraryDropdownOpen(!libraryDropdownOpen)}
            >
              My Library
              <RiArrowDownSFill size={14} />
            </button>
            <ul className={`dropdown-menu ${libraryDropdownOpen ? 'open' : ''}`}>
              <li>
                <Link to="?view=playlists" className="dropdown-link" onClick={() => { setLibraryDropdownOpen(false); setMobileOpen(false); }}>
                  Playlists
                </Link>
              </li>
              <li>
                <Link to="?view=create-playlist" className="dropdown-link" onClick={() => { setLibraryDropdownOpen(false); setMobileOpen(false); }}>
                  Create Playlist
                </Link>
              </li>
              <li>
                <Link to="?view=browse-podcasts" className="dropdown-link" onClick={() => { setLibraryDropdownOpen(false); setMobileOpen(false); }}>
                  Browse Podcasts
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="?view=concerts" className={`nav-link ${view === 'concerts' || view === 'events' ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
              Live Shows
            </Link>
          </li>
          <li>
            <Link to="?view=apps" className={`nav-link ${view === 'apps' ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
              Apps
            </Link>
          </li>
          <li className="dropdown-container" ref={supportDropdownRef}>
            <button
              type="button"
              className={`nav-link dropdown-trigger ${['help', 'docs', 'blog', 'forum', 'support', 'tickets'].includes(view) ? 'active' : ''}`}
              onClick={() => {
                setLibraryDropdownOpen(false);
                setSupportDropdownOpen(!supportDropdownOpen);
              }}
            >
              Support &amp; Community
              <RiArrowDownSFill size={14} />
            </button>
            <ul className={`dropdown-menu ${supportDropdownOpen ? 'open' : ''}`}>
              <li>
                <Link
                  to="?view=blog"
                  className="dropdown-link"
                  onClick={() => {
                    setView('blog');
                    setSupportDropdownOpen(false);
                    setMobileOpen(false);
                  }}
                >
                  <RiFileList3Line size={16} /> Blog &amp; Forum
                </Link>
              </li>
              <li>
                <Link
                  to="?view=help"
                  className="dropdown-link"
                  onClick={() => {
                    setView('help');
                    setSupportDropdownOpen(false);
                    setMobileOpen(false);
                  }}
                >
                  <RiBookOpenFill size={16} /> Help &amp; Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="?view=support"
                  className="dropdown-link"
                  onClick={() => {
                    setView('support');
                    setSupportDropdownOpen(false);
                    setMobileOpen(false);
                  }}
                >
                  <RiCustomerService2Fill size={16} /> Support Desk
                </Link>
              </li>
            </ul>
          </li>

          {/* Mobile: Region Switcher + CTAs */}
          {mobileOpen && (
            <li style={{ padding: '8px 0', width: '100%' }}>
              <div style={{ marginBottom: '16px' }}>
                <RegionSwitcher />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                {sessionUser ? (
                  <Link to="/stream" className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }} onClick={() => setMobileOpen(false)}>Dashboard</Link>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary" style={{ width: '100%', textAlign: 'center', display: 'block' }} onClick={() => setMobileOpen(false)}>Log In</Link>
                    <Link to="/register" className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }} onClick={() => setMobileOpen(false)}>Start Free</Link>
                  </>
                )}
              </div>
            </li>
          )}
        </ul>

        {/* Desktop: Region Switcher + CTAs */}
        <div className="nav-desktop-actions-box">
          <div className="desktop-switcher">
            <RegionSwitcher />
          </div>
          <div className="nav-ctas">
            {sessionUser ? (
              <>
                <Link to="/stream" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Dashboard
                </Link>
                <button onClick={onLogout} className="btn-secondary" style={{ cursor: 'pointer' }}>
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">Log In</Link>
                <Link to="/register" className="btn-primary">Start Free</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function LandingFooter({ view }) {
  return (
    <footer className="landing-footer">
      <div className="footer-inner-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={tsLogo} alt="TuneStream Footer Logo" className="footer-logo-image" style={{ height: '38px', width: 'auto', display: 'block', margin: '0 auto' }} />
            </div>
            <div className="footer-desc">
              Next-generation music streaming built on the shared Intermaven network.
            </div>
            <div className="footer-host-link" style={{ marginTop: '4px' }}>
              streams.tunemavens.com
            </div>
            <div className="footer-host-link" style={{ marginTop: '0px' }}>
              intermaven.io
            </div>
          </div>

          {/* Product links */}
          <div className="footer-col">
            <div style={{ display: 'inline-block', textAlign: 'left' }}>
              <h4>TuneStream</h4>
              <div className="footer-links">
                <Link to="?view=listen" className="footer-link">Listen Now</Link>
                <Link to="/stream" className="footer-link">Web Player</Link>
                <Link to="?view=plans" className="footer-link">Membership Plans</Link>
                <Link to="?view=apps" className="footer-link">Ecosystem Apps</Link>
                <Link to="?view=playlists" className="footer-link">Playlists &amp; Crates</Link>
              </div>
            </div>
          </div>

          {/* Company links */}
          <div className="footer-col">
            <div style={{ display: 'inline-block', textAlign: 'left' }}>
              <h4>Support &amp; Community</h4>
              <div className="footer-links">
                <a href="https://tunemavens.com" className="footer-link" target="_blank" rel="noreferrer">For Creators</a>
                <Link to="?view=explore" className="footer-link">Discover Artists</Link>
                <Link to="?view=help" className="footer-link">Knowledge Base &amp; Docs</Link>
                <Link to="?view=blog" className="footer-link">Music &amp; Sound Blog</Link>
                <Link to="?view=support" className="footer-link">Support Tickets Desk</Link>
              </div>
            </div>
          </div>

          {/* Follow Us links */}
          <div className="footer-col">
            <div style={{ display: 'inline-block', textAlign: 'left' }}>
              <h4>Follow us</h4>
              <div className="footer-social">
                <a className="sico instagram" onClick={() => alert('Instagram handle coming soon!')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a className="sico x" onClick={() => alert('X handle coming soon!')}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </a>
                <a className="sico linkedin" onClick={() => alert('LinkedIn handle coming soon!')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a className="sico tiktok" onClick={() => alert('TikTok handle coming soon!')}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.43-.43-.64-.67-.07 3.26-.03 6.52-.05 9.77-.04 1.83-.56 3.73-1.88 5.02-1.5 1.54-3.83 2.19-5.94 1.86-2.52-.39-4.71-2.45-5.14-4.96-.58-3.08 1.21-6.38 4.23-7.21.94-.27 1.95-.31 2.91-.18V12.18c-1.28-.21-2.65-.05-3.79.62-1.89 1.12-2.73 3.52-2.12 5.62.58 2.09 2.74 3.59 4.9 3.32 1.76-.2 3.27-1.53 3.65-3.26.17-.75.14-1.53.15-2.3V4.08C13.06 2.76 12.89 1.38 12.525.02z"></path></svg>
                </a>
              </div>
              <div className="footer-copy">
                © 2026 TuneStream. A TuneMavens Utility.<br />Atlanta, USA
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-links">
            <a href="#privacy" className="fbl" onClick={() => alert('Privacy policy is synchronized with Intermaven.')}>Privacy Policy</a>
            <a href="#terms" className="fbl" onClick={() => alert('Terms of service are synchronized with Intermaven.')}>Terms of Service</a>
            <a href="#cookies" className="fbl" onClick={() => alert('Cookie policy is synchronized.')}>Cookie Policy</a>
            <a href="#refund" className="fbl" onClick={() => alert('Refund policy is synchronized.')}>Refund Policy</a>
          </div>
          <a 
            href="https://intermaven.io" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="intermaven-badge"
          >
            powered by <span>intermaven</span>
            <span className="badge-dot"></span>
          </a>
        </div>
      </div>
    </footer>
  );
}
