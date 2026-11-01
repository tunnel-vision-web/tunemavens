# Python script to update all role landing pages with localized actual screenshots, targeted visuals, and SEO favicons
import os
import re

BASE_DIR = os.path.abspath(r'apps/portal/src/views/landing/role-pages')

# ---------------- 1. UPDATE DJ LANDING PAGE ----------------
def update_dj():
    p = os.path.join(BASE_DIR, 'DjLandingPage.jsx')
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    # Imports
    c = re.sub(r"import headerImg from '\.\./\.\./\.\./assets/images/header_tools\.png'",
               "import djHero1Img from '../../../assets/images/dj_hero_1.png'\n"
               "import djHero2Img from '../../../assets/images/dj_hero_2.png'\n"
               "import djHero3Img from '../../../assets/images/dj_hero_3.png'\n"
               "import djHero4Img from '../../../assets/images/dj_hero_4.png'\n"
               "import djDashboardActualEn from '../../../assets/images/dj_dashboard_actual_en.png'\n"
               "import djDashboardActualSw from '../../../assets/images/dj_dashboard_actual_sw.png'\n"
               "import SEO from '../../../components/common/SEO.jsx'", c)
    c = re.sub(r"import appsLedgerImg from '[^']+'\s*", "", c)
    c = re.sub(r"import heroMusic4Img from '[^']+'\s*", "", c)
    c = re.sub(r"import heroMusic3Img from '[^']+'\s*", "", c)

    # State
    c = c.replace("const { formatPrice } = useRegion();",
                  "const { formatPrice, language } = useRegion();\n  const isSw = language === 'sw';\n  const [previewModal, setPreviewModal] = useState(false);")

    # Slides
    c = c.replace("image: headerImg", "image: djHero1Img")
    c = c.replace("image: appsLedgerImg", "image: djHero2Img")
    c = c.replace("image: heroMusic4Img", "image: djHero3Img")
    c = c.replace("image: heroMusic3Img", "image: djHero4Img")

    # SEO
    seo_block = """<div className="role-page-wrapper" style={{ '--role-accent': accent }}>
      <SEO 
        title="TuneDJ — Pioneer CDJ Record Pool, Stems & Dubplates"
        description="Pristine lossless record pools, stem separation clearances, and unreleased artist dubplates for club, festival, and touring DJs."
        favicon="/favicons/tunedj.png"
      />"""
    c = c.replace('<div className="role-page-wrapper" style={{ \'--role-accent\': accent }}>', seo_block)

    # Showcase image
    showcase_pattern = re.compile(r'<div className="role-showcase-image-wrap">[\s\S]*?<img src=\{appsLedgerImg\} alt="TuneMavens DJ Pool and Stem Clearance Engine" />[\s\S]*?</div>', re.MULTILINE)
    new_showcase = """<div className="role-showcase-image-wrap" style={{ cursor: 'pointer' }} onClick={() => setPreviewModal(true)}>
            <img 
              src={isSw ? djDashboardActualSw : djDashboardActualEn} 
              alt="Actual TuneMavens DJ Pool and Stem Clearance Engine" 
              style={{ borderRadius: '6px', border: '1px solid rgba(20, 184, 166, 0.4)', boxShadow: '0 16px 40px rgba(0,0,0,0.7)', width: '100%', height: 'auto' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#14b8a6', fontWeight: 600, textAlign: 'center' }}>
              Click to view high-resolution interactive dashboard preview ({isSw ? 'Kiswahili' : 'English'})
            </div>
          </div>"""
    c = showcase_pattern.sub(new_showcase, c)

    # Modal
    modal_code = """      {/* High-Resolution Screenshot Modal */}
      {previewModal && (
        <div className="preview-modal-backdrop" onClick={() => setPreviewModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '95vw', maxHeight: '95vh', overflow: 'auto', position: 'relative', background: '#090d1f', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '3px', padding: '20px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '3px', cursor: 'pointer' }}>
              <RiCloseFill size={20} />
            </button>
            <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 14px 0' }}>TuneDJ Pool & Stem Clearance Console · Actual System Interface</h3>
            <img src={isSw ? djDashboardActualSw : djDashboardActualEn} alt="Actual System Screenshot" style={{ width: '100%', height: 'auto', borderRadius: '3px' }} />
          </div>
        </div>
      )}
    </div>
  );
}"""
    idx = c.rfind("    </div>\n  );\n}")
    if idx != -1:
        c = c[:idx] + modal_code

    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated DjLandingPage.jsx")

