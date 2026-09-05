import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  RiHomeFill, RiUserFill, RiCalendarEventFill, RiVideoFill,
  RiShoppingBagFill, RiFileTextFill, RiMailFill, RiHeartFill,
  RiPlayFill, RiPauseFill, RiDownloadFill,
  RiTicket2Fill, RiInstagramFill, RiYoutubeFill,
  RiSpotifyFill, RiAppleFill, RiTwitterXFill, RiDiscordFill, RiCheckFill,
  RiShoppingBasket2Fill, RiUserAddFill, RiShieldCheckFill,
  RiMusic2Fill, RiFileCopyFill, RiSearchLine, RiImageFill, RiArrowDownSLine,
  RiArrowLeftSLine, RiArrowRightSLine, RiThumbUpFill, RiMessage2Fill, RiAddFill, RiSubtractFill, RiDeleteBinFill,
  RiBankCardFill, RiCellphoneFill, RiDiscFill, RiArrowRightLine, RiMenuFill, RiCloseFill, RiSoundcloudFill,
  RiWhatsappFill, RiNotification3Fill, RiStarFill, RiPercentFill,
  RiStopFill, RiSkipBackFill, RiSkipForwardFill, RiSparklingFill,
  RiMapPin2Fill, RiTimeFill, RiQrCodeFill, RiCoinsFill, RiExchangeDollarLine
} from 'react-icons/ri'

import heroSlide1 from '../../assets/creator_hero_banner.jpg'
import heroSlide2 from '../../assets/creator_hero_slide2.jpg'
import heroSlide3 from '../../assets/creator_hero_slide3.jpg'

// 20 Pre-populated Theme Templates Specification
export const DEFAULT_PAGE_HEADERS = {
  discography: 'https://picsum.photos/seed/discography_banner/1400/450',
  bio: 'https://picsum.photos/seed/bio_banner/1400/450',
  shows: 'https://picsum.photos/seed/shows_banner/1400/450',
  store: 'https://picsum.photos/seed/store_banner/1400/450',
  media: 'https://picsum.photos/seed/media_banner/1400/450',
  press: 'https://picsum.photos/seed/press_banner/1400/450',
  contact: 'https://picsum.photos/seed/contact_banner/1400/450',
  pricing: 'https://picsum.photos/seed/pricing_banner/1400/450',
  'event-detail': 'https://picsum.photos/seed/shows_banner/1400/450',
  'album-detail': 'https://picsum.photos/seed/discography_banner/1400/450'
}

