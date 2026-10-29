import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  RiMusic2Fill, 
  RiRecordMailFill, 
  RiDiscFill, 
  RiFilmFill, 
  RiHeadphoneFill, 
  RiRadio2Fill, 
  RiBriefcase4Fill, 
  RiCheckboxCircleFill, 
  RiLockFill, 
  RiDatabase2Fill, 
  RiCoinsFill, 
  RiGlobalFill, 
  RiArrowRightLine, 
  RiExternalLinkLine, 
  RiShieldCheckFill,
  RiCpuFill,
  RiSendPlaneFill,
  RiAwardFill,
  RiFlashlightFill
} from 'react-icons/ri'

import PageHeader from '../../components/common/PageHeader.jsx'
import { getServiceUrl } from '../../components/PerfectForSidebar.jsx'
import SEO from '../../components/common/SEO.jsx'
import './AboutView.css'

import headerAboutImg from '../../assets/images/header_about.png'
import headerAboutWesternImg from '../../assets/images/header_about_western.png'

export default function AboutView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'creator',
    subject: 'general',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const tuneStreamUrl = getServiceUrl('tunestream');
  const syncMavensUrl = getServiceUrl('syncmavens');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About TuneMavens",
    "description": "TuneMavens is built by an executive team with over 50 years of combined experience in the music business, best of breed tech, and branding.",
    "publisher": {
      "@type": "Organization",
      "name": "TuneMavens",
      "url": window.location.origin
    }
  };

  return (
    <div className="about-page-wrapper">
      <SEO 
        title="About Us | Executive Heritage & Ecosystem Architecture" 
        description="Built by an executive team with over 50 years of combined experience in the music business, best of breed tech, and branding."
        schema={aboutSchema}
      />

      <PageHeader 
        title="Bridging Music & High Tech" 
        bgImage={headerAboutImg} 
        bgImageWestern={headerAboutWesternImg} 
        breadcrumb="About Us" 
      />

      <div className="about-container">
        {/* ================= 1. Executive Pedigree & Mission ================= */}
        <section className="about-heritage-card">
          <div className="about-section-header" style={{ marginBottom: '28px' }}>
            <span className="about-eyebrow">Executive Leadership &amp; Pedigree</span>
            <h2 className="about-title">Built by an Executive Team with Over 50 Years Combined Experience</h2>
          </div>

          <p className="about-heritage-lead">
            TuneMavens was founded by an executive leadership team with <strong>over 50 years of combined experience across the music business, best-of-breed deep tech, and world-class entertainment branding</strong>. Having navigated major record label boardrooms, architected high-concurrency cloud streaming pipelines, and spearheaded international sync placements, our leaders designed TuneMavens to eliminate the fragmentation, spreadsheet errors, and predatory intermediaries that hinder creators worldwide.
          </p>

          <div className="about-pillars-grid">
            <div className="about-pillar-box">
              <div className="about-pillar-icon">
                <RiAwardFill size={26} />
              </div>
              <h3 className="about-pillar-title">50+ Years in Music Business</h3>
              <p className="about-pillar-desc">
                Decades directing A&amp;R, publishing administration, international mechanical collection, and festival tour logistics across North America, Europe, and the African continent.
              </p>
            </div>

            <div className="about-pillar-box">
              <div className="about-pillar-icon">
                <RiCpuFill size={26} />
              </div>
              <h3 className="about-pillar-title">Best-of-Breed Tech</h3>
              <p className="about-pillar-desc">
                Engineered with high-performance distributed micro-frontends, real-time FastAPI engines, 60fps waveform rendering, and automated split-cascade smart ledgers.
              </p>
            </div>

            <div className="about-pillar-box">
              <div className="about-pillar-icon">
                <RiGlobalFill size={26} />
              </div>
              <h3 className="about-pillar-title">Global Branding &amp; Scale</h3>
              <p className="about-pillar-desc">
                Pioneering direct-to-creator digital experiences, sovereign artist web worlds, and multi-currency mobile money payment rails that unlock grassroots and international commerce.
              </p>
            </div>
          </div>
        </section>

        {/* ================= 2. The Tri-Platform Ecosystem ================= */}
        <section>
          <div className="about-section-header">
            <span className="about-eyebrow">The Tri-Platform Ecosystem</span>
            <h2 className="about-title">Three Specialized Platforms. One Harmonized Operating System.</h2>
            <p className="about-desc">
              In strategic partnership with Intermaven.io, TuneMavens operates within an interconnected tri-platform network where authentication, catalog metadata, and network credits flow seamlessly.
            </p>
          </div>

          <div className="about-eco-grid">
            {/* TuneMavens Card */}
            <div className="about-eco-card eco-tunemavens">
              <div className="about-eco-logo-wrap">
                <RiMusic2Fill size={28} />
              </div>
              <h3 className="about-eco-name">TuneMavens</h3>
              <span className="about-eco-role">Music Operations OS</span>
              <p className="about-eco-desc">
                The centralized control center for independent artists, producers, record labels, and DJs. Manage discographies, automate cascading revenue splits, calibrate loudness mastering (LUFS), and deploy sovereign EPK web worlds.
              </p>
              <ul className="about-eco-features">
                <li><RiCheckboxCircleFill size={15} color="#22d3ee" /> Automated Split Cascade Ledgers</li>
                <li><RiCheckboxCircleFill size={15} color="#22d3ee" /> Mother-CMS Dynamic EPK Deployments</li>
                <li><RiCheckboxCircleFill size={15} color="#22d3ee" /> Multi-Track Stem Ingestion Wizard</li>
              </ul>
              <Link to="/tools" className="about-btn-action about-btn-tunemavens">
                Explore Operations Console <RiArrowRightLine size={15} />
              </Link>
            </div>

            {/* TuneStream Card */}
            <div className="about-eco-card eco-tunestream">
              <div className="about-eco-logo-wrap">
                <RiHeadphoneFill size={28} />
              </div>
              <h3 className="about-eco-name">TuneStream</h3>
              <span className="about-eco-role">Lossless Streaming Portal</span>
              <p className="about-eco-desc">
                The high-fidelity consumer streaming sanctuary. Stream uncompressed 24-bit/96kHz master audio with zero corporate ads, tip favorite creators with one tap via M-Pesa or credit cards, and collect limited digital vinyl.
              </p>
              <ul className="about-eco-features">
                <li><RiCheckboxCircleFill size={15} color="#10b981" /> 24-bit Lossless Master Audio Stream</li>
                <li><RiCheckboxCircleFill size={15} color="#10b981" /> 1-Tap Direct Creator Tipping (M-Pesa)</li>
                <li><RiCheckboxCircleFill size={15} color="#10b981" /> Ad-Free Offline Encrypted Vault</li>
              </ul>
              <a 
                href={tuneStreamUrl} 
                className="about-btn-action about-btn-tunestream" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Launch TuneStream Portal <RiExternalLinkLine size={15} />
              </a>
            </div>

            {/* SyncMavens Card */}
            <div className="about-eco-card eco-syncmavens">
              <div className="about-eco-logo-wrap">
                <RiFilmFill size={28} />
              </div>
              <h3 className="about-eco-name">SyncMavens</h3>
              <span className="about-eco-role">Sync Licensing Platform</span>
              <p className="about-eco-desc">
                The AI-assisted licensing and sync placement engine for television, film, advertising, and video game music supervisors. Audition pre-cleared catalogs, parse natural-language script briefs, and clear rights instantly.
              </p>
              <ul className="about-eco-features">
                <li><RiCheckboxCircleFill size={15} color="#f59e0b" /> Sync Brief AI Natural-Language Search</li>
                <li><RiCheckboxCircleFill size={15} color="#f59e0b" /> 100% Pre-Cleared One-Stop Catalogs</li>
                <li><RiCheckboxCircleFill size={15} color="#f59e0b" /> Automated Cue Sheet Export (PRO-Ready)</li>
              </ul>
              <a 
                href={syncMavensUrl} 
                className="about-btn-action about-btn-syncmavens" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Launch SyncMavens Platform <RiExternalLinkLine size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* ================= 3. In-Depth: Who This Is For ================= */}
        <section>
          <div className="about-section-header">
            <span className="about-eyebrow">Who TuneMavens Is For</span>
            <h2 className="about-title">Engineered for Every Seat in the Global Music Ecosystem</h2>
            <p className="about-desc">
              Whether you compose in a home studio, oversee an indie record label, program prime-time broadcasts, or license soundtracks for Hollywood features, TuneMavens provides dedicated, purpose-built workflows for your exact role.
            </p>
          </div>

          <div className="about-personas-grid">
            {/* Persona 1: Creators */}
            <div className="about-persona-card" style={{ borderLeft: '3px solid #22d3ee' }}>
              <div className="about-persona-header">
                <div className="about-persona-icon" style={{ background: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee' }}>
                  <RiMusic2Fill size={24} />
                </div>
                <div className="about-persona-title-wrap">
                  <h3 className="about-persona-title">Creators &amp; Artists</h3>
                  <span className="about-persona-tag" style={{ color: '#22d3ee' }}>Independent Songwriters &amp; Producers</span>
                </div>
              </div>
              <div className="about-persona-pain">
                <strong>Frustration Solved:</strong> Disputed splits, spreadsheet accounting errors, and loss of digital fan relationships to closed corporate DSP platforms.
              </div>
              <p className="about-persona-desc">
                TuneMavens gives music creators an all-in-one operational backbone: automated percentage split cascading, instant LUFS mastering compliance, and branded Mother-CMS EPK worlds that sell stem drops and receive direct fan tips.
              </p>
              <ul className="about-persona-highlights">
                <li><RiCheckboxCircleFill size={14} color="#22d3ee" /> Automated Split Cascade calculations</li>
                <li><RiCheckboxCircleFill size={14} color="#22d3ee" /> Standalone EPK web worlds with 0% data loss</li>
                <li><RiCheckboxCircleFill size={14} color="#22d3ee" /> Direct-to-fan mobile money tipping</li>
              </ul>
              <div className="about-persona-actions">
                <Link to="/for/creator" className="about-persona-link" style={{ color: '#22d3ee' }}>
                  Explore Creator OS <RiArrowRightLine size={14} />
                </Link>
                <Link to="/register?role=creator" className="about-persona-secondary-link">
                  Create Account
                </Link>
              </div>
            </div>

            {/* Persona 2: Record Labels */}
            <div className="about-persona-card" style={{ borderLeft: '3px solid #a855f7' }}>
              <div className="about-persona-header">
                <div className="about-persona-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                  <RiRecordMailFill size={24} />
                </div>
                <div className="about-persona-title-wrap">
                  <h3 className="about-persona-title">Record Labels</h3>
                  <span className="about-persona-tag" style={{ color: '#a855f7' }}>Catalog Managers &amp; A&amp;R Teams</span>
                </div>
              </div>
              <div className="about-persona-pain">
                <strong>Frustration Solved:</strong> Fragmented distributor CSV statements, delayed quarterly royalties, and manual calculations across multi-artist rosters.
              </div>
              <p className="about-persona-desc">
                Enables independent and boutique record labels to ingest bulk discographies, parse distributor revenue ledgers instantly, execute waterfall splits, and manage contract compliance across entire artist rosters.
              </p>
              <ul className="about-persona-highlights">
                <li><RiCheckboxCircleFill size={14} color="#a855f7" /> Bulk discography &amp; catalog CSV ingestion</li>
                <li><RiCheckboxCircleFill size={14} color="#a855f7" /> Multi-tier waterfall royalty distribution</li>
                <li><RiCheckboxCircleFill size={14} color="#a855f7" /> Roster-wide sync pitch tracking</li>
              </ul>
              <div className="about-persona-actions">
                <Link to="/for/label" className="about-persona-link" style={{ color: '#a855f7' }}>
                  Explore Label Operations <RiArrowRightLine size={14} />
                </Link>
                <Link to="/register?role=label" className="about-persona-secondary-link">
                  Roster Ingest
                </Link>
              </div>
            </div>

            {/* Persona 3: DJs */}
            <div className="about-persona-card" style={{ borderLeft: '3px solid #06b6d4' }}>
              <div className="about-persona-header">
                <div className="about-persona-icon" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
                  <RiDiscFill size={24} />
                </div>
                <div className="about-persona-title-wrap">
                  <h3 className="about-persona-title">DJs &amp; Selectors</h3>
                  <span className="about-persona-tag" style={{ color: '#06b6d4' }}>Live Performers &amp; Club Curators</span>
                </div>
              </div>
              <div className="about-persona-pain">
                <strong>Frustration Solved:</strong> Substandard compressed audio, missing Camelot key and BPM metadata, and legal gray areas around live bootlegs and edits.
              </div>
              <p className="about-persona-desc">
                High-definition record pool engine engineered specifically for performance DJs. Provides uncompressed 24-bit audio downloads, verified stem clearances, and synchronized cloud crates ready for CDJs and performance rigs.
              </p>
              <ul className="about-persona-highlights">
                <li><RiCheckboxCircleFill size={14} color="#06b6d4" /> Uncompressed WAV/AIFF pool downloads</li>
                <li><RiCheckboxCircleFill size={14} color="#06b6d4" /> Pre-computed BPM and musical key tags</li>
                <li><RiCheckboxCircleFill size={14} color="#06b6d4" /> Performance stem licenses for live remixes</li>
              </ul>
              <div className="about-persona-actions">
                <Link to="/for/dj" className="about-persona-link" style={{ color: '#06b6d4' }}>
                  Explore DJ Engine <RiArrowRightLine size={14} />
                </Link>
                <Link to="/register?role=dj" className="about-persona-secondary-link">
                  Join Pool
                </Link>
              </div>
            </div>

            {/* Persona 4: Music Supervisors */}
            <div className="about-persona-card" style={{ borderLeft: '3px solid #f59e0b' }}>
              <div className="about-persona-header">
                <div className="about-persona-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <RiFilmFill size={24} />
                </div>
                <div className="about-persona-title-wrap">
                  <h3 className="about-persona-title">Music Supervisors</h3>
                  <span className="about-persona-tag" style={{ color: '#f59e0b' }}>Film, TV, Ad &amp; Video Game Media Buyers</span>
                </div>
              </div>
              <div className="about-persona-pain">
                <strong>Frustration Solved:</strong> Stalled production deadlines caused by unverified master/publishing splits, clearance disputes, and manual cue sheet typing.
              </div>
              <p className="about-persona-desc">
                Empowers creative media buyers to discover high-fidelity, 100% pre-cleared compositions using natural language scene prompts, audition isolated stems, and export standardized ASCAP/BMI cue sheets in seconds.
              </p>
              <ul className="about-persona-highlights">
                <li><RiCheckboxCircleFill size={14} color="#f59e0b" /> Sync Brief AI scene prompt translation</li>
                <li><RiCheckboxCircleFill size={14} color="#f59e0b" /> 100% pre-cleared master &amp; publishing rights</li>
                <li><RiCheckboxCircleFill size={14} color="#f59e0b" /> PRO-compliant broadcast cue sheets</li>
              </ul>
              <div className="about-persona-actions">
                <Link to="/for/supervisor" className="about-persona-link" style={{ color: '#f59e0b' }}>
                  Explore Supervisor Hub <RiArrowRightLine size={14} />
                </Link>
                <a href={syncMavensUrl} target="_blank" rel="noopener noreferrer" className="about-persona-secondary-link" style={{ color: '#f59e0b' }}>
                  Launch SyncMavens <RiExternalLinkLine size={12} />
                </a>
              </div>
            </div>

            {/* Persona 5: Everyday Listeners */}
            <div className="about-persona-card" style={{ borderLeft: '3px solid #10b981' }}>
              <div className="about-persona-header">
                <div className="about-persona-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <RiHeadphoneFill size={24} />
                </div>
                <div className="about-persona-title-wrap">
                  <h3 className="about-persona-title">Everyday Listeners</h3>
                  <span className="about-persona-tag" style={{ color: '#10b981' }}>Passionate Fans &amp; Music Collectors</span>
                </div>
              </div>
              <div className="about-persona-pain">
                <strong>Frustration Solved:</strong> Intrusive commercial audio ads, compressed audio degradation, and knowing only fractions of a cent reach the artists.
              </div>
              <p className="about-persona-desc">
                Offers a pristine listening experience through TuneStream. Listeners enjoy lossless dynamic range, tip creators directly via local mobile money (M-Pesa) and cards with 100% delivery, and own exclusive digital stem collectibles.
              </p>
              <ul className="about-persona-highlights">
                <li><RiCheckboxCircleFill size={14} color="#10b981" /> Uncompressed 24-bit / 96kHz master stream</li>
                <li><RiCheckboxCircleFill size={14} color="#10b981" /> Direct 1-tap artist tipping via M-Pesa &amp; cards</li>
                <li><RiCheckboxCircleFill size={14} color="#10b981" /> Encrypted offline playback vault</li>
              </ul>
              <div className="about-persona-actions">
                <Link to="/for/consumer" className="about-persona-link" style={{ color: '#10b981' }}>
                  Explore Listener Platform <RiArrowRightLine size={14} />
                </Link>
                <a href={tuneStreamUrl} target="_blank" rel="noopener noreferrer" className="about-persona-secondary-link" style={{ color: '#10b981' }}>
                  Launch TuneStream <RiExternalLinkLine size={12} />
                </a>
              </div>
            </div>

            {/* Persona 6: Media Houses */}
            <div className="about-persona-card" style={{ borderLeft: '3px solid #3b82f6' }}>
              <div className="about-persona-header">
                <div className="about-persona-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                  <RiRadio2Fill size={24} />
                </div>
                <div className="about-persona-title-wrap">
                  <h3 className="about-persona-title">Media Houses</h3>
                  <span className="about-persona-tag" style={{ color: '#3b82f6' }}>Radio Networks &amp; Broadcast Channels</span>
                </div>
              </div>
              <div className="about-persona-pain">
                <strong>Frustration Solved:</strong> Statutory compliance audit penalties, manual radio playlog reporting, and unformatted metadata handoffs.
              </div>
              <p className="about-persona-desc">
                Provides broadcast stations, online radio networks, and TV studios with verified compliance catalogs, automated daypart queue routing, and automated broadcast playlog generation formatted for regulatory bodies.
              </p>
              <ul className="about-persona-highlights">
                <li><RiCheckboxCircleFill size={14} color="#3b82f6" /> Broadcast-compliant audio directories</li>
                <li><RiCheckboxCircleFill size={14} color="#3b82f6" /> Automated playlog formatting for PROs</li>
                <li><RiCheckboxCircleFill size={14} color="#3b82f6" /> Multi-channel schedule queue routing</li>
              </ul>
              <div className="about-persona-actions">
                <Link to="/for/media-house" className="about-persona-link" style={{ color: '#3b82f6' }}>
                  Explore Media House Suite <RiArrowRightLine size={14} />
                </Link>
                <Link to="/register?role=media" className="about-persona-secondary-link">
                  Request Station Pass
                </Link>
              </div>
            </div>

            {/* Persona 7: Corporate Brands */}
            <div className="about-persona-card" style={{ borderLeft: '3px solid #ef4444' }}>
              <div className="about-persona-header">
                <div className="about-persona-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                  <RiBriefcase4Fill size={24} />
                </div>
                <div className="about-persona-title-wrap">
                  <h3 className="about-persona-title">Corporate Brands</h3>
                  <span className="about-persona-tag" style={{ color: '#ef4444' }}>Brand Marketers &amp; Corporate Sponsors</span>
                </div>
              </div>
              <div className="about-persona-pain">
                <strong>Frustration Solved:</strong> Low-converting programmatic ads, brand misalignment with artists, and lack of verified engagement metrics.
              </div>
              <p className="about-persona-desc">
                Connects forward-thinking corporations directly with vetted musical artists for authentic brand integrations, tour date sponsorships, and custom audio sonic identities with escrow-backed milestone delivery.
              </p>
              <ul className="about-persona-highlights">
                <li><RiCheckboxCircleFill size={14} color="#ef4444" /> Direct verified artist sponsorships</li>
                <li><RiCheckboxCircleFill size={14} color="#ef4444" /> Tour activations &amp; branded QR event passes</li>
                <li><RiCheckboxCircleFill size={14} color="#ef4444" /> Transparent escrow milestone fulfillment</li>
              </ul>
              <div className="about-persona-actions">
                <Link to="/for/corporate" className="about-persona-link" style={{ color: '#ef4444' }}>
                  Explore Corporate Suite <RiArrowRightLine size={14} />
                </Link>
                <Link to="/register?role=corporate" className="about-persona-secondary-link">
                  Brand Inquiry
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 4. Architecture Foundation ================= */}
        <section className="about-arch-section">
          <div className="about-section-header" style={{ marginBottom: '24px' }}>
            <span className="about-eyebrow">Technical Architecture</span>
            <h2 className="about-title">Bank-Grade Infrastructure Powered by Intermaven</h2>
            <p className="about-desc">
              TuneMavens is engineered from the ground up for zero downtime, multi-region routing, and complete identity sovereignty.
            </p>
          </div>

          <div className="about-arch-grid">
            <div className="about-arch-item">
              <div className="about-arch-icon">
                <RiLockFill size={22} />
              </div>
              <h3 className="about-arch-title">Unified Subdomain Auth</h3>
              <p className="about-arch-desc">
                A single JWT login maintains your authenticated session across tunemavens.com, tunestream.co, and syncmavens.com without redirects.
              </p>
            </div>

            <div className="about-arch-item">
              <div className="about-arch-icon">
                <RiCoinsFill size={22} />
              </div>
              <h3 className="about-arch-title">Shared Credit Network</h3>
              <p className="about-arch-desc">
                One wallet balance of non-expiring network credits used across AI mastering tools, sync pitches, and stem store purchases.
              </p>
            </div>

            <div className="about-arch-item">
              <div className="about-arch-icon">
                <RiDatabase2Fill size={22} />
              </div>
              <h3 className="about-arch-title">Real-Time Catalog Sync</h3>
              <p className="about-arch-desc">
                FastAPI high-speed backend coupled with scalable MongoDB instances ensures instant metadata and split updates across portals.
              </p>
            </div>

            <div className="about-arch-item">
              <div className="about-arch-icon">
                <RiShieldCheckFill size={22} />
              </div>
              <h3 className="about-arch-title">Dual Currency Settlement</h3>
              <p className="about-arch-desc">
                Integrated Stripe and M-Pesa STK push engines deliver instant mobile money and credit card payouts to creators globally.
              </p>
            </div>
          </div>
        </section>

        {/* ================= 5. Executive Contact Form ================= */}
        <section className="about-contact-wrap">
          <div className="about-section-header" style={{ marginBottom: '32px' }}>
            <span className="about-eyebrow">Direct Contact</span>
            <h2 className="about-title" style={{ fontSize: '28px' }}>Reach Our Executive &amp; Support Team</h2>
            <p className="about-desc" style={{ fontSize: '14px' }}>
              Have an enterprise inquiry, catalog ingestion requirement, or strategic partnership proposal? Connect directly with our leadership team.
            </p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <RiCheckboxCircleFill size={52} color="#10b981" style={{ margin: '0 auto 16px', display: 'block' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                Inquiry Received Successfully
              </h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '440px', margin: '0 auto' }}>
                Thank you for contacting TuneMavens. A member of our executive operations team will review your message and respond within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit}>
              <div className="about-form-grid">
                <div className="about-form-group">
                  <label className="about-form-label">Your Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name" 
                    className="about-form-input" 
                    required 
                  />
                </div>

                <div className="about-form-group">
                  <label className="about-form-label">Work Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@company.com" 
                    className="about-form-input" 
                    required 
                  />
                </div>
              </div>

              <div className="about-form-grid">
                <div className="about-form-group">
                  <label className="about-form-label">Primary Role</label>
                  <select 
                    name="role" 
                    value={formData.role} 
                    onChange={handleInputChange} 
                    className="about-form-select"
                  >
                    <option value="creator">Creator / Artist / Producer</option>
                    <option value="label">Record Label / Publisher</option>
                    <option value="dj">DJ / Live Performer</option>
                    <option value="supervisor">Music Supervisor / Studio</option>
                    <option value="consumer">Everyday Listener</option>
                    <option value="media_house">Media House / Broadcaster</option>
                    <option value="corporate">Corporate Brand Partner</option>
                  </select>
                </div>

                <div className="about-form-group">
                  <label className="about-form-label">Inquiry Subject</label>
                  <select 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleInputChange} 
                    className="about-form-select"
                  >
                    <option value="enterprise">Enterprise Catalog Ingestion</option>
                    <option value="sync">Sync Licensing Partnership</option>
                    <option value="label_onboarding">Record Label Onboarding</option>
                    <option value="executive">Executive Partnership</option>
                    <option value="general">General Support</option>
                  </select>
                </div>
              </div>

              <div className="about-form-group">
                <label className="about-form-label">Message Details</label>
                <textarea 
                  name="message"
                  rows="4" 
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your catalog, requirements, or proposal..." 
                  className="about-form-textarea" 
                  style={{ resize: 'none' }}
                  required
                ></textarea>
              </div>

              <button type="submit" className="about-btn-submit">
                <RiSendPlaneFill size={16} /> Submit Executive Inquiry
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
