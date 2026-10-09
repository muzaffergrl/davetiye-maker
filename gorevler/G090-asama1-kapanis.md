---
id: G090
baslik: Aşama 1 kapanışı — 20 tasarımın eksiksiz paketi QA'dan geçti
rol: claude-canva
durum: hazir
alan:
oncelik: 9
bagimli: [G027, GQ01, GQ03, GQ04, GQ05, GQ06, GQ07, GQ08, GQ09, GQ10, GQ11, GQ12, GQ13, GQ14, GQ15, GQ16, GQ17, GQ18, GQ19, GQ20]
yazar: [docs/09_TASARIM_KATALOGU.md]
---

## Amaç
Aşama 2'nin (her tasarıma ek 5 renk paleti) kapısı. 20 tasarımın eksiksiz paketi QA'dan geçince entegratör
bu görevi kapatır; GP görevleri (palet, görsel, Canva, ilan) ancak o zaman alınabilir.

## Girdiler
- `docs/06_FABRIKA_PLANI.md`, `docs/09_TASARIM_KATALOGU.md`

## Yapılacaklar
1. 20 master'ın kayıtlı olduğunu yeniden okuyarak doğrula.
2. `onayla` ile kapat; GP1NN görevleri açılır (tasarım 02'nin V02–V06 prompt'ları zaten hazır).

## Bitti sayılması için
- [ ] 20 design ID `PROJECT_STATE.json`'da `saved_master`
- [ ] 20 QA raporu: kritik bulgu yok

## Sonuç
_(entegratör doldurur)_
