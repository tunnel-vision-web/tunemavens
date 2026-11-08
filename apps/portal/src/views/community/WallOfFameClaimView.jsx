import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  RiTrophyFill,
  RiShieldCheckFill,
  RiCheckDoubleFill,
  RiErrorWarningFill,
  RiArrowRightLine,
  RiPlayFill,
  RiUserSharedFill,
  RiSparklingFill,
  RiFileUserLine
} from 'react-icons/ri';
import './CommunityView.css';

export default function WallOfFameClaimView({ sessionUser }) {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  // Claim form fields
  const [displayName, setDisplayName] = useState('');
  const [customBio, setCustomBio] = useState('');
  const [interests, setInterests] = useState(['Production', 'Sync Licensing']);
  const [submitting, setSubmitting] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setErrorMsg('No invitation token provided.');
      setLoading(false);
      return;
    }

    const checkToken = async () => {
      try {
        const res = await fetch(`/api/community/wall-of-fame/claim/${token}`);
        if (!res.ok) {
          const errData = await res.json();
          setErrorMsg(errData.detail || 'Invalid or expired invitation token.');
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data.status === 'already_claimed') {
          setAlreadyClaimed(true);
          setProfileData(data);
        } else {
          setProfileData(data);
          setDisplayName(data.subject_name || '');
          setCustomBio(data.bio || '');
        }
      } catch (err) {
        setErrorMsg('Network error while checking invitation.');
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [token]);

  const handleInterestToggle = (item) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleExecuteClaim = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/community/wall-of-fame/claim/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName,
          bio: customBio,
          interests,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || 'Failed to claim Wall of Fame profile.');
        return;
      }

      setClaimSuccess(true);
    } catch (err) {
      alert('Error claiming profile: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="community-view-container" style={{ textAlign: 'center', paddingTop: 100 }}>
        <h3 style={{ color: '#00f0ff' }}>Verifying Wall of Fame Invitation...</h3>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="community-view-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
        <div className="community-modal-card" style={{ textAlign: 'center' }}>
          <RiErrorWarningFill size={48} style={{ color: '#ef4444', marginBottom: 16 }} />
          <h2 style={{ color: '#ffffff', margin: '0 0 10px 0' }}>Invalid Invitation Link</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 24 }}>{errorMsg}</p>
          <Link to="/community" className="community-btn community-btn-primary">
            Visit Wall of Fame
          </Link>
        </div>
      </div>
    );
  }

  if (alreadyClaimed) {
    return (
      <div className="community-view-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
        <div className="community-modal-card" style={{ textAlign: 'center' }}>
          <RiShieldCheckFill size={48} style={{ color: '#00f0ff', marginBottom: 16 }} />
          <h2 style={{ color: '#ffffff', margin: '0 0 10px 0' }}>Profile Already Claimed</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 24 }}>
            <strong>{profileData?.subject_name}</strong> is already active and inducted on the Wall of Fame.
          </p>
          <Link to="/community" className="community-btn community-btn-primary">
            View on Wall of Fame
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="community-view-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: 40 }}>
      <div className="community-modal-card" style={{ maxWidth: 680 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid #00f0ff',
              color: '#00f0ff',
              padding: '6px 14px',
              borderRadius: 3,
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              marginBottom: 12,
            }}
          >
            <RiTrophyFill /> Official Wall of Fame Induction Invitation
          </div>
          <h1 style={{ color: '#ffffff', fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px 0' }}>
            Welcome, {profileData?.subject_name}!
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>
            You have been nominated as a premier{' '}
            <span style={{ color: '#a78bfa', textTransform: 'capitalize', fontWeight: 700 }}>
              {profileData?.role}
            </span>{' '}
            in the TuneMavens ecosystem. Claiming your tile makes it publicly visible on the Hall of Icons.
          </p>
        </div>

        {claimSuccess ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <RiCheckDoubleFill size={56} style={{ color: '#10b981', marginBottom: 12 }} />
            <h2 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '24px', fontWeight: 800 }}>
              Induction Confirmed &amp; Profile Verified!
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '480px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
              Congratulations! Your official profile is now live on the TuneMavens Wall of Fame with permanent Pro status.
            </p>

            {/* Next Step: EPK Activation Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.08) 0%, rgba(134, 59, 255, 0.08) 100%)',
                border: '1px solid rgba(34, 211, 238, 0.3)',
                borderRadius: 3,
                padding: '20px',
                marginBottom: '24px',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#38bdf8', fontWeight: 800, fontSize: '14px', marginBottom: 6 }}>
                <RiSparklingFill /> Next Step: Activate Your 24-Bit EPK Web World
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: 1.5, margin: '0 0 18px 0' }}>
                Showcase your master discography, stems packages, pre-cleared 90/10 sync licensing rates, and performance tech rider to top music supervisors and labels.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  to="/epk"
                  className="community-btn community-btn-primary"
                  style={{ textDecoration: 'none', padding: '10px 18px', fontSize: '13px', background: '#22d3ee', color: '#090d16', border: 'none', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <RiSparklingFill /> Activate My EPK Now
                </Link>
                <Link
                  to="/community"
                  className="community-btn community-btn-secondary"
                  style={{ textDecoration: 'none', padding: '10px 18px', fontSize: '13px' }}
                >
                  View Wall of Fame
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleExecuteClaim}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: 6 }}>
                Official Display Name
              </label>
              <input
                type="text"
                required
                className="community-search-input"
                style={{ width: '100%' }}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: 6 }}>
                Public Bio &amp; Accolades
              </label>
              <textarea
                rows={3}
                required
                className="community-search-input"
                style={{ width: '100%', resize: 'none' }}
                value={customBio}
                onChange={(e) => setCustomBio(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: 8 }}>
                Select Your Industry Collaboration Interests
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  'Production',
                  'Sync Licensing',
                  'Mentorship',
                  'Masterclasses',
                  'Catalog Acquisition',
                  'Tour Venture Capital',
                ].map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={`community-pill ${interests.includes(item) ? 'active' : ''}`}
                    onClick={() => handleInterestToggle(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: '#070b16', padding: 16, border: '1px solid #1e293b', borderRadius: 3, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#00f0ff', fontSize: '0.85rem', fontWeight: 700 }}>
                <RiUserSharedFill /> Verified Pro Status Granted Automatically
              </div>
              <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '4px 0 0 0' }}>
                Claiming this induction grants permanent verified pro accreditation and complimentary platform privileges.
              </p>
            </div>

            <button
              type="submit"
              className="community-btn community-btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
              disabled={submitting}
            >
              {submitting ? 'Claiming Profile...' : 'Claim My Wall of Fame Profile'}
              <RiArrowRightLine style={{ marginLeft: 6 }} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
