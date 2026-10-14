---
id: G808
baslik: Tasarım 08 Winter Evergreen — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: bitti
alan: gpt-gorsel-C
oncelik: 2
bagimli: []
yazar: [collections/08_Winter_Evergreen/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/08_Winter_Evergreen/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/08_Winter_Evergreen/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 3 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py collections/08_Winter_Evergreen --paket 3`.

## Bitti sayılması için
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç
- gpt-gorsel-C, PAKET 3 talimat bloğunu ve 3.1–3.5 İngilizce prompt'larını aynı sohbette, sırayla ve aynen kullanarak imagegen ile 5 fotoğraf sahnesini üretti.
- Seçilen dosyalar: `collections/08_Winter_Evergreen/assets/gpt/mockups/` altında `cover_hand.png`, `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png`.
- Yeniden üretim: kapakta ilk telefon üst yarıya taşıyordu; `cover_hand_v2.png` seçilip `cover_hand.png` olarak kaydedildi, ilk deneme `cover_hand_v1.png` olarak korundu. Seçilen kapakta telefon alt yarıda; üstte geniş, sakin başlık alanı var.
- Yeniden üretim: `hand_phone_edit_v2.png` ekranı tam #00FF00 yapmak için referanslı düzenleme denemesi. Tam renk elde edilemedi ve renk sapması arttı; `hand_phone_edit.png` ilk sürüm olarak kaldı. Deneme dosyası korundu.
- Kontrol: `PYTHONDONTWRITEBYTECODE=1 python3 tools/kit_check.py collections/08_Winter_Evergreen --paket 3` → **5/5 geçti**. Ekran sayıları sırayla 1/3/2/1/1; oran ve ekran şekli kontrolleri geçti. Kare sahneler imagegen çıktısı 1254×1254, yataylar 1536×1024; oranlar Kaydet satırlarıyla uyumlu. Beş seçili PNG tamamen opak.
- Görsel kontrol: ekranların dört köşesi açık; parmak, çam dalı, kozalak, kar ve kurdele yeşil alana binmiyor. Laptop tuşları boş; yazı, logo ve filigran görülmedi. 3.4'te sol üçte bir boş; 3.5'te yüz görünmüyor.
- **Açık eksik: ekranlar piksel düzeyinde saf #00FF00 değil.** Imagegen, aynen ve ek vurguyla istenmesine rağmen yakın yeşil tonları ve küçük piksel değişimleri üretti. Ekran içi medyan RGB değerleri sırasıyla (11,253,14), (2,251,3), (5,251,3), (3,251,2), (3,251,13); saf renk şartı sağlandı denilemez. `kit_check` yakın yeşili toleransla kabul eder; 5/5 sonucu bu farkı garanti etmez. İnceleme sırasında bu eksik dikkate alınmalı.
- Ara kayıt `G808: ara kayıt (3/5)` main'e gönderildi. Repo değişiklikleri yalnız mockups klasörü ve bu görev dosyası; ayrı önizleme, metrik veya rapor dosyası üretilmedi.

## Günlük
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-C; 5 sahne üretildi, kit_check 5/5 geçti; saf #00FF00 piksel şartındaki eksik Sonuç'a kaydedildi.
- 2026-10-14 alindi: gpt-gorsel-C
- 2026-10-14 ara kayıt: gpt-gorsel-C; 3.1–3.3 üretildi ve ekran kontrolleri geçti (3/5). cover_hand_v2 seçildi; ilk denemede telefon üst yarıya taşıyordu (cover_hand_v1 korundu).
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
- 2026-10-14 entegratör onayladı
