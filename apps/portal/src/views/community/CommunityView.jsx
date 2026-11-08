import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  RiTrophyLine,
  RiPulseLine,
  RiShareForwardLine,
  RiHeartFill,
  RiHeartLine,
  RiPlayFill,
  RiShieldCheckFill,
  RiShieldLine,
  RiUserFollowLine,
  RiCloseLine,
  RiYoutubeFill,
  RiYoutubeLine,
  RiInstagramLine,
  RiTwitterXLine,
  RiSpotifyLine,
  RiLinkedinBoxLine,
  RiGlobalLine,
  RiFileUserLine,
  RiSparklingFill,
  RiMailSendLine,
  RiCheckLine,
  RiEyeLine,
  RiAddLine,
  RiMoneyDollarCircleLine,
  RiDiscLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCameraLensLine,
  RiImageLine,
  RiFullscreenLine,
  RiMessage2Line,
  RiSendPlaneFill,
  RiImageAddLine,
  RiVideoAddLine,
  RiExternalLinkLine,
  RiThumbUpLine,
  RiThumbUpFill,
  RiSparklingLine,
  RiChat1Line
} from 'react-icons/ri';
import './CommunityView.css';

export default function CommunityView({ sessionUser, initialTab = 'wall-of-fame' }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 4 rows max: 3 cards per row = 12 items per page
  const ITEMS_PER_ROW = 3;
  const MAX_ROWS = 4;
  const ITEMS_PER_PAGE = ITEMS_PER_ROW * MAX_ROWS;

  // Data states
  const [profiles, setProfiles] = useState([]);
  const [feedItems, setFeedItems] = useState([]);
  const [socialPosts, setSocialPosts] = useState([]);
  const [feedFilter, setFeedFilter] = useState('all'); // 'all' | 'luminaries'
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMediaType, setNewPostMediaType] = useState('none'); // 'none' | 'image' | 'video'
  const [newPostMediaUrl, setNewPostMediaUrl] = useState('');
  const [newPostSubmitting, setNewPostSubmitting] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [commentSubmitting, setCommentSubmitting] = useState({});
  const [networkConnections, setNetworkConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interaction tracking states
  const [likedProfiles, setLikedProfiles] = useState({});
  const [followingMap, setFollowingMap] = useState({});

  // Modals
  const [videoModalUrl, setVideoModalUrl] = useState(null);
  const [imageModalUrl, setImageModalUrl] = useState(null);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [nominateModalOpen, setNominateModalOpen] = useState(false);

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    listens: 'public',
    downloads: 'public',
    tips: 'public',
    deals: 'public',
    follows: 'public',
    second_degree_visible: true,
  });
  const [privacySaving, setPrivacySaving] = useState(false);
  const [privacyNotice, setPrivacyNotice] = useState('');

  // Nominate state
  const [nomineeForm, setNomineeForm] = useState({
    subject_name: '',
    role: 'producer',
    subject_email: '',
    media_type: 'video',
    image_url: '',
    youtube_channel_handle: '',
    youtube_video_id: '',
    bio: '',
    tags: '',
  });
  const [nomineeSubmitting, setNomineeSubmitting] = useState(false);
  const [nomineeSuccess, setNomineeSuccess] = useState('');

  // EPK Activation Invite Modal State
  const [epkInviteModalOpen, setEpkInviteModalOpen] = useState(false);
  const [epkInviteTarget, setEpkInviteTarget] = useState(null);
  const [epkInviteNote, setEpkInviteNote] = useState('');
  const [epkInviteSubmitting, setEpkInviteSubmitting] = useState(false);
  const [epkInvitedMap, setEpkInvitedMap] = useState({});
  const [epkNotice, setEpkNotice] = useState('');

  // Quick Tip Modal State
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [tipTarget, setTipTarget] = useState(null);
  const [tipAmount, setTipAmount] = useState(50);
  const [tipCustomAmount, setTipCustomAmount] = useState('');
  const [tipPaymentRail, setTipPaymentRail] = useState('credits'); // 'credits' | 'mpesa' | 'card'
  const [tipPhone, setTipPhone] = useState('');
  const [tipNote, setTipNote] = useState('');
  const [tipSubmitting, setTipSubmitting] = useState(false);
  const [tipSuccessNotice, setTipSuccessNotice] = useState('');

  const handleOpenEpkInviteModal = (profile) => {
    setEpkInviteTarget(profile);
    setEpkInviteNote(
      `In recognition of your induction to the Wall of Fame, we'd love to review your stems, catalog, and sync riders directly on TuneMavens EPK!`
    );
    setEpkInviteModalOpen(true);
  };

  // Open Quick Tip Modal
  const handleOpenQuickTipModal = (creator) => {
    setTipTarget(creator);
    setTipAmount(50);
    setTipCustomAmount('');
    setTipNote('');
    setTipPhone(sessionUser?.phone || '');
    setTipModalOpen(true);
  };

  // Execute Quick Tip
  const handleExecuteQuickTip = async (e) => {
    e.preventDefault();
    if (!tipTarget) return;
    const finalAmount = tipCustomAmount ? parseInt(tipCustomAmount, 10) : tipAmount;
    if (!finalAmount || finalAmount <= 0) {
      alert('Please select or enter a valid tip amount.');
      return;
    }

    setTipSubmitting(true);
    try {
      // 1. Dispatch activity event so it registers across the real-time social feed
      await fetch('/api/feed/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'tip',
          target_id: String(tipTarget.id || tipTarget.subject_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
          target_name: `Direct Fan Tip to ${tipTarget.subject_name}`,
          visibility: 'public',
          metadata: {
            recipient: tipTarget.subject_name,
            amount_credits: finalAmount,
            rail: tipPaymentRail,
            note: tipNote.trim() || undefined,
          },
        }),
      }).catch(() => null);

      // 2. Also attempt stream credit tip if user has a session and creator has an ID
      if (tipTarget.id && tipPaymentRail === 'credits') {
        await fetch('/api/stream/tip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creator_id: String(tipTarget.id),
            amount_credits: finalAmount,
            message: tipNote.trim() || undefined,
          }),
        }).catch(() => null);
      }

      // 3. Immediately reflect in local activity feed
      const newTipEvent = {
        id: `tip-${Date.now()}`,
        kind: 'tip',
        actor_name: sessionUser?.name || sessionUser?.username || 'TuneMavens Member',
        actor_role: sessionUser?.role || 'supporter',
        target_name: `Direct Tip of ${finalAmount} Credits ($${(finalAmount / 10).toFixed(2)}) to ${tipTarget.subject_name}`,
        visibility: 'public',
        created_at: new Date().toISOString(),
      };
      setFeedItems((prev) => [newTipEvent, ...prev]);

      setTipSuccessNotice(`✨ Sent ${finalAmount} Credits ($${(finalAmount / 10).toFixed(2)}) tip directly to ${tipTarget.subject_name}! 95% routed to creator wallet.`);
      setTipModalOpen(false);
      setTipTarget(null);
      setTimeout(() => setTipSuccessNotice(''), 6000);
    } catch (err) {
      alert('Error sending tip: ' + err.message);
    } finally {
      setTipSubmitting(false);
    }
  };

  const handleDispatchEpkInvite = async (e) => {
    e.preventDefault();
    if (!epkInviteTarget) return;

    try {
      setEpkInviteSubmitting(true);
      const res = await fetch(`/api/community/wall-of-fame/${epkInviteTarget.id}/invite-epk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject_email: epkInviteTarget.subject_email || null,
          phone: epkInviteTarget.phone || null,
          custom_note: epkInviteNote.trim() || null,
          send_email: true,
          send_inbox: true,
          send_whatsapp: true,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Failed to dispatch EPK activation invite');
      }

      setEpkInvitedMap((prev) => ({ ...prev, [epkInviteTarget.id]: true }));
      setEpkNotice(`✨ EPK activation invitation dispatched to ${epkInviteTarget.subject_name}!`);
      setEpkInviteModalOpen(false);
      setEpkInviteTarget(null);
      setTimeout(() => setEpkNotice(''), 5000);
    } catch (err) {
      alert(err.message || 'Error sending EPK invite');
    } finally {
      setEpkInviteSubmitting(false);
    }
  };

  const renderSocialIcons = (p) => {
    const s = p.social_links || {};
    const icons = [];

    if (s.instagram) {
      const handle = s.instagram.replace('@', '');
      icons.push(
        <a
          key="ig"
          href={`https://instagram.com/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fame-social-icon ig"
          title={`Instagram: @${handle}`}
        >
          <RiInstagramLine />
        </a>
      );
    }

    if (s.twitter || s.x) {
      const handle = (s.twitter || s.x).replace('@', '');
      icons.push(
        <a
          key="x"
          href={`https://x.com/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fame-social-icon x"
          title={`X / Twitter: @${handle}`}
        >
          <RiTwitterXLine />
        </a>
      );
    }

    if (p.youtube_channel_handle || s.youtube) {
      const raw = p.youtube_channel_handle || s.youtube;
      const handle = raw.startsWith('@') ? raw : `@${raw}`;
      icons.push(
        <a
          key="yt"
          href={`https://youtube.com/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fame-social-icon yt"
          title={`YouTube: ${handle}`}
        >
          <RiYoutubeLine />
        </a>
      );
    }

    if (s.spotify) {
      const url = s.spotify.startsWith('http')
        ? s.spotify
        : `https://open.spotify.com/search/${encodeURIComponent(p.subject_name)}`;
      icons.push(
        <a
          key="sp"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="fame-social-icon sp"
          title="Spotify Artist Profile"
        >
          <RiSpotifyLine />
        </a>
      );
    }

    if (s.linkedin) {
      const url = s.linkedin.startsWith('http')
        ? s.linkedin
        : `https://linkedin.com/in/${s.linkedin}`;
      icons.push(
        <a
          key="li"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="fame-social-icon li"
          title="LinkedIn Professional Profile"
        >
          <RiLinkedinBoxLine />
        </a>
      );
    }

    if (s.website) {
      icons.push(
        <a
          key="web"
          href={s.website.startsWith('http') ? s.website : `https://${s.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fame-social-icon web"
          title="Official Website"
        >
          <RiGlobalLine />
        </a>
      );
    }

    return icons;
  };

  // Determine active tab based on query or props
  useEffect(() => {
    if (location.pathname.includes('/feed')) {
      setActiveTab('feed');
    } else if (location.pathname.includes('/network')) {
      setActiveTab('network');
    } else if (location.pathname.includes('/wall-of-fame') || initialTab === 'wall-of-fame') {
      setActiveTab('wall-of-fame');
    }
  }, [location.pathname, initialTab]);

  // Load Wall of Fame profiles
  const fetchWallOfFame = async () => {
    try {
      const res = await fetch('/api/community/wall-of-fame');
      if (res.ok) {
        const data = await res.json();
        setProfiles(data.profiles || []);
      }
    } catch (err) {
      console.warn('Failed to fetch Wall of Fame:', err);
    }
  };

  // Load Feed & Facebook-Style Social Posts
  const fetchFeed = async () => {
    try {
      const [resSignals, resPosts] = await Promise.all([
        fetch('/api/feed?limit=30'),
        fetch('/api/feed/posts?limit=30')
      ]);
      if (resSignals.ok) {
        const data = await resSignals.json();
        setFeedItems(data.items || []);
      }
      if (resPosts.ok) {
        const pData = await resPosts.json();
        setSocialPosts(pData.posts || []);
      }
    } catch (err) {
      console.warn('Failed to fetch Feed & Social Posts:', err);
    }
  };

  // Create Facebook-style Post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    setNewPostSubmitting(true);
    try {
      const authorName = sessionUser?.name || sessionUser?.username || 'TuneMavens Member';
      const authorRole = sessionUser?.role || 'creator';
      const isLum = sessionUser?.is_luminary || profiles.some(p => p.subject_name.toLowerCase() === authorName.toLowerCase());

      const res = await fetch('/api/feed/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPostContent.trim(),
          author_name: authorName,
          author_role: authorRole,
          author_avatar: sessionUser?.avatar_url || '/favicon.png',
          is_luminary: isLum,
          media_type: newPostMediaType === 'none' ? null : newPostMediaType,
          media_url: newPostMediaUrl.trim() || null,
          epk_slug: authorName.toLowerCase().replace(/\s+/g, '-'),
        }),
      });
      if (res.ok) {
        const createdPost = await res.json();
        setSocialPosts((prev) => [createdPost, ...prev]);
        setNewPostContent('');
        setNewPostMediaUrl('');
        setNewPostMediaType('none');
      }
    } catch (err) {
      alert('Error publishing post: ' + err.message);
    } finally {
      setNewPostSubmitting(false);
    }
  };

  // Toggle Post Like
  const handleTogglePostLike = async (postId) => {
    try {
      setSocialPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            const newLiked = !post.is_liked;
            return {
              ...post,
              is_liked: newLiked,
              likes_count: Math.max(0, (post.likes_count || 0) + (newLiked ? 1 : -1)),
            };
          }
          return post;
        })
      );

      const res = await fetch(`/api/feed/posts/${postId}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSocialPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, is_liked: data.liked, likes_count: data.likes_count }
              : post
          )
        );
      }
    } catch (err) {
      console.error('Like toggle failed:', err);
    }
  };

  // Add Comment to Post
  const handleAddComment = async (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;
    setCommentSubmitting((prev) => ({ ...prev, [postId]: true }));
    try {
      const authorName = sessionUser?.name || sessionUser?.username || 'TuneMavens Member';
      const authorRole = sessionUser?.role || 'creator';
      const isLum = sessionUser?.is_luminary || profiles.some(p => p.subject_name.toLowerCase() === authorName.toLowerCase());

      const res = await fetch(`/api/feed/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          author_name: authorName,
          author_role: authorRole,
          author_avatar: sessionUser?.avatar_url || '/favicon.png',
          is_luminary: isLum,
        }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setSocialPosts((prev) =>
          prev.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [...(post.comments || []), newComment],
                comments_count: (post.comments_count || 0) + 1,
              };
            }
            return post;
          })
        );
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      }
    } catch (err) {
      alert('Error adding comment: ' + err.message);
    } finally {
      setCommentSubmitting((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // Load 2nd-Degree Network
  const fetchNetwork = async () => {
    try {
      const res = await fetch('/api/graph/second-degree?limit=12');
      if (res.ok) {
        const data = await res.json();
        setNetworkConnections(data.connections || []);
      }
    } catch (err) {
      console.warn('Failed to fetch Network:', err);
    }
  };

  // Load Privacy Settings
  const fetchPrivacySettings = async () => {
    if (!sessionUser) return;
    try {
      const res = await fetch('/api/users/me/privacy-settings');
      if (res.ok) {
        const data = await res.json();
        setPrivacySettings(data);
      }
    } catch (err) {
      console.warn('Failed to fetch Privacy settings:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchWallOfFame(), fetchFeed(), fetchNetwork(), fetchPrivacySettings()]).finally(() => {
      setLoading(false);
    });
  }, [sessionUser]);

  // Handle Likes
  const handleToggleLike = async (profileId) => {
    const isCurrentlyLiked = likedProfiles[profileId];
    setLikedProfiles((prev) => ({ ...prev, [profileId]: !isCurrentlyLiked }));

    // Optimistically update counts
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profileId) {
          return {
            ...p,
            likes_count: (p.likes_count || 0) + (isCurrentlyLiked ? -1 : 1),
          };
        }
        return p;
      })
    );

    try {
      await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_kind: 'featured_profile',
          target_id: profileId,
        }),
      });
    } catch (err) {
      console.error('Like toggle failed:', err);
    }
  };

  // Handle Follow / Unfollow
  const handleToggleFollow = async (userId, userName) => {
    const isFollowing = followingMap[userId];
    setFollowingMap((prev) => ({ ...prev, [userId]: !isFollowing }));

    try {
      if (isFollowing) {
        await fetch(`/api/users/${userId}/follow`, { method: 'DELETE' });
      } else {
        await fetch(`/api/users/${userId}/follow`, { method: 'POST' });
        // Refresh feed so user immediately sees connection updates
        fetchFeed();
      }
    } catch (err) {
      console.error('Follow toggle failed:', err);
    }
  };

  // Save Privacy Settings
  const handleSavePrivacy = async () => {
    setPrivacySaving(true);
    try {
      const res = await fetch('/api/users/me/privacy-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(privacySettings),
      });
      if (res.ok) {
        setPrivacyNotice('Privacy settings updated successfully.');
        setTimeout(() => {
          setPrivacyNotice('');
          setPrivacyModalOpen(false);
        }, 1200);
      }
    } catch (err) {
      setPrivacyNotice('Failed to update settings.');
    } finally {
      setPrivacySaving(false);
    }
  };

  // Submit Nomination
  const handleSubmitNomination = async (e) => {
    e.preventDefault();
    setNomineeSubmitting(true);
    setNomineeSuccess('');
    try {
      const res = await fetch('/api/admin/wall-of-fame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...nomineeForm,
          tags: nomineeForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        setNomineeSuccess('Nomination submitted! An invitation token was generated.');
        fetchWallOfFame();
        setTimeout(() => {
          setNominateModalOpen(false);
          setNomineeSuccess('');
          setNomineeForm({
            subject_name: '',
            role: 'producer',
            subject_email: '',
            media_type: 'video',
            image_url: '',
            youtube_channel_handle: '',
            youtube_video_id: '',
            bio: '',
            tags: '',
          });
        }, 1500);
      }
    } catch (err) {
      alert('Failed to submit nomination: ' + err.message);
    } finally {
      setNomineeSubmitting(false);
    }
  };

  // Filter profiles
  const filteredProfiles = profiles.filter((p) => {
    const matchesRole = selectedRole === 'all' || p.role === selectedRole;
    const matchesSearch =
      !searchQuery ||
      p.subject_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.bio && p.bio.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  // 4 Rows Max pagination calculations (12 cards per page)
  const totalPages = Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProfiles = filteredProfiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const anchor = document.getElementById('wall-of-fame-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  return (
    <div className="community-view-container">
      <div className="community-content-wrap">
        {/* Hero Header */}
        <div className="community-hero">
          <div className="community-hero-text">
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1, marginBottom: '14px' }}>
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1 }}>
                <img src="/tunemavens-logo-white.png" alt="TuneMavens Logo" style={{ height: '36px', width: 'auto', display: 'block' }} />
                <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#00f0ff', marginTop: '-3px', alignSelf: 'flex-end' }}>beta</span>
              </div>
            </div>
            <h1>
              <RiTrophyLine style={{ color: '#00f0ff' }} />
              TuneMavens Community &amp; Wall of Fame
              <span className="community-hero-badge">Phase 5.5</span>
            </h1>
            <p className="community-hero-subtitle">
              The living social substrate and hall of icons for modern music-business pioneers.
              Explore inducted luminaries, follow creators 2 hops away, and inspect verified ecosystem deal activity.
            </p>
          </div>
          <div className="community-header-actions">
            <button
              className="community-btn community-btn-secondary"
              onClick={() => setPrivacyModalOpen(true)}
              data-testid="privacy-center-btn"
            >
              <RiShieldLine /> Privacy Center
            </button>
            <button
              className="community-btn community-btn-primary"
              onClick={() => setNominateModalOpen(true)}
              data-testid="nominate-icon-btn"
            >
              <RiAddLine /> Nominate an Icon
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="community-tabs-bar">
          <button
            className={`community-tab-btn ${activeTab === 'wall-of-fame' ? 'active' : ''}`}
            onClick={() => setActiveTab('wall-of-fame')}
          >
            <RiTrophyLine /> Wall of Fame (Hall of Icons)
          </button>
          <button
            className={`community-tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => setActiveTab('feed')}
          >
            <RiPulseLine /> Feed
          </button>
          <button
            className={`community-tab-btn ${activeTab === 'network' ? 'active' : ''}`}
            onClick={() => setActiveTab('network')}
          >
            <RiShareForwardLine /> Network
          </button>
        </div>

        {/* TAB 1: Wall of Fame */}
        {activeTab === 'wall-of-fame' && (
          <div>
            {/* Filter Bar */}
            <div className="community-filter-bar">
              <div className="community-role-pills">
                {['all', 'producer', 'creator', 'supervisor', 'label', 'dj', 'vc'].map((roleKey) => (
                  <button
                    key={roleKey}
                    className={`community-pill ${selectedRole === roleKey ? 'active' : ''}`}
                    onClick={() => handleRoleSelect(roleKey)}
                  >
                    {roleKey === 'all'
                      ? 'All Luminaries'
                      : roleKey === 'vc'
                      ? 'Venture Capital'
                      : roleKey.charAt(0).toUpperCase() + roleKey.slice(1) + 's'}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Search luminaries, bio, skills..."
                className="community-search-input"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            <div id="wall-of-fame-anchor" style={{ position: 'relative', top: '-10px' }} />

            {epkNotice && (
              <div className="fame-notice-banner">
                <span>{epkNotice}</span>
                <button
                  className="community-modal-close"
                  onClick={() => setEpkNotice('')}
                  style={{ color: '#38bdf8' }}
                >
                  <RiCloseLine />
                </button>
              </div>
            )}

            {/* Grid (4 Rows Max Standard) */}
            <div className="wall-of-fame-grid">
              {paginatedProfiles.map((p) => {
                const isLiked = likedProfiles[p.id];
                const isFollowing = followingMap[p.id];
                const isImageMedia = p.media_type === 'image';
                const videoId = p.youtube_video_id || 'dQw4w9WgXcQ';
                const cleanVid = videoId.replace('v=', '').trim();
                const mediaThumb = isImageMedia
                  ? (p.image_url || p.youtube_thumbnail_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80')
                  : (p.youtube_thumbnail_url || `https://img.youtube.com/vi/${cleanVid}/hqdefault.jpg`);

                return (
                  <div className="fame-card" key={p.id} data-testid={`fame-card-${p.id}`}>
                    <div
                      className={`fame-card-media ${isImageMedia ? 'is-image' : ''}`}
                      onClick={() => {
                        if (isImageMedia) setImageModalUrl(mediaThumb);
                      }}
                      title={isImageMedia ? `Click to view ${p.subject_name}'s full portrait` : undefined}
                    >
                      <img
                        src={mediaThumb}
                        alt={p.subject_name}
                        className="fame-card-img"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      {isImageMedia ? (
                        <>
                          <button
                            type="button"
                            className="fame-card-expand-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageModalUrl(mediaThumb);
                            }}
                            title="Expand portrait"
                          >
                            <RiFullscreenLine />
                          </button>
                          <div className="fame-card-image-badge">
                            <RiCameraLensLine style={{ verticalAlign: 'middle', marginRight: 4 }} />
                            Official Portrait
                          </div>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="fame-card-play-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setVideoModalUrl(`https://www.youtube.com/embed/${cleanVid}?autoplay=1`);
                            }}
                            title="Watch masterclass video"
                          >
                            <RiPlayFill />
                          </button>
                          <div className="fame-card-views-badge">
                            <RiYoutubeFill style={{ verticalAlign: 'middle', marginRight: 4 }} />
                            {p.youtube_views_formatted || 'Verified Showcase'}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="fame-card-body">
                      <div className="fame-card-header">
                        <div className="fame-card-name-group">
                          <h3>
                            {p.subject_name}
                            <RiShieldCheckFill style={{ color: '#00f0ff', fontSize: 16 }} title="Inducted & Verified" />
                          </h3>
                          <span className="fame-role-tag">{p.role}</span>
                        </div>
                      </div>

                      <p className="fame-card-bio">{p.bio}</p>

                      {p.tags && p.tags.length > 0 && (
                        <div className="fame-card-tags">
                          {p.tags.map((t, idx) => (
                            <span className="fame-tag" key={idx}>
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* EPK & Social Media Handles Row */}
                      <div className="fame-card-links-row">
                        <div className="fame-card-epk-action">
                          <Link
                            to={`/epk/${p.epk_slug || p.subject_name.toLowerCase().replace(/[^a-z0-9]+/g, '')}`}
                            className="fame-epk-btn view-epk"
                            title={`View ${p.subject_name}'s official TuneMavens EPK`}
                          >
                            <RiFileUserLine /> View EPK
                          </Link>
                          <button
                            type="button"
                            className="fame-epk-btn tip-btn"
                            onClick={() => handleOpenQuickTipModal(p)}
                            title={`Send a quick tip to ${p.subject_name}`}
                          >
                            <RiMoneyDollarCircleLine /> Tip
                          </button>
                          {!Boolean(p.has_epk) && (
                            <button
                              className={`fame-epk-btn invite ${epkInvitedMap[p.id] ? 'invited' : ''}`}
                              onClick={() => handleOpenEpkInviteModal(p)}
                              title={
                                epkInvitedMap[p.id]
                                  ? 'EPK activation invite dispatched'
                                  : 'Invite luminary to activate their official TuneMavens EPK'
                              }
                            >
                              {epkInvitedMap[p.id] ? <RiCheckLine /> : <RiSparklingFill />}
                              <span>{epkInvitedMap[p.id] ? 'Invited' : 'Invite to EPK'}</span>
                            </button>
                          )}
                        </div>

                        <div className="fame-card-social-icons">
                          {renderSocialIcons(p)}
                        </div>
                      </div>

                      <div className="fame-card-footer">
                        <div className="fame-card-actions">
                          <button
                            className={`fame-like-btn ${isLiked ? 'liked' : ''}`}
                            onClick={() => handleToggleLike(p.id)}
                            title="Applaud inductee"
                          >
                            {isLiked ? <RiHeartFill /> : <RiHeartLine />}
                            <span>{p.likes_count || 0}</span>
                          </button>
                        </div>
                        <button
                          className={`fame-follow-btn ${isFollowing ? 'following' : ''}`}
                          onClick={() => handleToggleFollow(p.id, p.subject_name)}
                        >
                          {isFollowing ? (
                            <>
                              <RiCheckLine style={{ marginRight: 4 }} /> Following
                            </>
                          ) : (
                            <>
                              <RiUserFollowLine style={{ marginRight: 4 }} /> Follow
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls (4 Rows Max Standard) */}
            {totalPages > 1 && (
              <div className="community-pagination-bar" data-testid="community-pagination-bar">
                <div className="community-pagination-info">
                  Showing <strong style={{ color: '#ffffff' }}>{startIndex + 1}</strong>–
                  <strong style={{ color: '#ffffff' }}>{Math.min(startIndex + ITEMS_PER_PAGE, filteredProfiles.length)}</strong> of{' '}
                  <strong style={{ color: '#ffffff' }}>{filteredProfiles.length}</strong> Inductees
                  <span className="community-pagination-badge">4 Rows Max</span>
                </div>

                <div className="community-pagination-nav">
                  <button
                    type="button"
                    className="community-page-btn"
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    aria-label="Previous Page"
                    data-testid="pagination-prev-btn"
                  >
                    <RiArrowLeftSLine /> Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      type="button"
                      key={pageNum}
                      className={`community-page-btn ${pageNum === safeCurrentPage ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                      data-testid={`pagination-page-${pageNum}`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="community-page-btn"
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                    aria-label="Next Page"
                    data-testid="pagination-next-btn"
                  >
                    Next <RiArrowRightSLine />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Facebook-Style Interactive Feed */}
        {activeTab === 'feed' && (
          <div className="community-feed-layout">
            
            {/* Left Main Stream */}
            <div className="fb-feed-main">
              
              {/* Facebook Post Composer */}
              <div className="fb-composer-card">
                <div className="fb-composer-header">
                  <img
                    src={sessionUser?.avatar_url || '/favicon.png'}
                    alt="User Avatar"
                    className="fb-composer-avatar"
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                      {sessionUser?.name || sessionUser?.username || 'TuneMavens Member'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      Publishing to Community &amp; Luminary Network
                    </div>
                  </div>
                </div>

                <form onSubmit={handleCreatePost}>
                  <textarea
                    className="fb-composer-textarea"
                    placeholder="What's happening in your studio? Share stem releases, placements, or shout out a luminary..."
                    rows={3}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />

                  {newPostMediaType !== 'none' && (
                    <div style={{ marginBottom: '12px' }}>
                      <input
                        type="url"
                        className="fb-composer-media-input"
                        placeholder={
                          newPostMediaType === 'image'
                            ? 'Enter image URL (https://...)'
                            : 'Enter YouTube or video URL (https://youtube.com/watch?v=...)'
                        }
                        value={newPostMediaUrl}
                        onChange={(e) => setNewPostMediaUrl(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="fb-composer-tools">
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className={`fb-tool-btn ${newPostMediaType === 'image' ? 'active' : ''}`}
                        onClick={() => setNewPostMediaType(newPostMediaType === 'image' ? 'none' : 'image')}
                      >
                        <RiImageAddLine /> Photo
                      </button>
                      <button
                        type="button"
                        className={`fb-tool-btn ${newPostMediaType === 'video' ? 'active' : ''}`}
                        onClick={() => setNewPostMediaType(newPostMediaType === 'video' ? 'none' : 'video')}
                      >
                        <RiVideoAddLine /> Video
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={newPostSubmitting || !newPostContent.trim()}
                      className="community-btn community-btn-primary"
                      style={{ padding: '8px 20px', fontSize: '0.82rem' }}
                    >
                      {newPostSubmitting ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Feed Filter Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 0 16px 0', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className={`fb-filter-tab ${feedFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setFeedFilter('all')}
                  >
                    All Posts ({socialPosts.length})
                  </button>
                  <button
                    className={`fb-filter-tab ${feedFilter === 'luminaries' ? 'active' : ''}`}
                    onClick={() => setFeedFilter('luminaries')}
                  >
                    <RiShieldCheckFill style={{ color: '#00f0ff' }} /> Luminaries Only
                  </button>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Real-time Chronological Stream
                </span>
              </div>

              {/* Posts Stream */}
              <div className="fb-posts-list">
                {socialPosts
                  .filter((p) => feedFilter === 'all' || p.is_luminary)
                  .map((post) => {
                    const isLiked = post.is_liked;
                    const comments = post.comments || [];
                    const postCommentInput = commentInputs[post.id] || '';
                    const isSubmittingComment = commentSubmitting[post.id] || false;

                    return (
                      <div className="fb-post-card" key={post.id}>
                        
                        {/* Header */}
                        <div className="fb-post-header">
                          <img
                            src={post.author_avatar || '/favicon.png'}
                            alt={post.author_name}
                            className="fb-post-avatar"
                          />
                          <div className="fb-post-author-info">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span className="fb-post-author-name">{post.author_name}</span>
                              {post.is_luminary && (
                                <span className="luminary-verified-badge" title="Verified TuneMavens Luminary">
                                  <RiShieldCheckFill /> Luminary
                                </span>
                              )}
                              <span className="fame-role-tag">[{post.author_role || 'Creator'}]</span>
                            </div>
                            <div className="fb-post-time">
                              {post.created_at ? (post.created_at.includes('T') ? new Date(post.created_at).toLocaleDateString() : post.created_at) : 'Recently'}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {post.epk_slug && (
                              <Link
                                to={`/epk/${post.epk_slug}`}
                                className="community-btn community-btn-secondary"
                                style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px' }}
                              >
                                <RiFileUserLine /> View EPK
                              </Link>
                            )}
                            <button
                              type="button"
                              className="community-btn community-btn-secondary"
                              onClick={() =>
                                handleOpenQuickTipModal({
                                  subject_name: post.author_name,
                                  id: post.author_id,
                                  role: post.author_role,
                                  image_url: post.author_avatar,
                                })
                              }
                              style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                              title={`Send a quick tip to ${post.author_name}`}
                            >
                              <RiMoneyDollarCircleLine /> Tip
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="fb-post-content">
                          {post.content}
                        </div>

                        {/* Media Attachment */}
                        {post.media_type === 'image' && post.media_url && (
                          <div className="fb-post-media-wrap">
                            <img
                              src={post.media_url}
                              alt="Post media"
                              className="fb-post-image"
                              onClick={() => setImageModalUrl(post.media_url)}
                              title="Click to view full photo"
                            />
                          </div>
                        )}

                        {post.media_type === 'video' && post.media_url && (
                          <div className="fb-post-media-wrap">
                            {post.media_url.includes('youtube') || post.media_url.includes('youtu.be') ? (
                              <div
                                className="fb-post-video-preview"
                                onClick={() => setVideoModalUrl(post.media_url)}
                                title="Click to play video"
                              >
                                <img
                                  src={
                                    post.media_url.includes('v=')
                                      ? `https://img.youtube.com/vi/${post.media_url.split('v=')[1]?.split('&')[0]}/hqdefault.jpg`
                                      : 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80'
                                  }
                                  alt="Video thumb"
                                  className="fb-post-image"
                                />
                                <div className="fb-video-play-overlay">
                                  <RiPlayFill size={28} />
                                </div>
                              </div>
                            ) : (
                              <video
                                src={post.media_url}
                                controls
                                className="fb-post-image"
                                style={{ maxHeight: '420px', width: '100%', background: '#000' }}
                              />
                            )}
                          </div>
                        )}

                        {/* Stats / Counters Bar */}
                        <div className="fb-post-stats">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <RiHeartFill style={{ color: post.likes_count > 0 ? '#f43f5e' : '#64748b' }} />
                            {post.likes_count || 0} {post.likes_count === 1 ? 'like' : 'likes'}
                          </span>
                          <span>
                            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                          </span>
                        </div>

                        {/* Facebook Action Bar */}
                        <div className="fb-post-actions">
                          <button
                            className={`fb-action-btn ${isLiked ? 'liked' : ''}`}
                            onClick={() => handleTogglePostLike(post.id)}
                          >
                            {isLiked ? <RiHeartFill style={{ color: '#f43f5e' }} /> : <RiHeartLine />}
                            <span>{isLiked ? 'Liked' : 'Like'}</span>
                          </button>
                          
                          <button
                            className="fb-action-btn"
                            onClick={() => {
                              const el = document.getElementById(`comment-input-${post.id}`);
                              if (el) el.focus();
                            }}
                          >
                            <RiMessage2Line />
                            <span>Comment</span>
                          </button>

                          {post.epk_slug && (
                            <Link
                              to={`/epk/${post.epk_slug}`}
                              className="fb-action-btn"
                              style={{ textDecoration: 'none' }}
                            >
                              <RiExternalLinkLine />
                              <span>EPK</span>
                            </Link>
                          )}

                          <button
                            type="button"
                            className="fb-action-btn"
                            onClick={() =>
                              handleOpenQuickTipModal({
                                subject_name: post.author_name,
                                id: post.author_id,
                                role: post.author_role,
                                image_url: post.author_avatar,
                              })
                            }
                            style={{ color: '#10b981' }}
                            title={`Send a quick tip to ${post.author_name}`}
                          >
                            <RiMoneyDollarCircleLine />
                            <span>Tip</span>
                          </button>
                        </div>

                        {/* Threaded Comments Section */}
                        <div className="fb-comments-section">
                          {comments.length > 0 && (
                            <div className="fb-comments-list">
                              {comments.map((comm) => (
                                <div className="fb-comment-item" key={comm.id}>
                                  <img
                                    src={comm.author_avatar || '/favicon.png'}
                                    alt={comm.author_name}
                                    className="fb-comment-avatar"
                                  />
                                  <div className="fb-comment-bubble">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                      <span className="fb-comment-author">{comm.author_name}</span>
                                      {comm.is_luminary && (
                                        <span className="luminary-verified-badge mini" title="Verified Luminary">
                                          <RiShieldCheckFill size={10} /> Luminary
                                        </span>
                                      )}
                                      <span className="fame-role-tag" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                                        {comm.author_role || 'member'}
                                      </span>
                                    </div>
                                    <div className="fb-comment-text">{comm.text}</div>
                                    <div className="fb-comment-time">{comm.created_at || 'Just now'}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Write Comment Box */}
                          <div className="fb-comment-input-wrap">
                            <img
                              src={sessionUser?.avatar_url || '/favicon.png'}
                              alt="Current User"
                              className="fb-comment-avatar"
                            />
                            <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                              <input
                                id={`comment-input-${post.id}`}
                                type="text"
                                className="fb-comment-input"
                                placeholder={`Write a comment as ${sessionUser?.name || sessionUser?.username || 'member'}...`}
                                value={postCommentInput}
                                onChange={(e) =>
                                  setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAddComment(post.id);
                                  }
                                }}
                              />
                              <button
                                className="fb-comment-send-btn"
                                disabled={!postCommentInput.trim() || isSubmittingComment}
                                onClick={() => handleAddComment(post.id)}
                                title="Post comment"
                              >
                                <RiSendPlaneFill />
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
              </div>

            </div>

            {/* Right Sidebar: Luminaries & Ecosystem Signals */}
            <div className="fb-feed-sidebar">
              
              {/* Active Inducted Luminaries Widget */}
              <div style={{ background: '#0b1120', border: '1px solid #1e293b', padding: '20px', borderRadius: '3px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h4 style={{ margin: 0, color: '#ffffff', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RiTrophyLine style={{ color: '#00f0ff' }} /> Inducted Luminaries
                  </h4>
                  <button
                    onClick={() => setActiveTab('wall-of-fame')}
                    style={{ background: 'none', border: 'none', color: '#00f0ff', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    View All ↗
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {profiles.slice(0, 4).map((lum) => (
                    <div key={lum.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={lum.image_url || lum.youtube_thumbnail_url || '/favicon.png'}
                          alt={lum.subject_name}
                          style={{ width: '38px', height: '38px', borderRadius: '3px', objectFit: 'cover', border: '1px solid #334155' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {lum.subject_name}
                            <RiShieldCheckFill style={{ color: '#00f0ff', fontSize: '11px' }} />
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {lum.role}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        <Link
                          to={lum.epk_slug ? `/epk/${lum.epk_slug}` : `/profile/${lum.id}`}
                          className="community-btn community-btn-secondary"
                          style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                        >
                          EPK
                        </Link>
                        <button
                          type="button"
                          className="community-btn community-btn-secondary"
                          style={{ padding: '3px 8px', fontSize: '0.72rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                          onClick={() => handleOpenQuickTipModal(lum)}
                          title={`Tip ${lum.subject_name}`}
                        >
                          Tip
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ecosystem Activity Signals Widget */}
              <div style={{ background: '#0b1120', border: '1px solid #1e293b', padding: '20px', borderRadius: '3px', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#ffffff', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RiPulseLine style={{ color: '#10b981' }} /> Live Ecosystem Signals
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {feedItems.slice(0, 4).map((item) => (
                    <div key={item.id} style={{ padding: '8px 10px', background: '#060913', border: '1px solid #1e293b', borderRadius: '3px' }}>
                      <div style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: 600 }}>
                        {item.target_name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                        <span>by {item.actor_name}</span>
                        <span style={{ color: '#00f0ff' }}>{item.visibility || 'public'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feed Protocols Guidelines */}
              <div style={{ background: '#0b1120', border: '1px solid #1e293b', padding: '18px', borderRadius: '3px' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#ffffff', fontSize: '0.85rem' }}>Social Graph Rules</h5>
                <p style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                  Followers and luminaries can converse bidirectionally. All stem links and cue sheets retain cryptographic attribution.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#00f0ff', fontSize: '0.75rem' }}>
                  <RiShieldCheckFill /> Luminary Verified Badging active
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: 2nd-Degree Network Discovery */}
        {activeTab === 'network' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#ffffff' }}>Deal-Makers &amp; Creators 2 Hops Away</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                High-leverage introductions uncovered through your direct connections' mutual networks.
              </p>
            </div>

            <div className="second-degree-grid">
              {networkConnections.map((conn) => {
                const isFollowing = followingMap[conn.id];
                return (
                  <div className="network-card" key={conn.id}>
                    <div className="network-card-header">
                      <img src={conn.avatar_url} alt={conn.name} className="network-avatar" />
                      <div className="network-info">
                        <h4>{conn.name}</h4>
                        <span className="fame-role-tag">{conn.role}</span>
                        <br />
                        <span className="network-hops-tag">{conn.connection_text || 'Connected via mutual colleague'}</span>
                      </div>
                    </div>

                    <p className="network-bio">{conn.bio}</p>

                    <button
                      className={`fame-follow-btn ${isFollowing ? 'following' : ''}`}
                      onClick={() => handleToggleFollow(conn.id, conn.name)}
                      style={{ alignSelf: 'flex-start' }}
                    >
                      {isFollowing ? 'Connected' : '+ Connect / Follow'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {videoModalUrl && (
        <div className="community-modal-overlay" onClick={() => setVideoModalUrl(null)}>
          <div className="community-modal-card" style={{ maxWidth: 800, padding: 0, overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={videoModalUrl}
                title="YouTube Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'flex-end', background: '#0b1120' }}>
              <button className="community-btn community-btn-secondary" onClick={() => setVideoModalUrl(null)}>
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal Lightbox */}
      {imageModalUrl && (
        <div className="community-modal-overlay" onClick={() => setImageModalUrl(null)}>
          <div className="fame-image-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <img src={imageModalUrl} alt="Featured portrait" className="fame-image-lightbox-img" />
            <div style={{ padding: '12px 18px', display: 'flex', justifyContent: 'flex-end', background: '#0b1120' }}>
              <button className="community-btn community-btn-secondary" onClick={() => setImageModalUrl(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Center Modal */}
      {privacyModalOpen && (
        <div className="community-modal-overlay" onClick={() => setPrivacyModalOpen(false)}>
          <div className="community-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="community-modal-header">
              <h3>Privacy Center Controls</h3>
              <button className="community-modal-close" onClick={() => setPrivacyModalOpen(false)}>
                <RiCloseLine />
              </button>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 16px 0' }}>
              Select visibility policies for each activity signal broadcast by your account.
            </p>

            {['listens', 'downloads', 'tips', 'deals', 'follows'].map((signal) => (
              <div className="privacy-setting-row" key={signal}>
                <div className="privacy-setting-info">
                  <h5>{signal.toUpperCase()} Broadcasting</h5>
                  <p>Broadcast your {signal} to the community feed</p>
                </div>
                <select
                  className="privacy-select"
                  value={privacySettings[signal] || 'public'}
                  onChange={(e) =>
                    setPrivacySettings((prev) => ({ ...prev, [signal]: e.target.value }))
                  }
                >
                  <option value="public">Public (Everyone)</option>
                  <option value="connections">Connections Only</option>
                  <option value="private">Private (Hidden)</option>
                </select>
              </div>
            ))}

            <div className="privacy-setting-row">
              <div className="privacy-setting-info">
                <h5>2nd-Degree Discovery</h5>
                <p>Allow friends of friends to discover you in recommendations</p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.second_degree_visible !== false}
                onChange={(e) =>
                  setPrivacySettings((prev) => ({
                    ...prev,
                    second_degree_visible: e.target.checked,
                  }))
                }
              />
            </div>

            {privacyNotice && (
              <div style={{ color: '#00f0ff', fontSize: '0.85rem', marginTop: 12, fontWeight: 700 }}>
                {privacyNotice}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button className="community-btn community-btn-secondary" onClick={() => setPrivacyModalOpen(false)}>
                Cancel
              </button>
              <button
                className="community-btn community-btn-primary"
                onClick={handleSavePrivacy}
                disabled={privacySaving}
              >
                {privacySaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nominate Icon Modal */}
      {nominateModalOpen && (
        <div className="community-modal-overlay" onClick={() => setNominateModalOpen(false)}>
          <div className="community-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="community-modal-header">
              <h3>Nominate for Wall of Fame</h3>
              <button className="community-modal-close" onClick={() => setNominateModalOpen(false)}>
                <RiCloseLine />
              </button>
            </div>

            <form onSubmit={handleSubmitNomination}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 4 }}>
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quincy Jones"
                  className="community-search-input"
                  style={{ width: '100%' }}
                  value={nomineeForm.subject_name}
                  onChange={(e) => setNomineeForm({ ...nomineeForm, subject_name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 4 }}>
                    Industry Role *
                  </label>
                  <select
                    className="privacy-select"
                    style={{ width: '100%', padding: '9px 12px' }}
                    value={nomineeForm.role}
                    onChange={(e) => setNomineeForm({ ...nomineeForm, role: e.target.value })}
                  >
                    <option value="producer">Producer</option>
                    <option value="creator">Creator / Artist</option>
                    <option value="supervisor">Music Supervisor</option>
                    <option value="label">Record Label Head</option>
                    <option value="dj">DJ / Curator</option>
                    <option value="vc">Venture Capitalist</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 4 }}>
                    Email (for invite token)
                  </label>
                  <input
                    type="email"
                    placeholder="nominee@industry.com"
                    className="community-search-input"
                    style={{ width: '100%' }}
                    value={nomineeForm.subject_email}
                    onChange={(e) => setNomineeForm({ ...nomineeForm, subject_email: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 6 }}>
                  Featured Media Type
                </label>
                <div style={{ display: 'flex', gap: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#e2e8f0', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="nominee_media_type"
                      value="video"
                      checked={nomineeForm.media_type !== 'image'}
                      onChange={() => setNomineeForm({ ...nomineeForm, media_type: 'video' })}
                    />
                    Featured Video (YouTube)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#e2e8f0', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="nominee_media_type"
                      value="image"
                      checked={nomineeForm.media_type === 'image'}
                      onChange={() => setNomineeForm({ ...nomineeForm, media_type: 'image' })}
                    />
                    Featured Portrait Image
                  </label>
                </div>
              </div>

              {nomineeForm.media_type === 'image' ? (
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 4 }}>
                    Portrait / Photography Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/... or hosted portrait URL"
                    className="community-search-input"
                    style={{ width: '100%' }}
                    value={nomineeForm.image_url || ''}
                    onChange={(e) => setNomineeForm({ ...nomineeForm, image_url: e.target.value })}
                  />
                </div>
              ) : (
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 4 }}>
                    YouTube Channel Handle or Video ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. @rickrubin or dQw4w9WgXcQ"
                    className="community-search-input"
                    style={{ width: '100%' }}
                    value={nomineeForm.youtube_channel_handle}
                    onChange={(e) =>
                      setNomineeForm({ ...nomineeForm, youtube_channel_handle: e.target.value })
                    }
                  />
                </div>
              )}

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 4 }}>
                  Bio &amp; Achievements *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Highlight key contributions to the music industry..."
                  className="community-search-input"
                  style={{ width: '100%', resize: 'none' }}
                  value={nomineeForm.bio}
                  onChange={(e) => setNomineeForm({ ...nomineeForm, bio: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 4 }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hip Hop, Grammy, A24, Modular"
                  className="community-search-input"
                  style={{ width: '100%' }}
                  value={nomineeForm.tags}
                  onChange={(e) => setNomineeForm({ ...nomineeForm, tags: e.target.value })}
                />
              </div>

              {nomineeSuccess && (
                <div style={{ color: '#00f0ff', fontSize: '0.85rem', marginBottom: 12, fontWeight: 700 }}>
                  {nomineeSuccess}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button
                  type="button"
                  className="community-btn community-btn-secondary"
                  onClick={() => setNominateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="community-btn community-btn-primary"
                  disabled={nomineeSubmitting}
                >
                  {nomineeSubmitting ? 'Submitting...' : 'Submit Nomination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Quick Creator Tipping Modal */}
      {tipModalOpen && tipTarget && (
        <div className="community-modal-overlay" onClick={() => setTipModalOpen(false)}>
          <div className="community-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="community-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiMoneyDollarCircleLine style={{ color: '#10b981', fontSize: 22 }} />
                <h3>Quick Creator Tip</h3>
              </div>
              <button className="community-modal-close" onClick={() => setTipModalOpen(false)}>
                <RiCloseLine />
              </button>
            </div>

            <form onSubmit={handleExecuteQuickTip}>
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* Recipient Profile Card */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#090d16', border: '1px solid #1e293b', borderRadius: 3, padding: 12 }}>
                  <img
                    src={tipTarget.image_url || tipTarget.youtube_thumbnail_url || tipTarget.avatar_url || '/favicon.png'}
                    alt={tipTarget.subject_name}
                    style={{ width: 44, height: 44, borderRadius: 3, objectFit: 'cover', border: '1px solid #334155' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
                      {tipTarget.subject_name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 600 }}>
                      {tipTarget.role || 'Inducted Creator'}
                    </div>
                  </div>
                </div>

                {/* Amount Selection */}
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>
                    Select Tip Amount (Credits / USD)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 8 }}>
                    {[
                      { cred: 10, usd: '$1' },
                      { cred: 50, usd: '$5' },
                      { cred: 100, usd: '$10' },
                      { cred: 250, usd: '$25' },
                    ].map((item) => (
                      <button
                        key={item.cred}
                        type="button"
                        className={`tip-preset-btn ${tipAmount === item.cred && !tipCustomAmount ? 'active' : ''}`}
                        onClick={() => {
                          setTipAmount(item.cred);
                          setTipCustomAmount('');
                        }}
                      >
                        <div style={{ fontSize: '13px', fontWeight: 800 }}>{item.cred} TM</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{item.usd}</div>
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    min="1"
                    placeholder="Or enter custom Credits (e.g. 500 = $50)..."
                    className="community-search-input"
                    style={{ width: '100%' }}
                    value={tipCustomAmount}
                    onChange={(e) => setTipCustomAmount(e.target.value)}
                  />
                </div>

                {/* Settlement Rail */}
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>
                    Settlement Rail
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    <button
                      type="button"
                      className={`tip-rail-btn ${tipPaymentRail === 'credits' ? 'active' : ''}`}
                      onClick={() => setTipPaymentRail('credits')}
                    >
                      Credits Balance
                    </button>
                    <button
                      type="button"
                      className={`tip-rail-btn ${tipPaymentRail === 'mpesa' ? 'active' : ''}`}
                      onClick={() => setTipPaymentRail('mpesa')}
                    >
                      M-Pesa STK Push
                    </button>
                    <button
                      type="button"
                      className={`tip-rail-btn ${tipPaymentRail === 'card' ? 'active' : ''}`}
                      onClick={() => setTipPaymentRail('card')}
                    >
                      Card / Apple Pay
                    </button>
                  </div>
                </div>

                {tipPaymentRail === 'mpesa' && (
                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.75rem', fontWeight: 700, marginBottom: 4 }}>
                      M-Pesa Phone Number (254...)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 254712345678"
                      className="community-search-input"
                      style={{ width: '100%' }}
                      value={tipPhone}
                      onChange={(e) => setTipPhone(e.target.value)}
                    />
                  </div>
                )}

                {/* Optional Message */}
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>
                    Encouraging Note / Studio Shout-out (Optional)
                  </label>
                  <textarea
                    rows={2}
                    className="community-search-input"
                    style={{ width: '100%', resize: 'vertical' }}
                    value={tipNote}
                    onChange={(e) => setTipNote(e.target.value)}
                    placeholder="Keep making history! Loved your polyrhythmic stem pack..."
                  />
                </div>

                {/* Compensation Protocol Notice */}
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 3, padding: 10, fontSize: '11px', color: '#cbd5e1', lineHeight: 1.5 }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>• Compensation Guarantee:</span> 95% net proceeds are deposited directly into the creator's wallet. Zero distributor cuts or monthly fan subscription traps.
                </div>

              </div>

              <div style={{ padding: '16px 24px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button
                  type="button"
                  className="community-btn community-btn-secondary"
                  onClick={() => setTipModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="community-btn community-btn-primary"
                  style={{ background: '#10b981', borderColor: '#10b981', color: '#060813' }}
                  disabled={tipSubmitting}
                >
                  {tipSubmitting ? 'Processing Tip...' : `Confirm & Send Tip ($${((tipCustomAmount ? parseInt(tipCustomAmount, 10) : tipAmount) / 10).toFixed(2)})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite to Activate EPK Modal (§9.11.6) */}
      {epkInviteModalOpen && epkInviteTarget && (
        <div className="community-modal-overlay" onClick={() => setEpkInviteModalOpen(false)}>
          <div className="community-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="community-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiSparklingFill style={{ color: '#00f0ff', fontSize: 20 }} />
                <h3>Invite Luminary to Activate EPK</h3>
              </div>
              <button className="community-modal-close" onClick={() => setEpkInviteModalOpen(false)}>
                <RiCloseLine />
              </button>
            </div>

            <form onSubmit={handleDispatchEpkInvite}>
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: 3, padding: 14 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                    {epkInviteTarget.subject_name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: 2, textTransform: 'uppercase', fontWeight: 600 }}>
                    {epkInviteTarget.role} &bull; Inducted Luminary
                  </div>
                  {epkInviteTarget.subject_email && (
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: 4 }}>
                      Dispatch To: {epkInviteTarget.subject_email}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>
                    Personalized Curatorial Message
                  </label>
                  <textarea
                    rows={3}
                    className="community-search-input"
                    style={{ width: '100%', resize: 'vertical' }}
                    value={epkInviteNote}
                    onChange={(e) => setEpkInviteNote(e.target.value)}
                    placeholder="Add an encouraging note to motivate them to spin up their EPK..."
                  />
                </div>

                <div style={{ background: 'rgba(34, 211, 238, 0.05)', border: '1px solid rgba(34, 211, 238, 0.2)', borderRadius: 3, padding: 12 }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: 6 }}>
                    Ecosystem Protocols Executed
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
                    <li>Branded induction email dispatched via Resend</li>
                    <li>Priority notification posted in inductee's User Inbox</li>
                    <li>Candidate lead synchronized in Intermaven Smart CRM</li>
                    {epkInviteTarget.phone && <li>Outbound WhatsApp notification with 1-tap activation link</li>}
                  </ul>
                </div>
              </div>

              <div style={{ padding: '16px 24px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button
                  type="button"
                  className="community-btn community-btn-secondary"
                  onClick={() => setEpkInviteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="community-btn community-btn-primary"
                  disabled={epkInviteSubmitting}
                >
                  {epkInviteSubmitting ? 'Dispatching...' : 'Dispatch EPK Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
