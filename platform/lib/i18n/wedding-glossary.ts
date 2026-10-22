// G150: a curated wedding glossary in front of the automatic translation of the couple's own texts
// (lib/i18n/auto-translate.ts). Live, the free service turned the schedule label "Reception" into Turkish "Alım" (the
// "receiving" sense). Short wedding labels are where machine translation fails most, and they are what every new
// website starts with (the designs' demo content: "Ceremony", "Cocktail Hour", "Reception", "Together with their
// families", "Black tie" …), so these are translated here by hand, the way weddings are worded in each language.
//
// How it is used (translateWithGlossary):
//   1. the whole text is one glossary term (case, spacing, punctuation, "&"/"and" ignored)   → the glossary's wording;
//   2. it is a few terms joined by ":", "·", "|", "/", "&", ",", "and" … ("Dress code: Black tie") → each term;
//   3. a text of several lines where some lines are terms → those lines here, the others by the machine;
//   4. anything else (a sentence)                                                              → the machine translator.
// Terms inside a longer sentence are not protected: neither the device's translator nor the free service has a
// "do not translate" markup, and placeholders come back mangled. The result is a draft the couple approves.
//
// Every row is one term in the five languages (en, tr, es, de, fr); any of them can be the source (a website written in
// Turkish translated to German looks up the Turkish column). For a source wording shared by several rows the first row
// wins, so the usual sense comes first. Wording stays close to the site's fixed texts (lib/i18n/dict/site): the same
// "Tören", "Resepsiyon", "Trauung", "Kıyafet kuralı" a guest reads in the design's own headings.

import { LANG_TAGS, LANGS, type Lang } from './langs.ts';

type Row = readonly [en: string, tr: string, es: string, de: string, fr: string];

