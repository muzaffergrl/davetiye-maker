---
id: GM05
baslik: BKE Studio Düzenleme paneli arayüz tasarımı — 6 yüksek kaliteli ekran comp'u (GPT tasarlar)
rol: gpt-gorsel
durum: inceleme
alan: gpt-ui-panel
oncelik: 1
bagimli: [GM01]
yazar: [brand/ui/panel/]
---

## Amaç
Kullanıcı (2026-10-14): "BKE Studio'yu da ekleyelim; logo, isim, marka tasarımına uygun bir website ve panel tasarımı yapalım."
GPT Düzenleme paneli'nin görsel tasarımını yapar (K21); Claude aynı görünümü gerçek kodla kurar (G066).

## Girdiler
- `brand/UI_GPT_PROMPTS.md` → **GM05** bölümü (U2.0–U2.6) ve dosyanın başındaki kurallar
- Referans: `brand/assets/gpt/final/brand_board_final.png`, `logo_horizontal.png`, `brand/listing/comps/lc1_cover.png`, `lc6_included.png`

## Yapılacaklar
1. Tek sohbet. Önce brief'i düz mesaj olarak gönder, referansları yükle, sonra 6 comp'u sırayla, kelimesi kelimesine.
2. Metin yalnız verilen metin, harf harf. Ürün ekranı/foto/QR yeri düz saf #00FF00; QR çizilmez.
3. Denemeler `_v2`, `_v3`; ek rapor/önizleme dosyası yok. 3 comp'ta bir commit + push.

## Bitti sayılması için
- [x] 6 comp `brand/ui/panel/` içinde; Sonuç'ta yeniden üretilenler ve emin olunmayanlar

## Sonuç
- U2.0 brief'i aynı sohbette aynen düz mesaj olarak gönderildi; dört kaynak görsel sohbete yüklendi ve imagegen'e referans verildi. U2.1–U2.6 prompt'ları sırasıyla ve kelimesi kelimesine kullanıldı. Üretim ve görsel düzeltmeler yalnız imagegen ile yapıldı.
- Teslimler: `brand/ui/panel/u2_setup_names_390.png`, `u2_home_390.png`, `u2_edit_390.png`, `u2_guests_390.png`, `u2_share_390.png`, `u2_desktop.png`. İlk beşi 1024×1536, masaüstü 1536×1024; PNG bütünlüğü ve ölçüler kontrol edildi. Büyük etiketler, kâğıt zemin, koyu patlıcan başlık/düğmeler ve ortak dört sekmeli gezinme kullanıldı; kurulumda alt gezinme yok. Masaüstünde üç sütun, Edit etkin ve Map link alanı boş.
- Yeniden üretimler ve seçimler: kurulum `_v2` (yeşil alanı düzleştirme); Edit `_v2` (Preview düğmesinin son satırın okunu örtmesini giderme), `_v3` (prompt'ta olmayan Live rozetini kaldırma); Guests `_v2` (Live rozetini kaldırma); Share `_v2` (verilmeyen düzenleme URL'sini kaldırma, QR benzeri dört kareli ikonu boş kart ikonuyla değiştirme, yeşil kareyi düzeltme); masaüstü `_v2` (verilmeyen Save changes düğmesini kaldırma ve yeşil alanı düzleştirme). Sade adlar bu seçilen denemeleri gösterir; Home ilk üretimdir. Denemeler kendi `_v2`/`_v3` adlarıyla korunmuştur.
- Metinler görsel olarak harf harf kontrol edildi; OCR yardımcı kontrol olarak kullanıldı. İsimler, tarihler, URL, bölüm adları, konuk adları, yemek sayıları ve düğme etiketleri verilen metinle karşılaştırıldı. QR kodu çizilmedi; Share'de yalnız işaretsiz yeşil yer tutucu vardır. Cihaz çerçevesi, durum çubuğu ve tarayıcı çubuğu yok. Bunlar arayüz tasarım referanslarıdır; çalışan uygulama, yayın, RSVP akışı ve gerçek dokunma hedeflerinin CSS ölçüleri test edilmedi.
- **Kalan farklar (kullanıcının 2026-10-14 talimatıyla kayda geçirildi):** imagegen yeniden üretimlerine rağmen yeşil alanlar piksel düzeyinde tek renk saf `#00FF00` değildir. Baskın RGB değerleri kurulum `(2, 251, 4)`, Home `(3, 249, 4)`, Share `(6, 252, 2)`, masaüstü `(4, 249, 3)`; küçük ton sapmaları kalmıştır. Share yer tutucusunun yeşil sınırı 224×213 px olduğundan tam kare şartı da birebir karşılanmamıştır. Kullanıcı "Yalnız imagegen kullan; kalan farkı Sonuç’a yaz" dedi; ImageMagick veya başka araçla renk/oran düzeltmesi yapılmadı. Bu farklar incelemede açık kalır.
- Sahiplenme ve iki ara kayıt main'e gönderildi: `2c0490b`, `1d29b72` (3/6), `f8ae0b3` (6/6). Her push öncesi `git pull --rebase origin main` uygulandı. Görev dışında dosya yazılmadı; ek önizleme, metrik veya rapor dosyası üretilmedi. Ayrı çalışma dalı veya PR açılmadı.

## Günlük
- 2026-10-14 açıldı (entegratör): kullanıcı isteği (marka tasarımına uygun site ve panel)
- 2026-10-14 alindi: gpt-ui-panel
- 2026-10-14 ara kayıt (3/6): U2.1 kurulum, U2.2 Home ve U2.3 Edit üretildi; U2.1 yeşil alan, U2.3 Preview yerleşimi için _v2 denemeleri kaydedildi. Metinler görsel olarak harf harf kontrol edildi.
- 2026-10-14 ara kayıt (6/6): U2.4 Guests, U2.5 Share, U2.6 masaüstü üretildi; ek metinler ve örtüşmeler imagegen ile düzeltildi. Altı comp belirtilen ölçülerde kaydedildi. Yeşil alanların RGB değerlerinde imagegen kaynaklı küçük sapmalar kaldığı piksel kontrolünde görüldü.
- 2026-10-14 kullanıcı talimatı: yalnız imagegen; kalan yeşil renk ve kare oranı farkları Sonuç'a yazılacak, araç dışı düzenleme yapılmayacak.
- 2026-10-14 bitti, incelemeye gönderildi: gpt-ui-panel; altı comp ve denemeler kaydedildi, kalan farklar Sonuç'ta açıklandı.
