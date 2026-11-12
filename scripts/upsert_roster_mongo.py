from pymongo import MongoClient
from datetime import datetime, timezone

MONGO_URL = "mongodb+srv://tunnelandvision_db_user:Kaligraphix198016@intermaven-c.vjbwldo.mongodb.net/intermaven?retryWrites=true&w=majority"
client = MongoClient(MONGO_URL)
db = client['intermaven']

AUTHORITATIVE_ROSTER = [
    {
        "id": "art_ndufo",
        "subdomain": "ndufo",
        "name": "Ndufo",
        "creator_type": "artist",
        "role": "Primary Artist / Producer",
        "genre": "Afro-House",
        "bio": "Pioneering Kenyan Afro-futurist soundscapes, live synthesizer improvisations, and deep Afro-House beats.",
        "avatar": "/heroes/ndufo_hero_slide1_retina.jpg",
        "banner": "/headers/header_ndufo_custom.jpg",
        "listeners": "3.4M listeners",
        "followers_count": 142000,
        "subscribers_count": 48500,
        "is_default": True
    },
    {
        "id": "art_khalid",
        "subdomain": "khalid",
        "name": "Khalid Waves",
        "creator_type": "dj",
        "role": "Resident Club & Radio DJ",
        "genre": "Deep-House & Club",
        "bio": "Coastal ambient and deep house maestro crafting sunset anthems, live radio mixes, and club festival sets from Mombasa to Zanzibar.",
        "avatar": "/heroes/ndufo_hero_slide3_retina.jpg",
        "banner": "/headers/header_khalid_custom.jpg",
        "listeners": "1.2M listeners",
        "followers_count": 89000,
        "subscribers_count": 31200,
        "socials": {
            "instagram": "khalidwaves_dj",
            "twitter": "khalidwaves",
            "youtube": "KhalidWavesSets"
        },
        "is_default": True
    },
    {
        "id": "art_aisha",
        "subdomain": "aisha",
        "name": "Aisha Wanjiku",
        "creator_type": "artist",
        "role": "Singer-Songwriter / Afro-Soul",
        "genre": "Afro-fusion",
        "bio": "Soulful Nairobi acoustic melodies blended with traditional Swahili poetry and contemporary Afro-pop rhythms.",
        "avatar": "/heroes/ndufo_hero_slide2_retina.jpg",
        "banner": "/headers/header_aisha_custom.jpg",
        "listeners": "1.8M listeners",
        "followers_count": 94000,
        "subscribers_count": 32000,
        "is_default": True
    },
    {
        "id": "art_brian",
        "subdomain": "brian-omondi",
        "name": "Brian Omondi",
        "creator_type": "producer",
        "role": "Multi-instrumentalist / Producer",
        "genre": "Amapiano",
        "bio": "High-energy Amapiano log drum architect and live sync composition specialist.",
        "avatar": "/uploads/ai_assets/retina_art_9846064_2048x2048.jpg",
        "banner": "/headers/header_brian_custom.jpg",
        "listeners": "950K listeners",
        "followers_count": 62000,
        "subscribers_count": 19000,
        "is_default": True
    },
    {
        "id": "art_kiprono",
        "subdomain": "kiprono",
        "name": "Kiprono Beats",
        "creator_type": "artist",
        "role": "Primary Artist",
        "genre": "Kalenjin Folk-House",
        "bio": "Highland electronic music pioneer synthesizing traditional Kalenjin polyrhythms with cutting-edge 124 BPM deep tech arrangements.",
        "avatar": "/headers/discography_retina_header.jpg",
        "banner": "/headers/header_kiprono_custom.jpg",
        "listeners": "680K listeners",
        "followers_count": 41000,
        "subscribers_count": 14200,
        "is_default": True
    },
    {
        "id": "art_nairobicyber",
        "subdomain": "nairobicyber",
        "name": "Nairobi Cyber Sound",
        "creator_type": "producer",
        "role": "Synthwave & Modular Production Collective",
        "genre": "Electronic",
        "bio": "Underground synth laboratory crafting cinematic 80s analog arpeggios fused with heavy Nairobi 808 sub-bass.",
        "avatar": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80",
        "banner": "/headers/header_nairobicyber_custom.jpg",
        "listeners": "1.1M listeners",
        "followers_count": 58000,
        "subscribers_count": 21000,
        "is_default": True
    },
    {
        "id": "art_intermavenpub",
        "subdomain": "intermavenpub",
        "name": "Intermaven Global Publishing",
        "creator_type": "publisher",
        "role": "Publishing Administrator & Sync Cleared Rep",
        "genre": "Pan-African",
        "bio": "Worldwide synchronization and publishing administration for independent African and diaspora music creators.",
        "avatar": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
        "banner": "/headers/header_intermavenpub_custom.jpg",
        "listeners": "4.5M listeners",
        "followers_count": 180000,
        "subscribers_count": 64000,
        "is_default": True
    },
    {
        "id": "art_djksouldier",
        "subdomain": "djksouldier",
        "name": "DJ K-Souldier",
        "creator_type": "dj",
        "role": "Turntablist & Club Resident DJ",
        "genre": "Afro-Tech & Amapiano",
        "bio": "Nairobi's premier Afro-Tech and Amapiano turntablist, known for high-voltage peak-hour sets at The Alchemist, Blankets & Wine, and international club circuits.",
        "avatar": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
        "banner": "/headers/header_djksouldier_custom.jpg",
        "listeners": "1.4M listeners",
        "followers_count": 78000,
        "subscribers_count": 22100,
        "socials": {
            "instagram": "djksouldier_ke",
            "twitter": "djksouldier",
            "youtube": "DJKSouldierLive",
            "soundcloud": "dj-k-souldier"
        },
        "is_default": True
    },
    {
        "id": "art_djzinhlevibes",
        "subdomain": "djzinhlevibes",
        "name": "DJ Zinhle Vibes",
        "creator_type": "dj",
        "role": "Headline Festival & Club DJ",
        "genre": "Afro-House & Deep Tech",
        "bio": "Pan-African festival headline DJ and producer blending soulful South African Afro-House with East African percussion and 24-bit live stems.",
        "avatar": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
        "banner": "/headers/header_djzinhlevibes_custom.jpg",
        "listeners": "2.2M listeners",
        "followers_count": 115000,
        "subscribers_count": 41900,
        "socials": {
            "instagram": "djzinhlevibes",
            "twitter": "djzinhlevibes",
            "youtube": "DJZinhleVibesOfficial",
            "soundcloud": "djzinhlevibes"
        },
        "is_default": True
    },
    {
        "id": "art_djmaphoria",
        "subdomain": "djmaphoria",
        "name": "DJ Maphoria",
        "creator_type": "dj",
        "role": "Amapiano Pioneer & Festival DJ",
        "genre": "Amapiano",
        "bio": "Master of the Private School Piano and Soweto log-drum sound, headlining major African and European festival mainstages with 100% cleared mixes.",
        "avatar": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
        "banner": "/headers/header_djmaphoria_custom.jpg",
        "listeners": "2.9M listeners",
        "followers_count": 160000,
        "subscribers_count": 53000,
        "socials": {
            "instagram": "djmaphoria_sa",
            "twitter": "djmaphoria",
            "youtube": "DJMaphoriaSets",
            "soundcloud": "djmaphoria"
        },
        "is_default": True
    },
    {
        "id": "art_selectorkofi",
        "subdomain": "selectorkofi",
        "name": "Selector Kofi",
        "creator_type": "dj",
        "role": "Afrobeats & Highlife Sound System DJ",
        "genre": "Afrobeats & Alté",
        "bio": "Accra and Lagos club selector curating authoritative Afrobeats, Highlife, and Alté sound-system mixes with verified creator royalty splits.",
        "avatar": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
        "banner": "/headers/header_selectorkofi_custom.jpg",
        "listeners": "850K listeners",
        "followers_count": 49000,
        "subscribers_count": 16500,
        "socials": {
            "instagram": "selectorkofi",
            "twitter": "selectorkofi",
            "youtube": "SelectorKofiRadio",
            "mixcloud": "selectorkofi"
        },
        "is_default": True
    }
]

print("Upserting authoritative roster into MongoDB Atlas...")
for artist in AUTHORITATIVE_ROSTER:
    sub = artist["subdomain"]
    aid = artist["id"]
    res = db.artists.update_one(
        {"$or": [{"id": aid}, {"subdomain": sub}]},
        {
            "$set": {
                **artist,
                "updated_at": datetime.now(timezone.utc)
            },
            "$setOnInsert": {
                "created_at": datetime.now(timezone.utc)
            }
        },
        upsert=True
    )
    print(f"Upserted {artist['name']} (creator_type={artist['creator_type']}): matched={res.matched_count}, modified={res.modified_count}, upserted_id={res.upserted_id}")

print(f"\nTotal in db.artists: {db.artists.count_documents({})}")
for a in db.artists.find({}):
    print(f" - {a.get('name')} | id: {a.get('id')} | type: {a.get('creator_type')} | genre: {a.get('genre')}")
