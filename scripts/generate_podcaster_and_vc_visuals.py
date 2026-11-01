# Python visual asset generator for Podcaster and VC targeted persona images
import os
import math
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = os.path.abspath(r'apps/portal/src/assets/images')
os.makedirs(OUT_DIR, exist_ok=True)

FONT_PATH = 'C:/Windows/Fonts/segoeui.ttf'
FONT_BOLD_PATH = 'C:/Windows/Fonts/segoeuib.ttf'

f_xs = ImageFont.truetype(FONT_PATH, 16)
f_sm = ImageFont.truetype(FONT_PATH, 20)
f_md = ImageFont.truetype(FONT_PATH, 26)
f_lg = ImageFont.truetype(FONT_BOLD_PATH, 34)
f_xl = ImageFont.truetype(FONT_BOLD_PATH, 44)
f_xxl = ImageFont.truetype(FONT_BOLD_PATH, 54)
f_badge = ImageFont.truetype(FONT_BOLD_PATH, 16)

def create_canvas(w=1600, h=1000, start_col=(8, 14, 28), end_col=(3, 6, 14)):
    im = Image.new('RGB', (w, h), start_col)
    draw = ImageDraw.Draw(im)
    for y in range(h):
        r = y / h
        c = (
            int(start_col[0] * (1 - r) + end_col[0] * r),
            int(start_col[1] * (1 - r) + end_col[1] * r),
            int(start_col[2] * (1 - r) + end_col[2] * r)
        )
        draw.line([(0, y), (w, y)], fill=c)
    overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    for x in range(0, w, 50):
        odraw.line([(x, 0), (x, h)], fill=(255, 255, 255, 8), width=1)
    for y in range(0, h, 50):
        odraw.line([(0, y), (w, y)], fill=(255, 255, 255, 8), width=1)
    im.paste(overlay, (0, 0), overlay)
    return im

