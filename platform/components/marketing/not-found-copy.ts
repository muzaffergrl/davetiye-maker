// G144: the 404 words of a language (NotFound.tsx), built on the server.
import { enMarket, type Market } from '../../lib/marketing/i18n.ts';
import type { NotFoundCopy } from './NotFound.tsx';

export function notFoundCopy(m: Market = enMarket): NotFoundCopy {
  const { t } = m;
  return {
    title: t('This page could not be found'),
    lead: t('The link may be old, or the page has moved. These pages will help you find your way.'),
    links: [
      { href: m.href('/designs'), label: t('Wedding website designs') },
      { href: m.href('/how-it-works'), label: t('How it works') },
      { href: m.href('/faq'), label: t('Frequently asked questions') },
    ],
    back: { href: m.href('/'), label: t('Back to the home page') },
  };
}
