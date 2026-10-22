---
id: G425
baslik: Tasarım 25 Orient Express Voyage — tema yeniden kurulumu (39 pilot yapısı, PAKET 5R parçaları)
rol: claude-kod
durum: inceleme
alan:
oncelik: 2
bagimli: [G225, G423]
yazar: [platform/themes/orient-express-voyage/, platform/tests/theme-orient-express-voyage.test.ts, platform/previews/g425/, platform/lib/print/layouts.ts, platform/public/print/orient-express-voyage/, platform/public/marketing/, platform/lib/marketing/, collections/25_Orient_Express_Voyage/package/, gorevler/G425-orient-express-voyage-yeniden.md]
---

## Amaç
`docs/35_22_32_YENIDEN_TASARIM.md` §6: `platform/themes/orient-express-voyage/` Codex'in `envelope-v3` kalıbından çıkarılıp
39 Silver Photo Booth pilotunun yapısıyla (`docs/34_TEMA_HATTI_40_48.md`) yeni GPT parçalarından baştan kurulur.
Pilot G423 (Velvet Jewel Box) örnek alınır.

## Girdiler
- `collections/25_Orient_Express_Voyage/DESIGN_BRIEF.md` + `collections/25_Orient_Express_Voyage/assets/gpt/GPT_PROMPTS.md` (her parçanın "Kullanım" satırı) + `parts/` (G225)
- Pilot dosyaları `platform/themes/silver-photo-booth/` ve `swan-chantilly-lace/`; standart `docs/11`, `docs/34`, `docs/35` §3

## Yapılacaklar
1. `kit_check --paket 5` + göz kontrolü; kusurları `docs/34` §4 yöntemleriyle çöz (çizim yok, K21).
2. `build_images.py` (alfa kutusu, arka katman kutusuna yerleştirme, `keyed_window`, manifest.stage ↔ site.css), `img/` ≤ 3 MB.
3. Şablonlar + `site.css` + `site.js` (`MOTION` ↔ CSS keyframe gecikmeleri aynı sayılar); kapak düzeni ve açılış `docs/35` §3.
   Kaldır: `envelope-v3.*`, `opening*`, `interior*`, `parts.css`, eski `v3-*/v4-*` görseller. Koru: slug, `theme.json` foto
   anahtarları, `content.demo.json`, kopya anahtarları (`node scripts/copy-manifest.ts --theme orient-express-voyage --check`).
4. `variants.css` paletleri yeni sanattan; baskı düzeni PAKET 6R'ye (`lib/print/layouts.ts`, `build-print-assets`).
5. `tests/theme-orient-express-voyage.test.ts` yeni yapıya göre; katalog kapak posteri + açılış klibi yeniden.
6. Göz kontrolü (`docs/34` §5): kapalı → açılış (300 ms aralık) → home/story/details/rsvp; 360/390/430 + masaüstü.

## Bitti sayılması için
- [ ] Tema testi + g085/g093/g094/g097/g138/g139/g150/g155/g175 + content testleri geçer
- [ ] Açılışta boş/düz renkli yüz yok; kapanış, kapak (gerçek iç yüz), kart, süzülen nesneler ayrı hareket ediyor
- [ ] Kapak düzeni: isimler ve Skip hiçbir dekorun altında değil; tarih · şehir + Tap to open
- [ ] Önizleme kareleri `platform/previews/g425/`; Sonuç yazılı; durum `coming`

## Sonuç

2026-10-22 (claude-kod, dal `claude/g425-orient-express-voyage`): tema G423 pilotunun yapısıyla yeni PAKET 5R
parçalarından baştan kuruldu (`platform/themes/orient-express-voyage/`, README). Kapalı sayfa: harita kâğıdı zemin,
"Together with their families" + Limelight isimler, ortada 2,18:1 şişe yeşili deri bilet kılıfı (pirinç köşelik, sağ uçta
dil kapak, çevirmeli kilit = sabit plaka + dönen düğme, kuşgözünden kırmızı iple boş bagaj etiketi), altta tarih · şehir +
Tap to open, Skip. Açılış (3,8 s): etiket sarkacı → kilit düğmesi 90° → dil kapak sağ menteşede 3B açılır (gerçek bordo
ipek iç yüz) → kılıf sola çekilirken bilet ağızdan sağa kayar, dikleşir, öne gelir → buhar + zımba pulu + gül goncası;
360 px'te her şey ekranda (test hesaplıyor). İç sayfalar: maun-pirinç vagon pencereleri (ölçülmüş pencere + teknik maske),
9 dilimli bilet kartı (home), yeşil deri bant + cep saati, haritada istasyon istasyon çizilen rota (home + yapışkan
itinerary), story'de deri perdesi kalkan, kaydırınca manzara gibi akan sürgülü pencereler, panorama mekân penceresi.
Paylaşılan: designs.ts (PREVIEW + REBUILT, UNIQUE_INTERIORS'tan çıktı), tr/de/es/fr çevirileri, ses = MOTION, baskı
PAKET 6R + ölçülen kutular, katalog eksenleri, Codex fikstürlerinden/listelerinden çıkarıldı, demo fotoğrafları kendi
PAKET 2'si. Test: `tests/theme-orient-express-voyage.test.ts` 12/12; istenen set 84/85 (bilinen "claims we never make").
Kareler 390×844, 360×740, 1280×800 + gerçek zamanlı açılış/kaydırma. Bekleyen: katalog kapak/klip yakalama (üretim
build'i), `variants` paletleri, gerçek cihaz denemesi, `platform/previews/g425/` (seyrek checkout'ta yok, kareler oturum
geçici klasöründe).