def draw_pill(canvas, box, text, border_col=(0, 242, 254), bg_col=(0, 242, 254, 35), txt_col=(0, 242, 254)):
    overlay = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    odraw.rounded_rectangle(box, radius=6, fill=bg_col, outline=border_col, width=1)
    tb = f_badge.getbbox(text)
    tw = tb[2] - tb[0]
    th = tb[3] - tb[1]
    odraw.text((box[0] + (box[2] - box[0] - tw) // 2, box[1] + (box[3] - box[1] - th) // 2 - 2), text, fill=txt_col, font=f_badge)
    canvas.paste(overlay, (0, 0), overlay)

def draw_card(canvas, box, fill_col=(15, 23, 42, 230), border_col=(255, 255, 255, 25), radius=12):
    overlay = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    odraw.rounded_rectangle(box, radius=radius, fill=fill_col, outline=border_col, width=1)
    canvas.paste(overlay, (0, 0), overlay)

# ==================== 1. PODCASTER HERO 1: Studio Setup & Episode Ingestion ====================
def gen_podcaster_1():
    im = create_canvas(1600, 1000, (6, 18, 30), (2, 8, 16))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 560, 108), 'TUNEPOD · STUDIO PODCAST HOSTING & EPISODE INGESTION', (0, 242, 254), (0, 242, 254, 35), (0, 242, 254))
    draw.text((80, 126), 'Multi-Track Podcast Recording & AI Speech Mastering', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'Professional audio hosting for African and global creators. Shure broadcast presets, auto-leveling (-16 LUFS), and noise cleanup.', fill=(148, 163, 184), font=f_sm)

    # 4 Cards: Studio Metrics
    kpis = [
        ('TOTAL MONTHLY LISTENERS', '185,400 Downloads', '+34.2% Growth MoM', (0, 242, 254)),
        ('SPEECH LOUDNESS PROFILE', '-16.0 LUFS Standard', 'EBU R128 Compliant', (16, 185, 129)),
        ('EPISODES INGESTED', '48 Full Episodes', 'Lossless WAV & MP3', (168, 85, 247)),
        ('AI CHAPTER ACCURACY', '99.4% Topic Detection', 'Auto-Timestamped', (245, 158, 11))
    ]
    for i, (lbl, val, sub, col) in enumerate(kpis):
        x = 80 + i * 365
        draw_card(im, (x, 240, x + 340, 360))
        draw.text((x + 20, 258), lbl, fill=(148, 163, 184), font=f_xs)
        draw.text((x + 20, 284), val, fill=col, font=f_lg)
        draw.text((x + 20, 326), sub, fill=(100, 116, 139), font=f_xs)

    # Left: Multi-Track Console
    draw_card(im, (80, 390, 850, 920))
    draw.text((110, 416), 'RODECaster Pro & Shure SM7B Multi-Host Strips', fill=(255, 255, 255), font=f_md)
    tracks = [
        ('Host Mic 1: Lead Presenter', 'Shure SM7B · High-Pass Filter ON · Gate -48dB', 'Live Level: -14 LUFS', (0, 242, 254)),
        ('Host Mic 2: Co-Presenter', 'Shure SM7B · De-Esser Active · Comp 3:1', 'Live Level: -16 LUFS', (16, 185, 129)),
        ('Remote Guest (Nairobi / London)', '24-Bit Clean WebRTC Remote Feed · 48kHz', 'Live Level: -15 LUFS', (168, 85, 247)),
        ('Soundboard & Stems Bed', 'Intro Stems, Sound FX, Mid-Roll Audio Beds', 'Live Level: -20 LUFS', (245, 158, 11)),
    ]
    ty = 470
    for name, spec, lvl, col in tracks:
        draw_card(im, (110, ty, 820, ty + 90), fill_col=(255, 255, 255, 8), border_col=(255, 255, 255, 16))
        draw.text((130, ty + 16), name, fill=(255, 255, 255), font=f_sm)
        draw.text((130, ty + 46), spec, fill=(148, 163, 184), font=f_xs)
        draw_pill(im, (640, ty + 25, 800, ty + 65), lvl, col, (col[0], col[1], col[2], 25), col)
        ty += 105

    # Right: AI Speech Mastering Suite
    draw_card(im, (880, 390, 1520, 920))
    draw.text((910, 416), 'Automated Speech Mastering & Chapter Markers', fill=(255, 255, 255), font=f_md)
    draw.text((910, 456), 'MasterLab AI automatically normalizes conversational dynamics, strips mouth clicks and room echo, and writes interactive MP3 ID3 chapters.', fill=(148, 163, 184), font=f_xs)
    chapters = [
        ('00:00 · Introduction & Nairobi Tech Scene Overview', 'Topic: Early-stage African audio growth', (0, 242, 254)),
        ('12:45 · How Music Creators Monetize Sync Briefs', 'Topic: SyncMavens sync placement economics', (16, 185, 129)),
        ('28:10 · Tour Advances & Senior Secured Debt Facilities', 'Topic: Tune Capital VC underwriting models', (168, 85, 247)),
        ('44:30 · Wrap-Up, Fan Q&A & M-Pesa Super-Tipping', 'Topic: Split Cascade direct wallet settlement', (245, 158, 11))
    ]
    cy = 510
    for ch, top, col in chapters:
        draw_card(im, (910, cy, 1490, cy + 80), fill_col=(255, 255, 255, 8), border_col=(255, 255, 255, 16))
        draw.text((930, cy + 14), ch, fill=col, font=f_sm)
        draw.text((930, cy + 42), top, fill=(203, 213, 225), font=f_xs)
        cy += 95

    im.save(os.path.join(OUT_DIR, 'podcaster_hero_1.png'), quality=95)
    print('Generated podcaster_hero_1.png')

