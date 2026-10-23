---
id: G430
baslik: Tasarım 30 Azulejo Mosaic — tema yeniden kurulumu (39 pilot yapısı, PAKET 5R parçaları)
rol: claude-kod
durum: bitti
alan:
oncelik: 2
bagimli: [G230, G423]
yazar: [platform/themes/azulejo-mosaic/, platform/tests/theme-azulejo-mosaic.test.ts, platform/previews/g430/, platform/lib/print/layouts.ts, platform/public/print/azulejo-mosaic/, platform/public/marketing/, platform/lib/marketing/, collections/30_Azulejo_Mosaic/package/, gorevler/G430-azulejo-mosaic-yeniden.md]
---

## Amaç
`docs/35_22_32_YENIDEN_TASARIM.md` §6: `platform/themes/azulejo-mosaic/` Codex'in `envelope-v3` kalıbından çıkarılıp
39 Silver Photo Booth pilotunun yapısıyla (`docs/34_TEMA_HATTI_40_48.md`) yeni GPT parçalarından baştan kurulur.
Pilot G423 (Velvet Jewel Box) örnek alınır.

## Girdiler
- `collections/30_Azulejo_Mosaic/DESIGN_BRIEF.md` + `collections/30_Azulejo_Mosaic/assets/gpt/GPT_PROMPTS.md` (her parçanın "Kullanım" satırı) + `parts/` (G230)
- Pilot dosyaları `platform/themes/silver-photo-booth/` ve `swan-chantilly-lace/`; standart `docs/11`, `docs/34`, `docs/35` §3

## Yapılacaklar
1. `kit_check --paket 5` + göz kontrolü; kusurları `docs/34` §4 yöntemleriyle çöz (çizim yok, K21).
2. `build_images.py` (alfa kutusu, arka katman kutusuna yerleştirme, `keyed_window`, manifest.stage ↔ site.css), `img/` ≤ 3 MB.
3. Şablonlar + `site.css` + `site.js` (`MOTION` ↔ CSS keyframe gecikmeleri aynı sayılar); kapak düzeni ve açılış `docs/35` §3.
   Kaldır: `envelope-v3.*`, `opening*`, `interior*`, `parts.css`, eski `v3-*/v4-*` görseller. Koru: slug, `theme.json` foto
   anahtarları, `content.demo.json`, kopya anahtarları (`node scripts/copy-manifest.ts --theme azulejo-mosaic --check`).
4. `variants.css` paletleri yeni sanattan; baskı düzeni PAKET 6R'ye (`lib/print/layouts.ts`, `build-print-assets`).
5. `tests/theme-azulejo-mosaic.test.ts` yeni yapıya göre; katalog kapak posteri + açılış klibi yeniden.
6. Göz kontrolü (`docs/34` §5): kapalı → açılış (300 ms aralık) → home/story/details/rsvp; 360/390/430 + masaüstü.

## Bitti sayılması için
- [ ] Tema testi + g085/g093/g094/g097/g138/g139/g150/g155/g175 + content testleri geçer
- [ ] Açılışta boş/düz renkli yüz yok; kapanış, kapak (gerçek iç yüz), kart, süzülen nesneler ayrı hareket ediyor
- [ ] Kapak düzeni: isimler ve Skip hiçbir dekorun altında değil; tarih · şehir + Tap to open
- [ ] Önizleme kareleri `platform/previews/g430/`; Sonuç yazılı; durum `coming`

## Sonuç
2026-10-22 (claude-kod, dal `claude/g430-azulejo-mosaic`): tema G423 pilotunun yapısıyla yeni PAKET 5R parçalarından
baştan kuruldu; Codex `envelope-v3` / `opening*` / `interior*` / `parts.css` / `variants.css` ve eski `img/` silindi.
- Zarf: dikey sır beyazı zarf (0,8927), basamaklı çini kapak, çapraz jüt sicim, gevşek kırlangıçlı karo. Açılış (3,7 s):
  düğüm gevşer → sicim üç parça kayar (dikey kol aşağı, kollar yanlara) → karo 3B döner (terrakota sırt) ve düşer →
  kapak gerçek `flap_in` astarına 3B açılır → köşelerdeki dörtlü karolar dalga hâlinde döner → zeytin yaprağı + yasemin
  süzülür → kart cebin arkasından yükselir, öne gelir → home. `MOTION` = CSS keyframe sayıları (test denetler).
- İç sayfalar: kireç taşı çini nişi (home), azulejo bordürlü çerçeveler (story sol–sağ–sol, teaser), geniş çini panosu
  (details); her foto "foto mozaiği"yle açılır (GPT karolar dönerken fotoğrafın parçalarını yerine taşır; çizim yok).
  Davet bandı cebin bordür çinileriyle kenarlı; imza terrakota saksı; RSVP gönderilince karo sırası döner.
- GPT kusurları: kapak arkadan ~%8 geniş (zarf kutusu = kapak genişliği; arka/cep yayıldı), karo istenenden ~%43 büyük
  (GPT'nin yerinde kullanıldı), story/venue pencerelerinde yeşil yok (pencere = çerçevenin çevrelediği delik), saksı
  sarmaşığında birkaç anahtar-yeşil piksel (yalnız onlar soldurulup `checks.green` boş). Ayrıntı: tema README.
- Ortak dosyalar: designs.ts (PREVIEW + REBUILT, UNIQUE_INTERIORS'tan çıktı) + tr/de/es/fr çevirileri, ses ipuçları,
  PAKET 6R baskı düzeni (kutular ölçüldü) + `public/print`, `katalog.py` eksenleri, demo fotoğrafları, Codex test
  fikstürlerinden çıkarıldı. İsim yedek yüzleri Arizonia için `font-fallback.ts` ile ölçüldü.
- Testler: tema testi 11/11; brief'teki set 90/91 (tek hata önceden var: marketing-content "claims we never make" —
  designs.ts satır 573 "hand-painted", benim değil); `tsc --noEmit` temiz. Seyrek checkout'ta çalışmayan testler
  (g085/g093/g094/g097/g139, content, test_recolor_parts'ın diğer koleksiyonları) entegratörde.
- Kareler 390×844, 360×740, 1280×800'de kontrol edildi (taşma 0). `platform/previews/g430/` yazılmadı (seyrek checkout,
  disk kuralı); son kare sayfası oturum scratch klasöründe. Kalan: katalog kapak/klibi yeniden yakalama, paletler
  (`variants`) yeni sanattan, gerçek cihaz denemesi. Durum `coming` / `preview`.

## Günlük
- 2026-10-22 entegratör onayladı
