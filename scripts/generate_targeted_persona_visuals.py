# Python visual asset generator for corporate affiliate, VC, DJ, and Label targeted imagery
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
    # Background subtle grid
    overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    for x in range(0, w, 50):
        odraw.line([(x, 0), (x, h)], fill=(255, 255, 255, 8), width=1)
    for y in range(0, h, 50):
        odraw.line([(0, y), (w, y)], fill=(255, 255, 255, 8), width=1)
    im.paste(overlay, (0, 0), overlay)
    return im

def draw_pill(canvas, box, text, border_col=(16, 185, 129), bg_col=(16, 185, 129, 35), txt_col=(16, 185, 129)):
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

# ----------------- 1. AFFILIATE HERO 1: Corporate Growth Console & Revenue Waterfall -----------------
def gen_affiliate_1():
    im = create_canvas(1600, 1000, (6, 16, 32), (2, 8, 18))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 680, 108), 'TUNE MAVENS AFFILIATE ENGINE · CORPORATE GROWTH CONSOLE', (34, 211, 238), (34, 211, 238, 30), (34, 211, 238))
    draw.text((80, 126), 'Multi-Tier Revenue Share & Automated Payout Ledger', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'Real-time telemetry, 3% to 12% revenue cascade, and instant M-Pesa STK push mobile money settlement.', fill=(148, 163, 184), font=f_sm)

    # Top KPI Cards
    kpis = [
        ('TOTAL DISBURSED (KES / USD)', 'KES 4,820,500', '+28.4% this month', (16, 185, 129)),
        ('ACTIVE AFFILIATE LINKS', '1,428 Active', '90-Day Cookie Window', (34, 211, 238)),
        ('ONBOARDED CREATORS', '392 Artists & DJs', 'Direct Split Link', (168, 85, 247)),
        ('AVG COMMISSION YIELD', '8.65% Multi-Tier', 'Instant STK Rails', (245, 158, 11))
    ]
    card_w = 340
    for i, (label, val, sub, col) in enumerate(kpis):
        x = 80 + i * 365
        draw_card(im, (x, 230, x + card_w, 350))
        draw.text((x + 20, 248), label, fill=(148, 163, 184), font=f_xs)
        draw.text((x + 20, 274), val, fill=col, font=f_lg)
        draw.text((x + 20, 316), sub, fill=(100, 116, 139), font=f_xs)

    # Left: Waterfall Table
    draw_card(im, (80, 380, 850, 920))
    draw.text((110, 406), 'Affiliate Revenue Waterfall by Product Category', fill=(255, 255, 255), font=f_md)
    tiers = [
        ('Commercial Sync Placement (SyncMavens)', '12.0%', 'Up to $300 / placement', 'High-Yield Brand Briefs', (34, 211, 238)),
        ('Lossless Album & Stems Sales (TuneStream)', '10.0%', 'Direct Fan Checkouts', '24-Bit Master Downloads', (16, 185, 129)),
        ('Creator Platform Onboarding Referral', '8.0%', 'Per Monthly Tools Reload', 'Ongoing Lifetime Trailing', (168, 85, 247)),
        ('Live Event Ticket & Tour Advance Split', '5.0%', 'Senior Escrow Clearing', 'Venue & Door Telemetry', (245, 158, 11)),
        ('General Stream Royalty Micro-Share', '3.0%', 'Every Play in 90-Day Loop', 'Automated Daily Flush', (148, 163, 184))
    ]
    y_tier = 460
    for title, pct, fee, desc, col in tiers:
        draw_card(im, (110, y_tier, 820, y_tier + 75), fill_col=(255, 255, 255, 8), border_col=(255, 255, 255, 16))
        draw.text((130, y_tier + 14), title, fill=(255, 255, 255), font=f_sm)
        draw.text((130, y_tier + 42), f'{fee} · {desc}', fill=(148, 163, 184), font=f_xs)
        draw.text((720, y_tier + 20), pct, fill=col, font=f_lg)
        y_tier += 90

    # Right: Telemetry Chart & Instant Payout Feed
    draw_card(im, (880, 380, 1520, 920))
    draw.text((910, 406), 'Real-Time Referral Conversion Telemetry', fill=(255, 255, 255), font=f_md)
    chart_pts = [(920, 580), (980, 560), (1040, 520), (1100, 540), (1160, 490), (1220, 460), (1280, 480), (1340, 430), (1400, 390), (1480, 360)]
    for i in range(len(chart_pts) - 1):
        draw.line([chart_pts[i], chart_pts[i+1]], fill=(34, 211, 238), width=3)
        draw.ellipse((chart_pts[i][0]-4, chart_pts[i][1]-4, chart_pts[i][0]+4, chart_pts[i][1]+4), fill=(16, 185, 129))
    draw.ellipse((chart_pts[-1][0]-5, chart_pts[-1][1]-5, chart_pts[-1][0]+5, chart_pts[-1][1]+5), fill=(34, 211, 238))

    draw.text((910, 620), 'Recent M-Pesa STK & Global Rail Payouts', fill=(255, 255, 255), font=f_sm)
    txs = [
        ('Safaricom M-Pesa STK Push', 'KES 18,450.00', 'Success · Ref: QKJ789012 · 0.3s', (16, 185, 129)),
        ('Direct US Stripe / Wire', '$420.00 USD', 'Success · Ref: STR_4920211 · Bank Rail', (34, 211, 238)),
        ('Safaricom M-Pesa STK Push', 'KES 6,200.00', 'Success · Ref: QKJ789088 · 0.4s', (16, 185, 129)),
    ]
    y_tx = 660
    for mode, amt, ref, col in txs:
        draw_card(im, (910, y_tx, 1490, y_tx + 70), fill_col=(255, 255, 255, 6), border_col=(255, 255, 255, 12))
        draw.text((930, y_tx + 12), mode, fill=(255, 255, 255), font=f_sm)
        draw.text((930, y_tx + 40), ref, fill=(148, 163, 184), font=f_xs)
        draw.text((1310, y_tx + 18), amt, fill=col, font=f_md)
        y_tx += 80

    im.save(os.path.join(OUT_DIR, 'affiliate_hero_1.png'), quality=95)
    print('Generated affiliate_hero_1.png')

