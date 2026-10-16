---
id: G126
baslik: Story fon müziği (panelden değiştirilebilir, kendi dosyası) + açılış/sayfa/RSVP ses efektleri
rol: claude-kod
durum: inceleme
alan: claude-G126
oncelik: 1
bagimli: []
yazar: [platform/public/audio/, platform/lib/audio/, platform/lib/panel/music.ts, platform/app/api/edit/[slug]/music/, platform/components/panel/MusicFields.tsx, platform/components/panel/music-upload.ts, platform/components/panel/music.module.css, platform/lib/uploads.ts, platform/lib/data/, platform/lib/site/static.ts, platform/lib/theme/engine.ts, platform/lib/slug.ts, platform/lib/content/, platform/components/panel/sections.tsx, platform/components/panel/fields.tsx, platform/components/panel/usePanel.ts, platform/components/panel/Panel.tsx, platform/tests/, platform/README.md, docs/03_URUN_ICERIK_SEMASI.json, docs/11_TEMA_STANDARDI.md, tools/audio_synth.py, gorevler/G126-ses-muzik.md]
---

## Amaç
Kullanıcı: "Story bölümüne standart bir fon müziği; müşteri panelinde müziği değiştirme — yüklediği dosya sitede çalsın. Zarf
açılışı vb. yerlere ses efekti; hissiyat çok daha iyi olsun." Lisansı belirsiz ses yok (AGENTS.md şart 9), sayfa yükü bozulmaz,
tarayıcı otomatik oynatma kurallarına uyulur, temaların dolu `site.js` bütçesine dokunulmaz.

## Sonuç
**2026-10-16 · claude-G126 — durum: inceleme.** Dal `claude/g126-ses` (taban `claude/zealous-fermi-hy1o40`). main'e push, PR, yayın,
ortam değişkeni yok.

### Ses kaynağı — blokaj ve çözüm
- Freesound, Wikimedia Commons, Musopen, Kenney, OpenGameArt, archive.org, Pixabay bu ortamdan **erişilemedi** (ajan proxy'si
  CONNECT 403, ağ politikası). Hiçbir dış ses dosyası indirilmedi/eklenmedi.
- Bunun yerine bütün sesler **koddan sentezlendi**: `tools/audio_synth.py` (numpy/scipy + ffmpeg). Örnek (sample), kayıt ya da
  başkasının bestesi yok; tını toplamsal sentez, notalar sabit tohumlu kurallarla. BKE Studio'nun kendi eseri, atıfsız.
  Kayıt: `platform/public/audio/LICENSES.md` (her dosya: tür, süre, boyut, kaynak, lisans, tarih).
