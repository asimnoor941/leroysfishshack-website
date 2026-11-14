"""Copy the business's own media from the mirror into the project.

    python -I scripts/import-assets.py

Reads reference/original-site (third-party mirror, never published) and writes:
  src/assets/brand/   logo (ink) and logo-light (for dark backgrounds)
  src/assets/photos/  resized photos (Astro builds AVIF/WebP from these)
  public/             favicons, icon-512, og-default.jpg
  public/media/       hero.mp4 (H.264, no audio, trimmed) and hero-poster.jpg

All photos here are the restaurant's own phone photos (dining room, rum bar,
River Room, dishes). Needs Pillow and ffmpeg.
"""
import os, shutil, subprocess, sys
from PIL import Image, ImageOps

SRC = "reference/original-site/media"
A = "src/assets"
os.makedirs(f"{A}/brand", exist_ok=True)
os.makedirs(f"{A}/photos", exist_ok=True)
os.makedirs("public/media", exist_ok=True)

PHOTOS = {
    # interiors
    "2026/08/IMG_9861.jpeg": "dining-room-harbor",
    "2026/08/IMG_9862.jpeg": "dining-room-mounts",
    "2026/08/IMG_9868.jpeg": "rum-bar",
    "2026/10/IMG_1010.jpeg": "river-room-table",
    "2026/10/IMG_1011.jpeg": "river-room-2",
    "2026/10/IMG_1012.jpeg": "river-room-3",
    "2026/10/IMG_1013.jpeg": "river-room",
    # dishes (named on the live site)
    "2026/10/leroys-fish-shack-basmati-rice-bowl-with-fresh-catch.jpg": "basmati-rice-bowl",
    "2026/10/leroys-fish-shack-brisket-and-ribs.jpg": "brisket-and-ribs",
    "2026/10/leroys-fish-shack-buffalo-shrimp.jpg": "buffalo-shrimp",
    "2026/10/leroys-fish-shack-calamari.jpg": "calamari",
    "2026/10/leroys-fish-shack-house-salad-with-grilled-chicken.jpg": "house-salad",
    "2026/10/leroys-fish-shack-seafood-lasagna.jpg": "seafood-lasagna",
    "2026/10/leroys-fish-shack-seafood-paella.jpg": "seafood-paella",
    "2026/10/leroys-fish-shack-seafood-stew.jpg": "seafood-stew",
    "2026/10/leroys-fish-shack-smoked-fish-dip.jpg": "smoked-fish-dip",
    "2026/10/leroys-fish-shack-tropical-grouper.jpg": "tropical-grouper",
    "2026/10/leroys-fish-shack-zucchini-noodle-bowl-with-grilled-shrimp.jpg": "zucchini-noodle-bowl",
    "2026/10/leroys-fish-shack-fresh-from-the-kitchen-2.jpg": "kitchen-fried-seafood",
    "2026/10/leroys-fish-shack-fresh-from-the-kitchen-3.jpg": "kitchen-seared-fish",
    "2026/10/leroys-fish-shack-fresh-from-the-kitchen-4.jpg": "kitchen-ribbon-pasta",
    "2026/10/leroys-fish-shack-fresh-from-the-kitchen-5.jpg": "kitchen-seared-fillet",
    # menu boards and gift card
    "2026/08/Leroys-Fish-Shack-Menu-1.png": "menu-1",
    "2026/08/Leroys-Fish-Shack-Menu-2.png": "menu-2",
    "2026/08/e-gift-card.png": "e-gift-card",
}


def load(path):
    return ImageOps.exif_transpose(Image.open(path))


for src, name in PHOTOS.items():
    im = load(f"{SRC}/{src}").convert("RGB")
    im.thumbnail((2400, 2400), Image.LANCZOS)
    ext = "png" if src.endswith(".png") else "jpg"
    out = f"{A}/photos/{name}.{ext}"
    im.save(out, quality=86, optimize=True) if ext == "jpg" else im.save(out, optimize=True)
    print("photo", out, im.size)

# ---- logo ----
logo = load(f"{SRC}/2026/08/Leroys_Fish_Shack_logo-scaled.png").convert("RGBA")
logo = logo.crop(logo.getbbox())
logo.thumbnail((1400, 1400), Image.LANCZOS)
logo.save(f"{A}/brand/logo.png", optimize=True)

# Light version: dark ink becomes sand, the white house walls become transparent,
# the mint roof stays.
SAND = (246, 244, 238)
px = logo.load()
light = Image.new("RGBA", logo.size)
lp = light.load()
for y in range(logo.height):
    for x in range(logo.width):
        r, g, b, a = px[x, y]
        if a == 0:
            continue
        mx, mn = max(r, g, b), min(r, g, b)
        sat = (mx - mn) / mx if mx else 0
        lum = (r * 299 + g * 587 + b * 114) / 1000
        if sat > 0.18:
            lp[x, y] = (r, g, b, a)  # roof colour
        elif lum > 200:
            lp[x, y] = (0, 0, 0, 0)  # white fill
        else:
            k = 1 - lum / 255  # ink strength
            lp[x, y] = (*SAND, int(a * min(1, k * 1.25)))
light.save(f"{A}/brand/logo-light.png", optimize=True)
print("logo", logo.size)

# ---- icons ----
icon = load(f"{SRC}/2026/08/cropped-Leroys_Fish_Shack_logo_1080x1080.png").convert("RGBA")
for size, name in ((512, "icon-512.png"), (192, "icon-192.png"), (180, "apple-touch-icon.png"), (32, "favicon-32.png")):
    bg = Image.new("RGBA", icon.size, (255, 255, 255, 255))
    bg.alpha_composite(icon)
    bg.convert("RGB").resize((size, size), Image.LANCZOS).save(f"public/{name}", optimize=True)

# ---- social image: dining room with harbor view, 1200x630 ----
og = load(f"{SRC}/2026/08/IMG_9862.jpeg").convert("RGB")
og = ImageOps.fit(og, (1200, 630), Image.LANCZOS, centering=(0.5, 0.55))
og.save("public/og-default.jpg", quality=84, optimize=True)

# ---- hero video: first 16s, 720 wide, H.264, no audio ----
mov = f"{SRC}/2026/09/IMG_6736.mov"
if shutil.which("ffmpeg"):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "0", "-t", "16", "-i", mov, "-an",
                    "-vf", "scale=720:-2,fps=30", "-c:v", "libx264", "-preset", "slow", "-crf", "27",
                    "-pix_fmt", "yuv420p", "-map_metadata", "-1", "-movflags", "+faststart", "public/media/hero.mp4"], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "0.2", "-i", mov, "-frames:v", "1", "-map_metadata", "-1",
                    "-vf", "scale=720:-2", "-q:v", "4", "public/media/hero-poster.jpg"], check=True)
    print("video", os.path.getsize("public/media/hero.mp4"))
else:
    sys.exit("ffmpeg not found: video skipped")