# ----------------- 2. AFFILIATE HERO 2: 90-Day Cookie Attribution Engine -----------------
def gen_affiliate_2():
    im = create_canvas(1600, 1000, (14, 10, 32), (6, 4, 18))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 620, 108), '90-DAY COOKIE ATTRIBUTION ENGINE · ZERO COMMISSION LEAKAGE', (168, 85, 247), (168, 85, 247, 30), (168, 85, 247))
    draw.text((80, 126), 'Full 3-Month Persistent Referral Attribution Lifecycle', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'One single link shared across WhatsApp, Twitter, or TikTok gives you 90 continuous days of sales credit.', fill=(148, 163, 184), font=f_sm)

    steps = [
        ('DAY 0 · LINK CLICK', 'Fan clicks your unique affiliate link or scans QR code at Nairobi festival.', 'Fingerprint Logged', (34, 211, 238)),
        ('DAY 14 · STREAMING', 'Listener streams artist single on TuneStream offline/online.', '1st Touch Recorded', (168, 85, 247)),
        ('DAY 42 · STEM PURCHASE', 'Buyer returns directly and purchases lossless stem package ($35).', '10% Commission Paid', (16, 185, 129)),
        ('DAY 88 · COMMERCIAL SYNC', 'Brand licenses track for ad brief ($2,500). Full credit applied.', '$300 Commission M-Pesa', (245, 158, 11))
    ]
    for i, (title, desc, status, col) in enumerate(steps):
        x = 80 + i * 365
        draw_card(im, (x, 240, x + 340, 520))
        draw_pill(im, (x + 20, 260, x + 320, 295), title, col, (col[0], col[1], col[2], 25), col)
        draw.text((x + 20, 320), desc, fill=(226, 232, 240), font=f_sm)
        draw.line([(x + 20, 440), (x + 320, 440)], fill=(255, 255, 255, 20), width=1)
        draw.text((x + 20, 460), status, fill=col, font=f_md)

    draw_card(im, (80, 560, 1520, 920))
    draw.text((110, 590), 'Attribution Verification & Anti-Fraud Telemetry Architecture', fill=(255, 255, 255), font=f_md)
    cols = [
        ('Active Tracking Cookies', '84,290 sessions', '0.00% fraud rate', (34, 211, 238)),
        ('Fingerprint Accuracy', '99.8% Match', 'Cross-Device AI', (16, 185, 129)),
        ('Mean Attribution Age', '23.4 Days', 'Long-tail monetization', (168, 85, 247)),
        ('Escrow Guarantee', '100% Guaranteed', 'Split Cascade Lock', (245, 158, 11))
    ]
    for idx, (h, v, s, col) in enumerate(cols):
        cx = 110 + idx * 350
        draw_card(im, (cx, 640, cx + 320, 770), fill_col=(255, 255, 255, 8), border_col=(255, 255, 255, 16))
        draw.text((cx + 16, 655), h, fill=(148, 163, 184), font=f_xs)
        draw.text((cx + 16, 680), v, fill=col, font=f_lg)
        draw.text((cx + 16, 728), s, fill=(100, 116, 139), font=f_xs)

    draw.text((110, 810), 'Automatic Multi-Device Identity Resolution via Safari WebKit, Chrome Private Sandbox & WhatsApp in-app browser.', fill=(148, 163, 184), font=f_sm)
    draw_pill(im, (110, 850, 440, 890), 'SECURE 90-DAY ATTRIBUTION PROTOCOL', (16, 185, 129), (16, 185, 129, 30), (16, 185, 129))

    im.save(os.path.join(OUT_DIR, 'affiliate_hero_2.png'), quality=95)
    print('Generated affiliate_hero_2.png')

# ----------------- 3. AFFILIATE HERO 3: Instant M-Pesa & Global Settlement Rails -----------------
def gen_affiliate_3():
    im = create_canvas(1600, 1000, (4, 20, 20), (2, 10, 10))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 640, 108), 'INSTANT M-PESA & GLOBAL RAILS · $20 / KES 2,600 ACCESSIBLE FLOOR', (16, 185, 129), (16, 185, 129, 30), (16, 185, 129))
    draw.text((80, 126), 'Automated Payout Rails with Zero Payment Gatekeeping', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'Safaricom M-Pesa STK push for East Africa alongside Stripe, PayPal, and SWIFT international settlement.', fill=(148, 163, 184), font=f_sm)

    draw_card(im, (80, 240, 780, 920))
    draw_pill(im, (110, 266, 420, 305), 'SAFARICOM M-PESA B2C STK PUSH', (16, 185, 129), (16, 185, 129, 35), (16, 185, 129))
    draw.text((110, 320), 'Direct Mobile Money Disbursement', fill=(255, 255, 255), font=f_lg)
    draw.text((110, 365), 'Instant funds sent straight to your Kenyan mobile phone number in Kenya Shillings (KES). 0.4s confirmation.', fill=(148, 163, 184), font=f_sm)

    mpesa_metrics = [
        ('Minimum Cashout Floor', 'KES 2,600 ($20.00)', (16, 185, 129)),
        ('Settlement Latency', '< 1 Second (Instant STK Push)', (34, 211, 238)),
        ('Disbursement Fee', 'KES 0 (TuneMavens Absorbs Fees)', (168, 85, 247)),
        ('Supported Networks', 'Safaricom M-Pesa, Airtel Money', (245, 158, 11))
    ]
    for idx, (lbl, val, col) in enumerate(mpesa_metrics):
        my = 430 + idx * 110
        draw_card(im, (110, my, 750, my + 90), fill_col=(255, 255, 255, 8), border_col=(255, 255, 255, 16))
        draw.text((130, my + 16), lbl, fill=(148, 163, 184), font=f_xs)
        draw.text((130, my + 44), val, fill=col, font=f_md)

    draw_card(im, (820, 240, 1520, 920))
    draw_pill(im, (850, 266, 1140, 305), 'GLOBAL CROSS-BORDER RAILS', (34, 211, 238), (34, 211, 238, 35), (34, 211, 238))
    draw.text((850, 320), 'International Multi-Currency Settlement', fill=(255, 255, 255), font=f_lg)
    draw.text((850, 365), 'For diaspora and international affiliates operating across the US, UK, EU, and Pan-African corridors.', fill=(148, 163, 184), font=f_sm)

    global_metrics = [
        ('Direct Bank ACH & SWIFT Wire', '$20.00 Minimum Floor · Direct Deposit', (34, 211, 238)),
        ('Stripe Connect & Card Settlement', 'Daily or Weekly Auto-Flush to Debit Card', (16, 185, 129)),
        ('PayPal Global Rails', 'Instant USD, GBP & EUR Account Credit', (168, 85, 247)),
        ('Split Cascade Escrow Ledger', '100% Fully Backed by Capital Vault', (245, 158, 11))
    ]
    for idx, (lbl, val, col) in enumerate(global_metrics):
        gy = 430 + idx * 110
        draw_card(im, (850, gy, 1490, gy + 90), fill_col=(255, 255, 255, 8), border_col=(255, 255, 255, 16))
        draw.text((870, gy + 16), lbl, fill=(148, 163, 184), font=f_xs)
        draw.text((870, gy + 44), val, fill=col, font=f_md)

    im.save(os.path.join(OUT_DIR, 'affiliate_hero_3.png'), quality=95)
    print('Generated affiliate_hero_3.png')

