import { useMemo } from "react";
import * as THREE from "three";

import planeFragmentShader from "../../shaders/plane/plane.fragment.glsl";
import lineFragmentShader from "../../shaders/line/line.fragment.glsl";
import planeVertexShader from "../../shaders/plane/plane.vertex.glsl";
import lineVertexShader from "../../shaders/line/line.vertex.glsl";
import { useCustomControls } from "../../hooks";

import LineTexts from "./Line.Texts";

// create geometry here once to avoid creating a new geometry for each line
const LINES_WIDTH = 5;
const lineGeometry = new THREE.BoxGeometry(LINES_WIDTH, 0.03, 0.02, 128, 1, 1);
const planeGeometry = new THREE.PlaneGeometry(LINES_WIDTH, 1.5, 128, 1);
const planeGeometrySmall = new THREE.PlaneGeometry(LINES_WIDTH, 0.4, 128, 1);

interface Props {
  index: number;
  total: number;
}

const Line = (props: Props) => {
  // debug panel values
  const controls = useCustomControls();

  // uniforms
  const uniforms = useMemo(() => {
    return {
      uOffset: { value: props.index * 11 },
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(),
      },
      uMouse: {
        value: new THREE.Vector2(),
      },
      uCursorRadius: {
        value: 0,
      },
      uWaveExpandPower: {
        value: controls.uniforms.uWaveExpandPower,
      },
      uWaveExpandAmplitude: {
        value: 1,
      },
      uWaveSpeed1: {
        value: controls.uniforms.uWaveSpeed1,
      },
      uWaveSpeed2: {
        value: controls.uniforms.uWaveSpeed2,
      },
      uWaveSpeed3: {
        value: controls.uniforms.uWaveSpeed3,
      },
      ...THREE.UniformsLib["fog"],
    };
  }, []);

  // scale down the fist few planes so it doesn't look big on mouse hover
  const shouldHaveSmallPlane = props.total - props.index - 1 < 6;

  return (
    <group>
      <mesh
        name="line"
        position={[0, 0, -props.index * controls.line.gap]}
        geometry={lineGeometry}
      >
        <shaderMaterial
          fog={true}
          uniforms={uniforms}
          vertexShader={lineVertexShader}
          fragmentShader={lineFragmentShader}
        />
        <LineTexts index={props.index} />
      </mesh>
      <mesh
        name="plane"
        geometry={shouldHaveSmallPlane ? planeGeometrySmall : planeGeometry}
        position={[
          0,
          shouldHaveSmallPlane ? -0.2 : -0.75,
          -props.index * controls.line.gap,
        ]}
      >
        <shaderMaterial
          fog={true}
          side={THREE.DoubleSide}
          uniforms={uniforms}
          vertexShader={planeVertexShader}
          fragmentShader={planeFragmentShader}
        />
      </mesh>
    </group>
  );
};

export default Line;
