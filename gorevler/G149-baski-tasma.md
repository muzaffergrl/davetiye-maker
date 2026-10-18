---
id: G149
baslik: Basılı davetiye — metin dekorun üstüne binmesin (22 tasarım, 5×7 + A5, ön + arka)
rol: claude-kod
durum: bitti
alan: claude-G149
oncelik: 1
bagimli: [G139]
yazar: [platform/lib/print/layouts.ts, platform/lib/print/invitation.ts, platform/tests/g149-print-layout.test.ts, platform/previews/g149/, gorevler/G149-baski-tasma.md]
---

## Amaç
Entegratör kontrolü: **21 Crimson Rose Atelier, 5×7 ön yüzde "Kindly reply by …" satırı gül dekorunun üstündeydi.** Bunu düzelt,
sonra 22 tasarımın basılı davetiyesini (5×7 ve A5, ön + arka) aynı gözle denetle: metin dekora (gül, çerçeve, mühür, çiçek)
binmesin, güvenli alanda kalsın (kesimden ≥ 0.2 in), taşmasın/kesilmesin, QR temiz kalsın. GPT görseline dokunma (K21).

## Girdiler
`AGENTS.md`, `gorevler/G139-pdf-davetiye.md`, `platform/lib/print/{layouts,invitation,render}.ts`, `platform/public/print/<id>/*.webp`.

## Yapılacaklar
1. 22 tasarım × (5×7, A5) × (ön, arka) örnek içerikle ve uzun içerikle yerelde bas, PNG'ye bak.
2. Her düzende metin–dekor çakışması, güvenli alan, taşma/kesilme, QR.
3. Düzeltme yalnız yerleşim verisinde ve sığdırmada (kutu / dekor bölgeleri / yazı boyu); görsel çizilmez, düzenlenmez.
4. Hızlı otomatik test.
5. `rm -rf .next && npx tsc --noEmit && npm test && npm run build`.

## Bitti sayılması için
- [x] 22 tasarım × 2 boyut × 2 yüz × 3 içerik (örnek, uzun EN, uzun DE) = 264 yüz basıldı, piksel denetimi + gözle bakıldı
- [x] Sonra: 264/264 yüzde metin–dekor çakışması 0, taşma 0, kesilme 0, güvenli alan dışı 0
- [x] Crimson 5×7 ön: "Kindly reply by" güllerden ayrık (aşağıda)
- [x] `tests/g149-print-layout.test.ts` (yeni, 2 test): serbest alan sanatta boş + uzun içerik serbest alanın dışına çıkmıyor
- [x] typecheck, `npm test`, `npm run build` (aşağıda "Kontroller")
- [ ] Vercel'de canlı deneme (bu görevde yayın yok)

## Sonuç

### Bulgu (düzeltmeden önce, G139 verisiyle)
Yöntem: her yüz üç kez basıldı (tam / yalnız sanat / yalnız metin, 192 dpi); "dekor" = kâğıt renginden belirgin ayrılan,
kâğıt lifi boyundan büyük leke; metnin mürekkebi 0.04 in büyütülüp dekorla kesişimi ölçüldü (`scratchpad` betikleri, repoda yok).
**22 tasarımın 21'inde** en az bir durumda metin dekora değiyor/biniyordu; **örnek içerikle bile 18 tasarımda**. Kök neden: G139
kutuları dikdörtgendi ve köşelerdeki çiçek kümelerini, arka yüzde üst ortadaki dalı/mühür bölgesini, kemerli kartlarda kemeri
içine alıyordu; ortalanmış metin dar olduğunda sorun görünmüyor, satır genişleyince (uzun isim, iki satıra kayan mekân, host
satırı, "Kindly reply by …") köşeye giriyordu. Yalnız 22 Nocturne temizdi (metin gökyüzünde). Tablo aşağıda ("önce" sütunu).

