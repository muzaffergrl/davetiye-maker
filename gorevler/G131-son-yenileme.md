---
id: G131
baslik: Yayın öncesi son yenileme — START HERE rehberleri (G126–G130 panel bölümleri) + ilan görselleri (G129 S logosu)
rol: claude-kod
durum: inceleme
alan: claude-G131
oncelik: 1
bagimli: [G122, G124, G126, G127, G128, G129, G130]
yazar: [docs/19_ALICI_YOLCULUGU.md, tools/build_customer_guides.py, tools/listing_editorial.py, tools/listing_editorial/, tools/etsy_upload.py, tools/tests/, collections/01_Olive_Ivory/package/customer/, collections/02_Dusty_Blue/package/customer/, collections/03_Blush_Garden_Rose/package/customer/, collections/04_Vintage_Airmail/package/customer/, collections/05_Lemon_Mediterranean/package/customer/, collections/06_Art_Deco_Noir/package/customer/, collections/07_Burgundy_Velvet/package/customer/, collections/08_Winter_Evergreen/package/customer/, collections/09_Lavender_Provence/package/customer/, collections/10_Tuscan_Vineyard/package/customer/, collections/11_Boho_Pampas/package/customer/, collections/12_Tropical_Destination/package/customer/, collections/13_Enchanted_Forest/package/customer/, collections/14_Ivory_Lace_Pearl/package/customer/, collections/15_Cherry_Blossom/package/customer/, collections/16_Sunflower_Rustic/package/customer/, collections/17_Emerald_Gold_Estate/package/customer/, collections/18_Wildflower_Vellum/package/customer/, collections/19_Midnight_Garden/package/customer/, collections/20_Coastal_Seaside/package/customer/, collections/01_Olive_Ivory/package/listing/, collections/02_Dusty_Blue/package/listing/, collections/03_Blush_Garden_Rose/package/listing/, collections/04_Vintage_Airmail/package/listing/, collections/05_Lemon_Mediterranean/package/listing/, collections/06_Art_Deco_Noir/package/listing/, collections/07_Burgundy_Velvet/package/listing/, collections/08_Winter_Evergreen/package/listing/, collections/09_Lavender_Provence/package/listing/, collections/10_Tuscan_Vineyard/package/listing/, collections/11_Boho_Pampas/package/listing/, collections/12_Tropical_Destination/package/listing/, collections/13_Enchanted_Forest/package/listing/, collections/14_Ivory_Lace_Pearl/package/listing/, collections/15_Cherry_Blossom/package/listing/, collections/16_Sunflower_Rustic/package/listing/, collections/17_Emerald_Gold_Estate/package/listing/, collections/18_Wildflower_Vellum/package/listing/, collections/19_Midnight_Garden/package/listing/, collections/20_Coastal_Seaside/package/listing/, gorevler/G131-son-yenileme.md]
---

## Amaç
Yayın öncesi son tur: 20 tasarımın START HERE rehberi panelin yeni bölümlerini anlatsın (G126 müzik, G127 harita, G128 yanıt
formu + Excel + Google Sheets, G130 ek hizmet satırı) ve ilan görselleri G129'un S logosunu taşısın. Platform koduna dokunulmaz;
Etsy'ye bir şey yüklenmez.

## Girdiler
`docs/19_ALICI_YOLCULUGU.md` Ek A, `gorevler/G126…G128` Sonuç etiket tabloları, G130 panel Help cümlesi
(`platform/components/panel/views.tsx`), `brand/svg/bke-logo-horizontal-{anchor,reverse}.svg` (G129), `tools/listing_editorial.py`
(docs/21), G124'ün ekran önbelleği (`--shots-root`, depo dışı).

## Yapılacaklar
1. Ek A: Map and directions, Music and sound, Reply form, Download Excel / CSV, Google Sheets ("coming soon" hâli), Quick answers ve
   sorun giderme, Help'te G130 satırı; Edit tablosu satırları. `build_customer_guides.py` + `--check` (etiketler kaynakta).
2. Logolu ilan görselleri (03, 05, 06, 07) 20 tasarımda yeniden; `etsy_upload.py` + `--check --strict`.
3. Birleşik dalda kırık iki test: `test_etsy_upload.py::test_check_exit`, `test_build_customer_guides.py::test_labels`.

## Bitti sayılması için
- [x] 20 rehber Ek A'dan yeniden üretildi; `build_customer_guides.py --check` 20/20 (raster dahil)
- [x] 20 × 4 logolu görsel S logosuyla; 01, 09, 17 gözle
- [x] `etsy_upload.py --check --strict --designs 01-20` 20/20; `test_etsy_upload.py`, `test_build_customer_guides.py`,
      `test_listing_editorial.py` yeşil
