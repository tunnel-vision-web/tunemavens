import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROLE_LOGOS, getServiceUrl } from '../../components/PerfectForSidebar.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
import { useRegion } from '../../RegionContext.jsx'

// Localized System Dashboard Screenshots (English)
import creatorDashActualEn from '../../assets/images/creator_dashboard_actual_en.png'
import labelDashActualEn from '../../assets/images/label_dashboard_actual_en.png'
import djDashActualEn from '../../assets/images/dj_dashboard_actual_en.png'
import mediahouseDashActualEn from '../../assets/images/mediahouse_dashboard_actual_en.png'
import supervisorDashActualEn from '../../assets/images/supervisor_dashboard_actual_en.png'
import consumerDashActualEn from '../../assets/images/consumer_dashboard_actual_en.png'
import corporateDashActualEn from '../../assets/images/corporate_dashboard_actual_en.png'
import vcDashActualEn from '../../assets/images/vc_dashboard_actual_en.png'

// Localized System Dashboard Screenshots (Swahili)
import creatorDashActualSw from '../../assets/images/creator_dashboard_actual_sw.png'
import labelDashActualSw from '../../assets/images/label_dashboard_actual_sw.png'
import djDashActualSw from '../../assets/images/dj_dashboard_actual_sw.png'
import mediahouseDashActualSw from '../../assets/images/mediahouse_dashboard_actual_sw.png'
import supervisorDashActualSw from '../../assets/images/supervisor_dashboard_actual_sw.png'
import consumerDashActualSw from '../../assets/images/consumer_dashboard_actual_sw.png'
import corporateDashActualSw from '../../assets/images/corporate_dashboard_actual_sw.png'
import vcDashActualSw from '../../assets/images/vc_dashboard_actual_sw.png'

// Localized Headers
import perfectForHeaderImg from '../../assets/images/perfect_for_header.png'
import perfectForHeaderWesternImg from '../../assets/images/perfect_for_header_western.png'

