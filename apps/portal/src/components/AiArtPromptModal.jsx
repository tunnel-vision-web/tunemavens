import React, { useState, useEffect } from 'react';
import {
  RiSparklingFill, RiCloseLine, RiImageAddLine, RiCheckLine,
  RiRefreshLine, RiPaletteLine, RiMagicLine, RiDownloadLine
} from 'react-icons/ri';

const PROMPT_INSPIRATIONS = [
  "Afro-futuristic synthesizer solo with holographic lighting and rich warm tones",
  "Nairobi skyline at twilight, deep cyberpunk neon, analog tape aesthetic",
  "Highlife guitar master recorded in vintage analog studio with golden bokeh",
  "Swahili coastal sunset with acoustic melodies, warm amber and ocean cyan",
  "Amapiano club energy, log drum textures, dynamic contrast and vibrant motion",
  "Deep atmospheric soundscapes, minimalist vinyl aesthetic, 8k ultra-detailed"
];

const IMAGE_STYLES = [
  { id: 'none', label: 'None / Custom Prompt Style', desc: 'Use prompt as typed' },
  { id: 'afro_futurism', label: 'Afro-Futurism', desc: 'Cosmic African cyber-tribal aesthetics, golden accents, luminescent patterns' },
  { id: 'retro_synth', label: 'Retro 80s Synthwave', desc: 'Chrome grid, neon magenta & cyan lasers, nostalgic VHS analog glow' },
  { id: 'modern_editorial', label: 'Modern Editorial', desc: 'Clean high-fashion minimalism, architectural studio lighting, crisp contrast' },
  { id: 'cyberpunk', label: 'Cyberpunk Neon', desc: 'Dark futuristic megacity, rain reflections, glowing holographic signage' },
  { id: 'cartoon_anime', label: 'Cartoon / Anime', desc: 'Vibrant comic cel-shading, dynamic bold linework, stylized character art' },
  { id: 'octane_3d', label: '3D Render / Octane', desc: 'Hyper-detailed 3D modeling, volumetric ray-tracing, glossy metallic surfaces' },
  { id: 'oil_painting', label: 'Oil Painting / Impressionist', desc: 'Rich impasto textures, expressive artistic palette knife and canvas brushwork' },
  { id: 'studio_photo', label: 'Studio Photography', desc: '8k ultra-sharp DSLR portrait, shallow depth of field, softbox rim lighting' }
];

