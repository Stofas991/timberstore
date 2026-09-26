// Horizontal swipe detection shared by modules. Touch/pen only: on desktop the
// mouse keeps Shoptet's native behaviour (links, cloud-zoom, image drag).

const MIN_DISTANCE = 40; // px of horizontal travel that counts as a swipe
const CLICK_THRESHOLD = 10; // px after which the gesture is no longer a tap

/**
 * Calls onSwipe('next' | 'prev') for a horizontal swipe over `el`.
 * The element needs `touch-action: pan-y` (CSS) so vertical scrolling stays
 * with the browser and horizontal moves reach us.
 */
export function bindSwipe(el, onSwipe) {
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let suppressClick = false;

  el.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    pointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    suppressClick = false;
  });

  el.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pointerId) return;
    if (Math.abs(e.clientX - startX) > CLICK_THRESHOLD) suppressClick = true;
  });

  el.addEventListener('pointerup', (e) => {
    if (e.pointerId !== pointerId) return;
    pointerId = null;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) >= MIN_DISTANCE && Math.abs(dx) > Math.abs(dy)) {
      onSwipe(dx < 0 ? 'next' : 'prev');
    }
  });

  el.addEventListener('pointercancel', () => {
    // Browser took over (vertical scroll) — not a swipe.
    pointerId = null;
  });

  // A swipe must not open the link or lightbox underneath.
  el.addEventListener(
    'click',
    (e) => {
      if (!suppressClick) return;
      e.preventDefault();
      e.stopPropagation();
      suppressClick = false;
    },
    true,
  );
}
