"""Aşama 1 tasarım kataloğu — 20 birbirinden farklı tasarımın tek kaynağı.

  python3 tools/katalog.py yaz      # katalog belgesi + yeni koleksiyon iskeletleri + görevler
  python3 tools/katalog.py kontrol  # ayırt edicilik kontrolü (her çift en az 4 eksende farklı)

Üretilenler (var olan dosyaların üzerine yazmaz; --zorla ile yazar):
  docs/09_TASARIM_KATALOGU.md
  collections/NN_<Ad>/DESIGN_BRIEF.md, palette.json, content.demo.json,
                      COLLECTION_STATUS.md (yalnız yeni koleksiyonda), assets/gpt/GPT_PROMPTS.md
  gorevler/G1NN (kaynak), G2NN (görsel), G3NN (Canva) — 01 ve 03–20 için
Tasarım 02 (Dusty Blue) mevcut görevleriyle yürür; burada yalnız katalogda listelenir.
"""
import json
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
         zarf="Fildişi V kapaklı zarf, zeytin yeşili mum mühür; kapak yukarı açılır, kart yükselir.",
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
         foto="Üç polaroid sırayla uçarak yerleşir.",
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
         cift=("Vivian", "Vivian Grace", "Charles", "Charles Edward"), mekan=("The Grand Lumière Hotel", "Chicago", "Illinois", "America/Chicago"), tarih="2027-12-31",
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
         foto="Varak altın oval çerçeveler, sallanarak asılır.",
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
                decor_main="ferns, moss, small toadstool mushrooms, ivy and tiny glowing fireflies, classic children's storybook illustration with fine ink lines and soft watercolor",
                decor_small="a horizontal sprig of ivy with two tiny mushrooms and a firefly glow",
                frame="four vintage black photo corner mounts placed as a rectangle on an aged book page, the rectangle inside is empty",
                extras=[("decor/storybook_cover.png", "1024×1536", False, "An antique closed storybook seen straight from the front, deep moss-green cloth cover with an embossed gold floral border and an empty oval in the center, no title, no letters, no text, soft warm light, plain light background.")])),
    dict(no=14, klasor="14_Ivory_Lace_Pearl", ad="Ivory Lace & Pearls",
         ruh="Kraliyet zarafeti: fildişi dantel, inci, saten; klasik kilise düğünü.",
         zarf="Dantel kaplı fildişi gatefold; inci tokalı kopça açılır, dantel kanatlar aralanır.",
         foto="Kabartma kamelya (cameo) oval çerçeveler, inci dizisiyle iner.",
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
         cift=("Hana", "Hana Grace", "Ethan", "Ethan Michael"), mekan=("Blossom Hill Gardens", "Washington", "District of Columbia", "America/New_York"), tarih="2027-04-03",
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
         foto="Galeri duvarı: farklı boylarda ince altın çerçeveler mermer duvara asılır.",
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

MOCK = {  # Paket 3 mockup sahne öğeleri: (yüzey, kenar süsleri, zarf)
    1: ("an ivory linen tablecloth", "olive branches, a few green olives and an olive-green silk ribbon", "an ivory envelope with an olive-green wax seal"),
    3: ("a soft blush linen tablecloth", "blush peonies, cream garden roses and a blush silk ribbon", "a deckle-edged blush pink envelope"),
    4: ("an aged wooden writing desk", "a few fictional botanical postage stamps without text, dried flowers and a vintage fountain pen", "a red and navy striped airmail envelope"),
    5: ("a white plaster tabletop with blue and white tiles at the edge", "lemon branches with ripe lemons and white blossoms", "a white envelope with a blue tile-pattern liner"),
    6: ("a dark navy velvet surface", "two crystal champagne coupes, a string of pearls and gold art deco accents", "a deep navy envelope with a gold deco medallion"),
    7: ("a dark walnut table with a burgundy velvet runner", "burgundy dahlias, deep red roses, blackberries and a burgundy velvet ribbon", "a cream envelope tied with a burgundy velvet ribbon"),
    8: ("a white wool blanket with a light dusting of snow", "pine branches, red winter berries, small pine cones and a red velvet ribbon", "a forest green envelope sealed with a pine sprig"),
    9: ("a natural cream linen cloth", "dried lavender bundles tied with twine and small white daisies", "a cream linen pouch tied with jute twine"),
    10: ("a rustic oak table", "grape clusters, vine leaves, olive branches and a cork", "a kraft paper envelope tied with jute twine"),
    11: ("a warm sand-colored stucco surface", "pampas grass plumes, dried palm spears and bunny tails", "an arch-shaped terracotta envelope"),
    12: ("a light rattan tray on white sand", "monstera leaves, pink hibiscus, white plumeria and a few seashells", "a palm-leaf patterned travel wallet"),
    13: ("a mossy wooden tabletop", "ferns, moss, small mushrooms and tiny warm fairy lights", "an antique green storybook with an embossed gold border and no title"),
    14: ("an ivory satin cloth", "white garden roses, a strand of pearls and a piece of ivory lace", "an ivory lace-covered gatefold envelope with a pearl clasp"),
    15: ("a pale grey stone surface", "cherry blossom branches and scattered pink petals", "a pale grey envelope with a cherry blossom liner"),
    16: ("a weathered barn-wood table", "sunflowers, wheat stalks, white daisies and a mustard gingham ribbon", "a kraft envelope tied with a gingham ribbon"),
    17: ("a white Carrara marble surface", "emerald velvet ribbon, gold candle holders and eucalyptus", "an emerald green envelope with a gold seal"),
    18: ("a soft white cotton cloth", "fresh wildflowers — poppies, cornflowers, daisies — and a sheet of translucent vellum", "a translucent vellum wrap with a pressed-flower label"),
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


def cumartesi(iso):
    d = date.fromisoformat(iso)
    return d + timedelta(days=(5 - d.weekday()) % 7)


def content(t):
    a, af, b, bf = t["cift"]
    mekan, sehir, bolge, tz = t["mekan"]
    d = cumartesi(t["tarih"])
    tz_saat = ["16:00", "17:00", "18:30"]
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
        "optional_blocks": {"our_story": True, "countdown": False, "dress_code": True, "registry": True,
                            "travel_stay": True, "faq": False, "guest_policy": False},
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
    lines += ["---", "", f"## PAKET 3 — Etsy ilan mockup'ları (görev G8{t['no']:02d})", "",
              "Ekran ve kart yüzeyleri **düz yeşil (#00FF00)**; tasarım oraya yerleştirilecek. Nesneler düz, eğik değil.", ""]
    for i, (dosya, olcu, baslik, prompt) in enumerate(mockups(t), 1):
        lines += [f"### 3.{i} {baslik}", f"**Kaydet:** `{k}/assets/gpt/{dosya}` · {olcu}", "", "```", prompt, "```",
                  "Kontrol: yeşil alan tamamen düz ve tek renk; nesne düz duruyor; yazı/logo yok.", ""]
    return "\n".join(lines)


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


def tasks(t):
    n, k = f"{t['no']:02d}", f"collections/{t['klasor']}"
    ref = "collections/02_Dusty_Blue/video/invitation_motion.html"
    prev = f"{k}/previews/html/" if t.get("mevcut") else f"{k}/previews/"
    return {
        f"G1{n}-kaynak": task_md(
            f"G1{n}", f"Tasarım {n} {t['ad']} — HTML sahne kaynağı + katmanlar", "gpt-kod", [],
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
        f"G2{n}-gorsel": task_md(
            f"G2{n}", f"Tasarım {n} {t['ad']} — GPT görselleri (Paket 1)", "gpt-gorsel", [],
            [f"{k}/assets/gpt/textures/", f"{k}/assets/gpt/decor/"],
            f"Tasarım {n}'in doku ve dekor görsellerini üretmek (Paket 1; mockup'lar ayrı görev G8{n}).",
            [f"`{k}/assets/gpt/GPT_PROMPTS.md` → PAKET 1", f"`{k}/DESIGN_BRIEF.md`"],
            ["PAKET 1 prompt'larını sırayla, aynen kullan; bütün parçalar aynı illüstrasyon tekniğinde olsun.",
             "Şeffaf istenenler gerçek alfa kanallı PNG; yazı/harf/rakam/logo yok.",
             f"`python3 tools/kit_check.py {k}` hazırsa çalıştır (G003)."],
            ["Listelenen bütün dosyalar doğru yolda", "Sonuç'ta reddedilip yeniden üretilen parçalar notu"]),
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
        f"G4{n}-website-kaynak": task_md(
            f"G4{n}", f"Tasarım {n} {t['ad']} — A2 website HTML kaynağı", "gpt-kod", ["G020"], [f"{k}/website/"],
            f"Tasarım {n}'in tek sayfa responsive website kaynağı (Canva Website'a aktarılacak).",
            [f"`{k}/DESIGN_BRIEF.md`, `{k}/content.demo.json`, `{k}/palette.json`", f"Pilot: `collections/02_Dusty_Blue/website/` (G020 çıktısı) — aynı bölüm yapısı",
             f"`{k}/assets/layers/`, varsa `{k}/kit_layers/` ve `{k}/assets/gpt/`"],
            ["Pilotla aynı bölümler ve aynı dosya düzeni (`index.html`, `canva_import.html`, `previews/`); görsel dil bu tasarımın brief'inden.",
             "Gerçek URL yok; RSVP bölümü Canva Form yer tutucusu; fontlar Google Fonts link'i.",
             "Playwright 360/390/430/768/1280 px ekran görüntüleri."],
            ["Yatay kaydırma yok; içerik kaydıyla birebir", "canva_import.html sayfa işaretli"], oncelik=3),
        f"G5{n}-baski-kaynak": task_md(
            f"G5{n}", f"Tasarım {n} {t['ad']} — A3 5×7 davetiye + A4 story/kare kaynakları", "gpt-kod", ["G022"], [f"{k}/print/"],
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
            f"G7{n}", f"Tasarım {n} {t['ad']} — A5 kılavuz + B3 Etsy ilan metni", "gpt-metin", ["G024", "G025"],
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
            f"G9{n}", f"Tasarım {n} {t['ad']} — B1–B3 Etsy ilan kiti montajı", "gpt-kod", [f"G6{n}", f"G7{n}", f"G8{n}", "G026", "G028"],
            [f"{k}/package/listing/"],
            f"Tasarım {n}'in ilan görselleri, ilan videosu ve ilan PDF'ini üretmek.",
            [f"Export'lar: `{k}/package/customer/`, video önizleme `{k}/previews/`", f"Mockup'lar `{k}/assets/gpt/mockups/`", "`tools/mockup_compose.py` (G028), `tools/md_to_pdf.py` (G026)"],
            ["B1: kapak + video/website/PDF mockup'ları + What's included + How it works + düzenleme örneği (2000×2000 veya Etsy'nin güncel önerisi; kaynağı yaz).",
             "B2: kısa sessiz tanıtım klibi (video export'tan; Etsy süre/boyut kuralı yükleme öncesi doğrulanacak — doğrulanmadıysa yaz).",
             "B3: `listing.md` → `listing.pdf` (md_to_pdf, palette)."],
            ["`package/listing/` altında görseller, video, PDF"], oncelik=4),
        f"GA{n}-canva-ui": task_md(
            f"GA{n}", f"Tasarım {n} {t['ad']} — animasyon, RSVP formu, yayın, template link", "claude-canva", ["G004", f"G3{n}", f"G6{n}"],
            [f"{k}/canva/"],
            f"Canva API'sinde aracı olmayan işleri G004'te bulunan yolla tasarım {n}'e uygulamak.",
            ["`docs/08_CANVA_UI_BLOKAJ.md`", f"`{k}/DESIGN_BRIEF.md` (sahne hareketleri)", "Örnek adımlar: `collections/02_Dusty_Blue/canva/ANIMATION_STEPS.md`"],
            [f"`{k}/canva/ANIMATION_STEPS.md` yaz (sahne/öğe/animasyon/zaman).", "Animasyon + website Form + yayın + template link'leri uygula; yapılamayanı blokaj olarak yaz (kullanıcıya iş verme).",
             "MP4 export al ve kontrol et."],
            ["Template link'ler `canva/DESIGNS.json`'da; MP4 export denenmiş"], oncelik=4),
        f"GQ{n}-qa": task_md(
            f"GQ{n}", f"Tasarım {n} {t['ad']} — QA raporu", "claude-qa", [f"G9{n}", f"GA{n}"], [f"{k}/QA_RAPORU.md"],
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
            f"GP4{n}", f"Aşama 2 · Tasarım {n} — 5 palet ilan kitleri", "gpt-kod", [f"GP3{n}", "G028"], [f"{k}/variants/"],
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
"""


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


def yaz(p, metin, zorla):
    if p.exists() and not zorla:
        return False
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(metin)
    return True


def main(a):
    zorla = "--zorla" in a
    if a and a[0] == "kontrol":
        s = ayirt()
        print("\n".join(s) if s else f"ayırt edicilik: {len(D)} tasarım, her çift ≥4 eksende farklı")
        sys.exit(1 if s else 0)
    s = ayirt()
    if s:
        sys.exit("ayırt edicilik sorunu:\n" + "\n".join(s))
    yaz(ROOT / "docs/09_TASARIM_KATALOGU.md", katalog_md(), True)
    say = 0
    for t in D:
        if t["no"] == 2:
            continue
        k = ROOT / "collections" / t["klasor"]
        yaz(k / "DESIGN_BRIEF.md", brief_md(t), zorla)
        yaz(k / "palette.json", json.dumps({"id": t["palet_adi"], "name": t["ad"], **t["renk"]}, indent=2, ensure_ascii=False) + "\n", zorla)
        yaz(k / "assets/gpt/GPT_PROMPTS.md", prompts_md(t), zorla)
        for sub in ("textures", "decor"):
            (k / "assets/gpt" / sub).mkdir(parents=True, exist_ok=True)
            (k / "assets/gpt" / sub / ".gitkeep").touch()
        if not t.get("mevcut"):
            yaz(k / "content.demo.json", json.dumps(content(t), indent=2, ensure_ascii=False) + "\n", zorla)
            yaz(k / "COLLECTION_STATUS.md", status_md(t), zorla)
        for ad, metin in tasks(t).items():
            say += yaz(ROOT / "gorevler" / f"{ad}.md", metin, zorla)
        (k / "assets/gpt/mockups").mkdir(parents=True, exist_ok=True)
        (k / "assets/gpt/mockups/.gitkeep").touch()
    print(f"katalog yazıldı; {say} yeni görev dosyası")


if __name__ == "__main__":
    main(sys.argv[1:])
