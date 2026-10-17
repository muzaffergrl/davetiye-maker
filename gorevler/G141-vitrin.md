---
id: G141
baslik: Satış sitesi — şablonlar hep ön planda, etkileşimli vitrin, "nasıl düzenlenir" görsel turu (K45 madde 7)
rol: claude-kod
durum: inceleme
alan: claude-G141
oncelik: 1
bagimli: [G089, G099, G121]
yazar: [platform/app/(marketing)/page.tsx, platform/app/(marketing)/designs/, platform/components/marketing/, platform/lib/marketing/showcase.ts, platform/lib/marketing/designs.ts, platform/lib/marketing/assets.json, platform/public/marketing/panel/, platform/scripts/marketing-assets.ts, platform/tests/g141-*.ts, platform/tests/g099-showcase.test.ts, platform/previews/g141/, gorevler/G141-vitrin.md]
---

## Amaç
Kullanıcı: "şablonlarımızı gösterdiğimiz alanları component olarak çok daha güzel etkileşimli hale getirelim… yazı yerine
ağırlıklı olarak tasarımlar ve nasıl düzenleme yapıldığına dair görseller… şablonlar hep ön planda." (K45 madde 7)

## Sonuç
**2026-10-17 · claude-G141 — durum: inceleme.** Dal `claude/g141-vitrin` (taban main d5bbc39). Yayın yok, main'e dokunulmadı.
Temalar ve alıcı paneli kodu değişmedi (panel yalnız ekran görüntüsü için yerel build'de çalıştırıldı).

**1. Şablonlar ön planda (ana sayfa).** Hero'dan hemen sonra **20 canlı tasarımın hepsi** (önce `featured` 8'i, sonra
kalanlar; `showcaseDesigns()`), stil çipleriyle (G121 CSS filtresi, JS'siz). "coming" (21. Crimson Rose Atelier) config
kuralı gereği gösterilmez. Uzun metin blokları çıktı: "How the opening works" adım metni, "Made to edit" kontrol listesi
ve RSVP bölümü yerine görsel bölümler geldi; "What is" tanımı aşağı indi (SEO/AI için duruyor). Hero girişi kısaldı.
Sıra: hero → tasarım galerisi → açılışlar şeridi → dört sayfa → düzenleme turu → nasıl çalışır → tanım → fiyat → SSS.

**2. Etkileşimli kartlar** (`DesignCard` + `CardOpening.tsx`, ana sayfa, /designs, "Other designs"):
- Fareyle üstüne gelince temanın **gerçek açılış kaydı** (`public/marketing/designs/<id>/opening.mp4`) kartın içinde
  oynar, ayrılınca durur/başa sarar; telefonda ▶ düğmesi (44 px) oynatır/durdurur. `<video>` ilk etkileşimde oluşur,
  öncesinde hiçbir klip indirilmez (ölçüldü).
- **"Try the live demo"** dolu buton (dar kartta "Live demo"); mevcut demo diyaloğunu (iframe, tıklayınca yüklenir) açar.
- **Karşılaştırma** (`Compare.tsx`): kartta "Compare" kutusu; 2–3 tasarım seçilince altta tepsi, "Compare side by side"
  diyaloğunda açılış kayıtları yan yana oynar + 4 sayfa küçük resmi + live demo / tasarım sayfası. Esc kapatır.
- 1200 px+ galerilerde 4 sütun (20 = 4 × 5).

**3. Açılışlar şeridi** (`OpeningsReel`): her açılış türünden bir tasarım (zarf, gatefold, pouch, wallet, book, sleeve)
gerçek kaydı, görünürken sessiz döngü; telefonda yatay kaydırma. Posterler tembel (`LazyLoopVideo`: önce lazy `<img>`,
yaklaşınca video) — ilk denemede 6 poster ana sayfayı 463 → 578 KB'a çıkarmıştı, düzeltmeyle 394 KB.

**4. "See how editing works" turu** (`EditTour.tsx`): telefon çerçevesinde **11 gerçek panel ekranı**: Start → edit
linki → panel Home (kurulum 3 adım) → Edit listesi → foto kırpma → müzik → harita → RSVP soruları → misafir listesi +
Download Excel → önizleme → paylaş. Ekranda iken kendiliğinden ilerler (ilerleme çubuğu), adım çipleri / önceki-sonraki /
duraklat; dokunulunca otomatik ilerleme durur. Reduced motion: kendiliğinden ilerlemez, geçiş yok.
- Panel ekranları **güncel koddan yeniden yakalandı** (`scripts/marketing-assets.ts --panel`, yerel production build,
  geçici veri, kurgusal Clara & Julian / Elena & Marco). Eski ekranlarda "Download list" vardı; şimdi "Download Excel".
  Yeni anahtarlar: `editList`, `music`, `map`, `excel`. Betik G121'in katladığı QR bölümünü açacak şekilde düzeltildi.
- Vaat yok: Google Sheets yerelde "coming soon"; metin "Download Excel: it opens in Excel, Numbers or Google Sheets" der
  (canlı Sheets bağlantısı iddiası yok; test ediliyor).

**5. Tasarım sayfası:** yeni bölüm "Every screen, from the sealed <thing> to RSVP": tasarımın 8 gerçek ekranı (mühürlü,
Home, davetiye kartı, Our Story, Details, Schedule, RSVP, yanıt formu) + "Edited from your phone" 6 panel ekranı, telefonda
yatay kaydırma, geniş ekranda tek sıra; tura bağlantı. Tek birincil eylem (Etsy) değişmedi.

**Metinler tek yerde:** `platform/lib/marketing/showcase.ts` (5 dil için). Bileşenlerde gömülü metin yok (test ediliyor).

**Testler**
- `npm run typecheck` temiz; `npm run build` + trace-check geçti; `marketing-assets.ts --check` ok.
- `npm test` **1265/1265** (yeni `tests/g141-showcase.test.ts` 4 test; `g099-showcase` ana sayfa beklentisi
  `showcaseDesigns()` olarak güncellendi).
- `tests/g141-browser.ts` **36/36** (`previews/g141/checks.json`): bütçe 390 px, CPU 4×, yavaş 4G — / LCP 1416 ms, 394 KB,
  CLS 0; /designs 872 ms, 438 KB; olive-ivory 1452 ms; coastal-seaside 1396 ms; ilk yüklemede mp4 isteği yok; axe
  (serious/critical) /, /designs, tasarım sayfası temiz; 390/1280 yatay taşma 0; reduced-motion kontrolleri.
- **Dürüst not:** bu ortamdaki Chromium **H.264 çözemiyor** (`canPlayType('avc1') === ''`); kart/karşılaştırma oynatma
  testleri "doğru klibin `<video>`'su oluştu ve dosya istendi" kontrolüne düşüyor. Gerçek tarayıcıda oynatma bu oturumda
  doğrulanmadı (Safari/Chrome H.264 oynatır; yine de gerçek telefonda bakılmalı).
- `tests/marketing-browser.ts` (eski tam süit) koşulmadı (hız talebi); ana sayfada artık 8 değil 20 kart var — o süitin
  G099 "ana sayfa = 8 featured" beklentileri güncellenmeli (ayrı iş).
- Görüntüler: `platform/previews/g141/` (home/designs/design × 390/1280 üst + tam sayfa, kart oynatma, karşılaştırma
  tepsisi/diyaloğu, tur 390/1280).

GPT'den görsel gerekmedi: bütün görseller gerçek tema/panel ekranları ve gerçek açılış kayıtları (K21).

## Günlük
- 2026-10-17 claude-G141: uygulandı, ölçüldü → inceleme