# ----------------- 4. AFFILIATE HERO 4: Commercial Sync Licensing Deal Desk -----------------
def gen_affiliate_4():
    im = create_canvas(1600, 1000, (26, 18, 6), (12, 8, 2))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 650, 108), 'SYNCAVENS INTEGRATION · HIGH-YIELD COMMERCIAL SYNC BRIEFS', (245, 158, 11), (245, 158, 11, 35), (245, 158, 11))
    draw.text((80, 126), 'Connect Brands to African Music & Collect 12% Per Placement', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'Commercial sync licenses command between $1,000 and $25,000. Earn high-ticket commission with pre-cleared splits.', fill=(148, 163, 184), font=f_sm)

    sync_cases = [
        ('Global Streaming Series Trailer', 'Netflix / Showmax Original', '$15,000.00 Gross License', '$1,800.00 Affiliate Share (12%)', 'Master + Publishing Pre-Cleared', (245, 158, 11)),
        ('Pan-African Telco Commercial Flight', 'Safaricom / MTN Brand Campaign', '$8,500.00 Gross License', '$1,020.00 Affiliate Share (12%)', '1-Year Broadcast East Africa', (16, 185, 129)),
        ('International Indie Game Soundtrack', 'Steam & Console Release', '$3,500.00 Gross License', '$420.00 Affiliate Share (12%)', 'Perpetual In-Game Sync', (34, 211, 238))
    ]
    for i, (title, client, gross, comm, rights, col) in enumerate(sync_cases):
        x = 80 + i * 490
        draw_card(im, (x, 240, x + 460, 580))
        draw_pill(im, (x + 20, 260, x + 440, 296), client, col, (col[0], col[1], col[2], 25), col)
        draw.text((x + 20, 316), title, fill=(255, 255, 255), font=f_md)
        draw.text((x + 20, 354), rights, fill=(148, 163, 184), font=f_xs)
        draw.line([(x + 20, 386), (x + 440, 386)], fill=(255, 255, 255, 20), width=1)
        draw.text((x + 20, 410), 'Gross Placement License:', fill=(148, 163, 184), font=f_xs)
        draw.text((x + 20, 434), gross, fill=(255, 255, 255), font=f_lg)
        draw.text((x + 20, 490), 'Your 12% Affiliate Commission:', fill=(148, 163, 184), font=f_xs)
        draw.text((x + 20, 514), comm, fill=col, font=f_xl)

    draw_card(im, (80, 620, 1520, 920))
    draw.text((110, 650), 'SyncMavens Pre-Cleared Split Sheet Architecture', fill=(255, 255, 255), font=f_lg)
    draw.text((110, 695), 'Every track on SyncMavens features 100% executed master and publishing split contracts. When a music supervisor accepts a pitch, licensing escrow unlocks instantly, executing multi-party payouts without legal friction.', fill=(148, 163, 184), font=f_sm)
    draw_pill(im, (110, 770, 440, 810), 'DDEX ERN 4.3 COMPLIANT SYNC VAULT', (16, 185, 129), (16, 185, 129, 30), (16, 185, 129))
    draw_pill(im, (460, 770, 800, 810), 'AUTOMATED ESCROW SETTLEMENT', (34, 211, 238), (34, 211, 238, 30), (34, 211, 238))

    im.save(os.path.join(OUT_DIR, 'affiliate_hero_4.png'), quality=95)
    print('Generated affiliate_hero_4.png')

# ----------------- 5. AFFILIATE HERO 5: Global Multicultural Partner Network -----------------
def gen_affiliate_5():
    im = create_canvas(1600, 1000, (18, 10, 30), (8, 4, 15))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 650, 108), 'CURATORS, DJS, PRODUCERS & BLOGGERS · MULTICULTURAL NETWORK', (168, 85, 247), (168, 85, 247, 35), (168, 85, 247))
    draw.text((80, 126), 'Monetize Your Ear for African Music Across the Global Diaspora', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'From Nairobi to London, Lagos to New York. Turn taste-making into compounding monthly revenue share.', fill=(148, 163, 184), font=f_sm)

    personas = [
        ('Club & Festival DJs', 'Drop unreleased tracks in live sets and share Rekordbox QR codes. Earn on every fan who saves or buys.', '10% on Album Sales', (34, 211, 238)),
        ('Music Bloggers & YouTubers', 'Review new Afrobeats and Gengetone releases with persistent affiliate links in video descriptions.', '8% on Tools & EPKs', (168, 85, 247)),
        ('Playlist Curators & Taste-Makers', 'Monetize Spotify and TuneStream curated playlists with 90-day tracking on all listener conversions.', '3% Stream Revenue', (16, 185, 129)),
        ('Podcasters & Media Hosts', 'Feature indie artists on interviews with custom sponsor shortlinks and direct fan tipping kickbacks.', '12% Sync Referrals', (245, 158, 11))
    ]
    for i, (role, desc, comm, col) in enumerate(personas):
        x = 80 + i * 365
        draw_card(im, (x, 240, x + 340, 560))
        draw_pill(im, (x + 20, 260, x + 320, 296), role, col, (col[0], col[1], col[2], 25), col)
        draw.text((x + 20, 316), desc, fill=(226, 232, 240), font=f_sm)
        draw.line([(x + 20, 460), (x + 320, 460)], fill=(255, 255, 255, 20), width=1)
        draw.text((x + 20, 480), 'Commission Rate:', fill=(148, 163, 184), font=f_xs)
        draw.text((x + 20, 506), comm, fill=col, font=f_lg)

    draw_card(im, (80, 600, 1520, 920))
    draw.text((110, 630), 'Global Streaming & Referral Corridors (Live Volume)', fill=(255, 255, 255), font=f_md)
    corridors = [
        ('Nairobi 🇰🇪 <-> London 🇬🇧', 'Afro-House & Live Modular', 'KES 1,240,000 Volume', '+44% Growth'),
        ('Nairobi 🇰🇪 <-> Lagos 🇳🇬', 'Gengetone & Afrobeats Fusion', 'KES 980,000 Volume', '+32% Growth'),
        ('Mombasa 🇰🇪 <-> New York 🇺🇸', 'Acoustic Soul & Global Sync', 'KES 1,620,000 Volume', '+58% Growth'),
        ('Johannesburg 🇿🇦 <-> Nairobi 🇰🇪', 'Deep Amapiano Record Pool', 'KES 840,000 Volume', '+26% Growth')
    ]
    for idx, (corr, genre, vol, grw) in enumerate(corridors):
        cy = 680 + idx * 52
        draw_card(im, (110, cy, 1490, cy + 44), fill_col=(255, 255, 255, 6), border_col=(255, 255, 255, 12))
        draw.text((130, cy + 10), corr, fill=(255, 255, 255), font=f_sm)
        draw.text((580, cy + 12), genre, fill=(148, 163, 184), font=f_xs)
        draw.text((1050, cy + 10), vol, fill=(16, 185, 129), font=f_sm)
        draw.text((1380, cy + 10), grw, fill=(34, 211, 238), font=f_sm)

    im.save(os.path.join(OUT_DIR, 'affiliate_hero_5.png'), quality=95)
    print('Generated affiliate_hero_5.png')

