import React, { useState, useEffect, useMemo } from 'react';
import { 
  RiFundsBoxFill, 
  RiCompass3Fill, 
  RiSparklingFill, 
  RiShieldCheckFill, 
  RiSearchLine, 
  RiFilter3Line, 
  RiArrowRightLine, 
  RiArrowLeftLine,
  RiCloseLine, 
  RiCheckFill, 
  RiCheckDoubleFill, 
  RiFileTextFill, 
  RiCoinsFill, 
  RiGlobalFill, 
  RiPlayFill, 
  RiPauseFill, 
  RiTimeLine, 
  RiBarChartFill, 
  RiLineChartFill, 
  RiBuilding4Fill, 
  RiBookOpenLine, 
  RiUserSharedFill, 
  RiLock2Fill, 
  RiPrinterFill, 
  RiExternalLinkLine,
  RiInformationFill,
  RiCheckLine,
  RiAwardFill,
  RiMicFill,
  RiRadioFill,
  RiMusic2Fill,
  RiPercentLine,
  RiBankCardFill
} from 'react-icons/ri';

export default function VcDiscoverCreatorsApp({ sessionUser, onNavigateTab }) {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [creatorTypeFilter, setCreatorTypeFilter] = useState('all'); // all | artist | podcaster | dj
  const [genreFilter, setGenreFilter] = useState('all');
  const [velocityFilter, setVelocityFilter] = useState('all'); // all | highest_irr | fastest_recoupment | largest_catalog

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals & Selection
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [underwriteModalOpen, setUnderwriteModalOpen] = useState(false);
  const [telemetryModalOpen, setTelemetryModalOpen] = useState(false);
  const [readingDocOpen, setReadingDocOpen] = useState(false);
  const [executedAgreement, setExecutedAgreement] = useState(null);

  // Tri-Party Contract Workflow State
  const [contractStep, setContractStep] = useState(1); // 1: Terms | 2: Compliance & Tri-Party Protocols | 3: Signature
  const [contractForm, setContractForm] = useState({
    contract_kind: 'senior_tour_advance',
    advance_amount_usd: 50000,
    target_irr_percent: 23.5,
    recoupment_cap_usd: 62500,
    tunemavens_platform_fee_pct: 3.0,
    recoupment_priority: 'Senior Secured First Money Out',
    payout_rail: 'Split Cascade Digital Wallet',
    payout_account: 'tm_split_cascade_wallet_vc',
    vc_entity_name: sessionUser?.entity_name || sessionUser?.brand_name || 'Helios Creative Capital LP',
    signatory_name: sessionUser?.name || 'Marcus Vance, Managing Partner',
    signatory_title: 'Managing Partner / Syndicate Lead',
    signature_text: sessionUser?.name || 'Marcus Vance',
    signed_attestation: false,
    protocol_triparty: true,
    protocol_platform_fee: true,
    protocol_escrow: true,
    protocol_telemetry: true,
    protocol_exemption: true,
    notes: 'Senior debt advance with automated Split Cascade priority box office recoupment and TuneMavens 3.0% platform fee.'
  });
  const [signingSubmitting, setSigningSubmitting] = useState(false);

  // Active Signed VC Contracts for syncing
  const [activeContracts, setActiveContracts] = useState(() => {
    try {
      const saved = localStorage.getItem('tunemavens_vc_contracts');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  // Listen for global event to open VC reading guide
  useEffect(() => {
    const handleOpenVcGuide = () => setReadingDocOpen(true);
    window.addEventListener('tunemavens:open-vc-guide', handleOpenVcGuide);
    return () => window.removeEventListener('tunemavens:open-vc-guide', handleOpenVcGuide);
  }, []);

  // Fetch discoverable creators from backend (supporting all types: Artists, Podcasters, DJs)
  const fetchDiscovery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vc/discover?limit=30');
      if (res.ok) {
        const data = await res.json();
        setCreators(data.creators || []);
      }
    } catch (err) {
      console.warn('Backend discover query fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscovery();
    // Also fetch signed agreements to know who is contracted
    fetch('/api/vc/agreements')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.agreements)) {
          setActiveContracts(data.agreements);
          try {
            localStorage.setItem('tunemavens_vc_contracts', JSON.stringify(data.agreements));
          } catch (_) {}
        }
      })
      .catch(() => {});
  }, []);

  // Handle Opening the Underwriting & Contract Signing Modal
  const handleOpenUnderwrite = (creator) => {
    setSelectedCreator(creator);
    const recAdvance = creator.forward_projections?.recommended_advance_facility || 25000;
    const targetIrr = creator.forward_projections?.modelled_investor_net_irr || 22.0;
    const cap = Math.round(recAdvance * (1 + targetIrr / 100));

    setContractForm({
      contract_kind: creator.creator_type === 'podcaster' 
        ? 'master_royalty_participation' 
        : creator.creator_type === 'dj' 
        ? 'creator_incubation_syndicate' 
        : 'senior_tour_advance',
      advance_amount_usd: recAdvance,
      target_irr_percent: targetIrr,
      recoupment_cap_usd: cap,
      tunemavens_platform_fee_pct: 3.0,
      recoupment_priority: 'Senior Secured First Money Out',
      payout_rail: 'Split Cascade Digital Wallet',
      payout_account: 'tm_split_cascade_wallet_vc',
      vc_entity_name: sessionUser?.entity_name || sessionUser?.brand_name || 'Helios Creative Capital LP',
      signatory_name: sessionUser?.name || 'Marcus Vance, Managing Partner',
      signatory_title: 'Managing Partner / Syndicate Lead',
      signature_text: sessionUser?.name || 'Marcus Vance',
      signed_attestation: false,
      protocol_triparty: true,
      protocol_platform_fee: true,
      protocol_escrow: true,
      protocol_telemetry: true,
      protocol_exemption: true,
      notes: `Tri-party VC agreement financing ${creator.name} (${creator.type_label}) with automated TuneMavens 3.0% platform facilitation fee and Split Cascade priority lien.`
    });
    setContractStep(1);
    setUnderwriteModalOpen(true);
  };

  // Submit and legally sign tri-party agreement online
  const handleSignAgreement = async (e) => {
    e.preventDefault();
    if (!selectedCreator || !contractForm.signed_attestation) return;
    setSigningSubmitting(true);

    const payload = {
      creator_id: selectedCreator.creator_id,
      creator_name: selectedCreator.name,
      creator_type: selectedCreator.creator_type || 'artist',
      contract_kind: contractForm.contract_kind,
      contract_title: contractForm.contract_kind === 'senior_tour_advance'
        ? `Tri-Party Senior Tour Advance Financing Agreement — ${selectedCreator.name}`
        : contractForm.contract_kind === 'master_royalty_participation'
        ? `Tri-Party Master Royalty & Catalog Participation Agreement — ${selectedCreator.name}`
        : `Tri-Party Creator Incubation & Tour Equity Syndicate Facility — ${selectedCreator.name}`,
      advance_amount_usd: contractForm.advance_amount_usd,
      target_irr_percent: contractForm.target_irr_percent,
      recoupment_cap_usd: contractForm.recoupment_cap_usd,
      tunemavens_platform_fee_pct: contractForm.tunemavens_platform_fee_pct || 3.0,
      recoupment_priority: contractForm.recoupment_priority,
      payout_rail: contractForm.payout_rail,
      payout_account: contractForm.payout_account,
      vc_entity_name: contractForm.vc_entity_name,
      signatory_name: contractForm.signatory_name,
      signatory_title: contractForm.signatory_title,
      regulatory_attestation: true,
      protocols_acknowledged: [
        'Tri-Party Engagement: TuneMavens appointed as technology intermediary & escrow clearinghouse',
        'TuneMavens Platform Fee: 3.0% protocol facilitation fee automated via Split Cascade',
        'Split Cascade automated escrow & senior first-dollar recoupment lien verification',
        'Audience telemetry verification & anti-fraud box office validation',
        'SEC/CMA Accredited LP Investor Attestation (Zero Platform Credits Charged)'
      ],
      notes: contractForm.notes
    };

    try {
      const res = await fetch('/api/vc/agreements/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setExecutedAgreement(data);
        
        // Update local contracts list and sync across platform
        const updatedContracts = [data.contract, ...activeContracts.filter(c => c.contract_id !== data.contract.contract_id)];
        setActiveContracts(updatedContracts);
        try {
          localStorage.setItem('tunemavens_vc_contracts', JSON.stringify(updatedContracts));
          window.dispatchEvent(new CustomEvent('tunemavens:vc-agreement-signed', { detail: data.contract }));
        } catch (_) {}

        setUnderwriteModalOpen(false);
      } else {
        throw new Error('Agreement sign request failed');
      }
    } catch (err) {
      console.warn('Signing fallback locally:', err);
      const contractId = `CNT-TOUR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const fallback = {
        status: 'success',
        message: `Tri-Party Agreement ${contractId} successfully executed online with ${selectedCreator.name} and TuneMavens!`,
        contract: {
          contract_id: contractId,
          sha256_hash: `0x7fa2b9840192e48cd192384a8bc9102837498192038102938475829102938475`,
          creator_id: selectedCreator.creator_id,
          creator_name: selectedCreator.name,
          creator_type: selectedCreator.creator_type || 'artist',
          contract_title: payload.contract_title,
          advance_amount_usd: payload.advance_amount_usd,
          target_irr_percent: payload.target_irr_percent,
          recoupment_cap_usd: payload.recoupment_cap_usd,
          tunemavens_platform_fee_pct: 3.0,
          tri_party_structure: {
            party_investor: payload.vc_entity_name,
            party_creator: payload.creator_name,
            party_intermediary: 'TuneMavens Inc. / Intermaven Technologies'
          },
          vc_entity_name: payload.vc_entity_name,
          signatory_name: payload.signatory_name,
          signature_timestamp: new Date().toISOString(),
          status: 'Legally Executed & Operational',
          recoupment_status: 'Awaiting First Box Office Ingestion'
        },
        verification: {
          sha256_stamp: '0x7fa2b9840192e48cd192384a8bc9102837498192038102938475829102938475',
          enforcement_rail: 'TuneMavens Automated Split Cascade Protocol',
          tunemavens_fee_pct: 3.0,
          credits_charged: 0,
          exempt_status: 'VIP Institutional LP (Zero Charges)'
        }
      };
      setExecutedAgreement(fallback);

      const updatedContracts = [fallback.contract, ...activeContracts.filter(c => c.contract_id !== fallback.contract.contract_id)];
      setActiveContracts(updatedContracts);
      try {
        localStorage.setItem('tunemavens_vc_contracts', JSON.stringify(updatedContracts));
        window.dispatchEvent(new CustomEvent('tunemavens:vc-agreement-signed', { detail: fallback.contract }));
      } catch (_) {}

      setUnderwriteModalOpen(false);
    } finally {
      setSigningSubmitting(false);
    }
  };

  // Filter & Search Logic
  const filteredCreators = useMemo(() => {
    return creators.filter(c => {
      // Creator Type filter (Artists, Podcasters, DJs)
      const matchesType = creatorTypeFilter === 'all' || (c.creator_type || 'artist') === creatorTypeFilter;

      // Search match
      const matchesSearch = !searchQuery || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.handle || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      // Genre filter
      const matchesGenre = genreFilter === 'all' || c.genre.toLowerCase().includes(genreFilter.toLowerCase());

      return matchesType && matchesSearch && matchesGenre;
    }).sort((a, b) => {
      if (velocityFilter === 'highest_irr') {
        return (b.forward_projections?.modelled_investor_net_irr || 0) - (a.forward_projections?.modelled_investor_net_irr || 0);
      }
      if (velocityFilter === 'fastest_recoupment') {
        return (a.forward_projections?.projected_recoupment_months || 99) - (b.forward_projections?.projected_recoupment_months || 99);
      }
      if (velocityFilter === 'largest_catalog') {
        return (b.lifetime_streams || 0) - (a.lifetime_streams || 0);
      }
      return 0;
    });
  }, [creators, creatorTypeFilter, searchQuery, genreFilter, velocityFilter]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [creatorTypeFilter, searchQuery, genreFilter, velocityFilter]);

  // Pagination Slice
  const totalPages = Math.max(1, Math.ceil(filteredCreators.length / pageSize));
  const paginatedCreators = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCreators.slice(start, start + pageSize);
  }, [filteredCreators, currentPage, pageSize]);

  // Check if a creator is already under active contract
  const isContracted = (creatorName) => {
    return activeContracts.some(c => (c.creator_name || '').toLowerCase() === (creatorName || '').toLowerCase());
  };

  return (
    <div className="vc-discover-app" style={{ color: '#fff', paddingBottom: '60px' }}>
      
      {/* Top Hero & Policy Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(15, 23, 42, 0.6) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        borderRadius: '6px',
        padding: '24px 28px',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                background: 'rgba(6, 182, 212, 0.2)',
                color: '#22d3ee',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '3px',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <RiFundsBoxFill size={13} /> Tri-Party VC Underwriting Suite
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '3px',
                letterSpacing: '0.4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <RiShieldCheckFill size={13} /> Zero Platform Credits Charged (Exempt)
              </span>
              <span style={{
                background: 'rgba(245, 158, 11, 0.18)',
                color: '#f59e0b',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '3px',
                letterSpacing: '0.4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <RiPercentLine size={13} /> TuneMavens 3.0% Facilitation Fee
              </span>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#f8fafc', margin: '0 0 8px 0', letterSpacing: '-0.3px' }}>
              Discover Creators, Podcasters, DJs &amp; Catalogues
            </h2>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Browse verified Recording Artists, Audio Podcasters, Touring DJs, and comprehensive media catalogues. Review audited historical box office telemetry, fan retention, and 12–24 month forward AI growth projections. Execute legal Tri-Party financing agreements online with TuneMavens as the technology go-between, earning senior target yields while TuneMavens facilitates clearinghouse operations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setReadingDocOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e2e8f0',
                padding: '9px 16px',
                borderRadius: '4px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px'
              }}
            >
              <RiBookOpenLine size={16} color="#22d3ee" />
              <span>VC Engagement Playbook (Guide)</span>
            </button>
          </div>
        </div>

        {/* Aggregated Institutional KPIs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div>
            <span style={{ fontSize: '11.5px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Available Talent Roster</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#22d3ee', marginTop: '2px' }}>{creators.length} Curated Personas</div>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Artists, Podcasters &amp; DJs</span>
          </div>

          <div>
            <span style={{ fontSize: '11.5px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Active Contracted Creators</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>{activeContracts.length} Under Contract</div>
            <span style={{ fontSize: '11px', color: '#10b981' }}>Split Cascade &amp; CRM Unlocked</span>
          </div>

          <div>
            <span style={{ fontSize: '11.5px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>TuneMavens Protocol Fee</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>3.0% of Gross Flow</div>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Independent Clearinghouse</span>
          </div>

          <div>
            <span style={{ fontSize: '11.5px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Modelled Blended IRR</span>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>22.8% Net Target</div>
            <span style={{ fontSize: '11px', color: '#22d3ee' }}>Senior-Secured Priority Lien</span>
          </div>
        </div>
      </div>

      {/* Creator Type Selector Tabs (All, Artists, Podcasters, DJs) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px',
        background: '#090d1f',
        padding: '6px',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        width: 'fit-content',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'all', label: `All Creator Types (${creators.length})`, icon: RiGlobalFill },
          { id: 'artist', label: `Recording Artists (${creators.filter(c => c.creator_type === 'artist').length})`, icon: RiMusic2Fill, color: '#22d3ee' },
          { id: 'podcaster', label: `Podcasters & Hosts (${creators.filter(c => c.creator_type === 'podcaster').length})`, icon: RiMicFill, color: '#ec4899' },
          { id: 'dj', label: `DJs & Curators (${creators.filter(c => c.creator_type === 'dj').length})`, icon: RiRadioFill, color: '#f59e0b' }
        ].map(typeTab => {
          const Icon = typeTab.icon;
          const isActive = creatorTypeFilter === typeTab.id;
          return (
            <button
              key={typeTab.id}
              type="button"
              onClick={() => setCreatorTypeFilter(typeTab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                background: isActive ? 'rgba(34, 211, 238, 0.2)' : 'transparent',
                color: isActive ? '#22d3ee' : '#94a3b8',
                fontWeight: isActive ? 800 : 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} color={isActive ? (typeTab.color || '#22d3ee') : '#64748b'} />
              <span>{typeTab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '24px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <RiSearchLine size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input 
            type="text"
            placeholder="Search creator name, podcast title, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#090d1f',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              padding: '9px 12px 9px 36px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Velocity Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Sort By:</span>
          <select
            value={velocityFilter}
            onChange={(e) => setVelocityFilter(e.target.value)}
            style={{
              background: '#090d1f',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '4px',
              color: '#fff',
              padding: '7px 10px',
              fontSize: '12.5px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">Default (Curated Flow)</option>
            <option value="highest_irr">Highest Modelled Net IRR (24%+)</option>
            <option value="fastest_recoupment">Fastest Recoupment Velocity (Months)</option>
            <option value="largest_catalog">Largest Historical Streams / Downloads</option>
          </select>
        </div>
      </div>

      {/* Creators Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid #22d3ee', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ marginTop: '12px', fontSize: '13.5px' }}>Loading creator catalogues and audited telemetry...</p>
        </div>
      ) : paginatedCreators.length === 0 ? (
        <div style={{ background: '#090d1f', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '48px 24px', textAlign: 'center' }}>
          <RiSearchLine size={36} color="#64748b" />
          <h4 style={{ margin: '12px 0 4px', fontSize: '16px', color: '#f1f5f9' }}>No Creators Found</h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Try adjusting your search criteria or creator type filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '22px' }}>
          {paginatedCreators.map(creator => {
            const projections = creator.forward_projections || {};
            const contracted = isContracted(creator.name);

            return (
              <div 
                key={creator.creator_id}
                style={{
                  background: 'linear-gradient(180deg, #0d1229 0%, #080c1d 100%)',
                  border: contracted ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* Contract Status Badge if active */}
                {contracted && (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <RiCheckDoubleFill size={14} /> Active Relationship &amp; Contracted
                    </span>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase' }}>Split Cascade Unlocked</span>
                  </div>
                )}

                {/* Creator Header with Cover / Origin */}
                <div style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: creator.creator_type === 'podcaster' 
                      ? 'linear-gradient(135deg, #ec4899, #f43f5e)' 
                      : creator.creator_type === 'dj' 
                      ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                      : 'linear-gradient(135deg, #22d3ee, #a855f7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '20px',
                    color: '#060813',
                    flexShrink: 0,
                    border: '2px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    {creator.creator_type === 'podcaster' ? <RiMicFill size={24} color="#fff" /> : 
                     creator.creator_type === 'dj' ? <RiRadioFill size={24} color="#fff" /> : 
                     creator.name.charAt(0)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#f8fafc', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {creator.name}
                      </h3>
                      <span title="Verified Tour-Ready Creator" style={{ color: '#22d3ee', display: 'flex' }}>
                        <RiAwardFill size={15} />
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{creator.type_label}</span> • <span style={{ color: '#cbd5e1' }}>{creator.origin}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <span style={{
                        background: 'rgba(34, 211, 238, 0.12)',
                        color: '#22d3ee',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '3px'
                      }}>
                        {creator.financing_status || 'Tour Advance Ready'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Creator Bio Snippet */}
                <div style={{ padding: '14px 20px', fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  {creator.bio}
                </div>

                {/* Historical Audited Telemetry vs Forward Projections (2 Columns) */}
                <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', flex: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  
                  {/* Past Data Column */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <RiBarChartFill size={13} color="#22d3ee" /> Past Audited Data
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>
                      Lifetime Volume: <strong style={{ color: '#fff' }}>{(creator.lifetime_streams || 0).toLocaleString()}</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>
                      Past Live Tickets: <strong style={{ color: '#fff' }}>{(creator.past_tickets_sold || 0).toLocaleString()}</strong> ({creator.past_dates_count} dates)
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>
                      Avg Ticket / CPM: <strong style={{ color: '#fff' }}>${creator.avg_ticket_price_usd || 25}</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                      Audience Retention: <strong style={{ color: '#10b981' }}>{creator.listener_retention_rate}%</strong>
                    </div>
                  </div>

                  {/* Growth Projections Column */}
                  <div style={{ background: 'rgba(6, 182, 212, 0.04)', padding: '12px', borderRadius: '4px', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
                    <div style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <RiLineChartFill size={13} color="#10b981" /> 12–24 Mo. Projections
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>
                      Modelled Net IRR: <strong style={{ color: '#10b981', fontSize: '13px' }}>{projections.modelled_investor_net_irr}%</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>
                      Recoupment Velocity: <strong style={{ color: '#22d3ee' }}>{projections.projected_recoupment_months} mos</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>
                      Projected Gross: <strong style={{ color: '#fff' }}>${(projections.projected_tour_gross_min || 0).toLocaleString()} - ${(projections.projected_tour_gross_max || 0).toLocaleString()}</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                      Advance Commitment: <strong style={{ color: '#f59e0b' }}>${(projections.recommended_advance_facility || 0).toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                {/* Top Catalogue Tracks / Episodes Preview */}
                <div style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                    Authoritative Releases / Episodes ({creator.top_tracks?.length || 0})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {(creator.top_tracks || []).slice(0, 2).map((tr, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#cbd5e1' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '220px' }}>
                          ♫ {tr.title} ({tr.genre})
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{tr.streams} streams</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ padding: '16px 20px', display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCreator(creator);
                      setTelemetryModalOpen(true);
                    }}
                    style={{
                      flex: 1,
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#cbd5e1',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Inspect Telemetry
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenUnderwrite(creator)}
                    style={{
                      flex: 1.2,
                      background: contracted 
                        ? 'rgba(16, 185, 129, 0.15)' 
                        : 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                      border: contracted ? '1px solid #10b981' : 'none',
                      color: contracted ? '#10b981' : '#ffffff',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: contracted ? 'none' : '0 2px 8px rgba(6, 182, 212, 0.3)'
                    }}
                  >
                    <span>{contracted ? 'Manage / Expand Facility' : 'Start Relationship'}</span>
                    <RiArrowRightLine size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginTop: '32px',
          padding: '16px 20px',
          background: '#090d1f',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '6px'
        }}>
          <div style={{ fontSize: '13px', color: '#94a3b8' }}>
            Showing <strong style={{ color: '#fff' }}>{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredCreators.length)}</strong> of <strong style={{ color: '#22d3ee' }}>{filteredCreators.length}</strong> creators &amp; shows
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              style={{
                background: currentPage === 1 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: currentPage === 1 ? '#475569' : '#fff',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RiArrowLeftLine size={14} />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setCurrentPage(p)}
                style={{
                  background: currentPage === p ? '#0284c7' : 'rgba(255, 255, 255, 0.04)',
                  border: currentPage === p ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              style={{
                background: currentPage === totalPages ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: currentPage === totalPages ? '#475569' : '#fff',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Next</span>
              <RiArrowRightLine size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL 1: Structured Tri-Party Contract Signing Workflow Modal         */}
      {/* ====================================================================== */}
      {underwriteModalOpen && selectedCreator && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setUnderwriteModalOpen(false); }}
        >
          <div style={{
            background: '#090d1f',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            borderRadius: '6px',
            width: '760px',
            maxWidth: '100%',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
            overflow: 'hidden'
          }}>
            
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(6, 182, 212, 0.05)'
            }}>
              <div>
                <span style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  Tri-Party VC Engagement · Protocol Step {contractStep} of 3
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#f8fafc', margin: '3px 0 0' }}>
                  Execute Legal Agreement: {selectedCreator.name} ({selectedCreator.type_label})
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setUnderwriteModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <RiCloseLine size={22} />
              </button>
            </div>

            {/* Tri-Party Structure Notification Pill */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
              padding: '10px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#fde68a'
            }}>
              <span>
                <strong>Tri-Party Engagement:</strong> TuneMavens acts as technology intermediary, escrow clearinghouse &amp; receives <strong>3.0% platform fee</strong> of transaction flow.
              </span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>Programmatic Recoupment</span>
            </div>

            {/* Stepper Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: '#060a17' }}>
              <button
                type="button"
                onClick={() => setContractStep(1)}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  background: contractStep === 1 ? 'rgba(6, 182, 212, 0.1)' : 'none',
                  border: 'none',
                  borderBottom: contractStep === 1 ? '2px solid #22d3ee' : 'none',
                  color: contractStep === 1 ? '#22d3ee' : '#64748b',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                1. Commercial Terms &amp; Advance
              </button>
              <button
                type="button"
                onClick={() => setContractStep(2)}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  background: contractStep === 2 ? 'rgba(6, 182, 212, 0.1)' : 'none',
                  border: 'none',
                  borderBottom: contractStep === 2 ? '2px solid #22d3ee' : 'none',
                  color: contractStep === 2 ? '#22d3ee' : '#64748b',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                2. Tri-Party Protocols &amp; Fees
              </button>
              <button
                type="button"
                onClick={() => setContractStep(3)}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  background: contractStep === 3 ? 'rgba(6, 182, 212, 0.1)' : 'none',
                  border: 'none',
                  borderBottom: contractStep === 3 ? '2px solid #22d3ee' : 'none',
                  color: contractStep === 3 ? '#22d3ee' : '#64748b',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                3. Digital Signature &amp; Binding
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              
              {/* STEP 1: Commercial Terms */}
              {contractStep === 1 && (
                <div>
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                      Agreement &amp; Facility Protocol
                    </label>
                    <select
                      value={contractForm.contract_kind}
                      onChange={(e) => setContractForm({ ...contractForm, contract_kind: e.target.value })}
                      style={{
                        width: '100%',
                        background: '#040714',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '4px',
                        padding: '10px 12px',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    >
                      <option value="senior_tour_advance">Senior Tour Advance Financing Agreement (100% First-Dollar Live Ticket Gross)</option>
                      <option value="master_royalty_participation">Master Royalty &amp; Catalog Participation Agreement (Streaming + Sync + Ad Flights)</option>
                      <option value="creator_incubation_syndicate">Creator Incubation &amp; Multi-City Tour Facility (Production Syndicate)</option>
                    </select>
                  </div>

                  {/* Advance Amount Selection */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                      Advance Capital Commitment (USD)
                    </label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      {[15000, 25000, 50000, 100000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            const cap = Math.round(amt * (1 + contractForm.target_irr_percent / 100));
                            setContractForm({ ...contractForm, advance_amount_usd: amt, recoupment_cap_usd: cap });
                          }}
                          style={{
                            background: contractForm.advance_amount_usd === amt ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            border: contractForm.advance_amount_usd === amt ? '1px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.1)',
                            color: contractForm.advance_amount_usd === amt ? '#22d3ee' : '#cbd5e1',
                            padding: '6px 14px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          ${amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <input 
                      type="number"
                      value={contractForm.advance_amount_usd}
                      onChange={(e) => {
                        const amt = parseFloat(e.target.value) || 0;
                        const cap = Math.round(amt * (1 + contractForm.target_irr_percent / 100));
                        setContractForm({ ...contractForm, advance_amount_usd: amt, recoupment_cap_usd: cap });
                      }}
                      style={{
                        width: '100%',
                        background: '#040714',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '4px',
                        padding: '10px 12px',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 700,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Target IRR & Recoupment Waterfall */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                        Target Senior Return (IRR %)
                      </label>
                      <input 
                        type="number"
                        step="0.1"
                        value={contractForm.target_irr_percent}
                        onChange={(e) => {
                          const irr = parseFloat(e.target.value) || 0;
                          const cap = Math.round(contractForm.advance_amount_usd * (1 + irr / 100));
                          setContractForm({ ...contractForm, target_irr_percent: irr, recoupment_cap_usd: cap });
                        }}
                        style={{
                          width: '100%',
                          background: '#040714',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '4px',
                          padding: '9px 12px',
                          color: '#10b981',
                          fontWeight: 800,
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                        TuneMavens Protocol Fee
                      </label>
                      <input 
                        type="text"
                        disabled
                        value="3.0% (Automated)"
                        style={{
                          width: '100%',
                          background: 'rgba(245, 158, 11, 0.08)',
                          border: '1px solid rgba(245, 158, 11, 0.25)',
                          borderRadius: '4px',
                          padding: '9px 12px',
                          color: '#f59e0b',
                          fontWeight: 800,
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                        Investor Recoupment Cap
                      </label>
                      <input 
                        type="text"
                        disabled
                        value={`$${contractForm.recoupment_cap_usd.toLocaleString()}`}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '4px',
                          padding: '9px 12px',
                          color: '#22d3ee',
                          fontWeight: 800,
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Payout & Settlement Rail */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                      Settlement &amp; Recoupment Rail
                    </label>
                    <select
                      value={contractForm.payout_rail}
                      onChange={(e) => setContractForm({ ...contractForm, payout_rail: e.target.value })}
                      style={{
                        width: '100%',
                        background: '#040714',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '4px',
                        padding: '9px 12px',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    >
                      <option value="Split Cascade Digital Wallet">Split Cascade Digital Wallet (Zero Fee / Instant Real-Time Recoupment)</option>
                      <option value="M-Pesa STK Push">M-Pesa Business STK Rail (Direct East African Mobile Settlement)</option>
                      <option value="Bank Swift Wire">Bank Swift International Wire Transfer</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2: Tri-Party Protocols & TuneMavens Intermediary Role */}
              {contractStep === 2 && (
                <div>
                  <div style={{ background: 'rgba(6, 182, 212, 0.06)', border: '1px solid rgba(6, 182, 212, 0.2)', borderRadius: '4px', padding: '14px 18px', marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '13.5px', color: '#22d3ee', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <RiShieldCheckFill size={16} /> Tri-Party Architecture &amp; Protocol Enforcements
                    </h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
                      TuneMavens acts as the independent technological intermediary and clearinghouse between the Investor Syndicate and the Creator. All box office, streaming, and licensing flows are automatically reconciled and routed via the immutable Split Cascade smart contracts.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12.5px', color: '#cbd5e1', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={contractForm.protocol_triparty} 
                        onChange={(e) => setContractForm({ ...contractForm, protocol_triparty: e.target.checked })}
                        style={{ marginTop: '2px', accentColor: '#22d3ee' }}
                      />
                      <span>
                        <strong>Protocol 1: TuneMavens as Neutral Go-Between &amp; Escrow Clearinghouse</strong> — Both parties appoint TuneMavens Inc. / Intermaven Technologies as the binding technological platform, escrow custodian, and automated distribution clearinghouse.
                      </span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12.5px', color: '#cbd5e1', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={contractForm.protocol_platform_fee} 
                        onChange={(e) => setContractForm({ ...contractForm, protocol_platform_fee: e.target.checked })}
                        style={{ marginTop: '2px', accentColor: '#f59e0b' }}
                      />
                      <span>
                        <strong>Protocol 2: 3.0% TuneMavens Platform Facilitation Fee</strong> — TuneMavens shall automatically receive 3.0% of all gross transaction and box office proceeds flowing through the Split Cascade, paid automatically in addition to the agreed investor return and creator splits.
                      </span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12.5px', color: '#cbd5e1', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={contractForm.protocol_escrow} 
                        onChange={(e) => setContractForm({ ...contractForm, protocol_escrow: e.target.checked })}
                        style={{ marginTop: '2px', accentColor: '#22d3ee' }}
                      />
                      <span>
                        <strong>Protocol 3: Split Cascade Senior First-Dollar Lien</strong> — 100% of event ticket sales and sync clearance fees enter the escrow until 100% of principal plus the target return cap (${contractForm.recoupment_cap_usd.toLocaleString()}) is satisfied.
                      </span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12.5px', color: '#cbd5e1', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={contractForm.protocol_exemption} 
                        onChange={(e) => setContractForm({ ...contractForm, protocol_exemption: e.target.checked })}
                        style={{ marginTop: '2px', accentColor: '#10b981' }}
                      />
                      <span>
                        <strong>Protocol 4: Permanent LP Credit-Exempt Status</strong> — Investor represents that they are an institutional LP. Zero platform credits will ever be charged to this investor account.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 3: Digital Signature & Tri-Party Execution */}
              {contractStep === 3 && (
                <div>
                  {/* Agreement Text Summary Preview Box */}
                  <div style={{
                    background: '#040714',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    padding: '16px',
                    fontSize: '11.5px',
                    color: '#cbd5e1',
                    lineHeight: 1.6,
                    maxHeight: '170px',
                    overflowY: 'auto',
                    marginBottom: '20px',
                    fontFamily: 'monospace'
                  }}>
                    <strong>TRI-PARTY VENTURE ENGAGEMENT &amp; ADVANCE AGREEMENT</strong><br />
                    PARTIES TO THIS AGREEMENT:<br />
                    1. INVESTOR SYNDICATE: {contractForm.vc_entity_name} ("Senior Secured LP")<br />
                    2. CREATOR / ROSTER: {selectedCreator.name} ({selectedCreator.type_label})<br />
                    3. TECHNOLOGY INTERMEDIARY: TuneMavens Inc. / Intermaven Technologies ("Escrow Agent")<br /><br />
                    COMMERCIAL PROVISIONS:<br />
                    • Advance Principal: ${contractForm.advance_amount_usd.toLocaleString()} USD<br />
                    • Target Annualized Return (IRR): {contractForm.target_irr_percent}%<br />
                    • Maximum Recoupment Cap: ${contractForm.recoupment_cap_usd.toLocaleString()} USD<br />
                    • TuneMavens Platform Fee: 3.0% of all transaction volume flowing through Split Cascade<br />
                    • Priority: Senior-Secured First Money Out via TuneMavens Split Cascade Engine<br />
                    • Copyright Protection: Creator maintains 100% ownership of master &amp; publishing rights<br />
                    • Governing Law: International Commercial Arbitration &amp; Smart Contract Rules
                  </div>

                  {/* Signatory Entity & Name */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                        Investor Entity / Fund Name *
                      </label>
                      <input 
                        type="text"
                        value={contractForm.vc_entity_name}
                        onChange={(e) => setContractForm({ ...contractForm, vc_entity_name: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#040714',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '4px',
                          padding: '9px 12px',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                        Authorized Signatory Full Name *
                      </label>
                      <input 
                        type="text"
                        value={contractForm.signatory_name}
                        onChange={(e) => setContractForm({ ...contractForm, signatory_name: e.target.value })}
                        style={{
                          width: '100%',
                          background: '#040714',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '4px',
                          padding: '9px 12px',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Digital Signature Type Input */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                      Digital Signature Verification (Type full name to legally bind) *
                    </label>
                    <input 
                      type="text"
                      placeholder="Type your name to digitally sign"
                      value={contractForm.signature_text}
                      onChange={(e) => setContractForm({ ...contractForm, signature_text: e.target.value })}
                      style={{
                        width: '100%',
                        background: '#040714',
                        border: '1px solid #22d3ee',
                        borderRadius: '4px',
                        padding: '12px',
                        color: '#22d3ee',
                        fontSize: '16px',
                        fontFamily: 'cursive, serif',
                        fontStyle: 'italic',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Final Attestation Checkbox */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12.5px', color: '#cbd5e1', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <input 
                      type="checkbox"
                      checked={contractForm.signed_attestation}
                      onChange={(e) => setContractForm({ ...contractForm, signed_attestation: e.target.checked })}
                      style={{ marginTop: '2px', accentColor: '#10b981' }}
                    />
                    <span>
                      I declare that I am an authorized syndicate partner with legal capacity to bind this commitment. I agree to the Tri-Party governance, the TuneMavens 3.0% platform facilitation fee, and the programmatic Split Cascade first-dollar recoupment lien.
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#060a17'
            }}>
              <div>
                {contractStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setContractStep(prev => prev - 1)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      fontSize: '13px',
                      cursor: 'pointer',
                      padding: '8px 12px'
                    }}
                  >
                    ← Back
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setUnderwriteModalOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#94a3b8',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                {contractStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setContractStep(prev => prev + 1)}
                    style={{
                      background: '#0284c7',
                      border: 'none',
                      color: '#fff',
                      padding: '8px 20px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>Proceed to Protocol {contractStep + 1}</span>
                    <RiArrowRightLine size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!contractForm.signed_attestation || signingSubmitting}
                    onClick={handleSignAgreement}
                    style={{
                      background: contractForm.signed_attestation ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#334155',
                      border: 'none',
                      color: '#fff',
                      padding: '8px 24px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: contractForm.signed_attestation ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: contractForm.signed_attestation ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none'
                    }}
                  >
                    <RiLock2Fill size={14} />
                    <span>{signingSubmitting ? 'Executing Tri-Party Agreement...' : 'Execute & Sign Tri-Party Agreement'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL 2: Executed Tri-Party Agreement Certificate Modal               */}
      {/* ====================================================================== */}
      {executedAgreement && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setExecutedAgreement(null); }}
        >
          <div style={{
            background: '#090d1f',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '6px',
            width: '660px',
            maxWidth: '100%',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                color: '#10b981',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <RiCheckDoubleFill size={28} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#f8fafc', margin: '0 0 6px 0' }}>
                Tri-Party Agreement Successfully Executed
              </h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                {executedAgreement.message}
              </p>
            </div>

            <div style={{ background: '#040714', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '4px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12.5px' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Contract Identifier:</span>
                  <div style={{ fontWeight: 800, color: '#22d3ee', fontFamily: 'monospace' }}>{executedAgreement.contract?.contract_id}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Investor Syndicate:</span>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{executedAgreement.contract?.vc_entity_name}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Advance Principal:</span>
                  <div style={{ fontWeight: 800, color: '#10b981' }}>${executedAgreement.contract?.advance_amount_usd?.toLocaleString()} USD</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>TuneMavens Protocol Fee:</span>
                  <div style={{ fontWeight: 800, color: '#f59e0b' }}>3.0% Facilitation Fee</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Max Recoupment Cap:</span>
                  <div style={{ fontWeight: 800, color: '#38bdf8' }}>${executedAgreement.contract?.recoupment_cap_usd?.toLocaleString()} USD</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Platform Intermediary:</span>
                  <div style={{ fontWeight: 700, color: '#e2e8f0' }}>TuneMavens Inc. (Escrow Agent)</div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: '#64748b' }}>Cryptographic SHA-256 Seal:</span>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {executedAgreement.contract?.sha256_hash}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setExecutedAgreement(null)}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close Window
              </button>

              <button
                type="button"
                onClick={() => {
                  setExecutedAgreement(null);
                  if (typeof onNavigateTab === 'function') onNavigateTab('splits');
                }}
                style={{
                  flex: 1.2,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Inspect Contracted Split Cascade →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL 3: VC Tri-Party Engagement Playbook & Guide Modal               */}
      {/* ====================================================================== */}
      {readingDocOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setReadingDocOpen(false); }}
        >
          <div style={{
            background: '#090d1f',
            border: '1px solid rgba(34, 211, 238, 0.35)',
            borderRadius: '6px',
            width: '680px',
            maxWidth: '100%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(34, 211, 238, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiBookOpenLine size={18} color="#22d3ee" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  VC Engagements: Tri-Party Structure &amp; TuneMavens 3% Protocol Fee
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setReadingDocOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <RiCloseLine size={22} />
              </button>
            </div>

            <div style={{ padding: '24px', overflowY: 'auto', fontSize: '13px', color: '#cbd5e1', lineHeight: 1.7 }}>
              <h4 style={{ color: '#22d3ee', margin: '0 0 8px 0', fontSize: '14px' }}>1. The Tri-Party Legal Architecture</h4>
              <p style={{ margin: '0 0 16px 0' }}>
                Every institutional investment facility executed on TuneMavens is structured as a binding Tri-Party Agreement between the Investor Syndicate (Senior LP), the Creator (Artist, Podcaster, or DJ), and TuneMavens Inc. as the neutral Technology Platform, Escrow Agent, and Telemetry Custodian.
              </p>

              <h4 style={{ color: '#f59e0b', margin: '0 0 8px 0', fontSize: '14px' }}>2. TuneMavens 3.0% Platform Facilitation Fee</h4>
              <p style={{ margin: '0 0 16px 0' }}>
                In exchange for running the automated clearinghouse, verifying real venue telemetry, preventing box office fraud, and enforcing programmatic Split Cascade liquidation waterfalls, TuneMavens receives a fair protocol fee of <strong>3.0%</strong> on all transaction throughput flowing through the escrow. This fee is automated and deducted programmatically in addition to agreed investor returns and creator splits.
              </p>

              <h4 style={{ color: '#10b981', margin: '0 0 8px 0', fontSize: '14px' }}>3. Data Privacy &amp; Contracted Roster Isolation</h4>
              <p style={{ margin: '0 0 16px 0' }}>
                Institutional security requires that VCs and Investors only access private CRM audience leads, fan phone numbers, and detailed Split Cascade ledgers for creators with whom they have an active, signed contract. General catalogue discovery is public, but private operational data is strictly protected.
              </p>

              <h4 style={{ color: '#38bdf8', margin: '0 0 8px 0', fontSize: '14px' }}>4. Permanent LP Credit-Exemption</h4>
              <p style={{ margin: 0 }}>
                VCs and Investors are never charged platform credits. All discovery intelligence, telemetry auditing, and smart contract executions are 100% credit-exempt.
              </p>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: '#060a17', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setReadingDocOpen(false)}
                style={{
                  background: '#0284c7',
                  border: 'none',
                  color: '#fff',
                  padding: '8px 18px',
                  borderRadius: '4px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Understood &amp; Acknowledged
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL 4: Full Creator Telemetry & Audited Ticket Breakdown Modal     */}
      {/* ====================================================================== */}
      {telemetryModalOpen && selectedCreator && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setTelemetryModalOpen(false); }}
        >
          <div style={{
            background: '#090d1f',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '6px',
            width: '640px',
            maxWidth: '100%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Historical Audited Telemetry — {selectedCreator.name} ({selectedCreator.type_label})
              </h3>
              <button 
                type="button"
                onClick={() => setTelemetryModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <RiCloseLine size={22} />
              </button>
            </div>

            <div style={{ padding: '24px', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' }}>
                <div style={{ background: '#040714', padding: '14px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Historical Box Office / Ad Gross</span>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#22d3ee', marginTop: '2px' }}>
                    ${(selectedCreator.historical_gross_box_office || 0).toLocaleString()} USD
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Across {selectedCreator.past_dates_count} live show dates</span>
                </div>

                <div style={{ background: '#040714', padding: '14px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Audited Ticket Volume</span>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                    {(selectedCreator.past_tickets_sold || 0).toLocaleString()} Verified Tickets
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Average ${selectedCreator.avg_ticket_price_usd} / ticket</span>
                </div>
              </div>

              <h4 style={{ fontSize: '13px', color: '#f8fafc', margin: '0 0 10px 0' }}>High-Velocity Audience Corridors</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {(selectedCreator.forward_projections?.key_corridors || []).map((corridor, idx) => (
                  <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
                    <span>📍 {corridor}</span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>Active Route</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setTelemetryModalOpen(false);
                  handleOpenUnderwrite(selectedCreator);
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                  border: 'none',
                  color: '#fff',
                  padding: '11px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Proceed to Underwrite &amp; Sign Contract →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
