import React, { useState } from 'react';
import { 
  RiPlayFill, RiPauseFill, RiSkipForwardFill, RiSkipBackFill, 
  RiVolumeUpFill, RiHeadphoneLine, RiCompass3Line, RiHeart3Fill, 
  RiPlayListLine, RiUserLine, RiGlobalLine, RiRadioLine, RiSearchLine
} from 'react-icons/ri';
import './App.css';

const SAMPLE_TRACKS = [
  { id: 1, title: "After Hours", artist: "Lumina Wave", album: "Electric Dreams", duration: "3:45", plays: "1.2M", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: 2, title: "Midnight Sun", artist: "Hologram Club", album: "Neon Horizon", duration: "4:12", plays: "982K", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: 3, title: "Resonance", artist: "Aether Echo", album: "Silent Grid", duration: "3:28", plays: "450K", cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: 4, title: "Stardust", artist: "Solaris", album: "Nebula Core", duration: "5:01", plays: "2.3M", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
];

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(SAMPLE_TRACKS[0]);
  const [likes, setLikes] = useState([1, 3]);
  const [volume, setVolume] = useState(80);

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

  return (
    <div className="ts-container">
      {/* Dynamic Header Domain Alert */}
      <div className="ts-domain-banner">
        <RiGlobalLine className="banner-icon" />
        <span>Serving from Official Domain: <strong>tunestream.co</strong> | Alias mapping: <strong>tunestream.tunemavens.com</strong></span>
      </div>

      <div className="ts-main-layout">
        {/* Sidebar Navigation */}
        <aside className="ts-sidebar">
          <div className="ts-logo">
            <RiRadioLine className="logo-icon" />
            <h2>TUNE<span>STREAM</span></h2>
          </div>
          <nav className="ts-nav">
            <span className="nav-section-title">Discover</span>
            <a href="#explore" className="nav-item active">
              <RiCompass3Line /> Explore
            </a>
            <a href="#radio" className="nav-item">
              <RiRadioLine /> Live Radio
            </a>
            
            <span className="nav-section-title">My Library</span>
            <a href="#tracks" className="nav-item">
              <RiPlayListLine /> Saved Tracks
            </a>
            <a href="#favorites" className="nav-item">
              <RiHeart3Fill className="fav-icon" /> Favorites
            </a>
          </nav>

          <div className="ts-user-profile">
            <div className="user-avatar">
              <RiUserLine />
            </div>
            <div className="user-info">
              <span className="user-name">Listener Pro</span>
              <span className="user-badge">PRO VERIFIED</span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="ts-content">
          <header className="ts-header">
            <div className="search-bar">
              <RiSearchLine />
              <input type="text" placeholder="Search artists, tracks, podcasts..." />
            </div>
          </header>

          {/* Hero Showcase Banner */}
          <section className="ts-hero">
            <div className="hero-overlay"></div>
            <div className="hero-text">
              <span className="hero-badge">SPOTLIGHT CREATOR</span>
              <h1>Lumina Wave</h1>
              <p>Experience the latest high-fidelity ambient electronic tracks from Lumina Wave's latest release "Electric Dreams". Now streaming in Lossless Audio.</p>
              <div className="hero-actions">
                <button className="btn-play-hero" onClick={() => handleTrackSelect(SAMPLE_TRACKS[0])}>
                  <RiPlayFill /> Play Album
                </button>
              </div>
            </div>
          </section>

          {/* Grid Section */}
          <section className="ts-music-section">
            <div className="section-header">
              <h3>Trending Right Now</h3>
            </div>
            
            <div className="tracks-list">
              {SAMPLE_TRACKS.map((track, idx) => (
                <div 
                  key={track.id} 
                  className={`track-row ${currentTrack.id === track.id ? 'active' : ''}`}
                  onClick={() => handleTrackSelect(track)}
                >
                  <div className="track-number">{idx + 1}</div>
                  <img src={track.cover} alt={track.title} className="track-cover" />
                  <div className="track-details">
                    <span className="track-title">{track.title}</span>
                    <span className="track-artist">{track.artist}</span>
                  </div>
                  <div className="track-album">{track.album}</div>
                  <div className="track-plays">{track.plays} plays</div>
                  <div className="track-duration">{track.duration}</div>
                  <button 
                    className={`btn-like ${likes.includes(track.id) ? 'liked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(track.id);
                    }}
                  >
                    <RiHeart3Fill />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Persistent Audio Player Bar */}
      <footer className="ts-player-bar">
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
