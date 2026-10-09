# Kit standardı — her renk varyantının görsel dosyaları

Kalıp T1 (Envelope Story) için her renk kiti **aynı adlı, aynı ölçülü** dosyalardan oluşur.
Böylece bir varyant, Canva'da yalnız görsel değiştirerek (`update_fill`) üretilir.

## 1. Kit klasörü

```
<kit kökü>/
  palette.json                 # renk token'ları (entegratör veya claude-kod yazar)
  assets/gpt/GPT_PROMPTS.md    # bu kitin prompt'ları (tek kaynak)
  assets/gpt/textures/         # GPT çıktısı (ham)
  assets/gpt/decor/            # GPT çıktısı (ham, şeffaf PNG)
  assets/gpt/mockups/          # GPT çıktısı (ham, yeşil ekranlı)
  kit_layers/                  # tools/kit_build.py çıktısı (Canva'ya yüklenen 17 katman)
```

- V01 kit kökü: `collections/02_Dusty_Blue/` (ham görseller `assets/gpt/`, çıktı `kit_layers/`).
- **Maske kaynağı (dondurulmuş):** `collections/02_Dusty_Blue/assets/layers/` — HTML'den çıkarılmış
  17 katman. Hiçbir araç bunların üzerine yazmaz; `kit_build` şekil ve gölgeyi buradan alır.
- V02–V06 kit kökü: `collections/02_Dusty_Blue/variants/<Vxx_slug>/`.
- Örnek fotoğraflar **ortak**: `collections/02_Dusty_Blue/assets/gpt/photos/` (V01 Paket 2).

## 2. GPT ham dosyaları (gpt-gorsel üretir)

| Dosya | Ölçü | Zemin | Not |
|---|---|---|---|
| `textures/ivory_paper.png` | 1024×1024 | opak | Düz, eşit ışık, tekrarlanabilir |
| `textures/envelope_liner.png` | 1024×1024 | opak | Tekrarlanabilir astar deseni |
| `textures/background_mist.png` | 1024×1536 | opak | Ortası boş, dikey |
| `decor/wax_seal_blank.png` | 1024×1024 | **şeffaf** | Ortası boş (harf yok), ortalı |
| `decor/botanical_corner.png` | 1024×1024 | **şeffaf** | Sol üst köşeden büyür, sağ alt 2/3 boş |
| `decor/botanical_spray.png` | 1536×1024 | **şeffaf** | Yatay, ortalı |
| `mockups/phone_flatlay.png` | 1024×1536 | opak | Ekran düz `#00FF00` |
| `mockups/laptop_desk.png` | 1536×1024 | opak | Ekran düz `#00FF00` |
| `mockups/card_flatlay.png` | 1024×1536 | opak | Kart yüzü düz `#00FF00` |

Ortak kurallar: yazı, harf, monogram, logo, filigran yok · şeffaf istenen dosya gerçek alfa
kanallı PNG · nesne kenardan kesilmez · gerçek kişiye/markaya/başka satıcının tasarımına
benzemez. Aynı parçanın denemeleri `_v2`, `_v3` ekiyle; seçilen sade adla kalır.

## 3. Canva katmanları (tools/kit_build.py üretir → `<kit kökü>/kit_layers/`)

Kaynak şekiller ve konumlar V01'in HTML'den çıkarılmış katmanlarıdır
(`collections/02_Dusty_Blue/assets/layers/`, `canva/ASSET_MAP.json`). Yeni kit **şekli
değiştirmez**, yalnız yüzeyi değiştirir: eski katmanın alfa maskesi ve gölgelendirmesi korunur,
doku ham GPT dosyasından gelir.

| Katman (çıktı adı) | Ölçü (px) | Kaynak ham dosya | Yöntem |
|---|---|---|---|
| `bg_mist.jpg` | 2160×3840 | `textures/background_mist.png` | ölçekle + ortadan kırp |
| `botanical_tl.png` | 800×800 | `decor/botanical_corner.png` | ölçekle |
| `botanical_br.png` | 820×820 | `decor/botanical_corner.png` | 180° döndür + ölçekle |
| `card_botanical_tl.png` | 500×500 | `decor/botanical_corner.png` | ölçekle |
| `card_botanical_br.png` | 500×500 | `decor/botanical_corner.png` | 180° döndür + ölçekle |
| `envelope_back.png` | 2040×1480 | `textures/ivory_paper.png` | V01 alfa maskesi × doku × V01 parlaklık gölgesi |
| `envelope_pocket.png` | 1800×1240 | `textures/ivory_paper.png` | aynı yöntem |
| `envelope_flap_closed.png` | 1816×816 | `textures/ivory_paper.png` | aynı yöntem |
| `envelope_liner_open.png` | 1776×760 | `textures/envelope_liner.png` | V01 alfa maskesi × desen |
| `card_small_blank.png` | 1640×1200 | `textures/ivory_paper.png` | aynı yöntem |
| `invitation_card_blank.png` | 2080×3280 | `textures/ivory_paper.png` | aynı yöntem (çerçeve çizgileri `palette.gold` ile yeniden çizilir) |
| `polaroid_frame.png` | 1080×1260 | `textures/ivory_paper.png` | aynı yöntem |
| `wax_seal.png` | 496×496 | `decor/wax_seal_blank.png` | kırp + ölçekle |
| `photo_placeholder_wide.jpg` | 1360×620 | ortak `photos/hero_portrait.jpg` | yüz odaklı kırp |
| `photo_placeholder_1.jpg` | 792×832 | ortak `photos/moment_1.jpg` | kırp |
| `photo_placeholder_2.jpg` | 792×832 | ortak `photos/moment_2.jpg` | kırp |
| `photo_placeholder_3.jpg` | 792×832 | ortak `photos/moment_3.jpg` | kırp |

