# AGENTS.md — Çalışma kuralları

Bu dosya Claude Code, Codex (Astra) ve diğer kodlama ajanları içindir. Ayrıntı ve gerekçe
[`00_ANA_DEVIR.md`](00_ANA_DEVIR.md) içindedir; çelişkide öncelik sırası:

**son kullanıcı talebi → güncel canlı Canva kaydı → 00_ANA_DEVIR.md + PROJECT_STATE.json → koleksiyon kaynakları → archive/**

## İş bir cümlede

Yabancı Etsy alıcılarına; Canva'da isim, tarih, fotoğraf, video ve linklerini kendisi
değiştirebildiği, aynı görsel kimlikte **animasyonlu dikey video + tek sayfa website + sabit
davetiye PDF/görseli** setleri satıyoruz. Olive & Ivory bu işin **ilk koleksiyonudur**, işin
ya da markanın adı değildir. Marka adı henüz seçilmedi.

## Dil

- Kullanıcıyla: **Türkçe**, kısa ve dürüst.
- Ürün içeriği (davetiye, site, PDF, ilan): **İngilizce**. Tarih belirsiz olmasın:
  US `June 12, 2027`, UK `12 June 2027`; `06/12/27` gibi biçimler kullanılmaz.

## Değişmeyecek şartlar

1. Teslim = alıcının açıp düzenlediği **gerçek Canva projesi**. Tek parça PNG/MP4 "editable" diye sunulmaz.
2. Video baştan **9:16, 1080 × 1920**; yatay düzeni daraltmak kabul edilmez.
3. Website **tek uzun landing page**, responsive. 1080 × 7800 afiş website sayılmaz.
4. Hikâye: zarf açılır → fotoğraflar tek tek çıkar → davet ve bilgiler → RSVP. Nesneler **ayrı** hareket eder; tüm ekranı zoom/fade yetmez.
5. Stil: klasik, romantik, zengin, geniş beğeni. Ultra-minimal/editoryal ilk ürün için reddedildi.
6. Özgünlük: rakipten özellik/UX öğrenilir; logo, fotoğraf, çizim, dantel dosyası, rehber **kopyalanmaz**. `references/market_only/` satışa girmez.
7. Kişisel alanlar (isim, tarih, monogram, foto, link) görsele **pişirilmez**; ayrı metin/medya katmanıdır.
8. QR yalnız gerçek hedef URL'den algoritmik üretilir (`tools/make_qr.py`). AI'nin çizdiği QR benzeri kare kullanılmaz.
9. Font dosyası hiçbir pakete konmaz. Lisansı belirsiz stok/müzik eklenmez.

## Dürüstlük kuralları (en sık yapılan hatalar)

- **Görsel üretimi ≠ ürün teslimi.** Kullanıcı proje/düzeltme isterken yeni konsept görsel üretme.
- **Taslak ≠ kalıcı kayıt.** Canva'da draft/transaction commit edilmeden "kaydedildi" deme. Commit sonrası aynı design ID'den yeniden oku ve doğrula.
- Kopya/import/yeni dosya, eski master'ı düzeltmiş sayılmaz.
- Yapılmamış testi yapılmış gibi yazma: MP4 export, website yayını, RSVP veri akışı, alıcı A/B ayrımı, Canva Free testi.
- Durum etiketleri: `concept → editable_draft → review_pending → saved_master → functional_pilot → buyer_tested → sale_ready`. Dosya adına "FINAL" yazmak durumu değiştirmez.
- Ticari alanlar (marka, fiyat, destek e-postası, SLA, revizyon) **uydurulmaz**; açık yer tutucu kalır.
- Demo veriler (Avery & Jordan, The Willow Grove Estate, `averyandjordan.com`, `1234 Celebration Lane`) kurgudur; gerçek URL alanları `null` kalır. Başkasına ait olabilecek domaine veri gönderilmez.

## Çalışma tarzı

- Kullanıcı uzun planlardan ve tekrar eden storyboard turlarından yoruldu. **Üret, sonra kısa rapor ver:** hangi dosyada ne değişti, ne kaydedildi, ne taslakta, ne işlev bekliyor.
- Blokaj varsa kapsamını tek paragrafta söyle, bağımsız yapılabilen işi bitir.
- Karar gerektiren eksikte tek net soru sor; bütün üretimi durdurma.
- Kontrolleri riske odakla: zarf dantel/mühür birleşimi, metin taşması, foto değişimi, video oynatma, website formatı, RSVP veri hedefi, PDF linkleri.
- Kullanıcının Canva'da yaptığı değişiklikleri (ör. 2. sahne başlığı/fotoğrafı) izinsiz demo içerikle ezme. Eski tam dosyayı yeniden içe aktarıp güncel içeriği silme.

## Durum güncelleme

Her anlamlı adımdan sonra `PROJECT_STATE.json` ve ilgili `COLLECTION_STATUS.md` güncellenir:
design ID, edit URL, aktif transaction, kalıcı kayıt durumu, satış kopyası, template linki,
yayın URL'si, son kontrol tarihi.

## Prosedürler

`.claude/skills/` altındaki SKILL.md dosyaları adım adım prosedürdür (her ajan okuyabilir):

- `canva-guvenli-duzenleme` — Canva draft → önizleme → onay → commit → yeniden okuma
- `icerik-tutarlilik` — tek içerik kaydına göre tüm formatların denetimi
- `qr-kod` — gerçek QR üretimi
- `yeni-koleksiyon` — yeni koleksiyon/varyant açma

## Kullanıcının kalıcı talepleri (2026-10-09)

1. **Grafik üretimi GPT ile:** Fotoğraf gerçekliği gereken doku, dekor, örnek fotoğraf ve mockup'ları
   GPT üretir. Her ihtiyaçta prompt'u **İngilizce** yaz, kaydedileceği **tam yolu ve dosya adını**
   belirt; `collections/<koleksiyon>/assets/gpt/GPT_PROMPTS.md` dosyasına ekle ve sohbette de ver.
   Klasörler: `assets/gpt/{textures,decor,photos,mockups}/`. Dosyaları oradan çek.
2. **Her teslimde Canva düzenleme linki:** Kullanıcıya her üretim turunda Canva'da düzenlenebilir
   tasarımın linkini gönder. Canva'ya ulaşılamıyorsa bunu açıkça söyle; link yerine başka bir şey sunma.
3. **Her tasarım eksiksiz paket:** video + website (Canva Form ile RSVP) + PDF davetiye + paylaşım
   görseli + alıcı kullanım kılavuzu PDF'i. Liste ve bitiş şartları: `docs/05_SET_PAKETI.md`.
4. **Kılavuz PDF'i hatasız olmalı:** Alıcı indirdiğinde sorun yaşamamalı; her link ve adım gerçek
   arayüzde denenir.
5. **Etsy ilan PDF'i:** Her set için ilan görselleri, video ve Etsy'nin istediği tüm alanları içeren
   PDF hazırlanır ve `collections/<koleksiyon>/package/listing/` içine konur.
