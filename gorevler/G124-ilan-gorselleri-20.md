---
id: G124
baslik: 20 tasarımın Etsy ilan görselleri (editoryal set, 8 × 2000 px) ve ilan videoları
rol: claude-kod
durum: inceleme
alan: claude-G124
oncelik: 1
bagimli: [G121, G123, G098]
yazar: [collections/01_Olive_Ivory/package/listing/, collections/02_Dusty_Blue/package/listing/, collections/03_Blush_Garden_Rose/package/listing/, collections/04_Vintage_Airmail/package/listing/, collections/05_Lemon_Mediterranean/package/listing/, collections/06_Art_Deco_Noir/package/listing/, collections/07_Burgundy_Velvet/package/listing/, collections/08_Winter_Evergreen/package/listing/, collections/09_Lavender_Provence/package/listing/, collections/10_Tuscan_Vineyard/package/listing/, collections/11_Boho_Pampas/package/listing/, collections/12_Tropical_Destination/package/listing/, collections/13_Enchanted_Forest/package/listing/, collections/14_Ivory_Lace_Pearl/package/listing/, collections/15_Cherry_Blossom/package/listing/, collections/16_Sunflower_Rustic/package/listing/, collections/17_Emerald_Gold_Estate/package/listing/, collections/18_Wildflower_Vellum/package/listing/, collections/19_Midnight_Garden/package/listing/, collections/20_Coastal_Seaside/package/listing/, tools/listing_editorial.py, tools/listing_editorial/, tools/listing_kit.py, tools/listing_templates/, tools/tests/test_listing_editorial.py, docs/21_ILAN_GORSELLERI.md, gorevler/G124-ilan-gorselleri-20.md]
---

## Amaç
Editoryal ilan seti (docs/21, v4) yalnız 01–05 için vardı; 06–20'nin ilan görseli ve videosu yoktu (G123 §0 "Not produced").
20 tasarımın hepsine aynı sistemle 8 görsel + 06–20'ye ilan videosu; zarfla açılmayan 6 tasarımda (06 ve 14 gatefold, 09 kese,
12 cüzdan, 13 kitap, 18 kılıf) görsellerde ve videoda "envelope" geçmez. Etsy'ye hiçbir şey yüklenmez (K41).

## Girdiler
`docs/21_ILAN_GORSELLERI.md`, `tools/listing_editorial.py` + şablonlar, `tools/listing_kit.py`, `tools/listing_templates/capture.ts`,
`platform/lib/marketing/designs.ts` (açılış cümlesi), G098 temaları + G121 editörü (depo tabanı `6181730`), her tasarımın
`assets/gpt/mockups/` sahneleri, GM06 `brand/trust/`, G123 `listing_v3.md` alt metinleri.

## Yapılacaklar
1. Araçlar 20 tasarımı tanısın (`--theme` id / numara / aralık / `all`); açılış nesnesi `designs.ts`'ten; koyu tasarımlar (06, 17, 19).
2. 20 × 8 görsel (`images_editorial/`), 06–20 `video.mp4`; 01–05 görselleri güncel editörle yeniden.
3. Göz denetimi (temas sayfası), video süre/çözünürlük; bariz hata varsa yalnız o kare yeniden.
4. 20 `listing_v3.md` §0/§5/§6/§11 gerçek duruma; `etsy_upload.json` yenile; `--check`.
5. docs/21: 20 tasarım + yeniden üretim komutu.

## Bitti sayılması için
- [x] 20 × 8 PNG (2000 × 2000) + 20 `video.mp4` (1080 × 1080, H.264, sessiz, 12.5–14.5 sn)
- [x] Zarfsız 6 tasarımda görsel/video metninde "envelope" yok (`tools/tests/test_listing_editorial.py`, `etsy_upload.py --check` alt metinleri)
- [x] `python3 tools/etsy_upload.py --check` ve `--check --strict` 20/20 OK (çıkış 0)
- [x] `test_listing_editorial.py`, `test_listing_kit.py`, `test_etsy_upload.py` yeşil
- [ ] Kullanıcının görsel onayı (docs/21: "satışın en önemli parçası")

