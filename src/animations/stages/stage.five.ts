import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { useCustomControls } from "../../hooks";
import { FrameAnimationProps } from "./types";
import { createTimeline } from "../../utils";
import { Stage } from "../../store";
import useStore from "../../store";
import { lerp } from "three/src/math/MathUtils";

enum Label {
  Start = "start",
  TearApart = "tearapart",
  TearApart2 = "tearapart2",
}

export function runFrameAnimations(..._props: FrameAnimationProps) {}

export function useAnimations() {
  // store
  const stage = useStore((store) => store.stage);
  const lines = useStore((store) => store.refs.lines.current);
  const stars = useStore((store) => store.refs.stars.current);
  const audio = useStore((store) => store.refs.audio.current);
  const moon = useStore((store) => store.refs.moon.current);
  const pause = useStore((store) => store.refs.pause);
  const reverse = useStore((store) => store.refs.reverse);

  // states
  const [volumeToFadeTo, setVolumeToFadeTo] = useState(0.05);

  // refs
  const volumeRef = useRef<number | undefined>();

  // scene
  const fog = useThree((state) => state.scene.fog);
  const camera = useThree((state) => state.camera);

  // controls
  const controls = useCustomControls();

  // fade out music when animation is complete
  useFrame(() => {
    if (stage !== Stage.Five && volumeRef.current) {
      volumeRef.current = undefined;
    }
    if (stage !== Stage.Five) return;

    if (volumeRef.current) {
      volumeRef.current = lerp(audio?.getVolume()!, volumeToFadeTo, 0.01);
      audio?.setVolume(volumeRef.current);
    }
  });

  useEffect(() => {
    // only run when the stage is five
    if (stage !== Stage.Five) return;

    const timeline = createTimeline(pause, reverse, {
      onComplete: () => {
        setTimeout(() => {
          setVolumeToFadeTo(0);
        }, 5000);
      },
    });

    timeline.addLabel(Label.Start, 0);
    timeline.addLabel(Label.TearApart, 1);
    timeline.addLabel(Label.TearApart2, 5.25);

    // start
    lines.children.forEach((group, index) => {
      timeline.to(
        group.position,
        {
          z: -1 * index,
          duration: 2,
          ease: "power1.out",
        },
        Label.Start
      );

      group.children.forEach((lineOrPlane) => {
        const mesh = lineOrPlane as THREE.Mesh<
          THREE.BoxGeometry,
          THREE.ShaderMaterial
        >;
        const { uniforms } = mesh.material;

        timeline.to(
          uniforms.uWaveExpandPower,
          {
            value: 4.5,
            duration: 1,
            ease: "power1.out",
            onComplete: () => {
              uniforms.uWaveSpeed1.value = 0.08;
              uniforms.uWaveSpeed2.value = 0.06;
              uniforms.uWaveSpeed3.value = 0.46;
            },
          },
          Label.Start
        );

        timeline.to(
          mesh.scale,
          {
            x: 18,
            duration: 1,
            ease: "power1.out",
          },
          Label.Start
        );

        timeline.to(
          uniforms.uWaveExpandAmplitude,
          {
            value: 1.4,
            duration: 1,
            ease: "power1.out",
          },
          Label.Start
        );
      });
    });

    timeline.to(
      camera.position,
      {
        z: -34.4,
        y: 25,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          stars!.visible = false;
          moon!.visible = false;
        },
      },
      Label.Start
    );

    timeline.to(
      camera.rotation,
      {
        x: -Math.PI * 0.5,
        duration: 0.8,
        ease: "power2.out",
      },
      Label.Start
    );

    timeline.to(
      camera.rotation,
      {
        z: -Math.PI - (Math.PI / 4) * 3,
        duration: 0.8,
        ease: "power1.out",
      },
      `${Label.Start}+=0.3`
    );

    timeline.to(
      camera.position,
      {
        y: 50,
        duration: 0.8,
        ease: "power1.out",
      },
      "<"
    );

    timeline.to(
      camera.rotation,
      {
        z: -Math.PI - (Math.PI / 4) * 5,
        duration: 2.5,
        ease: "power2.out",
      },
      "<51%"
    );

    // tear apart part 1
    const focusedLineIndex = 34;
    lines.children.forEach((group, index) => {
      const normalizedIndexDiffToFocusedLine =
        Math.abs(index - focusedLineIndex) / focusedLineIndex;
      const distanceToFocuesdLine = 1.8 + normalizedIndexDiffToFocusedLine * 10;

      timeline.to(
        group.position,
        {
          z:
            index > focusedLineIndex
              ? `-=${distanceToFocuesdLine}`
              : `+=${distanceToFocuesdLine}`,
          duration: 3,
          delay: normalizedIndexDiffToFocusedLine * 0.5,
          ease: "power2.out",
        },
        `${Label.TearApart}+=1.5`
      );
    });

    timeline.set(
      ".texts.stage-five",
      {
        display: "block",
      },
      Label.TearApart
    );

    timeline.to(
      ".texts.then-love",
      {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      },
      Label.TearApart
    );

    timeline.to(
      camera.position,
      {
        y: 15,
        duration: 1.5,
        ease: "power2.out",
      },
      `${Label.TearApart}+=1.5`
    );

    timeline.to(
      ".texts.then-love",
      {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      `${Label.TearApart}+=1.5`
    );

    timeline.to(
      ".texts.love-will-tear-us-aprat",
      {
        opacity: 1,
        scale: 1,
        rotate: "-45_ccw",
        duration: 1.5,
        ease: "power1.out",
      },
      `${Label.TearApart}+=1.6`
    );

    timeline.to(
      ".texts.love-will-tear-us-aprat",
      {
        letterSpacing: "0.7rem",
        autoRound: false,
        duration: 2,
        ease: "power1.out",
      },
      `${Label.TearApart}+=2`
    );

    // tear apart part 2
    lines.children.forEach((group, index) => {
      const normalizedIndexDiffToFocusedLine =
        Math.abs(index - focusedLineIndex) / focusedLineIndex;
      const distanceToFocuesdLine = 1.8 + normalizedIndexDiffToFocusedLine * 10;

      timeline.to(
        group.position,
        {
          z:
            index > focusedLineIndex
              ? `+=${distanceToFocuesdLine}`
              : `-=${distanceToFocuesdLine}`,
          duration: 1,
          ease: "power2.out",
        },
        `${Label.TearApart2}-=0.5`
      );

      timeline.to(
        group.position,
        {
          z: 0,
          duration: 1.5,
          ease: "power1.out",
        },
        Label.TearApart2
      );

      timeline.to(
        group.position,
        {
          z: -1 * index * 0.1,
          duration: 1.5,
          ease: "power1.out",
        },
        `${Label.TearApart2}+=2`
      );

      timeline.to(
        group.position,
        {
          z: -1 * index * 2,
          duration: 8,
          ease: "power1.out",
        },
        `${Label.TearApart2}+=3.5`
      );

      group.children.forEach((lineOrPlane) => {
        const mesh = lineOrPlane as THREE.Mesh<
          THREE.BoxGeometry,
          THREE.ShaderMaterial
        >;
        const { uniforms } = mesh.material;

        timeline.to(
          mesh.scale,
          {
            x: 1,
            duration: 1,
            ease: "power1.out",
          },
          Label.TearApart2
        );

        timeline.to(
          uniforms.uWaveExpandPower,
          {
            value: controls.uniforms.uWaveExpandPower,
            duration: 2,
            ease: "power1.out",
          },
          Label.TearApart2
        );

        timeline.to(
          uniforms.uWaveExpandAmplitude,
          {
            value: controls.uniforms.uWaveExpandAmplitude,
            duration: 2,
            ease: "power1.out",
          },
          Label.TearApart2
        );

        timeline.to(
          mesh.scale,
          {
            x: 1.15,
            duration: 0.8,
            ease: "power1.out",
          },
          `${Label.TearApart2}+=2`
        );

        timeline.to(
          mesh.scale,
          {
            x: 14,
            duration: 8,
            ease: "power1.out",
          },
          `${Label.TearApart2}+=3.5`
        );

        timeline.to(
          uniforms.uWaveExpandPower,
          {
            value: 4.2,
            duration: 8,
            ease: "power1.out",
          },
          `${Label.TearApart2}+=3.5`
        );

        timeline.to(
          uniforms.uWaveExpandAmplitude,
          {
            value: 3.5,
            duration: 8,
            ease: "power1.out",
          },
          `${Label.TearApart2}+=3.5`
        );
      });
    });

    timeline.to(
      fog,
      {
        density: 0.001,
        duration: 2,
        ease: "power2.out",
      },
      Label.TearApart2
    );

    timeline.to(
      ".texts.love-will-tear-us-aprat",
      {
        opacity: 0,
        scale: 0,
        duration: 0.75,
        ease: "power2.out",
      },
      `${Label.TearApart2}-=0.25`
    );

    timeline.to(
      ".texts.again",
      {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
      },
      Label.TearApart2
    );

    timeline.to(
      camera.position,
      {
        y: 20,
        z: -3.8,
        x: 0,
        duration: 1.5,
        ease: "power1.out",
      },
      Label.TearApart2
    );

    timeline.to(
      camera.rotation,
      {
        z: -Math.PI,
        x: -1.8,
        duration: 1.5,
        ease: "power1.out",
      },
      Label.TearApart2
    );

    timeline.to(
      ".texts.again",
      {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      `${Label.TearApart2}+=1.8`
    );

    timeline.to(
      ".texts.love",
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
      },
      `${Label.TearApart2}+=2.2`
    );

    timeline.to(
      camera.position,
      {
        y: 10,
        z: -1,
        duration: 1.5,
        ease: "power1.out",
      },
      `${Label.TearApart2}+=2`
    );

    timeline.to(
      camera.position,
      {
        z: -30,
        duration: 4,
        ease: "power1.in",
      },
      `${Label.TearApart2}+=3.5`
    );

    timeline.to(
      camera.rotation,
      {
        x: -2.3,
        duration: 1.5,
        ease: "power1.out",
      },
      `${Label.TearApart2}+=2`
    );

    timeline.to(
      ".texts.love",
      {
        opacity: 0,
        scale: 0,
        duration: 1,
        ease: "power2.out",
      },
      `${Label.TearApart2}+=3.5`
    );

    timeline.to(
      camera.rotation,
      {
        x: -1.9,
        duration: 8,
        ease: "power1.out",
      },
      `${Label.TearApart2}+=3.5`
    );

    timeline.to(
      camera.position,
      {
        y: 40,
        duration: 8,
        ease: "power1.inOut",
      },
      `${Label.TearApart2}+=3.5`
    );

    timeline.to(
      camera.position,
      {
        z: -40,
        duration: 12,
        ease: "power1.out",
      },
      `${Label.TearApart2}+=3.5`
    );

    timeline.set(
      ".stage-five-wrapper",
      {
        display: "flex",
      },
      `${Label.TearApart2}+=3.5`
    );

    timeline.set(
      ".texts.love-will-tear-us-aprat-2",
      {
        y: 100,
      },
      `${Label.TearApart2}+=3.5`
    );

    timeline.set(
      "#again-btn-wrapper",
      {
        display: "block",
        y: 100,
      },
      `${Label.TearApart2}+=3.5`
    );

    timeline.to(
      ".stage-five-wrapper",
      {
        opacity: 1,
        duration: 3,
        ease: "power1.out",
      },
      `${Label.TearApart2}+=4`
    );

    timeline.to(
      ".texts.love-will-tear-us-aprat-2",
      {
        opacity: 1,
        y: 0,
        duration: 3,
        ease: "power1.out",
      },
      `${Label.TearApart2}+=4`
    );

    timeline.to(
      "#again-btn-wrapper",
      {
        opacity: 1,
        y: 0,
        duration: 3,
        ease: "power1.out",
        onComplete: () => {
          setTimeout(() => {
            volumeRef.current = audio?.getVolume();
          }, 1000);
        },
      },
      `${Label.TearApart2}+=7`
    );
  }, [stage]);
}
