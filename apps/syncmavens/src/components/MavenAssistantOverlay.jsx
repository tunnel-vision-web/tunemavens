import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Minimize2 } from 'lucide-react';

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

function buildLocalFallback(prompt, firstName, appName, route) {
  const q = prompt.toLowerCase();
  if (q.includes('sync') || q.includes('brief') || q.includes('escrow') || q.includes('cue')) {
    return {
      reply: `Hi ${firstName}! In ${appName} (${route}), SyncMavens handles one-stop pre-cleared sync licensing with milestone escrow and automated cue-sheet royalty cascades.`,
      actions: ['Review Licensing Escrow', 'Featured Events & Waitlist']
    };
  }
  if (q.includes('event') || q.includes('waitlist') || q.includes('featured') || q.includes('epk')) {
    return {
      reply: `Hi ${firstName}! Featured Events on SyncMavens link straight to the event page, RSVP/Checkout, and individual EPKs for every Host, MC, and Entertainer.`,
      actions: ['Open Featured Event', 'How does Multi-EPK work?']
    };
  }
  return {
    reply: `Hi ${firstName}! I'm **Maven**, your persistent intelligence across SyncMavens, TuneMavens, TuneStream, and Intermaven. I'm tracking your session in **${route}**. Ask me about sync briefs, escrow clearance, Featured Events, or royalty splits!`,
    actions: ['Sync Licensing Escrow', 'Featured Events & Waitlist', 'Multi-EPK Setup']
  };
}

export default function MavenAssistantOverlay({ sessionUser, appName = 'SyncMavens' }) {
  const effectiveUser = sessionUser || (() => {
    try {
      const saved =
        sessionStorage.getItem('syncmavens_session') ||
        sessionStorage.getItem('tunemavens_session') ||
        localStorage.getItem('tunemavens_saved_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const userId = effectiveUser?.id || effectiveUser?._id || effectiveUser?.email || 'guest';
  const firstName = extractFirstName(effectiveUser);
  const storageKey = `maven_chat_history_${userId}`;
  const dismissKey = 'maven_overlay_dismissed_v1';

  const getRoute = () =>
    typeof window !== 'undefined' ? window.location.pathname + window.location.hash : '/';

  const [route, setRoute] = useState(getRoute);
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
    const init = buildLocalFallback('hello', firstName, appName, getRoute());
    return [
      {
        id: 'maven-welcome',
        sender: 'assistant',
        text: init.reply,
        suggestedActions: init.actions,
        timestamp: new Date().toISOString()
      }
    ];
  });

  const endRef = useRef(null);

  useEffect(() => {
    const syncRoute = () => setRoute(getRoute());
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages.slice(-40)));
    } catch (_) {}
  }, [messages, storageKey]);

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

  const handleToggle = (next) => {
    setIsOpen(next);
    setHasAutoOpened(true);
    try {
      sessionStorage.setItem('maven_overlay_open', String(next));
      if (!next) sessionStorage.setItem(dismissKey, 'true');
    } catch (_) {}
  };

  const handleSend = async (overrideText) => {
    const query = (typeof overrideText === 'string' ? overrideText : inputValue).trim();
    if (!query) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);
    if (typeof overrideText !== 'string') setInputValue('');
    setIsTyping(true);

    try {
      const apiBase =
        typeof window !== 'undefined' && window.location.hostname === 'localhost'
          ? 'http://127.0.0.1:8001'
          : '';
      const res = await fetch(`${apiBase}/api/admin/console/ask-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          persona: effectiveUser?.role || 'supervisor',
          context: `${appName} (${route})`,
          user_name: effectiveUser?.name || '',
          first_name: firstName,
          active_route: `${appName} ${route}`
        })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `m-${Date.now()}`,
            sender: 'assistant',
            text: data.reply,
            suggestedActions: data.suggested_actions || [],
            timestamp: new Date().toISOString()
          }
        ]);
        setIsTyping(false);
        return;
      }
    } catch (_) {}

    const fallback = buildLocalFallback(query, firstName, appName, route);
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        sender: 'assistant',
        text: fallback.reply,
        suggestedActions: fallback.actions,
        timestamp: new Date().toISOString()
      }
    ]);
    setIsTyping(false);
  };

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
          gap: '9px',
          padding: '10px 15px',
          background: 'rgba(9, 14, 28, 0.96)',
          color: '#f8fafc',
          border: '1px solid rgba(34, 211, 238, 0.48)',
          borderRadius: '3px',
          boxShadow: '0 10px 28px rgba(0, 0, 0, 0.55)',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 700,
          backdropFilter: 'blur(12px)'
        }}
      >
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
        width: 'min(380px, calc(100vw - 24px))',
        height: 'min(490px, calc(100vh - 40px))',
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(9, 14, 28, 0.97)',
        border: '1px solid rgba(34, 211, 238, 0.4)',
        borderRadius: '3px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
        color: '#e2e8f0'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '11px 14px',
          background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.98), rgba(14, 116, 144, 0.25))',
          borderBottom: '1px solid rgba(34, 211, 238, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={15} color="#22d3ee" />
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#ffffff' }}>Maven</div>
            <div style={{ fontSize: '10.5px', color: '#22d3ee', fontWeight: 600 }}>
              {appName} • {route}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => handleToggle(false)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#cbd5e1',
              borderRadius: '3px',
              padding: '4px 6px',
              cursor: 'pointer'
            }}
          >
            <Minimize2 size={13} />
          </button>
          <button
            type="button"
            onClick={() => handleToggle(false)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#cbd5e1',
              borderRadius: '3px',
              padding: '4px 6px',
              cursor: 'pointer'
            }}
          >
            <X size={13} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
              background: msg.sender === 'user' ? '#0e7490' : 'rgba(15, 23, 42, 0.92)',
              border: '1px solid rgba(148, 163, 184, 0.22)',
              color: '#f8fafc'
            }}
          >
            {msg.text}
          </div>
        ))}
        {isTyping && <div style={{ fontSize: '11.5px', color: '#22d3ee' }}>Maven is thinking...</div>}
        <div ref={endRef} />
      </div>

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
          style={{
            background: '#22d3ee',
            color: '#090e1c',
            border: 'none',
            borderRadius: '3px',
            padding: '0 12px',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
