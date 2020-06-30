precision mediump float;
varying vec2 vUv;
uniform float uTime;
uniform float uProg;
uniform float uIndex;

#pragma glslify: noise = require(glsl-noise/simplex/3d) 

void main() {
    vec3 pos = position;
 
    pos.z += noise(vec3(pos.x * 4. + uTime, pos.y, 0.)) * uProg;
    pos.z *= 1.5; 

    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}