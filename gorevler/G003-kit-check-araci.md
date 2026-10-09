---
id: G003
baslik: tools/kit_check.py — kit doğrulayıcı
rol: claude-kod
durum: bitti
alan: claude-kod-1
oncelik: 1
bagimli: []
yazar: [tools/kit_check.py]
---

## Amaç
GPT'nin ürettiği ham kit dosyalarını Canva'ya girmeden önce otomatik denetlemek.

## Girdiler
- `docs/07_KIT_STANDARDI.md` §2 ve §6
- Her kitin `assets/gpt/GPT_PROMPTS.md` dosyası (beklenen dosya listesinin kaynağı)

## Yapılacaklar
1. CLI: `python3 tools/kit_check.py <kit kökü>`. Beklenen dosyaları, ölçüleri ve şeffaflığı o kitin `GPT_PROMPTS.md` dosyasındaki `**Kaydet:** `yol` · ölçü · **Şeffaf zemin**` satırlarından çıkar (20 tasarımın ve V02–V06'nın hepsinde aynı biçim). `--paket` ile alt küme seçimi opsiyonel.
2. Kontroller: dosya var mı; oran §2'deki ölçüye ±%2 uyuyor mu (piksel değil oran); şeffaf olması gerekenlerde gerçek alfa var mı ve kenar pikselleri çoğunlukla şeffaf mı (nesne kesilmemiş); mockup'larda en büyük #00FF00 bölgesi (tolerans ±40) tek parça ve dikdörtgene yakın mı.
3. Çıktı: dosya başına GEÇTİ/KALDI + neden; herhangi KALDI varsa çıkış kodu 1.
4. Görüntüde yazı/harf olup olmadığını OCR ile denemek opsiyonel (pytesseract yoksa atla, raporda belirt).

## Bitti sayılması için
- [ ] Tasarım 02, 03 ve V02 klasörlerinde (henüz boş) eksik dosyaları düzgün raporluyor
- [ ] Sahte iyi/kötü örneklerle doğru sonuç

## Sonuç
- `tools/kit_check.py`: beklenen dosyaları her kitin GPT_PROMPTS.md `**Kaydet:**` satırlarından okur (20 tasarım, V01, V02–V06); `--paket 1|2|3`.
- Kontroller: dosya var mı (`_vN` denemeleri uyarı), oran ±%2, şeffaflık (alfa + kenar şeridi ≥%90 şeffaf + içerik var),
  opak dokuda şeffaf piksel yok, mockup'ta #00FF00 alanı ≥%5 ve sınır kutusunun ≥%90'ı (tek parça). Çıkış kodu 0/1.
- Test: `tools/tests/test_kit_check.py` (sahte iyi/kötü kit, repo dışında) — geçti.
- Boş kitlerde doğru eksik raporu: 02 Paket 1 → 0/6, 03 → 0/10, V02 → 0/9, 04 Paket 3 → 0/3.
- Test edilmedi: OCR ile yazı denetimi (yok; görsel kontrol listesinde kalıyor).
- `tools/requirements.txt`: Pillow, numpy eklendi.

## Günlük
- 2026-10-09 alindi: claude-kod-1
- 2026-10-09 bitti, incelemeye gönderildi
- 2026-10-09 entegratör onayladı