- **Kulakla dinlenmedi** (ortamda ses çıkışı yok). Yalnız nesnel kontroller yapıldı: seviye (tepe −3 dBFS, ortalama −16…−19 dB),
  spektrogram, dalga biçimi, süre/boyut. **Kullanıcının dinleyip onaylaması gerekiyor**; beğenilmezse ya parametreler değişir ya
  da kullanıcının erişebildiği CC0 kaynaktan dosya eklenir (LICENSES.md'deki kurala göre).

| Dosya | İçerik | Boyut |
|---|---|---|
| `music/first-light.mp3` | piyano, Re majör, 87 s döngü | 682 KB |
| `music/garden-waltz.mp3` | piyano vals, Fa majör, 63 s | 490 KB |
| `music/evening-strings.mp3` | yaylı pad + piyano, La minör, 86 s | 670 KB |
| `music/music-box.mp3` | müzik kutusu ninnisi, Sol majör, 72 s | 563 KB |
| `fx/` seal, ribbon, clasp, paper, slide, page, tear, whoosh, chime, tap | mühür, kurdele, klips/çıtçıt, kâğıt, kart kayışı, sayfa, yırtma, dalga, çan, tık | 2–11 KB |

### Ne yapıldı
- **İçerik şeması** (`docs/03`, `lib/content/schema.ts` senkron): `audio` = `{music: <parça>|custom|off, music_file, music_name,
  effects}`; yoksa tasarımın parçası + efektler açık.
- **Katalog** `lib/audio/catalog.ts`: 4 parça (panel adı + tek satır duygu), 20 tasarımın varsayılan parçası ve **açılış ses
  dizisi** — her ipucu temanın `site.js` `MOTION.envelope` adımının başlangıcında (mühür/kurdele/klips → kapak/kapılar → kartın
  kayışı → öne gelirken çan; kitapta iki sayfa çevirme, airmail'de yırtma, sleeve'de etiket + kayış, coastal'da dalga).
  Test bu zamanları `site.js` ile karşılaştırır.
- **Ortak betik** `public/audio/audio.js` (~11 KB, bağımlılıksız; tema `site.js`'lerine dokunulmadı): motor ses varsa
  `site-data.sound` + tek `<script src="/audio/audio.js" defer>` ekler (`lib/audio/site-sound.ts`). Efektler Web Audio ile,
  yalnız dokunuştan sonra; boşta önceden indirilir (açılış efektleri ~34 KB, yalnız index'te). Story'de müzik yüklenince
  denenir (`preload=none`, 400 ms sonra), engellenirse temanın yazı tipi ve renginde "♪ Play music" düğmesi; panel önizlemesinde
  (iframe) ve Data Saver'da kendiliğinden başlamaz. Yumuşak giriş (1,6 s) / çıkış; gizli sekmede durur; Story'ye dönünce kaldığı
  yerden. Her sayfada sol üstte 44 px ses düğmesi; tercih `sessionStorage` (`invite:sound:<slug>`). Azaltılmış harekette açılışta
  tek ses. Sayfa geçişinde hafif tık, RSVP başarıyla gönderilince çan (`form.js` `rsvp:state`).
- **Yükleme** `POST /api/edit/<slug>/music` (`lib/panel/music.ts`): MP3 / M4A / AAC, ≤ 10 MB, MIME listesi + dosya imzası
  (`assertAudioUpload`); Vercel 4,5 MB sınırı yüzünden ≤ 3,5 MB parçalar; fotoğraflarla aynı depolama (`saveAudio`, local + Blob,
  parçalar `putUploadPart`/`takeUploadParts`), aynı günlük limit/dosya sınırı, arşivde 403. `/media/` ses dosyalarına `Range` → 206
  (iOS Safari bunu ister). Çiftin dosyası yalnız seçiliyken ve Story açıkken herkese açık; taslakta önizleme anahtarıyla; şifreli
  sitede misafir çereziyle (fotoğrafla aynı kural). CSP değişmedi (`media-src 'self' blob: https:` zaten vardı).
- **Panel** Our Story sayfasının sonunda "Music & sound" (`MusicFields.tsx`): parça listesi (tasarıma önerilen işaretli), "Your own
  music" (yükleme + ilerleme %), "No music", "Listen/Stop" önizlemesi, "Sound effects" anahtarı. Taslak/yayın akışına normal
  autosave ile girer; teşekkür modu ve şifre modu aynı kuralları izler.
- `audio` ayrılmış slug'lara eklendi (public/audio). docs/11 §10–11 ve platform/README "Ses" bölümü güncellendi.

### Alıcıya görünen etiketler (eski → yeni) — START HERE için
| Yer | Eski | Yeni |
|---|---|---|
| Panel › Our Story (sonu) | — | "Music & sound" grubu; "Music plays softly on your Our Story page. Guests can pause it at any time; some phones wait for a tap before it starts." |
| | — | "Story music": First Light / Garden Waltz / Evening Strings / Music Box ("(suggested for this design)"), "Your own music" ("Upload an MP3 or M4A file, up to 10 MB."), "No music" |
| | — | "Choose a file" / "Replace file", "Uploading… N%", "Listen" / "Stop", "Only upload music you have the right to use (your own recording or a licence that allows it)." |
| | — | "Sound effects" — "Soft sounds when guests open the {envelope…}, move between pages and send their reply." |
| Misafir sitesi | — | sol üstte ses düğmesi (aria: "Turn sound off/on", Story'de "Turn music off"), Story'de "♪ Play music" |
Var olan hiçbir etiket değişmedi.

### Testler
- `npm ci`, `npm run typecheck` temiz.
- `tests/g126-audio.test.ts` 7/7: katalog + dosya boyutları + LICENSES.md, 20 temanın açılış zamanlaması, `content.audio`
  çözümü + şema, imza tespiti (ID3/MPEG/M4A/ADTS; PNG/JPEG/metin/yanlış MIME red), byte range, motor (site-data + tek betik, müzik
  yalnız story, sessiz sitede betik yok), yükleme (tek parça, iki parça 5 MB, eksik parça 409, 415/400/401) + medya servisi
  (seçilmeden 404, önizleme 200, yayında 200 + `Range` 206 + 416, story site-data'da dosya).
- Değişen davranışa göre güncellenen 3 test: `engine.test.ts` (site-data'da `sound`, izinli `/audio/audio.js`),
  `theme-vintage-airmail-love-letter.test.ts` (izinli betikler), `marketing-slug` (`audio` ayrılmış).
- Playwright 390 × 844 (geliştirme sunucusu, 02 olive-ivory): index'te düğme; zarfa dokununca 4 efekt sırayla çaldı
  (dokunuştan +122/+373/+1732/+3113 ms; beklenen 0/260/1620/3000 + ~110 ms tıklama gecikmesi); Story'de müzik başladı (headless
  Chromium izin verdi), düğmeyle durdu → "Play music"; panelde parça seçimi, "Listen", kendi MP3'ünü yükleme ve önizleme sayfasının
  yüklenen dosyayı çalması; 19 midnight-garden (koyu) ve 13 enchanted-forest düğme görünümü. Görüntüler depoya konmadı.
- Son toplu koşu (birleşik dalda, bu turun sonunda): `npm test` **1232/1232** (0 atlanan), `npm run build` temiz (trace-check dahil).
- **Yapılmadı:** gerçek iPhone/Android'de dinleme (iOS sessiz anahtarı Web Audio efektlerini susturur — beklenen davranış),
  Vercel Blob'da gerçek yükleme (yalnız birim testindeki sahte istemci yok; Blob yolu kodda, canlıda denenmedi), tam Playwright
  süitleri ve `theme-check --stress` (kullanıcı isteğiyle).

### Açık kalanlar
- Seslerin kulakla onayı (kullanıcı). İstenirse farklı tempo/tını/parça sayısı.
- START HERE rehberine "Music & sound" adımı (G122).
- Gerçek telefon testi (`docs/20_ELLE_TEST_PLANI.md`'ye "Story müziği + zarf sesi" satırı eklenebilir).
- Yarım kalan parça yüklemeleri Blob'da `parts/<site>/` altında kalır (site silinince gider); temizlik işi istenirse eklenir.
