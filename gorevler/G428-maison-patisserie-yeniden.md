---
id: G428
baslik: Tasarım 28 Maison Pâtisserie — tema yeniden kurulumu (39 pilot yapısı, PAKET 5R parçaları)
rol: claude-kod
durum: inceleme
alan:
oncelik: 2
bagimli: [G228, G423]
yazar: [platform/themes/maison-patisserie/, platform/tests/theme-maison-patisserie.test.ts, platform/previews/g428/, platform/lib/print/layouts.ts, platform/public/print/maison-patisserie/, platform/public/marketing/, platform/lib/marketing/, collections/28_Maison_Patisserie/package/, gorevler/G428-maison-patisserie-yeniden.md]
---

## Amaç
`docs/35_22_32_YENIDEN_TASARIM.md` §6: `platform/themes/maison-patisserie/` Codex'in `envelope-v3` kalıbından çıkarılıp
39 Silver Photo Booth pilotunun yapısıyla (`docs/34_TEMA_HATTI_40_48.md`) yeni GPT parçalarından baştan kurulur.
Pilot G423 (Velvet Jewel Box) örnek alınır.

## Girdiler
- `collections/28_Maison_Patisserie/DESIGN_BRIEF.md` + `collections/28_Maison_Patisserie/assets/gpt/GPT_PROMPTS.md` (her parçanın "Kullanım" satırı) + `parts/` (G228)
- Pilot dosyaları `platform/themes/silver-photo-booth/` ve `swan-chantilly-lace/`; standart `docs/11`, `docs/34`, `docs/35` §3

## Yapılacaklar
1. `kit_check --paket 5` + göz kontrolü; kusurları `docs/34` §4 yöntemleriyle çöz (çizim yok, K21).
2. `build_images.py` (alfa kutusu, arka katman kutusuna yerleştirme, `keyed_window`, manifest.stage ↔ site.css), `img/` ≤ 3 MB.
3. Şablonlar + `site.css` + `site.js` (`MOTION` ↔ CSS keyframe gecikmeleri aynı sayılar); kapak düzeni ve açılış `docs/35` §3.
   Kaldır: `envelope-v3.*`, `opening*`, `interior*`, `parts.css`, eski `v3-*/v4-*` görseller. Koru: slug, `theme.json` foto
   anahtarları, `content.demo.json`, kopya anahtarları (`node scripts/copy-manifest.ts --theme maison-patisserie --check`).
4. `variants.css` paletleri yeni sanattan; baskı düzeni PAKET 6R'ye (`lib/print/layouts.ts`, `build-print-assets`).
5. `tests/theme-maison-patisserie.test.ts` yeni yapıya göre; katalog kapak posteri + açılış klibi yeniden.
6. Göz kontrolü (`docs/34` §5): kapalı → açılış (300 ms aralık) → home/story/details/rsvp; 360/390/430 + masaüstü.

## Bitti sayılması için
- [x] Tema testi + g150/g175 geçer (g085/g093/g094/g097/g138/g139/g155/content seyrek çalışma ağacında koşulamaz →
      entegratör birleştirince koşar)
- [x] Açılışta boş/düz renkli yüz yok; kapanış, kapak (gerçek iç yüz), kart, süzülen nesneler ayrı hareket ediyor
- [x] Kapak düzeni: isimler ve Skip hiçbir dekorun altında değil; tarih · şehir + Tap to open
- [x] Sonuç yazılı; katalog durumu `preview` (önizleme kareleri repoya konmadı: oturum notları; katalog kapağı/klibi eski)

## Sonuç
Yeniden kurulum tamamlandı (2026-10-22, dal `claude/g428-maison-patisserie`); inceleme bekliyor.
- Tema G423 pilotunun yapısıyla baştan yazıldı; Codex `envelope-v3`/`opening*`/`interior*`/`variants.css` ve eski img/
  kaldırıldı. Kapak: yatay krem zarf (1,32:1), dantel tarak fıstık yeşili kapak, gül pembesi kılıf bant, saten fiyonk,
  şekerlenmiş gonca. Açılış (3,7 s): gonca yuvarlanır → fiyonk çözülmüş kuyruklarla değişir → kuyruklar sağa kayar →
  kılıf bant sağa kayar → kapak 3B açılır (iç yüz = GPT W6 doily astar) → kart cebin arkasından yükselir, öne gelir →
  makaron, şeker inci, yaprak kartın yanlarına zıplayarak düşer. Düğme/hap yok; reduced motion, tekrar, Skip, no-JS var.
- İç sayfalar: krema oval portre, davet bandının üstünde gül saten fiyonk, porselen tabak tanıtımı, makaron standı imza;
  story = cam vitrin rafında kayan üç porselen tabak (ortadaki öne çıkıp hafifçe döner); details = pastane vitrini
  (pencere dikdörtgen, ölçüldü; foto sağdan kayarak girer), menü notunda raf + stand; RSVP makaron renkli seçim hapları,
  gönderimde şeker inci yağmuru.
- `build_images.py`: 22 PAKET 5R parçası; zarf katmanları arka kutusuna (kapak üst kenara, cep alt kenara uzatıldı,
  çözülmüş kurdele 58 px aşağı bağlı kurdelenin çizgisine), gonca düğüme; pencereler yeşil halka + çevrelediği alan
  (vitrin: halka kutusu, öndeki güller korunur); yeşil kalıntı yok; klasör ~1,3 MB.
- Testler: `tests/theme-maison-patisserie.test.ts` 11/11; brief listesi 81 test, 80 geçti, 1 hata (`marketing-content`
  "claims we never make": 43 Chartreuse'un "hand-painted" metni — önceden vardı); `tsc --noEmit` temiz;
  i18n market eksik 17/dil.
- Platform: designs.ts (PREVIEW + REBUILT, UNIQUE_INTERIORS girdisi silindi) + tr/de/es/fr, ses zamanları = MOTION,
  PAKET 6R baskı düzeni (kutular ölçüldü: ön [20,10,10,10], arka [13.5,10,8,10]), katalog eksenleri, demo fotoğrafları;
  Codex test listelerinden (fixtures, physical-lining + Maison "black holes" testi, G177) tema çıkarıldı.
- Göz kontrolü: 390×844, 360×740, 1280×800 Chromium, sabit zamanlı kareler + gerçek zamanlı; taşma 0. Gerçek telefonda
  denenmedi.
- Ertelenen: paletler (variants) yeni sanattan; font-fallback ölçümü; katalog kapak/klip yeniden yakalama (üretim build'i
  ister); eski `print/invitation_front.png`/`invitation_back.png` dosyaları duruyor.
