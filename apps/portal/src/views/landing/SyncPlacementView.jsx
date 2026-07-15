import React from 'react'
import { Link } from 'react-router-dom'
import { RiSearchLine, RiShieldKeyholeLine, RiFlashlightLine, RiCheckboxCircleLine } from 'react-icons/ri'
import PageHeader from '../../components/common/PageHeader.jsx'
import syncHeaderImg from '../../assets/images/sync_header.png'
import { getServiceUrl } from '../../components/PerfectForSidebar.jsx'

export default function SyncPlacementView({ sessionUser }) {
  const syncMavensUrl = getServiceUrl('syncmavens');

  const features = [
    {
      title: "Quick-Clear & One-Stop",
      desc: "Pre-cleared master and publishing rights, making your catalog instantly ready for high-velocity supervisor requests.",
      icon: <RiShieldKeyholeLine size={24} style={{ color: 'var(--cyan)' }} />
    },
    {
      title: "Advanced Semantic Search",
      desc: "Music supervisors can discover your tracks using intuitive tag queries, vocal style filters, and acoustic features.",
      icon: <RiSearchLine size={24} style={{ color: 'var(--cyan)' }} />
    },
    {
      title: "Real-time Brief Pitching",
      desc: "Get notified when major studios submit licensing briefs. Pitch your tracks directly with single-click submissions.",
      icon: <RiFlashlightLine size={24} style={{ color: 'var(--cyan)' }} />
    }
  ];

  return (
    <>
      <PageHeader 
        title="Sync Licensing & Placement" 
        bgImage={syncHeaderImg} 
        bgImageWestern={syncHeaderImg} 
        breadcrumb="Sync Placement" 
      />
      
      <div className="container" style={{ paddingBottom: '80px', marginTop: '50px' }}>
        {/* Intro */}
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            SyncMavens Licensing Portal
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            Place Your Tracks in Movies, TV, & Games
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6', maxWidth: '650px', margin: '0 auto' }}>
            We bridge the gap between global music creators and supervisors looking for the perfect soundtrack. 
            Automate split cascades, clear composition & master rights in seconds, and secure premium placements.
          </p>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '64px' }}>
          {features.map((feat, i) => (
            <div 
              key={i} 
              className="glass-panel glass-panel-hover" 
              style={{ 
                padding: '32px 24px', 
                borderRadius: '4px', 
                border: '1px solid rgba(255,255,255,0.05)', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start',
                textAlign: 'left',
                gap: '16px'
              }}
            >
              <div style={{ background: 'rgba(0, 242, 254, 0.05)', padding: '10px', borderRadius: '4px' }}>
                {feat.icon}
              </div>
              <h4 style={{ margin: 0, fontSize: '18px', color: '#fff', fontWeight: 'bold' }}>{feat.title}</h4>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Highlight Checklist */}
        <div 
          className="glass-panel" 
          style={{ 
            background: 'rgba(11, 15, 30, 0.6)', 
            border: '1px solid rgba(255,255,255,0.06)', 
            borderRadius: '6px', 
            padding: '40px', 
            maxWidth: '800px', 
            margin: '0 auto 64px', 
            textAlign: 'left' 
          }}
        >
          <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '24px', textAlign: 'center', fontWeight: 'bold' }}>
            The SyncMavens Advantage
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#cbd5e1' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
              <span>100% automated waterfall payout splits</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#cbd5e1' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
              <span>Direct pitching queue for AAA games & Netflix briefs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#cbd5e1' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
              <span>Custom metadata ingestion for perfect matches</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#cbd5e1' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
              <span>ASCAP-integrated writer & publisher registration</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            Unlock placements for your music catalogue
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '600px', margin: '0 auto 24px' }}>
            Explore open licensing briefs, review compatibility match scores, and submit your masters to music supervisors.
          </p>
          <a 
            href={syncMavensUrl}
            className="btn-primary" 
            style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}
          >
            Launch SyncMavens Platform
          </a>
        </div>
      </div>
    </>
  );
}
