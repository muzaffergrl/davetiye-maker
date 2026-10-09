"""Markdown → markalı PDF (kılavuz A5 ve Etsy ilan PDF'i B3 için).

  python3 tools/md_to_pdf.py <girdi.md> <çıktı.pdf> --palette <palette.json> [--size letter|a4|a5]
                             [--no-fonts] [--keep-html yol.html] [--title "..."]

Yol: markdown → HTML (bu dosyadaki küçük dönüştürücü, ek paket yok) → Playwright Chromium `page.pdf()`.
Chromium PDF'e gerçek link annotation'ları (/URI) yazar; linkler tıklanabilir kalır.

Fontlar: Google Fonts CSS'i çalışma anında indirilir, woff2 dosyaları geçici klasöre konur ve
Chromium'a yerel dosya olarak verilir (Chromium ağa çıkmaz). Repoya font dosyası girmez.
İndirme başarısızsa uyarı verilir ve sistem serif/sans fontlarıyla devam edilir. `--no-fonts` indirmeyi atlar.

Renkler palette.json'dan (ink, deep, primary, gold, gold_light, mist_top, ivory). Sayfa zemini
beyazdır (baskı); başlık rengi beyaz üzerinde en okunur palet rengi seçilir (koyu paletlerde de çalışır).

Desteklenen markdown: # başlıklar, paragraf, **kalın**, *italik*, `kod`, [link](url), <https://otomatik>,
çıplak https:// URL, ![görsel](yol), - / 1. listeler (iç içe), - [ ] görev kutusu, > alıntı, ---,
``` kod bloğu, | tablo |, satır sonu iki boşluk, `<!-- pagebreak -->` sayfa sonu.
Ham HTML kaçışlanır (güvenli).

Gerekenler: node + Playwright (global; NODE_PATH yoksa `npm root -g` kullanılır) ve Chromium
(PLAYWRIGHT_BROWSERS_PATH). Ortak yardımcılar (fontlar, Playwright çalıştırıcı) tools/mockup_compose.py
`render` komutunca da kullanılır.
"""
import argparse
import html
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request
from pathlib import Path

VARSAYILAN_FONTLAR = {"heading": "Cormorant Garamond", "body": "Montserrat", "script": "Pinyon Script"}
FONT_AILELERI = {
    "Cormorant Garamond": "ital,wght@0,500;0,600;0,700;1,500",
    "Montserrat": "ital,wght@0,400;0,500;0,600;1,400",
    "Pinyon Script": "",
}
SAYFA = {"letter": "Letter", "a4": "A4", "a5": "A5"}
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"


# ----------------------------------------------------------------------------- palet / renk

def palet_oku(yol) -> dict:
    p = json.loads(Path(yol).read_text(encoding="utf-8"))
    for k in ("ink", "deep", "primary", "gold"):
        if not re.fullmatch(r"#[0-9A-Fa-f]{6}", str(p.get(k, ""))):
            raise ValueError(f"palette.json: '{k}' #RRGGBB olmalı")
    return p


