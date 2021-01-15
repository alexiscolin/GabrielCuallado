import { module } from 'modujs';
import { gsap } from "gsap";

export default class extends module {
    constructor(m) {
        super(m);

        this.menu = this.$('menu');
        this.menuToogle = [...this.$('menuToogle')[0].querySelectorAll('.js-header-bar')];
        this.isOpen = false;
        this.sublist = false;

        this.events = {
            click: {
                menuToogle: 'toogleNav',
                submenuToogle : 'submenuToogle'
            }
        }
    }

    init() {

    }

    submenuToogle  (e) {
        const el = e.currentTarget.nextElementSibling.firstElementChild;
        const dif = this.sublistEl !== el;
        this.sublist = !dif ? this.sublist : !this.sublist;

        if(this.sublistEl) {
            gsap.to(this.sublistEl, {height : 0, autoAlpha: 0, duration: 1})
            this.sublistEl.dataset.open = dif ? "false" : this.sublistEl.dataset.open;
        } 

        this.sublistEl = el;
        gsap.to(this.sublistEl, {height: dif ? 'auto' : this.sublistEl.dataset.open === "true" ? 0 : 'auto', autoAlpha: dif ? 1 : this.sublistEl.dataset.open === "true" ? 0 : 1, duration: 1})
        this.sublistEl.dataset.open = this.sublistEl.dataset.open === "true" ? "false" : "true";
    }

    toogleNav () {
        console.log('in')
        this.isOpen = !this.isOpen;
        gsap.to(this.menu, {autoAlpha: this.isOpen ? 1 : 0, duration: 1});
        gsap.to(this.menuToogle[0], {transform: this.isOpen ? 'rotate(45deg) translateY(5px)' : 'rotate(0deg)', background: this.isOpen ? '#000' : '#FFF', duration: .5});
        gsap.to(this.menuToogle[1], {transform: this.isOpen ? 'rotate(-45deg) translateY(-5px)' : 'rotate(0deg)', background: this.isOpen ? '#000' : '#FFF', duration: .5});
    }

    destroy() {
    }
}