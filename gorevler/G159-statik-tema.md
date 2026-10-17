---
id: G159
baslik: Paletler büyürken Vercel işlev paketini küçük tut — tema CSS/JS/görselleri statik dosya (public/themes)
rol: claude-kod
durum: inceleme
alan: claude-G159
oncelik: 2
bagimli: [G055, G153]
yazar: [platform/scripts/theme-assets.cjs, platform/scripts/trace-check.cjs, platform/scripts/lib/browser.ts, platform/next.config.ts, platform/package.json, platform/.vercelignore, .gitignore, platform/app/themes/[theme]/[...path]/route.ts, platform/lib/site/static.ts, platform/lib/print/render.ts, platform/tests/g055-share-tracing.test.ts, platform/tests/g159-static-themes.test.ts, platform/tests/g159-browser.ts, platform/README.md, docs/10_SITE_PLATFORMU.md, docs/11_TEMA_STANDARDI.md, docs/25_PALET_VARYANTLARI.md, gorevler/G159-statik-tema.md]
---

## Amaç
`platform/themes/` ~107 MB ve büyüyor (G153 paletleri tasarım başına ~7 MB `img/variants/`; 12 tasarım daha → ~190 MB). Tema
varlık rotası (`/themes/<tema>/<yol>`) bütün servis edilen tema dosyalarını tek Vercel işlevine izliyordu (~100 MB). Vercel
işlev sınırı 250 MB (sıkıştırmasız, node_modules dahil). Hedef: tema dosyaları hiçbir işlevde olmasın, URL'ler değişmesin,
yeni palet dosyaları kendiliğinden yayına girsin, sınır sessizce aşılamasın. Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR.

## Sonuç
**2026-10-17 · claude-G159 — durum: inceleme.** Dal `claude/g159-statik-tema` (taban `claude/zealous-fermi-hy1o40`). Yayın
yok, main'e dokunulmadı, PR yok.

**Ölçüm (yerel `next build`; `.next/server/**/*.nft.json` + işlevin kendi dosyası, node_modules dahil).** "Önce" = taban
`c0717bbb` (29 tema, 9'unda palet); "Sonra" = G158 (C partisi) üzerine rebase edilmiş dal (29 tema, **15'inde palet**,
`themes/` 141 MB):

