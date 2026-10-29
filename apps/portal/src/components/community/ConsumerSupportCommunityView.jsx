import React, { useState, useMemo, useEffect } from 'react';
import {
  RiBookOpenFill,
  RiFileList3Line,
  RiCustomerService2Fill,
  RiSearchLine,
  RiTimeLine,
  RiHeart3Line,
  RiHeart3Fill,
  RiMessage2Fill,
  RiShareLine,
  RiCheckLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiShieldCheckLine,
  RiQuestionFill,
  RiSendPlaneFill,
  RiThumbUpLine,
  RiThumbDownLine,
  RiCloseLine,
  RiHeadphoneFill,
  RiCompass3Line,
  RiCoinsFill,
  RiSparklingFill,
  RiChatVoiceFill,
  RiAddLine,
  RiDiscussFill,
  RiUser3Fill,
  RiFireFill,
  RiPriceTag3Line,
  RiFilter3Line
} from 'react-icons/ri';

import {
  CONSUMER_BLOG_CATEGORIES,
  CONSUMER_BLOG_ARTICLES,
  INITIAL_CONSUMER_BLOG_COMMENTS
} from '../../data/consumerBlogArticles.js';

import {
  CONSUMER_DOC_CATEGORIES,
  CONSUMER_DOC_ARTICLES,
  FREQUENT_CONSUMER_FAQS
} from '../../data/consumerDocArticles.js';

import SupportTicketsPanel from './SupportTicketsPanel.jsx';

// Initial Mock Community Forum Topics
const FORUM_CATEGORIES = [
  { id: 'all', label: 'All Discussions' },
  { id: 'gear', label: 'HiFi Gear & Setups' },
  { id: 'discovery', label: 'African & Global Discovery' },
  { id: 'features', label: 'Feature Requests & Off-Grid' },
  { id: 'creators', label: 'Meet the Creators & Q&A' },
  { id: 'banter', label: 'General Sound Banter' },
];

