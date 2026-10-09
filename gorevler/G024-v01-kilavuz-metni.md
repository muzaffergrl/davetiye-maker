---
id: G024
baslik: A5 — START HERE kılavuz metni (İngilizce)
rol: claude-metin
durum: inceleme
alan: claude-metin-1
oncelik: 2
bagimli: []
yazar: [collections/02_Dusty_Blue/package/customer/START_HERE.md]
---

## Amaç
Alıcının seti açıp düzenlemesi için adım adım İngilizce kılavuz metni.

## Girdiler
- `docs/05_SET_PAKETI.md` (A1–A5)
- `.claude/agents/etsy-metin.md`
- Canva Help Center (güncel arayüz adları)

## Yapılacaklar
1. Bölümler: What's included · Before you start · Open your templates (link yer tutucuları `[TEMPLATE_LINK_VIDEO]` vb.) · Edit text · Replace photos · Video export (MP4) · Website: edit, RSVP form, publish · PDF/print · Sharing · Troubleshooting · Support `[SUPPORT_EMAIL]`.
2. Her Canva adımının yanında kaynağı (Help Center makale başlığı) yorum olarak `<!-- source: ... -->`.
3. Test edilmemiş iddia yok; 'works with Canva Free' gibi ifadeler yalnız `[VERIFY]` etiketiyle.

## Bitti sayılması için
- [ ] Yer tutucular açıkça işaretli
- [ ] Dil sade, adım adım

## Sonuç
**Yapılan:** `collections/02_Dusty_Blue/package/customer/START_HERE.md` yazıldı (İngilizce alıcı kılavuzu, 11 bölüm:
What's included · Before you start · Open your templates · Edit text · Replace photos · Download the video (MP4) ·
Website: edit / RSVP form / publish · Print & PDF (+ QR) · Share · Troubleshooting · Support). Başta dahili not
(HTML yorumu, PDF'te görünmez) var.

**Yer tutucular:** `[TEMPLATE_LINK_VIDEO]`, `[TEMPLATE_LINK_WEBSITE]`, `[TEMPLATE_LINK_INVITATION_PDF]`,
`[TEMPLATE_LINK_STORY]`, `[TEMPLATE_LINK_SQUARE]`, `[BRAND]`, `[SUPPORT_EMAIL]`, `[SUPPORT_RESPONSE_TIME]`, `[LICENSE_TERMS]`.

**Kaynaklar (Canva Help Center, 2026-10-09; WebFetch canva.com'da HTTP 403 verdi, menü adları resmi makalelerin
arama özetlerinden alındı — tarayıcıda yeniden bakılmalı):** Share a template link · Add and edit text · Format text ·
Upload media · Using frames · Animate designs · Edit element timing · Download as video · Add hyperlinks ·
Add forms and quizzes (polls-quizzes) · Publishing websites for free · Publishing Canva websites · Website settings ·
Margins, bleed and crop marks · Download file types. Her adımın yanında `<!-- source: ... -->` var.

**[VERIFY] listesi (test edilmedi):**
1. Canva Free ile açma/düzenleme/MP4-PDF export/website yayını; şablonda ücretli öğe (filigran) yok
2. Canva mobil uygulama adımları
3. Template link sayfasındaki buton adı ("Use template for new design" — üçüncü taraf kaynak)
4. Monogram her tasarımda canlı metin katmanı
5. Pinyon Script / Cormorant Garamond / Montserrat Canva Free'de ücretsiz
6. Fotoğraf değişince video animasyon/zamanlaması korunuyor
7. Video animasyonu (GA02) ve MP4'te oynaması
8. Şablonda ücretli öğe yok ("Pay and Download" çıkmıyor)
9. Website bölüm listesi (G020/G021 çıktısıyla eşleşme); Canva website editöründe bölüm silme adımı
10. Website formu yanıtları anonim mi (bir ikincil kaynak "Canva Websites'ta yanıtlar anonim" diyor → kılavuz "Full name" sorusu öneriyor); form başına soru sınırı (10)
11. İki hesapla A/B: yanıtlar yalnız alıcıya gidiyor, form template-link kopyasında duruyor (GB02)
12. Free domain'de yayın (Free hesapla)
13. 5×7 şablonda bleed ayarlı
14. PDF Standard sonrası link tıklanabilir
15. QR code uygulaması — resmi Help Center makalesi bulunamadı; ad/butonlar üçüncü taraf kaynaktan

**Önemli bulgu:** Canva Free'de yayınlanan sitede "Designed with Canva" altbilgisi çıkıyor, Free hesap free domain'de
en fazla 5 site — kılavuza yazıldı. Website formunda isim toplanamıyorsa RSVP için "Full name" sorusu şart (G021/GB02 notu).

**Test edilmedi:** Hiçbir Canva adımı gerçek arayüzde denenmedi; tasarımlar (website, PDF, story, kare) henüz yok.
**Önerilen görev:** GB02 sonrası `claude-tarayici` ile kılavuzun her adımını ikinci (Free) hesapta yürütüp [VERIFY]'ları
kapatma; ardından G026 aracıyla US Letter PDF üretimi.

## Günlük
- 2026-10-09 alindi: claude-metin-1
- 2026-10-09 bitti, incelemeye gönderildi
