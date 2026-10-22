import glob, sys
from PIL import Image
nns = sys.argv[1:]
W, H = 200, 250
s = Image.new('RGB', (W * 19 + 10, H * len(nns)), 'white')
for r, nn in enumerate(nns):
    for i, f in enumerate(sorted(glob.glob(f'set{nn}/*.png'))):
        s.paste(Image.open(f).convert('RGB').resize((W - 4, H - 4), Image.LANCZOS), (i * W, r * H))
s.save('sheet_' + '_'.join(nns) + '.jpg', quality=85)
