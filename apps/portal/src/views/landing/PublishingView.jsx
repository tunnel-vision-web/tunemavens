import React from 'react'
import { Link } from 'react-router-dom'
import { RiBookOpenFill, RiGlobalLine, RiExchangeDollarLine, RiCheckboxCircleLine, RiContractLine } from 'react-icons/ri'
import PageHeader from '../../components/common/PageHeader.jsx'
import headerAppsImg from '../../assets/images/header_apps.png'
import headerAppsWesternImg from '../../assets/images/header_apps_western.png'
import publishingDashboardMockup from '../../assets/images/publishing_dashboard_mockup.png'
import SEO from '../../components/common/SEO.jsx'

export default function PublishingView({ sessionUser }) {
  const ctaLink = sessionUser ? '/dashboard?tab=publishing-election' : '/register';

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "TuneMavens Publishing Administration",
    "description": "Lock in your publishing tier to collect global mechanical royalties, sync representation, and splits administration.",
    "provider": {
      "@type": "Organization",
      "name": "TuneMavens"
    }
  };

  return (
    <>
      <SEO 
        title="Publishing Administration" 
        description="Lock in your publishing tier to collect global mechanical royalties, sync representation, and splits administration."
        schema={schema}
      />
      <PageHeader 
        title="TuneMavens Publishing" 
        bgImage={headerAppsImg} 
        bgImageWestern={headerAppsWesternImg} 
        breadcrumb="Publishing Administration" 
      />
      
      <div className="container" style={{ paddingBottom: '80px', marginTop: '50px' }}>
        {/* Intro Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center', marginBottom: '70px' }}>
          <div>
            <span style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Global Rights & Royalty Collection
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '16px', lineHeight: 1.2 }}>
              Maximize Your Songwriter Rights
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
              Every time your music is streamed, broadcast, or performed in public, it generates publishing royalties. 
              TuneMavens Publishing manages ASCAP, BMI, PRS, MCPS, AMRA, and local African collection societies (like SAMRO, MCSK, COSON) 
              so you collect every single cent worldwide.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                <RiCheckboxCircleLine style={{ color: 'var(--cyan)' }} size={18} />
                <span>Global registration across 150+ countries</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                <RiCheckboxCircleLine style={{ color: 'var(--cyan)' }} size={18} />
                <span>Lossless mechanical royalty tracking on Spotify & Apple Music</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                <RiCheckboxCircleLine style={{ color: 'var(--cyan)' }} size={18} />
                <span>Full integration with our Sync Placements Network</span>
              </div>
            </div>
            <Link 
              to={ctaLink} 
              className="btn-primary" 
              style={{ display: 'inline-block', padding: '12px 24px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}
            >
              Sign Up for TuneMavens Publishing
            </Link>
          </div>
          
          {/* Dashboard Preview Image */}
          <div className="glass-panel" style={{ padding: '8px', borderRadius: '8px', overflow: 'hidden' }}>
            <img 
              src={publishingDashboardMockup} 
              alt="TuneMavens Publishing Console Mockup" 
              style={{ width: '100%', borderRadius: '4px', display: 'block' }} 
            />
          </div>
        </div>

        {/* Splits and Negotiations */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '48px 40px', 
            borderRadius: '6px', 
            background: 'radial-gradient(ellipse at top left, rgba(34, 211, 238, 0.05) 0%, transparent 60%)', 
            border: '1px solid rgba(34, 211, 238, 0.15)', 
            marginBottom: '70px' 
          }}
        >
          <div style={{ maxWidth: '750px', margin: '0 auto', textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', color: 'var(--cyan)', fontWeight: 800, marginBottom: '16px' }}>
              Standard Publishing Split Structure via ASCAP
            </h3>
            <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '32px' }}>
              TuneMavens administers publishing rights primarily through ASCAP, offering two standard options for administering your catalogue royalties:
            </p>
            
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '36px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px 30px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', minWidth: '280px', textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--cyan)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Option A: Administrator Mode</span>
                <strong style={{ fontSize: '24px', color: '#10b981', display: 'block', marginBottom: '4px' }}>10% Admin Fee</strong>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
                  TuneMavens acts as administrator, charging a 10% fee on all royalties collected. You keep 90% of all gross revenues.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px 30px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', minWidth: '280px', textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--purple)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Option B: Publishing House Mode</span>
                <strong style={{ fontSize: '24px', color: '#fff', display: 'block', marginBottom: '4px' }}>50/50 Total Split</strong>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
                  TuneMavens acts as publishing house. We retain the 50% Publisher Share per standard music publishing law, and you receive the 50% Composer Share.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '14px 20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', maxWidth: '600px', margin: '0 auto' }}>
              <RiContractLine style={{ color: 'var(--cyan)' }} size={24} />
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, textAlign: 'left' }}>
                <strong>Need custom terms?</strong> Negotiation is built right into the platform. 
                You can draft custom splits, request catalogue advances, or configure full-service co-publishing through our interactive 
                <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}> Negotiating & Contracting Console</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Administration Flow */}
        <div style={{ marginBottom: '60px' }}>
          <h3 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '40px' }}>
            The TuneMavens Publishing Workflow
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color: 'var(--cyan)', fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>01</div>
              <h4 style={{ fontSize: '16px', color: '#fff', marginBottom: '8px' }}>Upload Works & Splits</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                Load your catalog tracks and split shares directly from your creator dashboard or via sync splits ledgers.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color: 'var(--purple)', fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>02</div>
              <h4 style={{ fontSize: '16px', color: '#fff', marginBottom: '8px' }}>Global Registration</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                TuneMavens registers your songs with Performance and Mechanical societies worldwide, capturing matching ISRC & ISWC hashes.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>03</div>
              <h4 style={{ fontSize: '16px', color: '#fff', marginBottom: '8px' }}>Settle Royalties</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                Incoming royalty payments enter the Compensation Engine and are automatically disbursed according to your splits sheet.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            Ready to secure your global royalties?
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '600px', margin: '0 auto 24px' }}>
            Sign up to access TuneMavens Publishing, register your works, and secure your sync placement contracts.
          </p>
          <Link 
            to={ctaLink} 
            className="btn-primary" 
            style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}
          >
            Start Publishing Now
          </Link>
        </div>
      </div>
    </>
  );
}
