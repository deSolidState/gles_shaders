// oversharpens source video - artifacts are boxy lines to boxy color blobs
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

//f0:: intensity
//f1:: thick - thickness of lines
float f0 = mix(0.05, 150., fparams[0]);
float f1 = mix(0.05, 0.99, fparams[1]);

// float time = float(itime) + ftime;

float intensity = f0;
float thick = 1. / log(f1);

void main(void) {
  vec2 d = thick/tres;

  vec2 left_coord = clamp(vec2(tcoord + vec2(-d.x , 0.)), 0., 1.);
  vec2 right_coord = clamp(vec2(tcoord + vec2(d.x , 0.)),0.0,1.0);
  vec2 above_coord = clamp(vec2(tcoord + vec2(0.,d.y)),0.0,1.0);
  vec2 below_coord = clamp(vec2(tcoord + vec2(0.,-d.y)),0.0,1.0);

  vec2 lefta_coord = clamp(vec2(tcoord + vec2(-d.x , d.x)),0.0,1.0);
  vec2 righta_coord = clamp(vec2(tcoord + vec2(d.x , d.x)),0.0,1.0);
  vec2 leftb_coord = clamp(vec2(tcoord + vec2(-d.x , -d.x)),0.0,1.0);
  vec2 rightb_coord = clamp(vec2(tcoord + vec2(d.x , -d.x)),0.0,1.0);

  vec4 color = texture2D(tex, tcoord);
  vec4 colorL = texture2D(tex, left_coord);
  vec4 colorR = texture2D(tex, right_coord);
  vec4 colorA = texture2D(tex, above_coord);
  vec4 colorB = texture2D(tex, below_coord);

  vec4 colorLA = texture2D(tex, lefta_coord);
  vec4 colorRA = texture2D(tex, righta_coord);
  vec4 colorLB = texture2D(tex, leftb_coord);
  vec4 colorRB = texture2D(tex, rightb_coord);

  vec4 final = color + intensity * (8.0 * color - colorL - colorR - colorA - colorB - colorLA - colorRA - colorLB - colorRB);

  gl_FragColor = final;
}