import { module } from 'modujs';

export default class extends module {
    constructor(m) {
        super(m);

        this.events = {
            mouseover: {
                one: 'doSomething'
            }
        }
    }

    init() {
        console.log('hello home');
    }
    destroy() {
        console.log('end home')
    }

    doSomething() {
        console.log('DJDB');
    }
}