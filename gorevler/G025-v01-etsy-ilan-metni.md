---
id: G025
baslik: B3 — Etsy ilan metni
rol: claude-metin
durum: bitti
alan: claude-metin-1
oncelik: 2
bagimli: []
yazar: [collections/02_Dusty_Blue/package/listing/listing.md]
---

## Amaç
Etsy ilanının bütün alanlarının metni.

## Girdiler
- `docs/05_SET_PAKETI.md` §B
- `.claude/agents/etsy-metin.md`

## Yapılacaklar
1. Başlık (≤140 karakter), açıklama, 13 etiket (≤20 karakter), kategori/nitelik önerisi, SSS, alıcıya ilk mesaj şablonu, görsel/video listesi.
2. Fiyat/marka/destek `[PLACEHOLDER]`. Yalnız test edilmiş özellikleri vaat et; diğerlerini `[VERIFY]` ile işaretle.

## Bitti sayılması için
- [ ] Tüm alanlar dolu veya açıkça yer tutucu

## Sonuç
**Yapılan:** `collections/02_Dusty_Blue/package/listing/listing.md` yazıldı: başlık (şimdi kullanılabilir 115 karakter +
GA02/GB02 sonrası 134 karakter sürümü), açıklama, 13 etiket (hepsi ≤20 karakter, sayıldı) + 3 yedek, kategori/nitelik
önerileri, dijital dosya ayarı, SSS, alıcıya ilk mesaj şablonu, 10 ilan görseli + ilan videosu planı, kaynak listesi.

**Yer tutucular:** `[BRAND]`, `[PRICE]`, `[SUPPORT_EMAIL]`, `[SUPPORT_RESPONSE_TIME]`, `[REFUND_POLICY]`,
`[LICENSE_TERMS]`, `[PERSONALIZATION_SERVICE]`, `[QUANTITY]`, `[SHOP_SECTION]`.

**Kaynaklar (2026-10-09, web araması; etsy.com/canva.com sayfaları doğrudan çekilemedi):** Etsy Help "How to Manage Your
Digital Listings" (5 dosya, 20 MB), Etsy House Rules / Creativity Standards (AI kullanımı açıklamada belirtilmeli, "Designed by"
etiketi), Canva Help (template link, free website publishing, forms, download as video, hyperlinks). Başlık/etiket/video
sınırları yalnız üçüncü taraf özetlerinden → [VERIFY].

**[VERIFY] listesi:**
1. Animasyon + MP4 (GA02) — "Animated" başlık/etiket/SSS buna bağlı
2. Website free-domain yayını; RSVP iki hesap testi; yanıtların anonimliği (GB02)
3. PDF export sonrası link tıklanabilir
4. Etsy teslimi (dijital dosya ödeme sonrası) — Etsy işlevi
5. Tüm set Canva Free'de; fontlar Free'de ücretsiz; mobil uygulama
6. Etsy AI açıklama politikası: metin ve yeri ("Some decorative graphics and the sample photos were created with AI image tools...")
7. Etsy başlık kuralları, etiket sınırı, kategori/nitelik değerleri, "Designed by" etiketi, dijital dosya sınırları
8. Etsy fotoğraf sayısı/boyutu, video kuralları (5–15 sn, 100 MB, ses kaldırılır), dijital sipariş otomatik mesaj yeri
9. QR adımları; renk varyantları ilanı (yalnız varyant ilanları açılırsa)

**Dürüstlük:** Rakip/başka marka adı yok, rakip metni kopyalanmadı. Dekoratif öğelerin raster katman olduğu açıkça yazıldı;
müzik ve font dosyası yok denildi; demo isimler kurgu.
**Önerilen görev:** G902'de bu metinden ilan PDF'i (B3) üretilirken [VERIFY]'ların kapandığı kontrol edilsin; GB02 sonrası
"use now" başlık yerine ikinci başlığa geçiş kararı entegratörde.

- Entegratör (2026-10-09): 13 etiket ≤20 karakter, başlık ≤140; 26 [VERIFY]; ticari alanlar yer tutucu. VERIFY kapatma: G007.

## Günlük
- 2026-10-09 alindi: claude-metin-1
- 2026-10-09 bitti, incelemeye gönderildi
- 2026-10-09 entegratör onayladı
