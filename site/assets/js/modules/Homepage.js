import module from '../lib/module.js';
import VirtualScroll from 'virtual-scroll';
import charming from 'charming'
import gsap from 'gsap';
import Gl from "../gl";
import Slider from '../gl/Slider';
import { preloadImages } from '../utils';
import { Events } from '../events';
import {requestInterval, clearRequestInterval} from '../utils';


export default class extends module {
    constructor(m) {
        super(m);

        this.glObject = null;
        this.slider = null;
        this.event = {};
        this.slideIsRunning = true;
    } 

    init() {
        Gl.scroll = 0;
        Events.emit('scroll', {els: [], x: 0});

        this.DOM = {}; 
        this.scrollDelta = 0;
        this.sliderDelay = 1.2;
        this.isStarted = false;
        this.isAppear = false;
        this.isAppearOnce = false;

        // if (window.matchMedia("(min-width: 640px)").matches) {
            preloadImages().then(() => {

                this.setSeries();
                this.setInfos();
                this.setLinks();
                this.setLoader();
                this.bindEvent();

                const homeImg = this.el.querySelector('[data-slider="img"]');
                const prevImg = this.el.querySelector('[data-prev="img"]');
                const nextImg = this.el.querySelector('[data-next="img"]');

                this.glObject = new Slider(); 
                this.glObject.init(homeImg, 0);

                this.prevObject = new Slider(); 
                this.prevObject.init(prevImg, 5);

                this.nextObject = new Slider(); 
                this.nextObject.init(nextImg, 1);

            }); 

        // }
    }

    setLoader () {
        this.DOM.subtitle = document.querySelector('#js-loader-subtitle');
        this.DOM.date = document.querySelector('#js-loader-date');
        this.DOM.gabriel = document.querySelector("#js-loader-title-out");
        this.DOM.loading = document.querySelector("#js-main-container");
        this.DOM.content = document.querySelector("#js-loader-content");
        this.DOM.circle = document.querySelector("#js-loader-circle");

        charming(this.DOM.subtitle, {
            setClassName: function (index, letter) {
                return `char letter-${letter}`
              }
        });

        this.DOM.subtitleChar = [...this.DOM.subtitle.querySelectorAll('.char')];
    }

    setLinks() {
        this.DOM.zone = document.querySelector('.js-zone');
    }

    setSeries() {
        this.DOM.titles = [...document.querySelectorAll('.js-main-series')];
        this.DOM.container = document.querySelector('.js-main-series-cont');

        this.seriesTitles = [];
        this.DOM.container.style.transform = `translate3D(0, 0, 0)`; // reset
        
        this.DOM.titles.forEach((el, i) => {
            const elInfos = el.getBoundingClientRect();


            if (i === 0) {
                if (window.matchMedia("(min-width: 640px)").matches) {
                    this.DOM.container.style.marginLeft = (window.innerWidth / 2) - (elInfos.width/2) + 'px';
                } else {
                    this.DOM.container.style.marginTop = (window.innerHeight / 2) - (elInfos.height/2) + 'px';
                }
            }

            // only if real data (not infinite concern)
                this.seriesTitles.push({
                    id: el.dataset.id,
                    x: (elInfos.left - (window.innerWidth /2) + (elInfos.width/2)).toFixed(2),
                    y: (elInfos.top - (window.innerHeight /2) + (elInfos.height/2)).toFixed(2),
                    content: el.dataset.content,
                    current: false,
                })    
        })

        this.current = this.current || 2;
        this.seriesTitles[this.current].current = true;
        if (window.matchMedia("(min-width: 640px)").matches) {
            this.DOM.container.style.transform = `translate3D(-${this.seriesTitles[2].x}px, 0, 0)`;
        } else {
            this.DOM.container.style.transform = `translate3D(0, -${this.seriesTitles[2].y}px, 0)`;
        }
    }

    setInfos () {
        this.DOM.info = [...document.querySelectorAll('.js-main-info')];
        this.DOM.desc = [...document.querySelectorAll('.js-main-desc')];
        this.DOM.link = document.querySelector('.js-main-link-displayed');
        this.DOM.linkBar = this.DOM.link.querySelector('.js-link-bar');
        
        // charming
        this.DOM.desc.forEach(desc => {
            charming(desc, {
                setClassName: function (index, letter) {
                  return `char letter-${letter}`
                }
            });
        });

        this.infos = this.DOM.info.map(el => {
            return {
                id: el.dataset.id,
                url: el.querySelector('.js-main-link').getAttribute('href'),
                cover: el.querySelector('.js-main-cover').getAttribute('src'),
                desc: el.querySelector('.js-main-desc'),
                descChars: [...el.querySelectorAll('.js-main-desc > .char')]
            }
        })
    }

    bindEvent() {
        this.event.resize = this.resize.bind(this);
        this.event.scroll = this.scroll.bind(this);
        this.event.zone = e => {
            if(e.target.classList.contains("js-zone-link")) {
                const dir = e.target.dataset.dir === "prev" ? 1 : -1;
                this.slide(dir)
            }
        }

        // resize
        window.addEventListener('resize', this.event.resize, false);

        // click on zone to change dir
        this.DOM.zone.addEventListener('click', this.event.zone, false);

       // scroll
        this.event.scroller = new VirtualScroll();
        this.event.scroller.on(this.event.scroll);
    }


