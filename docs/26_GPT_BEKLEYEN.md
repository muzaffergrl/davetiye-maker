# GPT'den beklenen görseller

`python3 tools/gpt_bekleyen.py --yaz` ile üretilir (elle düzenlenmez). Her satır bir prompt dosyası bölümü: kaç görsel
diskte var, hangileri eksik. Prompt metni ve kayıt yolu ilgili `GPT_PROMPTS.md` dosyasındadır; görsel o yola kaydedilince
bu liste kendiliğinden kısalır. Sonrasında ilgili temanın `build_images.py` / `build-print-assets.ts` komutu çalıştırılır
(prompt dosyasında yazar).

## ChatGPT'de elle üretim (G179)

Eksik görsellerin sıralı, kendi başına yapıştırılabilir prompt listesi: `docs/27_GPT_IS_LISTESI.html` (tarayıcıda;
kopyalama düğmeleri, bitti işareti, süzgeç) ve `docs/27_GPT_IS_LISTESI.md`. İkisi bu komutla birlikte yeniden yazılır.
Her görsel listedeki **indirme adıyla** kaydedilirse `python3 tools/gpt_yerlestir.py --klasor <klasör>` hepsini
adından hedefe eşler (harita gerekmez; bilinmeyen adlar listelenir, tahmin edilmez).

## GPT görselleri gelince (G176)

Gelen dosyalar tek komutla yerleşir ve etkilenen tasarımlar yeniden kurulur:

1. İndirme adıyla geldiyse `--klasor <klasör>`; rastgele adlarla geldiyse Claude görsellere bakar,
   `{"<gelen dosya>": "<aşağıdaki listeden hedef yol>"}` haritasını yazar (JSON) ve `--eslestir harita.json` verir.
2. `python3 tools/gpt_yerlestir.py --klasor <klasör>` (ya da `--eslestir harita.json`) — KURU: her hedefin bir prompt'ta istendiğini, oran /
   şeffaflık / `#00FF00` pencere şartlarını ve var olan farklı dosyanın ezilmediğini denetler; tek red = hiçbir dosya yazılmaz.
