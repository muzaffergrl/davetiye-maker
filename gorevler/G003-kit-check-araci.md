---
id: G003
baslik: tools/kit_check.py — kit doğrulayıcı
rol: gpt-kod
durum: hazir
alan:
oncelik: 1
bagimli: []
yazar: [tools/kit_check.py]
---

## Amaç
GPT'nin ürettiği ham kit dosyalarını Canva'ya girmeden önce otomatik denetlemek.

## Girdiler
- `docs/07_KIT_STANDARDI.md` §2

## Yapılacaklar
1. CLI: `python3 tools/kit_check.py <kit kökü> [--paket 1|3|hepsi]`.
2. Kontroller: dosya var mı; oran §2'deki ölçüye ±%2 uyuyor mu (piksel değil oran); şeffaf olması gerekenlerde gerçek alfa var mı ve kenar pikselleri çoğunlukla şeffaf mı (nesne kesilmemiş); mockup'larda en büyük #00FF00 bölgesi (tolerans ±40) tek parça ve dikdörtgene yakın mı.
3. Çıktı: dosya başına GEÇTİ/KALDI + neden; herhangi KALDI varsa çıkış kodu 1.
4. Görüntüde yazı/harf olup olmadığını OCR ile denemek opsiyonel (pytesseract yoksa atla, raporda belirt).

## Bitti sayılması için
- [ ] V01 klasöründe (henüz boş) çalıştırınca eksik dosyaları düzgün raporluyor
- [ ] Sahte iyi/kötü örneklerle doğru sonuç

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_