Katman ölçüleri Canva'daki yerleşim boyutunun 2 katıdır (keskinlik için). Canva yerleşimi
(`left/top/width/height`) `canva/ASSET_MAP.json`'dadır ve varyantlarda değişmez.

## 4. palette.json

```json
{
  "id": "V02_blush_champagne",
  "name": "Blush & Champagne",
  "ink": "#3E2C2E",      "deep": "#A86F72",   "primary": "#D8A7A7",
  "mist_top": "#F3E4E1", "mist_bottom": "#E2C6C2",
  "gold": "#C9A96E",     "gold_light": "#E3CFA6", "ivory": "#FBF7F2",
  "leaf": "#A7B5A0"
}
```

Canva'da metin renkleri: başlık/isim `ink`, küçük başlık ve italik bilgi `deep`, ayraç `gold`,
RSVP butonu dolgusu `deep`, buton yazısı `ivory`.

## 5. Kontrol

`python3 tools/kit_check.py <kit kökü>` (görev `G003`): dosyalar var mı, ölçü/oran doğru mu,
şeffaf olması gerekenlerde alfa var mı, mockup yeşil alanı düz mü. Hata varsa kit
`kit_build`'e girmez.

## 6. Genel kalıp: her tasarımın kendi `kit_map.json`'ı (tasarım 01, 03–20)

Yukarıdaki §2–§3 tasarım 02'ye (Envelope Story) özeldir. Her tasarımın katmanları farklı olduğu için
her koleksiyon kökünde bir `kit_map.json` bulunur (görev G1NN yazar) ve `tools/kit_build.py` onu okur.

Ham GPT dosyaları (tasarım 01, 03–20) — `assets/gpt/GPT_PROMPTS.md`'de tam liste:
`textures/background.png` (1024×1536) · `textures/paper.png` · `textures/liner.png` ·
`decor/closure.png` (şeffaf) · `decor/corner.png` (şeffaf) · `decor/divider.png` (1536×1024, şeffaf) ·
`decor/photo_frame.png` (1024×1536, şeffaf, içi boş) + tasarıma özel parçalar.

```json
{
  "masks": "assets/layers",
  "out": "kit_layers",
  "layers": [
    {"name": "bg.jpg", "size": [2160, 3840], "source": "assets/gpt/textures/background.png", "method": "cover"},
    {"name": "envelope_back.png", "size": [2040, 1480], "source": "assets/gpt/textures/paper.png", "method": "texture_mask", "mask": "envelope_back.png"},
    {"name": "envelope_liner.png", "size": [1776, 760], "source": "assets/gpt/textures/liner.png", "method": "pattern_mask", "mask": "envelope_liner.png"},
    {"name": "closure.png", "size": [500, 500], "source": "assets/gpt/decor/closure.png", "method": "fit"},
    {"name": "corner_tl.png", "size": [800, 800], "source": "assets/gpt/decor/corner.png", "method": "fit"},
    {"name": "corner_br.png", "size": [800, 800], "source": "assets/gpt/decor/corner.png", "method": "fit", "rotate": 180},
    {"name": "photo_1.jpg", "size": [792, 832], "source": "../02_Dusty_Blue/assets/gpt/photos/moment_1.jpg", "method": "cover"}
  ]
}
```

| method | Anlamı |
|---|---|
| `cover` | hedef orana merkezden kırp + ölçekle |
| `fit` | oranı koru, şeffaf kenarla hedef boyuta sığdır (kırpma yok) |
| `texture_mask` | maskenin alfası + doku (tile) × maskenin parlaklık gölgesi |
| `pattern_mask` | maskenin alfası + desen (tile), gölge yok |
| `tint` | (ops.) `color` alanındaki hex ile renklendir |

`rotate`, `flip` (h/v) opsiyoneldir. Yollar koleksiyon köküne göredir. `masks` klasöründeki dosyaların
üzerine hiçbir araç yazmaz.
