// BKE Studio fonts for the edit panel (G066 part B; brand/tokens.json, Google Fonts, OFL). next/font serves them from our
// own origin at build time — no font file in the repo, nothing sent to Google from the buyer's phone. Same families and
// files as the sales site (app/(marketing)/layout.tsx): Archivo 800 for the heavy headings, Montserrat 300 for the light
// wide lines, DM Sans (variable) for every label, field and button. The panel uses its own variable names (--bke-*),
// so they never collide with the panel's --font-* tokens (panel.module.css). The class goes on every panel root: the
// app, the sheets and the snackbar (both are portals on <body>), and the "link not valid" page.
import { Archivo, DM_Sans, Montserrat } from 'next/font/google';

const display = Archivo({ subsets: ['latin'], weight: ['800'], display: 'swap', variable: '--bke-display' });
const wide = Montserrat({ subsets: ['latin'], weight: ['300'], display: 'swap', variable: '--bke-wide', preload: false });
const body = DM_Sans({ subsets: ['latin'], display: 'swap', variable: '--bke-body' });

export const PANEL_FONTS = `${display.variable} ${wide.variable} ${body.variable}`;
