import sys
import os
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from server import app

client = TestClient(app)

def test_catalogue_wizard_explicit_ingest():
    subdomain = "ndufo"
    payload = {
        "subdomain": subdomain,
        "release": {
            "title": "Explicit Midnight Album",
            "type": "Album",
            "artist": "Ndufo",
            "year": "2026",
            "genre": "Afro-fusion",
            "contentAdvisory": "Explicit",
            "isExplicit": True
        },
        "tracks": [
            {
                "title": "Explicit Track 1",
                "duration": "3:20",
                "genre": "Afro-fusion",
                "contentAdvisory": "Explicit",
                "isExplicit": True
            },
            {
                "title": "Clean Track 2",
                "duration": "3:45",
                "genre": "Afro-fusion",
                "contentAdvisory": "Clean",
                "isExplicit": False
            }
        ],
        "globalRights": {
            "contentAdvisory": "Explicit"
        }
    }

    res = client.post("/api/catalog/wizard-ingest", json=payload)
    assert res.status_code == 200, f"Failed: {res.text}"
    data = res.json()
    assert data["status"] == "success"

    tracks = data["tracks"]
    t1 = next(t for t in tracks if t["title"] == "Explicit Track 1")
    t2 = next(t for t in tracks if t["title"] == "Clean Track 2")

    assert t1["contentAdvisory"] == "Explicit"
    assert t1["isExplicit"] is True

    # Test update track
    update_res = client.put(f"/api/catalog/tracks/{t2['isrc']}?subdomain={subdomain}", json={
        "contentAdvisory": "Explicit",
        "isExplicit": True
    })
    assert update_res.status_code == 200
    assert update_res.json()["track"]["contentAdvisory"] == "Explicit"
    assert update_res.json()["track"]["isExplicit"] is True

    print("Catalogue advisory & explicit lyrics tests passed successfully!")

if __name__ == "__main__":
    test_catalogue_wizard_explicit_ingest()
