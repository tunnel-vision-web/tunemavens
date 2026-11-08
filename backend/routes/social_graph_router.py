"""Social Graph, Activity Fanout & Privacy Center Router (Phase 4.5).

Implements follows, subscribes, likes, privacy toggles, activity feed fanout,
and 2nd-degree network discovery ("2 hops away via mutual connection").
"""
import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional
from bson import ObjectId

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from auth import get_current_user, get_optional_user
from config import db
from models import ActivityEvent, PrivacySettings, UserFollow, UserLike

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["social-graph"])


# ======================================================================
# Schemas
# ======================================================================
class FollowActionResponse(BaseModel):
    following: bool
    kind: str = "follow"
    target_id: str
    message: str


class SubscribeActionResponse(BaseModel):
    subscribed: bool
    target_id: str
    message: str


class LikeRequest(BaseModel):
    target_kind: str  # 'post' | 'profile' | 'song' | 'creator' | 'album' | 'featured_profile'
    target_id: str


class LikeResponse(BaseModel):
    liked: bool
    target_kind: str
    target_id: str
    likes_count: int


class CreateFeedPostPayload(BaseModel):
    content: str
    media_type: Optional[str] = None  # "image" | "video" | "audio"
    media_url: Optional[str] = None
    author_name: Optional[str] = None
    author_role: Optional[str] = None
    author_avatar: Optional[str] = None
    is_luminary: Optional[bool] = False
    epk_slug: Optional[str] = None


class CreateCommentPayload(BaseModel):
    text: str
    author_name: Optional[str] = None
    author_role: Optional[str] = None
    author_avatar: Optional[str] = None
    is_luminary: Optional[bool] = False


class PrivacySettingsPayload(BaseModel):
    listens: Optional[str] = None      # 'public' | 'connections' | 'private'
    downloads: Optional[str] = None    # 'public' | 'connections' | 'private'
    tips: Optional[str] = None         # 'public' | 'connections' | 'private'
    deals: Optional[str] = None        # 'public' | 'connections' | 'private'
    follows: Optional[str] = None      # 'public' | 'connections' | 'private'
    second_degree_visible: Optional[bool] = None
    industry_only_profile: Optional[bool] = None


class ActivityEventPayload(BaseModel):
    kind: str  # 'listen' | 'download' | 'tip' | 'deal' | 'follow' | 'like' | 'subscribe'
    target_id: Optional[str] = None
    target_name: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    visibility: Optional[str] = None


# ======================================================================
# Helpers
# ======================================================================
DEFAULT_PRIVACY = {
    "listens": "public",
    "downloads": "public",
    "tips": "public",
    "deals": "public",
    "follows": "public",
    "second_degree_visible": True,
    "industry_only_profile": False,
}


def get_user_privacy(user_id: str) -> Dict[str, Any]:
    """Fetch user's privacy settings or default to all public."""
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        user = db.users.find_one({"_id": user_id})
    if not user:
        return DEFAULT_PRIVACY.copy()
    stored = user.get("privacy_settings", {})
    merged = DEFAULT_PRIVACY.copy()
    merged.update(stored)
    return merged


def log_activity_event(
    user_id: str,
    kind: str,
    target_id: Optional[str] = None,
    target_name: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
    explicit_visibility: Optional[str] = None,
):
    """Helper to record an activity event respecting user privacy setting."""
    try:
        privacy = get_user_privacy(user_id)
        # Derive visibility from user's privacy setting for this kind of event
        derived_vis = explicit_visibility
        if not derived_vis:
            if kind == "listen":
                derived_vis = privacy.get("listens", "public")
            elif kind == "download":
                derived_vis = privacy.get("downloads", "public")
            elif kind == "tip":
                derived_vis = privacy.get("tips", "public")
            elif kind == "deal" or kind == "contract_signed":
                derived_vis = privacy.get("deals", "public")
            elif kind in ("follow", "subscribe"):
                derived_vis = privacy.get("follows", "public")
            else:
                derived_vis = "public"

        # Fetch actor details
        try:
            actor = db.users.find_one({"_id": ObjectId(user_id)})
        except Exception:
            actor = db.users.find_one({"_id": user_id})

        actor_name = actor.get("name", "TuneMavens Member") if actor else "TuneMavens Member"
        actor_role = actor.get("role", "creator") if actor else "creator"

        event = ActivityEvent(
            user_id=str(user_id),
            kind=kind,
            target_id=target_id,
            target_name=target_name,
            actor_name=actor_name,
            actor_role=actor_role,
            metadata=metadata or {},
            visibility=derived_vis,
            created_at=datetime.now(timezone.utc),
        )
        db.activity_events.insert_one(event.to_mongo())
    except Exception as err:
        logger.warning(f"Failed to record activity event: {err}")


