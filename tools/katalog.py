"""Aşama 1 tasarım kataloğu — 20 birbirinden farklı tasarımın tek kaynağı.

  python3 tools/katalog.py yaz [--zorla] [--dene]   # katalog belgesi + yeni koleksiyon iskeletleri + görevler
  python3 tools/katalog.py kontrol  # ayırt edicilik (her çift ≥4 eksende farklı) + WEB (website) kayıtları tam mı
                                    # + STORY: content.demo.json `story` blokları katalogla aynı mı
  python3 tools/katalog.py paket5 [--no 04[,05]] [--paket3] [--dene]   # GPT_PROMPTS.md: başlık + PAKET 5 + PAKET 2
  python3 tools/katalog.py gorev5 [--no 04[,05]] [--dene]   # G2NN (GPT website paketi) + G4NN (platform teması) görevleri
  python3 tools/katalog.py ozet [--no 04[,05]] [--dene]     # DESIGN_BRIEF.md + content.demo.json (katalog değişince)
  python3 tools/katalog.py belge    # yalnız docs/09_TASARIM_KATALOGU.md

`yaz` üretilenleri (var olan dosyaların üzerine yazmaz; --zorla ile yazar; --dene: yazmaz, içeriği değişecek dosyaları
listeler, varsa çıkış 1):
  docs/09_TASARIM_KATALOGU.md
  collections/NN_<Ad>/DESIGN_BRIEF.md, palette.json, content.demo.json,
                      COLLECTION_STATUS.md (yalnız yeni koleksiyonda), assets/gpt/GPT_PROMPTS.md
  gorevler/G1NN (kaynak), G2NN (görsel), G3NN (Canva) — 01 ve 03–20 için
Tasarım 02 (Dusty Blue) mevcut görevleriyle yürür; `yaz` onu atlar, `paket5`/`gorev5` onu da üretir (G202, G402).

`paket5` (K22–K24, görev G033): tasarımın `assets/gpt/GPT_PROMPTS.md` dosyasını başlık + "PAKET 5 — Website
tasarımı (GPT tasarlar)" (W1 telefon ekranı comp'ları + W2 website parçaları) + "PAKET 2 — Örnek fotoğraflar" olarak
yeniden yazar; eski PAKET 1 ve PAKET 2 düşer, var olan PAKET 3 (mockup) bölümü aynen korunur. Sanat yönetimi `WEB`
sözlüğünde, demo metin koleksiyonun `content.demo.json`'ında. Tasarım 03'e (elle yazıldı: G030/G035/G036) asla
dokunmaz; content.demo.json, DESIGN_BRIEF.md, palette.json yalnız okunur. İki kez çalıştırmak aynı dosyayı verir.
`--dene`: yazmaz, değişecek dosya varsa çıkış 1. `--paket3`: PAKET 3 korunmaz, `MOCK`'tan yeniden üretilir
(mockups/ klasöründe üretilmiş görsel varsa o tasarımda yine korunur).
`ozet`: katalog (`D`, `STORY`) değişince DESIGN_BRIEF.md (01, 04–20) ve content.demo.json'ı (katalogdan açılmış 04–20,
`story` dahil; elle alan eklenmişse dokunmaz) yeniden yazar. 01 ve 02'nin content.demo.json'ı elle yazıldı: yalnız `story`
eşitlenir (aynıysa dosyaya dokunulmaz). 02'nin brief'i ve 03 elle yazıldı, atlanır.
`STORY` (G057): demo kaydının Our Story bloğunun (intro + 3 başlık) tek kaynağı; `content()` onu kayda yazar, böylece
`ozet` ve `yaz --zorla` story'yi korur. Story değişikliği STORY'de yapılır, content.demo.json'da değil.
`gorev5`: G2NN/G4NN görev dosyalarını yeniden yazar (durum hazir; Günlük satırları korunur, bir kez
"yeniden tanımlandı" satırı eklenir). Alınmış/incelemede/bitmiş görevi atlar. 03 (G203/G403) hariç.
"""
import json
import re
import sys
from datetime import date, timedelta
from itertools import combinations
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Ayırt edicilik eksenleri: her tasarım bunların her birinde bir değer taşır.
EKSENLER = ["zarf", "foto", "dekor", "teknik", "font", "palet"]

D = [
    dict(no=1, klasor="01_Olive_Ivory", ad="Olive & Ivory", mevcut=True,
         ruh="Akdeniz bahçesi sadeliğinde, zeytin dallı klasik fildişi davet.",
         zarf="Zeytin yeşili dokulu kağıt zarf, fildişi dantel kenarlı V kapak, botanik oval mühür; kapak mühürle birlikte kalkar, kart yükselir.",
         foto="Yuvarlak köşeli ince altın çerçeveli kartlar, yelpaze gibi açılır.",
         dekor="Zeytin dalları ve küçük zeytinler", teknik="suluboya",
         font=("Great Vibes", "EB Garamond"), palet_adi="olive-ivory",
         renk=dict(ink="#2F3A2B", deep="#5E6B45", primary="#7D8B5A", mist_top="#F1EFE6", mist_bottom="#DCD9C6",
                   gold="#B39A63", gold_light="#D7C79F", ivory="#FBF8F0", leaf="#7D8B5A"),
         cift=None,
         p=dict(bg="soft warm ivory-to-pale-olive gradient (#F1EFE6 to #DCD9C6) with faint linen grain and a few very soft out-of-focus sunlight flecks",
                paper="premium warm ivory cotton paper (#FBF8F0) with subtle natural fibers",
                liner="pale olive green (#A8B28A) background with a fine ivory hand-drawn olive branch repeat",
                closure="A realistic olive-green wax seal (#7D8B5A with deeper #5E6B45 shadows), irregular poured edge, smooth empty pressed center with a thin raised ring and a tiny embossed olive-leaf wreath.",
                decor_main="slender olive branches with silvery-green leaves and a few small dark olives, a little white jasmine",
                decor_small="a single slender olive sprig with five leaves and two small olives",
                frame="a portrait card frame with softly rounded corners and a fine antique-gold double border",
                extras=[])),
    dict(no=2, klasor="02_Dusty_Blue", ad="Dusty Blue & Champagne", mevcut=True,
         ruh="Pudra mavisi okaliptüs ve şampanya altını; mum mühürlü aşk mektubu.",
         zarf="Fildişi V kapaklı zarf, pudra mavisi mum mühür; desenli astar görünür, kart cebin arkasından yükselir.",
         foto="Üç anlık baskı (instant print) sırayla uçarak yerleşir.",
         dekor="Okaliptüs, beyaz çiçek, altın eğrelti", teknik="suluboya-guaj",
         font=("Pinyon Script", "Cormorant Garamond"), palet_adi="dusty-blue",
         renk=None, cift=None, p=None),
    dict(no=3, klasor="03_Blush_Garden_Rose", ad="Blush Garden Rose",
         ruh="Bol şakayık ve bahçe gülleriyle romantik, yumuşak pembe bir bahçe daveti.",
         zarf="Tırtıklı (deckle) kenarlı kare pembe zarf; ipek kurdele kayarak çözülür, kapak açılır.",
         foto="Kemerli (arch) altın çerçeveler, aşağıdan yükselir.",
         dekor="Şakayık, bahçe gülü, tomurcuk", teknik="yağlı boya",
         font=("Great Vibes", "Lora"), palet_adi="blush-rose",
         renk=dict(ink="#3F2A2E", deep="#9B5D66", primary="#E3A9AE", mist_top="#FBEDEC", mist_bottom="#EFCFD0",
                   gold="#C8A46E", gold_light="#E5CFA4", ivory="#FFF9F6", leaf="#9DAE93"),
         cift=("Clara", "Clara Rose", "Julian", "Julian Thomas"), mekan=("The Rosewater Conservatory", "Savannah", "Georgia", "America/New_York"), tarih="2027-05-15",
         yerler=("The Rose Garden", "The Glass Terrace", "The Conservatory Hall"), kiyafet="Garden formal",
         p=dict(bg="soft blush pink gradient (#FBEDEC to #EFCFD0) with delicate out-of-focus rose-petal bokeh and faint paper grain",
                paper="soft blush-white handmade cotton paper (#FFF9F6) with visible deckled fibers",
                liner="blush pink (#E3A9AE) background with a soft painterly repeat of small garden roses in cream and dusty rose",
                closure="A wide blush-pink silk ribbon tied in an elegant loose bow with long tails, soft sheen.",
                decor_main="lush blush peonies, cream garden roses, rose buds and soft sage leaves, painted in a romantic oil-painting style with soft brush texture",
                decor_small="a short horizontal garland of two small blush roses, buds and sage leaves in the same oil-painting style",
                frame="a tall arched portrait frame (rounded top) in fine polished antique gold with a thin inner bead line",
                extras=[])),
    dict(no=4, klasor="04_Vintage_Airmail", ad="Vintage Airmail Love Letter",
         ruh="Uzak diyarlardan gelen eski bir aşk mektubu: hava postası, pullar, damgalar.",
         zarf="Kenarları kırmızı-lacivert çizgili hava postası zarfı; şerit yırtılarak açılır, mektup kayar.",
         foto="Tırtıklı kenarlı pul ve kartpostal kartları, masaya tek tek düşer.",
         dekor="Pullar, boş posta damgası halkaları, kuru çiçek", teknik="vintage baskı",
         font=("Homemade Apple", "Special Elite"), palet_adi="airmail",
         renk=dict(ink="#2A2A35", deep="#3D4F7A", primary="#B5483E", mist_top="#F2EADB", mist_bottom="#DCCDB2",
                   gold="#A88A5A", gold_light="#D2BE95", ivory="#FAF4E8", leaf="#8A9474"),
         cift=("Margot", "Margot Elise", "Henry", "Henry Arthur"), mekan=("The Old Post House", "Hudson", "New York", "America/New_York"), tarih="2027-10-02",
         yerler=("The Orchard Lawn", "The Library Bar", "The Post Hall"), kiyafet="Cocktail attire",
         p=dict(bg="aged warm parchment gradient (#F2EADB to #DCCDB2) with subtle paper stains, faint vintage map contour lines without any labels",
                paper="aged cream laid writing paper (#FAF4E8) with faint horizontal laid lines",
                liner="fine navy (#3D4F7A) and faded red (#B5483E) diagonal airmail stripe pattern on cream, like a vintage airmail envelope border, no text",
                closure="A small realistic burgundy-red wax seal with a smooth empty center, slightly cracked vintage look.",
                decor_main="dried pressed wildflowers, a sprig of dried lavender and a few loose fictional botanical postage stamps with perforated edges (each stamp shows only a small flower illustration, no numbers, no country names, no text)",
                decor_small="a short twine string with a small dried flower tied on it",
                frame="a large vintage postage-stamp shaped frame with perforated scalloped edges in cream paper",
                extras=[("decor/postmark_rings.png", "1024×1024", True, "Three faint inky circular vintage postmark rings and a few wavy cancellation lines, slightly uneven stamped look, dark grey ink, containing absolutely no letters, numbers or symbols. Transparent background PNG.")])),
    dict(no=5, klasor="05_Lemon_Mediterranean", ad="Mediterranean Lemon",
         ruh="Güneşli bir sahil kasabası: limon dalları, mavi-beyaz el boyaması çini.",
         zarf="Çini desenli astarlı beyaz zarf; kapak açılırken limon dalı içeri doğru sallanır.",
         foto="Fiyonk dilimli (scalloped) kenarlı çerçeveler, çini panolar gibi döner.",
         dekor="Limon dalı, limon çiçeği, çini bordür", teknik="suluboya",
         font=("Allura", "Playfair Display"), palet_adi="lemon-azure",
         renk=dict(ink="#1F3557", deep="#2A5DA8", primary="#F2C94C", mist_top="#F7F4EC", mist_bottom="#DCE6F2",
                   gold="#C9A04A", gold_light="#E8D18F", ivory="#FFFDF7", leaf="#5E8C4A"),
         cift=("Isabella", "Isabella Marie", "Marco", "Marco Antonio"), mekan=("Villa Limonaia", "Sorrento", "Campania", "Europe/Rome"), tarih="2027-06-12", ulke="Italy",
         yerler=("The Lemon Grove", "The Sea Terrace", "The Villa Courtyard"), kiyafet="Summer formal",
         p=dict(bg="sunlit warm white plaster wall texture fading to a soft sky blue at the bottom (#F7F4EC to #DCE6F2), gentle dappled leaf shadows at the edges, empty center",
                paper="smooth bright white watercolor paper (#FFFDF7) with fine grain",
                liner="original hand-painted blue and white majolica-style tile pattern (cobalt #2A5DA8 on white) with small lemon and leaf motifs, seamless square tiles",
                closure="A small bunch of two glossy ripe lemons with three leaves tied with a thin cobalt blue ribbon.",
                decor_main="lemon branches with ripe yellow lemons, white lemon blossoms and glossy green leaves, fresh watercolor",
                decor_small="a single short lemon sprig with one small lemon and two blossoms",
                frame="a scalloped-edge rectangular frame made of a single row of small hand-painted blue and white tiles",
                extras=[])),
    dict(no=6, klasor="06_Art_Deco_Noir", ad="Art Deco Black-Tie",
         ruh="1920'ler balo salonu: lacivert-siyah, altın geometrik çizgiler, şampanya kadehi.",
         zarf="Ortadan iki kanatlı açılan (gatefold) lacivert kapı; altın deco madalyon çözülür, kapılar yana açılır.",
         foto="Basamaklı deco kemer çerçeveler, ışık süpürmesiyle belirir.",
         dekor="Geometrik altın çizgi, palmiye yelpazesi (fan), inci", teknik="altın çizgi illüstrasyon",
         font=("Italiana", "Josefin Sans"), palet_adi="navy-deco-gold",
         renk=dict(ink="#F5EEDC", deep="#C9A55C", primary="#14213D", mist_top="#1B2A4A", mist_bottom="#0E1626",
                   gold="#C9A55C", gold_light="#E6CF8F", ivory="#F5EEDC", leaf="#C9A55C"),
         cift=("Vivian", "Vivian Grace", "Charles", "Charles Edward"), mekan=("The Grand Lumière Hotel", "Chicago", "Illinois", "America/Chicago"), tarih="2027-12-18",
         yerler=("The Mirror Ballroom", "The Gold Bar", "The Grand Salon"), kiyafet="Black tie",
         p=dict(bg="deep midnight navy (#1B2A4A to #0E1626) with a very subtle art deco sunburst of thin gold lines radiating from the top center, fine velvet grain, empty center",
                paper="smooth deep navy card stock (#14213D) with a faint fine linen texture",
                liner="original art deco fan and arch geometric pattern in thin metallic gold lines on deep navy, seamless",
                closure="An ornate round art deco medallion clasp in polished gold with stepped geometric rays and a small pearl in the middle, no letters.",
                decor_main="art deco geometric corner ornament of fine metallic gold lines, stepped fans and a few small pearls (no flowers)",
                decor_small="a horizontal art deco divider of fine gold lines with a small central diamond and pearl",
                frame="a stepped art deco arch frame in fine metallic gold lines with small corner fans",
                extras=[])),
    dict(no=7, klasor="07_Burgundy_Velvet", ad="Burgundy Velvet Autumn",
         ruh="Sonbahar akşamı: bordo dalya, kadife kurdele, mum ışığı sıcaklığı.",
         zarf="Bordo kadife kurdeleyle bağlı krem zarf; kurdele çözülüp kayar, kapak açılır.",
         foto="Varak altın oval çerçeveler tek bir kadife kurdele girlandına bağlı, sallanır.",
         dekor="Dalya, bordo gül, sonbahar yaprakları, böğürtlen", teknik="yağlı boya",
         font=("Pinyon Script", "Cinzel"), palet_adi="burgundy-velvet",
         renk=dict(ink="#3B1A20", deep="#6E1F2E", primary="#8C2A3C", mist_top="#F4E7E1", mist_bottom="#D9B9AE",
                   gold="#B88A4A", gold_light="#DDBE8A", ivory="#FBF5EE", leaf="#7A6A3A"),
         cift=("Rosalind", "Rosalind Mae", "Edward", "Edward James"), mekan=("Hawthorne Hall", "Asheville", "North Carolina", "America/New_York"), tarih="2027-10-23",
         yerler=("The Chapel Lawn", "The Hearth Room", "The Great Hall"), kiyafet="Formal attire",
         p=dict(bg="warm candlelit cream-to-rose-taupe gradient (#F4E7E1 to #D9B9AE) with soft golden bokeh and faint canvas texture",
                paper="heavy cream cotton paper (#FBF5EE) with a soft felt texture",
                liner="rich burgundy (#6E1F2E) damask pattern with small autumn leaves and berries in muted gold",
                closure="A long burgundy velvet ribbon tied in a soft bow with a small antique gold leaf charm, plush velvet texture.",
                decor_main="burgundy dahlias, deep red garden roses, blackberries, copper autumn leaves and dark green foliage in a rich oil-painting style",
                decor_small="a horizontal sprig of two small burgundy buds, a few berries and copper leaves in the same oil style",
                frame="an oval frame in antique gold leaf with a delicate carved bead border",
                extras=[])),
    dict(no=8, klasor="08_Winter_Evergreen", ad="Winter Evergreen",
         ruh="Karlı bir dağ köşkü: çam dalları, kırmızı yaban mersini, kar taneleri.",
         zarf="Orman yeşili zarf, çam dalı ve kırmızı kurdeleyle mühürlü; kar yağarken açılır.",
         foto="Buğulu pencere camı çerçeveleri, buğu silinerek görünür.",
         dekor="Çam, ardıç, kırmızı meyve, kozalak", teknik="suluboya",
         font=("Parisienne", "Libre Baskerville"), palet_adi="evergreen",
         renk=dict(ink="#1F2E26", deep="#2F5240", primary="#3E6B53", mist_top="#EEF2F1", mist_bottom="#C9D6D2",
                   gold="#B79B5E", gold_light="#DCC895", ivory="#FAFAF6", leaf="#3E6B53"),
         cift=("Noelle", "Noelle Claire", "James", "James Robert"), mekan=("Pinecrest Lodge", "Aspen", "Colorado", "America/Denver"), tarih="2027-12-11",
         yerler=("The Snow Chapel", "The Fireside Lounge", "The Timber Hall"), kiyafet="Winter formal",
         p=dict(bg="soft wintry pale grey-green gradient (#EEF2F1 to #C9D6D2) with gentle falling snow bokeh and faint frost at the edges, empty center",
                paper="bright snowy white cotton paper (#FAFAF6) with subtle fibers",
                liner="deep forest green (#2F5240) background with a fine repeat of small white snowflakes and tiny pine sprigs",
                closure="A small bundle of fresh pine sprig, a cedar twig and three red berries tied with a thin red velvet ribbon.",
                decor_main="evergreen pine and fir branches, juniper with blue berries, red winter berries and a small pine cone, light snow dusting, watercolor",
                decor_small="a single short pine sprig with two red berries and a little snow",
                frame="a frosted window-pane frame of white-painted wood with a thin frosty edge, empty clear center",
                extras=[])),
    dict(no=9, klasor="09_Lavender_Provence", ad="Lavender Provence",
         ruh="Provence lavanta tarlası: keten kese, lavanta demeti, yaz akşamı ışığı.",
         zarf="Ketenden bir kese; sicim çözülür, kese ağzı açılır, kart dışarı kayar.",
         foto="Kurutulmuş çiçek basılmış (pressed flower) kartlar, rüzgârla savrulur gibi gelir.",
         dekor="Lavanta, beyaz papatya, buğday başağı", teknik="kurutulmuş çiçek fotoğrafı",
         font=("Alex Brush", "Cormorant Garamond"), palet_adi="lavender-linen",
         renk=dict(ink="#2E2A3F", deep="#5D5287", primary="#9C8FC4", mist_top="#F3F0F7", mist_bottom="#D9D2E8",
                   gold="#B5A27A", gold_light="#D8CBA8", ivory="#FAF8F3", leaf="#8A9A78"),
         cift=("Amélie", "Amélie Claire", "Louis", "Louis Henri"), mekan=("Les Jardins de Lavande", "Gordes", "Provence", "Europe/Paris"), tarih="2027-07-03", ulke="France",
         yerler=("The Lavender Field", "The Stone Terrace", "The Old Barn"), kiyafet="Summer chic",
         p=dict(bg="soft hazy lavender-to-cream gradient (#F3F0F7 to #D9D2E8) with a very blurred distant lavender field at the bottom edge, empty center",
                paper="natural undyed linen fabric texture in warm cream (#FAF8F3), fine weave",
                liner="soft lavender (#9C8FC4) linen with a delicate block-printed sprig pattern in cream",
                closure="A small bundle of dried lavender stems tied with natural jute twine in a simple bow.",
                decor_main="real pressed and dried lavender stems, small white daisies and wheat ears arranged on the corner, photographed flat-lay, natural shadows",
                decor_small="a single pressed lavender stem with one small white daisy lying horizontally, flat-lay photo",
                frame="a cream deckled-edge card with a thin border of tiny pressed lavender florets around the empty center",
                extras=[])),
    dict(no=10, klasor="10_Tuscan_Vineyard", ad="Tuscan Vineyard",
         ruh="Bağ bozumu düğünü: üzüm salkımı, zeytin yaprağı, kraft kağıt ve sicim.",
         zarf="Kraft zarf, sicim ve kurutulmuş zeytin yaprağıyla bağlı; sicim çözülür, kapak açılır.",
         foto="Eski şarap etiketi biçimli (adsız) kartlar, ahşap masaya dizilir.",
         dekor="Üzüm salkımı, asma yaprağı, zeytin", teknik="gravür + suluboya",
         font=("Italianno", "Marcellus"), palet_adi="vineyard",
         renk=dict(ink="#2F2420", deep="#5B2C3A", primary="#7A3E4E", mist_top="#F4ECE2", mist_bottom="#DCC7AE",
                   gold="#A9874F", gold_light="#D2B98A", ivory="#FBF6EC", leaf="#6F7A4C"),
         cift=("Giulia", "Giulia Rosa", "Matteo", "Matteo Luca"), mekan=("Tenuta del Sole", "Montepulciano", "Tuscany", "Europe/Rome"), tarih="2027-09-25", ulke="Italy",
         yerler=("The Vineyard Terrace", "The Cellar", "The Cypress Courtyard"), kiyafet="Garden formal",
         p=dict(bg="warm Tuscan sunset gradient of cream to soft sand (#F4ECE2 to #DCC7AE) with faint hazy rolling hills silhouette at the bottom, empty center",
                paper="natural kraft brown paper with visible fibers, evenly lit",
                liner="deep wine (#5B2C3A) background with a fine vintage engraving-style repeat of small grape clusters and vine leaves in cream",
                closure="Natural jute twine wrapped twice and tied in a bow with two dried olive leaves tucked under the knot.",
                decor_main="grape clusters in deep purple and green, vine leaves, tendrils and olive branches, vintage botanical engraving with soft watercolor wash",
                decor_small="a short horizontal vine sprig with one small grape cluster and a tendril",
                frame="an elegant blank vintage wine-label shaped frame (rectangle with cut corners) with a fine engraved double border, empty inside",
                extras=[])),
    dict(no=11, klasor="11_Boho_Pampas", ad="Boho Pampas Terracotta",
         ruh="Çöl esintili bohem: pampas otu, kuru palmiye, terrakota kemerler.",
         zarf="Kemer biçimli terrakota cep; kart kemerden yukarı kayar.",
         foto="Terrakota ve kum renkli üst üste kemer şekilleri içinde, gökkuşağı gibi açılır.",
         dekor="Pampas otu, kuru palmiye yaprağı, kurutulmuş gül", teknik="dijital guaj (düz renk)",
         font=("Sacramento", "Josefin Slab"), palet_adi="terracotta-boho",
         renk=dict(ink="#3A2A22", deep="#9A4F33", primary="#C9785B", mist_top="#F6EDE3", mist_bottom="#E5CDB5",
                   gold="#C29A5B", gold_light="#E2C79A", ivory="#FBF5EC", leaf="#9C8A5E"),
         cift=("Luna", "Luna Grace", "River", "River James"), mekan=("Desert Bloom Ranch", "Joshua Tree", "California", "America/Los_Angeles"), tarih="2027-04-17",
         yerler=("The Desert Garden", "The Adobe Patio", "The Starlight Pavilion"), kiyafet="Boho chic",
         p=dict(bg="warm sandy cream gradient (#F6EDE3 to #E5CDB5) with very soft sun haze and fine grain, a few faint layered arch shapes at the bottom edge",
                paper="warm sand-colored textured cotton paper with fine speckles",
                liner="terracotta (#C9785B) background with a simple repeat of small cream arches and dots, flat gouache style",
                closure="A small dried palm spear and a pampas plume crossed and tied with a thin cream ribbon.",
                decor_main="fluffy cream pampas grass, dried palm spears, bunny tails and a few dried terracotta roses, flat gouache illustration with soft texture",
                decor_small="a horizontal spray of a pampas plume and two bunny tails, flat gouache",
                frame="a tall arch-shaped frame made of two nested arches in terracotta and sand, flat gouache, empty inside",
                extras=[])),
    dict(no=12, klasor="12_Tropical_Destination", ad="Tropical Destination",
         ruh="Ada düğünü: monstera, hibiskus, okyanus esintisi ve seyahat etiketi.",
         zarf="Palmiye desenli astarlı seyahat cüzdanı; çıtçıt açılır, bavul etiketi kartlar kayar.",
         foto="İpli eski bavul etiketleri (yazısız), sallanarak dizilir.",
         dekor="Monstera, palmiye, hibiskus, plumeria", teknik="canlı suluboya",
         font=("Dancing Script", "Raleway"), palet_adi="tropical",
         renk=dict(ink="#1E3A3A", deep="#1F6F6B", primary="#2FA39A", mist_top="#F2FAF8", mist_bottom="#CDEBE6",
                   gold="#D4A44C", gold_light="#EBCB8B", ivory="#FFFCF5", leaf="#2E7D4F"),
         cift=("Maya", "Maya Leilani", "Kai", "Kai Andrew"), mekan=("Coral Bay Resort", "Wailea", "Hawaii", "Pacific/Honolulu"), tarih="2027-06-19",
         yerler=("The Ocean Lawn", "The Sunset Deck", "The Palm Pavilion"), kiyafet="Beach formal",
         p=dict(bg="bright airy seafoam-to-aqua gradient (#F2FAF8 to #CDEBE6) with soft sunlight flares and faint palm leaf shadows at the edges, empty center",
                paper="bright white textured watercolor paper with fine grain",
                liner="lush tropical leaf pattern with monstera and palm leaves in deep green on a soft aqua background, seamless",
                closure="A single fresh white plumeria flower with a short twine loop, glossy petals with yellow center.",
                decor_main="monstera leaves, palm fronds, pink hibiscus and white plumeria flowers in vibrant fresh watercolor",
                decor_small="a horizontal spray of one small palm leaf and two plumeria flowers",
                frame="a blank vintage kraft luggage tag with a reinforced eyelet hole and a short twine string, completely empty with no printed text",
                extras=[])),
    dict(no=13, klasor="13_Enchanted_Forest", ad="Enchanted Forest Storybook",
         ruh="Masal kitabı: yosun, eğrelti, ateş böceği ışıkları; sayfalar çevrilerek anlatılır.",
         zarf="Kabartma çiçek bordürlü eski masal kitabı kapağı (yazısız); kapak açılır, sayfalar çevrilir.",
         foto="Kitap sayfalarına yapıştırılmış fotoğraf köşelikli kartlar, sayfa çevrilince belirir.",
         dekor="Eğrelti, yosun, mantar, ateş böceği ışığı", teknik="masal kitabı illüstrasyonu",
         font=("Tangerine", "IM Fell English"), palet_adi="forest-moss",
         renk=dict(ink="#2B2A1F", deep="#4A5A3A", primary="#6F7F4F", mist_top="#EDEFE3", mist_bottom="#BFC7A8",
                   gold="#B7975A", gold_light="#DCC58F", ivory="#F8F4E6", leaf="#55703F"),
         cift=("Aurora", "Aurora Jane", "Rowan", "Rowan Elias"), mekan=("Fernwood Glen", "Portland", "Oregon", "America/Los_Angeles"), tarih="2027-08-14",
         yerler=("The Mossy Clearing", "The Lantern Grove", "The Forest Hall"), kiyafet="Garden formal",
         p=dict(bg="dreamy misty forest green gradient (#EDEFE3 to #BFC7A8) with soft glowing firefly bokeh and faint silhouettes of tall trees at the edges, empty center",
                paper="aged cream book page paper (#F8F4E6) with subtle foxing and soft edges",
                liner="dark moss green (#4A5A3A) background with a storybook-style repeat of tiny ferns, mushrooms and stars in muted gold",
                closure="A small brass antique book clasp with a leaf-shaped engraving, no letters.",
                decor_main="ferns, moss, small toadstool mushrooms, ivy and tiny fireflies in antique golden-age fairy-tale illustration style — fine sepia ink lines and muted soft watercolor washes, elegant and grown-up, never cartoonish",
                decor_small="a horizontal sprig of ivy with two tiny mushrooms and one small firefly",
                frame="four vintage black photo corner mounts placed as a rectangle on an aged book page, the rectangle inside is empty",
                extras=[("decor/storybook_cover.png", "1024×1536", False, "An antique closed storybook seen straight from the front, deep moss-green cloth cover with an embossed gold floral border and an empty oval in the center, no title, no letters, no text, soft warm light, plain light background.")])),
    dict(no=14, klasor="14_Ivory_Lace_Pearl", ad="Ivory Lace & Pearls",
         ruh="Kraliyet zarafeti: fildişi dantel, inci, saten; klasik kilise düğünü.",
         zarf="Dantel kaplı fildişi gatefold; inci tokalı kopça açılır, dantel kanatlar aralanır.",
         foto="Oyma fildişi oval çerçeveler, inci dizisiyle iner.",
         dekor="Dantel bordür, inci dizisi, beyaz gül", teknik="fotogerçekçi doku",
         font=("Mrs Saint Delafield", "Bodoni Moda"), palet_adi="ivory-pearl",
         renk=dict(ink="#3A3530", deep="#8C7B66", primary="#E9E2D6", mist_top="#FAF7F2", mist_bottom="#E7E0D4",
                   gold="#BFA67A", gold_light="#DED0B0", ivory="#FFFDF8", leaf="#A3A58F"),
         cift=("Charlotte", "Charlotte Anne", "William", "William George"), mekan=("Ashbury Manor", "Newport", "Rhode Island", "America/New_York"), tarih="2027-06-05",
         yerler=("St. Mary's Chapel Garden", "The Pearl Room", "The Ashbury Ballroom"), kiyafet="Black tie optional",
         p=dict(bg="soft pearly ivory gradient (#FAF7F2 to #E7E0D4) with a subtle satin sheen and very faint lace shadow at the edges, empty center",
                paper="smooth ivory satin-finish paper (#FFFDF8) with a soft pearlescent sheen",
                liner="original fine ivory lace pattern with small roses and scallops on a pale champagne background, seamless, photorealistic",
                closure="An elegant pearl clasp: a cluster of five lustrous white pearls on a small antique silver-gold setting, no letters.",
                decor_main="a corner of delicate original ivory lace with scalloped edges, strands of small pearls and a few white garden roses, photorealistic",
                decor_small="a horizontal strand of small white pearls with a tiny lace bow in the center",
                frame="an oval cameo-style frame of carved ivory with a fine string of tiny pearls around the edge",
                extras=[])),
    dict(no=15, klasor="15_Cherry_Blossom", ad="Cherry Blossom Spring",
         ruh="İlkbahar: kiraz çiçeği dalları, uçuşan yapraklar, yumuşak pembe ve gri.",
         zarf="Kiraz çiçeği astarlı açık gri zarf; kapak açılınca yapraklar uçuşur.",
         foto="Yuvarlak (round) çerçeveler, yaprak gibi süzülerek iner.",
         dekor="Kiraz çiçeği dalı, tomurcuk, uçuşan yaprak", teknik="mürekkep + suluboya",
         font=("Petit Formal Script", "Noto Serif Display"), palet_adi="sakura",
         renk=dict(ink="#3A3438", deep="#8A6B76", primary="#F2C4CE", mist_top="#FBF5F6", mist_bottom="#E9E1E6",
                   gold="#B9A07A", gold_light="#DCCAA9", ivory="#FFFCFB", leaf="#6E5E55"),
         cift=("Hana", "Hana Grace", "Ethan", "Ethan Michael"), mekan=("Blossom Hill Gardens", "Washington", "D.C.", "America/New_York"), tarih="2027-04-03",
         yerler=("The Blossom Walk", "The Pavilion Terrace", "The Garden Hall"), kiyafet="Spring formal",
         p=dict(bg="very soft pale pink-to-dove-grey gradient (#FBF5F6 to #E9E1E6) with a few blurred drifting cherry petals at the edges, empty center",
                paper="soft white mulberry-style paper (#FFFCFB) with fine fibers",
                liner="pale grey background with a delicate repeat of small pink cherry blossoms and buds",
                closure="A small cluster of three pink cherry blossoms on a short brown twig.",
                decor_main="cherry blossom branches with dark brown twigs, pale pink five-petal blossoms and buds, fine ink lines with soft watercolor wash",
                decor_small="a short horizontal cherry blossom twig with three blossoms",
                frame="a round circular frame of a thin brushed gold ring with a few tiny cherry blossoms at the top, empty inside",
                extras=[("decor/petals_scatter.png", "1536×1024", True, "A loose scatter of about fifteen soft pink cherry blossom petals floating in the air at different angles, some slightly blurred, lots of empty space between them. Transparent background PNG, no text.")])),
    dict(no=16, klasor="16_Sunflower_Rustic", ad="Sunflower Rustic Barn",
         ruh="Kır düğünü: ayçiçeği, ahşap, kareli kurdele; sıcak ve neşeli.",
         zarf="Kraft zarf; kareli kurdele çözülür, kart ahşap masaya kayar.",
         foto="İpe mandalla asılmış fotoğraflar, tek tek mandallanır.",
         dekor="Ayçiçeği, buğday, papatya, ahşap", teknik="gerçekçi suluboya",
         font=("Kaushan Script", "Merriweather"), palet_adi="sunflower",
         renk=dict(ink="#3A2E1F", deep="#7A5A2E", primary="#E3A72F", mist_top="#FBF5E8", mist_bottom="#E9D6B2",
                   gold="#B88B3E", gold_light="#DDBB7E", ivory="#FFFBF0", leaf="#6E7D3A"),
         cift=("Daisy", "Daisy June", "Wyatt", "Wyatt Cole"), mekan=("Golden Field Barn", "Franklin", "Tennessee", "America/Chicago"), tarih="2027-08-28",
         yerler=("The Sunflower Field", "The Porch", "The Big Red Barn"), kiyafet="Country chic",
         p=dict(bg="warm golden-hour cream gradient (#FBF5E8 to #E9D6B2) with soft sun flare and very faint weathered wood grain at the bottom edge, empty center",
                paper="kraft brown paper with visible fibers",
                liner="soft mustard and cream gingham check pattern, fabric texture",
                closure="A mustard yellow gingham ribbon tied in a simple bow with a small sunflower head tucked in the knot.",
                decor_main="sunflowers, wheat stalks, white field daisies and green leaves, realistic watercolor",
                decor_small="a horizontal spray of one small sunflower, two wheat stalks and a daisy",
                frame="a white-bordered instant-style photo print hanging from a small natural wooden clothespin, empty photo area",
                extras=[("decor/twine_line.png", "1536×1024", True, "A single natural jute twine line stretched horizontally across the image with a slight sag, realistic fibers, nothing hanging on it. Transparent background PNG, no text.")])),
    dict(no=17, klasor="17_Emerald_Gold_Estate", ad="Emerald & Gold Estate",
         ruh="Malikâne gala gecesi: zümrüt yeşili kadife, altın botanik çizgi, mermer.",
         zarf="Zümrüt yeşili zarf, altın mühür; kapak açılınca altın çizgiler çizilerek büyür.",
         foto="Galeri duvarı: farklı boylarda ince altın çerçeveler zümrüt kadife duvara asılır.",
         dekor="Altın çizgi monstera/eğrelti, mermer", teknik="mermer + altın varak çizgi",
         font=("Cinzel Decorative", "Cormorant Infant"), palet_adi="emerald-gold",
         renk=dict(ink="#F3EDDF", deep="#C8A45A", primary="#0F4D3A", mist_top="#165C46", mist_bottom="#0B3528",
                   gold="#C8A45A", gold_light="#E5CC8E", ivory="#F3EDDF", leaf="#C8A45A"),
         cift=("Evelyn", "Evelyn Rose", "Alexander", "Alexander Reid"), mekan=("Emerald Court Estate", "Lake Geneva", "Wisconsin", "America/Chicago"), tarih="2027-05-29",
         yerler=("The Lakeside Lawn", "The Marble Gallery", "The Emerald Ballroom"), kiyafet="Black tie",
         p=dict(bg="deep emerald green velvet texture (#165C46 to #0B3528) with soft sheen and very subtle gold dust at the edges, empty center",
                paper="white and pale grey Carrara-style marble texture with soft thin veins, polished",
                liner="emerald green background with an elegant thin gold line-art pattern of ferns and leaves, seamless",
                closure="A round polished gold wax-style seal with a smooth empty center and a fine leaf border, no letters.",
                decor_main="elegant thin metallic gold line-art botanical corner of ferns, monstera and eucalyptus outlines, no fill",
                decor_small="a horizontal thin gold line-art fern sprig",
                frame="a slim polished gold picture frame with a fine inner bevel, empty inside",
                extras=[])),
    dict(no=18, klasor="18_Wildflower_Vellum", ad="Wildflower Meadow Vellum",
         ruh="Yaz çayırı: rengârenk kır çiçekleri, yarı saydam aydınger (vellum) katmanlar.",
         zarf="Yarı saydam vellum sargı, kır çiçeği etiketiyle; vellum kayarak çıkar, kart görünür.",
         foto="Vellum üstüne basılmış çiçek siluetleriyle örtülü kartlar; vellum kalkınca foto belirir.",
         dekor="Kır çiçekleri: gelincik, peygamber çiçeği, papatya, lupin", teknik="botanik çizim (renkli kalem)",
         font=("Satisfy", "Spectral"), palet_adi="wildflower",
         renk=dict(ink="#2E3140", deep="#4A6FA5", primary="#E07A5F", mist_top="#FBFAF4", mist_bottom="#E8EBDC",
                   gold="#C2A15E", gold_light="#E1CB98", ivory="#FFFEF8", leaf="#6A8A4E"),
         cift=("Willow", "Willow Anne", "Finn", "Finn Patrick"), mekan=("Meadowlark Farm", "Lancaster", "Pennsylvania", "America/New_York"), tarih="2027-06-26",
         yerler=("The Wildflower Meadow", "The Garden Barn", "The Meadow Tent"), kiyafet="Garden party",
         p=dict(bg="bright airy cream-to-pale-meadow-green gradient (#FBFAF4 to #E8EBDC) with soft blurred wildflower colors at the very bottom edge, empty center",
                paper="soft white cotton paper (#FFFEF8) with fine grain",
                liner="cheerful repeat of small colorful wildflowers (poppies, cornflowers, daisies) on cream, colored-pencil botanical style",
                closure="A small round pressed-wildflower sticker label made of real pressed flowers under a clear film, no text.",
                decor_main="colorful wildflowers — red poppies, blue cornflowers, white daisies, purple lupines and grasses — detailed colored-pencil botanical illustration",
                decor_small="a horizontal spray of a poppy, a cornflower and two grass stems in the same style",
                frame="a translucent frosted vellum rectangle with soft white wildflower silhouettes printed along its edges, semi-transparent center",
                extras=[("textures/vellum_sheet.png", "1024×1536", True, "A single sheet of translucent frosted vellum paper, slightly milky and semi-transparent, soft subtle sheen, straight edges, evenly lit, no print, no text. Transparent background PNG with the vellum itself semi-transparent.")])),
    dict(no=19, klasor="19_Midnight_Garden", ad="Midnight Garden",
         ruh="Gece bahçesi: siyah zemin üzerinde mücevher tonlu güller, mum ışığı, gizem.",
         zarf="Siyah zarf, gümüş mühür; kapak açılınca içeriden sıcak ışık sızar.",
         foto="Oymalı yaldızlı barok çerçeveler, karanlıktan mum ışığıyla aydınlanır.",
         dekor="Koyu güller, şakayık, erik, mor ve bordo yapraklar", teknik="karanlık natürmort yağlı boya",
         font=("Playfair Display SC", "Cormorant SC"), palet_adi="midnight",
         renk=dict(ink="#EFE6DA", deep="#C9A46A", primary="#141217", mist_top="#1C1A21", mist_bottom="#0B0A0D",
                   gold="#C9A46A", gold_light="#E3C99A", ivory="#EFE6DA", leaf="#5B6B4E"),
         cift=("Celeste", "Celeste Marie", "Damien", "Damien Alexander"), mekan=("The Midnight Conservatory", "New Orleans", "Louisiana", "America/Chicago"), tarih="2027-11-06",
         saatler=("18:00", "19:00", "20:30"),  # gece bahçesi: tören karanlıkta
         yerler=("The Moonlit Garden", "The Velvet Lounge", "The Glasshouse"), kiyafet="Black tie",
         p=dict(bg="near-black moody background (#1C1A21 to #0B0A0D) with very soft warm candlelight glow at the bottom and faint dark leaf silhouettes at the edges, empty center",
                paper="smooth matte black paper with a subtle fine texture",
                liner="dark moody floral pattern of deep red and plum roses with dark green leaves on black, painterly",
                closure="A realistic antique silver wax seal with a smooth empty center and a thin raised ring, no letters.",
                decor_main="dark moody florals — deep red and burgundy roses, plum peonies, dark berries and dusky leaves — in Dutch still-life oil painting style on a transparent background",
                decor_small="a horizontal sprig of one dark red rose bud, berries and two dark leaves in the same style",
                frame="an ornate carved gilded baroque picture frame in antique gold, empty inside",
                extras=[])),
    dict(no=20, klasor="20_Coastal_Seaside", ad="Coastal Seaside",
         ruh="Okyanus kenarı: deniz kabukları, kum, dalga suluboyası, deniz camı.",
         zarf="Dalga desenli astarlı kum rengi zarf, deniz kabuğu süslü; dalga geçince açılır.",
         foto="Yuvarlak gemi lombozu (porthole) çerçeveler, kenardan kayar.",
         dekor="Deniz kabuğu, deniz yıldızı, deniz camı, dalga", teknik="okyanus suluboyası",
         font=("Allison", "Lora"), palet_adi="seaside",
         renk=dict(ink="#1D3445", deep="#2E5E7E", primary="#7FB3C8", mist_top="#F4F8F9", mist_bottom="#D5E5EB",
                   gold="#C2A26B", gold_light="#E2CDA0", ivory="#FFFDF8", leaf="#8FB5A8"),
         cift=("Marina", "Marina Belle", "Oliver", "Oliver Grant"), mekan=("Seaglass Point", "Chatham", "Massachusetts", "America/New_York"), tarih="2027-07-17",
         yerler=("The Dune Lawn", "The Lighthouse Deck", "The Boathouse"), kiyafet="Coastal formal",
         p=dict(bg="soft sea-mist gradient (#F4F8F9 to #D5E5EB) with a faint watercolor shoreline wave at the bottom edge and fine sand grain, empty center",
                paper="soft sand-colored textured paper with tiny speckles",
                liner="soft ocean-blue watercolor wave pattern with thin white foam lines, seamless",
                closure="A small pale pink scallop seashell resting on a short loop of natural twine.",
                decor_main="seashells, a starfish, pieces of sea glass in aqua and white, and dune grass, soft ocean watercolor",
                decor_small="a horizontal row of three small seashells and a piece of sea glass",
                frame="a round brass ship porthole frame with small rivets, aged patina, empty glass center",
                extras=[])),
]

