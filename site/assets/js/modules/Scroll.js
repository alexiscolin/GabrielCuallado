import { module } from 'modujs';
import { SmoothScroll } from '../lib/smooth-scrollr-fork';
import { gsap } from "gsap";
import Gl from "../gl";
import Plane from '../gl/Plane';
import { preloadImages, calcWinsize } from '../utils';
import { Events } from '../events';

export default class extends module {
    constructor(m) {
        super(m);

        this.container = this.el;
        this.els = [];
        this.windowWidth = window.innerWidth;
        this.prlxEls = [];
        this.scrollPath = calcWinsize().width / 3;
        this.timer = 0;

        this.events = {
            click: {
                scrollof: 'clickToMove'
            },
            mouseenter: {
                scrollof: 'displayArrow'
            },
            mouseleave: {
                scrollof: 'hideArrow'
            }
        };
    }

    init() {
        preloadImages().then(() => {          
            if (window.matchMedia("(min-width: 640px)").matches) {

                const opts = {
                    callback: [this.parallax.bind(this), this.scroller.bind(this)],
                    touch: true,
                    delay: .1,
                    direction: "horizontal",
                    speed: .9,
                    section: this.el,
                    touchSpeed: 2,
                    jump: 120,
                    preloadFuncs: {
                        'error': this.onPreloadError.bind(this)
                    },
                    initFuncs: [this.addElements.bind(this), this.parallax.bind(this, .1,  0, 1)],
                    scrollFuncs: {
                        'startFunc': this.atStart.bind(this),
                        'runningFunc': this.atRun.bind(this),
                        'endFunc': this.atEnd.bind(this)
                    }
                };

                this.scroll = new SmoothScroll(opts, 'fixedClass');
            } else {
                this.scroll = null;
            }
        });
    }

    // detect all elements
    addElements () {
        let imageIndex = 0;
        Gl.scroll = 0;

        this.els = [...this.container.querySelectorAll('[data-parallaxe]')].map((el, index) => {
            let glObject = null;

            // init 3Dobj (image) 
            if (el.dataset.parallaxe === "img") {
                glObject = new Plane();
                glObject.init(el, imageIndex);

                imageIndex += 1;
            }

            return {
                el,
                glObject,
                speed: el.dataset.speed || 0,
                delay: el.dataset.delay || 0,
                inView: false, // every view
                isView: false, // first view
                type: el.dataset.parallaxe,
                dir: 0,
                left: el.getBoundingClientRect().left,
                right: el.getBoundingClientRect().left + el.getBoundingClientRect().width,
                initLeft: el.getBoundingClientRect().left,
                initRight: el.getBoundingClientRect().left + el.getBoundingClientRect().width
            }
        });
    }

    displayArrow (e) {
        this.call('displayArrow', e.currentTarget.dataset.scrollDir, 'Cursor');
    }
    hideArrow (e) {
        this.call('hideArrow', e.currentTarget.dataset.scrollDir, 'Cursor');
    }
    clickToMove (e) {
        const dir = e.currentTarget.dataset.scrollDir === 'next' ? this.scrollPath : -this.scrollPath
        this.scroll.scrollOf(dir);
    }

    // preload error for GTM
    onPreloadError (data) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'loadingFailure',
            'url': data.url,
            'status': data.status,
        });
    }

    // function to remove click to scroll depending on scroll position
    atStart () {
        this.$('scrollof').length > 0 && ([...this.$('scrollof')].filter(el => el.dataset.scrollDir === 'prev')[0].style.display = "none");
    }
    atEnd () {
        this.$('scrollof').length > 0 && ([...this.$('scrollof')].filter(el => el.dataset.scrollDir === 'next')[0].style.display = "none");
    }
    atRun () {
        this.$('scrollof').length > 0 && ([...this.$('scrollof')].forEach(el => el.style.display = "block"));
    }

    // Scroll bar
    scroller (moveTo, movePrev = 0, scrollMax = 0) {
        const clip = ((Math.abs(moveTo) * 100) / scrollMax).toFixed(0);
        gsap.to('.js-scroller', {clipPath: `polygon(${clip}% 0,100% 0%, 100% 100%, ${clip}% 100%)`})
    }

    parallax (moveTo, movePrev = 0, scrollMax = 0) {
        // scroll level / viewport
        const scrollLeft = Math.abs(moveTo);
        const scrollRight = scrollLeft + this.windowWidth;

        if (this.els.length > 0) {
            this.els.forEach((prlxEl) => {

                if (prlxEl.right > scrollLeft && prlxEl.left < scrollRight) {
                    
                    if(prlxEl.isView === false) {
                        const el = prlxEl.el

                        if(prlxEl.el.dataset.parallaxe === "img") {
                            prlxEl.glObject.isViewed()
                        }
                        else if(prlxEl.el.dataset.parallaxe === "bg") {
                            gsap.to(el.querySelector('.js-bg'), {scaleY: 1, duration: 1, delay: prlxEl.delay, ease: "Power3.easeInOut"});
                        }
                        else {
                            gsap.to(el, {autoAlpha: 1, duration: 1, delay: prlxEl.delay, ease: "Power3.easeInOut"});
                        }
                        prlxEl.isView = true;
                    }
                    prlxEl.inView = true;
                } else {
                   prlxEl.inView = false;
                }

                if(prlxEl.inView && prlxEl.el.dataset.parallaxe === "img" || prlxEl.el.dataset.parallaxe === "illu" || prlxEl.el.dataset.parallaxe === "bg") {
                    prlxEl.dir = (prlxEl.initLeft - scrollRight) * prlxEl.speed;
                    prlxEl.el.style.transform = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,${prlxEl.dir},0,0,1)`;
                    prlxEl.right = prlxEl.el.getBoundingClientRect().left + prlxEl.el.getBoundingClientRect().width + scrollLeft;
                    prlxEl.left = prlxEl.el.getBoundingClientRect().left + scrollLeft;
                }
            })   
            
            Events.emit('scroll', {els: this.els.filter(el => el.type === "img"), x: scrollLeft});
        }
    }


    destroy() {
        this.els.forEach(el => {
            if(!el.glObject) return;
            el.glObject.destroy()
        })

        this.scroll && this.scroll.destroy();
        Gl.scroll = 0;
        for (let prop in this) {
            if (!Object.prototype.hasOwnProperty.call(this, prop)) continue;
  
            this[prop] = null;
            delete this[prop];
        }
    }
}