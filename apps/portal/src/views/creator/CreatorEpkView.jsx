import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import JSZip from 'jszip'
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
  RiMapPin2Fill, RiTimeFill, RiQrCodeFill, RiCoinsFill, RiExchangeDollarLine,
  RiEyeLine, RiEyeOffLine, RiShuffleLine, RiRepeatLine, RiRepeatOneLine,
  RiDragMove2Fill, RiVolumeUpFill, RiVolumeMuteFill, RiUploadFill
} from 'react-icons/ri'

import heroSlide1 from '../../assets/creator_hero_banner.jpg'
import heroSlide2 from '../../assets/creator_hero_slide2.jpg'
import heroSlide3 from '../../assets/creator_hero_slide3.jpg'
import { persistAppActivation } from '../../lib/activatedApps.js'

// 20 Pre-populated Theme Templates Specification
const DEFAULT_PAGE_HEADERS = {
  discography: 'https://picsum.photos/seed/discography_banner/1920/640',
  bio: 'https://picsum.photos/seed/bio_banner/1920/640',
  shows: 'https://picsum.photos/seed/shows_banner/1920/640',
  store: 'https://picsum.photos/seed/store_banner/1920/640',
  media: 'https://picsum.photos/seed/media_banner/1920/640',
  press: 'https://picsum.photos/seed/press_banner/1920/640',
  contact: 'https://picsum.photos/seed/contact_banner/1920/640',
  pricing: 'https://picsum.photos/seed/pricing_banner/1920/640',
  'event-detail': 'https://picsum.photos/seed/shows_banner/1920/640',
  'album-detail': 'https://picsum.photos/seed/discography_banner/1920/640'
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

  // Fetch Public EPK Profile with Local Storage Fallback & Live Cache-Busting
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

      // 1. Fetch freshest public EPK with cache-busting
      const res = await fetch(`/api/epk/public/${artistSlug}?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      })

      let freshData = null
      if (res.ok) {
        const data = await res.json()
        if (data && typeof data === 'object') {
          freshData = data
        }
      }

      // 2. Also check Mother-CMS endpoint for any active live layouts
      try {
        const cmsRes = await fetch(`/api/cms/epk/${artistSlug}?_t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
        })
        if (cmsRes.ok) {
          const cmsLayout = await cmsRes.json()
          const cmsData = cmsLayout?.data || cmsLayout
          if (cmsData && typeof cmsData === 'object') {
            freshData = {
              ...(freshData || {}),
              ...cmsData,
              // Ensure hero & header properties are prioritized from whichever source has them
              heroSlides: cmsData.heroSlides || freshData?.heroSlides,
              heroImages: cmsData.heroImages || freshData?.heroImages,
              heroImageUrl: cmsData.heroImageUrl || freshData?.heroImageUrl,
              pageHeaders: {
                ...(freshData?.pageHeaders || {}),
                ...(cmsData.pageHeaders || {})
              }
            }
          }
        }
      } catch (_) {}

      if (freshData) {
        setEpkData(prev => {
          const merged = { ...(prev || {}), ...freshData }
          if (!merged.heroImageUrl && prev?.heroImageUrl) merged.heroImageUrl = prev.heroImageUrl
          if ((!merged.heroImages || !merged.heroImages.length) && prev?.heroImages?.length) merged.heroImages = prev.heroImages
          if ((!merged.heroSlides || !merged.heroSlides.length) && prev?.heroSlides?.length) merged.heroSlides = prev.heroSlides
          if (prev?.pageHeaders) {
            merged.pageHeaders = { ...(prev.pageHeaders || {}), ...(merged.pageHeaders || {}) }
          }
          return merged
        })
        try {
          localStorage.setItem(`epk_public_${artistSlug}`, JSON.stringify(freshData))
          localStorage.setItem(`epk_${artistSlug}`, JSON.stringify(freshData))
        } catch (_) {}

        if (freshData.themeBg) {
          const matchedTheme = EPK_THEMES.find(t => t.bg === freshData.themeBg)
          if (matchedTheme) setSelectedTheme(matchedTheme)
        }
      }
    } catch (err) {
      console.warn('Could not load public EPK profile:', err)
    }
  }

  useEffect(() => {
    fetchPublicEpk()
  }, [artistSlug, passedEpk, username])

  // Live real-time syncing for AI-generated Hero and Header updates
  useEffect(() => {
    const handleLiveSync = (e) => {
      if (e?.detail && typeof e.detail === 'object') {
        const d = e.detail
        const dSub = (d.subdomain || '').toLowerCase().replace(/[^a-z0-9]/g, '')
        if (!dSub || dSub === artistSlug) {
          setEpkData(prev => ({ ...(prev || {}), ...d }))
        }
      } else {
        fetchPublicEpk()
      }
    }
    window.addEventListener('epk_updated', handleLiveSync)
    window.addEventListener('epk_storage_sync', handleLiveSync)
    window.addEventListener('storage', handleLiveSync)
    return () => {
      window.removeEventListener('epk_updated', handleLiveSync)
      window.removeEventListener('epk_storage_sync', handleLiveSync)
      window.removeEventListener('storage', handleLiveSync)
    }
  }, [artistSlug])

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
  // Resolve distinct page header image with full alias support
  const getPageHeader = (pageKey) => {
    const headers = epkData?.pageHeaders || epkData?.page_headers
    if (headers?.[pageKey]) return headers[pageKey]
    if (epkData?.headerImageUrl) return epkData.headerImageUrl
    if (epkData?.headerImage) return epkData.headerImage
    if (epkData?.header_image_url) return epkData.header_image_url
    if (Array.isArray(epkData?.headerImages) && epkData.headerImages.length > 0) return epkData.headerImages[0]
    return DEFAULT_PAGE_HEADERS[pageKey] || currentSlide?.img || heroSlide1
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
    persistAppActivation('epk-builder')
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

  // Platformwide Scroll-to-Top: Any tab switch always begins cleanly at top of page
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [activeTab])

  // Dynamic Hero Slides Carousel with 3-line Music Business titles & AI asset sync
  const heroSlides = React.useMemo(() => {
    const baseTitle1 = epkData?.heroTitle1 || effectiveArtistName
    const baseTitle2 = epkData?.heroTitle2 || effectiveHeadline
    const baseTitle3 = epkData?.heroTitle3 || "High-Quality Digital MP3 Singles • Collector Vinyl & CDs • Direct Fan Ticketing"

    // 1. Prioritize structured heroSlides (persisted by Mother-CMS / AI Slide Studio)
    if (Array.isArray(epkData?.heroSlides) && epkData.heroSlides.length > 0) {
      const validSlides = epkData.heroSlides.filter(s => s && (s.img || s.url || s.image))
      if (validSlides.length > 0) {
        return validSlides.map((s, idx) => ({
          id: s.id || idx + 1,
          img: s.img || s.url || s.image,
          title1: s.title1 || (idx === 0 ? baseTitle1 : (idx === 1 ? 'World Tour 2026 Live Showcase' : `${effectiveArtistName} — Lossless Audio`)),
          title2: s.title2 || (idx === 0 ? baseTitle2 : (idx === 1 ? 'Headline Dates: Tokyo, London & Nairobi' : 'Lossless Audio & Digital MP3 Singles')),
          title3: s.title3 || (idx === 0 ? baseTitle3 : (idx === 1 ? 'VIP Fan Pass & Direct Ticketing via TuneBooking' : 'Exclusive VIP Vault Access')),
          title: s.title1 || baseTitle1,
          subtitle: s.title2 || baseTitle2
        }))
      }
    }

    // 2. Prioritize primaryHero if updated by AI (heroImageUrl / heroImage / hero_image_url)
    const primaryHero = epkData?.heroImageUrl || epkData?.heroImage || epkData?.hero_image_url || epkData?.hero_image
    const rawImages = Array.isArray(epkData?.heroImages) ? epkData.heroImages : (Array.isArray(epkData?.hero_images) ? epkData.hero_images : [])
    let validHeroImages = rawImages.filter(Boolean)

    if (primaryHero && (!validHeroImages.length || validHeroImages[0] !== primaryHero)) {
      validHeroImages = [primaryHero, ...validHeroImages.filter(u => u !== primaryHero)]
    }

    if (validHeroImages.length > 0) {
      return validHeroImages.map((imgUrl, idx) => ({
        id: idx + 1,
        img: imgUrl,
        title1: idx === 0 ? baseTitle1 : (idx === 1 ? 'World Tour 2026 Live Showcase' : `${effectiveArtistName} — Lossless Audio`),
        title2: idx === 0 ? baseTitle2 : (idx === 1 ? 'Headline Dates: Tokyo, London & Nairobi' : 'Lossless Audio & Digital MP3 Singles'),
        title3: idx === 0 ? baseTitle3 : (idx === 1 ? 'VIP Fan Pass & Direct Ticketing via TuneBooking' : 'Exclusive VIP Vault Access'),
        title: baseTitle1,
        subtitle: baseTitle2
      }))
    }
    if (primaryHero) {
      return [
        { id: 1, img: primaryHero, title1: baseTitle1, title2: baseTitle2, title3: baseTitle3, title: baseTitle1, subtitle: baseTitle2 }
      ]
    }
    return [
      { id: 1, img: heroSlide1, title1: baseTitle1, title2: baseTitle2, title3: baseTitle3, title: baseTitle1, subtitle: baseTitle2 },
      { id: 2, img: heroSlide2, title1: 'World Tour 2026 Live Showcase', title2: 'Live at Nairobi Cyberdome, London O2 & Brooklyn Steel', title3: 'Direct Fan Ticketing via TuneBooking • Reserved Seating', title: 'World Tour 2026', subtitle: 'Live at Nairobi Cyberdome, London O2 Academy & Brooklyn Steel' },
      { id: 3, img: heroSlide3, title1: 'Exclusive Digital MP3s', title2: 'Unreleased High-Quality MP3 Singles Available for Credits', title3: 'High-Quality Digital MP3 Singles • Collector Vinyl & CDs • Direct Fan Passes', title: 'Exclusive Digital MP3s', subtitle: 'Unreleased High-Quality MP3 Singles Available for Intermaven Credits' }
    ]
  }, [epkData?.heroSlides, epkData?.heroImages, epkData?.hero_images, epkData?.heroImageUrl, epkData?.heroImage, epkData?.hero_image_url, epkData?.heroTitle1, epkData?.heroTitle2, epkData?.heroTitle3, effectiveArtistName, effectiveHeadline, artistSlug])

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
    img: heroSlide1,
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
    'Unreleased Digital MP3 Singles',
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

  // Hero & Floating Music Player State
  const [playlistIndex, setPlaylistIndex] = useState(0)
  const [playbackProgress, setPlaybackProgress] = useState(45) // seconds
  const [selectedTrackModal, setSelectedTrackModal] = useState(null)

  // Persistent Floating Hi-Fi Audio Player Overlay State
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('all') // 'all' | 'vault' | 'top' | playlistId
  const [shuffleMode, setShuffleMode] = useState(false)
  const [repeatMode, setRepeatMode] = useState('playlist') // 'off' | 'track' | 'playlist'
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false)
  const [isPlayerMuted, setIsPlayerMuted] = useState(false)
  const [playerVolume, setPlayerVolume] = useState(0.85)
  const [isPlayerVisible, setIsPlayerVisible] = useState(true)
  const [playerPos, setPlayerPos] = useState(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200
    const h = typeof window !== 'undefined' ? window.innerHeight : 800
    return { x: Math.max(20, w - 460), y: Math.max(80, h - 280) }
  })
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 })

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

  // Fan Profile Settings State
  const [fanProfileName, setFanProfileName] = useState(fanUser?.name || 'VIP Member')
  const [fanProfileEmail, setFanProfileEmail] = useState(fanUser?.email || 'fan@intermaven.io')
  const [fanProfilePassword, setFanProfilePassword] = useState('••••••••')
  const [fanCurrentPassword, setFanCurrentPassword] = useState('')
  const [fanNewPassword, setFanNewPassword] = useState('')
  const [fanConfirmPassword, setFanConfirmPassword] = useState('')
  const [fanProfileAvatar, setFanProfileAvatar] = useState(fanUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Fan Avatar File Upload Handler
  const handleFanAvatarUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target.result
      setFanProfileAvatar(dataUrl)
      showToast('📸 Fan profile image uploaded! Remember to click Save Profile.', 'info')
    }
    reader.readAsDataURL(file)
  }

  // Dynamic Credit Pack Calculation Helper ($1 = 10 Credits baseline, bonuses for higher tiers)
  const calcCreditsForAmount = (dollars) => {
    const d = Number(dollars) || 0
    if (d >= 100) return Math.round(d * 13) // +30% Bonus ($100 = 1,300 Cr)
    if (d >= 20) return Math.round(d * 12)  // +20% Bonus ($20 = 240 Cr)
    if (d >= 10) return Math.round(d * 11)  // +10% Bonus ($10 = 110 Cr)
    return Math.round(d * 10)               // Baseline ($5 = 50 Cr)
  }

  // Fan Top-Up Form State (Starts at $5, $10, $20, $100 + Custom multiples of $5)
  const [fanTopUpCredits, setFanTopUpCredits] = useState(50)
  const [fanTopUpPrice, setFanTopUpPrice] = useState(5)
  const [fanCustomAmount, setFanCustomAmount] = useState('')
  const [fanTopUpGateway, setFanTopUpGateway] = useState('card')
  const [fanTopUpProcessing, setFanTopUpProcessing] = useState(false)

  // Ticketing Tier Info Tooltip & Delivery Preference State
  const [hoveredTierInfo, setHoveredTierInfo] = useState(null)
  const [ticketDeliveryChannel, setTicketDeliveryChannel] = useState(fanUser?.preferredCommMethod || 'email')
  const [ticketPhone, setTicketPhone] = useState(fanUser?.phone || '+1 555 019 2834')

  // Pagination States (2 rows x 3 cols = 6 items per page)
  const [featuredSinglesPage, setFeaturedSinglesPage] = useState(1)
  const [mediaPage, setMediaPage] = useState(1)

  // Photo Gallery Lightbox Carousel State
  const [galleryModalOpen, setGalleryModalOpen] = useState(false)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)

  const defaultTracks = [
    { id: 1, title: 'Nairobi Cyberwave (Master)', isrc: 'KE-TM1-26-00042', streams: '3.4M', duration: '3:45', release: 'Single 2026', priceCredits: 50, coverArt: 'https://picsum.photos/seed/cyberwave_master/600/600' },
    { id: 2, title: 'Sunset over Rift Valley', isrc: 'KE-TM1-26-00043', streams: '1.8M', duration: '4:12', release: 'Album 2026', priceCredits: 50, coverArt: 'https://picsum.photos/seed/riftvalley_master/600/600' },
    { id: 3, title: 'Afro-Synth Cascade', isrc: 'KE-TM1-26-00044', streams: '940K', duration: '3:18', release: 'Single 2025', priceCredits: 40, coverArt: 'https://picsum.photos/seed/afrosynth_master/600/600' },
    { id: 4, title: 'Midnight Mara Starlight', isrc: 'KE-TM1-26-00045', streams: '2.1M', duration: '5:02', release: 'EP 2025', priceCredits: 60, coverArt: 'https://picsum.photos/seed/marastarlight_master/600/600' },
    { id: 5, title: 'Solar Flare Groove (Original)', isrc: 'KE-TM1-26-00046', streams: '1.4M', duration: '3:58', release: 'Single 2026', priceCredits: 50, coverArt: 'https://picsum.photos/seed/solarflare_master/600/600' },
    { id: 6, title: 'Neon Equator (Live Dub)', isrc: 'KE-TM1-26-00047', streams: '820K', duration: '4:30', release: 'Live 2026', priceCredits: 45, coverArt: 'https://picsum.photos/seed/neonequator_master/600/600' },
    { id: 7, title: 'Kilimanjaro Heights', isrc: 'KE-TM1-26-00048', streams: '2.7M', duration: '4:15', release: 'Single 2026', priceCredits: 55, coverArt: 'https://picsum.photos/seed/kilimanjaromaster/600/600' },
    { id: 8, title: 'Savannah Sunset (Radio Cut)', isrc: 'KE-TM1-26-00049', streams: '1.1M', duration: '3:22', release: 'Single 2025', priceCredits: 40, coverArt: 'https://picsum.photos/seed/savannahsunset/600/600' },
    { id: 9, title: 'Serengeti Sunrise (Ambient Mix)', isrc: 'KE-TM1-26-00050', streams: '650K', duration: '5:10', release: 'VIP 2026', priceCredits: 45, coverArt: 'https://picsum.photos/seed/serengetisunrise/600/600' }
  ]
  const rawTracks = (epkData?.tracks && Array.isArray(epkData.tracks) && epkData.tracks.length > 0) ? epkData.tracks : defaultTracks
  const tracks = rawTracks.map((t, idx) => ({
    ...t,
    id: t.id || idx + 1,
    coverArt: t.coverArt || t.cover || `https://picsum.photos/seed/${encodeURIComponent(t.title || 'single')}/600/600`
  }))

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

  // Compute active playlist tracks
  const currentPlaylistTracks = React.useMemo(() => {
    if (selectedPlaylistId === 'vault') {
      return [
        { id: 901, title: 'Nairobi Cyberwave (VIP MP3 Single)', isrc: 'KE-TM1-26-901', streams: 'VIP Vault', duration: '3:45', release: 'VIP 2026', priceCredits: 40, coverArt: 'https://picsum.photos/seed/cyberwave_master/600/600' },
        { id: 902, title: 'Sunset over Rift Valley (Acoustic VIP)', isrc: 'KE-TM1-26-902', streams: 'VIP Vault', duration: '4:12', release: 'VIP 2026', priceCredits: 40, coverArt: 'https://picsum.photos/seed/riftvalley_master/600/600' },
        { id: 903, title: 'Afro-Synth Cascade (Unreleased Club Dub)', isrc: 'KE-TM1-26-903', streams: 'VIP Vault', duration: '3:18', release: 'VIP 2026', priceCredits: 45, coverArt: 'https://picsum.photos/seed/afrosynth_master/600/600' }
      ]
    }
    if (selectedPlaylistId === 'top') {
      return [...tracks].slice(0, 5)
    }
    const fp = (fanPlaylists || []).find(p => String(p.id) === String(selectedPlaylistId))
    if (fp) {
      const pTracks = tracks.filter(t => (fp.trackIds || []).includes(t.id))
      return pTracks.length > 0 ? pTracks : tracks
    }
    return tracks
  }, [selectedPlaylistId, tracks, fanPlaylists])

  // Active track resolved from current playlist selection
  const currentTrack = currentPlaylistTracks[playlistIndex] || currentPlaylistTracks[0] || tracks[0] || activeTrack

  // Keep activeTrack in sync with currentTrack
  useEffect(() => {
    if (currentTrack) {
      setActiveTrack(currentTrack)
    }
  }, [playlistIndex, selectedPlaylistId])

  // Track Advancement Helper (Sequenced vs Shuffle vs Repeat Loop)
  const handleTrackAdvance = () => {
    if (repeatMode === 'track') {
      setPlaybackProgress(0)
      return
    }
    if (shuffleMode && currentPlaylistTracks.length > 1) {
      let nextIdx = Math.floor(Math.random() * currentPlaylistTracks.length)
      if (nextIdx === playlistIndex) nextIdx = (nextIdx + 1) % currentPlaylistTracks.length
      setPlaylistIndex(nextIdx)
      setPlaybackProgress(0)
      return
    }
    if (playlistIndex < currentPlaylistTracks.length - 1) {
      setPlaylistIndex(curr => curr + 1)
      setPlaybackProgress(0)
    } else if (repeatMode === 'playlist') {
      setPlaylistIndex(0)
      setPlaybackProgress(0)
    } else {
      setIsPlaying(false)
      setPlaybackProgress(0)
    }
  }

  const handleTrackPrevious = () => {
    if (playbackProgress > 4) {
      setPlaybackProgress(0)
      return
    }
    if (shuffleMode && currentPlaylistTracks.length > 1) {
      const nextIdx = Math.floor(Math.random() * currentPlaylistTracks.length)
      setPlaylistIndex(nextIdx)
      setPlaybackProgress(0)
      return
    }
    setPlaylistIndex(curr => (curr === 0 ? currentPlaylistTracks.length - 1 : curr - 1))
    setPlaybackProgress(0)
  }

  // Playback timer & playlist auto-cycle with loop & shuffle modes
  useEffect(() => {
    let interval = null
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackProgress(prev => {
          if (prev >= 225) {
            handleTrackAdvance()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, playlistIndex, repeatMode, shuffleMode, currentPlaylistTracks.length])

  // Floating Player Dragging Handlers
  const handleMouseDownDrag = (e) => {
    if (e.target.closest('button') || e.target.closest('select') || e.target.closest('input')) return
    isDraggingRef.current = true
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: playerPos.x,
      posY: playerPos.y
    }
    const onMove = (ev) => {
      if (!isDraggingRef.current) return
      const dx = ev.clientX - dragStartRef.current.mouseX
      const dy = ev.clientY - dragStartRef.current.mouseY
      const maxX = Math.max(10, (window.innerWidth || 1200) - 340)
      const maxY = Math.max(10, (window.innerHeight || 800) - 100)
      const newX = Math.max(10, Math.min(maxX, dragStartRef.current.posX + dx))
      const newY = Math.max(10, Math.min(maxY, dragStartRef.current.posY + dy))
      setPlayerPos({ x: newX, y: newY })
    }
    const onUp = () => {
      isDraggingRef.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

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

  // Full Discography Collection (Dynamically merged from epkData.albums, tracks releases, and default albums)
  const defaultMockAlbums = [
    { id: 401, title: 'Nairobi Cyberwave (Deluxe LP)', year: '2026', type: 'Album', tracksCount: 12, cover: 'https://picsum.photos/seed/album1_epk/400', streams: '3.4M', isrc: 'KE-TM1-26-00042', priceCredits: 50 },
    { id: 402, title: 'Rift Valley Soundscapes', year: '2026', type: 'Album', tracksCount: 10, cover: 'https://picsum.photos/seed/album2_epk/400', streams: '1.8M', isrc: 'KE-TM1-26-00043', priceCredits: 50 },
    { id: 403, title: 'Afro-Synth Cascade', year: '2025', type: 'Single', tracksCount: 2, cover: 'https://picsum.photos/seed/album3_epk/400', streams: '940K', isrc: 'KE-TM1-26-00044', priceCredits: 40 },
    { id: 404, title: 'Midnight Mara Starlight', year: '2025', type: 'EP', tracksCount: 5, cover: 'https://picsum.photos/seed/album4_epk/400', streams: '2.1M', isrc: 'KE-TM1-26-00045', priceCredits: 45 },
    { id: 405, title: 'Mombasa Neon Nights', year: '2024', type: 'Album', tracksCount: 14, cover: 'https://picsum.photos/seed/album5_epk/400', streams: '4.2M', isrc: 'KE-TM1-24-00010', priceCredits: 50 },
    { id: 406, title: 'Savannah Electric Remixes (MP3)', year: '2024', type: 'Remix EP', tracksCount: 6, cover: 'https://picsum.photos/seed/album6_epk/400', streams: '1.1M', isrc: 'KE-TM1-24-00011', priceCredits: 40 }
  ];

  const albums = React.useMemo(() => {
    const list = [];
    const seenTitles = new Set();

    // 1. Ingested & Synced albums from backend epkData.albums (e.g. 'Carbon Dating Pt 1')
    if (Array.isArray(epkData?.albums)) {
      epkData.albums.forEach(alb => {
        const titleKey = (alb.title || '').toLowerCase().trim();
        if (titleKey && !seenTitles.has(titleKey)) {
          seenTitles.add(titleKey);
          list.push({
            id: alb.id || `alb-${list.length + 1}`,
            title: alb.title,
            year: String(alb.year || '2026'),
            type: alb.type || 'Album',
            tracksCount: alb.tracksCount || (alb.isrcs ? alb.isrcs.length : 1),
            cover: alb.cover || alb.coverArt || `https://picsum.photos/seed/${encodeURIComponent(alb.title)}/400`,
            streams: alb.streams || 'Master Audio',
            isrc: alb.isrc || 'KE-TM1-26-00042',
            isrcs: alb.isrcs || [],
            priceCredits: alb.priceCredits || 50
          });
        }
      });
    }

    // 2. Discover from tracks (grouping by release)
    if (Array.isArray(tracks)) {
      const releaseGroups = {};
      tracks.forEach(t => {
        const rel = (t.release || '').trim();
        if (rel && !['singles', 'single', 'unknown'].includes(rel.toLowerCase())) {
          const key = rel.toLowerCase();
          if (!releaseGroups[key]) releaseGroups[key] = [];
          releaseGroups[key].push(t);
        }
      });

      Object.entries(releaseGroups).forEach(([key, trks]) => {
        if (!seenTitles.has(key)) {
          seenTitles.add(key);
          const firstTrack = trks[0];
          list.push({
            id: `rel-${list.length + 1}`,
            title: firstTrack.release,
            year: String(firstTrack.year || '2026'),
            type: firstTrack.releaseType || (trks.length >= 8 ? 'Album' : (trks.length >= 3 ? 'EP' : 'Single')),
            tracksCount: trks.length,
            cover: firstTrack.coverArt || firstTrack.cover || `https://picsum.photos/seed/${encodeURIComponent(firstTrack.release)}/400`,
            streams: firstTrack.streams || 'Master Audio',
            isrc: firstTrack.isrc || 'KE-TM1-26-00042',
            isrcs: trks.map(t => t.isrc),
            priceCredits: 50
          });
        }
      });
    }

    // 3. Fallback default albums to keep discography full
    defaultMockAlbums.forEach(defAlb => {
      const key = defAlb.title.toLowerCase().trim();
      if (!seenTitles.has(key)) {
        seenTitles.add(key);
        list.push(defAlb);
      }
    });

    return list;
  }, [epkData?.albums, tracks]);



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
      desc: 'Mastered directly from 24-bit/96kHz analog tapes. Includes high-gloss lyric sleeve and digital MP3 download voucher.'
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
      title: 'High-Quality Digital MP3 Singles & Audio Pack', 
      price: '$19.99', 
      numPrice: 19.99, 
      img: 'https://picsum.photos/seed/stems_epk/600/600',
      images: [
        'https://picsum.photos/seed/stems_daw/800/800',
        'https://picsum.photos/seed/stems_tracks/800/800',
        'https://picsum.photos/seed/stems_meter/800/800'
      ], 
      category: 'mp3s', 
      hasSizes: false,
      licenseTiers: [
        { id: 'personal', name: 'High-Quality 320kbps MP3 Single', addPrice: 0 },
        { id: 'remix', name: 'Extended Lossless MP3 & Studio Mixes', addPrice: 10 },
        { id: 'broadcast', name: 'Deluxe Digital MP3 Collector Bundle', addPrice: 25 }
      ],
      stock: 'Instant Digital Download',
      desc: 'Complete high-resolution MP3 singles and extended master cuts (Drums, Bass, Synths, Vocals in pristine 320kbps digital audio).'
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


  // Helper to extract YouTube video ID and build clean embed URL
  const toEmbedUrl = (rawUrl) => {
    if (!rawUrl) return ''
    const str = String(rawUrl).trim()
    if (str.includes('/embed/')) return str
    const ytMatch = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`
    }
    const vimeoMatch = str.match(/(?:vimeo\.com\/)(\d+)/)
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }
    return str
  }

  const getYouTubeThumbnail = (rawUrl) => {
    if (!rawUrl) return null
    const ytMatch = String(rawUrl).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
    if (ytMatch && ytMatch[1]) {
      return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`
    }
    return null
  }

  const CANONICAL_EPK_VIDEOS = [
    { id: 300, type: 'video', title: 'Machero', url: 'https://www.youtube.com/watch?v=2y3NvAVU2xE', youtubeUrl: 'https://www.youtube.com/embed/2y3NvAVU2xE', thumbnail: 'https://img.youtube.com/vi/2y3NvAVU2xE/hqdefault.jpg', views: '850K views', category: 'Official Video' },
    { id: 301, type: 'video', title: `${artistName} — Nairobi Cyberwave (Official 4K Music Video)`, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/yt_vid1/600/340', views: '1.2M views', category: 'Official Video' },
    { id: 303, type: 'video', title: 'Live at SyncMavens Vault (Full Concert 4K)', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/yt_vid2/600/340', views: '840K views', category: 'Live Concert' },
    { id: 305, type: 'video', title: 'Inside the Synthesizer Soundscapes', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/yt_vid3/600/340', views: '320K views', category: 'Behind the Scenes' },
    { id: 307, type: 'video', title: `${artistName} — Rift Valley Sunset (Acoustic Session 4K)`, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/yt_vid4/600/340', views: '620K views', category: 'Studio Session' },
    { id: 309, type: 'video', title: `${artistName} — Afro-Synth Cascade (Live at O2)`, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/seed/yt_vid5/600/340', views: '490K views', category: 'Live Concert' }
  ]

  // Dynamic Media Items synchronized with Backend CMS Studio & MongoDB
  const mediaItems = React.useMemo(() => {
    const list = Array.isArray(epkData?.videos) ? epkData.videos : []
    let rawVideos = list
    if (rawVideos.length === 0) {
      rawVideos = CANONICAL_EPK_VIDEOS
    } else {
      const existingTitles = new Set(rawVideos.map(v => (v.title || '').toLowerCase().trim()))
      const existingIds = new Set(rawVideos.map(v => v.id))
      const missing = CANONICAL_EPK_VIDEOS.filter(cfv => {
        const titleLower = cfv.title.toLowerCase()
        const hasTitle = Array.from(existingTitles).some(et => 
          (et.includes('machero') && titleLower.includes('machero')) ||
          (et.includes('cyberwave') && titleLower.includes('cyberwave')) ||
          (et.includes('syncmavens vault') && titleLower.includes('syncmavens vault')) ||
          (et.includes('synthesizer soundscapes') && titleLower.includes('synthesizer soundscapes')) ||
          (et.includes('rift valley sunset') && titleLower.includes('rift valley sunset')) ||
          (et.includes('afro-synth') && titleLower.includes('afro-synth'))
        )
        return !existingIds.has(cfv.id) && !hasTitle
      })
      rawVideos = [...rawVideos, ...missing]
    }

    const processedVideos = rawVideos.map((v, idx) => {
      const directUrl = v.url || v.youtubeUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      const embed = toEmbedUrl(directUrl) || v.youtubeUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      const autoThumb = getYouTubeThumbnail(directUrl) || v.thumbnail || `https://picsum.photos/seed/yt_vid${idx + 1}/600/340`
      return {
        id: v.id || (300 + idx),
        type: 'video',
        title: v.title || `${artistName} — Video #${idx + 1}`,
        url: directUrl,
        youtubeUrl: embed,
        thumbnail: autoThumb,
        views: v.views || `${(Math.max(1, (idx + 1) * 230))}K views`,
        category: v.category || 'Official Video'
      }
    })

    const galleryItems = [
      { id: 401, type: 'gallery', title: 'Live at Nairobi Cyberdome Stage Highlight', thumbnail: 'https://picsum.photos/seed/gal1/600/340', views: 'Photo Gallery' },
      { id: 402, type: 'gallery', title: 'Behind the Scenes: Recording MP3 Singles at Intermaven Studio', thumbnail: 'https://picsum.photos/seed/gal2/600/340', views: 'Photo Gallery' },
      { id: 403, type: 'gallery', title: 'London O2 Backstage Session', thumbnail: 'https://picsum.photos/seed/gal3/600/340', views: 'Photo Gallery' },
      { id: 404, type: 'gallery', title: 'Modular Synthesizer Rig & Live Sound Plot', thumbnail: 'https://picsum.photos/seed/gal4/600/340', views: 'Photo Gallery' },
      { id: 405, type: 'gallery', title: 'World Tour Soundcheck & VIP Meet and Greet', thumbnail: 'https://picsum.photos/seed/gal5/600/340', views: 'Photo Gallery' }
    ]

    const combined = []
    const maxLen = Math.max(processedVideos.length, galleryItems.length)
    for (let i = 0; i < maxLen; i++) {
      if (i < processedVideos.length) combined.push(processedVideos[i])
      if (i < galleryItems.length) combined.push(galleryItems[i])
    }
    return combined
  }, [epkData?.videos, artistName])

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
      { id: 304, title: 'Behind the Scenes: Recording Masters at Intermaven Studio', caption: 'Late night master tracking session capturing analog synthesizers and vocal harmonies.', url: 'https://picsum.photos/seed/gal2/1200/800', thumbnail: 'https://picsum.photos/seed/gal2/600/340' },
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
      interests: ['VIP Tour Pre-Sales & Discounts', 'Unreleased Digital MP3 Singles'],
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

  // Handle saving Fan Profile in Fan Portal Settings (with 3-field password confirmation & channel notification)
  const handleSaveFanProfile = (e) => {
    if (e) e.preventDefault()

    let passwordUpdated = false
    let finalPassword = fanProfilePassword

    // If new password attempted, validate all 3 fields
    if (fanNewPassword || fanConfirmPassword || fanCurrentPassword) {
      if (!fanCurrentPassword) {
        showToast('⚠️ Please enter your current password to authorize security changes.', 'error')
        return
      }
      if (fanCurrentPassword !== fanProfilePassword && fanProfilePassword !== '••••••••') {
        showToast('⚠️ Current password confirmation does not match existing password.', 'error')
        return
      }
      if (fanNewPassword.length < 6) {
        showToast('⚠️ New password must be at least 6 characters.', 'error')
        return
      }
      if (fanNewPassword !== fanConfirmPassword) {
        showToast('⚠️ New password and confirmation do not match.', 'error')
        return
      }
      finalPassword = fanNewPassword
      setFanProfilePassword(fanNewPassword)
      passwordUpdated = true
    }

    const updated = {
      ...(fanUser || {}),
      name: fanProfileName.trim() || fanUser?.name || 'VIP Member',
      email: fanProfileEmail.trim().toLowerCase() || fanUser?.email || 'fan@intermaven.io',
      avatar: fanProfileAvatar,
      password: finalPassword,
      preferredCommMethod: ticketDeliveryChannel || fanUser?.preferredCommMethod || 'email'
    }
    setFanUser(updated)
    try {
      localStorage.setItem(`fan_session_${artistSlug}`, JSON.stringify(updated))
      sessionStorage.setItem('tunemavens_session', JSON.stringify(updated))
      const crmKey = `creator_crm_fans_${artistSlug}`
      const existingFans = JSON.parse(localStorage.getItem(crmKey) || '[]')
      const updatedFans = [updated, ...existingFans.filter(f => f.email !== updated.email)]
      localStorage.setItem(crmKey, JSON.stringify(updatedFans))
    } catch (_) {}

    if (passwordUpdated) {
      const channelLabel = (ticketDeliveryChannel || 'email').toUpperCase()
      const targetDest = ticketDeliveryChannel === 'email' ? fanProfileEmail : (ticketPhone || fanProfileEmail)
      showToast(`🔒 Password changed! Security confirmation dispatched to ${channelLabel} (${targetDest}).`, 'success')
      setFanCurrentPassword('')
      setFanNewPassword('')
      setFanConfirmPassword('')
    } else {
      showToast('✅ Profile information updated and synchronized across Intermaven!')
    }
  }

  // Handle Executing Direct TM Credits Top-Up in Fan Portal
  const handleExecuteFanTopUp = (e) => {
    if (e) e.preventDefault()
    setFanTopUpProcessing(true)
    setTimeout(() => {
      setUserCredits(prev => prev + fanTopUpCredits)
      setFanTopUpProcessing(false)
      showToast(`🎉 Successfully topped up +${fanTopUpCredits} non-expiring TM Credits ($${fanTopUpPrice}) via ${fanTopUpGateway.toUpperCase()}!`)
      setFanPortalTab('vault')
    }, 600)
  }

  // Real ZIP File Generator & Downloader for Official Press Photos
  const handleDownloadPressPhotosZip = async () => {
    showToast('📦 Packaging High-Res Press Photos (300 DPI) ZIP archive...', 'info')
    try {
      const zip = new JSZip()
      const folder = zip.folder(`${artistSlug}_press_photos_300dpi`)

      folder.file('README_PRESS_METADATA.txt',
`${effectiveArtistName.toUpperCase()} — OFFICIAL HIGH-RES PRESS ASSETS (300 DPI)
Year: 2026
Verified TuneMavens Creator World
Copyright (c) 2026 ${effectiveArtistName} / Intermaven Talent Group

INCLUDED HIGH-RES FILES:
1. 01_${artistSlug}_portrait_hero_300dpi.jpg - High-Resolution Studio Portrait
2. 02_${artistSlug}_live_stage_cyberdome_300dpi.jpg - Live Concert Action Shot
3. 03_${artistSlug}_modular_synth_studio_300dpi.jpg - Studio Synthesizer Session
4. 04_${artistSlug}_monochrome_editorial_300dpi.jpg - Editorial B&W Feature

USAGE CLEARANCE:
Pre-cleared for festival promotion, press reviews, digital media publications, and print editorials.
Direct Management Contact: mgmt@intermaven.io`
      )

      const photos = [
        { name: `01_${artistSlug}_portrait_hero_300dpi.jpg`, url: epkData?.profilePhoto || epkData?.heroImage || heroSlide1 },
        { name: `02_${artistSlug}_live_stage_cyberdome_300dpi.jpg`, url: heroSlide2 },
        { name: `03_${artistSlug}_modular_synth_studio_300dpi.jpg`, url: heroSlide3 },
        { name: `04_${artistSlug}_monochrome_editorial_300dpi.jpg`, url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600' }
      ]

      for (const p of photos) {
        try {
          const res = await fetch(p.url)
          if (res.ok) {
            const blob = await res.blob()
            folder.file(p.name, blob)
          } else {
            folder.file(p.name, `300 DPI Asset Placeholder for ${p.name}`)
          }
        } catch (_) {
          folder.file(p.name, `300 DPI Asset Placeholder for ${p.name}`)
        }
      }

      const content = await zip.generateAsync({ type: 'blob' })
      const downloadUrl = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `${artistSlug}_official_press_photos_300dpi.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)
      showToast(`🎉 Downloaded ${artistSlug}_official_press_photos_300dpi.zip!`, 'success')
    } catch (err) {
      console.error('Error generating zip:', err)
      showToast('⚠️ Could not build ZIP archive. Please try again.', 'error')
    }
  }

  // Real Printable/Downloadable PDF Generator for Technical Rider & Stage Plot
  const handleDownloadTechRiderPdf = () => {
    showToast('📄 Generating Technical Stage Rider & Patch List PDF...', 'info')
    const printWin = window.open('', '_blank', 'width=950,height=1100')
    if (!printWin) {
      showToast('⚠️ Pop-up blocked! Please allow pop-ups to view/print the Stage Plot PDF.', 'error')
      return
    }
    const riderHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${effectiveArtistName} — Technical Rider & Stage Plot (2026)</title>
  <style>
    @page { margin: 0; size: auto; }
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070a14; color: #f8fafc; margin: 0; padding: 14mm; }
    .page { max-width: 820px; margin: 0 auto; background: #0c1020; border: 1px solid ${effectiveAccent}44; border-radius: 6px; padding: 28px; }
    h1 { margin: 0 0 4px; font-size: 26px; color: #fff; }
    .badge { background: ${effectiveAccent}; color: #000; font-weight: 900; font-size: 11px; padding: 3px 8px; border-radius: 3px; }
    .sec-title { font-size: 13px; font-weight: 900; color: ${effectiveAccent}; text-transform: uppercase; margin: 20px 0 10px; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
    th { background: rgba(0,240,255,0.15); color: ${effectiveAccent}; text-align: left; padding: 8px; font-weight: 800; border: 1px solid rgba(255,255,255,0.1); }
    td { padding: 8px; border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; }
    .stage-box { background: rgba(255,255,255,0.02); border: 2px dashed ${effectiveAccent}66; border-radius: 4px; padding: 22px; text-align: center; margin: 14px 0; }
    @media print {
      body { padding: 12mm; background: #070a14 !important; color: #f8fafc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="max-width:820px; margin:0 auto 16px; display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:12px 20px; border-radius:4px;">
    <span style="font-size:13px; color:#fff; font-weight:700;">Technical Stage Rider & Patch List Engine</span>
    <button onclick="window.print()" style="background:${effectiveAccent}; color:#000; border:none; padding:8px 18px; border-radius:3px; font-weight:900; font-size:12px; cursor:pointer;">
      🖨️ Print or Save as PDF
    </button>
  </div>
  <div class="page">
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid ${effectiveAccent}; padding-bottom:14px; margin-bottom:18px;">
      <div>
        <h1>${effectiveArtistName}</h1>
        <div style="color:${effectiveAccent}; font-weight:700; font-size:14px;">Technical Rider & Stage Plot Specification • Tour 2026</div>
      </div>
      <span class="badge">CONFIDENTIAL • PRODUCTION ONLY</span>
    </div>

    <div class="sec-title">Front of House (FOH) & Monitoring Specifications</div>
    <p style="font-size:12.5px; color:#cbd5e1; line-height:1.6; margin:0 0 10px;">
      FOH Console: DiGiCo SD12 / Quantum 225 or Avid S6L with Dante network integration running at 96kHz. Artist travels with dedicated FOH sound engineer.
      Monitors: 4x Stereo IEM wireless channels (Sennheiser 2000 / Shure PSM1000). No stage wedges needed. Dedicated antenna combiner with helical directional antenna required.
    </p>

    <div class="sec-title">Stage Plot Layout</div>
    <div class="stage-box">
      <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; margin-bottom:8px;">[ REAR OF STAGE / BACKDROP ]</div>
      <div style="display:flex; justify-content:space-around; margin:16px 0; font-weight:800; font-size:12px;">
        <div style="padding:10px 16px; background:rgba(0,240,255,0.15); border:1px solid ${effectiveAccent}; border-radius:3px;">STAGE LEFT<br>Modular Synthesizer Rack & Moog</div>
        <div style="padding:10px 16px; background:rgba(0,240,255,0.25); border:2px solid ${effectiveAccent}; border-radius:3px; color:#fff;">CENTER STAGE<br>${effectiveArtistName} Master DJ / Ableton Console</div>
        <div style="padding:10px 16px; background:rgba(0,240,255,0.15); border:1px solid ${effectiveAccent}; border-radius:3px;">STAGE RIGHT<br>Roland SPD-SX & Electronic Percussion</div>
      </div>
      <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; margin-top:8px;">[ FRONT OF STAGE / AUDIENCE BARRIER ]</div>
    </div>

    <div class="sec-title">Input Channel Patch List</div>
    <table>
      <thead>
        <tr><th>CH</th><th>SOURCE</th><th>MIC / DI TYPE</th><th>STAND</th><th>PHANTOM</th></tr>
      </thead>
      <tbody>
        <tr><td>1-2</td><td>Master Stereo Mix L/R</td><td>Radial J48 Stereo DI</td><td>—</td><td>+48V</td></tr>
        <tr><td>3-4</td><td>Modular Synth Submix L/R</td><td>Radial ProD2</td><td>—</td><td>Passive</td></tr>
        <tr><td>5</td><td>Moog Subsequent 37 Bass</td><td>Radial JDI Active</td><td>—</td><td>+48V</td></tr>
        <tr><td>6-7</td><td>Roland SPD-SX Percussion</td><td>BSS AR-133 DI x2</td><td>—</td><td>+48V</td></tr>
        <tr><td>8</td><td>Lead Talkback Vocal</td><td>Shure Beta 58A (Switched)</td><td>Boom</td><td>Off</td></tr>
        <tr><td>9-10</td><td>Audience Ambient Mics L/R</td><td>Sennheiser e914 x2</td><td>Tall Boom</td><td>+48V</td></tr>
      </tbody>
    </table>

    <div class="sec-title">Production & Hospitality Contact</div>
    <div style="font-size:12px; color:#cbd5e1; line-height:1.6;">
      Tour Manager: <strong>Marcus Sterling</strong> • Phone: +44 7911 204918 • Email: production@intermaven.io<br>
      FOH Audio Lead: <strong>Elena Richter</strong> • Email: audio@intermaven.io
    </div>
  </div>
  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 400); };
  <\/script>
</body>
</html>`
    printWin.document.open()
    printWin.document.write(riderHtml)
    printWin.document.close()
    showToast('✅ Technical Rider PDF generated! Print or Save as PDF in the opened dialog.')
  }

  // Official EPK PDF Generator (with Social Media Icons, Clean Page Breaks, and Suppressed Browser Headers/Footers)
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

    // Inline SVG Icons for Social Media
    const igIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="${effectiveAccent}" style="vertical-align:middle; margin-right:6px;"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`
    const ytIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="${effectiveAccent}" style="vertical-align:middle; margin-right:6px;"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
    const spIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="${effectiveAccent}" style="vertical-align:middle; margin-right:6px;"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.495 17.307c-.215.352-.674.464-1.026.248-2.812-1.718-6.353-2.107-10.523-1.155-.403.092-.806-.16-.898-.563-.092-.403.16-.806.563-.898 4.567-1.043 8.49-.602 11.637 1.342.352.216.464.674.247 1.026zm1.467-3.262c-.27.44-.848.577-1.288.307-3.218-1.978-8.125-2.55-11.93-1.394-.496.15-1.024-.135-1.174-.631-.15-.497.135-1.025.631-1.175 4.354-1.321 9.774-.68 13.454 1.583.44.27.577.848.307 1.288zm.126-3.41c-3.859-2.292-10.228-2.503-13.916-1.383-.593.18-1.224-.162-1.404-.755-.18-.593.162-1.224.755-1.404 4.241-1.288 11.272-1.042 15.706 1.591.534.317.708 1.011.391 1.545-.317.534-1.011.708-1.532.406z"/></svg>`
    const twIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="${effectiveAccent}" style="vertical-align:middle; margin-right:6px;"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`

    const pdfHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${effectiveArtistName} — Official Press Kit (EPK)</title>
  <style>
    @page { size: auto; margin: 0; }
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #070a14; color: #f8fafc; margin: 0; padding: 14mm; }
    .page { max-width: 820px; margin: 0 auto; background: #0c1020; border: 1px solid ${effectiveAccent}44; border-radius: 6px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.7); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${effectiveAccent}; padding-bottom: 16px; margin-bottom: 22px; }
    .logo-box { max-width: 200px; max-height: 55px; display: flex; align-items: center; }
    .logo-box img { max-width: 100%; max-height: 50px; object-fit: contain; }
    .badge { background: ${effectiveAccent}; color: #000; font-weight: 900; font-size: 11px; padding: 4px 10px; border-radius: 3px; text-transform: uppercase; letter-spacing: 1px; }
    .hero-flex { display: flex; gap: 24px; margin-bottom: 24px; align-items: center; }
    .profile-photo { width: 210px; height: 260px; object-fit: cover; border-radius: 4px; border: 2px solid ${effectiveAccent}; box-shadow: 0 8px 25px rgba(0,0,0,0.6); flex-shrink: 0; }
    .meta-content { flex: 1; }
    h1 { margin: 0 0 4px; font-size: 30px; font-weight: 900; color: #fff; letter-spacing: -0.5px; }
    .headline { font-size: 14.5px; color: ${effectiveAccent}; font-weight: 700; margin-bottom: 12px; }
    .quote-box { background: rgba(34,211,238,0.06); border-left: 3px solid ${effectiveAccent}; padding: 10px 14px; margin: 12px 0; font-style: italic; color: #e2e8f0; font-size: 12px; border-radius: 0 3px 3px 0; }
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 12px; }
    .stat-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); padding: 8px; border-radius: 3px; text-align: center; }
    .stat-num { font-size: 19px; font-weight: 900; color: ${effectiveAccent}; }
    .stat-label { font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-top: 2px; }
    .sec-title { font-size: 13px; font-weight: 900; color: ${effectiveAccent}; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 5px; margin: 18px 0 10px; }
    .bio-p { font-size: 12px; line-height: 1.65; color: #cbd5e1; margin: 0 0 10px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px; color: #cbd5e1; }
    .grid-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 10px 12px; border-radius: 3px; }
    .grid-box strong { color: #fff; display: flex; align-items: center; margin-bottom: 3px; font-size: 12.5px; }

    /* Page Break to ensure Management and Sync Clearance start cleanly on Page 2 */
    .page-break {
      page-break-before: always;
      break-before: page;
      margin-top: 24px;
    }

    @media print {
      body { background: #070a14 !important; color: #f8fafc !important; padding: 12mm !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { box-shadow: none !important; }
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

  <!-- PAGE 1: HERO, SOCIALS WITH ICONS, BIOGRAPHY -->
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

    <div class="sec-title">Official Social Media & Streaming Handles</div>
    <div class="grid-2">
      <div class="grid-box">
        <strong>${igIcon} Instagram</strong>
        ${epkData?.instagram || ('@' + artistSlug)} • Official Verified Profile
      </div>
      <div class="grid-box">
        <strong>${ytIcon} YouTube</strong>
        ${epkData?.youtube || ('youtube.com/@' + artistSlug)} • Official Channel & 4K Visuals
      </div>
      <div class="grid-box">
        <strong>${spIcon} Spotify</strong>
        ${epkData?.spotify || ('spotify.com/artist/' + artistSlug)} • Verified Artist Discography
      </div>
      <div class="grid-box">
        <strong>${twIcon} X / Twitter</strong>
        ${epkData?.twitter || ('@' + artistSlug)} • Tour Announcements & Updates
      </div>
    </div>

    <div class="sec-title">Biography & Artistic Narrative</div>
    <div class="bio-p">
      ${effectiveBio.replace(/<[^>]+>/g, ' ')}
    </div>
  </div>

  <!-- PAGE 2: CLEAN PAGE BREAK -> MANAGEMENT, SYNC CLEARANCE, STAGE SPECS -->
  <div class="page page-break">
    <div class="header">
      <div class="logo-box">
        ${logoImg ? `<img src="${logoImg}" alt="Official Logo" />` : `<h2 style="margin:0; color:${effectiveAccent}; font-size:22px;">${effectiveArtistName}</h2>`}
      </div>
      <div style="text-align:right;">
        <span class="badge">EPK Page 2 • Representation</span>
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
        Email: sync@tunemaven.com (100% One-Stop Pre-Cleared)
      </div>
      <div class="grid-box">
        <strong>Live Creator World Portal</strong>
        ${currentUrl}
      </div>
    </div>

    <div class="sec-title">Technical Rider & Stage Plot Specifications</div>
    <div class="grid-2">
      <div class="grid-box">
        <strong>Front of House (FOH) Audio</strong>
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

    <div class="sec-title">Verified Rights & Publishing Heritage</div>
    <div class="bio-p">
      All master sound recordings and musical compositions administered through the Intermaven Publishing Network. Cue sheets are automatically generated and pre-cleared for broadcast, film, streaming, and gaming synchronization without third-party encumbrances.
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
    const discountedTotal = cartTotal * (1 - appliedPromoDiscount)
    const requiredCredits = Math.round(discountedTotal * 10)

    let topUpCharged = 0
    if (userCredits >= requiredCredits) {
      setUserCredits(prev => prev - requiredCredits)
    } else {
      const shortfall = requiredCredits - userCredits
      topUpCharged = Math.max(5, Math.ceil(shortfall / 10 / 5) * 5)
      const topUpCredits = calcCreditsForAmount(topUpCharged)
      setUserCredits(prev => prev + topUpCredits - requiredCredits)
    }

    const orderId = `TM-ORD-${Math.floor(100000 + Math.random() * 900000)}`
    const trackingCode = `TRK-IM-${Math.floor(10000000 + Math.random() * 90000000)}`

    setMerchOrderConfirmed({
      orderId,
      trackingCode,
      gateway: userCredits >= requiredCredits ? 'credits' : merchPaymentGateway,
      totalPaid: discountedTotal.toFixed(2),
      totalCredits: requiredCredits,
      topUpCharged,
      items: [...cart]
    })
    setCart([])
    if (topUpCharged > 0) {
      showToast(`🎉 Top-Up of $${topUpCharged} authorized & ${requiredCredits} TM Credits deducted! Order ${orderId} confirmed.`, 'success')
    } else {
      showToast(`🎉 Order ${orderId} confirmed! Deducted ${requiredCredits} TM Credits.`, 'success')
    }
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
  const albumAudioRef = useRef(null)
  const epkAudioRef = useRef(null)
  const [albumAudioPlaying, setAlbumAudioPlaying] = useState(false)
  const [albumAudioCurrentTrack, setAlbumAudioCurrentTrack] = useState(null)
  const [albumAudioProgress, setAlbumAudioProgress] = useState(0) // seconds
  const [albumAudioUnlocked, setAlbumAudioUnlocked] = useState(false) // whether full stream is paid with credits

  // Sync albumAudioRef playback with albumAudioPlaying
  useEffect(() => {
    const audio = albumAudioRef.current
    if (!audio) return
    if (albumAudioPlaying) {
      audio.play().catch(e => console.warn('Album audio play error:', e))
    } else {
      audio.pause()
    }
  }, [albumAudioPlaying])

  // Sync epkAudioRef with isPlaying
  useEffect(() => {
    const audio = epkAudioRef.current
    if (!audio) return
    if (isPlaying) {
      if (currentTrack && (!audio.src || audio.src === '')) {
        audio.src = currentTrack.audioUrl || currentTrack.fileUrl || `http://localhost:8001/api/stream/track/${encodeURIComponent(currentTrack.isrc || currentTrack.title || 'preview')}`
        audio.load()
      }
      audio.play().catch(e => console.warn('EPK audio play error:', e))
    } else {
      audio.pause()
    }
  }, [isPlaying])

  // Sync epkAudioRef source when currentTrack changes
  useEffect(() => {
    const audio = epkAudioRef.current
    if (!audio || !currentTrack) return
    const src = currentTrack.audioUrl || currentTrack.fileUrl || `http://localhost:8001/api/stream/track/${encodeURIComponent(currentTrack.isrc || currentTrack.title || 'preview')}`
    if (audio.src !== src) {
      audio.src = src
      audio.load()
      if (isPlaying) {
        audio.play().catch(e => console.warn('EPK track play error:', e))
      }
    }
  }, [currentTrack])

  // (fanPlaylists and fanPurchasedLibrary declared above)
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
    const audio = albumAudioRef.current
    if (audio) {
      const src = trk.audioUrl || trk.fileUrl || `http://localhost:8001/api/stream/track/${encodeURIComponent(trk.isrc || trk.title || 'preview')}`
      if (audio.src !== src) {
        audio.src = src
        audio.load()
      }
      audio.currentTime = 0
      audio.play().catch(e => console.warn('Album track play error:', e))
    }
    showToast(`▶ Streaming: ${trk.title} (30-Sec Free Preview)`)
  }

  // Toggle Album Master Audio Play / Pause
  const handleToggleAlbumAudio = (albTracks = []) => {
    const audio = albumAudioRef.current
    if (!audio) return
    if (albumAudioPlaying) {
      audio.pause()
      setAlbumAudioPlaying(false)
    } else {
      const trk = albumAudioCurrentTrack || albTracks[0]
      if (trk) {
        if (!albumAudioCurrentTrack) setAlbumAudioCurrentTrack(trk)
        const src = trk.audioUrl || trk.fileUrl || `http://localhost:8001/api/stream/track/${encodeURIComponent(trk.isrc || trk.title || 'preview')}`
        if (audio.src !== src) {
          audio.src = src
          audio.load()
        }
      }
      audio.play().catch(e => console.warn('Album audio play error:', e))
      setAlbumAudioPlaying(true)
    }
  }

  // Unlock Full Lossless Master Stream for 1 TM Credit
  const handleUnlockFullStream = () => {
    if (userCredits >= 1) {
      setUserCredits(prev => prev - 1)
      setAlbumAudioUnlocked(true)
      setAlbumAudioPlaying(true)
      const audio = albumAudioRef.current
      if (audio) {
        audio.play().catch(e => console.warn('Resume full stream error:', e))
      }
      showToast('⚡ Full 24-Bit Lossless Master stream unlocked! (1 TM Credit consumed)')
    } else {
      setQuickTopUpModalOpen(true)
      showToast('⚠️ Insufficient credits to unlock stream. Please top up your balance.')
    }
  }

  // Full Event Ticket Purchasing Protocol Handler (Strict Credits Deduction & Top-Up Protocol)
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

    let topUpCharged = 0
    if (userCredits >= totalCredits) {
      setUserCredits(prev => prev - totalCredits)
    } else {
      const shortfall = totalCredits - userCredits
      topUpCharged = Math.max(5, Math.ceil(shortfall / 10 / 5) * 5)
      const topUpCredits = calcCreditsForAmount(topUpCharged)
      setUserCredits(prev => prev + topUpCredits - totalCredits)
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
        gateway: userCredits >= totalCredits ? 'credits' : eventPaymentGateway,
        topUpCharged,
        totalCash,
        totalCredits,
        buyerName: eventCardName || (fanUser ? fanUser.name : 'VIP Maven Fan'),
        buyerEmail: ticketEmail || (fanUser ? fanUser.email : 'fan@intermaven.io'),
        datePurchased: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      })
      if (topUpCharged > 0) {
        showToast(`🎉 Top-Up of $${topUpCharged} completed & ${totalCredits} TM Credits deducted! Pass reserved for ${ev.venue}.`, 'success')
      } else {
        showToast(`🎟️ Pass reserved for ${ev.venue}! Deducted ${totalCredits} TM Credits.`, 'success')
      }
    }, 500)
  }

  // Full Stems Purchase & Download Generation Handler (Strict Credits Deduction & Top-Up Protocol)
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

    let topUpCharged = 0
    if (userCredits >= priceCredits) {
      setUserCredits(prev => prev - priceCredits)
    } else {
      const shortfall = priceCredits - userCredits
      topUpCharged = Math.max(5, Math.ceil(shortfall / 10 / 5) * 5)
      const topUpCredits = calcCreditsForAmount(topUpCharged)
      setUserCredits(prev => prev + topUpCredits - priceCredits)
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
        paymentMethod: userCredits >= priceCredits ? 'credits' : stemsPaymentMethod,
        topUpCharged,
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
      if (topUpCharged > 0) {
        showToast(`🎉 Top-Up of $${topUpCharged} completed & ${priceCredits} TM Credits deducted! Stems Unlocked: ${t.title}.`, 'success')
      } else {
        showToast(`Stems Unlocked: ${t.title}! Deducted ${priceCredits} TM Credits.`, 'success')
      }
    }, 500)
  }


  // Intermaven Ticketing Handler (Strict Credits Deduction & Top-Up Protocol)
  const handleTicketBuy = (e) => {
    e.preventDefault()
    let pricePerTicket = selectedShow?.priceGA || 25
    let tierCredits = 25
    if (ticketTier === 'vip') {
      pricePerTicket = selectedShow?.priceVIP || 50
      tierCredits = 50
    }
    if (ticketTier === 'meet') {
      pricePerTicket = selectedShow?.priceMeet || 100
      tierCredits = 100
    }

    const grossAmount = (pricePerTicket * ticketQty)
    const requiredCredits = tierCredits * ticketQty
    const creatorShare = (grossAmount * 0.90).toFixed(2)
    const platformShare = (grossAmount * 0.10).toFixed(2)

    let topUpCharged = 0
    if (userCredits >= requiredCredits) {
      setUserCredits(prev => prev - requiredCredits)
    } else {
      const shortfall = requiredCredits - userCredits
      topUpCharged = Math.max(5, Math.ceil(shortfall / 10 / 5) * 5)
      const topUpCredits = calcCreditsForAmount(topUpCharged)
      setUserCredits(prev => prev + topUpCredits - requiredCredits)
    }

    setTicketSuccess({
      qr: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
      show: selectedShow,
      tierName: ticketTier === 'ga' ? 'General Admission' : ticketTier === 'vip' ? 'VIP Pass' : 'Meet & Greet Upgrade',
      qty: ticketQty,
      gateway: userCredits >= requiredCredits ? 'credits' : paymentGateway,
      topUpCharged,
      total: grossAmount.toFixed(2),
      totalCredits: requiredCredits,
      creatorShare,
      platformShare,
      fanEmail: ticketEmail || (fanUser ? fanUser.email : 'fan@intermaven.io')
    })

    if (topUpCharged > 0) {
      showToast(`🎉 Top-Up of $${topUpCharged} completed & ${requiredCredits} TM Credits deducted for ${selectedShow?.venue || 'Show'}!`, 'success')
    } else {
      showToast(`🎟️ Reserved with ${requiredCredits} TM Credits for ${selectedShow?.venue || 'Show'}!`, 'success')
    }
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
  const mediaPerPage = 6
  const totalMediaPages = Math.ceil(filteredMedia.length / mediaPerPage) || 1
  const paginatedMedia = filteredMedia.slice((mediaPage - 1) * mediaPerPage, mediaPage * mediaPerPage)

  const singlesPerPage = 6
  const totalSinglesPages = Math.ceil(tracks.length / singlesPerPage) || 1
  const paginatedFeaturedSingles = tracks.slice((featuredSinglesPage - 1) * singlesPerPage, featuredSinglesPage * singlesPerPage)

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
      {/* TuneStream Audio Engines */}
      <audio
        ref={epkAudioRef}
        id="epk-live-audio"
        onTimeUpdate={() => {
          if (epkAudioRef.current) {
            setPlaybackProgress(Math.floor(epkAudioRef.current.currentTime))
          }
        }}
        onEnded={handleTrackAdvance}
        style={{ display: 'none' }}
      />
      <audio
        ref={albumAudioRef}
        id="album-preview-audio"
        onTimeUpdate={() => {
          if (albumAudioRef.current) {
            const curr = Math.floor(albumAudioRef.current.currentTime)
            setAlbumAudioProgress(curr)
            if (!albumAudioUnlocked && curr >= 30) {
              albumAudioRef.current.pause()
              setAlbumAudioPlaying(false)
              showToast('30-Second Preview ended. Unlock full lossless master stream for 1 TM Credit!')
            }
          }
        }}
        onEnded={() => {
          setAlbumAudioPlaying(false)
          setAlbumAudioProgress(0)
        }}
        style={{ display: 'none' }}
      />

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
          min-height: auto;
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
                const isMedia = item.label?.toLowerCase() === 'media' || targetTab === 'media'

                if (isMedia) {
                  return (
                    <div key={item.id || 'media-nav'} style={{ position: 'relative' }} ref={dropdownRef} onMouseDown={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setMediaDropdownOpen(!mediaDropdownOpen)}
                        style={{
                          background: (activeTab === 'media' || activeTab === 'discography' || activeTab === 'pricing') ? effectiveAccent : 'transparent',
                          color: (activeTab === 'media' || activeTab === 'discography' || activeTab === 'pricing') ? '#000' : (isLight ? '#0f172a' : '#ffffff'),
                          border: 'none',
                          padding: '7px 14px',
                          borderRadius: '3px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.88rem'
                        }}
                      >
                        <RiVideoFill /> Media <RiArrowDownSLine />
                      </button>
                      {mediaDropdownOpen && (
                        <div
                          onMouseDown={(e) => e.stopPropagation()}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            marginTop: '6px',
                            background: isLight ? '#fff' : '#0a0d18',
                            border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '3px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            minWidth: '190px',
                            zIndex: 1100,
                            overflow: 'hidden'
                          }}
                        >
                          <button
                            type="button"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => {
                              setActiveTab('media');
                              setMediaFilter('all');
                              setMediaPage(1);
                              setMediaDropdownOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 14px', color: isLight ? '#0f172a' : '#fff', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
                          >
                            <RiVideoFill /> All Media
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => {
                              setActiveTab('discography');
                              setMediaDropdownOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 14px', color: isLight ? '#0f172a' : '#fff', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
                          >
                            <RiDiscFill /> Discography & Albums
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => {
                              setActiveTab('media');
                              setMediaFilter('gallery');
                              setMediaPage(1);
                              setMediaDropdownOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 14px', color: isLight ? '#0f172a' : '#fff', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
                          >
                            <RiImageFill /> Photo Gallery
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => {
                              setActiveTab('media');
                              setMediaFilter('videos');
                              setMediaPage(1);
                              setMediaDropdownOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 14px', color: isLight ? '#0f172a' : '#fff', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
                          >
                            <RiVideoFill /> 4K Videos
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => {
                              setActiveTab('pricing');
                              setMediaDropdownOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '10px 14px', color: effectiveAccent, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}
                          >
                            <RiCoinsFill /> Fan Top Up Pricing
                          </button>
                        </div>
                      )}
                    </div>
                  )
                }

                const isSelected = activeTab === targetTab || (targetTab === 'home' && activeTab === 'home')
                return (
                  <button 
                    key={item.id || item.label} 
                    onClick={() => {
                      setActiveTab(targetTab)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }} 
                    style={{ background: isSelected ? effectiveAccent : 'transparent', color: isSelected ? '#000' : (isLight ? '#0f172a' : '#ffffff'), border: 'none', padding: '7px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}
                  >
                    {item.label}
                  </button>
                )
              })
            ) : (
              <>
                <button onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: activeTab === 'home' ? effectiveAccent : 'transparent', color: activeTab === 'home' ? '#000' : (isLight ? '#0f172a' : '#ffffff'), border: 'none', padding: '7px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                  <RiHomeFill /> Home
                </button>
                <button onClick={() => { setActiveTab('bio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: activeTab === 'bio' ? effectiveAccent : 'transparent', color: activeTab === 'bio' ? '#000' : (isLight ? '#0f172a' : '#ffffff'), border: 'none', padding: '7px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                  <RiUserFill /> Bio
                </button>
                <button onClick={() => { setActiveTab('shows'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: activeTab === 'shows' ? effectiveAccent : 'transparent', color: activeTab === 'shows' ? '#000' : (isLight ? '#0f172a' : '#ffffff'), border: 'none', padding: '7px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                  <RiCalendarEventFill /> Shows
                </button>
                <div style={{ position: 'relative' }} ref={dropdownRef} onMouseDown={(e) => e.stopPropagation()}>
                  <button type="button" onClick={() => setMediaDropdownOpen(!mediaDropdownOpen)} style={{ background: (activeTab === 'media' || activeTab === 'discography' || activeTab === 'pricing') ? effectiveAccent : 'transparent', color: (activeTab === 'media' || activeTab === 'discography' || activeTab === 'pricing') ? '#000' : (isLight ? '#0f172a' : '#ffffff'), border: 'none', padding: '7px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                    <RiVideoFill /> Media <RiArrowDownSLine />
                  </button>
                  {mediaDropdownOpen && (
                    <div onMouseDown={(e) => e.stopPropagation()} style={{ position: 'absolute', top: '100%', left: 0, marginTop: '6px', background: isLight ? '#fff' : '#0a0d18', border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', minWidth: '190px', zIndex: 1100, overflow: 'hidden' }}>
                      <button type="button" onMouseDown={(e) => e.stopPropagation()} onClick={() => { setActiveTab('media'); setMediaFilter('all'); setMediaPage(1); setMediaDropdownOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 14px', color: isLight ? '#0f172a' : '#fff', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                        <RiVideoFill /> All Media
                      </button>
                      <button type="button" onMouseDown={(e) => e.stopPropagation()} onClick={() => { setActiveTab('discography'); setMediaDropdownOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 14px', color: isLight ? '#0f172a' : '#fff', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                        <RiDiscFill /> Discography & Albums
                      </button>
                      <button type="button" onMouseDown={(e) => e.stopPropagation()} onClick={() => { setActiveTab('media'); setMediaFilter('gallery'); setMediaPage(1); setMediaDropdownOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 14px', color: isLight ? '#0f172a' : '#fff', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                        <RiImageFill /> Photo Gallery
                      </button>
                      <button type="button" onMouseDown={(e) => e.stopPropagation()} onClick={() => { setActiveTab('media'); setMediaFilter('videos'); setMediaPage(1); setMediaDropdownOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 14px', color: isLight ? '#0f172a' : '#fff', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                        <RiVideoFill /> 4K Videos
                      </button>
                      <button type="button" onMouseDown={(e) => e.stopPropagation()} onClick={() => { setActiveTab('pricing'); setMediaDropdownOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '10px 14px', color: effectiveAccent, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                        <RiCoinsFill /> Fan Top Up Pricing
                      </button>
                    </div>
                  )}
                </div>
                <button onClick={() => { setActiveTab('store'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: activeTab === 'store' ? effectiveAccent : 'transparent', color: activeTab === 'store' ? '#000' : (isLight ? '#0f172a' : '#ffffff'), border: 'none', padding: '7px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                  <RiShoppingBagFill /> Store
                </button>
                <button onClick={() => { setActiveTab('press'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: activeTab === 'press' ? effectiveAccent : 'transparent', color: activeTab === 'press' ? '#000' : (isLight ? '#0f172a' : '#ffffff'), border: 'none', padding: '7px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                  <RiFileTextFill /> Press Kit
                </button>
                <button onClick={() => { setActiveTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: activeTab === 'contact' ? effectiveAccent : 'transparent', color: activeTab === 'contact' ? '#000' : (isLight ? '#0f172a' : '#ffffff'), border: 'none', padding: '7px 14px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
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
            const isMedia = item.label?.toLowerCase() === 'media' || targetTab === 'media'
            const isSelected = activeTab === targetTab

            if (isMedia) {
              return (
                <div key={item.id || 'mobile-media'} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    onClick={() => {
                      setActiveTab('media')
                      setMediaFilter('all')
                      setMediaPage(1)
                      setMobileMenuOpen(false)
                    }}
                    style={{
                      background: (activeTab === 'media' || activeTab === 'discography' || activeTab === 'pricing') ? effectiveAccent : 'transparent',
                      color: (activeTab === 'media' || activeTab === 'discography' || activeTab === 'pricing') ? '#000' : (isLight ? '#0f172a' : '#fff'),
                      border: `1px solid ${isSelected ? effectiveAccent : 'rgba(255,255,255,0.1)'}`,
                      padding: '12px 18px',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    Media
                  </button>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', paddingLeft: '12px' }}>
                    <button onClick={() => { setActiveTab('discography'); setMobileMenuOpen(false); }} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '8px', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}>
                      🎵 Discography
                    </button>
                    <button onClick={() => { setActiveTab('media'); setMediaFilter('gallery'); setMediaPage(1); setMobileMenuOpen(false); }} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '8px', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}>
                      📷 Photo Gallery
                    </button>
                    <button onClick={() => { setActiveTab('media'); setMediaFilter('videos'); setMediaPage(1); setMobileMenuOpen(false); }} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '8px', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}>
                      ▶ 4K Videos
                    </button>
                    <button onClick={() => { setActiveTab('pricing'); setMobileMenuOpen(false); }} style={{ background: 'rgba(0,240,255,0.12)', border: `1px solid ${effectiveAccent}66`, color: effectiveAccent, padding: '8px', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left' }}>
                      💎 Top Up Credits
                    </button>
                  </div>
                </div>
              )
            }

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
        <section style={{ position: 'relative', minHeight: '660px', height: 'clamp(620px, 68vh, 800px)', backgroundImage: `url(${currentSlide?.img || heroSlide1})`, backgroundSize: 'cover', backgroundPosition: 'center 28%', backgroundRepeat: 'no-repeat', imageRendering: '-webkit-optimize-contrast', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', textAlign: 'center', padding: '90px 32px 48px', transition: 'background-image 0.8s ease-in-out', margin: 0 }}>
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
            const title3 = currentSlide?.title3 || epkData?.heroTitle3 || "High-Quality Digital MP3 Singles • Collector Vinyl & CDs • Direct Fan Passes"
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
            {/* Hero Music Player - Positioned 40px below HERO Titles */}
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
                  margin: '40px auto 0',
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
        <section style={{ position: 'relative', height: '260px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 32px 0' }}>
          {/* Background image container with 40% increased brightness */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${getPageHeader(activeTab)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(1.4)',
              transform: 'scale(1.02)'
            }}
          />
          {/* Lightened gradient overlay ensuring 40% more luminance while keeping text legible */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,6,14,0.72) 0%, rgba(4,6,14,0.30) 100%)' }} />
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
                  <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.08)', textAlign: 'right' }}>
                    <button 
                      type="button"
                      onClick={() => { setActiveTab('shows'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      style={{ background: 'transparent', border: 'none', color: effectiveAccent, fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      View all shows <RiArrowRightLine />
                    </button>
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
                        Official MP3 Digital Singles & Audio Releases (2 Rows × 3 Columns)
                      </div>
                    </div>

                    <button onClick={() => { setActiveTab('discography'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: 'transparent', border: `1px solid ${effectiveAccent}`, color: effectiveAccent, padding: '8px 18px', borderRadius: '3px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <RiDiscFill /> View All Albums <RiArrowRightLine />
                    </button>
                  </div>

                  {creditPurchaseSuccess && (
                    <div style={{ padding: '14px 18px', background: 'rgba(0, 255, 128, 0.15)', border: '1px solid #00ff80', borderRadius: '3px', color: '#00ff80', marginBottom: '18px', fontSize: '0.9rem' }}>
                      <RiCheckFill /> MP3 Digital Single for <strong>{creditPurchaseSuccess.track.title}</strong> purchased! 50 Credits deducted. Remaining Balance: {creditPurchaseSuccess.remainingCredits} Credits.
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px' }}>
                    {paginatedFeaturedSingles.map(t => {
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
                              Buy MP3 Single ({t.priceCredits} Credits)
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls & View All Singles Link */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '12px', padding: '10px 0', borderTop: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        disabled={featuredSinglesPage <= 1}
                        onClick={() => setFeaturedSinglesPage(prev => Math.max(1, prev - 1))}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: featuredSinglesPage <= 1 ? '#64748b' : '#fff', padding: '6px 12px', borderRadius: '3px', fontSize: '0.78rem', fontWeight: 800, cursor: featuredSinglesPage <= 1 ? 'not-allowed' : 'pointer' }}
                      >
                        ← Prev
                      </button>
                      <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 700 }}>
                        Page <strong style={{ color: effectiveAccent }}>{featuredSinglesPage}</strong> of {totalSinglesPages}
                      </span>
                      <button
                        type="button"
                        disabled={featuredSinglesPage >= totalSinglesPages}
                        onClick={() => setFeaturedSinglesPage(prev => Math.min(totalSinglesPages, prev + 1))}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: featuredSinglesPage >= totalSinglesPages ? '#64748b' : '#fff', padding: '6px 12px', borderRadius: '3px', fontSize: '0.78rem', fontWeight: 800, cursor: featuredSinglesPage >= totalSinglesPages ? 'not-allowed' : 'pointer' }}
                      >
                        Next →
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setActiveTab('discography'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      style={{ background: 'transparent', border: 'none', color: effectiveAccent, fontWeight: 800, fontSize: '0.86rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      View all singles <RiArrowRightLine />
                    </button>
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

                  {/* View All Videos Link at Bottom Right */}
                  <div style={{ marginTop: '14px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('media'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      style={{ background: 'transparent', border: 'none', color: effectiveAccent, fontWeight: 800, fontSize: '0.84rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      View all videos <RiArrowRightLine />
                    </button>
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
                      Official MP3 Digital Singles & Audio Releases (2 Rows × 3 Columns) • Balance: <strong style={{ color: effectiveAccent }}>{userCredits} TM Credits</strong>
                    </div>
                  </div>

                  <button onClick={() => { setActiveTab('discography'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: 'transparent', border: `1px solid ${effectiveAccent}`, color: effectiveAccent, padding: '8px 18px', borderRadius: '3px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RiDiscFill /> View Full Discography <RiArrowRightLine />
                  </button>
                </div>

                {creditPurchaseSuccess && (
                  <div style={{ padding: '14px 18px', background: 'rgba(0, 255, 128, 0.15)', border: '1px solid #00ff80', borderRadius: '3px', color: '#00ff80', marginBottom: '18px', fontSize: '0.9rem' }}>
                    <RiCheckFill /> MP3 Digital Single for <strong>{creditPurchaseSuccess.track.title}</strong> purchased! 50 Credits deducted. Remaining Balance: {creditPurchaseSuccess.remainingCredits} Credits.
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  {paginatedFeaturedSingles.map(t => {
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
                            Buy MP3 Single ({t.priceCredits} Credits)
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls & View All Singles Link */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '12px', padding: '12px 0', borderTop: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      disabled={featuredSinglesPage <= 1}
                      onClick={() => setFeaturedSinglesPage(prev => Math.max(1, prev - 1))}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: featuredSinglesPage <= 1 ? '#64748b' : '#fff', padding: '6px 14px', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 800, cursor: featuredSinglesPage <= 1 ? 'not-allowed' : 'pointer' }}
                    >
                      ← Prev
                    </button>
                    <span style={{ fontSize: '0.84rem', color: '#94a3b8', fontWeight: 700 }}>
                      Page <strong style={{ color: effectiveAccent }}>{featuredSinglesPage}</strong> of {totalSinglesPages}
                    </span>
                    <button
                      type="button"
                      disabled={featuredSinglesPage >= totalSinglesPages}
                      onClick={() => setFeaturedSinglesPage(prev => Math.min(totalSinglesPages, prev + 1))}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: featuredSinglesPage >= totalSinglesPages ? '#64748b' : '#fff', padding: '6px 14px', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 800, cursor: featuredSinglesPage >= totalSinglesPages ? 'not-allowed' : 'pointer' }}
                    >
                      Next →
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('discography'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{ background: 'transparent', border: 'none', color: effectiveAccent, fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    View all singles <RiArrowRightLine />
                  </button>
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

                {/* View All Shows Link at Bottom */}
                <div style={{ marginTop: '18px', textAlign: 'right', paddingTop: '10px', borderTop: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.08)' }}>
                  <button 
                    type="button"
                    onClick={() => { setActiveTab('shows'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{ background: 'transparent', border: 'none', color: effectiveAccent, fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    View all shows <RiArrowRightLine />
                  </button>
                </div>
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

                {/* View All Videos Link at Bottom */}
                <div style={{ marginTop: '16px', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('media'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{ background: 'transparent', border: 'none', color: effectiveAccent, fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    View all videos <RiArrowRightLine />
                  </button>
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
                      VIP Fan Vault & Digital MP3 Access
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: isLight ? '#475569' : '#94a3b8', maxWidth: '600px', lineHeight: 1.5 }}>
                      Join {effectiveArtistName}'s inner circle to receive unreleased digital MP3 singles, secret tour presale codes, limited vinyl drops, and direct creator updates.
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
                <div style={{ marginTop: '10px', fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8' }}>Lossless masters & MP3s available</div>
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
                <p style={{ margin: '4px 0 0', color: isLight ? '#64748b' : '#94a3b8' }}>Lossless audio catalog with high-quality MP3 downloads</p>
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
                      Buy MP3 Album ({a.priceCredits} Credits)
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
                  <button key={f} onClick={() => { setMediaFilter(f); setMediaPage(1); }} style={{ padding: '7px 16px', borderRadius: '20px', border: mediaFilter === f ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)', background: mediaFilter === f ? effectiveAccent : 'transparent', color: mediaFilter === f ? '#000' : (isLight ? '#0f172a' : '#fff'), fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', textTransform: 'capitalize' }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Columns x 2 Rows Paginated Media Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
              {paginatedMedia.map(m => (
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

            {/* Media Pagination Controls (3 Columns x 2 Rows = 6 Items) */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '30px', paddingTop: '16px', borderTop: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
              <button
                type="button"
                disabled={mediaPage <= 1}
                onClick={() => setMediaPage(prev => Math.max(1, prev - 1))}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: mediaPage <= 1 ? '#64748b' : '#fff', padding: '7px 16px', borderRadius: '3px', fontSize: '0.82rem', fontWeight: 800, cursor: mediaPage <= 1 ? 'not-allowed' : 'pointer' }}
              >
                ← Prev Media
              </button>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700 }}>
                Page <strong style={{ color: effectiveAccent }}>{mediaPage}</strong> of {totalMediaPages} ({filteredMedia.length} items)
              </span>
              <button
                type="button"
                disabled={mediaPage >= totalMediaPages}
                onClick={() => setMediaPage(prev => Math.min(totalMediaPages, prev + 1))}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: mediaPage >= totalMediaPages ? '#64748b' : '#fff', padding: '7px 16px', borderRadius: '3px', fontSize: '0.82rem', fontWeight: 800, cursor: mediaPage >= totalMediaPages ? 'not-allowed' : 'pointer' }}
              >
                Next Media →
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 6: STORE / MERCH ================= */}
        {activeTab === 'store' && (
          <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '36px', borderRadius: '3px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ color: effectiveAccent, margin: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: effectiveFont }}>
                  Official Merchandise & Digital MP3s Store
                </h2>
                <p style={{ margin: '4px 0 0', color: isLight ? '#64748b' : '#94a3b8' }}>
                  Limited vinyl pressings, apparel, collector boxes & digital MP3 downloads with custom options
                </p>
              </div>

              {/* Comprehensive Category Filter with 3px border radius */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['all', 'vinyl', 'apparel', 'mp3s', 'collectors'].map(cat => (
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
                    {cat === 'mp3s' ? 'Digital MP3s' : cat}
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
                      type="button"
                      onClick={() => {
                        if (item.id === 'epk') {
                          setEpkPreviewModalOpen(true)
                        } else if (item.id === 'rider') {
                          handleDownloadTechRiderPdf()
                        } else if (item.id === 'photos') {
                          handleDownloadPressPhotosZip()
                        } else {
                          showToast('📥 Downloading requested press asset...')
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
                TuneMavens operates exclusively on a direct credit top-up system. Credits never expire and are directly redeemable for official MP3 digital singles, collector vinyl & CD releases, concert tour tickets, VIP meet & greets, and exclusive fan merchandise across the unified Intermaven ecosystem. (Master stems and broadcast sync clearances are reserved exclusively for verified industry professionals via TuneMavens Admin).
              </p>

              {/* Credit Top-Up Package Cards Speaking Directly to Fans */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '36px' }}>
                {[
                  {
                    title: 'Fan Starter Pack',
                    credits: 250,
                    price: '$25',
                    rate: '$0.10 / credit',
                    badge: null,
                    highlight: false,
                    features: [
                      '250 non-expiring TM Credits',
                      'Unlock 5 official MP3 digital singles',
                      'Reserve 1 General Admission concert pass',
                      'VIP Fan Club badge & community comments',
                      'Credits valid across all creators on TuneMavens'
                    ]
                  },
                  {
                    title: 'Superfan VIP Pack',
                    credits: 750,
                    price: '$65',
                    rate: '$0.087 / credit (13% savings)',
                    badge: 'Most Popular',
                    highlight: true,
                    features: [
                      '750 non-expiring TM Credits',
                      'Unlock 15 bonus MP3 single releases & acoustic cuts',
                      '1 VIP concert tour pass + collectible laminate',
                      '10% discount on all tour merchandise & vinyl drops',
                      'Priority fan setlist voting & monthly livestream Q&A'
                    ]
                  },
                  {
                    title: 'Ultimate Fan Collector',
                    credits: 2000,
                    price: '$150',
                    rate: '$0.075 / credit (25% savings)',
                    badge: 'Best Value',
                    highlight: false,
                    features: [
                      '2,000 non-expiring TM Credits',
                      'Complete digital MP3 discography & collector editions',
                      'Collector vinyl LP or exclusive tour hoodie pack',
                      'VIP Meet & Greet reservation pass with photo session',
                      'Exclusive unreleased live concert recordings'
                    ]
                  },
                  {
                    title: 'Fan Club Champion',
                    credits: 5000,
                    price: '$325',
                    rate: '$0.065 / credit (35% savings)',
                    badge: 'Fan Legend Tier',
                    highlight: false,
                    features: [
                      '5,000 non-expiring TM Credits',
                      'Lifetime access to all current & future MP3 releases',
                      'Front-row concert tour ticket reservation holds',
                      'Personalized creator video shoutout & signed tour bundle',
                      'Direct creator livestream green-room access'
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
                    Browse MP3 Singles
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
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Delivery Channel: <strong style={{ color: effectiveAccent }}>{eventTicketSuccess.deliveryMethod?.toUpperCase() || 'EMAIL'} ({eventTicketSuccess.deliveryTarget || eventTicketSuccess.buyerEmail})</strong></div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Passes: <strong style={{ color: '#fff' }}>{eventTicketSuccess.qty} Ticket(s)</strong></div>
                              <div style={{ fontSize: '0.75rem', color: effectiveAccent, marginTop: '4px' }}>Protocol: {eventTicketSuccess.gateway.toUpperCase()} • Paid {eventTicketSuccess.gateway === 'credits' ? `${eventTicketSuccess.totalCredits} Credits` : `$${eventTicketSuccess.totalCash}`}</div>
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

                        {/* Tier Selector with 'i' Tooltip */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                          {[
                            {
                              id: 'ga',
                              label: 'General Admission',
                              price: gaPrice,
                              credits: 25,
                              perks: 'Floor Entry • Sound System Access',
                              info: 'General Admission: Standard floor entry with high-definition venue acoustics, direct mainstage viewing, and bar access.'
                            },
                            {
                              id: 'vip',
                              label: 'VIP Pass',
                              price: vipPrice,
                              credits: 50,
                              perks: 'Priority Entry • VIP Balcony • Laminate',
                              info: 'VIP Pass: Priority expedited lane entry, exclusive mezzanine/balcony viewing lounge, dedicated VIP bar, and collectible tour lanyard.'
                            },
                            {
                              id: 'meet',
                              label: 'VIP Meet & Greet',
                              price: meetPrice,
                              credits: 100,
                              perks: 'Soundcheck Access • Photo with Artist • Merch Pack',
                              info: 'VIP Meet & Greet: Full VIP access plus pre-show soundcheck attendance, private 1-on-1 photo session with artist, and signed commemorative tour poster.'
                            }
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
                                transition: 'all 0.15s ease',
                                position: 'relative'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: eventTier === tier.id ? effectiveAccent : '#94a3b8', textTransform: 'uppercase' }}>
                                  {tier.label}
                                </div>
                                <div
                                  onMouseEnter={() => setHoveredTierInfo(tier.id)}
                                  onMouseLeave={() => setHoveredTierInfo(null)}
                                  onClick={(e) => { e.stopPropagation(); setHoveredTierInfo(prev => prev === tier.id ? null : tier.id); }}
                                  title="Hover or click for tier overview"
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    background: hoveredTierInfo === tier.id ? effectiveAccent : 'rgba(255,255,255,0.12)',
                                    color: hoveredTierInfo === tier.id ? '#000' : '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.68rem',
                                    fontWeight: 900,
                                    cursor: 'help'
                                  }}
                                >
                                  i
                                </div>
                              </div>

                              {/* Hover Information Tooltip Overlay */}
                              {hoveredTierInfo === tier.id && (
                                <div style={{
                                  position: 'absolute',
                                  bottom: 'calc(100% + 8px)',
                                  left: 0,
                                  right: 0,
                                  background: '#090d1a',
                                  border: `1px solid ${effectiveAccent}`,
                                  borderRadius: '3px',
                                  padding: '10px 12px',
                                  boxShadow: '0 8px 24px rgba(0,0,0,0.95)',
                                  zIndex: 60,
                                  fontSize: '0.76rem',
                                  color: '#e2e8f0',
                                  lineHeight: 1.45,
                                  pointerEvents: 'none'
                                }}>
                                  <div style={{ color: effectiveAccent, fontWeight: 800, marginBottom: '3px' }}>{tier.label} Overview</div>
                                  {tier.info}
                                </div>
                              )}

                              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: isLight ? '#0f172a' : '#fff', margin: '4px 0' }}>
                                ${tier.price} <span style={{ fontSize: '0.75rem', color: effectiveAccent }}>({tier.credits} Cr)</span>
                              </div>
                              <div style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#cbd5e1', lineHeight: 1.4 }}>
                                {tier.perks}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Step 2: Quantity and Buyer Delivery Preference */}
                        <div>
                          <div style={{ fontSize: '0.75rem', color: effectiveAccent, fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px' }}>Step 2: Delivery Method & Details</div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <div>
                              <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>Tickets Qty</label>
                              <div style={{ display: 'flex', alignItems: 'center', background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.15)', height: '42px' }}>
                                <button type="button" onClick={() => setEventQty(prev => Math.max(1, prev - 1))} style={{ width: '36px', height: '100%', background: 'transparent', border: 'none', color: isLight ? '#000' : '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>-</button>
                                <div style={{ flex: 1, textAlign: 'center', fontWeight: 900, fontSize: '1.1rem' }}>{eventQty}</div>
                                <button type="button" onClick={() => setEventQty(prev => Math.min(8, prev + 1))} style={{ width: '36px', height: '100%', background: 'transparent', border: 'none', color: isLight ? '#000' : '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>+</button>
                              </div>
                            </div>

                            <div>
                              <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                                Receive Tickets Via (Preselected Preference)
                              </label>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '10px' }}>
                                {[
                                  { id: 'email', label: 'Email', icon: '✉️' },
                                  { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
                                  { id: 'sms', label: 'SMS', icon: '📱' },
                                  { id: 'push', label: 'In-App', icon: '🎟️' }
                                ].map(method => (
                                  <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => setTicketDeliveryChannel(method.id)}
                                    style={{
                                      padding: '8px 4px',
                                      borderRadius: '3px',
                                      border: ticketDeliveryChannel === method.id ? `2px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.12)',
                                      background: ticketDeliveryChannel === method.id ? (isLight ? 'rgba(0,240,255,0.1)' : 'rgba(0,240,255,0.15)') : 'rgba(255,255,255,0.03)',
                                      color: ticketDeliveryChannel === method.id ? (isLight ? '#000' : effectiveAccent) : '#cbd5e1',
                                      fontWeight: 800,
                                      fontSize: '0.74rem',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    <span>{method.icon}</span> {method.label}
                                  </button>
                                ))}
                              </div>

                              {ticketDeliveryChannel === 'email' && (
                                <input
                                  type="email"
                                  required
                                  placeholder="fan@intermaven.io"
                                  value={ticketEmail}
                                  onChange={e => setTicketEmail(e.target.value)}
                                  style={{ width: '100%', height: '42px', boxSizing: 'border-box', padding: '0 12px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: isLight ? '#0f172a' : '#fff', borderRadius: '3px' }}
                                />
                              )}
                              {(ticketDeliveryChannel === 'sms' || ticketDeliveryChannel === 'whatsapp') && (
                                <input
                                  type="tel"
                                  required
                                  placeholder="+1 (555) 019-2834 or +254 712 345 678"
                                  value={ticketPhone}
                                  onChange={e => setTicketPhone(e.target.value)}
                                  style={{ width: '100%', height: '42px', boxSizing: 'border-box', padding: '0 12px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: isLight ? '#0f172a' : '#fff', borderRadius: '3px' }}
                                />
                              )}
                              {ticketDeliveryChannel === 'push' && (
                                <div style={{ padding: '10px 14px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 700 }}>
                                  ✓ Digital QR tickets will be deposited immediately into your Fan Portal account passes vault.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Step 3: Payment & Credits Protocol */}
                        <div>
                          {(() => {
                            const hasCredits = userCredits >= totalCredits
                            const shortfall = totalCredits - userCredits
                            const suggestedDollars = Math.max(5, Math.ceil(shortfall / 10 / 5) * 5)
                            const suggestedCredits = calcCreditsForAmount(suggestedDollars)

                            if (hasCredits) {
                              return (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                  <div style={{ background: 'rgba(0,240,255,0.08)', border: `1px solid ${effectiveAccent}`, padding: '18px 20px', borderRadius: '3px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                                      <span style={{ color: '#cbd5e1' }}>Available TM Credits Balance:</span>
                                      <strong style={{ color: effectiveAccent, fontSize: '1.1rem' }}>{userCredits} TM</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                                      <span style={{ color: '#cbd5e1' }}>Pass Reservation Deduction:</span>
                                      <strong style={{ color: '#f87171', fontSize: '1.1rem' }}>-{totalCredits} TM</strong>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.88rem' }}>
                                      <span style={{ color: '#cbd5e1' }}>Remaining Balance After Booking:</span>
                                      <strong style={{ color: '#22c55e', fontSize: '1.1rem' }}>{userCredits - totalCredits} TM</strong>
                                    </div>
                                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '10px' }}>
                                      ✓ Direct TM Credits Deduction active. No external card or payment processor required.
                                    </div>
                                  </div>
                                </div>
                              )
                            }

                            return (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.4)', padding: '16px', borderRadius: '3px' }}>
                                  <div style={{ color: '#ef4444', fontWeight: 900, fontSize: '0.88rem', marginBottom: '4px' }}>
                                    ⚠️ Credits Shortfall: {shortfall} TM Needed
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                                    Your balance is <strong>{userCredits} TM</strong>, but this reservation requires <strong>{totalCredits} TM</strong>.
                                    Top up at least <strong>${suggestedDollars}.00</strong> (+{suggestedCredits} TM Credits in multiples of $5) to complete this purchase.
                                  </div>
                                </div>

                                <div>
                                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                                    Select Top-Up Protocol
                                  </label>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' }}>
                                    {[
                                      { id: 'card', label: 'Credit / Debit Card', icon: RiBankCardFill },
                                      { id: 'mpesa', label: 'PesaPal / M-Pesa STK', icon: RiCellphoneFill }
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
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px'
                                          }}
                                        >
                                          <GwIcon size={16} />
                                          <span>{gw.label}</span>
                                        </button>
                                      )
                                    })}
                                  </div>

                                  {eventPaymentGateway === 'card' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                      <div>
                                        <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Cardholder Name</label>
                                        <input type="text" placeholder={eventCardName || "Alex Chen"} defaultValue={eventCardName || "Alex Chen"} required style={{ width: '100%', boxSizing: 'border-box', padding: '9px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: isLight ? '#0f172a' : '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                                      </div>
                                      <div>
                                        <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Card Number</label>
                                        <input type="text" placeholder="4242 •••• •••• 4242" defaultValue="4242 •••• •••• 4242" required style={{ width: '100%', boxSizing: 'border-box', padding: '9px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: isLight ? '#0f172a' : '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                                      </div>
                                    </div>
                                  )}

                                  {eventPaymentGateway === 'mpesa' && (
                                    <div style={{ background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                      <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>M-Pesa Mobile Number</label>
                                      <input type="tel" placeholder="+254 712 345 678" defaultValue="+254 712 345 678" required style={{ width: '100%', boxSizing: 'border-box', padding: '9px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: isLight ? '#0f172a' : '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })()}
                        </div>

                        {/* Order Summary & Submit Button */}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 700 }}>Total Order ({eventQty} Tickets)</span>
                            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: effectiveAccent }}>
                              {totalCredits} TM Credits
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

              // Tracklist for this album - match real tracks from catalogue first!
              const matchedTracks = tracks.filter(t => {
                const rel = (t.release || '').toLowerCase().trim();
                const albTitle = (alb.title || '').toLowerCase().trim();
                return rel === albTitle || (Array.isArray(alb.isrcs) && alb.isrcs.includes(t.isrc));
              });

              const albumTracks = matchedTracks.length > 0 ? matchedTracks.map((t, idx) => ({
                num: idx + 1,
                title: t.title,
                dur: t.duration || '3:30',
                isrc: t.isrc || `${alb.isrc}-${String(idx + 1).padStart(2, '0')}`,
                bpm: 124 + (idx % 8),
                key: ['Am', 'Dm', 'Em', 'F#m', 'Bm', 'Gm', 'C#m', 'Fm'][idx % 8],
                streams: t.streams || '100K',
                priceCredits: t.priceCredits || 50,
                audioUrl: t.audioUrl || t.fileUrl,
                coverArt: t.coverArt || alb.cover
              })) : [
                { num: 1, title: `${alb.title} (Master Intro)`, dur: '2:14', isrc: `${alb.isrc}-01`, bpm: 124, key: 'F#m', streams: '820K', priceCredits: 25 },
                { num: 2, title: 'Nairobi Cyberwave (Full Vocal Mix)', dur: '3:45', isrc: `${alb.isrc}-02`, bpm: 126, key: 'Am', streams: '3.4M', priceCredits: 50 },
                { num: 3, title: 'Sunset over Rift Valley', dur: '4:12', isrc: `${alb.isrc}-03`, bpm: 118, key: 'Dm', streams: '1.8M', priceCredits: 40 },
                { num: 4, title: 'Afro-Synth Cascade (Club Edit)', dur: '3:18', isrc: `${alb.isrc}-04`, bpm: 128, key: 'Em', streams: '940K', priceCredits: 40 },
                { num: 5, title: 'Midnight Mara Starlight', dur: '5:02', isrc: `${alb.isrc}-05`, bpm: 122, key: 'Bm', streams: '2.1M', priceCredits: 45 },
                { num: 6, title: 'Savannah Pulse (Analog Tape Dub)', dur: '4:30', isrc: `${alb.isrc}-06`, bpm: 125, key: 'Gm', streams: '670K', priceCredits: 35 },
                { num: 7, title: 'Kilifi Sunset Harmonies', dur: '3:55', isrc: `${alb.isrc}-07`, bpm: 115, key: 'C#m', streams: '890K', priceCredits: 40 },
                { num: 8, title: 'Urban Safari Resonance', dur: '4:48', isrc: `${alb.isrc}-08`, bpm: 130, key: 'Am', streams: '1.2M', priceCredits: 45 },
                { num: 9, title: 'Intermaven Horizon (Outro)', dur: '2:40', isrc: `${alb.isrc}-09`, bpm: 110, key: 'Fm', streams: '530K', priceCredits: 25 }
              ];

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
                              title: `${alb.title} (Full Digital MP3 Album Pack)`,
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
                          ⚡ Buy Full Digital MP3 Album (100 Credits)
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
                              onClick={() => handleToggleAlbumAudio(albumTracks)}
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
                          <div 
                            style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', cursor: 'pointer' }}
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect()
                              const clickX = e.clientX - rect.left
                              const pct = Math.max(0, Math.min(1, clickX / rect.width))
                              const maxSec = !albumAudioUnlocked ? 30 : 240
                              const newSec = Math.floor(pct * maxSec)
                              setAlbumAudioProgress(newSec)
                              if (albumAudioRef.current) albumAudioRef.current.currentTime = newSec
                            }}
                          >
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
                        Album Tracklist & MP3 Singles
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: isLight ? '#64748b' : '#94a3b8' }}>
                        Click track to preview • Direct MP3 singles purchasing available for all tracks
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
                              ⚡ Buy MP3 Single ({trk.priceCredits} Credits)
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
              <span onClick={() => setActiveTab('store')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Lossless Digital MP3s</span>
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

                {(() => {
                  const showTierCredits = ticketTier === 'ga' ? 25 : ticketTier === 'vip' ? 50 : 100
                  const showTotalCredits = showTierCredits * ticketQty
                  const hasCredits = userCredits >= showTotalCredits
                  const shortfall = showTotalCredits - userCredits
                  const topUpDollars = Math.max(5, Math.ceil(shortfall / 10 / 5) * 5)
                  const topUpCredits = calcCreditsForAmount(topUpDollars)

                  if (hasCredits) {
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ background: 'rgba(0,240,255,0.08)', border: `1px solid ${effectiveAccent}`, borderRadius: '3px', padding: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                            <span style={{ color: '#cbd5e1' }}>Available Credits Balance:</span>
                            <strong style={{ color: effectiveAccent, fontSize: '1.05rem' }}>{userCredits} TM</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                            <span style={{ color: '#cbd5e1' }}>Pass Reservation Deduction:</span>
                            <strong style={{ color: '#f87171', fontSize: '1.05rem' }}>-{showTotalCredits} TM</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>
                            <span style={{ color: '#cbd5e1' }}>Remaining Balance After Booking:</span>
                            <strong style={{ color: '#22c55e', fontSize: '1.05rem' }}>{userCredits - showTotalCredits} TM</strong>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '10px' }}>
                            ✓ Direct TM Credits Deduction active. No external card or payment processor required.
                          </div>
                        </div>

                        <button
                          type="submit"
                          style={{ width: '100%', background: effectiveAccent, color: '#000', border: 'none', padding: '13px', borderRadius: '3px', fontWeight: 900, cursor: 'pointer', fontSize: '0.95rem', marginTop: '4px' }}
                        >
                          Confirm Pass Reservation ({showTotalCredits} TM Credits)
                        </button>
                      </div>
                    )
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '3px', padding: '14px' }}>
                        <div style={{ color: '#ef4444', fontWeight: 900, fontSize: '0.86rem', marginBottom: '4px' }}>
                          ⚠️ Credits Shortfall: {shortfall} TM Needed
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                          Your current balance is <strong>{userCredits} TM</strong>, but this reservation requires <strong>{showTotalCredits} TM</strong>.
                          Top up at least <strong>${topUpDollars}.00</strong> (+{topUpCredits} TM Credits in multiples of $5) to complete this purchase.
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>Top-Up Protocol</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                          {[['card', 'Credit / Debit Card'], ['pesapal', 'M-Pesa STK Push']].map(([gw, lbl]) => (
                            <button key={gw} type="button" onClick={() => setPaymentGateway(gw)} style={{ padding: '8px', borderRadius: '3px', border: paymentGateway === gw ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)', background: paymentGateway === gw ? 'rgba(0,240,255,0.1)' : 'transparent', color: paymentGateway === gw ? effectiveAccent : '#cbd5e1', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                              {lbl}
                            </button>
                          ))}
                        </div>

                        {paymentGateway === 'pesapal' ? (
                          <div>
                            <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>M-Pesa Mobile Number</label>
                            <input type="tel" placeholder="+254 712 345 678" defaultValue="+254 712 345 678" required style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Card Number</label>
                            <input type="text" placeholder="4242 •••• •••• 4242" defaultValue="4242 •••• •••• 4242" required style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                          </div>
                        )}
                      </div>

                      <button type="submit" style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '13px', borderRadius: '3px', fontWeight: 900, cursor: 'pointer', fontSize: '0.95rem' }}>
                        Authorize Top-Up +${topUpDollars} (+{topUpCredits} TM) & Reserve Pass
                      </button>
                    </div>
                  )
                })()}
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

                {/* Strict Credits Deduction & Top-Up Protocol */}
                {(() => {
                  let priceCredits = 60
                  if (stemsPackageType === 'instrumental') priceCredits = 40
                  else if (stemsPackageType === 'acapella') priceCredits = 35
                  else if (stemsPackageType === 'sync') priceCredits = 150

                  const hasCredits = userCredits >= priceCredits
                  const shortfall = priceCredits - userCredits
                  const topUpDollars = Math.max(5, Math.ceil(shortfall / 10 / 5) * 5)
                  const topUpCredits = calcCreditsForAmount(topUpDollars)

                  if (hasCredits) {
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ background: 'rgba(0,240,255,0.08)', border: `1px solid ${effectiveAccent}`, borderRadius: '3px', padding: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                            <span style={{ color: '#cbd5e1' }}>Available Credits Balance:</span>
                            <strong style={{ color: effectiveAccent, fontSize: '1.05rem' }}>{userCredits} TM</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                            <span style={{ color: '#cbd5e1' }}>Stems Pack Deduction:</span>
                            <strong style={{ color: '#f87171', fontSize: '1.05rem' }}>-{priceCredits} TM</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>
                            <span style={{ color: '#cbd5e1' }}>Remaining Balance After Download:</span>
                            <strong style={{ color: '#22c55e', fontSize: '1.05rem' }}>{userCredits - priceCredits} TM</strong>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '10px' }}>
                            ✓ Direct TM Credits Deduction active. No external payment protocol required.
                          </div>
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
                          {stemsProcessing ? 'Generating Stem Tokens...' : `Unlock & Download Stems Pack (${priceCredits} TM Credits)`}
                        </button>
                      </div>
                    )
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '3px', padding: '14px' }}>
                        <div style={{ color: '#ef4444', fontWeight: 900, fontSize: '0.86rem', marginBottom: '4px' }}>
                          ⚠️ Credits Shortfall: {shortfall} TM Needed
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                          Your current balance is <strong>{userCredits} TM</strong>, but this stems pack requires <strong>{priceCredits} TM</strong>.
                          Top up at least <strong>${topUpDollars}.00</strong> (+{topUpCredits} TM Credits in multiples of $5) to complete this purchase.
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>Top-Up Protocol</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                          {[
                            ['card', 'Credit / Debit Card'],
                            ['mpesa', 'M-Pesa STK Push']
                          ].map(([gw, lbl]) => (
                            <button
                              key={gw}
                              type="button"
                              onClick={() => setStemsPaymentMethod(gw)}
                              style={{ padding: '8px', borderRadius: '3px', border: stemsPaymentMethod === gw ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)', background: stemsPaymentMethod === gw ? `${effectiveAccent}22` : 'transparent', color: stemsPaymentMethod === gw ? effectiveAccent : '#cbd5e1', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textAlign: 'center' }}
                            >
                              {lbl}
                            </button>
                          ))}
                        </div>

                        {stemsPaymentMethod === 'mpesa' ? (
                          <div>
                            <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>M-Pesa Mobile Number</label>
                            <input
                              type="tel"
                              placeholder="+254 712 345 678"
                              defaultValue="+254 712 345 678"
                              required
                              style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }}
                            />
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>You will receive an STK prompt on your handset to authorize payment.</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input
                              type="text"
                              placeholder="Card Number: 4242 •••• •••• 4242"
                              defaultValue="4242 •••• •••• 4242"
                              required
                              style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                              <input type="text" placeholder="MM / YY" defaultValue="12/28" required style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                              <input type="text" placeholder="CVC" defaultValue="345" required style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
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
                        {stemsProcessing ? 'Authorizing...' : `Authorize Top-Up +$${topUpDollars} (+${topUpCredits} TM) & Unlock Stems`}
                      </button>
                    </div>
                  )
                })()}
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
      {/* ================= EPK PREVIEW MODAL WITH DIRECT PDF DOWNLOAD (SEAMLESS 2-STEP) ================= */}
      {epkPreviewModalOpen && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setEpkPreviewModalOpen(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', zIndex: 2600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `2px solid ${effectiveAccent}`, borderRadius: '4px', width: '100%', maxWidth: '820px', maxHeight: '92vh', overflowY: 'auto', padding: '32px', color: '#fff', position: 'relative', boxShadow: `0 25px 90px ${effectiveAccent}44` }}>
            <button onClick={() => setEpkPreviewModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

            {/* Seamless 2-Step Process Step Tracker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.74rem', background: effectiveAccent, color: '#000', fontWeight: 900, padding: '4px 10px', borderRadius: '3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Step 1 of 2: In-App EPK Preview
              </span>
              <span style={{ fontSize: '0.74rem', background: 'rgba(255,255,255,0.08)', color: '#94a3b8', fontWeight: 700, padding: '4px 10px', borderRadius: '3px' }}>
                Step 2: Windows Save & Print Dialog
              </span>
            </div>

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 900, color: '#fff', fontFamily: effectiveFont }}>
                  {effectiveArtistName} • Executive Press Kit (EPK)
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Inspect high-resolution layout preview below. Clicking download launches your Windows save dialog.
                </div>
              </div>

              {/* Direct Step 2 PDF Download Action */}
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
                  padding: '12px 22px',
                  borderRadius: '3px',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: `0 4px 18px ${effectiveAccent}55`
                }}
              >
                <RiDownloadFill size={18} /> Step 2: Download EPK (Windows Dialog)
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
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>TuneMavens Verified Creator World</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '20px', marginBottom: '20px' }}>
                <img src={epkData?.profilePhoto || epkData?.heroImage || heroSlide1} alt="Profile" style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '3px', border: '1px solid #0284c7' }} />
                <div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.3rem', fontWeight: 900 }}>{effectiveArtistName}</h3>
                  <div style={{ fontSize: '0.82rem', color: '#0284c7', fontWeight: 700, marginBottom: '10px' }}>{effectiveHeadline}</div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#334155', lineHeight: 1.6 }}>
                    {effectiveBio ? effectiveBio.replace(/<[^>]*>?/gm, '').slice(0, 320) + '...' : 'International touring creator and multitrack recording artist.'}
                  </p>
                </div>
              </div>

              {/* Core Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '3px', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '16px' }}>
                <div><div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>STREAMS</div><div style={{ fontWeight: 900, color: '#0f172a', fontSize: '1.1rem' }}>4.2M+</div></div>
                <div><div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>LISTENERS</div><div style={{ fontWeight: 900, color: '#0f172a', fontSize: '1.1rem' }}>385K/mo</div></div>
                <div><div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>TOUR CAPACITY</div><div style={{ fontWeight: 900, color: '#0f172a', fontSize: '1.1rem' }}>1.5K - 3.5K</div></div>
                <div><div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>SYNC STATUS</div><div style={{ fontWeight: 900, color: '#16a34a', fontSize: '1.1rem' }}>100% Cleared</div></div>
              </div>

              {/* Official Social Media & Streaming Handles in Preview */}
              <div style={{ background: '#f1f5f9', padding: '14px', borderRadius: '3px', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
                  Official Social Media & Streaming Handles
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', fontSize: '0.72rem' }}>
                  <div style={{ background: '#fff', padding: '8px', borderRadius: '3px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>Instagram</div>
                    <div style={{ color: '#0284c7', marginTop: '2px', wordBreak: 'break-all' }}>{epkData?.instagram || ('@' + artistSlug)}</div>
                  </div>
                  <div style={{ background: '#fff', padding: '8px', borderRadius: '3px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>YouTube</div>
                    <div style={{ color: '#0284c7', marginTop: '2px', wordBreak: 'break-all' }}>{epkData?.youtube || ('youtube.com/@' + artistSlug)}</div>
                  </div>
                  <div style={{ background: '#fff', padding: '8px', borderRadius: '3px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>Spotify</div>
                    <div style={{ color: '#0284c7', marginTop: '2px', wordBreak: 'break-all' }}>{epkData?.spotify || ('spotify.com/artist/' + artistSlug)}</div>
                  </div>
                  <div style={{ background: '#fff', padding: '8px', borderRadius: '3px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>X / Twitter</div>
                    <div style={{ color: '#0284c7', marginTop: '2px', wordBreak: 'break-all' }}>{epkData?.twitter || ('@' + artistSlug)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Clicking Download brings up your native Windows / browser print and PDF export dialog.
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
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
                  style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '10px 22px', borderRadius: '3px', fontWeight: 900, fontSize: '0.86rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <RiDownloadFill size={16} /> Download PDF File
                </button>
              </div>
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
                  handleDownloadTechRiderPdf()
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
                  {(() => {
                    const cartSubtotal = cart.reduce((sum, item) => sum + ((item.numPrice !== undefined ? item.numPrice : parseFloat(String(item.price || '0').replace(/[^0-9.]/g, '')) || 0) * item.qty), 0)
                    const cartCredits = Math.round(cartSubtotal * 10)
                    return (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '1.1rem', fontWeight: 900 }}>
                          <span>Subtotal</span>
                          <span style={{ color: effectiveAccent }}>${cartSubtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '0.84rem', color: '#94a3b8' }}>
                          <span>Credits Equivalent</span>
                          <strong style={{ color: effectiveAccent }}>{cartCredits} TM Credits</strong>
                        </div>
                        <button onClick={handleCheckoutCart} style={{ width: '100%', background: effectiveAccent, color: '#000', border: 'none', padding: '12px', borderRadius: '3px', fontWeight: 900, cursor: 'pointer', fontSize: '0.95rem' }}>
                          Checkout with TM Credits ({cartCredits} TM)
                        </button>
                      </>
                    )
                  })()}
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
              Purchase Full Digital MP3 Album ({selectedAlbumModal.priceCredits} Credits)
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
                    Sign up to post comments, unlock unreleased MP3s, claim 20% ticket discounts, and configure your preferred alerts.
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
                      'Unreleased Digital MP3 Singles',
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
                <div style={{ width: '48px', height: '48px', borderRadius: '3px', overflow: 'hidden', border: `2px solid ${effectiveAccent}`, flexShrink: 0 }}>
                  <img
                    src={fanProfileAvatar || fanUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={fanUser?.name || 'Fan Avatar'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#fff', fontFamily: effectiveFont }}>
                    {effectiveArtistName || 'Ndufo'} Fan Portal
                  </h3>
                  <div style={{ fontSize: '1.02rem', fontWeight: 800, color: '#fff', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span>
                      <strong style={{ color: effectiveAccent }}>{fanProfileName || fanUser?.name || 'Alex Chen'}</strong>{' '}
                      <span style={{ color: '#cbd5e1', fontWeight: 600 }}>[{fanProfileEmail || fanUser?.email || 'fan@intermaven.io'}]</span>
                    </span>
                    <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', padding: '2px 8px', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 800 }}>
                      🌟 VIP Member
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '3px' }}>
                    CRM ID: {fanUser?.crmId || 'CRM-849201'} • Preferred Alerts: <span style={{ color: effectiveAccent, fontWeight: 700 }}>{(ticketDeliveryChannel || fanUser?.preferredCommMethod || 'EMAIL').toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Right Cluster: Credits Box on Top + [Top Up] & [Settings] directly below */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                  <div style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '3px', fontSize: '0.8rem', textAlign: 'right', minWidth: '160px' }}>
                    <div style={{ fontSize: '0.66rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>Non-Expiring Credits</div>
                    <div style={{ fontWeight: 900, color: effectiveAccent, fontSize: '1.1rem' }}>{userCredits} TM</div>
                  </div>
                  
                  {/* Action Buttons Below Credits */}
                  <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                    <button
                      type="button"
                      onClick={() => setFanPortalTab('topup')}
                      title="Top Up TM Credits"
                      style={{
                        flex: 1,
                        background: fanPortalTab === 'topup' ? effectiveAccent : 'rgba(0,240,255,0.14)',
                        color: fanPortalTab === 'topup' ? '#000' : effectiveAccent,
                        border: `1px solid ${effectiveAccent}`,
                        padding: '6px 10px',
                        borderRadius: '3px',
                        fontWeight: 900,
                        fontSize: '0.76rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <RiCoinsFill size={13} /> + Top Up
                    </button>
                    <button
                      type="button"
                      onClick={() => setFanPortalTab('settings')}
                      title="Profile Settings"
                      style={{
                        flex: 1,
                        background: fanPortalTab === 'settings' ? effectiveAccent : 'rgba(255,255,255,0.08)',
                        color: fanPortalTab === 'settings' ? '#000' : '#fff',
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: '6px 10px',
                        borderRadius: '3px',
                        fontWeight: 800,
                        fontSize: '0.76rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      ⚙️ Settings
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setFanPortalOpen(false)} 
                  title="Close Fan Portal"
                  style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '3px', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Portal Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', padding: '12px 24px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
              {[
                { id: 'vault', label: 'Exclusive Fan Vault (MP3 & Audio)', icon: '🎵' },
                { id: 'topup', label: 'Top Up Credits', icon: '💳' },
                { id: 'tickets', label: 'Discounted Show Tickets', icon: '🎟️' },
                { id: 'merch', label: 'Special Fan Merch Drops', icon: '👕' },
                { id: 'voting', label: 'Setlist Voting & Interaction', icon: '🗳️' },
                { id: 'settings', label: 'Profile & Settings', icon: '⚙️' }
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
              {/* TAB 1: EXCLUSIVE FAN VAULT (MP3 & AUDIO) */}
              {fanPortalTab === 'vault' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ background: 'rgba(34,211,238,0.06)', border: `1px solid ${effectiveAccent}33`, padding: '16px 20px', borderRadius: '3px' }}>
                    <h4 style={{ margin: 0, color: effectiveAccent, fontSize: '1.05rem', fontWeight: 800 }}>
                      Lossless Digital MP3 Singles & Audio Vault
                    </h4>
                    <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                      Direct high-quality 320kbps MP3 and lossless audio tracks pre-cleared for VIP members. Redeem MP3 singles directly with your non-expiring TM Credits balance. <strong style={{ color: '#94a3b8' }}>Note: Uncompressed master multitracks and commercial sync licensing are strictly reserved for verified industry professionals via TuneMavens Backend Admin.</strong>
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { id: 901, title: 'Nairobi Cyberwave (Exclusive VIP MP3 Single)', formatText: 'High-Quality 320kbps MP3 / Lossless Master', duration: '3:45', credits: 40, size: '9.2 MB' },
                      { id: 902, title: 'Sunset over Rift Valley (Acoustic VIP Edition)', formatText: 'High-Quality 320kbps MP3 / Lossless Master', duration: '4:12', credits: 40, size: '10.5 MB' },
                      { id: 903, title: 'Afro-Synth Cascade (Unreleased Club Dub MP3)', formatText: 'High-Quality 320kbps MP3 / Lossless Master', duration: '3:18', credits: 45, size: '8.1 MB' }
                    ].map(item => (
                      <div key={item.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px 18px', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{item.title}</div>
                          <div style={{ fontSize: '0.78rem', color: effectiveAccent, marginTop: '3px' }}>{item.formatText}</div>
                          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>{item.size} • {item.duration}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button 
                            onClick={() => {
                              if (userCredits >= item.credits) {
                                setUserCredits(prev => prev - item.credits)
                                showToast(`🎉 Redeemed ${item.title}! Digital MP3 download link active. Remaining Credits: ${userCredits - item.credits}`)
                              } else {
                                showToast('⚠️ Insufficient credits. Please top up your balance using the Top Up tab.')
                              }
                            }} 
                            style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '8px 16px', borderRadius: '3px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
                          >
                            Redeem MP3 Single ({item.credits} Credits)
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: TOP UP CREDITS PROTOCOL */}
              {fanPortalTab === 'topup' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ background: 'rgba(0,240,255,0.06)', border: `1px solid ${effectiveAccent}44`, padding: '18px 22px', borderRadius: '3px' }}>
                    <h4 style={{ margin: '0 0 6px', color: effectiveAccent, fontSize: '1.15rem', fontWeight: 900 }}>
                      Instant Non-Expiring TM Credits Top-Up
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                      Platformwide purchases (MP3 digital singles, tour tickets, limited edition vinyl, and merch) are completed using non-expiring TM Credits. Credits never expire and sync across your unified Intermaven wallet.
                    </p>
                  </div>

                  {/* Select Top-Up Package */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
                        Select Credits Package ($5, $10, $20, $100)
                      </label>
                      <span style={{ fontSize: '0.75rem', color: effectiveAccent, fontWeight: 700 }}>
                        Selected: ${fanTopUpPrice}.00 USD = {fanTopUpCredits} TM Credits
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                      {[
                        { amount: 5, credits: 50, price: '$5.00', title: 'Starter Pack', perk: 'Unlock unreleased MP3 singles & digital drops' },
                        { amount: 10, credits: 110, price: '$10.00', title: 'Fan VIP Pack (+10% Bonus)', perk: 'Priority pre-sale codes & discography audio' },
                        { amount: 20, credits: 240, price: '$20.00', title: 'Superfan Collector (+20% Bonus)', perk: '20% off all tour passes & limited merch drops' },
                        { amount: 100, credits: 1300, price: '$100.00', title: 'Champion VIP Club (+30% Bonus)', perk: 'Lifetime fan club badge, private listening & VIP access' }
                      ].map(pkg => (
                        <div
                          key={pkg.amount}
                          onClick={() => {
                            setFanTopUpPrice(pkg.amount)
                            setFanTopUpCredits(pkg.credits)
                          }}
                          style={{
                            padding: '14px',
                            borderRadius: '3px',
                            border: fanTopUpPrice === pkg.amount ? `2px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.12)',
                            background: fanTopUpPrice === pkg.amount ? 'rgba(0,240,255,0.14)' : 'rgba(255,255,255,0.03)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.72rem', color: fanTopUpPrice === pkg.amount ? effectiveAccent : '#94a3b8', fontWeight: 800 }}>{pkg.title}</div>
                            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff', margin: '4px 0' }}>{pkg.credits} Credits</div>
                            <div style={{ fontSize: '0.92rem', color: effectiveAccent, fontWeight: 800 }}>{pkg.price}</div>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '8px', lineHeight: 1.35 }}>{pkg.perk}</div>
                        </div>
                      ))}
                    </div>

                    {/* Custom Top-Up in Multiples of $5 */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 18px', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#fff' }}>Custom Top-Up (Multiples of $5)</div>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                          Add any custom amount in $5 increments ($15, $25, $35, $50...). Higher amounts include tiered bonus credits.
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const next = Math.max(5, (fanTopUpPrice || 5) - 5)
                            setFanTopUpPrice(next)
                            setFanTopUpCredits(calcCreditsForAmount(next))
                          }}
                          style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '3px', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer' }}
                        >
                          -
                        </button>
                        <div style={{ position: 'relative', width: '110px' }}>
                          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: effectiveAccent, fontWeight: 900, fontSize: '0.9rem' }}>$</span>
                          <input
                            type="number"
                            min="5"
                            step="5"
                            value={fanTopUpPrice}
                            onChange={(e) => {
                              const raw = parseInt(e.target.value, 10) || 5
                              const rounded = Math.max(5, Math.round(raw / 5) * 5)
                              setFanTopUpPrice(rounded)
                              setFanTopUpCredits(calcCreditsForAmount(rounded))
                            }}
                            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px 8px 24px', background: 'rgba(0,0,0,0.5)', border: `1px solid ${effectiveAccent}88`, color: '#fff', borderRadius: '3px', fontWeight: 900, fontSize: '1rem', textAlign: 'center' }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const next = (fanTopUpPrice || 5) + 5
                            setFanTopUpPrice(next)
                            setFanTopUpCredits(calcCreditsForAmount(next))
                          }}
                          style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '3px', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer' }}
                        >
                          +
                        </button>
                        <div style={{ background: `${effectiveAccent}22`, border: `1px solid ${effectiveAccent}`, padding: '7px 12px', borderRadius: '3px', fontSize: '0.84rem', fontWeight: 900, color: effectiveAccent, whiteSpace: 'nowrap' }}>
                          = {fanTopUpCredits} TM Credits
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Protocol & Details */}
                  <form onSubmit={handleExecuteFanTopUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                        Payment Protocol
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => setFanTopUpGateway('card')}
                          style={{
                            padding: '10px',
                            borderRadius: '3px',
                            border: fanTopUpGateway === 'card' ? `2px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)',
                            background: fanTopUpGateway === 'card' ? 'rgba(0,240,255,0.12)' : 'transparent',
                            color: fanTopUpGateway === 'card' ? effectiveAccent : '#cbd5e1',
                            fontWeight: 800,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <RiBankCardFill size={16} /> Credit / Debit Card
                        </button>
                        <button
                          type="button"
                          onClick={() => setFanTopUpGateway('mpesa')}
                          style={{
                            padding: '10px',
                            borderRadius: '3px',
                            border: fanTopUpGateway === 'mpesa' ? `2px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)',
                            background: fanTopUpGateway === 'mpesa' ? 'rgba(0,240,255,0.12)' : 'transparent',
                            color: fanTopUpGateway === 'mpesa' ? effectiveAccent : '#cbd5e1',
                            fontWeight: 800,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <RiCellphoneFill size={16} /> M-Pesa STK Push
                        </button>
                      </div>
                    </div>

                    {fanTopUpGateway === 'card' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Cardholder Name</label>
                          <input type="text" placeholder={fanProfileName || "Alex Chen"} defaultValue={fanProfileName || "Alex Chen"} required style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Card Number</label>
                          <input type="text" placeholder="4242 •••• •••• 4242" defaultValue="4242 •••• •••• 4242" required style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                          <div>
                            <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Exp (MM/YY)</label>
                            <input type="text" placeholder="08/28" defaultValue="08/28" required style={{ width: '100%', boxSizing: 'border-box', padding: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>CVC</label>
                            <input type="password" placeholder="•••" defaultValue="888" required style={{ width: '100%', boxSizing: 'border-box', padding: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>ZIP</label>
                            <input type="text" placeholder="90210" defaultValue="90210" required style={{ width: '100%', boxSizing: 'border-box', padding: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>M-Pesa Mobile Number (STK Push PIN Prompt)</label>
                        <input type="tel" placeholder="+254 712 345 678" defaultValue="+254 712 345 678" required style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>An instant STK Push prompt will be sent to your phone to authorize non-expiring TM credits.</div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={fanTopUpProcessing}
                      style={{
                        width: '100%',
                        background: effectiveAccent,
                        color: '#000',
                        border: 'none',
                        padding: '13px',
                        borderRadius: '3px',
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: `0 4px 18px ${effectiveAccent}44`
                      }}
                    >
                      <RiCoinsFill size={18} />
                      {fanTopUpProcessing ? 'Authorizing Credit Top-Up...' : `Authorize & Top Up +${fanTopUpCredits} TM Credits Now`}
                    </button>
                  </form>
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
                          placeholder="Ask about synthesis, tour dates, acoustics..." 
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

              {/* TAB 5: FAN PROFILE & SETTINGS (PERSONAL INFO + PREFERENCES) */}
              {fanPortalTab === 'settings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <form onSubmit={handleSaveFanProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Personal Information Card */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', padding: '24px', borderRadius: '3px' }}>
                      <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 900, color: effectiveAccent, fontFamily: effectiveFont }}>
                        Personal Information & Account Settings
                      </h4>
                      <p style={{ margin: '0 0 20px', fontSize: '0.82rem', color: '#94a3b8' }}>
                        Update your personal identity, email address, secure password, and select your fan club avatar.
                      </p>

                      {/* Avatar Selection with Custom Upload & Presets */}
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                          Fan Profile Avatar & Photo
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                          <div style={{ width: '72px', height: '72px', borderRadius: '3px', overflow: 'hidden', border: `2px solid ${effectiveAccent}`, flexShrink: 0 }}>
                            <img src={fanProfileAvatar} alt="Current Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                              <input
                                type="file"
                                id="fan-avatar-file-upload"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFanAvatarUpload}
                              />
                              <label
                                htmlFor="fan-avatar-file-upload"
                                style={{
                                  background: effectiveAccent,
                                  color: '#000',
                                  border: 'none',
                                  padding: '8px 16px',
                                  borderRadius: '3px',
                                  fontWeight: 800,
                                  fontSize: '0.82rem',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <RiUploadFill size={15} /> Upload Photo
                              </label>
                              <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>JPG, PNG or GIF from your device</span>
                            </div>

                            {/* Preset Avatars */}
                            <div>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '6px' }}>Or select a preset avatar:</div>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {[
                                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
                                  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
                                  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150'
                                ].map((presetUrl, pIdx) => (
                                  <div
                                    key={pIdx}
                                    onClick={() => setFanProfileAvatar(presetUrl)}
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '3px',
                                      overflow: 'hidden',
                                      cursor: 'pointer',
                                      border: fanProfileAvatar === presetUrl ? `2px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.2)',
                                      opacity: fanProfileAvatar === presetUrl ? 1 : 0.65,
                                      transition: 'all 0.15s ease'
                                    }}
                                  >
                                    <img src={presetUrl} alt={`Avatar ${pIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Custom Avatar URL input */}
                        <div style={{ marginTop: '12px' }}>
                          <input
                            type="url"
                            placeholder="Or enter custom image URL: https://..."
                            value={fanProfileAvatar}
                            onChange={e => setFanProfileAvatar(e.target.value)}
                            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.82rem' }}
                          />
                        </div>
                      </div>

                      {/* Name & Email Fields */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                        <div>
                          <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                            Fan Full Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Maya Chen"
                            value={fanProfileName}
                            onChange={e => setFanProfileName(e.target.value)}
                            required
                            style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.86rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                            Email Address
                          </label>
                          <input
                            type="email"
                            placeholder="fan@intermaven.io"
                            value={fanProfileEmail}
                            onChange={e => setFanProfileEmail(e.target.value)}
                            required
                            style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.86rem' }}
                          />
                        </div>
                      </div>

                      {/* 3-Field Password Change Section Laid Out Vertically (One Above The Other) */}
                      <div style={{ background: 'rgba(0,0,0,0.35)', border: `1px solid ${effectiveAccent}44`, borderRadius: '3px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                          <h5 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: effectiveAccent }}>
                            Security & Password Authorization
                          </h5>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            Alert Target: <strong style={{ color: '#fff' }}>{(ticketDeliveryChannel || fanUser?.preferredCommMethod || 'EMAIL').toUpperCase()}</strong>
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                          Provide your current password for confirmation, followed by your new password and re-confirmation. A security dispatch will notify your preferred channel upon successful update.
                        </p>

                        {/* 3 Password Fields Stacked Vertically */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {/* Field 1: Current Password */}
                          <div>
                            <label style={{ fontSize: '0.72rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                              Current Password (for confirmation)
                            </label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                              <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                placeholder="Enter current password to authorize changes"
                                value={fanCurrentPassword}
                                onChange={e => setFanCurrentPassword(e.target.value)}
                                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 42px 10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                title={showCurrentPassword ? 'Hide password' : 'Show password'}
                                style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: showCurrentPassword ? effectiveAccent : '#94a3b8', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                {showCurrentPassword ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
                              </button>
                            </div>
                          </div>

                          {/* Field 2: New Password */}
                          <div>
                            <label style={{ fontSize: '0.72rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                              New Password
                            </label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                              <input
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder="Enter new password (min 6 chars)"
                                value={fanNewPassword}
                                onChange={e => setFanNewPassword(e.target.value)}
                                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 42px 10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                title={showNewPassword ? 'Hide password' : 'Show password'}
                                style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: showNewPassword ? effectiveAccent : '#94a3b8', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                {showNewPassword ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
                              </button>
                            </div>
                          </div>

                          {/* Field 3: Confirm New Password */}
                          <div>
                            <label style={{ fontSize: '0.72rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                              Confirm New Password
                            </label>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                              <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Re-enter new password"
                                value={fanConfirmPassword}
                                onChange={e => setFanConfirmPassword(e.target.value)}
                                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 42px 10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                                style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: showConfirmPassword ? effectiveAccent : '#94a3b8', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                {showConfirmPassword ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Dedicated Password Submit Button */}
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '4px' }}>
                          <button
                            type="button"
                            onClick={handleSaveFanProfile}
                            style={{
                              background: `linear-gradient(135deg, ${effectiveAccent}, #8b5cf6)`,
                              color: '#000',
                              border: 'none',
                              padding: '10px 18px',
                              borderRadius: '3px',
                              fontWeight: 900,
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <RiShieldCheckFill size={15} /> Update Password & Security
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Communication Preferences Card */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', padding: '24px', borderRadius: '3px' }}>
                      <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 900, color: '#fff' }}>
                        Preferred Ticket & Alert Delivery Method
                      </h4>
                      <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#94a3b8' }}>
                        Reserved tickets and tour discount notifications default to this delivery method.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
                        {[
                          { id: 'email', label: 'Email', icon: '✉️' },
                          { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
                          { id: 'sms', label: 'SMS Alerts', icon: '📱' },
                          { id: 'push', label: 'In-App Push', icon: '🔔' }
                        ].map(channel => (
                          <div
                            key={channel.id}
                            onClick={() => setTicketDeliveryChannel(channel.id)}
                            style={{
                              padding: '12px 8px',
                              borderRadius: '3px',
                              border: ticketDeliveryChannel === channel.id ? `2px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.1)',
                              background: ticketDeliveryChannel === channel.id ? `${effectiveAccent}18` : 'rgba(255,255,255,0.03)',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{channel.icon}</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: ticketDeliveryChannel === channel.id ? effectiveAccent : '#fff' }}>{channel.label}</div>
                          </div>
                        ))}
                      </div>

                      {(ticketDeliveryChannel === 'sms' || ticketDeliveryChannel === 'whatsapp') && (
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                            {ticketDeliveryChannel === 'whatsapp' ? 'WhatsApp Mobile Number' : 'SMS Phone Number'}
                          </label>
                          <input
                            type="tel"
                            placeholder="+1 555 019 2834"
                            value={ticketPhone}
                            onChange={e => setTicketPhone(e.target.value)}
                            required
                            style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.86rem' }}
                          />
                        </div>
                      )}

                      <h4 style={{ margin: '18px 0 10px', fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>
                        Notification Category Subscriptions
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[
                          '⚡ Instant Tour Pre-Sale Alerts & VIP Pass Holds',
                          '🎵 Unreleased Digital MP3 Singles & Lossless Releases',
                          '👕 Exclusive Fan Club Merchandise Flash Sales',
                          '🎙️ Creator Behind-The-Scenes & Monthly Livestream Q&A'
                        ].map((sub, idx) => (
                          <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', color: '#cbd5e1', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '3px' }}>
                            <input type="checkbox" defaultChecked style={{ accentColor: effectiveAccent }} />
                            {sub}
                          </label>
                        ))}
                      </div>
                    </div>

                    <button 
                      type="submit"
                      style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '12px 24px', borderRadius: '3px', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', boxShadow: `0 4px 16px ${effectiveAccent}44` }}
                    >
                      Save Profile & Preferences
                    </button>
                  </form>
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
                  <RiCoinsFill style={{ color: effectiveAccent }} /> Buy MP3 Single ({selectedTrackModal.priceCredits || 50} TM)
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
                    Complete Your Merch & MP3s Order
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

                {/* Strict Credits Deduction & Top-Up Protocol */}
                {(() => {
                  const discountedTotal = cartTotal * (1 - appliedPromoDiscount)
                  const requiredCredits = Math.round(discountedTotal * 10)
                  const hasCredits = userCredits >= requiredCredits
                  const shortfall = requiredCredits - userCredits
                  const topUpDollars = Math.max(5, Math.ceil(shortfall / 10 / 5) * 5)
                  const topUpCredits = calcCreditsForAmount(topUpDollars)

                  if (hasCredits) {
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ background: 'rgba(0,240,255,0.08)', border: `1px solid ${effectiveAccent}`, borderRadius: '3px', padding: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                            <span style={{ color: '#cbd5e1' }}>Available Credits Balance:</span>
                            <strong style={{ color: effectiveAccent, fontSize: '1.05rem' }}>{userCredits} TM</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                            <span style={{ color: '#cbd5e1' }}>Merch & MP3s Order Deduction:</span>
                            <strong style={{ color: '#f87171', fontSize: '1.05rem' }}>-{requiredCredits} TM</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>
                            <span style={{ color: '#cbd5e1' }}>Remaining Balance After Order:</span>
                            <strong style={{ color: '#22c55e', fontSize: '1.05rem' }}>{userCredits - requiredCredits} TM</strong>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '10px' }}>
                            ✓ Direct TM Credits Deduction active. No external card or payment processor required.
                          </div>
                        </div>

                        <button
                          type="submit"
                          style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '14px', borderRadius: '3px', fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer', marginTop: '6px', boxShadow: `0 4px 16px ${effectiveAccent}55` }}
                        >
                          Confirm Order ({requiredCredits} TM Credits)
                        </button>
                      </div>
                    )
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '3px', padding: '14px' }}>
                        <div style={{ color: '#ef4444', fontWeight: 900, fontSize: '0.86rem', marginBottom: '4px' }}>
                          ⚠️ Credits Shortfall: {shortfall} TM Needed
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                          Your current balance is <strong>{userCredits} TM</strong>, but this order requires <strong>{requiredCredits} TM</strong>.
                          Top up at least <strong>${topUpDollars}.00</strong> (+{topUpCredits} TM Credits in multiples of $5) to complete this purchase.
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '6px' }}>Top-Up Protocol</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                          {[
                            ['stripe', 'Credit / Debit Card'],
                            ['pesapal', 'M-Pesa STK Push']
                          ].map(([gw, lbl]) => (
                            <button
                              key={gw}
                              type="button"
                              onClick={() => setMerchPaymentGateway(gw)}
                              style={{ padding: '8px', borderRadius: '3px', border: merchPaymentGateway === gw ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)', background: merchPaymentGateway === gw ? `${effectiveAccent}22` : 'transparent', color: merchPaymentGateway === gw ? effectiveAccent : '#cbd5e1', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textAlign: 'center' }}
                            >
                              {lbl}
                            </button>
                          ))}
                        </div>

                        {merchPaymentGateway === 'pesapal' ? (
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
                        ) : (
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
                      </div>

                      <button
                        type="submit"
                        style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '14px', borderRadius: '3px', fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer', marginTop: '6px', boxShadow: `0 4px 16px ${effectiveAccent}55` }}
                      >
                        Authorize Top-Up +${topUpDollars} (+{topUpCredits} TM) & Place Order
                      </button>
                    </div>
                  )
                })()}
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
                { credits: 50, price: 5, label: 'Starter Pack ($5.00)' },
                { credits: 110, price: 10, label: 'Fan Booster (+10% Bonus)' },
                { credits: 240, price: 20, label: 'VIP Pass Pack (+20% Bonus)' },
                { credits: 1300, price: 100, label: 'Label Maven Pack (+30% Bonus)' }
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

      {/* ================= FLOATING THEMED TOAST NOTIFICATION SYSTEM ================= */}
      {toasts.length > 0 && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '440px', pointerEvents: 'none' }}>
          {toasts.map(t => (
            <div
              key={t.id}
              style={{
                pointerEvents: 'auto',
                background: t.type === 'error'
                  ? 'rgba(30, 10, 18, 0.95)'
                  : (isLight ? '#ffffff' : (selectedTheme?.cardBg || 'rgba(12, 16, 32, 0.95)')),
                backdropFilter: 'blur(16px)',
                border: `1.5px solid ${t.type === 'error' ? '#f43f5e' : `${effectiveAccent}88`}`,
                borderLeft: `5px solid ${t.type === 'error' ? '#f43f5e' : effectiveAccent}`,
                padding: '14px 18px',
                borderRadius: '3px',
                color: isLight && t.type !== 'error' ? '#0f172a' : '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 700,
                fontFamily: effectiveFont,
                boxShadow: t.type === 'error'
                  ? '0 14px 40px rgba(0,0,0,0.8), 0 0 20px rgba(244, 63, 94, 0.4)'
                  : `0 14px 40px rgba(0,0,0,0.8), 0 0 20px ${effectiveAccent}44`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                animation: 'slideInRight 0.25s ease'
              }}
            >
              <span style={{
                background: t.type === 'error' ? '#f43f5e' : effectiveAccent,
                color: '#000',
                padding: '3px 8px',
                borderRadius: '3px',
                fontSize: '0.68rem',
                fontWeight: 900,
                letterSpacing: '0.05em',
                flexShrink: 0
              }}>
                {t.type === 'error' ? 'ALERT' : 'NOTICE'}
              </span>
              <div style={{ flex: 1, color: isLight && t.type !== 'error' ? '#0f172a' : '#ffffff', lineHeight: 1.45 }}>{t.message}</div>
            </div>
          ))}
        </div>
      )}

      {/* ================= TUNE STREAM PERSISTENT FLOATING AUDIO PLAYER OVERLAY ================= */}
      {/* Hidden Restore Launcher Pill */}
      {!isPlayerVisible && (
        <button
          type="button"
          onClick={() => setIsPlayerVisible(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 9000,
            background: isLight ? '#ffffff' : (selectedTheme?.cardBg || '#0c1020'),
            backdropFilter: 'blur(16px)',
            border: `1.5px solid ${effectiveAccent}`,
            borderRadius: '3px',
            boxShadow: `0 10px 30px rgba(0,0,0,0.6), 0 0 16px ${effectiveAccent}44`,
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: isLight ? '#0f172a' : '#fff',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '0.84rem'
          }}
          title="Open TuneMavens Hi-Fi Floating Audio Player"
        >
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: isPlaying ? '#22c55e' : effectiveAccent,
            boxShadow: isPlaying ? '0 0 10px #22c55e' : 'none',
            display: 'inline-block'
          }} />
          <RiMusic2Fill style={{ color: effectiveAccent, fontSize: '1.1rem' }} />
          <span>TuneMavens Hi-Fi Player {isPlaying ? '• Playing' : '• Paused'}</span>
        </button>
      )}

      {/* Floating Overlay Card */}
      {isPlayerVisible && (
        <div
          style={{
            position: 'fixed',
            left: `${playerPos.x}px`,
            top: `${playerPos.y}px`,
            zIndex: 9000,
            width: isPlayerMinimized ? '320px' : '440px',
            maxWidth: 'calc(100vw - 24px)',
            background: isLight ? 'rgba(255, 255, 255, 0.95)' : (selectedTheme?.cardBg || 'rgba(12, 16, 32, 0.95)'),
            backdropFilter: 'blur(20px)',
            border: `1.5px solid ${effectiveAccent}66`,
            borderRadius: '3px',
            boxShadow: `0 16px 48px rgba(0,0,0,0.75), 0 0 24px ${effectiveAccent}33`,
            color: isLight ? '#0f172a' : '#fff',
            fontFamily: effectiveFont,
            userSelect: 'none',
            transition: 'box-shadow 0.2s ease, width 0.2s ease'
          }}
        >
          {/* Draggable Titlebar / Header */}
          <div
            onMouseDown={handleMouseDownDrag}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderBottom: `1px solid ${effectiveAccent}33`,
              background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.3)',
              cursor: 'grab',
              borderRadius: '3px 3px 0 0'
            }}
            title="Click and drag anywhere on this header to move player"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <RiDragMove2Fill style={{ color: effectiveAccent, fontSize: '1.05rem', flexShrink: 0 }} />
              <span style={{ fontWeight: 900, fontSize: '0.82rem', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                TuneMavens Hi-Fi Player
              </span>
              <span style={{
                background: `${effectiveAccent}22`,
                color: effectiveAccent,
                border: `1px solid ${effectiveAccent}55`,
                padding: '1px 5px',
                borderRadius: '3px',
                fontSize: '0.6rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                flexShrink: 0
              }}>
                ⚡ TuneStream
              </span>
            </div>

            {/* Window Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setIsPlayerMinimized(!isPlayerMinimized)}
                title={isPlayerMinimized ? "Expand Player" : "Minimize Player"}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isLight ? '#64748b' : '#94a3b8',
                  padding: '4px 6px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem'
                }}
              >
                {isPlayerMinimized ? <RiAddFill size={15} /> : <RiSubtractFill size={15} />}
              </button>
              <button
                type="button"
                onClick={() => setIsPlayerVisible(false)}
                title="Hide to Bottom Floating Pill"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isLight ? '#64748b' : '#94a3b8',
                  padding: '4px 6px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem'
                }}
              >
                <RiCloseFill size={16} />
              </button>
            </div>
          </div>

          {/* Minimized Compact View */}
          {isPlayerMinimized ? (
            <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={currentTrack.coverArt || 'https://picsum.photos/seed/track_art/400'}
                alt={currentTrack.title}
                style={{ width: '36px', height: '36px', borderRadius: '3px', objectFit: 'cover', border: `1px solid ${effectiveAccent}44` }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentTrack.title}
                </div>
                <div style={{ fontSize: '0.7rem', color: effectiveAccent, fontWeight: 700 }}>
                  {Math.floor(playbackProgress / 60)}:{('0' + (playbackProgress % 60)).slice(-2)} / {currentTrack.duration || '3:45'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '3px',
                  background: effectiveAccent,
                  color: '#000',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                {isPlaying ? <RiPauseFill /> : <RiPlayFill />}
              </button>
              <button
                type="button"
                onClick={handleTrackAdvance}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '3px',
                  background: 'rgba(255,255,255,0.06)',
                  color: isLight ? '#0f172a' : '#fff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                <RiSkipForwardFill />
              </button>
            </div>
          ) : (
            /* Full Player Controls */
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Playlist Selector Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiDiscFill style={{ color: effectiveAccent, fontSize: '1rem', flexShrink: 0 }} />
                <label style={{ fontSize: '0.72rem', color: isLight ? '#475569' : '#94a3b8', fontWeight: 800, textTransform: 'uppercase', flexShrink: 0 }}>
                  Playlist:
                </label>
                <select
                  value={selectedPlaylistId}
                  onChange={(e) => {
                    setSelectedPlaylistId(e.target.value)
                    setPlaylistIndex(0)
                    setPlaybackProgress(0)
                  }}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '3px',
                    background: isLight ? '#f1f5f9' : 'rgba(0,0,0,0.5)',
                    border: `1px solid ${effectiveAccent}55`,
                    color: isLight ? '#0f172a' : '#fff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">🎵 All Singles ({tracks.length} Tracks)</option>
                  <option value="vault">🔒 VIP Fan Vault Exclusives (3 Tracks)</option>
                  <option value="top">🔥 Top Singles (5 Tracks)</option>
                  {fanPlaylists.map(pl => (
                    <option key={pl.id} value={pl.id}>📁 {pl.name} ({(pl.trackIds || []).length} Tracks)</option>
                  ))}
                </select>
              </div>

              {/* Track Metadata Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '10px 12px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={currentTrack.coverArt || 'https://picsum.photos/seed/track_art/400'}
                    alt={currentTrack.title}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '3px',
                      objectFit: 'cover',
                      border: isPlaying ? `2px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)',
                      boxShadow: isPlaying ? `0 0 14px ${effectiveAccent}66` : 'none',
                      transition: 'border 0.2s ease, box-shadow 0.2s ease'
                    }}
                  />
                  {isPlaying && (
                    <div style={{ position: 'absolute', bottom: '3px', right: '3px', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 900, fontSize: '0.92rem', color: isLight ? '#0f172a' : '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentTrack.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: effectiveAccent, marginTop: '2px', fontWeight: 700, display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span>{effectiveArtistName}</span>
                    <span>•</span>
                    <span>ISRC: {currentTrack.isrc || 'KE-TM1-26-00042'}</span>
                  </div>
                  <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', padding: '1px 6px', borderRadius: '3px', fontSize: '0.62rem', fontWeight: 800 }}>
                      Lossless MP3 • 320kbps
                    </span>
                    <span style={{ fontSize: '0.68rem', color: isLight ? '#64748b' : '#94a3b8' }}>
                      Track {playlistIndex + 1} of {currentPlaylistTracks.length}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTrackModal(currentTrack)}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${effectiveAccent}55`,
                    color: effectiveAccent,
                    padding: '6px 10px',
                    borderRadius: '3px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Details
                </button>
              </div>

              {/* Scrubber & Timers */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8', fontFamily: 'monospace', minWidth: '32px' }}>
                    {Math.floor(playbackProgress / 60)}:{('0' + (playbackProgress % 60)).slice(-2)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="225"
                    value={playbackProgress}
                    onChange={(e) => setPlaybackProgress(Number(e.target.value))}
                    style={{ flex: 1, accentColor: effectiveAccent, cursor: 'pointer', height: '4px' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : '#94a3b8', fontFamily: 'monospace', minWidth: '32px', textAlign: 'right' }}>
                    {currentTrack.duration || '3:45'}
                  </span>
                </div>
              </div>

              {/* Playback Controls & Mode Switches */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '2px' }}>
                {/* Mode: Shuffle Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setShuffleMode(!shuffleMode)
                    showToast(shuffleMode ? '🔀 Shuffle mode: Sequenced' : '🔀 Shuffle mode: Random', 'info')
                  }}
                  title={shuffleMode ? "Shuffle: Random On (Click to switch to Sequenced)" : "Shuffle: Sequenced (Click to switch to Random)"}
                  style={{
                    background: shuffleMode ? `${effectiveAccent}22` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${shuffleMode ? effectiveAccent : 'rgba(255,255,255,0.15)'}`,
                    color: shuffleMode ? effectiveAccent : (isLight ? '#64748b' : '#94a3b8'),
                    padding: '8px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.76rem',
                    fontWeight: 800
                  }}
                >
                  <RiShuffleLine size={15} />
                  <span>{shuffleMode ? 'Random' : 'Order'}</span>
                </button>

                {/* Center Audio Buttons: Prev, Play/Pause, Stop, Next */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Previous Track */}
                  <button
                    type="button"
                    onClick={handleTrackPrevious}
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
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    title={isPlaying ? "Pause" : "Play"}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '3px',
                      background: effectiveAccent,
                      border: 'none',
                      color: '#000',
                      fontSize: '1.25rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 2px 14px ${effectiveAccent}66`
                    }}
                  >
                    {isPlaying ? <RiPauseFill /> : <RiPlayFill />}
                  </button>

                  {/* Stop */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlaying(false)
                      setPlaybackProgress(0)
                    }}
                    title="Stop Track"
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
                      fontSize: '0.95rem'
                    }}
                  >
                    <RiStopFill />
                  </button>

                  {/* Next Track */}
                  <button
                    type="button"
                    onClick={handleTrackAdvance}
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

                {/* Mode: Repeat Loop Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = repeatMode === 'off' ? 'playlist' : repeatMode === 'playlist' ? 'track' : 'off'
                    setRepeatMode(nextMode)
                    showToast(`🔁 Loop mode: ${nextMode === 'track' ? 'Repeat Track' : nextMode === 'playlist' ? 'Repeat Playlist' : 'Loop Off'}`, 'info')
                  }}
                  title={repeatMode === 'track' ? "Repeat: Single Track (Click to turn off)" : repeatMode === 'playlist' ? "Repeat: Entire Playlist (Click for single track)" : "Repeat: Off (Click for playlist loop)"}
                  style={{
                    background: repeatMode !== 'off' ? `${effectiveAccent}22` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${repeatMode !== 'off' ? effectiveAccent : 'rgba(255,255,255,0.15)'}`,
                    color: repeatMode !== 'off' ? effectiveAccent : (isLight ? '#64748b' : '#94a3b8'),
                    padding: '8px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.76rem',
                    fontWeight: 800
                  }}
                >
                  {repeatMode === 'track' ? <RiRepeatOneLine size={15} /> : <RiRepeatLine size={15} />}
                  <span>{repeatMode === 'track' ? 'Track' : repeatMode === 'playlist' ? 'Loop' : 'Off'}</span>
                </button>
              </div>

              {/* Volume & TuneStream Engine Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Volume / Mute Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsPlayerMuted(!isPlayerMuted)}
                    title={isPlayerMuted ? "Unmute" : "Mute"}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isPlayerMuted ? '#f43f5e' : (isLight ? '#475569' : '#94a3b8'),
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {isPlayerMuted ? <RiVolumeMuteFill size={17} /> : <RiVolumeUpFill size={17} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isPlayerMuted ? 0 : playerVolume}
                    onChange={(e) => {
                      setPlayerVolume(Number(e.target.value))
                      if (isPlayerMuted) setIsPlayerMuted(false)
                    }}
                    style={{ width: '80px', accentColor: effectiveAccent, cursor: 'pointer', height: '4px' }}
                  />
                </div>

                <div style={{ fontSize: '0.68rem', color: isLight ? '#64748b' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Universal TuneStream Engine</span>
                  <span style={{ color: '#22c55e' }}>●</span>
                </div>
              </div>
            </div>
          )}
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
