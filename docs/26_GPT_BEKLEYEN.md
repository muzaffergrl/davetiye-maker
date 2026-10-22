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

**Toplam eksik: 276**

| Prompt dosyası | Bölüm | Var | Eksik |
|---|---|---|---|
| `collections/22_Nocturne_Lake_Estate/assets/gpt/GPT_PROMPTS.md` | PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım) | 0 | 22 |
| `collections/22_Nocturne_Lake_Estate/assets/gpt/GPT_PROMPTS.md` | PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm) | 2 | 2 |
| `collections/23_Velvet_Jewel_Box/assets/gpt/GPT_PROMPTS.md` | PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım) | 0 | 20 |
| `collections/23_Velvet_Jewel_Box/assets/gpt/GPT_PROMPTS.md` | PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm) | 2 | 2 |
| `collections/24_Grand_Theatre_Premiere/assets/gpt/GPT_PROMPTS.md` | PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım) | 0 | 23 |
| `collections/24_Grand_Theatre_Premiere/assets/gpt/GPT_PROMPTS.md` | PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm) | 1 | 2 |
| `collections/25_Orient_Express_Voyage/assets/gpt/GPT_PROMPTS.md` | PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım) | 0 | 21 |
| `collections/25_Orient_Express_Voyage/assets/gpt/GPT_PROMPTS.md` | PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm) | 2 | 2 |
| `collections/26_Kintsugi_Washi/assets/gpt/GPT_PROMPTS.md` | PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım) | 0 | 26 |
| `collections/26_Kintsugi_Washi/assets/gpt/GPT_PROMPTS.md` | PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm) | 2 | 2 |
| `collections/27_Riad_Lantern_Nights/assets/gpt/GPT_PROMPTS.md` | PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım) | 0 | 22 |
| `collections/27_Riad_Lantern_Nights/assets/gpt/GPT_PROMPTS.md` | PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm) | 2 | 2 |
| `collections/28_Maison_Patisserie/assets/gpt/GPT_PROMPTS.md` | PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım) | 0 | 22 |
| `collections/28_Maison_Patisserie/assets/gpt/GPT_PROMPTS.md` | PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm) | 2 | 2 |
| `collections/29_Celestial_Observatory/assets/gpt/GPT_PROMPTS.md` | PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım) | 0 | 20 |
| `collections/29_Celestial_Observatory/assets/gpt/GPT_PROMPTS.md` | PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm) | 1 | 2 |
| `collections/30_Azulejo_Mosaic/assets/gpt/GPT_PROMPTS.md` | PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım) | 0 | 22 |
| `collections/30_Azulejo_Mosaic/assets/gpt/GPT_PROMPTS.md` | PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm) | 2 | 2 |
| `collections/31_Sky_Lantern_Festival/assets/gpt/GPT_PROMPTS.md` | PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım) | 0 | 21 |
| `collections/31_Sky_Lantern_Festival/assets/gpt/GPT_PROMPTS.md` | PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm) | 2 | 2 |
| `collections/32_Music_Box_Ballerina/assets/gpt/GPT_PROMPTS.md` | PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım) | 0 | 20 |
| `collections/32_Music_Box_Ballerina/assets/gpt/GPT_PROMPTS.md` | PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm) | 2 | 2 |
| `collections/33_Marigold_Mehndi/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 15 | 3 |
| `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 20 | 3 |
| `collections/35_Highland_Tartan_Thistle/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 18 | 2 |
| `collections/36_Victorian_Glasshouse/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 17 | 2 |
| `collections/37_Art_Nouveau_Lily/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 14 | 2 |
| `collections/38_Papel_Picado_Fiesta/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 19 | 2 |
| `collections/21_Crimson_Rose_Atelier/variants/GPT_PROMPTS.md` | İstem — fildişi güller (yalnız istenirse) | 0 | 1 |

## Eksik dosyalar

### `collections/22_Nocturne_Lake_Estate/assets/gpt/GPT_PROMPTS.md`

- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/night_laid.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/ivory_laid.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/env_back.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/env_front.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/flap.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/flap_in.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/vellum_band.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/moon_brooch.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/card_small.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/window_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/story_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/shutter_left.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/shutter_right.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/terrace_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/nocturne_band.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/corner_spray.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/divider.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/candle_lantern.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/accent_1.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/accent_2.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/accent_3.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/parts/web_hero.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/print/invitation_front_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)
- `collections/22_Nocturne_Lake_Estate/assets/gpt/print/invitation_back_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

### `collections/23_Velvet_Jewel_Box/assets/gpt/GPT_PROMPTS.md`

- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/moire_ground.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/ivory_paper.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/velvet.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/env_back.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/env_front.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/flap.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/flap_in.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/ribbon_band.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/ring.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/card_small.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/cameo_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/tray_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/venue_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/corner_spray.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/divider.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/ring_box.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/accent_1.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/accent_2.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/accent_3.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/parts/web_hero.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_front_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)
- `collections/23_Velvet_Jewel_Box/assets/gpt/print/invitation_back_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