# ======================================================================
# Follow & Subscribe Endpoints
# ======================================================================
@router.post("/users/{target_user_id}/follow", response_model=FollowActionResponse)
def follow_user(target_user_id: str, current_user: dict = Depends(get_current_user)):
    """Follow a user or creator."""
    my_id = str(current_user["_id"])
    if my_id == target_user_id:
        raise HTTPException(status_code=400, detail="You cannot follow yourself")

    # Verify target exists
    try:
        target = db.users.find_one({"_id": ObjectId(target_user_id)})
    except Exception:
        target = db.users.find_one({"_id": target_user_id})

    target_name = target.get("name", "User") if target else "User"

    existing = db.follows.find_one({
        "follower_id": my_id,
        "followee_id": target_user_id,
        "kind": "follow"
    })

    if not existing:
        follow_record = UserFollow(
            follower_id=my_id,
            followee_id=target_user_id,
            kind="follow",
            created_at=datetime.now(timezone.utc),
        )
        db.follows.insert_one(follow_record.to_mongo())
        log_activity_event(
            user_id=my_id,
            kind="follow",
            target_id=target_user_id,
            target_name=target_name,
            metadata={"target_role": target.get("role", "creator") if target else "creator"}
        )

    return FollowActionResponse(
        following=True,
        kind="follow",
        target_id=target_user_id,
        message=f"You are now following {target_name}."
    )


@router.delete("/users/{target_user_id}/follow", response_model=FollowActionResponse)
def unfollow_user(target_user_id: str, current_user: dict = Depends(get_current_user)):
    """Unfollow a user."""
    my_id = str(current_user["_id"])
    db.follows.delete_many({
        "follower_id": my_id,
        "followee_id": target_user_id,
    })
    return FollowActionResponse(
        following=False,
        kind="follow",
        target_id=target_user_id,
        message="Unfollowed successfully."
    )


@router.post("/users/{target_user_id}/subscribe", response_model=SubscribeActionResponse)
def subscribe_user(target_user_id: str, current_user: dict = Depends(get_current_user)):
    """Subscribe to executive/creator updates."""
    my_id = str(current_user["_id"])
    if my_id == target_user_id:
        raise HTTPException(status_code=400, detail="You cannot subscribe to yourself")

    existing = db.follows.find_one({
        "follower_id": my_id,
        "followee_id": target_user_id,
        "kind": "subscribe"
    })

    if not existing:
        record = UserFollow(
            follower_id=my_id,
            followee_id=target_user_id,
            kind="subscribe",
            created_at=datetime.now(timezone.utc),
        )
        db.follows.insert_one(record.to_mongo())
        log_activity_event(
            user_id=my_id,
            kind="subscribe",
            target_id=target_user_id,
        )

    return SubscribeActionResponse(
        subscribed=True,
        target_id=target_user_id,
        message="Subscribed to updates successfully."
    )


@router.get("/users/{target_user_id}/relationship")
def get_user_relationship(target_user_id: str, current_user: Optional[dict] = Depends(get_optional_user)):
    """Get followers count, following count, and check if active user follows target."""
    followers_count = db.follows.count_documents({"followee_id": target_user_id})
    following_count = db.follows.count_documents({"follower_id": target_user_id})

    is_following = False
    is_subscribed = False
    if current_user:
        my_id = str(current_user["_id"])
        rel = db.follows.find_one({"follower_id": my_id, "followee_id": target_user_id})
        if rel:
            is_following = True
            is_subscribed = rel.get("kind") == "subscribe"

    return {
        "target_user_id": target_user_id,
        "followers_count": followers_count,
        "following_count": following_count,
        "is_following": is_following,
        "is_subscribed": is_subscribed,
    }


