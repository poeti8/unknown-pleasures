#include ../noise; 

uniform float uTime;
uniform float uSpeed;
uniform float uFrequency;
uniform float uAmplitude;

void main() {
  vec3 cPosition = position;

  // add wave effect to the sphere
  float distortion = cnoise4(vec4(normal * uFrequency, uTime * uSpeed)) * uAmplitude;
  cPosition = cPosition + (normal * distortion);

  vec4 modelPosition = modelMatrix * vec4(cPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}