# Aşama 1 dışı ürünler (G142): platform teması olan ama bu katalogun üreteçlerine (yaz, paket5, gorev5, ozet, kontrol)
# girmeyen tasarımlar. Yalnız tema ↔ koleksiyon eşlemesi için (platform/scripts/lib/theme-env.ts: theme-check, g051,
# final-smoke koleksiyonu buradan bulur). Ayırt edicilik / WEB / STORY denetimi bunlara uygulanmaz — tam katalog kaydı
# açılırsa D'ye taşınır ve buradan silinir.
EK_TEMALAR = [
    dict(no=21, klasor="21_Crimson_Rose_Atelier", ad="Crimson Rose Atelier"),
    dict(no=22, klasor="22_Nocturne_Lake_Estate", ad="Nocturne Lake Estate"),
    # docs/24 dalgası (23–28): eksenler + hareket imzası yazılı; `kontrol` bunları D'ye ve birbirine karşı ayırt eder
    # (ek_ayirt). Üreteçlere (yaz, paket5, gorev5, ozet) girmez: koleksiyon dosyaları elle yazıldı.
    dict(no=23, klasor="23_Velvet_Jewel_Box", ad="Velvet Jewel Box",
         zarf="Patlıcan moru kadife yüzük kutusu; saten fiyonk kayar, kapak menteşeden 3B açılır, saten astar ve kart yükselir.",
         foto="3B silindir karusel (mücevher vitrini gibi döner; sürükle, kaydır, ok tuşları).",
         dekor="Saten kurdele, inci, yüzük, şampanya saten kıvrımlar", teknik="fotogerçekçi ürün çekimi",
         font=("Pinyon Script", "Bodoni Moda"), palet_adi="aubergine-champagne",
         hareket="Menteşe 3B açılış, saten ışık süpürmesi, varak parıltılı başlık, silindir karusel, saten perde sayfa geçişi"),
    dict(no=24, klasor="24_Grand_Theatre_Premiere", ad="Grand Theatre Premiere",
         zarf="Tavus mavisi kadife sahne perdesi, antik altın proscenium kemer; iki kanat ağır kıvrımlarla, kademeli aralanır, spot ışığı sahneyi tarar.",
         foto="Sahne çerçevesinde 'perde arası' kartları (Scene I–III); spot ışığı dokunulanı aydınlatır.",
         dekor="Kadife perde, püskül, altın proscenium kemer, program (playbill) kâğıdı", teknik="yağlı boya tiyatro afişi",
         font=("Abril Fatface", "Playfair Display"), palet_adi="peacock-antique-gold",
         hareket="Perde aralanması (kademeli, salınımlı), spot ışığı maskesi, program sayfası çevirme geçişi, RSVP'de bilet koçanı yırtılması"),
    dict(no=25, klasor="25_Orient_Express_Voyage", ad="Orient Express Voyage",
         zarf="Deri bilet cüzdanı, pirinç tokalı kayış; kayış çözülür, kapak soldan açılır, birinci sınıf bilet cepten kayar.",
         foto="Vagon penceresi çerçeveleri; kaydırınca fotoğraf camın ardından manzara gibi geçer.",
         dekor="Pirinç vagon detayları, bagaj etiketi, eski harita, istasyon saati", teknik="vintage seyahat afişi (litografi)",
         font=("Limelight", "Cormorant Garamond"), palet_adi="bottle-green-brass",
         hareket="Haritada rota çizgisi kaydırmayla çizilir, istasyonlar sırayla gelir, bagaj etiketi sallanır, biniş kartına damga basılır."),
    dict(no=26, klasor="26_Kintsugi_Washi", ad="Kintsugi & Washi",
         zarf="Çivit washi kâğıdı origami gibi katlanmış, pirinç kâğıdı kuşakla sarılı; katlar sırayla açılır (üst, alt, sol, sağ), pirinç kâğıdı kart kalkar.",
         foto="Mürekkep yayılması maskesiyle beliren fotoğraflar; sayfa boyunca sol–sağ–sol tek tek.",
         dekor="Altın kintsugi damarları, washi dokuları, mürekkep fırçası darbeleri", teknik="sumi mürekkep + altın varak",
         font=("Allura", "Shippori Mincho"), palet_adi="indigo-gold-rice",
         hareket="Kat kat 3B açılma (dört kat ayrı menteşede), altın damar parıltısı, mürekkep yayılımıyla foto, süzülen altın varak pulları"),
    dict(no=27, klasor="27_Riad_Lantern_Nights", ad="Riad Lantern Nights",
         zarf="Oyma sedir ağacı çift kapı (riad avlu duvarında); kanatlar dış menteşelerinde avluya doğru 3B açılır, fener ışığı dışarı taşar, kart kapıdan öne gelir.",
         foto="Fas kemeri biçimli uzun pencereler; fotoğraf karanlıkta bekler, fener ışığı ulaşınca belirir.",
         dekor="Zellige çini, pirinç fenerler, sedir oyma, bougainvillea", teknik="gouache + gerçekçi doku",
         font=("Cinzel", "Marcellus SC"), palet_adi="teal-saffron-brass",
         hareket="Kapı kanatlarının 3B açılışı, fener ışığı titreşimi (ışık/filtre), zellige bordürün çini çini dizilmesi, kaydırmada kemerden ışık süzmesi."),
    dict(no=28, klasor="28_Maison_Patisserie", ad="Maison Patisserie",
         zarf="Fıstık yeşili pasta kutusu (üstten), gül saten fiyonk; fiyonk çözülür, kurdele kolları kayar, kapak kalkar, ipek kâğıt aralanır, kart öne gelir.",
         foto="Pastane vitrini rafları: fotoğraflar cam rafta durur, kaydırılır (sürükle, yasla, ok tuşları); ortadaki öne çıkar.",
         dekor="Makaron, tül, şeker inci, altın kenar tabak", teknik="pastel suluboya + fotogerçekçi pasta",
         font=("Italiana", "Parisienne"), palet_adi="pistachio-rose-cream",
         hareket="Fiyonk çözülmesi (iki ilmek ayrılır, düğüm düşer), kapak kalkışı, ipek kâğıt perde gibi aralanır; raf kaydırma bileşeni; menü vitrin rafları; RSVP makaron renkli çipler; gönderimde şeker inci yağmuru."),
    # 2. dalga (29–32, docs/24): aynı kurallar; GPT parçalarından önce kuruldu.
    dict(no=29, klasor="29_Celestial_Observatory", ad="Celestial Observatory",
         zarf="Pirinç gözlemevi kubbesi; yarık kapağının iki yarısı ayrılır, gece göğü görünür, yıldızlar yanar, kart yarıktan yükselir.",
         foto="Döner yıldız haritası (planisfer) yuvarlak çerçeveler; kadran süpürmesiyle belirir, kaydırınca pirinç halka ve gök döner.",
         dekor="Yıldız haritası, pirinç usturlap, gezegen yörüngeleri, ay evreleri", teknik="gravür + altın varak",
         font=("Imperial Script", "Forum"), palet_adi="midnight-silver-gold",
         hareket="Kubbe yarığının açılması (iki kapak yarısı), yıldızların sırayla yanması, takımyıldız çizgisinin çiftin baş harflerini birleştirmesi (UI çizgi), kaydırmayla dönen gök ve planisfer halkaları, kadran süpürmesiyle foto"),
    dict(no=30, klasor="30_Azulejo_Mosaic", ad="Azulejo Mosaic",
         zarf="Mavi-beyaz el boyaması azulejo çini paneli (4 × 6; köşe, bordür, alan çinileri); dokunulan çiniden başlayan dalgayla çiniler tek tek 3B döner, arkadaki kart çıkar.",
         foto="Çini mozaiği: fotoğraf küçük çinilerin altında bekler, sahnesine gelince çiniler çapraz dalgayla dönüp kalkar.",
         dekor="Kobalt azulejo desenleri, terrakota saksılar, badana sıva, çini friz", teknik="el boyaması seramik",
         font=("Arizonia", "Cormorant Upright"), palet_adi="cobalt-white-terracotta",
         hareket="Karo karo 3B çevirme ızgarası: dokunulan noktadan yayılan dalga, her çini terrakota sırtını gösterip kalkar; fotoğraflar çini mozaiğiyle açılır; RSVP teşekkürü çinilerle belirir; metin çini gibi üst kenarından yatarak yerleşir."),
    dict(no=31, klasor="31_Sky_Lantern_Festival", ad="Sky Lantern Festival",
         zarf="Avuçlarda tutulan pirinç kâğıdı dilek feneri; dokununca ışır, eller bırakır, fener alacakaranlık göğüne yükselir, ışığında kart belirir.",
         foto="Yükselen fenerlerin ışığında beliren fotoğraflar: küçük bir fener yanından geçer, ışığı fotoğrafı alttan açar; fener yolu boyunca sol–sağ–sol.",
         dekor="Pirinç kâğıdı fenerler, alacakaranlık gökyüzü, yıldız tozu", teknik="suluboya + ışık",
         font=("Corinthia", "Bellefair"), palet_adi="dusk-amber-violet",
         hareket="Fener yükselişi (paralaks katmanlar: gök, yıldız tozu, uzak fenerler), sıcak ışık hâlesi, kaydırmayla süzülen fenerler, programda sırayla yanan fenerler, RSVP'de göğe bırakılan tek fener"),
    dict(no=32, klasor="32_Music_Box_Ballerina", ad="Music Box Ballerina",
         zarf="Gül kuvarsı lake müzik kutusu, yan tarafta pirinç kurma anahtarı; anahtar döner, kapak arka menteşede kalkar, aynalı iç kapak dikilir, balerin yükselip yavaşça döner, kart öne gelir.",
         foto="Kapağın oval aynasında yansıyan fotoğraflar: tek tek, cam üstünde ışık parıltısıyla değişir; balerin her fotoğrafta çeyrek döner.",
         dekor="Saten astar, pirinç kurma anahtarı, tül, gül yaprakları", teknik="fotogerçekçi + pastel",
         font=("Ballet", "Gilda Display"), palet_adi="rose-quartz-gold",
         hareket="Kurma anahtarı döner (müzik kutusu ezgisi dokunuştan sonra), kapak menteşesi, balerinin yavaş piruet kare dizisi, aynada parıltılı foto geçişi, az sayıda süzülen gül yaprağı (azaltılmış harekette yok), oval ayna sayfa geçişi."),
    # 3. dalga (33–38, docs/24; K23 sıkı: ilk sayfa kapalı zarf): aynı kurallar; GPT parçalarından önce kuruldu.
    dict(no=33, klasor="33_Marigold_Mehndi", ad="Marigold & Mehndi",
         zarf="Fuşya ipek zarf, altın lazer kesim paisley kılıfın içinde; püskül sallanır, kılıf yana kayar, düz ipek kapak açılır, kart kadife-fuşya astardan yükselir; kadife çiçeği yaprakları süzülür.",
         foto="Jharokha (Rajasthan pencere kemeri) çerçeveler; fotoğraf alttan yukarı kına gibi akarak belirir, kemerin çevresindeki kına deseni çizgi çizgi akar.",
         dekor="Kadife çiçeği çelenkleri, kına desenleri, pirinç diya kandilleri, ipek püsküller", teknik="zengin minyatür + fotogerçekçi ipek",
         font=("Rozha One", "Yrsa"), palet_adi="saffron-fuchsia-gold",
         hareket="Püskül sarkacı, altın kılıfın yana kayması, düz ipek kapağın kadife iç yüze devretmesi, kadife çiçeği yapraklarının süzülmesi, diya alevlerinin sırayla yanması, kına çizgisinin kemer çevresinde akması (maske), metnin kılıf gibi yandan kayarak yerleşmesi."),
    # 3. dalga (33–38, docs/24; K23 sıkı: ilk sayfa kapalı zarf): aynı kurallar; GPT parçalarından önce kuruldu.
    dict(no=34, klasor="34_Red_Lacquer_Double_Happiness", ad="Red Lacquer & Double Happiness",
         zarf="Dikey kırmızı kâğıt zarf, cepte altın varak 囍, ip-düğme kapama; ip düğmeden dönerek çözülür ve düşer, kapak katından kalkar, kart iki kâğıt kesim şakayık penceresine sarılı yükselir, pencereler kat kat iki yana açılır.",
         foto="Ay kapısı (moon gate) yuvarlak çerçeveler; iki kırmızı kâğıt kapı kanadı yana kayarak fotoğrafı açar; mekân fotoğrafı kafes kapılarla.",
         dekor="Şakayık, kâğıt kesim (jianzhi) desenleri, kırmızı lake, altın bulut motifleri, püsküllü düğüm", teknik="kâğıt kesim + lake + altın varak",
         font=("Luxurious Script", "Prata"), palet_adi="lacquer-red-gold-cream",
         hareket="İpin düğmeden dönerek çözülmesi, kapağın katından kalkması, kâğıt kesim pencere katlarının kanat kanat açılması, altın bulutların süzülmesi, iki hızda kayan kâğıt kesim katmanlar (paralaks), ay kapısı kanatlarıyla foto, metnin üst kenarından katlanarak açılması, sallanan püsküllü düğüm"),
]

# Demo kaydının Our Story bloğu (`content.demo.json` → `story`; G053 metinleri, G057'den beri tek kaynak burası):
# no → (intro, (başlık 1, başlık 2, başlık 3)). Intro bir cümle parçasıdır, sayfada tarihle biter ("… led us to" +
# " May 15, 2027."). Başlıklar PAKET 2 story_1..3 sahneleri: ilk buluşma, evlilik teklifi, eller + yüzük; kısa tutulur
# (yan yana dizilişlerde dar çerçeve altına sığsın). `content()` 03–20 kaydına yazar; 01 ve 02 elle yazıldı, `ozet`
# onlarda yalnız `story`'yi eşitler. `kontrol` kayıtların bununla aynı olduğunu denetler.
STORY = {
    1: ("Slow lunches, golden evenings and one walk through the olive grove led us to",
        ("Our first lunch", "In the olive grove", "Simply forever")),
    2: ("Coffee dates, sea breezes and all the quiet moments in between brought us to",
        ("Our first coffee", "Sunset by the sea", "Ever after")),
    3: ("A few of the moments that led us to",
        ("First hello", "The proposal", "Forever begins")),
    4: ("Some love stories are written one letter at a time. Ours led us to",
        ("A table for two", "Sealed with a yes", "Yours, always")),
    5: ("Under the lemon trees, one sunny day at a time, we found our way to",
        ("On the piazza", "Above the sea", "Our sweetest yes")),
    6: ("It began with jazz and champagne, and every evening since has led us to",
        ("Jazz night", "On the staircase", "Here's to us")),
    7: ("Warm cider, long autumn walks and many cozy evenings in between brought us to",
        ("By the fire", "Falling leaves", "Hand in hand")),
    8: ("Hot cocoa, falling snow and one very happy winter evening brought us to",
        ("First snowfall", "Under the pines", "Evergreen love")),
    9: ("Long summer evenings and fields of lavender carried us all the way to",
        ("Rosé in the square", "In the lavender", "Tied together")),
    10: ("Good wine, long tables and golden vineyard sunsets led us to",
         ("First pour", "Among the vines", "A fine vintage")),
    11: ("Wide skies, open roads and a few wild-hearted adventures carried us to",
         ("Where it began", "Desert sunset", "Wild hearts")),
    12: ("Every adventure and every island sunset has brought us closer to",
         ("Island time", "End of the pier", "Next stop: forever")),
    13: ("Once upon a time, two people met in the woods. Every page since has led us to",
         ("Chapter one", "By lantern light", "Happily ever after")),
    14: ("Tea for two, a rose garden and one promise we will always keep brought us to",
         ("Afternoon tea", "By the fountain", "Pearls & promises")),
    15: ("Like the first blossoms of spring, our story unfolded slowly and led us to",
         ("Our first spring", "Under the blossoms", "In full bloom")),
    16: ("Back roads, lemonade and one golden sunflower field led us straight to",
         ("Tailgate lemonade", "In the sunflowers", "Sunny days ahead")),
    17: ("From our first toast among the paintings, every moment has been leading us to",
         ("At the gallery", "By the lake", "Set in gold")),
    18: ("Picnics, wildflowers and long summer afternoons brought us to",
         ("Our first picnic", "In the meadow", "Picked for keeps")),
    19: ("Candlelit evenings and moonlit walks led us, one midnight at a time, to",
         ("By candlelight", "Under the moon", "One red rose")),
    20: ("Salt air, long walks on the shore and one golden evening carried us to",
         ("Down by the harbor", "By the lighthouse", "Tide after tide")),
}
STORY_INTRO_EN_COK, STORY_BASLIK_EN_COK = 200, 60  # docs/03_URUN_ICERIK_SEMASI.json (story.intro, items[].caption)

