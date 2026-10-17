---
id: G129
baslik: BKE Studio logosunda K sembolü yerine S — SVG izleme, site/panel/favicon/uygulama ikonları, Etsy ikonu, rozet, desen
rol: claude-kod
durum: bitti
alan: claude-G129
oncelik: 1
bagimli: [GM08]
yazar: [brand/svg/, brand/badge/, brand/etsy/bke-shop-icon.svg, brand/etsy/etsy_shop_icon_500.png, brand/etsy/etsy_shop_icon_1000.png, brand/proofs/, brand/README.md, platform/public/brand/, platform/lib/marketing/brand.ts, platform/components/panel/Brand.tsx, platform/components/marketing/marketing.module.css, gorevler/G129-logo-s.md, gorevler/GM08-logo-s.md]
---

## Amaç
Kullanıcı isteği (2026-10-16): logoda K yerine S, her yerde. GM08'in GPT çıktıları (`brand/assets/gpt/final_s/`) izlenir (K21);
"BKE Studio" yazısı, renkler ve "The Reveal" fikri değişmez.

## Yapılacaklar
1. S sembolünü vektöre izle; `brand/svg/` altındaki bütün sembollü dosyaları aynı adlarla güncelle; eski K'li SVG'ler
   `brand/svg/_k_eski/`'ye. 16/32 px provası `brand/proofs/`.
2. Kullanım yerleri: `platform/public/brand/` (başlık/alt bilgi logoları, favicon, apple-touch, manifest ikonları, desen),
   `brand.ts`, panel/admin logosu, rozet; START HERE ve ilan araçlarında logo kullanımı kontrolü.
3. Etsy: dükkân ikonu (500/1000 + SVG) `shop_icon_s.png`'den; banner'larda sembol varsa not.
4. `brand/README.md`, bu dosya, GM08 günlüğü.

## Bitti sayılması için
- [x] 16 sembollü SVG S ile (yatay/dikey/sembol/küçük sembol × anchor/reverse/black/white); yazı birebir aynı; eskiler `_k_eski/`
- [x] Site başlığı/alt bilgisi, panel/admin/start logosu, favicon seti, uygulama ikonları, manifest, rozet, desen S ile
- [x] Etsy dükkân ikonu S ile; banner durumu not edildi
- [x] Typecheck + değişen yerlerin görüntüleri + ilgili Python testi (kullanıcı isteği: tam test süiti yok)

## Sonuç

**İzleme (K21).** Potrace 1.16 kuruldu. Her sürüm kendi GPT PNG'sinden izlendi; GPT her dosyada kareyi biraz farklı çizdiği
için oranlar korundu. Oranlar: sembol 1,097, küçük sembol 1,081, yatay logodaki 1,19, dikeydeki 1,105.

Temizleme:
- Kare, ölçülen kenarlarda dikdörtgen.
- Kesik ve altın kama, kenar piksellerine uydurulan üç düz çizgi (GPT çizgileri ≤ 1,7 px eğriydi). Kesiğin yuvarlak ucu,
  kamanın ucuna düz kirişle kapatıldı.
- S: potrace eğri kipi (×4 maske, hafif yumuşatma); 0,2–0,4° eğik yatay/dikey kenarlar düzeltildi.

Kaynak alfa maskesine en büyük sapma: yatay sembol 1 px, dikey 2 px, sembol 3 px, küçük sembol 3 px. 1 px'i aşanlar yalnız kesik
ucunda ve düzeltilen çizgilerde; p99 ≤ 2,2 px.

**Dosyalar:**
- `brand/svg/`: 16 dosya.
  - Sembol ve küçük sembol için `-reverse` yeni. Artık iki renkli sembolde altın kama var; tek renkte kama gövdeye katılır.
  - Logo yazısı `_k_eski/` dosyalarından aynen alındı, yalnız viewBox kayması uygulandı. Doğrulama: yatayda 834, dikeyde 654
    koordinat birebir aynı.
  - Yatay viewBox 1308,08 × 225 (eski 1305,83 × 216,88). Dikey viewBox 767,32 × 554,88; sembol GPT'nin yeni yerleşimindeki
    gibi büyüdü, yazının ortasına hizalandı.
  - 14 eski dosya `brand/svg/_k_eski/` altında (git mv).