### `collections/24_Grand_Theatre_Premiere/assets/gpt/GPT_PROMPTS.md`

- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/page_ground.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/card_paper.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/velvet_ground.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/env_back.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/env_front.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_left.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_right.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_left_in.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/curtain_right_in.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/valance.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/ticket.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/rope.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/card_small.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/portrait_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/story_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/venue_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/corner_ornament.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/divider.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/opera_glasses.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/accent_1.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/accent_2.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/accent_3.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/parts/web_hero.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_front_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)
- `collections/24_Grand_Theatre_Premiere/assets/gpt/print/invitation_back_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

### `collections/25_Orient_Express_Voyage/assets/gpt/GPT_PROMPTS.md`

- `collections/25_Orient_Express_Voyage/assets/gpt/parts/page_ground.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/ticket_paper.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/env_back.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/env_front.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/flap.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/flap_in.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/lock_plate.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/lock_key.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/luggage_tag.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/card_small.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/portrait_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/story_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/venue_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/corner_spray.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/divider.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/pocket_watch.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/route_map.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/accent_1.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/accent_2.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/accent_3.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/parts/web_hero.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/25_Orient_Express_Voyage/assets/gpt/print/invitation_front_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)
- `collections/25_Orient_Express_Voyage/assets/gpt/print/invitation_back_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

### `collections/26_Kintsugi_Washi/assets/gpt/GPT_PROMPTS.md`

- `collections/26_Kintsugi_Washi/assets/gpt/parts/page_ground.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/card_paper.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/env_back.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/flap_n.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/flap_e.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/flap_s.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/flap_w.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/flap_in_n.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/flap_in_e.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/flap_in_s.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/flap_in_w.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/cord_band.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/button.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/card_small.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/frame_portrait.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/frame_story.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/frame_story_wide.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/frame_venue.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/ink_bloom.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/corner_sprig.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/divider.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/mended_bowl.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/accent_1.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/accent_2.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/accent_3.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/parts/web_hero.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/26_Kintsugi_Washi/assets/gpt/print/invitation_front_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)
- `collections/26_Kintsugi_Washi/assets/gpt/print/invitation_back_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

### `collections/27_Riad_Lantern_Nights/assets/gpt/GPT_PROMPTS.md`

- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/tadelakt_ground.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/cotton_paper.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/env_back.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/env_front.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/flap.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/flap_in.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/stud.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/cord.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/lantern_unlit.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/lantern_lit.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/card_small.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/arch_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/story_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/venue_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/corner_spray.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/divider.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/hanging_lantern.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/zellige_tile.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/accent_1.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/accent_2.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/accent_3.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/parts/web_hero.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/27_Riad_Lantern_Nights/assets/gpt/print/invitation_front_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)
- `collections/27_Riad_Lantern_Nights/assets/gpt/print/invitation_back_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

### `collections/28_Maison_Patisserie/assets/gpt/GPT_PROMPTS.md`

- `collections/28_Maison_Patisserie/assets/gpt/parts/page_ground.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/cream_paper.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/env_back.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/env_front.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/flap.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/flap_in.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/sleeve_band.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/bow.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/bow_untied.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/rosebud.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/card_small.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/cameo_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/plate_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/shelf.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/vitrine_wide.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/corner_spray.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/divider.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/cake_stand.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/accent_1.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/accent_2.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/accent_3.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/parts/web_hero.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/28_Maison_Patisserie/assets/gpt/print/invitation_front_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)
- `collections/28_Maison_Patisserie/assets/gpt/print/invitation_back_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

### `collections/29_Celestial_Observatory/assets/gpt/GPT_PROMPTS.md`

- `collections/29_Celestial_Observatory/assets/gpt/parts/night_paper.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/chart_paper.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/env_back.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/env_front.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/flap.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/flap_in.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/astro_plate.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/astro_rete.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/card_small.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/medallion_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/planisphere_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/planisphere_dial.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/venue_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/corner_ornament.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/divider.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/telescope.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/accent_1.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/accent_2.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/accent_3.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/parts/web_hero.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/29_Celestial_Observatory/assets/gpt/print/invitation_front_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)
- `collections/29_Celestial_Observatory/assets/gpt/print/invitation_back_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