MOCK = {  # Paket 3 mockup sahne öğeleri: (yüzey, kenar süsleri, zarf)
    1: ("an ivory linen tablecloth", "olive branches, a few green olives and an olive-green silk ribbon", "an olive-green textured envelope with an ivory lace edge and an oval botanical seal"),
    3: ("a soft blush linen tablecloth", "blush peonies, cream garden roses and a blush silk ribbon", "a deckle-edged blush pink envelope"),
    4: ("an aged wooden writing desk", "a few fictional botanical postage stamps without text, dried flowers and a vintage fountain pen", "a red and navy striped airmail envelope"),
    5: ("a white plaster tabletop with blue and white tiles at the edge", "lemon branches with ripe lemons and white blossoms", "a white envelope with a blue tile-pattern liner"),
    6: ("a dark navy velvet surface", "two crystal champagne coupes, a string of pearls and gold art deco accents", "a deep navy envelope with a gold deco medallion"),
    7: ("a dark walnut table with a burgundy velvet runner", "burgundy dahlias, deep red roses, blackberries and a burgundy velvet ribbon", "a cream envelope tied with a burgundy velvet ribbon"),
    8: ("a white wool blanket with a light dusting of snow", "pine branches, red winter berries, small pine cones and a red velvet ribbon", "a forest green envelope sealed with a pine sprig"),
    9: ("a natural cream linen cloth", "dried lavender bundles tied with twine and small white daisies", "a cream linen pouch tied with jute twine"),
    10: ("a rustic oak table", "grape clusters, vine leaves, olive branches and a cork", "a kraft paper envelope tied with jute twine"),
    11: ("a warm sand-colored stucco surface", "pampas grass plumes, dried palm spears and bunny tails", "an arch-shaped terracotta envelope"),
    12: ("a light rattan tray on white sand", "monstera leaves, pink hibiscus, white plumeria and a few seashells", "a bright white travel wallet with a slim tan leather strap, its palm-leaf liner peeking out"),
    13: ("a mossy wooden tabletop", "ferns, moss, small mushrooms and tiny warm fairy lights", "an antique green storybook with an embossed gold border and no title"),
    14: ("an ivory satin cloth", "white garden roses, a strand of pearls and a piece of ivory lace", "an ivory lace-covered gatefold envelope with a pearl clasp"),
    15: ("a pale grey stone surface", "cherry blossom branches and scattered pink petals", "a pale grey envelope with a cherry blossom liner"),
    16: ("a weathered barn-wood table", "sunflowers, wheat stalks, white daisies and a mustard gingham ribbon", "a kraft envelope tied with a gingham ribbon"),
    17: ("a white Carrara marble surface", "emerald velvet ribbon, gold candle holders and eucalyptus", "an emerald green envelope with a gold seal"),
    18: ("a soft white cotton cloth", "fresh wildflowers — poppies, cornflowers, daisies — and a sheet of translucent vellum", "a translucent vellum sleeve with a small round wildflower label"),
    19: ("a black velvet surface", "dark red and plum roses, berries and a lit taper candle", "a black envelope with a silver wax seal"),
    20: ("pale beach sand", "seashells, a starfish, sea glass and dune grass", "a sand-colored envelope with a wave-pattern liner"),
}

STIL = {
    "suluboya": "soft watercolor", "suluboya-guaj": "watercolor-and-gouache", "yağlı boya": "romantic oil painting",
    "vintage baskı": "vintage print", "altın çizgi illüstrasyon": "fine metallic gold line illustration",
    "kurutulmuş çiçek fotoğrafı": "pressed flower flat-lay photograph", "gravür + suluboya": "vintage engraving with watercolor wash",
    "dijital guaj (düz renk)": "flat gouache illustration", "canlı suluboya": "vibrant watercolor",
    "masal kitabı illüstrasyonu": "classic storybook ink-and-watercolor illustration", "fotogerçekçi doku": "photorealistic",
    "mürekkep + suluboya": "fine ink and watercolor", "gerçekçi suluboya": "realistic watercolor",
    "mermer + altın varak çizgi": "gold line art", "botanik çizim (renkli kalem)": "colored-pencil botanical illustration",
    "karanlık natürmort yağlı boya": "dark Dutch still-life oil painting", "okyanus suluboyası": "ocean watercolor",
}

SAHNELER = [
    ("1", "Kapalı zarf / kapak", "{zarf}"),
    ("2", "Açılış, kart yükselir", "Kapanış elemanı (mühür/kurdele/toka) ayrı katman olarak çözülür; kart ayrı katman."),
    ("3", "Our Story — 3 fotoğraf", "{foto}"),
    ("4", "Davet kartı", "Aileler, isimler, davet cümlesi, tarih bloğu, mekân. Dekor: {dekor}."),
    ("5", "Program", "Ceremony / Cocktail Hour / Reception + kıyafet."),
    ("6", "RSVP", "Son tarih, buton, kapanış cümlesi, kapanış elemanının küçük tekrarı."),
]


# ----------------------------------------------------------------------------- website (K22–K24) · Paket 5
#
# Her tasarımın website sanat yönetimi (İngilizce; GPT prompt'larına girer). Tasarım 03 elle yazıldı (G030/G035),
# burada yok ve üreteç onun dosyasına dokunmaz. Eksik alanlar `p` sözlüğünden gelir (liner, bg, corner=decor_main,
# ayirici=decor_small); 02'de `p` olmadığı için hepsi burada.
#   tip: kapak (kapaklı zarf/cep/cüzdan) · kapi (gatefold, iki kapı) · kitap · kese · kilif (vellum kılıf)
#   zarf / zarf_kisa / zarf_acik ({liner} yer tutucusu) · kapanis / kapanis_kisa / kapanis_yeri / kapanis_olcu
#   acilis: website'te zarfın açılış hikâyesi (tek cümle) · kart_kucuk / davet_karti / bilgi_karti
#   cerceve / pencere / cerceve_yatay / pencere_yatay: foto çerçevesi (foto eksenine göre) · story: story ekranı dizilişi
#   accent: tek başına süzülen 3 nesne (artikelsiz) · kume: florals | decor (köşe kümesi dosya adı)
#   doku: bg_tile · buton · yazi: comp tipografisi · renk_sozu · foto: Paket 2 (kıyafet, sahneler, mekân, not)
#   ekler: tasarıma özel ek parçalar [(dosya, ölçü, şeffaf, başlık, prompt, kontrol[, düzen])] — düzen: ORTALI yerine
#          (ör. EGRI: eğri/sarkık nesnede "perfectly straight" demez)
# İsteğe bağlı (2026-10-13 gözden geçirme):
#   yer: ZARF_TIPI yerleşimi yerine (dikey cep/cüzdan: kapak tuvalin içinde açılabilsin)
#   zarf_parca: envelope_closed.png için zarf metni (W1'deki `zarf`tan farklıysa; 18: kılıf boş çizilir)
#   acik_duzenle: envelope_open.png yeni çizim değil, envelope_closed.png'nin düzenlemesi (04: yalnız şerit kalkar)
#   sarili: kapanış zarfı saran kurdele/sicim → closure.png zarfla aynı tuvalde, üst üste 1:1 oturur
#           (kapanis_olcu = zarf tuvali); değilse kapanış kareyi ~%70 doldurur, Claude ölçekler
#   story_ortusme: story çerçeveleri yalnız kenar paylarında üst üste biner (W1.3 kontrolü buna göre)
#   yazi_bilgi / yazi_vurgu: comp'larda bilgi satırlarının yazısı (varsayılan "serif" / "italic serif")
#   ortak: comp'ların ortak kalite/ışık cümlesi (19: karanlık natürmort ışığı)
#   pencere_temiz: (İngilizce ek, Türkçe kontrol) — foto penceresinin üstüne hiçbir şey binmesin (08: kırağı)
#   foto.kadraj: Paket 2.1–2.4'e eklenen kadraj cümlesi (yuvarlak/oval pencere)
# İsteğe bağlı (G046 incelemesi):
#   kapanis_parca: W2 closure.png metni W1'deki `kapanis`tan farklıysa (ör. mühür dalsız, dal `ekler`'de; bugün kullanılmıyor — 01 kapanışı a177cb4'ten beri tek parça)
#   kapanis_doluluk: sarılı olmayan kapanışın kareyi doldurma yüzdesi (varsayılan 70) · kapanis_k_ek: Kontrol eki
#   kesim_kenari / acik_kenari: KESIM_KENARI[tip] yerine (04: yırtma şeridi) — kesilecek kenarın net olması cümlesi

KADRAJ_DAIRE = ("Compose so that both people fit well inside a centered circle whose diameter is the image width (the "
                "photo will be cropped to a circle), with space around them — for standing or kneeling poses, "
                "photograph from a slightly greater distance.")
KADRAJ_OVAL = ("Compose so that both people fit well inside a centered upright oval about as wide as the image (the photo "
               "will be cropped to an oval), with space around them — for standing or kneeling poses, photograph from a "
               "slightly greater distance.")
EGRI = ("Seen straight-on (not tilted, no perspective), centered and not cropped, with generous empty margin all around; "
        "the object keeps its natural curve.")

ZARF_TIPI = {
    "kapak": ("kapaklı zarf", "1024×1536",
              "Place it exactly where it will sit in envelope_open.png: horizontally centered, its bottom edge at about "
              "88% of the image height and its width about 80% of the image width; the empty upper part of the image is "
              "left for the opening and for the card to rise into."),
    "kapi": ("gatefold, iki kapı", "1536×1024",
             "The folder stands perfectly upright in the exact center of the wide image, its height about 85% of the image "
             "height; the empty areas to the left and right are left for the two doors to open into."),
    "kitap": ("kitap kapağı", "1536×1024",
              "The book's spine sits exactly at the horizontal center of the wide image and the closed cover lies in the "
              "right half, its right edge about 6% from the image border and its height about 85% of the image height; "
              "the left half stays empty for the cover to swing open into."),
    "kese": ("keten kese", "1024×1536",
             "Horizontally centered, its bottom edge at about 90% of the image height and its width about 60% of the "
             "image width; the empty upper part is left for the card to rise into."),
    "kilif": ("vellum kılıf", "1024×1536",
              "Horizontally centered, its bottom edge at about 90% of the image height and its width about 70% of the "
              "image width; the empty upper part is left for the card to rise into."),
}

