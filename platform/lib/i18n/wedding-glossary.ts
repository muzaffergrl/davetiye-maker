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

  // ---- thanks
  ['Thank you', 'Teşekkürler', 'Gracias', 'Danke', 'Merci'],
  ['Thank you for celebrating with us', 'Bizimle kutladığınız için teşekkürler', 'Gracias por celebrar con nosotros', 'Danke, dass Sie mit uns gefeiert haben', 'Merci d’avoir célébré avec nous'],
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
