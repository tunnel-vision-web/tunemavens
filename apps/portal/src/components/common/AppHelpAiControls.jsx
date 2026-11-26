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
  activeContext,
  context,
  activeTab,
  sessionUser,
  onNavigateTab,
  floating = false
}) {
  const currentContext = activeTab || activeContext || context || 'home';

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
  const relevantDoc = getRelevantDocLink(currentContext, sessionUser);

  // Active article being inspected in the in-app doc modal
  const activeDocArticle = HELP_ARTICLES.find(a => a.id === selectedDocArticleId) ||
    HELP_ARTICLES.find(a => a.id === relevantDoc.articleId) ||
    HELP_ARTICLES[0];

  // Load chat history or initialize with personalized welcome
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = loadAiChatHistory(userId);
    if (saved && saved.length > 0) return saved;

    const initial = generateAiAssistantResponse('hello', sessionUser, currentContext, []);
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

  // Global listeners for open triggers from topbar icon buttons or other UI elements
  useEffect(() => {
    const handleOpenHelp = (e) => {
      const targetArticleId = e?.detail?.articleId || null;
      const targetContext = e?.detail?.tab || e?.detail?.context || currentContext;
      const targetUser = e?.detail?.user || sessionUser;
      handleOpenDocModal(null, targetArticleId, targetContext, targetUser);
    };
    const handleOpenAi = (e) => {
      setAiOverlayOpen(true);
      if (e?.detail?.prompt) {
        handleSendMessage(e.detail.prompt);
      }
    };
    window.addEventListener('tunemavens:open-help', handleOpenHelp);
    window.addEventListener('tunemavens:open-ai', handleOpenAi);
    return () => {
      window.removeEventListener('tunemavens:open-help', handleOpenHelp);
      window.removeEventListener('tunemavens:open-ai', handleOpenAi);
    };
  }, [currentContext, sessionUser]);

  // Open contextual doc in an in-app overlay modal (leaving active app completely intact)
  const handleOpenDocModal = (e, customArticleId = null, customContext = null, customUser = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const ctx = customContext || currentContext;
    const usr = customUser || sessionUser;
    const resolvedDoc = getRelevantDocLink(ctx, usr);
    const targetId = customArticleId || resolvedDoc.articleId;
    setSelectedDocArticleId(targetId);
    setDocFeedbackGiven(false);
    setDocModalOpen(true);

    // Record activity in lifecycle memory
    logUserActivity(usr, {
      type: 'doc_view',
      action: 'Opened In-App Documentation',
      app: resolvedDoc.appTitle,
      summary: `Viewed contextual documentation for ${resolvedDoc.appTitle}`,
      metadata: { context: ctx, articleId: targetId }
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
      metadata: { context: currentContext }
    });

    // Simulate AI thinking and response with full lifecycle context
    setTimeout(() => {
      const response = generateAiAssistantResponse(text, sessionUser, currentContext, chatMessages);
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
    const initial = generateAiAssistantResponse('hello', sessionUser, currentContext, []);
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
    switch (currentContext) {
      case 'companion':
      case 'tunecompanion':
        return [
          'How does the 7-tier split waterfall work?',
          'How do M-Pesa & Stripe cashouts clear?',
          'How does the Sync Radar brief match work?',
          'Explain AI Playbook release targets'
        ];
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
      case 'ads':
        return ['Explain corporate ad rate packages', 'What is the Amplified Tier CPM?', 'How does brand telemetry tracking work?', 'How does ad injection routing work?'];
      case 'catalogue-acquisitions':
        return ['How does Path C 100% buyout work?', 'What is the 3x to 5x ARR multiple calculation?', 'How does catalog escrow clearance work?'];
      case 'dj-pool':
        return ['Explain BPM/Key dancefloor indexing', 'How does 30-day dancefloor clearance work?', 'What is the 1 credit per download pool tier?'];
      case 'mycontracts':
        return ['How does automated counterparty escrow work?', 'Explain irrevocable split sheet lock-in', 'How are breach remedies enforced?'];
      case 'wall-of-fame':
        return ['What are the criteria for Wall of Fame induction?', 'How do EPK showcase links work?', 'How does viral momentum tracking work?'];
      case 'inbox':
      case 'crm':
        return ['How do Email-Only Target Groups & CSV imports work?', 'How do Event Flyers, Preview Email & RSVP/Ticket CTAs work?', 'Explain Affiliate Reachout attribution & dual notifications', 'How does the Self-Learning Persona CRM Engine optimize copy?'];
      case 'media-house':
        return ['How does broadcast syndication routing work?', 'Explain linear TV & FM cue clearance', 'What are satellite radio stem bundles?'];
      case 'localization':
        return ['Which local fiat currencies are supported?', 'Explain real-time M-Pesa & SEPA conversion', 'How does geo-targeted royalty settlement work?'];
      case 'offline-crates':
        return ['How does 8GB offline crate caching work?', 'Does offline play log DDEX telemetry?', 'How does offline direct tipping work?'];
      case 'catalog':
        return ['How do ISRC and ISWC work together?', 'Prevent black box royalty losses', 'One-Stop licensing advantages'];
      case 'epk':
      case 'epk-builder':
        return ['How to map custom domain DNS', 'Essential elements of an EPK', 'Adding tour riders to press kit'];
      case 'backend-admin':
      case 'admin-team':
        return ['How does persona RBAC isolation work?', 'Explain multi-host domain routing', 'How are Wall of Fame inductees claimed?', 'Managing enterprise roles & seats'];
      case 'affiliates':
      case 'affiliate':
        return ['How does the 3% to 12% commission matrix calculate?', 'How do 90-day referral cookies work?', 'How to withdraw commissions via M-Pesa?'];
      case 'podcaster-studio':
      case 'podcast-studio':
      case 'podcaster-episodes':
      case 'podcaster-monetization':
      case 'podcaster-guests':
      case 'podcaster-epk':
      case 'podcasts':
        return ['How does dynamic audio ad insertion work?', 'How are host-read sponsor splits calculated?', 'What audio format is required for RSS syndication?', 'How to generate broadcast release waivers?'];
      case 'distribution-tracker':
        return ['How does DSP metadata delivery telemetry work?', 'What is the delivery status for Apple Music & Spotify?', 'How to resolve ISRC metadata mismatches?'];
      case 'hosting-manager':
        return ['How to configure DNS A and CNAME records', 'How does automatic SSL certificate issuance work?', 'Can I host multiple custom domains?'];
      case 'pos-terminal':
      case 'pos-inventory':
      case 'pos-settlement':
      case 'pos-devices':
        return ['How does offline M-Pesa STK push work?', 'How does real-time inventory decrement sync?', 'How do nightly concert settlements disburse?'];
      case 'vc-discover':
      case 'vc-portfolio':
      case 'vc-sponsorship':
      case 'tours-vault':
        return ['How does tour advance underwriting work?', 'What is the career sponsorship recoupment waterfall?', 'How to evaluate catalog streaming yield?'];
      case 'communications':
      case 'communications-vault':
        return ['How are audit logs preserved?', 'How does the WhatsApp notification protocol work?', 'How to filter automated compliance notices?'];
      case 'tours':
      case 'global-tours-live-concerts-ticketing':
        return ['How does the capacity-gated FIFO waitlist work?', 'How do Admin Featured Events and multi-talent EPKs work?', 'How do Free-with-RSVP reservations and guest limits work?'];
      case 'dj-mixes':
      case 'djpool':
        return ['Explain 100% prior copyright clearance for DJ sets', 'How does camelot harmonic key matching work?', 'How to export setlist crates to CDJs?'];
      case 'listener-apps':
      case 'device-sync':
      case 'stream-controls':
      case 'library':
      case 'radio':
      case 'explore':
        return ['How does 24-bit 96kHz lossless playback work?', 'How does offline 8GB crate caching operate?', 'How to tip artists directly via M-Pesa?'];
      default:
        return ['Summarize my lifecycle history', 'How many credits do I have left?', 'How do master vs composition rights work?'];
    }
  };

  // Related articles in same category or adjacent topics for quick navigation inside doc modal
  const relatedArticles = HELP_ARTICLES.filter(a => a.id !== activeDocArticle.id && a.category === activeDocArticle.category).slice(0, 3);

  return (
    <>
            {/* Action Button Container */}
      <div className={`app-help-ai-controls ${floating ? 'floating' : ''}`} data-testid="app-help-ai-controls">
        <button
          type="button"
          onClick={handleOpenDocModal}
          className="app-help-ai-btn btn-view-docs"
          title={`Get Help: View documentation for ${relevantDoc.appTitle}`}
          data-testid="btn-get-help"
        >
          <RiBookOpenLine className="doc-icon" />
          <span>Get Help</span>
        </button>

        <button
          type="button"
          className="app-help-ai-btn btn-ask-ai"
          onClick={() => setAiOverlayOpen(true)}
          title="Ask AI: Consult Ayo AI Copilot (Lifecycle Memory Active)"
          data-testid="btn-ask-ai"
        >
          <RiSparklingLine className="ai-sparkle-icon" />
          <span>Ask AI</span>
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
        activeContext={currentContext}
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


// Reusable Standalone Button Pair for Topbars & Navigation Bars
export function GetHelpAskAiButtons({
  className = '',
  style = {},
  compact = false,
  iconOnly = false,
  activeTab = null,
  activeContext = null,
  sessionUser = null
}) {
  const triggerOpenHelp = () => {
    window.dispatchEvent(new CustomEvent('tunemavens:open-help', {
      detail: {
        tab: activeTab || activeContext,
        context: activeContext || activeTab,
        role: sessionUser?.role || sessionUser?.simulated_role,
        user: sessionUser
      }
    }));
  };

  const triggerOpenAi = () => {
    window.dispatchEvent(new CustomEvent('tunemavens:open-ai', {
      detail: {
        tab: activeTab || activeContext,
        context: activeContext || activeTab,
        role: sessionUser?.role || sessionUser?.simulated_role,
        user: sessionUser
      }
    }));
  };

  return (
    <div className={`topbar-help-ai-group ${className}`} style={style} data-testid="topbar-help-ai-group">
      <button
        type="button"
        className={`topbar-help-btn btn-get-help ${compact ? 'compact' : ''} ${iconOnly ? 'topbar-nav-icon-btn' : ''}`}
        onClick={triggerOpenHelp}
        title="Get Help: Open contextual in-app documentation & guides"
        data-tooltip="Get Help"
        data-testid="topbar-btn-get-help"
      >
        <RiBookOpenLine className="topbar-help-icon" size={iconOnly ? 16 : 14} />
        <span className={iconOnly ? 'topbar-item-label' : ''}>Get Help</span>
      </button>

      <button
        type="button"
        className={`topbar-help-btn btn-ask-ai-topbar ${compact ? 'compact' : ''} ${iconOnly ? 'topbar-nav-icon-btn' : ''}`}
        onClick={triggerOpenAi}
        title="Ask AI: Consult Ayo AI Copilot (Lifecycle Memory Active)"
        data-tooltip="Ask AI (Ayo Copilot)"
        data-testid="topbar-btn-ask-ai"
      >
        <RiSparklingLine className="topbar-ai-icon" size={iconOnly ? 16 : 14} />
        <span className={iconOnly ? 'topbar-item-label' : ''}>Ask AI</span>
        <span className="ai-memory-badge" title="AI Lifecycle Memory Synced" />
      </button>
    </div>
  );
}

AppHelpAiControls.GetHelpAskAiButtons = GetHelpAskAiButtons;
if (typeof window !== 'undefined') {
  window.GetHelpAskAiButtons = GetHelpAskAiButtons;
}
