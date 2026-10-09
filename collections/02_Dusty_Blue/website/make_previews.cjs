#!/usr/bin/env node
// Website HTML önizleme + mobil kontrol (G020 pilotu; G4NN aynı scripti kullanır).
//
// Kullanım (repo kökünden):
//   NODE_PATH=/opt/node22/lib/node_modules node collections/02_Dusty_Blue/website/make_previews.cjs [website_klasoru]
// Varsayılan klasör bu scriptin klasörüdür. Çıktı: <klasor>/previews/website_html_<W>px.png
//
// Kontroller (her genişlikte):
//   1) Yatay kaydırma yok: document.documentElement.scrollWidth <= innerWidth
//   2) Metin taşması yok: doğrudan metin içeren görünür öğelerin sağ/sol kenarı viewport içinde
//   3) Tüm <img> yüklendi (naturalWidth > 0)
//   4) Google Fonts yüklendi mi (yüklenmediyse UYARI; fallback fontla görüntü alınır)
// Hata varsa çıkış kodu 1.
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const dir = path.resolve(process.argv[2] || __dirname);
const htmlFile = path.join(dir, 'index.html');
const outDir = path.join(dir, 'previews');
const WIDTHS = [360, 390, 430, 768, 1280];
const MAX_BYTES = 1.5 * 1024 * 1024;

async function downscale(page, buf, width) {
  // Tam sayfa PNG'yi tarayıcı canvas'ında küçült; her dosya ~1.5 MB altında kalsın.
  let scale = 1, out = buf;
  while (out.length > MAX_BYTES && scale > 0.2) {
    scale *= 0.8;
    const b64 = await page.evaluate(async ({ src, scale }) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + src;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * scale);
      c.height = Math.round(img.naturalHeight * scale);
      const ctx = c.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, c.width, c.height);
      return c.toDataURL('image/png').split(',')[1];
    }, { src: buf.toString('base64'), scale });
    out = Buffer.from(b64, 'base64');
  }
  return { out, scale };
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const browser = await chromium.launch(proxy ? { proxy: { server: proxy } } : {});
  const context = await browser.newContext({ ignoreHTTPSErrors: true, deviceScaleFactor: 1 });
  const scratch = await context.newPage();
  await scratch.setContent('<html><body></body></html>');
  let failed = false;

  for (const w of WIDTHS) {
    const page = await context.newPage();
    await page.setViewportSize({ width: w, height: w < 768 ? 800 : 900 });
    await page.goto('file://' + htmlFile, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    // lazy görselleri yükle
    await page.evaluate(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
      await Promise.all([...document.images].map(i => i.complete ? null : new Promise(r => { i.onload = i.onerror = r; })));
      window.scrollTo(0, 0);
    });

    const r = await page.evaluate(() => {
      const vw = window.innerWidth;
      const overflow = [];
      for (const el of document.querySelectorAll('body *')) {
        const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        if (!hasText) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const b = el.getBoundingClientRect();
        if (b.width === 0) continue;
        if (b.right > vw + 0.5 || b.left < -0.5 || el.scrollWidth > el.clientWidth + 1 && cs.overflow !== 'visible')
          overflow.push(`${el.tagName.toLowerCase()}.${el.className} "${el.textContent.trim().slice(0, 30)}" [${Math.round(b.left)}..${Math.round(b.right)}]`);
      }
      const brokenImgs = [...document.images].filter(i => !i.naturalWidth).map(i => i.getAttribute('src'));
      const fonts = ['Pinyon Script', 'Cormorant Garamond', 'Montserrat'].map(f => [f, document.fonts.check(`16px "${f}"`)]);
      return { sw: document.documentElement.scrollWidth, vw, h: document.documentElement.scrollHeight, overflow, brokenImgs, fonts };
    });

    const shot = await page.screenshot({ fullPage: true, type: 'png' });
    const { out, scale } = await downscale(scratch, shot, w);
    const file = path.join(outDir, `website_html_${w}px.png`);
    fs.writeFileSync(file, out);

    const hscroll = r.sw > r.vw;
    const missingFonts = r.fonts.filter(([, ok]) => !ok).map(([f]) => f);
    console.log(`${w}px  scrollWidth=${r.sw} innerWidth=${r.vw} ${hscroll ? 'YATAY KAYDIRMA!' : 'yatay kaydırma yok'}` +
      `  sayfa=${r.h}px  png=${(out.length / 1024).toFixed(0)}KB (ölçek ${scale.toFixed(2)})`);
    if (r.overflow.length) console.log('  TAŞMA:', r.overflow.join('\n         '));
    if (r.brokenImgs.length) console.log('  YÜKLENMEYEN GÖRSEL:', r.brokenImgs.join(', '));
    if (missingFonts.length) console.log('  UYARI font yüklenmedi (fallback):', missingFonts.join(', '));
    if (hscroll || r.overflow.length || r.brokenImgs.length) failed = true;
    await page.close();
  }
  // canva_import.html: sayfa yapısı + metnin sayfa sınırında kalması + tek önizleme PNG'si
  const canvaFile = path.join(dir, 'canva_import.html');
  if (fs.existsSync(canvaFile)) {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('file://' + canvaFile, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const c = await page.evaluate(() => {
      const pages = [...document.querySelectorAll('[data-document-role="page"]')];
      const problems = [];
      pages.forEach((p, i) => {
        if (p.parentElement !== document.body) problems.push(`sayfa ${i + 1} body'nin doğrudan çocuğu değil`);
        if (p.querySelector('[data-document-role="page"]')) problems.push(`sayfa ${i + 1} iç içe sayfa içeriyor`);
        const pb = p.getBoundingClientRect();
        for (const el of p.querySelectorAll('*')) {
          const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
          if (!hasText) continue;
          const b = el.getBoundingClientRect();
          if (b.left < pb.left - .5 || b.right > pb.right + .5 || b.top < pb.top - .5 || b.bottom > pb.bottom + .5)
            problems.push(`sayfa ${i + 1} (${p.dataset.section}) metin taşıyor: "${el.textContent.trim().slice(0, 30)}"`);
        }
      });
      const brokenImgs = [...document.images].filter(i => !i.naturalWidth).map(i => i.getAttribute('src'));
      return { sizes: pages.map(p => `${p.dataset.section} ${p.offsetWidth}×${p.offsetHeight}`), problems, brokenImgs,
               scripts: document.querySelectorAll('script').length };
    });
    const shot = await page.screenshot({ fullPage: true, type: 'png' });
    const { out, scale } = await downscale(scratch, shot, 1366);
    fs.writeFileSync(path.join(outDir, 'canva_import_html_pages.png'), out);
    console.log(`canva_import.html  ${c.sizes.length} sayfa: ${c.sizes.join(' · ')}  script=${c.scripts}  png=${(out.length / 1024).toFixed(0)}KB (ölçek ${scale.toFixed(2)})`);
    if (c.problems.length) console.log('  SORUN:', c.problems.join('\n         '));
    if (c.brokenImgs.length) console.log('  YÜKLENMEYEN GÖRSEL:', c.brokenImgs.join(', '));
    if (c.problems.length || c.brokenImgs.length || c.scripts) failed = true;
    await page.close();
  }

  await browser.close();
  console.log(failed ? 'SONUÇ: HATA' : 'SONUÇ: tüm kontroller geçti');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
