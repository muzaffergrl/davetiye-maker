// Root layout of the shop admin (G152, components/i18n/RootDocument.tsx): the shop's screens are Turkish.
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { RootBody, ROOT_METADATA, ROOT_VIEWPORT } from '../../components/i18n/RootDocument.tsx';
import { ADMIN_LANG } from '../../lib/i18n/document-lang.ts';

export const metadata: Metadata = ROOT_METADATA;
export const viewport: Viewport = ROOT_VIEWPORT;

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={ADMIN_LANG}>
      <RootBody>{children}</RootBody>
    </html>
  );
}
