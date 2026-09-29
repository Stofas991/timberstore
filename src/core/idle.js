// Run low-priority work (preloading images) once the page has loaded and the
// browser is idle, so it never competes with what the customer sees first.
export function whenIdleAfterLoad(fn) {
  const idle = () =>
    window.requestIdleCallback ? window.requestIdleCallback(fn, { timeout: 3000 }) : setTimeout(fn, 200);
  if (document.readyState === 'complete') idle();
  else window.addEventListener('load', idle, { once: true });
}

/** Warm the browser cache for an image URL; each URL is fetched at most once. */
const preloaded = new Set();
export function preloadImage(url) {
  if (!url || preloaded.has(url)) return;
  preloaded.add(url);
  new Image().src = url;
}
