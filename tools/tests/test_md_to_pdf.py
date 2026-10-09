"""tools/md_to_pdf.py için küçük test — sahte markdown + palet geçici klasörde üretilir.

  python3 tools/tests/test_md_to_pdf.py

Denenenler: dönüştürücü (başlık, liste, tablo, link, kaçış), PDF'te link annotation'ları (/URI) ve iç link,
pdftotext ile metin, pdfinfo ile sayfa boyutu (Letter / A4), ara HTML'de palet renkleri.
Fontlar ağdan bağımsız olsun diye --no-fonts ile çalışır. Node/Playwright yoksa PDF kısmı atlanır.
"""
import json
import re
import shutil
import subprocess
import sys
import tempfile
import zlib
from pathlib import Path

ARACLAR = Path(__file__).resolve().parent.parent
ARAC = ARACLAR / "md_to_pdf.py"
sys.path.insert(0, str(ARACLAR))
import md_to_pdf as m2p  # noqa: E402

PALET = {"id": "test", "name": "Test Palette", "ink": "#2B3A4E", "deep": "#4E6782", "primary": "#6E88A3",
         "mist_top": "#DDE5EC", "mist_bottom": "#B7C6D4", "gold": "#B8996A", "gold_light": "#D9C49E",
         "ivory": "#FBF7EF", "leaf": "#9AAE9F"}

MD = """# START HERE — Test Set

Thank you! Shop: [PLACEHOLDER: shop name]

## Open your templates

1. Open the [video template](https://example.com/video-template) link.
2. Click **Use template** — Canva makes *your own copy*.
   - Nested tip with `code`
3. Website: <https://example.com/website-template>

> Bare link: https://example.com/help.

| Item | Size |
|---|---:|
| [Invitation PDF](https://example.com/pdf) | 5 × 7 in |

- [ ] Change the date to September 18, 2027

<!-- pagebreak -->

## Troubleshooting

Back to [the start](#open-your-templates). <script>alert(1)</script>
"""


def pdf_uri(veri: bytes):
    """Ham PDF ve açılmış (Flate) akışlardaki /URI değerleri + iç link sayısı."""
    parcalar = [veri]
    for m in re.finditer(rb"stream\r?\n(.*?)\r?\nendstream", veri, re.S):
        try:
            parcalar.append(zlib.decompress(m.group(1)))
        except zlib.error:
            pass
    hepsi = b"\n".join(parcalar)
    uri = {u.decode() for u in re.findall(rb"/URI\s*\(([^)]*)\)", hepsi)}
    link = len(re.findall(rb"/Subtype\s*/Link", hepsi))
    return uri, link


def test_donusturucu():
    md = m2p.MD(Path("."))
    h = md.donustur(MD)
    assert '<h1 id="start-here--test-set">' in h or "<h1 id=" in h
    assert '<h2 id="open-your-templates">' in h
    assert '<a href="https://example.com/video-template">video template</a>' in h
    assert '<a href="https://example.com/website-template">' in h
    assert '<a href="https://example.com/help">https://example.com/help</a>.' in h  # nokta linke girmez
    assert "<table>" in h and 'text-align:right' in h
    assert "<ol>" in h and "<ul>" in h and "<code>code</code>" in h
    assert "<script>" not in h and "&lt;script&gt;" in h
    assert 'class="page-break"' in h
    assert m2p.MD(Path(".")).satir("[x](javascript:void)") == '<a href="#">x</a>'
    # koyu palet: başlık rengi beyaz zeminde okunur seçilir
    koyu = {**PALET, "ink": "#EFE6DA", "deep": "#C9A46A", "primary": "#141217"}
    assert m2p.okunur(koyu, "#FFFFFF", ("deep", "ink", "primary"), 4.5, "#2B2B2B") == "#141217"


def test_pdf(t: Path):
    if not m2p.playwright_hazir():
        print("  pdf: node/Playwright yok — atlandı")
        return
    (t / "guide.md").write_text(MD, encoding="utf-8")
    (t / "palette.json").write_text(json.dumps(PALET))
    for boyut, beklenen in (("letter", "612 x 792"), ("a4", "595")):
        out, ara = t / f"guide_{boyut}.pdf", t / f"guide_{boyut}.html"
        r = subprocess.run([sys.executable, str(ARAC), str(t / "guide.md"), str(out), "--palette",
                            str(t / "palette.json"), "--size", boyut, "--no-fonts", "--keep-html", str(ara)],
                           capture_output=True, text=True)
        assert r.returncode == 0, r.stderr
        uri, link = pdf_uri(out.read_bytes())
        hedef = {"https://example.com/video-template", "https://example.com/website-template",
                 "https://example.com/help", "https://example.com/pdf"}
        assert hedef <= uri, uri
        assert link >= len(hedef) + 1, link  # + iç link (#open-your-templates)
        html = ara.read_text()
        assert PALET["deep"] in html and PALET["gold"] in html
        if shutil.which("pdfinfo"):
            info = subprocess.run(["pdfinfo", str(out)], capture_output=True, text=True).stdout
            assert beklenen in info, info
            assert re.search(r"Pages:\s+2", info), info  # pagebreak çalıştı
            assert "START HERE — Test Set" in info  # başlık
        if shutil.which("pdftotext"):
            metin = subprocess.run(["pdftotext", str(out), "-"], capture_output=True, text=True).stdout
            for parca in ("Open your templates", "video template", "September 18, 2027", "Troubleshooting",
                          "[PLACEHOLDER: shop name]"):
                assert parca in metin, parca
    # palet hatası → çıkış 1
    (t / "bad.json").write_text(json.dumps({"ink": "blue"}))
    r = subprocess.run([sys.executable, str(ARAC), str(t / "guide.md"), str(t / "x.pdf"), "--palette",
                        str(t / "bad.json"), "--no-fonts"], capture_output=True, text=True)
    assert r.returncode == 1 and "palette.json" in r.stderr, r.stderr


def main():
    test_donusturucu()
    print("  test_donusturucu: tamam")
    with tempfile.TemporaryDirectory() as t:
        test_pdf(Path(t))
    print("  test_pdf: tamam")
    print("test_md_to_pdf: tamam")


if __name__ == "__main__":
    main()
