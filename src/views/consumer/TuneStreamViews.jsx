import React from 'react'
import PageHeader from '../../components/common/PageHeader.jsx'

import headerAboutImg from '../../assets/images/header_about.png'
import headerAboutWesternImg from '../../assets/images/header_about_western.png'
import headerToolsImg from '../../assets/images/header_tools.png'
import headerToolsWesternImg from '../../assets/images/header_tools_western.png'
import perfectForHeaderImg from '../../assets/images/perfect_for_header.png'
import headerHelpImg from '../../assets/images/header_help.png'
import headerHelpWesternImg from '../../assets/images/header_help_western.png'

export function TuneStreamAboutView() {
  return (
    <div className="view-container">
      <PageHeader title="About TuneStream" bgImage={headerAboutImg} bgImageWestern={headerAboutWesternImg} breadcrumb="TuneStream / About" />
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h2>The Heartbeat of the Intermaven Network</h2>
        <p style={{ color: 'var(--mu)', marginTop: '20px', maxWidth: '600px', margin: '20px auto' }}>TuneStream connects listeners directly to creators without the middleman, offering lossless streaming and fair payouts via the Intermaven ledger.</p>
      </div>
    </div>
  );
}

export function TuneStreamFeaturesView() {
  return (
    <div className="view-container">
      <PageHeader title="TuneStream Features" bgImage={headerToolsImg} bgImageWestern={headerToolsWesternImg} breadcrumb="TuneStream / Features" />
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h2>Next-Generation Listening</h2>
        <p style={{ color: 'var(--mu)', marginTop: '20px', maxWidth: '600px', margin: '20px auto' }}>Experience 24-bit/96kHz lossless audio, cross-device syncing, and an integrated smart-wallet for seamless artist tipping and purchases.</p>
      </div>
    </div>
  );
}

export function TuneStreamCreatorsView() {
  return (
    <div className="view-container">
      <PageHeader title="TuneStream for Creators" bgImage={perfectForHeaderImg} bgImageWestern={perfectForHeaderImg} breadcrumb="TuneStream / For Creators" />
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h2>Own Your Audience</h2>
        <p style={{ color: 'var(--mu)', marginTop: '20px', maxWidth: '600px', margin: '20px auto' }}>Get transparent analytics, instant payouts, and direct access to your superfans. TuneStream empowers you to build a sustainable music career.</p>
      </div>
    </div>
  );
}

export function TuneStreamHelpView() {
  return (
    <div className="view-container">
      <PageHeader title="TuneStream Support" bgImage={headerHelpImg} bgImageWestern={headerHelpWesternImg} breadcrumb="TuneStream / Support" />
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h2>How Can We Help You?</h2>
        <p style={{ color: 'var(--mu)', marginTop: '20px', maxWidth: '600px', margin: '20px auto' }}>Find answers to common questions about your library, credits, and device synchronization, or contact our support team.</p>
      </div>
    </div>
  );
}
