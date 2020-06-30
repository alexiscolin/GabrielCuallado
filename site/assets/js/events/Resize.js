import Events from './Events';
import { throttle } from '../utils';

class Resize {
  constructor() {
    this.init();
  }

  onResize() {
    Events.emit('resize');
  }

  on() {
    window.addEventListener('resize', throttle(this.onResize, 50));
  }

  init() {
    this.on();
  }
}

export default new Resize();
