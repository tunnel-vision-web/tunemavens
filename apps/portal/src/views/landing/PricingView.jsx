import React, { useState } from 'react'
import { RiCheckboxCircleFill, RiTeamFill, RiCloseFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { useRegion } from '../../RegionContext.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
import CreditReloadModal from '../../components/common/CreditReloadModal.jsx'

import headerPricingImg from '../../assets/images/header_pricing.png'
import headerPricingWesternImg from '../../assets/images/header_pricing_western.png'

const PLANS = [
  {
    name: 'Starter Top-Up',
    price: 0,
    credits: 50,
    desc: '50 Free Signup Credits to test standard audio and sync tools.',
    features: [
      { text: '50 Free Signup Credits', on: true },
      { text: 'Standard sync brief generation', on: true },
      { text: 'Basic analytics dashboard', on: true },
      { text: 'Community access & TuneStream play', on: true },
    ],
    cta: 'Claim Free Credits',
    style: 'outline',
  },
  {
    name: 'Creator Top-Up',
    price: 9.99,
    credits: 350,
    desc: '350 Non-Expiring Credits. Perfect for independent artists and producers.',
    features: [
      { text: '350 Non-Expiring Credits', on: true },
      { text: 'AI mastering (3 tracks)', on: true },
      { text: 'Sync placement submissions (5 submissions)', on: true },
      { text: 'Advanced analytics & EPK hosting', on: true },
    ],
    cta: 'Top-Up 350 Credits',
    style: 'outline',
  },
  {
    name: 'Pro Maven Pack',
    price: 29.99,
    credits: 1500,
    desc: '1,500 Non-Expiring Credits. For serious creators scaling their catalog.',
    features: [
      { text: '1,500 Non-Expiring Credits', on: true },
      { text: 'Unlimited AI mastering', on: true },
      { text: 'Priority sync placements', on: true },
      { text: 'Splits management & collaboration', on: true },
      { text: 'Custom domain mapping', on: true },
    ],
    cta: 'Top-Up 1,500 Credits',
    style: 'cyan',
    popular: true,
  },
  {
    name: 'Studio Master Pack',
    price: 49.99,
    credits: 5000,
    desc: '5,000 Non-Expiring Credits. Enterprise-grade tools for labels and managers.',
    features: [
      { text: '5,000 Non-Expiring Credits', on: true },
      { text: 'Lossless multitrack stem downloads', on: true },
      { text: 'White-label dashboards & EPKs', on: true },
      { text: 'API access & webhooks', on: true },
      { text: 'Dedicated sync curation support', on: true },
    ],
    cta: 'Top-Up 5,000 Credits',
    style: 'outline',
  },
  {
    name: 'Label Bulk Pool',
    price: 149.99,
    credits: 25000,
    seats: 5,
    desc: '25,000 Non-Expiring Credits. Bulk pool for multi-artist catalogs with 5 team seats.',
    features: [
      { text: '25,000 Non-Expiring Credits', on: true },
      { text: '5 team seats included', on: true },
      { text: 'Bulk catalog operations', on: true },
      { text: 'Dedicated account manager', on: true },
      { text: 'Priority catalog curation', on: true },
      { text: 'Split Cascade ledger engines', on: true },
    ],
    cta: 'Top-Up 25,000 Credits',
    style: 'outline',
    team: true,
  },
];

// Stripe Checkout Modal
function CheckoutModal({ plan, onClose, formatPrice, currencyInfo, convertPrice }) {
  const [loading, setLoading] = useState(false);

  const handleStripeCheckout = async () => {
    setLoading(true);
    const amount = convertPrice(plan.price);
    const currency = currencyInfo?.code?.toLowerCase() || 'usd';
    
    alert(
      `Credit Top-Up Checkout will open for:\n\n` +
      `Package: ${plan.name}\n` +
      `Amount: ${currencyInfo?.symbol}${amount.toFixed(2)} ${currency.toUpperCase()} (One-Time)\n` +
      `Credits: ${plan.credits.toLocaleString()} Non-Expiring TM Credits\n\n` +
      `Your balance will update immediately upon checkout.`
    );
    setLoading(false);
    onClose();
  };

  return (
    <div className="auth-modal-overlay-wrapper" onClick={(e) => { if (e.target.className === 'auth-modal-overlay-wrapper') onClose(); }} style={{ position: 'fixed', inset: 0, background: 'rgba(3,7,18,0.78)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
      <div className="auth-modal-card glass-panel" style={{ maxWidth: '440px', width: '100%', padding: '32px', borderRadius: '12px', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--mu)', cursor: 'pointer' }}>
          <RiCloseFill size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/favicon.png" alt="TuneMavens" style={{ width: '42px', height: '42px', margin: '0 auto 12px', display: 'block' }} />
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>Top-Up {plan.name}</h3>
          <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0 }}>
            {plan.credits.toLocaleString()} non-expiring credits · {currencyInfo?.symbol}{convertPrice(plan.price).toFixed(2)} one-time
          </p>
        </div>

        <div style={{ background: 'var(--ca)', border: '1px solid var(--b1)', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span style={{ color: 'var(--mu)' }}>Package</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{plan.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span style={{ color: 'var(--mu)' }}>Credits Added</span>
            <span style={{ color: 'var(--cyan)', fontWeight: 800 }}>+{plan.credits.toLocaleString()} TM Credits</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span style={{ color: 'var(--mu)' }}>Type</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>One-Time Top-Up</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span style={{ color: 'var(--mu)' }}>Currency</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{currencyInfo?.code || 'USD'}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--b1)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
            <span style={{ color: 'var(--mu)' }}>Total</span>
            <span style={{ color: 'var(--cyan)', fontWeight: 800 }}>{currencyInfo?.symbol}{convertPrice(plan.price).toFixed(2)}</span>
          </div>
        </div>

        {plan.seats && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: 'var(--cyan)' }}>
            <RiTeamFill size={16} />
            Includes {plan.seats} team seats
          </div>
        )}

        <button
          onClick={handleStripeCheckout}
          disabled={loading}
          style={{ width: '100%', padding: '14px', background: 'var(--cyan)', color: '#060813', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {loading ? 'Redirecting to Checkout…' : `Pay ${currencyInfo?.symbol}${convertPrice(plan.price).toFixed(2)} One-Time`}
        </button>

        <p style={{ fontSize: '11px', color: 'var(--mu2)', textAlign: 'center', marginTop: '12px' }}>
          Powered by Stripe & PesaPal · Non-expiring credits · Instant top-up
        </p>
      </div>
    </div>
  );
}

export default function PricingView() {
  const { formatPrice, convertPrice, currencyInfo } = useRegion();
  const navigate = useNavigate();
  const [showReloadModal, setShowReloadModal] = useState(false);
  const [reloadReason, setReloadReason] = useState('TuneMavens Unified Platform Credits Top-Up');
  const [suggestedPackage, setSuggestedPackage] = useState(null);

  const handleBuy = (plan) => {
    if (plan.price === 0) {
      navigate('/register');
    } else {
      setReloadReason(`Top-Up ${plan.name} (${plan.credits.toLocaleString()} Credits)`);
      if (plan.credits >= 10000) {
        setSuggestedPackage('enterprise-label-load');
      } else if (plan.credits >= 3500) {
        setSuggestedPackage('scale-label-load');
      } else if (plan.credits >= 1000) {
        setSuggestedPackage('indie-label-load');
      } else if (plan.credits >= 500) {
        setSuggestedPackage('pro-growth');
      } else {
        setSuggestedPackage('creator-starter');
      }
      setShowReloadModal(true);
    }
  };

  return (
    <>
      <PageHeader title="Credits & Top-Ups" bgImage={headerPricingImg} bgImageWestern={headerPricingWesternImg} breadcrumb="Credits & Pricing" />
      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          Top up your balance with non-expiring TM Credits. No recurring monthly subscriptions — pay only for what you use across the entire TuneMavens and Intermaven ecosystem.
        </p>
        <div className="pricing-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', maxWidth: '1300px' }}>
          {PLANS.map((plan) => (
            <div key={plan.name} className={`pricing-card glass-panel ${plan.popular ? 'premium' : ''}`}>
              {plan.popular && <span className="pricing-badge">Most Popular</span>}
              {plan.team && <span className="pricing-badge" style={{ background: 'var(--purple)' }}><RiTeamFill size={12} style={{ marginRight: '4px' }} />Team</span>}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                {plan.price === 0 ? formatPrice(0) : `${currencyInfo?.symbol || '$'}${convertPrice(plan.price).toFixed(2)}`}
                <span>/{plan.price === 0 ? 'free' : 'top-up'}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '24px' }}>{plan.desc}</p>
              <ul className="plan-features">
                {plan.features.map((f, i) => (
                  <li key={i} className={`plan-feature-item ${f.on ? 'check' : ''}`}>
                    <RiCheckboxCircleFill size={12} color={f.on ? 'var(--cyan)' : 'var(--mu2)'} /> {f.text}
                  </li>
                ))}
              </ul>
              <button className={`plan-btn ${plan.style}`} onClick={() => handleBuy(plan)}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Corporate Advertising & Sponsorships Banner */}
        <div style={{
          marginTop: '56px',
          background: '#090e24',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderLeft: '5px solid #ef4444',
          borderRadius: '6px',
          padding: '28px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Corporate &amp; Enterprise Brands
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '4px 0 6px', fontFamily: 'Sansation, sans-serif' }}>
              Looking for Business Ad Rates &amp; Tour Sponsorships?
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, maxWidth: '640px' }}>
              Broadcast 15s/30s unskippable audio spots on TuneStream, sponsor creator concert tours, and capture CRM leads starting at 5,000 Unified Credits package ($499 one-time ad flight load, ~$14.99 CPM). Zero monthly charges.
            </p>
          </div>
          <button
            onClick={() => navigate('/for/corporate')}
            style={{
              padding: '12px 24px',
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Review Business Ad Rates &rarr;
          </button>
        </div>
      </div>

      <CreditReloadModal
        isOpen={showReloadModal}
        onClose={() => setShowReloadModal(false)}
        reason={reloadReason}
        suggestedPackageId={suggestedPackage}
        onSuccess={(result) => {
          setShowReloadModal(false);
        }}
      />
    </>
  );
}
