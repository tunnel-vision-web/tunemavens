import React, { useState, useEffect, useRef } from 'react';
import {
  RiFileTextFill, RiShieldCheckFill, RiCoinsFill, RiAddLine,
  RiCheckLine, RiCloseLine, RiSearchLine, RiFilterLine,
  RiExternalLinkFill, RiPrinterLine, RiMailSendLine, RiTimeLine,
  RiUserSharedLine, RiArrowRightLine, RiArrowLeftLine, RiInformationLine,
  RiAlertFill, RiDeleteBin6Line, RiEditLine, RiSparklingLine,
  RiDownload2Line, RiLockFill, RiGlobalFill, RiCompass3Line
} from 'react-icons/ri';
import { getUnifiedCatalog } from '../../data/authoritativeCatalog.js';

// Pre-seeded authentic contract repository conforming to COMPENSATION_AND_CONTRACTS.md
export const DEFAULT_MY_CONTRACTS = [
  {
    id: 'cnt_pub_001',
    contractNumber: 'TM-PUB-2026-0814',
    title: 'Tunemavens Publishing Administration Agreement — Ndufo',
    category: 'publishing',
    dealType: 'standard_admin',
    dealTypeLabel: 'Standard Publishing Administration (§2.1)',
    status: 'executed',
    createdAt: '2026-04-10T10:30:00Z',
    effectiveDate: '2026-04-15',
    termLength: '2 Years (Auto-Renewing)',
    territory: 'Worldwide',
    linkedTrackTitle: 'Nairobi Cyberwave (Deluxe LP)',
    isrc: 'KE-TM1-26-00042',
    iswc: 'T-938.411.002-8',
    financialSummary: "Writer retains 100% of Writer's Share (50% gross). Publisher Share split 50/50 between Tunemavens & Creator.",
    advanceAmount: 0,
    recoupmentRate: 'N/A (No upfront debt)',
    crossCollateralized: false,
    escrowAmount: 0,
    escrowStatus: 'none',
    parties: {
      party1: {
        name: 'Ndufo (Creator)',
        role: 'Songwriter / Composer',
        email: 'ndufo@soundwavestudios.com',
        signed: true,
        signedAt: '2026-04-12T14:22:10Z',
        signatureStamp: 'SIG-SHA256-9b8e21a4-NDUFO',
        ipAddress: '197.232.88.14'
      },
      party2: {
        name: 'Tunemavens Publishing Ltd',
        role: 'Publishing Administrator',
        email: 'publishing@tunemavens.com',
        signed: true,
        signedAt: '2026-04-12T16:05:44Z',
        signatureStamp: 'SIG-SHA256-4c11f72a-TM-PUB',
        ipAddress: '41.204.180.2'
      }
    },
    clauses: [
      { id: 'cl_1', title: '1. Retention of Writer’s Share', text: 'Songwriter retains one hundred percent (100%) of the Writer’s Share of public performance and mechanical royalties (representing 50% of total publishing proceeds). Under no circumstances shall Tunemavens claim any portion of the Writer’s Share.', type: 'locked' },
      { id: 'cl_2', title: '2. Publisher’s Share Split', text: 'All collected Publisher’s Share income shall be divided fifty percent (50%) to Tunemavens Publishing Ltd for worldwide collection administration and fifty percent (50%) directly to Creator as self-publisher.', type: 'locked' },
      { id: 'cl_3', title: '3. Zero Cross-Collateralization', text: 'Any future production advances or promotional balances shall be strictly isolated to individual releases. Debts shall not be recouped against Creator earnings from separate works.', type: 'locked' },
      { id: 'cl_4', title: '4. Creator Audit Rights', text: 'Creator shall have the absolute right upon thirty (30) days notice to inspect and audit Tunemavens books, DDEX collection playlogs, and CMO disbursement ledgers.', type: 'negotiable' }
    ],
    auditTrail: [
      { timestamp: '2026-04-10 10:30 UTC', action: 'Draft engagement generated via Intermaven Legal Automation Engine', author: 'System' },
      { timestamp: '2026-04-10 10:35 UTC', action: 'Contract dispatched to Ndufo (ndufo@soundwavestudios.com)', author: 'System' },
      { timestamp: '2026-04-12 14:22 UTC', action: 'Digital signature authenticated by Ndufo (IP: 197.232.88.14)', author: 'Ndufo' },
      { timestamp: '2026-04-12 16:05 UTC', action: 'Counter-signed by Tunemavens Publishing Admin (IP: 41.204.180.2)', author: 'Legal Team' },
      { timestamp: '2026-04-12 16:05 UTC', action: 'Contract status marked EXECUTED & BINDING. Stored in tamper-proof vault.', author: 'Audit Ledger' }
    ]
  },
  {
    id: 'cnt_copub_002',
    contractNumber: 'TM-COPUB-2026-0441',
    title: 'Full-Service Co-Publishing & Sync Agent Agreement — Aisha Wanjiku',
    category: 'publishing',
    dealType: 'full_service_copub',
    dealTypeLabel: 'Co-Publishing & Sync Placement (§2.2)',
    status: 'pending_signatures',
    createdAt: '2026-04-14T09:15:00Z',
    effectiveDate: '2026-04-20',
    termLength: '3 Years',
    territory: 'Worldwide',
    linkedTrackTitle: 'Mombasa Sunset Soul',
    isrc: 'KE-TM1-26-00046',
    iswc: 'T-938.411.006-2',
    financialSummary: '50/50 Co-Publishing Split • Active TV/Film Pitching • $1,500 Recoupable Production Advance.',
    advanceAmount: 1500,
    recoupmentRate: '100% of Publisher’s Share Net Receipts until fully recouped',
    crossCollateralized: false,
    escrowAmount: 0,
    escrowStatus: 'none',
    parties: {
      party1: {
        name: 'Aisha Wanjiku',
        role: 'Singer-Songwriter / Producer',
        email: 'aisha@soundwavestudios.com',
        signed: false,
        signedAt: null,
        signatureStamp: null,
        ipAddress: null
      },
      party2: {
        name: 'Soundwave Studios & Tunemavens Co-Pub',
        role: 'Co-Publisher & Sync Agent',
        email: 'marcus@soundwavestudios.com',
        signed: true,
        signedAt: '2026-04-14T11:00:20Z',
        signatureStamp: 'SIG-SHA256-7a912b3c-SOUNDWAVE',
        ipAddress: '41.204.180.2'
      }
    },
    clauses: [
      { id: 'cl_1', title: '1. Co-Publishing Joint Interest', text: 'Publisher’s Share is held jointly 50/50 between Co-Publishing Administrator and Creator. Songwriter maintains 100% of the independent Writer’s Share.', type: 'locked' },
      { id: 'cl_2', title: '2. Active Placement Obligation', text: 'Tunemavens and Soundwave Studios agree to actively pitch the Master and Composition for television, film, advertisement, and gaming sync licensing opportunities across their supervisor network.', type: 'locked' },
      { id: 'cl_3', title: '3. Recoupable Advance Terms', text: 'The one-time production advance of $1,500 USD shall be recoupable exclusively from Publisher’s Share net receipts generated by this specific composition. Zero cross-collateralization against other catalog releases.', type: 'locked' },
      { id: 'cl_4', title: '4. Writer & Production Credit Addendum', text: 'Melody and top-line credit allocated seventy percent (70%) to Aisha Wanjiku and thirty percent (30%) to sound design collaborators as registered in the linked split sheet.', type: 'negotiable' }
    ],
    auditTrail: [
      { timestamp: '2026-04-14 09:15 UTC', action: 'Co-Publishing engagement spun up by Soundwave Studios (A&R Desk)', author: 'Marcus Vance' },
      { timestamp: '2026-04-14 11:00 UTC', action: 'Digitally pre-signed by Marcus Vance, A&R Director', author: 'Marcus Vance' },
      { timestamp: '2026-04-14 11:05 UTC', action: 'Dispatched for electronic signature to Aisha Wanjiku (aisha@soundwavestudios.com)', author: 'System' }
    ]
  },
  {
    id: 'cnt_sync_003',
    contractNumber: 'SM-SYNC-2026-1088',
    title: 'Master & Sync Synchronization License — "Resonance" (Netflix Cyberpunk Series)',
    category: 'sync',
    dealType: 'sync_licensing',
    dealTypeLabel: 'Direct TV/Film Sync License (SyncMavens)',
    status: 'escrow_held',
    createdAt: '2026-04-11T12:00:00Z',
    effectiveDate: '2026-04-16',
    termLength: '5 Years Worldwide Media',
    territory: 'Worldwide',
    linkedTrackTitle: 'Resonance',
    isrc: 'KE-TM1-26-00050',
    iswc: 'T-938.411.010-4',
    financialSummary: '$25,000 Upfront Buyout held in Escrow • 30% Agency Fee • 25% Admin Fee • 52.5% Net Creator Pool ($13,125).',
    advanceAmount: 0,
    recoupmentRate: 'Zero Recoupment (Direct Upfront Buyout)',
    crossCollateralized: false,
    escrowAmount: 25000,
    escrowStatus: 'held',
    escrowMilestone: 'Episode 4 Soundstage Final Master Delivery & Cue Sheet Filing',
    parties: {
      party1: {
        name: 'Aether Echo (Creator / Master Owner)',
        role: 'Licensor',
        email: 'aether@tunemavens.com',
        signed: true,
        signedAt: '2026-04-11T14:10:00Z',
        signatureStamp: 'SIG-SHA256-32d184bf-AETHER',
        ipAddress: '105.160.44.8'
      },
      party2: {
        name: 'Apex Visuals LLC (Netflix Production Unit)',
        role: 'Licensee / Music Supervisor',
        email: 'elena.rostova@apexvisuals.com',
        signed: true,
        signedAt: '2026-04-11T15:30:22Z',
        signatureStamp: 'SIG-SHA256-88ab12e0-APEX',
        ipAddress: '198.51.100.45'
      }
    },
    clauses: [
      { id: 'cl_1', title: '1. Grant of Synchronization Rights', text: 'Licensor grants to Licensee the non-exclusive, worldwide right to synchronize the Master Recording and underlying Composition in timed relation with visual images in the television production currently titled "Untitled Cyberpunk Drama" (Episode 104).', type: 'locked' },
      { id: 'cl_2', title: '2. Escrow Protection & Milestone Disbursal', text: 'The full license consideration of $25,000 USD is currently deposited in Intermaven Escrow Vault. Funds shall disburse automatically according to the SyncMavens split waterfall upon submission of the final broadcast cue sheet.', type: 'locked' },
      { id: 'cl_3', title: '3. Split Waterfall Allocation', text: 'Gross consideration waterfalls as follows: thirty percent (30%) to Agency Placement Partner; twenty-five percent (25%) of remaining net to SyncMavens Admin; remaining 52.5% ($13,125 USD) directly to Licensor wallet.', type: 'locked' }
    ],
    auditTrail: [
      { timestamp: '2026-04-11 12:00 UTC', action: 'Sync brief matched and license generated via SyncMavens Marketplace', author: 'Elena Rostova' },
      { timestamp: '2026-04-11 14:10 UTC', action: 'Approved and signed by Licensor Aether Echo', author: 'Aether Echo' },
      { timestamp: '2026-04-11 15:30 UTC', action: 'Countersigned by Elena Rostova, Music Supervisor. Deposit of $25,000 locked in Escrow Vault.', author: 'Escrow Engine' }
    ]
  },
  {
    id: 'cnt_split_004',
    contractNumber: 'TM-SPLIT-2026-0931',
    title: 'In-Studio Master & Publishing Split Sheet — "Rift Valley Soundscapes"',
    category: 'splitsheet',
    dealType: 'split_sheet',
    dealTypeLabel: 'Digital Studio Split Sheet (§9.36.5)',
    status: 'executed',
    createdAt: '2026-04-08T16:00:00Z',
    effectiveDate: '2026-04-08',
    termLength: 'In Perpetuity',
    territory: 'Worldwide',
    linkedTrackTitle: 'Rift Valley Soundscapes',
    isrc: 'KE-TM1-26-00043',
    iswc: 'T-938.411.003-9',
    financialSummary: '100% Dynamic Collaborator Pool: Ndufo (50%), Brian Omondi (30%), Elena Rostova (20%).',
    advanceAmount: 0,
    recoupmentRate: 'N/A',
    crossCollateralized: false,
    escrowAmount: 0,
    escrowStatus: 'none',
    parties: {
      party1: {
        name: 'Ndufo',
        role: 'Lead Artist / Primary Composer (50%)',
        email: 'ndufo@soundwavestudios.com',
        signed: true,
        signedAt: '2026-04-08T16:15:00Z',
        signatureStamp: 'SIG-SHA256-44c11b-NDUFO',
        ipAddress: '197.232.88.14'
      },
      party2: {
        name: 'Brian Omondi',
        role: 'Beat Producer / Arranger (30%)',
        email: 'brian@soundwavestudios.com',
        signed: true,
        signedAt: '2026-04-08T16:20:00Z',
        signatureStamp: 'SIG-SHA256-99ff22-BRIAN',
        ipAddress: '197.232.88.22'
      },
      additionalParties: [
        {
          name: 'Elena Rostova',
          role: 'Sound Engineer / Additional Synths (20%)',
          email: 'elena@soundwavestudios.com',
          signed: true,
          signedAt: '2026-04-08T16:25:00Z',
          signatureStamp: 'SIG-SHA256-11da88-ELENA',
          ipAddress: '41.204.180.2'
        }
      ]
    },
    clauses: [
      { id: 'cl_1', title: '1. Irrevocable Split Allocation', text: 'All sound recording master royalties and writer-share performance income collected globally shall be distributed strictly as follows: Ndufo (50.00%), Brian Omondi (30.00%), Elena Rostova (20.00%). Sum equals exactly 100%.', type: 'locked' },
      { id: 'cl_2', title: '2. Warranty of Originality', text: 'Each collaborator warrants that their individual contribution (composition, top-line, stem recording) is original and does not infringe upon any third-party intellectual property or uncleared samples.', type: 'locked' },
      { id: 'cl_3', title: '3. Automatic TuneLedger Linkage', text: 'These percentages are cryptographically locked in TuneLedger for automated multi-currency cascade payouts via M-Pesa and Stripe Express.', type: 'locked' }
    ],
    auditTrail: [
      { timestamp: '2026-04-08 16:00 UTC', action: 'In-studio split session created on soundstage iPad console', author: 'Ndufo' },
      { timestamp: '2026-04-08 16:15 UTC', action: 'Signed by Ndufo (50%)', author: 'Ndufo' },
      { timestamp: '2026-04-08 16:20 UTC', action: 'Signed by Brian Omondi (30%)', author: 'Brian Omondi' },
      { timestamp: '2026-04-08 16:25 UTC', action: 'Signed by Elena Rostova (20%). 100% quorum reached. Agreement LOCKED.', author: 'Audit Ledger' }
    ]
  },
  {
    id: 'cnt_escrow_005',
    contractNumber: 'TM-ESCROW-2026-1502',
    title: 'Artist Live Appearance & Performance Contract — Blankets & Wine Nairobi',
    category: 'escrow',
    dealType: 'appearance_escrow',
    dealTypeLabel: 'Live Performance Booking with Milestone Escrow (Phase 8)',
    status: 'escrow_held',
    createdAt: '2026-04-12T08:00:00Z',
    effectiveDate: '2026-07-15',
    termLength: 'Single Event Engagement',
    territory: 'Ngong Racecourse, Nairobi, KE',
    linkedTrackTitle: 'Nairobi Cyberwave Live Showcase',
    isrc: 'KE-TM1-26-00042',
    iswc: 'T-938.411.002-8',
    financialSummary: '$1,500.00 Performance Fee secured in Escrow. Released automatically upon venue GPS arrival & soundcheck.',
    advanceAmount: 0,
    recoupmentRate: 'N/A',
    crossCollateralized: false,
    escrowAmount: 1500,
    escrowStatus: 'held',
    escrowMilestone: 'Festival Soundcheck Check-In (GPS Verified: Ngong Racecourse)',
    parties: {
      party1: {
        name: 'Ndufo (Performing Artist)',
        role: 'Headlining Artist',
        email: 'ndufo@soundwavestudios.com',
        signed: true,
        signedAt: '2026-04-12T09:30:00Z',
        signatureStamp: 'SIG-SHA256-11f802-NDUFO',
        ipAddress: '197.232.88.14'
      },
      party2: {
        name: 'Blankets & Wine Festivals Ltd',
        role: 'Event Promoter / Venue',
        email: 'bookings@blanketsandwine.com',
        signed: true,
        signedAt: '2026-04-12T10:15:00Z',
        signatureStamp: 'SIG-SHA256-77e419-BW-FEST',
        ipAddress: '102.135.168.10'
      }
    },
    clauses: [
      { id: 'cl_1', title: '1. Guaranteed Performance Fee', text: 'Promoter guarantees artist appearance compensation of $1,500 USD, held in third-party escrow by Intermaven Network Treasury until performance conditions are verified.', type: 'locked' },
      { id: 'cl_2', title: '2. Milestone Release Verification', text: 'Escrow shall be released directly to Artist payout balance upon either: (a) Artist GPS geolocation check-in at Ngong Racecourse on event date, or (b) Promoter soundcheck sign-off in the TuneMavens mobile client.', type: 'locked' },
      { id: 'cl_3', title: '3. Technical & Hospitality Rider', text: 'Promoter agrees to supply Pioneer CDJ-3000 decks, active subwoofers, green room hospitality, and 4 VIP access credentials.', type: 'negotiable' }
    ],
    auditTrail: [
      { timestamp: '2026-04-12 08:00 UTC', action: 'Appearance contract generated via Promoter Booking Suite', author: 'Blankets & Wine' },
      { timestamp: '2026-04-12 09:30 UTC', action: 'Signed by Artist Ndufo', author: 'Ndufo' },
      { timestamp: '2026-04-12 10:15 UTC', action: 'Promoter deposited $1,500 into Intermaven Escrow. Contract active and locked.', author: 'Escrow Engine' }
    ]
  },
  {
    id: 'cnt_dist_006',
    contractNumber: 'TM-DIST-2026-0120',
    title: 'Tunemavens Native Digital Distribution Agreement — Brian Omondi',
    category: 'distribution',
    dealType: 'tunemavens_native',
    dealTypeLabel: 'Tunemavens Native Rev-Share Distribution (§3.2)',
    status: 'executed',
    createdAt: '2026-04-05T11:00:00Z',
    effectiveDate: '2026-04-05',
    termLength: '1 Year (Non-Exclusive)',
    territory: 'Worldwide Digital Service Providers',
    linkedTrackTitle: 'Amapiano Starlight',
    isrc: 'KE-TM1-26-00048',
    iswc: 'T-938.411.008-5',
    financialSummary: 'Tunemavens 45% / Creator 55% of net distribution revenue. Non-exclusive, no lock-in.',
    advanceAmount: 0,
    recoupmentRate: 'Zero Recoupment',
    crossCollateralized: false,
    escrowAmount: 0,
    escrowStatus: 'none',
    parties: {
      party1: {
        name: 'Brian Omondi',
        role: 'Creator / Independent Producer',
        email: 'brian@soundwavestudios.com',
        signed: true,
        signedAt: '2026-04-05T11:20:00Z',
        signatureStamp: 'SIG-SHA256-022ab3-BRIAN',
        ipAddress: '197.232.88.22'
      },
      party2: {
        name: 'TuneMavens Global Distribution',
        role: 'Digital Distributor',
        email: 'distro@tunemavens.com',
        signed: true,
        signedAt: '2026-04-05T11:35:00Z',
        signatureStamp: 'SIG-SHA256-88cf11-TMDIST',
        ipAddress: '41.204.180.2'
      }
    },
    clauses: [
      { id: 'cl_1', title: '1. Net Revenue Distribution Split', text: 'Net streaming receipts collected from Apple Music, Spotify, Deezer, TikTok, and Boomplay shall be divided: Fifty-Five Percent (55%) directly to Creator and Forty-Five Percent (45%) to TuneMavens.', type: 'locked' },
      { id: 'cl_2', title: '2. Non-Exclusive Catalog Freedom', text: 'Creator retains full master ownership and non-exclusive freedom. Takedowns may be initiated at any time with forty-eight (48) hours notice.', type: 'locked' },
      { id: 'cl_3', title: '3. Automated Statement Ingestion', text: 'DSP playlogs and mechanical payouts settle automatically into Creator’s TuneLedger wallet every monthly billing cycle.', type: 'locked' }
    ],
    auditTrail: [
      { timestamp: '2026-04-05 11:00 UTC', action: 'Distribution agreement initiated upon track delivery', author: 'System' },
      { timestamp: '2026-04-05 11:20 UTC', action: 'Signed by Creator Brian Omondi', author: 'Brian Omondi' },
      { timestamp: '2026-04-05 11:35 UTC', action: 'Countersigned by TuneMavens Distribution QA Officer. Track pushed to DDEX pipeline.', author: 'Distro Ops' }
    ]
  }
];

