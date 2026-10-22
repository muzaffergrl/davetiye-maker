---
id: G426
baslik: Tasarım 26 Kintsugi & Washi — tema yeniden kurulumu (39 pilot yapısı, PAKET 5R parçaları)
rol: claude-kod
durum: inceleme
alan:
oncelik: 2
bagimli: [G226, G423]
yazar: [platform/themes/kintsugi-washi/, platform/tests/theme-kintsugi-washi.test.ts, platform/previews/g426/, platform/lib/print/layouts.ts, platform/public/print/kintsugi-washi/, platform/public/marketing/, platform/lib/marketing/, collections/26_Kintsugi_Washi/package/, gorevler/G426-kintsugi-washi-yeniden.md]
---

## Amaç
`docs/35_22_32_YENIDEN_TASARIM.md` §6: `platform/themes/kintsugi-washi/` Codex'in `envelope-v3` kalıbından çıkarılıp
39 Silver Photo Booth pilotunun yapısıyla (`docs/34_TEMA_HATTI_40_48.md`) yeni GPT parçalarından baştan kurulur.
Pilot G423 (Velvet Jewel Box) örnek alınır.

## Girdiler
- `collections/26_Kintsugi_Washi/DESIGN_BRIEF.md` + `collections/26_Kintsugi_Washi/assets/gpt/GPT_PROMPTS.md` (her parçanın "Kullanım" satırı) + `parts/` (G226)
- Pilot dosyaları `platform/themes/silver-photo-booth/` ve `swan-chantilly-lace/`; standart `docs/11`, `docs/34`, `docs/35` §3

## Yapılacaklar
1. `kit_check --paket 5` + göz kontrolü; kusurları `docs/34` §4 yöntemleriyle çöz (çizim yok, K21).
2. `build_images.py` (alfa kutusu, arka katman kutusuna yerleştirme, `keyed_window`, manifest.stage ↔ site.css), `img/` ≤ 3 MB.
3. Şablonlar + `site.css` + `site.js` (`MOTION` ↔ CSS keyframe gecikmeleri aynı sayılar); kapak düzeni ve açılış `docs/35` §3.
   Kaldır: `envelope-v3.*`, `opening*`, `interior*`, `parts.css`, eski `v3-*/v4-*` görseller. Koru: slug, `theme.json` foto
   anahtarları, `content.demo.json`, kopya anahtarları (`node scripts/copy-manifest.ts --theme kintsugi-washi --check`).
4. `variants.css` paletleri yeni sanattan; baskı düzeni PAKET 6R'ye (`lib/print/layouts.ts`, `build-print-assets`).
5. `tests/theme-kintsugi-washi.test.ts` yeni yapıya göre; katalog kapak posteri + açılış klibi yeniden.
6. Göz kontrolü (`docs/34` §5): kapalı → açılış (300 ms aralık) → home/story/details/rsvp; 360/390/430 + masaüstü.

## Bitti sayılması için
- [ ] Tema testi + g085/g093/g094/g097/g138/g139/g150/g155/g175 + content testleri geçer
- [ ] Açılışta boş/düz renkli yüz yok; kapanış, kapak (gerçek iç yüz), kart, süzülen nesneler ayrı hareket ediyor
- [ ] Kapak düzeni: isimler ve Skip hiçbir dekorun altında değil; tarih · şehir + Tap to open
- [ ] Önizleme kareleri `platform/previews/g426/`; Sonuç yazılı; durum `coming`

## Sonuç
2026-10-22 (Claude, G426, dal `claude/g426-kintsugi-washi`) — **inceleme.** `platform/themes/kintsugi-washi/` Codex
`envelope-v3`/`opening*`/`interior*`/`parts.css`/`variants.css`/eski `img/` kaldırılarak pilot G423 yapısıyla PAKET 5R
parçalarından (26 dosya, hepsi var) yeniden kuruldu; çizim yok (K21).
- Kapak: pirinç kâğıdı washi zemin, "Together with their families" + Allura isimler, kare tatō paket (çivit washi, dört
  üçgen kanat fırıldak düzeninde, kintsugi damarları), altın-fildişi kordon + onarımlı porselen düğme; tarih · şehir +
  Tap to open; Skip; erik dalı sağ üstte, Skip'in altında küçük (sol üstte ses düğmesi var).
- Açılış (3,45 s): düğme yarım tur döner ve kalkar → kordon çözülüp sağa kayar → sahne .52'ye küçülür (açık paket ≈ 2×
  geniş, 360 px'te sığar) → kanatlar K→D→G→B 220 ms arayla kendi menteşelerinde 3B, gerçek iç yüzlerine (W8–W11) açılır
  → kart merkezden öne yükselir → altın varak, mürekkep damlası (düşüp yayılır), erik yaprağı süzülür → home.
- İç sayfalar: yırtık washi paspartular, foto GPT `ink_bloom` maskesiyle (CSS mask-image) belirir, altın dikişte ışık;
  story sol–sağ–sol (story_2 geniş paspartu); details program + çivit washi mekân; RSVP kartı + erik dalı; imza çay kâsesi.
- GPT kusurları: katman kayması %1–3 (alfa kutusu + taban kutusuna yerleştirme); `frame_venue` yeşilsiz (pencere =
  paspartunun çevrelediği şeffaf delik); `divider` tuval oranı yanlış (alfa kırpımı); güney iç yüz ucu %10 kayık
  (yatay aynalandı); geniş story penceresi 1,54:1, mekân 2,03:1 (theme.json oranları ölçüme göre).
- Paylaşılan: designs.ts (PREVIEW + REBUILT, UNIQUE_INTERIORS silindi), tr/de/es/fr çevirileri, ses zamanları, PAKET 6R
  baskı düzeni + `public/print/kintsugi-washi/`, katalog eksenleri, demo fotoğrafları, Codex test fikstürleri/G177.
- Test: tema testi 12/12; listelenen paket 85/86 (yalnız bilinen "claims we never make"); tsc temiz. Kareler 390/360/1280
  (`scratchpad/g426/kintsugi-washi-sheet.png`). Bekleyen: katalog kapak/klibi yeniden yakalama, paletler (variants),
  font-fallback ölçümü, gerçek cihaz denemesi.

