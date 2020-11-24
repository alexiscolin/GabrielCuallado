precision mediump float;
varying vec2 vUv;

uniform sampler2D uCurrTex;
uniform sampler2D uNextTex;
uniform float uFlash;
uniform float uClip;
uniform float uTime;
uniform float uSlide;
uniform vec4 resolution;

mat2 rotate(float a) {
	float s = sin(a);
	float c = cos(a);
	return mat2(c, -s, s, c);
}
const float PI = 3.1415;
const float angle1 = PI *0.25;
const float angle2 = -PI *0.75;
const float noiseSeed = 2.;
float random() { 
	return fract(sin(noiseSeed + dot(gl_FragCoord.xy / resolution.xy / 10.0, vec2(12.9898, 4.1414))) * 43758.5453);
}
float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
float hnoise(vec2 x) {
	vec2 i = floor(x);
	vec2 f = fract(x);
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main()	{
	vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
			
	float hn = hnoise(newUV.xy * resolution.xy / 100.0);
	vec2 d = vec2(0.,normalize(vec2(0.5,0.5) - newUV.xy).y);
	vec2 uv1 = newUV + d * uSlide / 5.0 * (1.0 + hn / 2.0);
	vec2 uv2 = newUV - d * (1.0 - uSlide) / 5.0 * (1.0 + hn / 2.0);


    // Clip effect with short smoothstep [.0,.005] -> no gradient
    float clip = smoothstep(.0,.005,(uClip - uv1.y));


    // Flash (alpha channel and mapping texture);
    float t1r = max(texture2D(uCurrTex, uv1).r, uFlash);
    float t1g = max(texture2D(uCurrTex, uv1).g, uFlash);
    float t1b = max(texture2D(uCurrTex, uv1).b, uFlash);
    vec4 t1 = vec4(t1r, t1g, t1b, clip);

    float t2r = max(texture2D(uNextTex, uv2).r, uFlash);
    float t2g = max(texture2D(uNextTex, uv2).g, uFlash);
    float t2b = max(texture2D(uNextTex, uv2).b, uFlash);
    vec4 t2 = vec4(t2r,t2g,t2b, clip);


	gl_FragColor = mix(t1, t2, uSlide);
}













