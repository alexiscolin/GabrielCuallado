import { gsap } from "gsap";
import charming from 'charming'


const homepageView = {
    namespace: 'homepage',
    beforeEnter(data) {
    },
    afterEnter(data) {
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
            
            window.addEventListener('load', function () {
            const sub = document.getElementById('js-loader-subtitle');
            charming(sub, {
                setClassName: function (index, letter) {
                    return `char letter-${letter}`
                }
            });

            const loader = gsap.timeline();
            loader.set("#js-loader-title-out", {opacity: 0});
            loader.to("#js-loader-title", {opacity: .8, duration: 1});

            loader.to("#js-loader-slider", {scaleY: 0, duration: 1, ease: "Power2.easeInOut"}, "-=.5");
            loader.call(imgFunc, null, "-=.25")

            // loader.from(".js-hp-img", {y: 10, autoAlpha: 0, duration: .8}, "-=.3"); // avant slider
            loader.set("#js-loader-title-out", {opacity: 1}, "-=.5");
            loader.from("#js-loader-date", {opacity: 0, duration: 1}, "-=.2");
            loader.from(sub.querySelectorAll('.char'), {opacity: 0, duration: 1, stagger: {from: 'random', amount: 1}}, "-=1.2");
            loader.to("#js-loader-title", {opacity: 0, duration: 1}, "-=1");
            loader.from(".js-header", {opacity: 0, duration: 1}, "-=1");

            loader.to("#js-loader-content", {autoAlpha: 1, duration: 1},"-=.6");
            loader.to("#js-loader-circle",{strokeDashoffset: 0, duration: 1},"-=1.6")
            loader.to("#js-loader-arrow",{autoAlpha:1, duration: 1},"-=.8")

            const canvas = document.querySelector('.dom-gl');
            gsap.to(canvas, {autoAlpha: 1, duration: .5});
        })
        },
        leave({ current, next, trigger }) {
            return new Promise(resolve => {
                const canvas = document.querySelector('.dom-gl');
                gsap.to(canvas, {autoAlpha: 0, duration: .6});
                gsap.to(current.container, {autoAlpha: 0, duration: .6, delay: .05,onComplete: () => {
                    resolve()
                }})
            })
        },
        enter({ current, next, trigger }) {
            const canvas = document.querySelector('.dom-gl');
            const sub = document.getElementById('js-loader-subtitle');
            charming(sub, {
                setClassName: function (index, letter) {
                    return `char letter-${letter}`
                }
            });
            gsap.to(canvas, {autoAlpha: 1, duration: .5});
            gsap.set("#js-loader-slider", {scaleY: 0});
            gsap.from("#js-loader-date", {opacity: 0, duration: 1});
            gsap.from(sub.querySelectorAll('.char'), {opacity: 0, duration: 1, stagger: {from: 'random', amount: 1}});

            gsap.to("#js-loader-content", {autoAlpha: 1, duration: 1, delay: 1});
            gsap.to("#js-loader-circle",{strokeDashoffset: 0, duration: 1, delay: 1})
            gsap.to("#js-loader-arrow",{autoAlpha:1, duration: 1, delay: 1.2})

            gsap.from(next.container, {autoAlpha: 0, duration: 1});
            setTimeout(_=>imgFunc.call(this), 100)
        },
    }
}

export { homepageView, homepageTransition };