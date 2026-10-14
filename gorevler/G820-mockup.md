---
id: G820
baslik: Tasarım 20 Coastal Seaside — Etsy ilan sahneleri (Paket 3: 5 fotoğraf gerçekliğinde sahne, ekranlar #00FF00)
rol: gpt-gorsel
durum: bitti
alan: gpt-gorsel-F
oncelik: 2
bagimli: []
yazar: [collections/20_Coastal_Seaside/assets/gpt/mockups/]
---

## Amaç
Kullanıcı (2026-10-14): ilan görselleri "çok daha etkileyici, çok daha profesyonel" olmalı; GPT tasarlasın. Bu görev ilan
görsellerinin **fotoğraf sahnelerini** üretir: elde telefon (kapak), üç telefon, dizüstü + telefon, masa üstü, telefonda
düzenleme. Ekranlar düz `#00FF00`; Claude gerçek site ekranlarını perspektifle yerleştirir ve yazıları dizer (G065 düzeni).
Pilot: 01/03 (G801/G803).

## Girdiler
- `collections/20_Coastal_Seaside/assets/gpt/GPT_PROMPTS.md` → **PAKET 3** (talimat bloğu + 3.1–3.5)
- Tasarımın renk ve süs dünyası için: aynı dosyanın PAKET 5'i ve `collections/20_Coastal_Seaside/assets/gpt/comps/`

## Yapılacaklar
1. Tek sohbet (5 görsel). Önce PAKET 3'teki "Instructions for GPT" bloğunu gönder, sonra 3.1–3.5'i sırayla, kelimesi kelimesine.
2. Her ekran **düz, opak, saf #00FF00**; dört köşesi görünür; parmak, yaprak, kurdele ekrana binmez. Telefon/laptopta logo yok.
   Yazı/harf/logo hiçbir yerde yok.
3. Beğenmediğini yeniden üret (`_v2`, `_v3`); seçtiğin sade adla kalır. Ek önizleme/rapor dosyası üretme.
4. Ara kayıt: 3 sahnede bir commit + push. Kontrol: `python3 tools/kit_check.py collections/20_Coastal_Seaside --paket 3`.

## Bitti sayılması için
- [x] 5 sahne doğru yolda; `kit_check --paket 3` 5/5 geçti
- [x] Sonuç'ta yeniden üretilenler ve emin olunmayan noktalar

## Sonuç
- gpt-gorsel-F, PAKET 3 talimat bloğunu ve 3.1–3.5 İngilizce prompt'larını aynı sohbette, sırayla ve aynen kullanarak beş fotoğraf sahnesini üretti.
- Seçilen dosyalar: `collections/20_Coastal_Seaside/assets/gpt/mockups/` altında `cover_hand.png`, `three_phones.png`, `laptop_phone.png`, `flatlay_phone.png`, `hand_phone_edit.png`.
- Yeniden üretimler: `cover_hand_v2.png` ve `cover_hand_v3.png` — telefon ilk üretimde fazla yukarıdaydı; başlık için üst boşluk genişletildi, v3 sade ada seçildi. `laptop_phone_v2.png` — ilk klavyedeki küçük tuş işaretleri kaldırıldı; boş tuşlu v2 sade ada seçildi.
- Görsel kontrol: ekran köşeleri açık; parmak ve sahil süsleri ekranlara binmiyor; telefonlar birbirini örtmüyor; cihaz logosu ve görünür yazı yok; kapakta üstte geniş sakin alan, flatlay'de sol üçte bir boş. Yaşam sahnesinde yüz görünmüyor.
- Kontrol: `python3 tools/kit_check.py collections/20_Coastal_Seaside --paket 3` → **5/5 geçti** (ekran sayıları 1 / 3 / 2 / 1 / 1; oran ve ekran bütünlüğü uygun). Kareler üreticinin doğal 1254×1254 çıktıları; yataylar 1536×1024; kare oranı kontrolünden geçti.
- Açık nokta: ekranlar opak ve görsel olarak düz yeşil; ancak yeniden üretimlerde saf renk açıkça istenmesine rağmen piksel düzeyinde tam `#00FF00` sağlanmadı. Baskın RGB değerleri sırasıyla (5,250,21), (2,251,6), (3,251,7), (2,252,6), (15,251,14). `kit_check` yeşil toleransını geçti; bu sonuç tam RGB eşitliği anlamına gelmez. Saf `#00FF00` şartı incelemede açık kalıyor.
- Ara kayıtlar iki sahnede bir commit + push edildi; her push öncesinde `git pull --rebase origin main` kullanıldı. Ek önizleme, metrik veya rapor dosyası üretilmedi.

## Günlük
- 2026-10-14 alindi: gpt-gorsel-F
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-14 yeniden tanımlandı: telefon/laptop mockup'ı yerine 5 ilan sahnesi (`tools/paket3_sahne.py`; pilot G801/G803)
- 2026-10-14 ara kayıt: gpt-gorsel-F — 3.1–3.2 ve kapak denemeleri commit + push.
- 2026-10-14 ara kayıt: gpt-gorsel-F — 3.3–3.4 ve dizüstü v2 commit + push.
- 2026-10-14 bitti, incelemeye gönderildi: gpt-gorsel-F — 5 sahne, kit_check 5/5; piksel düzeyinde saf yeşil açık noktası Sonuç'ta.
- 2026-10-14 entegratör onayladı