- [ ] G126–G128 + G130'lu yayın canlıya çıkıp rehber `--check` yeniden geçince alıcıya verilir

## Sonuç
**2026-10-16 · claude-G131 — durum: inceleme.** Dal `g131-son-yenileme` (taban `claude/zealous-fermi-hy1o40` `614b8d4`, G130 dahil).
Push, yayın, platform kodu değişikliği yok.

**START HERE (20).** Ek A'ya kaynak etiketleriyle: *Map and directions* (Edit → Day & place → Venue: Map link, Map & directions,
Show map / Show directions, Preview map, Add a reception place, Remove this place; misafir "Show map" deyince Google Maps yüklenir,
Google Maps / Apple Maps / Waze), *Music and sound* (Edit → Our Story → Music & sound: Story music, 4 parça, Your own music —
MP3/M4A, 10 MB'a kadar, yalnız hakkı olan müzik —, No music, Listen, Choose a file, Sound effects; misafirde ses düğmesi ve
"Play music"), Step 7'de *Reply form* (Always required, Required / Optional, Your questions, Add a question, Choices · Yes / No ·
Short answer · Long answer · Number, en çok 10), *Download Excel* + *Download CSV* ("Download list" kaynakta yoktu, `--check` bunu
yakalıyordu), *Google Sheets* (Connect Google Sheets, Open sheet, Sync now, Disconnect; "Google Sheets: coming soon" görünürse
bağlantı henüz açık değil → Download Excel), Help'te G130 satırı ("Prefer us to do it? …", paneldeki cümle). Edit tablosunda
Day & place / Our Story / RSVP satırları, Quick answers'ta müzik "Yes", iki sorun giderme satırı. Rehber 7 → 9 sayfa.
`build_customer_guides.py`: etiket kaynağına `lib/{audio,rsvp}`, `lib/maps.ts`, `public/audio/audio.js`, `public/static/map.js`
eklendi (parça adları, cevap türleri, "Play music" önceki kaynaklarda yoktu). ♪ işareti rehberde yok (PDF'in Helvetica'sı basamaz).
`--check` (raster/jsQR dahil) **20/20**.

**İlan görselleri.** Logo yalnız 03, 05, 06, 07'de (alt bant); 20 × 4 yeniden. Ayrıca editör ekranları (b04 kurulum, e01 Edit,
p01 Guests) G124 önbelleğinde eski K logolu ve "Download list"li olduğu için yerel üretim derlemesinden (`npm ci && npm run build`,
`capture.ts`, canlıya bir şey gitmez) 20 tasarımda yeniden yakalandı; yalnız bu üç ekran önbelleğe kondu, 04/05/07 yeniden
birleştirildi. Toplam 100 PNG değişti (03–07); 01, 02, 08 ve videolar logo içermediği için aynı. Göz: 01, 09, 17 (logo S; 17'de
koyu zeminde açık logo; yerleşim bozulmadı). Font uyarısı (`document.fonts.check` 400 ağırlık) yanıltıcı: görseller Cormorant +
Montserrat ile çiziliyor (önceki kareyle aynı).

**Testler / denetimler.** `etsy_upload.py --check` 0; `--check --strict --designs 01-20` 20/20 (0); `--check --strict` (hizmetler
dahil) **1**: üç hizmet ilanının görselleri ve teslim PDF'i yok (G130, beklenen). `test_etsy_upload.py::test_check_exit` artık
hizmetlerin eksik dosyalarını da sayıyor (strict'te blocker) ve `--designs 01-20` / `services` ayrı doğruluyor; hizmet özet satırı
görsel/dosya durumunu ve "strict: files missing"i yazıyor. `test_build_customer_guides.py` (test_labels: yeni kaynaklar + bozuk
etiket yakalama), `test_etsy_upload.py`, `test_listing_editorial.py` yeşil.

**Açık.** (1) İlan metinleri (`listing_v3.md` / `etsy_upload.json` açıklaması) hâlâ "No music", "up to 3 questions", "CSV" diyor;
8. görsel "Up to 3 questions, download as CSV" (doğru ama eksik). G126–G128 canlıya çıkınca etsy-metin işi. (2) Rehber G126–G128 +
G130'u anlatıyor; canlı bunları içermeden alıcıya verilmez. (3) Google Sheets gerçek hesapla denenmedi (G128). (4) Hizmet ilanlarının
görselleri + PDF'leri (strict 1). (5) İlan görsellerindeki misafir ekranları G124'ten (G126 ses düğmesi yok) — bilerek dokunulmadı.

## Günlük
- 2026-10-16 claude-G131: rehber + görseller + iki test; incelemeye
