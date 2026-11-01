import math
import random
from PIL import Image, ImageDraw, ImageFilter

def create_radial_gradient(width, height, center_x, center_y, radius, inner_color, outer_color):
    img = Image.new("RGBA", (width, height), outer_color)
    draw = ImageDraw.Draw(img)
    # create smooth radial falloff
    steps = 60
    for i in range(steps, 0, -1):
        r = radius * (i / steps)
        t = i / steps
        r_c = int(inner_color[0] * (1 - t) + outer_color[0] * t)
        g_c = int(inner_color[1] * (1 - t) + outer_color[1] * t)
        b_c = int(inner_color[2] * (1 - t) + outer_color[2] * t)
        a_c = int(inner_color[3] * (1 - t) + outer_color[3] * t)
        draw.ellipse([center_x - r, center_y - r, center_x + r, center_y + r], fill=(r_c, g_c, b_c, a_c))
    return img

def add_bokeh(draw, width, height, count, color_base):
    random.seed(42)
    for _ in range(count):
        x = random.randint(0, width)
        y = random.randint(0, height)
        r = random.randint(15, 60)
        alpha = random.randint(12, 45)
        c = (
            min(255, color_base[0] + random.randint(-20, 40)),
            min(255, color_base[1] + random.randint(-20, 40)),
            min(255, color_base[2] + random.randint(-20, 40)),
            alpha
        )
        draw.ellipse([x - r, y - r, x + r, y + r], fill=c)