### Çözüm
1. **Serbest alan = kutu + bantlar** (`lib/print/layouts.ts`): her yüzün kutusu GPT sanatından yeniden ölçüldü (iki boyutun
   birleşimi, her dekorun çevresinde kart genişliğinin ~%2'si boşluk); dekorun içeri girdiği yükseklikler için `bands`
   (`[üst %, alt %, en çok genişlik %]`, kutunun eksenine ortalı). Sanat ne kaldırıldı ne taşındı ne çizildi (K21); 21 ve 22'nin
   composed görsel yerleşimi de aynen duruyor. 22 Nocturne ön/arka ve 21 arka yüz kutusu aynı kaldı (yalnız 22 öne bant).
2. **fitText bantlı sığdırma** (`lib/print/invitation.ts`): her metin öğesi (host satırı, her isim, davet cümlesi, tarih, saat,
   mekân, yer, cevap tarihi, program satırı, QR…) bulunduğu yükseklikte sanatın bıraktığı genişliği alır: kaydırılabilen öğe
   kayar, tek satırlık öğe (isimler, tarih, adres, "The Details") küçülür, QR olduğu gibi sığmalı. Blok, kutunun yüksekliğine
   sığana ve hiçbir öğe bandını aşmayana kadar %3 adımlarla küçülür (en az ×0.45). Bir isim bant yüzünden kutunun tek başına
   istediğinin %65'inden fazla küçülecekse blok küçülür (köşeden uzaklaşır); tek bir minik satır olmaz.
3. **Yazı ayrıntıları:** cevap tarihi bölünmez ("Kindly reply by / May 15, 2027", "March / 6" yok); "The Details" tek satır;
   el yazısı isimlerin mürekkebi (kuyruk/swash) ölçülüp ismin kutusuna dolgu olarak eklenir — 04 Vintage'da "Henry"nin y'si
   alttaki "celebrate" satırına iniyordu, artık inmiyor. Bant denetimi glif kutusunu da sayar.
4. **21 Crimson 5×7 ön:** kutu `[24, 12, 20, 12]` → `[27.5, 11, 27.5, 11]` + üst/alt bantlar (sol üst ve sağ alt gül dalı
   hizasında satırlar %28–60 genişlikte). "Kindly reply by May 15, 2027" artık sağ alttaki güllerden en az bant boşluğu kadar (≈0.1 in) uzakta; host satırı
   sol üst dalın altında iki satır. Örnek içerikte yazı ×0.85 (önce ×1), uzun içerikte ×0.67.

### Tasarım × boyut × sonuç
İçerik: **örnek** = temanın demo kaydı; **uzun** = "Maximiliana-Josephine & Bartholomew-Alexander", 3 satırlık host satırı,
72 harflik mekân ("The Grand Orangery Ballroom at Château de Montmorency-Laval and Gardens"), "Saint-Rémy-de-Provence,
Provence-Alpes-Côte d'Azur", 6 satır program, uzun dress code; İngilizce ve Almanca ("Um Antwort wird gebeten bis 25. August
2027", "Mittwoch, 29. September 2027"). "Önce" = G139 verisinde metin dekora değen/binen ya da taşan durumlar; "sonra" = aynı
264 yüzün hepsinde çakışma, taşma, kesilme, güvenli alan dışı **0**. Ölçek = fitText'in vardığı yazı boyu (tasarımın tam boyu
= 1.00; örnek / uzun içerikte en küçüğü); parantezde ayrıntı satırının (saat/yer, 3.3 em) baskıdaki boyu.

