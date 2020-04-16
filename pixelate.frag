// simple pixelation of  source video
// Licensing: open-source and licensed under the (CC BY-NC-SA) license.
// For more info see https://github.com/deSolidState/gles_shaders

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
//f0:: steps 
//f1::
//f2::
float f0 = mix(0.05, 200., fparams[0]);
float f1 = mix(0.05, 0.95, fparams[1]);
float f2 = mix(0.05, 0.95, fparams[2]);

float time = float(itime) + ftime;
vec2 resolution = tres;

float steps = f0;

void main( void ) {
	
	
    vec2 uv = ceil(tcoord * vec2(steps)) / vec2(steps);
    gl_FragColor = texture2D(tex, uv);

}