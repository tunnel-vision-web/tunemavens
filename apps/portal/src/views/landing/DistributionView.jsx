import React from 'react'
import { Link } from 'react-router-dom'
import { RiVolumeUpFill, RiGlobalLine, RiMusicFill } from 'react-icons/ri'
import { SiSpotify, SiApplemusic, SiYoutube, SiTiktok, SiTidal, SiDeezer } from 'react-icons/si'
import { FaAmazon } from 'react-icons/fa'
import PageHeader from '../../components/common/PageHeader.jsx'
import headerAppsImg from '../../assets/images/header_apps.png'
import headerAppsWesternImg from '../../assets/images/header_apps_western.png'
import SEO from '../../components/common/SEO.jsx'

export default function DistributionView({ sessionUser }) {
  const ctaLink = sessionUser ? '/dashboard?tab=distribution-election' : '/register';

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "TuneMavens Global Music Distribution",
    "description": "Distribute unlimited music releases to Spotify, Apple Music, TikTok, Amazon Music, and 140+ DSPs while keeping 100% of your royalties.",
    "provider": {
      "@type": "Organization",
      "name": "TuneMavens"
    }
  };

  const dspStores = [
    { name: "Spotify", desc: "Push releases to Spotify and gain instant access to Spotify for Artists verification & play pitching.", tag: "Verified Pitching", icon: <SiSpotify size={26} style={{ color: '#1db954' }} /> },
    { name: "Apple Music", desc: "Deliver lossless master tracks and Dolby Atmos spatial mixes to Apple Music stream subscribers.", tag: "Spatial Lossless", icon: <SiApplemusic size={26} style={{ color: '#fc3c44' }} /> },
    { name: "YouTube Music", desc: "Auto-generate official Art Tracks, sync with your Official Artist Channel, and claim content royalties.", tag: "UGC Claims Ready", icon: <SiYoutube size={26} style={{ color: '#ff0000' }} /> },
    { name: "Amazon Music", desc: "Submit tracks for curated Amazon editorial playlists and Alexa voice request optimization.", tag: "Alexa Voice Ready", icon: <FaAmazon size={26} style={{ color: '#ff9900' }} /> },
    { name: "TikTok & ByteDance", desc: "Inject tracks into the official TikTok sound library for creators to use in viral shorts worldwide.", tag: "Social Sync", icon: <SiTiktok size={24} style={{ color: '#fff' }} /> },
    { name: "TuneStream", desc: "Direct distribution to TuneStream catalog for licensing placement, immediate streaming availability, and high-fidelity lossless distribution.", tag: "Native Sync Integration", icon: <RiVolumeUpFill size={26} style={{ color: 'var(--cyan)' }} /> },
    { name: "Tidal", desc: "Distribute premium High-Fidelity streams to audiophiles, keeping higher direct payout waterfalls.", tag: "Hi-Res Masters", icon: <SiTidal size={26} style={{ color: '#fff' }} /> },
    { name: "Deezer", desc: "Deliver to Deezer's global catalog, covering Europe and Latin American streaming territories.", tag: "European Reach", icon: <SiDeezer size={26} style={{ color: '#ff007f' }} /> },
    { name: "Tencent & NetEase", desc: "Access major Asian markets including QQ Music, Kugou, Kuwo, and NetEase Cloud Music channels.", tag: "Asian Markets", icon: <RiGlobalLine size={26} style={{ color: '#a78bfa' }} /> },
    { name: "Boomplay & Audiomack", desc: "Establish absolute presence in fast-growing African regions through Boomplay, Audiomack, and MTN music.", tag: "African Coverage", icon: <RiMusicFill size={26} style={{ color: '#f59e0b' }} /> },
    { name: "+140 More DSPs", desc: "Gain automatic delivery access to all other digital services, digital jukeboxes, audio lockers, and regional stores worldwide.", tag: "Global Coverage", icon: <RiGlobalLine size={26} style={{ color: '#cbd5e1' }} /> }
  ];

  const features = [
    "Keep 100% of your royalties",
    "Unlimited releases to 150+ stores",
    "Free SmartLinks & Pre-saves included",
    "Daily streaming analytics & geographic map",
    "Direct waterfall splits registration",
    "24/7 dedicated support team"
  ];

  return (
    <>
      <SEO 
        title="Global Music Distribution" 
        description="Distribute unlimited music releases to Spotify, Apple Music, TikTok, Amazon Music, and 140+ DSPs while keeping 100% of your royalties."
        schema={schema}
      />
      <PageHeader 
        title="Global DSP Distribution" 
        bgImage={headerAppsImg} 
        bgImageWestern={headerAppsWesternImg} 
        breadcrumb="DSP Distribution" 
      />
      
      <div className="container" style={{ paddingBottom: '80px', marginTop: '50px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Deliver Audio to 150+ Global Stores
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            Broaden Your Global Streaming Footprint
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6', maxWidth: '650px', margin: '0 auto' }}>
            We push your catalog to Spotify, Apple Music, TikTok, Amazon Music, Tencent, and NetEase. 
            Get absolute global reach, retain your copyright, and keep 100% of your earnings.
          </p>
        </div>

        {/* DSP Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '64px' }}>
          {dspStores.map((store, i) => (
            <div 
              key={i} 
              className="glass-panel glass-panel-hover" 
              style={{ 
                padding: '32px 24px', 
                borderRadius: '4px', 
                border: '1px solid rgba(255,255,255,0.05)', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                textAlign: 'center',
                gap: '12px'
              }}
            >
              <div style={{ marginBottom: '4px' }}>
                {store.icon}
              </div>
              <h4 style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: 'bold' }}>{store.name}</h4>
              <span style={{ fontSize: '10px', background: 'rgba(0,242,254,0.08)', color: '#00f2fe', padding: '2px 8px', borderRadius: '2px', fontWeight: 'bold', width: 'fit-content' }}>
                {store.tag}
              </span>
              <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>{store.desc}</p>
            </div>
          ))}
        </div>

        {/* Checklist */}
        <div 
          className="glass-panel" 
          style={{ 
            background: 'rgba(11, 15, 30, 0.6)', 
            border: '1px solid rgba(255,255,255,0.06)', 
            borderRadius: '6px', 
            padding: '40px', 
            maxWidth: '800px', 
            margin: '0 auto 64px', 
            textAlign: 'left' 
          }}
        >
          <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '24px', textAlign: 'center', fontWeight: 'bold' }}>
            Why Distribute via TuneMavens Ecosystem?
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px 32px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#cbd5e1' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            Ready to distribute your music?
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '600px', margin: '0 auto 24px' }}>
            Create an account to start uploading releases, tracking metrics, and automating splits cascades.
          </p>
          <Link 
            to={ctaLink} 
            className="btn-primary" 
            style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}
          >
            Start Distributing Now
          </Link>
        </div>
      </div>
    </>
  );
}
