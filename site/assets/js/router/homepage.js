import { gsap } from "gsap";

const homepageView = {
    namespace: 'home',
    beforeEnter(data) {
        // console.log('hello homepage BARBA');
    }
};

const homepageTransition = {
    name: 'home-transition',
    to: {
        namespace: [
          'home'
        ]
    },
    once({ current, next, trigger }) {
        const loader = gsap.timeline();
        loader.set("#js-loader-title-out", {opacity: 0});
        loader.to("#js-loader-title", {opacity: .8, duration: 1});
        loader.from("#js-loader-slider", {scaleY: 1, duration: 1, ease: "Power2.easeInOut"}, "-=.5");
        loader.from(".js-hp-img", {y: 10, autoAlpha: 0, duration: .8}, "-=.3");
        loader.set("#js-loader-title-out", {opacity: 1}, "-=.5");
        loader.from(".js-loader-infos", {opacity: 0, duration: 1}, "-=.2");
        loader.to("#js-loader-title", {opacity: 0, duration: 1}, "-=1");
        loader.from(".js-header", {opacity: 0, duration: 1}, "-=0.5");
    },
    leave({ current, next, trigger }) {
        return new Promise(resolve => {
            gsap.to(current.container, {autoAlpha: 0, duration: .6, onComplete: () => {
                resolve()
            }})
        })
    },
    enter({ current, next, trigger }) {
        gsap.from(next.container, {autoAlpha: 0, duration: 1})
    },
}

 export { homepageView, homepageTransition };