void main() {
  // create a glowing star from a point
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength;
  strength = pow(strength, 7.0);

  vec3 color = mix(vec3(0.0), vec3(1.0), strength);
  gl_FragColor = vec4(color, 1.0);
}