# ==================== 2. PODCASTER HERO 2: Dynamic Ad Insertion & RSS Feeds ====================
def gen_podcaster_2():
    im = create_canvas(1600, 1000, (8, 14, 28), (3, 6, 14))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 560, 108), 'DYNAMIC AD INSERTION & GLOBAL PODCAST RSS SYNDICATION', (0, 242, 254), (0, 242, 254, 35), (0, 242, 254))
    draw.text((80, 126), 'Monetize Every Episode with Targeted Dynamic Audio Ads', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'Insert pre-roll, mid-roll, and post-roll brand campaigns dynamically by country, city, and device across 15+ podcast directories.', fill=(148, 163, 184), font=f_sm)

    # 3 Large Ad Deployment Cards
    ad_slots = [
        ('Pre-Roll Brand Placement (15s)', 'Target CPM: $24.00 USD / KES 3,120', 'Triggers before episode intro across Spotify, Apple & TuneStream. 98.6% completion rate.', (0, 242, 254)),
        ('Mid-Roll Host-Read Endorsement (60s)', 'Target CPM: $38.00 USD / KES 4,940', 'Inserted dynamically at chapter breakpoints. Programmatic Safaricom & Telco voucher codes.', (16, 185, 129)),
        ('Post-Roll Engagement Callout (30s)', 'Target CPM: $18.00 USD / KES 2,340', 'Direct listener conversion to sponsor URL or ticket purchase with 90-day tracking cookie.', (245, 158, 11))
    ]
    for idx, (slot, cpm, desc, col) in enumerate(ad_slots):
        x = 80 + idx * 490
        draw_card(im, (x, 240, x + 460, 560))
        draw_pill(im, (x + 20, 260, x + 440, 296), slot, col, (col[0], col[1], col[2], 25), col)
        draw.text((x + 20, 316), cpm, fill=col, font=f_md)
        draw.text((x + 20, 370), desc, fill=(226, 232, 240), font=f_sm)
        draw.line([(x + 20, 480), (x + 440, 480)], fill=(255, 255, 255, 20), width=1)
        draw_pill(im, (x + 20, 500, x + 440, 540), 'DYNAMIC SERVER-SIDE STITCHING', (16, 185, 129), (16, 185, 129, 30), (16, 185, 129))

    # Bottom Syndicate Directories
    draw_card(im, (80, 600, 1520, 920))
    draw.text((110, 630), 'One-Click Apple, Spotify, TuneStream Web Radio & YouTube RSS Distribution', fill=(255, 255, 255), font=f_md)
    dsps = [
        ('Apple Podcasts Directory', 'Apple Podcasts Delegated Delivery API', '100% Certified Valid RSS', (0, 242, 254)),
        ('Spotify for Podcasters', 'Passthrough MP3 feed with video podcast support', 'Live Ingestion Verified', (16, 185, 129)),
        ('TuneStream Audio Stream', 'Direct lossless 24-bit podcast streaming + listener tipping', 'Instant M-Pesa Tipping Active', (168, 85, 247)),
        ('Amazon Music & Audible', 'Global syndicated podcast index with auto-transcripts', 'Global Distribution OK', (245, 158, 11))
    ]
    for idx, (dir_name, desc, status, col) in enumerate(dsps):
        sy = 680 + idx * 52
        draw_card(im, (110, sy, 1490, sy + 44), fill_col=(255, 255, 255, 6), border_col=(255, 255, 255, 12))
        draw.text((130, sy + 10), dir_name, fill=(255, 255, 255), font=f_sm)
        draw.text((620, sy + 12), desc, fill=(148, 163, 184), font=f_xs)
        draw.text((1240, sy + 10), status, fill=col, font=f_sm)

    im.save(os.path.join(OUT_DIR, 'podcaster_hero_2.png'), quality=95)
    print('Generated podcaster_hero_2.png')