| İşlev | Önce | Sonra | Not |
|---|---|---|---|
| `themes/[theme]/[...path]` (varlık rotası) | **101,4 MB** (tema dosyası 99,0) — eski yapılandırmayla bugün ~132 MB olurdu | **2,4 MB** | yalnız Next + kendi kodu; paletlerle büyümez |
| `api/edit/[slug]/download` (PDF, Chromium) | **184,1 MB** (public/ 57,1) | **142,5 MB** (public/print 16,4) | bütün `public/` izleniyordu (satış medyası, ses, baskı paletleri) |
| `api/edit/[slug]/*` (sharp'lı 7 rota) | 52,1–53,4 MB | 51,2–52,5 MB | sharp musl+wasm ~27 MB (değişmedi, aşağıda) |
| sayfa/`/start`/RSVP rotaları | 6–8 MB (tema 3,3) | ~5–7 MB (tema 2,4) | bazı rotalara sızan tema görselleri de çıktı |

Tema klasörü 190 MB'a çıksa da hiçbir işlev büyümez; büyüyen statik çıktıdır (`public/themes`: 129,5 MB / 3219 dosya; G158'in
yeni palet dosyaları rebase sonrası build'de kendiliğinden kopyalandı, 824 dosya).

**Yapılan:**
- `platform/scripts/theme-assets.cjs` (`prebuild`): varlık rotasının servis edeceği her dosyayı (aynı kurallar: tema id'si
  `THEME_ID_RE`, nokta dosya/klasör yok, uzantı `THEME_ASSET_TYPES`) `public/themes/<tema>/<yol>`'a kopyalar; palet görseli
  `img/variants/<v>/<x>` → `public/themes/<tema>/~<v>/img/<x>` (sanal klasörün kendisi). Artımlı (boyut + mtime, kopyala+rename),
  themes/'ten kalkan dosyayı siler. Diğer ajanların eklediği palet dosyaları / `variants.css` sonraki build'de kendiliğinden girer.
  `--clean` klasörü siler. `public/themes/` git'e ve Vercel yüklemesine girmez (`.gitignore`, `.vercelignore`).
- `next.config.ts`: varlık rotasının `THEME_ASSETS` izlemesi kaldırıldı; `outputFileTracingExcludes['**']` = `public/themes/**`
  + `themes/**/*.{varlık uzantıları}` (her rota). `VARIANT_REWRITE` (afterFiles = public dosyalardan sonra):
  `/themes/:theme/~:variant([a-z][a-z0-9-]{0,31})/:path+` → `/themes/:theme/:path+?variant=:variant` — kopyası olmayan dosya
  asıla düşer, adres değişmez (yönlendirme değil; CSS'teki göreli `url(img/…)` varyantta kalır). `THEME_ASSET_HEADERS`: rotanın
  başlıkları (`Cache-Control: public, max-age=3600, s-maxage=86400`, `nosniff`, SVG'ye dosya CSP'si). PDF rotası yalnız
  diskten okuduğu `public/print/<tema>/<parça>.webp`'i izler (`PRINT_PARTS = ./public/print/*/*.webp`); `lib/print/render.ts`'te
  `process.cwd()` `turbopackIgnore` (bütün `public/` izleniyordu: satış sitesi medyası 27 MB, ses 2,4 MB, baskı paletleri
  `public/print/*/variants/` 25 MB — `render.ts` onları zaten CDN'den alıyor —; kopyadan sonra `public/themes` de girecekti → ~300 MB).
- Varlık rotası (`lib/site/static.ts` + route): kopyası olmayanı yanıtlar (404'ler, `next dev`, testin kendi tema klasörü);
  rewrite'tan gelen isteğin paletini `?variant=`'tan ya da istenen adresten (`next start` asıl adresi verir) bulur;
  `img/variants/…` doğrudan 404 (public'te de yok — bir görselin iki adresi olmasın; yerel ↔ Vercel aynı davranış); tema 404'ü
  `Cache-Control: no-store` (yalnız varlık uzantısız adreste geçerli, aşağıda).
- `npm run dev` önce kopyaları siler (dev hep diskten, güncel); `npm start` ve `scripts/lib/browser.ts` `startNext` (theme-check,
  variant-check, browser testleri) önce eşitler — tema düzenlendikten sonra build'siz kontrol bayat kopya görmez.
- `scripts/trace-check.cjs`: (3) hiçbir işlev tema varlığı taşımıyor (`.next/server` altındaki **her** işlev); (4) her servis edilebilir
  dosyanın aynı boyutta kopyası var, fazlası yok (Vercel'de 404'ün önü); (6) **bütçe**: işlev başına tema dosyası ≤ 40 MB, toplam
  ≤ 200 MB; en büyük 6 işlev her build'de yazdırılır.

**Testler:** `rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build` yeşil: tsc temiz, **1514/1516**
(2 atlanan: build çıktısı ister, .next silindiği için), build + trace-check geçti. Rebase + `PRINT_PARTS` daraltmasından sonra
yeniden: G159/G055/G153 testleri 27/27, build + trace-check ("78 functions; theme files 2.4 / 40 MB, total 142.5 / 200 MB"),
`tests/g159-browser.ts` 113/113, tsc temiz, `I18N_STRICT=1 npm test` **1516/1516** (build varken; build'e bağlı 2 test de geçti).
`tests/g159-static-themes.test.ts` (6 test: kopya kuralları, artımlılık/silme, gerçek temaların planı, rota + rewrite parametresi,
next.config rewrite/başlık/exclude, trace-check bütçeleri), `tests/g055-share-tracing.test.ts` güncellendi.
`tests/g159-browser.ts` (`next start`, build gerekir) **113/113**: 3 tema CSS/JS/görsel 200 + başlıklar + bayt = themes/; 2 palet
(olive-ivory ~sage-gold, crimson ~midnight-navy): kendi görseli = `img/variants/…`, override'sız görsel/CSS/JS = asıl; 404'ler
(html, theme.json, content.demo.json, README, .py, manifest, bilinmeyen dosya/tema, `img/variants/…` doğrudan, `~v` tek başına);
SVG CSP; Chromium 390 × 844'te 3 tema demosu (zarf + home) ve 2 palet demosu (zarf, home, details): bu sunucuya başarısız istek
0, konsol hatası 0, kırık görsel 0, `html[data-variant]`, paletin kendi görseli geldi; public/themes yokken rota + rewrite
override'ı buluyor.

**Davranış farkları (bilerek):**
- JS `application/javascript; charset=UTF-8` (rota `text/javascript` diyordu; ikisi de geçerli JS türü). ETag/Last-Modified → 304.
- Varlık uzantılı bir 404 (ör. olmayan `.webp`) config'in önbellek başlığını alıyor (config başlığı rotanınkini eziyor) —
  Vercel'de CDN önbelleği yayın başına olduğu için zararsız; tarayıcı en çok 1 saat tutar.
- Büyük harfli palet adı (`~Bad/…`) rewrite'ta eşleşir (Next büyük/küçük harf duyarsız) → asıl görsel (önce 404). Zararsız.
- `next start` çalışırken `public/themes`'ten dosya silinirse o adresler sunucu yeniden başlayana kadar 500 (Next public listesini
  açılışta okuyor); `startNext` eşitlemeyi sunucu açılmadan yapar. Açılıştan sonra eklenen dosya rota + rewrite ile diskten gelir.

**Yayından sonra denenecek (yapılmadı):** `vercel deploy` (arşiv yolu değişmeden çalışmalı: Vercel `npm run build` koşuyor —
son yayının günlüğünde görüldü), `live-check`, bir palet demosunda ağ sekmesi (`~sage-gold/img/…` 200, `x-vercel-cache`), site
PDF'i (tema görselleri PDF işlevine CDN'den gelir; önizleme yayınında Deployment Protection engelleyebilir — eskisi de öyleydi).
Vercel'in yayın boyutu uyarısı.

**Sonraki fırsatlar (bu görevde değiştirilmedi):**
- sharp'ın `@img/sharp-libvips-linuxmusl-x64` + `@img/sharp-wasm32` ikilileri her sharp'lı işlevde ~27 MB (Vercel glibc;
  `outputFileTracingExcludes` ile çıkarılabilir — Vercel'de denenmeli). PDF rotası 142 → ~115 MB olur.
- PDF rotasındaki `public/print/<tema>/*.webp` (16,4 MB) yalnız yeni tasarımla büyür (palet parçaları izlenmiyor). Gerekirse
  o da izlenmez, `render.ts` CDN'den alır (kodu hazır; önizleme yayınında Deployment Protection'a takılır).

## Günlük
- 2026-10-17 claude-G159: alındı → kopya adımı, rewrite/başlıklar, trace-check bütçeleri, testler, belgeler; durum inceleme.
