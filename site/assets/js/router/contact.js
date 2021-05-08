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
        gsap.to('.js-contact-anim', {autoAlpha: 1, stagger: .1})

    },
    once({ current, next, trigger }) {
        const canvas = document.querySelector('.dom-gl');
        gsap.to(canvas, {autoAlpha: 1, duration: .5});
        gsap.from(next.container, {autoAlpha: 0, duration: 1})
        gsap.to('.js-contact-anim', {autoAlpha: 1, duration: 1.4, stagger: .12})
        gsap.to('.js-contact', {"--rotate-contact": "rotate(14deg)", duration: 1.2});
        gsap.to('.js-contact', {"--scale-contact": "scaleY(1)", duration: 1.2});


    },
    to: {
        namespace: [
          'contact'
        ]
    }
}

 export { contactView, contactTransition };