# ==================== 3. PODCASTER HERO 3: EPK Pro & Guest Booking Engine ====================
def gen_podcaster_3():
    im = create_canvas(1600, 1000, (14, 10, 26), (6, 4, 14))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 560, 108), 'EPK PRO · DIGITAL SHOW MEDIA KIT & GUEST BOOKING ENGINE', (0, 242, 254), (0, 242, 254, 35), (0, 242, 254))
    draw.text((80, 126), 'Automated Show Media Kit & High-Profile Guest Booking', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'Attract top corporate advertisers, VC sponsors, and cultural icons with verifiable listener stats, press clippings, and direct calendar bookings.', fill=(148, 163, 184), font=f_sm)

    # 4 Media Kit Data Cards
    stats = [
        ('TOTAL LIFETIME DOWNLOADS', '1,420,000+', 'Top 2% African Audio Shows', (0, 242, 254)),
        ('PRIMARY DEMOGRAPHIC', '24 - 42 Years Old', 'Tech, Founders, Creative Execs', (16, 185, 129)),
        ('TOP LISTENER CORRIDORS', 'NBO, LDN, LOS, NYC', 'Pan-African & Global Diaspora', (168, 85, 247)),
        ('SPONSOR RENEWAL RATE', '92.4% Retention', 'Quarterly Brand Ad Flights', (245, 158, 11))
    ]
    for i, (lbl, val, sub, col) in enumerate(stats):
        x = 80 + i * 365
        draw_card(im, (x, 240, x + 340, 360))
        draw.text((x + 20, 258), lbl, fill=(148, 163, 184), font=f_xs)
        draw.text((x + 20, 284), val, fill=col, font=f_lg)
        draw.text((x + 20, 326), sub, fill=(100, 116, 139), font=f_xs)

    # Left: EPK Pro Layout
    draw_card(im, (80, 390, 850, 920))
    draw.text((110, 416), 'Verified Show Media Kit & Host Credentials', fill=(255, 255, 255), font=f_md)
    media_items = [
        ('Official Show Description & Bio', 'Custom vanity slug: tunemavens.com/pod/afrotech-disrupt', 'Live Web World', (0, 242, 254)),
        ('Guest Calendar Integration', 'Google Calendar / Cal.com pre-screen booking portal', 'Automated Prep Briefs', (16, 185, 129)),
        ('Integrated Audio Player Scrubber', 'Embeddable 60fps waveform player for PR publications', 'Lossless 24-Bit FLAC', (168, 85, 247)),
        ('Sponsorship Rate Card', 'CPM ad rates, live read packages & branded series RFP', 'Instant Stripe & M-Pesa Checkout', (245, 158, 11))
    ]
    my = 470
    for title, desc, tag, col in media_items:
        draw_card(im, (110, my, 820, my + 90), fill_col=(255, 255, 255, 8), border_col=(255, 255, 255, 16))
        draw.text((130, my + 16), title, fill=(255, 255, 255), font=f_sm)
        draw.text((130, my + 46), desc, fill=(148, 163, 184), font=f_xs)
        draw_pill(im, (580, my + 25, 790, my + 65), tag, col, (col[0], col[1], col[2], 25), col)
        my += 105

    # Right: Confirmed Guest Roster
    draw_card(im, (880, 390, 1520, 920))
    draw.text((910, 416), 'Past High-Profile Guest Appearances', fill=(255, 255, 255), font=f_md)
    draw.text((910, 456), 'Top technology founders, recording artists, and venture capital partners interviewed on verified episodes.', fill=(148, 163, 184), font=f_xs)
    guests = [
        ('Ndufo · Live Modular Artist & Tech Founder', 'Episode #42: Revolutionizing African Sync Royalties', (0, 242, 254)),
        ('Amina Mwangi · Chart-Topping Soul Vocalist', 'Episode #39: Independent Catalog Valuation & Tours', (16, 185, 129)),
        ('DJ Kalonje · Arena DJ & Club Taste-Maker', 'Episode #36: From Eastlands Street Mixes to Cyberwave', (168, 85, 247)),
        ('Victor Omondi · Managing Partner, Savannah VC', 'Episode #31: Underwriting Alternative Music Debt', (245, 158, 11))
    ]
    gy = 510
    for gname, gep, col in guests:
        draw_card(im, (910, gy, 1490, gy + 80), fill_col=(255, 255, 255, 8), border_col=(255, 255, 255, 16))
        draw.text((930, gy + 14), gname, fill=(255, 255, 255), font=f_sm)
        draw.text((930, gy + 42), gep, fill=col, font=f_xs)
        gy += 95

    im.save(os.path.join(OUT_DIR, 'podcaster_hero_3.png'), quality=95)
    print('Generated podcaster_hero_3.png')

