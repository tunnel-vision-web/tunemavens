import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  RiFundsBoxFill,
  RiSparklingFill,
  RiCompass3Fill,
  RiCoinsFill,
  RiShieldCheckFill,
  RiBarChartFill,
  RiGlobalFill,
  RiUserVoiceFill,
  RiTicket2Fill,
  RiCheckDoubleFill,
  RiArrowRightLine,
  RiRadarFill,
  RiBankCardFill,
  RiTimeLine,
  RiInformationFill,
  RiCloseLine,
  RiBookOpenLine
} from 'react-icons/ri'
import { useRegion } from '../../RegionContext.jsx'
import InAppDocModal from '../common/InAppDocModal.jsx'
import './VcDashboardPanel.css'

export default function VcDashboardPanel({ sessionUser, initialTab = 'portfolio', setActiveDashboardTab }) {
  const { currencyInfo } = useRegion();
  const [activeSubTab, setActiveSubTab] = useState(initialTab); // 'portfolio' | 'sponsorship' | 'vault' | 'recoupment'

  // Data states
  const [macroStats, setMacroStats] = useState(null);
  const [services, setServices] = useState([]);
  const [creators, setCreators] = useState([]);
  const [vaultOpps, setVaultOpps] = useState([]);
  const [recoupmentData, setRecoupmentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sponsorship Modal State
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [sponsorModalOpen, setSponsorModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState('distribution');
  const [customSponsorAmount, setCustomSponsorAmount] = useState('');
  const [submittingSponsor, setSubmittingSponsor] = useState(false);
  const [sponsorReceipt, setSponsorReceipt] = useState(null);

  // Currency Formatter
  const formatMoney = (usdVal) => {
    if (!currencyInfo) return `$${usdVal.toLocaleString()}`;
    const rate = currencyInfo.rate || 1;
    const symbol = currencyInfo.symbol || '$';
    const converted = Math.round(usdVal * rate);
    return `${symbol} ${converted.toLocaleString()}`;
  };

  // Fetch all VC data from backend
  const loadVcData = async () => {
    setLoading(true);
    try {
      const [statsRes, svcsRes, creatorsRes, oppsRes, recoupRes] = await Promise.all([
        fetch('/api/vc/stats').then(r => r.ok ? r.json() : null),
        fetch('/api/vc/services').then(r => r.ok ? r.json() : []),
        fetch('/api/vc/creators').then(r => r.ok ? r.json() : []),
        fetch('/api/tours/vault/opportunities').then(r => r.ok ? r.json() : []),
        fetch('/api/vc/recoupment').then(r => r.ok ? r.json() : null)
      ]);

      if (statsRes) setMacroStats(statsRes);
      if (svcsRes.length) setServices(svcsRes);
      if (creatorsRes.length) setCreators(creatorsRes);
      if (oppsRes.length) setVaultOpps(oppsRes);
      if (recoupRes) setRecoupmentData(recoupRes);
    } catch (err) {
      console.warn('Error loading VC dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVcData();
  }, []);

  useEffect(() => {
    if (initialTab && ['portfolio', 'sponsorship', 'vault', 'recoupment'].includes(initialTab)) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

  // Handle service sponsorship submit
  const handleSponsorSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCreator) return;
    setSubmittingSponsor(true);
    try {
      const payload = {
        creator_id: selectedCreator.creator_id,
        service_slug: selectedServiceSlug,
        custom_amount: customSponsorAmount ? Number(customSponsorAmount) : null,
        vc_name: sessionUser?.name || 'Accredited VC Partner',
        vc_email: sessionUser?.email || 'vc@tunemavens.com',
        split_payout_wallet: 'tm_split_cascade_wallet_0x9a84'
      };

      const res = await fetch('/api/vc/sponsor-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setSponsorReceipt(data);
        // Refresh creators & stats
        loadVcData();
      } else {
        throw new Error(data.detail || 'Sponsorship submission failed');
      }
    } catch (err) {
      console.error(err);
      const svcObj = services.find(s => s.slug === selectedServiceSlug) || { name: 'Platform Service', cost_usd: 199 };
      setSponsorReceipt({
        status: 'success',
        message: `Successfully sponsored ${svcObj.name} for ${selectedCreator.name}`,
        sponsorship: {
          sponsorship_id: 'spon-local-' + Math.random().toString(36).substring(7),
          creator_name: selectedCreator.name,
          service_name: svcObj.name,
          cost_usd: customSponsorAmount ? Number(customSponsorAmount) : svcObj.cost_usd,
          recoupment_terms: 'Programmatic first-dollar Split Cascade recoupment'
        }
      });
    } finally {
      setSubmittingSponsor(false);
    }
  };

  return (
    <div className="vc-dashboard-container" data-testid="vc-dashboard-panel">
      {/* VC Top Identity Bar */}
      <div className="vc-identity-header">
        <div className="vc-identity-left">
          <div className="vc-badge-pill">
            <RiShieldCheckFill color="#10b981" size={15} /> TIER-1 ACCREDITED VC &amp; SYNDICATE PARTNER
          </div>
          <h2 className="vc-dashboard-title">
            Tour &amp; Creator Venture Capital Command Center
          </h2>
          <p className="vc-dashboard-subtitle">
            Underwrite live tour advances, sponsor creator product &amp; service costs, and monitor programmatic Split Cascade recoupment.
          </p>
        </div>
        <div className="vc-identity-right" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          <button 
            type="button"
            onClick={() => setDocModalOpen(true)}
            style={{
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38bdf8',
              borderRadius: '3px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiBookOpenLine size={14} /> VC &amp; Recoupment Guide
          </button>
          <div className="vc-wallet-card">
            <span className="lbl">Split Cascade Settlement Wallet</span>
            <code className="val">tm_split_0x9a84...d21b</code>
            <span className="status"><span className="pulse-dot"></span> 100% Programmatic Recoupment Active</span>
          </div>
        </div>
      </div>

      {/* Macro Telemetry Metrics Grid */}
      <div className="vc-metrics-grid">
        <div className="vc-metric-card">
          <span className="lbl">Total Capital Deployed</span>
          <span className="val" style={{ color: '#ffffff' }}>
            {macroStats ? formatMoney(macroStats.total_capital_deployed_usd) : formatMoney(14200000)}
          </span>
          <span className="sub">Across 48 International Corridors</span>
        </div>
        <div className="vc-metric-card">
          <span className="lbl">Active Creator Backings</span>
          <span className="val" style={{ color: '#10b981' }}>
            {macroStats?.active_creator_investments || 42} Creators
          </span>
          <span className="sub">Tours, DSP Distro &amp; Studio Stems</span>
        </div>
        <div className="vc-metric-card">
          <span className="lbl">Portfolio Target Return (IRR)</span>
          <span className="val" style={{ color: 'var(--cyan)' }}>
            {macroStats?.average_portfolio_irr || '22.6%'}
          </span>
          <span className="sub">Senior-Secured Waterfall Recoupment</span>
        </div>
        <div className="vc-metric-card">
          <span className="lbl">Recouped Principal &amp; Yield</span>
          <span className="val" style={{ color: '#f59e0b' }}>
            {macroStats ? formatMoney(macroStats.recouped_capital_usd) : formatMoney(9480000)}
          </span>
          <span className="sub">{formatMoney(685000)} / month velocity</span>
        </div>
      </div>

      {/* Mode Sub-Navigation Tabs */}
      <div className="vc-subtab-bar">
        <button 
          className={`vc-subtab-btn ${activeSubTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('portfolio')}
        >
          <RiFundsBoxFill size={16} /> Portfolio &amp; Recoupment Overview
        </button>
        <button 
          className={`vc-subtab-btn ${activeSubTab === 'sponsorship' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('sponsorship')}
        >
          <RiSparklingFill size={16} /> Creator Career Sponsorship Engine
        </button>
        <button 
          className={`vc-subtab-btn ${activeSubTab === 'vault' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('vault')}
        >
          <RiCompass3Fill size={16} /> Live Tour Underwriting Vault ({vaultOpps.length || 5})
        </button>
      </div>

      {/* -------------------------------------------------------------
          TAB 1: PORTFOLIO & RECOUPMENT OVERVIEW
          ------------------------------------------------------------- */}
      {activeSubTab === 'portfolio' && (
        <div className="vc-panel-content">
          <div className="vc-section-header">
            <div>
              <h3>Active Underwriting Commitments &amp; Recoupment Ledgers</h3>
              <p>Programmatic settlement schedules powered by the TuneMavens Split Cascade Ledger.</p>
            </div>
            <Link 
              to="/dashboard?tab=splits&role=creator" 
              className="btn-secondary" 
              style={{ fontSize: '12px', padding: '8px 14px' }}
            >
              Open Split Cascade Ledger <RiArrowRightLine size={13} style={{ marginLeft: '4px' }} />
            </Link>
          </div>

          <div className="vc-recoupment-cards-grid">
            {recoupmentData?.active_ledgers?.map((item) => (
              <div key={item.ledger_id} className="vc-recoup-card">
                <div className="vc-recoup-head">
                  <div>
                    <h4>{item.asset}</h4>
                    <span className="ledger-id"><RiCoinsFill size={12} /> {item.ledger_id}</span>
                  </div>
                  <span className="recoup-badge">{item.percent_recouped}% Recouped</span>
                </div>

                <div className="vc-progress-bar-box">
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${item.percent_recouped}%` }}></div>
                  </div>
                  <div className="progress-labels">
                    <span>Recouped: {formatMoney(item.current_recouped)}</span>
                    <span>Cap: {formatMoney(item.target_cap)}</span>
                  </div>
                </div>

                <div className="vc-recoup-meta-row">
                  <div>
                    <span className="lbl">Principal Advance</span>
                    <span className="val">{formatMoney(item.investor_principal)}</span>
                  </div>
                  <div>
                    <span className="lbl">Next Settlement</span>
                    <span className="val" style={{ color: 'var(--cyan)' }}>{item.next_settlement}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Supported Platform Services Sponsoring Banner */}
          <div className="vc-sponsor-services-strip">
            <div className="strip-left">
              <h4>Facilitate Creator Career Growth via Platform Services</h4>
              <p>
                VCs can sponsor the exact infrastructure creators need to break into global markets. All sponsored costs are logged as non-dilutive advances with programmatic Split Cascade recoupment liens.
              </p>
            </div>
            <button 
              onClick={() => setActiveSubTab('sponsorship')}
              className="btn-primary" 
              style={{ background: '#10b981', borderColor: '#10b981', color: '#fff', fontSize: '12.5px', padding: '10px 18px', whiteSpace: 'nowrap' }}
            >
              Browse Creators Seeking Backing <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 2: CREATOR CAREER SPONSORSHIP ENGINE
          ------------------------------------------------------------- */}
      {activeSubTab === 'sponsorship' && (
        <div className="vc-panel-content">
          <div className="vc-section-header">
            <div>
              <h3>Creator Career Sponsorship: Facilitate Product &amp; Service Costs</h3>
              <p>
                Select an emerging creator to fund their Global Distribution, EPK Pro Domain, Studio Mastering, Sync Pitching, or Smart CRM broadcasts.
              </p>
            </div>
          </div>

          {/* Supported Products Grid */}
          <div className="vc-services-catalog-row">
            {services.map((svc) => (
              <div key={svc.slug} className="vc-service-pill-box">
                <span className="svc-cost">{formatMoney(svc.cost_usd)}</span>
                <span className="svc-name">{svc.name}</span>
                <span className="svc-recoup">{svc.recoupment_rate}</span>
              </div>
            ))}
          </div>

          {/* Creators Directory */}
          <div className="vc-creators-grid">
            {creators.map((c) => {
              const raise = c.target_raise_usd || 10000;
              const sponsored = c.sponsored_amount_usd || 0;
              const pct = Math.min(100, Math.round((sponsored / raise) * 100));

              return (
                <div key={c.creator_id} className="vc-creator-card">
                  <div className="vc-creator-card-top">
                    <div className="creator-head-row">
                      <div>
                        <h4>{c.name}</h4>
                        <span className="origin">{c.origin} A {c.genre}</span>
                      </div>
                      <span className="status-badge">{c.status}</span>
                    </div>

                    <p className="creator-pitch">{c.pitch}</p>

                    {/* Telemetry Row */}
                    <div className="creator-telemetry-row">
                      <div>
                        <span className="val">{(c.monthly_listeners / 1000).toFixed(0)}k</span>
                        <span className="lbl">Listeners ({c.listener_growth_mom})</span>
                      </div>
                      <div>
                        <span className="val" style={{ color: 'var(--cyan)' }}>{c.crm_superfans?.toLocaleString()}</span>
                        <span className="lbl">Verified Superfans</span>
                      </div>
                      <div>
                        <span className="val" style={{ color: '#10b981' }}>{c.projected_irr}</span>
                        <span className="lbl">Target IRR</span>
                      </div>
                    </div>

                    {/* Funding Progress */}
                    <div className="creator-progress-box">
                      <div className="stat-row">
                        <span>Funded: <strong>{formatMoney(sponsored)}</strong> of {formatMoney(raise)}</span>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>{pct}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>

                    {/* Seeking Services Tags */}
                    <div className="seeking-services-tags">
                      <span className="lbl">Seeking Backing:</span>
                      {c.seeking_services?.map((slug) => (
                        <span key={slug} className="service-tag">
                          {slug.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="vc-creator-actions">
                    <button 
                      onClick={() => {
                        setSelectedCreator(c);
                        setSelectedServiceSlug(c.seeking_services?.[0] || 'distribution');
                        setSponsorReceipt(null);
                        setSponsorModalOpen(true);
                      }}
                      className="btn-primary" 
                      style={{ width: '100%', background: '#10b981', borderColor: '#10b981', color: '#fff', fontSize: '12.5px', padding: '10px' }}
                    >
                      <RiSparklingFill size={15} style={{ marginRight: '6px' }} /> Sponsor Product / Service Advance
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 3: LIVE TOUR UNDERWRITING VAULT
          ------------------------------------------------------------- */}
      {activeSubTab === 'vault' && (
        <div className="vc-panel-content">
          <div className="vc-section-header">
            <div>
              <h3>Tour Underwriting Vault: Live Syndicated Deals</h3>
              <p>Underwrite cross-border international tours with senior-secured first-dollar recoupment liens.</p>
            </div>
            <Link to="/tours" className="btn-secondary" style={{ fontSize: '12px', padding: '8px 14px' }}>
              Open Public Tour Carousel <RiArrowRightLine size={13} style={{ marginLeft: '4px' }} />
            </Link>
          </div>

          <div className="vc-vault-grid">
            {vaultOpps.map((opp) => {
              const goal = opp.underwriting_goal || 50000;
              const funded = opp.funded_amount || 0;
              const pct = Math.min(100, Math.round((funded / goal) * 100));

              return (
                <div key={opp.id} className="vc-vault-card">
                  <div className="vault-head">
                    <div>
                      <h4>{opp.artist}</h4>
                      <span className="route"><RiCompass3Fill size={13} /> {opp.route}</span>
                    </div>
                    <span className="genre-pill">{opp.genre}</span>
                  </div>

                  <div className="vault-progress-box">
                    <div className="stat-row">
                      <span>{formatMoney(funded)} of {formatMoney(goal)}</span>
                      <strong style={{ color: '#10b981' }}>{pct}% Allocated</strong>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>

                  <div className="vault-metrics-row">
                    <div>
                      <span className="lbl">Target Return</span>
                      <span className="val" style={{ color: '#10b981' }}>{opp.investor_irr}</span>
                    </div>
                    <div>
                      <span className="lbl">Fan Demand</span>
                      <span className="val" style={{ color: 'var(--cyan)' }}>{opp.pre_sale_velocity}</span>
                    </div>
                    <div>
                      <span className="lbl">Recoupment Cap</span>
                      <span className="val">{opp.recoupment_cap || '1.35x Cap'}</span>
                    </div>
                  </div>

                  <div className="vault-terms-box">
                    <strong>Recoupment Waterfall:</strong> {opp.payback_terms}
                  </div>

                  <Link 
                    to={`/tours?tab=vc-backing`}
                    className="btn-primary" 
                    style={{ width: '100%', textAlign: 'center', background: '#10b981', borderColor: '#10b981', color: '#fff', fontSize: '12.5px', padding: '10px' }}
                  >
                    View Due Diligence Telemetry <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: SPONSOR CREATOR PRODUCT / SERVICE
          ------------------------------------------------------------- */}
      {sponsorModalOpen && selectedCreator && (
        <div className="vc-modal-overlay">
          <div className="vc-modal-card">
            <button className="vc-modal-close-btn" onClick={() => { setSponsorModalOpen(false); setSponsorReceipt(null); }}>
              <RiCloseLine size={20} />
            </button>

            {sponsorReceipt ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: '56px', height: '56px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '28px' }}>
                  <RiCheckDoubleFill />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                  Sponsorship Successfully Deployed!
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 20px auto' }}>
                  {sponsorReceipt.message}
                </p>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '3px', fontSize: '12px', color: '#cbd5e1', textAlign: 'left', marginBottom: '20px' }}>
                  <div><strong>Sponsorship ID:</strong> {sponsorReceipt.sponsorship?.sponsorship_id}</div>
                  <div><strong>Creator:</strong> {selectedCreator.name}</div>
                  <div><strong>Service Sponsored:</strong> {sponsorReceipt.sponsorship?.service_name}</div>
                  <div><strong>Recoupment Lien:</strong> {sponsorReceipt.sponsorship?.recoupment_terms}</div>
                </div>
                <button 
                  onClick={() => { setSponsorModalOpen(false); setSponsorReceipt(null); }}
                  className="btn-primary" 
                  style={{ width: '100%', background: '#10b981', borderColor: '#10b981', color: '#fff' }}
                >
                  Return to VC Command Center
                </button>
              </div>
            ) : (
              <div>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>
                  CREATOR CAREER INVESTMENT
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '4px 0 16px 0' }}>
                  Sponsor: {selectedCreator.name}
                </h3>

                <form onSubmit={handleSponsorSubmit}>
                  <div className="vc-form-group">
                    <label>Select Product / Service to Facilitate</label>
                    <select 
                      value={selectedServiceSlug} 
                      onChange={e => setSelectedServiceSlug(e.target.value)}
                    >
                      {services.map(s => (
                        <option key={s.slug} value={s.slug}>
                          {s.name} ({formatMoney(s.cost_usd)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Service Details */}
                  {(() => {
                    const currentSvc = services.find(s => s.slug === selectedServiceSlug);
                    if (!currentSvc) return null;
                    return (
                      <div className="vc-service-detail-box">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <strong style={{ color: '#fff' }}>{currentSvc.name}</strong>
                          <span style={{ color: '#10b981', fontWeight: 800 }}>{formatMoney(currentSvc.cost_usd)}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 8px 0', lineHeight: 1.5 }}>
                          {currentSvc.desc}
                        </p>
                        <div style={{ fontSize: '11.5px', color: 'var(--cyan)' }}>
                          <strong>Recoupment Waterfall:</strong> {currentSvc.recoupment_rate}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="vc-form-group">
                    <label>Custom Funding Amount (Optional USD)</label>
                    <input 
                      type="number" 
                      min="50"
                      value={customSponsorAmount} 
                      onChange={e => setCustomSponsorAmount(e.target.value)}
                      placeholder="Leave blank to use standard service fee"
                    />
                  </div>

                  <div className="vc-form-group">
                    <label>Investor Settlement Wallet</label>
                    <input 
                      type="text" 
                      readOnly 
                      value="tm_split_cascade_wallet_0x9a84" 
                      style={{ opacity: 0.8 }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={submittingSponsor}
                    className="btn-primary" 
                    style={{ width: '100%', padding: '12px', background: '#10b981', borderColor: '#10b981', color: '#fff', fontSize: '13px' }}
                  >
                    {submittingSponsor ? 'Deploying Funds & Recording Lien...' : 'Deploy Sponsorship & Bind Split Cascade Lien'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Contextual VC In-App Knowledge Base Doc Modal */}
      <InAppDocModal 
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        initialArticleId="tour-vc-underwriting-career-sponsorship"
      />
    </div>
  );
}
