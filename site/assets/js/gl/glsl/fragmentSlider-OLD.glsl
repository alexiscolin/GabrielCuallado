void main() {
    vec2 uv = vUv;
    vec2 dUv = vec2(uv.x, uv.y);

    vec4 disp = texture2D(uDisp, uv);
    vec2 texUv = backgroundCoverUv(uv, uMeshSize, uImageSize);

    float wipe = step(1.0 - uv.x, uSlide);
    //float scale = 0.7 + 0.3 * uSlide;

    vec4 currTex = texture2D(uCurrTex, texUv );
    vec4 nextTex = texture2D(uNextTex, texUv );
    
    // Flash (alpha channel and mapping texture);
    float r = max(texture2D(uCurrTex, dUv).r, uFlash);
    float g = max(texture2D(uCurrTex, dUv).g, uFlash);
    float b = max(texture2D(uCurrTex, dUv).b, uFlash);
    vec3 texture = vec3(r, g, b);

    // Clip effect with short smoothstep [.0,.005] -> no gradient
    float clip = smoothstep(.0,.005,(uClip - dUv.y));

    vec4 finalTex = mix(currTex, nextTex, uSlide);
    
    gl_FragColor = finalTex;
    //gl_FragColor = vec4(texture, clip);
}