| Tasarım | Boyut | Önce | Sonra | Ön yüz ölçek örnek / uzun | Arka yüz ölçek örnek / uzun |
|---|---|---|---|---|---|
| 01 olive-ivory | 5x7 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.91 / 0.67 (9.5 / 7.0 pt) | 0.91 / 0.67 (8.2 / 6.0 pt) |
| 01 olive-ivory | a5 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.94 / 0.67 (11.7 / 8.3 pt) | 0.91 / 0.67 (9.8 / 7.2 pt) |
| 02 dusty-blue-champagne | 5x7 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.73 / 0.55 (7.6 / 5.7 pt) | 0.91 / 0.67 (8.2 / 6.0 pt) |
| 02 dusty-blue-champagne | a5 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.70 / 0.55 (8.7 / 6.9 pt) | 0.91 / 0.67 (9.8 / 7.2 pt) |
| 03 blush-garden-rose | 5x7 | ✗ uzun arka, uzun ön, örnek ön | ✓ | 0.94 / 0.70 (9.8 / 7.3 pt) | 0.82 / 0.61 (7.4 / 5.5 pt) |
| 03 blush-garden-rose | a5 | ✗ uzun arka, uzun ön, örnek ön | ✓ | 0.94 / 0.70 (11.7 / 8.7 pt) | 0.82 / 0.61 (8.8 / 6.5 pt) |
| 04 vintage-airmail-love-letter | 5x7 | ✗ uzun arka, uzun ön, örnek ön | ✓ | 0.85 / 0.73 (8.9 / 7.6 pt) | 1.00 / 0.79 (9.0 / 7.1 pt) |
| 04 vintage-airmail-love-letter | a5 | ✗ uzun arka, uzun ön, örnek ön | ✓ | 0.85 / 0.76 (10.6 / 9.5 pt) | 1.00 / 0.79 (10.7 / 8.5 pt) |
| 05 mediterranean-lemon | 5x7 | ✗ uzun arka, uzun ön, örnek arka | ✓ | 1.00 / 0.91 (10.5 / 9.5 pt) | 0.97 / 0.70 (8.7 / 6.3 pt) |
| 05 mediterranean-lemon | a5 | ✗ uzun arka, uzun ön, örnek arka | ✓ | 1.00 / 0.91 (12.5 / 11.3 pt) | 0.97 / 0.70 (10.4 / 7.5 pt) |
| 06 art-deco-black-tie | 5x7 | ✗ uzun ön | ✓ | 1.00 / 1.00 (10.5 / 10.5 pt) | 1.00 / 0.85 (9.0 / 7.6 pt) |
| 06 art-deco-black-tie | a5 | ✗ uzun ön | ✓ | 1.00 / 1.00 (12.5 / 12.5 pt) | 1.00 / 0.85 (10.7 / 9.1 pt) |
| 07 burgundy-velvet-autumn | 5x7 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.79 / 0.58 (8.3 / 6.1 pt) | 0.97 / 0.70 (8.7 / 6.3 pt) |
| 07 burgundy-velvet-autumn | a5 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.79 / 0.58 (9.8 / 7.2 pt) | 0.97 / 0.70 (10.4 / 7.5 pt) |
| 08 winter-evergreen | 5x7 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.91 / 0.70 (9.5 / 7.3 pt) | 1.00 / 0.70 (9.0 / 6.3 pt) |
| 08 winter-evergreen | a5 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.91 / 0.70 (11.3 / 8.7 pt) | 1.00 / 0.70 (10.7 / 7.5 pt) |
| 09 lavender-provence | 5x7 | ✗ uzun arka, uzun ön | ✓ | 1.00 / 1.00 (10.5 / 10.5 pt) | 1.00 / 0.73 (9.0 / 6.6 pt) |
| 09 lavender-provence | a5 | ✗ uzun arka, uzun ön | ✓ | 1.00 / 1.00 (12.5 / 12.5 pt) | 1.00 / 0.73 (10.7 / 7.8 pt) |
| 10 tuscan-vineyard | 5x7 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 1.00 / 0.85 (10.5 / 8.9 pt) | 1.00 / 0.73 (9.0 / 6.6 pt) |
| 10 tuscan-vineyard | a5 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 1.00 / 0.82 (12.5 / 10.2 pt) | 1.00 / 0.73 (10.7 / 7.8 pt) |
| 11 boho-pampas-terracotta | 5x7 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.73 / 0.49 (7.6 / 5.1 pt) | 1.00 / 0.70 (9.0 / 6.3 pt) |
| 11 boho-pampas-terracotta | a5 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.73 / 0.49 (9.1 / 6.1 pt) | 1.00 / 0.70 (10.7 / 7.5 pt) |
| 12 tropical-destination | 5x7 | ✗ uzun ön, örnek ön | ✓ | 0.58 / 0.46 (6.1 / 4.8 pt) | 1.00 / 0.73 (9.0 / 6.6 pt) |
| 12 tropical-destination | a5 | ✗ uzun ön, örnek ön | ✓ | 0.58 / 0.46 (7.2 / 5.7 pt) | 1.00 / 0.70 (10.7 / 7.5 pt) |
| 13 enchanted-forest-storybook | 5x7 | ✗ uzun arka, uzun ön | ✓ | 1.00 / 0.88 (10.5 / 9.2 pt) | 1.00 / 0.82 (9.0 / 7.4 pt) |
| 13 enchanted-forest-storybook | a5 | ✗ uzun arka, uzun ön | ✓ | 1.00 / 0.88 (12.5 / 11.0 pt) | 1.00 / 0.82 (10.7 / 8.8 pt) |
| 14 ivory-lace-pearls | 5x7 | ✗ uzun arka, uzun ön, örnek ön | ✓ | 0.94 / 0.76 (9.8 / 7.9 pt) | 1.00 / 0.73 (9.0 / 6.6 pt) |
| 14 ivory-lace-pearls | a5 | ✗ uzun arka, uzun ön, örnek ön | ✓ | 0.94 / 0.76 (11.7 / 9.5 pt) | 1.00 / 0.73 (10.7 / 7.8 pt) |
| 15 cherry-blossom-spring | 5x7 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.94 / 0.76 (9.8 / 7.9 pt) | 0.94 / 0.67 (8.5 / 6.0 pt) |
| 15 cherry-blossom-spring | a5 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.94 / 0.76 (11.7 / 9.5 pt) | 0.94 / 0.67 (10.1 / 7.2 pt) |
| 16 sunflower-rustic-barn | 5x7 | ✗ uzun arka, uzun ön, örnek ön | ✓ | 0.73 / 0.58 (7.6 / 6.1 pt) | 1.00 / 0.76 (9.0 / 6.8 pt) |
| 16 sunflower-rustic-barn | a5 | ✗ uzun arka, uzun ön, örnek ön | ✓ | 0.73 / 0.58 (9.1 / 7.2 pt) | 1.00 / 0.76 (10.7 / 8.1 pt) |
| 17 emerald-gold-estate | 5x7 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.91 / 0.79 (9.5 / 8.3 pt) | 1.00 / 0.76 (9.0 / 6.8 pt) |
| 17 emerald-gold-estate | a5 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.91 / 0.79 (11.3 / 9.8 pt) | 1.00 / 0.76 (10.7 / 8.1 pt) |
| 18 wildflower-meadow-vellum | 5x7 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.97 / 0.73 (10.1 / 7.6 pt) | 0.88 / 0.64 (7.9 / 5.8 pt) |
| 18 wildflower-meadow-vellum | a5 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.97 / 0.73 (12.1 / 9.1 pt) | 0.88 / 0.64 (9.4 / 6.9 pt) |
| 19 midnight-garden | 5x7 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.91 / 0.70 (9.5 / 7.3 pt) | 0.91 / 0.64 (8.2 / 5.8 pt) |
| 19 midnight-garden | a5 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.91 / 0.70 (11.3 / 8.7 pt) | 0.91 / 0.64 (9.8 / 6.9 pt) |
| 20 coastal-seaside | 5x7 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.91 / 0.67 (9.5 / 7.0 pt) | 0.91 / 0.67 (8.2 / 6.0 pt) |
| 20 coastal-seaside | a5 | ✗ uzun arka, uzun ön, örnek arka, örnek ön | ✓ | 0.91 / 0.67 (11.3 / 8.3 pt) | 0.91 / 0.67 (9.8 / 7.2 pt) |
| 21 crimson-rose-atelier | 5x7 | ✗ uzun ön, örnek ön | ✓ | 0.85 / 0.67 (10.1 / 8.0 pt) | 1.00 / 0.76 (10.2 / 7.8 pt) |
| 21 crimson-rose-atelier | a5 | ✗ uzun ön, örnek ön | ✓ | 0.88 / 0.67 (12.2 / 9.3 pt) | 1.00 / 0.76 (11.9 / 9.0 pt) |
| 22 nocturne-lake-estate | 5x7 | ✓ | ✓ | 0.88 / 0.73 (10.5 / 8.7 pt) | 1.00 / 0.79 (10.2 / 8.1 pt) |
| 22 nocturne-lake-estate | a5 | ✓ | ✓ | 0.91 / 0.73 (12.6 / 10.1 pt) | 1.00 / 0.82 (11.9 / 9.8 pt) |

