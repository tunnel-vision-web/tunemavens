import React, { useState } from 'react'
import { Check } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader.jsx'

import headerHelpImg from '../../assets/images/header_help.png'
import headerHelpWesternImg from '../../assets/images/header_help_western.png'

export default function HelpView() {
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const faqs = [
    { q: "How do credit deductions work?", a: "Credits are shared. Buying a package grants credits that can be spent on TuneMavens tools (like mastering or sync briefing) and Intermaven apps." },
    { q: "Can I use my own custom domain name?", a: "Yes. Using the Hosting Manager app, you can search, register, and link custom domains to your EPK and artist websites." },
    { q: "How do Split Cascade ledgers process payments?", a: "After uploading your statement CSV file and defining splits, the engine calculates the net payout for each collaborator and transfers it using your linked Stripe or M-Pesa merchant account." },
    { q: "Is registration free?", a: "Yes. Signing up grants 150 free starter credits to test out standard tools." }
  ];

  return (
    <>
      <PageHeader title="Frequently Asked Questions" bgImage={headerHelpImg} bgImageWestern={headerHelpWesternImg} breadcrumb="Help Desk" />
      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
        <div style={{ maxWidth: '750px', margin: '0 auto 60px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="faq-item glass-panel" style={{ padding: '20px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: 'var(--tx)' }}>{faq.q}</h4>
              <p style={{ fontSize: '13px', color: 'var(--mu)', lineHeight: '1.6' }}>{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="section-header" style={{ marginBottom: '40px' }}>
          <span className="section-label">Support Ticket</span>
          <h2 className="section-title">Submit a Ticket</h2>
        </div>

        <div className="contact-card glass-panel">
          {ticketSubmitted ? (
            <div className="text-center" style={{ padding: '20px 0' }}>
              <Check size={48} color="var(--cyan)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Ticket Submitted!</h3>
              <p style={{ fontSize: '14px', color: 'var(--mu)' }}>We've received your support request and will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setTicketSubmitted(true); }}>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input type="text" placeholder="E.g. Domain mapping assistance" className="form-control" required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows="4" placeholder="Explain the problem in detail..." className="form-control" style={{ resize: 'none' }} required></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" placeholder="name@example.com" className="form-control" required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
                Submit Ticket
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
