import { OrbitControls } from "@react-three/drei";
import { FC, Suspense } from "react";
import { Perf } from "r3f-perf";

import {
  useCustomControls,
  useDebugPanel,
  useCameraControl,
  useZenMode,
  useUniformControl,
  useLineControl,
  useCursor,
  useWindowSize,
} from "../../hooks";
import Loader from "../Loader/Loader";
import Lines from "../Lines/Lines";
import Audio from "../Audio/Audio";
import Stars from "../Stars/Stars";
import Moon from "../Moon/Moon";

const Scene: FC = () => {
  // check if debug pannel is enabled
  const isDebugPanelEnabled = useDebugPanel();
  const controls = useCustomControls();

  // handle updates from the debug panel
  useUniformControl();
  useCameraControl();
  useLineControl();
  useWindowSize();
  useZenMode();
  useCursor();

  console.log("rendered");

  return (
    <>
      <color args={[controls.scene.fogAndBg]} attach="background" />

      {isDebugPanelEnabled && (
        <Perf position="top-left" showGraph={false} minimal />
      )}

      <OrbitControls enabled={controls.scene.orbitControls} />

      <fogExp2
        attach="fog"
        color={controls.scene.fogAndBg}
        density={controls.scene.fogDensity / 100}
      />

      <Suspense fallback={<Loader />}>
        <Audio />
        <Stars />
        <Moon />
        <Lines />
      </Suspense>
    </>
  );
};

export default Scene;
