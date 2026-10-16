import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  RiBookOpenLine,
  RiSparklingLine,
  RiCloseLine,
  RiTimeLine,
  RiCheckLine,
  RiShareLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiFileList3Line,
  RiCustomerService2Fill,
  RiCompass3Line
} from 'react-icons/ri';

import { HELP_ARTICLES, HELP_CATEGORIES } from '../../data/helpArticles.js';
import ArticleContentRenderer from './ArticleContentRenderer.jsx';
import { getRelevantDocLink, logUserActivity } from '../../services/userLifecycleMemory.js';
import './AppHelpAiControls.css';

/**
 * InAppDocModal
 * 
 * Reusable in-app documentation modal overlay mounted via createPortal.
 * Preserves the user's active page state, routes, and forms without disruption.
 * Automatically resolves the active article and all related articles based on:
 * - Active workspace tab / context
 * - Current section / category being browsed
 * - Specific issue or claim category
 * - Search query
 */
export default function InAppDocModal({
  isOpen,
  onClose,
  initialArticleId = null,
  category = null,
  activeContext = null,
  activeTab = null,
  searchQuery = '',
  contextTitle = null,
  sessionUser = null,
  onAskAi = null
}) {
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [docFeedbackGiven, setDocFeedbackGiven] = useState(false);
  const [copiedDocLink, setCopiedDocLink] = useState(false);

  const docOverlayRef = useRef(null);

  // Sync or reset selected article whenever modal opens or props change
  useEffect(() => {
    if (isOpen) {
      if (initialArticleId) {
        setSelectedArticleId(initialArticleId);
      } else {
        setSelectedArticleId(null);
      }
      setDocFeedbackGiven(false);
    }
  }, [isOpen, initialArticleId]);

  // Global ESC key listener to close active overlay
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Context fallback
  const currentContext = activeTab || activeContext || 'home';
  const relevantDoc = getRelevantDocLink(currentContext);
  const resolvedContextTitle = contextTitle || relevantDoc.appTitle || 'TuneMavens Ecosystem';

  // Determine active article
  const activeDocArticle = useMemo(() => {
    // 1. Explicit user selection inside modal
    if (selectedArticleId) {
      const found = HELP_ARTICLES.find(a => a.id === selectedArticleId);
      if (found) return found;
    }

    // 2. Explicit initial article prop
    if (initialArticleId) {
      const found = HELP_ARTICLES.find(a => a.id === initialArticleId);
      if (found) return found;
    }

    // 3. Search query matching
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match = HELP_ARTICLES.find(a =>
        a.title.toLowerCase().includes(q) ||
        (a.tags && a.tags.some(t => t.toLowerCase().includes(q))) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(q))
      );
      if (match) return match;
    }

    // 4. Section category matching
    if (category && category !== 'all') {
      const catMatch = HELP_ARTICLES.find(a => a.category === category);
      if (catMatch) return catMatch;
    }

    // 5. Active context mapping
    if (activeContext) {
      const doc = getRelevantDocLink(activeContext);
      if (doc && doc.articleId) {
        const docMatch = HELP_ARTICLES.find(a => a.id === doc.articleId);
        if (docMatch) return docMatch;
      }
    }

    // 6. Default
    return HELP_ARTICLES[0];
  }, [selectedArticleId, initialArticleId, searchQuery, category, activeContext]);

  // Log activity on open
  useEffect(() => {
    if (isOpen && activeDocArticle) {
      logUserActivity(sessionUser, {
        type: 'doc_view',
        action: 'Opened In-App Documentation',
        app: resolvedContextTitle,
        summary: `Viewed contextual documentation "${activeDocArticle.title}"`,
        metadata: {
          context: activeContext,
          category,
          articleId: activeDocArticle.id
        }
      });
    }
  }, [isOpen, activeDocArticle?.id]);

  // Calculate related articles for this issue/section
  const relatedArticles = useMemo(() => {
    if (!activeDocArticle) return [];

    const others = HELP_ARTICLES.filter(a => a.id !== activeDocArticle.id);

    // Group 1: Articles in the same category
    const sameCategory = others.filter(a => a.category === activeDocArticle.category);

    // Group 2: Articles sharing tags or keywords
    const currentTags = (activeDocArticle.tags || []).map(t => t.toLowerCase());
    const tagMatches = others.filter(a => {
      if (a.category === activeDocArticle.category) return false;
      const otherTags = (a.tags || []).map(t => t.toLowerCase());
      return currentTags.some(t => otherTags.includes(t));
    });

    // Group 3: Contextual cross-links for specific operational issues
    let crossLinks = [];
    if (activeDocArticle.category === 'support') {
      crossLinks = others.filter(a => [
        'studio-split-sheets-guide',
        'tuneledger-and-split-cascade',
        'music-metadata-isrc-iswc-ipi-upc',
        'universal-credits-system-guide'
      ].includes(a.id));
    } else if (activeDocArticle.category === 'royalties') {
      crossLinks = others.filter(a => [
        'tuneledger-escrow-dispute-locks',
        'how-support-ticketing-works',
        'publishing-deals-admin-vs-copub-vs-buyout'
      ].includes(a.id));
    } else if (activeDocArticle.category === 'publishing') {
      crossLinks = others.filter(a => [
        'sync-licensing-masterclass',
        'how-support-ticketing-works',
        'tuneledger-and-split-cascade'
      ].includes(a.id));
    } else if (activeDocArticle.category === 'services') {
      crossLinks = others.filter(a => [
        'tuneledger-escrow-dispute-locks',
        'how-support-ticketing-works'
      ].includes(a.id));
    }

    // Combine and deduplicate
    const combined = [...sameCategory, ...tagMatches, ...crossLinks];
    const unique = [];
    const seen = new Set();
    for (const item of combined) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        unique.push(item);
      }
    }

    return unique.slice(0, 8);
  }, [activeDocArticle]);

  // Copy shareable article link
  const handleCopyArticleLink = (articleId) => {
    const link = `${window.location.origin}/#/help?article=${articleId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        setCopiedDocLink(true);
        setTimeout(() => setCopiedDocLink(false), 2000);
      });
    }
  };

  if (!isOpen || !activeDocArticle) return null;

  const categoryLabel = HELP_CATEGORIES.find(c => c.id === activeDocArticle.category)?.label || activeDocArticle.category.toUpperCase();

  return createPortal(
    <div
      ref={docOverlayRef}
      className="inapp-doc-overlay"
      onClick={(e) => {
        if (e.target === docOverlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      data-testid="inapp-help-doc-overlay"
    >
      <div className="inapp-doc-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="inapp-doc-header">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="inapp-doc-category-badge">
                {categoryLabel}
              </span>
              <span className="inapp-doc-meta">
                <RiTimeLine size={13} />
                {activeDocArticle.readingTime}
              </span>
              <span className="inapp-doc-app-context-badge">
                Context: {resolvedContextTitle}
              </span>
            </div>
            <h2 className="inapp-doc-title">
              {activeDocArticle.title}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              type="button"
              className="inapp-doc-close-btn"
              onClick={onClose}
              title={`Close guide and return to ${resolvedContextTitle} (Esc)`}
              data-testid="btn-close-inapp-doc"
            >
              <RiCloseLine size={20} />
            </button>
          </div>
        </div>

        {/* Sticky Sub-Header: Related Articles in this Section */}
        {relatedArticles.length > 0 && (
          <div className="inapp-doc-nav-strip">
            <span className="inapp-doc-nav-label">
              <RiCompass3Line size={14} color="var(--cyan)" />
              Related Guides ({relatedArticles.length}):
            </span>
            <div className="inapp-doc-nav-pills">
              {/* Pill for current active article */}
              <button
                type="button"
                className="inapp-doc-nav-pill active"
                title={`Currently viewing: ${activeDocArticle.title}`}
              >
                <RiBookOpenLine size={12} />
                <span>{activeDocArticle.title.length > 38 ? `${activeDocArticle.title.substring(0, 35)}...` : activeDocArticle.title}</span>
              </button>

              {/* Pills for all related articles in this issue/section */}
              {relatedArticles.map(rel => (
                <button
                  key={rel.id}
                  type="button"
                  className="inapp-doc-nav-pill"
                  onClick={() => {
                    setSelectedArticleId(rel.id);
                    setDocFeedbackGiven(false);
                  }}
                  title={rel.title}
                >
                  <RiBookOpenLine size={12} color="var(--cyan)" />
                  <span>{rel.title.length > 38 ? `${rel.title.substring(0, 35)}...` : rel.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="inapp-doc-body">
          {/* Excerpt callout */}
          <div className="inapp-doc-excerpt">
            "{activeDocArticle.excerpt}"
          </div>

          {/* Formatted Sections */}
          {activeDocArticle.sections && activeDocArticle.sections.map((sec, sIdx) => (
            <div key={sIdx} className="inapp-doc-section">
              <h3>{sec.heading}</h3>
              <ArticleContentRenderer content={sec.content} />
            </div>
          ))}

          {/* Bridge to AI Prompt Assistant */}
          <div className="inapp-doc-ai-bridge">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="inapp-doc-ai-avatar">
                <RiSparklingLine size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', color: '#fff', fontWeight: 800 }}>
                  Have questions about how this applies to your music or claim?
                </h4>
                <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#94a3b8' }}>
                  Consult TuneSupport AI with your catalog context and dispute details.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="inapp-doc-ai-btn"
              onClick={() => {
                if (onAskAi) {
                  onAskAi(activeDocArticle);
                } else {
                  onClose();
                }
              }}
              data-testid="btn-doc-ask-ai-bridge"
            >
              <RiSparklingLine size={15} />
              <span>Ask AI About This Article</span>
            </button>
          </div>

          {/* Bottom Related Knowledge Base Guides Grid */}
          {relatedArticles.length > 0 && (
            <div className="inapp-doc-related-strip" style={{ marginTop: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Related Articles in this Section &amp; Issue:
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  Click any article to read without leaving this screen
                </span>
              </div>
              
              <div className="inapp-doc-related-grid">
                {relatedArticles.map(rel => (
                  <div
                    key={rel.id}
                    className="inapp-doc-card"
                    onClick={() => {
                      setSelectedArticleId(rel.id);
                      setDocFeedbackGiven(false);
                    }}
                  >
                    <div>
                      <div className="inapp-doc-card-header">
                        <span className="inapp-doc-card-badge">
                          {rel.category}
                        </span>
                        <span className="inapp-doc-card-time">
                          <RiTimeLine size={11} /> {rel.readingTime}
                        </span>
                      </div>
                      <h4 className="inapp-doc-card-title">{rel.title}</h4>
                      <p className="inapp-doc-card-excerpt">{rel.excerpt}</p>
                    </div>
                    <div className="inapp-doc-card-action">
                      <span>Read this Guide</span>
                      <RiArrowRightLine size={12} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="inapp-doc-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12.5px', color: '#64748b' }}>Was this article helpful?</span>
            {docFeedbackGiven ? (
              <span style={{ fontSize: '12.5px', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <RiCheckLine size={15} /> Thank you!
              </span>
            ) : (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setDocFeedbackGiven(true)}
                  className="inapp-doc-feedback-btn"
                >
                  👍 Yes
                </button>
                <button
                  type="button"
                  onClick={() => setDocFeedbackGiven(true)}
                  className="inapp-doc-feedback-btn"
                >
                  👎 No
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => handleCopyArticleLink(activeDocArticle.id)}
              style={{
                background: 'none',
                border: 'none',
                color: copiedDocLink ? 'var(--cyan)' : '#94a3b8',
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiShareLine size={15} />
              <span>{copiedDocLink ? 'Link Copied!' : 'Share Article'}</span>
            </button>
            <button
              type="button"
              className="inapp-doc-done-btn"
              onClick={onClose}
            >
              <RiArrowLeftLine size={14} />
              <span>Back to {resolvedContextTitle}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
