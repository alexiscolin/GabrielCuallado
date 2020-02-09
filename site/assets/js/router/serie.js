import { gsap } from "gsap";

const serieView = {
    namespace: 'serie',
    beforeEnter(data) {
        // console.log('hello serie barba');
    },
    afterEnter(data) {
        // console.log('haha')
    }
};

const serieTransition = {
    name: 'serie-transition',
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
    once({ current, next, trigger }) {
        gsap.from(next.container, {autoAlpha: 0, duration: 1})
    },
    to: {
        namespace: [
          'serie'
        ]
    }
}

 export { serieView, serieTransition };