import { gsap } from "gsap";


const aboutView = {
    namespace: 'about',
    beforeEnter(data) {
    },
    afterEnter(data) {
    }
};

// const cursorEnter = () => { Events.emit('cursorEnter')};
// const cursorLeave = () => { Events.emit('cursorLeave')};

const aboutTransition = {
    name: 'about-transition',
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
        gsap.from(next.container, {autoAlpha: 0, duration: 1});

        
        // this.links = [...document.querySelectorAll('a')]
        // this.links.forEach(el => {
        //     el.addEventListener('mouseenter', cursorEnter);
        //     el.addEventListener('mouseleave', cursorLeave);
        // });

        // console.log(this.links)
    },
    once({ current, next, trigger }) {
        const canvas = document.querySelector('.dom-gl');
        gsap.to(canvas, {autoAlpha: 1, duration: .5});
        gsap.from(next.container, {autoAlpha: 0, duration: 1})
    },
    to: {
        namespace: [
          'about'
        ]
    }
}

 export { aboutView, aboutTransition };