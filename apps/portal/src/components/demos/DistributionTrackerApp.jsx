import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiExternalLinkLine,
  RiBarChartFill,
  RiGlobalFill,
  RiGlobalLine,
  RiCheckLine,
  RiCheckDoubleLine,
  RiShieldCheckFill,
  RiTimeLine,
  RiSearchLine,
  RiMusic2Fill,
  RiUploadCloud2Line,
  RiDiscFill,
  RiFileCopyLine,
  RiRefreshLine,
  RiCloseLine,
  RiFileTextLine,
  RiCheckFill,
  RiCoinsFill,
  RiStackFill,
  RiUserSettingsFill,
  RiBuilding4Fill,
  RiUserVoiceFill,
  RiFilter3Line,
  RiSpeedUpFill,
  RiRadarLine
} from 'react-icons/ri';
import {
  SiSpotify,
  SiApplemusic,
  SiTiktok,
  SiTidal,
  SiDeezer,
  SiYoutube
} from 'react-icons/si';
import { FaAmazon } from 'react-icons/fa';
import tunestreamLogo from '../../assets/logos/tunestream-logo.png';

import { distroApi, dealsApi, contractsApi } from '../../lib/api.js';
import { ContractDrawer } from '../phase3.jsx';
import DistributeReleaseModal from '../distribution/DistributeReleaseModal.jsx';
import DdexSheetModal from '../distribution/DdexSheetModal.jsx';
import BulkDeliverModal from '../distribution/BulkDeliverModal.jsx';