3. Aynı komut `--uygula` ile: kopyalar, sonra her etkilenen tasarımda sırayla `build_images.py` → `build-print-assets.ts`
   → palet (`recolor_parts.py build/check`) → img/ referans + manifest denetimi → (`--theme-check`, `--ilan`: üretim
   build'i ister) → `etsy_upload.py`; en sonda bu dosyayı yeniden yazar. Tasarım × adım tablosu ve live engelleri basılır.
   Yerleştirmeden yalnız adımlar: `--koleksiyon NN|all`. Hiçbir tasarımı live yapmaz, yayınlamaz, Etsy'ye göndermez.

**Toplam eksik: 493**

| Prompt dosyası | Bölüm | Var | Eksik |
|---|---|---|---|
| `collections/01_Olive_Ivory/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/02_Dusty_Blue/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/03_Blush_Garden_Rose/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/04_Vintage_Airmail/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/05_Lemon_Mediterranean/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/06_Art_Deco_Noir/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/07_Burgundy_Velvet/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/08_Winter_Evergreen/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/09_Lavender_Provence/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/10_Tuscan_Vineyard/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/11_Boho_Pampas/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/12_Tropical_Destination/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/13_Enchanted_Forest/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/14_Ivory_Lace_Pearl/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/15_Cherry_Blossom/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/16_Sunflower_Rustic/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/17_Emerald_Gold_Estate/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/18_Wildflower_Vellum/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/19_Midnight_Garden/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/20_Coastal_Seaside/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye için yüksek çözünürlüklü parçalar | 0 | 2 |
| `collections/21_Crimson_Rose_Atelier/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye parçaları (yeni; şu an kağıt + gül dalı + mühürle geçici düzen) | 0 | 2 |
| `collections/22_Nocturne_Lake_Estate/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) | 0 | 8 |
| `collections/22_Nocturne_Lake_Estate/assets/gpt/GPT_PROMPTS.md` | PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin) | 0 | 5 |
| `collections/22_Nocturne_Lake_Estate/assets/gpt/GPT_PROMPTS.md` | G139 — Basılı davetiye parçaları (yeni; şu an göl manzarası + mühürle geçici düzen) | 0 | 2 |
| `collections/22_Nocturne_Lake_Estate/assets/gpt/GPT_PROMPTS.md` | PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) | 0 | 5 |
| `collections/23_Velvet_Jewel_Box/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — W2 parçaları (website katmanları; YAZI YOK) | 0 | 7 |
| `collections/23_Velvet_Jewel_Box/assets/gpt/GPT_PROMPTS.md` | PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin) | 0 | 5 |
| `collections/23_Velvet_Jewel_Box/assets/gpt/GPT_PROMPTS.md` | PAKET 6 — Basılı davetiye zeminleri (G139; ön + arka, 5×7 ve A5 için tek çift, 300 ppi) | 0 | 2 |
| `collections/23_Velvet_Jewel_Box/assets/gpt/GPT_PROMPTS.md` | PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) | 0 | 5 |
| `collections/24_Grand_Theatre_Premiere/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — website katmanları (YAZI YOK) | 0 | 14 |
| `collections/24_Grand_Theatre_Premiere/assets/gpt/GPT_PROMPTS.md` | PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin) | 0 | 5 |
| `collections/24_Grand_Theatre_Premiere/assets/gpt/GPT_PROMPTS.md` | PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi, taşma paylı, YAZI YOK) | 0 | 4 |
| `collections/24_Grand_Theatre_Premiere/assets/gpt/GPT_PROMPTS.md` | PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) | 0 | 5 |
| `collections/25_Orient_Express_Voyage/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok) | 0 | 16 |
| `collections/25_Orient_Express_Voyage/assets/gpt/GPT_PROMPTS.md` | PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin) | 0 | 5 |
| `collections/25_Orient_Express_Voyage/assets/gpt/GPT_PROMPTS.md` | PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi, yazı yok) | 0 | 2 |
| `collections/25_Orient_Express_Voyage/assets/gpt/GPT_PROMPTS.md` | PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) | 0 | 5 |
| `collections/26_Kintsugi_Washi/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 0 | 12 |
| `collections/26_Kintsugi_Washi/assets/gpt/GPT_PROMPTS.md` | PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin) | 0 | 5 |
| `collections/26_Kintsugi_Washi/assets/gpt/GPT_PROMPTS.md` | PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) | 0 | 2 |
| `collections/26_Kintsugi_Washi/assets/gpt/GPT_PROMPTS.md` | PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) | 0 | 5 |
| `collections/27_Riad_Lantern_Nights/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — website katmanları (YAZI YOK) | 0 | 18 |
| `collections/27_Riad_Lantern_Nights/assets/gpt/GPT_PROMPTS.md` | PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian) | 0 | 5 |
| `collections/27_Riad_Lantern_Nights/assets/gpt/GPT_PROMPTS.md` | PAKET 6 — basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK) | 0 | 2 |
| `collections/27_Riad_Lantern_Nights/assets/gpt/GPT_PROMPTS.md` | PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) | 0 | 5 |
| `collections/28_Maison_Patisserie/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 0 | 14 |
| `collections/28_Maison_Patisserie/assets/gpt/GPT_PROMPTS.md` | PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin) | 0 | 5 |
| `collections/28_Maison_Patisserie/assets/gpt/GPT_PROMPTS.md` | PAKET 6 — Basılı davetiye zeminleri (G139; ön/arka; 300 ppi; YAZI YOK) | 0 | 2 |
| `collections/28_Maison_Patisserie/assets/gpt/GPT_PROMPTS.md` | PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) | 0 | 5 |
| `collections/29_Celestial_Observatory/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 0 | 14 |
| `collections/29_Celestial_Observatory/assets/gpt/GPT_PROMPTS.md` | PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin) | 0 | 5 |
| `collections/29_Celestial_Observatory/assets/gpt/GPT_PROMPTS.md` | PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) | 0 | 2 |
| `collections/29_Celestial_Observatory/assets/gpt/GPT_PROMPTS.md` | PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) | 0 | 5 |
| `collections/30_Azulejo_Mosaic/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 0 | 12 |
| `collections/30_Azulejo_Mosaic/assets/gpt/GPT_PROMPTS.md` | PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin) | 0 | 5 |
| `collections/30_Azulejo_Mosaic/assets/gpt/GPT_PROMPTS.md` | PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5, 300 ppi) | 0 | 2 |
| `collections/30_Azulejo_Mosaic/assets/gpt/GPT_PROMPTS.md` | PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) | 0 | 5 |
| `collections/31_Sky_Lantern_Festival/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — website katmanları (YAZI YOK) | 0 | 12 |
| `collections/31_Sky_Lantern_Festival/assets/gpt/GPT_PROMPTS.md` | PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel) | 0 | 5 |
| `collections/31_Sky_Lantern_Festival/assets/gpt/GPT_PROMPTS.md` | PAKET 6 — basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK) | 0 | 2 |
| `collections/31_Sky_Lantern_Festival/assets/gpt/GPT_PROMPTS.md` | PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) | 0 | 5 |
| `collections/32_Music_Box_Ballerina/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 0 | 15 |
| `collections/32_Music_Box_Ballerina/assets/gpt/GPT_PROMPTS.md` | PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin) | 0 | 5 |
| `collections/32_Music_Box_Ballerina/assets/gpt/GPT_PROMPTS.md` | PAKET 6 — Basılı davetiye zeminleri (G139; ön/arka; 300 ppi; YAZI YOK) | 0 | 2 |
| `collections/32_Music_Box_Ballerina/assets/gpt/GPT_PROMPTS.md` | PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir) | 0 | 5 |
| `collections/33_Marigold_Mehndi/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 0 | 18 |
| `collections/33_Marigold_Mehndi/assets/gpt/GPT_PROMPTS.md` | PAKET 2 — Örnek fotoğraflar (kurgu çift Anaya & Kabir; gerçek kişiye benzemesin) | 0 | 5 |
| `collections/33_Marigold_Mehndi/assets/gpt/GPT_PROMPTS.md` | PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) | 0 | 2 |
| `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 0 | 23 |
| `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/GPT_PROMPTS.md` | PAKET 2 — Örnek fotoğraflar (kurgu çift Mei & Julian; gerçek kişiye benzemesin) | 0 | 5 |
| `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/GPT_PROMPTS.md` | PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) | 0 | 2 |
| `collections/35_Highland_Tartan_Thistle/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 0 | 20 |
| `collections/35_Highland_Tartan_Thistle/assets/gpt/GPT_PROMPTS.md` | PAKET 2 — Örnek fotoğraflar (kurgu çift Isla & Callum; gerçek kişiye benzemesin) | 0 | 5 |
| `collections/35_Highland_Tartan_Thistle/assets/gpt/GPT_PROMPTS.md` | PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) | 0 | 2 |
| `collections/36_Victorian_Glasshouse/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 0 | 19 |
| `collections/36_Victorian_Glasshouse/assets/gpt/GPT_PROMPTS.md` | PAKET 2 — Örnek fotoğraflar (kurgu çift Flora & Edmund; gerçek kişiye benzemesin) | 0 | 5 |
| `collections/36_Victorian_Glasshouse/assets/gpt/GPT_PROMPTS.md` | PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) | 0 | 2 |
| `collections/37_Art_Nouveau_Lily/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 0 | 16 |
| `collections/37_Art_Nouveau_Lily/assets/gpt/GPT_PROMPTS.md` | PAKET 2 — Örnek fotoğraflar (kurgu çift Odette & Felix; gerçek kişiye benzemesin) | 0 | 5 |
| `collections/37_Art_Nouveau_Lily/assets/gpt/GPT_PROMPTS.md` | PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) | 0 | 2 |
| `collections/38_Papel_Picado_Fiesta/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 0 | 21 |
| `collections/38_Papel_Picado_Fiesta/assets/gpt/GPT_PROMPTS.md` | PAKET 2 — Örnek fotoğraflar (kurgu çift Valeria & Diego; gerçek kişiye benzemesin) | 0 | 5 |
| `collections/38_Papel_Picado_Fiesta/assets/gpt/GPT_PROMPTS.md` | PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5) | 0 | 2 |
| `collections/16_Sunflower_Rustic/variants/GPT_PROMPTS.md` | V02_navy_sunflower · Navy & Sunflower (`navy-sunflower`) | 0 | 5 |
| `collections/16_Sunflower_Rustic/variants/GPT_PROMPTS.md` | V03_burgundy_sunflower · Burgundy & Sunflower (`burgundy-sunflower`) | 0 | 5 |
| `collections/16_Sunflower_Rustic/variants/GPT_PROMPTS.md` | V04_dusty_blue_sunflower · Dusty Blue & Sunflower (`dusty-blue-sunflower`) | 0 | 5 |
| `collections/21_Crimson_Rose_Atelier/variants/GPT_PROMPTS.md` | İstem — fildişi güller (yalnız istenirse) | 0 | 1 |

## Eksik dosyalar

### `collections/01_Olive_Ivory/assets/gpt/GPT_PROMPTS.md`

- `collections/01_Olive_Ivory/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/01_Olive_Ivory/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/02_Dusty_Blue/assets/gpt/GPT_PROMPTS.md`

- `collections/02_Dusty_Blue/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/02_Dusty_Blue/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/03_Blush_Garden_Rose/assets/gpt/GPT_PROMPTS.md`

- `collections/03_Blush_Garden_Rose/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/03_Blush_Garden_Rose/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/04_Vintage_Airmail/assets/gpt/GPT_PROMPTS.md`

- `collections/04_Vintage_Airmail/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/04_Vintage_Airmail/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/05_Lemon_Mediterranean/assets/gpt/GPT_PROMPTS.md`

- `collections/05_Lemon_Mediterranean/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/05_Lemon_Mediterranean/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/06_Art_Deco_Noir/assets/gpt/GPT_PROMPTS.md`

- `collections/06_Art_Deco_Noir/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/06_Art_Deco_Noir/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/07_Burgundy_Velvet/assets/gpt/GPT_PROMPTS.md`

- `collections/07_Burgundy_Velvet/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/07_Burgundy_Velvet/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/08_Winter_Evergreen/assets/gpt/GPT_PROMPTS.md`

- `collections/08_Winter_Evergreen/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/08_Winter_Evergreen/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/09_Lavender_Provence/assets/gpt/GPT_PROMPTS.md`

- `collections/09_Lavender_Provence/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/09_Lavender_Provence/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/10_Tuscan_Vineyard/assets/gpt/GPT_PROMPTS.md`

- `collections/10_Tuscan_Vineyard/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/10_Tuscan_Vineyard/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/11_Boho_Pampas/assets/gpt/GPT_PROMPTS.md`

- `collections/11_Boho_Pampas/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/11_Boho_Pampas/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/12_Tropical_Destination/assets/gpt/GPT_PROMPTS.md`

- `collections/12_Tropical_Destination/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/12_Tropical_Destination/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/13_Enchanted_Forest/assets/gpt/GPT_PROMPTS.md`

- `collections/13_Enchanted_Forest/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/13_Enchanted_Forest/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/14_Ivory_Lace_Pearl/assets/gpt/GPT_PROMPTS.md`

- `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/14_Ivory_Lace_Pearl/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/15_Cherry_Blossom/assets/gpt/GPT_PROMPTS.md`

- `collections/15_Cherry_Blossom/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/15_Cherry_Blossom/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/16_Sunflower_Rustic/assets/gpt/GPT_PROMPTS.md`

- `collections/16_Sunflower_Rustic/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/16_Sunflower_Rustic/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/17_Emerald_Gold_Estate/assets/gpt/GPT_PROMPTS.md`

- `collections/17_Emerald_Gold_Estate/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/17_Emerald_Gold_Estate/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/18_Wildflower_Vellum/assets/gpt/GPT_PROMPTS.md`

- `collections/18_Wildflower_Vellum/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/18_Wildflower_Vellum/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/19_Midnight_Garden/assets/gpt/GPT_PROMPTS.md`

- `collections/19_Midnight_Garden/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/19_Midnight_Garden/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/20_Coastal_Seaside/assets/gpt/GPT_PROMPTS.md`

- `collections/20_Coastal_Seaside/assets/gpt/parts/invitation_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar
- `collections/20_Coastal_Seaside/assets/gpt/parts/info_card_print.png` — G139 — Basılı davetiye için yüksek çözünürlüklü parçalar