WEB = {
    1: dict(
        renk_sozu="olive green, sage, warm ivory and soft antique gold",
        yazi="a flowing calligraphy script for the names and a refined classic Garamond-style serif in small spaced capitals",
        tip="kapak",
        zarf="an olive-green (#7D8B5A) textured cotton-paper envelope with soft visible fibers, about 5:4 wider than tall, with a deep pointed V flap whose edge is trimmed with a narrow band of fine ivory lace",
        zarf_kisa="olive envelope",
        liner="a warm ivory (#FBF8F0) liner with a fine hand-drawn olive-branch repeat in pale sage (#A8B28A)",
        corner="slender olive branches with silvery-green leaves and small dark olives, a few white garden roses and small white blossoms",
        zarf_acik="the lace-edged V flap folded fully upward above the envelope, its inner side and the inside of the back showing the liner — {liner}; the front pocket empty",
        kapanis="an oval botanical wax seal in warm antique gold-ivory (#D7C79F, deepening to #B39A63 in its pressed recesses) with an irregular poured edge, a smooth EMPTY oval center inside a thin raised rim and a tiny embossed wreath of olive leaves and small blossoms, a short olive sprig tucked under it",
        kapanis_kisa="oval botanical seal", kapanis_yeri="pressed onto the tip of the V flap, a little below the envelope's center", kapanis_olcu="1024×1024",
        # W2 (G201 teslimi, entegratör 2026-10-13): mühür ve altındaki zeytin dalı TEK parça; açılışta birlikte kalkar
        acilis="On tap, the lace-edged flap peels up on its hinge carrying the oval seal and its tucked olive sprig with it, and the ivory card glides up out of the pocket while two olive leaves float across the screen.",
        kart_kucuk="a small warm-ivory card with softly rounded corners and a fine antique-gold double border, a rounded-corner portrait photo window in its upper 60% and plain blank paper below",
        davet_karti="a tall warm-ivory cotton card with softly rounded corners and a fine antique-gold double border, a slender watercolor olive branch with silvery leaves and small dark olives arching across the top-left corner and a smaller sprig at the bottom-right",
        bilgi_karti="a tall warm-ivory card with softly rounded corners, a fine antique-gold double border and only one small olive sprig at the top center",
        cerceve="a portrait ivory card frame with softly rounded corners, a fine antique-gold double border and a slim ivory margin, a tiny watercolor olive sprig tucked at its bottom-left corner",
        pencere="a portrait window with softly rounded corners (about 3:4)",
        cerceve_yatay="a landscape version of the same rounded-corner ivory card frame with the fine antique-gold double border and a tiny olive sprig at its bottom-left corner",
        story="three rounded-corner gold-bordered portrait cards fanned out gently like a hand of cards — the middle card upright and slightly higher, the side cards tilted about 8 degrees outward and overlapping it only at their outer ivory margins, so all three green windows stay fully visible and each caption sits under its own card",
        story_ortusme=True,
        accent=["silvery-green olive leaf", "small ripe dark olive with a short stem and one tiny leaf", "tiny white jasmine blossom"],
        kume="decor",
        doku="soft warm-ivory watercolor paper (#F1EFE6) with faint linen grain and very subtle tonal mottling",
        buton="an olive-green pill button with ivory lettering",
        foto=dict(kiz="a flowing ivory chiffon dress", erkek="a light sage-grey linen suit with no tie",
                  portre="beneath old silvery olive trees in a sunlit Mediterranean-style garden at golden hour",
                  s1="a candid first-date moment laughing together at a rustic outdoor table under an olive tree, two glasses of lemonade and a small bowl of olives, warm afternoon light",
                  s2="the proposal moment on a gravel path through an olive grove at sunset",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, holding a small sprig of olive leaves and white jasmine",
                  mekan="A fictional elegant wine-country estate wedding venue at golden hour: a cream stone villa with a terrace, rows of white ceremony chairs on a lawn lined with old olive trees, a simple arch of olive branches and white flowers, soft rolling vineyard hills behind",
                  dunya="zeytin yeşili, fildişi, adaçayı, sıcak altın ışık",
                  notu="Fotoğraflar yuvarlak köşeli dikey kart çerçevelere (~3:4) girer: yüzler ortadaki %70'lik alanda, başın üstünde pay kalsın.")),
    2: dict(
        renk_sozu="dusty blue, deep slate blue, ivory and champagne gold with soft eucalyptus green",
        yazi="an elegant copperplate script for the names and a graceful Garamond-style serif in small spaced capitals",
        liner="a soft dusty blue (#7C94AC) liner with a delicate champagne-gold (#D9C49E) botanical damask of small eucalyptus leaves and tiny five-petal blossoms",
        bg="soft misty dusty blue gradient (#DDE5EC at the top to #B7C6D4 at the bottom) with very gentle out-of-focus bokeh and a faint fine paper grain, calm empty center",
        corner="silver-dollar eucalyptus in dusty blue-green, a few soft white garden roses, small white blossoms and delicate champagne-gold fern sprigs",
        ayirici="one slender eucalyptus branch with dusty blue-green leaves, two tiny white blossoms and a champagne-gold fern sprig",
        tip="kapak",
        zarf="a classic ivory cotton-paper envelope, about 5:4 wider than tall, with a deep pointed V flap edged by a hair-thin champagne-gold line, crisp edges and soft natural fibers",
        zarf_kisa="ivory envelope",
        zarf_acik="the V flap folded fully upward, its inner side and the inside of the back showing {liner}; the front pocket empty",
        kapanis="a realistic dusty blue wax seal (#6E88A3, deepening to #4E6782 in the pressed recesses) with an organic irregular poured edge, a smooth EMPTY circular pressed center inside a thin raised ring and a tiny embossed eucalyptus-leaf wreath, a short sprig of silver-dollar eucalyptus tucked under it",
        kapanis_kisa="dusty blue wax seal", kapanis_yeri="pressed onto the tip of the V flap", kapanis_olcu="1024×1024",
        acilis="On tap, the dusty blue wax seal breaks free and falls away, the V flap opens upward to reveal the gold damask liner, and the card rises from behind the front pocket while a single eucalyptus leaf drifts down.",
        kart_kucuk="a small ivory card with straight edges and a thin champagne-gold inner border, a portrait photo window in its upper 60% and plain blank paper below",
        davet_karti="a tall ivory cotton card with a thin champagne-gold inner border, a watercolor-and-gouache spray of silver-dollar eucalyptus, white garden roses and champagne-gold fern across the top-left corner and a smaller spray at the bottom-right",
        bilgi_karti="a tall ivory card with a thin champagne-gold inner border and only one small eucalyptus sprig at the top center",
        cerceve="a classic instant-photo print in heavy ivory cotton paper with a deeper bottom margin, its outer edge finished with a hair-thin champagne-gold foil line and a tiny sprig of silver-dollar eucalyptus tucked behind its top-left corner",
        pencere="a slightly portrait window (about 4:5)",
        cerceve_yatay="a landscape version of the same ivory instant-photo print with the hair-thin champagne-gold foil edge and a tiny eucalyptus sprig behind its top-left corner",
        story="three instant-photo prints scattered across the page at gentle angles, touching only at their white borders so every green window stays fully visible, as if each had just flown in and settled one after another",
        story_ortusme=True,
        accent=["silver-dollar eucalyptus leaf", "small white five-petal blossom", "delicate champagne-gold fern frond"],
        kume="florals",
        doku="soft misty dusty blue watercolor wash (#DDE5EC) with a fine paper grain",
        buton="a dusty blue pill button with ivory lettering",
        foto=dict(kiz="a flowing dusty blue chiffon dress", erkek="a light grey suit with no tie",
                  portre="in a garden at golden hour, with a soft creamy background of greenery and white roses",
                  s1="a candid moment laughing together at a small outdoor café table with two coffee cups, warm afternoon light",
                  s2="the proposal moment on a quiet seaside cliff path at sunset under a soft pastel sky",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, resting on a linen tablecloth with a few white blossoms and eucalyptus leaves",
                  mekan="A fictional elegant Southern manor wedding venue at golden hour: a white two-story house with columns and a wide veranda, a lawn with rows of white ceremony chairs and a simple floral arch of white roses and eucalyptus, large oak trees",
                  dunya="pudra mavisi, fildişi, okaliptüs yeşili, şampanya altını",
                  notu="Fotoğraflar anlık baskı (instant print) karelerine girer — pencere ~4:5: yüzler ortada, üstte ve altta pay kalsın.")),
    4: dict(
        renk_sozu="faded airmail red, navy blue, aged cream parchment and muted brass",
        yazi="a handwritten fountain-pen script for the names and a vintage typewriter-style serif for the small details",
        yazi_bilgi="typewriter-style serif", yazi_vurgu="typewriter-style serif",
        corner="dried pressed wildflowers, a sprig of dried lavender, a short twine loop and two or three fictional botanical postage stamps with perforated edges (each showing only a tiny flower illustration, no numbers, no words), layered in a vintage print style",
        tip="kapak",
        zarf="a vintage airmail envelope of aged cream laid paper, about 3:2 wider than tall, bordered with diagonal faded-red and navy airmail stripes along its left, right and bottom edges and in a straight band just under the tear strip, two fictional botanical postage stamps in the top-right corner below that band (each showing only a tiny pressed-flower illustration, perforated edges, no numbers, no words), and a slim plain perforated tear strip running along the whole top edge as a clean separate band",
        zarf_kisa="airmail envelope",
        kesim_kenari="the perforation line along the lower edge of the tear strip",
        acik_kenari="The ragged torn top edge is crisp and clearly visible.",
        zarf_acik="exactly the same envelope with ONLY the slim tear strip removed along its perforation line, leaving a slightly ragged torn top edge; the two stamps, the airmail stripes, the paper, the size and the position are unchanged; the inside is not visible",
        acik_duzenle=True,
        kapanis="a small cracked burgundy-red wax seal with a smooth EMPTY center and a short pressed sprig of dried lavender tucked under it",
        kapanis_kisa="burgundy wax seal", kapanis_yeri="on the middle of the tear strip at the top edge", kapanis_olcu="1024×1024",
        acilis="On tap, the little wax seal pops off, the perforated tear strip rips away along the top edge from left to right, and the cream letter card slides up out of the envelope while a pressed flower flutters down.",
        kart_kucuk="a small aged-cream laid-paper letter card with faint laid lines and softly deckled edges, a portrait postcard-style photo window with a thin red-and-navy airmail-stripe border in its upper part and plain blank paper below",
        davet_karti="a tall aged-cream laid-paper letter sheet with a border of diagonal faded-red and navy airmail stripes, pressed dried wildflowers and one fictional botanical postage stamp (tiny flower illustration only, no text) tucked at the top-left corner, and faint inky postmark rings with wavy cancellation lines (no letters or numbers) at the bottom-right",
        bilgi_karti="a tall aged-cream laid-paper letter sheet with a thinner airmail-stripe border and only one small pressed flower at the top",
        cerceve="a large blank vintage postage-stamp shaped frame with perforated scalloped edges in aged cream paper and a fine engraved inner border line — no denomination, no country name, no numbers or lettering anywhere",
        pencere="a portrait window (about 4:5)",
        cerceve_yatay="a landscape version of the same large blank perforated postage-stamp frame in aged cream paper with the same fine engraved inner border line, no denomination or lettering",
        story="three large perforated postage-stamp frames scattered at slight angles across an old wooden writing desk, as if dropped one by one, a faint inky postmark ring (no letters or numbers) overlapping one corner",
        accent=["fictional botanical postage stamp with perforated edges showing only a tiny pressed-flower illustration (no numbers, no words)", "pressed dried forget-me-not sprig", "faint inky circular postmark ring with wavy cancellation lines, containing no letters, numbers or symbols"],
        kume="decor",
        doku="aged warm-cream parchment (#F2EADB) with very subtle stains and fibers",
        buton="a navy blue pill button with a thin cream inner line",
        foto=dict(kiz="a vintage-inspired tea-length cream lace dress", erkek="a navy wool suit with a knit tie",
                  portre="on the platform of a small old countryside train station in autumn, a vintage leather suitcase at their feet, soft golden light, no station signs, no timetables, no posters",
                  s1="a candid first-date moment laughing together over two cups of tea at a small wooden table by the window of a cozy old café, a vintage fountain pen and a few blank cream envelopes on the table",
                  s2="the proposal moment in an apple orchard in autumn at sunset",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, resting on a bundle of old letters tied with twine (no visible writing)",
                  mekan="A fictional historic red-brick former post office converted into a wedding venue in a river-valley town in autumn: tall arched windows, an orchard lawn with rows of wooden ceremony chairs and a simple arch of dried flowers, warm golden light",
                  dunya="eski kâğıt kreması, soluk posta kırmızısı, lacivert, sonbahar ışığı",
                  notu="Fotoğraflar tırtıklı pul çerçevelere (~4:5) girer: yüzler ortada, kenarlarda pay kalsın."),
        ekler=[("parts/bg_desk.png", "1024×1536", False, "Story sayfası zemini — eski yazı masası",
                "A vertical phone-screen background of an old warm walnut writing-desk top seen from directly above, fine wood grain, soft light from the top-left, calm and even, slightly darker toward the left and right edges, nothing on it (no papers, no objects, no text); the top and bottom edges match so it can repeat vertically without a seam; everything important inside the central 85% of the width.",
                "üstten düz; nesne/yazı yok; sakin; dikeyde dikişsiz")]),
    5: dict(
        renk_sozu="sunny lemon yellow, cobalt blue, bright white and fresh leaf green",
        yazi="a breezy flowing script for the names and an elegant high-contrast Didone serif",
        tip="kapak",
        zarf="a crisp bright-white watercolor-paper envelope, about 5:4 wider than tall, with a pointed V flap whose edge is gently scalloped and traced with a thin hand-painted cobalt blue line",
        zarf_kisa="white envelope",
        zarf_acik="the scalloped V flap folded fully upward, its inner side and the inside of the back showing {liner}; the front pocket empty",
        kapanis="a single small glossy lemon with two leaves and a short sprig of white lemon blossom, tied together with a thin cobalt blue ribbon in a little bow",
        kapanis_kisa="lemon tie", kapanis_yeri="tucked onto the tip of the V flap", kapanis_olcu="1024×1024",
        acilis="On tap, the lemon tie slips loose and rolls away, the white flap opens upward to reveal the blue-and-white tile liner, and the card rises while a lemon branch sways in from the top corner and a blossom drifts down.",
        kart_kucuk="a small bright-white card with a gently scalloped edge, a portrait photo window framed by a single row of tiny hand-painted cobalt-and-white tiles in its upper part and plain blank paper below",
        davet_karti="a tall bright-white card with a gently scalloped outer edge and a thin cobalt blue painted border, a watercolor lemon branch with ripe lemons, white blossoms and glossy leaves across the top, and a narrow band of blue-and-white majolica tile pattern along the bottom edge",
        bilgi_karti="a tall bright-white scalloped card with a thin cobalt blue painted border and only one small lemon sprig at the top",
        cerceve="a scalloped-edge rectangular frame made of a single row of small hand-painted cobalt-and-white majolica tiles",
        pencere="a portrait rectangular window (about 3:4)",
        cerceve_yatay="a landscape scalloped-edge rectangular frame made of a single row of small hand-painted cobalt-and-white majolica tiles, a tiny lemon sprig at one corner",
        story="three scalloped tile-framed portraits standing perfectly straight in a gentle staggered column down the page (left, right, left) like painted tile panels set into a sunlit white plaster wall, not overlapping",
        accent=["whole ripe lemon with one glossy leaf", "white lemon blossom", "glossy green lemon leaf"],
        kume="decor",
        doku="sunlit warm-white plaster (#F7F4EC) with a very soft trowel texture",
        buton="a cobalt blue pill button with white lettering",
        foto=dict(kiz="a flowing white linen sundress", erkek="a light cream linen suit with an open collar",
                  portre="on a sunlit Mediterranean terrace shaded by lemon trees, the sea far behind",
                  s1="a candid first-date moment laughing together at a small café table on a sunny piazza, two glasses of lemonade and a little vase of lemon blossoms",
                  s2="the proposal moment on a whitewashed terrace overlooking the sea at sunset, lemon trees around them",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, holding a small sprig of lemon blossoms and leaves",
                  mekan="A fictional Italian lemon-grove villa wedding venue at golden hour: a pale yellow villa with blue shutters, a stone terrace above the sea, rows of white chairs between lemon trees and an arch of lemon branches and white flowers",
                  dunya="limon sarısı, kobalt mavisi, beyaz, taze yaprak yeşili, Akdeniz güneşi",
                  notu="Fotoğraflar dilimli kenarlı çini çerçevelere (~3:4) girer: yüzler ortadaki %70'lik alanda.")),
    6: dict(
        renk_sozu="deep midnight navy, polished metallic gold, champagne and pearl",
        yazi="tall slender art deco display capitals for the names and a clean geometric sans-serif in widely spaced capitals",
        yazi_bilgi="geometric sans-serif", yazi_vurgu="geometric sans-serif in spaced capitals",
        tip="kapi",
        zarf="a tall deep-navy (#14213D) linen card-stock gatefold folder, portrait-shaped (about 2:3), closed, its two doors meeting exactly in a vertical center seam, both doors edged with fine metallic-gold art deco lines that form a stepped sunburst where they meet, the two doors' top edges together forming a stepped art deco ziggurat arch silhouette",
        zarf_kisa="navy gatefold folder",
        zarf_acik="both doors swung fully open to the left and right and lying flat, the inside of the doors lined with {liner}, the center panel faced in champagne-ivory card with a shallow deep-navy pocket across its lower third whose straight top edge is a crisp fine metallic-gold line; the pocket empty",
        kapanis="an ornate round art deco medallion clasp in polished gold with stepped geometric rays and a small pearl in the middle, no letters",
        kapanis_kisa="gold medallion clasp", kapanis_yeri="fastened over the center seam, a little above the middle", kapanis_olcu="1024×1024",
        acilis="On tap, the gold medallion clasp turns and lifts away, the two navy doors swing open to the sides like ballroom doors, and the card rises from the center pocket as a thin band of gold light sweeps across the screen.",
        kart_kucuk="a small champagne-ivory card with a fine gold-line border and a stepped art deco arch-shaped photo window outlined in fine gold lines in its upper part, plain blank card below",
        davet_karti="a tall deep-navy card with a fine metallic-gold art deco double border and stepped corners, a gold fan ornament with tiny pearls crowning the top and a smaller fan at the bottom center",
        bilgi_karti="a tall deep-navy card with a fine metallic-gold art deco double border and only small gold fans in the corners",
        cerceve="a stepped art deco arch frame in fine metallic gold lines with small corner fans",
        pencere="a tall stepped-arch window (about 3:4)",
        cerceve_yatay="a landscape stepped art deco frame in fine metallic gold lines with small fan ornaments at the four corners",
        story="three stepped gold art deco arch frames standing side by side like ballroom doorways, the middle one taller, a faint diagonal sweep of gold light crossing them",
        accent=["tiny gold-rimmed crystal champagne coupe drawn in fine gold line", "small gold art deco fan medallion", "tiny gold-and-crystal starburst sparkle"],
        kume="decor",
        doku="deep midnight navy velvet (#1B2A4A) with a fine even grain",
        buton="a navy pill button with a fine gold outline and champagne lettering",
        foto=dict(kiz="a sleek champagne satin gown with a pearl headband", erkek="a classic black tuxedo with a bow tie",
                  portre="in a glamorous 1920s-style hotel lobby with brass details and mirrored walls, warm evening light",
                  s1="a candid first-date moment laughing together at a small round table in a vintage jazz lounge, two champagne coupes, warm amber light",
                  s2="the proposal moment on a grand marble staircase with brass railings in the evening",
                  s3="close-up of their hands showing a delicate engagement ring as they clink two crystal champagne coupes",
                  mekan="A fictional grand 1920s hotel ballroom set for a wedding: mirrored walls, a gold art deco ceiling, crystal chandeliers, round tables with white linen and tall candles",
                  dunya="gece laciverti, altın, şampanya, inci; sıcak akşam ışığı",
                  notu="Fotoğraflar basamaklı deco kemer çerçevelere (~3:4) girer: yüzler ortada, başın üstünde pay kalsın (kemer tepesi kırpar).")),
    7: dict(
        renk_sozu="deep burgundy, wine red, warm cream, copper and antique gold",
        yazi="a romantic copperplate script for the names and classical engraved Roman capitals",
        tip="kapak",
        zarf="a heavy warm-cream cotton envelope with a soft felt texture, about 5:4 wider than tall, with a straight rectangular flap (not pointed)",
        zarf_kisa="cream envelope",
        zarf_acik="the rectangular flap folded fully upward, its inner side and the inside of the back showing {liner}; the front pocket empty",
        kapanis="a long burgundy velvet ribbon crossing the envelope both horizontally and vertically, tied in a soft bow at the crossing with a small antique-gold leaf charm hanging from the knot, plush velvet texture",
        kapanis_kisa="velvet ribbon", kapanis_yeri="wrapped around the envelope with the bow a little above the center", kapanis_olcu="1024×1536",
        sarili=True,
        acilis="On tap, the velvet bow unties and the ribbon slides off the envelope's sides, the rectangular flap lifts, and the card rises in warm candlelight while a single copper leaf drifts down.",
        kart_kucuk="a small heavy-cream card with an upright oval photo window framed in antique gold leaf in its upper part and plain blank paper below",
        davet_karti="a tall heavy-cream card with a thin antique-gold leaf border, a lush oil-painted cascade of burgundy dahlias, deep red roses, blackberries and copper autumn leaves across the top and a smaller cluster at the bottom-right",
        bilgi_karti="a tall heavy-cream card with a thin antique-gold leaf border and only a small sprig of burgundy buds and berries at the top",
        cerceve="an oval frame in antique gold leaf with a delicate carved bead border, hanging from a short burgundy velvet ribbon with a small bow at the top",
        pencere="an upright oval window (about 3:4)",
        cerceve_yatay="a wide landscape oval frame in antique gold leaf with a carved bead border, hanging from a short burgundy velvet ribbon bow at the top",
        pencere_yatay="a wide oval window (about 3:2)",
        story="three oval gold-leaf frames tied at different points along one long burgundy velvet ribbon swag that drapes in a gentle curve across a warm candlelit wall like a garland, each frame swaying slightly",
        accent=["copper-orange autumn maple leaf", "deep burgundy dahlia petal", "small blackberry cluster with one leaf"],
        kume="florals",
        doku="warm candlelit cream (#F4E7E1) painted-canvas texture with very soft tonal variation",
        buton="a deep burgundy pill button with a velvet sheen and cream lettering",
        foto=dict(kiz="a deep burgundy velvet long-sleeve gown", erkek="a charcoal three-piece suit with a burgundy tie",
                  portre="in an autumn garden under copper and gold trees at golden hour",
                  s1="a candid first-date moment laughing together by a crackling stone fireplace in a cozy inn, two mugs of hot cider",
                  s2="the proposal moment on a path covered in fallen autumn leaves under copper trees at sunset",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, holding a small bouquet of burgundy dahlias and blackberries",
                  mekan="A fictional ivy-covered stone manor hall in the mountains in autumn: a chapel lawn with rows of wooden chairs, an arch of burgundy dahlias and autumn leaves, copper trees and misty hills, warm golden light",
                  dunya="bordo, şarap kırmızısı, krem, bakır, mum ışığı",
                  notu="Fotoğraflar dikey oval çerçevelere girer: yüzler tam ortada; köşeler kırpılır — kenarlarda bol pay kalsın.",
                  kadraj=KADRAJ_OVAL),
        ekler=[("parts/velvet_swag.png", "1536×1024", True, "Story kurdele girlandı",
                "A single long burgundy velvet ribbon draped across about 85% of the image width in one gentle swag curve, lowest at the center, both ends finished with small soft bows, plush velvet texture, nothing hanging on it, ends not touching the image edges.",
                "tek kurdele; üstünde çerçeve yok; uçlar kenara değmiyor; gölge yok; alfa", EGRI)]),
    8: dict(
        renk_sozu="deep forest green, snowy white, winter-berry red and soft antique gold",
        liner="a snowy white (#FAFAF6) lining with a fine watercolor repeat of small forest-green pine sprigs, red winter berries and tiny antique-gold snowflakes",
        yazi="a graceful French-style script for the names and a classic Baskerville-style serif",
        tip="kapak",
        zarf="a deep forest-green (#2F5240) textured paper envelope, about 5:4 wider than tall, with a pointed V flap finished in a fine snowy-white deckled edge",
        zarf_kisa="forest green envelope",
        zarf_acik="the V flap folded fully upward, its inner side and the inside of the back showing {liner}; the front pocket empty",
        kapanis="a small bundle of a fresh pine sprig, a cedar twig and three red winter berries tied with a thin red velvet ribbon in a small bow",
        kapanis_kisa="pine-and-berry bundle", kapanis_yeri="tucked onto the tip of the V flap", kapanis_olcu="1024×1024",
        acilis="On tap, soft snow begins to fall, the pine-and-berry bundle loosens and slides away, the green flap opens upward, and the snowy white card rises as snowflakes drift across the screen.",
        kart_kucuk="a small snowy-white card with a single-pane wooden window frame painted white around a portrait photo window in its upper part, a little frost on the wooden frame's corners (not over the window), plain blank paper below",
        davet_karti="a tall snowy-white cotton card with a thin antique-gold border, a watercolor garland of pine and fir branches, juniper with blue berries, red winter berries and a small pine cone with a light dusting of snow across the top, and a smaller sprig at the bottom-left",
        bilgi_karti="a tall snowy-white card with a thin antique-gold border and only a small pine sprig with two red berries at the top",
        cerceve="a single-pane window frame of white-painted wood with soft frost crystals on the wood of its inner corners (the frost stays on the wooden frame and never covers the window opening) and a little snow resting on the bottom sill",
        pencere="a portrait window (about 3:4)",
        cerceve_yatay="a landscape single-pane window frame of white-painted wood with soft frost crystals on the wood of its inner corners (the frost stays on the wooden frame and never covers the window opening) and a little snow on the bottom sill",
        pencere_temiz=("no frost, snow, fog or reflection", "yeşil pencere köşelerinde kırağı/buğu yok"),
        story="three frosted wooden window frames in a row like the windows of a snowy mountain lodge, frost still clinging to their corners as if just wiped clear, a little snow on each sill",
        accent=["delicate white snowflake crystal", "small brown pine cone", "sprig of three red winter berries with one small leaf"],
        kume="decor",
        doku="soft wintry pale grey-green watercolor wash (#EEF2F1) with faint frost speckles",
        buton="a forest green pill button with snowy white lettering",
        foto=dict(kiz="a long ivory wool coat over an elegant ivory dress", erkek="a charcoal wool overcoat with a deep red scarf",
                  portre="in a snowy pine forest at golden hour with gentle snowfall",
                  s1="a candid first-date moment laughing together with mugs of hot cocoa by a lodge window, snow falling outside",
                  s2="the proposal moment on a snowy forest path under tall pines at dusk with soft falling snow",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, holding a small sprig of pine and red winter berries",
                  mekan="A fictional timber-and-stone mountain lodge in winter: glowing windows, snow-covered pines, a snowy clearing with rows of white chairs and an arch of evergreens and red berries, soft blue-hour light",
                  dunya="orman yeşili, kar beyazı, kırmızı kış meyvesi, sıcak dağ evi ışığı",
                  notu="Fotoğraflar tek camlı ahşap pencere çerçevelerine (~3:4) girer: yüzler ortada; köşelerde buğu kalır — kenarlarda pay."),
        ekler=[("parts/frost_overlay.png", "1024×1536", True, "Buğu katmanı (story fotoğraflarının üstü, silinerek açılır)",
                "A single sheet of fogged window-glass condensation with exactly the proportion of the portrait window of frame_portrait.png (about 3:4), filling most of the canvas: soft milky-white fog, denser toward the edges and corners with delicate feathery frost crystals, lighter and semi-transparent in the middle, straight clean edges. Only the frost itself — no wood, no frame, no green.",
                "tek katman; pencereyle aynı oran; yeşil yok; alfa (tam opak çıkarsa Claude CSS ile saydamlık verir)")]),
    9: dict(
        renk_sozu="soft lavender, dusty purple, natural linen cream and sage",
        yazi="a light airy brush script for the names and a delicate Garamond-style serif",
        corner="real pressed and dried lavender stems, small white daisies and golden wheat ears arranged as one corner cluster, photographed flat from above and pressed completely flat",
        bg="soft lavender-tinted handmade cotton paper (#F3F0F7 at the top deepening to #D9D2E8 at the bottom) photographed flat from directly above in soft daylight, faint paper fibers, calm empty center",
        tip="kese",
        zarf="a small natural cream linen drawstring pouch (#FAF8F3, fine visible weave), portrait-shaped, its mouth gathered closed at the top",
        zarf_kisa="linen pouch",
        zarf_acik="its gathered mouth loosened and opened wide into an oval, seen very slightly from above so the inside of the back wall shows {liner} as the lining; the front rim stays plain cream linen (not folded over); the pouch empty",
        kapanis="a small bundle of dried lavender stems tied with natural jute twine in a simple bow",
        kapanis_kisa="lavender-and-twine tie", kapanis_yeri="tied around the gathered neck of the pouch", kapanis_olcu="1024×1536",
        sarili=True,
        acilis="On tap, the jute twine with its lavender bundle unties and slips away, the linen pouch loosens and opens, and the card slides up out of it while dried lavender buds scatter on a summer breeze.",
        kart_kucuk="a small cream deckle-edged cotton card with a thin border of tiny pressed lavender florets around a portrait photo window in its upper part and plain blank paper below",
        davet_karti="a tall cream deckle-edged handmade cotton card with real pressed lavender stems, small white daisies and golden wheat ears laid along the left edge and across the top, pressed completely flat",
        bilgi_karti="a tall cream deckle-edged card with only one pressed lavender stem laid along the top",
        cerceve="a cream deckle-edged card with a thin border of tiny pressed lavender florets around the window",
        pencere="a portrait window (about 3:4)",
        cerceve_yatay="a landscape cream deckle-edged card with a thin border of tiny pressed lavender florets around the window",
        story="three pressed-flower cards tumbling in at loose angles as if carried by a summer breeze, not overlapping",
        accent=["pressed dried lavender stem", "pressed white daisy", "small pressed sprig of wild thyme with tiny pink-purple flowers"],
        kume="florals",
        doku="natural undyed cream linen weave (#FAF8F3), evenly lit",
        buton="a soft dusty-purple pill button with cream lettering",
        foto=dict(kiz="a flowing lavender chiffon midi dress, a straw hat in her hand", erkek="a light stone-colored linen suit with an open collar",
                  portre="in a blooming lavender field at golden hour, soft hills behind",
                  s1="a candid first-date moment laughing together at a small bistro table in a sunny stone village square, two glasses of rosé and a bunch of lavender",
                  s2="the proposal moment between the rows of a lavender field at sunset",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, holding a small bundle of lavender tied with twine",
                  mekan="A fictional Provençal stone farmhouse wedding venue at golden hour: honey-colored stone walls with lavender-blue shutters, a terrace with rows of wooden chairs facing long lavender rows, an old stone barn",
                  dunya="lavanta, krem keten, adaçayı, yaz akşamı ışığı",
                  notu="Fotoğraflar presli çiçek bordürlü dikey kartlara (~3:4) girer: yüzler ortadaki %70'lik alanda.")),
    10: dict(
        renk_sozu="deep wine, grape purple, kraft brown, olive green and warm sand",
        yazi="a flowing Italian chancery script for the names and classic Roman inscription capitals",
        tip="kapak",
        zarf="a natural kraft-brown paper envelope with visible fibers, about 5:4 wider than tall, with a deep pointed V flap whose edge is printed with a fine wine-red (#5B2C3A) engraved vine border",
        zarf_kisa="kraft envelope",
        zarf_acik="the V flap folded fully upward, its inner side and the inside of the back showing {liner}; the front pocket empty",
        kapanis="natural jute twine wrapped twice VERTICALLY around the envelope and knotted over the tip of the V flap around a small plain natural cork disc (no branding), two dried olive leaves tucked under the knot",
        kapanis_kisa="twine-and-cork tie", kapanis_yeri="wrapped vertically around the envelope, knotted at the tip of the V flap", kapanis_olcu="1024×1536",
        sarili=True,
        acilis="On tap, the twine unwinds upward off the flap tip with its cork and olive leaves, the kraft flap opens to reveal the wine-colored grape liner, and the card rises as a vine tendril curls in from the corner.",
        kart_kucuk="a small cream card with a portrait photo window shaped like a vintage wine label (rectangle with cut corners) bordered by a fine engraved double line in its upper part, plain blank paper below — a nameless label design: no winery name, no vintage year, no crest or medallion",
        davet_karti="a tall cream card shaped like an elegant vintage wine label (rectangle with cut corners) with a fine engraved double border, vintage-engraving grape clusters, vine leaves and tendrils with a soft watercolor wash across the top and a small olive branch at the bottom — a blank, nameless label: no winery name, no vintage year, no crest or medallion, no lettering of any kind",
        bilgi_karti="a tall cream cut-corner label card with a fine engraved double border and only one small vine sprig at the top — a nameless label design: no winery name, no vintage year, no crest or medallion",
        cerceve="an elegant vintage wine-label shaped frame (rectangle with cut corners) in cream with a fine engraved double border — a blank, nameless label: no winery name, no vintage year, no crest or medallion, no lettering of any kind",
        pencere="a portrait window with cut corners (about 3:4)",
        cerceve_yatay="a landscape vintage wine-label shaped frame (rectangle with cut corners) in cream with a fine engraved double border — a blank, nameless label: no winery name, no vintage year, no crest or medallion, no lettering of any kind",
        story="three wine-label shaped frames lined up side by side on a rustic oak table, not overlapping, a few grapes and a silvery olive leaf resting beside them",
        accent=["small cluster of deep purple grapes", "green vine leaf with a curling tendril", "silvery olive leaf"],
        kume="decor",
        doku="warm cream-sand paper (#F4ECE2) with a soft watercolor wash and faint fibers",
        buton="a deep wine-red pill button with cream lettering",
        foto=dict(kiz="a flowing ivory silk slip dress", erkek="a light tan linen suit with no tie",
                  portre="between vineyard rows on a sunny hillside at golden hour, cypress trees in the distance",
                  s1="a candid first-date moment laughing together at a rustic wooden table in a vineyard, two glasses of red wine and a loaf of bread",
                  s2="the proposal moment in a vineyard row under heavy grape vines at sunset",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, holding a small cluster of grapes and an olive sprig",
                  mekan="A fictional Tuscan wine estate at golden hour: a stone farmhouse with a terracotta roof, a terrace overlooking vineyard hills with rows of wooden chairs, cypress trees and a pergola heavy with grape vines",
                  dunya="şarap kırmızısı, kraft, zeytin yeşili, Toskana gün batımı",
                  notu="Fotoğraflar köşeleri kesik şarap etiketi biçimli çerçevelere (~3:4) girer: yüzler ortadaki %70'lik alanda."),
        ekler=[("parts/oak_tile.png", "1024×1024", False, "Story masası dokusu (meşe, dikişsiz)",
                "A seamless tileable square texture of a rustic honey-brown oak tabletop seen from directly above, planks running horizontally, soft even light from the top-left, low contrast, no objects, no text; the left and right edges and the top and bottom edges match so it repeats without visible seams.",
                "dikişsiz; düşük kontrast; nesne/yazı yok")]),
    11: dict(
        renk_sozu="terracotta, rust, warm sand, cream and muted ochre-sage",
        yazi="a relaxed flowing brush script for the names and a warm slab serif in spaced capitals",
        yazi_bilgi="slab serif", yazi_vurgu="italic slab serif",
        tip="kapak",
        yer=("Place it exactly where it will sit in envelope_open.png: horizontally centered, the pocket about 3:4 (taller "
             "than wide), its bottom edge at about 94% of the image height and its width about 52% of the image width; the "
             "empty upper part is left for the arch flap to lift fully into (inside the canvas, with margin) and for the "
             "card to rise into."),
        liner="a warm sand-cream (#F6EDE3) lining with a hand-painted repeat of small terracotta and rust arches and dots, flat gouache style",
        zarf="a portrait arch-shaped terracotta (#C9785B) paper pocket with a matte speckled texture, about 3:4: a tall arch-topped back panel, a front pocket covering its lower 55% with a gently curved top edge, and a rounded arch flap folded down from the top of the back panel over the front pocket",
        zarf_kisa="terracotta arch pocket",
        zarf_acik="the rounded arch flap lifted fully upward above the back panel, its inner side and the inside of the back panel showing {liner}; the front pocket (lower 55%, gently curved top edge) empty",
        kapanis="a small dried palm spear and a fluffy pampas plume crossed and tied with a thin cream ribbon",
        kapanis_kisa="pampas-and-palm tie", kapanis_yeri="tucked at the center of the arch flap's edge", kapanis_olcu="1024×1024",
        acilis="On tap, the pampas-and-palm tie slips off, the arch flap folds upward, and the card slides slowly up out of the arch like a rising sun while a pampas plume sways in from the side.",
        kart_kucuk="a small warm-sand speckled card with a tall arch-topped photo window outlined by a thin terracotta arch and a second nested sand-colored arch, a tiny pampas sprig at the arch's lower left, plain blank card below",
        davet_karti="a tall warm-sand speckled card with an arched top, two nested arch outlines in terracotta and rust, fluffy cream pampas grass, dried palm spears and bunny tails in flat gouache growing from the bottom-left and top-right",
        bilgi_karti="a tall arch-topped sand card with a single nested terracotta arch outline and only one small pampas plume at the bottom",
        cerceve="a tall arch frame of two nested hand-painted gouache bands — an outer terracotta band with a fine cream stitched-dot edge and an inner warm-sand band — with visible brush texture and a small spray of cream pampas, a bunny tail and a dried terracotta rose tucked at its lower left",
        pencere="a tall arch-topped window (about 3:4)",
        cerceve_yatay="a wide landscape frame with a gently arched top of the same two nested hand-painted gouache bands (an outer terracotta band with a fine cream stitched-dot edge and an inner warm-sand band), visible brush texture and a small spray of cream pampas, a bunny tail and a dried terracotta rose at both lower corners",
        story="three separate tall arch frames standing side by side with clear space between them, the middle one tallest and slightly in front; each frame is made of two nested bands like a small boho rainbow and has its own photo window",
        accent=["fluffy cream pampas plume", "dried palm spear", "small dried terracotta rose"],
        kume="decor",
        doku="warm sandy-cream speckled paper (#F6EDE3) with a fine grain",
        buton="a terracotta pill button with cream lettering",
        foto=dict(kiz="a flowing cream boho lace dress with bell sleeves", erkek="a light sand linen suit with a cream shirt and no tie",
                  portre="in the high desert among boulders and yucca at golden hour, warm haze",
                  s1="a candid first-date moment laughing together at a small outdoor table of an adobe café, two iced drinks and a jar of dried flowers",
                  s2="the proposal moment among desert boulders at sunset, pampas grass around them",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, holding a small bouquet of pampas, dried palm and terracotta roses",
                  mekan="A fictional desert ranch wedding venue at golden hour: an adobe building, a desert garden with cacti, a terracotta-tiled patio and rows of wooden chairs facing an arch of pampas grass and dried palm leaves, warm haze",
                  dunya="terrakota, kum, krem, pampas, sıcak çöl ışığı",
                  notu="Fotoğraflar uzun kemer çerçevelere (~3:4) girer: yüzler ortada, başın üstünde pay kalsın (kemer tepesi kırpar).")),
    12: dict(
        renk_sozu="lagoon teal, seafoam aqua, palm green, hibiscus pink and sunny gold",
        yazi="a lively flowing script for the names and a light elegant sans-serif in spaced capitals",
        yazi_bilgi="light sans-serif", yazi_vurgu="italic light sans-serif",
        tip="kapak",
        yer=("Place it exactly where it will sit in envelope_open.png: horizontally centered, about 55% of the image width "
             "and about 55% of the image height (a 2:3 portrait wallet), its bottom edge at about 92% of the image height; "
             "the empty upper ~40% of the image is left for the rounded flap to lift into and for the card to rise into."),
        zarf="a portrait travel wallet of bright white textured watercolor paper with a rounded top flap folded down over the front and a slim tan leather strap running vertically down the middle of the flap, its rounded end reaching just past the flap's edge onto the front panel",
        zarf_kisa="travel wallet",
        zarf_acik="the rounded flap, with its leather strap, lifted fully upward, its inner side and the inside of the back panel showing {liner}; the front panel forms an empty pocket",
        kapanis="a small round polished brass press-snap button with a short loop of natural twine wound around it and a single fresh white plumeria flower tucked into the twine",
        kapanis_kisa="brass snap with plumeria", kapanis_yeri="pressed onto the rounded end of the vertical leather strap, just below the center of the flap's edge", kapanis_olcu="1024×1024",
        acilis="On tap, the brass snap pops open and the plumeria tab swings away, the wallet flap flips up to reveal the palm-leaf liner, and a luggage-tag card slides up while a monstera leaf and a white plumeria drift across the screen.",
        kart_kucuk="a small bright-white card shaped like a large luggage tag (cut top corners, a reinforced eyelet hole with a short twine loop at the top), a portrait photo window in its upper part and plain blank card below",
        davet_karti="a tall bright-white watercolor card with a softly rounded top, vibrant watercolor monstera leaves, palm fronds, pink hibiscus and white plumeria spilling over the top-right and bottom-left corners",
        bilgi_karti="a tall bright-white card with a softly rounded top and only a small spray of one palm leaf and two plumeria at the top",
        cerceve="a blank vintage kraft luggage tag with cut top corners and a reinforced eyelet hole, a twine string looped through the eyelet and rising straight up about half the tag's height, completely free of printed text",
        pencere="a portrait window (about 3:4) on the tag",
        cerceve_yatay="a landscape kraft luggage tag with cut corners at its left end and a reinforced eyelet hole with a short twine string there, completely free of printed text",
        story="three kraft luggage tags hanging from their twine strings in a row at slightly different heights, gently swinging, palm leaves peeking in from the edges",
        accent=["white plumeria flower", "small glossy monstera leaf", "pink hibiscus flower"],
        kume="florals",
        doku="bright airy seafoam watercolor wash (#F2FAF8) with a fine paper grain",
        buton="a lagoon-teal pill button with white lettering",
        foto=dict(kiz="a flowing coral-pink chiffon maxi dress with a white plumeria in her hair", erkek="a white linen shirt and light sand trousers",
                  portre="beneath leaning coconut palms on a white-sand lagoon beach with lush green volcanic mountains behind, at golden hour",
                  s1="a candid first-date moment laughing together at a beach-shack table, two coconut drinks and a pink hibiscus flower",
                  s2="the proposal moment at the end of a weathered wooden pier over a turquoise lagoon at sunset",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, holding a small bouquet of white plumeria and pink hibiscus",
                  mekan="A fictional tropical resort garden set for a wedding at sunset: an open-air white pavilion with a thatched roof framed by blooming plumeria trees and tall coconut palms, rows of white chairs on a lawn, a bamboo arch with monstera leaves and white orchids, the ocean far beyond",
                  dunya="lagün turkuazı, köpük yeşili, palmiye yeşili, hibiskus pembesi, gün batımı",
                  notu="Fotoğraflar bavul etiketi biçimli çerçevelere (~3:4) girer: yüzler ortada, üstte ve altta pay kalsın.")),
    13: dict(
        renk_sozu="moss green, fern green, aged cream parchment and warm lantern gold",
        yazi="a whimsical calligraphic script for the names and an old-style storybook serif",
        tip="kitap",
        zarf="an antique closed storybook seen straight from the front: a deep moss-green cloth cover with an embossed gold floral border of ferns and tiny mushrooms and an empty oval cartouche in the center (no title, no letters), slightly worn corners, the spine on the left",
        zarf_kisa="storybook",
        zarf_acik="the cover swung fully open to the left and lying flat, its inside lined with {liner}; the first page on the right is blank aged-cream paper with soft foxing (no text) and sits exactly where the closed cover was",
        kapanis="a small antique brass book clasp with a leaf-shaped engraving, no letters",
        kapanis_kisa="brass book clasp", kapanis_yeri="hooked over the cover's right edge at mid-height, holding the book shut", kapanis_olcu="1024×1024",
        acilis="On tap, the brass clasp unhooks and swings away, the moss-green cover swings open to the left like a storybook, the first page turns, and the card rises from the page while tiny fireflies glow up around it.",
        kart_kucuk="a small aged-cream book-page card with soft foxing and deckled edges, a portrait photo window held by four vintage black photo-corner mounts in its upper part, plain blank paper below",
        davet_karti="a tall aged-cream storybook page with soft foxing, deckled edges and a fine ink rule border, a classic storybook ink-and-watercolor vignette of ferns, moss, ivy and small toadstool mushrooms with a few glowing fireflies along the top and in the bottom corners",
        bilgi_karti="a tall aged-cream storybook page with a fine ink rule border and only a small ivy sprig with two tiny mushrooms at the top",
        cerceve="an aged-cream book-page card with soft foxing on which four vintage black photo-corner mounts hold the picture rectangle",
        pencere="a portrait window (about 3:4) held by the four photo corners",
        cerceve_yatay="a landscape aged-cream book-page card on which four vintage black photo-corner mounts hold the picture rectangle",
        story="a single tall aged-cream storybook page (the same page as the details card) with three photo-cornered pictures mounted down it in a gentle zigzag — left, right, left — a tiny ivy sprig beside each, as if just revealed by a turning page",
        accent=["small firefly drawn in fine ink and watercolor with a softly lit pale-gold abdomen (no halo or glow outside its body — the website adds the glow)", "small toadstool mushroom with a muted russet-brown cap", "curled young fern frond"],
        kume="decor",
        doku="dreamy misty pale moss-green watercolor wash (#EDEFE3) with a faint paper grain",
        buton="a moss-green pill button with a thin gold line and cream lettering",
        foto=dict(kiz="a flowing cream tulle gown with a crown of tiny white flowers", erkek="a moss-green tweed suit with a cream shirt",
                  portre="in a misty old-growth forest among ferns and moss at golden hour, soft rays of light",
                  s1="a candid first-date moment laughing together while reading an old book on a moss-covered log in the forest (no visible text)",
                  s2="the proposal moment in a forest clearing ringed with glowing lanterns and ferns at dusk",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, holding a small bouquet of ferns, moss and tiny white flowers",
                  mekan="A fictional enchanted forest glen wedding venue at dusk: a mossy clearing among tall evergreen trees, rows of wooden benches, glowing lanterns hanging from branches and a rustic arch of ferns and ivy",
                  dunya="yosun yeşili, eğrelti, eski kâğıt kreması, fener altını",
                  notu="Fotoğraflar fotoğraf köşelikli dikey kartlara (~3:4) girer: yüzler ortada; köşeler köşeliklerle hafifçe örtülür.")),
    14: dict(
        renk_sozu="ivory, champagne, pearl white, soft taupe and antique silver-gold",
        yazi="a refined formal copperplate script for the names and a high-contrast Bodoni-style serif",
        tip="kapi",
        zarf="a tall ivory satin-finish gatefold folder (#FFFDF8), portrait-shaped (about 2:3), closed, its two doors meeting in a vertical center seam, each door edged with a hair-thin antique silver-gold line, both doors covered with a delicate original ivory lace overlay whose scalloped edge stops just short of the seam, leaving a hair-thin straight plain-ivory gap exactly on the vertical center line",
        zarf_kisa="lace gatefold folder",
        zarf_acik="both lace-covered doors swung fully open to the left and right and lying flat, the inside of the doors lined with {liner}, the ivory satin center panel with a shallow pocket along its lower edge; the pocket empty",
        kapanis="an elegant pearl clasp: a cluster of five lustrous white pearls on a small antique silver-gold setting with a short loop of tiny pearls, no letters",
        kapanis_kisa="pearl clasp", kapanis_yeri="fastened over the center seam at mid-height", kapanis_olcu="1024×1024",
        acilis="On tap, the pearl clasp unhooks and slips away, the lace-covered doors part slowly to the sides like a lifted veil, and the card rises from the satin center while a strand of tiny pearls glints.",
        kart_kucuk="a small ivory satin card with an upright oval photo window in carved ivory-white relief (tiny roses and scrolls only, no faces or figures) edged by a fine string of tiny pearls in its upper part, plain blank card below",
        davet_karti="a tall ivory satin-finish card with a hair-thin antique silver-gold edge, scalloped lace borders along the top and bottom edges, a cluster of white garden roses and a draped strand of small pearls at the top-left corner, photorealistic",
        bilgi_karti="a tall ivory satin-finish card with a hair-thin antique silver-gold edge and only a narrow scalloped lace edge along the top",
        cerceve="an upright oval frame of carved ivory-white relief (tiny roses and scrolls only — no faces, figures or profile silhouettes) with a fine string of tiny pearls around the edge, hanging from a single fine strand of tiny pearls that rises straight up from the top of the frame to the top margin of the image",
        pencere="an upright oval window (about 3:4)",
        cerceve_yatay="a wide landscape oval frame of carved ivory-white relief (tiny roses and scrolls only — no faces, figures or profile silhouettes) with a fine string of tiny pearls around the edge",
        pencere_yatay="a wide oval window (about 3:2)",
        story="three carved ivory-white oval frames, each hanging from a fine strand of pearls, descending to slightly different heights",
        accent=["single lustrous teardrop pearl drop on a tiny antique silver-gold cap", "white garden rose petal", "tiny ivory satin bow"],
        kume="decor",
        doku="soft pearly ivory satin (#FAF7F2) with a very subtle sheen",
        buton="a soft champagne-taupe pill button with ivory lettering",
        foto=dict(kiz="an ivory satin midi dress with a single strand of pearls", erkek="a navy suit with a white pocket square",
                  portre="in a walled white-rose garden beside a small white stone chapel at golden hour",
                  s1="a candid first-date moment laughing together at a garden tea table with fine china teacups and white roses",
                  s2="the proposal moment in a formal rose garden beside a stone fountain at sunset",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, resting on ivory lace beside a strand of pearls",
                  mekan="A fictional small white stone chapel with a tall arched wooden door and a round rose window, a garden aisle lined with white garden roses and rows of white chairs leading to the door, soft golden light (not resembling any real building)",
                  dunya="fildişi, şampanya, inci beyazı, yumuşak taupe",
                  notu="Fotoğraflar dikey oval oyma fildişi çerçevelere girer: yüzler tam ortada, kenarlarda bol pay kalsın.",
                  kadraj=KADRAJ_OVAL)),
    15: dict(
        renk_sozu="soft blossom pink, dove grey, warm white and dark twig brown",
        yazi="a delicate formal script for the names and a refined high-contrast display serif",
        tip="kapak",
        zarf="a soft dove-grey (#BDB5BA) mulberry-paper envelope with fine fibers, about 5:4 wider than tall, with a softly curved (rounded) flap finished in a fine deckled white edge",
        zarf_kisa="dove-grey envelope",
        zarf_acik="the rounded flap folded fully upward, its inner side and the inside of the back showing {liner}; the front pocket empty",
        kapanis="a small cluster of three pink cherry blossoms on a short dark brown twig",
        kapanis_kisa="cherry blossom twig", kapanis_yeri="tucked onto the edge of the curved flap at its center", kapanis_olcu="1024×1024",
        acilis="On tap, the blossom twig loosens and drifts off, the curved grey flap lifts, and the card rises as a gentle flurry of cherry petals swirls up and floats across the screen.",
        kart_kucuk="a small warm-white mulberry-paper card with a perfectly round photo window ringed by a slender dark-brown cherry branch bent into a full circle, blossoming with pale pink flowers and buds over its upper third, with a hair-thin brushed-gold inner ring, plain blank paper below",
        davet_karti="a tall warm-white mulberry-paper card with a thin brushed-gold border and softly deckled edges, a lush fine ink-and-watercolor cherry blossom branch heavy with blossoms and buds arching from the top-left across the whole top edge and down the right side, a smaller blossoming branch rising from the bottom-left, a few loose petals",
        bilgi_karti="a tall warm-white mulberry-paper card with a thin brushed-gold border and only a short blossom twig at the top-left corner",
        cerceve="a round frame made of a slender dark-brown cherry branch bent into a full circle, blossoming with pale pink flowers and buds over its upper third, with a hair-thin brushed-gold inner ring",
        pencere="a perfectly round window",
        cerceve_yatay="a wide oval version of the same blossoming cherry-branch frame with the hair-thin brushed-gold inner ring",
        pencere_yatay="a wide oval window (about 3:2)",
        story="three round blossoming cherry-branch frames of different sizes drifting down the page in a gentle diagonal like falling petals",
        accent=["pale pink cherry blossom petal", "five-petal pink cherry blossom", "small pink cherry bud on a tiny twig"],
        kume="florals",
        doku="very soft pale blush-white mulberry paper (#FBF5F6) with fine fibers",
        buton="a dusty mauve-rose pill button with white lettering",
        foto=dict(kiz="a soft blush-pink tulle midi dress", erkek="a dove-grey suit with a pale pink tie",
                  portre="under blooming cherry blossom trees in a park in spring, soft daylight, pink petals in the air",
                  s1="a candid first-date moment laughing together at a small café table in spring, two cups of tea and a sprig of cherry blossoms",
                  s2="the proposal moment on a path under an arch of blooming cherry trees with petals falling",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, holding a small cherry blossom branch",
                  mekan="A fictional spring garden wedding venue: a small open white garden pavilion with a simple pitched roof (not a real landmark, no domed monument) beside a reflecting pond, a walk lined with blooming cherry trees, rows of white chairs, soft daylight",
                  dunya="kiraz çiçeği pembesi, güvercin grisi, sıcak beyaz",
                  notu="Fotoğraflar yuvarlak çerçevelere girer: yüzler tam ortadaki dairede, kenarlarda bol pay kalsın.",
                  kadraj=KADRAJ_DAIRE)),
    16: dict(
        renk_sozu="sunflower yellow, mustard, warm kraft brown, barn-wood brown and leaf green",
        yazi="a bold friendly brush script for the names and a sturdy classic serif",
        tip="kapak",
        zarf="a rustic kraft-brown paper envelope with visible fibers and softly torn deckled edges, about 5:4 wider than tall, with a square-cut flap with rounded corners",
        zarf_kisa="kraft envelope",
        zarf_acik="the rounded-corner square flap folded fully upward, its inner side and the inside of the back showing {liner}; the front pocket empty",
        kapanis="a wide mustard-yellow gingham fabric ribbon wrapped horizontally around the envelope and finished in a big soft bow at the center, with a small sunflower head tucked into the knot",
        kapanis_kisa="gingham ribbon", kapanis_yeri="wrapped horizontally around the envelope with the bow at the center", kapanis_olcu="1024×1536",
        sarili=True,
        acilis="On tap, the gingham bow tugs loose and the ribbon slides off with its little sunflower, the kraft flap flips open, and the card slides out onto the weathered barn-wood tabletop (barnwood.png) while a few sunflower petals tumble.",
        kart_kucuk="a small cream cotton card with a portrait photo window edged by a thin mustard gingham ribbon trim in its upper part, plain blank paper below",
        davet_karti="a tall cream cotton card with a thin mustard gingham ribbon band across the top edge, a realistic watercolor spray of sunflowers, wheat stalks and white field daisies along the bottom-left and a single sunflower at the top-right",
        bilgi_karti="a tall cream cotton card with a thin mustard gingham ribbon band across the top edge and only a small sunflower-and-wheat sprig at the top",
        cerceve="a vintage deckle-edged photo print with a narrow cream scalloped border, warm-toned like an old farmhouse snapshot, hanging from a small natural wooden clothespin at its top center",
        pencere="a nearly square portrait window (about 4:5)",
        cerceve_yatay="a landscape vintage deckle-edged photo print with a narrow cream scalloped border, held at its top center by a small wooden clothespin clipped to a short length of jute twine",
        story="three vintage deckle-edged photo prints pegged one by one with small wooden clothespins onto a gently sagging jute twine line against a weathered barn-wood wall",
        accent=["bright yellow sunflower petal", "small sunflower head without a stem", "golden wheat ear"],
        kume="florals",
        doku="warm golden-cream watercolor paper (#FBF5E8) with a faint grain",
        buton="a mustard-yellow pill button with dark brown lettering",
        foto=dict(kiz="a white cotton eyelet sundress with tan boots", erkek="a light blue chambray shirt with tan suspenders",
                  portre="in a blooming sunflower field at golden hour",
                  s1="a candid first-date moment laughing together on the tailgate of an old farm truck, two glass bottles of lemonade, no license plate, no badges or logos on the truck",
                  s2="the proposal moment on a mown grass path between tall rows of a sunflower field at sunset, both fully visible",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, holding a small bouquet of sunflowers and wheat",
                  mekan="A fictional big red barn wedding venue in the countryside at golden hour: a red barn with open doors and string lights, rows of wooden benches on the grass beside a sunflower field, a few hay bales",
                  dunya="ayçiçeği sarısı, hardal, kraft, ahşap kahvesi, altın saat",
                  notu="Fotoğraflar tırtıklı kenarlı eski baskılara (~4:5) girer: yüzler ortada."),
        ekler=[("parts/twine_line.png", "1536×1024", True, "Story ipi (fotoğraflar mandalla asılır)",
                "A single natural jute twine line stretched horizontally across about 85% of the image width with a gentle sag, realistic fibers, nothing hanging on it, both ends neatly finished and not touching the image edges (the twine hangs in a shallow curve, lowest at the center).",
                "tek ip; üstünde bir şey yok; uçlar kenara değmiyor; gölge yok; alfa", EGRI),
               ("parts/barnwood.png", "1024×1536", False, "Ahşap masa/duvar (açılış + story)",
                "A weathered pale barn-wood surface seen straight on: wide sun-bleached planks running horizontally with soft grain and a few nail holes, warm golden-hour light from the top-left, calm and low in contrast, seamless from top to bottom so it can repeat vertically, no objects, no flowers, no text.",
                "yatay tahtalar; dikeyde dikişsiz; düşük kontrast; nesne/yazı yok")]),
    17: dict(
        renk_sozu="deep emerald green, polished gold, white Carrara marble and ivory",
        liner="a softly polished gold-foil liner with a fine emerald-green line-art pattern of ferns and leaves",
        corner="thin metallic-gold line-art ferns, monstera leaves and eucalyptus sprigs drawn as fine outlines without fill",
        yazi="ornate decorative Roman capitals for the names and an elegant old-style serif",
        tip="kapak",
        zarf="a deep jewel-emerald (#0F4D3A) envelope with a velvet sheen, about 5:4 wider than tall, with a long curved bell-shaped (ogee) flap reaching just below the center, the flap edge, the pocket's top edges and all four outer edges traced with a thin polished-gold line",
        zarf_kisa="emerald envelope",
        zarf_acik="the bell-shaped flap folded fully upward, its inner side and the inside of the back showing {liner}; the front pocket empty, its top edges traced with a thin polished-gold line",
        kapanis="a round polished-gold wax-style seal with a smooth EMPTY center and a fine leaf border, no letters",
        kapanis_kisa="gold seal", kapanis_yeri="pressed onto the lowest point of the bell-shaped flap", kapanis_olcu="1024×1024",
        acilis="On tap, the gold seal lifts away with a glint, the emerald flap opens upward, thin gold botanical lines draw themselves across the screen, and the marble card rises from the pocket.",
        kart_kucuk="a small white Carrara-marble-printed card (thin card stock, no stone thickness) with soft grey veins, a slim polished-gold frame around a portrait photo window in its upper part and plain marble below",
        davet_karti="a tall white Carrara-marble-printed card (thin card stock, no stone thickness) with soft thin grey veins and a slim polished-gold border, elegant thin metallic-gold line-art ferns, monstera and eucalyptus growing from the top-left and bottom-right corners",
        bilgi_karti="a tall white Carrara-marble-printed card (thin card stock, no stone thickness) with a slim polished-gold border and only one thin gold line-art fern sprig at the top",
        cerceve="a slim polished-gold picture frame with a fine inner bevel",
        pencere="a portrait window (about 3:4)",
        cerceve_yatay="a landscape slim polished-gold picture frame with a fine inner bevel",
        story="a gallery wall: three slim polished-gold frames of the same 3:4 shape in three sizes (large, medium, small) hung asymmetrically on the emerald velvet page",
        accent=["thin gold line-art fern leaf", "small gold line-art monstera leaf", "small gold line-art eucalyptus sprig"],
        kume="decor",
        doku="deep emerald-green velvet (#165C46) with a soft even sheen",
        buton="a polished-gold pill button with emerald lettering",
        foto=dict(kiz="an emerald-green satin evening gown", erkek="a black tuxedo with an emerald velvet bow tie",
                  portre="on the terrace of a grand lakeside estate at golden hour",
                  s1="a candid first-date moment laughing together in a marble gallery hall, each holding a glass of champagne",
                  s2="the proposal moment in a formal estate garden beside a lake at sunset",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, resting on emerald velvet",
                  mekan="A fictional lakeside country estate set for a black-tie wedding: a grand neoclassical house with a marble gallery, a lawn sloping to a lake with rows of white chairs, tall clipped hedges",
                  dunya="zümrüt yeşili, altın, beyaz mermer, fildişi",
                  notu="Fotoğraflar ince altın çerçevelere (~3:4) girer (galeri duvarı): yüzler ortadaki %70'lik alanda.")),
    18: dict(
        renk_sozu="poppy red, cornflower blue, daisy white, meadow green and soft cream",
        yazi="a casual flowing script for the names and a graceful book serif",
        tip="kilif",
        zarf="a portrait sleeve of translucent frosted vellum, milky white and mostly opaque (about 80%), slightly larger than the soft-white cotton card inside it, the card's colorful colored-pencil wildflower border showing faintly through the vellum",
        zarf_parca=("a portrait sleeve of frosted vellum, milky white and evenly semi-opaque, with softly folded side edges and an "
                    "open top edge, completely EMPTY: no card inside and nothing showing through (the website places "
                    "card_small.png behind it). If real partial transparency is not possible, render it solid milky white "
                    "with a soft frosted texture; Claude sets the opacity in CSS"),
        zarf_kisa="vellum sleeve",
        zarf_acik="the same empty frosted sleeve, its open top edge gently flared",
        kapanis="a small round cream paper sticker label with a deckled edge, showing a tiny colored-pencil poppy, cornflower and daisy, no text",
        kapanis_kisa="wildflower label", kapanis_yeri="centered horizontally on the front of the sleeve, just below its open top edge", kapanis_olcu="1024×1024",
        acilis="On tap, the wildflower label peels away, the frosted vellum sleeve slides down off the card and fades, and the card lifts up as a few colored-pencil petals flutter across the screen.",
        kart_kucuk="a small soft-white cotton card with a portrait photo window in its upper part and a colorful colored-pencil wildflower border (poppies, cornflowers, daisies) along its lower edge, the area between blank",
        davet_karti="a tall soft-white cotton card with detailed colored-pencil wildflowers — red poppies, blue cornflowers, white daisies, purple lupines and grasses — growing up from the bottom edge and a few stems along the top-right",
        bilgi_karti="a tall soft-white cotton card with only a small spray of a poppy and a cornflower at the bottom-left",
        cerceve="a soft-white cotton photo card with a slim margin around the window and a thin colored-pencil wildflower border along its lower edge",
        pencere="a portrait window (about 3:4)",
        cerceve_yatay="a landscape soft-white cotton photo card with a slim margin around the window and a thin colored-pencil wildflower border along its lower edge",
        story="three portrait photo cards in a gentle row, each half covered by a frosted vellum sheet printed with white wildflower silhouettes that is lifting away from the bottom to reveal the photo",
        accent=["red poppy petal", "small blue cornflower head", "white field daisy"],
        kume="florals",
        doku="bright airy cream cotton paper (#FBFAF4) with a fine grain",
        buton="a cornflower-blue pill button with white lettering",
        foto=dict(kiz="a flowing white cotton dress with tiny embroidered flowers", erkek="a light grey-blue linen suit with no tie",
                  portre="in a sunny wildflower meadow full of poppies and cornflowers at golden hour",
                  s1="a candid first-date moment laughing together on a picnic blanket in a meadow, a basket of strawberries and a jar of wildflowers",
                  s2="the proposal moment in a wildflower meadow at sunset",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, holding a loose bouquet of poppies, cornflowers and daisies",
                  mekan="A fictional farm wedding venue in summer: a white farmhouse and a garden barn, a wildflower meadow with rows of wooden chairs and a simple arch of wildflowers, a white tent in the distance",
                  dunya="gelincik kırmızısı, peygamber çiçeği mavisi, papatya beyazı, çayır yeşili",
                  notu="Fotoğraflar dikey kartlara (~3:4) girer, üstündeki vellum kalkar: yüzler ortadaki %70'lik alanda."),
        ekler=[("parts/vellum_overlay.png", "1024×1536", True, "Vellum örtü (story fotoğraflarının üstü)",
                "A single sheet of translucent frosted vellum paper with exactly the size and proportion of the portrait photo card (frame_portrait.png), milky white and mostly opaque (about 80%), soft white wildflower silhouettes printed along its edges, a plain frosted center and straight clean edges.",
                "tek yaprak; frame_portrait ile aynı oran; kenarda beyaz çiçek siluetleri; alfa (tam opak çıkarsa Claude CSS ile saydamlık verir)")]),
    19: dict(
        renk_sozu="near-black, deep burgundy, plum, antique gold and candlelight amber",
        yazi="elegant high-contrast small capitals for the names and a refined classical small-capital serif",
        corner="dark jewel-toned florals — deep crimson and garnet roses, plum and aubergine peonies, a few midnight-blue delphiniums, dark berries and dusky leaves — in a Dutch still-life oil painting style",
        liner="a deep plum-burgundy (#4A2335) liner with a painterly pattern of dark red roses and dusky leaves",
        ortak=("Premium luxury wedding stationery quality, real paper and material textures, dramatic chiaroscuro light from "
               "the upper left as in a Dutch still life, rich, moody and intimate."),
        tip="kapak",
        zarf="a smooth matte black paper envelope with a subtle fine texture, about 5:4 wider than tall, with a pointed V flap, the flap and the pocket's diagonal edges finished with a hair-thin antique-silver edge that catches the light",
        zarf_kisa="black envelope",
        zarf_acik="the V flap folded fully upward, its inner side and the inside of the back showing {liner}, a soft warm golden sheen painted on the inside of the empty pocket",
        kapanis="a realistic antique silver wax seal with a smooth EMPTY center and a thin raised ring, no letters",
        kapanis_kisa="silver wax seal", kapanis_yeri="pressed onto the tip of the V flap", kapanis_olcu="1024×1024",
        acilis="On tap, the silver seal cracks and falls away, the black flap opens slowly, warm golden candlelight spills out from inside, and the card rises out of the darkness into the glow.",
        kart_kucuk="a small matte black card with a fine antique-gold inner line and a portrait photo window framed by a slim carved gilded baroque border in its upper part, plain black below",
        davet_karti="a tall matte black card with a fine antique-gold inner border, dark moody oil-painted deep red and burgundy roses, plum peonies, dark berries and dusky leaves spilling over the top-left and bottom-right corners, glowing richly against the black as in a Dutch still life lit from the upper left",
        bilgi_karti="a tall matte black card with a fine antique-gold inner border and only a small sprig of one dark red rose bud and berries at the top",
        cerceve="an ornate carved gilded baroque picture frame in antique gold",
        pencere="a portrait window (about 3:4)",
        cerceve_yatay="a landscape ornate carved gilded baroque picture frame in antique gold",
        story="three ornate gilded baroque frames on a black wall in a staggered salon arrangement, a soft warm candle glow on the wall behind each frame (the frames themselves lit from the upper left)",
        accent=["deep red rose petal", "small dark plum with one leaf", "small dark velvet-plum butterfly with antique-gold wing edges"],
        kume="florals",
        doku="near-black matte painted texture (#1C1A21) with very subtle variation",
        buton="an antique-gold pill button with black lettering",
        foto=dict(kiz="a deep plum velvet gown", erkek="a black velvet tuxedo jacket with a black bow tie",
                  portre="in a dark romantic garden at night lit by candles and warm string lights",
                  s1="a candid first-date moment laughing together at a candlelit table in a moody wine bar, two glasses of red wine and dark roses",
                  s2="the proposal moment on a moonlit garden path lined with candles in glass lanterns",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, holding a single dark red rose",
                  mekan="A fictional Victorian glasshouse conservatory at night set for a wedding: wrought iron and glass, hanging candles and lanterns, lush dark foliage, rows of chairs, warm golden light against the night sky",
                  dunya="gece siyahı, bordo, erik moru, antik altın, mum ışığı",
                  notu="Fotoğraflar barok yaldızlı çerçevelere (~3:4) girer: yüzler ortadaki %70'lik alanda; tonlar sıcak ve karanlık.")),
    20: dict(
        renk_sozu="ocean blue, sea-glass aqua, warm sand, white foam and soft brass",
        yazi="a breezy handwritten script for the names and a classic book serif",
        tip="kapak",
        zarf="a soft sand-colored textured paper envelope with tiny speckles, about 5:4 wider than tall, with a pointed V flap whose two edges are cut in a gentle wave like a shoreline",
        zarf_kisa="sand envelope",
        zarf_acik="the wave-edged V flap folded fully upward, its inner side and the inside of the back showing {liner}; the front pocket empty",
        kapanis="a small pale-pink scallop seashell resting on a short loop of natural twine",
        kapanis_kisa="scallop shell", kapanis_yeri="resting on the point of the wave-edged V flap", kapanis_olcu="1024×1024",
        acilis="On tap, the watercolor wave (wave.png) sweeps across the screen and carries the seashell and twine away, the wave-edged flap lifts, and the card rises like the incoming tide.",
        kart_kucuk="a small sand-colored speckled card with a perfectly round porthole-style photo window ringed in aged brass with small rivets in its upper part, plain blank card below",
        davet_karti="a tall soft-white textured card with a gently wavy top edge, ocean-watercolor waves with thin white foam lines along the bottom, seashells, a starfish and pieces of sea glass at the bottom-right and a small tuft of dune grass at the top-left",
        bilgi_karti="a tall soft-white textured card with a gently wavy top edge and only a narrow watercolor wave along the bottom",
        cerceve="a round brass ship porthole frame with small rivets and an aged patina",
        pencere="a perfectly round window",
        cerceve_yatay="a wide oval brass porthole-style frame with small rivets and an aged patina",
        pencere_yatay="a wide oval window (about 3:2)",
        story="three round brass portholes stacked down the page in a gentle zig-zag (left, right, left) on the soft sea-mist page, a few shells and sea glass between them",
        accent=["small white spiral moon-snail shell", "piece of frosted aqua sea glass", "small sand-colored starfish"],
        kume="decor",
        doku="soft sea-mist watercolor wash (#F4F8F9) with a fine sand grain",
        buton="an ocean-blue pill button with white lettering",
        foto=dict(kiz="a flowing white chiffon dress", erkek="a light blue linen suit with no tie, sleeves rolled",
                  portre="on a sandy dune path beside a weathered split-rail fence and blue hydrangeas at golden hour, the ocean behind",
                  s1="a candid first-date moment laughing together at a weathered picnic table on a harbor dock, two iced teas and a paper basket of fried clams, sailboats softly blurred behind",
                  s2="the proposal moment on the beach near a white lighthouse at sunset",
                  s3="close-up of their hands intertwined showing a delicate engagement ring, holding a small scallop shell and a piece of sea glass",
                  mekan="A fictional seaside wedding venue at golden hour: a weathered shingle boathouse, a dune lawn with rows of white chairs facing the ocean, a white lighthouse in the distance and a driftwood arch with white flowers",
                  dunya="okyanus mavisi, deniz camı, kum, köpük beyazı",
                  notu="Fotoğraflar yuvarlak lomboz çerçevelere girer: yüzler tam ortadaki dairede, kenarlarda bol pay kalsın.",
                  kadraj=KADRAJ_DAIRE),
        ekler=[("parts/wave.png", "1536×1024", True, "Açılış dalgası",
                "A single soft ocean-watercolor wave seen from the side: a wide band of translucent aqua and ocean-blue water whose top edge curls into a crest of white foam lace, spanning about 90% of the image width, its lower edge softly feathered. Only this one wave, no shells, no sand, no sky.",
                "tek dalga; köpük üst kenarda; alt kenar yumuşak; gölge yok; alfa", EGRI)]),
}

