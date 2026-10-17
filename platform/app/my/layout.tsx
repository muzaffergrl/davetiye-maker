// Root layout of /my (G152): the buyer interface's language is in the server's <html lang> (components/i18n/RootDocument.tsx).
import type { Metadata, Viewport } from 'next';
import { BuyerRootLayout, ROOT_METADATA, ROOT_VIEWPORT } from '../../components/i18n/RootDocument.tsx';

export const metadata: Metadata = ROOT_METADATA;
export const viewport: Viewport = ROOT_VIEWPORT;

export default BuyerRootLayout;