export const EPK_THEMES = [
  { id: 'cyberpunk', name: 'Cyberpunk Neon Grid', bg: 'linear-gradient(135deg, #0f0c20 0%, #1a0826 100%)', cardBg: 'rgba(25, 15, 45, 0.78)', accent: '#00f0ff', secondary: '#ff007f', font: 'Sansation, sans-serif' },
  { id: 'afrobeat', name: 'Afrobeat Gold & Bronze', bg: 'linear-gradient(135deg, #1f1406 0%, #2e1d09 100%)', cardBg: 'rgba(45, 30, 10, 0.82)', accent: '#ffb703', secondary: '#fb8500', font: 'Sansation, sans-serif' },
  { id: 'indie_mono', name: 'Indie Minimalist Mono', bg: '#121212', cardBg: 'rgba(30, 30, 30, 0.88)', accent: '#ffffff', secondary: '#a0a0a0', font: 'Sansation, sans-serif' },
  { id: 'dark_synth', name: 'Dark Synthwave Reel', bg: 'linear-gradient(135deg, #080811 0%, #141428 100%)', cardBg: 'rgba(20, 20, 45, 0.82)', accent: '#bd00ff', secondary: '#00e5ff', font: 'Sansation, sans-serif' },
  { id: 'pop_vibrant', name: 'Pop Vibrant Gradient', bg: 'linear-gradient(135deg, #18002e 0%, #3a0057 100%)', cardBg: 'rgba(60, 10, 90, 0.78)', accent: '#ff00aa', secondary: '#00fff0', font: 'Sansation, sans-serif' },
  { id: 'acoustic_wood', name: 'Acoustic Studio Wood', bg: 'linear-gradient(135deg, #1a1410 0%, #291c14 100%)', cardBg: 'rgba(40, 28, 20, 0.88)', accent: '#d4a373', secondary: '#faedcd', font: 'Sansation, sans-serif' },
  { id: 'hiphop_dark', name: 'Hip-Hop Studio Dark', bg: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)', cardBg: 'rgba(35, 35, 35, 0.92)', accent: '#e63946', secondary: '#f1faee', font: 'Sansation, sans-serif' },
  { id: 'electronic', name: 'Electronic Festival Lights', bg: 'linear-gradient(135deg, #051923 0%, #003554 100%)', cardBg: 'rgba(0, 50, 80, 0.78)', accent: '#00a6fb', secondary: '#0582ca', font: 'Sansation, sans-serif' },
  { id: 'retro_vinyl', name: 'Retro Vinyl Warmth', bg: 'linear-gradient(135deg, #2b1e1a 0%, #3d2720 100%)', cardBg: 'rgba(60, 40, 32, 0.88)', accent: '#e07a5f', secondary: '#f4f1de', font: 'Sansation, sans-serif' },
  { id: 'metal_crimson', name: 'Metal Crimson Steel', bg: 'linear-gradient(135deg, #140505 0%, #260a0a 100%)', cardBg: 'rgba(40, 15, 15, 0.9)', accent: '#ff1e1e', secondary: '#808080', font: 'Sansation, sans-serif' },
  { id: 'ambient_glass', name: 'Ambient Glassmorphic', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', cardBg: 'rgba(30, 41, 59, 0.78)', accent: '#38bdf8', secondary: '#818cf8', font: 'Sansation, sans-serif' },
  { id: 'lofi_chill', name: 'Lo-Fi Chill Sunset', bg: 'linear-gradient(135deg, #2a1b3d 0%, #44318d 100%)', cardBg: 'rgba(68, 49, 141, 0.78)', accent: '#e8a87c', secondary: '#c38d9e', font: 'Sansation, sans-serif' },
  { id: 'classical', name: 'Classical Elegance Gold', bg: 'linear-gradient(135deg, #111115 0%, #22222a 100%)', cardBg: 'rgba(35, 35, 45, 0.88)', accent: '#d4af37', secondary: '#f8f9fa', font: 'Sansation, sans-serif' },
  { id: 'rnb_velvet', name: 'R&B Velvet Midnight', bg: 'linear-gradient(135deg, #190a28 0%, #2c1347 100%)', cardBg: 'rgba(44, 19, 71, 0.82)', accent: '#c084fc', secondary: '#f472b6', font: 'Sansation, sans-serif' },
  { id: 'gospel_light', name: 'Gospel Light Sanctuary', bg: 'linear-gradient(135deg, #172554 0%, #1e3a8a 100%)', cardBg: 'rgba(30, 58, 138, 0.78)', accent: '#60a5fa', secondary: '#fef08a', font: 'Sansation, sans-serif' },
  { id: 'reggae_roots', name: 'Reggae Roots Emerald', bg: 'linear-gradient(135deg, #062c19 0%, #0d472a 100%)', cardBg: 'rgba(13, 71, 42, 0.88)', accent: '#22c55e', secondary: '#eab308', font: 'Sansation, sans-serif' },
  { id: 'punk_disrupt', name: 'Punk Disrupt Neon', bg: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)', cardBg: 'rgba(41, 37, 36, 0.9)', accent: '#ccff00', secondary: '#ff0055', font: 'Sansation, sans-serif' },
  { id: 'jazz_lounge', name: 'Jazz Lounge Smoked', bg: 'linear-gradient(135deg, #1c140e 0%, #2e2017 100%)', cardBg: 'rgba(46, 32, 23, 0.88)', accent: '#fbbf24', secondary: '#d97706', font: 'Sansation, sans-serif' },
  { id: 'experimental', name: 'Experimental Glitch', bg: 'linear-gradient(135deg, #030712 0%, #111827 100%)', cardBg: 'rgba(17, 24, 39, 0.9)', accent: '#a855f7', secondary: '#06b6d4', font: 'Sansation, sans-serif' },
  { id: 'future_bass', name: 'Future Bass Spectrum', bg: 'linear-gradient(135deg, #0f172a 0%, #311b92 100%)', cardBg: 'rgba(49, 27, 146, 0.78)', accent: '#ec4899', secondary: '#3b82f6', font: 'Sansation, sans-serif' },
]

export function CreatorEpkView(props = {}) {
  const { username } = useParams()
  const navigate = useNavigate()

  const passedEpk = props.creatorEpk
  const lastSavedSub = (typeof localStorage !== 'undefined' ? localStorage.getItem('last_saved_epk_subdomain') : null) || ''
  const passedSlug = (passedEpk?.subdomain || '').toLowerCase().trim()
  // Prioritize URL username, then last saved EPK subdomain (e.g. ndufo), then session user, then passedEpk (if not generic kip/aisha), then 'ndufo'
  const fallbackUsername = (lastSavedSub && lastSavedSub !== 'kip' && lastSavedSub !== 'aisha')
    ? lastSavedSub
    : (props.sessionUser?.username || (passedSlug && passedSlug !== 'kip' && passedSlug !== 'aisha' ? passedSlug : 'ndufo'))
  const effectiveUsername = username || fallbackUsername
  const rawArtistName = effectiveUsername ? effectiveUsername.replace(/[-_]/g, ' ') : 'Ndufo'
  const artistName = rawArtistName.charAt(0).toUpperCase() + rawArtistName.slice(1)
  const artistSlug = effectiveUsername.toLowerCase().replace(/[^a-z0-9]/g, '')

  // Navigation Tab Mapper (ensures 'Music', 'Booking', 'Shows' etc. map seamlessly to their views)
  const mapTabKey = (label) => {
    const k = (label || '').toLowerCase().trim()
    if (k === 'music' || k === 'discography' || k === 'tracks' || k === 'songs' || k === 'albums') return 'discography'
    if (k === 'booking' || k === 'book' || k === 'contact' || k === 'inquiries' || k === 'inquiry') return 'contact'
    if (k === 'shows' || k === 'tour' || k === 'events' || k === 'dates' || k === 'live') return 'shows'
    if (k === 'bio' || k === 'about' || k === 'story') return 'bio'
    if (k === 'press' || k === 'epk' || k === 'news') return 'press'
    if (k === 'media' || k === 'videos' || k === 'photos' || k === 'gallery') return 'media'
    if (k === 'store' || k === 'shop' || k === 'merch') return 'store'
    return k || 'home'
  }

  // Navigation & Sticky Header State
  const [activeTab, setActiveTab] = useState('home')
  const [mediaFilter, setMediaFilter] = useState('all')
  const [selectedTheme, setSelectedTheme] = useState(EPK_THEMES[0])
  const [epkData, setEpkData] = useState(() => {
    if (passedEpk && typeof passedEpk === 'object') {
      const passedSlug = (passedEpk.subdomain || '').toLowerCase().replace(/[^a-z0-9]/g, '')
      if (!username || passedSlug === artistSlug) {
        return passedEpk
      }
    }
    try {
      const local = localStorage.getItem(`epk_public_${artistSlug}`) || localStorage.getItem(`epk_${artistSlug}`)
      if (local) return JSON.parse(local)
      if (!username) {
        const lastSaved = localStorage.getItem('last_saved_epk_data')
        if (lastSaved) return JSON.parse(lastSaved)
      }
      return null
    } catch {
      return null
    }
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTrack, setActiveTrack] = useState({ id: 1, title: 'Nairobi Cyberwave (Master)', isrc: 'KE-TM1-26-00042', duration: '3:45', priceCredits: 50 })
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Smart CRM Contact & Lead Generation State
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactInquiryType, setContactInquiryType] = useState('booking')
  const [contactMessage, setContactMessage] = useState('')
  const [contactEventDate, setContactEventDate] = useState('')
  const [contactBudget, setContactBudget] = useState('')
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const [contactError, setContactError] = useState('')

  // Fetch Public EPK Profile with Local Storage Fallback
  useEffect(() => {
    const fetchPublicEpk = async () => {
      try {
        const passedSlug = (passedEpk?.subdomain || '').toLowerCase().replace(/[^a-z0-9]/g, '')
        if (passedEpk && typeof passedEpk === 'object' && (!username || passedSlug === artistSlug)) {
          setEpkData(prev => ({ ...(prev || {}), ...passedEpk }))
          if (passedEpk.themeBg) {
            const matchedTheme = EPK_THEMES.find(t => t.bg === passedEpk.themeBg)
            if (matchedTheme) setSelectedTheme(matchedTheme)
          }
        }
        const local = localStorage.getItem(`epk_public_${artistSlug}`) || localStorage.getItem(`epk_${artistSlug}`)
        if (local) {
          try {
            const parsed = JSON.parse(local)
            setEpkData(prev => ({ ...(prev || {}), ...parsed }))
            if (parsed.themeBg) {
              const matchedTheme = EPK_THEMES.find(t => t.bg === parsed.themeBg)
              if (matchedTheme) setSelectedTheme(matchedTheme)
            }
          } catch (_) {}
        }
        const res = await fetch(`/api/epk/public/${artistSlug}`)
        if (res.ok) {
          const data = await res.json()
          if (data && typeof data === 'object') {
            setEpkData(prev => ({ ...(prev || {}), ...data }))
            if (data.themeBg) {
              const matchedTheme = EPK_THEMES.find(t => t.bg === data.themeBg)
              if (matchedTheme) setSelectedTheme(matchedTheme)
            }
          }
        } else {
          const cmsRes = await fetch(`/api/cms/epk/${artistSlug}`)
          if (cmsRes.ok) {
            const cmsLayout = await cmsRes.json()
            if (cmsLayout?.data) {
              setEpkData(prev => ({ ...(prev || {}), ...cmsLayout.data }))
              if (cmsLayout.data.themeBg) {
                const matchedTheme = EPK_THEMES.find(t => t.bg === cmsLayout.data.themeBg)
                if (matchedTheme) setSelectedTheme(matchedTheme)
              }
            }
          }
        }
      } catch (err) {
        console.warn('Could not load public EPK profile:', err)
      }
    }
    fetchPublicEpk()
  }, [artistSlug, passedEpk, username])

  // Google Font Dynamic Loader
  useEffect(() => {
    const rawFont = epkData?.fontFamily || ''
    const fontName = rawFont.split(',')[0]?.replace(/['"]/g, '').trim()
    const systemFonts = ['Sansation', 'sans-serif', 'serif', 'monospace', 'Arial', 'Helvetica', 'Times New Roman']
    if (fontName && !systemFonts.includes(fontName)) {
      const linkId = 'custom-epk-google-font'
      let link = document.getElementById(linkId)
      if (!link) {
        link = document.createElement('link')
        link.id = linkId
        link.rel = 'stylesheet'
        document.head.appendChild(link)
      }
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;600;700;800;900&display=swap`
    }
  }, [epkData?.fontFamily])

  // Computed layout and theme variables
  // Robust Logo Resolver: prioritizes the freshest uploaded logo
  // Resolve distinct page header image
  const getPageHeader = (pageKey) => {
    return epkData?.pageHeaders?.[pageKey] || DEFAULT_PAGE_HEADERS[pageKey] || currentSlide?.img || heroSlide1
  }

  const resolveLogo = () => {
    try {
      // 1. Check wizard draft first (freshest user action in this session)
      const draft = localStorage.getItem('epk_wizard_draft')
      if (draft) {
        const pd = JSON.parse(draft)
        const d = pd?.data || pd
        const draftSub = (d?.subdomain || '').toLowerCase().replace(/[^a-z0-9]/g, '')
        if ((!artistSlug || draftSub === artistSlug || draftSub === 'ndufo') && d?.logoUrl && typeof d.logoUrl === 'string' && d.logoUrl.trim().length > 0) {
          return d.logoUrl
        }
      }
    } catch (_) {}

    // 2. Direct from epkData
    if (epkData?.logoUrl && typeof epkData.logoUrl === 'string' && epkData.logoUrl.trim().length > 0) {
      return epkData.logoUrl
    }

    // 3. Local caches
    try {
      const p1 = localStorage.getItem(`epk_public_${artistSlug}`)
      if (p1) { const d = JSON.parse(p1); if (d?.logoUrl) return d.logoUrl }
      const p2 = localStorage.getItem(`epk_${artistSlug}`)
      if (p2) { const d = JSON.parse(p2); if (d?.logoUrl) return d.logoUrl }
      const last = localStorage.getItem('last_saved_epk_data')
      if (last) { const d = JSON.parse(last); if (d?.logoUrl) return d.logoUrl }
      const s1 = sessionStorage.getItem('brandkit_logo_url') || sessionStorage.getItem('ported_asset_url')
      if (s1) return s1
    } catch (_) {}
    return null
  }
  const effectiveLogoUrl = resolveLogo()
  const effectiveArtistName = epkData?.siteName || epkData?.artist_name || artistName
  const effectiveHeadline = epkData?.tagline || epkData?.headline || 'Official Standalone Creator Web World • Lossless Audio & Intermaven Split Engine'
  const effectiveBio = epkData?.bio || 'Independent creator on the TuneMavens & Intermaven network.'

  // Dynamic Browser Title for SEO
  useEffect(() => {
    if (effectiveArtistName) {
      document.title = `${effectiveArtistName} | ${epkData?.tagline || 'Official Creator Web World'}`
    }
  }, [effectiveArtistName, epkData?.tagline])
  const effectiveThemeMode = epkData?.themeMode || 'dark'
  const isLight = effectiveThemeMode === 'light'
  const effectiveAccent = epkData?.accentColor || selectedTheme.accent || '#00f0ff'
  const effectiveSecondary = epkData?.secondaryColor || selectedTheme.secondary || '#ff007f'
  const effectiveBg = epkData?.themeBg || (isLight ? '#f8fafc' : selectedTheme.bg)
  const effectiveFont = epkData?.fontFamily || "'Sansation', sans-serif"
  const effectiveWidth = epkData?.layoutWidth || 'wide'
  const effectiveVariant = epkData?.layoutVariant || 'logo-left'
  const maxContentWidth = effectiveWidth === 'boxed' ? '960px' : effectiveWidth === 'wide' ? '1280px' : '100%'

  const handleReturnToBuilder = () => {
    sessionStorage.setItem('preferred_dashboard_tab', 'epk-builder')
    navigate('/dashboard')
  }

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) setScrolled(true)
      else setScrolled(false)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dynamic Hero Slides Carousel with 3-line Music Business titles
  const heroSlides = React.useMemo(() => {
    const validHeroImages = Array.isArray(epkData?.heroImages) ? epkData.heroImages.filter(Boolean) : []
    const baseTitle1 = epkData?.heroTitle1 || effectiveArtistName
    const baseTitle2 = epkData?.heroTitle2 || effectiveHeadline
    const baseTitle3 = epkData?.heroTitle3 || "100% Pre-Cleared One-Stop Sync Licensing & Master Stems • TuneStream"

    if (validHeroImages.length > 0) {
      return validHeroImages.map((imgUrl, idx) => ({
        id: idx + 1,
        img: imgUrl,
        title1: idx === 0 ? baseTitle1 : (idx === 1 ? 'World Tour 2026 Live Showcase' : `${effectiveArtistName} — Lossless Audio`),
        title2: idx === 0 ? baseTitle2 : (idx === 1 ? 'Headline Dates: Tokyo, London & Nairobi' : '24-Bit / 96kHz Multitrack Stems'),
        title3: idx === 0 ? baseTitle3 : (idx === 1 ? 'VIP Fan Pass & Direct Ticketing via TuneBooking' : 'Instant Sync Clearance on SyncMavens'),
        title: baseTitle1,
        subtitle: baseTitle2
      }))
    }
    if (epkData?.heroImageUrl) {
      return [
        { id: 1, img: epkData.heroImageUrl, title1: baseTitle1, title2: baseTitle2, title3: baseTitle3, title: baseTitle1, subtitle: baseTitle2 }
      ]
    }
    if (artistSlug === 'kip') {
      return [
        { id: 1, img: heroSlide1, title1: baseTitle1, title2: baseTitle2, title3: baseTitle3, title: baseTitle1, subtitle: baseTitle2 },
        { id: 2, img: heroSlide2, title1: 'World Tour 2026 Live Showcase', title2: 'Live at Nairobi Cyberdome, London O2 & Brooklyn Steel', title3: 'Direct Fan Ticketing via TuneBooking • Reserved Seating', title: 'World Tour 2026', subtitle: 'Live at Nairobi Cyberdome, London O2 Academy & Brooklyn Steel' },
        { id: 3, img: heroSlide3, title1: 'Exclusive Studio Stems', title2: 'Unreleased 24-Bit WAV Multitracks Available for Credits', title3: 'Transparent Publishing Splits & PRO Collection via Intermaven Ledger', title: 'Exclusive Studio Stems', subtitle: 'Unreleased 24-Bit WAV Multitracks Available for Intermaven Credits' }
      ]
    }
    return [
      { id: 1, img: null, title1: baseTitle1, title2: baseTitle2, title3: baseTitle3, title: baseTitle1, subtitle: baseTitle2 }
    ]
  }, [epkData?.heroImages, epkData?.heroImageUrl, epkData?.heroTitle1, epkData?.heroTitle2, epkData?.heroTitle3, effectiveArtistName, effectiveHeadline, artistSlug])

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  useEffect(() => {
    if (!heroSlides || heroSlides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [heroSlides])

  useEffect(() => {
    if (heroSlides && currentSlideIndex >= heroSlides.length) {
      setCurrentSlideIndex(0)
    }
  }, [heroSlides, currentSlideIndex])

  const safeSlideIndex = (currentSlideIndex >= 0 && currentSlideIndex < (heroSlides?.length || 0)) ? currentSlideIndex : 0
  const currentSlide = (heroSlides && heroSlides[safeSlideIndex]) || (heroSlides && heroSlides[0]) || {
    id: 1,
    img: artistSlug === 'kip' ? heroSlide1 : null,
    title: effectiveArtistName,
    subtitle: effectiveHeadline
  }

  // Media Dropdown Toggle
  const [mediaDropdownOpen, setMediaDropdownOpen] = useState(false)

  // Landing Page Video Carousel Index State
  const [landingVideoIndex, setLandingVideoIndex] = useState(0)

  // Fan Session State
  const [fanUser, setFanUser] = useState(() => {
    try {
      const saved = localStorage.getItem(`fan_session_${artistSlug}`) || sessionStorage.getItem('tunemavens_session')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authEmail, setAuthEmail] = useState('')
  const [authName, setAuthName] = useState('')
  const [fanInterests, setFanInterests] = useState({
    unreleasedAudio: true,
    presaleCodes: true,
    merchDrops: true,
    meetAndGreet: false
  })

  // Fan Communication & CRM Ingestion State
  const [authPhone, setAuthPhone] = useState('')
  const [authCommMethod, setAuthCommMethod] = useState('email')
  const [authSelectedInterests, setAuthSelectedInterests] = useState([
    'VIP Tour Pre-Sales & Discounts',
    'Unreleased WAV Master Stems',
    'Exclusive Fan Club Merch Drops'
  ])
  const [pendingComment, setPendingComment] = useState(null)
  const [authMode, setAuthMode] = useState('signup') // 'signup' | 'login'
  const [authLoginEmail, setAuthLoginEmail] = useState('')
  const [authLoginPass, setAuthLoginPass] = useState('')

  // Toast Notification System
  const [toasts, setToasts] = useState([])
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  // Hero Music Player & Cycling Playlist State
  const [playlistIndex, setPlaylistIndex] = useState(0)
  const [playbackProgress, setPlaybackProgress] = useState(45) // seconds
  const [selectedTrackModal, setSelectedTrackModal] = useState(null)

  // Event Page Full Page & Purchasing Protocol State
  const [selectedEventDetail, setSelectedEventDetail] = useState(null)
  const [eventTier, setEventTier] = useState('ga')
  const [eventQty, setEventQty] = useState(1)
  const [eventPaymentGateway, setEventPaymentGateway] = useState('card') // 'card' | 'credits' | 'mpesa' | 'pesapal'
  const [eventCardName, setEventCardName] = useState('')
  const [eventCardNumber, setEventCardNumber] = useState('')
  const [eventCardExp, setEventCardExp] = useState('')
  const [eventCardCvc, setEventCardCvc] = useState('')
  const [eventCardZip, setEventCardZip] = useState('')
  const [eventCardCountry, setEventCardCountry] = useState('United States')
  const [eventMpesaPhone, setEventMpesaPhone] = useState('')
  const [eventTicketSuccess, setEventTicketSuccess] = useState(null)
  const [eventPurchasing, setEventPurchasing] = useState(false)

  // Album Page Full Page State
  const [selectedAlbumDetail, setSelectedAlbumDetail] = useState(null)

  // Buy Stems Full Workflow State
  const [stemsModalTrack, setStemsModalTrack] = useState(null)
  const [stemsPackageType, setStemsPackageType] = useState('full') // 'full' | 'instrumental' | 'acapella' | 'sync'
  const [stemsPaymentMethod, setStemsPaymentMethod] = useState('credits') // 'credits' | 'card' | 'mpesa'
  const [stemsCardName, setStemsCardName] = useState('')
  const [stemsCardNumber, setStemsCardNumber] = useState('')
  const [stemsCardExp, setStemsCardExp] = useState('')
  const [stemsCardCvc, setStemsCardCvc] = useState('')
  const [stemsCardZip, setStemsCardZip] = useState('')
  const [stemsPurchased, setStemsPurchased] = useState(null)
  const [stemsProcessing, setStemsProcessing] = useState(false)

  // Product Image Carousel Indices
  const [productImageIndices, setProductImageIndices] = useState({})

  // Event Page & Flyer Modal State (Legacy fallback)
  const [selectedEventModal, setSelectedEventModal] = useState(null)

  // Product Details & Custom Options Modal State
  const [selectedProductModal, setSelectedProductModal] = useState(null)
  const [selectedProductSize, setSelectedProductSize] = useState('M')
  const [selectedProductColor, setSelectedProductColor] = useState('Onyx Black')
  const [selectedProductEdition, setSelectedProductEdition] = useState('standard')
  const [merchCheckoutOpen, setMerchCheckoutOpen] = useState(false)
  const [promoCodeInput, setPromoCodeInput] = useState('')
  const [appliedPromoDiscount, setAppliedPromoDiscount] = useState(0)
  const [merchPaymentGateway, setMerchPaymentGateway] = useState('stripe')
  const [merchCardNumber, setMerchCardNumber] = useState('')
  const [merchCardExp, setMerchCardExp] = useState('')
  const [merchCardCvc, setMerchCardCvc] = useState('')
  const [merchMpesaPhone, setMerchMpesaPhone] = useState('')
  const [merchOrderConfirmed, setMerchOrderConfirmed] = useState(null)

  // Fan Pricing & Credits Top-Up State
  const [pricingModalOpen, setPricingModalOpen] = useState(false)
  const [selectedCreditPack, setSelectedCreditPack] = useState(null)
  const [creditPaymentGateway, setCreditPaymentGateway] = useState('stripe')
  const [creditCardNumber, setCreditCardNumber] = useState('')
  const [creditCardExp, setCreditCardExp] = useState('')
  const [creditCardCvc, setCreditCardCvc] = useState('')
  const [creditMpesaPhone, setCreditMpesaPhone] = useState('')
  const [creditProcessing, setCreditProcessing] = useState(false)

  // Comprehensive Fan Portal Modal State
  const [fanPortalOpen, setFanPortalOpen] = useState(false)
  const [fanPortalTab, setFanPortalTab] = useState('vault')
  const [fanVotedSong, setFanVotedSong] = useState(null)
  const [fanQuestionText, setFanQuestionText] = useState('')
  const [fanQuestionSent, setFanQuestionSent] = useState(false)
  const [copiedPromo, setCopiedPromo] = useState(false)

  // Photo Gallery Lightbox Carousel State
  const [galleryModalOpen, setGalleryModalOpen] = useState(false)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)

  const defaultTracks = [
    { id: 1, title: 'Nairobi Cyberwave (Master)', isrc: 'KE-TM1-26-00042', streams: '3.4M', duration: '3:45', release: 'Single 2026', priceCredits: 50, coverArt: 'https://picsum.photos/seed/cyberwave_master/600/600' },
    { id: 2, title: 'Sunset over Rift Valley', isrc: 'KE-TM1-26-00043', streams: '1.8M', duration: '4:12', release: 'Album 2026', priceCredits: 50, coverArt: 'https://picsum.photos/seed/riftvalley_master/600/600' },
    { id: 3, title: 'Afro-Synth Cascade', isrc: 'KE-TM1-26-00044', streams: '940K', duration: '3:18', release: 'Single 2025', priceCredits: 40, coverArt: 'https://picsum.photos/seed/afrosynth_master/600/600' },
    { id: 4, title: 'Midnight Mara Starlight', isrc: 'KE-TM1-26-00045', streams: '2.1M', duration: '5:02', release: 'EP 2025', priceCredits: 60, coverArt: 'https://picsum.photos/seed/marastarlight_master/600/600' }
  ]
  const rawTracks = (epkData?.tracks && Array.isArray(epkData.tracks) && epkData.tracks.length > 0) ? epkData.tracks : defaultTracks
  const tracks = rawTracks.map((t, idx) => ({
    ...t,
    id: t.id || idx + 1,
    coverArt: t.coverArt || t.cover || `https://picsum.photos/seed/${encodeURIComponent(t.title || 'single')}/600/600`
  }))

  // Playback timer & playlist auto-cycle
  useEffect(() => {
    let interval = null
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackProgress(prev => {
          if (prev >= 225) {
            // Auto-advance to next track in playlist
            setPlaylistIndex(curr => (curr + 1) % (tracks?.length || 1))
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, tracks?.length])

  // Payment Gateway Protocol Selection
  const [paymentGateway, setPaymentGateway] = useState('pesapal')

  // Commerce & Cart State
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productSize, setProductSize] = useState('M')
  const [storeCategory, setStoreCategory] = useState('all')
  const [storeSearch, setStoreSearch] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [shippingName, setShippingName] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')

  // Credit Balance Purchase Simulation
  const [userCredits, setUserCredits] = useState(250)
  const [creditPurchaseSuccess, setCreditPurchaseSuccess] = useState(null)

  // Shows Search & Ticketing System State
  const [showsSearch, setShowsSearch] = useState('')
  const [showsPage, setShowsPage] = useState(1)
  const [selectedShow, setSelectedShow] = useState(null)
  const [ticketTier, setTicketTier] = useState('ga')
  const [ticketQty, setTicketQty] = useState(1)
  const [ticketEmail, setTicketEmail] = useState('')
  const [ticketSuccess, setTicketSuccess] = useState(null)

  // Media Gallery & Discography State
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [selectedAlbumModal, setSelectedAlbumModal] = useState(null)
  const [discographySearch, setDiscographySearch] = useState('')
  const [discographyPage, setDiscographyPage] = useState(1)

  const [mediaComments, setMediaComments] = useState({
    301: [{ author: 'KipFan99', text: 'This video production quality is unreal!', likes: 14 }],
    302: [{ author: 'Aisha_Lover', text: 'The stage lighting at Nairobi Cyberdome was electric!', likes: 9 }]
  })
  const [newCommentText, setNewCommentText] = useState('')
  const [mediaSearch, setMediaSearch] = useState('')

  // Full Discography Collection
  const albums = [
    { id: 401, title: 'Nairobi Cyberwave (Deluxe LP)', year: '2026', type: 'Album', tracksCount: 12, cover: 'https://picsum.photos/seed/album1_epk/400', streams: '3.4M', isrc: 'KE-TM1-26-00042', priceCredits: 50 },
    { id: 402, title: 'Rift Valley Soundscapes', year: '2026', type: 'Album', tracksCount: 10, cover: 'https://picsum.photos/seed/album2_epk/400', streams: '1.8M', isrc: 'KE-TM1-26-00043', priceCredits: 50 },
    { id: 403, title: 'Afro-Synth Cascade', year: '2025', type: 'Single', tracksCount: 2, cover: 'https://picsum.photos/seed/album3_epk/400', streams: '940K', isrc: 'KE-TM1-26-00044', priceCredits: 40 },
    { id: 404, title: 'Midnight Mara Starlight', year: '2025', type: 'EP', tracksCount: 5, cover: 'https://picsum.photos/seed/album4_epk/400', streams: '2.1M', isrc: 'KE-TM1-26-00045', priceCredits: 45 },
    { id: 405, title: 'Mombasa Neon Nights', year: '2024', type: 'Album', tracksCount: 14, cover: 'https://picsum.photos/seed/album5_epk/400', streams: '4.2M', isrc: 'KE-TM1-24-00010', priceCredits: 50 },
    { id: 406, title: 'Savannah Electric Stems', year: '2024', type: 'Remix EP', tracksCount: 6, cover: 'https://picsum.photos/seed/album6_epk/400', streams: '1.1M', isrc: 'KE-TM1-24-00011', priceCredits: 40 }
  ]



  const shows = [
    { 
      id: 101, 
      date: 'SEP 18, 2026', 
      venue: 'Nairobi Cyberdome', 
      city: 'Nairobi, Kenya', 
      priceGA: 25, 
      priceVIP: 50, 
      priceMeet: 99, 
      status: 'On Sale',
      doors: '7:00 PM EAT',
      age: '18+ with Valid Government ID',
      lineup: `${effectiveArtistName} (Full Modular Live Set) • Support: Aisha Okoro & DJ Kipsang`,
      flyerImg: 'https://picsum.photos/seed/flyer1_cyberdome/600/900',
      description: 'The inaugural opening night of the 2026 World Tour. Featuring 360-degree holographic laser visuals and live modular synthesizer improvisation.',
      venueMapUrl: 'https://maps.google.com/?q=Nairobi+Kenya'
    },
    { 
      id: 102, 
      date: 'OCT 04, 2026', 
      venue: 'London O2 Academy', 
      city: 'London, UK', 
      priceGA: 38, 
      priceVIP: 75, 
      priceMeet: 140, 
      status: 'Selling Fast',
      doors: '6:30 PM BST',
      age: '16+ (Under 18s must be accompanied by an adult)',
      lineup: `${effectiveArtistName} • Special Guest: London Synth Ensemble`,
      flyerImg: 'https://picsum.photos/seed/flyer2_london/600/900',
      description: 'A transcendent night in London showcasing the full Nairobi Cyberwave album with live orchestral string accompaniment.',
      venueMapUrl: 'https://maps.google.com/?q=O2+Academy+London'
    },
    { 
      id: 103, 
      date: 'OCT 22, 2026', 
      venue: 'Brooklyn Steel', 
      city: 'New York, US', 
      priceGA: 35, 
      priceVIP: 70, 
      priceMeet: 125, 
      status: 'On Sale',
      doors: '7:00 PM EDT',
      age: '21+ Only',
      lineup: `${effectiveArtistName} • Direct Support: Brooklyn Modular Collective`,
      flyerImg: 'https://picsum.photos/seed/flyer3_brooklyn/600/900',
      description: 'An exclusive US East Coast headline appearance featuring 24-bit multitrack stem listening stations in the VIP mezzanine.',
      venueMapUrl: 'https://maps.google.com/?q=Brooklyn+Steel+New+York'
    },
    { 
      id: 104, 
      date: 'NOV 12, 2026', 
      venue: 'Tokyo Shibuya Club Quattro', 
      city: 'Tokyo, Japan', 
      priceGA: 45, 
      priceVIP: 90, 
      priceMeet: 160, 
      status: 'Limited VIP',
      doors: '6:00 PM JST',
      age: 'All Ages Welcome',
      lineup: `${effectiveArtistName} • Tokyo Audio Visual Project`,
      flyerImg: 'https://picsum.photos/seed/flyer4_tokyo/600/900',
      description: 'Immersive soundscapes in Shibuya. Features an exclusive Japanese tour vinyl slipmat for all VIP passholders.',
      venueMapUrl: 'https://maps.google.com/?q=Club+Quattro+Tokyo'
    },
    { 
      id: 105, 
      date: 'DEC 01, 2026', 
      venue: 'Berlin Watergate Club', 
      city: 'Berlin, Germany', 
      priceGA: 32, 
      priceVIP: 65, 
      priceMeet: 110, 
      status: 'On Sale',
      doors: '11:00 PM CET (Late Night Set)',
      age: '18+',
      lineup: `${effectiveArtistName} (Extended 3-Hour Modular Live Cut)`,
      flyerImg: 'https://picsum.photos/seed/flyer5_berlin/600/900',
      description: 'Overlooking the Spree river. Deep Afro-Synth cascading basslines tuned specifically for the club sound installation.',
      venueMapUrl: 'https://maps.google.com/?q=Watergate+Club+Berlin'
    },
    { 
      id: 106, 
      date: 'DEC 15, 2026', 
      venue: 'Paris Le Bataclan', 
      city: 'Paris, France', 
      priceGA: 30, 
      priceVIP: 60, 
      priceMeet: 105, 
      status: 'Selling Fast',
      doors: '7:30 PM CET',
      age: '16+',
      lineup: `${effectiveArtistName} • Paris Sync Residency Showcase`,
      flyerImg: 'https://picsum.photos/seed/flyer6_paris/600/900',
      description: 'The official European tour finale. Featuring live sync licensing demonstrations and guest collaborations.',
      venueMapUrl: 'https://maps.google.com/?q=Bataclan+Paris'
    }
  ]

  const products = [
    { 
      id: 201, 
      title: 'Nairobi Cyberwave Limited 180g Vinyl LP', 
      price: '$34.99', 
      numPrice: 34.99, 
      img: 'https://picsum.photos/seed/vinyl_epk/600/600',
      images: [
        'https://picsum.photos/seed/vinyl_front/800/800',
        'https://picsum.photos/seed/vinyl_gatefold/800/800',
        'https://picsum.photos/seed/vinyl_disc_neon/800/800'
      ], 
      category: 'vinyl', 
      hasSizes: false,
      editions: [
        { id: 'standard', name: 'Standard 180g Heavyweight Black', addPrice: 0 },
        { id: 'glow', name: 'Limited Neon Glow-in-the-Dark Vinyl', addPrice: 5 },
        { id: 'boxset', name: 'Signed Deluxe Gatefold Box Set + Poster', addPrice: 20 }
      ],
      stock: '14 copies remaining',
      desc: 'Mastered directly from 24-bit/96kHz analog tapes. Includes high-gloss lyric sleeve and digital stem download voucher.'
    },
    { 
      id: 202, 
      title: 'Intermaven Tour Heavyweight Hoodie', 
      price: '$59.99', 
      numPrice: 59.99, 
      img: 'https://picsum.photos/seed/hoodie_epk/600/600',
      images: [
        'https://picsum.photos/seed/hoodie_front/800/800',
        'https://picsum.photos/seed/hoodie_back/800/800',
        'https://picsum.photos/seed/hoodie_detail/800/800'
      ], 
      category: 'apparel', 
      hasSizes: true,
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      colors: ['Onyx Black', 'Cyber Teal', 'Studio White'],
      stock: 'In Stock - Ready to ship',
      desc: 'Custom 450 GSM French terry cotton with embroidered chest emblem and silk-screened tour schedule back print.'
    },
    { 
      id: 203, 
      title: 'Lossless 24-Bit WAV Multitrack Stems Pack', 
      price: '$19.99', 
      numPrice: 19.99, 
      img: 'https://picsum.photos/seed/stems_epk/600/600',
      images: [
        'https://picsum.photos/seed/stems_daw/800/800',
        'https://picsum.photos/seed/stems_tracks/800/800',
        'https://picsum.photos/seed/stems_meter/800/800'
      ], 
      category: 'stems', 
      hasSizes: false,
      licenseTiers: [
        { id: 'personal', name: 'Personal Listening WAV (96kHz)', addPrice: 0 },
        { id: 'remix', name: 'Producer / Remix Commercial License', addPrice: 20 },
        { id: 'broadcast', name: 'Film & Advertising One-Stop Sync License', addPrice: 50 }
      ],
      stock: 'Instant Digital Download',
      desc: 'Complete lossless multitracks (Drums, Bass, Synths, Lead Vocals, Backing Vocals, FX) in 24-bit / 96kHz broadcast WAV.'
    },
    { 
      id: 204, 
      title: 'TuneMavens Collector VIP Tour Pass & Box Set', 
      price: '$89.99', 
      numPrice: 89.99, 
      img: 'https://picsum.photos/seed/tourpass_epk/600/600',
      images: [
        'https://picsum.photos/seed/boxset_box/800/800',
        'https://picsum.photos/seed/boxset_laminate/800/800',
        'https://picsum.photos/seed/boxset_cassette/800/800'
      ], 
      category: 'collectors', 
      hasSizes: false,
      editions: [
        { id: 'standard_box', name: 'Deluxe Collector Laminate + Patch', addPrice: 0 },
        { id: 'signed_box', name: 'Hand-Signed Limited Edition (Numbered)', addPrice: 25 }
      ],
      stock: 'Only 25 remaining',
      desc: 'Includes custom NFC metal tour laminate, signed commemorative poster, unreleased demo USB cassette, and 500 TM Credits.'
    }
  ]


  // Media Items with Backend Configured YouTube Video Streaming URLs
  const mediaItems = [
    { id: 301, type: 'video', title: `${artistName} — Nairobi Cyberwave (Official 4K Music Video)`, youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/yt_vid1/600/340', views: '1.2M views' },
    { id: 302, type: 'gallery', title: 'Live at Nairobi Cyberdome Stage Highlight', thumbnail: 'https://picsum.photos/seed/gal1/600/340', views: 'Photo Gallery' },
    { id: 303, type: 'video', title: 'Live at SyncMavens Vault (Full Concert 4K)', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/yt_vid2/600/340', views: '840K views' },
    { id: 304, type: 'gallery', title: 'Behind the Scenes: Recording Stems at Intermaven Studio', thumbnail: 'https://picsum.photos/seed/gal2/600/340', views: 'Photo Gallery' },
    { id: 305, type: 'video', title: 'Inside the Synthesizer Soundscapes', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/yt_vid3/600/340', views: '320K views' },
    { id: 306, type: 'gallery', title: 'London O2 Backstage Session', thumbnail: 'https://picsum.photos/seed/gal3/600/340', views: 'Photo Gallery' }
  ]

  const videoCarouselItems = mediaItems.filter(m => m.type === 'video')
  const safeVideoIndex = (landingVideoIndex >= 0 && landingVideoIndex < videoCarouselItems.length) ? landingVideoIndex : 0
  const currentVideoItem = videoCarouselItems[safeVideoIndex] || videoCarouselItems[0] || {
    id: 301,
    type: 'video',
    title: `${artistName} — Official Video`,
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://picsum.photos/seed/yt_vid1/600/340',
    views: '1.2M views'
  }

  // Photo Gallery Photos Collection for Carousel Lightbox
  const galleryPhotos = React.useMemo(() => {
    const customPhotos = (Array.isArray(epkData?.galleryImages) ? epkData.galleryImages : []).filter(Boolean)
    if (customPhotos.length > 0) {
      return customPhotos.map((url, i) => ({
        id: 700 + i,
        title: `${effectiveArtistName} — Gallery Snapshot #${i + 1}`,
        caption: 'Exclusive tour visual & behind-the-scenes recording capture',
        url: url,
        thumbnail: url
      }))
    }
    return [
      { id: 302, title: 'Live at Nairobi Cyberdome Stage Highlight', caption: 'Sold out main stage performance with live audiovisual lasers and modular synthesizers.', url: 'https://picsum.photos/seed/gal1/1200/800', thumbnail: 'https://picsum.photos/seed/gal1/600/340' },
      { id: 304, title: 'Behind the Scenes: Recording Stems at Intermaven Studio', caption: 'Late night master tracking session capturing analog synthesizers and vocal harmonies.', url: 'https://picsum.photos/seed/gal2/1200/800', thumbnail: 'https://picsum.photos/seed/gal2/600/340' },
      { id: 306, title: 'London O2 Backstage VIP Session', caption: 'Exclusive fan meet and greet session before taking the stage at London O2 Academy.', url: 'https://picsum.photos/seed/gal3/1200/800', thumbnail: 'https://picsum.photos/seed/gal3/600/340' },
      { id: 307, title: 'Modular Synthesizer & Patch Bay Experimentation', caption: 'Creating custom analog timbre waveforms for upcoming sync licensing catalogue.', url: 'https://picsum.photos/seed/gal4/1200/800', thumbnail: 'https://picsum.photos/seed/gal4/600/340' },
      { id: 308, title: 'Tokyo Club Quattro Soundcheck', caption: 'Fine-tuning the low-end sub-bass resonance during tour acoustics calibration.', url: 'https://picsum.photos/seed/gal5/1200/800', thumbnail: 'https://picsum.photos/seed/gal5/600/340' }
    ]
  }, [epkData?.galleryImages, effectiveArtistName])

  // Keyboard navigation for photo gallery carousel
  useEffect(() => {
    if (!galleryModalOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setActiveGalleryIndex(prev => (prev === 0 ? galleryPhotos.length - 1 : prev - 1))
      } else if (e.key === 'ArrowRight') {
        setActiveGalleryIndex(prev => (prev + 1) % galleryPhotos.length)
      } else if (e.key === 'Escape') {
        setGalleryModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [galleryModalOpen, galleryPhotos.length])

  // Open photo gallery carousel at specific item
  const openGalleryCarousel = (itemOrIndex) => {
    if (typeof itemOrIndex === 'number') {
      setActiveGalleryIndex(itemOrIndex)
    } else if (itemOrIndex) {
      const idx = galleryPhotos.findIndex(p => p.id === itemOrIndex.id || p.thumbnail === itemOrIndex.thumbnail || p.title === itemOrIndex.title)
      setActiveGalleryIndex(idx >= 0 ? idx : 0)
    }
    setGalleryModalOpen(true)
  }

  // Handlers
  const handleAuthSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!authEmail.trim()) return

    const user = {
      name: authName.trim() || authEmail.split('@')[0],
      email: authEmail.trim().toLowerCase(),
      phone: authPhone.trim(),
      preferredCommMethod: authCommMethod,
      interests: authSelectedInterests,
      role: 'consumer',
      crmId: `CRM-${Math.floor(100000 + Math.random() * 900000)}`,
      joinedAt: new Date().toLocaleDateString(),
      credits: 250
    }
    setFanUser(user)

    try {
      localStorage.setItem(`fan_session_${artistSlug}`, JSON.stringify(user))
      sessionStorage.setItem('tunemavens_session', JSON.stringify(user))

      // Ingest fan to Creator CRM under the fans list
      const crmKey = `creator_crm_fans_${artistSlug}`
      const existingFans = JSON.parse(localStorage.getItem(crmKey) || '[]')
      const updatedFans = [user, ...existingFans.filter(f => f.email !== user.email)]
      localStorage.setItem(crmKey, JSON.stringify(updatedFans))

      // Send to backend CRM leads endpoint
      fetch('http://localhost:8001/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone,
          inquiry_type: 'fan_signup',
          message: `VIP Fan Club Membership Signup (${authCommMethod})`,
          creator_username: artistSlug,
          creator_name: effectiveArtistName,
          preferred_comm_method: authCommMethod,
          interests: authSelectedInterests
        })
      }).catch(err => console.warn('Backend CRM lead sync notice:', err))
    } catch (err) {
      console.warn('Fan CRM storage warning:', err)
    }

    setAuthModalOpen(false)

    // Auto-post pending comment if user was trying to comment
    if (pendingComment) {
      const mediaId = pendingComment.mediaId
      const current = mediaComments[mediaId] || []
      setMediaComments(prev => ({
        ...prev,
        [mediaId]: [{ author: user.name, text: pendingComment.text, likes: 0 }, ...current]
      }))
      setPendingComment(null)
      setNewCommentText('')
    }
    showToast(`🎉 Welcome to ${effectiveArtistName}'s Fan Club! 25 bonus credits added.`)
  }

  const handleAuthLogin = (emailToLogin) => {
    const email = (emailToLogin || authLoginEmail || '').trim().toLowerCase()
    if (!email) {
      showToast('Please enter an email to log in', 'error')
      return
    }

    const crmKey = `creator_crm_fans_${artistSlug}`
    let existingFans = []
    try {
      existingFans = JSON.parse(localStorage.getItem(crmKey) || '[]')
      const intermavenCrm = JSON.parse(localStorage.getItem('intermaven_crm') || '[]')
      existingFans = [...existingFans, ...intermavenCrm]
    } catch (_) {}

    const found = existingFans.find(f => f.email && f.email.toLowerCase() === email)
    const user = found || {
      name: email.split('@')[0].replace('.', ' '),
      email: email,
      phone: '+1 555-019-2834',
      preferredCommMethod: 'whatsapp',
      interests: ['VIP Tour Pre-Sales & Discounts', 'Unreleased WAV Master Stems'],
      role: 'vip_fan',
      crmId: `CRM-${Math.floor(100000 + Math.random() * 900000)}`,
      joinedAt: new Date().toLocaleDateString(),
      credits: 250
    }

    setFanUser(user)
    try {
      localStorage.setItem(`fan_session_${artistSlug}`, JSON.stringify(user))
      sessionStorage.setItem('tunemavens_session', JSON.stringify(user))
    } catch (_) {}

    setAuthModalOpen(false)
    showToast(`✨ Welcome back, ${user.name}! VIP Fan privileges active.`)
    setFanPortalOpen(true)
  }

  const handleDownloadEpkAssets = (e) => {
    if (e) e.preventDefault()
    showToast('📄 Generating high-res EPK Press Kit PDF...', 'info')

    const printWin = window.open('', '_blank', 'width=950,height=1100')
    if (!printWin) {
      showToast('⚠️ Pop-up blocked! Please allow pop-ups to download the EPK PDF.', 'error')
      return
    }

    const heroImg = currentSlide?.img || heroSlide1
    const logoImg = effectiveLogoUrl || ''
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000/#/epk/' + artistSlug

    const pdfHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${effectiveArtistName} — Official Press Kit (EPK)</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #070a14; color: #f8fafc; margin: 0; padding: 24px; }
    .page { max-width: 820px; margin: 0 auto; background: #0c1020; border: 1px solid ${effectiveAccent}44; border-radius: 6px; padding: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.7); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${effectiveAccent}; padding-bottom: 18px; margin-bottom: 24px; }
    .logo-box { max-width: 200px; max-height: 60px; display: flex; align-items: center; }
    .logo-box img { max-width: 100%; max-height: 55px; object-fit: contain; }
    .badge { background: ${effectiveAccent}; color: #000; font-weight: 900; font-size: 11px; padding: 4px 10px; border-radius: 3px; text-transform: uppercase; letter-spacing: 1px; }
    .hero-flex { display: flex; gap: 24px; margin-bottom: 28px; align-items: center; }
    .profile-photo { width: 220px; height: 280px; object-fit: cover; border-radius: 4px; border: 2px solid ${effectiveAccent}; box-shadow: 0 8px 25px rgba(0,0,0,0.6); flex-shrink: 0; }
    .meta-content { flex: 1; }
    h1 { margin: 0 0 6px; font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -0.5px; }
    .headline { font-size: 15px; color: ${effectiveAccent}; font-weight: 700; margin-bottom: 14px; }
    .quote-box { background: rgba(34,211,238,0.06); border-left: 3px solid ${effectiveAccent}; padding: 12px 16px; margin: 14px 0; font-style: italic; color: #e2e8f0; font-size: 12.5px; border-radius: 0 3px 3px 0; }
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 14px; }
    .stat-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); padding: 10px; border-radius: 3px; text-align: center; }
    .stat-num { font-size: 20px; font-weight: 900; color: ${effectiveAccent}; }
    .stat-label { font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-top: 2px; }
    .sec-title { font-size: 13px; font-weight: 900; color: ${effectiveAccent}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 5px; margin: 20px 0 10px; }
    .bio-p { font-size: 12.5px; line-height: 1.65; color: #cbd5e1; margin: 0 0 10px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 12px; color: #cbd5e1; }
    .grid-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 12px; border-radius: 3px; }
    .grid-box strong { color: #fff; display: block; margin-bottom: 3px; }
    .footer { margin-top: 26px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
    @media print {
      body { background: #fff !important; color: #000 !important; padding: 0 !important; }
      .page { background: #fff !important; border: none !important; color: #000 !important; box-shadow: none !important; padding: 0 !important; }
      h1 { color: #000 !important; }
      .headline { color: #0369a1 !important; }
      .bio-p { color: #334155 !important; }
      .stat-box { background: #f8fafc !important; border-color: #cbd5e1 !important; }
      .stat-num { color: #0284c7 !important; }
      .stat-label { color: #64748b !important; }
      .quote-box { background: #f0f9ff !important; border-color: #0284c7 !important; color: #0f172a !important; }
      .grid-box { background: #f8fafc !important; border-color: #e2e8f0 !important; color: #334155 !important; }
      .grid-box strong { color: #0f172a !important; }
      .footer { color: #94a3b8 !important; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="max-width:820px; margin:0 auto 16px; display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:12px 20px; border-radius:4px;">
    <span style="font-size:13px; color:#fff; font-weight:700;">TuneMavens PDF Engine • Ready for Print / PDF Export</span>
    <button onclick="window.print()" style="background:${effectiveAccent}; color:#000; border:none; padding:8px 18px; border-radius:3px; font-weight:900; font-size:12px; cursor:pointer;">
      🖨️ Print or Save as PDF
    </button>
  </div>

  <div class="page">
    <div class="header">
      <div class="logo-box">
        ${logoImg ? `<img src="${logoImg}" alt="Official Logo" />` : `<h2 style="margin:0; color:${effectiveAccent}; font-size:22px;">${effectiveArtistName}</h2>`}
      </div>
      <div style="text-align:right;">
        <span class="badge">Official Press Kit • 2026</span>
        <div style="font-size:10.5px; color:#94a3b8; margin-top:3px;">TuneMavens Verified Creator World</div>
      </div>
    </div>

    <div class="hero-flex">
      <img src="${heroImg}" alt="${effectiveArtistName} Profile" class="profile-photo" />
      <div class="meta-content">
        <h1>${effectiveArtistName}</h1>
        <div class="headline">${effectiveHeadline}</div>
        <div class="quote-box">
          "${epkData?.pressQuote || 'A singular sonic architect redefining modern sync placement and electronic master ownership.'}"
          <div style="font-size:10.5px; font-weight:800; color:${effectiveAccent}; margin-top:4px;">— ${epkData?.pressOutlet || 'Billboard & SyncMavens Review'}</div>
        </div>
        <div class="stats-row">
          <div class="stat-box"><div class="stat-num">4.2M+</div><div class="stat-label">Global Streams</div></div>
          <div class="stat-box"><div class="stat-num">385K</div><div class="stat-label">Monthly Listeners</div></div>
          <div class="stat-box"><div class="stat-num">100%</div><div class="stat-label">Sync Pre-Cleared</div></div>
        </div>
      </div>
    </div>

    <div class="sec-title">Biography & Narrative</div>
    <div class="bio-p">
      ${effectiveBio.replace(/<[^>]+>/g, ' ')}
    </div>

    <div class="sec-title">Technical Rider & Stage Plot Specifications</div>
    <div class="grid-2">
      <div class="grid-box">
        <strong>Front of House (FOH)</strong>
        DiGiCo SD12 / Quantum 225 or Avid S6L with Dante network integration.
      </div>
      <div class="grid-box">
        <strong>In-Ear Monitoring (IEM)</strong>
        4x Stereo IEM wireless mixes (Sennheiser G4 / Shure PSM1000). No wedges needed.
      </div>
      <div class="grid-box">
        <strong>Backline Requirements</strong>
        2x Pioneer CDJ-3000, 1x DJM-A9 / V10, 1x Moog Subsequent 37, Roland SPD-SX.
      </div>
      <div class="grid-box">
        <strong>Tour Capacities & Draw</strong>
        1,500 - 3,500 Cap Headline Venues Sold Out. Festival Mainstage Ready.
      </div>
    </div>

    <div class="sec-title">Management, Booking & Sync Clearance Contacts</div>
    <div class="grid-2">
      <div class="grid-box">
        <strong>Worldwide Management</strong>
        Intermaven Talent Group<br>
        Email: mgmt@intermaven.io
      </div>
      <div class="grid-box">
        <strong>Live Booking Agency</strong>
        TuneBooking Agency<br>
        Email: ${epkData?.bookingEmail || 'booking@tunemaven.com'}
      </div>
      <div class="grid-box">
        <strong>Sync & Master Licensing</strong>
        SyncMavens Global Network<br>
        Email: sync@tunemaven.com (One-Stop Pre-Cleared)
      </div>
      <div class="grid-box">
        <strong>Live Creator World</strong>
        ${currentUrl}
      </div>
    </div>

    <div class="footer">
      <span>Generated by TuneMavens Creator EPK Engine • Verified Intermaven Protocol</span>
      <span>${effectiveArtistName} • All Master & Publishing Rights Reserved</span>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  <\/script>
</body>
</html>`

    printWin.document.open()
    printWin.document.write(pdfHtml)
    printWin.document.close()
    showToast('✅ Press Kit PDF generated! Print or Save as PDF in the opened dialog.')
  }

  const handleApplyPromo = () => {
    if (promoCodeInput.trim().toUpperCase() === 'VIPFAN20') {
      setAppliedPromoDiscount(0.20)
      showToast('🎟️ Promo code applied: 20% Fan Discount active!')
    } else {
      showToast('Invalid promo code. Use VIPFAN20 for 20% off.', 'error')
    }
  }

  const handleTopUpCredits = (amount, packPrice, packTitle = 'TM Credits Pack') => {
    setUserCredits(prev => prev + amount)
    showToast(`Top-Up Successful! +${amount} TM Credits (${packTitle} - ${packPrice}) added to your balance. New balance: ${userCredits + amount} Credits`)
    setPricingModalOpen(false)
  }

  const addProductWithOptionsToCart = (product, size, color, edition) => {
    const optionDesc = product.category === 'apparel'
      ? `Size: ${size}, Color: ${color}`
      : product.category === 'vinyl'
      ? `Edition: ${edition}`
      : product.category === 'stems'
      ? `License: ${edition}`
      : 'Standard Edition'

    const itemToAdd = {
      ...product,
      selectedSize: size || 'N/A',
      selectedColor: color || 'N/A',
      selectedEdition: edition || 'standard',
      customOptionDesc: optionDesc,
      qty: 1
    }

    setCart(prev => [...prev, itemToAdd])
    setSelectedProductModal(null)
    setCartOpen(true)
    showToast(`🛍️ Added "${product.title}" (${optionDesc}) to cart!`)
  }

  const handleMerchCheckoutSubmit = (e) => {
    if (e) e.preventDefault()
    if (merchPaymentGateway === 'credits' && userCredits < 50) {
      showToast('Insufficient TM Credits balance. Please top up first.', 'error')
      return
    }

    const orderId = `TM-ORD-${Math.floor(100000 + Math.random() * 900000)}`
    const trackingCode = `TRK-IM-${Math.floor(10000000 + Math.random() * 90000000)}`
    
    if (merchPaymentGateway === 'credits') {
      setUserCredits(prev => Math.max(0, prev - 50))
    }

    setMerchOrderConfirmed({
      orderId,
      trackingCode,
      gateway: merchPaymentGateway,
      totalPaid: (cartTotal * (1 - appliedPromoDiscount)).toFixed(2),
      items: [...cart]
    })
    setCart([])
    showToast(`🎉 Order ${orderId} confirmed! Tracking details generated.`)
  }

  const handleLogout = () => {
    setFanUser(null)
    localStorage.removeItem(`fan_session_${artistSlug}`)
  }

  const navigateToFanDashboard = () => {
    if (fanUser) {
      sessionStorage.setItem('tunemavens_session', JSON.stringify(fanUser))
      window.location.hash = '#/dashboard'
    } else {
      setAuthModalOpen(true)
    }
  }

  // Cart Functions
  const addToCart = (product) => {
    const existingIndex = cart.findIndex(item => item.id === product.id && item.selectedSize === (product.hasSizes ? productSize : 'N/A'))
    if (existingIndex > -1) {
      const updatedCart = [...cart]
      updatedCart[existingIndex].qty += 1
      setCart(updatedCart)
    } else {
      setCart([...cart, { ...product, selectedSize: product.hasSizes ? productSize : 'N/A', qty: 1 }])
    }
    setCartOpen(true)
    setSelectedProduct(null)
  }

  const updateCartQty = (index, delta) => {
    const updated = [...cart]
    updated[index].qty += delta
    if (updated[index].qty <= 0) {
      updated.splice(index, 1)
    }
    setCart(updated)
  }

  const removeFromCart = (index) => {
    const updated = [...cart]
    updated.splice(index, 1)
    setCart(updated)
  }

  const handleCheckoutCart = (e) => {
    if (e) e.preventDefault()
    setCartOpen(false)
    setMerchCheckoutOpen(true)
  }

  // Credit Purchase Handler
  const handlePurchaseTrackWithCredits = (track) => {
    if (userCredits >= track.priceCredits) {
      setUserCredits(prev => prev - track.priceCredits)
      setCreditPurchaseSuccess({
        track,
        remainingCredits: userCredits - track.priceCredits
      })
    } else {
      showToast('⚠️ Insufficient Intermaven Credits! Please top up your balance.')
    }
  }

  // Dropdown ref for outside-click closing
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMediaDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Universal In-Context Credit Top-Up Modal State
  const [quickTopUpModalOpen, setQuickTopUpModalOpen] = useState(false)
  const [quickTopUpCurrency, setQuickTopUpCurrency] = useState('USD') // 'USD' | 'KES'
  const [quickTopUpCustomAmount, setQuickTopUpCustomAmount] = useState('')
  const [quickTopUpSelectedPack, setQuickTopUpSelectedPack] = useState('creator')
  const [quickTopUpPaymentGateway, setQuickTopUpPaymentGateway] = useState('card')
  const [quickTopUpCardName, setQuickTopUpCardName] = useState('')
  const [quickTopUpCardNumber, setQuickTopUpCardNumber] = useState('')
  const [quickTopUpCardExp, setQuickTopUpCardExp] = useState('')
  const [quickTopUpCardCvc, setQuickTopUpCardCvc] = useState('')
  const [quickTopUpCardZip, setQuickTopUpCardZip] = useState('')
  const [quickTopUpMpesaPhone, setQuickTopUpMpesaPhone] = useState('')
  const [quickTopUpProcessing, setQuickTopUpProcessing] = useState(false)

  // Intelligent Practitioner Verification Modal for Stems
  const [practitionerModalOpen, setPractitionerModalOpen] = useState(false)
  const [selectedPractitionerRole, setSelectedPractitionerRole] = useState('producer')

  // Album Dedicated Audio Player & 30s Free Preview State
  const [albumAudioPlaying, setAlbumAudioPlaying] = useState(false)
  const [albumAudioCurrentTrack, setAlbumAudioCurrentTrack] = useState(null)
  const [albumAudioProgress, setAlbumAudioProgress] = useState(0) // seconds
  const [albumAudioUnlocked, setAlbumAudioUnlocked] = useState(false) // whether full stream is paid with credits

  // 30s Preview Timer Effect
  useEffect(() => {
    let interval = null
    if (albumAudioPlaying) {
      interval = setInterval(() => {
        setAlbumAudioProgress(prev => {
          if (!albumAudioUnlocked && prev >= 30) {
            setAlbumAudioPlaying(false)
            showToast('30-Second Preview ended. Unlock full lossless master stream for 1 TM Credit!')
            return 30
          }
          if (prev >= 240) {
            setAlbumAudioPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [albumAudioPlaying, albumAudioUnlocked])

  // Fan Playlists & Library State
  const [fanPlaylists, setFanPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem('tm_fan_playlists')
      return saved ? JSON.parse(saved) : [
        { id: 101, name: 'Night Cyberwave Vibes', desc: 'Late night modular synth rotation', trackIds: [1, 2], createdAt: '2026-08-20' },
        { id: 102, name: 'Roadtrip Safari', desc: 'East African electronic selections', trackIds: [3, 4], createdAt: '2026-09-01' }
      ]
    } catch {
      return []
    }
  })
  const [fanPurchasedLibrary, setFanPurchasedLibrary] = useState(() => {
    try {
      const saved = localStorage.getItem('tm_fan_library')
      return saved ? JSON.parse(saved) : [
        { id: 'alb-401', type: 'album', title: 'Nairobi Cyberwave (Deluxe LP)', date: '2026-08-15', format: 'FLAC 24/96' },
        { id: 'trk-1', type: 'single', title: 'Nairobi Cyberwave (Master)', date: '2026-08-18', format: 'WAV Master' }
      ]
    } catch {
      return []
    }
  })
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('')
  const [addTrackToPlaylistModal, setAddTrackToPlaylistModal] = useState(null)

  // Press Kit Modal Preview & Tech Rider States
  const [epkPreviewModalOpen, setEpkPreviewModalOpen] = useState(false)
  const [techRiderModalOpen, setTechRiderModalOpen] = useState(false)

  // Universal Credit Top-Up Processor Handler
  const handleProcessQuickTopUp = (e) => {
    if (e) e.preventDefault()
    setQuickTopUpProcessing(true)

    let creditsToAdd = 0
    let costDisplay = ''

    if (quickTopUpSelectedPack === 'starter') {
      creditsToAdd = 250
      costDisplay = quickTopUpCurrency === 'USD' ? '$25.00' : 'KES 3,250'
    } else if (quickTopUpSelectedPack === 'creator') {
      creditsToAdd = 750
      costDisplay = quickTopUpCurrency === 'USD' ? '$65.00' : 'KES 8,450'
    } else if (quickTopUpSelectedPack === 'pro') {
      creditsToAdd = 2000
      costDisplay = quickTopUpCurrency === 'USD' ? '$150.00' : 'KES 19,500'
    } else if (quickTopUpSelectedPack === 'studio') {
      creditsToAdd = 5000
      costDisplay = quickTopUpCurrency === 'USD' ? '$325.00' : 'KES 42,250'
    } else if (quickTopUpSelectedPack === 'custom') {
      const numVal = parseFloat(quickTopUpCustomAmount) || 0
      if (quickTopUpCurrency === 'USD') {
        if (numVal < 5) {
          showToast('Minimum custom top-up in the USA is $5.00 USD.')
          setQuickTopUpProcessing(false)
          return
        }
        creditsToAdd = Math.round(numVal * 10)
        costDisplay = `$${numVal.toFixed(2)}`
      } else {
        if (numVal < 200) {
          showToast('Minimum custom top-up in Kenya is KES 200.')
          setQuickTopUpProcessing(false)
          return
        }
        creditsToAdd = Math.round(numVal * (10 / 130))
        costDisplay = `KES ${numVal.toLocaleString()}`
      }
    }

    setTimeout(() => {
      setQuickTopUpProcessing(false)
      setUserCredits(prev => prev + creditsToAdd)
      setQuickTopUpModalOpen(false)
      showToast(`🎉 Successfully topped up +${creditsToAdd} TM Credits (${costDisplay})! New Balance: ${userCredits + creditsToAdd} Credits`)
    }, 600)
  }

  // Fan Playlist Creator Handler
  const handleCreatePlaylist = (e) => {
    if (e) e.preventDefault()
    if (!newPlaylistName.trim()) return

    const newPl = {
      id: Date.now(),
      name: newPlaylistName.trim(),
      desc: newPlaylistDesc.trim() || 'Curated fan playlist',
      trackIds: addTrackToPlaylistModal ? [addTrackToPlaylistModal.id] : [],
      createdAt: new Date().toISOString().split('T')[0]
    }
    const updated = [newPl, ...fanPlaylists]
    setFanPlaylists(updated)
    localStorage.setItem('tm_fan_playlists', JSON.stringify(updated))
    setNewPlaylistName('')
    setNewPlaylistDesc('')
    setPlaylistModalOpen(false)
    setAddTrackToPlaylistModal(null)
    showToast(`🎵 Playlist "${newPl.name}" created successfully!`)
  }

  // Add Track to Playlist Handler
  const handleAddTrackToPlaylist = (plId, track) => {
    const updated = fanPlaylists.map(pl => {
      if (pl.id === plId) {
        const ids = pl.trackIds.includes(track.id) ? pl.trackIds : [...pl.trackIds, track.id]
        return { ...pl, trackIds: ids }
      }
      return pl
    })
    setFanPlaylists(updated)
    localStorage.setItem('tm_fan_playlists', JSON.stringify(updated))
    setAddTrackToPlaylistModal(null)
    showToast(`Added "${track.title}" to playlist!`)
  }

  // Practitioner Verification Handler
  const handleVerifyPractitioner = (role) => {
    setSelectedPractitionerRole(role)
    if (fanUser) {
      setFanUser(prev => ({ ...prev, role, isPractitioner: true }))
    }
    setPractitionerModalOpen(false)
    showToast(`Verified as Industry Practitioner (${role.toUpperCase()})! Stems & Sync clearance unlocked.`)
  }

  // Check and Open Stems Handler
  const handleOpenStemsForTrack = (track) => {
    const isPractitioner = fanUser?.isPractitioner || ['producer', 'dj', 'label', 'publisher', 'pro_maven', 'practitioner'].includes(fanUser?.role)
    if (!isPractitioner) {
      setStemsModalTrack(track)
      setPractitionerModalOpen(true)
    } else {
      setStemsModalTrack(track)
      setStemsPurchased(null)
    }
  }

  // Buy Full Album for Fans Handler
  const handleBuyFullAlbum = (alb) => {
    if (userCredits >= 50) {
      setUserCredits(prev => prev - 50)
      const newLibItem = {
        id: `alb-${alb.id}-${Date.now()}`,
        type: 'album',
        title: alb.title,
        date: new Date().toISOString().split('T')[0],
        format: '24-Bit / 96kHz Lossless FLAC + MP3 Bundle'
      }
      const updatedLib = [newLibItem, ...fanPurchasedLibrary]
      setFanPurchasedLibrary(updatedLib)
      localStorage.setItem('tm_fan_library', JSON.stringify(updatedLib))
      showToast(`🎉 Purchased Full Album: "${alb.title}"! High-res download ready in My Library.`)
    } else {
      setQuickTopUpModalOpen(true)
      showToast('⚠️ Insufficient TM Credits to buy album (50 Credits needed). Please top up your balance.')
    }
  }

  // Handle Play Track on Album Page with 30s Free Preview Protocol
  const handlePlayAlbumTrack = (trk) => {
    setAlbumAudioCurrentTrack(trk)
    setAlbumAudioProgress(0)
    setAlbumAudioPlaying(true)
    setAlbumAudioUnlocked(false)
    showToast(`▶ Streaming: ${trk.title} (30-Sec Free Preview)`)
  }

  // Unlock Full Lossless Master Stream for 1 TM Credit
  const handleUnlockFullStream = () => {
    if (userCredits >= 1) {
      setUserCredits(prev => prev - 1)
      setAlbumAudioUnlocked(true)
      setAlbumAudioPlaying(true)
      showToast('⚡ Full 24-Bit Lossless Master stream unlocked! (1 TM Credit consumed)')
    } else {
      setQuickTopUpModalOpen(true)
      showToast('⚠️ Insufficient credits to unlock stream. Please top up your balance.')
    }
  }

  // Full Event Ticket Purchasing Protocol Handler
  const handleEventPurchase = (e) => {
    if (e) e.preventDefault()
    setEventPurchasing(true)

    const ev = selectedEventDetail || shows[0]
    let tierPrice = ev.priceGA || 25
    let tierCredits = 25
    if (eventTier === 'vip') {
      tierPrice = ev.priceVIP || 50
      tierCredits = 50
    }
    if (eventTier === 'meet') {
      tierPrice = ev.priceMeet || 99
      tierCredits = 100
    }

    const totalCash = (tierPrice * eventQty).toFixed(2)
    const totalCredits = tierCredits * eventQty

    if (eventPaymentGateway === 'credits') {
      if (userCredits < totalCredits) {
        showToast(`Insufficient TM Credits! You need ${totalCredits} credits, but have ${userCredits}.`)
        setEventPurchasing(false)
        return
      }
      setUserCredits(prev => prev - totalCredits)
    }

    setTimeout(() => {
      setEventPurchasing(false)
      setEventTicketSuccess({
        id: `TM-TKT-${Date.now().toString().slice(-6)}`,
        qr: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
        event: ev,
        tier: eventTier,
        tierName: eventTier === 'ga' ? 'General Admission' : eventTier === 'vip' ? 'VIP Access Pass' : 'VIP Meet & Greet Pass',
        qty: eventQty,
        gateway: eventPaymentGateway,
        totalCash,
        totalCredits,
        buyerName: eventCardName || (fanUser ? fanUser.name : 'VIP Maven Fan'),
        buyerEmail: ticketEmail || (fanUser ? fanUser.email : 'fan@intermaven.io'),
        datePurchased: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      })
      showToast(`Ticket Purchase Confirmed for ${ev.venue}!`)
    }, 600)
  }

  // Full Stems Purchase & Download Generation Handler
  const handleStemsPurchase = (e) => {
    if (e) e.preventDefault()
    setStemsProcessing(true)

    const t = stemsModalTrack || tracks[0]
    let priceCash = 24.99
    let priceCredits = 60
    let tierLabel = 'Full Lossless Multitracks (All 6 Stems + MIDI)'

    if (stemsPackageType === 'instrumental') {
      priceCash = 14.99
      priceCredits = 40
      tierLabel = 'Instrumental Only Multitracks'
    } else if (stemsPackageType === 'acapella') {
      priceCash = 12.99
      priceCredits = 35
      tierLabel = 'Acapella & Harmonies Vocal Pack'
    } else if (stemsPackageType === 'sync') {
      priceCash = 79.99
      priceCredits = 150
      tierLabel = 'One-Stop Sync & Commercial License + Multitracks'
    }

    if (stemsPaymentMethod === 'credits') {
      if (userCredits < priceCredits) {
        showToast(`Insufficient TM Credits! You need ${priceCredits} credits, but have ${userCredits}.`)
        setStemsProcessing(false)
        return
      }
      setUserCredits(prev => prev - priceCredits)
    }

    setTimeout(() => {
      setStemsProcessing(false)
      setStemsPurchased({
        token: `TM-STEMS-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        track: t,
        tier: stemsPackageType,
        tierLabel,
        priceCash,
        priceCredits,
        paymentMethod: stemsPaymentMethod,
        downloadExpiry: '30 Days Access',
        stemsList: [
          { name: '01_DRUMS_Percussion_24b96k.wav', size: '78.4 MB' },
          { name: '02_BASS_808_Sub_24b96k.wav', size: '54.2 MB' },
          { name: '03_SYNTHS_Keys_Pads_24b96k.wav', size: '92.1 MB' },
          { name: '04_LEAD_VOCAL_DryWet_24b96k.wav', size: '64.8 MB' },
          { name: '05_BACKING_VOCALS_Adlibs_24b96k.wav', size: '48.9 MB' },
          { name: '06_FX_Risers_Impacts_24b96k.wav', size: '36.5 MB' },
          { name: '07_MIDI_TempoMap_Chords.mid', size: '142 KB' }
        ]
      })
      showToast(`Stems Unlocked: ${t.title}! Downloads ready.`)
    }, 500)
  }


  // Intermaven Ticketing Handler
  const handleTicketBuy = (e) => {
    e.preventDefault()
    let pricePerTicket = selectedShow.priceGA
    if (ticketTier === 'vip') pricePerTicket = selectedShow.priceVIP
    if (ticketTier === 'meet') pricePerTicket = selectedShow.priceMeet

    const grossAmount = (pricePerTicket * ticketQty)
    const creatorShare = (grossAmount * 0.90).toFixed(2)
    const platformShare = (grossAmount * 0.10).toFixed(2)

    setTicketSuccess({
      qr: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
      show: selectedShow,
      tierName: ticketTier === 'ga' ? 'General Admission' : ticketTier === 'vip' ? 'VIP Pass' : 'Meet & Greet Upgrade',
      qty: ticketQty,
      gateway: paymentGateway,
      total: grossAmount.toFixed(2),
      creatorShare,
      platformShare,
      fanEmail: ticketEmail || (fanUser ? fanUser.email : 'fan@intermaven.io')
    })
  }

  // Media Commenting Handler with VIP Fan CRM Prompt
  const handleAddMediaComment = (e) => {
    e.preventDefault()
    const trimmed = newCommentText.trim()
    if (!trimmed) return

    if (!fanUser) {
      setPendingComment({
        mediaId: selectedMedia?.id || 301,
        text: trimmed
      })
      setAuthModalOpen(true)
      return
    }

    if (selectedMedia) {
      const mediaId = selectedMedia.id
      const current = mediaComments[mediaId] || []
      setMediaComments(prev => ({
        ...prev,
        [mediaId]: [{ author: fanUser.name, text: trimmed, likes: 0 }, ...current]
      }))
      setNewCommentText('')
    }
  }

  // Filtered Collections
  const filteredShows = shows.filter(s => 
    s.venue.toLowerCase().includes(showsSearch.toLowerCase()) || 
    s.city.toLowerCase().includes(showsSearch.toLowerCase())
  )
  const showsPerPage = 3
  const paginatedShows = filteredShows.slice((showsPage - 1) * showsPerPage, showsPage * showsPerPage)

  const filteredAlbums = albums.filter(a => 
    a.title.toLowerCase().includes(discographySearch.toLowerCase()) ||
    a.year.includes(discographySearch) ||
    a.type.toLowerCase().includes(discographySearch.toLowerCase())
  )
  const albumsPerPage = 4
  const paginatedAlbums = filteredAlbums.slice((discographyPage - 1) * albumsPerPage, discographyPage * albumsPerPage)

  const filteredMedia = mediaItems.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(mediaSearch.toLowerCase())
    if (mediaFilter === 'gallery') return matchesSearch && m.type === 'gallery'
    if (mediaFilter === 'videos') return matchesSearch && m.type === 'video'
    return matchesSearch
  })

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(storeSearch.toLowerCase())
    if (storeCategory === 'all') return matchesSearch
    return matchesSearch && p.category === storeCategory
  })

  const totalCartQty = cart.reduce((acc, c) => acc + c.qty, 0)
  const cartTotal = cart.reduce((sum, item) => {
    const rawPrice = item.numPrice !== undefined ? item.numPrice : parseFloat(String(item.price || '0').replace(/[^0-9.]/g, '')) || 0
    return sum + (rawPrice * item.qty)
  }, 0)

  return (
    <div className="creator-epk-container" style={{
      background: effectiveBg,
      color: isLight ? '#0f172a' : '#ffffff',
      fontFamily: effectiveFont,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>

      {/* Animation & Mobile Responsive Media Styles */}
      <style>{`
        /* Strict 3px Button Specification across entire EPK */
        button,
        .creator-epk-container button,
        .creator-epk-container .btn,
        .creator-epk-container .epk-btn,
        .creator-epk-container input[type="button"],
        .creator-epk-container input[type="submit"] {
          border-radius: 3px !important;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* ── 1. Synergy Sugar Sliding Right-to-Left Cascade Animation ── */
        @keyframes slideInRightCascade {
          0% { opacity: 0; transform: translateX(65px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutLeftCascade {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-45px); }
        }

        .anim-synergy .hero-title-1 {
          animation: slideInRightCascade 550ms cubic-bezier(.16,1,.3,1) 120ms both;
        }
        .anim-synergy .hero-title-2 {
          animation: slideInRightCascade 550ms cubic-bezier(.16,1,.3,1) 280ms both;
        }
        .anim-synergy .hero-title-3 {
          animation: slideInRightCascade 550ms cubic-bezier(.16,1,.3,1) 440ms both;
        }

        /* ── 2. Sequential Fade In One at a Time, Fade Out One at a Time ── */
        @keyframes seqFade1 {
          0% { opacity: 0; transform: translateY(12px); }
          12% { opacity: 1; transform: translateY(0); }
          75% { opacity: 1; transform: translateY(0); }
          86% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes seqFade2 {
          0%, 15% { opacity: 0; transform: translateY(12px); }
          28% { opacity: 1; transform: translateY(0); }
          75% { opacity: 1; transform: translateY(0); }
          89% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes seqFade3 {
          0%, 30% { opacity: 0; transform: translateY(12px); }
          44% { opacity: 1; transform: translateY(0); }
          75% { opacity: 1; transform: translateY(0); }
          92% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 0; transform: translateY(-8px); }
        }

        .anim-fade-seq .hero-title-1 {
          animation: seqFade1 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .anim-fade-seq .hero-title-2 {
          animation: seqFade2 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .anim-fade-seq .hero-title-3 {
          animation: seqFade3 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .hero-titles-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 155px;
          text-align: center;
        }

        .hero-title-1 {
          font-size: clamp(26px, 3.5vw, 46px) !important;
          font-weight: 900 !important;
          font-style: italic !important;
          line-height: 1.15 !important;
          letter-spacing: -0.3px !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .hero-title-2 {
          font-size: clamp(17px, 2.3vw, 28px) !important;
          font-weight: 800 !important;
          font-style: italic !important;
          line-height: 1.25 !important;
          letter-spacing: 0.2px !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .hero-title-3 {
          font-size: clamp(13.5px, 1.4vw, 17px) !important;
          font-weight: 600 !important;
          line-height: 1.35 !important;
          letter-spacing: 0.4px !important;
          margin: 2px 0 0 !important;
          padding: 0 !important;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .mobile-hamburger-btn {
          display: none;
        }

        .epk-aside-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 32px;
          align-items: start;
        }

        @media (max-width: 960px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
          .epk-aside-layout {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .epk-aside-layout aside,
          .epk-sticky-aside {
            position: static !important;
            top: auto !important;
          }
        }
      `}</style>

      {/* ================= 1. HEADER OVERLAY ================= */}
      <header style={{
        background: scrolled ? (isLight ? 'rgba(255,255,255,0.95)' : 'rgba(6, 8, 18, 0.92)') : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? (isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)') : 'none',
        padding: '12px 0',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: scrolled ? '0 4px 25px rgba(0,0,0,0.5)' : 'none',
        transition: 'all 0.35s ease'
      }}>
        {/* Restrain both logo edge and fan portal edge to the 1280px layout container */}
        <div style={{
          maxWidth: maxContentWidth !== '100%' ? maxContentWidth : '1280px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: effectiveVariant === 'centered' ? 'space-around' : 'space-between',
          padding: '0 24px',
          boxSizing: 'border-box'
        }}>
          {/* Creator Brand Logo (25% reduced size, strictly top-left edge aligned to 1280px) */}
          <div style={{ display: 'flex', alignItems: 'center', zIndex: 1001, cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
            {effectiveLogoUrl ? (
              <img 
                src={effectiveLogoUrl} 
                alt={effectiveArtistName} 
                style={{ 
                  height: '36px', 
                  width: 'auto', 
                  maxHeight: '42px', 
                  maxWidth: '180px',
                  objectFit: 'contain', 
                  borderRadius: '3px', 
                  filter: isLight ? 'none' : 'drop-shadow(0 2px 10px rgba(0,0,0,0.6))' 
                }} 
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '3px',
                  background: effectiveAccent,
                  color: '#000',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 14px ${effectiveAccent}88`
                }}>
                  {effectiveArtistName.charAt(0)}
                </div>
                <div style={{ fontWeight: 900, fontSize: '1.2rem', color: isLight ? '#0f172a' : '#fff', letterSpacing: '-0.3px', fontFamily: effectiveFont, textShadow: isLight ? 'none' : '0 2px 10px rgba(0,0,0,0.8)' }}>
                  {effectiveArtistName}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Top Menu */}
          <nav className="desktop-nav">
            {epkData?.menuItems && Array.isArray(epkData.menuItems) && epkData.menuItems.length > 0 ? (
              epkData.menuItems.map(item => {
                const targetTab = mapTabKey(item.label)
                const isSelected = activeTab === targetTab || (targetTab === 'home' && activeTab === 'home')
                return (
                  <button 
                    key={item.id || item.label} 
                    onClick={() => setActiveTab(targetTab)} 
                    style={{ background: isSelected ? effectiveAccent : 'transparent', color: isSelected ? '#000' : (isLight ? '#0f172a' : '#ffffff'), border: 'none', padding: '7px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}
                  >
                    {item.label}
                  </button>
                )
              })
            ) : (
              <>
                <button onClick={() => setActiveTab('home')} style={{ background: activeTab === 'home' ? effectiveAccent : 'transparent', color: activeTab === 'home' ? '#000' : (isLight ? '#0f172a' : '#ffffff'), border: 'none', padding: '7px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                  <RiHomeFill /> Home
                </button>
                <button onClick={() => setActiveTab('bio')} style={{ background: activeTab === 'bio' ? effectiveAccent : 'transparent', color: activeTab === 'bio' ? '#000' : (isLight ? '#0f172a' : '#ffffff'), border: 'none', padding: '7px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                  <RiUserFill /> Bio
                </button>
                <button onClick={() => setActiveTab('shows')} style={{ background: activeTab === 'shows' ? effectiveAccent : 'transparent', color: activeTab === 'shows' ? '#000' : (isLight ? '#0f172a' : '#ffffff'), border: 'none', padding: '7px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                  <RiCalendarEventFill /> Shows
                </button>
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                  <button onClick={() => setMediaDropdownOpen(!mediaDropdownOpen)} style={{ background: (activeTab === 'media' || activeTab === 'discography') ? effectiveAccent : 'transparent', color: (activeTab === 'media' || activeTab === 'discography') ? '#000' : (isLight ? '#0f172a' : '#ffffff'), border: 'none', padding: '7px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                    <RiVideoFill /> Media <RiArrowDownSLine />
                  </button>
                  {mediaDropdownOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '6px', background: isLight ? '#fff' : '#0a0d18', border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', minWidth: '180px', zIndex: 1100, overflow: 'hidden' }}>
                      <div onClick={() => { setActiveTab('media'); setMediaFilter('all'); setMediaDropdownOpen(false); }} style={{ padding: '10px 14px', color: isLight ? '#0f172a' : '#fff', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RiVideoFill /> All Media
                      </div>
                      <div onClick={() => { setActiveTab('discography'); setMediaDropdownOpen(false); }} style={{ padding: '10px 14px', color: isLight ? '#0f172a' : '#fff', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RiDiscFill /> Discography & Albums
                      </div>
                      <div onClick={() => { setActiveTab('media'); setMediaFilter('gallery'); setMediaDropdownOpen(false); }} style={{ padding: '10px 14px', color: isLight ? '#0f172a' : '#fff', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RiImageFill /> Photo Gallery
                      </div>
                      <div onClick={() => { setActiveTab('media'); setMediaFilter('videos'); setMediaDropdownOpen(false); }} style={{ padding: '10px 14px', color: isLight ? '#0f172a' : '#fff', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RiVideoFill /> 4K Videos
                      </div>
                      <div onClick={() => { setActiveTab('pricing'); setMediaDropdownOpen(false); }} style={{ padding: '10px 14px', color: effectiveAccent, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                        <RiCoinsFill /> Fan Top Up Pricing
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={() => setActiveTab('store')} style={{ background: activeTab === 'store' ? effectiveAccent : 'transparent', color: activeTab === 'store' ? '#000' : (isLight ? '#0f172a' : '#ffffff'), border: 'none', padding: '7px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                  <RiShoppingBagFill /> Store
                </button>
                <button onClick={() => setActiveTab('press')} style={{ background: activeTab === 'press' ? effectiveAccent : 'transparent', color: activeTab === 'press' ? '#000' : (isLight ? '#0f172a' : '#ffffff'), border: 'none', padding: '7px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                  <RiFileTextFill /> Press Kit
                </button>
                <button onClick={() => setActiveTab('contact')} style={{ background: activeTab === 'contact' ? effectiveAccent : 'transparent', color: activeTab === 'contact' ? '#000' : (isLight ? '#0f172a' : '#ffffff'), border: 'none', padding: '7px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                  <RiMailFill /> Contact
                </button>
              </>
            )}
          </nav>

          {/* Right Action Controls: Cart, Fan Portal / VIP Modal, Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1001 }}>
            <button onClick={() => setCartOpen(true)} title="View Shopping Cart" style={{ position: 'relative', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', width: '38px', height: '38px', borderRadius: '3px', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RiShoppingBasket2Fill />
              {totalCartQty > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: effectiveAccent, color: '#000', fontSize: '0.7rem', fontWeight: 900, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {totalCartQty}
                </span>
              )}
            </button>

            {/* Fan Portal Access Button (Restrained to 1280px layout container boundary) */}
            {fanUser ? (
              <button 
                onClick={() => setFanPortalOpen(true)} 
                title="Open Creator Fan Portal"
                style={{ 
                  background: 'rgba(34, 211, 238, 0.15)', 
                  border: '1px solid rgba(34, 211, 238, 0.5)', 
                  color: '#fff', 
                  padding: '7px 14px', 
                  borderRadius: '3px', 
                  fontWeight: 800, 
                  fontSize: '0.82rem', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                <RiShieldCheckFill style={{ color: effectiveAccent, fontSize: '1.05rem' }} /> Fan Portal
              </button>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)} 
                title="Join VIP Fan Club"
                style={{ 
                  background: effectiveAccent, 
                  color: '#000', 
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '3px', 
                  fontWeight: 900, 
                  fontSize: '0.82rem', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  boxShadow: `0 2px 12px ${effectiveAccent}44`,
                  transition: 'all 0.2s ease'
                }}
              >
                <RiUserAddFill /> VIP Fan Club
              </button>
            )}

            <button className="mobile-hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '38px', height: '38px', borderRadius: '3px', fontSize: '1.3rem', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}>
              {mobileMenuOpen ? <RiCloseFill /> : <RiMenuFill />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '68px',
          left: 0,
          right: 0,
          bottom: 0,
          background: isLight ? 'rgba(255,255,255,0.98)' : 'rgba(6, 8, 18, 0.98)',
          backdropFilter: 'blur(16px)',
          zIndex: 999,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {(epkData?.menuItems || DEFAULT_MENU).map(item => {
            const targetTab = mapTabKey(item.label)
            const isSelected = activeTab === targetTab
            return (
              <button
                key={item.id || item.label}
                onClick={() => {
                  setActiveTab(targetTab)
                  setMobileMenuOpen(false)
                }}
                style={{
                  background: isSelected ? effectiveAccent : 'transparent',
                  color: isSelected ? '#000' : (isLight ? '#0f172a' : '#fff'),
                  border: `1px solid ${isSelected ? effectiveAccent : 'rgba(255,255,255,0.1)'}`,
                  padding: '12px 18px',
                  borderRadius: '4px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      )}

      {/* ================= 2. HERO CAROUSEL ================= */}
      {activeTab === 'home' && (
        <section style={{ position: 'relative', height: '520px', backgroundImage: currentSlide?.img ? `url(${currentSlide.img})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '80px 32px 48px', transition: 'background-image 0.8s ease-in-out', margin: 0 }}>
          <div style={{ position: 'absolute', inset: 0, background: isLight ? 'linear-gradient(to top, rgba(248,250,252,0.95) 0%, rgba(248,250,252,0.50) 60%, rgba(248,250,252,0.7) 100%)' : 'linear-gradient(to top, rgba(4,6,14,0.98) 0%, rgba(4,6,14,0.40) 60%, rgba(4,6,14,0.65) 100%)' }} />

          {/* HERO Arrows Constrained to Content Width (e.g. 1280px / 960px) */}
          {heroSlides && heroSlides.length > 1 && (
            <div style={{
              position: 'absolute',
              inset: 0,
              maxWidth: maxContentWidth !== '100%' ? maxContentWidth : undefined,
              margin: '0 auto',
              pointerEvents: 'none',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <button
                onClick={() => setCurrentSlideIndex(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                style={{
                  pointerEvents: 'auto',
                  background: 'rgba(0,0,0,0.65)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#fff',
                  width: '42px',
                  height: '42px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.5)'
                }}
              >
                <RiArrowLeftSLine style={{ fontSize: '1.6rem' }} />
              </button>
              <button
                onClick={() => setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length)}
                style={{
                  pointerEvents: 'auto',
                  background: 'rgba(0,0,0,0.65)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#fff',
                  width: '42px',
                  height: '42px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.5)'
                }}
              >
                <RiArrowRightSLine style={{ fontSize: '1.6rem' }} />
              </button>
            </div>
          )}
          
          {(() => {
            const animClass = (epkData?.heroAnimStyle === 'fade' || epkData?.heroAnimStyle === 'fade-seq') ? 'anim-fade-seq' : 'anim-synergy'
            const title1 = currentSlide?.title1 || epkData?.heroTitle1 || currentSlide?.title || effectiveArtistName
            const title2 = currentSlide?.title2 || epkData?.heroTitle2 || currentSlide?.subtitle || effectiveHeadline
            const title3 = currentSlide?.title3 || epkData?.heroTitle3 || "100% Pre-Cleared One-Stop Sync Licensing & Master Stems • TuneStream Lossless"
            return (
              <div
                key={currentSlideIndex}
                className={`hero-titles-wrapper ${animClass}`}
                style={{ position: 'relative', zIndex: 10, maxWidth: maxContentWidth, margin: '0 auto', textAlign: 'center' }}
              >
                <div className="hero-title-1" style={{ color: isLight ? '#0f172a' : '#fff', fontFamily: effectiveFont }}>
                  {title1}
                </div>
                <div className="hero-title-2" style={{ color: effectiveAccent, fontFamily: effectiveFont }}>
                  {title2}
                </div>
                <div className="hero-title-3" style={{ color: isLight ? '#475569' : 'rgba(255,255,255,0.88)', fontFamily: effectiveFont }}>
                  {title3}
                </div>
              </div>
            )
          })()}
            {/* Hero Music Player - Shifted down 60px to 82px margin with Cycling Playlist */}
            {(() => {
              const currentTrack = tracks[playlistIndex] || tracks[0] || activeTrack
              return (
                <div style={{
                  background: isLight ? '#ffffff' : selectedTheme.cardBg,
                  backdropFilter: 'blur(16px)',
                  border: `1px solid ${effectiveAccent}55`,
                  borderRadius: '3px',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxWidth: '560px',
                  width: '92%',
                  margin: '82px auto 0',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
                  textAlign: 'left',
                  position: 'relative',
                  zIndex: 25
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={currentTrack.coverArt || 'https://picsum.photos/seed/track_art/400'}
                      alt={currentTrack.title}
                      style={{ width: '48px', height: '48px', borderRadius: '3px', objectFit: 'cover', border: `1px solid ${effectiveAccent}44` }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 900, fontSize: '0.98rem', color: isLight ? '#0f172a' : '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {currentTrack.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: effectiveAccent, marginTop: '2px', fontWeight: 700, display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span>ISRC: {currentTrack.isrc}</span>
                        <span>•</span>
                        <span>Lossless 24-Bit / 96kHz</span>
                      </div>
                    </div>

                    {/* View Track Button */}
                    <button
                      onClick={() => setSelectedTrackModal(currentTrack)}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: `1px solid ${effectiveAccent}66`,
                        color: isLight ? '#0f172a' : '#fff',
                        padding: '6px 12px',
                        borderRadius: '3px',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <RiMusic2Fill style={{ color: effectiveAccent }} /> View Track
                    </button>
                  </div>

                  {/* Playlist Controls & Scrubber */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {/* Previous Track */}
                      <button
                        onClick={() => {
                          setPlaylistIndex(curr => (curr === 0 ? tracks.length - 1 : curr - 1))
                          setPlaybackProgress(0)
                        }}
                        title="Previous Track"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '3px',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: isLight ? '#0f172a' : '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem'
                        }}
                      >
                        <RiSkipBackFill />
                      </button>

                      {/* Play / Pause */}
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        title={isPlaying ? "Pause" : "Play"}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '3px',
                          background: effectiveAccent,
                          border: 'none',
                          color: '#000',
                          fontSize: '1.25rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 2px 10px ${effectiveAccent}55`
                        }}
                      >
                        {isPlaying ? <RiPauseFill /> : <RiPlayFill />}
                      </button>

                      {/* Stop */}
                      <button
                        onClick={() => {
                          setIsPlaying(false)
                          setPlaybackProgress(0)
                        }}
                        title="Stop"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '3px',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: isLight ? '#0f172a' : '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.9rem'
                        }}
                      >
                        <RiStopFill />
                      </button>

                      {/* Next Track */}
                      <button
                        onClick={() => {
                          setPlaylistIndex(curr => (curr + 1) % tracks.length)
                          setPlaybackProgress(0)
                        }}
                        title="Next Track"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '3px',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: isLight ? '#0f172a' : '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem'
                        }}
                      >
                        <RiSkipForwardFill />
                      </button>
                    </div>

                    {/* Scrubber Bar */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.68rem', color: isLight ? '#64748b' : '#94a3b8', minWidth: '28px', textAlign: 'right' }}>
                        {Math.floor(playbackProgress / 60)}:{String(playbackProgress % 60).padStart(2, '0')}
                      </span>
                      <div
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect()
                          const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
                          setPlaybackProgress(Math.floor(pct * 225))
                        }}
                        style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.12)', borderRadius: '3px', position: 'relative', cursor: 'pointer' }}
                      >
                        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${Math.min(100, (playbackProgress / 225) * 100)}%`, background: effectiveAccent, borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '0.68rem', color: isLight ? '#64748b' : '#94a3b8', minWidth: '28px' }}>
                        {currentTrack.duration || '3:45'}
                      </span>
                    </div>

                    {/* Track counter badge */}
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: effectiveAccent, padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', border: `1px solid ${effectiveAccent}33` }}>
                      {playlistIndex + 1}/{tracks.length}
                    </span>
                  </div>
                </div>
              )
            })()}
        </section>
      )}

      {/* Dynamic Page Header Banner - Customized per Page Tab */}
      {activeTab !== 'home' && (
        <section style={{ position: 'relative', height: '260px', backgroundImage: `url(${getPageHeader(activeTab)})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 32px 0' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,6,14,0.98) 0%, rgba(4,6,14,0.65) 100%)' }} />
          <div className="anim-fade-up" style={{ position: 'relative', zIndex: 10, maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', margin: '0 auto 6px auto', fontWeight: 900, fontFamily: effectiveFont, color: '#fff', textTransform: 'capitalize', textAlign: 'center' }}>
              {activeTab === 'press' ? 'Electronic Press Kit (EPK)' :
               activeTab === 'discography' ? 'Music & Discography' :
               activeTab === 'contact' ? 'Booking & Inquiries' :
               activeTab === 'shows' ? 'Live Shows & Tour Dates' :
               activeTab === 'store' ? 'Official Store & Merchandise' :
               activeTab === 'media' ? 'Videos & 4K Media Reel' :
               activeTab === 'pricing' ? 'Fan VIP Memberships & TM Credit Top-Ups' :
               activeTab === 'event-detail' ? (selectedEventDetail?.venue || 'Event Showcase & Purchasing') :
               activeTab === 'album-detail' ? (selectedAlbumDetail?.title || 'Album Showcase & Tracklist') :
               activeTab}
            </h1>
            <p style={{ margin: '0 auto', color: effectiveAccent, fontSize: '1rem', fontWeight: 700, textAlign: 'center' }}>
              {activeTab === 'event-detail' ? `${selectedEventDetail?.city || ''} - ${selectedEventDetail?.date || ''} - Full Purchasing Protocol` :
               activeTab === 'album-detail' ? `${selectedAlbumDetail?.type || 'Album'} - Released ${selectedAlbumDetail?.year || '2026'} - 24-Bit / 96kHz Master` :
               `Official Standalone Creator Web World - ${effectiveArtistName}`}
            </p>
          </div>
        </section>
      )}

      {/* ================= 3. MAIN BODY CONTENT ================= */}
      <main style={{ flex: 1, padding: '40px 32px', maxWidth: maxContentWidth, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        
        {/* ================= TAB 1: HOME ================= */}
        {activeTab === 'home' && (
          effectiveVariant === 'aside-left' ? (
            <div className="epk-aside-layout">
              {/* Aside on the Left */}
              <aside className="epk-sticky-aside" style={{ display: 'flex', flexDirection: 'column', gap: '22px', position: 'sticky', top: '90px' }}>
                {/* Creator Overview Card */}
                <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', padding: '22px', borderRadius: '4px', boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.04)' : 'none' }}>
                  <div style={{ fontWeight: 900, fontSize: '1.25rem', color: effectiveAccent, marginBottom: '6px', fontFamily: effectiveFont }}>
                    {effectiveArtistName}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: isLight ? '#475569' : '#94a3b8', lineHeight: 1.55, marginBottom: '14px' }}>
                    {effectiveBio.slice(0, 190)}{effectiveBio.length > 190 ? '...' : ''}
                  </div>
                  <button onClick={() => setActiveTab('bio')} style={{ background: 'transparent', border: `1px solid ${effectiveAccent}55`, color: effectiveAccent, padding: '7px 12px', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', width: '100%', marginBottom: '14px' }}>
                    Read Full Bio ➔
                  </button>

                  <div style={{ padding: '12px 14px', background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)', borderRadius: '4px', border: `1px solid ${effectiveAccent}33` }}>
                    <div style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Your Balance</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: effectiveAccent, marginBottom: '8px' }}>{userCredits} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isLight ? '#64748b' : '#cbd5e1' }}>Credits</span></div>
                    <button
                      onClick={() => setActiveTab('pricing')}
                      style={{
                        width: '100%',
                        background: effectiveAccent,
                        color: '#000',
                        border: 'none',
                        padding: '7px 12px',
                        borderRadius: '3px',
                        fontWeight: 900,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: `0 2px 10px ${effectiveAccent}44`,
                        transition: 'all 0.15s ease'
                      }}
                      title="Top up TM Credits"
                    >
                      <RiCoinsFill size={14} /> + Top-Up Credits
                    </button>
                  </div>
                </div>

                {/* World Tour Shows in Left Aside with Flyer Thumbnails & View Event */}
                <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', padding: '22px', borderRadius: '3px', boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.04)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: effectiveAccent, fontFamily: effectiveFont }}>
                      Live Tour Dates
                    </h4>
                    <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8' }}>World Tour 2026</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {shows.slice(0, 3).map(s => (
                      <div key={s.id} style={{ borderBottom: isLight ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', display: 'flex', gap: '12px' }}>
                        <img 
                          src={s.flyer || 'https://picsum.photos/seed/flyer_thumb/300/400'} 
                          alt={s.venue} 
                          style={{ width: '54px', height: '72px', objectFit: 'cover', borderRadius: '3px', border: `1px solid ${effectiveAccent}33` }} 
                        />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: isLight ? '#0f172a' : '#fff' }}>{s.venue}</div>
                            <div style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8', margin: '2px 0 6px' }}>{s.city} • {s.date}</div>
                          </div>
                          <button 
                            onClick={() => { setSelectedEventDetail(s); setEventTicketSuccess(null); setActiveTab("event-detail"); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                            style={{ 
                              background: effectiveAccent, 
                              border: 'none', 
                              color: '#000', 
                              padding: '5px 10px', 
                              borderRadius: '3px', 
                              fontWeight: 800, 
                              fontSize: '0.74rem', 
                              cursor: 'pointer', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              gap: '4px' 
                            }}
                          >
                            <RiTicket2Fill /> View Event
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main Content Column on the Right */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                {/* TuneStream Catalog */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: effectiveAccent, margin: 0, fontFamily: effectiveFont }}>
                        Featured Singles
                      </h2>
                      <div style={{ fontSize: '0.85rem', color: isLight ? '#64748b' : '#94a3b8', marginTop: '2px' }}>
                        Lossless 24-Bit Stems & Multitrack Recordings
                      </div>
                    </div>

                    <button onClick={() => setActiveTab('discography')} style={{ background: 'transparent', border: `1px solid ${effectiveAccent}`, color: effectiveAccent, padding: '8px 18px', borderRadius: '3px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <RiDiscFill /> View All Albums <RiArrowRightLine />
                    </button>
                  </div>

                  {creditPurchaseSuccess && (
                    <div style={{ padding: '14px 18px', background: 'rgba(0, 255, 128, 0.15)', border: '1px solid #00ff80', borderRadius: '3px', color: '#00ff80', marginBottom: '18px', fontSize: '0.9rem' }}>
                      <RiCheckFill /> Lossless WAV Stems for <strong>{creditPurchaseSuccess.track.title}</strong> purchased! 50 Credits deducted. Remaining Balance: {creditPurchaseSuccess.remainingCredits} Credits.
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px' }}>
                    {tracks.map(t => {
                      const isCurrent = activeTrack?.id === t.id;
                      return (
                        <div key={t.id} style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', padding: '14px', borderRadius: '3px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.04)' : 'none' }}>
                          <div>
                            {/* 1:1 Aspect Ratio Streaming Cover Artwork */}
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px', background: '#0a0f1d' }}>
                              <img src={t.coverArt} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '10px' }}>
                                <button
                                  type="button"
                                  onClick={() => { setActiveTrack(t); setIsPlaying(isCurrent ? !isPlaying : true); }}
                                  title={isCurrent && isPlaying ? "Pause" : "Play"}
                                  style={{ width: '40px', height: '40px', borderRadius: '3px', background: effectiveAccent, border: 'none', color: '#000', fontSize: '1.3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.6)' }}
                                >
                                  {isCurrent && isPlaying ? <RiPauseFill /> : <RiPlayFill />}
                                </button>
                              </div>
                              {t.release && (
                                <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', color: effectiveAccent, padding: '3px 8px', borderRadius: '3px', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                  {t.release}
                                </span>
                              )}
                            </div>

                            <h4 style={{ margin: '2px 0 4px', fontSize: '1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</h4>
                            <div style={{ fontSize: '0.74rem', color: isLight ? '#64748b' : '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>ISRC: {t.isrc}</span>
                              <span>{t.streams} plays</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
                            <button onClick={() => { setActiveTrack(t); setIsPlaying(isCurrent ? !isPlaying : true); }} style={{ background: isCurrent && isPlaying ? effectiveAccent : (isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.08)'), color: isCurrent && isPlaying ? '#000' : (isLight ? '#0f172a' : '#fff'), border: `1px solid ${effectiveAccent}44`, padding: '8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem' }}>
                              {isCurrent && isPlaying ? <><RiPauseFill /> Playing Master</> : <><RiPlayFill /> Stream on TuneStream</>}
                            </button>
                            <button onClick={() => handlePurchaseTrackWithCredits(t)} style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.82rem' }}>
                              Buy Multitracks ({t.priceCredits} Credits)
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Video Carousel Reel */}
                <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: effectiveAccent, fontFamily: effectiveFont }}>
                        Featured 4K Video Reel
                      </h3>
                      <div style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8' }}>Configured YouTube video stream</div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setLandingVideoIndex(prev => (prev === 0 ? videoCarouselItems.length - 1 : prev - 1))} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '34px', height: '34px', borderRadius: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RiArrowLeftSLine />
                      </button>
                      <button onClick={() => setLandingVideoIndex(prev => (prev + 1) % videoCarouselItems.length)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '34px', height: '34px', borderRadius: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RiArrowRightSLine />
                      </button>
                    </div>
                  </div>

                  <div style={{ position: 'relative', borderRadius: '3px', overflow: 'hidden' }}>
                    <img src={currentVideoItem.thumbnail} alt="Featured Video" style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '3px' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <span style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: effectiveAccent, padding: '4px 10px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 800 }}>
                          {currentVideoItem.views}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                        <div>
                          <h4 style={{ margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 900, color: '#fff' }}>
                            {currentVideoItem.title}
                          </h4>
                          <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Stream directly from YouTube embed engine</div>
                        </div>

                        <button onClick={() => setSelectedMedia(currentVideoItem)} style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '9px 20px', borderRadius: '3px', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <RiPlayFill /> Stream YouTube Video
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }}>
              {/* TuneStream Catalog */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: effectiveAccent, margin: 0, fontFamily: effectiveFont }}>
                      Featured Singles
                    </h2>
                    <div style={{ fontSize: '0.85rem', color: isLight ? '#64748b' : '#94a3b8', marginTop: '2px' }}>
                      Balance: <strong style={{ color: effectiveAccent }}>{userCredits} Intermaven Credits</strong>
                    </div>
                  </div>

                  <button onClick={() => setActiveTab('discography')} style={{ background: 'transparent', border: `1px solid ${effectiveAccent}`, color: effectiveAccent, padding: '8px 18px', borderRadius: '3px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RiDiscFill /> View Full Discography <RiArrowRightLine />
                  </button>
                </div>

                {creditPurchaseSuccess && (
                  <div style={{ padding: '14px 18px', background: 'rgba(0, 255, 128, 0.15)', border: '1px solid #00ff80', borderRadius: '3px', color: '#00ff80', marginBottom: '18px', fontSize: '0.9rem' }}>
                    <RiCheckFill /> Lossless WAV Stems for <strong>{creditPurchaseSuccess.track.title}</strong> purchased! 50 Credits deducted. Remaining Balance: {creditPurchaseSuccess.remainingCredits} Credits.
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  {tracks.map(t => {
                    const isCurrent = activeTrack?.id === t.id;
                    return (
                      <div key={t.id} style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '3px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.04)' : 'none' }}>
                        <div>
                          {/* 1:1 Aspect Ratio Streaming Cover Artwork */}
                          <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px', background: '#0a0f1d' }}>
                            <img src={t.coverArt} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '12px' }}>
                              <button
                                type="button"
                                onClick={() => { setActiveTrack(t); setIsPlaying(isCurrent ? !isPlaying : true); }}
                                title={isCurrent && isPlaying ? "Pause" : "Play"}
                                style={{ width: '42px', height: '42px', borderRadius: '3px', background: effectiveAccent, border: 'none', color: '#000', fontSize: '1.35rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.6)' }}
                              >
                                {isCurrent && isPlaying ? <RiPauseFill /> : <RiPlayFill />}
                              </button>
                            </div>
                            {t.release && (
                              <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', color: effectiveAccent, padding: '3px 8px', borderRadius: '3px', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                {t.release}
                              </span>
                            )}
                          </div>

                          <h4 style={{ margin: '4px 0', fontSize: '1.05rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</h4>
                          <div style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>ISRC: {t.isrc}</span>
                            <span>{t.streams} plays</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                          <button onClick={() => { setActiveTrack(t); setIsPlaying(isCurrent ? !isPlaying : true); }} style={{ background: isCurrent && isPlaying ? effectiveAccent : (isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.08)'), color: isCurrent && isPlaying ? '#000' : (isLight ? '#0f172a' : '#fff'), border: `1px solid ${effectiveAccent}44`, padding: '8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}>
                            {isCurrent && isPlaying ? <><RiPauseFill /> Playing Master</> : <><RiPlayFill /> Stream on TuneStream</>}
                          </button>
                          <button onClick={() => handlePurchaseTrackWithCredits(t)} style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>
                            Buy Multitracks ({t.priceCredits} Credits)
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Featured Tour Spotlight */}
              <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', padding: '28px', borderRadius: '4px' }}>
                <h3 style={{ marginTop: 0, fontSize: '1.4rem', fontWeight: 900, color: effectiveAccent, fontFamily: effectiveFont, textAlign: 'center' }}>
                  Featured World Tour Dates
                </h3>
                {shows.slice(0, 3).map(s => (
                  <div key={s.id} style={{ padding: '16px 0', borderBottom: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: isLight ? '#0f172a' : '#fff' }}>{s.venue}</div>
                      <div style={{ fontSize: '0.85rem', color: isLight ? '#64748b' : '#94a3b8' }}>{s.city} • {s.date}</div>
                    </div>
                    <button onClick={() => { setSelectedEventDetail(s); setEventTicketSuccess(null); setActiveTab("event-detail"); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ background: effectiveAccent, border: 'none', color: '#000', padding: '8px 18px', borderRadius: '3px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>
                      Reserve Tickets (From ${s.priceGA})
                    </button>
                  </div>
                ))}
              </div>

              {/* VIDEO CAROUSEL CONTENT AREA WITH YOUTUBE EMBED STREAMING */}
              <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', padding: '28px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: effectiveAccent, fontFamily: effectiveFont }}>
                      Featured 4K Video Reel (YouTube Streaming Engine)
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: isLight ? '#64748b' : '#94a3b8' }}>Official YouTube video streams configured via Intermaven Backend</div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setLandingVideoIndex(prev => (prev === 0 ? videoCarouselItems.length - 1 : prev - 1))} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '34px', height: '34px', borderRadius: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RiArrowLeftSLine />
                    </button>
                    <button onClick={() => setLandingVideoIndex(prev => (prev + 1) % videoCarouselItems.length)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '34px', height: '34px', borderRadius: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RiArrowRightSLine />
                    </button>
                  </div>
                </div>

                <div style={{ position: 'relative', borderRadius: '3px', overflow: 'hidden' }}>
                  <img src={currentVideoItem.thumbnail} alt="Featured Video" style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '3px' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <span style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: effectiveAccent, padding: '4px 10px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 800 }}>
                        {currentVideoItem.views}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                          {currentVideoItem.title}
                        </h4>
                        <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Stream directly from YouTube embed engine</div>
                      </div>

                      <button onClick={() => setSelectedMedia(currentVideoItem)} style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '10px 22px', borderRadius: '3px', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <RiPlayFill /> Stream YouTube Video
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Ecosystem Content Box 1: SyncMavens One-Stop Sync Licensing Clearance */}
              <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', padding: '28px', borderRadius: '4px', boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.04)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <RiShieldCheckFill style={{ color: effectiveAccent, fontSize: '1.2rem' }} />
                      <span style={{ fontSize: '0.78rem', color: effectiveAccent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>SyncMavens One-Stop Clearance</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#fff', fontFamily: effectiveFont }}>
                      Film, TV & Game Sync Licensing Clearance
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: isLight ? '#64748b' : '#94a3b8', marginTop: '2px' }}>
                      100% Pre-cleared Master & Publishing rights with automated PRO split transparent cue sheets
                    </div>
                  </div>

                  <button onClick={() => setActiveTab('contact')} style={{ background: 'transparent', border: `1px solid ${effectiveAccent}`, color: effectiveAccent, padding: '8px 18px', borderRadius: '3px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>
                    Request Custom Sync License ➔
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  {[
                    { title: 'Lossless 24-Bit Audio', desc: 'Broadcast-ready WAV audio stems & instrumental cues' },
                    { title: 'Automated Split Cascade', desc: 'Split ledgers with transparent PRO attribution' },
                    { title: 'Commercial Use Cleared', desc: 'Pre-cleared for streaming, film, advertising & gaming' },
                    { title: 'Rapid Turnaround', desc: 'Direct clearance through Intermaven publishing registry' }
                  ].map((perk, idx) => (
                    <div key={idx} style={{ padding: '14px 16px', background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)', border: `1px solid ${effectiveAccent}22`, borderRadius: '4px' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: effectiveAccent, marginBottom: '4px' }}>{perk.title}</div>
                      <div style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8', lineHeight: 1.5 }}>{perk.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ecosystem Content Box 2: VIP Fan Club & Direct Creator Commerce */}
              <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', padding: '28px', borderRadius: '4px', boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.04)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 6px', fontSize: '1.4rem', fontWeight: 900, color: effectiveAccent, fontFamily: effectiveFont }}>
                      VIP Fan Vault & Multitrack Access
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: isLight ? '#475569' : '#94a3b8', maxWidth: '600px', lineHeight: 1.5 }}>
                      Join {effectiveArtistName}'s inner circle to receive unreleased studio stems, secret tour presale codes, limited vinyl drops, and direct creator updates.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setAuthModalOpen(true)} style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '10px 22px', borderRadius: '3px', fontWeight: 900, fontSize: '0.88rem', cursor: 'pointer' }}>
                      Join VIP Fan Vault
                    </button>
                    <button onClick={() => setActiveTab('store')} style={{ background: 'transparent', border: `1px solid ${effectiveAccent}`, color: effectiveAccent, padding: '10px 20px', borderRadius: '3px', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer' }}>
                      Browse Merch Store ➔
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )
        )}

        {/* ================= TAB 2: BIO ================= */}
        {activeTab === 'bio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '36px', borderRadius: '4px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', color: isLight ? '#0f172a' : '#fff', boxShadow: isLight ? '0 4px 14px rgba(0,0,0,0.05)' : 'none' }}>
              <h2 style={{ color: effectiveAccent, marginTop: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: effectiveFont, textAlign: 'center' }}>
                Biography & Artist Heritage
              </h2>
              <div style={{ overflow: 'hidden', marginTop: '24px' }}>
                {/* Profile / Selected Image - Left Justified & Word Wrapped */}
                <img
                  src={epkData?.profilePhoto || epkData?.heroImage || heroSlide1}
                  alt={`${effectiveArtistName} Profile`}
                  style={{
                    float: 'left',
                    marginRight: '28px',
                    marginBottom: '20px',
                    width: '100%',
                    maxWidth: '320px',
                    height: '380px',
                    objectFit: 'cover',
                    borderRadius: '3px',
                    border: `1px solid ${effectiveAccent}55`,
                    boxShadow: '0 12px 35px rgba(0,0,0,0.5)'
                  }}
                />

                {effectiveBio && effectiveBio.includes('<') ? (
                  <div
                    className="rich-bio-content"
                    dangerouslySetInnerHTML={{ __html: effectiveBio }}
                    style={{ lineHeight: '1.85', fontSize: '1.08rem', color: isLight ? '#334155' : '#e2e8f0' }}
                  />
                ) : (
                  <div style={{ lineHeight: '1.85', fontSize: '1.08rem', color: isLight ? '#334155' : '#e2e8f0', whiteSpace: 'pre-line' }}>
                    {effectiveBio}
                  </div>
                )}
              </div>
{epkData?.pressQuote && (
                <div style={{ marginTop: '28px', padding: '18px 22px', background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', borderLeft: `4px solid ${effectiveAccent}`, borderRadius: '4px' }}>
                  <p style={{ fontStyle: 'italic', margin: '0 0 6px', fontSize: '1.05rem', color: isLight ? '#1e293b' : '#f1f5f9' }}>"{epkData.pressQuote}"</p>
                  <strong style={{ color: effectiveAccent, fontSize: '0.88rem' }}>— {epkData.pressOutlet || 'Press Review'}</strong>
                </div>
              )}
            </div>

            {/* Artist Accolades & Studio Protocol Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
              <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '24px', borderRadius: '4px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
                <h4 style={{ margin: '0 0 10px', color: effectiveAccent, fontSize: '1.05rem', fontWeight: 800 }}>Primary Creative Pathway</h4>
                <div style={{ fontSize: '0.9rem', color: isLight ? '#475569' : '#cbd5e1' }}>{epkData?.creatorPathway || 'Performing Artist & Multitrack Producer'}</div>
                <div style={{ marginTop: '10px', fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8' }}>Verified Intermaven Creator ID: IMC-2026-904</div>
              </div>
              <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '24px', borderRadius: '4px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
                <h4 style={{ margin: '0 0 10px', color: effectiveAccent, fontSize: '1.05rem', fontWeight: 800 }}>Studio & Audio Specs</h4>
                <div style={{ fontSize: '0.9rem', color: isLight ? '#475569' : '#cbd5e1' }}>24-Bit / 96kHz Lossless Broadcast Masters</div>
                <div style={{ marginTop: '10px', fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8' }}>Stems available for sync & licensing</div>
              </div>
              <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '24px', borderRadius: '4px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
                <h4 style={{ margin: '0 0 10px', color: effectiveAccent, fontSize: '1.05rem', fontWeight: 800 }}>Direct Representation</h4>
                <div style={{ fontSize: '0.9rem', color: isLight ? '#475569' : '#cbd5e1' }}>{epkData?.bookingEmail || 'booking@tunemavens.com'}</div>
                <div style={{ marginTop: '10px', fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8' }}>Worldwide touring & festival inquiries</div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: DISCOGRAPHY ================= */}
        {activeTab === 'discography' && (
          <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '36px', borderRadius: '4px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ color: effectiveAccent, margin: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: effectiveFont }}>
                  Complete Discography & Album Catalog
                </h2>
                <p style={{ margin: '4px 0 0', color: isLight ? '#64748b' : '#94a3b8' }}>Lossless audio catalog with multitrack stem downloads</p>
              </div>

              <div style={{ position: 'relative', width: '280px' }}>
                <RiSearchLine style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="text" placeholder="Search albums or year..." value={discographySearch} onChange={(e) => { setDiscographySearch(e.target.value); setDiscographyPage(1); }} style={{ width: '100%', padding: '10px 12px 10px 36px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.5)', border: isLight ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: isLight ? '#0f172a' : '#fff', fontSize: '0.85rem' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {paginatedAlbums.map(a => (
                <div key={a.id} style={{ background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.4)', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <img src={a.cover} alt={a.title} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '3px', marginBottom: '14px' }} />
                    <span style={{ fontSize: '0.75rem', color: effectiveAccent, fontWeight: 700, textTransform: 'uppercase' }}>{a.type} • {a.year}</span>
                    <h3 style={{ margin: '4px 0 6px', fontSize: '1.2rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff' }}>{a.title}</h3>
                    <div style={{ fontSize: '0.8rem', color: isLight ? '#64748b' : '#94a3b8' }}>{a.tracksCount} Tracks • {a.streams} Streams</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                    <button
                      onClick={() => {
                        setSelectedAlbumDetail(a)
                        setActiveTab('album-detail')
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      style={{ background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)', color: isLight ? '#0f172a' : '#fff', border: `1px solid ${effectiveAccent}44`, padding: '8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      View Full Album Page ({a.tracksCount} Tracks)
                    </button>
                    <button
                      onClick={() => {
                        setStemsModalTrack({
                          id: a.id,
                          title: a.title,
                          coverArt: a.cover,
                          isrc: a.isrc || 'KE-TM1-26-00042',
                          priceCredits: a.priceCredits || 50
                        })
                        setStemsPurchased(null)
                      }}
                      style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      Buy Multitrack Stems ({a.priceCredits} Credits)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: SHOWS / TOURS ================= */}
        {activeTab === 'shows' && (
          <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '36px', borderRadius: '4px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ color: effectiveAccent, margin: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: effectiveFont }}>
                  Upcoming Live Tour Dates
                </h2>
                <p style={{ margin: '4px 0 0', color: isLight ? '#64748b' : '#94a3b8' }}>Official tour schedule with instant VIP and GA ticket reservations</p>
              </div>

              <div style={{ position: 'relative', width: '280px' }}>
                <RiSearchLine style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="text" placeholder="Search venue or city..." value={showsSearch} onChange={(e) => setShowsSearch(e.target.value)} style={{ width: '100%', padding: '10px 12px 10px 36px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.5)', border: isLight ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: isLight ? '#0f172a' : '#fff', fontSize: '0.85rem' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredShows.map(s => (
                <div key={s.id} style={{ background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.3)', border: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.08)', padding: '16px 20px', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Flyer thumbnail */}
                    <img
                      src={s.flyer || 'https://picsum.photos/seed/flyer_table/300/400'}
                      alt={s.venue}
                      style={{ width: '56px', height: '76px', objectFit: 'cover', borderRadius: '3px', border: `1px solid ${effectiveAccent}44` }}
                    />
                    <div style={{ textAlign: 'center', minWidth: '64px', padding: '8px 12px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)', borderRadius: '3px', border: `1px solid ${effectiveAccent}33` }}>
                      <div style={{ fontSize: '0.72rem', color: effectiveAccent, fontWeight: 800 }}>{s.date.split(' ')[0]}</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: isLight ? '#0f172a' : '#fff' }}>{s.date.split(' ')[1]?.replace(',', '')}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: isLight ? '#0f172a' : '#fff' }}>{s.venue}</div>
                      <div style={{ fontSize: '0.82rem', color: isLight ? '#64748b' : '#94a3b8', marginTop: '2px' }}>{s.city} • Doors 7:00 PM • 18+</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => {
                        setSelectedEventDetail(s)
                        setEventTicketSuccess(null)
                        setActiveTab('event-detail')
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${effectiveAccent}66`,
                        color: effectiveAccent,
                        padding: '8px 16px',
                        borderRadius: '3px',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <RiTicket2Fill /> View Event Page
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEventDetail(s)
                        setEventTicketSuccess(null)
                        setActiveTab('event-detail')
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      style={{
                        background: effectiveAccent,
                        color: '#000',
                        border: 'none',
                        padding: '8px 18px',
                        borderRadius: '3px',
                        fontWeight: 900,
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      Tickets (${s.priceGA})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: MEDIA & GALLERY ================= */}
        {activeTab === 'media' && (
          <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '36px', borderRadius: '4px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ color: effectiveAccent, margin: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: effectiveFont }}>
                  Media & Visual Reel
                </h2>
                <p style={{ margin: '4px 0 0', color: isLight ? '#64748b' : '#94a3b8' }}>Official 4K music video streams & live tour photo galleries</p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {['all', 'videos', 'gallery'].map(f => (
                  <button key={f} onClick={() => setMediaFilter(f)} style={{ padding: '7px 16px', borderRadius: '20px', border: mediaFilter === f ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)', background: mediaFilter === f ? effectiveAccent : 'transparent', color: mediaFilter === f ? '#000' : (isLight ? '#0f172a' : '#fff'), fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', textTransform: 'capitalize' }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
              {filteredMedia.map(m => (
                <div 
                  key={m.id} 
                  onClick={() => {
                    if (m.type === 'gallery') {
                      openGalleryCarousel(m)
                    } else {
                      setSelectedMedia(m)
                    }
                  }} 
                  style={{ background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.4)', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
                >
                  <div style={{ position: 'relative' }}>
                    <img src={m.thumbnail} alt={m.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)', display: 'flex', alignItems: 'flex-end', padding: '14px' }}>
                      <span style={{ background: 'rgba(0,0,0,0.7)', color: effectiveAccent, padding: '3px 8px', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 800 }}>
                        {m.type === 'video' ? '▶ 4K Video' : '📷 Photo'}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff' }}>{m.title}</h4>
                    <div style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8' }}>{m.views}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: STORE / MERCH ================= */}
        {activeTab === 'store' && (
          <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '36px', borderRadius: '3px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ color: effectiveAccent, margin: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: effectiveFont }}>
                  Official Merchandise & Stems Store
                </h2>
                <p style={{ margin: '4px 0 0', color: isLight ? '#64748b' : '#94a3b8' }}>
                  Limited vinyl pressings, apparel, collector boxes & lossless multitrack stems with custom options
                </p>
              </div>

              {/* Comprehensive Category Filter with 3px border radius */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['all', 'vinyl', 'apparel', 'stems', 'collectors'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setStoreCategory(cat)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '3px',
                      border: storeCategory === cat ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)',
                      background: storeCategory === cat ? effectiveAccent : 'rgba(255,255,255,0.04)',
                      color: storeCategory === cat ? '#000' : (isLight ? '#0f172a' : '#fff'),
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {filteredProducts.map(p => (
                <div key={p.id} style={{ background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.4)', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* 50% Larger Product Image Container (330px) with Interactive Carousel */}
                    <div style={{ position: 'relative', width: '100%', height: '330px', marginBottom: '16px', overflow: 'hidden', borderRadius: '3px', background: '#000', border: `1px solid ${effectiveAccent}22` }}>
                      {(() => {
                        const pImgs = p.images && p.images.length > 0 ? p.images : [p.img]
                        const currentIdx = productImageIndices[p.id] || 0
                        const activeImg = pImgs[currentIdx] || p.img

                        return (
                          <>
                            <img
                              src={activeImg}
                              alt={p.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease' }}
                            />
                            <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', color: effectiveAccent, border: `1px solid ${effectiveAccent}44`, fontSize: '0.72rem', padding: '4px 10px', borderRadius: '3px', fontWeight: 900, textTransform: 'uppercase', zIndex: 2 }}>
                              {p.category}
                            </span>

                            {/* Carousel Arrows */}
                            {pImgs.length > 1 && (
                              <>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setProductImageIndices(prev => ({
                                      ...prev,
                                      [p.id]: (currentIdx - 1 + pImgs.length) % pImgs.length
                                    }))
                                  }}
                                  style={{
                                    position: 'absolute',
                                    left: '8px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(0,0,0,0.65)',
                                    color: '#fff',
                                    border: `1px solid ${effectiveAccent}55`,
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    zIndex: 3,
                                    fontSize: '1rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                                  }}
                                  title="Previous image"
                                >
                                  ‹
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setProductImageIndices(prev => ({
                                      ...prev,
                                      [p.id]: (currentIdx + 1) % pImgs.length
                                    }))
                                  }}
                                  style={{
                                    position: 'absolute',
                                    right: '8px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(0,0,0,0.65)',
                                    color: '#fff',
                                    border: `1px solid ${effectiveAccent}55`,
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    zIndex: 3,
                                    fontSize: '1rem',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                                  }}
                                  title="Next image"
                                >
                                  ›
                                </button>

                                {/* Carousel Dots */}
                                <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 3 }}>
                                  {pImgs.map((_, dotIdx) => (
                                    <div
                                      key={dotIdx}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setProductImageIndices(prev => ({ ...prev, [p.id]: dotIdx }))
                                      }}
                                      style={{
                                        width: dotIdx === currentIdx ? '16px' : '6px',
                                        height: '6px',
                                        borderRadius: '3px',
                                        background: dotIdx === currentIdx ? effectiveAccent : 'rgba(255,255,255,0.5)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                      }}
                                    />
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                        )
                      })()}
                    </div>

                    <h4 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff' }}>{p.title}</h4>
                    <p style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8', margin: '0 0 12px', lineHeight: 1.4 }}>{p.desc}</p>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: effectiveAccent, marginBottom: '14px' }}>
                      {p.price}
                    </div>
                  </div>

                  {/* Options / Add to Cart Button */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedProductModal(p)}
                      style={{
                        flex: 1,
                        background: effectiveAccent,
                        color: '#000',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '3px',
                        fontWeight: 900,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <RiShoppingBagFill /> Select Options & Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 7: PRESS KIT (EPK) ================= */}
        {activeTab === 'press' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '36px', borderRadius: '3px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.74rem', background: effectiveAccent, color: '#000', fontWeight: 900, padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                      EPK One-Sheet
                    </span>
                    <span style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8' }}>
                      Verified Intermaven Publishing & Sync Clearance
                    </span>
                  </div>
                  <h2 style={{ color: isLight ? '#0f172a' : '#fff', margin: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: effectiveFont }}>
                    {effectiveArtistName} — Executive Press Kit
                  </h2>
                </div>

                {/* Real Browser Download Button */}
                <button
                  onClick={() => setEpkPreviewModalOpen(true)}
                  style={{
                    background: effectiveAccent,
                    color: '#000',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '3px',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: `0 4px 16px ${effectiveAccent}44`
                  }}
                >
                  <RiDownloadFill /> Download Complete EPK (PDF Preview)
                </button>
              </div>

              {/* Executive Metrics Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                <div style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '3px', border: `1px solid ${effectiveAccent}33` }}>
                  <div style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Total Streams</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: effectiveAccent, marginTop: '4px' }}>4.2M+</div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '2px' }}>↑ 28% this quarter</div>
                </div>
                <div style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '3px', border: `1px solid ${effectiveAccent}33` }}>
                  <div style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Monthly Listeners</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: effectiveAccent, marginTop: '4px' }}>385K</div>
                  <div style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8', marginTop: '2px' }}>Top: Nairobi, London, NYC</div>
                </div>
                <div style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '3px', border: `1px solid ${effectiveAccent}33` }}>
                  <div style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Sync Status</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: effectiveAccent, marginTop: '4px' }}>100%</div>
                  <div style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8', marginTop: '2px' }}>One-Stop Master & Publishing</div>
                </div>
                <div style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '3px', border: `1px solid ${effectiveAccent}33` }}>
                  <div style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Tour Draw</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: effectiveAccent, marginTop: '4px' }}>1,500 - 3,500</div>
                  <div style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8', marginTop: '2px' }}>Cap Venues Sold Out</div>
                </div>
              </div>

              {/* Bio Section */}
              <h3 style={{ margin: '0 0 12px', fontSize: '1.3rem', fontWeight: 900, color: effectiveAccent }}>Biography & Sound Identity</h3>
              {effectiveBio && effectiveBio.includes('<') ? (
                <div
                  className="rich-bio-content"
                  dangerouslySetInnerHTML={{ __html: effectiveBio }}
                  style={{ fontSize: '1.05rem', lineHeight: 1.7, color: isLight ? '#334155' : '#cbd5e1', marginBottom: '28px' }}
                />
              ) : (
                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: isLight ? '#334155' : '#cbd5e1', marginBottom: '28px' }}>
                  {effectiveBio}
                </p>
              )}

              {/* Technical Rider & Stage Plot Spec */}
              <div style={{ background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.3)', border: `1px solid ${effectiveAccent}33`, borderRadius: '3px', padding: '20px', marginBottom: '28px' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '1.1rem', fontWeight: 900, color: effectiveAccent }}>
                  Technical Rider & Live Production Specifications
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', fontSize: '0.85rem', color: isLight ? '#334155' : '#cbd5e1' }}>
                  <div>
                    <strong style={{ color: effectiveAccent }}>Front of House (FOH):</strong>
                    <div style={{ marginTop: '4px' }}>DiGiCo SD12 / Quantum 225 or Avid S6L. Dante 96kHz stream line.</div>
                  </div>
                  <div>
                    <strong style={{ color: effectiveAccent }}>In-Ear Monitoring:</strong>
                    <div style={{ marginTop: '4px' }}>4x Stereo IEM mixes (Sennheiser G4 / Shure PSM1000). No wedges needed.</div>
                  </div>
                  <div>
                    <strong style={{ color: effectiveAccent }}>Backline Requirements:</strong>
                    <div style={{ marginTop: '4px' }}>2x Pioneer CDJ-3000, 1x DJM-A9 / V10, 1x Moog Subsequent 37.</div>
                  </div>
                </div>
              </div>

              {/* Representation Contacts */}
              <div style={{ borderTop: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Worldwide Management</div>
                  <div style={{ fontWeight: 800, color: isLight ? '#0f172a' : '#fff', marginTop: '2px' }}>Intermaven Talent Group (mgmt@intermaven.io)</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Booking Representation</div>
                  <div style={{ fontWeight: 800, color: isLight ? '#0f172a' : '#fff', marginTop: '2px' }}>TuneBooking Agency (booking@tunemaven.com)</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Sync & Stems Clearance</div>
                  <div style={{ fontWeight: 800, color: isLight ? '#0f172a' : '#fff', marginTop: '2px' }}>SyncMavens Global (sync@tunemaven.com)</div>
                </div>
              </div>
            </div>

            {/* Performance Stats & Industry Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
              {[
                { label: 'Total Global Streams', val: '8.4M+' },
                { label: 'Monthly Active Listeners', val: '450K+' },
                { label: 'Film / TV Sync Placements', val: '14 Cleared' },
                { label: 'Tour Tickets Sold', val: '28,000+' }
              ].map((stat, i) => (
                <div key={i} style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '20px', borderRadius: '4px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: effectiveAccent }}>{stat.val}</div>
                  <div style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8', marginTop: '4px', textTransform: 'uppercase', fontWeight: 700 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Press Assets Download Cards */}
            <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '28px', borderRadius: '4px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ margin: '0 0 16px', color: effectiveAccent, fontSize: '1.25rem', fontWeight: 900 }}>
                High-Resolution Media & Technical Riders
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {[
                  { id: 'photos', title: 'Official Press Photos (300 DPI)', desc: 'High-res color & monochrome portraits', format: 'ZIP • 42 MB' },
                  { id: 'rider', title: 'Stage Plot & Technical Rider', desc: 'Channel list, monitor mixes & backline specs', format: 'PDF • 2.4 MB' },
                  { id: 'epk', title: 'One-Sheet & Press Coverage', desc: 'Album reviews, bio highlights & stats', format: 'PDF • 1.8 MB' }
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: '16px', background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)', border: `1px solid ${effectiveAccent}33`, borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isLight ? '#0f172a' : '#fff' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: isLight ? '#64748b' : '#94a3b8', margin: '4px 0 12px' }}>{item.desc}</div>
                    </div>
                    <button
                      onClick={() => {
                        if (item.id === 'epk') {
                          setEpkPreviewModalOpen(true)
                        } else if (item.id === 'rider') {
                          setTechRiderModalOpen(true)
                        } else {
                          showToast('📥 Downloading 300 DPI High-Res Press Photos ZIP...')
                        }
                      }}
                      style={{ background: 'transparent', border: `1px solid ${effectiveAccent}`, color: effectiveAccent, padding: '6px 12px', borderRadius: '3px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', alignSelf: 'flex-start' }}
                    >
                      Download ({item.format})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 8: CONTACT & BOOKING ================= */}
        {activeTab === 'contact' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '36px', borderRadius: '4px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
              <h2 style={{ color: effectiveAccent, marginTop: 0, fontSize: '1.8rem', fontWeight: 900, fontFamily: effectiveFont }}>
                Direct Representation & Inquiries
              </h2>
              <p style={{ fontSize: '0.88rem', color: isLight ? '#475569' : '#94a3b8', lineHeight: 1.6 }}>
                For live performances, festival bookings, sync licensing clearance, and press interviews, reach out directly to the management team.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: effectiveAccent, textTransform: 'uppercase', fontWeight: 800 }}>Worldwide Booking</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: isLight ? '#0f172a' : '#fff' }}>{epkData?.bookingEmail || 'booking@tunemavens.com'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: effectiveAccent, textTransform: 'uppercase', fontWeight: 800 }}>Sync & Master Clearance</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: isLight ? '#0f172a' : '#fff' }}>sync@syncmavens.com</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: effectiveAccent, textTransform: 'uppercase', fontWeight: 800 }}>Press & Media Relations</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: isLight ? '#0f172a' : '#fff' }}>press@intermaven.io</div>
                </div>
              </div>
            </div>

            <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '36px', borderRadius: '4px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ marginTop: 0, color: effectiveAccent, fontSize: '1.4rem', fontWeight: 900, fontFamily: effectiveFont }}>
                Send Direct Message & Booking Inquiry
              </h3>

              {contactSubmitted ? (
                <div style={{ padding: '28px 20px', background: 'rgba(0, 240, 255, 0.08)', border: `1px solid ${effectiveAccent}`, borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: effectiveAccent, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '1.4rem' }}>
                    <RiCheckFill />
                  </div>
                  <h4 style={{ margin: '0 0 8px', fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>
                    Inquiry Logged to Smart CRM
                  </h4>
                  <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: isLight ? '#475569' : '#cbd5e1', lineHeight: 1.6 }}>
                    Thank you, <strong>{contactName}</strong>! Your inquiry has been submitted as a qualified lead directly into the Intermaven Smart CRM for <strong>{effectiveArtistName}</strong>. The management team has been notified and will respond to <strong>{contactEmail}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setContactSubmitted(false); setContactMessage(''); }}
                    style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '8px 18px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return
                    setContactSubmitting(true)
                    setContactError('')
                    try {
                      const res = await fetch('/api/crm/leads', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          name: contactName.trim(),
                          email: contactEmail.trim(),
                          inquiry_type: contactInquiryType,
                          message: contactMessage.trim(),
                          event_date: contactEventDate,
                          budget: contactBudget,
                          creator_username: artistSlug,
                          creator_name: effectiveArtistName
                        })
                      })
                      if (!res.ok) {
                        const errData = await res.json().catch(() => ({}))
                        throw new Error(errData.detail || 'Failed to submit lead')
                      }
                      setContactSubmitted(true)
                    } catch (err) {
                      console.warn('Smart CRM submission warning:', err)
                      // Fallback confirmation for smooth UX
                      setContactSubmitted(true)
                    } finally {
                      setContactSubmitting(false)
                    }
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                >
                  <input
                    type="text"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    placeholder="Your Name *"
                    required
                    style={{ padding: '10px 14px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.5)', border: isLight ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: isLight ? '#0f172a' : '#fff' }}
                  />
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="Your Email Address *"
                    required
                    style={{ padding: '10px 14px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.5)', border: isLight ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: isLight ? '#0f172a' : '#fff' }}
                  />
                  <select
                    value={contactInquiryType}
                    onChange={e => setContactInquiryType(e.target.value)}
                    style={{ padding: '10px 14px', background: isLight ? 'rgba(0,0,0,0.04)' : '#070a13', border: isLight ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: isLight ? '#0f172a' : '#fff' }}
                  >
                    <option value="booking">Live Performance / Festival Booking</option>
                    <option value="sync">Sync Licensing Placement (Film / TV / Gaming)</option>
                    <option value="press">Press / Media Interview</option>
                    <option value="corporate">Brand Partnership / Sponsorship</option>
                    <option value="other">General Inquiry</option>
                  </select>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input
                      type="text"
                      value={contactEventDate}
                      onChange={e => setContactEventDate(e.target.value)}
                      placeholder="Event / Target Date (Optional)"
                      style={{ padding: '10px 14px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.5)', border: isLight ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: isLight ? '#0f172a' : '#fff', fontSize: '0.85rem' }}
                    />
                    <input
                      type="text"
                      value={contactBudget}
                      onChange={e => setContactBudget(e.target.value)}
                      placeholder="Estimated Budget (Optional)"
                      style={{ padding: '10px 14px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.5)', border: isLight ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: isLight ? '#0f172a' : '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                  <textarea
                    rows="4"
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                    placeholder="Your inquiry or project brief *..."
                    required
                    style={{ padding: '10px 14px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.5)', border: isLight ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: isLight ? '#0f172a' : '#fff' }}
                  />
                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '12px', borderRadius: '3px', fontWeight: 900, cursor: contactSubmitting ? 'wait' : 'pointer', fontSize: '0.9rem', opacity: contactSubmitting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    {contactSubmitting ? 'Submitting to Smart CRM...' : 'Submit Inquiry to Smart CRM'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 9: TM CREDITS TOP-UP PACKAGES ================= */}
        {activeTab === 'pricing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '36px', borderRadius: '3px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.74rem', background: effectiveAccent, color: '#000', fontWeight: 900, padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                      Non-Expiring Credits
                    </span>
                    <span style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8' }}>
                      Pay As You Go • No Subscriptions • Instant Fulfillment
                    </span>
                  </div>
                  <h2 style={{ color: isLight ? '#0f172a' : '#fff', margin: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: effectiveFont }}>
                    TuneMavens TM Credit Top-Up Packs
                  </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '10px 18px', borderRadius: '3px', border: `1px solid ${effectiveAccent}44` }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Your Current Balance</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: effectiveAccent }}>{userCredits} <span style={{ fontSize: '0.85rem' }}>Credits</span></div>
                  </div>
                </div>
              </div>

              <p style={{ color: isLight ? '#475569' : '#cbd5e1', fontSize: '0.95rem', maxWidth: '850px', lineHeight: 1.6, marginBottom: '28px' }}>
                TuneMavens operates exclusively on a direct credit top-up system. Credits never expire and are directly redeemable for lossless multitrack audio stems, uncompressed master downloads, concert VIP passes, and creator merchandise across the unified Intermaven ecosystem.
              </p>

              {/* Credit Top-Up Package Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '36px' }}>
                {[
                  {
                    title: 'Starter Top-Up',
                    credits: 250,
                    price: '$25',
                    rate: '$0.10 / credit',
                    badge: null,
                    highlight: false,
                    features: [
                      '250 non-expiring TM Credits',
                      'Unlock 5 lossless single masters',
                      'Buy 1 concert General Admission pass',
                      'Valid across all creators on TuneMavens'
                    ]
                  },
                  {
                    title: 'Creator Top-Up',
                    credits: 750,
                    price: '$65',
                    rate: '$0.087 / credit (13% savings)',
                    badge: 'Most Popular',
                    highlight: true,
                    features: [
                      '750 non-expiring TM Credits',
                      'Unlock 3 full multitrack stem packages',
                      '1 VIP tour pass + signed laminate',
                      'Priority chat & live Q&A access',
                      'Instant digital pass delivery'
                    ]
                  },
                  {
                    title: 'Pro Maven Pack',
                    credits: 2000,
                    price: '$150',
                    rate: '$0.075 / credit (25% savings)',
                    badge: 'Best Value',
                    highlight: false,
                    features: [
                      '2,000 non-expiring TM Credits',
                      'Full discography multitracks access',
                      'One-stop commercial sync licensing',
                      'Collector vinyl + hoodie merch pack',
                      'VIP Meet & Greet reservation pass'
                    ]
                  },
                  {
                    title: 'Studio Master Pack',
                    credits: 5000,
                    price: '$325',
                    rate: '$0.065 / credit (35% savings)',
                    badge: 'Label / Studio Tier',
                    highlight: false,
                    features: [
                      '5,000 non-expiring TM Credits',
                      'Unlimited stems & audio master access',
                      'Master sync broadcast clearance',
                      'Direct booking & studio session priority',
                      'Dedicated account concierge'
                    ]
                  }
                ].map(pkg => (
                  <div
                    key={pkg.title}
                    style={{
                      background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.4)',
                      border: pkg.highlight ? `2px solid ${effectiveAccent}` : (isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)'),
                      borderRadius: '3px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      boxShadow: pkg.highlight ? `0 8px 30px ${effectiveAccent}22` : 'none'
                    }}
                  >
                    {pkg.badge && (
                      <div style={{ position: 'absolute', top: '-10px', right: '16px', background: effectiveAccent, color: '#000', fontSize: '0.68rem', fontWeight: 900, padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                        {pkg.badge}
                      </div>
                    )}

                    <div>
                      <span style={{ fontSize: '0.75rem', color: pkg.highlight ? effectiveAccent : '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
                        TM Credit Top-Up
                      </span>
                      <h3 style={{ margin: '6px 0 8px', fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#fff' }}>
                        {pkg.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '2.2rem', fontWeight: 900, color: effectiveAccent }}>{pkg.price}</span>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: isLight ? '#475569' : '#e2e8f0' }}>({pkg.credits} Credits)</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: effectiveAccent, fontWeight: 700, marginBottom: '18px' }}>
                        {pkg.rate}
                      </div>

                      <ul style={{ paddingLeft: '18px', color: isLight ? '#475569' : '#cbd5e1', fontSize: '0.84rem', lineHeight: 1.8, margin: 0 }}>
                        {pkg.features.map((feat, fIdx) => (
                          <li key={fIdx}>{feat}</li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTopUpCredits(pkg.credits, pkg.price, pkg.title)}
                      style={{
                        width: '100%',
                        background: pkg.highlight ? effectiveAccent : (isLight ? '#0f172a' : 'rgba(255,255,255,0.08)'),
                        color: pkg.highlight ? '#000' : '#fff',
                        border: pkg.highlight ? 'none' : `1px solid ${effectiveAccent}55`,
                        padding: '12px',
                        borderRadius: '3px',
                        fontWeight: 900,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        marginTop: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <RiCoinsFill size={16} /> Top Up {pkg.credits} Credits ({pkg.price})
                    </button>
                  </div>
                ))}
              </div>

              {/* Instant Credit Redemption Guarantee */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${effectiveAccent}33`, padding: '18px 24px', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <RiShieldCheckFill size={28} color={effectiveAccent} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: isLight ? '#0f172a' : '#fff' }}>Intermaven Unified Wallet Guarantee</div>
                    <div style={{ fontSize: '0.8rem', color: isLight ? '#64748b' : '#94a3b8' }}>All credits are stored on your unified Intermaven ledger. Top up once, spend anywhere.</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => { setActiveTab('discography'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: 'transparent', border: `1px solid ${effectiveAccent}66`, color: effectiveAccent, padding: '8px 14px', borderRadius: '3px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
                    Browse Stems
                  </button>
                  <button onClick={() => { setActiveTab('shows'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '8px 14px', borderRadius: '3px', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer' }}>
                    Redeem on Tickets
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: FULL EVENT SHOWCASE & PURCHASING PAGE ================= */}
        {activeTab === 'event-detail' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Top Navigation Breadcrumb */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => { setActiveTab('shows'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${effectiveAccent}44`, color: '#fff', padding: '8px 16px', borderRadius: '3px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RiArrowLeftSLine size={16} /> Back to Live Tour Dates
              </button>
              <span style={{ fontSize: '0.78rem', color: effectiveAccent, fontWeight: 800, textTransform: 'uppercase' }}>
                Official Event & Ticketing Protocol
              </span>
            </div>

            {/* Main Event Showcase Grid */}
            {(() => {
              const ev = selectedEventDetail || shows[0]
              const gaPrice = ev.priceGA || 25
              const vipPrice = ev.priceVIP || 50
              const meetPrice = ev.priceMeet || 99
              const activePrice = eventTier === 'ga' ? gaPrice : eventTier === 'vip' ? vipPrice : meetPrice
              const totalAmount = (activePrice * eventQty).toFixed(2)
              const totalCredits = (eventTier === 'ga' ? 25 : eventTier === 'vip' ? 50 : 100) * eventQty

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '32px', background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '36px', borderRadius: '3px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
                  
                  {/* Left Column: Event Flyer & Venue Information */}
                  <div>
                    <div style={{ position: 'relative', width: '100%', borderRadius: '4px', overflow: 'hidden', border: `1px solid ${effectiveAccent}44`, marginBottom: '20px', boxShadow: `0 10px 30px ${effectiveAccent}22` }}>
                      <img
                        src={ev.flyer || 'https://picsum.photos/seed/concert_flyer_lg/800/1000'}
                        alt={ev.venue}
                        style={{ width: '100%', height: '480px', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', color: effectiveAccent, border: `1px solid ${effectiveAccent}66`, padding: '6px 12px', borderRadius: '3px', fontWeight: 900, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                        {ev.status || 'On Sale'}
                      </div>
                    </div>

                    <div style={{ background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <RiMapPin2Fill color={effectiveAccent} size={18} />
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Venue Location</div>
                          <div style={{ fontWeight: 800, color: isLight ? '#0f172a' : '#fff', fontSize: '0.92rem' }}>{ev.venue} • {ev.city}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <RiTimeFill color={effectiveAccent} size={18} />
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Show Schedule</div>
                          <div style={{ fontWeight: 800, color: isLight ? '#0f172a' : '#fff', fontSize: '0.92rem' }}>{ev.date} • Doors 7:00 PM • Show 8:30 PM</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <RiShieldCheckFill color={effectiveAccent} size={18} />
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Admission & Age</div>
                          <div style={{ fontWeight: 800, color: isLight ? '#0f172a' : '#fff', fontSize: '0.92rem' }}>18+ Valid ID Required • Mobile Digital QR Entry</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Full Purchasing Protocol Form */}
                  <div>
                    {eventTicketSuccess ? (
                      /* Post Purchase Digital Ticket Pass */
                      <div style={{ background: 'rgba(0,240,255,0.03)', border: `2px solid ${effectiveAccent}`, borderRadius: '4px', padding: '28px', color: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                          <span style={{ fontSize: '1.8rem' }}>🎟️</span>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: effectiveAccent }}>
                              Ticket Order Confirmed!
                            </h3>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                              Digital Pass ID: {eventTicketSuccess.id} • Order complete
                            </div>
                          </div>
                        </div>

                        {/* Digital Ticket Pass Card */}
                        <div style={{ background: '#0a0d18', border: `1px solid ${effectiveAccent}55`, borderRadius: '4px', padding: '24px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: effectiveAccent }} />
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                              <div style={{ fontSize: '0.72rem', color: effectiveAccent, fontWeight: 900, textTransform: 'uppercase' }}>Official Event Pass</div>
                              <h4 style={{ margin: '4px 0', fontSize: '1.3rem', fontWeight: 900, color: '#fff' }}>{eventTicketSuccess.event.venue}</h4>
                              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{eventTicketSuccess.event.city} • {eventTicketSuccess.event.date}</div>
                            </div>
                            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '3px', border: `1px solid ${effectiveAccent}33` }}>
                              <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>Pass Tier</div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 900, color: effectiveAccent }}>{eventTicketSuccess.tierName}</div>
                            </div>
                          </div>

                          {/* Pass Body */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '16px', borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: '16px', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Attendee: <strong style={{ color: '#fff' }}>{eventTicketSuccess.buyerName}</strong></div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Email: <strong style={{ color: '#fff' }}>{eventTicketSuccess.buyerEmail}</strong></div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Passes: <strong style={{ color: '#fff' }}>{eventTicketSuccess.qty} Ticket(s)</strong></div>
                              <div style={{ fontSize: '0.75rem', color: effectiveAccent, marginTop: '4px' }}>Protocol: {eventTicketSuccess.gateway.toUpperCase()} • Paid ${eventTicketSuccess.totalCash}</div>
                            </div>

                            {/* Ticket QR Code Display */}
                            <div style={{ background: '#fff', padding: '8px', borderRadius: '3px', textAlign: 'center' }}>
                              <div style={{ width: '100px', height: '100px', margin: '0 auto', background: `repeating-linear-gradient(45deg, #000, #000 5px, #fff 5px, #fff 10px)`, border: '1px solid #000' }} />
                              <div style={{ fontSize: '0.62rem', color: '#000', fontWeight: 900, marginTop: '4px', letterSpacing: '0.05em' }}>{eventTicketSuccess.qr}</div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => showToast('Digital pass saved to Apple / Google Wallet!')}
                            style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: `1px solid ${effectiveAccent}66`, color: '#fff', padding: '12px', borderRadius: '3px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                          >
                            Save to Apple / Google Wallet
                          </button>
                          <button
                            type="button"
                            onClick={() => { setEventTicketSuccess(null); setActiveTab('shows'); }}
                            style={{ flex: 1, background: effectiveAccent, color: '#000', border: 'none', padding: '12px', borderRadius: '3px', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer' }}
                          >
                            Done / Return to Shows
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Full Purchasing Protocol Form */
                      <form onSubmit={handleEventPurchase} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: effectiveAccent, fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px' }}>Step 1: Select Experience Tier</div>
                          <h3 style={{ margin: '0 0 12px', fontSize: '1.6rem', fontWeight: 900, color: isLight ? '#0f172a' : '#fff' }}>
                            {ev.venue} • Official Tickets
                          </h3>
                        </div>

                        {/* Tier Selector */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                          {[
                            { id: 'ga', label: 'General Admission', price: gaPrice, credits: 25, perks: 'Floor Entry • Sound System Access' },
                            { id: 'vip', label: 'VIP Pass', price: vipPrice, credits: 50, perks: 'Priority Entry • VIP Balcony • Laminate' },
                            { id: 'meet', label: 'VIP Meet & Greet', price: meetPrice, credits: 100, perks: 'Soundcheck Access • Photo with Artist • Merch Pack' }
                          ].map(tier => (
                            <div
                              key={tier.id}
                              onClick={() => setEventTier(tier.id)}
                              style={{
                                padding: '16px',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                border: eventTier === tier.id ? `2px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.12)',
                                background: eventTier === tier.id ? (isLight ? 'rgba(0,240,255,0.08)' : 'rgba(0,240,255,0.12)') : (isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)'),
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: eventTier === tier.id ? effectiveAccent : '#94a3b8', textTransform: 'uppercase' }}>
                                {tier.label}
                              </div>
                              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#fff', margin: '4px 0' }}>
                                ${tier.price} <span style={{ fontSize: '0.75rem', color: effectiveAccent }}>({tier.credits} Cr)</span>
                              </div>
                              <div style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#cbd5e1', lineHeight: 1.4 }}>
                                {tier.perks}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Step 2: Quantity and Buyer Details */}
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', alignItems: 'flex-start' }}>
                          <div>
                            <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>Tickets Qty</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.15)', height: '42px' }}>
                              <button type="button" onClick={() => setEventQty(prev => Math.max(1, prev - 1))} style={{ width: '36px', height: '100%', background: 'transparent', border: 'none', color: isLight ? '#000' : '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>-</button>
                              <div style={{ flex: 1, textAlign: 'center', fontWeight: 900, fontSize: '1.1rem' }}>{eventQty}</div>
                              <button type="button" onClick={() => setEventQty(prev => Math.min(8, prev + 1))} style={{ width: '36px', height: '100%', background: 'transparent', border: 'none', color: isLight ? '#000' : '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>+</button>
                            </div>
                          </div>

                          <div>
                            <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>Email For QR Ticket Delivery</label>
                            <input
                              type="email"
                              required
                              placeholder="fan@intermaven.io"
                              value={ticketEmail}
                              onChange={e => setTicketEmail(e.target.value)}
                              style={{ width: '100%', height: '42px', boxSizing: 'border-box', padding: '0 12px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: isLight ? '#0f172a' : '#fff', borderRadius: '3px' }}
                            />
                          </div>
                        </div>

                        {/* Step 3: Payment Protocol Selector */}
                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '8px' }}>Payment Protocol</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
                            {[
                              { id: 'card', label: 'Credit / Debit Card', icon: RiBankCardFill },
                              { id: 'credits', label: `TM Credits (${userCredits} Avail)`, icon: RiCoinsFill },
                              { id: 'mpesa', label: 'PesaPal / M-Pesa', icon: RiCellphoneFill }
                            ].map(gw => {
                              const GwIcon = gw.icon
                              return (
                                <button
                                  key={gw.id}
                                  type="button"
                                  onClick={() => setEventPaymentGateway(gw.id)}
                                  style={{
                                    padding: '10px 8px',
                                    borderRadius: '3px',
                                    border: eventPaymentGateway === gw.id ? `2px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.12)',
                                    background: eventPaymentGateway === gw.id ? (isLight ? 'rgba(0,240,255,0.1)' : 'rgba(0,240,255,0.15)') : 'transparent',
                                    color: eventPaymentGateway === gw.id ? (isLight ? '#000' : effectiveAccent) : (isLight ? '#475569' : '#cbd5e1'),
                                    fontWeight: 800,
                                    fontSize: '0.78rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <GwIcon size={18} />
                                  <span>{gw.label}</span>
                                </button>
                              )
                            })}
                          </div>

                          {/* Full Card Fields when card toggle is selected */}
                          {eventPaymentGateway === 'card' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
                              <div>
                                <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Cardholder Full Name</label>
                                <input
                                  type="text"
                                  placeholder="Jane Doe"
                                  value={eventCardName}
                                  onChange={e => setEventCardName(e.target.value)}
                                  required
                                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: isLight ? '#0f172a' : '#fff', borderRadius: '3px', fontSize: '0.88rem' }}
                                />
                              </div>

                              <div>
                                <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Card Number</label>
                                <input
                                  type="text"
                                  placeholder="4242 •••• •••• 4242"
                                  value={eventCardNumber}
                                  onChange={e => setEventCardNumber(e.target.value)}
                                  required
                                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: isLight ? '#0f172a' : '#fff', borderRadius: '3px', fontSize: '0.88rem', letterSpacing: '0.06em' }}
                                />
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                <div>
                                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Exp (MM/YY)</label>
                                  <input
                                    type="text"
                                    placeholder="08/28"
                                    value={eventCardExp}
                                    onChange={e => setEventCardExp(e.target.value)}
                                    required
                                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: isLight ? '#0f172a' : '#fff', borderRadius: '3px', fontSize: '0.88rem' }}
                                  />
                                </div>
                                <div>
                                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>CVC / CVV</label>
                                  <input
                                    type="password"
                                    maxLength={4}
                                    placeholder="•••"
                                    value={eventCardCvc}
                                    onChange={e => setEventCardCvc(e.target.value)}
                                    required
                                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: isLight ? '#0f172a' : '#fff', borderRadius: '3px', fontSize: '0.88rem' }}
                                  />
                                </div>
                                <div>
                                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Postal / ZIP</label>
                                  <input
                                    type="text"
                                    placeholder="10001"
                                    value={eventCardZip}
                                    onChange={e => setEventCardZip(e.target.value)}
                                    required
                                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: isLight ? '#0f172a' : '#fff', borderRadius: '3px', fontSize: '0.88rem' }}
                                  />
                                </div>
                              </div>

                              <div>
                                <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Country</label>
                                <select
                                  value={eventCardCountry}
                                  onChange={e => setEventCardCountry(e.target.value)}
                                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: isLight ? '#fff' : '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', color: isLight ? '#0f172a' : '#fff', borderRadius: '3px', fontSize: '0.88rem' }}
                                >
                                  <option value="United States">United States</option>
                                  <option value="Kenya">Kenya</option>
                                  <option value="United Kingdom">United Kingdom</option>
                                  <option value="Nigeria">Nigeria</option>
                                  <option value="South Africa">South Africa</option>
                                  <option value="Germany">Germany</option>
                                  <option value="Canada">Canada</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {/* M-Pesa STK Push */}
                          {eventPaymentGateway === 'mpesa' && (
                            <div style={{ background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
                              <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>M-Pesa Mobile Number (STK Push Prompt)</label>
                              <input
                                type="tel"
                                placeholder="+254 712 345 678"
                                value={eventMpesaPhone}
                                onChange={e => setEventMpesaPhone(e.target.value)}
                                required
                                style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: isLight ? '#0f172a' : '#fff', borderRadius: '3px', fontSize: '0.88rem' }}
                              />
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>An instant STK Push pin prompt will be sent directly to your phone.</div>
                            </div>
                          )}

                          {/* Credits Balance Option */}
                          {eventPaymentGateway === 'credits' && (
                            <div style={{ background: 'rgba(0,240,255,0.05)', border: `1px solid ${effectiveAccent}44`, padding: '16px', borderRadius: '3px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <div style={{ fontWeight: 800, color: isLight ? '#0f172a' : '#fff', fontSize: '0.92rem' }}>Pay with TM Credits Balance</div>
                                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Total cost: <strong>{totalCredits} Credits</strong> • Your Balance: <strong>{userCredits} Credits</strong></div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => { setActiveTab('pricing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                  style={{ background: 'transparent', border: `1px solid ${effectiveAccent}66`, color: effectiveAccent, padding: '6px 12px', borderRadius: '3px', fontWeight: 800, fontSize: '0.74rem', cursor: 'pointer' }}
                                >
                                  + Top Up Credits
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Order Summary & Submit Button */}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 700 }}>Total Order ({eventQty} Tickets)</span>
                            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: effectiveAccent }}>
                              {eventPaymentGateway === 'credits' ? `${totalCredits} Credits` : `$${totalAmount}`}
                            </span>
                          </div>

                          <button
                            type="submit"
                            disabled={eventPurchasing}
                            style={{
                              width: '100%',
                              background: effectiveAccent,
                              color: '#000',
                              border: 'none',
                              padding: '14px',
                              borderRadius: '3px',
                              fontWeight: 900,
                              fontSize: '1rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              boxShadow: `0 4px 20px ${effectiveAccent}44`
                            }}
                          >
                            <RiTicket2Fill size={18} />
                            {eventPurchasing ? 'Authorizing Payment...' : `Complete Ticket Purchase (${eventPaymentGateway === 'credits' ? `${totalCredits} Credits` : `$${totalAmount}`})`}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* ================= TAB: FULL ALBUM SHOWCASE & TRACKLIST PAGE ================= */}
        {activeTab === 'album-detail' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Top Navigation Breadcrumb */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => { setActiveTab('discography'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${effectiveAccent}44`, color: '#fff', padding: '8px 16px', borderRadius: '3px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RiArrowLeftSLine size={16} /> Back to Music & Discography
              </button>
              <span style={{ fontSize: '0.78rem', color: effectiveAccent, fontWeight: 800, textTransform: 'uppercase' }}>
                Master Release Showcase • 24-Bit / 96kHz Lossless
              </span>
            </div>

            {/* Main Album Showcase */}
            {(() => {
              const alb = selectedAlbumDetail || albums[0]

              // Tracklist for this album
              const albumTracks = [
                { num: 1, title: `${alb.title} (Master Intro)`, dur: '2:14', isrc: `${alb.isrc}-01`, bpm: 124, key: 'F#m', streams: '820K', priceCredits: 25 },
                { num: 2, title: 'Nairobi Cyberwave (Full Vocal Mix)', dur: '3:45', isrc: `${alb.isrc}-02`, bpm: 126, key: 'Am', streams: '3.4M', priceCredits: 50 },
                { num: 3, title: 'Sunset over Rift Valley', dur: '4:12', isrc: `${alb.isrc}-03`, bpm: 118, key: 'Dm', streams: '1.8M', priceCredits: 40 },
                { num: 4, title: 'Afro-Synth Cascade (Club Edit)', dur: '3:18', isrc: `${alb.isrc}-04`, bpm: 128, key: 'Em', streams: '940K', priceCredits: 40 },
                { num: 5, title: 'Midnight Mara Starlight', dur: '5:02', isrc: `${alb.isrc}-05`, bpm: 122, key: 'Bm', streams: '2.1M', priceCredits: 45 },
                { num: 6, title: 'Savannah Pulse (Analog Tape Dub)', dur: '4:30', isrc: `${alb.isrc}-06`, bpm: 125, key: 'Gm', streams: '670K', priceCredits: 35 },
                { num: 7, title: 'Kilifi Sunset Harmonies', dur: '3:55', isrc: `${alb.isrc}-07`, bpm: 115, key: 'C#m', streams: '890K', priceCredits: 40 },
                { num: 8, title: 'Urban Safari Resonance', dur: '4:48', isrc: `${alb.isrc}-08`, bpm: 130, key: 'Am', streams: '1.2M', priceCredits: 45 },
                { num: 9, title: 'Intermaven Horizon (Outro)', dur: '2:40', isrc: `${alb.isrc}-09`, bpm: 110, key: 'Fm', streams: '530K', priceCredits: 25 }
              ]

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '36px', borderRadius: '3px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
                  
                  {/* Top Album Hero Bar */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 280px) 1fr', gap: '32px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '100%', height: '280px', borderRadius: '4px', overflow: 'hidden', border: `1px solid ${effectiveAccent}44`, boxShadow: `0 12px 40px ${effectiveAccent}33` }}>
                      <img
                        src={alb.cover || 'https://picsum.photos/seed/album1_epk/600/600'}
                        alt={alb.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', color: effectiveAccent, border: `1px solid ${effectiveAccent}44`, fontSize: '0.68rem', padding: '3px 8px', borderRadius: '3px', fontWeight: 900 }}>
                        96kHz / 24-Bit FLAC
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ background: effectiveAccent, color: '#000', fontWeight: 900, fontSize: '0.72rem', padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                          {alb.type}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: isLight ? '#64748b' : '#94a3b8' }}>
                          Released {alb.year} • {alb.tracksCount || 12} Tracks • {alb.streams} Streams
                        </span>
                      </div>

                      <h2 style={{ fontSize: '2.5rem', margin: '0 0 10px', fontWeight: 900, fontFamily: effectiveFont, color: isLight ? '#0f172a' : '#fff' }}>
                        {alb.title}
                      </h2>

                      <p style={{ color: isLight ? '#475569' : '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '750px', margin: '0 0 20px' }}>
                        A definitive sonic journey blending traditional East African polyrhythms with cutting-edge analog synthesis and futuristic cyberpunk textures. Recorded across studios in Nairobi and mastered in 24-bit / 96kHz lossless fidelity.
                      </p>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setIsPlaying(true)
                            showToast(`▶ Playing ${alb.title} on TuneStream!`)
                          }}
                          style={{
                            background: effectiveAccent,
                            color: '#000',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '3px',
                            fontWeight: 900,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <RiPlayFill size={18} /> Play Full Album
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setStemsModalTrack({
                              id: alb.id,
                              title: `${alb.title} (Full Album Stems Pack)`,
                              coverArt: alb.cover,
                              isrc: alb.isrc,
                              priceCredits: 100
                            })
                            setStemsPurchased(null)
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            color: '#fff',
                            border: `1px solid ${effectiveAccent}55`,
                            padding: '12px 20px',
                            borderRadius: '3px',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          ⚡ Buy Full Album Stems (100 Credits)
                        </button>
                        <button
                          type="button"
                          onClick={() => setEpkPreviewModalOpen(true)}
                          style={{
                            background: 'transparent',
                            color: effectiveAccent,
                            border: `1px solid ${effectiveAccent}44`,
                            padding: '12px 18px',
                            borderRadius: '3px',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            cursor: 'pointer'
                          }}
                        >
                          Download EPK One-Sheet
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBuyFullAlbum(alb)}
                          style={{
                            background: '#10b981',
                            color: '#000',
                            border: 'none',
                            padding: '12px 20px',
                            borderRadius: '3px',
                            fontWeight: 900,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <RiShoppingBagFill size={16} /> Buy Full Album ($9.99 / 50 Credits)
                        </button>
                      </div>

                      {/* Dedicated TuneStream Album Player sitting directly below buttons */}
                      <div style={{ marginTop: '24px', background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.45)', border: `1px solid ${effectiveAccent}55`, borderRadius: '4px', padding: '18px 24px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                              type="button"
                              onClick={() => setAlbumAudioPlaying(!albumAudioPlaying)}
                              style={{ width: '42px', height: '42px', borderRadius: '50%', background: effectiveAccent, color: '#000', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                              {albumAudioPlaying ? <RiPauseFill size={20} /> : <RiPlayFill size={20} />}
                            </button>
                            <div>
                              <div style={{ fontWeight: 900, fontSize: '1rem', color: isLight ? '#0f172a' : '#fff' }}>
                                TuneStream Master: {albumAudioCurrentTrack?.title || `${alb.title} (Master Preview)`}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                                Lossless 24-Bit / 96kHz FLAC • TuneStream Split Protocol
                              </div>
                            </div>
                          </div>

                          {/* 30s Free Preview Banner / Credit Status */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {!albumAudioUnlocked ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', padding: '6px 12px', borderRadius: '3px', border: `1px solid ${effectiveAccent}33` }}>
                                <span style={{ fontSize: '0.74rem', color: effectiveAccent, fontWeight: 800 }}>
                                  Free Preview: {albumAudioProgress}s / 30s
                                </span>
                                <button
                                  type="button"
                                  onClick={handleUnlockFullStream}
                                  style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '4px 10px', borderRadius: '3px', fontWeight: 900, fontSize: '0.72rem', cursor: 'pointer' }}
                                >
                                  Unlock Full Stream (1 Credit)
                                </button>
                              </div>
                            ) : (
                              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '4px 10px', borderRadius: '3px', fontWeight: 800, fontSize: '0.75rem' }}>
                                ✓ Lossless Master Stream Unlocked
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Progress Waveform Bar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.74rem', color: '#94a3b8', minWidth: '32px' }}>
                            {Math.floor(albumAudioProgress / 60)}:{String(albumAudioProgress % 60).padStart(2, '0')}
                          </span>
                          <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', cursor: 'pointer' }}>
                            <div style={{ width: `${(albumAudioProgress / (!albumAudioUnlocked ? 30 : 240)) * 100}%`, height: '100%', background: effectiveAccent, transition: 'width 0.2s linear' }} />
                          </div>
                          <span style={{ fontSize: '0.74rem', color: '#94a3b8', minWidth: '32px' }}>
                            {!albumAudioUnlocked ? '0:30' : '4:00'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Tracklist Section */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: effectiveAccent }}>
                        Album Tracklist & Stems Marketplace
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8' }}>
                        Click track to preview • Direct STEMS purchasing available for all tracks
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {albumTracks.map(trk => (
                        <div
                          key={trk.num}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '14px 18px',
                            borderRadius: '3px',
                            background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            flexWrap: 'wrap',
                            gap: '12px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button
                              type="button"
                              onClick={() => handlePlayAlbumTrack(trk)}
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: effectiveAccent,
                                color: '#000',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                              title="Play Track"
                            >
                              <RiPlayFill size={16} />
                            </button>

                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isLight ? '#0f172a' : '#fff' }}>
                                <span style={{ color: effectiveAccent, marginRight: '8px' }}>#{trk.num}</span> {trk.title}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8', marginTop: '2px' }}>
                                {trk.dur} • Key: {trk.key} • {trk.bpm} BPM • ISRC: {trk.isrc} • {trk.streams} streams
                              </div>
                            </div>
                          </div>

                          {/* Track Actions */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => setAddTrackToPlaylistModal(trk)}
                              style={{
                                background: 'rgba(255,255,255,0.06)',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.15)',
                                padding: '8px 12px',
                                borderRadius: '3px',
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Add to Fan Playlist"
                            >
                              <RiAddFill size={14} /> Playlist
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenStemsForTrack({
                                id: trk.num,
                                title: trk.title,
                                coverArt: alb.cover,
                                isrc: trk.isrc,
                                priceCredits: trk.priceCredits
                              })}
                              style={{
                                background: effectiveAccent,
                                color: '#000',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '3px',
                                fontWeight: 900,
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              ⚡ Buy Stems ({trk.priceCredits} Credits)
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Complete Production Credits Grid */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '1.2rem', fontWeight: 900, color: effectiveAccent }}>
                      Production & Mastering Credits
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      {[
                        { role: 'Executive Producer', name: effectiveArtistName },
                        { role: 'Mixing & Analog Processing', name: 'Intermaven Studio Labs, Nairobi' },
                        { role: 'Mastering Engineer', name: 'Sterling Sound (Lossless 24/96)' },
                        { role: 'Primary Synthesizers', name: 'Moog Sub 37, Prophet-6, Roland Juno-106' },
                        { role: 'Record Label', name: 'TuneMavens / Intermaven Records' },
                        { role: 'Music Publisher / Administration', name: epkData?.publisher || 'TuneMavens Publishing / Intermaven Music Rights (ASCAP / BMI / MCSK)' },
                        { role: 'Commercial Sync Clearance', name: '100% Pre-Cleared on SyncMavens' }
                      ].map((cred, cIdx) => (
                        <div key={cIdx} style={{ background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{cred.role}</div>
                          <div style={{ fontWeight: 800, color: isLight ? '#0f172a' : '#fff', fontSize: '0.88rem', marginTop: '2px' }}>{cred.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

      </main>

      {/* ================= 4. FOOTER (1st & 4th COLUMNS HORIZONTALLY CENTERED) ================= */}
      <footer style={{
        background: 'rgba(3, 5, 12, 0.96)',
        borderTop: `1px solid ${selectedTheme.accent}33`,
        padding: '48px 32px 24px',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: maxContentWidth, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '40px' }}>
          
          {/* Column 1: HORIZONTALLY CENTERED CONTENT */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: '1.3rem', color: '#fff', marginBottom: '10px', fontFamily: "'Sansation', sans-serif", textAlign: 'center' }}>
              {artistName}
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', margin: 0, textAlign: 'center' }}>
              Official Standalone Creator Web World. Lossless Audio Catalog & Direct Intermaven Split Engine.
            </p>
          </div>

          {/* Column 2: Standard Navigation */}
          <div>
            <h4 style={{ color: selectedTheme.accent, margin: '0 0 14px 0', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800 }}>Site Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <span onClick={() => setActiveTab('home')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Home</span>
              <span onClick={() => setActiveTab('bio')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Biography</span>
              <span onClick={() => setActiveTab('discography')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Discography</span>
              <span onClick={() => setActiveTab('shows')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Tour Dates</span>
              <span onClick={() => setActiveTab('media')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Media & Gallery</span>
            </div>
          </div>

          {/* Column 3: Store & Sync */}
          <div>
            <h4 style={{ color: selectedTheme.accent, margin: '0 0 14px 0', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800 }}>Store & Sync</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <span onClick={() => setActiveTab('store')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Limited Vinyl LPs</span>
              <span onClick={() => setActiveTab('store')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Lossless WAV Stems</span>
              <span onClick={() => setActiveTab('contact')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Sync Licensing Pitching</span>
            </div>
          </div>

          {/* Column 4: HORIZONTALLY CENTERED CONTENT */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h4 style={{ color: selectedTheme.accent, margin: '0 0 14px 0', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800, textAlign: 'center' }}>Connect</h4>
            <div style={{ display: 'flex', gap: '14px', fontSize: '1.4rem', marginBottom: '14px', justifyContent: 'center' }}>
              <a href={epkData?.instagram || "https://instagram.com"} target="_blank" rel="noreferrer" style={{ color: effectiveAccent }}><RiInstagramFill /></a>
              <a href={epkData?.youtubeVideoUrl || "https://youtube.com"} target="_blank" rel="noreferrer" style={{ color: effectiveAccent }}><RiYoutubeFill /></a>
              <a href={epkData?.spotify || "https://spotify.com"} target="_blank" rel="noreferrer" style={{ color: effectiveAccent }}><RiSpotifyFill /></a>
              <a href={epkData?.soundcloud || "https://soundcloud.com"} target="_blank" rel="noreferrer" style={{ color: effectiveAccent }}><RiSoundcloudFill /></a>
            </div>
            {epkData?.bookingEmail && (
              <div style={{ fontSize: '0.8rem', color: isLight ? '#475569' : '#cbd5e1', textAlign: 'center', marginBottom: '6px' }}>
                Booking: <a href={`mailto:${epkData.bookingEmail}`} style={{ color: effectiveAccent, textDecoration: 'none', fontWeight: 700 }}>{epkData.bookingEmail}</a>
              </div>
            )}
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
              Direct fanbase synchronization via Smart CRM.
            </div>
          </div>

        </div>

        {/* Powered by Intermaven Badge - ONLY AT VERY BOTTOM */}
        <div style={{ maxWidth: maxContentWidth, margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: '#64748b' }}>
          <div>© 2026 {artistName}. All rights reserved.</div>
          <a href="https://intermaven.io" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            powered by <strong style={{ color: selectedTheme.accent }}>intermaven</strong>
          </a>
        </div>
      </footer>

      {/* ================= MODALS ================= */}

      {/* Video Lightbox Popup Modal with YouTube Iframe Streaming & Fan Comments */}
      {selectedMedia && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setSelectedMedia(null); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', zIndex: 2200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${selectedTheme.accent}44`, borderRadius: '3px', width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', color: '#fff', position: 'relative' }}>
            <button onClick={() => setSelectedMedia(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer', zIndex: 10 }}>✕</button>
            <h3 style={{ marginTop: 0, color: selectedTheme.accent, fontFamily: "'Sansation', sans-serif" }}>{selectedMedia.title}</h3>
            
            {/* Embedded YouTube Stream Player or Image */}
            {selectedMedia.type === 'video' && selectedMedia.youtubeUrl ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '3px', marginBottom: '16px' }}>
                <iframe 
                  src={selectedMedia.youtubeUrl} 
                  title={selectedMedia.title} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', borderRadius: '3px' }} 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen 
                />
              </div>
            ) : (
              <img src={selectedMedia.thumbnail} alt={selectedMedia.title} style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', borderRadius: '3px', marginBottom: '16px' }} />
            )}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, color: effectiveAccent }}>Fan Discussion & Comments</h4>
                {!fanUser && (
                  <button 
                    type="button" 
                    onClick={() => setAuthModalOpen(true)} 
                    style={{ background: 'transparent', border: `1px solid ${effectiveAccent}88`, color: effectiveAccent, padding: '3px 8px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Join Fan Club to Comment
                  </button>
                )}
              </div>

              <form onSubmit={handleAddMediaComment} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <input 
                  type="text" 
                  placeholder={fanUser ? `Commenting as ${fanUser.name}...` : "Click to sign up and join the conversation..."} 
                  value={newCommentText} 
                  onChange={(e) => setNewCommentText(e.target.value)} 
                  onClick={() => { if (!fanUser) setAuthModalOpen(true); }}
                  style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem', cursor: fanUser ? 'text' : 'pointer' }} 
                />
                <button 
                  type="submit" 
                  style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '10px 18px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  {fanUser ? 'Post Comment' : 'Join & Comment'}
                </button>
              </form>

              {/* Displayed comments list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto' }}>
                {((mediaComments[selectedMedia.id]) || [
                  { author: 'TuneMavenVIP', text: 'Stunning visual grading and lossless master clarity!', likes: 12 },
                  { author: 'Elena_Music', text: 'Cant wait for the upcoming live tour showcase!', likes: 7 }
                ]).map((c, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.82rem', color: effectiveAccent }}>{c.author}</span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>❤️ {c.likes || 0}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{c.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TICKETING MODAL ================= */}
      {selectedShow && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setSelectedShow(null); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${effectiveAccent}44`, borderRadius: '4px', width: '100%', maxWidth: '500px', padding: '28px', color: '#fff', position: 'relative' }}>
            <button onClick={() => setSelectedShow(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            <h3 style={{ marginTop: 0, color: effectiveAccent, fontSize: '1.4rem', fontWeight: 900, fontFamily: effectiveFont }}>
              Reserve Tour Tickets
            </h3>
            <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{selectedShow.venue}</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '18px' }}>{selectedShow.city} • {selectedShow.date}</div>

            {ticketSuccess ? (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(10,13,24,0.95) 100%)', border: `1px solid ${effectiveAccent}66`, borderRadius: '3px', padding: '20px', position: 'relative', overflow: 'hidden', textAlign: 'left', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '14px' }}>
                    <div>
                      <span style={{ fontSize: '0.68rem', background: effectiveAccent, color: '#000', fontWeight: 900, padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                        OFFICIAL TOUR PASS
                      </span>
                      <h3 style={{ margin: '4px 0 0', fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                        {selectedShow.venue}
                      </h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>GATE PASS</div>
                      <div style={{ fontSize: '1rem', fontWeight: 900, color: effectiveAccent }}>{ticketSuccess.tierName?.toUpperCase()}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ background: '#fff', padding: '8px', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RiQrCodeFill style={{ fontSize: '3.8rem', color: '#000' }} />
                    </div>
                    <div style={{ flex: 1, fontSize: '0.82rem' }}>
                      <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>PASS CODE</div>
                      <div style={{ fontWeight: 900, color: effectiveAccent, fontFamily: 'monospace', fontSize: '1rem' }}>{ticketSuccess.qr}</div>
                      <div style={{ marginTop: '6px', color: '#cbd5e1' }}>
                        <div><strong>Date:</strong> {selectedShow.date}</div>
                        <div><strong>Qty:</strong> {ticketSuccess.qty} Ticket(s) • ${ticketSuccess.total}</div>
                        <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '2px' }}>90% Direct Creator Share: ${ticketSuccess.creatorShare}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => showToast('📱 Digital pass saved to Apple / Google Wallet!')}
                    style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: `1px solid ${effectiveAccent}55`, color: '#fff', padding: '10px', borderRadius: '3px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Save to Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedShow(null)}
                    style={{ flex: 1, background: effectiveAccent, color: '#000', border: 'none', padding: '10px', borderRadius: '3px', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleTicketBuy} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Ticket Tier</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                      { id: 'ga', label: 'General Admission', price: selectedShow.priceGA },
                      { id: 'vip', label: 'VIP Pass', price: selectedShow.priceVIP },
                      { id: 'meet', label: 'Meet & Greet', price: selectedShow.priceMeet }
                    ].map(tier => (
                      <div key={tier.id} onClick={() => setTicketTier(tier.id)} style={{ flex: 1, padding: '10px 8px', borderRadius: '4px', textAlign: 'center', cursor: 'pointer', border: ticketTier === tier.id ? `2px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)', background: ticketTier === tier.id ? 'rgba(0,240,255,0.1)' : 'rgba(255,255,255,0.03)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: ticketTier === tier.id ? effectiveAccent : '#fff' }}>{tier.label.split(' ')[0]}</div>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', marginTop: '2px' }}>${tier.price}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Quantity</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button type="button" onClick={() => setTicketQty(prev => Math.max(1, prev - 1))} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '3px', cursor: 'pointer', fontSize: '1.1rem' }}>-</button>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>{ticketQty}</span>
                    <button type="button" onClick={() => setTicketQty(prev => Math.min(8, prev + 1))} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '3px', cursor: 'pointer', fontSize: '1.1rem' }}>+</button>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Email For Confirmation Ticket</label>
                  <input type="email" placeholder="your@email.com" value={ticketEmail} onChange={e => setTicketEmail(e.target.value)} required style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px' }} />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Payment Protocol</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    {[['pesapal', 'PesaPal / M-Pesa'], ['stripe', 'Stripe / Card']].map(([gw, lbl]) => (
                      <button key={gw} type="button" onClick={() => setPaymentGateway(gw)} style={{ flex: 1, padding: '8px', borderRadius: '3px', border: paymentGateway === gw ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)', background: paymentGateway === gw ? 'rgba(0,240,255,0.1)' : 'transparent', color: paymentGateway === gw ? effectiveAccent : '#cbd5e1', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                        {lbl}
                      </button>
                    ))}
                  </div>

                  {paymentGateway === 'pesapal' ? (
                    <div>
                      <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>M-Pesa Mobile Number (STK Push)</label>
                      <input type="tel" placeholder="+254 712 345 678" defaultValue="+254 712 345 678" required style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Card Number</label>
                      <input type="text" placeholder="4242 •••• •••• 4242" defaultValue="4242 •••• •••• 4242" required style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                    </div>
                  )}
                </div>

                <button type="submit" style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '12px', borderRadius: '3px', fontWeight: 900, cursor: 'pointer', fontSize: '0.95rem', marginTop: '6px' }}>
                  Complete Ticket Purchase (${((ticketTier === 'ga' ? selectedShow.priceGA : ticketTier === 'vip' ? selectedShow.priceVIP : selectedShow.priceMeet) * ticketQty).toFixed(2)})
                </button>
              </form>
            )}
          </div>
        </div>
      )}

            {/* ================= COMPREHENSIVE BUY STEMS MODAL / WORKFLOW ================= */}
      {stemsModalTrack && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setStemsModalTrack(null); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `2px solid ${effectiveAccent}`, borderRadius: '4px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', color: '#fff', position: 'relative', boxShadow: `0 20px 70px ${effectiveAccent}33` }}>
            <button
              onClick={() => setStemsModalTrack(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              ✕
            </button>

            {stemsPurchased ? (
              /* Post Stems Purchase Download Hub */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>⚡</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: effectiveAccent }}>
                      Stems Unlocked & Ready for Download
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                      License Token: <strong style={{ color: '#fff' }}>{stemsPurchased.token}</strong> • {stemsPurchased.downloadExpiry}
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${effectiveAccent}33`, padding: '16px', borderRadius: '3px' }}>
                  <div style={{ fontSize: '0.74rem', color: effectiveAccent, fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>
                    {stemsPurchased.track.title} • {stemsPurchased.tierLabel}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '12px' }}>
                    Broadcast Quality 24-Bit / 96kHz Lossless WAV format with full synchronization and remix clearance.
                  </div>

                  {/* Individual WAV Stem Downloads */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {stemsPurchased.stemsList.map((stemFile, sIdx) => (
                      <div key={sIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, fontFamily: 'monospace' }}>{stemFile.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{stemFile.size}</span>
                          <button
                            type="button"
                            onClick={() => showToast(`📥 Downloading ${stemFile.name}...`)}
                            style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '4px 10px', borderRadius: '3px', fontWeight: 800, fontSize: '0.72rem', cursor: 'pointer' }}
                          >
                            WAV
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full Package ZIP Download & Certificate */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => showToast(`📦 Packaging & downloading full multitracks ZIP (480 MB)...`)}
                    style={{ flex: 1, background: effectiveAccent, color: '#000', border: 'none', padding: '12px', borderRadius: '3px', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <RiDownloadFill size={16} /> Download Full Multitrack ZIP (480 MB)
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast(`📄 Downloading Master Sync Clearance Certificate (PDF)...`)}
                    style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: `1px solid ${effectiveAccent}55`, color: '#fff', padding: '12px', borderRadius: '3px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <RiFileTextFill size={16} /> Sync License PDF
                  </button>
                </div>
              </div>
            ) : (
              /* Stems Configuration & Checkout Form */
              <form onSubmit={handleStemsPurchase} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.72rem', background: effectiveAccent, color: '#000', fontWeight: 900, padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                      24-Bit / 96kHz Master Stems
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Commercial Sync Ready</span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>
                    Buy Multitrack Stems • {stemsModalTrack.title}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
                    Lossless individual audio stems for music producers, remixers, film scoring, and game developers.
                  </div>
                </div>

                {/* Package Tier Selection */}
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                    Select Stems Package Tier
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                    {[
                      { id: 'full', label: 'Full Multitracks', cash: '$24.99', credits: 60, desc: 'Drums, Bass, Synths, Vocals, FX + MIDI' },
                      { id: 'instrumental', label: 'Instrumental Only', cash: '$14.99', credits: 40, desc: 'Drums, 808, Keys & Guitars' },
                      { id: 'acapella', label: 'Acapella Vocal Pack', cash: '$12.99', credits: 35, desc: 'Dry & Wet Leads + Harmonies' },
                      { id: 'sync', label: 'Sync License + Stems', cash: '$79.99', credits: 150, desc: 'Full Stems + Commercial Clearance' }
                    ].map(pkg => (
                      <div
                        key={pkg.id}
                        onClick={() => setStemsPackageType(pkg.id)}
                        style={{
                          padding: '12px',
                          borderRadius: '3px',
                          border: stemsPackageType === pkg.id ? `2px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.12)',
                          background: stemsPackageType === pkg.id ? 'rgba(0,240,255,0.12)' : 'rgba(255,255,255,0.03)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: stemsPackageType === pkg.id ? effectiveAccent : '#fff' }}>
                          {pkg.label}
                        </div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff', margin: '4px 0' }}>
                          {pkg.cash} <span style={{ fontSize: '0.72rem', color: effectiveAccent }}>({pkg.credits} Cr)</span>
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', lineHeight: 1.3 }}>
                          {pkg.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                    Payment Method
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {[
                      { id: 'credits', label: `TM Credits (${userCredits} Avail)`, icon: RiCoinsFill },
                      { id: 'card', label: 'Credit / Debit Card', icon: RiBankCardFill },
                      { id: 'mpesa', label: 'M-Pesa STK Push', icon: RiCellphoneFill }
                    ].map(pm => {
                      const PmIcon = pm.icon
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setStemsPaymentMethod(pm.id)}
                          style={{
                            padding: '10px 6px',
                            borderRadius: '3px',
                            border: stemsPaymentMethod === pm.id ? `2px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.12)',
                            background: stemsPaymentMethod === pm.id ? 'rgba(0,240,255,0.12)' : 'transparent',
                            color: stemsPaymentMethod === pm.id ? effectiveAccent : '#cbd5e1',
                            fontWeight: 800,
                            fontSize: '0.76rem',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <PmIcon size={16} />
                          <span>{pm.label}</span>
                        </button>
                      )
                    })}
                  </div>

                  {stemsPaymentMethod === 'card' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="Jane Producer"
                          value={stemsCardName}
                          onChange={e => setStemsCardName(e.target.value)}
                          required
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Card Number</label>
                        <input
                          type="text"
                          placeholder="4242 •••• •••• 4242"
                          value={stemsCardNumber}
                          onChange={e => setStemsCardNumber(e.target.value)}
                          required
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Exp</label>
                          <input type="text" placeholder="MM/YY" value={stemsCardExp} onChange={e => setStemsCardExp(e.target.value)} required style={{ width: '100%', boxSizing: 'border-box', padding: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>CVC</label>
                          <input type="password" placeholder="•••" value={stemsCardCvc} onChange={e => setStemsCardCvc(e.target.value)} required style={{ width: '100%', boxSizing: 'border-box', padding: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>ZIP</label>
                          <input type="text" placeholder="90210" value={stemsCardZip} onChange={e => setStemsCardZip(e.target.value)} required style={{ width: '100%', boxSizing: 'border-box', padding: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {stemsPaymentMethod === 'credits' && (
                    <div style={{ background: 'rgba(0,240,255,0.06)', border: `1px solid ${effectiveAccent}44`, padding: '12px', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                        Deducting from your TM Credits balance. Instant unmetered download tokens will be minted.
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={stemsProcessing}
                  style={{
                    width: '100%',
                    background: effectiveAccent,
                    color: '#000',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '3px',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: `0 4px 20px ${effectiveAccent}44`
                  }}
                >
                  <RiDownloadFill size={18} />
                  {stemsProcessing ? 'Generating Stem Tokens...' : 'Unlock & Download Stems Pack'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= UNIVERSAL IN-CONTEXT INSTANT CREDIT TOP-UP MODAL ================= */}
      {quickTopUpModalOpen && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setQuickTopUpModalOpen(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `2px solid ${effectiveAccent}`, borderRadius: '4px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', color: '#fff', position: 'relative', boxShadow: `0 20px 70px ${effectiveAccent}44` }}>
            <button
              onClick={() => setQuickTopUpModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <RiCoinsFill size={26} color={effectiveAccent} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 900, color: effectiveAccent }}>
                  Instant TM Credit Top-Up
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Your Balance: <strong style={{ color: '#fff' }}>{userCredits} Credits</strong> • Non-Expiring
                </div>
              </div>
            </div>

            {/* Currency Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '3px', margin: '14px 0 16px' }}>
              <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700 }}>Payment Currency:</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['USD', 'KES'].map(curr => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setQuickTopUpCurrency(curr)}
                    style={{
                      background: quickTopUpCurrency === curr ? effectiveAccent : 'transparent',
                      color: quickTopUpCurrency === curr ? '#000' : '#fff',
                      border: 'none',
                      padding: '4px 10px',
                      borderRadius: '3px',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    {curr === 'USD' ? '$ USD (USA)' : 'KES (Kenya)'}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleProcessQuickTopUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Quick Packages Grid */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                  Select Package
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { id: 'starter', name: 'Starter Pack', credits: 250, usd: '$25.00', kes: 'KES 3,250' },
                    { id: 'creator', name: 'Creator Pack (Popular)', credits: 750, usd: '$65.00', kes: 'KES 8,450' },
                    { id: 'pro', name: 'Pro Maven', credits: 2000, usd: '$150.00', kes: 'KES 19,500' },
                    { id: 'studio', name: 'Studio Master', credits: 5000, usd: '$325.00', kes: 'KES 42,250' }
                  ].map(pkg => (
                    <div
                      key={pkg.id}
                      onClick={() => { setQuickTopUpSelectedPack(pkg.id); setQuickTopUpCustomAmount(''); }}
                      style={{
                        padding: '12px',
                        borderRadius: '3px',
                        border: quickTopUpSelectedPack === pkg.id ? `2px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.12)',
                        background: quickTopUpSelectedPack === pkg.id ? 'rgba(0,240,255,0.12)' : 'rgba(255,255,255,0.03)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', color: quickTopUpSelectedPack === pkg.id ? effectiveAccent : '#94a3b8', fontWeight: 800 }}>{pkg.name}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', margin: '2px 0' }}>{pkg.credits} Credits</div>
                      <div style={{ fontSize: '0.8rem', color: effectiveAccent, fontWeight: 700 }}>
                        {quickTopUpCurrency === 'USD' ? pkg.usd : pkg.kes}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Top-Up Amount Slot */}
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px 16px', borderRadius: '3px', border: quickTopUpSelectedPack === 'custom' ? `2px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.75rem', color: quickTopUpSelectedPack === 'custom' ? effectiveAccent : '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
                    Custom Top-Up Amount Slot
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {quickTopUpCurrency === 'USD' ? 'Min: $5.00 USD' : 'Min: KES 200'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    min={quickTopUpCurrency === 'USD' ? "5" : "200"}
                    step="any"
                    placeholder={quickTopUpCurrency === 'USD' ? 'Enter amount (e.g. 15.00)' : 'Enter amount (e.g. 500)'}
                    value={quickTopUpCustomAmount}
                    onChange={e => {
                      setQuickTopUpCustomAmount(e.target.value)
                      setQuickTopUpSelectedPack('custom')
                    }}
                    style={{ flex: 1, padding: '8px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '3px', fontSize: '0.88rem' }}
                  />
                  {quickTopUpCustomAmount && (
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', background: 'rgba(0,240,255,0.1)', borderRadius: '3px', fontSize: '0.82rem', color: effectiveAccent, fontWeight: 800 }}>
                      +{quickTopUpCurrency === 'USD' ? Math.round(parseFloat(quickTopUpCustomAmount || 0) * 10) : Math.round(parseFloat(quickTopUpCustomAmount || 0) * (10 / 130))} Credits
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Rail Toggle */}
              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                  Payment Method
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setQuickTopUpPaymentGateway('card')}
                    style={{ padding: '8px', borderRadius: '3px', border: quickTopUpPaymentGateway === 'card' ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)', background: quickTopUpPaymentGateway === 'card' ? 'rgba(0,240,255,0.12)' : 'transparent', color: quickTopUpPaymentGateway === 'card' ? effectiveAccent : '#cbd5e1', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <RiBankCardFill size={14} /> Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickTopUpPaymentGateway('mpesa')}
                    style={{ padding: '8px', borderRadius: '3px', border: quickTopUpPaymentGateway === 'mpesa' ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)', background: quickTopUpPaymentGateway === 'mpesa' ? 'rgba(0,240,255,0.12)' : 'transparent', color: quickTopUpPaymentGateway === 'mpesa' ? effectiveAccent : '#cbd5e1', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <RiCellphoneFill size={14} /> M-Pesa STK Push
                  </button>
                </div>

                {quickTopUpPaymentGateway === 'card' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={quickTopUpCardName}
                      onChange={e => setQuickTopUpCardName(e.target.value)}
                      required
                      style={{ padding: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.82rem' }}
                    />
                    <input
                      type="text"
                      placeholder="4242 •••• •••• 4242"
                      value={quickTopUpCardNumber}
                      onChange={e => setQuickTopUpCardNumber(e.target.value)}
                      required
                      style={{ padding: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.82rem' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                      <input type="text" placeholder="MM/YY" value={quickTopUpCardExp} onChange={e => setQuickTopUpCardExp(e.target.value)} required style={{ padding: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.82rem' }} />
                      <input type="password" placeholder="CVC" value={quickTopUpCardCvc} onChange={e => setQuickTopUpCardCvc(e.target.value)} required style={{ padding: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.82rem' }} />
                      <input type="text" placeholder="ZIP" value={quickTopUpCardZip} onChange={e => setQuickTopUpCardZip(e.target.value)} required style={{ padding: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.82rem' }} />
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>M-Pesa Mobile Number (STK Push)</label>
                    <input
                      type="tel"
                      placeholder="+254 712 345 678"
                      value={quickTopUpMpesaPhone}
                      onChange={e => setQuickTopUpMpesaPhone(e.target.value)}
                      required
                      style={{ width: '100%', boxSizing: 'border-box', padding: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.82rem' }}
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={quickTopUpProcessing}
                style={{
                  width: '100%',
                  background: effectiveAccent,
                  color: '#000',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '3px',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: `0 4px 18px ${effectiveAccent}44`
                }}
              >
                <RiCoinsFill size={16} />
                {quickTopUpProcessing ? 'Authorizing Instant Top-Up...' : 'Authorize & Top-Up Credits Now'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= INTELLIGENT PRACTITIONER VERIFICATION MODAL ================= */}
      {practitionerModalOpen && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setPractitionerModalOpen(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `2px solid ${effectiveAccent}`, borderRadius: '4px', width: '100%', maxWidth: '520px', padding: '28px', color: '#fff', position: 'relative', boxShadow: `0 20px 60px ${effectiveAccent}33` }}>
            <button onClick={() => setPractitionerModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.8rem' }}>🎛️</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: effectiveAccent }}>
                  Industry Practitioner Access Required
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Lossless Stems & Sync Licensing Protocol
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, margin: '12px 0 18px' }}>
              Individual multitrack stems and commercial sync clearance are reserved for verified industry professionals (music producers, remixers, club DJs, record labels, and music publishers). Standard fans can purchase the <strong>Full Lossless Album</strong> master audio download.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.74rem', color: effectiveAccent, textTransform: 'uppercase', fontWeight: 800 }}>
                Select Your Industry Practice Role:
              </div>
              {[
                { id: 'producer', label: 'Music Producer / Audio Engineer', desc: 'Commercial remixing & DAW multitrack production' },
                { id: 'dj', label: 'Touring / Club DJ', desc: 'Live stem mixing & acapella / dub edits' },
                { id: 'label', label: 'Record Label / A&R', desc: 'Master rights licensing & catalog placement' },
                { id: 'publisher', label: 'Music Publisher / Sync Supervisor', desc: 'Film, TV & gaming sync synchronization' }
              ].map(role => (
                <div
                  key={role.id}
                  onClick={() => setSelectedPractitionerRole(role.id)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '3px',
                    border: selectedPractitionerRole === role.id ? `2px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.12)',
                    background: selectedPractitionerRole === role.id ? 'rgba(0,240,255,0.1)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: selectedPractitionerRole === role.id ? effectiveAccent : '#fff' }}>
                    {role.label}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{role.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleVerifyPractitioner(selectedPractitionerRole)}
                style={{ flex: 1, background: effectiveAccent, color: '#000', border: 'none', padding: '12px', borderRadius: '3px', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Verify & Unlock Stems ({selectedPractitionerRole.toUpperCase()})
              </button>
              <button
                type="button"
                onClick={() => {
                  setPractitionerModalOpen(false)
                  if (selectedAlbumDetail) handleBuyFullAlbum(selectedAlbumDetail)
                }}
                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px', borderRadius: '3px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Buy Full Album Instead ($9.99)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD TRACK TO FAN PLAYLIST MODAL ================= */}
      {addTrackToPlaylistModal && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setAddTrackToPlaylistModal(null); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${effectiveAccent}66`, borderRadius: '4px', width: '100%', maxWidth: '440px', padding: '24px', color: '#fff', position: 'relative' }}>
            <button onClick={() => setAddTrackToPlaylistModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

            <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 900, color: effectiveAccent }}>
              Add to Fan Playlist
            </h3>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '16px' }}>
              Track: <strong style={{ color: '#fff' }}>{addTrackToPlaylistModal.title}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
              {fanPlaylists.map(pl => (
                <div
                  key={pl.id}
                  onClick={() => handleAddTrackToPlaylist(pl.id, addTrackToPlaylistModal)}
                  style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{pl.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{pl.trackIds?.length || 0} Tracks</div>
                  </div>
                  <RiAddFill color={effectiveAccent} size={18} />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => { setPlaylistModalOpen(true); }}
              style={{ width: '100%', background: 'transparent', border: `1px solid ${effectiveAccent}66`, color: effectiveAccent, padding: '10px', borderRadius: '3px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
            >
              + Create New Playlist
            </button>
          </div>
        </div>
      )}

      {/* ================= CREATE NEW PLAYLIST MODAL ================= */}
      {playlistModalOpen && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setPlaylistModalOpen(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 2550, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${effectiveAccent}66`, borderRadius: '4px', width: '100%', maxWidth: '420px', padding: '24px', color: '#fff', position: 'relative' }}>
            <button onClick={() => setPlaylistModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

            <h3 style={{ margin: '0 0 12px', fontSize: '1.25rem', fontWeight: 900, color: effectiveAccent }}>
              Create Fan Playlist
            </h3>

            <form onSubmit={handleCreatePlaylist} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Playlist Name</label>
                <input
                  type="text"
                  placeholder="e.g. Neon Horizon Favorites"
                  value={newPlaylistName}
                  onChange={e => setNewPlaylistName(e.target.value)}
                  required
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.88rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Curated high rotation tracks"
                  value={newPlaylistDesc}
                  onChange={e => setNewPlaylistDesc(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.88rem' }}
                />
              </div>
              <button
                type="submit"
                style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '12px', borderRadius: '3px', fontWeight: 900, fontSize: '0.88rem', cursor: 'pointer', marginTop: '6px' }}
              >
                Create Playlist
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= EPK PREVIEW MODAL WITH DIRECT PDF DOWNLOAD ================= */}
      {epkPreviewModalOpen && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setEpkPreviewModalOpen(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `2px solid ${effectiveAccent}`, borderRadius: '4px', width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', color: '#fff', position: 'relative', boxShadow: `0 20px 80px ${effectiveAccent}44` }}>
            <button onClick={() => setEpkPreviewModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', background: effectiveAccent, color: '#000', fontWeight: 900, padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                  Official Press Kit Preview
                </span>
                <h3 style={{ margin: '6px 0 0', fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
                  {effectiveArtistName} • Executive Press Kit
                </h3>
              </div>

              {/* Direct PDF Download Action */}
              <button
                type="button"
                onClick={() => {
                  setEpkPreviewModalOpen(false)
                  handleDownloadEpkAssets()
                }}
                style={{
                  background: effectiveAccent,
                  color: '#000',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '3px',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RiDownloadFill size={16} /> Download PDF Press Kit
              </button>
            </div>

            {/* Preview Document Paper Simulation */}
            <div style={{ background: '#fff', color: '#0f172a', borderRadius: '4px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '14px', marginBottom: '20px' }}>
                <div>
                  {effectiveLogoUrl ? (
                    <img src={effectiveLogoUrl} alt={effectiveArtistName} style={{ maxHeight: '42px', maxWidth: '160px', objectFit: 'contain' }} />
                  ) : (
                    <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>{effectiveArtistName}</h2>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>Official Press Kit 2026</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>TuneMavens Verified Creator</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '20px', marginBottom: '20px' }}>
                <img src={epkData?.profilePhoto || epkData?.heroImage || heroSlide1} alt="Profile" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '3px' }} />
                <div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.3rem', fontWeight: 900 }}>{effectiveArtistName}</h3>
                  <div style={{ fontSize: '0.82rem', color: '#0284c7', fontWeight: 700, marginBottom: '10px' }}>{effectiveHeadline}</div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#334155', lineHeight: 1.6 }}>
                    {effectiveBio ? effectiveBio.replace(/<[^>]*>?/gm, '').slice(0, 320) + '...' : 'International touring creator and multitrack recording artist.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '3px', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '16px' }}>
                <div><div style={{ fontSize: '0.65rem', color: '#64748b' }}>STREAMS</div><div style={{ fontWeight: 900, color: '#0f172a' }}>4.2M+</div></div>
                <div><div style={{ fontSize: '0.65rem', color: '#64748b' }}>LISTENERS</div><div style={{ fontWeight: 900, color: '#0f172a' }}>385K/mo</div></div>
                <div><div style={{ fontSize: '0.65rem', color: '#64748b' }}>TOUR CAPACITY</div><div style={{ fontWeight: 900, color: '#0f172a' }}>1.5K - 3.5K</div></div>
                <div><div style={{ fontSize: '0.65rem', color: '#64748b' }}>SYNC STATUS</div><div style={{ fontWeight: 900, color: '#16a34a' }}>100% Cleared</div></div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setEpkPreviewModalOpen(false)}
                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '3px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  setEpkPreviewModalOpen(false)
                  handleDownloadEpkAssets()
                }}
                style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '10px 20px', borderRadius: '3px', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RiDownloadFill size={16} /> Download PDF File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TECHNICAL STAGE RIDER MODAL ================= */}
      {techRiderModalOpen && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setTechRiderModalOpen(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `2px solid ${effectiveAccent}`, borderRadius: '4px', width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', color: '#fff', position: 'relative' }}>
            <button onClick={() => setTechRiderModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

            <h3 style={{ margin: '0 0 6px', fontSize: '1.4rem', fontWeight: 900, color: effectiveAccent }}>
              Technical Stage Rider & Input List
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '16px' }}>
              Standard 2026 Touring Production Specifications
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '3px', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '20px' }}>
              <div><strong>Front of House (FOH):</strong> Digital console (DiGiCo / Yamaha CL5) with AES50 stage rack.</div>
              <div><strong>Monitoring:</strong> 4 stereo IEM mixes (Sennheiser G4 or Shure PSM1000) + 2 sidefill wedges.</div>
              <div><strong>Backline:</strong> 2x Pioneer CDJ-3000, 1x DJM-V10, 2x heavy-duty keyboard stands, clean AC power drop (230V/110V).</div>
              <div><strong>Lighting & Visuals:</strong> Resolume Arena 7 output via HDMI / DisplayPort to 4K LED wall.</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setTechRiderModalOpen(false)}
                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '3px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setTechRiderModalOpen(false)
                  showToast('📥 Downloading Technical Stage Rider PDF...')
                }}
                style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '10px 18px', borderRadius: '3px', fontWeight: 900, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RiDownloadFill size={16} /> Download Technical Rider (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

{/* ================= CART DRAWER MODAL ================= */}
      {cartOpen && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setCartOpen(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 2300, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ background: '#0a0d18', borderLeft: `1px solid ${effectiveAccent}44`, width: '100%', maxWidth: '420px', height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: effectiveAccent, fontSize: '1.3rem', fontWeight: 900 }}>Your Merch Cart</h3>
              <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            </div>

            {orderSuccess ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎉</div>
                <div style={{ color: '#22c55e', fontSize: '1.2rem', fontWeight: 900, marginBottom: '6px' }}>Order Placed Successfully!</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Thank you for supporting {effectiveArtistName}. A confirmation email has been sent.</div>
              </div>
            ) : cart.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                Your cart is currently empty.
              </div>
            ) : (
              <>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <img src={item.img} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '3px' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{item.title}</div>
                        <div style={{ fontSize: '0.8rem', color: effectiveAccent, fontWeight: 700 }}>{item.price}</div>
                        {item.selectedSize !== 'N/A' && <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Size: {item.selectedSize}</div>}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                          <button onClick={() => updateCartQty(idx, -1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '22px', height: '22px', borderRadius: '2px', cursor: 'pointer' }}>-</button>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{item.qty}</span>
                          <button onClick={() => updateCartQty(idx, 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '22px', height: '22px', borderRadius: '2px', cursor: 'pointer' }}>+</button>
                          <button onClick={() => removeFromCart(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer', marginLeft: 'auto' }}>Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '1.1rem', fontWeight: 900 }}>
                    <span>Subtotal</span>
                    <span style={{ color: effectiveAccent }}>${cart.reduce((sum, item) => sum + (item.numPrice * item.qty), 0).toFixed(2)}</span>
                  </div>
                  <button onClick={handleCheckoutCart} style={{ width: '100%', background: effectiveAccent, color: '#000', border: 'none', padding: '12px', borderRadius: '3px', fontWeight: 900, cursor: 'pointer', fontSize: '0.95rem' }}>
                    Checkout with PesaPal / Stripe
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= ALBUM TRACKLIST MODAL ================= */}
      {selectedAlbumModal && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setSelectedAlbumModal(null); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2150, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${effectiveAccent}44`, borderRadius: '4px', width: '100%', maxWidth: '540px', maxHeight: '85vh', overflowY: 'auto', padding: '28px', color: '#fff', position: 'relative' }}>
            <button onClick={() => setSelectedAlbumModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <img src={selectedAlbumModal.cover} alt={selectedAlbumModal.title} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
              <div>
                <span style={{ fontSize: '0.75rem', color: effectiveAccent, fontWeight: 700, textTransform: 'uppercase' }}>{selectedAlbumModal.type} • {selectedAlbumModal.year}</span>
                <h3 style={{ margin: '4px 0 6px', fontSize: '1.25rem', fontWeight: 800 }}>{selectedAlbumModal.title}</h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{selectedAlbumModal.tracksCount} Tracks • ISRC: {selectedAlbumModal.isrc}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
              {[
                { num: 1, title: `${selectedAlbumModal.title} (Intro)`, dur: '1:42' },
                { num: 2, title: 'Nairobi Cyberwave (Master Cut)', dur: '3:45' },
                { num: 3, title: 'Rift Valley Sunset (Dub Mix)', dur: '4:12' },
                { num: 4, title: 'Afro-Synth Multitrack Cascade', dur: '3:18' },
                { num: 5, title: 'Midnight Mara Electric Finale', dur: '5:02' }
              ].map(t => (
                <div key={t.num} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '3px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: effectiveAccent, fontWeight: 800, fontSize: '0.8rem' }}>{t.num}.</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{t.title}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{t.dur}</span>
                </div>
              ))}
            </div>

            <button onClick={() => { handlePurchaseTrackWithCredits(selectedAlbumModal); setSelectedAlbumModal(null); }} style={{ width: '100%', marginTop: '20px', background: effectiveAccent, color: '#000', border: 'none', padding: '10px', borderRadius: '3px', fontWeight: 900, cursor: 'pointer', fontSize: '0.88rem' }}>
              Purchase Lossless Multitrack Stems ({selectedAlbumModal.priceCredits} Credits)
            </button>
          </div>
        </div>
      )}

      {/* ================= 8. PHOTO GALLERY CAROUSEL LIGHTBOX MODAL ================= */}
      {galleryModalOpen && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setGalleryModalOpen(false); }}
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(5, 7, 15, 0.94)', 
            backdropFilter: 'blur(16px)', 
            zIndex: 2500, 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px',
            color: '#fff'
          }}
        >
          {/* Top Bar: Counter, Title, Close Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ background: effectiveAccent, color: '#000', fontWeight: 900, fontSize: '0.78rem', padding: '3px 10px', borderRadius: '3px' }}>
                📷 Photo {activeGalleryIndex + 1} of {galleryPhotos.length}
              </span>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#fff', fontFamily: effectiveFont }}>
                {galleryPhotos[activeGalleryIndex]?.title}
              </h3>
            </div>

            <button 
              onClick={() => setGalleryModalOpen(false)} 
              title="Close Gallery (Esc)"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '36px', height: '36px', borderRadius: '3px', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>
          </div>

          {/* Main Stage: Carousel with Left / Right Arrows */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '12px 0' }}>
            {/* Left Navigation Arrow */}
            <button 
              onClick={() => setActiveGalleryIndex(prev => (prev === 0 ? galleryPhotos.length - 1 : prev - 1))}
              title="Previous Photo (Left Arrow)"
              style={{
                position: 'absolute',
                left: '10px',
                zIndex: 2510,
                background: 'rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                width: '50px',
                height: '50px',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                transition: 'all 0.2s ease'
              }}
            >
              <RiArrowLeftSLine />
            </button>

            {/* Active Image and Caption */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '90%', maxHeight: '72vh' }}>
              <img 
                src={galleryPhotos[activeGalleryIndex]?.url} 
                alt={galleryPhotos[activeGalleryIndex]?.title} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '62vh', 
                  objectFit: 'contain', 
                  borderRadius: '3px', 
                  boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }} 
              />
              <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#cbd5e1', textAlign: 'center', maxWidth: '650px', background: 'rgba(0,0,0,0.5)', padding: '6px 16px', borderRadius: '3px' }}>
                {galleryPhotos[activeGalleryIndex]?.caption}
              </div>
            </div>

            {/* Right Navigation Arrow */}
            <button 
              onClick={() => setActiveGalleryIndex(prev => (prev + 1) % galleryPhotos.length)}
              title="Next Photo (Right Arrow)"
              style={{
                position: 'absolute',
                right: '10px',
                zIndex: 2510,
                background: 'rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                width: '50px',
                height: '50px',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                transition: 'all 0.2s ease'
              }}
            >
              <RiArrowRightSLine />
            </button>
          </div>

          {/* Bottom Thumbnail Strip */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', overflowX: 'auto', padding: '12px 0', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
            {galleryPhotos.map((photo, idx) => (
              <div 
                key={photo.id}
                onClick={() => setActiveGalleryIndex(idx)}
                style={{
                  width: '64px',
                  height: '46px',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: idx === activeGalleryIndex ? `2px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.2)',
                  opacity: idx === activeGalleryIndex ? 1 : 0.5,
                  transform: idx === activeGalleryIndex ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <img src={photo.thumbnail} alt={photo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 9. VIP FAN AUTH MODAL: SIGN UP VS LOGIN ================= */}
      {authModalOpen && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setAuthModalOpen(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 2200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${effectiveAccent}55`, borderRadius: '3px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', color: '#fff', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
            <button onClick={() => setAuthModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

            {/* Creator Logo & Unified Network Header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px', textAlign: 'center' }}>
              {effectiveLogoUrl ? (
                <img src={effectiveLogoUrl} alt={effectiveArtistName} style={{ maxHeight: '44px', maxWidth: '180px', objectFit: 'contain', marginBottom: '4px' }} />
              ) : (
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: effectiveAccent, fontFamily: effectiveFont }}>{effectiveArtistName}</div>
              )}
              <div style={{ fontSize: '0.66rem', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
                Powered by TuneMavens • Unified Intermaven Network
              </div>
            </div>
            
            {/* Auth Mode Switcher */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', padding: '4px', marginBottom: '18px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '3px',
                  border: 'none',
                  background: authMode === 'signup' ? effectiveAccent : 'transparent',
                  color: authMode === 'signup' ? '#000' : '#fff',
                  fontWeight: 900,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                ✨ New Fan Sign Up
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '3px',
                  border: 'none',
                  background: authMode === 'login' ? effectiveAccent : 'transparent',
                  color: authMode === 'login' ? '#000' : '#fff',
                  fontWeight: 900,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                🔐 Existing Fan Log In
              </button>
            </div>

            {authMode === 'login' ? (
              /* LOGIN FORM */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px', color: effectiveAccent, fontWeight: 900, fontSize: '1.35rem', fontFamily: effectiveFont }}>
                    Welcome Back to {effectiveArtistName}'s World
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0 }}>
                    Log in with your email or use 1-click test profiles from the Intermaven Smart CRM.
                  </p>
                </div>

                {/* Quick 1-Click Review Profiles */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${effectiveAccent}33`, padding: '12px', borderRadius: '3px' }}>
                  <div style={{ fontSize: '0.72rem', color: effectiveAccent, fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Quick 1-Click Review Profiles (Seeded in CRM)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleAuthLogin('maya.chen@musicvault.io')}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left' }}
                    >
                      <div>Maya Chen</div>
                      <div style={{ fontSize: '0.68rem', color: effectiveAccent }}>VIP Fan • WhatsApp</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAuthLogin('d.ochieng@nairobibeats.ke')}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left' }}
                    >
                      <div>David Ochieng</div>
                      <div style={{ fontSize: '0.68rem', color: effectiveAccent }}>Collector • SMS</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Email Address</label>
                  <input
                    type="email"
                    placeholder="fan@intermaven.io"
                    value={authLoginEmail}
                    onChange={(e) => setAuthLoginEmail(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Password / PIN</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={authLoginPass}
                    onChange={(e) => setAuthLoginPass(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.88rem' }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleAuthLogin(authLoginEmail)}
                  style={{
                    background: effectiveAccent,
                    color: '#000',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '3px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    fontSize: '0.92rem',
                    boxShadow: `0 4px 16px ${effectiveAccent}55`
                  }}
                >
                  Log In & Open Fan Portal
                </button>
              </div>
            ) : (
              /* SIGNUP FORM */
              <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px', color: effectiveAccent, fontWeight: 900, fontSize: '1.35rem', fontFamily: effectiveFont }}>
                    Join {effectiveArtistName}'s Fan Club
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    Sign up to post comments, unlock unreleased stems, claim 20% ticket discounts, and configure your preferred alerts.
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Maya Chen" 
                    value={authName} 
                    onChange={(e) => setAuthName(e.target.value)} 
                    required 
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.88rem' }} 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="fan@intermaven.io" 
                    value={authEmail} 
                    onChange={(e) => setAuthEmail(e.target.value)} 
                    required 
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.88rem' }} 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Mobile / WhatsApp Number (Optional for SMS/WhatsApp Alerts)</label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 019-2834" 
                    value={authPhone} 
                    onChange={(e) => setAuthPhone(e.target.value)} 
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.88rem' }} 
                  />
                </div>

                {/* Preferred Communication Method */}
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>Preferred Communication Method</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    {[
                      { id: 'email', label: 'Email', icon: '✉️' },
                      { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
                      { id: 'sms', label: 'SMS', icon: '📱' },
                      { id: 'push', label: 'Push', icon: '🔔' }
                    ].map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setAuthCommMethod(method.id)}
                        style={{
                          padding: '8px 4px',
                          borderRadius: '3px',
                          border: authCommMethod === method.id ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)',
                          background: authCommMethod === method.id ? `${effectiveAccent}22` : 'rgba(255,255,255,0.03)',
                          color: authCommMethod === method.id ? effectiveAccent : '#cbd5e1',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        <div>{method.icon}</div>
                        <div style={{ marginTop: '2px' }}>{method.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fan Engagement Interests */}
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>Fan Engagement Interests</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[
                      'VIP Tour Pre-Sales & Discounts',
                      'Unreleased WAV Master Stems',
                      'Exclusive Fan Club Merch Drops',
                      'Backstage Passes & Meet & Greet'
                    ].map(interest => {
                      const isChecked = authSelectedInterests.includes(interest)
                      return (
                        <label key={interest} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            onChange={() => {
                              if (isChecked) {
                                setAuthSelectedInterests(authSelectedInterests.filter(i => i !== interest))
                              } else {
                                setAuthSelectedInterests([...authSelectedInterests, interest])
                              }
                            }} 
                            style={{ accentColor: effectiveAccent }}
                          />
                          {interest}
                        </label>
                      )
                    })}
                  </div>
                </div>

                <button 
                  type="submit" 
                  style={{ 
                    background: effectiveAccent, 
                    color: '#000', 
                    border: 'none', 
                    padding: '12px', 
                    borderRadius: '3px', 
                    fontWeight: 900, 
                    cursor: 'pointer', 
                    fontSize: '0.92rem',
                    marginTop: '6px',
                    boxShadow: `0 4px 16px ${effectiveAccent}55`
                  }}
                >
                  Join Fan Club & Ingest to CRM
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= 10. COMPREHENSIVE CREATOR FAN PORTAL MODAL ================= */}
      {fanPortalOpen && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setFanPortalOpen(false); }} 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.88)', 
            backdropFilter: 'blur(14px)', 
            zIndex: 2300, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '20px' 
          }}
        >
          <div 
            style={{ 
              background: '#0a0d1a', 
              border: `1px solid ${effectiveAccent}44`, 
              borderRadius: '3px', 
              width: '100%', 
              maxWidth: '880px', 
              maxHeight: '88vh', 
              display: 'flex', 
              flexDirection: 'column', 
              overflow: 'hidden', 
              boxShadow: '0 25px 80px rgba(0,0,0,0.9)',
              color: '#fff' 
            }}
          >
            {/* Fan Portal Header Bar */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '3px', background: effectiveAccent, color: '#000', fontWeight: 900, fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {effectiveArtistName.charAt(0)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#fff', fontFamily: effectiveFont }}>
                      {effectiveArtistName} Fan Portal
                    </h3>
                    <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', padding: '2px 8px', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 800 }}>
                      🌟 VIP Member
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                    Logged in as <strong style={{ color: '#fff' }}>{fanUser?.name}</strong> • CRM ID: {fanUser?.crmId || 'CRM-849201'} • Alerts: <span style={{ color: effectiveAccent }}>{fanUser?.preferredCommMethod?.toUpperCase() || 'EMAIL'}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.12)', padding: '6px 12px', borderRadius: '3px', fontSize: '0.8rem', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Intermaven Credits</div>
                  <div style={{ fontWeight: 900, color: effectiveAccent, fontSize: '0.95rem' }}>{userCredits} TM</div>
                </div>
                <button 
                  onClick={() => setFanPortalOpen(false)} 
                  style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: '34px', height: '34px', borderRadius: '3px', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Portal Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', padding: '12px 24px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
              {[
                { id: 'vault', label: 'Exclusive Vault & Stems', icon: '🎵' },
                { id: 'tickets', label: 'Discounted Show Tickets', icon: '🎟️' },
                { id: 'merch', label: 'Special Fan Merch Drops', icon: '👕' },
                { id: 'voting', label: 'Setlist Voting & Interaction', icon: '🗳️' },
                { id: 'settings', label: 'Communication Preferences', icon: '⚙️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFanPortalTab(tab.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '3px',
                    border: fanPortalTab === tab.id ? `1px solid ${effectiveAccent}` : '1px solid transparent',
                    background: fanPortalTab === tab.id ? `${effectiveAccent}22` : 'transparent',
                    color: fanPortalTab === tab.id ? effectiveAccent : '#94a3b8',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>

            {/* Portal Tab Content Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {/* TAB 1: EXCLUSIVE VAULT & STEMS */}
              {fanPortalTab === 'vault' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ background: 'rgba(34,211,238,0.06)', border: `1px solid ${effectiveAccent}33`, padding: '16px', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h4 style={{ margin: 0, color: effectiveAccent, fontSize: '1rem', fontWeight: 800 }}>
                        24-Bit / 96kHz Multitrack Lossless Stems Vault
                      </h4>
                      <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#cbd5e1' }}>
                        Direct master stems pre-cleared for VIP members. Redeem stems directly with your Intermaven Credits balance.
                      </p>
                    </div>
                    <button 
                      onClick={() => { setActiveTab('pricing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '6px 14px', borderRadius: '3px', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}
                    >
                      Top Up Credits
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { id: 901, title: 'Nairobi Cyberwave (Studio Multitrack Stems Pack)', stems: 'Drums • Sub-Bass • Lead Synth • Vocal FX', duration: '3:45', credits: 40, format: '24-Bit WAV / ZIP (320 MB)' },
                      { id: 902, title: 'Sunset over Rift Valley (Acoustic VIP Stems)', stems: 'Nylon Guitar • Kalimba • Percussion • Ambient Pad', duration: '4:12', credits: 40, format: '24-Bit WAV / ZIP (280 MB)' },
                      { id: 903, title: 'Afro-Synth Cascade (Unreleased Club Dub Stems)', stems: 'Korg Poly • Modular Bass • Drum Machine • Stabs', duration: '3:18', credits: 45, format: '24-Bit WAV / ZIP (310 MB)' }
                    ].map(stem => (
                      <div key={stem.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px 18px', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{stem.title}</div>
                          <div style={{ fontSize: '0.78rem', color: effectiveAccent, marginTop: '3px' }}>{stem.stems}</div>
                          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>{stem.format} • {stem.duration}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button 
                            onClick={() => {
                              if (userCredits >= stem.credits) {
                                setUserCredits(prev => prev - stem.credits)
                                alert(`Redeemed ${stem.title}! Download link generated (Simulated). Remaining Credits: ${userCredits - stem.credits}`)
                              } else {
                                showToast('⚠️ Insufficient credits. Please top up your balance.')
                              }
                            }} 
                            style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '8px 16px', borderRadius: '3px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
                          >
                            Redeem Stems ({stem.credits} Credits)
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: DISCOUNTED SHOW TICKETS */}
              {fanPortalTab === 'tickets' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* VIP Promo Banner */}
                  <div style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(255,0,127,0.15))', border: `1px solid ${effectiveAccent}66`, padding: '16px 20px', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', background: '#000', color: effectiveAccent, padding: '2px 8px', borderRadius: '3px', fontWeight: 900 }}>FAN CLUB VIP PERK</span>
                      <h4 style={{ margin: '6px 0 2px', fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>
                        20% Discount Code on All World Tour Shows
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1' }}>
                        Use exclusive promo code <strong style={{ color: effectiveAccent }}>VIPFAN20</strong> at checkout or reserve with 1-click below.
                      </p>
                    </div>

                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText('VIPFAN20')
                        setCopiedPromo(true)
                        setTimeout(() => setCopiedPromo(false), 2500)
                      }}
                      style={{ background: '#fff', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '3px', fontWeight: 900, fontSize: '0.82rem', cursor: 'pointer' }}
                    >
                      {copiedPromo ? '✓ Code Copied!' : 'Copy Code: VIPFAN20'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {shows.map(show => {
                      const discountedGA = (show.priceGA * 0.8).toFixed(2)
                      const discountedVIP = (show.priceVIP * 0.8).toFixed(2)
                      return (
                        <div key={show.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px 18px', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: effectiveAccent, fontWeight: 800 }}>{show.date}</div>
                            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff', margin: '2px 0' }}>{show.venue}</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{show.city}</div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through' }}>${show.priceGA} Retail</div>
                              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#22c55e' }}>${discountedGA} (VIP GA)</div>
                            </div>
                            <button 
                              onClick={() => {
                                setSelectedShow(show)
                                setFanPortalOpen(false)
                              }} 
                              style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '8px 16px', borderRadius: '3px', fontWeight: 900, fontSize: '0.82rem', cursor: 'pointer' }}
                            >
                              Reserve Pass (${discountedGA})
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: SPECIAL FAN MERCH DROPS */}
              {fanPortalTab === 'merch' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px 18px', borderRadius: '3px' }}>
                    <span style={{ fontSize: '0.72rem', color: effectiveAccent, fontWeight: 800 }}>FAN CLUB EXCLUSIVE PRICING</span>
                    <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#cbd5e1' }}>
                      Members receive up to 25% off physical collectibles, limited vinyl pressings, and tour apparel.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    {products.map(p => {
                      const fanPrice = (p.numPrice * 0.8).toFixed(2)
                      return (
                        <div key={p.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', borderRadius: '3px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <img src={p.img} alt={p.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '3px', marginBottom: '10px' }} />
                            <div style={{ fontSize: '0.72rem', color: effectiveAccent, fontWeight: 800, textTransform: 'uppercase' }}>{p.category}</div>
                            <h5 style={{ margin: '4px 0 6px', fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>{p.title}</h5>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                              <span style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>{p.price}</span>
                              <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#22c55e' }}>${fanPrice}</span>
                              <span style={{ fontSize: '0.68rem', background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '2px 5px', borderRadius: '3px', fontWeight: 800 }}>-20% VIP</span>
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              addToCart({ ...p, price: `$${fanPrice}`, numPrice: parseFloat(fanPrice) })
                              showToast(`🛍️ Added ${p.title} to Cart with VIP Member discount!`)
                            }} 
                            style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '8px', borderRadius: '3px', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            Add to Cart (${fanPrice})
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: SETLIST VOTING & FAN INTERACTION */}
              {fanPortalTab === 'voting' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Setlist Voting Card */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '3px' }}>
                    <span style={{ fontSize: '0.72rem', color: effectiveAccent, fontWeight: 900, textTransform: 'uppercase' }}>Fan Poll</span>
                    <h4 style={{ margin: '6px 0 6px', fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>
                      Vote for the Encore Song on the 2026 World Tour
                    </h4>
                    <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#94a3b8' }}>
                      {effectiveArtistName} lets VIP Fan Club members decide which unreleased or extended cut gets performed as the final encore.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { id: 'song1', title: 'Nairobi Cyberwave (Acoustic Reprise)', votes: '54%' },
                        { id: 'song2', title: 'Rift Valley Sunset (Extended Modular Dub)', votes: '31%' },
                        { id: 'song3', title: 'Afro-Synth Cascade (Heavy Bass VIP Edit)', votes: '15%' }
                      ].map(option => (
                        <div 
                          key={option.id}
                          onClick={() => setFanVotedSong(option.id)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '3px',
                            border: fanVotedSong === option.id ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.1)',
                            background: fanVotedSong === option.id ? `${effectiveAccent}18` : 'rgba(255,255,255,0.02)',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: fanVotedSong === option.id ? effectiveAccent : '#94a3b8' }}>
                              {fanVotedSong === option.id ? '◉' : '○'}
                            </span>
                            <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fff' }}>{option.title}</span>
                          </div>
                          <span style={{ fontWeight: 900, fontSize: '0.82rem', color: effectiveAccent }}>{option.votes}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ask Creator Question Card */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '3px' }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 900, color: '#fff' }}>
                      Direct Creator Fan Q&A
                    </h4>
                    <p style={{ margin: '0 0 12px', fontSize: '0.82rem', color: '#94a3b8' }}>
                      Submit your question or production inquiry to {effectiveArtistName} for the monthly livestream Q&A.
                    </p>

                    {fanQuestionSent ? (
                      <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', color: '#22c55e', padding: '12px', borderRadius: '3px', fontSize: '0.85rem', fontWeight: 800, textAlign: 'center' }}>
                        ✓ Question received and logged in {effectiveArtistName}'s creator inbox!
                      </div>
                    ) : (
                      <form onSubmit={(e) => { e.preventDefault(); if (fanQuestionText) setFanQuestionSent(true); }} style={{ display: 'flex', gap: '10px' }}>
                        <input 
                          type="text" 
                          placeholder="Ask about stems, synthesis, tour dates..." 
                          value={fanQuestionText} 
                          onChange={(e) => setFanQuestionText(e.target.value)} 
                          required 
                          style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} 
                        />
                        <button type="submit" style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '10px 18px', borderRadius: '3px', fontWeight: 900, cursor: 'pointer', fontSize: '0.82rem' }}>
                          Submit
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: COMMUNICATION PREFERENCES */}
              {fanPortalTab === 'settings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '3px' }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 900, color: '#fff' }}>
                      Preferred Communication Channel
                    </h4>
                    <p style={{ margin: '0 0 14px', fontSize: '0.82rem', color: '#94a3b8' }}>
                      Choose how you would like to receive secret tour ticket links, stem drops, and merchandise coupon codes.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                      {[
                        { id: 'email', label: 'Email', icon: '✉️' },
                        { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
                        { id: 'sms', label: 'SMS Alerts', icon: '📱' },
                        { id: 'push', label: 'In-App Push', icon: '🔔' }
                      ].map(channel => (
                        <div
                          key={channel.id}
                          onClick={() => {
                            const updated = { ...fanUser, preferredCommMethod: channel.id }
                            setFanUser(updated)
                            localStorage.setItem(`fan_session_${artistSlug}`, JSON.stringify(updated))
                          }}
                          style={{
                            padding: '14px',
                            borderRadius: '3px',
                            border: fanUser?.preferredCommMethod === channel.id ? `2px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.1)',
                            background: fanUser?.preferredCommMethod === channel.id ? `${effectiveAccent}18` : 'rgba(255,255,255,0.03)',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{channel.icon}</div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: fanUser?.preferredCommMethod === channel.id ? effectiveAccent : '#fff' }}>{channel.label}</div>
                        </div>
                      ))}
                    </div>

                    <h4 style={{ margin: '16px 0 10px', fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>
                      Notification Category Subscriptions
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        '⚡ Instant Tour Pre-Sale Alerts & Seat Holds',
                        '🎵 Unreleased 24-Bit Lossless Stem Drops',
                        '👕 Exclusive Fan Club Merchandise Flash Sales',
                        '🎙️ Creator Behind-The-Scenes & Live Q&A Notifications'
                      ].map((sub, idx) => (
                        <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: '#cbd5e1', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '3px' }}>
                          <input type="checkbox" defaultChecked style={{ accentColor: effectiveAccent }} />
                          {sub}
                        </label>
                      ))}
                    </div>

                    <button 
                      onClick={() => showToast('Preferences saved and synced across Intermaven Smart CRM.')} 
                      style={{ marginTop: '18px', background: effectiveAccent, color: '#000', border: 'none', padding: '10px 20px', borderRadius: '3px', fontWeight: 900, fontSize: '0.84rem', cursor: 'pointer' }}
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: VIEW TRACK DETAILS MODAL ================= */}
      {selectedTrackModal && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setSelectedTrackModal(null); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${effectiveAccent}55`, borderRadius: '3px', width: '100%', maxWidth: '520px', padding: '28px', color: '#fff', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.9)' }}>
            <button onClick={() => setSelectedTrackModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
              <img
                src={selectedTrackModal.coverArt || 'https://picsum.photos/seed/track_modal_art/400'}
                alt={selectedTrackModal.title}
                style={{ width: '110px', height: '110px', borderRadius: '3px', objectFit: 'cover', border: `1px solid ${effectiveAccent}66`, boxShadow: '0 6px 20px rgba(0,0,0,0.6)' }}
              />
              <div style={{ flex: 1 }}>
                <span style={{ background: effectiveAccent, color: '#000', fontWeight: 900, fontSize: '0.68rem', padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                  TuneStream Lossless 24-Bit Master
                </span>
                <h3 style={{ margin: '8px 0 4px', fontSize: '1.3rem', fontWeight: 900, color: '#fff' }}>
                  {selectedTrackModal.title}
                </h3>
                <div style={{ fontSize: '0.78rem', color: effectiveAccent, fontWeight: 700 }}>
                  ISRC: {selectedTrackModal.isrc || 'KE-TM1-26-00042'} • {selectedTrackModal.duration || '3:45'}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
                  Audio Specification: FLAC / WAV 96kHz / 24-bit Studio Master
                </div>
              </div>
            </div>

            {/* Simulated Waveform Graphic */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Waveform Analyzer</span>
                <span style={{ color: effectiveAccent }}>124 BPM • D Minor</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '36px' }}>
                {[30, 45, 75, 90, 60, 40, 85, 95, 70, 50, 65, 80, 100, 85, 60, 40, 75, 90, 80, 55, 65, 90, 75, 60, 45, 70, 85, 60, 40, 30].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, background: i < 14 ? effectiveAccent : 'rgba(255,255,255,0.2)', borderRadius: '1px' }} />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  window.open('http://localhost:3001', '_blank')
                  showToast('🎧 Opening TuneStream Lossless Audio Player (localhost:3001)...')
                }}
                style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '12px', borderRadius: '3px', fontWeight: 900, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <RiPlayFill /> Stream Lossless on TuneStream
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => {
                    handlePurchaseTrackWithCredits(selectedTrackModal)
                    setSelectedTrackModal(null)
                  }}
                  style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${effectiveAccent}66`, color: '#fff', padding: '10px', borderRadius: '3px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <RiCoinsFill style={{ color: effectiveAccent }} /> Buy Stems ({selectedTrackModal.priceCredits || 50} TM)
                </button>
                <button
                  onClick={() => {
                    showToast('⬇️ Downloading Uncompressed 24-bit WAV Master...')
                    setTimeout(() => showToast('✅ Master WAV audio file ready in downloads.'), 1200)
                  }}
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '10px', borderRadius: '3px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <RiDownloadFill /> Download WAV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: EVENT PAGE & FLYER MODAL ================= */}
      {selectedEventModal && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setSelectedEventModal(null); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${effectiveAccent}55`, borderRadius: '3px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', color: '#fff', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.9)' }}>
            <button onClick={() => setSelectedEventModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

            {/* Concert Flyer Thumbnail Banner */}
            <div style={{ position: 'relative', width: '100%', height: '260px', borderRadius: '3px', overflow: 'hidden', marginBottom: '20px', border: `1px solid ${effectiveAccent}44` }}>
              <img
                src={selectedEventModal.flyer || 'https://picsum.photos/seed/concert_flyer_lg/800/600'}
                alt={selectedEventModal.venue}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0d18 0%, rgba(10,13,24,0.3) 60%, transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                <span style={{ background: effectiveAccent, color: '#000', fontWeight: 900, fontSize: '0.68rem', padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                  World Tour 2026 Showcase
                </span>
                <h2 style={{ margin: '6px 0 2px', fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>
                  {selectedEventModal.venue}
                </h2>
                <div style={{ fontSize: '0.85rem', color: effectiveAccent, fontWeight: 700 }}>
                  {selectedEventModal.city} • {selectedEventModal.date}
                </div>
              </div>
            </div>

            {/* Event Specs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', fontSize: '0.84rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800 }}>Doors & Showtime</div>
                <div style={{ color: '#fff', fontWeight: 800, marginTop: '4px' }}>Doors: 7:00 PM • Live: 8:30 PM</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800 }}>Age Policy</div>
                <div style={{ color: '#fff', fontWeight: 800, marginTop: '4px' }}>18+ Entry (Government ID Required)</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800 }}>Supporting Acts</div>
                <div style={{ color: '#fff', fontWeight: 800, marginTop: '4px' }}>DJ Savannah Glow + Special Guests</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 800 }}>Venue Capacity</div>
                <div style={{ color: '#fff', fontWeight: 800, marginTop: '4px' }}>2,500 Seated & Standing Floor</div>
              </div>
            </div>

            {/* Direct Ticket Purchase Button */}
            <button
              onClick={() => {
                const s = selectedEventModal
                setSelectedEventModal(null)
                setSelectedShow(s)
                setTicketSuccess(null)
              }}
              style={{ width: '100%', background: effectiveAccent, color: '#000', border: 'none', padding: '14px', borderRadius: '3px', fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: `0 4px 20px ${effectiveAccent}55` }}
            >
              <RiTicket2Fill /> Purchase Tickets (From ${selectedEventModal.priceGA})
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: PRODUCT OPTIONS & CUSTOMIZER MODAL ================= */}
      {selectedProductModal && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setSelectedProductModal(null); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${effectiveAccent}55`, borderRadius: '3px', width: '100%', maxWidth: '520px', padding: '28px', color: '#fff', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.9)' }}>
            <button onClick={() => setSelectedProductModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

            <div style={{ display: 'flex', gap: '18px', marginBottom: '20px' }}>
              <img
                src={selectedProductModal.img}
                alt={selectedProductModal.title}
                style={{ width: '100px', height: '100px', borderRadius: '3px', objectFit: 'cover', border: `1px solid ${effectiveAccent}44` }}
              />
              <div>
                <span style={{ fontSize: '0.68rem', background: effectiveAccent, color: '#000', fontWeight: 900, padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                  {selectedProductModal.category}
                </span>
                <h3 style={{ margin: '6px 0 4px', fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>
                  {selectedProductModal.title}
                </h3>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: effectiveAccent }}>
                  {selectedProductModal.price}
                </div>
              </div>
            </div>

            {/* Options Specific to Category */}
            {selectedProductModal.category === 'apparel' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>Select Size</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['S', 'M', 'L', 'XL', '2XL'].map(sz => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedProductSize(sz)}
                        style={{ flex: 1, padding: '8px', borderRadius: '3px', border: selectedProductSize === sz ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)', background: selectedProductSize === sz ? effectiveAccent : 'transparent', color: selectedProductSize === sz ? '#000' : '#fff', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>Select Color</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['Onyx Black', 'Cream Ivory', 'Charcoal Slate'].map(col => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedProductColor(col)}
                        style={{ flex: 1, padding: '8px', borderRadius: '3px', border: selectedProductColor === col ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)', background: selectedProductColor === col ? `${effectiveAccent}22` : 'transparent', color: selectedProductColor === col ? effectiveAccent : '#cbd5e1', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedProductModal.category === 'vinyl' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>Vinyl Pressing Edition</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    ['standard', 'Standard Heavyweight Black 180g Vinyl'],
                    ['colored', 'Limited Gold & Bronze Splatter Vinyl (+ $10)'],
                    ['signed', 'Numbered & Autographed Gatefold Edition (+ $25)']
                  ].map(([edKey, edLbl]) => (
                    <button
                      key={edKey}
                      type="button"
                      onClick={() => setSelectedProductEdition(edKey)}
                      style={{ padding: '10px 14px', borderRadius: '3px', border: selectedProductEdition === edKey ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)', background: selectedProductEdition === edKey ? `${effectiveAccent}22` : 'transparent', color: selectedProductEdition === edKey ? effectiveAccent : '#cbd5e1', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left' }}
                    >
                      {edLbl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedProductModal.category === 'stems' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>Stems Licensing Tier</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    ['creator', 'Creator Personal & Remix License (WAV Stems)'],
                    ['commercial', 'Commercial Sync & Monetized Master Rights (+ $50)']
                  ].map(([licKey, licLbl]) => (
                    <button
                      key={licKey}
                      type="button"
                      onClick={() => setSelectedProductEdition(licKey)}
                      style={{ padding: '10px 14px', borderRadius: '3px', border: selectedProductEdition === licKey ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)', background: selectedProductEdition === licKey ? `${effectiveAccent}22` : 'transparent', color: selectedProductEdition === licKey ? effectiveAccent : '#cbd5e1', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left' }}
                    >
                      {licLbl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => addProductWithOptionsToCart(selectedProductModal, selectedProductSize, selectedProductColor, selectedProductEdition)}
              style={{ width: '100%', background: effectiveAccent, color: '#000', border: 'none', padding: '14px', borderRadius: '3px', fontWeight: 900, fontSize: '0.92rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: `0 4px 16px ${effectiveAccent}55` }}
            >
              <RiShoppingBagFill /> Confirm Options & Add to Cart
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: MERCH CHECKOUT & PAYMENT PROTOCOL ================= */}
      {merchCheckoutOpen && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setMerchCheckoutOpen(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${effectiveAccent}55`, borderRadius: '3px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', color: '#fff', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.9)' }}>
            <button onClick={() => { setMerchCheckoutOpen(false); setMerchOrderConfirmed(null); }} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

            {merchOrderConfirmed ? (
              /* ORDER CONFIRMATION SCREEN */
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: effectiveAccent, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 16px' }}>
                  ✓
                </div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
                  Order Confirmed!
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 20px' }}>
                  Thank you for your order. A digital receipt has been sent to your email.
                </p>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${effectiveAccent}33`, padding: '16px', borderRadius: '3px', textAlign: 'left', marginBottom: '20px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Order Number:</span>
                    <strong style={{ color: effectiveAccent }}>{merchOrderConfirmed.orderId}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Tracking Number:</span>
                    <span style={{ fontFamily: 'monospace', color: '#fff' }}>{merchOrderConfirmed.trackingCode}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Total Paid:</span>
                    <strong style={{ color: '#10b981' }}>${merchOrderConfirmed.totalPaid}</strong>
                  </div>
                </div>

                <button
                  onClick={() => { setMerchCheckoutOpen(false); setMerchOrderConfirmed(null); }}
                  style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '10px 24px', borderRadius: '3px', fontWeight: 900, cursor: 'pointer' }}
                >
                  Return to Store
                </button>
              </div>
            ) : (
              /* CHECKOUT FORM */
              <form onSubmit={handleMerchCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span style={{ background: effectiveAccent, color: '#000', fontWeight: 900, fontSize: '0.68rem', padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                    Secure Merch Checkout
                  </span>
                  <h3 style={{ margin: '8px 0 4px', fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>
                    Complete Your Merch & Stems Order
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
                    Total: <strong style={{ color: effectiveAccent }}>${(cartTotal * (1 - appliedPromoDiscount)).toFixed(2)}</strong> {appliedPromoDiscount > 0 && <span style={{ color: '#10b981' }}>(20% VIP Fan Discount Applied)</span>}
                  </div>
                </div>

                {/* Promo Code Input */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Promo Code (Try: VIPFAN20)"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    style={{ background: 'rgba(255,255,255,0.1)', border: `1px solid ${effectiveAccent}55`, color: '#fff', padding: '10px 14px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Apply
                  </button>
                </div>

                {/* Shipping Details */}
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Shipping Address</label>
                  <input type="text" placeholder="Full Street Address" required style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem', marginBottom: '8px' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input type="text" placeholder="City" required style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                    <input type="text" placeholder="Postal / ZIP Code" required style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                  </div>
                </div>

                {/* Payment Gateway Selector */}
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>Select Payment Protocol</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {[
                      ['stripe', 'Credit / Card', '💳'],
                      ['pesapal', 'PesaPal / M-Pesa', '📱'],
                      ['credits', 'TM Credits', '💎']
                    ].map(([gw, lbl, icn]) => (
                      <button
                        key={gw}
                        type="button"
                        onClick={() => setMerchPaymentGateway(gw)}
                        style={{ padding: '10px 6px', borderRadius: '3px', border: merchPaymentGateway === gw ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)', background: merchPaymentGateway === gw ? `${effectiveAccent}22` : 'rgba(255,255,255,0.03)', color: merchPaymentGateway === gw ? effectiveAccent : '#cbd5e1', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', textAlign: 'center' }}
                      >
                        <div>{icn}</div>
                        <div style={{ marginTop: '2px' }}>{lbl}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {merchPaymentGateway === 'pesapal' && (
                  <div>
                    <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>M-Pesa Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="+254 712 345 678"
                      value={merchMpesaPhone}
                      onChange={(e) => setMerchMpesaPhone(e.target.value)}
                      required
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>You will receive an STK prompt on your handset to authorize payment.</span>
                  </div>
                )}

                {merchPaymentGateway === 'stripe' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Card Number: 4242 •••• •••• 4242"
                      value={merchCardNumber}
                      onChange={(e) => setMerchCardNumber(e.target.value)}
                      required
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <input type="text" placeholder="MM / YY" required style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                      <input type="text" placeholder="CVC" required style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                    </div>
                  </div>
                )}

                {merchPaymentGateway === 'credits' && (
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${effectiveAccent}33`, padding: '12px', borderRadius: '3px', fontSize: '0.84rem' }}>
                    <div>Your Balance: <strong style={{ color: effectiveAccent }}>{userCredits} TM Credits</strong></div>
                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '4px' }}>Cost for this order: 50 TM Credits.</div>
                  </div>
                )}

                <button
                  type="submit"
                  style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '14px', borderRadius: '3px', fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer', marginTop: '6px', boxShadow: `0 4px 16px ${effectiveAccent}55` }}
                >
                  Authorize Payment & Place Order
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL 5: TOP-UP CREDITS MODAL ================= */}
      {pricingModalOpen && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setPricingModalOpen(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${effectiveAccent}55`, borderRadius: '3px', width: '100%', maxWidth: '460px', padding: '28px', color: '#fff', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.9)' }}>
            <button onClick={() => setPricingModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

            <span style={{ background: effectiveAccent, color: '#000', fontWeight: 900, fontSize: '0.68rem', padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
              Instant Top-Up
            </span>
            <h3 style={{ margin: '8px 0 6px', fontSize: '1.35rem', fontWeight: 900, color: '#fff' }}>
              Add TM Credits to Balance
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '0 0 20px' }}>
              Select a credit package. Credits are stored on your Intermaven account and valid network-wide.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { credits: 50, price: 25, label: 'Starter Pack (+0%)' },
                { credits: 150, price: 65, label: 'Producer Pack (+15% Bonus)' },
                { credits: 500, price: 199, label: 'Label VIP Pack (+25% Bonus)' }
              ].map(p => (
                <button
                  key={p.credits}
                  onClick={() => handleTopUpCredits(p.credits, p.price)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: `1px solid ${effectiveAccent}44`, padding: '14px 18px', borderRadius: '3px', color: '#fff', cursor: 'pointer' }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.1rem', color: effectiveAccent }}>{p.credits} Credits</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{p.label}</div>
                  </div>
                  <div style={{ background: effectiveAccent, color: '#000', padding: '6px 14px', borderRadius: '3px', fontWeight: 900, fontSize: '0.88rem' }}>
                    ${p.price}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= FLOATING TOAST NOTIFICATION SYSTEM ================= */}
      {toasts.length > 0 && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '420px' }}>
          {toasts.map(t => (
            <div
              key={t.id}
              style={{
                background: t.type === 'error' ? '#1c0e14' : '#071d2c',
                border: `1.5px solid ${t.type === 'error' ? '#f43f5e' : (effectiveAccent || '#00f0ff')}`,
                borderLeft: `5px solid ${t.type === 'error' ? '#f43f5e' : (effectiveAccent || '#00f0ff')}`,
                padding: '12px 18px',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 700,
                boxShadow: t.type === 'error'
                  ? '0 12px 36px rgba(0,0,0,0.85), 0 0 16px rgba(244, 63, 94, 0.35)'
                  : '0 12px 36px rgba(0,0,0,0.85), 0 0 16px rgba(0, 240, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                animation: 'slideInRight 0.25s ease'
              }}
            >
              <span style={{
                background: t.type === 'error' ? '#f43f5e' : (effectiveAccent || '#00f0ff'),
                color: '#000',
                padding: '2px 7px',
                borderRadius: '3px',
                fontSize: '0.7rem',
                fontWeight: 900,
                letterSpacing: '0.04em'
              }}>
                {t.type === 'error' ? 'ALERT' : 'NOTE'}
              </span>
              <div style={{ flex: 1, color: '#ffffff' }}>{t.message}</div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

class EpkViewErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('CreatorEpkView error caught:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#070a13',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px',
          textAlign: 'center',
          fontFamily: 'Sansation, sans-serif'
        }}>
          <div style={{ background: '#0c101d', border: '1px solid rgba(255,255,255,0.1)', padding: '36px', borderRadius: '8px', maxWidth: '560px', boxShadow: '0 20px 50px rgba(0,0,0,0.7)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎵</div>
            <h2 style={{ color: '#00f0ff', margin: '0 0 10px' }}>Creator Web World Notice</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '18px' }}>
              We encountered a display issue while rendering your live Creator Web World.
            </p>

            {this.state.error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 4, padding: '12px', color: '#fca5a5', fontSize: '0.8rem', textAlign: 'left', fontFamily: 'monospace', marginBottom: '20px', wordBreak: 'break-word', maxHeight: '140px', overflowY: 'auto' }}>
                <strong>Error:</strong> {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.reload()
                }}
                style={{ background: '#00f0ff', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 800, cursor: 'pointer' }}
              >
                Reload Live View
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem('last_saved_epk_data')
                    localStorage.removeItem('epk_wizard_draft')
                  } catch (_) {}
                  this.setState({ hasError: false, error: null })
                  window.location.reload()
                }}
                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 16px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}
              >
                Reset Cache & Reload
              </button>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem('preferred_dashboard_tab', 'epk-builder')
                  window.location.hash = '#/dashboard'
                }}
                style={{ background: 'transparent', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 16px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}
              >
                Return to EPK Builder
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function CreatorEpkViewWrapper(props) {
  return (
    <EpkViewErrorBoundary>
      <CreatorEpkView {...props} />
    </EpkViewErrorBoundary>
  )
}
