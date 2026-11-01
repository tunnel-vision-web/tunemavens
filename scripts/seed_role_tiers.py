import sys
import os
sys.path.insert(0, os.path.abspath('backend'))

from routes.role_tiers_router import DEFAULT_ROLE_TIERS
from config import db

# Explicitly seed any missing packages
for role_name, tiers in DEFAULT_ROLE_TIERS.items():
    for t in tiers:
        existing = db.role_tiers.find_one({"slug": t["slug"]})
        if not existing:
            db.role_tiers.insert_one(dict(t))
            print(f"Seeded: {t['slug']}")
        else:
            # Update to ensure latest copy
            db.role_tiers.update_one({"slug": t["slug"]}, {"$set": dict(t)})
            print(f"Updated: {t['slug']}")

print("ROLE TIERS SEEDED SUCCESSFULLY!")
