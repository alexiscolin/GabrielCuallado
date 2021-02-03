import * as THREE from 'three';
import gl from './index';
import gsap from 'gsap';
import { Events } from '../events';
// import { calcWinsize } from '../utils';

export default class extends THREE.Object3D {  
  init(el) {
    this.el = [el].flat();
    this.dir = 0;
    this.elArray = [];

    this.resize();
  }

  setBounds(index = 0) {

    const boundCalc = (els) => {
      console.log('gl.scroll : ' + gl.scroll)
      console.log('this.dir : ' + this.dir )

      els.forEach(el => {
        const rect = el.getBoundingClientRect();
    
        const bounds = {
          left: rect.left - gl.scroll - this.dir, //gl.scroll (global scroll) & this.dir (img scroll)
          top: rect.top,
          width: rect.width,
          height: rect.height
        };

        this.elArray.push(bounds);
      });
    }

    if(this.elArray.length === 0) boundCalc(this.el);
    this.bounds = this.elArray[index]; 

    this.updateSize();
    this.updatePosition(0,this.bounds.left);
  }
  
  resize() {
    if (!this.visible) return;
    this.elArray = [];
    this.setBounds();
  }
  
  calculateUnitSize(distance = this.position.z) {
    const vFov = gl.camera.fov * Math.PI / 180;
    const height = 2 * Math.tan(vFov / 2) * distance;
    const width = height * gl.camera.aspect;

    return { width, height };
  }

  updateSize() {
    this.camUnit = this.calculateUnitSize(gl.camera.position.z - this.position.z);
    const x = this.bounds.width / gl.winSize.width;
    const y = this.bounds.height / gl.winSize.height;

    if (!x || !y) return;

    this.scale.x = this.camUnit.width * x;
    this.scale.y = this.camUnit.height * y;
  }
  
  updateY(y = 0) {
    const { top, height } = this.bounds;

    this.position.y = (this.camUnit.height / 2) - (this.scale.y / 2);
    this.position.y -= ((top - y) / gl.winSize.height) * this.camUnit.height;
  }  

  updateX(x = 0) {
    const { left } = this.bounds;

    this.position.x = -(this.camUnit.width / 2) + (this.scale.x / 2);
    this.position.x += ((left + x) / gl.winSize.width) * this.camUnit.width;
  }  
  
  updatePosition(dir, current) {
    this.updateY(0); //-> first placement
    this.dir = dir;
    this.updateX(this.dir + current);
  }

  destroy() {
        this.geometry.dispose();
        this.material.dispose();
        gl.scene.remove( this );
        
  }
}