# ==================== 4. PODCASTER HERO 4: Fan Tipping & Split Cascade ====================
def gen_podcaster_4():
    im = create_canvas(1600, 1000, (6, 20, 26), (2, 10, 14))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 560, 108), 'FAN TIPPING & SPLIT CASCADE · PROGRAMMATIC CREW REVENUE SHARE', (0, 242, 254), (0, 242, 254, 35), (0, 242, 254))
    draw.text((80, 126), 'Direct M-Pesa Listener Tipping & Automated Crew Splits', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'Listeners tip directly mid-episode using Safaricom M-Pesa STK push. Revenue routes programmatically to host, co-host, sound engineer, and producer in seconds.', fill=(148, 163, 184), font=f_sm)

    # 4 Split Cascade participants
    splits = [
        ('1. Lead Host Split', '50.0% Net', 'Instant M-Pesa wallet credit upon listener tip. Zero withholding.', (0, 242, 254)),
        ('2. Co-Host / Interviewer', '25.0% Net', 'Automated split sheet contract per episode. Direct bank deposit.', (16, 185, 129)),
        ('3. Audio Engineer & Editor', '15.0% Net', 'Production credit payment automated at episode publish time.', (168, 85, 247)),
        ('4. Show Operating Escrow', '10.0% Net', 'Studio gear upgrades, marketing credits & domain renewal vault.', (245, 158, 11))
    ]
    for idx, (title, pct, desc, col) in enumerate(splits):
        x = 80 + idx * 365
        draw_card(im, (x, 240, x + 340, 560))
        draw_pill(im, (x + 20, 260, x + 320, 296), title, col, (col[0], col[1], col[2], 25), col)
        draw.text((x + 20, 320), pct, fill=col, font=f_xxl)
        draw.text((x + 20, 410), desc, fill=(226, 232, 240), font=f_sm)

    # Bottom Live Tipping Stream
    draw_card(im, (80, 600, 1520, 920))
    draw.text((110, 630), 'Real-Time Listener Tipping Feed (Safaricom M-Pesa & Global Cards)', fill=(255, 255, 255), font=f_md)
    tips = [
        ('Fan: Kelvin M. (+254 712***456)', 'Tipped 100 TM Credits ($10.00 / KES 1,300)', 'Split Cascade: 50 KES Host, 25 KES Co-Host, 15 KES Audio Editor', (16, 185, 129)),
        ('Fan: Sarah Jenkins (London, UK)', 'Tipped $25.00 USD via Stripe', 'Split Cascade: Instant GBP currency conversion with zero foreign exchange markup', (0, 242, 254)),
        ('Fan: David O. (+254 722***890)', 'Tipped 250 TM Credits ($25.00 / KES 3,250)', 'Split Cascade: Safaricom B2C STK Push confirmed in 0.4s (Ref: QJK89021)', (16, 185, 129))
    ]
    for idx, (fan, amt, routing, col) in enumerate(tips):
        ty = 680 + idx * 72
        draw_card(im, (110, ty, 1490, ty + 62), fill_col=(255, 255, 255, 6), border_col=(255, 255, 255, 12))
        draw.text((130, ty + 12), fan, fill=(255, 255, 255), font=f_sm)
        draw.text((580, ty + 12), amt, fill=col, font=f_sm)
        draw.text((130, ty + 36), routing, fill=(148, 163, 184), font=f_xs)

    im.save(os.path.join(OUT_DIR, 'podcaster_hero_4.png'), quality=95)
    print('Generated podcaster_hero_4.png')