# ======================================================================
# Likes Endpoints
# ======================================================================
@router.post("/likes", response_model=LikeResponse)
def toggle_like(payload: LikeRequest, current_user: dict = Depends(get_current_user)):
    """Toggle like on a song, profile, post, or album."""
    my_id = str(current_user["_id"])
    query = {
        "user_id": my_id,
        "target_kind": payload.target_kind,
        "target_id": payload.target_id,
    }
    existing = db.likes.find_one(query)

    if existing:
        db.likes.delete_one({"_id": existing["_id"]})
        liked = False
    else:
        like_record = UserLike(
            user_id=my_id,
            target_kind=payload.target_kind,
            target_id=payload.target_id,
            created_at=datetime.now(timezone.utc),
        )
        db.likes.insert_one(like_record.to_mongo())
        liked = True
        log_activity_event(
            user_id=my_id,
            kind="like",
            target_id=payload.target_id,
            metadata={"target_kind": payload.target_kind}
        )

    count = db.likes.count_documents({
        "target_kind": payload.target_kind,
        "target_id": payload.target_id,
    })

    return LikeResponse(
        liked=liked,
        target_kind=payload.target_kind,
        target_id=payload.target_id,
        likes_count=count,
    )


@router.get("/likes/check")
def check_like(
    target_kind: str = Query(...),
    target_id: str = Query(...),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Check if target is liked by current user and return total likes."""
    count = db.likes.count_documents({"target_kind": target_kind, "target_id": target_id})
    liked = False
    if current_user:
        my_id = str(current_user["_id"])
        liked = db.likes.find_one({
            "user_id": my_id,
            "target_kind": target_kind,
            "target_id": target_id
        }) is not None

    return {
        "target_kind": target_kind,
        "target_id": target_id,
        "likes_count": count,
        "liked": liked,
    }


# ======================================================================
# Privacy Center Endpoints (§9.10.2)
# ======================================================================
@router.get("/users/me/privacy-settings")
def get_my_privacy_settings(current_user: dict = Depends(get_current_user)):
    """Fetch user's granular privacy settings."""
    my_id = str(current_user["_id"])
    return get_user_privacy(my_id)


@router.patch("/users/me/privacy-settings")
def update_my_privacy_settings(
    payload: PrivacySettingsPayload,
    current_user: dict = Depends(get_current_user)
):
    """Update user's granular privacy settings."""
    my_id = str(current_user["_id"])
    current_settings = get_user_privacy(my_id)

    updates = {}
    for field, val in payload.model_dump(exclude_unset=True).items():
        if val is not None:
            updates[f"privacy_settings.{field}"] = val
            current_settings[field] = val

    if updates:
        try:
            db.users.update_one({"_id": ObjectId(my_id)}, {"$set": updates})
        except Exception:
            db.users.update_one({"_id": my_id}, {"$set": updates})

    return current_settings


# ======================================================================
# Home & Community Feed Endpoints (§9.10.4)
# ======================================================================
@router.get("/feed")
def get_home_feed(
    limit: int = Query(25, ge=1, le=100),
    cursor: Optional[str] = Query(None),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Returns merged chronological feed stream respecting privacy settings."""
    my_id = str(current_user["_id"]) if current_user else None

    # Determine who the user follows
    followed_user_ids = []
    if my_id:
        followed = list(db.follows.find({"follower_id": my_id}, {"followee_id": 1}))
        followed_user_ids = [f["followee_id"] for f in followed]

    query_conditions = []

    # 1. Any public activity events are visible to all
    query_conditions.append({"visibility": "public"})

    # 2. If authenticated, activities by followed users with visibility 'connections'
    if my_id and followed_user_ids:
        query_conditions.append({
            "user_id": {"$in": followed_user_ids},
            "visibility": "connections"
        })

    # 3. User's own events
    if my_id:
        query_conditions.append({"user_id": my_id})

    final_query = {"$or": query_conditions}
    if cursor:
        try:
            cursor_dt = datetime.fromisoformat(cursor.replace("Z", "+00:00"))
            final_query["created_at"] = {"$lt": cursor_dt}
        except Exception:
            pass

    events = list(db.activity_events.find(final_query).sort("created_at", -1).limit(limit))

    # Clean mongo output
    feed_items = []
    for ev in events:
        ev["id"] = str(ev["_id"])
        ev.pop("_id", None)
        if isinstance(ev.get("created_at"), datetime):
            ev["created_at"] = ev["created_at"].isoformat()
        feed_items.append(ev)

    # If empty, generate vibrant initial feed items so new users have immediate content
    if not feed_items and not cursor:
        feed_items = [
            {
                "id": "seed-1",
                "user_id": "system",
                "kind": "wall_of_fame_featured",
                "actor_name": "TuneMavens Official",
                "actor_role": "admin",
                "target_name": "Rick Rubin & Sarz inducted to Wall of Fame",
                "metadata": {"icon": "trophy", "highlight": "Hall of Icons Inauguration"},
                "visibility": "public",
                "created_at": datetime.now(timezone.utc).isoformat(),
            },
            {
                "id": "seed-2",
                "user_id": "system",
                "kind": "deal",
                "actor_name": "SyncMavens Desk",
                "actor_role": "supervisor",
                "target_name": "Global Sync Clearance for Netflix Docuseries",
                "metadata": {"genre": "Afro-Fusion", "fee": "$12,500"},
                "visibility": "public",
                "created_at": datetime.now(timezone.utc).isoformat(),
            },
            {
                "id": "seed-3",
                "user_id": "system",
                "kind": "tip",
                "actor_name": "TuneStream Fan Club",
                "actor_role": "consumer",
                "target_name": "Direct Creator Fan Tip settled via TuneLedger",
                "metadata": {"credits": 500, "currency": "KES"},
                "visibility": "public",
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        ]

    next_cursor = feed_items[-1]["created_at"] if feed_items else None

    return {
        "items": feed_items,
        "next_cursor": next_cursor,
        "count": len(feed_items),
    }


@router.post("/feed/activity", response_model=dict)
def record_feed_activity(
    payload: ActivityEventPayload,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Record an activity event directly (e.g. from player or deal execution)."""
    my_id = str(current_user["_id"]) if current_user else f"guest_{uuid.uuid4().hex[:6]}"
    actor_name = (current_user and (current_user.get("name") or current_user.get("username"))) or "TuneMavens Supporter"
    actor_role = (current_user and current_user.get("role")) or "fan"
    meta = payload.metadata or {}
    meta["actor_name"] = actor_name
    meta["actor_role"] = actor_role

    log_activity_event(
        user_id=my_id,
        kind=payload.kind,
        target_id=payload.target_id,
        target_name=payload.target_name,
        metadata=meta,
        explicit_visibility=payload.visibility,
    )
    return {"status": "recorded", "kind": payload.kind}


# ======================================================================
# Facebook-Style Interactive Feed & Comments Engine
# ======================================================================
SEED_FEED_POSTS = [
    {
        "author_name": "Sarz",
        "author_role": "Producer & Hitmaker",
        "author_avatar": "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        "is_luminary": True,
        "epk_slug": "sarz",
        "content": "Just uploaded fresh unreleased polyrhythmic stem sessions to my TuneMavens EPK. Producers, check out the swing on Track 2 and drop your thoughts below! 👇🔥",
        "media_type": "video",
        "media_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "likes_count": 42,
        "liked_by": [],
        "comments": [
            {
                "id": "c1",
                "author_name": "Mutoriah",
                "author_role": "Producer & Composer",
                "author_avatar": "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
                "is_luminary": True,
                "text": "Those 808 transient layers are pristine bro. The mid-range spacing is unreal!",
                "created_at": "3 hours ago"
            },
            {
                "id": "c2",
                "author_name": "Masterkraft",
                "author_role": "Legendary Producer",
                "author_avatar": "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
                "is_luminary": True,
                "text": "Classic groove. We definitely need a live studio lock-in next week in Lagos.",
                "created_at": "1 hour ago"
            }
        ]
    },
    {
        "author_name": "Tems",
        "author_role": "Grammy-Winning Artist",
        "author_avatar": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80",
        "is_luminary": True,
        "epk_slug": "tems",
        "content": "Deeply honored by the official induction to the TuneMavens Wall of Fame! Celebrating independent publishing rights, transparent splits, and ownership for all African creators.",
        "media_type": "image",
        "media_url": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80",
        "likes_count": 89,
        "liked_by": [],
        "comments": [
            {
                "id": "c3",
                "author_name": "Bien",
                "author_role": "Artist & Sauti Sol",
                "author_avatar": "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
                "is_luminary": True,
                "text": "Well deserved Queen! Raising the bar for the entire diaspora.",
                "created_at": "4 hours ago"
            },
            {
                "id": "c4",
                "author_name": "SyncMavens Desk",
                "author_role": "Music Supervisor",
                "author_avatar": "/favicon.png",
                "is_luminary": False,
                "text": "Your catalog cue sheets are pre-cleared and locked in escrow across 3 upcoming studio briefs!",
                "created_at": "2 hours ago"
            }
        ]
    },
    {
        "author_name": "Mutoriah",
        "author_role": "Composer & Producer",
        "author_avatar": "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        "is_luminary": True,
        "epk_slug": "mutoriah",
        "content": "Live studio breakdown of the Mugithi-Electronic fusion technique. All stems are now pre-cleared for supervisor sync placement on SyncMavens. Hit play on my EPK to audition the stems!",
        "media_type": "image",
        "media_url": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80",
        "likes_count": 27,
        "liked_by": [],
        "comments": [
            {
                "id": "c5",
                "author_name": "DJ Kace",
                "author_role": "DJ / Curator",
                "author_avatar": "/favicon.png",
                "is_luminary": False,
                "text": "Dropping the extended club edit this Friday at the residency!",
                "created_at": "1 hour ago"
            }
        ]
    }
]


def seed_feed_posts_if_empty():
    if db.feed_posts.count_documents({}) > 0:
        return
    now = datetime.now(timezone.utc)
    for p in SEED_FEED_POSTS:
        doc = p.copy()
        doc["created_at"] = now
        doc["updated_at"] = now
        db.feed_posts.insert_one(doc)


@router.get("/feed/posts")
@router.get("/social-graph/feed/posts")
def list_feed_posts(
    limit: int = Query(30, ge=1, le=100),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Retrieve social posts with comments and like states."""
    seed_feed_posts_if_empty()
    my_id = str(current_user["_id"]) if current_user else None

    cursor = db.feed_posts.find().sort("created_at", -1).limit(limit)
    posts = []
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        if isinstance(doc.get("created_at"), datetime):
            doc["created_at"] = doc["created_at"].isoformat()
        liked_by = doc.get("liked_by", [])
        doc["is_liked"] = bool(my_id and my_id in liked_by)
        doc["likes_count"] = doc.get("likes_count", len(liked_by))
        doc["comments_count"] = len(doc.get("comments", []))
        posts.append(doc)

    return {"posts": posts, "total": len(posts)}


@router.post("/feed/posts")
@router.post("/social-graph/feed/posts")
def create_feed_post(
    payload: CreateFeedPostPayload,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Publish a new post to the community feed."""
    now = datetime.now(timezone.utc)
    my_id = str(current_user["_id"]) if current_user else f"guest_{uuid.uuid4().hex[:6]}"
    user_name = payload.author_name or (current_user and (current_user.get("name") or current_user.get("username"))) or "TuneMavens Member"
    user_role = payload.author_role or (current_user and current_user.get("role")) or "creator"

    is_lum = payload.is_luminary or bool(db.featured_profiles.find_one({"subject_name": {"$regex": f"^{user_name}$", "$options": "i"}}))

    doc = {
        "author_id": my_id,
        "author_name": user_name,
        "author_role": user_role,
        "author_avatar": payload.author_avatar or "/favicon.png",
        "is_luminary": is_lum,
        "epk_slug": payload.epk_slug or user_name.lower().replace(" ", "-"),
        "content": payload.content.strip(),
        "media_type": payload.media_type,
        "media_url": payload.media_url,
        "likes_count": 0,
        "liked_by": [],
        "comments": [],
        "created_at": now,
        "updated_at": now
    }

    res = db.feed_posts.insert_one(doc)
    doc["id"] = str(res.inserted_id)
    doc.pop("_id", None)
    doc["created_at"] = doc["created_at"].isoformat()
    doc["is_liked"] = False
    doc["comments_count"] = 0
    return doc


@router.post("/feed/posts/{post_id}/comments")
@router.post("/social-graph/feed/posts/{post_id}/comments")
def add_feed_post_comment(
    post_id: str,
    payload: CreateCommentPayload,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Add a comment to a feed post."""
    try:
        oid = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post ID")

    post = db.feed_posts.find_one({"_id": oid})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    my_id = str(current_user["_id"]) if current_user else f"guest_{uuid.uuid4().hex[:6]}"
    user_name = payload.author_name or (current_user and (current_user.get("name") or current_user.get("username"))) or "TuneMavens Member"
    user_role = payload.author_role or (current_user and current_user.get("role")) or "member"
    is_lum = payload.is_luminary or bool(db.featured_profiles.find_one({"subject_name": {"$regex": f"^{user_name}$", "$options": "i"}}))

    comment_obj = {
        "id": uuid.uuid4().hex[:8],
        "author_id": my_id,
        "author_name": user_name,
        "author_role": user_role,
        "author_avatar": payload.author_avatar or "/favicon.png",
        "is_luminary": is_lum,
        "text": payload.text.strip(),
        "created_at": "Just now"
    }

    db.feed_posts.update_one(
        {"_id": oid},
        {"$push": {"comments": comment_obj}, "$set": {"updated_at": datetime.now(timezone.utc)}}
    )

    return {**comment_obj, "status": "added", "comment": comment_obj}


@router.post("/feed/posts/{post_id}/like")
@router.post("/social-graph/feed/posts/{post_id}/like")
def toggle_feed_post_like(
    post_id: str,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Toggle like state on a feed post."""
    try:
        oid = ObjectId(post_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post ID")

    post = db.feed_posts.find_one({"_id": oid})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    my_id = str(current_user["_id"]) if current_user else "anonymous_liker"
    liked_by = post.get("liked_by", [])

    if my_id in liked_by:
        liked_by.remove(my_id)
        is_liked = False
    else:
        liked_by.append(my_id)
        is_liked = True

    new_count = max(0, len(liked_by) if my_id != "anonymous_liker" else (post.get("likes_count", 0) + (1 if is_liked else -1)))
    db.feed_posts.update_one(
        {"_id": oid},
        {"$set": {"liked_by": liked_by, "likes_count": new_count}}
    )

    return {"liked": is_liked, "likes_count": new_count, "post_id": post_id}


# ======================================================================
# 2nd-Degree Network Discovery Endpoints (§9.10.3)
# ======================================================================
@router.get("/graph/second-degree")
def get_second_degree_connections(
    role: Optional[str] = Query(None, description="Filter by role e.g. supervisor, label, creator"),
    limit: int = Query(10, ge=1, le=50),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Returns users you are 2 hops from: User -> Intermediate Friend -> Target User."""
    my_id = str(current_user["_id"]) if current_user else None

    # Step 1: Direct 1st-degree follows
    direct_follows = set()
    if my_id:
        for f in db.follows.find({"follower_id": my_id}):
            direct_follows.add(f["followee_id"])

    # Step 2: Hops from direct follows
    # target_id -> list of mutual friend names/ids
    candidates: Dict[str, List[Dict[str, str]]] = {}

    if direct_follows:
        # Find who our direct friends are following
        second_hop_cursor = db.follows.find({"follower_id": {"$in": list(direct_follows)}})
        for rel in second_hop_cursor:
            target_id = rel["followee_id"]
            intermediate_id = rel["follower_id"]

            # Exclude self and anyone already followed
            if my_id and target_id == my_id:
                continue
            if target_id in direct_follows:
                continue

            if target_id not in candidates:
                candidates[target_id] = []

            # Resolve intermediate user name
            try:
                friend_doc = db.users.find_one({"_id": ObjectId(intermediate_id)})
            except Exception:
                friend_doc = db.users.find_one({"_id": intermediate_id})

            friend_name = friend_doc.get("name", "Mutual Connection") if friend_doc else "Mutual Connection"
            candidates[target_id].append({
                "id": intermediate_id,
                "name": friend_name
            })

    results = []

    # If user has candidates from real graph
    if candidates:
        target_ids = list(candidates.keys())[:limit * 2]
        query = {"$or": [{"_id": {"$in": [ObjectId(tid) for tid in target_ids if ObjectId.is_valid(tid)]}},
                         {"_id": {"$in": target_ids}}]}
        if role:
            query["role"] = role

        for user_doc in db.users.find(query).limit(limit):
            uid = str(user_doc["_id"])
            privacy = user_doc.get("privacy_settings", {})
            if privacy.get("second_degree_visible", True) is False:
                continue

            mutuals = candidates.get(uid, [])
            results.append({
                "id": uid,
                "name": user_doc.get("name", "Ecosystem Member"),
                "email": user_doc.get("email"),
                "role": user_doc.get("role", "creator"),
                "bio": user_doc.get("bio", f"Verified {user_doc.get('role', 'creator')} in TuneMavens ecosystem"),
                "avatar_url": user_doc.get("avatar_url", f"https://picsum.photos/seed/{uid}/120"),
                "pro_verified": user_doc.get("pro_verified", False),
                "hops": 2,
                "mutual_connections": mutuals,
                "connection_text": f"Connected via {mutuals[0]['name']}" if mutuals else "Recommended by network",
            })

    # If results are fewer than desired, provide curated ecosystem luminaries
    if len(results) < limit:
        seed_profiles = [
            {
                "id": "rec-1",
                "name": "Sarah Jenkins",
                "role": "supervisor",
                "bio": "Music Supervisor for A24 & HBO Sync Briefs. Seeking East African percussion.",
                "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                "pro_verified": True,
                "hops": 2,
                "mutual_connections": [{"id": "sarah-friend", "name": "Marcus Vance"}],
                "connection_text": "Connected via Marcus Vance (2 hops)",
            },
            {
                "id": "rec-2",
                "name": "Sarz Beats",
                "role": "creator",
                "bio": "Legendary producer. Pioneer of contemporary Afro-House & Amapiano hits.",
                "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
                "pro_verified": True,
                "hops": 2,
                "mutual_connections": [{"id": "sarz-friend", "name": "DJ Kwenzi"}],
                "connection_text": "Connected via DJ Kwenzi (2 hops)",
            },
            {
                "id": "rec-3",
                "name": "Elena Rostova",
                "role": "label",
                "bio": "Head of A&R at Obsidian Sounds. Active sync acquisition desk.",
                "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
                "pro_verified": True,
                "hops": 2,
                "mutual_connections": [{"id": "elena-friend", "name": "Nairobi Sounds"}],
                "connection_text": "Connected via Nairobi Sounds (2 hops)",
            },
            {
                "id": "rec-4",
                "name": "David Ochieng",
                "role": "vc",
                "bio": "Managing Partner at Safari Sound Capital. Tour venture capital underwriter.",
                "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
                "pro_verified": True,
                "hops": 2,
                "mutual_connections": [{"id": "david-friend", "name": "Ayo AI"}],
                "connection_text": "Connected via Ayo AI (2 hops)",
            }
        ]
        for p in seed_profiles:
            if role and p["role"] != role:
                continue
            if not any(r["id"] == p["id"] for r in results):
                results.append(p)
                if len(results) >= limit:
                    break

    return {
        "connections": results,
        "count": len(results),
        "user_id": my_id,
    }