### `collections/30_Azulejo_Mosaic/assets/gpt/GPT_PROMPTS.md`

- `collections/30_Azulejo_Mosaic/assets/gpt/parts/whitewash_ground.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/glaze_paper.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/env_back.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/env_front.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/flap.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/flap_in.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/twine.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/tile_front.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/tile_back.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/card_small.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/niche_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/story_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/venue_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/corner_spray.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/divider.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/terracotta_pot.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/mosaic_tile_a.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/mosaic_tile_b.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/accent_1.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/accent_2.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/accent_3.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/parts/web_hero.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/30_Azulejo_Mosaic/assets/gpt/print/invitation_front_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)
- `collections/30_Azulejo_Mosaic/assets/gpt/print/invitation_back_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

### `collections/31_Sky_Lantern_Festival/assets/gpt/GPT_PROMPTS.md`

- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/dusk_ground.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/dusk_tile.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/rice_paper.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/env_back.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/env_front.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/flap.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/flap_in.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/lantern_unlit.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/lantern_lit.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/silk_thread.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/card_small.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/lantern_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/paper_panel.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/wide_panel.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/far_lantern.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/corner_spray.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/divider.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/accent_1.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/accent_2.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/accent_3.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/parts/web_hero.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/31_Sky_Lantern_Festival/assets/gpt/print/invitation_front_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)
- `collections/31_Sky_Lantern_Festival/assets/gpt/print/invitation_back_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

### `collections/32_Music_Box_Ballerina/assets/gpt/GPT_PROMPTS.md`

- `collections/32_Music_Box_Ballerina/assets/gpt/parts/page_ground.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/card_paper.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/env_back.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/env_front.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/flap.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/flap_in.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/escutcheon.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/key.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/ballerina_front.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/ballerina_back.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/card_small.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/portrait_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/mirror_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/venue_frame.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/corner_spray.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/divider.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/accent_1.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/accent_2.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/accent_3.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/parts/web_hero.png` — PAKET 5R — Website katmanları (YAZI YOK; 2026-10-22 yeniden tasarım)
- `collections/32_Music_Box_Ballerina/assets/gpt/print/invitation_front_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)
- `collections/32_Music_Box_Ballerina/assets/gpt/print/invitation_back_r_5x7.png` — PAKET 6R — Basılı davetiye (G139; 5×7 in; 2026-10-22 yeni görünüm)

### `collections/33_Marigold_Mehndi/assets/gpt/GPT_PROMPTS.md`

- `collections/33_Marigold_Mehndi/assets/gpt/parts/sleeve.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/mehndi_pattern.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/33_Marigold_Mehndi/assets/gpt/parts/flap.png` — PAKET 5 — Website katmanları (YAZI YOK)

### `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/GPT_PROMPTS.md`

- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/envelope_pocket.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/veil_outer.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/parts/veil_inner.png` — PAKET 5 — Website katmanları (YAZI YOK)

### `collections/35_Highland_Tartan_Thistle/assets/gpt/GPT_PROMPTS.md`

- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/envelope_front.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/35_Highland_Tartan_Thistle/assets/gpt/parts/flap.png` — PAKET 5 — Website katmanları (YAZI YOK)

### `collections/36_Victorian_Glasshouse/assets/gpt/GPT_PROMPTS.md`

- `collections/36_Victorian_Glasshouse/assets/gpt/parts/copper_tag.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/36_Victorian_Glasshouse/assets/gpt/parts/ferns.png` — PAKET 5 — Website katmanları (YAZI YOK)

### `collections/37_Art_Nouveau_Lily/assets/gpt/GPT_PROMPTS.md`

- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_right.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/37_Art_Nouveau_Lily/assets/gpt/parts/petal_centre.png` — PAKET 5 — Website katmanları (YAZI YOK)

### `collections/38_Papel_Picado_Fiesta/assets/gpt/GPT_PROMPTS.md`

- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/envelope_pocket.png` — PAKET 5 — Website katmanları (YAZI YOK)
- `collections/38_Papel_Picado_Fiesta/assets/gpt/parts/bougainvillea.png` — PAKET 5 — Website katmanları (YAZI YOK)

### `collections/21_Crimson_Rose_Atelier/variants/GPT_PROMPTS.md`

- `collections/21_Crimson_Rose_Atelier/variants/V07_ivory_rose/gpt/rose-branch.png` — İstem — fildişi güller (yalnız istenirse)
