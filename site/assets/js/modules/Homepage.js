import { module } from 'modujs';
import Gl from "../gl";
import Slider from '../gl/Slider';
import { preloadImages } from '../utils';
import { Events } from '../events';
import {requestInterval, clearRequestInterval} from '../utils';


export default class extends module {
    constructor(m) {
        super(m);

        this.glObject = null;
    } 

    init() {
        if (window.matchMedia("(min-width: 640px)").matches) {
            preloadImages().then(() => {
                const homeImg = this.el.querySelector('[data-parallaxe="img"]');
                this.glObject = new Slider(); 
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

            this.slider = requestInterval(this.slide.bind(this), 5000);
        }
    }
    slide() {
        this.glObject.slide();
    }

    appear() {
        this.glObject.isViewed();
    }

    destroy() {
        clearRequestInterval(this.slider);
        Gl.scroll = 0;
        this.glObject.destroy();
    }
}