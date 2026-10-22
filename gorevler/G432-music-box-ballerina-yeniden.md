---
id: G432
baslik: Tasarım 32 Music Box Ballerina — tema yeniden kurulumu (39 pilot yapısı, PAKET 5R parçaları)
rol: claude-kod
durum: inceleme
alan: claude-session-01HjhGPm
oncelik: 2
bagimli: [G232, G423]
yazar: [platform/themes/music-box-ballerina/, platform/tests/theme-music-box-ballerina.test.ts, platform/previews/g432/, platform/lib/print/layouts.ts, platform/public/print/music-box-ballerina/, platform/public/marketing/, platform/lib/marketing/, collections/32_Music_Box_Ballerina/package/, gorevler/G432-music-box-ballerina-yeniden.md]
---

## Amaç
`docs/35_22_32_YENIDEN_TASARIM.md` §6: `platform/themes/music-box-ballerina/` Codex'in `envelope-v3` kalıbından çıkarılıp
39 Silver Photo Booth pilotunun yapısıyla (`docs/34_TEMA_HATTI_40_48.md`) yeni GPT parçalarından baştan kurulur.
Pilot G423 (Velvet Jewel Box) örnek alınır.

## Girdiler
- `collections/32_Music_Box_Ballerina/DESIGN_BRIEF.md` + `collections/32_Music_Box_Ballerina/assets/gpt/GPT_PROMPTS.md` (her parçanın "Kullanım" satırı) + `parts/` (G232)
- Pilot dosyaları `platform/themes/silver-photo-booth/` ve `swan-chantilly-lace/`; standart `docs/11`, `docs/34`, `docs/35` §3

## Yapılacaklar
1. `kit_check --paket 5` + göz kontrolü; kusurları `docs/34` §4 yöntemleriyle çöz (çizim yok, K21).
2. `build_images.py` (alfa kutusu, arka katman kutusuna yerleştirme, `keyed_window`, manifest.stage ↔ site.css), `img/` ≤ 3 MB.
3. Şablonlar + `site.css` + `site.js` (`MOTION` ↔ CSS keyframe gecikmeleri aynı sayılar); kapak düzeni ve açılış `docs/35` §3.
   Kaldır: `envelope-v3.*`, `opening*`, `interior*`, `parts.css`, eski `v3-*/v4-*` görseller. Koru: slug, `theme.json` foto
   anahtarları, `content.demo.json`, kopya anahtarları (`node scripts/copy-manifest.ts --theme music-box-ballerina --check`).
4. `variants.css` paletleri yeni sanattan; baskı düzeni PAKET 6R'ye (`lib/print/layouts.ts`, `build-print-assets`).
5. `tests/theme-music-box-ballerina.test.ts` yeni yapıya göre; katalog kapak posteri + açılış klibi yeniden.
6. Göz kontrolü (`docs/34` §5): kapalı → açılış (300 ms aralık) → home/story/details/rsvp; 360/390/430 + masaüstü.

## Bitti sayılması için
- [x] Tema testi + g138/g139/g150/g175 geçer (g085/g093/g094/g097/g139-diğer/content seyrek checkout'ta koşmaz → entegratör)
- [x] Açılışta boş/düz renkli yüz yok; kapanış, kapak (gerçek iç yüz), kart, süzülen nesneler ayrı hareket ediyor
- [x] Kapak düzeni: isimler ve Skip hiçbir dekorun altında değil; tarih · şehir + Tap to open
- [x] Sonuç yazılı; katalog durumu `preview` (önizleme kareleri repoya konmadı: oturum notu `scratchpad/g432/music-box-ballerina-sheet.png`)

## Sonuç
Tema yeniden kuruldu (2026-10-22, dal `claude/g432-music-box-ballerina`; pilot G423 yapısı).
- Codex `envelope-v3`/`opening*`/`interior*`/`variants.css` ve eski img/ kaldırıldı; 5 sayfa + `site.css`/`site.js`/
  `thank-you.css`/`build_images.py` pilot yapısında yeniden yazıldı.
- `build_images.py`: 20 PAKET 5R parçası; zarf katmanları arka kutusuna (cep ve kapak genişliğe, cep alta), anahtar deliği
  plakası tuvaldeki yerinde, plaka + anahtar kapağın kutusunda (kapakla kalkar); anahtar tuval merkezine göre kare kırpıldı ve
  ölçülen anahtar deliğine ortalandı; kapak iç yüzü kendi oranında (kapak yüksekliğinin %110,6'sı), oval aynası anahtarlandı
  ve altında `hero_portrait`; balerin ön/arka tek kutuda; pencereler yeşil halka + çevrelediği alan; yeşil kalıntı yok;
  klasör 1,45 MB.
- Açılış (4,7 s): anahtar iki tur → kapak 3B ayna iç yüzüne açılır, aynada portre buğusu çözülür → balerin cepten yükselir,
  iki piruet (scaleX takası) → yaprak/inci/tül süzülür → kart cepten yükselir, öne gelir → home. Açılışta düğme/hap yok.
- Testler: `tests/theme-music-box-ballerina.test.ts` 11/11; istenen set 91 testten 90 geçti (tek hata `marketing-content`
  "claims we never make", önceden vardı); g126 ses 7/7, g149 baskı geçti; `npx tsc --noEmit` temiz. `pytest
  tools/tests/test_recolor_parts.py`: hatalar seyrek checkout'ta eksik koleksiyon `variants/recolor.json`'larından.
- Göz kontrolü: 390×844, 360×740, 1280×800 Chromium (`theme-preview` + `theme-frames`); iç sayfalar taşma 0. Gerçek
  telefonda denenmedi.
- Platform: designs.ts (PREVIEW + REBUILT, UNIQUE_INTERIORS girdisi silindi) + tr/de/es/fr çevirileri (eksik 16), ses
  zamanları, PAKET 6R baskı düzeni (kutular ölçüldü, build-print-assets), katalog eksenleri, demo fotoğrafları; Codex
  test listelerinden/fikstürlerinden 32 çıkarıldı.
- Ertelenen: paletler (variants) yeni sanattan; font-fallback ölçümü Ballet için yeniden koşulmadı; katalog kapak/klibi
  yeniden yakalanmadı (üretim build'i ister).
