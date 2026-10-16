# Green-screen key for the Vio character art: assets/vio/raw/*.webp -> studio/public/vio/*.png (RGBA).
# alpha from "greenness" (g - max(r, b)) with a soft ramp, then green spill removed on the edges.
import sys, glob, os
import numpy as np
from PIL import Image, ImageFilter
SRC, DST = sys.argv[1], sys.argv[2]
os.makedirs(DST, exist_ok=True)
for f in sorted(glob.glob(os.path.join(SRC, '*.webp')) + glob.glob(os.path.join(SRC, '*.png'))):
    im = np.asarray(Image.open(f).convert('RGB')).astype(np.float32)
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    green = g - np.maximum(r, b)
    a = 1 - np.clip((green - 40) / (110 - 40), 0, 1)
    # despill: pull green down to the larger of r/b wherever it dominates
    g2 = np.where(green > 0, np.maximum(r, b) + np.clip(green, 0, None) * 0.15, g)
    out = np.dstack([r, g2, b, a * 255]).clip(0, 255).astype(np.uint8)
    img = Image.fromarray(out, 'RGBA')
    al = img.split()[3].filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6))
    img.putalpha(al)
    name = os.path.splitext(os.path.basename(f))[0]
    img.save(os.path.join(DST, name + '.png'), optimize=True)
    print(name, img.size)