# ---------------- 2. UPDATE LABEL LANDING PAGE ----------------
def update_label():
    p = os.path.join(BASE_DIR, 'LabelLandingPage.jsx')
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    c = re.sub(r"import distributeHeroImg from '\.\./\.\./\.\./assets/images/distribute_hero\.png'",
               "import labelHero1Img from '../../../assets/images/label_hero_1.png'\n"
               "import labelHero2Img from '../../../assets/images/label_hero_2.png'\n"
               "import labelHero3Img from '../../../assets/images/label_hero_3.png'\n"
               "import labelHero4Img from '../../../assets/images/label_hero_4.png'\n"
               "import labelDashboardActualEn from '../../../assets/images/label_dashboard_actual_en.png'\n"
               "import labelDashboardActualSw from '../../../assets/images/label_dashboard_actual_sw.png'\n"
               "import SEO from '../../../components/common/SEO.jsx'", c)
    c = re.sub(r"import appsLedgerImg from '[^']+'\s*", "", c)
    c = re.sub(r"import publishingMockupImg from '[^']+'\s*", "", c)
    c = re.sub(r"import tourDashboardMockupImg from '[^']+'\s*", "", c)

    c = c.replace("const { formatPrice } = useRegion();",
                  "const { formatPrice, language } = useRegion();\n  const isSw = language === 'sw';\n  const [previewModal, setPreviewModal] = useState(false);")

    c = c.replace("image: distributeHeroImg", "image: labelHero1Img")
    c = c.replace("image: appsLedgerImg", "image: labelHero2Img")
    c = c.replace("image: publishingMockupImg", "image: labelHero3Img")
    c = c.replace("image: tourDashboardMockupImg", "image: labelHero4Img")

    seo_block = """<div className="role-page-wrapper" style={{ '--role-accent': accent }}>
      <SEO 
        title="TuneLabel — Record Label Management, DDEX & Split Cascade"
        description="The operating system for independent and major record labels. Multi-artist catalog ingestion, DDEX ERN 4.3 distribution, and Split Cascade escrow ledgers."
        favicon="/favicons/tunelabel.png"
      />"""
    c = c.replace('<div className="role-page-wrapper" style={{ \'--role-accent\': accent }}>', seo_block)

    showcase_pattern = re.compile(r'<div className="role-showcase-image-wrap">[\s\S]*?<img src=\{distributeHeroImg\} alt="TuneMavens Label Console and Distribution" />[\s\S]*?</div>', re.MULTILINE)
    new_showcase = """<div className="role-showcase-image-wrap" style={{ cursor: 'pointer' }} onClick={() => setPreviewModal(true)}>
            <img 
              src={isSw ? labelDashboardActualSw : labelDashboardActualEn} 
              alt="Actual TuneMavens Label Console and Distribution" 
              style={{ borderRadius: '6px', border: '1px solid rgba(168, 85, 247, 0.4)', boxShadow: '0 16px 40px rgba(0,0,0,0.7)', width: '100%', height: 'auto' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#a855f7', fontWeight: 600, textAlign: 'center' }}>
              Click to view high-resolution interactive dashboard preview ({isSw ? 'Kiswahili' : 'English'})
            </div>
          </div>"""
    c = showcase_pattern.sub(new_showcase, c)

    modal_code = """      {/* High-Resolution Screenshot Modal */}
      {previewModal && (
        <div className="preview-modal-backdrop" onClick={() => setPreviewModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '95vw', maxHeight: '95vh', overflow: 'auto', position: 'relative', background: '#090d1f', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '3px', padding: '20px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '3px', cursor: 'pointer' }}>
              <RiCloseFill size={20} />
            </button>
            <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 14px 0' }}>TuneLabel Executive Console · Actual System Interface</h3>
            <img src={isSw ? labelDashboardActualSw : labelDashboardActualEn} alt="Actual System Screenshot" style={{ width: '100%', height: 'auto', borderRadius: '3px' }} />
          </div>
        </div>
      )}
    </div>
  );
}"""
    idx = c.rfind("    </div>\n  );\n}")
    if idx != -1:
        c = c[:idx] + modal_code

    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated LabelLandingPage.jsx")

