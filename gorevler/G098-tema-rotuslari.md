---
id: G098
baslik: Tema rötuşları — GM07 parçalarını 16/17/20'ye takma, theme-check yatay taşma açığı, 16 home fold, 17 başlık "TOGETꞪER", 12 cüzdan metinleri
rol: claude-kod
durum: inceleme
alan: claude-G098
oncelik: 2
bagimli: [GM07, G101]
yazar: [platform/scripts/theme-check.cjs, platform/themes/emerald-gold-estate/, platform/themes/sunflower-rustic-barn/, platform/themes/coastal-seaside/, platform/themes/olive-ivory/, platform/themes/tropical-destination/, platform/tests/theme-emerald-gold-estate.test.ts, platform/tests/theme-sunflower-rustic-barn.test.ts, platform/tests/theme-coastal-seaside.test.ts, platform/tests/theme-tropical-destination.test.ts, platform/previews/g401/, platform/previews/g412/, platform/previews/g416/, platform/previews/g417/, platform/previews/g420/, gorevler/G098-tema-rotuslari.md, gorevler/G401-website-kaynak.md, gorevler/G412-website-kaynak.md, gorevler/G416-website-kaynak.md, gorevler/G417-website-kaynak.md, gorevler/G420-website-kaynak.md]
---

## Amaç
Koordinatörün (entegratör) doğrudan görevi: (1) GM07'nin kullanılabilir rötuş parçalarını 16, 17, 20 temalarına takmak — kullanıcı
kuralı **"yalnız ham imagegen çıktısı"**: kaynak PNG'de piksel düzenlemesi yok, ölçek/konum farkı CSS/manifest yerleşimiyle,
temaların olağan dönüştürme hattıyla (parts_prep → WebP); (2) G101 Sonuç'undaki "theme-check 19'daki taşmayı neden yakalamadı"
notunu uygulamak ve 20 temanın hepsinde `theme-check --stress` ile yeni kontrolün yakaladığı gerçek taşmaları düzeltmek;
(3) 16 home fold'una 15/17'deki isim itme düzeltmesi; (4) 17 başlıklarında "TOGETꞪER"; (5) 20 `site.js` bütçesi.
Ek (koordinatör, çalışma sırasında): 12 tropical-destination cüzdanla açılıyor ama iki metin "envelope" diyordu.

## Sonuç

**2026-10-16 · claude-kod · worktree dalı `g098-tema-rotuslari`** (koordinatör dalı `claude/zealous-fermi-hy1o40` 7cd4092 üstünde;
push yok, main'e dokunulmadı, Vercel yayını yok). Gerçek iPhone/Safari ve Android denenmedi.

### 1. GM07 parçaları (kural: yalnız ham imagegen — kaynak PNG'lerde piksel/alfa/boyut düzenlemesi yok)
GM07 parçaları GPT_PROMPTS.md'de Kaydet satırı olmadığından parts_prep'in otomatik listesine girmiyor; temaların
`build_images.py`'si aynı hattı elle çağırıyor (`parts_prep.parca_isle`: alfa > 8 kutusuna kırpma + 8 px pay, `#00FF00`
penceresi + GPT "bulut lekesi" dolgusu, geçici klasör) → ölçek + WebP. Manifest'e kaynak yolu ve SHA-256 yazılır.
`collections/` altında hiçbir dosya değişmedi.

