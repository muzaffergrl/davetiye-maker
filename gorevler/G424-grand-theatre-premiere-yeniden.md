---
id: G424
baslik: Tasarım 24 Grand Theatre Premiere — tema yeniden kurulumu (39 pilot yapısı, PAKET 5R parçaları)
rol: claude-kod
durum: bitti
alan: claude-session-01HjhGPm
oncelik: 2
bagimli: [G224, G423]
yazar: [platform/themes/grand-theatre-premiere/, platform/tests/theme-grand-theatre-premiere.test.ts, platform/previews/g424/, platform/lib/print/layouts.ts, platform/public/print/grand-theatre-premiere/, platform/public/marketing/, platform/lib/marketing/, collections/24_Grand_Theatre_Premiere/package/, gorevler/G424-grand-theatre-premiere-yeniden.md]
---

## Amaç
`docs/35_22_32_YENIDEN_TASARIM.md` §6: `platform/themes/grand-theatre-premiere/` Codex'in `envelope-v3` kalıbından çıkarılıp
39 Silver Photo Booth pilotunun yapısıyla (`docs/34_TEMA_HATTI_40_48.md`) yeni GPT parçalarından baştan kurulur.
Pilot G423 (Velvet Jewel Box) örnek alınır.

## Girdiler
- `collections/24_Grand_Theatre_Premiere/DESIGN_BRIEF.md` + `collections/24_Grand_Theatre_Premiere/assets/gpt/GPT_PROMPTS.md` (her parçanın "Kullanım" satırı) + `parts/` (G224)
- Pilot dosyaları `platform/themes/silver-photo-booth/` ve `swan-chantilly-lace/`; standart `docs/11`, `docs/34`, `docs/35` §3

## Yapılacaklar
1. `kit_check --paket 5` + göz kontrolü; kusurları `docs/34` §4 yöntemleriyle çöz (çizim yok, K21).
2. `build_images.py` (alfa kutusu, arka katman kutusuna yerleştirme, `keyed_window`, manifest.stage ↔ site.css), `img/` ≤ 3 MB.
3. Şablonlar + `site.css` + `site.js` (`MOTION` ↔ CSS keyframe gecikmeleri aynı sayılar); kapak düzeni ve açılış `docs/35` §3.
   Kaldır: `envelope-v3.*`, `opening*`, `interior*`, `parts.css`, eski `v3-*/v4-*` görseller. Koru: slug, `theme.json` foto
   anahtarları, `content.demo.json`, kopya anahtarları (`node scripts/copy-manifest.ts --theme grand-theatre-premiere --check`).
4. `variants.css` paletleri yeni sanattan; baskı düzeni PAKET 6R'ye (`lib/print/layouts.ts`, `build-print-assets`).
5. `tests/theme-grand-theatre-premiere.test.ts` yeni yapıya göre; katalog kapak posteri + açılış klibi yeniden.
6. Göz kontrolü (`docs/34` §5): kapalı → açılış (300 ms aralık) → home/story/details/rsvp; 360/390/430 + masaüstü.

## Bitti sayılması için
- [x] Tema testi + g150/g175/g180/marketing (bilinen tek hata hariç) geçer; g085/g093/g094/g097/g139/content seyrek çalışma kopyasında koşulamaz (entegratör)
- [x] Açılışta boş/düz renkli yüz yok; kapanış, kapak (gerçek iç yüz), kart, süzülen nesneler ayrı hareket ediyor
- [x] Kapak düzeni: isimler ve Skip hiçbir dekorun altında değil; tarih · şehir + Tap to open
- [x] Sonuç yazılı; katalog durumu `preview` (önizleme kareleri repoya konmadı: seyrek çalışma kopyası, oturum notları)

## Sonuç

Tema yeniden kuruldu (2026-10-22, dal `claude/g424-grand-theatre-premiere`, G423 pilotunun yapısı).
- Codex `envelope-v3`/`opening*`/`interior*`/`variants.css` ve eski img/ kaldırıldı; 5 sayfa + `site.css`/`site.js`/
  `thank-you.css`/`build_images.py` baştan yazıldı.
- `build_images.py`: 23 PAKET 5R parçası; zarf katmanları kendi alfa kutularıyla arka kutusuna (zarf ölçülen 1,59:1);
  bilet ölçülen delik çizgisinden (%56,3, istenen %54,6 değil) ikiye, kordon düğümden ikiye; 5 ayak lambası ölçüldü;
  pencereler = çerçevenin çevrelediği delik (+ teknik alfa maskesi), yeşil kalıntı yok; klasör ~1,9 MB.
- Açılış (4,5 s): bilet kayar ve yırtılır → kordon çözülür, püsküller sarkaç gibi düşer → salon ışığı kısılır → perdeler dış
  menteşelerinde 3B ~115° açılır (gerçek altın ipek iç yüzler) → spot sahneyi tarar, ayak lambaları yanar → kart apronun
  arkasından yükselir ve öne gelir → konfeti + bordo/fildişi yaprak. Zarf açılırken .72'ye iner; 360 px'te perdeler ekranda.
- İç sayfalar: proscenium portre, story'de Act I–III program sayfaları (sırtından çevrilir, spot), details geniş
  proscenium, RSVP'de yeni biletin koçanı yırtılır; opera dürbünü imza.
- Testler: `tests/theme-grand-theatre-premiere.test.ts` 11/11; istenen küme 82 test, 81 geçti, 1 hata (`marketing-content`
  "claims we never make": designs.ts "AI-powered / hand-painted" — önceden vardı). `tsc --noEmit` temiz. i18n eksik 17/dil.
- Platform: designs.ts (PREVIEW + REBUILT, UNIQUE_INTERIORS'tan çıkarıldı) + tr/de/es/fr, ses zamanları = MOTION, PAKET 6R
  baskı düzeni (kutular ölçüldü), katalog eksenleri, Codex test fikstürlerinden ve G177'den çıkarıldı, demo fotoğrafları.
- Göz kontrolü: 390×844, 360×740, 1280×800 Chromium; açılış sabit zamanlarda ve gerçek zamanlı; taşma 0. Gerçek
  telefonda denenmedi.
- Ertelenen: paletler (variants), font-fallback ölçümü, katalog kapak/klip yeniden yakalama (üretim build'i ister).

## Günlük
- 2026-10-22 entegratör onayladı
