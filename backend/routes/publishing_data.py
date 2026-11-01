"""Comprehensive Catalog of 150+ Global Performance Rights Organizations (PROs),
Collective Management Organizations (CMOs), and Mechanical Rights Organizations (MROs) supported by TuneMavens.
"""

ALL_SUPPORTED_SOCIETIES = [
    {
        "id": "the_mlc",
        "name": "The Mechanical Licensing Collective (The MLC)",
        "code": "The MLC",
        "country": "United States & Global",
        "iso_country": "US",
        "region": "Global Direct",
        "type": "MRO (Mechanical)",
        "payout_frequency": "Monthly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Digital Mechanicals",
            "Interactive Streaming",
            "Limited Downloads",
            "DSP Pass-Through"
        ],
        "description": "Designated by the US Copyright Office to collect 100% of blanket mechanical royalties from DSPs (Spotify, Apple, Amazon) without commissions."
    },
    {
        "id": "amra",
        "name": "AMRA (American Music Rights Association)",
        "code": "AMRA",
        "country": "Global Multi-Territory",
        "iso_country": "GL",
        "region": "Global Direct",
        "type": "Digital Licensing Agency",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Global Digital Mechanicals",
            "Global Digital Performance",
            "DSP Direct-Pay"
        ],
        "description": "Global direct digital collection society powered by Kobalt technology, licensing rights directly to DSPs across 200+ territories."
    },
    {
        "id": "soundexchange",
        "name": "SoundExchange Direct",
        "code": "SoundExchange",
        "country": "United States & International Reciprocal",
        "iso_country": "US",
        "region": "Global Direct",
        "type": "CMO (Neighboring Rights)",
        "payout_frequency": "Monthly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Non-Interactive Digital Performance",
            "Satellite Radio",
            "Webcasting",
            "Cable TV"
        ],
        "description": "Collects statutory royalties from SiriusXM, Pandora, and thousands of digital webcasters on behalf of master owners and featured performers."
    },
    {
        "id": "ice_services",
        "name": "ICE Operations (PRS / STIM / GEMA Joint Venture)",
        "code": "ICE",
        "country": "Pan-European & Global",
        "iso_country": "EU",
        "region": "Global Direct",
        "type": "Digital Licensing Hub",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Pan-European Digital Licensing",
            "Multi-Territory Streaming",
            "Mechanicals"
        ],
        "description": "Joint licensing hub managing online music rights across 130+ countries for over 330,000 rightsholders."
    },
    {
        "id": "impel",
        "name": "IMPEL Music Licensing",
        "code": "IMPEL",
        "country": "International Independent",
        "iso_country": "GL",
        "region": "Global Direct",
        "type": "Digital Licensing Agency",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Digital Streaming",
            "Downloads",
            "Independent Publisher Share"
        ],
        "description": "Direct global digital licensing collective representing top independent publishers worldwide."
    },
    {
        "id": "cmrra_direct",
        "name": "CMRRA Direct Global (Canadian Musical Reproduction Rights Agency)",
        "code": "CMRRA",
        "country": "Canada & North America",
        "iso_country": "CA",
        "region": "Global Direct",
        "type": "MRO (Mechanical)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Digital Audio Mechanicals",
            "Physical CD/Vinyl Reproduction",
            "Broadcast Mechanicals"
        ],
        "description": "Licenses reproduction rights for music publishers and self-published songwriters across North American DSPs and physical pressings."
    },
    {
        "id": "hfa",
        "name": "Harry Fox Agency (HFA / Rumblefish)",
        "code": "HFA",
        "country": "United States",
        "iso_country": "US",
        "region": "Global Direct",
        "type": "MRO (Mechanical)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Physical Mechanicals",
            "Permanent Downloads",
            "Ringtones",
            "Background Music Services"
        ],
        "description": "The premier mechanical licensing agency in the US, administering physical, download, and sync cue reproduction."
    },
    {
        "id": "muso_sync_hub",
        "name": "TuneMavens Global Sync & Cue Clearance Network",
        "code": "TM-SYNC",
        "country": "Worldwide Direct",
        "iso_country": "KE",
        "region": "Global Direct",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Instantaneous (Real-Time)",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Film & TV Sync Cues",
            "Broadcast Advertising",
            "Gaming & Interactive Cues",
            "Lossless Master Clearance"
        ],
        "description": "TuneMavens proprietary automated cue sheet and sync placement clearinghouse with instant tri-party waterfall disbursements."
    },
    {
        "id": "armonia",
        "name": "Armonia Online Hub (SACEM / SGAE / SIAE)",
        "code": "Armonia",
        "country": "Pan-European",
        "iso_country": "EU",
        "region": "Global Direct",
        "type": "Digital Licensing Hub",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Multi-Territory Digital Rights",
            "Interactive Streaming",
            "Cloud Audio Lockers"
        ],
        "description": "The first pan-European online music licensing alliance, streamlining digital clearance across 32 European markets."
    },
    {
        "id": "latin_autor",
        "name": "LatinAutor Digital Hub",
        "code": "LatinAutor",
        "country": "Latin America & Caribbean",
        "iso_country": "LA",
        "region": "Global Direct",
        "type": "Digital Licensing Hub",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Pan-American DSP Licensing",
            "Regional Digital Streaming",
            "Mechanical Clearing"
        ],
        "description": "Regional hub combining Latin American author societies for direct negotiations with Spotify, YouTube, and Apple Music."
    },
    {
        "id": "ascap",
        "name": "ASCAP (American Society of Composers, Authors and Publishers)",
        "code": "ASCAP",
        "country": "United States",
        "iso_country": "US",
        "region": "North America",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Radio & TV Broadcast",
            "Streaming Performance",
            "Live Concerts",
            "General Venue Licensing"
        ],
        "description": "World's foremost performing rights organization with over 950,000 songwriter, composer, and publisher members."
    },
    {
        "id": "bmi",
        "name": "Broadcast Music, Inc. (BMI)",
        "code": "BMI",
        "country": "United States",
        "iso_country": "US",
        "region": "North America",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Radio & Television",
            "Digital Media Performance",
            "Concert Tours",
            "Digital Jukeboxes"
        ],
        "description": "Represents more than 1.4 million songwriters, composers, and publishers across 22.4 million musical works."
    },
    {
        "id": "sesac",
        "name": "SESAC Performing Rights",
        "code": "SESAC",
        "country": "United States",
        "iso_country": "US",
        "region": "North America",
        "type": "PRO (Performance)",
        "payout_frequency": "Monthly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Broadcast Performance",
            "Digital On-Demand",
            "Film & TV Underscore",
            "Sync Residuals"
        ],
        "description": "Invitation-only US performance rights organization offering monthly digital royalty disbursements."
    },
    {
        "id": "all_track",
        "name": "All-Track Performing Rights Organization",
        "code": "All-Track",
        "country": "United States",
        "iso_country": "US",
        "region": "North America",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Independent Streaming",
            "Digital TV & Film",
            "Venue Performances"
        ],
        "description": "Modern US performing rights organization established specifically for independent creators and digital-first producers."
    },
    {
        "id": "socan",
        "name": "SOCAN (Society of Composers, Authors and Music Publishers of Canada)",
        "code": "SOCAN",
        "country": "Canada",
        "iso_country": "CA",
        "region": "North America",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Performance Royalties",
            "Mechanical Royalties",
            "International Reciprocal",
            "Concert Tours"
        ],
        "description": "Administers both performing and mechanical rights for over 180,000 Canadian creators and international rightsholders."
    },
    {
        "id": "sodrac",
        "name": "SODRAC (Society for Reproduction Rights of Authors, Composers and Publishers)",
        "code": "SODRAC",
        "country": "Canada (Quebec)",
        "iso_country": "CA",
        "region": "North America",
        "type": "MRO (Mechanical)",
        "payout_frequency": "Quarterly",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Audiovisual Synchronization",
            "Reproduction Rights",
            "Broadcast Mechanicals"
        ],
        "description": "Specialized reproduction rights society administering Francophone and Canadian artistic and musical catalogues."
    },
    {
        "id": "music_reports",
        "name": "Music Reports Inc. (Songdex)",
        "code": "Music Reports",
        "country": "United States",
        "iso_country": "US",
        "region": "North America",
        "type": "Digital Licensing Agency",
        "payout_frequency": "Monthly",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Cue Sheet Reporting",
            "Fitness App Licensing (Peloton)",
            "SiriusXM Mechanicals",
            "Podcast Music"
        ],
        "description": "Administers global cue sheet metadata, automated royalty accounting, and direct statutory licensing for digital services."
    },
    {
        "id": "soundreef_na",
        "name": "Soundreef North America",
        "code": "Soundreef NA",
        "country": "United States",
        "iso_country": "US",
        "region": "North America",
        "type": "PRO (Performance)",
        "payout_frequency": "Monthly",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "In-Store Radio",
            "Background Music",
            "Direct Venue Performance"
        ],
        "description": "Tech-driven direct performing rights alternative operating venue-level monitoring and micro-royalty payouts."
    },
    {
        "id": "connect_music",
        "name": "Connect Music Licensing",
        "code": "Connect",
        "country": "Canada",
        "iso_country": "CA",
        "region": "North America",
        "type": "CMO (Neighboring Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Sound Recording Duplication",
            "Radio Broadcast Copying",
            "Video Ingestion"
        ],
        "description": "Licenses the reproduction of sound recordings and music videos across Canadian broadcasters and DJs."
    },
    {
        "id": "artisti",
        "name": "Artisti (Union des Artistes)",
        "code": "Artisti",
        "country": "Canada",
        "iso_country": "CA",
        "region": "North America",
        "type": "CMO (Neighboring Rights)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Performers Equitable Remuneration",
            "Private Copying Levy"
        ],
        "description": "Protects and manages the neighboring rights of performing artists and musicians across Canada."
    },
    {
        "id": "mcsk",
        "name": "Music Copyright Society of Kenya (MCSK)",
        "code": "MCSK",
        "country": "Kenya",
        "iso_country": "KE",
        "region": "Africa",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Broadcast Radio & TV",
            "Matatu & Public Transport Cues",
            "Live Concerts",
            "Bars & Hotels Licensing"
        ],
        "description": "Kenya's premier collective management organization protecting authors, composers, and publishers across East Africa."
    },
    {
        "id": "kamp",
        "name": "Kenya Association of Music Producers (KAMP)",
        "code": "KAMP",
        "country": "Kenya",
        "iso_country": "KE",
        "region": "Africa",
        "type": "CMO (Neighboring Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Producer Master Rights",
            "Commercial Broadcast Play",
            "Public Performance of Sound Recordings"
        ],
        "description": "Administers neighboring and economic rights for Kenyan sound recording owners and music producers."
    },
    {
        "id": "prisk",
        "name": "Performers Rights Society of Kenya (PRISK)",
        "code": "PRISK",
        "country": "Kenya",
        "iso_country": "KE",
        "region": "Africa",
        "type": "CMO (Neighboring Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Featured Artist Remuneration",
            "Session Musician Play",
            "Equitable Remuneration"
        ],
        "description": "Collective management organization for musical and dramatic performing artists in Kenya."
    },
    {
        "id": "samro",
        "name": "Southern African Music Rights Organisation (SAMRO)",
        "code": "SAMRO",
        "country": "South Africa",
        "iso_country": "ZA",
        "region": "Africa",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Broadcast Performing Rights",
            "Concert Tours",
            "Digital Streaming Performance",
            "SABC Airplay"
        ],
        "description": "The largest performing rights organisation on the African continent, representing over 20,000 Southern African music creators."
    },
    {
        "id": "capasso",
        "name": "CAPASSO (Composers, Authors and Publishers Association)",
        "code": "CAPASSO",
        "country": "South Africa & Pan-Africa",
        "iso_country": "ZA",
        "region": "Africa",
        "type": "MRO (Mechanical)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "DSP Digital Mechanicals",
            "Pan-African Streaming Tariffs",
            "Sync Reproduction",
            "Physical Sales"
        ],
        "description": "Digital licensing and mechanical rights hub administering streaming mechanicals across 35 African nations."
    },
    {
        "id": "coson",
        "name": "Copyright Society of Nigeria (COSON)",
        "code": "COSON",
        "country": "Nigeria",
        "iso_country": "NG",
        "region": "Africa",
        "type": "PRO (Performance)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Terrestrial Radio & TV",
            "Afrobeats Live Events",
            "Nightclub & Hotel Licensing"
        ],
        "description": "Pioneering collective management organization for copyright owners of musical works and sound recordings in Nigeria."
    },
    {
        "id": "mcsn",
        "name": "Musical Copyright Society Nigeria (MCSN)",
        "code": "MCSN",
        "country": "Nigeria",
        "iso_country": "NG",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Mechanical & Performing Rights",
            "Broadcast Synch",
            "Telecoms Ringback Tones (CRBT)"
        ],
        "description": "Licensed collecting society for musical works and sound recordings representing thousands of Afrobeats producers and writers."
    },
    {
        "id": "cosota",
        "name": "Copyright Society of Tanzania (COSOTA)",
        "code": "COSOTA",
        "country": "Tanzania",
        "iso_country": "TZ",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Bongo Flava Broadcast",
            "Live Venue Performance",
            "Public Transport Music Tariffs"
        ],
        "description": "Statutory body managing collective rights for authors, composers, and performers across Tanzania mainland."
    },
    {
        "id": "uprs",
        "name": "Uganda Performing Right Society (UPRS)",
        "code": "UPRS",
        "country": "Uganda",
        "iso_country": "UG",
        "region": "Africa",
        "type": "PRO (Performance)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "FM Radio Airplay",
            "Kampala Live Shows",
            "Public Performance Tariffs"
        ],
        "description": "Collects performing royalties for Ugandan songwriters, recording artists, and musical arrangers."
    },
    {
        "id": "ghamro",
        "name": "Ghana Music Rights Organization (GHAMRO)",
        "code": "GHAMRO",
        "country": "Ghana",
        "iso_country": "GH",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Highlife & Afrobeats Airplay",
            "Digital Mechanicals",
            "Live Festivals & Durbar Performances"
        ],
        "description": "Duly authorized society representing composers, authors, and publishers across the Republic of Ghana."
    },
    {
        "id": "sodav",
        "name": "SODAV (Société Sénégalaise du Droit d'Auteur et des Droits Voisins)",
        "code": "SODAV",
        "country": "Senegal",
        "iso_country": "SN",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Mbalax & Urban Airplay",
            "Broadcast Television",
            "Neighboring Rights Remuneration"
        ],
        "description": "Manages both author copyrights and neighboring rights for performing artists across Senegal."
    },
    {
        "id": "burida",
        "name": "BURIDA (Bureau Ivoirien du Droit d'Auteur)",
        "code": "BURIDA",
        "country": "Côte d'Ivoire",
        "iso_country": "CI",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Coupé-Décalé & Zouglou Airplay",
            "Concert Licensing",
            "Private Copying Levy"
        ],
        "description": "National copyright office of Côte d'Ivoire managing rights for Francophone West African musical creators."
    },
    {
        "id": "onda",
        "name": "ONDA (Office National des Droits d'Auteur et Droits Voisins)",
        "code": "ONDA",
        "country": "Algeria",
        "iso_country": "DZ",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Raï & Chaabi Broadcasting",
            "Public Performance",
            "Mechanical Reproduction"
        ],
        "description": "Public industrial establishment managing musical authors and neighboring rights in Algeria."
    },
    {
        "id": "bmda",
        "name": "BMDA (Bureau Marocain du Droit d'Auteur)",
        "code": "BMDA",
        "country": "Morocco",
        "iso_country": "MA",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "North African Radio",
            "Festival Performances (Mawazine)",
            "Digital Streaming"
        ],
        "description": "Administers copyright and neighboring rights across the Kingdom of Morocco."
    },
    {
        "id": "zamcops",
        "name": "Zambia Music Copyright Protection Society (ZAMCOPS)",
        "code": "ZAMCOPS",
        "country": "Zambia",
        "iso_country": "ZM",
        "region": "Africa",
        "type": "PRO (Performance)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Broadcast Airplay",
            "Public Venues",
            "Live Performances"
        ],
        "description": "Represents Zambian composers and publishers for performing rights collection."
    },
    {
        "id": "cosoma",
        "name": "Copyright Society of Malawi (COSOMA)",
        "code": "COSOMA",
        "country": "Malawi",
        "iso_country": "MW",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Radio Airplay",
            "Blank Tape Levies",
            "Public Performances"
        ],
        "description": "Statutory body governing copyright and collective management across Malawi."
    },
    {
        "id": "zimu",
        "name": "Zimbabwe Music Rights Association (ZIMURA)",
        "code": "ZIMURA",
        "country": "Zimbabwe",
        "iso_country": "ZW",
        "region": "Africa",
        "type": "PRO (Performance)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Sungura & Zimdancehall Airplay",
            "Concert Licensing",
            "General Venues"
        ],
        "description": "Established in 1982 to protect the performing rights of Zimbabwean musical authors and composers."
    },
    {
        "id": "nascam",
        "name": "Namibian Society of Composers and Authors of Music (NASCAM)",
        "code": "NASCAM",
        "country": "Namibia",
        "iso_country": "NA",
        "region": "Africa",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Broadcast Radio",
            "Hospitality Licensing",
            "Live Events"
        ],
        "description": "Administers performing rights for over 6,000 Namibian songwriters and musical arrangers."
    },
    {
        "id": "bbda",
        "name": "BBDA (Bureau Burkinabè du Droit d'Auteur)",
        "code": "BBDA",
        "country": "Burkina Faso",
        "iso_country": "BF",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Sahel Broadcast Airplay",
            "FESPACO Sync Royalties",
            "Mechanicals"
        ],
        "description": "Protects and manages intellectual property and neighboring rights in Burkina Faso."
    },
    {
        "id": "cmc_cameroon",
        "name": "CMC / SOCILADRA (Cameroon Music Corporation)",
        "code": "CMC",
        "country": "Cameroon",
        "iso_country": "CM",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Makossa & Bikutsi Airplay",
            "Commercial TV",
            "Live Shows"
        ],
        "description": "Collective management body for musical authors, composers, and editors in Cameroon."
    },
    {
        "id": "socoda",
        "name": "SOCODA (Société Congolaise des Droits d'Auteur)",
        "code": "SOCODA",
        "country": "Democratic Republic of the Congo",
        "iso_country": "CD",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Rumba Congolaise Broadcast",
            "Live Concerts (Kinshasa)",
            "Mechanicals"
        ],
        "description": "Represents the rich heritage of Congolese rumba, soukous, and modern urban music creators."
    },
    {
        "id": "buda_rwanda",
        "name": "RSAU (Rwanda Society of Authors and Rights Holders)",
        "code": "RSAU",
        "country": "Rwanda",
        "iso_country": "RW",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "East African Broadcast",
            "Kigali Venues",
            "Private Copying"
        ],
        "description": "Collects royalties on behalf of Rwandan musicians, composers, and performing artists."
    },
    {
        "id": "sada_angola",
        "name": "UNAC-SA (União Nacional dos Artistas e Compositores)",
        "code": "UNAC-SA",
        "country": "Angola",
        "iso_country": "AO",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Kizomba & Semba Airplay",
            "Luanda Radio",
            "Concert Licensing"
        ],
        "description": "Governing collective entity for Angolan musicians, choreographers, and composers."
    },
    {
        "id": "savam_mozambique",
        "name": "SOMAS (Sociedade Moçambicana de Autores)",
        "code": "SOMAS",
        "country": "Mozambique",
        "iso_country": "MZ",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Marrabenta Broadcast",
            "Maputo Venues",
            "Mechanical Reproduction"
        ],
        "description": "Mozambican society of authors managing copyright for Lusophone Southeast Africa."
    },
    {
        "id": "otda_togo",
        "name": "BUTODRA (Bureau Togolais du Droit d'Auteur)",
        "code": "BUTODRA",
        "country": "Togo",
        "iso_country": "TG",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Radio Lomé Airplay",
            "Hospitality Venues",
            "Mechanical Pressing"
        ],
        "description": "Public collective management organization of Togo protecting literary and artistic property."
    },
    {
        "id": "bubodra_benin",
        "name": "BUBEDRA (Bureau Béninois du Droit d'Auteur)",
        "code": "BUBEDRA",
        "country": "Benin",
        "iso_country": "BJ",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Traditional & Modern Broadcast",
            "Live Concerts",
            "Private Copying"
        ],
        "description": "Administers moral and patrimonial author rights across the Republic of Benin."
    },
    {
        "id": "bgda_guinea",
        "name": "BGDA (Bureau Guinéen du Droit d'Auteur)",
        "code": "BGDA",
        "country": "Guinea",
        "iso_country": "GN",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Griot & Urban Broadcast",
            "Conakry Airplay",
            "Physical Distribution"
        ],
        "description": "National copyright body ensuring author royalties for Guinean musical creators."
    },
    {
        "id": "bunda_mali",
        "name": "BUMDA (Bureau Malien du Droit d'Auteur)",
        "code": "BUMDA",
        "country": "Mali",
        "iso_country": "ML",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Desert Blues Airplay",
            "Bamako Radio",
            "Live Festivals"
        ],
        "description": "Administers intellectual property rights for Mali's world-renowned acoustic and traditional composers."
    },
    {
        "id": "bnda_niger",
        "name": "BNDA (Bureau Nigérien du Droit d'Auteur)",
        "code": "BNDA",
        "country": "Niger",
        "iso_country": "NE",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Broadcast Airplay",
            "Public Performance",
            "Mechanicals"
        ],
        "description": "Official collective society for Nigerien musical and dramatic authors."
    },
    {
        "id": "butandra_chad",
        "name": "BUTDRA (Bureau Tchadien du Droit d'Auteur)",
        "code": "BUTDRA",
        "country": "Chad",
        "iso_country": "TD",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Broadcast Performance",
            "General Venues"
        ],
        "description": "Collects royalties for Chadian songwriters and performing artists."
    },
    {
        "id": "cosona_botswana",
        "name": "COSBOTS (Copyright Society of Botswana)",
        "code": "COSBOTS",
        "country": "Botswana",
        "iso_country": "BW",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Broadcast Radio",
            "Kwaito & House Airplay",
            "Commercial Venues"
        ],
        "description": "Mandated collective management organization of Botswana administering performing and mechanical rights."
    },
    {
        "id": "somas_eswatini",
        "name": "SWAMA / Eswatini Copyright Society",
        "code": "SWAMA",
        "country": "Eswatini",
        "iso_country": "SZ",
        "region": "Africa",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Airplay Royalties",
            "Live Festivals",
            "Venue Tariffs"
        ],
        "description": "Collects performing royalties for creators in the Kingdom of Eswatini."
    },
    {
        "id": "omda_madagascar",
        "name": "OMDA (Office Malgache du Droit d'Auteur)",
        "code": "OMDA",
        "country": "Madagascar",
        "iso_country": "MG",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Salegy & Malagasy Airplay",
            "National Broadcasts",
            "Mechanicals"
        ],
        "description": "Protects and manages copyrights for the island nation of Madagascar."
    },
    {
        "id": "bcm_mauritius",
        "name": "MASA (Mauritius Society of Authors)",
        "code": "MASA",
        "country": "Mauritius",
        "iso_country": "MU",
        "region": "Africa",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Sega & Tropical Airplay",
            "Hotel & Resort Licensing",
            "Digital Mechanicals"
        ],
        "description": "Represents Mauritian and Indian Ocean creators for domestic and international royalty collection."
    },
    {
        "id": "sacos_seychelles",
        "name": "SACS (Seychelles Authors and Composers Society)",
        "code": "SACS",
        "country": "Seychelles",
        "iso_country": "SC",
        "region": "Africa",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Island Radio & TV",
            "Resort Performances",
            "Mechanicals"
        ],
        "description": "Collects royalties for Seychellois composers and song lyricists."
    },
    {
        "id": "prs_for_music",
        "name": "PRS for Music (Performing Right Society)",
        "code": "PRS",
        "country": "United Kingdom",
        "iso_country": "GB",
        "region": "Europe",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "BBC & Commercial Broadcast",
            "Arena & Club Tours",
            "Digital Streaming",
            "International Reciprocal"
        ],
        "description": "Represents the rights of over 165,000 songwriters, composers, and music publishers in the UK and worldwide."
    },
    {
        "id": "mcps",
        "name": "Mechanical-Copyright Protection Society (MCPS)",
        "code": "MCPS",
        "country": "United Kingdom",
        "iso_country": "GB",
        "region": "Europe",
        "type": "MRO (Mechanical)",
        "payout_frequency": "Monthly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Physical Mechanicals (Vinyl/CD)",
            "Digital Downloads",
            "Sync TV & Film Cues",
            "Broadcast Mechanicals"
        ],
        "description": "Licenses the mechanical reproduction of musical works across recorded media, digital downloads, and broadcast programming."
    },
    {
        "id": "ppl_uk",
        "name": "PPL (Phonographic Performance Limited)",
        "code": "PPL",
        "country": "United Kingdom",
        "iso_country": "GB",
        "region": "Europe",
        "type": "CMO (Neighboring Rights)",
        "payout_frequency": "Annual",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Sound Recording Airplay",
            "Performer Royalties",
            "International Equitable Remuneration"
        ],
        "description": "Collects neighboring rights royalties when recorded music is played in public or broadcast in the UK and internationally."
    },
    {
        "id": "sacem",
        "name": "SACEM (Société des Auteurs, Compositeurs et Éditeurs de Musique)",
        "code": "SACEM",
        "country": "France",
        "iso_country": "FR",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "French Broadcast Radio/TV",
            "Global Streaming",
            "Live Concerts",
            "Private Copying Levies"
        ],
        "description": "World-renowned French author rights society representing over 210,000 creators with €1.4B+ in annual global collections."
    },
    {
        "id": "sdrm",
        "name": "SDRM (Société pour l'Administration du Droit de Reproduction Mécanique)",
        "code": "SDRM",
        "country": "France",
        "iso_country": "FR",
        "region": "Europe",
        "type": "MRO (Mechanical)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Physical Disc Reproduction",
            "Digital Downloads",
            "Audiovisual Media"
        ],
        "description": "Administered by SACEM to oversee mechanical reproduction rights for musical authors across France."
    },
    {
        "id": "gema",
        "name": "GEMA (Gesellschaft für musikalische Aufführungs- und mechanische Vervielfältigungsrechte)",
        "code": "GEMA",
        "country": "Germany",
        "iso_country": "DE",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "German Radio & TV",
            "Live Concerts & Festivals",
            "Physical & Digital Mechanicals",
            "YouTube Compensation"
        ],
        "description": "Represents the copyrights of over 90,000 members in Germany and over two million copyright owners globally."
    },
    {
        "id": "gvl",
        "name": "GVL (Gesellschaft zur Verwertung von Leistungsschutzrechten)",
        "code": "GVL",
        "country": "Germany",
        "iso_country": "DE",
        "region": "Europe",
        "type": "CMO (Neighboring Rights)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Performing Artists Remuneration",
            "Record Label Neighboring Rights",
            "Secondary Exploitation"
        ],
        "description": "One of Europe's largest neighboring rights collecting societies, representing over 160,000 artists and producers."
    },
    {
        "id": "sgae",
        "name": "SGAE (Sociedad General de Autores y Editores)",
        "code": "SGAE",
        "country": "Spain",
        "iso_country": "ES",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Spanish & Latin Radio/TV",
            "Concerts & Theaters",
            "Digital Streaming",
            "Mechanical Rights"
        ],
        "description": "The main collective management organisation for songwriters, composers, and music publishers in Spain."
    },
    {
        "id": "siae",
        "name": "SIAE (Società Italiana degli Autori ed Editori)",
        "code": "SIAE",
        "country": "Italy",
        "iso_country": "IT",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "RAI & Italian Broadcast",
            "Sanremo & Live Tours",
            "Digital Streaming",
            "Mechanicals"
        ],
        "description": "Historic Italian copyright society managing over 100,000 Italian authors, publishers, and international repertoires."
    },
    {
        "id": "soundreef_it",
        "name": "Soundreef Italy",
        "code": "Soundreef IT",
        "country": "Italy & Europe",
        "iso_country": "IT",
        "region": "Europe",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Live Concert Monitoring",
            "Digital DSPs",
            "Radio & Television"
        ],
        "description": "Independent management entity fully recognized under EU directives, collecting royalties for top Italian and global artists."
    },
    {
        "id": "buma_stemra",
        "name": "Buma/Stemra",
        "code": "Buma/Stemra",
        "country": "Netherlands",
        "iso_country": "NL",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "EDM & Dance Festivals",
            "Dutch Broadcast",
            "Digital Mechanicals",
            "Sync Licensing"
        ],
        "description": "The Netherlands society protecting composer, author, and publisher rights with world-leading EDM festival collections."
    },
    {
        "id": "sabam",
        "name": "SABAM (Société des Auteurs, Compositeurs et Editeurs de Belgique)",
        "code": "SABAM",
        "country": "Belgium",
        "iso_country": "BE",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Belgian Radio & TV",
            "Tomorrowland Festival Cues",
            "Mechanical Reproduction"
        ],
        "description": "Belgian multidisciplinary copyright society representing authors and composers across Flanders and Wallonia."
    },
    {
        "id": "suisa",
        "name": "SUISA (Cooperative Society of Music Authors and Publishers)",
        "code": "SUISA",
        "country": "Switzerland",
        "iso_country": "CH",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Swiss Broadcast Airplay",
            "Montreux Jazz Live",
            "Digital Mechanicals"
        ],
        "description": "Collects performing and mechanical royalties for over 40,000 Swiss and Liechtenstein music authors."
    },
    {
        "id": "akm",
        "name": "AKM & Austro-Mechana",
        "code": "AKM",
        "country": "Austria",
        "iso_country": "AT",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "ORF & Austrian Broadcast",
            "Classical & Modern Concerts",
            "Mechanicals"
        ],
        "description": "Administers performing rights (AKM) and mechanical reproduction rights (Austro-Mechana) in Austria."
    },
    {
        "id": "koda",
        "name": "KODA",
        "code": "KODA",
        "country": "Denmark",
        "iso_country": "DK",
        "region": "Europe",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Nordic Broadcast",
            "Roskilde Festival",
            "Digital Streaming Performance"
        ],
        "description": "Non-profit Danish collective society ensuring payment for music creators whenever works are performed."
    },
    {
        "id": "ncb",
        "name": "NCB (Nordic Copyright Bureau)",
        "code": "NCB",
        "country": "Nordic & Baltic Region",
        "iso_country": "DK",
        "region": "Europe",
        "type": "MRO (Mechanical)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Nordic Physical Pressings",
            "Audiovisual Production",
            "Digital Recording Rights"
        ],
        "description": "Operates mechanical rights for Denmark, Finland, Iceland, Norway, Sweden, and Baltic partners."
    },
    {
        "id": "tono",
        "name": "TONO",
        "code": "TONO",
        "country": "Norway",
        "iso_country": "NO",
        "region": "Europe",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "NRK Broadcast",
            "Nordic Streaming Hubs",
            "Concerts & Live Venues"
        ],
        "description": "Norwegian performing rights collective representing over 40,000 composers, lyricists, and publishers."
    },
    {
        "id": "stim",
        "name": "STIM (Svenska Tonsättares Internationella Musikbyrå)",
        "code": "STIM",
        "country": "Sweden",
        "iso_country": "SE",
        "region": "Europe",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Swedish Pop Global Airplay",
            "Spotify Origin Tariffs",
            "Sync & Broadcast"
        ],
        "description": "Administers rights for Sweden's world-leading pop songwriters and international catalogues."
    },
    {
        "id": "teosto",
        "name": "Teosto",
        "code": "Teosto",
        "country": "Finland",
        "iso_country": "FI",
        "region": "Europe",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "YLE Broadcast",
            "Nordic Live Venues",
            "Digital Streaming"
        ],
        "description": "Finnish non-profit performing rights organisation representing over 38,000 authors and publishers."
    },
    {
        "id": "stef",
        "name": "STEF (Samband tónskálda og eigenda flutningsréttar)",
        "code": "STEF",
        "country": "Iceland",
        "iso_country": "IS",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Icelandic Broadcast",
            "Film Score Underscores",
            "Live Concerts"
        ],
        "description": "Performing and mechanical rights society of Iceland."
    },
    {
        "id": "spa",
        "name": "SPA (Sociedade Portuguesa de Autores)",
        "code": "SPA",
        "country": "Portugal",
        "iso_country": "PT",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "RTP Broadcast",
            "Fado & Urban Performances",
            "Mechanical Reproduction"
        ],
        "description": "Founded in 1925, managing author rights for Portuguese songwriters, playwrights, and editors."
    },
    {
        "id": "zaiks",
        "name": "ZAiKS (Stowarzyszenie Autorów ZAiKS)",
        "code": "ZAiKS",
        "country": "Poland",
        "iso_country": "PL",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Polish TV & Radio",
            "Streaming Mechanicals",
            "Concerts & Festivals"
        ],
        "description": "Poland's largest collective society representing over 19,000 Polish authors and world repertoires."
    },
    {
        "id": "artisjus",
        "name": "ARTISJUS",
        "code": "ARTISJUS",
        "country": "Hungary",
        "iso_country": "HU",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Hungarian Broadcast",
            "Sziget Festival Cues",
            "Private Copying"
        ],
        "description": "Hungarian copyright protection association for composers, lyricists, and editors."
    },
    {
        "id": "osa_czech",
        "name": "OSA (Ochranný svaz autorský)",
        "code": "OSA",
        "country": "Czech Republic",
        "iso_country": "CZ",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Czech Radio & TV",
            "Prague Venues",
            "Digital Mechanicals"
        ],
        "description": "Collective rights management society representing Czech and international musical authors."
    },
    {
        "id": "soza",
        "name": "SOZA (Slovenský ochranný zväz autorský)",
        "code": "SOZA",
        "country": "Slovakia",
        "iso_country": "SK",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Slovak Broadcast",
            "Live Concerts",
            "Public Performance"
        ],
        "description": "Slovak author society protecting musical works and intellectual property."
    },
    {
        "id": "sazas",
        "name": "SAZAS",
        "code": "SAZAS",
        "country": "Slovenia",
        "iso_country": "SI",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Slovenian Radio",
            "Concert Licensing",
            "Mechanicals"
        ],
        "description": "Slovenian composers and authors society for collective copyright protection."
    },
    {
        "id": "hds_zamp",
        "name": "HDS ZAMP",
        "code": "HDS ZAMP",
        "country": "Croatia",
        "iso_country": "HR",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Croatian Airplay",
            "Ultra Europe Cues",
            "Hospitality Venues"
        ],
        "description": "Professional association of Croatian composers collecting performing and mechanical royalties."
    },
    {
        "id": "sokoj",
        "name": "SOKOJ (Savez kompozitora Jugoslavije)",
        "code": "SOKOJ",
        "country": "Serbia",
        "iso_country": "RS",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Balkan Broadcast",
            "Exit Festival",
            "Mechanicals"
        ],
        "description": "Organization of music authors in Serbia representing domestic and international catalogues."
    },
    {
        "id": "musicautor",
        "name": "MUSICAUTOR",
        "code": "MUSICAUTOR",
        "country": "Bulgaria",
        "iso_country": "BG",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Bulgarian Airplay",
            "Black Sea Venues",
            "Cable Retransmission"
        ],
        "description": "Bulgarian society of authors and composers for collective copyright administration."
    },
    {
        "id": "ucmr_ada",
        "name": "UCMR-ADA",
        "code": "UCMR-ADA",
        "country": "Romania",
        "iso_country": "RO",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Romanian Broadcast",
            "Untold Festival Cues",
            "Mechanical Reproduction"
        ],
        "description": "Romanian copyright office for musical authors and composers."
    },
    {
        "id": "eaou_greece",
        "name": "EDIDEM / AUTODIA",
        "code": "AUTODIA",
        "country": "Greece",
        "iso_country": "GR",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Greek Radio & Television",
            "Islands Tourism Venues",
            "Digital Streaming"
        ],
        "description": "Primary collective management society for music authors and publishers in Greece."
    },
    {
        "id": "eao_cyprus",
        "name": "CCRA (Cyprus Copyright Rights Agency)",
        "code": "CCRA",
        "country": "Cyprus",
        "iso_country": "CY",
        "region": "Europe",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Broadcast Airplay",
            "Hospitality Venues",
            "General Licensing"
        ],
        "description": "Administers performance rights in Cyprus."
    },
    {
        "id": "imro",
        "name": "IMRO (Irish Recorded Music Organisation / Irish Music Rights Organisation)",
        "code": "IMRO",
        "country": "Ireland",
        "iso_country": "IE",
        "region": "Europe",
        "type": "PRO (Performance)",
        "payout_frequency": "Monthly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "RTE & Irish Broadcast",
            "Live Concerts",
            "Global Digital Licensing"
        ],
        "description": "Administers performing rights in Ireland for songwriters, composers, and publishers."
    },
    {
        "id": "mcps_ireland",
        "name": "MCPS Ireland",
        "code": "MCPS-IE",
        "country": "Ireland",
        "iso_country": "IE",
        "region": "Europe",
        "type": "MRO (Mechanical)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Irish Mechanicals",
            "Broadcaster Reproduction",
            "Physical Pressings"
        ],
        "description": "Licenses mechanical rights on behalf of publishers and songwriters across the Republic of Ireland."
    },
    {
        "id": "akka_laa",
        "name": "AKKA/LAA",
        "code": "AKKA/LAA",
        "country": "Latvia",
        "iso_country": "LV",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Baltic Broadcast",
            "Concerts",
            "Mechanicals"
        ],
        "description": "Latvian authors' and communications copyright consulting agency."
    },
    {
        "id": "latga",
        "name": "LATGA",
        "code": "LATGA",
        "country": "Lithuania",
        "iso_country": "LT",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Lithuanian Radio/TV",
            "Live Venues",
            "Private Copying"
        ],
        "description": "Association of Lithuanian copyright protection administering performing and mechanical rights."
    },
    {
        "id": "eaü_estonia",
        "name": "EAÜ (Eesti Autorite Ühing)",
        "code": "EAÜ",
        "country": "Estonia",
        "iso_country": "EE",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Estonian Digital Hubs",
            "Broadcast Airplay",
            "Concert Licensing"
        ],
        "description": "Estonian Authors' Society collecting royalties across Northern and Eastern Europe."
    },
    {
        "id": "zamp_macedonia",
        "name": "ZAMP Macedonia",
        "code": "ZAMP-MK",
        "country": "North Macedonia",
        "iso_country": "MK",
        "region": "Europe",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Broadcast Airplay",
            "Live Events"
        ],
        "description": "Performing rights collective of North Macedonia."
    },
    {
        "id": "alba_albania",
        "name": "ALBAUTOR",
        "code": "ALBAUTOR",
        "country": "Albania",
        "iso_country": "AL",
        "region": "Europe",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Tirana Broadcast",
            "Venues",
            "Mechanicals"
        ],
        "description": "Albanian author society managing music copyrights."
    },
    {
        "id": "pamg_montenegro",
        "name": "PAM CG (Prava autora muzike Crne Gore)",
        "code": "PAM CG",
        "country": "Montenegro",
        "iso_country": "ME",
        "region": "Europe",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Adriatic Airplay",
            "Coastal Venues",
            "Live Performances"
        ],
        "description": "Music authors rights organization of Montenegro."
    },
    {
        "id": "apra_amcos",
        "name": "APRA AMCOS (Australasian Performing Right Association & AMCOS)",
        "code": "APRA AMCOS",
        "country": "Australia & New Zealand",
        "iso_country": "AU",
        "region": "Asia-Pacific",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Triple J & Commercial Radio",
            "Arena Tours",
            "DSP Mechanicals & Performance",
            "Asia Licensing"
        ],
        "description": "Represents 115,000+ songwriters, composers, and music publishers across Australia, New Zealand, and South Pacific."
    },
    {
        "id": "jasrac",
        "name": "JASRAC (Japanese Society for Rights of Authors, Composers and Publishers)",
        "code": "JASRAC",
        "country": "Japan",
        "iso_country": "JP",
        "region": "Asia-Pacific",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "J-Pop Broadcast",
            "Anime & Gaming Underscores",
            "Karaoke Licensing",
            "CD & Digital Mechanicals"
        ],
        "description": "One of the world's highest-grossing author societies, managing copyright for Japan's massive domestic music market."
    },
    {
        "id": "nextone",
        "name": "NexTone Inc.",
        "code": "NexTone",
        "country": "Japan",
        "iso_country": "JP",
        "region": "Asia-Pacific",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Monthly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Digital Streaming",
            "YouTube Content Management",
            "Anime Sync"
        ],
        "description": "Modern competitive copyright administration entity in Japan with fast-growing share in digital and gaming licensing."
    },
    {
        "id": "komca",
        "name": "KOMCA (Korea Music Copyright Association)",
        "code": "KOMCA",
        "country": "South Korea",
        "iso_country": "KR",
        "region": "Asia-Pacific",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Monthly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "K-Pop Global Streaming",
            "Korean TV Dramas (OST)",
            "Karaoke (Noraebang)",
            "Physical Sales"
        ],
        "description": "Administers rights for South Korea's global K-Pop industry with over 45,000 songwriter and composer members."
    },
    {
        "id": "koscap",
        "name": "KOSCAP (Korean Society of Composers, Authors and Publishers)",
        "code": "KOSCAP",
        "country": "South Korea",
        "iso_country": "KR",
        "region": "Asia-Pacific",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Digital Media Airplay",
            "Broadcast TV",
            "Live Shows"
        ],
        "description": "Alternative collective management organization in South Korea for indie and alternative composers."
    },
    {
        "id": "cash_hk",
        "name": "CASH (Composers and Authors Society of Hong Kong)",
        "code": "CASH",
        "country": "Hong Kong",
        "iso_country": "HK",
        "region": "Asia-Pacific",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Cantopop Airplay",
            "Film Soundtracks",
            "Regional Asian Sync"
        ],
        "description": "Administers musical performing and mechanical reproduction rights in Hong Kong and Macau."
    },
    {
        "id": "mcsc_china",
        "name": "MCSC (Music Copyright Society of China)",
        "code": "MCSC",
        "country": "China",
        "iso_country": "CN",
        "region": "Asia-Pacific",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Tencent & NetEase Streaming",
            "CCTV & National TV",
            "Short-Form Video (Douyin)",
            "Concerts"
        ],
        "description": "The only authorized music copyright collective management organisation in mainland China."
    },
    {
        "id": "must_taiwan",
        "name": "MUST (Music Copyright Society of Chinese Taipei)",
        "code": "MUST",
        "country": "Taiwan",
        "iso_country": "TW",
        "region": "Asia-Pacific",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Mandopop Airplay",
            "Digital DSPs (KKBOX)",
            "Live Tours"
        ],
        "description": "Represents Chinese Taipei composers and lyricists in the vibrant Mandopop market."
    },
    {
        "id": "macp_malaysia",
        "name": "MACP (Music Authors' Copyright Protection)",
        "code": "MACP",
        "country": "Malaysia",
        "iso_country": "MY",
        "region": "Asia-Pacific",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Astro & Media Prima Broadcast",
            "Digital Media",
            "Hospitality Licensing"
        ],
        "description": "Protects and manages performing rights for Malaysian composers, lyricists, and publishers."
    },
    {
        "id": "wami_indonesia",
        "name": "WAMI (Wahana Musik Indonesia)",
        "code": "WAMI",
        "country": "Indonesia",
        "iso_country": "ID",
        "region": "Asia-Pacific",
        "type": "PRO (Performance)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Indonesian Radio & TV",
            "Digital DSPs",
            "Karaoke Bars & Live Venues"
        ],
        "description": "Collective management organisation administering performing rights across the world's 4th most populous nation."
    },
    {
        "id": "kci_indonesia",
        "name": "KCI (Karya Cipta Indonesia)",
        "code": "KCI",
        "country": "Indonesia",
        "iso_country": "ID",
        "region": "Asia-Pacific",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Traditional Airplay",
            "Commercial Venues"
        ],
        "description": "Pioneering author copyright association in Indonesia."
    },
    {
        "id": "compass_sg",
        "name": "COMPASS (Composers and Authors Society of Singapore)",
        "code": "COMPASS",
        "country": "Singapore",
        "iso_country": "SG",
        "region": "Asia-Pacific",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Mediacorp Broadcast",
            "Marina Bay & F1 Events",
            "Regional Digital Hub Licensing"
        ],
        "description": "Non-profit society managing performing, mechanical, and synchronization rights in Singapore."
    },
    {
        "id": "filscap",
        "name": "FILSCAP (Filipino Society of Composers, Authors and Publishers)",
        "code": "FILSCAP",
        "country": "Philippines",
        "iso_country": "PH",
        "region": "Asia-Pacific",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "OPM (Original Pilipino Music) Airplay",
            "Broadcast TV",
            "Karaoke & Mall Licensing"
        ],
        "description": "Sole government-accredited collective management organization for musical works in the Philippines."
    },
    {
        "id": "mct_thailand",
        "name": "MCT (Music Copyright (Thailand) Co., Ltd.)",
        "code": "MCT",
        "country": "Thailand",
        "iso_country": "TH",
        "region": "Asia-Pacific",
        "type": "PRO (Performance)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "T-Pop Broadcast Airplay",
            "Bangkok Live Venues",
            "Digital DSPs"
        ],
        "description": "CISAC-affiliated performing rights society representing Thai and international composers."
    },
    {
        "id": "vcpmc",
        "name": "VCPMC (Vietnam Center for Protection of Music Copyright)",
        "code": "VCPMC",
        "country": "Vietnam",
        "iso_country": "VN",
        "region": "Asia-Pacific",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "VTV Broadcast",
            "Zing MP3 Licensing",
            "Coffee Shops & Hospitality"
        ],
        "description": "Administers performing and mechanical rights across Vietnam's rapidly growing digital market."
    },
    {
        "id": "iprs_india",
        "name": "IPRS (The Indian Performing Right Society Limited)",
        "code": "IPRS",
        "country": "India",
        "iso_country": "IN",
        "region": "Asia-Pacific",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Bollywood Film & Sync",
            "JioSaavn & Gaana Streaming",
            "Radio & TV Networks",
            "Public Events"
        ],
        "description": "Sole copyright society registered under the Copyright Act of India for musical and literary work authors."
    },
    {
        "id": "ppl_india",
        "name": "PPL India (Phonographic Performance Limited India)",
        "code": "PPL India",
        "country": "India",
        "iso_country": "IN",
        "region": "Asia-Pacific",
        "type": "CMO (Neighboring Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Sound Recording Broadcasting",
            "Public Performance",
            "Event Venues"
        ],
        "description": "Administers the public performance and broadcast rights of music labels and producers across India."
    },
    {
        "id": "slam_srilanka",
        "name": "OSCA / SLAMP (Sri Lanka Authors and Music Publishers)",
        "code": "OSCA",
        "country": "Sri Lanka",
        "iso_country": "LK",
        "region": "Asia-Pacific",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Sinhala & Tamil Airplay",
            "National Broadcast",
            "Live Venues"
        ],
        "description": "Represents musical creators and lyricists in Sri Lanka."
    },
    {
        "id": "bcs_bangladesh",
        "name": "BCS (Bangladesh Copyright Society)",
        "code": "BCS",
        "country": "Bangladesh",
        "iso_country": "BD",
        "region": "Asia-Pacific",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Bangla Music Airplay",
            "Telecoms Ringtone Fees",
            "Broadcast TV"
        ],
        "description": "Oversees author and composer rights in Bangladesh."
    },
    {
        "id": "cos_pakistan",
        "name": "Coke Studio / CAMP (Composers and Authors Guild of Pakistan)",
        "code": "CAMP",
        "country": "Pakistan",
        "iso_country": "PK",
        "region": "Asia-Pacific",
        "type": "PRO (Performance)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Sufi & Coke Studio Broadcast",
            "Pakistani TV Serials (OST)",
            "Digital Media"
        ],
        "description": "Collective entity representing Pakistani musical arrangers and classical/pop composers."
    },
    {
        "id": "moscap_mongolia",
        "name": "MOSCAP (Mongolian Society of Authors, Composers and Publishers)",
        "code": "MOSCAP",
        "country": "Mongolia",
        "iso_country": "MN",
        "region": "Asia-Pacific",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Folk & Metal Broadcast",
            "Ulaanbaatar Live Venues"
        ],
        "description": "Protects performing and mechanical rights in Mongolia."
    },
    {
        "id": "kazak_authors",
        "name": "KazAK (Kazakh Authors Society)",
        "code": "KazAK",
        "country": "Kazakhstan",
        "iso_country": "KZ",
        "region": "Asia-Pacific",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Central Asian Broadcast",
            "Public Performance",
            "Mechanicals"
        ],
        "description": "Administers copyright and related rights in Kazakhstan and Central Asia."
    },
    {
        "id": "apra_fiji",
        "name": "FPRA (Fiji Performing Rights Association)",
        "code": "FPRA",
        "country": "Fiji & South Pacific",
        "iso_country": "FJ",
        "region": "Asia-Pacific",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Island Airplay",
            "Resort Performances",
            "Fijian Music Awards Cues"
        ],
        "description": "Collects performing royalties for indigenous Fijian and Pacific Island composers."
    },
    {
        "id": "macau_maca",
        "name": "MACA (Macau Association of Composers, Authors & Publishers)",
        "code": "MACA",
        "country": "Macau",
        "iso_country": "MO",
        "region": "Asia-Pacific",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Casino & Resort Entertainment",
            "Local Radio & TV",
            "Concert Venues"
        ],
        "description": "Collects music royalties in the gaming and hospitality hub of Macau."
    },
    {
        "id": "brunei_music",
        "name": "Brunei Copyright Authority",
        "code": "BruCopyright",
        "country": "Brunei",
        "iso_country": "BN",
        "region": "Asia-Pacific",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Radio Televisyen Brunei Airplay",
            "Public Performance"
        ],
        "description": "Intellectual property office administering copyright in Brunei Darussalam."
    },
    {
        "id": "sacm_mexico",
        "name": "SACM (Sociedad de Autores y Compositores de México)",
        "code": "SACM",
        "country": "Mexico",
        "iso_country": "MX",
        "region": "Latin America",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Televisa & TV Azteca Broadcast",
            "Regional Mexican & Latin Pop",
            "DSP Streaming",
            "Sync Underscores"
        ],
        "description": "Powerhouse society representing over 30,000 Mexican composers across Latin America's largest music market."
    },
    {
        "id": "ubc_brazil",
        "name": "UBC (União Brasileira de Compositores)",
        "code": "UBC",
        "country": "Brazil",
        "iso_country": "BR",
        "region": "Latin America",
        "type": "PRO (Performance)",
        "payout_frequency": "Monthly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "ECAD Central Pool Distribution",
            "Samba & Funk Carioca",
            "Globo Broadcast",
            "Carnaval Licensing"
        ],
        "description": "Brazil's leading author society, channeling collections through the unified ECAD central office."
    },
    {
        "id": "abramus_brazil",
        "name": "ABRAMUS (Associação Brasileira de Música e Artes)",
        "code": "ABRAMUS",
        "country": "Brazil",
        "iso_country": "BR",
        "region": "Latin America",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Monthly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "ECAD Royalties",
            "Sertanejo & Pop Broadcast",
            "Digital DSPs",
            "Neighboring Rights"
        ],
        "description": "Major Brazilian association managing both author rights and performer/producer neighboring rights."
    },
    {
        "id": "amar_brazil",
        "name": "AMAR (Associação de Músicos, Arranjadores e Regentes)",
        "code": "AMAR",
        "country": "Brazil",
        "iso_country": "BR",
        "region": "Latin America",
        "type": "PRO (Performance)",
        "payout_frequency": "Monthly",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "ECAD Playlists",
            "Orchestral & MPB Arrangers"
        ],
        "description": "Brazilian association dedicated to arrangers, conductors, and recording musicians."
    },
    {
        "id": "sayco_colombia",
        "name": "SAYCO (Sociedad de Autores y Compositores de Colombia)",
        "code": "SAYCO",
        "country": "Colombia",
        "iso_country": "CO",
        "region": "Latin America",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Reggaeton & Vallenato Airplay",
            "Caracol & RCN Television",
            "Feria & Concert Licensing"
        ],
        "description": "Represents Colombian songwriters and international repertoires across the powerhouse Colombian urban scene."
    },
    {
        "id": "acinpro_colombia",
        "name": "ACINPRO (Asociación Colombiana de Intérpretes y Productores)",
        "code": "ACINPRO",
        "country": "Colombia",
        "iso_country": "CO",
        "region": "Latin America",
        "type": "CMO (Neighboring Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Producer Master Share",
            "Featured Performer Play",
            "Broadcast Retransmission"
        ],
        "description": "Manages neighboring rights for performers and phonogram producers in Colombia."
    },
    {
        "id": "sadaic_argentina",
        "name": "SADAIC (Sociedad Argentina de Autores y Compositores de Música)",
        "code": "SADAIC",
        "country": "Argentina",
        "iso_country": "AR",
        "region": "Latin America",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Argentine Rock & Trap Airplay",
            "Tango Heritage",
            "Live Shows & Stadium Tours",
            "Mechanicals"
        ],
        "description": "Historic Argentine copyright society founded in 1936, protecting composers, authors, and heirs."
    },
    {
        "id": "scd_chile",
        "name": "SCD (Sociedad Chilena del Derecho de Autor)",
        "code": "SCD",
        "country": "Chile",
        "iso_country": "CL",
        "region": "Latin America",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Chilean Radio Quota (20%)",
            "Viña del Mar Festival",
            "Digital Streaming",
            "Mechanicals"
        ],
        "description": "Pioneering collective society in Chile managing digital streaming tariffs and domestic radio quotas."
    },
    {
        "id": "apdayc_peru",
        "name": "APDAYC (Asociación Peruana de Autores y Compositores)",
        "code": "APDAYC",
        "country": "Peru",
        "iso_country": "PE",
        "region": "Latin America",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Cumbia & Criollo Airplay",
            "Peruvian Radio/TV",
            "Concerts"
        ],
        "description": "Peruvian authors association collecting performing and mechanical royalties."
    },
    {
        "id": "agadu_uruguay",
        "name": "AGADU (Asociación General de Autores del Uruguay)",
        "code": "AGADU",
        "country": "Uruguay",
        "iso_country": "UY",
        "region": "Latin America",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Candombe & Rock Airplay",
            "Montevideo Theaters",
            "Digital Streaming"
        ],
        "description": "General association of authors in Uruguay founded in 1929."
    },
    {
        "id": "apa_paraguay",
        "name": "APA (Autores Paraguayos Asociados)",
        "code": "APA",
        "country": "Paraguay",
        "iso_country": "PY",
        "region": "Latin America",
        "type": "PRO (Performance)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Guarania & Polka Airplay",
            "National Broadcasts",
            "Live Festivals"
        ],
        "description": "The oldest collective rights society in Paraguay."
    },
    {
        "id": "sobodaycom_bolivia",
        "name": "SOBODAYCOM (Sociedad Boliviana de Autores y Compositores)",
        "code": "SOBODAYCOM",
        "country": "Bolivia",
        "iso_country": "BO",
        "region": "Latin America",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Andean Folklore",
            "Broadcast Radio",
            "Carnaval de Oruro"
        ],
        "description": "Collects performing royalties for Bolivian musical creators."
    },
    {
        "id": "sayce_ecuador",
        "name": "SAYCE (Sociedad de Autores y Compositores del Ecuador)",
        "code": "SAYCE",
        "country": "Ecuador",
        "iso_country": "EC",
        "region": "Latin America",
        "type": "PRO (Performance)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Pasillo & Urban Airplay",
            "Ecuadorian TV",
            "Concert Licensing"
        ],
        "description": "Represents author performing rights across Ecuador."
    },
    {
        "id": "acam_costarica",
        "name": "ACAM (Asociación de Compositores y Autores Musicales de Costa Rica)",
        "code": "ACAM",
        "country": "Costa Rica",
        "iso_country": "CR",
        "region": "Latin America",
        "type": "PRO (Performance)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Central American Broadcast",
            "Hospitality & Tourism Venues",
            "Digital Media"
        ],
        "description": "Protects musical author rights across Costa Rica."
    },
    {
        "id": "sacven_venezuela",
        "name": "SACVEN (Sociedad de Autores y Compositores de Venezuela)",
        "code": "SACVEN",
        "country": "Venezuela",
        "iso_country": "VE",
        "region": "Latin America",
        "type": "PRO (Performance)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Salsa & Llanera Broadcast",
            "National Radio",
            "Mechanicals"
        ],
        "description": "Administers performing rights in Venezuela."
    },
    {
        "id": "cott_trinidad",
        "name": "COTT (Copyright Music Organisation of Trinidad and Tobago)",
        "code": "COTT",
        "country": "Trinidad and Tobago & Caribbean",
        "iso_country": "TT",
        "region": "Latin America",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Soca & Calypso Airplay",
            "Carnival Mas Bands",
            "Caribbean Sync & DSPs"
        ],
        "description": "The premier copyright music organisation in the Caribbean for soca, chutney, and steelband."
    },
    {
        "id": "jacap_jamaica",
        "name": "JACAP (Jamaica Association of Composers, Authors and Publishers)",
        "code": "JACAP",
        "country": "Jamaica",
        "iso_country": "JM",
        "region": "Latin America",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Reggae & Dancehall Broadcast",
            "Sound System Dances",
            "International Reggae Festivals"
        ],
        "description": "Represents Jamaica's legendary reggae and dancehall songwriters and publishers worldwide."
    },
    {
        "id": "sgae_cuba",
        "name": "ACDAM (Agencia Cubana de Derecho de Autor Musical)",
        "code": "ACDAM",
        "country": "Cuba",
        "iso_country": "CU",
        "region": "Latin America",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Son Cubano & Timba Broadcast",
            "Tourism Venues",
            "State Radio & TV"
        ],
        "description": "Cuban state agency administering musical author rights and international reciprocal agreements."
    },
    {
        "id": "sgacd_dominican",
        "name": "SGACEDOM (Sociedad General de Autores, Compositores y Editores de Música)",
        "code": "SGACEDOM",
        "country": "Dominican Republic",
        "iso_country": "DO",
        "region": "Latin America",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Bachata & Merengue Airplay",
            "Dembow Digital Streams",
            "Resort & Hotel Tariffs"
        ],
        "description": "Dominican author society collecting royalties for the global bachata, merengue, and dembow genres."
    },
    {
        "id": "coscap_barbados",
        "name": "COSCAP (Copyright Society of Composers, Authors and Publishers)",
        "code": "COSCAP",
        "country": "Barbados",
        "iso_country": "BB",
        "region": "Latin America",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Crop Over Festival",
            "Caribbean Broadcast",
            "Tourism Venues"
        ],
        "description": "Collects performing and mechanical royalties in Barbados."
    },
    {
        "id": "spac_panama",
        "name": "SPAC (Sociedad Panameña de Autores y Compositores)",
        "code": "SPAC",
        "country": "Panama",
        "iso_country": "PA",
        "region": "Latin America",
        "type": "PRO (Performance)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Plena & Reggaeton Origins",
            "Panama Radio & TV",
            "Concert Licensing"
        ],
        "description": "Administers performing rights in Panama, birthplace of Spanish reggae."
    },
    {
        "id": "sgae_puertorico",
        "name": "SGAE / ASCAP Puerto Rico Chapter",
        "code": "PR-PRO",
        "country": "Puerto Rico",
        "iso_country": "PR",
        "region": "Latin America",
        "type": "PRO (Performance)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Urbano & Salsa Airplay",
            "San Juan Coliseo Arena Tours",
            "Digital Streaming"
        ],
        "description": "Administers performance rights in Puerto Rico under US statutory framework and regional licensing."
    },
    {
        "id": "aei_guatemala",
        "name": "AEI Guatemala (Asociación de Autores, Compositores e Intérpretes)",
        "code": "AEI",
        "country": "Guatemala",
        "iso_country": "GT",
        "region": "Latin America",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Marimba & Pop Airplay",
            "National Radio",
            "Concert Licensing"
        ],
        "description": "Collective society for Guatemalan music creators."
    },
    {
        "id": "aacim_honduras",
        "name": "AACIMH (Asociación de Autores, Compositores e Intérpretes de Honduras)",
        "code": "AACIMH",
        "country": "Honduras",
        "iso_country": "HN",
        "region": "Latin America",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Punta & Broadcast Airplay",
            "Commercial Venues"
        ],
        "description": "Collects royalties for Honduran musical authors."
    },
    {
        "id": "asap_elsalvador",
        "name": "ASAP (Asociación Salvadoreña de Autores y Compositores)",
        "code": "ASAP",
        "country": "El Salvador",
        "iso_country": "SV",
        "region": "Latin America",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Broadcast Radio",
            "Commercial Venues",
            "Live Performances"
        ],
        "description": "Administers author rights in El Salvador."
    },
    {
        "id": "esmaa_uae",
        "name": "ESMAA Music Licensing (PopArabia Hub)",
        "code": "ESMAA",
        "country": "United Arab Emirates & Gulf States",
        "iso_country": "AE",
        "region": "Middle East",
        "type": "Digital Licensing Hub",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "MENA Digital Streaming (Anghami/Spotify)",
            "Dubai & Abu Dhabi Venues",
            "Broadcast TV"
        ],
        "description": "Leading rights management entity in the Middle East representing major global repertoires and regional Arab artists."
    },
    {
        "id": "sacem_lebanon",
        "name": "SACEM Representation in Lebanon & Levant",
        "code": "SACEM-LB",
        "country": "Lebanon",
        "iso_country": "LB",
        "region": "Middle East",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": False,
        "collection_types": [
            "Levant Radio & TV",
            "Beirut Festivals",
            "Digital Mechanicals"
        ],
        "description": "Historical regional office administering copyright for Lebanese composers and pan-Arab productions."
    },
    {
        "id": "sacer_egypt",
        "name": "SACER (Société des Auteurs, Compositeurs et Éditeurs de la République d'Egypte)",
        "code": "SACER",
        "country": "Egypt",
        "iso_country": "EG",
        "region": "Middle East",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Egyptian Cinema Sync Cues",
            "Mahraganat & Pop Airplay",
            "Nile Television"
        ],
        "description": "One of the oldest author rights societies in the Arab world, managing Egypt's massive film and musical catalog."
    },
    {
        "id": "otav_tunisia",
        "name": "OTDAV (Organisme Tunisien des Droits d'Auteur et des Droits Voisins)",
        "code": "OTDAV",
        "country": "Tunisia",
        "iso_country": "TN",
        "region": "Middle East",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Carthage Festival",
            "Tunisian Radio & TV",
            "Private Copying Levies"
        ],
        "description": "Tunisian public organization managing author and neighboring rights."
    },
    {
        "id": "acum_israel",
        "name": "ACUM (Society of Authors, Composers and Music Publishers in Israel)",
        "code": "ACUM",
        "country": "Israel",
        "iso_country": "IL",
        "region": "Middle East",
        "type": "CMO (Full Rights)",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Kan & Galgalatz Broadcast",
            "Tel Aviv Live Shows",
            "Mechanicals & Digital"
        ],
        "description": "Non-profit corporation administering musical, literary, and dramatic copyrights in Israel."
    },
    {
        "id": "jordan_authors",
        "name": "National Library & Copyright Directorate of Jordan",
        "code": "JordanCD",
        "country": "Jordan",
        "iso_country": "JO",
        "region": "Middle East",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Amman Broadcast Airplay",
            "Commercial Venues"
        ],
        "description": "Administers copyright and collective enforcement in Jordan."
    },
    {
        "id": "qatar_ip",
        "name": "Qatar Intellectual Property Center",
        "code": "QatarIP",
        "country": "Qatar",
        "iso_country": "QA",
        "region": "Middle East",
        "type": "Digital Licensing Hub",
        "payout_frequency": "Semi-Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Al Jazeera & BeIN Broadcast Sync",
            "Stadium Events",
            "Hospitality Licensing"
        ],
        "description": "Oversees intellectual property and broadcast music clearance in Qatar."
    },
    {
        "id": "saudi_saip",
        "name": "SAIP (Saudi Authority for Intellectual Property)",
        "code": "SAIP",
        "country": "Saudi Arabia",
        "iso_country": "SA",
        "region": "Middle East",
        "type": "Digital Licensing Hub",
        "payout_frequency": "Quarterly",
        "direct_integration": True,
        "popular": True,
        "collection_types": [
            "Riyadh Season Concerts",
            "MDLBEAST Festival Cues",
            "MBC Broadcast",
            "Digital Media"
        ],
        "description": "Fast-growing entertainment hub authority licensing major international festivals and broadcast networks."
    },
    {
        "id": "kuwait_copyright",
        "name": "Kuwait National Copyright Authority",
        "code": "KuwaitCA",
        "country": "Kuwait",
        "iso_country": "KW",
        "region": "Middle East",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Khaleeji Airplay",
            "Kuwait TV",
            "Public Performances"
        ],
        "description": "Administers author rights in the State of Kuwait."
    },
    {
        "id": "bahrain_ip",
        "name": "Bahrain Directorate of Foreign Trade & IP",
        "code": "BahrainIP",
        "country": "Bahrain",
        "iso_country": "BH",
        "region": "Middle East",
        "type": "PRO (Performance)",
        "payout_frequency": "Annual",
        "direct_integration": False,
        "popular": False,
        "collection_types": [
            "Broadcast Airplay",
            "Commercial Venues"
        ],
        "description": "Oversees copyright administration in the Kingdom of Bahrain."
    }
]

def get_society_by_id(society_id: str):
    return next((s for s in ALL_SUPPORTED_SOCIETIES if s["id"] == society_id), None)

def get_societies_by_region(region: str):
    if not region or region.lower() == "all":
        return ALL_SUPPORTED_SOCIETIES
    return [s for s in ALL_SUPPORTED_SOCIETIES if s["region"].lower() == region.lower()]
