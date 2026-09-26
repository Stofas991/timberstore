import { start } from './core/index.js';
import carouselSwipe from './modules/carousel-swipe/index.js';

// Register every module here. Order = init order.
start([carouselSwipe]);
