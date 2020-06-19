import { module } from 'modujs';
import { SmoothScroll } from 'smooth-scrollr';
import { gsap } from "gsap";
// import Parallax from '../lib/Parallax';

export default class extends module {
    constructor(m) {
        super(m);
        console.log('start scroll');

        this.container = this.el;
        this.els = [];
        this.prlxEls = [];
        this.tl = gsap.timeline();
        // this.timer = 0;

    }

    init() {

        this.addElements()
 
        const opts = {
            callback: this.parallax.bind(this),
            touch: false,
            delay: .1,
            direction: "horizontal",
            speed: .9,
            section: this.el,
            touchSpeed: 2,
            jump: 120,
        };

        
        this.scroll = window.innerWidth > 640 ? new SmoothScroll(opts, 'fixedClass') : null;

    }

    // detect all elements
    addElements () {
        this.els = this.container.querySelectorAll('[data-parallaxe]');
        this.prlxEls = [...this.container.querySelectorAll('[data-parallaxe="img"]')].map(el => {
            return {
                el,
                speed: el.dataset.speed || 0,
                inView: false
            }
        });

        const options = {
            root: null,
            rootMargin: "0px"
        };
        this.observer = new IntersectionObserver(cb => this.isInVew.call(this, cb), options);

        this.els.forEach(el => {
            this.observer.observe(el);
        })
    }

    lerp(start, end, amt){
        return (1 - amt) * start + amt * end
    }

    parallax (moveTo, movePrev) {
        if (this.prlxEls.length > 0) {
            this.prlxEls.forEach(prlxEl => {
                if(prlxEl.inView) {
                    const lerpX = this.lerp(movePrev, moveTo, prlxEl.speed);
                    // prlxEl.el.style.transform = `translate3D(${lerpX}px,0,0)`
                    prlxEl.el.style.transform = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,${moveTo * prlxEl.speed },0,0,1)`;
                }
            })    
        }
    }

    // intersection observer zone (section et els)
    isInVew (entries) {
        // récupérer la target pour les éléments visibles
        const elementsIn = entries.filter(entry => (entry.isIntersecting === true)).map(entry => entry.target);
        const elementsOut = entries.filter(entry => (entry.isIntersecting === false)).map(entry => entry.target);

        elementsIn.forEach(entry => this.observer.unobserve(entry)); // --> ATTENTION LE REMETTRE EN DESTROY

        if(elementsIn.length > 0) {
            // metter un forEach de l'array et changer le timer ddedans
            elementsIn.forEach(element => {
                if(element.dataset.parallaxe === "img") {
                    this.prlxEls.filter(prlxEl => prlxEl.el === element).forEach(item => item.inView = true);   

                    const el = element.querySelector('.js-prlx-img');
                    gsap.to(el, {clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1, delay: this.timer, ease: "Power3.easeInOut", onComplete: _ => this.timer -= .2});
                } else {
                    gsap.to(element, {autoAlpha: 1, duration: 1, delay: this.timer, ease: "Power3.easeInOut", onComplete: _ => this.timer -= .2});
                }

                this.timer = this.timer + .8;
            })
        }

        if(elementsOut.length > 0) {
            elementsOut.forEach(element => {
                if(element.dataset.parallaxe === "img") {
                    this.prlxEls.filter(prlxEl => prlxEl.el === element).forEach(item => item.inView = false);   
                }
            });
        }
    }


    destroy() {
        console.log('end scroll')

        this.els.forEach(el => this.observer.unobserve(el));
        //this.observer.disconnect();
        this.tl.kill();

        // this.parallax.destroy();
        this.scroll && this.scroll.destroy();
        // this.destroyScroll();
        // window.removeEventListener('resize', this.resizeFunc, false);

        for (let prop in this) {
            if (!Object.prototype.hasOwnProperty.call(this, prop)) continue;
  
            this[prop] = null;
            delete this[prop];
        }
    }
}