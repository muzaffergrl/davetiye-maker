---
id: GM07
baslik: Tasarım 15–20 rötuş parçaları — tema ajanlarının önerdiği 6 GPT parçası (yuvarlak çerçeveler, fiyonk, geri sayım kutusu, hap dalı, yatay çerçeve)
rol: gpt-gorsel
durum: blokaj
alan: gpt-gorsel-GM07
oncelik: 3
bagimli: []
yazar: [collections/15_Cherry_Blossom/assets/gpt/parts/, collections/16_Sunflower_Rustic/assets/gpt/parts/, collections/17_Emerald_Gold_Estate/assets/gpt/parts/, collections/19_Midnight_Garden/assets/gpt/parts/, collections/20_Coastal_Seaside/assets/gpt/parts/]
---

## Amaç
15–20 temaları çalışıyor; bu parçalar comp'a (W1) daha yakın olmak için **isteğe bağlı rötuş**. Kaynak: G415–G420 Sonuç
"önerilen gpt-gorsel görevi" satırları. Mevcut dosyalar **değişmez**: yeni parçalar `_r2` adıyla yanına kaydedilir, Claude temaya takar.

## Genel kurallar (her parça)
- Her parça için önce o tasarımın W1 comp'unu (`collections/<NN>_*/assets/gpt/comps/web_*.png`) ve aynı adlı mevcut parçayı **referans görsel**
  olarak ver: aynı teknik, aynı palet, aynı ışık (sol üst), aynı malzeme.
- Tek görselde tek nesne; yazı/harf/rakam/monogram yok; gölge/hâle yok; gerçek alfa (şeffaf PNG); fotoğraf penceresi düz `#00FF00`.
- Ortalı, kesilmemiş, kenarda boşluk. Kaydet satırındaki tam yol ve ad; denemeler `_r2_v2`, `_r2_v3`; seçilen sade `_r2` adıyla kalır.
- Bitince main'e `GM07: rötuş parçaları` mesajıyla commit; aşağıdaki Sonuç'a hangi parça kaç denemede seçildi, emin olunmayanlar.

## Parçalar

### R1 — 15 Cherry Blossom: tam yuvarlak portre çerçevesi
**Kaydet:** `collections/15_Cherry_Blossom/assets/gpt/parts/frame_portrait_r2.png` · 1254×1254 (kare), RGBA
```
A perfectly ROUND (circular, 1:1) thin antique-gold ring photo frame entwined with blossoming cherry twigs and pink buds, realistic watercolor, centred on a transparent canvas. Inside the ring: one flat pure green #00FF00 circular window (no texture, no gradient). The ring has even thickness all around; twigs stay outside the window. Soft light from the top-left, no cast shadow, no glow outside the frame. Same style, palette and paper as the reference images. No text.
```
Kontrol: pencere tam daire (en = boy ±1 %), düz yeşil; dallar pencereye girmiyor; şeffaf zemin.

### R2 — 20 Coastal Seaside: tam yuvarlak lombar (porthole) çerçeve
**Kaydet:** `collections/20_Coastal_Seaside/assets/gpt/parts/frame_portrait_r2.png` · 1254×1254 (kare), RGBA
```
A ship's porthole photo frame: a brass ring of even thickness with rivets, slightly weathered, realistic watercolor, centred on a transparent canvas. The window is a PERFECT CIRCLE (equal width and height) filled with flat pure green #00FF00 (no texture, no gradient, no glass reflection). Draw the porthole centred; do not stretch it. Soft light from the top-left, no cast shadow, no glow outside the frame. Same style and brass colour as the reference images. No text.
```
Kontrol: pencere tam daire, düz yeşil; perçinler düzenli; şeffaf zemin.

### R3 — 16 Sunflower Rustic: kapanış (fiyonk + buğday spreyi)
**Kaydet:** `collections/16_Sunflower_Rustic/assets/gpt/parts/closure_r2.png` · 1024×1536, RGBA — **mevcut `envelope_closed.png` ile aynı tuval**: kurdele zarfın üstüne piksel piksel oturmalı.
```
Only the closure of the kraft envelope from the reference image envelope_closed.png, on a transparent canvas of exactly the same size, at exactly the same position: a wide mustard-yellow gingham fabric ribbon wrapped horizontally around the envelope, finished in a big soft bow at the center with a small sunflower head tucked into the knot and a little spray of wheat ears, baby's breath and two green leaves fanning out behind the bow. Do not draw the envelope itself. Realistic watercolor, soft light from the top-left, no cast shadow. No text.
```
Kontrol: zarf çizilmemiş; kurdele uçları zarfın sol/sağ kenarına denk (mevcut closure.png ile üst üste koyup bak); buğday spreyi fiyonkun arkasında.

