---
id: G056
baslik: 03 teması uzun isim stresi + seed foto türevleri + validate_content --help (docs/11 §14 #9, #15)
rol: claude-kod
durum: inceleme
alan: wf-tema01
oncelik: 2
bagimli: [G055]
yazar: [platform/themes/blush-garden-rose/, platform/scripts/seed.ts, platform/tests/theme-blush-garden-rose.test.ts, platform/tests/seed*, tools/validate_content.py, docs/11_TEMA_STANDARDI.md]
---

## Amaç
`theme-check --theme blush-garden-rose --stress` index ve rsvp'de kalıyor: 40 karakterlik isimler zarfı ve "Tap to open"ı ekran dışına itiyor,
rsvp imzası `nowrap` taşıyor. Ayrıca seed fotoğrafları 640/1280 türevsiz; `validate_content.py --help` çöküyor.

## Yapılacaklar
1. 03: uzun isimlerde başlık ölçeği/kırılımı (script'te `&` kuralı korunur), zarf + ipucu ekranda kalır; rsvp imzası sarar/küçülür. Görsel çizim yok.
2. `seed.ts`: fotoğrafları panel yüklemesiyle aynı yoldan türevli kaydet; theme-check'in fotoğraflı ölçümü srcset ile.
3. `validate_content.py --help` düzgün çalışsın.
4. `theme-check --theme blush-garden-rose` ve `--stress` geçer; final-smoke, g051-browser geçer.

## Sonuç
**Yapıldı (wf-tema01, 2026-10-13).** Görsel çizilmedi, yeni GPT parçası istenmedi; yalnız yerleşim, tipografi ölçeği ve 03'ün
mevcut `info_card` parçasının §9 3 dilim kesimi.

1. **03 uzun isim (index + rsvp)** — `platform/themes/blush-garden-rose/`:
   - `index.html` `<h1 class="names" data-fit="1.5" data-fit-min=".4">`, `rsvp.html` imza `data-fit="2.5" data-fit-min=".5"`.
   - `site.js` `fitText()`/`initFit()`: işaretli satır CSS boyunun n satırından uzunsa CSS `--fit` ile küçülür (ikili arama,
     bulunan boyun %2 altı — alt piksel farkıyla satır sayısı değişmesin); zarf sayfasında fazladan yükseklik × 1,1 `--names-x`
     olarak `.env-page`'e yazılır ve `site.css` `--w` zarfı o kadar küçültür → kicker, isimler, zarf ve "Tap to open" boyalı
     zeminin düz bandında demodaki yerlerinde kalır. Font yüklenince (`document.fonts.ready` + `loadingdone`; yalnız `ready`
     ilk ölçümde font istenmeden çözülüyordu → imza 4 satıra taşıyordu) ve genişlik değişince yeniden ölçer. JS yalnız `--fit` ve
     `--names-x` yazar; kişisel metne dokunmaz (test). JS'siz: CSS boyunda sarar ("JS'siz hâli bugünkü").
   - `site.css`: isim/imza `text-wrap: balance` + `overflow-wrap: anywhere` (40 harflik tek sözcük kesilmez, kırılır — flex
     öğesinde `break-word` min-content'i küçültmediği için sözcük iki yandan kesiliyordu); zarf başlığındaki kicker
     `width: fit-content` (sarılan başlık bloğu sütunu doldurunca kicker kutusu sol üst şakayığa uzanıyordu — 14+15 harflik
     isimde bile backdrop ölçümü kalıyordu); yatay ekranda isim sütunu `max(40vw, 420px)` (önceden 22+ harflik isimler 1024–1440
     px'te sol üst çiçek parçasının üstüne biniyordu; demo isimleri 78 px tek satır, değişmedi); rsvp imzası `nowrap` değil;
     **RSVP kartı da 3 dilimle uzar**: iki `.info` kartı `class="info tall"` (details'teki `:has(.sched-list)` seçicisinin yerine,
     davranış aynı), RSVP metni görüntünün %34'ünden en çok %72 satırına; kapanış satırı (`.closing .kicker`) `overflow-wrap:
     anywhere`. `theme.json` sürüm 1.1.0. `site.css` 44 953 B (< 45 KB), `site.js` 31 136 B (< 35 KB), klasör 2,91 MB.
   - Ölçüm (`theme-check --stress`, 40+40 karakter): zarf başlığı 390×844'te 3 satır × 27 px, 360×640'ta 25 px; zarf 390×844'te
     ~328 → ~296 px; imza 3 satır × 22 px (390), kart 554 → 595 px. Demo kaydında görünüm aynı (isim boyu, zarf, kart; RSVP kartı
     360 px'te +4 px).
   - Ek tarama (geçici harness, repoda yok): 6 isim kaydı (demo, 14+15, 19+20, 30+28, 40+40, 40 harflik tek sözcük) × 360×640,
     375×553, 390×690, 390×844, 430×932 (zarf + ipucu ekranda, yazı altı zemin `theme-check` eşikleriyle, ekran dışı metin) ve ×
     768×1024, 1024×768, 1280×800, 1366×768, 1440×900, 1920×1080; rsvp × 360/390/430/768 — hepsi geçti. Değişiklikten önce
     14+15 harflik isim bile 375×553, 390×844 ve 430×932'de kicker'ı çiçeğe taşıyordu.
2. **`scripts/seed.ts`**: örnek fotoğraflar panel yüklemesinin yolundan — `preparePhoto(bayt, parseAspect(theme.json aspect))`
   (sharp: EXIF, metadata yok, alan oranına orta kırpım, ≤ 2400, JPEG q84, 640/1280 türevleri) + `savePhoto({width, variants})`.
   Pillow/python3 yolu kaldırıldı. `--photo-max <px>` (varsayılan 2400) daha büyük örneği önce o uzun kenara küçültür (kayıpsız PNG,
   tek JPEG kodlaması); `--photo-max 0` = özgün dosya tek parça (G055 öncesi yüklemenin hâli; `blob-adapter.test.ts` bunu kullanıyor);
   geçersiz değer hata. sharp yoksa panel gibi özgün dosya + not. Seed çıktısı satırı ölçü ve türevleri yazar (theme-check
   `checks.json` → `seed_photos`). Bilinçli fark: örnekler artık alan oranına **orta kırpılıyor** (alıcının kırpmasız yüklemesi gibi);
   önce tam görsel saklanıp CSS `object-position` ile kırpılıyordu.
   `theme-check` fotoğraflı ilk görünüm (390×844, DPR 3): index 1294 → **1099 KB**, home 1261 → **895 KB** (G055'in panel API
   ölçümü 1093 / 890 ile uyumlu); yer tutuculu 1028 / 717 KB.
3. **`tools/validate_content.py`**: argparse — `--help`/`-h` belge + çıkış kodlarıyla 0 döner; argümansız/fazla argüman kullanım
   hatası 2; bulunamayan/okunamayan/JSON olmayan/nesne olmayan kayıt iz yığını yerine tek satır `HATA:` + 2. 21 kaydın (20 koleksiyon
   + paketli demo) sonucu değişmedi (hepsi 0); TS eşlik testleri geçiyor.
4. **Testler:** `tests/seed.test.ts` (4: türevler + kırpım + metadata, yayındaki sayfada `srcset` = türevler + şablonun `sizes`'ı,
   `photoMax` küçültme / 0 = özgün dosya, CLI theme-check'in çağırdığı gibi + geçersiz `--photo-max`), `theme-blush-garden-rose.test.ts`
   +1 (G056: `data-fit` işaretleri, `--fit`/`--names-x` CSS'i, `.info.tall`, `fitText` yalnız iki değişken yazar).

**Komutlar (hepsi bu dalda, `npm run build` sonrası):** `npm test` 263/263 · `npm run typecheck` temiz · `npm run build` +
trace-check geçti · `theme-check --theme blush-garden-rose --stress` **85 geçti / 0 uyarı / 0 hata** (önce 79 / 0 / 20; dokun →
home 4370 ms; MP4 kaydedildi) · `g051-browser --theme blush-garden-rose` 44/44 · `final-smoke --theme blush-garden-rose` 42/42 ·
`g055-browser` 138/138 (details/davet kartı 3 dilim ve foto `srcset` dahil). Çıktılar geçici klasörde; `previews/g038/` bu görevin
yazma alanı dışında, yeniden üretilmedi.

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome (`text-wrap: balance` Safari 17.5+/Chrome 114+; yoksa normal sarma, küçültme
yine çalışır); yavaş ağ/font gecikmesi — uzun isimde başlık önce CSS boyunda görünür, JS + font gelince küçülür (bir kez zıplar);
Vercel'de yayın (bu görevin işi değil; canlı demo yeniden tohumlanırsa fotoğraflar türevli ve orta kırpılmış saklanır); gerçek alıcı
fotoğrafları.

**Entegratöre not (yazma alanım dışında):** `platform/README.md` "Alıcı fotoğrafı türevleri" (seed hâlâ tek dosya) ve "Açık
konular" G055 açıkları satırı (seed türevsiz; 03 `--stress`'te index/rsvp kalıyor) artık eski — G056 ile kapandı. `previews/g038/`
`checks.json` eski sayıları taşıyor (bu daldaki koşu: yukarıda).

**İnceleme düzeltmeleri (wf-tema01, 2026-10-13; G401 incelemesindeki 03'e de uyan bulgular):**
- "Replay the envelope" (home/rsvp → `index.html?replay=1`): zarf kartı her zaman `view-transition-name: invite-card` taşıyordu;
  geçiş anlık görüntüsü `.card-slot` `clip-path`'ini yok saydığı için kapalı zarfın üstünde ~0,3–0,6 s kırpılmamış bir kart
  uçuşuyordu. Şimdi `.env-page .card { view-transition-name: none }`, ad yalnız `.is-opened`'da ve `go(true)`'da
  (`el.card.style.viewTransitionName = 'invite-card'`); `index.html` `<head>` betiği `?replay=1`'de `is-opened` eklemez (CSP hash'i
  motor hesaplar). Tarayıcıda denendi: replay'de yalnız kök çapraz geçişi, kart uçuşmuyor; zarf → home kart dönüşümü sürüyor.
- Skip + Geri (bfcache, VT'siz tarayıcı): Skip `reset()` sonrası durum `closed` kalıyordu, `pageshow` temizlemiyordu → `state = 'done'`
  (`pageshow` artık solmayı iptal edip açık hâli kurar). Headless Chromium bfcache'ten dönmediği için yalnız kodda doğrulandı.
- `tests/theme-blush-garden-rose.test.ts`: yeni test (VT adı, varış kartı, Skip durumu, replay `<head>`). `theme-check --theme
  blush-garden-rose --stress` (yeni "kart görünür karta iner" ve "açık zarfta ipucu yok" denetimleriyle): sonuç G401 Sonuç'ta.
- `docs/11` (bu görevin yazma alanı): §2.1 ve §14 #12 G057'ye göre, §5.1 / §7.3 / §14 #11 01'in tek parça kapanışına göre
  güncellendi; G401 incelemesinden genel kurallar eklendi (§5.1 telefon sahnesi, §7.1 kart yolu, §11 varış kartı + VT adı + ipucu).

## Günlük
- 2026-10-13 alindi: wf-tema01
- 2026-10-13 bitti, incelemeye gönderildi
- 2026-10-13 inceleme düzeltmesi (wf-tema01): 03 replay'de VT adı yalnız açık zarfta, Skip bfcache durumu, docs/11 güncel
- 2026-10-13 bitti, incelemeye gönderildi
- 2026-10-13 son denetim (wf-tema01): theme-check --stress blush-garden-rose 86/86 (MP4 dahil), g051 44/44, final-smoke 42/42; platform/README.md'deki eski seed/G055 açıkları satırları güncellendi (Entegratöre not kapandı).
