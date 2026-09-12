import sys
from pathlib import Path

# Add backend directory to sys.path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from config import db
from routes.epk_router import get_default_videos

def sync_ndufo_videos():
    default_vids = get_default_videos("Ndufo")
    machero = {
        "id": 300,
        "type": "video",
        "title": "Machero",
        "url": "https://www.youtube.com/watch?v=2y3NvAVU2xE",
        "youtubeUrl": "https://www.youtube.com/embed/2y3NvAVU2xE",
        "thumbnail": "https://img.youtube.com/vi/2y3NvAVU2xE/hqdefault.jpg",
        "views": "850K views",
        "category": "Official Video"
    }
    
    full_vids = [machero] + default_vids
    
    res_epk = db.epks.update_one(
        {"subdomain": "ndufo"},
        {"$set": {"videos": full_vids}},
        upsert=True
    )
    
    res_cms = db.cms_layouts.update_one(
        {"layout_id": "epk_ndufo"},
        {"$set": {"data.videos": full_vids}},
        upsert=True
    )
    
    print(f"Successfully synced ndufo videos: epks={res_epk.modified_count}, cms_layouts={res_cms.modified_count}, total_videos={len(full_vids)}")

if __name__ == "__main__":
    sync_ndufo_videos()
