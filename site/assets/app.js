/** CSS */
import './scss/main.scss';

/** JS */
import modular from 'modujs';
import * as modules from './js/modules';



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
              'padding: 0 5px 16px',
              'background-color: #000000',
              'color: #FFFFFF',
            ].join(';');

            var darkBold = [
              'padding: 0 5px 16px',
              'background-color: #FFFFFF',
              'color: #000000',
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

              darkBold += ';';
              darkBold += [
                'padding: 20px 5px 16px 40px',
                'background-image: url(https://res.cloudinary.com/dgzqhksfz/image/upload/v1610811386/Mongramme-noir-wireframe-simple_vgjcut.gif)',
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

            var whiteBold = [
              'padding: 20px 5px 16px',
              'background-color: #000000',
              'color: #FFFFFF',
            ].join(';');
        
            var spacer = [
              'background-color: transparent',
            ].join(';');
        
            var msg = '\n %c DE JAUNE ET DE BLEU %c code | https://www.de-jaune-et-de-bleu.com %c \n\n\n';
            var msgBold = '\n\n %c BOLK %c design | https://www.bolk.studio %c \n';
        
            console.log(msgBold, darkBold, whiteBold, spacer);
            console.log(msg, dark, white, spacer);


        } else if (window.console) {
            console.log('Design by BOLK - https://www.bolk.studio');
            console.log('Code by DE JAUNE ET DE BLEU - https://www.de-jaune-et-de-bleu.com');

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
}())


