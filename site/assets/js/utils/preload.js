const imagesLoaded = require('imagesloaded');

// Preload images
export function preloadImages() {
    return new Promise((resolve, reject) => {
        imagesLoaded(document.querySelectorAll('img'), {background: true}, resolve);
    });
};