# ---------------- 3. UPDATE CORPORATE LANDING PAGE ----------------
def update_corporate():
    p = os.path.join(BASE_DIR, 'CorporateLandingPage.jsx')
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    c = re.sub(r"import userManagerImg from '\.\./\.\./\.\./assets/images/user_manager\.png'",
               "import corporateDashboardActualEn from '../../../assets/images/corporate_dashboard_actual_en.png'\n"
               "import corporateDashboardActualSw from '../../../assets/images/corporate_dashboard_actual_sw.png'\n"
               "import SEO from '../../../components/common/SEO.jsx'", c)

    c = c.replace("const { formatPrice } = useRegion();",
                  "const { formatPrice, language } = useRegion();\n  const isSw = language === 'sw';\n  const [previewModal, setPreviewModal] = useState(false);")

    seo_block = """<div className="role-page-wrapper" style={{ '--role-accent': accent }}>
      <SEO 
        title="TuneCorp — Brand Audio Ads, Sponsorships & CRM Attribution"
        description="Direct-to-creator audio brand sponsorships, live tour title partnerships, and multi-channel attribution across Africa and global diaspora."
        favicon="/favicons/tunecorp.png"
      />"""
    c = c.replace('<div className="role-page-wrapper" style={{ \'--role-accent\': accent }}>', seo_block)

    showcase_pattern = re.compile(r'<div className="role-showcase-image-wrap">[\s\S]*?<img src=\{userManagerImg\} alt="TuneMavens Corporate Campaign and CRM Management" />[\s\S]*?</div>', re.MULTILINE)
    new_showcase = """<div className="role-showcase-image-wrap" style={{ cursor: 'pointer' }} onClick={() => setPreviewModal(true)}>
            <img 
              src={isSw ? corporateDashboardActualSw : corporateDashboardActualEn} 
              alt="Actual TuneMavens Corporate Campaign and CRM Management" 
              style={{ borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.4)', boxShadow: '0 16px 40px rgba(0,0,0,0.7)', width: '100%', height: 'auto' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#3b82f6', fontWeight: 600, textAlign: 'center' }}>
              Click to view high-resolution interactive dashboard preview ({isSw ? 'Kiswahili' : 'English'})
            </div>
          </div>"""
    c = showcase_pattern.sub(new_showcase, c)

    modal_code = """      {/* High-Resolution Screenshot Modal */}
      {previewModal && (
        <div className="preview-modal-backdrop" onClick={() => setPreviewModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '95vw', maxHeight: '95vh', overflow: 'auto', position: 'relative', background: '#090d1f', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '3px', padding: '20px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '3px', cursor: 'pointer' }}>
              <RiCloseFill size={20} />
            </button>
            <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 14px 0' }}>TuneCorp Brand Advertising Console · Actual System Interface</h3>
            <img src={isSw ? corporateDashboardActualSw : corporateDashboardActualEn} alt="Actual System Screenshot" style={{ width: '100%', height: 'auto', borderRadius: '3px' }} />
          </div>
        </div>
      )}
    </div>
  );
}"""
    idx = c.rfind("    </div>\n  );\n}")
    if idx != -1:
        c = c[:idx] + modal_code

    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated CorporateLandingPage.jsx")

