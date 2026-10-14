import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  RiSearchLine,
  RiTimeLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiHeart3Line,
  RiHeart3Fill,
  RiLinksLine,
  RiCheckLine,
  RiBookOpenFill,
  RiFireFill,
  RiMailSendLine,
  RiCheckboxCircleFill
} from 'react-icons/ri';

import PageHeader from '../../components/common/PageHeader.jsx';
import SEO from '../../components/common/SEO.jsx';
import headerAboutImg from '../../assets/images/header_about.png';
import headerAboutWesternImg from '../../assets/images/header_about_western.png';
import { useRegion } from '../../RegionContext.jsx';
import { blogApi } from '../../lib/api.js';
import { BLOG_CATEGORIES, INITIAL_BLOG_ARTICLES, INITIAL_COMMENTS } from '../../data/blogArticles.js';
import BlogCard from '../../components/blog/BlogCard.jsx';
import BlogCommentsSection from '../../components/blog/BlogCommentsSection.jsx';

export default function BlogPageView({ sessionUser }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { region } = useRegion();
  const headerImg = region === 'western' ? headerAboutWesternImg : headerAboutImg;

  // State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState(INITIAL_BLOG_ARTICLES);
  const [activeArticle, setActiveArticle] = useState(null);
  const [commentsMap, setCommentsMap] = useState(() => {
    const map = {};
    INITIAL_COMMENTS.forEach(c => {
      if (!map[c.article_slug]) map[c.article_slug] = [];
      map[c.article_slug].push(c);
    });
    return map;
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [hasClapped, setHasClapped] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sync articles and comments from backend API on mount
  useEffect(() => {
    blogApi.listArticles()
      .then(res => {
        if (res && Array.isArray(res.articles) && res.articles.length > 0) {
          setArticles(res.articles);
        }
      })
      .catch(err => console.warn('Using client-side blog articles mirror:', err));
  }, []);

  // When slug changes, load active article
  useEffect(() => {
    if (slug) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const localMatch = articles.find(a => a.slug === slug) || INITIAL_BLOG_ARTICLES.find(a => a.slug === slug);
      if (localMatch) {
        setActiveArticle(localMatch);
      }

      blogApi.getArticle(slug)
        .then(res => {
          if (res) {
            setActiveArticle(res);
            if (res.comments) {
              setCommentsMap(prev => ({ ...prev, [slug]: res.comments }));
            }
          }
        })
        .catch(err => console.warn('Error fetching article from API:', err));
    } else {
      setActiveArticle(null);
    }
  }, [slug, articles]);

  // Track reading progress on article detail view
  useEffect(() => {
    if (!activeArticle) return;
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeArticle]);

  // Filtered Articles for List View
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const matchCat =
        selectedCategory === 'all' ||
        art.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'splits' && art.category.includes('Splits')) ||
        (selectedCategory === 'sync' && art.category.includes('Sync')) ||
        (selectedCategory === 'mastering' && art.category.includes('Mastering')) ||
        (selectedCategory === 'creator' && art.category.includes('Creator')) ||
        (selectedCategory === 'touring' && art.category.includes('Touring')) ||
        (selectedCategory === 'publishing' && art.category.includes('Publishing')) ||
        (selectedCategory === 'crm' && art.category.includes('CRM')) ||
        (selectedCategory === 'ai' && art.category.includes('AI'));

      const matchSearch =
        !searchQuery.trim() ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.tags && art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        art.author?.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const featuredArticle = useMemo(() => {
    return articles.find(a => a.featured) || articles[0];
  }, [articles]);

  const handleSelectArticle = (artSlug) => {
    navigate(`/community/blog/${artSlug}`);
  };

  const handleBackToList = () => {
    navigate('/community/blog');
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleClap = async () => {
    if (hasClapped || !activeArticle) return;
    setHasClapped(true);
    setActiveArticle(prev => ({ ...prev, claps: (prev.claps || 0) + 1 }));
    try {
      await blogApi.clapArticle(activeArticle.slug);
    } catch (_) {}
  };

  const handleCommentAdded = (newComment) => {
    const artSlug = activeArticle?.slug || slug;
    setCommentsMap(prev => {
      const existing = prev[artSlug] || [];
      return { ...prev, [artSlug]: [newComment, ...existing] };
    });
    setActiveArticle(prev => prev ? { ...prev, comments_count: (prev.comments_count || 0) + 1 } : null);
  };

  const currentComments = (activeArticle && commentsMap[activeArticle.slug]) || (slug && commentsMap[slug]) || [];

  return (
    <div className="blog-page-view" style={{ minHeight: '100vh', background: '#060813', color: '#f8fafc' }}>
      <SEO
        title={activeArticle ? `${activeArticle.title} — TuneMavens Blog` : "Blog & Creator Editorial — TuneMavens"}
        description={activeArticle ? activeArticle.excerpt : "Comprehensive music operations essays, sync licensing masterclasses, mastering loudness standards, and creator economy insights."}
        keywords="music industry blog, sync licensing guide, waterfall splits accounting, LUFS mastering standards, creator web worlds, M-Pesa touring tickets"
      />

      {/* Reading Progress Bar for Active Article */}
      {activeArticle && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: `${scrollProgress}%`,
            height: '3px',
            background: '#00f0ff',
            zIndex: 9999,
            transition: 'width 0.1s linear'
          }}
        />
      )}

      {/* Hero Header Banner */}
      <PageHeader
        title={activeArticle ? activeArticle.category : "TuneMavens Editorial & Creator Blog"}
        bgImage={headerImg}
        breadcrumb="Blog"
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 96px 24px', boxSizing: 'border-box' }}>
        {activeArticle ? (
          /* ========================================================= */
          /* FULL ARTICLE DETAIL VIEW                                  */
          /* ========================================================= */
          <div className="article-detail-container" style={{ maxWidth: '860px', margin: '0 auto' }}>
            {/* Back to Blog Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <button
                onClick={handleBackToList}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#e2e8f0',
                  padding: '8px 16px',
                  borderRadius: '3px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                }}
              >
                <RiArrowLeftLine size={16} /> All Articles
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleCopyLink}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: copiedLink ? '#34d399' : '#94a3b8',
                    padding: '8px 14px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {copiedLink ? <RiCheckLine size={14} color="#34d399" /> : <RiLinksLine size={14} />}
                  {copiedLink ? 'Link Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Category Pill & Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: 'rgba(0, 240, 255, 0.12)',
                  border: '1px solid rgba(0, 240, 255, 0.35)',
                  color: '#00f0ff',
                  padding: '4px 12px',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}
              >
                {activeArticle.category}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#94a3b8' }}>
                <RiTimeLine size={14} color="#00f0ff" />
                <span>{activeArticle.reading_time || '7 min read'}</span>
              </div>
              <span style={{ fontSize: '13px', color: '#64748b' }}>•</span>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>{activeArticle.published_at}</span>
            </div>

            {/* Article Title */}
            <h1
              style={{
                fontSize: '36px',
                lineHeight: '1.25',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '20px',
                textAlign: 'left'
              }}
            >
              {activeArticle.title}
            </h1>

            {/* Lead Excerpt */}
            <p
              style={{
                fontSize: '18px',
                lineHeight: '1.6',
                color: '#cbd5e1',
                marginBottom: '28px',
                textAlign: 'left',
                borderLeft: '3px solid #00f0ff',
                paddingLeft: '18px'
              }}
            >
              {activeArticle.excerpt}
            </p>

            {/* Author Byline Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 0',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '32px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
                <img
                  src={activeArticle.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'}
                  alt={activeArticle.author?.name}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '3px',
                    objectFit: 'cover',
                    border: '2px solid rgba(0, 240, 255, 0.4)'
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                      {activeArticle.author?.name}
                    </span>
                    <RiCheckboxCircleFill size={14} color="#00f0ff" />
                  </div>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {activeArticle.author?.role}
                  </span>
                </div>
              </div>

              {/* Claps Interaction Button */}
              <button
                onClick={handleClap}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: hasClapped ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid ' + (hasClapped ? 'rgba(244, 63, 94, 0.4)' : 'rgba(255, 255, 255, 0.15)'),
                  color: hasClapped ? '#fb7185' : '#e2e8f0',
                  padding: '8px 16px',
                  borderRadius: '3px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {hasClapped ? <RiHeart3Fill size={16} color="#f43f5e" /> : <RiHeart3Line size={16} />}
                <span>{activeArticle.claps || 0} Applause</span>
              </button>
            </div>

            {/* Featured Image Box with 40% Luminance Boost */}
            <div
              style={{
                width: '100%',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '40px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
              }}
            >
              <img
                src={activeArticle.cover_image}
                alt={activeArticle.title}
                style={{
                  width: '100%',
                  maxHeight: '440px',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'brightness(1.35)'
                }}
              />
            </div>

            {/* Article Structured Body Content */}
            <div
              className="article-body-content"
              style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#e2e8f0',
                textAlign: 'left'
              }}
            >
              {activeArticle.sections ? (
                activeArticle.sections.map((sec, idx) => (
                  <div key={idx} style={{ marginBottom: '36px' }}>
                    <h2
                      style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: '#ffffff',
                        margin: '28px 0 16px 0',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                        paddingBottom: '10px'
                      }}
                    >
                      {sec.heading}
                    </h2>
                    <div
                      style={{ whiteSpace: 'pre-line' }}
                      dangerouslySetInnerHTML={{
                        __html: sec.content
                          .replace(/^### (.*$)/gim, '<h3 style="font-size:18px; color:#00f0ff; margin:20px 0 10px 0;">$1</h3>')
                          .replace(/^> (.*$)/gim, '<blockquote style="border-left:3px solid #00f0ff; background:rgba(0,240,255,0.05); padding:12px 18px; margin:20px 0; border-radius:3px; font-style:italic; color:#f1f5f9;">$1</blockquote>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#ffffff;">$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:3px; color:#00f0ff; font-family:monospace;">$1</code>')
                      }}
                    />
                  </div>
                ))
              ) : (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {activeArticle.content}
                </div>
              )}
            </div>

            {/* Tags Strip */}
            {activeArticle.tags && activeArticle.tags.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginTop: '40px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Topic Tags:</span>
                {activeArticle.tags.map(t => (
                  <span
                    key={t}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#cbd5e1',
                      padding: '4px 10px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: 500
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Author Biography Box */}
            <div
              style={{
                marginTop: '48px',
                background: '#0d1527',
                border: '1px solid rgba(0, 240, 255, 0.25)',
                borderRadius: '3px',
                padding: '24px',
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
                textAlign: 'left'
              }}
            >
              <img
                src={activeArticle.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80'}
                alt={activeArticle.author?.name}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '3px',
                  objectFit: 'cover',
                  border: '2px solid #00f0ff',
                  flexShrink: 0
                }}
              />
              <div>
                <span style={{ fontSize: '11px', color: '#00f0ff', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  About the Author
                </span>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '4px 0' }}>
                  {activeArticle.author?.name}
                </h4>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                  {activeArticle.author?.role}
                </div>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#cbd5e1', margin: 0 }}>
                  {activeArticle.author?.bio || "Regular contributor to TuneMavens Editorial, specializing in music business operations and creator technology."}
                </p>
              </div>
            </div>

            {/* Related Articles Strip */}
            <div style={{ marginTop: '56px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>
                More from TuneMavens Editorial
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                {articles
                  .filter(a => a.slug !== activeArticle.slug)
                  .slice(0, 3)
                  .map(rel => (
                    <div
                      key={rel.slug}
                      onClick={() => handleSelectArticle(rel.slug)}
                      style={{
                        background: '#0b1120',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, border-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = '#00f0ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                    >
                      <img
                        src={rel.cover_image}
                        alt={rel.title}
                        style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                      />
                      <div style={{ padding: '12px' }}>
                        <span style={{ fontSize: '10px', color: '#00f0ff', textTransform: 'uppercase', fontWeight: 700 }}>
                          {rel.category}
                        </span>
                        <h5 style={{ fontSize: '14px', color: '#ffffff', margin: '6px 0', lineHeight: '1.4' }}>
                          {rel.title}
                        </h5>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{rel.reading_time}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Comments Section with Registered User Engagement */}
            <BlogCommentsSection
              articleSlug={activeArticle.slug}
              comments={currentComments}
              sessionUser={sessionUser}
              onCommentAdded={handleCommentAdded}
            />
          </div>
        ) : (
          /* ========================================================= */
          /* BLOG DIRECTORY / LIST VIEW                                */
          /* ========================================================= */
          <div>
            {/* Category Filter Pills & Search Bar */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                marginBottom: '40px'
              }}
            >
              {/* Search & Meta Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#ffffff', margin: 0, textAlign: 'left' }}>
                    Creator Stories &amp; Industry Insights
                  </h2>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0 0', textAlign: 'left' }}>
                    Authoritative breakdowns of split cascades, sync briefs, mastering standards, and web worlds.
                  </p>
                </div>

                {/* Search Input Box */}
                <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
                  <RiSearchLine
                    size={16}
                    color="#00f0ff"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles, topics, or authors..."
                    style={{
                      width: '100%',
                      background: '#0d1527',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '3px',
                      padding: '10px 14px 10px 38px',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#00f0ff'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer'
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Buttons Strip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  overflowX: 'auto',
                  paddingBottom: '8px'
                }}
              >
                {BLOG_CATEGORIES.map(cat => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: '1px solid ' + (isActive ? '#00f0ff' : 'rgba(255, 255, 255, 0.1)'),
                        background: isActive ? '#00f0ff' : '#0d1527',
                        color: isActive ? '#060813' : '#cbd5e1',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Featured Article Spotlight Card (only if showing all & no active search query) */}
            {selectedCategory === 'all' && !searchQuery && featuredArticle && (
              <div
                style={{
                  background: '#0d1527',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginBottom: '48px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
                  textAlign: 'left'
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', minHeight: '300px', overflow: 'hidden' }}>
                  <img
                    src={featuredArticle.cover_image}
                    alt={featuredArticle.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(1.3)'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      background: '#00f0ff',
                      color: '#060813',
                      padding: '4px 10px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RiFireFill size={14} /> Featured Masterclass
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', color: '#00f0ff', textTransform: 'uppercase', fontWeight: 700 }}>
                      {featuredArticle.category}
                    </span>
                    <span style={{ color: '#64748b' }}>•</span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{featuredArticle.reading_time}</span>
                  </div>

                  <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', lineHeight: '1.35', marginBottom: '14px' }}>
                    <Link
                      to={`/community/blog/${featuredArticle.slug}`}
                      onClick={(e) => { e.preventDefault(); handleSelectArticle(featuredArticle.slug); }}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {featuredArticle.title}
                    </Link>
                  </h2>

                  <p style={{ fontSize: '14px', lineHeight: '1.65', color: '#cbd5e1', marginBottom: '24px' }}>
                    {featuredArticle.excerpt}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={featuredArticle.author?.avatar}
                        alt={featuredArticle.author?.name}
                        style={{ width: '36px', height: '36px', borderRadius: '3px', objectFit: 'cover', border: '1.5px solid #00f0ff' }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                          {featuredArticle.author?.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {featuredArticle.author?.role}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectArticle(featuredArticle.slug)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#00f0ff',
                        color: '#060813',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '3px',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      Read Full Article <RiArrowRightLine size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            {filteredArticles.length === 0 ? (
              <div
                style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  background: '#0d1527',
                  borderRadius: '3px',
                  border: '1px dashed rgba(255, 255, 255, 0.15)'
                }}
              >
                <RiBookOpenFill size={40} color="#00f0ff" style={{ opacity: 0.5, marginBottom: '12px' }} />
                <h3 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '8px' }}>
                  No matching articles found
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', maxWidth: '400px', margin: '0 auto 20px' }}>
                  We couldn't find any articles matching your search or category filter. Try searching for different keywords like "splits", "sync", or "LUFS".
                </p>
                <button
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  style={{
                    padding: '8px 20px',
                    background: '#00f0ff',
                    color: '#060813',
                    border: 'none',
                    borderRadius: '3px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                  gap: '24px'
                }}
              >
                {filteredArticles.map(art => (
                  <BlogCard
                    key={art.slug}
                    article={{
                      ...art,
                      comments_count: (commentsMap[art.slug] ? commentsMap[art.slug].length : art.comments_count) || 0
                    }}
                    onSelectArticle={handleSelectArticle}
                  />
                ))}
              </div>
            )}

            {/* Newsletter & Editorial Dispatch Subscription Box */}
            <div
              style={{
                marginTop: '64px',
                background: '#0d1527',
                border: '1px solid rgba(0, 240, 255, 0.25)',
                borderRadius: '3px',
                padding: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '24px',
                textAlign: 'left'
              }}
            >
              <div style={{ maxWidth: '600px' }}>
                <span style={{ fontSize: '11px', color: '#00f0ff', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>
                  TuneMavens Editorial Dispatch
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', margin: '6px 0 8px 0' }}>
                  Receive Masterclass Deconstructions in Your Inbox
                </h3>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#94a3b8', margin: 0 }}>
                  Weekly breakdowns of active television sync briefs, waterfall split templates, LUFS mastering guidelines, and creator growth strategies. No spam, unsubscribe anytime.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  style={{
                    background: '#070b14',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '3px',
                    padding: '12px 16px',
                    color: '#ffffff',
                    fontSize: '13px',
                    minWidth: '240px',
                    outline: 'none'
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#00f0ff'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
                />
                <button
                  onClick={() => alert('Thank you for subscribing to the TuneMavens Editorial Dispatch!')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#00f0ff',
                    color: '#060813',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '3px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <RiMailSendLine size={16} /> Subscribe
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
