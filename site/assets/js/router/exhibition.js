import { gsap } from "gsap";

const exhibitionsView = {
    namespace: 'exhibitions',
    beforeEnter(data) {
        console.log('hello exhibitions barba');
    },
    afterEnter(data) {
        console.log('haha')
    }
};

const exhibitionsTransition = {
    name: 'exhibitions-transition',
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
          'exhibitions'
        ]
    }
}

 export { exhibitionsView, exhibitionsTransition };