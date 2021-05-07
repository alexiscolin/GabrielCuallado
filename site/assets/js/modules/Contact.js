import module from '../lib/module.js';
import { Events } from '../events';


export default class extends module {
    constructor(m) {
        super(m);
    }

    init(){
        // disapear cursor
        Events.emit('cursorDisapear');

        // load typeform
        let elTF = document.querySelectorAll('.typeform');
        elTF = elTF[elTF.length - 1]; // pour le reload de la meme page, 2 div cibles existent en meme temps
        const urlTF = elTF.dataset.url;

        typeformEmbed.makeWidget(elTF, urlTF, {
             hideHeaders: true,
             hideFooter: true
         })
    }

    destroy() {
        Events.emit('cursorAppear');
    }
}