### `collections/21_Crimson_Rose_Atelier/assets/gpt/GPT_PROMPTS.md`

- `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/invitation_card.png` — G139 — Basılı davetiye parçaları (yeni; şu an kağıt + gül dalı + mühürle geçici düzen)
- `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/info_card.png` — G139 — Basılı davetiye parçaları (yeni; şu an kağıt + gül dalı + mühürle geçici düzen)

### `collections/22_Nocturne_Lake_Estate/assets/gpt/GPT_PROMPTS.md`

- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/envelope_closed.png` — PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/closure.png` — PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/envelope_open.png` — PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/card_small.png` — PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/bg_page.png` — PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/accent_1.png` — PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/divider.png` — PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/web_hero.png` — PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/hero_portrait.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/story_1.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/story_2.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/story_3.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/photos/venue.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Eleanor & Luca; gerçek kişiye benzemesin)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/invitation_card.png` — G139 — Basılı davetiye parçaları (yeni; şu an göl manzarası + mühürle geçici düzen)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/info_card.png` — G139 — Basılı davetiye parçaları (yeni; şu an göl manzarası + mühürle geçici düzen)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/cover_hand.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/three_phones.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/laptop_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/flatlay_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/mockups/hand_phone_edit.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

### `collections/23_Velvet_Jewel_Box/assets/gpt/GPT_PROMPTS.md`

- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/box_closed.png` — PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/closure.png` — PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/box_open.png` — PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/card_small.png` — PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/bg_page.png` — PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/satin_bg.png` — PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/web_hero.png` — PAKET 5 — W2 parçaları (website katmanları; YAZI YOK)
- `collections/23_Velvet_Jewel_Box/assets/gpt/photos/hero_portrait.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin)
- `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_1.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin)
- `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_2.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin)
- `collections/23_Velvet_Jewel_Box/assets/gpt/photos/story_3.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin)
- `collections/23_Velvet_Jewel_Box/assets/gpt/photos/venue.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Isabelle & Julian; gerçek kişiye benzemesin)
- `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_front.png` — PAKET 6 — Basılı davetiye zeminleri (G139; ön + arka, 5×7 ve A5 için tek çift, 300 ppi)
- `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_back.png` — PAKET 6 — Basılı davetiye zeminleri (G139; ön + arka, 5×7 ve A5 için tek çift, 300 ppi)
- `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/cover_hand.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/three_phones.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/laptop_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/flatlay_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/23_Velvet_Jewel_Box/assets/gpt/mockups/hand_phone_edit.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

### `collections/24_Grand_Theatre_Premiere/assets/gpt/GPT_PROMPTS.md`

- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/proscenium.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_left.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_right.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_left_open.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_right_open.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/stage_back.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/card_small.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/card_plain.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/velvet_tile.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/playbill_tile.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/ticket_stub.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/bg_page.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/tassel.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/web_hero.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/hero_portrait.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_1.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_2.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/story_3.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/photos/venue.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Charlotte & Theodore; gerçek kişiye benzemesin)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_front_5x7.png` — PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi, taşma paylı, YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_back_5x7.png` — PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi, taşma paylı, YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_front_a5.png` — PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi, taşma paylı, YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_back_a5.png` — PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi, taşma paylı, YAZI YOK)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/cover_hand.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/three_phones.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/laptop_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/flatlay_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/mockups/hand_phone_edit.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

### `collections/25_Orient_Express_Voyage/assets/gpt/GPT_PROMPTS.md`

- `collections/25_Orient_Express_Voyage/assets/gpt/parts/wallet_closed.png` — PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/wallet_strap.png` — PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/wallet_inside_cover.png` — PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/wallet_inside.png` — PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/wallet_pocket.png` — PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/bg_station.png` — PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/ticket.png` — PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/poster_hero.png` — PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/map.png` — PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/luggage_tag.png` — PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/station_clock.png` — PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/carriage_window.png` — PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/carriage_wall.png` — PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/bg_paper.png` — PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/boarding_pass.png` — PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/stamp.png` — PAKET 5 — Website katmanları (W2; şeffaflar gerçek alfa, düşen gölge yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/photos/hero_portrait.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin)
- `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_1.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin)
- `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_2.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin)
- `collections/25_Orient_Express_Voyage/assets/gpt/photos/story_3.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin)
- `collections/25_Orient_Express_Voyage/assets/gpt/photos/venue.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Amelia & Rafael; gerçek kişiye benzemesin)
- `collections/25_Orient_Express_Voyage/assets/gpt/print/invitation_front_5x7.png` — PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi, yazı yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/print/invitation_back_5x7.png` — PAKET 6 — Basılı davetiye zeminleri (G139; 300 ppi, yazı yok)
- `collections/25_Orient_Express_Voyage/assets/gpt/mockups/cover_hand.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/25_Orient_Express_Voyage/assets/gpt/mockups/three_phones.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/25_Orient_Express_Voyage/assets/gpt/mockups/laptop_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/25_Orient_Express_Voyage/assets/gpt/mockups/flatlay_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/25_Orient_Express_Voyage/assets/gpt/mockups/hand_phone_edit.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

### `collections/26_Kintsugi_Washi/assets/gpt/GPT_PROMPTS.md`

