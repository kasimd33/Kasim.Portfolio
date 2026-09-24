// Run before React mounts so the browser and intro agree on the reload destination.
export function prepareInitialPagePosition() {
  const navigation = performance.getEntriesByType('navigation')[0];
  if (navigation?.type !== 'reload') return undefined;

  const previousRestoration = window.history.scrollRestoration;
  window.history.scrollRestoration = 'manual';
  window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#home`);
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  let finished = false;
  return () => {
    if (finished) return;
    finished = true;
    // Keep restoration disabled until both the intro and document loading finish.
    const restore = () => window.requestAnimationFrame(() => {
      window.history.scrollRestoration = previousRestoration;
    });
    if (document.readyState === 'complete') restore();
    else window.addEventListener('load', restore, { once: true });
  };
}
