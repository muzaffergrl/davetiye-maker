---
id: G002
baslik: tools/kit_build.py — kit_map.json'a göre Canva katmanları üret (20 tasarım için genel)
rol: claude-kod
durum: bitti
alan: claude-kod-2
oncelik: 1
bagimli: []
yazar: [tools/kit_build.py, tools/tests/, collections/02_Dusty_Blue/kit_map.json]
---

## Amaç
Her tasarımın (01–20) ve her renk kitinin ham GPT görsellerinden Canva'ya yüklenecek katmanları `kit_map.json`'a göre otomatik üretmek. Şekiller maskeden (koddan çizilmiş katmanlar) gelir, yüzey GPT'den. Tek araç bütün tasarımlarda çalışır.

## Girdiler
- `docs/07_KIT_STANDARDI.md` §6 (genel `kit_map.json` biçimi ve method'lar) ve §3 (tasarım 02 tablosu)
- Maske kaynağı (salt okunur): `collections/02_Dusty_Blue/assets/layers/*.png|jpg`
- `collections/02_Dusty_Blue/canva/ASSET_MAP.json`
- `<kit>/palette.json`

## Yapılacaklar
1. CLI: `python3 tools/kit_build.py <koleksiyon veya kit kökü>` → `kit_map.json`'u okur, `out` klasörüne yazar. Tasarım 02 için `collections/02_Dusty_Blue/kit_map.json`'u da sen yaz (§3 tablosundan; 17 katman). Renk kitleri (`variants/Vxx`) için `--map collections/02_Dusty_Blue/kit_map.json` ile kaynak kökü değiştirilebilsin.
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
**Yapılan (claude-kod-2, 2026-10-09):**
- `tools/kit_build.py` — `python3 tools/kit_build.py <kit kökü> [--map <kit_map.json>] [--photos <klasör>]`.
  Yalnız Pillow + numpy (`tools/requirements.txt`'ye ek gerekmiyor; kit_check ile aynı bağımlılıklar).
  Yöntemler: `cover` (`anchor` odaklı kırp), `fit` (`trim`, `pad`), `texture_mask` (maske alfası + tile doku ×
  maske luminansı / dolu bölgedeki ortalama luminans → ortalama ≈ 1), `pattern_mask` (gölgesiz), `tint`
  (`color`, `#hex` veya `palette.<anahtar>`), ayrıca `rotate` 90/180/270 (saat yönü), `flip` h/v/hv, `tile_scale`.
  Ayrı ve **isteğe bağlı** `texture_mask_lines`: texture_mask + maskedeki yüksek kromalı (altın) çerçeve
  piksellerini `line_color` (vars. `palette.gold`) ile yeniden boyar. Tasarım 02 haritası bunu **kullanmıyor**
  (invitation_card_blank = `texture_mask`; çizgiler kağıt tonunda hafif gölge olarak kalır). Altın çerçeve
  istenirse haritada method'u `texture_mask_lines` yapmak yeterli.
  JPG çıktılar opak düzleştirilir (vars. beyaz zemin, `background` ile değişir), kalite 92; PNG RGBA.
- Yol kuralı (modül docstring'inde): `source` → CLI kit köküne; `shared: true` → haritanın klasörüne (ortak
  fotoğraflar; varyantlarda da çalışır); `mask`/`masks` → haritanın klasörüne; `out` → kit köküne; palet önce
  kit kökü, yoksa harita klasörü. Eksik kaynakta V01'e geri düşülmez (yanlış kitin dokusu sessizce girmesin).
- Koruma: `collections/*/assets/layers/` ve maske klasörü altına yazma kodda reddedilir (çıkış 2).
  Eksik kaynak/maske → katman atlanır, uyarı + özet, çıkış 0. Geçersiz harita → çıkış 2.
- `collections/02_Dusty_Blue/kit_map.json` — §3'teki 17 katman, ad/ölçü/kaynak/method. Mühür: `fit` +
  `trim` + `pad: 24` (kırp + ölçekle); botanik `_br`: `rotate: 180`; foto: `cover` + `shared: true`,
  hero için `anchor [0.5, 0.35]` (yüz algılama yok, üst-orta odak).
- `tools/tests/test_kit_build.py` — sahte ham dosyaları geçici klasöre üretir, gerçek harita + gerçek
  dondurulmuş maskelerle çalıştırır.

**Test edildi:** `python3 tools/tests/test_kit_build.py` → `test_kit_build: tamam (17 katman, alfa korundu,
JPG opak, eksik kaynak atlandı, koruma çalışıyor, maskeler temiz)` (~57 sn). Denetlenenler: 17 dosya tam ad
ve ölçü; 6 texture_mask + liner katmanında alfa maskeyle **birebir** aynı; düz dokuda dolu bölge ortalaması
dokuya ±%4 (gölge ortalaması ≈ 1); JPG'ler JPEG/RGB; botanical_br 180° dönük; mühür kırpılıp ölçeklenmiş;
eksik 2 ham dosyada 7 katman atlanıp çıkış 0; `texture_mask_lines` çizgileri palette.gold'a ±25 içinde;
geçersiz harita → 2; çıktı maske klasörü / `collections/X/assets/layers` → reddedildi; test öncesi/sonrası
`git status -- collections/02_Dusty_Blue/assets/layers` boş. `python3 tools/tests/test_kit_check.py` de geçti.
Repoda boş kitle çalıştırma: 17/17 "kaynak yok" uyarısı, çıkış 0, hiçbir dosya yazılmadı.
Örnek çıktı (scratch, commit edilmedi): `/tmp/claude-0/-home-user-davetiye-maker/45108160-6bdd-5060-b8b3-696748e18c0b/scratchpad/kit_build_ornek.png`
(sahte blush kağıtla zarf/kart/polaroid; maske gölgeleri ve kıvrımlar korunuyor).

**Test edilmedi:** gerçek GPT dosyalarıyla çalıştırma (ham dosyalar henüz yok — G010/G011 bekleniyor);
çıktıların Canva'ya yüklenip `update_fill` ile yerleşimi; doku dikiş izinin (tile seam) gerçek dokuda
görünürlüğü; V02–V06 köklerinde uçtan uca çalıştırma (yapı aynı, sahte kitle test edilen akış).

**Bilinen sınırlar:** yüz algılama yok (yalnız `anchor`); tile dokunun kendisi dikişsiz değilse dikiş görünür
(araç düzeltmez); `texture_mask` maske renk bilgisini atar, yalnız parlaklığı kullanır (V01'deki mavi/altın
detaylar paper tonunda gölge olur — altın çerçeve için `texture_mask_lines`); `tint` gri ton × renk çarpımıdır
(beyaz → tam renk). PNG `optimize=True` büyük katmanlarda yavaş (tam 17 katman bu konteynerde ~20 sn).

**Not / önerilen:** `gorev.py kontrol` G002 ↔ G028 çakışması bildirdi (ikisinin de `yazar`'ında `tools/tests/`;
farklı dosyalar). G002 inceleme'ye geçince kalkar; G028'in `yazar`'ını `tools/tests/test_mockup_compose.py`
gibi dosya adına daraltmak önerilir (entegratör). Not: bu görevin 3 dosyası başka bir ajanın `6e8cca7`
commit'ine (Video pilotu) `git add -A` ile girmiş; içerik aynı, bu commit Sonuç'u ekliyor.

## Günlük
- 2026-10-09 alindi: claude-kod-2
- 2026-10-09 bitti, incelemeye gönderildi
- 2026-10-09 entegratör onayladı
