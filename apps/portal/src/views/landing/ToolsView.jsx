import React from 'react'
import { Link } from 'react-router-dom'
import { RiRadioFill, RiCpuFill, RiFileTextFill, RiKey2Fill, RiSettings3Fill, RiBarChartFill, RiLockFill, RiTerminalFill, RiGlobalFill, RiRocketFill, RiArrowRightLine } from 'react-icons/ri'
import PageHeader from '../../components/common/PageHeader.jsx'

import headerToolsImg from '../../assets/images/header_tools.png'
import headerToolsWesternImg from '../../assets/images/header_tools_western.png'

export default function ToolsView() {
  const tools = [
    { name: 'Sync Brief AI', icon: RiRadioFill, desc: 'Translates video descriptions and creative scripts into specific sync descriptors.', cost: '10 credits' },
    { name: 'Mastering Brief AI', icon: RiCpuFill, desc: 'Optimizes output loudness targets (LUFS) and peaks based on reference tracks.', cost: '15 credits' },
    { name: 'Artist One-Sheet AI', icon: RiFileTextFill, desc: 'Compiles your brand and catalog details into a clean PDF one-sheet pitch document.', cost: '5 credits' },
    { name: 'Remix License Generator', icon: RiKey2Fill, desc: 'Generates stem clearance and royalty share contracts for collaborative remixes.', cost: 'Free' },
    { name: 'Broadcast Report Formatter', icon: RiSettings3Fill, desc: 'Formats and compiles broadcast playlogs to fit compliance reporting sheets.', cost: 'Free' },
    { name: 'Royalty Statement AI', icon: RiBarChartFill, desc: 'Audits bulk royalty statement payouts and exports split ledgers.', cost: '20 credits' },
    { name: 'Release Planner', icon: RiFileTextFill, desc: 'Coordinates store distribution deadlines and media campaign dates.', cost: 'Free' },
    { name: 'Music NFT Brief', icon: RiLockFill, desc: 'Designs metadata token structures for web3 releases and catalog registration.', cost: '25 credits' },
    { name: 'ISRC Generator', icon: RiTerminalFill, desc: 'Allocates and registers validated track tracking codes.', cost: 'Free' },
    { name: 'Playlist Pitch AI', icon: RiGlobalFill, desc: 'Automates curator pitching emails based on your genre tags and references.', cost: '10 credits' },
  ];

  return (
    <>
      <PageHeader title="Music Operations Engine" bgImage={headerToolsImg} bgImageWestern={headerToolsWesternImg} breadcrumb="AI Tools" />
      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>

        {/* Top CTA Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(139,92,246,0.08) 100%)',
          border: '1px solid rgba(34,211,238,0.15)',
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
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>
              <RiRocketFill size={18} style={{ marginRight: '8px', color: 'var(--cyan)' }} />
              Try Every Tool — Free
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--mu)', margin: 0 }}>
              Sign up and get 50 free credits to test any AI tool. No credit card required.
            </p>
          </div>
          <Link to="/register" className="btn-primary" style={{ padding: '12px 28px', fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap' }}>
            Start Free <RiArrowRightLine size={14} style={{ marginLeft: '6px' }} />
          </Link>
        </div>

        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          Standalone, precise AI modules designed to automate formatting, contracts, mastering compliance, and catalog pitching.
        </p>
        <div className="apps-grid">
          {tools.map((t, idx) => {
            const Icon = t.icon;
            const isFree = t.cost === 'Free';
            return (
              <div key={idx} className="app-card glass-panel glass-panel-hover">
                <div className="app-icon-box" style={{ background: 'rgba(34, 211, 238, 0.08)', color: 'var(--cyan)' }}>
                  <Icon size={20} />
                </div>
                <h3 className="app-title">{t.name}</h3>
                <p className="app-desc">{t.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', gap: '10px' }}>
                  <span className="app-tag">{t.cost}</span>
                  <Link
                    to={isFree ? '/register' : '/register'}
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: isFree ? 'var(--gr)' : 'var(--cyan)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {isFree ? 'Try Free' : 'Try Now'} <RiArrowRightLine size={12} />
                  </Link>
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
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '12px', fontFamily: '"Sansation", sans-serif' }}>
            Ready to supercharge your workflow?
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--mu)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            50 free credits on signup. No subscription needed. Pay only for what you use.
          </p>
          <Link to="/register" className="btn-primary" style={{ padding: '14px 36px', fontSize: '15px', fontWeight: 700 }}>
            Start Free Trial <RiArrowRightLine size={14} style={{ marginLeft: '8px' }} />
          </Link>
        </div>
      </div>
    </>
  )
}