| Parça | Tema | Karar | Nasıl / neden |
|---|---|---|---|
| `countdown_box_r2.png` (1254² ham tuval) | 17 | **kullanıldı** | W1.2'nin dört altın çerçeveli sayaç kutusu (önceki sapma: sade rakam). Parça 4:5 dik, comp kutuları ~6:5 yatık: `.cd-cell::before` sol yarı, `::after` sağ yarı, ikisi de hücre yüksekliğine ölçekli — düz çift çizgi ortada birleşir, köşe süsleri bozulmaz (§5.7 "parçayı kesmek"; CSS çerçeve yok, K21 testi geçer). Hücre ≥ 64 px, etiket 11 px, 4 hane gün sayısında hücre genişler. 320–430 px ve 844×390 / 667×375'te etiketler kutunun içinde (ölçüldü). |
| `pill_sprig_r2.png` (1254² ham tuval) | 17 | **kullanıldı** | Hero RSVP hapının iki yanında (`.hero-cta .btn::before` aynalı, `::after`), −20° uç yukarı-dışa (comp gibi), `brightness(.72)` = altın hapta kabartma. Yalnız hero hapında. |
| `frame_portrait_r2_v2.png` (yuvarlak lomboz) | 20 | **kullanıldı** | Story'nin üç lombozu + home'daki story_1 lombozu (önceki sapma: dik oval). Gradyanlı yeşil + ortada alfa deliği olan pencere olağan hatla tam şeffaf (`leke_px` 400 394, `foto_alani` her WebP'de 0 görünür piksel). Foto alanı 870/872 (≈ 1:1), telefonda pencere 40vw ≥ 38vw. `site.js` değişmedi. |
| `closure_r2_v3.png` (fiyonk + buğday spreyi) | 16 | **kullanıldı (zarf + teşekkür kartı)**; RSVP kartında **kullanılmadı** | Bant eski `closure.png`'ye göre ölçülen **−44 px** ile yerleştirildi (`bant_kaymasi`; yalnız alfa kutusunun tuvaldeki konumu, piksel aynı). Hiza: uçlar −0,54 / −1,17 %, üst +1,43 %, alt +0,13 % (tamam). Sağ uç zarf sütununu ~8 px aşıyor → `.closure-clip` keser; sahne kutusu bu yüzden genişlemez (zarf katmanları değişmedi). Comp W1.1'e eskisinden yakın (`previews/g416/compare_closure.jpg`, `g098_closure_before_after.png`). **RSVP kartının kurdelesi** eski spreysiz closure'dan kalır (`card_ribbon-*`, bayt bayt eski `closure-*`): spreyli parça kart genişliğinde ~17cqw uzun; 390×844'te ya imzanın üstüne biniyordu ya da `folds` onu ilk ekranın altına itip kartta ~400 px boşluk bırakıyordu (denendi). |
| 15 ve 19 çerçeveleri | — | **kullanılmadı** | Koordinatörün kararı (reddedildi); mevcut parçalar kaldı. |

### 2. theme-check yatay taşma açığı (G101 notu)
`scripts/theme-check.cjs` `hscrollOf()`: `documentElement`, `body`, `scrollingElement` `scrollWidth`'leri ve CDP
`Page.getLayoutMetrics` içerik genişliğinin en genişi − viewport (sayfa denetimleri + zarf sayfası, kapalı/açık/zorlama);
hata satırı ölçüleri yazar (`html 360 · body 446 · content 360 · viewport 360`). Doğrulama: 19'un `.frames-sec` kırpması geçici
geri alınınca home'da 13 hata (360: +86 px … 768: +84 px) — eski kontrol 0 buluyordu. (Not: CDP içerik genişliği bu durumda
viewport'a eşit kaldı; yakalayan `body.scrollWidth`.)

**20 temanın hepsinde `--stress`** (değişmeyen 15 tema `--no-video --compare none`, çıktı geçici klasör; değişen 5 tema tam koşu,
önizlemeler `previews/g4NN/`):

| Tema | Sonuç | Not |
|---|---|---|
| 01 olive-ivory | önce 124/0/**2** → düzeltme sonrası **128/0/0** | **Yeni kontrolün yakaladığı gerçek taşmalar:** home 360 (zorlama) `body` 362 — eğik RSVP vinyeti (`.v-rsvp` 7°) → `.more-sec { overflow-x: clip }`; details 360 (zorlama) `body` 367 — dress code satırında 24 karakterlik etiket `flex: none` → `.dress .kicker { flex: 0 1 auto; min-width: 0 }` (zorlamada etiket iki-üç satıra kırılır). |
| 16, 17, 20 | 128/0/0 (×3) | 20'nin ilk tam koşusunda 1 hata ("nav … view transition 0 ms %78 fark") üç tarayıcı denetimi aynı anda koşarken çıktı; tek başına yeniden koşuda 128/0/0 — yük kaynaklı zamanlama. |
| 12 tropical-destination | 112/0/0 (tam koşu, metin değişikliği sonrası) | taşma yok |
| 02–05, 07–10, 13–15, 18, 19 (değişmedi) | hepsi 0 hata (111–127 PASS; 03'te 37 uyarı = Cormorant Garamond yüklenmedi uyarıları, önceden de var) | |
| 11 tuscan-vineyard, 06 dusty-blue-champagne | taramada 1'er hata, **yeniden koşuda 111/0/0 ve 127/0/0** | 11: draft önizlemesinde davet kartı piksel testi; 06: "RSVP in preview" akışı — ikisi de yatay taşma değil, tarama iki theme-check'i paralel koşarken çıktı; tek başına geçiyor (yük kaynaklı zamanlama). Kod değişmedi. |

### 3. 16 home fold
G101'in 15/17 düzeltmesi (`fold`'un `cut`'ı `.names`'i atlar) 16'ya uygulandı. Sınama (stres isimleri DOM'a basılıp
`fitNames` yeniden koşturuldu, 6 boy): 375×553, 360×640, 390×690, 360×560, 375×667'de h1 zaten ilk ekranda başlıyordu (risk
görünmedi); **320×568'de h1 tamamen ilk ekranın altına itiliyordu (h1 580–830)** → düzeltmeyle 245'te başlıyor (§12 kaydında
kaydırma izinli). `is-short` eklenmedi: tasarım aralığında (range) 375×553'te RSVP zaten nav'ın üstünde (theme-check geçiyor).

### 4. 17 "TOGETꞪER"
Ligatür değil, **kerning**: Cinzel Decorative'in h–e çifti e'yi h'nin sağ sapının altına sokuyor ("TꞪE DAY", "Order of TꞪE Day",
zorlama metninde "TOGETꞪER"; ad "Stephen/Heather" gibi isimlerde de olurdu). `font-variant-ligatures`, `liga/clig/dlig/hlig/
calt/rlig/ccmp/salt` kapatma denendi — etkisiz; `font-kerning: none` çözüyor. En küçük düzeltme: `.display { font-kerning:
none }` (yalnız Cinzel Decorative satırları; diğer çiftlerde fark gözle seçilmiyor). Önce/sonra:
`previews/g417/g098_kerning_before_after.png` (details başlığı, home "The Day", rsvp kapanışı).

### 5. Bütçeler
| Tema | site.css (≤ 46 080) | site.js (≤ 35 840) | klasör | ilk görünüm index / home KB (yer tutucu; fotoğraflı) |
|---|---|---|---|---|
| 17 | 46 059 (rgba boşlukları, ortak maske tanımı, yorumlar kısaldı; kontrast notları README'ye) | 35 822 (değişmedi) | 1,87 MB | 858 / 576; 923 / 975 |
| 16 | 45 680 | 34 738 | 2,51 MB | 1213 / 890; 1304 / 1280 (index +22 KB: spreyli `closure-880` 95 KB) |
| 20 | 46 059 | 35 829 (değişmedi) | 2,20 MB | 897 / 905; 982 / 1308 |
| 01 | 46 056 | — | — | 1001 / 817; 1074 / 994 |

### 6. Koordinatör eki: 12 tropical "envelope"
Cüzdanla açılan temada iki misafir metni: home `home_replay` "Open the envelope again" → **"Open the wallet again"** (README'deki
nesne adı: cüzdan), rsvp `rsvp_replay` "Replay the envelope" → **"Replay the opening"** (diğer zarfsız temalarla aynı; max 30).
Şablon + `theme.json` varsayılanı; `copy-manifest --check` temiz; yeni test: hiçbir sayfanın görünen metninde, aria-label'da ve copy
varsayılanlarında "envelope" yok.

### Komutlar
- `theme-check --stress`: 17 128/0/0 · 16 128/0/0 · 20 128/0/0 (tek başına; ilk paralel koşuda VT zamanlama hatası, yukarıda) ·
  01 128/0/0 · 12 112/0/0; değişmeyen 15 tema tablodaki gibi (11, 06 yeniden koşuda temiz).
- `g051-browser`: 17, 16, 20, 01, 12 — 44/44 (×5). `final-smoke`: 17, 16, 20, 01, 12 — 45/45 (×5).
  (16/17/20 görüntüleri `previews/g41N/final/`, 17 g051 `previews/g417/g051/`; 01/12 g051 + final-smoke çıktıları geçici klasörde.)
- `npm test` 1218/1218 · `npm run typecheck` temiz · `npm run build` + trace-check temiz (21 tema).
- `copy-manifest --theme tropical-destination --check` temiz. `build_images.py` (16, 17, 20): yeniden üretim GM07 dışındaki
  çıktıları bayt bayt aynı bıraktı (yalnız GM07'nin değiştirdiği dosyalar + manifest değişti; önce `--out` geçici klasörle karşılaştırıldı).
- Önizlemeler yeniden üretildi ve bakıldı: `previews/g401|g412|g416|g417|g420/` (+ `g417/g098_kerning_before_after.png`,
  `g417/g098_countdown_before_after.png`, `g416/g098_closure_before_after.png`, `g416/compare_closure.jpg`, `stage_closed.jpg`).

### Açık kalanlar
- qa-kontrol incelemesi (entegratör): 17 sayaç kutusu/dal, 20 lomboz, 16 kapanış görsel kapısı.
- 16 RSVP kartında kurdele spreysiz kaldı (comp W1.5'te sprey var) — spreyli parça kartı ilk ekrana sığdırmıyor; ya kart
  içeriği kısaltılmalı ya da daha alçak spreyli bir kurdele parçası (gpt-gorsel) gerekir.
- 20 `site.js` 35 829 B — bu görevde dokunulmadı; sonraki JS eki yorum kısaltmadan sığmaz. 17 `site.css` 46 059 B (21 B pay).
- Gerçek iOS Safari / Android Chrome denenmedi (`border`-suz iki yarım arka plan, `font-kerning`, `overflow-x: clip`).

## Günlük
- 2026-10-16 açıldı ve alindi: claude-G098 (koordinatörün doğrudan görevlendirmesi; worktree, dal `g098-tema-rotuslari`)
- 2026-10-16 bitti, incelemeye gönderildi (koordinatöre rapor; push yok)
