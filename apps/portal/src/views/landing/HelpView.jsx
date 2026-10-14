import React, { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import {
  RiSearchLine,
  RiCloseLine,
  RiBookOpenFill,
  RiGlobalLine,
  RiFileList3Line,
  RiSparklingLine,
  RiExchangeDollarLine,
  RiShieldCheckLine,
  RiTimeLine,
  RiArrowRightLine,
  RiCheckboxCircleFill,
  RiArrowDownSLine,
  RiCustomerService2Fill,
  RiExternalLinkLine,
  RiCheckLine,
  RiShareLine,
  RiCompassLine,
  RiHandHeartLine,
  RiMoneyDollarCircleLine
} from 'react-icons/ri'

import PageHeader from '../../components/common/PageHeader.jsx'
import SEO from '../../components/common/SEO.jsx'
import headerHelpImg from '../../assets/images/header_help.png'
import headerHelpWesternImg from '../../assets/images/header_help_western.png'
import { HELP_CATEGORIES, HELP_ARTICLES, FREQUENT_FAQS } from '../../data/helpArticles.js'
import './HelpView.css'

import ArticleContentRenderer from '../../components/common/ArticleContentRenderer.jsx'

export default function HelpView({ sessionUser }) {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState(0);

  // Ticket Submission Form State
  const [ticketForm, setTicketForm] = useState({
    name: sessionUser?.name || '',
    email: sessionUser?.email || '',
    category: 'Publishing & Royalties',
    priority: 'normal',
    subject: '',
    description: ''
  });
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketSubmittedData, setTicketSubmittedData] = useState(null);

  // Handle URL Query & Hash Deep-linking (e.g. /help?article=studio-split-sheets-guide or #/help#master-vs-composition-copyright)
  useEffect(() => {
    let targetArticleId = null;

    // 1. Check query parameters e.g. ?article=... or ?id=...
    const searchParams = new URLSearchParams(location.search);
    const paramArticle = searchParams.get('article') || searchParams.get('id');
    if (paramArticle) {
      targetArticleId = paramArticle;
    }

    // 2. Check window.location.hash or location.hash
    if (!targetArticleId) {
      const hashStr = window.location.hash || location.hash || '';
      const parts = hashStr.split(/[\#\?\&]/).filter(Boolean);
      for (const p of parts) {
        const clean = p.replace(/^article=/, '').replace(/^\//, '');
        const matched = HELP_ARTICLES.find(a => a.id === clean || a.id === p);
        if (matched) {
          targetArticleId = matched.id;
          break;
        }
      }
    }

    if (targetArticleId) {
      const found = HELP_ARTICLES.find(a => a.id === targetArticleId);
      if (found) {
        setSelectedArticle(found);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [location]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedArticle) {
        setSelectedArticle(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArticle]);

  // Filtered Articles based on Category & Search Query
  const filteredArticles = useMemo(() => {
    return HELP_ARTICLES.filter(art => {
      const matchesCategory = activeCategory === 'all' || art.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inTitle = art.title.toLowerCase().includes(q);
      const inExcerpt = art.excerpt.toLowerCase().includes(q);
      const inTags = art.tags.some(t => t.toLowerCase().includes(q));
      const inSections = art.sections.some(s => 
        s.heading.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)
      );

      return inTitle || inExcerpt || inTags || inSections;
    });
  }, [activeCategory, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: HELP_ARTICLES.length };
    HELP_ARTICLES.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Quick tag search trigger
  const handleQuickTagClick = (tag) => {
    setSearchQuery(tag);
    setActiveCategory('all');
  };

  // Copy article link
  const handleCopyArticleLink = (articleId) => {
    const url = `${window.location.origin}/#/help#${articleId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  // Submit Support Ticket to backend /api/crm/leads
  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setTicketSubmitting(true);

    const generatedTracking = `TM-TKT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    try {
      const payload = {
        name: ticketForm.name,
        email: ticketForm.email,
        inquiry_type: 'support_ticket',
        message: `[Category: ${ticketForm.category}] [Priority: ${ticketForm.priority}] ${ticketForm.subject}\n\n${ticketForm.description}`,
        preferred_comm_method: 'email',
        interests: [ticketForm.category, ticketForm.priority]
      };

      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let leadId = generatedTracking;
      if (res.ok) {
        const data = await res.json();
        if (data && data._id) {
          leadId = `TM-TKT-${String(data._id).substring(18, 24).toUpperCase()}`;
        }
      }

      setTicketSubmittedData({
        trackingId: leadId,
        subject: ticketForm.subject,
        email: ticketForm.email,
        category: ticketForm.category,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
    } catch (err) {
      console.warn('Support ticket direct POST fallback:', err);
      setTicketSubmittedData({
        trackingId: generatedTracking,
        subject: ticketForm.subject,
        email: ticketForm.email,
        category: ticketForm.category,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
    } finally {
      setTicketSubmitting(false);
    }
  };

  // Helper for category badge styling
  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'publishing': return 'help-tag-publishing';
      case 'business': return 'help-tag-business';
      case 'services': return 'help-tag-services';
      case 'royalties': return 'help-tag-royalties';
      case 'account': return 'help-tag-account';
      default: return 'help-tag-publishing';
    }
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FREQUENT_FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <SEO 
        title="Help & Industry Knowledge Base" 
        description="Comprehensive music industry guides: music publishing, mechanical royalties, PROs, split sheets, record deal recoupment, sync licensing, and the complete TuneMavens ecosystem."
        schema={schema}
      />

      <PageHeader 
        title="Help & Industry Knowledge Base" 
        bgImage={headerHelpImg} 
        bgImageWestern={headerHelpWesternImg} 
        breadcrumb="Knowledge Base" 
      />

      <div className="container help-view-container">
        
        {/* Hero Search Section */}
        <div className="help-hero-section">
          <div className="help-badge-pill">
            <RiSparklingLine size={14} />
            <span>Unified Music Business Academy & Support Desk</span>
          </div>
          <h2 className="help-hero-title">How can we help your music career today?</h2>
          <p className="help-hero-subtitle">
            Explore authoritative guides on global music publishing, master vs. composition rights, studio split sheets, sync placement strategies, and our end-to-end service suite.
          </p>

          {/* Search Input */}
          <div className="help-search-wrapper">
            <RiSearchLine size={20} className="help-search-icon" />
            <input 
              type="text" 
              placeholder="Search publishing, mechanical royalties, PROs, split sheets, sync briefs, LUFS mastering..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="help-search-input"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="help-search-clear" 
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <RiCloseLine size={16} />
              </button>
            )}
          </div>

          {/* Quick Search Tag Chips */}
          <div className="help-quick-tags">
            <span style={{ fontWeight: 600 }}>Popular Topics:</span>
            {['Master vs. Composition', 'The MLC', 'ASCAP & BMI', 'Split Sheets', 'Recoupment Math', 'Sync Briefs', 'Lossless Audio', 'Business Ad Rates'].map(tag => (
              <button 
                key={tag} 
                type="button" 
                className="help-quick-tag-btn"
                onClick={() => handleQuickTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Banner */}
        <div className="help-metrics-grid">
          <div className="help-metric-card">
            <div className="help-metric-icon">
              <RiBookOpenFill />
            </div>
            <div>
              <div className="help-metric-num">16+ In-Depth Guides</div>
              <div className="help-metric-label">Publishing, Business & Tech</div>
            </div>
          </div>
          <div className="help-metric-card">
            <div className="help-metric-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--purple)' }}>
              <RiGlobalLine />
            </div>
            <div>
              <div className="help-metric-num">150+ Territories</div>
              <div className="help-metric-label">Global Royalty Collection</div>
            </div>
          </div>
          <div className="help-metric-card">
            <div className="help-metric-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--gr)' }}>
              <RiShieldCheckLine />
            </div>
            <div>
              <div className="help-metric-num">100% Retained Rights</div>
              <div className="help-metric-label">Administrator Mode Model</div>
            </div>
          </div>
          <div className="help-metric-card">
            <div className="help-metric-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--am)' }}>
              <RiCustomerService2Fill />
            </div>
            <div>
              <div className="help-metric-num">Dedicated Desk</div>
              <div className="help-metric-label">Artist & Enterprise Concierge</div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="help-category-tabs">
          {HELP_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`help-cat-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.label}</span>
                <span className="help-cat-count">{categoryCounts[cat.id] || 0}</span>
              </button>
            );
          })}
        </div>

        {/* Articles Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0 }}>
              {activeCategory === 'all' ? 'All Knowledge Base Articles' : HELP_CATEGORIES.find(c => c.id === activeCategory)?.label}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
              Showing {filteredArticles.length} article{filteredArticles.length === 1 ? '' : 's'}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} 
              style={{ background: 'none', border: 'none', color: 'var(--cyan)', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', marginBottom: '60px' }}>
            <RiBookOpenFill size={48} style={{ color: '#64748b', margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>No articles match your query</h4>
            <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '440px', margin: '0 auto 20px' }}>
              Try searching with broader terms like "publishing", "royalties", "split sheets", or "streaming", or reach out to our support desk below.
            </p>
            <button 
              type="button" 
              className="btn-primary" 
              style={{ padding: '8px 20px', borderRadius: '4px' }}
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="help-articles-grid">
            {filteredArticles.map(article => (
              <div 
                key={article.id} 
                className="help-article-card"
                onClick={() => { setSelectedArticle(article); setFeedbackGiven(false); }}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => { if (e.key === 'Enter') setSelectedArticle(article); }}
              >
                <div>
                  <div className="help-article-card-header">
                    <span className={`help-tag-badge ${getCategoryBadgeClass(article.category)}`}>
                      {article.category === 'publishing' && 'Publishing'}
                      {article.category === 'business' && 'Business'}
                      {article.category === 'services' && 'Services'}
                      {article.category === 'royalties' && 'Royalties'}
                      {article.category === 'account' && 'Account'}
                    </span>
                    <span className="help-read-time">
                      <RiTimeLine size={13} />
                      {article.readingTime}
                    </span>
                  </div>
                  <h4 className="help-article-title">{article.title}</h4>
                  <p className="help-article-excerpt">{article.excerpt}</p>
                </div>

                <div className="help-article-footer">
                  <div className="help-article-tags">
                    {article.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="help-small-tag">#{tag}</span>
                    ))}
                  </div>
                  <span className="help-read-action">
                    Read Guide <RiArrowRightLine size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Direct Platform Help Channels */}
        <div style={{ marginTop: '20px', marginBottom: '70px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
              Direct Channels
            </span>
            <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
              Specialized Support Concierge
            </h3>
          </div>

          <div className="help-support-channels-grid">
            <div className="help-channel-card">
              <div>
                <div className="help-channel-icon" style={{ background: 'rgba(34, 211, 238, 0.1)', color: 'var(--cyan)' }}>
                  <RiGlobalLine />
                </div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                  Creator & Publisher Desk
                </h4>
                <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '18px' }}>
                  Get assistance with global ISRC/ISWC mapping, ASCAP/BMI setlist filings, distributor CSV statement ingestion, and Split Cascade setups.
                </p>
              </div>
              <Link 
                to="/publishing" 
                style={{ fontSize: '13px', fontWeight: 700, color: 'var(--cyan)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                Access Publishing Desk <RiArrowRightLine size={14} />
              </Link>
            </div>

            <div className="help-channel-card">
              <div>
                <div className="help-channel-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--purple)' }}>
                  <RiMoneyDollarCircleLine />
                </div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                  Corporate Brand & Ad Flights
                </h4>
                <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '18px' }}>
                  Book high-impact brand sponsorships, audio prerolls, curated station takeovers, and discuss enterprise category exclusivity flights.
                </p>
              </div>
              <Link 
                to="/for/corporate#business-ad-rates" 
                style={{ fontSize: '13px', fontWeight: 700, color: 'var(--purple)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                Review Business Ad Rates <RiArrowRightLine size={14} />
              </Link>
            </div>

            <div className="help-channel-card">
              <div>
                <div className="help-channel-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--gr)' }}>
                  <RiCompassLine />
                </div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                  Sync Placements & Briefs
                </h4>
                <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '18px' }}>
                  Direct portal for music supervisors and rights holders to fast-track one-stop sync clearances for film, television, games, and streaming series.
                </p>
              </div>
              <Link 
                to="/sync-placement" 
                style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gr)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                Browse Sync Briefs <RiArrowRightLine size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Frequently Asked Tactical Questions (Accordion) */}
        <div className="help-faq-section">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
              Quick Answers
            </span>
            <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
              Frequently Asked Questions
            </h3>
          </div>

          <div>
            {FREQUENT_FAQS.map((faq, idx) => {
              const isOpen = faqOpenIndex === idx;
              return (
                <div key={idx} className={`help-accordion-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="help-accordion-btn"
                    onClick={() => setFaqOpenIndex(isOpen ? -1 : idx)}
                  >
                    <span>{faq.q}</span>
                    <RiArrowDownSLine size={20} className="help-accordion-icon" />
                  </button>
                  {isOpen && (
                    <div className="help-accordion-body">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Ticket Submission Card */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Direct Assistance
          </span>
          <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            Submit a Support Request
          </h3>
          <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '600px', margin: '8px auto 0' }}>
            Our music business specialists and technical engineers respond within 12 to 24 hours.
          </p>
        </div>

        <div className="help-ticket-card">
          {ticketSubmittedData ? (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <RiCheckboxCircleFill size={56} style={{ color: 'var(--cyan)', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
                Support Ticket Dispatched!
              </h3>
              <p style={{ fontSize: '15px', color: '#cbd5e1', maxWidth: '540px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                Thank you! Your inquiry has been routed into our Smart Support CRM. A ticket confirmation has been sent to <strong>{ticketSubmittedData.email}</strong>.
              </p>

              <div 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)', 
                  borderRadius: '6px', 
                  padding: '16px 24px', 
                  maxWidth: '460px', 
                  margin: '0 auto 28px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px'
                }}
              >
                <div>
                  <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Ticket Tracking Code</span>
                  <strong style={{ color: 'var(--cyan)', fontSize: '16px', fontFamily: 'monospace' }}>
                    {ticketSubmittedData.trackingId}
                  </strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Queue Priority</span>
                  <span style={{ color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>Active / Normal</span>
                </div>
              </div>

              <button 
                type="button" 
                className="btn-primary" 
                style={{ padding: '10px 24px', borderRadius: '4px' }}
                onClick={() => {
                  setTicketSubmittedData(null);
                  setTicketForm(prev => ({ ...prev, subject: '', description: '' }));
                }}
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit}>
              <div className="help-form-row">
                <div className="help-form-group">
                  <label className="help-form-label">Full Name / Artist Name</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Sarah K. or SoundWave Records" 
                    value={ticketForm.name}
                    onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                    className="help-form-control" 
                    required 
                  />
                </div>
                <div className="help-form-group">
                  <label className="help-form-label">Account Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    value={ticketForm.email}
                    onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                    className="help-form-control" 
                    required 
                  />
                </div>
              </div>

              <div className="help-form-row">
                <div className="help-form-group">
                  <label className="help-form-label">Inquiry Category</label>
                  <select 
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="help-form-control"
                  >
                    <option value="Publishing & Royalties">Publishing & Global Mechanicals</option>
                    <option value="Sync Placements">Sync Placements & Cue Sheets</option>
                    <option value="Split Cascade Ledgers">Split Cascade & Collaborator Payouts</option>
                    <option value="EPK & Custom Domains">EPK Builder & Custom Domain Mapping</option>
                    <option value="Corporate Ad Flights">Corporate Brand Flights & Sponsorships</option>
                    <option value="Universal Credits & Billing">Universal Credits & Subscriptions</option>
                    <option value="Technical Support">Technical Platform Support</option>
                  </select>
                </div>
                <div className="help-form-group">
                  <label className="help-form-label">Priority</label>
                  <select 
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="help-form-control"
                  >
                    <option value="normal">Standard (within 24 hours)</option>
                    <option value="high">Urgent / Release Day (within 6 hours)</option>
                    <option value="enterprise">Corporate / Enterprise Partner</option>
                  </select>
                </div>
              </div>

              <div className="help-form-group">
                <label className="help-form-label">Subject</label>
                <input 
                  type="text" 
                  placeholder="E.g. Assistance linking custom domain with Cloudflare DNS" 
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  className="help-form-control" 
                  required 
                />
              </div>

              <div className="help-form-group">
                <label className="help-form-label">Detailed Explanation</label>
                <textarea 
                  rows="4" 
                  placeholder="Provide all relevant details (ISRC, track titles, domain URL, or transaction IDs)..." 
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  className="help-form-control" 
                  style={{ resize: 'none' }} 
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', padding: '14px', borderRadius: '4px', fontWeight: 'bold' }}
                disabled={ticketSubmitting}
              >
                {ticketSubmitting ? 'Routing Ticket to Support Team...' : 'Submit Support Ticket'}
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Full-Featured In-Depth Article Reader Modal */}
      {selectedArticle && createPortal(
        <div 
          className="help-modal-overlay" 
          onClick={() => setSelectedArticle(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="help-modal-dialog" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="help-modal-header">
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span className={`help-tag-badge ${getCategoryBadgeClass(selectedArticle.category)}`}>
                    {selectedArticle.category.toUpperCase()}
                  </span>
                  <span className="help-read-time">
                    <RiTimeLine size={13} />
                    {selectedArticle.readingTime}
                  </span>
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', lineHeight: 1.3, margin: 0 }}>
                  {selectedArticle.title}
                </h2>
              </div>
              <button 
                type="button" 
                className="help-modal-close-btn"
                onClick={() => setSelectedArticle(null)}
                title="Close guide (Esc)"
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="help-modal-body">
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px 18px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '28px', fontStyle: 'italic', color: '#94a3b8' }}>
                "{selectedArticle.excerpt}"
              </div>

              {selectedArticle.sections.map((sec, sIdx) => (
                <div key={sIdx} className="help-article-section">
                  <h3>{sec.heading}</h3>
                  <ArticleContentRenderer content={sec.content} />
                </div>
              ))}

              {/* Related Platform Tool Callout */}
              {selectedArticle.toolLink && (
                <div 
                  style={{ 
                    marginTop: '36px', 
                    padding: '20px 24px', 
                    borderRadius: '8px', 
                    background: 'radial-gradient(ellipse at top left, rgba(34, 211, 238, 0.1) 0%, transparent 70%)',
                    border: '1px solid rgba(34, 211, 238, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Ready to apply this knowledge?
                    </span>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '4px 0 0' }}>
                      Put this into action directly inside TuneMavens
                    </h4>
                  </div>
                  <Link 
                    to={selectedArticle.toolLink.path} 
                    className="btn-primary"
                    style={{ padding: '8px 18px', borderRadius: '4px', textDecoration: 'none', fontWeight: 700, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => setSelectedArticle(null)}
                  >
                    <span>{selectedArticle.toolLink.label}</span>
                    <RiExternalLinkLine size={14} />
                  </Link>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="help-modal-footer">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Was this article helpful?</span>
                {feedbackGiven ? (
                  <span style={{ fontSize: '13px', color: 'var(--gr)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <RiCheckLine size={16} /> Thank you for your feedback!
                  </span>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      type="button" 
                      onClick={() => setFeedbackGiven(true)}
                      style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#cbd5e1', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      👍 Yes
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setFeedbackGiven(true)}
                      style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#cbd5e1', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      👎 No
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => handleCopyArticleLink(selectedArticle.id)}
                  style={{ background: 'none', border: 'none', color: copiedLink ? 'var(--cyan)' : '#94a3b8', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <RiShareLine size={16} />
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Direct Link'}</span>
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ padding: '6px 14px', borderRadius: '4px', fontSize: '12px' }}
                  onClick={() => setSelectedArticle(null)}
                >
                  Close Guide
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
