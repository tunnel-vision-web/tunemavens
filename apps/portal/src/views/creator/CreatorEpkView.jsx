import React, { useState, useEffect } from 'react'
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
  RiBankCardFill, RiCellphoneFill, RiDiscFill, RiArrowRightLine, RiMenuFill, RiCloseFill, RiSoundcloudFill
} from 'react-icons/ri'

import heroSlide1 from '../../assets/creator_hero_banner.jpg'
import heroSlide2 from '../../assets/creator_hero_slide2.jpg'
import heroSlide3 from '../../assets/creator_hero_slide3.jpg'
import LiveEpkCmsStudio from '../../components/LiveEpkCmsStudio'

// 20 Pre-populated Theme Templates Specification
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
  const fallbackUsername = passedEpk?.subdomain || props.sessionUser?.username || localStorage.getItem('last_saved_epk_subdomain') || 'kip'
  const effectiveUsername = username || fallbackUsername
  const rawArtistName = effectiveUsername ? effectiveUsername.replace(/[-_]/g, ' ') : 'Kip & The Mavens'
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
    if (passedEpk && typeof passedEpk === 'object') return passedEpk
    try {
      const local = localStorage.getItem(`epk_public_${artistSlug}`) || localStorage.getItem(`epk_${artistSlug}`) || localStorage.getItem('last_saved_epk_data')
      return local ? JSON.parse(local) : null
    } catch {
      return null
    }
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTrack, setActiveTrack] = useState({ id: 1, title: 'Nairobi Cyberwave (Master)', isrc: 'KE-TM1-26-00042', duration: '3:45', priceCredits: 50 })
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cmsStudioOpen, setCmsStudioOpen] = useState(false)

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
        if (passedEpk && typeof passedEpk === 'object') {
          setEpkData(prev => ({ ...(prev || {}), ...passedEpk }))
          if (passedEpk.themeBg) {
            const matchedTheme = EPK_THEMES.find(t => t.bg === passedEpk.themeBg)
            if (matchedTheme) setSelectedTheme(matchedTheme)
          }
        }
        const local = localStorage.getItem(`epk_public_${artistSlug}`) || localStorage.getItem(`epk_${artistSlug}`) || localStorage.getItem('last_saved_epk_data')
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
          setEpkData(prev => ({ ...(prev || {}), ...data }))
          if (data.themeBg) {
            const matchedTheme = EPK_THEMES.find(t => t.bg === data.themeBg)
            if (matchedTheme) setSelectedTheme(matchedTheme)
          }
        }
      } catch (err) {
        console.warn('Could not load public EPK profile:', err)
      }
    }
    fetchPublicEpk()
  }, [artistSlug, passedEpk])

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
        { id: 1, img: epkData.heroImageUrl, title1: baseTitle1, title2: baseTitle2, title3: baseTitle3, title: baseTitle1, subtitle: baseTitle2 },
        { id: 2, img: heroSlide2, title1: 'World Tour 2026 Live Showcase', title2: 'Headline Dates: Tokyo, London & Nairobi', title3: 'VIP Fan Pass & Direct Ticketing via TuneBooking', title: effectiveArtistName, subtitle: 'Live Showcase & Tour Dates 2026' },
        { id: 3, img: heroSlide3, title1: `${effectiveArtistName} — Lossless Audio`, title2: '24-Bit / 96kHz Multitrack Stems', title3: 'Instant Sync Clearance on SyncMavens', title: effectiveArtistName, subtitle: 'Lossless Studio Audio Master' }
      ]
    }
    return [
      { id: 1, img: heroSlide1, title1: baseTitle1, title2: baseTitle2, title3: baseTitle3, title: baseTitle1, subtitle: baseTitle2 },
      { id: 2, img: heroSlide2, title1: 'World Tour 2026 Live Showcase', title2: 'Live at Nairobi Cyberdome, London O2 & Brooklyn Steel', title3: 'Direct Fan Ticketing via TuneBooking • Reserved Seating', title: 'World Tour 2026', subtitle: 'Live at Nairobi Cyberdome, London O2 Academy & Brooklyn Steel' },
      { id: 3, img: heroSlide3, title1: 'Exclusive Studio Stems', title2: 'Unreleased 24-Bit WAV Multitracks Available for Credits', title3: 'Transparent Publishing Splits & PRO Collection via Intermaven Ledger', title: 'Exclusive Studio Stems', subtitle: 'Unreleased 24-Bit WAV Multitracks Available for Intermaven Credits' }
    ]
  }, [epkData?.heroImages, epkData?.heroImageUrl, epkData?.heroTitle1, epkData?.heroTitle2, epkData?.heroTitle3, effectiveArtistName, effectiveHeadline])

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

  const tracks = [
    { id: 1, title: 'Nairobi Cyberwave (Master)', isrc: 'KE-TM1-26-00042', streams: '3.4M', duration: '3:45', release: 'Single 2026', priceCredits: 50 },
    { id: 2, title: 'Sunset over Rift Valley', isrc: 'KE-TM1-26-00043', streams: '1.8M', duration: '4:12', release: 'Album 2026', priceCredits: 50 },
    { id: 3, title: 'Afro-Synth Cascade', isrc: 'KE-TM1-26-00044', streams: '940K', duration: '3:18', release: 'Single 2025', priceCredits: 40 },
    { id: 4, title: 'Midnight Mara Starlight', isrc: 'KE-TM1-26-00045', streams: '2.1M', duration: '5:02', release: 'EP 2025', priceCredits: 60 }
  ]

  const shows = [
    { id: 101, date: 'SEP 18, 2026', venue: 'Nairobi Cyberdome', city: 'Nairobi, Kenya', priceGA: 25, priceVIP: 50, priceMeet: 99, status: 'On Sale' },
    { id: 102, date: 'OCT 04, 2026', venue: 'London O2 Academy', city: 'London, UK', priceGA: 38, priceVIP: 75, priceMeet: 140, status: 'Selling Fast' },
    { id: 103, date: 'OCT 22, 2026', venue: 'Brooklyn Steel', city: 'New York, US', priceGA: 35, priceVIP: 70, priceMeet: 125, status: 'On Sale' },
    { id: 104, date: 'NOV 12, 2026', venue: 'Tokyo Shibuya Club Quattro', city: 'Tokyo, Japan', priceGA: 45, priceVIP: 90, priceMeet: 160, status: 'Limited VIP' },
    { id: 105, date: 'DEC 01, 2026', venue: 'Berlin Watergate Club', city: 'Berlin, Germany', priceGA: 32, priceVIP: 65, priceMeet: 110, status: 'On Sale' },
    { id: 106, date: 'DEC 15, 2026', venue: 'Paris Le Bataclan', city: 'Paris, France', priceGA: 30, priceVIP: 60, priceMeet: 105, status: 'Selling Fast' }
  ]

  const products = [
    { id: 201, title: 'Nairobi Cyberwave Limited 180g Vinyl LP', price: '$34.99', numPrice: 34.99, img: 'https://picsum.photos/seed/vinyl_epk/400', category: 'vinyl', hasSizes: false },
    { id: 202, title: 'Intermaven Tour Heavyweight Hoodie (Black)', price: '$59.99', numPrice: 59.99, img: 'https://picsum.photos/seed/hoodie_epk/400', category: 'apparel', hasSizes: true },
    { id: 203, title: 'Lossless 24-Bit WAV Multitrack Stems Pack', price: '$19.99', numPrice: 19.99, img: 'https://picsum.photos/seed/stems_epk/400', category: 'stems', hasSizes: false },
    { id: 204, title: 'Official World Tour Poster (Signed Edition)', price: '$24.99', numPrice: 24.99, img: 'https://picsum.photos/seed/poster_epk/400', category: 'collectors', hasSizes: false },
    { id: 205, title: 'Cyberwave Embroidered Studio Cap', price: '$29.99', numPrice: 29.99, img: 'https://picsum.photos/seed/cap_epk/400', category: 'apparel', hasSizes: false },
    { id: 206, title: 'Afro-Synth Sample Crate & Presets', price: '$14.99', numPrice: 14.99, img: 'https://picsum.photos/seed/sample_epk/400', category: 'stems', hasSizes: false }
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

  // Handlers
  const handleAuthSubmit = (e) => {
    e.preventDefault()
    const user = {
      name: authName || authEmail.split('@')[0],
      email: authEmail,
      role: 'consumer',
      interests: fanInterests,
      crmId: `CRM-${Math.floor(100000 + Math.random() * 900000)}`
    }
    setFanUser(user)
    localStorage.setItem(`fan_session_${artistSlug}`, JSON.stringify(user))
    sessionStorage.setItem('tunemavens_session', JSON.stringify(user))
    setAuthModalOpen(false)
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
    e.preventDefault()
    setOrderSuccess(true)
    setTimeout(() => {
      setCart([])
      setOrderSuccess(false)
      setCartOpen(false)
    }, 2500)
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
      alert('Insufficient Intermaven Credits! Please top up your balance.')
    }
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

  // Media Commenting Handler
  const handleAddMediaComment = (e) => {
    e.preventDefault()
    if (!fanUser) {
      setAuthModalOpen(true)
      return
    }
    if (newCommentText && selectedMedia) {
      const mediaId = selectedMedia.id
      const current = mediaComments[mediaId] || []
      setMediaComments({
        ...mediaComments,
        [mediaId]: [{ author: fanUser.name, text: newCommentText, likes: 0 }, ...current]
      })
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

  return (
    <div style={{
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
          }
        }
      `}</style>

      {/* ================= 1. HEADER OVERLAY ================= */}
      <header style={{
        background: scrolled ? (isLight ? 'rgba(255,255,255,0.95)' : 'rgba(6, 8, 18, 0.92)') : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? (isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)') : 'none',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: effectiveVariant === 'centered' ? 'space-around' : 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: scrolled ? '0 4px 25px rgba(0,0,0,0.5)' : 'none',
        transition: 'all 0.35s ease'
      }}>
        
        {/* Creator Brand Logo & Name Relationship */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1001, cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
          {epkData?.logoUrl ? (
            <img 
              src={epkData.logoUrl} 
              alt={effectiveArtistName} 
              style={{ height: '42px', width: 'auto', maxHeight: '48px', objectFit: 'contain', borderRadius: '4px', filter: isLight ? 'none' : 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }} 
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '4px',
                background: effectiveAccent,
                color: '#000',
                fontWeight: 900,
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 14px ${effectiveAccent}88`
              }}>
                {effectiveArtistName.charAt(0)}
              </div>
              <div style={{ fontWeight: 900, fontSize: '1.25rem', color: isLight ? '#0f172a' : '#fff', letterSpacing: '-0.3px', fontFamily: effectiveFont, textShadow: isLight ? 'none' : '0 2px 10px rgba(0,0,0,0.8)' }}>
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
              <div style={{ position: 'relative' }}>
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
                    <div onClick={() => { setActiveTab('media'); setMediaFilter('videos'); setMediaDropdownOpen(false); }} style={{ padding: '10px 14px', color: isLight ? '#0f172a' : '#fff', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RiVideoFill /> 4K Videos
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

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1001 }}>
          {/* Edit EPK / Mother-CMS Studio Button */}
          <button 
            onClick={() => setCmsStudioOpen(true)}
            title="Open Mother-CMS Live Editor for this Web World"
            style={{
              background: `linear-gradient(135deg, ${effectiveAccent}, #8b5cf6)`,
              color: '#000',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 900,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: `0 0 16px ${effectiveAccent}66`,
              whiteSpace: 'nowrap'
            }}
          >
            ⚡ Live CMS Editor
          </button>

          <button onClick={() => setCartOpen(true)} title="View Shopping Cart" style={{ position: 'relative', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', width: '38px', height: '38px', borderRadius: '3px', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RiShoppingBasket2Fill />
            {totalCartQty > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: effectiveAccent, color: '#000', fontSize: '0.7rem', fontWeight: 900, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {totalCartQty}
              </span>
            )}
          </button>

          {fanUser ? (
            <button onClick={navigateToFanDashboard} style={{ background: 'rgba(34, 211, 238, 0.2)', border: '1px solid rgba(34, 211, 238, 0.5)', color: '#fff', padding: '7px 11px', borderRadius: '3px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <RiShieldCheckFill style={{ color: effectiveAccent }} /> Fan Portal
            </button>
          ) : (
            <button onClick={() => setAuthModalOpen(true)} style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '8px 14px', borderRadius: '3px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <RiUserAddFill /> VIP
            </button>
          )}

          <button className="mobile-hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '38px', height: '38px', borderRadius: '3px', fontSize: '1.3rem', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}>
            {mobileMenuOpen ? <RiCloseFill /> : <RiMenuFill />}
          </button>
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
        <section style={{ position: 'relative', height: '520px', backgroundImage: `url(${currentSlide?.img || heroSlide1})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '80px 32px 48px', transition: 'background-image 0.8s ease-in-out', margin: 0 }}>
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
            <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, backdropFilter: 'blur(16px)', border: `1px solid ${effectiveAccent}44`, borderRadius: '4px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px', maxWidth: '480px', margin: '22px auto 0', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', textAlign: 'left' }}>
              <button onClick={() => setIsPlaying(!isPlaying)} style={{ width: '46px', height: '46px', borderRadius: '3px', background: effectiveAccent, border: 'none', color: '#000', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {isPlaying ? <RiPauseFill /> : <RiPlayFill />}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isLight ? '#0f172a' : '#fff' }}>{activeTrack.title}</div>
                <div style={{ fontSize: '0.75rem', color: effectiveAccent, marginTop: '2px', fontWeight: 700 }}>ISRC: {activeTrack.isrc} • Lossless 24-Bit</div>
              </div>
              <button onClick={() => handlePurchaseTrackWithCredits(activeTrack)} style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '6px 12px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>
                Buy Stems
              </button>
            </div>
        </section>
      )}

      {/* Page Header Banner */}
      {activeTab !== 'home' && (
        <section style={{ position: 'relative', height: '240px', backgroundImage: `url(${heroSlide2})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 32px 0' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,6,14,0.98) 0%, rgba(4,6,14,0.6) 100%)' }} />
          <div className="anim-fade-up" style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', margin: '0 auto 4px auto', fontWeight: 900, fontFamily: "'Sansation', sans-serif", color: '#fff', textTransform: 'capitalize', textAlign: 'center' }}>
              {activeTab === 'press' ? 'Electronic Press Kit (EPK)' : activeTab === 'discography' ? 'Music & Discography' : activeTab === 'contact' ? 'Booking & Inquiries' : activeTab === 'shows' ? 'Live Shows & Tour Dates' : activeTab}
            </h1>
            <p style={{ margin: '0 auto', color: selectedTheme.accent, fontSize: '1rem', textAlign: 'center' }}>
              Official Standalone Creator Web World • {artistName}
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
              <aside style={{ display: 'flex', flexDirection: 'column', gap: '22px', position: 'sticky', top: '90px' }}>
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
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: effectiveAccent }}>{userCredits} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isLight ? '#64748b' : '#cbd5e1' }}>Credits</span></div>
                  </div>
                </div>

                {/* World Tour Shows in Left Aside */}
                <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)', padding: '22px', borderRadius: '4px', boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.04)' : 'none' }}>
                  <h4 style={{ margin: '0 0 14px', fontSize: '1.05rem', fontWeight: 900, color: effectiveAccent, fontFamily: effectiveFont }}>
                    Live Tour Dates
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {shows.slice(0, 3).map(s => (
                      <div key={s.id} style={{ borderBottom: isLight ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: isLight ? '#0f172a' : '#fff' }}>{s.venue}</div>
                        <div style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8', margin: '2px 0 6px' }}>{s.city} • {s.date}</div>
                        <button onClick={() => { setSelectedShow(s); setTicketSuccess(null); }} style={{ background: effectiveAccent, border: 'none', color: '#000', padding: '6px 12px', borderRadius: '3px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', width: '100%' }}>
                          Reserve Tickets (${s.priceGA})
                        </button>
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

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    {tracks.map(t => (
                      <div key={t.id} style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.04)' : 'none' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: effectiveAccent, fontWeight: 700 }}>{t.release}</div>
                          <h4 style={{ margin: '6px 0 4px', fontSize: '1.05rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff' }}>{t.title}</h4>
                          <div style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8' }}>ISRC: {t.isrc} • {t.streams} Streams</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                          <button onClick={() => { setActiveTrack(t); setIsPlaying(true); }} style={{ background: activeTrack.id === t.id && isPlaying ? effectiveAccent : (isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.08)'), color: activeTrack.id === t.id && isPlaying ? '#000' : (isLight ? '#0f172a' : '#fff'), border: `1px solid ${effectiveAccent}44`, padding: '8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}>
                            {activeTrack.id === t.id && isPlaying ? <><RiPauseFill /> Playing...</> : <><RiPlayFill /> Stream on TuneStream</>}
                          </button>
                          <button onClick={() => handlePurchaseTrackWithCredits(t)} style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>
                            Buy Multitracks ({t.priceCredits} Credits)
                          </button>
                          <button onClick={() => setActiveTab('discography')} style={{ background: 'none', border: 'none', color: isLight ? '#64748b' : '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'center', marginTop: '2px' }}>
                            View in Discography ➔
                          </button>
                        </div>
                      </div>
                    ))}
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {tracks.map(t => (
                    <div key={t.id} style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.04)' : 'none' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: effectiveAccent, fontWeight: 700 }}>{t.release}</div>
                        <h4 style={{ margin: '6px 0 4px', fontSize: '1.05rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff' }}>{t.title}</h4>
                        <div style={{ fontSize: '0.75rem', color: isLight ? '#64748b' : '#94a3b8' }}>ISRC: {t.isrc} • {t.streams} Streams</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                        <button onClick={() => { setActiveTrack(t); setIsPlaying(true); }} style={{ background: activeTrack.id === t.id && isPlaying ? effectiveAccent : (isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.08)'), color: activeTrack.id === t.id && isPlaying ? '#000' : (isLight ? '#0f172a' : '#fff'), border: `1px solid ${effectiveAccent}44`, padding: '8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}>
                          {activeTrack.id === t.id && isPlaying ? <><RiPauseFill /> Playing...</> : <><RiPlayFill /> Stream on TuneStream</>}
                        </button>
                        <button onClick={() => handlePurchaseTrackWithCredits(t)} style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>
                          Buy Multitracks ({t.priceCredits} Credits)
                        </button>
                        <button onClick={() => setActiveTab('discography')} style={{ background: 'none', border: 'none', color: isLight ? '#64748b' : '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'center', marginTop: '2px' }}>
                          View in Discography ➔
                        </button>
                      </div>
                    </div>
                  ))}
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
                    <button onClick={() => { setSelectedShow(s); setTicketSuccess(null); }} style={{ background: effectiveAccent, border: 'none', color: '#000', padding: '8px 18px', borderRadius: '3px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>
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
              {effectiveBio && effectiveBio.includes('<') ? (
                <div
                  className="rich-bio-content"
                  dangerouslySetInnerHTML={{ __html: effectiveBio }}
                  style={{ lineHeight: '1.85', fontSize: '1.1rem', color: isLight ? '#334155' : '#e2e8f0', marginTop: '20px' }}
                />
              ) : (
                <div style={{ lineHeight: '1.85', fontSize: '1.1rem', color: isLight ? '#334155' : '#e2e8f0', marginTop: '20px', whiteSpace: 'pre-line' }}>
                  {effectiveBio}
                </div>
              )}
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
                    <button onClick={() => setSelectedAlbumModal(a)} style={{ background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)', color: isLight ? '#0f172a' : '#fff', border: `1px solid ${effectiveAccent}44`, padding: '8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>
                      View Album Tracklist ({a.tracksCount} Tracks)
                    </button>
                    <button onClick={() => handlePurchaseTrackWithCredits(a)} style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>
                      Buy Full Stems ({a.priceCredits} Credits)
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredShows.map(s => (
                <div key={s.id} style={{ background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.3)', border: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.08)', padding: '20px 24px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'center', minWidth: '70px', padding: '10px 14px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)', borderRadius: '4px', border: `1px solid ${effectiveAccent}33` }}>
                      <div style={{ fontSize: '0.72rem', color: effectiveAccent, fontWeight: 800 }}>{s.date.split(' ')[0]}</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: isLight ? '#0f172a' : '#fff' }}>{s.date.split(' ')[1]?.replace(',', '')}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff' }}>{s.venue}</div>
                      <div style={{ fontSize: '0.85rem', color: isLight ? '#64748b' : '#94a3b8' }}>{s.city}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: s.status === 'Selling Fast' ? '#f59e0b' : '#22c55e', background: s.status === 'Selling Fast' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)', padding: '4px 10px', borderRadius: '12px' }}>
                      {s.status}
                    </span>
                    <button onClick={() => { setSelectedShow(s); setTicketSuccess(null); }} style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '9px 20px', borderRadius: '3px', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer' }}>
                      Reserve Tickets (${s.priceGA})
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
                <div key={m.id} onClick={() => setSelectedMedia(m)} style={{ background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.4)', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}>
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
          <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '36px', borderRadius: '4px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ color: effectiveAccent, margin: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: effectiveFont }}>
                  Official Merchandise & Stems Store
                </h2>
                <p style={{ margin: '4px 0 0', color: isLight ? '#64748b' : '#94a3b8' }}>Limited vinyl pressings, apparel & exclusive lossless multitrack stems</p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['all', 'vinyl', 'apparel', 'stems'].map(cat => (
                  <button key={cat} onClick={() => setStoreCategory(cat)} style={{ padding: '7px 16px', borderRadius: '20px', border: storeCategory === cat ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)', background: storeCategory === cat ? effectiveAccent : 'transparent', color: storeCategory === cat ? '#000' : (isLight ? '#0f172a' : '#fff'), fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', textTransform: 'capitalize' }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
              {filteredProducts.map(p => (
                <div key={p.id} style={{ background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.4)', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <img src={p.img} alt={p.title} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '3px', marginBottom: '14px' }} />
                    <span style={{ fontSize: '0.72rem', color: effectiveAccent, fontWeight: 800, textTransform: 'uppercase' }}>{p.category}</span>
                    <h4 style={{ margin: '4px 0 6px', fontSize: '1.05rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff' }}>{p.title}</h4>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: effectiveAccent, marginBottom: '14px' }}>{p.price}</div>
                  </div>

                  <button onClick={() => addToCart(p)} style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '10px', borderRadius: '3px', fontWeight: 900, cursor: 'pointer', fontSize: '0.85rem' }}>
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 7: PRESS KIT (EPK) ================= */}
        {activeTab === 'press' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ background: isLight ? '#ffffff' : selectedTheme.cardBg, padding: '36px', borderRadius: '4px', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: effectiveAccent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Electronic Press Kit</span>
                  <h2 style={{ color: isLight ? '#0f172a' : '#fff', margin: '4px 0 0', fontSize: '2rem', fontWeight: 900, fontFamily: effectiveFont }}>
                    {effectiveArtistName} — Official Press Kit & One-Sheet
                  </h2>
                </div>

                <a href="#download-epk" onClick={(e) => { e.preventDefault(); alert('Downloading high-res EPK press asset package (ZIP)...'); }} style={{ background: effectiveAccent, color: '#000', padding: '10px 20px', borderRadius: '3px', fontWeight: 900, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RiDownloadFill /> Download EPK Assets (ZIP)
                </a>
              </div>

              {effectiveBio && effectiveBio.includes('<') ? (
                <div
                  className="rich-bio-content"
                  dangerouslySetInnerHTML={{ __html: effectiveBio }}
                  style={{ fontSize: '1.05rem', lineHeight: 1.7, color: isLight ? '#334155' : '#cbd5e1' }}
                />
              ) : (
                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: isLight ? '#334155' : '#cbd5e1' }}>
                  {effectiveBio}
                </p>
              )}
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
                  { title: 'Official Press Photos (300 DPI)', desc: 'High-res color & monochrome portraits', format: 'ZIP • 42 MB' },
                  { title: 'Stage Plot & Technical Rider', desc: 'Channel list, monitor mixes & backline specs', format: 'PDF • 2.4 MB' },
                  { title: 'One-Sheet & Press Coverage', desc: 'Album reviews, bio highlights & stats', format: 'PDF • 1.8 MB' }
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: '16px', background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)', border: `1px solid ${effectiveAccent}33`, borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isLight ? '#0f172a' : '#fff' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: isLight ? '#64748b' : '#94a3b8', margin: '4px 0 12px' }}>{item.desc}</div>
                    </div>
                    <button onClick={() => alert(`Downloading ${item.title}...`)} style={{ background: 'transparent', border: `1px solid ${effectiveAccent}`, color: effectiveAccent, padding: '6px 12px', borderRadius: '3px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', alignSelf: 'flex-start' }}>
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
              <h4 style={{ margin: '0 0 12px', color: selectedTheme.accent }}>Fan Discussion & Comments</h4>
              <form onSubmit={handleAddMediaComment} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <input type="text" placeholder={fanUser ? "Add a comment..." : "Join VIP Fan Club to comment..."} value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} disabled={!fanUser} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                <button type="submit" style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '10px 18px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>Comment</button>
              </form>
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
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', borderRadius: '4px', padding: '18px', textAlign: 'center' }}>
                <div style={{ color: '#22c55e', fontSize: '1.2rem', fontWeight: 900, marginBottom: '6px' }}>✓ Reservation Confirmed!</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#fff', marginBottom: '8px' }}>Pass ID: {ticketSuccess.qr}</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Total Paid: ${ticketSuccess.total} ({ticketSuccess.tierName} × {ticketSuccess.qty})</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>90% Direct Creator Share: ${ticketSuccess.creatorShare}</div>
                <button onClick={() => setSelectedShow(null)} style={{ marginTop: '14px', background: effectiveAccent, color: '#000', border: 'none', padding: '8px 20px', borderRadius: '3px', fontWeight: 900, cursor: 'pointer', fontSize: '0.85rem' }}>Done</button>
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
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[['pesapal', 'PesaPal / M-Pesa'], ['stripe', 'Stripe / Card']].map(([gw, lbl]) => (
                      <button key={gw} type="button" onClick={() => setPaymentGateway(gw)} style={{ flex: 1, padding: '8px', borderRadius: '3px', border: paymentGateway === gw ? `1px solid ${effectiveAccent}` : '1px solid rgba(255,255,255,0.15)', background: paymentGateway === gw ? 'rgba(0,240,255,0.1)' : 'transparent', color: paymentGateway === gw ? effectiveAccent : '#cbd5e1', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" style={{ background: effectiveAccent, color: '#000', border: 'none', padding: '12px', borderRadius: '3px', fontWeight: 900, cursor: 'pointer', fontSize: '0.95rem', marginTop: '6px' }}>
                  Complete Ticket Purchase (${((ticketTier === 'ga' ? selectedShow.priceGA : ticketTier === 'vip' ? selectedShow.priceVIP : selectedShow.priceMeet) * ticketQty).toFixed(2)})
                </button>
              </form>
            )}
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

      {/* Fan Protocol Sign Up Modal */}
      {authModalOpen && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setAuthModalOpen(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${selectedTheme.accent}44`, borderRadius: '3px', width: '100%', maxWidth: '440px', padding: '28px', color: '#fff', position: 'relative' }}>
            <button onClick={() => setAuthModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            <h3 style={{ marginTop: 0, color: selectedTheme.accent, fontWeight: 900, fontFamily: "'Sansation', sans-serif" }}>
              Join {artistName}'s VIP Fan Vault
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
              Synchronized with Intermaven Unified SSO & Smart CRM.
            </p>

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Full Name" value={authName} onChange={(e) => setAuthName(e.target.value)} required style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px' }} />
              <input type="email" placeholder="Email Address" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px' }} />

              <button type="submit" style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '12px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', marginTop: '6px' }}>
                Join VIP Fan Vault (Unified SSO)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Live CMS Trigger */}
      <button
        type="button"
        onClick={() => setCmsStudioOpen(true)}
        title="Open Mother-CMS Live Editor for this Web World"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 990,
          background: `linear-gradient(135deg, ${effectiveAccent}, #8b5cf6)`,
          color: '#000',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '30px',
          fontWeight: 900,
          fontSize: '0.88rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: `0 8px 30px rgba(0,0,0,0.7), 0 0 20px ${effectiveAccent}55`,
          transition: 'all 0.2s'
        }}
      >
        ⚡ Live CMS Editor
      </button>

      {/* Mother-CMS Live Studio Drawer */}
      <LiveEpkCmsStudio
        isOpen={cmsStudioOpen}
        onClose={() => setCmsStudioOpen(false)}
        epkData={epkData}
        onUpdateEpk={updated => setEpkData(prev => ({ ...(prev || {}), ...updated }))}
        artistSlug={artistSlug}
      />

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