# ==================== 5. VC HERO 1: Institutional Venture Underwriting Desk ====================
def gen_vc_1():
    im = create_canvas(1600, 1000, (4, 18, 26), (2, 8, 14))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 560, 108), 'TUNE CAPITAL · INSTITUTIONAL TOUR UNDERWRITING DESK', (16, 185, 129), (16, 185, 129, 35), (16, 185, 129))
    draw.text((80, 126), 'Senior-Secured Live Tour Advances Backed by Real Telemetry', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'Participate in senior debt facilities for live music tours across Africa and global corridors. 18% to 25% target IRR with first-dollar recoupment.', fill=(148, 163, 184), font=f_sm)

    kpis = [
        ('TOTAL UNDERWRITTEN CAPITAL', '$14,200,000+', 'Senior Tour Facilities', (16, 185, 129)),
        ('AVERAGE TARGET IRR', '22.6% Net IRR', 'Short-Cycle Recoupment', (0, 242, 254)),
        ('MEAN RECOUPMENT DURATION', '3.8 Months', 'First-Dollar Split Cascade', (168, 85, 247)),
        ('HISTORICAL DEFAULT RATE', '0.00% Senior Debt', '100% Box Office Escrow Lien', (245, 158, 11))
    ]
    for i, (lbl, val, sub, col) in enumerate(kpis):
        x = 80 + i * 365
        draw_card(im, (x, 240, x + 340, 360))
        draw.text((x + 20, 258), lbl, fill=(148, 163, 184), font=f_xs)
        draw.text((x + 20, 284), val, fill=col, font=f_lg)
        draw.text((x + 20, 326), sub, fill=(100, 116, 139), font=f_xs)

    # Left: Active Underwriting Facilities
    draw_card(im, (80, 390, 850, 920))
    draw.text((110, 416), 'Live Tour Facilities & Senior Escrow Positions', fill=(255, 255, 255), font=f_md)
    corridors = [
        ('Ndufo · Afro-House Live Tour (NBO/LDN)', '$50,000 Facility', 'Target IRR 23.6% · 3.8 mos', 'Underwritten', (16, 185, 129)),
        ('DJ Kalonje · Cyberwave Arena Tour', '$35,000 Facility', 'Target IRR 24.5% · 2.9 mos', 'Underwritten', (16, 185, 129)),
        ('Amina Mwangi · Acoustic Residency Tour', '$30,000 Facility', 'Target IRR 22.0% · 4.1 mos', 'Active Run', (0, 242, 254)),
        ('DJ Sola · European Club Showcase Run', '$45,000 Facility', 'Target IRR 23.5% · 3.9 mos', 'Underwritten', (16, 185, 129))
    ]
    cy = 470
    for name, fac, irr, stat, col in corridors:
        draw_card(im, (110, cy, 820, cy + 90), fill_col=(255, 255, 255, 8), border_col=(255, 255, 255, 16))
        draw.text((130, cy + 16), name, fill=(255, 255, 255), font=f_sm)
        draw.text((130, cy + 46), irr, fill=(148, 163, 184), font=f_xs)
        draw.text((580, cy + 24), fac, fill=col, font=f_md)
        draw_pill(im, (710, cy + 24, 805, cy + 58), stat, col, (col[0], col[1], col[2], 25), col)
        cy += 105

    # Right: Split Cascade Recoupment Mechanics
    draw_card(im, (880, 390, 1520, 920))
    draw.text((910, 416), 'First-Dollar Split Cascade Recoupment Mechanics', fill=(255, 255, 255), font=f_md)
    draw.text((910, 456), 'TuneMavens acts as neutral technology intermediary & escrow clearinghouse (3.0% protocol fee). Zero equity dilution.', fill=(148, 163, 184), font=f_xs)
    mechanics = [
        ('1. Senior Debt Facility Recoupment', '100% of Box Office & Door receipts stream to VC till 1.25x Return', (16, 185, 129)),
        ('2. Venue & Sound Production Escrow', 'Automated vendor escrow release upon completed stage performance', (0, 242, 254)),
        ('3. Artist Split & Direct Wallet Deposit', 'Remaining gross revenue distributed to creator via M-Pesa / wire', (168, 85, 247)),
        ('4. TuneMavens Technology Protocol Clearing', '3.0% flat platform clearing fee (zero platform credits charged)', (245, 158, 11))
    ]
    my = 510
    for title, desc, col in mechanics:
        draw_card(im, (910, my, 1490, my + 80), fill_col=(255, 255, 255, 8), border_col=(255, 255, 255, 16))
        draw.text((930, my + 14), title, fill=col, font=f_sm)
        draw.text((930, my + 42), desc, fill=(203, 213, 225), font=f_xs)
        my += 95

    im.save(os.path.join(OUT_DIR, 'vc_hero_1.png'), quality=95)
    print('Generated vc_hero_1.png')

