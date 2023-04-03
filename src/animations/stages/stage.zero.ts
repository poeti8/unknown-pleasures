import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

import { FrameAnimationProps } from "./types";
import { createTimeline } from "../../utils";
import { useIsMobile } from "../../hooks";
import { Stage } from "../../store";
import useStore from "../../store";

enum Label {
  Start = "start",
}

const positionToLookAt = new THREE.Vector3(0, 0, 0);

// this runs on each frame (60 time per second, hopefully)
export function runFrameAnimations(...props: FrameAnimationProps) {
  const [stage, _group, _mesh, camera, _frequency, _lerpFactor, controls] =
    props;

  // run only when the stage is one
  if (stage !== Stage.Zero) return;

  if (!controls.scene.orbitControls) {
    camera.lookAt(positionToLookAt);
  }
}

export function useAnimations() {
  // store and refs
  const stage = useStore((store) => store.stage);
  const lines = useStore((store) => store.refs.lines.current);
  const pause = useStore((store) => store.refs.pause);
  const reverse = useStore((store) => store.refs.reverse);

  // scene
  const camera = useThree((state) => state.camera);

  // check if is being viewed from a mobile
  const isMobile = useIsMobile();

  useEffect(() => {
    // only run when the stage is zero
    if (stage !== Stage.Zero) return;
    if (!lines) return;

    const timeline = createTimeline(pause, reverse);

    timeline.addLabel(Label.Start, 0);

    const linesCount = lines.children.length;
    lines.children.forEach((group, index) => {
      const normalizedIndex = (index - 1) / linesCount;
      const normalizedReversedIndex = 1 - normalizedIndex;

      group.children.forEach((lineOrPlane) => {
        const mesh = lineOrPlane as THREE.Mesh<
          THREE.BoxGeometry,
          THREE.ShaderMaterial
        >;
        const uniforms = mesh.material.uniforms;

        // set wave ampitude to 0, so each line would be straight first
        uniforms.uWaveExpandAmplitude.value = 0;

        // then increase the amplitude as lines appear on the screen
        timeline.to(
          uniforms.uWaveExpandAmplitude,
          {
            value: 1,
            duration: 6,
            ease: "power1.out",
            delay: normalizedReversedIndex * 3,
          },
          Label.Start
        );
      });

      // move lines into view one by one
      group.position.z = Math.pow(normalizedReversedIndex, 10) + 10;
      group.position.x = Math.pow(normalizedReversedIndex, 1.5) + 2;
      group.position.y = -Math.pow(normalizedReversedIndex, 3);
      group.scale.set(0.1, 0.1, 0.1);
      timeline.to(
        group.scale,
        {
          x: isMobile ? 4.6 / 5 : 1,
          y: 1,
          z: 1,
          duration: 1.3,
          ease: "sine.out",
          delay: Math.pow(normalizedReversedIndex, 1.5) * 3.4,
        },
        Label.Start
      );

      timeline.to(
        group.position,
        {
          z: 0,
          x: 0,
          y: 0,
          duration: 1.3,
          ease: "sine.out",
          delay: Math.pow(normalizedReversedIndex, 1.5) * 3.4,
        },
        Label.Start
      );
    });

    timeline.to(
      camera.position,
      {
        x: 0,
        y: 10,
        z: -7.8,
        duration: 6,
        ease: "power1.out",
      },
      Label.Start
    );

    timeline.to(
      lines.position,
      {
        z: -0.5,
        x: 0,
        duration: 2,
        ease: "none",
      },
      "<1"
    );

    timeline.to(
      lines.position,
      {
        z: 0,
        x: 0,
        duration: 4,
        ease: "back.inOut",
      },
      ">0.5"
    );
  }, [stage, isMobile, lines]);
}
