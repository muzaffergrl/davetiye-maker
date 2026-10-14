---
id: G811
baslik: Tasarım 11 Boho Pampas Terracotta — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: bitti
alan: gpt-gorsel-A
oncelik: 2
bagimli: []
yazar: [collections/11_Boho_Pampas/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/11_Boho_Pampas/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/11_Boho_Pampas/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: kullanıcı talimatına göre 2 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py collections/11_Boho_Pampas --paket 3`.

## Bitti sayılması için
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç
PAKET 3'ün talimat bloğu ve 3.1–3.5 İngilizce prompt'ları aynı sohbette sırayla, kaynak metin değiştirilmeden GPT imagegen ile uygulandı. Beş seçili sahne `collections/11_Boho_Pampas/assets/gpt/mockups/` altında:
- `cover_hand.png`: kapak; telefon alt yarıda, üstte geniş sakin başlık alanı.
- `three_phones.png`: birbirine değmeyen üç telefon.
- `laptop_phone.png`: dizüstü + telefon; klavye tuşları boş.
- `flatlay_phone.png`: yukarıdan masa; sol üçte bir boş.
- `hand_phone_edit.png`: iki elde telefon; başparmak ekran dışında, yüz görünmüyor.

Yeniden üretimler: `cover_hand_v2.png` (telefon aşağı alındı, üst başlık alanındaki pampas kaldırıldı), `laptop_phone_v2.png` (klavye üzerindeki işaretler kaldırıldı), `flatlay_phone_v2.png` (sol metin alanına giren alt pampas sağa taşındı). Bu üç v2, ilgili sade adla da kaydedildi.

Kontrol: `python3 tools/kit_check.py collections/11_Boho_Pampas --paket 3` → **5/5 geçti** (ekran sayıları 1/3/2/1/1; oran ve ekran geometrisi). Görsel kontrolde tüm ekran köşeleri görünür, parmak/dekor ekranlara binmiyor; yazı/logo görülmedi. Kare çıktılar üreticinin doğal çözünürlüğü olan 1254×1254, yataylar 1536×1024; hedef oranlar korunuyor. İki sahnede bir ara commit + push yapıldı. Ek önizleme, metrik veya rapor dosyası üretilmedi.

Sınır / inceleme noktası: imagegen, ekranları görsel olarak düz ve opak yeşil üretmesine rağmen tam piksel düzeyinde saf `#00FF00` vermedi. Ekran içi medyan RGB değerleri sırasıyla `(3,252,14)`, `(4,250,6)`, `(5,249,15)`, `(1,252,9)`, `(3,252,7)`; çok küçük renk değişimleri mevcut. `kit_check` toleranslı yeşil maskesiyle geçiyor; dolayısıyla 5/5 sonucu her pikselin tam `(0,255,0)` olduğunu doğrulamıyor. Kullanıcının mutlak saf yeşil şartı bu noktada tam karşılanmış sayılamaz.

## Günlük
- 2026-10-14 alindi: gpt-gorsel-A
- 2026-10-14 ara kayıt: 3.1 kapak (v2 seçildi; telefon aşağı alındı, başlık alanı açıldı) ve 3.2 üç telefon üretildi; ekran sayısı/geometrisi kontrolleri geçti.
- 2026-10-14 ara kayıt: 3.3 dizüstü + telefon (v2, boş klavye tuşları) ve 3.4 masa üstü (v2, sol üçte bir tamamen açıldı) üretildi; ekran sayısı/geometrisi kontrolleri geçti.
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-A; 3.5 üretildi, Paket 3 kontrolü 5/5 geçti; saf yeşilin piksel düzeyindeki üretici sapması Sonuç'a yazıldı.
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
- 2026-10-14 entegratör onayladı
