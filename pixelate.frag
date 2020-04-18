// simple pixelation of source video - square and round pixels
// round pixels hacked from Dot Shader by Trollattori
// from Shadertoy https://www.shadertoy.com/view/wdGSzy
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
//f1:: typeswitch
//f2::
float f0 = mix(0.05, 200., fparams[0]);
float f1 = mix(1., 2.5, fparams[1]);
float f2 = mix(0.05, 0.95, fparams[2]);

float time = float(itime) + ftime;
vec2 resolution = tres;

vec2 aspect_ratio = vec2(tres.x / tres.y , 1.);

float steps = f0;
int typeswitch = int(floor(f1));

void main( void ) {
    vec3 color;
    vec2 uv;

    // typeswitch == 1 square pixels
    // typeswitch == 2 round pixels
    if (typeswitch == 1) {
        uv = ceil(tcoord * vec2(steps)) / vec2(steps);
        color = texture2D(tex, uv).rgb;
    } else if (typeswitch == 2) {
        uv = tcoord;

        uv *= steps / 2.;
        uv *= aspect_ratio;
        uv += 0.5;

        vec2 fraction = fract(uv);
        
        uv = floor(uv);
        uv /= aspect_ratio;
        uv /= steps / 2.;
        
        color = texture2D(tex, uv).rgb;
        float distance = length(vec2(0.5-fraction.x,0.5-fraction.y));
        
        // Output to screen
        color = color * (1.0-smoothstep(0.45,0.50,distance));
    }

    gl_FragColor = vec4(color, 1.0);

}              