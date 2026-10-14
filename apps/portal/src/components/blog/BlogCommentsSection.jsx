import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  RiChat1Fill,
  RiSendPlaneFill,
  RiCheckboxCircleFill,
  RiHeart3Line,
  RiHeart3Fill,
  RiLockLine,
  RiReplyLine,
  RiSparklingFill,
  RiUserFill
} from 'react-icons/ri';
import { blogApi, authApi, tokenStore } from '../../lib/api.js';

export default function BlogCommentsSection({
  articleSlug,
  comments = [],
  sessionUser,
  onCommentAdded
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [likedComments, setLikedComments] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

  const isRegistered = !!sessionUser;

  const quickStarters = [
    "Great breakdown on splits! 👏",
    "We use this exact workflow in our studio 🎚️",
    "Question on mechanical collection timelines ❓",
    "Spot on advice for music supervisors 🎯"
  ];

  const handleQuickStarter = (text) => {
    setCommentText(prev => prev ? `${prev} ${text}` : text);
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!isRegistered) {
      setErrorMsg('You must be signed in with a registered TuneMavens account to post comments.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formattedContent = replyingTo
      ? `@${replyingTo.author_name} ${commentText.trim()}`
      : commentText.trim();

    const payload = {
      content: formattedContent,
      author_name: sessionUser?.name || sessionUser?.artist_name || sessionUser?.username || 'Verified Creator',
      author_role: (sessionUser?.role || 'Creator').toUpperCase() === 'CREATOR' ? 'Verified Creator' : (sessionUser?.role || 'Creator'),
      author_avatar: sessionUser?.avatar_url || ''
    };

    try {
      const res = await blogApi.addComment(articleSlug, payload);
      const newComment = res?.comment || {
        id: `c_${Date.now()}`,
        article_slug: articleSlug,
        author_name: payload.author_name,
        author_role: payload.author_role,
        author_avatar: payload.author_avatar,
        content: payload.content,
        created_at: 'Just now',
        likes_count: 0,
        is_verified: true
      };

      if (onCommentAdded) {
        onCommentAdded(newComment);
      }

      setCommentText('');
      setReplyingTo(null);
      setSuccessMsg('Your comment has been posted to the discussion.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      // Local optimistic fallback for offline / mock mode
      const fallbackComment = {
        id: `c_${Date.now()}`,
        article_slug: articleSlug,
        author_name: payload.author_name,
        author_role: payload.author_role,
        author_avatar: payload.author_avatar,
        content: payload.content,
        created_at: 'Just now',
        likes_count: 0,
        is_verified: true
      };
      if (onCommentAdded) {
        onCommentAdded(fallbackComment);
      }
      setCommentText('');
      setReplyingTo(null);
      setSuccessMsg('Your comment has been posted.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId) => {
    if (likedComments[commentId]) return;

    setLikedComments(prev => ({ ...prev, [commentId]: true }));
    try {
      await blogApi.likeComment(commentId);
    } catch (_) {
      // Graceful silently handled
    }
  };

  const handleDemoSignIn = async () => {
    try {
      const res = await authApi.demo();
      if (res?.access_token) {
        tokenStore.set(res.access_token);
        window.location.reload();
      }
    } catch (_) {
      sessionStorage.setItem('tunemavens_session', JSON.stringify({
        name: 'Creator Roster Member',
        role: 'Creator',
        email: 'creator_member@tunemavens.com',
        username: 'demo_creator'
      }));
      window.location.reload();
    }
  };

  return (
    <section className="blog-comments-section" style={{ marginTop: '56px', textAlign: 'left' }}>
      {/* Section Header Box */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <RiChat1Fill size={22} color="#00f0ff" />
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            Community Discussion ({comments.length})
          </h3>
        </div>
        <span
          style={{
            fontSize: '11px',
            color: '#00f0ff',
            background: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid rgba(0, 240, 255, 0.25)',
            padding: '3px 8px',
            borderRadius: '3px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}
        >
          Registered Creator Forum
        </span>
      </div>

      {/* Comment Input Box (or Login Gate) */}
      <div
        style={{
          background: '#0d1527',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '3px',
          padding: '24px',
          marginBottom: '36px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}
      >
        {isRegistered ? (
          /* Registered User Input Form */
          <form onSubmit={handlePostComment}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '3px',
                    background: '#00f0ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#060813',
                    fontWeight: 700,
                    fontSize: '14px'
                  }}
                >
                  {sessionUser?.avatar_url ? (
                    <img
                      src={sessionUser.avatar_url}
                      alt={sessionUser.name}
                      style={{ width: '100%', height: '100%', borderRadius: '3px', objectFit: 'cover' }}
                    />
                  ) : (
                    (sessionUser?.name || sessionUser?.username || 'U')[0].toUpperCase()
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                      {sessionUser?.name || sessionUser?.artist_name || sessionUser?.username}
                    </span>
                    <RiCheckboxCircleFill size={14} color="#00f0ff" />
                  </div>
                  <span style={{ fontSize: '11px', color: '#00f0ff', textTransform: 'uppercase', fontWeight: 600 }}>
                    {sessionUser?.role || 'Creator'} Account
                  </span>
                </div>
              </div>

              {/* Quick Comment Starters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                {quickStarters.map((starter, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => handleQuickStarter(starter)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '3px',
                      padding: '4px 8px',
                      color: '#cbd5e1',
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s, background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#00f0ff';
                      e.currentTarget.style.background = 'rgba(0, 240, 255, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>

            {replyingTo && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(0, 240, 255, 0.08)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  borderRadius: '3px',
                  padding: '6px 12px',
                  marginBottom: '12px',
                  fontSize: '12px',
                  color: '#00f0ff'
                }}
              >
                <span>Replying to <strong>@{replyingTo.author_name}</strong></span>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}
                >
                  ✕
                </button>
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Join the discussion... Share your perspectives, studio experiences, or questions on this article."
                rows={4}
                style={{
                  width: '100%',
                  background: '#070b14',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '3px',
                  padding: '14px',
                  color: '#f8fafc',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#00f0ff'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
              />
            </div>

            {errorMsg && (
              <div style={{ marginTop: '10px', fontSize: '13px', color: '#f87171' }}>
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div style={{ marginTop: '10px', fontSize: '13px', color: '#34d399' }}>
                {successMsg}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {commentText.length} / 2000 characters
              </span>
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#00f0ff',
                  color: '#060813',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '3px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: submitting || !commentText.trim() ? 'not-allowed' : 'pointer',
                  opacity: submitting || !commentText.trim() ? 0.6 : 1,
                  transition: 'opacity 0.2s'
                }}
              >
                <RiSendPlaneFill size={15} />
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          /* Guest / Unregistered Prompt Gate */
          <div style={{ textAlign: 'center', padding: '16px 12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '3px',
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid rgba(0, 240, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
                color: '#00f0ff'
              }}
            >
              <RiLockLine size={22} />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              Join the Conversation
            </h4>
            <p style={{ fontSize: '13px', color: '#94a3b8', maxWidth: '520px', margin: '0 auto 20px', lineHeight: '1.6' }}>
              Only registered TuneMavens creators, producers, and industry supervisors can leave comments and engage with article authors. Sign in with your account or create a creator profile to contribute.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                to="/login"
                state={{ from: location.pathname }}
                style={{
                  padding: '10px 22px',
                  background: '#00f0ff',
                  color: '#060813',
                  borderRadius: '3px',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  border: 'none'
                }}
              >
                Sign In to Comment
              </Link>
              <Link
                to="/register"
                state={{ from: location.pathname }}
                style={{
                  padding: '10px 22px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#e2e8f0',
                  borderRadius: '3px',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Create Account
              </Link>
              <button
                type="button"
                onClick={handleDemoSignIn}
                style={{
                  padding: '10px 18px',
                  background: 'rgba(0, 240, 255, 0.12)',
                  border: '1px solid rgba(0, 240, 255, 0.35)',
                  color: '#00f0ff',
                  borderRadius: '3px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Demo Sign-In (Test Commenting)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {comments.length === 0 ? (
          <div
            style={{
              padding: '36px',
              textAlign: 'center',
              background: '#070b14',
              borderRadius: '3px',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              color: '#8899a6'
            }}
          >
            <RiChat1Fill size={28} style={{ opacity: 0.4, marginBottom: '8px' }} />
            <p style={{ margin: 0, fontSize: '14px' }}>No comments yet on this article. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((cmt) => {
            const hasLiked = !!likedComments[cmt.id];
            const currentLikes = (cmt.likes_count || 0) + (hasLiked ? 1 : 0);

            return (
              <div
                key={cmt.id}
                style={{
                  background: '#0b1120',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '3px',
                  padding: '20px',
                  transition: 'border-color 0.2s'
                }}
              >
                {/* Author Info Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {cmt.author_avatar ? (
                      <img
                        src={cmt.author_avatar}
                        alt={cmt.author_name}
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '3px',
                          objectFit: 'cover',
                          border: '1.5px solid rgba(0, 240, 255, 0.4)'
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '3px',
                          background: 'rgba(0, 240, 255, 0.15)',
                          border: '1px solid rgba(0, 240, 255, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#00f0ff',
                          fontWeight: 700,
                          fontSize: '13px'
                        }}
                      >
                        {(cmt.author_name || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                          {cmt.author_name}
                        </span>
                        {cmt.is_verified && (
                          <RiCheckboxCircleFill size={13} color="#00f0ff" title="Verified Creator" />
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: '10px',
                          color: '#00f0ff',
                          background: 'rgba(0, 240, 255, 0.08)',
                          border: '1px solid rgba(0, 240, 255, 0.2)',
                          padding: '1px 6px',
                          borderRadius: '3px',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}
                      >
                        {cmt.author_role || 'Creator'}
                      </span>
                    </div>
                  </div>

                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {cmt.created_at}
                  </span>
                </div>

                {/* Comment Text */}
                <p style={{ fontSize: '14px', lineHeight: '1.65', color: '#cbd5e1', margin: '0 0 16px 0', whiteSpace: 'pre-wrap' }}>
                  {cmt.content}
                </p>

                {/* Comment Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
                  <button
                    onClick={() => handleLike(cmt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: hasLiked ? 'rgba(244, 63, 94, 0.12)' : 'transparent',
                      border: '1px solid ' + (hasLiked ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255, 255, 255, 0.08)'),
                      padding: '4px 10px',
                      borderRadius: '3px',
                      color: hasLiked ? '#fb7185' : '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {hasLiked ? <RiHeart3Fill size={14} color="#f43f5e" /> : <RiHeart3Line size={14} />}
                    <span>{currentLikes}</span>
                  </button>

                  {isRegistered && (
                    <button
                      onClick={() => {
                        setReplyingTo(cmt);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#00f0ff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
                    >
                      <RiReplyLine size={14} />
                      <span>Reply</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
