import module from '../lib/module.js';
import { gsap } from "gsap";

export default class extends module {
    constructor(m) {
        super(m);
    }

    init(){
        const books = this.el.querySelectorAll('[data-appear]');
        gsap.to(books, {autoAlpha: 1, duration: 1, delay: 0, ease: "Power3.easeInOut"});

    }

    destroy() {
    }
}