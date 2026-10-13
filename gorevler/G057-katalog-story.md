---
id: G057
baslik: katalog.py — story tablosunu content() üretecine taşı (yaz --zorla story'yi silmesin) (docs/11 §14 #12)
rol: claude-kod
durum: alindi
alan: wf-tema01
oncelik: 3
bagimli: [G053]
yazar: [tools/katalog.py]
---

## Amaç
G053 story bloklarını content.demo.json'a elle yazdı; `katalog.py ozet` bu kayıtları atlıyor, `yaz --zorla` story'yi siler.
Story verisi katalogda tek kaynak olsun.

## Yapılacaklar
1. 19 tasarımın story metinlerini content.demo.json'dan katalog verisine al; content() üretsin.
2. `ozet --dene` ve `paket5 --dene` 0 değişiklik; `yaz --zorla --dene` story'yi korur; katalog kontrol geçer.

## Sonuç
_(görevi yapan ajan doldurur)_

## Günlük
- 2026-10-13 alindi: wf-tema01
