import React, { useState, useMemo } from 'react';
import {
  RiBookOpenFill,
  RiFileList3Line,
  RiCustomerService2Fill,
  RiSearchLine,
  RiTimeLine,
  RiHeart3Line,
  RiHeart3Fill,
  RiMessage2Fill,
  RiShareLine,
  RiCheckLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiShieldCheckLine,
  RiQuestionFill,
  RiSendPlaneFill,
  RiThumbUpLine,
  RiThumbDownLine,
  RiCloseLine,
  RiHeadphoneFill,
  RiCompass3Line,
  RiCoinsFill,
  RiSparklingFill
} from 'react-icons/ri';

import {
  CONSUMER_BLOG_CATEGORIES,
  CONSUMER_BLOG_ARTICLES,
  INITIAL_CONSUMER_BLOG_COMMENTS
} from '../../data/consumerBlogArticles.js';

import {
  CONSUMER_DOC_CATEGORIES,
  CONSUMER_DOC_ARTICLES,
  FREQUENT_CONSUMER_FAQS
} from '../../data/consumerDocArticles.js';

import SupportTicketsPanel from './SupportTicketsPanel.jsx';

export default function ConsumerSupportCommunityView({
  sessionUser = null,
  catalogTracks = [],
  initialSection = 'docs',
  onBackToExplore = null
}) {
  const [activeMainTab, setActiveMainTab] = useState(initialSection); // 'docs' | 'blog' | 'tickets'

  // Documentation state
  const [docCategory, setDocCategory] = useState('all');
  const [docSearch, setDocSearch] = useState('');
  const [activeDocArticle, setActiveDocArticle] = useState(null);
  const [docFeedbackMap, setDocFeedbackMap] = useState({});
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Blog state
  const [blogCategory, setBlogCategory] = useState('all');
  const [blogSearch, setBlogSearch] = useState('');
  const [activeBlogArticle, setActiveBlogArticle] = useState(null);
  const [blogLikes, setBlogLikes] = useState({});
  const [blogComments, setBlogComments] = useState(INITIAL_CONSUMER_BLOG_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Filtered documentation articles
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

  // Filtered blog articles
  const filteredBlogArticles = useMemo(() => {
    return CONSUMER_BLOG_ARTICLES.filter((article) => {
      const matchesCategory = blogCategory === 'all' || article.categoryId === blogCategory;
      const q = blogSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q) ||
        (article.tags && article.tags.some((t) => t.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [blogCategory, blogSearch]);

  // Handle like toggle
  const handleToggleLike = (slug) => {
    setBlogLikes((prev) => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  // Handle new comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeBlogArticle) return;

    const newComment = {
      id: `c_${Date.now()}`,
      author: sessionUser?.name || sessionUser?.username || 'Community Listener',
      role: sessionUser?.role || 'Verified Listener',
      avatar: sessionUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      timestamp: 'Just now',
      content: newCommentText.trim()
    };

    setBlogComments((prev) => ({
      ...prev,
      [activeBlogArticle.slug]: [newComment, ...(prev[activeBlogArticle.slug] || [])]
    }));

    setNewCommentText('');
  };

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  return (
    <div className="consumer-support-community-view" style={{ width: '100%', boxSizing: 'border-box' }}>
      {/* Top Header Badge & Navigation Tabs */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
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
          <RiCustomerService2Fill size={14} /> Support &amp; Community Hub
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
          TuneStream Help &amp; Sound Community
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '720px', margin: '0 auto 28px', lineHeight: '1.6' }}>
          Comprehensive documentation for HiFi listening, music culture articles, and our 24/7 AI-Assisted support ticketing desk.
        </p>

        {/* 3 Main View Tabs */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: '#090d1f',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '4px',
          borderRadius: '3px',
          gap: '4px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            type="button"
            onClick={() => { setActiveMainTab('docs'); setActiveDocArticle(null); }}
            style={{
              padding: '10px 22px',
              borderRadius: '3px',
              border: activeMainTab === 'docs' ? '1px solid #22d3ee' : '1px solid transparent',
              background: activeMainTab === 'docs' ? 'rgba(34, 211, 238, 0.14)' : 'transparent',
              color: activeMainTab === 'docs' ? '#22d3ee' : '#94a3b8',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.18s ease'
            }}
          >
            <RiBookOpenFill size={16} /> Knowledge Base &amp; Documentation
          </button>

          <button
            type="button"
            onClick={() => { setActiveMainTab('blog'); setActiveBlogArticle(null); }}
            style={{
              padding: '10px 22px',
              borderRadius: '3px',
              border: activeMainTab === 'blog' ? '1px solid #10b981' : '1px solid transparent',
              background: activeMainTab === 'blog' ? 'rgba(16, 185, 129, 0.14)' : 'transparent',
              color: activeMainTab === 'blog' ? '#10b981' : '#94a3b8',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.18s ease'
            }}
          >
            <RiFileList3Line size={16} /> Consumer Music &amp; Sound Blog
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('tickets')}
            style={{
              padding: '10px 22px',
              borderRadius: '3px',
              border: activeMainTab === 'tickets' ? '1px solid #a855f7' : '1px solid transparent',
              background: activeMainTab === 'tickets' ? 'rgba(168, 85, 247, 0.14)' : 'transparent',
              color: activeMainTab === 'tickets' ? '#c084fc' : '#94a3b8',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.18s ease'
            }}
          >
            <RiCustomerService2Fill size={16} /> Support Tickets Desk
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: DOCUMENTATION & USER GUIDES
          ========================================================================= */}
      {activeMainTab === 'docs' && (
        <div className="tab-documentation-content">
          {activeDocArticle ? (
            /* Single Article Full Viewer */
            <div style={{
              background: '#090d1f',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '3px',
              padding: '36px',
              maxWidth: '860px',
              margin: '0 auto',
              textAlign: 'left'
            }}>
              <button
                type="button"
                onClick={() => setActiveDocArticle(null)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#22d3ee',
                  padding: '7px 14px',
                  borderRadius: '3px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginBottom: '24px'
                }}
              >
                <RiArrowLeftLine size={14} /> Back to all guides
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#22d3ee',
                  background: 'rgba(34, 211, 238, 0.1)',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  textTransform: 'uppercase'
                }}>
                  {activeDocArticle.category}
                </span>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <RiTimeLine size={13} /> {activeDocArticle.readTime}
                </span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>• Updated {activeDocArticle.updatedAt}</span>
              </div>

              <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#fff', margin: '0 0 16px 0', lineHeight: '1.3' }}>
                {activeDocArticle.title}
              </h2>

              <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: '1.7', marginBottom: '32px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '3px', borderLeft: '3px solid #22d3ee' }}>
                {activeDocArticle.summary}
              </p>

              {/* Step by Step Breakdown */}
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '20px' }}>
                Step-by-Step Instructions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                {activeDocArticle.steps.map((step, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '3px',
                      padding: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '3px',
                        background: '#22d3ee',
                        color: '#060813',
                        fontSize: '12px',
                        fontWeight: '900',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {idx + 1}
                      </span>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: 0 }}>
                        {step.title}
                      </h4>
                    </div>
                    <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', margin: 0, paddingLeft: '34px' }}>
                      {step.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Article FAQs */}
              {activeDocArticle.faqs && activeDocArticle.faqs.length > 0 && (
                <div style={{ marginBottom: '36px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
                    Relevant FAQs for this Guide
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {activeDocArticle.faqs.map((faq, fIdx) => (
                      <div
                        key={fIdx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '3px',
                          padding: '16px'
                        }}
                      >
                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#22d3ee', margin: '0 0 6px 0' }}>
                          Q: {faq.q}
                        </h4>
                        <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>
                          {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback Section */}
              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px'
              }}>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                  Was this documentation guide helpful?
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setDocFeedbackMap(p => ({ ...p, [activeDocArticle.id]: 'yes' }))}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '3px',
                      border: docFeedbackMap[activeDocArticle.id] === 'yes' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                      background: docFeedbackMap[activeDocArticle.id] === 'yes' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.03)',
                      color: docFeedbackMap[activeDocArticle.id] === 'yes' ? '#10b981' : '#fff',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RiThumbUpLine size={13} /> Yes, it helped
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocFeedbackMap(p => ({ ...p, [activeDocArticle.id]: 'no' }))}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '3px',
                      border: docFeedbackMap[activeDocArticle.id] === 'no' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                      background: docFeedbackMap[activeDocArticle.id] === 'no' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.03)',
                      color: docFeedbackMap[activeDocArticle.id] === 'no' ? '#ef4444' : '#fff',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RiThumbDownLine size={13} /> Still need help
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Documentation Index View */
            <div>
              {/* Search Bar & Categories */}
              <div style={{ maxWidth: '840px', margin: '0 auto 36px auto' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#090d1f',
                  border: '1.5px solid #22d3ee',
                  borderRadius: '3px',
                  padding: '12px 16px',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.4)',
                  marginBottom: '20px'
                }}>
                  <RiSearchLine size={20} color="#22d3ee" style={{ marginRight: '12px', flexShrink: 0 }} />
                  <input
                    type="text"
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    placeholder="Search documentation (e.g. Lossless FLAC, offline cache, credits, DAC)..."
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#fff',
                      fontSize: '15px'
                    }}
                  />
                  {docSearch && (
                    <button
                      type="button"
                      onClick={() => setDocSearch('')}
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0 4px' }}
                    >
                      <RiCloseLine size={18} />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {CONSUMER_DOC_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setDocCategory(cat.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '3px',
                        border: docCategory === cat.id ? '1px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: docCategory === cat.id ? 'rgba(34, 211, 238, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        color: docCategory === cat.id ? '#22d3ee' : '#cbd5e1',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Documentation Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '60px',
                textAlign: 'left'
              }}>
                {filteredDocArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => setActiveDocArticle(article)}
                    style={{
                      background: '#090d1f',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '3px',
                      padding: '22px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#22d3ee';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          color: '#22d3ee',
                          textTransform: 'uppercase',
                          background: 'rgba(34, 211, 238, 0.1)',
                          padding: '2px 6px',
                          borderRadius: '3px'
                        }}>
                          {article.category}
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{article.readTime}</span>
                      </div>

                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                        {article.title}
                      </h3>

                      <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                        {article.summary}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#22d3ee'
                    }}>
                      <span>Read Documentation</span>
                      <RiArrowRightLine size={14} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Frequently Asked Questions Accordion */}
              <div style={{
                background: '#090d1f',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '3px',
                padding: '36px',
                maxWidth: '900px',
                margin: '0 auto',
                textAlign: 'left'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '800', textTransform: 'uppercase' }}>Quick Answers</span>
                  <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: '6px 0 0' }}>
                    Frequently Asked Questions
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {FREQUENT_CONSUMER_FAQS.map((faq, qIdx) => {
                    const isOpen = openFaqIndex === qIdx;
                    return (
                      <div
                        key={qIdx}
                        style={{
                          background: isOpen ? 'rgba(34, 211, 238, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                          border: isOpen ? '1px solid rgba(34, 211, 238, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? -1 : qIdx)}
                          style={{
                            width: '100%',
                            padding: '16px 20px',
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            textAlign: 'left',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '700',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <span>{faq.q}</span>
                          <span style={{ color: '#22d3ee', fontSize: '18px', fontWeight: 'bold' }}>
                            {isOpen ? '−' : '+'}
                          </span>
                        </button>
                        {isOpen && (
                          <div style={{ padding: '0 20px 16px 20px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: CONSUMER MUSIC & SOUND BLOG
          ========================================================================= */}
      {activeMainTab === 'blog' && (
        <div className="tab-blog-content">
          {activeBlogArticle ? (
            /* Single Blog Article Reader */
            <div style={{
              background: '#090d1f',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '3px',
              maxWidth: '880px',
              margin: '0 auto',
              overflow: 'hidden',
              textAlign: 'left'
            }}>
              {/* Header Cover Banner */}
              <div style={{ height: '320px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={activeBlogArticle.cover_image}
                  alt={activeBlogArticle.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #090d1f 0%, rgba(9, 13, 31, 0.3) 100%)' }} />
                
                <button
                  type="button"
                  onClick={() => setActiveBlogArticle(null)}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(6, 8, 19, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <RiArrowLeftLine size={14} /> Back to Blog Stories
                </button>
              </div>

              {/* Article Content Body */}
              <div style={{ padding: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.12)',
                    padding: '3px 8px',
                    borderRadius: '3px',
                    textTransform: 'uppercase'
                  }}>
                    {activeBlogArticle.category}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>• {activeBlogArticle.reading_time}</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>• Published {activeBlogArticle.published_at}</span>
                </div>

                <h1 style={{ fontSize: '30px', fontWeight: '900', color: '#fff', margin: '0 0 20px 0', lineHeight: '1.25' }}>
                  {activeBlogArticle.title}
                </h1>

                {/* Author Card */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '3px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '32px'
                }}>
                  <img
                    src={activeBlogArticle.author.avatar}
                    alt={activeBlogArticle.author.name}
                    style={{ width: '48px', height: '48px', borderRadius: '3px', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>{activeBlogArticle.author.name}</div>
                    <div style={{ fontSize: '12px', color: '#22d3ee' }}>{activeBlogArticle.author.role}</div>
                  </div>
                </div>

                {/* Excerpt */}
                <p style={{
                  fontSize: '16px',
                  fontStyle: 'italic',
                  color: '#cbd5e1',
                  lineHeight: '1.7',
                  borderLeft: '3px solid #10b981',
                  paddingLeft: '18px',
                  marginBottom: '32px'
                }}>
                  "{activeBlogArticle.excerpt}"
                </p>

                {/* Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '40px' }}>
                  {activeBlogArticle.sections.map((sec, sIdx) => (
                    <div key={sIdx}>
                      <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '0 0 12px 0' }}>
                        {sec.heading}
                      </h3>
                      <div style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                        {sec.content}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                {activeBlogArticle.tags && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '36px' }}>
                    {activeBlogArticle.tags.map((t, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          color: '#94a3b8',
                          padding: '4px 10px',
                          borderRadius: '3px',
                          fontSize: '11px'
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Interaction Bar: Likes & Share */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '3px',
                  marginBottom: '40px'
                }}>
                  <button
                    type="button"
                    onClick={() => handleToggleLike(activeBlogArticle.slug)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: blogLikes[activeBlogArticle.slug] ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      border: blogLikes[activeBlogArticle.slug] ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: blogLikes[activeBlogArticle.slug] ? '#ef4444' : '#fff',
                      padding: '8px 16px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '13px'
                    }}
                  >
                    {blogLikes[activeBlogArticle.slug] ? <RiHeart3Fill size={16} /> : <RiHeart3Line size={16} />}
                    <span>{activeBlogArticle.claps + (blogLikes[activeBlogArticle.slug] ? 1 : 0)} Likes</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: copiedLink ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      border: copiedLink ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: copiedLink ? '#10b981' : '#fff',
                      padding: '8px 16px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '13px'
                    }}
                  >
                    {copiedLink ? <RiCheckLine size={16} /> : <RiShareLine size={16} />}
                    <span>{copiedLink ? 'Link Copied!' : 'Share Article'}</span>
                  </button>
                </div>

                {/* Comments Section */}
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '20px' }}>
                    Discussion &amp; Community Feedback ({((blogComments[activeBlogArticle.slug] || []).length)})
                  </h3>

                  {/* Add Comment Form */}
                  <form onSubmit={handleAddComment} style={{ marginBottom: '28px' }}>
                    <textarea
                      rows={3}
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Share your thoughts on this story or your experience with HiFi playback..."
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: '#060813',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '3px',
                        color: '#fff',
                        fontSize: '13px',
                        resize: 'none',
                        outline: 'none',
                        boxSizing: 'border-box',
                        marginBottom: '10px'
                      }}
                      required
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="submit"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#10b981',
                          color: '#060813',
                          border: 'none',
                          padding: '8px 18px',
                          borderRadius: '3px',
                          fontWeight: '800',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        <RiSendPlaneFill size={14} /> Post Comment
                      </button>
                    </div>
                  </form>

                  {/* Comments Feed */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {(blogComments[activeBlogArticle.slug] || []).map((cmt) => (
                      <div
                        key={cmt.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: '3px',
                          padding: '16px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <img
                            src={cmt.avatar}
                            alt={cmt.author}
                            style={{ width: '32px', height: '32px', borderRadius: '3px', objectFit: 'cover' }}
                          />
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>{cmt.author}</span>
                            <span style={{ fontSize: '11px', color: '#22d3ee', marginLeft: '6px' }}>{cmt.role}</span>
                            <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '8px' }}>• {cmt.timestamp}</span>
                          </div>
                        </div>
                        <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', margin: 0, paddingLeft: '42px' }}>
                          {cmt.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Blog Grid Index */
            <div>
              {/* Search Bar & Categories */}
              <div style={{ maxWidth: '840px', margin: '0 auto 36px auto' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#090d1f',
                  border: '1.5px solid #10b981',
                  borderRadius: '3px',
                  padding: '12px 16px',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.4)',
                  marginBottom: '20px'
                }}>
                  <RiSearchLine size={20} color="#10b981" style={{ marginRight: '12px', flexShrink: 0 }} />
                  <input
                    type="text"
                    value={blogSearch}
                    onChange={(e) => setBlogSearch(e.target.value)}
                    placeholder="Search music culture stories, HiFi tutorials, artist interviews, and gear reviews..."
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#fff',
                      fontSize: '15px'
                    }}
                  />
                  {blogSearch && (
                    <button
                      type="button"
                      onClick={() => setBlogSearch('')}
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0 4px' }}
                    >
                      <RiCloseLine size={18} />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {CONSUMER_BLOG_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setBlogCategory(cat.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '3px',
                        border: blogCategory === cat.id ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: blogCategory === cat.id ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        color: blogCategory === cat.id ? '#10b981' : '#cbd5e1',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blog Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px',
                textAlign: 'left'
              }}>
                {filteredBlogArticles.map((article) => (
                  <div
                    key={article.slug}
                    onClick={() => setActiveBlogArticle(article)}
                    style={{
                      background: '#090d1f',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#10b981';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div>
                      {/* Thumbnail Cover */}
                      <div style={{ height: '180px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: 'rgba(6, 8, 19, 0.85)',
                          color: '#10b981',
                          fontSize: '10px',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          padding: '3px 8px',
                          borderRadius: '3px',
                          border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                          {article.category}
                        </span>
                      </div>

                      <div style={{ padding: '20px 20px 10px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
                          <span>{article.reading_time}</span>
                          <span>•</span>
                          <span>{article.published_at}</span>
                        </div>

                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                          {article.title}
                        </h3>

                        <p style={{
                          fontSize: '12px',
                          color: '#94a3b8',
                          lineHeight: '1.6',
                          margin: 0,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {article.excerpt}
                        </p>
                      </div>
                    </div>

                    <div style={{
                      padding: '14px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      marginTop: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                          src={article.author.avatar}
                          alt={article.author.name}
                          style={{ width: '22px', height: '22px', borderRadius: '3px', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: '600' }}>{article.author.name}</span>
                      </div>

                      <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Read Story &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: SUPPORT TICKETING SYSTEM (EXACT SAME AS TUNEMAVENS)
          ========================================================================= */}
      {activeMainTab === 'tickets' && (
        <div className="tab-tickets-content" style={{ textAlign: 'left' }}>
          <div style={{
            background: 'rgba(168, 85, 247, 0.06)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '3px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#c084fc', marginBottom: '2px' }}>
                TuneSupport AI-Assisted Claims &amp; Assistance Desk
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Instant automated dispute triage, audio defect remediation, credit verification, and priority technician routing.
              </div>
            </div>
            <span style={{
              background: '#a855f7',
              color: '#fff',
              fontSize: '11px',
              fontWeight: '800',
              padding: '4px 10px',
              borderRadius: '3px'
            }}>
              24/7 Liveness Active
            </span>
          </div>

          <SupportTicketsPanel
            sessionUser={sessionUser}
            catalogTracks={catalogTracks}
            initialTab="file"
          />
        </div>
      )}
    </div>
  );
}
