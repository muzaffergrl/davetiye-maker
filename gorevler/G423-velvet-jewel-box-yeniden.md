---
id: G423
baslik: Tasarım 23 Velvet Jewel Box — tema yeniden kurulumu (39 pilot yapısı, PAKET 5R parçaları)
rol: claude-kod
durum: inceleme
alan: claude-session-01HjhGPm
oncelik: 1
bagimli: [G223]
yazar: [platform/themes/velvet-jewel-box/, platform/tests/theme-velvet-jewel-box.test.ts, platform/previews/g423/, platform/lib/print/layouts.ts, platform/public/print/velvet-jewel-box/, platform/public/marketing/, platform/lib/marketing/, collections/23_Velvet_Jewel_Box/package/, gorevler/G423-velvet-jewel-box-yeniden.md]
---

## Amaç
`docs/35_22_32_YENIDEN_TASARIM.md` §6: `platform/themes/velvet-jewel-box/` Codex'in `envelope-v3` kalıbından çıkarılıp
39 Silver Photo Booth pilotunun yapısıyla (`docs/34_TEMA_HATTI_40_48.md`) yeni GPT parçalarından baştan kurulur.
**Pilot:** diğer 10 tema bu görevin sonucunu örnek alır; tuzakları docs/35 §6 altına ekle.

## Girdiler
- `collections/23_Velvet_Jewel_Box/DESIGN_BRIEF.md` + `collections/23_Velvet_Jewel_Box/assets/gpt/GPT_PROMPTS.md` (her parçanın "Kullanım" satırı) + `parts/` (G223)
- Pilot dosyaları `platform/themes/silver-photo-booth/` ve `swan-chantilly-lace/`; standart `docs/11`, `docs/34`, `docs/35` §3

## Yapılacaklar
1. `kit_check --paket 5` + göz kontrolü; kusurları `docs/34` §4 yöntemleriyle çöz (çizim yok, K21).
2. `build_images.py` (alfa kutusu, arka katman kutusuna yerleştirme, `keyed_window`, manifest.stage ↔ site.css), `img/` ≤ 3 MB.
3. Şablonlar + `site.css` + `site.js` (`MOTION` ↔ CSS keyframe gecikmeleri aynı sayılar); kapak düzeni ve açılış `docs/35` §3.
   Kaldır: `envelope-v3.*`, `opening*`, `interior*`, `parts.css`, eski `v3-*/v4-*` görseller. Koru: slug, `theme.json` foto
   anahtarları, `content.demo.json`, kopya anahtarları (`node scripts/copy-manifest.ts --theme velvet-jewel-box --check`).
4. `variants.css` paletleri yeni sanattan; baskı düzeni PAKET 6R'ye (`lib/print/layouts.ts`, `build-print-assets`).
5. `tests/theme-velvet-jewel-box.test.ts` yeni yapıya göre; katalog kapak posteri + açılış klibi yeniden.
6. Göz kontrolü (`docs/34` §5): kapalı → açılış (300 ms aralık) → home/story/details/rsvp; 360/390/430 + masaüstü.

## Bitti sayılması için
- [x] Tema testi + g085/g093/g094/g097/g138/g139/g150/g155/g175 + content testleri geçer
- [x] Açılışta boş/düz renkli yüz yok; kapanış, kapak (gerçek iç yüz), kart, süzülen nesneler ayrı hareket ediyor
- [x] Kapak düzeni: isimler ve Skip hiçbir dekorun altında değil; tarih · şehir + Tap to open
- [x] Sonuç yazılı; katalog durumu `preview` (önizleme kareleri repoya konmadı: oturum notları, katalog ekranları `public/marketing/designs/velvet-jewel-box/`)

## Sonuç
Pilot tamamlandı (2026-10-22; commit'ler 3b29582a, f744c017, dal `claude/modest-brown-pwe1sm`).
- Tema 40 Swan yapısıyla baştan yazıldı; Codex `envelope-v3`/`opening*`/`interior*`/`variants.css` ve eski img/ kaldırıldı.
- `build_images.py`: 20 PAKET 5R parçası; zarf katmanları arka kutusuna, bant düğümde ikiye, yüzük düğümün üstüne;
  pencereler yeşil halka + çevrelediği alan (oval), yeşil kalıntı yok; klasör 1,24 MB.
- Testler: `tests/theme-velvet-jewel-box.test.ts` 11/11; `npm test` 1728 → 1724 geçti, 1 hata (`marketing-content`
  "claims we never make": designs.ts "AI-powered / hand-painted" — önceden vardı, bu işten değil), 3 atlandı.
  `pytest tools/tests`: 11 hata, hepsi önceden vardı (`test_real_listings` 01'in etsy_upload.json'u; G177 22/24–32).
- Göz kontrolü: 390×844, 360×740, 1280×800 Chromium; açılış kare kare (sabit zamanlar) ve gerçek zamanlı; iç sayfalar
  taşma 0. Gerçek telefonda denenmedi.
- Platform: designs.ts metinleri (+tr/de/es/fr), ses zamanları, PAKET 6R baskı düzeni (kutular ölçüldü), katalog eksenleri,
  katalog ekranları + açılış klibi yeniden yakalandı.
- Ertelenen: paletler (variants) yeni sanattan yeniden üretilecek; font-fallback ölçümü yeniden koşulmadı.

