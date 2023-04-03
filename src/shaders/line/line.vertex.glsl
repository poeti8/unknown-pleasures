#include <fog_pars_vertex>
#include ../noise; 

uniform float uOffset;
uniform float uTime;

uniform float uWaveExpandPower;
uniform float uWaveExpandAmplitude;

uniform float uWaveSpeed1;
uniform float uWaveSpeed2;
uniform float uWaveSpeed3;

uniform vec2 uMouse;

varying float vColor;

void main() {
  #include <begin_vertex>
  #include <project_vertex>
  #include <fog_vertex>

  vec4 cPosition = vec4(position, 1.0);

  // add waves to the line
  // this adds three layers of wave, first to are to give it a pencil skethy look
  // the third wave is the main one
  float waveAmplitude = pow((1.0 - (abs(uv.x - 0.5)) * 2.0), uWaveExpandPower) * uWaveExpandAmplitude;
  float wave = 0.0;
  wave += (cnoise(vec2(cPosition.x + uOffset, uTime * uWaveSpeed1) * 50.0) + 1.0) * 0.018;
  wave += (cnoise(vec2(cPosition.x + uOffset, uTime * uWaveSpeed2 * 0.01) * 1000.0)) * 0.1 * waveAmplitude;
  wave += pow((cnoise(vec2(cPosition.x + uOffset, uTime * uWaveSpeed3) * 2.5) + 1.0) * waveAmplitude, 1.21) * 0.55;
  cPosition.y += wave;

  vec4 modelPosition = modelMatrix * cPosition;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  vColor = step(1.0, abs(distance(uMouse.x, projectionPosition.x)));
}