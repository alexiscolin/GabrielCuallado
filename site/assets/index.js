/** CSS */
import './scss/main.scss';

/** JS */
import modular from 'modujs';
import * as modules from './js/modules';
// import Router from './js/router/index';



/** CONSTANTS */
const website = website || {};

/**
 * DJDB LOG SALUTATION 
 * @param {object} publics
 */
(function djdbLog (publics) {
    var userAgent = navigator.userAgent.toLowerCase();
    var supported = /(chrome|firefox)/;

    publics.init = function () {
        if (supported.test(userAgent.toLowerCase())) {
            var dark = [
              'padding: 20px 5px 16px',
              'background-color: #000000',
              'color: #FFFFFF',
            ].join(';');
        
            if (userAgent.indexOf('chrome') > -1) {
              dark += ';';
              dark += [
                'padding: 20px 5px 16px 40px',
                'background-image: url(https://files.de-jaune-et-de-bleu.com/img/signature/djdb-logo-wave.png)',
                'background-position: 10px 9px',
                'background-repeat: no-repeat',
                'background-size: 26px 30px',
              ].join(';');
            }
        
            var white = [
              'padding: 20px 5px 16px',
              'background-color: #FFFFFF',
              'color: #000000',
            ].join(';');
        
            var spacer = [
              'background-color: transparent',
            ].join(';');
        
            var msg = '\n\n %c DE JAUNE ET DE BLEU %c https://www.jaunebleu.co %c \n\n\n';
        
            console.log(msg, dark, white, spacer);
        } else if (window.console) {
            console.log('Crafted by DE JAUNE ET DE BLEU - https://www.jaunebleu.co');
        }      
    }
  
  }(website));


/**
 * COMMON INIT FUNCTION
 */
(function(){
  const app = new modular({
      modules: modules
  });
  app.init(app);

    website.init()
    // const routerInstance = new Router(app);
}())


