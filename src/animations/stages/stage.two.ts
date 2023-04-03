import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

import { mapLinear, createTimeline, lerp } from "../../utils";
import useStore, { Stage } from "../../store";
import { FrameAnimationProps } from "./types";

// this runs on each frame (60 time per second, hopefully)
export function runFrameAnimations(...props: FrameAnimationProps) {
  const [stage, group, mesh, camera, frequency, lerpFactor] = props;

  // run only when the stage is two
  if (stage !== Stage.Two) return;

  // unifroms
  const uniforms = mesh.material.uniforms;

  // distance to camera
  const distanceToCamera = camera.position.distanceTo(group.position);
  const AFFECTING_DISTANCE = 60;

  // (SCALE) scale up lines that are close to camera based on frequency
  // (SCALE) first, get scale based on frequency,
  // the higher the frequency the bigger the line should get
  const scaleBasedOnFrequency = mapLinear(frequency, 0, 255, 1, 2);

  // (SCALE) then also consider how close they are to the camera,
  // the closer the line, the bigger it gets (limited to frequency scale threshold)
  const scaleBasedOnDistance =
    distanceToCamera <= AFFECTING_DISTANCE
      ? mapLinear(
          distanceToCamera,
          AFFECTING_DISTANCE,
          0,
          1,
          scaleBasedOnFrequency
        )
      : 1;

  const affectiveScale = lerp(1, scaleBasedOnDistance, lerpFactor);
  const scale = lerp(mesh.scale.y, affectiveScale, 0.2);

  // (SCALE) apply a minimun to x scale to stretch lines a certain amount
  // regardless of their frequency or how close they are to the camera
  const scaleX = lerp(
    mesh.scale.x,
    affectiveScale + 2.5,
    lerpFactor === 1 ? 0.1 : 0.007
  );
  mesh.scale.set(scaleX, scale, scale);

  // have to adjust the opaque plane which is under each line
  if (mesh.name === "plane") {
    const height = mesh.geometry.parameters.height;
    mesh.position.y = -((scale * height) / 2);
  }

  // (WAVE) spread the waves (reduce the straight line magnitude) based on the frequency
  const uWaveExpandPower = uniforms.uWaveExpandPower.value;
  const nextUWaveExpandPower = lerp(
    3.5,
    mapLinear(frequency, 0, 255, 6, 3),
    lerpFactor
  );
  uniforms.uWaveExpandPower.value = lerp(
    uWaveExpandPower,
    nextUWaveExpandPower,
    0.1
  );
}

// this runs once the stage is set to two
export function useAnimations() {
  // store
  const stage = useStore((store) => store.stage);
  const setStage = useStore((store) => store.setStage);
  const lines = useStore((store) => store.refs.lines.current);
  const waveAmplitudeMag = useStore((store) => store.refs.waveAmplitudeMag);
  const lerpFactor = useStore((store) => store.refs.lerpFactor.current);
  const pause = useStore((store) => store.refs.pause);
  const reverse = useStore((store) => store.refs.reverse);

  // scene
  const fog = useThree((state) => state.scene.fog);
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    // only run when the stage is two
    if (stage !== Stage.Two) return;

    // duration of the first animation, "line explosion"
    const duration = 3;
    // duration for surfing camera above the lines
    const surfingDuration = 14;

    setTimeout(() => {
      lines.children.forEach((group) => {
        group.children.forEach((lineOrPlane) => {
          const { uniforms } = (
            lineOrPlane as THREE.Mesh<THREE.BoxGeometry, THREE.ShaderMaterial>
          ).material;
          uniforms.uWaveSpeed1.value = 0.05;
          uniforms.uWaveSpeed2.value = 0.06;
          uniforms.uWaveSpeed3.value = 0.3;
        });
      });
    }, 500);

    const linesCount = lines.children.length;

    // (LINE) increase the gap between the lines and add a uphill slope
    const gap = 3.3;
    lines.children.forEach((group, index) => {
      const reversedIndex = linesCount - index - 1;
      const normalizedReversedIndex = reversedIndex / (linesCount - 1);

      const timeline = createTimeline(pause, reverse);

      // add gap between the lines, move them toward the camera
      timeline.to(
        group.position,
        {
          z: -1 * index * gap,
          duration,
          delay: Math.pow(normalizedReversedIndex, 2) * 0.4,
          ease: "power1.inOut",
        },
        0
      );

      // increase the amplitude of waves
      timeline.to(
        waveAmplitudeMag.current,
        {
          value: 3,
          duration,
          ease: "power1.out",
        },
        "<"
      );

      // update lerp factor to gradually update line properties on each frame
      timeline.to(
        lerpFactor,
        {
          value: 1,
          duration,
          ease: "sine.in",
        },
        "<"
      );

      // uphill slope
      timeline.to(
        group.position,
        {
          x: -Math.pow(normalizedReversedIndex * 6, 2) * 1.88,
          y: Math.pow(normalizedReversedIndex * 4.5, 2) * 1.88,
          delay: index * 0.01,
          duration: duration / 2,
          ease: "power1.inOut",
        },
        "<50%"
      );

      // bring lines down from up to ground
      timeline.to(group.position, {
        x: 0,
        y: 0,
        duration: mapLinear(
          reversedIndex,
          0,
          linesCount - 1,
          duration,
          surfingDuration * 0.45
        ),
        delay: Math.pow(normalizedReversedIndex, 2) * surfingDuration * 0.01,
        ease: "power1.inOut",
      });
    });

    // (SCENE) move it to end of the line the same time lines expand
    // then move it hover over the lines
    const timeline = createTimeline(pause, reverse, {
      onUpdate: () => {
        const progress = timeline.totalProgress();
        if (progress >= 0.6 && stage === Stage.Two) {
          // set to stage three
          setStage(Stage.Three);

          // stop current animations in stage two
          const animations = timeline.getChildren();
          animations.forEach((animation) => {
            animation.kill();
          });
        }
      },
    });

    timeline
      // increase fog
      .to(fog, {
        density: 0.008,
        duration,
        ease: "power1.inOut",
      });

    // first part: the expansion of lines
    timeline.to(
      camera.rotation,
      {
        x: -Math.PI - 0.4,
        y: -0.1,
        z: -Math.PI - 0.1,
        duration,
        ease: "power1.inOut",
      },
      "<"
    );

    timeline.to(
      camera.position,
      {
        y: 0.5,
        x: -3,
        duration,
        ease: "power1.inOut",
      },
      "<"
    );

    timeline.to(
      camera.rotation,
      {
        x: -Math.PI,
        y: 0,
        z: -Math.PI,
        duration: duration / 2,
        ease: "power1.inOut",
      },
      "<55%"
    );

    timeline.to(
      camera.position,
      {
        z: -1 * (gap * linesCount + gap * 3),
        duration,
        ease: "power1.inOut",
      },
      "-=95%"
    );

    timeline.to(
      camera.position,
      {
        x: -1,
        y: 3.5,
        duration: duration / 2,
        ease: "power1.inOut",
      },
      "<55%"
    );

    // second part: surfing above the lines
    timeline.to(camera.position, {
      z: 0,
      duration: surfingDuration,
      ease: "power1.out",
    });

    timeline.to(
      camera.position,
      {
        x: 7.5,
        y: 2.7,
        duration: surfingDuration,
        ease: "power1.out",
      },
      "<1"
    );

    timeline.to(
      camera.rotation,
      {
        x: -3.2,
        y: 0.25,
        duration: surfingDuration,
        ease: "power1.out",
      },
      "<"
    );
  }, [stage]);
}