export const WEDDING_GLOSSARY: readonly Row[] = [
  // ---- the day: who invites, what happens
  ['Together with their families', 'Aileleriyle birlikte', 'Junto a sus familias', 'Gemeinsam mit ihren Familien', 'Entourés de leurs familles'],
  ['Together with our families', 'Ailelerimizle birlikte', 'Junto a nuestras familias', 'Gemeinsam mit unseren Familien', 'Entourés de nos familles'],
  ['Wedding', 'Düğün', 'Boda', 'Hochzeit', 'Mariage'],
  ['Our wedding', 'Düğünümüz', 'Nuestra boda', 'Unsere Hochzeit', 'Notre mariage'],
  ['Save the date', 'Bu tarihi ayırın', 'Reserve la fecha', 'Save the Date', 'Réservez la date'],
  ['Engagement party', 'Nişan', 'Fiesta de compromiso', 'Verlobungsfeier', 'Fête de fiançailles'],
  ['Henna night', 'Kına gecesi', 'Noche de henna', 'Henna-Abend', 'Soirée henné'],
  ['Ceremony', 'Tören', 'Ceremonia', 'Trauung', 'Cérémonie'],
  ['The ceremony', 'Tören', 'La ceremonia', 'Die Trauung', 'La cérémonie'],
  ['Wedding ceremony', 'Nikâh töreni', 'Ceremonia de boda', 'Trauung', 'Cérémonie de mariage'],
  ['Civil ceremony', 'Nikâh', 'Ceremonia civil', 'Standesamtliche Trauung', 'Cérémonie civile'],
  ['Religious ceremony', 'Dini tören', 'Ceremonia religiosa', 'Kirchliche Trauung', 'Cérémonie religieuse'],
  ['Ceremony & reception', 'Tören ve resepsiyon', 'Ceremonia y recepción', 'Trauung & Feier', 'Cérémonie et réception'],
  ['Reception', 'Resepsiyon', 'Recepción', 'Feier', 'Réception'],
  ['The reception', 'Resepsiyon', 'La recepción', 'Die Feier', 'La réception'],
  ['Wedding reception', 'Düğün resepsiyonu', 'Recepción de boda', 'Hochzeitsfeier', 'Réception de mariage'],
  ['Cocktail hour', 'Kokteyl', 'Cóctel', 'Sektempfang', "Vin d'honneur"],
  ['Cocktail reception', 'Kokteyl', 'Cóctel', 'Sektempfang', "Vin d'honneur"],
  ['Cocktails', 'Kokteyl', 'Cócteles', 'Cocktails', 'Cocktails'],
  ['Welcome drinks', 'Karşılama kokteyli', 'Copa de bienvenida', 'Begrüßungsdrink', 'Verre de bienvenue'],
  ['Welcome party', 'Karşılama partisi', 'Fiesta de bienvenida', 'Willkommensfeier', 'Soirée de bienvenue'],
  ['Welcome dinner', 'Karşılama yemeği', 'Cena de bienvenida', 'Willkommensdinner', 'Dîner de bienvenue'],
  ['Rehearsal dinner', 'Düğün öncesi akşam yemeği', 'Cena de ensayo', 'Dinner am Vorabend', 'Dîner de la veille'],
  ['Guest arrival', 'Misafirlerin karşılanması', 'Llegada de los invitados', 'Ankunft der Gäste', 'Accueil des invités'],
  ['Arrival', 'Karşılama', 'Llegada', 'Ankunft', 'Accueil'],
  ['Photos', 'Fotoğraflar', 'Fotos', 'Fotos', 'Photos'],
  ['Group photos', 'Toplu fotoğraflar', 'Fotos de grupo', 'Gruppenfotos', 'Photos de groupe'],
  ['Champagne toast', 'Şampanyayla kadeh kaldırma', 'Brindis con champán', 'Anstoßen mit Champagner', 'Toast au champagne'],
  ['Toasts', 'Kadeh kaldırma', 'Brindis', 'Trinksprüche', 'Toasts'],
  ['Speeches', 'Konuşmalar', 'Discursos', 'Reden', 'Discours'],
  ['Speeches & toasts', 'Konuşmalar ve kadeh kaldırma', 'Discursos y brindis', 'Reden & Trinksprüche', 'Discours et toasts'],
  ['Dinner', 'Akşam yemeği', 'Cena', 'Abendessen', 'Dîner'],
  ['Wedding dinner', 'Düğün yemeği', 'Banquete', 'Hochzeitsessen', 'Dîner de mariage'],
  ['Wedding breakfast', 'Düğün yemeği', 'Banquete nupcial', 'Hochzeitsessen', 'Repas de noces'],
  ['Lunch', 'Öğle yemeği', 'Almuerzo', 'Mittagessen', 'Déjeuner'],
  ['Brunch', 'Brunch', 'Brunch', 'Brunch', 'Brunch'],
  ['Farewell brunch', 'Veda kahvaltısı', 'Brunch de despedida', 'Abschiedsbrunch', "Brunch d'au revoir"],
  ['Dancing', 'Dans', 'Baile', 'Tanz', 'Soirée dansante'],
  ['Dinner & dancing', 'Akşam yemeği ve dans', 'Cena y baile', 'Abendessen & Tanz', 'Dîner et soirée dansante'],
  ['First dance', 'İlk dans', 'Primer baile', 'Eröffnungstanz', 'Ouverture du bal'],
  ['Cake cutting', 'Pasta kesimi', 'Corte de la tarta', 'Tortenanschnitt', 'Découpe du gâteau'],
  ['Fireworks', 'Havai fişek gösterisi', 'Fuegos artificiales', 'Feuerwerk', "Feu d'artifice"],
  ['Late-night snacks', 'Gece atıştırmalıkları', 'Recena', 'Mitternachtssnack', 'En-cas de minuit'],
  ['After party', 'After parti', 'Fiesta', 'Afterparty', 'After-party'],
  ['Afterparty', 'After parti', 'Fiesta', 'Afterparty', 'After-party'],
  // the designs' own demo labels
  ['A toast to love', 'Aşka kadeh kaldırıyoruz', 'Un brindis por el amor', 'Ein Toast auf die Liebe', "Un toast à l'amour"],
  ['Champagne at golden hour', 'Gün batımında şampanya', 'Champán a la hora dorada', 'Champagner zur goldenen Stunde', "Champagne à l'heure dorée"],
  ['Candlelit dinner & dancing', 'Mum ışığında akşam yemeği ve dans', 'Cena a la luz de las velas y baile', 'Abendessen bei Kerzenschein & Tanz', 'Dîner aux chandelles et soirée dansante'],
  ['Ceremony on the lake terrace', 'Göl terasında tören', 'Ceremonia en la terraza del lago', 'Trauung auf der Seeterrasse', 'Cérémonie sur la terrasse du lac'],
  ['Ceremony in the courtyard', 'Avluda tören', 'Ceremonia en el patio', 'Trauung im Innenhof', 'Cérémonie dans la cour'],
  ['Mint tea at sunset', 'Gün batımında nane çayı', 'Té de menta al atardecer', 'Minztee bei Sonnenuntergang', 'Thé à la menthe au coucher du soleil'],
  ['Lantern-lit dinner & dancing', 'Fener ışığında akşam yemeği ve dans', 'Cena a la luz de los faroles y baile', 'Abendessen im Laternenlicht & Tanz', 'Dîner à la lueur des lanternes et soirée dansante'],
  ['Champagne in the grand foyer', 'Büyük fuayede şampanya', 'Champán en el gran vestíbulo', 'Champagner im großen Foyer', 'Champagne dans le grand foyer'],
  ['Dinner in the stalls', 'Salonda akşam yemeği', 'Cena en el patio de butacas', 'Abendessen im Parkett', "Dîner à l'orchestre"],
  ['First dance & encore', 'İlk dans ve bis', 'Primer baile y bis', 'Erster Tanz & Zugabe', 'Première danse et rappel'],

  // ---- dress code
  ['Dress code', 'Kıyafet kuralı', 'Código de vestimenta', 'Dresscode', 'Code vestimentaire'],
  ['Attire', 'Kıyafet', 'Vestimenta', 'Kleidung', 'Tenue'],
  ['Black tie', 'Smokin ve gece elbisesi', 'Etiqueta rigurosa', 'Black Tie (Smoking)', 'Tenue de soirée'],
  ['Black tie optional', 'Smokin isteğe bağlı', 'Etiqueta opcional', 'Black Tie optional', 'Smoking facultatif'],
  ['Black tie, with a touch of romance', 'Smokin ve gece elbisesi, biraz da romantizm', 'Etiqueta rigurosa, con un toque romántico', 'Black Tie mit einem Hauch Romantik', 'Tenue de soirée, avec une touche de romantisme'],
  ['White tie', 'Frak', 'Frac', 'Frack (White Tie)', 'Queue-de-pie'],
  ['Formal', 'Resmi kıyafet', 'Formal', 'Festlich', 'Tenue habillée'],
  ['Formal attire', 'Resmi kıyafet', 'Vestimenta formal', 'Festliche Kleidung', 'Tenue habillée'],
  ['Semi-formal', 'Yarı resmi', 'Semiformal', 'Elegant', 'Tenue de ville chic'],
  ['Cocktail attire', 'Kokteyl kıyafeti', 'Vestimenta de cóctel', 'Cocktailkleidung', 'Tenue de cocktail'],
  ['Evening attire', 'Gece kıyafeti', 'Vestimenta de noche', 'Abendgarderobe', 'Tenue de soirée'],
  ['Smart casual', 'Şık günlük', 'Elegante informal', 'Smart Casual', 'Chic décontracté'],
  ['Casual', 'Günlük', 'Informal', 'Leger', 'Décontracté'],
  ['Garden formal', 'Bahçe şıklığı', 'Elegante de jardín', 'Festlich im Gartenstil', 'Chic champêtre'],
  ['Garden party', 'Bahçe partisi şıklığı', 'Estilo fiesta en el jardín', 'Gartenparty-Chic', 'Garden-party'],
  ['Beach formal', 'Plaj şıklığı', 'Elegante de playa', 'Elegant für den Strand', 'Chic bord de mer'],
  ['Coastal formal', 'Sahil şıklığı', 'Elegante costero', 'Elegant im Küstenstil', 'Chic bord de mer'],
  ['Summer formal', 'Yaz şıklığı', 'Elegante de verano', 'Sommerlich festlich', 'Élégance estivale'],
  ['Spring formal', 'Bahar şıklığı', 'Elegante de primavera', 'Frühlingshaft festlich', 'Élégance printanière'],
  ['Winter formal', 'Kış şıklığı', 'Elegante de invierno', 'Winterlich festlich', 'Élégance hivernale'],
  ['Summer chic', 'Yazlık şık', 'Chic veraniego', 'Sommerlich schick', 'Chic estival'],
  ['Boho chic', 'Boho şık', 'Boho chic', 'Boho-Chic', 'Bohème chic'],
  ['Country chic', 'Kır şıklığı', 'Chic campestre', 'Ländlich schick', 'Chic champêtre'],

  // ---- details, travel, gifts
  ['Details', 'Detaylar', 'Detalles', 'Details', 'Détails'],
  ['The details', 'Ayrıntılar', 'Los detalles', 'Die Details', 'Les détails'],
  ['Good to know', 'Bilmeniz gerekenler', 'Para tener en cuenta', 'Gut zu wissen', 'Bon à savoir'],
  ['Schedule', 'Program', 'Programa', 'Ablauf', 'Programme'],
  ['Order of the day', 'Günün programı', 'Programa del día', 'Tagesablauf', 'Déroulé de la journée'],
  ['Timeline', 'Program akışı', 'Programa', 'Ablauf', 'Déroulé'],
  ['Our story', 'Hikâyemiz', 'Nuestra historia', 'Unsere Geschichte', 'Notre histoire'],
  ['FAQ', 'Sık sorulan sorular', 'Preguntas frecuentes', 'Häufige Fragen', 'Questions fréquentes'],
  ['Questions', 'Sorular', 'Preguntas', 'Fragen', 'Questions'],
  ['Venue', 'Mekân', 'Lugar', 'Location', 'Lieu'],
  ['Getting here', 'Ulaşım', 'Cómo llegar', 'Anreise', 'Comment venir'],
  ['Directions', 'Yol tarifi', 'Cómo llegar', 'Wegbeschreibung', 'Itinéraire'],
  ['Travel', 'Ulaşım', 'Viaje', 'Anreise', 'Accès'],
  ['Travel & stay', 'Ulaşım ve konaklama', 'Viaje y alojamiento', 'Anreise & Unterkunft', 'Venir & se loger'],
  ['Travel & accommodation', 'Ulaşım ve konaklama', 'Viaje y alojamiento', 'Anreise & Unterkunft', 'Transport et hébergement'],
  ['Accommodation', 'Konaklama', 'Alojamiento', 'Unterkunft', 'Hébergement'],
  ['Accommodations', 'Konaklama', 'Alojamiento', 'Unterkunft', 'Hébergement'],
  ['Where to stay', 'Nerede kalınır', 'Dónde alojarse', 'Übernachtung', 'Où loger'],
  ['Hotels', 'Oteller', 'Hoteles', 'Hotels', 'Hôtels'],
  ['Parking', 'Otopark', 'Aparcamiento', 'Parken', 'Stationnement'],
  ['Shuttle', 'Servis', 'Traslado', 'Shuttle', 'Navette'],
  ['Shuttle service', 'Servis', 'Servicio de traslado', 'Shuttle-Service', 'Service de navette'],
  ['Taxi', 'Taksi', 'Taxi', 'Taxi', 'Taxi'],
  ['Airport & station', 'Havalimanı ve istasyon', 'Aeropuerto y estación', 'Flughafen & Bahnhof', 'Aéroport et gare'],
  ['Gifts', 'Hediyeler', 'Regalos', 'Geschenke', 'Cadeaux'],
  ['Registry', 'Hediye listesi', 'Lista de bodas', 'Wunschliste', 'Liste de mariage'],
  ['Gift registry', 'Hediye listesi', 'Lista de bodas', 'Wunschliste', 'Liste de mariage'],
  ['Wedding registry', 'Hediye listesi', 'Lista de bodas', 'Wunschliste', 'Liste de mariage'],
  ['Gifts & registry', 'Hediyeler ve hediye listesi', 'Regalos y lista de bodas', 'Geschenke & Wunschliste', 'Cadeaux et liste de mariage'],
  ['Honeymoon fund', 'Balayı katkısı', 'Aportación para la luna de miel', 'Flitterwochenkasse', 'Cagnotte lune de miel'],
  ['Your presence is the greatest gift', 'En güzel hediye, aramızda olmanız', 'Su presencia es nuestro mejor regalo', 'Ihre Anwesenheit ist das schönste Geschenk', 'Votre présence est le plus beau des cadeaux'],

  // ---- reply
  ['RSVP', 'LCV', 'Confirmación de asistencia', 'Rückmeldung', 'RSVP'],
  ['Please RSVP', 'Lütfen katılım durumunuzu bildirin', 'Por favor, confirme su asistencia', 'Bitte geben Sie uns Rückmeldung', 'Merci de confirmer votre présence'],
  ['Kindly reply', 'Lütfen yanıtlayın', 'Confirme su asistencia', 'Um Antwort wird gebeten', 'Merci de répondre'],
  ['Kindly reply by', 'Lütfen yanıtlayın, son tarih:', 'Confirme antes del', 'Bitte antworten Sie bis', 'Merci de répondre avant le'],
  ['Please reply by', 'Lütfen yanıtlayın, son tarih:', 'Confirme antes del', 'Bitte antworten Sie bis', 'Merci de répondre avant le'],
  ['Your meal preference', 'Yemek tercihiniz', 'Su preferencia de menú', 'Ihre Menüwahl', 'Votre choix de menu'],
  ['Meal choice', 'Yemek seçimi', 'Elección de menú', 'Menüwahl', 'Choix du repas'],

  // ---- food
  ['Menu', 'Menü', 'Menú', 'Menü', 'Menu'],
  ['Starter', 'Başlangıç', 'Entrante', 'Vorspeise', 'Entrée'],
  ['Starters', 'Başlangıçlar', 'Entrantes', 'Vorspeisen', 'Entrées'],
  ['Appetizer', 'Başlangıç', 'Entrante', 'Vorspeise', 'Entrée'],
  ['Appetizers', 'Başlangıçlar', 'Entrantes', 'Vorspeisen', 'Entrées'],
  ['Canapés', 'Kanepeler', 'Canapés', 'Canapés', 'Canapés'],
  ['Soup', 'Çorba', 'Sopa', 'Suppe', 'Soupe'],
  ['Salad', 'Salata', 'Ensalada', 'Salat', 'Salade'],
  ['Main', 'Ana yemek', 'Plato principal', 'Hauptgang', 'Plat principal'],
  ['Main course', 'Ana yemek', 'Plato principal', 'Hauptgang', 'Plat principal'],
  ['Mains', 'Ana yemekler', 'Platos principales', 'Hauptgänge', 'Plats principaux'],
  ['Dessert', 'Tatlı', 'Postre', 'Dessert', 'Dessert'],
  ['Desserts', 'Tatlılar', 'Postres', 'Desserts', 'Desserts'],
  ['Wedding cake', 'Düğün pastası', 'Tarta nupcial', 'Hochzeitstorte', 'Gâteau de mariage'],
  ['Drinks', 'İçecekler', 'Bebidas', 'Getränke', 'Boissons'],
  ['Open bar', 'Açık bar', 'Barra libre', 'Open Bar', 'Open bar'],
  ['Meat', 'Et', 'Carne', 'Fleisch', 'Viande'],
  ['Fish', 'Balık', 'Pescado', 'Fisch', 'Poisson'],
  ['Chicken', 'Tavuk', 'Pollo', 'Hähnchen', 'Poulet'],
  ['Beef', 'Dana eti', 'Ternera', 'Rind', 'Bœuf'],
  ['Vegetarian', 'Vejetaryen', 'Vegetariano', 'Vegetarisch', 'Végétarien'],
  ['Vegan', 'Vegan', 'Vegano', 'Vegan', 'Végan'],
  ['Gluten free', 'Glütensiz', 'Sin gluten', 'Glutenfrei', 'Sans gluten'],
  ['Dairy free', 'Sütsüz', 'Sin lácteos', 'Milchfrei', 'Sans produits laitiers'],
  ['Nut free', 'Kuruyemişsiz', 'Sin frutos secos', 'Ohne Nüsse', 'Sans fruits à coque'],
  ["Kids' menu", 'Çocuk menüsü', 'Menú infantil', 'Kindermenü', 'Menu enfant'],
  ["Children's menu", 'Çocuk menüsü', 'Menú infantil', 'Kindermenü', 'Menu enfant'],
  ['Dietary requirements', 'Özel beslenme ihtiyaçları', 'Restricciones alimentarias', 'Ernährungswünsche', 'Régimes alimentaires'],
  ['Dietary needs', 'Özel beslenme ihtiyaçları', 'Restricciones alimentarias', 'Ernährungswünsche', 'Régimes alimentaires'],
  ['Allergies', 'Alerjiler', 'Alergias', 'Allergien', 'Allergies'],
  ['Vegetarian and gluten-free options on request.', 'İsteğe göre vejetaryen ve glütensiz seçenekler.', 'Opciones vegetarianas y sin gluten bajo petición.', 'Vegetarische und glutenfreie Optionen auf Anfrage.', 'Options végétariennes et sans gluten sur demande.'],

  // ---- children
  ['Children', 'Çocuklar', 'Niños', 'Kinder', 'Enfants'],
  ['Kids', 'Çocuklar', 'Niños', 'Kinder', 'Enfants'],
  ['Kids welcome', 'Çocuklarınızı da bekleriz', 'Los niños son bienvenidos', 'Kinder sind herzlich willkommen', 'Les enfants sont les bienvenus'],
  ['Children welcome', 'Çocuklarınızı da bekleriz', 'Los niños son bienvenidos', 'Kinder sind herzlich willkommen', 'Les enfants sont les bienvenus'],
  ['Adults only', 'Yalnızca yetişkinler', 'Solo adultos', 'Nur für Erwachsene', 'Réservé aux adultes'],
  ['We love your little ones, but our celebration is adults only.', 'Küçüklerinizi çok seviyoruz, ancak kutlamamız yalnızca yetişkinler içindir.', 'Queremos mucho a los peques, pero nuestra celebración es solo para adultos.', 'Wir lieben Ihre Kleinen, aber unsere Feier ist nur für Erwachsene.', 'Nous adorons vos petits, mais notre fête est réservée aux adultes.'],

  // ---- the designs' demo questions and answers
  ['When should we arrive?', 'Ne zaman gelmeliyiz?', '¿A qué hora debemos llegar?', 'Wann sollen wir da sein?', 'À quelle heure arriver ?'],
  ['Please arrive 20 minutes before the ceremony.', 'Lütfen törenden 20 dakika önce gelin.', 'Por favor, lleguen 20 minutos antes de la ceremonia.', 'Bitte seien Sie 20 Minuten vor der Trauung da.', "Merci d'arriver 20 minutes avant la cérémonie."],
  ['Can you accommodate dietary requirements?', 'Özel beslenme ihtiyaçlarını karşılayabiliyor musunuz?', '¿Pueden adaptarse a restricciones alimentarias?', 'Können Sie auf Ernährungswünsche eingehen?', 'Pouvez-vous tenir compte des régimes alimentaires ?'],
  ['Please tell us about your requirements in your reply.', 'Lütfen ihtiyaçlarınızı yanıtınızda belirtin.', 'Por favor, indíquenos sus necesidades en su respuesta.', 'Bitte teilen Sie uns Ihre Wünsche in Ihrer Rückmeldung mit.', 'Merci de nous indiquer vos besoins dans votre réponse.'],
  ['Is there parking at the venue?', 'Mekânda otopark var mı?', '¿Hay aparcamiento en el lugar?', 'Gibt es Parkplätze an der Location?', 'Y a-t-il un parking sur place ?'],
  ['Is there parking at the theatre?', 'Tiyatroda otopark var mı?', '¿Hay aparcamiento en el teatro?', 'Gibt es Parkplätze am Theater?', 'Y a-t-il un parking au théâtre ?'],
  ['Yes, valet parking is available at the main entrance.', 'Evet, ana girişte vale hizmeti var.', 'Sí, hay servicio de aparcacoches en la entrada principal.', 'Ja, am Haupteingang gibt es einen Parkservice.', "Oui, un voiturier vous attend à l'entrée principale."],
  ['The doors open at 4:30 PM. Please be seated by 4:50 PM: the curtain rises at five.', 'Kapılar 16.30\'da açılıyor. Lütfen 16.50\'ye kadar yerinizi alın: perde saat beşte açılıyor.', 'Las puertas se abren a las 16:30. Por favor, tomen asiento antes de las 16:50: el telón se alza a las cinco.', 'Einlass ist um 16:30 Uhr. Bitte nehmen Sie bis 16:50 Uhr Platz: Der Vorhang hebt sich um fünf.', "Ouverture des portes à 16 h 30. Merci d'être assis avant 16 h 50 : le rideau se lève à 17 h."],
  ['Your dinner choice', 'Akşam yemeği tercihiniz', 'Su elección para la cena', 'Ihre Wahl zum Abendessen', 'Votre choix pour le dîner'],

  // ---- thanks
  ['Thank you', 'Teşekkürler', 'Gracias', 'Danke', 'Merci'],
  ['Thank you for celebrating with us', 'Bizimle kutladığınız için teşekkürler', 'Gracias por celebrar con nosotros', 'Danke, dass Sie mit uns gefeiert haben', 'Merci d’avoir célébré avec nous'],
  // G166 Maison Pâtisserie demo texts
  ['Cocktail attire in soft pastels', 'Pastel tonlarda kokteyl kıyafeti', 'Vestimenta de cóctel en tonos pastel', 'Cocktailkleidung in sanften Pastelltönen', 'Tenue de cocktail aux tons pastel'],
  ['Ceremony in the orangery', 'Limonlukta tören', 'Ceremonia en el invernadero', 'Trauung in der Orangerie', "Cérémonie dans l'orangerie"],
  ['Champagne & macarons on the lawn', 'Çimenlikte şampanya ve makaron', 'Champán y macarons en el césped', 'Champagner & Macarons auf dem Rasen', 'Champagne et macarons sur la pelouse'],
  ['Will there be dessert for guests with allergies?', 'Alerjisi olan misafirler için tatlı olacak mı?', '¿Habrá postre para los invitados con alergias?', 'Gibt es Dessert für Gäste mit Allergien?', 'Y aura-t-il un dessert pour les invités allergiques ?'],
  ['Yes. Tell us about your allergies in your reply and our pâtissier will prepare something just for you.', 'Evet. Alerjilerinizi yanıtınızda bize bildirin, pastacımız size özel bir şey hazırlasın.', 'Sí. Cuéntanos tus alergias en tu respuesta y nuestro pastelero preparará algo solo para ti.', 'Ja. Nennen Sie uns Ihre Allergien in Ihrer Antwort, und unser Pâtissier bereitet etwas nur für Sie zu.', "Oui. Indiquez-nous vos allergies dans votre réponse et notre pâtissier préparera quelque chose rien que pour vous."],
  // G439 Silver Photo Booth (39): demo programme and questions
  ["Cocktails & photo booth", "Kokteyl ve fotoğraf kabini", "Cóctel y fotomatón", "Cocktails & Fotobox", "Cocktail et photomaton"],
  ["Late-night photo booth", "Gece fotoğraf kabini", "Fotomatón de medianoche", "Fotobox bis spät in die Nacht", "Photomaton de minuit"],
  ["Is the photo booth open to guests?", "Fotoğraf kabini misafirlere açık mı?", "¿El fotomatón está abierto a los invitados?", "Ist die Fotobox für Gäste geöffnet?", "Le photomaton est-il ouvert aux invités ?"],
  ["Cocktails and the photo booth open at 5:30 PM; please be seated by 5:50 PM for the 6:00 PM ceremony.", "Kokteyl ve fotoğraf kabini 17.30'da açılıyor; saat 18.00'deki tören için lütfen 17.50'ye kadar yerinizi alın.", "El cóctel y el fotomatón abren a las 17:30; por favor, tomen asiento antes de las 17:50 para la ceremonia de las 18:00.", "Cocktails und Fotobox öffnen um 17:30 Uhr; bitte nehmen Sie bis 17:50 Uhr Platz für die Trauung um 18:00 Uhr.", "Le cocktail et le photomaton ouvrent à 17 h 30 ; merci d'être assis avant 17 h 50 pour la cérémonie de 18 h."],
  ["Yes! It is open from cocktail hour until late. Take as many strips as you like, and leave one for our guest book.", "Evet! Kokteyl saatinden geç saatlere kadar açık. İstediğiniz kadar fotoğraf şeridi alın, birini de anı defterimize bırakın.", "¡Sí! Está abierto desde el cóctel hasta tarde. Llévense todas las tiras que quieran y dejen una para nuestro libro de firmas.", "Ja! Sie ist vom Sektempfang bis spät in die Nacht geöffnet. Nehmen Sie so viele Fotostreifen mit, wie Sie mögen, und lassen Sie einen für unser Gästebuch da.", "Oui ! Il est ouvert du cocktail jusque tard dans la nuit. Prenez autant de bandes que vous le souhaitez et laissez-en une pour notre livre d'or."],
  // G440 Swan Chantilly Lace (40): demo programme and questions
  ["Champagne", "Şampanya", "Champán", "Champagner", "Champagne"],
  ["Will the ceremony be outdoors?", "Tören açık havada mı olacak?", "¿La ceremonia será al aire libre?", "Findet die Trauung im Freien statt?", "La cérémonie aura-t-elle lieu en plein air ?"],
  ["Yes, on the lakeside lawn. Please choose shoes that are comfortable on grass; dinner and dancing are indoors.", "Evet, göl kıyısındaki çimende. Lütfen çimende rahat edeceğiniz ayakkabılar seçin; akşam yemeği ve dans kapalı alanda.", "Sí, en el césped junto al lago. Elijan un calzado cómodo para la hierba; la cena y el baile son en el interior.", "Ja, auf dem Rasen am See. Bitte wählen Sie Schuhe, die auf Gras bequem sind; Abendessen und Tanz finden drinnen statt.", "Oui, sur la pelouse au bord du lac. Choisissez des chaussures confortables sur l'herbe ; le dîner et la danse ont lieu à l'intérieur."],
  // G443 Chartreuse Garden Party (43): demo programme and questions
  ["Lemonade & lawn games", "Limonata ve çim oyunları", "Limonada y juegos en el césped", "Limonade & Rasenspiele", "Limonade et jeux de pelouse"],
  ["Garden supper", "Bahçe akşam yemeği", "Cena en el jardín", "Abendessen im Garten", "Dîner au jardin"],
  ["Garden party chic", "Şık bahçe partisi", "Fiesta en el jardín chic", "Gartenparty-Schick", "Garden-party chic"],
  ["Is the celebration outdoors?", "Kutlama açık havada mı?", "¿La celebración es al aire libre?", "Findet die Feier im Freien statt?", "La fête a-t-elle lieu en plein air ?"],
  ["Yes, the ceremony and supper are in the garden. Comfortable shoes for the lawn are a good idea.", "Evet, tören ve akşam yemeği bahçede. Çimen için rahat ayakkabılar iyi bir fikir.", "Sí, la ceremonia y la cena son en el jardín. Un calzado cómodo para el césped es buena idea.", "Ja, Trauung und Abendessen finden im Garten statt. Bequeme Schuhe für den Rasen sind eine gute Idee.", "Oui, la cérémonie et le dîner ont lieu au jardin. Des chaussures confortables pour la pelouse sont une bonne idée."],
  // G446 Bordeaux Silk Bow (46): demo programme and questions
  ["Please arrive 20 minutes before the ceremony, which begins in the library.", "Lütfen kütüphanede başlayacak törenden 20 dakika önce gelin.", "Por favor, lleguen 20 minutos antes de la ceremonia, que comienza en la biblioteca.", "Bitte kommen Sie 20 Minuten vor der Trauung, die in der Bibliothek beginnt.", "Merci d'arriver 20 minutes avant la cérémonie, qui commence dans la bibliothèque."],
  ["Will there be a coat check?", "Vestiyer olacak mı?", "¿Habrá guardarropa?", "Gibt es eine Garderobe?", "Y aura-t-il un vestiaire ?"],
  ["Yes, a coat check will be open in the entrance hall for the whole evening.", "Evet, giriş holünde bütün akşam açık bir vestiyer olacak.", "Sí, habrá un guardarropa abierto en el vestíbulo durante toda la velada.", "Ja, in der Eingangshalle ist den ganzen Abend eine Garderobe geöffnet.", "Oui, un vestiaire sera ouvert dans le hall d'entrée toute la soirée."],
  // G447 Monochrome Darkroom (47): demo programme and questions
  ["Black and white formal", "Siyah-beyaz resmî", "Formal en blanco y negro", "Festlich in Schwarz-Weiß", "Tenue de soirée noir et blanc"],
  ["May we take photos during the ceremony?", "Tören sırasında fotoğraf çekebilir miyiz?", "¿Podemos hacer fotos durante la ceremonia?", "Dürfen wir während der Trauung fotografieren?", "Pouvons-nous prendre des photos pendant la cérémonie ?"],
  ["We would love an unplugged ceremony, so please keep cameras and phones away until cocktails. After that, shoot as many frames as you like.", "Törenin ekransız olmasını çok isteriz; lütfen kokteyle kadar fotoğraf makinelerini ve telefonları kaldırın. Sonrasında dilediğiniz kadar kare çekin.", "Nos encantaría una ceremonia sin pantallas, así que guarden cámaras y teléfonos hasta el cóctel. Después, hagan todas las fotos que quieran.", "Wir wünschen uns eine Trauung ohne Kameras und Handys, bitte lassen Sie sie bis zum Empfang weggepackt. Danach dürfen Sie so viele Bilder machen, wie Sie möchten.", "Nous aimerions une cérémonie sans écrans : merci de ranger appareils photo et téléphones jusqu'au cocktail. Ensuite, prenez autant de photos que vous le souhaitez."],
  // G448 Navy Ivory Crest (48): demo programme and questions
  ["Please arrive 20 minutes before the ceremony; guests are seated on the south lawn.", "Lütfen törenden 20 dakika önce gelin; misafirler güney çimenliğinde oturacak.", "Por favor, lleguen 20 minutos antes de la ceremonia; los invitados se sentarán en el césped sur.", "Bitte kommen Sie 20 Minuten vor der Trauung; die Gäste nehmen auf dem Südrasen Platz.", "Merci d'arriver 20 minutes avant la cérémonie ; les invités sont placés sur la pelouse sud."],
  ["What if the weather turns?", "Hava bozarsa ne olacak?", "¿Y si cambia el tiempo?", "Was ist, wenn das Wetter umschlägt?", "Et si le temps se gâte ?"],
  ["The ceremony moves into the great hall, and everything else stays as planned.", "Tören büyük salona taşınır, geri kalan her şey planlandığı gibi kalır.", "La ceremonia se traslada al gran salón y todo lo demás sigue según lo previsto.", "Die Trauung findet dann in der großen Halle statt, alles andere bleibt wie geplant.", "La cérémonie se tient alors dans la grande salle, et tout le reste se déroule comme prévu."],
  // G441 Painted Lily Pond (41): demo programme and questions
  ["Garden brunch", "Bahçe kahvaltısı", "Brunch en el jardín", "Brunch im Garten", "Brunch au jardin"],
  ["Toasts & cake", "Kadeh kaldırma ve pasta", "Brindis y tarta", "Reden & Torte", "Toasts et gâteau"],
  ["Lawn games & dancing", "Çim oyunları ve dans", "Juegos en el césped y baile", "Rasenspiele & Tanz", "Jeux de pelouse et danse"],
  ["What shoes should we wear?", "Hangi ayakkabıları giymeliyiz?", "¿Qué zapatos debemos llevar?", "Welche Schuhe sollen wir tragen?", "Quelles chaussures porter ?"],
  ["The ceremony and brunch are on the garden lawn, so flats or block heels are most comfortable.", "Tören ve kahvaltı bahçe çimeninde; bu yüzden düz ya da kalın topuklu ayakkabılar en rahatıdır.", "La ceremonia y el brunch son en el césped del jardín, así que los zapatos planos o de tacón ancho son los más cómodos.", "Trauung und Brunch finden auf dem Gartenrasen statt, flache Schuhe oder Blockabsätze sind daher am bequemsten.", "La cérémonie et le brunch ont lieu sur la pelouse du jardin : les chaussures plates ou à talons larges sont les plus confortables."],
];

