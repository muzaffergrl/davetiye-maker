---
id: G080
baslik: Marka ve panel sonrası kalanlar — /start ve signin BKE görünümü, onaysız temaların /start'tan kapatılması, metin/README/görsel kaynakları
rol: claude-kod
durum: hazir
alan:
oncelik: 2
bagimli: [G066]
yazar: [platform/app/start/, platform/app/signin/, platform/components/start/, platform/lib/themes/, platform/lib/marketing/facts.ts, platform/scripts/marketing-assets.ts, platform/README.md, platform/tests/, platform/previews/g080/]
---

## Amaç
G066-A/B ve G078 Sonuç'larında kalan açıklar.

## Yapılacaklar
1. `/start` (sahiplenme) ve kayıt sonrası ekran ile `app/signin` hâlâ eski yeşil görünümde / sistem fontunda → panel ile aynı BKE Studio dili
   (`components/panel/fonts.ts`, token'lar). İşlev ve testler aynı kalır.
2. **Onaysız temalar** `/start?theme=<id>` ile doğrudan sahiplenilebiliyor (G077/G078 notu). Tema onay bilgisi tek yerden (ör. `theme.json`
   `status: approved|review` ya da satış sitesindeki `designs.ts` listesi) okunur; production'da onaysız tema `/start`'ta reddedilir
   (dürüst mesaj), demo sayfaları test için açık kalır. Test: onaylı tema geçer, onaysız 4xx.
3. Satış sitesi metni "Download all replies (CSV) button" → paneldeki gerçek ad ("Download list") ile uyumlu (`facts.ts`).
4. `scripts/marketing-assets.ts` tam koşulunca panel görselleri `collections/03_Blush_Garden_Rose/package/shots/*.jpg`'den eski panel ekranlarını
   geri getiriyor → betik panel görsellerini canlı/yerel panelden çeksin ya da kaynak yolu G066-B önizlemelerine/yeni çekime çevrilsin; `--check` geçer.
5. `platform/README.md` panel notları K29 sonrası duruma göre güncellenir (3 adım, 6 sayfa, şerit, Home, Share).
6. npm test, typecheck, build, marketing-browser, panel-browser, claim testleri; önizleme `platform/previews/g080/` (390 + 1280).

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): G066-B, G078 açıkları
