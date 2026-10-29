import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  RiRocketFill,
  RiArrowRightLine,
  RiSparklingFill,
  RiCheckFill,
  RiCloseFill,
  RiFilePdfFill,
  RiShieldCheckFill,
  RiEyeLine,
  RiExternalLinkLine
} from 'react-icons/ri'
import PageHeader from '../../components/common/PageHeader.jsx'
import headerToolsImg from '../../assets/images/header_tools.png'
import headerToolsWesternImg from '../../assets/images/header_tools_western.png'
import { TOOLS_CATALOG } from '../../data/toolsCatalog.js'
import { persistAppActivation } from '../../lib/activatedApps.js'

export default function ToolsView({ sessionUser, onUpdateUser }) {
  const navigate = useNavigate();
  const [previewTool, setPreviewTool] = useState(null);
  
  // Interactive preview state for Artist One-Sheet AI
  const [demoArtistName, setDemoArtistName] = useState('Alex Rivera');
  const [demoGenre, setDemoGenre] = useState('Afro-House / Deep Tech');
  const [demoHometown, setDemoHometown] = useState('Nairobi, Kenya');
  const [demoKeyTrack, setDemoKeyTrack] = useState('Nairobi Sunset Groove');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSheet, setGeneratedSheet] = useState(null);

  const handleTryTool = (tool) => {
    // 1. Save user's specific tool interest and guidance preferences
    sessionStorage.setItem('signup_interest_tool', tool.id);
    sessionStorage.setItem('signup_interest_tool_name', tool.name);
    sessionStorage.setItem('preferred_dashboard_tab', tool.tab);
    sessionStorage.setItem('signup_roles', JSON.stringify([tool.role]));
    sessionStorage.setItem('signup_role', tool.role);
    localStorage.setItem('tunemavens_last_tool_interest', tool.id);

    // 2. If user is already authenticated, activate tool and navigate to dashboard
    if (sessionUser && (sessionUser.email || sessionUser.id)) {
      if (typeof onUpdateUser === 'function') {
        persistAppActivation(tool.appSlug, sessionUser, onUpdateUser);
      } else {
        persistAppActivation(tool.appSlug, sessionUser);
      }
      navigate(`/dashboard?tab=${tool.tab}&tool=${tool.id}`);
      return;
    }

    // 3. If unauthenticated, route into guided onboarding with pre-checked seat
    navigate(`/register?tool=${tool.id}&role=${tool.role}&app=${tool.appSlug}&tab=${tool.tab}&from=tools`);
  };

  const handleOpenDemoModal = (tool) => {
    setPreviewTool(tool);
    if (tool.id === 'artist-one-sheet') {
      handleGenerateSampleSheet();
    }
  };

  const handleGenerateSampleSheet = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedSheet({
        artist: demoArtistName,
        genre: demoGenre,
        hometown: demoHometown,
        keyTrack: demoKeyTrack,
        isrc: 'KE-TM1-26-00842',
        telemetry: {
          monthlyListeners: '350,000+',
          topTerritories: ['Nairobi (KE)', 'London (GB)', 'New York (US)'],
          syncFitScore: '98% High Alignment'
        },
        bioSnippet: `${demoArtistName} is an emerging sonic powerhouse blending traditional East African polyrhythms with cutting-edge ${demoGenre}. Supported by BBC 1Xtra and Boiler Room Nairobi, their catalog is 100% one-stop pre-cleared for global sync placements.`,
        splitStatus: '10,000 Basis Points Executed & Double-Entry Verified'
      });
      setIsGenerating(false);
    }, 400);
  };

  const handleApplyDemoAndProceed = () => {
    if (previewTool) {
      sessionStorage.setItem('signup_name', demoArtistName);
      sessionStorage.setItem('signup_creative_type', demoGenre);
      handleTryTool(previewTool);
    }
  };

  return (
    <>
      <PageHeader 
        title="Music Operations Engine" 
        bgImage={headerToolsImg} 
        bgImageWestern={headerToolsWesternImg} 
        breadcrumb="AI Tools" 
      />

      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>

        {/* Top CTA Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(34,211,238,0.1) 0%, rgba(139,92,246,0.1) 100%)',
          border: '1px solid rgba(34,211,238,0.25)',
          borderRadius: '12px',
          padding: '32px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '40px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ 
                background: 'rgba(0, 240, 255, 0.2)', 
                color: 'var(--cyan, #00f0ff)', 
                fontSize: '11px', 
                fontWeight: 700, 
                padding: '2px 8px', 
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Intelligent Workflows
              </span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>
              <RiRocketFill size={20} style={{ marginRight: '8px', color: 'var(--cyan)' }} />
              Specialized AI Tools Pre-Configured for Your Seat
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--mu)', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
              Choose any tool below to activate guided onboarding. The system automatically pre-selects your role, configures your workspace apps, and carries your selections directly into your dashboard.
            </p>
          </div>
          <button 
            onClick={() => handleTryTool(TOOLS_CATALOG[0])}
            className="btn-primary" 
            style={{ padding: '12px 28px', fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap', cursor: 'pointer' }}
          >
            Try Artist One-Sheet AI <RiArrowRightLine size={14} style={{ marginLeft: '6px' }} />
          </button>
        </div>

        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          Standalone, precision AI modules engineered to automate one-sheet pitching, sync brief matching, LUFS mastering compliance, and immutable split cascades.
        </p>

        {/* Tools Grid */}
        <div className="apps-grid">
          {TOOLS_CATALOG.map((tool) => {
            const Icon = tool.icon;
            const isFree = tool.isFree;
            const isOneSheet = tool.id === 'artist-one-sheet';

            return (
              <div 
                key={tool.id} 
                className="app-card glass-panel glass-panel-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: isOneSheet ? '1px solid rgba(0, 240, 255, 0.35)' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isOneSheet ? '0 0 15px rgba(0, 240, 255, 0.08)' : 'none'
                }}
              >
                {isOneSheet && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0, 240, 255, 0.15)',
                    color: 'var(--cyan, #00f0ff)',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <RiSparklingFill size={10} /> Popular
                  </div>
                )}

                <div className="app-icon-box" style={{ background: 'rgba(34, 211, 238, 0.08)', color: 'var(--cyan)' }}>
                  <Icon size={20} />
                </div>

                <h3 className="app-title" style={{ fontSize: '18px', marginTop: '12px', marginBottom: '6px', color: '#fff' }}>
                  {tool.name}
                </h3>

                <div style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: 600, marginBottom: '8px' }}>
                  Seat: {tool.roleLabel}
                </div>

                <p className="app-desc" style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--mu)', marginBottom: '16px' }}>
                  {tool.desc}
                </p>

                {tool.highlights && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', fontSize: '12px', color: '#94a3b8' }}>
                    {tool.highlights.map((h, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <RiCheckFill size={12} style={{ color: 'var(--cyan)' }} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="app-tag" style={{ fontSize: '11px', padding: '3px 8px' }}>
                    {tool.cost}
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {isOneSheet && (
                      <button
                        type="button"
                        onClick={() => handleOpenDemoModal(tool)}
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#fff',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '4px',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <RiEyeLine size={12} /> Preview
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleTryTool(tool)}
                      data-testid={`try-tool-${tool.id}`}
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: isFree ? '#060813' : '#060813',
                        background: isFree ? '#10b981' : 'var(--cyan, #00f0ff)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      {isFree ? 'Try Free' : 'Try Now'} <RiArrowRightLine size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div style={{
          marginTop: '60px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(6,8,19,0) 0%, rgba(34,211,238,0.04) 100%)',
          borderRadius: '16px',
          padding: '48px 32px',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '12px', fontFamily: '"Sansation", sans-serif' }}>
            Ready to deploy specialized music operations?
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--mu)', marginBottom: '24px', maxWidth: '520px', margin: '0 auto 24px' }}>
            50 non-expiring credits on signup. Zero monthly subscription lock-in. Pick any tool to begin guided setup.
          </p>
          <button 
            onClick={() => handleTryTool(TOOLS_CATALOG[0])}
            className="btn-primary" 
            style={{ padding: '14px 36px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}
          >
            Start with Artist One-Sheet AI <RiArrowRightLine size={14} style={{ marginLeft: '8px' }} />
          </button>
        </div>
      </div>

      {/* Interactive Artist One-Sheet AI Live Preview Modal */}
      {previewTool && previewTool.id === 'artist-one-sheet' && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(6, 8, 19, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setPreviewTool(null)}
        >
          <div 
            style={{
              background: '#0d1124',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '12px',
              maxWidth: '780px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              color: '#fff',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span style={{ color: 'var(--cyan, #00f0ff)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Live Interactive Demo
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '4px 0', fontFamily: 'Sansation, sans-serif' }}>
                  Artist One-Sheet AI Pitch Document
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--mu, #8b949e)', margin: 0 }}>
                  Enter your details below to generate a real-time pitch sheet draft and test the AI.
                </p>
              </div>
              <button 
                onClick={() => setPreviewTool(null)}
                style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer', padding: '4px' }}
              >
                <RiCloseFill size={24} />
              </button>
            </div>

            {/* Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Artist / Brand Name</label>
                <input 
                  type="text" 
                  value={demoArtistName}
                  onChange={(e) => setDemoArtistName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Primary Genre</label>
                <input 
                  type="text" 
                  value={demoGenre}
                  onChange={(e) => setDemoGenre(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Hometown / Hub</label>
                <input 
                  type="text" 
                  value={demoHometown}
                  onChange={(e) => setDemoHometown(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Key Track / Single</label>
                <input 
                  type="text" 
                  value={demoKeyTrack}
                  onChange={(e) => setDemoKeyTrack(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button 
                type="button" 
                onClick={handleGenerateSampleSheet}
                disabled={isGenerating}
                style={{ padding: '8px 18px', background: 'rgba(0, 240, 255, 0.15)', border: '1px solid var(--cyan, #00f0ff)', color: 'var(--cyan, #00f0ff)', borderRadius: '6px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
              >
                {isGenerating ? 'Synthesizing...' : 'Re-Generate One-Sheet'}
              </button>
            </div>

            {/* Generated Sheet Preview Card */}
            {generatedSheet && (
              <div style={{
                background: '#060813',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>
                      {generatedSheet.artist}
                    </h2>
                    <div style={{ fontSize: '13px', color: 'var(--cyan, #00f0ff)', fontWeight: 600 }}>
                      {generatedSheet.genre} · {generatedSheet.hometown}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                      <RiShieldCheckFill size={13} /> {generatedSheet.syncReadiness}
                    </span>
                    <div style={{ fontSize: '11px', color: '#8b949e', marginTop: '4px' }}>
                      ISRC: {generatedSheet.isrc}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#8b949e', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                    Artist Narrative Hook
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#e2e8f0', margin: 0 }}>
                    {generatedSheet.bioSnippet}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#8b949e', textTransform: 'uppercase' }}>Audience Reach</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{generatedSheet.telemetry.monthlyListeners}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#8b949e', textTransform: 'uppercase' }}>Key Single</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--cyan)' }}>{generatedSheet.keyTrack}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#8b949e', textTransform: 'uppercase' }}>Rights Verification</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#10b981' }}>10,000 bps Verified</div>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: '#8b949e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RiFilePdfFill size={14} style={{ color: '#ef4444' }} />
                  <span>PDF Export Template: Standard 1-Page Booking & Sync Pitch Sheet</span>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
              <button 
                type="button" 
                onClick={() => setPreviewTool(null)}
                style={{ padding: '10px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
              >
                Close
              </button>
              <button 
                type="button" 
                onClick={handleApplyDemoAndProceed}
                style={{ padding: '10px 24px', background: 'var(--cyan, #00f0ff)', border: 'none', color: '#060813', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Use This Selection & Open in Creator Hub <RiArrowRightLine size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
