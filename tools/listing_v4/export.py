"""setNN/*.png → collections/NN_*/package/listing/images_v4/NN-name.jpg (Etsy upload order)."""
import glob, sys
from pathlib import Path
from PIL import Image
ROOT = Path("C:/Users/Foto/Documents/davetiye-maker")
for nn in sys.argv[1:]:
    d = Path(glob.glob(str(ROOT / f"collections/{nn}_*"))[0]) / "package/listing/images_v4"
    d.mkdir(parents=True, exist_ok=True)
    fs = sorted(Path(f"set{nn}").glob("*.png"))
    tot = 0
    for f in fs:
        o = d / (f.stem + ".jpg")
        Image.open(f).convert("RGB").save(o, quality=90, optimize=True)
        tot += o.stat().st_size
    print(nn, len(fs), f"{tot/1e6:.1f} MB", d)
