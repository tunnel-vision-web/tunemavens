import React, { useState, useEffect } from 'react';
import {
  RiCloseFill, RiSmartphoneFill, RiAppleFill, RiDownloadFill,
  RiCheckFill, RiFileCopyLine, RiExternalLinkLine, RiTerminalBoxFill,
  RiCompass3Fill, RiAndroidFill, RiShieldCheckFill,
  RiDownload2Fill, RiFlashlightFill, RiShareBoxFill, RiGooglePlayFill,
  RiRefreshLine, RiSparklingFill
} from 'react-icons/ri';
import tsLogo from '../../assets/logos/tunestream-logo.png';

export default function AppDownloadModal({
  isOpen,
  onClose,
  onLaunchSimulator,
  defaultPlatform = 'all' // 'ios' | 'android' | 'stores' | 'all'
}) {
  const [deviceType, setDeviceType] = useState('desktop'); // 'ios' | 'android' | 'desktop'
  const [activeTab, setActiveTab] = useState('stores'); // 'stores' | 'install' | 'apk' | 'simulator'
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installStatus, setInstallStatus] = useState('idle'); // 'idle' | 'installing' | 'installed'
  const [copiedCode, setCopiedCode] = useState(false);

  // Detect user's current device on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
        setDeviceType('ios');
      } else if (/android/i.test(ua)) {
        setDeviceType('android');
      } else {
        setDeviceType('desktop');
      }
    }
  }, []);

  // Listen for native PWA beforeinstallprompt event (Chrome, Edge, Android)
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Set default tab based on platform or device
  useEffect(() => {
    if (defaultPlatform === 'android') {
      setActiveTab('stores');
    } else if (defaultPlatform === 'ios') {
      setActiveTab('stores');
    } else if (defaultPlatform === 'simulator') {
      setActiveTab('simulator');
    } else {
      setActiveTab('stores');
    }
  }, [defaultPlatform, isOpen]);

  if (!isOpen) return null;

  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const standaloneUrl = isLocal ? 'http://localhost:3001/#/native' : 'https://tunestream.co/#/native';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(standaloneUrl)}&color=10-185-129&bgcolor=6-8-19`;

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleOpenStandalone = () => {
    window.location.href = standaloneUrl;
  };

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      setInstallStatus('installing');
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setInstallStatus('installed');
        } else {
          setInstallStatus('idle');
        }
      } catch (err) {
        console.error('Install error:', err);
        setInstallStatus('idle');
      }
      setDeferredPrompt(null);
    } else {
      window.location.href = standaloneUrl;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(10px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#090e1f',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '4px',
        maxWidth: '580px',
        width: '100%',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          background: 'rgba(6, 8, 19, 0.98)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={tsLogo} alt="TuneStream" style={{ height: '28px', width: 'auto' }} />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                TuneStream Native App
                <span style={{
                  fontSize: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  fontWeight: 700
                }}>
                  iOS &amp; Android
                </span>
              </h3>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                Apple App Store &bull; Google Play Store &bull; Live Device Updates
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex'
            }}
          >
            <RiCloseFill size={22} />
          </button>
        </div>

        {/* Tab Selection */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0,0,0,0.25)'
        }}>
          {[
            { id: 'stores', label: 'App Store & Google Play', icon: RiAppleFill },
            { id: 'install', label: 'Instant Web Install', icon: RiSmartphoneFill },
            { id: 'apk', label: 'Direct APK', icon: RiAndroidFill },
            { id: 'simulator', label: 'Browser Simulator', icon: RiCompass3Fill }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '11px 4px',
                  background: isActive ? 'rgba(16, 185, 129, 0.14)' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #10b981' : '2px solid transparent',
                  color: isActive ? '#10b981' : '#94a3b8',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', color: '#cbd5e1', fontSize: '12.5px', lineHeight: 1.55 }}>
          
          {/* TAB 1: App Store & Google Play Official Channels */}
          {activeTab === 'stores' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0, 242, 254, 0.08))',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '3px',
                padding: '12px 14px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RiSparklingFill color="#10b981" /> Official Store Distribution &amp; Background Updates
                </div>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#94a3b8' }}>
                  TuneStream is packaged as a real native app with its own dedicated home screen icon, background audio service, and automated store updates — identical to apps by leading tech companies.
                </p>
              </div>

              {/* Store Options Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                
                {/* Apple App Store & TestFlight */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <RiAppleFill size={22} color="#fff" />
                      <div>
                        <div style={{ fontWeight: 800, color: '#fff', fontSize: '13px' }}>Apple iOS</div>
                        <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>iPhone &bull; iPad &bull; CarPlay</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 10px' }}>
                      Packaged via Xcode workspace (<code>co.tunestream.app</code>). Includes Apple TestFlight for 1-tap installation on iPhone with automated background updates.
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <a
                      href="https://testflight.apple.com/join/tunestream"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        console.log('Opening TestFlight...');
                      }}
                      style={{
                        background: '#0071e3',
                        color: '#fff',
                        textDecoration: 'none',
                        padding: '8px 10px',
                        borderRadius: '3px',
                        fontWeight: 700,
                        fontSize: '11.5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <RiAppleFill size={15} /> Open in Apple TestFlight
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy('https://testflight.apple.com/join/tunestream')}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#94a3b8',
                        padding: '6px',
                        borderRadius: '3px',
                        fontSize: '10.5px',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedCode ? 'Link Copied!' : 'Copy TestFlight Beta Invite'}
                    </button>
                  </div>
                </div>

                {/* Google Play Store */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <RiGooglePlayFill size={22} color="#10b981" />
                      <div>
                        <div style={{ fontWeight: 800, color: '#fff', fontSize: '13px' }}>Google Play</div>
                        <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>Android 9.0+ &bull; Auto-Update</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 10px' }}>
                      Packaged as Android App Bundle (<code>.aab</code>) and APK. Google Play In-App Updates deliver seamless updates in the background.
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <a
                      href="https://play.google.com/store/apps/details?id=co.tunestream.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        console.log('Opening Google Play...');
                      }}
                      style={{
                        background: '#10b981',
                        color: '#060813',
                        textDecoration: 'none',
                        padding: '8px 10px',
                        borderRadius: '3px',
                        fontWeight: 800,
                        fontSize: '11.5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <RiGooglePlayFill size={15} /> Get on Google Play
                    </a>
                    <button
                      type="button"
                      onClick={() => setActiveTab('apk')}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#94a3b8',
                        padding: '6px',
                        borderRadius: '3px',
                        fontSize: '10.5px',
                        cursor: 'pointer'
                      }}
                    >
                      Download Direct APK Sideload &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* Native Specs Footer */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '12px',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px'
              }}>
                <div>
                  <span style={{ color: '#fff', fontWeight: 700 }}>Package ID:</span> <code>co.tunestream.app</code> &bull; <span style={{ color: '#fff', fontWeight: 700 }}>Version:</span> 1.0.0
                </div>
                <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                  <RiRefreshLine size={13} /> Continuous CI/CD Active
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Instant Web Install (PWA / WebAPK) */}
          {activeTab === 'install' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {deviceType === 'ios' ? (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(0, 242, 254, 0.08))',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: '3px',
                  padding: '14px'
                }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RiAppleFill color="#10b981" size={18} /> Instant iPhone Home Screen Install:
                  </div>
                  <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#f1f5f9', lineHeight: 1.6 }}>
                    <li>Tap the green <strong>"Launch TuneStream in Safari"</strong> button below.</li>
                    <li>In Safari, tap the <strong>Share</strong> button <span style={{ color: '#00f2fe', fontWeight: 800 }}>[↑]</span> at the bottom of your iPhone.</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                    <li>Tap <strong>Add</strong> (top-right).</li>
                  </ol>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '3px',
                  padding: '12px'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RiFlashlightFill color="#10b981" /> 1-Tap Direct WebAPK Installation
                  </div>
                  <p style={{ margin: 0, fontSize: '11.5px', color: '#94a3b8' }}>
                    Install TuneStream directly to your phone screen. Runs standalone with no browser URL bar, native lock-screen media notifications, 8GB smart offline crate, and direct 1-tap creator tipping.
                  </p>
                </div>
              )}

              {/* Install Action Button */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={handleNativeInstall}
                  style={{
                    flex: 1,
                    background: '#10b981',
                    color: '#060813',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '12px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {deviceType === 'ios' ? (
                    <>
                      <RiShareBoxFill size={18} /> Launch TuneStream in Safari (Then Tap Share [↑])
                    </>
                  ) : (
                    <>
                      <RiDownloadFill size={18} />
                      {installStatus === 'installing' ? 'Installing...' : installStatus === 'installed' ? 'Installed Successfully!' : 'Install TuneStream on This Device'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleOpenStandalone}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '3px',
                    padding: '12px 16px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RiExternalLinkLine size={16} /> Open Web App
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Direct APK */}
          {activeTab === 'apk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '3px',
                padding: '12px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RiAndroidFill color="#10b981" /> Standalone Android APK File (.apk)
                </div>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#94a3b8' }}>
                  Direct download package for Android phones. Sits directly in the app drawer with its own app icon and offline caching.
                </p>
              </div>

              <div style={{
                background: '#04060d',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '3px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: '13px' }}>TuneStream-release.apk</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    Package: <code>co.tunestream.app</code> &bull; Size: ~8.4 MB
                  </div>
                </div>
                <a
                  href="/downloads/tunestream.apk"
                  download="tunestream.apk"
                  style={{
                    background: '#10b981',
                    color: '#060813',
                    textDecoration: 'none',
                    padding: '9px 16px',
                    borderRadius: '2px',
                    fontWeight: 800,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RiDownload2Fill size={16} /> Download .APK
                </a>
              </div>
            </div>
          )}

          {/* TAB 4: Simulator */}
          {activeTab === 'simulator' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                background: 'rgba(0, 242, 254, 0.08)',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                borderRadius: '3px',
                padding: '12px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                  Live In-Browser Phone Simulator
                </div>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#94a3b8' }}>
                  Test all features inside the interactive titanium mobile chassis directly in your browser.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onLaunchSimulator) onLaunchSimulator();
                  }}
                  style={{
                    flex: 1,
                    background: '#00f2fe',
                    color: '#060813',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '12px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <RiSmartphoneFill size={18} /> Launch Phone Chassis Simulator
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