def draw_studio_environment(width, height, host_type="single"):
    # High-end podcast studio interior
    base = Image.new("RGBA", (width, height), (7, 11, 22, 255))
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)

    # 1. Background studio walls with vertical acoustic slat pattern
    wall_left = 0
    wall_right = width
    for x in range(0, width, 24):
        # subtle vertical wood slat texture
        d.rectangle([x, 0, x + 16, height], fill=(18, 24, 38, 255))
        d.rectangle([x + 16, 0, x + 24, height], fill=(10, 14, 24, 255))

    # 2. Ambient studio warm backlight & cyan wash
    glow1 = create_radial_gradient(width, height, int(width * 0.7), int(height * 0.35), int(width * 0.5), (0, 210, 240, 110), (0, 0, 0, 0))
    glow2 = create_radial_gradient(width, height, int(width * 0.25), int(height * 0.45), int(width * 0.4), (255, 140, 50, 90), (0, 0, 0, 0))
    
    # 3. Studio table / acoustic desk in lower third
    desk_y = int(height * 0.65)
    # Dark oak desk top
    d.polygon([(0, desk_y + 40), (width, desk_y + 40), (width, height), (0, height)], fill=(12, 16, 26, 255))
    d.line([(0, desk_y + 40), (width, desk_y + 40)], fill=(0, 242, 254, 70), width=3)

    # 4. Subjects & Podcast Studio Gear
    if host_type == "single":
        # Expressive podcast host at studio mic
        # Head / headphones silhouette & studio lighting
        cx = int(width * 0.68)
        cy = int(height * 0.48)
        # Head / Hair
        d.ellipse([cx - 75, cy - 110, cx + 75, cy + 40], fill=(22, 28, 42, 255))
        # Torso / Shoulders
        d.polygon([(cx - 160, height), (cx - 100, cy + 70), (cx + 100, cy + 70), (cx + 160, height)], fill=(16, 22, 34, 255))
        # Studio headphones over ears
        d.ellipse([cx - 85, cy - 60, cx - 60, cy - 10], fill=(0, 242, 254, 180)) # glowing earcup
        d.ellipse([cx + 60, cy - 60, cx + 85, cy - 10], fill=(245, 158, 11, 140))
        d.arc([cx - 75, cy - 115, cx + 75, cy - 40], start=180, end=360, fill=(35, 45, 65, 255), width=8) # headband

        # Shure SM7B broadcast mic on boom arm
        mx = int(width * 0.52)
        my = int(height * 0.45)
        # Boom arm
        d.line([(width * 0.35, height * 0.75), (mx - 60, my - 50), (mx, my)], fill=(40, 50, 70, 255), width=7)
        d.ellipse([mx - 65, my - 55, mx - 55, my - 45], fill=(0, 242, 254, 255)) # joint
        # Mic body & foam windscreen
        d.rounded_rectangle([mx - 40, my - 22, mx + 30, my + 22], radius=10, fill=(28, 36, 52, 255), outline=(0, 242, 254, 180), width=2)
        d.rounded_rectangle([mx + 15, my - 19, mx + 45, my + 19], radius=8, fill=(18, 22, 32, 255))
        # Warm rim light on host shoulder
        d.arc([cx - 105, cy + 65, cx - 70, cy + 130], start=120, end=260, fill=(0, 242, 254, 220), width=4)

    elif host_type == "dual":
        # Two podcast co-hosts conversing across studio table
        # Host 1 (Left)
        c1x = int(width * 0.35)
        c1y = int(height * 0.50)
        d.ellipse([c1x - 65, c1y - 95, c1x + 65, c1y + 35], fill=(24, 30, 46, 255))
        d.polygon([(c1x - 140, height), (c1x - 90, c1y + 65), (c1x + 90, c1y + 65), (c1x + 140, height)], fill=(18, 24, 38, 255))
        # Left mic
        d.line([(c1x - 120, height * 0.75), (c1x - 20, c1y - 10)], fill=(40, 50, 70, 255), width=6)
        d.rounded_rectangle([c1x - 25, c1y - 25, c1x + 35, c1y + 15], radius=8, fill=(28, 36, 52, 255), outline=(0, 242, 254, 160), width=2)

        # Host 2 (Right)
        c2x = int(width * 0.72)
        c2y = int(height * 0.48)
        d.ellipse([c2x - 60, c2y - 90, c2x + 60, c2y + 35], fill=(22, 28, 44, 255))
        d.polygon([(c2x - 130, height), (c2x - 85, c2y + 65), (c2x + 85, c2y + 65), (c2x + 130, height)], fill=(16, 22, 34, 255))
        # Right mic
        d.line([(c2x + 120, height * 0.75), (c2x + 20, c2y - 10)], fill=(40, 50, 70, 255), width=6)
        d.rounded_rectangle([c2x - 35, c2y - 25, c2x + 25, c2y + 15], radius=8, fill=(28, 36, 52, 255), outline=(245, 158, 11, 160), width=2)

        # "ON AIR" soft neon studio light in background
        d.rounded_rectangle([int(width * 0.5) - 45, int(height * 0.22) - 15, int(width * 0.5) + 45, int(height * 0.22) + 15], radius=4, fill=(35, 12, 16, 220), outline=(239, 68, 68, 200), width=2)

    elif host_type == "lounge":
        # Stylish female audio creator in modern studio lounge
        cx = int(width * 0.65)
        cy = int(height * 0.46)
        # Elegant silhouette with studio headphones and tablet on desk
        d.ellipse([cx - 65, cy - 100, cx + 65, cy + 30], fill=(22, 28, 44, 255))
        d.polygon([(cx - 150, height), (cx - 95, cy + 65), (cx + 95, cy + 65), (cx + 150, height)], fill=(16, 22, 34, 255))
        # Headphones with stylish metallic rim
        d.ellipse([cx - 75, cy - 50, cx - 55, cy - 5], fill=(0, 242, 254, 200))
        d.ellipse([cx + 55, cy - 50, cx + 75, cy - 5], fill=(0, 242, 254, 200))
        # Tablet glowing softly on desk
        d.polygon([(cx - 120, desk_y + 55), (cx - 40, desk_y + 45), (cx - 30, desk_y + 85), (cx - 110, desk_y + 95)], fill=(20, 30, 48, 255), outline=(0, 242, 254, 180), width=2)

    elif host_type == "team":
        # Podcast production team & studio mixer in foreground
        # Audio mixer board in foreground
        for ch in range(6):
            fx = int(width * 0.25) + ch * 42
            d.line([(fx, height - 70), (fx, height - 15)], fill=(35, 45, 65, 255), width=3)
            # fader knob
            fy = height - 40 - (ch % 3) * 12
            d.rectangle([fx - 8, fy - 4, fx + 8, fy + 4], fill=(0, 242, 254, 230))
        
        # Hosts conversing in warm lighting in background
        cx = int(width * 0.68)
        cy = int(height * 0.46)
        d.ellipse([cx - 60, cy - 90, cx + 60, cy + 30], fill=(22, 28, 44, 255))
        d.polygon([(cx - 130, height), (cx - 85, cy + 60), (cx + 85, cy + 60), (cx + 130, height)], fill=(16, 22, 34, 255))
        # Co-host beside
        c2x = int(width * 0.84)
        c2y = int(height * 0.48)
        d.ellipse([c2x - 50, c2y - 80, c2x + 50, c2y + 25], fill=(18, 24, 38, 255))
        d.polygon([(c2x - 100, height), (c2x - 65, c2y + 55), (c2x + 65, c2y + 55), (c2x + 100, height)], fill=(14, 18, 28, 255))

    # Composite layers
    img = Image.alpha_composite(base, overlay)
    img = Image.alpha_composite(img, glow1)
    img = Image.alpha_composite(img, glow2)

    # Add subtle photographic vignette and film grain
    vignette = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vignette)
    vd.rectangle([0, 0, width, height], outline=(0, 0, 0, 160), width=40)
    img = Image.alpha_composite(img, vignette)
    return img.convert("RGB")