Önizleme (5×7, her tasarımda ön | arka): `platform/previews/g149/invitations_5x7_demo_all22.jpg` (örnek içerik),
`platform/previews/g149/invitations_5x7_long_all22.jpg` (uzun içerik).

### Otomatik test (`tests/g149-print-layout.test.ts`, 2 test, ~20 sn)
Her boyut için 22 tasarım, uzun içerik, gerçek Chromium + gerçek parçalar: (1) **sanat denetimi** — metin gizlenip yüz
fotoğraflanır; kutu + bantların içinde kâğıt renginden ayrılan, kâğıt lifinden büyük leke varsa (çiçek, çerçeve, mühür, dal)
hata, yeri yazılır ("decoration in the free text area (… px from 37 % of the card height, 77–79 % of its width)"). 5×7'de
22 tasarım, A5'te composed 21–22 (diğerlerinde A5 aynı parçanın ölçeği). 22 ön yüzde (fotoğraf) referans satırın kendi rengi.
(2) **yerleşim denetimi** — fitText'ten sonra her metin satırı (ve QR) serbest alanın ve güvenli alanın içinde, kutu taşmıyor,
tek satırlık öğe kesilmiyor. Parça değişirse (ör. G139'un 2× baskı parçaları, 21'in kart parçaları) dekor alana girerse test
düşer; kutu/bant yeniden ölçülmeli. Yazı tipi dosyaları ve parçalar test içinde önbellekli (yönlendirilen sayfada HTTP önbelleği yok).