# ----------------- 6. VC CORPORATE HERO: Tune Capital Senior Tour Debt & Underwriting -----------------
def gen_vc_hero():
    im = create_canvas(1600, 1000, (4, 16, 24), (2, 8, 14))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 650, 108), 'TUNE CAPITAL · ALTERNATIVE MUSIC ASSETS & TOUR DEBT FACILITY', (16, 185, 129), (16, 185, 129, 35), (16, 185, 129))
    draw.text((80, 126), 'Institutional Tour Debt & Career Sponsorship Underwriting', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'Senior-secured live tour facilities backed by real-time audience telemetry and automated first-dollar Split Cascade recoupment.', fill=(148, 163, 184), font=f_sm)

    vc_kpis = [
        ('TOTAL UNDERWRITTEN VOLUME', '$14,200,000+', 'Senior Tour Facilities', (16, 185, 129)),
        ('AVERAGE TARGET IRR', '22.6% Net IRR', 'Short-Cycle Recoupment', (34, 211, 238)),
        ('MEAN RECOUPMENT DURATION', '3.8 Months', 'First-Dollar Waterfall', (168, 85, 247)),
        ('HISTORICAL DEFAULT RATE', '0.0% Senior Debt', '100% Door Escrow Lien', (245, 158, 11))
    ]
    for i, (lbl, val, sub, col) in enumerate(vc_kpis):
        x = 80 + i * 365
        draw_card(im, (x, 240, x + 340, 360))
        draw.text((x + 20, 258), lbl, fill=(148, 163, 184), font=f_xs)
        draw.text((x + 20, 284), val, fill=col, font=f_lg)
        draw.text((x + 20, 326), sub, fill=(100, 116, 139), font=f_xs)

    draw_card(im, (80, 390, 850, 920))
    draw.text((110, 416), 'Active Senior Secured Tour Corridors', fill=(255, 255, 255), font=f_md)
    corridors = [
        ('Ndufo · Afro-House Live Tour (NBO/LDN)', '$50,000 Facility', 'Target IRR 23.6% · 3.8 mos', (16, 185, 129)),
        ('DJ Kalonje · Cyberwave Arena Tour', '$35,000 Facility', 'Target IRR 24.5% · 2.9 mos', (34, 211, 238)),
        ('Amina Mwangi · Acoustic Residency Tour', '$30,000 Facility', 'Target IRR 22.0% · 4.1 mos', (168, 85, 247)),
        ('DJ Sola · European Club Showcase Run', '$45,000 Facility', 'Target IRR 23.5% · 3.9 mos', (245, 158, 11)),
    ]
    cy = 470
    for name, fac, irr, col in corridors:
        draw_card(im, (110, cy, 820, cy + 90), fill_col=(255, 255, 255, 8), border_col=(255, 255, 255, 16))
        draw.text((130, cy + 18), name, fill=(255, 255, 255), font=f_sm)
        draw.text((130, cy + 48), irr, fill=(148, 163, 184), font=f_xs)
        draw.text((610, cy + 28), fac, fill=col, font=f_md)
        cy += 105

    draw_card(im, (880, 390, 1520, 920))
    draw.text((910, 416), 'First-Dollar Split Cascade Recoupment Waterfall', fill=(255, 255, 255), font=f_md)
    draw.text((910, 456), 'TuneMavens serves as neutral protocol escrow intermediary (3.0% protocol clearinghouse fee). Live box office receipts route automatically:', fill=(148, 163, 184), font=f_xs)
    wf_steps = [
        ('1. Senior Debt Facility Recoupment', '100% of Box Office & Door till 1.25x Return', (16, 185, 129)),
        ('2. Venue & Sound Engineering Production', 'Automated vendor escrow release upon show wrap', (34, 211, 238)),
        ('3. Artist Split & Direct Wallet Deposit', 'Remaining gross distributed via M-Pesa / wire', (168, 85, 247)),
        ('4. TuneMavens Technology Protocol Clearing', '3.0% flat platform clearing fee (zero credits)', (245, 158, 11))
    ]
    for idx, (st, desc, col) in enumerate(wf_steps):
        wy = 510 + idx * 95
        draw_card(im, (910, wy, 1490, wy + 80), fill_col=(255, 255, 255, 8), border_col=(255, 255, 255, 16))
        draw.text((930, wy + 14), st, fill=col, font=f_sm)
        draw.text((930, wy + 42), desc, fill=(203, 213, 225), font=f_xs)

    im.save(os.path.join(OUT_DIR, 'header_vc_corporate.png'), quality=95)
    print('Generated header_vc_corporate.png')

