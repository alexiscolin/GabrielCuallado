import { module } from 'modujs';
import Gl from "../gl";
import Plane from '../gl/Plane';
import { preloadImages } from '../utils';
import { Events } from '../events';

export default class extends module {
    constructor(m) {
        super(m);

        this.glObject = null;
    }

    init() {
        console.log('hello home');
        preloadImages().then(() => {
            const homeImg = this.el.querySelector('[data-parallaxe="img"]');
            this.glObject = new Plane();
            this.glObject.init(homeImg, 0);

            const el = {
                el: homeImg,
                glObject: this.glObject,
                speed: homeImg.dataset.speed,
                type: homeImg.dataset.parallaxe,
                dir: 0
            };
            Events.emit('scroll', {els: [el], x: 0});
        }); 
    }
    appear() {
        this.glObject.isViewed();
    }
    destroy() {
        Gl.scroll = 0;
        this.glObject.destroy();
    }

}