import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  RiFundsBoxFill,
  RiSparklingFill,
  RiCompass3Fill,
  RiShieldCheckFill,
  RiCoinsFill,
  RiBarChartFill,
  RiArrowRightLine,
  RiCheckFill,
  RiCheckboxCircleFill,
  RiGlobalFill,
  RiRadarFill,
  RiBankCardFill,
  RiCloseFill
} from 'react-icons/ri'

import './RoleLandingShared.css'
import { useRegion } from '../../../RegionContext.jsx'
import headerImg from '../../../assets/images/header_tools.png'
import tourDashboardActualImg from '../../../assets/images/vc_dashboard_actual.png'

export default function VcLandingPage({ switcher }) {
  const { currencyInfo } = useRegion();
  const [previewModal, setPreviewModal] = useState(false);

  const formatMoney = (usdVal) => {
    if (!currencyInfo) return `$${usdVal.toLocaleString()}`;
    const rate = currencyInfo.rate || 1;
    const symbol = currencyInfo.symbol || '$';
    const converted = Math.round(usdVal * rate);
    return `${symbol} ${converted.toLocaleString()}`;
  };

  const servicesList = [
    { name: 'Global DSP Distribution Package', cost: 149, roi: '15% DSP Royalty Share until 1.25x' },
    { name: 'EPK Pro Domain & Cloud Hosting', cost: 199, roi: '10% Booking Fees until 1.20x' },
    { name: 'AI & Analog Studio Mastering Suite', cost: 250, roi: '12% Stream Payouts until 1.25x' },
    { name: 'SyncMavens Film & TV Representation', cost: 300, roi: '20% Sync Placement Fee until 1.30x' },
    { name: 'Smart CRM Superfan Broadcast Credits', cost: 450, roi: '10% Merch Gross until 1.25x' },
    { name: 'Live Tour Production & Backline Advance', cost: 15000, roi: 'Senior Secured 100% Door until 1.35x' },
  ];

  return (
    <div className="role-landing-view vc-landing-view" data-testid="vc-landing-page">
      {switcher}

      {/* Hero Section */}
      <section className="role-hero" style={{ background: '#060914', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '60px 20px 70px 20px' }}>
          <div style={{ maxWidth: '860px' }}>
            <span className="role-badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '5px 12px', borderRadius: '3px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <RiFundsBoxFill /> Alternative Music Assets A Institutional Tour &amp; Career Underwriting
            </span>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 800, color: '#ffffff', fontFamily: 'Sansation, sans-serif', lineHeight: 1.15, margin: '0 0 16px 0' }}>
              Underwrite Live Tours &amp; Sponsor Creator Careers Backed by Real Telemetry.
            </h1>
            <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: 1.7, margin: '0 0 32px 0' }}>
              TuneMavens empowers venture capital funds, angel syndicates, and cultural family offices to participate in senior-secured, short-cycle tour advances and direct platform product sponsorships. Programmatic first-dollar recoupment via the Split Cascade Ledger delivers 18% to 25% target IRR with zero creator equity dilution.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/dashboard?tab=vc-portfolio&role=vc" className="btn-primary" style={{ padding: '12px 26px', background: '#10b981', borderColor: '#10b981', color: '#fff', fontSize: '14px', fontWeight: 700 }}>
                Launch VC Command Center <RiArrowRightLine size={16} style={{ marginLeft: '6px' }} />
              </Link>
              <Link to="/tours?tab=vc-backing" className="btn-secondary" style={{ padding: '12px 22px', fontSize: '13.5px' }}>
                Browse Tour Underwriting Vault
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section style={{ background: '#090d1f', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '36px 0' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#fff', display: 'block', fontFamily: 'Sansation, sans-serif' }}>48+</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Global Live Corridors</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#10b981', display: 'block', fontFamily: 'Sansation, sans-serif' }}>{formatMoney(14200000)}+</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Tour VC Capital Deployed</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--cyan)', display: 'block', fontFamily: 'Sansation, sans-serif' }}>22.6%</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Average Target IRR</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--purple)', display: 'block', fontFamily: 'Sansation, sans-serif' }}>100%</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Automated Split Cascade Settlement</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 1: Facilitating Product & Service Costs for Creators */}
      <section style={{ padding: '70px 0', background: '#060914', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ maxWidth: '780px', marginBottom: '36px' }}>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              DIRECT CREATOR CAREER SPONSORSHIP
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Invest in Any Creator by Facilitating Their Product &amp; Service Costs
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
              Rather than traditional equity dilution, VCs can directly sponsor the operational tooling creators need to launch releases, package electronic press kits, and sell out tour stops. Every dollar funded creates a programmatic first-dollar recoupment lien on incoming royalties.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {servicesList.map((svc, sIdx) => (
              <div key={sIdx} style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h4 style={{ color: '#fff', fontSize: '16px', margin: 0, fontFamily: 'Sansation, sans-serif' }}>{svc.name}</h4>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#10b981' }}>{formatMoney(svc.cost)}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--cyan)', marginBottom: '16px' }}>
                  <strong>Recoupment Waterfall:</strong> {svc.roi}
                </div>
                <Link to="/dashboard?tab=vc-sponsorship&role=vc" className="btn-secondary" style={{ width: '100%', textAlign: 'center', fontSize: '12px', padding: '8px' }}>
                  Sponsor for Creator <RiArrowRightLine size={13} style={{ marginLeft: '4px' }} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature 2: Actual System Screenshot Preview */}
      <section style={{ padding: '70px 0', background: '#090d1f' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            ACTUAL PLATFORM DASHBOARD PREVIEW
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 16px 0', fontFamily: 'Sansation, sans-serif' }}>
            The TuneMavens VC Command Center
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '720px', margin: '0 auto 36px auto', lineHeight: 1.7 }}>
            Explore the authentic, live system interface where venture partners inspect audience telemetry, underwrite tour corridors, and monitor real-time Split Cascade distributions.
          </p>

          <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', cursor: 'pointer' }} onClick={() => setPreviewModal(true)}>
            <img 
              src={tourDashboardActualImg} 
              alt="Actual TuneMavens VC Command Center Screenshot" 
              style={{ 
                maxWidth: '100%', 
                height: 'auto', 
                borderRadius: '3px', 
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.85)'
              }}
            />
            <div style={{ marginTop: '12px', fontSize: '12.5px', color: 'var(--cyan)', fontWeight: 600 }}>
              Click to view high-resolution interactive dashboard preview
            </div>
          </div>
        </div>
      </section>

      {/* High-Resolution Screenshot Modal */}
      {previewModal && (
        <div className="preview-modal-backdrop" onClick={() => setPreviewModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '95vw', maxHeight: '95vh', overflow: 'auto', position: 'relative', background: '#090d1f', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '3px', padding: '20px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '3px', cursor: 'pointer' }}>
              <RiCloseFill size={20} />
            </button>
            <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 14px 0' }}>TuneMavens VC Command Center A Actual System Interface</h3>
            <img src={tourDashboardActualImg} alt="Actual System Screenshot" style={{ width: '100%', height: 'auto', borderRadius: '3px' }} />
          </div>
        </div>
      )}
    </div>
  );
}
