import { module } from 'modujs';
import { gsap } from "gsap";

export default class extends module {
    constructor(m) {
        super(m);

        this.menu = this.$('menu');
        this.menuToogle = [...this.$('menuToogle')[0].querySelectorAll('.js-header-bar')];
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
        gsap.to(this.menuToogle[0], {transform: this.isOpen ? 'rotate(45deg) translateY(5px)' : 'rotate(0deg)', background: this.isOpen ? '#000' : '#FFF', duration: .5});
        gsap.to(this.menuToogle[1], {transform: this.isOpen ? 'rotate(-45deg) translateY(-5px)' : 'rotate(0deg)', background: this.isOpen ? '#000' : '#FFF', duration: .5});
    }

    destroy() {
        console.log('end nav')
    }
}