- `platform/public/brand/`:
  - Logo kopyaları değişti.
  - Favicon (`icon.svg`, `favicon.ico` 16/32/48, `favicon-16/32.png`): küçük S sembolü, boşluklar kâğıtla dolu. PNG'ler
    piksel ızgarasına oturtuldu; eski %3 esnetme yok.
  - `apple-touch-icon.png`, `icon-192/512.png`: GPT'nin yeni dükkân ikonu düzeni (patlıcan zemin, kâğıt S, altın kama). En uzak
    nokta merkezden %32,4, maskable dairesinin içinde.
  - `pattern_tile.png`: GPT karosunun 4×4 ızgarası korunarak K yerine S'nin tek renk yolu kondu. Yeni çizim değil; istenirse
    GPT'den S'li karo istenir.
- `platform/lib/marketing/brand.ts`: `logoBox` 1308,08 × 225 ve yorumlar. `components/panel/Brand.tsx`: `MARK_RATIO` 780,5 / 722.
  `marketing.module.css`: yalnız iki yorum satırı.
- Panel, admin, /start, /my, /signin ve "link not valid" sayfaları aynı `BrandLogo` bileşenini kullanır; dosya adları aynı
  kaldığı için kod değişikliği gerekmedi.
- `brand/badge/made-with-bke-studio-{light,dark}.svg`: sembol yolu S, yükseklik aynı (24 birim).
- `brand/etsy/bke-shop-icon.svg`, `etsy_shop_icon_500.png`, `_1000.png`: `shop_icon_s.png`'den; GPT'nin konum ve ölçüsü korundu,
  daire kırpımına uygun.
- Provalar:
  - `brand/proofs/s_svg_proof.png`: bütün sürümler, 16/24/32/48 px, açık/koyu zemin, eski K ile yan yana.
  - `brand/proofs/s_favicon_proof.png`: sekme çubuğu, ×8.
  - `brand/proofs/s_site_proof.png`: yerel `next dev --webpack`. Başlık 36 px, alt bilgi, /start çubuğu, masaüstü hero deseni;
    `/` ve `/start` 200, logo `naturalWidth` 1308.

**Testler (kullanıcı isteğiyle azaltıldı):**
- `tsc --noEmit` temiz.
- `tools/tests/test_listing_v2.py`: 7 geçti.
- Tam `npm test` ve tarayıcı süitleri koşulmadı.

**Logo kullanan ama yeniden üretilmeyen yerler:**
- START HERE PDF'leri: `tools/build_customer_guides.py` logo kullanmıyor (yalnız "BKE Studio" düz metni), yeniden üretilmedi.
- İlan araçları: `tools/listing_v2/build.py` (`LOGO_SVG`) ve `tools/listing_editorial.py` (`BRAND_MARK`),
  `brand/svg/bke-logo-horizontal-anchor.svg`'yi yoldan okur. Yeniden üretimde S'li logo kendiliğinden gelir. Mevcut ilan
  görselleri (K'li) yeniden üretilmedi; koordinatör ayrıca yaptıracak.
- `platform/previews/` içindeki eski ekran görüntüleri K'li kaldı (geçmiş kayıt).

**Açık kalanlar:**
- Etsy banner'ları (`brand/etsy/etsy_banner_big_3360x840.jpg`, `etsy_banner_mini_1600x213.jpg`): sahnedeki mum mühürlerde K var
  (fotoğrafik GPT sahnesi `brand_scene_wide.png`). S'li sahne GPT'den gerekir; Claude üretmedi.
- `brand/assets/gpt/final/seal_badge.png`, `brand_scene_wide*.png`, `brand/listing/comps/`, `brand/ui/` ve `brand/trust/`:
  GPT comp/kaynak dosyaları. Üretimde kullanılmıyor; K'li olabilir, dokunulmadı.
- GM08 açık maddesi geçerli: GPT PNG'lerinde ton/doku farkı var. SVG'de token renkleri kullanıldığı için çıktıyı etkilemiyor.
- İzleme betikleri repoya eklenmedi (yöntem README'de).

## Günlük
- 2026-10-16 açıldı ve alındı: claude-G129 (alt-ajan, worktree; taban `claude/zealous-fermi-hy1o40` e9895dd)
- 2026-10-16 bitti, incelemeye gönderildi
- 2026-10-17 entegratör onayladı
