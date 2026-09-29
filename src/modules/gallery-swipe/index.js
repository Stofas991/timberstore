// M1 · Product detail photos cannot be swiped on mobile.
//
// Shoptet's product gallery is a main image plus thumbnails; clicking a
// thumbnail swaps the main image. A swipe over the main image clicks the
// next/previous thumbnail, so Shoptet's own gallery logic (variants, lightbox,
// highlighted thumbnail) stays in charge. Stops at the first/last photo.
//
// Client feedback: swiping to a photo whose thumbnail is outside the strip left
// the highlighted thumbnail hidden, and the next photo loaded only after the
// swipe. So: scroll the strip with Shoptet's own arrows until the active
// thumbnail is visible, and preload the big photos of the neighbouring thumbnails.

import { SEL } from '../../core/selectors.js';
import { bindSwipe } from '../../core/swipe.js';
import { whenIdleAfterLoad, preloadImage } from '../../core/idle.js';

// Compat mouse events a phone fires after a touch arrive within this window.
const COMPAT_MOUSE_MS = 1000;
// Shoptet's arrow moves the strip by one thumbnail; enough tries for any strip.
const MAX_ARROW_CLICKS = 12;

function thumbnails() {
  // Re-read every time: Shoptet redraws thumbnails on variant change.
  return [...document.querySelectorAll(SEL.productThumbnail)];
}

function activeIndex(thumbs) {
  return thumbs.findIndex((t) => t.classList.contains(SEL.productThumbnailActiveClass));
}

// Preload the big photos (thumbnail href) next to the active one.
function preloadNeighbours(thumbs, index) {
  [index - 1, index + 1].forEach((i) => preloadImage(thumbs[i]?.href));
}

// Click Shoptet's strip arrow until `thumb` is fully inside the strip.
// Position is computed from the strip's target offset (style.left/top), not from
// the screen, so the running 0.3 s slide does not fool it.
function revealThumb(thumb, triesLeft = MAX_ARROW_CLICKS) {
  const strip = thumb.closest(SEL.productThumbnails);
  const inner = strip?.querySelector(SEL.productThumbnailsInner);
  if (!strip || !inner || triesLeft <= 0) return;

  const vertical = strip.classList.contains(SEL.productThumbnailsVerticalClass);
  const offset = parseFloat(vertical ? inner.style.top : inner.style.left) || 0;
  const start = (vertical ? thumb.offsetTop : thumb.offsetLeft) + offset;
  const end = start + (vertical ? thumb.offsetHeight : thumb.offsetWidth);
  const size = vertical ? strip.clientHeight : strip.clientWidth;

  const arrows = strip.parentElement || document;
  let arrow = null;
  if (end > size + 1) arrow = arrows.querySelector(SEL.productThumbnailsNext);
  else if (start < -1) arrow = arrows.querySelector(SEL.productThumbnailsPrev);
  if (!arrow) return;

  // Shoptet ignores clicks while the strip is sliding.
  if (arrow.classList.contains(SEL.productThumbnailsBusyClass)) {
    setTimeout(() => revealThumb(thumb, triesLeft - 1), 100);
    return;
  }
  arrow.click();
  setTimeout(() => revealThumb(thumb, triesLeft - 1), 50); // re-check the new offset
}

function bind(image) {
  bindSwipe(image, (dir) => {
    const thumbs = thumbnails();
    if (thumbs.length < 2) return;
    const index = Math.max(0, activeIndex(thumbs)) + (dir === 'next' ? 1 : -1);
    const target = thumbs[index];
    if (!target) return;
    target.click();
    revealThumb(target);
    preloadNeighbours(thumbs, index);
  });

  // The first swipe should find its photo ready too.
  whenIdleAfterLoad(() => {
    const thumbs = thumbnails();
    preloadNeighbours(thumbs, Math.max(0, activeIndex(thumbs)));
  });
}

// Shoptet's cloud-zoom also reacts to touch: holding a finger for 150 ms opens
// a zoom overlay inside the photo. A swipe often starts with such a hold, the
// photo underneath changes, and because Shoptet rebuilds the zoom 201 ms after
// every switch, the overlay can get stuck showing an old photo. On touch we
// keep touch events (and the compat mouse events that follow them) away from
// the zoom layer. Desktop mouse hover zoom is untouched; a tap still opens the
// lightbox (that is a click, not blocked).
function blockTouchZoom(image) {
  let lastTouch = 0;
  const onPointer = (e) => {
    if (e.pointerType !== 'mouse') lastTouch = Date.now();
  };
  const onTouch = (e) => {
    lastTouch = Date.now();
    if (e.target.closest(SEL.productZoomTrap)) e.stopPropagation();
  };
  ['pointerdown', 'pointerup'].forEach((type) => image.addEventListener(type, onPointer, true));
  const onCompatMouse = (e) => {
    if (Date.now() - lastTouch < COMPAT_MOUSE_MS) e.stopPropagation();
  };
  // Capture phase on the stable wrapper: the zoom layer itself is recreated.
  ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach((type) =>
    image.addEventListener(type, onTouch, { capture: true, passive: true }),
  );
  ['mouseover', 'mousemove', 'mouseout'].forEach((type) =>
    image.addEventListener(type, onCompatMouse, true),
  );
}

export default {
  name: 'gallery-swipe',
  pages: ['detail'],
  init(root) {
    root.querySelectorAll(SEL.productImage).forEach((image) => {
      if (image.dataset.tsInit) return;
      image.dataset.tsInit = 'gallery-swipe';
      image.classList.add('ts-gallery-swipe');
      bind(image);
      blockTouchZoom(image);
    });
  },
};
