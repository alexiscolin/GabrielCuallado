import { gsap } from "gsap";

const homepageView = {
    namespace: 'homepage',
    beforeEnter(data) {
    }
};

const homepageTransition = function (imgFunc){
    return {
        name: 'homepage-transition',
        to: {
            namespace: [
            'homepage'
            ]
        },
        once({ current, next, trigger }) {
            const loader = gsap.timeline();
            loader.set("#js-loader-title-out", {opacity: 0});
            loader.to("#js-loader-title", {opacity: .8, duration: 1});

            loader.to("#js-loader-slider", {scaleY: 0, duration: 1, ease: "Power2.easeInOut"}, "-=.5");
            loader.call(imgFunc, null, "-=.25")

            loader.from(".js-hp-img", {y: 10, autoAlpha: 0, duration: .8}, "-=.3");
            loader.set("#js-loader-title-out", {opacity: 1}, "-=.5");
            loader.from(".js-loader-infos", {opacity: 0, duration: 1}, "-=.2");
            loader.to("#js-loader-title", {opacity: 0, duration: 1}, "-=1");
            loader.from(".js-header", {opacity: 0, duration: 1}, "-=1");

            const canvas = document.querySelector('.dom-gl');
            gsap.to(canvas, {autoAlpha: 1, duration: .5});
        },
        leave({ current, next, trigger }) {
            return new Promise(resolve => {
                const canvas = document.querySelector('.dom-gl');
                gsap.to(canvas, {autoAlpha: 0, duration: .5});
                gsap.to(current.container, {autoAlpha: 0, duration: .6, onComplete: () => {
                    resolve()
                }})
            })
        },
        enter({ current, next, trigger }) {
            const canvas = document.querySelector('.dom-gl');
            gsap.to(canvas, {autoAlpha: 1, duration: .5});
            gsap.set("#js-loader-slider", {scaleY: 0});
            gsap.from(next.container, {autoAlpha: 0, duration: 1, onComplete: () => imgFunc.call(this)})
        },
    }
}

export { homepageView, homepageTransition };