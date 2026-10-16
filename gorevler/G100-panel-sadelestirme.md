---
id: G100
baslik: Alıcı paneli sadeleştirme — Refero turunun (G088, docs/18) P1 maddeleri
rol: claude-kod
durum: alindi
alan: claude-G100
oncelik: 1
bagimli: []
yazar: [platform/components/panel/, platform/lib/panel/rights.ts, platform/tests/panel-browser.ts, platform/tests/g060-browser.ts, platform/tests/g069-browser.ts, platform/tests/g087-browser.ts, platform/tests/g100-browser.ts, platform/previews/g100/, gorevler/G100-panel-sadelestirme.md]
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
