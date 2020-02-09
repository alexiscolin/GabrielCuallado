import { gsap } from "gsap";

const collectorsView = {
    namespace: 'collectors',
    beforeEnter(data) {
        console.log('hello about barba');
    },
    afterEnter(data) {
        console.log('haha')
    }
};

const collectorsTransition = {
    name: 'collectors-transition',
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
          'collectors'
        ]
    }
}

 export { collectorsView, collectorsTransition };