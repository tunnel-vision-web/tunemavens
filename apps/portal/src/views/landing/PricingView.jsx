import React, { useState } from 'react'
import { RiCheckboxCircleFill, RiTeamFill, RiCloseFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { useRegion } from '../../RegionContext.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'

import headerPricingImg from '../../assets/images/header_pricing.png'
import headerPricingWesternImg from '../../assets/images/header_pricing_western.png'

const PLANS = [
  {
    name: 'Free Starter',
    price: 0,
    credits: 50,
    desc: '50 Free Signup Credits to test standard audio and sync tools.',
    features: [
      { text: '50 Free Signup Credits', on: true },
      { text: 'Standard sync brief generation', on: true },
      { text: 'Basic analytics dashboard', on: true },
      { text: 'Community access', on: true },
    ],
    cta: 'Start Free',
    style: 'outline',
  },
  {
    name: 'Creator',
    price: 9.99,
    credits: 350,
    desc: '350 Non-Expiring Credits. Perfect for independent artists and producers.',
    features: [
      { text: '350 Unified Network Credits', on: true },
      { text: 'AI mastering (3 tracks/mo)', on: true },
      { text: 'Sync placement submissions (5/mo)', on: true },
      { text: 'Advanced analytics', on: true },
    ],
    cta: 'Subscribe',
    style: 'outline',
  },
  {
    name: 'Pro',
    price: 29.99,
    credits: 1500,
    desc: '1,500 Non-Expiring Credits. For serious creators scaling their catalog.',
    features: [
      { text: '1,500 Unified Network Credits', on: true },
      { text: 'Unlimited AI mastering', on: true },
      { text: 'Priority sync placements', on: true },
      { text: 'Splits management & collaboration', on: true },
      { text: 'Custom domain mapping', on: true },
    ],
    cta: 'Subscribe',
    style: 'cyan',
    popular: true,
  },
  {
    name: 'Label',
    price: 49.99,
    credits: 5000,
    desc: '5,000 Non-Expiring Credits. Enterprise-grade tools for labels and managers.',
    features: [
      { text: '5,000 Unified Network Credits', on: true },
      { text: 'Unlimited everything', on: true },
      { text: 'White-label dashboards', on: true },
      { text: 'API access & webhooks', on: true },
      { text: 'Dedicated support', on: true },
    ],
    cta: 'Subscribe',
    style: 'outline',
  },
  {
    name: 'Label Bulk (Team)',
    price: 149.99,
    credits: 25000,
    seats: 5,
    desc: '25,000 Non-Expiring Credits. Bulk pool for multi-artist catalogs with 5 team seats.',
    features: [
      { text: '25,000 Unified Network Credits', on: true },
      { text: '5 team seats included', on: true },
      { text: 'Bulk catalog operations', on: true },
      { text: 'Dedicated account manager', on: true },
      { text: 'Priority catalog curation', on: true },
      { text: 'Split Cascade ledger engines', on: true },
    ],
    cta: 'Contact Sales',
    style: 'outline',
    team: true,
  },
];

// Stripe Checkout Modal
function CheckoutModal({ plan, onClose, formatPrice, currencyInfo, convertPrice }) {
  const [loading, setLoading] = useState(false);

  const handleStripeCheckout = async () => {
    setLoading(true);
    // In production, this would call your backend to create a Stripe Checkout Session
    // For now, simulate with a redirect to Stripe's test payment link
    const amount = convertPrice(plan.price);
    const currency = currencyInfo?.code?.toLowerCase() || 'usd';
    
    alert(
      `Stripe Checkout will open for:\n\n` +
      `Plan: ${plan.name}\n` +
      `Amount: ${currencyInfo?.symbol}${amount.toFixed(2)} ${currency.toUpperCase()}/mo\n` +
      `Credits: ${plan.credits.toLocaleString()}\n\n` +
      `To enable live payments, configure your Stripe keys in the environment.`
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
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>Subscribe to {plan.name}</h3>
          <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0 }}>
            {plan.credits.toLocaleString()} credits · {currencyInfo?.symbol}{convertPrice(plan.price).toFixed(2)}/mo
          </p>
        </div>

        <div style={{ background: 'var(--ca)', border: '1px solid var(--b1)', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span style={{ color: 'var(--mu)' }}>Plan</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{plan.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span style={{ color: 'var(--mu)' }}>Credits</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{plan.credits.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span style={{ color: 'var(--mu)' }}>Currency</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{currencyInfo?.code || 'USD'}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--b1)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
            <span style={{ color: 'var(--mu)' }}>Total</span>
            <span style={{ color: 'var(--cyan)', fontWeight: 800 }}>{currencyInfo?.symbol}{convertPrice(plan.price).toFixed(2)}/mo</span>
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
          {loading ? 'Redirecting to Stripe…' : `Pay ${currencyInfo?.symbol}${convertPrice(plan.price).toFixed(2)}/mo`}
        </button>

        <p style={{ fontSize: '11px', color: 'var(--mu2)', textAlign: 'center', marginTop: '12px' }}>
          Powered by Stripe · Secure checkout · Cancel anytime
        </p>
      </div>
    </div>
  );
}

export default function PricingView() {
  const { formatPrice, convertPrice, currencyInfo } = useRegion();
  const navigate = useNavigate();
  const [checkoutPlan, setCheckoutPlan] = useState(null);

  const handleBuy = (plan) => {
    if (plan.price === 0) {
      navigate('/register');
    } else if (plan.team) {
      alert(`For Label Bulk (Team) packages, please contact sales@tunemavens.com.\n\nOur team will set up your custom bulk pricing and ${plan.seats} team seats.`);
    } else {
      setCheckoutPlan(plan);
    }
  };

  return (
    <>
      <PageHeader title="Plans & Pricing" bgImage={headerPricingImg} bgImageWestern={headerPricingWesternImg} breadcrumb="Pricing" />
      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          Transparent pricing with local currency support. All credits are non-expiring and shared across the Intermaven network.
        </p>
        <div className="pricing-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', maxWidth: '1300px' }}>
          {PLANS.map((plan) => (
            <div key={plan.name} className={`pricing-card glass-panel ${plan.popular ? 'premium' : ''}`}>
              {plan.popular && <span className="pricing-badge">Most Popular</span>}
              {plan.team && <span className="pricing-badge" style={{ background: 'var(--purple)' }}><RiTeamFill size={12} style={{ marginRight: '4px' }} />Team</span>}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                {plan.price === 0 ? formatPrice(0) : `${currencyInfo?.symbol || '$'}${convertPrice(plan.price).toFixed(2)}`}
                <span>/{plan.price === 0 ? 'free' : 'mo'}</span>
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
      </div>

      {checkoutPlan && (
        <CheckoutModal
          plan={checkoutPlan}
          onClose={() => setCheckoutPlan(null)}
          formatPrice={formatPrice}
          currencyInfo={currencyInfo}
          convertPrice={convertPrice}
        />
      )}
    </>
  );
}
