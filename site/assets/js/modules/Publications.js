import { module } from 'modujs';

export default class extends module {
    constructor(m) {
        super(m);


        this.events = {
            click: {
                button: 'doSomething'
            }
        }
    }

    init(){
        console.log('hello publications')
    }

    destroy() {
        console.log('end publications')
    }

    doSomething() {
        console.log('Hello publications');
    }
}