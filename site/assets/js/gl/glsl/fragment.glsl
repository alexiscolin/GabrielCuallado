precision mediump float;

varying vec2 vUv;
// varying float wave;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uFlash;
uniform float uClip;
uniform float uProg;
  
void main() {
    vec2 uv = vUv;
    vec2 dUv = vec2(uv.x, uv.y);
      
    // Flash (alpha channel and mapping texture);
    float r = max(texture2D(uTexture, dUv).r, uFlash);
    float g = max(texture2D(uTexture, dUv).g, uFlash);
    float b = max(texture2D(uTexture, dUv).b, uFlash);
    vec3 texture = vec3(r, g, b);  

    // Clip effect with short smoothstep [.0,.005] -> no gradient
    float clip = smoothstep(.0,.005,(uClip - dUv.y));
    
    gl_FragColor = vec4(texture, clip);
}