---
id: G122
baslik: START HERE rehberi 20 tasarım (docs/19 Ek A, G100 paneli) + 01–05 ilan durum düzeltmeleri + docs/20 kapsayıcı metin
rol: claude-metin
durum: inceleme
alan: claude-G122
oncelik: 1
bagimli: [G091, G100]
yazar: [tools/build_customer_guides.py, tools/tests/test_build_customer_guides.py, collections/01_Olive_Ivory/package/customer/, collections/02_Dusty_Blue/package/customer/, collections/03_Blush_Garden_Rose/package/customer/, collections/04_Vintage_Airmail/package/customer/, collections/05_Lemon_Mediterranean/package/customer/, collections/06_Art_Deco_Noir/package/customer/, collections/07_Burgundy_Velvet/package/customer/, collections/08_Winter_Evergreen/package/customer/, collections/09_Lavender_Provence/package/customer/, collections/10_Tuscan_Vineyard/package/customer/, collections/11_Boho_Pampas/package/customer/, collections/12_Tropical_Destination/package/customer/, collections/13_Enchanted_Forest/package/customer/, collections/14_Ivory_Lace_Pearl/package/customer/, collections/15_Cherry_Blossom/package/customer/, collections/16_Sunflower_Rustic/package/customer/, collections/17_Emerald_Gold_Estate/package/customer/, collections/18_Wildflower_Vellum/package/customer/, collections/19_Midnight_Garden/package/customer/, collections/20_Coastal_Seaside/package/customer/, collections/01_Olive_Ivory/package/listing/, collections/02_Dusty_Blue/package/listing/, collections/03_Blush_Garden_Rose/package/listing/, collections/04_Vintage_Airmail/package/listing/, collections/05_Lemon_Mediterranean/package/listing/, docs/19_ALICI_YOLCULUGU.md, docs/20_ETSY_DUKKAN_KURULUMU.md, gorevler/G122-start-here-20.md]
---

## Amaç
Etsy'nin teslim ettiği tek dosya START HERE PDF'i. 01–05'te G091 metni vardı (G100 öncesi panel), 06–20'de hiç yoktu. 20 tasarımın
rehberi tek ortak kaynaktan (docs/19 Ek A), tek komutla, G100 paneline göre üretilsin; QR ve linkler doğrulansın. Yanında 01–05
ilanlarının eskimiş §0 satırları ve docs/20 dükkân metnindeki "envelope" cümleleri düzeltilsin.

## Girdiler
docs/19 §5 + Ek A (G091), G100 panel kaynağı (`platform/components/panel`, `platform/app/start`, `platform/lib/{panel,claim,theme}`),
`platform/lib/marketing/designs.ts` (açılış nesnesi, fontlar), `platform/themes/<id>/{theme.json,palette.json}`, `tools/make_qr.py`,
`tools/listing_kit.py` (qr_matches, pdf_text), `tools/etsy_upload.py` (20 tasarım tablosu), G123 görev dosyası (01–05 tutarsızlık
listesi, bölüm önerisi), docs/01 K33–K37, docs/10 §2, docs/20.

## Yapılacaklar
1. Ek A'yı G100 paneline göre güncelle; tasarıma özgü yerler yer tutucu (`{OPENING}`, `{LANGUAGE_FONTS}` …).
2. `tools/build_customer_guides.py`: 20 tasarım, `--designs`, `--check`, `--base-url`; QR yalnız `make_qr.py`; denetim (Ek A eşitliği,
   panel etiketleri kaynakta, QR modül modül + jsQR raster, PDF linkleri).
3. 20 × `START_HERE.md/.pdf` + `img/start_qr.{png,svg}` + `img/start_qr_page.png`; sayfaları görüntüye çevirip bak.
4. Canlı başlat linkleri.
5. 01–05 `listing_v3.md`: §0, dil satırı, 02/04/05 §6 video, §11; `etsy_upload.py --designs 01-05` ve `--check`.
6. docs/20: duyuru/hikâye kapsayıcı, §3'e 06–20, §7'ye "Etsy'de yeniden girilmeli".

## Bitti sayılması için
- [x] `python3 tools/build_customer_guides.py --check` 20/20 OK (2026-10-16, ~4 dk, jsQR dahil)
- [x] 20 PDF'in bütün sayfaları görüntüye çevrilip gözle okundu (75 dpi, 2×2 temas sayfaları, 140 sayfa); jsQR okuması 150 dpi
- [x] `python3 tools/tests/test_build_customer_guides.py`, `test_listing_kit.py` yeşil
- [x] `python3 tools/etsy_upload.py --check` 20/20 kural sorunu yok
- [ ] `python3 tools/tests/test_etsy_upload.py` — 06–20 `etsy_upload.json` eskidi (yazma alanım dışında; aşağıda)
- [ ] Gerçek telefonla QR okutma ve G100'lü canlı yayında rehber adımlarının denenmesi

## Sonuç
**Yeniden üretim (tek komut):** `python3 tools/build_customer_guides.py` (20 tasarım, üretim + denetim, ~4 dk);
`--designs 06-20` seçim; `--check` yalnız denetim; `--base-url https://…` ya da `GUIDE_BASE_URL` alan adı kararından sonra;
`--no-raster` jsQR'sız hızlı denetim. Panel etiketi değişirse (ör. G121) `--check` eski etiketi adıyla gösterir: Ek A düzeltilir,
komut yeniden koşulur. Aynı girdi → bayt bayt aynı PDF (`invariant`).

