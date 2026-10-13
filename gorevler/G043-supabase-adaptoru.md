---
id: G043
baslik: Supabase adaptörü — şema, RLS, storage (canlı veri)
rol: claude-kod
durum: blokaj
alan:
oncelik: 2
bagimli: [G037]
yazar: [platform/lib/data/supabase/, platform/supabase/]
---

## Amaç
Canlı veri katmanı. Yeni Supabase projesi açmak kullanıcı onayı ister (maliyet/limit) — `docs/10_SITE_PLATFORMU.md` §3.

## Yapılacaklar
1. Migration SQL (sites, rsvps), RLS: anonim yalnız yayınlanmış siteyi okur ve RSVP ekler; yazma sunucu anahtarıyla.
2. Storage bucket (fotoğraflar), boyut/tür sınırı.
3. Adaptör arayüzünün Supabase uygulaması; local ile aynı testler.

## Sonuç
_(görevi yapan ajan doldurur)_

## Günlük
- 2026-10-13 blokaj: yeni Supabase projesi için kullanıcı onayı bekleniyor (mevcut iki ilgisiz projeye dokunulmaz)
