import React from 'react';
import { Link } from 'react-router-dom';
import { RiTimeLine, RiChat1Line, RiArrowRightLine, RiHeart3Line } from 'react-icons/ri';

export default function BlogCard({ article, onSelectArticle }) {
  if (!article) return null;

  const handleClick = (e) => {
    if (onSelectArticle) {
      e.preventDefault();
      onSelectArticle(article.slug);
    }
  };

  return (
    <div
      className="blog-card"
      style={{
        background: '#0d1527',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '3px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        height: '100%',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.4)';
        e.currentTarget.style.boxShadow = '0 10px 28px rgba(0, 240, 255, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
      }}
    >
      {/* Cover Image Thumbnail Box */}
      <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', background: '#070b14', borderRadius: '3px 3px 0 0' }}>
        <img
          src={article.cover_image}
          alt={article.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(1.25)',
            transition: 'transform 0.4s ease, filter 0.4s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04)';
            e.currentTarget.style.filter = 'brightness(1.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1.0)';
            e.currentTarget.style.filter = 'brightness(1.25)';
          }}
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'rgba(6, 8, 19, 0.85)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            padding: '4px 10px',
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#00f0ff',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}
        >
          {article.category}
        </div>
      </div>

      {/* Card Content Box */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'left' }}>
        {/* Meta Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', fontSize: '12px', color: '#8899a6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RiTimeLine size={13} color="#00f0ff" />
            <span>{article.reading_time || '6 min read'}</span>
          </div>
          <span>{article.published_at}</span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '17px',
            fontWeight: 700,
            lineHeight: '1.4',
            marginBottom: '10px',
            color: '#ffffff',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          <Link
            to={`/community/blog/${article.slug}`}
            onClick={handleClick}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {article.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p
          style={{
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#a0aec0',
            marginBottom: '18px',
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {article.excerpt}
        </p>

        {/* Author & Interaction Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            marginTop: 'auto'
          }}
        >
          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <img
              src={article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80'}
              alt={article.author?.name}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '3px',
                objectFit: 'cover',
                border: '1.5px solid rgba(0, 240, 255, 0.4)'
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0' }}>
              {article.author?.name}
            </span>
          </div>

          {/* Comments & Claps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#94a3b8' }}>
            {article.claps ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RiHeart3Line size={13} color="#f43f5e" />
                {article.claps}
              </span>
            ) : null}
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RiChat1Line size={13} color="#00f0ff" />
              {article.comments_count || 0}
            </span>
          </div>
        </div>

        {/* Read CTA Button */}
        <div style={{ marginTop: '14px' }}>
          <Link
            to={`/community/blog/${article.slug}`}
            onClick={handleClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#00f0ff',
              textDecoration: 'none',
              padding: '6px 12px',
              background: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              borderRadius: '3px',
              transition: 'background 0.2s'
            }}
          >
            Read Article <RiArrowRightLine size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
