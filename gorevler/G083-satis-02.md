---
id: G083
baslik: Tasarım 02 Dusty Blue & Champagne satış sitesine eklenir (G082 yöntemi) — tasarım sayfası, metin, gerçek ekranlar, /designs düzeni
rol: claude-kod
durum: hazir
alan:
oncelik: 2
bagimli: [G402, G082]
yazar: [platform/lib/marketing/, platform/public/marketing/designs/, platform/scripts/marketing-assets.ts, platform/tests/, platform/previews/g083/, docs/14_SATIS_SITESI.md, platform/components/marketing/]
---

## Amaç
G402 (02 Dusty Blue & Champagne, tema `dusty-blue-champagne`) onaylandı. G082 ile 05 nasıl eklendiyse 02 de aynı yolla satış sitesine girer; böylece /start kapısı da açılır.

## Yapılacaklar
1. `designs.ts`/config'e 02: ad, kısa ve uzun açılış metni (tema README'si ve gerçek ekranlarla; uydurma yok), `status: 'live'`.
2. `scripts/marketing-assets.ts --designs dusty-blue-champagne` (gerekirse `--shots`) ile yalnız 02'nin gerçek ekranları ve açılış klibi; 01/03/05 görselleri değişmez.
3. /designs düzeni: 4 tasarımla telefonda 2 sütun tek kalan kart bırakmamalı; ana sayfa tasarım düğmeleri 390'da iki satıra inmesin (G082 notu).
4. Testler: marketing unit + marketing-browser + g080/g082 kapı testleri (02 artık açık); npm test, typecheck, build.
5. Önizleme `platform/previews/g083/` (390 + 1280). docs/14 §14.1'e 02 ve 05 satırı + marketing-assets yeni seçenekleri. Sonuç, Günlük, bitir.

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): G402 onaylandı
