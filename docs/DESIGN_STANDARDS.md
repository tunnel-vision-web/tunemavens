# TuneMavens Ecosystem Design Standards

This document establishes the official design and layout standards for the TuneMavens platform and its broader ecosystem (including the Admin Portal, TuneStream, Creator Companion, and other sub-platforms). All future landing pages, portals, and modules must adhere to these standards to ensure visual unity and a premium, futuristic user experience.

---

## 1. Design & Layout Philosophy

The TuneMavens brand uses a **sleek, premium, dark-mode first** aesthetic. It relies on:
- **Futuristic Dark Backdrops:** Deep navy-black gradients that provide high contrast for glowing elements.
- **Glassmorphism:** Frosted panel overlays with blur effects and thin, semi-transparent white borders.
- **Vibrant Neon Accents:** Cyan/Teal as the primary accent, with subtle purple and blue highlights.
- **Micro-Animations:** Hover lifts, glow transitions, and smooth scrolling carousels that make the interface feel alive.
- **Sharp/Compact Radii:** Clean, modern corners (`3px` to `4px` border-radius) for a precise, tech-forward feel.

---

## 2. Typography & Fonts

We load three primary web fonts from Google Fonts:
1. **Sansation:** Used for branding logos, hero headers, page section titles, and carousel headers.
2. **Outfit:** Our main body text, button labels, and UI interface font.
3. **Space Grotesk:** Used alongside Outfit for metadata, numbers, sub-headings, and compact UI details.

### Google Fonts Import
```css
@import url('https://fonts.googleapis.com/css2?family=Sansation:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
```

### Font Stacks
- **Body & General UI:** `'Outfit', 'Space Grotesk', system-ui, -apple-system, sans-serif`
- **Display Headings (H1, Banners, Hero):** `'Sansation', sans-serif`
- **Dashboard Panels (Alternate):** `'Outfit', 'Inter', sans-serif`
- **Monospace Code/Token Details:** `source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace`

### Typography Hierarchy

| Selector / Class | Font Family | Size | Weight | Line Height | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Hero Titles / Main H1 | `Sansation` | `clamp(30px, 4vw, 44px)` | `800` (Bold) | `1.2` | Main page header banner title |
| Section Header | `Sansation` | `24px` | `800` (Bold) | `1.3` | Large block sections |
| Card Title | `Outfit` | `20px` | `800` (Bold) | `1.4` | Inner grid card title |
| Sub-heading / Eyebrow | `Space Grotesk` | `11px` | `700` (Bold) | `1.5` | Uppercase small metadata tags |
| Base Body | `Outfit` | `17px` | `400` / `500` | `1.6` | General body, paragraph text |
| Dashboard Nav Item | `Outfit` | `14px` | `500` / `600` | `1.4` | Navigation list labels |
| Buttons | `Outfit` | `13px` | `700` / `600` | `1.0` | Primary/Secondary actions |
| Small / Muted Text | `Outfit` | `11px` / `13px` | `400` | `1.4` | Captions, card descriptions |

---

## 3. Color Palette & Theme Tokens

We use CSS Custom Properties (variables) defined on the `:root` to ensure system-wide adaptability. The ecosystem is natively dark, with light mode supported via Shadcn/Tailwind systems where needed, but the primary target environment is dark.

```css
:root {
  /* Background Layers */
  --bg: #060813;           /* Core Background (Deep Navy-Black) */
  --bg2: #0c0f20;          /* Secondary BG (Sidebars, Dropdowns, Cards) */
  --bg3: #13172e;          /* Tertiary BG (Deep panel sections) */
  --bg4: #1c2242;          /* Quaternary BG (Accent areas/borders) */

  /* Borders & Grids */
  --b1: rgba(255, 255, 255, 0.05);  /* Subtle borders */
  --b2: rgba(255, 255, 255, 0.1);   /* Medium borders */
  --b3: rgba(255, 255, 255, 0.18);  /* Stronger borders / interactive highlights */

  /* Typography Colors */
  --tx: #f8fafc;           /* Primary Text (Slate 50) */
  --mu: #94a3b8;           /* Muted Text (Slate 400) */
  --mu2: #475569;          /* Extra Muted Text / Separators (Slate 600) */

  /* Brand Accents */
  --cyan: #22d3ee;         /* Primary Accent (Teal-Cyan) */
  --btn-hover: #0ea5e9;    /* Primary Button Hover (Sky Blue) */
  --blue: #2563eb;         /* Secondary Accent */
  --purple: #8b5cf6;       /* Tertiary Accent (Purple Glows) */

  /* Semantic UI State Colors */
  --gr: #10b981;           /* Success / Active states (Green) */
  --am: #f59e0b;           /* Warning / Pending states (Amber) */
  --rd: #ef4444;           /* Danger / Destructive states (Red) */

  /* Glassmorphism Card Opacities */
  --ca: rgba(255, 255, 255, 0.04); /* Base Card Background */
  --ch: rgba(255, 255, 255, 0.08); /* Hover Card Background */

  /* Border Radius */
  --r: 4px;                /* Standard corner radius (Sharp-medium) */
}
```

