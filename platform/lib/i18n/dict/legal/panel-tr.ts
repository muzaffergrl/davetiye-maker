// G961 (decision 7): panel texts of the legal pages (terms, KVKK notice, privacy additions, /start line) in tr.
// Spread into dict/panel/tr.ts. Keys = the English text (lib/i18n/README.md).
import type { Dict } from '../../translate.ts';

const dict: Dict = {
  "By creating your website you accept our {terms}. Our {privacy} and {kvkk} explain how we use your data.": "Websitenizi oluşturduğunuzda {terms} metnini kabul etmiş olursunuz. Verilerinizi nasıl kullandığımızı {privacy} ve {kvkk} açıklar.",
  "KVKK notice": "KVKK aydınlatma metni",
  "Privacy notice": "Gizlilik bildirimi",
  "Terms of use": "Kullanım koşulları",
};

export default dict;
