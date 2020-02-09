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
        
        // this.isActivated = true;
        this.parallax = new Parallax(this.el);

        
        this.scroll = window.innerWidth > 640 ? new SmoothScroll(opts, 'fixedClass') : null;

        // this.bindEvents()

    }

    // bindEvents () {
    //     this.resizeFunc = this.resize.bind(this);
    //     window.addEventListener('resize', this.resizeFunc, false);
    // }

    // resize () {
    //     if("matchMedia" in window) { 
    //         if(window.matchMedia("(max-width:640px)").matches) {
    //             if(this.isActivated === true) {
    //                 this.destroyScroll();
    //                 console.log('in')
    //             }
    //             this.isActivated = false;
    //         } else {
    //             if(this.isActivated === false) {
    //                 this.init()
    //             }
    //             this.isActivated = true;
    //         }
    //       }
    // }

    // destroyScroll () {
    //     this.scroll.destroy();
    // }

    destroy() {
        console.log('end scroll')
        this.parallax.destroy();
        this.scroll.destroy();
        // this.destroyScroll();
        // window.removeEventListener('resize', this.resizeFunc, false);

        for (let prop in this) {
            if (!Object.prototype.hasOwnProperty.call(this, prop)) continue;
  
            this[prop] = null;
            delete this[prop];
        }
    }
}