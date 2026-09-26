// Shoptet (Apollo template) selectors — the only place that knows Shoptet markup.
// When the template changes, fix it here.
export const SEL = {
  // Homepage banner carousel (Bootstrap 3 carousel rendered by Shoptet)
  carousel: '#carousel.carousel',
  carouselItem: '.item',
  // Product detail gallery: main image + thumbnails (verified 2026-09-26)
  productImage: '.p-image-wrapper .p-image',
  productThumbnail: '.p-thumbnails a.p-thumbnail',
  productThumbnailActiveClass: 'highlighted',
  // Transparent layer cloud-zoom puts over the main image (rebuilt ~201 ms after every photo switch)
  productZoomTrap: '.mousetrap',
};