## Sonuç
**Üretim.** `tools/listing_editorial.py --theme all --capture --video` (yerel üretim derlemesi, `next start` aracın içinde; canlıya bir
şey gitmez) 20 tasarımın 8'er görselini ve 06–20'nin videosunu yaptı. 01–05'te değişen: 2. görsel (DPR 3 açılış kareleri,
`opening_stills.json`), 5. görsel (G121 Guests sayfası), 7. görsel (GM06 T1 sahnesi); diğerleri bayt düzeyinde küçük farklar.
01–05 videoları G059/G122'den olduğu gibi duruyor (aynı tarif).

**Araç.** `listing_kit.py`: 06–20 `Theme` kayıtları; `opening_object()` `designs.ts`'teki "Your guests tap the <nesne>." cümlesinden
(`etsy_upload.py` ile aynı kural); `opening_words` kısa/uzun ad ("storybook", "linen pouch", "travel wallet", "vellum sleeve").
Editoryal şablonların 02, 03, 08'i ve platform şablonları (02, 03, video arka planı) nesneyi parametre alıyor; 07 şablonu
kâğıttan GM06 sahnesine geçti (firm alt geçiş); koyu tasarımlar kendi koyu zemininde, açık
yazı ve ters logo ile. `opening_stills.json`: tasarım başına elle seçilmiş iki açılış karesi zamanı. Test: `tools/tests/test_listing_editorial.py`.

**GM06 güven sahneleri (araç kodundan).** Yalnız **T1** (`brand/trust/t1_three_steps.png`, keten üstünde üç telefon) kullanılıyor:
`listing_editorial.py` `TRUST_STEPS` sabiti, 20 tasarımın hepsinde 7. görsel ("Three simple steps"; ekranlara gerçek /start, kurulum
ve yayındaki site oturur). T2–T6 kodda hiç geçmiyor; gerekçe docs/21 tablosunda (T2/T3'te telefon Etsy boyutunda okunmayacak kadar
küçük, T4 dokuzuncu görsel adayı, T5 QR içerdiği için yasak, T6'da ekran yok).

**Denetim (bu tur, hızlı).** 20 temas sayfası (8 kare, ~400 px) ve her videodan 5 kare gözle: boş/bozuk ekran, yanlış tasarım adı,
zarfsız tasarımda "envelope", taşan yazı **bulunmadı**; düzeltilen kare yok. 06–20 kapak alt metinleri 500 px kapaklarla karşılaştırıldı,
hepsi tutuyor → "[VERIFY: matches the finished cover]" kaldırıldı (open checks 8 → 7). Videolar: 20/20 1080 × 1080, H.264, sessiz,
12.5–14.5 sn; ilk ve son kare ortalama farkı < 4/255 (dikişsiz döngü). Gözle görülen küçükler (hata sayılmadı): 14'ün 2. görselinde
adım etiketleri inci/dantel üstünde soluk ama okunur; 17 kapağında başlık açık mermere yakın ama okunur.

**Metin.** 06–20 `listing_v3.md`: §0 "Listing images and video" → Produced (süre ile), §5 "Not produced yet" → gerçek set paragrafı
(zarfsızlarda nesne notu), §6 → gerçek video satırı (süre, VERIFY korunuyor), §11 maddesi [x]. 01–05: §5 paragrafı G124 + GM06 T1 notu,
§11 satırı, 01 ve 03 §6'ya süre. `etsy_upload.json` 06–20 yenilendi (görseller `exists: true`); 01–05 JSON bayt bayt aynı.

**Açık kalanlar.** Kullanıcının görsel onayı; görseller depodaki (G100/G121) editörü gösteriyor, canlı üretim daha eski (docs/10) →
yayından önce deploy; GPT sahneleri 1254/1536 px'ten 2000 px'e büyütülmüş (doku hafif yumuşak, upscale kullanıcı kararı); dokuzuncu
görsel (T4 "her cihaz") önerisi kullanıcı kararı; Etsy video kuralları listing editöründe doğrulanmadı (VERIFY duruyor).

## Günlük
- 2026-10-16 alındı (claude-G124, alt-ajan, worktree `g124-ilan-gorselleri`); üretim ara kayıt olarak `3872b7d`'de commit'lendi (konteyner yeniden başladı).
- 2026-10-16 denetim, listing_v3 / etsy_upload.json / docs/21 tamamlandı; incelemeye gönderildi.
