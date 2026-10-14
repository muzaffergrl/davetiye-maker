---
id: G085
baslik: Platform kapanış açıkları — RSVP ortak sayaç, güncel teslim kılavuzu ve doğrulanabilir durum özeti
rol: claude-kod
durum: alindi
alan: codex
oncelik: 1
bagimli: []
yazar: [platform/lib/rsvp/, platform/lib/claim/limits.ts, platform/tests/, platform/README.md, docs/18_GUNCEL_DURUM.md, collections/01_Olive_Ivory/package/customer/, collections/03_Blush_Garden_Rose/package/customer/]
---

## Amaç
Kullanıcı 2026-10-15 tarihinde GitHub'daki tamamlanmayan işleri tamamlamayı istedi. RSVP ortak hız sınırını düzelt; müşteri rehberlerini mevcut panelle eşitle; güncel durum/kalan bağımlılıkları gerçek testlerle kaydet.

## Bitti sayılması için
- Ortak sayaçlı veri adaptöründe RSVP sınırı bütün sunucu örneklerinde korunur; belleğe dayalı yerel ve test override davranışı korunur.
- Regresyon testleri, typecheck ve mümkünse production build; gerçekleştirilemeyen kontroller açık yazılır.
- Teslim rehberleri K29 panelindeki gerçek alan/düğme adlarıyla uyuşur.
- Güncel tema/kod/canlı durumları ayrı raporlanır; harici erişim ve ticari karar gerektiren işler tamamlanmış sayılmaz.

## Sonuç
Çalışılıyor.

## Günlük
- 2026-10-15 alindi: codex (kullanıcının tamamlama talebi)
