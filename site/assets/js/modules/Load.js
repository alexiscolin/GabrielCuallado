import { module } from 'modujs';
import barba from '@barba/core';
import { Events } from '../events';


import { homepageView, homepageTransition } from '../router/homepage.js';
import { serieView, serieTransition } from '../router/serie.js';
import { aboutView, aboutTransition } from '../router/about.js';
import { exhibitionsView, exhibitionsTransition } from '../router/exhibition.js';
import { collectorsView, collectorsTransition } from '../router/collectors.js';
import { awardsView, awardsTransition } from '../router/awards.js';
import { publicationsView, publicationsTransition } from '../router/publications.js';
import { pressView, pressTransition } from '../router/press.js';
import { contactView, contactTransition } from '../router/contact.js';
import { errorView, errorTransition } from '../router/error.js';
export default class extends module {
    constructor(m) {
        super(m);
    }

    /**
     * MODULE INIT
     */
    init(){
        this.links = [];

        this.loadedViews = [
            serieView, 
            homepageView, 
            aboutView, 
            exhibitionsView, 
            collectorsView,
            awardsView,
            publicationsView,
            pressView,
            contactView,
            errorView
        ];

        this.loadedTransition = [
            serieTransition, 
            homepageTransition(_ => this.call('appear', '', 'Homepage' )), //Link modus module method for enterAnimation
            aboutTransition, 
            exhibitionsTransition,
            collectorsTransition,
            awardsTransition,
            publicationsTransition,
            pressTransition,
            contactTransition,
            errorTransition
        ]
        this.views = [];
        this.transitions = [];

        this._updateModules()
        this._createModules('views', this.loadedViews);
        this._createModules('transitions', this.loadedTransition);


        barba.init({
            views: this.views,
            transitions: this.transitions
        });
    }

    /**
     * BARBA MODULE CREATION 
     * @param {string} type ['views'|'transitions']
     * @param {array} modules
     */
    _createModules (type, modules = []) {
        modules.forEach(module => this[type].push(module));
    }

    /**
     * INIT MODULES UPDATE (MODUJS across BARBAJS)
     */
    _updateModules () {
        const cursorEnter = e => { 
            Events.emit('cursorEnter', {target: e.target})
        };
        const cursorLeave = () => { Events.emit('cursorLeave')};

        this.loadedViews.forEach(loadedView => {
            /** Check if barba after/before function exist then yes save it */
            const viewAfterFunc = loadedView.afterEnter ? loadedView.afterEnter : null;
            const viewBeforeFunc = loadedView.beforeLeave ? loadedView.beforeLeave : null;

            loadedView.beforeLeave = (data) => {
                // GENERAL ACTION : cursor links - remove
                this.links.forEach(el => {
                    el.removeEventListener('mouseenter', cursorEnter);
                    el.removeEventListener('mouseleave', cursorLeave);
                });
                this.links = [];
            };

            /** init barba after function if exist then create Modularjs update func */
            loadedView.afterEnter = (data) => {
                viewAfterFunc && viewAfterFunc();

                // Global Emit
                Events.emit('pageLoad');

                // GENERAL ACTION : cursor links - add
                this.linksFaked = [...data.next.container.querySelectorAll('.a')]
                this.links = [...data.next.container.querySelectorAll('a')].concat(this.linksFaked)
                this.links.forEach(el => {
                    el.addEventListener('mouseenter', cursorEnter); 
                    el.addEventListener('mouseleave', cursorLeave);
                });

                // get Lang
                const doc = new DOMParser().parseFromString(data.next.html, "text/html");
                const lang = doc.documentElement.lang;

                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                'event': 'Pageview',
                'pagePath': data.next.url.path,
                'pageTitle': document.title,
                'pagelang': lang,
                });

                /** if not first load -> modularjs already init in general index.js */
                if (data.current.container) {
                    this.call('destroy', data.current.container, 'app');
                    this.call('update', data.next.container, 'app');    
                }
            }
        })
    }

    /**
     * DESTROY BARBAJS
     */
    destroy() {
        barba.destroy()
    }
}