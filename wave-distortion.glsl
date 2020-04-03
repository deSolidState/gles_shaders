// Creates a distorted waveform effect - from smooth to edgy
// Original: Sine Distortion by INKA (isakburstrom) using the ISF format
// no licensing specified but they praise their contributions to open source
// https://editor.isf.video/shaders/5e7a7ffe7c113618206de87c

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 tcoord;    // location
uniform sampler2D tex;  // texture one
uniform sampler2D tex2; // texture two
uniform vec2 tres;      // size of texture (screen)
uniform vec4 fparams;   // 4 floats coming in
uniform ivec4 iparams;  // 4 ints coming in
uniform float ftime;    // 0.0 to 1.0
uniform int itime;      // increases when ftime hits 1.0

#define PI 3.141592654

//f0:: period - period of the waveform
//f1:: distortion - level of distortion
//f2:: frequency - frequency of the waveform
//f3:: hpert factor - 
float f0 = mix(0., 1000000., fparams[0]);
float f1 = mix(0., 5., fparams[1]);
float f2 = mix(0., 0.5, fparams[2]);
float f3 = mix(0.05, 0.9, fparams[3]);

float time = float(itime) + ftime;
vec2 resolution = tres;

float period = f0;
float distortion = f1;
float frequency = f2;
float hpertfact = f3;

vec2 pb( vec2 uv, float percent) {
    uv.y += (period * PI) / percent;
    vec2 result = (cos(uv.y * percent)) * normalize(vec2(1., cos((uv.y) * percent)));
    return result;
}

void main(void) {
    
    vec2 uv = (tcoord);
	
    vec2 hpert = pb(uv, frequency * 100.0);
    uv += hpert * distortion * hpertfact;
    
    vec4 col = texture2D(tex, uv);
    gl_FragColor = col;

}
        