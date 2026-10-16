# GM07 üretim kaydı — 2026-10-16

Ana prompt her çağrıda korundu; sonraki çağrılara görevdeki Kontrol satırını uygulayan teknik notlar eklendi. Görseller imagegen ile üretildi. Kullanıcının yalnız imagegen çıktısı kararı gereği hiçbir ham PNG üzerinde piksel, alfa, boyut veya konum değişikliği yapılmadı.

## R1

Kaynak görev: `gorevler/GM07-rotus-parcalari.md`.

Referanslar:

- `collections/15_Cherry_Blossom/assets/gpt/comps/web_2_home.png`
- `collections/15_Cherry_Blossom/assets/gpt/parts/frame_portrait.png`

Ana prompt (görevden aynen):

```
A perfectly ROUND (circular, 1:1) thin antique-gold ring photo frame entwined with blossoming cherry twigs and pink buds, realistic watercolor, centred on a transparent canvas. Inside the ring: one flat pure green #00FF00 circular window (no texture, no gradient). The ring has even thickness all around; twigs stay outside the window. Soft light from the top-left, no cast shadow, no glow outside the frame. Same style, palette and paper as the reference images. No text.
```

Deneme kaydı:

- 1. deneme: Görevdeki ana prompt aynen.
- 2. deneme: Ana prompt + 1254×1254 RGBA, opak yeşil disk, dallar ve çiçekler pencerenin dışında.
- 3. deneme: Ana prompt + yeşilin boş delik değil opak yer tutucu kart olduğu; tamamen dolu merkez.
- 4. deneme: Ana prompt + oval geometrinin tam daireye dönüşmesi; yeşil merkeze alfa uygulanmaması.