WEB_ALANLAR = ["renk_sozu", "yazi", "tip", "zarf", "zarf_kisa", "zarf_acik", "kapanis", "kapanis_kisa", "kapanis_yeri",
               "kapanis_olcu", "acilis", "kart_kucuk", "davet_karti", "bilgi_karti", "cerceve", "pencere", "cerceve_yatay",
               "story", "accent", "kume", "doku", "buton", "foto"]
FOTO_ALANLAR = ["kiz", "erkek", "portre", "s1", "s2", "s3", "mekan", "dunya", "notu"]


def cumartesi(iso):
    d = date.fromisoformat(iso)
    return d + timedelta(days=(5 - d.weekday()) % 7)


def story(t):
    """Kaydın `story` bloğu (`STORY` tablosundan)."""
    if t["no"] not in STORY:
        raise KeyError(f"tasarım {t['no']:02d} için STORY kaydı yok")
    intro, basliklar = STORY[t["no"]]
    return {"intro": intro, "items": [{"caption": c} for c in basliklar]}


def content(t):
    a, af, b, bf = t["cift"]
    mekan, sehir, bolge, tz = t["mekan"]
    d = cumartesi(t["tarih"])
    tz_saat = list(t.get("saatler") or ("16:00", "17:00", "18:30"))
    return {
        "record_kind": "demo", "event_type": "wedding", "locale": "en-US",
        "partners": [{"display_name": a, "full_name": af}, {"display_name": b, "full_name": bf}],
        "name_display": f"{a} & {b}", "initials": f"{a[0]}&{b[0]}",
        "host_line": "Together with their families",
        "date": d.isoformat(), "ceremony_time": tz_saat[0], "timezone": tz,
        "venue": {"name": mekan, "city": sehir, "region": bolge, "country": t.get("ulke", "USA"), "address": None},
        "schedule": [{"label": l, "time": s, "location": y} for l, s, y in
                     zip(["Ceremony", "Cocktail Hour", "Reception"], tz_saat, t["yerler"])],
        "dress_code": t["kiyafet"],
        "rsvp": {"deadline": (d - timedelta(days=42)).isoformat(), "method": None},
        "urls": {k: None for k in ["website", "rsvp_form", "map", "registry", "accommodation"]},
        "media": {"hero_portrait": None, "memory_photos": [], "couple_clip": None, "venue_image": None},
        "optional_blocks": {"our_story": True, "countdown": True, "dress_code": True, "registry": True,
                            "travel_stay": True, "faq": False, "guest_policy": False},
        "story": story(t),
    }


def assets(t):
    """(dosya, ölçü, şeffaf, başlık, prompt, kontrol)"""
    p, stil = t["p"], STIL[t["teknik"]]
    out = [
        ("textures/background.png", "1024×1536", False, "Video arka planı",
         f"Vertical background for a romantic wedding invitation video: {p['bg']}. Calm and elegant. Completely empty in the middle third — no objects, no flowers, no text. Even soft light.",
         "ortası boş; nesne/yazı yok"),
        ("textures/paper.png", "1024×1024", False, "Kart/zarf kağıt dokusu",
         f"Seamless tileable texture of {p['paper']}, evenly lit flat top-down scan, no shadows, no vignette, no folds, no objects, no text, square.",
         "düz ve eşit ışık; tekrarlanabilir"),
        ("textures/liner.png", "1024×1024", False, "Zarf astarı / desen",
         f"Seamless tileable pattern: {p['liner']}. Printed-on-paper look with faint grain, evenly lit, flat top-down, elegant and not busy, no text, no logos, square.",
         "kesintisiz tekrar; kalabalık değil"),
        ("decor/closure.png", "1024×1024", True, "Kapanış elemanı (mühür/kurdele/toka)",
         f"{p['closure']} Viewed straight from above, centered with generous empty space around it, soft natural light from the top-left. Completely free of letters, monograms, symbols or text. Transparent background PNG.",
         "harf/sembol yok; gerçek şeffaf zemin; kesilmemiş"),
        ("decor/corner.png", "1024×1024", True, "Büyük köşe kompozisyonu",
         f"{stil[0].upper() + stil[1:]} corner arrangement for a classic romantic wedding invitation: {p['decor_main']}. It grows from the TOP-LEFT corner and fans diagonally toward the center, leaving the bottom-right two thirds of the square empty. Refined, airy, not crowded. Transparent background PNG, no text.",
         "sol üstten başlıyor; sağ alt boş; şeffaf"),
        ("decor/divider.png", "1536×1024", True, "Küçük yatay ayırıcı",
         f"A small horizontal decorative divider in {stil} style: {p['decor_small']}, centered, about 70% of the image width, lots of empty space around it. Transparent background PNG, no text.",
         "köşe kompozisyonuyla aynı stil; yatay ve ortalı"),
        ("decor/photo_frame.png", "1024×1536", True, "Fotoğraf çerçevesi",
         f"A single empty photo frame for a wedding invitation, viewed straight on: {p['frame']}. The opening inside the frame is completely empty and transparent (no photo, no fill). The frame is centered, not cropped, with empty space around it. Transparent background PNG, no text.",
         "iç kısım boş ve şeffaf; çerçeve kesilmemiş"),
    ]
    for dosya, olcu, seffaf, prompt in p["extras"]:
        out.append((dosya, olcu, seffaf, "Tasarıma özel parça", prompt, "yazı/sembol yok" + ("; şeffaf" if seffaf else "")))
    return out