- `collections/26_Kintsugi_Washi/assets/gpt/parts/washi_indigo.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/washi_inner.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/rice_paper.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/kintsugi_veins.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/ink_bleed.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/sumi_stroke.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/gold_flake_1.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/gold_flake_2.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/gold_flake_3.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/obi_band.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/card_small.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/web_hero.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/26_Kintsugi_Washi/assets/gpt/photos/hero_portrait.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin)
- `collections/26_Kintsugi_Washi/assets/gpt/photos/story_1.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin)
- `collections/26_Kintsugi_Washi/assets/gpt/photos/story_2.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin)
- `collections/26_Kintsugi_Washi/assets/gpt/photos/story_3.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin)
- `collections/26_Kintsugi_Washi/assets/gpt/photos/venue.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Naomi & Kai; gerçek kişiye benzemesin)
- `collections/26_Kintsugi_Washi/assets/gpt/print/invitation_front_5x7.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)
- `collections/26_Kintsugi_Washi/assets/gpt/print/invitation_back_5x7.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)
- `collections/26_Kintsugi_Washi/assets/gpt/mockups/cover_hand.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/26_Kintsugi_Washi/assets/gpt/mockups/three_phones.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/26_Kintsugi_Washi/assets/gpt/mockups/laptop_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/26_Kintsugi_Washi/assets/gpt/mockups/flatlay_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/26_Kintsugi_Washi/assets/gpt/mockups/hand_phone_edit.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

### `collections/27_Riad_Lantern_Nights/assets/gpt/GPT_PROMPTS.md`

- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/doors_closed.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/doorway.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/courtyard.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/card_small.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/lantern.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/bg_page.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/bg_tile.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/tile_1.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/tile_2.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/tile_3.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/tile_4.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/frame_arch.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/frame_landscape.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/bougainvillea_tl.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/bougainvillea_br.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/divider.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/accent_1.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/web_hero.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/photos/hero_portrait.jpg` — PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian)
- `collections/27_Riad_Lantern_Nights/assets/gpt/photos/story_1.jpg` — PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian)
- `collections/27_Riad_Lantern_Nights/assets/gpt/photos/story_2.jpg` — PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian)
- `collections/27_Riad_Lantern_Nights/assets/gpt/photos/story_3.jpg` — PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian)
- `collections/27_Riad_Lantern_Nights/assets/gpt/photos/venue.jpg` — PAKET 2 — örnek fotoğraflar (kurgu çift: Leila & Adrian)
- `collections/27_Riad_Lantern_Nights/assets/gpt/print/print_front.png` — PAKET 6 — basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/print/print_back.png` — PAKET 6 — basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK)
- `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/cover_hand.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/three_phones.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/laptop_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/flatlay_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/27_Riad_Lantern_Nights/assets/gpt/mockups/hand_phone_edit.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

### `collections/28_Maison_Patisserie/assets/gpt/GPT_PROMPTS.md`

- `collections/28_Maison_Patisserie/assets/gpt/parts/box_base.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/28_Maison_Patisserie/assets/gpt/parts/tissue_left.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/28_Maison_Patisserie/assets/gpt/parts/tissue_right.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/28_Maison_Patisserie/assets/gpt/parts/lid.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/28_Maison_Patisserie/assets/gpt/parts/ribbon_cross.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/28_Maison_Patisserie/assets/gpt/parts/bow_left.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/28_Maison_Patisserie/assets/gpt/parts/bow_right.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/28_Maison_Patisserie/assets/gpt/parts/bow_knot.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/28_Maison_Patisserie/assets/gpt/parts/card_small.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/28_Maison_Patisserie/assets/gpt/parts/bg_page.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/28_Maison_Patisserie/assets/gpt/parts/bg_tile.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/28_Maison_Patisserie/assets/gpt/parts/shelf.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/28_Maison_Patisserie/assets/gpt/parts/accent_1.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/28_Maison_Patisserie/assets/gpt/parts/web_hero.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/28_Maison_Patisserie/assets/gpt/photos/hero_portrait.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin)
- `collections/28_Maison_Patisserie/assets/gpt/photos/story_1.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin)
- `collections/28_Maison_Patisserie/assets/gpt/photos/story_2.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin)
- `collections/28_Maison_Patisserie/assets/gpt/photos/story_3.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin)
- `collections/28_Maison_Patisserie/assets/gpt/photos/venue.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Camille & Oliver; gerçek kişiye benzemesin)
- `collections/28_Maison_Patisserie/assets/gpt/print/invitation_front.png` — PAKET 6 — Basılı davetiye zeminleri (G139; ön/arka; 300 ppi; YAZI YOK)
- `collections/28_Maison_Patisserie/assets/gpt/print/invitation_back.png` — PAKET 6 — Basılı davetiye zeminleri (G139; ön/arka; 300 ppi; YAZI YOK)
- `collections/28_Maison_Patisserie/assets/gpt/mockups/cover_hand.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/28_Maison_Patisserie/assets/gpt/mockups/three_phones.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/28_Maison_Patisserie/assets/gpt/mockups/laptop_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/28_Maison_Patisserie/assets/gpt/mockups/flatlay_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/28_Maison_Patisserie/assets/gpt/mockups/hand_phone_edit.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

### `collections/29_Celestial_Observatory/assets/gpt/GPT_PROMPTS.md`

- `collections/29_Celestial_Observatory/assets/gpt/parts/night_sky.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/29_Celestial_Observatory/assets/gpt/parts/chart_paper.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/29_Celestial_Observatory/assets/gpt/parts/dome.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/29_Celestial_Observatory/assets/gpt/parts/shutter.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/29_Celestial_Observatory/assets/gpt/parts/star_1.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/29_Celestial_Observatory/assets/gpt/parts/star_2.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/29_Celestial_Observatory/assets/gpt/parts/star_3.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/29_Celestial_Observatory/assets/gpt/parts/star_chart.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/29_Celestial_Observatory/assets/gpt/parts/planisphere_ring.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/29_Celestial_Observatory/assets/gpt/parts/astrolabe.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/29_Celestial_Observatory/assets/gpt/parts/moon_phases.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/29_Celestial_Observatory/assets/gpt/parts/orbits.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/29_Celestial_Observatory/assets/gpt/parts/card_small.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/29_Celestial_Observatory/assets/gpt/parts/web_hero.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/29_Celestial_Observatory/assets/gpt/photos/hero_portrait.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin)
- `collections/29_Celestial_Observatory/assets/gpt/photos/story_1.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin)
- `collections/29_Celestial_Observatory/assets/gpt/photos/story_2.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin)
- `collections/29_Celestial_Observatory/assets/gpt/photos/story_3.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin)
- `collections/29_Celestial_Observatory/assets/gpt/photos/venue.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Celeste & Rowan; gerçek kişiye benzemesin)
- `collections/29_Celestial_Observatory/assets/gpt/print/invitation_front_5x7.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)
- `collections/29_Celestial_Observatory/assets/gpt/print/invitation_back_5x7.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)
- `collections/29_Celestial_Observatory/assets/gpt/mockups/cover_hand.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/29_Celestial_Observatory/assets/gpt/mockups/three_phones.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/29_Celestial_Observatory/assets/gpt/mockups/laptop_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/29_Celestial_Observatory/assets/gpt/mockups/flatlay_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/29_Celestial_Observatory/assets/gpt/mockups/hand_phone_edit.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

### `collections/30_Azulejo_Mosaic/assets/gpt/GPT_PROMPTS.md`

- `collections/30_Azulejo_Mosaic/assets/gpt/parts/azulejo_1.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/azulejo_2.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/azulejo_3.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/azulejo_4.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/tile_back.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/cobalt_wall.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/lime_wash.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/card_paper.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/frieze.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/pot_left.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/pot_right.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/web_hero.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/30_Azulejo_Mosaic/assets/gpt/photos/hero_portrait.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin)
- `collections/30_Azulejo_Mosaic/assets/gpt/photos/story_1.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin)
- `collections/30_Azulejo_Mosaic/assets/gpt/photos/story_2.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin)
- `collections/30_Azulejo_Mosaic/assets/gpt/photos/story_3.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin)
- `collections/30_Azulejo_Mosaic/assets/gpt/photos/venue.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Inês & Mateo; gerçek kişiye benzemesin)
- `collections/30_Azulejo_Mosaic/assets/gpt/print/invitation_front.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5, 300 ppi)
- `collections/30_Azulejo_Mosaic/assets/gpt/print/invitation_back.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5, 300 ppi)
- `collections/30_Azulejo_Mosaic/assets/gpt/mockups/cover_hand.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/30_Azulejo_Mosaic/assets/gpt/mockups/three_phones.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/30_Azulejo_Mosaic/assets/gpt/mockups/laptop_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/30_Azulejo_Mosaic/assets/gpt/mockups/flatlay_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/30_Azulejo_Mosaic/assets/gpt/mockups/hand_phone_edit.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

### `collections/31_Sky_Lantern_Festival/assets/gpt/GPT_PROMPTS.md`

- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/hands.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/lantern_dark.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/lantern_lit.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/sky_dusk.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/star_dust.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/lantern_far.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/card_small.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/bg_tile.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/frame_paper.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/frame_landscape.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/divider.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/web_hero.png` — PAKET 5 — website katmanları (YAZI YOK)
- `collections/31_Sky_Lantern_Festival/assets/gpt/photos/hero_portrait.jpg` — PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel)
- `collections/31_Sky_Lantern_Festival/assets/gpt/photos/story_1.jpg` — PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel)
- `collections/31_Sky_Lantern_Festival/assets/gpt/photos/story_2.jpg` — PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel)
- `collections/31_Sky_Lantern_Festival/assets/gpt/photos/story_3.jpg` — PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel)
- `collections/31_Sky_Lantern_Festival/assets/gpt/photos/venue.jpg` — PAKET 2 — örnek fotoğraflar (kurgu çift: Sophie & Daniel)
- `collections/31_Sky_Lantern_Festival/assets/gpt/print/print_front.png` — PAKET 6 — basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK)
- `collections/31_Sky_Lantern_Festival/assets/gpt/print/print_back.png` — PAKET 6 — basılı davetiye zeminleri (G139; 300 ppi; YAZI YOK)
- `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/cover_hand.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/three_phones.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/laptop_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/flatlay_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/31_Sky_Lantern_Festival/assets/gpt/mockups/hand_phone_edit.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

### `collections/32_Music_Box_Ballerina/assets/gpt/GPT_PROMPTS.md`

- `collections/32_Music_Box_Ballerina/assets/gpt/parts/lid_open.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/interior.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/box_body.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/lid_closed.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/key.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/dancer.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/dancer_turn_a.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/dancer_turn_b.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/card_small.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/petal_1.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/petal_2.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/petal_3.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/bg_page.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/satin_bg.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/web_hero.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/32_Music_Box_Ballerina/assets/gpt/photos/hero_portrait.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin)
- `collections/32_Music_Box_Ballerina/assets/gpt/photos/story_1.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin)
- `collections/32_Music_Box_Ballerina/assets/gpt/photos/story_2.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin)
- `collections/32_Music_Box_Ballerina/assets/gpt/photos/story_3.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin)
- `collections/32_Music_Box_Ballerina/assets/gpt/photos/venue.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Juliette & Arthur; gerçek kişiye benzemesin)
- `collections/32_Music_Box_Ballerina/assets/gpt/print/invitation_front.png` — PAKET 6 — Basılı davetiye zeminleri (G139; ön/arka; 300 ppi; YAZI YOK)
- `collections/32_Music_Box_Ballerina/assets/gpt/print/invitation_back.png` — PAKET 6 — Basılı davetiye zeminleri (G139; ön/arka; 300 ppi; YAZI YOK)
- `collections/32_Music_Box_Ballerina/assets/gpt/mockups/cover_hand.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/32_Music_Box_Ballerina/assets/gpt/mockups/three_phones.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/32_Music_Box_Ballerina/assets/gpt/mockups/laptop_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/32_Music_Box_Ballerina/assets/gpt/mockups/flatlay_phone.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)
- `collections/32_Music_Box_Ballerina/assets/gpt/mockups/hand_phone_edit.png` — PAKET 3 — Etsy ilan sahneleri (görev G175; GPT tasarlar, Claude gerçek ekranları yeşile yerleştirir)

### `collections/33_Marigold_Mehndi/assets/gpt/GPT_PROMPTS.md`

- `collections/33_Marigold_Mehndi/assets/gpt/parts/silk.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/sleeve.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/petal_1.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/petal_2.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/petal_3.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/jharokha.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/henna.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/diya.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/flame.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/garland.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/mehndi_pattern.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/card_small.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/tassel.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/envelope_front.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/flap.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/velvet.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/paper.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/web_hero.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/photos/hero_portrait.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Anaya & Kabir; gerçek kişiye benzemesin)
- `collections/33_Marigold_Mehndi/assets/gpt/photos/story_1.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Anaya & Kabir; gerçek kişiye benzemesin)
- `collections/33_Marigold_Mehndi/assets/gpt/photos/story_2.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Anaya & Kabir; gerçek kişiye benzemesin)
- `collections/33_Marigold_Mehndi/assets/gpt/photos/story_3.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Anaya & Kabir; gerçek kişiye benzemesin)
- `collections/33_Marigold_Mehndi/assets/gpt/photos/venue.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Anaya & Kabir; gerçek kişiye benzemesin)
- `collections/33_Marigold_Mehndi/assets/gpt/print/invitation_front_5x7.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)
- `collections/33_Marigold_Mehndi/assets/gpt/print/invitation_back_5x7.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

