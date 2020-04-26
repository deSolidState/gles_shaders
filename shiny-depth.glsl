// Creates shiny monochrome (R, G, or B) depthllike banding on a video
// hacked from David Carney - https://www.instagram.com/david_carney/ 
// He put a version of this on Shadertoy 2020-04-25 after talking with me
// webcam greyscale banding - https://www.shadertoy.com/view/3sffR7
// mashed with Transfer Function for Depth Map from Shadertoy
// https://www.shadertoy.com/view/llVBDD - by starea
// http://duruofei.com - https://github.com/ruofeidu/DuEngine
// http://blog.ruofeidu.com2018-11-19

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

//f0:: rgbSelect - picks color of banding
//f1:: 
//f2:: 
float f0 = mix(0.05, 0.95, fparams[0]);
float f1 = mix(0.05, 0.95, fparams[1]);
float f2 = mix(0.05, 0.95, fparams[2]);

float time = float(itime) + ftime;
float rgbSelect = f0;

float monochrome(vec3 col){
  return dot(col, vec3(0.2126, 0.7152, 0.0722));
}

vec3 transfer(float x) {
  float s = step(0.5, x);
  float y = 1.0 - 2.0 * x;
  vec3 banding;
	
	if (rgbSelect <= 0.33) {
	  banding = vec3((1.0 - s) * y, s * max(-0.98, y) + 1.0, (1.0 - s) * y);
	} else if (rgbSelect > 0.33 && rgbSelect < 0.67) {
	  banding = vec3(s * max(-0.98, y) + 1.0, (1.0 - s) * y, (1.0 - s) * y);
	} else {
	  banding = vec3((1.0 - s) * y, (1.0 - s) * y, s * max(-0.98, y) + 1.0);
	}
	
  return banding;
}

void main( void) {
  // Grab video position and color info
  vec2 uv = tcoord;
  vec4 color = texture2D(tex, uv);

  // convert texture to greyscale
  float grayFactor = (min(color.r, min(color.g, color.b)) + max(color.r, max(color.g, color.b))) * 0.5;

  // create banding using monochrome function, some recursion and a transfer function
  grayFactor = mod(grayFactor, 1.0/(max(abs(cos(time / 3.0)), abs(sin(time/3.))) * 10.)) * (max(abs(cos(time/3.)), abs(sin(time/3.))) *10.);
  float x = monochrome(texture2D(tex, uv).rgb);
  vec4 greyscale = vec4(transfer(grayFactor), 1.0);
  
  
  gl_FragColor = greyscale;
}         