# ==================== 6. VC HERO 2: Alternative Music Asset Telemetry & Radar ====================
def gen_vc_2():
    im = create_canvas(1600, 1000, (6, 14, 28), (2, 6, 16))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 560, 108), 'ALTERNATIVE ASSET TELEMETRY & AUDIENCE RETENTION RADAR', (16, 185, 129), (16, 185, 129, 35), (16, 185, 129))
    draw.text((80, 126), 'Cross-Platform Streaming Velocity & Box Office Predictions', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'Underwrite live tour corridors with predictive machine learning models tracking ticket sellouts, listener density, and gross merchandise receipts.', fill=(148, 163, 184), font=f_sm)

    # 3 Large Telemetry Deep Dives
    models = [
        ('Predictive Box Office Model (94% Accuracy)', 'Historical Ticket Sales: $527,250 Gross', 'AI models ticket velocity across Nairobi, Mombasa, Kampala & Kigali before tour announcement.', (16, 185, 129)),
        ('Cross-Platform Velocity Telemetry', 'Streaming Index: +184% MoM', 'Aggregates Spotify, YouTube, TuneStream, TikTok and club DJ setlists into unified credit score.', (0, 242, 254)),
        ('Audience Retention & LTV Scoring', 'Repeat Listener Rate: 84.2%', 'Verifies hardcore superfan clusters willing to purchase VIP passes and physical merchandise.', (245, 158, 11))
    ]
    for idx, (title, stat, desc, col) in enumerate(models):
        x = 80 + idx * 490
        draw_card(im, (x, 240, x + 460, 560))
        draw_pill(im, (x + 20, 260, x + 440, 296), title, col, (col[0], col[1], col[2], 25), col)
        draw.text((x + 20, 316), stat, fill=col, font=f_md)
        draw.text((x + 20, 370), desc, fill=(226, 232, 240), font=f_sm)
        draw.line([(x + 20, 480), (x + 440, 480)], fill=(255, 255, 255, 20), width=1)
        draw_pill(im, (x + 20, 500, x + 440, 540), 'VERIFIED CORRIDOR TELEMETRY', (16, 185, 129), (16, 185, 129, 30), (16, 185, 129))

    # Bottom Corridors Matrix
    draw_card(im, (80, 600, 1520, 920))
    draw.text((110, 630), 'Global Live Tour Corridors (Audience Concentration & Presale Health)', fill=(255, 255, 255), font=f_md)
    corrs = [
        ('Nairobi 🇰🇪 · Carnivore Grounds / Alchemist', 'Afro-House, Live Modular & Amapiano', 'Est. Box Office: $120k', 'Underwriting Score: 98 / 100', (16, 185, 129)),
        ('London 🇬🇧 · Ministry of Sound / Outernet', 'UK & Diaspora Afro-Electronic', 'Est. Box Office: $180k', 'Underwriting Score: 96 / 100', (0, 242, 254)),
        ('Lagos 🇳🇬 · Landmark Centre / Eko Hotel', 'Afrobeats & Street Anthems', 'Est. Box Office: $160k', 'Underwriting Score: 94 / 100', (168, 85, 247)),
        ('Johannesburg 🇿🇦 · Zone 6 / Constitution Hill', 'Deep Amapiano & Soul Residency', 'Est. Box Office: $110k', 'Underwriting Score: 95 / 100', (245, 158, 11))
    ]
    for idx, (corr, genre, est, score, col) in enumerate(corrs):
        sy = 680 + idx * 52
        draw_card(im, (110, sy, 1490, sy + 44), fill_col=(255, 255, 255, 6), border_col=(255, 255, 255, 12))
        draw.text((130, sy + 10), corr, fill=(255, 255, 255), font=f_sm)
        draw.text((620, sy + 12), genre, fill=(148, 163, 184), font=f_xs)
        draw.text((1050, sy + 10), est, fill=col, font=f_sm)
        draw.text((1280, sy + 10), score, fill=(16, 185, 129), font=f_sm)

    im.save(os.path.join(OUT_DIR, 'vc_hero_2.png'), quality=95)
    print('Generated vc_hero_2.png')

# ==================== 7. VC HERO 3: Tripartite Contract & Legal Vault ====================
def gen_vc_3():
    im = create_canvas(1600, 1000, (10, 18, 24), (4, 8, 14))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 560, 108), 'SMART LEGAL VAULT · TRIPARTITE FINANCING FRAMEWORK', (16, 185, 129), (16, 185, 129, 35), (16, 185, 129))
    draw.text((80, 126), 'SHA-256 Sealed Online Tripartite Underwriting Contracts', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'Legally binding digital agreements executed online between Creator, VC, and TuneMavens as Escrow Custodian. No paperwork delay.', fill=(148, 163, 184), font=f_sm)

    # 3 Large Pillars
    contract_pillars = [
        ('Party 1: Creator / Touring Act', 'Senior Debt Recoupment Obligation', 'Commits 100% of tour gross to automated escrow until principal + agreed ROI is settled.', (16, 185, 129)),
        ('Party 2: Venture Capital Fund / Syndicate', 'Immediate Liquidity Disbursement', 'Funds advance directly into production escrow account via SWIFT, ACH, or M-Pesa.', (0, 242, 254)),
        ('Party 3: TuneMavens Intermediary', 'Neutral Protocol Escrow & Split Cascade', 'Monitors ticketing API, locks recoupment liens, and enforces transparent payouts (3.0% fee).', (245, 158, 11))
    ]
    for idx, (title, role, desc, col) in enumerate(contract_pillars):
        x = 80 + idx * 490
        draw_card(im, (x, 240, x + 460, 560))
        draw_pill(im, (x + 20, 260, x + 440, 296), title, col, (col[0], col[1], col[2], 25), col)
        draw.text((x + 20, 316), role, fill=col, font=f_md)
        draw.text((x + 20, 370), desc, fill=(226, 232, 240), font=f_sm)
        draw.line([(x + 20, 480), (x + 440, 480)], fill=(255, 255, 255, 20), width=1)
        draw_pill(im, (x + 20, 500, x + 440, 540), 'DIGITAL SIGNATURE SEALED', (16, 185, 129), (16, 185, 129, 30), (16, 185, 129))

    # Bottom Protocol Specs
    draw_card(im, (80, 600, 1520, 920))
    draw.text((110, 630), 'Tripartite Legal Enforceability & Cross-Border Protections', fill=(255, 255, 255), font=f_md)
    draw.text((110, 670), 'Every executed agreement features timestamped audit logs, cryptographic SHA-256 checksums, and cross-border commercial arbitration clauses under Kenyan and Delaware jurisdiction.', fill=(148, 163, 184), font=f_sm)
    draw_pill(im, (110, 750, 460, 790), 'DELAWARE & KENYA JURISDICTION', (16, 185, 129), (16, 185, 129, 30), (16, 185, 129))
    draw_pill(im, (480, 750, 840, 790), 'CRYPTOGRAPHIC TIMESTAMP HASH', (0, 242, 254), (0, 242, 254, 30), (0, 242, 254))

    im.save(os.path.join(OUT_DIR, 'vc_hero_3.png'), quality=95)
    print('Generated vc_hero_3.png')

