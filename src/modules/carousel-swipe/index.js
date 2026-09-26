// M1 · Homepage banner carousel cannot be swiped on mobile.
//
// Shoptet renders the banner carousel as a Bootstrap 3 carousel, which has no
// touch support. Instead of rebuilding it on Swiper (loaded by the Apollo
// template, version not under our control), we add swipe gestures and drive
// the existing carousel through its own API. Indicators, autoplay, banner
// management in the Shoptet admin all keep working unchanged.

import { SEL } from '../../core/selectors.js';
import { bindSwipe } from '../../core/swipe.js';

function bind(carousel) {
  const $ = window.jQuery;
  // jQuery is required here: the Bootstrap carousel plugin is jQuery-based.
  if (!$ || !$.fn.carousel) return;
  bindSwipe(carousel, (dir) => $(carousel).carousel(dir));
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
