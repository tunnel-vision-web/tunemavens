import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RiCheckboxCircleFill, RiArrowRightLine, RiTeamFill, RiCoinsFill } from 'react-icons/ri'
import { useRegion } from '../../RegionContext.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
import CreditReloadModal from '../../components/common/CreditReloadModal.jsx'
import { CREDIT_LOAD_PACKAGES, CREDIT_EXCHANGE_RATE } from '../../lib/pricingPlans.js'

import headerPricingImg from '../../assets/images/header_pricing.png'
import headerPricingWesternImg from '../../assets/images/header_pricing_western.png'

const PLANS = [
  {
    name: 'Spark Free Starter',
    price: 0,
    credits: 50,
    desc: '50 Free Signup Credits to test standard audio and sync pitching tools.',
    packageId: null,
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
    name: 'Starter Floor',
    price: 2.50,
    priceKes: 250,
    credits: 250,
    desc: '250 Non-Expiring Credits (KSh 250). Accessible entry floor for artists, single mastering, and tips.',
    packageId: 'starter-floor',
    features: [
      { text: '250 Non-Expiring Credits', on: true },
      { text: 'AI mastering (single master)', on: true },
      { text: 'EPK builder web world setup', on: true },
      { text: 'Direct fan tipping via mobile money', on: true },
    ],
    cta: 'Top-Up 250 Credits',
    style: 'outline',
  },
  {
    name: 'Growth Pack',
    price: 5.00,
    priceKes: 500,
    credits: 500,
    desc: '500 Non-Expiring Credits (KSh 500). Perfect for regular releases, WhatsApp alerts & sync briefs.',
    packageId: 'growth-pack',
    features: [
      { text: '500 Non-Expiring Credits', on: true },
      { text: 'WhatsApp Phone Alerts Enabled', on: true },
      { text: 'AI mastering (3 tracks)', on: true },
      { text: 'Sync placement submissions (5 submissions)', on: true },
      { text: 'Advanced analytics & EPK hosting', on: true },
    ],
    cta: 'Top-Up 500 Credits',
    style: 'outline',
  },
  {
    name: 'Pro Maven Pack',
    price: 10.00,
    priceKes: 1000,
    credits: 1000,
    desc: '1,000 Non-Expiring Credits (KSh 1,000). For active creators scaling catalog and custom domains.',
    packageId: 'pro-maven',
    features: [
      { text: '1,000 Non-Expiring Credits', on: true },
      { text: 'Custom apex domain SSL mapping', on: true },
      { text: 'Social AI Studio marketing generator', on: true },
      { text: 'Unlimited AI mastering', on: true },
      { text: 'Priority sync placement pitching', on: true },
      { text: 'Split Cascade collaborator ledgers', on: true },
    ],
    cta: 'Top-Up 1,000 Credits',
    style: 'cyan',
    popular: true,
  },
  {
    name: 'Studio Master Pack',
    price: 50.00,
    priceKes: 5000,
    credits: 5000,
    desc: '5,000 Non-Expiring Credits (KSh 5,000). Heavy-duty volume for stems storage, escrow, and DJ pool.',
    packageId: 'studio-master',
    features: [
      { text: '5,000 Non-Expiring Credits', on: true },
      { text: 'Lossless multitrack stem downloads', on: true },
      { text: 'Escrow contract legal protection', on: true },
      { text: 'DJ Record Pool drop clearances', on: true },
      { text: 'White-label dashboards & EPKs', on: true },
      { text: 'Dedicated sync curation support', on: true },
    ],
    cta: 'Top-Up 5,000 Credits',
    style: 'outline',
  },
  {
    name: 'Label Starter Floor',
    price: 50.00,
    priceKes: 5000,
    credits: 5000,
    desc: '5,000 Non-Expiring Credits (KSh 5,000 / $50.00). Label entry floor with multi-seat roster management and statement parsing.',
    packageId: 'label-team-starter',
    team: true,
    features: [
      { text: '5,000 Non-Expiring Credits', on: true },
      { text: 'Multi-seat team accounts (5 seats)', on: true },
      { text: 'Up to 10 signed artist rosters', on: true },
      { text: 'Bulk catalog operations & ISRC validation', on: true },
      { text: 'Direct mobile money bulk split payouts', on: true },
      { text: 'Priority A&R & legal contracts desk', on: true },
    ],
    cta: 'Top-Up 5,000 Credits',
    style: 'outline',
  },
  {
    name: 'Major Label Enterprise',
    price: 200.00,
    priceKes: 20000,
    credits: 20000,
    desc: '20,000 Non-Expiring Credits (KSh 20,000 / $200.00). Enterprise capacity for major catalogs, white-label portals, and bulk payouts.',
    packageId: 'label-enterprise',
    team: true,
    features: [
      { text: '20,000 Non-Expiring Credits', on: true },
      { text: 'Unlimited artist roster size', on: true },
      { text: 'Custom white-label artist portal', on: true },
      { text: 'Direct M-Pesa B2C & bank bulk payouts', on: true },
      { text: 'Enterprise ERP & accounting webhooks', on: true },
      { text: 'Priority Sync Brief network exclusivity', on: true },
    ],
    cta: 'Top-Up 20,000 Credits',
    style: 'outline',
  },
];