export default function DistributionTrackerApp({ goBack, sessionUser, initialTab = 'pipeline' }) {
  // Outlet Icon Helper
  const renderOutletIcon = (id = '', size = 18) => {
    const lower = String(id).toLowerCase();
    if (lower.includes('tunestream')) {
      return (
        <img
          src={tunestreamLogo}
          alt="TuneStream"
          style={{ width: size, height: size, objectFit: 'contain', borderRadius: '3px', display: 'inline-block' }}
        />
      );
    }
    if (lower.includes('spotify')) return <SiSpotify size={size} color="#1db954" />;
    if (lower.includes('apple')) return <SiApplemusic size={size} color="#fc3c44" />;
    if (lower.includes('youtube')) return <SiYoutube size={size} color="#ff0000" />;
    if (lower.includes('amazon')) return <FaAmazon size={size} color="#ff9900" />;
    if (lower.includes('tiktok')) return <SiTiktok size={size - 2} color="#00f2fe" />;
    if (lower.includes('tidal')) return <SiTidal size={size - 2} color="#fff" />;
    if (lower.includes('deezer')) return <SiDeezer size={size} color="#ff007f" />;
    return <RiMusic2Fill size={size} color="var(--cyan)" />;
  };

  // Persona Management: Creator vs Label vs Admin
  const [activePersona, setActivePersona] = useState(() => {
    if (sessionUser?.role === 'admin') return 'admin';
    if (sessionUser?.role === 'label') return 'label';
    const saved = localStorage.getItem('tunemavens_distro_persona');
    return saved || 'creator';
  });

  // Outlets Catalog
  const [outlets, setOutlets] = useState([]);
  const [outletCount, setOutletCount] = useState(181);
  const [loadingOutlets, setLoadingOutlets] = useState(false);

  // Persona Telemetry Stats
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Releases Data
  const [releases, setReleases] = useState([]);
  const [loadingReleases, setLoadingReleases] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState(null);

  // Admin Pipeline
  const [adminPipeline, setAdminPipeline] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [overrideFeedback, setOverrideFeedback] = useState('');

  // Modals
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [ddexModalRelease, setDdexModalRelease] = useState(null);

  // UI state
    // Deal Election State
  const [dealPath, setDealPath] = useState('tunemavens_native');
  const [existingDeals, setExistingDeals] = useState([]);
  const [loadingDeals, setLoadingDeals] = useState(false);
  const [dealSubmitting, setDealSubmitting] = useState(false);
  const [dealError, setDealError] = useState('');
  const [dealSuccess, setDealSuccess] = useState('');
  const [showDealHistory, setShowDealHistory] = useState(false);
  const [contractDraft, setContractDraft] = useState(null);

  const loadDeals = () => {
    setLoadingDeals(true);
    dealsApi.distribution
      .list()
      .then((list) => setExistingDeals(Array.isArray(list) ? list : []))
      .catch(() => setExistingDeals([]))
      .finally(() => setLoadingDeals(false));
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const activeDeal = existingDeals.find((d) => d.status === 'active') || null;
  const dealHistory = existingDeals.filter((d) => d.status !== 'active');

  const distributionPaths = [
    {
      key: 'standard_fee_matched',
      fee_structure: 'flat_fee',
      title: 'Standard (Fee-Matched)',
      headline: 'Flat fee · You keep 100% of DSP royalties',
      desc: 'Mirrors DistroKid & TuneCore. Pay a flat annual plan; we ship your music to 181+ DSPs and you keep every single cent of royalties.',
      badge: '100% Royalties Kept',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeColor: '#10b981',
    },
    {
      key: 'tunemavens_native',
      fee_structure: 'rev_share',
      title: 'TuneMavens Native',
      headline: '45 / 55 revenue share · $0 upfront',
      desc: 'Direct platform distribution via TuneStream and partner DSPs. $0 upfront cost with automated royalty waterfall splits.',
      badge: 'Flagship Network',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      badgeColor: '#f59e0b',
    },
    {
      key: 'label_negotiated',
      fee_structure: 'rev_share',
      title: 'Label / Catalogue Negotiation',
      headline: 'Custom multi-artist catalogue terms',
      desc: 'Bespoke terms for record labels, imprints, and extensive catalogues. Negotiated splits and prioritized store encoding queues.',
      badge: 'For Labels & Catalogues',
      badgeBg: 'rgba(168, 85, 247, 0.15)',
      badgeColor: '#c084fc',
      disabled: activePersona !== 'label' && sessionUser?.role !== 'label',
    },
  ];

  const handleLockDealPath = async () => {
    setDealError('');
    setDealSuccess('');
    setDealSubmitting(true);
    try {
      const p = distributionPaths.find((x) => x.key === dealPath);
      const payload = {
        creator_id: sessionUser?.id || 'self',
        path: dealPath,
        fee_structure: p.fee_structure,
        ...(dealPath === 'tunemavens_native' ? { tunemavens_split_pct: 45, creator_split_pct: 55 } : {}),
      };
      const deal = await dealsApi.distribution.create(payload);
      setDealSuccess(`Distribution terms locked: ${p.title}`);
      loadDeals();
      const draft = await contractsApi.create({
        kind: 'distribution',
        linked_deal_id: deal?.id || deal?._id,
        context: payload,
      });
      setContractDraft(draft);
    } catch (e) {
      setDealError(e.data?.detail || e.message || 'Could not save distribution election');
    } finally {
      setDealSubmitting(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeSubTab, setActiveSubTab] = useState(initialTab || 'pipeline'); // 'pipeline' | 'outlets' | 'admin' | 'stats'
  const [copiedLink, setCopiedLink] = useState(false);

  // Load Outlets from Backend
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

  // Load Persona-Scoped Stats & Releases
  const loadData = () => {
    setLoadingStats(true);
    distroApi
      .getStats({ persona: activePersona })
      .then((res) => {
        if (res) setStats(res);
        setLoadingStats(false);
      })
      .catch((err) => {
        console.error('Failed to load distro stats:', err);
        setLoadingStats(false);
      });

    setLoadingReleases(true);
    distroApi
      .getReleases({ persona: activePersona })
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.releases || []);
        if (list.length > 0) {
          setReleases(list);
          if (!selectedRelease) setSelectedRelease(list[0]);
        } else {
          // Fallback initial demo releases if empty in DB
          const demoReleases = [
            {
              _id: 'rel-1',
              title: 'Midnight Drifter',
              version: 'Extended Club Mix',
              artist: 'Ndufo ft. Sarah Jensen',
              album: 'Subway Sessions Vol. 1',
              isrc: 'US-TM8-24-00192',
              upc: '198273641029',
              release_date: '2024-11-14',
              status: 'live',
              audioFormat: '24-bit / 48kHz WAV',
              lufs: '-14.1 LUFS',
              stores: [
                { id: 'spotify', name: 'Spotify', status: 'delivered', updated_at: '18m ago' },
                { id: 'apple_music', name: 'Apple Music', status: 'delivered', updated_at: '22m ago' },
                { id: 'amazon_music', name: 'Amazon Music', status: 'delivered', updated_at: '35m ago' },
                { id: 'tiktok', name: 'TikTok', status: 'delivered', updated_at: '1h ago' },
                { id: 'boomplay', name: 'Boomplay', status: 'delivered', updated_at: '40m ago' }
              ],
              total_streams: 142850,
              smartLink: 'https://tunemavens.com/link/midnight-drifter',
              ddexBatch: 'DDEX-BATCH-2024-11-TM-99481',
              ddexAck: 'DSP-ACK-ALL-STORES-PASSED'
            },
            {
              _id: 'rel-2',
              title: 'Starlight Anthem',
              version: 'Radio Edit',
              artist: 'Elena Vance',
              album: 'Constellations',
              isrc: 'GB-TM8-24-00481',
              upc: '198273641036',
              release_date: '2024-11-21',
              status: 'scheduled',
              audioFormat: '24-bit / 96kHz Hi-Res FLAC',
              lufs: '-13.9 LUFS',
              stores: [
                { id: 'spotify', name: 'Spotify', status: 'scheduled', updated_at: 'Pre-Save Active' },
                { id: 'apple_music', name: 'Apple Music', status: 'ready', updated_at: 'Ready' },
                { id: 'amazon_music', name: 'Amazon Music', status: 'ready', updated_at: 'Ready' },
                { id: 'tiktok', name: 'TikTok', status: 'ready', updated_at: 'Verified' },
                { id: 'boomplay', name: 'Boomplay', status: 'ready', updated_at: 'Ready' }
              ],
              total_streams: 1420,
              smartLink: 'https://tunemavens.com/link/starlight-anthem',
              ddexBatch: 'DDEX-BATCH-2024-11-TM-99512',
              ddexAck: 'DSP-PRE-RELEASE-EMBARGO-ACTIVE'
            },
            {
              _id: 'rel-3',
              title: 'Echoes in Berlin',
              version: 'Dub Techno VIP',
              artist: 'Marcus Sterling',
              album: 'Kreuzberg Nights',
              isrc: 'DE-TM8-24-00712',
              upc: '198273641043',
              release_date: '2024-11-28',
              status: 'processing',
              audioFormat: '24-bit / 44.1kHz WAV',
              lufs: '-14.0 LUFS',
              stores: [
                { id: 'spotify', name: 'Spotify', status: 'processing', updated_at: 'Transcoding' },
                { id: 'apple_music', name: 'Apple Music', status: 'processing', updated_at: 'Atmos Verification' },
                { id: 'amazon_music', name: 'Amazon Music', status: 'queued', updated_at: 'Pending Batch' },
                { id: 'tiktok', name: 'TikTok', status: 'processing', updated_at: 'Stem Generation' },
                { id: 'boomplay', name: 'Boomplay', status: 'queued', updated_at: 'Pending Batch' }
              ],
              total_streams: 0,
              smartLink: 'https://tunemavens.com/link/echoes-in-berlin',
              ddexBatch: 'DDEX-BATCH-2024-11-TM-99604',
              ddexAck: 'DSP-QC-TRANSLATE-IN-PROGRESS'
            },
            {
              _id: 'rel-4',
              title: 'Nairobi Sunset',
              version: 'Acoustic Afro-Soul',
              artist: 'Amani Wanjiku',
              album: 'Rift Valley Chords',
              isrc: 'KE-TM8-24-01053',
              upc: '198273641050',
              release_date: '2024-12-05',
              status: 'processing',
              audioFormat: '24-bit / 48kHz WAV',
              lufs: '-14.2 LUFS',
              stores: [
                { id: 'spotify', name: 'Spotify', status: 'validating', updated_at: 'ISRC Match' },
                { id: 'apple_music', name: 'Apple Music', status: 'validating', updated_at: 'Lyrics Verification' },
                { id: 'amazon_music', name: 'Amazon Music', status: 'queued', updated_at: 'Pending' },
                { id: 'tiktok', name: 'TikTok', status: 'queued', updated_at: 'Pending' },
                { id: 'boomplay', name: 'Boomplay', status: 'validating', updated_at: 'ISRC Match' }
              ],
              total_streams: 0,
              smartLink: 'https://tunemavens.com/link/nairobi-sunset',
              ddexBatch: 'DDEX-BATCH-2024-11-TM-99720',
              ddexAck: 'DDEX-METADATA-VALIDATING'
            }
          ];
          setReleases(demoReleases);
          if (!selectedRelease) setSelectedRelease(demoReleases[0]);
        }
        setLoadingReleases(false);
      })
      .catch((err) => {
        console.error('Failed to load releases:', err);
        setLoadingReleases(false);
      });

    // If Admin, load Global Admin Pipeline
    if (activePersona === 'admin' || sessionUser?.role === 'admin') {
      setLoadingAdmin(true);
      distroApi
        .getAdminPipeline()
        .then((res) => {
          if (res?.success) setAdminPipeline(res);
          setLoadingAdmin(false);
        })
        .catch((err) => {
          console.error('Failed to load admin pipeline:', err);
          setLoadingAdmin(false);
        });
    }
  };

  useEffect(() => {
    loadData();
  }, [activePersona]);

  // Handle Admin Override Status
  const handleAdminOverride = async (releaseId, storeId, newStatus) => {
    try {
      const res = await distroApi.adminOverrideStatus({
        release_id: releaseId,
        store_id: storeId,
        status: newStatus
      });
      if (res?.success) {
        setOverrideFeedback(`Successfully set ${storeId} to ${newStatus}`);
        setTimeout(() => setOverrideFeedback(''), 3000);
        loadData();
      }
    } catch (err) {
      setOverrideFeedback(`Override error: ${err.message || 'Unauthorized'}`);
      setTimeout(() => setOverrideFeedback(''), 4000);
    }
  };

  const handleCopyLink = (link) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Filtered releases
  const filteredReleases = releases.filter((r) => {
    const matchesSearch =
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.isrc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.album?.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && r.status === statusFilter;
  });

  const primaryActionUrl = sessionUser
    ? '/dashboard?tab=distribution-election'
    : '/register?role=creator';

  return (
    <div style={{ width: '100%', color: '#fff' }}>
      {/* Top Header Row with Persona Switcher & Back Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {typeof goBack === 'function' && (
            <button
              onClick={goBack}
              className="btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '13px'
              }}
            >
              <RiArrowLeftLine size={16} /> Back to Dashboard Apps
            </button>
          )}

          {/* Persona View Indicator / Selector */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '3px',
              padding: '3px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <span
              style={{
                fontSize: '11px',
                color: 'var(--mu)',
                textTransform: 'uppercase',
                fontWeight: 700,
                letterSpacing: '0.8px',
                padding: '0 8px'
              }}
            >
              View Persona:
            </span>
            <button
              type="button"
              onClick={() => {
                setActivePersona('creator');
                localStorage.setItem('tunemavens_distro_persona', 'creator');
              }}
              style={{
                background:
                  activePersona === 'creator'
                    ? 'rgba(245, 158, 11, 0.25)'
                    : 'transparent',
                color: activePersona === 'creator' ? '#f59e0b' : 'var(--mu)',
                border: 'none',
                borderRadius: '3px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <RiUserVoiceFill size={13} /> Creator
            </button>
            <button
              type="button"
              onClick={() => {
                setActivePersona('label');
                localStorage.setItem('tunemavens_distro_persona', 'label');
              }}
              style={{
                background:
                  activePersona === 'label'
                    ? 'rgba(168, 85, 247, 0.25)'
                    : 'transparent',
                color: activePersona === 'label' ? '#c084fc' : 'var(--mu)',
                border: 'none',
                borderRadius: '3px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <RiBuilding4Fill size={13} /> Record Label
            </button>
            {sessionUser?.role === 'admin' && (
              <button
                type="button"
                onClick={() => setActivePersona('admin')}
                style={{
                  background:
                    activePersona === 'admin'
                      ? 'rgba(16, 185, 129, 0.25)'
                      : 'transparent',
                  color: activePersona === 'admin' ? '#34d399' : 'var(--mu)',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <RiUserSettingsFill size={13} /> Admin Console
              </button>
            )}
          </div>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowDistributeModal(true)}
            className="btn-primary"
            style={{
              padding: '9px 18px',
              fontSize: '13px',
              background: '#f59e0b',
              color: '#090d1f',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiUploadCloud2Line size={16} /> Distribute New Track / EP
          </button>

          {(activePersona === 'label' || activePersona === 'admin') && (
            <button
              type="button"
              onClick={() => setShowBulkModal(true)}
              className="btn-secondary"
              style={{
                padding: '9px 18px',
                fontSize: '13px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiStackFill size={16} /> Deliver Catalog Batch
            </button>
          )}

          <button
            type="button"
            onClick={loadData}
            title="Refresh distribution telemetry"
            className="btn-secondary"
            style={{ padding: '9px 12px' }}
          >
            <RiRefreshLine size={16} />
          </button>
        </div>
      </div>

      {overrideFeedback && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10b981',
            borderRadius: '3px',
            padding: '10px 16px',
            marginBottom: '16px',
            color: '#10b981',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          {overrideFeedback}
        </div>
      )}

      {/* Hero Glass Panel with Telemetry KPIs */}
      <div
        className="glass-panel"
        style={{
          padding: '32px',
          borderRadius: '3px',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          marginBottom: '28px',
          background:
            'radial-gradient(ellipse at top left, rgba(245, 158, 11, 0.08), rgba(6, 8, 19, 0.7) 70%)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '28px'
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#f59e0b',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              {activePersona === 'admin'
                ? 'CENTRAL DISPATCH CONTROL · ALL STORES & CATALOGS'
                : activePersona === 'label'
                ? 'RECORD LABEL RELEASES & MULTI-ARTIST WATERFALL'
                : 'CREATOR DISTRIBUTION & LIVE STREAM TELEMETRY'}
            </span>
            <h2
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: '#fff',
                margin: '0 0 10px',
                fontFamily: 'Sansation, sans-serif'
              }}
            >
              Distribution Tracker &amp; DSP Ingestion Radar
            </h2>
            <p
              style={{
                color: 'var(--mu)',
                fontSize: '14px',
                maxWidth: '740px',
                margin: 0,
                lineHeight: 1.6
              }}
            >
              Direct DDEX machine-to-machine ingestion pipelines to {outletCount}+
              global music stores, social UGC networks, regional telcos, and
              digital jukeboxes. 100% royalty cascades with zero third-party
              distribution withholdings.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              to="/distribution"
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '12.5px' }}
            >
              Browse 150+ Store Directory
            </Link>
            <Link
              to="/pricing"
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '12.5px' }}
            >
              Pricing &amp; Royalties
            </Link>
          </div>
        </div>

        {/* Real-time Telemetry KPIs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '16px'
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              padding: '18px 20px',
              borderRadius: '3px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--mu)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.5px'
                }}
              >
                Total Streams Across Outlets
              </span>
              <RiBarChartFill size={18} style={{ color: '#f59e0b' }} />
            </div>
            <div
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: '#fff',
                fontFamily: 'Space Grotesk, sans-serif'
              }}
            >
              {stats?.summary?.total_streams != null ? Number(stats.summary.total_streams).toLocaleString() : '144,270'}
            </div>
            <span
              style={{
                fontSize: '11.5px',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '4px'
              }}
            >
              ▲ +18.4% this cycle
            </span>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              padding: '18px 20px',
              borderRadius: '3px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--mu)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.5px'
                }}
              >
                Estimated Gross Royalties
              </span>
              <RiCoinsFill size={18} style={{ color: '#10b981' }} />
            </div>
            <div
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: '#10b981',
                fontFamily: 'Space Grotesk, sans-serif'
              }}
            >
              ${stats?.summary?.estimated_royalties != null ? Number(stats.summary.estimated_royalties).toFixed(2) : '892.40'}
            </div>
            <span
              style={{
                fontSize: '11.5px',
                color: 'var(--mu)',
                marginTop: '4px',
                display: 'block'
              }}
            >
              100% direct royalty payout
            </span>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              padding: '18px 20px',
              borderRadius: '3px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--mu)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.5px'
                }}
              >
                Supported Outlets
              </span>
              <RiGlobalFill size={18} style={{ color: 'var(--cyan)' }} />
            </div>
            <div
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: 'var(--cyan)',
                fontFamily: 'Space Grotesk, sans-serif'
              }}
            >
              {outletCount} Outlets
            </div>
            <span
              style={{
                fontSize: '11.5px',
                color: 'var(--mu)',
                marginTop: '4px',
                display: 'block'
              }}
            >
              Global DSPs, UGC, Bars &amp; Telcos
            </span>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              padding: '18px 20px',
              borderRadius: '3px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--mu)',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.5px'
                }}
              >
                Ingest SLA Turnaround
              </span>
              <RiCheckDoubleLine size={18} style={{ color: '#a855f7' }} />
            </div>
            <div
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: '#a855f7',
                fontFamily: 'Space Grotesk, sans-serif'
              }}
            >
              24 - 48h
            </div>
            <span
              style={{
                fontSize: '11.5px',
                color: 'var(--mu)',
                marginTop: '4px',
                display: 'block'
              }}
            >
              Automated DDEX 3.8 packaging
            </span>
          </div>
        </div>
      </div>

      {/* Subtab Navigation Bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '24px',
          paddingBottom: '2px',
          flexWrap: 'wrap'
        }}
      >
        <button
          type="button"
          onClick={() => setActiveSubTab('pipeline')}
          style={{
            background:
              activeSubTab === 'pipeline'
                ? 'rgba(245, 158, 11, 0.15)'
                : 'transparent',
            color: activeSubTab === 'pipeline' ? '#f59e0b' : 'var(--mu)',
            border: 'none',
            borderBottom:
              activeSubTab === 'pipeline'
                ? '2px solid #f59e0b'
                : '2px solid transparent',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <RiRadarLine size={16} /> Release Ingestion Pipeline ({filteredReleases.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('setup')}
          style={{
            background:
              activeSubTab === 'setup'
                ? 'rgba(168, 85, 247, 0.15)'
                : 'transparent',
            color: activeSubTab === 'setup' ? '#c084fc' : 'var(--mu)',
            border: 'none',
            borderBottom:
              activeSubTab === 'setup'
                ? '2px solid #c084fc'
                : '2px solid transparent',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <RiFileTextLine size={16} /> Setup &amp; Deal Election
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('outlets')}
          style={{
            background:
              activeSubTab === 'outlets'
                ? 'rgba(34, 211, 238, 0.15)'
                : 'transparent',
            color: activeSubTab === 'outlets' ? 'var(--cyan)' : 'var(--mu)',
            border: 'none',
            borderBottom:
              activeSubTab === 'outlets'
                ? '2px solid var(--cyan)'
                : '2px solid transparent',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <RiGlobalLine size={16} /> Supported Outlets Directory ({outletCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('stats')}
          style={{
            background:
              activeSubTab === 'stats'
                ? 'rgba(16, 185, 129, 0.15)'
                : 'transparent',
            color: activeSubTab === 'stats' ? '#10b981' : 'var(--mu)',
            border: 'none',
            borderBottom:
              activeSubTab === 'stats'
                ? '2px solid #10b981'
                : '2px solid transparent',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <RiBarChartFill size={16} /> Store Analytics &amp; Geographic Breakdown
        </button>

        {activePersona === 'admin' && (
          <button
            type="button"
            onClick={() => setActiveSubTab('admin')}
            style={{
              background:
                activeSubTab === 'admin'
                  ? 'rgba(168, 85, 247, 0.15)'
                  : 'transparent',
              color: activeSubTab === 'admin' ? '#c084fc' : 'var(--mu)',
              border: 'none',
              borderBottom:
                activeSubTab === 'admin'
                  ? '2px solid #c084fc'
                  : '2px solid transparent',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RiUserSettingsFill size={16} /> Admin Central Store Queue &amp; Overrides
          </button>
        )}
      </div>

            {/* TAB: Distribution Setup & Deal Election */}
      {activeSubTab === 'setup' && (
        <div
          className="glass-panel"
          style={{
            padding: '28px',
            borderRadius: '3px',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '32px'
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <span
              style={{
                fontSize: '11px',
                color: '#c084fc',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              DISTRIBUTION CONTRACT &amp; OUTLET SETTINGS
            </span>
            <h3
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#fff',
                margin: '4px 0 8px',
                fontFamily: 'Sansation, sans-serif'
              }}
            >
              Distribution Setup &amp; Deal Election
            </h3>
            <p style={{ color: 'var(--mu)', fontSize: '13.5px', margin: 0 }}>
              Select how your music is distributed to 181+ DSPs and configure legal contracts and store routing.
            </p>
          </div>

          {/* Active Deal Status */}
          {activeDeal && (
            <div
              style={{
                padding: '14px 18px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '3px',
                marginBottom: '20px'
              }}
            >
              <div
                style={{
                  color: '#10b981',
                  fontWeight: 800,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '4px'
                }}
              >
                Current Active Distribution Agreement
              </div>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>
                {activeDeal.path === 'standard_fee_matched'
                  ? 'Standard (Fee-Matched) · 100% Royalties Kept'
                  : activeDeal.path === 'tunemavens_native'
                  ? 'TuneMavens Native (45/55 Revenue Split)'
                  : 'Label / Catalogue Negotiation'}
                {' · '}
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>
                  {activeDeal.fee_structure === 'flat_fee' ? 'Flat annual model' : 'Split cascade model'}
                </span>
              </div>

              {dealHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowDealHistory(!showDealHistory)}
                  style={{
                    marginTop: '10px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#94a3b8',
                    padding: '4px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  {showDealHistory ? 'Hide' : 'Show'} Election History ({dealHistory.length})
                </button>
              )}

              {showDealHistory && dealHistory.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {dealHistory.map((h, i) => (
                    <li key={i} style={{ padding: '6px 0', fontSize: '12px', color: '#94a3b8' }}>
                      <span style={{ color: '#64748b', textTransform: 'uppercase', fontSize: '10px', fontWeight: 800 }}>{h.status}</span>
                      {' · '}{h.path}
                      {h.created_at ? ` · ${new Date(h.created_at).toLocaleDateString()}` : ''}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Deal Paths Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '14px',
              marginBottom: '20px'
            }}
          >
            {distributionPaths.map((p) => {
              const isSelected = dealPath === p.key;
              return (
                <div
                  key={p.key}
                  onClick={() => !p.disabled && setDealPath(p.key)}
                  style={{
                    textAlign: 'left',
                    padding: '20px',
                    border: isSelected ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                    background: isSelected ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255,255,255,0.02)',
                    borderRadius: '3px',
                    cursor: p.disabled ? 'not-allowed' : 'pointer',
                    opacity: p.disabled ? 0.45 : 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '9.5px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        background: p.badgeBg,
                        color: p.badgeColor,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        display: 'inline-block',
                        marginBottom: '8px'
                      }}
                    >
                      {p.badge}
                    </span>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>{p.title}</h4>
                    <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700, marginBottom: '8px' }}>{p.headline}</div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.55, margin: 0 }}>{p.desc}</p>
                  </div>
                  {p.disabled && <div style={{ fontSize: '10.5px', color: '#ef4444' }}>Available for Record Label accounts</div>}
                </div>
              );
            })}
          </div>

          {dealError && <div style={{ color: '#ef4444', fontSize: '12.5px', marginBottom: '12px' }}>{dealError}</div>}
          {dealSuccess && <div style={{ color: '#10b981', fontSize: '12.5px', marginBottom: '12px' }}>{dealSuccess}</div>}

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              disabled={dealSubmitting}
              onClick={handleLockDealPath}
              className="btn-primary"
              style={{
                padding: '10px 24px',
                fontSize: '13px',
                fontWeight: 800,
                background: '#f59e0b',
                color: '#000',
                borderRadius: '3px'
              }}
            >
              {dealSubmitting ? 'Locking Terms…' : 'Lock In Distribution Terms & Generate Legal Contract'}
            </button>
          </div>
        </div>
      )}


      {/* TAB 1: Release Ingestion Pipeline */}
      {activeSubTab === 'pipeline' && (
        <>
          <div
            className="glass-panel"
            style={{
              padding: '28px',
              borderRadius: '3px',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '32px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '20px'
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#fff',
                    margin: '0 0 6px',
                    fontFamily: 'Sansation, sans-serif'
                  }}
                >
                  Live Releases &amp; Store Delivery Verification
                </h3>
                <p style={{ color: 'var(--mu)', fontSize: '13px', margin: 0 }}>
                  Track ingestion progress from metadata validation to live store confirmation across all connected DSPs.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
              >
                {/* Status Filter */}
                <div
                  style={{
                    display: 'inline-flex',
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '3px',
                    padding: '3px',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'live', label: 'Live' },
                    { key: 'scheduled', label: 'Scheduled' },
                    { key: 'processing', label: 'Processing' }
                  ].map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setStatusFilter(f.key)}
                      style={{
                        background:
                          statusFilter === f.key
                            ? 'rgba(245, 158, 11, 0.2)'
                            : 'transparent',
                        color: statusFilter === f.key ? '#f59e0b' : 'var(--mu)',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div style={{ position: 'relative', width: '220px' }}>
                  <RiSearchLine
                    size={14}
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--mu)'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search track, ISRC, artist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '3px',
                      padding: '7px 12px 7px 32px',
                      color: '#fff',
                      fontSize: '12.5px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Releases Table */}
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: '13px'
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                      color: 'var(--mu)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px'
                    }}
                  >
                    <th style={{ padding: '12px 14px' }}>Release &amp; Artist</th>
                    <th style={{ padding: '12px 14px' }}>ISRC &amp; UPC</th>
                    <th style={{ padding: '12px 14px' }}>Drop Date</th>
                    <th style={{ padding: '12px 14px' }}>Store States</th>
                    <th style={{ padding: '12px 14px' }}>Streams</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReleases.map((r) => {
                    const isSelected = selectedRelease?._id === r._id;
                    const statusColor =
                      r.status === 'live'
                        ? '#10b981'
                        : r.status === 'scheduled'
                        ? 'var(--cyan)'
                        : '#f59e0b';

                    return (
                      <tr
                        key={r._id}
                        onClick={() => setSelectedRelease(r)}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          background: isSelected
                            ? 'rgba(245, 158, 11, 0.06)'
                            : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                      >
                        <td style={{ padding: '14px' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px'
                            }}
                          >
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '3px',
                                background: 'rgba(245,158,11,0.1)',
                                border: '1px solid rgba(245,158,11,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#f59e0b'
                              }}
                            >
                              <RiDiscFill size={18} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#fff' }}>
                                {r.title}
                              </div>
                              <div
                                style={{
                                  fontSize: '11.5px',
                                  color: 'var(--mu)'
                                }}
                              >
                                {r.artist}{' '}
                                {r.version && (
                                  <span style={{ color: '#94a3b8' }}>
                                    · {r.version}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '14px' }}>
                          <div
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '12px',
                              color: 'var(--cyan)'
                            }}
                          >
                            {r.isrc || 'Pending ISRC'}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'var(--mu)',
                              marginTop: '2px'
                            }}
                          >
                            UPC: {r.upc || 'Auto-Generated'}
                          </div>
                        </td>

                        <td style={{ padding: '14px' }}>
                          <div style={{ color: '#fff', fontWeight: 600 }}>
                            {r.release_date || 'Immediate'}
                          </div>
                          <span
                            style={{
                              fontSize: '10.5px',
                              padding: '2px 8px',
                              borderRadius: '3px',
                              background:
                                r.status === 'live'
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : 'rgba(245, 158, 11, 0.15)',
                              color: statusColor,
                              fontWeight: 700,
                              textTransform: 'uppercase'
                            }}
                          >
                            {r.status || 'live'}
                          </span>
                        </td>

                        <td style={{ padding: '14px' }}>
                          <div
                            style={{
                              display: 'flex',
                              gap: '6px',
                              flexWrap: 'wrap',
                              maxWidth: '240px'
                            }}
                          >
                            {(r.stores || []).slice(0, 5).map((s, idx) => (
                              <span
                                key={idx}
                                title={`${s.name || s.id}: ${s.status}`}
                                style={{
                                  fontSize: '10px',
                                  padding: '2px 6px',
                                  borderRadius: '3px',
                                  background:
                                    s.status === 'delivered' || s.status === 'Live'
                                      ? 'rgba(16, 185, 129, 0.12)'
                                      : 'rgba(245, 158, 11, 0.12)',
                                  color:
                                    s.status === 'delivered' || s.status === 'Live'
                                      ? '#10b981'
                                      : '#f59e0b',
                                  fontWeight: 600
                                }}
                              >
                                {s.name || s.id}
                              </span>
                            ))}
                            {(r.stores || []).length > 5 && (
                              <span
                                style={{
                                  fontSize: '10px',
                                  padding: '2px 6px',
                                  borderRadius: '3px',
                                  background: 'rgba(255,255,255,0.06)',
                                  color: 'var(--mu)'
                                }}
                              >
                                +{(r.stores || []).length - 5} more
                              </span>
                            )}
                          </div>
                        </td>

                        <td style={{ padding: '14px' }}>
                          <div style={{ color: '#fff', fontWeight: 700 }}>
                            {r.total_streams
                              ? r.total_streams.toLocaleString()
                              : '0'}
                          </div>
                          <span style={{ fontSize: '11px', color: 'var(--mu)' }}>
                            Verified Plays
                          </span>
                        </td>

                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          <div
                            style={{
                              display: 'inline-flex',
                              gap: '6px',
                              alignItems: 'center'
                            }}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDdexModalRelease(r);
                              }}
                              className="btn-secondary"
                              style={{
                                padding: '5px 10px',
                                fontSize: '11.5px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <RiFileTextLine size={13} /> DDEX XML
                            </button>

                            {r.smartLink && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyLink(r.smartLink);
                                }}
                                className="btn-secondary"
                                style={{
                                  padding: '5px 10px',
                                  fontSize: '11.5px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                {copiedLink ? (
                                  <RiCheckFill size={13} style={{ color: '#10b981' }} />
                                ) : (
                                  <RiFileCopyLine size={13} />
                                )}
                                Link
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Selected Release Inspection Drawer */}
            {selectedRelease && (
              <div
                style={{
                  marginTop: '24px',
                  padding: '20px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '3px',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <RiRadarLine size={20} style={{ color: '#f59e0b' }} />
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                      Audit Details: {selectedRelease.title}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        color: 'var(--cyan)'
                      }}
                    >
                      [{selectedRelease.isrc || 'ISRC-PENDING'}]
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setDdexModalRelease(selectedRelease)}
                      className="btn-primary"
                      style={{
                        padding: '6px 14px',
                        fontSize: '12px',
                        background: '#f59e0b',
                        color: '#000',
                        fontWeight: 700
                      }}
                    >
                      Export DDEX 3.8 XML
                    </button>
                    {selectedRelease.smartLink && (
                      <a
                        href={selectedRelease.smartLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary"
                        style={{
                          padding: '6px 14px',
                          fontSize: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <RiExternalLinkLine size={14} /> Open Pre-Save Page
                      </a>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                    fontSize: '12.5px',
                    color: 'var(--mu)'
                  }}
                >
                  <div>
                    <span style={{ color: '#94a3b8' }}>Batch ID:</span>{' '}
                    <span style={{ color: '#fff', fontFamily: 'monospace' }}>
                      {selectedRelease.ddexBatch || 'DDEX-TM-AUTO-BATCH'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Loudness:</span>{' '}
                    <span style={{ color: '#10b981', fontWeight: 600 }}>
                      {selectedRelease.lufs || '-14.0 LUFS Compliant'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Audio Master:</span>{' '}
                    <span style={{ color: '#fff' }}>
                      {selectedRelease.audioFormat || '24-bit / 48kHz WAV'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Store Deliveries:</span>{' '}
                    <span style={{ color: '#f59e0b', fontWeight: 700 }}>
                      {(selectedRelease.stores || []).length} Connected Outlets
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB 2: Supported Outlets Directory */}
      {activeSubTab === 'outlets' && (
        <div
          className="glass-panel"
          style={{
            padding: '28px',
            borderRadius: '3px',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '32px'
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <span
              style={{
                fontSize: '11px',
                color: '#f59e0b',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              GLOBAL DIGITAL SERVICE PROVIDERS
            </span>
            <h3
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#fff',
                margin: '4px 0 8px',
                fontFamily: 'Sansation, sans-serif'
              }}
            >
              All {outletCount} Supported Ingestion Destinations
            </h3>
            <p style={{ color: 'var(--mu)', fontSize: '13.5px', margin: 0 }}>
              TuneMavens delivers lossless audio master files directly into digital streaming services, social UGC platforms, regional mobile carriers, and digital jukeboxes.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '14px'
            }}
          >
            {outlets.slice(0, 60).map((o) => (
              <div
                key={o.id}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '3px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {renderOutletIcon(o.id, 18)}
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                      {o.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#f59e0b',
                      fontWeight: 700
                    }}
                  >
                    {o.category_label || o.category}
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--mu)' }}>
                  {o.territories}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#94a3b8',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '4px'
                  }}
                >
                  <span>SLA: {o.delivery_sla}</span>
                  <span style={{ color: '#10b981' }}>
                    ~${((Number(o.payout_est) || 0.0035) * 1000).toFixed(2)}/1k
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link
              to="/distribution"
              className="btn-primary"
              style={{
                padding: '10px 24px',
                fontSize: '13px',
                background: '#f59e0b',
                color: '#000',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Explore Full {outletCount}+ Directory in Public Funnel <RiArrowRightLine size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* TAB 3: Store Analytics & Geographic Breakdown */}
      {activeSubTab === 'stats' && (
        <div
          className="glass-panel"
          style={{
            padding: '28px',
            borderRadius: '3px',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '32px'
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#fff',
                margin: '0 0 6px',
                fontFamily: 'Sansation, sans-serif'
              }}
            >
              Platform Telemetry &amp; Top DSP Performance
            </h3>
            <p style={{ color: 'var(--mu)', fontSize: '13px', margin: 0 }}>
              Live stream counts and accrued royalties filtered by your current {activePersona} ownership rights.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}
          >
            {/* Top Outlets Table */}
            <div
              style={{
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '3px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <h4
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#fff',
                  margin: '0 0 16px'
                }}
              >
                Top Outlets by Volume
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(stats?.outlets_breakdown || [
                  { outlet_name: 'Spotify', streams: 64200, revenue_usd: 243.96 },
                  { outlet_name: 'Apple Music', streams: 38100, revenue_usd: 312.42 },
                  { outlet_name: 'Boomplay', streams: 24500, revenue_usd: 73.50 },
                  { outlet_name: 'YouTube Music', streams: 11200, revenue_usd: 24.64 },
                  { outlet_name: 'Amazon Music', streams: 6270, revenue_usd: 25.70 }
                ]).map((o, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '13px'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#fff' }}>
                      {o.name || o.outlet_name || o.outlet_id}
                    </span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>
                        {o.streams?.toLocaleString()} streams
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#10b981',
                          display: 'block'
                        }}
                      >
                        ${Number(o.royalties ?? o.revenue_usd ?? 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographic Distribution */}
            <div
              style={{
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '3px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <h4
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#fff',
                  margin: '0 0 16px'
                }}
              >
                Top Territorial Markets
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(stats?.territories || [
                  { country: 'Kenya', streams: 54100 },
                  { country: 'United States', streams: 38200 },
                  { country: 'United Kingdom', streams: 22100 },
                  { country: 'Nigeria', streams: 18400 },
                  { country: 'Germany', streams: 11470 }
                ]).map((c, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '13px'
                    }}
                  >
                    <span style={{ color: '#fff' }}>{c.country}</span>
                    <span style={{ color: '#f59e0b', fontWeight: 700 }}>
                      {c.streams?.toLocaleString()} plays
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Admin Central Store Queue & Overrides */}
      {activeSubTab === 'admin' && activePersona === 'admin' && (
        <div
          className="glass-panel"
          style={{
            padding: '28px',
            borderRadius: '3px',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            marginBottom: '32px',
            background:
              'radial-gradient(ellipse at top right, rgba(168, 85, 247, 0.08), rgba(6, 8, 19, 0.7) 70%)'
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <span
              style={{
                fontSize: '11px',
                color: '#c084fc',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              SECURED ADMIN DISPATCH ENGINE
            </span>
            <h3
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#fff',
                margin: '4px 0 8px',
                fontFamily: 'Sansation, sans-serif'
              }}
            >
              Global Store Queue &amp; Delivery Overrides
            </h3>
            <p style={{ color: 'var(--mu)', fontSize: '13px', margin: 0 }}>
              Authorized administrators can review platform-wide DDEX XML transmissions, verify delivery ACKs from DSPs, and manually force store status overrides.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '12.5px'
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--mu)',
                    fontSize: '11px',
                    textTransform: 'uppercase'
                  }}
                >
                  <th style={{ padding: '10px 12px' }}>Release</th>
                  <th style={{ padding: '10px 12px' }}>Artist</th>
                  <th style={{ padding: '10px 12px' }}>Stores In Queue</th>
                  <th style={{ padding: '10px 12px' }}>Overall State</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>
                    Admin Override Controls
                  </th>
                </tr>
              </thead>
              <tbody>
                {(adminPipeline?.pipeline || filteredReleases).map((p) => (
                  <tr
                    key={p._id || p.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td style={{ padding: '12px', fontWeight: 700, color: '#fff' }}>
                      {p.title}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--mu)' }}>
                      {p.artist}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ color: 'var(--cyan)' }}>
                        {(p.stores || []).length} stores configured
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '3px',
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#f59e0b',
                          fontWeight: 700
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          gap: '6px',
                          alignItems: 'center'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleAdminOverride(p._id || p.id, 'all', 'delivered')
                          }
                          className="btn-secondary"
                          style={{
                            padding: '4px 10px',
                            fontSize: '11px',
                            color: '#10b981',
                            borderColor: 'rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          Approve All Stores
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleAdminOverride(p._id || p.id, 'all', 'failed')
                          }
                          className="btn-secondary"
                          style={{
                            padding: '4px 10px',
                            fontSize: '11px',
                            color: '#ef4444',
                            borderColor: 'rgba(239, 68, 68, 0.3)'
                          }}
                        >
                          Reject / Halt
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showDistributeModal && (
        <DistributeReleaseModal
          isOpen={showDistributeModal}
          onClose={() => setShowDistributeModal(false)}
          onSuccess={() => {
            setShowDistributeModal(false);
            loadData();
          }}
          supportedOutlets={outlets}
          initialArtist={sessionUser?.artist_name || 'Ndufo'}
          persona={activePersona}
        />
      )}

      {showBulkModal && (
        <BulkDeliverModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          onSuccess={() => {
            setShowBulkModal(false);
            loadData();
          }}
          releases={releases}
          supportedOutlets={outlets}
        />
      )}

      {ddexModalRelease && (
        <DdexSheetModal
          isOpen={!!ddexModalRelease}
          onClose={() => setDdexModalRelease(null)}
          releaseId={ddexModalRelease._id}
          releaseTitle={ddexModalRelease.title}
        />
      )}
          {contractDraft && (
        <ContractDrawer
          contract={contractDraft}
          onClose={() => setContractDraft(null)}
          onUpdated={(next) => setContractDraft(next)}
          sessionUser={sessionUser}
        />
      )}
    </div>
  );
}