    scroll(e) {
        if(this.isStarted) {
            //avoid momentum on wheel event
            const action = e.originalEvent.constructor.name === 'WheelEvent' ? Math.abs(e.deltaY) > this.scrollDelta : true;
            if(!this.slideIsRunning && action){
                this.slide(e.deltaY);
            }
 
            this.scrollDelta = Math.abs(e.deltaY)
        } else if(this.isAppear && !this.isAppearOnce) {
            this.isAppearOnce = true;

            this.glObject.slide(1).then(()=> this.glObject.removetexture(0));

            // intro disparition 
            gsap.to(this.DOM.gabriel, {autoAlpha: 0, duration: this.sliderDelay})
            gsap.to(this.DOM.date, {autoAlpha: 0, duration: this.sliderDelay})
            gsap.to(this.DOM.subtitleChar, {autoAlpha: 0, stagger: .04} ).then(_=> gsap.set(this.DOM.loading, {autoAlpha: 0}))
            gsap.to(this.DOM.content,{autoAlpha: 0, duration: this.sliderDelay /1.5})
            gsap.to(this.DOM.circle,{strokeDashoffset: 500, duration: this.sliderDelay/ 1.5})

            // slider apparition 
            gsap.to(this.DOM.link, {autoAlpha: 1, duration: this.sliderDelay, delay: (this.sliderDelay),})
            gsap.to(this.DOM.container, {autoAlpha: 1, duration: this.sliderDelay * 2, delay: (this.sliderDelay /2)})
            gsap.to(this.infos[0].descChars, {autoAlpha: 1, duration: (this.sliderDelay - .1), delay: (this.sliderDelay/2), stagger: {amount: (this.sliderDelay/2 - .1), from: "random"}})
            gsap.set(this.DOM.linkBar, {transformOrigin: '0 100%'})
            gsap.to(this.DOM.linkBar, {scaleX: 1, duration: this.sliderDelay/2, delay: this.sliderDelay/2 });
    
            this.nextObject.isViewed(1);
            this.prevObject.isViewed(1).then(()=> {
                this.isStarted = true;
            })
        }
    }


    slide(delta) {
        this.slideIsRunning = true;
        const dir = delta > 0;
        let index = this.seriesTitles.findIndex(title => title.current === true);
        
        this.seriesTitles[index].current = false;
        const to = this.seriesTitles[dir ? index-1 : index+1];
        
        // match series and datas (from)
        const dataFrom = this.infos[this.infos.findIndex(info => info.id === this.seriesTitles[index].id)];

        if(to.content !== "true") {
            const id = to.id.split('_').splice(1)[0];
            index = this.seriesTitles.findIndex(title => title.id === id);
        }

        // match series and datas (to)
        let toId = this.infos.findIndex(info => info.id === to.id);
        toId = toId >= 0 ? toId : this.infos.findIndex(info => info.id  === this.seriesTitles[index].id);
        const dataTo = this.infos[toId];

        const desk = window.matchMedia("(min-width: 640px)").matches;

        // slide description
        gsap.to(dataFrom.descChars, {autoAlpha: 0,duration: (this.sliderDelay/2 - .1), stagger: {amount: (this.sliderDelay/2 - .1), from: "random"}})
        gsap.to(dataTo.descChars, {autoAlpha: 1, duration: (this.sliderDelay/2 - .1), delay: (this.sliderDelay/2 - .1), stagger: {amount: (this.sliderDelay/2 - .1), from: "random"}})

        // slide url
        this.DOM.link.setAttribute('href', dataTo.url);
        const setStart = dir ? '100% 50%' : '0% 50%';
        const setEnd = dir ? '0% 50%' : '100% 50%';
        gsap.set(this.DOM.linkBar, {transformOrigin: setStart})
        gsap.to(this.DOM.linkBar, {scaleX: 0, duration: this.sliderDelay/2})
        gsap.set(this.DOM.linkBar, {transformOrigin: setEnd, delay: this.sliderDelay/2})
        gsap.to(this.DOM.linkBar, {scaleX: 1, duration: this.sliderDelay/2, delay: this.sliderDelay/2})

        // Slide series titles
        const resAttr = desk ? 'x' : 'y';
        gsap.to(this.DOM.container, {[resAttr]: -to[resAttr], duration: this.sliderDelay, ease: "power2.out"}).then(() => {
            if(to.content !== "true") {
                    this.seriesTitles[index].current = true;
                    gsap.set(this.DOM.container, {[resAttr]: -this.seriesTitles[index][resAttr]});
                
            } else {
                to.current = true;
            }
            this.slideIsRunning = false;
        });

        // slide main img
        const prevIndex = toId - 1 <= 0 ? this.infos.length - 1 : toId - 1;
        const nextIndex = toId + 1 >= this.infos.length ? 0 : toId + 1;

        this.prevObject.slide(prevIndex);
        this.glObject.slide(toId);
        this.nextObject.slide(nextIndex);
    }

    appear() {
        
        if(!this.glObject) return;
        const mainSlider = this.glObject.isViewed();
        mainSlider.then(()=>{
            this.isAppear = true;
            this.slideIsRunning = false;          
        })
    }

    resize () {
        this.setSeries()
    }

    destroy() {
        if(this.slider) clearRequestInterval(this.slider);
        if(!this.glObject) return;
        Gl.scroll = 0;
        this.glObject.destroy();
        this.prevObject.destroy();
        this.nextObject.destroy();

        this.event.scroller.destroy()
        this.DOM.zone.removeEventListener('click', this.event.zone, false);
        window.removeEventListener('resize', this.event.resize)
    }
}