const INITIAL_FORUM_TOPICS = [
  {
    id: 'top-1',
    categoryId: 'gear',
    categoryLabel: 'HiFi Gear & Setups',
    title: 'Best portable DAC/AMP dongle for 24-bit/48kHz Lossless FLAC on iOS & Android?',
    author: {
      name: 'Marcus Lin',
      role: 'Audiophile Member',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    createdAt: '2 hours ago',
    upvotes: 42,
    hasUpvoted: false,
    content: 'Now that TuneStream streams bit-perfect 24-bit / 48kHz FLAC, I want to upgrade past standard Bluetooth compression. What are your recommended portable DACs that work effortlessly on USB-C without draining phone battery?',
    replies: [
      {
        id: 'rep-1',
        author: 'Elena Rostova',
        role: 'Acoustic Engineer & Author',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        createdAt: '1 hour ago',
        content: 'For an ultra-compact setup, the Apple USB-C to 3.5mm headphone adapter is surprisingly capable up to 24-bit/48kHz. If you run planar magnetic headphones or high-impedance IEMs, the Qudelix-5K or iFi Go Link deliver superior current and dynamic headroom without excessive battery drain.'
      },
      {
        id: 'rep-2',
        author: 'Ndufo',
        role: 'Verified Creator',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
        createdAt: '45 mins ago',
        content: 'Can verify! In our studio monitoring chain we test master bounces through an iFi Hip-DAC as well as standard car audio. The analog sub-bass warmth on 24-bit FLAC translates with pure clarity.'
      }
    ]
  },
  {
    id: 'top-2',
    categoryId: 'discovery',
    categoryLabel: 'African & Global Discovery',
    title: 'Where to start with Brian Omondi and modern Kenyan Benga-Electronic fusion?',
    author: {
      name: 'Sarah Kimani',
      role: 'Verified Listener',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    createdAt: '5 hours ago',
    upvotes: 29,
    hasUpvoted: false,
    content: 'Just heard Brian Omondi\'s recent singles on TuneStream Explore and I\'m completely blown away by the live percussion and 808 blending. Does anyone have a curated crate or playlist of similar East African acoustic masters?',
    replies: [
      {
        id: 'rep-3',
        author: 'Kofi Mensah',
        role: 'Curator & DJ',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100',
        createdAt: '3 hours ago',
        content: 'Check out the "Nairobi Polyrythm Crates" in the explore dropdown! Also listen to Aisha\'s Sahelian acoustic sessions—the polyrhythmic interlocking guitars share the same lineage as Benga fingerpicking.'
      }
    ]
  },
  {
    id: 'top-3',
    categoryId: 'features',
    categoryLabel: 'Feature Requests & Off-Grid',
    title: 'Offline Caching to MicroSD card: Can we set custom storage directories?',
    author: {
      name: 'Liam O\'Connor',
      role: 'Traveler & Listener',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
    },
    createdAt: '1 day ago',
    upvotes: 37,
    hasUpvoted: false,
    content: 'I frequently travel through areas with zero cell connectivity. I cached 8GB of FLAC in TuneStream, but my Android phone has a 512GB MicroSD slot. Any chance we can route offline vault downloads directly to external storage?',
    replies: [
      {
        id: 'rep-4',
        author: 'TuneStream Core Team',
        role: 'Engineering Support',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
        createdAt: '18 hours ago',
        content: 'Yes! In the mobile build v1.1, you can navigate to HiFi Player Settings → Offline Storage Path and select any mounted external storage volume. Encrypted cryptographic audio keys remain secure in hardware keystore.'
      }
    ]
  },
  {
    id: 'top-4',
    categoryId: 'creators',
    categoryLabel: 'Meet the Creators & Q&A',
    title: 'Artist Direct Tipping vs Merch: What percentage actually goes into artist pockets?',
    author: {
      name: 'David Vance',
      role: 'Music Patron',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100'
    },
    createdAt: '2 days ago',
    upvotes: 54,
    hasUpvoted: false,
    content: 'Traditional streaming pays fractions of a cent ($0.003). When I send a 50 credit or $5 tip on TuneStream to a creator like Ndufo or Aisha, what is the exact payout cascade?',
    replies: [
      {
        id: 'rep-5',
        author: 'TuneMavens Ops',
        role: 'Platform Admin',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
        createdAt: '1 day ago',
        content: 'Direct Tips on TuneStream route 92% directly to the creator\'s TunePay vault immediately, with zero deductions or DSP holdbacks. The remaining 8% covers credit card processor fees and decentralized verification.'
      }
    ]
  }
];

export default function ConsumerSupportCommunityView({
  sessionUser = null,
  catalogTracks = [],
  initialSection = 'docs',
  onBackToExplore = null
}) {
  // Normalize initial section: 'blog'|'forum' -> 'blog', 'support'|'tickets' -> 'tickets', 'help'|'docs' -> 'docs'
  const getTabFromProp = (sec) => {
    if (sec === 'blog' || sec === 'forum') return 'blog';
    if (sec === 'tickets' || sec === 'support') return 'tickets';
    return 'docs';
  };

  const [activeMainTab, setActiveMainTab] = useState(getTabFromProp(initialSection));
  const [blogSubTab, setBlogSubTab] = useState(initialSection === 'forum' ? 'forum' : 'editorial'); // 'editorial' | 'forum'

  // Update tabs when initialSection changes
  useEffect(() => {
    const nextTab = getTabFromProp(initialSection);
    setActiveMainTab(nextTab);
    if (initialSection === 'forum') {
      setBlogSubTab('forum');
    } else if (initialSection === 'blog') {
      setBlogSubTab('editorial');
    }
  }, [initialSection]);

  // Documentation state
  const [docCategory, setDocCategory] = useState('all');
  const [docSearch, setDocSearch] = useState('');
  const [activeDocArticle, setActiveDocArticle] = useState(null);
  const [docFeedbackMap, setDocFeedbackMap] = useState({});
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Blog state
  const [blogCategory, setBlogCategory] = useState('all');
  const [blogSearch, setBlogSearch] = useState('');
  const [activeBlogArticle, setActiveBlogArticle] = useState(null);
  const [blogLikes, setBlogLikes] = useState({});
  const [blogComments, setBlogComments] = useState(INITIAL_CONSUMER_BLOG_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Forum state
  const [forumCategory, setForumCategory] = useState('all');
  const [forumSearch, setForumSearch] = useState('');
  const [forumTopics, setForumTopics] = useState(INITIAL_FORUM_TOPICS);
  const [activeForumTopic, setActiveForumTopic] = useState(null);
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('gear');
  const [newTopicBody, setNewTopicBody] = useState('');
  const [newReplyText, setNewReplyText] = useState('');

  // Filtered documentation articles
  const filteredDocArticles = useMemo(() => {
    return CONSUMER_DOC_ARTICLES.filter((article) => {
      const matchesCategory = docCategory === 'all' || article.categoryId === docCategory;
      const q = docSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q) ||
        (article.steps && article.steps.some((s) => s.title.toLowerCase().includes(q) || s.detail.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [docCategory, docSearch]);

  // Filtered blog articles
  const filteredBlogArticles = useMemo(() => {
    return CONSUMER_BLOG_ARTICLES.filter((article) => {
      const matchesCategory = blogCategory === 'all' || article.categoryId === blogCategory;
      const q = blogSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q) ||
        (article.tags && article.tags.some((t) => t.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [blogCategory, blogSearch]);

  // Filtered forum topics
  const filteredForumTopics = useMemo(() => {
    return forumTopics.filter((topic) => {
      const matchesCategory = forumCategory === 'all' || topic.categoryId === forumCategory;
      const q = forumSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        topic.title.toLowerCase().includes(q) ||
        topic.content.toLowerCase().includes(q) ||
        topic.author.name.toLowerCase().includes(q) ||
        topic.categoryLabel.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [forumTopics, forumCategory, forumSearch]);

  // Handle like toggle on blog
  const handleToggleLike = (slug) => {
    setBlogLikes((prev) => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  // Handle new blog comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeBlogArticle) return;

    const newComment = {
      id: `c_${Date.now()}`,
      author: sessionUser?.name || sessionUser?.username || 'Community Listener',
      role: sessionUser?.role || 'Verified Listener',
      avatar: sessionUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      timestamp: 'Just now',
      content: newCommentText.trim()
    };

    setBlogComments((prev) => ({
      ...prev,
      [activeBlogArticle.slug]: [newComment, ...(prev[activeBlogArticle.slug] || [])]
    }));

    setNewCommentText('');
  };

  // Handle share
  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // Handle forum upvote
  const handleToggleForumUpvote = (topicId) => {
    setForumTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const nextUpvoted = !t.hasUpvoted;
          return {
            ...t,
            hasUpvoted: nextUpvoted,
            upvotes: nextUpvoted ? t.upvotes + 1 : t.upvotes - 1
          };
        }
        return t;
      })
    );

    if (activeForumTopic && activeForumTopic.id === topicId) {
      setActiveForumTopic((prev) => {
        const nextUpvoted = !prev.hasUpvoted;
        return {
          ...prev,
          hasUpvoted: nextUpvoted,
          upvotes: nextUpvoted ? prev.upvotes + 1 : prev.upvotes - 1
        };
      });
    }
  };

  // Handle post new topic
  const handleCreateForumTopic = (e) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !newTopicBody.trim()) return;

    const catObj = FORUM_CATEGORIES.find((c) => c.id === newTopicCategory) || FORUM_CATEGORIES[1];

    const newTopic = {
      id: `top-${Date.now()}`,
      categoryId: newTopicCategory,
      categoryLabel: catObj.label,
      title: newTopicTitle.trim(),
      author: {
        name: sessionUser?.name || sessionUser?.username || 'TuneStream Listener',
        role: sessionUser?.role || 'Community Listener',
        avatar: sessionUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
      },
      createdAt: 'Just now',
      upvotes: 1,
      hasUpvoted: true,
      content: newTopicBody.trim(),
      replies: []
    };

    setForumTopics([newTopic, ...forumTopics]);
    setNewTopicTitle('');
    setNewTopicBody('');
    setShowNewTopicForm(false);
    setActiveForumTopic(newTopic);
  };

  // Handle post reply in forum thread
  const handleAddForumReply = (e) => {
    e.preventDefault();
    if (!newReplyText.trim() || !activeForumTopic) return;

    const replyObj = {
      id: `rep-${Date.now()}`,
      author: sessionUser?.name || sessionUser?.username || 'TuneStream Listener',
      role: sessionUser?.role || 'Community Listener',
      avatar: sessionUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      createdAt: 'Just now',
      content: newReplyText.trim()
    };

    const updatedTopic = {
      ...activeForumTopic,
      replies: [...activeForumTopic.replies, replyObj]
    };

    setActiveForumTopic(updatedTopic);
    setForumTopics((prev) =>
      prev.map((t) => (t.id === activeForumTopic.id ? updatedTopic : t))
    );
    setNewReplyText('');
  };

  return (
    <div className="consumer-support-community-view" style={{ width: '100%', boxSizing: 'border-box' }}>
      {/* Top Header Badge & Navigation Tabs */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(34, 211, 238, 0.08)',
          border: '1px solid rgba(34, 211, 238, 0.25)',
          padding: '6px 14px',
          borderRadius: '3px',
          fontSize: '11px',
          fontWeight: '700',
          color: '#22d3ee',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '14px'
        }}>
          <RiCustomerService2Fill size={14} /> Support &amp; Community Hub
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
          TuneStream Help &amp; Sound Community
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '720px', margin: '0 auto 28px', lineHeight: '1.6' }}>
          Explore sound culture articles, engage in the listener forum, browse step-by-step documentation, or submit an AI-Assisted support ticket.
        </p>

        {/* 3 Main View Tabs - Exactly matching the Support & Community Dropdown */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: '#090d1f',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '4px',
          borderRadius: '3px',
          gap: '4px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            type="button"
            onClick={() => { setActiveMainTab('blog'); setActiveBlogArticle(null); setActiveForumTopic(null); }}
            style={{
              padding: '10px 22px',
              borderRadius: '3px',
              border: activeMainTab === 'blog' ? '1px solid #10b981' : '1px solid transparent',
              background: activeMainTab === 'blog' ? 'rgba(16, 185, 129, 0.14)' : 'transparent',
              color: activeMainTab === 'blog' ? '#10b981' : '#94a3b8',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.18s ease'
            }}
          >
            <RiFileList3Line size={16} /> Blog &amp; Forum
          </button>

          <button
            type="button"
            onClick={() => { setActiveMainTab('docs'); setActiveDocArticle(null); }}
            style={{
              padding: '10px 22px',
              borderRadius: '3px',
              border: activeMainTab === 'docs' ? '1px solid #22d3ee' : '1px solid transparent',
              background: activeMainTab === 'docs' ? 'rgba(34, 211, 238, 0.14)' : 'transparent',
              color: activeMainTab === 'docs' ? '#22d3ee' : '#94a3b8',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.18s ease'
            }}
          >
            <RiBookOpenFill size={16} /> Help &amp; Documentation
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('tickets')}
            style={{
              padding: '10px 22px',
              borderRadius: '3px',
              border: activeMainTab === 'tickets' ? '1px solid #a855f7' : '1px solid transparent',
              background: activeMainTab === 'tickets' ? 'rgba(168, 85, 247, 0.14)' : 'transparent',
              color: activeMainTab === 'tickets' ? '#c084fc' : '#94a3b8',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.18s ease'
            }}
          >
            <RiCustomerService2Fill size={16} /> Support Desk
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: BLOG & FORUM
          ========================================================================= */}
      {activeMainTab === 'blog' && (
        <div className="section-blog-forum" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          {/* Sub-Tabs for Editorial Stories vs Community Forum */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '14px',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => { setBlogSubTab('editorial'); setActiveBlogArticle(null); setActiveForumTopic(null); }}
                style={{
                  padding: '8px 18px',
                  borderRadius: '3px',
                  border: blogSubTab === 'editorial' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: blogSubTab === 'editorial' ? 'rgba(16, 185, 129, 0.15)' : '#090d1f',
                  color: blogSubTab === 'editorial' ? '#10b981' : '#94a3b8',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RiFileList3Line size={15} /> Editorial Stories &amp; Articles ({CONSUMER_BLOG_ARTICLES.length})
              </button>

              <button
                type="button"
                onClick={() => { setBlogSubTab('forum'); setActiveBlogArticle(null); setActiveForumTopic(null); }}
                style={{
                  padding: '8px 18px',
                  borderRadius: '3px',
                  border: blogSubTab === 'forum' ? '1px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: blogSubTab === 'forum' ? 'rgba(34, 211, 238, 0.15)' : '#090d1f',
                  color: blogSubTab === 'forum' ? '#22d3ee' : '#94a3b8',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RiDiscussFill size={15} /> Community Discussions &amp; Forum ({forumTopics.length})
              </button>
            </div>

            {blogSubTab === 'forum' && !activeForumTopic && (
              <button
                type="button"
                onClick={() => setShowNewTopicForm(!showNewTopicForm)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '3px',
                  border: '1px solid #22d3ee',
                  background: showNewTopicForm ? 'rgba(34, 211, 238, 0.2)' : '#22d3ee',
                  color: showNewTopicForm ? '#22d3ee' : '#050814',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RiAddLine size={16} /> {showNewTopicForm ? 'Close Form' : '+ Start New Discussion'}
              </button>
            )}
          </div>

          {/* SUB-VIEW 1A: EDITORIAL STORIES */}
          {blogSubTab === 'editorial' && (
            <div>
              {activeBlogArticle ? (
                /* Single Blog Article Reader */
                <article style={{
                  background: '#090d1f',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                  padding: '36px',
                  maxWidth: '860px',
                  margin: '0 auto',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <button
                      type="button"
                      onClick={() => setActiveBlogArticle(null)}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '3px',
                        color: '#94a3b8',
                        padding: '6px 14px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <RiArrowLeftLine size={14} /> Back to All Articles
                    </button>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleLike(activeBlogArticle.slug)}
                        style={{
                          background: blogLikes[activeBlogArticle.slug] ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          border: blogLikes[activeBlogArticle.slug] ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '3px',
                          color: blogLikes[activeBlogArticle.slug] ? '#ef4444' : '#fff',
                          padding: '6px 14px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {blogLikes[activeBlogArticle.slug] ? <RiHeart3Fill size={15} /> : <RiHeart3Line size={15} />}
                        {activeBlogArticle.claps + (blogLikes[activeBlogArticle.slug] ? 1 : 0)}
                      </button>

                      <button
                        type="button"
                        onClick={handleShare}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '3px',
                          color: '#22d3ee',
                          padding: '6px 14px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {copiedLink ? <><RiCheckLine size={14} /> Link Copied!</> : <><RiShareLine size={14} /> Share</>}
                      </button>
                    </div>
                  </div>

                  <div style={{
                    width: '100%',
                    height: '380px',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    marginBottom: '28px',
                    background: '#111827'
                  }}>
                    <img
                      src={activeBlogArticle.cover_image}
                      alt={activeBlogArticle.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      padding: '3px 10px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}>
                      {activeBlogArticle.category}
                    </span>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>•</span>
                    <span style={{ color: '#94a3b8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <RiTimeLine size={14} /> {activeBlogArticle.reading_time}
                    </span>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>•</span>
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>{activeBlogArticle.published_at}</span>
                  </div>

                  <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 18px 0', lineHeight: '1.3' }}>
                    {activeBlogArticle.title}
                  </h1>

                  {/* Author Card */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '14px 18px',
                    borderRadius: '3px',
                    marginBottom: '32px'
                  }}>
                    <img
                      src={activeBlogArticle.author.avatar}
                      alt={activeBlogArticle.author.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>{activeBlogArticle.author.name}</div>
                      <div style={{ color: '#10b981', fontSize: '12px', marginBottom: '3px' }}>{activeBlogArticle.author.role}</div>
                      <div style={{ color: '#94a3b8', fontSize: '12px' }}>{activeBlogArticle.author.bio}</div>
                    </div>
                  </div>

                  {/* Article Body Sections */}
                  <div style={{ color: '#cbd5e1', fontSize: '16px', lineHeight: '1.8' }}>
                    <p style={{ fontSize: '18px', color: '#f1f5f9', fontWeight: '500', lineHeight: '1.6', marginBottom: '28px' }}>
                      {activeBlogArticle.excerpt}
                    </p>

                    {activeBlogArticle.sections.map((sec, idx) => (
                      <div key={idx} style={{ marginBottom: '28px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: '0 0 12px 0' }}>
                          {sec.heading}
                        </h2>
                        <div style={{ whiteSpace: 'pre-line' }}>{sec.content}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '36px 0', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
                    {activeBlogArticle.tags.map((tag) => (
                      <span key={tag} style={{
                        background: '#050814',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '4px 10px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        color: '#94a3b8'
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Comments Section */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RiMessage2Fill size={18} color="#10b981" /> Listener Discussion ({(blogComments[activeBlogArticle.slug] || []).length})
                    </h3>

                    <form onSubmit={handleAddComment} style={{ marginBottom: '24px' }}>
                      <textarea
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Share your listening impressions or technical feedback..."
                        rows={3}
                        style={{
                          width: '100%',
                          background: '#050814',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '3px',
                          padding: '12px',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                          resize: 'vertical',
                          marginBottom: '10px'
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type="submit"
                          style={{
                            padding: '8px 20px',
                            background: '#10b981',
                            color: '#050814',
                            border: 'none',
                            borderRadius: '3px',
                            fontWeight: '700',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <RiSendPlaneFill size={14} /> Post Comment
                        </button>
                      </div>
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {(blogComments[activeBlogArticle.slug] || []).map((comm) => (
                        <div key={comm.id} style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '3px',
                          padding: '14px',
                          display: 'flex',
                          gap: '12px'
                        }}>
                          <img
                            src={comm.avatar}
                            alt={comm.author}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span style={{ fontWeight: '700', color: '#fff', fontSize: '13px' }}>{comm.author}</span>
                              <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '3px' }}>
                                {comm.role}
                              </span>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>{comm.timestamp}</span>
                            </div>
                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px', lineHeight: '1.5' }}>
                              {comm.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ) : (
                /* Blog Articles List */
                <div>
                  {/* Search and Categories Filter */}
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1 1 300px' }}>
                      <RiSearchLine style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={16} />
                      <input
                        type="text"
                        value={blogSearch}
                        onChange={(e) => setBlogSearch(e.target.value)}
                        placeholder="Search audio guides, music culture, gear, and tipping..."
                        style={{
                          width: '100%',
                          background: '#090d1f',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          padding: '10px 14px 10px 38px',
                          borderRadius: '3px',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {CONSUMER_BLOG_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setBlogCategory(cat.id)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '3px',
                            border: blogCategory === cat.id ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                            background: blogCategory === cat.id ? 'rgba(16, 185, 129, 0.15)' : '#090d1f',
                            color: blogCategory === cat.id ? '#10b981' : '#94a3b8',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Articles Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                    gap: '24px',
                    textAlign: 'left'
                  }}>
                    {filteredBlogArticles.map((article) => (
                      <div
                        key={article.slug}
                        onClick={() => setActiveBlogArticle(article)}
                        style={{
                          background: '#090d1f',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.18s ease, border-color 0.18s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#10b981';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        <div style={{ height: '200px', width: '100%', overflow: 'hidden', background: '#111827' }}>
                          <img
                            src={article.cover_image}
                            alt={article.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>

                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{
                              background: 'rgba(16, 185, 129, 0.12)',
                              color: '#10b981',
                              border: '1px solid rgba(16, 185, 129, 0.25)',
                              padding: '2px 8px',
                              borderRadius: '3px',
                              fontSize: '10.5px',
                              fontWeight: '700',
                              textTransform: 'uppercase'
                            }}>
                              {article.category}
                            </span>
                            <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <RiTimeLine size={13} /> {article.reading_time}
                            </span>
                          </div>

                          <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                            {article.title}
                          </h3>

                          <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', margin: '0 0 18px 0', flex: 1 }}>
                            {article.excerpt}
                          </p>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <img
                                src={article.author.avatar}
                                alt={article.author.name}
                                style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '600' }}>{article.author.name}</span>
                            </div>

                            <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              Read Story <RiArrowRightLine size={13} />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW 1B: COMMUNITY DISCUSSIONS & FORUM */}
          {blogSubTab === 'forum' && (
            <div>
              {/* If creating new topic */}
              {showNewTopicForm && (
                <div style={{
                  background: '#090d1f',
                  border: '1px solid #22d3ee',
                  borderRadius: '3px',
                  padding: '28px',
                  marginBottom: '32px',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RiDiscussFill color="#22d3ee" size={20} /> Start a Sound Community Discussion
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowNewTopicForm(false)}
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      <RiCloseLine size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleCreateForumTopic}>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', marginBottom: '6px' }}>
                        TOPIC TITLE
                      </label>
                      <input
                        type="text"
                        value={newTopicTitle}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                        placeholder="e.g., Best EQ settings for lossless listening on planar magnetic cans?"
                        style={{
                          width: '100%',
                          background: '#050814',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '3px',
                          padding: '10px 14px',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                        required
                      />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', marginBottom: '6px' }}>
                        CATEGORY
                      </label>
                      <select
                        value={newTopicCategory}
                        onChange={(e) => setNewTopicCategory(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#050814',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '3px',
                          padding: '10px 14px',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      >
                        {FORUM_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', marginBottom: '6px' }}>
                        DETAILS &amp; QUESTIONS
                      </label>
                      <textarea
                        value={newTopicBody}
                        onChange={(e) => setNewTopicBody(e.target.value)}
                        placeholder="Provide details about your question, audio equipment, playlist ideas, or off-grid listening setups..."
                        rows={4}
                        style={{
                          width: '100%',
                          background: '#050814',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '3px',
                          padding: '12px',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                          resize: 'vertical'
                        }}
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setShowNewTopicForm(false)}
                        style={{
                          padding: '8px 18px',
                          background: 'transparent',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '3px',
                          color: '#94a3b8',
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          padding: '8px 22px',
                          background: '#22d3ee',
                          border: 'none',
                          borderRadius: '3px',
                          color: '#050814',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Publish Discussion
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Single Topic Thread View */}
              {activeForumTopic ? (
                <div style={{
                  background: '#090d1f',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                  padding: '36px',
                  maxWidth: '860px',
                  margin: '0 auto',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <button
                      type="button"
                      onClick={() => setActiveForumTopic(null)}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '3px',
                        color: '#94a3b8',
                        padding: '6px 14px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <RiArrowLeftLine size={14} /> Back to All Discussions
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleForumUpvote(activeForumTopic.id)}
                      style={{
                        background: activeForumTopic.hasUpvoted ? 'rgba(34, 211, 238, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        border: activeForumTopic.hasUpvoted ? '1px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '3px',
                        color: activeForumTopic.hasUpvoted ? '#22d3ee' : '#fff',
                        padding: '6px 14px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <RiFireFill size={15} color={activeForumTopic.hasUpvoted ? '#22d3ee' : '#94a3b8'} />
                      Upvote ({activeForumTopic.upvotes})
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span style={{
                      background: 'rgba(34, 211, 238, 0.12)',
                      color: '#22d3ee',
                      border: '1px solid rgba(34, 211, 238, 0.25)',
                      padding: '3px 10px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}>
                      {activeForumTopic.categoryLabel}
                    </span>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>•</span>
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>{activeForumTopic.createdAt}</span>
                  </div>

                  <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: '0 0 16px 0', lineHeight: '1.3' }}>
                    {activeForumTopic.title}
                  </h1>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '24px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <img
                      src={activeForumTopic.author.avatar}
                      alt={activeForumTopic.author.name}
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '13px' }}>{activeForumTopic.author.name}</div>
                      <div style={{ color: '#22d3ee', fontSize: '11px' }}>{activeForumTopic.author.role}</div>
                    </div>
                  </div>

                  <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: '1.7', marginBottom: '36px' }}>
                    {activeForumTopic.content}
                  </p>

                  {/* Replies List */}
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '28px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RiMessage2Fill size={18} color="#22d3ee" /> Discussion Replies ({activeForumTopic.replies.length})
                    </h3>

                    {/* Reply Form */}
                    <form onSubmit={handleAddForumReply} style={{ marginBottom: '28px' }}>
                      <textarea
                        value={newReplyText}
                        onChange={(e) => setNewReplyText(e.target.value)}
                        placeholder="Contribute your experience, gear recommendations, or song suggestions..."
                        rows={3}
                        style={{
                          width: '100%',
                          background: '#050814',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '3px',
                          padding: '12px',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                          resize: 'vertical',
                          marginBottom: '10px'
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type="submit"
                          style={{
                            padding: '8px 20px',
                            background: '#22d3ee',
                            color: '#050814',
                            border: 'none',
                            borderRadius: '3px',
                            fontWeight: '700',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <RiSendPlaneFill size={14} /> Post Reply
                        </button>
                      </div>
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {activeForumTopic.replies.map((rep) => (
                        <div key={rep.id} style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '3px',
                          padding: '16px',
                          display: 'flex',
                          gap: '14px'
                        }}>
                          <img
                            src={rep.avatar}
                            alt={rep.author}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                              <span style={{ fontWeight: '700', color: '#fff', fontSize: '13px' }}>{rep.author}</span>
                              <span style={{ fontSize: '11px', color: '#22d3ee', background: 'rgba(34, 211, 238, 0.1)', padding: '2px 6px', borderRadius: '3px' }}>
                                {rep.role}
                              </span>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>{rep.createdAt}</span>
                            </div>
                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.6' }}>
                              {rep.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Forum Topics List */
                <div>
                  {/* Search and Category Filter */}
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1 1 300px' }}>
                      <RiSearchLine style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={16} />
                      <input
                        type="text"
                        value={forumSearch}
                        onChange={(e) => setForumSearch(e.target.value)}
                        placeholder="Search forum topics, hardware advice, playlists..."
                        style={{
                          width: '100%',
                          background: '#090d1f',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          padding: '10px 14px 10px 38px',
                          borderRadius: '3px',
                          color: '#fff',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {FORUM_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setForumCategory(cat.id)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '3px',
                            border: forumCategory === cat.id ? '1px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.1)',
                            background: forumCategory === cat.id ? 'rgba(34, 211, 238, 0.15)' : '#090d1f',
                            color: forumCategory === cat.id ? '#22d3ee' : '#94a3b8',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Topics List Table / Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
                    {filteredForumTopics.map((topic) => (
                      <div
                        key={topic.id}
                        style={{
                          background: '#090d1f',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '3px',
                          padding: '20px 24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '20px',
                          cursor: 'pointer',
                          transition: 'border-color 0.18s ease'
                        }}
                        onClick={() => setActiveForumTopic(topic)}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#22d3ee')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <span style={{
                              background: 'rgba(34, 211, 238, 0.12)',
                              color: '#22d3ee',
                              border: '1px solid rgba(34, 211, 238, 0.25)',
                              padding: '2px 8px',
                              borderRadius: '3px',
                              fontSize: '11px',
                              fontWeight: '700',
                              textTransform: 'uppercase'
                            }}>
                              {topic.categoryLabel}
                            </span>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>•</span>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{topic.createdAt}</span>
                          </div>

                          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '0 0 8px 0' }}>
                            {topic.title}
                          </h3>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                              src={topic.author.avatar}
                              alt={topic.author.name}
                              style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                              By <strong style={{ color: '#cbd5e1' }}>{topic.author.name}</strong> ({topic.author.role})
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleForumUpvote(topic.id);
                            }}
                            style={{
                              background: topic.hasUpvoted ? 'rgba(34, 211, 238, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                              border: topic.hasUpvoted ? '1px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '3px',
                              color: topic.hasUpvoted ? '#22d3ee' : '#94a3b8',
                              padding: '8px 14px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <RiFireFill size={15} color={topic.hasUpvoted ? '#22d3ee' : '#94a3b8'} />
                            {topic.upvotes}
                          </button>

                          <div style={{ textAlign: 'center', minWidth: '60px' }}>
                            <div style={{ color: '#fff', fontSize: '15px', fontWeight: '800' }}>
                              {topic.replies.length}
                            </div>
                            <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                              Replies
                            </div>
                          </div>

                          <span style={{ color: '#22d3ee', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            View <RiArrowRightLine size={13} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION 2: HELP & DOCUMENTATION
          ========================================================================= */}
      {activeMainTab === 'docs' && (
        <div className="section-documentation" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          {activeDocArticle ? (
            /* Single Documentation Article Reader */
            <div style={{
              background: '#090d1f',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '3px',
              padding: '36px',
              maxWidth: '860px',
              margin: '0 auto',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <button
                  type="button"
                  onClick={() => setActiveDocArticle(null)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '3px',
                    color: '#94a3b8',
                    padding: '6px 14px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RiArrowLeftLine size={14} /> Back to All Guides
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    background: 'rgba(34, 211, 238, 0.1)',
                    color: '#22d3ee',
                    border: '1px solid rgba(34, 211, 238, 0.25)',
                    padding: '3px 10px',
                    borderRadius: '3px',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>
                    {activeDocArticle.category}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>•</span>
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>Updated {activeDocArticle.updatedAt}</span>
                </div>
              </div>

              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 16px 0', lineHeight: '1.3' }}>
                {activeDocArticle.title}
              </h1>

              <p style={{ color: '#cbd5e1', fontSize: '16px', lineHeight: '1.7', marginBottom: '32px', background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid #22d3ee', padding: '14px 18px', borderRadius: '0 3px 3px 0' }}>
                {activeDocArticle.summary}
              </p>

              {/* Step-by-Step Walkthrough */}
              <div style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '19px', fontWeight: '700', color: '#fff', margin: '0 0 20px 0' }}>
                  Step-by-Step Instructions
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {activeDocArticle.steps.map((st, sIdx) => (
                    <div key={sIdx} style={{
                      background: '#050814',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '3px',
                      padding: '18px 22px'
                    }}>
                      <div style={{ fontWeight: '700', color: '#22d3ee', fontSize: '15px', marginBottom: '6px' }}>
                        {st.title}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.6' }}>
                        {st.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs Accordion for Guide */}
              {activeDocArticle.faqs && activeDocArticle.faqs.length > 0 && (
                <div style={{ marginBottom: '36px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '28px' }}>
                  <h2 style={{ fontSize: '19px', fontWeight: '700', color: '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RiQuestionFill color="#22d3ee" size={20} /> Guide FAQ &amp; Troubleshooting
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activeDocArticle.faqs.map((f, fIdx) => (
                      <div key={fIdx} style={{
                        background: '#050814',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '3px',
                        padding: '14px 18px'
                      }}>
                        <div style={{ fontWeight: '700', color: '#fff', fontSize: '13.5px', marginBottom: '6px' }}>
                          Q: {f.q}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>
                          {f.a}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Was this helpful feedback */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '20px',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px'
              }}>
                <span style={{ fontSize: '13.5px', color: '#cbd5e1', fontWeight: '600' }}>
                  Was this article helpful to your listening experience?
                </span>

                {docFeedbackMap[activeDocArticle.id] ? (
                  <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RiCheckLine size={16} /> Thank you for your feedback!
                  </span>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setDocFeedbackMap({ ...docFeedbackMap, [activeDocArticle.id]: 'yes' })}
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid #10b981',
                        color: '#10b981',
                        borderRadius: '3px',
                        padding: '6px 14px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <RiThumbUpLine size={14} /> Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setDocFeedbackMap({ ...docFeedbackMap, [activeDocArticle.id]: 'no' })}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        borderRadius: '3px',
                        padding: '6px 14px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <RiThumbDownLine size={14} /> No
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Documentation Guides List & Search */
            <div>
              {/* Search Bar & Category Filter */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: '1 1 300px' }}>
                  <RiSearchLine style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={16} />
                  <input
                    type="text"
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    placeholder="Search guides: HiFi playback, offline caching, tipping, playlists..."
                    style={{
                      width: '100%',
                      background: '#090d1f',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      padding: '10px 14px 10px 38px',
                      borderRadius: '3px',
                      color: '#fff',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {CONSUMER_DOC_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setDocCategory(cat.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '3px',
                        border: docCategory === cat.id ? '1px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: docCategory === cat.id ? 'rgba(34, 211, 238, 0.15)' : '#090d1f',
                        color: docCategory === cat.id ? '#22d3ee' : '#94a3b8',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guides Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '20px',
                textAlign: 'left',
                marginBottom: '48px'
              }}>
                {filteredDocArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => setActiveDocArticle(article)}
                    style={{
                      background: '#090d1f',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                      padding: '24px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'border-color 0.18s ease, transform 0.18s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#22d3ee';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{
                        background: 'rgba(34, 211, 238, 0.1)',
                        color: '#22d3ee',
                        border: '1px solid rgba(34, 211, 238, 0.25)',
                        padding: '2px 8px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        fontWeight: '700'
                      }}>
                        {article.category}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {article.readTime}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                      {article.title}
                    </h3>

                    <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', margin: '0 0 16px 0', flex: 1 }}>
                      {article.summary}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {article.steps.length} Steps Walkthrough
                      </span>
                      <span style={{ color: '#22d3ee', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        View Guide <RiArrowRightLine size={13} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Frequently Asked Questions Accordion */}
              <div style={{
                background: '#090d1f',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '3px',
                padding: '36px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <RiQuestionFill color="#22d3ee" size={24} />
                  <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0 }}>
                    Frequently Asked Consumer Questions
                  </h2>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 24px 0' }}>
                  Instant answers on audio fidelity, offline sync, network credits, and multi-room listening.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {FREQUENT_CONSUMER_FAQS.map((faq, fIdx) => (
                    <div
                      key={fIdx}
                      style={{
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        background: openFaqIndex === fIdx ? '#050814' : 'transparent'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(openFaqIndex === fIdx ? -1 : fIdx)}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: 'transparent',
                          border: 'none',
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: '14.5px',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span>{faq.q}</span>
                        <span style={{ color: '#22d3ee', fontSize: '18px' }}>
                          {openFaqIndex === fIdx ? '−' : '+'}
                        </span>
                      </button>

                      {openFaqIndex === fIdx && (
                        <div style={{ padding: '0 20px 20px', color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.7', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Support Desk Redirect Prompt */}
                <div style={{
                  marginTop: '36px',
                  background: 'rgba(34, 211, 238, 0.05)',
                  border: '1px solid rgba(34, 211, 238, 0.2)',
                  borderRadius: '3px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: '0 0 6px 0' }}>
                      Can\'t find the solution to your issue?
                    </h4>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>
                      Our Support Tickets Desk provides personalized assistance with 24/7 AI-Assisted real-time issue diagnosis.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveMainTab('tickets')}
                    style={{
                      padding: '10px 22px',
                      background: '#22d3ee',
                      color: '#050814',
                      border: 'none',
                      borderRadius: '3px',
                      fontWeight: '800',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <RiCustomerService2Fill size={16} /> Open Support Desk
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION 3: SUPPORT TICKETING DESK
          ========================================================================= */}
      {activeMainTab === 'tickets' && (
        <div className="section-support-tickets" style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <SupportTicketsPanel
            sessionUser={sessionUser}
            catalogTracks={catalogTracks}
            initialTab="file"
          />
        </div>
      )}
    </div>
  );
}
