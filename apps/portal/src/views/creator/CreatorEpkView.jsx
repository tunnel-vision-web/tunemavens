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
  RiBankCardFill, RiCellphoneFill, RiDiscFill, RiArrowRightLine, RiMenuFill, RiCloseFill
} from 'react-icons/ri'

import heroSlide1 from '../../assets/creator_hero_banner.jpg'
import heroSlide2 from '../../assets/creator_hero_slide2.jpg'
import heroSlide3 from '../../assets/creator_hero_slide3.jpg'

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

export default function CreatorEpkView() {
  const { username } = useParams()
  const navigate = useNavigate()
  const rawArtistName = username ? username.replace(/[-_]/g, ' ') : 'Kip & The Mavens'
  const artistName = rawArtistName.charAt(0).toUpperCase() + rawArtistName.slice(1)
  const artistSlug = (username || 'kip').toLowerCase().replace(/[^a-z0-9]/g, '')

  // Navigation & Sticky Header State (Transparent overlay over Hero -> Background appears only after scroll)
  const [activeTab, setActiveTab] = useState('home')
  const [mediaFilter, setMediaFilter] = useState('all')
  const [selectedTheme] = useState(EPK_THEMES[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTrack, setActiveTrack] = useState({ id: 1, title: 'Nairobi Cyberwave (Master)', isrc: 'KE-TM1-26-00042', duration: '3:45', priceCredits: 50 })
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Scroll listener: Header background color appears ONLY after scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) setScrolled(true)
      else setScrolled(false)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hero Slides Carousel
  const heroSlides = [
    { id: 1, img: heroSlide1, title: artistName, subtitle: 'Official Standalone Creator Web World • Lossless Audio & Intermaven Split Engine' },
    { id: 2, img: heroSlide2, title: 'World Tour 2026', subtitle: 'Live at Nairobi Cyberdome, London O2 Academy & Brooklyn Steel' },
    { id: 3, img: heroSlide3, title: 'Exclusive Studio Stems', subtitle: 'Unreleased 24-Bit WAV Multitracks Available for Intermaven Credits' }
  ]
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  // Media Dropdown Toggle
  const [mediaDropdownOpen, setMediaDropdownOpen] = useState(false)

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

  const mediaItems = [
    { id: 301, type: 'video', title: `${artistName} — Nairobi Cyberwave (Official 4K Music Video)`, thumbnail: 'https://picsum.photos/seed/yt_vid1/600/340', views: '1.2M views' },
    { id: 302, type: 'gallery', title: 'Live at Nairobi Cyberdome Stage Highlight', thumbnail: 'https://picsum.photos/seed/gal1/600/340', views: 'Photo Gallery' },
    { id: 303, type: 'video', title: 'Live at SyncMavens Vault (Full Concert 4K)', thumbnail: 'https://picsum.photos/seed/yt_vid2/600/340', views: '840K views' },
    { id: 304, type: 'gallery', title: 'Behind the Scenes: Recording Stems at Intermaven Studio', thumbnail: 'https://picsum.photos/seed/gal2/600/340', views: 'Photo Gallery' },
    { id: 305, type: 'video', title: 'Inside the Synthesizer Soundscapes', thumbnail: 'https://picsum.photos/seed/yt_vid3/600/340', views: '320K views' },
    { id: 306, type: 'gallery', title: 'London O2 Backstage Session', thumbnail: 'https://picsum.photos/seed/gal3/600/340', views: 'Photo Gallery' }
  ]

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
      background: selectedTheme.bg,
      color: '#ffffff',
      fontFamily: "'Sansation', sans-serif",
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

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .mobile-hamburger-btn {
          display: none;
        }

        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
      `}</style>

      {/* ================= 1. HEADER OVERLAY (Transparent over Image -> Background appears only after scroll) ================= */}
      <header style={{
        background: scrolled ? 'rgba(6, 8, 18, 0.90)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: scrolled ? '0 4px 25px rgba(0,0,0,0.7)' : 'none',
        transition: 'all 0.35s ease'
      }}>
        
        {/* Creator Brand Logo over Image */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1001 }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '3px',
            background: selectedTheme.accent,
            color: '#000',
            fontWeight: 900,
            fontSize: '1.3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 14px ${selectedTheme.accent}88`
          }}>
            {artistName.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.3rem', color: '#fff', letterSpacing: '-0.3px', fontFamily: "'Sansation', sans-serif", textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              {artistName}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
              {artistSlug}.tunemavens.com
            </div>
          </div>
        </div>

        {/* Spaced Desktop Top Menu Navigation (No Discography at top level) */}
        <nav className="desktop-nav">
          
          <button
            onClick={() => setActiveTab('home')}
            style={{
              background: activeTab === 'home' ? selectedTheme.accent : 'transparent',
              color: activeTab === 'home' ? '#000' : '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '3px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              textShadow: activeTab === 'home' ? 'none' : '0 2px 8px rgba(0,0,0,0.8)'
            }}
          >
            <RiHomeFill /> Home
          </button>

          <button
            onClick={() => setActiveTab('bio')}
            style={{
              background: activeTab === 'bio' ? selectedTheme.accent : 'transparent',
              color: activeTab === 'bio' ? '#000' : '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '3px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              textShadow: activeTab === 'bio' ? 'none' : '0 2px 8px rgba(0,0,0,0.8)'
            }}
          >
            <RiUserFill /> Bio
          </button>

          <button
            onClick={() => setActiveTab('shows')}
            style={{
              background: activeTab === 'shows' ? selectedTheme.accent : 'transparent',
              color: activeTab === 'shows' ? '#000' : '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '3px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              textShadow: activeTab === 'shows' ? 'none' : '0 2px 8px rgba(0,0,0,0.8)'
            }}
          >
            <RiCalendarEventFill /> Shows
          </button>

          {/* Media Menu Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMediaDropdownOpen(!mediaDropdownOpen)}
              style={{
                background: (activeTab === 'media' || activeTab === 'discography') ? selectedTheme.accent : 'transparent',
                color: (activeTab === 'media' || activeTab === 'discography') ? '#000' : '#ffffff',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '3px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                textShadow: (activeTab === 'media' || activeTab === 'discography') ? 'none' : '0 2px 8px rgba(0,0,0,0.8)'
              }}
            >
              <RiVideoFill /> Media <RiArrowDownSLine />
            </button>

            {mediaDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '6px',
                background: '#0a0d18',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '3px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                minWidth: '180px',
                zIndex: 1100,
                overflow: 'hidden'
              }}>
                <div 
                  onClick={() => { setActiveTab('media'); setMediaFilter('all'); setMediaDropdownOpen(false); }}
                  style={{ padding: '10px 14px', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <RiVideoFill /> All Media
                </div>
                <div 
                  onClick={() => { setActiveTab('discography'); setMediaDropdownOpen(false); }}
                  style={{ padding: '10px 14px', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <RiDiscFill /> Discography & Albums
                </div>
                <div 
                  onClick={() => { setActiveTab('media'); setMediaFilter('gallery'); setMediaDropdownOpen(false); }}
                  style={{ padding: '10px 14px', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <RiImageFill /> Photo Gallery
                </div>
                <div 
                  onClick={() => { setActiveTab('media'); setMediaFilter('videos'); setMediaDropdownOpen(false); }}
                  style={{ padding: '10px 14px', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <RiVideoFill /> 4K Videos
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('store')}
            style={{
              background: activeTab === 'store' ? selectedTheme.accent : 'transparent',
              color: activeTab === 'store' ? '#000' : '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '3px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              textShadow: activeTab === 'store' ? 'none' : '0 2px 8px rgba(0,0,0,0.8)'
            }}
          >
            <RiShoppingBagFill /> Store
          </button>

          <button
            onClick={() => setActiveTab('press')}
            style={{
              background: activeTab === 'press' ? selectedTheme.accent : 'transparent',
              color: activeTab === 'press' ? '#000' : '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '3px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              textShadow: activeTab === 'press' ? 'none' : '0 2px 8px rgba(0,0,0,0.8)'
            }}
          >
            <RiFileTextFill /> Press Kit
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            style={{
              background: activeTab === 'contact' ? selectedTheme.accent : 'transparent',
              color: activeTab === 'contact' ? '#000' : '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '3px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              textShadow: activeTab === 'contact' ? 'none' : '0 2px 8px rgba(0,0,0,0.8)'
            }}
          >
            <RiMailFill /> Contact
          </button>
        </nav>

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1001 }}>
          
          {/* Cart ICON ONLY Button with Badge Counter */}
          <button
            onClick={() => setCartOpen(true)}
            title="View Shopping Cart"
            style={{
              position: 'relative',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff',
              width: '42px',
              height: '42px',
              borderRadius: '3px',
              fontSize: '1.3rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
          >
            <RiShoppingBasket2Fill />
            {totalCartQty > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: selectedTheme.accent,
                color: '#000',
                fontSize: '0.7rem',
                fontWeight: 900,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 8px ${selectedTheme.accent}`
              }}>
                {totalCartQty}
              </span>
            )}
          </button>

          {/* Fan Backend Access */}
          {fanUser ? (
            <button 
              onClick={navigateToFanDashboard}
              style={{ background: 'rgba(34, 211, 238, 0.2)', border: '1px solid rgba(34, 211, 238, 0.5)', color: '#fff', padding: '8px 12px', borderRadius: '3px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RiShieldCheckFill style={{ color: selectedTheme.accent }} /> Fan Portal
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              style={{
                background: selectedTheme.accent,
                color: '#000',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '3px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiUserAddFill /> VIP Sign In
            </button>
          )}

          {/* Right Mobile Hamburger Toggle Button */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              width: '42px',
              height: '42px',
              borderRadius: '3px',
              fontSize: '1.4rem',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {mobileMenuOpen ? <RiCloseFill /> : <RiMenuFill />}
          </button>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          background: 'rgba(6, 8, 18, 0.98)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${selectedTheme.accent}44`,
          padding: '24px',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {['home', 'bio', 'shows', 'media', 'store', 'press', 'contact'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }}
              style={{
                background: activeTab === tab ? selectedTheme.accent : 'transparent',
                color: activeTab === tab ? '#000' : '#fff',
                border: 'none',
                padding: '12px',
                borderRadius: '3px',
                fontWeight: 800,
                textAlign: 'left',
                fontSize: '1rem',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'press' ? 'Electronic Press Kit (EPK)' : tab}
            </button>
          ))}
          <button
            onClick={() => { setActiveTab('discography'); setMobileMenuOpen(false); }}
            style={{
              background: activeTab === 'discography' ? selectedTheme.accent : 'transparent',
              color: activeTab === 'discography' ? '#000' : '#fff',
              border: 'none',
              padding: '12px',
              borderRadius: '3px',
              fontWeight: 800,
              textAlign: 'left',
              fontSize: '1rem'
            }}
          >
            Discography & Albums
          </button>
        </div>
      )}

      {/* ================= 2. HERO CAROUSEL ================= */}
      {activeTab === 'home' && (
        <section style={{
          position: 'relative',
          height: '520px',
          backgroundImage: `url(${heroSlides[currentSlideIndex].img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '80px 32px 48px',
          transition: 'background-image 0.8s ease-in-out',
          margin: 0
        }}>
          {/* Dark Overlay Gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,6,14,0.98) 0%, rgba(4,6,14,0.40) 60%, rgba(4,6,14,0.65) 100%)' }} />

          {/* Carousel Controls */}
          <button 
            onClick={() => setCurrentSlideIndex(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
            style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '40px', height: '40px', borderRadius: '3px', cursor: 'pointer', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <RiArrowLeftSLine style={{ fontSize: '1.5rem' }} />
          </button>
          <button 
            onClick={() => setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length)}
            style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '40px', height: '40px', borderRadius: '3px', cursor: 'pointer', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <RiArrowRightSLine style={{ fontSize: '1.5rem' }} />
          </button>
          
          <div className="anim-fade-up" style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ fontSize: '4.5rem', margin: '0 auto', fontWeight: 900, fontFamily: "'Sansation', sans-serif", letterSpacing: '-1px', color: '#fff', textShadow: '0 4px 24px rgba(0,0,0,0.9)', textAlign: 'center' }}>
              {heroSlides[currentSlideIndex].title}
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '700px', margin: '12px auto 0', lineHeight: 1.5, textAlign: 'center' }}>
              {heroSlides[currentSlideIndex].subtitle}
            </p>

            {/* Audio Player Bar */}
            <div style={{
              background: selectedTheme.cardBg,
              backdropFilter: 'blur(16px)',
              border: `1px solid ${selectedTheme.accent}44`,
              borderRadius: '3px',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              maxWidth: '460px',
              margin: '24px auto 0',
              boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
              textAlign: 'left'
            }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{ width: '46px', height: '46px', borderRadius: '3px', background: selectedTheme.accent, border: 'none', color: '#000', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                {isPlaying ? <RiPauseFill /> : <RiPlayFill />}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{activeTrack.title}</div>
                <div style={{ fontSize: '0.75rem', color: selectedTheme.accent, marginTop: '2px' }}>ISRC: {activeTrack.isrc} • Lossless 24-Bit</div>
              </div>
              <button 
                onClick={() => handlePurchaseTrackWithCredits(activeTrack)}
                style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '6px 12px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
              >
                Buy Multitracks (50 Credits)
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Page Header Banner */}
      {activeTab !== 'home' && (
        <section style={{
          position: 'relative',
          height: '240px',
          backgroundImage: `url(${heroSlide2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '60px 32px 0'
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,6,14,0.98) 0%, rgba(4,6,14,0.6) 100%)' }} />
          <div className="anim-fade-up" style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3.2rem', margin: '0 auto', fontWeight: 900, fontFamily: "'Sansation', sans-serif", color: '#fff', textTransform: 'capitalize', textAlign: 'center' }}>
              {activeTab === 'press' ? 'Electronic Press Kit (EPK)' : activeTab}
            </h1>
            <p style={{ margin: '6px auto 0', color: selectedTheme.accent, fontSize: '1.05rem', textAlign: 'center' }}>
              Official Standalone Creator Web World • {artistName}
            </p>
          </div>
        </section>
      )}

      {/* ================= 3. MAIN BODY CONTENT ================= */}
      <main style={{ flex: 1, padding: '40px 32px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        
        {/* ================= TAB 1: HOME ================= */}
        {activeTab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }}>
            
            {/* TuneStream Catalog & Call To Action to View Discography */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: selectedTheme.accent, margin: 0, fontFamily: "'Sansation', sans-serif" }}>
                    Featured Singles & Lossless Audio
                  </h2>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
                    Balance: <strong style={{ color: selectedTheme.accent }}>{userCredits} Intermaven Credits</strong>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('discography')}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${selectedTheme.accent}`,
                    color: selectedTheme.accent,
                    padding: '8px 18px',
                    borderRadius: '3px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
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
                  <div key={t.id} style={{ background: selectedTheme.cardBg, border: '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '3px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: selectedTheme.accent, fontWeight: 700 }}>{t.release}</div>
                      <h4 style={{ margin: '6px 0 4px', fontSize: '1.05rem', fontWeight: 800 }}>{t.title}</h4>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ISRC: {t.isrc} • {t.streams} Streams</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                      <button 
                        onClick={() => { setActiveTrack(t); setIsPlaying(true); }}
                        style={{ background: activeTrack.id === t.id && isPlaying ? selectedTheme.accent : 'rgba(255,255,255,0.08)', color: activeTrack.id === t.id && isPlaying ? '#000' : '#fff', border: `1px solid ${selectedTheme.accent}44`, padding: '8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}
                      >
                        {activeTrack.id === t.id && isPlaying ? <><RiPauseFill /> Playing...</> : <><RiPlayFill /> Stream on TuneStream</>}
                      </button>
                      <button 
                        onClick={() => handlePurchaseTrackWithCredits(t)}
                        style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        Buy Multitracks ({t.priceCredits} Credits)
                      </button>
                      <button 
                        onClick={() => setActiveTab('discography')}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'center', marginTop: '2px' }}
                      >
                        View in Discography ➔
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Tour Spotlight */}
            <div style={{ background: selectedTheme.cardBg, border: '1px solid rgba(255,255,255,0.1)', padding: '28px', borderRadius: '3px' }}>
              <h3 style={{ marginTop: 0, fontSize: '1.4rem', fontWeight: 900, color: selectedTheme.accent, fontFamily: "'Sansation', sans-serif", textAlign: 'center' }}>
                Featured World Tour Dates
              </h3>
              {shows.slice(0, 3).map(s => (
                <div key={s.id} style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{s.venue}</div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{s.city} • {s.date}</div>
                  </div>
                  <button 
                    onClick={() => { setSelectedShow(s); setTicketSuccess(null); }}
                    style={{ background: selectedTheme.accent, border: 'none', color: '#000', padding: '8px 18px', borderRadius: '3px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Reserve Tickets (From ${s.priceGA})
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= TAB 2: BIO ================= */}
        {activeTab === 'bio' && (
          <div style={{ background: selectedTheme.cardBg, padding: '36px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ color: selectedTheme.accent, marginTop: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: "'Sansation', sans-serif", textAlign: 'center' }}>
              Biography & Heritage Lineage
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#e2e8f0', marginTop: '20px' }}>
              <b>{artistName}</b> is a pioneering force within the modern electronic and global fusion scene. Synthesizing traditional East African acoustic arrangements with cutting-edge cyber-synth soundscapes, {artistName} has captivated international audiences across Nairobi, London, Berlin, and New York.
            </p>
            <p style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#cbd5e1' }}>
              With over 8 million cumulative streams on <b>TuneStream</b> and verified splits registered on the <b>Intermaven Shared Ledger</b>, {artistName} represents a new generation of independent creators controlling their master recordings, sync placements, and direct fan CRM relationships.
            </p>
          </div>
        )}

        {/* ================= TAB 3: DISCOGRAPHY ================= */}
        {activeTab === 'discography' && (
          <div style={{ background: selectedTheme.cardBg, padding: '36px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ color: selectedTheme.accent, margin: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: "'Sansation', sans-serif" }}>
                  Complete Discography & Album Catalog
                </h2>
                <p style={{ margin: '4px 0 0', color: '#94a3b8' }}>High-density album grid with paginated access & multitrack downloads</p>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', width: '280px' }}>
                <RiSearchLine style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text"
                  placeholder="Search albums or year..."
                  value={discographySearch}
                  onChange={(e) => { setDiscographySearch(e.target.value); setDiscographyPage(1); }}
                  style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Paginated Album Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {paginatedAlbums.map(a => (
                <div key={a.id} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '3px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <img src={a.cover} alt={a.title} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '3px', marginBottom: '14px' }} />
                    <span style={{ fontSize: '0.75rem', color: selectedTheme.accent, fontWeight: 700, textTransform: 'uppercase' }}>{a.type} • {a.year}</span>
                    <h3 style={{ margin: '4px 0 6px', fontSize: '1.2rem', fontWeight: 800 }}>{a.title}</h3>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{a.tracksCount} Tracks • {a.streams} Streams</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                    <button 
                      onClick={() => setSelectedAlbumModal(a)}
                      style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: `1px solid ${selectedTheme.accent}44`, padding: '8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      View Album Tracklist ({a.tracksCount} Tracks)
                    </button>
                    <button 
                      onClick={() => handlePurchaseTrackWithCredits(a)}
                      style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      Buy Full Stems ({a.priceCredits} Credits)
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
              {Array.from({ length: Math.ceil(filteredAlbums.length / albumsPerPage) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setDiscographyPage(idx + 1)}
                  style={{
                    background: discographyPage === idx + 1 ? selectedTheme.accent : 'rgba(255,255,255,0.08)',
                    color: discographyPage === idx + 1 ? '#000' : '#fff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '3px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

          </div>
        )}

        {/* ================= TAB 4: SHOWS ================= */}
        {activeTab === 'shows' && (
          <div style={{ background: selectedTheme.cardBg, padding: '36px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ color: selectedTheme.accent, margin: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: "'Sansation', sans-serif" }}>
                  World Tour Dates & Intermaven Ticketing Engine
                </h2>
                <p style={{ margin: '4px 0 0', color: '#94a3b8' }}>Stripe & PesaPal Location-Dependent Gateways • 90/10 Waterfall Cascade</p>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', width: '280px' }}>
                <RiSearchLine style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text"
                  placeholder="Search venue or city..."
                  value={showsSearch}
                  onChange={(e) => { setShowsSearch(e.target.value); setShowsPage(1); }}
                  style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Paginated Shows List */}
            {paginatedShows.map((s) => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#fff' }}>{s.venue}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '2px' }}>{s.city} • {s.date}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: selectedTheme.accent }}>From ${s.priceGA}</span>
                  <button 
                    onClick={() => { setSelectedShow(s); setTicketSuccess(null); }}
                    style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '10px 22px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}
                  >
                    Reserve Tickets
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '28px' }}>
              {Array.from({ length: Math.ceil(filteredShows.length / showsPerPage) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setShowsPage(idx + 1)}
                  style={{
                    background: showsPage === idx + 1 ? selectedTheme.accent : 'rgba(255,255,255,0.08)',
                    color: showsPage === idx + 1 ? '#000' : '#fff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '3px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

          </div>
        )}

        {/* ================= TAB 5: MEDIA ================= */}
        {activeTab === 'media' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <h2 style={{ color: selectedTheme.accent, margin: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: "'Sansation', sans-serif" }}>
                Media Gallery & 4K Videos
              </h2>

              {/* Media Filter & Search */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '240px' }}>
                  <RiSearchLine style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text"
                    placeholder="Search photos & videos..."
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Media Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {filteredMedia.map(m => (
                <div key={m.id} style={{ background: selectedTheme.cardBg, border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '3px' }}>
                  <div style={{ position: 'relative', borderRadius: '3px', overflow: 'hidden', marginBottom: '14px' }}>
                    <img src={m.thumbnail} alt={m.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '3px' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <button 
                        onClick={() => setSelectedMedia(m)}
                        style={{ width: '48px', height: '48px', borderRadius: '3px', background: selectedTheme.accent, border: 'none', color: '#000', fontSize: '1.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {m.type === 'video' ? '▶' : <RiImageFill />}
                      </button>
                    </div>
                  </div>
                  <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800 }}>{m.title}</h4>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{m.views} • Click to open interactive fan view</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: E-COMMERCE STORE ================= */}
        {activeTab === 'store' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ color: selectedTheme.accent, margin: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: "'Sansation', sans-serif" }}>
                  Official Creator E-Commerce Store
                </h2>
                <p style={{ margin: '4px 0 0', color: '#94a3b8' }}>Direct Order Fulfillment & Lossless Audio Multitracks</p>
              </div>

              {/* Category Filter */}
              <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {['all', 'vinyl', 'apparel', 'stems', 'collectors'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setStoreCategory(cat)}
                    style={{
                      background: storeCategory === cat ? selectedTheme.accent : 'transparent',
                      color: storeCategory === cat ? '#000' : '#cbd5e1',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '3px',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textTransform: 'uppercase'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {filteredProducts.map(p => (
                <div key={p.id} style={{ background: selectedTheme.cardBg, border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '3px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <img src={p.img} alt={p.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '3px', marginBottom: '14px' }} />
                    <span style={{ fontSize: '0.7rem', color: selectedTheme.accent, textTransform: 'uppercase', fontWeight: 700 }}>{p.category}</span>
                    <h4 style={{ margin: '4px 0 8px', fontSize: '1rem', fontWeight: 800 }}>{p.title}</h4>
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, color: selectedTheme.accent, fontSize: '1.2rem', marginBottom: '14px' }}>{p.price}</div>
                    <button 
                      onClick={() => setSelectedProduct(p)}
                      style={{ width: '100%', background: selectedTheme.accent, color: '#000', border: 'none', padding: '10px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                      Configure & Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 7: PRESS KIT ================= */}
        {activeTab === 'press' && (
          <div style={{ background: selectedTheme.cardBg, padding: '36px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ color: selectedTheme.accent, marginTop: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: "'Sansation', sans-serif", textAlign: 'center' }}>
              Electronic Press Kit (EPK) Assets
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '24px' }}>
              <a href="#download" onClick={(e) => { e.preventDefault(); alert('Downloading Official 1-Sheet PDF...'); }} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', fontWeight: 700 }}>
                <RiDownloadFill style={{ fontSize: '1.5rem', color: selectedTheme.accent }} />
                <div>
                  <div>Official 1-Sheet PDF</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Download (2.4 MB)</div>
                </div>
              </a>
              <a href="#download" onClick={(e) => { e.preventDefault(); alert('Downloading High-Res Press Photos (ZIP)...'); }} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', fontWeight: 700 }}>
                <RiDownloadFill style={{ fontSize: '1.5rem', color: selectedTheme.accent }} />
                <div>
                  <div>Hi-Res Photos (ZIP)</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Download (48 MB)</div>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* ================= TAB 8: CONTACT ================= */}
        {activeTab === 'contact' && (
          <div style={{ background: selectedTheme.cardBg, padding: '36px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '650px', margin: '0 auto' }}>
            <h2 style={{ color: selectedTheme.accent, marginTop: 0, fontSize: '2rem', fontWeight: 900, fontFamily: "'Sansation', sans-serif", textAlign: 'center' }}>
              Management & Booking Inquiries
            </h2>
            <form onSubmit={(e) => { e.preventDefault(); alert('Inquiry message dispatched to creator management inbox!'); }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem' }}>Your Name / Agency</label>
                <input type="text" required style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '3px', fontSize: '0.95rem' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem' }}>Email Address</label>
                <input type="email" required style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '3px', fontSize: '0.95rem' }} />
              </div>
              <button type="submit" style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '14px 28px', borderRadius: '3px', fontWeight: 900, width: '100%', cursor: 'pointer', fontSize: '1rem' }}>
                Send Inquiry
              </button>
            </form>
          </div>
        )}

      </main>

      {/* ================= 4. FOOTER ================= */}
      <footer style={{
        background: 'rgba(3, 5, 12, 0.96)',
        borderTop: `1px solid ${selectedTheme.accent}33`,
        padding: '48px 32px 24px',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '40px' }}>
          
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.3rem', color: '#fff', marginBottom: '10px', fontFamily: "'Sansation', sans-serif" }}>
              {artistName}
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>
              Official Standalone Creator Web World. Lossless Audio Catalog & Direct Intermaven Split Engine.
            </p>
          </div>

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

          <div>
            <h4 style={{ color: selectedTheme.accent, margin: '0 0 14px 0', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800 }}>Store & Sync</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <span onClick={() => setActiveTab('store')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Limited Vinyl LPs</span>
              <span onClick={() => setActiveTab('store')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Lossless WAV Stems</span>
              <span onClick={() => setActiveTab('contact')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Sync Licensing Pitching</span>
            </div>
          </div>

          <div>
            <h4 style={{ color: selectedTheme.accent, margin: '0 0 14px 0', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800 }}>Connect</h4>
            <div style={{ display: 'flex', gap: '14px', fontSize: '1.4rem', marginBottom: '14px' }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiInstagramFill /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiYoutubeFill /></a>
              <a href="https://spotify.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiSpotifyFill /></a>
              <a href="https://apple.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiAppleFill /></a>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Direct fanbase synchronization via Smart CRM.
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: '#64748b' }}>
          <div>© 2026 {artistName}. All rights reserved.</div>
          <a 
            href="https://intermaven.io" 
            target="_blank" 
            rel="noreferrer" 
            style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            powered by <strong style={{ color: selectedTheme.accent }}>intermaven</strong>
          </a>
        </div>
      </footer>

      {/* ================= MODALS ================= */}

      {/* Album Tracklist Modal */}
      {selectedAlbumModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', zIndex: 2200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${selectedTheme.accent}44`, borderRadius: '3px', width: '100%', maxWidth: '520px', padding: '24px', color: '#fff', position: 'relative' }}>
            <button onClick={() => setSelectedAlbumModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '18px' }}>
              <img src={selectedAlbumModal.cover} alt={selectedAlbumModal.title} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '3px' }} />
              <div>
                <h3 style={{ margin: '0 0 4px', color: selectedTheme.accent, fontFamily: "'Sansation', sans-serif" }}>{selectedAlbumModal.title}</h3>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{selectedAlbumModal.type} • Released {selectedAlbumModal.year}</div>
                <div style={{ fontSize: '0.8rem', color: selectedTheme.accent, marginTop: '4px' }}>ISRC: {selectedAlbumModal.isrc}</div>
              </div>
            </div>

            <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', color: '#cbd5e1' }}>Album Tracklist ({selectedAlbumModal.tracksCount} Tracks)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', marginBottom: '18px' }}>
              {Array.from({ length: selectedAlbumModal.tracksCount }).map((_, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', fontSize: '0.85rem' }}>
                  <span>{idx + 1}. Track Title {idx + 1} ({selectedAlbumModal.title})</span>
                  <span style={{ color: '#94a3b8' }}>3:45</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => { handlePurchaseTrackWithCredits(selectedAlbumModal); setSelectedAlbumModal(null); }}
              style={{ width: '100%', background: selectedTheme.accent, color: '#000', border: 'none', padding: '12px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer' }}
            >
              Purchase Full Album Lossless Multitracks ({selectedAlbumModal.priceCredits} Credits)
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer Modal */}
      {cartOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ background: '#0a0d18', borderLeft: `1px solid ${selectedTheme.accent}44`, width: '100%', maxWidth: '440px', height: '100%', padding: '28px', color: '#fff', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <button onClick={() => setCartOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            <h3 style={{ marginTop: 0, color: selectedTheme.accent, fontFamily: "'Sansation', sans-serif" }}>Your Shopping Cart</h3>
            
            <div style={{ flex: 1, overflowY: 'auto', margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cart.length === 0 ? (
                <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '40px' }}>Your shopping cart is empty.</div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Size: {item.selectedSize}</div>
                      <div style={{ fontWeight: 800, color: selectedTheme.accent, marginTop: '4px' }}>${(item.numPrice * item.qty).toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => updateCartQty(idx, -1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '24px', height: '24px', borderRadius: '3px', cursor: 'pointer' }}>-</button>
                      <span style={{ fontWeight: 800 }}>{item.qty}</span>
                      <button onClick={() => updateCartQty(idx, 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '24px', height: '24px', borderRadius: '3px', cursor: 'pointer' }}>+</button>
                      <button onClick={() => removeFromCart(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', marginLeft: '6px', cursor: 'pointer' }}><RiDeleteBinFill /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <form onSubmit={handleCheckoutCart} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Shipping Full Name</label>
                  <input type="text" value={shippingName} onChange={(e) => setShippingName(e.target.value)} required style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Shipping Address</label>
                  <input type="text" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px', fontSize: '0.85rem' }} />
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Amount:</span>
                  <span style={{ color: selectedTheme.accent }}>
                    ${cart.reduce((acc, curr) => acc + (curr.numPrice * curr.qty), 0).toFixed(2)} USD
                  </span>
                </div>
                <button type="submit" style={{ width: '100%', background: selectedTheme.accent, color: '#000', border: 'none', padding: '14px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer' }}>
                  Complete Order Checkout
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Ticketing Modal */}
      {selectedShow && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${selectedTheme.accent}44`, borderRadius: '3px', width: '100%', maxWidth: '480px', padding: '28px', color: '#fff', position: 'relative' }}>
            <button onClick={() => setSelectedShow(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            
            {ticketSuccess ? (
              <div style={{ textAlign: 'center' }}>
                <RiCheckFill style={{ fontSize: '3.2rem', color: '#00ff80' }} />
                <h3 style={{ margin: '8px 0', color: '#00ff80', fontFamily: "'Sansation', sans-serif" }}>Ticket Purchase Confirmed!</h3>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '3px', margin: '16px 0', textAlign: 'left', fontSize: '0.85rem' }}>
                  <div><strong>Venue:</strong> {ticketSuccess.show.venue} ({ticketSuccess.show.city})</div>
                  <div><strong>Tier:</strong> {ticketSuccess.tierName}</div>
                  <div><strong>Quantity:</strong> {ticketSuccess.qty} Ticket(s)</div>
                  <div><strong>Payment Gateway:</strong> {ticketSuccess.gateway === 'pesapal' ? '📱 PesaPal M-Pesa Mobile Money' : '💳 Stripe Global USD'}</div>
                  <div style={{ margin: '8px 0', padding: '8px', background: 'rgba(34, 211, 238, 0.08)', borderRadius: '3px', border: '1px solid rgba(34, 211, 238, 0.3)' }}>
                    <div><strong>90/10 Waterfall Revenue Split:</strong></div>
                    <div>• Creator Share (90%): <span style={{ color: '#00ff80' }}>${ticketSuccess.creatorShare} USD</span></div>
                    <div>• Network Fee (10%): <span style={{ color: '#cbd5e1' }}>${ticketSuccess.platformShare} USD</span></div>
                  </div>
                  <div><strong>Pass Code:</strong> <span style={{ color: selectedTheme.accent, fontFamily: 'monospace' }}>{ticketSuccess.qr}</span></div>
                </div>
                <button onClick={() => setSelectedShow(null)} style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '10px 20px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer' }}>Done</button>
              </div>
            ) : (
              <div>
                <h3 style={{ marginTop: 0, color: selectedTheme.accent, fontFamily: "'Sansation', sans-serif" }}>Intermaven Network Ticketing Engine</h3>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '16px' }}>
                  <strong>{selectedShow.venue}</strong> • {selectedShow.city} ({selectedShow.date})
                </div>
                <form onSubmit={handleTicketBuy} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Select Payment Gateway</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button 
                        type="button" 
                        onClick={() => setPaymentGateway('pesapal')}
                        style={{ background: paymentGateway === 'pesapal' ? selectedTheme.accent : 'rgba(255,255,255,0.05)', color: paymentGateway === 'pesapal' ? '#000' : '#fff', border: 'none', padding: '8px', borderRadius: '3px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                      >
                        <RiCellphoneFill /> PesaPal M-Pesa
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setPaymentGateway('stripe')}
                        style={{ background: paymentGateway === 'stripe' ? selectedTheme.accent : 'rgba(255,255,255,0.05)', color: paymentGateway === 'stripe' ? '#000' : '#fff', border: 'none', padding: '8px', borderRadius: '3px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                      >
                        <RiBankCardFill /> Stripe Global
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Select Ticket Tier</label>
                    <select value={ticketTier} onChange={(e) => setTicketTier(e.target.value)} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px' }}>
                      <option value="ga">General Admission (${selectedShow.priceGA})</option>
                      <option value="vip">VIP Backstage Pass (${selectedShow.priceVIP})</option>
                      <option value="meet">Meet & Greet Upgrade (${selectedShow.priceMeet})</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Ticket Quantity</label>
                    <input type="number" min={1} max={6} value={ticketQty} onChange={(e) => setTicketQty(Number(e.target.value))} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px' }} />
                  </div>

                  <button type="submit" style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '12px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer' }}>
                    Process Payment with {paymentGateway === 'pesapal' ? 'PesaPal' : 'Stripe'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fan Sign Up Modal */}
      {authModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${selectedTheme.accent}44`, borderRadius: '3px', width: '100%', maxWidth: '440px', padding: '28px', color: '#fff', position: 'relative' }}>
            <button onClick={() => setAuthModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            <h3 style={{ marginTop: 0, color: selectedTheme.accent, fontWeight: 900, fontFamily: "'Sansation', sans-serif" }}>
              Join {artistName}'s VIP Fan Vault
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
              Synchronized with Intermaven Unified SSO & Smart CRM.
            </p>

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={authName} 
                onChange={(e) => setAuthName(e.target.value)} 
                required 
                style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px' }} 
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={authEmail} 
                onChange={(e) => setAuthEmail(e.target.value)} 
                required 
                style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px' }} 
              />

              <button type="submit" style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '12px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', marginTop: '6px' }}>
                Join VIP Fan Vault (Unified SSO)
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
