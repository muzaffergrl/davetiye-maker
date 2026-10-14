---
id: G082
baslik: Onaylanan yeni tasarımları satış sitesine ekle (05 Mediterranean Lemon; 02/04 onaylanınca) — tasarım sayfası, metin, gerçek ekranlar
rol: claude-kod
durum: alindi
alan: claude-G082
oncelik: 2
bagimli: [G405, G080]
yazar: [platform/lib/marketing/, platform/public/marketing/designs/, platform/scripts/marketing-assets.ts, platform/tests/, platform/previews/g082/]
---

## Amaç
G080'den beri /start'ın onay kapısı satış sitesinin tasarım listesinden (`lib/marketing/config.ts` / `designs.ts`, `status: 'live'`) okunuyor.
G405 (05 Mediterranean Lemon) onaylandı ama listede yok → satılamaz ve /start'ta açılamaz. 02 (G402) ve 04 (G404) onaylanınca aynı adım.

## Yapılacaklar
1. `designs.ts`'e 05: ad, kısa ve uzun açılış metni (tema README'si ve gerçek ekranlarla karşılaştırarak; uydurma özellik yok), `status: 'live'`.
2. `scripts/marketing-assets.ts --designs` ile 05'in gerçek ekranları ve açılış klibi (yalnız yeni tasarım; 01/03 görsellerini değiştirme).
3. `/designs` ve `/designs/mediterranean-lemon` sayfaları; JSON-LD, sitemap (launched:false iken boş kalır), llms.txt.
4. Testler: marketing unit + marketing-browser; `/start?theme=mediterranean-lemon` production kapısında artık açılır (g080-approval).
5. Önizleme `platform/previews/g082/` (390 + 1280). Sonuç, Günlük, bitir.

## Sonuç

## Günlük
- 2026-10-14 açıldı (entegratör): G405 onaylandı
- 2026-10-14 alindi: claude-G082
