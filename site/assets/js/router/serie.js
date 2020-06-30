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
        
        gsap.to(canvas, {autoAlpha: 1, duration: .5});
        gsap.from(next.container, {autoAlpha: 0, duration: 1})
    },
    to: {
        namespace: [
          'serie'
        ]
    }
}

 export { serieView, serieTransition };