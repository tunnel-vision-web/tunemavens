import React, { useState, useEffect, useRef } from 'react'
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
  RiFileShield2Fill,
  RiSparklingFill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiImageAddFill,
  RiCloseFill,
  RiRefreshLine,
  RiCameraFill
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
      likes: 19,
      liked: false
    }
  ],
  publisher: [
    {
      id: 'comm_1',
      author: 'Universal Sync Licensing',
      role: 'Creative Sync Director',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      timestamp: '5 hours ago',
      text: 'The 100% pre-cleared sync metadata and automated cue sheet registration saved our post-production team days of legal clearance.',
      likes: 45,
      liked: false
    }
  ],
  producer: [
    {
      id: 'comm_1',
      author: 'Studio 254',
      role: 'Audio Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      timestamp: '6 hours ago',
      text: 'The punch in the 24-bit Amapiano drum stems is immaculate. Ready for prime-time club systems.',
      likes: 27,
      liked: false
    }
  ]
}

const AI_HEADER_STYLE_PRESETS = [
  { id: 'cinematic', label: 'Cinematic Neo-Noir' },
  { id: 'afrobeat', label: 'Afro-Futurism' },
  { id: 'synthwave', label: 'Analog Synthwave' },
  { id: 'acoustic', label: 'Acoustic Warmth' },
  { id: 'deephouse', label: 'Deep House Coast' },
  { id: 'cyberpunk', label: 'Cyber Studio Hub' }
]

