import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  RiCompass3Line, RiListCheck, RiFolderMusicLine, RiBriefcaseLine, 
  RiUpload2Line, RiSparklingLine, RiGlobalLine, RiCheckDoubleLine, 
  RiSearchLine, RiSendPlaneFill, RiExchangeDollarLine, RiTimerLine,
  RiArrowLeftSFill, RiArrowRightSFill, RiFileListLine, RiQuestionLine,
  RiNetflixFill, RiMovieLine, RiVolumeUpFill, RiMusicFill, RiUserFill,
  RiPlayFill, RiPauseFill, RiAlertLine, RiCheckLine, RiLoader4Line, RiMenuFill, RiCloseFill,
  RiLockLine, RiDownloadLine, RiBellFill, RiArrowDownSFill, RiSettings3Fill, RiShieldFill, RiLogoutBoxRFill
} from 'react-icons/ri';
import smLogo from './assets/syncmavens-logo.png';
import './App.css';

// Import local hero backgrounds copied and generated for syncmavens
import syncPlacementHero from './assets/images/sync_placement_hero.png';
import creatorCatalogHero from './assets/images/creator_catalog_hero.png';
import splitsCascadeHero from './assets/images/splits_cascade_hero.png';

const SLIDES = [
  { 
    dot: '#00f2fe', 
    badge: 'AI-Powered Sync Matching',
    hLine1: 'Pitch directly to',
    hLine2: 'Netflix & HBO',
    hLine2Color: '#00f2fe',
    s: 'SyncMavens indexes your audio metadata, making your tracks immediately searchable by music supervisors looking for films, television, and sports placements.',
    b1: 'Access Sync Dashboard',
    b1action: '/dashboard',
    b2: 'Simulate AI Match',
    b2action: '/analyzer'
  },
  { 
    dot: '#8b5cf6', 
    badge: 'No Ownership Lockups',
    hLine1: 'Keep 100% of',
    hLine2: 'Your Publishing IP',
    hLine2Color: '#8b5cf6',
    s: 'Unlike legacy publishers who demand catalog advances and purchase rights, we do not offer advances. You retain full control of your masters and mechanical copyrights.',
    b1: 'Calculate Splits',
    b1action: '/calculator',
    b2: 'View Placements',
    b2action: '/opportunities'
  },
  { 
    dot: '#10b981', 
    badge: 'Compensation Led Waterfall',
    hLine1: 'Pure placement splits.',
    hLine2: 'Flat 10% admin.',
    hLine2Color: '#10b981',
    s: 'We route 90% of sync fees directly to creators. Automated split cascades handle payouts instantly to writers, producers, and publishers.',
    b1: 'Calculate Splits',
    b1action: '/calculator',
    b2: 'Success Stories',
    b2action: '/success'
  }
];

const SAMPLE_BRIEFS = [
  { id: 1, project: "Untitled Cyberpunk Drama", client: "Netflix Series", budget: "$15,000", duration: "Full Sync", status: "Active", genre: "Synthwave / Dark Techno", mood: "Action / Retro", deadline: "3 days left", description: "Looking for dark, driving synthwave with heavy baseline and retro cyberpunk aesthetic. Perfect for a car chase scene." },
  { id: 2, project: "Summer Adventure Campaign", client: "Automotive TV Commercial", budget: "$45,000", duration: "30s Edit", status: "Active", genre: "Indie Pop / Uplifting", mood: "Uplifting / Happy", deadline: "5 days left", description: "Uplifting, high-energy indie pop with acoustic guitar or bright synths. Needs to convey freedom, open roads, and summer vibes." },
  { id: 3, project: "Ethereal Indie Film", client: "A24 Feature", budget: "$8,500", duration: "End Credits", status: "Closed", genre: "Neo-Classical / Dream Pop", mood: "Melancholy / Spacial", deadline: "Closed", description: "Melancholic, spacious tracks with piano and strings or ambient dream pop vocals. Will build slowly over 4 minutes." },
  { id: 4, project: "Sports Energy Promo", client: "EA Sports Trax", budget: "$25,000", duration: "In-Game Loop", status: "Active", genre: "Phonk / Heavy Beats", mood: "Tension / Epic", deadline: "24 hours left", description: "Aggressive phonk, heavy trap, or hip-hop beats with high BPM. Needs a strong hook for high-action gameplay." },
];

const INITIAL_CATALOG = [
  { id: 101, title: "Midnight Sun", artist: "Hologram Club", genre: "Synthwave", duration: "4:12", status: "Approved" },
  { id: 102, title: "Resonance", artist: "Aether Echo", genre: "Neo-Classical", duration: "3:28", status: "Approved" },
];

