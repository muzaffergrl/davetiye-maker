---
id: G100
baslik: Alıcı paneli sadeleştirme — Refero turunun (G088, docs/18) P1 maddeleri
rol: claude-kod
durum: bitti
alan: claude-G100
oncelik: 1
bagimli: []
yazar: [platform/components/panel/, platform/lib/panel/rights.ts, platform/tests/panel-browser.ts, platform/tests/g060-browser.ts, platform/tests/g069-browser.ts, platform/tests/g087-browser.ts, platform/tests/g100-browser.ts, platform/tests/final-smoke.ts, platform/previews/g100/, gorevler/G100-panel-sadelestirme.md]
---

## Amaç
Kullanıcı (K29, K32): panel çok basit olmalı, alıcıda soru işareti kalmamalı. `docs/18_REFERANS_TASARIM.md`'nin alıcı paneline
dokunan P1 satırları uygulanır (görsel kimlik GM04/GM05 korunur; değişen düzen, hiyerarşi ve sadelik).

## Girdiler
`docs/18_REFERANS_TASARIM.md` (§1, §2, §4 P1), `docs/16_PANEL_V2.md`, `docs/19_ALICI_YOLCULUGU.md`, `platform/components/panel/`, `platform/lib/panel/`.

## Yapılacaklar
1. Kurulum 1. adım tek iş: iki isim + tarih; değişiklik hakkı tek satır ("After publishing you can change names or the date 3 times.",
   sayı `lib/panel/rights.ts`'ten) + "Learn more"; "How your names appear" ilk ekrandan kalkar.
2. Yayın başarı ekranı: önce link + Share (Copy/Open/Share); QR ve PNG/SVG "More ways to share" altında; 2–3 isteğe bağlı sonraki adım
   (yalnız var olan özelliklere).
3. "Sample" rozetleri yerine sayfa başında tek satır ("3 fields still show sample text" + "Go to the first one"); alanda yalnız soluk görünüm.
4. Guests: sayılar → arama + durum sekmeleri (All · Coming · Not coming · New) → liste; soru yanıtları ayrı "Results" görünümünde
   (sayı + yüzde). 390 × 844'te listenin ilk satırı ilk ekranda. Yanıt ekleme/düzeltme, tutulan yanıtlar, CSV, yazdırma korunur.
5. Day & place "More options" (G087) kontrolü; program ve "After the wedding" ayrı alt başlıklar.

## Bitti sayılması için
`npm test`, `npm run typecheck`, `npm run build`; panel-browser, g060-browser, g069-browser, g087-browser yeşil; axe (serious/critical 0),
dokunma hedefi ≥ 44 px; 360/390/1280 ekranları `platform/previews/g100/`.

## Sonuç

## Günlük
- 2026-10-16 alindi: claude-G100
- **Kurulum 1. adım:** yalnız iki ad + düğün tarihi/saati (390 × 844'te ikisi de ilk ekranda). "How your names appear" ilk adımdan
  kalktı (adlar satırı adları izliyor; Edit → Us'ta duruyor). Hak notu tek satır `rightsOneLine()` (`lib/panel/rights.ts`, sayı
  `IDENTITY_CHANGE_LIMIT`'ten) + "Learn more" (kurallar, ücretsiz düzeltmeler, geri alma). Tam adlar ve not tarihten sonra.
  Aynı not (`RightsNote`) yayından önce Us / Day & place sayfalarında da.
- **Yayın başarı ekranı** (`components/panel/Published.tsx`; kurulumun son adımı ve editörden ilk yayın sayfası ortak): önce link,
  Share (telefonda birincil) · Copy link · Open website; QR + PNG/SVG "More ways to share" altında kapalı; sonra "Next, if you like"
  2–3 adım (Add your photos · Replace the sample text · See replies · Add a guest password — yalnız var olan yerlere). Sonraki adımdan
  Geri = Home (yayınlanmış sitede `#setup/n` artık Home'a döner).
- **Sample:** alan başına rozet yok; sayfanın başında tek satır "N fields still show sample text · Go to the first one" (sayı panelin
  `prePublishNotes().sample`'ından, sayfanın bölümlerine göre); örnek alan soluk (kesik çerçeve, italik, ekran okuyucuya "still the
  design's sample text"). Kilitli örnek tarih de sayılır, atlama "Change"e iner. Kurulum 1. adımda aynı satır tarihin hemen üstünde.
- **Guests:** "Guest list | Results" iki görünüm (`#guests/results` yeni rota). Liste: sayılar → arama → durum sekmeleri
  (All · Coming · Not coming · New [+ Held]) → liste; "N new replies · Mark as seen" New sekmesinin başında. 390 × 844'te ilk yanıt
  ilk ekranda (alt çubukların üstünde). Results: kapanış günü, Coming?/Not coming (sayı · %), sorular (seçenek başına sayı · %,
  evet/hayır % (sayı)), yiyecek notları; bir satıra dokunmak listeyi ona süzer. Yanıt ekleme/düzeltme, tutulanlar, CSV, yazdırma aynı.
- **Day & place:** "More options" (saat dilimi, tarih biçimi, geri sayım) G087'deki gibi kapalı; alt başlıklar Date & time · Venue ·
  Schedule · After the wedding zaten ayrı — değişiklik gerekmedi, `g100-browser` denetliyor.
- **Testler:** `npm test` 1208/1208, typecheck, build yeşil. Tarayıcı (PORT 3480): panel-browser 79/79, g060-browser 152/152,
  g069-browser 403/403, g087-browser 65/65, yeni `tests/g100-browser.ts` 52/52 (axe serious/critical 0, dokunma hedefi ≥ 44 px, yatay
  kaydırma yok). Değişen davranış için güncellenen testler: g060 (tek satır kural, sample satırı, QR katlı), g069 (cevaplar Results'ta,
  New sekmesi), panel-browser ve final-smoke (QR "More ways to share" içinde). Diğer görevlerin `previews/` klasörlerine yazılmadı
  (ekranlar `/tmp`'ye yönlendirildi).
- **Ekranlar:** önce `platform/previews/g100/before/` (01_setup1_390, 02_published_390, 03_day_sample_390, 05_guests_390); sonra
  `platform/previews/g100/` 360/390/1280.
- **Açık / öneri:** `docs/19_ALICI_YOLCULUGU.md` START HERE metni (satır ~260 #50 ve ~1038) hâlâ "grey Sample tag" diyor; "QR code appear"
  cümlesi de "More ways to share" ile güncellenmeli → claude-metin görevi önerilir. `docs/16_PANEL_V2.md`'ye G100 notu (entegratör).
  360 px'te durum sekmeleri iki satıra kırılıyor (kabul edilebilir). Gerçek telefonda ve canlıda denenmedi.
- 2026-10-16 bitti, incelemeye gönderildi
- 2026-10-16 entegratör onayladı