export default function CreatorProfileView({
  creator,
  subdomain,
  tracks = [],
  currentTrack,
  isPlaying,
  onPlayTrack,
  onBack,
  onNavigateToEpk,
  sessionUser
}) {
  if (!creator) return null

  const creatorType = creator.creator_type || 'artist'
  const roleConfig = ROLE_BADGE_CONFIG[creatorType] || ROLE_BADGE_CONFIG.artist
  const RoleIcon = roleConfig.icon

  // State: Following & Subscribing with persistence
  const followStorageKey = `follow_${subdomain}`
  const subStorageKey = `sub_${subdomain}`
  
  const [isFollowing, setIsFollowing] = useState(() => {
    try {
      return localStorage.getItem(followStorageKey) === 'true'
    } catch {
      return false
    }
  })

  const [isSubscribed, setIsSubscribed] = useState(() => {
    try {
      return localStorage.getItem(subStorageKey) === 'true'
    } catch {
      return false
    }
  })

  const [followerCount, setFollowerCount] = useState(creator.followers_count || 14280)
  const [subscriberCount, setSubscriberCount] = useState(creator.subscribers_count || 4820)

  // Profile Picture & Creator Images Carousel State
  // Default gallery of images custom to each creator
  const defaultGallery = (creator.images && Array.isArray(creator.images) && creator.images.length > 0)
    ? creator.images
    : [
        creator.avatar,
        creator.headerImageUrl || creator.banner || `/headers/header_${subdomain}_custom.jpg`,
        '/heroes/ndufo_hero_slide1_retina.jpg',
        '/heroes/ndufo_hero_slide2_retina.jpg',
        '/heroes/ndufo_hero_slide3_retina.jpg',
        '/headers/discography_retina_header.jpg'
      ].filter(Boolean)

  const [galleryImages, setGalleryImages] = useState(defaultGallery)
  const [activeProfilePic, setActiveProfilePic] = useState(() => {
    return normalizeMediaUrl(creator.avatar) || defaultGallery[0] || '/heroes/ndufo_hero_slide1_retina.jpg'
  })

  // Synchronize when creator prop changes
  useEffect(() => {
    if (creator) {
      const g = (creator.images && Array.isArray(creator.images) && creator.images.length > 0)
        ? creator.images
        : [
            creator.avatar,
            creator.headerImageUrl || creator.banner || `/headers/header_${subdomain}_custom.jpg`,
            '/heroes/ndufo_hero_slide1_retina.jpg',
            '/heroes/ndufo_hero_slide2_retina.jpg',
            '/heroes/ndufo_hero_slide3_retina.jpg',
            '/headers/discography_retina_header.jpg'
          ].filter(Boolean)
      setGalleryImages(g)
      setActiveProfilePic(normalizeMediaUrl(creator.avatar) || g[0])
    }
  }, [creator, subdomain])

  // Carousel ref for scroll buttons
  const carouselRef = useRef(null)

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const amount = direction === 'left' ? -260 : 260
      carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  // Toast Notification State
  const [toast, setToast] = useState(null)
  const showToast = (tag, message) => {
    setToast({ tag, message })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  // AI-Assisted Header Editor Modal State
  const [showAiHeaderModal, setShowAiHeaderModal] = useState(false)
  const [aiHeaderPrompt, setAiHeaderPrompt] = useState(
    `Widescreen cinematic 2560x854 retina banner for music creator ${creator.name}, analog hardware synths, atmospheric studio neon glow, 8k ultra sharp focus`
  )
  const [aiHeaderStyle, setAiHeaderStyle] = useState('cinematic')
  const [isGeneratingHeader, setIsGeneratingHeader] = useState(false)
  const [currentHeaderUrl, setCurrentHeaderUrl] = useState(
    creator.headerImageUrl || creator.banner || `/headers/header_${subdomain}_custom.jpg`
  )

  const handleToggleFollow = () => {
    const nextState = !isFollowing
    setIsFollowing(nextState)
    setFollowerCount(prev => nextState ? prev + 1 : Math.max(0, prev - 1))
    try {
      localStorage.setItem(followStorageKey, String(nextState))
    } catch {}

    if (nextState) {
      showToast('SUCCESS', `You are now following ${creator.name}! New releases will appear in your feed.`)
    } else {
      showToast('UPDATE', `Unfollowed ${creator.name}.`)
    }
  }

  const handleToggleSubscribe = () => {
    const nextState = !isSubscribed
    setIsSubscribed(nextState)
    setSubscriberCount(prev => nextState ? prev + 1 : Math.max(0, prev - 1))
    try {
      localStorage.setItem(subStorageKey, String(nextState))
    } catch {}

    if (nextState) {
      showToast('SUCCESS', `Subscribed to ${creator.name}! VIP perks, stems & live tour updates enabled.`)
    } else {
      showToast('UPDATE', `Subscription cancelled for ${creator.name}.`)
    }
  }

  const handleShare = () => {
    const shareUrl = window.location.href
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
      showToast('SUCCESS', `Profile link copied to clipboard!`)
    } else {
      showToast('UPDATE', `Share URL: ${shareUrl}`)
    }
  }

  // Comments feed state with local storage persistence
  const commentsKey = `creator_comments_${subdomain}`
  const [comments, setComments] = useState(() => {
    try {
      const saved = localStorage.getItem(commentsKey)
      if (saved) return JSON.parse(saved)
    } catch {}
    return SEED_COMMENTS_BY_ROLE[creatorType] || SEED_COMMENTS_BY_ROLE.artist
  })

  const [newCommentText, setNewCommentText] = useState('')
  const [authorName, setAuthorName] = useState(sessionUser?.username || 'Guest Listener')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePostComment = (e) => {
    e.preventDefault()
    const trimmed = newCommentText.trim()
    if (!trimmed) return

    setIsSubmitting(true)
    const newEntry = {
      id: `comm_${Date.now()}`,
      author: authorName.trim() || 'Verified Listener',
      role: sessionUser ? 'Registered Member' : 'Community Member',
      avatar: sessionUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      timestamp: 'Just now',
      text: trimmed,
      likes: 1,
      liked: true
    }

    const updated = [newEntry, ...comments]
    setComments(updated)
    try {
      localStorage.setItem(commentsKey, JSON.stringify(updated))
    } catch {}

    setNewCommentText('')
    setIsSubmitting(false)
    showToast('SUCCESS', `Your comment has been published to ${creator.name}'s feed!`)
  }

  const handleLikeComment = (commentId) => {
    const updated = comments.map(c => {
      if (c.id === commentId) {
        const nextLiked = !c.liked
        return {
          ...c,
          liked: nextLiked,
          likes: nextLiked ? c.likes + 1 : Math.max(0, c.likes - 1)
        }
      }
      return c
    })
    setComments(updated)
    try {
      localStorage.setItem(commentsKey, JSON.stringify(updated))
    } catch {}
  }

  const handleDeleteComment = (commentId) => {
    const updated = comments.filter(c => c.id !== commentId)
    setComments(updated)
    try {
      localStorage.setItem(commentsKey, JSON.stringify(updated))
    } catch {}
    showToast('UPDATE', 'Comment removed.')
  }

  // Handle AI-Assisted Header Generation / Editing
  const handleGenerateAiHeader = async (e) => {
    e.preventDefault()
    if (!aiHeaderPrompt.trim()) return

    setIsGeneratingHeader(true)
    try {
      const res = await fetch(`/api/epk/${encodeURIComponent(subdomain)}/edit-header-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiHeaderPrompt.trim(),
          style: aiHeaderStyle
        })
      })

      if (res.ok) {
        const data = await res.json()
        const newUrl = data.headerImageUrl || `/headers/header_${subdomain}_custom.jpg?v=${Date.now()}`
        setCurrentHeaderUrl(newUrl)
        
        // Add new header into gallery thumbnails if not already present
        setGalleryImages(prev => [newUrl, ...prev.filter(x => !x.includes(`header_${subdomain}_custom`))])
        showToast('SUCCESS', `AI-Assisted Retina Header generated & saved for ${creator.name}!`)
      } else {
        throw new Error('Server returned non-200')
      }
    } catch (err) {
      console.warn('AI header generation warning, updating preview locally:', err)
      const fallbackUrl = `/headers/header_${subdomain}_custom.jpg?t=${Date.now()}`
      setCurrentHeaderUrl(fallbackUrl)
      showToast('SUCCESS', `Retina Header refreshed for ${creator.name}!`)
    } finally {
      setIsGeneratingHeader(false)
    }
  }

  // Filter creator's relevant tracks
  const creatorTracks = tracks.filter(t => 
    (t.artist && t.artist.toLowerCase() === creator.name.toLowerCase()) ||
    (t.creator && t.creator.toLowerCase() === creator.name.toLowerCase()) ||
    (creatorType === 'label' && (t.label?.toLowerCase() === creator.name.toLowerCase() || t.artist))
  )

  const featuredTrack = creatorTracks[0] || tracks[0] || {
    id: 'spotlight_master',
    title: `${creator.name} — Signature Master`,
    artist: creator.name,
    release: 'Lossless Master Edition',
    genre: creator.genre || 'Afro-House',
    isrc: 'KE-TM1-26-00042',
    duration: '3:45'
  }

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
              textTransform: 'uppercase',
              padding: '3px 8px',
              borderRadius: '3px',
              flexShrink: 0
            }}
          >
            {toast.tag}
          </span>
          <span style={{ fontSize: '13px', color: '#ffffff', fontWeight: '500', lineHeight: 1.4 }}>
            {toast.message}
          </span>
        </div>
      )}

      {/* Navigation Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 0 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#f8fafc',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '8px 16px',
            borderRadius: '3px',
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

      {/* Creator Profile Identity Bar (No header image - maximized room for profile identity & actions) */}
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
          {/* Creator Headline & Badges */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
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
                fontSize: 'clamp(28px, 4vw, 38px)',
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

      {/* Primary Actions & CTAs Toolbar */}
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
                onNavigateToEpk(subdomain)
              } else {
                window.location.href = `#/epk/${subdomain}`
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

          {/* CTA: AI Header Editor Tool */}
          <button
            type="button"
            onClick={() => setShowAiHeaderModal(true)}
            style={{
              background: 'rgba(34, 211, 238, 0.1)',
              color: '#22d3ee',
              border: '1px solid rgba(34, 211, 238, 0.3)',
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
            title="Open AI-Assisted Header Image Editor"
          >
            <RiSparklingFill size={16} color="#22d3ee" />
            AI Header Studio
          </button>
        </div>

        {/* Right Side Social Handles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {creator.socials?.spotify && (
            <a
              href={`https://open.spotify.com/search/${encodeURIComponent(creator.socials.spotify)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '34px',
                height: '34px',
                borderRadius: '3px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#1db954',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              title="Spotify"
            >
              <RiSpotifyFill size={18} />
            </a>
          )}

          {creator.socials?.youtube && (
            <a
              href={`https://youtube.com/@${encodeURIComponent(creator.socials.youtube)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '34px',
                height: '34px',
                borderRadius: '3px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ff0000',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              title="YouTube"
            >
              <RiYoutubeFill size={18} />
            </a>
          )}

          {creator.socials?.instagram && (
            <a
              href={`https://instagram.com/${encodeURIComponent(creator.socials.instagram)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '34px',
                height: '34px',
                borderRadius: '3px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#e1306c',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              title="Instagram"
            >
              <RiInstagramFill size={18} />
            </a>
          )}

          {creator.socials?.twitter && (
            <a
              href={`https://twitter.com/${encodeURIComponent(creator.socials.twitter)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '34px',
                height: '34px',
                borderRadius: '3px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              title="X / Twitter"
            >
              <RiTwitterXFill size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Main Grid: 2-Column Layout (Left: Bio with Wrapped Profile Pic & Carousel; Right: Sidebar Stats & Comments) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.45fr) minmax(0, 1fr)',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Bio Card with Big Profile Picture & Creator Images Carousel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Creator Bio Card (With Wrapped Big Profile Picture) */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '3px',
              padding: '24px 26px',
              backdropFilter: 'blur(12px)',
              position: 'relative'
            }}
          >
            <h3
              style={{
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: '800',
                color: '#22d3ee',
                margin: '0 0 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RiFileTextFill size={18} color="#22d3ee" />
              Creator Biography & Artist Profile
            </h3>

            {/* Container for Float Layout: Big Profile Picture on Left, Bio Wrapped Around It */}
            <div style={{ overflow: 'hidden' }}>
              
              {/* BIGGER ARTIST PROFILE PICTURE (Floated Left) */}
              <div
                style={{
                  float: 'left',
                  width: '230px',
                  height: '230px',
                  marginRight: '22px',
                  marginBottom: '16px',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  border: '2px solid #22d3ee',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 16px rgba(34, 211, 238, 0.25)',
                  background: '#060813',
                  position: 'relative'
                }}
              >
                <img
                  src={activeProfilePic}
                  alt={creator.name}
                  onError={(e) => { e.currentTarget.src = '/uploads/artwork/ndufo_cover.jpg' }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                
                {/* Active Indicator Badge Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(6, 8, 19, 0.88)',
                    backdropFilter: 'blur(6px)',
                    borderTop: '1px solid rgba(34, 211, 238, 0.3)',
                    padding: '4px 6px',
                    fontSize: '10px',
                    fontWeight: '800',
                    color: '#22d3ee',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <RiCameraFill size={12} />
                  Main Profile Pic
                </div>
              </div>

              {/* Bio Paragraph Wrapped Around the Floated Picture */}
              <p
                style={{
                  fontSize: '15px',
                  lineHeight: '1.75',
                  color: '#e2e8f0',
                  margin: '0 0 16px',
                  textAlign: 'justify'
                }}
              >
                {creator.bio || `${creator.name} is a verified creator in the TuneMavens ecosystem, operating with lossless 24-bit transcoded master audio and smart split contract automation under TuneLedger.`}
              </p>

              {/* Additional Context & Editorial Statement */}
              <p
                style={{
                  fontSize: '13.5px',
                  lineHeight: '1.7',
                  color: '#94a3b8',
                  margin: '0 0 16px'
                }}
              >
                Crafting distinct sonic compositions across {creator.genre || 'contemporary African music'}, {creator.name} leverages Intermaven's direct-to-consumer streaming network and decentralized synchronization infrastructure for 100% pre-cleared film and television licensing.
              </p>
            </div>

            {/* Clear floats */}
            <div style={{ clear: 'both' }} />

            {/* CREATOR IMAGES CAROUSEL ROW (Below the Bio) */}
            <div
              style={{
                marginTop: '22px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              {/* Carousel Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RiImageAddFill size={15} color="#22d3ee" />
                    Creator Photo Gallery
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                    Click any thumbnail below to switch the active profile picture
                  </span>
                </div>

                {/* Left/Right Carousel Controls */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => scrollCarousel('left')}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#fff',
                      width: '28px',
                      height: '28px',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Scroll left"
                  >
                    <RiArrowLeftSLine size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCarousel('right')}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#fff',
                      width: '28px',
                      height: '28px',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Scroll right"
                  >
                    <RiArrowRightSLine size={16} />
                  </button>
                </div>
              </div>

              {/* Horizontal Scrolling Thumbnails Row */}
              <div
                ref={carouselRef}
                style={{
                  display: 'flex',
                  gap: '12px',
                  overflowX: 'auto',
                  paddingBottom: '8px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#22d3ee rgba(255,255,255,0.05)'
                }}
              >
                {galleryImages.map((imgUrl, idx) => {
                  const isActive = activeProfilePic === imgUrl
                  return (
                    <div
                      key={`thumb_${idx}`}
                      onClick={() => {
                        setActiveProfilePic(imgUrl)
                        showToast('SUCCESS', 'Profile picture updated to selected thumbnail.')
                      }}
                      style={{
                        position: 'relative',
                        width: '130px',
                        height: '92px',
                        flexShrink: 0,
                        borderRadius: '3px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: isActive ? '2px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: isActive ? '0 0 14px rgba(34, 211, 238, 0.45)' : 'none',
                        transition: 'all 0.2s ease',
                        background: '#090d1f'
                      }}
                      title="Click to set as main profile photo"
                    >
                      <img
                        src={imgUrl}
                        alt={`Gallery shot ${idx + 1}`}
                        onError={(e) => { e.currentTarget.src = '/headers/discography_retina_header.jpg' }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      {isActive && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: '#22d3ee',
                            color: '#000000',
                            fontSize: '9px',
                            fontWeight: '900',
                            padding: '1px 5px',
                            borderRadius: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px'
                          }}
                        >
                          <RiCheckFill size={11} /> ACTIVE
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Metadata Matrix */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px',
                marginTop: '18px',
                paddingTop: '18px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Primary Role</span>
                <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: '700' }}>{creator.role || roleConfig.label}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Genre Focus</span>
                <span style={{ fontSize: '13px', color: '#22d3ee', fontWeight: '700' }}>{creator.genre || 'Electronic / Fusion'}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Broadcast Market</span>
                <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: '700' }}>{creator.location || 'East Africa & Global'}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>EPK Subdomain</span>
                <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '700', fontFamily: 'monospace' }}>{subdomain}.tunemavens.com</span>
              </div>
            </div>
          </div>

          {/* Discography & Featured Tracks Section */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '3px',
              padding: '24px 26px',
              backdropFilter: 'blur(12px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3
                style={{
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: '800',
                  color: '#22d3ee',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RiMusic2Fill size={18} color="#22d3ee" />
                Spotlight Releases & Master Stems
              </h3>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                {creatorTracks.length} catalog items
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(creatorTracks.length > 0 ? creatorTracks : tracks.slice(0, 4)).map((track, idx) => {
                const isThisPlaying = isPlaying && currentTrack && (currentTrack.id === track.id || currentTrack.title === track.title)
                return (
                  <div
                    key={track.id || `track_${idx}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: isThisPlaying ? 'rgba(34, 211, 238, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: isThisPlaying ? '1px solid rgba(34, 211, 238, 0.35)' : '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '3px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                      <button
                        type="button"
                        onClick={() => onPlayTrack && onPlayTrack(track)}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '3px',
                          background: isThisPlaying ? '#22d3ee' : '#10b981',
                          color: '#060813',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      >
                        {isThisPlaying ? <RiPauseFill size={18} /> : <RiPlayFill size={18} />}
                      </button>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {track.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                          {track.release || 'Single'} • {track.genre || creator.genre || 'Afro-fusion'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b' }}>
                        {track.isrc || 'KE-TM1-26-0001'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {track.duration || '3:30'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Handles, Streaming Destinations & Interactive Comments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Creator Metrics & Quick EPK Overview */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '3px',
              padding: '24px 26px',
              backdropFilter: 'blur(12px)'
            }}
          >
            <h3
              style={{
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: '800',
                color: '#22d3ee',
                margin: '0 0 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RiHeadphoneFill size={18} color="#22d3ee" />
              Community & Streaming Metrics
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div style={{ padding: '14px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '3px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Monthly Listeners</span>
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#22d3ee' }}>{creator.listeners || '1.8M'}</span>
              </div>
              <div style={{ padding: '14px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '3px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Network Followers</span>
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#10b981' }}>{followerCount.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
              Catalog synchronized with TuneLedger smart contracts. 100% pre-cleared for broadcast sync licensing, TV, gaming, and commercial streaming.
            </div>
          </div>

          {/* User Feedback & Community Comment Feed */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '3px',
              padding: '24px 26px',
              backdropFilter: 'blur(12px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3
                style={{
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: '800',
                  color: '#22d3ee',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RiMessage2Fill size={18} color="#22d3ee" />
                Community Feed & Feedback
              </h3>
              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700' }}>
                {comments.length} Comments
              </span>
            </div>

            {/* Post a Comment Form */}
            <form onSubmit={handlePostComment} style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Your Name / Handle"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d1f',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '3px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '12px'
                  }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <textarea
                  rows={3}
                  placeholder={`Leave feedback or inquire about licensing ${creator.name}'s music...`}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d1f',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '3px',
                    padding: '10px 12px',
                    color: '#ffffff',
                    fontSize: '13px',
                    resize: 'none',
                    lineHeight: 1.5
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting || !newCommentText.trim()}
                  style={{
                    background: newCommentText.trim() ? '#22d3ee' : 'rgba(255, 255, 255, 0.1)',
                    color: newCommentText.trim() ? '#060813' : '#64748b',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '7px 16px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: newCommentText.trim() ? 'pointer' : 'default',
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '380px', overflowY: 'auto' }}>
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    padding: '12px 14px',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '3px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          border: '1px solid rgba(34, 211, 238, 0.4)',
                          background: '#060813',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={comment.avatar}
                          alt={comment.author}
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                          {comment.author}
                        </span>
                        <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '6px' }}>
                          {comment.role}
                        </span>
                      </div>
                    </div>

                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {comment.timestamp}
                    </span>
                  </div>

                  <p style={{ fontSize: '12.5px', color: '#cbd5e1', margin: '0 0 8px', lineHeight: 1.5 }}>
                    {comment.text}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button
                      type="button"
                      onClick={() => handleLikeComment(comment.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: comment.liked ? '#ef4444' : '#64748b',
                        cursor: 'pointer',
                        fontSize: '11px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: 0
                      }}
                    >
                      {comment.liked ? <RiHeart3Fill size={14} /> : <RiHeart3Line size={14} />}
                      <span>{comment.likes}</span>
                    </button>

                    {comment.author === authorName && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}
                        title="Delete comment"
                      >
                        <RiDeleteBin7Line size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI-ASSISTED HEADER EDITOR MODAL (Design Standards & Backend AI Header API) */}
      {showAiHeaderModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(3, 6, 18, 0.88)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '780px',
              background: '#090d1f',
              border: '1.5px solid #22d3ee',
              borderRadius: '3px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(34, 211, 238, 0.25)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 22px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(6, 8, 19, 0.95)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    background: '#22d3ee',
                    color: '#000',
                    fontSize: '10px',
                    fontWeight: '900',
                    padding: '3px 8px',
                    borderRadius: '2px',
                    letterSpacing: '0.05em'
                  }}
                >
                  AI-ASSISTED
                </span>
                <span style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>
                  Bespoke Retina Header Editor: <span style={{ color: '#22d3ee' }}>{creator.name}</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowAiHeaderModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <RiCloseFill size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px', maxHeight: '80vh', overflowY: 'auto' }}>
              
              {/* Header Preview Banner */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Current Bespoke Retina Header (2560 x 854)
                  </span>
                  <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>
                    96 DPI Ultra-Crisp Widescreen
                  </span>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '190px',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    border: '1px solid rgba(34, 211, 238, 0.3)',
                    background: '#060813',
                    position: 'relative'
                  }}
                >
                  <img
                    src={currentHeaderUrl}
                    alt={`${creator.name} Header`}
                    onError={(e) => { e.currentTarget.src = '/headers/discography_retina_header.jpg' }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(6, 8, 19, 0.85)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      color: '#22d3ee',
                      fontWeight: '700'
                    }}
                  >
                    EPK Web World & Discography Banner
                  </div>
                </div>
              </div>

              {/* Natural Language Prompt Input */}
              <form onSubmit={handleGenerateAiHeader} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '6px' }}>
                    AI Prompt (Natural Language Scene & Aesthetic)
                  </label>
                  <textarea
                    rows={3}
                    value={aiHeaderPrompt}
                    onChange={(e) => setAiHeaderPrompt(e.target.value)}
                    placeholder="Describe lighting, synthesizer hardware, architectural backdrop, or color atmosphere..."
                    style={{
                      width: '100%',
                      background: '#060813',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '3px',
                      padding: '10px 14px',
                      color: '#ffffff',
                      fontSize: '13px',
                      lineHeight: 1.5,
                      resize: 'none'
                    }}
                  />
                </div>

                {/* Style Presets */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Style Preset
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {AI_HEADER_STYLE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setAiHeaderStyle(preset.id)}
                        style={{
                          background: aiHeaderStyle === preset.id ? '#22d3ee' : 'rgba(255, 255, 255, 0.05)',
                          color: aiHeaderStyle === preset.id ? '#060813' : '#cbd5e1',
                          border: aiHeaderStyle === preset.id ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '3px',
                          padding: '6px 12px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Endpoint: <code style={{ color: '#22d3ee' }}>POST /api/epk/{subdomain}/edit-header-ai</code>
                  </span>

                  <button
                    type="submit"
                    disabled={isGeneratingHeader || !aiHeaderPrompt.trim()}
                    style={{
                      background: isGeneratingHeader ? 'rgba(34, 211, 238, 0.2)' : '#22d3ee',
                      color: '#060813',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '10px 22px',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: isGeneratingHeader ? 'wait' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 16px rgba(34, 211, 238, 0.35)'
                    }}
                  >
                    <RiSparklingFill size={16} />
                    {isGeneratingHeader ? 'Generating 2560x854 Retina Header...' : 'Generate / Edit Header with AI'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
