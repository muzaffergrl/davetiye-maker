'use client';
// G181: the panel's views and sheets, each its own chunk. The first load holds the shell (Panel.tsx: routing, autosave,
// bars, preview, the sheets' frame) and the view being opened; the server renders that view (next/dynamic, ssr) and Next
// preloads its chunk. The others are fetched when the browser is idle (prefetchViews), so moving between views stays
// instant: a view whose chunk is already here renders directly, without a Suspense round (that would paint one empty
// "loading" frame). Each `dynamic()` names its import inline: Next reads it to preload the chunk the server rendered.
// No `loading` option: with one, next/dynamic wraps the view in a Suspense boundary, and React's server renderer streams a
// large boundary after the rest of the page (outlined, swapped in by a script) even when it is ready — the view painted
// late. The server-rendered view has no boundary (hydration waits for its preloaded chunk); a view mounted later whose
// chunk is not here yet gets its own boundary with ViewLoading.

import dynamic from 'next/dynamic';
import { Suspense, useState, type ComponentType, type ReactNode } from 'react';
import styles from './panel.module.css';

/** Shown only while a view's chunk is still on its way (a tap before the idle prefetch finished). */
function ViewLoading() {
  return <div className={styles.viewLoading} aria-busy="true" data-view-loading="" />;
}

/** Set after the panel's first commit: views mounted during hydration must match the server's Suspense boundary. */
let hydrated = false;
export function markHydrated() {
  hydrated = true;
}

type Lazy<P> = ComponentType<P> & { preload: () => Promise<void> };

/** `fallback`: while a view mounted after hydration waits for its chunk (sheets: nothing). */
function lazyView<P extends object>(Dyn: ComponentType<P>, load: () => Promise<ComponentType<P>>, fallback: ReactNode = <ViewLoading />): Lazy<P> {
  let loaded: ComponentType<P> | null = null;
  let pending: Promise<void> | null = null;
  const preload = () =>
    (pending ??= load().then(
      (c) => {
        loaded = c;
      },
      () => {
        pending = null; // a failed download is tried again next time
      },
    ));
  function View(props: P) {
    // decided once per mount, so a view never swaps its component (and loses its state) while it is open:
    // during hydration as the server rendered it; later directly when its chunk is here, else behind its own boundary
    const [mode] = useState<{ direct: ComponentType<P> | null; boundary: boolean }>(() => ({ direct: hydrated ? loaded : null, boundary: hydrated }));
    const Direct = mode.direct;
    if (Direct) return <Direct {...props} />;
    return mode.boundary ? (
      <Suspense fallback={fallback}>
        <Dyn {...props} />
      </Suspense>
    ) : (
      <Dyn {...props} />
    );
  }
  return Object.assign(View, { preload });
}

export const Setup = lazyView(
  dynamic(() => import('./Setup.tsx').then((m) => m.Setup)),
  () => import('./Setup.tsx').then((m) => m.Setup),
);
export const HomeView = lazyView(
  dynamic(() => import('./views.tsx').then((m) => m.HomeView)),
  () => import('./views.tsx').then((m) => m.HomeView),
);
export const EditListView = lazyView(
  dynamic(() => import('./EditListView.tsx').then((m) => m.EditListView)),
  () => import('./EditListView.tsx').then((m) => m.EditListView),
);
export const EditorPage = lazyView(
  dynamic(() => import('./EditorPage.tsx').then((m) => m.EditorPage)),
  () => import('./EditorPage.tsx').then((m) => m.EditorPage),
);
export const GuestsView = lazyView(
  dynamic(() => import('./guests.tsx').then((m) => m.GuestsView)),
  () => import('./guests.tsx').then((m) => m.GuestsView),
);
export const GuestPrintView = lazyView(
  dynamic(() => import('./guests.tsx').then((m) => m.GuestPrintView)),
  () => import('./guests.tsx').then((m) => m.GuestPrintView),
);
export const ShareView = lazyView(
  dynamic(() => import('./ShareView.tsx').then((m) => m.ShareView)),
  () => import('./ShareView.tsx').then((m) => m.ShareView),
);
export const HelpSheet = lazyView(
  dynamic(() => import('./HelpSheet.tsx').then((m) => m.HelpSheet)),
  () => import('./HelpSheet.tsx').then((m) => m.HelpSheet),
  null,
);
export const SupportSheet = lazyView(
  dynamic(() => import('./SupportSheet.tsx').then((m) => m.SupportSheet)),
  () => import('./SupportSheet.tsx').then((m) => m.SupportSheet),
  null,
);
export const IdentitySheet = lazyView(
  dynamic(() => import('./IdentitySheet.tsx').then((m) => m.IdentitySheet)),
  () => import('./IdentitySheet.tsx').then((m) => m.IdentitySheet),
  null,
);
export const LiveSheetBody = lazyView(
  dynamic(() => import('./Published.tsx').then((m) => m.LiveSheetBody)),
  () => import('./Published.tsx').then((m) => m.LiveSheetBody),
  null,
);

/** The views by route (Panel.tsx chunkOf); guests = the list, results and print. */
const VIEWS = {
  setup: [Setup],
  home: [HomeView],
  edit: [EditListView],
  section: [EditorPage],
  guests: [GuestsView, GuestPrintView],
  share: [ShareView],
} as const;
export type ChunkView = keyof typeof VIEWS;
const SHEETS = [HelpSheet, IdentitySheet, LiveSheetBody, SupportSheet];

/** Starts (or joins) the download of a view's chunk; resolves when it is here (never rejects). */
export function loadView(view: ChunkView): Promise<void> {
  return Promise.all(VIEWS[view].map((v) => v.preload())).then(() => undefined);
}

/** Every other view and sheet, one after another, when the browser is idle (requestIdleCallback, else a timeout). */
export function prefetchViews(): () => void {
  let stopped = false;
  const queue: Array<() => Promise<void>> = [...Object.values(VIEWS).flat(), ...SHEETS].map((v) => v.preload);
  const idle: (cb: () => void) => void =
    typeof window.requestIdleCallback === 'function' ? (cb) => void window.requestIdleCallback(cb, { timeout: 3000 }) : (cb) => void window.setTimeout(cb, 1200);
  const next = () => {
    const load = queue.shift();
    if (stopped || !load) return;
    void load().then(() => idle(next));
  };
  idle(next);
  return () => {
    stopped = true;
  };
}
