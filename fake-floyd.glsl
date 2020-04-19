// adds a grainy texture similar around edges & in open spaces
// similar to dithering and over-sharpening blockiness
// Hacked from: Dither floyd-steinberg-ish by DavidLublin - VIDVOX Developer
// using ISF format https://editor.isf.video/shaders/5e7a7ff07c113618206de757
// who hacked it from: Classic Mac floyd-steinberg-ish by Raven
// from Shadertoy https://www.shadertoy.com/view/4sjGRD#
// MIT License

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

//f0:: errcarry - error carry
//f1:: rez - quality of resolution
//f2:: colorize - ranges from b&w to full color 
float f0 = mix(0., 2.5, fparams[0]);
float f1 = mix(0., 8.1, fparams[1]);
float f2 = mix(0., 1., fparams[2]);

float time = float(itime) + ftime;

float errcarry = f0;
int rez = int(floor(f1));
float colorize = f2;

vec2 resolution = tres;

float getGrayscale(vec2 coords){
	vec2 uv = coords;
	// uv.y = 1. - uv.y;
	// uv.x = 1.0-uv.x;
	vec3 sourcePixel = texture2D(tex, uv).rgb;
	return length(sourcePixel*vec3(0.2126, 0.7152, 0.0722));
}

void main()	{
	vec4	fragColor = vec4(0.0);
	vec2	fragCoord = gl_FragCoord.xy;
	vec4	inputPixelColor = texture2D(tex, tcoord);


		float xError = 0.0;

		for(int xLook=0; xLook<8; xLook++){
			if (xLook > rez) {
				break;
			}
			float grayscale = getGrayscale(tcoord.xy + vec2(-rez + xLook, 0));
			grayscale += xError;
			float bit = grayscale >= 0.5 ? 1.0 : 0.0;
			xError = (grayscale - bit) * errcarry;
		}
		
		float yError = 0.0;

		for(int yLook=0; yLook<8; yLook++){
			if (yLook > rez)
				break;
			float grayscale = getGrayscale(tcoord.xy + vec2(0, -rez + yLook));
			grayscale += yError;
			float bit = grayscale >= 0.5 ? 1.0 : 0.0;
			yError = (grayscale - bit) * errcarry;
		}

		float finalGrayscale = getGrayscale(tcoord.xy);
		finalGrayscale += xError * 0.5 + yError * 0.5;
		float finalBit = finalGrayscale >= 0.5 ? 1.0 : 0.0;

		fragColor = vec4(finalBit, finalBit, finalBit, 1.0);

	// inputPixelColor = inputPixelColor * fragColor * vec4(tcoord, tcoord);

	inputPixelColor = inputPixelColor * fragColor;

	gl_FragColor = mix( fragColor, inputPixelColor, colorize );
}