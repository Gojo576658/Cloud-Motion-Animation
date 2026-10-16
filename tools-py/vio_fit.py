# Normalise a keyed Vio pose to the idle pose's scale and position: scale by s, then paste at (dx, dy) on a
# transparent 1536-tall canvas of width W, so the shirt "M" lands where the idle pose has it (663, 737).
# Poses with a long arm get a wider canvas (to the right). Usage: python3 vio_fit.py in.png out.png s dx dy W
import sys
from PIL import Image
src, dst, s, dx, dy, W = sys.argv[1], sys.argv[2], float(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6])
im = Image.open(src).convert('RGBA')
im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
out = Image.new('RGBA', (W, 1536), (0, 0, 0, 0))
cx, cy = max(0, -dx), max(0, -dy)
out.alpha_composite(im.crop((cx, cy, im.width, im.height)), (max(0, dx), max(0, dy)))
out.save(dst, optimize=True)
print(dst, out.size)
