// =====================================================================
// Intermaven Network Unified Authoritative Music & Content Repository
// Synchronized directly with TuneMavens Backend Database (MongoDB)
// =====================================================================

export const AUTHORITATIVE_CATALOG_ARTISTS = [
  {
    "id": "art_ndufo",
    "subdomain": "ndufo",
    "name": "Ndufo",
    "role": "Primary Artist / Producer",
    "genre": "Afro-House",
    "bio": "Pioneering Kenyan Afro-futurist soundscapes, live synthesizer improvisations, and deep Afro-House beats.",
    "avatar": "/heroes/ndufo_hero_slide1_retina.jpg",
    "is_default": true,
    "created_at": "2026-09-14T18:49:58.207000"
  },
  {
    "id": "art_khalid",
    "subdomain": "khalid",
    "name": "Khalid Waves",
    "role": "Electronic / DJ",
    "genre": "Deep-House",
    "bio": "Coastal ambient deep house producer crafting sunset anthems from Mombasa to the world.",
    "avatar": "https://picsum.photos/seed/khalid_avatar/400/400",
    "is_default": false,
    "created_at": "2026-09-14T18:49:58.207000"
  },
  {
    "id": "art_aisha",
    "subdomain": "aisha",
    "name": "Aisha Wanjiku",
    "role": "Singer-Songwriter / Afro-Soul",
    "genre": "Afro-fusion",
    "bio": "Soulful Nairobi acoustic melodies blended with traditional Swahili poetry and contemporary Afro-pop rhythms.",
    "avatar": "https://picsum.photos/seed/aisha_avatar/400/400",
    "is_default": false,
    "created_at": "2026-09-14T18:49:58.207000"
  },
  {
    "id": "art_brian",
    "subdomain": "brian-omondi",
    "name": "Brian Omondi",
    "role": "Multi-instrumentalist / Producer",
    "genre": "Amapiano",
    "bio": "High-energy Amapiano log drum architect and live sync composition specialist.",
    "avatar": "https://picsum.photos/seed/brian_avatar/400/400",
    "is_default": false,
    "created_at": "2026-09-14T18:49:58.207000"
  },
  {
    "avatar": "https://picsum.photos/seed/kiprono_avatar/400/400",
    "bio": "Highland electronic music pioneer.",
    "created_at": "2026-09-14T21:02:16.481000",
    "genre": "Kalenjin Folk-House",
    "id": "art_kiprono",
    "is_default": false,
    "name": "Kiprono Beats",
    "owner_id": "6a58faf0c6664302e7bda673",
    "role": "Primary Artist",
    "subdomain": "kiprono",
    "updated_at": "2026-09-14T21:02:16.481000"
  }
];

