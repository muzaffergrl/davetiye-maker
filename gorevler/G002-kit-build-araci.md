---
id: G002
baslik: tools/kit_build.py — kit dokularından 17 Canva katmanı üret
rol: gpt-kod
durum: hazir
alan:
oncelik: 1
bagimli: []
yazar: [tools/kit_build.py, tools/tests/]
---

## Amaç
Bir renk kitinin ham GPT görsellerinden (doku/dekor/foto) Canva'ya yüklenecek 17 katmanı otomatik üretmek. Şekiller değişmez, yalnız yüzey değişir.

## Girdiler
- `docs/07_KIT_STANDARDI.md` (§3 tablo = tam şartname)
- Maske kaynağı (salt okunur): `collections/02_Dusty_Blue/assets/layers/*.png|jpg`
- `collections/02_Dusty_Blue/canva/ASSET_MAP.json`
- `<kit>/palette.json`

## Yapılacaklar
1. CLI: `python3 tools/kit_build.py <kit kökü> [--photos <klasör>]` → `<kit kökü>/kit_layers/` altına 17 dosya, adlar ve piksel ölçüleri §3 ile birebir.
2. Kağıt yüzeyli katmanlar: maske katmanının alfa kanalı korunur; doku tekrarlanarak (tile) doldurulur; maske katmanının parlaklığından gölge/kıvrım bilgisi çıkarılıp (ör. luminance / ortalama luminance) dokuyla çarpılır.
3. `invitation_card_blank.png`: çerçeve çizgileri `palette.gold` ile; mümkünse maskedeki altın çizgilerin piksellerini renk kaydırarak yeniden boya.
4. Botanik katmanlar: `botanical_corner.png` ölçekle; `_br` sürümleri 180° döndür.
5. Fotoğraflar: hedef orana merkezden kırp (yüz algılama gerekmez); `--photos` verilmezse V01 ortak `photos/` klasörü.
6. Ham dosya eksikse o katmanı atla ve raporla (sıfır dışı çıkış kodu değil, uyarı listesi).
7. Test: `tools/tests/` altında sahte doku/dekor üretip (PIL ile) aracı çalıştıran küçük test; repo içine büyük ikili dosya koyma.
8. Yalnız Pillow + numpy kullan; `tools/requirements.txt`'ye gerekirse ekleme önerisini Sonuç'a yaz (dosya entegratörde).

## Bitti sayılması için
- [ ] Sahte girdilerle 17 dosya doğru ad/ölçüde üretiliyor
- [ ] Maske katmanları değişmedi (git diff temiz)
- [ ] Sonuç'ta örnek çıktı görüntüsünün yolu (scratch, commit edilmez) ve bilinen sınırlar

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_
