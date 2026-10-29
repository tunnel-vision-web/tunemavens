import React from 'react';
import { RiCustomerService2Fill } from 'react-icons/ri';
import SupportTicketsPanel from './SupportTicketsPanel.jsx';

export default function ConsumerSupportDeskView({
  sessionUser = null,
  catalogTracks = []
}) {
  return (
    <div className="consumer-support-desk-view" style={{ width: '100%', boxSizing: 'border-box' }}>
      {/* Top Header Badge */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(168, 85, 247, 0.08)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          padding: '6px 14px',
          borderRadius: '3px',
          fontSize: '11px',
          fontWeight: '700',
          color: '#c084fc',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '14px'
        }}>
          <RiCustomerService2Fill size={14} /> 24/7 AI-Assisted Support Desk
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
          TuneStream Support Desk &amp; Claims Resolution
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '720px', margin: '0 auto', lineHeight: '1.6' }}>
          Submit a ticket or claim for streaming defects, offline storage recovery, or network credit discrepancies with 24/7 AI-Assisted instant diagnosis.
        </p>
      </div>

      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <SupportTicketsPanel
          sessionUser={sessionUser}
          catalogTracks={catalogTracks}
          initialTab="file"
        />
      </div>
    </div>
  );
}
