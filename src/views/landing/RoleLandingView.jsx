import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { PERFECT_FOR_ROLES } from '../../components/PerfectForSidebar.jsx'

import creatorDashboardImg from '../../assets/images/creator_dashboard.png'
import distributeHeroImg from '../../assets/images/distribute_hero.png'
import userSupervisorImg from '../../assets/images/user_supervisor.png'
import consumerAppImg from '../../assets/images/consumer_app.png'
import appsLedgerImg from '../../assets/images/apps_ledger.png'
import userManagerImg from '../../assets/images/user_manager.png'
import appsSyncImg from '../../assets/images/apps_sync.png'
import listenHeroImg from '../../assets/images/listen_hero.png'

function getRoleLandingBackground(role) {
  switch (role) {
    case 'creator': return 'rgba(34, 211, 238, 0.03)';
    case 'exec': return 'rgba(139, 92, 246, 0.03)';
    case 'supervisor': return 'rgba(245, 158, 11, 0.03)';
    case 'consumer': return 'rgba(16, 185, 129, 0.03)';
    case 'booking-agent': return 'rgba(37, 99, 235, 0.03)';
    case 'manager': return 'rgba(239, 68, 68, 0.03)';
    default: return 'transparent';
  }
}

export default function RoleLandingView() {
  const { role } = useParams();
  const meta = PERFECT_FOR_ROLES.find(r => r.key === role);

  if (!meta) {
    return (
      <div className="landing-section landing-section-alt" data-testid="role-landing-not-found">
        <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <span className="landing-section-eyebrow">Not found</span>
          <h1 className="landing-section-title" style={{ marginTop: 12 }}>
            We don't have a landing page for "{role}" yet.
          </h1>
          <p className="landing-lede" style={{ margin: '16px auto 24px', maxWidth: 560 }}>
            Pick a role from the "Perfect for" sidebar to see what TuneMavens
            looks like from that seat.
          </p>
          <Link to="/" className="btn btn-primary" data-testid="role-landing-home-link">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const { label, sub, accent } = meta;

  const BACKGROUNDS = {
    creator: creatorDashboardImg,
    exec: distributeHeroImg,
    supervisor: userSupervisorImg,
    consumer: consumerAppImg,
    'booking-agent': appsLedgerImg,
    manager: userManagerImg,
    companion: appsSyncImg,
  };

  const bgImage = BACKGROUNDS[role] || listenHeroImg;

  return (
    <div className="role-landing-wrap hw" data-testid={`role-landing-${role}`} style={{ position: 'relative', overflow: 'hidden', background: getRoleLandingBackground(role) }}>
      <div className="bgs">
        <div 
          className="bg on"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6) blur(1.5px)',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
        <div className="bgo" style={{ opacity: 0.6 }} />
      </div>

      <div className="hs">
        <div className="hcont">
          <div className="he hbadge" style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
            <span className="bdot" style={{ background: accent }} />
            <span>Perfect for {label}</span>
          </div>

          <h1 className="ht htitle">
            <span className="ht-line ht-line-1">TuneMavens for</span>
            <span className="ht-line ht-line-2" style={{ color: accent }}>{label}</span>
          </h1>

          <p className="hp hsub">
            {sub}
          </p>

          <div className="hb hbtns">
            <Link to="/register" className="hbp">
              Create Free Account
            </Link>
            <Link to="/apps" className="hbg">
              Browse App Catalogue →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
