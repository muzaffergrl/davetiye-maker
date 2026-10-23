# Platform sesleri — kaynak ve lisans kaydı (G126)

Bu klasördeki **bütün** ses dosyaları BKE Studio için **koddan sentezlendi**: fon müzikleri `tools/audio_synth.py` ile
(2026-10-16), ortak ses efektleri `tools/audio_fx.py` ile (G967, 2026-10-23; eski 10 efektin yerini aldı, adları korundu),
tasarıma özel paketler (kendi efektleri + kendi müziği, K59) `tools/audio_packs.py` ile (2026-10-23; aşağıda ayrı tablo).
Hiçbir dış kayıt, örnek (sample), ses kütüphanesi dosyası ya da başkasına ait beste kullanılmadı: notalar betikteki
kurallarla (sabit tohum) üretilir; müzikte tını toplamsal sentez + sentetik yankı, efektlerde nesnenin fiziğinden kurulan
sentez (sürtünme, kırılma, modal rezonans, yapış-kay, kabarcık …) + sentetik küçük oda yankısıdır. Eser BKE Studio'nundur;
atıf gerekmez, ticari kullanım serbesttir. Aynı betik aynı sesleri yeniden üretir (`python3 tools/audio_synth.py`).

Neden sentez: CC0 / kamu malı kaynaklara (Freesound, Wikimedia Commons, Musopen, Kenney, OpenGameArt, archive.org,
Pixabay) bu çalışma ortamından ağ politikası nedeniyle ulaşılamadı (2026-10-16: HTTP CONNECT 403; 2026-10-23 yeniden
denendi: kenney.nl, opengameart.org, freesound.org, upload.wikimedia.org, archive.org, pixabay.com bağlantı kurulamadı).
npm'de bulunan ses paketleri MIT lisanslı (atıf ister) ya da kaynağı belirsiz olduğu için kullanılmadı.
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
| `fx/paper.mp3` | Efekt — zarf kapağı kalkar — orta gramaj kâğıt | 1,0 s | ~14 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/paper-soft.mp3` | Efekt — zarf kapağı — kalın pamuklu / el yapımı kâğıt (yumuşak, alçak) | 1,1 s | ~15 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/paper-crisp.mp3` | Efekt — zarf kapağı — sert karton / kraft (parlak çıtırtı) | 0,9 s | ~13 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/fold.mp3` | Efekt — washi / ince kâğıt kanadı açılır | 0,7 s | ~11 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/fold-2.mp3` | Efekt — aynı kanadın biraz daha alçak çeşidi (arka arkaya kanatlar için) | 0,8 s | ~11 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/slide.mp3` | Efekt — kart cebinden kayarak çıkar (≈ 1,3 s) | 1,4 s | ~20 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/slide-quick.mp3` | Efekt — kart / bilet hızlı kayar (≈ 0,8 s) | 0,9 s | ~14 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/page.mp3` | Efekt — sayfa çevrilir (sağdan sola, yere iner) | 1,0 s | ~15 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/book.mp3` | Efekt — masal kitabının kapağı açılır (sırt gıcırtısı, tok iniş) | 1,3 s | ~19 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/tear.mp3` | Efekt — delikli şerit yırtılır (soldan sağa) | 1,0 s | ~15 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/vellum.mp3` | Efekt — buzlu aydınger kılıf kayar | 1,4 s | ~20 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/peel.mp3` | Efekt — etiket soyulur | 1,0 s | ~15 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/flutter.mp3` | Efekt — kesme kâğıt bayraklar sırayla havalanır | 1,1 s | ~17 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/tap.mp3` | Efekt — sayfa geçişinde yumuşak kâğıt tıkı | 0,3 s | ~5 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/ribbon.mp3` | Efekt — ipek kurdele kayıp çıkar, ucu savrulur | 1,1 s | ~15 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/bow.mp3` | Efekt — ipek fiyonk ilmek ilmek çözülür | 1,6 s | ~23 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/twine.mp3` | Efekt — jüt sicim çözülür (lif takılmaları) | 1,0 s | ~15 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/cord.mp3` | Efekt — ipek kordon düğmeden kayar, düşer | 1,3 s | ~18 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/velvet.mp3` | Efekt — kadife / yün / keten — boğuk fırçalama | 1,2 s | ~17 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/lace.mp3` | Efekt — dantel duvak gibi kalkar | 1,4 s | ~20 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/curtain.mp3` | Efekt — ağır kadife sahne perdesi açılır | 1,7 s | ~24 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/strap.mp3` | Efekt — deri kayış tokadan çekilir (deri gıcırtısı) | 1,6 s | ~23 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/seal.mp3` | Efekt — mum mühür kırılır (çatlak, kırıntı, gövde) | 0,5 s | ~7 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/seal-lift.mp3` | Efekt — mum mühür bütün olarak kalkar | 0,5 s | ~8 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/clasp.mp3` | Efekt — pirinç klips açılır | 0,5 s | ~7 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/buckle.mp3` | Efekt — kemer tokası açılır | 0,7 s | ~11 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/key.mp3` | Efekt — müzik kutusu anahtarı iki tur kurulur | 1,9 s | ~27 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/lock.mp3` | Efekt — döner kilit / konço döner, yerine oturur | 0,6 s | ~9 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/brooch.mp3` | Efekt — broş / inci klips iğnesinden çıkar | 1,0 s | ~15 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/porcelain.mp3` | Efekt — porselen düğme döner, kalkar (ince çınlama) | 1,4 s | ~19 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/tile.mp3` | Efekt — sırlı çini döner, yerine vurur | 0,9 s | ~14 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/lid.mp3` | Efekt — lake kutu kapağı menteşesinde açılır | 1,8 s | ~26 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/twig.mp3` | Efekt — kuru dal / çam demeti gevşer, hışırdar | 0,9 s | ~14 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/chime.mp3` | Efekt — kart öne gelir: çelesta arpeji (La majör) | 3,0 s | ~42 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/chime-warm.mp3` | Efekt — kart öne gelir: daha sıcak, alçak çan arpeji (Mi majör) | 3,5 s | ~49 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/harp.mp3` | Efekt — kart öne gelir: kısa arp glissandosu | 3,2 s | ~44 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/sparkle.mp3` | Efekt — pırıltı: elmas / hilal / inci ışığı yakalar | 1,0 s | ~14 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/shimmer.mp3` | Efekt — işık süpürmesi (soldan sağa camsı parıltı) | 1,6 s | ~23 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/stars.mp3` | Efekt — yıldızlar / ateşböcekleri / ışıklar tek tek yanar | 2,1 s | ~30 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/comb.mp3` | Efekt — müzik kutusu tarağı: kısa ezgi | 3,4 s | ~47 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/whoosh.mp3` | Efekt — yumuşak hava geçişi (soldan sağa) | 1,2 s | ~18 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/wave.mp3` | Efekt — suluboya dalga ekranı geçer, köpük | 1,9 s | ~27 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/water.mp3` | Efekt — su: hafif çalkantı, kabarcıklar | 1,1 s | ~16 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/wings.mp3` | Efekt — üç güvercin havalanır | 1,6 s | ~23 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/petals.mp3` | Efekt — çiçek kümesi patlar / yapraklar dökülür | 1,3 s | ~18 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/flash.mp3` | Efekt — eski flaş: deklanşör, ampul patlaması, şarj ıslığı | 0,9 s | ~13 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/lantern.mp3` | Efekt — fener / kandil yanar, alev titrer | 1,7 s | ~25 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/film.mp3` | Efekt — negatif şeridi ekrandan akar (dişli tıkları) | 1,7 s | ~24 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/brush.mp3` | Efekt — dört geniş fırça darbesi (ıslak suluboya) | 1,4 s | ~20 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/pen.mp3` | Efekt — baş harfler mürekkeple yazılır (uç cızırtısı) | 0,7 s | ~11 KB | `tools/audio_fx.py` (fiziğe dayalı foley sentezi) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |

Biçim (ortak dosyalar): müzik MP3 mono 44,1 kHz 64 kb/s (döngüye uygun, yankı kuyruğu başa katlanır); efektler MP3 stereo
44,1 kHz 112 kb/s, −20…−24 LUFS bütünleşik, gerçek tepe ≤ −1,5 dBTP (kodlama sonrası ≤ −1,9 dBTP ölçüldü), tıksız giriş/çıkış.
Efekt listesi, tema eşlemesi ve yeniden üretim: `docs/40_SES_EFEKTLERI.md`; açılış zamanlamaları: `platform/lib/audio/catalog.ts`.

## Tasarıma özel paketler (K59, 2026-10-23)

Kaynak: `tools/audio_packs.py` (özgün sentez; notalar betikte elle yazıldı, stereo salon yankısı sentetik). Dış kayıt, örnek
ya da başkasına ait beste yok. Eser BKE Studio'nundur; atıf gerekmez, ticari kullanım serbesttir. Aynı betik aynı sesleri
yeniden üretir (`python3 tools/audio_packs.py --pack <tasarım>`; numpy + scipy + ffmpeg).

Biçim: efektler MP3 stereo 44,1 kHz 96 kb/s, müzik MP3 stereo 44,1 kHz 112 kb/s. Ses yüksekliği ortak kütüphaneyle aynı
ölçekte (`tools/audio_fx.py` BS.1770 ölçeri): efektler −20…−24 LUFS, gerçek tepe ≤ −1,5 dBTP (`crack` keskin bir tık
olduğundan tepe tavanında kalır, ≈ −27 LUFS); müzik −17,5 LUFS hedef (ortak parçalar −17…−19 LUFS). Paketin efektleri o
tasarımda ortak efektlerin yerini alır (`tap` ve `chime` dahil); oynatıcı ve kazançlar ortaktır (`public/audio/audio.js`).

| Dosya | Tür | Süre | Boyut | Kaynak | Lisans | Üretim tarihi |
|---|---|---|---|---|---|---|
| `music/rose-nocturne.mp3` | Fon müziği — Crimson Rose Atelier: piyano, arp, yaylılar; Re minör vals, 76 bpm, döngü (elle bestelendi) | 95 s | ~1296 KB | `tools/audio_packs.py` (özgün sentez) | BKE Studio'nun kendi eseri, atıfsız | 2026-10-23 |
| `fx/crimson-rose-atelier/crack.mp3` | Efekt — altın mum mühür bastırılıp ikiye kırılır, parçalar kâğıda düşer | 1,0 s | ~12 KB | aynı | aynı | 2026-10-23 |
| `fx/crimson-rose-atelier/flap.mp3` | Efekt — ağır bordo kapak yapışkanından ayrılıp menteşede kalkar | 1,3 s | ~16 KB | aynı | aynı | 2026-10-23 |
| `fx/crimson-rose-atelier/draw.mp3` | Efekt — deckle kenarlı kart cepten çekilir (kâğıt üstünde kâğıt) | 1,5 s | ~18 KB | aynı | aynı | 2026-10-23 |
| `fx/crimson-rose-atelier/reveal.mp3` | Efekt — kart mum ışığına yükselir: arp süpürmesi + yaylı kabarması | 3,2 s | ~38 KB | aynı | aynı | 2026-10-23 |
| `fx/crimson-rose-atelier/bloom.mp3` | Efekt — kart misafire doğru gelir: sıcak piyano akoru + hava | 2,2 s | ~27 KB | aynı | aynı | 2026-10-23 |
| `fx/crimson-rose-atelier/page.mp3` | Efekt — kalın albüm sayfası sağdan sola çevrilir | 1,1 s | ~13 KB | aynı | aynı | 2026-10-23 |
| `fx/crimson-rose-atelier/fold.mp3` | Efekt — yanıt kartı katlanıp zarfa kayar | 1,1 s | ~14 KB | aynı | aynı | 2026-10-23 |
| `fx/crimson-rose-atelier/stamp.mp3` | Efekt — mühür zarfa bastırılır | 0,8 s | ~10 KB | aynı | aynı | 2026-10-23 |
| `fx/crimson-rose-atelier/petal.mp3` | Efekt — home'a varışta yapraklar süzülür (çok yumuşak hava + arp flajoleleri) | 2,4 s | ~29 KB | aynı | aynı | 2026-10-23 |
| `fx/crimson-rose-atelier/tap.mp3` | Efekt — sayfalar arası yumuşak tık | 0,3 s | ~4 KB | aynı | aynı | 2026-10-23 |
| `fx/crimson-rose-atelier/chime.mp3` | Efekt — yanıt gönderildi: iki arp notası + celesta | 2,4 s | ~29 KB | aynı | aynı | 2026-10-23 |
