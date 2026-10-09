---
id: G032
baslik: tools/parts_prep.py — GPT parçalarını Canva katmanına hazırla (kırp, yeşil pencere, ön cep)
rol: claude-kod
durum: bitti
alan: claude-kod-9
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
- [ ] Test geçiyor (✓); gerçek GPT dosyası gelince 03 üzerinde çalıştırılıp önizleme bakılacak (G031)

## Sonuç
**Yapılan (claude-kod-9, 2026-10-09):** `tools/parts_prep.py` + `tools/tests/test_parts_prep.py`. Yalnız Pillow + numpy;
`kit_check.beklenenler` (parça listesi PAKET 4 `**Kaydet:**` satırlarından, `/parts/`) ve `mockup_compose`
yardımcıları (`en_buyuk_bolge`, `genislet`, `_kutu_bulanik`) içe aktarılır, kopyalanmadı.

`python3 tools/parts_prep.py collections/03_Blush_Garden_Rose [--out kit_layers] [--comps] [--strict] [--json]`
- Opak dikey (bg_scene) → 9:16 merkez kırpma → `bg_scene_1080x1920.jpg`, `bg_scene_2160x3840.jpg`; 1024×1536'dan
  2160×3840 ×2,5 büyütmedir, özet uyarı basar. Opak yatay (web_hero) kırpılmadan `web_hero.jpg`.
- Şeffaf parçalar → alfa kutusu + 8 px pay → PNG.
- Yeşil pencereler (birden çok olabilir) → şeffaf; kenar anti-alias'ı yerel zemine göre ayrıştırılır, kalan yeşil
  temizlenir; `windows.json` → `pencereler[parça] = [{katman, katman_olcu, kutu [x,y,w,h], maske, alan_px, doluluk}]`,
  şekil maskesi `masks/<katman>_wN.png` (beyaz, alfa = pencere). Prompt'ta #00FF00 istenip bulunamazsa uyarı.
- `envelope_open.png` → `envelope_pocket_front.png` (zarf katmanıyla **aynı tuval**; Canva'da aynı x/y/w/h, sıra zarf →
  kart → cep). Sınır renk/doku ile bulunur, ince ayar + tek kırılımlı parçalı doğru (düz/V); bulunamazsa geometrik V + uyarı.
- `--comps`: comp pencere kutuları 1080×1920 video koordinatında (`comp_pencereleri`), katman yazılmaz.
- Çıktı `assets/` altına yazılamaz (çıkış 2). Çıkış kodları docstring'de.

**Test edilen:** `python3 tools/tests/test_parts_prep.py` geçti (sahte görseller geçici klasörde: 9:16 ölçüler + kırpma
kutusu + büyütme uyarısı, yatay opak, alfa kırpma + pay, anti-alias kemer penceresi şeffaf / kutu ±2 px / yeşil kalıntı
yok / maske şekli, 3 pencere + GPT gerçek yeşili + bitişik şerit katılımı + uzak leke uyarısı, V cebi renkle ±3 px,
gölge cep katmanında yok, düz renkli zarfta geometrik geri düşüş, eksik dosya, --comps koordinatı, çıkış kodları 0/1/2,
--strict, bozuk dosya). Mevcut testler de geçti: test_kit_check, test_kit_build, test_mockup_compose, test_md_to_pdf.
**Gerçek veride:** G030'un T1 comp'ları (repo'da) ile `--comps` scratchpad'e çalıştırıldı: scene_2'de 1, scene_3'te 3
pencere bulundu, şeffaflaştırılmış önizlemede pencere kenarları temiz (göz kontrolü). Bu sırada bulunan sorun düzeltildi:
GPT'nin "düz #00FF00"ı gerçekte ≈ (3, 252, 40–46); kanal başına ±40 toleransı (mockup_compose/kit_check'teki) B > 40
yüzünden pencereyi parçalıyordu → burada yeşil baskınlığı eşiği (G − max(R,B) ≥ 150) kullanılıyor.

**Test edilmedi:** T2 parçaları (parts/) henüz yok — gerçek `envelope_open.png` üzerinde cep kesimi ve gerçek
şeffaf parçalarda kırpma denenmedi; G031'de 03 üzerinde çalıştırılıp önizlemeye bakılmalı. Canva'ya hiçbir şey yüklenmedi.

**Sınırlar:** cep kesimi sezgisel (kare, dik, önden zarf varsayımı; cep ile iç yüz aynı renkteyse geometrik V'ye düşer);
pencere bulma renk eşiğine bağlı; 2160×3840 bg büyütmedir. Ayrıntı modül docstring'inde.

**Entegratöre notlar:**
1. Görev numarası çakışması: `G030–G033` hem `*-tasarim-pilotu/parts-prep` hem `*-v04_navy_gold-kit.md` dosyalarında var;
   `gorev.py` (id → tek dosya) bu yüzden G032'yi V04 dosyası sanıyor (`al` "G090 bağımlı" diye reddetti). Bu görev
   dosyası elle alındı/bitirildi; numaralardan biri değişmeli.
2. `mockup_compose.yesil_maske(tol=40)` ve `kit_check` mockup yeşil denetimi aynı GPT yeşilinde (B ≈ 40–46) kısmen
   kaçırabilir — önerilen claude-kod görevi: o iki araçta da yeşil baskınlığı eşiğine geçiş + test.
3. `kit_layers/arch_frame.png` adı tasarım 03'ün eski `kit_map.json` çıktısıyla aynı; kit_build 03 için yeniden
   çalıştırılırsa üzerine yazar (K21 ile eski hat bekletildiği için şimdilik sorun değil).
4. scene_3 comp'unda sol/sağ çerçeveler 9:16 kırpma kenarına çok yakın (pencere x = 22 ve 787+269 = 1056 / 1080):
   parçalardan montajda çerçeveleri biraz içeri almak gerekebilir.

## Günlük
- 2026-10-09 alindi: claude-kod-9 (not: G032 numarası G032-v04_navy_gold-kit.md ile çakışıyor; gorev.py yanlış dosyayı okuduğu için elle alındı)
- 2026-10-09 inceleme: claude-kod-9 (elle; gorev.py G032 numarasını V04 dosyasıyla karıştırıyor)
- 2026-10-09 entegratör onayladı
