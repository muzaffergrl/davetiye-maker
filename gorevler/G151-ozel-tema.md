---
id: G151
baslik: Özel tasarım yalnız o alıcıya + Dress code kısa yolu kalkar + contentUpdatedAt (K47)
rol: claude-kod
durum: bitti
alan: claude-G151
oncelik: 1
bagimli: [G145, G146]
yazar: [platform/lib/theme/theme.ts, platform/lib/claim/, platform/lib/themes/, platform/lib/admin/, platform/lib/data/, platform/lib/panel/api.ts, platform/lib/panel/state.ts, platform/lib/i18n/dict/panel/, platform/app/start/, platform/app/my/page.tsx, platform/app/admin/designs/page.tsx, platform/components/admin/AdminNew.tsx, platform/components/admin/AdminSite.tsx, platform/components/my/MyWebsite.tsx, platform/components/panel/ExtrasFields.tsx, platform/scripts/theme-check.cjs, platform/scripts/lib/theme-env.ts, platform/tests/g151.test.ts, docs/10_SITE_PLATFORMU.md, gorevler/G151-ozel-tema.md]
---

## Amaç
K47 (2026-10-17) onaylı üç madde; öneri ve kırık listesi `gorevler/G145-panel-denetim.md` ("Kırık / yarım kalanlar",
"Karar bekleyenler" 1), K42 (özel tasarım başkasına satılmaz).

## Sonuç
**2026-10-17 · claude-G151 — durum: inceleme.** Dal `claude/g151-ozel-tema`. Yayın yok, main'e dokunulmadı, PR açılmadı.

### 1. Özel tasarım yalnız o alıcıya
- `theme.json` → `"private": { "orders": ["<Etsy sipariş no>", …] }` (`lib/theme/theme.ts parseManifest`: rakamlara indirgenir,
  geçersiz numara = açık ThemeError). Sahip/ajan rehberi: `docs/10_SITE_PLATFORMU.md` §3b.
- Gizli: `listThemes` (yalnız `includePrivate` ile), `claimableThemes`, `offeredThemes` (/start ve /my seçicisi, üretim listesi).
  Satış sitesi/sitemap/llms.txt/vitrin yalnız `MARKETING.designs`'tan beslenir; `tests/g151.test.ts` gerçek tema klasörlerindeki özel
  temaların orada olmadığını denetler.
- `claimableTheme(id, { order, trusted })`: özel tema yalnız listedeki sipariş numarasıyla ya da güvenilir çağıranla (admin, var
  olan sitenin kendi teması: panel örnek verisi, örnek tarih) döner; diğer her durumda `null` = bilinmeyen tema.
  `/start?theme=<id>&order=<no>` formu numarayla doldurur (demo önizlemesi yok); `POST /api/start` başka numarayla → bilinmeyen
  temayla birebir aynı 404. Üretim onay kapısı (G080) özel temaya uygulanmaz (`themeStartable`).
- `/my` devam: sipariş için site yok ve bir özel tema bu numarayı listeliyorsa cevapta `startPath` → doğrudan özel temanın
  başlatma linki. `/my?theme=<özel>` da yalnız `&order=` ile.
- Demo `/start/demo/<özel>` (+ alt sayfalar, event.ics) yalnız admin oturum çereziyle; `private, no-store`.
- Admin **Yeni sipariş**: özel tasarımlar her zaman listede ("(özel tasarım)"), her numarayla başlatılır. Tasarımlar sayfası: rozet,
  sipariş numaraları, numaralı başlatma linki.
- `theme-check`: özel temada /start demo kontrolü uyarıyla atlanır.

### 2. Details → Dress code
"Good to know" içindeki "+ Dress code" çipi kaldırıldı; ayrı **Dress code** bölümü (`content.dress_code`) aynen. Çip ayrı bir
`details_blocks` öğesi yaratıyordu: eski öğeler aynen kalır ve görünür ("Dress" ikonu seçeneği duruyor), veri silinmez/taşınmaz.
İpucu metninden "dress code" çıkarıldı (EN + TR/ES/DE/FR sözlük).

### 3. contentUpdatedAt
- `SiteRecord.contentUpdatedAt`: iki adaptörün ortak yazma yolunda (`mutate`; blob'da ETag koşullu yazma döngüsü içinde) yalnız
  içerik gerçekten değişince `updatedAt` ile ilerler; not, mesaj kopyalama, dükkân linki, sipariş onayı, yayın dokunmaz. Kayıt
  oluşturulurken = createdAt. Eski kayıt: okuma `siteContentUpdatedAt()` → `updatedAt`; içeriksiz ilk yazıda önceki `updatedAt`
  donar (not zamanı "son değişiklik" olmaz). `updatedAt` sürüm kontrolü olarak aynen.
- Admin "Son değişiklik" ve Yapılacaklar "yayınlanmamış değişiklik (2 gün)" artık `contentUpdatedAt`'e bakar.

### Test
- `tests/g151.test.ts` 13 test: manifest doğrulaması, her genel listeden gizli, yalnız listedeki sipariş, bilinmeyen temayla aynı
  cevap (API + demo), üretimde başlatma, /my `startPath`, admin oluşturma, Dress code çipi, contentUpdatedAt (yerel + blob +
  eski kayıt + admin yapılacaklar).
- `npm ci && rm -rf .next && npx tsc --noEmit && I18N_STRICT=1 npm test && npm run build`: tsc temiz; **1398 test, 1396 geçti,
  0 kırmızı, 2 atlandı**; build + trace-check temiz (23 tema).

### Yapılmayan / not
- Tarayıcı testi (Playwright) çalıştırılmadı; /start ve /my sayfa bileşenleri birim testle değil, kullandıkları fonksiyonlar üzerinden
  doğrulandı.
- Satış sitesi config'ine özel tema eklenmesini build durdurmaz; yalnız `npm test` yakalar.
- Özel tema linkinde sipariş numarası URL'de durur (`/start` noindex + no-referrer); G146'daki sessionStorage aktarımı yalnız
  genel temalar için.

## Günlük
- 2026-10-17 entegratör onayladı
