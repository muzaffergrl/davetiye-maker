---
id: G817
baslik: Tasarım 17 Emerald & Gold Estate — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: inceleme
alan: gpt-gorsel-A
oncelik: 2
bagimli: []
yazar: [collections/17_Emerald_Gold_Estate/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/17_Emerald_Gold_Estate/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/17_Emerald_Gold_Estate/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 3 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py collections/17_Emerald_Gold_Estate --paket 3`.

## Bitti sayılması için
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç

- gpt-gorsel-A, PAKET 3 talimat bloğunu önce gönderdi; 3.1–3.5 İngilizce prompt'larını kelimesi kelimesine aynı sohbette ve sırayla imagegen ile üretti. Aynı mermer, zümrüt kadife, altın mumluklar, okaliptüs, telefon ve ışık referansları korundu.
- Seçilen 5 dosya: `collections/17_Emerald_Gold_Estate/assets/gpt/mockups/` altında `cover_hand.png`, `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png`.
- Yeniden üretimler: `cover_hand_v2.png` seçildi; ilk kapakta mum üstteki başlık alanına giriyordu. Yeni kapakta üst %40 sakin ve boş, telefon aşağıda. `laptop_phone_v2.png` seçildi; ilk laptop klavyesinde karakterler vardı, v2'de tuşlar boş. `laptop_phone_v3.png` yalnız ekran rengini düzeltmek için denendi; renk sapması azalmadığı için seçilmedi. Seçilen v2'ler sade adlara da kaydedildi.
- Görsel kontrol: ekran sayıları sırasıyla 1/3/2/1/1; dört köşe açık; parmak, kurdele ve süsler ekranlara binmiyor; görünen yazı/logo yok; yaşam sahnesinde yüz görünmüyor. Kareler imagegen'in doğal 1254×1254 çıktısı, yataylar 1536×1024; istenen oranlar korundu.
- Kontrol: `python3 tools/kit_check.py collections/17_Emerald_Gold_Estate --paket 3` → **5/5 geçti**, çıkış 0. Ara kayıtlar 3.1–3.2 ve 3.3–3.4 sonrasında commit + push edildi; her push öncesi `git pull --rebase origin main` uygulandı.
- **Karşılanmayan kesin renk şartı:** prompt'larda ve tekrar üretimde saf, düz, opak `#00FF00` istendiği hâlde ham imagegen çıktıları piksel düzeyinde tam `(0,255,0)` değil. Seçilen dosyalardaki baskın ekran RGB değerleri sırasıyla `(3,253,3)`, `(4,251,3)`, `(5,246,11)`, `(4,252,4)`, `(3,252,4)`. `kit_check` toleranslı yeşil maskesiyle geçiyor; bu sonuç birebir renk ve her pikselin aynı olduğunu doğrulamıyor. Saf `#00FF00` şartı için teknik renk düzeltmesi hâlâ gerekli; eksiksiz karşılandı olarak sunulmuyor.
- Ek önizleme, metrik veya rapor dosyası oluşturulmadı. Yalnız görev dosyası ve bu görevin mockups klasörü teslim edildi.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
- 2026-10-14 alindi: gpt-gorsel-A (kullanıcı talebi: yalnız G817; iki sahnede bir ara kayıt).
- 2026-10-14 ara kayıt: gpt-gorsel-A, 3.1–3.2 kontrol edildi ve main'e push edildi.
- 2026-10-14 ara kayıt: gpt-gorsel-A, 3.3–3.4 kontrol edildi ve main'e push edildi.
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-A; 5/5 kit_check geçti; tam #00FF00 renk şartının karşılanmadığı Sonuç'a yazıldı.
