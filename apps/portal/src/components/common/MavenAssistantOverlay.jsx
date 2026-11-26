import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Minimize2, MessageSquare } from 'lucide-react';
import {
  generateAiAssistantResponse,
  loadUserLifecycleMemory
} from '../../services/userLifecycleMemory';

function extractFirstName(user) {
  const raw =
    user?.first_name ||
    user?.firstName ||
    user?.name ||
    user?.full_name ||
    user?.brand_name ||
    '';
  const cleaned = String(raw).trim();
  if (cleaned) {
    const first = cleaned.split(/\s+/)[0];
    if (first && first.toLowerCase() !== 'creator' && first.toLowerCase() !== 'guest') {
      return first;
    }
  }
  if (user?.email) {
    const local = String(user.email).split('@')[0].split(/[._-]/)[0];
    if (local) return local.charAt(0).toUpperCase() + local.slice(1);
  }
  return 'there';
}

function resolveRouteLabel() {
  if (typeof window === 'undefined') return 'TuneMavens Portal';
  const hash = window.location.hash.replace(/^#\/?/, '');
  const path = window.location.pathname.replace(/^\//, '');
  const raw = hash || path || 'home';
  if (raw.startsWith('events')) return 'Events & RSVP';
  if (raw.startsWith('for/')) return `Audience Landing (${raw.replace('for/', '')})`;
  if (raw.startsWith('help')) return 'Help & Knowledge Base';
  if (raw.startsWith('blog')) return 'Ecosystem Blog';
  if (raw.startsWith('epk')) return 'Creator EPK';
  if (raw.startsWith('dashboard')) return 'Creator Dashboard';
  return raw === 'home' ? 'TuneMavens Home' : raw;
}

export default function MavenAssistantOverlay({ sessionUser, appName = 'TuneMavens Portal' }) {
  const effectiveUser = sessionUser || (() => {
    try {
      const saved = sessionStorage.getItem('tunemavens_session') || localStorage.getItem('tunemavens_saved_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const userId = effectiveUser?.id || effectiveUser?._id || effectiveUser?.email || 'guest';
  const firstName = extractFirstName(effectiveUser);
  const storageKey = `maven_chat_history_${userId}`;
  const dismissKey = 'maven_overlay_dismissed_v1';

  const [isOpen, setIsOpen] = useState(() => {
    try {
      return sessionStorage.getItem('maven_overlay_open') === 'true';
    } catch {
      return false;
    }
  });
  const [hasAutoOpened, setHasAutoOpened] = useState(() => {
    try {
      return sessionStorage.getItem(dismissKey) === 'true';
    } catch {
      return false;
    }
  });
  const [routeLabel, setRouteLabel] = useState(resolveRouteLabel);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    const initial = generateAiAssistantResponse('hello', effectiveUser, resolveRouteLabel(), []);
    return [
      {
        id: 'maven-welcome',
        sender: 'assistant',
        text: initial.reply,
        suggestedActions: initial.suggestedActions,
        timestamp: new Date().toISOString()
      }
    ];
  });

  const endRef = useRef(null);

  // Track route/hash changes so Maven always has live context
  useEffect(() => {
    const updateRoute = () => setRouteLabel(resolveRouteLabel());
    window.addEventListener('hashchange', updateRoute);
    window.addEventListener('popstate', updateRoute);
    return () => {
      window.removeEventListener('hashchange', updateRoute);
      window.removeEventListener('popstate', updateRoute);
    };
  }, []);

  // Re-personalize welcome message when user signs in or switches profile
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'maven-welcome') {
        const refreshed = generateAiAssistantResponse('hello', effectiveUser, routeLabel, []);
        return [{ ...prev[0], text: refreshed.reply, suggestedActions: refreshed.suggestedActions }];
      }
      return prev;
    });
  }, [userId, firstName]);

  // Persist messages across routes and reloads
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages.slice(-40)));
    } catch (_) {}
  }, [messages, storageKey]);

  // Pop up automatically after 25 seconds of browsing
  useEffect(() => {
    if (hasAutoOpened || isOpen) return;
    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasAutoOpened(true);
      try {
        sessionStorage.setItem('maven_overlay_open', 'true');
      } catch (_) {}
    }, 25000);
    return () => clearTimeout(timer);
  }, [hasAutoOpened, isOpen]);

  useEffect(() => {
    if (isOpen && endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleToggle = (nextState) => {
    setIsOpen(nextState);
    setHasAutoOpened(true);
    try {
      sessionStorage.setItem('maven_overlay_open', String(nextState));
      if (!nextState) sessionStorage.setItem(dismissKey, 'true');
    } catch (_) {}
  };

  const handleSend = (overrideText) => {
    const query = (typeof overrideText === 'string' ? overrideText : inputValue).trim();
    if (!query) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString()
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    if (typeof overrideText !== 'string') setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const ctx = `${appName} — ${routeLabel}`;
      const response = generateAiAssistantResponse(query, effectiveUser, ctx, nextHistory);
      const aiMsg = {
        id: `m-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        suggestedActions: response.suggestedActions || [],
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 220);
  };

  const memory = loadUserLifecycleMemory(effectiveUser);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => handleToggle(true)}
        aria-label="Open Maven Persistent Assistant"
        style={{
          position: 'fixed',
          bottom: '22px',
          right: '22px',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 16px',
          background: 'rgba(9, 14, 28, 0.96)',
          color: '#f8fafc',
          border: '1px solid rgba(34, 211, 238, 0.48)',
          borderRadius: '3px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.55), 0 0 18px rgba(34, 211, 238, 0.18)',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.02em',
          backdropFilter: 'blur(12px)'
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#22d3ee',
            boxShadow: '0 0 8px #22d3ee'
          }}
        />
        <Sparkles size={15} color="#22d3ee" />
        <span>Ask Maven</span>
        {firstName !== 'there' && (
          <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: '11.5px' }}>
            • Hi {firstName}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Maven Persistent Assistant"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: 'min(390px, calc(100vw - 24px))',
        height: 'min(520px, calc(100vh - 40px))',
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(9, 14, 28, 0.97)',
        border: '1px solid rgba(34, 211, 238, 0.4)',
        borderRadius: '3px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.72), 0 0 28px rgba(34, 211, 238, 0.14)',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
        color: '#e2e8f0'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.98), rgba(14, 116, 144, 0.25))',
          borderBottom: '1px solid rgba(34, 211, 238, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '3px',
              background: 'rgba(34, 211, 238, 0.14)',
              border: '1px solid rgba(34, 211, 238, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sparkles size={15} color="#22d3ee" />
          </div>
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#ffffff', lineHeight: 1.15 }}>
              Maven
            </div>
            <div style={{ fontSize: '10.5px', color: '#22d3ee', fontWeight: 600 }}>
              Live in {routeLabel} • {memory.primaryRole}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => handleToggle(false)}
            title="Minimize Maven"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#cbd5e1',
              borderRadius: '3px',
              padding: '4px 6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Minimize2 size={13} />
          </button>
          <button
            type="button"
            onClick={() => handleToggle(false)}
            title="Close Maven"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#cbd5e1',
              borderRadius: '3px',
              padding: '4px 6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
              padding: '9px 11px',
              borderRadius: '3px',
              fontSize: '12.5px',
              lineHeight: 1.48,
              whiteSpace: 'pre-wrap',
              background:
                msg.sender === 'user'
                  ? 'linear-gradient(135deg, #0891b2, #0e7490)'
                  : 'rgba(15, 23, 42, 0.92)',
              border:
                msg.sender === 'user'
                  ? '1px solid rgba(34, 211, 238, 0.5)'
                  : '1px solid rgba(148, 163, 184, 0.2)',
              color: '#f8fafc'
            }}
          >
            {msg.text}
            {Array.isArray(msg.suggestedActions) && msg.suggestedActions.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {msg.suggestedActions.map((act, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (act.link) {
                        window.location.href = act.link;
                      } else {
                        handleSend(act.label || act);
                      }
                    }}
                    style={{
                      fontSize: '10.5px',
                      padding: '3px 8px',
                      borderRadius: '3px',
                      background: 'rgba(34, 211, 238, 0.12)',
                      border: '1px solid rgba(34, 211, 238, 0.35)',
                      color: '#67e8f9',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    {act.label || act}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div style={{ fontSize: '11.5px', color: '#22d3ee', padding: '4px 6px' }}>
            Maven is thinking...
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Prompts */}
      <div
        style={{
          padding: '6px 12px',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(6, 10, 20, 0.7)'
        }}
      >
        {['Featured Events & Waitlist', 'Multi-EPK Setup', 'Smart CRM', 'Royalty Splits'].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleSend(chip)}
            style={{
              whiteSpace: 'nowrap',
              fontSize: '10.5px',
              padding: '3px 8px',
              borderRadius: '3px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#cbd5e1',
              cursor: 'pointer'
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          display: 'flex',
          gap: '8px',
          padding: '10px 12px',
          borderTop: '1px solid rgba(34, 211, 238, 0.2)',
          background: 'rgba(9, 14, 28, 0.98)'
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Ask Maven anything, ${firstName}...`}
          style={{
            flex: 1,
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            borderRadius: '3px',
            padding: '8px 10px',
            color: '#ffffff',
            fontSize: '12.5px',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          aria-label="Send to Maven"
          style={{
            background: '#22d3ee',
            color: '#090e1c',
            border: 'none',
            borderRadius: '3px',
            padding: '0 12px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
