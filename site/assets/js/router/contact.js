import { gsap } from "gsap";

const contactView = {
    namespace: 'contact',
    beforeEnter(data) {
       
    },
    afterEnter(data) {
    }
};

const contactTransition = {
    name: 'contact-transition',
    leave({ current, next, trigger }) {
        return new Promise(resolve => {
            gsap.to(current.container, {autoAlpha: 0, duration: .6, onComplete: () => {
                resolve()
            }})
        })
    },
    enter({ current, next, trigger }) {
        gsap.from(next.container, {autoAlpha: 0, duration: 1});

       
    },
    once({ current, next, trigger }) {
        gsap.from(next.container, {autoAlpha: 0, duration: 1})
    },
    to: {
        namespace: [
          'contact'
        ]
    }
}

 export { contactView, contactTransition };