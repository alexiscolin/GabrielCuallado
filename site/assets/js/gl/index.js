import * as THREE from 'three';
import gsap from 'gsap';
import { Events } from '../events';

export default new class {
  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.z = 50;

    this.renderer = new THREE.WebGLRenderer({
        alpha: true,
    });
    this.renderer.setPixelRatio(gsap.utils.clamp(1.5, 1, window.devicePixelRatio));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0.0);

    this.clock = new THREE.Clock();
    this.scroll = 0;
    
    this.init();
  }
  
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  
  run({ current, els }) {
    let elapsed = this.clock.getElapsedTime();
    this.scroll = current;

    for (let i = 0; i < this.scene.children.length; i++) {
      const plane = this.scene.children[i];
        plane.updatePosition(els.length > 0 ? els[i].dir : 0, current);
        plane.updateTime(elapsed);
    }

    this.render();
  }
  
  addEvents() {
    Events.on('tick', this.run.bind(this));
    Events.on('resize', this.resize.bind(this));  
}
  
  init() {
    this.addToDom();
    this.addEvents();
  }
  
    addToDom() {
        const canvas = this.renderer.domElement;
        canvas.classList.add('dom-gl');
        document.body.appendChild(canvas);
    }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.updateProjectionMatrix();

    for (let i = 0; i < this.scene.children.length; i++) {
      const plane = this.scene.children[i];
      plane.resize();
    }
  }  
}