---
id: G422
baslik: Tasarım 22 Nocturne Lake Estate — tema yeniden kurulumu (39 pilot yapısı, PAKET 5R parçaları)
rol: claude-kod
durum: inceleme
alan:
oncelik: 2
bagimli: [G222, G423]
yazar: [platform/themes/nocturne-lake-estate/, platform/tests/theme-nocturne-lake-estate.test.ts, platform/previews/g422/, platform/lib/print/layouts.ts, platform/public/print/nocturne-lake-estate/, platform/public/marketing/, platform/lib/marketing/, collections/22_Nocturne_Lake_Estate/package/, gorevler/G422-nocturne-lake-estate-yeniden.md]
---

## Amaç
`docs/35_22_32_YENIDEN_TASARIM.md` §6: `platform/themes/nocturne-lake-estate/` Codex'in `envelope-v3` kalıbından çıkarılıp
39 Silver Photo Booth pilotunun yapısıyla (`docs/34_TEMA_HATTI_40_48.md`) yeni GPT parçalarından baştan kurulur.
Pilot G423 (Velvet Jewel Box) örnek alınır.

## Girdiler
- `collections/22_Nocturne_Lake_Estate/DESIGN_BRIEF.md` + `collections/22_Nocturne_Lake_Estate/assets/gpt/GPT_PROMPTS.md` (her parçanın "Kullanım" satırı) + `parts/` (G222)
- Pilot dosyaları `platform/themes/silver-photo-booth/` ve `swan-chantilly-lace/`; standart `docs/11`, `docs/34`, `docs/35` §3

## Yapılacaklar
1. `kit_check --paket 5` + göz kontrolü; kusurları `docs/34` §4 yöntemleriyle çöz (çizim yok, K21).
2. `build_images.py` (alfa kutusu, arka katman kutusuna yerleştirme, `keyed_window`, manifest.stage ↔ site.css), `img/` ≤ 3 MB.
3. Şablonlar + `site.css` + `site.js` (`MOTION` ↔ CSS keyframe gecikmeleri aynı sayılar); kapak düzeni ve açılış `docs/35` §3.
   Kaldır: `envelope-v3.*`, `opening*`, `interior*`, `parts.css`, eski `v3-*/v4-*` görseller. Koru: slug, `theme.json` foto
   anahtarları, `content.demo.json`, kopya anahtarları (`node scripts/copy-manifest.ts --theme nocturne-lake-estate --check`).
4. `variants.css` paletleri yeni sanattan; baskı düzeni PAKET 6R'ye (`lib/print/layouts.ts`, `build-print-assets`).
5. `tests/theme-nocturne-lake-estate.test.ts` yeni yapıya göre; katalog kapak posteri + açılış klibi yeniden.
6. Göz kontrolü (`docs/34` §5): kapalı → açılış (300 ms aralık) → home/story/details/rsvp; 360/390/430 + masaüstü.

## Bitti sayılması için
- [ ] Tema testi + g085/g093/g094/g097/g138/g139/g150/g155/g175 + content testleri geçer
- [ ] Açılışta boş/düz renkli yüz yok; kapanış, kapak (gerçek iç yüz), kart, süzülen nesneler ayrı hareket ediyor
- [ ] Kapak düzeni: isimler ve Skip hiçbir dekorun altında değil; tarih · şehir + Tap to open
- [ ] Önizleme kareleri `platform/previews/g422/`; Sonuç yazılı; durum `coming`

## Sonuç
Kuruldu (2026-10-22, dal `claude/g422-nocturne-lake-estate`; birleştirme entegratörde).
- Tema pilot G423 yapısıyla baştan yazıldı; Codex `envelope-v3`/`opening*`/`interior*`/`variants.css` ve eski img/ kaldırıldı.
- `build_images.py`: 22 PAKET 5R parçası; zarf katmanları arka kutusuna (cep/kapak/bant ~%5 geniş gelmişti), broş bandın
  ortasına, kapak iç yüzü kendi oranında (%63,9) ve arka kenar payının üstüne; pencereler yeşil halka + çevrelediği alan,
  kemer için ölçülen pencereden `mask_arch.png`; panjurlar story çerçevesinin tuvalinde; yeşil kalıntı yok; klasör ~1,8 MB.
- Açılış (3,85 s): hilal parlar → yükselip ay olarak üstte kalır → vellum bant kayıp söner → elmas kapak gece göğüne 3B
  açılır (astardaki gölle tek tablo) → ay yolunda ışık kıpırtısı → altın varak/kıvılcım/gül yaprağı → kart cepten yükselir,
  öne gelir → home. İç sayfalar: kemerli villa penceresi, panjurları açılan story pencereleri, korkuluklu teras çerçevesi,
  fener imzası; demo içerikte medya null (PAKET 2 fotoğrafları `public/demo/nocturne-lake-estate/`).
- Testler: `tests/theme-nocturne-lake-estate.test.ts` 11/11; liste (unique-openings/interiors, physical-lining,
  rebuilt-eleven-rsvp, g180, g150, g175, marketing-content, g142) 89/90 — tek hata önceden bilinen `marketing-content`
  "claims we never make"; `tsc --noEmit` temiz; g149 2/2. g142'den 22 çıkarıldı (yalnız 21 kaldı).
- Göz kontrolü: 390×844, 360×740, 1280×800 Chromium; açılış sabit zamanlarda ve gerçek zamanlı (view transition ile home);
  iç sayfalar taşma 0. Gerçek telefonda denenmedi.
- Platform: designs.ts (PREVIEW + REBUILT, UNIQUE_INTERIORS'tan çıktı) + tr/de/es/fr, ses zamanları, PAKET 6R baskı düzeni
  (kutular ölçüldü), katalog eksenleri, font-fallback ölçüldü.
- Ertelenen: paletler (variants), katalog kartı/klibi yeniden yakalama (`public/marketing`, assets.json bu görevde yok),
  `platform/previews/g422/` (seyrek checkout'ta yok; kareler oturum karalama klasöründe).
