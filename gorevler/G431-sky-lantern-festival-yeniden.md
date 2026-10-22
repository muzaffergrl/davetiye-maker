---
id: G431
baslik: Tasarım 31 Sky Lantern Festival — tema yeniden kurulumu (39 pilot yapısı, PAKET 5R parçaları)
rol: claude-kod
durum: inceleme
alan: claude-session-01HjhGPm
oncelik: 2
bagimli: [G231, G423]
yazar: [platform/themes/sky-lantern-festival/, platform/tests/theme-sky-lantern-festival.test.ts, platform/previews/g431/, platform/lib/print/layouts.ts, platform/public/print/sky-lantern-festival/, platform/public/marketing/, platform/lib/marketing/, collections/31_Sky_Lantern_Festival/package/, gorevler/G431-sky-lantern-festival-yeniden.md]
---

## Amaç
`docs/35_22_32_YENIDEN_TASARIM.md` §6: `platform/themes/sky-lantern-festival/` Codex'in `envelope-v3` kalıbından çıkarılıp
39 Silver Photo Booth pilotunun yapısıyla (`docs/34_TEMA_HATTI_40_48.md`) yeni GPT parçalarından baştan kurulur.
Pilot G423 (Velvet Jewel Box) örnek alınır.

## Girdiler
- `collections/31_Sky_Lantern_Festival/DESIGN_BRIEF.md` + `collections/31_Sky_Lantern_Festival/assets/gpt/GPT_PROMPTS.md` (her parçanın "Kullanım" satırı) + `parts/` (G231)
- Pilot dosyaları `platform/themes/silver-photo-booth/` ve `swan-chantilly-lace/`; standart `docs/11`, `docs/34`, `docs/35` §3

## Yapılacaklar
1. `kit_check --paket 5` + göz kontrolü; kusurları `docs/34` §4 yöntemleriyle çöz (çizim yok, K21).
2. `build_images.py` (alfa kutusu, arka katman kutusuna yerleştirme, `keyed_window`, manifest.stage ↔ site.css), `img/` ≤ 3 MB.
3. Şablonlar + `site.css` + `site.js` (`MOTION` ↔ CSS keyframe gecikmeleri aynı sayılar); kapak düzeni ve açılış `docs/35` §3.
   Kaldır: `envelope-v3.*`, `opening*`, `interior*`, `parts.css`, eski `v3-*/v4-*` görseller. Koru: slug, `theme.json` foto
   anahtarları, `content.demo.json`, kopya anahtarları (`node scripts/copy-manifest.ts --theme sky-lantern-festival --check`).
4. `variants.css` paletleri yeni sanattan; baskı düzeni PAKET 6R'ye (`lib/print/layouts.ts`, `build-print-assets`).
5. `tests/theme-sky-lantern-festival.test.ts` yeni yapıya göre; katalog kapak posteri + açılış klibi yeniden.
6. Göz kontrolü (`docs/34` §5): kapalı → açılış (300 ms aralık) → home/story/details/rsvp; 360/390/430 + masaüstü.

## Bitti sayılması için
- [x] Tema testi + g150/g175 + unique-*/physical-lining/rebuilt-eleven-rsvp/g180/marketing-content geçer (seyrek checkout: g085/g093/g094/g097/g139/content entegratörde)
- [x] Açılışta boş/düz renkli yüz yok; kapanış, kapak (gerçek iç yüz), kart, süzülen nesneler ayrı hareket ediyor
- [x] Kapak düzeni: isimler ve Skip hiçbir dekorun altında değil; tarih · şehir + Tap to open
- [x] Sonuç yazılı; katalog durumu `preview` (önizleme kareleri repoya konmadı: seyrek checkout, oturum notları)

## Sonuç
Yeniden kurulum tamamlandı (2026-10-22, dal `claude/g431-sky-lantern-festival`).
- Tema velvet-jewel-box pilot yapısıyla baştan yazıldı; Codex `envelope-v3`/`opening*`/`interior*`/`variants.css` ve eski
  img/ kaldırıldı. Dikey dip-dye washi zarf, fener karnı kapak; kapanış: kehribar ipekle altın çiviye bağlı kâğıt fener.
- Açılış (3,55 s): fener yanar (sönük/yanık GPT çifti + CSS hâle) → ipek fiyonk gevşer → fener salınarak ekranın üstünden
  çıkar, arkada üç uzak fener farklı hızlarda yükselir → kapak 3B açılır (gerçek `flap_in`) → kart cepten yükselir ve öne
  gelir; altın varak + gül yaprağı düşer, karahindiba tohumu yükselir.
- `build_images.py`: 21 PAKET 5R parçası; katmanlar arka kutusuna (kapak %7, cep %2 geniş çizilmişti); GPT feneri zarf
  eninin %43'ü çizmişti (istenen ~%33) → iki fener aynı kutuda %34'e, tel halka çivide kalacak şekilde ölçeklendi; iplikte
  küçük fenerin omzu üstündeki satırlar atıldı. Pencereler yeşil halka + çevrelediği alan; fener penceresinin kemerli
  şekli ölçülen piksellerden `mask_arch.png`. Yeşil kalıntı yok; img/ + tema klasörü 1,63 MB.
- Testler: `tests/theme-sky-lantern-festival.test.ts` 11/11; istenen set 82 test, 81 geçti, 1 hata (`marketing-content`
  "claims we never make": designs.ts "hand-painted" — Chartreuse Garden Party metninde, önceden vardı); `tsc --noEmit` temiz.
  `pytest tools/tests/test_recolor_parts.py`: 20 hata, hepsi seyrek checkout (başka koleksiyonların recolor.json'u yok).
- Göz kontrolü: 390×844, 360×740, 1280×800 Chromium; açılış sabit zamanlarda ve gerçek zamanlı; iç sayfalar taşma 0.
  Gerçek telefonda denenmedi.
- Platform: designs.ts (PREVIEW + REBUILT, UNIQUE_INTERIORS girdisi silindi) + tr/de/es/fr çevirileri (i18n eksik 16),
  ses zamanları = MOTION, PAKET 6R baskı düzeni (kutular ölçüldü: ön [19,12,10,12], arka [12,11,9,11]), katalog eksenleri,
  demo fotoğrafları; Codex fikstürlerinden ve listelerden tema çıkarıldı.
- Ertelenen: paletler (variants) yeni sanattan; font-fallback ölçümü (Corinthia) yeniden koşulmadı; katalog kapak/klip
  yeniden yakalama (üretim build'i, entegratör).
