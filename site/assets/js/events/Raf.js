import gsap from 'gsap';
import Events from './Events';
import { lerp } from '../utils'

class Raf {
  constructor() {
    this.els = [];
    this.target = 0;
    this.current = 0;
    this.currentRounded = 0;
    this.ease = 1; // no ease here
    this.tickFunc = this.tick.bind(this);

    this.init();
  }

  tick() {
    //this.current = lerp(this.current, this.target, this.ease);
    this.current = this.target; 
    this.currentRounded = Math.round(this.current * 100) / 100;

    Events.emit('tick', {
      els: this.els,
      target: this.target,
      current: -this.currentRounded,
    });
  }

  onScroll(scroll) {
    this.els = scroll.els;
    this.target = scroll.x;
  }

  on() {
    gsap.ticker.add(this.tickFunc);
    Events.on('scroll', this.onScroll.bind(this));
    Events.on('stopRaf', this.off.bind(this));
  }

  off() {
    gsap.ticker.remove(this.tickFunc);
    Events.off('stopRaf');
    Events.off('tick');
  }

  init() {
    this.on();
  }
}

export default new Raf();