### `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/GPT_PROMPTS.md`

- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/lacquer.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/red_paper.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/cream_paper.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/gold_leaf.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/envelope_back.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/envelope_pocket.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/envelope_flap.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/flap_inside.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/button.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/string.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/xi_gold.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/veil_outer.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/veil_inner.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/card_small.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/cloud_1.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/cloud_2.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/cloud_3.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/moon_gate.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/peony_band.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/jianzhi_far.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/jianzhi_near.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/tassel.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/web_hero.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/hero_portrait.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Mei & Julian; gerçek kişiye benzemesin)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/story_1.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Mei & Julian; gerçek kişiye benzemesin)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/story_2.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Mei & Julian; gerçek kişiye benzemesin)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/story_3.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Mei & Julian; gerçek kişiye benzemesin)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/photos/venue.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Mei & Julian; gerçek kişiye benzemesin)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/print/invitation_front_5x7.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/print/invitation_back_5x7.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

### `collections/35_Highland_Tartan_Thistle/assets/gpt/GPT_PROMPTS.md`

- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/tartan_wool.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/cream_paper.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/moss_ground.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/hills.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/mist.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/envelope_back.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/envelope_front.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/flap.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/strap.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/buckle.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_sprig.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_divider.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_floret_1.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_floret_2.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/heather_floret_3.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/locket_rim.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/locket_lid.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/thistle.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/card_small.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/web_hero.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/hero_portrait.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Isla & Callum; gerçek kişiye benzemesin)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/story_1.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Isla & Callum; gerçek kişiye benzemesin)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/story_2.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Isla & Callum; gerçek kişiye benzemesin)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/story_3.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Isla & Callum; gerçek kişiye benzemesin)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/photos/venue.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Isla & Callum; gerçek kişiye benzemesin)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/print/invitation_front_5x7.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/print/invitation_back_5x7.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

### `collections/36_Victorian_Glasshouse/assets/gpt/GPT_PROMPTS.md`

