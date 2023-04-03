uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uCursorRadius;

void main() {
  vec2 st = gl_FragCoord.xy / uResolution;
  vec2 distanceToMouse = uMouse / uResolution - st;
  distanceToMouse.x *= uResolution.x / uResolution.y;

  float brightness = 0.95;

  vec3 color = vec3(0.0);
  color += step(uCursorRadius, length(distanceToMouse)) * vec3(0.007843137, 0.066666667, 0.098039216);
  color += (1.0 - step(uCursorRadius, length(distanceToMouse))) * vec3(0.992156863, 0.984313725, 0.992156863) * brightness;

  gl_FragColor = vec4(color, 1.0);
}