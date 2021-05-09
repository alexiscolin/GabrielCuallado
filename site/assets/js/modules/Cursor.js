import module from '../lib/module.js';
import gsap from 'gsap';
import Events from '../events/Events';
import { lerp, calcWinsize, getMousePos } from '../utils';



// // Calculate the viewport size
let winsize = calcWinsize();
window.addEventListener('resize', () => {
    winsize = calcWinsize();
});

// // Track the mouse position
let mouse = {x: 0, y: 0};

export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
        this.DOM = { el: this.el };
        this.DOM.el.style.opacity = 0;
        this.DOM.circleInner = this.DOM.el.querySelector('.cursor__inner');
        this.firstLaod = true;
        this.filterId = '#filter-1';
        this.DOM.feTurbulence = document.querySelector(`${this.filterId} > feTurbulence`);

        this.primitiveValues = { turbulence: 0 };

        this.createTimeline();

        this.bounds = this.DOM.el.getBoundingClientRect();

        this.renderedStyles = {
            tx: { previous: 0, current: 0, amt: 0.2 },
            ty: { previous: 0, current: 0, amt: 0.2 },
            radius: { previous: 60, current: 60, amt: 0.2 },
            stroke: { previous: 1, current: 1, amt: 0.2 }
        };

        this.listen();

        this.onMouseMoveEv = () => {
            this.firstLaod = false;
            this.renderedStyles.tx.previous = this.renderedStyles.tx.current = mouse.x - this.bounds.width/2;
            this.renderedStyles.ty.previous = this.renderedStyles.ty.previous = mouse.y - this.bounds.height/2;
            gsap.to(this.DOM.el, {duration: 0.9, ease: 'Power3.easeOut', opacity: 1});
            requestAnimationFrame(() => this.render());
            window.removeEventListener('mousemove', this.onMouseMoveEv);
        };

        window.addEventListener('mousemove', ev => mouse = getMousePos(ev));
        window.addEventListener('mousemove', this.onMouseMoveEv);        
    }

    render() {
        this.renderedStyles['tx'].current = mouse.x - this.bounds.width / 2;
        this.renderedStyles['ty'].current = mouse.y - this.bounds.height / 2;

        for (const key in this.renderedStyles) {
            this.renderedStyles[key].previous = lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].amt);
        }

        this.DOM.el.style.transform = `translateX(${(this.renderedStyles['tx'].previous)}px) translateY(${this.renderedStyles['ty'].previous}px)`;
        this.DOM.circleInner.setAttribute('r', this.renderedStyles['radius'].previous);
        this.DOM.circleInner.style.strokeWidth = `${this.renderedStyles['stroke'].previous}px`;

        requestAnimationFrame(() => this.render());
    }
    createTimeline() {
        // init timeline
        this.tl = gsap.timeline({
            paused: true,
            onStart: () => {
                this.DOM.circleInner.style.filter = `url(${this.filterId}`;
            },
            onUpdate: () => {
                this.DOM.feTurbulence.setAttribute('baseFrequency', this.primitiveValues.turbulence);
            },
            onComplete: () => {
                this.DOM.circleInner.style.filter = 'none';
            }
        })
        .to(this.primitiveValues, {
            duration: 0.6,
            ease: "rough({ template: none.out, strength: 2, points: 120, taper: 'none', randomize: true, clamp: false})",
            startAt: { turbulence: 0.03 },
            turbulence: 0
        });
    }

    displayArrow(dir) {
        gsap.killTweensOf(this.$('arrow'));
        gsap.to(this.$('arrow'), {autoAlpha: 1, duration: 1});
        gsap.to(this.$('arrow'), {rotate: dir === "next" ? 90 : -90, transformOrigin:"center", duration: .5});
    }
    hideArrow(dir) {
        gsap.killTweensOf(this.$('arrow'));
        gsap.to(this.$('arrow'), {autoAlpha: 0, duration: .5});
        gsap.to(this.$('arrow'), {rotate: 0, duration: .5});
    }

    disapear() {
        gsap.to(this.DOM.el, {duration: 0.5, ease: 'Power3.easeOut', opacity: 0});
    }
    appear() {
        gsap.to(this.DOM.el, {duration: 0.5, ease: 'Power3.easeOut', opacity: 1});
    }
    enter(target) {
        this.renderedStyles['radius'].current = 45;
        this.renderedStyles['stroke'].current = 2;
        if(target && target.dataset.link === "menu") {
            this.disapear();
        }
        this.tl.restart();
    }
    leave() {
        this.renderedStyles['radius'].current = 60;
        this.renderedStyles['stroke'].current = 1;
        this.tl.progress(1).kill();
        this.appear()
    }
    


    listen() {
        Events.on('cursorEnter', ({target}) => this.enter(target));
        Events.on('cursorLeave', () => this.leave());
        Events.on('pageLoad', () => this.firstLaod || this.leave());
        Events.on('cursorAppear', () => this.appear());
        Events.on('cursorDisapear', () => this.disapear());
    }



    destroy() {
    }
}