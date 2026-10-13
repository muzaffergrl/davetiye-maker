---
id: G037
baslik: Site platformu iskeleti — Next.js, tema şablon motoru, local veri adaptörü, site rotaları
rol: claude-kod
durum: bitti
alan: claude-kod-11
oncelik: 1
bagimli: []
yazar: [platform/]
---

## Amaç
K24: kendi sitemiz + panel. Temaları React'e çevirmeden yayınlayan, içerik JSON'undan site üreten iskelet.

## Girdiler
- `docs/10_SITE_PLATFORMU.md` (tek kaynak), `tools/validate_content.py` + `collections/*/content.demo.json` (içerik şeması)
- Tema kaynağı örneği: `collections/03_Blush_Garden_Rose/website/` (G035 bitince)

## Yapılacaklar
1. `platform/` Next.js (App Router, TypeScript) — `npm` paketleri sabit sürümle; `node_modules` ve `.data` gitignore.
2. Tema motoru: `platform/themes/<tema>/{index,home,story,details,rsvp}.html` + `theme.json` (ad, sayfalar, foto alanları).
   `data-field="a.b.0.c"` → içerik değeri (HTML kaçışlı), `data-photo="key"` → foto URL'si, `data-optional="key"` → gizle/göster,
   `data-url="key"` → href. Göreli varlık yolları tema statik klasörüne çevrilir.
3. Rotalar: `/[slug]` (zarf), `/[slug]/home|story|details|rsvp`; yayınlanmamış site 404; `?preview=<anahtar>` ile taslak.
4. Veri adaptör arayüzü (`getSiteBySlug`, `createSite`, `updateContent`, `publish`, `saveRsvp`, `listRsvps`, `savePhoto`)
   + `local` uygulaması. Düzenleme anahtarı hash'li.
5. İçerik doğrulama (şema) TypeScript tarafında; demo içerikle bir örnek site tohumu (`npm run seed`).
6. Test: şablon motoru (kaçış, eksik alan, isteğe bağlı bölüm), rota 200/404, adaptör. `npm test` + `npm run build` geçer.

## Bitti sayılması için
- [x] `npm run build` ve testler geçiyor; tohum site yerelde açılıyor (Playwright 390 px ekran görüntüsü `platform/previews/`)

## Sonuç
**Yapıldı (claude-kod-11, 2026-10-13).** Ayrıntı ve işaret başvurusu: `platform/README.md`.

- **Uygulama:** `platform/` Next.js 16.3.8 (App Router, TS), React 19.3.0, cheerio 1.2.0 (parse5), sabit sürümler +
  `package-lock.json`. Testler `node:test` (Node 22 TS'yi doğrudan çalıştırıyor; vitest kurulumu npm 10.9 arborist
  hatasıyla düştü, ek bağımlılık gerekmedi).
- **Tema motoru** (`lib/theme/engine.ts`): `data-field`, `data-photo`, `data-optional`, `data-url` + gerekli eklemeler:
  `data-repeat` (program/story listeleri), `data-if`, `data-text` (`<title>` şablonu), `data-attr-*` (OG, `datetime`),
  `data-format` (date, date-long, weekday, month, day, year, time, raw, amp). Değerler hep metin olarak (kaçışlı) girer;
  URL'ler yalnız http/https/mailto/tel; foto http(s) veya `/media/…`. Göreli varlıklar `/themes/<tema>/…`, sayfa
  linkleri `/<slug>/<sayfa>` (önizlemede `?preview=` korunur). Sayfaya `#site-data` JSON (kaçışlı) eklenir.
  **G035 uyumu:** `<img data-field="media.*">` → src, `<a data-field="urls.*">` → href (yoksa `#` + `data-url-missing`),
  `<body data-optional>` → sayfa 404, satır içi betikler CSP'ye hash ile eklenir. G035'in 5 sayfası motorla **uyarısız**
  işleniyor (test).