const FAQS = [
  {
    q: 'How does the Unified Non-Expiring Credits model work?',
    a: 'Instead of forcing you into recurring monthly subscriptions with high credit card churn, TuneMavens runs on a 100% usage-based Unified Credits model. 1 Credit = KSh 1.00 or $0.01 USD. Credits never expire and are shared across all tools in the TuneMavens ecosystem (EPK Builder, AI Mastering, Sync pitching, WhatsApp alerts, and TuneStream tips).',
  },
  {
    q: 'What is the lowest top-up amount available?',
    a: 'Platformwide, the entry floor top-up is as low as KSH 250 ($2.50 USD) for 250 credits. This makes it effortless to test mastering, customize your EPK, or tip an artist without financial barriers.',
  },
  {
    q: 'How does the single source of truth pricing work for currencies?',
    a: 'Our pricing maintains strict integrity: 1 Credit equals KSh 1.00 Kenyan Shilling, and 100 Credits equal $1.00 USD ($0.01 per credit). Top-ups can be completed via M-Pesa STK push or global cards.',
  },
  {
    q: 'Do Administrators ever need to buy credits?',
    a: 'Never. Platform administrators have permanent, unrestricted system access and are 100% credit-exempt across all workspaces and tools.',
  },
  {
    q: 'Do credits expire if I do not release music immediately?',
    a: 'No. TuneMavens unified credits never expire. You can load 1,000 credits today and use them 6 months or 2 years from now without forfeiture.',
  },
];

