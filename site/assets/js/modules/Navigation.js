import { module } from 'modujs';
import { gsap } from "gsap";

export default class extends module {
    constructor(m) {
        super(m);
        console.log('start nav');

        this.menu = this.$('menu');
        this.isOpen = false;

        this.events = {
            click: {
                menuToogle: 'toogleNav'
            }
        }
    }

    init() {

    }

    toogleNav () {
        this.isOpen = !this.isOpen;
        gsap.to(this.menu, {autoAlpha: this.isOpen ? 1 : 0, duration: 1});
        console.log('open');

    }

    destroy() {}
}