import { useEffect } from "react";
import useStore from "../store/store";

import useCustomControls from "./useCustomControls";

// update line uniforms from debug panel values if manual is enabled
function useUniformControl() {
  // refs
  const lines = useStore((store) => store.refs.lines);

  // values from debug panel
  const controls = useCustomControls();

  useEffect(() => {
    if (!controls.uniforms.manual) return;

    lines.current.children.forEach((group) => {
      group.children.forEach((lineOrPlane) => {
        const uniforms = (
          (lineOrPlane as THREE.Mesh).material as THREE.ShaderMaterial
        ).uniforms;
        uniforms.uWaveExpandAmplitude.value =
          controls.uniforms.uWaveExpandAmplitude;
        uniforms.uWaveExpandPower.value = controls.uniforms.uWaveExpandPower;
        uniforms.uWaveSpeed1.value = controls.uniforms.uWaveSpeed1;
        uniforms.uWaveSpeed2.value = controls.uniforms.uWaveSpeed2;
        uniforms.uWaveSpeed3.value = controls.uniforms.uWaveSpeed3;
      });
    });
  }, [controls.uniforms]);
}

export default useUniformControl;
