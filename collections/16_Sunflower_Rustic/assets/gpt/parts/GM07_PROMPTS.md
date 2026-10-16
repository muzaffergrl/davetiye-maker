# GM07 üretim kaydı — 2026-10-16

Ana prompt her çağrıda korundu; sonraki çağrılara görevdeki Kontrol satırını uygulayan teknik notlar eklendi. Görseller imagegen ile üretildi. Kullanıcının yalnız imagegen çıktısı kararı gereği hiçbir ham PNG üzerinde piksel, alfa, boyut veya konum değişikliği yapılmadı.

## R3

Kaynak görev: `gorevler/GM07-rotus-parcalari.md`.

Referanslar:

- `collections/16_Sunflower_Rustic/assets/gpt/comps/web_1_envelope.png`
- `collections/16_Sunflower_Rustic/assets/gpt/parts/closure.png`
- `collections/16_Sunflower_Rustic/assets/gpt/parts/envelope_closed.png`

Ana prompt (görevden aynen):

```
Only the closure of the kraft envelope from the reference image envelope_closed.png, on a transparent canvas of exactly the same size, at exactly the same position: a wide mustard-yellow gingham fabric ribbon wrapped horizontally around the envelope, finished in a big soft bow at the center with a small sunflower head tucked into the knot and a little spray of wheat ears, baby's breath and two green leaves fanning out behind the bow. Do not draw the envelope itself. Realistic watercolor, soft light from the top-left, no cast shadow. No text.
```

Deneme kaydı:

- 1. deneme: Görevdeki ana prompt aynen.
- 2. deneme: Ana prompt + 1024×1536; bant x=58–966, y=974–1110; fiyonk merkezi yaklaşık (512,1020); hâlesiz alfa.
- 3. deneme: Ana prompt + mevcut closure.png üzerinde yalnız buğday spreyi ekleme, mevcut konum/ölçü korunması; aynı piksel koordinatları. Referans sırası W1, envelope_closed, closure.
- 4. deneme: Ana prompt + üçüncü denemenin 43 piksel yukarı alınması; ölçek ve yatay konum korunması. Ek referans: closure_r2_v3.png (ham üçüncü deneme).
