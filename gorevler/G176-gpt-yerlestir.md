---
id: G176
baslik: "GPT görselleri geldi" için tek komut — güvenli yerleştirme + tasarım başına build/denetim zinciri
rol: claude-kod
durum: bitti
alan: claude-G176
oncelik: 1
bagimli: [G167]
yazar: [tools/gpt_yerlestir.py, tools/tests/test_gpt_yerlestir.py, tools/gpt_bekleyen.py, docs/26_GPT_BEKLEYEN.md, docs/06_FABRIKA_PLANI.md, gorevler/G176-gpt-yerlestir.md]
---

## Amaç
GPT'den beklenen 270 görsel gelince (çoğu rastgele indirme adıyla) yerleştirmeyi ve tasarım başına birkaç build'i tek,
güvenli, tekrarlanabilir adım yapmak. Koordinatör: session_01HP9ZrJ8mhZnigbvsvUQ4pR. Durum dosyalarına, `AGENTS.md`/
`CLAUDE.md`'ye dokunulmadı. Yayın, main'e birleştirme, PR yok.

## Sonuç
**2026-10-17 · claude-G176 — durum: inceleme.** Dal `claude/g176-gpt-yerlestir`.

- `tools/gpt_yerlestir.py` (Türkçe CLI; varsayılan KURU, `--uygula` yazar/koşar):
  - `--eslestir harita.json` (`{"<gelen>": "<hedef>"}`; göreli gelen yol haritanın klasöründen). Hedef: düz repo-göreli
    yol ve bir GPT_PROMPTS.md'nin istediği yol (`gpt_bekleyen.prompt_dosyalari/tara` import edildi). Şartlar
    `gpt_kuru_deneme.beklenenler` + `kit_check.beklenenler` (+ kalın olmayan 01–21 G139 "Kaydet:" satırları için satır
    okuyucu); denetim `kit_check.denetle` (oran ±%2, alfa + şeffaf kenar, opakta şeffaf yok, `#00FF00` pencere, mockup
    ekranları). İstenenden küçük çözünürlük yalnız UYARI. Farklı mevcut dosya `--uzerine-yaz`sız ezilmez; aynı bayt/piksel
    = YERİNDE. İki gelen → aynı hedef, `..`/mutlak hedef reddedilir. Tek red = hiçbir dosya kopyalanmaz. Uzantı farkı PIL
    ile dönüştürülür; alfalı görsel .jpg hedefe reddedilir.
  - `--koleksiyon NN|NN_Ad|tema-id|liste|all` (yerleştirmeden ya da sonrasında). Tasarım → tema: `build_images.py`'deki
    `COL`; durum: `platform/lib/marketing/config.ts`. Adımlar sırayla, girdileri tamsa: build_images (web parçaları) →
    baski (`build-print-assets.ts --theme`; + PAKET 6/G139; `platform/node_modules` yoksa HATA) → palet
    (`recolor_parts.py build` + `check`, recolor.json varsa) → cikti (gerçek ağaçta img/ referansları
    `gpt_kuru_deneme.tema_refs` ile + manifest "interim/geçici" izi) → theme_check (`--theme-check`: theme-assets.cjs +
    `theme-check.cjs --theme <id> --stress`; `platform/.next/BUILD_ID` yoksa HATA "önce npm run build"; PAKET 2 tam
    olmalı) → ilan (`--ilan`: `listing_editorial.py --capture --video`; listing_kit'in bildiği tasarımlar) → etsy
    (`etsy_upload.py --designs NN`; yalnız bildiği tasarımlar, 01–21). Sonda `gpt_bekleyen.py --yaz`. HATA → o tasarımın
    kalanı DURDU, diğerleri sürer. Tablo + "live için kalanlar" (eksik parça grupları, tamam olmayan adımlar, göz kontrolü —
    makinece kaydı olmadığından her coming tasarımda açık madde). Live yapmaz, deploy etmez, Etsy'ye göndermez.
- `tools/tests/test_gpt_yerlestir.py` (pytest, sahte kökte küçük sentetik görseller, build komutları taklit): 19 test —
  bilinmeyen hedef, kuru çalışma yazmaz/koşmaz, üzerine yazma reddi + `--uzerine-yaz`, YERİNDE, oran/alfa/pencere reddi,
  tek red → kopya yok, çift hedef ve `..`, uzantı dönüşümü, adım sırası ve atlama, HATA'da durma + diğer tasarım sürer,
  node_modules/.next yokluğu, eksik foto, interim manifest.
- Belge: `gpt_bekleyen.py` şablonuna "GPT görselleri gelince (G176)" bölümü (`--yaz` korur, docs/26 yeniden yazıldı);
  `docs/06_FABRIKA_PLANI.md` §3a'ya aynı paragraf.

## Denetim
- `python3 -m pytest tools/tests -q`: 90 passed (merge sonrası, 4 dk 32 sn; yeni dosya 19 test)
- Gerçek kuru çalışma `python3 tools/gpt_yerlestir.py --koleksiyon 23` (hiçbir şey yerleştirilmeden):

```
| Tasarım             | build_images | baski   | palet   | cikti   | theme_check | ilan   | etsy    |
| ------------------- | ------------ | ------- | ------- | ------- | ----------- | ------ | ------- |
| 23 velvet-jewel-box | ATLANDI      | ATLANDI | ATLANDI | ATLANDI | KAPALI      | KAPALI | ATLANDI |
  23 build_images: ATLANDI — eksik: web 7
  23 baski: ATLANDI — eksik: web 7, baski 2
  23 palet: ATLANDI — palet yok (recolor.json)
  23 cikti: ATLANDI — eksik: web 7
  23 etsy: ATLANDI — etsy_upload 23'i bilmiyor
```

## Açık / not
- Bu kapta `platform/node_modules` ve `platform/.next` yok: `--uygula` ile baski adımı (sharp) HATA verir ve o tasarımı
  durdurur; önce `cd platform && npm ci` (theme-check/ilan için ayrıca `npm run build`).
- `etsy_upload.py` ve `listing_kit` 22–32'yi henüz bilmiyor; bu tasarımlarda etsy/ilan adımı ATLANDI (araçlar
  genişleyince kendiliğinden koşar).
- Göz kontrolü için makinece bir kayıt yok; araç bunu her zaman açık engel olarak yazar.

## Günlük
- 2026-10-17 entegratör onayladı
