import { useFrame } from "@react-three/fiber";
import { FC, useMemo } from "react";
import * as THREE from "three";

import fragmentShader from "../../shaders/moon/moon.fragment.glsl";
import vertexShader from "../../shaders/moon/moon.vertex.glsl";
import { useCustomControls, useIsMobile } from "../../hooks";
import useStore, { Stage } from "../../store";

const Moon: FC = () => {
  // refs
  const stage = useStore((store) => store.stage);
  const moonRef = useStore((store) => store.refs.moon);
  const audioAnalyser = useStore((store) => store.audioAnalyser);

  // values from debug pannel
  const controls = useCustomControls();

  // check if is mobile
  const isMobile = useIsMobile();

  useFrame((state) => {
    if (stage !== Stage.Four) return;
    if (!moonRef.current) return;

    const time = state.clock.getElapsedTime();
    moonRef.current.material.uniforms.uTime.value = time;
    moonRef.current.material.uniforms.uSpeed.value = controls.moon.uSpeed;
    moonRef.current.material.uniforms.uFrequency.value =
      controls.moon.uFrequency;
    moonRef.current.material.uniforms.uAmplitude.value =
      controls.moon.uAmplitude;

    const data = audioAnalyser?.getFrequencyData();
    const frequency = data?.[isMobile ? 130 : 68] ?? 0;

    const uAmplitude = Math.pow(
      THREE.MathUtils.mapLinear(
        frequency,
        0,
        255,
        0,
        controls.moon.maxUAmplitude
      ),
      controls.moon.power
    );
    const nextUAmplitude = THREE.MathUtils.lerp(
      moonRef.current.material.uniforms.uAmplitude.value,
      uAmplitude,
      0.8
    );
    moonRef.current.material.uniforms.uAmplitude.value = nextUAmplitude;
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: 3.5 },
      uFrequency: { value: 50 },
      uAmplitude: { value: 1 },
    }),
    []
  );

  return (
    <mesh ref={moonRef} position={[3.5, -5, 4.5]} visible={false}>
      <sphereGeometry args={[6, 32, 32]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default Moon;