/** "and" between two terms, per language (Spanish "y" becomes "e" before an i- sound). */
const AND: Readonly<Record<Lang, string>> = { en: 'and', tr: 've', es: 'y', de: 'und', fr: 'et' };
const AND_WORD: Readonly<Record<Lang, RegExp>> = {
  en: /(?<=^|\s)and(?=\s|$)/g,
  tr: /(?<=^|\s)ve(?=\s|$)/g,
  es: /(?<=^|\s)[ye](?=\s|$)/g,
  de: /(?<=^|\s)und(?=\s|$)/g,
  fr: /(?<=^|\s)et(?=\s|$)/g,
};

/** The lookup form of a text: no case, accents, punctuation or extra spaces; "&", "+" and the word "and" alike. */
export function glossaryKey(text: string, lang: Lang): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/[-‐–—_/·•|]+/g, ' ')
    .replace(/[&+]/g, ' & ')
    .replace(/['’‘"“”«»„.,:;!?¡¿()[\]…]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(AND_WORD[lang], '&');
}

const COLUMN: Readonly<Record<Lang, number>> = { en: 0, tr: 1, es: 2, de: 3, fr: 4 };
let index: Map<Lang, Map<string, Row>> | null = null;

function lookup(text: string, source: Lang): Row | null {
  if (!index) {
    index = new Map(LANGS.map((l) => [l, new Map<string, Row>()]));
    for (const row of WEDDING_GLOSSARY) {
      for (const l of LANGS) {
        const k = glossaryKey(row[COLUMN[l]], l);
        if (k && !index.get(l)!.has(k)) index.get(l)!.set(k, row);
      }
    }
  }
  const k = glossaryKey(text, source);
  return k ? (index.get(source)!.get(k) ?? null) : null;
}

const END = /[.:!…]+$/;

function allCaps(text: string, lang: Lang): boolean {
  const letters = text.replace(/[^\p{L}]/gu, '');
  return letters.length > 1 && letters === letters.toLocaleUpperCase(LANG_TAGS[lang]) && letters !== letters.toLocaleLowerCase(LANG_TAGS[lang]);
}

/**
 * The glossary's wording with the case and the end punctuation of the original ("COCKTAIL HOUR" → "KOKTEYL",
 * "Dress code:" → "Kıyafet kuralı:", "…on request" without its full stop → no full stop). Acronyms (RSVP, FAQ) are
 * not shouted in the target language.
 */
function shaped(original: string, row: Row, source: Lang, target: Lang, midSentence: boolean): string {
  const term = row[COLUMN[target]];
  const lead = /^\s*/.exec(original)![0];
  const [, gap, punct, after] = /(\s*)([.:!…]*)(\s*)$/.exec(original)!;
  const tail = punct ? after : gap + after;
  let out = term;
  if (punct) out = term.replace(END, '').trimEnd() + gap + punct;
  else if (END.test(row[COLUMN[source]]) && END.test(term)) out = term.replace(END, '').trimEnd();
  if (allCaps(original, source) && !allCaps(row[COLUMN[source]], source)) {
    out = out.toLocaleUpperCase(LANG_TAGS[target]);
  } else if (midSentence && target !== 'de' && /^\p{Ll}/u.test(original.trim())) {
    // "…, vegan and gluten free" keeps its small letters (German nouns keep their capital)
    out = out.charAt(0).toLocaleLowerCase(LANG_TAGS[target]) + out.slice(1);
  }
  return lead + out + tail;
}

/** One glossary term (the whole text), or null. */
export function glossaryTerm(text: string, source: Lang, target: Lang): string | null {
  if (source === target) return null;
  const row = lookup(text, source);
  return row ? shaped(text, row, source, target, false) : null;
}

/** Separators between terms: ":", "·", "•", "|", "/", "+", "&", "–", "—", " - ", ", " and the word "and". */
const SEPARATOR: Readonly<Record<Lang, RegExp>> = Object.fromEntries(
  LANGS.map((l) => [l, new RegExp(`(\\s*[:·•|/+&–—]\\s*|\\s+-\\s+|,\\s+|\\s+(?:${l === 'es' ? 'y|e' : AND[l]})\\s+)`, 'i')]),
) as Record<Lang, RegExp>;

/**
 * The text translated by the glossary alone — one term, or terms joined by separators ("Dress code: Black tie") — or
 * null when any part of it is not in the glossary.
 */
export function glossaryTranslate(text: string, source: Lang, target: Lang): string | null {
  if (source === target || !text.trim()) return null;
  const whole = glossaryTerm(text, source, target);
  if (whole !== null) return whole;
  const parts = text.split(SEPARATOR[source]);
  if (parts.length < 3) return null;
  const out: string[] = [];
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    if (i % 2 === 1) {
      // a separator: "and" in the target language, any other one as it is
      out.push(/^\s+\p{L}+\s+$/u.test(part) ? ` ${AND[target]} ` : part);
      continue;
    }
    const row = part.trim() ? lookup(part, source) : null;
    if (!row) return null;
    out.push(shaped(part, row, source, target, i > 0));
  }
  if (target === 'es') {
    // "y" before an i- sound is "e" ("Padres e hijos")
    for (let i = 1; i < out.length - 1; i += 2) if (out[i] === ' y ' && /^\s*h?i(?![aeouáéó])/i.test(out[i + 1])) out[i] = ' e ';
  }
  return out.join('');
}

/**
 * Translates `text` with the glossary first and `machine` (the device's translator or the free service) for the rest:
 * a glossary text never reaches the machine; in a text of several lines the glossary lines are kept and only the
 * others are sent, one by one.
 */
export async function translateWithGlossary(text: string, source: Lang, target: Lang, machine: (text: string) => Promise<string>): Promise<string> {
  const full = glossaryTranslate(text, source, target);
  if (full !== null) return full;
  const lines = text.split(/(\r?\n)/);
  if (lines.length > 1) {
    const hits = lines.map((line, i) => (i % 2 === 0 ? glossaryTranslate(line, source, target) : null));
    if (hits.some((h) => h !== null)) {
      const out: string[] = [];
      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        out.push(i % 2 === 1 || !line.trim() ? line : (hits[i] ?? (await machine(line))));
      }
      return out.join('');
    }
  }
  return machine(text);
}
