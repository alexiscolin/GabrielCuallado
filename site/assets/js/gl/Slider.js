import * as THREE from 'three';
import Gl from './index'
import GlObject from './GlObject'
import vertex from './glsl/vertex.glsl'
import fragment from './glsl/fragmentSlider.glsl'
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
        // DOM
        this.imgs = [...el.querySelectorAll('.js-prlx-img')]; // ajouter array -done
        this.slideCounter = 0;
        this.loaded = false;
        this.anim = {
            timer: 1.2
        }

        super.init(this.imgs); 

        // Geometry & materials
        this.geometry = planeGeometry;
        this.material = planeMaterial.clone();

        // uniforms
        this.material.uniforms = {
            uCurrTex: { value: 0 },
            uNextTex: { value: 0 },
            resolution: { 
                value: {
                    x : this.elArray[0].width,
                    y: this.elArray[0].height,
                    z: 1,
                    w: 1
                }
            },
            uTime: { value: 0 },
            uProg: { value: 1 },
            uSlide: { value: 0 },
            uFlash: { value: 1 },
            uClip: { value: 0 },
            uMouse: { value : {x:0, y: 0}}
        }


        // 3D scene
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(this.mesh);

        Gl.scene.add(this);
        
        // textures
        this.textures = [];
        this.loadTexture(index);

        // animation
        this.sliderAnim = gsap.timeline({paused: true, onComplete: () => {
            this.material.uniforms.uCurrTex.value = this.textures[this.slideCounter];
        }});
        this.sliderAnim.to(this.material.uniforms.uProg, {
            duration: this.anim.timer / 2,
            value: 1.5,
            ease: "power1.in"
        }, 0);
        this.sliderAnim.to(this.material.uniforms.uProg, {
            duration: this.anim.timer / 2,
            value: 0,
            ease: "power1.out"
        }, this.anim.timer / 2);
        this.sliderAnim.to(this.material.uniforms.uSlide, {
            duration: this.anim.timer,
            value: 1,
            ease: "power1.inOut"
        }, 0)
    }

    loadTexture(index = 0) {
        const manager = new THREE.LoadingManager(() => {
            // Set first texture as default
            this.material.uniforms.uCurrTex.value = this.textures[index];
        }); 

        const loader = new THREE.TextureLoader(manager);
        this.imgs.forEach((img, index) => {
            loader.load(img.src, texture => {
                texture.minFilter = THREE.LinearFilter;
                texture.generateMipmaps = false; 
        
                this.textures[index] = texture;
            })
        });
        
        // this.texture = loader.load(this.img.src, (texture) => {
        //     texture.minFilter = THREE.LinearFilter;
        //     texture.generateMipmaps = false;
        //     this.material.uniforms.uTexture.value = texture; // sortir du load ?
        // })
    }

    updateTime(time) {
        this.material.uniforms.uTime.value = time;
    }

    updateSize() {
        this.camUnit = super.calculateUnitSize(Gl.camera.position.z - this.position.z);
        const x = this.bounds.width / Gl.winSize.width;
        const y = this.bounds.height / Gl.winSize.height;
    
        if (!x || !y) return;
    
        if(this.loaded) {
            gsap.to(this.scale, {"x": this.camUnit.width * x, duration: this.anim.timer, ease: "power2.inOut"});
            gsap.to(this.scale, {"y": this.camUnit.height * y, duration: this.anim.timer, ease: "power2.inOut"});    
        } else {
            this.scale.x = this.camUnit.width * x;
            this.scale.y = this.camUnit.height * y;
        }
    }
      
    updateY(y = 0) {
        if(!this.loaded) {
            super.updateY()
        }
    }  
    
    updateX(x = 0) {
        if(!this.loaded) {
            super.updateX()
        }
    }  
      
    removetexture(index) {
        this.textures.splice(index, 1);
    }

    slide(dir) {
        return new Promise (resolve => {
        // if(dir) {
            this.slideCounter = dir;
            // } else {
            //     this.slideCounter = this.imgs.length - 1 === this.slideCounter ? 0 : this.slideCounter +  1;
            // }

            this.material.uniforms.uNextTex.value = this.textures[this.slideCounter];
            super.setBounds(this.slideCounter);
            this.sliderAnim.play(0).then(() => resolve());
        })
       
    }

    isViewed(speed = 2) {
        return new Promise(resolve => {
            this.loaded = true;

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
                duration: speed,
                value: 0,
                delay: .4,
                ease: 'power.inOut',
            }).then(_=> {
                resolve();
            })
            // gsap.to(this.material.uniforms.uSlide, {
            //     duration: 2,
            //     value: 0,
            //     delay: .4,
            //     ease: 'power.inOut',
            // });
        });
        
    }
}