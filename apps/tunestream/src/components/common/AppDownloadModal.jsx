import React, { useState, useEffect } from 'react';
import {
  RiCloseFill, RiSmartphoneFill, RiAppleFill, RiDownloadFill,
  RiCheckFill, RiFileCopyLine, RiExternalLinkLine, RiTerminalBoxFill,
  RiCompass3Fill, RiQrCodeLine, RiAndroidFill, RiShieldCheckFill,
  RiDownload2Fill, RiFlashlightFill
} from 'react-icons/ri';
import tsLogo from '../../assets/tunestream-logo.png';

export default function AppDownloadModal({
  isOpen,
  onClose,
  onLaunchSimulator,
  defaultPlatform = 'all' // 'ios' | 'android' | 'all'
}) {
  const [deviceType, setDeviceType] = useState('desktop'); // 'ios' | 'android' | 'desktop'
  const [activeTab, setActiveTab] = useState('install'); // 'install' | 'apk' | 'simulator' | 'developer'
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installStatus, setInstallStatus] = useState('idle'); // 'idle' | 'installing' | 'installed'
  const [copiedCode, setCopiedCode] = useState(false);

  // Detect user's current device on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      if (/android/i.test(ua)) {
        setDeviceType('android');
      } else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
        setDeviceType('ios');
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
      setActiveTab('apk');
    } else if (defaultPlatform === 'ios') {
      setActiveTab('install');
    } else {
      setActiveTab('install');
    }
  }, [defaultPlatform, isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleOpenStandalone = () => {
    window.open('/#/native', '_blank');
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
      // If prompt isn't directly triggered, open standalone /#/native so user can use browser install menu
      window.location.hash = '/native';
      onClose();
    }
  };

  // Live URL for QR code scan
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://tunestream.co';
  const installUrl = `${currentOrigin}/#/native`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(installUrl)}&color=10-185-129&bgcolor=6-8-19`;

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
        maxWidth: '560px',
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
                Download TuneStream App
                <span style={{
                  fontSize: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  fontWeight: 700
                }}>
                  v1.0 Native
                </span>
              </h3>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                {deviceType === 'ios' ? '📱 iOS Device Detected' : deviceType === 'android' ? '🤖 Android Device Detected' : '💻 Install on Phone & Mobile Devices'}
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
            { id: 'install', label: 'Install on Phone', icon: RiSmartphoneFill },
            { id: 'apk', label: 'Direct APK', icon: RiAndroidFill },
            { id: 'simulator', label: 'Live Simulator', icon: RiCompass3Fill },
            { id: 'developer', label: 'Capacitor / Stores', icon: RiTerminalBoxFill }
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
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', color: '#cbd5e1', fontSize: '12.5px', lineHeight: 1.55 }}>
          {/* TAB 1: Install on Phone (PWA / WebAPK) */}
          {activeTab === 'install' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '3px',
                padding: '12px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RiFlashlightFill color="#10b981" /> 1-Tap Direct Install on Individual Devices
                </div>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#94a3b8' }}>
                  Install TuneStream directly to any listener's phone screen. Runs standalone with no browser URL bar, native lock-screen media notifications, 8GB smart offline crate, and direct 1-tap creator tipping.
                </p>
              </div>

              {/* If on Desktop: Provide QR Code to beam to Phone */}
              {deviceType === 'desktop' && (
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  background: 'rgba(0,0,0,0.35)',
                  padding: '14px',
                  borderRadius: '3px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  alignItems: 'center'
                }}>
                  <div style={{
                    background: '#060813',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    flexShrink: 0
                  }}>
                    <img
                      src={qrCodeUrl}
                      alt="Scan to Install TuneStream"
                      style={{ width: '110px', height: '110px', display: 'block', borderRadius: '2px' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                      Scan with Phone Camera
                    </div>
                    <p style={{ margin: '0 0 10px', fontSize: '11.5px', color: '#94a3b8' }}>
                      Point your phone's camera at this QR code to open and install TuneStream directly onto your personal iOS or Android device.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy(installUrl)}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        borderRadius: '2px',
                        padding: '6px 10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <RiFileCopyLine size={13} /> {copiedCode ? 'Link Copied!' : 'Copy Direct Install Link'}
                    </button>
                  </div>
                </div>
              )}

              {/* Mobile Device Install Instructions */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: deviceType === 'desktop' ? '1fr 1fr' : '1fr',
                gap: '12px'
              }}>
                {/* iOS Card */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '3px',
                  padding: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 800, fontSize: '12.5px', marginBottom: '8px' }}>
                    <RiAppleFill size={16} /> iPhone &amp; iPad (iOS)
                  </div>
                  <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '11.5px', color: '#94a3b8' }}>
                    <li>Open <strong>tunestream.co</strong> in Safari</li>
                    <li>Tap the <strong>Share</strong> button <span style={{ color: '#00f2fe' }}>[⎋ / ↑]</span></li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                    <li>Tap <strong>Add</strong> — app appears on your home screen</li>
                  </ol>
                </div>

                {/* Android Card */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '3px',
                  padding: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 800, fontSize: '12.5px', marginBottom: '8px' }}>
                    <RiAndroidFill size={16} color="#10b981" /> Android (Chrome &amp; WebAPK)
                  </div>
                  <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '11.5px', color: '#94a3b8' }}>
                    <li>Open <strong>tunestream.co</strong> in Chrome</li>
                    <li>Tap the <strong>⋮ menu</strong> &rarr; <strong>"Install app"</strong></li>
                    <li>Android installs a native WebAPK in your App Drawer</li>
                  </ol>
                </div>
              </div>

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
                  <RiDownloadFill size={18} />
                  {installStatus === 'installing' ? 'Installing...' : installStatus === 'installed' ? 'Installed Successfully!' : 'Install TuneStream on This Device'}
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

          {/* TAB 2: Direct APK Download */}
          {activeTab === 'apk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '3px',
                padding: '12px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RiAndroidFill color="#10b981" /> Direct Android APK Package (.apk)
                </div>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#94a3b8' }}>
                  Download and sideload the standalone TuneStream Android APK directly onto any phone without needing Google Play Store login.
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
                    Package: <code>co.tunestream.app</code> &bull; Architecture: Universal (ARM64 / x86_64) &bull; Size: ~8.4 MB
                  </div>
                </div>
                <a
                  href="/downloads/tunestream.apk"
                  download="tunestream.apk"
                  onClick={(e) => {
                    // Informative fallback if APK is compiled via CI/CD
                    console.log('Downloading TuneStream APK...');
                  }}
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

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '3px', fontSize: '11.5px' }}>
                <div style={{ fontWeight: 800, color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RiShieldCheckFill color="#00f2fe" /> 3 Steps to Sideload on Android:
                </div>
                <ol style={{ margin: 0, paddingLeft: '18px', color: '#94a3b8', lineHeight: 1.6 }}>
                  <li>Tap <strong>Download .APK</strong> above on your Android phone.</li>
                  <li>When prompted, tap <strong>"Open"</strong> or find the downloaded file in your Files / Downloads folder.</li>
                  <li>If prompted, enable <em>"Allow installation from this source"</em> and tap <strong>Install</strong>.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: Live Simulator */}
          {activeTab === 'simulator' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                background: 'rgba(0, 242, 254, 0.08)',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                borderRadius: '3px',
                padding: '12px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                  Instant In-Browser Phone Chassis Simulator
                </div>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#94a3b8' }}>
                  Experience the full TuneStream native mobile application directly inside your browser. Includes the realistic titanium chassis, 24-bit FLAC audio streaming, 8GB smart offline crate simulation, 10-band studio EQ, and 1-tap creator tipping.
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
                  <RiExternalLinkLine size={16} /> Open Fullscreen
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Capacitor / Stores */}
          {activeTab === 'developer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                background: 'rgba(168, 85, 247, 0.08)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                borderRadius: '3px',
                padding: '12px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                  Capacitor Native Packaging &amp; App Store Deployment
                </div>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#94a3b8' }}>
                  Official package ID <code>co.tunestream.app</code>. Configure and build native binaries for Apple App Store (TestFlight) and Google Play Console.
                </p>
              </div>

              <div style={{ background: '#000', padding: '12px', borderRadius: '3px', fontFamily: 'monospace', fontSize: '11px', position: 'relative' }}>
                <div style={{ color: '#64748b', marginBottom: '4px' }}># 1. Build and copy web assets</div>
                <div style={{ color: '#10b981' }}>npm run build:tunestream</div>
                <div style={{ color: '#64748b', margin: '6px 0 4px' }}># 2. Sync Android / iOS projects</div>
                <div style={{ color: '#00f2fe' }}>npx cap sync android &amp;&amp; npx cap open android</div>
                <div style={{ color: '#a855f7' }}>npx cap sync ios &amp;&amp; npx cap open ios</div>

                <button
                  type="button"
                  onClick={() => handleCopy('npm run build:tunestream && npx cap sync')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '8px',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '2px',
                    padding: '4px 8px',
                    fontSize: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RiFileCopyLine size={12} /> {copiedCode ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Capacitor 7.x &bull; iOS 15+ &bull; Android 9+</span>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>CI/CD Workflow Configured</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
