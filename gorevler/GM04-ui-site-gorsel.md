---
id: GM04
baslik: BKE Studio Satış sitesi arayüz tasarımı — 6 yüksek kaliteli ekran comp'u (GPT tasarlar)
rol: gpt-gorsel
durum: inceleme
alan: gpt-ui-site
oncelik: 1
bagimli: [GM01]
yazar: [brand/ui/site/]
---

## Amaç
Kullanıcı (2026-10-14): "BKE Studio'yu da ekleyelim; logo, isim, marka tasarımına uygun bir website ve panel tasarımı yapalım."
GPT Satış sitesi'nin görsel tasarımını yapar (K21); Claude aynı görünümü gerçek kodla kurar (G066).

## Girdiler
- `brand/UI_GPT_PROMPTS.md` → **GM04** bölümü (U1.0–U1.6) ve dosyanın başındaki kurallar
- Referans: `brand/assets/gpt/final/brand_board_final.png`, `logo_horizontal.png`, `brand/listing/comps/lc1_cover.png`, `lc6_included.png`

## Yapılacaklar
1. Tek sohbet. Önce brief'i düz mesaj olarak gönder, referansları yükle, sonra 6 comp'u sırayla, kelimesi kelimesine.
2. Metin yalnız verilen metin, harf harf. Ürün ekranı/foto/QR yeri düz saf #00FF00; QR çizilmez.
3. Denemeler `_v2`, `_v3`; ek rapor/önizleme dosyası yok. 3 comp'ta bir commit + push.

## Bitti sayılması için
- [x] 6 comp `brand/ui/site/` içinde; Sonuç'ta yeniden üretilenler ve emin olunmayanlar

## Sonuç
- U1.0 brief düz mesaj olarak gönderildi; belirtilen dört marka/ilan referansı aynı sohbette açıldı ve imagegen çağrılarına eklendi. U1.1–U1.6 özgün prompt metinleri değiştirilmeden, sırayla kullanıldı.
- Seçilen comp'lar (tamamı `brand/ui/site/`): `u1_home_hero_390.png`, `u1_home_sections_a_390.png`, `u1_home_sections_b_390.png`, `u1_designs_390.png`, `u1_design_detail_390.png`, `u1_home_desktop.png`.
- İlk beş comp 1024×1536; masaüstü 1536×1024 PNG. Metinler verilen kopyayla görsel olarak harf harf karşılaştırıldı; OCR yardımcı kontrol olarak kullanıldı. U1.2 2×2 kart; U1.4 altı kart; yeşil alan sayıları sırasıyla 1, 7, 1, 6, 5, 1. QR, cihaz çerçevesi, durum çubuğu ve tarayıcı çubuğu yok.
- Yeniden üretimler: U1.1 `_v2` fazla romantik dekoru ve tasarım seçicilerindeki fazladan yeşil alanları kaldırdı (seçilen sürüm); U1.2 `_v2` verilmemiş “A REAL INVITATION, ON THEIR PHONE” alt başlığını kaldırdı (seçilen sürüm). Seçilen sürümler sade dosya adlarına da kopyalandı.
- Açık kalite sınırı: yeşil alanlar görsel olarak düz olsa da imagegen PNG'lerinde piksel düzeyinde saf `#00FF00` sağlanamadı; küçük RGB değişimleri var. U1.1 `_v3` yalnız bu rengi düzeltmek için denendi, fakat saf değer yine elde edilemedi ve sade ad için `_v2` korundu. Saf hex renk şartı karşılanmış sayılmıyor; diğer marka hex değerlerinin de piksel düzeyinde birebir olduğu iddia edilmiyor.
- 3/6 ve 6/6 ara kayıtları main'e push edildi. Yalnız bu görev dosyası ve `brand/ui/site/` değiştirildi; ek önizleme, metrik veya rapor dosyası üretilmedi. Bunlar görsel arayüz referanslarıdır; kod, yayın veya işlev testi yapılmadı.

## Günlük
- 2026-10-14 açıldı (entegratör): kullanıcı isteği (marka tasarımına uygun site ve panel)
- 2026-10-14 alindi: gpt-ui-site
- 2026-10-14 ara kayıt (3/6): gpt-ui-site; U1.1–U1.3 kaydedildi. U1.1 fazla dekor/yeşil alan, U1.2 eklenen metin nedeniyle yeniden üretildi; seçilen sürümler sade adlarda.
- 2026-10-14 ara kayıt (6/6): gpt-ui-site; U1.4–U1.6 kaydedildi, son metin ve dosya kontrolü sürüyor.
- 2026-10-14 bitti, incelemeye gönderildi: gpt-ui-site; altı comp ve renk kesinliği sınırı Sonuç'a işlendi.
