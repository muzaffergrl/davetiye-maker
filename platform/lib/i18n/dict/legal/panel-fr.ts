// G961 (decision 7): panel texts of the legal pages (terms, KVKK notice, privacy additions, /start line) in fr.
// Spread into dict/panel/fr.ts. Keys = the English text (lib/i18n/README.md).
import type { Dict } from '../../translate.ts';

const dict: Dict = {
  "By creating your website you accept our {terms}. Our {privacy} and {kvkk} explain how we use your data.": "En créant votre site, vous acceptez nos {terms}. Notre {privacy} et notre {kvkk} expliquent comment nous utilisons vos données.",
  "KVKK notice": "Notice KVKK",
  "Privacy notice": "Notice de confidentialité",
  "Terms of use": "Conditions d’utilisation",
};

export default dict;
