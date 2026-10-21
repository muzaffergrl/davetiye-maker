# GPT işi — 4. dalga: 10 yeni tasarım (39–48), website katmanları + örnek fotoğraflar + basılı davetiye (2026-10-21)

Kullanıcı (2026-10-21): Etsy'de en çok satan dijital düğün websitesi akımlarına benzeyen **10 yeni tasarım**; GPT
prompt'ları hazırlansın. Kopya isteğine karşı kural (AGENTS.md şart 6): rakipten **akım ve özellik** öğrenilir; logo,
fotoğraf, çizim, dantel dosyası, düzen ve ilan adı **alınmaz**. Bu dalgadaki her tasarım akımın **özgün yorumudur**;
prompt'larda rakip dükkân adı, sanatçı adı, marka adı veya "X'in tarzında" ifadesi yoktur.

Kaynak gözlem: 2026-10-21 Etsy "wedding website template" ilk sayfası (pazar neredeyse tamamen Canva şablonu; ayrıntı ve
yöntem `docs/13_ETSY_ARASTIRMA.md`). Öne çıkan akımlar: Photo Booth, Old Money dantel + kuğu, empresyonist yağlı boya
bahçe, moody kahve + krem kır manzarası, chartreuse + pembe/bordo çiçek + siyah-beyaz anlık baskı, toile/chinoiserie,
western/countryside, bordo "old money" fiyonk, siyah-beyaz film, lacivert-fildişi arma. Ortak satış öğeleri (giriş
bileti, fark değil): tıkla-aç zarf, mum mühür/kapanış, ekranda çok fotoğraf, geri sayım, RSVP.

## Tasarımlar

Kurallar 3. dalgayla aynı (`docs/24_YENI_TASARIMLAR.md`): klasik, romantik, zengin; ilk sayfa **kapalı zarf** (K23 sıkı),
zarfın türü/kapanışı/açılışı ve iç sayfa bileşenleri her tasarımda farklı; kişisel alanlar HTML (görsele pişmez); K21:
bütün görseller GPT'den. Fontlar Google Fonts ve 01–38'in hiçbirinde yok. Ayrıntı her klasörün `DESIGN_BRIEF.md`'sinde.

