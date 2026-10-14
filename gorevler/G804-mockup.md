---
id: G804
baslik: Tasarım 04 Vintage Airmail Love Letter — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: bitti
alan: gpt-gorsel-C
oncelik: 2
bagimli: []
yazar: [collections/04_Vintage_Airmail/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/04_Vintage_Airmail/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/04_Vintage_Airmail/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 3 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py collections/04_Vintage_Airmail --paket 3`.

## Bitti sayılması için
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç
- gpt-gorsel-C, aynı sohbette önce PAKET 3 Instructions for GPT bloğunu gönderdi; ardından 3.1–3.5 İngilizce prompt'larını kelimesi kelimesine, sırayla imagegen ile üretti. Aynı masa, ışık, telefon, lacivert/brass kalem, kuru çiçekler ve botanik pullar için önceki sahneler referans kullanıldı.
- Seçilen 5 dosya `collections/04_Vintage_Airmail/assets/gpt/mockups/` altında: `cover_hand.png`, `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png`. Kareler 1254×1254; yataylar 1536×1024; Kaydet oranları korunuyor.
- Yeniden üretimler: `cover_hand_v2.png` (pullardaki küçük yazı/rakam benzeri izleri kaldırma ve ekran yeşilini düzleştirme), `three_phones_v2.png` (pul kenarlarındaki yazı benzeri izleri kaldırma), `laptop_phone_v2.png` (klavyedeki silik karakterleri kaldırma). Bu üç sürüm seçildi ve sade dosya adlarına kopyalandı; _v2 dosyaları aynı klasörde tutuldu. 3.4 ve 3.5 ilk sürümleri seçildi.
- Görsel kontrol: 1/3/2/1/1 ekran; ekranların dört köşesi açık, parmak/çiçek/pul/kalem ekranlara binmiyor; telefonlar birbirine binmiyor; görülebilir yazı/rakam/logo yok, laptop tuşları boş. Kapakta üst %30 sakin, yukarıdan sahnede sol üçte bir boş; yaşam sahnesinde yüz görünmüyor.
- Kontrol: `python3 tools/kit_check.py collections/04_Vintage_Airmail --paket 3` → **5/5 GEÇTİ**, çıkış kodu 0. Ekran sayısı, dörtgen bütünlüğü ve oran kontrolleri geçti. Yazı kontrolü gözle yapıldı; araç OCR yapmıyor.
- **Açık kalite sınırı:** imagegen ekranları görünüşte düz ve opak yeşil üretti; fakat salt-okunur piksel kontrolünde ekran içleri birebir RGB(0,255,0) değil. Ekran içlerinden ölçülen birleşik aralık R=0–8, G=246–254, B=1–38; saf #00FF00 şartı piksel düzeyinde sağlanamadı. Kapak için bu şart açıkça tekrarlanarak yeniden üretildi, sapma devam etti. `kit_check` yeşil toleransı kullanıyor; 5/5 sonucu tam RGB eşitliği anlamına gelmiyor. İncelemede bu bilinen sınır dikkate alınmalı.
- Üç sahneden sonra `G804: ara kayıt (3/5)` commit + push yapıldı. Ek önizleme, metrik veya rapor dosyası üretilmedi; yalnız mockups klasörü ve bu görev dosyası değiştirildi.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 hazir: ilan kiti için telefon + dizüstü mockup'ı (K25, paralel GPT)
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
- 2026-10-14 alindi: gpt-gorsel-C
- 2026-10-14 ara kayıt: gpt-gorsel-C; 3/5 sahne hazır (cover_hand, three_phones, laptop_phone); her biri _v2 ile temizlendi.
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-C; 5 sahne, kit_check 5/5; saf #00FF00 piksel sapması Sonuç'ta açıkça belirtildi.
- 2026-10-14 entegratör onayladı
