---
id: G179
baslik: GPT iş listesi — ChatGPT'de elle üretim için tek sıralı prompt listesi + indirme adıyla otomatik yerleştirme
rol: claude-kod
durum: bitti
alan: claude-G179
oncelik: 1
bagimli: [G176]
yazar: [tools/gpt_is_listesi.py, tools/gpt_bekleyen.py, tools/gpt_yerlestir.py, tools/tests/test_gpt_is_listesi.py, docs/26_GPT_BEKLEYEN.md, docs/27_GPT_IS_LISTESI.md, docs/27_GPT_IS_LISTESI.html, gorevler/G179-gpt-is-listesi.md]
---

## Amaç
Kullanıcı ChatGPT'de (görsel üretimi) prompt'ları tek tek yapıştırıp sonuçları indirecek. Prompt'lar ~35 Markdown
dosyasına farklı biçimlerde dağılmıştı, indirilen dosyalar rastgele adlarla geliyordu. Koordinatör:
session_01HP9ZrJ8mhZnigbvsvUQ4pR. `PROJECT_STATE.json`, `AGENTS.md`, `CLAUDE.md`'ye dokunulmadı. Yayın, main'e birleştirme,
PR yok.

## Sonuç
**2026-10-18 · claude-G179 — durum: inceleme.** Dal `claude/g179-gpt-is-listesi`.

**334 eksik görsel** (görevde yazan 270 eski sayı; ayrıştırıcı düzeltmesiyle kesin sayı aşağıda):

| Grup | Görsel |
|---|---|
| A · Tasarım 22–32 (her tasarımda PAKET 5 web → PAKET 2 foto → PAKET 3 ilan sahnesi → PAKET 6/G139 baskı) | 276 |
| B · Tasarım 01–21 G139 2× baskı parçaları (21 × 2) | 42 |
| C · Palet varyantları (16: 15 · 21: 1, isteğe bağlı fildişi gül) | 16 |

A ayrıntısı: 22: 20 · 23: 19 · 24: 28 · 25: 28 · 26: 24 · 27: 30 · 28: 26 · 29: 26 · 30: 24 · 31: 24 · 32: 27.

