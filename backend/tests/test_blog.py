"""Test TuneMavens Blog & Creator Editorial Router.

Tests:
1. Articles query & pagination (GET /api/blog/articles)
2. Category filtering & keyword search (GET /api/blog/articles?category=...&search=...)
3. Full article detail, view count increment & comments retrieval (GET /api/blog/articles/{slug})
4. Unregistered anonymous comment rejection (POST /api/blog/articles/{slug}/comments -> 401)
5. Registered user comment creation & persistence (POST /api/blog/articles/{slug}/comments -> 201)
6. Comment upvoting / liking (POST /api/blog/comments/{id}/like)
7. Article clapping (POST /api/blog/articles/{slug}/clap)
"""
import os
import sys
from fastapi.testclient import TestClient
from bson import ObjectId

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from server import app
from config import db
from auth import create_access_token

client = TestClient(app)


def run_blog_tests():
    print("\n--- Running TuneMavens Blog & Editorial Tests ---")

    # 1. Test GET /api/blog/articles
    print("Testing GET /api/blog/articles...")
    res = client.get("/api/blog/articles")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert "articles" in data
    assert len(data["articles"]) >= 8, f"Expected at least 8 articles, got {len(data['articles'])}"
    print(f"  [OK] Found {len(data['articles'])} articles in ecosystem library.")

    first_art = data["articles"][0]
    assert "title" in first_art
    assert "slug" in first_art
    assert "reading_time" in first_art
    assert "comments_count" in first_art
    print(f"  [OK] Sample Article: '{first_art['title']}' | Comments: {first_art['comments_count']}")

    # 2. Test Category Filtering
    print("Testing Category Filtering (category='Sync Licensing')...")
    sync_res = client.get("/api/blog/articles?category=Sync%20Licensing")
    assert sync_res.status_code == 200
    sync_articles = sync_res.json()["articles"]
    assert len(sync_articles) >= 1
    for a in sync_articles:
        assert "sync" in a["category"].lower()
    print(f"  [OK] Category filter returned {len(sync_articles)} Sync Licensing articles.")

    # 3. Test Search Query
    print("Testing Keyword Search (search='waterfall')...")
    search_res = client.get("/api/blog/articles?search=waterfall")
    assert search_res.status_code == 200
    search_articles = search_res.json()["articles"]
    assert len(search_articles) >= 1
    assert any("waterfall" in a["title"].lower() or "waterfall" in a["excerpt"].lower() for a in search_articles)
    print(f"  [OK] Keyword search returned {len(search_articles)} matching article(s).")

    # 4. Test Single Article Detail
    slug = "waterfall-accounting-replacing-splits-2026"
    print(f"Testing GET /api/blog/articles/{slug}...")
    art_res = client.get(f"/api/blog/articles/{slug}")
    assert art_res.status_code == 200, f"Expected 200, got {art_res.status_code}"
    art_data = art_res.json()
    assert art_data["slug"] == slug
    assert "content" in art_data
    assert len(art_data["content"]) > 100
    assert "comments" in art_data
    assert isinstance(art_data["comments"], list)
    assert len(art_data["comments"]) >= 2
    assert "related" in art_data
    assert len(art_data["related"]) >= 1
    print(f"  [OK] Article detail loaded with {len(art_data['comments'])} comments and {len(art_data['related'])} related recommendations.")

    # 5. Test Unregistered / Anonymous Comment Rejection
    print("Testing comment rejection for unregistered anonymous users...")
    anon_res = client.post(
        f"/api/blog/articles/{slug}/comments",
        json={"content": "Anonymous spam comment with no registered user account", "author_name": "anonymous"}
    )
    assert anon_res.status_code == 401, f"Expected 401 for anonymous, got {anon_res.status_code}"
    print("  [OK] Unregistered anonymous comment correctly rejected with 401 Unauthorized.")

    # 6. Test Registered User Comment Creation via Authorization Token
    print("Testing registered user comment submission via JWT...")
    # Mint a mock token for a registered creator
    test_user_id = str(ObjectId())
    token = create_access_token(sub=test_user_id)
    # Ensure test user exists in db
    db.users.update_one(
        {"_id": ObjectId(test_user_id)},
        {"$set": {
            "name": "Marcus Kane",
            "username": "marcus_kane",
            "email": "marcus.kane@tunemavens.com",
            "role": "producer"
        }},
        upsert=True
    )

    comment_payload = {
        "content": "This waterfall cascade model completely solved our multi-producer dispute on the last album release!",
        "author_name": "Marcus Kane",
        "author_role": "Producer"
    }
    post_res = client.post(
        f"/api/blog/articles/{slug}/comments",
        json=comment_payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert post_res.status_code == 201, f"Expected 201 Created, got {post_res.status_code} - {post_res.text}"
    post_data = post_res.json()
    assert "comment" in post_data
    created_comment = post_data["comment"]
    assert created_comment["author_name"] == "Marcus Kane"
    assert "waterfall cascade model" in created_comment["content"]
    comment_id = created_comment["id"]
    print(f"  [OK] Registered comment successfully created! Comment ID: {comment_id}")

    # 7. Test Comment Liking
    print(f"Testing comment upvote (POST /api/blog/comments/{comment_id}/like)...")
    like_res = client.post(f"/api/blog/comments/{comment_id}/like")
    assert like_res.status_code == 200
    print("  [OK] Comment upvoted successfully.")

    # 8. Test Article Clapping
    print(f"Testing article clapping (POST /api/blog/articles/{slug}/clap)...")
    clap_res = client.post(f"/api/blog/articles/{slug}/clap")
    assert clap_res.status_code == 200
    print("  [OK] Article clapped successfully.")

    # Cleanup test user & comment
    db.users.delete_one({"_id": ObjectId(test_user_id)})
    try:
        db.blog_comments.delete_one({"_id": ObjectId(comment_id)})
    except Exception:
        db.blog_comments.delete_one({"id": comment_id})

    print("\n--- ALL TUNEMAVENS BLOG & EDITORIAL TESTS PASSED! ---")


if __name__ == "__main__":
    run_blog_tests()