# ---------------- 4. UPDATE MEDIAHOUSE LANDING PAGE ----------------
def update_mediahouse():
    p = os.path.join(BASE_DIR, 'MediaHouseLandingPage.jsx')
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    c = re.sub(r"import publishingMockupImg from '\.\./\.\./\.\./assets/images/publishing_dashboard_mockup\.png'",
               "import mediahouseDashboardActualEn from '../../../assets/images/mediahouse_dashboard_actual_en.png'\n"
               "import mediahouseDashboardActualSw from '../../../assets/images/mediahouse_dashboard_actual_sw.png'\n"
               "import SEO from '../../../components/common/SEO.jsx'", c)

    c = c.replace("const { formatPrice } = useRegion();",
                  "const { formatPrice, language } = useRegion();\n  const isSw = language === 'sw';\n  const [previewModal, setPreviewModal] = useState(false);")

    seo_block = """<div className="role-page-wrapper" style={{ '--role-accent': accent }}>
      <SEO 
        title="TuneMedia — Radio Syndication & Broadcasting Rights Desk"
        description="Automated broadcast cue sheet generation, synchronized web radio streams, and instant mechanical royalty clearing for media networks."
        favicon="/favicons/tunemedia.png"
      />"""
    c = c.replace('<div className="role-page-wrapper" style={{ \'--role-accent\': accent }}>', seo_block)

    showcase_pattern = re.compile(r'<div className="role-showcase-image-wrap">[\s\S]*?<img src=\{publishingMockupImg\} alt="TuneMavens Media Broadcast Rights and Syndication Engine" />[\s\S]*?</div>', re.MULTILINE)
    new_showcase = """<div className="role-showcase-image-wrap" style={{ cursor: 'pointer' }} onClick={() => setPreviewModal(true)}>
            <img 
              src={isSw ? mediahouseDashboardActualSw : mediahouseDashboardActualEn} 
              alt="Actual TuneMavens Media Broadcast Rights and Syndication Engine" 
              style={{ borderRadius: '6px', border: '1px solid rgba(244, 63, 94, 0.4)', boxShadow: '0 16px 40px rgba(0,0,0,0.7)', width: '100%', height: 'auto' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#f43f5e', fontWeight: 600, textAlign: 'center' }}>
              Click to view high-resolution interactive dashboard preview ({isSw ? 'Kiswahili' : 'English'})
            </div>
          </div>"""
    c = showcase_pattern.sub(new_showcase, c)

    modal_code = """      {/* High-Resolution Screenshot Modal */}
      {previewModal && (
        <div className="preview-modal-backdrop" onClick={() => setPreviewModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '95vw', maxHeight: '95vh', overflow: 'auto', position: 'relative', background: '#090d1f', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '3px', padding: '20px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '3px', cursor: 'pointer' }}>
              <RiCloseFill size={20} />
            </button>
            <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 14px 0' }}>TuneMedia Broadcast Console · Actual System Interface</h3>
            <img src={isSw ? mediahouseDashboardActualSw : mediahouseDashboardActualEn} alt="Actual System Screenshot" style={{ width: '100%', height: 'auto', borderRadius: '3px' }} />
          </div>
        </div>
      )}
    </div>
  );
}"""
    idx = c.rfind("    </div>\n  );\n}")
    if idx != -1:
        c = c[:idx] + modal_code

    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated MediaHouseLandingPage.jsx")

# ---------------- 5. UPDATE SUPERVISOR LANDING PAGE ----------------
def update_supervisor():
    p = os.path.join(BASE_DIR, 'SupervisorLandingPage.jsx')
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    c = re.sub(r"import userSupervisorImg from '\.\./\.\./\.\./assets/images/user_supervisor\.png'",
               "import supervisorDashboardActualEn from '../../../assets/images/supervisor_dashboard_actual_en.png'\n"
               "import supervisorDashboardActualSw from '../../../assets/images/supervisor_dashboard_actual_sw.png'\n"
               "import SEO from '../../../components/common/SEO.jsx'", c)

    c = c.replace("const { formatPrice } = useRegion();",
                  "const { formatPrice, language } = useRegion();\n  const isSw = language === 'sw';\n  const [previewModal, setPreviewModal] = useState(false);")

    seo_block = """<div className="role-page-wrapper" style={{ '--role-accent': accent }}>
      <SEO 
        title="SyncMavens — AI-Assisted Film & TV Sync Marketplace"
        description="Connect film supervisors, advertising agencies, and game studios with 100% pre-cleared African and diaspora commercial tracks with executed split sheets."
        favicon="/favicons/syncmavens.png"
      />"""
    c = c.replace('<div className="role-page-wrapper" style={{ \'--role-accent\': accent }}>', seo_block)

    showcase_pattern = re.compile(r'<div className="role-showcase-image-wrap">[\s\S]*?<img src=\{userSupervisorImg\} alt="TuneMavens Sync Licensing Engine" />[\s\S]*?</div>', re.MULTILINE)
    new_showcase = """<div className="role-showcase-image-wrap" style={{ cursor: 'pointer' }} onClick={() => setPreviewModal(true)}>
            <img 
              src={isSw ? supervisorDashboardActualSw : supervisorDashboardActualEn} 
              alt="Actual TuneMavens Sync Licensing Engine" 
              style={{ borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.4)', boxShadow: '0 16px 40px rgba(0,0,0,0.7)', width: '100%', height: 'auto' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#f59e0b', fontWeight: 600, textAlign: 'center' }}>
              Click to view high-resolution interactive dashboard preview ({isSw ? 'Kiswahili' : 'English'})
            </div>
          </div>"""
    c = showcase_pattern.sub(new_showcase, c)

    modal_code = """      {/* High-Resolution Screenshot Modal */}
      {previewModal && (
        <div className="preview-modal-backdrop" onClick={() => setPreviewModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '95vw', maxHeight: '95vh', overflow: 'auto', position: 'relative', background: '#090d1f', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '3px', padding: '20px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '3px', cursor: 'pointer' }}>
              <RiCloseFill size={20} />
            </button>
            <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 14px 0' }}>SyncMavens Supervisor Deal Desk · Actual System Interface</h3>
            <img src={isSw ? supervisorDashboardActualSw : supervisorDashboardActualEn} alt="Actual System Screenshot" style={{ width: '100%', height: 'auto', borderRadius: '3px' }} />
          </div>
        </div>
      )}
    </div>
  );
}"""
    idx = c.rfind("    </div>\n  );\n}")
    if idx != -1:
        c = c[:idx] + modal_code

    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated SupervisorLandingPage.jsx")

