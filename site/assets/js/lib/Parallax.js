import { gsap } from "gsap";

export default class {
    constructor (container) {
        this.container = container;
        this.els = [];
        this.tl = gsap.timeline();
        this.timer = 0;

        this.init()
    }

    init () {
        this.addElements()
    }


    // sur chaque section foreach des éléments 
    addElements () {
        this.els = this.container.querySelectorAll('[data-parallaxe]');
        const options = {
            root: null,
            rootMargin: "0px"
        };
        this.observer = new IntersectionObserver(cb => this.isInVew.call(this, cb), options);

        this.els.forEach(el => {
            this.observer.observe(el);
        })
    }

    // Chck if element is inview
    // detectElement () {
    //     const els = this.sections[y].el.querySelectorAll(`[data-${this.name}]`);
    // }

    // intersection observer zone (section et els)
    isInVew (entries) {
        // récupérer la target pour les éléments visibles
        const elements = entries.filter(entry => (entry.intersectionRatio > 0)).map(entry => entry.target);
        elements.forEach(entry => this.observer.unobserve(entry));

        if(elements.length > 0) {
            // metter un forEach de l'array et changer le timer ddedans
            elements.forEach(element => {
                gsap.to(element, {autoAlpha: 1, duration: 1, delay: this.timer, ease: "Power3.easeInOut", onComplete: _ => this.timer -= .2});
                this.timer = this.timer + .2;

            })
        }
    }
 
    destroy () {
        this.els.forEach(el => this.observer.unobserve(el));
        this.observer.disconnect();
        this.tl.kill();

        for (let prop in this) {
            if (!Object.prototype.hasOwnProperty.call(this, prop)) continue;
  
            this[prop] = null;
            delete this[prop];
        }
    }
}