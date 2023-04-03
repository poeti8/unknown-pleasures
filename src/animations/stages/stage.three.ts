import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

import { FrameAnimationProps } from "./types";
import { createTimeline } from "../../utils";
import { Stage } from "../../store";
import useStore from "../../store";

enum Label {
  Start = "start",
  Surfing = "surfing",
  Texts = "texts",
}

export function runFrameAnimations(..._props: FrameAnimationProps) {}

export function useAnimations() {
  // store
  const stage = useStore((store) => store.stage);
  const setStage = useStore((store) => store.setStage);
  const lines = useStore((store) => store.refs.lines.current);
  const pause = useStore((store) => store.refs.pause);
  const reverse = useStore((store) => store.refs.reverse);

  // scene
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    // only run when the stage is three
    if (stage !== Stage.Three) return;

    const duration = 2.5;
    const textDuration = 3;
    const surfingDuration = 25;

    const timeline = createTimeline(pause, reverse, {
      onUpdate: () => {
        const progress = timeline.totalProgress();
        if (progress >= 0.35 && stage === Stage.Three) {
          // set to stage three
          setStage(Stage.Four);

          // stop current animations in stage two
          const animations = timeline.getChildren().slice(0, -1);
          animations.forEach((animation) => {
            animation.kill();
          });

          // hide stage three stage and texts
          setTimeout(() => {
            gsap.set(".texts.stage-three", {
              display: "none",
            });
          }, 1200);
        }
      },
    });
    timeline.addLabel(Label.Start, 0);
    timeline.addLabel(Label.Texts, 1.25);

    const linesCount = lines.children.length;

    setTimeout(() => {
      lines.children.forEach((group) => {
        group.children.forEach((lineOrPlane) => {
          const { uniforms } = (
            lineOrPlane as THREE.Mesh<THREE.BoxGeometry, THREE.ShaderMaterial>
          ).material;
          uniforms.uWaveSpeed1.value = 0.2;
          uniforms.uWaveSpeed2.value = 0.2;
          uniforms.uWaveSpeed3.value = 0.4;
        });
      });
    }, 1000);

    const gap = 0.8;
    lines.children.forEach((group, index) => {
      const normalizedIndex = index / (linesCount - 1);

      timeline.to(
        group.position,
        {
          z: -1 * index * gap,
          duration,
          delay: Math.pow(normalizedIndex, 2) * 0.4,
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
          mesh.scale,
          {
            x: 10,
            duration,
            ease: "power1.out",
          },
          Label.Start
        );

        timeline.to(
          uniforms.uWaveExpandPower,
          {
            value: -3,
            duration,
            ease: "power1.out",
          },
          Label.Start
        );

        timeline.to(
          uniforms.uWaveExpandAmplitude,
          {
            value: 0.02,
            duration,
            ease: "power1.out",
          },
          Label.Start
        );
      });
    });

    timeline.to(
      camera.rotation,
      {
        x: -Math.PI,
        y: Math.PI * 0.5,
        z: -Math.PI,
        duration: duration / 1.5,
        ease: "power1.out",
      },
      Label.Start
    );

    timeline.to(
      camera.position,
      {
        z: -6,
        duration: duration / 2,
        ease: "power1.out",
      },
      Label.Start
    );

    timeline.to(
      camera.position,
      {
        x: 0,
        duration: duration / 1.5,
        ease: "power1.out",
      },
      "<75%"
    );

    timeline
      .to(
        camera.position,
        {
          z: -80,
          y: 2,
          x: -1,
          duration: surfingDuration,
          ease: "power1.out",
        },
        "<55%"
      )
      .addLabel(Label.Surfing, "<");

    timeline.set(
      ".texts.stage-three",
      {
        display: "block",
      },
      Label.Texts
    );

    timeline.to(
      ".texts.when-routine-bites-hard",
      {
        opacity: 1,
        x: -200,
        duration: textDuration,
        ease: "power2.out",
      },
      Label.Texts
    );

    timeline.to(
      ".texts.when-routine-bites-hard",
      {
        opacity: 0,
        x: -500,
        duration: textDuration,
        ease: "power2.out",
      },
      `${Label.Texts}+=2.5`
    );

    timeline.to(
      ".texts.and-ambitions-are-low",
      {
        opacity: 1,
        duration: textDuration,
        ease: "power2.out",
      },
      `${Label.Texts}+=3`
    );

    timeline.to(
      ".texts.and-ambitions-are-low",
      {
        opacity: 0,
        x: -400,
        duration: textDuration,
        ease: "power2.out",
      },
      `${Label.Texts}+=6`
    );

    timeline.to(
      ".texts.and-resentment-rides-high",
      {
        opacity: 1,
        x: -200,
        duration: textDuration,
        ease: "power2.out",
      },
      `${Label.Texts}+=6`
    );

    timeline.to(
      ".texts.and-resentment-rides-high",
      {
        opacity: 0,
        y: 300,
        duration: 3,
        ease: "power2.out",
      },
      `${Label.Texts}+=8.5`
    );
  }, [stage]);
}
