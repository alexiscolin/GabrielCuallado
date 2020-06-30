import { gsap } from "gsap";

const exhibitionsView = {
    namespace: 'exhibitions',
    beforeEnter(data) {
    },
    afterEnter(data) {
    }
};

const exhibitionsTransition = {
    name: 'exhibitions-transition',
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
        gsap.to(canvas, {autoAlpha: 1, duration: .5});
        gsap.from(next.container, {autoAlpha: 0, duration: 1})
    },
    once({ current, next, trigger }) {
        const canvas = document.querySelector('.dom-gl');
        gsap.to(canvas, {autoAlpha: 1, duration: .5});
        gsap.from(next.container, {autoAlpha: 0, duration: 1})
    },
    to: {
        namespace: [
          'exhibitions'
        ]
    }
}

 export { exhibitionsView, exhibitionsTransition };