import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Intermaven Network & TuneMavens - Pitch Deck</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        html, body {
            margin: 0;
            padding: 0;
            background-color: #070e18;
            font-family: 'Inter', -apple-system, sans-serif;
            color: #e2e8f0;
            font-size: 13px;
            line-height: 1.45;
        }
        
        .slide {
            width: 297mm;
            height: 210mm;
            position: relative;
            page-break-after: always;
            page-break-inside: avoid;
            background: radial-gradient(circle at 80% 20%, #0d2238 0%, #070e18 70%);
            padding: 22mm 24mm 16mm 24mm;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .slide::before {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: 
                linear-gradient(rgba(34, 211, 238, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(34, 211, 238, 0.03) 1px, transparent 1px);
            background-size: 20mm 20mm;
            pointer-events: none;
            z-index: 1;
        }

        .slide-content {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .slide-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 14px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 10px;
        }
        .header-left {
            display: flex;
            flex-direction: column;
        }
        .slide-category {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #00f0ff;
            margin-bottom: 3px;
        }
        .slide-title {
            font-family: 'Outfit', sans-serif;
            font-size: 23px;
            font-weight: 800;
            color: #ffffff;
            margin: 0;
            letter-spacing: -0.3px;
        }
        .slide-subtitle {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 2px;
        }
        .header-badge {
            background: rgba(0, 240, 255, 0.1);
            border: 1px solid rgba(0, 240, 255, 0.3);
            color: #38bdf8;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            white-space: nowrap;
        }

        .slide-footer {
            position: relative;
            z-index: 2;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding-top: 8px;
            margin-top: auto;
            font-size: 10px;
            color: #64748b;
        }
        .footer-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .footer-tag {
            color: #00f0ff;
            font-weight: 600;
        }

        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            flex: 1;
        }
        .grid-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 14px;
            flex: 1;
        }
        .grid-4 {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            flex: 1;
        }
        .grid-sidebar {
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            gap: 16px;
            flex: 1;
        }

        .card {
            background: rgba(15, 23, 42, 0.65);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 6px;
            padding: 12px 14px;
            display: flex;
            flex-direction: column;
            backdrop-filter: blur(8px);
        }
        .card-glow-cyan {
            border-left: 3px solid #00f0ff;
            background: linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%);
        }
        .card-glow-purple {
            border-left: 3px solid #a855f7;
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%);
        }
        .card-glow-gold {
            border-left: 3px solid #f59e0b;
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%);
        }
        .card-glow-emerald {
            border-left: 3px solid #10b981;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%);
        }

        .card-title {
            font-family: 'Outfit', sans-serif;
            font-size: 14px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .metric-banner {
            display: flex;
            gap: 12px;
            margin-bottom: 12px;
        }
        .metric-box {
            flex: 1;
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            padding: 9px 12px;
            text-align: left;
        }
        .metric-label {
            font-size: 9.5px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #94a3b8;
            margin-bottom: 2px;
        }
        .metric-value {
            font-family: 'Outfit', sans-serif;
            font-size: 19px;
            font-weight: 800;
            color: #00f0ff;
        }
        .metric-sub {
            font-size: 9.5px;
            color: #cbd5e1;
            margin-top: 2px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
        }
        th {
            background: rgba(30, 41, 59, 0.7);
            color: #38bdf8;
            text-align: left;
            padding: 6px 9px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }
        td {
            padding: 5.5px 9px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            color: #cbd5e1;
        }
        tr:nth-child(even) {
            background: rgba(255, 255, 255, 0.02);
        }
        .highlight-row {
            background: rgba(0, 240, 255, 0.08) !important;
            font-weight: 600;
            color: #ffffff;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-cyan { color: #00f0ff; font-weight: 600; }
        .text-purple { color: #c084fc; font-weight: 600; }
        .text-gold { color: #f59e0b; font-weight: 600; }
        .text-emerald { color: #34d399; font-weight: 600; }

        .flow-chain {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
            margin: 8px 0;
        }
        .flow-node {
            flex: 1;
            background: rgba(30, 41, 59, 0.85);
            border: 1px solid rgba(0, 240, 255, 0.3);
            border-radius: 6px;
            padding: 8px 10px;
            text-align: center;
        }
        .flow-node-title {
            font-family: 'Outfit', sans-serif;
            font-size: 11.5px;
            font-weight: 700;
            color: #ffffff;
        }
        .flow-node-sub {
            font-size: 9.5px;
            color: #94a3b8;
            margin-top: 2px;
        }
        .flow-arrow {
            color: #00f0ff;
            font-size: 13px;
            font-weight: 900;
        }

        .cover-slide {
            justify-content: center;
            align-items: flex-start;
            padding: 36mm 28mm;
            background: radial-gradient(circle at 85% 30%, #103353 0%, #070e18 75%);
        }
        .cover-tag {
            background: rgba(0, 240, 255, 0.15);
            border: 1px solid #00f0ff;
            color: #00f0ff;
            padding: 5px 12px;
            border-radius: 4px;
            font-size: 10.5px;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            display: inline-block;
            margin-bottom: 16px;
        }
        .cover-title {
            font-family: 'Outfit', sans-serif;
            font-size: 40px;
            font-weight: 900;
            color: #ffffff;
            line-height: 1.15;
            margin: 0 0 12px 0;
            letter-spacing: -1px;
        }
        .cover-title span {
            background: linear-gradient(135deg, #00f0ff, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .cover-sub {
            font-size: 15px;
            color: #94a3b8;
            max-width: 680px;
            line-height: 1.5;
            margin-bottom: 24px;
        }
        .cover-meta {
            display: flex;
            gap: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.12);
            padding-top: 16px;
            width: 100%;
        }
        .cover-meta-item {
            display: flex;
            flex-direction: column;
        }
        .cover-meta-label {
            font-size: 9.5px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .cover-meta-value {
            font-size: 12.5px;
            color: #e2e8f0;
            font-weight: 600;
            margin-top: 2px;
        }
        
        ul.bullet-list {
            margin: 0;
            padding-left: 16px;
        }
        ul.bullet-list li {
            margin-bottom: 5px;
            color: #cbd5e1;
            font-size: 11px;
        }
        ul.bullet-list li strong {
            color: #ffffff;
        }
    </style>
</head>
<body>

    <!-- ==================== SLIDE 1: COVER ==================== -->
    <div class="slide cover-slide">
        <div class="slide-content">
            <div class="cover-tag">Growth Capital & Revolving Facility Deck</div>
            <h1 class="cover-title">Intermaven Network <span>& TuneMavens</span></h1>
            <p class="cover-sub">
                Bridging Next-Generation Music Creator SaaS, Sony Music Publishing Sync Syndication, Lossless Streaming Commerce, and High-Yield Live Event Real Estate.
            </p>

            <div style="display: flex; gap: 12px; margin-bottom: 24px;">
                <div class="metric-box" style="width: 215px; border-color: rgba(0, 240, 255, 0.4);">
                    <div class="metric-label">Target Facility Cap</div>
                    <div class="metric-value">KES 1,500,000</div>
                    <div class="metric-sub">~$12,000 USD Revolving Line</div>
                </div>
                <div class="metric-box" style="width: 215px; border-color: rgba(168, 85, 247, 0.4);">
                    <div class="metric-label">Initial Drawdown</div>
                    <div class="metric-value" style="color: #c084fc;">KES 450,000</div>
                    <div class="metric-sub">3-Month Rollout Runway</div>
                </div>
                <div class="metric-box" style="width: 215px; border-color: rgba(16, 185, 129, 0.4);">
                    <div class="metric-label">Primary Live Anchor</div>
                    <div class="metric-value" style="color: #34d399;">Fri Nov 27, 2026</div>
                    <div class="metric-sub">Weekly at B52 Lounge, Nairobi</div>
                </div>
                <div class="metric-box" style="width: 215px; border-color: rgba(245, 158, 11, 0.4);">
                    <div class="metric-label">Publishing & Sync Tier</div>
                    <div class="metric-value" style="color: #f59e0b;">$120K+ Deals</div>
                    <div class="metric-sub">Sony Partnership + ASCAP House</div>
                </div>
            </div>

            <div class="cover-meta">
                <div class="cover-meta-item">
                    <span class="cover-meta-label">Corporate Entities</span>
                    <span class="cover-meta-value">Intermaven Network, LTD (KE) • Maven Global Inc. (USA)</span>
                </div>
                <div class="cover-meta-item">
                    <span class="cover-meta-label">Key Platforms</span>
                    <span class="cover-meta-value">tunemavens.com • tunestream.music • syncmavens.com</span>
                </div>
                <div class="cover-meta-item">
                    <span class="cover-meta-label">Publishing House</span>
                    <span class="cover-meta-value">TuneMavens Publishing (ASCAP Registered)</span>
                </div>
                <div class="cover-meta-item">
                    <span class="cover-meta-label">Date & Launch</span>
                    <span class="cover-meta-value">November 2026 • Opening Friday Nov 27th</span>
                </div>
            </div>
        </div>
        <div class="slide-footer">
            <div class="footer-left"><span class="footer-tag">INTERMAVEN NETWORK</span> | Confidential Executive Presentation</div>
            <div>01 / 12</div>
        </div>
    </div>

    <!-- ==================== SLIDE 2: PROBLEM & OPPORTUNITY ==================== -->
    <div class="slide">
        <div class="slide-content">
            <div class="slide-header">
                <div class="header-left">
                    <span class="slide-category">Market Disruption</span>
                    <h2 class="slide-title">The Market Problem & Advance Capital Bottleneck</h2>
                    <span class="slide-subtitle">Independent creators and live promoters face acute cash flow friction and fragmented software</span>
                </div>
                <div class="header-badge">Market Gap: $1.2B African Creative Economy</div>
            </div>

            <div class="grid-3">
                <div class="card card-glow-cyan">
                    <div class="card-title">1. The Live Capital Trap</div>
                    <p style="color: #94a3b8; font-size: 11px; margin-bottom: 8px;">
                        Live events drive majority cash flow, but advance capital is broken:
                    </p>
                    <ul class="bullet-list">
                        <li><strong>Upfront Drain:</strong> Sound, security, marketing, and talent deposits must be paid 7–14 days before show night.</li>
                        <li><strong>Receivable Delays:</strong> Venue guarantees and corporate brand sponsorships settle net-14 to net-30.</li>
                        <li><strong>Predatory Labels:</strong> Traditional label tour support demands 360-deals, seizing master copyrights and publishing rights.</li>
                    </ul>
                </div>

                <div class="card card-glow-purple">
                    <div class="card-title">2. Fragmented Tooling & Churn</div>
                    <p style="color: #94a3b8; font-size: 11px; margin-bottom: 8px;">
                        Creators are forced to patch together 5+ disjointed subscription apps:
                    </p>
                    <ul class="bullet-list">
                        <li><strong>SaaS Subscription Fatigue:</strong> Creators release music episodically. Monthly charges lead to 12% monthly churn.</li>
                        <li><strong>Siloed Fan Data:</strong> Mailchimp, DistroKid, and Spotify do not talk to each other; fan contacts are lost.</li>
                        <li><strong>Uncollected Sync Royalties:</strong> Without ASCAP publishing administration, independent sync royalties go uncollected.</li>
                    </ul>
                </div>

                <div class="card card-glow-gold">
                    <div class="card-title">3. The Intermaven Solution</div>
                    <p style="color: #94a3b8; font-size: 11px; margin-bottom: 8px;">
                        A unified creator ecosystem backed by cash-generative weekly live residencies:
                    </p>
                    <ul class="bullet-list">
                        <li><strong>Credit-Based Moat:</strong> Non-expiring unified credits with zero monthly recurring charges. 100% upfront float.</li>
                        <li><strong>Live Proving Ground:</strong> Weekly Friday residency at B52 Lounge generating immediate weekly cash flow.</li>
                        <li><strong>Institutional Publishing:</strong> Direct pipeline to $120,000+ Sony Music Publishing sync placements.</li>
                    </ul>
                </div>
            </div>

            <div class="metric-banner" style="margin-top: 12px;">
                <div class="metric-box">
                    <div class="metric-label">East Africa Live Music Growth</div>
                    <div class="metric-value">+28.4% YoY</div>
                    <div class="metric-sub">Fastest growing regional circuit</div>
                </div>
                <div class="metric-box">
                    <div class="metric-label">Mobile Money Penetration</div>
                    <div class="metric-value">>85% M-Pesa</div>
                    <div class="metric-sub">Cards under 5%; instant mobile STK push required</div>
                </div>
                <div class="metric-box">
                    <div class="metric-label">Sony Publishing Benchmark</div>
                    <div class="metric-value">$120,000 USD</div>
                    <div class="metric-sub">Starting sync placement value + $70k/yr royalties</div>
                </div>
            </div>
        </div>
        <div class="slide-footer">
            <div class="footer-left"><span class="footer-tag">INTERMAVEN NETWORK</span> | Market Thesis</div>
            <div>02 / 12</div>
        </div>
    </div>

    <!-- ==================== SLIDE 3: CLOSED-LOOP ECOSYSTEM ==================== -->
    <div class="slide">
        <div class="slide-content">
            <div class="slide-header">
                <div class="header-left">
                    <span class="slide-category">Platform Architecture</span>
                    <h2 class="slide-title">The Closed-Loop Intermaven Ecosystem</h2>
                    <span class="slide-subtitle">Four integrated microservices unified by Single Sign-On and a shared credit engine</span>
                </div>
                <div class="header-badge">Dual Corporation: KE & USA</div>
            </div>

            <div class="grid-4" style="margin-bottom: 12px;">
                <div class="card" style="border-top: 3px solid #00f0ff;">
                    <div class="card-title" style="font-size: 12.5px;">Intermaven Mother<br><span style="color:#00f0ff; font-size:10px;">intermaven.io</span></div>
                    <ul class="bullet-list" style="font-size: 10.5px; padding-left: 12px;">
                        <li>Parent SSO authentication</li>
                        <li>FastAPI Microservices backend</li>
                        <li>Smart CRM Broadcasts (WhatsApp/SMS)</li>
                        <li>Hostinger Reseller & Domain engine</li>
                    </ul>
                </div>

                <div class="card" style="border-top: 3px solid #a855f7;">
                    <div class="card-title" style="font-size: 12.5px;">TuneMavens SaaS<br><span style="color:#c084fc; font-size:10px;">tunemavens.com</span></div>
                    <ul class="bullet-list" style="font-size: 10.5px; padding-left: 12px;">
                        <li>Standalone Creator Web Worlds (EPK)</li>
                        <li>TuneMavens Publishing (ASCAP)</li>
                        <li>Split Cascade Waterfall Ledger</li>
                        <li>AI Mastering & Prompt Studio</li>
                    </ul>
                </div>

                <div class="card" style="border-top: 3px solid #f59e0b;">
                    <div class="card-title" style="font-size: 12.5px;">TuneStream DSP<br><span style="color:#f59e0b; font-size:10px;">tunestream.music</span></div>
                    <ul class="bullet-list" style="font-size: 10.5px; padding-left: 12px;">
                        <li>Lossless audio streaming & store</li>
                        <li>Direct album ($9.99) & single sales</li>
                        <li>Stems & Producer Vault</li>
                        <li>Artist tipping & direct fan connection</li>
                    </ul>
                </div>

                <div class="card" style="border-top: 3px solid #10b981;">
                    <div class="card-title" style="font-size: 12.5px;">SyncMavens<br><span style="color:#34d399; font-size:10px;">syncmavens.com</span></div>
                    <ul class="bullet-list" style="font-size: 10.5px; padding-left: 12px;">
                        <li>Sony Music Publishing submission desk</li>
                        <li>$120K Sony deals / $10K indie syncs</li>
                        <li>Guaranteed Waterfall Split Method</li>
                        <li>100% writer publishing retained</li>
                    </ul>
                </div>
            </div>

            <div class="card card-glow-cyan" style="padding: 10px 16px;">
                <div class="card-title" style="margin-bottom: 4px; font-size: 12.5px;">Synergy with Physical Real-Estate: The Live Entertainment Flywheel</div>
                <div class="flow-chain">
                    <div class="flow-node">
                        <div class="flow-node-title">Creator Discovery</div>
                        <div class="flow-node-sub">TuneMavens EPK & Discography</div>
                    </div>
                    <div class="flow-arrow">→</div>
                    <div class="flow-node">
                        <div class="flow-node-title">Fan Engagement</div>
                        <div class="flow-node-sub">TuneStream Lossless Audio</div>
                    </div>
                    <div class="flow-arrow">→</div>
                    <div class="flow-node">
                        <div class="flow-node-title">Live Residency</div>
                        <div class="flow-node-sub">B52 Lounge Weekly Friday Showcase</div>
                    </div>
                    <div class="flow-arrow">→</div>
                    <div class="flow-node">
                        <div class="flow-node-title">Cash & Top-Up Recoupment</div>
                        <div class="flow-node-sub">Venue Guarantee + Bar Split + Merch</div>
                    </div>
                    <div class="flow-arrow">→</div>
                    <div class="flow-node">
                        <div class="flow-node-title">Revolving Facility Repayment</div>
                        <div class="flow-node-sub">Automated Senior Split Waterfall</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="slide-footer">
            <div class="footer-left"><span class="footer-tag">INTERMAVEN NETWORK</span> | Technology Moat</div>
            <div>03 / 12</div>
        </div>
    </div>

    <!-- ==================== SLIDE 4: CREDIT-BASED MOAT ==================== -->
    <div class="slide">
        <div class="slide-content">
            <div class="slide-header">
                <div class="header-left">
                    <span class="slide-category">Business Model Advantage</span>
                    <h2 class="slide-title">Strictly Credit-Based Pre-Paid Engine</h2>
                    <span class="slide-subtitle">Zero monthly subscriptions • Zero churn friction • 100% upfront working capital float</span>
                </div>
                <div class="header-badge">Anti-SaaS Churn Architecture</div>
            </div>

            <div class="grid-sidebar">
                <div class="card card-glow-emerald">
                    <div class="card-title">How the Unified Credit Top-Up Engine Works</div>
                    <p style="color: #cbd5e1; font-size: 11.5px; margin-bottom: 10px;">
                        The entire Intermaven ecosystem completely rejects monthly recurring billing. Every service, compute action, and store item is fueled by non-expiring <strong>Unified Network Credits</strong>:
                    </p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <div style="background: rgba(0,0,0,0.3); padding: 7px 9px; border-radius: 4px; border-left: 2px solid #00f0ff;">
                            <div style="color: #00f0ff; font-weight: 700; font-size: 10.5px;">Universal In-Context Reload</div>
                            <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">One-click M-Pesa STK push (min KES 200) and Stripe Card (min $5.00).</div>
                        </div>
                        <div style="background: rgba(0,0,0,0.3); padding: 7px 9px; border-radius: 4px; border-left: 2px solid #a855f7;">
                            <div style="color: #c084fc; font-weight: 700; font-size: 10.5px;">Non-Expiring Utility</div>
                            <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Credits never expire. Creators feel zero subscription pressure or penalty.</div>
                        </div>
                        <div style="background: rgba(0,0,0,0.3); padding: 7px 9px; border-radius: 4px; border-left: 2px solid #f59e0b;">
                            <div style="color: #f59e0b; font-weight: 700; font-size: 10.5px;">Earn & Burn Flywheel</div>
                            <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Tips and music sales convert to credits to buy mastering or WhatsApp CRM ads.</div>
                        </div>
                        <div style="background: rgba(0,0,0,0.3); padding: 7px 9px; border-radius: 4px; border-left: 2px solid #10b981;">
                            <div style="color: #34d399; font-weight: 700; font-size: 10.5px;">Hostinger Reseller Link</div>
                            <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">Domain registrations and EPK hosting paid seamlessly in platform credits.</div>
                        </div>
                    </div>

                    <div style="margin-top: 10px; background: rgba(30, 41, 59, 0.6); padding: 8px 10px; border-radius: 4px;">
                        <span style="color: #ffffff; font-weight: 700; font-size: 11px;">Why Investors Value This Over Traditional SaaS:</span>
                        <div style="color: #94a3b8; font-size: 10.5px; margin-top: 3px;">
                            • <strong>Negative Working Capital:</strong> Cash is collected upfront at reload; costs occur only as credits are spent.<br>
                            • <strong>Zero Cancellation Churn:</strong> No monthly billing drops or churn cohort decay during off-seasons.<br>
                            • <strong>Higher Lifetime Value:</strong> Active creators reload KES 2,000–5,000 during release cycles without hesitation.
                        </div>
                    </div>
                </div>

                <div class="card card-glow-gold">
                    <div class="card-title">Credit Pricing & Usage Matrix</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Service / Action</th>
                                <th>Credit Cost</th>
                                <th>Cash Equiv.</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>TuneStream Full Album</td>
                                <td class="text-cyan">50 Credits</td>
                                <td>$9.99 / KES 1,300</td>
                            </tr>
                            <tr>
                                <td>Lossless Single Audio</td>
                                <td class="text-cyan">5 Credits</td>
                                <td>$0.99 / KES 130</td>
                            </tr>
                            <tr>
                                <td>Producer Stem Pack</td>
                                <td class="text-purple">150–500 Credits</td>
                                <td>$29.99 – $99.00</td>
                            </tr>
                            <tr>
                                <td>Sony Sync Submission Fee</td>
                                <td class="text-gold">150 Credits</td>
                                <td>$30.00 / KES 3,900</td>
                            </tr>
                            <tr>
                                <td>Hostinger Web World Setup</td>
                                <td class="text-gold">125 Credits</td>
                                <td>$25.00 / KES 3,250</td>
                            </tr>
                            <tr>
                                <td>Storage Upgrade (+1GB)</td>
                                <td class="text-emerald">25 Credits</td>
                                <td>$5.00 / KES 650</td>
                            </tr>
                            <tr>
                                <td>Smart CRM WhatsApp Pack</td>
                                <td class="text-cyan">50 Credits</td>
                                <td>$10.00 / 1,000 msgs</td>
                            </tr>
                            <tr>
                                <td>AI Cover Art / Mastering</td>
                                <td class="text-purple">10 Credits</td>
                                <td>$2.00 / run</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="slide-footer">
            <div class="footer-left"><span class="footer-tag">INTERMAVEN NETWORK</span> | Monetization Architecture</div>
            <div>04 / 12</div>
        </div>
    </div>

    <!-- ==================== SLIDE 5: B52 LOUNGE RESIDENCY (VERIFIED CONVERSIONS) ==================== -->
    <div class="slide">
        <div class="slide-content">
            <div class="slide-header">
                <div class="header-left">
                    <span class="slide-category">Live Entertainment Asset</span>
                    <h2 class="slide-title">Anchor Revenue Engine: B52 Lounge Residency</h2>
                    <span class="slide-subtitle">Weekly Friday live showcase launching November 27th, 2026 in Nairobi (Verified KES & USD Metrics)</span>
                </div>
                <div class="header-badge" style="border-color:#10b981; color:#34d399;">Launch: Fri Nov 27, 2026</div>
            </div>

            <div class="metric-banner">
                <div class="metric-box" style="border-left: 3px solid #00f0ff;">
                    <div class="metric-label">Weekly Venue Guarantee</div>
                    <div class="metric-value">KES 80,000</div>
                    <div class="metric-sub">$615 USD Contracted Guarantee</div>
                </div>
                <div class="metric-box" style="border-left: 3px solid #a855f7;">
                    <div class="metric-label">Estimated Bar Sales Split</div>
                    <div class="metric-value" style="color:#c084fc;">KES 100,000</div>
                    <div class="metric-sub">$769 USD Alcohol Share / Night</div>
                </div>
                <div class="metric-box" style="border-left: 3px solid #f59e0b;">
                    <div class="metric-label">Merchandise Sales</div>
                    <div class="metric-value" style="color:#f59e0b;">KES 30,000</div>
                    <div class="metric-sub">$231 USD Gross (50% Margin = $115)</div>
                </div>
                <div class="metric-box" style="border-left: 3px solid #10b981;">
                    <div class="metric-label">Brand Sponsor Target</div>
                    <div class="metric-value" style="color:#34d399;">KES 300,000</div>
                    <div class="metric-sub">$2,308 USD Monthly Brand Inflow</div>
                </div>
            </div>

            <div class="grid-sidebar">
                <div class="card card-glow-cyan">
                    <div class="card-title">Verified Weekly & Monthly Cash Flow Breakdown (FX: 130 KES/USD)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Revenue Stream</th>
                                <th>Weekly (KES / USD)</th>
                                <th>Monthly Run-Rate (4 Wks)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Fixed Venue Contract Fee</td>
                                <td class="text-cyan">KES 80,000 ($615)</td>
                                <td class="text-cyan">KES 320,000 ($2,462)</td>
                            </tr>
                            <tr>
                                <td>Alcohol / Bar Sales Split (Est.)</td>
                                <td class="text-purple">KES 100,000 ($769)</td>
                                <td class="text-purple">KES 400,000 ($3,077)</td>
                            </tr>
                            <tr>
                                <td>Physical Merchandise Sales</td>
                                <td class="text-gold">KES 30,000 ($231)</td>
                                <td class="text-gold">KES 120,000 ($923)</td>
                            </tr>
                            <tr class="highlight-row">
                                <td><strong>Direct Event Gross Receipts</strong></td>
                                <td><strong>KES 210,000 ($1,615)</strong></td>
                                <td><strong>KES 840,000 ($6,462)</strong></td>
                            </tr>
                            <tr>
                                <td>Corporate Brand Partnerships & Ads</td>
                                <td class="text-emerald">Allocated: KES 75,000 ($577)</td>
                                <td class="text-emerald">Target: KES 300,000 ($2,308)</td>
                            </tr>
                            <tr class="highlight-row" style="background: rgba(16, 185, 129, 0.15) !important;">
                                <td><strong>COMBINED MONTHLY GROSS INFLOW</strong></td>
                                <td><strong>KES 285,000 ($2,192 / wk)</strong></td>
                                <td><strong style="color:#34d399; font-size:12.5px;">KES 1,140,000 ($8,769 / mo)</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="card card-glow-purple">
                    <div class="card-title">Residency Operational Parameters</div>
                    <ul class="bullet-list" style="font-size: 11px;">
                        <li><strong>Launch Date:</strong> <strong>Friday, November 27th, 2026</strong>.</li>
                        <li><strong>Venue Real Estate:</strong> B52 Lounge, high-density nightlife & music hub in Nairobi.</li>
                        <li><strong>Audience Target:</strong> 350+ weekly verified attendees (creators, music execs, and fans).</li>
                        <li><strong>Merchandise Unit Economics:</strong> Exact 50% COGS structure yielding KES 15,000 ($115) weekly net profit float.</li>
                        <li><strong>Safaricom M-Pesa Tills:</strong> Paybill webhooks feed gross receipts into MongoDB within 2 seconds.</li>
                        <li><strong>Senior Payback Escrow:</strong> 1st dollar Split Cascade isolates lender yield before promoter net profit.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="slide-footer">
            <div class="footer-left"><span class="footer-tag">INTERMAVEN NETWORK</span> | Live Entertainment Operations</div>
            <div>05 / 12</div>
        </div>
    </div>

    <!-- ==================== SLIDE 6: CAPITAL BUDGET (INCLUDES ENTITIES & PUBLISHING) ==================== -->
    <div class="slide">
        <div class="slide-content">
            <div class="slide-header">
                <div class="header-left">
                    <span class="slide-category">Use of Funds</span>
                    <h2 class="slide-title">Itemized 3-Month Capital Deployment Matrix</h2>
                    <span class="slide-subtitle">Initial KES 450,000 ($3,462 USD) drawdown including Corporate Entities, ASCAP & Sony Music Submissions</span>
                </div>
                <div class="header-badge">KES 450,000 Tranche 1</div>
            </div>

            <div class="grid-sidebar">
                <div class="card" style="padding: 9px 12px;">
                    <div class="card-title" style="font-size: 13px; margin-bottom: 5px;">Comprehensive Budget Allocation Table</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Item / Deployment Target</th>
                                <th>USD</th>
                                <th>KES</th>
                                <th>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Apple Developer ($99) + Google Play ($25)</td>
                                <td>$124</td>
                                <td>KES 16,500</td>
                                <td class="text-cyan">App Stores</td>
                            </tr>
                            <tr>
                                <td>Executive Press Shoot (3 Principals)</td>
                                <td>$230</td>
                                <td>KES 30,000</td>
                                <td class="text-purple">Brand / PR</td>
                            </tr>
                            <tr>
                                <td>`tunestream.music` Domain (1 Year)</td>
                                <td>$80</td>
                                <td>KES 10,400</td>
                                <td class="text-gold">Domain Asset</td>
                            </tr>
                            <tr>
                                <td>Intermaven Network, LTD (Kenya Corp Registration)</td>
                                <td>$77</td>
                                <td>KES 10,000</td>
                                <td class="text-cyan">Legal Entity</td>
                            </tr>
                            <tr>
                                <td>Maven Global Inc. (USA Corporate Entity)</td>
                                <td>$225</td>
                                <td>KES 29,250</td>
                                <td class="text-cyan">Legal Entity</td>
                            </tr>
                            <tr>
                                <td>TuneMavens Publishing ASCAP Registration</td>
                                <td>$50</td>
                                <td>KES 6,500</td>
                                <td class="text-gold">Publishing</td>
                            </tr>
                            <tr>
                                <td>Sony Music Publishing Submissions (15 songs @ $30)</td>
                                <td>$450</td>
                                <td>KES 58,500</td>
                                <td class="text-gold">Sync Float</td>
                            </tr>
                            <tr>
                                <td>Hostinger Reseller Engine Setup</td>
                                <td>$270</td>
                                <td>KES 35,000</td>
                                <td class="text-cyan">Infrastructure</td>
                            </tr>
                            <tr>
                                <td>VPS, Hostinger Renewal, Google AI ($20), Render ($1)</td>
                                <td>$154</td>
                                <td>KES 20,000</td>
                                <td class="text-cyan">Cloud (3 Mo)</td>
                            </tr>
                            <tr>
                                <td>B52 Launch Marketing (SMS CRM, Meta/TikTok)</td>
                                <td>$385</td>
                                <td>KES 50,000</td>
                                <td class="text-emerald">Marketing</td>
                            </tr>
                            <tr>
                                <td>Merchandise Working Float (50% COGS)</td>
                                <td>$346</td>
                                <td>KES 45,000</td>
                                <td class="text-gold">Inventory</td>
                            </tr>
                            <tr>
                                <td>Entertainment & DJ/Sound Engineer Float</td>
                                <td>$692</td>
                                <td>KES 90,000</td>
                                <td class="text-purple">Production</td>
                            </tr>
                            <tr>
                                <td>MCSK/PRISK/KAMP Licensing, County Sound Permits & Reserve</td>
                                <td>$375</td>
                                <td>KES 48,850</td>
                                <td class="text-emerald">Contingency</td>
                            </tr>
                            <tr class="highlight-row">
                                <td><strong>TOTAL INITIAL TRANCHE DRAWDOWN</strong></td>
                                <td><strong>$3,462</strong></td>
                                <td><strong style="color:#00f0ff;">KES 450,000</strong></td>
                                <td><strong>100% Balanced</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="card card-glow-gold">
                    <div class="card-title">Strategic Asset Multipliers</div>
                    <ul class="bullet-list" style="font-size: 11px;">
                        <li><strong>Cross-Border Corporate Structure:</strong> Dual registration of <em>Intermaven Network, LTD</em> (Kenya) and <em>Maven Global Inc.</em> (USA) enables institutional US dollar contract execution and local M-Pesa clearing.</li>
                        <li><strong>TuneMavens Publishing (ASCAP):</strong> Securing ASCAP publisher status ($50) allows direct collection of performance & mechanical royalties worldwide with 0% intermediate leakage.</li>
                        <li><strong>Sony Music Publishing Submission Desk:</strong> $30/song fee initiates review for $120,000+ sync opportunities and $70k/yr back-end royalties.</li>
                        <li><strong>Merchandise Self-Liquidation:</strong> KES 45,000 inventory turns into KES 90,000 gross over opening weeks.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="slide-footer">
            <div class="footer-left"><span class="footer-tag">INTERMAVEN NETWORK</span> | Capital Allocation</div>
            <div>06 / 12</div>
        </div>
    </div>

    <!-- ==================== SLIDE 7: 3 RETURN OPTIONS ==================== -->
    <div class="slide">
        <div class="slide-content">
            <div class="slide-header">
                <div class="header-left">
                    <span class="slide-category">Investment Structuring</span>
                    <h2 class="slide-title">Three Attractive Investor Return Options</h2>
                    <span class="slide-subtitle">Flexible structures tailored for high-yield credit funds, syndicates, and equity venture capitalists</span>
                </div>
                <div class="header-badge" style="border-color:#f59e0b; color:#f59e0b;">Investor Tailored</div>
            </div>

            <div class="grid-3">
                <div class="card card-glow-cyan" style="border-top: 3px solid #00f0ff;">
                    <div class="card-title">
                        <span>Option 1: Senior Debt</span>
                        <span style="font-size:10px; color:#00f0ff;">RECOMMENDED</span>
                    </div>
                    <div style="font-size: 21px; font-family:'Outfit',sans-serif; font-weight:800; color:#00f0ff; margin-bottom: 5px;">
                        20.0% – 24.0% p.a.
                    </div>
                    <p style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">
                        <strong>1.8% – 2.0% Monthly Yield</strong> with weekly priority liquidity.
                    </p>
                    <ul class="bullet-list" style="font-size: 10.5px;">
                        <li><strong>First-Dollar Priority:</strong> Recouped directly from Safaricom M-Pesa event collections before promoter payouts.</li>
                        <li><strong>Weekly Amortization:</strong> Capital recycles continuously, drastically lowering lender risk.</li>
                        <li><strong>Beats Bank Yields:</strong> Significantly exceeds Treasury Bonds (15–17%) and Bank Deposits (9–12%).</li>
                        <li><strong>Zero Equity Dilution:</strong> Pure debt return.</li>
                    </ul>
                </div>

                <div class="card card-glow-purple" style="border-top: 3px solid #a855f7;">
                    <div class="card-title">
                        <span>Option 2: Rev-Share Royalty</span>
                        <span style="font-size:10px; color:#c084fc;">FAST PAYBACK</span>
                    </div>
                    <div style="font-size: 21px; font-family:'Outfit',sans-serif; font-weight:800; color:#c084fc; margin-bottom: 5px;">
                        1.25x – 1.30x Cap
                    </div>
                    <p style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">
                        <strong>10% Event Gross + 5% Digital Credits</strong> until cash return cap is hit.
                    </p>
                    <ul class="bullet-list" style="font-size: 10.5px;">
                        <li><strong>Cash Multiplier:</strong> Generates KES 1,875,000 on full KES 1,500,000 facility drawdown.</li>
                        <li><strong>Accelerated Velocity:</strong> Projected full payback in <strong>7 to 9 months</strong> based on B52 run-rate.</li>
                        <li><strong>Performance-Linked:</strong> Aligns investor with ticket, bar, and digital credit reload surges.</li>
                    </ul>
                </div>

                <div class="card card-glow-gold" style="border-top: 3px solid #f59e0b;">
                    <div class="card-title">
                        <span>Option 3: SAFE + Warrant</span>
                        <span style="font-size:10px; color:#f59e0b;">VENTURE UPSIDE</span>
                    </div>
                    <div style="font-size: 21px; font-family:'Outfit',sans-serif; font-weight:800; color:#f59e0b; margin-bottom: 5px;">
                        $1.2M USD Cap
                    </div>
                    <p style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">
                        <strong>Post-Money SAFE Note</strong> with 20% discount on institutional Seed.
                    </p>
                    <ul class="bullet-list" style="font-size: 10.5px;">
                        <li><strong>Equity Upside:</strong> Converts into equity in parent Maven Global / Intermaven holding company.</li>
                        <li><strong>Growth Warrant:</strong> Option for an extra 2.5% common equity at fixed strike within 36 months.</li>
                        <li><strong>Pan-African Scale:</strong> Captures exponential 5-year value ($500M+ KES gross run-rate).</li>
                    </ul>
                </div>
            </div>

            <div class="card" style="margin-top: 10px; background: rgba(30, 41, 59, 0.4); padding: 8px 12px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:11px; color:#ffffff;"><strong>Collateral Security:</strong> Senior floating charge on B52 weekly contract receivables, M-Pesa Paybill cash, and physical merchandise.</span>
                    <span class="header-badge" style="font-size:9px;">Institutional Grade Escrow</span>
                </div>
            </div>
        </div>
        <div class="slide-footer">
            <div class="footer-left"><span class="footer-tag">INTERMAVEN NETWORK</span> | Deal Terms</div>
            <div>07 / 12</div>
        </div>
    </div>

    <!-- ==================== SLIDE 8: UNIT ECONOMICS & COVERAGE ==================== -->
    <div class="slide">
        <div class="slide-content">
            <div class="slide-header">
                <div class="header-left">
                    <span class="slide-category">Financial Underwriting</span>
                    <h2 class="slide-title">Unit Economics & Debt Service Coverage</h2>
                    <span class="slide-subtitle">Resilient 3.42x DSCR ensuring prompt weekly repayments even under stress scenarios</span>
                </div>
                <div class="header-badge" style="border-color:#10b981; color:#34d399;">DSCR: 3.42x Coverage</div>
            </div>

            <div class="grid-sidebar">
                <div class="card card-glow-cyan">
                    <div class="card-title">Monthly Operating Statement (Steady State B52 Residency)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Revenue Inflow / Expense Line</th>
                                <th class="text-right">Monthly (KES)</th>
                                <th class="text-right">Monthly (USD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Fixed Venue Contract Guarantee (4 x KES 80k)</td>
                                <td class="text-right text-cyan">KES 320,000</td>
                                <td class="text-right text-cyan">$2,462</td>
                            </tr>
                            <tr>
                                <td>Bar & Alcohol Revenue Share (4 x KES 100k)</td>
                                <td class="text-right text-purple">KES 400,000</td>
                                <td class="text-right text-purple">$3,077</td>
                            </tr>
                            <tr>
                                <td>Merchandise Gross Receipts (4 x KES 30k)</td>
                                <td class="text-right text-gold">KES 120,000</td>
                                <td class="text-right text-gold">$923</td>
                            </tr>
                            <tr>
                                <td>Corporate Brand Partnerships & Sponsorships</td>
                                <td class="text-right text-emerald">KES 300,000</td>
                                <td class="text-right text-emerald">$2,308</td>
                            </tr>
                            <tr class="highlight-row">
                                <td><strong>TOTAL MONTHLY GROSS INFLOWS</strong></td>
                                <td class="text-right"><strong style="color:#00f0ff;">KES 1,140,000</strong></td>
                                <td class="text-right"><strong style="color:#00f0ff;">$8,769</strong></td>
                            </tr>
                            <tr>
                                <td>Entertainment, Artist, DJ & Sound Lineup</td>
                                <td class="text-right" style="color:#f87171;">(KES 150,000)</td>
                                <td class="text-right" style="color:#f87171;">($1,154)</td>
                            </tr>
                            <tr>
                                <td>Event Marketing, Digital Ads & Smart CRM Outreach</td>
                                <td class="text-right" style="color:#f87171;">(KES 110,000)</td>
                                <td class="text-right" style="color:#f87171;">($846)</td>
                            </tr>
                            <tr>
                                <td>Merchandise COGS (50% of gross)</td>
                                <td class="text-right" style="color:#f87171;">(KES 60,000)</td>
                                <td class="text-right" style="color:#f87171;">($462)</td>
                            </tr>
                            <tr>
                                <td>Tech Stack & Microservices (VPS, AI Pro, Render)</td>
                                <td class="text-right" style="color:#f87171;">(KES 13,300)</td>
                                <td class="text-right" style="color:#f87171;">($102)</td>
                            </tr>
                            <tr>
                                <td>Event Ops, Sound Engineer, Ushers, Security & Permits</td>
                                <td class="text-right" style="color:#f87171;">(KES 70,000)</td>
                                <td class="text-right" style="color:#f87171;">($538)</td>
                            </tr>
                            <tr class="highlight-row">
                                <td><strong>TOTAL MONTHLY OPERATING EXPENSE</strong></td>
                                <td class="text-right"><strong style="color:#f87171;">(KES 403,300)</strong></td>
                                <td class="text-right"><strong style="color:#f87171;">($3,102)</strong></td>
                            </tr>
                            <tr class="highlight-row" style="background: rgba(16, 185, 129, 0.15) !important;">
                                <td><strong>NET MONTHLY OPERATING CASH FLOW</strong></td>
                                <td class="text-right"><strong style="color:#34d399; font-size:12px;">KES 736,700</strong></td>
                                <td class="text-right"><strong style="color:#34d399; font-size:12px;">$5,667</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="card card-glow-emerald">
                    <div class="card-title">Debt Service Coverage & Downside Stress Test</div>
                    <div style="background: rgba(0,0,0,0.3); padding: 9px; border-radius: 4px; margin-bottom: 10px;">
                        <div class="metric-label">Debt Service Requirement</div>
                        <div style="font-size: 16px; font-weight:800; color:#34d399; font-family:'Outfit';">KES 215,000 / month ($1,654)</div>
                        <div style="font-size: 10px; color:#94a3b8;">Amortizing KES 500k outstanding principal + interest</div>
                    </div>

                    <div style="font-size: 11px; font-weight: 700; color: #ffffff; margin-bottom: 5px;">Downside Scenario Modeling:</div>
                    <ul class="bullet-list" style="font-size: 10.5px;">
                        <li><strong>Stress Case 1: Zero Brand Deals:</strong> Even with KES 0 from sponsors, gross event revenue is <strong>KES 840,000 ($6,462)</strong>; net cash flow of KES 436,700 still covers debt service by <strong>2.03x</strong>.</li>
                        <li><strong>Stress Case 2: 40% Rain / Bad Weather Hit:</strong> Bar sales drops to KES 60k/wk; fixed venue guarantee (KES 80k) cushions downside; facility service is preserved.</li>
                        <li><strong>Receivable Timing Bridge:</strong> The revolving line bridges corporate sponsor Net-30 payment terms without stalling weekly show production.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="slide-footer">
            <div class="footer-left"><span class="footer-tag">INTERMAVEN NETWORK</span> | Risk & Underwriting</div>
            <div>08 / 12</div>
        </div>
    </div>

    <!-- ==================== SLIDE 9: SONY SYNC & TUNESTREAM ==================== -->
    <div class="slide">
        <div class="slide-content">
            <div class="slide-header">
                <div class="header-left">
                    <span class="slide-category">High-Value Digital Assets</span>
                    <h2 class="slide-title">Sony Sync Licensing & TuneStream Music Store</h2>
                    <span class="slide-subtitle">$120,000 Sony Music Publishing sync placements, $70k/yr royalties, and lossless digital sales</span>
                </div>
                <div class="header-badge" style="border-color:#f59e0b; color:#f59e0b;">Sony Publishing Deal Flow</div>
            </div>

            <div class="grid-sidebar">
                <div class="card card-glow-gold">
                    <div class="card-title">Sony Music Publishing Sync Engine & Guaranteed Waterfall</div>
                    <p style="color: #cbd5e1; font-size: 11px; margin-bottom: 8px;">
                        Through our partnership with <strong>Sony Music Publishing</strong> and registration with <strong>ASCAP</strong> via TuneMavens Publishing, our catalog is submitted directly for global Tier-1 sync placements:
                    </p>
                    <table style="margin-bottom: 8px;">
                        <thead>
                            <tr>
                                <th>Sync Deal Tier</th>
                                <th>Benchmark Deal Size</th>
                                <th>Platform Revenue</th>
                                <th>Back-End Royalties</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-gold"><strong>Sony Music Publishing Placement</strong></td>
                                <td><strong>$120,000 USD+</strong> (KES 15.6M)</td>
                                <td class="text-cyan"><strong>$21,000</strong> (17.5% take)</td>
                                <td class="text-emerald"><strong>$70,000+/yr</strong> (ASCAP/PRO)</td>
                            </tr>
                            <tr>
                                <td class="text-purple"><strong>Indie Marketplace Sync Placement</strong></td>
                                <td><strong>$10,000 USD+</strong> (KES 1.3M)</td>
                                <td class="text-cyan"><strong>$1,500</strong> (15% take)</td>
                                <td class="text-emerald"><strong>$8,000+/yr</strong></td>
                            </tr>
                        </tbody>
                    </table>

                    <div style="background: rgba(0,0,0,0.3); padding: 8px 10px; border-radius: 4px; font-size: 10.5px; color:#cbd5e1;">
                        <span style="color:#00f0ff; font-weight:700;">Guaranteed Waterfall Method:</span> 30% Agency Partner Fee off the top → 25% TuneMavens Admin Fee from balance (17.5% gross) → 52.5% Net Creator Royalty Pool → 100% of Writer & Composer Publishing retained and administered via TuneMavens Publishing (ASCAP).
                    </div>
                </div>

                <div class="card card-glow-cyan">
                    <div class="card-title">TuneStream E-Commerce Unit Velocity</div>
                    <ul class="bullet-list" style="font-size: 10.5px;">
                        <li><strong>Lossless Audio Store:</strong> Full digital albums ($9.99 / 50 Credits) and lossless singles ($0.99 / 5 Credits) on <code>tunestream.music</code>.</li>
                        <li><strong>Sony Submission Desk:</strong> Budget of $30 per song submission creates recurring placement pipeline.</li>
                        <li><strong>Hostinger Reseller:</strong> Generates recurring $25 domain/hosting setup fees converted to credit reloads.</li>
                        <li><strong>Native Mobile Apps:</strong> iOS & Google Play store apps provide instant push notifications and M-Pesa ticketing passes.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="slide-footer">
            <div class="footer-left"><span class="footer-tag">INTERMAVEN NETWORK</span> | Publishing & Sync Economics</div>
            <div>09 / 12</div>
        </div>
    </div>

    <!-- ==================== SLIDE 10: 5-YEAR PROJECTIONS ==================== -->
    <div class="slide">
        <div class="slide-content">
            <div class="slide-header">
                <div class="header-left">
                    <span class="slide-category">Long-Term Growth</span>
                    <h2 class="slide-title">5-Year Financial Projections (2026 – 2031)</h2>
                    <span class="slide-subtitle">Scaling from KES 22.4M in Year 1 to KES 525M ($4.0M USD) by Year 5 with expanding 42.8% EBITDA</span>
                </div>
                <div class="header-badge" style="border-color:#10b981; color:#34d399;">5-Year Horizon</div>
            </div>

            <div class="card" style="margin-bottom: 10px; padding: 9px 12px;">
                <table>
                    <thead>
                        <tr>
                            <th>Financial Metric (KES '000)</th>
                            <th class="text-right">Year 1 (FY27)</th>
                            <th class="text-right">Year 2 (FY28)</th>
                            <th class="text-right">Year 3 (FY29)</th>
                            <th class="text-right">Year 4 (FY30)</th>
                            <th class="text-right">Year 5 (FY31)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Live Residencies & Tours (B52 + Expansion)</td>
                            <td class="text-right">KES 13,680</td>
                            <td class="text-right">KES 32,500</td>
                            <td class="text-right">KES 65,000</td>
                            <td class="text-right">KES 115,000</td>
                            <td class="text-right">KES 190,000</td>
                        </tr>
                        <tr>
                            <td>Pre-Paid Network Credit Reloads (TuneStream/CMS)</td>
                            <td class="text-right">KES 5,700</td>
                            <td class="text-right">KES 17,200</td>
                            <td class="text-right">KES 42,000</td>
                            <td class="text-right">KES 98,000</td>
                            <td class="text-right">KES 195,000</td>
                        </tr>
                        <tr>
                            <td>Hostinger Reseller Domain & Hosting Credits</td>
                            <td class="text-right">KES 1,200</td>
                            <td class="text-right">KES 3,800</td>
                            <td class="text-right">KES 9,500</td>
                            <td class="text-right">KES 22,000</td>
                            <td class="text-right">KES 45,000</td>
                        </tr>
                        <tr>
                            <td>Sony & Indie Sync Placement & Publishing Fees</td>
                            <td class="text-right">KES 1,800</td>
                            <td class="text-right">KES 6,500</td>
                            <td class="text-right">KES 18,000</td>
                            <td class="text-right">KES 42,000</td>
                            <td class="text-right">KES 95,000</td>
                        </tr>
                        <tr class="highlight-row">
                            <td><strong>TOTAL GROSS REVENUE (KES)</strong></td>
                            <td class="text-right"><strong style="color:#00f0ff;">KES 22,380</strong></td>
                            <td class="text-right"><strong style="color:#00f0ff;">KES 60,000</strong></td>
                            <td class="text-right"><strong style="color:#00f0ff;">KES 134,500</strong></td>
                            <td class="text-right"><strong style="color:#00f0ff;">KES 277,000</strong></td>
                            <td class="text-right"><strong style="color:#00f0ff;">KES 525,000</strong></td>
                        </tr>
                        <tr style="background: rgba(0, 240, 255, 0.05);">
                            <td><em>USD Equivalent ($1 = KES 130)</em></td>
                            <td class="text-right text-cyan"><em>$172,150</em></td>
                            <td class="text-right text-cyan"><em>$461,500</em></td>
                            <td class="text-right text-cyan"><em>$1,034,600</em></td>
                            <td class="text-right text-cyan"><em>$2,130,700</em></td>
                            <td class="text-right text-cyan"><em>$4,038,000</em></td>
                        </tr>
                        <tr>
                            <td>Cost of Goods & Talent Payouts</td>
                            <td class="text-right" style="color:#f87171;">(KES 9,200)</td>
                            <td class="text-right" style="color:#f87171;">(KES 23,800)</td>
                            <td class="text-right" style="color:#f87171;">(KES 50,500)</td>
                            <td class="text-right" style="color:#f87171;">(KES 98,000)</td>
                            <td class="text-right" style="color:#f87171;">(KES 182,500)</td>
                        </tr>
                        <tr class="highlight-row">
                            <td><strong>GROSS PROFIT</strong></td>
                            <td class="text-right"><strong>KES 13,180</strong></td>
                            <td class="text-right"><strong>KES 36,200</strong></td>
                            <td class="text-right"><strong>KES 84,000</strong></td>
                            <td class="text-right"><strong>KES 179,000</strong></td>
                            <td class="text-right"><strong>KES 342,500</strong></td>
                        </tr>
                        <tr>
                            <td><em>Gross Margin %</em></td>
                            <td class="text-right text-gold"><em>58.9%</em></td>
                            <td class="text-right text-gold"><em>60.3%</em></td>
                            <td class="text-right text-gold"><em>62.5%</em></td>
                            <td class="text-right text-gold"><em>64.6%</em></td>
                            <td class="text-right text-gold"><em>65.2%</em></td>
                        </tr>
                        <tr>
                            <td>Operating Expenses (Opex)</td>
                            <td class="text-right" style="color:#f87171;">(KES 6,300)</td>
                            <td class="text-right" style="color:#f87171;">(KES 14,800)</td>
                            <td class="text-right" style="color:#f87171;">(KES 32,000)</td>
                            <td class="text-right" style="color:#f87171;">(KES 64,000)</td>
                            <td class="text-right" style="color:#f87171;">(KES 118,000)</td>
                        </tr>
                        <tr class="highlight-row" style="background: rgba(16, 185, 129, 0.15) !important;">
                            <td><strong>EBITDA / OPERATING PROFIT</strong></td>
                            <td class="text-right"><strong style="color:#34d399;">KES 6,880</strong></td>
                            <td class="text-right"><strong style="color:#34d399;">KES 21,400</strong></td>
                            <td class="text-right"><strong style="color:#34d399;">KES 52,000</strong></td>
                            <td class="text-right"><strong style="color:#34d399;">KES 115,000</strong></td>
                            <td class="text-right"><strong style="color:#34d399;">KES 224,500</strong></td>
                        </tr>
                        <tr>
                            <td><em>EBITDA Margin %</em></td>
                            <td class="text-right text-emerald"><em>30.7%</em></td>
                            <td class="text-right text-emerald"><em>35.7%</em></td>
                            <td class="text-right text-emerald"><em>38.7%</em></td>
                            <td class="text-right text-emerald"><em>41.5%</em></td>
                            <td class="text-right text-emerald"><em>42.8%</em></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="grid-3">
                <div class="card" style="padding: 7px 10px;">
                    <div style="color:#00f0ff; font-weight:700; font-size:10.5px;">Year 1–2: Residency & Sync Anchor</div>
                    <div style="color:#94a3b8; font-size:9.5px; margin-top:2px;">Consolidate Nairobi residency; launch Sony submissions; submit iOS/Android apps.</div>
                </div>
                <div class="card" style="padding: 7px 10px;">
                    <div style="color:#c084fc; font-weight:700; font-size:10.5px;">Year 3–4: Pan-African Expansion</div>
                    <div style="color:#94a3b8; font-size:9.5px; margin-top:2px;">Replicate residencies in Kigali & Kampala; scale global sync placements to 15/yr.</div>
                </div>
                <div class="card" style="padding: 7px 10px;">
                    <div style="color:#34d399; font-weight:700; font-size:10.5px;">Year 5: Institutional Asset Class</div>
                    <div style="color:#94a3b8; font-size:9.5px; margin-top:2px;">$4M USD gross revenue; programmatic tour financing across Sub-Saharan Africa.</div>
                </div>
            </div>
        </div>
        <div class="slide-footer">
            <div class="footer-left"><span class="footer-tag">INTERMAVEN NETWORK</span> | Financial Projections</div>
            <div>10 / 12</div>
        </div>
    </div>

    <!-- ==================== SLIDE 11: 1-YEAR TACTICAL PLAN ==================== -->
    <div class="slide">
        <div class="slide-content">
            <div class="slide-header">
                <div class="header-left">
                    <span class="slide-category">Execution Roadmap</span>
                    <h2 class="slide-title">1-Year Tactical Action Plan (Q1 – Q4)</h2>
                    <span class="slide-subtitle">Clear weekly and monthly execution milestones leading up to Friday, November 27th launch</span>
                </div>
                <div class="header-badge">Opening: Fri Nov 27, 2026</div>
            </div>

            <div class="grid-4" style="margin-bottom: 10px;">
                <div class="card card-glow-cyan" style="padding: 9px 11px;">
                    <div class="card-title" style="font-size: 12px;">Q1: Launch & Proof<br><span style="font-size:9.5px; color:#00f0ff;">Nov 2026 – Jan 2027</span></div>
                    <ul class="bullet-list" style="font-size: 10px; padding-left: 11px;">
                        <li>Draw initial <strong>KES 450,000</strong>.</li>
                        <li>Register Intermaven Ltd & Maven Global.</li>
                        <li>Register ASCAP Publishing ($50).</li>
                        <li>Lead shoot for 3 principals ($230).</li>
                        <li><strong>Fri Nov 27: Launch at B52 Lounge.</strong></li>
                        <li>Submit iOS & Android mobile apps.</li>
                        <li>1st batch Sony sync submissions.</li>
                    </ul>
                </div>

                <div class="card card-glow-purple" style="padding: 9px 11px;">
                    <div class="card-title" style="font-size: 12px;">Q2: App Store & Ads<br><span style="font-size:9.5px; color:#c084fc;">Feb 2027 – Apr 2027</span></div>
                    <ul class="bullet-list" style="font-size: 10px; padding-left: 11px;">
                        <li>Native apps live on iOS/Google Play.</li>
                        <li>Close 1st corporate brand partner (KES 300,000/mo).</li>
                        <li>Launch TuneStream lossless credit store.</li>
                        <li>Onboard first 30 creators onto paid Hostinger Web Worlds.</li>
                        <li>Maintain >3.0x DSCR coverage.</li>
                    </ul>
                </div>

                <div class="card card-glow-gold" style="padding: 9px 11px;">
                    <div class="card-title" style="font-size: 12px;">Q3: Expansion<br><span style="font-size:9.5px; color:#f59e0b;">May 2027 – Jul 2027</span></div>
                    <ul class="bullet-list" style="font-size: 10px; padding-left: 11px;">
                        <li>Contract 2nd weekly residency night (Westlands / Mombasa corridor).</li>
                        <li>Deploy automated print-on-demand for creator merch.</li>
                        <li>Scale Hostinger reseller to 100+ active creator subdomains.</li>
                        <li>Mid-year live music showcase.</li>
                    </ul>
                </div>

                <div class="card card-glow-emerald" style="padding: 9px 11px;">
                    <div class="card-title" style="font-size: 12px;">Q4: Scale & Seed<br><span style="font-size:9.5px; color:#34d399;">Aug 2027 – Oct 2027</span></div>
                    <ul class="bullet-list" style="font-size: 10px; padding-left: 11px;">
                        <li>First major $120,000 Sony sync placement closes.</li>
                        <li>Complete audited FY27 financials (>KES 22M gross volume).</li>
                        <li>Retire or graduate KES 1.5M line.</li>
                        <li>Open institutional Series Seed round ($500k – $1M USD).</li>
                    </ul>
                </div>
            </div>

            <div class="card" style="padding: 9px 14px; background: rgba(15, 23, 42, 0.85); border-left: 3px solid #00f0ff;">
                <div style="font-size: 11.5px; font-weight: 700; color: #ffffff; margin-bottom: 3px;">Immediate Pre-Launch Checklist (Next 14 Days to Friday, November 27th):</div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; font-size: 10px; color: #cbd5e1;">
                    <div><strong>Nov 12–15:</strong> Term sheet signing & KES 450k initial disbursement.</div>
                    <div><strong>Nov 16–18:</strong> Executive shoot; ASCAP registration; Intermaven LTD & Maven Global filing.</div>
                    <div><strong>Nov 19–24:</strong> WhatsApp CRM blast; artist/DJ lineup lock.</div>
                    <div><strong>Fri Nov 27:</strong> B52 Lounge Opening Night execution & cash reconcile.</div>
                </div>
            </div>
        </div>
        <div class="slide-footer">
            <div class="footer-left"><span class="footer-tag">INTERMAVEN NETWORK</span> | Execution Roadmap</div>
            <div>11 / 12</div>
        </div>
    </div>

    <!-- ==================== SLIDE 12: LEADERSHIP & THE ASK ==================== -->
    <div class="slide">
        <div class="slide-content">
            <div class="slide-header">
                <div class="header-left">
                    <span class="slide-category">Investment Partnership</span>
                    <h2 class="slide-title">Leadership Team & The Capital Ask</h2>
                    <span class="slide-subtitle">Complementary execution expertise ready to deploy capital and scale the ecosystem</span>
                </div>
                <div class="header-badge" style="border-color:#00f0ff; color:#00f0ff;">Join The Network</div>
            </div>

            <div class="grid-3" style="margin-bottom: 12px;">
                <div class="card card-glow-cyan">
                    <div class="card-title">Lead 1: Technology & Arch</div>
                    <div style="font-size: 10.5px; color: #00f0ff; font-weight: 600; margin-bottom: 5px;">Product, Monorepo & Cloud</div>
                    <p style="font-size: 10.5px; color: #cbd5e1;">
                        Oversees the 5-microservice monorepo, FastAPI backend, MongoDB data cluster, App Store iOS/Android packaging, and Hostinger reseller infrastructure.
                    </p>
                </div>

                <div class="card card-glow-purple">
                    <div class="card-title">Lead 2: Live Ops & Talent</div>
                    <div style="font-size: 10.5px; color: #c084fc; font-weight: 600; margin-bottom: 5px;">Venues, Sound & Production</div>
                    <p style="font-size: 10.5px; color: #cbd5e1;">
                        Manages the B52 Lounge relationship, artist/DJ lineup booking, sound engineering, stage curation, security, and door ticketing operations.
                    </p>
                </div>

                <div class="card card-glow-gold">
                    <div class="card-title">Lead 3: Commercial & Deals</div>
                    <div style="font-size: 10.5px; color: #f59e0b; font-weight: 600; margin-bottom: 5px;">Publishing, Brand & Sync</div>
                    <p style="font-size: 10.5px; color: #cbd5e1;">
                        Drives Sony Music Publishing syndication, corporate brand deals (KES 300,000/mo), apparel supply chain, and US/KE corporate entity governance.
                    </p>
                </div>
            </div>

            <div class="card card-glow-emerald" style="padding: 12px 16px;">
                <div class="card-title" style="margin-bottom: 6px;">The Ask & Immediate Closing Path</div>
                <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 16px; font-size: 11px;">
                    <div>
                        <div style="color: #ffffff; font-weight: 700; margin-bottom: 3px;">Capital Facility Request:</div>
                        <p style="color: #cbd5e1; margin: 0 0 6px 0;">
                            We are seeking a <strong>KES 1,500,000 (~$12,000 USD)</strong> Revolving Line of Credit (or Convertible SAFE) with an initial <strong>KES 450,000 ($3,462 USD)</strong> tranche for the 3-month rollout runway.
                        </p>
                        <div style="color: #ffffff; font-weight: 700; margin-bottom: 3px;">Senior Investor Security:</div>
                        <p style="color: #cbd5e1; margin: 0;">
                            Backed by first-dollar priority repayment on B52 weekly venue payments, bar revenue splits, and M-Pesa collections, yielding an attractive <strong>20%–24% p.a.</strong> with weekly liquidity.
                        </p>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px; border: 1px solid rgba(0, 240, 255, 0.2);">
                        <div style="color: #00f0ff; font-weight: 800; font-size: 11px; text-transform: uppercase; margin-bottom: 5px;">Next Action Steps:</div>
                        <div style="color: #e2e8f0; font-size: 10.5px; line-height: 1.5;">
                            1. Select Preferred Return Structure (Debt, Royalty, or SAFE)<br>
                            2. Execute Revolving Credit Term Sheet<br>
                            3. Disburse Tranche 1 (KES 450,000)<br>
                            4. VIP Attendance at B52 Launch (Friday, Nov 27)
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="slide-footer">
            <div class="footer-left"><span class="footer-tag">INTERMAVEN NETWORK</span> | Investment Proposal</div>
            <div>12 / 12</div>
        </div>
    </div>

</body>
</html>
"""

html_path = r"c:\BOCM\Apps\tunemavens\docs\PITCH_DECK_INTERMAVEN_TUNEMAVENS.html"
pdf_path = r"c:\BOCM\Apps\tunemavens\docs\PITCH_DECK_INTERMAVEN_TUNEMAVENS.pdf"

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML written to {html_path}")

chrome_exe = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
cmd = [
    chrome_exe,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    f"file:///{html_path.replace(os.sep, '/')}"
]

print("Running Chrome print-to-pdf...")
result = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", result.returncode)
print("STDOUT:", result.stdout)
print("STDERR:", result.stderr)

if os.path.exists(pdf_path):
    print(f"SUCCESS: Generated PDF at {pdf_path} (Size: {os.path.getsize(pdf_path)} bytes)")
else:
    print("FAILED to create PDF.")
