import { module } from 'modujs';

export default class extends module {
    constructor(m) {
        super(m);
    }

    init(){
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
    }
}