def draw_vc_environment(width, height, scene_type="boardroom"):
    base = Image.new("RGBA", (width, height), (6, 10, 20, 255))
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)

    if scene_type == "boardroom":
        # Executive high-rise glass boardroom overlooking city skyline at night
        # 1. City skyline through floor-to-ceiling panoramic glass
        skyline_y = int(height * 0.60)
        # Skyscrapers in background
        random.seed(101)
        for b in range(16):
            bx = b * (width // 15)
            bw = random.randint(50, 95)
            bh = random.randint(140, 280)
            d.rectangle([bx, skyline_y - bh, bx + bw, skyline_y], fill=(12, 18, 30, 255))
            # Window lights in skyscraper
            for wy in range(skyline_y - bh + 15, skyline_y - 20, 16):
                for wx in range(bx + 8, bx + bw - 8, 12):
                    if random.random() > 0.4:
                        d.rectangle([wx, wy, wx + 4, wy + 7], fill=(255, 230, 150, random.randint(60, 180)))

        # 2. Window frame mullions (architectural vertical lines)
        for m in range(1, 4):
            mx = int(width * (m / 4.0))
            d.line([(mx, 0), (mx, height)], fill=(20, 28, 44, 255), width=8)

        # 3. Polished marble boardroom table with reflection
        table_y = int(height * 0.62)
        d.polygon([(0, height), (width * 0.15, table_y), (width * 0.85, table_y), (width, height)], fill=(10, 15, 26, 255))
        d.line([(width * 0.15, table_y), (width * 0.85, table_y)], fill=(16, 185, 129, 80), width=2) # subtle emerald edge

        # 4. Investment partners / executives around table
        # Executive 1 (silhouette with laptop)
        p1x = int(width * 0.32)
        p1y = int(height * 0.54)
        d.ellipse([p1x - 50, p1y - 80, p1x + 50, p1y + 20], fill=(20, 28, 44, 255))
        d.polygon([(p1x - 90, height), (p1x - 65, p1y + 45), (p1x + 65, p1y + 45), (p1x + 90, height)], fill=(15, 22, 34, 255))
        # Executive 2 (Lead Partner)
        p2x = int(width * 0.65)
        p2y = int(height * 0.50)
        d.ellipse([p2x - 55, p2y - 85, p2x + 55, p2y + 25], fill=(22, 30, 48, 255))
        d.polygon([(p2x - 110, height), (p2x - 75, p2y + 50), (p2x + 75, p2y + 50), (p2x + 110, height)], fill=(17, 24, 38, 255))
        # Sleek open laptop with subtle soft glow
        d.polygon([(p2x - 70, table_y + 20), (p2x - 30, table_y + 10), (p2x - 30, table_y + 45), (p2x - 70, table_y + 55)], fill=(30, 42, 60, 255), outline=(16, 185, 129, 140), width=1)

    elif scene_type == "arena_vip":
        # Investors watching stadium concert / festival from luxury VIP suite
        # 1. Distant massive concert stage & beams of stadium light
        stage_y = int(height * 0.55)
        # Stage beams cutting through atmospheric haze
        beams = [
            [(width * 0.2, stage_y), (0, 0), (width * 0.1, 0)],
            [(width * 0.35, stage_y), (width * 0.25, 0), (width * 0.45, 0)],
            [(width * 0.65, stage_y), (width * 0.55, 0), (width * 0.75, 0)],
            [(width * 0.8, stage_y), (width * 0.9, 0), (width, 0)],
        ]
        for b in beams:
            d.polygon(b, fill=(16, 185, 129, 45))
        # Cheering crowd ocean bokeh in lower stadium
        add_bokeh(d, width, int(height * 0.7), 40, (16, 185, 129))
        add_bokeh(d, width, int(height * 0.7), 30, (0, 240, 255))

        # 2. VIP Glass Balcony Railing in foreground
        rail_y = int(height * 0.68)
        d.line([(0, rail_y), (width, rail_y)], fill=(45, 60, 85, 255), width=6)
        d.line([(0, rail_y + 40), (width, rail_y + 40)], fill=(35, 45, 65, 255), width=4)
        # Glass panel sheen
        d.polygon([(0, rail_y), (width, rail_y), (width, height), (0, height)], fill=(10, 16, 26, 210))

        # 3. Two investors on the VIP balcony taking in the view
        ix = int(width * 0.75)
        iy = int(height * 0.56)
        d.ellipse([ix - 50, iy - 80, ix + 50, iy + 20], fill=(24, 34, 52, 255))
        d.polygon([(ix - 90, height), (ix - 65, iy + 45), (ix + 65, iy + 45), (ix + 90, height)], fill=(18, 25, 40, 255))
        # Warm stage backlight on their profile
        d.arc([ix - 60, iy - 70, ix + 10, iy + 30], start=140, end=280, fill=(16, 185, 129, 200), width=3)

    elif scene_type == "vault":
        # Private wealth & legal architectural vault
        # Architectural columns & warm timber paneling
        for c in range(5):
            cx = c * (width // 4)
            d.rectangle([cx - 20, 0, cx + 20, height], fill=(16, 22, 34, 255))
            d.line([(cx - 20, 0), (cx - 20, height)], fill=(16, 185, 129, 40), width=1)
        
        # Sophisticated lounge seating with coffee table
        desk_y = int(height * 0.65)
        d.polygon([(width * 0.2, height), (width * 0.35, desk_y), (width * 0.75, desk_y), (width * 0.9, height)], fill=(12, 18, 28, 255))
        d.line([(width * 0.35, desk_y), (width * 0.75, desk_y)], fill=(16, 185, 129, 70), width=2)

        # Partner silhouette in conversation
        px = int(width * 0.58)
        py = int(height * 0.48)
        d.ellipse([px - 55, py - 85, px + 55, py + 25], fill=(22, 30, 48, 255))
        d.polygon([(px - 110, height), (px - 70, py + 50), (px + 70, py + 50), (px + 110, height)], fill=(16, 22, 36, 255))

    elif scene_type == "loft":
        # Creative innovation loft / music tech venture studio
        # Brick / industrial loft windows in background
        win_y = int(height * 0.55)
        for w in range(3):
            wx = int(width * 0.2) + w * int(width * 0.28)
            d.rounded_rectangle([wx - 60, 40, wx + 60, win_y], radius=30, fill=(15, 22, 36, 255), outline=(30, 42, 65, 255), width=4)
            # Arched window mullions
            d.line([(wx, 40), (wx, win_y)], fill=(25, 35, 55, 255), width=2)
            d.line([(wx - 60, win_y // 2), (wx + 60, win_y // 2)], fill=(25, 35, 55, 255), width=2)

        # Modern lounge seating & creative founder + investor meeting
        p1x = int(width * 0.42)
        p1y = int(height * 0.52)
        d.ellipse([p1x - 50, p1y - 80, p1x + 50, p1y + 20], fill=(24, 32, 50, 255))
        d.polygon([(p1x - 90, height), (p1x - 65, p1y + 45), (p1x + 65, p1y + 45), (p1x + 90, height)], fill=(18, 24, 38, 255))

        p2x = int(width * 0.68)
        p2y = int(height * 0.50)
        d.ellipse([p2x - 55, p2y - 85, p2x + 55, p2y + 25], fill=(22, 30, 46, 255))
        d.polygon([(p2x - 100, height), (p2x - 70, p2y + 45), (p2x + 70, p2y + 45), (p2x + 100, height)], fill=(16, 22, 34, 255))

    # Glows
    glow1 = create_radial_gradient(width, height, int(width * 0.75), int(height * 0.4), int(width * 0.5), (16, 185, 129, 90), (0, 0, 0, 0))
    glow2 = create_radial_gradient(width, height, int(width * 0.2), int(height * 0.5), int(width * 0.45), (0, 240, 255, 65), (0, 0, 0, 0))

    img = Image.alpha_composite(base, overlay)
    img = Image.alpha_composite(img, glow1)
    img = Image.alpha_composite(img, glow2)

    # Vignette
    vignette = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vignette)
    vd.rectangle([0, 0, width, height], outline=(0, 0, 0, 160), width=40)
    img = Image.alpha_composite(img, vignette)
    return img.convert("RGB")

def main():
    W, H = 1440, 800
    images = [
        ("podcaster_hero_1.png", draw_studio_environment(W, H, "single")),
        ("podcaster_hero_2.png", draw_studio_environment(W, H, "dual")),
        ("podcaster_hero_3.png", draw_studio_environment(W, H, "lounge")),
        ("podcaster_hero_4.png", draw_studio_environment(W, H, "team")),
        ("vc_hero_1.png", draw_vc_environment(W, H, "boardroom")),
        ("vc_hero_2.png", draw_vc_environment(W, H, "arena_vip")),
        ("vc_hero_3.png", draw_vc_environment(W, H, "vault")),
        ("vc_hero_4.png", draw_vc_environment(W, H, "loft")),
    ]

    import os
    dest = r"c:\BOCM\Apps\tunemavens\apps\portal\src\assets\images"
    for name, img in images:
        path = os.path.join(dest, name)
        img.save(path, "PNG", quality=95)
        print(f"Generated clean cinematic subject/location hero: {name}")

if __name__ == "__main__":
    main()
