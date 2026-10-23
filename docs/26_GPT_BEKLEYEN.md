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

**Toplam eksik: 16**

| Prompt dosyası | Bölüm | Var | Eksik |
|---|---|---|---|
| `collections/21_Crimson_Rose_Atelier/assets/gpt/GPT_PROMPTS.md` | PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23 | 0 | 15 |
| `collections/21_Crimson_Rose_Atelier/variants/GPT_PROMPTS.md` | İstem — fildişi güller (yalnız istenirse) | 0 | 1 |

## Eksik dosyalar

### `collections/21_Crimson_Rose_Atelier/assets/gpt/GPT_PROMPTS.md`

- `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/velvet.png` — PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23
- `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/velvet_wide.png` — PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23
- `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/satin_drape.png` — PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23
- `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/petal_1.png` — PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23
- `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/petal_2.png` — PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23
- `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/petal_3.png` — PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23
- `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/petal_4.png` — PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23
- `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/petal_5.png` — PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23
- `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/oval_frame.png` — PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23
- `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/torn_edge.png` — PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23
- `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/ribbon.png` — PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23
- `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/gold_sprig.png` — PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23
- `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/album_page.png` — PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23
- `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/rose_corner.png` — PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23
- `collections/21_Crimson_Rose_Atelier/assets/gpt/parts/rose_bloom.png` — PAKET 8 — Atelier cilası: website katmanları (W3; YAZI YOK) — 2026-10-23

### `collections/21_Crimson_Rose_Atelier/variants/GPT_PROMPTS.md`

- `collections/21_Crimson_Rose_Atelier/variants/V07_ivory_rose/gpt/rose-branch.png` — İstem — fildişi güller (yalnız istenirse)