export const AUTHORITATIVE_CATALOG_ALBUMS = [
  {
    "id": "6aa486dc5a5bcfd560306666",
    "title": "Carbon Dating Pt 1",
    "year": "2024",
    "type": "Album",
    "genre": "Afrobeats",
    "tracksCount": 8,
    "cover": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
    "streams": "Master Audio",
    "isrc": "KE-TM1-24-00006",
    "isrcs": [
      "KE-TM1-24-00006",
      "KE-TM1-24-00007",
      "KE-TM1-24-00008",
      "KE-TM1-24-00009",
      "KE-TM1-24-00010",
      "KE-TM1-24-00011",
      "KE-TM1-24-00012",
      "KE-TM1-24-00013"
    ],
    "tracks": [
      {
        "id": 1789167248705,
        "isrc": "KE-TM1-24-00013",
        "title": "ENENDA (1)",
        "artist": "Ndufo",
        "release": "Carbon Dating Pt 1",
        "releaseType": "Album",
        "year": "2024",
        "genre": "Afrobeats",
        "duration": "3:35",
        "streams": "0",
        "priceCredits": 50,
        "coverArt": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
        "coverText": "Carbon Pt 1",
        "coverBg": "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
        "audioUrl": "/uploads/audio/enenda.wav",
        "fileUrl": "/uploads/audio/enenda.wav",
        "status": "valid",
        "isFeatured": false,
        "writers": [
          {
            "name": "Ndufo Victoria",
            "pro": "MCSK",
            "share": "100"
          }
        ],
        "producers": [
          {
            "name": "Creator Roster Member",
            "role": "Primary Producer"
          }
        ],
        "publishingSplit": "Writer (50%) / Publisher (50%)",
        "distributionSplit": "Artist (60%) / Producer (25%) / Label (15%)",
        "split": "Artist (60%) / Producer (25%) / Label (15%)",
        "syncCleared": true,
        "album_art_url": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg"
      },
      {
        "id": 1789167248704,
        "isrc": "KE-TM1-24-00012",
        "title": "Running (1)",
        "artist": "Ndufo",
        "release": "Carbon Dating Pt 1",
        "releaseType": "Album",
        "year": "2024",
        "genre": "Afrobeats",
        "duration": "3:35",
        "streams": "0",
        "priceCredits": 50,
        "coverArt": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
        "coverText": "Carbon Pt 1",
        "coverBg": "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
        "audioUrl": "/uploads/audio/running.wav",
        "fileUrl": "/uploads/audio/running.wav",
        "status": "valid",
        "isFeatured": false,
        "writers": [
          {
            "name": "Ndufo Victoria",
            "pro": "MCSK",
            "share": "100"
          }
        ],
        "producers": [
          {
            "name": "Creator Roster Member",
            "role": "Primary Producer"
          }
        ],
        "publishingSplit": "Writer (50%) / Publisher (50%)",
        "distributionSplit": "Artist (60%) / Producer (25%) / Label (15%)",
        "split": "Artist (60%) / Producer (25%) / Label (15%)",
        "syncCleared": true,
        "album_art_url": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg"
      },
      {
        "id": 1789167248703,
        "isrc": "KE-TM1-24-00011",
        "title": "Pray Tell (1)",
        "artist": "Ndufo",
        "release": "Carbon Dating Pt 1",
        "releaseType": "Album",
        "year": "2024",
        "genre": "Afrobeats",
        "duration": "3:35",
        "streams": "0",
        "priceCredits": 50,
        "coverArt": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
        "coverText": "Carbon Pt 1",
        "coverBg": "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
        "audioUrl": "/uploads/audio/pray_tell.wav",
        "fileUrl": "/uploads/audio/pray_tell.wav",
        "status": "valid",
        "isFeatured": false,
        "writers": [
          {
            "name": "Ndufo Victoria",
            "pro": "MCSK",
            "share": "100"
          }
        ],
        "producers": [
          {
            "name": "Creator Roster Member",
            "role": "Primary Producer"
          }
        ],
        "publishingSplit": "Writer (50%) / Publisher (50%)",
        "distributionSplit": "Artist (60%) / Producer (25%) / Label (15%)",
        "split": "Artist (60%) / Producer (25%) / Label (15%)",
        "syncCleared": true,
        "album_art_url": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg"
      },
      {
        "id": 1789167248702,
        "isrc": "KE-TM1-24-00010",
        "title": "Misery S Not A Friend Of Me (1)",
        "artist": "Ndufo",
        "release": "Carbon Dating Pt 1",
        "releaseType": "Album",
        "year": "2024",
        "genre": "Afrobeats",
        "duration": "3:35",
        "streams": "0",
        "priceCredits": 50,
        "coverArt": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
        "coverText": "Carbon Pt 1",
        "coverBg": "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
        "audioUrl": "/uploads/audio/misery_s_not_a_friend_of_me.wav",
        "fileUrl": "/uploads/audio/misery_s_not_a_friend_of_me.wav",
        "status": "valid",
        "isFeatured": false,
        "writers": [
          {
            "name": "Ndufo Victoria",
            "pro": "MCSK",
            "share": "100"
          }
        ],
        "producers": [
          {
            "name": "Creator Roster Member",
            "role": "Primary Producer"
          }
        ],
        "publishingSplit": "Writer (50%) / Publisher (50%)",
        "distributionSplit": "Artist (60%) / Producer (25%) / Label (15%)",
        "split": "Artist (60%) / Producer (25%) / Label (15%)",
        "syncCleared": true,
        "album_art_url": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg"
      },
      {
        "id": 1789167248701,
        "isrc": "KE-TM1-24-00009",
        "title": "MACHETE (wail Song) (1)",
        "artist": "Ndufo",
        "release": "Carbon Dating Pt 1",
        "releaseType": "Album",
        "year": "2024",
        "genre": "Afrobeats",
        "duration": "3:35",
        "streams": "0",
        "priceCredits": 50,
        "coverArt": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
        "coverText": "Carbon Pt 1",
        "coverBg": "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
        "audioUrl": "/uploads/audio/machete_wail_song.wav",
        "fileUrl": "/uploads/audio/machete_wail_song.wav",
        "status": "valid",
        "isFeatured": false,
        "writers": [
          {
            "name": "Ndufo Victoria",
            "pro": "MCSK",
            "share": "100"
          }
        ],
        "producers": [
          {
            "name": "Creator Roster Member",
            "role": "Primary Producer"
          }
        ],
        "publishingSplit": "Writer (50%) / Publisher (50%)",
        "distributionSplit": "Artist (60%) / Producer (25%) / Label (15%)",
        "split": "Artist (60%) / Producer (25%) / Label (15%)",
        "syncCleared": true,
        "album_art_url": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg"
      },
      {
        "id": 1789167248700,
        "isrc": "KE-TM1-24-00008",
        "title": "I Ll Come Back Home (1)",
        "artist": "Ndufo",
        "release": "Carbon Dating Pt 1",
        "releaseType": "Album",
        "year": "2024",
        "genre": "Afrobeats",
        "duration": "3:35",
        "streams": "0",
        "priceCredits": 50,
        "coverArt": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
        "coverText": "Carbon Pt 1",
        "coverBg": "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
        "audioUrl": "/uploads/audio/i_ll_come_back_home.wav",
        "fileUrl": "/uploads/audio/i_ll_come_back_home.wav",
        "status": "valid",
        "isFeatured": false,
        "writers": [
          {
            "name": "Ndufo Victoria",
            "pro": "MCSK",
            "share": "100"
          }
        ],
        "producers": [
          {
            "name": "Creator Roster Member",
            "role": "Primary Producer"
          }
        ],
        "publishingSplit": "Writer (50%) / Publisher (50%)",
        "distributionSplit": "Artist (60%) / Producer (25%) / Label (15%)",
        "split": "Artist (60%) / Producer (25%) / Label (15%)",
        "syncCleared": true,
        "album_art_url": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg"
      },
      {
        "id": 1789167248698,
        "isrc": "KE-TM1-24-00007",
        "title": "Hii Game Si Bano (1)",
        "artist": "Ndufo",
        "release": "Carbon Dating Pt 1",
        "releaseType": "Album",
        "year": "2024",
        "genre": "Afrobeats",
        "duration": "3:35",
        "streams": "0",
        "priceCredits": 50,
        "coverArt": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
        "coverText": "Carbon Pt 1",
        "coverBg": "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
        "audioUrl": "/uploads/audio/hii_game_si_bano.wav",
        "fileUrl": "/uploads/audio/hii_game_si_bano.wav",
        "status": "valid",
        "isFeatured": false,
        "writers": [
          {
            "name": "Ndufo Victoria",
            "pro": "MCSK",
            "share": "100"
          }
        ],
        "producers": [
          {
            "name": "Creator Roster Member",
            "role": "Primary Producer"
          }
        ],
        "publishingSplit": "Writer (50%) / Publisher (50%)",
        "distributionSplit": "Artist (60%) / Producer (25%) / Label (15%)",
        "split": "Artist (60%) / Producer (25%) / Label (15%)",
        "syncCleared": true,
        "album_art_url": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg"
      },
      {
        "id": 1789167248697,
        "isrc": "KE-TM1-24-00006",
        "title": "HAIYA (1)",
        "artist": "Ndufo",
        "release": "Carbon Dating Pt 1",
        "releaseType": "Album",
        "year": "2024",
        "genre": "Afrobeats",
        "duration": "3:35",
        "streams": "0",
        "priceCredits": 50,
        "coverArt": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
        "coverText": "Carbon Pt 1",
        "coverBg": "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
        "audioUrl": "/uploads/audio/haiya.wav",
        "fileUrl": "/uploads/audio/haiya.wav",
        "status": "valid",
        "isFeatured": true,
        "writers": [
          {
            "name": "Ndufo Victoria",
            "pro": "MCSK",
            "share": "100"
          }
        ],
        "producers": [
          {
            "name": "Creator Roster Member",
            "role": "Primary Producer"
          }
        ],
        "publishingSplit": "Writer (50%) / Publisher (50%)",
        "distributionSplit": "Artist (60%) / Producer (25%) / Label (15%)",
        "split": "Artist (60%) / Producer (25%) / Label (15%)",
        "syncCleared": true,
        "album_art_url": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg"
      }
    ],
    "priceCredits": 50,
    "artist": "Ndufo"
  },
  {
    "id": "6aa4851b5a5bcfd560306662",
    "title": "Solar Eclipse Mixtape",
    "year": "2026",
    "type": "Mixtape",
    "genre": "Afro-House",
    "tracksCount": 2,
    "cover": "https://picsum.photos/seed/2633043823187863974/600/600",
    "streams": "Master Audio",
    "isrc": "KE-TM1-26-99001",
    "isrcs": [
      "KE-TM1-26-99001",
      "KE-TM1-26-99002"
    ],
    "tracks": [
      {
        "id": 1789166874242,
        "isrc": "KE-TM1-26-99001",
        "title": "Solar Eclipse (VIP Club Mix)",
        "artist": "Ndufo",
        "release": "Solar Eclipse Mixtape",
        "releaseType": "Mixtape",
        "year": "2026",
        "genre": "Amapiano",
        "duration": "2:45",
        "streams": "100K",
        "priceCredits": 50,
        "coverArt": "https://picsum.photos/seed/2633043823187863974/600/600",
        "coverText": "Solar",
        "coverBg": "linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)",
        "audioUrl": null,
        "fileUrl": null,
        "status": "valid",
        "isFeatured": true,
        "writers": [
          {
            "name": "Ndufo",
            "pro": "BMI",
            "share": 100
          }
        ],
        "producers": [
          {
            "name": "Ndufo",
            "role": "Primary Producer"
          }
        ],
        "publishingSplit": "Writer (50%) / Publisher (50%)",
        "distributionSplit": "Artist (60%) / Producer (25%) / Label (15%)",
        "split": "Artist (60%) / Producer (25%) / Label (15%)",
        "syncCleared": true
      }
    ],
    "priceCredits": 50,
    "artist": "Ndufo"
  },
  {
    "id": "trk-rel-8343256086346431259",
    "title": "Bulk Ingest Master",
    "year": "2026",
    "type": "Single",
    "genre": "Afro-House",
    "tracksCount": 1,
    "cover": "https://picsum.photos/seed/1842007092082705734/600/600",
    "streams": "0",
    "isrc": "KE-TM1-26-60013",
    "isrcs": [
      "KE-TM1-26-60013"
    ],
    "tracks": [
      {
        "id": 1789418313563,
        "isrc": "KE-TM1-26-60013",
        "title": "Bulk Test Track 1",
        "artist": "Ndufo",
        "release": "Bulk Ingest Master",
        "releaseType": "Single",
        "year": "2026",
        "genre": "Afro-House",
        "duration": "3:30",
        "streams": "0",
        "priceCredits": 50,
        "coverArt": "https://picsum.photos/seed/1842007092082705734/600/600",
        "coverBg": "linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)",
        "coverText": "Bulk",
        "audioUrl": null,
        "fileUrl": null,
        "status": "valid",
        "isFeatured": true,
        "consumptionType": "both",
        "streamPriceCredits": 50,
        "downloadPriceCredits": 150,
        "publishingSplit": "Writer (50%) / Publisher (50%)",
        "distributionSplit": "Artist (60%) / Producer (25%) / Label (15%)",
        "split": "Artist (60%) / Producer (25%) / Label (15%)",
        "syncCleared": true
      }
    ],
    "priceCredits": 50,
    "artist": "Ndufo"
  },
  {
    "id": "trk-rel-8011506671086972043",
    "title": "Neon Safari EP",
    "year": "2026",
    "type": "EP",
    "genre": "Afro-House",
    "tracksCount": 1,
    "cover": "https://picsum.photos/seed/cyberwave_cover/600/600",
    "streams": "3.4M",
    "isrc": "KE-TM1-26-00042",
    "isrcs": [
      "KE-TM1-26-00042"
    ],
    "tracks": [
      {
        "id": 1,
        "title": "Nairobi Cyberwave (Master)",
        "release": "Neon Safari EP",
        "isrc": "KE-TM1-26-00042",
        "streams": "3.4M",
        "duration": "3:45",
        "priceCredits": 50,
        "coverArt": "https://picsum.photos/seed/cyberwave_cover/600/600",
        "artist": "Ndufo",
        "releaseType": "EP",
        "genre": "Afro-House"
      }
    ],
    "priceCredits": 50,
    "artist": "Ndufo"
  },
  {
    "id": "trk-rel-2804945524309527334",
    "title": "Singles 2026",
    "year": "2026",
    "type": "Single",
    "genre": "Amapiano",
    "tracksCount": 1,
    "cover": "https://picsum.photos/seed/riftvalley_cover/600/600",
    "streams": "1.8M",
    "isrc": "KE-TM1-26-00043",
    "isrcs": [
      "KE-TM1-26-00043"
    ],
    "tracks": [
      {
        "id": 2,
        "title": "Sunset over Rift Valley",
        "release": "Singles 2026",
        "isrc": "KE-TM1-26-00043",
        "streams": "1.8M",
        "duration": "4:12",
        "priceCredits": 50,
        "coverArt": "https://picsum.photos/seed/riftvalley_cover/600/600",
        "artist": "Ndufo",
        "releaseType": "Single",
        "genre": "Amapiano"
      }
    ],
    "priceCredits": 50,
    "artist": "Ndufo"
  },
  {
    "id": "trk-rel-6017625529110118053",
    "title": "Mainstage Dubs",
    "year": "2026",
    "type": "Album",
    "genre": "Deep-House",
    "tracksCount": 1,
    "cover": "https://picsum.photos/seed/afrosynth_cover/600/600",
    "streams": "940K",
    "isrc": "KE-TM1-26-00044",
    "isrcs": [
      "KE-TM1-26-00044"
    ],
    "tracks": [
      {
        "id": 3,
        "title": "Afro-Synth Cascade",
        "release": "Mainstage Dubs",
        "isrc": "KE-TM1-26-00044",
        "streams": "940K",
        "duration": "3:18",
        "priceCredits": 40,
        "coverArt": "https://picsum.photos/seed/afrosynth_cover/600/600",
        "artist": "Ndufo",
        "releaseType": "Album",
        "genre": "Deep-House"
      }
    ],
    "priceCredits": 40,
    "artist": "Ndufo"
  },
  {
    "id": "trk-rel-4424439350572661889",
    "title": "EP 2025",
    "year": "2026",
    "type": "EP",
    "genre": "Afrobeats",
    "tracksCount": 1,
    "cover": "https://picsum.photos/seed/mara_cover/600/600",
    "streams": "2.1M",
    "isrc": "KE-TM1-26-00045",
    "isrcs": [
      "KE-TM1-26-00045"
    ],
    "tracks": [
      {
        "id": 4,
        "title": "Midnight Mara Starlight",
        "release": "EP 2025",
        "isrc": "KE-TM1-26-00045",
        "streams": "2.1M",
        "duration": "5:02",
        "priceCredits": 60,
        "coverArt": "https://picsum.photos/seed/mara_cover/600/600",
        "artist": "Ndufo",
        "releaseType": "EP",
        "genre": "Afrobeats"
      }
    ],
    "priceCredits": 60,
    "artist": "Ndufo"
  },
  {
    "id": 401,
    "title": "Nairobi Cyberwave (Deluxe LP)",
    "year": "2026",
    "type": "Album",
    "genre": "Afro-House",
    "tracksCount": 12,
    "cover": "https://picsum.photos/seed/album1_epk/400",
    "streams": "3.4M",
    "isrc": "KE-TM1-26-00042",
    "priceCredits": 50,
    "artist": "Ndufo"
  },
  {
    "id": 402,
    "title": "Rift Valley Soundscapes",
    "year": "2026",
    "type": "Album",
    "genre": "Amapiano",
    "tracksCount": 10,
    "cover": "https://picsum.photos/seed/album2_epk/400",
    "streams": "1.8M",
    "isrc": "KE-TM1-26-00043",
    "priceCredits": 50,
    "artist": "Ndufo"
  },
  {
    "id": 403,
    "title": "Afro-Synth Cascade",
    "year": "2025",
    "type": "Single",
    "genre": "Deep-House",
    "tracksCount": 2,
    "cover": "https://picsum.photos/seed/album3_epk/400",
    "streams": "940K",
    "isrc": "KE-TM1-26-00044",
    "priceCredits": 40,
    "artist": "Ndufo"
  },
  {
    "id": 404,
    "title": "Midnight Mara Starlight",
    "year": "2025",
    "type": "EP",
    "genre": "Afrobeats",
    "tracksCount": 5,
    "cover": "https://picsum.photos/seed/album4_epk/400",
    "streams": "2.1M",
    "isrc": "KE-TM1-26-00045",
    "priceCredits": 45,
    "artist": "Ndufo"
  }
];