export default function PerfectForPageView() {
  const { language } = useRegion();
  const isSw = language === 'sw' || language === 'ki';
  const [previewModal, setPreviewModal] = useState(null);

  const metaRoles = [
    {
      key: 'creator',
      label: isSw ? 'Waundaji & Wasanii' : 'Creators',
      sub: isSw ? 'Wasanii & Watayarishaji' : 'Artists & Producers',
      href: '/for/creator',
      logo: ROLE_LOGOS['creator'],
      accent: 'var(--cyan)',
      desc: isSw 
        ? 'Imeundwa kwa wasanii na watayarishaji wa muziki. Kokotoa migawanyo ya mapato (splits), dhibiti maktaba yako ya nyimbo, na uwasilishe nyimbo zako kwenye dashibodi moja.'
        : 'Designed for artists and producers. Calculate split sheets, manage your music library, and pitch your tracks under a single console.',
      preview: isSw ? creatorDashActualSw : creatorDashActualEn,
      previewTitle: isSw ? 'Dashibodi ya Studio ya Muundaji & Mgawanyo wa Mapato' : 'Creator Studio Dashboard & Split Sheets'
    },
    {
      key: 'podcaster',
      label: isSw ? 'Waundaji wa Podikasti' : 'Podcasters',
      sub: isSw ? 'Vipindi & Ufadhili wa Matangazo' : 'Shows & Ad Sponsorships',
      href: '/for/podcaster',
      logo: ROLE_LOGOS['podcaster'] || ROLE_LOGOS['creator'],
      accent: '#00f2fe',
      desc: isSw
        ? 'Kwa watayarishaji na wenyeji wa podikasti. Chapisha vipindi na sura maalum, pata ufadhili wa matangazo ya ushirika, na dhibiti EPK ya sauti na Split Cascade.'
        : 'For podcast creators, narrative audio hosts, and media producers. Publish broadcast-mastered episodes, monetize corporate ad flights, host verified EPKs, and split host/producer royalties automatically.',
      preview: isSw ? creatorDashActualSw : creatorDashActualEn,
      previewTitle: isSw ? 'Studio ya Podikasti & Usimamizi wa EPK' : 'Podcaster Studio & Ad Monetization Console'
    },
    {
      key: 'label',
      label: isSw ? 'Lebo za Rekodi' : 'Record Labels',
      sub: isSw ? 'Usimamizi wa Katalogi' : 'Catalog Management',
      href: '/for/label',
      logo: ROLE_LOGOS['label'],
      accent: 'var(--purple)',
      desc: isSw
        ? 'Kwa lebo za rekodi, mameneja wa A&R, na viongozi wa tasnia. Dhibiti katalogi nzima ya wasanii, fuatilia migawanyo, na uratibu uzinduzi wa nyimbo.'
        : 'For record labels, A&R managers, and industry leaders. Manage your entire artist catalog, track splits, and coordinate roster-wide releases.',
      preview: isSw ? labelDashActualSw : labelDashActualEn,
      previewTitle: isSw ? 'Katalogi ya Lebo ya Rekodi & Dashibodi ya Uingizaji' : 'Record Label Catalog & Ingestion Console'
    },
    {
      key: 'dj',
      label: 'DJs',
      sub: isSw ? 'Mfumo wa DJ Pool' : 'DJ Pool Engine',
      href: '/for/dj',
      logo: ROLE_LOGOS['dj'],
      accent: '#14b8a6',
      desc: isSw
        ? 'Mfumo wa DJ Pool wa kizazi kijacho. Pata faili za sauti za kiwango cha juu (lossless), foleni za nyimbo, na uidhinishaji wa vibao kwa maonyesho ya moja kwa moja.'
        : 'The next-generation pool engine. Access lossless audio files, queue pools, and secure stem clearances for live sets.',
      preview: isSw ? djDashActualSw : djDashActualEn,
      previewTitle: isSw ? 'Kituo cha DJ Pool & Uidhinishaji wa Miondoko ya Ngoma' : 'DJ Pool & Dancefloor Drop Clearances Hub'
    },
    {
      key: 'media_house',
      label: isSw ? 'Mashirika ya Vyombo vya Habari' : 'Media Houses',
      sub: isSw ? 'Utangazaji & Orodha za Uchezaji' : 'Broadcast & Playlisting',
      href: '/for/media-house',
      logo: ROLE_LOGOS['media_house'],
      accent: 'var(--blue)',
      desc: isSw
        ? 'Zana za utangazaji na uratibu wa foleni za muziki. Fikia orodha zilizoidhinishwa za kufuata sheria na dhibiti ratiba za muziki kwa vituo vya utangazaji.'
        : 'Broadcasting and queue routing tools. Access authorized compliance directories and manage music scheduling for broadcast channels.',
      preview: isSw ? mediahouseDashActualSw : mediahouseDashActualEn,
      previewTitle: isSw ? 'Foleni ya Utangazaji & Uzingatiaji wa Shirika la Habari' : 'Media House Broadcast & Compliance Queue'
    },
    {
      key: 'supervisor',
      label: isSw ? 'Wasimamizi wa Muziki' : 'Music Supervisors',
      sub: isSw ? 'Utoaji Leseni wa SyncMavens' : 'SyncMavens Licensing',
      href: '/for/supervisor',
      externalUrl: getServiceUrl('syncmavens'),
      externalLabel: isSw ? 'Zindua SyncMavens' : 'Launch SyncMavens',
      logo: ROLE_LOGOS['supervisor'],
      accent: 'var(--am)',
      desc: isSw
        ? 'Utoaji leseni za usawazishaji (sync) na utambulishaji wa matukio kwa AI umerahisishwa. Tafuta katalogi yetu maalum ya nyimbo zenye alama fiche na upate mdundo kamili wa filamu au kipindi cha TV.'
        : 'Sync licensing and AI scene-tagging made simple. Search our curated catalog of watermarked tracks and find the perfect vibe for your film or TV project.',
      preview: isSw ? supervisorDashActualSw : supervisorDashActualEn,
      previewTitle: isSw ? 'Utoaji Leseni za SyncMavens & Utafutaji wa Matukio kwa AI' : 'SyncMavens Sync Licensing & AI Scene Search'
    },
    {
      key: 'consumer',
      label: 'tunestream',
      sub: isSw ? 'Wasikilizaji wa Kila Siku' : 'Everyday Listeners',
      href: '/for/consumer',
      externalUrl: getServiceUrl('tunestream'),
      externalLabel: isSw ? 'Zindua TuneStream' : 'Launch TuneStream',
      logo: ROLE_LOGOS['consumer'],
      accent: '#10b981',
      desc: isSw
        ? 'Programu yetu ya watumiaji ya utiririshaji wa muziki. Sikiliza nyimbo unazopenda, wasaidie wasanii moja kwa moja kwa zawadi (tips), na usawazishe muziki wako nje ya mtandao.'
        : 'Our consumer streaming app. Listen to your favorite tracks, support creators directly with direct-tipping, and sync your music offline.',
      preview: isSw ? consumerDashActualSw : consumerDashActualEn,
      previewTitle: isSw ? 'Programu ya Utiririshaji wa Muziki ya Kiwango cha Juu ya TuneStream' : 'TuneStream Hi-Fi Music Streaming Application'
    },
    {
      key: 'corporate',
      label: isSw ? 'Mashirika & Biashara' : 'Corporate',
      sub: isSw ? 'Ufadhili & Matangazo' : 'Sponsorships & Ads',
      href: '/for/corporate',
      logo: ROLE_LOGOS['corporate'],
      accent: '#ef4444',
      desc: isSw
        ? 'Unganisha chapa na hadhira lengwa. Endesha kampeni, fadhili wasimamizi wa maudhui, na dhibiti matangazo asilia ya sauti.'
        : 'Connect brands with target audiences. Run campaigns, sponsor curators, and manage native audio ad placements.',
      preview: isSw ? corporateDashActualSw : corporateDashActualEn,
      previewTitle: isSw ? 'Dashibodi ya Matangazo ya Biashara & Ufadhili' : 'Corporate Advertising & Sponsorships Console'
    },
    {
      key: 'vc',
      label: isSw ? 'Wawekezaji wa Mitaji (VCs)' : 'Venture Capitalists',
      sub: isSw ? 'Ufadhili wa Ziara & Kazi za Wasanii' : 'Tour & Career Financing',
      href: '/for/vc',
      logo: ROLE_LOGOS['exec'] || ROLE_LOGOS['corporate'],
      accent: '#10b981',
      desc: isSw
        ? 'Wekeza kwenye ziara za moja kwa moja na ugharamie moja kwa moja huduma za wasanii ukiwa na urejeshaji wa fedha uliolindwa kupitia Split Cascade.'
        : 'Underwrite live tours and directly facilitate creator product and service costs with senior-secured Split Cascade recoupment.',
      preview: isSw ? vcDashActualSw : vcDashActualEn,
      previewTitle: isSw ? 'Kituo Kikuu cha Usimamizi wa Mitaji ya Ziara & Wasanii cha VC' : 'Tour & Creator Venture Capital Command Center'
    }
  ];

  return (
    <>
      <PageHeader 
        title={isSw ? "Mfumo Bora kwa Kila Mshirika Katika Sekta ya Muziki" : "Perfect For Every Seat in the Industry"} 
        bgImage={perfectForHeaderImg} 
        bgImageWestern={perfectForHeaderWesternImg} 
        breadcrumb={isSw ? "Inafaa Kwa" : "Perfect For"} 
      />
      <div className="container" style={{ padding: '60px 20px 80px' }}>
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '60px', maxWidth: '700px', margin: '0 auto 60px', fontSize: '16px', color: 'var(--mu)', lineHeight: 1.6 }}>
          {isSw 
            ? "TuneMavens inaratibu mfumo mzima wa sekta ya muziki. Chagua nafasi yako hapa chini ili uchunguze dashibodi maalum na zana zilizobuniwa mahususi kwa ajili ya kazi yako."
            : "TuneMavens coordinates the entire music ecosystem. Choose your role below to explore the custom dashboard and tools we build for your seat."
          }
        </p>

        <div className="pf-grid-page">
          {metaRoles.map((role) => (
            <div key={role.key} className="pf-card-page glass-panel" style={{ '--pf-accent': role.accent }}>
              <div className="pf-card-logo-container">
                <img src={role.logo} alt={role.label} className="pf-card-logo-img" />
              </div>
              <h3 className="pf-card-title">{role.label}</h3>
              <p className="pf-card-sub" style={{ color: role.accent }}>{role.sub}</p>
              <p className="pf-card-desc">{role.desc}</p>
              
              <div className="pf-card-preview-wrap" style={{ cursor: 'pointer', margin: '16px 0', overflow: 'hidden', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => setPreviewModal(role)}>
                <img src={role.preview} alt={`${role.label} preview`} style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                <div style={{ background: 'rgba(0,0,0,0.6)', padding: '6px 10px', fontSize: '11px', color: '#fff', textAlign: 'center' }}>
                  {isSw ? `Bofya ili kutazama mfumo kamili wa ${role.label}` : `Click to view full ${role.label} interface`}
                </div>
              </div>

              {role.externalUrl ? (
                <a href={role.externalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-cyan pf-card-btn" style={{ borderColor: role.accent, color: role.accent }}>
                  {role.externalLabel || (isSw ? `Gundua ${role.label}` : `Explore ${role.label}`)}
                </a>
              ) : (
                <Link to={role.href} className="btn btn-outline-cyan pf-card-btn" style={{ borderColor: role.accent, color: role.accent }}>
                  {isSw ? `Gundua ${role.label}` : `Explore ${role.label}`}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Full Size Preview Modal with 40% Larger Size and Vertical Scrolling */}
      {previewModal && (
        <div className="preview-modal-backdrop" onClick={() => setPreviewModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="preview-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', width: '1350px', maxHeight: '92vh', overflowY: 'auto', background: '#0a0d1d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '24px', position: 'relative' }}>
            <button className="preview-modal-close" onClick={() => setPreviewModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', zIndex: 10 }}>
              &times;
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: previewModal.accent }}></span>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>{previewModal.previewTitle || `${previewModal.label} Workspace`}</h3>
            </div>
            <div style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              <img src={previewModal.preview} alt={previewModal.label} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
