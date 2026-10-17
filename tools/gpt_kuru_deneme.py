#!/usr/bin/env python3
"""GPT parçaları gelmeden "bırak-çalıştır" provası (G167): bir temanın GPT_PROMPTS.md dosyasında istenen HER görseli
doğru ölçü ve şeffaflıkta nötr bir deneme görseliyle doldurur — gerçek repoda değil, geçici bir kopya kökte — sonra o
kökte temanın `build_images.py`'sini ve `node scripts/build-print-assets.ts --theme <id>`'yi koşar, çıktıyı denetler
ve (isteğe bağlı) theme-check'i de orada koşar. Repo değişmez; deneme görselleri hiçbir yere kaydedilmez.

  python3 tools/gpt_kuru_deneme.py --tema <id> [--sekil sekil.json] [--theme-check [--stress]] [--port 3400] [--tut]

Denetimler (çıkış kodu 1 = sorun):
  1 build_images.py ve build-print-assets.ts hatasız bitiyor
  2 temanın HTML/CSS/JS/theme.json'da adı geçen her img/<dosya> yeni çıktıda var (GPT yolu, geçici yolla aynı adları
    üretmeli — yoksa sayfa kırık görsel gösterir); eski çıktıda olup yenide olmayan dosyalar listelenir
  3 hangi PAKET 5 / PAKET 6 parçasını build OKUDU (Python denetim kancası + baskı kaynakları): istenip hiç okunmayan
    parça = "yetim prompt" (ya build onu kullanmıyor ya da prompt fazladan); build'in okuyup prompt'ta olmayan parça
    = "prompt'suz parça". PAKET 2 fotoğrafları build okumaz (theme-check/seed okur), bu denetimin dışında.
  4 yeni manifest'te "interim"/"geçici" izi kalmışsa uyarı (GPT yolu kendine geçmemiş olabilir)
  5 --theme-check: kopyada `npm run build`'siz theme-check (kopya .next ile; deneme fotoğrafları PAKET 2 yerine)

Deneme görseli: opak → yumuşak gradyan + gren (tek renk değil: tema build'lerinin yüzdelik/ton hesapları sıfıra
bölünmesin); şeffaf → tuvalin ortasında yumuşak kenarlı opak bir dikdörtgen, kenar şeridi tam şeffaf (kit_check'ten
geçer); prompt bloğunda `#00FF00` varsa içinde düz #00FF00 bir pencere. `--sekil` JSON'u dosya adı → {"kutu": [x0,y0,
x1,y1] (tuval yüzdesi), "pencere": [x0,y0,x1,y1]} ile bir parçanın prompt'taki yerini verir (kat kat aynı tuvaldeki
sahne parçaları için gerçeğe yakın deneme). Hiçbir deneme görseli ürün değildir; K21'e dokunmaz.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

KOK = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(KOK / "tools"))
from kit_check import KAYDET, OLCU, PAKET  # noqa: E402

DOSYA = re.compile(r"`([^`\s/]*?/?[^`\s]*\.(?:png|jpg|jpeg|webp))`")
IMG_REF = re.compile(r"img/([A-Za-z0-9_.~-]+\.(?:webp|jpg|jpeg|png|avif|gif|svg))")


def beklenenler(prompts: Path) -> list[dict]:
    """kit_check.beklenenler gibi, ama bir Kaydet satırındaki BÜTÜN dosyaları sayar (`tile_1.png`, `tile_2.png` … ve
    `a.png` ve `b.png` satırları): adı yalın olanlar ilk yolun klasöründen çözülür."""
    out, paket, cur = [], None, []
    for line in prompts.read_text(encoding="utf-8").splitlines():
        m = PAKET.match(line)
        if m:
            paket = int(m.group(1))
        if line.startswith("#"):
            cur = []
            continue
        m = KAYDET.search(line)
        if not m:
            if cur and "#00FF00" in line.upper():
                for b in cur:
                    b["pencere"] = True
            continue
        ilk = m.group(1)
        klasor = ilk.rsplit("/", 1)[0]
        o = OLCU.search(m.group(2))
        seffaf = "şeffaf" in line.lower() or "seffaf" in line.lower() or "transparent" in line.lower()
        cur = []
        for ad in DOSYA.findall(line[m.start():]):
            yol = ad if "/" in ad else f"{klasor}/{ad}"
            b = {"yol": yol, "olcu": (int(o.group(1)), int(o.group(2))) if o else None, "seffaf": seffaf,
                 "paket": paket, "pencere": False}
            out.append(b)
            cur.append(b)
    return out


def deneme_gorseli(b: dict, sekil: dict, tohum: int) -> Image.Image:
    w, h = b["olcu"] or ((1024, 1280) if b["yol"].endswith(".jpg") else (1024, 1024))
    rng = np.random.default_rng(tohum)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    taban = rng.uniform(70, 190, 3)
    egim = (xx / w * 50 + yy / h * 40)[..., None] - 45
    rgb = np.clip(taban + egim + rng.normal(0, 9, (h, w, 1)), 0, 255)
    ad = Path(b["yol"]).name
    s = sekil.get(ad, {})
    if b["pencere"]:
        x0, y0, x1, y1 = s.get("pencere", [30, 16, 70, 50])
        rgb[int(y0 * h / 100):int(y1 * h / 100), int(x0 * w / 100):int(x1 * w / 100)] = (0, 255, 0)
    im = Image.fromarray(rgb.astype(np.uint8), "RGB")
    if not b["seffaf"]:
        return im
    x0, y0, x1, y1 = s.get("kutu", [12, 10, 88, 90])
    a = Image.new("L", (w, h), 0)
    a.paste(255, (int(x0 * w / 100), int(y0 * h / 100), int(x1 * w / 100), int(y1 * h / 100)))
    a = a.filter(ImageFilter.GaussianBlur(2))
    im.putalpha(a)
    return im


def kopya_kok(hedef: Path, tema: str, koleksiyon: str, platform_tam: bool) -> None:
    """Geçici kök: tools/ ve platform/ kopya (build'ler kendi ROOT'larına yazar), koleksiyonlar sembolik bağ — hedef
    koleksiyon kopya ve GPT klasörleri boş; gerisi (docs, brand …) sembolik bağ."""
    hedef.mkdir(parents=True)
    for p in KOK.iterdir():
        if p.name in (".git", "platform", "tools", "collections"):
            continue
        (hedef / p.name).symlink_to(p)
    shutil.copytree(KOK / "tools", hedef / "tools", symlinks=True, ignore=shutil.ignore_patterns("__pycache__"))
    (hedef / "collections").mkdir()
    for c in (KOK / "collections").iterdir():
        if c.name != koleksiyon:
            (hedef / "collections" / c.name).symlink_to(c)
    shutil.copytree(KOK / "collections" / koleksiyon, hedef / "collections" / koleksiyon, symlinks=True,
                    ignore=lambda d, n: [x for x in n if Path(d).name in ("parts", "photos", "print") and x != ".gitkeep"])
    pl, ph = KOK / "platform", hedef / "platform"
    ph.mkdir()
    for p in pl.iterdir():
        if p.name == "node_modules":
            (ph / p.name).symlink_to(p)
        elif p.name in (".data", "previews") or (p.name in (".next", "public", "tests") and not platform_tam):
            continue
        elif p.name == "themes":
            (ph / "themes").mkdir()
            for t in p.iterdir():
                if t.name == tema:
                    shutil.copytree(t, ph / "themes" / t.name)
                else:
                    (ph / "themes" / t.name).symlink_to(t)
        elif p.name == "public":
            shutil.copytree(p, ph / "public", symlinks=True, ignore=shutil.ignore_patterns("themes"))
        elif p.is_dir():
            shutil.copytree(p, ph / p.name, symlinks=True, ignore=shutil.ignore_patterns("cache") if p.name == ".next" else None)
        else:
            shutil.copy2(p, ph / p.name)
    (ph / "public" / "print" / tema).mkdir(parents=True, exist_ok=True)


def tema_refs(tema_dir: Path) -> set[str]:
    refs = set()
    for f in list(tema_dir.glob("*.html")) + list(tema_dir.glob("*.css")) + list(tema_dir.glob("*.js")) + [tema_dir / "theme.json"]:
        if f.exists():
            t = re.sub(r"/\*.*?\*/|<!--.*?-->", "", f.read_text(encoding="utf-8"), flags=re.S)
            if f.suffix == ".js":
                t = re.sub(r"(?m)^\s*//.*$|(?<=[;{}),])\s*//.*$", "", t)  # satır yorumları (URL'lerdeki // kalır)
            refs |= set(IMG_REF.findall(t))
    return refs


KANCA = r"""
import runpy, sys, json, os
okunan = set()
def k(olay, arg):
    if olay == "open" and isinstance(arg[0], (str, bytes, os.PathLike)):
        okunan.add(os.path.realpath(os.fsdecode(arg[0])))