# ----------------- 7. DJ TARGETED VISUALS (CDJs, Mixers, Headphones, Festival Crowd) -----------------
def gen_dj_visuals():
    # DJ Hero 1: Authentic Pioneer CDJ-3000 Console & DJM-A9 Mixer in Action
    im1 = create_canvas(1600, 1000, (6, 18, 22), (2, 8, 10))
    draw1 = ImageDraw.Draw(im1)
    draw_pill(im1, (80, 70, 520, 108), 'TUNEDJ · PIONEER REKORDBOX & CDJ ECOSYSTEM', (20, 184, 166), (20, 184, 166, 35), (20, 184, 166))
    draw1.text((80, 126), 'Pioneer CDJ-3000 Multi-Player & DJM-A9 Club Setup', fill=(255, 255, 255), font=f_xl)
    draw1.text((80, 180), 'Pristine lossless WAV/FLAC files pre-analyzed with verified Camelot key, beat grid detection, and hot cue markers.', fill=(148, 163, 184), font=f_sm)

    # Left CDJ
    draw_card(im1, (80, 240, 500, 920), fill_col=(10, 18, 25, 240), border_col=(20, 184, 166, 80))
    draw_pill(im1, (100, 260, 260, 295), 'DECK 1 · CDJ-3000', (20, 184, 166))
    draw1.text((100, 310), 'Nairobi Afro-House Master', fill=(255, 255, 255), font=f_md)
    draw1.text((100, 345), 'BPM: 124.0 · Key: 8A (Am) · Quantize: ON', fill=(20, 184, 166), font=f_xs)
    draw1.ellipse((140, 400, 440, 700), fill=(15, 23, 42), outline=(20, 184, 166), width=3)
    draw1.ellipse((230, 490, 350, 610), fill=(6, 18, 22), outline=(34, 211, 238), width=2)
    draw1.text((260, 535), '02:45', fill=(255, 255, 255), font=f_md)
    for c in range(8):
        cx = 100 + (c % 4) * 95
        cy = 740 + (c // 4) * 70
        draw_card(im1, (cx, cy, cx + 80, cy + 55), fill_col=(20, 184, 166, 40), border_col=(20, 184, 166, 120))
        draw1.text((cx + 30, cy + 14), chr(65 + c), fill=(255, 255, 255), font=f_sm)

    # Center DJM-A9 Mixer
    draw_card(im1, (540, 240, 1060, 920), fill_col=(12, 16, 26, 240), border_col=(255, 255, 255, 40))
    draw_pill(im1, (560, 260, 760, 295), 'DJM-A9 4-CHANNEL MIXER', (34, 211, 238))
    draw1.text((560, 310), 'Sound Color FX & Beat FX Console', fill=(255, 255, 255), font=f_md)
    for ch in range(4):
        chx = 580 + ch * 115
        draw_card(im1, (chx, 370, chx + 95, 880), fill_col=(255, 255, 255, 6), border_col=(255, 255, 255, 12))
        draw1.text((chx + 24, 385), f'CH {ch+1}', fill=(148, 163, 184), font=f_xs)
        for k in range(3):
            ky = 430 + k * 65
            draw1.ellipse((chx + 30, ky, chx + 65, ky + 35), fill=(30, 41, 59), outline=(20, 184, 166) if ch < 2 else (148, 163, 184), width=2)
        draw_card(im1, (chx + 40, 640, chx + 55, 760), fill_col=(16, 185, 129, 180), border_col=(16, 185, 129))
        draw1.line([(chx + 47, 780), (chx + 47, 860)], fill=(255, 255, 255, 80), width=4)
        draw1.rectangle([(chx + 35, 800), (chx + 60, 815)], fill=(255, 255, 255))

    # Right CDJ
    draw_card(im1, (1100, 240, 1520, 920), fill_col=(10, 18, 25, 240), border_col=(20, 184, 166, 80))
    draw_pill(im1, (1120, 260, 1280, 295), 'DECK 2 · CDJ-3000', (20, 184, 166))
    draw1.text((1120, 310), 'Amapiano Stems Master (VIP)', fill=(255, 255, 255), font=f_md)
    draw1.text((1120, 345), 'BPM: 114.0 · Key: 5A (Cm) · Master Tempo: ON', fill=(20, 184, 166), font=f_xs)
    draw1.ellipse((1160, 400, 1460, 700), fill=(15, 23, 42), outline=(20, 184, 166), width=3)
    draw1.ellipse((1250, 490, 1370, 610), fill=(6, 18, 22), outline=(168, 85, 247), width=2)
    draw1.text((1280, 535), '04:12', fill=(255, 255, 255), font=f_md)
    for c in range(8):
        cx = 1120 + (c % 4) * 95
        cy = 740 + (c // 4) * 70
        draw_card(im1, (cx, cy, cx + 80, cy + 55), fill_col=(168, 85, 247, 40), border_col=(168, 85, 247, 120))
        draw1.text((cx + 30, cy + 14), chr(65 + c), fill=(255, 255, 255), font=f_sm)

    im1.save(os.path.join(OUT_DIR, 'dj_hero_1.png'), quality=95)
    print('Generated dj_hero_1.png')

    # DJ Hero 2: Stem Separation & Live Dubplate Engine
    im2 = create_canvas(1600, 1000, (8, 14, 26), (2, 6, 14))
    draw2 = ImageDraw.Draw(im2)
    draw_pill(im2, (80, 70, 550, 108), 'LIVE STEM SEPARATION & DUBPLATE CLEARANCE ENGINE', (20, 184, 166), (20, 184, 166, 35), (20, 184, 166))
    draw2.text((80, 126), 'Spin Separated Stems with 100% Legal Digital Clearances', fill=(255, 255, 255), font=f_xl)
    draw2.text((80, 180), 'Perform acapella mashups and instrumentals in real time. Digital cryptographic drop hashes prevent venue DMCA strikes.', fill=(148, 163, 184), font=f_sm)

    stems = [
        ('DRUMS & LOG DRUMS', '128.0 BPM · Transient Punch Active', (20, 184, 166)),
        ('BASS & SUB HARMONICS', 'Camelot Key 8A · Sidechained', (34, 211, 238)),
        ('MELODY & SYNTHS', 'Lossless 24-Bit FLAC Master', (168, 85, 247)),
        ('VOCALS & ADLIBS', 'Dry Acapella · Pure Isolation', (245, 158, 11))
    ]
    for i, (title, sub, col) in enumerate(stems):
        y = 240 + i * 165
        draw_card(im2, (80, y, 1520, y + 140))
        draw_pill(im2, (110, y + 20, 380, y + 55), title, col, (col[0], col[1], col[2], 25), col)
        draw2.text((410, y + 26), sub, fill=(148, 163, 184), font=f_sm)
        wx = 110
        for b in range(120):
            h = int(15 + 40 * math.sin(b * 0.2 + i))
            draw2.line([(wx + b * 11, y + 95 - h // 2), (wx + b * 11, y + 95 + h // 2)], fill=col, width=4)
        draw_pill(im2, (1340, y + 45, 1490, y + 85), 'STEM ACTIVE', (16, 185, 129), (16, 185, 129, 40), (16, 185, 129))

    im2.save(os.path.join(OUT_DIR, 'dj_hero_2.png'), quality=95)
    print('Generated dj_hero_2.png')

# ----------------- 8. RECORD LABEL TARGETED VISUALS (Roster, Splits, A&R, DDEX) -----------------
def gen_label_visuals():
    # Label Hero 1: Multi-Artist Roster Management & DDEX ERN 4.3 Distribution
    im1 = create_canvas(1600, 1000, (14, 10, 28), (6, 4, 16))
    draw1 = ImageDraw.Draw(im1)
    draw_pill(im1, (80, 70, 580, 108), 'TUNELABEL · RECORD LABEL EXECUTIVE COMMAND SUITE', (168, 85, 247), (168, 85, 247, 35), (168, 85, 247))
    draw1.text((80, 126), 'Multi-Artist Roster Management & Global Catalog Delivery', fill=(255, 255, 255), font=f_xl)
    draw1.text((80, 180), 'Manage 50+ signed creators, DDEX ERN 4.3 feeds to 150+ DSPs, ISRC metadata assignment, and catalog equity valuation.', fill=(148, 163, 184), font=f_sm)

    kpis = [
        ('TOTAL CATALOG TRACKS', '1,840 Masters', 'ISRC / ISWC Linked', (168, 85, 247)),
        ('SIGNED ROSTER ARTISTS', '42 Active Acts', 'Multi-Contract Split', (34, 211, 238)),
        ('MONTHLY DSP STREAMS', '18.4M Streams', 'Global DSP Corridors', (16, 185, 129)),
        ('CATALOG VALUATION', '$3,250,000 USD', '10.5x Forward Multiple', (245, 158, 11))
    ]
    for i, (lbl, val, sub, col) in enumerate(kpis):
        x = 80 + i * 365
        draw_card(im1, (x, 240, x + 340, 360))
        draw1.text((x + 20, 258), lbl, fill=(148, 163, 184), font=f_xs)
        draw1.text((x + 20, 284), val, fill=col, font=f_lg)
        draw1.text((x + 20, 326), sub, fill=(100, 116, 139), font=f_xs)

    draw_card(im1, (80, 390, 850, 920))
    draw1.text((110, 416), 'Signed Artist Roster & Ingestion Status', fill=(255, 255, 255), font=f_md)
    artists = [
        ('Ndufo', 'Afro-House / Live', '18 Masters · 98% Ingested', 'DDEX Delivered', (16, 185, 129)),
        ('Amina Mwangi', 'Soul & Acoustic', '24 Masters · 100% Ingested', 'DDEX Delivered', (16, 185, 129)),
        ('Cyberwave Collective', 'Electronic / Club', '42 Masters · 94% Ingested', 'DDEX Delivered', (34, 211, 238)),
        ('Nairobi Beats Roster', 'Gengetone & Hip-Hop', '68 Masters · In Review', 'Contract Pending', (245, 158, 11))
    ]
    ry = 470
    for name, genre, masters, status, col in artists:
        draw_card(im1, (110, ry, 820, ry + 90), fill_col=(255, 255, 255, 8), border_col=(255, 255, 255, 16))
        draw1.text((130, ry + 16), name, fill=(255, 255, 255), font=f_sm)
        draw1.text((130, ry + 46), f'{genre} · {masters}', fill=(148, 163, 184), font=f_xs)
        draw_pill(im1, (620, ry + 25, 790, ry + 65), status, col, (col[0], col[1], col[2], 30), col)
        ry += 105

    draw_card(im1, (880, 390, 1520, 920))
    draw1.text((910, 416), 'DDEX ERN 4.3 Automated DSP Delivery Stream', fill=(255, 255, 255), font=f_md)
    draw1.text((910, 456), 'Automated XML / SFTP batched deliveries with lossless FLAC audio, high-resolution 3000x3000 artwork, and verified lyrics.', fill=(148, 163, 184), font=f_xs)
    dsps = [
        ('Spotify Global', 'DDEX Ingest: OK', 'Real-time Daily Trending', (16, 185, 129)),
        ('Apple Music & Spatial Audio', 'DDEX Ingest: OK', 'Dolby Atmos Master Ingest', (34, 211, 238)),
        ('Boomplay Pan-Africa', 'DDEX Ingest: OK', 'Direct Telco Carrier Billing', (168, 85, 247)),
        ('YouTube Music & Content ID', 'DDEX Ingest: OK', 'Automated Video Claiming', (245, 158, 11))
    ]
    dy = 510
    for dsp, ing, feature, col in dsps:
        draw_card(im1, (910, dy, 1490, dy + 80), fill_col=(255, 255, 255, 8), border_col=(255, 255, 255, 16))
        draw1.text((930, dy + 14), dsp, fill=(255, 255, 255), font=f_sm)
        draw1.text((930, dy + 42), feature, fill=(148, 163, 184), font=f_xs)
        draw_pill(im1, (1320, dy + 20, 1460, dy + 60), ing, col, (col[0], col[1], col[2], 30), col)
        dy += 95

    im1.save(os.path.join(OUT_DIR, 'label_hero_1.png'), quality=95)
    print('Generated label_hero_1.png')

    # Label Hero 2: Split Cascade Royalty Administration
    im2 = create_canvas(1600, 1000, (10, 16, 26), (4, 8, 16))
    draw2 = ImageDraw.Draw(im2)
    draw_pill(im2, (80, 70, 580, 108), 'SPLIT CASCADE · PROGRAMMATIC ROYALTY CLEARINGHOUSE', (168, 85, 247), (168, 85, 247, 35), (168, 85, 247))
    draw2.text((80, 126), 'Automated Multi-Party Royalty Administration & Recoupment', fill=(255, 255, 255), font=f_xl)
    draw2.text((80, 180), 'Eliminate royalty disputes. Programmatic smart escrow holds master, publishing, and advance balances, paying creators automatically.', fill=(148, 163, 184), font=f_sm)

    cols = [
        ('1. Label Master Share', '50.0% Net', 'Recoups recording & marketing advances before artist profit share kicks in. 100% automated accounting.', (168, 85, 247)),
        ('2. Primary Artist Split', '30.0% Net', 'Transfers directly to artist mobile money (M-Pesa) or international bank wire with monthly auto-clearing.', (34, 211, 238)),
        ('3. Producers & Songwriters', '20.0% Net', 'Direct split sheets executed per track. Ingests ISRC and splits producer points without label manual intervention.', (16, 185, 129))
    ]
    for idx, (title, pct, desc, col) in enumerate(cols):
        x = 80 + idx * 490
        draw_card(im2, (x, 240, x + 460, 580))
        draw_pill(im2, (x + 20, 260, x + 440, 296), title, col, (col[0], col[1], col[2], 25), col)
        draw2.text((x + 20, 320), pct, fill=col, font=f_xxl)
        draw2.text((x + 20, 410), desc, fill=(226, 232, 240), font=f_sm)

    draw_card(im2, (80, 620, 1520, 920))
    draw2.text((110, 650), 'Split Cascade Automated Escrow Settlement Log', fill=(255, 255, 255), font=f_lg)
    draw2.text((110, 695), 'Every incoming dollar from DSPs, Sync placements, and Tour ticketing is parsed through the Split Cascade algorithm in 0.2s.', fill=(148, 163, 184), font=f_sm)
    draw_pill(im2, (110, 770, 480, 810), 'ZERO SPREADSHEET AUDIT OVERHEAD', (16, 185, 129), (16, 185, 129, 30), (16, 185, 129))
    draw_pill(im2, (510, 770, 890, 810), 'TRI-PARTY AUDITED SMART ESCROW', (34, 211, 238), (34, 211, 238, 30), (34, 211, 238))

    im2.save(os.path.join(OUT_DIR, 'label_hero_2.png'), quality=95)
    print('Generated label_hero_2.png')

# DJ Hero 3: Curated Extended Club Edits & Record Pool
def gen_dj_3():
    im = create_canvas(1600, 1000, (6, 20, 24), (2, 8, 12))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 560, 108), 'CURATED EXTENDED CLUB EDITS & TRANSITION TOOLS', (20, 184, 166), (20, 184, 166, 35), (20, 184, 166))
    draw.text((80, 126), 'Club-Tested Intros, Vocal Cuts & Quick Transition Outros', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'Every track packaged with 8-bar drum builds, clean & dirty versions, and transition markers optimized for peak-hour sets.', fill=(148, 163, 184), font=f_sm)

    edits = [
        ('8-Bar Extended Intro Edit', 'Afrobeats / Club Mix', 'BPM 108.0 · Key 4A', 'Batch Lossless WAV', (20, 184, 166)),
        ('Quick-Hitter Transition (128 -> 105)', 'Dance / Amapiano Shift', 'Tempo Ramp Pre-Baked', 'Rekordbox Grid Ready', (34, 211, 238)),
        ('Dry Acapella Intro + Drum Roll', 'Peak-Hour Vocal Cut', 'Zero Clutter · Crisp Kick', 'Serato / Traktor Mapped', (168, 85, 247)),
        ('Extended Instrumental Dubplate', 'Club Resident Tool', 'Full Extended Bassline', 'Non-Expiring License', (245, 158, 11))
    ]
    for i, (title, genre, spec, ready, col) in enumerate(edits):
        x = 80 + i * 365
        draw_card(im, (x, 240, x + 340, 560))
        draw_pill(im, (x + 20, 260, x + 320, 296), genre, col, (col[0], col[1], col[2], 25), col)
        draw.text((x + 20, 316), title, fill=(255, 255, 255), font=f_md)
        draw.text((x + 20, 390), spec, fill=(148, 163, 184), font=f_sm)
        draw.line([(x + 20, 430), (x + 320, 430)], fill=(255, 255, 255, 20), width=1)
        draw_pill(im, (x + 20, 450, x + 320, 490), ready, (16, 185, 129), (16, 185, 129, 30), (16, 185, 129))

    draw_card(im, (80, 600, 1520, 920))
    draw.text((110, 630), 'Batch Download Vault Specifications (Pioneer Rekordbox, Serato DJ Pro & Traktor Pro)', fill=(255, 255, 255), font=f_md)
    specs = [
        ('Pure 24-Bit / 48kHz WAV & 320kbps MP3', 'Dual master formats for stadium sound systems and high-speed USB sticks.', (20, 184, 166)),
        ('ID3v2.4 Smart Metadata Ingestion', 'Artist, Featured Acts, Producer, ISRC, BPM, Key and High-Res 1400px Album Art pre-tagged.', (34, 211, 238)),
        ('Hot Cues A-H Pre-Programmed', 'Color-coded memory points for breakdown, drop 1, build-up, and transition mix-out zones.', (16, 185, 129))
    ]
    for idx, (h, b, col) in enumerate(specs):
        sy = 680 + idx * 70
        draw_card(im, (110, sy, 1490, sy + 60), fill_col=(255, 255, 255, 6), border_col=(255, 255, 255, 12))
        draw.text((130, sy + 10), h, fill=col, font=f_sm)
        draw.text((130, sy + 34), b, fill=(148, 163, 184), font=f_xs)

    im.save(os.path.join(OUT_DIR, 'dj_hero_3.png'), quality=95)
    print('Generated dj_hero_3.png')

# DJ Hero 4: Unreleased Dubplates & Live Crowd Reaction Engine
def gen_dj_4():
    im = create_canvas(1600, 1000, (14, 12, 28), (4, 4, 14))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 560, 108), 'EARLY ACCESS ARTIST DROPS & CROWD REACTION FEEDBACK', (20, 184, 166), (20, 184, 166, 35), (20, 184, 166))
    draw.text((80, 126), 'Exclusive Unreleased Dubplates & Direct A&R Dancefloor Telemetry', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'Test pre-release music in clubs and festivals. Send verified crowd reaction ratings directly back to producers and record labels.', fill=(148, 163, 184), font=f_sm)

    drops = [
        ('Kalonje Dubplate #04 · Nairobi Night Mix', 'Pre-Release Exclusive', 'Dancefloor Rating: 9.8 / 10', 'A&R Action: Priority Single', (20, 184, 166)),
        ('Amina Mwangi · Afro-Soul Club Rework', 'VIP Test Pressing', 'Dancefloor Rating: 9.4 / 10', 'A&R Action: Cleared for Release', (34, 211, 238)),
        ('Cyberwave 002 · Modular Tech Beat', 'Dubplate Promo Drop', 'Dancefloor Rating: 9.6 / 10', 'A&R Action: Remix Stems Ingested', (168, 85, 247)),
    ]
    for i, (title, tag, rating, action, col) in enumerate(drops):
        x = 80 + i * 490
        draw_card(im, (x, 240, x + 460, 560))
        draw_pill(im, (x + 20, 260, x + 440, 296), tag, col, (col[0], col[1], col[2], 25), col)
        draw.text((x + 20, 316), title, fill=(255, 255, 255), font=f_md)
        draw.text((x + 20, 370), rating, fill=(16, 185, 129), font=f_sm)
        draw.line([(x + 20, 410), (x + 440, 410)], fill=(255, 255, 255, 20), width=1)
        draw_pill(im, (x + 20, 430, x + 440, 470), action, col, (col[0], col[1], col[2], 30), col)

    draw_card(im, (80, 600, 1520, 920))
    draw.text((110, 630), 'Real-Time Crowd Response Scoring Loop', fill=(255, 255, 255), font=f_md)
    draw.text((110, 670), 'When you spin a dubplate, your Rekordbox/Serato setlist telemetry captures crowd peak energy. Record labels reward participating DJs with unified credits, VIP tour passes, and exclusive production advance access.', fill=(148, 163, 184), font=f_sm)
    draw_pill(im, (110, 750, 460, 790), 'DIRECT TASTE-MAKER REVENUE SHARE', (16, 185, 129), (16, 185, 129, 30), (16, 185, 129))
    draw_pill(im, (480, 750, 840, 790), 'AUTOMATED SETLIST ISRC LOGGING', (34, 211, 238), (34, 211, 238, 30), (34, 211, 238))

    im.save(os.path.join(OUT_DIR, 'dj_hero_4.png'), quality=95)
    print('Generated dj_hero_4.png')

# Label Hero 3: A&R Talent Scouting & Stream Velocity Radar
def gen_label_3():
    im = create_canvas(1600, 1000, (14, 14, 30), (6, 6, 16))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 560, 108), 'A&R TALENT DISCOVERY & STREAMING VELOCITY RADAR', (168, 85, 247), (168, 85, 247, 35), (168, 85, 247))
    draw.text((80, 126), 'Predictive Breakthrough Artist Intelligence & Signing Radar', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'Identify viral breakout creators across Nairobi, Lagos, and London before traditional labels. Underwrite with data.', fill=(148, 163, 184), font=f_sm)

    acts = [
        ('Breakout Act: Ndufo', 'Streaming Velocity: +184% MoM', 'Projected 12M Gross: $180,000', 'Radar: Ready to Sign', (16, 185, 129)),
        ('Breakout Act: Amina Mwangi', 'Streaming Velocity: +142% MoM', 'Projected 12M Gross: $125,000', 'Radar: Tour Underwriting Open', (34, 211, 238)),
        ('Breakout Act: DJ Kalonje', 'Streaming Velocity: +210% MoM', 'Projected 12M Gross: $290,000', 'Radar: Headliner Tier Match', (168, 85, 247)),
    ]
    for i, (name, vel, gross, action, col) in enumerate(acts):
        x = 80 + i * 490
        draw_card(im, (x, 240, x + 460, 560))
        draw_pill(im, (x + 20, 260, x + 440, 296), action, col, (col[0], col[1], col[2], 25), col)
        draw.text((x + 20, 316), name, fill=(255, 255, 255), font=f_md)
        draw.text((x + 20, 370), vel, fill=(16, 185, 129), font=f_sm)
        draw.text((x + 20, 410), gross, fill=(255, 255, 255), font=f_sm)
        draw.line([(x + 20, 450), (x + 440, 450)], fill=(255, 255, 255, 20), width=1)
        draw_pill(im, (x + 20, 470, x + 440, 510), 'FULL TELEMETRY AUDIT', col, (col[0], col[1], col[2], 30), col)

    draw_card(im, (80, 600, 1520, 920))
    draw.text((110, 630), 'Global Demographic Heatmap & Diaspora Penetration', fill=(255, 255, 255), font=f_md)
    draw.text((110, 670), 'Our AI models cross-reference Spotify, YouTube, TikTok, TuneStream, and club DJ setlists across 48 worldwide corridors, providing record labels with indisputable signing and advance underwriting models.', fill=(148, 163, 184), font=f_sm)
    draw_pill(im, (110, 750, 460, 790), 'MACHINE LEARNING AUDIENCE SCORING', (16, 185, 129), (16, 185, 129, 30), (16, 185, 129))
    draw_pill(im, (480, 750, 840, 790), 'CROSS-CORRIDOR AUDIENCE MAPPING', (34, 211, 238), (34, 211, 238, 30), (34, 211, 238))

    im.save(os.path.join(OUT_DIR, 'label_hero_3.png'), quality=95)
    print('Generated label_hero_3.png')

