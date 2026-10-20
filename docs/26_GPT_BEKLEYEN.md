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

**Toplam eksik: 15**

| Prompt dosyası | Bölüm | Var | Eksik |
|---|---|---|---|
| `collections/33_Marigold_Mehndi/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 15 | 3 |
| `collections/34_Red_Lacquer_Double_Happiness/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 20 | 3 |
| `collections/35_Highland_Tartan_Thistle/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 18 | 2 |
| `collections/36_Victorian_Glasshouse/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 17 | 2 |
| `collections/37_Art_Nouveau_Lily/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 14 | 2 |
| `collections/38_Papel_Picado_Fiesta/assets/gpt/GPT_PROMPTS.md` | PAKET 5 — Website katmanları (YAZI YOK) | 19 | 2 |
| `collections/21_Crimson_Rose_Atelier/variants/GPT_PROMPTS.md` | İstem — fildişi güller (yalnız istenirse) | 0 | 1 |

## Eksik dosyalar

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