---

## 4. Buttons & Interactive Controls

Buttons are highly tactile, utilizing smooth CSS transitions and neon shadows.

### A. Primary Button (`.btn-primary`)
Used for high-priority actions (e.g., "Start Free", "Register", "Save").
- **Styling:**
  ```css
  .btn-primary {
    background: var(--cyan);
    color: #060813;
    border: none;
    padding: 8px 20px;
    border-radius: var(--r);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(34, 211, 238, 0.3);
    transition: all 0.2s ease;
  }
  
  .btn-primary:hover {
    background: var(--btn-hover);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(34, 211, 238, 0.45);
  }
  ```

### B. Secondary Button (`.btn-secondary`)
Used for secondary actions (e.g., "Log In", "Cancel", "Learn More").
- **Styling:**
  ```css
  .btn-secondary {
    background: transparent;
    color: var(--tx);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 8px 18px;
    border-radius: var(--r);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .btn-secondary:hover {
    border-color: var(--cyan);
    color: var(--cyan);
  }
  ```

### C. Pill Back Button (`.back-to-main`)
Used for sub-applications or landing sub-views to easily jump back to the core portal.
- **Styling:**
  ```css
  .back-to-main {
    font-size: 12px;
    font-weight: 700;
    color: var(--tx);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    background: rgba(255, 255, 255, 0.05);
    padding: 6px 14px;
    border-radius: 20px; /* Pill shape */
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: background 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
  }
  
  .back-to-main:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateX(-2px);
  }
  ```

### D. Icons Selection
We standardized on the **Remix Icons** library (`react-icons/ri`) to preserve a cohesive style for line/fill weights across all interactive buttons, drop-downs, and sidebars.

---

## 5. Header & Sticky Behaviors

To maintain a fluid scrolling experience, headers dynamically transition styles based on the scroll position.

### A. Landing/Corporate Navigation Bar (`.navbar`)
- **Initial State:** Floats fixed over content with a transparent background, thin transparent border, and height of `80px`.
- **Scrolled State (`scrollY > 50px`):** Adds a blur backdrop, fades in a dark background, shrinks the height to `70px`, scales down the logo by `20%` for a compact viewport, and renders a subtle border lines.
- **Styling:**
  ```css
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;
    z-index: 1000;
    background: transparent;
    border-bottom: 1px solid transparent;
    display: flex;
    align-items: center;
    transition: background 0.3s ease, border-color 0.3s ease, height 0.3s ease;
  }
  
  /* Triggered when user scrolls down */
  .app-landing-wrapper.scrolled .navbar {
    background: rgba(6, 8, 19, 0.8);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    height: 70px;
  }
  
  .logo-image {
    width: 218px;
    height: auto;
    display: block;
    transition: transform 0.3s ease;
    transform-origin: left center;
  }
  
  .app-landing-wrapper.scrolled .logo-image {
    transform: scale(0.8);
  }
  ```

### B. Dashboard Topbar (`.dashboard-topbar`)
Unlike the landing navbar, the console/dashboard header is always sticky, anchoring actions and alerts above the content workspace.
- **Styling:**
  ```css
  .dashboard-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 24px;
    background: rgba(11, 15, 30, 0.75);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 50;
    flex-shrink: 0;
  }
  ```

---

## 6. Menu Styles

Menus must feel responsive, providing instant visual feedback on cursor hover or component activation.

### A. Navigation Dropdowns (`.dropdown-menu`)
Positioned absolutely below trigger buttons.
- **Styling:**
  ```css
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--bg2);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: var(--r);
    padding: 8px;
    list-style: none;
    min-width: 200px;
    display: none; /* Flex/block toggled via '.open' class */
    flex-direction: column;
    gap: 4px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    z-index: 1001;
  }
  
  .dropdown-menu.open {
    display: flex;
  }
  
  .dropdown-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    font-size: 13px;
    color: var(--mu);
    border-radius: var(--r);
    transition: all 0.2s ease;
  }
  
  .dropdown-link:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--tx);
  }
  ```

