// M1 · Homepage banner carousel cannot be swiped on mobile.
//
// Shoptet renders the banner carousel as a Bootstrap 3 carousel, which has no
// touch support. Instead of rebuilding it on Swiper (loaded by the Apollo
// template, version not under our control), we add swipe gestures and drive
// the existing carousel through its own API. Indicators, autoplay, banner
// management in the Shoptet admin all keep working unchanged.

import { SEL } from '../../core/selectors.js';

const MIN_DISTANCE = 40; // px of horizontal travel that counts as a swipe
const CLICK_THRESHOLD = 10; // px after which the gesture is no longer a tap

function bind(carousel) {
  const $ = window.jQuery;
  // jQuery is required here: the Bootstrap carousel plugin is jQuery-based.
  if (!$ || !$.fn.carousel) return;

  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let suppressClick = false;

  carousel.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    pointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    suppressClick = false;
  });

  carousel.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pointerId) return;
    if (Math.abs(e.clientX - startX) > CLICK_THRESHOLD) suppressClick = true;
  });

  carousel.addEventListener('pointerup', (e) => {
    if (e.pointerId !== pointerId) return;
    pointerId = null;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) >= MIN_DISTANCE && Math.abs(dx) > Math.abs(dy)) {
      $(carousel).carousel(dx < 0 ? 'next' : 'prev');
    }
  });

  carousel.addEventListener('pointercancel', () => {
    // Browser took over (vertical scroll) — not a swipe.
    pointerId = null;
  });

  // A swipe over a banner must not open the banner link.
  carousel.addEventListener(
    'click',
    (e) => {
      if (!suppressClick) return;
      e.preventDefault();
      e.stopPropagation();
      suppressClick = false;
    },
    true,
  );

  // Desktop: stop the browser's native image/link drag during mouse swipes.
  carousel.addEventListener('dragstart', (e) => e.preventDefault());
}

export default {
  name: 'carousel-swipe',
  pages: ['home'],
  init(root) {
    root.querySelectorAll(SEL.carousel).forEach((carousel) => {
      if (carousel.dataset.tsInit) return;
      carousel.dataset.tsInit = 'carousel-swipe';
      carousel.classList.add('ts-carousel-swipe');
      bind(carousel);
    });
  },
};