export const AUTHORITATIVE_CATALOG_TRACKS = [
  {
    "id": 1789418313563,
    "isrc": "KE-TM1-26-60013",
    "iswc": "T-222.420.001-1",
    "title": "Bulk Test Track 1",
    "artist": "Ndufo",
    "album": "Bulk Ingest Master",
    "release": "Bulk Ingest Master",
    "releaseType": "Single",
    "year": "2026",
    "genre": "Afro-House",
    "duration": "3:30",
    "plays": "0",
    "streams": "0",
    "priceCredits": 50,
    "cover": "https://picsum.photos/seed/1842007092082705734/600/600",
    "coverArt": "https://picsum.photos/seed/1842007092082705734/600/600",
    "coverText": "Bulk Test ",
    "coverBg": "linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)",
    "splits": "Artist (60%) / Producer (25%) / Label (15%)",
    "split": "Artist (60%) / Producer (25%) / Label (15%)",
    "audio_url": "/api/stream/track/KE-TM1-26-60013",
    "audioUrl": "/api/stream/track/KE-TM1-26-60013",
    "status": "valid",
    "isFeatured": true,
    "clearance_status": "100% Pre-Cleared One-Stop",
    "pro_affiliation": "MCSK / BMI"
  },
  {
    "id": 1789167248705,
    "isrc": "KE-TM1-24-00013",
    "iswc": "T-630.420.001-1",
    "title": "ENENDA (1)",
    "artist": "Ndufo",
    "album": "Carbon Dating Pt 1",
    "release": "Carbon Dating Pt 1",
    "releaseType": "Album",
    "year": "2024",
    "genre": "Afrobeats",
    "duration": "3:35",
    "plays": "0",
    "streams": "0",
    "priceCredits": 50,
    "cover": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
    "coverArt": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
    "coverText": "ENENDA (1)",
    "coverBg": "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
    "splits": "Artist (60%) / Producer (25%) / Label (15%)",
    "split": "Artist (60%) / Producer (25%) / Label (15%)",
    "audio_url": "/uploads/audio/enenda.wav",
    "audioUrl": "/uploads/audio/enenda.wav",
    "status": "valid",
    "isFeatured": false,
    "clearance_status": "100% Pre-Cleared One-Stop",
    "pro_affiliation": "MCSK / BMI"
  },
  {
    "id": 1789167248704,
    "isrc": "KE-TM1-24-00012",
    "iswc": "T-563.420.001-1",
    "title": "Running (1)",
    "artist": "Ndufo",
    "album": "Carbon Dating Pt 1",
    "release": "Carbon Dating Pt 1",
    "releaseType": "Album",
    "year": "2024",
    "genre": "Afrobeats",
    "duration": "3:35",
    "plays": "0",
    "streams": "0",
    "priceCredits": 50,
    "cover": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
    "coverArt": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
    "coverText": "Running (1",
    "coverBg": "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
    "splits": "Artist (60%) / Producer (25%) / Label (15%)",
    "split": "Artist (60%) / Producer (25%) / Label (15%)",
    "audio_url": "/uploads/audio/running.wav",
    "audioUrl": "/uploads/audio/running.wav",
    "status": "valid",
    "isFeatured": false,
    "clearance_status": "100% Pre-Cleared One-Stop",
    "pro_affiliation": "MCSK / BMI"
  },
  {
    "id": 1789167248703,
    "isrc": "KE-TM1-24-00011",
    "iswc": "T-981.420.001-1",
    "title": "Pray Tell (1)",
    "artist": "Ndufo",
    "album": "Carbon Dating Pt 1",
    "release": "Carbon Dating Pt 1",
    "releaseType": "Album",
    "year": "2024",
    "genre": "Afrobeats",
    "duration": "3:35",
    "plays": "0",
    "streams": "0",
    "priceCredits": 50,
    "cover": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
    "coverArt": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
    "coverText": "Pray Tell ",
    "coverBg": "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
    "splits": "Artist (60%) / Producer (25%) / Label (15%)",
    "split": "Artist (60%) / Producer (25%) / Label (15%)",
    "audio_url": "/uploads/audio/pray_tell.wav",
    "audioUrl": "/uploads/audio/pray_tell.wav",
    "status": "valid",
    "isFeatured": false,
    "clearance_status": "100% Pre-Cleared One-Stop",
    "pro_affiliation": "MCSK / BMI"
  },
  {
    "id": 1789167248702,
    "isrc": "KE-TM1-24-00010",
    "iswc": "T-756.420.001-1",
    "title": "Misery S Not A Friend Of Me (1)",
    "artist": "Ndufo",
    "album": "Carbon Dating Pt 1",
    "release": "Carbon Dating Pt 1",
    "releaseType": "Album",
    "year": "2024",
    "genre": "Afrobeats",
    "duration": "3:35",
    "plays": "0",
    "streams": "0",
    "priceCredits": 50,
    "cover": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
    "coverArt": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
    "coverText": "Misery S N",
    "coverBg": "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
    "splits": "Artist (60%) / Producer (25%) / Label (15%)",
    "split": "Artist (60%) / Producer (25%) / Label (15%)",
    "audio_url": "/uploads/audio/misery_s_not_a_friend_of_me.wav",
    "audioUrl": "/uploads/audio/misery_s_not_a_friend_of_me.wav",
    "status": "valid",
    "isFeatured": false,
    "clearance_status": "100% Pre-Cleared One-Stop",
    "pro_affiliation": "MCSK / BMI"
  },
  {
    "id": 1789167248701,
    "isrc": "KE-TM1-24-00009",
    "iswc": "T-878.420.001-1",
    "title": "MACHETE (wail Song) (1)",
    "artist": "Ndufo",
    "album": "Carbon Dating Pt 1",
    "release": "Carbon Dating Pt 1",
    "releaseType": "Album",
    "year": "2024",
    "genre": "Afrobeats",
    "duration": "3:35",
    "plays": "0",
    "streams": "0",
    "priceCredits": 50,
    "cover": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
    "coverArt": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
    "coverText": "MACHETE (w",
    "coverBg": "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
    "splits": "Artist (60%) / Producer (25%) / Label (15%)",
    "split": "Artist (60%) / Producer (25%) / Label (15%)",
    "audio_url": "/uploads/audio/machete_wail_song.wav",
    "audioUrl": "/uploads/audio/machete_wail_song.wav",
    "status": "valid",
    "isFeatured": false,
    "clearance_status": "100% Pre-Cleared One-Stop",
    "pro_affiliation": "MCSK / BMI"
  },
  {
    "id": 1789167248700,
    "isrc": "KE-TM1-24-00008",
    "iswc": "T-675.420.001-1",
    "title": "I Ll Come Back Home (1)",
    "artist": "Ndufo",
    "album": "Carbon Dating Pt 1",
    "release": "Carbon Dating Pt 1",
    "releaseType": "Album",
    "year": "2024",
    "genre": "Afrobeats",
    "duration": "3:35",
    "plays": "0",
    "streams": "0",
    "priceCredits": 50,
    "cover": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
    "coverArt": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
    "coverText": "I Ll Come ",
    "coverBg": "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
    "splits": "Artist (60%) / Producer (25%) / Label (15%)",
    "split": "Artist (60%) / Producer (25%) / Label (15%)",
    "audio_url": "/uploads/audio/i_ll_come_back_home.wav",
    "audioUrl": "/uploads/audio/i_ll_come_back_home.wav",
    "status": "valid",
    "isFeatured": false,
    "clearance_status": "100% Pre-Cleared One-Stop",
    "pro_affiliation": "MCSK / BMI"
  },
  {
    "id": 1789167248698,
    "isrc": "KE-TM1-24-00007",
    "iswc": "T-711.420.001-1",
    "title": "Hii Game Si Bano (1)",
    "artist": "Ndufo",
    "album": "Carbon Dating Pt 1",
    "release": "Carbon Dating Pt 1",
    "releaseType": "Album",
    "year": "2024",
    "genre": "Afrobeats",
    "duration": "3:35",
    "plays": "0",
    "streams": "0",
    "priceCredits": 50,
    "cover": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
    "coverArt": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
    "coverText": "Hii Game S",
    "coverBg": "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
    "splits": "Artist (60%) / Producer (25%) / Label (15%)",
    "split": "Artist (60%) / Producer (25%) / Label (15%)",
    "audio_url": "/uploads/audio/hii_game_si_bano.wav",
    "audioUrl": "/uploads/audio/hii_game_si_bano.wav",
    "status": "valid",
    "isFeatured": false,
    "clearance_status": "100% Pre-Cleared One-Stop",
    "pro_affiliation": "MCSK / BMI"
  },
  {
    "id": 1789167248697,
    "isrc": "KE-TM1-24-00006",
    "iswc": "T-476.420.001-1",
    "title": "HAIYA (1)",
    "artist": "Ndufo",
    "album": "Carbon Dating Pt 1",
    "release": "Carbon Dating Pt 1",
    "releaseType": "Album",
    "year": "2024",
    "genre": "Afrobeats",
    "duration": "3:35",
    "plays": "0",
    "streams": "0",
    "priceCredits": 50,
    "cover": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
    "coverArt": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
    "coverText": "HAIYA (1)",
    "coverBg": "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
    "splits": "Artist (60%) / Producer (25%) / Label (15%)",
    "split": "Artist (60%) / Producer (25%) / Label (15%)",
    "audio_url": "/uploads/audio/haiya.wav",
    "audioUrl": "/uploads/audio/haiya.wav",
    "status": "valid",
    "isFeatured": true,
    "clearance_status": "100% Pre-Cleared One-Stop",
    "pro_affiliation": "MCSK / BMI"
  },
  {
    "id": 1789166874242,
    "isrc": "KE-TM1-26-99001",
    "iswc": "T-541.420.001-1",
    "title": "Solar Eclipse (VIP Club Mix)",
    "artist": "Ndufo",
    "album": "Solar Eclipse Mixtape",
    "release": "Solar Eclipse Mixtape",
    "releaseType": "Mixtape",
    "year": "2026",
    "genre": "Amapiano",
    "duration": "2:45",
    "plays": "100K",
    "streams": "100K",
    "priceCredits": 50,
    "cover": "https://picsum.photos/seed/2633043823187863974/600/600",
    "coverArt": "https://picsum.photos/seed/2633043823187863974/600/600",
    "coverText": "Solar Ecli",
    "coverBg": "linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)",
    "splits": "Artist (60%) / Producer (25%) / Label (15%)",
    "split": "Artist (60%) / Producer (25%) / Label (15%)",
    "audio_url": "/api/stream/track/KE-TM1-26-99001",
    "audioUrl": "/api/stream/track/KE-TM1-26-99001",
    "status": "valid",
    "isFeatured": true,
    "clearance_status": "100% Pre-Cleared One-Stop",
    "pro_affiliation": "MCSK / BMI"
  },
  {
    "id": 1,
    "isrc": "KE-TM1-26-00042",
    "iswc": "T-283.420.001-1",
    "title": "Nairobi Cyberwave (Master)",
    "artist": "Ndufo",
    "album": "Neon Safari EP",
    "release": "Neon Safari EP",
    "releaseType": "EP",
    "year": "2026",
    "genre": "Afro-House",
    "duration": "3:45",
    "plays": "3.4M",
    "streams": "3.4M",
    "priceCredits": 50,
    "cover": "https://picsum.photos/seed/cyberwave_cover/600/600",
    "coverArt": "https://picsum.photos/seed/cyberwave_cover/600/600",
    "coverText": "Nairobi Cy",
    "coverBg": "linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)",
    "splits": "Artist (60%) / Producer (25%) / Label (15%)",
    "split": "Artist (60%) / Producer (25%) / Label (15%)",
    "audio_url": "/api/stream/track/KE-TM1-26-00042",
    "audioUrl": "/api/stream/track/KE-TM1-26-00042",
    "status": "Approved",
    "isFeatured": false,
    "clearance_status": "100% Pre-Cleared One-Stop",
    "pro_affiliation": "MCSK / BMI"
  },
  {
    "id": 2,
    "isrc": "KE-TM1-26-00043",
    "iswc": "T-196.420.001-1",
    "title": "Sunset over Rift Valley",
    "artist": "Ndufo",
    "album": "Singles 2026",
    "release": "Singles 2026",
    "releaseType": "Single",
    "year": "2026",
    "genre": "Amapiano",
    "duration": "4:12",
    "plays": "1.8M",
    "streams": "1.8M",
    "priceCredits": 50,
    "cover": "https://picsum.photos/seed/riftvalley_cover/600/600",
    "coverArt": "https://picsum.photos/seed/riftvalley_cover/600/600",
    "coverText": "Sunset ove",
    "coverBg": "linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)",
    "splits": "Artist (60%) / Producer (25%) / Label (15%)",
    "split": "Artist (60%) / Producer (25%) / Label (15%)",
    "audio_url": "/api/stream/track/KE-TM1-26-00043",
    "audioUrl": "/api/stream/track/KE-TM1-26-00043",
    "status": "Approved",
    "isFeatured": false,
    "clearance_status": "100% Pre-Cleared One-Stop",
    "pro_affiliation": "MCSK / BMI"
  },
  {
    "id": 3,
    "isrc": "KE-TM1-26-00044",
    "iswc": "T-462.420.001-1",
    "title": "Afro-Synth Cascade",
    "artist": "Ndufo",
    "album": "Mainstage Dubs",
    "release": "Mainstage Dubs",
    "releaseType": "Album",
    "year": "2026",
    "genre": "Deep-House",
    "duration": "3:18",
    "plays": "940K",
    "streams": "940K",
    "priceCredits": 40,
    "cover": "https://picsum.photos/seed/afrosynth_cover/600/600",
    "coverArt": "https://picsum.photos/seed/afrosynth_cover/600/600",
    "coverText": "Afro-Synth",
    "coverBg": "linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)",
    "splits": "Artist (60%) / Producer (25%) / Label (15%)",
    "split": "Artist (60%) / Producer (25%) / Label (15%)",
    "audio_url": "/api/stream/track/KE-TM1-26-00044",
    "audioUrl": "/api/stream/track/KE-TM1-26-00044",
    "status": "Approved",
    "isFeatured": false,
    "clearance_status": "100% Pre-Cleared One-Stop",
    "pro_affiliation": "MCSK / BMI"
  },
  {
    "id": 4,
    "isrc": "KE-TM1-26-00045",
    "iswc": "T-572.420.001-1",
    "title": "Midnight Mara Starlight",
    "artist": "Ndufo",
    "album": "EP 2025",
    "release": "EP 2025",
    "releaseType": "EP",
    "year": "2026",
    "genre": "Afrobeats",
    "duration": "5:02",
    "plays": "2.1M",
    "streams": "2.1M",
    "priceCredits": 60,
    "cover": "https://picsum.photos/seed/mara_cover/600/600",
    "coverArt": "https://picsum.photos/seed/mara_cover/600/600",
    "coverText": "Midnight M",
    "coverBg": "linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)",
    "splits": "Artist (60%) / Producer (25%) / Label (15%)",
    "split": "Artist (60%) / Producer (25%) / Label (15%)",
    "audio_url": "/api/stream/track/KE-TM1-26-00045",
    "audioUrl": "/api/stream/track/KE-TM1-26-00045",
    "status": "Approved",
    "isFeatured": false,
    "clearance_status": "100% Pre-Cleared One-Stop",
    "pro_affiliation": "MCSK / BMI"
  },
  {
    "id": 1789419700198,
    "isrc": "KE-TM1-26-60015",
    "iswc": "T-253.867.001-1",
    "title": "Test Bulk Track 2",
    "artist": "Aisha Okoro",
    "album": "Afro Fusion Gold",
    "release": "Afro Fusion Gold",
    "releaseType": "Single",
    "year": "2026",
    "genre": "Amapiano",
    "duration": "3:30",
    "plays": "0",
    "streams": "0",
    "priceCredits": 50,
    "cover": "https://picsum.photos/seed/5274058962942578673/600/600",
    "coverArt": "https://picsum.photos/seed/5274058962942578673/600/600",
    "coverText": "Test Bulk ",
    "coverBg": "linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)",
    "splits": "Artist (60%) / Producer (25%) / Label (15%)",
    "split": "Artist (60%) / Producer (25%) / Label (15%)",
    "audio_url": "/api/stream/track/KE-TM1-26-60015",
    "audioUrl": "/api/stream/track/KE-TM1-26-60015",
    "status": "valid",
    "isFeatured": false,
    "clearance_status": "100% Pre-Cleared One-Stop",
    "pro_affiliation": "MCSK / BMI"
  },
  {
    "id": 1789419700197,
    "isrc": "KE-TM1-26-60014",
    "iswc": "T-913.867.001-1",
    "title": "Test Bulk Track 1",
    "artist": "Aisha Okoro",
    "album": "Afro Fusion Gold",
    "release": "Afro Fusion Gold",
    "releaseType": "Single",
    "year": "2026",
    "genre": "Afro-House",
    "duration": "3:30",
    "plays": "0",
    "streams": "0",
    "priceCredits": 50,
    "cover": "https://picsum.photos/seed/3944044463953802002/600/600",
    "coverArt": "https://picsum.photos/seed/3944044463953802002/600/600",
    "coverText": "Test Bulk ",
    "coverBg": "linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)",
    "splits": "Artist (60%) / Producer (25%) / Label (15%)",
    "split": "Artist (60%) / Producer (25%) / Label (15%)",
    "audio_url": "/api/stream/track/KE-TM1-26-60014",
    "audioUrl": "/api/stream/track/KE-TM1-26-60014",
    "status": "valid",
    "isFeatured": true,
    "clearance_status": "100% Pre-Cleared One-Stop",
    "pro_affiliation": "MCSK / BMI"
  }
];

