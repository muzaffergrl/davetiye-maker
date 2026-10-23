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

**Toplam eksik: 22**

| Prompt dosyası | Bölüm | Var | Eksik |
|---|---|---|---|
| `collections/21_Crimson_Rose_Atelier/variants/GPT_PROMPTS.md` | İstem — fildişi güller (yalnız istenirse) | 0 | 1 |
| `brand/social/GPT_PROMPTS.md` | SM1 — Instagram öne çıkan (highlight) kapakları | 0 | 5 |
| `brand/social/GPT_PROMPTS.md` | SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir) | 0 | 6 |
| `brand/social/GPT_PROMPTS.md` | SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek) | 0 | 10 |

## Eksik dosyalar

### `collections/21_Crimson_Rose_Atelier/variants/GPT_PROMPTS.md`

- `collections/21_Crimson_Rose_Atelier/variants/V07_ivory_rose/gpt/rose-branch.png` — İstem — fildişi güller (yalnız istenirse)

### `brand/social/GPT_PROMPTS.md`

- `brand/social/gpt/highlight_designs.png` — SM1 — Instagram öne çıkan (highlight) kapakları
- `brand/social/gpt/highlight_how.png` — SM1 — Instagram öne çıkan (highlight) kapakları
- `brand/social/gpt/highlight_rsvp.png` — SM1 — Instagram öne çıkan (highlight) kapakları
- `brand/social/gpt/highlight_faq.png` — SM1 — Instagram öne çıkan (highlight) kapakları
- `brand/social/gpt/highlight_tips.png` — SM1 — Instagram öne çıkan (highlight) kapakları
- `brand/social/gpt/bg_carousel_cover_light.png` — SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir)
- `brand/social/gpt/bg_carousel_inner_light.png` — SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir)
- `brand/social/gpt/bg_carousel_dark.png` — SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir)
- `brand/social/gpt/bg_story_light.png` — SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir)
- `brand/social/gpt/bg_story_dark.png` — SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir)
- `brand/social/gpt/bg_pin_guide.png` — SM2 — Zeminler (Claude başlık ve gerçek ekranları üstüne yerleştirir)
- `brand/social/gpt/scene_planning_desk.png` — SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek)
- `brand/social/gpt/scene_phone_on_envelope.png` — SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek)
- `brand/social/gpt/scene_just_engaged_winter.png` — SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek)
- `brand/social/gpt/scene_dinner_table.png` — SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek)
- `brand/social/gpt/scene_linen_flatlay.png` — SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek)
- `brand/social/gpt/scene_garden_golden_hour.png` — SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek)
- `brand/social/gpt/scene_guest_cafe.png` — SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek)
- `brand/social/gpt/scene_qr_welcome_table.png` — SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek)
- `brand/social/gpt/scene_autumn_thanks.png` — SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek)
- `brand/social/gpt/scene_winter_cozy.png` — SM3 — Yaşam sahneleri (tek yeşil ekran; gerçek ekran yerleşecek)
