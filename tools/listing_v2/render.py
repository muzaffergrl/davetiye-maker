"""HTML → PNG (G067): marka fontları Google Fonts'tan geçici klasöre iner (repoya font girmez), sayfa Playwright
Chromium'da 2000 × 2000 çizilir. Sayfa `window.__hazir = true` diyene kadar beklenir (başlık sığdırma betiği bitsin);
`[data-kutu]` öğelerinin kutuları ve taşma durumu JSON olarak döner (metin kesik/taşmış mı denetimi için).
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import md_to_pdf as m2p  # noqa: E402 — node ortamı ve tarayıcı kimliği (UA) ortak

# brand/tokens.json → font.css_import ile aynı aileler; başlık sığdırma için genişlik/ağırlık aralığı açık
FONT_CSS_URL = ("https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,500..900"
                "&family=Montserrat:wght@300;400&family=DM+Sans:opsz,wght@9..40,400..600&display=swap")
FONT_AILELERI = ["Archivo", "Montserrat", "DM Sans"]

PW_BETIK = r"""
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const job = JSON.parse(process.argv[2]);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: job.width, height: job.height }, deviceScaleFactor: 1 });
  await page.goto(job.url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => window.__hazir === true && Array.from(document.images).every((i) => i.complete), null, { timeout: 20000 });
  const eksik = await page.evaluate((fs) => fs.filter((f) => !document.fonts.check(`40px "${f}"`)), job.fonts);
  const kutular = await page.evaluate(() => [...document.querySelectorAll('[data-kutu]')].map((e) => {
    const r = e.getBoundingClientRect();
    return { ad: e.getAttribute('data-kutu'), metin: e.innerText.trim().replace(/\s+/g, ' '),
      x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height),
      tasma: e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1,
      font: getComputedStyle(e).fontSize };
  }));
  await page.screenshot({ path: job.out, fullPage: false });
  console.log(JSON.stringify({ eksik_font: eksik, kutular }));
} finally {
  await browser.close();
}
"""


def font_css(hedef: Path) -> str:
    """Google Fonts CSS'ini indirir, woff2'leri `hedef`e koyar, yerel @font-face CSS döndürür (latin + latin-ext)."""
    css = urllib.request.urlopen(urllib.request.Request(FONT_CSS_URL, headers={"User-Agent": m2p.UA}), timeout=30).read().decode()
    hedef.mkdir(parents=True, exist_ok=True)
    cikti = []
    for blok in re.finditer(r"/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{.*?\})", css, re.S):
        alt_kume, ff = blok.group(1), blok.group(2)
        if alt_kume not in ("latin", "latin-ext"):
            continue
        m = re.search(r"url\((https://[^)]+)\)", ff)
        if not m:
            continue
        dosya = hedef / re.sub(r"[^\w.-]", "_", m.group(1).rsplit("/", 1)[-1])
        if not dosya.exists():
            dosya.write_bytes(urllib.request.urlopen(urllib.request.Request(m.group(1), headers={"User-Agent": m2p.UA}), timeout=30).read())
        cikti.append(ff.replace(m.group(1), dosya.resolve().as_uri()))
    if not cikti:
        raise RuntimeError("Google Fonts CSS'inde font bulunamadı")
    return "\n".join(cikti)


def ciz(html_yolu: Path, cikti: Path, calisma: Path, w: int = 2000, h: int = 2000, aileler=None) -> dict:
    """HTML'i PNG'ye çizer; {eksik_font, kutular} döndürür. Eksik font varsa hata (sistem fontuyla sessizce çizilmez)."""
    betik = calisma / "_ciz.mjs"
    betik.write_text(PW_BETIK, encoding="utf-8")
    job = {"url": html_yolu.resolve().as_uri(), "out": str(cikti.resolve()), "width": w, "height": h, "fonts": aileler or FONT_AILELERI}
    cikti.parent.mkdir(parents=True, exist_ok=True)
    r = subprocess.run(["node", str(betik), json.dumps(job)], capture_output=True, text=True, env=m2p.node_env())
    if r.returncode != 0:
        raise RuntimeError(f"Playwright başarısız ({r.returncode}): {r.stderr.strip()[-1500:]}")
    sonuc = json.loads(r.stdout.strip().splitlines()[-1])
    if sonuc["eksik_font"]:
        raise RuntimeError(f"yüklenemeyen font: {sonuc['eksik_font']}")
    return sonuc
