import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { 
  RiPlayFill, RiPauseFill, RiSkipForwardFill, RiSkipBackFill, 
  RiVolumeUpFill, RiHeadphoneLine, RiCompass3Line, RiHeart3Fill, 
  RiPlayListLine, RiUserLine, RiGlobalLine, RiRadioLine, RiSearchLine,
  RiArrowLeftSFill, RiArrowRightSFill, RiUpload2Line, RiDatabase2Line,
  RiCoinsLine, RiBarChartLine, RiCloseFill, RiMusicLine, RiUserFill,
  RiDownloadLine
} from 'react-icons/ri';
import tsLogo from './assets/tunestream-logo.png';
import './App.css';

// Import newly copied header assets
import listenHero from './assets/images/listen_hero.png';

const SAMPLE_TRACKS = [
  { id: 1, title: "After Hours", artist: "Lumina Wave", album: "Electric Dreams", duration: "3:45", plays: "1.2M", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", splits: "70/30" },
  { id: 2, title: "Midnight Sun", artist: "Hologram Club", album: "Neon Horizon", duration: "4:12", plays: "982K", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", splits: "50/50" },
  { id: 3, title: "Resonance", artist: "Aether Echo", album: "Silent Grid", duration: "3:28", plays: "450K", cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", splits: "80/20" },
  { id: 4, title: "Stardust", artist: "Solaris", album: "Nebula Core", duration: "5:01", plays: "2.3M", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", splits: "100/0" },
];

import NativeAppLandingView from './NativeAppLandingView';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NativeAppLandingView />} />
        <Route path="/stream" element={<PlayerDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function PlayerDashboard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(SAMPLE_TRACKS[0]);
  const [likes, setLikes] = useState([1, 3]);
  const [volume, setVolume] = useState(80);
  
  // Unified Dashboard States
  const [currentView, setCurrentView] = useState('listener'); // 'listener' | 'creator'
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'favorites' | 'radio' for listener, 'my-catalog' | 'upload' for creator
  
  // Creator states
  const [catalogTracks, setCatalogTracks] = useState(SAMPLE_TRACKS);
  const [uploadForm, setUploadForm] = useState({ title: '', artist: '', genre: 'Electronic', splits: '100/0' });
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleLike = (id) => {
    if (likes.includes(id)) {
      setLikes(likes.filter(item => item !== id));
    } else {
      setLikes([...likes, id]);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setActiveTab(view === 'listener' ? 'explore' : 'my-catalog');
    setUploadSuccess(false);
    setUploadError('');
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess(false);

    if (!uploadForm.title.trim()) {
      setUploadError('Track title is required.');
      return;
    }
    if (!uploadForm.artist.trim()) {
      setUploadError('Artist name is required.');
      return;
    }
    if (!fileName) {
      setUploadError('Please select or drag an audio file to ingest.');
      return;
    }

    // Add track to catalog mockup
    const newTrack = {
      id: catalogTracks.length + 1,
      title: uploadForm.title,
      artist: uploadForm.artist,
      album: "Single",
      duration: "3:30",
      plays: "0",
      cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=60",
      splits: uploadForm.splits
    };

    setCatalogTracks([newTrack, ...catalogTracks]);
    setUploadSuccess(true);
    setFileName('');
    setUploadForm({ title: '', artist: '', genre: 'Electronic', splits: '100/0' });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/')) {
        setFileName(file.name);
      } else {
        setUploadError('Invalid file type. Only audio files (MP3, WAV, FLAC) are supported.');
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-sidebar-scroll">
          <div className="dashboard-sidebar-header" style={{ flexDirection: collapsed ? 'column' : 'row', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
            <Link to="/" title="Back to landing page" style={{ display: 'flex', justifyContent: 'center', width: '100%', alignItems: 'center', textDecoration: 'none' }}>
              {collapsed ? (
                <img src="/favicon.png" alt="TuneStream Icon" style={{ height: '32px', width: 'auto', display: 'block' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                  <img src={tsLogo} alt="TuneStream Logo" style={{ height: '28px', width: 'auto', display: 'block' }} />
                  <span style={{ fontWeight: '800', letterSpacing: '1px', fontSize: '18px', color: '#00f2fe' }}>TUNE<span style={{ color: '#fff' }}>STREAM</span></span>
                </div>
              )}
            </Link>
          </div>

          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="dashboard-nav-item collapse-toggle-btn"
            style={{ border: 'none', background: 'transparent', padding: '6px', justifyContent: 'center', width: '100%', marginBottom: '16px', color: '#94a3b8' }}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <RiArrowRightSFill size={16} /> : <RiArrowLeftSFill size={16} />}
          </button>

          {currentView === 'listener' ? (
            <div className="sidebar-category-group" style={{ marginBottom: '12px' }}>
              {!collapsed && (
                <div style={{ fontSize: '10px', color: '#475569', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', padding: '6px 14px 4px' }}>
                  Discover
                </div>
              )}
              <ul className="dashboard-nav-list" style={{ gap: '4px' }}>
                <li>
                  <button 
                    onClick={() => setActiveTab('explore')} 
                    className={`dashboard-nav-item ${activeTab === 'explore' ? 'active' : ''}`}
                    title="Explore"
                  >
                    <RiCompass3Line size={16} />
                    {!collapsed && "Explore"}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('favorites')} 
                    className={`dashboard-nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
                    title="Favorites"
                  >
                    <RiHeart3Fill size={16} className="fav-icon" />
                    {!collapsed && "Favorites"}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('radio')} 
                    className={`dashboard-nav-item ${activeTab === 'radio' ? 'active' : ''}`}
                    title="Live Radio"
                  >
                    <RiRadioLine size={16} />
                    {!collapsed && "Live Radio"}
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="sidebar-category-group" style={{ marginBottom: '12px' }}>
              {!collapsed && (
                <div style={{ fontSize: '10px', color: '#475569', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', padding: '6px 14px 4px' }}>
                  Catalog & IP
                </div>
              )}
              <ul className="dashboard-nav-list" style={{ gap: '4px' }}>
                <li>
                  <button 
                    onClick={() => setActiveTab('my-catalog')} 
                    className={`dashboard-nav-item ${activeTab === 'my-catalog' ? 'active' : ''}`}
                    title="My Catalog"
                  >
                    <RiDatabase2Line size={16} />
                    {!collapsed && "My Catalog"}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('upload')} 
                    className={`dashboard-nav-item ${activeTab === 'upload' ? 'active' : ''}`}
                    title="Upload Track"
                  >
                    <RiUpload2Line size={16} />
                    {!collapsed && "Upload Track"}
                  </button>
                </li>
              </ul>
            </div>
          )}

          <ul className="dashboard-nav-list" style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
            <li>
              <a 
                href="/" 
                className="dashboard-nav-item"
                style={{ textDecoration: 'none' }}
                title="Back to Home Site"
              >
                <RiSkipBackFill size={16} style={{ transform: 'rotate(180deg)' }} />
                {!collapsed && "Back to Home Site"}
              </a>
            </li>
          </ul>
        </div>

        <div className="dashboard-sidebar-footer">
          <div className="dashboard-profile-card">
            <div className="dashboard-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>
              {currentView === 'listener' ? 'L' : 'C'}
            </div>
            {!collapsed && (
              <div className="dashboard-profile-info">
                <h5>{currentView === 'listener' ? 'Listener Pro' : 'Creator Companion'}</h5>
                <span 
                  onClick={() => handleViewChange(currentView === 'listener' ? 'creator' : 'listener')}
                  title="Click to toggle sandbox role"
                  style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block', marginTop: '2px', color: '#00f2fe' }}
                >
                  ⚙️ {currentView}
                </span>
              </div>
            )}
          </div>
          <button 
            onClick={() => handleViewChange(currentView === 'listener' ? 'creator' : 'listener')} 
            className="dashboard-nav-item" 
            style={{ width: '100%', border: 'none', background: 'rgba(0, 242, 254, 0.05)', color: '#00f2fe', justifyContent: 'center', marginTop: '8px', padding: collapsed ? '10px 0' : '10px 14px' }}
            title="Toggle Utility Role"
          >
            <RiUserFill size={14} style={{ marginRight: collapsed ? 0 : 8 }} />
            {!collapsed && `Switch to ${currentView === 'listener' ? 'Creator' : 'Listener'}`}
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="dashboard-main-content" style={{ height: 'calc(100% - 90px)' }}>
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RiGlobalLine style={{ color: '#00f2fe' }} />
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
                SERVING FROM: <strong>tunestream.co</strong> | ALIAS: <strong>tunestream.tunemavens.com</strong>
              </span>
            </div>
          </div>
          <div className="dashboard-topbar-actions">
            <div className="search-bar" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <RiSearchLine />
              <input type="text" placeholder="Search track, catalog, splits..." style={{ fontSize: '13px' }} />
            </div>
            <button 
              className="btn-play-hero" 
              onClick={() => handleViewChange(currentView === 'listener' ? 'creator' : 'listener')}
              style={{ padding: '8px 16px', fontSize: '12px' }}
            >
              Role: {currentView.toUpperCase()}
            </button>
          </div>
        </header>

        <div className="dashboard-main-scroll" style={{ padding: '24px 32px' }}>
          {currentView === 'listener' ? (
            /* ================= LISTENER VIEW ================= */
            <div>
              {activeTab === 'explore' && (
                <>
                  <section className="ts-hero" style={{ height: '220px', marginBottom: '24px' }}>
                    <div className="hero-overlay"></div>
                    <div className="hero-text" style={{ padding: '20px' }}>
                      <span className="hero-badge">SPOTLIGHT CREATOR</span>
                      <h1 style={{ fontSize: '28px', margin: '8px 0' }}>Lumina Wave</h1>
                      <p style={{ fontSize: '13px', marginBottom: '12px', maxWidth: '500px' }}>
                        Experience the latest high-fidelity ambient electronic tracks from Lumina Wave's latest release "Electric Dreams". Now streaming in Lossless Audio.
                      </p>
                      <button className="btn-play-hero" onClick={() => handleTrackSelect(SAMPLE_TRACKS[0])} style={{ padding: '8px 20px' }}>
                        <RiPlayFill /> Play Album
                      </button>
                    </div>
                  </section>

                  <section className="ts-music-section">
                    <div className="section-header" style={{ marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '16px' }}>Trending Right Now</h3>
                    </div>
                    
                    <div className="tracks-list">
                      {catalogTracks.map((track, idx) => (
                        <div 
                          key={track.id} 
                          className={`track-row ${currentTrack.id === track.id ? 'active' : ''}`}
                          onClick={() => handleTrackSelect(track)}
                        >
                          <div className="track-number">{idx + 1}</div>
                          <img src={track.cover} alt={track.title} className="track-cover" />
                          <div className="track-details" style={{ width: '220px' }}>
                            <span className="track-title">{track.title}</span>
                            <span className="track-artist">{track.artist}</span>
                          </div>
                          <div className="track-album" style={{ color: '#64748b' }}>{track.album}</div>
                          <div className="track-plays" style={{ color: '#64748b' }}>{track.plays} plays</div>
                          <div className="track-duration" style={{ color: '#64748b' }}>{track.duration}</div>
                          <button 
                            className={`btn-like ${likes.includes(track.id) ? 'liked' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(track.id);
                            }}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                          >
                            <RiHeart3Fill />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {activeTab === 'favorites' && (
                <section className="ts-music-section">
                  <div className="section-header" style={{ marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '16px' }}>My Favorites</h3>
                  </div>
                  <div className="tracks-list">
                    {catalogTracks.filter(t => likes.includes(t.id)).length === 0 ? (
                      <div style={{ color: '#64748b', padding: '24px', textAlign: 'center' }}>No liked tracks yet. Explore and tap the heart icon to save!</div>
                    ) : (
                      catalogTracks.filter(t => likes.includes(t.id)).map((track, idx) => (
                        <div 
                          key={track.id} 
                          className={`track-row ${currentTrack.id === track.id ? 'active' : ''}`}
                          onClick={() => handleTrackSelect(track)}
                        >
                          <div className="track-number">{idx + 1}</div>
                          <img src={track.cover} alt={track.title} className="track-cover" />
                          <div className="track-details" style={{ width: '220px' }}>
                            <span className="track-title">{track.title}</span>
                            <span className="track-artist">{track.artist}</span>
                          </div>
                          <div className="track-album">{track.album}</div>
                          <div className="track-plays">{track.plays} plays</div>
                          <div className="track-duration">{track.duration}</div>
                          <button 
                            className="btn-like liked"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(track.id);
                            }}
                            style={{ background: 'transparent', border: 'none' }}
                          >
                            <RiHeart3Fill />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              )}

              {activeTab === 'radio' && (
                <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <RiRadioLine size={48} style={{ color: '#00f2fe', marginBottom: '16px', animation: 'pulse 2s infinite' }} />
                  <h4>TuneStream Live Radio</h4>
                  <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px', maxWidth: '400px', margin: '8px auto' }}>
                    Lossless stream broadcasts curated daily by the community. Connecting to stream node...
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* ================= CREATOR VIEW ================= */
            <div>
              {/* Creator Overview Panel */}
              <div className="dashboard-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div className="dashboard-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Catalog Size</span>
                  <h3 style={{ fontSize: '24px', margin: '8px 0 0', color: '#00f2fe' }}>{catalogTracks.length} Tracks</h3>
                </div>
                <div className="dashboard-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Plays</span>
                  <h3 style={{ fontSize: '24px', margin: '8px 0 0', color: '#00f2fe' }}>4.9M Streams</h3>
                </div>
                <div className="dashboard-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Accrued Balance</span>
                  <h3 style={{ fontSize: '24px', margin: '8px 0 0', color: '#00f2fe' }}>$12,450.00</h3>
                </div>
              </div>

              {activeTab === 'my-catalog' && (
                <section className="ts-music-section">
                  <div className="section-header" style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '16px' }}>My Uploaded Catalog</h3>
                    <button className="btn-play-hero" onClick={() => setActiveTab('upload')} style={{ padding: '6px 12px', fontSize: '11px' }}>
                      <RiUpload2Line /> Ingest New Track
                    </button>
                  </div>
                  
                  <div className="tracks-list">
                    {catalogTracks.map((track, idx) => (
                      <div key={track.id} className="track-row" style={{ cursor: 'default' }}>
                        <div className="track-number">{idx + 1}</div>
                        <img src={track.cover} alt={track.title} className="track-cover" />
                        <div className="track-details" style={{ width: '220px' }}>
                          <span className="track-title">{track.title}</span>
                          <span className="track-artist">{track.artist}</span>
                        </div>
                        <div className="track-album" style={{ color: '#64748b' }}>{track.album}</div>
                        <div className="track-plays" style={{ color: '#64748b' }}>{track.plays} plays</div>
                        <div style={{ color: '#00f2fe', width: '100px', fontSize: '12px', fontWeight: 'bold' }}>
                          Splits: {track.splits || "100/0"}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn-play-hero" 
                            onClick={() => handleTrackSelect(track)}
                            style={{ padding: '4px 8px', fontSize: '10px' }}
                          >
                            Listen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === 'upload' && (
                <div className="dashboard-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RiUpload2Line style={{ color: '#00f2fe' }} /> Lossless Catalogue Audio Ingestion
                  </h4>
                  
                  {uploadSuccess && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px', borderRadius: '6px', color: '#10b981', fontSize: '13px', marginBottom: '16px' }}>
                      ✓ Track successfully ingested and transcoded into Lossless cache system!
                    </div>
                  )}

                  {uploadError && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px', borderRadius: '6px', color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>
                      ⚠ {uploadError}
                    </div>
                  )}

                  <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>Track Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Dream Escape" 
                          value={uploadForm.title} 
                          onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                          style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>Primary Artist Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Lumina Wave" 
                          value={uploadForm.artist} 
                          onChange={e => setUploadForm({ ...uploadForm, artist: e.target.value })}
                          style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>Genre</label>
                        <select 
                          value={uploadForm.genre}
                          onChange={e => setUploadForm({ ...uploadForm, genre: e.target.value })}
                          style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', outline: 'none' }}
                        >
                          <option value="Electronic">Electronic / Ambient</option>
                          <option value="Hip Hop">Hip Hop / Beats</option>
                          <option value="Pop">Indie Pop</option>
                          <option value="Classical">Neo-Classical</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>Royalty Split Cascade Setup (Creator/Label)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 70/30" 
                          value={uploadForm.splits}
                          onChange={e => setUploadForm({ ...uploadForm, splits: e.target.value })}
                          style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', outline: 'none' }}
                        />
                      </div>
                    </div>

                    {/* Drag and Drop Ingestion Box */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>Audio File Ingestion</label>
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        style={{ 
                          border: `2px dashed ${dragActive ? '#00f2fe' : 'rgba(255, 255, 255, 0.15)'}`, 
                          borderRadius: '8px', 
                          padding: '30px', 
                          textAlign: 'center', 
                          background: dragActive ? 'rgba(0, 242, 254, 0.04)' : 'rgba(0,0,0,0.1)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <RiUpload2Line size={32} style={{ color: '#00f2fe', marginBottom: '8px' }} />
                        {fileName ? (
                          <div>
                            <strong style={{ color: '#00f2fe' }}>File Loaded:</strong> {fileName}
                            <button 
                              type="button" 
                              onClick={() => setFileName('')} 
                              style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                            >
                              <RiCloseFill />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <p style={{ fontSize: '13px' }}>Drag & drop your WAV, FLAC, or MP3 file here, or click to browse</p>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>Supports Lossless FLAC/WAV up to 150MB</span>
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="audio/*" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setFileName(e.target.files[0].name);
                            }
                          }}
                          style={{ display: 'none' }}
                          id="file-upload-input"
                        />
                        <label htmlFor="file-upload-input" style={{ display: 'inline-block', marginTop: '12px', padding: '6px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>
                          Browse Local Storage
                        </label>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn-play-hero" 
                      style={{ marginTop: '10px', justifyContent: 'center' }}
                    >
                      <RiUpload2Line /> Ingest & Publish Track
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Unified Dashboard Footer Copyright Strip */}
        <div className="dashboard-copyright-strip" style={{ background: 'rgba(11, 15, 30, 0.95)' }}>
          <span>© {new Date().getFullYear()} TuneMavens Ltd. All rights reserved.</span>
          <span className="dashboard-copyright-divider">·</span>
          <span>Operating on the shared Intermaven network.</span>
        </div>
      </main>

      {/* Persistent Audio Player Bar */}
      <footer className="ts-player-bar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, width: '100%' }}>
        <div className="player-track-info">
          <img src={currentTrack.cover} alt={currentTrack.title} className="player-cover" />
          <div className="player-metadata">
            <span className="player-title">{currentTrack.title}</span>
            <span className="player-artist">{currentTrack.artist}</span>
          </div>
        </div>

        <div className="player-controls">
          <div className="control-buttons">
            <button className="btn-control"><RiSkipBackFill /></button>
            <button className="btn-control btn-play-pause" onClick={togglePlay}>
              {isPlaying ? <RiPauseFill /> : <RiPlayFill />}
            </button>
            <button className="btn-control"><RiSkipForwardFill /></button>
          </div>
          <div className="playback-bar">
            <span className="time-stamp">1:24</span>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: '40%' }}></div>
            </div>
            <span className="time-stamp">{currentTrack.duration}</span>
          </div>
        </div>

        <div className="player-volume">
          <RiVolumeUpFill className="volume-icon" />
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume}
            onChange={(e) => setVolume(e.target.value)} 
            className="volume-slider"
          />
        </div>
      </footer>
    </div>
  );
}
