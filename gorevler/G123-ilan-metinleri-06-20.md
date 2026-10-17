---
id: G123
baslik: 06–20 Etsy ilan metinleri (listing_v3.md) ve yükleme verisi (etsy_upload.json)
rol: claude-metin
durum: bitti
alan: claude-G123
oncelik: 1
bagimli: [G091]
yazar: [collections/06_Art_Deco_Noir/package/listing/, collections/07_Burgundy_Velvet/package/listing/, collections/08_Winter_Evergreen/package/listing/, collections/09_Lavender_Provence/package/listing/, collections/10_Tuscan_Vineyard/package/listing/, collections/11_Boho_Pampas/package/listing/, collections/12_Tropical_Destination/package/listing/, collections/13_Enchanted_Forest/package/listing/, collections/14_Ivory_Lace_Pearl/package/listing/, collections/15_Cherry_Blossom/package/listing/, collections/16_Sunflower_Rustic/package/listing/, collections/17_Emerald_Gold_Estate/package/listing/, collections/18_Wildflower_Vellum/package/listing/, collections/19_Midnight_Garden/package/listing/, collections/20_Coastal_Seaside/package/listing/, tools/etsy_upload.py, tools/tests/test_etsy_upload.py, gorevler/G123-ilan-metinleri-06-20.md]
---

## Amaç
20 tasarımın hepsi platform teması olarak canlı; Etsy ilan paketi yalnız 01–05 için vardı. 06–20 için 01–05 ile aynı standartta
ilan metni (`listing_v3.md`) ve yükleme verisi (`etsy_upload.json`). Etsy'ye hiçbir şey yüklenmez (K41).

## Girdiler
`docs/19_ALICI_YOLCULUGU.md` §4 (iskelet, başlık/etiket kalıbı, SSS, otomatik mesajlar), `docs/20_ETSY_DUKKAN_KURULUMU.md` (§3 bölümler,
§4 politikalar, §8 ilan paketi), `docs/21_ILAN_GORSELLERI.md`, 01–05 `listing_v3.md` + `etsy_upload.json`, `tools/etsy_upload.py`,
`platform/themes/<id>/` (README, theme.json, index.html), `platform/lib/marketing/designs.ts` + `config.ts`, docs/10 §2, docs/18 §4.

## Yapılacaklar
1. 06–20 `listing_v3.md`: 01–05 kalıbı (§0 durum, başlık ≤ 140, açıklama, 13 etiket ≤ 20, nitelikler, 8 görsel + alt metin, video,
   SSS, otomatik mesajlar, satış sonrası, fark notu, yayın öncesi liste). Zarfla açılmayan 6 tasarımda (06 ve 14 gatefold, 09 kese,
   12 cüzdan, 13 kitap, 18 kılıf) "envelope" geçmez.
2. Demo ve başlat linkleri canlıda 200 mü (30 URL).
3. `tools/etsy_upload.py` 20 tasarımı tanısın; 06–20 `etsy_upload.json`; `--check` ve testler.
4. 01–05 metinlerinde 06–20 ile tutarsızlık varsa düzeltmeden raporla.

## Bitti sayılması için
- [x] 15 `listing_v3.md` + 15 `etsy_upload.json`
- [x] `python3 tools/etsy_upload.py --check` 20/20 kural sorunu yok (çıkış 0)
- [x] `python3 tools/tests/test_etsy_upload.py` ve `test_listing_kit.py` yeşil
- [x] 30 canlı URL 200 (Vercel bağlayıcısıyla; bu ortamın `curl`'ü vercel.app'e proxy tarafından kapalı)

## Sonuç
**Metinler.** 06–20 `listing_v3.md`, 01–05'in güncel kalıbından (TRY fiyat satırı, TRY THE LIVE DEMO, iade yok, 24 saat yanıt) tek
tablodan üretildi; ortak bölümler (açıklama gövdesi, SSS, otomatik mesajlar, ortak nitelik satırları) 01 ile birebir aynı. Tasarıma özgü:
başlık, görünüş cümlesi, açılış nesnesi, demo linki, adres örneği (demo çiftinden), 6 etiket, renkler, üslup, dükkân bölümü, kapak alt metni
(GPT `cover_hand_v2` sahnesine bakılarak), dil satırı.
- Başlıklar 100–117 karakter. Zarfsız tasarımlarda başlıkta "Gatefold / Linen Pouch / Travel Wallet / Book / Sleeve Opening", ortak etiket
  "envelope invitation" yerine "animated invitation"; misafirin ilk gördüğü, açılış maddesi, "stays as designed" ve görsel 2/8 alt metni
  nesneye göre.
