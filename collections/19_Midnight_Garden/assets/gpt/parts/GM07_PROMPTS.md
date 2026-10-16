# GM07 üretim kaydı — 2026-10-16

Ana prompt her çağrıda korundu; sonraki çağrılara görevdeki Kontrol satırını uygulayan teknik notlar eklendi. Görseller imagegen ile üretildi. Kullanıcının yalnız imagegen çıktısı kararı gereği hiçbir ham PNG üzerinde piksel, alfa, boyut veya konum değişikliği yapılmadı.

## R6

Kaynak görev: `gorevler/GM07-rotus-parcalari.md`.

Referanslar:

- `collections/19_Midnight_Garden/assets/gpt/comps/web_4_details.png`
- `collections/19_Midnight_Garden/assets/gpt/parts/frame_landscape.png`

Ana prompt (görevden aynen):

```
The same ornate baroque gilded frame as the reference frame_landscape.png, but with a wider window: the inside window is a flat pure green #00FF00 rectangle with an aspect ratio of about 2.2:1 (width:height), as in the reference details screen (W1.4). Centred on a transparent canvas, soft warm candle-like light from the top-left, no cast shadow, no glow outside the frame. No text.
```

Deneme kaydı:

- 1. deneme: Görevdeki ana prompt aynen.
- 2. deneme: Ana prompt + 1536×1024 tuval, 1056×480 pencere; 2,2:1 oranının çok geniş W1 oranından önce gelmesi.
- 3. deneme: Ana prompt + pencere (240,272)–(1296,752), 1056×480; ortada ve opak düz yeşil; süsler pencerenin dışında.
