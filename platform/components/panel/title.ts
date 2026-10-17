// The panel's tab title follows the view (WCAG 2.4.3). The page's metadata <title> ("Edit your website") is put back
// by Next after the panel's first effects on a fresh load, so the wanted title is kept: a head change that brings
// back another title is undone.

let wanted: string | null = null;
let observer: MutationObserver | null = null;

export function setPanelTitle(title: string): void {
  wanted = title;
  document.title = title;
  if (observer || typeof MutationObserver === 'undefined') return;
  observer = new MutationObserver(() => {
    if (wanted !== null && document.title !== wanted) document.title = wanted;
  });
  observer.observe(document.head, { childList: true, subtree: true, characterData: true });
}
