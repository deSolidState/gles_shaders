// Creates thin black outlines, boxes in open spaces, garish colors
// Original: Toon.fs by VIDVOX using the ISF format
// no licensing specified but they praise their contributions to open source
// https://editor.isf.video/shaders/5e7a80217c113618206deb41

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

//f0:: net - normal edge threshold
//f1:: qlvl - q level
//f2:: netmult - multiplier for net
//f3:: qscal - scalar for q
float f0 = mix(0., 0.01, fparams[0]);
float f1 = mix(1., 16., fparams[1]);
float f2 = mix(1., 10., fparams[2]);
float f3 = mix(0.5, 5., fparams[3]);

float time = float(itime) + ftime;
vec2 resolution = tres;

float netmult = f2;
float net = f0 * netmult;
float qscal = f3;
float qlvl = f1 * qscal;

vec3 getNormal(vec2 st){
	vec2 texcoord = clamp(st, 0.001, 0.999);
	return texture2D(tex,texcoord).rgb; //???????
}

void main(void){
	float dxtex = 1.0 / tres.x;
	float dytex = 1.0 / tres.y;

	vec2 st = vec2(tcoord.x,tcoord.y); //?????
	// access center pixel and 4 surrounded pixel
	vec3 center = getNormal(st).rgb;
	vec3 left = getNormal(st + vec2(dxtex, 0.0)).rgb;
	vec3 right = getNormal(st + vec2(-dxtex, 0.0)).rgb;
	vec3 up = getNormal(st + vec2(0.0, -dytex)).rgb;
	vec3 down = getNormal(st + vec2(0.0, dytex)).rgb;

	// discrete Laplace operator
	vec3 laplace = abs(-4.0*center + left + right + up + down);
	// if one rgb-component of convolution result is over threshold => edge
	vec4 line = texture2D(tex, st);
	if(laplace.r > net || laplace.g > net || laplace.b > net) {
		line = vec4(0.0, 0.0, 0.0, 1.0); // => color the pixel green
	} else {
		line = vec4(1.0, 1.0, 1.0, 1.0); // black
	}
	
	vec4 color = texture2D(tex, tcoord);

	// store previous alpha value
	float alpha = color.a;
	// quantize process: multiply by factor, round and divde by factor
	color = floor((qlvl * color)) / (qlvl * qscal);
	// set fragment/pixel color
	color.a = alpha;

	gl_FragColor = color * line;
	
}              