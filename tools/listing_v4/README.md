# listing_v4 — Etsy ilan seti, dikey 4:5 (2026-10-21)

Kullanıcı onaylı şablon (01 Olive & Ivory üzerinde oturtuldu, sonra 21 tasarıma uygulandı). Gerekçe ve rakip
incelemesi: `docs/20_ETSY_DUKKAN_KURULUMU.md` §7.10. Çıktılar: `collections/NN_*/package/listing/images_v4/` (19 JPG,
Etsy yükleme sırası) ve `video_v4_4x5.mp4` (hover videosu).

Betikler bir **çalışma klasöründen** çalışır (çıktıları kendi yanına yazar): bu klasörü geçici bir yere kopyala, içinde
`npm i playwright-core@1.56.1 playwright@1.56.1` kur, platformun production build'i hazır olsun (`cd platform && npm run build`).
Mutlak yollar (repo kökü `C:/Users/Foto/Documents/davetiye-maker`, ffmpeg için `imageio-ffmpeg`) yerel makineye göredir.

| Adım | Betik | Ne yapar |
|---|---|---|
| A | `shots.mjs <tema> <klasör>` | Canlı demodan (bkestudio.com/start/demo/…) kapalı zarf + açılış kareleri (390×844 @2x). Hangi karenin "açılıyor"/"açık" olduğu `picks.json`'da (göz seçimi). |
| B | `tools/listing_templates/capture.ts --theme … --out capNN --public-url https://bkestudio.com` | Yerel build'de misafir sayfaları + panel ekranları. |
| C | `serve.ts` + `devices.mjs` (`stageC1.sh NN`) | Tohumlanmış yerel site: tablet/laptop ekranları, basılı davetiye PDF'i → PNG (PyMuPDF). |
| D | `build_set.py NN` | Kapak (`cover_v4.html`) + 7 bilgi görseli (`slides.py`) + 11 yaşam tarzı görseli (`lifestyle.py`: PAKET 7 GPT sahneleri + gerçek ekranlar) → `setNN/`. `export.py NN` → `images_v4/`. |
| E | `stageE.sh NN …` | `rec.mjs` yavaş çekim (sayfa zamanı 50× yavaş, 432×540 @2.5 = 1080×1350) + `full45.py` → 60 fps dikey video. |

**39–48 (2026-10-22):** bu tasarımlarda `palette.json`/`bg_page.png` yok; renk, zemin dokusu (`assets/gpt/parts/…`) ve script
font `newpal.json`'dan. B+C tek komut: `stageBC.sh NN …`. PAKET 7 sahneleri (`assets/gpt/mockups/p7_*.png`) yoksa `build_set.py`
yaşam tarzı görsellerini atlar (kapak + 7 bilgi görseli); sahneler gelince aynı komut 19 görselin tamamını üretir.

Kurallar: telefon ekranları her zaman gerçek ekran görüntüsü; yazılar HTML'den (GPT görsele yazı koymaz); QR `segno` ile gerçek
demo adresinden; görsellerdeki maddeler ilan açıklamasındaki doğrulanmış özelliklerden. Renk paletleri platformda "coming"
olduğu sürece palet görseli sete girmez.
