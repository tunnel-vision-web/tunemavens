import React from 'react'
import { RiRadioFill, RiCpuFill, RiFileTextFill, RiKey2Fill, RiSettings3Fill, RiBarChartFill, RiLockFill, RiTerminalFill, RiGlobalFill } from 'react-icons/ri'
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
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          Standalone, precise AI modules designed to automate formatting, contracts, mastering compliance, and catalog pitching.
        </p>
        <div className="apps-grid">
          {tools.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div key={idx} className="app-card glass-panel glass-panel-hover">
                <div className="app-icon-box" style={{ background: 'rgba(34, 211, 238, 0.08)', color: 'var(--cyan)' }}>
                  <Icon size={20} />
                </div>
                <h3 className="app-title">{t.name}</h3>
                <p className="app-desc">{t.desc}</p>
                <span className="app-tag">{t.cost}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  )
}
