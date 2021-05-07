import module from '../lib/module.js';
import gsap from 'gsap';

export default class extends module {
    constructor(m) {
        super(m);

        this.events = {
            click: {
                openImg: 'openImg',
                leaveZoom: 'leaveZoom'
            }
        }
    }
    
    openImg(e) {

        //load ima in svg
        const img = new Image();
        img.src = e.currentTarget.dataset.src;
        img.addEventListener('load', e => {
            this.$('svg')[0].setAttribute("viewBox", `0 0 ${e.target.width} ${e.target.height}`)
        })
        this.photo.setAttribute("href", e.currentTarget.dataset.src);

        //load text in dfescription
        this.$('zoomName')[0].innerText = e.currentTarget.dataset.name;

        //reveal
        this.openImageTL.play(0);
    }

    leaveZoom() {
        this.closeImageTL.play(0)
    }

    init(){
        this.photo = this.$('zoom')[0]; // get zoomed img el

        this.openImageTL = gsap.timeline({paused: true});
        this.openImageTL.to('.js-photo-section', {autoAlpha: 1, duration: 1.5});
        this.openImageTL.to('.js-photo-feDisplacementMap', {attr: {'scale': 0}, duration: 2}, 1);
        this.openImageTL.to(this.$('svg')[0], {autoAlpha: 1, duration: 1}, 1);
        this.openImageTL.to(this.$('zoomName')[0], {autoAlpha: 1, duration: 1}, 1.2);
        this.openImageTL.to(this.$('leaveZoom')[0], {autoAlpha: 1, duration: .6}, 1.4);

        this.closeImageTL = gsap.timeline({paused: true});
        this.closeImageTL.to('.js-photo-feDisplacementMap', {attr: {'scale': 50}, duration: 1}, 0);
        this.closeImageTL.to(this.$('zoomName')[0], {autoAlpha: 0, duration: 1}, 0);
        this.closeImageTL.to(this.$('leaveZoom')[0], {autoAlpha: 0, duration: 1}, 0);
        this.closeImageTL.to(this.$('svg')[0], {autoAlpha: 0, duration: 1}, .4)
        this.closeImageTL.to('.js-photo-section', {autoAlpha: 0, duration: 1.5}, 1.2);

    }

    destroy() {
    }
}