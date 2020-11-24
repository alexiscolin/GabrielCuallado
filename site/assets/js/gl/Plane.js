import * as THREE from 'three';
import Gl from './index'
import GlObject from './GlObject'
import vertex from './glsl/vertex.glsl'
import fragment from './glsl/fragment.glsl'
import gsap from 'gsap';

const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);
const planeMaterial = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  transparent: true
});

const loader = new THREE.TextureLoader();

export default class extends GlObject {
    init(el, index) {

        const img = el.querySelector('.js-prlx-img');
        super.init(img);

        this.geometry = planeGeometry;
        this.material = planeMaterial.clone();
        
        this.material.uniforms = {
            uTexture: { value: 0 },
            uTime: { value: 0 },
            uProg: { value: 1 },
            uFlash: { value: 1 },
            uClip: { value: 0 },
            uMouse: { value : {x:0, y: 0}}
        } 

        this.img = img;
        this.texture = loader.load(this.img.src, (texture) => {
            texture.minFilter = THREE.LinearFilter;
            texture.generateMipmaps = false;
            this.material.uniforms.uTexture.value = texture;
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        const z = index % 3 === 0 ? -1.5 : index % 3 === 1 ? 0 : 1.5;
        this.mesh.position.z = z;

        this.add(this.mesh);
        
        Gl.scene.add(this);

        // this.interval = requestInterval(()=>{
        //     console.log('blabl');
        //     // this.texture = loader.load('https://res.cloudinary.com/dgzqhksfz/image/upload/w_1000,h_800,c_limit,q_60/v1593085602/CATA%CC%81LOGO_CUALLADO%CC%81_EXPO_CANAL-107_esnrag.jpg', (texture) => {
        //     //     texture.minFilter = THREE.LinearFilter;
        //     //     texture.generateMipmaps = false;
        //     //     this.material.uniforms.uTexture.value = texture;
        //     // })
        // }, 3000);

        // setTimeout(() => {
        //     clearRequestInterval(this.interval);
        // },20000)
    }

    updateTime(time) {
        this.material.uniforms.uTime.value = time;
    }

    isViewed() {
        // clip reveal effect
        gsap.to(this.material.uniforms.uClip, {
            duration: .5,
            value: 1,
            ease: 'Power2.inOut',
        });

        // flash effect
        gsap.to(this.material.uniforms.uFlash, {
            duration: 1,
            value: 0,
            delay: .2,
            ease: 'power.inOut',
        });

        // wave effect
        gsap.to(this.material.uniforms.uProg, {
            duration: 2,
            value: 0,
            delay: .4,
            ease: 'power.inOut',
        });
    }

    // addEvents() {
    //     this.mouseMove();
    //     this.mouseLeave();
    //   }
    
    //   mouseMove() {
    //     this.el.addEventListener('mousemove', e => {
    //     //   gsap.to(this.material.uniforms.uMouse, {
    //     //     // duration: 1,
    //     //     value: {x: e.clientX, y: e.clientX},
    //     //     ease: 'power.inOut',
    //     //   });
    //     });
    //   }
    
    //   mouseLeave() {
    //     this.el.addEventListener('mouseleave', () => {
    //       gsap.to(this.material.uniforms.uProg, {
    //         // duration: 1,
    //         value: 0,
    //         ease: 'power.inOut',
    //       });
    //     });
    //   }
}