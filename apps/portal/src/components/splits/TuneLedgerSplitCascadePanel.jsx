import React, { useState, useMemo } from 'react';
import {
  RiCoinsFill, RiFileTextFill, RiShieldCheckFill, RiArrowRightLine,
  RiArrowLeftLine, RiEqualizerFill, RiSearchLine, RiDownloadFill, RiUploadCloud2Line,
  RiAddLine, RiDeleteBin6Line, RiEditLine, RiCloseLine, RiCheckLine,
  RiInformationLine, RiBookOpenFill, RiSmartphoneFill, RiBankCardFill,
  RiFlashlightFill, RiGlobalFill, RiDiscFill, RiTeamFill, RiLockFill,
  RiPriceTag3Fill, RiQuestionFill, RiRefreshFill, RiCheckboxCircleFill,
  RiAlertFill
} from 'react-icons/ri';

// Multi-Currency Exchange Rates relative to 1 USD
export const CURRENCY_RATES = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)', flag: '🇺🇸' },
  KES: { symbol: 'KSh ', rate: 130.0, label: 'KES (KSh)', flag: '🇰🇪' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)', flag: '🇪🇺' },
  GBP: { symbol: '£', rate: 0.78, label: 'GBP (£)', flag: '🇬🇧' }
};

// Common Music Revenue Presets
export const REVENUE_PRESETS = [
  {
    id: 'sync_commercial',
    title: 'Brand Commercial TV Sync',
    source: 'Sync Licensing',
    gross: 3500,
    recoupment: 250,
    labelPct: 20,
    desc: 'National television & streaming broadcast sync placement pre-cleared via SyncMavens.'
  },
  {
    id: 'dsp_streaming_quarter',
    title: 'Q1 Global DSP Streaming Statement',
    source: 'DSP Streaming',
    gross: 1850,
    recoupment: 0,
    labelPct: 15,
    desc: 'Aggregate mechanical & master payout from Spotify, Apple Music, Deezer, and Boomplay.'
  },
  {
    id: 'live_dj_tip_pool',
    title: 'Live DJ Set Direct Tip Stream',
    source: 'TuneStream Tips',
    gross: 650,
    recoupment: 0,
    labelPct: 0,
    desc: 'Direct fan micro-tips and lossless track unlock fees collected during TuneStream live performance.'
  },
  {
    id: 'pos_merch_settlement',
    title: 'Tour Merch & Vinyl POS Settlement',
    source: 'TunePay POS',
    gross: 4200,
    recoupment: 600,
    labelPct: 10,
    desc: 'M-Pesa Tap-to-Pay and contactless card terminal sales from Nairobi live tour stop.'
  }
];

// Collaborator Split Presets
export const COLLAB_PRESETS = {
  equal_duo: {
    name: '50/50 Equal Partnership',
    splits: [
      { id: 'col_1', name: 'Primary Artist', email: 'artist@tunemavens.com', role: 'Lead Vocalist / Songwriter', pct: 50 },
      { id: 'col_2', name: 'Beat Producer', email: 'producer@soundwavestudios.com', role: 'Track Producer / Composer', pct: 50 }
    ]
  },
  producer_split: {
    name: 'Standard Producer Agreement (60/25/15)',
    splits: [
      { id: 'col_1', name: 'Primary Artist', email: 'artist@tunemavens.com', role: 'Lead Artist / Performer', pct: 60 },
      { id: 'col_2', name: 'Track Producer', email: 'producer@soundwavestudios.com', role: 'Beatmaker / Instrumentalist', pct: 25 },
      { id: 'col_3', name: 'Co-Songwriter', email: 'writer@tunemavens.com', role: 'Lyricist / Topliner', pct: 15 }
    ]
  },
  feature_heavy: {
    name: 'Featured Guest Artist Deal (70/30)',
    splits: [
      { id: 'col_1', name: 'Primary Artist', email: 'artist@tunemavens.com', role: 'Main Artist', pct: 70 },
      { id: 'col_2', name: 'Featured Guest', email: 'guest@tunemavens.com', role: 'Featured Artist', pct: 30 }
    ]
  },
  solo_full: {
    name: '100% Solo Self-Contained',
    splits: [
      { id: 'col_1', name: 'Primary Artist', email: 'artist@tunemavens.com', role: 'Writer, Producer & Performer', pct: 100 }
    ]
  }
};

// Educational University Articles
export const ROYALTY_GUIDES = [
  {
    id: 'master_vs_publishing',
    title: 'Master Rights vs. Publishing Rights',
    tag: 'Foundational Music Law',
    readTime: '3 min read',
    summary: 'Every recorded song embodies two entirely separate legal copyrights: the Sound Recording (Master) and the Musical Composition (Publishing).',
    content: `When a track streams or lands a sync placement, royalties flow through two distinct legal funnels:
1. **The Master Rights (Sound Recording):** Owned by whoever funded or recorded the master audio (the independent artist or record label). This collects digital streaming master revenue, physical sales, and master sync fees.
2. **The Publishing Rights (Composition & Lyrics):** Owned by the lyricists, songwriters, and beatmakers. This collects public performance royalties (ASCAP, BMI, MCSK) and mechanical reproduction royalties (The MLC, PRS).

**Why Split Cascade Matters:** TuneLedger isolates both rights so producers, lyricists, and performers are paid their exact designated share without one party withholding the other's legal earnings.`
  },
  {
    id: 'recoupment_rules',
    title: 'How Recoupment Works (Without Exploitation)',
    tag: 'Financial Accounting',
    readTime: '4 min read',
    summary: 'Advances are loans against future earnings. Discover how Split Cascade eliminates toxic cross-collateralization.',
    content: `In traditional major label contracts, an advance is often cross-collateralized: if Album A loses money, the label drains the profits of Album B, Album C, and your merch to cover their losses.

**The TuneLedger Standard:**
* **Isolated Track Accounting:** Recoupment is tied exclusively to the specific track or release that incurred the debt (e.g. $300 mastering budget or video production costs).
* **Transparent Thresholds:** Gross revenue pays off the recoupable balance first. The moment the threshold hits zero, 100% of the cascade immediately flows into collaborator pockets.
* **Audit-Proof Record:** Every dollar deducted towards an advance is time-stamped and signed on the immutable ledger.`
  },
  {
    id: 'statutory_compliance',
    title: 'Statutory Royalties & African CMO Integration',
    tag: 'Global Compliance',
    readTime: '3 min read',
    summary: 'How TuneMavens complies with statutory mechanical licensing and PROs like MCSK, PRISK, KAMP, and ASCAP.',
    content: `Statutory mechanical licensing ensures songwriters are compensated whenever their musical composition is reproduced or streamed.

In Kenya and East Africa, collective management organizations (**MCSK**, **PRISK**, and **KAMP**) require statutory cue sheets and verified ISRC/ISWC codes to release broadcast and public performance revenues.

TuneLedger automatically attaches verified **ISRCs** to every split cascade transaction, enabling one-click statutory export generation for CMO audits and copyright tribunals.`
  },
  {
    id: 'split_sheet_protocol',
    title: 'In-Studio Split Sheet Protocol',
    tag: 'Best Practices',
    readTime: '2 min read',
    summary: 'The golden rule of music production: sign digital split agreements before the session leaves the studio.',
    content: `90% of music copyright lawsuits happen because collaborators waited until a song went viral on TikTok or radio to argue about percentages.

**Best Practice:**
Before exporting stems or bouncing the final mix:
1. Open the **Split Sheets Vault** in TuneLedger.
2. Enter the working title and add all collaborator emails.
3. Agree on the percentage split (e.g., 50/50 or 60/25/15).
4. Send digital split confirmation vouchers. Once confirmed, the Split Cascade locks into the payout engine permanently.`
  }
];

// 5-Step Waterfall Process Definition (Bidirectional Navigation)
export const WATERFALL_STEPS = [
  {
    step: 1,
    title: 'Revenue Intake & Catalog Track',
    shortTitle: '1. Revenue Intake',
    description: 'Income stream, catalog track linkage & gross revenue',
    icon: RiCoinsFill
  },
  {
    step: 2,
    title: 'Platform Admin & Label Share',
    shortTitle: '2. Admin & Label',
    description: 'Collection admin (10%) and contractual imprint deals',
    icon: RiEqualizerFill
  },
  {
    step: 3,
    title: 'Recoupable Advance Offsets',
    shortTitle: '3. Recoupable Debt',
    description: 'Isolated track debt with zero cross-collateralization',
    icon: RiPriceTag3Fill
  },
  {
    step: 4,
    title: 'Collaborator Split Sheets',
    shortTitle: '4. Collaborator Splits',
    description: 'Allocate 100% net pool across producers, writers & performers',
    icon: RiTeamFill
  },
  {
    step: 5,
    title: 'Payout Gateway & Execution',
    shortTitle: '5. Settle Payouts',
    description: 'Select gateway (M-Pesa / Stripe) and commit cascade',
    icon: RiFlashlightFill
  }
];

