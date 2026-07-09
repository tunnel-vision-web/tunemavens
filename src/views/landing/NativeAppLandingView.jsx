import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { RiHeadphoneFill, RiLineChartFill, RiBankCardFill, RiAppleFill, RiDownloadFill, RiArrowRightFill, RiSmartphoneFill, RiPlayFill, RiDiscFill, RiDatabase2Fill, RiMicFill, RiCpuFill, RiGlobalFill, RiTicket2Fill, RiEqualizerFill, RiLinksFill, RiRadioFill, RiWifiFill, RiMusicFill, RiResetLeftFill, RiPauseFill, RiArrowRightSFill, RiExternalLinkFill, RiSettings3Fill, RiFolderAddFill } from 'react-icons/ri'
import { ROLE_LOGOS } from '../../components/PerfectForSidebar.jsx'
import FaqItem from '../../components/common/FaqItem.jsx'
import { useRegion } from '../../RegionContext.jsx'

import tunestreamHeaderImg from '../../assets/images/tunestream_header.png'
import tunestreamHeader2Img from '../../assets/images/tunestream_header_2.png'
import tunestreamHeader3Img from '../../assets/images/tunestream_header_3.png'

import listenHeroImg from '../../assets/images/listen_hero.png'
import heroMusic1Img from '../../assets/images/hero_music_1.png'
import heroMusic2Img from '../../assets/images/hero_music_2.png'
import heroMusic3Img from '../../assets/images/hero_music_3.png'
import heroMusic4Img from '../../assets/images/hero_music_4.png'
import distributeHeroImg from '../../assets/images/distribute_hero.png'

