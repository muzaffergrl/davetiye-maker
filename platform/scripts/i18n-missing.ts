// G144: lists the keys a dictionary lacks. node scripts/i18n-missing.ts [--ns panel|site|market] [--lang tr] [--json out.json]
import { writeFileSync } from 'node:fs';
import { loadDict, type Namespace } from '../lib/i18n/dicts.ts';
import { expectedKeys } from '../lib/i18n/keys.ts';
import { LANGS, type Lang } from '../lib/i18n/langs.ts';

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const namespaces = (arg('ns') ? [arg('ns')] : ['panel', 'site', 'market']) as Namespace[];
const langs = (arg('lang') ? [arg('lang')] : LANGS.filter((l) => l !== 'en')) as Lang[];
const out: Record<string, Record<string, string[]>> = {};
for (const ns of namespaces) {
  const keys = [...expectedKeys(ns)].sort();
  out[ns] = {};
  for (const lang of langs) {
    const dict = await loadDict(ns, lang);
    const missing = keys.filter((k) => !dict[k]);
    out[ns][lang] = missing;
    const extra = Object.keys(dict).filter((k) => !keys.includes(k)).length;
    console.log(`${ns}/${lang}: ${keys.length} keys, ${missing.length} missing, ${extra} unused`);
  }
}
const file = arg('json');
if (file) writeFileSync(file, JSON.stringify(out, null, 2));