- `collections/36_Victorian_Glasshouse/assets/gpt/parts/fern_ground.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/glass_ground.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/herbarium_paper.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/packet_body.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/packet_flap.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/packet_flap_in.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/copper_tag.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/twine.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/glass_mist.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/ironwork.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/ferns.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/orchid_sprig.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/specimen_frame.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/herbarium_label.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/leaf_1.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/leaf_2.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/leaf_3.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/card_small.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/web_hero.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/photos/hero_portrait.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Flora & Edmund; gerçek kişiye benzemesin)
- `collections/36_Victorian_Glasshouse/assets/gpt/photos/story_1.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Flora & Edmund; gerçek kişiye benzemesin)
- `collections/36_Victorian_Glasshouse/assets/gpt/photos/story_2.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Flora & Edmund; gerçek kişiye benzemesin)
- `collections/36_Victorian_Glasshouse/assets/gpt/photos/story_3.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Flora & Edmund; gerçek kişiye benzemesin)
- `collections/36_Victorian_Glasshouse/assets/gpt/photos/venue.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Flora & Edmund; gerçek kişiye benzemesin)
- `collections/36_Victorian_Glasshouse/assets/gpt/print/invitation_front_5x7.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)
- `collections/36_Victorian_Glasshouse/assets/gpt/print/invitation_back_5x7.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

### `collections/37_Art_Nouveau_Lily/assets/gpt/GPT_PROMPTS.md`

- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/cream_paper.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/sage_paper.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/lilac_lining.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/env_back.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/env_pocket.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_left.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_right.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_centre.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/lily_medallion.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/card_small.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/arch_window.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/halo.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/lily_spray.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/whiplash.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_drift.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/web_hero.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/37_Art_Nouveau_Lily/assets/gpt/photos/hero_portrait.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Odette & Felix; gerçek kişiye benzemesin)
- `collections/37_Art_Nouveau_Lily/assets/gpt/photos/story_1.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Odette & Felix; gerçek kişiye benzemesin)
- `collections/37_Art_Nouveau_Lily/assets/gpt/photos/story_2.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Odette & Felix; gerçek kişiye benzemesin)
- `collections/37_Art_Nouveau_Lily/assets/gpt/photos/story_3.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Odette & Felix; gerçek kişiye benzemesin)
- `collections/37_Art_Nouveau_Lily/assets/gpt/photos/venue.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Odette & Felix; gerçek kişiye benzemesin)
- `collections/37_Art_Nouveau_Lily/assets/gpt/print/invitation_front_5x7.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)
- `collections/37_Art_Nouveau_Lily/assets/gpt/print/invitation_back_5x7.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

### `collections/38_Papel_Picado_Fiesta/assets/gpt/GPT_PROMPTS.md`

- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/kraft_paper.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/limewash_wall.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/cream_paper.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/terracotta.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/envelope_pocket.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/envelope_flap.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flap_liner.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_1.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_2.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_3.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_4.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_5.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/flag_6.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/bulb.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/frame_1.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/frame_2.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/frame_3.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/frame_wide.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/bougainvillea.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/embroidery_band.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/web_hero.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/hero_portrait.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Valeria & Diego; gerçek kişiye benzemesin)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/story_1.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Valeria & Diego; gerçek kişiye benzemesin)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/story_2.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Valeria & Diego; gerçek kişiye benzemesin)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/story_3.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Valeria & Diego; gerçek kişiye benzemesin)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/photos/venue.jpg` — PAKET 2 — Örnek fotoğraflar (kurgu çift Valeria & Diego; gerçek kişiye benzemesin)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/print/invitation_front_5x7.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/print/invitation_back_5x7.png` — PAKET 6 — Basılı davetiye (G139; 5×7 in ve A5)

### `collections/16_Sunflower_Rustic/variants/GPT_PROMPTS.md`

- `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/closure.png` — V02_navy_sunflower · Navy & Sunflower (`navy-sunflower`)
- `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/closure_r2_v3.png` — V02_navy_sunflower · Navy & Sunflower (`navy-sunflower`)
- `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/invitation_card.png` — V02_navy_sunflower · Navy & Sunflower (`navy-sunflower`)
- `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/info_card.png` — V02_navy_sunflower · Navy & Sunflower (`navy-sunflower`)
- `collections/16_Sunflower_Rustic/variants/V02_navy_sunflower/gpt/web_hero.png` — V02_navy_sunflower · Navy & Sunflower (`navy-sunflower`)
- `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/closure.png` — V03_burgundy_sunflower · Burgundy & Sunflower (`burgundy-sunflower`)
- `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/closure_r2_v3.png` — V03_burgundy_sunflower · Burgundy & Sunflower (`burgundy-sunflower`)
- `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/invitation_card.png` — V03_burgundy_sunflower · Burgundy & Sunflower (`burgundy-sunflower`)
- `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/info_card.png` — V03_burgundy_sunflower · Burgundy & Sunflower (`burgundy-sunflower`)
- `collections/16_Sunflower_Rustic/variants/V03_burgundy_sunflower/gpt/web_hero.png` — V03_burgundy_sunflower · Burgundy & Sunflower (`burgundy-sunflower`)
- `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/closure.png` — V04_dusty_blue_sunflower · Dusty Blue & Sunflower (`dusty-blue-sunflower`)
- `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/closure_r2_v3.png` — V04_dusty_blue_sunflower · Dusty Blue & Sunflower (`dusty-blue-sunflower`)
- `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/invitation_card.png` — V04_dusty_blue_sunflower · Dusty Blue & Sunflower (`dusty-blue-sunflower`)
- `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/info_card.png` — V04_dusty_blue_sunflower · Dusty Blue & Sunflower (`dusty-blue-sunflower`)
- `collections/16_Sunflower_Rustic/variants/V04_dusty_blue_sunflower/gpt/web_hero.png` — V04_dusty_blue_sunflower · Dusty Blue & Sunflower (`dusty-blue-sunflower`)

### `collections/21_Crimson_Rose_Atelier/variants/GPT_PROMPTS.md`

- `collections/21_Crimson_Rose_Atelier/variants/V07_ivory_rose/gpt/rose-branch.png` — İstem — fildişi güller (yalnız istenirse)
