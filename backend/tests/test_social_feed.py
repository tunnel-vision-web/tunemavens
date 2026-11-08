import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

def test_social_feed_posts_and_comments():
    # 1. Fetch posts
    res = client.get("/api/feed/posts")
    assert res.status_code == 200
    data = res.json()
    assert "posts" in data
    assert len(data["posts"]) > 0

    first_post = data["posts"][0]
    post_id = first_post["id"]
    initial_likes = first_post.get("likes_count", 0)

    # 2. Toggle like
    res_like = client.post(f"/api/feed/posts/{post_id}/like")
    assert res_like.status_code == 200
    like_data = res_like.json()
    assert "liked" in like_data

    # 3. Add comment
    res_comment = client.post(
        f"/api/feed/posts/{post_id}/comments",
        json={
            "text": "Incredible production! Love the crisp groove.",
            "author_name": "Test Luminary Peer",
            "author_role": "Producer",
            "is_luminary": True
        }
    )
    assert res_comment.status_code == 200
    comment_data = res_comment.json()
    assert comment_data["text"] == "Incredible production! Love the crisp groove."
    assert comment_data["is_luminary"] is True

    # 4. Create new post
    res_new_post = client.post(
        "/api/feed/posts",
        json={
            "content": "Just signed a pre-cleared sync placement with a major London production house!",
            "author_name": "Bien",
            "author_role": "Artist & Songwriter",
            "is_luminary": True,
            "media_type": "image",
            "media_url": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80"
        }
    )
    assert res_new_post.status_code == 200
    created_doc = res_new_post.json()
    assert created_doc["author_name"] == "Bien"
    assert created_doc["is_luminary"] is True
    assert created_doc["media_type"] == "image"
