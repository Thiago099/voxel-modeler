precision mediump float;


uniform vec4 color_overlay;
uniform float enable_color_overlay;
varying vec4 vColor;
varying highp vec3 vLighting;

void main(void) {
    if(enable_color_overlay == 1.0)
    {
        gl_FragColor = vec4(color_overlay.xyz * vLighting, color_overlay.w);;
    }
    else
    {
        gl_FragColor = vec4(vColor.xyz * vLighting, vColor.w);
    }
    
    
}