export default function AiArtPromptModal({
  isOpen,
  onClose,
  onApply,
  onApplyArtwork,
  onSuccess,
  initialPrompt = '',
  defaultPrompt = '',
  title = 'AI Artwork Creation Studio',
  contextTitle = 'Master Release',
  defaultAspectRatio = '1:1'
}) {
  const effectiveInitial = defaultPrompt || initialPrompt || '';
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('none');
  const [stylesList, setStylesList] = useState(IMAGE_STYLES);
  const [aspectRatio, setAspectRatio] = useState(defaultAspectRatio);
  const [generating, setGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/social-ai/styles')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && Array.isArray(data.styles) && data.styles.length > 0) {
            setStylesList(data.styles);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setPrompt(effectiveInitial || `High-fashion album cover for "${contextTitle}", Afro-futurist aesthetic, vibrant lighting, crisp detail`);
      setAspectRatio(defaultAspectRatio);
      setGeneratedResult(null);
      setErrorMsg(null);
    }
  }, [isOpen, effectiveInitial, contextTitle, defaultAspectRatio]);

  if (!isOpen) return null;

  const handleInspirePrompt = () => {
    const random = PROMPT_INSPIRATIONS[Math.floor(Math.random() * PROMPT_INSPIRATIONS.length)];
    setPrompt(`${random}, themed for "${contextTitle}"`);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMsg('Please enter a prompt to guide the AI.');
      return;
    }

    setGenerating(true);
    setErrorMsg(null);

    let effectivePrompt = prompt.trim();
    if (selectedStyle && selectedStyle !== 'none') {
      const styleObj = stylesList.find(s => s.id === selectedStyle);
      if (styleObj) {
        effectivePrompt = `${effectivePrompt}, style: ${styleObj.label} (${styleObj.prompt_suffix || styleObj.desc})`;
      }
    }

    try {
      const res = await fetch('/api/social-ai/generate-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: effectivePrompt,
          aspect_ratio: aspectRatio
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedResult(data.asset);
      } else {
        const err = await res.json();
        setErrorMsg(err.detail || 'Failed to generate artwork.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Network error generating artwork.');
    } finally {
      setGenerating(false);
    }
  };

  const handleConfirmApply = () => {
    const url = generatedResult?.media_url;
    if (url) {
      if (typeof onApply === 'function') onApply(url, generatedResult);
      if (typeof onApplyArtwork === 'function') onApplyArtwork(url, generatedResult);
      if (typeof onSuccess === 'function') onSuccess(url, prompt);
      onClose();
    }
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(10px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div style={{
        background: '#0c101d',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '6px',
        width: '100%',
        maxWidth: '620px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#00f0ff', padding: '6px', borderRadius: '3px', color: '#000' }}>
              <RiSparklingFill size={16} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#fff' }}>
                {title}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94a3b8' }}>
                Prompt custom 96 DPI Retina artwork for <strong style={{ color: '#22d3ee' }}>{contextTitle}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer', padding: '4px' }}
          >
            <RiCloseLine />
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '8px 20px', background: 'rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '12px', fontWeight: 700 }}>
            {errorMsg}
          </div>
        )}

        {/* Content Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '78vh', overflowY: 'auto' }}>
          {/* Prompt Input Area */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1' }}>
                Creative Prompt Instruction
              </label>
              <button
                type="button"
                onClick={handleInspirePrompt}
                style={{
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.35)',
                  color: '#c084fc',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RiMagicLine size={12} /> Inspire Prompt
              </button>
            </div>
            <textarea
              rows={3}
              placeholder="Describe what you want to see (lighting, mood, textures, instruments, typography style)..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: '#04060d',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '3px',
                color: '#fff',
                fontSize: '12.5px',
                resize: 'vertical',
                lineHeight: 1.4
              }}
            />
          </div>

          {/* Image Style Dropdown */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Image Style Preset (Retro, Cartoon, Modern, Cyberpunk, etc.)
            </label>
            <select
              value={selectedStyle}
              onChange={e => setSelectedStyle(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                background: '#04060d',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '3px',
                color: '#00f0ff',
                fontSize: '12.5px',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {stylesList.map(st => (
                <option key={st.id} value={st.id} style={{ background: '#0c101d', color: '#fff' }}>
                  {st.label} {st.desc ? `— ${st.desc}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Aspect Ratio Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Canvas Aspect Ratio (Retina-Ready 96 DPI)
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: '1:1', label: '1:1 Square', desc: 'Album & Track Cover' },
                { id: '16:9', label: '16:9 Widescreen', desc: 'Hero & Video Reel' },
                { id: '3:1', label: '3:1 Ribbon', desc: 'Header Banner' },
                { id: '4:5', label: '4:5 Portrait', desc: 'Poster / Mobile' }
              ].map(ar => (
                <button
                  key={ar.id}
                  type="button"
                  onClick={() => setAspectRatio(ar.id)}
                  style={{
                    flex: '1 1 120px',
                    padding: '8px 10px',
                    background: aspectRatio === ar.id ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.03)',
                    border: aspectRatio === ar.id ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 800, color: aspectRatio === ar.id ? '#22d3ee' : '#fff' }}>
                    {ar.label}
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                    {ar.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview / Result Area */}
          {generatedResult && (
            <div style={{
              background: '#04060d',
              border: '1px solid rgba(34,211,238,0.3)',
              borderRadius: '4px',
              padding: '12px',
              display: 'flex',
              gap: '16px',
              alignItems: 'center'
            }}>
              <div style={{
                width: aspectRatio === '1:1' ? '120px' : aspectRatio === '3:1' ? '180px' : '140px',
                height: aspectRatio === '3:1' ? '60px' : '120px',
                borderRadius: '3px',
                overflow: 'hidden',
                background: '#1e293b',
                flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <img
                  src={generatedResult.media_url}
                  alt="Generated AI Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '2px 6px', borderRadius: '2px' }}>
                    ✓ 96 DPI Retina Master Ready
                  </span>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                    {aspectRatio}
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#cbd5e1', marginTop: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {generatedResult.prompt}
                </div>
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                  Saved in CMS Media Library • Ready to apply
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            style={{
              padding: '10px',
              background: generating ? '#64748b' : '#00f0ff',
              color: '#000',
              border: 'none',
              borderRadius: '3px',
              fontWeight: 800,
              fontSize: '13px',
              cursor: generating ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            {generating ? (
              <>
                <RiRefreshLine className="spin" size={16} />
                Generating 96 DPI Retina Artwork...
              </>
            ) : (
              <>
                <RiSparklingFill size={16} />
                {generatedResult ? 'Re-generate with AI' : 'Generate Artwork with AI'}
              </>
            )}
          </button>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.02)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '7px 14px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#94a3b8',
              borderRadius: '3px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          {generatedResult && (
            <button
              type="button"
              onClick={handleConfirmApply}
              style={{
                padding: '7px 18px',
                background: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(16,185,129,0.3)'
              }}
            >
              <RiCheckLine size={16} /> Apply Artwork to {contextTitle}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