export default function PricingView() {
  const { formatPrice, convertPrice, currencyInfo } = useRegion()
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)
  const [showReloadModal, setShowReloadModal] = useState(false);
  const [reloadReason, setReloadReason] = useState('TuneMavens Unified Platform Credits Top-Up');
  const [suggestedPackage, setSuggestedPackage] = useState(null);

  const handleBuy = (plan) => {
    if (plan.price === 0) {
      navigate('/register');
    } else {
      setReloadReason(`Top-Up ${plan.name} (${plan.credits.toLocaleString()} Credits)`);
      setSuggestedPackage(plan.packageId || 'starter-floor');
      setShowReloadModal(true);
    }
  };

  return (
    <>
      <PageHeader title="Credits & Top-Ups" bgImage={headerPricingImg} bgImageWestern={headerPricingWesternImg} breadcrumb="Credits & Pricing" />
      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
        {/* Public Beta Creator Pricing Notice Badge */}
        <div
          className="beta-pricing-notice-badge"
          data-testid="beta-pricing-notice-badge"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            borderLeft: '5px solid #00f0ff',
            borderRadius: '3px',
            padding: '20px 24px',
            marginBottom: '36px',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            maxWidth: '1300px',
            margin: '0 auto 36px auto',
            boxShadow: '0 8px 32px rgba(0, 240, 255, 0.08)'
          }}
        >
          <div style={{
            background: '#00f0ff',
            color: '#0b0f19',
            fontWeight: 900,
            fontSize: '11px',
            letterSpacing: '1.2px',
            padding: '6px 12px',
            borderRadius: '3px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}>
            Public Beta Notice
          </div>
          <div style={{ flex: 1, fontSize: '13.5px', lineHeight: 1.55, color: '#f1f5f9' }}>
            <strong style={{ color: '#00f0ff', fontWeight: 800 }}>
              All Creator Pricing &amp; Credit Reloading Suspended:
            </strong>{' '}
            During the public beta period, all independent creator, artist, and producer pricing (loading credits) is temporarily suspended with 100% complimentary platform access.
            <div style={{ marginTop: '6px', color: '#94a3b8', fontSize: '12.5px' }}>
              The only active commercial personas paying during beta are:{' '}
              <span style={{ color: '#fff', fontWeight: 700 }}>Consumers / Listeners</span> (TuneStream tipping),{' '}
              <span style={{ color: '#fff', fontWeight: 700 }}>Corporates</span> (audio advertising &amp; tour sponsorships),{' '}
              <span style={{ color: '#fff', fontWeight: 700 }}>Media</span> (media house ingestion &amp; broadcast tracking),{' '}
              <span style={{ color: '#fff', fontWeight: 700 }}>Music Supervisors</span> (sync licensing &amp; briefs), and{' '}
              <span style={{ color: '#fff', fontWeight: 700 }}>VCs &amp; Investors</span> (investing in projects &amp; creators).
            </div>
          </div>
        </div>

        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          Top up your balance with non-expiring TM Credits starting as low as KSh 250 ($2.50). No recurring monthly subscriptions — pay only for what you use across the entire TuneMavens and Intermaven ecosystem.
        </p>
        <div className="pricing-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', maxWidth: '1300px' }}>
          {PLANS.map((plan) => (
            <div key={plan.name} className={`pricing-card glass-panel ${plan.popular ? 'premium' : ''}`} style={{ borderRadius: '3px', position: 'relative' }}>
              {plan.popular && <span className="pricing-badge" style={{ borderRadius: '3px' }}>Most Popular</span>}
              {plan.team && <span className="pricing-badge" style={{ background: 'var(--purple)', borderRadius: '3px' }}><RiTeamFill size={12} style={{ marginRight: '4px' }} />Teams</span>}
              {!plan.team && plan.price > 0 && (
                <span className="pricing-badge" style={{ background: 'rgba(0, 240, 255, 0.15)', border: '1px solid #00f0ff', color: '#00f0ff', borderRadius: '3px', top: plan.popular ? '38px' : '10px' }}>
                  Beta: Suspended (Free Access)
                </span>
              )}
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
              <button
                className={`plan-btn ${plan.style}`}
                style={{ borderRadius: '3px' }}
                onClick={() => handleBuy(plan)}
              >
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
          borderRadius: '3px',
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
              Broadcast 15s/30s unskippable audio spots on TuneStream, sponsor creator concert tours, and capture CRM leads starting at 5,000 Unified Credits package ($50.00 / KSh 5,000 one-time load). Zero monthly charges.
            </p>
          </div>
          <button
            onClick={() => navigate('/for/corporate')}
            style={{
              padding: '12px 24px',
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
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

        {/* FAQ Section */}
        <div style={{ marginTop: '72px', maxWidth: '800px', margin: '72px auto 0' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, textAlign: 'center', marginBottom: '8px', color: '#fff' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--mu)', fontSize: '14px', marginBottom: '36px' }}>
            Everything you need to know about TuneMavens unified credits and zero-subscription pricing.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="glass-panel"
                  style={{
                    borderRadius: '3px',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '18px 24px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: '#fff',
                      fontSize: '15px',
                      fontWeight: 700,
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: '18px', color: 'var(--cyan)', transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 24px 20px', color: 'var(--mu)', fontSize: '14px', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <CreditReloadModal
        isOpen={showReloadModal}
        onClose={() => setShowReloadModal(false)}
        reason={reloadReason}
        suggestedPackageId={suggestedPackage}
        onSuccess={(creditsAdded, newBalance) => {
          console.log(`Successfully reloaded ${creditsAdded} credits. New balance: ${newBalance}`);
        }}
      />
    </>
  )
}
