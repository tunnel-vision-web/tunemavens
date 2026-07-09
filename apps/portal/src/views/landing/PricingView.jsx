import React from 'react'
import { RiCheckboxCircleFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { useRegion } from '../../RegionContext.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'

import headerPricingImg from '../../assets/images/header_pricing.png'
import headerPricingWesternImg from '../../assets/images/header_pricing_western.png'

export default function PricingView() {
  const { formatPrice } = useRegion();
  const navigate = useNavigate();

  return (
    <>
      <PageHeader title="Unified Credit Packages" bgImage={headerPricingImg} bgImageWestern={headerPricingWesternImg} breadcrumb="Pricing" />
      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          Load credits as you need them. All credits are non-expiring and shared across the Intermaven network (tunemavens.com, watchtube.tv, intermaven.io). No subscriptions required.
        </p>
        <div className="pricing-grid">
          {/* Tier 1 */}
          <div className="pricing-card glass-panel">
            <h3 className="plan-name">Free Starter</h3>
            <div className="plan-price">{formatPrice(0)}<span>/one-time</span></div>
            <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '24px' }}>150 Free Signup Credits to test standard audio and sync tools.</p>
            <ul className="plan-features">
              <li className="plan-feature-item check"><RiCheckboxCircleFill size={12} color="var(--cyan)" /> 150 Free Signup Credits</li>
              <li className="plan-feature-item check"><RiCheckboxCircleFill size={12} color="var(--cyan)" /> Standard sync brief generation</li>
              <li className="plan-feature-item"><RiCheckboxCircleFill size={12} color="var(--mu2)" /> No custom domain setup</li>
              <li className="plan-feature-item"><RiCheckboxCircleFill size={12} color="var(--mu2)" /> Standard soundwave mastering</li>
            </ul>
            <button className="plan-btn outline" onClick={() => navigate('/register')}>Start Free</button>
          </div>

          {/* Tier 2 */}
          <div className="pricing-card glass-panel premium">
            <span className="pricing-badge">Recommended</span>
            <h3 className="plan-name">Creator Package</h3>
            <div className="plan-price">{formatPrice(29)}<span>/one-time</span></div>
            <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '24px' }}>1,200 Non-Expiring Credits. Pay-as-you-go, shared across network.</p>
            <ul className="plan-features">
              <li className="plan-feature-item check"><RiCheckboxCircleFill size={12} color="var(--cyan)" /> 1,200 Unified Network Credits</li>
              <li className="plan-feature-item check"><RiCheckboxCircleFill size={12} color="var(--cyan)" /> Custom domain & container mapping</li>
              <li className="plan-feature-item check"><RiCheckboxCircleFill size={12} color="var(--cyan)" /> High-speed AI mastering engine</li>
              <li className="plan-feature-item check"><RiCheckboxCircleFill size={12} color="var(--cyan)" /> Escrow contract protection</li>
            </ul>
            <button className="plan-btn cyan" onClick={() => navigate('/register')}>Buy Creator Package</button>
          </div>

          {/* Tier 3 */}
          <div className="pricing-card glass-panel">
            <h3 className="plan-name">Label Bulk Package</h3>
            <div className="plan-price">{formatPrice(149)}<span>/one-time</span></div>
            <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '24px' }}>10,000 Non-Expiring Credits. Bulk pool for multi-artist catalogs.</p>
            <ul className="plan-features">
              <li className="plan-feature-item check"><RiCheckboxCircleFill size={12} color="var(--cyan)" /> 10,000 Unified Network Credits</li>
              <li className="plan-feature-item check"><RiCheckboxCircleFill size={12} color="var(--cyan)" /> Split Cascade ledger engines</li>
              <li className="plan-feature-item check"><RiCheckboxCircleFill size={12} color="var(--cyan)" /> Multi-app dashboard sharing</li>
              <li className="plan-feature-item check"><RiCheckboxCircleFill size={12} color="var(--cyan)" /> Priority catalog curation support</li>
            </ul>
            <button className="plan-btn outline" onClick={() => navigate('/register')}>Buy Label Package</button>
          </div>
        </div>
      </div>
    </>
  );
}
