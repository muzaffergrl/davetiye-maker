# 351 GPT görseli — bağımsız kontrol (Claude, 2026-10-20)

Kaynak: `codex/generated-visuals-2026-10-20` (22bece5c, "G179: import 351 generated visuals and record QA"); bu dala
birleştirildi. Codex'in kaydı (`manifest.json`): 319 hazır, 32 düzeltme. Bu kontrol aynı dosyaları yerleştirme aracının
kurallarıyla (`tools/gpt_yerlestir.py --klasor`, kuru: oran, şeffaflık, kenar alfası, #00FF00 pencere) ve gözle (temas
sayfaları) yeniden denetledi.

## Sonuç
- **317 geçti, 34 reddedildi.** Reddedilenler hedef yoldan `reddedilen/` klasörüne (indirme adıyla) taşındı; böylece
  `docs/26` / `docs/27` onları yeniden **eksik** sayar (GPT listesi: 34). Codex'in geçirdiği 2 + ilk kayıttaki farklılıklar:
  kenarı kesik/zemini dolu parçalar (33 flap, mehndi_pattern, sleeve; 34 envelope_pocket, veil_inner, veil_outer; 35
  envelope_front, flap; 36 ferns; 37 petal_centre, petal_right; 38 bougainvillea, envelope_pocket).
- Ret nedenleri: **13** nesne kenardan kesik / zemin dolu · **10** #00FF00 foto penceresi ChatGPT'nin şeffaf zemin
  işleminde silinmiş (pencere şeffaf delik olmuş) · **10** oran tutmuyor (1600×300, 2400×160 gibi çok geniş/ince şeritler;
  ChatGPT yalnız 1:1, 3:2, 2:3 veriyor) · **1** palet (21 V07 rose-branch: opak istenmişti, şeffaf pikselli).
  Hepsi 33–38 (satışta değil) ve bir palet görseli; 01–32'de ret yok.
- Gözle: 22–32 baskı zeminleri (24) orta alan boş, yazı yok, yeni site görünümüyle uyumlu (süsler istenenden sade);
  22–32 ilan sahneleri (55) yeşil ekranlar düzgün, yazı/logo yok, tasarım dünyaları tutarlı; örnek fotoğraflar (85) aynı
  çift her tasarımda tutarlı, yazı yok; 33–38 geçen parçalar düzgün (34 `xi_gold` 囍 karakteri prompt'un istediği).
- **Çözünürlük:** 114 dosya istenen ölçünün altında (ChatGPT çıktısı en çok ~1536 px). Önemli olan:
  01–21'in 42 "2× baskı parçası" **1024×1536** geldi — amaçları 2048×3072 ile 300 ppi'ye çıkmaktı; bugünkü parçalarla
  aynı çözünürlükte oldukları için **bağlanmadı** (kazanç yok; dosyalar `parts/*_print.png` olarak duruyor). 22–32 baskı
  zeminleri ~1059×1486 → 5×7'de ~200 ppi (01–21'in bugünkü ~230 ppi'sine yakın).

## Bağlananlar
- 22–32 baskı zeminleri → `platform/lib/print/layouts.ts` (11 blok: `sources` front/back, `cover`, koyu mürekkep 22/23,
  kutular `[19,13,17,13]` / `[14,12,9,12]`), `build-print-assets` 11 tema, eski `public/print/<tema>/` dosyaları silindi.
  `tests/g149-print-layout.test.ts` 38 tasarım × 5×7 + A5 yeşil; 4 tasarımda örnek PDF'e göz atıldı.

## Bağlanmayan (sonraki iş)
- 22–32 ilan sahneleri → ilan görselleri (`tools/listing_editorial.py --capture`, üretim build'i ister; tasarımlar preview).
- 22–32 örnek fotoğraflar (isteğe bağlı; demolar ortak örnek fotoğrafları kullanıyor; `build_images.py` emekli → elle).
- 33–38 website parçaları: 34 ret düzelince `gpt_yerlestir.py --koleksiyon 33-38 --uygula`.
- 16 paletleri (15 görsel geçti): `recolor_parts.py build --design 16` + göz kontrolü.

## Teknik düzeltme (kullanıcı onayı, 2026-10-20) — çizim yok
Kullanıcı: "onay, teknik işlemleri sen yap". 19 ret yalnız teknik işlemle düzeltildi ve yerleştirildi
(`gpt_yerlestir.py --klasor … --uygula`: 19/19 geçti). Ham GPT çıktıları `reddedilen/` klasöründe aynı adla duruyor.
- **Oran (9):** 33 garland, tassel · 34 peony_band · 35 heather_divider, strap · 36 herbarium_label, orchid_sprig, twine ·
  37 whiplash. Saydam kenarlardan kırpıldı, saydam pay eklenerek istenen orana getirildi; piksel ölçeklenmedi (tema
  build'leri parçaları zaten `trim` ediyor).
- **Pencere (9):** 33/35/36/37 card_small · 36 specimen_frame · 37 arch_window · 38 frame_1, frame_2, frame_wide.
  ChatGPT'nin saydam deliğe çevirdiği foto penceresi (çerçevenin içindeki kapalı saydam bölge) #00FF00 ile dolduruldu;
  kıyıdaki yarı saydam pikseller yeşilin üstüne bindirildi (hale yok, gözle bakıldı).
- **Bant (1):** 38 embroidery_band — 1536×1024 tuvalden bant satırları (iki dikiş çizgisi dahil, 1536×130) kesildi,
  2400×160 oranına kendi başından devam ettirilerek tamamlandı (sitede zaten yatay tekrar).

Kalan (ChatGPT'ye, prompt'lara "RETRY NOTE" eklendi): 13 kenarı kesik parça (33 flap, mehndi_pattern, sleeve · 34
envelope_pocket, veil_inner, veil_outer · 35 envelope_front, flap · 36 ferns · 37 petal_centre, petal_right · 38
bougainvillea, envelope_pocket) + 36 copper_tag (penceresi hiç yok). 21 V07 gül dalı aslında uygun (şartname yanlıştı:
referans gibi saydam) ama "Ivory Rose" paleti istenmediği için `beklemede/`.
