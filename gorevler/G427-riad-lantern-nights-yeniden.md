---
id: G427
baslik: Tasarım 27 Riad Lantern Nights — tema yeniden kurulumu (39 pilot yapısı, PAKET 5R parçaları)
rol: claude-kod
durum: inceleme
alan: claude-session-01HjhGPm
oncelik: 2
bagimli: [G227, G423]
yazar: [platform/themes/riad-lantern-nights/, platform/tests/theme-riad-lantern-nights.test.ts, platform/previews/g427/, platform/lib/print/layouts.ts, platform/public/print/riad-lantern-nights/, platform/public/marketing/, platform/lib/marketing/, collections/27_Riad_Lantern_Nights/package/, gorevler/G427-riad-lantern-nights-yeniden.md]
---

## Amaç
`docs/35_22_32_YENIDEN_TASARIM.md` §6: `platform/themes/riad-lantern-nights/` Codex'in `envelope-v3` kalıbından çıkarılıp
39 Silver Photo Booth pilotunun yapısıyla (`docs/34_TEMA_HATTI_40_48.md`) yeni GPT parçalarından baştan kurulur.
Pilot G423 (Velvet Jewel Box) örnek alınır.

## Girdiler
- `collections/27_Riad_Lantern_Nights/DESIGN_BRIEF.md` + `collections/27_Riad_Lantern_Nights/assets/gpt/GPT_PROMPTS.md` (her parçanın "Kullanım" satırı) + `parts/` (G227)
- Pilot dosyaları `platform/themes/silver-photo-booth/` ve `swan-chantilly-lace/`; standart `docs/11`, `docs/34`, `docs/35` §3

## Yapılacaklar
1. `kit_check --paket 5` + göz kontrolü; kusurları `docs/34` §4 yöntemleriyle çöz (çizim yok, K21).
2. `build_images.py` (alfa kutusu, arka katman kutusuna yerleştirme, `keyed_window`, manifest.stage ↔ site.css), `img/` ≤ 3 MB.
3. Şablonlar + `site.css` + `site.js` (`MOTION` ↔ CSS keyframe gecikmeleri aynı sayılar); kapak düzeni ve açılış `docs/35` §3.
   Kaldır: `envelope-v3.*`, `opening*`, `interior*`, `parts.css`, eski `v3-*/v4-*` görseller. Koru: slug, `theme.json` foto
   anahtarları, `content.demo.json`, kopya anahtarları (`node scripts/copy-manifest.ts --theme riad-lantern-nights --check`).
4. `variants.css` paletleri yeni sanattan; baskı düzeni PAKET 6R'ye (`lib/print/layouts.ts`, `build-print-assets`).
5. `tests/theme-riad-lantern-nights.test.ts` yeni yapıya göre; katalog kapak posteri + açılış klibi yeniden.
6. Göz kontrolü (`docs/34` §5): kapalı → açılış (300 ms aralık) → home/story/details/rsvp; 360/390/430 + masaüstü.

## Bitti sayılması için
- [x] Tema testi + g150/g175 geçer; g085/g093/g094/g097/g139/content seyrek çalışma kopyasında koşamaz (entegratör koşar)
- [x] Açılışta boş/düz renkli yüz yok; kapanış, kapak (gerçek iç yüz), kart, süzülen nesneler ayrı hareket ediyor
- [x] Kapak düzeni: isimler ve Skip hiçbir dekorun altında değil; tarih · şehir + Tap to open
- [x] Sonuç yazılı; katalog durumu `preview` (önizleme kareleri repoya konmadı: oturum notu, ortak brief)

## Sonuç
Yeniden kuruldu (2026-10-22, dal `claude/g427-riad-lantern-nights`).
- Tema G423 pilot yapısıyla baştan yazıldı; Codex `envelope-v3`/`opening*`/`interior*`/`variants.css` ve eski img/ kaldırıldı.
- `build_images.py`: 22 PAKET 5R parçası; zarf katmanları arka kutusuna (ölçülen yerlerinde), çivi kapağın üstünde,
  fener çifti tek kutuda kordonun halkasına asılı (iki halka ölçüldü); pencereler: yeşil halka kapalı değildi → ortadan
  taşma dolgusu (opak çerçeveyle sınırlı) + adacıklar; iki at nalı kemer için teknik alfa maskesi (`mask-image`); zemin
  dokularında kenar tonu yumuşatıldı; klasör ~1,65 MB, yeşil kalıntı yok.
- Açılış: fener yanar (sönük→yanık çapraz geçiş + CSS ışık) → kordon çividen kalkıp salınarak düşer, fener söner → kemer
  kapak 3B açılıp zellige iç yüzüyle kapı kemeri gibi dikilir → kart cepten yükselir, öne gelir → yaprak/çiçek/yıldız +
  ışık zerreleri; home 3,8 s.
- Testler: `tests/theme-riad-lantern-nights.test.ts` 12/12; unique-openings/unique-interiors/physical-lining/
  rebuilt-eleven-rsvp/g180/g150/g175/marketing-content 71/72 (tek hata önceden var: "claims we never make",
  designs.ts "hand-painted"); `tsc --noEmit` temiz. `test_recolor_parts.py` seyrek kopyada diğer koleksiyonlar olmadığı
  için koşamaz.
- Göz kontrolü: 390×844, 360×740, 1280×800 Chromium, açılış sabit zamanlarda; iç sayfalar taşma 0. Gerçek telefonda
  denenmedi.
- Platform: designs.ts metinleri (+tr/de/es/fr), ses zamanları, PAKET 6R baskı düzeni (kutular ölçüldü), katalog
  eksenleri, demo fotoğrafları; Codex test listelerinden çıkarıldı.
- Ertelenen: paletler (variants), font-fallback ölçümü (Cinzel için tahmini değer), katalog kartı/klibi yeniden yakalama.
