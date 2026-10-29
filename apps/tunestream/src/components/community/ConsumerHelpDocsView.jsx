import React, { useState, useMemo } from 'react';
import {
  RiBookOpenFill,
  RiSearchLine,
  RiCheckLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiQuestionFill,
  RiThumbUpLine,
  RiThumbDownLine,
  RiCustomerService2Fill
} from 'react-icons/ri';

import {
  CONSUMER_DOC_CATEGORIES,
  CONSUMER_DOC_ARTICLES,
  FREQUENT_CONSUMER_FAQS
} from '../../data/consumerDocArticles.js';

export default function ConsumerHelpDocsView({
  sessionUser = null,
  onNavigateToSupport = null
}) {
  const [docCategory, setDocCategory] = useState('all');
  const [docSearch, setDocSearch] = useState('');
  const [activeDocArticle, setActiveDocArticle] = useState(null);
  const [docFeedbackMap, setDocFeedbackMap] = useState({});
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const filteredDocArticles = useMemo(() => {
    return CONSUMER_DOC_ARTICLES.filter((article) => {
      const matchesCategory = docCategory === 'all' || article.categoryId === docCategory;
      const q = docSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q) ||
        (article.steps && article.steps.some((s) => s.title.toLowerCase().includes(q) || s.detail.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [docCategory, docSearch]);

  return (
    <div className="consumer-help-docs-view" style={{ width: '100%', boxSizing: 'border-box' }}>
      {/* Top Header Badge */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(34, 211, 238, 0.08)',
          border: '1px solid rgba(34, 211, 238, 0.25)',
          padding: '6px 14px',
          borderRadius: '3px',
          fontSize: '11px',
          fontWeight: '700',
          color: '#22d3ee',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '14px'
        }}>
          <RiBookOpenFill size={14} /> Help Center &amp; Documentation
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
          TuneStream Help &amp; Knowledge Base
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '720px', margin: '0 auto', lineHeight: '1.6' }}>
          Searchable listener guides, HiFi setup instructions, offline caching walkthroughs, and platform FAQs.
        </p>
      </div>

      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {activeDocArticle ? (
          /* Single Documentation Guide Viewer */
          <div style={{
            background: '#090d1f',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '3px',
            padding: '36px',
            maxWidth: '860px',
            margin: '0 auto',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={() => setActiveDocArticle(null)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '3px',
                  color: '#94a3b8',
                  padding: '6px 14px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RiArrowLeftLine size={14} /> Back to All Guides
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  background: 'rgba(34, 211, 238, 0.1)',
                  color: '#22d3ee',
                  border: '1px solid rgba(34, 211, 238, 0.25)',
                  padding: '3px 10px',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  {activeDocArticle.category}
                </span>
                <span style={{ color: '#64748b', fontSize: '12px' }}>•</span>
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>Updated {activeDocArticle.updatedAt}</span>
              </div>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 16px 0', lineHeight: '1.3' }}>
              {activeDocArticle.title}
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '16px', lineHeight: '1.7', marginBottom: '32px', background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid #22d3ee', padding: '14px 18px', borderRadius: '0 3px 3px 0' }}>
              {activeDocArticle.summary}
            </p>

            {/* Step-by-Step Walkthrough */}
            <div style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '19px', fontWeight: '700', color: '#fff', margin: '0 0 20px 0' }}>
                Step-by-Step Instructions
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activeDocArticle.steps.map((st, sIdx) => (
                  <div key={sIdx} style={{
                    background: '#050814',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '3px',
                    padding: '18px 22px'
                  }}>
                    <div style={{ fontWeight: '700', color: '#22d3ee', fontSize: '15px', marginBottom: '6px' }}>
                      {st.title}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.6' }}>
                      {st.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Accordion for Guide */}
            {activeDocArticle.faqs && activeDocArticle.faqs.length > 0 && (
              <div style={{ marginBottom: '36px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '28px' }}>
                <h2 style={{ fontSize: '19px', fontWeight: '700', color: '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RiQuestionFill color="#22d3ee" size={20} /> Guide FAQ &amp; Troubleshooting
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeDocArticle.faqs.map((f, fIdx) => (
                    <div key={fIdx} style={{
                      background: '#050814',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '3px',
                      padding: '14px 18px'
                    }}>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '13.5px', marginBottom: '6px' }}>
                        Q: {f.q}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>
                        {f.a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Was this helpful feedback */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '20px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px'
            }}>
              <span style={{ fontSize: '13.5px', color: '#cbd5e1', fontWeight: '600' }}>
                Was this article helpful to your listening experience?
              </span>

              {docFeedbackMap[activeDocArticle.id] ? (
                <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RiCheckLine size={16} /> Thank you for your feedback!
                </span>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setDocFeedbackMap({ ...docFeedbackMap, [activeDocArticle.id]: 'yes' })}
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid #10b981',
                      color: '#10b981',
                      borderRadius: '3px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RiThumbUpLine size={14} /> Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocFeedbackMap({ ...docFeedbackMap, [activeDocArticle.id]: 'no' })}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid #ef4444',
                      color: '#ef4444',
                      borderRadius: '3px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RiThumbDownLine size={14} /> No
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Documentation Guides List & Search */
          <div>
            {/* Search Bar & Category Filter */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: '1 1 300px' }}>
                <RiSearchLine style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={16} />
                <input
                  type="text"
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  placeholder="Search guides: HiFi playback, offline caching, tipping, playlists..."
                  style={{
                    width: '100%',
                    background: '#090d1f',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '3px',
                    color: '#fff',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {CONSUMER_DOC_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setDocCategory(cat.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '3px',
                      border: docCategory === cat.id ? '1px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: docCategory === cat.id ? 'rgba(34, 211, 238, 0.15)' : '#090d1f',
                      color: docCategory === cat.id ? '#22d3ee' : '#94a3b8',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guides Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '20px',
              textAlign: 'left',
              marginBottom: '48px'
            }}>
              {filteredDocArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setActiveDocArticle(article)}
                  style={{
                    background: '#090d1f',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '3px',
                    padding: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'border-color 0.18s ease, transform 0.18s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#22d3ee';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{
                      background: 'rgba(34, 211, 238, 0.1)',
                      color: '#22d3ee',
                      border: '1px solid rgba(34, 211, 238, 0.25)',
                      padding: '2px 8px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: '700'
                    }}>
                      {article.category}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      {article.readTime}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                    {article.title}
                  </h3>

                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', margin: '0 0 16px 0', flex: 1 }}>
                    {article.summary}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      {article.steps.length} Steps Walkthrough
                    </span>
                    <span style={{ color: '#22d3ee', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      View Guide <RiArrowRightLine size={13} />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Frequently Asked Questions Accordion */}
            <div style={{
              background: '#090d1f',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '3px',
              padding: '36px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <RiQuestionFill color="#22d3ee" size={24} />
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0 }}>
                  Frequently Asked Consumer Questions
                </h2>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 24px 0' }}>
                Instant answers on audio fidelity, offline sync, network credits, and multi-room listening.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {FREQUENT_CONSUMER_FAQS.map((faq, fIdx) => (
                  <div
                    key={fIdx}
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      background: openFaqIndex === fIdx ? '#050814' : 'transparent'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(openFaqIndex === fIdx ? -1 : fIdx)}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '14.5px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span>{faq.q}</span>
                      <span style={{ color: '#22d3ee', fontSize: '18px' }}>
                        {openFaqIndex === fIdx ? '−' : '+'}
                      </span>
                    </button>

                    {openFaqIndex === fIdx && (
                      <div style={{ padding: '0 20px 20px', color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.7', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Support Desk Redirect Prompt */}
              <div style={{
                marginTop: '36px',
                background: 'rgba(34, 211, 238, 0.05)',
                border: '1px solid rgba(34, 211, 238, 0.2)',
                borderRadius: '3px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: '0 0 6px 0' }}>
                    Can\'t find the solution to your issue?
                  </h4>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>
                    Our Support Tickets Desk provides personalized assistance with 24/7 AI-Assisted real-time issue diagnosis.
                  </p>
                </div>
                {onNavigateToSupport && (
                  <button
                    type="button"
                    onClick={onNavigateToSupport}
                    style={{
                      padding: '10px 22px',
                      background: '#22d3ee',
                      color: '#050814',
                      border: 'none',
                      borderRadius: '3px',
                      fontWeight: '800',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <RiCustomerService2Fill size={16} /> Open Support Desk
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