export default function MyContractsPanel({
  sessionUser,
  payoutBalance = 0,
  setPayoutBalance,
  setActiveTab
}) {
  // Main contracts list state with localStorage persistence
  const [contracts, setContracts] = useState(() => {
    try {
      const stored = localStorage.getItem('tunemavens_mycontracts_list');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return DEFAULT_MY_CONTRACTS;
  });

  // Filter and search state
  const [activeCategory, setActiveCategory] = useState('all'); // all, publishing, distribution, sync, splitsheet, escrow
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, executed, escrow
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showSpinUpModal, setShowSpinUpModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  // E-Sign canvas / form state
  const [signName, setSignName] = useState(sessionUser?.name || 'Verified Signatory');
  const [signRole, setSignRole] = useState(sessionUser?.role === 'label' ? 'Label Administrator' : 'Artist / Rights Holder');
  const [signConsent, setSignConsent] = useState(false);
  const [signMode, setSignMode] = useState('typed'); // 'typed' or 'draw'
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // New Contract Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const catalogTracks = getUnifiedCatalog();
  const [wizardCategory, setWizardCategory] = useState('publishing');
  const [wizardDealType, setWizardDealType] = useState('standard_admin');
  const [wizardTitle, setWizardTitle] = useState('');
  const [wizardTrack, setWizardTrack] = useState(catalogTracks[0]?.title || 'Nairobi Cyberwave (Deluxe LP)');
  const [wizardParty2Name, setWizardParty2Name] = useState('');
  const [wizardParty2Email, setWizardParty2Email] = useState('');
  const [wizardParty2Role, setWizardParty2Role] = useState('Co-Publisher / Counterparty');
  const [wizardAdvance, setWizardAdvance] = useState(0);
  const [wizardEscrowAmount, setWizardEscrowAmount] = useState(0);
  const [wizardEscrowMilestone, setWizardEscrowMilestone] = useState('');
  const [wizardCustomNotes, setWizardCustomNotes] = useState('');
  const [wizardError, setWizardError] = useState('');

  // Save contracts to localStorage and dispatch event
  useEffect(() => {
    try {
      localStorage.setItem('tunemavens_mycontracts_list', JSON.stringify(contracts));
      window.dispatchEvent(new CustomEvent('tunemavens:contract_updated', { detail: contracts }));
    } catch (_) {}
  }, [contracts]);

  // Handle Canvas Drawing for E-Sign
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#22d3ee';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // Execute E-Signing of Selected Contract
  const handleExecuteSign = (e) => {
    e.preventDefault();
    if (!signConsent) {
      alert('Please check the statutory electronic signature consent checkbox to execute.');
      return;
    }
    if (signMode === 'draw' && !hasDrawn) {
      alert('Please draw your signature in the signature box before submitting.');
      return;
    }

    if (!selectedContract) return;

    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
    const signatureHash = `SIG-SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${signName.replace(/[^A-Za-z0-9]/g, '').substring(0, 8).toUpperCase()}`;

    // Update contract party status
    setContracts(prev => prev.map(c => {
      if (c.id !== selectedContract.id) return c;

      // Determine which party is signing
      const isParty1 = !c.parties.party1.signed;
      const updatedParty1 = isParty1 ? {
        ...c.parties.party1,
        name: signName.trim(),
        role: signRole.trim(),
        signed: true,
        signedAt: timestamp,
        signatureStamp: signatureHash,
        ipAddress: '197.232.88.14 (Verified Session)'
      } : c.parties.party1;

      const isParty2 = !isParty1 && !c.parties.party2.signed;
      const updatedParty2 = isParty2 ? {
        ...c.parties.party2,
        name: signName.trim(),
        role: signRole.trim(),
        signed: true,
        signedAt: timestamp,
        signatureStamp: signatureHash,
        ipAddress: '41.204.180.2 (Verified Session)'
      } : c.parties.party2;

      // Check if all parties are now signed
      const allSigned = updatedParty1.signed && updatedParty2.signed;
      const newStatus = allSigned ? (c.escrowAmount > 0 ? 'escrow_held' : 'executed') : 'pending_signatures';

      const newAuditEntry = {
        timestamp: formattedDate,
        action: `Digitally executed and signed by ${signName.trim()} (${signRole.trim()}). Stamp: ${signatureHash}`,
        author: signName.trim()
      };

      const updatedContract = {
        ...c,
        status: newStatus,
        parties: {
          ...c.parties,
          party1: updatedParty1,
          party2: updatedParty2
        },
        auditTrail: [...c.auditTrail, newAuditEntry]
      };

      setSelectedContract(updatedContract);
      return updatedContract;
    }));

    setShowSignModal(false);
    alert(`Contract Successfully Signed!\n\nDocument: ${selectedContract.contractNumber}\nSignatory: ${signName}\nDigital Seal: ${signatureHash}\n\nThis agreement is recorded and binding across the Intermaven network.`);
  };

  // Milestone Escrow Release Handler
  const handleReleaseEscrow = (contract) => {
    if (!window.confirm(`Release $${contract.escrowAmount.toLocaleString()} USD from escrow to Creator Split Waterfall?\n\nMilestone: "${contract.escrowMilestone}" will be formally registered as Complete.`)) {
      return;
    }

    const releaseAmount = contract.escrowAmount;

    setContracts(prev => prev.map(c => {
      if (c.id !== contract.id) return c;
      return {
        ...c,
        status: 'executed',
        escrowStatus: 'released',
        auditTrail: [
          ...c.auditTrail,
          {
            timestamp: new Date().toLocaleString('en-US', { timeZoneName: 'short' }),
            action: `Milestone Verified: "${c.escrowMilestone}". Escrow funds ($${releaseAmount.toLocaleString()} USD) released to creator split ledger.`,
            author: sessionUser?.name || 'Authorized Supervisor'
          }
        ]
      };
    }));

    // Increment payout balance if setter is available
    if (typeof setPayoutBalance === 'function') {
      setPayoutBalance(prev => prev + releaseAmount);
    }

    // Trigger platform-wide event
    window.dispatchEvent(new CustomEvent('tunemavens:payout_updated', { detail: { added: releaseAmount, reason: `Escrow release: ${contract.contractNumber}` } }));

    alert(`Escrow Funds Released Successfully!\n\nAmount: $${releaseAmount.toLocaleString()} USD\nMilestone: "${contract.escrowMilestone}" is verified.\nFunds have been waterfalled into creator wallet ledgers.`);
  };

  // Spin Up New Engagement Submit
  const handleSpinUpSubmit = (e) => {
    e.preventDefault();
    setWizardError('');

    if (!wizardParty2Name.trim() || !wizardParty2Email.trim()) {
      setWizardError('Please provide counterparty full legal name and contact email.');
      return;
    }

    const matchedTrack = catalogTracks.find(t => t.title === wizardTrack) || catalogTracks[0];
    const contractNum = `TM-${wizardCategory.toUpperCase().substring(0, 4)}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newContractObj = {
      id: `cnt_${Date.now()}`,
      contractNumber: contractNum,
      title: wizardTitle.trim() || `${wizardDealTypeLabel(wizardDealType)} — ${matchedTrack.artist}`,
      category: wizardCategory,
      dealType: wizardDealType,
      dealTypeLabel: wizardDealTypeLabel(wizardDealType),
      status: 'pending_signatures',
      createdAt: new Date().toISOString(),
      effectiveDate: new Date().toISOString().split('T')[0],
      termLength: wizardCategory === 'sync' ? '5 Years Media' : wizardCategory === 'escrow' ? 'Single Event' : '2 Years (Auto-Renewing)',
      territory: 'Worldwide',
      linkedTrackTitle: matchedTrack.title,
      isrc: matchedTrack.isrc || `KE-TM1-26-000${Math.floor(10 + Math.random() * 89)}`,
      iswc: `T-938.411.0${Math.floor(10 + Math.random() * 89)}-${Math.floor(Math.random() * 9)}`,
      financialSummary: generateFinancialSummary(wizardCategory, wizardDealType, wizardAdvance, wizardEscrowAmount),
      advanceAmount: Number(wizardAdvance) || 0,
      recoupmentRate: Number(wizardAdvance) > 0 ? '100% of publisher net receipts' : 'N/A',
      crossCollateralized: false,
      escrowAmount: Number(wizardEscrowAmount) || 0,
      escrowStatus: Number(wizardEscrowAmount) > 0 ? 'held' : 'none',
      escrowMilestone: wizardEscrowMilestone.trim() || (Number(wizardEscrowAmount) > 0 ? 'Delivery Acceptance & Verification' : 'N/A'),
      parties: {
        party1: {
          name: sessionUser?.name || 'Verified Creator',
          role: sessionUser?.role === 'label' ? 'Record Label / Licensor' : 'Artist / Songwriter',
          email: sessionUser?.email || 'creator@soundwavestudios.com',
          signed: true,
          signedAt: new Date().toISOString(),
          signatureStamp: `SIG-SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-INITIATOR`,
          ipAddress: '197.232.88.14'
        },
        party2: {
          name: wizardParty2Name.trim(),
          role: wizardParty2Role.trim() || 'Counterparty',
          email: wizardParty2Email.trim(),
          signed: false,
          signedAt: null,
          signatureStamp: null,
          ipAddress: null
        }
      },
      clauses: generateClauses(wizardCategory, wizardDealType, wizardAdvance, wizardEscrowAmount),
      auditTrail: [
        {
          timestamp: new Date().toLocaleString('en-US', { timeZoneName: 'short' }),
          action: `Engagement contract spun up by ${sessionUser?.name || 'Initiator'}. Dispatched to ${wizardParty2Email.trim()}.`,
          author: sessionUser?.name || 'System'
        }
      ]
    };

    setContracts(prev => [newContractObj, ...prev]);
    setShowSpinUpModal(false);
    setWizardStep(1);
    setWizardParty2Name('');
    setWizardParty2Email('');
    setWizardTitle('');
    setWizardAdvance(0);
    setWizardEscrowAmount(0);

    alert(`Engagement Contract Successfully Spun Up!\n\nContract #: ${contractNum}\nTitle: ${newContractObj.title}\nDispatched to: ${newContractObj.parties.party2.email}\nStatus: PENDING SIGNATURE`);
  };

  function wizardDealTypeLabel(type) {
    switch (type) {
      case 'standard_admin': return 'Standard Publishing Administration (§2.1)';
      case 'full_service_copub': return 'Full-Service Co-Publishing & Sync (§2.2)';
      case 'catalogue_acquisition': return 'Catalogue Acquisition / Advance (§2.3)';
      case 'standard_fee_matched': return 'Flat-Fee Digital Distribution (§3.1)';
      case 'tunemavens_native': return 'Tunemavens Native Rev-Share 55/45 (§3.2)';
      case 'label_negotiated': return 'Label Negotiated Imprint Agreement (§3.3)';
      case 'sync_licensing': return 'Direct Film/TV Synchronization License';
      case 'split_sheet': return 'In-Studio Digital Split Sheet';
      case 'appearance_escrow': return 'Artist Performance Milestone Escrow';
      default: return 'Music Business Engagement Contract';
    }
  }

  function generateFinancialSummary(category, type, advance, escrow) {
    if (category === 'publishing') {
      if (type === 'standard_admin') return '100% Writer Share retained. Publisher Share split 50/50 between Tunemavens & Creator.';
      if (type === 'full_service_copub') return `50/50 Co-Pub split • Active TV/Film Pitching • $${Number(advance).toLocaleString()} Recoupable Advance.`;
      return `Catalogue acquisition • $${Number(advance).toLocaleString()} Advance • 100% isolated recoupment.`;
    }
    if (category === 'distribution') {
      if (type === 'standard_fee_matched') return 'Flat service fee • Creator retains 100% of all DSP streaming royalties.';
      return 'Tunemavens 45% / Creator 55% net distribution revenue • Zero upfront lock-in.';
    }
    if (category === 'sync') {
      return `$${Number(escrow || 15000).toLocaleString()} License Buyout held in Escrow • 30% Agency • 25% Admin • 52.5% Net Creator Pool.`;
    }
    if (category === 'escrow') {
      return `$${Number(escrow || 1500).toLocaleString()} Performance Guarantee held in Escrow • Released upon venue check-in.`;
    }
    return '100% Collaborator Pool • Locked multi-currency split cascade.';
  }

  function generateClauses(category, type, advance, escrow) {
    return [
      { id: 'cl_1', title: '1. Principal Commercial Terms', text: 'All sound recording and musical composition rights herein are administered strictly according to the agreed financial breakdown without hidden deductions.', type: 'locked' },
      { id: 'cl_2', title: '2. Strict Zero Cross-Collateralization', text: 'In accordance with Intermaven standards, any advance or production debt is strictly ring-fenced to this specific release. Under no circumstance may debts be recouped from unrelated creator works.', type: 'locked' },
      { id: 'cl_3', title: '3. Digital Ledger & Instant Payouts', text: 'All settled earnings waterfall automatically into recipient digital wallets via M-Pesa B2C and Stripe Express with full immutable audit trails.', type: 'locked' },
      { id: 'cl_4', title: '4. Representation & Warranties', text: 'Parties represent that they have full legal capacity to enter into this agreement and that supplied sound recordings and musical works are unencumbered.', type: 'negotiable' }
    ];
  }

  // Filtered contracts
  const filteredContracts = contracts.filter(c => {
    // Category match
    if (activeCategory !== 'all' && c.category !== activeCategory) return false;

    // Status filter
    if (statusFilter === 'pending' && c.status !== 'pending_signatures') return false;
    if (statusFilter === 'executed' && c.status !== 'executed') return false;
    if (statusFilter === 'escrow' && c.escrowStatus !== 'held') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (c.title || '').toLowerCase().includes(q);
      const matchNum = (c.contractNumber || '').toLowerCase().includes(q);
      const matchTrack = (c.linkedTrackTitle || '').toLowerCase().includes(q);
      const matchParty = (c.parties.party1.name + ' ' + c.parties.party2.name).toLowerCase().includes(q);
      const matchIsrc = (c.isrc || '').toLowerCase().includes(q);
      if (!matchTitle && !matchNum && !matchTrack && !matchParty && !matchIsrc) return false;
    }

    return true;
  });

  // Calculate Metrics
  const totalContracts = contracts.length;
  const pendingCount = contracts.filter(c => c.status === 'pending_signatures').length;
  const executedCount = contracts.filter(c => c.status === 'executed').length;
  const totalEscrowHeld = contracts
    .filter(c => c.escrowStatus === 'held')
    .reduce((acc, c) => acc + (Number(c.escrowAmount) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} data-testid="mycontracts-system-panel">
      {/* Top Header Bar */}
      <div className="dashboard-panel-header" style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: '#0ea5e9',
                color: '#ffffff',
                padding: '3px 8px',
                borderRadius: '3px'
              }}>
                Smart Contract &amp; Legal Vault
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>•</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
                Intermaven Legal Protocol
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>MyContracts</span>
              <span style={{ fontSize: '13px', background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee', border: '1px solid rgba(34, 211, 238, 0.3)', padding: '2px 8px', borderRadius: '3px', fontWeight: 700 }}>
                E-Sign &amp; Escrow
              </span>
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, maxWidth: '780px' }}>
              Every engagement spins up binding legal contracts sent directly to each party and signable within the app. Fully compliant with DOCUMENTATION.md §9 and COMPENSATION_AND_CONTRACTS.md with zero cross-collateralization.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setShowSpinUpModal(true);
                setWizardStep(1);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#0ea5e9',
                color: '#ffffff',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '3px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              data-testid="spin-up-contract-btn"
            >
              <RiAddLine size={16} />
              <span>+ Spin Up New Contract</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
        <div style={{ background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Total Engagements
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
            {totalContracts}
          </div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RiCheckLine size={13} />
            <span>Vault Indexed</span>
          </div>
        </div>

        <div style={{ background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#eab308', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Awaiting Signatures
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#eab308', marginTop: '6px' }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            Action required to execute
          </div>
        </div>

        <div style={{ background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Fully Executed &amp; Binding
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>
            {executedCount}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            Locked with digital seals
          </div>
        </div>

        <div style={{ background: '#0a0f1d', border: '1px solid rgba(14, 165, 233, 0.25)', borderRadius: '3px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Secured in Escrow
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
            ${totalEscrowHeld.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            Milestone release protected
          </div>
        </div>
      </div>

      {/* Control Bar: Categories Filter & Search */}
      <div style={{ background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Contracts' },
              { id: 'publishing', label: 'Publishing (§2)' },
              { id: 'distribution', label: 'Distribution (§3)' },
              { id: 'sync', label: 'Sync Placement' },
              { id: 'splitsheet', label: 'Studio Split Sheets' },
              { id: 'escrow', label: 'Gig Escrow' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '3px',
                  border: 'none',
                  background: activeCategory === tab.id ? '#0ea5e9' : 'transparent',
                  color: activeCategory === tab.id ? '#ffffff' : '#94a3b8',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>STATUS:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'pending', label: 'Awaiting Signatures' },
              { id: 'executed', label: 'Executed' },
              { id: 'escrow', label: 'Escrow Held' }
            ].map(st => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFilter(st.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '3px',
                  border: `1px solid ${statusFilter === st.id ? '#22d3ee' : 'rgba(255,255,255,0.08)'}`,
                  background: statusFilter === st.id ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                  color: statusFilter === st.id ? '#22d3ee' : '#94a3b8',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Bar */}
        <div style={{ position: 'relative' }}>
          <RiSearchLine size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by contract title, contract number, artist, collaborator, or ISRC..."
            className="form-control"
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              fontSize: '12.5px',
              background: '#050814',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '3px',
              color: '#ffffff'
            }}
          />
        </div>
      </div>

      {/* Contracts List / Card Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredContracts.length === 0 ? (
          <div style={{ background: '#0a0f1d', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '3px', padding: '40px', textAlign: 'center' }}>
            <RiFileTextFill size={36} style={{ color: '#64748b', marginBottom: '10px' }} />
            <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#ffffff' }}>No matching contracts found</h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
              Try adjusting your category tabs or search keywords, or spin up a new agreement.
            </p>
          </div>
        ) : (
          filteredContracts.map(contract => {
            const isExecuted = contract.status === 'executed';
            const isPending = contract.status === 'pending_signatures';
            const isEscrowHeld = contract.escrowStatus === 'held';
            const hasEscrow = contract.escrowAmount > 0;

            // Check if current user needs to sign
            const party1Signed = contract.parties.party1.signed;
            const party2Signed = contract.parties.party2.signed;

            return (
              <div
                key={contract.id}
                style={{
                  background: '#0a0f1d',
                  border: isEscrowHeld ? '1px solid rgba(14, 165, 233, 0.4)' : isPending ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '3px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  transition: 'border-color 0.15s ease'
                }}
                data-testid={`contract-row-${contract.id}`}
              >
                {/* Header row: Number, Category, Status badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#ffffff',
                      background: '#1e293b',
                      padding: '3px 8px',
                      borderRadius: '3px',
                      letterSpacing: '0.6px'
                    }}>
                      {contract.contractNumber}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#38bdf8',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      padding: '2px 7px',
                      borderRadius: '3px'
                    }}>
                      {contract.dealTypeLabel}
                    </span>
                    {contract.crossCollateralized === false && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#10b981',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        padding: '2px 6px',
                        borderRadius: '3px'
                      }}>
                        Zero Cross-Collateral
                      </span>
                    )}
                  </div>

                  <div>
                    {isExecuted && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#10b981',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid #10b981',
                        padding: '4px 10px',
                        borderRadius: '3px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <RiShieldCheckFill size={13} />
                        <span>Executed &amp; Binding</span>
                      </span>
                    )}
                    {isPending && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#eab308',
                        background: 'rgba(234, 179, 8, 0.15)',
                        border: '1px solid #eab308',
                        padding: '4px 10px',
                        borderRadius: '3px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <RiTimeLine size={13} />
                        <span>Awaiting Signatures</span>
                      </span>
                    )}
                    {isEscrowHeld && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#38bdf8',
                        background: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid #38bdf8',
                        padding: '4px 10px',
                        borderRadius: '3px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <RiLockFill size={13} />
                        <span>In Escrow Hold (${contract.escrowAmount.toLocaleString()})</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Core Summary */}
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0' }}>
                    {contract.title}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {contract.financialSummary}
                  </div>
                </div>

                {/* Metadata Strip: Linked Track, ISRC, Territory */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '11.5px', color: '#94a3b8', background: '#050814', padding: '10px 14px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Linked Work:</span>{' '}
                    <strong style={{ color: '#ffffff' }}>{contract.linkedTrackTitle}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>ISRC:</span>{' '}
                    <code style={{ color: '#22d3ee', background: 'rgba(34,211,238,0.1)', padding: '1px 5px', borderRadius: '2px' }}>{contract.isrc}</code>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Term:</span>{' '}
                    <span style={{ color: '#ffffff' }}>{contract.termLength}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Territory:</span>{' '}
                    <span style={{ color: '#ffffff' }}>{contract.territory}</span>
                  </div>
                </div>

                {/* Parties Execution Status */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                  {/* Party 1 */}
                  <div style={{ background: '#050814', padding: '10px 12px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Party 1 (Initiator)
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#f1f5f9' }}>{contract.parties.party1.name}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{contract.parties.party1.role}</div>
                      </div>
                      <div>
                        {party1Signed ? (
                          <span style={{ fontSize: '10.5px', color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '2px 6px', borderRadius: '3px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <RiCheckLine size={12} /> Signed
                          </span>
                        ) : (
                          <span style={{ fontSize: '10.5px', color: '#eab308', background: 'rgba(234,179,8,0.15)', padding: '2px 6px', borderRadius: '3px', fontWeight: 700 }}>
                            Pending Sign
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Party 2 */}
                  <div style={{ background: '#050814', padding: '10px 12px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Party 2 (Counterparty)
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#f1f5f9' }}>{contract.parties.party2.name}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{contract.parties.party2.role}</div>
                      </div>
                      <div>
                        {party2Signed ? (
                          <span style={{ fontSize: '10.5px', color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '2px 6px', borderRadius: '3px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <RiCheckLine size={12} /> Signed
                          </span>
                        ) : (
                          <span style={{ fontSize: '10.5px', color: '#eab308', background: 'rgba(234,179,8,0.15)', padding: '2px 6px', borderRadius: '3px', fontWeight: 700 }}>
                            Pending Sign
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestone Banner (if escrow active) */}
                {isEscrowHeld && (
                  <div style={{ background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.25)', padding: '12px 14px', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RiLockFill size={16} style={{ color: '#38bdf8' }} />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9' }}>
                          Milestone Required: {contract.escrowMilestone}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          ${contract.escrowAmount.toLocaleString()} USD held in treasury escrow until completion sign-off.
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleReleaseEscrow(contract)}
                      style={{
                        background: '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '3px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Verify Milestone &amp; Release Escrow
                    </button>
                  </div>
                )}

                {/* Action Controls Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedContract(contract);
                        setShowReaderModal(true);
                      }}
                      style={{
                        background: '#1e293b',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '6px 12px',
                        borderRadius: '3px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <RiFileTextFill size={13} style={{ color: '#38bdf8' }} />
                      <span>Read Full Contract</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedContract(contract);
                        setShowAuditModal(true);
                      }}
                      style={{
                        background: 'transparent',
                        color: '#94a3b8',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '6px 12px',
                        borderRadius: '3px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <RiTimeLine size={13} />
                      <span>Audit Trail</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isPending && (!party1Signed || !party2Signed) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedContract(contract);
                          setSignName(sessionUser?.name || 'Verified Signatory');
                          setSignRole(sessionUser?.role === 'label' ? 'Label Administrator' : 'Artist / Rights Holder');
                          setSignConsent(false);
                          setShowSignModal(true);
                        }}
                        style={{
                          background: '#0ea5e9',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '3px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <RiEditLine size={13} />
                        <span>Sign Within App</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const recipient = party1Signed ? contract.parties.party2.email : contract.parties.party1.email;
                        alert(`Agreement Link Dispatched!\n\nSent secure electronic signature link to: ${recipient}\nContract: ${contract.contractNumber}`);
                      }}
                      style={{
                        background: '#1e293b',
                        color: '#94a3b8',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '6px 12px',
                        borderRadius: '3px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                      title="Resend invitation link to counterparty"
                    >
                      <RiMailSendLine size={13} />
                      <span>Resend Invite</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= MODAL 1: SPIN UP NEW ENGAGEMENT WIZARD ================= */}
      {showSpinUpModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 7, 18, 0.88)',
          backdropFilter: 'blur(8px)',
          zIndex: 100005,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#090e24',
            border: '1px solid rgba(14, 165, 233, 0.35)',
            borderRadius: '3px',
            maxWidth: '620px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiSparklingLine size={18} style={{ color: '#0ea5e9' }} />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#fff' }}>Spin Up Engagement Contract</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSpinUpModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            {/* Stepper Progress */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
              {[
                { step: 1, label: '1. Deal Template' },
                { step: 2, label: '2. Parties & Counterparty' },
                { step: 3, label: '3. Commercial Terms' },
                { step: 4, label: '4. Review & Dispatch' }
              ].map(s => (
                <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: wizardStep === s.step ? '#0ea5e9' : wizardStep > s.step ? '#10b981' : '#1e293b',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {wizardStep > s.step ? '✓' : s.step}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: wizardStep === s.step ? 700 : 500, color: wizardStep === s.step ? '#ffffff' : '#64748b' }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {wizardError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '3px', fontSize: '12px', marginBottom: '14px' }}>
                {wizardError}
              </div>
            )}

            <form onSubmit={handleSpinUpSubmit}>
              {/* STEP 1: Deal Template */}
              {wizardStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                      Select Engagement Category
                    </label>
                    <select
                      value={wizardCategory}
                      onChange={(e) => {
                        const cat = e.target.value;
                        setWizardCategory(cat);
                        if (cat === 'publishing') setWizardDealType('standard_admin');
                        if (cat === 'distribution') setWizardDealType('tunemavens_native');
                        if (cat === 'sync') setWizardDealType('sync_licensing');
                        if (cat === 'splitsheet') setWizardDealType('split_sheet');
                        if (cat === 'escrow') setWizardDealType('appearance_escrow');
                      }}
                      className="form-control"
                      style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '3px' }}
                    >
                      <option value="publishing">Music Publishing &amp; Administration (§2)</option>
                      <option value="distribution">Digital Audio Distribution (§3)</option>
                      <option value="sync">Sync Licensing &amp; Placement (SyncMavens)</option>
                      <option value="splitsheet">Studio Master &amp; Composition Split Sheet (§9.36.5)</option>
                      <option value="escrow">Live Appearance Booking &amp; Milestone Escrow (Phase 8)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                      Contract Template Variant (Per COMPENSATION_AND_CONTRACTS.md)
                    </label>
                    <select
                      value={wizardDealType}
                      onChange={(e) => setWizardDealType(e.target.value)}
                      className="form-control"
                      style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '3px' }}
                    >
                      {wizardCategory === 'publishing' && (
                        <>
                          <option value="standard_admin">Template 2.1: Standard Publishing Administration (50/50 Pub Admin, 100% Writer Retained)</option>
                          <option value="full_service_copub">Template 2.2: Full-Service Co-Publishing &amp; Sync Agent (Writer Addendum + Recoupables)</option>
                          <option value="catalogue_acquisition">Template 2.3: Catalogue Acquisition / Advance Agreement</option>
                        </>
                      )}
                      {wizardCategory === 'distribution' && (
                        <>
                          <option value="standard_fee_matched">Template 3.1: Flat-Fee Distribution (100% DSP Streaming Royalty Retained)</option>
                          <option value="tunemavens_native">Template 3.2: Tunemavens Native 55/45 Revenue Share</option>
                          <option value="label_negotiated">Template 3.3: Record Label Negotiated Distribution</option>
                        </>
                      )}
                      {wizardCategory === 'sync' && (
                        <>
                          <option value="sync_licensing">Master &amp; Sync License: Film, Television &amp; Gaming Buyout</option>
                          <option value="agency_sync">Agency Partner Guaranteed Placement Agreement</option>
                        </>
                      )}
                      {wizardCategory === 'splitsheet' && (
                        <>
                          <option value="split_sheet">Studio Master &amp; Publishing Split Sheet (100% Dynamic Quorum)</option>
                        </>
                      )}
                      {wizardCategory === 'escrow' && (
                        <>
                          <option value="appearance_escrow">Live Appearance Booking Agreement with Milestone Escrow</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                      Contract Descriptive Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={wizardTitle}
                      onChange={(e) => setWizardTitle(e.target.value)}
                      placeholder="e.g. Master Co-Publishing Agreement — Soundwave Studios &amp; Ndufo"
                      className="form-control"
                      style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '3px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '3px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <span>Continue to Parties</span>
                      <RiArrowRightLine size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Parties */}
              {wizardStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ background: '#050814', padding: '12px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Party 1 (Initiator / You)</div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>{sessionUser?.name || 'Verified Creator'}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{sessionUser?.email || 'creator@soundwavestudios.com'}</div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                      Counterparty Legal / Entity Name *
                    </label>
                    <input
                      type="text"
                      value={wizardParty2Name}
                      onChange={(e) => setWizardParty2Name(e.target.value)}
                      placeholder="e.g. Marcus Vance / Elena Rostova / Netflix Studios"
                      className="form-control"
                      style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '3px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                      Counterparty Work Email *
                    </label>
                    <input
                      type="email"
                      value={wizardParty2Email}
                      onChange={(e) => setWizardParty2Email(e.target.value)}
                      placeholder="e.g. collaborator@soundwavestudios.com"
                      className="form-control"
                      style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '3px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                      Counterparty Contractual Role
                    </label>
                    <input
                      type="text"
                      value={wizardParty2Role}
                      onChange={(e) => setWizardParty2Role(e.target.value)}
                      placeholder="e.g. Co-Publisher, Beat Producer, Music Supervisor, Promoter"
                      className="form-control"
                      style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '3px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '8px 16px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <RiArrowLeftLine size={14} />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!wizardParty2Name.trim() || !wizardParty2Email.trim()) {
                          setWizardError('Please provide counterparty legal name and email.');
                          return;
                        }
                        setWizardError('');
                        setWizardStep(3);
                      }}
                      style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '3px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <span>Continue to Terms</span>
                      <RiArrowRightLine size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Commercial Terms & Linked Works */}
              {wizardStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                      Select Associated Catalog Work (ISRC Autocomplete)
                    </label>
                    <select
                      value={wizardTrack}
                      onChange={(e) => setWizardTrack(e.target.value)}
                      className="form-control"
                      style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '3px' }}
                    >
                      {catalogTracks.map(t => (
                        <option key={t.id} value={t.title}>
                          {t.title} — {t.artist} ({t.isrc || 'ISRC Cleared'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {wizardCategory === 'publishing' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                        Recoupable Advance Amount (USD, Isolated per release)
                      </label>
                      <input
                        type="number"
                        value={wizardAdvance}
                        onChange={(e) => setWizardAdvance(e.target.value)}
                        placeholder="0"
                        className="form-control"
                        style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '3px' }}
                      />
                      <span style={{ fontSize: '11px', color: '#10b981', marginTop: '2px', display: 'block' }}>
                        Strictly Zero Cross-Collateralization: Recoupable only from this release’s receipts.
                      </span>
                    </div>
                  )}

                  {(wizardCategory === 'sync' || wizardCategory === 'escrow') && (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                          Escrow Consideration / Guarantee Deposit (USD)
                        </label>
                        <input
                          type="number"
                          value={wizardEscrowAmount}
                          onChange={(e) => setWizardEscrowAmount(e.target.value)}
                          placeholder="e.g. 5000"
                          className="form-control"
                          style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '3px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                          Milestone Release Trigger
                        </label>
                        <input
                          type="text"
                          value={wizardEscrowMilestone}
                          onChange={(e) => setWizardEscrowMilestone(e.target.value)}
                          placeholder="e.g. Broadcast Cue Sheet Approval / Soundcheck Check-In"
                          className="form-control"
                          style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '3px' }}
                        />
                      </div>
                    </>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '8px 16px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <RiArrowLeftLine size={14} />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(4)}
                      style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '3px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <span>Review &amp; Finalize</span>
                      <RiArrowRightLine size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Dispatch */}
              {wizardStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ background: '#050814', padding: '14px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
                      Engagement Specification Summary
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                      {wizardTitle || `${wizardDealTypeLabel(wizardDealType)}`}
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '6px' }}>
                      <strong>Parties:</strong> {sessionUser?.name || 'Initiator'} ↔ {wizardParty2Name} ({wizardParty2Email})
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>
                      <strong>Linked Work:</strong> {wizardTrack}
                    </div>
                    {Number(wizardAdvance) > 0 && (
                      <div style={{ fontSize: '12px', color: '#10b981', marginTop: '2px' }}>
                        <strong>Advance:</strong> ${Number(wizardAdvance).toLocaleString()} USD (Zero Cross-Collateral)
                      </div>
                    )}
                    {Number(wizardEscrowAmount) > 0 && (
                      <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '2px' }}>
                        <strong>Escrow Deposit:</strong> ${Number(wizardEscrowAmount).toLocaleString()} USD (Milestone: {wizardEscrowMilestone || 'Completion Verification'})
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>
                    Upon dispatching, Party 1 (you) will automatically execute your electronic signature. Party 2 will immediately receive an email notification containing their unique access link to sign within the app.
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '8px 16px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <RiArrowLeftLine size={14} />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      style={{ background: '#10b981', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '3px', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <RiCheckLine size={16} />
                      <span>Execute &amp; Dispatch Contract</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: E-SIGN CONTRACT IN-APP ================= */}
      {showSignModal && selectedContract && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 7, 18, 0.9)',
          backdropFilter: 'blur(8px)',
          zIndex: 100006,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#090e24',
            border: '1px solid rgba(14, 165, 233, 0.4)',
            borderRadius: '3px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.95)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiEditLine size={18} style={{ color: '#0ea5e9' }} />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#fff' }}>Digital Signature Execution</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSignModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            <div style={{ background: '#050814', padding: '12px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>DOCUMENT TO EXECUTE:</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                {selectedContract.title} ({selectedContract.contractNumber})
              </div>
              <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '2px' }}>
                {selectedContract.dealTypeLabel}
              </div>
            </div>

            <form onSubmit={handleExecuteSign} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  Legal Signatory Full Name *
                </label>
                <input
                  type="text"
                  value={signName}
                  onChange={(e) => setSignName(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '3px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  Signatory Title / Capacity *
                </label>
                <input
                  type="text"
                  value={signRole}
                  onChange={(e) => setSignRole(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '3px' }}
                  required
                />
              </div>

              {/* Mode Toggle: Draw vs Type */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1' }}>
                    Signature Method
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setSignMode('typed')}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '3px',
                        border: 'none',
                        background: signMode === 'typed' ? '#0ea5e9' : '#1e293b',
                        color: signMode === 'typed' ? '#ffffff' : '#94a3b8',
                        fontSize: '10.5px',
                        cursor: 'pointer'
                      }}
                    >
                      Styled Font
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignMode('draw')}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '3px',
                        border: 'none',
                        background: signMode === 'draw' ? '#0ea5e9' : '#1e293b',
                        color: signMode === 'draw' ? '#ffffff' : '#94a3b8',
                        fontSize: '10.5px',
                        cursor: 'pointer'
                      }}
                    >
                      Draw Digital Signature
                    </button>
                  </div>
                </div>

                {signMode === 'typed' ? (
                  <div style={{
                    background: '#050814',
                    border: '1px dashed rgba(34, 211, 238, 0.4)',
                    padding: '20px',
                    borderRadius: '3px',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      fontFamily: "'Brush Script MT', 'Dancing Script', cursive",
                      fontSize: '32px',
                      color: '#22d3ee',
                      letterSpacing: '1px'
                    }}>
                      {signName || 'Your Signature'}
                    </span>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '6px' }}>
                      CRYPTOGRAPHICALLY BOUND TO SHA-256 SESSION ID
                    </div>
                  </div>
                ) : (
                  <div>
                    <canvas
                      ref={canvasRef}
                      width={470}
                      height={120}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      style={{
                        background: '#050814',
                        border: '1px dashed rgba(34, 211, 238, 0.4)',
                        borderRadius: '3px',
                        cursor: 'crosshair',
                        width: '100%',
                        height: '120px'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '10.5px', cursor: 'pointer' }}
                      >
                        Clear Canvas
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Legal Acknowledgment */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '3px' }}>
                <input
                  type="checkbox"
                  id="signConsent"
                  checked={signConsent}
                  onChange={(e) => setSignConsent(e.target.checked)}
                  style={{ marginTop: '2px', cursor: 'pointer' }}
                  required
                />
                <label htmlFor="signConsent" style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.4, cursor: 'pointer' }}>
                  I confirm that I am legally authorized to enter into this agreement. I agree that my electronic signature constitutes an authentic, legally binding signature under the Electronic Transactions Act and Intermaven Network Protocol.
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowSignModal(false)}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '8px 16px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '3px', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <RiShieldCheckFill size={14} />
                  <span>Affix Signature &amp; Execute</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: FULL LEGAL CONTRACT READER ================= */}
      {showReaderModal && selectedContract && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 7, 18, 0.92)',
          backdropFilter: 'blur(8px)',
          zIndex: 100005,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            color: '#0f172a',
            borderRadius: '3px',
            maxWidth: '780px',
            width: '100%',
            padding: '40px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Document Header & Print Tool */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  INTERMAVEN NETWORK LEGAL PROTOCOL • MYCONTRACTS
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>
                  {selectedContract.title}
                </h2>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Document Reference: <strong>{selectedContract.contractNumber}</strong> • Effective Date: {selectedContract.effectiveDate}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '6px 12px', borderRadius: '3px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <RiPrinterLine size={14} />
                  <span>Print Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowReaderModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <RiCloseLine size={24} />
                </button>
              </div>
            </div>

            {/* Contract Body */}
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#334155', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>PREAMBLE &amp; PARTIES</h4>
                <p style={{ margin: 0 }}>
                  THIS AGREEMENT is entered into on <strong>{selectedContract.effectiveDate}</strong> by and between:
                  <br />
                  <strong>PARTY 1 (Initiator):</strong> {selectedContract.parties.party1.name}, designated as <em>{selectedContract.parties.party1.role}</em> ({selectedContract.parties.party1.email}); and
                  <br />
                  <strong>PARTY 2 (Counterparty):</strong> {selectedContract.parties.party2.name}, designated as <em>{selectedContract.parties.party2.role}</em> ({selectedContract.parties.party2.email}).
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>SCHEDULE OF WORKS (LINKED REPERTOIRE)</h4>
                <p style={{ margin: 0 }}>
                  This agreement strictly governs the following sound recording and underlying composition:
                  <br />
                  • <strong>Track Title:</strong> {selectedContract.linkedTrackTitle}
                  <br />
                  • <strong>ISRC:</strong> {selectedContract.isrc} | <strong>ISWC:</strong> {selectedContract.iswc}
                  <br />
                  • <strong>Territory:</strong> {selectedContract.territory} | <strong>Term:</strong> {selectedContract.termLength}
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>FINANCIAL SPLIT &amp; WATERFALL SETTLEMENT</h4>
                <p style={{ margin: 0 }}>
                  {selectedContract.financialSummary}
                  <br />
                  Recoupable Advance: <strong>${selectedContract.advanceAmount.toLocaleString()} USD</strong> | Recoupment Rate: <strong>{selectedContract.recoupmentRate}</strong>.
                  <br />
                  <strong>Zero Cross-Collateralization Clause:</strong> All parties acknowledge that debts incurred under this schedule are strictly ring-fenced to {selectedContract.linkedTrackTitle}. No proceeds from other creator catalog items shall be withheld.
                </p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>CORE OPERATIVE CLAUSES</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedContract.clauses.map(c => (
                    <div key={c.id} style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '3px', border: '1px solid #e2e8f0' }}>
                      <strong style={{ color: '#0f172a', display: 'block', marginBottom: '2px' }}>{c.title}</strong>
                      <span style={{ fontSize: '12.5px' }}>{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution Signatures Box */}
              <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '20px', marginTop: '10px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>ELECTRONIC SIGNATURE EXECUTION BLOCKS</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {/* Party 1 Signature */}
                  <div style={{ border: '1px solid #cbd5e1', padding: '14px', borderRadius: '3px', background: '#f8fafc' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>FOR PARTY 1:</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{selectedContract.parties.party1.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{selectedContract.parties.party1.role}</div>
                    <div style={{ marginTop: '10px', minHeight: '36px' }}>
                      {selectedContract.parties.party1.signed ? (
                        <div>
                          <span style={{ fontFamily: 'cursive', fontSize: '20px', color: '#0284c7' }}>
                            {selectedContract.parties.party1.name}
                          </span>
                          <div style={{ fontSize: '10px', color: '#10b981', marginTop: '2px' }}>
                            ✓ Digital Seal: {selectedContract.parties.party1.signatureStamp}
                          </div>
                          <div style={{ fontSize: '9.5px', color: '#64748b' }}>
                            Signed: {selectedContract.parties.party1.signedAt} (IP: {selectedContract.parties.party1.ipAddress})
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#eab308', fontStyle: 'italic' }}>Pending Signature</span>
                      )}
                    </div>
                  </div>

                  {/* Party 2 Signature */}
                  <div style={{ border: '1px solid #cbd5e1', padding: '14px', borderRadius: '3px', background: '#f8fafc' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>FOR PARTY 2:</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{selectedContract.parties.party2.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{selectedContract.parties.party2.role}</div>
                    <div style={{ marginTop: '10px', minHeight: '36px' }}>
                      {selectedContract.parties.party2.signed ? (
                        <div>
                          <span style={{ fontFamily: 'cursive', fontSize: '20px', color: '#0284c7' }}>
                            {selectedContract.parties.party2.name}
                          </span>
                          <div style={{ fontSize: '10px', color: '#10b981', marginTop: '2px' }}>
                            ✓ Digital Seal: {selectedContract.parties.party2.signatureStamp}
                          </div>
                          <div style={{ fontSize: '9.5px', color: '#64748b' }}>
                            Signed: {selectedContract.parties.party2.signedAt} (IP: {selectedContract.parties.party2.ipAddress})
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#eab308', fontStyle: 'italic' }}>Pending Signature</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: AUDIT TRAIL LOG VIEWER ================= */}
      {showAuditModal && selectedContract && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 7, 18, 0.88)',
          backdropFilter: 'blur(8px)',
          zIndex: 100005,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#090e24',
            border: '1px solid rgba(14, 165, 233, 0.35)',
            borderRadius: '3px',
            maxWidth: '560px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.95)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiTimeLine size={18} style={{ color: '#0ea5e9' }} />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#fff' }}>Immutable Audit Log</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
              Document: <strong style={{ color: '#fff' }}>{selectedContract.contractNumber}</strong> • Cryptographic Timestamp Trail
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedContract.auditTrail.map((log, idx) => (
                <div key={idx} style={{ background: '#050814', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: '3px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 700 }}>{log.timestamp}</span>
                    <span style={{ fontSize: '10px', color: '#64748b', background: '#1e293b', padding: '1px 6px', borderRadius: '2px' }}>
                      {log.author}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: 1.4 }}>
                    {log.action}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: '3px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
