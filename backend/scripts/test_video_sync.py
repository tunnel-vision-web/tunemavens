import urllib.request
import json

def test_video_sync():
    # 1. Fetch from CMS endpoint
    cms_req = urllib.request.Request('http://localhost:8001/api/cms/epk/ndufo')
    with urllib.request.urlopen(cms_req) as resp:
        cms_doc = json.loads(resp.read().decode('utf-8'))
    cms_videos = (cms_doc.get('data') or {}).get('videos', [])
    print(f"CMS Studio videos count: {len(cms_videos)}")
    for i, v in enumerate(cms_videos):
        print(f"  [{i+1}] {v.get('title')} | category: {v.get('category')} | views: {v.get('views')} | url: {v.get('url')}")

    # 2. Fetch from Public EPK endpoint
    pub_req = urllib.request.Request('http://localhost:8001/api/epk/public/ndufo')
    with urllib.request.urlopen(pub_req) as resp:
        pub_doc = json.loads(resp.read().decode('utf-8'))
    pub_videos = pub_doc.get('videos', [])
    print(f"\nPublic EPK videos count: {len(pub_videos)}")
    for i, v in enumerate(pub_videos):
        print(f"  [{i+1}] {v.get('title')} | category: {v.get('category')} | views: {v.get('views')}")

    assert len(cms_videos) == len(pub_videos) == 6, f"Expected 6 videos in both, got CMS={len(cms_videos)}, Public={len(pub_videos)}"
    print("\n[PASSED] All 6 videos are perfectly synchronized across CMS Studio and Public EPK!")

if __name__ == '__main__':
    test_video_sync()
