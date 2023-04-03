import { createRef, MutableRefObject, RefObject } from "react";
import { create } from "zustand";

export enum Stage {
  Loading = "Loading",
  Zero = "Zero",
  One = "One",
  Two = "Two",
  Three = "Three",
  Four = "Four",
  Five = "Five",
  Reset = "Reset",
}

type StarsRef = THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial> | null;
type MoonRef = THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial> | null;
type AudioRef = THREE.PositionalAudio | null;

export type State = {
  audioAnalyser?: THREE.AudioAnalyser;
  isTrackPlaying: boolean;
  stage: Stage;
  refs: {
    audio: MutableRefObject<AudioRef>;
    lerpFactor: MutableRefObject<{ value: number }>;
    lines: MutableRefObject<THREE.Group>;
    moon: MutableRefObject<MoonRef>;
    pause: MutableRefObject<{ value: boolean }>;
    reverse: MutableRefObject<{ value: boolean }>;
    stars: MutableRefObject<StarsRef>;
    waveAmplitudeMag: MutableRefObject<{ value: number }>;
  };
};

type Actions = {
  setAudioAnalyser: (audioAnalyser: THREE.AudioAnalyser) => void;
  setIsTrackPlaying: (isPlaying: boolean) => void;
  setStage: (stage: Stage) => void;
};

// refs
const lines = createRef<THREE.Group>() as MutableRefObject<THREE.Group>;

const waveAmplitudeMag = createRef<{
  value: number;
}>() as MutableRefObject<{ value: number }>;
waveAmplitudeMag.current = { value: 1 };

const lerpFactor = createRef<{
  value: number;
}>() as MutableRefObject<{ value: number }>;
lerpFactor.current = { value: 0 };

export const pause = createRef<{ value: boolean }>() as MutableRefObject<{
  value: boolean;
}>;
pause.current = { value: false };

export const reverse = createRef<{ value: boolean }>() as MutableRefObject<{
  value: boolean;
}>;
reverse.current = { value: false };

const stars = createRef<StarsRef>() as MutableRefObject<StarsRef>;
stars.current = null;

const moon = createRef<MoonRef>() as MutableRefObject<MoonRef>;
moon.current = null;

const audio = createRef<AudioRef>() as MutableRefObject<AudioRef>;
audio.current = null;

const useStore = create<State & Actions>((set) => ({
  audioAnalyser: undefined, // will be assigned when the audio track is loaded
  isTrackPlaying: false,
  stage: Stage.Loading,
  refs: {
    audio,
    lerpFactor,
    lines,
    moon,
    pause,
    reverse,
    stars,
    waveAmplitudeMag,
  },
  setAudioAnalyser: (audioAnalyser) => set(() => ({ audioAnalyser })),
  setIsTrackPlaying: (isTrackPlaying) => set(() => ({ isTrackPlaying })),
  setStage: (stage) => set(() => ({ stage })),
}));

export default useStore;
