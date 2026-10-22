---
id: G206
baslik: İçerik planının kalan maddeleri — iç link matrisi açıkları ve G5 mesaj örnekleri (5 dil)
rol: claude-metin
durum: inceleme
alan: claude-session-nice-faraday
oncelik: 1
bagimli: [G205]
yazar: [platform/content/guides/, platform/tests/g206.test.ts, docs/36_ICERIK_PLANI.md, gorevler/G206-icerik-plani-kalanlar.md]
---

## Amaç
Kullanıcı (2026-10-22): "içerik planında sıradaki adımla devam et". Dalgalar ve gözden geçirme bittiği için planda açık kalan
iki madde: dalga 2'nin "G5 mesaj örnekleri" güncellemesi (hiç yapılmamıştı) ve §4 iç link matrisinin denetimi.

## Sonuç (2026-10-22, bulut oturumu)
- **Matris denetimi:** 12 yeni rehberin G1'e, kardeşlerine ve ürün sayfasına linkleri tarandı. Eksik 5 bağlantı eklendi × 5 dil:
  G1 → N1 (adım 1, demo cümlesi), G1 → N8 (adım 3, hikâye), N5 → G1 ve N12 → G1 (ürün paragrafının sonu), N9 → N10
  ("başka yerde duran bilgiler" maddesi). Ek olarak G5'in hatırlatma bölümü → N6.
- **G5 mesaj örnekleri:** üç yeni kopyalanabilir mesaj × 5 dil: yanında biriyle davet, gönderdikten sonra değişen ayrıntı
  (dijital davetiyenin düzeltilebilme avantajı), davetiyeden aylar önce save the date (genel görgü örneği; ürün özelliği
  olarak yazılmadı, docs/36 §3). Saat ve tarih biçimleri yerel.
- N12'de İngiliz yazımı "colour" → "color" (sitenin geri kalanı ABD İngilizcesi).
- `tests/g206.test.ts`: §4 matrisi İngilizce + 4 çeviride, G1 → küme başları, G5 mesaj başlıkları.
- Doğrulama: 72 çeviride link/H2/SSS eşit; build; 25 sayfa 200, tek H1, jeton ve İngilizce uyarısı yok;
  `npm test` 1705/1705 (0 hata, 0 atlanan), typecheck temiz.
- Planın kalanı veriye bağlı (lansman + GSC): docs/36 §6'ya durum notu yazıldı.

## Günlük
- 2026-10-22 alindi: claude-session-nice-faraday
- 2026-10-22 inceleme: 6 link + 3 mesaj × 5 dil
