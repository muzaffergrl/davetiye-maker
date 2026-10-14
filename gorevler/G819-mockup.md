---
id: G819
baslik: Tasarım 19 Midnight Garden — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: alindi
alan: gpt-ui-panel
oncelik: 2
bagimli: []
yazar: [collections/19_Midnight_Garden/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/19_Midnight_Garden/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/19_Midnight_Garden/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 3 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py collections/19_Midnight_Garden --paket 3`.

## Bitti sayılması için
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç
- gpt-ui-panel, PAKET 3 talimat bloğunu ve 3.1–3.5 promptlarını aynı sohbette sırasıyla kullanarak beş fotoğraf sahnesi üretti. Çıktılar `collections/19_Midnight_Garden/assets/gpt/mockups/` altında: `cover_hand.png`, `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png`.
- Yeniden üretimler: `cover_hand_v2.png` telefonun alt bölüme alınması ve mumun üstteki başlık alanından çıkarılması için; `three_phones_v2.png` soldaki ekrana taşan küçük meyve dalını kaldırmak için. Seçilen v2'ler sade adlara da kopyalandı.
- Kontrol: `python3 tools/kit_check.py collections/19_Midnight_Garden --paket 3` → **5/5 geçti**. Ekran sayıları sırasıyla **1 / 3 / 2 / 1 / 1**; oran ve ekran geometrisi geçti. Ekranlar opak; görsel kontrolde dört köşeleri açık, parmak/dekor ekranın üstünde değil, ekran yansıması/parlama ve yazı/logo görünmüyor. Kapakta üst bölüm sakin; flatlay'de sol üçte bir boş.
- Açık renk farkı: kit_check yeşili toleranslı algılar. Ham üretimlerin yeşil ekran pikselleri tam RGB(0,255,0) değil; saf #00FF00 şartı henüz karşılanmadı. Görsel aracı talimatı kodla düzenleme için açık kullanıcı isteği gerektirdiğinden yalnız ekranlara otomatik renk sabitlemesi için kullanıcıya soruldu; yanıt bekleniyor.
- Ek önizleme, metrik veya rapor dosyası üretilmedi. Website ekranı yerleştirme ve ilan metni/montajı bu görevin kapsamında değil; test edilmedi.

## Günlük
- 2026-10-14 alindi: gpt-ui-panel
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
- 2026-10-14 ara kayıt: gpt-ui-panel — 3.1 ve 3.2 üretildi; cover_hand_v2 başlık alanı için, three_phones_v2 ekranın üstüne taşan meyve dalını kaldırmak için seçildi. İki sahnenin ekran sayısı ve geometrisi denetimden geçti.
- 2026-10-14 ara kayıt: gpt-ui-panel — 3.3 laptop_phone ve 3.4 flatlay_phone üretildi; ekran sayısı ve geometrisi denetimden geçti. İlk dört sahne hazır.
- 2026-10-14 ara kayıt: gpt-ui-panel — 3.5 hand_phone_edit üretildi; PAKET 3 5/5 geçti. Ham yeşildeki RGB farkını tam #00FF00'a sabitlemek için açık kullanıcı isteği bekleniyor.
