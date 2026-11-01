import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiVolumeUpFill,
  RiGlobalLine,
  RiMusicFill,
  RiShieldCheckFill,
  RiSearchLine,
  RiUploadCloud2Line,
  RiCloseLine,
  RiArrowRightLine,
  RiCheckLine,
  RiUserVoiceFill,
  RiDiscFill,
  RiCoinsFill,
  RiSparklingFill,
  RiCustomerService2Fill,
  RiFlashlightFill,
  RiDashboardLine,
  RiCheckDoubleLine,
  RiPlayList2Fill,
} from 'react-icons/ri';
import {
  SiSpotify,
  SiApplemusic,
  SiYoutube,
  SiTiktok,
  SiTidal,
  SiDeezer,
} from 'react-icons/si';
import { FaAmazon } from 'react-icons/fa';
import tunestreamLogo from '../../assets/logos/tunestream-logo.png';
import PageHeader from '../../components/common/PageHeader.jsx';
import AppHelpAiControls from '../../components/common/AppHelpAiControls.jsx';
import headerAppsImg from '../../assets/images/header_apps.png';
import headerAppsWesternImg from '../../assets/images/header_apps_western.png';
import SEO from '../../components/common/SEO.jsx';
import { distroApi } from '../../lib/api.js';

export default function DistributionView({ sessionUser }) {
  const navigate = useNavigate();

  // Selected persona funnel toggle: 'creator' | 'label'
  const [selectedPersona, setSelectedPersona] = useState(() => {
    if (sessionUser?.role === 'label') return 'label';
    return 'creator';
  });

  // Outlets Data
  const [outlets, setOutlets] = useState([]);
  const [outletCount, setOutletCount] = useState(150);
  const [loadingOutlets, setLoadingOutlets] = useState(true);

  // Store Directory Filters & Search
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchStoreQuery, setSearchStoreQuery] = useState('');

  // Sign-Up / Onboarding Modal
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [signUpPersona, setSignUpPersona] = useState('creator');
  const [artistName, setArtistName] = useState('');
  const [contactEmail, setContactEmail] = useState(sessionUser?.email || '');
  const [primaryGenre, setPrimaryGenre] = useState('Afro-House');
  const [countryRegion, setCountryRegion] = useState('Kenya (Worldwide)');
  const [onboardingSuccess, setOnboardingSuccess] = useState(false);

  // Fetch Outlets from backend
  useEffect(() => {
    setLoadingOutlets(true);
    distroApi
      .getOutlets()
      .then((res) => {
        if (res?.outlets && Array.isArray(res.outlets)) {
          setOutlets(res.outlets);
          setOutletCount(res.count || res.outlets.length);
        }
        setLoadingOutlets(false);
      })
      .catch((err) => {
        console.error('Failed to load outlets:', err);
        setLoadingOutlets(false);
      });
  }, []);

  // Filter outlets by category and search
  const filteredOutlets = outlets.filter((o) => {
    const matchesCategory =
      activeCategory === 'all' ||
      (activeCategory === 'popular' && o.popular) ||
      o.category === activeCategory;
    const matchesSearch =
      !searchStoreQuery ||
      o.name.toLowerCase().includes(searchStoreQuery.toLowerCase()) ||
      (o.territories && o.territories.toLowerCase().includes(searchStoreQuery.toLowerCase())) ||
      (o.category_label && o.category_label.toLowerCase().includes(searchStoreQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Handle Onboarding Completion
  const handleCompleteSignUp = (e) => {
    e.preventDefault();
    if (!artistName.trim()) return;

    // Save persona preference
    try {
      localStorage.setItem('tunemavens_distro_persona', signUpPersona);
      localStorage.setItem('tunemavens_pending_artist_name', artistName);
      localStorage.setItem('tunemavens_pending_genre', primaryGenre);
    } catch (_) {}

    setOnboardingSuccess(true);

    setTimeout(() => {
      setSignUpModalOpen(false);
      setOnboardingSuccess(false);
      if (sessionUser) {
        navigate('/dashboard?tab=distribution-election');
      } else {
        navigate('/register');
      }
    }, 1200);
  };

  // Helper: Outlet Icon
  const renderOutletIcon = (id, size = 20) => {
    if (id.includes('tunestream')) {
      return (
        <img
          src={tunestreamLogo}
          alt="TuneStream"
          style={{ width: size, height: size, objectFit: 'contain', borderRadius: '3px', display: 'inline-block' }}
        />
      );
    }
    if (id.includes('spotify')) return <SiSpotify size={size} color="#1db954" />;
    if (id.includes('apple')) return <SiApplemusic size={size} color="#fc3c44" />;
    if (id.includes('youtube')) return <SiYoutube size={size} color="#ff0000" />;
    if (id.includes('amazon')) return <FaAmazon size={size} color="#ff9900" />;
    if (id.includes('tiktok')) return <SiTiktok size={size - 2} color="#00f2fe" />;
    if (id.includes('tidal')) return <SiTidal size={size - 2} color="#fff" />;
    if (id.includes('deezer')) return <SiDeezer size={size} color="#ff007f" />;
    return <RiMusicFill size={size} color="var(--cyan)" />;
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'TuneMavens Global Music Distribution',
    description: 'Distribute your music to Spotify, Apple Music, TikTok, Boomplay, and 150+ stores worldwide. Keep 100% of your earnings.',
    provider: {
      '@type': 'Organization',
      name: 'TuneMavens',
    },
  };

  return (
    <>
      <SEO
        title="Distribute to 150+ Music Stores Worldwide | TuneMavens"
        description="Deliver your music to Spotify, Apple Music, TikTok, Boomplay, Amazon, and 150+ outlets worldwide. Keep 100% of your royalties."
        schema={schema}
      />
      <PageHeader
        title="Global Music Distribution"
        bgImage={headerAppsImg}
        bgImageWestern={headerAppsWesternImg}
        breadcrumb="Music Distribution"
      />
      <AppHelpAiControls activeContext="distribution" sessionUser={sessionUser} floating={true} />

      <div className="container" style={{ paddingBottom: '100px', marginTop: '30px' }}>
        {/* ================================================================= */}
        {/* HERO SALES BANNER & PERSONA SELECTION                             */}
        {/* ================================================================= */}
        <div
          className="glass-panel"
          style={{
            padding: '48px 36px',
            borderRadius: '3px',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            background: 'linear-gradient(135deg, rgba(11, 15, 30, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)',
            marginBottom: '48px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Glow Background */}
          <div
            style={{
              position: 'absolute',
              top: '-120px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '600px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <span
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '3px',
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              color: 'var(--cyan)',
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              marginBottom: '16px',
            }}
          >
            Worldwide Distribution to 150+ Stores
          </span>

          <h1
            style={{
              fontSize: '38px',
              fontWeight: 800,
              color: '#fff',
              margin: '0 auto 16px',
              maxWidth: '850px',
              lineHeight: '1.2',
            }}
          >
            Get Your Music into 150+ Stores Worldwide. <br />
            <span style={{ color: 'var(--cyan)' }}>Keep 100% of Your Royalties.</span>
          </h1>

          <p
            style={{
              fontSize: '16px',
              color: '#cbd5e1',
              maxWidth: '720px',
              margin: '0 auto 32px',
              lineHeight: '1.6',
            }}
          >
            Upload once. We deliver your songs to Spotify, Apple Music, TikTok, Boomplay, YouTube, Amazon Music, and 150+ digital stores, fitness apps, and jukebox networks across 195 countries. Zero hidden fees.
          </p>

          {/* Persona Switcher Tabs for Funnel Tailoring */}
          <div
            style={{
              display: 'inline-flex',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '3px',
              padding: '4px',
              marginBottom: '32px',
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedPersona('creator')}
              style={{
                padding: '10px 24px',
                borderRadius: '3px',
                border: 'none',
                background: selectedPersona === 'creator' ? 'var(--cyan)' : 'transparent',
                color: selectedPersona === 'creator' ? '#000' : '#cbd5e1',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <RiUserVoiceFill size={16} />
              I am an Independent Artist
            </button>
            <button
              type="button"
              onClick={() => setSelectedPersona('label')}
              style={{
                padding: '10px 24px',
                borderRadius: '3px',
                border: 'none',
                background: selectedPersona === 'label' ? '#a855f7' : 'transparent',
                color: '#fff',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <RiDiscFill size={16} />
              I am a Record Label or Manager
            </button>
          </div>

          {/* Persona-Tailored Value Pitch */}
          <div
            style={{
              maxWidth: '680px',
              margin: '0 auto 36px',
              padding: '20px',
              borderRadius: '3px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'left',
            }}
          >
            {selectedPersona === 'creator' ? (
              <div>
                <h4 style={{ margin: '0 0 8px', fontSize: '15px', color: '#fff', fontWeight: 700 }}>
                  🎵 Built for Solo Artists, Producers & Songwriters:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.6' }}>
                  <li><strong>Keep 100% of your earnings</strong>: You earned it, you keep it. No middleman cuts.</li>
                  <li><strong>Fast 24-48 Hour Delivery</strong>: Get your music live on Spotify and TikTok faster than ever.</li>
                  <li><strong>Free Barcodes Included</strong>: Free ISRC and UPC codes generated instantly for every release.</li>
                  <li><strong>Smart Pre-Save Links</strong>: Free automated SmartLinks to share with fans on social media.</li>
                </ul>
              </div>
            ) : (
              <div>
                <h4 style={{ margin: '0 0 8px', fontSize: '15px', color: '#fff', fontWeight: 700 }}>
                  🏢 Built for Record Labels, Imprints & Artist Managers:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.6' }}>
                  <li><strong>Multi-Artist Signed Roster</strong>: Manage unlimited artist catalogs under one umbrella.</li>
                  <li><strong>Bulk Catalog Dispatch</strong>: Ingest and deliver full catalogs to 150+ stores in one click.</li>
                  <li><strong>Automated Split Cascades</strong>: Set collaborator waterfalls. Payouts divide directly into artist wallets.</li>
                  <li><strong>White-Label DDEX Ingestion</strong>: Direct electronic feed compliance for label operations.</li>
                </ul>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setSignUpPersona(selectedPersona);
                setSignUpModalOpen(true);
              }}
              style={{
                padding: '14px 36px',
                borderRadius: '3px',
                border: 'none',
                background: 'linear-gradient(135deg, #00f2fe 0%, #38bdf8 100%)',
                color: '#000',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0, 242, 254, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Start Distributing Now <RiArrowRightLine size={18} />
            </button>

            {sessionUser ? (
              <Link
                to="/dashboard?tab=distribution-tracker"
                style={{
                  padding: '14px 28px',
                  borderRadius: '3px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <RiDashboardLine /> Open Distribution Radar in Dashboard
              </Link>
            ) : (
              <Link
                to="/pricing"
                style={{
                  padding: '14px 28px',
                  borderRadius: '3px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                View Plans & Pricing
              </Link>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* CORE BENEFITS & FEATURES GRID                                    */}
        {/* ================================================================= */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
            <span style={{ fontSize: '12px', color: 'var(--cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Why Artists & Labels Choose TuneMavens
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: '8px 0 12px' }}>
              Everything You Need to Release Music Globally
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94a3b8' }}>
              From the moment you finish your master track to the moment royalties hit your bank or mobile wallet, we have you covered.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              {
                icon: RiCoinsFill,
                color: '#10b981',
                title: 'Keep 100% of Your Earnings',
                desc: 'We never take a cut of your streaming royalties. Every cent paid by Spotify, Apple, or TikTok belongs to you.',
              },
              {
                icon: RiGlobalLine,
                color: 'var(--cyan)',
                title: '150+ Stores & Social Apps',
                desc: 'From global titans to African telco streaming, Asian gateways, TikTok sound libraries, and US bar jukeboxes.',
              },
              {
                icon: RiFlashlightFill,
                color: '#f59e0b',
                title: 'Lightning-Fast 24-48h Ingestion',
                desc: 'Direct DDEX delivery pipelines mean your releases hit store shelves faster with automated metadata validation.',
              },
              {
                icon: RiShieldCheckFill,
                color: '#38bdf8',
                title: 'Free ISRC & UPC Barcodes',
                desc: 'Official registrant barcodes included with every release at zero extra charge. Fully compliant with global industry standards.',
              },
              {
                icon: RiCheckDoubleLine,
                color: '#a855f7',
                title: 'Automated Royalty Splits',
                desc: 'Collaborated with a producer or featured artist? Direct split waterfalls divide payouts into each collaborator’s wallet.',
              },
              {
                icon: RiCustomerService2Fill,
                color: '#ec4899',
                title: '24/7 Dedicated Support',
                desc: 'Direct help with artist verification, Spotify pitching, takedowns, and release date changes from music industry pros.',
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="glass-panel"
                  style={{
                    padding: '28px',
                    borderRadius: '3px',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '3px',
                      background: `${card.color}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.color,
                      marginBottom: '16px',
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h4 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#fff' }}>{card.title}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

                {/* ================================================================= */}
        {/* MAIN GLOBAL DISTRIBUTORS SHOWCASE                                */}
        {/* ================================================================= */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              FLAGSHIP DISTRIBUTION NETWORK
            </span>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '4px 0 8px', fontFamily: 'Sansation, sans-serif' }}>
              Main Global Distributors &amp; DSP Partners
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '640px', margin: '0 auto' }}>
              Direct automated ingestion to TuneStream, Spotify, Apple Music, YouTube Music, Amazon, TikTok, and top global DSPs with 100% royalty cascades.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            {[
              {
                id: 'tunestream',
                name: 'TuneStream Audio',
                subtitle: 'Native Lossless Platform',
                payout: '100% Direct Payouts',
                sla: 'Instantaneous Sync',
                badge: 'Primary Flagship Partner',
                badgeBg: 'rgba(245, 158, 11, 0.2)',
                badgeColor: '#f59e0b',
                isCustomImg: true,
              },
              {
                id: 'spotify',
                name: 'Spotify',
                subtitle: '600M+ Active Listeners',
                payout: '~$3.80 / 1k streams',
                sla: '24-48 Hours',
                icon: <SiSpotify size={24} color="#1db954" />,
              },
              {
                id: 'apple_music',
                name: 'Apple Music',
                subtitle: 'Spatial Audio & Lossless',
                payout: '~$8.20 / 1k streams',
                sla: '24-72 Hours',
                icon: <SiApplemusic size={24} color="#fc3c44" />,
              },
              {
                id: 'youtube_music',
                name: 'YouTube Music & Shorts',
                subtitle: 'Content ID Monetization',
                payout: '~$2.20 / 1k streams',
                sla: '12-24 Hours',
                icon: <SiYoutube size={24} color="#ff0000" />,
              },
              {
                id: 'amazon_music',
                name: 'Amazon Music',
                subtitle: 'Ultra HD & Alexa Voice',
                payout: '~$4.10 / 1k streams',
                sla: '24-48 Hours',
                icon: <FaAmazon size={24} color="#ff9900" />,
              },
              {
                id: 'tiktok',
                name: 'TikTok & CapCut',
                subtitle: 'Viral Video UGC Sync',
                payout: 'Micro-Sync Royalties',
                sla: '12-24 Hours',
                icon: <SiTiktok size={22} color="#00f2fe" />,
              },
              {
                id: 'tidal',
                name: 'Tidal',
                subtitle: 'Hi-Res Studio FLAC',
                payout: '~$12.80 / 1k streams',
                sla: '24-48 Hours',
                icon: <SiTidal size={22} color="#fff" />,
              },
              {
                id: 'boomplay',
                name: 'Boomplay',
                subtitle: 'Pan-African Leader',
                payout: 'Local Mobile Money',
                sla: '24-48 Hours',
                icon: <RiMusicFill size={24} color="#f59e0b" />,
              },
            ].map((dsp) => (
              <div
                key={dsp.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: dsp.id === 'tunestream' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '3px',
                  padding: '18px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {dsp.isCustomImg ? (
                      <img src={tunestreamLogo} alt="TuneStream" style={{ width: 26, height: 26, objectFit: 'contain', borderRadius: '3px' }} />
                    ) : (
                      dsp.icon
                    )}
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{dsp.name}</span>
                  </div>
                  {dsp.badge && (
                    <span style={{ fontSize: '9.5px', padding: '2px 6px', borderRadius: '3px', background: dsp.badgeBg, color: dsp.badgeColor, fontWeight: 700 }}>
                      {dsp.badge}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>{dsp.subtitle}</span>
                <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>{dsp.payout}</span>
                  <span>{dsp.sla}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

{/* ================================================================= */}
        {/* INTERACTIVE 150+ OUTLETS DIRECTORY                                */}
        {/* ================================================================= */}
        <div
          id="outlets-directory"
          style={{
            marginBottom: '64px',
            backgroundColor: 'rgba(11, 15, 30, 0.7)',
            padding: '36px',
            borderRadius: '3px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Full Store Network
              </span>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', margin: '4px 0 0' }}>
                Explore All {outletCount}+ Supported Outlets
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#94a3b8' }}>
                Deliver your music to every corner of the globe with a single submission.
              </p>
            </div>

            {/* Search Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '3px',
                padding: '8px 16px',
                width: '280px',
              }}
            >
              <RiSearchLine color="#94a3b8" />
              <input
                type="text"
                value={searchStoreQuery}
                onChange={(e) => setSearchStoreQuery(e.target.value)}
                placeholder="Search any music store..."
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '13px',
                  width: '100%',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
            {[
              { id: 'all', label: `All Outlets (${outletCount})` },
              { id: 'streaming', label: 'Global Streaming' },
              { id: 'social', label: 'Social & Video Sync' },
              { id: 'regional', label: 'Regional (Africa, Asia & LatAm)' },
              { id: 'fitness', label: 'Smart Tech & Fitness' },
              { id: 'commercial', label: 'Bars & Digital Jukeboxes' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '3px',
                  border: activeCategory === cat.id ? '1px solid var(--cyan)' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: activeCategory === cat.id ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: activeCategory === cat.id ? 'var(--cyan)' : '#cbd5e1',
                  fontSize: '12.5px',
                  fontWeight: activeCategory === cat.id ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Outlets Grid */}
          {loadingOutlets ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              Loading global music store catalog...
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '14px',
                maxHeight: '520px',
                overflowY: 'auto',
                paddingRight: '6px',
              }}
            >
              {filteredOutlets.map((o) => (
                <div
                  key={o.id}
                  style={{
                    padding: '16px',
                    borderRadius: '3px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {renderOutletIcon(o.id, 20)}
                        <strong style={{ fontSize: '13.5px', color: '#fff' }}>{o.name}</strong>
                      </div>
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          background: 'rgba(0, 242, 254, 0.08)',
                          color: 'var(--cyan)',
                          fontWeight: 700,
                        }}
                      >
                        {o.category_label || o.category}
                      </span>
                    </div>

                    <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
                      {o.description}
                    </p>
                  </div>

                  <div
                    style={{
                      paddingTop: '8px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      color: '#64748b',
                    }}
                  >
                    <span>{o.delivery_sla || '24-48 Hours'}</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>Active Direct Feed</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* SIMPLE TRANSPARENT PLANS & PRICING                                */}
        {/* ================================================================= */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px' }}>
            <span style={{ fontSize: '12px', color: 'var(--cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Transparent Pricing
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: '8px 0 12px' }}>
              Simple Plans. You Keep 100% of Your Earnings.
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94a3b8' }}>
              Choose the distribution tier that fits where you are in your music journey.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Free Tier */}
            <div
              className="glass-panel"
              style={{
                padding: '32px 28px',
                borderRadius: '3px',
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Starter Artist</span>
                <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 16px' }}>
                  Free <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>/ forever</span>
                </h3>
                <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '20px' }}>
                  Great for first-time releases and emerging songwriters testing the waters.
                </p>
                <ul style={{ margin: '0 0 24px', paddingLeft: '18px', fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                  <li>Keep 100% of your royalties</li>
                  <li>Distribution to core 150+ stores</li>
                  <li>Free ISRC & UPC barcodes</li>
                  <li>Standard 48-72h delivery</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSignUpPersona('creator');
                  setSignUpModalOpen(true);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '3px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Creator (Featured) */}
            <div
              className="glass-panel"
              style={{
                padding: '32px 28px',
                borderRadius: '3px',
                backgroundColor: 'rgba(0, 242, 254, 0.04)',
                border: '2px solid var(--cyan)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--cyan)',
                  color: '#000',
                  padding: '3px 12px',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                Most Popular
              </span>

              <div>
                <span style={{ fontSize: '12px', color: 'var(--cyan)', fontWeight: 700, textTransform: 'uppercase' }}>Pro Creator</span>
                <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 16px' }}>
                  $19.99 <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>/ year</span>
                </h3>
                <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '20px' }}>
                  Unlimited releases for solo artists, producers, and active performers.
                </p>
                <ul style={{ margin: '0 0 24px', paddingLeft: '18px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.8' }}>
                  <li><strong>Unlimited releases</strong> all year</li>
                  <li>Keep 100% of your royalties</li>
                  <li>Fast 24h express store delivery</li>
                  <li>Spotify for Artists auto-verification</li>
                  <li>Free SmartLinks & Pre-Saves</li>
                  <li>Dolby Atmos & Spatial Audio support</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSignUpPersona('creator');
                  setSignUpModalOpen(true);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '3px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #00f2fe 0%, #38bdf8 100%)',
                  color: '#000',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 242, 254, 0.3)',
                }}
              >
                Start with Pro
              </button>
            </div>

            {/* Label Imprint */}
            <div
              className="glass-panel"
              style={{
                padding: '32px 28px',
                borderRadius: '3px',
                backgroundColor: 'rgba(168, 85, 247, 0.04)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase' }}>Record Label</span>
                <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 16px' }}>
                  $49.99 <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>/ year</span>
                </h3>
                <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '20px' }}>
                  For labels, imprints, and managers handling multiple signed artists.
                </p>
                <ul style={{ margin: '0 0 24px', paddingLeft: '18px', fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                  <li><strong>Unlimited artists & releases</strong></li>
                  <li>Automated collaborator split waterfalls</li>
                  <li>Bulk catalog batch uploads</li>
                  <li>Custom record label name on DSPs</li>
                  <li>White-label DDEX 3.8 feed exports</li>
                  <li>Dedicated label account manager</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSignUpPersona('label');
                  setSignUpModalOpen(true);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '3px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Start Label Plan
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* DASHBOARD INTEGRATION CALLOUT FOR LOGGED-IN USERS                 */}
        {/* ================================================================= */}
        <div
          className="glass-panel"
          style={{
            padding: '28px 32px',
            borderRadius: '3px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <RiDashboardLine size={18} color="var(--cyan)" />
              <strong style={{ fontSize: '14px', color: '#fff' }}>Looking for your private operational dashboard?</strong>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
              All private data — track uploads, store delivery radar, daily play statistics, and royalty statements — sit securely in your authenticated dashboard apps tailored to what you own.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              to="/dashboard?tab=distribution-tracker"
              style={{
                padding: '9px 18px',
                borderRadius: '3px',
                background: 'rgba(0, 242, 254, 0.15)',
                border: '1px solid var(--cyan)',
                color: 'var(--cyan)',
                fontSize: '12.5px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Distribution Radar
            </Link>
            <Link
              to="/dashboard?tab=distribution-election"
              style={{
                padding: '9px 18px',
                borderRadius: '3px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: '12.5px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Distribution Contracts
            </Link>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* DISTRIBUTION ONBOARDING SIGN-UP MODAL                               */}
      {/* =================================================================== */}
      {signUpModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '540px',
              backgroundColor: '#0b0f1e',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              borderRadius: '3px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(90deg, rgba(0,242,254,0.08) 0%, rgba(168,85,247,0.05) 100%)',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#fff' }}>
                  Start Distributing Your Music
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  Step 1 of 2: Tell us about your music project
                </p>
              </div>
              <button
                onClick={() => setSignUpModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
              >
                <RiCloseLine size={24} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCompleteSignUp} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {onboardingSuccess ? (
                <div style={{ textAlign: 'center', padding: '30px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <RiCheckLine size={28} />
                  </div>
                  <h4 style={{ margin: '0 0 8px', color: '#fff', fontSize: '18px' }}>Workspace Initialized!</h4>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>
                    Redirecting you to your personalized distribution suite...
                  </p>
                </div>
              ) : (
                <>
                  {/* Account Type Selector */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                      I am signing up as:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <label
                        style={{
                          padding: '10px 14px',
                          borderRadius: '3px',
                          background: signUpPersona === 'creator' ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                          border: signUpPersona === 'creator' ? '1px solid var(--cyan)' : '1px solid rgba(255, 255, 255, 0.1)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '12.5px',
                          color: signUpPersona === 'creator' ? '#fff' : '#94a3b8',
                          fontWeight: 600,
                        }}
                      >
                        <input
                          type="radio"
                          name="signUpPersona"
                          checked={signUpPersona === 'creator'}
                          onChange={() => setSignUpPersona('creator')}
                          style={{ accentColor: 'var(--cyan)' }}
                        />
                        Solo Artist / Creator
                      </label>

                      <label
                        style={{
                          padding: '10px 14px',
                          borderRadius: '3px',
                          background: signUpPersona === 'label' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                          border: signUpPersona === 'label' ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '12.5px',
                          color: signUpPersona === 'label' ? '#fff' : '#94a3b8',
                          fontWeight: 600,
                        }}
                      >
                        <input
                          type="radio"
                          name="signUpPersona"
                          checked={signUpPersona === 'label'}
                          onChange={() => setSignUpPersona('label')}
                          style={{ accentColor: '#a855f7' }}
                        />
                        Record Label / Imprint
                      </label>
                    </div>
                  </div>

                  {/* Artist or Label Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      {signUpPersona === 'creator' ? 'Artist / Stage Name *' : 'Record Label / Imprint Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      placeholder={signUpPersona === 'creator' ? 'e.g. Ndufo, Sarah Jensen' : 'e.g. Skyline Records Africa'}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '3px',
                        color: '#fff',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="you@domain.com"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '3px',
                        color: '#fff',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  {/* Primary Genre & Country */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                        Primary Genre
                      </label>
                      <select
                        value={primaryGenre}
                        onChange={(e) => setPrimaryGenre(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#131b2e',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '3px',
                          color: '#fff',
                          fontSize: '13px',
                        }}
                      >
                        <option value="Afro-House">Afro-House</option>
                        <option value="Amapiano">Amapiano</option>
                        <option value="Afrobeats">Afrobeats</option>
                        <option value="Electronic">Electronic / Dance</option>
                        <option value="Hip-Hop">Hip-Hop / Rap</option>
                        <option value="R&B">R&B / Soul</option>
                        <option value="Pop">Pop</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                        Region / Country
                      </label>
                      <select
                        value={countryRegion}
                        onChange={(e) => setCountryRegion(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#131b2e',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '3px',
                          color: '#fff',
                          fontSize: '13px',
                        }}
                      >
                        <option value="Kenya (Worldwide)">Kenya / East Africa</option>
                        <option value="Nigeria (Worldwide)">Nigeria / West Africa</option>
                        <option value="South Africa (Worldwide)">South Africa</option>
                        <option value="United States (Worldwide)">United States</option>
                        <option value="United Kingdom (Worldwide)">United Kingdom</option>
                        <option value="Global / Other">Global / Other</option>
                      </select>
                    </div>
                  </div>

                  <p style={{ margin: '4px 0 12px', fontSize: '11px', color: '#64748b' }}>
                    By clicking Continue, you agree to TuneMavens 100% royalty pass-through distribution terms.
                  </p>

                  <button
                    type="submit"
                    style={{
                      padding: '12px',
                      background: 'linear-gradient(135deg, #00f2fe 0%, #38bdf8 100%)',
                      border: 'none',
                      borderRadius: '3px',
                      color: '#000',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    Continue to Distribution Dashboard <RiArrowRightLine />
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
