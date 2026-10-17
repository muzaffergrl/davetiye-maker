// G144: the words of a couple's website in the guest's language. Theme texts (theme.json copy defaults, fixed template
// texts and attributes) and the platform's own guest interface are looked up by their English text in
// dict/site/<lang>.ts; the browser scripts (/rsvp/form.js, /static/map.js, /audio/audio.js, /static/lang.js) get only the
// texts they use, in the page's language, through #site-data "i18n" (SITE_SCRIPT_TEXTS).

import { loadDict } from './dicts.ts';
import type { Lang } from './langs.ts';
import { msg, type Dict } from './translate.ts';

/** Texts the guest-side scripts show (their English text is also their key in #site-data "i18n"). */
export const SITE_SCRIPT_TEXTS: readonly string[] = [
  // /rsvp/form.js
  msg('Thank you! Your reply has been sent.'),
  msg('Replies are closed. If you still need to reply, please contact the couple directly.'),
  msg('We could not send your reply. Please check your connection and try again.'),
  msg('This is a preview, so replies are not sent. Guests can reply once the site is published.'),
  msg('Please enter a whole number from 0 to 9999.'),
  msg('Please keep your name to {n} characters or fewer.'),
  msg('Please enter your name.'),
  msg('Please enter your email address.'),
  msg('Please check your email address.'),
  msg('Please let us know if you can attend.'),
  msg('Please enter a number of guests from {min} to {max}.'),
  msg('Please enter a number of guests from {min}.'),
  msg('Please choose an answer.'),
  msg('Please answer this question.'),
  msg('Please keep your answer to {n} characters or fewer.'),
  msg('Please check your answer.'),
  msg('Please keep each name to {n} characters or fewer.'),
  msg('Please write a note for the couple.'),
  msg('Please keep your message to {n} characters or fewer.'),
  msg('(optional)'),
  msg('Yes'),
  msg('No'),
  // /audio/audio.js
  msg('Play music'),
  msg('Turn music off'),
  msg('Turn sound on'),
  msg('Turn sound off'),
  // /static/map.js
  msg('Map'),
  msg('Open in Google Maps'),
  // theme scripts (toast for a link without its address yet)
  msg('This link will be added soon.'),
];

export async function siteDict(lang: Lang): Promise<Dict> {
  return loadDict('site', lang);
}

/** The #site-data "i18n" object: the script texts translated into `lang` (null for English: the scripts' own words). */
export function scriptTexts(dict: Dict, lang: Lang): Record<string, string> | null {
  if (lang === 'en') return null;
  const out: Record<string, string> = {};
  for (const k of SITE_SCRIPT_TEXTS) if (dict[k]) out[k] = dict[k];
  return out;
}
