import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import {
  RiBookOpenLine,
  RiSparklingLine,
  RiCloseLine,
  RiSendPlane2Fill,
  RiDatabase2Line,
  RiExternalLinkLine,
  RiArrowRightLine,
  RiCheckboxCircleFill,
  RiRefreshLine,
  RiTimeLine,
  RiCheckLine,
  RiShareLine,
  RiInformationLine,
  RiArrowLeftLine
} from 'react-icons/ri'

import { HELP_ARTICLES, HELP_CATEGORIES } from '../../data/helpArticles.js'
import ArticleContentRenderer from './ArticleContentRenderer.jsx'
import InAppDocModal from './InAppDocModal.jsx'
export { InAppDocModal }
import {
  getRelevantDocLink,
  loadUserLifecycleMemory,
  loadAiChatHistory,
  saveAiChatHistory,
  generateAiAssistantResponse,
  logUserActivity
} from '../../services/userLifecycleMemory.js'

import './AppHelpAiControls.css'

export default function AppHelpAiControls({
  activeContext = 'home',
  sessionUser,
  onNavigateTab,
  floating = false
}) {
  // Modal states: both modals render via createPortal into document.body to remain strictly within viewport
  const [aiOverlayOpen, setAiOverlayOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [selectedDocArticleId, setSelectedDocArticleId] = useState(null);
  const [docFeedbackGiven, setDocFeedbackGiven] = useState(false);
  const [copiedDocLink, setCopiedDocLink] = useState(false);

  // AI assistant states
  const [memoryDrawerOpen, setMemoryDrawerOpen] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  const aiOverlayRef = useRef(null);
  const docOverlayRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const userId = sessionUser?.id || sessionUser?._id || sessionUser?.email || 'guest';
  const relevantDoc = getRelevantDocLink(activeContext);

  // Active article being inspected in the in-app doc modal
  const activeDocArticle = HELP_ARTICLES.find(a => a.id === selectedDocArticleId) ||
    HELP_ARTICLES.find(a => a.id === relevantDoc.articleId) ||
    HELP_ARTICLES[0];

  // Load chat history or initialize with personalized welcome
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = loadAiChatHistory(userId);
    if (saved && saved.length > 0) return saved;

    const initial = generateAiAssistantResponse('hello', sessionUser, activeContext, []);
    return [
      {
        id: 'msg-init',
        sender: 'assistant',
        text: initial.reply,
        suggestedActions: initial.suggestedActions,
        timestamp: new Date().toISOString()
      }
    ];
  });

  // Current lifecycle memory snapshot
  const [userMemory, setUserMemory] = useState(() => loadUserLifecycleMemory(sessionUser));

  // Sync lifecycle memory when overlay opens or user changes
  useEffect(() => {
    if (aiOverlayOpen) {
      const mem = loadUserLifecycleMemory(sessionUser);
      setUserMemory(mem);
      if (inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [aiOverlayOpen, sessionUser]);

  // Save chat history on update
  useEffect(() => {
    saveAiChatHistory(userId, chatMessages);
  }, [chatMessages, userId]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (aiOverlayOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiTyping, aiOverlayOpen]);

  // Global ESC key listener to close active overlays and leave user right where they were
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (docModalOpen) setDocModalOpen(false);
        if (aiOverlayOpen) setAiOverlayOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [docModalOpen, aiOverlayOpen]);

  // Open contextual doc in an in-app overlay modal (leaving active app completely intact)
  const handleOpenDocModal = (e) => {
    if (e) e.preventDefault();
    setSelectedDocArticleId(relevantDoc.articleId);
    setDocFeedbackGiven(false);
    setDocModalOpen(true);

    // Record activity in lifecycle memory
    logUserActivity(sessionUser, {
      type: 'doc_view',
      action: 'Opened In-App Documentation',
      app: relevantDoc.appTitle,
      summary: `Viewed contextual documentation for ${relevantDoc.appTitle}`,
      metadata: { context: activeContext, articleId: relevantDoc.articleId }
    });
  };

  // Switch to AI Assistant with contextual prompt from current documentation
  const handleAskAiAboutArticle = (article) => {
    setDocModalOpen(false);
    setAiOverlayOpen(true);
    const bridgePrompt = `Explain how "${article.title}" directly applies to my ${relevantDoc.appTitle} workspace and catalog.`;
    handleSendMessage(bridgePrompt);
  };

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

  // Send Prompt to AI
  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsAiTyping(true);

    // Record user inquiry as an activity in lifecycle memory
    logUserActivity(sessionUser, {
      type: 'ai_copilot_prompt',
      action: 'AI Prompt Assistant Consultation',
      app: relevantDoc.appTitle,
      summary: `Prompted AI: "${text.length > 50 ? text.substring(0, 47) + '...' : text}"`,
      metadata: { context: activeContext }
    });

    // Simulate AI thinking and response with full lifecycle context
    setTimeout(() => {
      const response = generateAiAssistantResponse(text, sessionUser, activeContext, chatMessages);
      const assistantMsg = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        suggestedActions: response.suggestedActions,
        timestamp: new Date().toISOString()
      };

      setChatMessages(prev => [...prev, assistantMsg]);
      setIsAiTyping(false);
      setUserMemory(loadUserLifecycleMemory(sessionUser));
    }, 600);
  };

  // Clear conversation history
  const handleClearHistory = () => {
    const initial = generateAiAssistantResponse('hello', sessionUser, activeContext, []);
    const resetMsgs = [
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'assistant',
        text: initial.reply,
        suggestedActions: initial.suggestedActions,
        timestamp: new Date().toISOString()
      }
    ];
    setChatMessages(resetMsgs);
    saveAiChatHistory(userId, resetMsgs);
  };

  // Suggested quick prompt chips based on active tab
  const getContextualPrompts = () => {
    switch (activeContext) {
      case 'splits':
        return ['Explain my split percentages', 'How are recoupable debts deducted?', 'When to sign split sheets?'];
      case 'publishing-election':
      case 'publishing':
        return ['Why choose Administrator Mode?', 'How do mechanical royalties work?', 'How does ASCAP vs BMI split works?'];
      case 'mastering':
        return ['Streaming loudness target standards', 'Why is -1.0 dBFS true peak important?', 'Difference between -14 LUFS and -16 LUFS'];
      case 'sync':
      case 'sync-placement':
        return ['How to pitch to music supervisors', 'What deliverables do supervisors need?', 'How do cue sheets generate royalties?'];
      case 'corporate-ads':
        return ['Explain corporate ad rate packages', 'What is the Amplified Tier CPM?', 'How does brand telemetry tracking work?'];
      case 'catalog':
        return ['How do ISRC and ISWC work together?', 'Prevent black box royalty losses', 'One-Stop licensing advantages'];
      case 'epk':
      case 'epk-builder':
        return ['How to map custom domain DNS', 'Essential elements of an EPK', 'Adding tour riders to press kit'];
      default:
        return ['Summarize my lifecycle history', 'How many credits do I have left?', 'How do master vs composition rights work?'];
    }
  };

  // Related articles in same category or adjacent topics for quick navigation inside doc modal
  const relatedArticles = HELP_ARTICLES.filter(a => a.id !== activeDocArticle.id && a.category === activeDocArticle.category).slice(0, 3);

  return (
    <>
      {/* Top Right Corner Action Button Stack (Specifically inside the app workspace) */}
      <div className={`app-help-ai-controls ${floating ? 'floating' : ''}`} data-testid="app-help-ai-controls">
        {/* Button 1: need help - view docs (Opens in-app modal overlay without leaving user's app) */}
        <button
          type="button"
          onClick={handleOpenDocModal}
          className="app-help-ai-btn btn-view-docs"
          title={`Need help? View docs for ${relevantDoc.appTitle}`}
          data-testid="btn-need-help-view-docs"
        >
          <RiBookOpenLine className="doc-icon" />
          <span>need help - view docs</span>
        </button>

        {/* Button 2: ask ai (placed directly below Button 1) */}
        <button
          type="button"
          className="app-help-ai-btn btn-ask-ai"
          onClick={() => setAiOverlayOpen(true)}
          title="Open AI Prompt Assistant (Lifecycle Memory Active)"
          data-testid="btn-ask-ai"
        >
          <RiSparklingLine className="ai-sparkle-icon" />
          <span>ask ai</span>
          <span className="ai-memory-badge" title="AI Lifecycle Memory Synced" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. IN-APP CONTEXTUAL DOC READER MODAL OVERLAY                              */}
      {/* Mounted via createPortal to document.body, centered in viewport,          */}
      {/* closes on outside click or Esc, leaves user right in their app.           */}
      {/* ========================================================================= */}
      <InAppDocModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        activeContext={activeContext}
        initialArticleId={selectedDocArticleId || relevantDoc.articleId}
        contextTitle={relevantDoc.appTitle}
        sessionUser={sessionUser}
        onAskAi={handleAskAiAboutArticle}
      />

      {/* ========================================================================= */}
      {/* 2. AI ASSISTANT FULLSCREEN OVERLAY MODAL                                  */}
      {/* Centered within true viewport via createPortal(..., document.body),       */}
      {/* closes on backdrop click or Esc, full user lifecycle memory retained.    */}
      {/* ========================================================================= */}
      {aiOverlayOpen && createPortal(
        <div
          ref={aiOverlayRef}
          className="ai-assistant-overlay"
          onClick={(e) => {
            if (e.target === aiOverlayRef.current) setAiOverlayOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          data-testid="ai-assistant-overlay"
        >
          <div className="ai-assistant-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="ai-dialog-header">
              <div className="ai-header-left">
                <div className="ai-avatar-badge">
                  <RiSparklingLine />
                </div>
                <div>
                  <div className="ai-header-title">TuneMavens AI Copilot</div>
                  <div className="ai-header-status">
                    <span className="ai-status-dot" />
                    <span>Full Lifecycle Memory Active · Synced with your account</span>
                  </div>
                </div>
              </div>

              <div className="ai-header-actions">
                <button
                  type="button"
                  className="ai-memory-toggle-btn"
                  onClick={() => setMemoryDrawerOpen(o => !o)}
                  title="View what the AI remembers about your creator lifecycle"
                >
                  <RiDatabase2Line />
                  <span>{memoryDrawerOpen ? 'Hide Memory' : 'View Memory'}</span>
                </button>
                <button
                  type="button"
                  className="ai-close-btn"
                  onClick={() => setAiOverlayOpen(false)}
                  title="Close AI Assistant (Esc or click outside)"
                  data-testid="btn-close-ai-assistant"
                >
                  <RiCloseLine size={20} />
                </button>
              </div>
            </div>

            {/* Lifecycle Memory Drawer (Expandable) */}
            {memoryDrawerOpen && (
              <div className="ai-memory-drawer">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Persistent Lifecycle Memory Records
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {userMemory.activities?.length || 0} recorded activities across lifecycle
                  </span>
                </div>

                <div className="ai-memory-grid">
                  <div className="ai-memory-card">
                    <div className="ai-memory-card-label">Active Persona &amp; Role</div>
                    <div className="ai-memory-card-value">{userMemory.userName} ({userMemory.primaryRole})</div>
                  </div>
                  <div className="ai-memory-card">
                    <div className="ai-memory-card-label">Universal Credits</div>
                    <div className="ai-memory-card-value" style={{ color: 'var(--cyan)' }}>
                      {userMemory.creditsBalance} Credits
                    </div>
                  </div>
                  <div className="ai-memory-card">
                    <div className="ai-memory-card-label">Registered Catalog</div>
                    <div className="ai-memory-card-value">
                      {userMemory.catalogStats?.registeredTracks || 0} Tracks (One-Stop)
                    </div>
                  </div>
                  <div className="ai-memory-card">
                    <div className="ai-memory-card-label">Current App Context</div>
                    <div className="ai-memory-card-value" style={{ color: 'var(--purple)' }}>
                      {relevantDoc.appTitle}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  <strong style={{ color: '#cbd5e1' }}>Recent Lifecycle Timeline:</strong>
                  <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {(userMemory.activities || []).slice(0, 3).map(act => (
                      <div key={act.id} style={{ display: 'flex', gap: '8px', fontSize: '11.5px', color: '#94a3b8' }}>
                        <span style={{ color: 'var(--cyan)' }}>•</span>
                        <strong style={{ color: '#f1f5f9' }}>{act.app}:</strong>
                        <span>{act.action} — {act.summary}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Chat Body */}
            <div className="ai-chat-body">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`ai-msg ${msg.sender}`}>
                  <div className="ai-msg-avatar">
                    {msg.sender === 'user' ? 'U' : <RiSparklingLine size={16} />}
                  </div>
                  <div className="ai-msg-bubble">
                    {msg.text.split('\n\n').map((para, pIdx) => (
                      <p key={pIdx}>
                        {para.split('\n').map((line, lIdx) => (
                          <React.Fragment key={lIdx}>
                            {line.startsWith('* ') ? (
                              <span style={{ display: 'block', paddingLeft: '12px' }}>
                                <span style={{ color: 'var(--cyan)', marginRight: '6px' }}>•</span>
                                {line.substring(2)}
                              </span>
                            ) : (
                              line
                            )}
                            {lIdx < line.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    ))}

                    {/* Action Pills */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="ai-action-pills">
                        {msg.suggestedActions.map((action, aIdx) => (
                          action.link ? (
                            <Link
                              key={aIdx}
                              to={action.link}
                              className="ai-action-pill"
                              onClick={() => setAiOverlayOpen(false)}
                            >
                              <span>{action.label}</span>
                              <RiExternalLinkLine size={12} />
                            </Link>
                          ) : action.tab ? (
                            <button
                              key={aIdx}
                              type="button"
                              className="ai-action-pill"
                              onClick={() => {
                                if (onNavigateTab) onNavigateTab(action.tab);
                                setAiOverlayOpen(false);
                              }}
                            >
                              <span>{action.label}</span>
                              <RiArrowRightLine size={12} />
                            </button>
                          ) : null
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div className="ai-msg assistant">
                  <div className="ai-msg-avatar">
                    <RiSparklingLine size={16} />
                  </div>
                  <div className="ai-msg-bubble" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>Analyzing user lifecycle memory &amp; catalog...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Contextual Quick Suggestions */}
            <div className="ai-suggested-prompts">
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Suggested:
              </span>
              {getContextualPrompts().map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="ai-prompt-chip"
                  onClick={() => handleSendMessage(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Input & Controls */}
            <div className="ai-chat-footer">
              <button
                type="button"
                onClick={handleClearHistory}
                title="Reset conversation"
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center' }}
              >
                <RiRefreshLine size={18} />
              </button>

              <input
                ref={inputRef}
                type="text"
                placeholder={`Ask AI about ${relevantDoc.appTitle}, splits, publishing, or your catalog...`}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                className="ai-input-field"
              />

              <button
                type="button"
                className="ai-send-btn"
                onClick={() => handleSendMessage()}
                disabled={!inputPrompt.trim() || isAiTyping}
                title="Send message (Enter)"
              >
                <RiSendPlane2Fill />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