export function getUnifiedCatalog() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('catalog_tracks') : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(t => ({
          ...t,
          cover: t.cover || t.coverArt,
          coverArt: t.coverArt || t.cover,
          album: t.album || t.release || 'Single',
          release: t.release || t.album || 'Single',
          releaseType: t.releaseType || (t.release && t.release.toLowerCase().includes('single') ? 'Single' : 'Album'),
          plays: t.plays || t.streams || '1.0M',
          streams: t.streams || t.plays || '1.0M',
          splits: t.splits || t.split || '100/0',
          split: t.split || t.splits || '100/0',
          audioUrl: t.audioUrl || t.audio_url || `/api/stream/track/${t.isrc || t.id}`
        }));
      }
    }
  } catch (err) {
    console.warn('Failed to parse catalog_tracks from localStorage:', err);
  }

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('catalog_tracks', JSON.stringify(AUTHORITATIVE_CATALOG_TRACKS));
    } catch (_) {}
  }
  return AUTHORITATIVE_CATALOG_TRACKS;
}

export function saveUnifiedCatalog(tracks) {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('catalog_tracks', JSON.stringify(tracks));
      window.dispatchEvent(new CustomEvent('tunemavens:catalog_updated', { detail: tracks }));
    } catch (err) {
      console.warn('Failed to save unified catalog:', err);
    }
  }
}