**Çıktı.** 20 tasarımın her biri 7 sayfa, 49–57 KB. PDF'teki linkler yalnız başlat linki (metin + QR) ve `/privacy`. QR:
`make_qr.py` (segno, EC Q, scale 20), koyu renk `palette.json`'daki en koyu ≥ 7:1 renk (06 `#0E1626`, 17 `#0B3528`, 19 `#0B0A0D`,
diğerleri `ink`). jsQR (platform devDependency): `start_qr.png`, `start_qr_page.png` ve PDF'in 7 sayfasının hepsi; her PDF'te tam bir
QR = başlat linki (11'in 6. sayfasında jsQR boş bir okuma veriyor, QR yok; "empty reading ignored" diye raporlanıyor). Segno ile modül
modül eşleşme 20/20. 84 kalın/tırnaklı panel etiketinin hepsi kaynakta bulundu. 01–05 QR dosyaları bayt bayt aynı kaldı.

**Ek A (docs/19).** G100: tek işli kurulum 1. adım (adlar + tarih; saat dilimi telefondan, **Change**; **Learn more**), yayın sonrası
**Your website is live** (link + **Copy link** / **Open website** / **Share**; QR **More ways to share** altında; **Next, if you like**,
**Go to my editor**), "Sample" etiketi yok (italik, kesik çerçeve; **Go to the first one**), **Before you publish** listesi,
Guests: **Guest list** (All/Coming/Not coming/New, Download/Add/Print/Refresh, **Mark as seen**, **Held** / **Keep this reply**) +
ayrı **Results**; Step 8 **Keep it / Hide it**; Help & questions. Yer tutucular: `{DESIGN_NAME}`, `{START_URL}`, `{PRIVACY_URL}`,
`{OPENING}` (06 ve 14 gatefold, 09 pouch, 12 wallet, 13 book, 18 sleeve, diğerleri envelope), `{LANGUAGE_FONTS}` (fontların Google
Fonts alt kümelerinden 3 cümle: Kiril dahil 01/03/19; latin-ext; bir font yalnız latin 04/06/11/13/18). §5 20 tasarımlı tabloyla
yeniden yazıldı.

**Canlı (2026-10-16, Vercel bağlayıcısı; `curl` vekilde 403).** 20 × `/start?theme=<id>` → 200, "Design: <ad>" + form;
`/privacy` → 200; 01–05 `/start/demo/<id>` → 200, doğru `data-theme`. Production `dpl_HKT1NRKp895wEVEUbGKdzJCqU4RW` = `b952bc8`,
**G100'ü içermiyor**: rehber depodaki paneli anlatıyor; G100'lü yayından önce alıcıya verilmemeli (docs/19 §5, 01–05 §0/§11).

**01–05 ilanları.** §0: başlat/demo canlı (2026-10-16), G079 canlı ama G100 değil, sipariş onayı satırı 06 ile aynı (K34 ve kayıt
çelişkisi), yanıt süresi/iade kararlı (K37/K36), fiyat/uzatma/adet/yenileme açık, dükkân STUDIOBKE, font satırı (Google Fonts CSS
2026-10-16), START HERE G122. Dil satırı: 01/03 Kiril cümlesi kaldı; 02 ve 05 latin-ext cümlesi (Pinyon Script / Allura Kiril'siz);
04 latin cümlesi (Homemade Apple yalnız latin). 02/04/05 §6: `video.mp4` var (12.5 / 14.5 / 13.2 s, 1080², H.264, sessiz; ilk ve son
kare karşılaştırıldı). §4 dijital dosya boyutu güncel. §11 yeni satırlar. `etsy_upload.py --designs 01-05` yeniden üretildi.

**docs/20.** §1.3 duyuru "Guests open your invitation", §2.2 hikâye "a closed envelope, gatefold or keepsake (each design has its own)";
karakter sayıları 759 / 819; §1.1 tagline'a not (değişmedi, kullanıcı kararı); §3 06–20 G123 önerisiyle (10/5/5); §0 G100 notu;
yeni §7.6: iki alan Etsy'de yeniden girilmeli (`claude-tarayici`).

**Açık kalanlar.**
- 06–20 `etsy_upload.json`: PDF artık var → `digital_files.bytes` ve "digital file missing" blocker'ı eskidi;
  `python3 tools/etsy_upload.py --designs 06-20` koşulmalı (yazma alanım dışı). O zamana kadar `test_etsy_upload.py` 06'da düşer.
- 06–20 `listing_v3.md` §0 "START HERE guide: Not produced" satırı ve §11 kutusu eskidi (G123 alanı).
- docs/19 §0 (G079 notu) ve §1 tablo dil satırı Ek A/§5 dışında, güncellenmedi.
- Önizleme sekmesinin adı her tasarımda **Envelope** (`PAGE_LABELS`); zarfsız 6 tasarımda rehber açıklıyor. Tema 12'nin `home_replay`
  metni "Open the envelope again" (G123 bulgusu).
- Gerçek telefonla QR okutma yapılmadı; alan adı geçici (karar sonrası `--base-url` ile yeniden üretim).

## Günlük
- 2026-10-16 alındı (claude-G122, alt-ajan, worktree; taban `claude/zealous-fermi-hy1o40` `9a90aa2`: G123, G125, G100 içinde) ve
  incelemeye gönderildi.
