import * as THREE from "three";

import { useCustomControls } from "../../hooks";
import { Stage, State } from "../../store";

export type FrameAnimationProps = [
  stage: Stage,
  group: THREE.Object3D,
  mesh: THREE.Mesh<
    THREE.BoxGeometry | THREE.PlaneGeometry,
    THREE.ShaderMaterial
  >,
  camera: THREE.Camera,
  frequency: number,
  lerpFactor: State["refs"]["lerpFactor"]["current"]["value"],
  controls: ReturnType<typeof useCustomControls>
];
