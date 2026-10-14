import React from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import SEO from '../../components/common/SEO.jsx';
import headerHelpImg from '../../assets/images/header_help.png';
import headerHelpWesternImg from '../../assets/images/header_help_western.png';
import SupportTicketsPanel from '../../components/community/SupportTicketsPanel.jsx';
import { useRegion } from '../../RegionContext.jsx';

export default function SupportPageView({ sessionUser, catalogTracks = [] }) {
  const { region } = useRegion();
  const headerImg = region === 'western' ? headerHelpWesternImg : headerHelpImg;

  return (
    <div className="support-page-view" style={{ minHeight: '100vh', background: '#060813' }}>
      <SEO
        title="Support & Claims Desk — TuneMavens"
        description="Submit support tickets, report Split Cascade disputes, request DDEX re-dispatch, and resolve Unified Credit inquiries with TuneSupport AI."
        keywords="TuneMavens support, music copyright dispute, split cascade hold, DDEX error, unified credits support, music claims desk"
      />

      <PageHeader
        title="Support & Claims Desk"
        subtitle="Full AI-managed claim resolution, automated TuneLedger escrow holds, and 24/7 continuous assistance."
        bgImage={headerImg}
        badge="Community & Support"
      />

      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '32px 20px 80px 20px'
      }}>
        <SupportTicketsPanel
          sessionUser={sessionUser}
          catalogTracks={catalogTracks}
          initialTab="file"
        />
      </div>
    </div>
  );
}
