import { module } from 'modujs';

export default class extends module {
    constructor(m) {
        super(m);

        // load typeform
        const elTF = document.querySelector('#typeform');
        const urlTF = elTF.dataset.url;
        typeformEmbed.makeWidget(elTF, urlTF, {
            hideHeaders: false,
            hideFooter: false
        })


        this.events = { 
            click: {
                button: 'doSomething'
            }
        }
    }

    init(){
        console.log('hello contact');
    }

    destroy() {
        console.log('end contact');
    }

    doSomething() {
        console.log('Hello contact');
    }
}