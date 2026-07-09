import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { RiRefreshFill } from 'react-icons/ri'
import { authApi, tokenStore } from '../../lib/api.js'
import { ROLE_LOGOS } from '../../components/PerfectForSidebar.jsx'

export default function RegisterView({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  const roleLabels = {
    consumer: 'Consumer',
    creator: 'Creator',
    label: 'Record Label',
    dj: 'DJ',
    studio: 'Music Supervisor',
    corporate: 'Corporate',
    media: 'Media House',
  };

  const safeParseArray = (str, fallback = []) => {
    try {
      const parsed = str ? JSON.parse(str) : fallback;
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  };
  
  const [roles, setRoles] = useState(() => {
    const saved = sessionStorage.getItem('signup_roles');
    if (saved) {
      const parsed = safeParseArray(saved, null);
      if (parsed) return parsed;
    }
    const legacy = sessionStorage.getItem('signup_role');
    return legacy ? [legacy] : [];
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [name, setName] = useState(() => sessionStorage.getItem('signup_name') || '');
  const [email, setEmail] = useState(() => sessionStorage.getItem('signup_email') || '');
  const [password, setPassword] = useState(() => sessionStorage.getItem('signup_password') || '');
  const [step, setStep] = useState(() => {
    const saved = sessionStorage.getItem('signup_step');
    return saved !== null ? parseInt(saved) : 0;
  });
  const [isAiMode, setIsAiMode] = useState(() => sessionStorage.getItem('signup_is_ai') === 'true');
  const [aiStep, setAiStep] = useState(() => {
    const saved = sessionStorage.getItem('signup_ai_step');
    return saved !== null ? parseInt(saved) : 0;
  });
  const [chatLog, setChatLog] = useState(() => {
    const saved = sessionStorage.getItem('signup_chat_log');
    const parsed = safeParseArray(saved, null);
    if (parsed) return parsed;
    return [
      { sender: 'ai', text: "Hi! I'm Ayo, your onboarding assistant. What should I call you?" }
    ];
  });

  const [googleLoading, setGoogleLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [syncPlatform, setSyncPlatform] = useState('');
  const [syncedCount, setSyncedCount] = useState(0);

  const [genres, setGenres] = useState(() => safeParseArray(sessionStorage.getItem('signup_genres'), []));
  const [followedCreators, setFollowedCreators] = useState(() => safeParseArray(sessionStorage.getItem('signup_followed_creators'), []));
  const [selectedPricing, setSelectedPricing] = useState(() => sessionStorage.getItem('signup_selected_pricing') || 'free');
  const [creativeType, setCreativeType] = useState(() => sessionStorage.getItem('signup_creative_type') || 'Artist');
  const [payoutWallet, setPayoutWallet] = useState(() => sessionStorage.getItem('signup_payout_wallet') || '');
  const [biography, setBiography] = useState(() => sessionStorage.getItem('signup_biography') || '');
  const [contractSigned, setContractSigned] = useState(() => sessionStorage.getItem('signup_contract_signed') === 'true');
  const [labelName, setLabelName] = useState(() => sessionStorage.getItem('signup_label_name') || '');
  const [labelHq, setLabelHq] = useState(() => sessionStorage.getItem('signup_label_hq') || 'Nairobi, Kenya');
  const [defaultSplitSlider, setDefaultSplitSlider] = useState(() => parseInt(sessionStorage.getItem('signup_default_split_slider') || '50'));
  const [djStyle, setDjStyle] = useState(() => sessionStorage.getItem('signup_dj_style') || 'Afro-House');
  const [syncBriefQuery, setSyncBriefQuery] = useState(() => sessionStorage.getItem('signup_sync_brief_query') || '');
  const [corpBrand, setCorpBrand] = useState(() => sessionStorage.getItem('signup_corp_brand') || '');
  const [corpBudget, setCorpBudget] = useState(() => sessionStorage.getItem('signup_corp_budget') || 'Medium');
  const [mediaNetwork, setMediaNetwork] = useState(() => sessionStorage.getItem('signup_media_network') || '');

  const [payoutReceiverType, setPayoutReceiverType] = useState(() => {
    const saved = sessionStorage.getItem('signup_payout_receiver_type');
    if (saved) return saved;
    return roles.includes('label') ? 'label' : 'individual';
  });
  const [payoutMethod, setPayoutMethod] = useState(() => sessionStorage.getItem('signup_payout_method') || 'direct_deposit');
  const [payoutBankName, setPayoutBankName] = useState(() => sessionStorage.getItem('signup_payout_bank_name') || '');
  const [payoutAccountNum, setPayoutAccountNum] = useState(() => sessionStorage.getItem('signup_payout_account_num') || '');
  const [payoutRoutingNum, setPayoutRoutingNum] = useState(() => sessionStorage.getItem('signup_payout_routing_num') || '');
  const [payoutCardNum, setPayoutCardNum] = useState(() => sessionStorage.getItem('signup_payout_card_num') || '');
  const [payoutMobilePhone, setPayoutMobilePhone] = useState(() => sessionStorage.getItem('signup_payout_mobile_phone') || '');
  const [payoutMobileProvider, setPayoutMobileProvider] = useState(() => sessionStorage.getItem('signup_payout_mobile_provider') || 'M-Pesa');
  const [payoutPaypalEmail, setPayoutPaypalEmail] = useState(() => sessionStorage.getItem('signup_payout_paypal_email') || '');

  const [scanningDevices, setScanningDevices] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    
    const getPreselectedRolesForPath = (path) => {
      if (!path) return [];
      if (path.includes('/for/creator')) return ['creator'];
      if (path.includes('/for/exec')) return ['label'];
      if (path.includes('/for/supervisor')) return ['studio'];
      if (path.includes('/for/booking-agent')) return ['label'];
      if (path.includes('/for/manager')) return ['creator', 'label'];
      if (path.includes('/native-apps/tunestream') || path.includes('/native-apps/tunemavens')) return ['consumer'];
      if (path.includes('/native-apps/creator-companion')) return ['creator'];
      if (path.includes('/native-apps/tunepay')) return ['label'];
      return [];
    };

    let preselected = [];
    if (roleParam && ['consumer', 'creator', 'label', 'dj', 'studio', 'corporate', 'media'].includes(roleParam)) {
      preselected = [roleParam];
    } else {
      const fromPath = location.state?.from || '';
      preselected = getPreselectedRolesForPath(fromPath);
      
      if (preselected.length === 0 && document.referrer) {
        try {
          const refUrl = new URL(document.referrer);
          preselected = getPreselectedRolesForPath(refUrl.pathname);
        } catch (e) {}
      }
    }

    if (preselected.length > 0) {
      setRoles(prev => {
        const merged = [...prev];
        preselected.forEach(r => {
          if (!merged.includes(r)) merged.push(r);
        });
        return merged;
      });
      setStep(prev => prev === 0 ? 1 : prev);
    }
  }, [location]);

  useEffect(() => { sessionStorage.setItem('signup_roles', JSON.stringify(roles)); }, [roles]);
  useEffect(() => { sessionStorage.setItem('signup_name', name); }, [name]);
  useEffect(() => { sessionStorage.setItem('signup_email', email); }, [email]);
  useEffect(() => { sessionStorage.setItem('signup_password', password); }, [password]);
  useEffect(() => { sessionStorage.setItem('signup_step', step.toString()); }, [step]);
  useEffect(() => { sessionStorage.setItem('signup_is_ai', isAiMode.toString()); }, [isAiMode]);
  useEffect(() => { sessionStorage.setItem('signup_ai_step', aiStep.toString()); }, [aiStep]);
  useEffect(() => { sessionStorage.setItem('signup_chat_log', JSON.stringify(chatLog)); }, [chatLog]);
  
  useEffect(() => { sessionStorage.setItem('signup_genres', JSON.stringify(genres)); }, [genres]);
  useEffect(() => { sessionStorage.setItem('signup_followed_creators', JSON.stringify(followedCreators)); }, [followedCreators]);
  useEffect(() => { sessionStorage.setItem('signup_selected_pricing', selectedPricing); }, [selectedPricing]);
  useEffect(() => { sessionStorage.setItem('signup_creative_type', creativeType); }, [creativeType]);
  useEffect(() => { sessionStorage.setItem('signup_payout_wallet', payoutWallet); }, [payoutWallet]);
  useEffect(() => { sessionStorage.setItem('signup_biography', biography); }, [biography]);
  useEffect(() => { sessionStorage.setItem('signup_contract_signed', contractSigned.toString()); }, [contractSigned]);
  useEffect(() => { sessionStorage.setItem('signup_label_name', labelName); }, [labelName]);
  useEffect(() => { sessionStorage.setItem('signup_label_hq', labelHq); }, [labelHq]);
  useEffect(() => { sessionStorage.setItem('signup_default_split_slider', defaultSplitSlider.toString()); }, [defaultSplitSlider]);
  useEffect(() => { sessionStorage.setItem('signup_dj_style', djStyle); }, [djStyle]);
  useEffect(() => { sessionStorage.setItem('signup_sync_brief_query', syncBriefQuery); }, [syncBriefQuery]);
  useEffect(() => { sessionStorage.setItem('signup_corp_brand', corpBrand); }, [corpBrand]);
  useEffect(() => { sessionStorage.setItem('signup_corp_budget', corpBudget); }, [corpBudget]);
  useEffect(() => { sessionStorage.setItem('signup_media_network', mediaNetwork); }, [mediaNetwork]);

  useEffect(() => { sessionStorage.setItem('signup_payout_receiver_type', payoutReceiverType); }, [payoutReceiverType]);
  useEffect(() => { sessionStorage.setItem('signup_payout_method', payoutMethod); }, [payoutMethod]);
  useEffect(() => { sessionStorage.setItem('signup_payout_bank_name', payoutBankName); }, [payoutBankName]);
  useEffect(() => { sessionStorage.setItem('signup_payout_account_num', payoutAccountNum); }, [payoutAccountNum]);
  useEffect(() => { sessionStorage.setItem('signup_payout_routing_num', payoutRoutingNum); }, [payoutRoutingNum]);
  useEffect(() => { sessionStorage.setItem('signup_payout_card_num', payoutCardNum); }, [payoutCardNum]);
  useEffect(() => { sessionStorage.setItem('signup_payout_mobile_phone', payoutMobilePhone); }, [payoutMobilePhone]);
  useEffect(() => { sessionStorage.setItem('signup_payout_mobile_provider', payoutMobileProvider); }, [payoutMobileProvider]);
  useEffect(() => { sessionStorage.setItem('signup_payout_paypal_email', payoutPaypalEmail); }, [payoutPaypalEmail]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog]);

  const stepsMap = {
    consumer: ['Genre Prefs', 'Creator Discovery', 'Device Detection', 'Pricing & Payout'],
    creator: ['Creative Style', 'Bio & Gallery', 'Discography Ingest', 'Compensation & E-Sign'],
    label: ['Company Info', 'Roster Ingest', 'Default Splits'],
    dj: ['DJ Profile', 'HQ Music Pool', 'IP Clearance Engine'],
    studio: ['Supervisor Details', 'Sync Brief AI Search'],
    corporate: ['Brand Campaign', 'Budget Options'],
    media: ['Broadcaster Info', 'Playlist Compliance'],
  };

  const getStepsForRoles = (selectedRoles) => {
    const list = ['Role'];
    if (Array.isArray(selectedRoles)) {
      selectedRoles.forEach(r => {
        if (stepsMap[r]) {
          list.push(...stepsMap[r]);
        }
      });
      const isPayee = selectedRoles.some(r => ['creator', 'label', 'dj'].includes(r));
      if (isPayee) {
        list.push('Payout Setup');
      }
    }
    list.push('Security');
    return list;
  };

  const steps = getStepsForRoles(roles);
  const currentStepName = steps[step];

  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    if (step === 0 && roles.length === 0) {
      alert('Please select at least one primary role.');
      return;
    }

    const currentStepName = steps[step];

    if (currentStepName === 'Payout Setup') {
      if (payoutMethod === 'direct_deposit' && (!payoutBankName || !payoutAccountNum)) {
        alert('Please enter your Bank Name and Account Number.');
        return;
      }
      if (payoutMethod === 'debit_card' && !payoutCardNum) {
        alert('Please enter your Debit Card number.');
        return;
      }
      if (payoutMethod === 'mobile_money' && !payoutMobilePhone) {
        alert('Please enter your Mobile Money phone number.');
        return;
      }
      if (payoutMethod === 'paypal' && !payoutPaypalEmail) {
        alert('Please enter your PayPal email address.');
        return;
      }
    }
    if (currentStepName === 'Bio & Gallery' && !biography) {
      alert('Please write a short biography summary.');
      return;
    }
    if (currentStepName === 'Compensation & E-Sign' && !contractSigned) {
      alert('Please sign the cascade compensation agreement.');
      return;
    }
    if (currentStepName === 'Company Info' && !labelName) {
      alert('Please enter your Record Label name.');
      return;
    }
    if (currentStepName === 'DJ Profile' && !djStyle) {
      alert('Please specify your primary DJ mixing style.');
      return;
    }
    if (currentStepName === 'Supervisor Details' && !name) {
      alert('Please specify your production or company name.');
      return;
    }
    if (currentStepName === 'Brand Campaign' && !corpBrand) {
      alert('Please specify your brand or organization name.');
      return;
    }
    if (currentStepName === 'Broadcaster Info' && !mediaNetwork) {
      alert('Please specify your broadcasting media network name.');
      return;
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      submitRegister();
    }
  };

  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleGoogleSignup = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      setName('Alex Rivera');
      setEmail('alex.rivera@gmail.com');
      alert('Google credentials fetched! Account details auto-populated.');
      setStep(1);
    }, 1200);
  };

  const handleBypassOnboarding = () => {
    const bypassRoles = ['creator', 'label'];
    setRoles(bypassRoles);
    setName('Alex Rivera');
    setEmail('alex.rivera@tunemavens.com');
    setPassword('sandbox123456');
    
    authApi.register({
      email: 'alex.rivera@tunemavens.com',
      password: 'sandbox123456',
      name: 'Alex Rivera',
      role: 'creator',
      brand_name: 'Alex Rivera Productions',
      country: 'KE',
    }).then(({ user, access_token }) => {
      tokenStore.set(access_token);
      onLogin(user);
      clearSignupMemory();
      navigate('/dashboard');
    }).catch(() => {
      onLogin({
        email: 'alex.rivera@tunemavens.com',
        name: 'Alex Rivera',
        role: 'creator',
        credits: 600,
        plan: 'creator',
        brand_name: 'Alex Rivera Productions',
        country: 'KE',
      });
      clearSignupMemory();
      navigate('/dashboard');
    });
  };

  const handleCatalogSync = (platform) => {
    setSyncPlatform(platform);
    setSyncStatus('syncing');
    
    setTimeout(() => {
      setSyncStatus('success');
      const count = platform === 'ASCAP / BMI' ? 18 : 24;
      setSyncedCount(count);
      if (!name) setName('Alex Rivera');
      if (!email) setEmail(`alex.rivera@${platform.toLowerCase().replace(/\s/g, '')}.com`);
      alert(`Successfully synced with ${platform}! Imported ${count} releases and metadata.`);
    }, 2000);
  };

  const handleSendAiMessage = (e) => {
    if (e) e.preventDefault();
    if (!currentInput.trim()) return;

    const userText = currentInput.trim();
    setChatLog(prev => [...prev, { sender: 'user', text: userText }]);
    setCurrentInput('');

    setTimeout(() => {
      if (aiStep === 0) {
        setName(userText);
        setChatLog(prev => [...prev, { 
          sender: 'ai', 
          text: `Nice to meet you, ${userText}! What email address should we register for your account?` 
        }]);
        setAiStep(1);
      } else if (aiStep === 1) {
        setEmail(userText);
        setChatLog(prev => [...prev, { 
          sender: 'ai', 
          text: "Type the roles you want to register for, separated by commas (e.g. Creator, DJ):" 
        }]);
        setAiStep(2);
      } else if (aiStep === 2) {
        const text = userText.toLowerCase();
        const selected = [];
        if (text.includes('consumer') || text.includes('listen') || text.includes('stream')) selected.push('consumer');
        if (text.includes('create') || text.includes('art') || text.includes('prod')) selected.push('creator');
        if (text.includes('label') || text.includes('record')) selected.push('label');
        if (text.includes('dj')) selected.push('dj');
        if (text.includes('film') || text.includes('studio')) selected.push('studio');
        if (text.includes('corp') || text.includes('brand')) selected.push('corporate');
        if (text.includes('media') || text.includes('house')) selected.push('media');

        if (selected.length === 0) selected.push('consumer');

        setRoles(selected);
        setChatLog(prev => [...prev, { 
          sender: 'ai', 
          text: `Selected objectives: ${selected.map(r => r.toUpperCase()).join(' & ')}. Let's secure your account. Type a password to finalize setup:` 
        }]);
        setAiStep(3);
      } else if (aiStep === 3) {
        setPassword(userText);
        setChatLog(prev => [...prev, { 
          sender: 'ai', 
          text: "All set! Click the complete button below to create your account." 
        }]);
        setAiStep(4);
      }
    }, 800);
  };

  const toggleAiMode = () => {
    const nextMode = !isAiMode;
    setIsAiMode(nextMode);
    setStep(0);
    setAiStep(0);
    setChatLog([
      { sender: 'ai', text: "Hi! I'm Ayo, your onboarding assistant. What should I call you?" }
    ]);
    setName('');
    setEmail('');
    setRoles([]);
    setPassword('');
    setSyncStatus('idle');
    setSyncedCount(0);
  };

  const clearSignupMemory = () => {
    sessionStorage.removeItem('signup_roles');
    sessionStorage.removeItem('signup_role');
    sessionStorage.removeItem('signup_name');
    sessionStorage.removeItem('signup_email');
    sessionStorage.removeItem('signup_password');
    sessionStorage.removeItem('signup_step');
    sessionStorage.removeItem('signup_is_ai');
    sessionStorage.removeItem('signup_ai_step');
    sessionStorage.removeItem('signup_chat_log');
    
    sessionStorage.removeItem('signup_genres');
    sessionStorage.removeItem('signup_followed_creators');
    sessionStorage.removeItem('signup_selected_pricing');
    sessionStorage.removeItem('signup_creative_type');
    sessionStorage.removeItem('signup_payout_wallet');
    sessionStorage.removeItem('signup_biography');
    sessionStorage.removeItem('signup_contract_signed');
    sessionStorage.removeItem('signup_label_name');
    sessionStorage.removeItem('signup_label_hq');
    sessionStorage.removeItem('signup_default_split_slider');
    sessionStorage.removeItem('signup_dj_style');
    sessionStorage.removeItem('signup_sync_brief_query');
    sessionStorage.removeItem('signup_corp_brand');
    sessionStorage.removeItem('signup_corp_budget');
    sessionStorage.removeItem('signup_media_network');
  };

  const handleResetRegistration = () => {
    if (window.confirm("Are you sure you want to reset and restart your sign-up process?")) {
      clearSignupMemory();
      setRoles([]);
      setName('');
      setEmail('');
      setPassword('');
      setStep(0);
      setAiStep(0);
      setSyncStatus('idle');
      setSyncedCount(0);
      setGenres([]);
      setFollowedCreators([]);
      setCreativeType('Artist');
      setPayoutWallet('');
      setBiography('');
      setContractSigned(false);
      setLabelName('');
      setDefaultSplitSlider(50);
      setDjStyle('Afro-House');
      setChatLog([
        { sender: 'ai', text: "Hi! I'm Ayo, your onboarding assistant. What should I call you?" }
      ]);
    }
  };

  const submitRegister = async () => {
    if (!name || !email || !password) {
      alert('Please fill out name, email, and password on the Security credentials step.');
      return;
    }
    const userRole = roles[0] || 'creator';
    try {
      const { user, access_token } = await authApi.register({
        email,
        password,
        name,
        role: userRole,
        brand_name: name + ' Productions',
        country: 'KE',
      });
      tokenStore.set(access_token);
      onLogin(user);
      alert(`SSO registration successfully complete! Welcome, ${name}!`);
      clearSignupMemory();
      navigate('/dashboard');
    } catch (err) {
      alert(err.data?.detail || err.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-modal-card" style={{ cursor: 'default' }}>
      <button 
        onClick={handleResetRegistration}
        className="auth-reset-btn"
      >
        Reset
      </button>
      <button 
        onClick={toggleAiMode}
        className={`ai-toggle-btn ${isAiMode ? 'active' : ''}`}
        style={{ border: '1px solid rgba(139, 92, 246, 0.4)' }}
      >
        ✨ {isAiMode ? 'Standard Mode' : 'AI Onboarding'}
      </button>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <img src="/favicon.png" alt="TuneMavens Icon" style={{ width: '42px', height: '42px', display: 'block' }} />
      </div>

      <div className="auth-header" style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#fff', margin: '0 0 4px', textAlign: 'left' }}>
          {isAiMode ? 'AI Assisted Setup' : 'Register Account'}
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--mu)', textAlign: 'left', margin: 0 }}>
          {isAiMode ? 'Talk with Ayo to onboard' : `Step ${step + 1} of ${steps.length}: ${steps[step] || ''}`}
        </p>
      </div>

      {!isAiMode && (
        <div className="wizard-steps-indicator" style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`wizard-step-dot ${step >= idx ? 'active' : ''}`}
              style={{ 
                flex: 1, 
                height: '4px', 
                background: step >= idx ? 'var(--cyan)' : 'rgba(255,255,255,0.08)', 
                borderRadius: '2px', 
                transition: 'all 0.2s ease', 
                boxShadow: step >= idx ? '0 0 4px var(--cyan)' : 'none' 
              }}
            />
          ))}
        </div>
      )}

      {!isAiMode && step === 0 && (
        <>
          <button 
            onClick={handleGoogleSignup} 
            className="google-sso-btn" 
            disabled={googleLoading}
            style={{ marginBottom: '10px' }}
          >
            {googleLoading ? (
              <>
                <RiRefreshFill size={14} className="spin-animation" />
                Connecting to Google...
              </>
            ) : (
              <>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>G</span>
                Sign up with Google
              </>
            )}
          </button>

          <button 
            onClick={handleBypassOnboarding} 
            className="btn-primary" 
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '13px', 
              fontWeight: '700', 
              borderRadius: '4px', 
              cursor: 'pointer',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, var(--cyan) 0%, var(--purple) 100%)',
              border: 'none',
              color: '#fff',
              boxShadow: '0 0 12px rgba(34, 211, 238, 0.2)'
            }}
          >
            ✨ Bypass Onboarding (Instant Dashboard)
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: '11px', color: 'var(--mu)' }}>or fill manually</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          </div>
        </>
      )}

      {isAiMode ? (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="ai-chat-container">
            {chatLog.map((chat, idx) => (
              <div key={idx} className={`ai-chat-bubble ${chat.sender}`}>
                {chat.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {aiStep < 4 ? (
            <form onSubmit={handleSendAiMessage} className="ai-input-row">
              <input 
                type={aiStep === 3 ? "password" : "text"} 
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder={aiStep === 0 ? "Type your name..." : aiStep === 1 ? "email@example.com" : aiStep === 2 ? "e.g. Creator" : "Type password..."}
                className="form-control"
                style={{ fontSize: '13px', padding: '8px 12px', flex: 1 }}
                required
              />
              <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer' }}>
                Send
              </button>
            </form>
          ) : (
            <button 
              onClick={submitRegister} 
              className="btn-primary" 
              style={{ width: '100%', padding: '12px', marginTop: '16px', fontSize: '13px', fontWeight: '700', borderRadius: '4px', cursor: 'pointer' }}
            >
              Complete Registration
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '380px' }}>
          
          {currentStepName === 'Role' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Select your primary account objectives (choose one or more):</p>
              
              <div className="multiselect-container" style={{ marginBottom: '16px' }}>
                <div 
                  className="multiselect-trigger" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span>
                    {roles.length === 0 
                      ? 'Select account objectives...' 
                      : roles.map(r => roleLabels[r] || r).join(', ')}
                  </span>
                  <span>{dropdownOpen ? '▲' : '▼'}</span>
                </div>

                {dropdownOpen && (
                  <div className="multiselect-dropdown">
                    {[
                      { id: 'consumer', emoji: '🎧', title: 'Consumer', desc: 'Stream ad-free, downloads & merch' },
                      { id: 'creator', emoji: '🎸', title: 'Creator', desc: 'Artist, producer, sync & splits' },
                      { id: 'label', emoji: '🏢', title: 'Record Label', desc: 'Roster & bulk catalogue splits' },
                      { id: 'dj', emoji: '🎚️', title: 'DJ', desc: 'HQ lossless pools & stem clearances' },
                      { id: 'studio', emoji: '🎬', title: 'Music Supervisor', desc: 'Browse syncs & AI music briefs' },
                      { id: 'corporate', emoji: '📈', title: 'Corporate', desc: 'Audio ads, sponsorships & partnerships' },
                      { id: 'media', emoji: '📺', title: 'Media House', desc: 'Broadcast licensing & compliance' }
                    ].map(opt => {
                      const isChecked = roles.includes(opt.id);
                      return (
                        <div 
                          key={opt.id} 
                          className="multiselect-option"
                          onClick={() => {
                            setRoles(prev => prev.includes(opt.id) ? prev.filter(x => x !== opt.id) : [...prev, opt.id]);
                          }}
                        >
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => {}}
                            className="multiselect-checkbox"
                          />
                          <div style={{ fontSize: '20px' }}>{opt.emoji}</div>
                          <div style={{ textAlign: 'left' }}>
                            <div className="multiselect-option-label">{opt.title}</div>
                            <div className="multiselect-option-desc">{opt.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {roles.map(r => (
                  <span key={r} className="role-badge">
                    {roleLabels[r] || r}
                    <span 
                      className="role-badge-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRoles(prev => prev.filter(x => x !== r));
                      }}
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {currentStepName === 'Genre Prefs' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '10px' }}>Select genres you enjoy listening to (minimum 1):</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                {['Afrobeat', 'Amapiano', 'Hip-Hop', 'R&B', 'Gengetone', 'Bongo Flava', 'Dancehall', 'Afro-Jazz'].map(g => {
                  const isSel = genres.includes(g);
                  return (
                    <div 
                      key={g} 
                      onClick={() => {
                        setGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
                      }}
                      style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '20px', border: `1px solid ${isSel ? 'var(--cyan)' : 'rgba(255,255,255,0.08)'}`, background: isSel ? 'rgba(34,211,238,0.06)' : 'rgba(255,255,255,0.02)', color: isSel ? 'var(--cyan)' : 'var(--mu)', cursor: 'pointer', transition: 'all 0.15s ease' }}
                    >
                      {g} {isSel ? '✓' : '+'}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStepName === 'Creator Discovery' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>Pick creators to follow (minimum 1 to finish onboarding):</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {['Alex Rivera (Producer)', 'Burna Boy (Artist)', 'Tems (Vocalist)', 'Sauti Sol (Band)'].map(c => {
                  const isF = followedCreators.includes(c);
                  return (
                    <div key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(34,211,238,0.08)', color: 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>
                          {c.charAt(0)}
                        </div>
                        <span style={{ fontSize: '12px', color: '#fff' }}>{c}</span>
                      </div>
                      <button 
                        onClick={() => setFollowedCreators(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                        className={`plan-btn ${isF ? 'outline' : ''}`}
                        style={{ padding: '4px 10px', height: '24px', fontSize: '10px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        {isF ? '✓ Following' : '+ Follow'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStepName === 'Device Detection' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Hardware Device Sync Detection:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div style={{ padding: '8px 12px', background: 'rgba(6,8,19,0.3)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: 'var(--mu)' }}>Chrome Web Player</span>
                  <span style={{ color: 'var(--green)', fontWeight: 'bold' }}>🟢 Connected</span>
                </div>
                <div style={{ padding: '8px 12px', background: 'rgba(6,8,19,0.3)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: 'var(--mu)' }}>iOS / Android App</span>
                  <span style={{ color: scanningDevices ? 'var(--cyan)' : 'var(--orange)', fontWeight: 'bold' }}>
                    {scanningDevices ? '🔄 Ingesting...' : '🟡 Awaiting sync'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setScanningDevices(true);
                  setTimeout(() => setScanningDevices(false), 2000);
                }}
                className="plan-btn outline"
                style={{ width: '100%', fontSize: '11px', padding: '8px', cursor: 'pointer' }}
                disabled={scanningDevices}
              >
                {scanningDevices ? 'Scanning network...' : 'Scan local network for devices'}
              </button>
            </div>
          )}

          {currentStepName === 'Pricing & Payout' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>Choose your listening plan subscription:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div 
                  onClick={() => setSelectedPricing('free')}
                  style={{ padding: '12px', borderRadius: '4px', border: `1px solid ${selectedPricing === 'free' ? 'var(--cyan)' : 'rgba(255,255,255,0.05)'}`, background: selectedPricing === 'free' ? 'rgba(34,211,238,0.04)' : 'rgba(255,255,255,0.01)', cursor: 'pointer', textAlign: 'center' }}
                >
                  <h4 style={{ fontSize: '12px', color: '#fff', margin: '0 0 2px' }}>Free Listener</h4>
                  <p style={{ fontSize: '9px', color: 'var(--mu)', margin: 0 }}>150 free credits</p>
                </div>
                <div 
                  onClick={() => setSelectedPricing('pro')}
                  style={{ padding: '12px', borderRadius: '4px', border: `1px solid ${selectedPricing === 'pro' ? 'var(--cyan)' : 'rgba(255,255,255,0.05)'}`, background: selectedPricing === 'pro' ? 'rgba(34,211,238,0.04)' : 'rgba(255,255,255,0.01)', cursor: 'pointer', textAlign: 'center' }}
                >
                  <h4 style={{ fontSize: '12px', color: '#fff', margin: '0 0 2px' }}>Pro Streamer</h4>
                  <p style={{ fontSize: '9px', color: 'var(--mu)', margin: 0 }}>500 credits / month</p>
                </div>
              </div>
            </div>
          )}

          {currentStepName === 'Creative Style' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>Select creative identity and payment receiver:</p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                {['Artist', 'Producer', 'Engineer', 'Podcaster'].map(t => (
                  <div 
                    key={t}
                    onClick={() => setCreativeType(t)}
                    style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '4px', border: `1px solid ${creativeType === t ? 'var(--cyan)' : 'rgba(255,255,255,0.08)'}`, background: creativeType === t ? 'rgba(34,211,238,0.06)' : 'rgba(255,255,255,0.02)', color: '#fff', cursor: 'pointer', flex: 1, textAlign: 'center' }}
                  >
                    {t}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '11px', color: 'var(--mu)', marginTop: '12px', textAlign: 'center' }}>
                ℹ️ Detailed payout preferences (Direct Deposit, Mobile Money, PayPal, Stripe) will be configured in the dedicated Payout step.
              </p>
            </div>
          )}

          {currentStepName === 'Bio & Gallery' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>Provide artist details for sync catalog matching:</p>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Creator Biography</label>
                <textarea placeholder="Write a short summary..." value={biography} onChange={(e) => setBiography(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px', height: '60px', resize: 'none' }} required />
              </div>
              <div style={{ border: '1px dashed rgba(255,255,255,0.08)', padding: '10px', borderRadius: '4px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', fontSize: '10px', color: 'var(--mu)' }}>
                📁 Click to mock upload press photo kit gallery
              </div>
            </div>
          )}

          {currentStepName === 'Discography Ingest' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Port releases and split metadata seamlessly:</p>
              {syncStatus === 'syncing' ? (
                <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                  <RiRefreshFill size={24} className="spin-animation" style={{ color: 'var(--purple)', marginBottom: '12px' }} />
                  <div style={{ fontSize: '12px', color: '#fff', fontWeight: '600' }}>Fetching catalog from {syncPlatform}...</div>
                </div>
              ) : syncStatus === 'success' ? (
                <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(16,185,129,0.04)', border: '1px solid var(--green)', borderRadius: '4px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>✓</div>
                  <div style={{ fontSize: '12px', color: '#fff', fontWeight: '700' }}>Catalog Ported Successfully!</div>
                  <p style={{ fontSize: '10px', color: 'var(--mu)', marginTop: '4px' }}>Imported {syncedCount} tracks from {syncPlatform}. Profile details auto-filled.</p>
                </div>
              ) : (
                <div className="porting-platform-grid">
                  {['DistroKid', 'TuneCore', 'CD Baby', 'ASCAP / BMI'].map((platform) => (
                    <div key={platform} className="porting-card" onClick={() => handleCatalogSync(platform)}>
                      <div className="porting-card-title">{platform}</div>
                      <div className="porting-card-desc">Port splits & releases</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStepName === 'Compensation & E-Sign' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Review shared cascade compensation splits terms:</p>
              <div style={{ padding: '12px', background: 'rgba(6,8,19,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '11px', color: 'var(--mu)', marginBottom: '14px' }}>
                <strong>Cascade splits resolution contract:</strong><br />
                - 80% direct net payouts to Creator.<br />
                - 15% distributor/publishing vault node.<br />
                - 5% network maintenance fee.
              </div>
              <button 
                onClick={() => setContractSigned(!contractSigned)}
                className={`plan-btn ${contractSigned ? 'outline' : ''}`}
                style={{ width: '100%', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
              >
                {contractSigned ? '✓ Cascading Splits Signed' : 'Sign Compensation E-Agreement'}
              </button>
            </div>
          )}

          {currentStepName === 'Company Info' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Record Label general metadata setup:</p>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Record Label Title</label>
                <input type="text" placeholder="e.g. Maven Records" value={labelName} onChange={(e) => setLabelName(e.target.value)} className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Headquarters Territory</label>
                <select value={labelHq} onChange={(e) => setLabelHq(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px', background: 'rgba(6,8,19,0.8)', color: '#fff', outline: 'none' }}>
                  <option value="Nairobi, Kenya">Nairobi, Kenya</option>
                  <option value="Atlanta, USA">Atlanta, USA</option>
                  <option value="London, UK">London, UK</option>
                  <option value="Lagos, Nigeria">Lagos, Nigeria</option>
                </select>
              </div>
            </div>
          )}

          {currentStepName === 'Roster Ingest' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Roster management & catalogue bulk upload:</p>
              <div style={{ border: '1px dashed rgba(255,255,255,0.08)', padding: '24px', borderRadius: '4px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', cursor: 'pointer', marginBottom: '12px' }} onClick={() => handleCatalogSync('Bulk Label CSV')}>
                {syncStatus === 'syncing' ? (
                  <RiRefreshFill size={20} className="spin-animation" style={{ color: 'var(--purple)' }} />
                ) : (
                  <>
                    <span style={{ fontSize: '12px', color: '#fff', display: 'block', marginBottom: '4px' }}>Drag & Drop Label Roster CSV file</span>
                    <span style={{ fontSize: '9px', color: 'var(--mu)' }}>Parses and validates track splits instantly</span>
                  </>
                )}
              </div>
              {syncStatus === 'success' && (
                <div style={{ padding: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--green)', borderRadius: '4px', fontSize: '10px', color: '#fff', textAlign: 'center' }}>
                  ✓ CSV parsed! Loaded {syncedCount} tracks under roster.
                </div>
              )}
            </div>
          )}

          {currentStepName === 'Default Splits' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Default Gross/Net Split splits settings:</p>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#fff', fontWeight: '700', marginBottom: '10px' }}>
                  <span>Label Share</span>
                  <span>{defaultSplitSlider}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="90" 
                  value={defaultSplitSlider} 
                  onChange={(e) => setDefaultSplitSlider(parseInt(e.target.value))} 
                  style={{ width: '100%', accentColor: 'var(--cyan)' }} 
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--mu)', marginTop: '6px' }}>
                  <span>10% (Artist Friendly)</span>
                  <span>90% (Label Recoupment)</span>
                </div>
              </div>
            </div>
          )}

          {currentStepName === 'DJ Profile' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>DJ Profile details:</p>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Primary Mixing Style</label>
                <input type="text" placeholder="e.g. Afro-House, Techno" value={djStyle} onChange={(e) => setDjStyle(e.target.value)} className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} required />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Resident Venue / Club</label>
                <input type="text" placeholder="e.g. Alchemist, Nairobi" className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} />
              </div>
            </div>
          )}

          {currentStepName === 'HQ Music Pool' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>Select lossless record pools to synchronize:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['TuneMavens HQ Lossless Pool', 'Franchise Record Pool Sync', 'BPM Supreme DJ link'].map(p => (
                  <div key={p} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', fontSize: '11px', color: '#fff' }}>
                    📻 {p}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStepName === 'IP Clearance Engine' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>Clear stem remix permissions (IP Clearance Engine):</p>
              <div style={{ padding: '12px', background: 'rgba(6,8,19,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '11px', color: 'var(--mu)', marginBottom: '12px' }}>
                Request drops, clearance hashes, and extended edits from copyright holders instantly. Remixed uploads are routed automatically.
              </div>
              <button className="plan-btn outline" style={{ width: '100%', fontSize: '11px', cursor: 'pointer' }} onClick={() => alert(' clearance simulator initiated!')}>
                Clear Stem Test Clearance
              </button>
            </div>
          )}

          {currentStepName === 'Supervisor Details' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Music supervisor / production details:</p>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Company or Organization Name</label>
                <input type="text" placeholder="e.g. Apex Cinema Group" value={name} onChange={(e) => setName(e.target.value)} className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} required />
              </div>
            </div>
          )}

          {currentStepName === 'Sync Brief AI Search' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>AI Sync Brief search catalog testing:</p>
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <input 
                  type="text" 
                  placeholder="e.g. Energetic upbeat Afrobeat for car scene..." 
                  value={syncBriefQuery}
                  onChange={(e) => setSyncBriefQuery(e.target.value)}
                  className="form-control"
                  style={{ fontSize: '12px', padding: '8px 12px' }}
                />
              </div>
              <button 
                onClick={() => {
                  setScanningDevices(true);
                  setTimeout(() => {
                    setScanningDevices(false);
                    setSyncPlatform('Alex Rivera - Midnight Chase (Afrobeat mix) [94% match]');
                  }, 1500);
                }}
                className="plan-btn"
                style={{ fontSize: '11px', width: '100%', cursor: 'pointer', marginBottom: '10px' }}
              >
                {scanningDevices ? 'AI matching catalogue...' : 'Test AI Sync Matching'}
              </button>
              {syncPlatform && (
                <div style={{ padding: '8px 12px', background: 'rgba(34,211,238,0.06)', border: '1px solid var(--cyan)', borderRadius: '4px', fontSize: '11px', color: 'var(--cyan)' }}>
                  Matched: {syncPlatform}
                </div>
              )}
            </div>
          )}

          {currentStepName === 'Brand Campaign' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Brand campaign details:</p>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Organization / Brand Name</label>
                <input type="text" placeholder="e.g. High-Tech Ads Inc." value={corpBrand} onChange={(e) => setCorpBrand(e.target.value)} className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} required />
              </div>
            </div>
          )}

          {currentStepName === 'Budget Options' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>Campaign objectives & credit budget options:</p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                {['Audio Ads', 'Playlists', 'Sponsorships'].map(b => (
                  <div 
                    key={b}
                    onClick={() => setCorpBudget(b)}
                    style={{ padding: '8px', border: `1px solid ${corpBudget === b ? 'var(--cyan)' : 'rgba(255,255,255,0.06)'}`, background: corpBudget === b ? 'rgba(34,211,238,0.06)' : 'rgba(255,255,255,0.02)', color: '#fff', fontSize: '11px', flex: 1, borderRadius: '4px', cursor: 'pointer', textAlign: 'center' }}
                  >
                    {b}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStepName === 'Broadcaster Info' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Broadcaster details:</p>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Broadcasting Network / Station Name</label>
                <input type="text" placeholder="e.g. Metro TV FM" value={mediaNetwork} onChange={(e) => setMediaNetwork(e.target.value)} className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} required />
              </div>
            </div>
          )}

          {currentStepName === 'Playlist Compliance' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>Playlist compliance reporting (AI Discrepancy detector):</p>
              <div style={{ border: '1px dashed rgba(255,255,255,0.08)', padding: '20px', borderRadius: '4px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', fontSize: '11px', color: 'var(--mu)' }}>
                Drag & Drop playlist logs. The AI detector checks licensing discrepancies automatically.
              </div>
            </div>
          )}

          {currentStepName === 'Payout Setup' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '11px', color: 'var(--mu)', marginBottom: '8px' }}>Who is receiving payments?</p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                {[
                  { id: 'individual', label: 'Individual Creator', desc: 'Artist, DJ, or Producer' },
                  { id: 'label', label: 'Record Label', desc: 'Catalog Owner' },
                  { id: 'entrepreneur', label: 'Entrepreneur', desc: 'Music Agency / Executive' }
                ].map(r => (
                  <div
                    key={r.id}
                    onClick={() => setPayoutReceiverType(r.id)}
                    style={{
                      flex: 1,
                      padding: '10px 8px',
                      borderRadius: '6px',
                      border: `1px solid ${payoutReceiverType === r.id ? 'var(--cyan)' : 'rgba(255,255,255,0.06)'}`,
                      background: payoutReceiverType === r.id ? 'rgba(34,211,238,0.04)' : 'rgba(255,255,255,0.01)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: payoutReceiverType === r.id ? 'var(--cyan)' : '#fff' }}>{r.label}</div>
                    <div style={{ fontSize: '8px', color: 'var(--mu)', marginTop: '2px' }}>{r.desc}</div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '11px', color: 'var(--mu)', marginBottom: '8px' }}>Select preferred payout method:</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '16px' }}>
                {[
                  { id: 'direct_deposit', label: 'Bank', icon: '🏦' },
                  { id: 'debit_card', label: 'Card', icon: '💳' },
                  { id: 'mobile_money', label: 'Mobile', icon: '📱' },
                  { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                  { id: 'stripe', label: 'Stripe', icon: '⚡' }
                ].map(m => (
                  <div
                    key={m.id}
                    onClick={() => setPayoutMethod(m.id)}
                    style={{
                      padding: '12px 6px',
                      borderRadius: '6px',
                      border: `1px solid ${payoutMethod === m.id ? 'var(--cyan)' : 'rgba(255,255,255,0.05)'}`,
                      background: payoutMethod === m.id ? 'rgba(34,211,238,0.04)' : 'rgba(255,255,255,0.01)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{m.icon}</div>
                    <div style={{ fontSize: '10px', color: payoutMethod === m.id ? 'var(--cyan)' : '#fff', fontWeight: '500' }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {payoutMethod === 'direct_deposit' && (
                <div style={{ animation: 'fadeIn 0.2s ease' }}>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>Bank Name</label>
                    <input type="text" placeholder="e.g. Chase Bank, Equity Bank" value={payoutBankName} onChange={(e) => setPayoutBankName(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>Account Number</label>
                      <input type="text" placeholder="e.g. 100293028" value={payoutAccountNum} onChange={(e) => setPayoutAccountNum(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px' }} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>Routing / SWIFT Code</label>
                      <input type="text" placeholder="e.g. 021000021" value={payoutRoutingNum} onChange={(e) => setPayoutRoutingNum(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px' }} />
                    </div>
                  </div>
                </div>
              )}

              {payoutMethod === 'debit_card' && (
                <div style={{ animation: 'fadeIn 0.2s ease' }}>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>Debit Card Number</label>
                    <input type="text" placeholder="e.g. 4111 2222 3333 4444" value={payoutCardNum} onChange={(e) => setPayoutCardNum(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="form-group" style={{ flex: 2 }}>
                      <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>Cardholder Name</label>
                      <input type="text" placeholder="e.g. Jane Doe" value={name} onChange={(e) => setName(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px' }} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>CVV</label>
                      <input type="password" placeholder="•••" maxLength="3" className="form-control" style={{ fontSize: '12px', padding: '8px 12px' }} />
                    </div>
                  </div>
                </div>
              )}

              {payoutMethod === 'mobile_money' && (
                <div style={{ animation: 'fadeIn 0.2s ease' }}>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>Mobile Money Provider</label>
                    <select value={payoutMobileProvider} onChange={(e) => setPayoutMobileProvider(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px', background: 'rgba(6,8,19,0.8)', color: '#fff' }}>
                      <option value="M-Pesa">M-Pesa (Kenya / East Africa)</option>
                      <option value="MTN MoMo">MTN Mobile Money (Nigeria / West Africa)</option>
                      <option value="Airtel Money">Airtel Money</option>
                      <option value="Orange Money">Orange Money</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>Phone Number</label>
                    <input type="tel" placeholder="e.g. +254 700 000 000" value={payoutMobilePhone} onChange={(e) => setPayoutMobilePhone(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px' }} />
                  </div>
                </div>
              )}

              {payoutMethod === 'paypal' && (
                <div style={{ animation: 'fadeIn 0.2s ease' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>PayPal Email Address</label>
                    <input type="email" placeholder="paypal@example.com" value={payoutPaypalEmail} onChange={(e) => setPayoutPaypalEmail(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px' }} />
                  </div>
                  <p style={{ fontSize: '9px', color: 'var(--mu)', marginTop: '8px' }}>Payments are processed securely via PayPal Mass Pay nodes.</p>
                </div>
              )}

              {payoutMethod === 'stripe' && (
                <div style={{ animation: 'fadeIn 0.2s ease', textAlign: 'center', padding: '10px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>💳</div>
                  <h5 style={{ fontSize: '12px', color: '#fff', margin: '0 0 4px' }}>Stripe Connect Onboarding</h5>
                  <p style={{ fontSize: '10px', color: 'var(--mu)', margin: '0 0 12px' }}>Link your bank account via Stripe Connect securely.</p>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Stripe Connect onboarding modal simulated! Your merchant account is now linked.');
                    }}
                    className="btn-primary" 
                    style={{ padding: '8px 16px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Link Stripe Account
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStepName === 'Security' && (
            <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Configure your account access credentials:</p>
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Full Name</label>
                <input type="text" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} required />
              </div>
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Email Address</label>
                <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} required />
              </div>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Choose Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} required />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {step > 0 && (
              <button 
                onClick={handlePrevStep} 
                className="plan-btn outline"
                style={{ flex: 1, padding: '10px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Back
              </button>
            )}
            <button 
              onClick={handleNextStep} 
              className="btn-primary" 
              style={{ flex: 2, padding: '10px', fontSize: '13px', fontWeight: '700', borderRadius: '4px', cursor: 'pointer' }}
            >
              {step === steps.length - 1 ? 'Complete Register' 
                : (currentStepName === 'Discography Ingest' ? 'Skip Catalog Porting' 
                : (currentStepName === 'Roster Ingest' ? 'Skip Roster Ingest' : 'Next Step'))}
            </button>
          </div>
        </div>
      )}

      <p style={{ fontSize: '12px', color: 'var(--mu)', marginTop: '16px', textAlign: 'center', margin: '16px 0 0' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: '600' }}>Log in here</Link>
      </p>
    </div>
  );
}
