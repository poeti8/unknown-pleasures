import { useFrame, useThree } from "@react-three/fiber";
import { PositionalAudio } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { useCustomControls } from "../../hooks";
import trackPath from "../../assets/track.mp3";
import useStore, { Stage } from "../../store";

function Audio() {
  // controls
  const controls = useCustomControls();

  // store
  const setStage = useStore((store) => store.setStage);
  const setAudioAnalyser = useStore((store) => store.setAudioAnalyser);
  const audioRef = useStore((store) => store.refs.audio);

  // scene
  const camera = useThree((context) => context.camera);

  // refs
  const audioAnalyserRef = useRef<THREE.AudioAnalyser | undefined>();

  // when this compoenent load it means loading has finished
  // so should set stage to zero
  useEffect(() => {
    setStage(Stage.Zero);
  }, []);

  // set audio analyser
  useEffect(() => {
    if (!audioRef.current) return;

    audioAnalyserRef.current = new THREE.AudioAnalyser(audioRef.current, 512);
    setAudioAnalyser(audioAnalyserRef.current);
  }, [audioRef.current]);

  // position audio in front of the camera on each frame
  // because I'm using positional audio and if camera rotates the sound might come out only from one speaker
  // and because I didn't manage to make anything other than postional audio to work
  useFrame(() => {
    if (!audioRef.current) return;
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.multiplyScalar(20);
    direction.add(camera.position);
    audioRef.current.position.set(direction.x, direction.y, direction.z);
  });

  // set volume from debug control
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current?.setVolume(controls.audio.volume);
  }, [controls.audio.volume]);

  return <PositionalAudio ref={audioRef} distance={10000000} url={trackPath} />;
}

export default Audio;
