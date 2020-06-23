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
        console.log('hello awards')
    }

    destroy() {
        console.log('end awards')
    }

    doSomething() {
        console.log('Hello awards');
    }
}