const INITIAL_PITCHES = [
  { id: 1, briefTitle: "Untitled Cyberpunk Drama", trackTitle: "Midnight Sun", client: "Netflix Series", status: "Under Review", date: "2026-07-09" }
];

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('briefs');
  
  // Dashboard states
  const [briefs, setBriefs] = useState(SAMPLE_BRIEFS);
  const [selectedBrief, setSelectedBrief] = useState(SAMPLE_BRIEFS[0]);
  const [pitchInput, setPitchInput] = useState('');
  const [submittedPitches, setSubmittedPitches] = useState({});
  const [myPitches, setMyPitches] = useState(INITIAL_PITCHES);
  
  // Catalog states
  const [myCatalog, setMyCatalog] = useState(INITIAL_CATALOG);
  const [catalogForm, setCatalogForm] = useState({ title: '', artist: '', genre: 'Synthwave', duration: '3:30' });
  const [ingestSuccess, setIngestSuccess] = useState(false);
  const [pitchesReceived, setPitchesReceived] = useState([
    { id: 201, date: "2026-07-12", briefTitle: "Summer Adventure Campaign", client: "Automotive TV Commercial", songTitle: "Midnight Sun", artist: "Hologram Club", rationale: "Upbeat drive and retro synth vibes will fit perfectly with the road trip scenes.", status: "Pending", disbursalStatus: "ESCROW HOLD" },
    { id: 202, date: "2026-07-13", briefTitle: "Untitled Cyberpunk Drama", client: "Netflix Series", songTitle: "Resonance", artist: "Aether Echo", rationale: "Melancholic classical elements build tension during the end credit sequences.", status: "Pending", disbursalStatus: "ESCROW HOLD" }
  ]);
  const [syncFeesInvoiced, setSyncFeesInvoiced] = useState(60000);
  const [accruedRoyalties, setAccruedRoyalties] = useState(15800);
  const [activeContractPitch, setActiveContractPitch] = useState(null);
  const [supervisorSignature, setSupervisorSignature] = useState('');
  const [briefForm, setBriefForm] = useState({ project: '', client: '', budget: '$10,000', genre: 'Synthwave', mood: 'Action', deadline: '5 days left', description: '' });

  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const notifRef = useRef(null);
  const accountRef = useRef(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to SyncMavens', body: 'You are signed in across the shared Intermaven network.', read: false, at: '2m ago' },
    { id: 2, title: 'Sync-Ready Catalog Active', body: 'Audition clips are restricted to 45 seconds under sandbox rules.', read: false, at: '10m ago' },
  ]);

  // FAQ state
  const [openFaq, setOpenFaq] = useState(null);

  // Match Simulator states
  const [simulatorForm, setSimulatorForm] = useState({ title: '', artist: '', genre: 'Synthwave', mood: 'Action', vocals: 'Instrumental' });
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [simReport, setSimReport] = useState(null);

  // Splits Calculator states
  const [buyoutFee, setBuyoutFee] = useState(15000);
  const [writerSplit, setWriterSplit] = useState(50);
  const [producerSplit, setProducerSplit] = useState(50);

  // Sliding Hero states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideState, setSlideState] = useState('in');
  const [progress, setProgress] = useState(0);
  const [titleHovered, setTitleHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('syncmavens_logged_in') === 'true');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('syncmavens_user_role') || 'creator');
  const [userName, setUserName] = useState(() => localStorage.getItem('syncmavens_user_name') || 'Creator Pro');
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('syncmavens_user_email') || 'creator@tunemavens.com');

  const SLIDE_DURATION = 8000;
  const slideCount = SLIDES.length;
  const currentSlideData = SLIDES[currentSlide];

  const progressRef = useRef(null);
  const timerRef = useRef(null);

  const backgrounds = [
    `url(${syncPlacementHero})`,
    `url(${creatorCatalogHero})`,
    `url(${splitsCascadeHero})`
  ];

  const goToSlide = (index) => {
    if (index === currentSlide) return;
    if (progressRef.current) cancelAnimationFrame(progressRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    
    setSlideState('out');
    setTimeout(() => {
      setCurrentSlide(index);
      setProgress(0);
      setSlideState('in');
    }, 400);
  };

  const goToPrevSlide = () => {
    goToSlide((currentSlide - 1 + slideCount) % slideCount);
  };

  const goToNextSlide = () => {
    goToSlide((currentSlide + 1) % slideCount);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/dashboard')) {
      const logged = localStorage.getItem('syncmavens_logged_in') === 'true';
      if (!logged) {
        navigate('/login');
      } else {
        setIsLoggedIn(true);
        const role = localStorage.getItem('syncmavens_user_role') || 'creator';
        setUserRole(role);
        setUserName(localStorage.getItem('syncmavens_user_name') || 'Sandbox User');
        setUserEmail(localStorage.getItem('syncmavens_user_email') || 'user@tunemavens.com');
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleTopbarClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handleTopbarClick);
    return () => document.removeEventListener('mousedown', handleTopbarClick);
  }, []);

  useEffect(() => {
    if (isDashboardRoute) return;

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
      }, 400);
    }, SLIDE_DURATION);

    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, isDashboardRoute]);

  const handleHeroAction = (action) => {
    if (action.startsWith('/')) {
      navigate(action);
    }
  };

  const handleBackToTuneMavens = (e) => {
    e.preventDefault();
    const saved = sessionStorage.getItem('tunemavens_last_page');
    window.location.href = saved ? `http://localhost:3000${saved}` : 'http://localhost:3000/';
  };

  const handlePitchSubmit = (e) => {
    e.preventDefault();
    if (!pitchInput.trim()) return;
    
    setSubmittedPitches({
      ...submittedPitches,
      [selectedBrief.id]: pitchInput
    });

    const trackName = pitchInput.split('.')[0] || pitchInput;
    const newPitch = {
      id: myPitches.length + 1,
      briefTitle: selectedBrief.project,
      trackTitle: trackName,
      client: selectedBrief.client,
      status: "Submitted",
      date: new Date().toISOString().split('T')[0]
    };
    setMyPitches([newPitch, ...myPitches]);

    // Also post to pitchesReceived state so supervisor can approve/decline it
    const recPitch = {
      id: Date.now(),
      date: newPitch.date,
      briefTitle: selectedBrief.project,
      client: selectedBrief.client,
      songTitle: trackName,
      artist: userName || "Creator Pro",
      rationale: pitchInput,
      status: "Pending"
    };
    setPitchesReceived([recPitch, ...pitchesReceived]);

    setPitchInput('');
  };

  const handleIngestSubmit = (e) => {
    e.preventDefault();
    if (!catalogForm.title.trim() || !catalogForm.artist.trim()) return;

    const newTrack = {
      id: 100 + myCatalog.length + 1,
      title: catalogForm.title,
      artist: catalogForm.artist,
      genre: catalogForm.genre,
      duration: catalogForm.duration,
      status: "Ingested"
    };

    setMyCatalog([newTrack, ...myCatalog]);
    setIngestSuccess(true);
    setCatalogForm({ title: '', artist: '', genre: 'Synthwave', duration: '3:30' });
    setTimeout(() => setIngestSuccess(false), 3000);
  };

  const runSimulation = (e) => {
    e.preventDefault();
    if (!simulatorForm.title.trim() || !simulatorForm.artist.trim()) return;

    setSimulating(true);
    setSimStep(1);
    setSimReport(null);

    setTimeout(() => {
      setSimStep(2);
      setTimeout(() => {
        setSimStep(3);
        setTimeout(() => {
          let score = 75;
          let matchedBrief = briefs[0];

          if (simulatorForm.mood === 'Action' && simulatorForm.genre.includes('Synthwave')) {
            score = 96;
            matchedBrief = briefs[0];
          } else if (simulatorForm.mood === 'Uplifting' && simulatorForm.genre.includes('Pop')) {
            score = 94;
            matchedBrief = briefs[1];
          } else if (simulatorForm.mood === 'Melancholy' && simulatorForm.genre.includes('Classical')) {
            score = 91;
            matchedBrief = briefs[2];
          } else if (simulatorForm.mood === 'Tension' || simulatorForm.mood === 'Epic') {
            score = 88;
            matchedBrief = briefs[3];
          } else {
            score = 82;
            matchedBrief = briefs[Math.floor(Math.random() * briefs.length)];
          }

          setSimReport({
            score,
            brief: matchedBrief,
            fee: matchedBrief.budget,
            rationale: `Your track "${simulatorForm.title}" matches the ${simulatorForm.mood} mood and ${simulatorForm.genre} genre profile requested for the "${matchedBrief.project}" project by ${matchedBrief.client}.`
          });
          setSimulating(false);
          setSimStep(0);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const loadSampleTrack = (title, artist, genre, mood, vocals) => {
    setSimulatorForm({ title, artist, genre, mood, vocals });
    setSimReport(null);
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const renderContractModal = () => {
    if (!activeContractPitch) return null;

    const matchingBrief = briefs.find(b => b.project === activeContractPitch.briefTitle);
    const budgetStr = matchingBrief ? matchingBrief.budget.replace(/[^0-9]/g, '') : '15000';
    const dealBudget = parseInt(budgetStr, 10) || 15000;
    
    const agencyShare = Math.round(dealBudget * 0.3);
    const remainder = dealBudget - agencyShare;
    const smShare = Math.round(remainder * 0.25);
    const creatorShare = remainder - smShare;

    return (
      <div 
        onClick={() => setActiveContractPitch(null)}
        style={{ position: 'fixed', inset: 0, background: 'rgba(5, 4, 8, 0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' }}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="dashboard-card" 
          style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px', background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}
        >
          <button 
            onClick={() => setActiveContractPitch(null)} 
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <RiCloseFill size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981' }}>
            <RiFileLineChartLine size={24} />
            <h3 style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: 'bold' }}>License Agreement &amp; Clearance</h3>
          </div>

          <div style={{ background: '#050409', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '4px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6', maxHeight: '240px', overflowY: 'auto', fontFamily: 'monospace' }}>
            <h4 style={{ textAlign: 'center', color: '#fff', marginBottom: '16px', fontSize: '13px' }}>MEMORANDUM OF AGREEMENT</h4>
            <p>This Synchronisation and Master Use License Agreement is entered into as of sandbox execution date, by and between:</p>
            <p><strong>LICENSOR:</strong> {activeContractPitch.artist}</p>
            <p><strong>LICENSEE:</strong> {activeContractPitch.client} ({activeContractPitch.briefTitle})</p>
            <p><strong>WORK TITLE:</strong> "{activeContractPitch.songTitle}"</p>
            <p><strong>WATERFALL CASCADE ALLOCATIONS:</strong></p>
            <ul>
              <li>Upfront License Buyout Fee: ${dealBudget.toLocaleString()}</li>
              <li>30% Partner Placement Fee: ${agencyShare.toLocaleString()}</li>
              <li>25% Platform Administration Fee: ${smShare.toLocaleString()}</li>
              <li>Creator split remainder (45% gross): ${creatorShare.toLocaleString()}</li>
            </ul>
            <p>1. Grant of Rights: The Licensor hereby grants to the Licensee the right, license, and privilege to synchronise the Master Work in timed relation with visual images in the television/film/commercial production.</p>
            <p>2. Disbursal: Payments shall be waterfalled immediately upon supervisor release in the escrow split ledger.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Supervisor Electronic Signature</label>
                <input 
                  type="text" 
                  placeholder="Type supervisor name to sign..."
                  value={supervisorSignature}
                  onChange={e => setSupervisorSignature(e.target.value)}
                  style={{ padding: '8px', background: '#121118', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Creator Electronic Signature</label>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#10b981', fontSize: '13px', fontWeight: 'bold', fontFamily: 'cursive' }}>
                  ✓ Ayo AI Secure Sign
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button 
                onClick={() => {
                  if (!supervisorSignature.trim()) {
                    alert("Please type your electronic signature to sign the contract.");
                    return;
                  }
                  
                  const artist = activeContractPitch.artist;
                  const songTitle = activeContractPitch.songTitle;
                  const pitchId = activeContractPitch.id;

                  setPitchesReceived(prev => prev.map(p => p.id === pitchId ? { ...p, status: 'Approved', disbursalStatus: 'ESCROW HOLD' } : p));
                  alert(`Agreement executed successfully!\n\nPitch Approved: "${songTitle}" by ${artist}\nDisbursal Status: ESCROW HOLD`);
                  setActiveContractPitch(null);
                }} 
                className="btn-primary" 
                style={{ flex: 1, padding: '10px', fontSize: '13px', background: '#10b981', color: '#000', border: 'none', fontWeight: 'bold' }}
              >
                Execute Agreement &amp; Approve Pitch
              </button>
              <button 
                onClick={() => setActiveContractPitch(null)} 
                className="btn-secondary" 
                style={{ padding: '10px 16px', fontSize: '13px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isDashboardRoute) {
    /* ================= UNIFIED DASHBOARD ROUTE ================= */
    return (
      <div className="dashboard-container">
        {/* Sidebar Navigation */}
        <aside className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`}>
          <div className="dashboard-sidebar-scroll">
            <div className="dashboard-sidebar-header" style={{ flexDirection: collapsed ? 'column' : 'row', gap: '10px', alignItems: 'center', justifyContent: 'center', padding: '16px 0' }}>
              <Link to="/" className="nav-logo-link">
                <img 
                  src={smLogo} 
                  alt="SyncMavens Logo" 
                  className="nav-logo-image" 
                  style={{ height: collapsed ? '20px' : '32px', width: 'auto', display: 'block' }} 
                />
              </Link>
            </div>

            <button 
              onClick={() => setCollapsed(!collapsed)} 
              className="dashboard-nav-item collapse-toggle-btn"
              style={{ border: 'none', background: 'transparent', padding: '6px', justifyContent: 'center', width: '100%', marginBottom: '16px', color: '#94a3b8' }}
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <RiArrowRightSFill size={16} /> : <RiArrowLeftSFill size={16} />}
            </button>

            <div className="sidebar-category-group" style={{ marginBottom: '12px' }}>
              {!collapsed && (
                <div style={{ fontSize: '10px', color: '#475569', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', padding: '6px 14px 4px' }}>
                  Operations
                </div>
              )}
              <ul className="dashboard-nav-list" style={{ gap: '4px' }}>
                {userRole === 'supervisor' ? (
                  <>
                    <li>
                      <button 
                        onClick={() => setActiveTab('briefs_mgmt')} 
                        className={`dashboard-nav-item ${activeTab === 'briefs_mgmt' ? 'active' : ''}`}
                        title="Create Sync Brief"
                      >
                        <RiBriefcaseLine size={16} />
                        {!collapsed && "Create Sync Brief"}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => setActiveTab('sync_ready_vault')} 
                        className={`dashboard-nav-item ${activeTab === 'sync_ready_vault' ? 'active' : ''}`}
                        title="Sync-Ready Vault"
                      >
                        <RiMusicFill size={16} />
                        {!collapsed && "Sync-Ready Vault"}
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button 
                        onClick={() => setActiveTab('briefs')} 
                        className={`dashboard-nav-item ${activeTab === 'briefs' ? 'active' : ''}`}
                        title="Active Briefs"
                      >
                        <RiBriefcaseLine size={16} />
                        {!collapsed && "Active Briefs"}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => setActiveTab('catalog')} 
                        className={`dashboard-nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
                        title="My Catalog"
                      >
                        <RiFolderMusicLine size={16} />
                        {!collapsed && "My Catalog"}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => setActiveTab('dashboard_publishing')} 
                        className={`dashboard-nav-item ${activeTab === 'dashboard_publishing' ? 'active' : ''}`}
                        title="Music Publishing"
                      >
                        <RiFileListLine size={16} />
                        {!collapsed && "Music Publishing"}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => setActiveTab('dashboard_youtube')} 
                        className={`dashboard-nav-item ${activeTab === 'dashboard_youtube' ? 'active' : ''}`}
                        title="YouTube Content ID"
                      >
                        <RiUpload2Line size={16} />
                        {!collapsed && "YouTube Content ID"}
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="sidebar-category-group" style={{ marginBottom: '12px' }}>
              {!collapsed && (
                <div style={{ fontSize: '10px', color: '#475569', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', padding: '6px 14px 4px' }}>
                  Transactions
                </div>
              )}
              <ul className="dashboard-nav-list" style={{ gap: '4px' }}>
                {userRole === 'supervisor' ? (
                  <>
                    <li>
                      <button 
                        onClick={() => setActiveTab('pitches_received')} 
                        className={`dashboard-nav-item ${activeTab === 'pitches_received' ? 'active' : ''}`}
                        title="Pitches Received"
                      >
                        <RiListCheck size={16} />
                        {!collapsed && "Pitches Received"}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => setActiveTab('escrow_splits')} 
                        className={`dashboard-nav-item ${activeTab === 'escrow_splits' ? 'active' : ''}`}
                        title="Escrow Split Logs"
                      >
                        <RiExchangeDollarLine size={16} />
                        {!collapsed && "Escrow Split Logs"}
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button 
                        onClick={() => setActiveTab('pitches')} 
                        className={`dashboard-nav-item ${activeTab === 'pitches' ? 'active' : ''}`}
                        title="My Pitches"
                      >
                        <RiListCheck size={16} />
                        {!collapsed && "My Pitches"}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => setActiveTab('ledger')} 
                        className={`dashboard-nav-item ${activeTab === 'ledger' ? 'active' : ''}`}
                        title="Deal Ledger"
                      >
                        <RiExchangeDollarLine size={16} />
                        {!collapsed && "Deal Ledger"}
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="sidebar-category-group" style={{ marginBottom: '12px' }}>
              {!collapsed && (
                <div style={{ fontSize: '10px', color: '#475569', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', padding: '6px 14px 4px' }}>
                  Ecosystem Admin
                </div>
              )}
              <ul className="dashboard-nav-list" style={{ gap: '4px' }}>
                <li>
                  <button 
                    onClick={() => setActiveTab('app_marketplace')} 
                    className={`dashboard-nav-item ${activeTab === 'app_marketplace' ? 'active' : ''}`}
                    title="App Marketplace"
                  >
                    <RiGlobalLine size={16} />
                    {!collapsed && "App Marketplace"}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('domain_mappings')} 
                    className={`dashboard-nav-item ${activeTab === 'domain_mappings' ? 'active' : ''}`}
                    title="Domain Mappings"
                  >
                    <RiGlobalLine size={16} />
                    {!collapsed && "Domain Mappings"}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('promoted_acts')} 
                    className={`dashboard-nav-item ${activeTab === 'promoted_acts' ? 'active' : ''}`}
                    title="Promoted Acts"
                  >
                    <RiSparklingLine size={16} />
                    {!collapsed && "Promoted Acts"}
                  </button>
                </li>
              </ul>
            </div>

            <ul className="dashboard-nav-list" style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
              <li>
                <button 
                  onClick={() => navigate('/')} 
                  className="dashboard-nav-item"
                  title="Back to Landing Page"
                >
                  <RiArrowLeftSFill size={16} />
                  {!collapsed && "Back to Landing Page"}
                </button>
              </li>
            </ul>
          </div>

          <div className="dashboard-sidebar-footer">
            <div className="dashboard-profile-card">
              <div className="dashboard-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: userRole === 'supervisor' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(34, 211, 238, 0.1)', color: userRole === 'supervisor' ? 'var(--accent-purple)' : 'var(--cyan)', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>
                {userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              {!collapsed && (
                <div className="dashboard-profile-info">
                  <h5>{userName}</h5>
                  <span style={{ color: userRole === 'supervisor' ? '#8b5cf6' : '#00f2fe' }}>
                    {userRole === 'supervisor' ? "SUPERVISOR PRO" : "CREATOR PRO"}
                  </span>
                </div>
              )}
            </div>
            <button 
              onClick={() => {
                localStorage.setItem('syncmavens_logged_in', 'false');
                setIsLoggedIn(false);
                navigate('/');
              }} 
              className="dashboard-nav-item" 
              style={{ width: '100%', border: 'none', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', justifyContent: 'center', marginTop: '8px', padding: collapsed ? '10px 0' : '10px 14px' }}
              title="Log Out"
            >
              {!collapsed && "Log Out"}
            </button>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="dashboard-main-content">
          <header className="dashboard-topbar">
            <div className="dashboard-topbar-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiGlobalLine style={{ color: '#00f2fe' }} />
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
                  SERVING FROM: <strong>syncmavens.com</strong> | UTILITY BACKEND INTERFACE
                </span>
              </div>
            </div>
            
            <div className="dashboard-topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="search-bar" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <RiSearchLine />
                <input type="text" placeholder="Search briefs, deals, metadata..." style={{ fontSize: '13px' }} />
              </div>

              {/* Back to public site button */}
              <Link
                to="/"
                className="topbar-back-to-site"
                title="Back to public site"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                  background: 'rgba(0, 242, 254, 0.06)',
                  color: '#00f2fe',
                  fontSize: '12px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  letterSpacing: '0.3px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>Back to Site</span>
              </Link>

              {/* Notifications */}
              <div className="dashboard-topbar-item" ref={notifRef}>
                <button
                  className="topbar-icon-btn"
                  onClick={() => { setNotifOpen(o => !o); setAccountOpen(false); }}
                  title="Notifications"
                >
                  <RiBellFill size={18} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="topbar-badge">{notifications.filter(n => !n.read).length}</span>
                  )}
                </button>
                {notifOpen && (
                  <div className="topbar-dropdown" style={{ top: 'calc(100% + 8px)' }}>
                    <div className="topbar-dropdown-header">
                      <strong>Notifications</strong>
                      {notifications.filter(n => !n.read).length > 0 && (
                        <button className="topbar-link-btn" onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}>
                          Mark all read
                        </button>
                      )}
                    </div>
                    <ul className="topbar-notif-list">
                      {notifications.length === 0 && (
                        <li className="topbar-notif-empty">You're all caught up.</li>
                      )}
                      {notifications.map(n => (
                        <li key={n.id} className={`topbar-notif-item ${n.read ? 'read' : 'unread'}`} style={{ display: 'flex', gap: '8px', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <div className="topbar-notif-dot" />
                          <div className="topbar-notif-body">
                            <div className="topbar-notif-title" style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9' }}>{n.title}</div>
                            <div className="topbar-notif-text" style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', lineHeight: '1.4' }}>{n.body}</div>
                            <div className="topbar-notif-time" style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{n.at}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="topbar-dropdown-footer">
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        Live notifications coming soon.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Dropdown */}
              <div className="dashboard-topbar-item" ref={accountRef}>
                <button
                  className="topbar-account-btn"
                  onClick={() => { setAccountOpen(o => !o); setNotifOpen(false); }}
                  title="Account"
                >
                  <span className="topbar-avatar">{userName.charAt(0).toUpperCase()}</span>
                  <span className="topbar-account-name">{userName}</span>
                  <RiArrowDownSFill size={14} />
                </button>
                {accountOpen && (
                  <div className="topbar-dropdown topbar-dropdown-account" style={{ top: 'calc(100% + 8px)' }}>
                    <div className="topbar-account-summary">
                      <div className="topbar-avatar large">{userName.charAt(0).toUpperCase()}</div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>{userName}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{userEmail}</div>
                        <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>
                          {userRole} · verified
                        </div>
                      </div>
                    </div>
                    <div className="topbar-dropdown-divider" />
                    
                    <button
                      className="topbar-menu-item"
                      style={{ color: '#00f2fe' }}
                      onClick={() => {
                        setAccountOpen(false);
                        const nextRole = userRole === 'supervisor' ? 'creator' : 'supervisor';
                        localStorage.setItem('syncmavens_user_role', nextRole);
                        setUserRole(nextRole);
                        if (nextRole === 'supervisor') {
                          setActiveTab('briefs_mgmt');
                        } else {
                          setActiveTab('briefs');
                        }
                        alert(`Sandbox: Switched role to ${nextRole}`);
                      }}
                    >
                      <RiShieldFill size={14} />
                      <span>Switch Sandbox Role ({userRole === 'supervisor' ? 'to Creator' : 'to Supervisor'})</span>
                    </button>

                    <button
                      className="topbar-menu-item"
                      onClick={() => { setActiveTab('profile'); setAccountOpen(false); }}
                    >
                      <RiSettings3Fill size={14} />
                      <span>Account Settings</span>
                    </button>

                    <button
                      className="topbar-menu-item topbar-menu-item-danger"
                      onClick={() => {
                        setAccountOpen(false);
                        localStorage.setItem('syncmavens_logged_in', 'false');
                        setIsLoggedIn(false);
                        navigate('/');
                      }}
                    >
                      <RiLogoutBoxRFill size={14} style={{ color: '#f87171' }} />
                      <span style={{ color: '#f87171' }}>Log Out</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </header>

          {/* Dashboard Panels */}
          <div className="dashboard-main-scroll" style={{ padding: '24px 32px' }}>
            <OnboardingChecklist 
              userRole={userRole} 
              userName={userName} 
              userEmail={userEmail} 
              myCatalog={myCatalog} 
              myPitches={myPitches} 
              briefs={briefs} 
              pitchesReceived={pitchesReceived} 
              isSupervisor={localStorage.getItem('syncmavens_supervisor_unlocked') === 'true'} 
              setActiveTab={setActiveTab} 
            />
            
            {activeTab === 'briefs' && (
              <div className="sm-workspace" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
                {/* Briefs grid */}
                <section className="briefs-section">
                  <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Incoming Licensing Briefs</h3>
                  <div className="briefs-grid" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {briefs.map((brief) => (
                      <div 
                        key={brief.id} 
                        className={`brief-card ${selectedBrief.id === brief.id ? 'active' : ''}`}
                        onClick={() => setSelectedBrief(brief)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                          <span style={{ color: '#94a3b8' }}>{brief.client}</span>
                          <span style={{ color: brief.status === 'Active' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{brief.status}</span>
                        </div>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{brief.project}</h4>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0', lineHeight: '1.4' }}>{brief.description}</p>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#94a3b8' }}>
                          <span><strong>Budget:</strong> {brief.budget}</span>
                          <span><strong>Style:</strong> {brief.genre}</span>
                          <span><strong>Deadline:</strong> {brief.deadline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Pitch proposals */}
                <aside className="pitch-panel">
                  <h3>Submit Pitch Proposal</h3>
                  <div style={{ margin: '16px 0', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div><span style={{ color: '#64748b' }}>Target Brief:</span> <strong style={{ display: 'block', color: '#fff' }}>{selectedBrief.project}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Client:</span> <strong style={{ display: 'block', color: '#fff' }}>{selectedBrief.client}</strong></div>
                    <div><span style={{ color: '#64748b' }}>Budget Limit:</span> <strong style={{ display: 'block', color: '#00f2fe' }}>{selectedBrief.budget}</strong></div>
                  </div>

                  {submittedPitches[selectedBrief.id] ? (
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '3px', textAlign: 'center', color: '#10b981' }}>
                      <RiCheckDoubleLine size={32} style={{ marginBottom: '8px' }} />
                      <h5 style={{ margin: '0 0 4px 0' }}>Pitch Submitted!</h5>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Pending supervisor review.</p>
                    </div>
                  ) : selectedBrief.status === 'Closed' ? (
                    <div style={{ color: '#ef4444', textAlign: 'center', padding: '16px', fontSize: '12px' }}>This brief is closed.</div>
                  ) : (
                    <form onSubmit={handlePitchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Choose Track & Pitch Rationale</label>
                      <textarea 
                        value={pitchInput}
                        onChange={e => setPitchInput(e.target.value)}
                        placeholder="e.g. Midnight Sun. Rationale: Matches the dark driving vibe requested in section 2..."
                      />
                      <button type="submit" className="btn-get-signed" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <RiSendPlaneFill /> Submit Pitch
                      </button>
                    </form>
                  )}
                </aside>
              </div>
            )}

            {activeTab === 'catalog' && (
              <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><RiFolderMusicLine style={{ color: '#00f2fe' }} /> Sync-Ready Catalog Ingestion</h3>
                
                {ingestSuccess && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '3px', color: '#10b981', fontSize: '12px', marginBottom: '16px' }}>
                    ✓ Track ingested successfully into sync index.
                  </div>
                )}

                <form onSubmit={handleIngestSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 120px', gap: '12px', marginBottom: '24px' }}>
                  <input 
                    type="text" 
                    placeholder="Track Title" 
                    value={catalogForm.title}
                    onChange={e => setCatalogForm({ ...catalogForm, title: e.target.value })}
                  />
                  <input 
                    type="text" 
                    placeholder="Artist" 
                    value={catalogForm.artist}
                    onChange={e => setCatalogForm({ ...catalogForm, artist: e.target.value })}
                  />
                  <select 
                    value={catalogForm.genre}
                    onChange={e => setCatalogForm({ ...catalogForm, genre: e.target.value })}
                  >
                    <option value="Synthwave">Synthwave</option>
                    <option value="Indie Pop">Indie Pop</option>
                    <option value="Neo-Classical">Neo-Classical</option>
                    <option value="Phonk">Phonk</option>
                  </select>
                  <button type="submit" className="btn-get-signed">Ingest</button>
                </form>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', color: '#64748b' }}>
                      <th style={{ padding: '10px' }}>ID</th>
                      <th style={{ padding: '10px' }}>Title</th>
                      <th style={{ padding: '10px' }}>Artist</th>
                      <th style={{ padding: '10px' }}>Genre</th>
                      <th style={{ padding: '10px' }}>Duration</th>
                      <th style={{ padding: '10px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myCatalog.map(track => (
                      <tr key={track.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '10px', color: '#64748b' }}>{track.id}</td>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{track.title}</td>
                        <td style={{ padding: '10px' }}>{track.artist}</td>
                        <td style={{ padding: '10px', color: '#00f2fe' }}>{track.genre}</td>
                        <td style={{ padding: '10px' }}>{track.duration}</td>
                        <td style={{ padding: '10px', color: '#10b981' }}>{track.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'pitches' && (
              <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>My Submitted Sync Pitches</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', color: '#64748b' }}>
                      <th style={{ padding: '10px' }}>Date</th>
                      <th style={{ padding: '10px' }}>Target Project</th>
                      <th style={{ padding: '10px' }}>Pitched Track</th>
                      <th style={{ padding: '10px' }}>Client</th>
                      <th style={{ padding: '10px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myPitches.map(pitch => (
                      <tr key={pitch.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '10px', color: '#64748b' }}>{pitch.date}</td>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{pitch.briefTitle}</td>
                        <td style={{ padding: '10px' }}>{pitch.trackTitle}</td>
                        <td style={{ padding: '10px' }}>{pitch.client}</td>
                        <td style={{ padding: '10px', color: '#00f2fe' }}>{pitch.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'ledger' && (
              <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Compensation Deal Ledger</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Sync Fees Invoiced</span>
                    <h4 style={{ margin: '8px 0 0', color: '#00f2fe' }}>${syncFeesInvoiced.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Accrued Licensing Royalties</span>
                    <h4 style={{ margin: '8px 0 0', color: '#00f2fe' }}>${accruedRoyalties.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Catalog Advance Payouts</span>
                    <h4 style={{ margin: '8px 0 0', color: '#ef4444' }}>$0 (No advance model)</h4>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b' }}>
                  Ledger entries track upfront synchronization buyout fees, DSP distribution recoupments, and contract cascade percentages as calculated by Phase 7 and Phase 8 backend services.
                </p>
              </div>
            )}

            {activeTab === 'briefs_mgmt' && (
              <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><RiBriefcaseLine style={{ color: '#8b5cf6' }} /> Create Sync Licensing Brief</h3>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!briefForm.project.trim() || !briefForm.client.trim()) return;
                  const newBrief = {
                    id: briefs.length + 1,
                    project: briefForm.project,
                    client: briefForm.client,
                    budget: briefForm.budget,
                    genre: briefForm.genre,
                    mood: briefForm.mood,
                    deadline: briefForm.deadline,
                    description: briefForm.description,
                    status: 'Active'
                  };
                  setBriefs([newBrief, ...briefs]);
                  setBriefForm({ project: '', client: '', budget: '$10,000', genre: 'Synthwave', mood: 'Action', deadline: '5 days left', description: '' });
                  alert("Brief published successfully! Creators on the network are notified immediately.");
                }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Project Title</label>
                    <input type="text" placeholder="e.g. Cyberpunk Action Spot" value={briefForm.project} onChange={e => setBriefForm({ ...briefForm, project: e.target.value })} required style={{ width: '100%' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Client / Network</label>
                    <input type="text" placeholder="e.g. HBO Max / Netflix" value={briefForm.client} onChange={e => setBriefForm({ ...briefForm, client: e.target.value })} required style={{ width: '100%' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>License Buyout Budget</label>
                    <input type="text" placeholder="e.g. $15,000" value={briefForm.budget} onChange={e => setBriefForm({ ...briefForm, budget: e.target.value })} required style={{ width: '100%' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Submission Deadline</label>
                    <input type="text" placeholder="e.g. 5 days left" value={briefForm.deadline} onChange={e => setBriefForm({ ...briefForm, deadline: e.target.value })} required style={{ width: '100%' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Target Genre</label>
                    <select value={briefForm.genre} onChange={e => setBriefForm({ ...briefForm, genre: e.target.value })} style={{ width: '100%' }}>
                      <option value="Synthwave / Phonk">Synthwave / Phonk</option>
                      <option value="Indie Pop">Indie Pop</option>
                      <option value="Neo-Classical">Neo-Classical</option>
                      <option value="Cinematic / Epic">Cinematic / Epic</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Vibe / Mood</label>
                    <select value={briefForm.mood} onChange={e => setBriefForm({ ...briefForm, mood: e.target.value })} style={{ width: '100%' }}>
                      <option value="Action">Action</option>
                      <option value="Melancholy">Melancholy</option>
                      <option value="Uplifting">Uplifting</option>
                      <option value="Tension">Tension</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Detailed Brief Description</label>
                    <textarea placeholder="Specify mood shifts, style references, and cues..." value={briefForm.description} onChange={e => setBriefForm({ ...briefForm, description: e.target.value })} required style={{ width: '100%', height: '80px', padding: '8px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px', outline: 'none' }} />
                  </div>
                  <button type="submit" className="btn-get-signed" style={{ gridColumn: 'span 2', padding: '12px' }}>Publish Sync Brief</button>
                </form>

                <h4 style={{ fontSize: '14px', marginBottom: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>Active Briefs Under Your Management</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', color: '#64748b' }}>
                      <th style={{ padding: '10px' }}>Project</th>
                      <th style={{ padding: '10px' }}>Client</th>
                      <th style={{ padding: '10px' }}>Budget</th>
                      <th style={{ padding: '10px' }}>Deadline</th>
                      <th style={{ padding: '10px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {briefs.map(brief => (
                      <tr key={brief.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{brief.project}</td>
                        <td style={{ padding: '10px' }}>{brief.client}</td>
                        <td style={{ padding: '10px', color: '#00f2fe' }}>{brief.budget}</td>
                        <td style={{ padding: '10px' }}>{brief.deadline}</td>
                        <td style={{ padding: '10px', color: '#10b981' }}>{brief.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'sync_ready_vault' && (
              <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><RiMusicFill style={{ color: '#8b5cf6' }} /> Sync-Ready Master Vault</h3>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '20px' }}>Verified supervisors can audition clips and download full broadcast-ready WAV stems.</p>
                <SyncReadyView standalone={false} />
              </div>
            )}

            {activeTab === 'pitches_received' && (
              <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><RiListCheck style={{ color: '#8b5cf6' }} /> Creator Sync Pitches Received</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', color: '#64748b' }}>
                      <th style={{ padding: '10px' }}>Date</th>
                      <th style={{ padding: '10px' }}>Project</th>
                      <th style={{ padding: '10px' }}>Song Pitched</th>
                      <th style={{ padding: '10px' }}>Artist</th>
                      <th style={{ padding: '10px' }}>Rationale</th>
                      <th style={{ padding: '10px' }}>Status</th>
                      <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pitchesReceived.map(pitch => (
                      <tr key={pitch.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '10px', color: '#64748b' }}>{pitch.date}</td>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{pitch.briefTitle}</td>
                        <td style={{ padding: '10px', color: '#00f2fe' }}>{pitch.songTitle}</td>
                        <td style={{ padding: '10px' }}>{pitch.artist}</td>
                        <td style={{ padding: '10px', fontSize: '11px', color: '#94a3b8', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={pitch.rationale}>{pitch.rationale}</td>
                        <td style={{ padding: '10px', color: pitch.status === 'Approved' ? '#10b981' : pitch.status === 'Declined' ? '#ef4444' : '#eab308' }}>{pitch.status}</td>
                        <td style={{ padding: '10px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          {pitch.status === 'Pending' ? (
                            <>
                              <button onClick={() => {
                                setActiveContractPitch(pitch);
                                setSupervisorSignature('');
                              }} className="btn-get-signed" style={{ padding: '4px 10px', fontSize: '11px', background: '#10b981', border: 'none', color: '#000', borderRadius: '3px' }}>Approve & Sign</button>
                              <button onClick={() => {
                                setPitchesReceived(pitchesReceived.map(p => p.id === pitch.id ? { ...p, status: 'Declined' } : p));
                              }} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px' }}>Decline</button>
                            </>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#64748b' }}>Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'escrow_splits' && (
              <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><RiExchangeDollarLine style={{ color: '#8b5cf6' }} /> Escrow Splits Logs</h3>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '20px' }}>License buyout contract split cascades. Releases funds to creator wallets automatically.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {pitchesReceived.filter(p => p.status === 'Approved').length === 0 ? (
                    <div style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', padding: '24px', border: '1px dashed rgba(255,255,255,0.06)' }}>
                      No active approved placements currently pending escrow disbursal.
                    </div>
                  ) : (
                    pitchesReceived.filter(p => p.status === 'Approved').map(deal => {
                      const matchingBrief = briefs.find(b => b.project === deal.briefTitle);
                      const budgetStr = matchingBrief ? matchingBrief.budget.replace(/[^0-9]/g, '') : '15000';
                      const dealBudget = parseInt(budgetStr, 10) || 15000;
                      
                      const agencyShare = Math.round(dealBudget * 0.3);
                      const remainder = dealBudget - agencyShare;
                      const smShare = Math.round(remainder * 0.25);
                      const creatorShare = remainder - smShare;
                      
                      const isSettled = deal.disbursalStatus === 'SETTLED';

                      const handleRelease = () => {
                        if (isSettled) return;
                        
                        setPitchesReceived(pitchesReceived.map(p => p.id === deal.id ? { ...p, disbursalStatus: 'SETTLED' } : p));
                        setSyncFeesInvoiced(prev => prev + dealBudget);
                        setAccruedRoyalties(prev => prev + creatorShare);
                        
                        alert(`Escrow funds disbursed successfully!\n\nBuyout: $${dealBudget.toLocaleString()}\n- Partner Network Agency (30%): $${agencyShare.toLocaleString()}\n- SyncMavens Platform Fee (25% of net): $${smShare.toLocaleString()}\n- Creator Split Waterfall (45% of gross): $${creatorShare.toLocaleString()} credited to Artist Ledger.\n\nStatus: SETTLED`);
                      };

                      return (
                        <div key={deal.id} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '20px', background: 'rgba(255,255,255,0.01)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '8px' }}>
                            <div>
                              <strong style={{ fontSize: '14px', color: '#fff' }}>{deal.briefTitle}</strong>
                              <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>Artist: {deal.artist} | Track: {deal.songTitle}</span>
                            </div>
                            <strong style={{ color: '#10b981', fontSize: '16px' }}>${dealBudget.toLocaleString()} Buyout</strong>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '12px', marginBottom: '16px' }}>
                            <div>
                              <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>Agency Partner (30%):</span>
                              <strong>${agencyShare.toLocaleString()}</strong>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>SyncMavens Admin (25%):</span>
                              <strong>${smShare.toLocaleString()}</strong>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>Creator Payout (45%):</span>
                              <strong style={{ color: '#00f2fe' }}>${creatorShare.toLocaleString()}</strong>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>Disbursal Status:</span>
                              <strong style={{ color: isSettled ? '#10b981' : '#eab308' }}>{deal.disbursalStatus || 'ESCROW HOLD'}</strong>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                              onClick={handleRelease} 
                              disabled={isSettled}
                              className="btn-get-signed" 
                              style={{ 
                                flex: 1,
                                padding: '8px 16px', 
                                background: isSettled ? 'rgba(255,255,255,0.05)' : '#10b981', 
                                color: isSettled ? '#64748b' : '#000', 
                                border: 'none', 
                                borderRadius: '3px',
                                cursor: isSettled ? 'not-allowed' : 'pointer'
                              }}
                            >
                              {isSettled ? 'Waterfall Settled' : 'Release Escrow & Disburse Waterfall'}
                            </button>

                            {isSettled && (
                              <button 
                                onClick={() => {
                                  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<CueSheet xmlns="http://www.ascap.com/cuesheet">
  <Header>
    <Title>${deal.briefTitle}</Title>
    <Publisher>SyncMavens Publishing</Publisher>
    <Status>SETTLED</Status>
  </Header>
  <Cues>
    <Cue>
      <Number>1</Number>
      <Title>${deal.songTitle}</Title>
      <Composer>${deal.artist}</Composer>
      <Publisher>SyncMavens Publishing</Publisher>
      <Duration>Full Sync</Duration>
      <Usage>BI</Usage>
      <Split ComposerShare="50%" PublisherShare="50%" />
    </Cue>
  </Cues>
</CueSheet>`;

                                  const blob = new Blob([xmlContent], { type: 'text/xml' });
                                  const url = URL.createObjectURL(blob);
                                  const link = document.createElement('a');
                                  link.href = url;
                                  link.download = `${deal.songTitle.replace(/\s+/g, '_')}_CueSheet.xml`;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  URL.revokeObjectURL(url);
                                  alert(`ASCAP/BMI Cue Sheet XML downloaded successfully for: "${deal.songTitle}"`);
                                }}
                                className="btn-secondary" 
                                style={{ padding: '8px 16px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}
                              >
                                📥 Cue Sheet XML
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === 'dashboard_publishing' && (
              <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><RiFileListLine style={{ color: '#00f2fe' }} /> Music Publishing Administration</h3>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '24px' }}>Register your compositions globally with Performing Rights Organizations (PROs) and collect streaming mechanicals.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
                  {/* Left: Registered tracks */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '4px' }}>
                      <h4 style={{ fontSize: '13px', margin: '0 0 12px 0', color: '#fff' }}>Registered Compositions</h4>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#64748b' }}>
                            <th style={{ padding: '8px 4px' }}>Work Title</th>
                            <th style={{ padding: '8px 4px' }}>ISWC</th>
                            <th style={{ padding: '8px 4px' }}>Composer Share</th>
                            <th style={{ padding: '8px 4px' }}>PRO Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '10px 4px', fontWeight: 'bold' }}>Midnight Sun</td>
                            <td style={{ padding: '10px 4px', color: '#00f2fe' }}>T-931.205.419-0</td>
                            <td style={{ padding: '10px 4px' }}>100% (ASCAP)</td>
                            <td style={{ padding: '10px 4px', color: '#10b981' }}>✓ Registered</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '10px 4px', fontWeight: 'bold' }}>Resonance</td>
                            <td style={{ padding: '10px 4px', color: '#00f2fe' }}>T-928.093.582-1</td>
                            <td style={{ padding: '10px 4px' }}>100% (BMI)</td>
                            <td style={{ padding: '10px 4px' }}>100% (BMI)</td>
                            <td style={{ padding: '10px 4px', color: '#10b981' }}>✓ Registered</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right: Connect PRO & Election status */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: 'rgba(0, 242, 254, 0.02)', border: '1px solid rgba(0, 242, 254, 0.1)', padding: '16px', borderRadius: '4px' }}>
                      <h4 style={{ fontSize: '13px', margin: '0 0 8px 0', color: '#00f2fe' }}>PRO Affiliation</h4>
                      <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4', margin: '0 0 12px 0' }}>Affiliate your compositions directly to collect performance royalties globally.</p>
                      <button onClick={() => alert("Syncing catalog with ASCAP & BMI databases...")} className="btn-get-signed" style={{ width: '100%', padding: '8px', fontSize: '11px', borderRadius: '3px' }}>
                        Refresh PRO Registry
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'dashboard_youtube' && (
              <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><RiUpload2Line style={{ color: '#8b5cf6' }} /> YouTube Content ID & UGC Scanner</h3>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '24px' }}>Monitor, claim, and monetize user-generated videos containing your compositions across YouTube and TikTok.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
                  {/* Left: Matched videos */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '4px' }}>
                      <h4 style={{ fontSize: '13px', margin: '0 0 12px 0', color: '#fff' }}>Active UGC Ad Revenue Claims</h4>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#64748b' }}>
                            <th style={{ padding: '8px 4px' }}>Claimed Video URL</th>
                            <th style={{ padding: '8px 4px' }}>Track Used</th>
                            <th style={{ padding: '8px 4px' }}>Est. Revenue</th>
                            <th style={{ padding: '8px 4px' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '10px 4px' }}><a href="#" onClick={e => e.preventDefault()} style={{ color: '#00f2fe', textDecoration: 'none' }}>youtube.com/watch?v=ugc982</a></td>
                            <td style={{ padding: '10px 4px', fontWeight: 'bold' }}>Midnight Sun</td>
                            <td style={{ padding: '10px 4px', color: '#10b981' }}>$320.50</td>
                            <td style={{ padding: '10px 4px', color: '#10b981' }}>Claimed</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '10px 4px' }}><a href="#" onClick={e => e.preventDefault()} style={{ color: '#00f2fe', textDecoration: 'none' }}>tiktok.com/@vibeuser/video/82</a></td>
                            <td style={{ padding: '10px 4px', fontWeight: 'bold' }}>Summer Drift</td>
                            <td style={{ padding: '10px 4px', color: '#10b981' }}>$112.10</td>
                            <td style={{ padding: '10px 4px', color: '#10b981' }}>Claimed</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right: Claim options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: 'rgba(139, 92, 246, 0.02)', border: '1px solid rgba(139, 92, 246, 0.1)', padding: '16px', borderRadius: '4px' }}>
                      <h4 style={{ fontSize: '13px', margin: '0 0 8px 0', color: '#8b5cf6' }}>Ingest Sound Fingerprints</h4>
                      <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4', margin: '0 0 12px 0' }}>Upload masters directly to scan platforms for matched uses.</p>
                      <button onClick={() => alert("Submitting catalog acoustic hashes to Content ID scanning engine...")} className="btn-primary" style={{ width: '100%', padding: '8px', fontSize: '11px', borderRadius: '3px', background: '#8b5cf6', border: 'none', color: '#fff', fontWeight: 'bold' }}>
                        Scan Fingerprints
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>Profile &amp; Account Settings</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>Update your creator identity and public brand metadata.</p>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  localStorage.setItem('syncmavens_user_name', userName);
                  localStorage.setItem('syncmavens_user_email', userEmail);
                  alert('Profile settings updated successfully!');
                }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Full Name</label>
                      <input 
                        type="text" 
                        value={userName} 
                        onChange={(e) => setUserName(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }} 
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Email Address</label>
                      <input 
                        type="email" 
                        value={userEmail} 
                        onChange={(e) => setUserEmail(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }} 
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Brand / Label Name</label>
                      <input 
                        type="text" 
                        defaultValue={userName + " Music"} 
                        style={{ width: '100%', padding: '8px 12px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }} 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Region / Country</label>
                      <select 
                        style={{ width: '100%', padding: '8px 12px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }} 
                      >
                        <option value="KE">Kenya (Nairobi)</option>
                        <option value="US">United States (Atlanta)</option>
                        <option value="GB">United Kingdom (London)</option>
                        <option value="NG">Nigeria (Lagos)</option>
                        <option value="ZA">South Africa (Johannesburg)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Creator Bio</label>
                    <textarea 
                      placeholder="Add a brand bio so supervisors can locate your catalog vibes..." 
                      style={{ width: '100%', height: '80px', padding: '8px 12px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }} 
                    />
                  </div>

                  <button type="submit" className="btn-get-signed" style={{ padding: '12px', fontWeight: 'bold' }}>
                    Save Settings
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'app_marketplace' && (
              <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><RiGlobalLine style={{ color: '#00f2fe' }} /> Intermaven App Marketplace</h3>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '24px' }}>Activate and coordinate utility software across the shared decentralised music network.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '16px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#fff' }}>SyncMavens Dashboard</h4>
                      <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', margin: '0 0 12px 0' }}>Supervisors and creators matching catalog files against cinema briefs.</p>
                    </div>
                    <span style={{ fontSize: '11px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', padding: '4px 8px', borderRadius: '3px', fontWeight: 'bold', alignSelf: 'flex-start' }}>✓ Active in Sandbox</span>
                  </div>

                  <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '16px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#fff' }}>TuneStream Player</h4>
                      <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', margin: '0 0 12px 0' }}>Consumer audio player and listener playlists hosting tool.</p>
                    </div>
                    <button onClick={() => alert("Launching TuneStream service mapping...")} className="btn-get-signed" style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '3px' }}>Launch Service</button>
                  </div>

                  <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '16px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#fff' }}>TunePay POS terminal</h4>
                      <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', margin: '0 0 12px 0' }}>Live cash-out splits settlement ledger module for gigs.</p>
                    </div>
                    <button onClick={() => alert("Connecting TunePay point-of-sale mapping...")} className="btn-get-signed" style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '3px' }}>Connect POS</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'domain_mappings' && (
              <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><RiGlobalLine style={{ color: '#00f2fe' }} /> DNS Domain Mappings</h3>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '24px' }}>Map custom domains to separate utility modules on the Intermaven platform.</p>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left', marginBottom: '20px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#64748b' }}>
                      <th style={{ padding: '8px 4px' }}>Host Domain</th>
                      <th style={{ padding: '8px 4px' }}>Target Mapping</th>
                      <th style={{ padding: '8px 4px' }}>Verification</th>
                      <th style={{ padding: '8px 4px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '10px 4px', fontWeight: 'bold' }}>syncmavens.com</td>
                      <td style={{ padding: '10px 4px', color: '#00f2fe' }}>intermaven.io/syncmavens</td>
                      <td style={{ padding: '10px 4px', color: '#10b981' }}>✓ Verified CNAME</td>
                      <td style={{ padding: '10px 4px', color: '#10b981' }}>Live</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '10px 4px', fontWeight: 'bold' }}>tunestream.co</td>
                      <td style={{ padding: '10px 4px', color: '#00f2fe' }}>intermaven.io/tunestream</td>
                      <td style={{ padding: '10px 4px', color: '#10b981' }}>✓ Verified A Record</td>
                      <td style={{ padding: '10px 4px', color: '#10b981' }}>Live</td>
                    </tr>
                  </tbody>
                </table>
                <button onClick={() => alert("Verification in progress...")} className="btn-primary" style={{ padding: '8px 16px', fontSize: '11px', borderRadius: '3px', background: '#00f2fe', color: '#000', border: 'none', fontWeight: 'bold' }}>Verify New Mapping</button>
              </div>
            )}

            {activeTab === 'promoted_acts' && (
              <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><RiSparklingLine style={{ color: '#00f2fe' }} /> Promoted Acts & Featured Placements</h3>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '24px' }}>Configure featured creators listed across corporate landing portals.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '4px', textAlign: 'center' }}>
                    <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=80&auto=format&fit=crop&q=60" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 8px' }} />
                    <h5 style={{ margin: '0 0 4px', fontSize: '13px' }}>Aisha Okoro</h5>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block', marginBottom: '12px' }}>Nairobi Sunset (House)</span>
                    <button onClick={() => alert("Editing placement...")} className="btn-get-signed" style={{ padding: '4px 10px', fontSize: '10px', borderRadius: '3px', width: '100%' }}>Edit slot</button>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '4px', textAlign: 'center' }}>
                    <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=80&auto=format&fit=crop&q=60" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 8px' }} />
                    <h5 style={{ margin: '0 0 4px', fontSize: '13px' }}>Caleb</h5>
                    <span style={{ fontSize: '10px', color: '#64748b', display: 'block', marginBottom: '12px' }}>Lagos Lights (Afrobeats)</span>
                    <button onClick={() => alert("Editing placement...")} className="btn-get-signed" style={{ padding: '4px 10px', fontSize: '10px', borderRadius: '3px', width: '100%' }}>Edit slot</button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Copyright strip */}
          <div className="dashboard-copyright-strip">
            <span>© {new Date().getFullYear()} TuneMavens Ltd. All rights reserved.</span>
            <span className="dashboard-copyright-divider">·</span>
            <span>Operating on the shared Intermaven network.</span>
          </div>
        </main>

        {renderContractModal()}
      </div>
    );
  }

  /* ================= STANDARD ROUTER MULTIPAGE VIEWS ================= */
  return (
    <div className="landing-layout">
      {/* Navigation Bar */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner-container">
          <div className="nav-logo-container-role">
            <Link to="/" className="nav-logo-link">
              <img 
                src={smLogo} 
                alt="SyncMavens Logo" 
                className="logo-image-role logo-image"
              />
            </Link>
            <a
              href="http://localhost:3000/"
              onClick={handleBackToTuneMavens}
              className="back-to-tm-link"
            >
              {"<< a tunemavens utility"}
            </a>
          </div>

          {/* Consolidated Dropdowns menu to fit width */}
          <ul className="nav-links">
            <li className="nav-dropdown-wrapper">
              <span className="nav-link dropdown-trigger">Distribute</span>
              <div className="nav-dropdown-menu">
                <Link to="/distribution" className="dropdown-item">
                  <strong>Digital Release Ingestion</strong>
                  <span>Upload and distribute singles, EPs, and albums worldwide.</span>
                </Link>
                <Link to="/global-dsp" className="dropdown-item">
                  <strong>Global DSP Distribution</strong>
                  <span>Push your catalog to Spotify, Apple Music, and Amazon.</span>
                </Link>
                <Link to="/creator-dashboard" className="dropdown-item">
                  <strong>Creator Dashboard</strong>
                  <span>Track your streams, analytics, and payouts in real-time.</span>
                </Link>
              </div>
            </li>

            <li className="nav-dropdown-wrapper">
              <span className="nav-link dropdown-trigger">Monetize</span>
              <div className="nav-dropdown-menu">
                <Link to="/opportunities" className="dropdown-item">
                  <strong>Sync Opportunities</strong>
                  <span>Browse active briefs from Netflix, HBO, and EA Sports.</span>
                </Link>
                <Link to="/analyzer" className="dropdown-item">
                  <strong>AI Match Simulator</strong>
                  <span>Check your compatibility score against supervisor projects.</span>
                </Link>
                <Link to="/sync-ready" className="dropdown-item">
                  <strong>Sync-Ready Catalog</strong>
                  <span>Browse and preview our active registry of licensable music.</span>
                </Link>
                <Link to="/publishing" className="dropdown-item">
                  <strong>Music Publishing</strong>
                  <span>Register with PROs and collect 100% of your composer royalties.</span>
                </Link>
                <Link to="/youtube-id" className="dropdown-item">
                  <strong>YouTube Content ID</strong>
                  <span>Monetize user videos containing your music on YouTube & TikTok.</span>
                </Link>
              </div>
            </li>

            <li className="nav-dropdown-wrapper">
              <span className="nav-link dropdown-trigger">Promote</span>
              <div className="nav-dropdown-menu">
                <Link to="/smartlinks" className="dropdown-item">
                  <strong>SmartLinks Generator</strong>
                  <span>Create track smartlinks and pre-save campaigns for Spotify.</span>
                </Link>
                <Link to="/playlist-submissions" className="dropdown-item">
                  <strong>Playlist Submissions</strong>
                  <span>Submit your releases to active curators and radio pools.</span>
                </Link>
                <Link to="/press-releases" className="dropdown-item">
                  <strong>Press Release Service</strong>
                  <span>Draft and distribute professional EPKs and announcements.</span>
                </Link>
              </div>
            </li>

            <li className="nav-dropdown-wrapper">
              <span className="nav-link dropdown-trigger">Learn</span>
              <div className="nav-dropdown-menu">
                <Link to="/calculator" className="dropdown-item">
                  <strong>Waterfall Calculator</strong>
                  <span>Simulate agency payouts and split cascades.</span>
                </Link>
                <Link to="/success" className="dropdown-item">
                  <strong>Success Stories</strong>
                  <span>See independent creators who secured sync deals.</span>
                </Link>
                <Link to="/faq" className="dropdown-item">
                  <strong>Sync Licensing FAQs</strong>
                  <span>Learn about composer shares and mechanical royalties.</span>
                </Link>
                <Link to="/blog" className="dropdown-item">
                  <strong>Artist Advice Blog</strong>
                  <span>Tips on collecting mechanicals and performance royalties.</span>
                </Link>
              </div>
            </li>

            <li className="nav-dropdown-wrapper">
              <span className="nav-link dropdown-trigger">Apps</span>
              <div className="nav-dropdown-menu">
                <Link to="/dashboard-apps" className="dropdown-item">
                  <strong>Dashboard Apps</strong>
                  <span>Consolidated web portals for distribution and marketing.</span>
                </Link>
                <Link to="/native-apps" className="dropdown-item">
                  <strong>Native Apps</strong>
                  <span>Standalone mobile companions for split sheets and live pay.</span>
                </Link>
              </div>
            </li>
          </ul>

          {/* Desktop Actions */}
          <div className="nav-desktop-actions-box">
            {isLoggedIn ? (
              <button onClick={() => navigate('/dashboard')} className="btn-primary">
                Dashboard
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="btn-secondary">
                  Log In
                </button>
                <button onClick={() => navigate('/register')} className="btn-primary">
                  Start Free
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Pages Router Content */}
      <Routes>
        <Route path="/" element={
          <>
            {/* Sliding Hero Banner */}
            <div className="hw">
              <div className="bgs">
                {backgrounds.map((bg, idx) => (
                  <div 
                    key={idx}
                    className={`bg ${currentSlide === idx ? 'on' : ''}`}
                    style={{
                      backgroundImage: bg,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: currentSlide === idx 
                        ? (titleHovered ? 'brightness(1.05) blur(0px)' : 'brightness(0.6) blur(1.5px)')
                        : 'none',
                      transform: currentSlide === idx && titleHovered ? 'scale(1.03)' : 'scale(1)',
                      transition: 'filter 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                  />
                ))}
                <div 
                  className="bgo" 
                  style={{
                    opacity: titleHovered ? 0.35 : 0.75,
                    transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
                  }}
                />
              </div>

              <div className="hs">
                <div 
                  className="hcont"
                  key={currentSlide}
                  onMouseEnter={() => setTitleHovered(true)}
                  onMouseLeave={() => setTitleHovered(false)}
                >
                  <div className={`he hbadge ${slideState}`}>
                    <span 
                      className="bdot" 
                      style={{ 
                        background: currentSlideData.dot,
                        animation: 'pulseGlow 2s infinite'
                      }} 
                    />
                    <span>{currentSlideData.badge}</span>
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
                    <button type="button" onClick={() => handleHeroAction(currentSlideData.b1action)} className="hbp">
                      {currentSlideData.b1}
                    </button>
                    <button type="button" onClick={() => handleHeroAction(currentSlideData.b2action)} className="hbg">
                      {currentSlideData.b2}
                    </button>
                  </div>
                </div>
              </div>

              <div className={`sui-arrows ${slideState}`}>
                <button type="button" className="slide-nav prev" onClick={goToPrevSlide} aria-label="Previous slide">‹</button>
                <button type="button" className="slide-nav next" onClick={goToNextSlide} aria-label="Next slide">›</button>
              </div>

              <div className={`sui-bottom ${slideState}`}>
                <div className="spr">
                  <div className="spb" style={{ width: `${progress}%` }} />
                </div>
                <div className="sdots">
                  {SLIDES.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`sd ${index === currentSlide ? 'on' : ''}`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Brand partners */}
            <section className="landing-partners">
              <h5>WHERE OUR MUSIC PLACES</h5>
              <div className="partners-grid">
                <div className="partner-logo"><RiNetflixFill size={32} /><span>Netflix</span></div>
                <div className="partner-logo"><RiMovieLine size={32} /><span>A24 Films</span></div>
                <div className="partner-logo"><RiGlobalLine size={32} /><span>BBC Television</span></div>
                <div className="partner-logo"><RiSparklingLine size={32} /><span>EA Sports</span></div>
              </div>
            </section>

            {/* What's on the Table Section */}
            <section className="landing-stepper" id="on-the-table" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '80px', paddingTop: '40px' }}>
              <div className="table-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div className="step-card" style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '3px', padding: '24px' }}>
                  <div style={{ background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.15)', borderRadius: '3px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f2fe' }}>
                    <RiSparklingLine size={20} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#fff' }}>Keep 100% of Publishing share</h4>
                  <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                    Our publishing arm handles all tracking and administration. Typically, the artist retains their full writer and publisher shares, exactly like classic composers.
                  </p>
                </div>

                <div className="step-card" style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '3px', padding: '24px' }}>
                  <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.15)', borderRadius: '3px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                    <RiExchangeDollarLine size={20} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#fff' }}>No Predatory Advances</h4>
                  <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                    We do not offer catalog signing advances at this stage. This keeps our interests fully aligned with yours: we only make money when we secure placements for you.
                  </p>
                </div>

                <div className="step-card" style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '3px', padding: '24px' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '3px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                    <RiGlobalLine size={20} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#fff' }}>Agency Partner Network</h4>
                  <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                    We route pitches directly to global agency partners who hold guarantees and briefs from major networks, ensuring high placement success rates.
                  </p>
                </div>

                <div className="step-card" style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '3px', padding: '24px' }}>
                  <div style={{ background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.15)', borderRadius: '3px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f2fe' }}>
                    <RiCheckDoubleLine size={20} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#fff' }}>Automated Waterfall Splits</h4>
                  <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                    Sync buyout fees cascade automatically to writers, producers, and publisher shares, deposited straight into linked payout accounts instantly.
                  </p>
                </div>
              </div>
            </section>

            {/* How it Works Section */}
            <section className="landing-stepper" id="how-it-works" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '80px' }}>
              <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>How SyncMavens Works</h2>
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
                Three simple steps to make your music available for high-value television, film, and commercial synchronization licensing.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                  <div style={{ fontSize: '72px', fontWeight: '900', color: 'rgba(0, 242, 254, 0.08)', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>01</div>
                  <div style={{ marginTop: '-24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>Upload Masters & Stems</h3>
                    <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                      Drag and drop your high-resolution masters, instrumental versions, and clean audio stem files into our secure ingestion engine.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                  <div style={{ fontSize: '72px', fontWeight: '900', color: 'rgba(139, 92, 246, 0.08)', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>02</div>
                  <div style={{ marginTop: '-24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>Tag AI Metadata</h3>
                    <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                      Specify the mood, genre, bpm, and vocal styling. Our AI system indexes your metadata so it matches searches by global music supervisors immediately.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                  <div style={{ fontSize: '72px', fontWeight: '900', color: 'rgba(16, 185, 129, 0.08)', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>03</div>
                  <div style={{ marginTop: '-24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>Get Pitched & Paid</h3>
                    <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                      Our agency partners secure television, film, and commercial contracts. Buyout fees cascade instantly to your linked team splits.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* In-page rendering of opportunities & widgets */}
            <OpportunitiesView briefs={briefs} />
            <AnalyzerView briefs={briefs} simulatorForm={simulatorForm} setSimulatorForm={setSimulatorForm} runSimulation={runSimulation} simulating={simulating} simStep={simStep} simReport={simReport} loadSampleTrack={loadSampleTrack} navigate={navigate} />

            {/* Licensing Options Section */}
            <section className="landing-stepper" id="licensing-options" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '80px', paddingTop: '40px' }}>
              <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>Choose Your Licensing Model</h2>
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
                We offer two transparent licensing frameworks to put your music in front of supervisors under artist-friendly conditions.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                {/* Option 1 Box */}
                <div className="step-card" style={{ padding: '32px', border: '1px solid rgba(0, 242, 254, 0.15)', background: 'radial-gradient(circle at top left, rgba(0, 242, 254, 0.03) 0%, transparent 80%)' }}>
                  <div style={{ background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.15)', borderRadius: '3px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f2fe', marginBottom: '16px' }}>
                    <RiBriefcaseLine size={24} />
                  </div>
                  <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '12px' }}>Option 1: Guaranteed Placements</h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '16px' }}>
                    Secure placement deals through our curated agency partners. Perfect for artists seeking direct pitching backing to major networks.
                  </p>
                  <ul style={{ textAlign: 'left', fontSize: '12.5px', color: '#cbd5e1', listStyleType: 'square', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                    <li><strong>Agency Commission:</strong> 30% off the top goes to securing partners.</li>
                    <li><strong>SyncMavens Split:</strong> 25% administration fee from the remainder.</li>
                    <li><strong>Publishing Retention:</strong> Handled by our publishing arm—writer, composer, and performer retain 100% of their respective shares.</li>
                  </ul>
                </div>

                {/* Option 2 Box */}
                <div className="step-card" style={{ padding: '32px', border: '1px solid rgba(139, 92, 246, 0.15)', background: 'radial-gradient(circle at top right, rgba(139, 92, 246, 0.03) 0%, transparent 80%)' }}>
                  <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.15)', borderRadius: '3px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', marginBottom: '16px' }}>
                    <RiSparklingLine size={24} />
                  </div>
                  <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '12px' }}>Option 2: Sync Brief AI & 'Sync Ready' Gallery</h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '16px' }}>
                    Upload and match your songs. Approved tracks are indexed directly in the "Sync Ready" catalog for supervisors.
                  </p>
                  <ul style={{ textAlign: 'left', fontSize: '12.5px', color: '#cbd5e1', listStyleType: 'square', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                    <li><strong>AI Ingestion:</strong> Smart matching tags audio metadata and scene vibes automatically.</li>
                    <li><strong>Supervisor Previews:</strong> Verified supervisors can stream 45-second clips.</li>
                    <li><strong>Secure Vault:</strong> Restricts master WAV file downloads and cue sheets behind verified supervisor sign-ins.</li>
                  </ul>
                </div>
              </div>
            </section>

            <CalculatorView buyoutFee={buyoutFee} setBuyoutFee={setBuyoutFee} writerSplit={writerSplit} setWriterSplit={setWriterSplit} producerSplit={producerSplit} setProducerSplit={setProducerSplit} />
            <SuccessStoriesView />
            <FaqView openFaq={openFaq} toggleFaq={toggleFaq} />
          </>
        } />
        
        <Route path="/opportunities" element={<OpportunitiesView briefs={briefs} standalone={true} />} />
        <Route path="/analyzer" element={<AnalyzerView briefs={briefs} simulatorForm={simulatorForm} setSimulatorForm={setSimulatorForm} runSimulation={runSimulation} simulating={simulating} simStep={simStep} simReport={simReport} loadSampleTrack={loadSampleTrack} navigate={navigate} standalone={true} />} />
        <Route path="/calculator" element={<CalculatorView buyoutFee={buyoutFee} setBuyoutFee={setBuyoutFee} writerSplit={writerSplit} setWriterSplit={setWriterSplit} producerSplit={producerSplit} setProducerSplit={setProducerSplit} standalone={true} />} />
        <Route path="/success" element={<SuccessStoriesView standalone={true} />} />
        <Route path="/faq" element={<FaqView openFaq={openFaq} toggleFaq={toggleFaq} standalone={true} />} />
        <Route path="/publishing" element={<PublishingView standalone={true} />} />
        <Route path="/youtube-id" element={<YoutubeIdView standalone={true} />} />
        <Route path="/sync-ready" element={<SyncReadyView standalone={true} />} />
        <Route path="/distribution" element={<DistributionView standalone={true} />} />
        <Route path="/global-dsp" element={<GlobalDspView standalone={true} />} />
        <Route path="/smartlinks" element={<SmartLinksView standalone={true} />} />
        <Route path="/playlist-submissions" element={<PlaylistSubmissionsView standalone={true} />} />
        <Route path="/press-releases" element={<PressReleaseView standalone={true} />} />
        <Route path="/dashboard-apps" element={<DashboardAppsView standalone={true} />} />
        <Route path="/native-apps" element={<NativeAppsView standalone={true} />} />
        <Route path="/creator-dashboard" element={<CreatorDashboardPageView standalone={true} />} />
        <Route path="/blog" element={<BlogView standalone={true} />} />
        <Route path="/login" element={<LoginView onLogin={(user) => {
          localStorage.setItem('syncmavens_logged_in', 'true');
          localStorage.setItem('syncmavens_user_role', user.role);
          localStorage.setItem('syncmavens_user_name', user.name);
          localStorage.setItem('syncmavens_user_email', user.email);
          setIsLoggedIn(true);
          setUserRole(user.role);
          setUserName(user.name);
          setUserEmail(user.email);
          if (user.role === 'supervisor') {
            setActiveTab('briefs_mgmt');
          } else {
            setActiveTab('briefs');
          }
        }} />} />
        <Route path="/register" element={<RegisterView onLogin={(user) => {
          localStorage.setItem('syncmavens_logged_in', 'true');
          localStorage.setItem('syncmavens_user_role', user.role);
          localStorage.setItem('syncmavens_user_name', user.name);
          localStorage.setItem('syncmavens_user_email', user.email);
          setIsLoggedIn(true);
          setUserRole(user.role);
          setUserName(user.name);
          setUserEmail(user.email);
          if (user.role === 'supervisor') {
            setActiveTab('briefs_mgmt');
          } else {
            setActiveTab('briefs');
          }
        }} />} />
      </Routes>

      {/* Shared Landing Page Footer (Portal Styled with logo second instance) */}
      <footer className="landing-footer">
        <div className="footer-inner-container">
          <div className="footer-grid">
            {/* Brand Column with second instance logo and tagline */}
            <div className="footer-brand">
              <div className="footer-logo">
                <img 
                  src={smLogo} 
                  alt="SyncMavens Footer Logo" 
                  className="footer-logo-image" 
                  style={{ height: '36px', width: 'auto', display: 'block', margin: '0 auto' }} 
                />
              </div>
              <div className="footer-desc">
                Next-generation sync licensing tools built on the shared Intermaven network.
              </div>
              <div className="footer-host-link" style={{ marginTop: '4px' }}>
                syncmavens.com
              </div>
              <div className="footer-host-link" style={{ marginTop: '0px' }}>
                intermaven.io
              </div>
            </div>

            {/* Sync licensing links */}
            <div className="footer-col">
              <div style={{ display: 'inline-block', textAlign: 'left' }}>
                <h4>Sync & Monetize</h4>
                <div className="footer-links">
                  <Link to="/opportunities" className="footer-link">Active Briefs</Link>
                  <Link to="/analyzer" className="footer-link">Match Simulator</Link>
                  <Link to="/sync-ready" className="footer-link">Sync-Ready Catalog</Link>
                  <Link to="/calculator" className="footer-link">Waterfall Calculator</Link>
                  <Link to="/publishing" className="footer-link">Music Publishing</Link>
                  <Link to="/youtube-id" className="footer-link">YouTube Content ID</Link>
                  <Link to="/success" className="footer-link">Success Stories</Link>
                  <Link to="/faq" className="footer-link">FAQs</Link>
                  <Link to="/blog" className="footer-link">Advice Blog</Link>
                </div>
              </div>
            </div>

            {/* Ecosystem links */}
            <div className="footer-col">
              <div style={{ display: 'inline-block', textAlign: 'left' }}>
                <h4>Ecosystem</h4>
                <div className="footer-links">
                  <a href="http://localhost:3000/" className="footer-link">TuneMavens Portal</a>
                  <a href="http://localhost:3001/" className="footer-link">TuneStream Player</a>
                  <Link to="/distribution" className="footer-link">Digital Release Ingestion</Link>
                  <Link to="/calculator" className="footer-link">Escrow split ledgers</Link>
                </div>
              </div>
            </div>

            {/* Follow Us links with SVGs and Copyright copy */}
            <div className="footer-col">
              <div style={{ display: 'inline-block', textAlign: 'left' }}>
                <h4>Follow us</h4>
                <div className="footer-social" style={{ display: 'flex', gap: '8px' }}>
                  <a className="sico instagram" onClick={() => alert('Instagram handle coming soon!')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a className="sico x" onClick={() => alert('X handle coming soon!')}>
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                  </a>
                  <a className="sico linkedin" onClick={() => alert('LinkedIn handle coming soon!')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                </div>
                <div className="footer-copy">
                  © 2026 SyncMavens. A TuneMavens Utility.
                </div>
              </div>
            </div>
          </div>

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
    </div>
  );
}

// Sub-components for PageViews
function OpportunitiesView({ briefs, standalone }) {
  return (
    <div className={standalone ? "standalone-page-wrapper" : ""}>
      {standalone && (
        <div className="page-header-banner" style={{ backgroundImage: `url(${syncPlacementHero})` }}>
          <div className="page-header-overlay" />
          <div className="page-header-content">
            <h1 className="page-header-title">Sync Placements Opportunities</h1>
            <div className="page-header-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">Opportunities</span>
            </div>
          </div>
        </div>
      )}
      <section className="landing-stepper" id="opportunities" style={{ paddingTop: standalone ? '60px' : '80px', paddingBottom: '40px' }}>
        {!standalone && <h2 style={{ marginBottom: '8px' }}>Active Sync Placements</h2>}
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginBottom: '32px' }}>Real-time briefs from music supervisors currently seeking tracks.</p>
        <div className="steps-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {briefs.map(brief => (
            <div key={brief.id} className="step-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ color: '#00f2fe', fontWeight: 'bold' }}>{brief.client}</span>
                <span style={{ color: brief.status === 'Active' ? '#10b981' : '#ef4444' }}>{brief.status}</span>
              </div>
              <h4 style={{ margin: '4px 0 0', fontSize: '15px' }}>{brief.project}</h4>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4', flexGrow: 1 }}>{brief.description}</p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '10px', fontSize: '11px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                <span>Fee: <strong>{brief.budget}</strong></span>
                <span>Genre: <strong>{brief.genre.split(' ')[0]}</strong></span>
              </div>
            </div>
          ))}
        </div>
        <SignUpCTA />
      </section>
    </div>
  );
}

function AnalyzerView({ briefs, simulatorForm, setSimulatorForm, runSimulation, simulating, simStep, simReport, loadSampleTrack, navigate, standalone }) {
  return (
    <div className={standalone ? "standalone-page-wrapper" : ""}>
      {standalone && (
        <div className="page-header-banner" style={{ backgroundImage: `url(${creatorCatalogHero})` }}>
          <div className="page-header-overlay" />
          <div className="page-header-content">
            <h1 className="page-header-title">AI Sync Match Simulator</h1>
            <div className="page-header-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">Match Analyzer</span>
            </div>
          </div>
        </div>
      )}
      <section className="landing-hero" id="analyzer" style={{ paddingTop: standalone ? '60px' : '60px', background: 'radial-gradient(circle at center, rgba(0, 242, 254, 0.04) 0%, transparent 60%)', paddingBottom: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="hero-content" style={{ width: '100%', maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {!standalone && (
            <>
              <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>Check if Your Track Matches a Brief</h2>
            </>
          )}
          <p style={{ fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>Input your track metadata or load a sample file to calculate your compatibility score against active supervisor projects.</p>
          
          <div className="dashboard-card" style={{ width: '100%', maxWidth: '650px', margin: '0 auto', background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: '#64748b', alignSelf: 'center' }}>Load Demo:</span>
              <button type="button" onClick={() => loadSampleTrack('Midnight Sun', 'Hologram Club', 'Synthwave', 'Action', 'Instrumental')} style={{ padding: '4px 10px', fontSize: '11px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '3px', cursor: 'pointer' }}>Midnight Sun (Action)</button>
              <button type="button" onClick={() => loadSampleTrack('Resonance', 'Aether Echo', 'Neo-Classical', 'Melancholy', 'Instrumental')} style={{ padding: '4px 10px', fontSize: '11px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '3px', cursor: 'pointer' }}>Resonance (Melancholic)</button>
            </div>

            <form onSubmit={runSimulation} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Track Title</label>
                  <input type="text" placeholder="Title" value={simulatorForm.title} onChange={e => setSimulatorForm({ ...simulatorForm, title: e.target.value })} style={{ padding: '8px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Artist Name</label>
                  <input type="text" placeholder="Artist" value={simulatorForm.artist} onChange={e => setSimulatorForm({ ...simulatorForm, artist: e.target.value })} style={{ padding: '8px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Genre</label>
                  <input type="text" placeholder="e.g. Pop, Phonk" value={simulatorForm.genre} onChange={e => setSimulatorForm({ ...simulatorForm, genre: e.target.value })} style={{ padding: '8px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Vibe / Mood</label>
                  <select value={simulatorForm.mood} onChange={e => setSimulatorForm({ ...simulatorForm, mood: e.target.value })} style={{ padding: '8px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }}>
                    <option value="Action">Action / Retro</option>
                    <option value="Uplifting">Uplifting / Happy</option>
                    <option value="Melancholy">Melancholy / Spacious</option>
                    <option value="Tension">Tension / Dark</option>
                    <option value="Epic">Epic / Cinematic</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Vocals</label>
                  <select value={simulatorForm.vocals} onChange={e => setSimulatorForm({ ...simulatorForm, vocals: e.target.value })} style={{ padding: '8px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }}>
                    <option value="Instrumental">Instrumental</option>
                    <option value="Female Vocals">Female Vocals</option>
                    <option value="Male Vocals">Male Vocals</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-get-signed" style={{ padding: '12px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px', borderRadius: '3px' }} disabled={simulating}>
                {simulating ? (
                  <>
                    <RiLoader4Line size={16} className="animate-spin-slow" />
                    {simStep === 1 && "Ingesting audio waveforms..."}
                    {simStep === 2 && "Matching scene compatibility..."}
                    {simStep === 3 && "Iterating supervisor budgets..."}
                  </>
                ) : "Analyze Sync Compatibility"}
              </button>
            </form>

            {simReport && (
              <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(0, 242, 254, 0.03)', border: '1px dashed rgba(0, 242, 254, 0.25)', borderRadius: '3px', display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.15)', borderRadius: '3px', width: '90px', height: '90px', flexShrink: 0 }}>
                  <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#00f2fe' }}>{simReport.score}%</span>
                  <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Match Score</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Recommended Placement Brief</span>
                  <h5 style={{ margin: 0, fontSize: '14px', color: '#fff' }}>{simReport.brief.project} ({simReport.brief.client})</h5>
                  <p style={{ margin: '4px 0', color: '#94a3b8', lineHeight: '1.4' }}>{simReport.rationale}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ color: '#00f2fe', fontWeight: 'bold' }}>Payout: {simReport.fee} Upfront Fee</span>
                    <button type="button" onClick={() => navigate(isLoggedIn ? '/dashboard' : '/login')} className="btn-get-signed" style={{ padding: '4px 12px', fontSize: '11px', borderRadius: '3px' }}>Claim & Pitch Track</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <SignUpCTA />
      </section>
    </div>
  );
}

// ==========================================
// Sign Up CTA Helper Component
// ==========================================
function SignUpCTA() {
  return (
    <div style={{ marginTop: '40px', padding: '32px', background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.04) 0%, rgba(139, 92, 246, 0.04) 100%)', border: '1px solid rgba(0, 242, 254, 0.15)', borderRadius: '4px', textAlign: 'center' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>Ready to match your catalog and collect global royalties?</h3>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px', maxWidth: '600px', margin: '0 auto 20px' }}>Join SyncMavens today. Wire your catalog directly to active supervisor briefs and audit your split cascades live.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link to="/register?role=creator" className="btn-primary" style={{ padding: '10px 20px', fontWeight: 'bold', fontSize: '13px', textDecoration: 'none' }}>Join as Creator</Link>
        <Link to="/register?role=supervisor" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '13px', textDecoration: 'none', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>Join as Music Supervisor</Link>
      </div>
    </div>
  );
}

function CalculatorView({ buyoutFee, setBuyoutFee, writerSplit, setWriterSplit, producerSplit, setProducerSplit, standalone }) {
  const agencyFee = buyoutFee * 0.3;
  const remainder = buyoutFee - agencyFee;
  const syncMavensFee = remainder * 0.25;
  const creatorPool = remainder - syncMavensFee;

  return (
    <div className={standalone ? "standalone-page-wrapper" : ""}>
      {standalone && (
        <div className="page-header-banner" style={{ backgroundImage: `url(${splitsCascadeHero})` }}>
          <div className="page-header-overlay" />
          <div className="page-header-content">
            <h1 className="page-header-title">Waterfall Compensation Calculator</h1>
            <div className="page-header-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">Waterfall Calculator</span>
            </div>
          </div>
        </div>
      )}
      <section className="landing-stepper" id="calculator" style={{ paddingTop: standalone ? '60px' : '80px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '80px' }}>
        {!standalone && (
          <>
            <h2 style={{ marginBottom: '8px', textAlign: 'center' }}>Waterfall Compensation Calculator</h2>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginBottom: '40px' }}>Adjust sliders to simulate how sync buyout fees cascade through split agreements.</p>
          </>
        )}
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: standalone ? '40px' : '0' }}>
          {/* Input sliders */}
          <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8' }}>Sync Placement Buyout Fee</label>
                <strong style={{ color: '#00f2fe' }}>${buyoutFee.toLocaleString()}</strong>
              </div>
              <input type="range" min="1000" max="100000" step="1000" value={buyoutFee} onChange={e => setBuyoutFee(parseInt(e.target.value))} style={{ width: '100%', height: '4px', cursor: 'pointer' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8' }}>Writer Share (%)</label>
                <strong style={{ color: '#8b5cf6' }}>{writerSplit}%</strong>
              </div>
              <input type="range" min="0" max="100" step="5" value={writerSplit} onChange={e => { setWriterSplit(parseInt(e.target.value)); setProducerSplit(100 - parseInt(e.target.value)); }} style={{ width: '100%', height: '4px', cursor: 'pointer' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8' }}>Producer Share (%)</label>
                <strong style={{ color: '#8b5cf6' }}>{producerSplit}%</strong>
              </div>
              <input type="range" min="0" max="100" step="5" value={producerSplit} onChange={e => { setProducerSplit(parseInt(e.target.value)); setWriterSplit(100 - parseInt(e.target.value)); }} style={{ width: '100%', height: '4px', cursor: 'pointer' }} />
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#eab308' }}>
              <RiAlertLine size={18} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '11px', lineHeight: '1.4' }}>
                <strong>Compensation Model Note:</strong> 30% off the top goes to our agency partners who secure the deal. SyncMavens retains a 25% fee from the remainder. Artist typically keeps their full writing and publishing shares. We do not offer advances.
              </span>
            </div>
          </div>

          {/* Waterfall Output */}
          <div className="dashboard-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-panel)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '3px' }}>
            <h4 style={{ fontSize: '14px', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', margin: 0 }}>Waterfall Payout Cascade</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>Upfront Sync Buyout Fee:</span>
                <span style={{ fontWeight: 'bold' }}>${buyoutFee.toLocaleString()}</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: '#fff' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>Agency Partner Fee (30% off the top):</span>
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>-${agencyFee.toLocaleString()}</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '30%', height: '100%', background: '#ef4444' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>SyncMavens Administration Fee (25% of remainder):</span>
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>-${syncMavensFee.toLocaleString()}</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '17.5%', height: '100%', background: '#f59e0b' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>Writer Payout ({writerSplit}% of net creator pool):</span>
                <span style={{ color: '#00f2fe', fontWeight: 'bold' }}>+${(creatorPool * (writerSplit / 100)).toLocaleString()}</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${52.5 * (writerSplit / 100)}%`, height: '100%', background: '#00f2fe' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>Producer Payout ({producerSplit}% of net creator pool):</span>
                <span style={{ color: '#00f2fe', fontWeight: 'bold' }}>+${(creatorPool * (producerSplit / 100)).toLocaleString()}</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${52.5 * (producerSplit / 100)}%`, height: '100%', background: '#00f2fe' }}></div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '8px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#10b981' }}>Publishing Arm Royalty Share:</span>
              <span style={{ fontWeight: 'bold', color: '#10b981' }}>100% Artist Composer Share Retained</span>
            </div>
          </div>
        </div>
        <SignUpCTA />
      </section>
    </div>
  );
}

function SuccessStoriesView({ standalone }) {
  return (
    <div className={standalone ? "standalone-page-wrapper" : ""}>
      {standalone && (
        <div className="page-header-banner" style={{ backgroundImage: `url(${syncPlacementHero})` }}>
          <div className="page-header-overlay" />
          <div className="page-header-content">
            <h1 className="page-header-title">Placement Success Stories</h1>
            <div className="page-header-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">Success Stories</span>
            </div>
          </div>
        </div>
      )}
      <section className="landing-stepper" id="success" style={{ paddingTop: standalone ? '60px' : '80px', paddingBottom: '40px' }}>
        {!standalone && (
          <>
            <h2 style={{ marginBottom: '12px', textAlign: 'center' }}>Placement Success Stories</h2>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginBottom: '32px' }}>Independent creators who successfully matched and licensed their catalog.</p>
          </>
        )}
        
        <div className="steps-container" style={{ marginTop: standalone ? '40px' : '0' }}>
          <div className="step-card" style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=80&auto=format&fit=crop&q=60" alt="Hologram Club" style={{ width: '48px', height: '48px', borderRadius: '3px', objectFit: 'cover' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '14px' }}>Hologram Club</h4>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Placed: Netflix Cyberpunk Series</span>
              </div>
            </div>
            <p style={{ fontStyle: 'italic', fontSize: '12px', lineHeight: '1.5' }}>
              "Midnight Sun matched a Netflix action sequence. SyncMavens handled the agreements, split calculations, and payout automatically. Pure placement royalties, no catalog lockups."
            </p>
            <div style={{ marginTop: '12px', fontSize: '11px', color: '#00f2fe', fontWeight: 'bold' }}>Payout: $15,000 Upfront Buyout</div>
          </div>

          <div className="step-card" style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=80&auto=format&fit=crop&q=60" alt="Aether Echo" style={{ width: '48px', height: '48px', borderRadius: '3px', objectFit: 'cover' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '14px' }}>Aether Echo</h4>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Placed: EA Sports Promo Spot</span>
              </div>
            </div>
            <p style={{ fontStyle: 'italic', fontSize: '12px', lineHeight: '1.5' }}>
              "I uploaded my stems, filled in metadata, and got pitched to a sports promo brief. SyncMavens' low 10% fee means I collect the bulk of the upfront license fee directly."
            </p>
            <div style={{ marginTop: '12px', fontSize: '11px', color: '#00f2fe', fontWeight: 'bold' }}>Payout: $25,000 Upfront Buyout</div>
          </div>
        </div>
        <SignUpCTA />
      </section>
    </div>
  );
}

function FaqView({ openFaq, toggleFaq, standalone }) {
  return (
    <div className={standalone ? "standalone-page-wrapper" : ""}>
      {standalone && (
        <div className="page-header-banner" style={{ backgroundImage: `url(${syncPlacementHero})` }}>
          <div className="page-header-overlay" />
          <div className="page-header-content">
            <h1 className="page-header-title">Sync Licensing FAQ</h1>
            <div className="page-header-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">FAQs</span>
            </div>
          </div>
        </div>
      )}
      <section className="landing-faq" id="faq" style={{ paddingTop: standalone ? '60px' : '80px', paddingBottom: '80px' }}>
        {!standalone && <h2>Sync Licensing FAQ</h2>}
        <div className="faq-list" style={{ marginTop: standalone ? '40px' : '0' }}>
          {[
            { q: "How does the SyncMavens compensation model work?", a: "SyncMavens operates on a simple, transparent placement-led model. When we pitch and successfully license your track, we charge a flat 10% administration/facilitation fee on the sync buyout. The remaining 90% is routed directly through your specified split cascade percentages." },
            { q: "Do you offer up-front catalog sign advances?", a: "No. Unlike traditional publishers who lock up your catalogue with advances and take ownership of your publishing rights, we do not offer catalog sign advances. You retain 100% of your copyright. Payouts are made purely upon placement deals, keeping you in full control of your IP." },
            { q: "Is SyncMavens accessible to independent artists?", a: "Yes. Traditional sync pitching is gated behind agents and labels. SyncMavens is built to be easily accessible to any independent creator. Once you upload your catalog, our AI system indexes your metadata against supervisor briefs immediately." },
            { q: "What audio assets do I need to prepare?", a: "Supervisors require professional masters (WAV or AIFF, 16/24-bit, 44.1/48kHz). Having instrumental versions (no vocals) and split stem tracks significantly increases your chances of getting placed." }
          ].map((faq, idx) => (
            <div key={idx} className="faq-item" onClick={() => toggleFaq(idx)} style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '3px' }}>
              <div className="faq-question" style={{ color: openFaq === idx ? '#00f2fe' : '#fff' }}>
                <span>{faq.q}</span>
                <span>{openFaq === idx ? '-' : '+'}</span>
              </div>
              {openFaq === idx && <div className="faq-answer" style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '10px' }}>{faq.a}</div>}
            </div>
          ))}
        </div>
        <SignUpCTA />
      </section>
    </div>
  );
}

function PublishingView({ standalone }) {
  return (
    <div className={standalone ? "standalone-page-wrapper" : ""}>
      {standalone && (
        <div className="page-header-banner" style={{ backgroundImage: `url(${splitsCascadeHero})` }}>
          <div className="page-header-overlay" />
          <div className="page-header-content">
            <h1 className="page-header-title">Music Publishing Administration</h1>
            <div className="page-header-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">Music Publishing</span>
            </div>
          </div>
        </div>
      )}
      
      <section className="landing-stepper" style={{ paddingTop: standalone ? '60px' : '80px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge-promo" style={{ display: 'inline-block', marginBottom: '12px' }}>GLOBAL ROYALTIES</span>
          <h2>Collect Every Royalty Cent Worldwide</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>
            When your music is streamed, broadcast, or performed, you generate royalties. SyncMavens Publishing handles the complex administration so you can focus on creating.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '56px' }}>
          {/* Card 1: PRO Registration */}
          <div className="step-card" style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.15)', borderRadius: '4px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f2fe' }}>
                <RiGlobalLine size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>PRO Work Registration</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '0' }}>
              We sync work metadata directly with major Performing Rights Organizations (PROs) including ASCAP, BMI, PRS, and GEMA. Your catalog is registered accurately with correct ISRC and ISWC identifiers across all global societies.
            </p>
          </div>

          {/* Card 2: Mechanical Royalties */}
          <div className="step-card" style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.15)', borderRadius: '4px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                <RiFileListLine size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>Mechanical Collections</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '0' }}>
              Every stream on Spotify, Apple Music, and Amazon Music generates mechanical royalties. Our publishing arm collects these from DSPs and mechanical licensing collectives globally, ensuring they cascade right to your account.
            </p>
          </div>
        </div>

        {/* Administration Flow Section */}
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', padding: '40px 32px', marginBottom: '56px' }}>
          <h3 style={{ textAlign: 'center', fontSize: '22px', marginBottom: '32px', color: '#fff' }}>The Publishing Administration Flow</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00f2fe', marginBottom: '12px' }}>Step 1</div>
              <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '8px' }}>Metadata Intake</h4>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>Upload your works and splits ledger. We generate cryptographic hashes for verification.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '12px' }}>Step 2</div>
              <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '8px' }}>Society Registration</h4>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>We claim publisher rights and match shares with local societies worldwide.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981', marginBottom: '12px' }}>Step 3</div>
              <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '8px' }}>Quarterly Cascades</h4>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>Societies remit collected sums to our pool, waterfalling straight to your wallets.</p>
            </div>
          </div>
        </div>

        {/* compensation terms section */}
        <div className="dashboard-card" style={{ padding: '32px', background: 'radial-gradient(ellipse at top left, rgba(0, 242, 254, 0.05) 0%, transparent 60%)', border: '1px solid rgba(0, 242, 254, 0.2)', borderRadius: '6px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', color: '#00f2fe', marginBottom: '12px' }}>Composer-First Royalty Splits</h3>
          <p style={{ maxWidth: '650px', margin: '0 auto 20px', fontSize: '14px', color: '#e2e8f0', lineHeight: '1.6' }}>
            We believe in complete transparency. Typically, the creator retains <strong>100% of their Composer Share</strong> (which is 50% of the total publishing pie), and we manage the <strong>Publisher Share (50%)</strong> for a industry-low <strong>15% administration fee</strong>.
          </p>
          <div style={{ display: 'inline-flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 24px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Composer Share</span>
              <strong style={{ fontSize: '20px', color: '#10b981' }}>100% Retained by You</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 24px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Publisher Share</span>
              <strong style={{ fontSize: '20px', color: '#fff' }}>85% Yours / 15% Admin</strong>
            </div>
          </div>
        </div>
        <SignUpCTA />
      </section>
    </div>
  );
}

function YoutubeIdView({ standalone }) {
  return (
    <div className={standalone ? "standalone-page-wrapper" : ""}>
      {standalone && (
        <div className="page-header-banner" style={{ backgroundImage: `url(${creatorCatalogHero})` }}>
          <div className="page-header-overlay" />
          <div className="page-header-content">
            <h1 className="page-header-title">YouTube Content ID & UGC Monetization</h1>
            <div className="page-header-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">YouTube Content ID</span>
            </div>
          </div>
        </div>
      )}
      
      <section className="landing-stepper" style={{ paddingTop: standalone ? '60px' : '80px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge-promo" style={{ display: 'inline-block', marginBottom: '12px' }}>UGC MONETIZATION</span>
          <h2>Claim Your Audio Across the Web</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>
            Millions of videos are uploaded daily containing copyrighted audio. Our fingerprint scanner monitors user-generated content (UGC) and monetizes views on your behalf automatically.
          </p>
        </div>

        {/* Fingerprinting Flow */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '56px' }}>
          <div className="step-card" style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.15)', borderRadius: '4px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f2fe' }}>
                <RiUpload2Line size={20} />
              </div>
              <h4 style={{ margin: 0, fontSize: '15px', color: '#fff' }}>Audio Ingestion & Hashing</h4>
            </div>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
              Upload your clean stereo tracks. We generate specialized acoustic fingerprints that map the unique spectral properties of your musical compositions.
            </p>
          </div>

          <div className="step-card" style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.15)', borderRadius: '4px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                <RiSearchLine size={20} />
              </div>
              <h4 style={{ margin: 0, fontSize: '15px', color: '#fff' }}>Platform Match Scanning</h4>
            </div>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
              Reference fingerprints are sent directly to YouTube's Content ID database, Meta's Rights Manager, and TikTok's Sound Library to scan for matches.
            </p>
          </div>

          <div className="step-card" style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '4px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <RiExchangeDollarLine size={20} />
              </div>
              <h4 style={{ margin: 0, fontSize: '15px', color: '#fff' }}>Ad Revenue Claims</h4>
            </div>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
              Whenever a match is detected, ads are run on the user video. The accumulated advertising revenue is routed back to our ledger and deposited.
            </p>
          </div>
        </div>

        {/* Matches targets */}
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', padding: '40px 32px', marginBottom: '56px' }}>
          <h3 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '32px', color: '#fff' }}>Scan Matching Targets</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-panel)', padding: '24px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h5 style={{ fontSize: '16px', color: '#fff', margin: '0 0 8px' }}>YouTube</h5>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Monetize user-generated videos, covers, vlogs, and shorts containing your music.</p>
            </div>
            <div style={{ background: 'var(--bg-panel)', padding: '24px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h5 style={{ fontSize: '16px', color: '#fff', margin: '0 0 8px' }}>TikTok</h5>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Claim ad shares from sound uses in user videos, influencer reels, and trend loops.</p>
            </div>
            <div style={{ background: 'var(--bg-panel)', padding: '24px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h5 style={{ fontSize: '16px', color: '#fff', margin: '0 0 8px' }}>Meta Networks</h5>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Collect royalties from Instagram Reels, Facebook Stories, and user clips.</p>
            </div>
          </div>
        </div>

        {/* splits pricing */}
        <div className="dashboard-card" style={{ padding: '32px', background: 'radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.05) 0%, transparent 60%)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '6px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', color: '#8b5cf6', marginBottom: '12px' }}>UGC Revenue Splits</h3>
          <p style={{ maxWidth: '650px', margin: '0 auto 20px', fontSize: '14px', color: '#e2e8f0', lineHeight: '1.6' }}>
            We monitor your songs across platforms and collect revenues globally. The distribution is simple: <strong>90% goes directly to you</strong>, and SyncMavens retains a flat <strong>10% administration fee</strong> to maintain the scanning engine.
          </p>
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.03)', padding: '16px 32px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', gap: '40px', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Your Payout</span>
              <strong style={{ fontSize: '24px', color: '#00f2fe' }}>90% Split</strong>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
            <div>
              <span style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Administration</span>
              <strong style={{ fontSize: '24px', color: '#94a3b8' }}>10% Fee</strong>
            </div>
          </div>
        </div>
        <SignUpCTA />
      </section>
    </div>
  );
}

// ==========================================
// Sync-Ready Catalog Sub-page Component
// ==========================================

const SYNC_READY_SONGS = [
  { id: 1, title: "Midnight Sun", artist: "Hologram Club", genre: "Synthwave", mood: "Action / Retro", bpm: 120, cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "Resonance", artist: "Aether Echo", genre: "Neo-Classical", mood: "Melancholy", bpm: 78, cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&q=80", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "Summer Drift", artist: "Stellar Wind", genre: "Indie Pop", mood: "Uplifting", bpm: 110, cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: 4, title: "Cyber Chaser", artist: "Neon Bandit", genre: "Phonk", mood: "Tension", bpm: 140, cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { id: 5, title: "Epic Horizon", artist: "Giga Sound", genre: "Cinematic", mood: "Epic / Cinematic", bpm: 90, cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { id: 6, title: "Night Glow", artist: "Retro Shift", genre: "Synthwave", mood: "Action / Retro", bpm: 115, cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&q=80", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  { id: 7, title: "Golden Hour", artist: "Sunkissed", genre: "Indie Pop", mood: "Uplifting", bpm: 105, cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
  { id: 8, title: "Desert Mirage", artist: "Nomad Sound", genre: "Neo-Classical", mood: "Melancholy", bpm: 85, cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&q=80", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  { id: 9, title: "City Lights", artist: "Urban Beat", genre: "Synthwave", mood: "Action / Retro", bpm: 125, cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
  { id: 10, title: "Echoes of You", artist: "Voice of Soul", genre: "Indie Pop", mood: "Melancholy", bpm: 95, cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
  { id: 11, title: "Starlight Dance", artist: "Galactic Crew", genre: "Synthwave", mood: "Uplifting", bpm: 130, cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&q=80", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3" },
  { id: 12, title: "Ocean Breeze", artist: "Coastal Wave", genre: "Indie Pop", mood: "Uplifting", bpm: 98, cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" },
  { id: 13, title: "Tension Rise", artist: "Dark Matter", genre: "Phonk", mood: "Tension", bpm: 145, cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3" },
  { id: 14, title: "Lost in Time", artist: "Chronos", genre: "Cinematic", mood: "Melancholy", bpm: 72, cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3" },
  { id: 15, title: "Storm Warning", artist: "Thunder Dome", genre: "Phonk", mood: "Tension", bpm: 150, cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&q=80", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" }
];

function SyncReadyView({ standalone }) {
  const [playingSongId, setPlayingSongId] = useState(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isSupervisor, setIsSupervisor] = useState(() => localStorage.getItem('syncmavens_supervisor_unlocked') === 'true');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const audioRef = useRef(null);

  const handlePlayToggle = (song) => {
    if (!audioRef.current) return;

    if (playingSongId === song.id) {
      audioRef.current.pause();
      setPlayingSongId(null);
    } else {
      audioRef.current.src = song.url;
      audioRef.current.currentTime = 0;
      setPlaybackTime(0);
      setPlayingSongId(song.id);
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    setPlaybackTime(cur);

    if (cur >= 45) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayingSongId(null);
      setPlaybackTime(0);
      alert("45-second preview limit reached. Verified music supervisors can authenticate to unlock full audio tracks and master WAV stems.");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'supervisor@tunemavens.com' && password === 'password') {
      localStorage.setItem('syncmavens_supervisor_unlocked', 'true');
      setIsSupervisor(true);
      setShowLoginModal(false);
      setLoginError('');
      setEmail('');
      setPassword('');
      alert("Welcome back, Supervisor Pro! Credentials verified via TuneMavens Identity Protocol. Master downloads unlocked.");
    } else {
      setLoginError("Invalid supervisor credentials. Use supervisor@tunemavens.com / password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('syncmavens_supervisor_unlocked');
    setIsSupervisor(false);
    alert("Supervisor session closed. Master vaults locked.");
  };

  const handleDownload = (song) => {
    if (!isSupervisor) {
      setShowLoginModal(true);
      return;
    }
    alert(`Downloading Master WAV file for: "${song.title}" by ${song.artist}\nTarget: 24-bit / 48kHz Broadcast Standard`);
  };

  const filteredSongs = SYNC_READY_SONGS.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.mood.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSongs.length / pageSize) || 1;
  const paginatedSongs = filteredSongs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className={standalone ? "standalone-page-wrapper" : ""}>
      <div style={{ opacity: showLoginModal ? 0.08 : 1, transition: 'opacity 0.2s ease-in-out', pointerEvents: showLoginModal ? 'none' : 'auto' }}>
        {standalone && (
          <div className="page-header-banner" style={{ backgroundImage: `url(${syncPlacementHero})` }}>
            <div className="page-header-overlay" />
            <div className="page-header-content">
              <h1 className="page-header-title">Sync-Ready Catalog</h1>
              <div className="page-header-breadcrumb">
                <Link to="/" className="breadcrumb-link">Home</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-active">Sync-Ready Catalog</span>
              </div>
            </div>
          </div>
        )}

        <audio 
          ref={audioRef} 
          onTimeUpdate={handleTimeUpdate} 
        />

        <section className="landing-stepper" style={{ paddingTop: standalone ? '60px' : '80px', paddingBottom: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px', textAlign: 'left' }}>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ textAlign: 'left', margin: 0 }}>Browse Sync-Ready Tracks</h2>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px', textAlign: 'left' }}>
                Index of pre-cleared, high-resolution musical works ready for licensing synchronization.
              </p>
            </div>
            <div>
              {isSupervisor ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#10b981', padding: '6px 12px', borderRadius: '3px', fontWeight: 'bold' }}>
                    ✓ VERIFIED SUPERVISOR SESSION ACTIVE
                  </span>
                  <button onClick={handleLogout} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Lock Vault
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowLoginModal(true)} className="btn-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RiUserFill size={16} /> Supervisor Sign In
                </button>
              )}
            </div>
          </div>

          {/* Search field */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '14px', pointerEvents: 'none' }}>🔍</span>
              <input 
                type="text" 
                placeholder="Search by title, artist, genre or mood..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 38px', background: '#0b0f1e', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '3px', color: '#fff', fontSize: '13px', outline: 'none' }}
              />
            </div>
          </div>

          {/* Songs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '24px' }}>
            {paginatedSongs.map((song) => {
              const isCurrent = playingSongId === song.id;
              const progressPct = isCurrent ? (playbackTime / 45) * 100 : 0;
              return (
                <div key={song.id} className="step-card" style={{ padding: '24px', background: 'var(--bg-panel)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '3px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'stretch', textAlign: 'left' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <img src={song.cover} alt={song.title} style={{ width: '80px', height: '80px', borderRadius: '3px', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.05)' }} />
                    <div style={{ overflow: 'hidden' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{song.title}</h4>
                      <span style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>{song.artist}</span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                        <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '2px', color: '#cbd5e1' }}>{song.genre}</span>
                        <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '2px', color: '#cbd5e1' }}>{song.mood}</span>
                        <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '2px', color: '#00f2fe' }}>{song.bpm} BPM</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar container */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                      <span>{isCurrent ? `Previewing: ${Math.floor(playbackTime)}s` : 'Audio Clip Preview'}</span>
                      <span>Limit: 45s</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{ width: `${progressPct}%`, height: '100%', background: '#00f2fe', transition: 'width 0.1s linear' }}></div>
                    </div>
                  </div>

                  {/* Card footer controls */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <button 
                      onClick={() => handlePlayToggle(song)} 
                      className="btn-primary" 
                      style={{ flex: 1, padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: isCurrent ? '#ef4444' : 'var(--accent-cyan)', border: 'none', color: '#000', fontWeight: 'bold', fontSize: '12.5px' }}
                    >
                      {isCurrent ? (
                        <>
                          <RiPauseFill size={16} /> Pause Preview
                        </>
                      ) : (
                        <>
                          <RiPlayFill size={16} /> Play Preview (45s)
                        </>
                      )}
                    </button>

                    <button 
                      onClick={() => handleDownload(song)} 
                      className="btn-secondary" 
                      style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12.5px', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <RiDownloadLine size={16} />
                      <span>Download WAV</span>
                      {!isSupervisor && (
                        <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: '#fff', fontSize: '8px', padding: '1px 4px', borderRadius: '10px', fontWeight: 'bold' }}>
                          LOCKED
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1}
                className="btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '12px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages}
                className="btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '12px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Supervisor Credentials Modal */}
      {showLoginModal && (
        <div 
          onClick={() => setShowLoginModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(5, 4, 8, 0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="dashboard-card" 
            style={{ maxWidth: '400px', width: '100%', padding: '32px', background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}
          >
            <button 
              onClick={() => setShowLoginModal(false)} 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <RiCloseFill size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8b5cf6' }}>
              <RiLockLine size={24} />
              <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>Supervisor Authentication</h3>
            </div>
            
            <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
              Master WAV downloads and licensing cue sheets are restricted to authorized music supervisors. Authenticate using your TuneMavens account.
            </p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="supervisor@tunemavens.com" 
                  style={{ width: '100%', padding: '8px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }} 
                  required 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  style={{ width: '100%', padding: '8px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }} 
                  required 
                />
              </div>

              {loginError && (
                <div style={{ fontSize: '11px', color: '#ef4444', background: 'rgba(239,68,68,0.05)', padding: '8px', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '3px' }}>
                  {loginError}
                </div>
              )}

              <div style={{ fontSize: '11px', color: '#eab308', background: 'rgba(234,179,8,0.03)', padding: '8px', border: '1px solid rgba(234,179,8,0.1)', borderRadius: '3px', lineHeight: '1.4' }}>
                <strong>Sandbox Credentials:</strong><br />
                Email: <code>supervisor@tunemavens.com</code><br />
                Password: <code>password</code>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', padding: '10px', fontSize: '13px', background: 'var(--accent-cyan)', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '3px', marginTop: '6px' }}
              >
                Authenticate Supervisor
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// Login / Registration Authentication Views
// ==========================================

function LoginView({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('creator');
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      onLogin({
        email: 'googleuser@tunemavens.com',
        name: 'Aisha Okoro',
        role: role,
      });
      navigate('/dashboard');
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const stubName = (email.split('@')[0] || 'Sandbox User').replace(/^\w/, c => c.toUpperCase());
    onLogin({
      email,
      name: stubName,
      role
    });
    navigate('/dashboard');
  };

  return (
    <div className="standalone-page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)', padding: '40px 20px' }}>
      <div className="dashboard-card" style={{ maxWidth: '400px', width: '100%', padding: '32px', background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <img src={smLogo} alt="SyncMavens Logo" style={{ height: '32px', width: 'auto' }} />
        </div>
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '19px', fontWeight: '800', margin: '0 0 6px', color: '#fff' }}>Log In to SyncMavens</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Access your unified creator or supervisor sync profile</p>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          disabled={googleLoading}
          style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px' }}
        >
          {googleLoading ? "Connecting to Google..." : "Continue with Google"}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ fontSize: '11px', color: '#64748b' }}>or email (auto-sandbox)</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              style={{ width: '100%', padding: '8px 12px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }} 
              required 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '8px 12px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }} 
              required 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Your Ecosystem Role</label>
            <select 
              value={role} 
              onChange={e => setRole(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }}
            >
              <option value="creator">Creator (seeking sync deals)</option>
              <option value="supervisor">Music Supervisor (film/tv/ads)</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', padding: '10px', fontSize: '13px', background: 'var(--accent-cyan)', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '3px', marginTop: '8px' }}
          >
            Log In
          </button>
        </form>

        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '20px', textAlign: 'center', margin: '20px 0 0' }}>
          Don't have an account? <Link to="/register" style={{ color: '#00f2fe', textDecoration: 'none', fontWeight: '600' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

function RegisterView({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paramRole = searchParams.get('role');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(paramRole === 'supervisor' ? 'supervisor' : 'creator');

  useEffect(() => {
    if (paramRole === 'supervisor' || paramRole === 'creator') {
      setRole(paramRole);
    }
  }, [paramRole]);


  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({
      email,
      name: name || (email.split('@')[0] || 'Sandbox User').replace(/^\w/, c => c.toUpperCase()),
      role
    });
    navigate('/dashboard');
  };

  return (
    <div className="standalone-page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)', padding: '40px 20px' }}>
      <div className="dashboard-card" style={{ maxWidth: '400px', width: '100%', padding: '32px', background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <img src={smLogo} alt="SyncMavens Logo" style={{ height: '32px', width: 'auto' }} />
        </div>
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '19px', fontWeight: '800', margin: '0 0 6px', color: '#fff' }}>Start Free Sync Profile</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Register and match your audio with dynamic briefs</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Full Name</label>
            <input 
              type="text" 
              placeholder="Aisha Okoro" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              style={{ width: '100%', padding: '8px 12px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }} 
              required 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              style={{ width: '100%', padding: '8px 12px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }} 
              required 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '8px 12px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }} 
              required 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Choose Account Role</label>
            <select 
              value={role} 
              onChange={e => setRole(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', background: '#050409', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '13px' }}
            >
              <option value="creator">Creator (seeking sync placements)</option>
              <option value="supervisor">Music Supervisor (film/tv/ads)</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', padding: '10px', fontSize: '13px', background: 'var(--accent-cyan)', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '3px', marginTop: '8px' }}
          >
            Create Account
          </button>
        </form>

        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '20px', textAlign: 'center', margin: '20px 0 0' }}>
          Already have an account? <Link to="/login" style={{ color: '#00f2fe', textDecoration: 'none', fontWeight: '600' }}>Log In here</Link>
        </p>
      </div>
    </div>
  );
}

// ==========================================
// Onboarding Checklist Component
// ==========================================

function OnboardingChecklist({ userRole, userName, userEmail, myCatalog, myPitches, briefs, pitchesReceived, isSupervisor, setActiveTab }) {
  const [dismissed, setDismissed] = React.useState(() => sessionStorage.getItem('syncmavens_onboarding_dismissed') === 'true');
  const [collapsed, setCollapsed] = React.useState(false);
  const [showAyo, setShowAyo] = React.useState(false);
  const [ayoRecommendation, setAyoRecommendation] = React.useState('');

  if (dismissed) return null;

  const profileDone = !!(userName && userEmail);
  
  let steps = [];
  if (userRole === 'supervisor') {
    const briefsCreated = briefs.length > 3; 
    const pitchesReviewed = pitchesReceived.some(p => p.status !== 'Pending');
    const catalogAuditioned = isSupervisor; 

    steps = [
      { id: 'profile', label: 'Complete supervisor profile', done: profileDone, tab: 'profile', cta: 'Complete' },
      { id: 'brief', label: 'Create your first sync brief', done: briefsCreated, tab: 'briefs_mgmt', cta: 'Create' },
      { id: 'pitches', label: 'Review incoming creator pitches', done: pitchesReviewed, tab: 'pitches_received', cta: 'Review' },
      { id: 'vault', label: 'Audition sync-ready catalog', done: catalogAuditioned, tab: 'sync_ready_vault', cta: 'Audition' }
    ];
  } else {
    const catalogDone = myCatalog.length > 0;
    const pitchesDone = myPitches.length > 0;
    const publishingDone = true; 

    steps = [
      { id: 'profile', label: 'Complete creator profile', done: profileDone, tab: 'profile', cta: 'Complete' },
      { id: 'catalog', label: 'Ingest your first track', done: catalogDone, tab: 'catalog', cta: 'Ingest' },
      { id: 'pitch', label: 'Submit your first sync pitch', done: pitchesDone, tab: 'briefs', cta: 'Pitch' },
      { id: 'publishing', label: 'Audit deal ledger & splits', done: publishingDone, tab: 'ledger', cta: 'Audit' }
    ];
  }

  const completed = steps.filter(s => s.done).length;
  const percent = Math.round((completed / steps.length) * 100);
  const allDone = completed === steps.length;
  if (allDone) return null;

  const nextStep = steps.find(s => !s.done);

  const handleAskAyo = () => {
    if (userRole === 'supervisor') {
      setAyoRecommendation("Ayo AI Path optimization:\nWe suggest starting with the 'Create your first sync brief' step. Supervisors using briefs get 2.4x higher pitch accuracy compared to manual vault searching. I will auto-set target splits to 30/25/45 as defined in partner protocols.");
    } else {
      setAyoRecommendation("Ayo AI Path optimization:\nWe suggest starting with the 'Ingest your first track' step. Once uploaded, I will automatically index your metadata against the 4 active TV/Film commercial briefs. The net net cascade is configured to auto-pay.");
    }
    setShowAyo(true);
  };

  return (
    <div className="onboarding-stripe">
      <div className="onboarding-stripe-header">
        <div>
          <div className="onboarding-stripe-eyebrow">
            <span className="onboarding-stripe-pulse" />
            <span>Welcome aboard · {completed}/{steps.length} steps complete · {percent}%</span>
          </div>
          <h3 className="onboarding-stripe-title">
            {nextStep ? `Next: ${nextStep.label.toLowerCase()}` : 'You’re all set'}
          </h3>
        </div>
        <div className="onboarding-stripe-controls">
          <button
            type="button"
            className="onboarding-reeval-btn"
            onClick={handleAskAyo}
            style={{ background: '#1a1300', color: '#F4D35E', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Consult Ayo AI</span>
          </button>
          <button
            type="button"
            className="onboarding-collapse-btn"
            onClick={() => setCollapsed(c => !c)}
          >
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
          <button
            type="button"
            className="onboarding-dismiss-btn"
            onClick={() => {
              sessionStorage.setItem('syncmavens_onboarding_dismissed', 'true');
              setDismissed(true);
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          <div className="onboarding-progress-track">
            <div className="onboarding-progress-bar" style={{ width: `${percent}%` }} />
          </div>

          <ul className="onboarding-steps">
            {steps.map(s => (
              <li key={s.id} className={`onboarding-step ${s.done ? 'done' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                  {s.done ? (
                    <span className="onboarding-step-status">✓</span>
                  ) : (
                    <span className="onboarding-step-bullet" />
                  )}
                  <span className="onboarding-step-label">{s.label}</span>
                </div>
                {!s.done && (
                  <button 
                    onClick={() => setActiveTab(s.tab)} 
                    className="onboarding-step-cta"
                  >
                    {s.cta}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {showAyo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px' }}>
          <div style={{ background: '#1a1300', color: '#F4D35E', border: '2px solid #C79E2D', borderRadius: '6px', maxWidth: '450px', width: '100%', padding: '24px', position: 'relative' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Ayo (AI) Assistant Guidance</span>
            </h3>
            <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#e2e8f0', whiteSpace: 'pre-line' }}>{ayoRecommendation}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={() => {
                  const targetTab = steps.find(s => !s.done)?.tab;
                  if (targetTab) setActiveTab(targetTab);
                  setShowAyo(false);
                }} 
                className="btn-primary" 
                style={{ padding: '8px 16px', background: '#F4D35E', color: '#1a1300', border: 'none', fontWeight: 'bold', fontSize: '12px' }}
              >
                Apply Ayo Suggestion
              </button>
              <button 
                onClick={() => setShowAyo(false)} 
                className="btn-secondary" 
                style={{ padding: '8px 16px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', fontSize: '12px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// Digital Release Ingestion View
// ==========================================
function DistributionView({ standalone }) {
  return (
    <div className={standalone ? "standalone-page-wrapper" : ""}>
      {standalone && (
        <div className="page-header-banner" style={{ backgroundImage: `url(${syncPlacementHero})` }}>
          <div className="page-header-overlay" />
          <div className="page-header-content">
            <h1 className="page-header-title">Digital Release Ingestion</h1>
            <div className="page-header-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">Release Ingestion</span>
            </div>
          </div>
        </div>
      )}
      
      <section className="landing-stepper" style={{ paddingTop: standalone ? '60px' : '80px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge-promo" style={{ display: 'inline-block', marginBottom: '12px' }}>RELEASE INGESTION</span>
          <h2>Distribute Your Music Worldwide</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>
            Our smart ingestion pipeline prepares your music for release across all major DSPs. Upload your lossless files, configure split sheets, and schedule release dates with ease.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '56px' }}>
          <div className="step-card" style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '32px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#fff' }}>1. Metadata & Audio Intake</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '0' }}>
              Upload high-quality WAV or AIFF files. Add track details, composer credits, genres, and lyrics. Our engine automatically checks audio sample rates and formats to match strict store criteria.
            </p>
          </div>

          <div className="step-card" style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '32px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#fff' }}>2. Smart Split Sheets</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '0' }}>
              Define percentage shares for songwriters, producers, and publishers right inside the pipeline. Earnings are split automatically at the source, preventing royalty disputes.
            </p>
          </div>
        </div>

        <SignUpCTA />
      </section>
    </div>
  );
}

// ==========================================
// Global DSP Distribution View
// ==========================================
function GlobalDspView({ standalone }) {
  const dspStores = [
    { name: "Spotify", desc: "Push releases to Spotify and gain instant access to Spotify for Artists verification & play pitching.", tag: "Verified Pitching", icon: "🟢" },
    { name: "Apple Music", desc: "Deliver lossless master tracks and Dolby Atmos spatial mixes to Apple Music stream subscribers.", tag: "Spatial Lossless", icon: "" },
    { name: "YouTube Music", desc: "Auto-generate official Art Tracks, sync with your Official Artist Channel, and claim content royalties.", tag: "UGC Claims Ready", icon: "🔴" },
    { name: "Amazon Music", desc: "Submit tracks for curated Amazon editorial playlists and Alexa voice request optimization.", tag: "Alexa Voice Ready", icon: "🔵" },
    { name: "TikTok & ByteDance", desc: "Inject tracks into the official TikTok sound library for creators to use in viral shorts worldwide.", tag: "Social Sync", icon: "🎵" },
    { name: "Tidal", desc: "Distribute premium High-Fidelity streams to audiophiles, keeping higher direct payout waterfalls.", tag: "Hi-Res Masters", icon: "◼" },
    { name: "Deezer", desc: "Deliver to Deezer's global catalog, covering Europe and Latin American streaming territories.", tag: "European Reach", icon: "🔶" },
    { name: "Tencent & NetEase", desc: "Access major Asian markets including QQ Music, Kugou, Kuwo, and NetEase Cloud Music channels.", tag: "Asian Markets", icon: "🌐" },
    { name: "Boomplay & Audiomack", desc: "Establish absolute presence in fast-growing African regions through Boomplay, Audiomack, and MTN music.", tag: "African Coverage", icon: "🔥" },
  ];

  const features = [
    "Keep 100% of your royalties",
    "Unlimited releases to 150+ stores",
    "Free SmartLinks & Pre-saves included",
    "Daily streaming analytics & geographic map",
    "Direct waterfall splits registration",
    "24/7 dedicated support team"
  ];

  return (
    <div className={standalone ? "standalone-page-wrapper" : ""}>
      {standalone && (
        <div className="page-header-banner" style={{ backgroundImage: `url(${creatorCatalogHero})` }}>
          <div className="page-header-overlay" />
          <div className="page-header-content">
            <h1 className="page-header-title">Global DSP Distribution</h1>
            <div className="page-header-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">DSP Distribution</span>
            </div>
          </div>
        </div>
      )}
      
      <section className="landing-stepper" style={{ paddingTop: standalone ? '60px' : '80px', paddingBottom: '96px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '56px' }}>
          <span className="badge-promo" style={{ display: 'inline-block', marginBottom: '12px' }}>DSP DISTRIBUTION</span>
          <h2>Deliver Audio to 150+ Global Stores</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>
            We push your catalog to Spotify, Apple Music, TikTok, Amazon Music, Tencent, and NetEase. Get absolute global reach and keep 100% of your earnings.
          </p>
        </div>

        {/* DSP Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '64px', textAlign: 'left' }}>
          {dspStores.map((store, i) => (
            <div 
              key={i} 
              className="step-card" 
              style={{ 
                background: 'var(--bg-panel)', 
                padding: '24px', 
                borderRadius: '4px', 
                border: '1px solid rgba(255,255,255,0.05)', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '24px' }}>{store.icon}</span>
                <span style={{ fontSize: '10px', background: 'rgba(0,242,254,0.08)', color: '#00f2fe', padding: '2px 6px', borderRadius: '2px', fontWeight: 'bold' }}>
                  {store.tag}
                </span>
              </div>
              <h4 style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: 'bold' }}>{store.name}</h4>
              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>{store.desc}</p>
            </div>
          ))}
        </div>

        {/* Feature Highlights Checklist */}
        <div style={{ background: '#0b0f1e', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '40px', maxWidth: '800px', margin: '0 auto 64px', textAlign: 'left' }}>
          <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '24px', textAlign: 'center' }}>Why Distribute via TuneMavens Ecosystem?</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <SignUpCTA />
      </section>
    </div>
  );
}

// ==========================================
// SmartLinks Generator View
// ==========================================
function SmartLinksView({ standalone }) {
  return (
    <div className={standalone ? "standalone-page-wrapper" : ""}>
      {standalone && (
        <div className="page-header-banner" style={{ backgroundImage: `url(${splitsCascadeHero})` }}>
          <div className="page-header-overlay" />
          <div className="page-header-content">
            <h1 className="page-header-title">SmartLinks Generator</h1>
            <div className="page-header-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">SmartLinks</span>
            </div>
          </div>
        </div>
      )}
      
      <section className="landing-stepper" style={{ paddingTop: standalone ? '60px' : '80px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '48px' }}>
          <h2>Create Dynamic Music Landing Pages</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>
            Generate high-conversion smartlinks and pre-save campaigns for Spotify, Apple Music, and YouTube. Collect fan contacts, monitor click geography, and track marketing attribution data.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '56px' }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '4px' }}>
            <h4 style={{ color: '#fff', fontSize: '15px', margin: '0 0 10px 0' }}>Pre-Save Campaigns</h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>Grow your release-day Spotify streams. Allow fans to automatically add upcoming releases to their library.</p>
          </div>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '4px' }}>
            <h4 style={{ color: '#fff', fontSize: '15px', margin: '0 0 10px 0' }}>Dynamic Routing</h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>Automatically route users based on device (iOS directs to Apple Music, Android to Spotify or YouTube Music).</p>
          </div>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '4px' }}>
            <h4 style={{ color: '#fff', fontSize: '15px', margin: '0 0 10px 0' }}>Pixel Tracking</h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>Embed Meta, Google, and TikTok tracking pixels to remarket to engaged listeners and build custom audiences.</p>
          </div>
        </div>

        <SignUpCTA />
      </section>
    </div>
  );
}

// ==========================================
// Playlist Submissions View
// ==========================================
function PlaylistSubmissionsView({ standalone }) {
  return (
    <div className={standalone ? "standalone-page-wrapper" : ""}>
      {standalone && (
        <div className="page-header-banner" style={{ backgroundImage: `url(${syncPlacementHero})` }}>
          <div className="page-header-overlay" />
          <div className="page-header-content">
            <h1 className="page-header-title">Playlist Submissions</h1>
            <div className="page-header-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">Playlist Submissions</span>
            </div>
          </div>
        </div>
      )}
      
      <section className="landing-stepper" style={{ paddingTop: standalone ? '60px' : '80px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge-promo" style={{ display: 'inline-block', marginBottom: '12px' }}>PITCHING PLATFORM</span>
          <h2>Direct Pitching to Active Curators</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>
            Submit your music directly to validated Spotify playlist curators, independent music directors, and retail store radio stations. Zero middlemen, direct responses.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '56px' }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '4px' }}>
            <h4 style={{ color: '#fff', fontSize: '15px', margin: '0 0 10px 0' }}>Curator Feedback Loop</h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>Every submission guarantees an review. Receive constructive professional feedback or playlist additions.</p>
          </div>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '4px' }}>
            <h4 style={{ color: '#fff', fontSize: '15px', margin: '0 0 10px 0' }}>Curated Retail Radio</h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>Submit catalog files to in-store radio networks playing in major supermarkets, gyms, and hotel lobbies.</p>
          </div>
        </div>

        <SignUpCTA />
      </section>
    </div>
  );
}

// ==========================================
// Press Release Service View
// ==========================================
function PressReleaseView({ standalone }) {
  return (
    <div className={standalone ? "standalone-page-wrapper" : ""}>
      {standalone && (
        <div className="page-header-banner" style={{ backgroundImage: `url(${creatorCatalogHero})` }}>
          <div className="page-header-overlay" />
          <div className="page-header-content">
            <h1 className="page-header-title">Press Release Service</h1>
            <div className="page-header-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">Press Releases</span>
            </div>
          </div>
        </div>
      )}
      
      <section className="landing-stepper" style={{ paddingTop: standalone ? '60px' : '80px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge-promo" style={{ display: 'inline-block', marginBottom: '12px' }}>MEDIA OUTREACH</span>
          <h2>Automated PR Distribution</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>
            Draft clean, media-rich electronic press kits (EPKs) and send announcements to music journalists, bloggers, and radio coordinators matching your genre tags.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '56px' }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '4px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#fff' }}>Press Kits Generator</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>
              Assemble biographies, high-res photos, streaming links, and embedding widgets. Exports to a sleek responsive web link ready to share.
            </p>
          </div>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '4px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#fff' }}>Targeted Distribution</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>
              Our scanner aggregates contact lists of certified writers from Pitchfork, Billboard, Fader, and independent music publications.
            </p>
          </div>
        </div>

        <SignUpCTA />
      </section>
    </div>
  );
}

// ==========================================
// Dashboard Apps View
// ==========================================
function DashboardAppsView({ standalone }) {
  const [activeApp, setActiveApp] = useState(null); // null, 'tracker', 'hosting', 'ledger', 'pos'

  const apps = [
    { id: 'tracker', name: 'Distribution Tracker', icon: RiCompass3Line, desc: 'Monitor ingest status and scheduled releases across Spotify, Apple, and Amazon Music.' },
    { id: 'hosting', name: 'Hosting Manager', icon: RiGlobalLine, desc: 'Register custom domain names, configure DNS zone settings, and deploy modular web containers.' },
    { id: 'ledger', name: 'Split Cascade Ledger', icon: RiExchangeDollarLine, desc: 'Configure collaborators splits, load bulk statement spreadsheets, and automate payout accounting.' },
    { id: 'pos', name: 'M-Pesa POS Terminal', icon: RiSparklingLine, desc: 'Collect on-site merchant card, cardless, and mobile money payments during venues and tours.' },
  ];

  if (activeApp === 'pos') {
    return (
      <div className={standalone ? "standalone-page-wrapper" : ""} style={{ paddingBottom: '80px', marginTop: '60px' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <button onClick={() => setActiveApp(null)} className="btn-secondary" style={{ marginBottom: '20px', padding: '8px 16px', fontSize: '12px' }}>← Back to Apps Pool</button>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '32px' }}>
            <h3 style={{ margin: '0 0 16px', color: '#fff' }}>M-Pesa POS Merchant Terminal</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>Simulate collection of merchant ticket scans and merch payments.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: '#050409', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '4px' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#fff' }}>New Collection</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input placeholder="Phone Number (e.g. 0712345678)" style={{ padding: '8px', background: '#121118', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }} />
                  <input placeholder="Amount (KES)" style={{ padding: '8px', background: '#121118', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }} />
                  <button onClick={() => alert("Initiating M-Pesa STK push...")} className="btn-primary" style={{ padding: '8px', fontSize: '12px', background: '#10b981', border: 'none', color: '#000', fontWeight: 'bold' }}>Send STK Push</button>
                </div>
              </div>
              <div style={{ background: '#050409', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '4px' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#fff' }}>Transaction Logs</h4>
                <p style={{ fontSize: '12px', color: '#64748b' }}>No transactions recorded in this session.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeApp === 'ledger') {
    return (
      <div className={standalone ? "standalone-page-wrapper" : ""} style={{ paddingBottom: '80px', marginTop: '60px' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <button onClick={() => setActiveApp(null)} className="btn-secondary" style={{ marginBottom: '20px', padding: '8px 16px', fontSize: '12px' }}>← Back to Apps Pool</button>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '32px' }}>
            <h3 style={{ margin: '0 0 16px', color: '#fff' }}>Split Cascade Ledger</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>Waterfalls of sync licensing royalties directly to creators and songwriters.</p>
            <div style={{ background: '#050409', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '4px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#fff' }}>Collaborators Share Sheet</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '4px' }}><span>Writer (Aisha Okoro)</span> <strong style={{ color: '#00f2fe' }}>50.00%</strong></li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '4px' }}><span>Producer (Caleb)</span> <strong style={{ color: '#00f2fe' }}>25.00%</strong></li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '4px' }}><span>SyncMavens Admin Fee</span> <strong style={{ color: '#10b981' }}>10.00%</strong></li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '4px' }}><span>Publisher Share</span> <strong style={{ color: '#8b5cf6' }}>15.00%</strong></li>
              </ul>
            </div>
            <button onClick={() => alert("Recalculating split waterfalls...")} className="btn-get-signed" style={{ padding: '8px 16px', fontSize: '12px' }}>Distribute Payout Cascade</button>
          </div>
        </div>
      </div>
    );
  }

  if (activeApp === 'tracker' || activeApp === 'hosting') {
    const appName = apps.find(a => a.id === activeApp)?.name || 'Application';
    return (
      <div className={standalone ? "standalone-page-wrapper" : ""} style={{ paddingBottom: '80px', marginTop: '60px' }}>
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <button onClick={() => setActiveApp(null)} className="btn-secondary" style={{ marginBottom: '20px', padding: '8px 16px', fontSize: '12px' }}>← Back to Apps Pool</button>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '40px 24px' }}>
            <h3 style={{ margin: '0 0 8px', color: '#fff' }}>{appName}</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>This utility runs automatically in the background of your TuneMavens ecosystem account.</p>
            <span style={{ fontSize: '11px', background: 'rgba(244,211,94,0.1)', border: '1px solid rgba(244,211,94,0.25)', color: '#F4D35E', padding: '6px 12px', borderRadius: '3px', fontWeight: 'bold' }}>● Active & Scanning Sandbox</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={standalone ? "standalone-page-wrapper" : ""}>
      {standalone && (
        <div className="page-header-banner" style={{ backgroundImage: `url(${splitsCascadeHero})` }}>
          <div className="page-header-overlay" />
          <div className="page-header-content">
            <h1 className="page-header-title">Standalone Apps Pool</h1>
            <div className="page-header-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">Dashboard Apps</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="container" style={{ paddingBottom: '80px', marginTop: '60px', maxWidth: '1200px', margin: '60px auto 80px', padding: '0 20px' }}>
        <p style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px', color: '#94a3b8', fontSize: '14px' }}>
          Integrated dashboard managers that communicate directly with your unified Intermaven profile and credits vault.
        </p>
        <div className="apps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {apps.map((a, idx) => {
            const Icon = a.icon;
            return (
              <div 
                key={idx} 
                className="app-card glass-panel glass-panel-hover"
                onClick={() => setActiveApp(a.id)}
                style={{ cursor: 'pointer', background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.06)', padding: '24px', borderRadius: '4px', transition: 'all 0.2s ease' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6', borderRadius: '4px', marginBottom: '16px' }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', margin: '0 0 8px 0' }}>{a.name}</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: '0 0 16px 0', minHeight: '54px' }}>{a.desc}</p>
                <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>● Live App</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Native Apps View
// ==========================================
function NativeAppsView({ standalone }) {
  const StoreButton = ({ kind, label, sublabel }) => (
    <button
      type="button"
      className="store-cta"
      onClick={() => alert(`${label} listing for the ${kind} build coming soon.`)}
      style={{ width: '100%' }}
    >
      <div className="store-cta-icon" style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>
        {kind === 'ios' ? '' : '⤓'}
      </div>
      <div className="store-cta-text" style={{ textAlign: 'left' }}>
        <span className="store-cta-sub" style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>{sublabel}</span>
        <span className="store-cta-label" style={{ fontSize: '13px', fontWeight: '800', color: '#f1f5f9', marginTop: '2px', display: 'block' }}>{label}</span>
      </div>
    </button>
  );

  const appsList = [
    {
      id: 'consumer',
      name: 'tunestream',
      tagline: 'Stream. Tip. Carry the catalogue.',
      icon: RiMusicFill,
      accent: '#10b981',
      accentGlow: 'rgba(16, 185, 129, 0.18)',
      desc: 'The consumer-facing wrapper: offline-cached HQ audio, region-aware playlists, and one-tap tipping that lands directly in the creator’s payout split.',
      features: ['Offline-cached HQ audio', 'One-tap tipping to creators', 'Region-aware playlists', 'Shared credits vault'],
      target: 'For listeners',
    },
    {
      id: 'creator',
      name: 'tunecompanion',
      tagline: 'Your split ledger in your pocket.',
      icon: RiFileListLine,
      accent: '#8b5cf6',
      accentGlow: 'rgba(139, 92, 246, 0.18)',
      desc: 'Mobile metrics dashboard for artists and managers: real-time split ledger, payout balance, sync alerts, and AI-drafted release strategy plays on the go.',
      features: ['Real-time split cascades', 'Payout balance stream', 'Sync brief alerts', 'AI release playbooks'],
      target: 'For artists & managers',
    },
    {
      id: 'pos',
      name: 'tunepay',
      tagline: 'Sell at the show. Settle by morning.',
      icon: RiExchangeDollarLine,
      accent: '#10b981',
      accentGlow: 'rgba(16, 185, 129, 0.18)',
      desc: 'Portable point-of-sale for live events: merch, ticket scans, and CD/vinyl on a phone or tablet, with tunepay, card, and digital-wallet acceptance.',
      features: ['tunepay STK payments', 'Merch & ticket-scan modes', 'Event settlement reports', 'Geo-gated payout routing'],
      target: 'For labels & venues',
    },
  ];

  return (
    <div className={standalone ? "standalone-page-wrapper" : ""}>
      {standalone && (
        <div className="page-header-banner" style={{ backgroundImage: `url(${syncPlacementHero})` }}>
          <div className="page-header-overlay" />
          <div className="page-header-content">
            <h1 className="page-header-title">Native Mobile Apps</h1>
            <div className="page-header-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">Native Apps</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="container" style={{ paddingBottom: '96px', marginTop: '60px', maxWidth: '1200px', margin: '60px auto 96px', padding: '0 20px' }}>
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginBottom: '8px', maxWidth: '720px', margin: '0 auto 8px' }}>
          Three flagship native experiences. One shared TuneMavens / Intermaven account.
        </p>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', marginBottom: '56px', maxWidth: '640px', margin: '0 auto 56px' }}>
          Sign in once on the web and every native app picks up your same session, credits, and split ledger - no separate accounts to juggle.
        </p>

        <div className="native-apps-grid">
          {appsList.map((a) => {
            const Icon = a.icon;
            return (
              <article
                key={a.id}
                className="native-app-card"
                style={{ '--app-accent': a.accent, '--app-accent-glow': a.accentGlow }}
              >
                <div className="native-app-card-header">
                  <div className="native-app-icon" aria-hidden="true" style={{ color: a.accent }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <span className="native-app-target">{a.target}</span>
                    <h3 className="native-app-name">{a.name}</h3>
                  </div>
                </div>

                <p className="native-app-tagline" style={{ color: a.accent }}>{a.tagline}</p>
                <p className="native-app-desc">{a.desc}</p>

                <ul className="native-app-features">
                  {a.features.map((f, k) => (
                    <li key={k} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#cbd5e1', justifyContent: 'center' }}>
                      <span style={{ color: a.accent, fontWeight: 'bold' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>

                <div className="native-app-store-row" style={{ width: '100%', marginTop: 'auto' }}>
                  <StoreButton kind="ios" label="App Store" sublabel="Download on the" />
                  <StoreButton kind="android" label="Google Play" sublabel="Get it on" />
                </div>

                <div className="native-app-meta">
                  <span className="native-app-meta-pill">
                    Capacitor-wrapped · iOS &amp; Android
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Creator Dashboard Info Page View
// ==========================================
function CreatorDashboardPageView({ standalone }) {
  return (
    <div className={standalone ? "standalone-page-wrapper" : ""}>
      {standalone && (
        <div className="page-header-banner" style={{ backgroundImage: `url(${splitsCascadeHero})` }}>
          <div className="page-header-overlay" />
          <div className="page-header-content">
            <h1 className="page-header-title">Creator Dashboard</h1>
            <div className="page-header-breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active">Creator Dashboard</span>
            </div>
          </div>
        </div>
      )}
      
      <section className="landing-stepper" style={{ paddingTop: standalone ? '60px' : '80px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge-promo" style={{ display: 'inline-block', marginBottom: '12px' }}>DASHBOARD OVERVIEW</span>
          <h2>Your Operations Center</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>
            Monitor your catalog performance, check sync match compatibility, oversee royalty payouts, and track split sheets waterfalls in real-time.
          </p>
        </div>

        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto 56px', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: '#fff', fontSize: '20px', margin: '0 0 16px 0' }}>Real-time Analytics &amp; Reports</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px' }}>
                Understand exactly where your synchronization and streaming royalties originate. View geographical heatmaps, playlist inclusions, and direct downloads by music supervisors.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}><span style={{ color: '#00f2fe' }}>✓</span> Supervisor download alerts</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#00f2fe' }}><span style={{ color: '#00f2fe' }}>✓</span> Mechanical royalties statements</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}><span style={{ color: '#00f2fe' }}>✓</span> Custom attribution tags</li>
              </ul>
            </div>
            <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '24px' }}>
              <h4 style={{ margin: '0 0 16px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>Simulated Dashboard View</h4>
              <div style={{ background: '#050409', padding: '16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>Monthly Revenue</span>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>$4,520.10</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>Active Placements</span>
                  <span style={{ color: '#00f2fe', fontWeight: 'bold' }}>3 Syncs</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Catalog Health</span>
                  <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>100% Cleared</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SignUpCTA />
      </section>
    </div>
  );
}

// ==========================================
// Artist Advice Blog View
// ==========================================
function BlogView({ standalone }) {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchVal, setSearchVal] = useState('');

  const articles = [
    {
      id: 1,
      title: "Demystifying Composer Splits & Sync Waterfalls",
      desc: "Understand how buyouts flow automatically through predefined collaborator splits cascades.",
      content: "Sync licensing payouts are notoriously complex, involving multiple collaborators, publishers, and administrative cuts. At SyncMavens, we operate on a transparent 90% direct payout structure. When a buyout fee lands, it flows through a predetermined split cascade: Composer (50%), Producer (25%), Publisher (15%), and SyncMavens administration (10%). Automating this ledger at the source prevents splits disputes and yields payouts within hours of supervisor disbursement. As independent composers, retaining 100% of your mechanical control allows direct waterfalls without platform lockups.",
      tag: "Royalty Ledgers",
      date: "July 12, 2026",
      cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80"
    },
    {
      id: 2,
      title: "Metadata Standards: How to Tag Audio for Search Engines",
      desc: "Master key parameters like BPM, Genre, and Mood to rank high in supervisor briefs searches.",
      content: "To match your compositions against active briefs, music supervisors rely heavily on accurate metadata. Tagging your files with standard parameters like BPM, Genre, Mood (e.g. Action/Retro), and ISRC/ISWC codes makes them discoverable instantly by AI search engines. When music editors input briefs requirements, our matcher indexes acoustic sound fingerprints in real-time. Missing composer tags or ambiguous shares fields block matches, so always verify your metadata vault registry is fully documented.",
      tag: "Metadata",
      date: "July 8, 2026",
      cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80"
    },
    {
      id: 3,
      title: "5 Things Music Supervisors Look for in a Sync Pitch",
      desc: "Proven insights on securing Netflix, HBO, and TV commercial placements.",
      content: "Pitching to major television platforms like Netflix or HBO requires more than just high-quality sound. Music supervisors prioritize pre-cleared, one-stop licensing tracks, proper audio formatting (24-bit/48kHz broadcast WAV stems), and immediate callback options. Ensure your catalog status is validated. When they discover a potential track, sync clearances must happen within hours, so maintaining 100% ownership control increases your placement success rates substantially.",
      tag: "Music Licensing",
      date: "July 5, 2026",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80"
    },
    {
      id: 4,
      title: "Mechanical vs. Performance Royalties: A Creator Guide",
      desc: "Navigate the distinction between streaming mechanicals and broadcast license fees.",
      content: "Understanding the difference between mechanical streaming royalties and live performance license fees is essential. Mechanicals are generated when a work is reproduced digitally, while performance royalties are collected by PROs (ASCAP/BMI) for public broadcasts. We advise maintaining separate publishers registries. Direct licensing models route upfront buyout fees into immediate escrow, leaving secondary mechanical collections intact through ASCAP and BMI registry records.",
      tag: "Publishing",
      date: "June 28, 2026",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80"
    }
  ];

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(searchVal.toLowerCase()) ||
    a.tag.toLowerCase().includes(searchVal.toLowerCase()) ||
    a.content.toLowerCase().includes(searchVal.toLowerCase())
  );

  const handleArticleClick = (art) => {
    setSelectedArticle(art);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getRelatedArticles = (currentId) => {
    return articles.filter(a => a.id !== currentId);
  };

  return (
    <div className={standalone ? "standalone-page-wrapper" : ""}>
      {standalone && (
        <div className="page-header-banner" style={{ backgroundImage: `url(${splitsCascadeHero})` }}>
          <div className="page-header-overlay" />
          <div className="page-header-content">
            <h1 className="page-header-title">Artist Advice Blog</h1>
            <div className="page-header-breadcrumb">
              <Link to="/" className="breadcrumb-link" onClick={() => setSelectedArticle(null)}>Home</Link>
              <span className="breadcrumb-separator">/</span>
              {selectedArticle ? (
                <>
                  <Link to="/blog" className="breadcrumb-link" onClick={() => setSelectedArticle(null)}>Blog</Link>
                  <span className="breadcrumb-separator">/</span>
                  <span className="breadcrumb-active">{selectedArticle.title.substring(0, 20)}...</span>
                </>
              ) : (
                <span className="breadcrumb-active">Blog</span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container" style={{ paddingBottom: '96px', marginTop: '60px', maxWidth: '1200px', margin: '60px auto 96px', padding: '0 20px', textAlign: 'left' }}>
        {selectedArticle ? (
          /* Active Article Full View */
          <div>
            <button 
              onClick={() => setSelectedArticle(null)} 
              className="btn-secondary" 
              style={{ marginBottom: '32px', padding: '8px 16px', fontSize: '13px' }}
            >
              ← Back to Articles
            </button>

            <article style={{ maxWidth: '800px', margin: '0 auto 64px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', background: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe', padding: '4px 8px', borderRadius: '3px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {selectedArticle.tag}
                </span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{selectedArticle.date}</span>
              </div>

              <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', margin: '0 0 24px 0', lineHeight: '1.2' }}>{selectedArticle.title}</h2>
              
              <img 
                src={selectedArticle.cover} 
                alt={selectedArticle.title} 
                style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: '6px', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.06)' }} 
              />

              <p style={{ fontSize: '16px', color: '#cbd5e1', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {selectedArticle.content}
              </p>
            </article>

            {/* Related Articles Section */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '48px', maxWidth: '1000px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '24px' }}>Related Articles</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {getRelatedArticles(selectedArticle.id).map(a => (
                  <div 
                    key={a.id} 
                    onClick={() => handleArticleClick(a)}
                    className="step-card" 
                    style={{ cursor: 'pointer', background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column' }}
                  >
                    <img src={a.cover} alt={a.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      <span style={{ fontSize: '10px', color: '#00f2fe', fontWeight: 'bold', textTransform: 'uppercase' }}>{a.tag}</span>
                      <h4 style={{ margin: 0, fontSize: '14px', color: '#fff', lineHeight: '1.4' }}>{a.title}</h4>
                      <p style={{ fontSize: '11px', color: '#64748b', margin: 'auto 0 0 0' }}>{a.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Articles List Grid View */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <h2 style={{ margin: 0, color: '#fff' }}>Artist Advice &amp; Guides</h2>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Expert articles on sync placement mechanics, metadata setups, and splits bookkeeping.</p>
              </div>
              
              <div style={{ position: 'relative', width: '300px' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }}>🔍</span>
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 36px', background: '#0b0f1e', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '3px', color: '#fff', fontSize: '13px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
              {filteredArticles.map(a => (
                <div 
                  key={a.id} 
                  onClick={() => handleArticleClick(a)}
                  className="step-card" 
                  style={{ cursor: 'pointer', background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <img src={a.cover} alt={a.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', background: 'rgba(0, 242, 254, 0.08)', color: '#00f2fe', padding: '2px 6px', borderRadius: '2px', fontWeight: 'bold', textTransform: 'uppercase' }}>{a.tag}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{a.date}</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#fff', lineHeight: '1.4' }}>{a.title}</h3>
                    <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>{a.desc}</p>
                    <span style={{ fontSize: '12px', color: '#00f2fe', fontWeight: 'bold', marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Read article →</span>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredArticles.length === 0 && (
              <p style={{ textAlign: 'center', color: '#64748b', margin: '48px 0' }}>No articles match your query.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



