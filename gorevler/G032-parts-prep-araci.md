---
id: G032
baslik: tools/parts_prep.py — GPT parçalarını Canva katmanına hazırla (kırp, yeşil pencere, ön cep)
rol: claude-kod
durum: hazir
alan:
oncelik: 1
bagimli: []
yazar: [tools/parts_prep.py, tools/tests/test_parts_prep.py]
---

## Amaç
K21 ile tasarımı GPT yapıyor. Claude'un parçalara yaptığı işlem yalnız teknik hazırlık: bu araç onu yapar.
Yeni şekil çizmez, görseli yeniden tasarlamaz.

## Girdiler
- Paket 4 biçimi: `collections/03_Blush_Garden_Rose/assets/gpt/GPT_PROMPTS.md`
- Benzer kod: `tools/kit_build.py`, `tools/mockup_compose.py` (yeşil alan bulma), `tools/kit_check.py`

## Yapılacaklar
1. `python3 tools/parts_prep.py <koleksiyon> [--out kit_layers]`:
   - Dikey 2:3 opak görseller (bg) → 9:16 merkez kırpma, 1080×1920 ve 2160×3840 (JPG).
   - Şeffaf parçalar: alfa kutusuna kırp (+küçük pay), PNG.
   - `#00FF00` pencereleri (±tolerans, en büyük bağlı bölgeler) → şeffaf; kenar yeşil taşmasını temizle
     (mockup_compose'daki yöntem); her pencerenin kutusu ve maskesi `kit_layers/windows.json`'a (parça adı → [x,y,w,h], şekil maskesi PNG).
   - `envelope_open.png` → ön cep ayrı katman: alfa kutusunun alt bölgesinde cebi ayır (zarf gövdesinin
     alt kısmı; sınırı kenar/renk farkıyla bul, bulunamazsa geometrik üçgen + uyarı) → `envelope_pocket_front.png`.
   - Sonunda özet: üretilen katmanlar, uyarılar.
2. Test: sahte girdilerle (geçici klasör) — kırpma ölçüleri, yeşil pencere şeffaf ve kutusu doğru, yeşil kalıntı yok, cep katmanı ayrı.

## Bitti sayılması için
- [ ] Test geçiyor; gerçek GPT dosyası gelince 03 üzerinde çalıştırılıp önizleme bakılacak (G031)

## Sonuç
_(görevi yapan ajan doldurur)_