def prompts_md(t):
    k = f"collections/{t['klasor']}"
    r = t["renk"]
    lines = [
        f"# GPT görsel istekleri — Tasarım {t['no']:02d} · {t['ad']}", "",
        "> **Instructions for GPT:** Generate every image below in order. Use each English prompt exactly as written,",
        "> follow its checklist, and save each file with the exact file name and folder shown under \"Kaydet\".",
        "> No text, letters, numbers, logos or watermarks in any image. Keep ONE consistent illustration style across this file.", "",
        "Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `tools/katalog.py` (elle düzenleme yerine",
        f"katalogu değiştirip yeniden üret). Tasarım özeti: `{k}/DESIGN_BRIEF.md`. Görev: `gorevler/G2{t['no']:02d}-*`.",
        "Örnek fotoğraflar (çift, anılar) ortaktır: `collections/02_Dusty_Blue/assets/gpt/photos/` — burada üretilmez.", "",
        "## Nereye?",
        "- Repo `muzaffergrl/davetiye-maker`, dal `main`",
        f"- Klasör: `{k}/assets/gpt/` altındaki `textures/` ve `decor/`",
        f"- Commit mesajı: `G2{t['no']:02d}: görseller`",
        "- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.", "",
        f"## Stil ve renk",
        f"- Teknik: **{STIL[t['teknik']]}** (bütün dekor parçalarında aynı)",
        f"- Renkler: ink `{r['ink']}` · deep `{r['deep']}` · primary `{r['primary']}` · ivory `{r['ivory']}` · gold `{r['gold']}` · leaf `{r['leaf']}`",
        "- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.", "", "---", "",
        f"## PAKET 1 — Dokular ve dekor (görev G2{t['no']:02d})", "",
    ]
    for i, (dosya, olcu, seffaf, baslik, prompt, kontrol) in enumerate(assets(t), 1):
        lines += [f"### {i}. {baslik}",
                  f"**Kaydet:** `{k}/assets/gpt/{dosya}` · {olcu}" + (" · **Şeffaf zemin**" if seffaf else ""), "",
                  "```", prompt, "```", f"Kontrol: {kontrol}.", ""]
    lines += ["---", ""] + paket3_md(t).split("\n") + [""]
    return "\n".join(lines)


def paket3_md(t):
    k = f"collections/{t['klasor']}"
    lines = [f"## PAKET 3 — Etsy ilan mockup'ları (görev G8{t['no']:02d})", "",
             "Ekran ve kart yüzeyleri **düz yeşil (#00FF00)**; tasarım oraya yerleştirilecek. Nesneler düz, eğik değil.", ""]
    for i, (dosya, olcu, baslik, prompt) in enumerate(mockups(t), 1):
        lines += [f"### 3.{i} {baslik}", f"**Kaydet:** `{k}/assets/gpt/{dosya}` · {olcu}", "", "```", prompt, "```",
                  "Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.", ""]
    return "\n".join(lines).rstrip("\n")


def mockups(t):
    yuzey, susler, zarf = MOCK[t["no"]]
    return [
        ("mockups/phone_flatlay.png", "1024×1536", "Telefon mockup'ı",
         f"Bright airy flat-lay photo from directly above: a modern smartphone lying perfectly straight (not tilted, not rotated) in the center on {yuzey}, surrounded at the edges by {susler}. The phone screen is a perfectly flat, uniform pure green (#00FF00) with no reflections, no glare and no icons. Soft natural light, gentle shadows, no text, no logos, no brand marks on the phone."),
        ("mockups/laptop_desk.png", "1536×1024", "Dizüstü mockup'ı",
         f"Elegant styled scene: an open modern laptop seen straight from the front at eye level, centered, on {yuzey}, with {susler} beside it. The laptop screen is a perfectly flat, uniform pure green (#00FF00) with no reflections and no glare. Soft natural light, airy, no text, no logos, no brand marks."),
        ("mockups/card_flatlay.png", "1024×1536", "Basılı kart mockup'ı",
         f"Flat-lay photo from directly above: a single blank 5x7 portrait invitation card lying perfectly straight in the center, its face a perfectly flat, uniform pure green (#00FF00) with crisp edges, resting on {zarf} on {yuzey}, with {susler} at the edges. Soft natural light, gentle shadows, no text, no logos."),
    ]


# ----------------------------------------------------------------------------- Paket 5 üreteci (website, K22–K24)

AYLAR = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
         "November", "December"]
GUNLER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
DEMO_BUGUN = date(2026, 10, 13)  # comp'lardaki geri sayım için sabit referans (çıktı çalıştırma gününe bağlı olmasın)
VARSAYILAN_ALTYAZI = ["First hello", "The proposal", "Forever begins"]
YENIDEN_TANIM = "- 2026-10-13 yeniden tanımlandı (K22–K24, G033)"
ON = "Front view, perfectly straight, not cropped, with generous empty margin all around."
ORTALI = "Front view, perfectly straight, centered and not cropped, with generous empty margin all around."
ISIK = ("Lit like every other part: soft light from the top-left. No cast shadow and no drop shadow. No glow, halo, light "
        "rays or haze outside the object's outline — the website adds light effects. No text, letters or numbers. True "
        "transparent background PNG (real alpha channel — not white, not a checkerboard).")

# G046: edges Claude cuts along (docs/11 §5.1, §7) must read clearly in the GPT image. Per envelope type:
# (closed image: edge to cut, open image: sentence). A design may override with WEB[n]["kesim_kenari"] / ["acik_kenari"].
KESIM_KENARI = {
    "kapak": ("the free edge of the flap",
              "The top edge of the front pocket is a crisp, clearly visible edge against the liner."),
    "kapi": ("the center seam where the two doors meet",
             "The top edge of the center pocket is a crisp, clearly visible edge against the center panel."),
    "kitap": ("the cover's outer edge and the spine",
              "The spine line between the open cover and the right page is crisp and clearly visible."),
    "kese": ("the gathered mouth",
             "The front rim of the mouth is a crisp, clearly visible edge against the lining."),
    "kilif": (None, None),  # vellum sleeve: no cut (docs/11 §7.7)
}
PAKET_BASLIK = re.compile(r"^##\s+PAKET\s+(\d)\b")


def tarih_us(d):
    return f"{AYLAR[d.month - 1]} {d.day}, {d.year}"


def saat_us(s):
    h, m = (int(x) for x in s.split(":"))
    return f"{(h % 12) or 12}:{m:02d} {'PM' if h >= 12 else 'AM'}"


def ein(s):
    return ("an " if s[:1].lower() in "aeiou" else "a ") + s


def bas(s):
    return s[:1].upper() + s[1:]


def kisa_ad(s):
    """Katalog tablosu için kısa accent adı."""
    s = s.split(" (")[0].split(",")[0]
    return s.split(" with ")[0] if len(s) > 40 else s


def tema_slug(t):
    return re.sub(r"[^a-z0-9]+", "-", t["ad"].lower().replace("&", " ")).strip("-")


def web(t):
    """Tasarımın website alanları: WEB kaydı + `p`'den gelen eksikler + renk (02'de palette.json)."""
    if t["no"] not in WEB:
        raise KeyError(f"tasarım {t['no']:02d} için WEB kaydı yok (03 elle yazıldı: G030/G035)")
    w = dict(WEB[t["no"]])
    p = t.get("p") or {}
    w.setdefault("liner", p.get("liner"))
    w.setdefault("bg", p.get("bg"))
    w.setdefault("corner", p.get("decor_main"))
    w.setdefault("ayirici", p.get("decor_small"))
    w.setdefault("pencere_yatay", "a 3:2 landscape window")
    w.setdefault("ekler", [])
    w.setdefault("yazi_bilgi", "serif")
    w.setdefault("yazi_vurgu", "italic serif")
    w.setdefault("ortak", "Premium luxury wedding stationery quality, real paper and material textures, soft natural "
                          "light from the top-left, refined, rich and airy.")
    w["zarf_acik"] = w["zarf_acik"].format(liner=w["liner"])
    w["renk"] = t["renk"] or json.loads((ROOT / "collections" / t["klasor"] / "palette.json").read_text(encoding="utf-8"))
    w["stil"] = STIL[t["teknik"]]
    return w


def demo(t):
    """Comp'lardaki demo metin: koleksiyonun content.demo.json kaydından (kurgu çift)."""
    c = json.loads((ROOT / "collections" / t["klasor"] / "content.demo.json").read_text(encoding="utf-8"))
    a, b = (x["display_name"] for x in c["partners"][:2])
    d = date.fromisoformat(c["date"])
    v = c["venue"]
    yer = v["region"] if (v.get("country") or "USA") == "USA" else v["country"]
    altyazi = [i.get("caption") for i in (c.get("story") or {}).get("items", [])][:3]
    if len(altyazi) < 3 or not all(altyazi):
        altyazi = VARSAYILAN_ALTYAZI
    return dict(a=a, b=b, gun=GUNLER[d.weekday()], tarih=tarih_us(d), saat=saat_us(c["ceremony_time"]),
                mekan=v["name"], sehir=v["city"], yer=yer, kiyafet=c.get("dress_code") or "",
                program=[(saat_us(s["time"]), s["label"], s["location"]) for s in c["schedule"][:3]],
                son=tarih_us(date.fromisoformat(c["rsvp"]["deadline"])), kalan=(d - DEMO_BUGUN).days, altyazi=altyazi)


def w1_ekranlar(t, w, d):
    """(dosya, başlık, prompt, kontrol) — 5 telefon ekranı comp'u (referans; demo metin serbest)."""
    a1, a2, a3 = (ein(kisa_ad(x)) for x in w["accent"])
    ortak, yb, yv = w["ortak"], w["yazi_bilgi"], w["yazi_vurgu"]
    ortusme = ("çerçeveler yalnız kenar paylarında üst üste; üç yeşil pencere tam görünür" if w.get("story_ortusme")
               else "çerçeveler birbirini kesmiyor")
    nav = 'A slim elegant bottom navigation bar reads "HOME · STORY · DETAILS · RSVP".'
    (t1, e1, l1), (t2, e2, l2), (t3, e3, l3) = d["program"]
    c1, c2, c3 = d["altyazi"]
    ya = "the script" if "script" in w["yazi"] else "the display lettering"  # 06, 17, 19: el yazısı yok
    return [
        ("comps/web_1_envelope.png", "W1.1 Açılış sayfası — kapalı zarf",
         f"Design a luxury mobile wedding website screen, page 1 of 5: the envelope landing page. Full-bleed portrait "
         f"phone screen layout — no phone hardware, no status bar, no browser bar. Background: {w['bg']}, with "
         f"{w['corner']} framing the top-left and bottom-right corners and a few small floating accents ({a1}, {a2}, {a3}). "
         f"Centered slightly below the middle: {w['zarf']}, closed, with {w['kapanis']} — {w['kapanis_yeri']}. Above it, "
         f"typography in {w['yazi']}: a small spaced line \"YOU ARE INVITED\" and the names \"{d['a']} & {d['b']}\" "
         f"large; below the {w['zarf_kisa']} a small spaced line \"TAP TO OPEN\". All decor in {w['stil']} style. {ortak}",
         f"{w['zarf_kisa']} ve {w['kapanis_kisa']} net ve tam; metin yalnız üstte ve altta; telefon donanımı/durum çubuğu yok; lüks görünüm"),
        ("comps/web_2_home.png", "W1.2 Home — kart, isimler, geri sayım",
         f"Same design, page 2 of 5: home. Same background, decor and light. At the top, the card that came out of the "
         f"{w['zarf_kisa']}: {w['kart_kucuk']}; its photo window is filled with flat pure green #00FF00, and on the card "
         f"below the window the line \"We're getting married\" in {ya} and a small spaced line "
         f"\"{d['tarih'].upper()} · {d['sehir'].upper()}\". Under the card: the names \"{d['a']} & {d['b']}\" large in "
         f"{ya}, a small spaced line \"{d['gun'].upper()} · {d['tarih'].upper()}\", the venue \"{d['mekan']}\" and "
         f"\"{d['sehir']}, {d['yer']}\" in {yv}, four small elegant countdown boxes \"{d['kalan']} DAYS · 09 HOURS "
         f"· 05 MINUTES · 05 SECONDS\", and {w['buton']} labelled \"RSVP\". {nav} One or two floating accents. {ortak}",
         "kart penceresi düz yeşil; isimler, tarih, mekân, 4 geri sayım kutusu ve buton görünür; alt menü var"),
        ("comps/web_3_story.png", "W1.3 Story — üç fotoğraf",
         f"Same design, page 3 of 5: our story. The title \"Our Story\" in {ya} at the top with a small spaced "
         f"subtitle \"MOMENTS WE HOLD DEAR\". Below: {w['story']}; every photo window is filled with flat pure green "
         f"#00FF00 and each frame has a small caption in {ya} underneath: \"{c1}\", \"{c2}\", \"{c3}\". Small touches of "
         f"the same decor between the frames. {nav} {ortak}",
         f"üç çerçeve, pencereler düz yeşil; başlık üstte; {ortusme}; diziliş: {t['foto'].rstrip('.')}"),
        ("comps/web_4_details.png", "W1.4 Details — program kartı ve mekân",
         f"Same design, page 4 of 5: details. {bas(w['bilgi_karti'])} holds the title \"Order of the Day\" in {ya} "
         f"and three schedule rows separated by tiny dividers ({w['ayirici']}): \"{t1} — {e1} — {l1}\", "
         f"\"{t2} — {e2} — {l2}\", \"{t3} — {e3} — {l3}\" (time in small spaced {yb}, event in {yb}, place in {yv}). "
         f"Below the card: {w['cerceve_yatay']}, its window filled with flat pure green #00FF00 (the venue photo), under "
         f"it \"{d['mekan']}\" and \"{d['sehir']}, {d['yer']}\", then a small line \"DRESS CODE · {d['kiyafet']}\". "
         f"{nav} {ortak}",
         "üç satır net ve hizalı; mekân penceresi düz yeşil ve yatay; kıyafet satırı var"),
        ("comps/web_5_rsvp.png", "W1.5 RSVP — davet kartı ve buton",
         f"Same design, page 5 of 5: RSVP. The same card as page 4 with the title \"Will You Join Us?\" in {ya}, "
         f"\"Kindly reply by {d['son']}\" in {yb}, {w['buton']} labelled \"RSVP\", the line \"We can't wait to "
         f"celebrate with you\" and \"With love, {d['a']} & {d['b']}\" in {ya} at the bottom; a small "
         f"{w['kapanis_kisa']} — the same one as on the {w['zarf_kisa']} — rests at the base of the card. {nav} {ortak}",
         "buton ve metin kartın içinde; kapanış elemanı zarftakiyle aynı"),
    ]


def w2_parcalar(t, w):
    """(dosya, ölçü, şeffaf, başlık, prompt, kontrol) — website katmanları; yazı yok."""
    tip_ad, zolcu, yer = ZARF_TIPI[w["tip"]]
    yer = w.get("yer", yer)
    zk, kk, kume = w["zarf_kisa"], w["kapanis_kisa"], w["kume"]
    ek_ad = "" if w["tip"] == "kapak" else f" ({tip_ad})"
    temiz, temiz_k = "", ""
    if w.get("pencere_temiz"):
        temiz = f" The green window is perfectly clean edge to edge — {w['pencere_temiz'][0]} over it."
        temiz_k = f"; {w['pencere_temiz'][1]}"
    if w.get("sarili"):  # zarfı saran kurdele/sicim: zarfla aynı tuvalde, üst üste 1:1
        kapanis = (f"Only {w['kapanis']}, alone, exactly as it sits on the {zk} in the W1 screens "
                   f"({w['kapanis_yeri']}), with no {zk} behind it. Draw it on a canvas of exactly the same size as "
                   f"envelope_closed.png and give envelope_closed.png as the reference image: the {kk} sits exactly where "
                   f"it wraps the {zk} there, so the two images overlay pixel for pixel. Where it wraps around the edges, "
                   f"its ends stop exactly at the {zk}'s outline. The {zk} itself is NOT drawn. Front view, perfectly "
                   f"straight. {ISIK}")
        kapanis_k = (f"yalnız {kk}; harf/monogram yok; envelope_closed üstüne 1:1 oturuyor (yarı saydam üst üste konunca "
                     "zarfın kenarlarıyla çakışıyor); uçlar zarf kenarında bitiyor; gölge yok; alfa")
    else:
        dolu = w.get("kapanis_doluluk", 70)
        kapanis = (f"Only {w.get('kapanis_parca', w['kapanis'])}, alone, exactly as it sits on the {zk} in the W1 screens "
                   f"({w['kapanis_yeri']}), drawn large so it fills about {dolu}% of the square (Claude scales it to the "
                   f"{zk}), with the same perspective, material and light as on the {zk} and with no {zk} behind it. "
                   f"{ORTALI} {ISIK}")
        kapanis_k = (f"yalnız {kk}; harf/monogram yok; zarftakiyle aynı görünüm; kareyi ~%{dolu} dolduruyor; gölge yok; alfa"
                     + w.get("kapanis_k_ek", ""))
    duzenle = ("Make this by EDITING envelope_closed.png (image edit), not as a new drawing — change nothing except what "
               "is described: " if w.get("acik_duzenle") else "")
    kenar, acik_kenar = KESIM_KENARI[w["tip"]]
    kenar, acik_kenar = w.get("kesim_kenari", kenar), w.get("acik_kenari", acik_kenar)
    kenar_cumle = (f" The edges where this piece will be cut must read clearly: {kenar} — a crisp line with a slight "
                   "contact shade on the object itself (not a cast shadow)." if kenar else "")
    acik_cumle = f" {acik_kenar}" if acik_kenar else ""
    out = [
        ("parts/bg_page.png", "1024×1536", False, "Sayfa arka planı (telefon)",
         f"The page background of the W1 screens alone, as a vertical phone-screen background: {w['bg']}, with "
         f"{w['corner']} entering softly from the top-left and bottom-right edges only. The whole central area stays calm "
         f"and empty (no {zk}, no card, no frames, no text) so it still works when a tall phone crops the sides. Same "
         f"colors, technique and light as the W1 screens.",
         "orta sakin ve boş; dekor yalnız kenarlarda; yazı yok; W1 ile aynı renk ve ışık"),
        ("parts/bg_tile.png", "1024×1024", False, "Dikişsiz zemin dokusu (uzun sayfalar)",
         f"A seamless tileable square texture for long website pages: {w['doku']}. Calm, even and very low in contrast; "
         f"no objects, no flowers, no vignette, no text; the left and right edges and the top and bottom edges match so "
         f"it repeats without visible seams.",
         "kenarlar dikişsiz birleşiyor; düşük kontrast; nesne/yazı yok"),
        ("parts/envelope_closed.png", zolcu, True, f"Kapalı zarf{ek_ad} — kapanış elemanı OLMADAN",
         f"The same {zk} as in the W1 screens, alone and closed, WITHOUT the {kk}: {w.get('zarf_parca', w['zarf'])}. "
         f"{yer}{kenar_cumle} Only this one "
         f"object. {ON} {ISIK}",
         f"tek nesne; {kk} yok; kesilmemiş; gölge yok; gerçek alfa" + ("; kesilecek kenar net çizgi (nesnenin kendi "
                                                                      "üstünde ince temas gölgesi)" if kenar else "")),
        ("parts/closure.png", w["kapanis_olcu"], True, "Kapanış elemanı (tek başına)", kapanis, kapanis_k),
        ("parts/envelope_open.png", zolcu, True, f"Açık zarf{ek_ad} — boş",
         f"{duzenle}The SAME {zk} as envelope_closed.png — same size, same position on the canvas, same angle, same material and "
         f"light (give envelope_closed.png as the reference image) — now open: {w['zarf_acik']}.{acik_cumle} No card, "
         f"nothing inside, no {kk}. {ON} {ISIK}",
         ("envelope_closed'un düzenlemesi: tarif edilen dışında hiçbir şey değişmedi; " if w.get("acik_duzenle") else "")
         + "envelope_closed ile aynı ölçü, konum ve açı — envelope_closed üstüne yarı saydam konunca değişmeyen gövde "
           "çakışıyor; içi boş; gölge yok; alfa (kapak/kapı/cep parçalarını Claude bu görselden keser)"),
        ("parts/card_small.png", "1024×1536", True, "Zarftan çıkan küçük kart (boş)",
         f"The small card that comes out of the {zk} in W1.2, alone: {w['kart_kucuk']}. Its photo window is filled with "
         f"flat pure green #00FF00 (no texture, no shading).{temiz} The rest of the card is blank (no text). Slightly "
         f"narrower than the {zk} so it fits inside it. {ORTALI} {ISIK}",
         f"pencere düz #00FF00; kartın geri kalanı boş; zarfa sığacak genişlikte; alfa{temiz_k}"),
        ("parts/invitation_card.png", "1024×1536", True, "Büyük davet kartı (boş)",
         f"The large invitation card of this design, alone: {w['davet_karti']}. The card face is completely blank (no "
         f"text at all) with a large calm area in the middle for the invitation wording. {ORTALI} {ISIK}",
         "kart yüzü tamamen boş; dekor tasarıma özgü; gölge yok; alfa"),
        ("parts/info_card.png", "1024×1536", True, "Hafif kart (details/rsvp için, boş)",
         f"The lighter card from W1.4 and W1.5, alone: {w['bilgi_karti']}. Completely blank face (no text) with a large "
         f"calm writing area. {ORTALI} {ISIK}",
         "boş yüz; davet kartından daha sade; gölge yok; alfa"),
        ("parts/frame_portrait.png", "1024×1536", True, "Dikey foto çerçevesi (story)",
         f"One photo frame from W1.3, alone and upright: {w['cerceve']}. The window inside is {w['pencere']}, filled with "
         f"flat pure green #00FF00.{temiz} No caption, no text. {ORTALI} {ISIK}",
         f"tek çerçeve; pencere düz #00FF00; yazı yok; gölge yok; alfa{temiz_k}"),
        ("parts/frame_landscape.png", "1536×1024", True, "Yatay foto çerçevesi (mekân fotoğrafı)",
         f"{bas(w['cerceve_yatay'])}, matching frame_portrait.png exactly in material and ornament, about 80% of the image "
         f"width. The window inside is {w['pencere_yatay']}, filled with flat pure green #00FF00, for the venue photo."
         f"{temiz} {ORTALI} {ISIK}",
         f"tek nesne; pencere düz yeşil ve yatay (~3:2); dikey çerçeveyle aynı malzeme; gölge yok; alfa{temiz_k}"),
        (f"parts/{kume}_tl.png", "1024×1024", True, "Köşe kümesi — sol üst",
         f"ONE cluster of {w['corner']}, isolated, as at the top-left corner of the W1 screens: it fans from the top-left "
         f"toward the center and leaves the bottom-right half of the square empty. Keep a thin empty margin even at the "
         f"top and left edges (do not cut it off at the image border). {ISIK}",
         "tek küme; sol üstten başlıyor; sağ alt yarı boş; kenarda ince boşluk; alfa"),
        (f"parts/{kume}_br.png", "1024×1024", True, "Köşe kümesi — sağ alt",
         f"ONE cluster of {w['corner']}, isolated, as at the bottom-right corner of the W1 screens: it fans from the "
         f"bottom-right toward the center and leaves the top-left half of the square empty. Keep a thin empty margin even "
         f"at the bottom and right edges. {ISIK}",
         "tek küme; sağ alttan başlıyor; sol üst yarı boş; kenarda ince boşluk; alfa"),
    ]
    for i, a in enumerate(w["accent"], 1):
        out.append((f"parts/accent_{i}.png", "1024×1024", True, f"Süzülen accent {i}",
                    f"Exactly ONE {a}, in the same {w['stil']} style as the W1 screens, alone in the middle of the square "
                    f"at about 40% of its width with lots of empty space around it — a single small object that will "
                    f"float across the website. {ORTALI} {ISIK}",
                    "tek nesne (birden fazla değil); küçük ve ortalı; gölge yok; alfa"))
    out.append(("parts/divider.png", "1536×1024", True, "Küçük ayırıcı",
                f"A small horizontal divider in the same {w['stil']} style: {w['ayirici']}, lying horizontally and centered, "
                f"about 60% of the image width, lots of empty space around it. {ORTALI} {ISIK}",
                "küçük, yatay ve ortalı; gölge yok; alfa"))
    for dosya, olcu, seffaf, baslik, prompt, kontrol, *duzen in w["ekler"]:
        son = f" {duzen[0] if duzen else ORTALI} {ISIK}" if seffaf else ""
        out.append((dosya, olcu, seffaf, baslik, prompt + son, kontrol))
    out.append(("parts/web_hero.png", "1536×1024", False, "Website hero + paylaşım görseli (og:image kaynağı)",
                f"Wide horizontal version of the same design for the desktop website header: {w['bg']}, with "
                f"{w['corner']} framing the left and right edges, and the closed {zk} with its {kk} resting slightly "
                f"off-center at the bottom. The center-top area is calm and empty for the couple's names. This image is "
                f"also cropped to 1200×630 for link previews: keep the closed {zk} with its {kk} completely visible with "
                f"at least 5% empty margin below it, and keep the top 20% to background and decor only. Same technique, "
                f"colors and light as the W1 screens. No text, no letters.",
                "orta-üst boş; yazı yok; aynı dekor ve zarf; zarf + kapanış altta en az %5 boşlukla tam görünür, üst %20 "
                "yalnız zemin/dekor (1200×630 kırpımı)"))
    return out


def renk_satiri(r):
    return (f"ink `{r['ink']}` · deep `{r['deep']}` · primary `{r['primary']}` · mist `{r['mist_top']}`→`{r['mist_bottom']}` "
            f"· ivory `{r['ivory']}` · gold `{r['gold']}` · leaf `{r['leaf']}`")


def ozet_yolu(t):
    k = f"collections/{t['klasor']}"
    if (ROOT / k / "DESIGN_BRIEF.md").exists():
        return f"`{k}/DESIGN_BRIEF.md`"
    return f"`docs/09_TASARIM_KATALOGU.md` (satır {t['no']:02d}) ve `{k}/COLLECTION_STATUS.md`"


def baslik_md(t, w):
    n, k = f"{t['no']:02d}", f"collections/{t['klasor']}"
    mock = "G013" if t["no"] == 2 else f"G8{n}"
    return [
        f"# GPT görsel istekleri — Tasarım {n} · {t['ad']}", "",
        "> **Instructions for GPT:** Generate the images of PAKET 5 (website design: first the W1 screens, then the W2",
        "> parts) and then PAKET 2 (sample photos), in order and in ONE chat; PAKET 3 (mockups) only when its own task asks.",
        "> Use each English prompt exactly as written, follow its checklist, and save each file with the exact file name and",
        "> folder shown under \"Kaydet\". No text, letters, numbers, logos or watermarks in any image — except the PAKET 5 W1",
        "> screens, which are layout references.", "",
        "Bu dosya bu tasarımın prompt'larının **tek kaynağıdır**. Üretildi: `python3 tools/katalog.py paket5` (elle düzenleme",
        f"yerine katalogu değiştirip yeniden üret; PAKET 3 olduğu gibi korunur). Tasarım özeti: {ozet_yolu(t)}.",
        f"Görev: `gorevler/G2{n}-*` (Paket 5 + Paket 2); mockup'lar `gorevler/{mock}-*` (Paket 3). Model: tasarım 03 —",
        "`collections/03_Blush_Garden_Rose/assets/gpt/` (comps/, parts/, photos/) ve sitesi `collections/03_Blush_Garden_Rose/website/`.", "",
        "## Nereye?",
        "- Repo `muzaffergrl/davetiye-maker`, dal `main`",
        f"- Klasör: `{k}/assets/gpt/` altındaki `comps/` ve `parts/` (Paket 5), `photos/` (Paket 2), `mockups/` (Paket 3)",
        f"- Commit mesajı: `G2{n}: website paketi` (Paket 5 + Paket 2)",
        "- Repoya yazamıyorsan dur ve bunu çıktında açıkça söyle; kullanıcıya yükleme işi verme.", "",
        "## Stil ve renk",
        f"- Teknik: **{w['stil']}** (bütün dekor parçalarında aynı)",
        f"- Renkler: {renk_satiri(w['renk'])}",
        f"- Renk dünyası: {w['renk_sozu']}",
        "- Gerçek bir kişiye, markaya veya başka bir satıcının tasarımına benzemesin.", "", "---", "",
    ]


