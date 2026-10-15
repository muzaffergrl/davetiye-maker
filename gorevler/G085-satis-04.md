---
id: G085
baslik: Tasarım 04 Vintage Airmail Love Letter satış sitesine eklenir (G082/G083 yöntemi) — 5 tasarımla düzen
rol: claude-kod
durum: alindi
alan: claude-G085
oncelik: 2
bagimli: [G404, G083]
yazar: [platform/lib/marketing/, platform/public/marketing/designs/, platform/scripts/marketing-assets.ts, platform/tests/, platform/previews/g085/, docs/14_SATIS_SITESI.md, platform/components/marketing/]
---

## Amaç
G404 (04 Vintage Airmail Love Letter, tema `vintage-airmail-love-letter`) onaylandı. G082/G083 nasıl eklediyse 04 de aynı yolla satış sitesine girer; /start kapısı açılır.

## Yapılacaklar
1. `config.ts` + `designs.ts`'e 04: ad, kısa ve uzun açılış metni (tema README'si, gerçek ekranlar ve açılış klibi karelerinden; uydurma yok), `status: 'live'`.
2. `marketing-assets.ts --designs vintage-airmail-love-letter --shots <dir>` ile yalnız 04'ün ekranları + klibi; 01/02/03/05 bayt bayt aynı.
3. 5 tasarımla /designs: telefonda tek kalan kart ortada (G083 kuralı) — 320/360/390/430/768/1280'de doğrula; ana sayfa çip şeridi 5 çiple; 360'ta devamının belli olması (G083 açık noktası).
4. Testler: marketing unit + marketing-browser + g080/g082/g083 kapı testleri (04 artık açık); npm test, typecheck, build.
5. Önizleme `platform/previews/g085/` (390 + 1280). docs/14 §14.1'e 04 satırı. Sonuç, Günlük, bitir.

## Sonuç

## Günlük
- 2026-10-15 açıldı (entegratör): G404 onaylandı
- 2026-10-15 alindi: claude-G085 (elle: `gorev.py al` aynı id iki dosyada diye reddetti — G085-platform-kapanis.md da G085; entegratöre not)
