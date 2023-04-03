import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

import { FrameAnimationProps } from "./types";
import { createTimeline } from "../../utils";
import { Stage } from "../../store";
import useStore from "../../store";

enum Label {
  Start = "start",
}

const positionToLookAt = new THREE.Vector3(0, 0, 0);

// this runs on each frame (60 time per second, hopefully)
export function runFrameAnimations(...props: FrameAnimationProps) {
  const [stage, _group, _mesh, camera] = props;

  // run only when the stage is one
  if (stage !== Stage.One) return;

  camera.lookAt(positionToLookAt);
}

export function useAnimations() {
  // store and refs
  const stage = useStore((store) => store.stage);
  const setStage = useStore((store) => store.setStage);
  const lines = useStore((store) => store.refs.lines.current);
  const pause = useStore((store) => store.refs.pause);
  const reverse = useStore((store) => store.refs.reverse);

  // scene
  const camera = useThree((state) => state.camera);

  // position to look at
  const positionToLookAt = new THREE.Vector3(0, 0, 0);

  useEffect(() => {
    // only run when the stage is one
    if (stage !== Stage.One) return;
    if (!lines) return;

    const timeline = createTimeline(pause, reverse, {
      onComplete: () => {
        setStage(Stage.Two);
      },
    });

    timeline.addLabel(Label.Start, 0);

    // add small distance between the lines
    lines.children.forEach((lineOrPlane, index) => {
      timeline.to(
        lineOrPlane.position,
        {
          z: index * -0.02,
          duration: 10,
          delay: 4,
          ease: "none",
        },
        Label.Start
      );

      lineOrPlane.children.forEach((lineOrPlane) => {
        const uniforms = (
          (lineOrPlane as THREE.Mesh).material as THREE.ShaderMaterial
        ).uniforms;

        // set default wave amplitude to 0, so that lines are straight if frequency is 0
        timeline.to(
          uniforms.uWaveExpandAmplitude,
          {
            value: 0,
            duration: 2.5,
            ease: "power2.out",
            delay: 1,
          },
          Label.Start
        );
      });
    });

    timeline.to(
      lines.rotation,
      {
        z: 0,
        x: 0,
        duration: 2.5,
        ease: "elastic",
      },
      Label.Start
    );

    timeline.to(
      camera.position,
      {
        y: 5,
        z: -12,
        duration: 12.5,
        ease: "none",
      },
      ">1"
    );
  }, [stage]);
}
