import os
import shutil
from PIL import Image, ImageEnhance, ImageFilter

def finalize_and_deploy():
    h1_src = "uploads/neural_swap_hero1.jpg"
    h2_src = "uploads/neural_swap_hero2.jpg"
    
    # 1. Retina polish
    def polish_retina(path):
        img = Image.open(path).convert("RGB")
        enhancer = ImageEnhance.Sharpness(img)
        crisp = enhancer.enhance(1.15)
        crisp = crisp.filter(ImageFilter.UnsharpMask(radius=1.4, percent=110, threshold=1))
        return crisp

    print("Polishing Hero 1 & Hero 2 for Retina screens...")
    h1_crisp = polish_retina(h1_src)
    h2_crisp = polish_retina(h2_src)
    
    # Destination directories
    targets = [
        r"c:\BOCM\Apps\tunemavens\backend\uploads\heroes",
        r"c:\BOCM\Apps\tunemavens\apps\portal\public\heroes",
        r"c:\BOCM\Apps\tunemavens\apps\tunestream\public\heroes",
        r"c:\BOCM\Apps\tunemavens\apps\syncmavens\public\heroes",
    ]
    
    artifact_dir = r"C:\Users\maven\.gemini\antigravity-ide\brain\45d78685-1080-42f7-8b81-533faf73d3c9"

    for t in targets:
        os.makedirs(t, exist_ok=True)
        h1_out = os.path.join(t, "ndufo_hero_slide1_retina.jpg")
        h2_out = os.path.join(t, "ndufo_hero_slide2_retina.jpg")
        h1_crisp.save(h1_out, quality=95, optimize=True)
        h2_crisp.save(h2_out, quality=95, optimize=True)
        print(f"Saved Retina heroes to {t}")

    # Copy to artifacts directory
    h1_art = os.path.join(artifact_dir, "ndufo_hero_slide1_superimposed.jpg")
    h2_art = os.path.join(artifact_dir, "ndufo_hero_slide2_superimposed.jpg")
    h1_crisp.save(h1_art, quality=95, optimize=True)
    h2_crisp.save(h2_art, quality=95, optimize=True)
    print("Saved to artifacts directory for walkthrough embedding.")

finalize_and_deploy()