sys.addaudithook(k)
try:
    sys.argv = [sys.argv[1]]
    runpy.run_path(sys.argv[0], run_name="__main__")
finally:
    json.dump(sorted(okunan), open(os.environ["KURU_OKUNAN"], "w"))
"""


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--tema", required=True)
    ap.add_argument("--koleksiyon", help="ör. 24_Grand_Theatre_Premiere (vars.: build_images.py içindeki COL)")
    ap.add_argument("--sekil", help="dosya adı → {kutu, pencere} yüzdeleri (JSON dosyası)")
    ap.add_argument("--theme-check", action="store_true", help="kopyada theme-check de koş (platform kopyalanır, ~0,7 GB)")
    ap.add_argument("--stress", action="store_true")
    ap.add_argument("--port", type=int, default=3400)
    ap.add_argument("--out", help="theme-check çıktı klasörü (vars. geçici kökün içi)")
    ap.add_argument("--tut", action="store_true", help="geçici kökü silme (yolu yazılır)")
    a = ap.parse_args()

    tema_dir = KOK / "platform/themes" / a.tema
    bi = tema_dir / "build_images.py"
    if not bi.exists():
        print(f"{a.tema}: build_images.py yok")
        return 1
    kol = a.koleksiyon or re.search(r'collections/([^"/]+)"', bi.read_text(encoding="utf-8")).group(1)
    prompts = KOK / "collections" / kol / "assets/gpt/GPT_PROMPTS.md"
    liste = beklenenler(prompts)
    sekil = json.loads(Path(a.sekil).read_text()) if a.sekil else {}
    if a.theme_check:
        import socket
        with socket.socket() as so:
            if so.connect_ex(("127.0.0.1", a.port)) == 0:
                print(f"port {a.port} kullanımda — başka bir --port ver")
                return 1
    gecici = Path(tempfile.mkdtemp(prefix=f"kuru-{a.tema}-"))
    kok = gecici / "repo"
    sorun, uyari = [], []
    try:
        kopya_kok(kok, a.tema, kol, a.theme_check)
        for i, b in enumerate(liste):
            yol = kok / b["yol"]
            yol.parent.mkdir(parents=True, exist_ok=True)
            im = deneme_gorseli(b, sekil, i)
            (im.convert("RGB").save(yol, quality=88) if yol.suffix.lower() in (".jpg", ".jpeg") else im.save(yol))
        print(f"{len(liste)} deneme görseli yazıldı ({sum(b['paket'] == 5 for b in liste)} PAKET 5, "
              f"{sum(b['paket'] == 2 for b in liste)} PAKET 2, {sum(b['paket'] == 6 for b in liste)} PAKET 6)")

        eski = {p.name for p in (tema_dir / "img").iterdir()} if (tema_dir / "img").exists() else set()
        okunan_dosya = gecici / "okunan.json"
        env = {**os.environ, "KURU_OKUNAN": str(okunan_dosya)}
        r = subprocess.run([sys.executable, "-c", KANCA, str(kok / "platform/themes" / a.tema / "build_images.py")],
                           cwd=kok, env=env, capture_output=True, text=True)
        if r.returncode:
            sorun.append(f"build_images.py çıkış {r.returncode}:\n{(r.stdout + r.stderr)[-3000:]}")
        okunan = set(json.loads(okunan_dosya.read_text())) if okunan_dosya.exists() else set()
        r2 = subprocess.run(["node", "scripts/build-print-assets.ts", "--theme", a.tema], cwd=kok / "platform",
                            capture_output=True, text=True)
        if r2.returncode:
            sorun.append(f"build-print-assets çıkış {r2.returncode}: {(r2.stdout + r2.stderr)[-1500:]}")
        baski = r2.stdout.strip().splitlines()

        yeni_img = kok / "platform/themes" / a.tema / "img"
        yeni = {p.name for p in yeni_img.iterdir()} if yeni_img.exists() else set()
        kirik = sorted(tema_refs(kok / "platform/themes" / a.tema) - yeni)
        if kirik:
            sorun.append("sayfaların istediği ama GPT build'inin üretmediği img/: " + ", ".join(kirik))
        kayip = sorted(eski - yeni - {"manifest.json"})
        if kayip:
            uyari.append("geçici çıktıda olup GPT çıktısında olmayan (hiçbir sayfa istemiyorsa sorun değil): " + ", ".join(kayip))
        mf = yeni_img / "manifest.json"
        notlar = [v for k, v in (json.loads(mf.read_text(encoding="utf-8")).items() if mf.exists() else [])
                  if k in ("_note", "note", "mode", "_mode") and isinstance(v, str)]
        if any(re.search(r"interim|geçici", v, re.I) for v in notlar):
            uyari.append("yeni manifest.json'da 'interim/geçici' izi var — GPT yoluna tam geçilmemiş olabilir")

        # hangi parça okundu: build_images (denetim kancası) + baskı kaynakları (layouts → build-print-assets çıktısı)
        lay = (KOK / "platform/lib/print/layouts.ts").read_text(encoding="utf-8")
        blok = re.search(rf"'{re.escape(a.tema)}':\s*\{{(.*?)\n  \}},", lay, re.S)
        baski_kaynak = set(re.findall(r"'([^']+\.(?:png|webp|jpg))'", blok.group(1))) if blok else set()
        okundu, yetim = [], []
        for b in liste:
            if b["paket"] == 2:
                continue
            tam = os.path.realpath(kok / b["yol"])
            rel_gpt = b["yol"].split("/assets/gpt/", 1)[-1]
            if tam in okunan or rel_gpt in baski_kaynak:
                okundu.append(b["yol"])
            else:
                yetim.append(b["yol"])
        parca_kok = os.path.realpath(kok / "collections" / kol / "assets/gpt")
        istenen = {os.path.realpath(kok / b["yol"]) for b in liste}
        promptsuz = sorted(p for p in okunan if p.startswith(parca_kok + os.sep) and p not in istenen and not p.endswith(".md"))
        print(f"\nbuild_images: {'TAMAM' if not r.returncode else 'HATA'} · çıktı {len(yeni)} dosya · baskı: "
              f"{'TAMAM' if not r2.returncode else 'HATA'}")
        for s in baski:
            print("  baskı", s)
        print(f"okunan GPT parçası: {len(okundu)}/{len(okundu) + len(yetim)} (PAKET 5 + 6)")
        for y in yetim:
            print(f"  OKUNMADI  {y}")
        for p in promptsuz:
            print(f"  PROMPT'SUZ  {os.path.relpath(p, kok)}")
        if yetim:
            uyari.append(f"{len(yetim)} parça build/baskı tarafından okunmadı (yukarıda)")
        if promptsuz:
            sorun.append(f"{len(promptsuz)} parçayı build okuyor ama prompt'u yok")

        if a.theme_check and not r.returncode:
            subprocess.run(["node", "scripts/theme-assets.cjs"], cwd=kok / "platform", check=True, capture_output=True)
            out = a.out or str(gecici / "shots")
            komut = ["node", "scripts/theme-check.cjs", "--theme", a.tema, "--compare", "none", "--no-video", "--out", out,
                     "--photos", str(kok / "collections" / kol / "assets/gpt/photos")]
            if a.stress:
                komut.append("--stress")
            r3 = subprocess.run(komut, cwd=kok / "platform", capture_output=True, text=True,
                                env={**os.environ, "PORT": str(a.port), "NODE_PATH": "/opt/node22/lib/node_modules"})
            son = (r3.stdout + r3.stderr).strip().splitlines()
            print("\ntheme-check (deneme görselleriyle):")
            for s in son[-40:]:
                print("  " + s)
            if r3.returncode:
                sorun.append("theme-check hatalı (yukarıda)")
    finally:
        if a.tut:
            print(f"\ngeçici kök tutuldu: {kok}")
        else:
            shutil.rmtree(gecici, ignore_errors=True)
    for u in uyari:
        print("UYARI  " + u)
    for s in sorun:
        print("SORUN  " + s)
    print("SONUÇ  " + ("GEÇTİ" if not sorun else "KALDI"))
    return 1 if sorun else 0


if __name__ == "__main__":
    sys.exit(main())