def _lum(hexc: str) -> float:
    c = [int(hexc[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def kontrast(a: str, b: str) -> float:
    la, lb = sorted((_lum(a), _lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def okunur(palet: dict, zemin: str, adaylar, esik: float, yedek: str) -> str:
    """Adaylar arasından zemine karşı eşiği geçen ilkini, yoksa en yüksek kontrastlıyı (o da düşükse yedeği) döndür."""
    renkler = [palet[k] for k in adaylar if re.fullmatch(r"#[0-9A-Fa-f]{6}", str(palet.get(k, "")))]
    for r in renkler:
        if kontrast(r, zemin) >= esik:
            return r
    en = max(renkler, key=lambda r: kontrast(r, zemin), default=yedek)
    return en if kontrast(en, zemin) >= 3 else yedek


# ----------------------------------------------------------------------------- fontlar

def google_fonts_css(aileler, hedef: Path, alt_kume=("latin", "latin-ext")) -> str:
    """Google Fonts CSS'ini indirip woff2'leri `hedef` klasörüne koyar; yerel @font-face CSS döndürür.
    Başarısızsa '' döndürür (uyarı stderr'e)."""
    parca = []
    for a in aileler:
        eks = FONT_AILELERI.get(a, "")
        parca.append("family=" + urllib.parse.quote_plus(a) + (":" + eks if eks else ""))
    url = "https://fonts.googleapis.com/css2?" + "&".join(parca) + "&display=swap"
    try:
        css = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30).read().decode()
        hedef.mkdir(parents=True, exist_ok=True)
        cikti = []
        for blok in re.finditer(r"/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{.*?\})", css, re.S):
            ad, ff = blok.group(1), blok.group(2)
            if alt_kume and ad not in alt_kume:
                continue
            m = re.search(r"url\((https://[^)]+)\)", ff)
            if not m:
                continue
            dosya = hedef / (re.sub(r"[^\w.-]", "_", m.group(1).rsplit("/", 1)[-1]))
            if not dosya.exists():
                dosya.write_bytes(urllib.request.urlopen(
                    urllib.request.Request(m.group(1), headers={"User-Agent": UA}), timeout=30).read())
            cikti.append(ff.replace(m.group(1), dosya.resolve().as_uri()))
        if not cikti:
            raise RuntimeError("CSS'te font bulunamadı")
        return "\n".join(cikti)
    except Exception as e:  # noqa: BLE001
        print(f"UYARI: Google Fonts indirilemedi ({e}); sistem fontlarıyla devam.", file=sys.stderr)
        return ""


# ----------------------------------------------------------------------------- Playwright

PW_BETIK = r"""
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const job = JSON.parse(process.argv[2]);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: job.width || 1200, height: job.height || 1600 }, deviceScaleFactor: job.scale || 1 });
  await page.goto(job.url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => Array.from(document.images).every(i => i.complete));
  const missing = await page.evaluate(fs => fs.filter(f => !document.fonts.check(`16px "${f}"`)), job.fonts || []);
  if (missing.length) console.error('UYARI: yüklenemeyen fontlar: ' + missing.join(', '));
  if (job.mode === 'pdf') {
    await page.emulateMedia({ media: 'print' });
    await page.pdf({ path: job.out, format: job.format, printBackground: true, preferCSSPageSize: false,
      margin: job.margin, displayHeaderFooter: !!job.footer, headerTemplate: '<span></span>', footerTemplate: job.footer || '' });
  } else {
    await page.screenshot({ path: job.out, fullPage: false, omitBackground: false });
  }
} finally {
  await browser.close();
}
"""


def node_env() -> dict:
    env = dict(os.environ)
    if not env.get("NODE_PATH"):
        try:
            env["NODE_PATH"] = subprocess.run(["npm", "root", "-g"], capture_output=True, text=True,
                                              check=True).stdout.strip()
        except Exception:  # noqa: BLE001
            pass
    return env


def playwright_hazir() -> bool:
    if not shutil.which("node"):
        return False
    r = subprocess.run(["node", "-e", "require('playwright')"], capture_output=True, env=node_env())
    return r.returncode == 0


def playwright_calistir(job: dict, calisma: Path) -> None:
    """job: {url, out, mode: 'pdf'|'png', format?, margin?, footer?, width?, height?, scale?, fonts?}"""
    betik = calisma / "_pw_job.mjs"
    betik.write_text(PW_BETIK, encoding="utf-8")
    r = subprocess.run(["node", str(betik), json.dumps(job)], capture_output=True, text=True, env=node_env())
    if r.stderr.strip():
        print(r.stderr.strip(), file=sys.stderr)
    if r.returncode != 0:
        raise RuntimeError(f"Playwright başarısız (kod {r.returncode})")


# ----------------------------------------------------------------------------- markdown → HTML

def _slug(t: str, gorulen: dict) -> str:
    s = re.sub(r"[^\w\s-]", "", re.sub(r"<[^>]+>", "", t).lower()).strip()
    s = re.sub(r"[\s_]+", "-", s) or "bolum"
    n = gorulen.get(s, 0)
    gorulen[s] = n + 1
    return s if n == 0 else f"{s}-{n}"


def _guvenli_url(u: str) -> str:
    u = u.strip()
    if re.match(r"^(javascript|vbscript|data):", u, re.I):
        return "#"
    return u


class MD:
    def __init__(self, temel: Path):
        self.temel = temel
        self.slugs = {}
        self.basliklar = []

    # --- satır içi
    def satir(self, t: str) -> str:
        korunan = []

        def koru(s):
            korunan.append(s)
            return f"\x00{len(korunan) - 1}\x00"

        t = re.sub(r"`([^`]+)`", lambda m: koru(f"<code>{html.escape(m.group(1))}</code>"), t)

        def gorsel(m):
            alt, src = m.group(1), m.group(2).strip()
            if not re.match(r"^[a-z]+:", src, re.I):
                src = (self.temel / src).resolve().as_uri()
            return koru(f'<img src="{html.escape(_guvenli_url(src), quote=True)}" alt="{html.escape(alt, quote=True)}">')

        t = re.sub(r"!\[([^\]]*)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)", gorsel, t)

        def link(m):
            metin, url = m.group(1), _guvenli_url(m.group(2))
            if re.match(r"^\s*https?://\S+\s*$", metin):  # metin de URL ise yeniden linklenmesin
                return koru(f'<a href="{html.escape(url, quote=True)}">{html.escape(metin)}</a>')
            return koru(f'<a href="{html.escape(url, quote=True)}">') + metin + koru("</a>")

        t = re.sub(r"\[([^\]]+)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)", link, t)
        t = re.sub(r"<((?:https?|mailto):[^>\s]+)>",
                   lambda m: koru(f'<a href="{html.escape(m.group(1), quote=True)}">{html.escape(m.group(1))}</a>'), t)
        t = re.sub(r"(?<![\w/\"=])(https?://[^\s<>()\x00]+[^\s<>()\x00.,;:!?])",
                   lambda m: koru(f'<a href="{html.escape(m.group(1), quote=True)}">{html.escape(m.group(1))}</a>'), t)
        t = html.escape(t, quote=False)
        t = re.sub(r"\*\*(.+?)\*\*|__(.+?)__", lambda m: f"<strong>{m.group(1) or m.group(2)}</strong>", t)
        t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?!\*)|(?<![\w_])_(?!\s)(.+?)(?<!\s)_(?![\w_])",
                   lambda m: f"<em>{m.group(1) or m.group(2)}</em>", t)
        t = re.sub(r"~~(.+?)~~", r"<del>\1</del>", t)
        t = re.sub(r" {2,}\n|\\\n", "<br>\n", t)
        for _ in range(3):  # iç içe korunanlar
            t = re.sub(r"\x00(\d+)\x00", lambda m: korunan[int(m.group(1))], t)
        return t

    # --- bloklar
    def donustur(self, metin: str) -> str:
        satirlar = metin.replace("\r\n", "\n").replace("\t", "    ").split("\n")
        return self.bloklar(satirlar)

    def bloklar(self, s) -> str:
        out, i, n = [], 0, len(s)
        while i < n:
            ln = s[i]
            if not ln.strip():
                i += 1
                continue
            if re.match(r"^\s*<!--\s*pagebreak\s*-->\s*$", ln, re.I):
                out.append('<div class="page-break"></div>')
                i += 1
                continue
            if re.match(r"^\s*<!--.*-->\s*$", ln):
                i += 1
                continue
            m = re.match(r"^\s*(```|~~~)\s*([\w+-]*)\s*$", ln)
            if m:
                j, kod = i + 1, []
                while j < n and not s[j].strip().startswith(m.group(1)):
                    kod.append(s[j])
                    j += 1
                out.append(f"<pre><code>{html.escape(chr(10).join(kod))}</code></pre>")
                i = j + 1
                continue
            m = re.match(r"^(#{1,6})\s+(.*?)\s*#*\s*$", ln)
            if m:
                lv, ic = len(m.group(1)), self.satir(m.group(2))
                sid = _slug(ic, self.slugs)
                self.basliklar.append((lv, html.unescape(re.sub(r"<[^>]+>", "", ic))))
                out.append(f'<h{lv} id="{sid}">{ic}</h{lv}>')
                i += 1
                continue
            if re.match(r"^\s{0,3}([-*_])(\s*\1){2,}\s*$", ln):
                out.append("<hr>")
                i += 1
                continue
            if ln.lstrip().startswith(">"):
                j, ic = i, []
                while j < n and s[j].strip() and s[j].lstrip().startswith(">"):
                    ic.append(re.sub(r"^\s*>\s?", "", s[j]))
                    j += 1
                out.append(f"<blockquote>{self.bloklar(ic)}</blockquote>")
                i = j
                continue
            if "|" in ln and i + 1 < n and re.match(r"^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$", s[i + 1]):
                def hucre(x):
                    x = x.strip()
                    x = x[1:] if x.startswith("|") else x
                    x = x[:-1] if x.endswith("|") else x
                    return [c.strip() for c in re.split(r"(?<!\\)\|", x)]
                bas = hucre(ln)
                hiz = []
                for c in hucre(s[i + 1]):
                    hiz.append("center" if c.startswith(":") and c.endswith(":") else "right" if c.endswith(":") else "left")
                j, govde = i + 2, []
                while j < n and s[j].strip() and "|" in s[j]:
                    govde.append(hucre(s[j]))
                    j += 1
                th = "".join(f'<th style="text-align:{hiz[k] if k < len(hiz) else "left"}">{self.satir(c)}</th>'
                             for k, c in enumerate(bas))
                trs = "".join("<tr>" + "".join(
                    f'<td style="text-align:{hiz[k] if k < len(hiz) else "left"}">{self.satir(c)}</td>'
                    for k, c in enumerate(r)) + "</tr>" for r in govde)
                out.append(f"<table><thead><tr>{th}</tr></thead><tbody>{trs}</tbody></table>")
                i = j
                continue
            m = re.match(r"^(\s*)([-*+]|\d+[.)])\s+", ln)
            if m:
                h, i = self.liste(s, i)
                out.append(h)
                continue
            j, par = i, []
            while j < n and s[j].strip() and not re.match(
                    r"^(#{1,6}\s|\s*(```|~~~)|\s*>|\s*([-*+]|\d+[.)])\s+|\s{0,3}([-*_])(\s*\4){2,}\s*$)", s[j]):
                par.append(s[j])
                j += 1
            if not par:
                par, j = [s[i]], i + 1
            out.append(f"<p>{self.satir(chr(10).join(x.strip() if not x.endswith('  ') else x.lstrip() for x in par))}</p>")
            i = j
        return "\n".join(out)

    def liste(self, s, i):
        m = re.match(r"^(\s*)([-*+]|\d+[.)])\s+", s[i])
        girinti, sirali = len(m.group(1)), m.group(2)[0].isdigit()
        bas = int(re.match(r"\d+", m.group(2)).group()) if sirali else 1
        ogeler, n = [], len(s)
        while i < n:
            m = re.match(r"^(\s*)([-*+]|\d+[.)])\s+(.*)$", s[i])
            if not m or len(m.group(1)) != girinti or m.group(2)[0].isdigit() != sirali:
                break
            ic = [m.group(3)]
            i += 1
            alt = []
            while i < n:
                if not s[i].strip():
                    if i + 1 < n and s[i + 1].strip() and (len(s[i + 1]) - len(s[i + 1].lstrip())) > girinti:
                        alt.append("")
                        i += 1
                        continue
                    break
                ind = len(s[i]) - len(s[i].lstrip())
                if ind > girinti:
                    alt.append(s[i])
                    i += 1
                    continue
                if re.match(r"^(\s*)([-*+]|\d+[.)])\s+", s[i]):
                    break
                ic.append(s[i])  # tembel devam satırı
                i += 1
            metin = " ".join(x.strip() for x in ic)
            kutu = ""
            km = re.match(r"^\[([ xX])\]\s+(.*)$", metin)
            if km:
                kutu = '<span class="box">' + ("&#9745;" if km.group(1).lower() == "x" else "&#9744;") + "</span> "
                metin = km.group(2)
            govde = kutu + self.satir(metin)
            if alt:
                taban = min(len(x) - len(x.lstrip()) for x in alt if x.strip())
                govde += "\n" + self.bloklar([x[taban:] for x in alt])
            ogeler.append(f"<li{' class=\"task\"' if kutu else ''}>{govde}</li>")
            while i < n and not s[i].strip() and i + 1 < n and re.match(r"^(\s*)([-*+]|\d+[.)])\s+", s[i + 1]) \
                    and len(re.match(r"^(\s*)", s[i + 1]).group(1)) == girinti:
                i += 1
        etiket = "ol" if sirali else "ul"
        start = f' start="{bas}"' if sirali and bas != 1 else ""
        return f"<{etiket}{start}>" + "".join(ogeler) + f"</{etiket}>", i


# ----------------------------------------------------------------------------- sayfa

def stil(palet: dict, fontlar: dict, boyut: str) -> str:
    beyaz = "#FFFFFF"
    baslik = okunur(palet, beyaz, ("deep", "ink", "primary"), 4.5, "#2B2B2B")
    metin = okunur(palet, beyaz, ("ink", "deep"), 7, "#2B2B2B")
    vurgu = palet.get("gold", "#B8996A")
    acik = palet.get("gold_light", "#E6D8BC")
    zemin = palet.get("mist_top", "#F4F1EA")
    if kontrast(zemin, beyaz) > 1.6:  # koyu paletlerde açık bir ton
        zemin = palet.get("ivory", "#F7F4EE") if kontrast(palet.get("ivory", "#F7F4EE"), beyaz) < 1.6 else "#F5F2EC"
    link = okunur(palet, beyaz, ("deep", "primary", "ink"), 4.5, "#1F4E8C")
    govde = 10.5 if boyut == "a5" else 11
    return f"""
:root {{ --ink:{metin}; --head:{baslik}; --gold:{vurgu}; --gold-light:{acik}; --tint:{zemin}; --link:{link}; }}
@page {{ size: {SAYFA[boyut]}; }}
* {{ box-sizing: border-box; }}
html {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
body {{ margin:0; color:var(--ink); background:#fff; font-family:"{fontlar['body']}", "Helvetica Neue", Arial, sans-serif;
  font-size:{govde}pt; line-height:1.55; }}
h1, h2, h3, h4, h5, h6 {{ font-family:"{fontlar['heading']}", Georgia, "Times New Roman", serif; color:var(--head);
  font-weight:600; line-height:1.2; margin:1.4em 0 .5em; break-after:avoid; page-break-after:avoid; }}
h1 {{ font-size:2.5em; text-align:center; margin:.2em 0 .3em; letter-spacing:.01em; }}
h1 + p {{ text-align:center; }}
h1::after {{ content:""; display:block; width:3.2em; height:2px; margin:.45em auto 0; background:var(--gold); }}
h2 {{ font-size:1.75em; border-bottom:1px solid var(--gold-light); padding-bottom:.15em; }}
h3 {{ font-size:1.35em; }}
h4, h5, h6 {{ font-family:"{fontlar['body']}", Arial, sans-serif; font-size:1em; text-transform:uppercase; letter-spacing:.08em; }}
p, ul, ol, table, blockquote, pre {{ margin:0 0 .8em; }}
ul, ol {{ padding-left:1.4em; }}
li {{ margin:.2em 0; }}
li::marker {{ color:var(--gold); }}
li.task {{ list-style:none; margin-left:-1.2em; }}
.box {{ color:var(--gold); }}
a {{ color:var(--link); text-decoration:underline; text-decoration-color:var(--gold); text-underline-offset:2px; word-break:break-word; }}
strong {{ color:var(--head); }}
hr {{ border:0; height:1px; background:var(--gold-light); margin:1.4em 0; }}
blockquote {{ background:var(--tint); border-left:3px solid var(--gold); padding:.6em 1em; border-radius:2px; }}
blockquote p:last-child {{ margin-bottom:0; }}
code {{ font-family:"DejaVu Sans Mono", Menlo, monospace; font-size:.88em; background:var(--tint); padding:.05em .3em; border-radius:2px; }}
pre {{ background:var(--tint); padding:.7em 1em; white-space:pre-wrap; border-radius:2px; }}
pre code {{ background:none; padding:0; }}
table {{ width:100%; border-collapse:collapse; font-size:.95em; break-inside:auto; }}
th {{ background:var(--tint); color:var(--head); font-weight:600; }}
th, td {{ border-bottom:1px solid var(--gold-light); padding:.4em .55em; vertical-align:top; }}
tr {{ break-inside:avoid; }}
img {{ max-width:100%; height:auto; display:block; margin:.6em auto; }}
.page-break {{ break-after:page; page-break-after:always; height:0; }}
"""


def html_belge(md_metin: str, temel: Path, palet: dict, boyut: str, font_css: str, baslik=None):
    fontlar = {**VARSAYILAN_FONTLAR, **(palet.get("fonts") or {})}
    md = MD(temel)
    govde = md.donustur(md_metin)
    if not baslik:
        baslik = next((t for lv, t in md.basliklar if lv == 1), None) or palet.get("name", "Document")
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>{html.escape(baslik)}</title>
<style>{font_css}</style>
<style>{stil(palet, fontlar, boyut)}</style>
</head><body>
{govde}
</body></html>
""", fontlar


def kenar(boyut: str) -> dict:
    m = {"letter": "0.75in", "a4": "18mm", "a5": "14mm"}[boyut]
    return {"top": m, "right": m, "bottom": "0.7in" if boyut == "letter" else ("18mm" if boyut == "a4" else "15mm"), "left": m}


def altbilgi(palet: dict, fontlar: dict) -> str:
    renk = palet.get("gold", "#999999")
    return (f'<div style="width:100%;font-family:\'{fontlar["body"]}\',Arial,sans-serif;font-size:8px;color:{renk};'
            'text-align:center;padding:0 0 4px;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>')


def donustur(girdi: Path, cikti: Path, palet_yolu: Path, boyut="letter", fontlar_indir=True, html_kaydet=None, baslik=None):
    palet = palet_oku(palet_yolu)
    girdi, cikti = Path(girdi).resolve(), Path(cikti).resolve()
    with tempfile.TemporaryDirectory(prefix="md2pdf_") as t:
        t = Path(t)
        font_css = ""
        fontlar = {**VARSAYILAN_FONTLAR, **(palet.get("fonts") or {})}
        if fontlar_indir:
            font_css = google_fonts_css(sorted({fontlar["heading"], fontlar["body"]}), t / "fonts")
        belge, fontlar = html_belge(girdi.read_text(encoding="utf-8"), girdi.parent, palet, boyut, font_css, baslik)
        sayfa = t / "doc.html"
        sayfa.write_text(belge, encoding="utf-8")
        if html_kaydet:
            Path(html_kaydet).write_text(belge, encoding="utf-8")
        cikti.parent.mkdir(parents=True, exist_ok=True)
        playwright_calistir({
            "url": sayfa.as_uri(), "out": str(cikti), "mode": "pdf", "format": SAYFA[boyut],
            "margin": kenar(boyut), "footer": altbilgi(palet, fontlar),
            "fonts": [fontlar["heading"], fontlar["body"]] if font_css else [],
        }, t)
    return cikti


def main(argv=None):
    ap = argparse.ArgumentParser(description="Markdown → markalı, tıklanabilir linkli PDF (Playwright Chromium).")
    ap.add_argument("girdi", type=Path)
    ap.add_argument("cikti", type=Path)
    ap.add_argument("--palette", required=True, type=Path, help="koleksiyonun palette.json dosyası")
    ap.add_argument("--size", choices=sorted(SAYFA), default="letter")
    ap.add_argument("--no-fonts", action="store_true", help="Google Fonts indirme; sistem fontları")
    ap.add_argument("--keep-html", type=Path, help="ara HTML'i bu yola da yaz (inceleme için)")
    ap.add_argument("--title", help="PDF başlığı (varsayılan: ilk # başlık)")
    a = ap.parse_args(argv)
    if not a.girdi.exists():
        ap.error(f"girdi yok: {a.girdi}")
    if not playwright_hazir():
        print("HATA: node + Playwright bulunamadı (NODE_PATH=$(npm root -g) ve Chromium gerekli).", file=sys.stderr)
        return 2
    try:
        out = donustur(a.girdi, a.cikti, a.palette, a.size, not a.no_fonts, a.keep_html, a.title)
    except (ValueError, RuntimeError) as e:
        print(f"HATA: {e}", file=sys.stderr)
        return 1
    print(f"PDF: {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
