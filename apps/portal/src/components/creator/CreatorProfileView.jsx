import React, { useState, useEffect } from 'react'
import {
  RiShieldCheckFill,
  RiArrowLeftLine,
  RiPlayFill,
  RiPauseFill,
  RiFileTextFill,
  RiHeadphoneFill,
  RiUserFollowFill,
  RiUserUnfollowFill,
  RiNotification3Fill,
  RiNotification3Line,
  RiHeart3Fill,
  RiHeart3Line,
  RiMessage2Fill,
  RiShareForwardFill,
  RiCheckFill,
  RiMapPin2Fill,
  RiMusic2Fill,
  RiDiscFill,
  RiExternalLinkLine,
  RiInstagramFill,
  RiTwitterXFill,
  RiYoutubeFill,
  RiSpotifyFill,
  RiAppleFill,
  RiSoundcloudFill,
  RiGlobalFill,
  RiSendPlaneFill,
  RiDeleteBin7Line,
  RiEqualizerFill,
  RiBroadcastFill,
  RiBuilding4Fill,
  RiFileShield2Fill
} from 'react-icons/ri'
import { normalizeMediaUrl } from '../../lib/api'

// Role badge configuration adhering strictly to Design Standards §4D (Solid flat colors, NO gradients)
const ROLE_BADGE_CONFIG = {
  artist: {
    label: 'Signed Artist / Producer',
    color: '#060813',
    bg: '#22d3ee', // Cyan
    border: '#22d3ee',
    icon: RiMusic2Fill
  },
  dj: {
    label: 'Club & Radio DJ / Remixer',
    color: '#ffffff',
    bg: '#7c3aed', // Flat Purple
    border: '#8b5cf6',
    icon: RiEqualizerFill
  },
  label: {
    label: 'Independent Record Label',
    color: '#060813',
    bg: '#10b981', // Emerald Green
    border: '#10b981',
    icon: RiBuilding4Fill
  },
  publisher: {
    label: 'Music Publisher & Administrator',
    color: '#060813',
    bg: '#f59e0b', // Amber
    border: '#f59e0b',
    icon: RiFileShield2Fill
  },
  producer: {
    label: 'Music Producer & Beatmaker',
    color: '#ffffff',
    bg: '#2563eb', // Royal Blue
    border: '#3b82f6',
    icon: RiDiscFill
  }
}

// Pre-seeded authentic community comments tailored per creator
const SEED_COMMENTS_BY_ROLE = {
  artist: [
    {
      id: 'comm_1',
      author: 'Kiplagat Beats',
      role: 'Fellow Producer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      timestamp: '2 hours ago',
      text: 'The analogue modular synthesis on the latest EP is next-level. Pure African electronic innovation!',
      likes: 24,
      liked: false
    },
    {
      id: 'comm_2',
      author: 'Maya Lin',
      role: 'Film Music Supervisor',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
      timestamp: '1 day ago',
      text: 'Just cleared two tracks for our upcoming Netflix original sync. The lossless FLAC stems and split sheets were seamless to license through TuneLedger.',
      likes: 38,
      liked: false
    },
    {
      id: 'comm_3',
      author: 'David Ochieng',
      role: 'Verified Fan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      timestamp: '3 days ago',
      text: 'Been streaming this all week on TuneStream. Keep putting East African sound design on the global map!',
      likes: 15,
      liked: false
    }
  ],
  dj: [
    {
      id: 'comm_1',
      author: 'DJ Edu (BBC 1Xtra)',
      role: 'Syndicated Radio Host',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      timestamp: '3 hours ago',
      text: 'Dropping the latest extended sunset mix on my Saturday night show across London. Unbeatable energy!',
      likes: 42,
      liked: false
    },
    {
      id: 'comm_2',
      author: 'Amina Coast Club',
      role: 'Venue Booker & Promoter',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      timestamp: '1 day ago',
      text: 'Packed venue from first transition to closing track. Residency booking confirmed for next month.',
      likes: 29,
      liked: false
    }
  ],
  label: [
    {
      id: 'comm_1',
      author: 'A&R Worldwide',
      role: 'Global Talent Scout',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      timestamp: '4 hours ago',
      text: 'Your catalog curation and transparent TuneLedger splits make working with this roster an absolute delight.',
      likes: 31,
      liked: false
    },
    {
      id: 'comm_2',
      author: 'Pulse Nairobi',
      role: 'Music Journalist',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100',
      timestamp: '2 days ago',
      text: 'Hands down the most forward-thinking electronic record label imprint currently operating in East Africa.',
      likes: 18,
      liked: false
    }
  ],
  publisher: [
    {
      id: 'comm_1',
      author: 'Apex Sync Agency',
      role: 'Advertising Producer',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100',
      timestamp: '5 hours ago',
      text: 'Fastest sync turnaround in the industry. Pre-cleared 50/50 splits and verified ISRC metadata cut our clearance timeline by weeks.',
      likes: 56,
      liked: false
    },
    {
      id: 'comm_2',
      author: 'Samira Al-Hassan',
      role: 'Screenwriter & Director',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
      timestamp: '2 days ago',
      text: 'Licensing the theme score through Intermaven Publishing was effortless. Statutory audit documents generated in one click.',
      likes: 22,
      liked: false
    }
  ]
}

