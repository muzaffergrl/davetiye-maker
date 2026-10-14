---
id: G803
baslik: Tasarım 03 Blush Garden Rose — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: bitti
alan: gpt-gorsel-B
oncelik: 1
bagimli: []
yazar: [collections/03_Blush_Garden_Rose/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065).

## Girdiler
- `collections/03_Blush_Garden_Rose/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/03_Blush_Garden_Rose/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet. Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Kontrol: `python3 tools/kit_check.py collections/03_Blush_Garden_Rose --paket 3` (Kaydet satırındaki `N ekran` sayısını ve her ekranın düz,
   tek parça dörtgen olduğunu denetler; eğik telefon serbest).

## Bitti sayılması için
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç
- gpt-gorsel-B, PAKET 3 talimat bloğunu ve 3.1–3.5 İngilizce prompt'larını tek sohbette, sırayla ve değiştirmeden imagegen'e verdi.
- Üretilenler: `collections/03_Blush_Garden_Rose/assets/gpt/mockups/` altında `cover_hand.png`, `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png`.
- Yeniden üretim: `cover_hand_v2.png`, ilk üretimdeki yeşilin tam #00FF00 olmaması nedeniyle ekran rengini düzeltme denemesi. Seçilen v2, `cover_hand.png` adıyla da kaydedildi.
- Görsel kontrol: ekran sayıları sırasıyla 1/3/2/1/1; bütün ekranların dört köşesi açık, parmak/yaprak/kurdele ekrana binmiyor. Yazı, harf, rakam, logo veya filigran görülmedi; laptop tuşları boş. Kapakta üst alan, flatlay'de sol alan sakin bırakıldı.
- Test: `python3 tools/kit_check.py collections/03_Blush_Garden_Rose --paket 3` → **5/5 geçti**, çıkış kodu 0. Kare çıktılar 1254×1254, yatay çıktılar 1536×1024; oranlar uygun, yeniden örnekleme yapılmadı.
- **Kalan sınırlama:** imagegen, düz/opak/saf #00FF00 açıkça istenmesine ve kapak için ikinci üretime rağmen ekranlara küçük RGB sapmaları ekledi. Piksel kontrolü tam #00FF00 eşitliğinin sağlanmadığını gösterdi. `kit_check` renk toleranslıdır; 5/5 sonucu bu katı renk şartının sağlandığı anlamına gelmez. Bu nedenle saf renk şartı tam karşılandı olarak bildirilmez.
- Ek önizleme, metrik veya rapor dosyası üretilmedi; yalnız izinli mockup klasörü ve bu görev dosyası değiştirildi.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 hazir: ilan kiti için telefon + dizüstü mockup'ı (K25, paralel GPT)
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (kullanıcı: daha etkileyici, GPT tasarlasın)
- 2026-10-14 alindi: gpt-gorsel-B
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-B; 5/5 kontrol geçti, tam #00FF00 piksel eşitliği sınırlaması Sonuç'a kaydedildi.
- 2026-10-14 entegratör onayladı
