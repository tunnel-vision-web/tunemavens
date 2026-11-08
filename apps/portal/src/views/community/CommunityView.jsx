import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  RiCheckLine,
  RiEyeLine,
  RiAddLine,
  RiMoneyDollarCircleLine,
  RiDiscLine,
  RiArrowLeftSLine,
  RiArrowRightSLine
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
  const [networkConnections, setNetworkConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interaction tracking states
  const [likedProfiles, setLikedProfiles] = useState({});
  const [followingMap, setFollowingMap] = useState({});

  // Modals
  const [videoModalUrl, setVideoModalUrl] = useState(null);
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
    youtube_channel_handle: '',
    youtube_video_id: '',
    bio: '',
    tags: '',
  });
  const [nomineeSubmitting, setNomineeSubmitting] = useState(false);
  const [nomineeSuccess, setNomineeSuccess] = useState('');

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

  // Load Feed
  const fetchFeed = async () => {
    try {
      const res = await fetch('/api/feed?limit=30');
      if (res.ok) {
        const data = await res.json();
        setFeedItems(data.items || []);
      }
    } catch (err) {
      console.warn('Failed to fetch Feed:', err);
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
            <Link
              to="/admin/wall-of-fame"
              className="community-btn community-btn-secondary"
              data-testid="admin-console-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
            >
              <RiShieldLine /> Admin Console
            </Link>
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
            <RiPulseLine /> Live Activity Feed
          </button>
          <button
            className={`community-tab-btn ${activeTab === 'network' ? 'active' : ''}`}
            onClick={() => setActiveTab('network')}
          >
            <RiShareForwardLine /> 2nd-Degree Network Discovery
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

            {/* Grid (4 Rows Max Standard) */}
            <div className="wall-of-fame-grid">
              {paginatedProfiles.map((p) => {
                const isLiked = likedProfiles[p.id];
                const isFollowing = followingMap[p.id];
                const videoId = p.youtube_video_id || 'dQw4w9WgXcQ';
                const cleanVid = videoId.replace('v=', '').trim();

                return (
                  <div className="fame-card" key={p.id} data-testid={`fame-card-${p.id}`}>
                    <div className="fame-card-media">
                      <img
                        src={
                          p.youtube_thumbnail_url ||
                          `https://img.youtube.com/vi/${cleanVid}/hqdefault.jpg`
                        }
                        alt={p.subject_name}
                        className="fame-card-img"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <button
                        className="fame-card-play-btn"
                        onClick={() =>
                          setVideoModalUrl(`https://www.youtube.com/embed/${cleanVid}?autoplay=1`)
                        }
                        title="Watch masterclass video"
                      >
                        <RiPlayFill />
                      </button>
                      <div className="fame-card-views-badge">
                        <RiYoutubeFill style={{ verticalAlign: 'middle', marginRight: 4 }} />
                        {p.youtube_views_formatted || 'Verified Showcase'}
                      </div>
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

        {/* TAB 2: Live Activity Feed */}
        {activeTab === 'feed' && (
          <div className="community-feed-layout">
            <div className="feed-items-list">
              {feedItems.map((item) => {
                let iconClass = 'trophy';
                let IconComponent = RiTrophyLine;

                if (item.kind === 'deal' || item.kind === 'contract_signed') {
                  iconClass = 'deal';
                  IconComponent = RiMoneyDollarCircleLine;
                } else if (item.kind === 'tip') {
                  iconClass = 'tip';
                  IconComponent = RiHeartFill;
                } else if (item.kind === 'listen' || item.kind === 'download') {
                  iconClass = '';
                  IconComponent = RiDiscLine;
                }

                return (
                  <div className="feed-item-card" key={item.id}>
                    <div className={`feed-item-icon ${iconClass}`}>
                      <IconComponent />
                    </div>
                    <div className="feed-item-content">
                      <div>
                        <span className="feed-item-actor">{item.actor_name || 'TuneMavens Member'}</span>
                        <span className="feed-item-role">[{item.actor_role || 'member'}]</span>
                      </div>
                      <div className="feed-item-target">
                        {item.target_name || `${item.kind.toUpperCase()} activity event`}
                      </div>
                      <div className="feed-item-time">
                        {item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now'} •{' '}
                        <span style={{ color: item.visibility === 'public' ? '#00f0ff' : '#a78bfa' }}>
                          {item.visibility || 'public'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feed Sidebar Info */}
            <div>
              <div style={{ background: '#0b1120', border: '1px solid #1e293b', padding: '24px', borderRadius: '3px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#ffffff' }}>Ecosystem Feed Protocols</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  The Home Feed fans out activity signals in real-time respecting the granular rules defined in your Privacy Center.
                </p>
                <div style={{ borderTop: '1px solid #1e293b', paddingTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#38bdf8', fontSize: '0.8rem', marginBottom: 8 }}>
                    <RiEyeLine /> Public Signals: Stream trends, Sync Deals, Inductions
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a78bfa', fontSize: '0.8rem' }}>
                    <RiShieldCheckFill /> Connections Only: Tips, contract milestones
                  </div>
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
    </div>
  );
}
