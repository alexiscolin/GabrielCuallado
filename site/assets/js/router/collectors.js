import { gsap } from "gsap";

const collectorsView = {
    namespace: 'collectors',
    beforeEnter(data) {
    },
    afterEnter(data) {
    }
};

const collectorsTransition = {
    name: 'collectors-transition',
    leave({ current, next, trigger }) {
        return new Promise(resolve => {
            const canvas = document.querySelector('.dom-gl');
            gsap.to(canvas, {autoAlpha: 0, duration: .6});
            gsap.to(current.container, {autoAlpha: 0, duration: .6, onComplete: () => {
                resolve()
            }})
        })
    },
    enter({ current, next, trigger }) {
        const canvas = document.querySelector('.dom-gl');
        const menu = [...next.container.querySelectorAll('.js-sub-links')];
        gsap.to(canvas, {autoAlpha: 1, duration: .5});
        gsap.from(next.container, {autoAlpha: 0, duration: 1});
        gsap.fromTo(menu, {autoAlpha: 0},{autoAlpha: (i,target)=>{return target.classList.contains('c-innernav_link--active') ? 1 : .5}, duration: .6, stagger: .1})

    },
    once({ current, next, trigger }) {
        const canvas = document.querySelector('.dom-gl');
        const menu = [...next.container.querySelectorAll('.js-sub-links')];

        gsap.to(canvas, {autoAlpha: 1, duration: .5});
        gsap.from(next.container, {autoAlpha: 0, duration: 1});
        gsap.fromTo(menu, {autoAlpha: 0},{autoAlpha: (i,target)=>{return target.classList.contains('c-innernav_link--active') ? 1 : .5}, duration: .6, stagger: .1})
    },
    to: {
        namespace: [
          'collectors'
        ]
    }
}

 export { collectorsView, collectorsTransition };