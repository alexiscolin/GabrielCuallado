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
        console.log('hello serie')
    }

    destroy() {
        console.log('end serie')
    }

    doSomething() {
        console.log('Hello serie');
    }
}