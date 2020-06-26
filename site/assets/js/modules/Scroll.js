import { module } from 'modujs';
import { SmoothScroll } from 'smooth-scrollr';
import { gsap } from "gsap";
// import Parallax from '../lib/Parallax';

export default class extends module {
    constructor(m) {
        super(m);

        this.container = this.el;
        this.els = [];
        this.windowWidth = window.innerWidth;
        this.prlxEls = [];
        this.tl = gsap.timeline();
        // this.timer = 0;

    }

    init() {
        //this.addElements() --> dans le preload
 
        console.log('init scroll')
        const opts = {
            callback: this.parallax.bind(this),
            touch: false,
            delay: .1,
            direction: "horizontal",
            speed: .9,
            section: this.el,
            touchSpeed: 2,
            jump: 120,
            initFunc: [this.addElements.bind(this), this.parallax.bind(this, 1)]
        };

        
        if (window.innerWidth > 640) {
            this.scroll = new SmoothScroll(opts, 'fixedClass');
            this.parallax(1)
        } else {
            this.scroll = null;
        }

    }

    // detect all elements
    addElements () {
        // this.els = this.container.querySelectorAll('[data-parallaxe]');
        this.els = [...this.container.querySelectorAll('[data-parallaxe]')].map(el => {
            return {
                el,
                speed: el.dataset.speed || 0,
                inView: false, // every view
                isView: false, // first view
                left: el.getBoundingClientRect().left,
                right: el.getBoundingClientRect().left + el.getBoundingClientRect().width,
                initLeft: el.getBoundingClientRect().left,
                initRight: el.getBoundingClientRect().left + el.getBoundingClientRect().width
            }

        });

        // this.prlxEls.forEach(el => {           
        //     const canvas = el.el.querySelector('.js-prlx-canvas')
        //     console.log(canvas)
        // });



        // const options = {
        //     root: null,
        //     rootMargin: "0px"
        // };
        // this.observer = new IntersectionObserver(cb => this.isInVew.call(this, cb), options);

        // this.els.forEach(el => {
        //     this.observer.observe(el);
        // })
    }

  

    parallax (moveTo, movePrev) {
        // scroll level / viewport
        const scrollLeft = Math.abs(moveTo);
        const scrollRight = scrollLeft + this.windowWidth;

        if (this.els.length > 0) {
            this.els.forEach(prlxEl => {

                if (prlxEl.right > scrollLeft && prlxEl.left < scrollRight) {
                    
                    if(prlxEl.isView === false) {
                        if(prlxEl.el.dataset.parallaxe === "img") {
                            const el = prlxEl.el.querySelector('.js-prlx-img');
                            console.log(el)
                            // const effect = prlxEl.el.querySelector('feDisplacementMap')
                            // const grey = prlxEl.el.querySelector('feColorMatrix')
                            // gsap.to(grey, {attr:{values : "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"}, duration: 1.5, ease: "Power3.easeInOut"})
                            gsap.to(el, {clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1, delay: this.timer, ease: "Power3.easeInOut", onComplete: _ => this.timer -= .2});
                            // gsap.to(effect, {attr:{scale : 0}, duration: 1.5, delay: this.timer, ease: "Power3.easeInOut", onComplete: _ => el.setAttribute('filter',  'none')});
                        }
                        else {
                            const el = prlxEl.el
                            gsap.to(el, {autoAlpha: 1, duration: 1, delay: this.timer, ease: "Power3.easeInOut", onComplete: _ => this.timer -= .2});
                        }
                        prlxEl.isView = true;
                    }
                    prlxEl.inView = true;
                } else {
                   prlxEl.inView = false;
                }
                if(prlxEl.inView && prlxEl.el.dataset.parallaxe === "img") {
                    const dir = (prlxEl.initLeft - scrollRight) * prlxEl.speed;
                    prlxEl.el.style.transform = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,${dir},0,0,1)`;
                    prlxEl.right = prlxEl.el.getBoundingClientRect().left + prlxEl.el.getBoundingClientRect().width + scrollLeft;
                    prlxEl.left = prlxEl.el.getBoundingClientRect().left + scrollLeft;
                }
            })    
        }
    }

    // intersection observer zone (section et els)
    // isInVew (entries) {
    //     // récupérer la target pour les éléments visibles
    //     const elementsIn = entries.filter(entry => (entry.isIntersecting === true)).map(entry => entry.target);
    //     const elementsOut = entries.filter(entry => (entry.isIntersecting === false)).map(entry => entry.target);

    //     elementsIn.forEach(entry => this.observer.unobserve(entry)); // --> ATTENTION LE REMETTRE EN DESTROY

    //     if(elementsIn.length > 0) {
    //         // metter un forEach de l'array et changer le timer ddedans
    //         elementsIn.forEach(element => {
    //             if(element.dataset.parallaxe === "img") {
    //                 this.prlxEls.filter(prlxEl => prlxEl.el === element).forEach(item => {
    //                     // item.el.style.transform = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,${(item.left - 0) * item.speed },0,0,1)`;
    //                     return item.inView = true
    //                 }); 
                   


    //                 const el = element.querySelector('.js-prlx-img');
    //                 gsap.to(el, {clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1, delay: this.timer, ease: "Power3.easeInOut", onComplete: _ => this.timer -= .2});
    //             } else {
    //                 gsap.to(element, {autoAlpha: 1, duration: 1, delay: this.timer, ease: "Power3.easeInOut", onComplete: _ => this.timer -= .2});
    //             }

    //             this.timer = this.timer + .8;
    //         })
    //     }

    //     if(elementsOut.length > 0) {
    //         elementsOut.forEach(element => {
    //             if(element.dataset.parallaxe === "img") {
    //                 this.prlxEls.filter(prlxEl => prlxEl.el === element).forEach(item => item.inView = false);   
    //             }
    //         });
    //     }
    // }


    destroy() {
        console.log('end scroll')
        console.log('end bla')

        //this.els.forEach(el => this.observer.unobserve(el));
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