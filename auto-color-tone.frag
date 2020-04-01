// Creates variations on a base color
// original by VIDVOX using the ISF format: 
// no licensing specified but they praise their contributions to open source
// https://editor.isf.video/shaders/5e7a7fe17c113618206de634

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

//f0:: numcolors - number of colors in tone
//f1:: colormode - color mode displyed
//f2:: slider for inputcolor variant 
float f0 = floor(mix(1., 10., fparams[0]));
float f1 = floor(mix(0., 6.0, fparams[1]));
float f2 = mix(0.05, 5.95, fparams[2]);

vec4 basecolor = vec4( 0.25, 0.59, 0.9, 1.0 );
float numcolors = f0;


vec3 rgb2hsv(vec3 c)	{
	vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
	//vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
	//vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
	vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
	vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
	
	float d = q.x - min(q.w, q.y);
	float e = 1.0e-10;
	return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)	{
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float gray(vec4 c)	{
	return (c.r + c.g + c.b) * c.a / 3.0;	
}

void main( void ) {
			// variant
			// vec4 inputcolor = texture2D(tex, cos(sin(f2) / tcoord));

			vec4 inputcolor = texture2D(tex, tcoord);
			vec4 inColor = basecolor;
			float index = floor(gray(inputcolor) * numcolors);	
			// float index = floor(isf_FragNormCoord.x * float(numcolors));
			float variation = 0.3236;	// 1/5 the golden ratio
			float colorMode = f1;

			inColor = basecolor;
			inColor.rgb = rgb2hsv(inColor.rgb);
		
			vec4 outColor = inColor;

			// Basic complimentary '96'a0saturation and brightness variations
			// on two fixed 180 degree opposite hues
			if (colorMode == 0.)	{
				if (mod(index, 2.0) >= 1.0)	{
					outColor.r = outColor.r + 0.5;
					outColor.r = outColor.r - floor(outColor.r);
				}
			
				outColor.g = outColor.g - variation * floor(index / 2.0);
			
				if (outColor.g < 0.1)	{
					outColor.g = outColor.g + variation * floor(index / 2.0);
					outColor.g = outColor.g - floor(outColor.g);
				}
			
				outColor.b = outColor.b - variation * floor(index / 4.0);
				if (outColor.b < 0.2)	{
					outColor.b = outColor.b + variation * floor(index / 4.0);
					outColor.b = outColor.b - floor(outColor.b);
				}
			}
			// Split complimentary '96'a0saturation and brightness variations
			// on a 3 fixed 120 degree hues
			else if (colorMode == 1.)	{
				float divisor = 3.0;
				float ratio = 0.45;
				if (mod(index, 3.0) >= 2.0)	{
					outColor.r = outColor.r - ratio;
				}
				else if (mod(index, 3.0) >= 1.0)	{
					outColor.r = outColor.r + ratio;
				}
			
				// outColor.g = outColor.g + variation * floor(index / divisor);
			
				if (mod(index, 5.0) >= 3.0)	{
					outColor.g = outColor.g - variation;
					outColor.g = outColor.g - floor(outColor.g);
				}
				outColor.b = outColor.b - variation * floor(index / (divisor));
				if (outColor.b < 0.1)	{
					outColor.b = outColor.b + variation * floor(index / (divisor));
					outColor.b = outColor.b - floor(outColor.b);
				}
			}
			// Compound complimentary '96'a0a combination of shades, complimentary
			// and analogous colors with slight shifts
			else if (colorMode == 2.)	{
				if (mod(index, 3.0) >= 2.0)	{
					outColor.r = outColor.r + 0.5;
					outColor.r = outColor.r + variation * index * 1.0 / float(numcolors - 1.) / 4.0;
				}
				else	{
					outColor.r = outColor.r + variation * index * 1.0 / float(numcolors - 1.);
				}
				outColor.r = outColor.r - floor(outColor.r);
			
			
				if (mod(index, 2.0) >= 1.0)	{
					outColor.g = outColor.g + index * variation / 2.0;
				}
				else if (mod(index, 3.0) >= 2.0)	{
					outColor.g = outColor.g - variation / 2.0;
				}
				else	{
					outColor.g = outColor.g - index * variation / float(numcolors - 1.);
				}
				if (outColor.g > 1.0)	{
					outColor.g = outColor.g - floor(outColor.g);
				}
			}
			// Spectrum '96'a0hue shifts based on number of colors
			// with minor saturation shifts
			else if (colorMode == 3.)	{
				outColor.r = outColor.r + index * 1.0 / float(numcolors);
				if (mod(index, 3.0) >= 2.0)	{
					outColor.g = outColor.g - variation / 2.0;
					outColor.g = outColor.g - floor(outColor.g);
				}
				else if (mod(index, 4.0) >= 3.0)	{
					outColor.g = outColor.g + variation / 2.0;
					//outColor.g = outColor.g - floor(outColor.g);
				}
			}
			// Shades '96'a0saturation and brightness variations on a single fixed hue
			else if (colorMode == 4.)	{
				if (mod(index, 2.0) >= 1.0)	{
					outColor.b = outColor.b - (index * variation) / float(numcolors-1.);
				}
				else	{
					outColor.b = outColor.b + (index * variation) / float(numcolors-1.);
					outColor.b = outColor.b - floor(outColor.b);
				}
				if (outColor.b < 0.075)	{
					outColor.b = 1.0 - outColor.b * variation;
				}
			
				if (mod(index, 3.0) >= 2.0)	{
					outColor.g = outColor.g - (index * variation) / 2.0;
				}
				else if (mod(index, 4.0) >= 3.0)	{
					outColor.g = outColor.g + (index * variation) / 2.0;
				}
			
				if ((outColor.g > 1.0) || (outColor.g < 0.05))	{
					outColor.g = outColor.g - floor(outColor.g);
				}
			}
			// Analogous '96'a0small hue and saturation shifts 
			else if (colorMode == 5.)	{

				outColor.r = outColor.r + variation * index * 1.0 / float(numcolors - 1.); 		

				if (mod(index, 3.0) >= 1.0)	{
					outColor.g = outColor.g - variation / 2.0;
					if (outColor.g < 0.0)	{
						outColor.g = outColor.g + variation / 2.0;
					}
				if (outColor.g > 1.0)	{
						outColor.g = outColor.g - floor(outColor.g);
					}
				}
			}
			// Compound Analogous '96'a0similar to analogous but with negative hue shifts
			else if (colorMode == 6.)	{
				if (mod(index, 3.) >= 1.)	{
					outColor.r = outColor.r + variation * index * 1. / float(numcolors - 1.);
				}
				else	{
					outColor.r = outColor.r - variation * index * 0.5 / float(numcolors - 1.);	
				}
				if (mod(index, 3.) >= 1.)	{
					outColor.g = outColor.g - variation / 2.;
					if (outColor.g < 0.)	{
						outColor.g = outColor.g + variation;
					}
					if (outColor.g > 1.)	{
						outColor.g = outColor.g - floor(outColor.g);
					}
				}
				if (mod( index, 4. ) >= 2. )	{
					if (outColor.b < variation)	{
						outColor.b = outColor.b + variation;
					}				
				}
			}
			
			vec4 send = vec4(hsv2rgb(outColor.rgb), inColor.a);
			//send.xy = g
		
			gl_FragColor = send;
}                      