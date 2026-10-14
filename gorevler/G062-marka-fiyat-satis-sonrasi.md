---
id: G062
baslik: Karar belgesi — marka/dükkân adı adayları (alan adı müsaitliği), Etsy merkezli fiyatlandırma, satış sonrası ve müşteri bağlama
rol: claude-metin
durum: bitti
alan: wf-strateji
oncelik: 1
bagimli: []
yazar: [docs/15_MARKA_FIYAT_SATIS_SONRASI.md]
---

## Amaç
Kullanıcı (K25) marka adı ve fiyata karar verecek; satış sonrası Etsy ve diğer platformlarda müşteriyi platforma bağlayacak
sistem istiyor. Karar için hazır, veriye dayalı belge.

## Yapılacaklar
1. 15–20 marka adı adayı (kısa, akılda kalıcı, İngilizce pazara uygun, düğün/davetiye çağrışımlı, telif/marka çakışması riski düşük);
   her biri için .com (ve gerekirse .co) müsaitliği (Vercel alan adı aracı; satın alma YOK), sosyal ad notu; en iyi 5 öneri.
2. Etsy merkezli fiyat önerisi: docs/13 verisi, Etsy ücretleri (listeleme, işlem, ödeme işleme, reklam), barındırma maliyeti
   (Vercel Pro + Blob), 12 ay barındırma; 3 fiyat seçeneği + indirim stratejisi + paket (çoklu tasarım/Save the Date).
3. Satış sonrası ve müşteri bağlama: Etsy alıcıya mesaj, START HERE akışı, e-posta sırası (sağlayıcı gerekli), panel içi ek ürünler
   (Save the Date, teşekkür sayfası, renk varyantı, misafir fotoğraf albümü…), yorum isteme zamanı, tavsiye/indirim kodu,
   kendi sitemizden doğrudan satış (Stripe) ve diğer platformlar (Shopify/Amazon Handmade vb.) — Etsy kurallarına uygunluk notlarıyla.
4. Her bölümde net öneri + kullanıcının vereceği karar listesi.

## Sonuç
`docs/15_MARKA_FIYAT_SATIS_SONRASI.md` yazıldı (2026-10-14). Belge üç salt okuma araştırmasından derlendi: marka adı, fiyat,
satış sonrası. **Alan adı satın alınmadı.**

**Belgede:**
- **Marka (§2):** ≈130 ad içinden 25 aday seçildi. Her biri için .com/.co müsaitliği (Vercel `get_bulk_availability` /
  `get_bulk_price`; müsait .com $11.25/yıl), Etsy adı ve karakter sayısı, çakışma riski var. Elenenler ayrı listede.
  Öneri: **Seal & Story** (`SealAndStory`, sealandstory.com müsait). Yedekler: Seal & Sonnet, Silk & Seal, Fold & Vow, Vellum Lane.
- **Fiyat (§3):**
  - Etsy ücretleri TR, US ve UK satıcı için ayrı hesaplandı (TR'de Etsy payı ≈ %25). Barındırma maliyeti site başına ≈ $0.07.
  - Üç strateji karşılaştırıldı. Öneri: **A**, $49 liste → %40 indirim → $29.40 (TR net ≈ $19.24). Lansmanda %50 → $24.50;
    15–20 yorumdan sonra %30 → $34.30.
  - Save the Date varyasyonu ancak ürün hazır olunca eklenir. Barındırma uzatma, ek hak ve kurulum hizmeti lansmanda satılmaz
    (Etsy Services/Off-Platform riski).
- **Satış sonrası (§4):** Etsy kuralları tablosu; Etsy'ye uyumlu alıcı akışı ve İngilizce taslak metinler (Message to Buyers,
  ilan çerçeve cümlesi, yorum isteği, bitiş bildirimi); düğün takvimi; P0–P3 panel yol haritası (etki/efor); e-posta sırası ve
  sağlayıcı karşılaştırması (öneri: Resend); yorum, kupon ve tavsiye kuralları; diğer kanallar.
- **Kararlar (§5):** kullanıcı karar listesi. §5b'de entegratöre önerilen görevler. §6'da kaynak URL'leri.

**Doğrulanmayanlar (dürüst durum):**
- Bu ortamdan açılamadı (DNS / proxy 403): etsy.com, help.etsy.com, vercel.com, stripe.com, paddle.com, USPTO, Justia,
  Trademarkia, instagram.com. Etsy, Vercel, Stripe ve Paddle bilgileri arama özetinden ([R-özet]) ya da üçüncü taraf kaynaklardan
  ([İkincil]).
- Hiç yapılmadı: marka tescil araması, Etsy dükkân adı müsaitliği, sosyal kullanıcı adları.
- Vercel `list_billing_charges` 404 "Plan not found" döndü. Pro'nun aktif olduğu panelden doğrulanmalı.
- İki araştırma şu konularda çelişti; belgede ikisi de yazıldı ve karar yolu önerildi:
  - Panelde ek ürün satışının Etsy kurallarına uygunluğu (§3.10).
  - TR ödeme işleme sabiti (14 TRY / 3 TRY) ve ROF oranı (§3.2).

**Önerilen görevler (entegratör açar; ayrıntı §5b):**
1. Alan adı bağlama + START HERE PDF'leri ve ilan görsellerinin yeniden üretilmesi.
2. Resend entegrasyonu.
3. `/start` pazarlama onay kutusu + gizlilik sayfası.
4. Etsy Shop Manager ayarları (`claude-tarayici`).
5. İlan kitlerinden QR'ın çıkarılması ve yer tutucuların doldurulması.
6. "Made with [BRAND]" alt bilgisi + QR kart PDF'i + paylaşım kiti.
7. G061'de Etsy butonlarının Share & Save linki olması.
8. Save the Date ürünü.

## Günlük
- 2026-10-14 alindi: wf-strateji
- 2026-10-14 bitti, incelemeye gönderildi
- 2026-10-14 entegratör onayladı
