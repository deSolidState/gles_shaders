// Creates Fake floyd-steinberg dithering sort of
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
float f0 = mix(0., 1.5, fparams[0]);
float f1 = mix(0., 64., fparams[1]);
float f2 = mix(0., 1., fparams[2]);

float errcarry = f0;
int rez = int(floor(f1));
float colorize = f2;

float time = float(itime) + ftime;
vec2 resolution = tres;

float getGrayscale(vec2 coords){
	vec2 uv = coords;
	//uv.y = 1.0-uv.y;
	vec3 sourcePixel = texture2D(tex, uv).rgb;
	//return (sourcePixel.r+sourcePixel.g+sourcePixel.b)/3.0;
	return length(sourcePixel*vec3(0.2126,0.7152,0.0722));
}

void main()	{
	vec4	fragColor = vec4(0.0);
	vec2	fragCoord = gl_FragCoord.xy;
	vec4	inputPixelColor = texture2D(tex, tcoord);

	int	topGapY = int(tres.y - fragCoord.y);

	int cornerGapX = int((fragCoord.x < 10.0) ? fragCoord.x : tres.x - fragCoord.x);
	int cornerGapY = int((fragCoord.y < 10.0) ? fragCoord.y : tres.y - fragCoord.y);
	int cornerThreshold = ((cornerGapX == 0) || (topGapY == 0)) ? 5 : 4;

	if (cornerGapX+cornerGapY < cornerThreshold) {

		fragColor = vec4(0.0,0.0,0.0,1.0);

	} else if (topGapY < 20) {
			
			if (topGapY == 19) {
				
				fragColor = vec4(0.0,0.0,0.0,1.0);
				
			} else {
		
				fragColor = vec4(1.0,1.0,1.0,1.0);
				
			}
		
	} else {
		
		float xError = 0.0;
		for(int xLook=0; xLook<64; xLook++){
			if (xLook > rez)
				break;
			float grayscale = getGrayscale(tcoord.xy + vec2(-rez+xLook,0));
			grayscale += xError;
			float bit = grayscale >= 0.5 ? 1.0 : 0.0;
			xError = (grayscale - bit)*errcarry;
		}
		
		float yError = 0.0;
		for(int yLook=0; yLook<64; yLook++){
			if (yLook > rez)
				break;
			float grayscale = getGrayscale(tcoord.xy + vec2(0,-rez+yLook));
			grayscale += yError;
			float bit = grayscale >= 0.5 ? 1.0 : 0.0;
			yError = (grayscale - bit)*errcarry;
		}

		float finalGrayscale = getGrayscale(tcoord.xy);
		finalGrayscale += xError*0.5 + yError*0.5;
		float finalBit = finalGrayscale >= 0.5 ? 1.0 : 0.0;

		fragColor = vec4(finalBit,finalBit,finalBit,1.0);

	}
	
	inputPixelColor = inputPixelColor * fragColor;

	gl_FragColor = mix(fragColor,inputPixelColor,colorize);
}
        