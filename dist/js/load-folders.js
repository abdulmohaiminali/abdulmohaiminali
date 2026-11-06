// Load React and the original folders shortly before they enter view.
export function loadFoldersWhenNear(element, load = () => import('./folder-app.js?v=kopp-collage')) {
  if (!element) return;
  let near = false, loading = false, loaded = false;
  const start = async () => {
    if (!near || document.hidden || loading || loaded) return;
    loading = true;
    try {
      await load();
      loaded = true;
      observer?.disconnect();
      document.removeEventListener('visibilitychange', start);
      element.removeEventListener('pointerenter', start);
      element.removeEventListener('focusin', start);
    } catch (error) {
      // Preserve the HTML fallback and allow a later interaction to retry.
      console.warn('The work folders could not load:', error);
    } finally { loading = false; }
  };
  const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
    near = entry.isIntersecting;
    start();
  }, { rootMargin: '400px 0px' });
  document.addEventListener('visibilitychange', start);
  element.addEventListener('pointerenter', start);
  element.addEventListener('focusin', start);
  if (observer) observer.observe(element);
  else { near = true;start(); }
}
