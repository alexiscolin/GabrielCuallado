import { gsap } from "gsap";

const publicationsView = {
    namespace: 'publications',
    beforeEnter(data) {
        console.log('hello awards barba');
    },
    afterEnter(data) {
        console.log('haha')
    }
};

const publicationsTransition = {
    name: 'publications-transition',
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
          'publications'
        ]
    }
}

 export { publicationsView, publicationsTransition };