# Label Hero 4: Global Rights Management & DDEX Catalog Clearance
def gen_label_4():
    im = create_canvas(1600, 1000, (16, 10, 24), (6, 4, 12))
    draw = ImageDraw.Draw(im)
    draw_pill(im, (80, 70, 580, 108), 'GLOBAL RIGHTS MANAGEMENT & DDEX CATALOG CLEARANCE', (168, 85, 247), (168, 85, 247, 35), (168, 85, 247))
    draw.text((80, 126), 'Automated ISRC / ISWC Registration & CMO / PRO Collection', fill=(255, 255, 255), font=f_xl)
    draw.text((80, 180), 'Eliminate uncollected black box royalties across MCSK, KECOBO, SAMRO, PRS for Music, BMI, and ASCAP.', fill=(148, 163, 184), font=f_sm)

    societies = [
        ('MCSK & KECOBO (East Africa)', 'Direct Mechanical & Performance Sync', '100% Registration Status', (16, 185, 129)),
        ('SAMRO & CAPASSO (South Africa)', 'Amapiano & Southern Africa Royalty Pool', 'Auto-Matched ISRC', (34, 211, 238)),
        ('PRS for Music & PPL (UK/EU)', 'European Diaspora Radio & Club Royalty', 'Automated CWR Exchange', (168, 85, 247)),
        ('BMI / ASCAP / SoundExchange (US)', 'Global Digital Audio Performance Royalties', 'DDEX Direct Link', (245, 158, 11))
    ]
    for idx, (soc, desc, stat, col) in enumerate(societies):
        sy = 240 + idx * 80
        draw_card(im, (80, sy, 1520, sy + 70), fill_col=(255, 255, 255, 8), border_col=(255, 255, 255, 16))
        draw.text((110, sy + 14), soc, fill=(255, 255, 255), font=f_sm)
        draw.text((110, sy + 40), desc, fill=(148, 163, 184), font=f_xs)
        draw_pill(im, (1240, sy + 18, 1490, sy + 54), stat, col, (col[0], col[1], col[2], 30), col)

    draw_card(im, (80, 600, 1520, 920))
    draw.text((110, 630), 'Automated Common Works Registration (CWR) Pipeline', fill=(255, 255, 255), font=f_md)
    draw.text((110, 670), 'Every song uploaded into TuneLabel has its metadata compiled into DDEX and CWR compliant formats, delivering instantaneous work registrations across all international societies and safeguarding label equity.', fill=(148, 163, 184), font=f_sm)
    draw_pill(im, (110, 750, 440, 790), 'DDEX CWR 3.0 READY', (16, 185, 129), (16, 185, 129, 30), (16, 185, 129))
    draw_pill(im, (460, 750, 800, 790), 'ZERO BLACK-BOX WITHHOLDING', (34, 211, 238), (34, 211, 238, 30), (34, 211, 238))

    im.save(os.path.join(OUT_DIR, 'label_hero_4.png'), quality=95)
    print('Generated label_hero_4.png')

if __name__ == '__main__':
    gen_affiliate_1()
    gen_affiliate_2()
    gen_affiliate_3()
    gen_affiliate_4()
    gen_affiliate_5()
    gen_vc_hero()
    gen_dj_visuals()
    gen_dj_3()
    gen_dj_4()
    gen_label_visuals()
    gen_label_3()
    gen_label_4()
    print('ALL TARGETED PERSONA VISUALS GENERATED SUCCESSFULLY!')
