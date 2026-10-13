---
id: G054
baslik: tools/tema_build.py ortak tema yardımcıları + kit_check zarf hiza denetimi (docs/11 §14 #1–#2)
rol: claude-kod
durum: alindi
alan: wf-hazirlik
oncelik: 1
bagimli: [G046]
yazar: [tools/tema_build.py, tools/kit_check.py, tools/tests/, platform/themes/blush-garden-rose/, docs/11_TEMA_STANDARDI.md]
---

## Amaç
19 tema aynı görüntü hattını kullanacak; 03'ün `build_images.py`'sindeki genel parçalar ortak modüle taşınır, zarf tiplerine göre
kesimler eklenir, kapalı/açık zarf hizası GPT çıktısında denetlenir.

## Yapılacaklar
1. `tools/tema_build.py`: webp + srcset türevleri + manifest, pencere maskesi, serbest bölge ölçümü, yer tutucu, og kırpımı (1200×630),
   hiza ölçümü; kesimler: genel eğri kapak kenarı, ön cep (düz/eğri), gatefold dikişi, kitap sırtı/kapak, kese ağız yayı, aydınger kılıf şeridi.
   Her kesim sahte görsellerle testli; başarısızsa açık uyarı + geometrik yedek.
2. 03'ün `build_images.py`'si ortak modülü kullanır; çıktısı **bayt bayt aynı** kalır (ya da fark gerekçeli, görsel olarak aynı).
3. `kit_check --paket 5`: `envelope_closed` ↔ `envelope_open` (ve sarılı kapanış) gövde sınır kutusu karşılaştırması (±%1,5 uyarı, > %4 hata).
4. 03 için `og-1200x630.jpg` (web_hero'dan, alt hizalı kırpım, yazısız) ve `favicon.png` (ribbon_bow'dan) üret; tema klasörüne koy.
5. docs/11'de ilgili bölümleri güncelle.

## Bitti sayılması için
- [ ] Testler geçiyor; 03 teması değişmeden yeniden üretiliyor; hiza denetimi 03 parçalarında çalışıyor

## Sonuç
_(görevi yapan ajan doldurur)_

## Günlük
- 2026-10-13 alindi: wf-hazirlik