export default function CreatorProfileView({
  creator,
  tracks = [],
  onBack,
  onPlayTrack,
  onNavigateToEpk,
  sessionUser
}) {
  if (!creator) return null;

  const creatorType = creator.creator_type || (
    creator.role?.toLowerCase().includes('dj') ? 'dj' :
    creator.role?.toLowerCase().includes('label') ? 'label' :
    creator.role?.toLowerCase().includes('publisher') ? 'publisher' :
    creator.role?.toLowerCase().includes('producer') ? 'producer' : 'artist'
  );

  const roleConfig = ROLE_BADGE_CONFIG[creatorType] || ROLE_BADGE_CONFIG.artist;
  const RoleIcon = roleConfig.icon;
  const creatorId = creator.id || creator.subdomain || 'creator';
  const subdomain = creator.subdomain || (creator.name ? creator.name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'ndufo');

  // Persistence keys
  const followKey = `tm_following_${creatorId}`;
  const subKey = `tm_subscribed_${creatorId}`;
  const commentsKey = `tm_comments_${creatorId}`;

  // Interactive follow / subscribe state
  const [isFollowing, setIsFollowing] = useState(() => {
    try {
      return localStorage.getItem(followKey) === 'true';
    } catch {
      return false;
    }
  });

  const [isSubscribed, setIsSubscribed] = useState(() => {
    try {
      return localStorage.getItem(subKey) === 'true';
    } catch {
      return false;
    }
  });

  // Base counts with dynamic increment
  const baseFollowers = creator.followers_count || (creator.name === 'Ndufo' ? 142850 : 89400);
  const [followerCount, setFollowerCount] = useState(baseFollowers + (isFollowing ? 1 : 0));

  const baseSubscribers = creator.subscribers_count || (creator.name === 'Ndufo' ? 48200 : 26500);
  const [subscriberCount, setSubscriberCount] = useState(baseSubscribers + (isSubscribed ? 1 : 0));

  // High-Contrast Analogous Toast Notification System (Design Standards §13)
  const [toast, setToast] = useState(null);

  const showToast = (tag, message) => {
    setToast({ tag, message, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Follow Toggle
  const handleToggleFollow = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setFollowerCount(prev => nextState ? prev + 1 : Math.max(0, prev - 1));
    try {
      localStorage.setItem(followKey, String(nextState));
    } catch {}

    if (nextState) {
      showToast('SUCCESS', `You are now following ${creator.name}! New releases will appear on your radar.`);
    } else {
      showToast('UPDATE', `Unfollowed ${creator.name}.`);
    }
  };

  // Subscribe Toggle
  const handleToggleSubscribe = () => {
    const nextState = !isSubscribed;
    setIsSubscribed(nextState);
    setSubscriberCount(prev => nextState ? prev + 1 : Math.max(0, prev - 1));
    try {
      localStorage.setItem(subKey, String(nextState));
    } catch {}

    if (nextState) {
      showToast('SUCCESS', `Subscribed to release alerts, tour VIP passes & lossless drops for ${creator.name}!`);
    } else {
      showToast('UPDATE', `Notification subscription turned off for ${creator.name}.`);
    }
  };

  // Share Link Handler
  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?view=explore&creator=${subdomain}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
      showToast('SUCCESS', `Shareable profile URL copied to clipboard!`);
    } else {
      showToast('SUCCESS', `Profile link ready: ${url}`);
    }
  };

  // Social handles
  const socials = creator.socials || {
    instagram: creator.subdomain || 'tunemavens',
    twitter: creator.subdomain || 'tunemavens',
    youtube: creator.subdomain || 'TuneMavensOfficial',
    spotify: creator.name || 'TuneMavens',
    soundcloud: creator.subdomain || 'tunemavens'
  };

  // Commenting State & Persistence
  const [comments, setComments] = useState(() => {
    try {
      const saved = localStorage.getItem(commentsKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return SEED_COMMENTS_BY_ROLE[creatorType] || SEED_COMMENTS_BY_ROLE.artist;
  });

  const [newCommentText, setNewCommentText] = useState('');
  const [authorName, setAuthorName] = useState(sessionUser?.username || 'Guest Listener');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePostComment = (e) => {
    e.preventDefault();
    const trimmed = newCommentText.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    const newEntry = {
      id: `comm_${Date.now()}`,
      author: authorName.trim() || 'Verified Listener',
      role: sessionUser ? 'Registered Member' : 'Community Member',
      avatar: sessionUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      timestamp: 'Just now',
      text: trimmed,
      likes: 1,
      liked: true
    };

    const updated = [newEntry, ...comments];
    setComments(updated);
    try {
      localStorage.setItem(commentsKey, JSON.stringify(updated));
    } catch {}

    setNewCommentText('');
    setIsSubmitting(false);
    showToast('SUCCESS', `Your comment has been published to ${creator.name}'s feed!`);
  };

  const handleLikeComment = (commentId) => {
    const updated = comments.map(c => {
      if (c.id === commentId) {
        const nextLiked = !c.liked;
        return {
          ...c,
          liked: nextLiked,
          likes: nextLiked ? c.likes + 1 : Math.max(0, c.likes - 1)
        };
      }
      return c;
    });
    setComments(updated);
    try {
      localStorage.setItem(commentsKey, JSON.stringify(updated));
    } catch {}
  };

  const handleDeleteComment = (commentId) => {
    const updated = comments.filter(c => c.id !== commentId);
    setComments(updated);
    try {
      localStorage.setItem(commentsKey, JSON.stringify(updated));
    } catch {}
    showToast('UPDATE', 'Comment removed.');
  };

  // Filter creator's relevant tracks
  const creatorTracks = tracks.filter(t => 
    (t.artist && t.artist.toLowerCase() === creator.name.toLowerCase()) ||
    (t.creator && t.creator.toLowerCase() === creator.name.toLowerCase()) ||
    (creatorType === 'label' && (t.label?.toLowerCase() === creator.name.toLowerCase() || t.artist))
  );

  const featuredTrack = creatorTracks[0] || tracks[0] || {
    id: 'spotlight_master',
    title: `${creator.name} — Signature Master`,
    artist: creator.name,
    release: 'Lossless Master Edition',
    genre: creator.genre || 'Afro-House',
    isrc: 'KE-TM1-26-00042',
    duration: '3:45'
  };

  const bannerImg = creator.banner || creator.avatar || '/heroes/ndufo_hero_slide1_retina.jpg';
  const avatarImg = normalizeMediaUrl(creator.avatar) || '/heroes/ndufo_hero_slide1_retina.jpg';

  return (
    <div 
      className="creator-profile-view"
      style={{
        width: '100%',
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '0 0 60px',
        color: '#f8fafc',
        fontFamily: "'Outfit', 'Space Grotesk', system-ui, sans-serif",
        textAlign: 'left'
      }}
    >
      {/* High-Contrast Analogous Notification Toast (Design Standards §13) */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 9999,
            background: '#071d2c',
            border: '1.5px solid #00f0ff',
            borderLeft: '5px solid #00f0ff',
            borderRadius: '3px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.85), 0 0 16px rgba(0, 240, 255, 0.32)',
            maxWidth: '460px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <span
            style={{
              background: '#00f0ff',
              color: '#000000',
              fontWeight: '800',
              fontSize: '10px',
              letterSpacing: '0.08em',
              padding: '2px 6px',
              borderRadius: '3px'
            }}
          >
            {toast.tag}
          </span>
          <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '500', lineHeight: '1.4' }}>
            {toast.message}
          </span>
        </div>
      )}

      {/* Top Breadcrumb & Navigation Bar */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px', 
          flexWrap: 'wrap', 
          gap: '12px' 
        }}
      >
        <button
          type="button"
          onClick={onBack}
          className="back-to-main"
          style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#f8fafc',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <RiArrowLeftLine size={16} color="#22d3ee" />
          <span>Back to Explore Grid</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Explore &gt; Creators &gt; <strong style={{ color: '#fff' }}>{creator.name}</strong>
          </span>
          <button
            type="button"
            onClick={handleShare}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '3px',
              color: '#f8fafc',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            title="Copy shareable link"
          >
            <RiShareForwardFill size={15} color="#22d3ee" />
            Share Profile
          </button>
        </div>
      </div>

      {/* Creator Profile Header (No header image - maximized room for profile identity & actions) */}
      <div
        style={{
          background: 'rgba(12, 15, 32, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '3px',
          padding: '24px 28px',
          marginBottom: '20px',
          backdropFilter: 'blur(12px)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap'
          }}
        >
          {/* Avatar and Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '92px',
                height: '92px',
                borderRadius: '3px',
                overflow: 'hidden',
                border: '2px solid #22d3ee',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 12px rgba(34, 211, 238, 0.25)',
                background: '#060813',
                flexShrink: 0
              }}
            >
              <img
                src={avatarImg}
                alt={creator.name}
                onError={(e) => { e.currentTarget.src = '/uploads/artwork/ndufo_cover.jpg'; }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '3px',
                  display: 'block'
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: roleConfig.bg,
                    color: roleConfig.color,
                    fontSize: '11px',
                    fontWeight: '800',
                    letterSpacing: '0.04em',
                    padding: '3px 10px',
                    borderRadius: '3px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <RoleIcon size={13} />
                  {roleConfig.label}
                </span>

                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.16)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '3px 10px',
                    borderRadius: '3px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RiShieldCheckFill size={13} />
                  Verified Creator
                </span>

                <span
                  style={{
                    fontSize: '11px',
                    color: '#cbd5e1',
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '3px 10px',
                    borderRadius: '3px',
                    fontWeight: '600'
                  }}
                >
                  {creator.genre || 'Afro-fusion'}
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "'Sansation', sans-serif",
                  fontSize: 'clamp(26px, 3.5vw, 34px)',
                  fontWeight: '800',
                  color: '#ffffff',
                  margin: '0 0 6px',
                  lineHeight: '1.15'
                }}
              >
                {creator.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#94a3b8', fontSize: '13px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'monospace', color: '#22d3ee', fontWeight: 'bold' }}>
                  @{subdomain}
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <RiMapPin2Fill size={14} color="#94a3b8" />
                  {creator.location || 'Nairobi, Kenya'}
                </span>
                <span>•</span>
                <span style={{ color: '#e2e8f0', fontWeight: '600' }}>
                  {creator.listeners || `${(followerCount / 1000).toFixed(1)}k listeners`}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Follow & Subscribe Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleToggleFollow}
              style={{
                background: isFollowing ? 'rgba(16, 185, 129, 0.16)' : '#10b981',
                color: isFollowing ? '#10b981' : '#060813',
                border: isFollowing ? '1px solid #10b981' : 'none',
                borderRadius: '3px',
                padding: '9px 16px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isFollowing ? <><RiCheckFill size={15} /> Following ({followerCount.toLocaleString()})</> : <><RiUserFollowFill size={15} /> + Follow ({followerCount.toLocaleString()})</>}
            </button>

            <button
              type="button"
              onClick={handleToggleSubscribe}
              style={{
                background: isSubscribed ? 'rgba(139, 92, 246, 0.16)' : '#7c3aed',
                color: isSubscribed ? '#c084fc' : '#ffffff',
                border: isSubscribed ? '1px solid #8b5cf6' : 'none',
                borderRadius: '3px',
                padding: '9px 16px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isSubscribed ? <><RiNotification3Fill size={15} /> Subscribed ({subscriberCount.toLocaleString()})</> : <><RiNotification3Line size={15} /> Subscribe ({subscriberCount.toLocaleString()})</>}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Actions & CTAs Toolbar (Design Standards §4: Strict 3px border radius & flat colors) */}
      <div
        style={{
          background: 'rgba(12, 15, 32, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '3px',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          backdropFilter: 'blur(12px)'
        }}
      >
        {/* Left Side CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* CTA: Go to Streaming Site / Play Master */}
          <button
            type="button"
            onClick={() => onPlayTrack && onPlayTrack(featuredTrack)}
            style={{
              background: '#22d3ee',
              color: '#060813',
              border: 'none',
              borderRadius: '3px',
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(34, 211, 238, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <RiPlayFill size={17} />
            Stream on TuneStream
          </button>

          {/* CTA: Actual EPK */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateToEpk) {
                onNavigateToEpk(subdomain);
              } else {
                window.location.href = `#/epk/${subdomain}`;
              }
            }}
            style={{
              background: 'transparent',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '3px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            title="Launch the full Web World / Press Kit"
          >
            <RiFileTextFill size={16} color="#22d3ee" />
            Actual EPK 🌐
          </button>
        </div>

        {/* Right Side Social Actions: Follow & Subscribe */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Follow Button */}
          <button
            type="button"
            onClick={handleToggleFollow}
            style={{
              background: isFollowing ? 'rgba(16, 185, 129, 0.16)' : '#10b981',
              color: isFollowing ? '#10b981' : '#060813',
              border: isFollowing ? '1px solid #10b981' : 'none',
              borderRadius: '3px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            {isFollowing ? (
              <>
                <RiCheckFill size={16} />
                Following ({followerCount.toLocaleString()})
              </>
            ) : (
              <>
                <RiUserFollowFill size={16} />
                + Follow ({followerCount.toLocaleString()})
              </>
            )}
          </button>

          {/* Subscribe Button */}
          <button
            type="button"
            onClick={handleToggleSubscribe}
            style={{
              background: isSubscribed ? 'rgba(139, 92, 246, 0.16)' : '#7c3aed',
              color: isSubscribed ? '#c084fc' : '#ffffff',
              border: isSubscribed ? '1px solid #8b5cf6' : 'none',
              borderRadius: '3px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            {isSubscribed ? (
              <>
                <RiNotification3Fill size={16} />
                Subscribed ({subscriberCount.toLocaleString()})
              </>
            ) : (
              <>
                <RiNotification3Line size={16} />
                Subscribe ({subscriberCount.toLocaleString()})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: 2-Column Layout (Left: Bio, Details & Releases; Right: Handles & Comments) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Bio & Releases Showcase */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Creator Bio Card */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '3px',
              padding: '24px',
              backdropFilter: 'blur(8px)'
            }}
          >
            <h3
              style={{
                fontFamily: "'Sansation', sans-serif",
                fontSize: '18px',
                fontWeight: '800',
                color: '#ffffff',
                margin: '0 0 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RiFileTextFill size={18} color="#22d3ee" />
              Creator Biography
            </h3>

            <p
              style={{
                fontSize: '14px',
                color: '#cbd5e1',
                lineHeight: '1.7',
                margin: '0 0 18px'
              }}
            >
              {creator.bio || `${creator.name} is a verified creator in the TuneMavens ecosystem, operating with lossless 24-bit transcoded master audio and smart split contract automation under TuneLedger.`}
            </p>

            {/* Quick Metadata Matrix */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  Creator Role
                </span>
                <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: '600' }}>
                  {roleConfig.label}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  Audio Standard
                </span>
                <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '600' }}>
                  ✓ 24-Bit / 96kHz Lossless
                </span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  TuneLedger Splits
                </span>
                <span style={{ fontSize: '13px', color: '#22d3ee', fontWeight: '600' }}>
                  ✓ Automated Statutory
                </span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  Direct EPK
                </span>
                <span style={{ fontSize: '13px', color: '#a855f7', fontWeight: '600' }}>
                  tunemavens.com/epk/{subdomain}
                </span>
              </div>
            </div>
          </div>

          {/* Releases / Discography Showcase */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '3px',
              padding: '24px',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3
                style={{
                  fontFamily: "'Sansation', sans-serif",
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#ffffff',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RiDiscFill size={18} color="#22d3ee" />
                Featured Audio Releases ({creatorTracks.length || 1})
              </h3>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                Instant lossless playback
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(creatorTracks.length > 0 ? creatorTracks : [featuredTrack]).map((trk, i) => (
                <div
                  key={trk.id || i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '3px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => onPlayTrack && onPlayTrack(trk)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <span style={{ fontSize: '12px', color: '#64748b', width: '18px', fontWeight: 'bold' }}>
                      {i + 1}
                    </span>
                    <img
                      src={normalizeMediaUrl(trk.cover || trk.coverArt) || avatarImg}
                      alt={trk.title}
                      onError={(e) => { e.currentTarget.src = '/uploads/artwork/ndufo_cover.jpg'; }}
                      style={{ width: '42px', height: '42px', borderRadius: '3px', objectFit: 'cover' }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <h4
                        style={{
                          margin: '0 0 3px',
                          fontSize: '14px',
                          color: '#fff',
                          fontWeight: '700',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {trk.title}
                      </h4>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {trk.release || trk.album || 'Single'} • {trk.genre || creator.genre || 'Afrobeats'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
                      {trk.duration || '3:45'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onPlayTrack) onPlayTrack(trk);
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '3px',
                        border: 'none',
                        background: '#22d3ee',
                        color: '#060813',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      title="Play master track"
                    >
                      <RiPlayFill size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Social Handles & Comments Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Social Media Handles Card */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '3px',
              padding: '24px',
              backdropFilter: 'blur(8px)'
            }}
          >
            <h3
              style={{
                fontFamily: "'Sansation', sans-serif",
                fontSize: '18px',
                fontWeight: '800',
                color: '#ffffff',
                margin: '0 0 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RiGlobalFill size={18} color="#22d3ee" />
              Social Media Handles &amp; Links
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
              {/* Instagram */}
              <a
                href={`https://instagram.com/${socials.instagram || subdomain}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '3px',
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
              >
                <RiInstagramFill size={17} color="#e1306c" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  @{socials.instagram || subdomain}
                </span>
              </a>

              {/* X / Twitter */}
              <a
                href={`https://x.com/${socials.twitter || subdomain}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '3px',
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
              >
                <RiTwitterXFill size={16} color="#f8fafc" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  @{socials.twitter || subdomain}
                </span>
              </a>

              {/* YouTube */}
              <a
                href={`https://youtube.com/@${socials.youtube || subdomain}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '3px',
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
              >
                <RiYoutubeFill size={17} color="#ff0000" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {socials.youtube || 'YouTube'}
                </span>
              </a>

              {/* Spotify */}
              <a
                href={`https://open.spotify.com/search/${encodeURIComponent(creator.name)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '3px',
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
              >
                <RiSpotifyFill size={17} color="#1ed760" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Spotify
                </span>
              </a>

              {/* Apple Music */}
              <a
                href={`https://music.apple.com/search?term=${encodeURIComponent(creator.name)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '3px',
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
              >
                <RiAppleFill size={17} color="#fb7185" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Apple Music
                </span>
              </a>

              {/* SoundCloud */}
              <a
                href={`https://soundcloud.com/${socials.soundcloud || subdomain}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '3px',
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
              >
                <RiSoundcloudFill size={17} color="#ff7700" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  SoundCloud
                </span>
              </a>
            </div>
          </div>

          {/* User Commenting & Community Feed Section */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '3px',
              padding: '24px',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3
                style={{
                  fontFamily: "'Sansation', sans-serif",
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#ffffff',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RiMessage2Fill size={18} color="#22d3ee" />
                Community Discussion &amp; Feedback ({comments.length})
              </h3>
            </div>

            {/* Comment Post Form */}
            <form onSubmit={handlePostComment} style={{ marginBottom: '22px' }}>
              <div style={{ marginBottom: '10px' }}>
                <textarea
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  maxLength={500}
                  placeholder={`Write a comment, inquiry, or shoutout for ${creator.name}...`}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '3px',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {newCommentText.length} / 500 characters
                </span>
                <button
                  type="submit"
                  disabled={!newCommentText.trim() || isSubmitting}
                  style={{
                    background: newCommentText.trim() ? '#22d3ee' : 'rgba(255, 255, 255, 0.08)',
                    color: newCommentText.trim() ? '#060813' : '#64748b',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: newCommentText.trim() ? 'pointer' : 'not-allowed',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <RiSendPlaneFill size={14} />
                  Post Comment
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
              {comments.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '3px',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={c.avatar}
                        alt={c.author}
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'; }}
                        style={{ width: '32px', height: '32px', borderRadius: '3px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '13px', color: '#ffffff', fontWeight: '700' }}>
                            {c.author}
                          </span>
                          <span style={{ fontSize: '10px', color: '#22d3ee', background: 'rgba(34, 211, 238, 0.12)', padding: '1px 6px', borderRadius: '3px', fontWeight: 'bold' }}>
                            {c.role || 'Member'}
                          </span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          {c.timestamp}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleLikeComment(c.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: c.liked ? '#f43f5e' : '#94a3b8',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '2px 4px'
                        }}
                        title="Like comment"
                      >
                        {c.liked ? <RiHeart3Fill size={15} color="#f43f5e" /> : <RiHeart3Line size={15} />}
                        {c.likes}
                      </button>

                      {c.id.startsWith('comm_') && c.timestamp === 'Just now' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(c.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            padding: '2px'
                          }}
                          title="Delete my comment"
                        >
                          <RiDeleteBin7Line size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