- Dil satırı her temanın yüklediği fontların Google Fonts alt kümelerinden (2026-10-16): yalnız 19'da bütün fontlar latin-ext + Kiril;
  07, 08, 09, 10, 12, 14, 15, 16, 17, 20'de latin-ext var, Kiril kısmen ya da yok; 06, 11, 13, 18'de en az bir font yalnız `latin`.
- `[VERIFY]` notları 01–05'teki 7'si + kapak alt metni (görsel üretilince okunacak) = tasarım başına 8 açık kontrol.

**Canlı kontrol (2026-10-16).** 15 × `/start?theme=<id>` ve 15 × `/start/demo/<id>` → 30/30 `200`; başlat sayfası tasarımın adını
gösteriyor, demo sayfası doğru tema (`data-theme`). Production `dpl_HKT1NRKp895wEVEUbGKdzJCqU4RW`. Doğrudan `curl` bu ortamda proxy
politikasıyla reddedildi (403); kontrol Vercel bağlayıcısının `web_fetch_vercel_url` aracıyla yapıldı. Telefonda açılmadı.

**Araç.** `tools/etsy_upload.py`: 20 tasarım; `--designs 06-20` seçimi; yeni metin kuralları (tasarım adı başlıkta, açıklamada kendi demo
linki ve başkasınınki yok, zarfsız tasarımda başlık/etiket/açıklama/alt metinde "envelope" yok; açılış nesnesi `designs.ts`'ten okunur);
eksik START HERE PDF artık kural sorunu değil **blocker** (görsel ve video gibi), `--check --strict` bunları da hata sayar. 01–05'in
yeniden üretilen JSON'u bayt bayt aynı (denendi). Test: `tools/tests/test_etsy_upload.py`.

**06–20'de satışı bekleten (bu görevin dışı).**
- START HERE yok (`package/customer/` yok; `tools/build_customer_guides.py` yalnız 01–05) → G122.
- İlan görselleri ve video yok; `listing_editorial.py` ve `listing_kit.py` yalnız 01–05'i tanıyor; editoryal şablonların 02, 03 ve 08'i
  "envelope" yazıyor (zarfsız 6 tasarım için açılış nesnesi parametresi gerekli) → G124.
- Dükkân bölümü: docs/20 §3 yalnız 01–05'i dağıtıyor; 06–20 mevcut 3 bölüme önerildi (Floral & Garden 10, Classic & Vintage 5,
  Summer & Destination 5 tasarım olur) — kullanıcı kararı.
- Sipariş onayı: K34 açık olmasını istiyor, ama docs/10 (G092) "tanımlı değil", docs/18 §4 "16 Ekim'de açık değil" diyor; değer okunmadı.
  "We confirm each order…" cümlesi `[VERIFY]` ile duruyor.

**01–05'te görülen tutarsızlıklar (düzeltilmedi).**
- §0 "Current platform release live: Not yet (G079 pending)" — docs/10'a göre G079 2026-10-15'te canlı.
- §0 "Response time, price, refund policy … Not decided" — yanıt süresi (K37) ve iade (K36) kararlaştı; açıklama zaten bunlarla yazılı.
- 02, 04 ve 05 §6 "Not produced yet" diyor, `video.mp4` var; §11'de "[x] Images and video produced".
- Dil satırı ("accented Latin letters and Cyrillic use the design's fonts") yalnız 01 ve 03'te doğru: 02 Pinyon Script, 05 Allura Kiril
  taşımıyor; 04'te Homemade Apple yalnız `latin`, Special Elite Kiril'siz.
- docs/20 §1.3 dükkân duyurusu ve §2.2 hikâye "envelope" diyor; 6 tasarım zarfla açılmıyor (dükkân geneli metin).
- Tema kopyası: 12 Tropical Destination'ın `home_replay` varsayılanı "Open the envelope again" (cüzdan tasarımı; misafir görür).

## Günlük
- 2026-10-16 alındı ve incelemeye gönderildi: claude-G123 (alt-ajan, worktree). Taban `claude/zealous-fermi-hy1o40` ile birleştirildi.
- 2026-10-17 entegratör onayladı
