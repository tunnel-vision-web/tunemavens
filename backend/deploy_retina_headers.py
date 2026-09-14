import os
import io
import urllib.parse
import urllib.request
from PIL import Image, ImageEnhance, ImageFilter
from config import db

def deploy_retina_headers():
    print("Generating & Deploying 96 DPI Retina Header for Music & Discography...")
    
    prompt = "High-resolution widescreen cinematic banner for Music and Discography of music creator Ndufo, multicultural Africans browsing vinyl in modern record store in Nairobi, analog audio gear, atmospheric neon stage lighting, 8k ultra detailed, masterpiece, photorealistic, sharp focus"
    clean_prompt = urllib.parse.quote(prompt)
    target_w, target_h = (2560, 854)
    seed = 8492015
    url = f"https://image.pollinations.ai/prompt/{clean_prompt}?width={target_w}&height={target_h}&nologo=true&seed={seed}"
    
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    )
    
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = resp.read()
    
    img = Image.open(io.BytesIO(data)).convert("RGB")
    if img.size != (target_w, target_h):
        img = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    enhancer = ImageEnhance.Sharpness(img)
    crisp = enhancer.enhance(1.22)
    crisp = crisp.filter(ImageFilter.UnsharpMask(radius=1.6, percent=125, threshold=2))
    
    header_filename = "discography_retina_header.jpg"
    
    targets = [
        r"c:\BOCM\Apps\tunemavens\backend\uploads\headers",
        r"c:\BOCM\Apps\tunemavens\apps\portal\public\headers",
        r"c:\BOCM\Apps\tunemavens\apps\tunestream\public\headers",
        r"c:\BOCM\Apps\tunemavens\apps\syncmavens\public\headers",
    ]
    
    for t in targets:
        os.makedirs(t, exist_ok=True)
        out_path = os.path.join(t, header_filename)
        crisp.save(out_path, format="JPEG", quality=95, optimize=True, dpi=(96, 96))
        print(f"Saved 96 DPI Retina header to: {out_path}")
    
    # Update MongoDB records
    header_public_url = "/headers/discography_retina_header.jpg"
    
    db.epks.update_many(
        {},
        {"$set": {"pageHeaders.discography": header_public_url}}
    )
    db.cms_layouts.update_many(
        {},
        {"$set": {"data.pageHeaders.discography": header_public_url}}
    )
    print(f"Updated MongoDB epks and cms_layouts: pageHeaders.discography -> {header_public_url}")

if __name__ == "__main__":
    deploy_retina_headers()
