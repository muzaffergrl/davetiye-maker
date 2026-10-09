---
id: G040
baslik: tools/make_variant.py — varyant hattı
rol: gpt-kod
durum: hazir
alan:
oncelik: 2
bagimli: [G002, G003]
yazar: [tools/make_variant.py]
---

## Amaç
Bir renk kitinden Canva varyantı için gereken her şeyi tek komutla hazırlamak.

## Girdiler
- `tools/variant_prompts.py`
- `tools/kit_check.py`, `tools/kit_build.py`
- `collections/02_Dusty_Blue/canva/ASSET_MAP.json`, `collections/02_Dusty_Blue/canva/TEXT_SLOTS.json`

## Yapılacaklar
1. CLI: `python3 tools/make_variant.py <Vxx>` → kit_check → kit_build → `<kit>/canva_plan.json` üret.
2. `canva_plan.json`: sayfa başına `update_fill` listesi (katman adı → ASSET_MAP konumu) ve metin renk değişiklikleri (TEXT_SLOTS rengi → palette hex). Locator ID'ler kopyada değişebileceği için eşleştirme anahtarı metin içeriği/katman adı olsun.
3. Canva'ya dokunma; planı Claude uygular.

## Bitti sayılması için
- [ ] V02 için (sahte kit ile) geçerli canva_plan.json

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_
