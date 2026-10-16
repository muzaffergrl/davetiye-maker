# Platform sesleri — kaynak ve lisans kaydı (G126)

Bu klasördeki **bütün** ses dosyaları BKE Studio için `tools/audio_synth.py` ile **koddan sentezlendi** (2026-10-16).
Hiçbir dış kayıt, örnek (sample), ses kütüphanesi dosyası ya da başkasına ait beste kullanılmadı: notalar betikteki
kurallarla (sabit tohum) üretilir, tını toplamsal sentez + sentetik yankıdır. Eser BKE Studio'nundur; atıf gerekmez,
ticari kullanım serbesttir. Aynı betik aynı sesleri yeniden üretir (`python3 tools/audio_synth.py`).

Neden sentez: G126 görevinde önerilen CC0 / kamu malı kaynaklara (Freesound, Wikimedia Commons, Musopen, Kenney,
OpenGameArt, archive.org) bu çalışma ortamından ağ politikası nedeniyle ulaşılamadı (2026-10-16, HTTP CONNECT 403).
Dış kaynaklı ses eklenecekse yalnız CC0 / kamu malı (beste **ve** kayıt) olanlar, kaynak URL + lisans + indirme tarihiyle
bu tabloya yazılarak eklenir; CC-BY gibi atıf isteyen lisanslar kullanılmaz (AGENTS.md şart 9).

Kamu malı kullanım notu: `first-light` parçasının armoni dizisi (I–V–vi–iii–IV–I–IV–V) 17. yüzyıldan kalma, telifsiz,
çok yaygın bir akor dizisidir; ezgi ve düzenleme özgündür. Diğer parçaların akor dizileri ve ezgileri özgündür.

| Dosya | Tür | Süre | Boyut | Kaynak | Lisans | Üretim tarihi |
|---|---|---|---|---|---|---|
| `music/first-light.mp3` | Fon müziği — piyano, Re majör, 66 bpm, döngü | 87 s | ~682 KB | `tools/audio_synth.py` (özgün sentez) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-16 |
| `music/garden-waltz.mp3` | Fon müziği — piyano vals, Fa majör, 92 bpm, döngü | 63 s | ~490 KB | aynı | aynı | 2026-10-16 |
| `music/evening-strings.mp3` | Fon müziği — yaylı pad + piyano, La minör, 56 bpm, döngü | 86 s | ~670 KB | aynı | aynı | 2026-10-16 |
| `music/music-box.mp3` | Fon müziği — müzik kutusu ninnisi, Sol majör, 80 bpm, döngü | 72 s | ~563 KB | aynı | aynı | 2026-10-16 |
| `fx/seal.mp3` | Efekt — mühür çıtırtısı | 0,5 s | ~3 KB | aynı | aynı | 2026-10-16 |
| `fx/ribbon.mp3` | Efekt — kurdele / ip kayması | 1,0 s | ~6 KB | aynı | aynı | 2026-10-16 |
| `fx/clasp.mp3` | Efekt — pirinç klips / çıtçıt | 0,6 s | ~4 KB | aynı | aynı | 2026-10-16 |
| `fx/paper.mp3` | Efekt — kapak kalkarken kâğıt hışırtısı | 0,9 s | ~6 KB | aynı | aynı | 2026-10-16 |
| `fx/slide.mp3` | Efekt — kartın cepten kayışı | 1,3 s | ~8 KB | aynı | aynı | 2026-10-16 |
| `fx/page.mp3` | Efekt — sayfa / kapak çevirme | 0,8 s | ~5 KB | aynı | aynı | 2026-10-16 |
| `fx/tear.mp3` | Efekt — delikli şerit yırtılması | 1,0 s | ~6 KB | aynı | aynı | 2026-10-16 |
| `fx/whoosh.mp3` | Efekt — dalga süpürmesi | 1,7 s | ~10 KB | aynı | aynı | 2026-10-16 |
| `fx/chime.mp3` | Efekt — kart öne gelirken / RSVP gönderilince yumuşak çan | 1,8 s | ~11 KB | aynı | aynı | 2026-10-16 |
| `fx/tap.mp3` | Efekt — sayfa geçişinde hafif kâğıt tıkı | 0,3 s | ~2 KB | aynı | aynı | 2026-10-16 |

Biçim: MP3 mono 44,1 kHz; müzik 64 kb/s, efekt 48 kb/s. Müzik dosyaları döngüye uygundur (yankı kuyruğu başa katlanır).
Tema eşlemesi ve açılış zamanlamaları: `platform/lib/audio/catalog.ts`.