### Açık / sınırlar (dürüst)
- **Sanatın bıraktığı alan küçük olan tasarımlarda yazı küçüldü** (çakışma yok ama): 12 Tropical ön yüz örnek içerikte ×0.58
  (5×7'de ayrıntı satırı ~6 pt), uzun içerikte ×0.46 (~4.8 pt, en alt sınır ×0.45'e yakın); 11 Boho ön uzun ×0.49 (~5 pt);
  02 Dusty ön uzun ×0.55, 16 Sunflower ön uzun ×0.58. Nedeni kart parçasında çiçek kümelerinin ortadaki yazı alanını çaprazlama
  daraltması (simetrik, ortalı klasik dizgi). **Yeni sanat olmadan daha iyisi yok:** 12 (ve tercihen 11, 02) için ortası daha
  geniş boş bir `invitation_card` GPT parçası gerekir (entegratör GPT_PROMPTS.md'ye ekleyebilir; bu görevin yazma alanında değil).
- Uzun içerikte arka yüzler (6 satır program + uzun mekân) ×0.61–0.85 (5×7'de 5.5–7.6 pt); G139'da ×0.64–0.91 idi (fark
  bantlardan: üstteki dal/mühür ve köşe süsleri artık yazı alanının dışında).
- Örnek içerikte bazı ön yüzler önceye göre küçüldü (02 ×1→0.73, 11 ×1→0.73, 16 ×1→0.73, 12 ×0.82→0.58, 04 ×1→0.85,
  21 ×1→0.85, 07 ×0.85→0.79; diğerleri ×0.91–1): önceki büyük yazı köşe çiçeklerine giriyordu.
- Kutular/bantlar sanattan otomatik ölçüldü (scratch betiği, repoda yok; yöntem: sanatı bas, kâğıt renginden ≥32 uzak + lif
  boyundan büyük lekeler, ~%2 boşluk, eksen = orta satırlardaki boş alanın ortası) ve sonra elle/gözle denetlendi; yeni parça
  gelince aynı yöntem ya da testin verdiği konumla elle ayar.
- Vercel'de denenmedi (bu görevde yayın yok); PDF yolu G139'daki gibi (aynı fitText).

### Kontroller
`platform/`: `rm -rf .next && npx tsc --noEmit` temiz · `npm test` **1337 test: 1335 geçti, 0 hata, 2 atlandı** (atlananlar
`.next` silindiği için "built output" testleri — sıra gereği, build'den önce; g139 6/6, g149 2/2) · `npm run build` + trace-check geçti
(17 rota, 23 tema). Ek: 264 yüzlük piksel denetimi (scratch) 264/264 temiz; 22 tasarımın 5×7 örnek + uzun EN + uzun DE (ön + arka)
basımlarına gözle bakıldı; 21 Crimson ve 04 Vintage yakın plan.

## Günlük
- 2026-10-17 entegratör onayladı
