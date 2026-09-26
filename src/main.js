import { start } from './core/index.js';
import carouselSwipe from './modules/carousel-swipe/index.js';
import gallerySwipe from './modules/gallery-swipe/index.js';
// C3 · client's unfinished grid/list view, imported verbatim as the starting point.
import './legacy/list-view/list-view.js';

// Register every module here. Order = init order.
start([carouselSwipe, gallerySwipe]);
