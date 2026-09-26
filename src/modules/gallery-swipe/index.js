// M1 · Product detail photos cannot be swiped on mobile.
//
// Shoptet's product gallery is a main image plus thumbnails; clicking a
// thumbnail swaps the main image. A swipe over the main image clicks the
// next/previous thumbnail, so Shoptet's own gallery logic (variants, lightbox,
// highlighted thumbnail) stays in charge. Stops at the first/last photo.

import { SEL } from '../../core/selectors.js';
import { bindSwipe } from '../../core/swipe.js';

function bind(image) {
  bindSwipe(image, (dir) => {
    // Re-read on every swipe: Shoptet redraws thumbnails on variant change.
    const thumbs = [...document.querySelectorAll(SEL.productThumbnail)];
    if (thumbs.length < 2) return;
    const current = thumbs.findIndex((t) => t.classList.contains(SEL.productThumbnailActiveClass));
    const target = thumbs[Math.max(0, current) + (dir === 'next' ? 1 : -1)];
    if (target) target.click();
  });
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
    });
  },
};