| # | Klasör · tema id | Akım | Kapalı zarf / kapanış → açılış | Foto sunumu | Palet | Font |
|---|---|---|---|---|---|---|
| 39 | `39_Silver_Photo_Booth` · `silver-photo-booth` | Photo Booth | İnci-gümüş zarf, U kapak, zarfı dikey saran 3 kareli foto şeridi → flaş, şerit sıyrılıp üste iğnelenir | Krom yuvadan çıkan şerit, kareler flaşla tek tek "banyo olur" | silver-ivory-noir | Yesteryear + Libre Caslon Text |
| 40 | `40_Swan_Chantilly_Lace` · `swan-chantilly-lace` | Old Money dantel + kuğu | Kare fildişi zarf, yay kapak, ayrı Chantilly dantel örtü, kuğu mum mühür + siyah ipek kuyruklar → duvak gibi kalkan dantel | Siyah-beyaz tırtıklı baskılar, üstlerindeki dantel duvak açılır | ivory-noir-swan | Bonheur Royale + Crimson Pro |
| 41 | `41_Painted_Lily_Pond` · `painted-lily-pond` | Empresyonist yağlı boya bahçe | Keten-tuval zarf, boyalı deckle kapak, leylak nilüfer mühür → fırça darbeleri sahneyi boyar | Gerilmiş tuval panolar: tablodan fotoğrafa netleşme | lilypond-lilac-sage | Comforter Brush + Arapey |
| 42 | `42_Espresso_Pastoral` · `espresso-pastoral` | Moody vintage romance | Espresso laid kâğıt, V kapak, krem dantel bant + kuru çiçek demeti → astardaki manzaranın içine paralaks dalış | Kabine kart paspartuları: sepyadan renge | espresso-cream-candle | Mea Culpa + Cardo |
| 43 | `43_Chartreuse_Garden_Party` · `chartreuse-garden-party` | Chartreuse + pembe/bordo çiçek + s-b anlık baskı | Yatay chartreuse zarf, dalgalı kapak, yarıklardan geçen tek çiçek sapı → guaj çiçekler sırayla patlar | S-b anlık baskılar çiçekçi çubuklarında aranjmandan yükselir | chartreuse-pink-burgundy | Hurricane + Fraunces |
| 44 | `44_Blue_Toile_Pavilion` · `blue-toile-pavilion` | Toile / chinoiserie | Toile kumaş zarf, ogee kapak, porselen kamea broş → gravür kuşlar kumaştan havalanır | Askılı porselen tabak duvarı, sır parıltısı | toile-blue-porcelain | MonteCarlo + Rosarivo |
| 45 | `45_Suede_Ranch_Lace` · `suede-ranch-lace` | Western / countryside | Süet zarf, saçaklı kapak + dantel, deri kordon + gümüş konço → kordon çözülür, saçak salınır | İşlenmiş deri çerçeve önünde açılan çiftlik kapısı | suede-sage-sunset | Rye + Rochester + Lustria |
| 46 | `46_Bordeaux_Silk_Bow` · `bordeaux-silk-bow` | Bordo old money fiyonk | Fildişi keten zarf, deliklerden geçen bordo saten fiyonk → ilmek ilmek çözülür, sayfa boyunca akan kurdele | Kurdeleyle bağlı anı destesi yelpaze gibi açılır | claret-ivory-silk | Carattere + Brygada 1918 |
| 47 | `47_Monochrome_Darkroom` · `monochrome-darkroom` | Siyah-beyaz film | Siyah fotoğraf kâğıdı zarf, tuck kapak, 35 mm negatif halkası → film şeridi akar, kırmızı ışıkta kart banyo olur | Negatiften pozitife, kontak baskı + lup | noir-silver-safelight | Herr Von Muellerhoff + Newsreader |
| 48 | `48_Navy_Ivory_Crest` · `navy-ivory-crest` | Lacivert-fildişi monogram/arma | Lacivert keten cüzdan zarf, kör kabartma kartuş, boş kalkan mum mühür (baş harfler HTML) → arma kazınarak belirir | Köşesi kesik kabartma paspartu: kabartmadan tona | navy-ivory-laurel | Mr De Haviland + Goudy Bookletter 1911 |

Görsel sayısı (Kaydet satırları; PAKET 5 / 2 / 6): 39 → 19/5/2 · 40 → 21/5/2 · 41 → 20/5/2 · 42 → 21/5/2 ·
43 → 21/5/2 · 44 → 21/5/2 · 45 → 20/5/2 · 46 → 19/5/2 · 47 → 19/5/2 · 48 → 19/5/2 = **270 görsel** (200 website parçası,
50 örnek fotoğraf, 20 baskı zemini). Foto penceresi (`#00FF00`) yalnız çerçeve parçalarında; denetim:
`python3 tools/kit_check.py collections/<NN>_* --paket 5` (ve `--paket 2`).

Her klasörde: `DESIGN_BRIEF.md`, `content.demo.json` (kurgu çift; URL/medya null; `tools/validate_content.py` GEÇTİ),
`assets/gpt/GPT_PROMPTS.md` (tek kaynak: PAKET 5 website katmanları YAZISIZ → PAKET 2 örnek fotoğraflar → PAKET 6 basılı
davetiye), `assets/gpt/kuru_sekil.json` (tema kurulunca `tools/gpt_kuru_deneme.py` provası için). Durum: hepsi **concept**;
platform teması (`platform/themes/<id>/`) henüz yok. `COLLECTION_STATUS.md` ve `PROJECT_STATE.json` kayıtlarını entegratör
açar.

## GPT'ye (Codex, repo erişimli) yapıştırılacak talimat

