import { useFrame, useThree } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { FC, useMemo } from "react";
import * as THREE from "three";

import {
  useStageAnimations,
  runStageFrameAnimations,
} from "../../animations/stages";
import { useCustomControls } from "../../hooks";
import useStore, { Stage } from "../../store";
import { useFloat } from "../../animations";
import Line from "../Line/Line";

const Lines: FC = () => {
  // store and refs
  const stage = useStore((store) => store.stage);
  const linesRef = useStore((store) => store.refs.lines);
  const waveAmplitudeMag = useStore(
    (store) => store.refs.waveAmplitudeMag.current
  );
  const lerpFactor = useStore((store) => store.refs.lerpFactor.current);
  const audioAnalyser = useStore((store) => store.audioAnalyser);

  // scene
  const camera = useThree((context) => context.camera);

  // debug panel values
  const controls = useCustomControls();

  // update lines on each frame
  useFrame((state) => {
    if (!linesRef.current) return;
    const time = state.clock.getElapsedTime();

    const lines = linesRef.current;

    lines.children.forEach((group, index) => {
      group.children.forEach((lineOrPlane) => {
        const mesh = lineOrPlane as THREE.Mesh<
          THREE.BoxGeometry | THREE.PlaneGeometry,
          THREE.ShaderMaterial
        >;
        const uniforms = mesh.material.uniforms;

        // time
        uniforms.uTime.value = time;

        // resolution
        uniforms.uResolution.value = {
          x: state.size.width * state.gl.getPixelRatio(),
          y: state.size.height * state.gl.getPixelRatio(),
        };

        const data = audioAnalyser?.getFrequencyData();
        const frequency = data?.[index] ?? 0;
        const shouldApply = [Stage.One, Stage.Two].includes(stage);
        if (frequency > 0 && shouldApply) {
          const uWaveExpandAmplitude = uniforms.uWaveExpandAmplitude.value;
          const nextuWaveExpandAmplitude = THREE.MathUtils.mapLinear(
            frequency,
            0,
            255,
            0,
            waveAmplitudeMag.value
          );
          uniforms.uWaveExpandAmplitude.value = THREE.MathUtils.lerp(
            uWaveExpandAmplitude,
            nextuWaveExpandAmplitude,
            0.2
          );
        }

        runStageFrameAnimations(
          stage,
          group,
          mesh,
          camera,
          frequency,
          lerpFactor.value,
          controls
        );
      });
    });
  });

  // lines floating and reacting to mouse movement
  useFloat();

  // add animations
  useStageAnimations();

  // initialize an array to contain lines
  const lineCount = useMemo(() => 69, []);
  const linesList = useMemo(() => [...new Array(lineCount)], [lineCount]);

  return (
    <>
      <Center position-z={0.5}>
        {useMemo(
          () => (
            <group ref={linesRef}>
              {linesList.map((_, index) => (
                <Line key={`line-${index}`} index={index} total={lineCount} />
              ))}
            </group>
          ),
          [controls.line.gap]
        )}
      </Center>
    </>
  );
};

export default Lines;
