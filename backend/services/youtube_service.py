"""YouTube Data API v3 Integration Service.

Fetches channel metadata, subscriber metrics, and featured video showcases
for creator Wall of Fame profiles, with sandbox mock fallbacks.
"""
import os
import logging
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY")


class YouTubeService:
    """Service wrapper for YouTube Data API v3."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or YOUTUBE_API_KEY

    def get_channel_metrics(self, channel_id: str) -> Dict:
        """Fetches channel subscriber count, view count, and video showcase."""
        if self.api_key:
            try:
                import requests
                url = f"https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id={channel_id}&key={self.api_key}"
                resp = requests.get(url, timeout=5)
                if resp.status_code == 200:
                    items = resp.json().get("items", [])
                    if items:
                        item = items[0]
                        stats = item.get("statistics", {})
                        snippet = item.get("snippet", {})
                        return {
                            "channel_id": channel_id,
                            "title": snippet.get("title", "Intermaven Artist"),
                            "description": snippet.get("description", ""),
                            "subscriber_count": int(stats.get("subscriberCount", 0)),
                            "view_count": int(stats.get("viewCount", 0)),
                            "video_count": int(stats.get("videoCount", 0)),
                            "custom_url": snippet.get("customUrl", f"@{channel_id}"),
                            "thumbnail_url": snippet.get("thumbnails", {}).get("default", {}).get("url", ""),
                            "mock": False,
                        }
            except Exception as e:
                logger.warning(f"YouTube API call failed: {e}. Using sandbox fallback.")

        # Sandbox Mock Fallback
        return {
            "channel_id": channel_id,
            "title": "Intermaven Wall of Fame Artist",
            "description": "Featured Intermaven Ecosystem Creator & Producer",
            "subscriber_count": 145000,
            "view_count": 8900000,
            "video_count": 48,
            "custom_url": f"@{channel_id}",
            "thumbnail_url": "https://picsum.photos/seed/yt_artist/200",
            "featured_videos": [
                {
                    "video_id": "dQw4w9WgXcQ",
                    "title": "Nairobi Cyberwave (Official Music Video)",
                    "views": "1.2M",
                    "published_at": "2026-05-12",
                },
                {
                    "video_id": " ForBiggerBlazes",
                    "title": "SyncMavens Live Studio Session",
                    "views": "450K",
                    "published_at": "2026-06-20",
                }
            ],
            "mock": True,
        }

    def get_featured_showcase(self) -> List[Dict]:
        """Returns trending creator video showcases across the network."""
        return [
            {
                "artist": "Kip & The Mavens",
                "title": "Nairobi Cyberwave Odyssey",
                "platform": "YouTube",
                "video_id": "v=showcase_1",
                "views": "1.2M",
                "thumbnail_url": "https://picsum.photos/seed/yt_showcase1/400/225",
            },
            {
                "artist": "Cyber Maven",
                "title": "Neon Pursuit (Live Sync Pitch)",
                "platform": "YouTube",
                "video_id": "v=showcase_2",
                "views": "680K",
                "thumbnail_url": "https://picsum.photos/seed/yt_showcase2/400/225",
            }
        ]


youtube_service = YouTubeService()
