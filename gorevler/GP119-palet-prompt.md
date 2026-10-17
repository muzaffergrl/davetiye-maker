---
id: GP119
baslik: Aşama 2 · Tasarım 19 — 5 ek palet + prompt dosyaları
rol: claude-canva
durum: inceleme
alan:
oncelik: 6
bagimli: [G090]
yazar: [collections/19_Midnight_Garden/variants/]
---

## Amaç
Tasarım 19 için orijinale ek 5 renk paleti seçmek ve her biri için prompt dosyası yazmak.

## Girdiler
- `collections/19_Midnight_Garden/DESIGN_BRIEF.md`, `collections/19_Midnight_Garden/palette.json`, `collections/19_Midnight_Garden/assets/gpt/GPT_PROMPTS.md`
- Örnek: `collections/02_Dusty_Blue/variants/`, `tools/variant_prompts.py`

## Yapılacaklar
1. 5 palet: tasarımın ruhuna uygun, birbirinden ve orijinalden belirgin farklı; isim + hex token'lar.
2. `collections/19_Midnight_Garden/variants/Vxx_<ad>/palette.json` + `assets/gpt/GPT_PROMPTS.md` (Paket 1 + Paket 3, renk sözcükleri değişmiş).

## Bitti sayılması için
- [ ] 5 varyant klasörü hazır

## Sonuç
G158 ile karşılandı (platform paleti akışı, docs/25): 5 palet `coming`, sonuç ve kontrast tablosu `gorevler/G158-palet-c.md`.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-17 claude-G158: G158 (Aşama 2 parti C) ile yapıldı → inceleme. (`tools/gorev.py` G090-qa-raporu.md başlıksız olduğu için çalışmadı; elle işaretlendi.)
