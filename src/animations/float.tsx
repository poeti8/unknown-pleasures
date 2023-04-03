import { useFrame } from "@react-three/fiber";
import gsap from "gsap";

import { useCustomControls, useIsMobile } from "../hooks";
import useStore, { Stage } from "../store";

// rotate to mouse position, a float-ish effect
export function useFloat() {
  const stage = useStore((store) => store.stage);
  const lines = useStore((store) => store.refs.lines.current);
  const controls = useCustomControls();
  const isMobile = useIsMobile();

  useFrame((frame) => {
    if (!lines) return;

    // do not roate if zen mode is enabled from the debug panel
    const zenMode = controls.scene.zenMode;

    // rotate to mouse position
    if (stage === Stage.Zero && !zenMode) {
      const divider = isMobile ? 4 : 8;
      const zRotation = frame.mouse.x / divider;
      const xRotation = frame.mouse.y / divider;
      gsap.to(lines.rotation, {
        z: zRotation,
        x: xRotation,
        duration: 6,
        ease: "power2.out",
      });
    }

    // reset rotation to 0 when audio starts
    if (stage === Stage.One || zenMode) {
      gsap.to(lines.rotation, {
        z: 0,
        x: 0,
        duration: 1.5,
        ease: "sine.out",
      });
    }
  });
}
