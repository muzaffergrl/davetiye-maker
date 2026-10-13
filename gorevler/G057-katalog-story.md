---
id: G057
baslik: katalog.py — story tablosunu content() üretecine taşı (yaz --zorla story'yi silmesin) (docs/11 §14 #12)
rol: claude-kod
durum: inceleme
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
**Yapıldı (2026-10-13, wf-tema01, claude-kod).** Yalnız `tools/katalog.py` değişti; hiçbir koleksiyon dosyası yeniden
yazılmadı (bütün kuru çalıştırmalar 0 değişiklik).

- **`STORY` tablosu** (`D`'nin hemen altında): `no → (intro, (başlık 1, 2, 3))`, G053'ün metinleri content.demo.json'dan
  birebir alındı. **20 tasarım**: görevdeki 19 (01, 02, 04–20) + **03**. 03 de eklendi, çünkü 03 `mevcut` değil:
  `yaz --zorla` 03'ün content.demo.json'ını da `content()`'ten yazıyor, 03 tabloda olmasaydı onun story'si silinirdi
  (03'ün kaydı story dışında `content(03)` ile zaten aynıydı).
- **`content(t)`** artık en sona `"story": story(t)` yazıyor (dosyalardaki yeriyle aynı). 03–20 için `json.dumps(content(t),
  indent=2)` dosyayla bayt bayt aynı. STORY'de olmayan tasarımda `content()` açık bir `KeyError` veriyor.
- **`ozet`**: 04–20 artık "atlandı (elle eklenmiş alan: story)" demiyor, "aynı" diyor (katalog değişirse kayıt yeniden
  yazılır, story korunur). 01 ve 02'nin elle yazılmış kayıtlarında yalnız `story` eşitleniyor: aynıysa dosyaya dokunulmuyor
  (sıkı biçim korunuyor), farklıysa öteki alanlar ve sıraları aynen kalıp yalnız `story` değişiyor (dosya o zaman
  `indent=2` biçimine geçer). 02'nin `DESIGN_BRIEF.md`'si eskisi gibi atlanıyor.
- **`kontrol`**: yeni `story_kontrol()`: her tasarımda STORY var, fazlası yok; intro boş değil, ≤ 200 karakter, tarihle
  birleştiği için boşluk/noktalamayla bitmiyor; tam 3 farklı, boş olmayan, ≤ 60 karakter başlık (docs/03 şeması); her
  koleksiyonun content.demo.json `story`'si STORY ile aynı (fark varsa düzeltme komutunu yazıyor).
- **`yaz --dene`** (yeni): yazmadan, içeriği değişecek dosyaları listeliyor; değişiklik varsa çıkış 1. `yaz` artık
  `encoding="utf-8"` ile yazıyor, son satırda değişen dosya sayısını da veriyor. Modül belgesi güncellendi.

**Test edildi:**
- `python3 tools/katalog.py kontrol` → çıkış 0; "story (STORY): 20 tasarım; content.demo.json kayıtlarıyla aynı".
- `ozet --dene` → 0 dosya değişecek, hiç "atlandı" yok (37 satır "aynı": 18 brief + 19 content.demo.json).
- `paket5 --dene` → 0; `gorev5 --dene` → 0.
- `yaz --zorla --dene` → listede hiç content.demo.json yok (story korunuyor). Gerçek deneme: repo kopyasında (scratch)
  `yaz --zorla` **gerçekten** çalıştırıldı → `collections/` ile repo arasında `diff -r` boş. Aynı denemede origin/main'deki
  eski `katalog.py` 03–20'nin 18 kaydından story'yi sildi ve bunun sonucu 04–20'nin 17 `GPT_PROMPTS.md`'si varsayılan
  başlıklara ("First hello" …) döndü; yenisinde ikisi de olmuyor.
- Kopyada STORY değiştirildi (01 başlığı, 05 intro): `kontrol` iki farkı yakaladı (çıkış 1); `ozet --dene` tam bu iki
  dosyayı gösterdi; `ozet --no 01,05` yazdı → 01'de yalnız `story` değişti, anahtar sırası aynı; ikisi de
  `validate_content.py`'den geçti; ardından `kontrol` 0, `ozet --dene` 0.
- Negatif durumlar (scratch betik): noktayla biten intro, 201 karakterlik intro, 2 başlık, tekrarlanan başlık, 61 karakterlik
  başlık, eksik ve fazla STORY kaydı → hepsi `story_kontrol()`'de sorun olarak çıktı; STORY'siz tasarımda `content()` KeyError.
- 20 `content.demo.json` `tools/validate_content.py`'den geçiyor (dosyalar değişmedi).
- `tools/tests/test_tema_build.py --hizli`, `test_kit_check.py`, `test_parts_prep_paket5.py` tamam; `platform/`
  `npm test` 263/263, `npm run typecheck` temiz (kod değişmedi, kayıt eşliği için çalıştırıldı).

**Test edilmedi / kapsam dışı:** `npm run build` (platform koduna dokunulmadı). Repoya test dosyası eklenmedi (`yazar:` yalnız
`tools/katalog.py`); denemeler scratch kopyada yapıldı.

**Bulunan, düzeltilmeyen (yazar dışı):**
1. `docs/09_TASARIM_KATALOGU.md` katalogdan geride: website tablosunun 01 satırı hâlâ eski açılış cümlesinde
   ("the olive sprig slides out from under the oval seal …"); a177cb4'te (closure_sprig kaldırıldı) yeniden üretilmemiş.
   `yaz --dene` bunu gösteriyor. Düzeltme: `python3 tools/katalog.py belge` (entegratör).
2. `yaz --zorla` hâlâ 302 var olan görev dosyasının üzerine yazar (durum, Sonuç, Günlük gider; `gorev5`'teki "alınmış/
   bitmiş görevi atla" koruması `yaz`'da yok). `--dene` artık bunu önceden gösteriyor. **Önerilen görev (claude-kod):**
   `yaz` görev dosyalarında `gorev5` gibi `durum` ≠ `hazir` olanı atlasın ve Günlük'ü korusun.
3. `docs/11_TEMA_STANDARDI.md` §2.1 ("`ozet` story'li kayıtları atlar; `yaz --zorla` story'yi siler") ve §14 #12 artık
   eski; §14 #12 "yapıldı (G057)" olmalı, §2.1'e "story `tools/katalog.py` `STORY`'de; değişince `ozet` + tema kopyası
   yeniden eşitlenir" yazılmalı (entegratör/docs).

## Günlük
- 2026-10-13 alindi: wf-tema01
- 2026-10-13 bitti, incelemeye gönderildi
