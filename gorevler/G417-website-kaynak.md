---
id: G417
baslik: Tasarım 17 Emerald & Gold Estate — platform teması
rol: claude-kod
durum: bitti
alan: claude-G417
oncelik: 3
bagimli: [G217, G038, G046, G052]
yazar: [platform/themes/emerald-gold-estate/, platform/tests/theme-emerald-gold-estate.test.ts, platform/previews/g417/]
---

## Amaç
Tasarım 17'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. **Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**

## Girdiler
- Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **kapaklı zarf** → §7.1 + §7.3; bitti tanımı §13, kontrol listesi §15
- Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek `platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı (`collections/03_Blush_Garden_Rose/website/`) örnek değildir
- GPT çıktıları (G217): `collections/17_Emerald_Gold_Estate/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)
- İçerik `collections/17_Emerald_Gold_Estate/content.demo.json`, renk `collections/17_Emerald_Gold_Estate/palette.json`, özet `collections/17_Emerald_Gold_Estate/DESIGN_BRIEF.md`
- Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py collections/17_Emerald_Gold_Estate --paket 5`, `node scripts/theme-check.cjs --theme <slug>` (G052)

## Yapılacaklar
1. `theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, `data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema `README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).
2. Parçalar: `python3 platform/themes/emerald-gold-estate/build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).
3. Zarf açılışı (`MOTION.envelope`, kapaklı zarf, docs/11 §7.1 + §7.3): On tap, the gold seal lifts away with a glint, the emerald flap opens upward, thin gold botanical lines draw themselves across the screen, and the marble card rises from the pocket. Katalog: Zümrüt yeşili zarf, altın mühür; kapak açılınca altın çizgiler çizilerek büyür. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı katmanlar; kart home'daki karta dönüşür; `closure.png` kare tuvalde büyük çizilir; yeri kesim geometrisine bağlanır (`manifest.closure`, docs/11 §7.1).
4. Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: Galeri duvarı: farklı boylarda ince altın çerçeveler zümrüt kadife duvara asılır (a gallery wall: three slim polished-gold frames of the same 3:4 shape in three sizes (large, medium, small) hung asymmetrically on the emerald velvet page); telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.
5. Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.
6. Fontlar: Cinzel Decorative + Cormorant Infant (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). Link blokları `data-if="urls.*"` ile linksiz kalkar — "link will be added soon" diyen ölü düğme yok (§4).
7. Testler ve önizleme (§13): `platform/tests/theme-emerald-gold-estate.test.ts`; `theme-check --theme emerald-gold-estate` (5 genişlik, kısa telefonlar, akışlar, ağırlık, MP4); `platform/previews/g417/` (W1 comp | tema karşılaştırmaları dahil).

## Bitti sayılması için
- [ ] docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)
- [ ] `npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-emerald-gold-estate.test.ts` (§13.2)
- [ ] `theme-check --theme emerald-gold-estate` hatasız; `previews/g417/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti
- [ ] Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları

## Sonuç
**Durum: inceleme bekliyor (claude-G417, dal `worktree-agent-a7c5436c2199215fc`, main/origin'e push yok).**

**Ne yapıldı.** `platform/themes/emerald-gold-estate/`: `theme.json` (5 sayfa, 5 foto alanı = manifest `box_px`, 71 copy
anahtarı), `content.demo.json` (koleksiyon kaydının birebir kopyası), `index/home/story/details/rsvp.html`, `site.css`
(45 817 B ≤ 45 KB), `site.js` (35 783 B ≤ 35 KB), `thank-you.css`, `build_images.py`, `README.md` (dosyalar, görsel hattı,
açılış, ilk ekranlar, **sayfa başına comp öğe haritası** + sapmalar), `img/` (tema klasörü 1,85 MB ≤ 3 MB). Test:
`platform/tests/theme-emerald-gold-estate.test.ts` (40 test; §13.2'nin 23 maddesi + zarf/mühür, mermer kart, galeri duvarı,
iç sayfalar, tarayıcıda ilk ekran, nav, home çerçeveleri, bütçeler, G068, G075, rotalar, gizlilik). Önizleme: `platform/previews/g417/`.

**Açılış (tek cümle):** dokununca altın mührün üstünden bir ışık geçer ve mühür (monogramıyla) izleyiciye doğru büyüyüp kalkar,
zümrüt çan kapak menteşesinde yukarı açılır (altın varak astar), ekran boyunca sekiz ince altın eğrelti/monstera/okaliptüs çizgisi
sapından yukarı kendini çizer, mermer kart cepten yükselir, öne gelir ve view transition ile home'un hero kartına dönüşür
(MOTION `go` 4,44 s; theme-check: dokunuştan home'a 4 660 ms ≤ 5 s; Skip her an; azaltılmış harekette 236 ms).
**Story (tek cümle):** galeri duvarı — aynı 3:4 ince altın çerçeve üç boyda kadifeye tek tek asılır (üstten düşüp bir kez
sallanır), başlığı yazılır, yanındaki okaliptüs dalı kendini çizer; telefonda basamaklı sol–sağ–sol (72/60/50vw, en küçük foto
penceresi 45,1vw ≥ 38vw), ≥ 720 px comp'un asimetrik duvarı tek sırada.

**Comp'tan bilinçli sapmalar** (ayrıntı README haritasında): geri sayımın altın çizgili kutuları yok, sade rakam (kutular CSS
çerçeve olurdu, K21/§5.7); RSVP hapının içindeki küçük dallar yok (parça yok); zarf comp'tan basık (GPT parçası 1,39:1, comp
≈ 1,2:1 — mühür ve kapak ucu comp ölçüsüyle bağlı); mühre monogram eklendi (comp'ta boş orta, §7.1 önerisi); story telefonda
basamaklı + masaüstünde tek sıra (comp dizilişi telefonda küçük pencereyi ≈ 20vw'ye düşürür); details programı iki sütun
(saat | etkinlik + yer), satır aralarında GPT eğrelti; RSVP mührü kartın dışında alt kenarda (kart metni sayılmasın), hapın
altındaki ikinci eğrelti yok; home'un davet kartı, iki asılı çerçeve ve kapanışı comp'ta yok (bu tasarımın parçalarıyla);
home kartında kasaba `venue.city` (comp'a uyuldu, §3.2 `city_region` der); mermer damarları kartın içinde açık griye sınırlandı.

**Komutlar ve sayılar** (hepsi bu worktree'de, PORT=3470):
- `python3 tools/kit_check.py collections/17_Emerald_Gold_Estate --paket 5` 23/23 (hiza sol −0,10 · sağ +0,20 · alt +0,13 %),
  `--paket 2` 5/5.
- `build_images.py --prep-dir /tmp/… --onizleme platform/previews/g417`: deterministik (ikinci koşuda bütün `img/` md5 aynı);
  pencereler şeffaf (0 piksel), kroma yeşili 0, yer tutucu altın payı ≤ %0,05, kapak kesimi `egri` artık 0,43 px.
- `node --test tests/theme-emerald-gold-estate.test.ts` 40/40; `npm test` **636/636**; `npm run typecheck` temiz;
  `npm run build` + trace-check geçti (16 rota, 7 temanın şablonları, rota başına ≤ 564 KB; varlık rotası 333 dosya).
- `theme-check --theme emerald-gold-estate --stress` (MP4 dahil, `platform/previews/g417/`): **128 geçti, 0 hata, 0 uyarı** (`checks.json`; `opening_390x844.mp4` 2,8 MB: dokunuş → açılış → home → story → details; karelerden sıra doğrulandı: parıltı → mühür kalkar → kapak açılır → altın çizgiler çizilir → kart yükselir → öne gelip home kartına geçer).
- `g051-browser --theme emerald-gold-estate`: 44/44 (`previews/g417/g051/`). `final-smoke --theme emerald-gold-estate`: 45/45 (`previews/g417/final/`; misafir yolu + alıcı yolu, panel, yayın, QR, yanıt).
- İlk görünüm (390×844, DPR 3): yer tutucuyla index 858 KB, home 563 KB; örnek fotoğraflarla 923 / 962 KB (≤ 1,5 MB).
- Entegratör dalı (`claude/amazing-bardeen-8yqoqt` @ 7dc3027) salt okunur `git archive` kopyasında (birleştirme yapılmadı),
  tema + test kopyalanarak: G068/G069/G075/G085/G093 ortak testleri + tema testi 128/128. Koordinatörün notundan sonra en yeni entegratör başı (4ec245a, main dahil: G094, G095, `my` slug'ı) da aynı yolla: `npm test` 995/996 — tek hata `theme-tropical-destination` testinin `previews/g412/compare_closure.jpg`'yi araması (dışa aktarımım `*.jpg` dosyalarını dışladı; dışa aktarma eseri, gerçek hata değil). Tema sayısını sayan kırılan ortak test yok; ortak dosyaya dokunmadım.

**Kendi QA turum:** 360/390/430, 375×553, 667×375, 844×390, 768, 1280; demo, zorlama kaydı (§12), aralık kaydı, teşekkür hâli,
yer tutucu ve örnek fotoğraflarla bütün sayfalar comp'larla yan yana incelendi; açılış sırası MP4 karelerinden. Bulunup
düzeltilenler: köşe kümesinin ekran kenarını aşması, mühür monogramının kart metni sayılması, 375×553'te hero'nun nav altına
girmesi (nav eğreltisi kısa ekranda gizli, kart `svh` ile), önizleme çubuğunun altında kümenin düz kesilmesi, zorlama kaydında
home çerçeve yazılarının dönerek taşması (`hang` yalnız çerçevede), açık cebin altın kenarının arka katmanda kalması
(`cep_cizgi`), mermer damarlarının serbest bölgeyi daraltması (`serbest_mermer`) ve imza satırında piksel testine değmesi
(`damar_yumusat`), dilim bandının kenar yapraklarına girmesi (`min_gen` 93), kart başlıklarının eğrelti süsüne binmesi,
açılışın 5 s'yi aşması (4 976 → 4 660 ms), JS/CSS bütçe aşımı.

**Denenmedi:** gerçek iPhone/Safari ve Android Chrome (`svh`, `mask`, `:has`, container query, `clip-path` WAAPI, belgeler
arası view transition), temanın Vercel'de yayını, gerçek alıcı fotoğrafları (farklı oran/ışık), yavaş ağ, VT'siz tarayıcıda
(Firefox) solma. **qa-kontrol incelemesi yapılmadı:** bu oturumda alt-ajan aracı yok — `compare_<sayfa>_390.jpg`'ler
`platform/previews/g417/`'de, entegratör qa-kontrol'ü çalıştırmalı (bitti şartı açık).

**Sorunlu GPT parçaları ve önerilen prompt düzeltmeleri** (`tools/katalog.py` `WEB[17]` / ortak metin; entegratör):
1. `envelope_closed/open`: comp'tan basık (1,39:1; W1.1 ≈ 1,2:1). Öneri: "envelope proportions as in W1.1, about 6:5
   (width:height), flap tip at about 70 % of the envelope height".
2. `invitation_card` / `info_card`: koyu gri damarlar kartın ortasına kadar iniyor; 3 dilimle uzayan kartta theme-check'in
   piksel testine (> 45 RGB, %0,5) değiyor. Öneri: "very soft, light-grey veining only near the corners; leave a clean
   horizontal band across the middle 40 % of the card with no veins or ornaments".
3. `envelope_open`: ön cebin altın kenarı 9–12 px kalın ve üstünde yine altın astar — `cep_kes` ayıramıyor (temada `cep_cizgi`
   ile çözüldü). Öneri: "the pocket rim is a thin gold line; the lining above it is a clearly different colour".
4. Geri sayım kutuları ve RSVP hapındaki dallar W1.2'de var ama parça değil → istenirse PAKET 5'e `countdown_box`,
   `pill_sprig` eki (önerilen gpt-gorsel görevi).

**Entegratöre notlar (paylaşılan dosyalar, düzenlemedim):**
- `tools/tema_build.py:879` `cep_kes("v")`: altın çizgili cep kenarında kesim çizginin altından geçiyor; temadaki
  `cep_cizgi` (`build_images.py:199`, çizgi boyunca tırmanma + yan kanat kat çizgisi atlama) `cep_kes`'e `kenar="ust"`
  seçeneği olarak taşınabilir (claude-kod görevi).
- `tools/tema_build.py:173` `serbest_bolge` (eşik 28): gri mermer damarlarını "dolu" sayıp card_small'ın bölgesini %55'e
  daraltıyor; `dolu` yüklemi parametre olsun (temadaki `serbest_mermer`, `build_images.py:323`: şeffaf ya da sıcak renk).
- `platform/scripts/theme-check.cjs:270-295` uzayan kart piksel testi tek kağıt rengiyle karşılaştırıyor; mermer gibi
  dokulu kağıtlarda düşük kromalı gri damarları ayrı saymak (ya da dilim bandının kendisiyle karşılaştırmak) yanlış alarmı
  önler — temada damar kontrastını 40 RGB'ye sınırlayarak geçildi.
- Bu dal entegratör dalıyla birleştirilmedi (birleştirme bu ortamda reddedildi). Entegratör dalının
  `platform/tests/design-themes.ts:25` listesi `emerald-gold-estate`'i zaten içeriyor; G068/G069/G075 ortak testleri tema
  klasörü gelince kendiliğinden kapsıyor — liste düzenlemesi gerekmez. Satış sitesine (G093 benzeri) 17'nin eklenmesi ayrı görev.

### qa-kontrol 2026-10-16: bulgular + düzeltmeler (G101 oturum A)
- **Ortak (orta) — program satırı fold boşluğu:** `details.html`'de `.sched-row`'lar `data-fold` birimi olmaktan çıktı (19'daki çözüm); itilen satır boyalı kartta ~130 px yazısız delik bırakıyordu. `stress_details_360.png`: 10 satır eşit aralıklı, boşluk yok. Test: `sched-row[data-fold]` = 0.
- **Düşük — h1 (stres) ve RSVP (tasarım aralığı) 375×553'te ilk ekranın altında:** 15'teki gibi. `fold` isimleri (h1) artık hiç itmiyor (`cut` `.names`'i atlar) → zorlama kaydında h1 ilk ekranda başlar (uzun hâli kaydırılır, §12 kaydında izinli); `fitNames`'e `is-short` adımı eklendi: dikey kısa telefonda kart küçülür (`clamp(100px, 20svh × .612, 126px)`), ardından `is-long` (sayaç hapın altına, kaydırınca). Taban 34 px kaldı (isimler zaten 3 satır). Sonuç: `range_home_375x553` RSVP alt 445 (nav 491); `stress_home_375x553` h1 223'te başlıyor. `site.js` 35 822 B (≤ 35 KiB; bir yorum kısaltıldı).
- **Düşük — "TOGETꞪER" — kalıyor (gerekçeli):** bu bir bağ (ligatür) değil, **Cinzel Decorative'in küçük harf `h` glifinin kendisi** (fontun süslü harfi; "The" de "TꞪE" çizilir). `font-variant-ligatures: no-common-ligatures / no-discretionary-ligatures / none` ve `font-feature-settings: "liga" 0, "calt" 0, "dlig" 0, "salt" 0` tek tek denendi: hiçbiri glifi değiştirmiyor (izole sayfada görüntülendi). Tek harfi sade Cinzel'den almak (`text=h` alt kümesi / span) denendi: Cinzel'in küçük `h`'si daha kısa, "ThE" gibi boy uyuşmazlığı çıkıyor → uygulanmadı. Gerçek çözüm başlık fontu kararıdır (ör. tamamen Cinzel'e geçmek, tasarım değişir) → entegratör/kullanıcı kararı.
- **Önerilen görev (entegratör açar):** 17 başlık fontu kararı — Cinzel Decorative'in süslü `h`'si ("TꞪE", "TOGETꞪER") istenmiyorsa başlıkları sade Cinzel'e (aynı aile, süssüz) geçirip comp ile yeniden karşılaştırma.
- Komutlar (2026-10-16, dal `claude/g101a-qa`): `theme-check --theme emerald-gold-estate --stress` **128 geçti, 0 hata, 0 uyarı**
  (`previews/g417/checks.json`) · `g051-browser` **44/44** · `final-smoke` **45/45** · `npm test` **1208/1208** · `typecheck` temiz ·
  `build` + trace-check temiz (21 tema). Zarf → home 4628 ms; ilk görünüm 390×844 DPR 3: index 858 / home 563 KB yer tutucu, 923 / 962 KB örnek fotoğrafla.
- Bakılan görüntüler (Read): `stress_details_360`, `range_home_375x553`, `stress_home_375x553`, TH test görüntüleri.
- Denenmedi: gerçek iPhone/Safari ve Android Chrome, Vercel yayını, gerçek alıcı fotoğrafları, yavaş ağ. Bu bölüm qa-kontrol
  alt-ajanının yeniden incelemesi **değildir**; yeniden inceleme entegratörde.

## Günlük
- 2026-10-13 blokaj: K22 (kullanıcı, 2026-10-13): videodan çıkıldı, ürün yalnız mobil öncelikli website. Yeni website standardı pilotla (G035) belirlenince yeniden tanımlanacak
- 2026-10-13 yeniden tanımlandı (K22–K24, G033)
- 2026-10-15 alindi: claude-G417
- 2026-10-15 bitti, incelemeye gönderildi
- 2026-10-15 entegratör onayladı