# ---------------- 6. UPDATE CONSUMER LANDING PAGE ----------------
def update_consumer():
    p = os.path.join(BASE_DIR, 'ConsumerLandingPage.jsx')
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    c = re.sub(r"import consumerAppImg from '\.\./\.\./\.\./assets/images/consumer_app\.png'",
               "import consumerDashboardActualEn from '../../../assets/images/consumer_dashboard_actual_en.png'\n"
               "import consumerDashboardActualSw from '../../../assets/images/consumer_dashboard_actual_sw.png'\n"
               "import SEO from '../../../components/common/SEO.jsx'", c)

    c = c.replace("const { formatPrice } = useRegion();",
                  "const { formatPrice, language } = useRegion();\n  const isSw = language === 'sw';\n  const [previewModal, setPreviewModal] = useState(false);")

    seo_block = """<div className="role-page-wrapper" style={{ '--role-accent': accent }}>
      <SEO 
        title="TuneStream — Music Streaming Built for Creators"
        description="High-fidelity 24-bit FLAC audio, direct artist credit tipping, and offline caching with zero monthly subscriptions."
        favicon="/favicons/tunestream.png"
      />"""
    c = c.replace('<div className="role-page-wrapper" style={{ \'--role-accent\': accent }}>', seo_block)

    showcase_pattern = re.compile(r'<div className="role-showcase-image-wrap">[\s\S]*?<img src=\{consumerAppImg\} alt="TuneMavens Consumer Streaming Experience" />[\s\S]*?</div>', re.MULTILINE)
    new_showcase = """<div className="role-showcase-image-wrap" style={{ cursor: 'pointer' }} onClick={() => setPreviewModal(true)}>
            <img 
              src={isSw ? consumerDashboardActualSw : consumerDashboardActualEn} 
              alt="Actual TuneMavens Consumer Streaming Experience" 
              style={{ borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: '0 16px 40px rgba(0,0,0,0.7)', width: '100%', height: 'auto' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#10b981', fontWeight: 600, textAlign: 'center' }}>
              Click to view high-resolution interactive dashboard preview ({isSw ? 'Kiswahili' : 'English'})
            </div>
          </div>"""
    c = showcase_pattern.sub(new_showcase, c)

    modal_code = """      {/* High-Resolution Screenshot Modal */}
      {previewModal && (
        <div className="preview-modal-backdrop" onClick={() => setPreviewModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '95vw', maxHeight: '95vh', overflow: 'auto', position: 'relative', background: '#090d1f', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '3px', padding: '20px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '3px', cursor: 'pointer' }}>
              <RiCloseFill size={20} />
            </button>
            <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 14px 0' }}>TuneStream Hi-Fi Player Console · Actual System Interface</h3>
            <img src={isSw ? consumerDashboardActualSw : consumerDashboardActualEn} alt="Actual System Screenshot" style={{ width: '100%', height: 'auto', borderRadius: '3px' }} />
          </div>
        </div>
      )}
    </div>
  );
}"""
    idx = c.rfind("    </div>\n  );\n}")
    if idx != -1:
        c = c[:idx] + modal_code

    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated ConsumerLandingPage.jsx")

