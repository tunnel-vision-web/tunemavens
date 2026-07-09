import React, { useState } from 'react'
import { RiCheckboxCircleFill, RiLockFill, RiDatabase2Fill } from 'react-icons/ri'
import PageHeader from '../../components/common/PageHeader.jsx'

import headerAboutImg from '../../assets/images/header_about.png'
import headerAboutWesternImg from '../../assets/images/header_about_western.png'

export default function AboutView() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <>
      <PageHeader title="Bridging Music & High Tech" bgImage={headerAboutImg} bgImageWestern={headerAboutWesternImg} breadcrumb="About Us" />
      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          TuneMavens was founded to build modern technology infrastructure for independent global artists, record labels, and publishers.
        </p>

        <div className="arch-card glass-panel" style={{ marginBottom: '80px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>Consolidating Creative Workflows</h3>
            <p style={{ fontSize: '14px', color: 'var(--mu)', lineHeight: '1.6', marginBottom: '24px' }}>
              All operations are designed to be seamless. In partnership with Intermaven.io, TuneMavens connects your payment records, custom domains, and AI tasks to a single, secure central profile database, avoiding the hassle of managing disjointed web tools.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckboxCircleFill size={14} color="var(--cyan)" /> Shared M-Pesa & Stripe checkout integrations</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckboxCircleFill size={14} color="var(--cyan)" /> Automatic EPK sync to public DNS records</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckboxCircleFill size={14} color="var(--cyan)" /> Instant cross-subdomain authentication</li>
            </ul>
          </div>
          <div className="arch-visual">
            <div className="arch-node active">
              <div className="arch-node-icon"><RiLockFill size={18} /></div>
              <div className="arch-node-info">
                <h4 className="arch-node-title">Secure Subdomain Auth</h4>
                <p className="arch-node-desc">Unified JWT session tokens shared across all portal environments.</p>
              </div>
            </div>
            <div className="arch-node">
              <div className="arch-node-icon"><RiDatabase2Fill size={18} /></div>
              <div className="arch-node-info">
                <h4 className="arch-node-title">Consolidated Database</h4>
                <p className="arch-node-desc">Profiles and notification registries remain synchronized in real-time.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <span className="section-label">Contact Us</span>
          <h2 className="section-title">Send a Message</h2>
        </div>

        <div className="contact-card glass-panel">
          {submitted ? (
            <div className="text-center" style={{ padding: '20px 0' }}>
              <RiCheckboxCircleFill size={48} color="var(--cyan)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Thank you!</h3>
              <p style={{ fontSize: '14px', color: 'var(--mu)' }}>We have received your message and will respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="form-control" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea 
                  rows="4" 
                  placeholder="Enter your message details..." 
                  className="form-control" 
                  style={{ resize: 'none' }}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
