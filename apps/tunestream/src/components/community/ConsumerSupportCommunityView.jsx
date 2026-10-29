import React from 'react';
import ConsumerBlogForumView from './ConsumerBlogForumView.jsx';
import ConsumerHelpDocsView from './ConsumerHelpDocsView.jsx';
import ConsumerSupportDeskView from './ConsumerSupportDeskView.jsx';

export default function ConsumerSupportCommunityView({
  sessionUser = null,
  catalogTracks = [],
  initialSection = 'docs',
  onBackToExplore = null
}) {
  if (initialSection === 'blog' || initialSection === 'editorial') {
    return (
      <ConsumerBlogForumView
        sessionUser={sessionUser}
        initialSubTab="editorial"
        onBackToExplore={onBackToExplore}
      />
    );
  }
  if (initialSection === 'forum') {
    return (
      <ConsumerBlogForumView
        sessionUser={sessionUser}
        initialSubTab="forum"
        onBackToExplore={onBackToExplore}
      />
    );
  }
  if (initialSection === 'tickets' || initialSection === 'support') {
    return (
      <ConsumerSupportDeskView
        sessionUser={sessionUser}
        catalogTracks={catalogTracks}
      />
    );
  }
  return (
    <ConsumerHelpDocsView
      sessionUser={sessionUser}
    />
  );
}