# ---------------- 7. UPDATE CREATOR LANDING PAGE ----------------
def update_creator():
    p = os.path.join(BASE_DIR, 'CreatorLandingPage.jsx')
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    c = re.sub(r"import creatorDashboardImg from '\.\./\.\./\.\./assets/images/creator_dashboard\.png'",
               "import creatorDashboardActualEn from '../../../assets/images/creator_dashboard_actual_en.png'\n"
               "import creatorDashboardActualSw from '../../../assets/images/creator_dashboard_actual_sw.png'\n"
               "import SEO from '../../../components/common/SEO.jsx'", c)

    c = c.replace("const { formatPrice } = useRegion();",
                  "const { formatPrice, language } = useRegion();\n  const isSw = language === 'sw';\n  const [previewModal, setPreviewModal] = useState(false);")

    c = c.replace("image: creatorDashboardImg", "image: (language === 'sw' ? creatorDashboardActualSw : creatorDashboardActualEn)")

    seo_block = """<div className="role-page-wrapper" style={{ '--role-accent': accent }}>
      <SEO 
        title="TuneCreators — Music Operations, AI Mastering & Global Splits"
        description="Catalog ingestion, MasterLab AI mastering, DDEX distribution, and programmatic Split Cascade ledgers for independent music creators."
        favicon="/favicons/tunecreators.png"
      />"""
    c = c.replace('<div className="role-page-wrapper" style={{ \'--role-accent\': accent }}>', seo_block)

    showcase_pattern = re.compile(r'<div className="role-showcase-image-wrap">[\s\S]*?<img src=\{creatorDashboardImg\} alt="TuneMavens Creator Dashboard Console" />[\s\S]*?</div>', re.MULTILINE)
    new_showcase = """<div className="role-showcase-image-wrap" style={{ cursor: 'pointer' }} onClick={() => setPreviewModal(true)}>
            <img 
              src={isSw ? creatorDashboardActualSw : creatorDashboardActualEn} 
              alt="Actual TuneMavens Creator Dashboard Console" 
              style={{ borderRadius: '6px', border: '1px solid rgba(0, 240, 255, 0.4)', boxShadow: '0 16px 40px rgba(0,0,0,0.7)', width: '100%', height: 'auto' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#00f0ff', fontWeight: 600, textAlign: 'center' }}>
              Click to view high-resolution interactive dashboard preview ({isSw ? 'Kiswahili' : 'English'})
            </div>
          </div>"""
    c = showcase_pattern.sub(new_showcase, c)

    modal_code = """      {/* High-Resolution Screenshot Modal */}
      {previewModal && (
        <div className="preview-modal-backdrop" onClick={() => setPreviewModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '95vw', maxHeight: '95vh', overflow: 'auto', position: 'relative', background: '#090d1f', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '3px', padding: '20px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '3px', cursor: 'pointer' }}>
              <RiCloseFill size={20} />
            </button>
            <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 14px 0' }}>TuneCreators Studio Console · Actual System Interface</h3>
            <img src={isSw ? creatorDashboardActualSw : creatorDashboardActualEn} alt="Actual System Screenshot" style={{ width: '100%', height: 'auto', borderRadius: '3px' }} />
          </div>
        </div>
      )}
    </div>
  );
}"""
    idx = c.rfind("    </div>\n  );\n}")
    if idx != -1:
        c = c[:idx] + modal_code

    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated CreatorLandingPage.jsx")

# ---------------- 8. UPDATE PODCASTER LANDING PAGE ----------------
def update_podcaster():
    p = os.path.join(BASE_DIR, 'PodcasterLandingPage.jsx')
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    # Import SW screenshot
    if 'creator_dashboard_actual_sw.png' not in c:
        c = c.replace("import creatorDashboardActualEn from '../../../assets/images/creator_dashboard_actual_en.png'",
                      "import creatorDashboardActualEn from '../../../assets/images/creator_dashboard_actual_en.png'\n"
                      "import creatorDashboardActualSw from '../../../assets/images/creator_dashboard_actual_sw.png'\n"
                      "import SEO from '../../../components/common/SEO.jsx'")

    c = c.replace("const { formatPrice } = useRegion();",
                  "const { formatPrice, language } = useRegion();\n  const isSw = language === 'sw';")

    seo_block = """<div className="role-landing-view podcaster-landing-view" data-testid="podcaster-landing-page">
      <SEO 
        title="TunePod — Podcaster Studio, Dynamic Ads & Show Monetization"
        description="The operating system for podcasters, voice artists, and talk shows across Africa and global diaspora."
        favicon="/favicons/tunepod.png"
      />"""
    c = c.replace('<div className="role-landing-view podcaster-landing-view" data-testid="podcaster-landing-page">', seo_block)

    c = c.replace("src={creatorDashboardActualEn}", "src={isSw ? creatorDashboardActualSw : creatorDashboardActualEn}")
    c = c.replace("Click to view high-resolution interactive dashboard preview", "Click to view high-resolution interactive dashboard preview ({isSw ? 'Kiswahili' : 'English'})")

    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated PodcasterLandingPage.jsx")

if __name__ == '__main__':
    update_dj()
    update_label()
    update_corporate()
    update_mediahouse()
    update_supervisor()
    update_consumer()
    update_creator()
    update_podcaster()
    print("ALL 8 ROLE LANDING PAGES FULLY UPDATED AND LOCALIZED!")
