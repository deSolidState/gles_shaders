// Creates a rainbow glitchy - 3 types
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

// PARAMETERS 
// f0:: srcmod - srcpixel modifier
// f1:: texswitch - old & new texture switcher
// f2:: brightness
// f3:: moireness - works if f1 switched to 3+
float f0 = mix(0.005, 1.0, fparams[0]);
float f1 = mix(1., 3.5, fparams[1]);
float f2 = mix(0.05, 0.95, fparams[2]);
float f3 = mix(0.05, 6., fparams[3]);

float time = float(itime) + ftime;

float srcmod = f0;
int texswitch = int(floor(f1));
float brightness = f2;
float moireness = f3;

vec2 newcoords;
vec2 oldcoords;
vec4 srcPixel;

void main( void ) {
  vec2 uv = tres;
  
  if ( texswitch == 1 ) {
    oldcoords = uv;
    newcoords = tcoord;
  } else if ( texswitch == 2) {
    oldcoords = tcoord;
    newcoords = uv;
  } else if ( texswitch == 3 ) {
    oldcoords = sin(100000.1 / uv);
    newcoords = tan(0.1 / moireness * tcoord);
  }
    
  vec4	oldPixel = texture2D(tex, oldcoords);
  vec4	newPixel = texture2D(tex, newcoords);
  srcPixel = mod((( oldPixel + srcmod / newPixel ) + srcmod ), vec4(1.0));
  srcPixel *= 0.50  * brightness * 8.;

  // i'm only using the X, which is the last render time we reset
  gl_FragColor = vec4(srcPixel.rbg, 1.0);
}