def paket5_md(t, w=None, d=None):
    w, d = w or web(t), d or demo(t)
    n, k = f"{t['no']:02d}", f"collections/{t['klasor']}"
    tip_ad = ZARF_TIPI[w["tip"]][0]
    parcalar = w2_parcalar(t, w)
    (t1, e1, l1), (t2, e2, l2), (t3, e3, l3) = d["program"]
    L = [
        "## PAKET 5 — Website tasarımı (GPT tasarlar)", "",
        f"> Görev `G2{n}` (K21–K24). Ürün artık mobil öncelikli düğün websitesi (K22): kapalı zarf sayfası → dokununca zarf",
        "> bu tasarıma özgü biçimde açılır → home, story, details, rsvp (K23). Kişisel metinler sitede HTML'dir, görsele",
        "> pişirilmez (K24). Eski Paket 1 (doku/dekor) ve video Paket 4 bu tasarımda iptal. Model: tasarım 03 PAKET 4 + sitesi.",
        f"> Üreten: `python3 tools/katalog.py paket5 --no {n}` — değişiklik için `tools/katalog.py` → `WEB[{t['no']}]`.", "",
        f"**Bu tasarımın website açılışı** ({tip_ad}; katalog: {t['zarf'].rstrip('.')}):",
        f"{w['acilis']}", "",
        "**Instructions for GPT (read fully before starting):**",
        "- You are the **art director and illustrator** of this design's wedding website. Aim for **high-end luxury",
        "  wedding stationery** quality: rich detail, real paper and material textures, believable depth, generous",
        "  breathing room. Classic, romantic and rich — never minimal, never flat clip-art, never generic vector shapes.",
        "- Work in **one chat** for this whole file: first the five W1 screens, then every W2 part with the W1 images given",
        f"  as **reference images**, then the PAKET 2 photos. Every image shares the same {w['zarf_kisa']}, {w['kapanis_kisa']},",
        "  decor, paper, metal and light.",
        f"- Technique for all decor: **{w['stil']}**; paper, fabric and metal look real.",
        f"- Palette: {renk_satiri(w['renk'])} ({w['renk_sozu']}).",
        f"- Typography in the W1 screens: {w['yazi']}.",
        "- W1 screens are 1024×1536 full-bleed phone layouts (no phone hardware, no status bar, no browser bar). They may",
        "  contain the demo text below — they are layout references only and are never sold.",
        "- W2 parts contain **NO text, letters, numbers or monograms at all** — not on seals, stamps, labels, tags or covers.",
        "- **ONE object per image** — never a sheet or set of several objects in one image.",
        "- **No cast shadow and no drop shadow** on any part (the website adds its own shadows). Light every part the same",
        "  way: soft light from the top-left. Front view, straight, centered, not cropped, empty margin around it.",
        "- **No glow, halo, light rays or haze outside an object's outline** (the website adds light effects); a",
        "  semi-transparent halo leaves a dirty edge on another background.",
        "- Edges Claude will cut along (the flap's free edge, a door seam, a book's spine and cover edge, a pouch mouth, a",
        "  pocket's top edge) are **crisp lines with a slight contact shade on the object itself** — never a cast shadow.",
        "- Transparent parts are **true-alpha PNG** (not white, not a checkerboard).",
        "- Where a photo will go, fill the window with **flat pure green #00FF00** (no texture, no shading, no gradient).",
        "- envelope_closed.png and envelope_open.png must fit together exactly: the SAME",
        f"  {w['zarf_kisa']} at the SAME size, position and angle. Make envelope_closed.png first and give it as the",
        "  reference for closure.png and envelope_open.png. " + (
            "closure.png is drawn on a canvas of the same size so it overlays" if w.get("sarili") else
            "closure.png is drawn large on its own square; Claude scales it"),
        ("  envelope_closed.png pixel for pixel. " if w.get("sarili") else f"  onto the {w['zarf_kisa']}. ") +
        "Do not draw separate flap, door, pocket or cover pieces — Claude cuts",
        "  interlocking pieces from one image.",
        "- Vertical 1024×1536 images: keep everything important inside the **central 85% of the width** (phones crop the sides).",
        "- Must not resemble any real person, brand or another seller's design.", "",
        "### W1 — Telefon ekranı tasarımları (referans; satılmaz)", "",
        f"Ortak demo metin (W1 ekranlarında bu metni kullan): {d['a']} & {d['b']} · {d['gun']}, {d['tarih']} · {d['saat']} ·",
        f"{d['mekan']}, {d['sehir']}, {d['yer']} · {e1} {t1} {l1} · {e2} {t2} {l2} · {e3} {t3} {l3} · {d['kiyafet']} ·",
        f"Kindly reply by {d['son']}.", "",
    ]
    for dosya, baslik, prompt, kontrol in w1_ekranlar(t, w, d):
        L += [f"#### {baslik}", f"**Kaydet:** `{k}/assets/gpt/{dosya}` · 1024×1536", "", "```", prompt, "```",
              f"Kontrol: {kontrol}.", ""]
    L += ["### W2 — Parçalar (website katmanları; YAZI YOK)", "",
          f"W1 görsellerini referans ver; her parça W1'dekiyle **aynı** görünmeli (aynı {w['zarf_kisa']}, aynı kapanış,",
          f"aynı çerçeve ve dekor). Tek görselde tek nesne, gölge yok, ışık sol üstten, şeffaflar gerçek alfa. {len(parcalar)} parça.", ""]
    for i, (dosya, olcu, seffaf, baslik, prompt, kontrol) in enumerate(parcalar, 1):
        L += [f"#### W2.{i} {baslik}",
              f"**Kaydet:** `{k}/assets/gpt/{dosya}` · {olcu}" + (" · **Şeffaf zemin**" if seffaf else ""), "",
              "```", prompt, "```", f"Kontrol: {kontrol}.", ""]
    return L


def paket2_md(t, w=None, d=None):
    w, d = w or web(t), d or demo(t)
    n, k, f = f"{t['no']:02d}", f"collections/{t['klasor']}", w["foto"]
    c1, c2, c3 = d["altyazi"]
    ayni = "Same couple as in the engagement photo hero_portrait.jpg (photo 2.1 just above), "
    kd = f" {f['kadraj']}" if f.get("kadraj") else ""  # yuvarlak/oval pencere: kadraj notu
    fotolar = [
        ("2.1 Ana portre", "hero_portrait.jpg", "Dikey (1024×1536)",
         f"Romantic editorial engagement photo of a fictional couple in their late twenties (not resembling any real "
         f"person), standing close and smiling at each other {f['portre']}; she wears {f['kiz']}, he wears {f['erkek']}. "
         f"Natural skin, true-to-life colors, soft warm film look, shallow depth of field. Both faces in the central area "
         f"of the frame with generous space around them. Vertical photo, no text, no watermark.{kd}"),
        (f"2.2 Hikâye 1 — \"{c1}\"", "story_1.jpg", "Dikey (1024×1536)",
         f"{ayni}{f['s1']}, relaxed and natural, true-to-life colors, soft film look, "
         f"subjects centered, vertical photo, no text, no signage, no watermark.{kd}"),
        (f"2.3 Hikâye 2 — \"{c2}\"", "story_2.jpg", "Dikey (1024×1536)",
         f"{ayni}{f['s2']}: he kneels holding a small open ring box, she covers her mouth in "
         f"happy surprise, photographed from a respectful medium distance, subjects centered, true-to-life colors, soft "
         f"film look, vertical photo, no text, no watermark.{kd}"),
        (f"2.4 Hikâye 3 — \"{c3}\"", "story_3.jpg", "Dikey (1024×1536)",
         f"{ayni}{f['s3']}, soft natural light, shallow depth of field, centered "
         f"composition, true-to-life colors, vertical photo, no text, no watermark.{kd}"),
        ("2.5 Mekân", "venue.jpg", "Yatay (1536×1024)",
         f"{f['mekan']}, true-to-life colors, horizontal photo, no people, no text, no signage, no watermark."),
    ]
    L = ["## PAKET 2 — Örnek fotoğraflar", "",
         f"Görev `G2{n}`, Paket 5'ten sonra **aynı sohbette**; website demosu ve ilan için. Kurgusal çift; alıcı kendi",
         "fotoğraflarını koyar. 2.1'den sonra her prompt'ta \"same couple as in hero_portrait.jpg\" korunur. Gerçek veya ünlü",
         f"birine benzemesin; eller/parmaklar düzgün. {f['notu']} Renk dünyası: {f['dunya']}.", ""]
    for baslik, dosya, olcu, prompt in fotolar:
        L += [f"### {baslik}", f"**Kaydet:** `{k}/assets/gpt/photos/{dosya}` · {olcu}", "", "```", prompt, "```", ""]
    L += ["Kontrol (tüm fotoğraflar): aynı çift tutarlı; yüzler doğal; eller/parmaklar düzgün; yazı/logo/tabela yok; konu ortada.", ""]
    return L


def paket3_bolumu(metin):
    """Var olan dosyadaki `## PAKET 3` bölümü (sonraki `## PAKET N` başlığına ya da dosya sonuna kadar), aynen."""
    satirlar = metin.splitlines()
    bas_i = next((i for i, s in enumerate(satirlar) if (m := PAKET_BASLIK.match(s)) and m.group(1) == "3"), None)
    if bas_i is None:
        return None
    son = next((i for i in range(bas_i + 1, len(satirlar)) if PAKET_BASLIK.match(satirlar[i])), len(satirlar))
    blok = satirlar[bas_i:son]
    while blok and blok[-1].strip() in ("", "---"):
        blok.pop()
    return "\n".join(blok)


def gpt_prompts_md(t, eski="", paket3_yenile=False):
    """Başlık + PAKET 5 + PAKET 2 + (eski dosyadan aynen) PAKET 3. Aynı girdiyle iki kez çalışınca aynı çıktı.
    `paket3_yenile`: PAKET 3 eski dosyadan alınmaz, `MOCK`'tan yeniden üretilir."""
    if t["no"] == 3:
        raise ValueError("tasarım 03'ün GPT_PROMPTS.md dosyası elle yazıldı (G030/G035/G036); üreteç ona dokunmaz")
    w, d = web(t), demo(t)
    p3 = paket3_bolumu(eski) if eski and not paket3_yenile else None
    if p3 is None and t["no"] in MOCK:
        p3 = paket3_md(t)
    L = baslik_md(t, w) + paket5_md(t, w, d) + ["---", ""] + paket2_md(t, w, d)
    if p3:
        L += ["---", "", p3, ""]
    return "\n".join(L).rstrip("\n") + "\n"


def brief_md(t):
    k = f"collections/{t['klasor']}"
    f1, f2 = t["font"]
    rows = "\n".join(f"| {n} | {ad} | {acik.format(**t)} |" for n, ad, acik in SAHNELER)
    r = t["renk"] or {}
    renk = " · ".join(f"{k2} `{v}`" for k2, v in r.items())
    return f"""# Tasarım {t['no']:02d} — {t['ad']} · tasarım özeti

Kaynak: `tools/katalog.py` (Aşama 1 kataloğu, `docs/09_TASARIM_KATALOGU.md`). Durum: `concept`.

**Ruh:** {t['ruh']}

| Eksen | Bu tasarım |
|---|---|
| Zarf / açılış | {t['zarf']} |
| Fotoğraf sunumu | {t['foto']} |
| Dekor ailesi | {t['dekor']} |
| Teknik | {t['teknik']} ({STIL[t['teknik']]}) |
| Font hedefi | {f1} (script) + {f2} (bilgi) — Canva'da bulunabilirliği doğrulanacak; bulunamazsa en yakın Canva fontu kaydedilir |
| Ana palet | {t['palet_adi']}: {renk} |

## Sahneler (9:16, 1080×1920 — hikâye sırası AGENTS.md şart 4)
| # | Sahne | Bu tasarımda |
|---|---|---|
{rows}

Nesneler **ayrı katman** hareket eder; tüm ekranı zoom/fade yetmez. Kişisel alanlar (isim, tarih, monogram,
foto, link) görsele pişirilmez.

## Dosyalar
- Demo içerik: `{k}/content.demo.json` (kurgu çift; URL'ler null)
- Renk: `{k}/palette.json`
- GPT prompt'ları: `{k}/assets/gpt/GPT_PROMPTS.md`
- HTML sahne kaynağı + katmanlar: `{k}/video/`, `{k}/assets/layers/`, `{k}/kit_map.json` (görev G1{t['no']:02d})
- Canva master: görev G3{t['no']:02d}
"""


def status_md(t):
    return f"""# Koleksiyon {t['no']:02d} — {t['ad']} (çalışma adı)

**Durum:** `concept` — Aşama 1 kataloğundan açıldı (2026-10-09). Satış ürünü değil.
Tasarım özeti: `DESIGN_BRIEF.md`. Çalışma adı marka değildir.

## Set paketi durumu (`docs/05_SET_PAKETI.md`)
| # | Parça | Durum |
|---|---|---|
| A1 | Canva video (animasyonlu) | başlanmadı (G1{t['no']:02d} kaynak → G2{t['no']:02d} görsel → G3{t['no']:02d} Canva) |
| A2 | Canva website + Form RSVP | başlanmadı |
| A3 | Davetiye PDF | başlanmadı |
| A4 | Paylaşım görseli | başlanmadı |
| A5 | Kullanım kılavuzu PDF | başlanmadı |
| B1–B3 | Etsy ilan kiti | başlanmadı |
"""


def task_md(id, baslik, rol, bagimli, yazar, amac, girdiler, yap, bitti, oncelik=2):
    return f"""---
id: {id}
baslik: {baslik}
rol: {rol}
durum: hazir
alan:
oncelik: {oncelik}
bagimli: [{', '.join(bagimli)}]
yazar: [{', '.join(yazar)}]
---

## Amaç
{amac}

## Girdiler
""" + "\n".join(f"- {x}" for x in girdiler) + """

## Yapılacaklar
""" + "\n".join(f"{i}. {x}" for i, x in enumerate(yap, 1)) + """

## Bitti sayılması için
""" + "\n".join(f"- [ ] {x}" for x in bitti) + """

## Sonuç
_(görevi yapan ajan doldurur: ne yapıldı, hangi dosyalar, ne test edildi / edilmedi, blokaj, önerilen yeni görevler)_
"""


def g2_gorev(t):
    """G2NN: website tasarım paketi (GPT) — Paket 5 + Paket 2. (dosya adı, metin)"""
    n, k = f"{t['no']:02d}", f"collections/{t['klasor']}"
    w = web(t)
    parca = len(w2_parcalar(t, w))
    return f"G2{n}-gorsel", task_md(
        f"G2{n}", f"Tasarım {n} {t['ad']} — website tasarım paketi (Paket 5 + Paket 2 fotoğraflar)", "gpt-gorsel", [],
        [f"{k}/assets/gpt/comps/", f"{k}/assets/gpt/parts/", f"{k}/assets/gpt/photos/"],
        f"Tasarım {n}'in website tasarımını GPT olarak yapmak (K21–K24): 5 telefon ekranı comp'u (W1, yalnız referans), "
        f"aynı tasarımın website parçaları (W2, {parca} dosya) ve 5 örnek fotoğraf (Paket 2). Model: tasarım 03 (G030 "
        f"parçaları + G036 fotoğrafları). Bu tasarımın açılışı: {w['acilis']}",
        [f"`{k}/assets/gpt/GPT_PROMPTS.md` → **PAKET 5** (W1 + W2) ve **PAKET 2**",
         f"{ozet_yolu(t)} (zarf, foto sunumu, dekor); `{k}/content.demo.json` (comp'lardaki demo metin)",
         "Kalite örneği: `collections/03_Blush_Garden_Rose/assets/gpt/comps/`, `.../parts/`, `.../photos/` ve site "
         "önizlemesi `collections/03_Blush_Garden_Rose/website/previews/`",
         "Kurallar: `gorevler/roller/gpt-gorsel.md` → \"Website paketi (Paket 5)\""],
        ["Hepsini **tek sohbette** üret. Önce W1 ekranları (5 comp); beğenmediğini yeniden üret — zarf, kapanış, çerçeve "
         "ve dekor burada oturur.",
         "Sonra W2 parçaları: her birinde W1 görsellerini **referans görsel** ver. Tek görselde tek nesne; gölge yok; ışık "
         "sol üstten; önden, düz, ortalı, kesilmemiş; şeffaf istenenler gerçek alfa; foto pencereleri düz `#00FF00`; "
         "yazı/harf/rakam yok.",
         "`envelope_closed.png`'yi önce üret; `closure.png` ve `envelope_open.png`'de onu referans ver: aynı zarf, aynı "
         "ölçü, konum ve açı. Kapak/kapı/cep parçalarını ayrıca çizme (Claude keser).",
         "Sonra PAKET 2 fotoğrafları (aynı sohbet, aynı kurgusal çift).",
         "Kaydet satırındaki tam yol ve ad; denemeler `_v2`, `_v3`; seçtiğin sade adla kalır.",
         f"Kontrol: `python3 tools/kit_check.py {k} --paket 5` ve `--paket 2` (kabuk yoksa her görselin Kontrol "
         "satırını uygula)."],
        [f"PAKET 5: 5 comp + {parca} parça doğru yolda; `kit_check --paket 5` GEÇTİ (kalan varsa Sonuç'ta gerekçesi)",
         "PAKET 2: 5 fotoğraf doğru yolda; aynı çift tutarlı",
         "Sonuç'ta yeniden üretilen parçalar ve emin olunmayan noktalar yazılı"],
        oncelik=1 if t["no"] in (1, 4, 5) else 2)


def g4_gorev(t):
    """G4NN: platform teması (claude-kod). (dosya adı, metin) — kurallar docs/11_TEMA_STANDARDI.md (G046)."""
    n, k = f"{t['no']:02d}", f"collections/{t['klasor']}"
    w = web(t)
    tip_ad = ZARF_TIPI[w["tip"]][0]
    f1, f2 = t["font"]
    slug = tema_slug(t)
    tema = f"platform/themes/{slug}/"
    bolum = {"kapak": "§7.3", "kapi": "§7.4", "kitap": "§7.5", "kese": "§7.6", "kilif": "§7.7"}[w["tip"]]
    kapanis = ("`closure.png` zarfla aynı tuvalde çizilir, `envelope_closed` üstüne 1:1 oturur" if w.get("sarili") else
               "`closure.png` kare tuvalde büyük çizilir; yeri kesim geometrisine bağlanır (`manifest.closure`, docs/11 §7.1)")
    ekler = (["Tasarıma özel ek parçalar (comp'taki ilgili öğe bunlardan kurulur, kodla çizilmez — K21): " +
              "; ".join(f"`{e[0].split('/')[-1]}` — {e[3]}" for e in w["ekler"]) + "."] if w["ekler"] else [])
    return f"G4{n}-website-kaynak", task_md(
        f"G4{n}", f"Tasarım {n} {t['ad']} — platform teması", "claude-kod", [f"G2{n}", "G038", "G046", "G052"],
        [tema, f"platform/tests/theme-{slug}.test.ts", f"platform/previews/g4{n}/"],
        f"Tasarım {n}'i platformda tema olarak kurmak (K24, `docs/10_SITE_PLATFORMU.md`): kapalı zarf açılış sayfası → "
        "home → story, details, rsvp; yalnız bu tasarımın GPT parçalarıyla (K21), kişisel metin HTML'de. "
        "**Kurallar `docs/11_TEMA_STANDARDI.md`'dedir; bu görev metniyle çelişirse docs/11 geçerlidir.**",
        [f"Tema standardı: `docs/11_TEMA_STANDARDI.md` — bütünü; zarf tipi **{tip_ad}** → §7.1 + {bolum}; bitti tanımı §13, "
         "kontrol listesi §15",
         "Platform sözleşmesi: `platform/README.md` (işaretler, RSVP form sözleşmesi, `#site-data`); çalışan örnek "
         "`platform/themes/blush-garden-rose/` — **yalnız** işaret/RSVP/`#site-data`/oturum anahtarı kullanımı için; yerleşimi, "
         "aralıkları, süs konumları ve zamanlaması bu temaya taşınmaz (docs/11 §8). G035 kaynağı "
         "(`collections/03_Blush_Garden_Rose/website/`) örnek değildir",
         f"GPT çıktıları (G2{n}): `{k}/assets/gpt/comps/` (W1, yerleşim referansı, satılmaz; yalnız sade adlar — `_vN` "
         "denemedir), `parts/` (katmanlar), `photos/` (örnek fotoğraflar)",
         f"İçerik `{k}/content.demo.json`, renk `{k}/palette.json`, özet {ozet_yolu(t)}",
         f"Araçlar: `tools/parts_prep.py` (geçici klasöre; docs/11 §5.3), `python3 tools/kit_check.py {k} --paket 5`, "
         "`node scripts/theme-check.cjs --theme <slug>` (G052)"],
        ["`theme.json`, 5 sayfa, `site.css`, `site.js`, `build_images.py`, `README.md` docs/11 §1–§4 düzeninde. 03'ten yalnız "
         "platform sözleşmesi alınır (motor işaretleri, RSVP formu, `#site-data`, slug'lı oturum anahtarları, "
         "`data-scene`/`data-step`/`data-a` kancaları); yerleşim, tipografi ve hiyerarşi bu tasarımın W1 comp'larından — tema "
         "`README.md`'sinde sayfa başına **comp öğe haritası** (her W1 öğesi → şablon öğesi ya da gerekçeli sapma; comp'u olmayan "
         "bölümler bu tasarımın parçaları ve tipografisiyle, docs/11 §8).",
         f"Parçalar: `python3 {tema}build_images.py` → `parts_prep` **geçici klasöre** (`--prep-dir`; tema klasörüne, `img_src/`'ye "
         "ya da `assets/`'e asla — docs/11 §1, §5.3–§5.4), tip kesimleri (§7), maskeler, `free_zone`, yer tutucular, og; "
         "WebP + srcset genişlikleri (§5.1, §5.5). Yalnız bu tasarımın GPT parçaları; yeni şekil/dekor çizme (K21).",
         f"Zarf açılışı (`MOTION.envelope`, {tip_ad}, docs/11 §7.1 + {bolum}): {w['acilis']} Katalog: "
         f"{t['zarf'].rstrip('.')}. Açılış cümlesindeki sıra, sayı ve yön bağlayıcıdır; kapanış elemanı, zarf/kapak ve kart ayrı "
         f"katmanlar; kart home'daki karta dönüşür; {kapanis}.",
         f"Sayfa koreografisi (`MOTION.scenes`): her sayfada öğeler sırayla girer. Story: {t['foto'].rstrip('.')} ({w['story']}); "
         "telefonda foto penceresi ≥ 38vw (sığmazsa basamaklı/alt alta düzen, comp sapması olarak yazılır — docs/11 §9). "
         "Parçacıklar `MOTION.accents` (§8: tür başına dosya ve yol). Details/rsvp: kart, satırlar ve buton sırayla.",
         "Foto alanları: `hero_portrait` (card_small penceresi), `story_1..3` (frame_portrait), `venue` (frame_landscape); "
         "kutu ve maske `windows.json`'dan (§5.6, §9). PAKET 2 fotoğrafı yoksa yer tutucu.",
         *ekler,
         f"Fontlar: {f1} + {f2} (Google Fonts link'i; repoya font dosyası girmez). Tarih motor biçimiyle (`May 15, 2027`). "
         "Link blokları `data-if=\"urls.*\"` ile linksiz kalkar — \"link will be added soon\" diyen ölü düğme yok (§4).",
         f"Testler ve önizleme (§13): `platform/tests/theme-{slug}.test.ts`; `theme-check --theme {slug}` (5 genişlik, kısa "
         f"telefonlar, akışlar, ağırlık, MP4); `platform/previews/g4{n}/` (W1 comp | tema karşılaştırmaları dahil)."],
        ["docs/11 §15 kontrol listesi tamam (atlanan madde Sonuç'ta gerekçesiyle)",
         f"`npm test`, `npm run typecheck`, `npm run build` (trace-check) geçti; `tests/theme-{slug}.test.ts` (§13.2)",
         f"`theme-check --theme {slug}` hatasız; `previews/g4{n}/` + `compare_<sayfa>_390.jpg` qa-kontrol incelemesinden geçti",
         "Sonuç dürüst: açılış ve story tarifi, comp sapmaları, denenmeyenler (gerçek iPhone/Safari, yayın), sorunlu GPT parçaları"],
        oncelik=2 if t["no"] in (1, 4, 5) else 3)


def tasks(t):
    n, k = f"{t['no']:02d}", f"collections/{t['klasor']}"
    ref = "collections/02_Dusty_Blue/video/invitation_motion.html"
    prev = f"{k}/previews/html/" if t.get("mevcut") else f"{k}/previews/"
    return {
        f"G1{n}-kaynak": task_md(
            f"G1{n}", f"Tasarım {n} {t['ad']} — HTML sahne kaynağı + katmanlar", "claude-kod", [],
            [f"{k}/video/", f"{k}/assets/layers/", f"{k}/kit_map.json", prev],
            f"Tasarım {n}'in 6 sahnelik 1080×1920 animasyon kaynağını kodla (HTML/CSS/SVG) kurmak ve Canva'ya gidecek ayrı katmanları çıkarmak. Şekiller koddan, yüzeyler (doku/dekor) GPT görsellerinden gelir.",
            [f"`{k}/DESIGN_BRIEF.md` (zarf, foto sunumu, dekor, sahneler)", f"`{k}/content.demo.json`, `{k}/palette.json`",
             f"Örnek yapı: `{ref}` + `collections/02_Dusty_Blue/assets/layers/layers.json`", "`tools/export_layers.mjs`, `tools/render_motion.mjs`",
             f"Varsa GPT görselleri: `{k}/assets/gpt/` (yoksa koddan yer tutucu yüzey kullan)", "`docs/07_KIT_STANDARDI.md` §6 (genel kit_map)"],
            [f"`{k}/video/invitation_motion.html`: 6 sahne, ~26 sn; brief'teki zarf mekaniği ve foto sunumu **gerçekten** ayrı nesnelerle hareket etsin.",
             "Görselde metin yok: bütün metinler HTML metni (Canva'da metin olacak). Fontlar Google Fonts link'iyle; font dosyası koyma.",
             f"`{k}/assets/layers/layers.json` + `export_layers.mjs` ile şeffaf katmanlar → `{k}/assets/layers/` (zarf parçaları, kapanış elemanı, kart, çerçeveler, dekor, arka plan ayrı ayrı).",
             f"`{k}/kit_map.json`: her katman için kaynak GPT dosyası ve yöntem (`docs/07_KIT_STANDARDI.md` §6).",
             f"Önizleme: `render_motion.mjs` ile MP4 + 6 anahtar kare → `{prev}`.",
             "Diğer 19 tasarımla karıştırılmayacak kadar farklı olmalı (katalogdaki eksenler)."],
            ["MP4 önizleme oynuyor; 6 sahne var", "Katmanlar ayrı ve şeffaf; metin pişirilmemiş", "kit_map.json geçerli JSON"]),
        **(dict([g2_gorev(t)]) if t["no"] in WEB else {}),  # 03: G203 blokajda, G030 karşıladı
        f"G3{n}-canva": task_md(
            f"G3{n}", f"Tasarım {n} {t['ad']} — Canva video master", "claude-canva", [f"G1{n}", f"G2{n}", "G002"],
            [f"{k}/canva/", f"{k}/kit_layers/"],
            f"Tasarım {n}'in düzenlenebilir Canva video master'ını kurmak (6 sayfa, ayrı katmanlar, Canva metni).",
            [f"`{k}/assets/layers/`, `{k}/kit_map.json`, `{k}/assets/gpt/`", "`tools/kit_build.py`", "`canva-guvenli-duzenleme` skill",
             "Yöntem örneği: tasarım 02 (`collections/02_Dusty_Blue/canva/`)"],
            ["`kit_build` → katmanları Canva'ya yükle → fontlu temel sayfa → 6 sayfa → yerleşim (taslak).",
             "Önizleme → onay → commit → yeniden oku.", f"`{k}/canva/ASSET_MAP.json` ve `TEXT_SLOTS.json` yaz."],
            ["Kayıtlı master; design ID ve edit link entegratöre bildirildi"], oncelik=3),
        **set_tasks(t),
        **faz2_tasks(t),
    }