- **Rotalar:** `/[slug]`, `/[slug]/home|story|details|rsvp`, `/themes/[tema]/[...yol]`, `/media/[...yol]`. Yayında
  değil / bilinmeyen / ayrılmış slug / tanımsız sayfa → 404; `?preview=<önizleme anahtarı>` taslağı gösterir (noindex,
  no-store). Ziyaretçi `publishedContent`'i (son yayın kopyası), önizleme taslak `content`'i görür.
- **Veri:** `DataAdapter` arayüzü (`lib/data/types.ts`) + `local` (JSON + yükleme klasörü). Düzenleme anahtarı 32 bayt
  rastgele, yalnız SHA-256 saklanır, sabit zamanlı karşılaştırma; önizleme anahtarı düzenleme anahtarından HMAC ile
  türetilir (paylaşılan önizleme linki düzenleme yetkisi vermez). Foto yükleme: tür baytlardan, JPG/PNG/WebP/AVIF, ≤10 MB.
- **İçerik doğrulama:** `lib/content/validate.ts` = `tools/validate_content.py` aynası (şema kopyası `lib/content/schema.ts`,
  yeni `story` bloğu dahil; kopya docs dosyasından saparsa test kırılır). Tarih gösterimi `May 15, 2027` / `4:00 PM`.
- **Tohum:** `npm run seed` → `/clara-and-julian` (03 demo içeriği, `_sample` tema, yayında). `themes/_sample/` yalnız
  test iskeleti, tasarım değil.

**Test edildi:** `npm test` 67/67 (motor XSS/kaçış, eksik alan, isteğe bağlı bölüm, URL süzgeci, şablonlar, CSP hash,
G035 sayfaları; içerik + Python aracıyla 26 kayıtta geçti/kaldı eşliği; anahtar/slug; adaptör eşzamanlılık, yükleme
sınırları; rotalar 200/404/önizleme/308/500, statik rota yol aşımı). `npm run typecheck` ve `npm run build` temiz
(Turbopack uyarısı yok; tema dosyaları fonksiyon paketine izleniyor). `npm run screenshot`: gerçek `next start` +
Chromium 390 px, 32/32 kontrol (CSP/konsol hatası yok, satır içi betik hash'le çalıştı, yatay taşma yok, başlık ve isimler
sunucuda dolu) → `platform/previews/sample_*_390.png`, `checks.json`. `next dev` duman testi geçti.

**Test edilmedi / yapılmadı:** Vercel/Supabase (proje açılmadı, yayın yok), gerçek iPhone/Safari, çok süreçli `local`
adaptör, panel/RSVP/`/start` (G039/G042/G045).

**Entegratör / sonraki görevler için notlar:**
- `docs/10` §2 tablo alanlarına eklenmeli: `published_content`, `preview_key_hash`, `published_at` (G043 şeması README'de).
- G038: `site.js` içindeki `CONTENT` yerine `#site-data` okunmalı (yoksa demo metin sunucu içeriğini ezer); JS içindeki
  `location.href='home.html'`, prefetch ve `speculationrules` adresleri `data.pages.*`'tan alınmalı (`/<slug>` altında göreli
  `home.html` kökte çözülür); `.photo-slot.has-photo` yerine `[data-photo-state="user"]`; başlıklar `data-text` ile; foto
  anahtarları `theme.json` `photos`'ta tanımlanmalı.
- `customer` kayıtta `urls.website/rsvp_form` boş uyarısı platform sitelerinde hep çıkacak (site ve RSVP platformun kendisi);
  panel bu iki uyarıyı göstermemeli ya da Python kuralı güncellenmeli (karar entegratörde).
- Next 16 `next dev` varsayılan olarak `platform/AGENTS.md` + `CLAUDE.md` üretiyor; `next.config.ts`'te `agentRules: false` ile kapatıldı.

## Günlük
- 2026-10-13 alindi: claude-kod-11
- 2026-10-13 bitti, incelemeye gönderildi
- 2026-10-13 entegratör onayladı
