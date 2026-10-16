---
id: G005
baslik: G004'ün belge ayağı — Canva UI işleri için web/belge araştırması
rol: claude-metin
durum: iptal
alan:
oncelik: 1
bagimli: []
yazar: [docs/arastirma/G005_canva_ui_arastirma.md]
---

## Amaç
Canva'da API aracı olmayan dört iş için (1) element animasyonu/timeline, (2) website'e Form (RSVP) ekleme, (3) website yayınlama, (4) template link oluşturma — kullanıcıya elle iş vermeden otomatik yapma yollarını resmi belgelerden araştırmak. Claude (G004) aynı anda canlı testleri yapıyor; bu görev belge/kanıt tarafıdır.

## Girdiler
- `docs/05_SET_PAKETI.md` §C, `docs/06_FABRIKA_PLANI.md` §5
- Canva Developers: Connect API (canva.dev/docs/connect), Apps SDK (canva.dev/docs/apps), Canva Help Center
- AGENTS.md kalıcı talep 6 (kullanıcı elle iş yapmaz)

## Yapılacaklar
1. Her iş için ayrı başlık. Şu seçenekleri resmi kaynaklarla değerlendir: (a) Canva Connect REST API uç noktaları, (b) Canva Apps SDK (editör içi uygulama; ör. design editing / element ekleme API'leri — animasyon, form, sayfa ayarı yapabiliyor mu?), (c) hazır animasyonlu Canva şablonundan başlayıp animasyonu devralmak, (d) şeffaf video katmanı (WebM/MOV alfa) ile hareket, (e) tarayıcı otomasyonu (Playwright) — Canva kullanım şartları ve bot engeli açısından.
2. Her seçenek için: yapılabilir mi (evet/hayır/belirsiz), kanıt (belge bağlantısı + alıntı, tarih), gereksinim (hesap türü, Pro/Teams, geliştirici kaydı, gizli anahtar), risk, kullanıcıdan bir defalık bir şey gerekip gerekmediği.
3. Template link: Canva'nın 'template link' paylaşımı API'de var mı; yoksa alıcıya kopya açtırmanın başka resmi yolu (ör. Brand Template, 'Use as template' bağlantı biçimi) var mı?
4. Website Form: Canva Forms öğesi Apps SDK/API ile eklenebiliyor mu; yanıtların kime gittiği (alıcı/satıcı) hakkında resmi bilgi.
5. Sonunda tablo: iş × en iyi yol × güven düzeyi. Tahmini kanıttan ayır; doğrulanmamışı 'doğrulanmadı' yaz.

## Bitti sayılması için
- [ ] Dört işin her biri için en az bir resmi kaynak bağlantısı
- [ ] Özet tablo

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-16 iptal: K22/K24 — Canva arayüz işleri (animasyon, Form, yayın, template link) araştırması; Canva teslimi yok