# ==================== 8. VC HERO 4: Career Sponsorship & Tooling Facility ====================
def gen_vc_4():
    im = create_canvas(1600, 1000, (4, 16, 28), (2, 6, 16))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 560, 108), 'DIRECT CREATOR CAREER SPONSORSHIP & TOOLING FACILITY', (16, 185, 129), (16, 185, 129, 35), (16, 185, 129))
    draw.text((80, 126), 'Fund Creator Operational Costs in Exchange for Royalty Shares', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'Sponsor EPK Pro hosting, AI studio mastering, and global DSP distribution for breakthrough artists with non-dilutive programmatic recoupment.', fill=(148, 163, 184), font=f_sm)

    # 4 Sponsorship Categories
    facilities = [
        ('Global DSP Distribution Package', '$149.00 USD', '15% DSP Royalty Share until 1.25x Return', (16, 185, 129)),
        ('EPK Pro Custom Domain & Hosting', '$199.00 USD', '10% Live Booking Fees until 1.20x Return', (0, 242, 254)),
        ('AI & Analog Studio Mastering Suite', '$250.00 USD', '12% Stream Payouts until 1.25x Return', (168, 85, 247)),
        ('SyncMavens Film & TV Representation', '$300.00 USD', '20% Sync Placement Fee until 1.30x Return', (245, 158, 11))
    ]
    for i, (name, cost, recoup, col) in enumerate(facilities):
        x = 80 + i * 365
        draw_card(im, (x, 240, x + 340, 560))
        draw_pill(im, (x + 20, 260, x + 320, 296), cost, col, (col[0], col[1], col[2], 25), col)
        draw.text((x + 20, 316), name, fill=(255, 255, 255), font=f_md)
        draw.text((x + 20, 390), recoup, fill=col, font=f_sm)
        draw.line([(x + 20, 480), (x + 320, 480)], fill=(255, 255, 255, 20), width=1)
        draw_pill(im, (x + 20, 500, x + 320, 540), 'PROGRAMMATIC RECOUPMENT', (16, 185, 129), (16, 185, 129, 30), (16, 185, 129))

    draw_card(im, (80, 600, 1520, 920))
    draw.text((110, 630), 'Non-Dilutive Career Incubation Economics', fill=(255, 255, 255), font=f_md)
    draw.text((110, 670), 'Instead of demanding 360-record deal equity or master ownership, VCs advance operational tooling credits. Creators preserve 100% of their copyright while investors generate low-risk, predictable yields.', fill=(148, 163, 184), font=f_sm)
    draw_pill(im, (110, 750, 460, 790), 'ZERO COPYRIGHT DILUTION', (16, 185, 129), (16, 185, 129, 30), (16, 185, 129))
    draw_pill(im, (480, 750, 840, 790), 'AUTOMATED FIRST-DOLLAR LIEN', (0, 242, 254), (0, 242, 254, 30), (0, 242, 254))

    im.save(os.path.join(OUT_DIR, 'vc_hero_4.png'), quality=95)
    print('Generated vc_hero_4.png')

if __name__ == '__main__':
    gen_podcaster_1()
    gen_podcaster_2()
    gen_podcaster_3()
    gen_podcaster_4()
    gen_vc_1()
    gen_vc_2()
    gen_vc_3()
    gen_vc_4()
    print('ALL PODCASTER AND VC TARGETED HERO VISUALS GENERATED!')
