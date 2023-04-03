import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

import { useCustomControls, useIsMobile } from "../../hooks";
import { FrameAnimationProps } from "./types";
import { createTimeline } from "../../utils";
import { Stage } from "../../store";
import useStore from "../../store";

enum Label {
  Start = "start",
}

const elements = [
  "#again-btn-wrapper",
  ".reset-overlay",
  ".stage-five-wrapper",
  ".texts.stage-three",
  ".texts.stage-foure",
  ".texts.stage-five",
  ".texts.when-routine-bites-hard",
  ".texts.and-ambitions-are-low",
  ".texts.and-resentment-rides-high",
  ".texts.but-emotions-wont-grow",
  ".texts.and-were-changing-our-ways",
  ".texts.taking-different-roads",
  ".texts.then-love",
  ".texts.love-will-tear-us-aprat",
  ".texts.again",
  ".texts.love",
  ".texts.love-will-tear-us-aprat-2",
];

// this runs on each frame (60 time per second, hopefully)
export function runFrameAnimations(..._props: FrameAnimationProps) {}

export function useAnimations() {
  // store and refs
  const stage = useStore((store) => store.stage);
  const setStage = useStore((store) => store.setStage);
  const setIsTrackPlaying = useStore((state) => state.setIsTrackPlaying);
  const waveAmplitudeMag = useStore((store) => store.refs.waveAmplitudeMag);
  const audio = useStore((store) => store.refs.audio.current);
  const lines = useStore((store) => store.refs.lines.current);
  const stars = useStore((store) => store.refs.stars.current);
  const moon = useStore((store) => store.refs.moon.current);
  const pause = useStore((store) => store.refs.pause);
  const reverse = useStore((store) => store.refs.reverse);

  // scene
  const camera = useThree((state) => state.camera);
  const fog = useThree((state) => state.scene.fog);

  // values from debug panel
  const controls = useCustomControls();

  // check if is mobile
  const isMobile = useIsMobile();

  // resetting positions and values to prepare the experience to be started from the beginning again
  useEffect(() => {
    // only run when the stage is reset
    if (stage !== Stage.Reset) return;

    const timeline = createTimeline(pause, reverse);

    // animate lines out of the screen
    const linesCount = lines.children.length;
    lines.children.forEach((group, index) => {
      const normalizedIndex = (index - 1) / linesCount;
      timeline.to(
        group.position,
        {
          z: "+=50",
          duration: 6,
          ease: "power1.out",
          delay: Math.pow(normalizedIndex, 1.5) * 6,
        },
        Label.Start
      );
    });

    // fade out texts from the last stage
    timeline.to(
      ".texts.love-will-tear-us-aprat-2",
      {
        opacity: 0,
        y: 100,
        duration: 3,
        ease: "power1.out",
      },
      Label.Start
    );

    timeline.to(
      "#again-btn-wrapper",
      {
        opacity: 0,
        y: 100,
        duration: 3,
        ease: "power1.out",
      },
      Label.Start
    );

    timeline.set(
      ".reset-overlay",
      {
        display: "block",
      },
      Label.Start
    );

    timeline.to(
      ".reset-overlay",
      {
        opacity: 1,
        duration: 4,
        ease: "power1.out",
        onComplete: () => {
          // stop current animations in this stage
          const animations = timeline.getChildren();
          animations.forEach((animation) => {
            animation.kill();
          });

          // reset propeties
          reset();

          // set to the first stage
          setStage(Stage.Zero);
          setIsTrackPlaying(false);
        },
      },
      Label.Start
    );

    function reset() {
      // stop the auido
      audio?.stop();
      audio?.setVolume(controls.audio.volume);

      // reset camera
      camera.position.set(15, -10, -80);

      // reset line properties
      lines.children.forEach((group) => {
        group.position.set(0, 0, 0);
        group.scale.set(isMobile ? 4.6 / 5 : 1, 1, 1);
        group.children.forEach((lineOrPlane) => {
          const mesh = lineOrPlane as THREE.Mesh<
            THREE.BoxGeometry,
            THREE.ShaderMaterial
          >;
          mesh.scale.setX(1);

          const { uniforms } = mesh.material;
          waveAmplitudeMag.current.value = 1;
          uniforms.uWaveExpandPower.value = controls.uniforms.uWaveExpandPower;
          uniforms.uWaveExpandAmplitude.value =
            controls.uniforms.uWaveExpandAmplitude;
          uniforms.uWaveSpeed1.value = controls.uniforms.uWaveSpeed1;
          uniforms.uWaveSpeed2.value = controls.uniforms.uWaveSpeed2;
          uniforms.uWaveSpeed3.value = controls.uniforms.uWaveSpeed3;
        });
      });

      // fog
      gsap.set(fog, {
        density: controls.scene.fogDensity / 100,
      });

      // stars
      stars?.position.set(0, -500, 5);
      stars!.visible = false;

      // moon
      moon?.position.set(3.5, -5, 4.5);
      moon!.visible = false;

      // html elements
      const startButton = document.querySelector("#start button");
      startButton?.classList.remove("playing");
      elements.forEach((elementQuery) => {
        const element = document.querySelector(elementQuery);
        element?.removeAttribute("style");
      });
    }
  }, [stage]);
}
