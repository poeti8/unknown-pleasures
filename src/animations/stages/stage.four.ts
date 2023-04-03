import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

import { createTimeline, mapLinear } from "../../utils";
import { FrameAnimationProps } from "./types";
import { Stage } from "../../store";
import useStore from "../../store";

enum Label {
  Start = "start",
  Sky = "sky",
  Texts = "texts",
}

export function runFrameAnimations(..._props: FrameAnimationProps) {}

export function useAnimations() {
  // store
  const stage = useStore((store) => store.stage);
  const setStage = useStore((store) => store.setStage);
  const lines = useStore((store) => store.refs.lines.current);
  const stars = useStore((store) => store.refs.stars.current);
  const moon = useStore((store) => store.refs.moon.current);
  const pause = useStore((store) => store.refs.pause);
  const reverse = useStore((store) => store.refs.reverse);

  // scene
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    // only run when the stage is four
    if (stage !== Stage.Four) return;

    stars!.visible = true;
    moon!.visible = true;

    const duration = 3;

    const timeline = createTimeline(pause, reverse, {
      onUpdate: () => {
        const progress = timeline.totalProgress();
        if (progress >= 0.4 && stage === Stage.Four) {
          // set to stage five
          setStage(Stage.Five);
          // stop current animations in stage two
          const animations = timeline.getChildren();
          animations.forEach((animation) => {
            animation.kill();
          });

          // hide stage four stage and texts
          setTimeout(() => {
            gsap.set(".texts.stage-four", {
              display: "none",
            });
            stars!.visible = false;
            moon!.visible = false;
          }, 1000);
        }
      },
    });

    timeline.addLabel(Label.Start, 0);
    timeline.addLabel(Label.Sky);
    timeline.addLabel(Label.Texts, 2);

    const linesCount = lines.children.length;

    lines.children.forEach((group, index) => {
      const reversedIndex = linesCount - index - 1;

      group.children.forEach((lineOrPlane) => {
        const mesh = lineOrPlane as THREE.Mesh<
          THREE.BoxGeometry,
          THREE.ShaderMaterial
        >;
        const { uniforms } = mesh.material;

        timeline.to(
          uniforms.uWaveExpandPower,
          {
            value: 1,
            duration: duration,
            ease: "power1.out",
            onComplete: () => {
              uniforms.uWaveSpeed1.value = mapLinear(
                reversedIndex,
                0,
                68,
                0.09,
                0.12
              );
              uniforms.uWaveSpeed2.value = 0.1;
              uniforms.uWaveSpeed3.value = 2.2;
            },
          },
          Label.Start
        );

        timeline.to(
          mesh.scale,
          {
            x: 15,
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
        y: 0,
        x: -Math.PI - 0.05,
        duration: duration * 0.8,
        ease: "back.inOut(1)",
      },
      Label.Start
    );

    timeline.to(
      camera.position,
      {
        z: -60,
        duration: duration * 0.8,
        ease: "back.inOut(1)",
      },
      Label.Start
    );

    timeline.to(
      stars!.position,
      {
        y: -250,
        duration: duration * 0.8,
        ease: "power1.out",
      },
      Label.Sky
    );

    timeline.to(
      stars!.position,
      {
        y: -280,
        duration: 18,
        ease: "none",
      },
      `${Label.Sky}+=2`
    );

    timeline.to(
      moon!.position,
      {
        y: 22,
        x: 12,
        duration: 25,
        ease: "power1.out",
      },
      `${Label.Sky}+=2`
    );

    timeline.set(
      ".texts.stage-four",
      {
        display: "block",
      },
      Label.Texts
    );

    timeline.to(
      ".but-emotions-wont-grow",
      {
        opacity: 1,
        y: 0,
        duration: 3.5,
        ease: "power1.out",
      },
      Label.Texts
    );

    timeline.to(
      ".and-were-changing-our-ways",
      {
        opacity: 1,
        y: 0,
        duration: 3.5,
        ease: "power1.out",
      },
      `${Label.Texts}+=3`
    );

    timeline.to(
      ".taking-different-roads",
      {
        opacity: 1,
        y: 0,
        duration: 3.5,
        ease: "power1.out",
      },
      `${Label.Texts}+=6`
    );

    timeline.to(
      ".but-emotions-wont-grow",
      {
        opacity: 0,
        y: -100,
        duration: 1,
        ease: "power1.out",
      },
      `${Label.Texts}+=8.2`
    );

    timeline.to(
      ".and-were-changing-our-ways",
      {
        opacity: 0,
        y: -100,
        duration: 1,
        ease: "power1.out",
      },
      `${Label.Texts}+=8.4`
    );

    timeline.to(
      ".taking-different-roads",
      {
        opacity: 0,
        y: -100,
        duration: 1,
        ease: "power1.out",
      },
      `${Label.Texts}+=8.6`
    );
  }, [stage]);
}
