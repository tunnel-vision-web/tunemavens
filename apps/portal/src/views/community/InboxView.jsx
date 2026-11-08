import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  RiMailFill,
  RiMailLine,
  RiMailOpenLine,
  RiSendPlaneFill,
  RiCheckDoubleLine,
  RiDeleteBin6Line,
  RiArrowRightLine,
  RiExternalLinkLine,
  RiShieldCheckFill,
  RiSparklingFill,
  RiMoneyDollarCircleLine,
  RiDiscLine,
  RiRefreshLine,
  RiSearchLine,
  RiChat1Line
} from 'react-icons/ri';
import './InboxView.css';

export default function InboxView({ sessionUser }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  // Fetch Inbox messages from API
  const fetchInbox = async () => {
    try {
      const res = await fetch('/api/inbox');
      if (res.ok) {
        const data = await res.json();
        const msgList = data.messages || [];
        setMessages(msgList);
        if (msgList.length > 0 && !selectedMessageId) {
          setSelectedMessageId(msgList[0].id || msgList[0]._id);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch inbox:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const activeMessage = messages.find(
    (m) => (m.id || m._id) === selectedMessageId
  ) || messages[0] || null;

  // Mark message as read
  const handleSelectMessage = async (msg) => {
    const id = msg.id || msg._id;
    setSelectedMessageId(id);
    if (!msg.read) {
      try {
        await fetch(`/api/inbox/${id}/read`, { method: 'POST' });
        setMessages((prev) =>
          prev.map((m) => ((m.id || m._id) === id ? { ...m, read: true } : m))
        );
      } catch (err) {
        console.error('Error marking read:', err);
      }
    }
  };

  // Submit reply
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeMessage) return;

    setReplySubmitting(true);
    const id = activeMessage.id || activeMessage._id;
    try {
      const res = await fetch(`/api/inbox/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply_text: replyText.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        const newReply = data.reply || {
          id: String(Date.now()),
          author_name: sessionUser?.name || 'You',
          text: replyText.trim(),
          created_at: 'Just now',
        };
        setMessages((prev) =>
          prev.map((m) =>
            (m.id || m._id) === id
              ? { ...m, replies: [...(m.replies || []), newReply] }
              : m
          )
        );
        setReplyText('');
        setNotice('✨ Reply dispatched to operations desk.');
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      alert('Failed to send reply: ' + err.message);
    } finally {
      setReplySubmitting(false);
    }
  };

  // Delete message
  const handleDeleteMessage = async (id) => {
    try {
      await fetch(`/api/inbox/${id}`, { method: 'DELETE' });
      setMessages((prev) => prev.filter((m) => (m.id || m._id) !== id));
      if (selectedMessageId === id) {
        const remaining = messages.filter((m) => (m.id || m._id) !== id);
        setSelectedMessageId(remaining.length > 0 ? (remaining[0].id || remaining[0]._id) : null);
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  // Filter messages
  const filteredMessages = messages.filter((m) => {
    const matchesCat =
      activeCategory === 'all' ||
      (m.category && m.category.toLowerCase() === activeCategory.toLowerCase());
    const matchesUnread = !unreadOnly || !m.read;
    const matchesSearch =
      !searchQuery ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.body && m.body.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.sender && m.sender.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesUnread && matchesSearch;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="inbox-view-container">
      <div className="inbox-content-wrap">
        
        {/* Header Hero with Logo Protocol */}
        <div className="inbox-hero">
          <div className="inbox-hero-text">
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1, marginBottom: '14px' }}>
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1 }}>
                <img src="/tunemavens-logo-white.png" alt="TuneMavens Logo" style={{ height: '36px', width: 'auto', display: 'block' }} />
                <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#00f0ff', marginTop: '-3px', alignSelf: 'flex-end' }}>beta</span>
              </div>
            </div>
            <h1>
              <RiMailFill style={{ color: '#00f0ff' }} />
              In-App Communications &amp; Community Inbox
              <span className="inbox-hero-badge">Phase 6.5</span>
            </h1>
            <p className="inbox-hero-subtitle">
              Unified communication hub for broadcast campaigns, sync placement alerts, live escrow milestones, and direct community dialogues.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="community-btn community-btn-secondary" onClick={fetchInbox} title="Refresh messages">
              <RiRefreshLine /> Refresh
            </button>
            <Link to="/community" className="community-btn community-btn-primary">
              Wall of Fame ↗
            </Link>
          </div>
        </div>

        {notice && (
          <div className="inbox-notice-banner">
            <span>{notice}</span>
            <button onClick={() => setNotice('')}>×</button>
          </div>
        )}

        {/* Master Layout */}
        <div className="inbox-layout-grid">
          
          {/* Left Column: Filter & Message List */}
          <div className="inbox-list-panel">
            
            {/* Search Bar */}
            <div className="inbox-search-box">
              <RiSearchLine style={{ color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search subject, sender, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="inbox-search-input"
              />
            </div>

            {/* Filter Tabs */}
            <div className="inbox-category-bar">
              {[
                { key: 'all', label: `All (${messages.length})` },
                { key: 'campaign', label: 'Campaigns' },
                { key: 'deals', label: 'Deals & Sync' },
                { key: 'announcement', label: 'Announcements' },
              ].map((cat) => (
                <button
                  key={cat.key}
                  className={`inbox-cat-btn ${activeCategory === cat.key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  {cat.label}
                </button>
              ))}

              <button
                className={`inbox-cat-btn ${unreadOnly ? 'active' : ''}`}
                style={{ marginLeft: 'auto', color: unreadOnly ? '#00f0ff' : '#94a3b8' }}
                onClick={() => setUnreadOnly((prev) => !prev)}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Message Cards List */}
            <div className="inbox-messages-scroll">
              {filteredMessages.length === 0 ? (
                <div className="inbox-empty-box">
                  <RiMailLine size={36} style={{ color: '#475569', marginBottom: 10 }} />
                  <div style={{ color: '#ffffff', fontWeight: 700 }}>No messages found</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 4 }}>
                    Try selecting a different category or clearing search filters.
                  </div>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const id = msg.id || msg._id;
                  const isSelected = id === (activeMessage?.id || activeMessage?._id);
                  return (
                    <div
                      key={id}
                      className={`inbox-msg-card ${isSelected ? 'selected' : ''} ${!msg.read ? 'unread' : ''}`}
                      onClick={() => handleSelectMessage(msg)}
                    >
                      <div className="inbox-msg-header">
                        <span className="inbox-msg-sender">{msg.sender || 'TuneMavens Operations'}</span>
                        <span className="inbox-msg-time">
                          {msg.created_at ? (msg.created_at.includes('T') ? new Date(msg.created_at).toLocaleDateString() : msg.created_at) : 'Recent'}
                        </span>
                      </div>

                      <div className="inbox-msg-subject-row">
                        {!msg.read && <span className="inbox-unread-dot" />}
                        <div className="inbox-msg-subject">{msg.subject}</div>
                      </div>

                      <div className="inbox-msg-snippet">
                        {msg.body ? msg.body.slice(0, 85) + '...' : 'No preview available'}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                        <span className="inbox-tag">{msg.category || 'Campaign'}</span>
                        {msg.cta_url && (
                          <span style={{ fontSize: '0.7rem', color: '#00f0ff', fontWeight: 600 }}>
                            Action attached ↗
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Right Column: Message Detail & Thread */}
          <div className="inbox-detail-panel">
            {activeMessage ? (
              <div className="inbox-detail-card">
                
                {/* Detail Header */}
                <div className="inbox-detail-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span className="inbox-tag" style={{ textTransform: 'uppercase' }}>
                        {activeMessage.category || 'Campaign'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {activeMessage.created_at ? new Date(activeMessage.created_at).toLocaleString() : 'Just now'}
                      </span>
                    </div>
                    <h2 className="inbox-detail-title">{activeMessage.subject}</h2>
                    <div className="inbox-detail-sender">
                      From: <strong>{activeMessage.sender || 'TuneMavens Operations Desk'}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="community-btn community-btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      onClick={() => handleDeleteMessage(activeMessage.id || activeMessage._id)}
                      title="Delete message"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </div>

                {/* Detail Body */}
                <div className="inbox-detail-body">
                  {activeMessage.body}
                </div>

                {/* Call-to-Action Action Box */}
                {activeMessage.cta_url && (
                  <div className="inbox-cta-box">
                    <div>
                      <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>
                        Associated Ecosystem Milestone
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>
                        Click to review the target workspace, placement brief, or induction asset.
                      </div>
                    </div>

                    <Link
                      to={activeMessage.cta_url}
                      className="community-btn community-btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                    >
                      {activeMessage.cta_label || 'View Workspace'} <RiArrowRightLine />
                    </Link>
                  </div>
                )}

                {/* Threaded Conversation Replies */}
                <div className="inbox-thread-section">
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <RiChat1Line style={{ color: '#00f0ff' }} /> Conversation Thread &bull; {(activeMessage.replies || []).length} Replies
                  </div>

                  {(activeMessage.replies || []).length > 0 && (
                    <div className="inbox-replies-list">
                      {activeMessage.replies.map((rep) => (
                        <div className="inbox-reply-bubble" key={rep.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.82rem' }}>
                              {rep.author_name}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              {rep.created_at}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                            {rep.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  <form onSubmit={handleSendReply} className="inbox-reply-form">
                    <textarea
                      rows={3}
                      className="inbox-reply-textarea"
                      placeholder="Write a reply or inquiry to the TuneMavens operations desk..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                      <button
                        type="submit"
                        className="community-btn community-btn-primary"
                        disabled={replySubmitting || !replyText.trim()}
                        style={{ padding: '8px 20px', fontSize: '0.82rem' }}
                      >
                        <RiSendPlaneFill /> {replySubmitting ? 'Sending...' : 'Send Reply'}
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            ) : (
              <div className="inbox-empty-detail">
                <RiMailOpenLine size={48} style={{ color: '#334155', marginBottom: 12 }} />
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#94a3b8' }}>
                  Select a message to view details
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
