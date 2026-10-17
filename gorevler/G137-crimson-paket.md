---
id: G137
baslik: 21 Crimson Rose Atelier — Etsy paketi (ilan metni, START HERE, ilan görselleri, video)
rol: claude-kod
durum: inceleme
alan: claude-G137
oncelik: 1
bagimli: [G133]
yazar: [collections/21_Crimson_Rose_Atelier/package/, collections/21_Crimson_Rose_Atelier/palette.json, collections/21_Crimson_Rose_Atelier/assets/gpt/GPT_PROMPTS.md, tools/etsy_upload.py, tools/build_customer_guides.py, tools/listing_kit.py, tools/listing_editorial.py, tools/listing_editorial/opening_stills.json, tools/listing_templates/capture.ts, tools/tests/test_etsy_upload.py, tools/tests/test_build_customer_guides.py, tools/tests/test_listing_editorial.py, tools/tests/test_listing_kit.py, docs/21_ILAN_GORSELLERI.md, gorevler/G137-crimson-paket.md, gorevler/G821-mockup.md]
---

## Amaç
G133'ün yeni tasarımı 21 Crimson Rose Atelier için 01–20'deki Etsy paketinin aynısı: `listing_v3.md` + `etsy_upload.json`
(fiyat 1,460 TL, adet 999, G132'nin müzik/harita/10 soru/Excel/Sheets cümleleri ve VERIFY notları), START HERE (gerçek QR),
8 ilan görseli + video. Satış durumu `coming` kalır; tema koduna dokunulmaz. Taban: `origin/codex/crimson-rose-atelier` (`d41daf7`).

## Girdiler
`collections/20_Coastal_Seaside/package/listing/listing_v3.md` (kalıp), `platform/themes/crimson-rose-atelier/` (README, theme.json, sayfalar),
`platform/lib/marketing/designs.ts` (açılış: envelope), `docs/21_ILAN_GORSELLERI.md`, `docs/19` Ek A, `gorevler/G124-ilan-gorselleri-20.md`.

## Bitti sayılması için
- [x] `listing_v3.md` (başlık 113/140, 13 etiket ≤ 20) ve `etsy_upload.json`; §0'da "tasarım satışa açılmadı (coming)"
- [x] START HERE: `build_customer_guides.py --designs 21` ve `--check` OK (9 sayfa, jsQR başlat URL'sini okuyor)
- [x] Araçlar 21'i tanıyor (`etsy_upload.DESIGNS`, `listing_kit.THEMES`, `opening_stills.json`, `FONT_SUBSETS` Manrope)
- [x] 8 ilan görseli: **8/8** (3, 5, 6, 7 ilk turda; 1, 2, 4, 8 G821 sahneleriyle ikinci turda)
- [x] Video (1080 × 1080, H.264, sessiz, 12.1 sn)
- [x] `etsy_upload.py --check --strict --designs 21`: **çıkış 0** (images 8/8, video, guide)
- [x] `test_etsy_upload.py`, `test_build_customer_guides.py`, `test_listing_editorial.py` (+ `test_listing_kit.py`) yeşil

## Sonuç
**Görseller 1, 2, 4, 8 (ikinci tur, 2026-10-17).** G821 sahneleri gelince `listing_editorial.py --theme 21 --capture --only 01_cover 02_opening 04_edit 08_included` (yerel üretim derlemesi, dal `claude/zealous-fermi-hy1o40`; video yeniden üretilmedi); dördü gözle: ekranlar yeşil alanlara oturuyor, yazı taşması yok, adlar Olivia & James. listing_v3 §0/§5/§10/§11 güncellendi, VERIFY notları kalktı; `test_listing_kit` `pending` istisnası silindi. Önceki blokaj notu: bu dört görsel tasarımın kendi GPT sahnelerine (elde telefon, üç telefon, iki elde telefon, masa
üstü; `assets/gpt/mockups/`, yeşil ekranlı) kurulur; 21'de yalnız `design-board.png` var. Claude sahne çizmez (K21); 07'nin bordo
sahnelerini (dalya, böğürtlen, kadife) kullanmak 21'i 07'ye benzetirdi, kullanılmadı. PAKET 3 prompt'ları
`tools/paket3_sahne.py`'nin metniyle `GPT_PROMPTS.md`'ye eklendi (zemin/süs elle: krem pamuk kâğıt örtü, traverten, kızıl güller,
altın mühürlü bordo zarf); GPT görevi `gorevler/G821-mockup.md` (hazır). Sahneler gelince tek komut:
`python3 tools/listing_editorial.py --theme 21 --capture --video`, sonra §0/§5/§11 ve `python3 tools/etsy_upload.py --designs 21`.

**Üretilen.** `images_editorial/` 03, 05, 06, 07 + `video.mp4` (yerel üretim derlemesi; canlıya bir şey gitmedi). Açılış kareleri
gözle seçildi: 1200 ms (kapak açık, kart yok) ve 2400 ms (kart en yüksekte); ~3350 ms'de sayfa ana sayfaya geçiyor. Gözle: dört
görsel ve videodan 3 kare + üç açılış karesi; boş/bozuk ekran, taşan yazı, yanlış ad yok. Video ilk/son kare ortalama farkı ~5/255.
START HERE 9 sayfa; QR `start?theme=crimson-rose-atelier` (tasarım canlıda olmadığı için bağlantı deploy'a kadar açılmaz; §0'da yazılı).

**Araç değişiklikleri (küçük, eklemeli).** `etsy_upload.DESIGNS` + `listing_kit.THEMES` 21; `designs.ts` girdisi tırnaklı anahtarla
yazıldığından açılış/font regex'leri iki yazımı da okuyor; `FONT_SUBSETS` Manrope (latin-ext + Cyrillic, 2026-10-17 Google Fonts CSS);
`palette.json` temanın `site.css` renklerinden; editoryal kâğıt dokusu `parts/bg_tile.png` yoksa `textures/paper-background.png`;
`capture.ts`: `data-slot="venue"` yoksa `img[data-photo="venue"]`, ve demo kaydı temanın kendi fotoğraflarını taşıyorsa 03'ün yedek
fotoğrafları yerine onlar (ilk çekim 03'ün çiftini gösterdi, düzeltildi). Testler 21 tasarıma; 21'in yarım seti ve sahnesizliği
açıkça istisna (`test_listing_editorial` 8'den eksik yalnız sahneli dört görsel ve sahne yoksa; `test_listing_kit` `pending` G821).

**Açık.** G821 sahneleri ve 4 görsel; satış onayı ve fiyat (`config.ts` `[PRICE]`); deploy; gerçek telefon; görsel onayı (kullanıcı).

## Günlük
- 2026-10-17 alındı (claude-G137, alt-ajan, dal `g137-crimson-paket`); 4/8 görsel + video + metin + rehber; incelemeye gönderildi.
- 2026-10-17 ikinci tur (claude-G137, alt-ajan, dal `g137b-crimson-gorseller`): G821 sahneleriyle 01, 02, 04, 08 üretildi; 8/8, `--check --strict --designs 21` çıkış 0.
