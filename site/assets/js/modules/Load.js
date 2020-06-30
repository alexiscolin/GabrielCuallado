import { module } from 'modujs';
import gsap from 'gsap';
import barba from '@barba/core';


import { homepageView, homepageTransition } from '../router/homepage.js';
import { serieView, serieTransition } from '../router/serie.js';
import { aboutView, aboutTransition } from '../router/about.js';
import { exhibitionsView, exhibitionsTransition } from '../router/exhibition.js';
import { collectorsView, collectorsTransition } from '../router/collectors.js';
import { awardsView, awardsTransition } from '../router/awards.js';
import { publicationsView, publicationsTransition } from '../router/publications.js';
import { contactView, contactTransition } from '../router/contact.js';

export default class extends module {
    constructor(m) {
        super(m);
        
    }

    /**
     * MODULE INIT
     */
    init(){
        console.log('start loader');

        this.loadedViews = [
            serieView, 
            homepageView, 
            aboutView, 
            exhibitionsView, 
            collectorsView,
            awardsView,
            publicationsView,
            contactView
        ];

        this.loadedTransition = [
            serieTransition, 
            homepageTransition(_ => this.call('appear', '', 'Homepage' )), 
            aboutTransition, 
            exhibitionsTransition,
            collectorsTransition,
            awardsTransition,
            publicationsTransition,
            contactTransition
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
        this.loadedViews.forEach(loadedView => {
            /** Check if barba after function exist then yes save it */
            const viewAfterFunc = loadedView.afterEnter ? loadedView.afterEnter : null;
            
            /** init barba after function if exist then create Modularjs update func */
            loadedView.afterEnter = (data) => {
                viewAfterFunc && viewAfterFunc()

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