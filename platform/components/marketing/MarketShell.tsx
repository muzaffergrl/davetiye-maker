// G144: the page frame of the sales site in one language — skip link, header (with the language switcher), main,
// footer, the site-wide JSON-LD, the live demo dialog and the support chat button (components/support). app/(marketing)/(en)/layout.tsx renders it in English,
// app/(marketing)/i18n/[lang]/layout.tsx in the page language. The fonts, the shell background, analytics and motion
// stay in app/(marketing)/layout.tsx (shared).
//
// The root <html lang="en"> belongs to the platform's root layout (shared with the panel and the couple sites), so the
// page language is set on this wrapper instead (`lang` on an element applies to everything inside it; accepted for the
// sales site, docs G144). The wrapper is `display: contents`, so the shell's layout is unchanged.
import type { ReactNode } from 'react';
import { MARKETING } from '../../lib/marketing/config.ts';
import type { Guide } from '../../lib/marketing/guides.ts';
import type { Market } from '../../lib/marketing/i18n.ts';
import { graph, organization, website } from '../../lib/marketing/schema.ts';
import { DemoHost } from './Demo.tsx';
import { demoCopy, demoDesigns } from './demo-data.ts';
import s from './marketing.module.css';
import { NotFoundCopyProvider } from './NotFound.tsx';
import { notFoundCopy } from './not-found-copy.ts';
import { Footer, Header } from './Shell.tsx';
import { JsonLd } from './ui.tsx';
import { chatCopy } from '../support/copy.ts';
import { MAX_CHARS } from '../support/limits.ts';
import { SupportLauncher } from '../support/SupportLauncher.tsx';

/** The support address for the chat's "write to us", or null while it is a placeholder. */
const supportEmail = /^\[[^\]]+\]$/.test(MARKETING.support.email) ? null : MARKETING.support.email;

export function MarketShell({ m, guides, children }: { m: Market; guides: Guide[]; children: ReactNode }) {
  const { t } = m;
  return (
    <div lang={m.lang} className={s.langRoot}>
      <a href="#main" className={s.skip}>
        {t('Skip to content')}
      </a>
      <Header m={m} />
      <main id="main" className={s.main} tabIndex={-1}>
        <NotFoundCopyProvider copy={notFoundCopy(m)}>{children}</NotFoundCopyProvider>
      </main>
      <Footer guides={guides} m={m} />
      <JsonLd data={graph(organization(), website())} />
      <DemoHost designs={demoDesigns(MARKETING, m)} copy={demoCopy(t)} />
      <SupportLauncher copy={chatCopy(t, { context: 'market', brand: MARKETING.brand.name, shop: MARKETING.etsy.shopName, email: supportEmail, maxChars: MAX_CHARS })} links={{ faq: m.href('/faq'), etsy: MARKETING.etsy.shopUrl, email: supportEmail }} />
    </div>
  );
}