### R4 — 17 Emerald & Gold: geri sayım kutusu
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/countdown_box_r2.png` · 1024×1024, RGBA
```
One small empty rectangular box frame for a countdown number, about 4:5 (width:height), thin engraved antique-gold double border with tiny corner ornaments, the inside completely transparent (no fill, no glass), as in the countdown boxes of the reference home screen. Centred on a transparent canvas, soft light from the top-left, no cast shadow, no glow. No numbers, no text.
```
Kontrol: içi tamamen şeffaf; yalnız çerçeve; oran ~4:5.

### R5 — 17 Emerald & Gold: RSVP hapı yan dalı
**Kaydet:** `collections/17_Emerald_Gold_Estate/assets/gpt/parts/pill_sprig_r2.png` · 1024×1024, RGBA
```
One small horizontal sprig of engraved antique-gold leaves (like the tiny branches beside the RSVP button in the reference home screen), pointing to the right, centred on a transparent canvas, realistic metallic gold, soft light from the top-left, no cast shadow, no glow. No text.
```
Kontrol: tek dal, sağa bakıyor (sol taraf için Claude yansıtır); şeffaf zemin.

### R6 — 19 Midnight Garden: geniş yatay çerçeve
**Kaydet:** `collections/19_Midnight_Garden/assets/gpt/parts/frame_landscape_r2.png` · 1536×1024, RGBA
```
The same ornate baroque gilded frame as the reference frame_landscape.png, but with a wider window: the inside window is a flat pure green #00FF00 rectangle with an aspect ratio of about 2.2:1 (width:height), as in the reference details screen (W1.4). Centred on a transparent canvas, soft warm candle-like light from the top-left, no cast shadow, no glow outside the frame. No text.
```
Kontrol: pencere oranı 2,1–2,3; düz yeşil; çerçeve süsleri pencereye girmiyor.

## Sonuç

**Tamamlanamadı — durum: blokaj.** 2026-10-16 tarihinde R1–R6 tek sohbette sırayla imagegen ile üretildi; toplam **16 deneme** yapıldı. Kullanıcı, teknik son işlem sorusuna **“Hayır, yalnız imagegen çıktıları kullan”** yanıtını verdi. Bu nedenle alfa/pencere düzeltmesi, yeniden boyutlandırma, kırpma, öteleme veya kodla çizim uygulanmadı. Mevcut görseller değişmedi; bütün kaydedilen PNG'ler ham imagegen çıktılarıyla bayt bayt aynıdır.

| Parça | Deneme sayısı | Seçim | Kontrol sonucu / kalan sorun |
|---|---:|---|---|
| R1 — Cherry Blossom yuvarlak çerçeve | 4 | Seçilmedi; sade `_r2` yok | Bütün merkezlerde alfa deliği var; yeşil düz/opak değil. Ölçülen yeşil sınır oranları 0,9789–0,9883; ±%1 tam daire koşulu da sağlanmadı. Bazı çiçekler pencereye taşıyor. |
| R2 — Coastal lombar | 2 | Seçilmedi; sade `_r2` yok | İkinci denemenin pencere sınır oranı 0,9977; perçinler düzenli. Ancak merkez alfa=2 ve yeşil düz/opak değil. |
| R3 — Sunflower kapanış | 4 | Seçilmedi; sade `_r2` yok | Bütün denemeler 1024×1536 RGBA, zarf çizilmemiş, buğday fiyonkun arkasında. Piksel hizası tutmadı. En yakın üçüncü denemede x=100'de bant y=1012–1153; mevcut closure.png y=969–1108: yaklaşık +43 px aşağıda. x=900'de de +43 px. |
| R4 — Emerald geri sayım kutusu | 2 | **2. deneme görsel olarak seçildi:** `countdown_box_r2.png` | Şeffaf iç, ince çift altın çerçeve ve köşe süsleri uygun; dış oran 0,7960 (yaklaşık 4:5), merkez iç bölgede alfa=0. **Ham tuval 1254×1254; istenen 1024×1024 sağlanmadı.** |
| R5 — Emerald hap dalı | 1 | **1. deneme görsel olarak seçildi:** `pill_sprig_r2.png` | Tek yatay dal, sap solda ve uç sağda; şeffaf zemin. **Ham tuval 1254×1254; istenen 1024×1024 sağlanmadı.** |
| R6 — Midnight yatay çerçeve | 3 | Seçilmedi; sade `_r2` yok | Son iki deneme 1536×1024 RGBA. Pencere oranları sırasıyla 3,9654 / 2,9867 / 2,6927; hiçbiri 2,1–2,3 aralığında değil. Yeşilde doku/ton ve alfa düzensizliği de var. |

### Kaydedilenler

- Seçilen görsel adayları: `collections/17_Emerald_Gold_Estate/assets/gpt/parts/countdown_box_r2.png` ve `collections/17_Emerald_Gold_Estate/assets/gpt/parts/pill_sprig_r2.png`. Yukarıdaki ölçü uyumsuzluğu nedeniyle **tüm teslim koşullarını geçmiş final değildirler**.
- R1: `collections/15_Cherry_Blossom/assets/gpt/parts/frame_portrait_r2_v1.png` … `_v4.png`.
- R2: `collections/20_Coastal_Seaside/assets/gpt/parts/frame_portrait_r2_v1.png` … `_v2.png`.
- R3: `collections/16_Sunflower_Rustic/assets/gpt/parts/closure_r2_v1.png` … `_v4.png`.
- R4/R5 hamları: `collections/17_Emerald_Gold_Estate/assets/gpt/parts/countdown_box_r2_v1.png`, `_v2.png` ve `pill_sprig_r2_v1.png`.
- R6: `collections/19_Midnight_Garden/assets/gpt/parts/frame_landscape_r2_v1.png` … `_v3.png`.
- İlgili beş koleksiyonun izinli `assets/gpt/parts/` klasörlerinde `GM07_PROMPTS.md` (ana prompt ve referans/deneme kaydı) ile `GM07_CHECKS.json` (gerçek ölçüler, alfa/yeşil/pencere/hiza ölçümleri ve SHA-256) bulunur. İzinli yazma alanı dışında kalan ana `GPT_PROMPTS.md` dosyaları değiştirilmedi.

### Kontrol ve emin olunmayanlar

- W1 comp ve mevcut parça her üretim çağrısında referans olarak verildi. **İstisna:** R4 için `countdown_box.png`, R5 için `pill_sprig.png` repoda bulunmuyor; W1 home'a ek olarak R4'te `info_card.png`, R5'te `accent_3.png` kullanıldı. Bu yüzden aynı adlı eski parçayla doğrudan eşleştirme yapılamadı.
- Kontroller bu görevin yeni dosyalarına uygulandı: PNG/RGBA ve gerçek alfa, istenen tam ölçü, pencere renk/alfa örnekleri ve sınır oranları, R3'ün mevcut kapanışla üst üste karşılaştırması. Önizleme için alfa ile birleştirme yalnız `/tmp` altında yapıldı; teslim PNG'leri değiştirilmedi.
- Ham önizlemelerdeki altın hâle, saydam piksellerin RGB'sinde de bulunuyor; gerçek alfa ile zemin üzerine birleştirmede bu geniş hâle görünmüyor. Önizlemedeki RGB görünümü tek başına hâle hatası sayılmadı.
- Yazı/harf/rakam/monogram ve dış gölge görsel olarak denetlendi; OCR kullanılmadı. R4/R5'te belirgin dış hâle görülmedi; çok düşük alfa kenar pikselleri ham hâliyle korundu.
- Sıfırdan website/tema montajı, animasyon veya canlı site testi yapılmadı. Bu iş yalnız GM07 parçalarıdır.
- Sonuç: iki **görsel aday** kaydedildi; dört parçada seçim yok. Altı parçanın bütün teslim koşulları sağlanmadığından görev `inceleme`/`bitti` olarak işaretlenmedi.

## Günlük
- 2026-10-15 açıldı (entegratör; G415–G420 önerileri)
- 2026-10-16 alindi: gpt-gorsel-GM07 (kullanıcının doğrudan görevlendirmesi)
- 2026-10-16 blokaj: 16 ham imagegen denemesi kaydedildi; R4/R5 görsel adayları seçildi ancak ölçüleri farklı; R1/R2/R3/R6 kontrolleri geçmedi. Kullanıcı yalnız imagegen çıktısı istedi; teknik son işlem uygulanmadı.