- **`tools/gpt_is_listesi.py`** (`--yaz` iki belgeyi yazar; bayraksız özet; `--json` ham liste). Kaynak `gpt_bekleyen`
  ile aynı (`prompt_dosyalari` + yeni `satir_yollari`), şartlar `gpt_yerlestir.istenenler`'den (yerleştirme denetimiyle
  tek kaynak). Her eksik hedef için yolun başlık bölümündeki kod bloğu bulunur ve kendi başına yapıştırılabilir yapılır:
  bölümün "Instructions for GPT (send before the first image)" bloğu her PAKET 3 prompt'unun başına eklenir; "Same as
  above" / "same as W2.3, but …" atıf yapılan prompt'la değiştirilir; çok dosyalı Kaydet satırlarında (`tile_1..4`,
  `bougainvillea_tl/br`, `gold_flake_1..3`, `star_1..3`, `petal_1..3`, `pot_left/right`) prompt yalnız o dosyayı ister
  (etiketli satır + gerekiyorsa ilk dosyanın tarifi bağlam olarak); sert satır kırılımları birleştirilir. Her madde:
  tasarım, bölüm, grup, başlık, tam prompt, ölçü/oran/şeffaflık/#00FF00 pencere/ekran sayısı, prompt'ta adı geçen ek
  görseller (listede daha önceki madde no'su ya da repodaki yol; sonraki maddeler gösterilmez), Kontrol satırı, hedef yol
  ve **indirme adı** (`indirme_adi`: yalnız yoldan türer, ör. `23-velvet-jewel-box__box_closed.png`,
  `…__photos__story_1.jpg`, `16-sunflower-rustic__v02-navy-sunflower__closure.png`; bütün istenen hedefler arasında
  benzersiz, çakışırsa araç durur). Dosyanın baştaki İngilizce GPT notu tasarım başlığında "sohbetin ilk mesajı" olarak
  verilir. 334 maddenin hepsinde prompt bulundu.
- **`docs/27_GPT_IS_LISTESI.html`**: tek dosya, dış kaynak yok, açık/koyu, 390 px'te yatay kaydırma yok. Gruplu ve
  numaralı; her maddede "Prompt'u kopyala", "Dosya adını kopyala", "Sorun" düğmeleri ve bitti kutusu (localStorage,
  try/catch); süzgeç (grup / tasarım / yalnız bitmeyenler) ve sayaç. Üstte Türkçe ChatGPT notları (tasarım başına tek
  sohbet, her mesajda tek görsel, ölçü/şeffaflık, ek görsel, PNG indir, indirme adıyla kaydet ya da harita, şeffaf
  vermezse: prompt dosyalarında yedek yol yazılı değil → "Sorun" işaretle, geç) ve "neden bu sıra".
  **`docs/27_GPT_IS_LISTESI.md`** aynı içerik, okunur liste.
- **`gpt_bekleyen.py`**: `satir_yollari` (paylaşılan satır okuyucu) — Kaydet satırındaki yalın adlar (`tile_2.png` …) artık
  sayılıyor (+11; önceden ne listede ne `gpt_yerlestir`'in kabul ettiği hedeflerdeydi); `platform/`, `public/`, `img/`,
  `scripts/`, `tools/`, `docs/` ile başlayan yollar (build çıktısı notları) hedef sayılmıyor (−2 sahte hedef: 21 varyant
  `platform/themes/…/rose-branch.webp`, 28 `public/print/…/front.webp`). `--yaz` docs/27'yi de yazar; docs/26 şablonuna
  "ChatGPT'de elle üretim (G179)" bölümü ve `--klasor` adımı.
- **`gpt_yerlestir.py --klasor <dir>`**: klasördeki her dosyanın adı (büyük/küçük harf, .png/.jpg/.jpeg/.webp önemsiz) bir
  indirme adıysa hedefine eşlenir (`gpt_is_listesi.indirme_adi` — tek kaynak), sonra mevcut denetim/kopya/adım zinciri
  (kuru varsayılan, `--uygula` yazar). Tanınmayan adlar BİLİNMEYEN diye listelenir, tahmin edilmez, dokunulmaz.
  `--eslestir` ile birlikte verilebilir. Yan düzeltme: ilan sahneleri (`/mockups/`) kendi `mockup` grubunda — önceden
  "web" sayıldıkları için G175'ten sonra PAKET 5 tamamlansa bile build_images "eksik: web" diye atlanacaktı; `ilan`
  adımı artık mockup'ları da bekler.

## Denetim
- `python3 -m pytest tools/tests -q`: 96 passed (5 dk 20 sn; G176 sonrası 90 + yeni 6)
- Yeni `tools/tests/test_gpt_is_listesi.py` (6 test): indirme adı örnekleri; gerçek repoda adlar benzersiz + iki kurulum
  aynı + yalnız yoldan + her maddede prompt + docs/26 ile aynı küme + a→b→c sırası; sentetik dosyada ön metin, kod
  bloklu ve bloksuz "same as above", etiketli ve etiketsiz çok dosyalı satırlar, şartlar; `yaz()` iki belge (dış kaynak
  yok); `--klasor` adla eşler + bilinmeyeni bırakır + kuru yazmaz + `--uygula` yazar; tek red → hiçbir dosya yazılmaz.
- Chromium (Playwright, `/opt/pw-browsers`), 390 × 844 ve 1280 × 900, açık ve koyu: 334 madde; "Prompt'u kopyala" panoya
  `<pre>` metninin aynısını, "Dosya adını kopyala" indirme adını yazıyor (pano izni verilmiş bağlam, localhost); grup C
  süzgeci 16, tasarım 23 süzgeci 19, "yalnız bitmeyenler" 333 (1 işaretli); işaret yeniden yüklemede duruyor;
  `scrollWidth` = görünüm genişliği; konsolda hata/uyarı yok. `file://` ile de kopyalama düğmesi hatasız ("Kopyalandı ✓").
  Ekran görüntüleri commit edilmedi.

## Açık / not
- Prompt dosyalarının hiçbirinde şeffaf zemin için yedek yol (#00FF00 / düz zemin) yazılı değil; sayfa bunu açıkça söylüyor.
  Bir prompt'a yedek eklenirse madde içinde "Şeffaf yedek" satırı kendiliğinden görünür (`YEDEK` deseni).
- G139 01–21 prompt'ları "Recreate the attached invitation_card.png" der: o dosya repoda var, maddede "Ek görsel" olarak
  yolu yazıyor — kullanıcının ChatGPT'ye yüklemesi gerekir.
- İşaretler (bitti/sorun) yalnız o tarayıcıda saklanır; asıl ilerleme ölçüsü dosyalar yerleşince kısalan listedir.

## Günlük
- 2026-10-18 claude-G179 inceleme
- 2026-10-18 entegratör onayladı
