"""Full-frame 4:5 listing video from a slow-motion capture (rec.mjs, viewport 432x540 @ DPR 2.5 = 1080x1350).
usage: python full45.py <rec dir> <out.mp4> [start_s] [end_s] [fps=60] [loop_s=0.4]
Picks, for every 1/fps of page time, the captured frame nearest in time; the last loop_s dissolve into the first frame
so Etsy's autoplay loop has no jump."""
import json, subprocess, sys, tempfile
from pathlib import Path
from PIL import Image
try:
    import imageio_ffmpeg
    FF = imageio_ffmpeg.get_ffmpeg_exe()
except ImportError:                       # Linux: the system ffmpeg
    import shutil
    FF = shutil.which("ffmpeg")
d, out = Path(sys.argv[1]), Path(sys.argv[2])
meta = json.loads((d / "frames.json").read_text())
fr = meta["frames"]
start = float(sys.argv[3]) if len(sys.argv) > 3 else fr[0]["t"]
end = float(sys.argv[4]) if len(sys.argv) > 4 else fr[-1]["t"]
fps = int(sys.argv[5]) if len(sys.argv) > 5 else 60
lp = float(sys.argv[6]) if len(sys.argv) > 6 else 0.4
n = int(round((end - start) * fps))
ease = lambda k: k * k * (3 - 2 * k)
with tempfile.TemporaryDirectory() as tmp:
    tmp = Path(tmp)
    j, worst, used, first = 0, 0.0, set(), None
    for k in range(n):
        t = start + k / fps
        while j + 1 < len(fr) and abs(fr[j + 1]["t"] - t) <= abs(fr[j]["t"] - t):
            j += 1
        worst = max(worst, abs(fr[j]["t"] - t)); used.add(j)
        im = Image.open(d / fr[j]["file"]).convert("RGB")
        if im.size != (1080, 1350):
            im = im.resize((1080, 1350), Image.LANCZOS)
        if k == 0:
            first = im
        T = k / fps
        if T > (n / fps) - lp:
            im = Image.blend(im, first, ease((T - ((n / fps) - lp)) / lp))
        im.save(tmp / f"{k:05d}.png", compress_level=1)
    subprocess.run([FF, "-y", "-loglevel", "warning", "-framerate", str(fps), "-i", str(tmp / "%05d.png"), "-c:v", "libx264",
                    "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(out)], check=True)
print(f"{out}: {n / fps:.2f} s, {n} frames, {len(used)} distinct, worst timing error {worst * 1000:.1f} ms, {out.stat().st_size / 1e6:.1f} MB")