### B. Dashboard Sidebar Menu (`.dashboard-sidebar`)
The sidebar features a collapsible layout.
- **Expanded Width:** `260px` (padding `24px 16px`)
- **Collapsed Width:** `80px` (padding `24px 12px`)
- **Transition:** `width 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- **Header Separator:** Features a subtle `border-bottom: 1px solid rgba(255, 255, 255, 0.05)` and a vertical margin of `20px` separating logo branding from navigation links.
- **Navigation Links (`.dashboard-nav-item`):**
  - **Default:** `color: #94a3b8`, `font-size: 14px`, `font-weight: 500`, border-radius `6px`.
  - **Hover:** `color: #ffffff`, background `rgba(255, 255, 255, 0.05)`.
  - **Active State (`.active`):** Color shifts to `var(--cyan)`, background changes to `rgba(34, 211, 238, 0.06)`, and font-weight changes to `600`.
- **Pinned Footer Scroll Behavior:** To allow scrolling long menus without losing secondary links, the upper sidebar section scrolls dynamically while the footer controls remain absolute.
  ```css
  .dashboard-sidebar-scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(34, 211, 238, 0.25) transparent;
    padding-right: 4px;
  }
  
  .dashboard-sidebar-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  ```

---

## 7. Layouts & Card Standards

### A. Containers
Standardized horizontal container alignment for pages.
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
```

### B. Page Header Banner (`.page-header-banner`)
Standardized banner layout for sub-pages.
- **Height:** `320px` banner with dynamic backdrops.
- **Overlay:** Dual-gradient overlay fading from transparent (top) to dark background (bottom).
- **Styling:**
  ```css
  .page-header-banner {
    position: relative;
    width: 100%;
    height: 320px;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
    overflow: hidden;
  }
  
  .page-header-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(180deg, rgba(6, 8, 19, 0.4) 0%, rgba(6, 8, 19, 0.85) 100%);
    z-index: 1;
  }
  
  .page-header-content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 80px 24px 0;
  }
  ```

### C. Cards Grid (`.pf-grid-page` & `.pf-card-page`)
Standard responsive grid layout for cataloging tools, options, or categories.
- **Grid Layout:**
  ```css
  .pf-grid-page {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    margin-top: 40px;
  }
  ```
- **Individual Cards:** Cards use sharp corners (`3px`), glassmorphism transparency, and lift on hover.
  ```css
  .pf-card-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 32px 24px;
    border-radius: 3px; /* Sharp corners */
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(12px);
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
  
  .pf-card-page:hover {
    transform: translateY(-6px);
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--cyan);
  }
  ```

### D. Purple Message Box (`.footer-message-box`)
Used to draw focus in footers (e.g., support boxes, newsletter invites).
- **Styling:**
  ```css
  .footer-message-box {
    background: rgba(139, 92, 246, 0.04);
    border: 1px solid rgba(139, 92, 246, 0.15);
    border-radius: var(--r);
    padding: 20px 24px;
    transition: all 0.2s ease;
  }
  
  .footer-message-box:hover {
    border-color: rgba(139, 92, 246, 0.3);
    background: rgba(139, 92, 246, 0.06);
  }
  ```

---

## 8. Scrollbar Customizations

Custom themed scrollbars are crucial to keep layout edges fitting the platform theme.

```css
/* Custom scrollbar for core body */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg2);
}
::-webkit-scrollbar-thumb {
  background: var(--b2);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--b3);
}

/* Slim themed scrollbar inside sidebar scroll pane */
.dashboard-sidebar-scroll::-webkit-scrollbar {
  width: 6px;
}
.dashboard-sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.dashboard-sidebar-scroll::-webkit-scrollbar-thumb {
  background: rgba(34, 211, 238, 0.18);
  border-radius: 3px;
}
.dashboard-sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 211, 238, 0.35);
}
```

---

## 9. Animations & Micro-Interactions

### A. Horizontal Endless Scroll Carousel (`.pf-carousel-track`)
An infinite looping horizontal marquee track. Pauses automatically when the user hovers over it.
- **Styling:**
  ```css
  .pf-carousel-container {
    width: 100%;
    overflow: hidden;
    position: relative;
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
    mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
  }
  
  .pf-carousel-track {
    display: flex;
    gap: 20px;
    width: max-content;
    animation: pf-horizontal-scroll 45s linear infinite;
    will-change: transform;
  }
  
  .pf-carousel-track.paused {
    animation-play-state: paused;
  }
  
  @keyframes pf-horizontal-scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); } /* Halfway point for duplicating items */
  }
  ```

### B. Pulse Glow (`.animate-pulse-glow`)
Used for neon points, notifications badges, or highlight states.
- **Styling:**
  ```css
  .animate-pulse-glow {
    animation: pulseGlow 4s ease-in-out infinite;
  }
  
  @keyframes pulseGlow {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }
  ```

### C. Slow Spin (`.animate-spin-slow`)
Useful for background ambient decoration graphics, radar nodes, or circular visualizers.
- **Styling:**
  ```css
  .animate-spin-slow {
    animation: spin-slow 20s linear infinite;
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  ```
