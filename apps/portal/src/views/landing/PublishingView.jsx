import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  RiBookOpenFill, RiGlobalLine, RiExchangeDollarLine, 
  RiCheckboxCircleLine, RiContractLine, RiSearchLine, 
  RiShieldCheckFill, RiSparklingFill, RiArrowRightLine,
  RiBuildingLine, RiFileCodeLine, RiCloseLine, RiCheckLine,
  RiInformationLine, RiCheckboxCircleFill
} from 'react-icons/ri';
import PageHeader from '../../components/common/PageHeader.jsx';
import AppHelpAiControls from '../../components/common/AppHelpAiControls.jsx';
import headerAppsImg from '../../assets/images/header_apps.png';
import headerAppsWesternImg from '../../assets/images/header_apps_western.png';
import publishingDashboardActual from '../../assets/images/publishing_dashboard_actual.png';
import SEO from '../../components/common/SEO.jsx';
import { publishingApi } from '../../lib/api';

export default function PublishingView({ sessionUser }) {
  const ctaLink = sessionUser ? '/dashboard?tab=publishing-election' : '/register';

  // State for Societies Directory
  const [societies, setSocieties] = useState([]);
  const [loadingSocieties, setLoadingSocieties] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');
  const [directOnly, setDirectOnly] = useState(false);

  // Sign-Up Onboarding Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [writerName, setWriterName] = useState(sessionUser?.name || '');
  const [writerEmail, setContactEmail] = useState(sessionUser?.email || '');
  const [proAffiliation, setProAffiliation] = useState('Direct / None (TuneMavens Assign)');
  const [catalogueSize, setCatalogueSize] = useState('1 - 10 Tracks');
  const [selectedTier, setSelectedTier] = useState('standard_admin');
  const [onboardSuccess, setOnboardSuccess] = useState(false);

  useEffect(() => {
    setLoadingSocieties(true);
    publishingApi.getSocieties()
      .then(res => {
        if (res?.societies && Array.isArray(res.societies)) {
          setSocieties(res.societies);
        }
      })
      .catch(err => {
        console.warn('Could not load societies:', err);
      })
      .finally(() => {
        setLoadingSocieties(false);
      });
  }, []);

  const filteredSocieties = societies.filter(s => {
    const matchesSearch = !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = activeRegion === 'All' || s.region.toLowerCase() === activeRegion.toLowerCase();
    const matchesDirect = !directOnly || s.direct_integration;
    return matchesSearch && matchesRegion && matchesDirect;
  });

  const regions = ['All', 'Global Direct', 'North America', 'Africa', 'Europe', 'Asia-Pacific', 'Latin America', 'Middle East'];

  const handleCompleteSignUp = (e) => {
    e.preventDefault();
    setOnboardSuccess(true);
    setTimeout(() => {
      setOnboardSuccess(false);
      setIsModalOpen(false);
      window.location.href = sessionUser ? '#/dashboard?tab=publishing-election' : '#/register';
    }, 1800);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "TuneMavens Publishing Administration",
    "description": "Collect global mechanical royalties, sync placement rights, and 155+ PRO & CMO society clearances with 100% composer share retention.",
    "provider": {
      "@type": "Organization",
      "name": "TuneMavens"
    }
  };

  return (
    <>
      <SEO 
        title="Publishing Administration & Songwriter Rights" 
        description="Collect global mechanical royalties, sync placement rights, and 155+ PRO & CMO society clearances with 100% composer share retention."
        schema={schema}
      />
      <PageHeader 
        title="TuneMavens Publishing" 
        bgImage={headerAppsImg} 
        bgImageWestern={headerAppsWesternImg} 
        breadcrumb="Publishing Administration" 
      />
      <AppHelpAiControls activeContext="publishing" sessionUser={sessionUser} floating={true} />
      
      <div className="container" style={{ paddingBottom: '80px', marginTop: '50px' }}>
        {/* Intro Hero Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center', marginBottom: '70px' }}>
          <div>
            <span style={{ 
              color: 'var(--cyan, #22d3ee)', 
              fontSize: '12px', 
              fontWeight: 800, 
              letterSpacing: '2px', 
              textTransform: 'uppercase', 
              display: 'inline-block', 
              marginBottom: '10px',
              background: 'rgba(34, 211, 238, 0.1)',
              padding: '4px 10px',
              borderRadius: '3px',
              border: '1px solid rgba(34, 211, 238, 0.25)'
            }}>
              155+ PRO & CMO Societies Worldwide
            </span>
            <h2 style={{ fontSize: '34px', fontWeight: 800, color: '#fff', marginBottom: '16px', lineHeight: 1.2 }}>
              Maximize Your Songwriter & Composition Rights
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
              Every time your music is streamed, broadcast on terrestrial radio or TV, or synced into films and games, it generates publishing royalties. 
              TuneMavens Publishing automatically administers your catalog across The MLC, ASCAP, BMI, PRS, MCPS, AMRA, and African collection societies (MCSK, SAMRO, COSON, CAPASSO) 
              so you collect 100% of your earnings worldwide.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                <RiCheckboxCircleLine style={{ color: 'var(--cyan, #22d3ee)' }} size={18} />
                <span>Automated Common Works Registration (CISAC CWR 2.1) batch delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                <RiCheckboxCircleLine style={{ color: 'var(--cyan, #22d3ee)' }} size={18} />
                <span>100% Composer share retention with instant digital mechanical collections via The MLC</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                <RiCheckboxCircleLine style={{ color: 'var(--cyan, #22d3ee)' }} size={18} />
                <span>Lossless Sync Clearance & Automated Cue Sheet generation for film, TV, and gaming</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-primary" 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '12px 26px', 
                  borderRadius: '3px', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)'
                }}
              >
                Start Publishing Now <RiArrowRightLine size={16} />
              </button>
              <Link
                to={ctaLink}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  borderRadius: '3px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid #334155',
                  color: '#e2e8f0',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Access Songwriter Console
              </Link>
            </div>
          </div>
          
          {/* Dashboard Preview Image (Reflecting Actual Backend Application) */}
          <div style={{ 
            background: 'rgba(15, 23, 42, 0.65)', 
            border: '1px solid rgba(34, 211, 238, 0.25)', 
            borderRadius: '3px', 
            padding: '8px',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.8)' 
          }}>
            <img 
              src={publishingDashboardActual} 
              alt="TuneMavens Publishing Administration Suite" 
              style={{ width: '100%', borderRadius: '3px', display: 'block', border: '1px solid #1e293b' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', fontSize: '11px', color: '#94a3b8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                Live Live Telemetry & CWR Radar
              </span>
              <span>155+ Direct Society Integrations</span>
            </div>
          </div>
        </div>

        {/* Flagship Collection Societies Ribbon */}
        <div style={{
          background: 'linear-gradient(90deg, rgba(34, 211, 238, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
          border: '1px solid rgba(34, 211, 238, 0.2)',
          borderRadius: '3px',
          padding: '24px 32px',
          marginBottom: '70px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--cyan, #22d3ee)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Flagship Mechanical & Performance Direct Network
            </span>
            <h4 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 700, color: '#fff' }}>
              Direct Electronic Delivery to the World's Major Collection Hubs
            </h4>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            {['The MLC', 'ASCAP', 'BMI', 'MCSK', 'SAMRO', 'PRS for Music', 'AMRA', 'SACEM'].map((hub) => (
              <div key={hub} style={{
                background: '#161e2e',
                border: '1px solid #2d3748',
                borderRadius: '3px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#fff'
              }}>
                {hub}
              </div>
            ))}
          </div>
        </div>

        {/* 150+ Global PRO & CMO Interactive Directory */}
        <div style={{
          background: '#0d1322',
          border: '1px solid #1e293b',
          borderRadius: '3px',
          padding: '36px 32px',
          marginBottom: '70px'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 32px' }}>
            <span style={{ color: 'var(--cyan, #22d3ee)', fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Global Protection Footprint
            </span>
            <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '6px', marginBottom: '12px' }}>
              Explore the 155+ Supported Collection Societies
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
              From Nairobi to New York, London, Paris, and Tokyo — TuneMavens connects your compositions directly with statutory collective management bodies worldwide.
            </p>
          </div>

          {/* Search & Territory Filter Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <RiSearchLine style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} size={16} />
                <input
                  type="text"
                  placeholder="Search 155+ societies by name, code, or country (e.g. MCSK, ASCAP, SAMRO, CAPASSO)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#161e2e',
                    border: '1px solid #2d3748',
                    borderRadius: '3px',
                    padding: '10px 12px 10px 36px',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: '#cbd5e1',
                cursor: 'pointer',
                background: '#161e2e',
                border: '1px solid #2d3748',
                padding: '8px 12px',
                borderRadius: '3px'
              }}>
                <input
                  type="checkbox"
                  checked={directOnly}
                  onChange={(e) => setDirectOnly(e.target.checked)}
                />
                Direct Integration Only
              </label>
            </div>

            {/* Region Filter Buttons */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {regions.map(region => (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  style={{
                    background: activeRegion === region ? 'var(--cyan, #22d3ee)' : '#161e2e',
                    border: '1px solid #2d3748',
                    color: activeRegion === region ? '#000' : '#cbd5e1',
                    padding: '6px 12px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Societies Directory Grid */}
          {loadingSocieties ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              Loading global collection societies...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
              maxHeight: '520px',
              overflowY: 'auto',
              paddingRight: '6px'
            }}>
              {filteredSocieties.map((soc) => (
                <div
                  key={soc.id}
                  style={{
                    background: '#161e2e',
                    border: '1px solid #1e293b',
                    borderRadius: '3px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{
                        background: 'rgba(34, 211, 238, 0.12)',
                        border: '1px solid rgba(34, 211, 238, 0.3)',
                        color: 'var(--cyan, #22d3ee)',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '3px'
                      }}>
                        {soc.code}
                      </span>
                      {soc.direct_integration && (
                        <span style={{
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          color: '#34d399',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '3px'
                        }}>
                          Direct
                        </span>
                      )}
                    </div>
                    <h5 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                      {soc.name}
                    </h5>
                    <div style={{ fontSize: '12px', color: '#38bdf8', marginBottom: '8px' }}>
                      {soc.country} • <span style={{ color: '#94a3b8' }}>{soc.type}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
                      {soc.description}
                    </p>
                  </div>

                  <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #1e293b', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {(soc.collection_types || []).slice(0, 2).map((col, idx) => (
                      <span key={idx} style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '10px',
                        color: '#cbd5e1'
                      }}>
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Splits & Standard Administration Terms */}
        <div 
          style={{ 
            padding: '48px 40px', 
            borderRadius: '3px', 
            background: 'radial-gradient(ellipse at top left, rgba(34, 211, 238, 0.05) 0%, transparent 60%)', 
            border: '1px solid rgba(34, 211, 238, 0.15)', 
            marginBottom: '70px' 
          }}
        >
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
            <h3 style={{ fontSize: '26px', color: 'var(--cyan, #22d3ee)', fontWeight: 800, marginBottom: '16px' }}>
              Transparent Publishing Administration Models
            </h3>
            <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '32px' }}>
              TuneMavens administers publishing rights worldwide under ASCAP 928371, giving songwriters three flexible institutional structures:
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '36px' }}>
              {/* Option A */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--cyan, #22d3ee)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Option A: Administrator Mode</span>
                <strong style={{ fontSize: '24px', color: '#10b981', display: 'block', marginBottom: '4px' }}>10% Admin Fee</strong>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
                  TuneMavens acts as administrator. We charge a modest 10% fee on all collected royalties. You keep 90% of all gross collections + 100% of your composer share.
                </p>
              </div>

              {/* Option B */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: '#a855f7', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Option B: Publishing House Mode</span>
                <strong style={{ fontSize: '24px', color: '#fff', display: 'block', marginBottom: '4px' }}>50/50 Co-Publishing</strong>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
                  TuneMavens acts as publishing house. We retain the 50% Publisher Share per standard music publishing law, and actively pitch your catalogue for global sync & placements.
                </p>
              </div>

              {/* Option C */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '11px', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Option C: Catalogue Advances</span>
                <strong style={{ fontSize: '24px', color: '#f59e0b', display: 'block', marginBottom: '4px' }}>Upfront Liquidity</strong>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
                  Take a recoupable upfront cash advance against your catalog from our institutional capital partners, with automated sweep recoupment.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.05)', maxWidth: '640px', margin: '0 auto' }}>
              <RiContractLine style={{ color: 'var(--cyan, #22d3ee)' }} size={24} />
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, textAlign: 'left' }}>
                <strong>Need custom deal terms?</strong> Full counterparty negotiation is built into the backend. 
                Draft custom splits, lock in cue sheet guarantees, or request advance facilities through the dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Administration Flow Steps */}
        <div style={{ marginBottom: '60px' }}>
          <h3 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '36px' }}>
            The 3-Step Publishing Workflow
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#0d1322', border: '1px solid #1e293b', padding: '24px', borderRadius: '3px' }}>
              <div style={{ color: 'var(--cyan, #22d3ee)', fontSize: '22px', fontWeight: 800, marginBottom: '10px' }}>01</div>
              <h4 style={{ fontSize: '16px', color: '#fff', marginBottom: '8px' }}>Register Compositions & Splits</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                Input song title, co-writers, CAE/IPI numbers, and splits. Our engine automatically generates matching ISWC hashes and pairs them with ISRC recordings.
              </p>
            </div>
            <div style={{ background: '#0d1322', border: '1px solid #1e293b', padding: '24px', borderRadius: '3px' }}>
              <div style={{ color: '#a855f7', fontSize: '22px', fontWeight: 800, marginBottom: '10px' }}>02</div>
              <h4 style={{ fontSize: '16px', color: '#fff', marginBottom: '8px' }}>Electronic CWR Society Batch</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                Compositions are compiled into CISAC CWR 2.1 standard electronic files and transmitted directly to The MLC, ASCAP, BMI, PRS, and African CMOs.
              </p>
            </div>
            <div style={{ background: '#0d1322', border: '1px solid #1e293b', padding: '24px', borderRadius: '3px' }}>
              <div style={{ color: '#10b981', fontSize: '22px', fontWeight: 800, marginBottom: '10px' }}>03</div>
              <h4 style={{ fontSize: '16px', color: '#fff', marginBottom: '8px' }}>Automatic Royalty Payouts</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                Mechanical, performance, and sync cue royalties flow through our Compensation Engine directly to co-writers via M-Pesa, Stripe, or direct bank transfer.
              </p>
            </div>
          </div>
        </div>

        {/* Final Conversion CTA */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            Ready to secure your global songwriting royalties?
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '600px', margin: '0 auto 24px' }}>
            Join songwriters, composers, and producers collecting worldwide royalties across 155+ societies with TuneMavens.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '14px 32px', 
              borderRadius: '3px', 
              fontWeight: 700, 
              fontSize: '15px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(6, 182, 212, 0.35)'
            }}
          >
            Start Publishing with TuneMavens <RiArrowRightLine size={18} />
          </button>
        </div>
      </div>

      {/* Onboarding Sign Up Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5, 7, 15, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0d111c',
            border: '1px solid #1e293b',
            borderRadius: '3px',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            color: '#f8fafc',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RiBookOpenFill color="var(--cyan, #22d3ee)" size={22} />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                  Start TuneMavens Publishing
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <RiCloseLine size={24} />
              </button>
            </div>

            <form onSubmit={handleCompleteSignUp} style={{ padding: '24px' }}>
              {onboardSuccess ? (
                <div style={{
                  padding: '30px',
                  textAlign: 'center',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '3px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <RiCheckboxCircleFill size={36} color="#10b981" />
                  <h4 style={{ margin: '12px 0 4px', fontSize: '18px', color: '#fff' }}>Publishing Workspace Initialized!</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1' }}>
                    Redirecting to your publishing dashboard to register your first composition...
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Songwriter / Author Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ndufo Mwangi"
                      value={writerName}
                      onChange={(e) => setWriterName(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#161e2e',
                        border: '1px solid #2d3748',
                        borderRadius: '3px',
                        padding: '10px 12px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="artist@tunemavens.com"
                      value={writerEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#161e2e',
                        border: '1px solid #2d3748',
                        borderRadius: '3px',
                        padding: '10px 12px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                        Current PRO Affiliation
                      </label>
                      <select
                        value={proAffiliation}
                        onChange={(e) => setProAffiliation(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#161e2e',
                          border: '1px solid #2d3748',
                          borderRadius: '3px',
                          padding: '10px 12px',
                          color: '#fff',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      >
                        <option value="Direct / None (TuneMavens Assign)">None / Let TuneMavens Assign</option>
                        <option value="ASCAP (USA)">ASCAP (USA)</option>
                        <option value="BMI (USA)">BMI (USA)</option>
                        <option value="MCSK (Kenya)">MCSK (Kenya)</option>
                        <option value="SAMRO (South Africa)">SAMRO (South Africa)</option>
                        <option value="PRS for Music (UK)">PRS for Music (UK)</option>
                        <option value="SOCAN (Canada)">SOCAN (Canada)</option>
                        <option value="Other">Other Global Society</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                        Catalogue Size
                      </label>
                      <select
                        value={catalogueSize}
                        onChange={(e) => setCatalogueSize(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#161e2e',
                          border: '1px solid #2d3748',
                          borderRadius: '3px',
                          padding: '10px 12px',
                          color: '#fff',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      >
                        <option value="1 - 10 Tracks">1 - 10 Tracks</option>
                        <option value="11 - 50 Tracks">11 - 50 Tracks</option>
                        <option value="51 - 200 Tracks">51 - 200 Tracks</option>
                        <option value="200+ Tracks (Full Catalogue)">200+ Tracks (Full Catalogue)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Publishing Administration Tier
                    </label>
                    <select
                      value={selectedTier}
                      onChange={(e) => setSelectedTier(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#161e2e',
                        border: '1px solid #2d3748',
                        borderRadius: '3px',
                        padding: '10px 12px',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    >
                      <option value="standard_admin">Standard Administration (10% Fee, You keep 90%)</option>
                      <option value="full_service_copub">Full-Service Co-Publishing (Active Pitching & Sync)</option>
                      <option value="catalogue_acquisition">Catalogue Advance / Liquidity Facility</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #334155',
                        color: '#94a3b8',
                        padding: '10px 18px',
                        borderRadius: '3px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                        border: 'none',
                        color: '#fff',
                        padding: '10px 24px',
                        borderRadius: '3px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Create Publishing Account
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