```
Task: BKE Studio — 10 NEW wedding-website designs 39–48: generate every image in their GPT_PROMPTS.md files
(repo muzaffergrl/davetiye-maker, branch main).
First run: git pull --rebase origin main.

Work in parallel: one sub-agent per design (10 sub-agents: 39, 40, 41, 42, 43, 44, 45, 46, 47, 48). Each sub-agent works
ONLY inside its own folder collections/<NN>_*/assets/gpt/ (parts/, photos/, print/) and does this:

1. Open collections/<NN>_*/assets/gpt/GPT_PROMPTS.md. Read it top to bottom once (the Turkish notes explain how each part
   is used on the website; the English blocks are the prompts).
2. Use ONE separate image chat for this design (never mix two designs in one chat). Send the "Instructions for GPT"
   quote first. Then generate in this order: PAKET 5 (W1, W2, W3 … in order), then PAKET 2 (2.1 → 2.5), then PAKET 6
   (P1, P2). Use each English prompt exactly as written. From the third image on, attach the style-reference parts named
   in "Instructions for GPT" (and, for a part that sits on the same canvas as an earlier part — env_back / env_front /
   flap / band / bow / cord / ribbon / lace overlay — attach that earlier part and ask for the same canvas, the same
   envelope position and size). For PAKET 2 attach 2.1 to 2.2–2.4 so the couple stays the same two people.
   Any aspect ratio close to the Kaydet size is fine; the exact pixel size does not matter.
3. Check each image BY EYE (do not measure pixels):
   - the right single object, nothing cut by the image border, empty margin around it;
   - "Şeffaf zemin" = a real transparent background (not white, not a checkerboard), no shadow or glow around the object;
   - no text, letters, numbers, monograms, initials, logos, watermarks, QR codes (also not on seals, labels, crests);
   - parts with a photo window: ONE flat, bright, even green window of the asked shape (a green like RGB 3,252,45 is
     fine), nothing covering it, roughly in the asked place; parts WITHOUT a window must contain no green area;
   - same material, colours and light as the style-reference parts; "dikişsiz" grounds show no seam when you imagine
     them tiled 2×2;
   - photos: the same fictional couple in all five, natural hands, no resemblance to a real person or celebrity, no
     readable signs; PAKET 6: the central area described in the prompt is completely empty paper.
   If an image fails, regenerate at most 2 times, then save the best attempt anyway and note the problem. Never stop
   early: always continue to the next image until P2 is done.
4. Save each image with the exact path and file name on its "Kaydet" line (PNG for parts/print, JPG for photos). Never
   overwrite a different existing file; a retry you want to keep separately is saved as name_v2.png and you report which
   one is better.
5. Commit and push often so nothing is lost (git pull --rebase origin main before every push), only that design's new
   image files, with these messages:
     "PAKET 5 <NN>: website katmanları (W1–W6)"   then  "PAKET 5 <NN>: website katmanları (W7–W12)" … until the last W
     "PAKET 2 <NN>: örnek fotoğraflar"
     "PAKET 6 <NN>: basılı davetiye"
   Do not edit GPT_PROMPTS.md, DESIGN_BRIEF.md, content.demo.json, kuru_sekil.json or any file outside your folder.
   If you cannot write to the repo, stop and say so clearly in your report (never ask the user to upload files).
When all ten finish, report one line per design: NN, images saved (x/total), which ones are imperfect and why
(e.g. "W7 strip_band: window slightly off-centre, best of 3"). Do not invent results.
```

## Sonra (Claude)
- Gelen her tasarım için `python3 tools/kit_check.py collections/<NN>_* --paket 5` ve `--paket 2` (oran, gerçek alfa,
  kenar payı, yeşil pencere) + göz kontrolü; GPT dosyaları rastgele adla gelirse `tools/gpt_yerlestir.py --eslestir`
  haritasıyla doğru yollara konur.
- Önerilen görevler (açmak entegratörün işi): G239–G248 gpt-gorsel (bu talimatın tasarım başına görev kaydı), G439–G448
  claude-kod (`platform/themes/<id>/` teması: 03/38 yapısı, tasarıma özgü zarf açılışı ve hareket imzası, `build_images.py`,
  `parts.css`, `layouts.ts` baskı bloğu, `tools/katalog.py` `EK_TEMALAR` kaydı + `kontrol`), ardından ilan metni, PAKET 3/7
  ilan sahneleri (`tools/paket7_ilan.py`) ve QA. Tema ve göz kontrolünden önce satış durumu `coming`'dir.
