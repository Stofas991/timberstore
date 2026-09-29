// M1 · Homepage banner carousel cannot be swiped on mobile.
//
// Shoptet renders the banner carousel as a Bootstrap 3 carousel, which has no
// touch support. Instead of rebuilding it on Swiper (loaded by the Apollo
// template, version not under our control), we add swipe gestures and drive
// the existing carousel through its own API. Indicators, autoplay, banner
// management in the Shoptet admin all keep working unchanged.
//
// Client feedback: a swiped-in slide was blank for a moment (its image is
// loading="lazy") and the 0.6 s slide felt slow under a finger. So: preload the
// other slides once the page is idle, and use a 350 ms slide on touch devices.

import { SEL } from '../../core/selectors.js';
import { bindSwipe } from '../../core/swipe.js';
import { whenIdleAfterLoad, preloadImage } from '../../core/idle.js';

const TOUCH_TRANSITION_MS = 350; // keep in sync with carousel-swipe.css

function isTouchDevice() {
  return window.matchMedia?.('(hover: none) and (pointer: coarse)').matches;
}

function preloadSlides(carousel) {
  whenIdleAfterLoad(() => {
    carousel.querySelectorAll(SEL.carouselImage).forEach((img) => {
      if (img.loading === 'lazy') img.loading = 'eager';
      if (img.dataset.src && img.dataset.src !== img.src) preloadImage(img.dataset.src);
    });
  });
}

function bind(carousel) {
  const $ = window.jQuery;
  // jQuery is required here: the Bootstrap carousel plugin is jQuery-based.
  if (!$ || !$.fn.carousel) return;

  // Bootstrap 3 has one global slide duration (the fallback timer for the CSS
  // transition). #carousel is the only Bootstrap carousel on the site, and we only
  // get here when it exists.
  const Carousel = $.fn.carousel.Constructor;
  if (isTouchDevice() && Carousel) Carousel.TRANSITION_DURATION = TOUCH_TRANSITION_MS;

  bindSwipe(carousel, (dir) => $(carousel).carousel(dir));
  preloadSlides(carousel);
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