import userSupervisorImg from '../../assets/images/user_supervisor.png'
import consumerAppImg from '../../assets/images/consumer_app.png'
import appsLedgerImg from '../../assets/images/apps_ledger.png'
import userManagerImg from '../../assets/images/user_manager.png'
import appsSyncImg from '../../assets/images/apps_sync.png'

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
    <div style={{ position: 'relative', width: '100%', overflow: 'visible', padding: '0 28px' }}>
      <button
        type="button"
        onClick={() => scroll('left')}
        style={{
          position: 'absolute',
          left: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: 'rgba(7, 14, 27, 0.95)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.7)',
          fontSize: '22px',
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
        style={{
          position: 'absolute',
          right: '0',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: 'rgba(7, 14, 27, 0.95)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.7)',
          fontSize: '22px',
          fontWeight: 'bold',
          pointerEvents: 'auto'
        }}
        className="slider-arrow-btn"
      >›</button>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function NativeAppLandingView() {
  const { slug } = useParams();
  const normalizedSlug = (slug === 'tunestream' || slug === 'tunemavens') ? 'tunestream' : slug;
  const data = NATIVE_APP_LANDING_DATA[normalizedSlug];
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const view = searchParams.get('view') || 'listen';

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
      badge: 'Free Download · No Credit Card',
      headline1: 'Carry the catalogue.',
      headline2: 'Even off-grid.',
      headline2Color: '#10b981',
      sub: 'High-fidelity FLAC audio with cellular-aware streaming. Tip creators mid-track, share your credit vault across every device.',
    },
    {
      img: tunestreamHeader2Img,
      badge: 'FLAC · Lossless · Zero Ads',
      headline1: 'Hear every detail.',
      headline2: 'Nothing compressed.',
      headline2Color: '#22d3ee',
      sub: 'Studio-grade audio quality for listeners who refuse to settle. TuneStream delivers lossless audio straight from the source — free, forever.',
    },
    {
      img: tunestreamHeader3Img,
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
  const [tsSlide, setTsSlide] = useState(0);
  const [tsTextVisible, setTsTextVisible] = useState(true);
  const [tsHovered, setTsHovered] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [playerPlaying, setPlayerPlaying] = useState(true);
  const [playerProgress, setPlayerProgress] = useState(0);
  const tsSlideTimer = useRef(null);
  const playerTimer = useRef(null);
  const TS_SLIDE_INTERVAL = 8000;

  useEffect(() => {
    tsSlideTimer.current = setInterval(() => {
      setTsTextVisible(false);
      setTimeout(() => {
        setTsSlide(prev => (prev + 1) % TUNESTREAM_HERO_SLIDES.length);
        setTsTextVisible(true);
      }, 700);
    }, TS_SLIDE_INTERVAL);
    return () => clearInterval(tsSlideTimer.current);
  }, []);

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
  const SLIDE_DURATION = 48000;
  const TRANSITION_OUT_MS = 700;

  const slides = data?.heroSlides || [];
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
        const slide = TUNESTREAM_HERO_SLIDES[tsSlide];
        return (
          <>
            <div
              className="tunestream-app-header"
              style={{
                position: 'relative',
                height: 'calc(100vh - 62px)',
                minHeight: '480px',
                overflow: 'hidden',
                width: '100%',
              }}
              onMouseEnter={() => setTsHovered(true)}
              onMouseLeave={() => setTsHovered(false)}
            >
              {TUNESTREAM_HERO_SLIDES.map((s, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${s.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    opacity: tsSlide === i ? 1 : 0,
                    transition: 'opacity 1.2s cubic-bezier(0.4,0,0.2,1)',
                    filter: tsHovered ? 'brightness(0.95) blur(0px)' : 'brightness(0.55) blur(1px)',
                    transform: tsHovered ? 'scale(1.03)' : 'scale(1)',
                    zIndex: 0,
                  }}
                />
              ))}

              <div style={{
                position: 'absolute', inset: 0, zIndex: 1,
                background: tsHovered
                  ? 'linear-gradient(to bottom, rgba(7,14,27,0.15) 0%, rgba(7,14,27,0.55) 100%)'
                  : 'linear-gradient(to bottom, rgba(7,14,27,0.5) 0%, rgba(7,14,27,0.88) 100%)',
                transition: 'background 0.9s ease',
              }} />

              <div style={{ position: 'absolute', bottom: '22px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 3 }}>
                {TUNESTREAM_HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setTsTextVisible(false); setTimeout(() => { setTsSlide(i); setTsTextVisible(true); clearInterval(tsSlideTimer.current); tsSlideTimer.current = setInterval(() => { setTsTextVisible(false); setTimeout(() => { setTsSlide(prev => (prev + 1) % TUNESTREAM_HERO_SLIDES.length); setTsTextVisible(true); }, 700); }, TS_SLIDE_INTERVAL); }, 700); }}
                    style={{ width: tsSlide === i ? '24px' : '8px', height: '8px', borderRadius: '4px', background: tsSlide === i ? '#10b981' : 'rgba(255,255,255,0.35)', border: 'none', cursor: 'pointer', transition: 'all 0.4s ease', padding: 0 }}
                  />
                ))}
              </div>

              <div style={{
                position: 'relative', zIndex: 2,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                minHeight: 'calc(100vh - 62px)',
                padding: '120px 24px 120px',
                textAlign: 'center',
              }}>
                <div style={{ 
                  display: 'inline-flex', gap: '6px', alignItems: 'center', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '6px 14px', borderRadius: '20px', marginBottom: '22px',
                  opacity: tsTextVisible ? 1 : 0, transform: tsTextVisible ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s, transform 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s' 
                }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulseGlow 2s infinite' }} />
                  <span style={{ fontSize: '12px', color: '#a7f3d0', fontWeight: 600, letterSpacing: '0.3px' }}>{slide.badge}</span>
                </div>

                <h1 style={{ fontFamily: '"Sansation", sans-serif', fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '18px', maxWidth: '700px' }}>
                  <span style={{ display: 'block', opacity: tsTextVisible ? 1 : 0, transform: tsTextVisible ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1) 0.2s, transform 0.7s cubic-bezier(0.4,0,0.2,1) 0.2s' }}>{slide.headline1}</span>
                  <span style={{ display: 'block', color: slide.headline2Color, opacity: tsTextVisible ? 1 : 0, transform: tsTextVisible ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1) 0.3s, transform 0.7s cubic-bezier(0.4,0,0.2,1) 0.3s' }}>{slide.headline2}</span>
                </h1>

                <p style={{ 
                  fontSize: '16px', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '32px', maxWidth: '580px',
                  opacity: tsTextVisible ? 1 : 0, transform: tsTextVisible ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1) 0.4s, transform 0.7s cubic-bezier(0.4,0,0.2,1) 0.4s'
                }}>
                  {slide.sub}
                </p>

                <div style={{ 
                  display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap',
                  opacity: tsTextVisible ? 1 : 0, transform: tsTextVisible ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1) 0.5s, transform 0.7s cubic-bezier(0.4,0,0.2,1) 0.5s'
                }}>
                  <button
                    onClick={() => alert('TuneStream — Download Free on iOS & Android coming soon!')}
                    className="btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '15px', padding: '13px 26px' }}
                  >
                    <RiDownloadFill size={16} /> Download Free
                  </button>
                  <a
                    href="#plans-section"
                    className="plan-btn outline"
                    onClick={(e) => { e.preventDefault(); scrollToSection('plans-section'); }}
                    style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', padding: '13px 26px', borderRadius: '4px', color: '#fff', border: '1px solid rgba(255,255,255,0.22)', fontSize: '15px', transition: 'all 0.3s ease' }}
                  >
                    View Plans
                  </a>
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

      const headerMeta = {
        explore: { title: 'Explore Creators', breadcrumb: 'Explore' },
        playlists: { title: 'My Playlists', breadcrumb: 'Library / Playlists' },
        'create-playlist': { title: 'Create Playlist', breadcrumb: 'Library / Create' },
        'browse-podcasts': { title: 'Browse Podcasts', breadcrumb: 'Library / Podcasts' },
        apps: { title: 'TuneStream Apps', breadcrumb: 'Apps' },
        free: { title: 'TuneStream Free', breadcrumb: 'Plans / Free' },
        premium: { title: 'TuneStream Premium', breadcrumb: 'Plans / Premium' },
        help: { title: 'Support & Community', breadcrumb: 'Support' }
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

    const renderListen = () => {
      const trendingSongs = [
        { id: 't1', title: 'Midnight Cruise', artist: 'Alex Rivera', streams: '1.2M streams', bg: 'linear-gradient(135deg, #8b5cf6 0%, #22d3ee 100%)' },
        { id: 't2', title: 'Lagos Vibe', artist: 'Tunde & Friends', streams: '890K streams', bg: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' },
        { id: 't3', title: 'Sunset in Nairobi', artist: 'Mercy Wangari', streams: '620K streams', bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { id: 't4', title: 'Desert Wind', artist: 'Youssef Bilal', streams: '450K streams', bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
        { id: 't5', title: 'Table Mountain Sunrise', artist: 'Zola K.', streams: '310K streams', bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
        { id: 't6', title: 'Highlife Summer', artist: 'Kofi Mensah', streams: '290K streams', bg: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)' },
        { id: 't7', title: 'Amapiano Horizon', artist: 'DJ Maphor', streams: '270K streams', bg: 'linear-gradient(135deg, #f43f5e 0%, #8b5cf6 100%)' },
        { id: 't8', title: 'Sahel Journey', artist: 'Fatoumata D.', streams: '250K streams', bg: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)' },
        { id: 't9', title: 'Rift Valley Sunset', artist: 'Sauti Band', streams: '210K streams', bg: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' },
        { id: 't10', title: 'Bongo Flava Chill', artist: 'Kidest G.', streams: '180K streams', bg: 'linear-gradient(135deg, #22d3ee 0%, #d97706 100%)' },
      ];

      const popularCreators = [
        { name: 'Alex Rivera', listeners: '1.5M listeners', avatar: '🎙️', bg: '#8b5cf6' },
        { name: 'Tunde & Friends', listeners: '1.1M listeners', avatar: '🥁', bg: '#ec4899' },
        { name: 'Mercy Wangari', listeners: '900K listeners', avatar: '🎤', bg: '#10b981' },
        { name: 'Youssef Bilal', listeners: '800K listeners', avatar: '🎸', bg: '#f59e0b' },
        { name: 'Zola K.', listeners: '500K listeners', avatar: '🎷', bg: '#3b82f6' },
        { name: 'Kofi Mensah', listeners: '450K listeners', avatar: '🪘', bg: '#0ea5e9' },
        { name: 'DJ Maphor', listeners: '400K listeners', avatar: '🎛️', bg: '#8b5cf6' },
        { name: 'Fatoumata D.', listeners: '350K listeners', avatar: '🎻', bg: '#f43f5e' },
        { name: 'Sauti Band', listeners: '300K listeners', avatar: '🎺', bg: '#10b981' },
        { name: 'Kidest G.', listeners: '250K listeners', avatar: '🎹', bg: '#22d3ee' },
      ];

      const popularSingles = [
        { title: 'City Lights', artist: 'Alex Rivera', dls: '400K downloads', bg: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' },
        { title: 'Amapiano Bounce', artist: 'Zola K.', dls: '320K downloads', bg: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)' },
        { title: 'Zilizopendwa Remix', artist: 'Mercy Wangari', dls: '280K downloads', bg: 'linear-gradient(135deg, #6d28d9 0%, #10b981 100%)' },
        { title: 'Highlife High', artist: 'Tunde & Friends', dls: '210K downloads', bg: 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)' },
        { title: 'Bongo Flava Anthem', artist: 'Zola K.', dls: '190K downloads', bg: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)' },
        { title: 'Sahel Wind', artist: 'Youssef Bilal', dls: '170K downloads', bg: 'linear-gradient(135deg, #8b5cf6 0%, #10b981 100%)' },
        { title: 'Rift Valley Groove', artist: 'Sauti Band', dls: '150K downloads', bg: 'linear-gradient(135deg, #ec4899 0%, #22d3ee 100%)' },
        { title: 'Cape Town Chill', artist: 'Zola K.', dls: '130K downloads', bg: 'linear-gradient(135deg, #3b82f6 0%, #f59e0b 100%)' },
        { title: 'Lagos Night', artist: 'Tunde & Friends', dls: '110K downloads', bg: 'linear-gradient(135deg, #10b981 0%, #ec4899 100%)' },
        { title: 'Sahara Wind', artist: 'Youssef Bilal', dls: '95K downloads', bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
      ];

      const popularAlbums = [
        { title: 'Afro-Futurism Vol. 1', artist: 'Alex Rivera', year: '2026', bg: 'linear-gradient(135deg, #2563eb 0%, #ec4899 100%)' },
        { title: 'Nairobi Nights', artist: 'Mercy Wangari', year: '2025', bg: 'linear-gradient(135deg, #059669 0%, #d97706 100%)' },
        { title: 'Lagos to London', artist: 'Tunde & Friends', year: '2026', bg: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)' },
        { title: 'Sahara Groove', artist: 'Youssef Bilal', year: '2024', bg: 'linear-gradient(135deg, #b91c1c 0%, #d97706 100%)' },
        { title: 'Cape Town Chill', artist: 'Zola K.', year: '2026', bg: 'linear-gradient(135deg, #0891b2 0%, #4f46e5 100%)' },
        { title: 'Highlife Legacy', artist: 'Kofi Mensah', year: '2025', bg: 'linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)' },
        { title: 'Amapiano Sessions', artist: 'DJ Maphor', year: '2026', bg: 'linear-gradient(135deg, #ec4899 0%, #22d3ee 100%)' },
        { title: 'Sahel Soul', artist: 'Fatoumata D.', year: '2025', bg: 'linear-gradient(135deg, #f59e0b 0%, #3b82f6 100%)' },
        { title: 'Rift Valley Sessions', artist: 'Sauti Band', year: '2026', bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { title: 'Ethio-Jazz Anthology', artist: 'Kidest G.', year: '2024', bg: 'linear-gradient(135deg, #22d3ee 0%, #8b5cf6 100%)' },
      ];

      return (
        <>
          <div style={{ background: 'rgba(34, 211, 238, 0.08)', borderBottom: '1px solid rgba(34, 211, 238, 0.15)', padding: '12px 24px', borderRadius: '8px', textAlign: 'center', fontSize: '13px', color: '#cbd5e1', marginBottom: '40px' }}>
            🌐 TuneStream platform resolves natively to: <strong style={{ color: '#fff' }}>streams.tunemavens.com</strong>. Map containers securely in the <Link to="/dashboard" style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>Domain Mappings Admin Console</Link>.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: 0 }}>Trending Songs</h2>
                <Link to="/native-apps/tunestream?view=explore" style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 'bold' }}>See all</Link>
              </div>
              <HorizontalSlider 
                items={trendingSongs}
                renderItem={(song) => (
                  <div className="landing-feature-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer', boxSizing: 'border-box' }} onClick={() => alert(`Playing: ${song.title} by ${song.artist}`)}>
                    <div style={{ width: '100%', paddingBottom: '100%', borderRadius: '3px', background: song.bg, position: 'relative', marginBottom: '12px' }}>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RiMusicFill size={32} style={{ color: '#fff', opacity: 0.85 }} />
                      </div>
                    </div>
                    <h3 style={{ fontSize: '15px', color: '#fff', margin: '0 0 4px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--mu)', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.artist}</p>
                    <span style={{ fontSize: '11px', color: 'var(--cyan)' }}>{song.streams}</span>
                  </div>
                )}
              />
            </section>

            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: 0 }}>Popular Creators</h2>
                <Link to="/native-apps/tunestream?view=explore" style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 'bold' }}>See all</Link>
              </div>
              <HorizontalSlider 
                items={popularCreators}
                renderItem={(artist) => (
                  <div className="landing-feature-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '3px', textAlign: 'center', transition: 'all 0.2s ease', cursor: 'pointer', boxSizing: 'border-box' }} onClick={() => alert(`Opening ${artist.name}'s Profile`)}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '3px', background: artist.bg, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>{artist.avatar}</div>
                    <h3 style={{ fontSize: '15px', color: '#fff', margin: '0 0 4px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{artist.name}</h3>
                    <span style={{ fontSize: '11px', color: 'var(--mu)' }}>{artist.listeners}</span>
                  </div>
                )}
              />
            </section>

            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: 0 }}>Popular Singles</h2>
                <Link to="/native-apps/tunestream?view=explore" style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 'bold' }}>See all</Link>
              </div>
              <HorizontalSlider 
                items={popularSingles}
                renderItem={(single) => (
                  <div className="landing-feature-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer', boxSizing: 'border-box' }} onClick={() => alert(`Playing: ${single.title}`)}>
                    <div style={{ width: '100%', paddingBottom: '100%', borderRadius: '3px', background: single.bg, position: 'relative', marginBottom: '12px' }}>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RiDiscFill size={32} style={{ color: '#fff', opacity: 0.85 }} />
                      </div>
                    </div>
                    <h3 style={{ fontSize: '15px', color: '#fff', margin: '0 0 4px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{single.title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--mu)', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{single.artist}</p>
                    <span style={{ fontSize: '11px', color: 'var(--cyan)' }}>{single.dls}</span>
                  </div>
                )}
              />
            </section>

            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: 0 }}>Popular Albums</h2>
                <Link to="/native-apps/tunestream?view=explore" style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 'bold' }}>See all</Link>
              </div>
              <HorizontalSlider 
                items={popularAlbums}
                renderItem={(album) => (
                  <div className="landing-feature-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer', boxSizing: 'border-box' }} onClick={() => alert(`Opening Album: ${album.title}`)}>
                    <div style={{ width: '100%', paddingBottom: '100%', borderRadius: '3px', background: album.bg, position: 'relative', marginBottom: '12px' }}>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RiDatabase2Fill size={32} style={{ color: '#fff', opacity: 0.85 }} />
                      </div>
                    </div>
                    <h3 style={{ fontSize: '15px', color: '#fff', margin: '0 0 4px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{album.title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--mu)', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{album.artist}</p>
                    <span style={{ fontSize: '11px', color: 'var(--mu)' }}>{album.year} · Album</span>
                  </div>
                )}
              />
            </section>

            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: 0 }}>Featured Charts</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                {[
                  { name: 'Top 50 Global', desc: 'The most streamed tracks globally on TuneStream.', bg: 'linear-gradient(135deg, #f43f5e 0%, #10b981 100%)' },
                  { name: 'Naija Hot 20', desc: 'The biggest tracks out of Nigeria this week.', bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
                  { name: 'East Africa Hits', desc: 'Top charting tracks from Kenya, Uganda, Tanzania.', bg: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)' },
                  { name: 'Amapiano Kings', desc: 'Curated mix of the hottest South African sounds.', bg: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)' },
                  { name: 'Alternative Africa', desc: 'Discover the best indie and electronic talent.', bg: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' },
                ].map((chart, idx) => (
                  <div key={idx} className="landing-feature-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer' }} onClick={() => alert(`Opening Chart: ${chart.name}`)}>
                    <div style={{ width: '100%', paddingBottom: '100%', borderRadius: '3px', background: chart.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', padding: '12px', boxSizing: 'border-box' }}>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{chart.name}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--mu)', margin: 0 }}>{chart.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section id="plans-section" style={{ padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '60px', textAlign: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <span className="landing-section-eyebrow" style={{ color: 'var(--green)' }}>Choose Your Vibe</span>
              <h2 className="landing-section-title" style={{ color: '#fff', fontSize: '32px', fontWeight: '800', textAlign: 'center', margin: '0 auto 0' }}>TuneStream Listening Plans</h2>
              <p style={{ color: 'var(--mu)', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>Flexible plans built around the shared Intermaven Network ecosystem.</p>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
              <div className="glass-panel" style={{ flex: '1 1 300px', maxWidth: '380px', padding: '32px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)' }}>
                <div>
                  <span style={{ color: 'var(--green)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', tracking: '0.05em' }}>Free Tier</span>
                  <h3 style={{ fontSize: '24px', color: '#fff', margin: '8px 0 16px', fontWeight: '800' }}>TuneStream Free</h3>
                  <p style={{ fontSize: '14px', color: 'var(--mu)', marginBottom: '24px' }}>Ad-supported music streaming. No commitment, completely free, no credit card required.</p>
                  
                  <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '16px 0' }} />
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                    <li>✓ 150 shared Intermaven credits at signup</li>
                    <li>✓ Unlimited music streaming (web and mobile)</li>
                    <li>✓ Basic quality audio</li>
                    <li>✓ Ad-supported</li>
                  </ul>
                </div>
                
                <Link to="/native-apps/tunestream?view=free" className="btn-primary" style={{ textAlign: 'center', width: '100%', padding: '12px' }}>
                  Learn More
                </Link>
              </div>

              <div className="glass-panel" style={{ flex: '1 1 300px', maxWidth: '380px', padding: '32px', border: '1px solid var(--green)', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(16,185,129,0.02)', boxShadow: '0 8px 30px rgba(16,185,129,0.08)' }}>
                <div>
                  <span style={{ color: 'var(--cyan)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', tracking: '0.05em' }}>Premium Tier</span>
                  <h3 style={{ fontSize: '24px', color: '#fff', margin: '8px 0 16px', fontWeight: '800' }}>TuneStream Premium</h3>
                  <p style={{ fontSize: '14px', color: 'var(--mu)', marginBottom: '24px' }}>Ad-free listening. High-fidelity lossless audio and offline caching. Paid via credits.</p>
                  
                  <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '16px 0' }} />
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                    <li>✓ Zero Ads for uninterrupted listening</li>
                    <li>✓ Lossless FLAC audio (24-bit / 96kHz)</li>
                    <li>✓ Offline downloads up to 8GB cache</li>
                    <li>✓ One-tap tipping to independent artists</li>
                    <li>✓ Deducts credits automatically per listen</li>
                  </ul>
                </div>
                
                <Link to="/native-apps/tunestream?view=premium" className="btn-primary" style={{ textAlign: 'center', width: '100%', padding: '12px', background: '#3b82f6', backgroundImage: 'none', border: 'none' }}>
                  Go Premium
                </Link>
              </div>
            </div>
          </section>
        </>
      );
    };

    const renderExplore = () => {
      const creators = [
        { name: 'Alex Rivera', genre: 'Afrobeats', location: 'Lagos, Nigeria', streams: '1.2M', avatar: '🎙️', bg: '#8b5cf6' },
        { name: 'Tunde & Friends', genre: 'Highlife', location: 'Accra, Ghana', streams: '890K', avatar: '🥁', bg: '#ec4899' },
        { name: 'Mercy Wangari', genre: 'Afrosoul', location: 'Nairobi, Kenya', streams: '620K', avatar: '🎤', bg: '#10b981' },
        { name: 'Youssef Bilal', genre: 'Desert Blues', location: 'Marrakech, Morocco', streams: '450K', avatar: '🎸', bg: '#f59e0b' },
        { name: 'Zola K.', genre: 'Amapiano', location: 'Soweto, South Africa', streams: '310K', avatar: '🎷', bg: '#3b82f6' },
        { name: 'Fatoumata D.', genre: 'Wassoulou', location: 'Bamako, Mali', streams: '280K', avatar: '🎻', bg: '#06b6d4' },
        { name: 'Sauti Band', genre: 'Afropop', location: 'Dar es Salaam', streams: '190K', avatar: '🎺', bg: '#f43f5e' },
        { name: 'Kidest G.', genre: 'Ethio-Jazz', location: 'Addis Ababa', streams: '150K', avatar: '🎹', bg: '#10b981' },
        { name: 'Desta A.', genre: 'Ethio-Soul', location: 'Bahir Dar', streams: '120K', avatar: '🎙️', bg: '#8b5cf6' },
        { name: 'Kwame O.', genre: 'Hiplife', location: 'Kumasi', streams: '110K', avatar: '🥁', bg: '#ec4899' },
        { name: 'Chioma B.', genre: 'Igbo Rap', location: 'Enugu', streams: '95K', avatar: '🎤', bg: '#10b981' },
        { name: 'Moctar S.', genre: 'Tuareg Rock', location: 'Agadez', streams: '85K', avatar: '🎸', bg: '#f59e0b' }
      ];

      const itemsPerPage = 16;
      const indexOfLast = explorePage * itemsPerPage;
      const indexOfFirst = indexOfLast - itemsPerPage;
      const currentCreators = creators.slice(indexOfFirst, indexOfLast);

      return (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--mu)', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>Discover new talent and verify their splits on the Intermaven shared ledger.</p>
          
          <div style={{ marginBottom: '30px', position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
            <input 
              type="text" 
              placeholder="Search creators, genres, or locations..." 
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', outline: 'none', textAlign: 'center' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {currentCreators.map((c, idx) => (
              <div key={idx} className="landing-feature-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer', textAlign: 'center' }} onClick={() => alert(`Opening EPK dashboard for ${c.name}`)}>
                <div style={{ width: '100%', height: '140px', borderRadius: '3px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', marginBottom: '16px' }}>{c.avatar}</div>
                <h3 style={{ fontSize: '16px', color: '#fff', margin: '0 0 4px', fontWeight: '700' }}>{c.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--mu)', margin: '0 0 8px' }}>{c.genre} · {c.location}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                  <span style={{ color: 'var(--mu)' }}>{c.streams} streams</span>
                  <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>View EPK →</span>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={explorePage}
            totalItems={creators.length}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => { setExplorePage(page); }}
          />
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
        { title: 'TuneStream Mobile', desc: 'The consumer streaming client with high-fidelity FLAC audio and 8GB offline caching.', platforms: 'iOS & Android (Capacitor)', logoKey: 'consumer' },
        { title: 'Creator Companion', desc: 'Real-time metrics, split cascade ledger tracking, and instant payout status.', platforms: 'iOS & Android', logoKey: 'companion' },
        { title: 'TunePay POS', desc: 'Live event ticketing, point-of-sale merch tools, and geo-gated settlement rails.', platforms: 'iOS & Android tablet', logoKey: 'tunepay' },
      ];

      return (
        <div style={{ textAlign: 'center' }}>
          <div className="glass-panel" style={{ padding: '32px 24px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', marginBottom: '32px', maxWidth: '800px', margin: '0 auto 32px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', color: '#fff', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>Ecosystem App Distribution</h3>
            <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 20px 0', textAlign: 'center' }}>
              TuneStream distributes native experiences across the shared Intermaven Network. Our apps keep your session and credits synchronized:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
              <li style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', textAlign: 'center' }}>
                <RiHeadphoneFill size={28} style={{ color: 'var(--cyan)' }} />
                <div>
                  <strong style={{ color: '#fff', display: 'block', fontSize: '14px', marginBottom: '4px' }}>For Listeners</strong>
                  <span style={{ fontSize: '12px', color: 'var(--mu)', lineHeight: '1.4' }}>Stream music, cache high-quality files offline, and tip creators directly.</span>
                </div>
              </li>
              <li style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', textAlign: 'center' }}>
                <RiLineChartFill size={28} style={{ color: 'var(--purple)' }} />
                <div>
                  <strong style={{ color: '#fff', display: 'block', fontSize: '14px', marginBottom: '4px' }}>For Artists</strong>
                  <span style={{ fontSize: '12px', color: 'var(--mu)', lineHeight: '1.4' }}>Track splits, payout balances, sync cascades, and release analytics.</span>
                </div>
              </li>
              <li style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', textAlign: 'center' }}>
                <RiBankCardFill size={28} style={{ color: 'var(--green)' }} />
                <div>
                  <strong style={{ color: '#fff', display: 'block', fontSize: '14px', marginBottom: '4px' }}>For Labels & Venues</strong>
                  <span style={{ fontSize: '12px', color: 'var(--mu)', lineHeight: '1.4' }}>Process ticket scans, sell merch on-site, and manage event settlements.</span>
                </div>
              </li>
            </ul>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
            {appListing.map((ap, idx) => {
              return (
                <div key={idx} className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)', alignItems: 'center', textAlign: 'center' }}>
                  <div>
                    <img src={ROLE_LOGOS[ap.logoKey]} alt={ap.title} style={{ height: '48px', width: 'auto', display: 'block', margin: '0 auto 16px' }} />
                    <span style={{ color: 'var(--mu)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', tracking: '0.05em' }}>{ap.platforms}</span>
                    <h3 style={{ fontSize: '20px', color: '#fff', margin: '8px 0 12px', fontWeight: '800' }}>{ap.title}</h3>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '24px', lineHeight: '1.5' }}>{ap.desc}</p>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '200px' }}>
                    <button 
                      type="button" 
                      className="store-cta" 
                      onClick={() => alert(`App Store listing for ${ap.title} coming in Phase 5+.`)}
                      style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '3px', color: '#fff', textAlign: 'left', width: '100%', outline: 'none', justifyContent: 'center' }}
                    >
                      <RiAppleFill size={20} />
                      <div>
                        <div style={{ fontSize: '8px', opacity: 0.6 }}>Download on the</div>
                        <div style={{ fontSize: '11px', fontWeight: 'bold' }}>App Store</div>
                      </div>
                    </button>
                    <button 
                      type="button" 
                      className="store-cta" 
                      onClick={() => alert(`Google Play listing for ${ap.title} coming in Phase 5+.`)}
                      style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '3px', color: '#fff', textAlign: 'left', width: '100%', outline: 'none', justifyContent: 'center' }}
                    >
                      <RiDownloadFill size={20} />
                      <div>
                        <div style={{ fontSize: '8px', opacity: 0.6 }}>Get it on</div>
                        <div style={{ fontSize: '11px', fontWeight: 'bold' }}>Google Play</div>
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
            <button onClick={handleGetPremium} className="btn-primary" style={{ padding: '12px 32px', fontSize: '15px', background: 'var(--green)', border: 'none', cursor: 'pointer' }}>
              GET PREMIUM
            </button>
          </div>

          <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', marginBottom: '24px', textAlign: 'center' }}>Experience premium features</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '50px' }}>
            {[
              { title: 'Zero Ads', desc: 'Stream your music without any audio or visual advertisements. Total focus on the tunes.', icon: '🚫' },
              { title: 'Lossless Studio Audio', desc: 'Enjoy high-fidelity 24-bit / 96kHz FLAC audio, preserving every detail from the mix studio.', icon: '🎚️' },
              { title: 'Offline Caching', desc: 'Save up to 8GB of music files directly to your mobile storage. Perfect for flights or remote zones.', icon: '📥' },
              { title: 'Direct Tipping', desc: 'Unlock mid-listen tipping. Your support enters the cascade split directly to creator wallets.', icon: '🪙' },
            ].map((item, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '20px', borderRadius: '3px', background: 'rgba(16,185,129,0.01)', border: '1px solid rgba(16,185,129,0.06)' }}>
                <span style={{ fontSize: '24px', display: 'block', marginBottom: '12px', textAlign: 'center' }}>{item.icon}</span>
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
              <div key={idx} className="glass-panel" style={{ padding: '28px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px' }}>{plan.name}</h4>
                  <span style={{ color: 'var(--cyan)', fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>{plan.price}</span>
                  <p style={{ color: 'var(--mu)', fontSize: '12px', margin: '0 0 20px', lineHeight: '1.5' }}>{plan.desc}</p>
                </div>
                <button onClick={handleGetPremium} className="btn-primary" style={{ padding: '10px', width: '100%', fontSize: '13px', background: 'transparent', border: '1px solid var(--green)', color: '#fff', cursor: 'pointer' }}>
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

    const renderHelp = () => {
      const musicFaqs = [
        { q: "How are my TuneStream credits deducted?", a: "Credits are shared across the Intermaven network. For Premium accounts, standard listening deducts 1 credit per stream in Western regions and 0.1 credits in other regions. Tipping creators deducts credits equivalent to the tip amount." },
        { q: "How do I download music for offline listening?", a: "Long-press any album or playlist, then tap 'Download'. You can configure your local cache limit (up to 8GB) in the Player & Devices settings menu." },
        { q: "Does tipping really go directly to the artist?", a: "Yes. Mid-listen tips bypass traditional streaming distributors. They enter the Compensation Engine split cascade instantly, and funds are settled directly to creator wallets within 24 hours." },
        { q: "Can I use my account on multiple devices?", a: "Yes. Your shared credits vault, library, and settings sync automatically across web players and our native iOS/Android applications." }
      ];

      const forumTopics = [
        { title: "Audio Quality: FLAC vs. AAC on cellular data", replies: "24 replies", category: "General Discussion" },
        { title: "Tip jar suggestions for independent labels", replies: "15 replies", category: "Creator Support" },
        { title: "Off-grid performance in remote regions", replies: "38 replies", category: "Technical Help" }
      ];

      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px', maxWidth: '900px', margin: '0 auto 50px' }}>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: '800', marginBottom: '20px', textAlign: 'center' }}>Frequently Asked Questions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {musicFaqs.map((faq, idx) => (
                  <div key={idx} className="faq-item glass-panel" style={{ padding: '20px', borderRadius: '3px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>{faq.q}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--mu)', lineHeight: '1.5', margin: 0 }}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: '800', marginBottom: '20px', textAlign: 'center' }}>Community Forum Discussions</h3>
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '3px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {forumTopics.map((topic, idx) => (
                    <div key={idx} style={{ borderBottom: idx < forumTopics.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', paddingBottom: idx < forumTopics.length - 1 ? '12px' : 0 }}>
                      <span style={{ fontSize: '10px', color: 'var(--cyan)', textTransform: 'uppercase', fontWeight: 'bold' }}>{topic.category}</span>
                      <h4 style={{ fontSize: '13px', color: '#fff', margin: '4px 0', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => alert(`Opening topic: ${topic.title}`)}>{topic.title}</h4>
                      <span style={{ fontSize: '11px', color: 'var(--mu)' }}>{topic.replies}</span>
                    </div>
                  ))}
                </div>
              </div>

              <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: '800', marginBottom: '20px', textAlign: 'center' }}>Submit a Support Ticket</h3>
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '3px' }}>
                <form onSubmit={(e) => { e.preventDefault(); alert('TuneStream support ticket submitted successfully!'); }}>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '12px', color: '#fff', display: 'block', marginBottom: '4px' }}>Subject</label>
                    <input type="text" placeholder="E.g. Offline download issue" className="form-control" style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff' }} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '12px', color: '#fff', display: 'block', marginBottom: '4px' }}>Description</label>
                    <textarea rows="3" placeholder="Explain the problem..." className="form-control" style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', resize: 'none' }} required></textarea>
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', border: 'none', cursor: 'pointer', background: 'var(--green)' }}>
                    Submit Ticket
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
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
        case 'help':
          return renderHelp();
        case 'listen':
        default:
          return renderListen();
      }
    };

    return (
      <div 
        className="native-app-landing tunestream-landing" 
        style={{ background: getLandingBackground('tunestream'), color: '#f1f5f9', minHeight: '100vh', padding: '0 0 162px' }}
      >
        {renderTopHeader()}
        <div className="container" style={{ marginTop: view === 'listen' ? '40px' : '0' }}>
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
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
