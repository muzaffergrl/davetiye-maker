---
id: G085
baslik: Platform kapanış açıkları — RSVP ortak sayaç, güncel teslim kılavuzu ve doğrulanabilir durum özeti
rol: claude-kod
durum: bitti
alan: codex
oncelik: 1
bagimli: []
yazar: [platform/lib/rsvp/, .github/workflows/, tools/build_customer_guides.py, platform/lib/claim/limits.ts, platform/tests/, platform/README.md, docs/18_GUNCEL_DURUM.md, collections/01_Olive_Ivory/package/customer/, collections/03_Blush_Garden_Rose/package/customer/]
---

## Amaç
Kullanıcı 2026-10-15 tarihinde GitHub'daki tamamlanmayan işleri tamamlamayı istedi. RSVP ortak hız sınırını düzelt; müşteri rehberlerini mevcut panelle eşitle; güncel durum/kalan bağımlılıkları gerçek testlerle kaydet.

## Bitti sayılması için
- Ortak sayaçlı veri adaptöründe RSVP sınırı bütün sunucu örneklerinde korunur; belleğe dayalı yerel ve test override davranışı korunur.
- Regresyon testleri, typecheck ve mümkünse production build; gerçekleştirilemeyen kontroller açık yazılır.
- Teslim rehberleri K29 panelindeki gerçek alan/düğme adlarıyla uyuşur.
- Güncel tema/kod/canlı durumları ayrı raporlanır; harici erişim ve ticari karar gerektiren işler tamamlanmış sayılmaz.

## Sonuç
RSVP ortak sayaç düzeltmesi, 3 regresyon testi, güncel 01/03 Markdown rehberleri ve dört sayfalık PDF'leri tamamlandı. PDF sayfaları görsel kontrol edildi; bağlantılar doğrulandı; iki QR raster çıktıdan çözülerek doğru URL'lerle eşleşti. Yeniden üretim: python tools/build_customer_guides.py (reportlab).

Linux GitHub Actions #1 (38653122309): 570 test / 564 geçti / 0 hata / 6 atlandı; varsayılan Turbopack production build + trace-check, typecheck ve derlenmiş satış sayfaları 2/2 geçti. Yerelde hedef testler 45/45, tam paket 559/0/11; typecheck ve Webpack build başarılı (yerel Webpack trace-check başarılı değil; bu çıktı yayınlanmaz).

G085'in kod/rehber kapsamı bitti. Canlı yayın G079'da; mevcut Vercel hesabına erişim bekleniyor. İlan ekranları G065'te, Etsy/e-posta/fiyat/SLA ve gerçek cihaz denemeleri ayrı açık işler. Güncel durum docs/18_GUNCEL_DURUM.md.

## Günlük
- 2026-10-15 kaynak düzeltmeleri hazır; uzak build/yayın doğrulaması sürüyor.
- 2026-10-15 alindi: codex (kullanıcının tamamlama talebi)