// Studio Section Tabs Definition (Bidirectional Navigation)
export const STUDIO_TABS = [
  { id: 'waterfall', label: 'Interactive Waterfall Builder', icon: RiEqualizerFill },
  { id: 'ledger', label: 'TuneLedger Transactions', icon: RiFileTextFill },
  { id: 'vault', label: 'Split Sheets Vault', icon: RiLockFill },
  { id: 'importer', label: 'Statement Ingestion & CSV', icon: RiUploadCloud2Line },
  { id: 'university', label: 'Royalty University & Guide', icon: RiBookOpenFill }
];

export default function TuneLedgerSplitCascadePanel({
  sessionUser,
  tracks = [],
  ledgerRows = [],
  setLedgerRows,
  payoutBalance = 0,
  setPayoutBalance
}) {
  // Navigation View Tabs
  const [activeTab, setActiveTab] = useState('waterfall'); // 'waterfall' | 'ledger' | 'vault' | 'importer' | 'university'

  // Multi-Currency State
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const currency = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES.USD;

  // Waterfall Configurator States
  const [selectedTrackId, setSelectedTrackId] = useState(tracks[0]?.id || 'custom');
  const [customTitle, setCustomTitle] = useState('Nairobi Cyberwave (Master)');
  const [revenueSource, setRevenueSource] = useState('Sync Licensing');
  const [grossRevenueUSD, setGrossRevenueUSD] = useState(2500);
  const [platformAdminPct, setPlatformAdminPct] = useState(10); // Standard 10%
  const [labelSharePct, setLabelSharePct] = useState(20); // 20%
  const [recoupmentAmountUSD, setRecoupmentAmountUSD] = useState(200);
  const [managerFeePct, setManagerFeePct] = useState(10); // 10%
  const [payoutDestination, setPayoutDestination] = useState('mpesa'); // 'mpesa' | 'stripe'

  // Bidirectional 5-Step Waterfall Wizard State
  const [currentWaterfallStep, setCurrentWaterfallStep] = useState(1); // 1: Revenue, 2: Admin/Label, 3: Recoupment, 4: Splits, 5: Settle

  const handleNextWaterfallStep = () => {
    if (currentWaterfallStep < 5) {
      setCurrentWaterfallStep(prev => prev + 1);
    }
  };

  const handlePrevWaterfallStep = () => {
    if (currentWaterfallStep > 1) {
      setCurrentWaterfallStep(prev => prev - 1);
    }
  };

  const handleJumpToWaterfallStep = (stepNumber) => {
    setCurrentWaterfallStep(stepNumber);
  };

  const handleNextStudioTab = (currentId) => {
    const idx = STUDIO_TABS.findIndex(t => t.id === currentId);
    if (idx < STUDIO_TABS.length - 1) {
      setActiveTab(STUDIO_TABS[idx + 1].id);
    } else {
      setActiveTab(STUDIO_TABS[0].id);
    }
  };

  const handlePrevStudioTab = (currentId) => {
    const idx = STUDIO_TABS.findIndex(t => t.id === currentId);
    if (idx > 0) {
      setActiveTab(STUDIO_TABS[idx - 1].id);
    } else {
      setActiveTab(STUDIO_TABS[STUDIO_TABS.length - 1].id);
    }
  };

  // Collaborators List State
  const [collaborators, setCollaborators] = useState([
    { id: 'col_1', name: sessionUser?.name || 'Primary Artist', email: sessionUser?.email || 'artist@tunemavens.com', role: 'Lead Artist / Songwriter', pct: 60 },
    { id: 'col_2', name: 'Marcus Vance', email: 'marcus.prod@soundwavestudios.com', role: 'Track Producer & Beatmaker', pct: 25 },
    { id: 'col_3', name: 'Aisha Wanjiku', email: 'aisha.wanjiku@tunemavens.com', role: 'Co-Writer & Vocalist', pct: 15 }
  ]);

  // UI Interactive States
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStepInfo, setActiveStepInfo] = useState(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);
  const [searchLedger, setSearchLedger] = useState('');
  const [ledgerSourceFilter, setLedgerSourceFilter] = useState('ALL');
  const [showNewSplitSheetModal, setShowNewSplitSheetModal] = useState(false);

  // Statement Ingestion Simulator State
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [parsedStatementRows, setParsedStatementRows] = useState([]);
  const [isImporting, setIsImporting] = useState(false);

  // Registered Split Sheets Vault State
  const [splitSheetsVault, setSplitSheetsVault] = useState([
    {
      id: 'sheet_001',
      title: 'Nairobi Cyberwave (Master)',
      isrc: 'KE-TM1-26-00042',
      iswc: 'T-345.987.123-1',
      status: 'Locked & Verified',
      collaborators: 'Artist (60%), Producer (25%), Co-Writer (15%)',
      lastUpdated: '2026-03-01'
    },
    {
      id: 'sheet_002',
      title: 'Sunset over Rift Valley',
      isrc: 'KE-TM1-26-00043',
      iswc: 'T-345.987.123-2',
      status: 'Locked & Verified',
      collaborators: 'Artist (70%), Producer (30%)',
      lastUpdated: '2026-03-05'
    },
    {
      id: 'sheet_003',
      title: 'Afro-Synth Cascade',
      isrc: 'KE-TM1-26-00044',
      iswc: 'T-345.987.123-3',
      status: 'Pending Signature',
      collaborators: 'Artist (50%), Producer (50%)',
      lastUpdated: '2026-03-12'
    }
  ]);

  // Track selection change handler
  const handleSelectTrack = (trackId) => {
    setSelectedTrackId(trackId);
    if (trackId === 'custom') {
      setCustomTitle('Custom Release Statement');
    } else {
      const found = tracks.find(t => String(t.id) === String(trackId));
      if (found) {
        setCustomTitle(found.title);
      }
    }
  };

  // Preset loading handler
  const handleApplyPreset = (preset) => {
    setCustomTitle(preset.title);
    setRevenueSource(preset.source);
    setGrossRevenueUSD(preset.gross);
    setRecoupmentAmountUSD(preset.recoupment);
    setLabelSharePct(preset.labelPct);
  };

  // Collaborator preset handler
  const handleApplyCollabPreset = (presetKey) => {
    const preset = COLLAB_PRESETS[presetKey];
    if (preset) {
      setCollaborators(preset.splits.map(s => ({ ...s, id: `col_${Date.now()}_${Math.random()}` })));
    }
  };

  // Add collaborator
  const handleAddCollaborator = () => {
    const newCol = {
      id: `col_${Date.now()}`,
      name: 'New Collaborator',
      email: 'collaborator@tunemavens.com',
      role: 'Co-Songwriter',
      pct: 10
    };
    setCollaborators(prev => [...prev, newCol]);
  };

  // Update collaborator field
  const handleUpdateCollaborator = (id, field, value) => {
    setCollaborators(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, [field]: field === 'pct' ? Number(value) : value };
      }
      return c;
    }));
  };

  // Remove collaborator
  const handleRemoveCollaborator = (id) => {
    if (collaborators.length <= 1) {
      alert('At least one primary artist or collaborator is required.');
      return;
    }
    setCollaborators(prev => prev.filter(c => c.id !== id));
  };

  // Total collaborator percentage
  const totalCollabPct = useMemo(() => {
    return collaborators.reduce((acc, c) => acc + (Number(c.pct) || 0), 0);
  }, [collaborators]);

  // Mathematical Waterfall Calculations
  const calculations = useMemo(() => {
    const gross = Number(grossRevenueUSD) || 0;
    const commFee = gross * (platformAdminPct / 100);
    const afterComm = Math.max(0, gross - commFee);

    const labelShare = afterComm * (labelSharePct / 100);
    const afterLabel = Math.max(0, afterComm - labelShare);

    const recoupmentDeduction = Math.min(Number(recoupmentAmountUSD) || 0, afterLabel);
    const afterRecoupment = Math.max(0, afterLabel - recoupmentDeduction);

    const managerFee = afterRecoupment * (managerFeePct / 100);
    const netCollaboratorPool = Math.max(0, afterRecoupment - managerFee);

    // Individual collaborator payout amounts
    const collaboratorShares = collaborators.map(c => {
      const shareAmount = netCollaboratorPool * ((Number(c.pct) || 0) / 100);
      return {
        ...c,
        amountUSD: shareAmount,
        amountLocal: shareAmount * currency.rate
      };
    });

    const primaryArtistShare = collaboratorShares[0]?.amountUSD || 0;
    const remainingReserve = Math.max(0, netCollaboratorPool - collaboratorShares.reduce((a, b) => a + b.amountUSD, 0));

    return {
      grossUSD: gross,
      grossLocal: gross * currency.rate,
      commFeeUSD: commFee,
      commFeeLocal: commFee * currency.rate,
      labelShareUSD: labelShare,
      labelShareLocal: labelShare * currency.rate,
      recoupmentDeductionUSD: recoupmentDeduction,
      recoupmentDeductionLocal: recoupmentDeduction * currency.rate,
      managerFeeUSD: managerFee,
      managerFeeLocal: managerFee * currency.rate,
      netCollaboratorPoolUSD: netCollaboratorPool,
      netCollaboratorPoolLocal: netCollaboratorPool * currency.rate,
      primaryArtistShareUSD: primaryArtistShare,
      primaryArtistShareLocal: primaryArtistShare * currency.rate,
      remainingReserveUSD: remainingReserve,
      collaboratorShares
    };
  }, [grossRevenueUSD, platformAdminPct, labelSharePct, recoupmentAmountUSD, managerFeePct, collaborators, currency.rate]);

  // Execute the Split Cascade
  const handleExecuteCascade = () => {
    if (totalCollabPct !== 100) {
      alert(`Collaborator percentage shares currently sum to ${totalCollabPct}%. Please adjust shares to sum exactly to 100% before executing.`);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      const txId = `tx_${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];

      const newRow = {
        id: txId,
        date: dateStr,
        title: customTitle,
        source: revenueSource,
        gross: calculations.grossUSD,
        comm: calculations.commFeeUSD,
        label: calculations.labelShareUSD,
        recoupment: calculations.recoupmentDeductionUSD,
        artist: calculations.primaryArtistShareUSD,
        manager: calculations.managerFeeUSD,
        net: calculations.netCollaboratorPoolUSD,
        collaboratorsCount: collaborators.length,
        destination: payoutDestination === 'mpesa' ? 'M-Pesa Mobile Wallet (KES)' : 'Stripe Express (USD ACH)',
        status: 'processed'
      };

      if (typeof setLedgerRows === 'function') {
        setLedgerRows(prev => [newRow, ...prev]);
      }

      if (typeof setPayoutBalance === 'function') {
        setPayoutBalance(prev => prev + calculations.primaryArtistShareUSD);
      }

      setCurrentVoucher({
        ...newRow,
        collaboratorShares: calculations.collaboratorShares,
        currencySymbol: currency.symbol,
        exchangeRate: currency.rate
      });
      setShowVoucherModal(true);
    }, 1200);
  };

  // Statement Ingestion Simulation Handler
  const handleSimulateStatementUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsImporting(true);

    setTimeout(() => {
      setIsImporting(false);
      setParsedStatementRows([
        { isrc: 'KE-TM1-26-00042', title: 'Nairobi Cyberwave', source: 'Spotify (Global)', streams: '124,500', gross: 435.75, matched: true },
        { isrc: 'KE-TM1-26-00043', title: 'Sunset over Rift Valley', source: 'Apple Music (Direct)', streams: '88,200', gross: 529.20, matched: true },
        { isrc: 'KE-TM1-26-00044', title: 'Afro-Synth Cascade', source: 'Boomplay (East Africa)', streams: '310,000', gross: 310.00, matched: true },
        { isrc: 'KE-TM1-26-00045', title: 'Midnight Mara Starlight', source: 'Deezer (Europe)', streams: '45,100', gross: 180.40, matched: true }
      ]);
    }, 1000);
  };

  // Ingest batch statement into ledger
  const handleBatchIngestStatement = () => {
    if (parsedStatementRows.length === 0) return;

    const totalBatchGross = parsedStatementRows.reduce((a, b) => a + b.gross, 0);
    const txId = `batch_${Math.floor(1000 + Math.random() * 9000)}`;

    const newRow = {
      id: txId,
      date: new Date().toISOString().split('T')[0],
      title: `Batch Ingestion: ${uploadedFileName || 'DSP Statement'} (${parsedStatementRows.length} Tracks)`,
      source: 'DSP Statement',
      gross: totalBatchGross,
      comm: totalBatchGross * 0.1,
      label: totalBatchGross * 0.2,
      recoupment: 0,
      artist: totalBatchGross * 0.55,
      manager: totalBatchGross * 0.15,
      net: totalBatchGross * 0.7,
      collaboratorsCount: 3,
      destination: 'M-Pesa Mobile Wallet (KES)',
      status: 'processed'
    };

    if (typeof setLedgerRows === 'function') {
      setLedgerRows(prev => [newRow, ...prev]);
    }

    if (typeof setPayoutBalance === 'function') {
      setPayoutBalance(prev => prev + (totalBatchGross * 0.55));
    }

    alert(`Batch statement successfully ingested! ${parsedStatementRows.length} track revenues cascaded. $${(totalBatchGross * 0.55).toFixed(2)} added to your payout balance.`);
    setActiveTab('ledger');
  };

  // Export CSV of ledger rows
  const handleExportCSV = () => {
    if (!ledgerRows || ledgerRows.length === 0) {
      alert('No ledger transactions available to export.');
      return;
    }

    const headers = ['TxID', 'Date', 'Track Title', 'Source', 'Gross USD', 'Admin Comm (10%)', 'Label Share', 'Recoupment', 'Artist Share', 'Manager Fee', 'Net Pool', 'Status'];
    const csvContent = [
      headers.join(','),
      ...ledgerRows.map(r => [
        r.id,
        r.date || '2026-03-14',
        `"${r.title || 'Untitled Track'}"`,
        `"${r.source || 'General'}"`,
        (r.gross || 0).toFixed(2),
        (r.comm || 0).toFixed(2),
        (r.label || 0).toFixed(2),
        (r.recoupment || 0).toFixed(2),
        (r.artist || 0).toFixed(2),
        (r.manager || 0).toFixed(2),
        (r.net || 0).toFixed(2),
        r.status || 'processed'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TuneLedger_Split_Statements_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered ledger rows
  const filteredLedger = useMemo(() => {
    return ledgerRows.filter(row => {
      const title = row.title || '';
      const id = row.id || '';
      const matchesSearch = title.toLowerCase().includes(searchLedger.toLowerCase()) ||
                            id.toLowerCase().includes(searchLedger.toLowerCase());
      const matchesSource = ledgerSourceFilter === 'ALL' || (row.source || '').toLowerCase().includes(ledgerSourceFilter.toLowerCase());
      return matchesSearch && matchesSource;
    });
  }, [ledgerRows, searchLedger, ledgerSourceFilter]);

  // Aggregate stats
  const totalVolumeUSD = useMemo(() => {
    return ledgerRows.reduce((acc, r) => acc + (Number(r.gross) || 0), 0);
  }, [ledgerRows]);

  const totalArtistPaidUSD = useMemo(() => {
    return ledgerRows.reduce((acc, r) => acc + (Number(r.artist) || 0), 0);
  }, [ledgerRows]);

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto', color: '#f8fafc', fontFamily: 'inherit' }}>
      {/* Top Banner / Studio Header */}
      <div style={{
        background: '#090e24',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                background: '#0ea5e9',
                color: '#ffffff',
                padding: '8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <RiCoinsFill size={26} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
                    TuneLedger &amp; Split Cascade Studio
                  </h1>
                  <span style={{
                    background: '#10b981',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    State of the Art
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
                  Automated multi-tier revenue cascades, transparent collaborator split sheets, and instant multi-currency disbursements.
                </p>
              </div>
            </div>
          </div>

          {/* Currency Switcher & Payout Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Currency Selector Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0b1126',
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>CURRENCY:</span>
              {Object.keys(CURRENCY_RATES).map(cKey => {
                const cObj = CURRENCY_RATES[cKey];
                const isSelected = selectedCurrency === cKey;
                return (
                  <button
                    key={cKey}
                    type="button"
                    onClick={() => setSelectedCurrency(cKey)}
                    style={{
                      background: isSelected ? '#0ea5e9' : 'transparent',
                      color: isSelected ? '#ffffff' : '#94a3b8',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {cObj.flag} {cKey}
                  </button>
                );
              })}
            </div>

            {/* Live Payout Balance Card */}
            <div style={{
              background: '#0f172a',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '6px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
                  Available Payout Balance
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                  {currency.symbol}{(payoutBalance * currency.rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert(`Direct payout initialized! Funds will transfer to your connected ${payoutDestination === 'mpesa' ? 'M-Pesa Mobile Wallet' : 'Stripe Express Account'} within 60 seconds.`)}
                style={{
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          marginTop: '20px',
          paddingBottom: '2px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'waterfall', label: 'Interactive Waterfall Builder', icon: RiEqualizerFill },
            { id: 'ledger', label: `TuneLedger Transactions (${ledgerRows.length})`, icon: RiFileTextFill },
            { id: 'vault', label: 'Split Sheets Vault', icon: RiLockFill },
            { id: 'importer', label: 'Statement Ingestion & CSV', icon: RiUploadCloud2Line },
            { id: 'university', label: 'Royalty University & Guide', icon: RiBookOpenFill }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  background: isSelected ? '#0f172a' : 'transparent',
                  color: isSelected ? '#38bdf8' : '#94a3b8',
                  border: 'none',
                  borderBottom: isSelected ? '2px solid #0ea5e9' : '2px solid transparent',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB 1: INTERACTIVE WATERFALL BUILDER (5-STEP BIDIRECTIONAL WIZARD) ================= */}
      {activeTab === 'waterfall' && (
        <div>
          {/* Top Bidirectional Stepper Navigation Bar */}
          <div style={{
            background: '#090e24',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            padding: '16px 20px',
            marginBottom: '20px'
          }}>
            {/* Stepper Header: Current Step Title & Quick Arrow Browsers */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  background: '#0ea5e9',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  Step {currentWaterfallStep} of 5
                </span>
                <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  {WATERFALL_STEPS[currentWaterfallStep - 1].title}
                </h2>
              </div>

              {/* Quick Directional Arrows */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handlePrevWaterfallStep}
                  disabled={currentWaterfallStep === 1}
                  style={{
                    background: currentWaterfallStep === 1 ? 'rgba(255,255,255,0.04)' : '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: currentWaterfallStep === 1 ? '#475569' : '#e2e8f0',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: currentWaterfallStep === 1 ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Browse to previous step"
                >
                  <RiArrowLeftLine size={15} />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextWaterfallStep}
                  disabled={currentWaterfallStep === 5}
                  style={{
                    background: currentWaterfallStep === 5 ? 'rgba(255,255,255,0.04)' : '#0ea5e9',
                    border: 'none',
                    color: currentWaterfallStep === 5 ? '#475569' : '#ffffff',
                    padding: '6px 14px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: currentWaterfallStep === 5 ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Browse to next step"
                >
                  <span>Next</span>
                  <RiArrowRightLine size={15} />
                </button>
              </div>
            </div>

            {/* Clickable 5-Step Progress Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '8px'
            }}>
              {WATERFALL_STEPS.map((s) => {
                const isCurrent = currentWaterfallStep === s.step;
                const isCompleted = s.step < currentWaterfallStep;
                const StepIcon = s.icon;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => handleJumpToWaterfallStep(s.step)}
                    style={{
                      background: isCurrent ? '#0b1126' : '#0f172a',
                      border: `1px solid ${isCurrent ? '#0ea5e9' : isCompleted ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: '6px',
                      padding: '10px 12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: isCurrent ? '#0ea5e9' : isCompleted ? '#10b981' : '#1e293b',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {isCompleted ? '✓' : s.step}
                      </div>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        color: isCurrent ? '#38bdf8' : isCompleted ? '#10b981' : '#cbd5e1',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {s.shortTitle}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '10.5px',
                      color: isCurrent ? '#94a3b8' : '#64748b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {s.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Grid: Active Step Wizard & Visual Waterfall Companion */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
            
            {/* LEFT COLUMN: The Active Step Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* ================= STEP 1: REVENUE INTAKE & CATALOG TRACK ================= */}
              {currentWaterfallStep === 1 && (
                <div style={{ background: '#090e24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px' }}>
                  {/* Step Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ background: '#0ea5e9', color: '#fff', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800 }}>1</div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#fff' }}>Revenue Intake &amp; Catalog Track</h3>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>Specify incoming revenue stream, bind to catalog ISRC, and set gross earnings</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveStepInfo(activeStepInfo === 1 ? null : 1)}
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px' }}
                    >
                      <RiInformationLine size={15} />
                      <span>Guidance</span>
                    </button>
                  </div>

                  {activeStepInfo === 1 && (
                    <div style={{ background: '#0b1126', borderLeft: '3px solid #0ea5e9', padding: '12px 16px', borderRadius: '4px', fontSize: '12px', color: '#cbd5e1', marginBottom: '16px', lineHeight: 1.5 }}>
                      <strong style={{ color: '#fff' }}>Gross Revenue Intake:</strong> This is the total pre-tax, pre-commission dollar amount received from a licensee, DSP payout, or event merchandise sale. Binding an ISRC ensures statutory royalty tracking.
                    </div>
                  )}

                  {/* Quick Income Presets */}
                  <div style={{ background: '#0b1126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '12px 14px', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <RiFlashlightFill size={15} style={{ color: '#f59e0b' }} />
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff' }}>Quick Income Scenarios:</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {REVENUE_PRESETS.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleApplyPreset(p)}
                          style={{
                            background: '#0f172a',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#e2e8f0',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                          title={p.desc}
                        >
                          {p.title} (${p.gross.toLocaleString()})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Income Stream Source</label>
                      <select
                        value={revenueSource}
                        onChange={(e) => setRevenueSource(e.target.value)}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '9px 12px', color: '#fff', fontSize: '13px' }}
                      >
                        <option value="Sync Licensing">Sync Licensing (TV / Film / Games)</option>
                        <option value="DSP Streaming">DSP Streaming (Spotify / Apple)</option>
                        <option value="TuneStream Tips">TuneStream Tips &amp; Dubplates</option>
                        <option value="TunePay POS">TunePay POS Merch &amp; Live Tour</option>
                        <option value="Physical / Direct">Direct Digital Sale / Master Buyout</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Catalog Track Linkage</label>
                      <select
                        value={selectedTrackId}
                        onChange={(e) => handleSelectTrack(e.target.value)}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '9px 12px', color: '#fff', fontSize: '13px' }}
                      >
                        {tracks.map(t => (
                          <option key={t.id} value={t.id}>{t.title} ({t.isrc || 'ISRC Attached'})</option>
                        ))}
                        <option value="custom">+ Custom Track Title...</option>
                      </select>
                    </div>
                  </div>

                  {selectedTrackId === 'custom' && (
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Custom Release Name</label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '9px 12px', color: '#fff', fontSize: '13px' }}
                      />
                    </div>
                  )}

                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1' }}>Gross Intake Amount in USD</label>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8' }}>
                        ≈ {currency.symbol}{(grossRevenueUSD * currency.rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {selectedCurrency}
                      </span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 700 }}>$</span>
                      <input
                        type="number"
                        min="1"
                        step="50"
                        value={grossRevenueUSD}
                        onChange={(e) => setGrossRevenueUSD(Math.max(0, parseFloat(e.target.value) || 0))}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '10px 12px 10px 28px', color: '#fff', fontSize: '15px', fontWeight: 800 }}
                      />
                    </div>
                  </div>

                  {/* Step Action Navigation Footer */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: '16px'
                  }}>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Step 1 of 5: Revenue Configuration
                    </div>
                    <button
                      type="button"
                      onClick={handleNextWaterfallStep}
                      style={{
                        background: '#0ea5e9',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>Continue: Admin &amp; Label Share</span>
                      <RiArrowRightLine size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 2: PLATFORM ADMIN & LABEL SHARE ================= */}
              {currentWaterfallStep === 2 && (
                <div style={{ background: '#090e24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px' }}>
                  {/* Step Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ background: '#0ea5e9', color: '#fff', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800 }}>2</div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#fff' }}>Platform Administration &amp; Record Label Share</h3>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>Deduct standard platform collection administration and imprint contractual share</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveStepInfo(activeStepInfo === 2 ? null : 2)}
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px' }}
                    >
                      <RiInformationLine size={15} />
                      <span>Guidance</span>
                    </button>
                  </div>

                  {activeStepInfo === 2 && (
                    <div style={{ background: '#0b1126', borderLeft: '3px solid #0ea5e9', padding: '12px 16px', borderRadius: '4px', fontSize: '12px', color: '#cbd5e1', marginBottom: '16px', lineHeight: 1.5 }}>
                      <strong style={{ color: '#fff' }}>Tiers 1 &amp; 2 Deductions:</strong>
                      <br />• <strong>Platform Administration (10%):</strong> Covers DDEX delivery to 150+ DSPs, statutory mechanical licensing, and escrow processing.
                      <br />• <strong>Record Label Share (0-50%):</strong> The imprint's contractual cut for funding, distribution, or marketing investment.
                    </div>
                  )}

                  {/* 1-Click Label Presets */}
                  <div style={{ background: '#0b1126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '12px 14px', marginBottom: '18px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>1-Click Deal Presets:</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => { setPlatformAdminPct(10); setLabelSharePct(0); }}
                        style={{ background: labelSharePct === 0 ? '#0ea5e9' : '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        100% Solo Artist (0% Label)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setPlatformAdminPct(10); setLabelSharePct(15); }}
                        style={{ background: labelSharePct === 15 ? '#0ea5e9' : '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        85/15 Indie Imprint (15% Label)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setPlatformAdminPct(10); setLabelSharePct(30); }}
                        style={{ background: labelSharePct === 30 ? '#0ea5e9' : '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        70/30 Major Label Deal (30% Label)
                      </button>
                    </div>
                  </div>

                  {/* Sliders Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ background: '#0b1126', padding: '16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 700 }}>Platform Administration Fee</span>
                        <span style={{ color: '#ef4444', fontWeight: 800 }}>{platformAdminPct}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={platformAdminPct}
                        onChange={(e) => setPlatformAdminPct(parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: '#ef4444', marginBottom: '6px' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                        <span>Deduction:</span>
                        <span style={{ color: '#ef4444', fontWeight: 700 }}>-${calculations.commFeeUSD.toFixed(2)} USD</span>
                      </div>
                    </div>

                    <div style={{ background: '#0b1126', padding: '16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 700 }}>Record Label / Imprint Share</span>
                        <span style={{ color: '#ef4444', fontWeight: 800 }}>{labelSharePct}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={labelSharePct}
                        onChange={(e) => setLabelSharePct(parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: '#ef4444', marginBottom: '6px' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                        <span>Deduction:</span>
                        <span style={{ color: '#ef4444', fontWeight: 700 }}>-${calculations.labelShareUSD.toFixed(2)} USD</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Summary After Tier 1 & 2 */}
                  <div style={{ background: '#0f172a', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '6px', padding: '14px 18px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Remaining Balance After Admin &amp; Label</div>
                      <div style={{ fontSize: '17px', fontWeight: 800, color: '#38bdf8' }}>
                        ${(calculations.grossUSD - calculations.commFeeUSD - calculations.labelShareUSD).toFixed(2)} USD
                      </div>
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', textAlign: 'right' }}>
                      Flows to Recoupment &amp; Collaborator Pool
                    </div>
                  </div>

                  {/* Step Action Navigation Footer */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: '16px'
                  }}>
                    <button
                      type="button"
                      onClick={handlePrevWaterfallStep}
                      style={{
                        background: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#cbd5e1',
                        padding: '10px 18px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <RiArrowLeftLine size={16} />
                      <span>Back: Revenue Intake</span>
                    </button>

                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Step 2 of 5
                    </div>

                    <button
                      type="button"
                      onClick={handleNextWaterfallStep}
                      style={{
                        background: '#0ea5e9',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>Continue: Recoupable Debt</span>
                      <RiArrowRightLine size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 3: RECOUPABLE ADVANCE OFFSETS ================= */}
              {currentWaterfallStep === 3 && (
                <div style={{ background: '#090e24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px' }}>
                  {/* Step Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ background: '#0ea5e9', color: '#fff', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800 }}>3</div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#fff' }}>Recoupable Advance Offsets</h3>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>Offset production costs with zero cross-collateralization</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveStepInfo(activeStepInfo === 3 ? null : 3)}
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px' }}
                    >
                      <RiInformationLine size={15} />
                      <span>Guidance</span>
                    </button>
                  </div>

                  {activeStepInfo === 3 && (
                    <div style={{ background: '#0b1126', borderLeft: '3px solid #0ea5e9', padding: '12px 16px', borderRadius: '4px', fontSize: '12px', color: '#cbd5e1', marginBottom: '16px', lineHeight: 1.5 }}>
                      <strong style={{ color: '#fff' }}>How TuneLedger Recoupment Works:</strong>
                      <br />• Advances (mastering, mixing, video shoot debt) are isolated strictly to <em>this specific release</em>.
                      <br />• <strong>Zero Cross-Collateralization:</strong> Unlike legacy label contracts, this debt will never drain earnings from your other releases or merch sales.
                    </div>
                  )}

                  {/* Zero Cross-Collateralization Callout */}
                  <div style={{ background: '#0b1126', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '6px', padding: '14px 16px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <RiShieldCheckFill size={18} style={{ color: '#f59e0b' }} />
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>Isolated Per-Track Debt Protection</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>
                      Any advance specified here is recouped solely from the gross revenue of <strong style={{ color: '#fff' }}>{customTitle}</strong>. When paid off, 100% of future earnings flow immediately to the collaborator split sheets.
                    </p>
                  </div>

                  {/* Advance Input Field & Presets */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1' }}>Outstanding Recoupable Production Advance ($)</label>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b' }}>
                        Deduction: -${calculations.recoupmentDeductionUSD.toFixed(2)} USD
                      </span>
                    </div>
                    <div style={{ position: 'relative', marginBottom: '10px' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 700 }}>$</span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={recoupmentAmountUSD}
                        onChange={(e) => setRecoupmentAmountUSD(Math.max(0, parseFloat(e.target.value) || 0))}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '10px 12px 10px 28px', color: '#fff', fontSize: '14px', fontWeight: 800 }}
                        placeholder="e.g., $200 for mixing / mastering debt"
                      />
                    </div>

                    {/* Quick Preset Buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="button" onClick={() => setRecoupmentAmountUSD(0)} style={{ background: recoupmentAmountUSD === 0 ? '#10b981' : '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}>$0 (Fully Recouped)</button>
                      <button type="button" onClick={() => setRecoupmentAmountUSD(200)} style={{ background: recoupmentAmountUSD === 200 ? '#f59e0b' : '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}>$200 (Mastering)</button>
                      <button type="button" onClick={() => setRecoupmentAmountUSD(500)} style={{ background: recoupmentAmountUSD === 500 ? '#f59e0b' : '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}>$500 (Production)</button>
                      <button type="button" onClick={() => setRecoupmentAmountUSD(1000)} style={{ background: recoupmentAmountUSD === 1000 ? '#f59e0b' : '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}>$1,000 (Video Budget)</button>
                    </div>
                  </div>

                  {/* Recoupment Status Banner */}
                  <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '14px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Release Recoupment Status:</div>
                    {recoupmentAmountUSD === 0 ? (
                      <div style={{ color: '#10b981', fontSize: '13px', fontWeight: 700 }}>✓ Zero production debt on this release. 100% of proceeds flow to collaborators.</div>
                    ) : (
                      <div style={{ color: '#f59e0b', fontSize: '13px', fontWeight: 700 }}>
                        Recouping ${calculations.recoupmentDeductionUSD.toFixed(2)} from current intake. Remaining debt on release: ${(Math.max(0, recoupmentAmountUSD - calculations.recoupmentDeductionUSD)).toFixed(2)} USD.
                      </div>
                    )}
                  </div>

                  {/* Step Action Navigation Footer */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: '16px'
                  }}>
                    <button
                      type="button"
                      onClick={handlePrevWaterfallStep}
                      style={{
                        background: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#cbd5e1',
                        padding: '10px 18px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <RiArrowLeftLine size={16} />
                      <span>Back: Admin &amp; Label</span>
                    </button>

                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Step 3 of 5
                    </div>

                    <button
                      type="button"
                      onClick={handleNextWaterfallStep}
                      style={{
                        background: '#0ea5e9',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>Continue: Collaborator Splits</span>
                      <RiArrowRightLine size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 4: COLLABORATOR SPLIT SHEETS ================= */}
              {currentWaterfallStep === 4 && (
                <div style={{ background: '#090e24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px' }}>
                  {/* Step Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ background: '#0ea5e9', color: '#fff', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800 }}>4</div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#fff' }}>Collaborator Split Sheets</h3>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>Allocate 100% of the net artist pool across co-writers, producers &amp; performers</p>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      color: totalCollabPct === 100 ? '#10b981' : '#ef4444',
                      background: totalCollabPct === 100 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      border: `1px solid ${totalCollabPct === 100 ? '#10b981' : '#ef4444'}`,
                      padding: '4px 10px',
                      borderRadius: '4px'
                    }}>
                      Total: {totalCollabPct}% / 100% {totalCollabPct === 100 ? '✓' : `(Diff: ${100 - totalCollabPct}%)`}
                    </div>
                  </div>

                  {/* Preset Selector */}
                  <div style={{ background: '#0b1126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#94a3b8' }}>Split Sheet Formulas:</span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button type="button" onClick={() => handleApplyCollabPreset('equal_duo')} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', padding: '5px 10px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}>50/50 Duo</button>
                      <button type="button" onClick={() => handleApplyCollabPreset('producer_split')} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', padding: '5px 10px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}>60/25/15 Standard</button>
                      <button type="button" onClick={() => handleApplyCollabPreset('feature_heavy')} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', padding: '5px 10px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}>70/30 Guest Feature</button>
                      <button type="button" onClick={() => handleApplyCollabPreset('solo_full')} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', padding: '5px 10px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}>100% Solo</button>
                    </div>
                  </div>

                  {/* Collaborators List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    {collaborators.map((col, idx) => (
                      <div key={col.id} style={{ background: '#0b1126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '12px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 80px 32px', gap: '8px', alignItems: 'center' }}>
                          <div>
                            <input
                              type="text"
                              value={col.name}
                              onChange={(e) => handleUpdateCollaborator(col.id, 'name', e.target.value)}
                              placeholder="Collaborator Name"
                              style={{ width: '100%', background: '#090e24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', padding: '6px 8px', color: '#fff', fontSize: '12px' }}
                            />
                            <input
                              type="email"
                              value={col.email}
                              onChange={(e) => handleUpdateCollaborator(col.id, 'email', e.target.value)}
                              placeholder="Email / Wallet ID"
                              style={{ width: '100%', background: '#090e24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', padding: '4px 8px', color: '#94a3b8', fontSize: '10.5px', marginTop: '4px' }}
                            />
                          </div>

                          <div>
                            <input
                              type="text"
                              value={col.role}
                              onChange={(e) => handleUpdateCollaborator(col.id, 'role', e.target.value)}
                              placeholder="Role (e.g. Producer)"
                              style={{ width: '100%', background: '#090e24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', padding: '6px 8px', color: '#cbd5e1', fontSize: '11px' }}
                            />
                            <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, marginTop: '4px' }}>
                              +{currency.symbol}{(calculations.collaboratorShares[idx]?.amountLocal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={col.pct}
                                onChange={(e) => handleUpdateCollaborator(col.id, 'pct', e.target.value)}
                                style={{ width: '54px', background: '#090e24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', padding: '6px 4px', color: '#0ea5e9', fontSize: '13px', fontWeight: 800, textAlign: 'center' }}
                              />
                              <span style={{ fontSize: '12px', color: '#64748b' }}>%</span>
                            </div>
                          </div>

                          <div>
                            <button
                              type="button"
                              onClick={() => handleRemoveCollaborator(col.id)}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                              title="Remove collaborator"
                            >
                              <RiDeleteBin6Line size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCollaborator}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'transparent',
                      border: '1px dashed rgba(255,255,255,0.2)',
                      color: '#94a3b8',
                      padding: '8px 14px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      width: '100%',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}
                  >
                    <RiAddLine size={15} />
                    <span>+ Add Another Collaborator / Co-Writer</span>
                  </button>

                  {/* Management Commission Slider */}
                  <div style={{ background: '#0b1126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '12px 14px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ color: '#cbd5e1', fontWeight: 700 }}>Management &amp; Legal Rep Commission</span>
                      <span style={{ color: '#ef4444', fontWeight: 800 }}>{managerFeePct}% (-${calculations.managerFeeUSD.toFixed(2)} USD)</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      value={managerFeePct}
                      onChange={(e) => setManagerFeePct(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#ef4444' }}
                    />
                    <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
                      Optional artist management fee deducted from net artist pool before collaborator disbursements.
                    </div>
                  </div>

                  {/* Step Action Navigation Footer */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: '16px'
                  }}>
                    <button
                      type="button"
                      onClick={handlePrevWaterfallStep}
                      style={{
                        background: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#cbd5e1',
                        padding: '10px 18px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <RiArrowLeftLine size={16} />
                      <span>Back: Recoupable Debt</span>
                    </button>

                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Step 4 of 5
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (totalCollabPct !== 100) {
                          alert(`Collaborator shares sum to ${totalCollabPct}%. Please balance shares to exactly 100% before proceeding.`);
                          return;
                        }
                        handleNextWaterfallStep();
                      }}
                      style={{
                        background: totalCollabPct === 100 ? '#0ea5e9' : '#64748b',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: totalCollabPct === 100 ? 'pointer' : 'not-allowed',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>Continue: Settle &amp; Payout</span>
                      <RiArrowRightLine size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 5: PAYOUT GATEWAY & SETTLEMENT ================= */}
              {currentWaterfallStep === 5 && (
                <div style={{ background: '#090e24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px' }}>
                  {/* Step Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ background: '#10b981', color: '#fff', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800 }}>5</div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#fff' }}>Payout Gateway &amp; Cascade Execution</h3>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>Review final waterfall calculations, select payout routing, and execute</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: '4px' }}>
                      Ready to Settle
                    </span>
                  </div>

                  {/* Payout Destination Gateway Selector */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>Select Payout Disbursement Gateway:</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div
                        onClick={() => setPayoutDestination('mpesa')}
                        style={{
                          border: `1px solid ${payoutDestination === 'mpesa' ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                          background: payoutDestination === 'mpesa' ? 'rgba(16,185,129,0.1)' : '#0b1126',
                          padding: '14px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 800, fontSize: '13.5px' }}>
                          <RiSmartphoneFill size={18} />
                          <span>M-Pesa B2C Mobile Money</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', lineHeight: 1.4 }}>
                          Instant payout in KES to Safaricom Kenya phone wallet. Zero international bank delays.
                        </div>
                      </div>

                      <div
                        onClick={() => setPayoutDestination('stripe')}
                        style={{
                          border: `1px solid ${payoutDestination === 'stripe' ? '#0ea5e9' : 'rgba(255,255,255,0.1)'}`,
                          background: payoutDestination === 'stripe' ? 'rgba(14,165,233,0.1)' : '#0b1126',
                          padding: '14px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', fontWeight: 800, fontSize: '13.5px' }}>
                          <RiBankCardFill size={18} />
                          <span>Stripe Express (ACH / IBAN)</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', lineHeight: 1.4 }}>
                          Direct global bank deposit in USD, EUR, or GBP via ACH, SEPA, and Faster Payments.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Complete Pre-Settlement Review Card */}
                  <div style={{ background: '#0b1126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '16px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
                      Pre-Settlement Waterfall Audit Review:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8' }}>Gross Intake ({customTitle}):</span>
                        <span style={{ color: '#38bdf8', fontWeight: 800 }}>+${calculations.grossUSD.toFixed(2)} USD</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8' }}>Platform Administration (10%):</span>
                        <span style={{ color: '#ef4444' }}>-${calculations.commFeeUSD.toFixed(2)} USD</span>
                      </div>
                      {calculations.labelShareUSD > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#94a3b8' }}>Record Label Share ({labelSharePct}%):</span>
                          <span style={{ color: '#ef4444' }}>-${calculations.labelShareUSD.toFixed(2)} USD</span>
                        </div>
                      )}
                      {calculations.recoupmentDeductionUSD > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#94a3b8' }}>Recoupable Advance Offset:</span>
                          <span style={{ color: '#f59e0b' }}>-${calculations.recoupmentDeductionUSD.toFixed(2)} USD</span>
                        </div>
                      )}
                      {calculations.managerFeeUSD > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#94a3b8' }}>Management Commission ({managerFeePct}%):</span>
                          <span style={{ color: '#ef4444' }}>-${calculations.managerFeeUSD.toFixed(2)} USD</span>
                        </div>
                      )}
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800 }}>
                        <span style={{ color: '#fff' }}>Primary Artist Net Take-Home:</span>
                        <span style={{ color: '#10b981' }}>
                          +{currency.symbol}{calculations.primaryArtistShareLocal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({selectedCurrency})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Cascade Execution Action Button */}
                  <button
                    type="button"
                    onClick={handleExecuteCascade}
                    disabled={isProcessing || totalCollabPct !== 100}
                    style={{
                      width: '100%',
                      background: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '6px',
                      fontSize: '15px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginBottom: '20px'
                    }}
                    data-testid="execute-split-btn"
                  >
                    <RiCoinsFill size={20} />
                    <span>{isProcessing ? 'Calculating & Settling Cascade...' : '⚡ Execute Split Cascade & Settle Payouts'}</span>
                  </button>

                  {/* Step Action Navigation Footer */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: '16px'
                  }}>
                    <button
                      type="button"
                      onClick={handlePrevWaterfallStep}
                      style={{
                        background: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#cbd5e1',
                        padding: '10px 18px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <RiArrowLeftLine size={16} />
                      <span>Back: Collaborator Splits</span>
                    </button>

                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Step 5 of 5: Ready to Commit
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Visual Waterfall Companion with Click-to-Jump Navigation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: '#090e24',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '24px',
                position: 'sticky',
                top: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#ffffff' }}>
                      Live Waterfall Breakdown
                    </h3>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      Interactive calculation in priority sequence
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#0ea5e9', background: 'rgba(14,165,233,0.1)', padding: '3px 8px', borderRadius: '4px' }}>
                    {selectedCurrency} View
                  </span>
                </div>

                {/* Waterfall Visual Blocks with Step Indicators & Jump Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  
                  {/* Step 1 Block: Total Gross */}
                  <div
                    onClick={() => handleJumpToWaterfallStep(1)}
                    style={{
                      background: '#0f172a',
                      padding: '14px',
                      borderRadius: '6px',
                      borderLeft: '4px solid #38bdf8',
                      border: currentWaterfallStep === 1 ? '1px solid #38bdf8' : '1px solid transparent',
                      cursor: 'pointer'
                    }}
                    title="Click to jump to Step 1: Revenue Intake"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 800, background: 'rgba(56,189,248,0.15)', padding: '1px 5px', borderRadius: '3px' }}>STEP 1</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Gross Intake</span>
                        </div>
                        <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{customTitle}</div>
                      </div>
                      <div style={{ fontSize: '17px', fontWeight: 900, color: '#38bdf8' }}>
                        +{currency.symbol}{calculations.grossLocal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  {/* Step 2 Block: Platform Admin Fee */}
                  <div
                    onClick={() => handleJumpToWaterfallStep(2)}
                    style={{
                      background: '#0b1126',
                      padding: '12px 14px',
                      borderRadius: '6px',
                      borderLeft: '4px solid #ef4444',
                      border: currentWaterfallStep === 2 ? '1px solid #0ea5e9' : '1px solid transparent',
                      cursor: 'pointer'
                    }}
                    title="Click to jump to Step 2: Admin & Label Share"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#0ea5e9', fontWeight: 800, background: 'rgba(14,165,233,0.15)', padding: '1px 5px', borderRadius: '3px' }}>STEP 2</span>
                        <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Platform Admin Fee ({platformAdminPct}%)</span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#ef4444' }}>
                        -{currency.symbol}{calculations.commFeeLocal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Step 2 Block: Label Share */}
                  {labelSharePct > 0 && (
                    <div
                      onClick={() => handleJumpToWaterfallStep(2)}
                      style={{
                        background: '#0b1126',
                        padding: '12px 14px',
                        borderRadius: '6px',
                        borderLeft: '4px solid #ef4444',
                        border: currentWaterfallStep === 2 ? '1px solid #0ea5e9' : '1px solid transparent',
                        cursor: 'pointer'
                      }}
                      title="Click to jump to Step 2: Admin & Label Share"
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '10px', color: '#0ea5e9', fontWeight: 800, background: 'rgba(14,165,233,0.15)', padding: '1px 5px', borderRadius: '3px' }}>STEP 2</span>
                          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Record Label Share ({labelSharePct}%)</span>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#ef4444' }}>
                          -{currency.symbol}{calculations.labelShareLocal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Step 3 Block: Recoupment Offset */}
                  {calculations.recoupmentDeductionUSD > 0 && (
                    <div
                      onClick={() => handleJumpToWaterfallStep(3)}
                      style={{
                        background: '#0b1126',
                        padding: '12px 14px',
                        borderRadius: '6px',
                        borderLeft: '4px solid #f59e0b',
                        border: currentWaterfallStep === 3 ? '1px solid #f59e0b' : '1px solid transparent',
                        cursor: 'pointer'
                      }}
                      title="Click to jump to Step 3: Recoupable Debt"
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 800, background: 'rgba(245,158,11,0.15)', padding: '1px 5px', borderRadius: '3px' }}>STEP 3</span>
                          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Recoupable Advance Offset</span>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>
                          -{currency.symbol}{calculations.recoupmentDeductionLocal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Step 4 Block: Management Fee */}
                  {managerFeePct > 0 && (
                    <div
                      onClick={() => handleJumpToWaterfallStep(4)}
                      style={{
                        background: '#0b1126',
                        padding: '12px 14px',
                        borderRadius: '6px',
                        borderLeft: '4px solid #ef4444',
                        border: currentWaterfallStep === 4 ? '1px solid #10b981' : '1px solid transparent',
                        cursor: 'pointer'
                      }}
                      title="Click to jump to Step 4: Collaborator Splits"
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 800, background: 'rgba(16,185,129,0.15)', padding: '1px 5px', borderRadius: '3px' }}>STEP 4</span>
                          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Management Fee ({managerFeePct}%)</span>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#ef4444' }}>
                          -{currency.symbol}{calculations.managerFeeLocal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Step 4 Block: Collaborator Disbursements */}
                  <div
                    onClick={() => handleJumpToWaterfallStep(4)}
                    style={{
                      background: '#0f172a',
                      padding: '14px',
                      borderRadius: '6px',
                      borderLeft: '4px solid #10b981',
                      border: currentWaterfallStep === 4 ? '1px solid #10b981' : '1px solid transparent',
                      cursor: 'pointer'
                    }}
                    title="Click to jump to Step 4: Collaborator Splits"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 800, background: 'rgba(16,185,129,0.15)', padding: '1px 5px', borderRadius: '3px' }}>STEP 4</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Collaborators ({calculations.collaboratorShares.length})</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>100% Net Pool</span>
                    </div>
                    {calculations.collaboratorShares.map((col, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: idx < calculations.collaboratorShares.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{col.name}</span>
                          <span style={{ fontSize: '10.5px', color: '#64748b', marginLeft: '6px' }}>({col.pct}%)</span>
                        </div>
                        <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#10b981' }}>
                          +{currency.symbol}{col.amountLocal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary Artist Net Callout */}
                <div
                  onClick={() => handleJumpToWaterfallStep(5)}
                  style={{
                    background: 'rgba(16,185,129,0.1)',
                    border: `1px solid ${currentWaterfallStep === 5 ? '#10b981' : 'rgba(16,185,129,0.3)'}`,
                    borderRadius: '6px',
                    padding: '16px',
                    marginBottom: '16px',
                    cursor: 'pointer'
                  }}
                  title="Click to jump to Step 5: Settle & Payout"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 800, background: 'rgba(16,185,129,0.2)', padding: '1px 5px', borderRadius: '3px' }}>STEP 5</span>
                        <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>Primary Net Payout</span>
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', marginTop: '4px' }}>
                        {currency.symbol}{calculations.primaryArtistShareLocal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Payout Routing:</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>
                        {payoutDestination === 'mpesa' ? 'M-Pesa B2C Gateway' : 'Stripe Express Direct'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Jump to Settle Shortcut Button */}
                {currentWaterfallStep !== 5 && (
                  <button
                    type="button"
                    onClick={() => handleJumpToWaterfallStep(5)}
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      color: '#38bdf8',
                      border: '1px solid rgba(14,165,233,0.3)',
                      padding: '10px',
                      borderRadius: '6px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>Jump to Step 5: Review &amp; Settle →</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Studio Section-Level Directional Navigation Footer */}
          <div style={{
            background: '#090e24',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            padding: '14px 20px',
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Finished calculating your cascade? Browse to historical transactions or split sheet contracts:
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('ledger')}
                style={{
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  padding: '8px 14px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>View TuneLedger Transactions ({ledgerRows.length})</span>
                <RiArrowRightLine size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: TUNELEDGER TRANSACTION AUDIT TRAIL ================= */}
      {activeTab === 'ledger' && (
        <div style={{ background: '#090e24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                TuneLedger Immutable Transaction Ledger
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#94a3b8' }}>
                Every cascade execution produces an itemized audit record. Collaborators verify receipts in real-time.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleExportCSV}
                style={{
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  padding: '8px 14px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RiDownloadFill size={15} />
                <span>Export Audit CSV</span>
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <RiSearchLine size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search transactions by title or TxID..."
                value={searchLedger}
                onChange={(e) => setSearchLedger(e.target.value)}
                style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '8px 12px 8px 36px', color: '#fff', fontSize: '12.5px' }}
              />
            </div>

            <select
              value={ledgerSourceFilter}
              onChange={(e) => setLedgerSourceFilter(e.target.value)}
              style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '8px 12px', color: '#fff', fontSize: '12.5px' }}
            >
              <option value="ALL">All Revenue Sources</option>
              <option value="Sync">Sync Licensing</option>
              <option value="Streaming">DSP Streaming</option>
              <option value="Tips">TuneStream Tips</option>
              <option value="POS">TunePay POS Merch</option>
            </select>
          </div>

          {/* Ledger Table */}
          <div style={{ overflowX: 'auto', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ background: '#0b1126', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 16px' }}>TxID</th>
                  <th style={{ padding: '12px 16px' }}>Release / Track</th>
                  <th style={{ padding: '12px 16px' }}>Source</th>
                  <th style={{ padding: '12px 16px' }}>Gross ({selectedCurrency})</th>
                  <th style={{ padding: '12px 16px' }}>Deductions</th>
                  <th style={{ padding: '12px 16px' }}>Artist Payout</th>
                  <th style={{ padding: '12px 16px' }}>Disbursement</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Voucher</th>
                </tr>
              </thead>
              <tbody>
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                      No ledger transactions matched your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLedger.map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>
                        {row.id}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#fff' }}>
                        {row.title}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: '#1e293b', color: '#94a3b8', padding: '2px 8px', borderRadius: '3px', fontSize: '11px' }}>
                          {row.source || 'Sync Licensing'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#fff' }}>
                        {currency.symbol}{((row.gross || 0) * currency.rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#ef4444' }}>
                        -{currency.symbol}{(((row.comm || 0) + (row.label || 0) + (row.recoupment || 0) + (row.manager || 0)) * currency.rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 800, color: '#10b981' }}>
                        +{currency.symbol}{((row.artist || 0) * currency.rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '11px', color: '#94a3b8' }}>
                        {row.destination || 'M-Pesa Mobile Wallet'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 800 }}>
                          ✓ SETTLED
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentVoucher({
                              ...row,
                              collaboratorShares: [
                                { name: 'Primary Artist', role: 'Main Artist', pct: 60, amountLocal: (row.artist || 0) * currency.rate },
                                { name: 'Track Producer', role: 'Producer', pct: 25, amountLocal: ((row.gross || 0) * 0.25) * currency.rate },
                                { name: 'Co-Writer', role: 'Topliner', pct: 15, amountLocal: ((row.gross || 0) * 0.15) * currency.rate }
                              ],
                              currencySymbol: currency.symbol,
                              exchangeRate: currency.rate
                            });
                            setShowVoucherModal(true);
                          }}
                          style={{
                            background: '#0f172a',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#38bdf8',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Section Navigation Footer */}
          <div style={{
            background: '#0b1126',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '16px 0 0',
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('waterfall')}
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#cbd5e1',
                padding: '8px 14px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiArrowLeftLine size={15} />
              <span>Previous: Interactive Waterfall Builder</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vault')}
              style={{
                background: '#0ea5e9',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Next: Split Sheets Vault</span>
              <RiArrowRightLine size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 3: DIGITAL SPLIT SHEETS VAULT ================= */}
      {activeTab === 'vault' && (
        <div style={{ background: '#090e24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                Digital Split Sheets Contract Vault
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#94a3b8' }}>
                Pre-cleared digital split agreements registered against authoritative ISRC/ISWC codes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewSplitSheetModal(true)}
              style={{
                background: '#0ea5e9',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiAddLine size={16} />
              <span>+ Register New Split Sheet</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {splitSheetsVault.map(sheet => (
              <div key={sheet.id} style={{ background: '#0b1126', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 800, color: '#fff' }}>{sheet.title}</h4>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>ISRC: {sheet.isrc} · ISWC: {sheet.iswc}</div>
                  </div>
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '3px',
                    background: sheet.status.includes('Locked') ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                    color: sheet.status.includes('Locked') ? '#10b981' : '#f59e0b',
                    border: `1px solid ${sheet.status.includes('Locked') ? '#10b981' : '#f59e0b'}`
                  }}>
                    {sheet.status}
                  </span>
                </div>

                <div style={{ background: '#0f172a', padding: '10px', borderRadius: '4px', fontSize: '12px', color: '#cbd5e1', marginBottom: '12px' }}>
                  <strong>Registered Splits:</strong> {sheet.collaborators}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
                  <span>Updated: {sheet.lastUpdated}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomTitle(sheet.title);
                      setActiveTab('waterfall');
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Load in Waterfall →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Section Navigation Footer */}
          <div style={{
            background: '#0b1126',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '16px 0 0',
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('ledger')}
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#cbd5e1',
                padding: '8px 14px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiArrowLeftLine size={15} />
              <span>Previous: TuneLedger Transactions</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('importer')}
              style={{
                background: '#0ea5e9',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Next: Statement Ingestion & CSV</span>
              <RiArrowRightLine size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 4: STATEMENT INGESTION & CSV IMPORTER ================= */}
      {activeTab === 'importer' && (
        <div style={{ background: '#090e24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
              Distributor &amp; DSP Statement Ingestion Desk
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#94a3b8' }}>
              Import raw royalty CSV statements from DistroKid, TuneCore, Spotify for Artists, Apple Music, or FUGA. The engine auto-matches ISRCs and calculates cascading splits.
            </p>
          </div>

          {/* Upload Area */}
          <div style={{
            border: '2px dashed rgba(14,165,233,0.3)',
            borderRadius: '8px',
            padding: '36px 20px',
            textAlign: 'center',
            background: '#0b1126',
            marginBottom: '24px'
          }}>
            <RiUploadCloud2Line size={38} style={{ color: '#0ea5e9', marginBottom: '8px' }} />
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#fff' }}>
              Drag &amp; Drop Royalty CSV Statement
            </h4>
            <p style={{ margin: '6px 0 16px', fontSize: '12px', color: '#94a3b8' }}>
              Supports DistroKid (.tsv), TuneCore (.csv), Spotify for Artists, Apple Music, and custom label statements.
            </p>
            <label style={{
              background: '#0ea5e9',
              color: '#ffffff',
              padding: '8px 18px',
              borderRadius: '4px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-block'
            }}>
              {isImporting ? 'Parsing Statement Rows...' : 'Browse Local Statement File'}
              <input
                type="file"
                accept=".csv,.tsv,.txt"
                onChange={handleSimulateStatementUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Parsed Results Preview */}
          {parsedStatementRows.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#fff' }}>
                    Statement Parse Preview ({parsedStatementRows.length} Tracks Matched)
                  </h4>
                  <div style={{ fontSize: '11.5px', color: '#10b981', marginTop: '2px' }}>
                    ✓ All ISRCs verified against TuneMavens catalog
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleBatchIngestStatement}
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '4px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Run Batch Split Cascade &amp; Disburse
                </button>
              </div>

              <div style={{ overflowX: 'auto', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ background: '#0b1126', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px 14px' }}>ISRC</th>
                      <th style={{ padding: '10px 14px' }}>Track Title</th>
                      <th style={{ padding: '10px 14px' }}>Source Platform</th>
                      <th style={{ padding: '10px 14px' }}>Stream Quantity</th>
                      <th style={{ padding: '10px 14px' }}>Gross Revenue</th>
                      <th style={{ padding: '10px 14px' }}>Split Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedStatementRows.map((r, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#38bdf8' }}>{r.isrc}</td>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: '#fff' }}>{r.title}</td>
                        <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{r.source}</td>
                        <td style={{ padding: '10px 14px', color: '#cbd5e1' }}>{r.streams}</td>
                        <td style={{ padding: '10px 14px', fontWeight: 800, color: '#10b981' }}>${r.gross.toFixed(2)}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 700 }}>✓ Auto-Matched (60/25/15)</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section Navigation Footer */}
          <div style={{
            background: '#0b1126',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '16px 0 0',
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('vault')}
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#cbd5e1',
                padding: '8px 14px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiArrowLeftLine size={15} />
              <span>Previous: Split Sheets Vault</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('university')}
              style={{
                background: '#0ea5e9',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Next: Royalty University &amp; Guide</span>
              <RiArrowRightLine size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 5: ROYALTY UNIVERSITY & GUIDANCE HUB ================= */}
      {activeTab === 'university' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            {ROYALTY_GUIDES.map(guide => (
              <div key={guide.id} style={{ background: '#090e24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#0ea5e9', fontWeight: 800, background: 'rgba(14,165,233,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                    {guide.tag}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{guide.readTime}</span>
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                  {guide.title}
                </h3>
                <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.4, margin: '0 0 14px' }}>
                  {guide.summary}
                </p>
                <div style={{ background: '#0b1126', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px', padding: '14px', fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                  {guide.content}
                </div>
              </div>
            ))}
          </div>

          {/* Section Navigation Footer */}
          <div style={{
            background: '#090e24',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            padding: '14px 20px',
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('importer')}
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#cbd5e1',
                padding: '8px 14px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiArrowLeftLine size={15} />
              <span>Previous: Statement Ingestion &amp; CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('waterfall')}
              style={{
                background: '#0ea5e9',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Return to: Interactive Waterfall Builder</span>
              <RiArrowRightLine size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: DIGITAL SPLIT VOUCHER / AUDIT RECEIPT ================= */}
      {showVoucherModal && currentVoucher && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: '#090e24',
            border: '1px solid rgba(14,165,233,0.3)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '560px',
            padding: '28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RiShieldCheckFill size={20} style={{ color: '#10b981' }} />
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#fff' }}>
                    TuneLedger Audit Voucher
                  </h3>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Transaction Reference: {currentVoucher.id} · Settled {currentVoucher.date}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVoucherModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <RiCloseLine size={22} />
              </button>
            </div>

            <div style={{ background: '#0b1126', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                {currentVoucher.title}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Source: {currentVoucher.source} · Payout: {currentVoucher.destination}
              </div>
            </div>

            {/* Itemized Waterfall Receipt */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Gross Revenue Collected:</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>
                  ${(currentVoucher.gross || 0).toFixed(2)} USD
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Platform Administration (10%):</span>
                <span style={{ color: '#ef4444' }}>
                  -${(currentVoucher.comm || 0).toFixed(2)} USD
                </span>
              </div>
              {currentVoucher.label > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Record Label Share:</span>
                  <span style={{ color: '#ef4444' }}>
                    -${(currentVoucher.label || 0).toFixed(2)} USD
                  </span>
                </div>
              )}
              {currentVoucher.recoupment > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Recoupment Advance Offset:</span>
                  <span style={{ color: '#f59e0b' }}>
                    -${(currentVoucher.recoupment || 0).toFixed(2)} USD
                  </span>
                </div>
              )}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                <span style={{ color: '#fff' }}>Primary Artist Net Payout:</span>
                <span style={{ color: '#10b981' }}>
                  +${(currentVoucher.artist || 0).toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* Collaborator breakdown list */}
            {currentVoucher.collaboratorShares && (
              <div style={{ background: '#0f172a', padding: '12px', borderRadius: '6px', marginBottom: '18px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Collaborator Settlement Hashes
                </div>
                {currentVoucher.collaboratorShares.map((col, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', padding: '2px 0' }}>
                    <span style={{ color: '#cbd5e1' }}>{col.name} ({col.role})</span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>
                      +${((col.amountUSD || col.amountLocal / (currentVoucher.exchangeRate || 1)) || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowVoucherModal(false)}
                style={{
                  background: '#0ea5e9',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '4px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close Audit Voucher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: REGISTER NEW SPLIT SHEET ================= */}
      {showNewSplitSheetModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: '#090e24',
            border: '1px solid rgba(14,165,233,0.3)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '520px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#fff' }}>
                Register Digital Split Sheet
              </h3>
              <button
                type="button"
                onClick={() => setShowNewSplitSheetModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const newSheet = {
                id: `sheet_${Date.now()}`,
                title: customTitle,
                isrc: `KE-TM1-26-000${Math.floor(50 + Math.random() * 40)}`,
                iswc: `T-345.987.123-${Math.floor(4 + Math.random() * 5)}`,
                status: 'Locked & Verified',
                collaborators: collaborators.map(c => `${c.name} (${c.pct}%)`).join(', '),
                lastUpdated: new Date().toISOString().split('T')[0]
              };
              setSplitSheetsVault(prev => [newSheet, ...prev]);
              setShowNewSplitSheetModal(false);
              alert('Digital Split Sheet successfully registered and locked in the vault!');
            }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>Release Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '8px 10px', color: '#fff', fontSize: '12.5px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>Registered Collaborators</label>
                <div style={{ background: '#0b1126', padding: '10px', borderRadius: '4px', fontSize: '11.5px', color: '#94a3b8' }}>
                  {collaborators.map(c => `${c.name} - ${c.role}: ${c.pct}%`).join('\n')}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewSplitSheetModal(false)}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', padding: '8px 14px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Lock In Split Agreement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
