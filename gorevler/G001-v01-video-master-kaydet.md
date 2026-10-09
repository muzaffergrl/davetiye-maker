---
id: G001
baslik: V01 video master taslağını kaydet ve doğrula
rol: claude-canva
durum: blokaj
alan:
oncelik: 1
bagimli: []
yazar: [PROJECT_STATE.json, collections/02_Dusty_Blue/COLLECTION_STATUS.md]
---

## Amaç
Canva `DAHXhAaKIhI` üzerindeki 6 sahnelik taslağı kalıcı kaydetmek.

> Blokaj: kullanıcının kayıt onayı bekleniyor (önizleme 2026-10-09'da gönderildi). Onay, elle iş değil, karardır.

## Girdiler
- Transaction `1558763910934449378` (2026-10-09 açıldı)
- `collections/02_Dusty_Blue/previews/canva_master_v2_draft_6scenes.png`
- `.claude/skills/canva-guvenli-duzenleme/SKILL.md`

## Yapılacaklar
1. Transaction'ın hâlâ geçerli olduğunu canlı oku; geçersizse aynı düzeni `tools/` notlarından yeniden kur.
2. Kullanıcının açık onayıyla commit et.
3. Aynı design ID'den yeniden oku: 6 sayfa, 17 katman, 40 metin alanı (`canva/TEXT_SLOTS.json`).
4. Durum dosyalarını güncelle.

## Bitti sayılması için
- [ ] Yeniden okuma kayıtlı sürümde 6 sahneyi gösteriyor
- [ ] `PROJECT_STATE.json`: `committed: true`, transaction kaldırıldı

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_
