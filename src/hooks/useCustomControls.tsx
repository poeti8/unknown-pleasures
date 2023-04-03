import { useThree } from "@react-three/fiber";
import { useControls } from "leva";

import useStore from "../store";

// animations
function useAnimationControl() {
  const pause = useStore((store) => store.refs.pause);
  const reverse = useStore((store) => store.refs.reverse);

  const animation = useControls(
    "animation",
    {
      pause: {
        value: false,
        onChange: (value) => {
          pause.current.value = value;
        },
      },
      reverse: {
        value: false,
        onChange: (value) => {
          reverse.current.value = value;
        },
      },
    },
    { collapsed: true }
  );

  return animation;
}

// scene
function useSceneControl() {
  const scene = useControls(
    "scene",
    {
      orbitControls: { value: false },
      zenMode: { value: false },
      fogAndBg: {
        value: "#021119",
      },
      fogDensity: {
        min: 0,
        max: 100,
        step: 0.01,
        value: 3.5,
      },
    },
    { collapsed: true }
  );

  return scene;
}

// audio
function useAudioControl() {
  const audio = useControls(
    "audio",
    {
      volume: {
        min: 0,
        max: 1,
        step: 0.01,
        value: 0.5,
      },
    },
    { collapsed: true }
  );

  return audio;
}

// camera
function useCameraControl() {
  const camera = useControls(
    "camera",
    {
      manual: { value: false },
      position: {
        value: {
          x: 0,
          y: 0,
          z: 0,
        },
        x: { step: 0.1 },
        y: { step: 0.1 },
        z: { step: 0.1 },
      },
      rotation: {
        value: {
          x: 0,
          y: 0,
          z: 0,
        },
        x: { step: 0.1 },
        y: { step: 0.1 },
        z: { step: 0.1 },
      },
    },
    { collapsed: true }
  );

  return camera;
}

// line
function useLineControl() {
  const line = useControls(
    "line",
    {
      gap: {
        min: 0.01,
        max: 200,
        step: 0.01,
        value: 0.095,
      },
      scaleX: {
        min: 0,
        max: 10,
        step: 0.001,
        value: 1,
      },
    },
    { collapsed: true }
  );

  return line;
}

// uniforms
function useUniformsControl() {
  const uniforms = useControls(
    "uniforms",
    {
      manual: { value: false },
      uWaveExpandPower: {
        min: -10,
        max: 10,
        step: 0.01,
        value: 3.5,
      },
      uWaveExpandAmplitude: {
        min: -10,
        max: 10,
        step: 0.01,
        value: 1,
      },
      uWaveSpeed1: {
        min: 0,
        max: 1,
        step: 0.01,
        value: 0.02,
      },
      uWaveSpeed2: {
        min: 0,
        max: 1,
        step: 0.01,
        value: 0.01,
      },
      uWaveSpeed3: {
        min: 0,
        max: 5,
        step: 0.01,
        value: 0.05,
      },
    },
    { collapsed: true }
  );

  return uniforms;
}

// stars
function useStarsControl() {
  const stars = useControls(
    "stars",
    {
      position: {
        value: {
          x: 0,
          y: -500,
          z: 5,
        },
        step: 1,
      },
      size: {
        min: 0,
        max: 20,
        step: 0.01,
        value: 4,
      },
      range: {
        value: {
          x: 500,
          y: 500,
          z: 100,
        },
        step: 1,
      },
    },
    { collapsed: true }
  );

  return stars;
}

// moon
function useMoonControls() {
  const moon = useControls(
    "moon",
    {
      uSpeed: {
        value: 3,
        min: 0,
        max: 10,
        step: 0.01,
      },
      uFrequency: {
        value: 3,
        min: 0,
        max: 100,
        step: 0.01,
      },
      uAmplitude: {
        value: 0.3,
        min: 0,
        max: 10,
        step: 0.01,
      },
      maxUAmplitude: {
        value: 1.8,
        min: 0,
        max: 10,
        step: 0.01,
      },
      power: {
        value: 5,
        min: 0,
        max: 10,
        step: 0.01,
      },
    },
    { collapsed: true }
  );

  return moon;
}

// all controls in one place
function useCustomControls() {
  const animation = useAnimationControl();
  const scene = useSceneControl();
  const audio = useAudioControl();
  const camera = useCameraControl();
  const line = useLineControl();
  const uniforms = useUniformsControl();
  const stars = useStarsControl();
  const moon = useMoonControls();

  return {
    animation,
    audio,
    camera,
    line,
    moon,
    scene,
    stars,
    uniforms,
  } as const;
}

export default useCustomControls;
