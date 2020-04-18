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

//f0:: barmult - barrel distortion vector multiplier
//f1:: uvmult - uv resolution multiplier
//f2:: maxdistmult - maximum distortion multiplier
// float f0 = mix(0., 20.75, fparams[0]); // original
// float f1 = mix(0.5, 10.0, fparams[1]); // original
// float f2 = mix(0., 5., fparams[2]); // original

float f0 = mix(0., 10.5, fparams[0]); // 04.17.20 edit
float f1 = mix(0.5, 10.0, fparams[1]); // 04.17.20 edit
float f2 = mix(0., 0.75, fparams[2]); // 04.17.20 edit

float barmult = f0;
float uvmult = f1;
float maxdistmult = f2;

float time = float(itime) + ftime;
vec2 resolution = tres;

vec2 barrelDistortion(vec2 coord, float amt) {
  vec2 cc = coord - barmult;
  float dist = dot(cc, cc);
  return coord + cc * dist * amt;
}

float sat(float t) {
	return clamp(t, 0.0, 1.0);
}

float linterp(float t) {
	return sat( 1.0 - abs( 2.0*t - 1.0 ) );
}

float remap(float t, float a, float b) {
	return sat((t - a) / (b - a));
}

vec4 spectrum_offset(float t) {
	vec4 ret;
	float lo = step(t,0.5);
	float hi = 1.0-lo;
	float w = linterp( remap( t, 1.0/6.0, 5.0/6.0 ) );
	ret = vec4(lo,1.0,hi, 1.) * vec4(1.0-w, w, 1.0-w, 1.);

	return pow( ret, vec4(1.0/2.2) );
}

const float max_distort = 2.2;
// const int num_iter = 12; // original
const int num_iter = 2; // 04.17.20 edit
const float reci_num_iter_f = 1.0 / float(num_iter);

void main() {
	vec2 uv=(gl_FragCoord.xy / resolution.xy * uvmult) + .25; // parameter here

	vec4 sumcol = vec4(0.0);
	vec4 sumw = vec4(0.0);
	for ( int i=0; i<num_iter;++i) {
		float t = float(i) * reci_num_iter_f;
		vec4 w = spectrum_offset( t );
		sumw += w;
		sumcol += w * texture2D(tex, barrelDistortion(uv, maxdistmult * max_distort*t ) ); //parameter here
	}

	gl_FragColor = sumcol / sumw;
}