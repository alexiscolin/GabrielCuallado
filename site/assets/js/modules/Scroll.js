import { module } from 'modujs';
import { SmoothScroll } from 'smooth-scrollr';
import Parallax from '../lib/Parallax';

export default class extends module {
    constructor(m) {
        super(m);
        console.log('start scroll')
    }

    init() {
        const opts = {
            parallax: false,
            touch: false,
            delay: .1,
            direction: "horizontal",
            speed: .9,
            section: this.el,
            touchSpeed: 2,
            jump: 120,
        };
          
        this.parallax = new Parallax(this.el);
        this.scroll = new SmoothScroll(opts, 'fixedClass');

    }

    destroy() {
        console.log('end scroll')
        this.parallax.destroy()
        this.scroll.destroy();

        for (let prop in this) {
            if (!Object.prototype.hasOwnProperty.call(this, prop)) continue;
  
            this[prop] = null;
            delete this[prop];
        }
    }
}