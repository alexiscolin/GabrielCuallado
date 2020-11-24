const requestInterval = function(fn, delay) {
    if( !window.requestAnimationFrame       && 
      !window.webkitRequestAnimationFrame && 
      !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
      !window.oRequestAnimationFrame      && 
      !window.msRequestAnimationFrame)
        return window.setInterval(fn, delay);
        
    var start = new Date().getTime(),
      handle = new Object();
      
    function loop() {
      var current = new Date().getTime(),
        delta = current - start;
        
      if(delta >= delay) {
        fn.call();
        start = new Date().getTime();
      }
  
      handle.value = requestAnimationFrame(loop);
    };
    
    handle.value = requestAnimationFrame(loop);
    return handle;
}
  
 const clearRequestInterval = function(handle) {
        window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
        window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
        window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
        window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
        window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
        window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
        clearInterval(handle);
  };

  export {clearRequestInterval, requestInterval}