def set_tasks(t):
    """Paketin geri kalanı: website, PDF/story, Canva set, metinler, mockup, ilan kiti, UI işleri, QA."""
    n, k = f"{t['no']:02d}", f"collections/{t['klasor']}"
    pilot = "tasarım 02 pilot hattı (`collections/02_Dusty_Blue/`)"
    return {
        **(dict([g4_gorev(t)]) if t["no"] in WEB else {}),  # 03: G403 blokajda, G035/G038 karşıladı
        f"G5{n}-baski-kaynak": task_md(
            f"G5{n}", f"Tasarım {n} {t['ad']} — A3 5×7 davetiye + A4 story/kare kaynakları", "claude-kod", ["G022"], [f"{k}/print/"],
            f"Tasarım {n}'in baskı/telefon davetiyesi ve paylaşım görsellerinin HTML kaynakları.",
            [f"`{k}/DESIGN_BRIEF.md`, `{k}/content.demo.json`, `{k}/palette.json`", "Pilot: `collections/02_Dusty_Blue/print/` (G022 çıktısı)"],
            ["`invitation_5x7.html` (1500×2100), `story.html` (1080×1920), `square.html` (1080×1080); `data-document-role=\"page\"`.",
             "RSVP/website linki yer tutucu; PNG önizlemeler `print/previews/`."],
            ["3 kaynak + önizlemeler; metin içerik kaydıyla birebir"], oncelik=3),
        f"G6{n}-canva-set": task_md(
            f"G6{n}", f"Tasarım {n} {t['ad']} — Canva website + PDF + story/kare", "claude-canva", [f"G3{n}", f"G4{n}", f"G5{n}", "G021", "G023"],
            [f"{k}/canva/", f"{k}/package/customer/"],
            f"Tasarım {n}'in A2–A4 parçalarını Canva'da düzenlenebilir kurmak ve export etmek.",
            [f"`{k}/website/`, `{k}/print/`, `{k}/kit_layers/`", f"Yöntem: {pilot} G021/G023"],
            ["Website, 5×7 PDF davetiye, story ve kare tasarımlarını kur (taslak → önizleme → commit → yeniden oku).",
             "PDF/PNG export al; link testleri (yer tutucuysa 'test edilmedi').", f"Design ID'leri `{k}/canva/DESIGNS.json`'a yaz."],
            ["4 Canva tasarımı kayıtlı; export dosyaları `package/customer/`"], oncelik=4),
        f"G7{n}-metinler": task_md(
            f"G7{n}", f"Tasarım {n} {t['ad']} — A5 kılavuz + B3 Etsy ilan metni", "claude-metin", ["G024", "G025"],
            [f"{k}/package/customer/START_HERE.md", f"{k}/package/listing/listing.md"],
            f"Tasarım {n} için alıcı kılavuzu ve Etsy ilan metni (İngilizce).",
            [f"`{k}/DESIGN_BRIEF.md`, `{k}/content.demo.json`", "Pilot metinler: `collections/02_Dusty_Blue/package/customer/START_HERE.md`, `.../listing/listing.md`"],
            ["Kılavuz: pilotla aynı bölüm yapısı; tasarıma özgü kısımlar (zarf, foto değiştirme) bu tasarıma göre.",
             "İlan: başlık ≤140, 13 etiket ≤20 karakter, açıklama, SSS, alıcı mesajı; tasarımın kendine özgü sözcükleri (ör. airmail, art deco).",
             "Ticari alanlar `[PLACEHOLDER]`, doğrulanmamış iddialar `[VERIFY]`."],
            ["İki dosya da dolu; yer tutucular işaretli"], oncelik=3),
        f"G8{n}-mockup": task_md(
            f"G8{n}", f"Tasarım {n} {t['ad']} — Paket 3 mockup görselleri", "gpt-gorsel", [], [f"{k}/assets/gpt/mockups/"],
            f"Tasarım {n}'in ilan mockup'ları (telefon, laptop, kart; yeşil ekran).",
            [f"`{k}/assets/gpt/GPT_PROMPTS.md` → PAKET 3"],
            ["3 prompt'u aynen kullan; yeşil alan düz #00FF00; nesneler eğik değil."],
            ["3 dosya doğru yolda"], oncelik=4),
        f"G9{n}-ilan-kiti": task_md(
            f"G9{n}", f"Tasarım {n} {t['ad']} — B1–B3 Etsy ilan kiti montajı", "claude-kod", [f"G6{n}", f"G7{n}", f"G8{n}", "G026", "G028"],
            [f"{k}/package/listing/"],
            f"Tasarım {n}'in ilan görselleri, ilan videosu ve ilan PDF'ini üretmek.",
            [f"Export'lar: `{k}/package/customer/`, video önizleme `{k}/previews/`", f"Mockup'lar `{k}/assets/gpt/mockups/`", "`tools/mockup_compose.py` (G028), `tools/md_to_pdf.py` (G026)"],
            ["B1: kapak + video/website/PDF mockup'ları + What's included + How it works + düzenleme örneği (2000×2000 veya Etsy'nin güncel önerisi; kaynağı yaz).",
             "B2: kısa sessiz tanıtım klibi (video export'tan; Etsy süre/boyut kuralı yükleme öncesi doğrulanacak — doğrulanmadıysa yaz).",
             "B3: `listing.md` → `listing.pdf` (md_to_pdf, palette)."],
            ["`package/listing/` altında görseller, video, PDF"], oncelik=4),
        f"GA{n}-canva-ui": task_md(
            f"GA{n}", f"Tasarım {n} {t['ad']} — video animasyonu + video template link (Canva arayüzü)", "claude-tarayici", ["G004", f"G3{n}"],
            [f"{k}/canva/"],
            f"Tasarım {n}'in video master'ına Canva arayüzünde animasyon/zamanlama eklemek, MP4 ile kontrol etmek ve video template link'i oluşturmak.",
            ["`gorevler/roller/claude-tarayici.md` §3", f"`{k}/DESIGN_BRIEF.md` (sahne hareketleri)", "Örnek plan: `collections/02_Dusty_Blue/canva/ANIMATION_STEPS.md`", f"`{k}/canva/DESIGNS.json` (video design ID)"],
            [f"`{k}/canva/ANIMATION_STEPS.md` yoksa brief'ten yaz (sahne/öğe/etki/gecikme/sayfa süresi).",
             "Rehber §3'e göre animasyon + zamanlama + geçiş; MP4 kontrolü.", "Video template link → `canva/DESIGNS.json`."],
            ["MP4'te öğeler ayrı ve sırayla hareket ediyor", "Template link kayıtlı"], oncelik=4),
        f"GB{n}-website-form-link": task_md(
            f"GB{n}", f"Tasarım {n} {t['ad']} — website Form + yayın testi + set template link'leri (Canva arayüzü)", "claude-tarayici", [f"G6{n}"],
            [f"{k}/canva/"],
            f"Tasarım {n}'in website'ine Canva Form (RSVP) eklemek, yayını test etmek ve website/PDF/story/kare template link'lerini oluşturmak.",
            ["`gorevler/roller/claude-tarayici.md` §4", f"`{k}/canva/DESIGNS.json`", f"`{k}/palette.json`"],
            ["Form ekle (alanlar rehberde), yayın testi + kurgu veriyle form gönderimi, sonra yayını kaldır.", "4 template link → `canva/DESIGNS.json`."],
            ["Form çalışıyor (test yanıtı görüldü)", "4 template link kayıtlı"], oncelik=4),
        f"GQ{n}-qa": task_md(
            f"GQ{n}", f"Tasarım {n} {t['ad']} — QA raporu", "claude-qa", [f"G9{n}", f"GA{n}", f"GB{n}"], [f"{k}/QA_RAPORU.md"],
            f"Tasarım {n} setinin satış öncesi denetimi (salt okunur).",
            ["`.claude/agents/qa-kontrol.md`", "`icerik-tutarlilik` skill", "`docs/05_SET_PAKETI.md`"],
            ["A1–A5 ve B1–B3'ü kontrol listesine göre denetle; bulguları önem sırasıyla yaz; diğer 19 tasarıma benzerlik kontrolü."],
            ["Rapor var; kritik bulgu yoksa açıkça yazılı"], oncelik=5),
    }


def faz2_tasks(t):
    """Aşama 2: tasarıma ek 5 renk paleti (G090 kapısından sonra)."""
    n, k = f"{t['no']:02d}", f"collections/{t['klasor']}"
    return {
        f"GP1{n}-palet-prompt": task_md(
            f"GP1{n}", f"Aşama 2 · Tasarım {n} — 5 ek palet + prompt dosyaları", "claude-canva", ["G090"], [f"{k}/variants/"],
            f"Tasarım {n} için orijinale ek 5 renk paleti seçmek ve her biri için prompt dosyası yazmak.",
            [f"`{k}/DESIGN_BRIEF.md`, `{k}/palette.json`, `{k}/assets/gpt/GPT_PROMPTS.md`", "Örnek: `collections/02_Dusty_Blue/variants/`, `tools/variant_prompts.py`"],
            ["5 palet: tasarımın ruhuna uygun, birbirinden ve orijinalden belirgin farklı; isim + hex token'lar.",
             f"`{k}/variants/Vxx_<ad>/palette.json` + `assets/gpt/GPT_PROMPTS.md` (Paket 1 + Paket 3, renk sözcükleri değişmiş)."],
            ["5 varyant klasörü hazır"], oncelik=6),
        f"GP2{n}-palet-gorsel": task_md(
            f"GP2{n}", f"Aşama 2 · Tasarım {n} — 5 palet görselleri", "gpt-gorsel", [f"GP1{n}"], [f"{k}/variants/"],
            f"Tasarım {n}'in 5 ek paletinin doku/dekor/mockup görselleri.",
            [f"`{k}/variants/*/assets/gpt/GPT_PROMPTS.md`"],
            ["Her varyantta Paket 1 + Paket 3; stil orijinal tasarımla aynı, yalnız renkler değişir."],
            ["5 × tüm dosyalar doğru yolda"], oncelik=6),
        f"GP3{n}-palet-canva": task_md(
            f"GP3{n}", f"Aşama 2 · Tasarım {n} — 5 palet Canva varyantları", "claude-canva", [f"GP2{n}", "G040"], [f"{k}/variants/"],
            f"Tasarım {n}'in bütün Canva tasarımlarını (video, website, PDF, story/kare) 5 palete çoğaltmak.",
            ["`tools/make_variant.py` (G040) → `canva_plan.json`", f"`{k}/canva/DESIGNS.json`"],
            ["Her palet: copy-design → kit katmanları update_fill → metin renkleri → önizleme → commit → yeniden oku.",
             "Animasyon/template link G004 yoluyla; kopyada korunup korunmadığını kaydet."],
            ["5 × 4 Canva tasarımı kayıtlı; ID'ler `variants/*/canva/DESIGNS.json`"], oncelik=6),
        f"GP4{n}-palet-ilan": task_md(
            f"GP4{n}", f"Aşama 2 · Tasarım {n} — 5 palet ilan kitleri", "claude-kod", [f"GP3{n}", "G028"], [f"{k}/variants/"],
            f"Tasarım {n}'in 5 ek paleti için ilan görselleri ve ilan PDF'leri.",
            [f"`{k}/package/listing/` (orijinal ilan kiti)", "`tools/mockup_compose.py`, `tools/md_to_pdf.py`"],
            ["Her palet için B1 görselleri + B3 PDF (metin orijinalden; renk adı eklenir)."],
            ["5 × `variants/*/package/listing/`"], oncelik=6),
    }


def katalog_md():
    rows = []
    for t in D:
        f1, f2 = t["font"]
        rows.append(f"| {t['no']:02d} | {t['ad']} | {t['zarf'].split(';')[0]} | {t['foto'].split(',')[0]} | {t['dekor']} | {t['teknik']} | {f1} + {f2} | {t['palet_adi']} |")
    return f"""# Tasarım kataloğu — Aşama 1 (20 farklı tasarım)

Kaynak: `tools/katalog.py` (bu dosya oradan üretilir). Plan: `docs/06_FABRIKA_PLANI.md`.

Her tasarım AGENTS.md'deki hikâyeyi izler (zarf açılır → fotoğraflar tek tek → davet ve bilgiler → RSVP),
ama aşağıdaki **6 eksenin en az 4'ünde** diğer her tasarımdan farklıdır (`python3 tools/katalog.py kontrol`).
Stil kuralı: klasik, romantik, zengin, geniş beğeni; ultra-minimal/editoryal yok.

| # | Ad | Zarf / açılış | Foto sunumu | Dekor ailesi | Teknik | Font hedefi | Ana palet |
|---|---|---|---|---|---|---|---|
{chr(10).join(rows)}

Ayrıntı: her koleksiyonun `DESIGN_BRIEF.md` dosyası. 01 ve 02 mevcut koleksiyonlardır; 01 yeni hatta
(G101/G201/G301) yeniden kurulur, 02'nin hattı `G001`–`G027` görevlerindedir.

**Aşama 2:** her tasarıma orijinale **ek** 5 renk paleti → 20 + 100 = **120 ürün**. Paletler tasarıma uygun seçilir
(GP1NN); tasarım 02 için V02–V06 hazır: `collections/02_Dusty_Blue/variants/`. Kapı: G090.

## Website (K22–K24) — Paket 5

Ürün artık mobil öncelikli düğün websitesi (K22; video yok). Her tasarım **kapalı zarf** sayfasıyla açılır; dokununca
zarf tasarıma özgü biçimde açılır, kart home'a geçer; story, details, rsvp sayfaları sıralı koreografiyle girer (K23).
Kişisel metin sitede HTML'dir, görsele pişirilmez (K24). Hat: **G2NN** (GPT: Paket 5 comp + parçalar, Paket 2
fotoğraflar; `assets/gpt/GPT_PROMPTS.md`, `python3 tools/katalog.py paket5`) → **G4NN** (platform teması,
`platform/themes/<tema>/`). Model: tasarım 03 (G030 parçalar, G035 sitesi, G036 fotoğraflar). Sanat yönetimi:
`tools/katalog.py` → `WEB`.

| # | Zarf tipi | Kapanış | Açılış (website) | Accent'ler |
|---|---|---|---|---|
{web_satirlari()}
"""


def web_satirlari():
    rows = []
    for t in D:
        if t["no"] == 3:
            rows.append("| 03 | kapaklı zarf (kare, tırtıklı) | silk ribbon bow | Model (elle: G030 parçalar, G035 site): "
                        "the ribbon slides off, the flap opens on its hinge, the card rises from behind the front pocket "
                        "and flies to home. | rose petals |")
            continue
        if t["no"] not in WEB:
            continue
        w = web(t)
        rows.append(f"| {t['no']:02d} | {ZARF_TIPI[w['tip']][0]} | {w['kapanis_kisa']} | {w['acilis']} | "
                    f"{' · '.join(kisa_ad(a) for a in w['accent'])} |")
    return "\n".join(rows)


def web_kontrol():
    """WEB (website sanat yönetimi) kayıtları: 03 dışındaki her tasarım tam ve tutarlı mı."""
    sorun, acilislar = [], {}
    for t in D:
        if t["no"] == 3:
            if t["no"] in WEB:
                sorun.append("03: WEB kaydı olmamalı (elle yazıldı, üreteç dokunmaz)")
            continue
        n = f"{t['no']:02d}"
        w = WEB.get(t["no"])
        if not w:
            sorun.append(f"{n}: WEB kaydı yok")
            continue
        eksik = [a for a in WEB_ALANLAR if not w.get(a)]
        eksik += [f"foto.{a}" for a in FOTO_ALANLAR if not (w.get("foto") or {}).get(a)]
        p = t.get("p") or {}
        for alan, yedek in (("liner", "liner"), ("bg", "bg"), ("corner", "decor_main"), ("ayirici", "decor_small")):
            if not (w.get(alan) or p.get(yedek)):
                eksik.append(alan)
        if eksik:
            sorun.append(f"{n}: eksik alan: {', '.join(eksik)}")
            continue
        if w["tip"] not in ZARF_TIPI:
            sorun.append(f"{n}: bilinmeyen zarf tipi {w['tip']}")
        if len(w["accent"]) != 3 or len(set(w["accent"])) != 3:
            sorun.append(f"{n}: accent tam 3 farklı nesne olmalı")
        if w["kume"] not in ("florals", "decor"):
            sorun.append(f"{n}: kume florals ya da decor olmalı")
        if not re.fullmatch(r"\d{3,5}×\d{3,5}", w["kapanis_olcu"]):
            sorun.append(f"{n}: kapanis_olcu biçimi (ör. 1024×1024)")
        elif w["tip"] in ZARF_TIPI:
            zolcu = ZARF_TIPI[w["tip"]][1]
            if w.get("sarili") and w["kapanis_olcu"] != zolcu:
                sorun.append(f"{n}: sarili kapanış zarfla aynı tuvalde olmalı (kapanis_olcu {zolcu})")
            if not w.get("sarili") and w["kapanis_olcu"] != "1024×1024":
                sorun.append(f"{n}: sarılı olmayan kapanış kare çizilir (kapanis_olcu 1024×1024)")
        for e in w.get("ekler", []):
            if len(e) not in (6, 7) or not re.fullmatch(r"parts/[a-z0-9_]+\.png", e[0]):
                sorun.append(f"{n}: ekler kaydı (dosya, ölçü, şeffaf, başlık, prompt, kontrol[, düzen]) — {e[0]}")
        pt = w.get("pencere_temiz")
        if pt is not None and (len(pt) != 2 or not all(pt)):
            sorun.append(f"{n}: pencere_temiz (İngilizce ek, Türkçe kontrol) olmalı")
        if w["acilis"] in acilislar:
            sorun.append(f"{n}: açılış cümlesi {acilislar[w['acilis']]} ile aynı")
        acilislar[w["acilis"]] = n
        if not (ROOT / "collections" / t["klasor"] / "content.demo.json").exists():
            sorun.append(f"{n}: content.demo.json yok (comp demo metni)")
        if t["renk"] is None and not (ROOT / "collections" / t["klasor"] / "palette.json").exists():
            sorun.append(f"{n}: renk yok (palette.json)")
    return sorun


def story_kontrol():
    """`STORY`: her tasarımda var, şema sınırlarında, ve her koleksiyonun content.demo.json `story`'si bununla aynı."""
    sorun = []
    for no in sorted(set(STORY) - {t["no"] for t in D}):
        sorun.append(f"STORY: katalogda olmayan tasarım {no:02d}")
    for t in D:
        n = f"{t['no']:02d}"
        if t["no"] not in STORY:
            sorun.append(f"{n}: STORY kaydı yok")
            continue
        intro, basliklar = STORY[t["no"]]
        if not isinstance(intro, str) or not intro.strip() or len(intro) > STORY_INTRO_EN_COK:
            sorun.append(f"{n}: story intro boş ya da {STORY_INTRO_EN_COK} karakterden uzun")
        elif intro != intro.strip() or intro[-1] in ".,;:!?":
            sorun.append(f"{n}: story intro tarihle birleşen bir cümle parçasıdır (boşluk/noktalamayla bitmez)")
        if (not isinstance(basliklar, tuple) or len(basliklar) != 3 or len(set(basliklar)) != 3
                or not all(isinstance(c, str) and c.strip() and len(c) <= STORY_BASLIK_EN_COK for c in basliklar)):
            sorun.append(f"{n}: story tam 3 farklı, boş olmayan, ≤ {STORY_BASLIK_EN_COK} karakter başlık olmalı")
        yol = ROOT / "collections" / t["klasor"] / "content.demo.json"
        if yol.exists():
            var = json.loads(yol.read_text(encoding="utf-8")).get("story")
            if var != story(t):
                sorun.append(f"{n}: content.demo.json story katalogla (STORY) aynı değil — "
                             f"`python3 tools/katalog.py ozet --no {n}`" + (" (03: elle eşitlenir)" if t["no"] == 3 else ""))
    return sorun


def ayirt():
    sorun = []
    for a, b in combinations(D, 2):
        ayni = [e for e in EKSENLER if
                (e == "zarf" and a["zarf"][:25] == b["zarf"][:25]) or
                (e == "foto" and a["foto"][:25] == b["foto"][:25]) or
                (e == "dekor" and a["dekor"] == b["dekor"]) or
                (e == "teknik" and a["teknik"] == b["teknik"]) or
                (e == "font" and (set(a["font"]) & set(b["font"]))) or
                (e == "palet" and a["palet_adi"] == b["palet_adi"])]
        if len(EKSENLER) - len(ayni) < 4:
            sorun.append(f"{a['no']:02d}–{b['no']:02d}: yalnız {len(EKSENLER) - len(ayni)} eksende farklı ({', '.join(ayni)} aynı)")
    return sorun


def ek_ayirt():
    """EK_TEMALAR'daki eksenli kayıtlar (docs/24): D'deki her tasarımdan ve birbirinden ≥4 eksende farklı, hareket
    imzası yazılı ve diğerlerinden farklı."""
    sorun = []
    ekler = [t for t in EK_TEMALAR if all(e in t for e in ("zarf", "foto", "dekor", "teknik", "font", "palet_adi"))]
    for a in ekler:
        if not a.get("hareket"):
            sorun.append(f"{a['no']:02d}: hareket imzası yok")
    for a, b in [(a, b) for a in ekler for b in D] + list(combinations(ekler, 2)):
        ayni = [e for e in EKSENLER if
                (e == "zarf" and a["zarf"][:25] == b["zarf"][:25]) or
                (e == "foto" and a["foto"][:25] == b["foto"][:25]) or
                (e == "dekor" and a["dekor"] == b["dekor"]) or
                (e == "teknik" and a["teknik"] == b["teknik"]) or
                (e == "font" and (set(a["font"]) & set(b["font"]))) or
                (e == "palet" and a["palet_adi"] == b["palet_adi"])]
        if len(EKSENLER) - len(ayni) < 4:
            sorun.append(f"{a['no']:02d}–{b['no']:02d}: yalnız {len(EKSENLER) - len(ayni)} eksende farklı ({', '.join(ayni)} aynı)")
        if a.get("hareket") and a.get("hareket") == b.get("hareket"):
            sorun.append(f"{a['no']:02d}–{b['no']:02d}: hareket imzası aynı")
    return sorun


def yaz(p, metin, zorla, dene=False, degisen=None):
    """Var olan dosyanın üzerine yalnız `zorla` ile yazar; yazdıysa (`dene`: yazacaktıysa) True. İçeriği gerçekten
    değişen (ya da yeni) dosyalar `degisen` listesine eklenir. `dene`: hiçbir şey yazılmaz."""
    if p.exists() and not zorla:
        return False
    if degisen is not None and (not p.exists() or p.read_text(encoding="utf-8") != metin):
        degisen.append(p)
    if not dene:
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(metin, encoding="utf-8")
    return True


def secim(a):
    """--no 04 / --no 04,05 (tekrarlanabilir) → tasarım numaraları; yoksa None (hepsi)."""
    nolar = []
    for i, x in enumerate(a):
        if x == "--no" and i + 1 < len(a):
            nolar += [int(v) for v in a[i + 1].split(",") if v.strip()]
        elif x.startswith("--no="):
            nolar += [int(v) for v in x[5:].split(",") if v.strip()]
    return set(nolar) or None


def hedefler(a):
    nolar = secim(a)
    if nolar and 3 in nolar:
        sys.exit("tasarım 03 elle yazıldı (G030/G035/G036, G203/G403 blokajda); paket5/gorev5 ona dokunmaz")
    bilinmeyen = (nolar or set()) - {t["no"] for t in D}
    if bilinmeyen:
        sys.exit(f"bilinmeyen tasarım: {sorted(bilinmeyen)}")
    return [t for t in D if t["no"] in WEB and (nolar is None or t["no"] in nolar)]


def cmd_paket5(a):
    from kit_check import beklenenler  # noqa: E402 — yalnız sayım özeti için
    import tempfile
    dene, degisen = "--dene" in a, 0
    for t in hedefler(a):
        yol = ROOT / "collections" / t["klasor"] / "assets/gpt/GPT_PROMPTS.md"
        eski = yol.read_text(encoding="utf-8") if yol.exists() else ""
        p3_yenile = "--paket3" in a and t["no"] in MOCK
        if p3_yenile:
            mock_dir = yol.parent / "mockups"
            uretilmis = [x.name for x in mock_dir.glob("*") if x.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp")] \
                if mock_dir.exists() else []
            if uretilmis:
                print(f"PAKET 3 korunur: {mock_dir.relative_to(ROOT)} içinde üretilmiş mockup var ({', '.join(uretilmis)})")
                p3_yenile = False
        yeni = gpt_prompts_md(t, eski, p3_yenile)
        with tempfile.TemporaryDirectory() as g:
            gy = Path(g) / "GPT_PROMPTS.md"
            gy.write_text(yeni, encoding="utf-8")
            say = {}
            for b in beklenenler(gy):
                say[b["paket"]] = say.get(b["paket"], 0) + 1
        durum = "aynı" if yeni == eski else ("yazılacak" if dene else "yazıldı")
        if yeni != eski:
            degisen += 1
            if not dene:
                yol.write_text(yeni, encoding="utf-8")
        print(f"{durum:<9} {yol.relative_to(ROOT)} · PAKET 5: {say.get(5, 0)} · PAKET 2: {say.get(2, 0)} · "
              f"PAKET 3: {say.get(3, 0)}")
    print(f"\n{degisen} dosya {'değişecek' if dene else 'değişti'}")
    sys.exit(1 if dene and degisen else 0)


def mevcut_story_metni(yol, t):
    """01/02 (elle yazılmış kayıt): `story` katalogla aynıysa dosya metni aynen; değilse yalnız `story` değişmiş kayıt
    (öteki alanlar ve sıraları korunur; dosya `json.dumps(indent=2)` biçimine geçer)."""
    eski = yol.read_text(encoding="utf-8")
    var = json.loads(eski)
    if var.get("story") == story(t):
        return eski
    return json.dumps({**var, "story": story(t)}, indent=2, ensure_ascii=False) + "\n"


def cmd_ozet(a):
    """DESIGN_BRIEF.md (01, 04–20) ve content.demo.json (katalogdan açılmış 04–20) katalogdan yeniden yazılır; 01 ve 02'nin
    elle yazılmış content.demo.json'ında yalnız `story` (`STORY`) eşitlenir. 02'nin brief'i (elle, G001–G027) ve 03 (elle)
    atlanır; elle genişletilmiş content.demo.json (katalogda olmayan anahtar) korunur."""
    dene, degisen = "--dene" in a, 0
    for t in hedefler(a):
        k = ROOT / "collections" / t["klasor"]
        yol = k / "content.demo.json"
        isler = [] if t["no"] == 2 else [(k / "DESIGN_BRIEF.md", brief_md(t))]
        if t.get("mevcut"):
            if yol.exists():
                isler.append((yol, mevcut_story_metni(yol, t)))
        else:
            c = content(t)
            var = json.loads(yol.read_text(encoding="utf-8")) if yol.exists() else {}
            fazla = sorted(set(var) - set(c))
            if fazla:
                print(f"atlandı   {yol.relative_to(ROOT)} (elle eklenmiş alan: {', '.join(fazla)})")
            else:
                isler.append((yol, json.dumps(c, indent=2, ensure_ascii=False) + "\n"))
        for yol, yeni in isler:
            eski = yol.read_text(encoding="utf-8") if yol.exists() else ""
            if yeni != eski:
                degisen += 1
                if not dene:
                    yol.write_text(yeni, encoding="utf-8")
            print(f"{'aynı' if yeni == eski else ('yazılacak' if dene else 'yazıldı'):<9} {yol.relative_to(ROOT)}")
    print(f"\n{degisen} dosya {'değişecek' if dene else 'değişti'}")
    sys.exit(1 if dene and degisen else 0)


def gunluk_satirlari(metin):
    if "## Günlük" not in metin:
        return []
    return [s for s in metin.split("## Günlük", 1)[1].splitlines() if s.startswith("- ")]


def gorev_metni(metin, eski):
    satirlar = gunluk_satirlari(eski) if eski else []
    if YENIDEN_TANIM not in satirlar:
        satirlar.append(YENIDEN_TANIM)
    return metin.rstrip("\n") + "\n\n## Günlük\n" + "\n".join(satirlar) + "\n"


def cmd_gorev5(a):
    dene, degisen = "--dene" in a, 0
    for t in hedefler(a):
        for ad, metin in (g2_gorev(t), g4_gorev(t)):
            gid = ad.split("-")[0]
            var = sorted((ROOT / "gorevler").glob(f"{gid}-*.md"))
            yol = var[0] if var else ROOT / "gorevler" / f"{ad}.md"
            eski = yol.read_text(encoding="utf-8") if yol.exists() else ""
            m = re.search(r"^durum:\s*(\S+)", eski, re.M)
            if m and m.group(1) in ("alindi", "inceleme", "bitti"):
                print(f"atlandı   {yol.relative_to(ROOT)} (durum {m.group(1)} — elle dokunulmaz)")
                continue
            yeni = gorev_metni(metin, eski)
            if yeni != eski:
                degisen += 1
                if not dene:
                    yol.write_text(yeni, encoding="utf-8")
            print(f"{'aynı' if yeni == eski else ('yazılacak' if dene else 'yazıldı'):<9} {yol.relative_to(ROOT)}")
    print(f"\n{degisen} görev dosyası {'değişecek' if dene else 'değişti'}")
    sys.exit(1 if dene and degisen else 0)


def main(a):
    zorla = "--zorla" in a
    if a and a[0] == "kontrol":
        s = ayirt()
        print("\n".join(s) if s else f"ayırt edicilik: {len(D)} tasarım, her çift ≥4 eksende farklı")
        w = web_kontrol()
        print("\n".join(w) if w else f"website (WEB): {len(WEB)} tasarım tam (03 elle yazıldı)")
        h = story_kontrol()
        print("\n".join(h) if h else f"story (STORY): {len(STORY)} tasarım; content.demo.json kayıtlarıyla aynı")
        e = ek_ayirt()
        n_ek = sum(1 for t in EK_TEMALAR if "zarf" in t)
        print("\n".join(e) if e else f"ek tasarımlar (docs/24): {n_ek} kayıt, her biri D'den ve birbirinden ≥4 eksende farklı, hareket imzası ayrı")
        sys.exit(1 if s or w or h or e else 0)
    if a and a[0] == "paket5":
        return cmd_paket5(a[1:])
    if a and a[0] == "gorev5":
        return cmd_gorev5(a[1:])
    if a and a[0] == "ozet":
        return cmd_ozet(a[1:])
    if a and a[0] == "belge":
        yaz(ROOT / "docs/09_TASARIM_KATALOGU.md", katalog_md(), True)
        print("docs/09_TASARIM_KATALOGU.md yazıldı")
        return
    if a and a[0] != "yaz":
        sys.exit(__doc__)
    s = ayirt()
    if s:
        sys.exit("ayırt edicilik sorunu:\n" + "\n".join(s))
    dene, degisen = "--dene" in a, []

    def y(p, metin, z=zorla):
        return yaz(p, metin, z, dene, degisen)

    y(ROOT / "docs/09_TASARIM_KATALOGU.md", katalog_md(), True)
    say = 0
    for t in D:
        if t["no"] == 2:
            continue
        k = ROOT / "collections" / t["klasor"]
        y(k / "DESIGN_BRIEF.md", brief_md(t))
        y(k / "palette.json", json.dumps({"id": t["palet_adi"], "name": t["ad"], **t["renk"]}, indent=2, ensure_ascii=False) + "\n")
        if not t.get("mevcut"):
            y(k / "content.demo.json", json.dumps(content(t), indent=2, ensure_ascii=False) + "\n")  # story dahil (STORY)
            y(k / "COLLECTION_STATUS.md", status_md(t))
        gp = k / "assets/gpt/GPT_PROMPTS.md"
        if t["no"] != 3:  # 03 elle yazıldı (G030/G035/G036); --zorla bile dokunmaz
            y(gp, gpt_prompts_md(t, gp.read_text(encoding="utf-8") if gp.exists() else "") if t["no"] in WEB
              else prompts_md(t))
        for ad, metin in tasks(t).items():
            say += y(ROOT / "gorevler" / f"{ad}.md", metin)
        if dene:
            continue
        for sub in ("textures", "decor", "mockups"):
            (k / "assets/gpt" / sub).mkdir(parents=True, exist_ok=True)
            (k / "assets/gpt" / sub / ".gitkeep").touch()
    for p in degisen:
        print(f"{'yazılacak' if dene else 'yazıldı':<9} {p.relative_to(ROOT)}")
    if dene:
        print(f"\n{len(degisen)} dosya değişecek" + ("" if zorla else " (var olan dosyalar --zorla olmadan atlanır)"))
        sys.exit(1 if degisen else 0)
    print(f"katalog yazıldı; {say} görev dosyası yazıldı, {len(degisen)} dosyanın içeriği değişti")


if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    main(sys.argv[1:])
